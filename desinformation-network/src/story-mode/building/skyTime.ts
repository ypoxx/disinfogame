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

/**
 * CSS-`linear-gradient` für den Himmel zur gegebenen Tagesuhr-Minute.
 *
 * P13 (Fremdmodell-Durchgang 2026-08-22) — GEOMETRIE VOR PALETTE:
 * Der Verlauf wird als Hintergrund des VIEWPORT-Containers gemalt, seine Stops
 * lagen aber fest auf 0 % / 58 % / 100 %. 100 % ist die Fensterunterkante — die
 * liegt weit unter der Bodenlinie und ist von Skyline, Straße und Untergrund
 * vollständig verdeckt. Gemessen an sky_0900.png: freier Himmel nur bis y≈320
 * von 720. Sichtbar war also IMMER nur das dunkelste obere Drittel des Verlaufs,
 * und der helle Horizont-Stützpunkt hat den Bildschirm nie erreicht.
 *
 * Beide Modelle schlugen „den Mittag aufhellen" vor. Das wäre größtenteils
 * unsichtbar geblieben: Wer nur die Palette anfasst, ändert Pixel hinter der
 * Skyline. Deshalb bekommt der Verlauf jetzt gesagt, wo der Himmel tatsächlich
 * aufhört — die drei Stützpunkte verteilen sich über die SICHTBARE Zone, der
 * Horizont-Ton hält von dort bis zum Fensterrand.
 *
 * @param sichtbarerAnteil 0..1 — wo die Skyline den Himmel deckt (1 = alter Stand).
 */
export function skyGradientForMinutes(minutes: number, dayLengthMin = 540, sichtbarerAnteil = 1): string {
  const s = skyStopsForMinutes(minutes, dayLengthMin);
  // Unter ~15 % Resthimmel lohnt die Stauchung nicht mehr und der Verlauf würde
  // zu einer harten Kante zusammenfallen.
  const v = Math.max(0.15, Math.min(1, sichtbarerAnteil));
  const mid = Math.round(58 * v);
  const horizont = Math.round(100 * v);
  return horizont >= 100
    ? `linear-gradient(${s.top} 0%, ${s.mid} ${mid}%, ${s.horizon} 100%)`
    : `linear-gradient(${s.top} 0%, ${s.mid} ${mid}%, ${s.horizon} ${horizont}%, ${s.horizon} 100%)`;
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
  // P13: Die Rampen lagen VIEL zu früh. Gemessen an der 09:00–18:00-Uhr blendete
  // die Dämmerung ab t=0,5 ein — 13:30 — und stand um 14:25 bei 85 %; die Nacht
  // war bei t=0,92 = 17:17 voll, also 43 Minuten VOR Feierabend. Der Spieler
  // arbeitete den halben Tag im Dunkeln.
  // Jetzt: Dämmerung ab 14:56 (t=0,66), voll um 16:12; Nacht ab 16:55 (t=0,88),
  // voll erst zum Redaktionsschluss um 18:00 (t=1,0).
  const dusk = ramp(t, 0.66, 0.8) * (1 - ramp(t, 0.88, 0.98));
  const night = ramp(t, 0.88, 1.0);
  return { dusk, night };
}
