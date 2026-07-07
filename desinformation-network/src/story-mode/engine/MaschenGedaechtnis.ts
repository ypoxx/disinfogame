/**
 * MaschenGedaechtnis — Impfung & Abstumpfung (Etappe 4, Zielbild §6/§7).
 * =======================================================================
 * Das Immunsystem bekommt sein Gedächtnis: je (Milieu × Maschen-Familie) merkt sich
 * die Gesellschaft, was sie schon gesehen hat. Wiederholung derselben Familie im
 * selben Milieu verpufft (Wirkungs-Multiplikator 1,0 → 0,6 → 0,3), Ruhen lässt die
 * Antikörper zerfallen (Familien rotieren wird echte Strategie), und Impfung
 * (Prebunking > Debunking) ist ein EIGENER Kanal mit eigenem Zerfall.
 *
 * Der Spieler sieht die Matrix NIE als Zahl (E6/Jury-Auflage) — nur als
 * FRISCH/BEKANNT/VERBRANNT-Stempel auf der Aktionskarte (VOR dem Ausgeben, E7)
 * und als Wohnzimmer-Alphabet (Abwinken vor dem TV, Faktencheck-Zeitung).
 * Jede Verpuffung nennt Ursache, Tag und Gegenmaßnahme (E5) — `erklaereDaempfung`.
 *
 * Muster wie NarrativeMemory/ImmuneSystem: reine Daten + reine Funktionen, kein
 * React/Math.random; der Verfall wird BEIM LESEN aus der vergangenen Zeit
 * berechnet (kein Tick nötig). Der Adapter hält den Zustand (Save/Load additiv).
 */

import type { AudienceSegment, Channel } from '../audience/audienceModel';

// ── Zustand ────────────────────────────────────────────────────────────────────────

/** Abstumpfungs-Zelle: „Roh-Abnutzung" zum Zeitpunkt des letzten Einsatzes. */
export interface AbstumpfungCell {
  wear: number;
  lastPhase: number;
}

/** Impf-Zelle: Roh-Immunität (0..1) + Setz-Tag (für die E5-Quittung). */
export interface ImpfungCell {
  value: number;
  lastPhase: number;
  /** Spieltag, an dem die Impfung gesetzt wurde („…, Tag 9"). */
  day: number;
}

/** Schlüssel: `${milieuId}|${familyId}` — die 8×18-Matrix als flaches Record. */
export interface MaschenGedaechtnisState {
  abstumpfung: Record<string, AbstumpfungCell>;
  /** Prebunking-Immunität: groß, langsam zerfallend (Forschungsbefund als Regel). */
  prebunk: Record<string, ImpfungCell>;
  /** Reaktiver Faktencheck: klein, schnell zerfallend — nur betroffenes Milieu/Thema. */
  factcheck: Record<string, ImpfungCell>;
  /** Einsatz-Events je Familie (Patch-Trigger, ersetzt die alte globale Zählung). */
  familienEinsaetze: Record<string, number>;
}

export function leeresMaschenGedaechtnis(): MaschenGedaechtnisState {
  return { abstumpfung: {}, prebunk: {}, factcheck: {}, familienEinsaetze: {} };
}

export function zellKey(milieuId: string, familyId: string): string {
  return `${milieuId}|${familyId}`;
}

// ── Konstanten (Balancing-Stellschrauben, Paket E kalibriert am Sim-Gate) ──────────

/** Abnutzung je Einsatz; gedeckelt, damit Erholung erreichbar bleibt (kein Dauer-0,3). */
export const WEAR_STEP = 1;
export const WEAR_MAX = 3;
/** Verfall je Tag ohne Einsatz — von BEKANNT zurück zu FRISCH in ~4 Tagen
 *  (Ruhen/Rotieren muss sich innerhalb der 40-Tage-Kampagne mehrfach lohnen). */
export const WEAR_DECAY_PER_DAY = 0.3;

/** Multiplikator-Stufen (Zielbild §7): 1,0 → 0,6 → 0,3. */
export const MULT_FRISCH = 1.0;
export const MULT_BEKANNT = 0.6;
export const MULT_VERBRANNT = 0.3;
/** Schwellen auf der effektiven Abnutzung (statt roher 1/2): Beim Tages-Rhythmus
 *  liegt der 2. Einsatz bei 1−Verfall (0,7) und der 3. bei 2−2·Verfall (1,4) —
 *  die Schwellen 0,5/1,35 halten so die kanonische Treppe 1,0 → 0,6 → 0,3 (§7),
 *  während 2 Ruhetage eine Stufe zurück erlauben (Rotation lohnt). Exportiert,
 *  damit Alphabet/Tests dieselben Schwellen lesen (keine divergenten Kopien). */
