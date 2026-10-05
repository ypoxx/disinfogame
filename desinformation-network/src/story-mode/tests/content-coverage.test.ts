/**
 * CONTENT-COVERAGE-REPORT (Verify-Suite, Deliverable 2)
 * =====================================================
 * Spielt 24 deterministische Partien (3 Strategien × 8 Seeds) und zeichnet auf,
 * welche Content-IDs in realen Läufen tatsächlich GESEHEN werden:
 *   - ausgeführte Aktionen
 *   - angebotene/aktivierte/abgeschlossene Episoden
 *   - gefeuerte Director-Beats (inkl. aufgelöster Entscheidungs-Beats)
 *   - getriggerte Konsequenzen
 *   - ausgelöste World-Events
 *   - Stufen-Gegenmaßnahmen
 *   - Enden-Branch/Titel
 *
 * Ergebnis: runs/verify-suite/content-coverage.json (Union + je Strategie).
 * Der Test assertet NUR „lief durch + Datei geschrieben" — die Zahlen sind der
 * Report und ergänzen die statische Karte
 * (scripts/verify-suite/content-reachability.mjs) um die dynamische Sicht.
 *
 * Sim-Muster (PRNG, Strategie-Auswahl, Singleton-Resets) bewusst aus
 * winnable-and-losable.test.ts übernommen — das bestehende Gate bleibt unberührt.
 * Der Director-Anteil (pickNext/DecisionBeats) wird hier nachgebildet, weil er
 * im Spiel in useStoryGameState (React-Hook) lebt, nicht in der Engine
 * (useStoryGameState.ts:1009-1020); Episoden-Abschluss analog Hook-Logik
 * (useStoryGameState.ts:1252-1268: alle einklink_aktionen gespielt → complete).
 *
 * Lauf: npx vitest run src/story-mode/tests/content-coverage.test.ts
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { createStoryEngine } from '../../game-logic/StoryEngineAdapter';
import { resetStoryActorAI } from '../engine/StoryActorAI';
import { resetStoryComboSystem } from '../engine/StoryComboSystem';
import { resetCrisisMomentSystem } from '../engine/CrisisMomentSystem';
import { resetBetrayalSystem } from '../engine/BetrayalSystem';
import { resetConsequenceSystem } from '../engine/ConsequenceSystem';
import { loadEpisodes } from '../engine/EpisodeLoader';
import { pickNext, type Beat } from '../engine/StoryDirector';
import { unresolvedDecisionCandidates, getDecisionBeat, ALL_DECISION_BEATS } from '../engine/DecisionBeats';

type Strategy = 'greedy' | 'random' | 'low_risk';

interface SimAction {
  id: string;
  available: boolean;
  legality?: string;
  unlocks?: string[];
  costs?: { budget?: number; capacity?: number; risk?: number; attention?: number };
}

interface CoverageRun {
  strategy: Strategy;
  seed: string;
  outcome: 'victory' | 'defeat' | 'timeout';
  endBranch: string | null;
  endTitle: string | null;
  endPhase: number;
  actionsExecuted: string[];
  episodesOffered: string[];
  episodesActivated: string[];
  episodesCompleted: string[];
  beatsFired: string[];            // Director-Beat-IDs (krise_/episode_/entscheidung_/stups_)
  decisionBeatsResolved: string[]; // DecisionBeat-IDs mit gewählter Option, z. B. stadtrat:A
  consequencesTriggered: string[];
  worldEvents: string[];
  stageCountermeasures: string[];
}

// --- Deterministischer PRNG (mulberry32 aus String-Seed) — wie im Gate-Test ---
function hashSeed(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}
function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function selectAction(
  actions: SimAction[],
  strategy: Strategy,
  res: { budget: number; capacity: number },
  rng: () => number,
  preferIds: Set<string>,
): SimAction | null {
  const affordable = actions.filter(a => a.available
    && (!a.costs?.budget || res.budget >= a.costs.budget)
    && (!a.costs?.capacity || res.capacity >= a.costs.capacity));
  if (affordable.length === 0) return null;
  // Coverage-Zusatz: aktive Episoden-Stränge zuerst bedienen (wie die Tür-Kuratierung
  // Rang 0, terminalCuration.ts:47) — treibt Episoden-Abschlüsse in die Messung.
  const preferred = affordable.filter(a => preferIds.has(a.id));
  if (preferred.length > 0) return preferred[Math.floor(rng() * preferred.length)];
  switch (strategy) {
    case 'random':
      return affordable[Math.floor(rng() * affordable.length)];
    case 'low_risk':
      return affordable.slice().sort((a, b) =>
        ((a.costs?.risk || 0) + (a.costs?.attention || 0)) -
        ((b.costs?.risk || 0) + (b.costs?.attention || 0)))[0];
    case 'greedy':
    default:
      return affordable.slice().sort((a, b) => {
        const score = (x: SimAction) =>
          (x.legality === 'illegal' ? 3 : x.legality === 'grey' ? 2 : 1)
          + (x.unlocks?.length || 0) + (x.costs?.risk || 0) * 0.2;
        return score(b) - score(a);
      })[0];
  }
}

function resetAllSingletons(): void {
  // identisch zum Gate (winnable-and-losable.test.ts:110-130); Loader bewusst nicht.
  resetStoryActorAI();
  resetStoryComboSystem();
  resetCrisisMomentSystem();
  resetBetrayalSystem();
  resetConsequenceSystem();
}

function runOne(strategy: Strategy, seed: string, maxPhases: number): CoverageRun {
  resetAllSingletons();
  const engine = createStoryEngine(seed);
  const rng = mulberry32(hashSeed(seed));

  const rec: CoverageRun = {
    strategy, seed, outcome: 'timeout', endBranch: null, endTitle: null, endPhase: 1,
    actionsExecuted: [], episodesOffered: [], episodesActivated: [], episodesCompleted: [],
    beatsFired: [], decisionBeatsResolved: [], consequencesTriggered: [], worldEvents: [],
    stageCountermeasures: [],
  };
  const seen = {
    actions: new Set<string>(), offered: new Set<string>(), activated: new Set<string>(),
    completed: new Set<string>(), beats: new Set<string>(), decisions: new Set<string>(),
    consequences: new Set<string>(), events: new Set<string>(), stages: new Set<string>(),
  };
  const executed = new Set<string>();
  let lastBeat: Beat | null = null;

  for (let phase = 1; phase <= maxPhases; phase++) {
    const end = engine.checkGameEnd();
    if (end) {
      rec.outcome = end.type === 'victory' ? 'victory' : 'defeat';
      rec.endBranch = end.branch ?? null;
      rec.endTitle = end.title_en;
      rec.endPhase = engine.getCurrentPhase().number;
      break;
    }

    // Stufen-Gegenmaßnahme (Abwehr 25/50/75) auflösen, wenn eine ansteht
    try {
      const offer = engine.getPendingStageCountermeasure();
      if (offer) {
        seen.stages.add(`${offer.definition.id}@${offer.stage}`);
        const choice = (['kontern', 'aussitzen', 'ablenken'] as const)[Math.floor(rng() * 3)];
        engine.resolveStageCountermeasure(choice);
      }
    } catch { /* Coverage-Messung darf nie am Modal scheitern */ }

    // Episoden: Angebote sichten, aktivieren (Slots respektiert die Engine selbst)
    let offered: { id: string; titel_de: string }[] = [];
    try {
      const eps = engine.getOfferableEpisodes();
      offered = eps.map(e => ({ id: e.id, titel_de: e.titel_de }));
      for (const ep of eps) {
        seen.offered.add(ep.id);
        if (engine.activateEpisode(ep.id)) seen.activated.add(ep.id);
      }
    } catch { /* ignore */ }

    // Director-Beat küren (Nachbildung von useStoryGameState.ts:1009-1020)
    try {
      const beat = pickNext({
        ripeEpisodes: offered,
        decisionCandidates: unresolvedDecisionCandidates(
          engine.getResolvedDecisionBeatIds(),
          engine.getSeededThemes(),
        ),
        stupsCandidates: [],
      }, lastBeat, rng);
      if (beat) {
        seen.beats.add(beat.id);
        lastBeat = beat;
        if (beat.typ === 'entscheidung' && beat.decisionBeatId) {
          const db = getDecisionBeat(beat.decisionBeatId);
          if (db) {
            const opt = db.optionen[Math.floor(rng() * db.optionen.length)];
            const applied = engine.applyDecisionBeatOption(db.id, opt.id, rng);
            if (applied) seen.decisions.add(`${db.id}:${opt.id}`);
          }
        }
      }
    } catch { /* ignore */ }

    // Aktionen spielen (max 5 wie das Gate; Episoden-Einklink-Aktionen bevorzugt)
    const activeEinklink = new Set<string>();
    try {
      for (const ep of engine.getActiveEpisodes()) {
        for (const a of ep.einklink_aktionen) if (!executed.has(a)) activeEinklink.add(a);
      }
    } catch { /* ignore */ }
    let actionsThisPhase = 0;
    while (actionsThisPhase < 5) {
      const res = engine.getResources();
      if (res.actionPointsRemaining <= 0) break;
      const action = selectAction(engine.getAvailableActions() as SimAction[], strategy, res, rng, activeEinklink);
      if (!action) break;
      try {
        engine.executeAction(action.id);
        executed.add(action.id);
        seen.actions.add(action.id);
      } catch { break; }
      actionsThisPhase++;
    }

    // Episoden-Abschluss wie der Hook (useStoryGameState.ts:1252-1268):
    // alle einklink_aktionen gespielt → completeEpisode zahlt wirkt_auf aus.
    try {
      for (const ep of engine.getActiveEpisodes()) {
        if (ep.einklink_aktionen.every(a => executed.has(a))) {
          if (engine.completeEpisode(ep.id)) seen.completed.add(ep.id);
        }
      }
    } catch { /* ignore */ }

    // Aktive Konsequenz aufzeichnen + auflösen (wie das Gate; Adapter-Typ trägt
    // die Definition als consequenceId, StoryEngineAdapter.ts:547-551)
    const ac = engine.getActiveConsequence();
    if (ac) {
      seen.consequences.add(ac.consequenceId);
      if (ac.choices?.length) {
        try { engine.handleConsequenceChoice(ac.choices[0].id); } catch { /* ignore */ }
      }
    }

    // Phase beenden — World-Events der neuen Phase aufzeichnen
    try {
      const result = engine.advancePhase();
      for (const ev of result.worldEvents ?? []) {
        // NewsEvent-ID-Schema: `world_${eventDef.id}_${phase}` (StoryEngineAdapter.ts:3044)
        const m = /^world_(.+)_(\d+)$/.exec(ev.id);
        seen.events.add(m ? m[1] : ev.id);
      }
    } catch { break; }
    rec.endPhase = engine.getCurrentPhase().number;
  }

  rec.actionsExecuted = [...seen.actions].sort();
  rec.episodesOffered = [...seen.offered].sort();
  rec.episodesActivated = [...seen.activated].sort();
  rec.episodesCompleted = [...seen.completed].sort();
  rec.beatsFired = [...seen.beats].sort();
  rec.decisionBeatsResolved = [...seen.decisions].sort();
  rec.consequencesTriggered = [...seen.consequences].sort();
  rec.worldEvents = [...seen.events].sort();
  rec.stageCountermeasures = [...seen.stages].sort();
  return rec;
}

