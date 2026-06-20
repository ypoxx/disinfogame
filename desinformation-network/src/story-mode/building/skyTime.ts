/**
 * skyTime — Tageszeit-Himmel für den Gebäude-Querschnitt (pure, testbar).
 *
 * Statt eines festen dunklen Verlaufs (Owner-Befund: „schwarzer Himmel zu groß")
 * liefert dies einen tagesuhr-gesteuerten Verlauf über sechs Stützpunkte
 * Frühmorgen → Mittag → Nachmittag → goldene Stunde → blaue Stunde → Nacht.
 * Die chroma-freigestellte Skyline (`bld_city_far`) liegt davor, der Himmel
 * scheint hindurch → atmosphärische Abwechslung ohne neues Vollbild je Tageszeit.
 *
 * Tagesuhr: 0 min = 09:00, dayLengthMin (Default 540) = 18:00 (Redaktionsschluss).
 */

export interface SkyStops {
  top: string;
  mid: string;
  horizon: string;
}

type RGB = [number, number, number];

/** Stützpunkte über den Arbeitstag (t = 0..1). Werte bewusst gedämpft (Stil-Bibel v2). */
const KEYS: Array<{ t: number; top: RGB; mid: RGB; horizon: RGB }> = [
  { t: 0.0,  top: [26, 42, 74],  mid: [60, 86, 128],  horizon: [150, 170, 200] }, // Frühmorgen, kühl-hell
  { t: 0.33, top: [42, 74, 122], mid: [96, 134, 176], horizon: [190, 210, 228] }, // Mittag, hell
  { t: 0.6,  top: [40, 64, 108], mid: [110, 110, 140], horizon: [220, 180, 150] }, // Nachmittag, leicht warm
  { t: 0.78, top: [38, 46, 92],  mid: [120, 90, 90],   horizon: [224, 150, 90] },  // goldene Stunde
  { t: 0.9,  top: [20, 30, 58],  mid: [58, 58, 100],   horizon: [180, 96, 90] },   // blaue Stunde
  { t: 1.0,  top: [5, 7, 13],    mid: [10, 15, 28],    horizon: [26, 34, 56] },    // Nacht
];

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const lerp = (a: number, b: number, f: number) => Math.round(a + (b - a) * f);
const lerpRGB = (a: RGB, b: RGB, f: number): RGB => [lerp(a[0], b[0], f), lerp(a[1], b[1], f), lerp(a[2], b[2], f)];
const rgbStr = (c: RGB) => `rgb(${c[0]}, ${c[1]}, ${c[2]})`;

/** Interpolierte Himmelsfarben für einen Uhr-Zeitpunkt (Minuten ab 09:00). */
export function skyStopsForMinutes(minutes: number, dayLengthMin = 540): SkyStops {
  const t = clamp01(minutes / dayLengthMin);
  let i = 0;
  while (i < KEYS.length - 1 && t > KEYS[i + 1].t) i++;
  const a = KEYS[i];
  const b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const span = b.t - a.t || 1;
  const f = clamp01((t - a.t) / span);
  return {
    top: rgbStr(lerpRGB(a.top, b.top, f)),
    mid: rgbStr(lerpRGB(a.mid, b.mid, f)),
    horizon: rgbStr(lerpRGB(a.horizon, b.horizon, f)),
  };
}

/** CSS-`linear-gradient` für den Himmel zur gegebenen Tagesuhr-Minute. */
export function skyGradientForMinutes(minutes: number, dayLengthMin = 540): string {
  const s = skyStopsForMinutes(minutes, dayLengthMin);
  return `linear-gradient(${s.top} 0%, ${s.mid} 58%, ${s.horizon} 100%)`;
}

export interface SkylineLayers {
  /** Opazität der Dämmerungs-Skyline (0..1). */
  dusk: number;
  /** Opazität der Nacht-Skyline (0..1). */
  night: number;
}

const ramp = (x: number, a: number, b: number) => clamp01((x - a) / (b - a || 1));

/**
 * Opazitäten der Tageszeit-Skylines über die Tagesuhr. Die Basis-Skyline
 * (`bld_city_far`, Tag) liegt darunter und bleibt sichtbar; Dämmerung und Nacht
 * werden darüber ein-/ausgeblendet. Je Zeitband ist im Wesentlichen EINE Skyline
 * dominant — nur an den Bandgrenzen entsteht eine kurze Überblendung (die Varianten
 * teilen die Silhouette nicht 1:1, daher bewusst nur eine kurze Blende statt Dauer-Mix).
 */
export function skylineLayersForMinutes(minutes: number, dayLengthMin = 540): SkylineLayers {
  const t = clamp01(minutes / dayLengthMin);
  // Dämmerung blendet am Nachmittag ein und zur Nacht wieder aus; Nacht legt sich darüber.
  const dusk = ramp(t, 0.5, 0.62) * (1 - ramp(t, 0.82, 0.9));
  const night = ramp(t, 0.82, 0.92);
  return { dusk, night };
}
