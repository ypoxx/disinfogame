// Farbwelt v2 (2026-06-13, Stil-Bibel): modern statt 70er-Klischee — kühl-cleaner
// Neutral-Kern (Beton/Glas/Stahl) + dosierte Akzente. Schlüssel bleiben gleich, nur
// die Werte sind v2 → alle Komponenten, die StoryModeColors nutzen, kippen auf einmal
// in den neuen Look. (Frühere Werte: Sowjet/Brutalismus, s. Git-Historie.)

export const StoryModeColors = {
  // Marke-Rot (wichtige Elemente, Alarm) — etwas klarer als das alte Sowjet-Rot
  ministryRed: '#C2253B',
  darkRed: '#8E1B2C',

  // Beton/Stahl (kühl, modern)
  concrete: '#9AA1AC',
  darkConcrete: '#3A3F47',
  lightConcrete: '#B7BDC6',

  // Kühles Slate-Blau (ersetzt das dunkle Agency-Blau)
  agencyBlue: '#2B5572',
  darkBlue: '#1F3A4D',

  // Gedämpftes Olive bleibt nutzbar (Tech-Cyan separat unten)
  militaryOlive: '#5E6B43',
  darkOlive: '#3D4630',

  // Dokument/Papier (heller, sauberer)
  document: '#D8C9A8',
  oldPaper: '#C7B690',

  // Akzentfarben (v2, dosiert)
  warning: '#F0B429', // Amber (Hinweise)
  danger: '#E5484D',
  success: '#5BA66A',
  tech: '#34C6D8', // Cyan für Bildschirme/Tech (neu)

  // UI-Basis (kühl-modern)
  background: '#23262B',
  surface: '#2B2F36',
  surfaceLight: '#3A3F47',
  border: '#1B1E24',
  borderLight: '#4A515B',

  // Text (heller Neutral-Kern auf dunklem Grund, WCAG-AA)
  textPrimary: '#E7EAEF',
  textSecondary: '#A7AEB8',
  textMuted: '#828A95',
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
