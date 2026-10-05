#!/usr/bin/env node
/**
 * CONTENT-REACHABILITY-GESAMTKARTE — „Desinformation Network" (Story-Mode, 40-Tage-Kampagne)
 * ==========================================================================================
 * Pures Node-Skript (keine TS-Imports): baut die Erreichbarkeits-Regeln der Engine als
 * datengetriebene Checks nach und beurteilt JEDES autorierte Content-Objekt:
 *
 *   erreichbar | tot | unsicher   + Grund-Code + Code-Fundstelle (file:line)
 *
 * Kernzahl: „X % der geschriebenen Wörter sind unerreichbar" (nur spielersichtbare
 * DE-Textfelder: *_de, plus bekannte Klartext-Felder wie npcs.json-dialogues).
 *
 * Regel-Quellen (aus dem Code abgeleitet, nicht geraten) — zentrale Fundstellen:
 *  - ActionLoader.ts:153-158 (initial unlock), 271-300 (prerequisites/unlock-Closure)
 *  - StoryEngineAdapter.ts:876 (CAMPAIGN_DAYS_DEFAULT=40), 4970-4977 (Nachspielzeit +5,
 *    einmalig), 4419-4421 (shiftElectionDay-Klemme ≤60, einziger +Aufrufer ist die
 *    Nachspielzeit) → MAX erreichbarer Kampagnentag = 45.
 *  - ConsequenceSystem.ts:204-226 (per_use_increase fehlt → NaN-Wahrscheinlichkeit →
 *    Konsequenz feuert NIE), 164-168 (triggered_by wird als AKTIONS-ID indexiert)
 *  - DialogLoader.ts:389-412 (Briefing-Stufen 48/96), 417-446 (Reaktions-Tags+Bedingung),
 *    522-555 (Legacy-Bedingungs-Grammatik: NUR >, <, ==, bool — KEIN >=),
 *    995-1006 (Topic-Filter: phase_range/condition/npc)
 *  - StoryEngineAdapter.ts:3061-3129 (World-Event-Trigger-Switch), 3133-3223 +
 *    3230-3320 (gelesene Effekt-Schlüssel), 1014-1041 (einzige Objective-Kategorien)
 *  - StoryEngineAdapter.ts:4994-4998 (Stufen-Gegenmaßnahmen cm24/cm05/cm22),
 *    7219-7241 (checkForCountermeasures: KEIN Aufrufer im ganzen src/)
 *  - StoryEngineAdapter.ts:6744-6758 (assembledEndingForBranch: Kategorie wird auf
 *    victory|exposure GEZWUNGEN), EndingSystem.ts:505-543/545-570/572-590/819-838/844-898
 *  - useStoryGameState.ts:786 (Topic nur Layer 'intro'), 833/1480 (Greeting),
 *    268-286 (recommendation_reactions direkt aus JSON) — die EINZIGEN Dialog-Einstiege
 *  - terminalCuration.ts:1-13: Kuratierung ist NUR Anzeige-Filter (ARCHIV zeigt alles)
 *    → Aktionen werden dadurch NICHT unerreichbar.
 *
 * Ausgabe: runs/verify-suite/content-reachability.json (vollständig)
 *          runs/verify-suite/content-reachability.md   (Bericht)
 *
 * Aufruf:  node scripts/verify-suite/content-reachability.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const DATA = path.join(ROOT, 'src', 'story-mode', 'data');
const OUT_DIR = path.join(ROOT, 'runs', 'verify-suite');

// ─────────────────────────────────────────────────────────────────────────────
// Spiel-Konstanten, aus dem Code abgeleitet (Fundstellen zitiert)
// ─────────────────────────────────────────────────────────────────────────────
const RULES = {
  MAX_DAY: 45, // StoryEngineAdapter.ts:876 (40) + 4970-4977 (Nachspielzeit einmalig +5); 4419-4421 klemmt ≤60, aber es existiert kein weiterer +Aufrufer
  START_BUDGET: 150, // StoryEngineAdapter.ts:943 (Budget in Tausend €)
  MAX_PLAUSIBLE_BUDGET: 1000, // Tranchen-Ökonomie (E18) — Größenordnung wenige Hundert; 7000 ist eine andere Skala
  MAX_CAPACITY: 5, // StoryEngineAdapter.ts:944
  ACTION_POINTS_PER_PHASE: 5, // StoryEngineAdapter.ts:878
  MAX_RELATIONSHIP_LEVEL: 3, // StoryEngineAdapter.ts:5889
  OBJECTIVE_CATEGORIES: ['trust_reduction', 'survival'], // StoryEngineAdapter.ts:1024,1037 — die EINZIGEN existierenden
  EXPOSED_RISK: 85, // VictorySystem.ts:37
  STAGE_COUNTERMEASURES: ['cm24', 'cm05', 'cm22'], // StoryEngineAdapter.ts:4994-4998
  WORLD_EVENT_TRIGGER_TYPES: ['phase', 'random', 'risk_threshold', 'attention_threshold', 'objective_progress', 'relationship_threshold', 'event_cascade'], // StoryEngineAdapter.ts:3077-3129 + 2971-3036
  // applyWorldEventEffects (3133-3223) + createOpportunityWindowsFromEvent (3230-3320): gelesene Effekt-Schlüssel
  WORLD_EFFECT_KEYS_READ: new Set([
    'budget_increase', 'risk_increase', 'attention_increase', 'polarization_boost',
    'trust_media_change', 'trust_government_change', 'westunion_cohesion_damage', 'westunion_division',
    // Regional-Liste (3188-3192)
    'regional_anxiety', 'regional_discontent', 'regional_unrest', 'regional_nationalism',
    'ethnic_tension', 'economic_discontent', 'separatism_boost', 'internal_division',
    'political_instability', 'historical_division', 'populist_boost',
    // Opportunity-Mappings (3238-3320)
    'opportunity_window', 'election_interference_window', 'content_effectiveness_boost',
    'social_actions_effectiveness', 'economic_actions_cost_reduction', 'economic_anxiety', 'financial_panic',
    'extremism_window', 'political_chaos_boost', 'migration_debate_boost', 'migration_narrative_boost',
    'anti_westunion_boost', 'anti_westunion_narrative_boost', 'sovereignty_narrative_boost',
    'security_tension', 'military_tension_boost', 'fear_narrative_boost',
    'generational_divide', 'social_division', 'culture_war_boost',
  ]),
  // Kontext, den die LIVE-Reaktions-Pfade an DialogLoader.getReaction übergeben
  // (StoryEngineAdapter.ts:5847-5851 und 7132-7136): nur diese Variablen existieren.
  REACTION_CONDITION_VARS: ['risk', 'morale', 'moral_weight'],
  // DialogueContext-Variablen für Topic-Bedingungen (StoryEngineAdapter.ts:6542-6561)
  TOPIC_CONTEXT_VARS: ['phase', 'risk', 'morale', 'budget', 'attention', 'capacity', 'relationshipLevel', 'tags', 'memoryTags', 'npcName', 'inCrisis', 'objectiveProgress', 'year', 'availableActionsCount'],
};

// Dialog-Einstiegspunkte: WELCHE Pfade die Live-UI überhaupt aufruft.
// Belegt per Aufrufer-Suche über src/ (nur Nicht-Test-Code):
const ENTRY_POINTS = {
  greeting: { live: true, evidence: 'useStoryGameState.ts:833,1480 → StoryEngineAdapter.ts:6444-6466' },
  topic_intro: { live: true, evidence: 'useStoryGameState.ts:786 (kein layer-Parameter) → StoryEngineAdapter.ts:6501 (Default intro)' },
  topic_deep_options: { live: false, evidence: 'kein Aufrufer übergibt layer deep/options (nur __tests__); StoryEngineAdapter.ts:6501' },
  topic_responses: { live: false, evidence: 'useStoryGameState.ts:820-822 baut eigene Choices (back_to_npc); DialogueResponse-Texte werden nie gerendert' },
  reaction: { live: true, evidence: 'StoryEngineAdapter.ts:5840-5863 (processNPCReactions mit echten action.tags, seit Fix 2026-05-31)' },
  briefing: { live: false, evidence: 'StoryEngineAdapter.ts:7117 getNPCBriefing — kein Aufrufer in src/ (UI: MorningBriefing.tsx nutzt directorStore)' },
  crisis: { live: false, evidence: 'StoryEngineAdapter.ts:7149 getNPCCrisisDialogue — kein Aufrufer in src/' },
  ambient: { live: false, evidence: 'DialogLoader.ts:468 getAmbientDialogue — kein Aufrufer in src/ (auch nicht im Adapter)' },
  first_meeting: { live: false, evidence: 'StoryEngineAdapter.ts:7171 getNPCFirstMeeting — kein Aufrufer in src/' },
  game_end: { live: false, evidence: 'StoryEngineAdapter.ts:7179 getNPCGameEndDialogue — kein Aufrufer in src/' },
  recommendation_reactions: { live: true, evidence: 'useStoryGameState.ts:268-286 (liest special_dialogues.recommendation_reactions direkt)' },
  debate: { live: false, evidence: 'DialogLoader.ts:1154 getDebate — Aufrufer nur StoryEngineAdapter.ts:6625 getDebate, das wiederum keine UI aufruft (nur __tests__)' },
  countermeasure_reactive: { live: false, evidence: 'StoryEngineAdapter.ts:7219 checkForCountermeasures — kein Aufrufer in src/; nur Stufen-Pfad 4994-4998 feuert' },
  ending_titles: { live: false, evidence: 'StoryModeGame.tsx:966-972 reicht nur category/tone/narrative/replayHints an EndReport — title_de aus ENDING_TITLES wird nie angezeigt' },
};

// ─────────────────────────────────────────────────────────────────────────────
// Helfer
// ─────────────────────────────────────────────────────────────────────────────
const loadJSON = (f) => JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8'));
const readSrc = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

/** Wörter eines deutschen Textes. */
const words = (s) => (typeof s === 'string' && s.trim() ? s.trim().split(/\s+/).length : 0);
const chars = (s) => (typeof s === 'string' ? s.length : 0);