export const WEAR_BEKANNT_AB = 0.5;
export const WEAR_VERBRANNT_AB = 1.35;

/** Prebunking: große Familien-Immunität, zerfällt über ~Wochen (cm24, Stufe 25). */
export const PREBUNK_STRENGTH = 0.45;
export const PREBUNK_DECAY_PER_DAY = 0.015;
export const PREBUNK_CAP = 0.6;
/** Reaktiver Faktencheck: kleine Immunität, in wenigen Tagen verflogen. */
export const FACTCHECK_STRENGTH = 0.2;
export const FACTCHECK_DECAY_PER_DAY = 0.07;
export const FACTCHECK_CAP = 0.35;

/** Untergrenze der Gesamt-Wirkung: nichts verpufft je auf 0 (E9 — kein Frust-Nullsummenspiel). */
export const MIN_WIRKUNG = 0.15;

/** Patch-Folge („Masche durchschaut"): Familie gilt danach überall mindestens als BEKANNT. */
export const PATCH_WEAR_FLOOR = 1.0;

// ── Lesen (Verfall beim Lesen, kein Tick) ──────────────────────────────────────────

/** Effektive Abnutzung einer Zelle JETZT (Roh-Wert minus Verfall seit letztem Einsatz). */
export function effektiveAbstumpfung(
  state: MaschenGedaechtnisState,
  milieuId: string,
  familyId: string,
  phase: number,
): number {
  const cell = state.abstumpfung[zellKey(milieuId, familyId)];
  if (!cell) return 0;
  const elapsed = Math.max(0, phase - cell.lastPhase);
  return Math.max(0, cell.wear - WEAR_DECAY_PER_DAY * elapsed);
}

function effektiveImpfzelle(cell: ImpfungCell | undefined, phase: number, decay: number): number {
  if (!cell) return 0;
  const elapsed = Math.max(0, phase - cell.lastPhase);
  return Math.max(0, cell.value - decay * elapsed);
}

/** Effektive Gesamt-Immunität 0..1 (Prebunking ∪ Faktencheck, nicht doppelt gezählt). */
export function effektiveImpfung(
  state: MaschenGedaechtnisState,
  milieuId: string,
  familyId: string,
  phase: number,
): number {
  const key = zellKey(milieuId, familyId);
  const p = effektiveImpfzelle(state.prebunk[key], phase, PREBUNK_DECAY_PER_DAY);
  const f = effektiveImpfzelle(state.factcheck[key], phase, FACTCHECK_DECAY_PER_DAY);
  return 1 - (1 - p) * (1 - f);
}

/** Abnutzungs-Stufe → Multiplikator (die 1,0/0,6/0,3-Treppe). */
export function abstumpfungsMultiplikator(effWear: number): number {
  if (effWear >= WEAR_VERBRANNT_AB) return MULT_VERBRANNT;
  if (effWear >= WEAR_BEKANNT_AB) return MULT_BEKANNT;
  return MULT_FRISCH;
}

/** Gesamt-Wirkungsmultiplikator einer (Milieu × Familie)-Zelle: Abstumpfung × (1 − Impfung). */
export function wirkungsMultiplikator(
  state: MaschenGedaechtnisState,
  milieuId: string,
  familyId: string,
  phase: number,
): number {
  const wearMult = abstumpfungsMultiplikator(effektiveAbstumpfung(state, milieuId, familyId, phase));
  const immun = effektiveImpfung(state, milieuId, familyId, phase);
  return Math.max(MIN_WIRKUNG, wearMult * (1 - immun));
}

export type MaschenStempel = 'frisch' | 'bekannt' | 'verbrannt';

/** Stempel-Schwellen auf dem GESAMT-Multiplikator: auch ein geimpftes Milieu stempelt
 *  BEKANNT — der Spieler sieht die Wirkung, nie die Ursache als Zahl (E6). */
export function stempelFuer(
  state: MaschenGedaechtnisState,
  milieuId: string,
  familyId: string,
  phase: number,
): MaschenStempel {
  // Strikt > 0,8: eine reine Faktencheck-Impfung (Multiplikator exakt 0,8) stempelt
  // BEKANNT — der Spieler wird schon auf der Karte gewarnt (Review-Befund 5).
  const m = wirkungsMultiplikator(state, milieuId, familyId, phase);
  if (m > 0.8) return 'frisch';
  if (m >= 0.45) return 'bekannt';
  return 'verbrannt';
}

