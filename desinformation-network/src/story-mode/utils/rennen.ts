/**
 * rennen — geteilte Skalen- und Format-Regeln der zwei Läufer (Zielbild §6).
 * HUD, Lagebild und Narrativ-Tafel sprechen dieselben Zahlen mit derselben
 * Geometrie; drei lokale Kopien drifteten sonst auseinander (Review 2026-07-07):
 * derselbe Spielstand sähe in zwei Ansichten verschieden weit vom Ziel aus.
 */

export interface SonntagsfrageScale {
  /** Füllstand des Balkens (0–100, Skala reicht knapp über die Schwelle). */
  barPct: number;
  /** Position des Zielstrichs auf derselben Skala. */
  linePct: number;
  /** Schwelle erreicht (Balken wechselt auf Erfolgs-Farbe). */
  reached: boolean;
}

/** Skala bis knapp über die Schwelle, damit der Zielstrich nicht am Rand klebt. */
export function sonntagsfrageScale(pollPct: number, thresholdPct: number, headroom = 6): SonntagsfrageScale {
  const scaleMax = Math.max(pollPct, thresholdPct) + headroom;
  return {
    barPct: Math.min(100, (pollPct / scaleMax) * 100),
    linePct: Math.min(100, (thresholdPct / scaleMax) * 100),
    reached: pollPct >= thresholdPct,
  };
}

/** Umfragewert: eine Nachkommastelle, deutsches Komma (wie DayReport.formatDe). */
export function formatPollPct(pollPct: number): string {
  return `${pollPct.toFixed(1).replace('.', ',')} %`;
}

/** Machtwechsel-Schwelle: ganze Prozent. */
export function formatSchwellePct(thresholdPct: number): string {
  return `${thresholdPct.toFixed(0)} %`;
}

/** Abwehr-Stand: ganzzahlig auf der festen 0–100-Skala. */
export function formatAbwehr(abwehr: number): string {
  return `${Math.round(Math.max(0, Math.min(100, abwehr)))}/100`;
}
