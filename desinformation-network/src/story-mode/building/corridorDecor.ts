/**
 * corridorDecor — frei platzierte Flur-Deko (R4-Entkachelung).
 *
 * Die Basis-Korridore sind jetzt LEER (keine gebackenen, sich wiederholenden
 * Elemente). Stattdessen werden Deko-Objekte hier **datengetrieben** je Etage
 * platziert: `xFrac` = Anteil der Flur-Spielfläche (bewusst in Tür-Lücken),
 * `mount` = ob das Objekt auf der Bodenlinie steht oder an der Wand hängt.
 *
 * Größen in `DECOR_HEIGHT` folgen realen Proportionen (Avatar ≈ 1,7 m ≈ 128 px
 * ⇒ ~75 px/Meter), damit Mobiliar glaubwürdig zum Avatar passt.
 */

export interface DecorPlacement {
  id: string;
  /** 0..1 — horizontale Position als Anteil der Flur-Spielfläche. */
  xFrac: number;
  mount: 'floor' | 'wall';
}

/** Anzeigehöhe (px) je Deko-Asset — reale Höhe × ~75 px/m. */
export const DECOR_HEIGHT: Record<string, number> = {
  prop_plant_tall: 108, // ~1,45 m
  prop_plant_small: 44,
  prop_trashcan: 54,
  prop_bench: 54,
  prop_chairs: 66,
  prop_watercooler: 96,
  prop_vending: 140, // ~1,85 m, knapp avatargroß (realistisch)
  prop_clock_wall: 28,
  prop_noticeboard: 68,
  prop_poster_a: 54,
  prop_poster_b: 54,
  prop_poster_c: 54,
  prop_shredder: 88, // ~1,15 m Standgerät mit überquellendem Papier
  prop_coffee_station: 104, // ~1,4 m Kaffeeküchen-Theke mit Maschine
  prop_employee_wall: 72,   // Wandtafel „Mitarbeiter des Monats"
  prop_plant_wilted: 108,   // welke Variante zu prop_plant_tall (gleiche Standfläche)
};

/**
 * P7/§14.4 (#7) — der Reißwolf, der nie leer wird: sein Kommentar spiegelt den
 * Entdeckungsdruck (Risiko). „Feinheiten verweisen aufs Spiel" (SOUL §9). Pure Funktion.
 */
export function shredderLine(risk: number): string {
  if (risk < 30) return 'Heute steht er still. Saubere Akten — fast schon verdächtig ruhig.';
  if (risk < 65) return 'Er hat zu tun. Es bleibt eben immer etwas übrig, das niemand sehen soll.';
  return 'Er läuft heiß. Die Spuren häufen sich schneller, als wir sie vernichten können.';
}

const clamp = (v: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));

/**
 * P7/§14.4 (#2) — Kaffeeküche: die Sorten-Vielfalt spiegelt den Wirtschafts-/Sanktionsstand.
 * Je stärker die Operation international Druck erzeugt (Risiko/Aufmerksamkeit/Moral), desto
 * kärger das Angebot im eigenen Haus — trockener Selbst-Spott des Regimes (Spielbezug, SOUL §9).
 */
export function economyPressure(risk: number, attention: number, moralWeight: number): number {
  return clamp(risk * 0.45 + attention * 0.35 + moralWeight * 0.2);
}
export function coffeeLine(risk: number, attention: number, moralWeight: number): string {
  const p = economyPressure(risk, attention, moralWeight);
  if (p < 30) return 'Drei Sorten heute, sogar welche aus Übersee. Die Versorgung läuft — noch fließen die Devisen.';
  if (p < 60) return 'Die importierten Sorten sind aus. Geblieben ist der Standard-Röst aus eigener Produktion. Schmeckt nach Pflicht.';
  return 'Nur noch „Zichorie, Ersatz". Die Sanktionen schmeckt man bis in die Kaffeeküche.';
}

/**
 * P7/§14.4 (#9) — Getränkeautomat „Volksbrause": eine einzige Sorte, deren Etikett aufs
 * laufende Narrativ (den aktiven Auftrag) reagiert. Selbst-Propaganda im eigenen Haus.
 */