// ── Schreiben (immutabel, Muster NarrativeMemory) ──────────────────────────────────

/**
 * Ein Einsatz der Familie in den Ziel-Milieus: Abnutzung je Zelle +1 (auf den
 * effektiven Wert nach Verfall), Familien-Einsatzzähler +1 (Patch-Trigger).
 */
export function registriereEinsatz(
  state: MaschenGedaechtnisState,
  familyId: string,
  milieuIds: string[],
  phase: number,
): { state: MaschenGedaechtnisState; einsatzNr: number } {
  const abstumpfung = { ...state.abstumpfung };
  for (const milieuId of milieuIds) {
    const eff = effektiveAbstumpfung(state, milieuId, familyId, phase);
    abstumpfung[zellKey(milieuId, familyId)] = {
      wear: Math.min(WEAR_MAX, eff + WEAR_STEP),
      lastPhase: phase,
    };
  }
  const einsatzNr = (state.familienEinsaetze[familyId] ?? 0) + 1;
  return {
    state: {
      ...state,
      abstumpfung,
      familienEinsaetze: { ...state.familienEinsaetze, [familyId]: einsatzNr },
    },
    einsatzNr,
  };
}

function impfe(
  cells: Record<string, ImpfungCell>,
  familyId: string,
  milieuIds: string[],
  phase: number,
  staerke: number,
  decay: number,
  cap: number,
): Record<string, ImpfungCell> {
  const next = { ...cells };
  for (const milieuId of milieuIds) {
    const key = zellKey(milieuId, familyId);
    const eff = effektiveImpfzelle(cells[key], phase, decay);
    next[key] = { value: Math.min(cap, eff + staerke), lastPhase: phase, day: phase };
  }
  return next;
}

/** Prebunking-Kampagne (cm24): große, langsam zerfallende Familien-Immunität —
 *  aber NUR in den erreichten Milieus (medienferne bleiben die Lücke, Doppelboden §7). */
export function impfePrebunking(
  state: MaschenGedaechtnisState,
  familyId: string,
  milieuIds: string[],
  phase: number,
  staerke: number = PREBUNK_STRENGTH,
): MaschenGedaechtnisState {
  return {
    ...state,
    prebunk: impfe(state.prebunk, familyId, milieuIds, phase, staerke, PREBUNK_DECAY_PER_DAY, PREBUNK_CAP),
  };
}

/** Reaktiver Faktencheck: kleine, schnell zerfallende Immunität fürs betroffene Milieu/Thema. */
export function impfeFaktencheck(
  state: MaschenGedaechtnisState,
  familyId: string,
  milieuIds: string[],
  phase: number,
  staerke: number = FACTCHECK_STRENGTH,
): MaschenGedaechtnisState {
  return {
    ...state,
    factcheck: impfe(state.factcheck, familyId, milieuIds, phase, staerke, FACTCHECK_DECAY_PER_DAY, FACTCHECK_CAP),
  };
}

/**
 * Patch-Folge („Masche durchschaut", ImmuneSystem-Zufluss c): Die Familie gilt danach
 * in ALLEN Milieus mindestens als BEKANNT — EIN System statt zweier Buchführungen
 * (die alte globale Zählung zieht hierher um, HANDOFF Falle 6).
 */
export function markiereFamilieBekannt(
  state: MaschenGedaechtnisState,
  familyId: string,
  milieuIds: string[],
  phase: number,
): MaschenGedaechtnisState {
  const abstumpfung = { ...state.abstumpfung };
  for (const milieuId of milieuIds) {
    const eff = effektiveAbstumpfung(state, milieuId, familyId, phase);
    abstumpfung[zellKey(milieuId, familyId)] = {
      wear: Math.min(WEAR_MAX, Math.max(eff, PATCH_WEAR_FLOOR)),
      lastPhase: phase,
    };
  }
  return { ...state, abstumpfung };
}

// ── Ziel-Milieus & Aggregation ─────────────────────────────────────────────────────

/** Tag → Kanal (erste Übereinstimmung gewinnt; Default: tv).
 *  Bis Etappe 4 lebte diese Tabelle in der Anzeige-Schicht (broadcastMapping) —
 *  per E16 wirkt das Publikum jetzt mechanisch zurück, also zieht sie in die Engine;
 *  die Broadcast-Anzeige importiert von hier (EIN Vokabular). */
