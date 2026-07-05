/**
 * Finanzen — Geld-Tranchen der Zentrale (Etappe 5, E18 / Zielbild §11).
 * ====================================================================
 * Der passive Budget-Regen (+5/Phase) fällt weg. Stattdessen zahlt die Zentrale in
 * TRANCHEN nach Fortschritt: Wer liefert, bekommt nachgelegt (Übererfolg = Batzen +
 * Lob des Kurators); wer stagniert, wird gemahnt, dann gekürzt, dann handlungsunfähig.
 *
 * Geld ist damit Druck UND Belohnung — nie Selbstläufer. Die Pleite ist kein eigener
 * Game-Over mehr, sondern die Würgeschlinge auf dem Weg zu „Wahlabend verloren"
 * (Zielbild §4/§11): kein Geld → keine Aktionen → kein Fortschritt → Timeout.
 *
 * Pure Funktionen + Konstanten, kein React/Math.random → isoliert testbar
 * (gleiches Muster wie VictorySystem/ImmuneSystem). Der Adapter hält den Zustand.
 */

// --- Kern-Konstanten (Balancing-Stellschrauben, Paket E kalibriert am Sim-Gate) ---
/** Alle N Tage bewertet die Zentrale den Fortschritt und zahlt eine Tranche —
 *  im Takt der Sonntagsfrage (POLL_EVERY_PHASES): die Zentrale reagiert auf jede Umfrage. */
export const TRANCHE_INTERVAL_DAYS = 5;

/** Fortschritts-Delta (Auftrags-MITTEL, 0..1) je 5-Tage-Intervall, ab dem gilt: */
export const DELTA_BONUS = 0.16;    // Übererfolg — Batzen + Lob
export const DELTA_PLAN = 0.08;     // im Plan — volle Tranche
export const DELTA_PARTIAL = 0.025; // etwas geliefert — halbe Tranche

/** Auszahlungen (Budget in Tausend Euro; Startbudget 150). */
export const TRANCHE_BASE = 30;     // „im Plan"
export const TRANCHE_BONUS_EXTRA = 18; // Übererfolg obendrauf → 48
export const TRANCHE_PARTIAL = 16;
export const TRANCHE_MAHN1 = 8;     // erste Mahnung: noch ein Rest
export const TRANCHE_MAHN2 = 0;     // zweite Mahnung: keine Tranche
export const TRANCHE_KUERZUNG = -12; // ab dritter Mahnung: die Zentrale kürzt aktiv

export type TrancheBewertung = 'bonus' | 'plan' | 'partial' | 'mahnung1' | 'mahnung2' | 'kuerzung';

export interface TrancheContext {
  /** Kampagnentag der Bewertung (Tranche fällt an Tagen 5/10/15/…). */
  day: number;
  /** Aktueller Auftrags-Fortschritt (MITTEL über die Signatur, 0..1). */
  progressNow: number;
  /** Fortschritt bei der letzten Tranche (Bezugspunkt für die Lieferung). */
  progressAtLastTranche: number;
  /** Bisherige Mahnstufe (0 = im Soll). */
  mahnstufe: number;
}

export interface TrancheResult {
  day: number;
  /** Signierter Budget-Delta: positiv = Tranche, negativ = Kürzung (Würgeschlinge). */
  auszahlung: number;
  bewertung: TrancheBewertung;
  neueMahnstufe: number;
  /** Fortschritt seit der letzten Tranche (für die Transparenz im Tagesfazit). */
  fortschrittDelta: number;
  /** Tagesfazit-Zeile („Die Zentrale zahlt …"). */
  text_de: string;
  text_en: string;
  /** Schlagzeile für den News-Feed bei Bonus/Mahnung (leer = keine News). */
  headline_de: string;
  headline_en: string;
}

/** Fällt an diesem Kampagnentag eine Tranche an? (Tage 5/10/15/…) */
export function istTrancheTag(day: number): boolean {
  return day > 0 && day % TRANCHE_INTERVAL_DAYS === 0;
}

