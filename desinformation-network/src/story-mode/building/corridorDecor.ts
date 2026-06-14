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
};

/**
 * Deko je Etage (Schlüssel = floor.id). Positionen liegen in den Tür-Lücken
 * (Türen sitzen an den Spalten-Mitten), Bodensteher an den Rändern, Wand-Objekte
 * über den Lücken. Jede Etage bekommt eine andere Mischung → kein Einheitsbrei.
 * Lobby (Eingangshalle) bleibt bewusst leer (eigenes Raumbild).
 */
export const FLOOR_DECOR: Record<string, DecorPlacement[]> = {
  etage4: [
    { id: 'prop_plant_tall', xFrac: 0.04, mount: 'floor' },
    { id: 'prop_poster_a', xFrac: 0.33, mount: 'wall' },
    { id: 'prop_trashcan', xFrac: 0.965, mount: 'floor' },
  ],
  etage3: [
    { id: 'prop_plant_small', xFrac: 0.04, mount: 'floor' },
    { id: 'prop_poster_b', xFrac: 0.42, mount: 'wall' },
    { id: 'prop_watercooler', xFrac: 0.5, mount: 'floor' },
  ],
  etage2: [
    { id: 'prop_plant_tall', xFrac: 0.05, mount: 'floor' },
    { id: 'prop_clock_wall', xFrac: 0.2, mount: 'wall' },
    { id: 'prop_bench', xFrac: 0.88, mount: 'floor' },
  ],
  etage1: [
    { id: 'prop_plant_small', xFrac: 0.04, mount: 'floor' },
    { id: 'prop_noticeboard', xFrac: 0.8, mount: 'wall' },
    { id: 'prop_chairs', xFrac: 0.88, mount: 'floor' },
  ],
  keller: [
    { id: 'prop_vending', xFrac: 0.07, mount: 'floor' },
    { id: 'prop_poster_c', xFrac: 0.22, mount: 'wall' },
    { id: 'prop_trashcan', xFrac: 0.92, mount: 'floor' },
  ],
};
