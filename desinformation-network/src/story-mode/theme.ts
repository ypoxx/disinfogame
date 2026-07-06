// Farbwelt v3 „Behörden-Akte" (2026-07-06, Stil-Bibel §4.7, Owner-Stil-Lock):
// Die gesamte Bedienung ist aus PAPIER gemacht — warme Creme-/Manila-Flächen,
// Kraftpapier-Braun als Träger, Anthrazit-TINTE als Text, Ministeriums-Rot NUR
// für Stempel/Kopfbänder, Warn-Gelb sparsam. Schlüssel bleiben gleich, nur die
// Werte sind v3 → alle Komponenten, die StoryModeColors nutzen, kippen auf
// einmal in die Material-Welt. (v2 Beton/Glas: s. Git-Historie.)

export const StoryModeColors = {
  // Ministeriums-Rot: NUR Stempel/Kopfbänder/Alarm (§4.7)
  ministryRed: '#B0322B',
  darkRed: '#8E2822',

  // Papier-Braun-Skala (ehem. Beton): mittel / Kopfband-Kraftpapier / hell
  concrete: '#A89878',
  darkConcrete: '#4E4232',
  lightConcrete: '#C8BC9E',

  // Tinten-Blau (Stempel/Verweise)
  agencyBlue: '#31566E',
  darkBlue: '#24404F',

  // Akten-Oliv (gedämpft, Tinte auf Papier)
  militaryOlive: '#6A6244',
  darkOlive: '#4A452F',

  // Dokument/Papier (Bestand, bleibt Anker der Welt)
  document: '#D8C9A8',
  oldPaper: '#C7B690',

  // Akzent-Tinten (v3.1: WCAG-AA als Text auf surface/surfaceLight nachgerechnet —
  // warning 5,0/5,8 · danger 4,6/5,3 · success 5,3/6,1 · tech 4,5/5,2)
  warning: '#6E4A0E', // Marker-Ocker-Tinte (sparsam, §4.7)
  danger: '#9E2F26',
  success: '#31572E',
  tech: '#275F6B', // Petrol-Tinte für Bildschirme/Tech

  // UI-Basis: Kraftpapier-Träger dunkel, Papierflächen hell
  background: '#2E2820',
  surface: '#D9CDAF',
  surfaceLight: '#E6DCC3',
  border: '#554836',
  borderLight: '#8A7A5F',

  // Text = Tinte auf Papier (v3.1: alle drei ≥ 4,5:1 auf surface/surfaceLight)
  textPrimary: '#2B2620',
  textSecondary: '#544D3E',
  textMuted: '#5F5439',
};

// Pixel-Schriftfamilien (P1-6) — selbst gehostet (public/fonts/, SIL OFL), via @font-face
// in index.css geladen. Für Inline-`style`-Nutzung; die Tailwind-Pendants sind
// `font-mono` (world), `font-display` (display) und `font-pixel` (label).
export const StoryModeFonts = {
  /** Weltschrift/Body — Pixel-Monospace (CRT). Ersetzt die frühere `monospace`-Notlösung. */
  world: "'VT323', ui-monospace, monospace",
  /** Headlines/Titel — 8-Bit-Arcade. Bewusst sparsam (sehr breit). */
  display: "'Press Start 2P', system-ui, sans-serif",
  /** Mini-Labels/Badges — winzige Pixelschrift. */
  label: "'Silkscreen', ui-monospace, monospace",
} as const;

// v2: ohne harten Brutalismus-Schlagschatten (Verbotsliste) — klare Pixel-Kante,
// dezenter Press-Effekt bleibt über active:translate.
export const createBrutalistButton = (baseColor: string) => ({
  base: `bg-[${baseColor}] border-2 hover:brightness-110 transition-all active:translate-y-0.5`,
});

/**
 * Stempel-Knopf (§4.7): Primär-Aktionen sind GESTEMPELT statt rot geflutet —
 * Papierfläche, roter Doppelring (Rand + Innenring via inset-Ringe), rote
 * Stempel-Tinte. Rot bleibt damit Stempel/Kopfband vorbehalten.
 */
export const stampCtaStyle = {
  backgroundColor: StoryModeColors.surfaceLight,
  border: `2px solid ${StoryModeColors.ministryRed}`,
  boxShadow: `inset 0 0 0 2px ${StoryModeColors.surfaceLight}, inset 0 0 0 3px ${StoryModeColors.ministryRed}`,
  color: StoryModeColors.ministryRed,
  fontWeight: 900,
  letterSpacing: 2,
  textTransform: 'uppercase',
  cursor: 'pointer',
} as const;