/**
 * Bewertet den Fortschritt seit der letzten Tranche und bestimmt Auszahlung, Mahnstufe
 * und die erzählerische Quittung des Kurators. Pure — der Aufrufer wendet `auszahlung`
 * aufs Budget an und persistiert `neueMahnstufe`.
 */
export function bewerteTranche(ctx: TrancheContext): TrancheResult {
  const delta = ctx.progressNow - ctx.progressAtLastTranche;
  const base = { day: ctx.day, fortschrittDelta: delta };

  if (delta >= DELTA_BONUS) {
    return {
      ...base,
      auszahlung: TRANCHE_BASE + TRANCHE_BONUS_EXTRA,
      bewertung: 'bonus',
      neueMahnstufe: 0,
      text_de: `Die Zentrale ist zufrieden: Tranche +${TRANCHE_BASE + TRANCHE_BONUS_EXTRA}k, mit einem Batzen obendrauf.`,
      text_en: `The Central is pleased: tranche +${TRANCHE_BASE + TRANCHE_BONUS_EXTRA}k, with a bonus on top.`,
      headline_de: 'Die Zentrale legt nach',
      headline_en: 'The Central pays up',
    };
  }
  if (delta >= DELTA_PLAN) {
    return {
      ...base,
      auszahlung: TRANCHE_BASE,
      bewertung: 'plan',
      neueMahnstufe: Math.max(0, ctx.mahnstufe - 1),
      text_de: `Die Zentrale überweist die Tranche: +${TRANCHE_BASE}k.`,
      text_en: `The Central wires the tranche: +${TRANCHE_BASE}k.`,
      headline_de: '',
      headline_en: '',
    };
  }
  if (delta >= DELTA_PARTIAL) {
    return {
      ...base,
      auszahlung: TRANCHE_PARTIAL,
      bewertung: 'partial',
      neueMahnstufe: ctx.mahnstufe,
      text_de: `Wenig Bewegung. Die Zentrale zahlt gekürzt: +${TRANCHE_PARTIAL}k.`,
      text_en: `Little movement. The Central pays a reduced +${TRANCHE_PARTIAL}k.`,
      headline_de: '',
      headline_en: '',
    };
  }

  // Stagnation → eskalierende Mahnung (die Würgeschlinge).
  const neueMahnstufe = ctx.mahnstufe + 1;
  if (neueMahnstufe === 1) {
    return {
      ...base,
      auszahlung: TRANCHE_MAHN1,
      bewertung: 'mahnung1',
      neueMahnstufe,
      text_de: `Mahnung: Die Zentrale erwartet Ergebnisse. Nur noch +${TRANCHE_MAHN1}k.`,
      text_en: `Warning: the Central expects results. Only +${TRANCHE_MAHN1}k left.`,
      headline_de: 'Die Zentrale wird ungeduldig',
      headline_en: 'The Central grows impatient',
    };
  }
  if (neueMahnstufe === 2) {
    return {
      ...base,
      auszahlung: TRANCHE_MAHN2,
      bewertung: 'mahnung2',
      neueMahnstufe,
      text_de: 'Die Zentrale friert die Tranche ein: keine Zahlung diese Woche.',
      text_en: 'The Central freezes the tranche: no payment this week.',
      headline_de: 'Die Zentrale friert die Mittel ein',
      headline_en: 'The Central freezes the funds',
    };
  }
  // Ab Mahnstufe 3: aktive Kürzung — die Zentrale zieht die Zügel an.
  return {
    ...base,
    auszahlung: TRANCHE_KUERZUNG,
    bewertung: 'kuerzung',
    neueMahnstufe,
    text_de: `Die Zentrale kürzt Ihr Budget (${TRANCHE_KUERZUNG}k). Liefern Sie — oder es ist vorbei.`,
    text_en: `The Central cuts your budget (${TRANCHE_KUERZUNG}k). Deliver — or it's over.`,
    headline_de: 'Die Zentrale kürzt das Budget',
    headline_en: 'The Central cuts the budget',
  };
}