export const KANAL_JE_TAG: Array<[string[], Channel]> = [
  // Social-native Maschen (Bot-/Flut-Familie) laufen über soziale Kanäle.
  [['digital', 'automation', 'personas', 'persona', 'online', 'amplification', 'organic', 'bots', 'coordinated', 'flooding'], 'social'],
  // Erinnerungs-/Geschichts-Maschen tragen über gedruckte/etablierte Kanäle (Lokalpresse, Chroniken).
  [['academic', 'institutional', 'legitimacy', 'financial', 'expert', 'education', 'memory', 'history'], 'print'],
];

/** Tag → Publikums-Themen (Vokabular aus audience.json meta.vulnerabilities).
 *  Etappe „Vortest": um die Phänomen-Familien (11.x) erweitert, damit jede Masche ein
 *  eigenes Resonanzgruppen-Profil ausleuchtet (statt pauschal auf misstrauen_medien).
 *  Wirkt auch im Wettrennen (registerMethodFamilyUse) — Balance über die Sim geprüft. */
export const THEMEN_JE_TAG: Record<string, string[]> = {
  political: ['anti_establishment'],
  media: ['misstrauen_medien'],
  amplification: ['misstrauen_medien'],
  financial: ['wirtschafts_sorge', 'abstiegs_angst'],
  funding: ['wirtschafts_sorge', 'abstiegs_angst'],
  security: ['sicherheits_beduerfnis'],
  defense: ['sicherheits_beduerfnis'],
  division: ['anti_establishment', 'soziale_gerechtigkeit'],
  targeting: ['anti_establishment'],
  operation: ['misstrauen_medien', 'anti_establishment'],
  recruitment: ['anti_establishment'],
  espionage: ['misstrauen_medien'],
  // ── Phänomen-Familien (11.x) ──
  // Überflutung / Firehose → Medien-Misstrauen.
  flooding: ['misstrauen_medien'],
  fact_checkers: ['misstrauen_medien'],
  disruption: ['misstrauen_medien'],
  trust: ['misstrauen_medien'],
  // Gerüchte-Ökologie → „die da oben" + Medien-Misstrauen.
  rumor: ['anti_establishment', 'misstrauen_medien'],
  conspiracy: ['anti_establishment', 'misstrauen_medien'],
  confusion: ['misstrauen_medien'],
  // Zermürbung / Demobilisierung → Abstiegsangst + Anti-Establishment.
  demoralization: ['abstiegs_angst', 'anti_establishment'],
  fear: ['abstiegs_angst', 'sicherheits_beduerfnis'],
  emotional: ['abstiegs_angst'],
  election: ['anti_establishment'],
  // Krisen-Vakuum → Sicherheitsbedürfnis + Energieangst.
  crisis: ['sicherheits_beduerfnis', 'energie_angst'],
  // Identitäts-/Loyalitätsfalle → Sicherheit/Nostalgie (Identität) + Gerechtigkeit/Establishment (Polarisierung).
  identity: ['sicherheits_beduerfnis', 'nostalgie'],
  nationalism: ['sicherheits_beduerfnis', 'nostalgie'],
  polarization: ['soziale_gerechtigkeit', 'anti_establishment'],
  loyalty: ['nostalgie'],
  // Erinnerungskonflikt → Nostalgie.
  memory: ['nostalgie'],
  history: ['nostalgie'],
  // Allgemeine Destabilisierung → Anti-Establishment.
  destabilization: ['anti_establishment'],
};

export const STANDARD_THEMEN = ['misstrauen_medien'];

export function kanalFuerTags(tags: string[]): Channel {
  for (const [tagList, ch] of KANAL_JE_TAG) {
    if (tags.some((t) => tagList.includes(t))) return ch;
  }
  return 'tv';
}

export function themenFuerTags(tags: string[]): string[] {
  const themes = [...new Set(tags.flatMap((t) => THEMEN_JE_TAG[t] ?? []))];
  return themes.length > 0 ? themes : STANDARD_THEMEN;
}

export interface ZielMilieu {
  id: string;
  label_de: string;
  /** Reichweiten-Gewicht (Segmentgröße × Resonanz-Anteil, wie audienceModel.reach). */
  gewicht: number;
  /** Themen-Resonanz 0..1 — nur wo die Botschaft verfängt, stumpft man auch ab. */
  resonanz: number;
}

/**
 * Welche Milieus „sieht" eine Aktion? Kanal aus den Tags, erreicht = Kanal im
 * reachedBy des Segments; Gewicht wie die Reichweiten-Formel des Publikums-Modells
 * (Grundreichweite 0,3 + Resonanz-Anteil 0,7). Sortiert nach Gewicht.
 */
