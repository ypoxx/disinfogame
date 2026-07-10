/**
 * ImmuneSystem — der zweite Rennläufer: die ABWEHR (Etappe 3 „Immunsystem sichtbar").
 * ==================================================================================
 * Zielbild `ZIELBILD_2026-07-04_WETTRENNEN.md` §3/§7: Zwei Läufer rennen auf den
 * Wahltag zu — die Sonntagsfrage (Auftrags-Signatur, VictorySystem) und DIE ABWEHR,
 * das Immunsystem der Gesellschaft (0–100, Stufen 25/50/75, Verlust bei 100).
 *
 * Die ABWEHR ist kein Neubau, sondern der beförderte Gesellschaftswert
 * `wehrhaftigkeit`: Sie aggregiert die vorhandene Verteidiger-Maschinerie
 * (StoryActorAI-Spawns, armsRaceLevel) und den LÄRM des Spielers (Risiko-/
 * Aufmerksamkeits-Kosten der Aktionen) in EINE sichtbare Zahl mit End-Check.
 *
 * Vier Zuflüsse (Zielbild §3, Läufer 2):
 *   (a) Lärm        — Risiko-/Aufmerksamkeits-Kosten der heutigen Aktionen,
 *   (b) Verteidiger — passiver Zuwachs je gespawntem Akteur (skaliert mit Eskalation),
 *   (c) Maschen-Wiederholung — die n-te Wiederholung derselben Familie (18er-Vokabular
 *       des DisinfoMethodAtlas) erzeugt ein „Gepatcht"-Ereignis mit Abwehr-Sprung,
 *   (d) Zeitgrundrauschen — reines Abwarten verliert (das Land lernt auch von allein).
 *
 * Bremsen (Gegen-Operationen) laufen NICHT hier: `demoralization`-Aktionen senken
 * `wehrhaftigkeit` weiter über SocietyDynamics (Zermürbung = die „Bremse" §3).
 *
 * Pure Funktionen + Konstanten, kein React/Math.random → isoliert testbar
 * (gleiches Muster wie VictorySystem). Der Adapter hält den Zustand.
 */

// --- Kern-Konstanten (Balancing-Stellschrauben, Paket E kalibriert am Sim-Gate) ---
export const ABWEHR_START = 8;    // „Die Abwehr schläft anfangs fast — das Land ist naiv" (§5)
export const ABWEHR_MAX = 100;    // Verlust „Das Land hält stand"
export const ABWEHR_STAGES = [25, 50, 75] as const;

/** Lärm: Risiko-Kosten der eigenen Aktionen → Abwehr-Zufluss (Paket E: der Haupt-
 *  Treiber gegen aggressives Spiel — lautes Spiel fliegt am Immunsystem auf, nicht
 *  am Sofort-Risiko). Etappe 4 neu kalibriert: das Maschen-Gedächtnis dämpft jetzt
 *  den Spieler-Durchsatz (~⅓ langsamer) — das Rennen wird proportional verlangsamt,
 *  sonst gewinnt die Abwehr strukturell (Sim-Gate: greedy fiel auf 0 %). */
export const NOISE_RISK_FACTOR = 0.41;
/** Lärm: Aufmerksamkeits-Zuwachs der eigenen Aktionen → Abwehr-Zufluss. */
export const NOISE_ATTENTION_FACTOR = 0.26;
/** Passiver Zuwachs je Summe Verteidiger-Stärke und Tag. Paket E: höher gewichtet als
 *  die (deterministische) Baseline — Verteidiger spawnen seed-abhängig, das gibt der
 *  Abwehr die Streuung, die dieselbe Strategie mal knapp gewinnen, mal knapp verlieren lässt. */
export const DEFENDER_FACTOR = 0.7;
/** Eskalations-Bonus je armsRaceLevel-Stufe (wie getTrustRegeneration). */
export const ARMS_RACE_ESCALATION = 0.25;
/** Zeitgrundrauschen je Tag — reines Abwarten verliert (Zielbild §3d). */
export const BASELINE_PER_DAY = 0.38;
/** „Gepatcht": Abwehr-Sprung, wenn eine Maschen-Familie durchschaut wird. Etappe 4:
 *  4 → 3, denn der Patch stempelt die Familie zusätzlich ÜBERALL als BEKANNT
 *  (Wirkungs-Dämpfung) — derselbe Auslöser darf nicht doppelt voll strafen (Falle 10). */
