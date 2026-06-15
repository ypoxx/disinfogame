/**
 * Erzählerische Gegenseite (P6/C9, Konzept §14.3) — die Aufklärung wird wahrnehmbar.
 *
 * Aus dem, was die Maschine ohnehin berechnet (Aufmerksamkeit/Entdeckungsdruck/verbrannte
 * Verbreiter), wird eine kleine Geschichte: Wie weit ist die Gegenseite (Faktenchecker,
 * Redaktionen)? Manchmal weiß sie viel, manchmal (noch) nichts. Erscheint im Newsroom als
 * „Im Gespräch" / „Talk am Abend" / „Westunion-Bericht". Pure Funktion, kein Math.random.
 */

export interface GegenseiteReport {
  /** 0..1 — Wissensstand/Aufklärungsgrad der Gegenseite. */
  awareness: number;
  /** Newsroom-Format (rotiert), gibt der Vignette ihren Rahmen. */
  format_de: string;
  /** 1–3 kurze Vignetten, die den Stand erzählen. */
  lines: string[];
}

const FORMATE = ['Im Gespräch', 'Talk am Abend', 'Westunion-Bericht'];

export interface GegenseiteContext {
  attention: number;       // 0–100
  risk: number;            // 0–100
  carriersBurned: number;  // Anzahl enttarnter Verbreiter
  phase: number;
}

/** Berechnet den Aufklärungsgrad 0..1 aus dem Lage-Bild. */
export function gegenseiteAwareness(ctx: GegenseiteContext): number {
  const base = (ctx.attention * 0.6 + ctx.risk * 0.4) / 100;
  const burn = Math.min(0.3, ctx.carriersBurned * 0.08);
  return Math.max(0, Math.min(1, base + burn));
}

/** Leitet die erzählerische Gegenseite aus dem Lage-Bild ab. */
export function deriveGegenseite(ctx: GegenseiteContext): GegenseiteReport {
  const awareness = gegenseiteAwareness(ctx);
  const format_de = FORMATE[ctx.phase % FORMATE.length];

  let lines: string[];
  if (awareness < 0.25) {
    lines = [
      'Die Aufklärung tappt weitgehend im Dunkeln. Niemand verbindet die einzelnen Vorfälle.',
    ];
  } else if (awareness < 0.5) {
    lines = [
      'Eine Faktencheckerin stutzt: drei Gerüchte, ein Muster. Noch ist es nur ein Bauchgefühl.',
      'In einer kleinen Redaktion liegt eine Notiz auf dem Tisch — mehr noch nicht.',
    ];
  } else if (awareness < 0.75) {
    lines = [
      'Mehrere Redaktionen vergleichen Notizen. Das Wort „Kampagne" fällt zum ersten Mal laut.',
      'Eine Journalistin bittet um ein Interview mit der Faktencheckerin — die Spur wird heiß.',
    ];
  } else {
    lines = [
      'Eine Faktencheckerin rekonstruiert die Operation öffentlich. Eine Enttarnung rückt näher.',
      'Im Abendprogramm wird Ihre Handschrift benannt — das Publikum hört genau hin.',
    ];
  }

  return { awareness, format_de, lines };
}