export function zielMilieusFuerTags(tags: string[], segmente: AudienceSegment[]): ZielMilieu[] {
  const kanal = kanalFuerTags(tags);
  const themen = themenFuerTags(tags);
  return segmente
    .filter((s) => s.reachedBy.includes(kanal))
    .map((s) => {
      const treffer = themen.filter((t) => s.vulnerabilities.includes(t)).length;
      const resonanz = themen.length > 0 ? treffer / themen.length : 0;
      return { id: s.id, label_de: s.label_de, gewicht: s.size * (0.3 + 0.7 * resonanz), resonanz };
    })
    .sort((a, b) => b.gewicht - a.gewicht);
}

/**
 * In WELCHEN Milieus nutzt sich ein Einsatz ab? Nur dort, wo die Botschaft resoniert —
 * die nur beiläufig Erreichten stumpfen nicht ab. Das hält „Milieu wechseln" als
 * echte Ausweich-Strategie offen (Zielbild §7: rotieren/wechseln/anfordern).
 * Resoniert nirgends etwas, ermüdet wenigstens das größte erreichte Milieu.
 */
export function brennendeMilieus(ziele: ZielMilieu[]): ZielMilieu[] {
  const resonante = ziele.filter((z) => z.resonanz > 0);
  if (resonante.length > 0) return resonante;
  return ziele.length > 0 ? [ziele[0]] : [];
}

/** Gewichteter Gesamt-Multiplikator über die Ziel-Milieus einer Aktion. */
export function gewichteterMultiplikator(
  state: MaschenGedaechtnisState,
  familyId: string,
  ziele: ZielMilieu[],
  phase: number,
): number {
  const gewichtSumme = ziele.reduce((sum, z) => sum + z.gewicht, 0);
  if (gewichtSumme <= 0) return 1;
  const gewichtet = ziele.reduce(
    (sum, z) => sum + wirkungsMultiplikator(state, z.id, familyId, phase) * z.gewicht,
    0,
  );
  return gewichtet / gewichtSumme;
}

// ── E5-Quittung: Ursache, Tag, Gegenmaßnahme ───────────────────────────────────────

export type DaempfungsGrund = 'abstumpfung' | 'prebunking' | 'faktencheck';

export interface DaempfungsErklaerung {
  grund: DaempfungsGrund;
  /** Spieltag der Ursache (Impf-Tag bzw. letzter Wiederholungs-Einsatz). */
  tag: number;
  /** Milieu mit dem stärksten Beitrag (für den Quittungs-Text). */
  milieuLabel: string;
}

/**
 * Dominante Ursache der Verpuffung über die Ziel-Milieus (für die kühle Quittung, E5:
 * „Wirkung: gering. Grund: Masche bekannt — Prebunking-Kampagne, Tag 9"). Null, wenn
 * nichts nennenswert dämpft.
 */
export function erklaereDaempfung(
  state: MaschenGedaechtnisState,
  familyId: string,
  ziele: ZielMilieu[],
  phase: number,
): DaempfungsErklaerung | null {
  let best: { beitrag: number; erklaerung: DaempfungsErklaerung } | null = null;
  for (const z of ziele) {
    const key = zellKey(z.id, familyId);
    const wearMult = abstumpfungsMultiplikator(effektiveAbstumpfung(state, z.id, familyId, phase));
    const p = effektiveImpfzelle(state.prebunk[key], phase, PREBUNK_DECAY_PER_DAY);
    const f = effektiveImpfzelle(state.factcheck[key], phase, FACTCHECK_DECAY_PER_DAY);

    const kandidaten: Array<{ beitrag: number; grund: DaempfungsGrund; tag: number }> = [
      { beitrag: 1 - wearMult, grund: 'abstumpfung', tag: state.abstumpfung[key]?.lastPhase ?? phase },
      { beitrag: p, grund: 'prebunking', tag: state.prebunk[key]?.day ?? phase },
      { beitrag: f, grund: 'faktencheck', tag: state.factcheck[key]?.day ?? phase },
    ];
    for (const k of kandidaten) {
      // Gewichtet mit dem Milieu-Gewicht: die Ursache im größten betroffenen Milieu zählt.
      const beitrag = k.beitrag * z.gewicht;
      if (beitrag > 0.01 && (!best || beitrag > best.beitrag)) {
        best = { beitrag, erklaerung: { grund: k.grund, tag: k.tag, milieuLabel: z.label_de } };
      }
    }
  }
  return best?.erklaerung ?? null;
}