export const PATCH_ABWEHR_JUMP = 3;
/** Jede n-te Wiederholung derselben Maschen-Familie wird durchschaut. */
export const PATCH_EVERY_N_USES = 3;

export type AbwehrStage = (typeof ABWEHR_STAGES)[number];

// --- Nächtlicher Abwehr-Schritt (läuft in advancePhase) ---------------------------

export interface AbwehrStepInput {
  /** Aktueller Abwehr-Stand (= storyResources.wehrhaftigkeit). */
  current: number;
  /** Summe der Risiko-Kosten aller heute gespielten Aktionen/Operationen. */
  noiseRisk: number;
  /** Summe der Aufmerksamkeits-Zuwächse aller heute gespielten Aktionen/Operationen. */
  noiseAttention: number;
  /** Summierte aktuelle Stärke der gespawnten Verteidiger (StoryActorAI). */
  defenderStrengthSum: number;
  /** Eskalationsstufe 0–5 (StoryActorAI.armsRaceLevel). */
  armsRaceLevel: number;
}

/** Aufgeschlüsselte Zuflüsse — Grundlage der Nacht-Transparenz im Tagesfazit (E5). */
export interface AbwehrParts {
  noise: number;
  defenders: number;
  baseline: number;
}

export interface AbwehrStepResult {
  next: number;
  delta: number;
  parts: AbwehrParts;
}

/** Ein nächtlicher Abwehr-Schritt: Lärm + Verteidiger + Grundrauschen, geklemmt auf 0–100. */
export function abwehrStep(i: AbwehrStepInput): AbwehrStepResult {
  const noise =
    Math.max(0, i.noiseRisk) * NOISE_RISK_FACTOR +
    Math.max(0, i.noiseAttention) * NOISE_ATTENTION_FACTOR;
  const defenders =
    Math.max(0, i.defenderStrengthSum) * DEFENDER_FACTOR *
    (1 + Math.max(0, i.armsRaceLevel) * ARMS_RACE_ESCALATION);
  const baseline = BASELINE_PER_DAY;

  const raw = noise + defenders + baseline;
  const next = clampAbwehr(i.current + raw);
  return {
    next,
    delta: next - i.current,
    parts: { noise, defenders, baseline },
  };
}

export function clampAbwehr(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(ABWEHR_MAX, v));
}

/** Welche Stufen (25/50/75) wurden zwischen zwei Ständen AUFWÄRTS überschritten? */
export function crossedAbwehrStages(before: number, after: number): AbwehrStage[] {
  if (after <= before) return [];
  return ABWEHR_STAGES.filter((s) => before < s && after >= s);
}

// --- Maschen-Wiederholung („Gepatcht", Zielbild §3c) -------------------------------

/** Wird bei diesem (kumulierten) Einsatz-Stand einer Familie ein Patch fällig? */
export function isPatchTriggered(useCount: number): boolean {
  return useCount > 0 && useCount % PATCH_EVERY_N_USES === 0;
}

/** Minimaler Familien-Ausschnitt aus dem DisinfoMethodAtlas (18er-Vokabular). */
export interface MethodFamilyRef {
  id: string;
  label_de: string;
  matchTags: string[];
}

/**
 * Erste Atlas-Familie, deren matchTags die Aktions-Tags treffen — Mechanik,
 * Quittungen und Endreport teilen so EIN Vokabular (Zielbild §7).
 */
export function methodFamilyForTags(
  tags: string[],
  families: MethodFamilyRef[],
): { id: string; label_de: string } | null {
  if (tags.length === 0) return null;
  for (const fam of families) {
    if (fam.matchTags.some((t) => tags.includes(t))) {
      return { id: fam.id, label_de: fam.label_de };
    }
  }
  return null;
}

// --- Nacht-Transparenz (Datenvertrag für das Tagesfazit, Paket D) ------------------

/** „Über Nacht: Institutionen holen X zurück, die Abwehr wächst um Y" (Zielbild §3). */
export interface NightReport {
  /** Tag, dessen Nacht bilanziert wird (die Phase VOR dem neuen Morgen). */
  day: number;
  /** Vertrauens-Punkte, die die Verteidiger über Nacht zurückgeholt haben. */
  trustRegeneration: number;
  /** Abwehr-Zuwachs dieser Nacht (nur der nächtliche Schritt, ohne Tages-Patches). */
  abwehrDelta: number;
  abwehrParts: AbwehrParts;
  /** Abwehr-Stand nach dem Schritt. */
  abwehrAfter: number;
}