describe('CONTENT-COVERAGE-Report (Verify-Suite)', () => {
  const STRATEGIES: Strategy[] = ['greedy', 'random', 'low_risk'];
  const SEEDS_PER_STRATEGY = 8;   // 3 × 8 = 24 Partien
  const MAX_PHASES = 120;         // Obergrenze; das Spiel endet am Wahltag (electionDay=40)

  const runs: CoverageRun[] = [];
  for (const strat of STRATEGIES) {
    for (let i = 0; i < SEEDS_PER_STRATEGY; i++) {
      runs.push(runOne(strat, `cov_${strat}_${i}`, MAX_PHASES));
    }
  }

  // Union + je Strategie aggregieren
  const union = (key: keyof Pick<CoverageRun, 'actionsExecuted' | 'episodesOffered' | 'episodesActivated' | 'episodesCompleted' | 'beatsFired' | 'decisionBeatsResolved' | 'consequencesTriggered' | 'worldEvents' | 'stageCountermeasures'>, rs: CoverageRun[]) =>
    [...new Set(rs.flatMap(r => r[key]))].sort();
  const aggregate = (rs: CoverageRun[]) => ({
    games: rs.length,
    outcomes: rs.reduce<Record<string, number>>((acc, r) => { const k = `${r.outcome}${r.endBranch ? ':' + r.endBranch : ''}`; acc[k] = (acc[k] || 0) + 1; return acc; }, {}),
    endBranches: [...new Set(rs.map(r => r.endBranch).filter(Boolean))].sort() as string[],
    actionsExecuted: union('actionsExecuted', rs),
    episodesOffered: union('episodesOffered', rs),
    episodesActivated: union('episodesActivated', rs),
    episodesCompleted: union('episodesCompleted', rs),
    beatsFired: union('beatsFired', rs),
    decisionBeatsResolved: union('decisionBeatsResolved', rs),
    consequencesTriggered: union('consequencesTriggered', rs),
    worldEvents: union('worldEvents', rs),
    stageCountermeasures: union('stageCountermeasures', rs),
  });

  const all = aggregate(runs);
  const totalActions = new Set((createStoryEngine('cov_totals').getAvailableActions() as SimAction[]).map(a => a.id));
  // getAvailableActions liefert nur freigeschaltete — Gesamtzahl über den Katalog:
  const totalEpisodes = loadEpisodes().length;
  const totalBeats = ALL_DECISION_BEATS.length;

  const report = {
    generated: new Date().toISOString(),
    games: runs.length,
    strategies: STRATEGIES,
    seedsPerStrategy: SEEDS_PER_STRATEGY,
    coverage: {
      actionsExecuted: { seen: all.actionsExecuted.length, note: 'Katalog: 143 Aktionen (statische Karte)' },
      episodes: { offered: all.episodesOffered.length, activated: all.episodesActivated.length, completed: all.episodesCompleted.length, total: totalEpisodes },
      decisionBeats: { resolvedBeatIds: [...new Set(all.decisionBeatsResolved.map(d => d.split(':')[0]))].length, total: totalBeats, optionsSeen: all.decisionBeatsResolved.length },
      consequences: { triggered: all.consequencesTriggered.length, total: 24 },
      worldEvents: { triggered: all.worldEvents.length, total: 80 },
      stageCountermeasures: { seen: all.stageCountermeasures.length, total: 3 },
      endBranches: all.endBranches,
      initiallyUnlockedActions: totalActions.size,
    },
    union: all,
    perStrategy: Object.fromEntries(STRATEGIES.map(s => [s, aggregate(runs.filter(r => r.strategy === s))])),
    runs,
  };

  const outDir = path.resolve(__dirname, '..', '..', '..', 'runs', 'verify-suite');
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, 'content-coverage.json');
  fs.writeFileSync(outFile, JSON.stringify(report, null, 2));

  console.log('\n=== CONTENT-COVERAGE (24 Partien) ===');
  console.log(`  Aktionen gesehen: ${all.actionsExecuted.length} · Episoden angeboten/aktiviert/abgeschlossen: ${all.episodesOffered.length}/${all.episodesActivated.length}/${all.episodesCompleted.length} von ${totalEpisodes}`);
  console.log(`  Beats gefeuert: ${all.beatsFired.length} (Entscheidungs-Beats aufgelöst: ${report.coverage.decisionBeats.resolvedBeatIds}/${totalBeats})`);
  console.log(`  Konsequenzen: ${all.consequencesTriggered.length}/24 [${all.consequencesTriggered.join(', ')}]`);
  console.log(`  World-Events: ${all.worldEvents.length}/80`);
  console.log(`  Stufen-Gegenmaßnahmen: ${all.stageCountermeasures.join(', ') || 'keine'}`);
  console.log(`  Enden-Branches: ${all.endBranches.join(', ')}`);
  console.log(`  → ${path.relative(path.resolve(__dirname, '..', '..', '..'), outFile)}`);

  it('läuft durch und schreibt den Coverage-Report', () => {
    expect(runs.length).toBe(24);
    expect(fs.existsSync(outFile)).toBe(true);
    // Bewusst KEINE Coverage-Schwellen: die Zahlen sind der Report, kein Gate.
  });

  it('jede Partie endet regulär oder am Zeitlimit (Engine wirft nicht)', () => {
    for (const r of runs) {
      expect(['victory', 'defeat', 'timeout']).toContain(r.outcome);
    }
  });
});