/** Zählt alle *_de-Felder (rekursiv) + optionale Zusatz-Schlüssel mit Klartext. */
function countDeText(obj, extraKeys = []) {
  let w = 0, c = 0;
  const walk = (o) => {
    if (o == null) return;
    if (Array.isArray(o)) return o.forEach(walk);
    if (typeof o === 'object') {
      for (const [k, v] of Object.entries(o)) {
        if (typeof v === 'string' && (k.endsWith('_de') || extraKeys.includes(k))) {
          w += words(v); c += chars(v);
        } else {
          walk(v);
        }
      }
    }
  };
  walk(obj);
  return { words: w, chars: c };
}

/** Zählt ALLE String-Werte eines Objekts (für Klartext-Blöcke wie npcs.json dialogues). */
function countAllStrings(obj) {
  let w = 0, c = 0;
  const walk = (o) => {
    if (o == null) return;
    if (typeof o === 'string') { w += words(o); c += chars(o); return; }
    if (Array.isArray(o)) return o.forEach(walk);
    if (typeof o === 'object') Object.values(o).forEach(walk);
  };
  walk(obj);
  return { words: w, chars: c };
}

/** TS-Literal aus einer Quelldatei extrahieren und als JS auswerten (nur reine Literale). */
function extractLiteral(src, startMarker, open = '{') {
  const i = src.indexOf(startMarker);
  if (i < 0) throw new Error(`Marker nicht gefunden: ${startMarker}`);
  const eq = src.indexOf('=', i);
  const startBrace = src.indexOf(open, eq);
  const close = open === '{' ? '}' : ']';
  let depth = 0, j = startBrace, inStr = null;
  for (; j < src.length; j++) {
    const ch = src[j];
    if (inStr) {
      if (ch === '\\') { j++; continue; }
      if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') { inStr = ch; continue; }
    if (ch === open) depth++;
    else if (ch === close) { depth--; if (depth === 0) break; }
  }
  const literal = src.slice(startBrace, j + 1);
  // eslint-disable-next-line no-new-func
  return new Function(`return (${literal});`)();
}

// Ergebnis-Sammlung
const objects = [];
function record(file, kind, id, verdict, reasonCode, reason, evidence, textCount) {
  objects.push({ file, kind, id, verdict, reasonCode, reason, evidence, words: textCount.words, chars: textCount.chars });
}

// ─────────────────────────────────────────────────────────────────────────────
// (a) AKTIONEN — Freischalt-Closure, Referenzen, Leistbarkeit
//     ActionLoader.ts:126-159 (Laden aller 4 Dateien), 153-158 (ohne prerequisites
//     initial frei), 271-300 (Freischaltung, wenn ALLE prerequisites benutzt wurden).
//     Kuratierung (terminalCuration.ts:1-13) ist reine Anzeige → zählt NICHT als Gate.
// ─────────────────────────────────────────────────────────────────────────────
const actionsFiles = {
  'actions.json': (d) => d.actions ?? [],
  'actions_continued.json': (d) => ['actions_phase3', 'actions_phase4', 'actions_phase5', 'actions_phase6_politics', 'actions_phase7_society', 'actions_phase8_targeting'].flatMap((k) => d[k] ?? []),
  'actions_p1c.json': (d) => d.actions_p1c ?? [],
  'actions_p3_phenomena.json': (d) => d.actions_p3_phenomena ?? [],
};
const allActions = [];
const actionSourceFile = new Map();
for (const [file, pick] of Object.entries(actionsFiles)) {
  for (const a of pick(loadJSON(file))) {
    allActions.push(a);
    actionSourceFile.set(a.id, file);
  }
}
const actionIds = new Set(allActions.map((a) => a.id));
const allActionTags = new Set(allActions.flatMap((a) => a.tags ?? []));

// Unlock-Closure (Fixpunkt): erreichbar = prerequisites transitiv erfüllbar
const unlockable = new Set(allActions.filter((a) => !a.prerequisites?.length).map((a) => a.id));
let grew = true;
while (grew) {
  grew = false;
  for (const a of allActions) {
    if (unlockable.has(a.id)) continue;
    if ((a.prerequisites ?? []).every((p) => unlockable.has(p))) { unlockable.add(a.id); grew = true; }
  }
}

for (const a of allActions) {
  const file = actionSourceFile.get(a.id);
  const txt = countDeText(a);
  const deadPre = (a.prerequisites ?? []).filter((p) => !actionIds.has(p));
  const deadUnlock = (a.unlocks ?? []).filter((u) => !actionIds.has(u));
  if (deadPre.length) {
    record(file, 'action', a.id, 'tot', 'dead_prerequisite', `Voraussetzung(en) ${deadPre.join(',')} existieren nicht`, 'ActionLoader.ts:271-280', txt);
  } else if (!unlockable.has(a.id)) {
    record(file, 'action', a.id, 'tot', 'unlock_cycle', 'Freischalt-Kette nicht auflösbar (Zyklus/Sackgasse)', 'ActionLoader.ts:271-300', txt);
  } else if ((a.costs?.capacity ?? 0) > RULES.MAX_CAPACITY) {
    record(file, 'action', a.id, 'tot', 'unaffordable_capacity', `Kapazitätskosten ${a.costs.capacity} > Max ${RULES.MAX_CAPACITY}`, 'StoryEngineAdapter.ts:944; ActionLoader.ts:327-329', txt);
  } else if ((a.costs?.budget ?? 0) > RULES.MAX_PLAUSIBLE_BUDGET) {
    record(file, 'action', a.id, 'unsicher', 'unaffordable_budget', `Budgetkosten ${a.costs.budget} über plausiblem Maximum`, 'StoryEngineAdapter.ts:943', txt);
  } else {
    const note = deadUnlock.length ? ` (Hinweis: unlocks→${deadUnlock.join(',')} existieren nicht)` : '';
    record(file, 'action', a.id, 'erreichbar', 'ok', `freischaltbar; Legalität=${a.legality}${note}`, 'ActionLoader.ts:153-158,271-300; terminalCuration.ts:1-13 (Archiv zeigt alles)', txt);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// (e) WORLD-EVENTS — zuerst, weil Episoden (b) auf Event-Erreichbarkeit aufbauen
// ─────────────────────────────────────────────────────────────────────────────
const worldEventsData = loadJSON('world-events.json');
const worldEvents = worldEventsData.worldEvents ?? [];
const eventById = new Map(worldEvents.map((e) => [e.id, e]));
const eventVerdicts = new Map();

function evalWorldEvent(e, stack = new Set()) {
  if (eventVerdicts.has(e.id)) return eventVerdicts.get(e.id);
  if (stack.has(e.id)) return { verdict: 'tot', code: 'cascade_cycle', reason: 'Kaskaden-Zyklus' };
  stack.add(e.id);
  const t = e.trigger;
  let v;
  if (!t) {
    v = { verdict: 'tot', code: 'no_trigger', reason: 'kein trigger definiert → shouldTriggerWorldEvent liefert false', evidence: 'StoryEngineAdapter.ts:3062-3063' };
  } else if (!RULES.WORLD_EVENT_TRIGGER_TYPES.includes(t.type)) {
    v = { verdict: 'tot', code: 'unknown_trigger_type', reason: `Trigger-Typ „${t.type}" wird vom Switch nicht behandelt`, evidence: 'StoryEngineAdapter.ts:3077-3129 (default: false)' };
  } else if (t.type === 'phase') {
    const pn = t.conditions?.phaseNumber, pm = t.conditions?.phaseMultiple;
    if (pn && pn > RULES.MAX_DAY) v = { verdict: 'tot', code: 'phase_gate', reason: `phaseNumber ${pn} > max Tag ${RULES.MAX_DAY}`, evidence: 'StoryEngineAdapter.ts:3080-3082,876' };
    else if (!pn && pm && pm > RULES.MAX_DAY) v = { verdict: 'tot', code: 'phase_gate', reason: `phaseMultiple ${pm} > max Tag ${RULES.MAX_DAY}`, evidence: 'StoryEngineAdapter.ts:3084-3086,876' };
    else v = { verdict: 'erreichbar', code: 'ok', reason: `Phasen-Trigger (${pn ? 'Tag ' + pn : 'alle ' + pm + ' Tage'})`, evidence: 'StoryEngineAdapter.ts:3078-3087' };
  } else if (t.type === 'random') {
    const mp = t.conditions?.minPhase ?? 0;
    if (mp > RULES.MAX_DAY) v = { verdict: 'tot', code: 'phase_gate', reason: `minPhase ${mp} > max Tag ${RULES.MAX_DAY}`, evidence: 'StoryEngineAdapter.ts:3089-3094,876' };
    else v = { verdict: 'erreichbar', code: 'ok', reason: `Zufalls-Trigger ab Tag ${mp}`, evidence: 'StoryEngineAdapter.ts:3089-3094' };
  } else if (t.type === 'objective_progress') {
    const obj = t.conditions?.objective;
    if (!RULES.OBJECTIVE_CATEGORIES.includes(obj)) {
      v = { verdict: 'tot', code: 'dead_objective_ref', reason: `Objective-Kategorie „${obj}" existiert nicht (nur ${RULES.OBJECTIVE_CATEGORIES.join('/')})`, evidence: 'StoryEngineAdapter.ts:3110-3116 vs. 1024,1037' };
    } else {
      v = { verdict: 'erreichbar', code: 'ok', reason: `objective_progress auf „${obj}"`, evidence: 'StoryEngineAdapter.ts:3110-3116' };
    }
  } else if (t.type === 'event_cascade') {
    const parentId = t.conditions?.parentEvent;
    const parent = parentId && eventById.get(parentId);
    if (!parent) v = { verdict: 'tot', code: 'dead_cascade_parent', reason: `parentEvent „${parentId}" existiert nicht`, evidence: 'StoryEngineAdapter.ts:3010-3018' };
    else {
      const pv = evalWorldEvent(parent, stack);
      if (pv.verdict === 'tot') v = { verdict: 'tot', code: 'dead_cascade_parent', reason: `Eltern-Event „${parentId}" ist selbst tot (${pv.code})`, evidence: 'StoryEngineAdapter.ts:3006-3036' };
      else v = { verdict: pv.verdict, code: 'ok', reason: `Kaskade von „${parentId}"`, evidence: 'StoryEngineAdapter.ts:3006-3036' };
    }
  } else {
    v = { verdict: 'erreichbar', code: 'ok', reason: `${t.type}-Trigger`, evidence: 'StoryEngineAdapter.ts:3096-3125' };
  }
  stack.delete(e.id);
  eventVerdicts.set(e.id, v);
  return v;
}

const deadEffectFieldNotes = [];
for (const e of worldEvents) {
  const v = evalWorldEvent(e);
  const txt = countDeText(e);
  const unreadKeys = Object.keys(e.effects ?? {}).filter((k) => !RULES.WORLD_EFFECT_KEYS_READ.has(k));
  let reason = v.reason;
  if (unreadKeys.length) {
    reason += ` · UNGELESENE Effekt-Felder: ${unreadKeys.join(',')}`;
    deadEffectFieldNotes.push({ event: e.id, keys: unreadKeys });
  }
  record('world-events.json', 'world_event', e.id, v.verdict, v.code, reason, v.evidence ?? '', txt);
}

// ─────────────────────────────────────────────────────────────────────────────
// (b) EPISODEN — Auslöser erfüllbar? Einklink-Aktionen erreichbar? (EpisodeLoader.ts:64-85,
//     Angebot: StoryEngineAdapter.ts:4105-4112 über anbieter_npc-Dialog; Abschluss:
//     useStoryGameState.ts:1252-1268 wenn alle einklink_aktionen gespielt)
// ─────────────────────────────────────────────────────────────────────────────
const episodes = loadJSON('episodes.json').episodes ?? [];
const npcIds = new Set((loadJSON('npcs.json').npcs ?? []).map((n) => n.id));
const methodIds = new Set((loadJSON('disinfo_methods.json').methods ?? []).map((m) => m.id));
const SOCIETY_KEYS = ['polarisierung', 'informationslast', 'zynismus', 'fragmentierung', 'diskursqualitaet', 'wehrhaftigkeit', 'reformfaehigkeit', 'fraktionsstaerke', 'vertrauen'];

for (const ep of episodes) {
  const txt = countDeText(ep);
  const problems = [];
  const notes = [];
  // Einklink-Aktionen
  const missing = (ep.einklink_aktionen ?? []).filter((a) => !actionIds.has(a));
  const locked = (ep.einklink_aktionen ?? []).filter((a) => actionIds.has(a) && !unlockable.has(a));
  if (missing.length) problems.push(`einklink_aktionen fehlen: ${missing.join(',')}`);
  if (locked.length) problems.push(`einklink_aktionen nie freischaltbar: ${locked.join(',')}`);
  // Anbieter (Angebot läuft über den NPC-Dialog)
  if (ep.beteiligte?.anbieter_npc && !npcIds.has(ep.beteiligte.anbieter_npc)) problems.push(`anbieter_npc „${ep.beteiligte.anbieter_npc}" existiert nicht`);
  // Lernmoment
  if (ep.lernmoment_id && !methodIds.has(ep.lernmoment_id)) problems.push(`lernmoment_id „${ep.lernmoment_id}" existiert nicht`);
  // Auslöser: anyOf — EINE erfüllbare Bedingung genügt (EpisodeLoader.ts:81-85)
  const conds = ep.ausloeser?.anyOf ?? [];
  let anySat = conds.length === 0; // ohne Auslöser = immer
  for (const c of conds) {
    if (c.always) { anySat = true; continue; }
    if (c.worldEvent) {
      const evV = eventById.has(c.worldEvent) ? evalWorldEvent(eventById.get(c.worldEvent)) : null;
      if (!evV) notes.push(`worldEvent „${c.worldEvent}" existiert nicht`);
      else if (evV.verdict === 'tot') notes.push(`worldEvent „${c.worldEvent}" ist tot (${evV.code})`);
      else anySat = true;
      continue;
    }
    if (c.wert && c.op && typeof c.v === 'number') {
      if (!SOCIETY_KEYS.includes(c.wert)) { notes.push(`Wert „${c.wert}" unbekannt`); continue; }
      // Gesellschaftswerte + vertrauen bewegen sich in [0,100] → jede Schwelle in [0,100] erfüllbar
      if (c.v >= 0 && c.v <= 100) anySat = true;
      else notes.push(`Schwelle ${c.wert} ${c.op} ${c.v} außerhalb [0,100]`);
    }
  }
  if (!anySat) problems.push(`kein Auslöser erfüllbar (${notes.join('; ')})`);
  if (problems.length) {
    record('episodes.json', 'episode', ep.id, 'tot', 'episode_unreachable', problems.join(' · '), 'EpisodeLoader.ts:64-85; StoryEngineAdapter.ts:4105-4112', txt);
  } else {
    const noteStr = notes.length ? ` (Hinweis: ${notes.join('; ')})` : '';
    record('episodes.json', 'episode', ep.id, 'erreichbar', 'ok', `Auslöser erfüllbar, Einklink-Aktionen erreichbar${noteStr}`, 'EpisodeLoader.ts:64-85; useStoryGameState.ts:1252-1268', txt);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// (d) KONSEQUENZEN — NaN-Klasse (H-01), tote Trigger, chain_trigger-Nutzung
//     ConsequenceSystem.ts:204-226: probability = min(base+0.15 + (n-1)*(per_use*1.5), max)
//     per_use_increase fehlt → undefined*1.5 = NaN → (n-1)*NaN = NaN (auch 0*NaN!) →
//     roll < NaN ist IMMER false → Konsequenz feuert nie.
//     Trigger-Index NUR über Aktions-IDs (164-168, onActionExecuted 181-249);
//     Konsequenz-IDs in triggered_by feuern nur via effects_if_ignored.chain_trigger
//     (StoryEngineAdapter.ts:2553-2559) — das nutzt KEIN Datensatz.
// ─────────────────────────────────────────────────────────────────────────────
const consequencesData = loadJSON('consequences.json').consequences ?? [];
const consequenceIds = new Set(consequencesData.map((c) => c.id));
let chainTriggerUses = 0;

for (const c of consequencesData) {
  const txt = countDeText(c);
  const perUseMissing = typeof c.probability?.per_use_increase !== 'number';
  const baseMissing = typeof c.probability?.base !== 'number';
  const actionTriggers = (c.triggered_by ?? []).filter((t) => actionIds.has(t));
  const consequenceTriggers = (c.triggered_by ?? []).filter((t) => consequenceIds.has(t));
  const phantomTriggers = (c.triggered_by ?? []).filter((t) => !actionIds.has(t) && !consequenceIds.has(t));
  if (c.effects_if_ignored?.chain_trigger) chainTriggerUses++;

  if (perUseMissing || baseMissing) {
    record('consequences.json', 'consequence', c.id, 'tot', 'nan_probability',
      `probability.${perUseMissing ? 'per_use_increase' : 'base'} fehlt → NaN → roll<NaN immer false (H-01)`,
      'ConsequenceSystem.ts:204-226', txt);
  } else if (actionTriggers.length === 0) {
    const detail = consequenceTriggers.length
      ? `triggered_by verweist nur auf Konsequenz-IDs (${consequenceTriggers.join(',')}) — Index kennt nur Aktions-IDs, chain_trigger wird von keinem Datensatz gesetzt`
      : `triggered_by enthält keine existierende Aktions-ID (${phantomTriggers.join(',')})`;
    record('consequences.json', 'consequence', c.id, 'tot', 'dead_trigger', detail, 'ConsequenceSystem.ts:164-168,181-249; StoryEngineAdapter.ts:2553-2559', txt);
  } else {
    const note = phantomTriggers.length || consequenceTriggers.length
      ? ` (tote Zusatz-Trigger: ${[...phantomTriggers, ...consequenceTriggers].join(',')})` : '';
    record('consequences.json', 'consequence', c.id, 'erreichbar', 'ok',
      `feuert über Aktionen ${actionTriggers.join(',')}${note}`, 'ConsequenceSystem.ts:181-249', txt);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// (g) COUNTERMEASURES — nur die Stufen-Pfade 25/50/75 feuern (cm24/cm05/cm22);
//     der reaktive Pfad checkForCountermeasures hat KEINEN Aufrufer.
// ─────────────────────────────────────────────────────────────────────────────
const cmData = loadJSON('countermeasures.json');
for (const cm of cmData.countermeasures ?? []) {
  const optTxt = countDeText({ counter_options: cm.counter_options });
  const ownTxt = countDeText({ ...cm, counter_options: undefined });
  if (RULES.STAGE_COUNTERMEASURES.includes(cm.id)) {
    const stage = { cm24: 25, cm05: 50, cm22: 75 }[cm.id];
    record('countermeasures.json', 'countermeasure', cm.id, 'erreichbar', 'ok',
      `feuert kuratiert an Abwehr-Stufe ${stage} (label/narrative im Stufen-Modal sichtbar)`,
      'StoryEngineAdapter.ts:4994-4998,5012-5041; StageCountermeasureModal.tsx:53,61', ownTxt);
    // counter_options des Stufen-Trios werden trotzdem nie gerendert (Modal nutzt eigene Optionen)
    record('countermeasures.json', 'cm_counter_options', `${cm.id}#counter_options`, 'tot', 'options_never_rendered',
      'Stufen-Modal zeigt eigene Optionen (kontern/aussitzen/ablenken) — counter_options ungenutzt',
      'StoryEngineAdapter.ts:5020-5039; StageCountermeasureModal.tsx:81', optTxt);
  } else {
    record('countermeasures.json', 'countermeasure', cm.id, 'tot', 'reactive_path_never_called',
      `Trigger-Typ ${cm.trigger?.type} nur über checkForCountermeasures erreichbar — ohne Aufrufer`,
      ENTRY_POINTS.countermeasure_reactive.evidence, { words: ownTxt.words + optTxt.words, chars: ownTxt.chars + optTxt.chars });
  }
}
if (cmData.event_chains) {
  record('countermeasures.json', 'cm_event_chains', 'event_chains', 'tot', 'field_never_read',
    'event_chains-Block wird von keinem Code gelesen', 'grep über src/: keine Treffer', countDeText(cmData.event_chains));
}

// ─────────────────────────────────────────────────────────────────────────────
// (c) DIALOGE — dialogues.json
// ─────────────────────────────────────────────────────────────────────────────
const dialoguesData = loadJSON('dialogues.json');

/** Legacy-Bedingungs-Grammatik nachgebaut (DialogLoader.ts:522-555). */
function legacyConditionSatisfiable(cond, availableVars) {
  if (typeof cond !== 'string') return { sat: true, why: 'JSON-Condition (separat geprüft)' };
  let m;
  if ((m = cond.match(/^(\w+)\s*>\s*(\d+)$/))) {
    const [, v, n] = m;
    if (!availableVars.includes(v)) return { sat: false, why: `Variable „${v}" nie im Kontext` };
    return { sat: Number(n) < 100 || v === 'moral_weight', why: `${v} > ${n}` };
  }
  if ((m = cond.match(/^(\w+)\s*<\s*(\d+)$/))) {
    const [, v, n] = m;
    if (!availableVars.includes(v)) return { sat: false, why: `Variable „${v}" nie im Kontext` };
    return { sat: Number(n) > 0, why: `${v} < ${n}` };
  }
  if ((m = cond.match(/^(\w+)\s*==\s*(.+)$/))) {
    const [, v] = m;
    if (!availableVars.includes(v)) return { sat: false, why: `Variable „${v}" nie im Kontext` };
    return { sat: true, why: cond };
  }
  // '>='/'<='/sonstiges fällt in den Bool-Zweig: !!context[gesamter String] → Schlüssel existiert nie
  if (/>=|<=/.test(cond)) return { sat: false, why: `Operator „>=/<=" wird von der Legacy-Grammatik nicht geparst → Bool-Lookup des Gesamtstrings → immer false` };
  return { sat: availableVars.includes(cond), why: `Bool-Check auf „${cond}"` };
}

// Greetings (Level 0..3 erreichbar: Aufbau +10/Aktion, StoryEngineAdapter.ts:5871-5899;
// Abbau über response_effects möglich, 6641-6648)
for (const [npcId, npc] of Object.entries(dialoguesData.npcs ?? {})) {
  for (const [levelKey, arr] of Object.entries(npc.greetings ?? {})) {
    for (const g of arr) {
      record('dialogues.json', 'greeting', `${npcId}.${levelKey}.${g.id ?? ''}`, 'erreichbar', 'ok',
        `Greeting Level ${levelKey.replace('level_', '')} (Beziehungslevel 0-3 erreichbar)`,
        `${ENTRY_POINTS.greeting.evidence}; StoryEngineAdapter.ts:5871-5899`, countDeText(g));
    }
  }
  // Briefings
  for (const [stage, arr] of Object.entries(npc.briefings ?? {})) {
    for (const b of arr) {
      const txt = countDeText(b);
      if (stage === 'mid_game' || stage === 'late_game') {
        const gate = stage === 'mid_game' ? 48 : 96;
        record('dialogues.json', 'briefing', `${npcId}.${stage}.${b.id ?? ''}`, 'tot', 'briefing_phase_gate',
          `Stufe „${stage}" verlangt Phase ≥ ${gate}, max erreichbarer Tag = ${RULES.MAX_DAY} (H-15) — zusätzlich hat getNPCBriefing keinen Aufrufer`,
          `DialogLoader.ts:394-396; StoryEngineAdapter.ts:876,4970-4977; ${ENTRY_POINTS.briefing.evidence}`, txt);
      } else if (stage !== 'early_game') {
        record('dialogues.json', 'briefing', `${npcId}.${stage}.${b.id ?? ''}`, 'tot', 'briefing_stage_key_unknown',
          `Stufen-Schlüssel „${stage}" wird von getBriefing nie gewählt (nur early/mid/late_game)`,
          'DialogLoader.ts:393-398', txt);
      } else {
        record('dialogues.json', 'briefing', `${npcId}.${stage}.${b.id ?? ''}`, 'tot', 'entry_point_no_caller',
          'early_game wäre phasen-seitig erreichbar, aber getNPCBriefing hat keinen Aufrufer',
          ENTRY_POINTS.briefing.evidence, txt);
      }
    }
  }
  // Reactions (live über processNPCReactions mit echten action.tags)
  for (const [cat, arr] of Object.entries(npc.reactions ?? {})) {
    for (const r of arr) {
      const txt = countDeText(r);
      const tags = r.triggered_by_tags ?? [];
      const tagOk = tags.length === 0 || tags.some((t) => allActionTags.has(t));
      const missingTags = tags.filter((t) => !allActionTags.has(t));
      let condCheck = { sat: true, why: 'keine Bedingung' };
      if (r.condition) condCheck = legacyConditionSatisfiable(r.condition, RULES.REACTION_CONDITION_VARS);
      if (!tagOk) {
        record('dialogues.json', 'reaction', `${npcId}.${cat}.${r.id ?? ''}`, 'tot', 'reaction_tag_never_occurs',
          `triggered_by_tags [${tags.join(',')}] kommen in KEINER Aktion vor`,
          'DialogLoader.ts:427-429; StoryEngineAdapter.ts:5840-5853', txt);
      } else if (!condCheck.sat) {
        record('dialogues.json', 'reaction', `${npcId}.${cat}.${r.id ?? ''}`, 'tot', 'reaction_condition_unsatisfiable',
          `Bedingung „${r.condition}" nie erfüllbar: ${condCheck.why} (Kontext nur {risk, morale, moral_weight})`,
          'DialogLoader.ts:433-435,522-555; StoryEngineAdapter.ts:5847-5851', txt);
      } else {
        const note = missingTags.length ? ` (Hinweis: Tag(s) ${missingTags.join(',')} existieren nicht, Match über ${tags.filter((t) => allActionTags.has(t)).join(',')})` : '';
        record('dialogues.json', 'reaction', `${npcId}.${cat}.${r.id ?? ''}`, 'erreichbar', 'ok',
          `Tag-Match möglich${note}`, ENTRY_POINTS.reaction.evidence, txt);
      }
    }
  }
  // Crisis
  for (const c of npc.crisis ?? []) {
    const condCheck = c.condition ? legacyConditionSatisfiable(c.condition, ['risk', 'morale', 'moral_weight', 'moscow_pressure']) : { sat: true };
    const extra = condCheck.sat ? '' : ` — zusätzlich Bedingung „${c.condition}" nie erfüllbar (${condCheck.why})`;
    record('dialogues.json', 'crisis_dialogue', `${npcId}.${c.id ?? ''}`, 'tot', 'entry_point_no_caller',
      `getNPCCrisisDialogue wird nie aufgerufen${extra}`, ENTRY_POINTS.crisis.evidence, countDeText(c));
  }
  // Ambient
  for (const a of npc.ambient ?? []) {
    record('dialogues.json', 'ambient', `${npcId}.${a.id ?? ''}`, 'tot', 'entry_point_no_caller',
      'getAmbientDialogue wird nie aufgerufen', ENTRY_POINTS.ambient.evidence, countDeText(a));
  }
}
// Special dialogues
const sd = dialoguesData.special_dialogues ?? {};
for (const [npcId, d] of Object.entries(sd.first_meeting ?? {})) {
  record('dialogues.json', 'first_meeting', npcId, 'tot', 'entry_point_no_caller',
    'getNPCFirstMeeting wird nie aufgerufen', ENTRY_POINTS.first_meeting.evidence, countDeText(d));
}
for (const [branch, map] of Object.entries(sd.game_end_dialogues ?? {})) {
  for (const [npcId, text] of Object.entries(map)) {
    record('dialogues.json', 'game_end_dialogue', `${branch}.${npcId}`, 'tot', 'entry_point_no_caller',
      'getNPCGameEndDialogue wird nie aufgerufen', ENTRY_POINTS.game_end.evidence, { words: words(text), chars: chars(text) });
  }
}
for (const [npcId, d] of Object.entries(sd.recommendation_reactions ?? {})) {
  if (npcId === 'description') continue;
  record('dialogues.json', 'recommendation_reaction', npcId, 'erreichbar', 'ok',
    'wird direkt aus dem JSON gelesen (Empfehlung befolgt/ignoriert)', ENTRY_POINTS.recommendation_reactions.evidence, countDeText(d));
}

// ─────────────────────────────────────────────────────────────────────────────
// (c) TOPICS + DEBATTEN + RESPONSES — topics_dialogues.json
// ─────────────────────────────────────────────────────────────────────────────
const topicsData = loadJSON('topics_dialogues.json');
const reachableTopicTexts = []; // für Insert-Analyse

function jsonConditionSatisfiable(cond) {
  // Nachbau von evaluateJsonCondition (DialogLoader.ts:698-714) auf Intervall-Basis.
  const clauses = [...(cond?.all ?? []), ...(cond?.any ?? [])];
  const anyMode = !cond?.all?.length && !!cond?.any?.length;
  const results = clauses.map((cl) => {
    if (!RULES.TOPIC_CONTEXT_VARS.includes(cl.var)) return { sat: false, why: `Variable „${cl.var}" nie im DialogueContext` };
    const ranges = { phase: [1, RULES.MAX_DAY], risk: [0, 100], morale: [0, 100], budget: [0, RULES.MAX_PLAUSIBLE_BUDGET], attention: [0, 100], capacity: [0, RULES.MAX_CAPACITY], relationshipLevel: [0, RULES.MAX_RELATIONSHIP_LEVEL], objectiveProgress: [0, 100], availableActionsCount: [0, 143] };
    const r = ranges[cl.var];
    if (!r) return { sat: true, why: `${cl.var} (nicht numerisch geprüft)` };
    const val = Number(cl.value);
    let sat = true;
    if (cl.op === '>' ) sat = r[1] > val;
    if (cl.op === '>=') sat = r[1] >= val;
    if (cl.op === '<' ) sat = r[0] < val;
    if (cl.op === '<=') sat = r[0] <= val;
    if (cl.op === 'inRange' && Array.isArray(cl.value)) sat = cl.value[0] <= r[1] && cl.value[1] >= r[0];
    return { sat, why: `${cl.var} ${cl.op} ${JSON.stringify(cl.value)} bei Wertebereich [${r[0]},${r[1]}]` };
  });
  if (results.length === 0) return { sat: true, why: 'keine Bedingung' };
  if (anyMode) {
    const ok = results.some((x) => x.sat);
    return { sat: ok, why: results.map((x) => `${x.sat ? '✓' : '✗'} ${x.why}`).join(' | ') };
  }
  const bad = results.find((x) => !x.sat);
  return bad ? { sat: false, why: bad.why } : { sat: true, why: 'alle Klauseln erfüllbar' };
}

function classifyTopicDialogue(topicId, layer, d, variantOf) {
  const idStr = `${topicId}.${layer}${variantOf ? `@${variantOf}` : ''}.${d.id ?? ''}`;
  const own = { text_de: d.text_de };
  const txt = countDeText(own);
  // Responses als eigene Objekte (Texte werden nie gerendert)
  for (const r of d.responses ?? []) {
    record('topics_dialogues.json', 'topic_response', `${idStr}→${r.id}`, 'tot', 'responses_never_rendered',
      'DialogueResponse-Texte werden von der UI nie angezeigt (eigene Choices)', ENTRY_POINTS.topic_responses.evidence,
      countDeText(r));
  }
  if (layer !== 'intro') {
    record('topics_dialogues.json', 'topic_dialogue', idStr, 'tot', 'layer_never_requested',
      `Layer „${layer}" wird von keinem Live-Aufrufer angefordert (UI ruft nur intro)`, ENTRY_POINTS.topic_deep_options.evidence, txt);
    return;
  }
  // Phase-Range (DialogLoader.ts:995-998)
  if (Array.isArray(d.phase_range) && d.phase_range[0] > RULES.MAX_DAY) {
    record('topics_dialogues.json', 'topic_dialogue', idStr, 'tot', 'phase_range_gate',
      `phase_range [${d.phase_range}] beginnt nach max Tag ${RULES.MAX_DAY}`, 'DialogLoader.ts:995-998; StoryEngineAdapter.ts:876,4970-4977', txt);
    return;
  }
  // Bedingungen (DialogLoader.ts:1001; String-Legacy via 719-732)
  let cond = { sat: true, why: '' };
  if (d.condition) {
    cond = typeof d.condition === 'string'
      ? legacyConditionSatisfiable(d.condition, RULES.TOPIC_CONTEXT_VARS)
      : jsonConditionSatisfiable(d.condition);
  }
  if (!cond.sat) {
    record('topics_dialogues.json', 'topic_dialogue', idStr, 'tot', 'condition_unsatisfiable',
      `Bedingung nie erfüllbar: ${cond.why}`, 'DialogLoader.ts:1001,617-714', txt);
    return;
  }
  if (typeof d.probability === 'number' && d.probability <= 0) {
    record('topics_dialogues.json', 'topic_dialogue', idStr, 'tot', 'zero_probability', 'probability ≤ 0 und weightedSelect fällt nur bei Gesamtgewicht 0 auf Uniform zurück', 'DialogLoader.ts:1009,1061-1083', txt);
    return;
  }
  const note = Array.isArray(d.phase_range) && d.phase_range[1] < RULES.MAX_DAY ? ` (nur Tage ${d.phase_range[0]}-${d.phase_range[1]})` : '';
  record('topics_dialogues.json', 'topic_dialogue', idStr, 'erreichbar', 'ok', `intro-Layer, Bedingungen erfüllbar${note}`, ENTRY_POINTS.topic_intro.evidence, txt);
  reachableTopicTexts.push(d.text_de ?? '');
}

for (const [topicId, topic] of Object.entries(topicsData.topics ?? {})) {
  for (const layer of ['intro', 'deep', 'options']) {
    for (const d of topic[layer] ?? []) classifyTopicDialogue(topicId, layer, d, null);
  }
  for (const [npcId, variant] of Object.entries(topic.npc_variants ?? {})) {
    for (const layer of ['intro', 'deep', 'options']) {
      for (const d of variant[layer] ?? []) classifyTopicDialogue(topicId, layer, d, npcId);
    }
  }
}
for (const [debateId, debate] of Object.entries(topicsData.debates ?? {})) {
  record('topics_dialogues.json', 'debate', debateId, 'tot', 'entry_point_no_caller',
    'getDebate hat keinen Live-Aufrufer (nur __tests__)', ENTRY_POINTS.debate.evidence, countDeText(debate));
}

// ─────────────────────────────────────────────────────────────────────────────
// (c) INSERT-BIBLIOTHEK — Platzhalter nur in Topic-/Debatten-Texten aufgelöst
//     (DialogLoader.ts:1019-1024 getTopicDialogue, 1181-1185 getDebate)
// ─────────────────────────────────────────────────────────────────────────────
const insertLib = loadJSON('insert_library.json').inserts ?? {};
const placeholderRe = /\{(\w+)\}/g;
const usedAnywhere = new Set();
const usedInReachable = new Set();
{
  const scan = (o, sink) => {
    if (typeof o === 'string') { let m; while ((m = placeholderRe.exec(o))) sink.add(m[1]); return; }
    if (Array.isArray(o)) return o.forEach((x) => scan(x, sink));
    if (o && typeof o === 'object') Object.values(o).forEach((x) => scan(x, sink));
  };
  scan(topicsData.topics, usedAnywhere);
  scan(topicsData.debates, usedAnywhere);
  for (const t of reachableTopicTexts) scan(t, usedInReachable);
}
for (const [key, entry] of Object.entries(insertLib)) {
  const txt = countDeText(entry);
  if (!usedAnywhere.has(key)) {
    record('insert_library.json', 'insert', key, 'tot', 'insert_unused',
      `Platzhalter {${key}} kommt in keinem Topic-/Debatten-Text vor`, 'DialogLoader.ts:741-750,1019-1024', txt);
  } else if (!usedInReachable.has(key)) {
    record('insert_library.json', 'insert', key, 'tot', 'insert_only_in_dead_text',
      `Platzhalter {${key}} kommt nur in unerreichbaren Texten (deep/options/Debatten) vor`, 'DialogLoader.ts:1019-1024', txt);
  } else {
    record('insert_library.json', 'insert', key, 'erreichbar', 'ok', `{${key}} in erreichbarem intro-Text`, 'DialogLoader.ts:1019-1024', txt);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// (f) ENDEN-BAUSTEINE — EndingSystem.ts (Titles, Components) + Auftrags-Enden
//     Live-Zwang: assembledEndingForBranch erzwingt category ∈ {victory, exposure}
//     (StoryEngineAdapter.ts:6744-6758). Titles werden ohnehin nie angezeigt
//     (StoryModeGame.tsx:966-972 reicht kein title_de durch).
// ─────────────────────────────────────────────────────────────────────────────
const endingSrc = readSrc('src/story-mode/engine/EndingSystem.ts');
const ENDING_TITLES = extractLiteral(endingSrc, 'const ENDING_TITLES');
const ENDING_COMPONENTS = extractLiteral(endingSrc, 'const ENDING_COMPONENTS', '[');
const AUFTRAG_ENDING_TEXT = extractLiteral(endingSrc, 'const AUFTRAG_ENDING_TEXT');

// Replikate (EndingSystem.ts:592-648)
function statValue(stat, s) {
  const map = {
    risk: s.risk, attention: s.attention, moralWeight: s.moralWeight, budget: s.budget,
    objectivesCompleted: s.objectivesCompleted, objectivesTotal: s.objectivesTotal,
    phasesElapsed: s.phasesElapsed, totalActionsUsed: s.totalActionsUsed,
    illegalActionsUsed: s.illegalActionsUsed, violentActionsUsed: s.violentActionsUsed,
    ethicalActionsUsed: s.ethicalActionsUsed, armsRaceLevel: s.armsRaceLevel,
    defenderCount: s.defenderCount, crisesResolved: s.crisesResolved, crisesIgnored: s.crisesIgnored,
    combosCompleted: s.combosCompleted, npcsBetrayCount: s.npcsBetray.length, npcsLostCount: s.npcsLost.length,
  };
  return map[stat] ?? 0;
}
function evalEndingCond(c, s) {
  switch (c.type) {
    case 'threshold': {
      const v = statValue(c.stat, s), t = c.value;
      return { '>': v > t, '<': v < t, '>=': v >= t, '<=': v <= t, '==': v === t, '!=': v !== t }[c.operator] ?? false;
    }
    case 'flag': return (c.flags ?? []).every((f) => (s.flags ?? []).includes(f));
    case 'compound':
      if (c.allOf) return c.allOf.every((x) => evalEndingCond(x, s));
      if (c.anyOf) return c.anyOf.some((x) => evalEndingCond(x, s));
      return false;
    default: return false;
  }
}
function selectComponentsReplica(s) {
  const selected = [], usedTypes = new Set();
  const matches = ENDING_COMPONENTS.filter((c) => evalEndingCond(c.condition, s)).sort((a, b) => b.weight - a.weight);
  for (const comp of matches) if (!usedTypes.has(comp.type)) { selected.push(comp.id); usedTypes.add(comp.type); }
  return selected;
}
function shouldGameEndReplica(s) { // EndingSystem.ts:819-838
  return s.risk >= 95 || s.phasesElapsed >= 120 || (s.objectivesCompleted >= s.objectivesTotal && s.objectivesTotal > 0)
    || s.armsRaceLevel >= 5 || s.npcsBetray.length >= 3 || (s.budget <= 0 && s.risk >= 70);
}
function determineCategoryReplica(s) { // EndingSystem.ts:505-543
  if (s.risk >= 90) return 'exposure';
  if (s.objectivesCompleted >= s.objectivesTotal * 0.8 && s.risk < 50) return 'victory';
  if (s.objectivesCompleted >= s.objectivesTotal * 0.6 && s.moralWeight >= 60) return 'pyrrhic';
  if (s.risk >= 70 && s.risk < 90 && s.budget >= 30) return 'escape';
  if (s.armsRaceLevel >= 4 && s.defenderCount >= 4) return 'collapse';
  if (s.moralWeight < 20 && s.ethicalActionsUsed > s.illegalActionsUsed) return 'redemption';
  if (s.objectivesCompleted >= 1 && s.objectivesCompleted < s.objectivesTotal * 0.6) return 'stalemate';
  return 'continuation';
}
function determineToneReplica(s, cat) { // EndingSystem.ts:545-570
  if (s.moralWeight >= 70) { if (cat === 'victory') return 'dark'; if (s.npcsBetray.length >= 2) return 'tragic'; return 'haunting'; }
  if (s.moralWeight < 30) { if (cat === 'victory') return 'triumphant'; if (cat === 'exposure') return 'hopeful'; return 'bittersweet'; }
  if (cat === 'pyrrhic') return 'bittersweet';
  if (cat === 'escape') return 'ambiguous';
  if (cat === 'collapse') return 'tragic';
  if (cat === 'stalemate') return 'ambiguous';
  if (s.risk >= 80) return 'dark';
  if (s.risk >= 50) return 'bittersweet';
  return 'ambiguous';
}
function mockState(category, tone) { // forceEnding-Replikat, EndingSystem.ts:858-880
  return {
    risk: category === 'exposure' ? 95 : 30, attention: 50,
    moralWeight: tone === 'dark' ? 80 : tone === 'hopeful' ? 20 : 50,
    budget: category === 'escape' ? 100 : 50,
    objectivesCompleted: category === 'victory' ? 5 : 2, objectivesTotal: 5, phasesElapsed: 60,
    totalActionsUsed: 50, illegalActionsUsed: category === 'redemption' ? 5 : 20, violentActionsUsed: 3,
    ethicalActionsUsed: category === 'redemption' ? 30 : 10, npcRelationships: {}, npcsBetray: [], npcsLost: [],
    armsRaceLevel: category === 'collapse' ? 5 : 2, defenderCount: 3, flags: [],
    crisesResolved: 3, crisesIgnored: 1, combosCompleted: 4,
  };
}

// Live-Zwangs-Pfad: forceEnding-Kombinationen aus assembledEndingForBranch
// (StoryEngineAdapter.ts:6754-6758): victory→triumphant · defeat/exposure→haunting|hopeful|dark
const FORCED_COMBOS = [['victory', 'triumphant'], ['exposure', 'haunting'], ['exposure', 'hopeful'], ['exposure', 'dark']];
const reachableComponents = new Set();
const reachableTitleCombos = new Set();
for (const [cat, tone] of FORCED_COMBOS) {
  selectComponentsReplica(mockState(cat, tone)).forEach((id) => reachableComponents.add(id));
  reachableTitleCombos.add(`${cat}/${tone}`); // (Kombination wird intern erzeugt — Titel-TEXT wird trotzdem nie angezeigt)
}
// Rich-Pfad-Monte-Carlo: Live-Zustandsräume mit shouldGameEnd ∧ category ∈ {victory, exposure}
let rng = (() => { let a = 0x9e3779b9; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; })();
const pick = (arr) => arr[Math.floor(rng() * arr.length)];
const componentSatisfiableLive = new Set();
for (let i = 0; i < 60000; i++) {
  const s = {
    risk: Math.floor(rng() * 101), attention: Math.floor(rng() * 101),
    moralWeight: Math.floor(rng() * 121), budget: Math.floor(rng() * 601),
    objectivesCompleted: pick([0, 1, 2]), objectivesTotal: 2,
    phasesElapsed: 1 + Math.floor(rng() * RULES.MAX_DAY),
    totalActionsUsed: Math.floor(rng() * 140), illegalActionsUsed: Math.floor(rng() * 40),
    violentActionsUsed: Math.floor(rng() * 20), ethicalActionsUsed: Math.floor(rng() * 100),
    npcsBetray: Array.from({ length: pick([0, 1, 2, 3, 4]) }, (_, k) => `n${k}`), npcsLost: [],
    armsRaceLevel: pick([0, 1, 2, 3, 4, 5]), defenderCount: Math.floor(rng() * 9), flags: [],
    crisesResolved: Math.floor(rng() * 10), crisesIgnored: Math.floor(rng() * 5),
    combosCompleted: Math.floor(rng() * 13), npcRelationships: {},
  };
  for (const comp of ENDING_COMPONENTS) if (evalEndingCond(comp.condition, s)) componentSatisfiableLive.add(comp.id);
  if (!shouldGameEndReplica(s)) continue;
  const cat = determineCategoryReplica(s);
  if (cat !== 'victory' && cat !== 'exposure') continue; // Zwang: StoryEngineAdapter.ts:6752-6753
  const tone = determineToneReplica(s, cat);
  reachableTitleCombos.add(`${cat}/${tone}`);
  selectComponentsReplica(s).forEach((id) => reachableComponents.add(id));
}

// Titles: 8×7 — Text wird NIE angezeigt (EndReport erhält kein title_de)
for (const [cat, tones] of Object.entries(ENDING_TITLES)) {
  for (const [tone, t] of Object.entries(tones)) {
    const combo = `${cat}/${tone}`;
    const comboReached = reachableTitleCombos.has(combo);
    record('EndingSystem.ts', 'ending_title', combo, 'tot',
      comboReached ? 'title_never_displayed' : 'category_forced_dead',
      comboReached
        ? 'Kombination wird intern erzeugt, aber title_de erreicht die UI nie'
        : `Kategorie/Tonalität wird live nie erzeugt (Zwang auf victory|exposure) UND title_de erreicht die UI nie`,
      `${ENTRY_POINTS.ending_titles.evidence}; StoryEngineAdapter.ts:6744-6758`, { words: words(t.de), chars: chars(t.de) });
  }
}
// Components
for (const comp of ENDING_COMPONENTS) {
  const txt = { words: words(comp.text_de), chars: chars(comp.text_de) };
  if (reachableComponents.has(comp.id)) {
    record('EndingSystem.ts', 'ending_component', comp.id, 'erreichbar', 'ok',
      'im Live-Pfad auswählbar (Rich-Zustand oder forceEnding-Mock) und via fullNarrative_de angezeigt',
      'EndingSystem.ts:572-590; StoryModeGame.tsx:969; StoryEngineAdapter.ts:6744-6758', txt);
  } else if (componentSatisfiableLive.has(comp.id)) {
    record('EndingSystem.ts', 'ending_component', comp.id, 'unsicher', 'shadowed_by_weight',
      'Bedingung live erfüllbar, aber in 60k Stichproben nie Slot-Sieger seines Typs (höhergewichtete Konkurrenz)',
      'EndingSystem.ts:572-590 (bester je Typ gewinnt)', txt);
  } else {
    record('EndingSystem.ts', 'ending_component', comp.id, 'tot', 'condition_unsatisfiable_live',
      'Bedingung im Live-Zustandsraum (inkl. forceEnding-Mocks) nie erfüllbar — z. B. objectivesCompleted≥3 bei nur 2 Objectives',
      'EndingSystem.ts:592-623; StoryEngineAdapter.ts:1014-1041 (objectivesTotal=2), 6744-6758', txt);
  }
}
// Auftrags-Enden (3 Aufträge × 3 Tonalitäten) — Auftrag wählbar (StoryModeGame.tsx:833),
// Ton aus moralWeight/risk beim Sieg (EndingSystem.ts:939-943): alle 3 erreichbar.
for (const [auftragId, tones] of Object.entries(AUFTRAG_ENDING_TEXT)) {
  for (const [tone, t] of Object.entries(tones)) {
    record('EndingSystem.ts', 'auftrag_ending', `${auftragId}/${tone}`, 'erreichbar', 'ok',
      `Auftrag wählbar (UI) · Ton „${tone}" erreichbar (kalt: moral<55∧risk<65 · pyrrhisch: moral≥55 · knapp: risk 65-84; Sieg bis risk<85 möglich)`,
      'EndingSystem.ts:939-943,1038-1069; StoryModeGame.tsx:833; VictorySystem.ts:37,68,77', countDeText(t));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DECISION-BEATS (DecisionBeats.ts) — über den Director-Pool live verdrahtet
// (useStoryGameState.ts:1009-1020 → pickNext; Auflösung 1453).
// ─────────────────────────────────────────────────────────────────────────────
const beatsSrc = readSrc('src/story-mode/engine/DecisionBeats.ts');
const beatNames = ['STADTRAT', 'REALE_VORLAGE', 'SCHWELBRAND', 'LOYALITAETSPROBE', 'BUMERANG', 'NEBEL'];
const seedableThemes = new Set();
const beats = beatNames.map((n) => extractLiteral(beatsSrc, `const ${n}: DecisionBeat`));
for (const b of beats) if (b.themaId && !b.requiresThema) seedableThemes.add(b.themaId);
for (const b of beats) {
  const txt = countDeText(b);
  if (b.requiresThema && !seedableThemes.has(b.requiresThema)) {
    record('DecisionBeats.ts', 'decision_beat', b.id, 'tot', 'theme_never_seeded',
      `requiresThema „${b.requiresThema}" wird von keinem Beat gesät`, 'DecisionBeats.ts:652-661', txt);
  } else {
    const note = b.requiresThema ? ` (reaktiv: erst nach Thema „${b.requiresThema}")` : '';
    record('DecisionBeats.ts', 'decision_beat', b.id, 'erreichbar', 'ok',
      `im Director-Pool${note}`, 'useStoryGameState.ts:1009-1020,1453; StoryDirector.ts:148-165', txt);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// AUFTRÄGE (Auftraege.ts) — alle 3 per UI wählbar
// ─────────────────────────────────────────────────────────────────────────────
const auftraegeSrc = readSrc('src/story-mode/engine/Auftraege.ts');
const AUFTRAEGE = extractLiteral(auftraegeSrc, 'export const AUFTRAEGE');
for (const [id, a] of Object.entries(AUFTRAEGE)) {
  record('Auftraege.ts', 'auftrag', id, 'erreichbar', 'ok', 'per Auftrags-Wahl beim Start wählbar', 'StoryModeGame.tsx:833; useStoryGameState.ts:592-595', countDeText(a));
}

// ─────────────────────────────────────────────────────────────────────────────
// npcs.json — Fallback-Dialoge (werden vom Platinum-Pfad überschattet) + Stammdaten
// ─────────────────────────────────────────────────────────────────────────────
const npcsData = loadJSON('npcs.json').npcs ?? [];
const platinumGreetingLevels = new Map(); // npcId -> Set(level mit nicht-leerem Platinum-Greeting)
for (const [npcId, npc] of Object.entries(dialoguesData.npcs ?? {})) {
  platinumGreetingLevels.set(npcId, new Set(Object.entries(npc.greetings ?? {}).filter(([, arr]) => arr.length > 0).map(([k]) => k.replace('level_', ''))));
}
for (const n of npcsData) {
  record('npcs.json', 'npc', n.id, 'erreichbar', 'ok', 'Stammdaten (Name/Rolle) überall sichtbar', 'StoryEngineAdapter.ts:966-1007', countDeText({ role_de: n.role_de, name: n.name }, ['name']));
  const dl = n.dialogues ?? {};
  // Greetings-Fallback: nur wenn der Platinum-Pfad für Level X leer ist (DialogLoader.ts:371-384 → Adapter 6448-6464)
  for (const [lvl, text] of Object.entries(dl.greetings ?? {})) {
    const shadowed = platinumGreetingLevels.get(n.id)?.has(lvl);
    record('npcs.json', 'npc_fallback_greeting', `${n.id}.greeting.${lvl}`, shadowed ? 'tot' : 'erreichbar',
      shadowed ? 'platinum_shadows_fallback' : 'ok',
      shadowed ? `dialogues.json hat nicht-leere Greetings für Level ${lvl} → Fallback nie erreicht` : 'Fallback aktiv',
      'StoryEngineAdapter.ts:6448-6464; DialogLoader.ts:371-384', { words: words(text), chars: chars(text) });
  }
  // Reactions-Fallback: Einstieg getNPCDialogueWithVoice('reaction') hat keinen Aufrufer
  for (const [sub, text] of Object.entries(dl.reactions ?? {})) {
    record('npcs.json', 'npc_fallback_reaction', `${n.id}.reaction.${sub}`, 'tot', 'entry_point_no_caller',
      'WithVoice(type:reaction) wird von keiner UI aufgerufen (nur greeting/topic: useStoryGameState.ts:786,833)',
      'StoryEngineAdapter.ts:6468-6495; useStoryGameState.ts:786,833,1480', { words: words(text), chars: chars(text) });
  }
  // Topics-Fallback: nur erreicht, wenn der Platinum-Topic-Pfad null liefert → unsicher
  for (const [topicId, text] of Object.entries(dl.topics ?? {})) {
    record('npcs.json', 'npc_fallback_topic', `${n.id}.topic.${topicId}`, 'unsicher', 'fallback_conditional',
      'nur sichtbar, wenn getTopicDialogue für diesen NPC/Topic null liefert (Bedingungs-/Phasen-Lücken)',
      'StoryEngineAdapter.ts:6498-6518', { words: words(text), chars: chars(text) });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Restliche Content-Dateien — Konsumenten belegt, einfacher Existenz-Check
// ─────────────────────────────────────────────────────────────────────────────
for (const m of loadJSON('disinfo_methods.json').methods ?? []) {
  record('disinfo_methods.json', 'method', m.id, 'erreichbar', 'ok', 'Methoden-Dossier (Taste I) zeigt den Atlas', 'StoryModeGame.tsx:21,1703; DisinfoMethodAtlas.ts', countDeText(m));
}
for (const t of loadJSON('targets.json').targets ?? []) {
  record('targets.json', 'target', t.id, 'erreichbar', 'ok', 'Operations-Akte (P2: Ziel→Dossier→Kompromat)', 'StoryEngineAdapter.ts:3981-3999; BattlefieldChain.ts:11', countDeText(t, ['name']));
}
for (const p of loadJSON('personas.json').personas ?? []) {
  record('personas.json', 'persona', p.id, 'erreichbar', 'ok', 'Fokusgruppen-Panel', 'StoryModeGame.tsx:47,1324', countDeText(p, ['name', 'gruppe', 'bio']));
}
for (const c of loadJSON('carriers.json').carriers ?? []) {
  record('carriers.json', 'carrier', c.id, 'erreichbar', 'ok', 'Operations-Akte (Verbreiter)', 'BattlefieldChain.ts:12', countDeText(c));
}
for (const p of loadJSON('platforms.json').platforms ?? []) {
  record('platforms.json', 'platform', p.id, 'erreichbar', 'ok', 'Operations-Akte (Plattform-Mix)', 'BattlefieldChain.ts:13', countDeText(p));
}
{
  const au = loadJSON('audience.json');
  const segs = (au.countries ?? []).flatMap((c) => c.segments ?? (Array.isArray(c) ? c : []));
  const segList = segs.length ? segs : (au.segments ?? []);
  if (segList.length) {
    for (const s of segList) record('audience.json', 'audience_segment', s.id ?? s.name ?? '?', 'erreichbar', 'ok', 'Broadcast-Leiste (Taste B)', 'audience/audienceModel.ts; broadcast/useAudienceBroadcast.ts', countDeText(s, ['profil', 'name']));
  } else {
    record('audience.json', 'audience_file', 'audience', 'erreichbar', 'ok', 'Broadcast-Leiste (Taste B)', 'audience/audienceModel.ts', countDeText(au, ['profil', 'name']));
  }
}
for (const r of loadJSON('building.json').rooms ?? []) {
  record('building.json', 'room', r.id, 'erreichbar', 'ok', 'Gebäude-Querschnitt', 'building/buildingLayout.ts', countDeText(r));
}

// ─────────────────────────────────────────────────────────────────────────────
// AGGREGATION + VALIDIERUNG
// ─────────────────────────────────────────────────────────────────────────────
const byFile = new Map();
for (const o of objects) {
  if (!byFile.has(o.file)) byFile.set(o.file, { total: 0, erreichbar: 0, tot: 0, unsicher: 0, words: 0, deadWords: 0, unsureWords: 0 });
  const f = byFile.get(o.file);
  f.total++; f[o.verdict]++;
  f.words += o.words;
  if (o.verdict === 'tot') f.deadWords += o.words;
  if (o.verdict === 'unsicher') f.unsureWords += o.words;
}
const totals = { total: 0, erreichbar: 0, tot: 0, unsicher: 0, words: 0, deadWords: 0, unsureWords: 0 };
for (const f of byFile.values()) for (const k of Object.keys(totals)) totals[k] += f[k];

// Tote Cluster: Gruppierung (file, reasonCode)
const clusters = new Map();
for (const o of objects.filter((x) => x.verdict === 'tot')) {
  const key = `${o.file}::${o.reasonCode}`;
  if (!clusters.has(key)) clusters.set(key, { file: o.file, reasonCode: o.reasonCode, count: 0, words: 0, evidence: o.evidence, beispiel: o.id, reason: o.reason });
  const c = clusters.get(key);
  c.count++; c.words += o.words;
}
const topClusters = [...clusters.values()].sort((a, b) => b.words - a.words).slice(0, 12);

// Validierung gegen bekannte Einzel-Funde
const consequenceObjs = objects.filter((o) => o.kind === 'consequence');
const deadConsequences = consequenceObjs.filter((o) => o.verdict === 'tot').length;
const briefingGate = objects.filter((o) => o.kind === 'briefing' && o.reasonCode === 'briefing_phase_gate').length;
const levelUpReactions = objects.filter((o) => o.kind === 'reaction' && o.reasonCode === 'reaction_tag_never_occurs').length;
const unusedInserts = objects.filter((o) => o.kind === 'insert' && o.reasonCode === 'insert_unused').length;
const liveCategories = new Set([...reachableTitleCombos].map((c) => c.split('/')[0]));
const validation = [
  {
    fund: 'H-01: 21/24 Konsequenzen tot (NaN/tote Trigger)',
    reproduziert: deadConsequences === 21,
    messung: `${deadConsequences}/24 tot (davon ${consequenceObjs.filter((o) => o.reasonCode === 'nan_probability').length} NaN-Klasse, ${consequenceObjs.filter((o) => o.reasonCode === 'dead_trigger').length} tote Trigger)`,
  },
  {
    fund: 'EndingSystem: 6/8 Kategorien live unerreichbar (≈30 Bausteine)',
    reproduziert: liveCategories.size === 2,
    messung: `live erzeugte Kategorien: ${[...liveCategories].join(',')} (2/8 → 6/8 unerreichbar). Baustein-Zählung dieser Karte: ${objects.filter((o) => o.kind === 'ending_title' && o.reasonCode === 'category_forced_dead').length} Titel-Blöcke toter Kategorien + ${objects.filter((o) => o.kind === 'ending_component' && o.verdict === 'tot').length} tote Komponenten. ABWEICHUNG zur ≈30: diese Karte findet zusätzlich, dass ALLE ${objects.filter((o) => o.kind === 'ending_title').length} Titel-Texte display-tot sind (EndReport erhält kein title_de, StoryModeGame.tsx:966-972) — die ≈30 zählte nur die 6 toten Kategorien (6×7=42 Titel bzw. konservativer geschätzt ~30 Blöcke).`,
  },
  {
    fund: 'H-15: Briefings mid_game/late_game hinter Phase 48/96 unerreichbar',
    reproduziert: briefingGate >= 2,
    messung: `${briefingGate} Briefing-Einträge an Phasen-Toren 48/96 (max Tag ${RULES.MAX_DAY}); ZUSÄTZLICH: getNPCBriefing hat gar keinen Aufrufer → auch early_game tot`,
  },
  {
    fund: 'H-17: world-event actions_unlocked wird nie gelesen',
    reproduziert: deadEffectFieldNotes.some((n) => n.keys.includes('actions_unlocked')),
    messung: `Events mit ungelesenem actions_unlocked: ${deadEffectFieldNotes.filter((n) => n.keys.includes('actions_unlocked')).map((n) => n.event).join(',')}`,
  },
  {
    fund: '5 relationship_level_up-Reaktionen + 1 data-Reaktion ohne existierenden Tag',
    reproduziert: levelUpReactions === 5,
    messung: `${levelUpReactions} Reaktionen mit ausschließlich nicht-existenten Tags (alle relationship_level_up). Der Tag „data" existiert ebenfalls in keiner Aktion, die betroffene Reaktion (mar_react_analysis_2) bleibt aber über den zweiten Tag „analysis" erreichbar — daher hier nicht als tot gezählt (Abweichung erklärt).`,
  },
  {
    fund: '12/21 Insert-Platzhalter ungenutzt',
    reproduziert: unusedInserts === 12,
    messung: `${unusedInserts}/21 Inserts ohne jede Platzhalter-Verwendung`,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// AUSGABE
// ─────────────────────────────────────────────────────────────────────────────
fs.mkdirSync(OUT_DIR, { recursive: true });
const jsonOut = {
  generated: new Date().toISOString(),
  rules: { maxDay: RULES.MAX_DAY, entryPoints: ENTRY_POINTS },
  totals: {
    objects: totals.total,
    erreichbar: totals.erreichbar,
    tot: totals.tot,
    unsicher: totals.unsicher,
    words: totals.words,
    deadWords: totals.deadWords,
    unsureWords: totals.unsureWords,
    deadWordShare: totals.words ? +(100 * totals.deadWords / totals.words).toFixed(1) : 0,
    deadOrUnsureWordShare: totals.words ? +(100 * (totals.deadWords + totals.unsureWords) / totals.words).toFixed(1) : 0,
  },
  perFile: Object.fromEntries([...byFile.entries()].map(([f, v]) => [f, { ...v, deadWordShare: v.words ? +(100 * v.deadWords / v.words).toFixed(1) : 0 }])),
  topDeadClusters: topClusters,
  deadWorldEventEffectFields: deadEffectFieldNotes,
  validation,
  objects,
};
fs.writeFileSync(path.join(OUT_DIR, 'content-reachability.json'), JSON.stringify(jsonOut, null, 2));

const pc = (n, d) => (d ? (100 * n / d).toFixed(1) + '%' : '—');
let md = `# Content-Reachability-Gesamtkarte — Desinformation Network\n\n`;
md += `Erzeugt: ${jsonOut.generated} · Regelbasis: 40-Tage-Kampagne (max erreichbarer Tag ${RULES.MAX_DAY} inkl. einmaliger Nachspielzeit; StoryEngineAdapter.ts:876,4970-4977)\n\n`;
md += `## Kernzahlen\n\n`;
md += `- **Objekte:** ${totals.total} · erreichbar ${totals.erreichbar} (${pc(totals.erreichbar, totals.total)}) · tot ${totals.tot} (${pc(totals.tot, totals.total)}) · unsicher ${totals.unsicher} (${pc(totals.unsicher, totals.total)})\n`;
md += `- **Wörter (DE, spielersichtbar):** ${totals.words} gesamt · **${totals.deadWords} tot = ${pc(totals.deadWords, totals.words)} der geschriebenen Wörter unerreichbar** · unsicher ${totals.unsureWords} (${pc(totals.unsureWords, totals.words)})\n\n`;
md += `## Je Datei\n\n| Datei | total | erreichbar | tot | unsicher | Wörter | tote Wörter | tot-% (Wörter) |\n|---|---|---|---|---|---|---|---|\n`;
for (const [f, v] of [...byFile.entries()].sort((a, b) => b[1].deadWords - a[1].deadWords)) {
  md += `| ${f} | ${v.total} | ${v.erreichbar} | ${v.tot} | ${v.unsicher} | ${v.words} | ${v.deadWords} | ${pc(v.deadWords, v.words)} |\n`;
}
md += `| **GESAMT** | **${totals.total}** | **${totals.erreichbar}** | **${totals.tot}** | **${totals.unsicher}** | **${totals.words}** | **${totals.deadWords}** | **${pc(totals.deadWords, totals.words)}** |\n\n`;
md += `## Top tote Cluster (nach toten Wörtern)\n\n| # | Datei | Grund | Objekte | Wörter | Beispiel | Fundstelle |\n|---|---|---|---|---|---|---|\n`;
topClusters.slice(0, 10).forEach((c, i) => {
  md += `| ${i + 1} | ${c.file} | ${c.reasonCode} | ${c.count} | ${c.words} | ${c.beispiel} | ${c.evidence} |\n`;
});
md += `\n## Validierung bekannter Einzel-Funde\n\n`;
for (const v of validation) {
  md += `- ${v.reproduziert ? '✅' : '⚠️'} **${v.fund}** → ${v.messung}\n`;
}
md += `\n## Methodik / Grenzen\n\n`;
md += `- Statische Karte: Regeln aus dem Engine-Code nachgebaut (Fundstellen je Objekt im JSON). Keine Garantie, dass „erreichbar" auch *wahrscheinlich* ist — nur, dass kein hartes Gate den Inhalt ausschließt.\n`;
md += `- „Einstiegspunkt ohne Aufrufer" beruht auf einer Aufrufer-Suche über src/ (ohne Tests) zum Analysezeitpunkt.\n`;
md += `- Enden-Komponenten: Monte-Carlo (60k Zustände) über den live erzwungenen Zustandsraum + die 4 forceEnding-Mock-Zustände; „unsicher" = Bedingung erfüllbar, aber nie Slot-Sieger.\n`;
md += `- Kuratierung (terminalCuration.ts) ist reine Anzeige — das ARCHIV zeigt alles, daher kein Unerreichbarkeits-Kriterium.\n`;
md += `- Wortzählung: nur deutsche, spielersichtbare Felder (*_de + Klartext-Blöcke wie npcs.json-dialogues, personas.bio).\n`;
fs.writeFileSync(path.join(OUT_DIR, 'content-reachability.md'), md);

console.log(`Objekte: ${totals.total} | erreichbar ${totals.erreichbar} | tot ${totals.tot} | unsicher ${totals.unsicher}`);
console.log(`Wörter: ${totals.words} | tot ${totals.deadWords} (${pc(totals.deadWords, totals.words)}) | unsicher ${totals.unsureWords}`);
console.log(`→ ${path.relative(ROOT, path.join(OUT_DIR, 'content-reachability.json'))}`);
console.log(`→ ${path.relative(ROOT, path.join(OUT_DIR, 'content-reachability.md'))}`);
for (const v of validation) console.log(`${v.reproduziert ? 'REPRODUZIERT' : 'ABWEICHUNG '} :: ${v.fund} :: ${v.messung}`);