export function volksbrauseLine(auftragId: string): string {
  switch (auftragId) {
    case 'keil':
      return '„Volksbrause — jetzt mit Heimat-Geschmack! Für alle, die noch wissen, wo sie hingehören. (Andere Sorten gibt es nicht.)"';
    case 'wahl':
      return '„Volksbrause — die Brause mit der klaren Mehrheit. Eine Sorte, ein Wille."';
    case 'zweifel':
      return '„Volksbrause — ganz ohne künstliche Fakten. Trauen Sie keiner anderen Marke. Trauen Sie überhaupt niemandem."';
    default:
      return '„Volksbrause — eine Sorte für alle. Auswahl verwirrt nur."';
  }
}

/**
 * P7/§14.4 (#8) — „Mitarbeiter des Monats": dasselbe Gesicht, nur der Deckname wechselt
 * bei jedem Klick. Trockener Kommentar zur Austauschbarkeit der Sockenpuppen (Verbreiter-Mechanik).
 */
export const EMPLOYEE_OF_MONTH_NAMES: string[] = [
  'Bürger K.', 'Anon 4-7', 'Stimme aus Nordmark', 'Der besorgte Vater', 'Echte_Meinung_88',
  'Patriot_Real', 'Tante Vera', 'Quelle: vertraulich', 'Ein Nachbar', 'Konto #2231',
];
export function employeeOfMonth(index: number): { deckname: string; spruch: string } {
  const names = EMPLOYEE_OF_MONTH_NAMES;
  const deckname = names[((index % names.length) + names.length) % names.length];
  return {
    deckname,
    spruch:
      `Mitarbeiter des Monats: „${deckname}". Dasselbe Gesicht wie letzten Monat — nur der ` +
      `Name ist neu. So viele fleißige Bürger, und alle sehen sie gleich aus.`,
  };
}

/**
 * P7/§14.4 (#4, SOUL-Beispiel) — Büropflanze: sattgrün bei reinem Gewissen, welk je höher die
 * moralische Last. Asset-Swap (prop_plant_tall ↔ prop_plant_wilted) + Klick-Kommentar.
 */
export function plantWilted(moralWeight: number): boolean {
  return moralWeight >= 50;
}
/** Welche Pflanzen-Grafik je Moral gezeigt wird (nur die große Topfpflanze welkt sichtbar). */
export function plantAsset(baseId: string, moralWeight: number): string {
  if (baseId === 'prop_plant_tall' && plantWilted(moralWeight)) return 'prop_plant_wilted';
  return baseId;
}
export function plantLine(moralWeight: number): string {
  if (moralWeight < 25) return 'Sattgrün im Lampenlicht. Jemand gießt sie noch — vielleicht das letzte reine Gewissen im Haus.';
  if (moralWeight < 50) return 'Ein paar Blätter hängen schon. Zum Gießen bleibt keine Zeit, wenn die Akten sich stapeln.';
  return 'Fast eingegangen, vertrocknet. Wie das Gewissen, das sie hier stellvertretend führt.';
}

/**
 * Deko je Etage (Schlüssel = floor.id). Positionen liegen in den Tür-Lücken
 * (Türen sitzen an den Spalten-Mitten), Bodensteher an den Rändern, Wand-Objekte
 * über den Lücken. Jede Etage bekommt eine andere Mischung → kein Einheitsbrei.
 * Lobby (Eingangshalle) bleibt bewusst leer (eigenes Raumbild).
 */
/** Strang 5: stehende Flavor-Statisten je Etage (Reinigung/Kollege) — populieren das
 *  Gebäude. 2-Frame-Idle (subtile Bewegung), stehen in Tür-/Deko-Lücken auf der
 *  Wand-Fuß-Linie. Bewusst KEINE Mechanik, reine Lebendigkeit. */
export interface AmbientFigure {
  figure: string;
  xFrac: number;
  /** Flavor-Satz beim Anklicken (Mini-Dialog, D13). */
  line: string;
  /** Kurzer Rollen-Name über der Sprechblase. */
  who: string;
}
export const FLOOR_AMBIENT: Record<string, AmbientFigure[]> = {
  etage1: [{
    figure: 'figure_clerk', xFrac: 0.33, who: 'KOLLEGE',
    line: 'Viel los heute oben. Ich bring nur die Akten rum, von dem anderen halt ich mich fern.',
  }],
};
/** Anzeigehöhe der Statisten (px) — etwas kleiner als der Avatar (128). */
export const AMBIENT_HEIGHT = 112;

