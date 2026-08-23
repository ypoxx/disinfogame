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

/**
 * Schrift-Leiter (P4, Fremdmodell-Durchgang 2026-08-22).
 *
 * Vorher: 23 verschiedene Schriftgrößen, darunter krumme rem-Werte, die auf
 * 10,88 / 11,52 / 12,8 / 13,6 / 14,4 / 15,2 px hinausliefen — jede Komponente
 * erfand ihre eigene. 19 der Einigkeits-Befunde beider Modelle hingen daran.
 *
 * Diese Leiter ist keine Erfindung am grünen Tisch: Sie ist die tatsächliche
 * Nutzung, entdoppelt und von Bruchteilen befreit. Sub-10-px-Werte sind auf den
 * Boden gehoben (VT323 mit `size-adjust: 132 %` ergibt bei 10 px 7,4 px
 * Versalhöhe — darunter wird Pixelschrift unleserlich).
 *
 * `typeGuard.test.ts` hält die Leiter geschlossen: Neue Größen daneben fallen auf.
 */
export const StoryModeType = {
  /** 10 — Mindestgröße. Badges, Einheiten, Mini-Labels. */
  micro: 10,
  /** 11 — Tabellenzellen, Sekundär-Labels. */
  mini: 11,
  /** 12 — Sekundärtext. */
  small: 12,
  /** 13 — dichter Fließtext (Listen, Karten). */
  compact: 13,
  /** 14 — Fließtext. */
  body: 14,
  /** 16 — hervorgehobener Text, Knopfschrift. */
  lead: 16,
  /** 20 — Abschnitts-Titel. */
  title: 20,
  /** 24 — Karten-/Modal-Überschrift. */
  display: 24,
  /** 32 — Bildschirm-Überschrift. */
  hero: 32,
  /** 40 — Wahlabend-Schlagzeile. */
  banner: 40,
  /** 64 — Titelbildschirm. */
  mega: 64,
} as const;

/**
 * Lesebreiten. Fließtext ohne Deckel lief bisher über die volle Fensterbreite —
 * bei der DialogBox waren das 1244 px für Zeilen von im Median 71 Zeichen (P6).
 */
export const StoryModeMeasure = {
  /** ~84 Zeichen — Dialog, Briefing, Report-Fließtext. */
  text: '46rem',
  /** ~58 Zeichen — Randnotizen, Hinweise, Leerzustände. */
  narrow: '32rem',
} as const;

/**
 * Trägerflächen — deckende Unterlagen für Text auf gemusterten Untergründen.
 *
 * Die Korkkachel der Narrativ-Tafel liegt als `backgroundImage` HINTER allen
 * Kindern und hat keinen Deckkraft-Regler. Wo ein helles Korkkorn hinter einen
 * Buchstaben rutscht, sank der Kontrast auf bis zu 1,02:1 — Text also physikalisch
 * unsichtbar (gemessen 2026-08-22). Die Papier-Notizen auf derselben Textur sind
 * mit ~10:1 gestochen scharf, weil sie eine deckende Fläche mitbringen. Genau die
 * ist das hier: kein neues Asset, keine geänderte Textfarbe.
 */
export const StoryModeSurfaces = {
  /** Auf Kork (#7a5a36): hebt #bfa988 auf 6,3:1, die helleren Labels darüber. */
  corkCarrier: 'rgba(44,31,18,0.86)',
} as const;

/**
 * Abdunklungen hinter Overlays (P14, Fremdmodell-Durchgang 2026-08-22).
 *
 * Vorher: 21 Vollbild-Scrims mit ACHT verschiedenen Schwarzwerten (0,75 · 0,78 ·
 * 0,82 · 0,85 · 0,90 · 0,92 · 0,95 · 0,97). Die Cluster sahen nicht nach Absicht
 * aus, sondern nach „ungefähr so dunkel wie das Nachbar-Modal" — Folge einer
 * halbfertigen Migration: PixelModal wurde gebaut, aber nur ein Teil der
 * Aufrufstellen zog nach, der Rest behielt sein Literal daneben.
 *
 * Drei Stufen, nach ABSICHT benannt statt nach Zahl. Wer eine vierte braucht,
 * muss erklären wofür — `scrimGuard.test.ts` fragt danach.
 */
export const StoryModeScrims = {
  /** 0,78 — die Ebene darunter soll lesbar bleiben: Verzeichnis, Tafel, Vortest. */
  leicht: 0.78,
  /** 0,85 — Standard-Modal: die Welt tritt zurück, bleibt aber da. */
  normal: 0.85,
  /** 0,94 — Erzähl-Übernahme: Krise, Verrat, Tagesbericht, Wahlabend, Aktenwahl. */
  schwer: 0.94,
} as const;

export type ScrimStufe = keyof typeof StoryModeScrims;

/** Fertige CSS-Farbe für eine Scrim-Stufe. */
export function scrim(stufe: ScrimStufe): string {
  return `rgba(0,0,0,${StoryModeScrims[stufe]})`;
}

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

/**
 * Interaktions-Klassen für Stempel-CTAs.
 *
 * `stampCtaStyle` war bisher eine reine Opt-in-Konstante ohne jede Durchsetzung
 * und ohne Zustände — jede Fundstelle schrieb ihre eigene hover-Klasse dazu, mit
 * unterschiedlichen Werten. Papier wird beim Überfahren DUNKLER: `brightness-110`
 * tut auf der fast weißen Stempelfläche nichts Sichtbares.
 */
export const stampCtaClass =
  'transition-all hover:brightness-95 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed';

/**
 * Sekundär-Knopf: Papierfläche mit Tinten-Rand.
 *
 * Für alles, was WEGGEHT statt zu handeln — „SCHLIESSEN", „VERSTANDEN",
 * „ABBRECHEN". Diese Knöpfe trugen bisher Ministeriums-Rot als Fläche und waren
 * damit doppelt falsch: weder Stempel (§4.7) noch Primäraktion. Ein Stempel wäre
 * hier keine Reparatur, sondern dieselbe Verwechslung in anderer Farbe.
 */
export const paperButtonStyle = {
  backgroundColor: StoryModeColors.concrete,
  border: `2px solid ${StoryModeColors.borderLight}`,
  color: StoryModeColors.textPrimary,
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.35)',
  fontWeight: 700,
  cursor: 'pointer',
} as const;

export const paperButtonClass =
  'transition-all hover:brightness-110 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed';
