/**
 * NarrativeMemory — das „Gedächtnis des Dirigenten" (Spine Schicht 3, Befund C.3 im
 * `BAUPLAN_STORY_DIRECTOR_SPINE.md`). Macht *vergangenen* Spielzustand zum First-Class-
 * Input: welche Narrativ-Themen liefen wie oft und wie **inokuliert** ist das Publikum
 * inzwischen. Das ist der konkrete Treiber für **reaktive Beats** (Bumerang): derselbe
 * Anlass spielt anders je nach bisheriger Spielgeschichte.
 *
 * Reine Daten + reine Funktionen (kein React/Math.random) → testbar. Der Verfall wird
 * **beim Lesen** aus der vergangenen Zeit berechnet (kein Tick nötig): eine Erzählung
 * „klingt ab", wenn sie eine Weile nicht lief — und wird damit wieder recycelbar.
 */

export interface ThemaMemory {
  /** Wie oft das Thema gesät/recycelt wurde. */
  timesRun: number;
  /** „Roh"-Inokulation (0..100) zum Zeitpunkt des letzten Laufs; effektiv mit Verfall gelesen. */
  rawInoculation: number;
  /** Phase des letzten Laufs (Bezugspunkt für den Verfall). */
  lastRunPhase: number;
}

export type NarrativeMemoryState = Record<string, ThemaMemory>;

/** Inokulations-Zuwachs je Lauf (gesättigt bei 100). Wiederholung impft das Publikum. */
const INOC_STEP = 30;
/** Verfall der Inokulation je Phase ohne Lauf — die Erzählung „klingt ab" und wird recycelbar. */
const DECAY_PER_PHASE = 3;

/** Effektive Inokulation eines Themas JETZT: Roh-Wert minus Verfall seit dem letzten Lauf. */
export function effectiveInoculation(mem: ThemaMemory, phase: number): number {
  const elapsed = Math.max(0, phase - mem.lastRunPhase);
  return Math.max(0, Math.round(mem.rawInoculation - DECAY_PER_PHASE * elapsed));
}

/** Schreibt einen Lauf fort (immutabel): +1 timesRun, Inokulation (nach Verfall) + Schritt. */
export function recordThema(
  state: NarrativeMemoryState,
  themaId: string,
  phase: number,
): NarrativeMemoryState {
  const prev = state[themaId];
  const baseInoc = prev ? effectiveInoculation(prev, phase) : 0;
  return {
    ...state,
    [themaId]: {
      timesRun: (prev?.timesRun ?? 0) + 1,
      rawInoculation: Math.min(100, baseInoc + INOC_STEP),
      lastRunPhase: phase,
    },
  };
}

/** Effektive Inokulation eines Themas (0, wenn nie gelaufen). */
export function inoculationOf(state: NarrativeMemoryState, themaId: string, phase: number): number {
  const mem = state[themaId];
  return mem ? effectiveInoculation(mem, phase) : 0;
}

/** Lief dieses Thema schon mindestens einmal? (Voraussetzung für reaktive Beats wie Bumerang.) */
export function isSeeded(state: NarrativeMemoryState, themaId: string): boolean {
  return (state[themaId]?.timesRun ?? 0) >= 1;
}

/** Alle bisher gesäten Themen (für die reaktive Verfügbarkeit im Director-Pool). */
export function seededThemes(state: NarrativeMemoryState): string[] {
  return Object.keys(state).filter((k) => state[k].timesRun >= 1);
}
