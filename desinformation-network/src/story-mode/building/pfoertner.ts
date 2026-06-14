/**
 * pfoertner — „Stimme des eigenen Landes" (Strang 5, D28).
 *
 * Der Pförtner in der Lobby ist ein bewusst KLEINER Flavor-Charakter: er liest den
 * Spielzustand (öffentliche Stimmung, Entdeckungsrisiko, letzte ausgespielte Sendung)
 * und gibt einen bodenständigen, warmen Stimmungs-Hinweis — KEINE Mechanik-Rückwirkung,
 * nur Atmosphäre + ein diegetisches Gefühl dafür, „wie es draußen steht".
 *
 * Pure Funktion → testbar; die Verdrahtung an Audience/Risk macht der Orchestrator.
 */

export interface PfoertnerContext {
  /** Entdeckungsrisiko 0..100. */
  risk: number;
  /** Dominante Publikums-Stimmung: 'ruhig' | 'verunsichert' | 'wuetend' | 'misstrauisch'. */
  publicMood: string;
  /** Schlagzeile der letzten Sendung (oder null). */
  lastHeadline: string | null;
}

const BY_MOOD: Record<string, string> = {
  ruhig: 'Ruhiger Tag. Die Leute draußen reden über Fußball, nicht über uns. So mag ich das.',
  verunsichert: 'Komische Stimmung draußen. Die Nachbarn tuscheln, wissen aber nicht recht, worüber.',
  wuetend: 'Draußen brodelt es. Sie haben die Leute ganz schön aufgewühlt da oben.',
  misstrauisch: 'Es wird gefragt, wer hier ein- und ausgeht. Halten Sie den Kopf unten.',
};

/**
 * Stimmungs-Hinweis des Pförtners. Hohes Risiko übertönt die Stimmung (er wird nervös);
 * bei einer frischen, brisanten Sendung greift er sie auf. Sonst spricht die Stimmung.
 */
export function pfoertnerLine(ctx: PfoertnerContext): string {
  if (ctx.risk >= 75) {
    return 'Pssst. Heute waren Leute hier und haben Fragen gestellt. Seien Sie vorsichtig da oben.';
  }
  if (ctx.lastHeadline && ctx.risk >= 35) {
    return `„${ctx.lastHeadline}" — das habe ich im Radio gehört. Verbreitet sich wie ein Lauffeuer.`;
  }
  return BY_MOOD[ctx.publicMood] ?? BY_MOOD.ruhig;
}

/** Dominante Publikums-Stimmung aus einer Segment-Liste (häufigste Stimmung). */
export function dominantMood(moods: string[]): string {
  if (moods.length === 0) return 'ruhig';
  const count = new Map<string, number>();
  for (const m of moods) count.set(m, (count.get(m) ?? 0) + 1);
  let best = moods[0];
  let bestN = 0;
  for (const [m, n] of count) if (n > bestN) { best = m; bestN = n; }
  return best;
}