/** Strang 5 (Bewegung): ein hin- und herlaufender Statist je Etage (Lauf-Zyklus),
 *  pendelt zwischen xFracA und xFracB im Flur. Reine Atmosphäre, keine Mechanik. */
export interface AmbientWalker {
  figureWalk: string;
  xFracA: number;
  xFracB: number;
}
export const FLOOR_WALKERS: Record<string, AmbientWalker[]> = {
  etage3: [{ figureWalk: 'figure_cleaner_walk', xFracA: 0.34, xFracB: 0.62 }],
};

/** Strang 5 (Bewegung): Tür-Dummies — an Nicht-Spieler-Türen taucht periodisch jemand
 *  auf und verschwindet wieder (ein-/ausgehen, D13). `delayS` versetzt die Zyklen. */
export interface DoorDummy {
  figure: string;
  xFrac: number;
  delayS: number;
}
export const DOOR_TRAFFIC: Record<string, DoorDummy[]> = {
  etage4: [{ figure: 'figure_clerk', xFrac: 0.5, delayS: 1 }],   // Operationszentrale-Tür
  etage3: [{ figure: 'figure_clerk', xFrac: 0.83, delayS: 8 }],  // Newsroom-Tür
};

/**
 * P7/§14.4 (#1) — Umgebungshumor: klickbare Propaganda-Plakate.
 * Trockene Ministeriums-Selbstpropaganda (fiktiv, keine realen Symbole). Beim Anklicken
 * eines Wand-Plakats erscheint eine Vergrößerung mit dem Spruch.
 */
export const POSTER_SLOGANS: Record<string, { titel_de: string; slogan_de: string }> = {
  prop_poster_a: { titel_de: 'EINIGKEIT', slogan_de: 'Einigkeit durch Meinungsvielfalt. Abweichende Meinungen ausgenommen.' },
  prop_poster_b: { titel_de: 'WAHRHEIT', slogan_de: 'Die Wahrheit ist, was alle teilen.' },
  prop_poster_c: { titel_de: 'FORTSCHRITT', slogan_de: 'Wir blicken zuversichtlich zurück.' },
};

export const FLOOR_DECOR: Record<string, DecorPlacement[]> = {
  etage4: [
    { id: 'prop_plant_tall', xFrac: 0.04, mount: 'floor' },
    { id: 'prop_poster_a', xFrac: 0.33, mount: 'wall' },
    { id: 'prop_shredder', xFrac: 0.63, mount: 'floor' }, // Operationszentrale: OPSEC-Humor
    { id: 'prop_trashcan', xFrac: 0.965, mount: 'floor' },
  ],
  etage3: [
    { id: 'prop_plant_small', xFrac: 0.04, mount: 'floor' },
    { id: 'prop_poster_b', xFrac: 0.42, mount: 'wall' },
    { id: 'prop_watercooler', xFrac: 0.5, mount: 'floor' },
  ],
  etage2: [
    { id: 'prop_plant_tall', xFrac: 0.05, mount: 'floor' }, // welk/grün je Moral (§14.4 #4)
    { id: 'prop_clock_wall', xFrac: 0.2, mount: 'wall' },
    { id: 'prop_coffee_station', xFrac: 0.66, mount: 'floor' }, // Kaffeeküche: Sorten = Wirtschaftslage (§14.4 #2)
    { id: 'prop_bench', xFrac: 0.88, mount: 'floor' },
  ],
  etage1: [
    { id: 'prop_plant_small', xFrac: 0.04, mount: 'floor' },
    { id: 'prop_employee_wall', xFrac: 0.33, mount: 'wall' }, // „Mitarbeiter des Monats" — gleiches Gesicht (§14.4 #8)
    { id: 'prop_noticeboard', xFrac: 0.8, mount: 'wall' },
    { id: 'prop_chairs', xFrac: 0.88, mount: 'floor' },
  ],
  keller: [
    { id: 'prop_vending', xFrac: 0.07, mount: 'floor' },
    { id: 'prop_poster_c', xFrac: 0.22, mount: 'wall' },
    { id: 'prop_trashcan', xFrac: 0.92, mount: 'floor' },
  ],
};
