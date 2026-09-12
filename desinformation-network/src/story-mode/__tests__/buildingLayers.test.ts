/**
 * Wache über die Stapel-Ebenen der Bühne (2026-08-23).
 *
 * Anlass: Die Klickfläche der Tür lag auf zIndex 6 — über den Flur-Statisten (5).
 * Sie ist mit 144 × 184 Welt-px bewusst großzügiger als das Türblatt (96 × 144),
 * als RAND, nicht als Vorrang. Wer neben einer Tür stand, war deshalb nicht mehr
 * anklickbar: Sein Klick landete auf „<Raum> betreten". Gemessen am 2026-08-23 an
 * „KOLLEGE ansprechen" auf Etage 3 — ein echter Mausklick öffnete die Sprechblase
 * nicht, ein programmatischer schon, weil letzterer die Trefferprüfung umgeht.
 *
 * Der Fehler war eine einzelne Zahl unter zwölf verstreuten. Diese Wache prüft
 * nicht die Zahlen, sondern die REGEL dahinter: **Man klickt, was man sieht.**
 * Ein großzügiges Auffangnetz darf nie über dem liegen, was es auffängt.
 */
import { describe, it, expect } from 'vitest';
import { EBENE } from '../building/BuildingStage';

describe('Stapel-Ebenen der Bühne', () => {
  it('legt das Auffangnetz der Tür unter alles Sichtbare mit eigener Bedeutung', () => {
    expect(EBENE.tuerKlickflaeche).toBeLessThan(EBENE.deko);
    expect(EBENE.tuerKlickflaeche).toBeLessThan(EBENE.figuren);
    expect(EBENE.tuerKlickflaeche).toBeLessThan(EBENE.avatar);
  });

  it('hält die Lesereihenfolge der Welt ein', () => {
    // Hintergrund → Deko → Boden → Türblatt → Figuren → Spieler → Sprechblase.
    const folge = [
      EBENE.hintergrund,
      EBENE.deko,
      EBENE.boden,
      EBENE.tuer,
      EBENE.figuren,
      EBENE.avatar,
      EBENE.blase,
    ];
    for (let i = 1; i < folge.length; i++) {
      expect(folge[i], `Ebene ${i} muss über Ebene ${i - 1} liegen`).toBeGreaterThan(folge[i - 1]);
    }
  });

  it('stellt den Spieler über die Statisten', () => {
    // Sonst läuft ein Kollege vor dem Spieler her und verdeckt ihn.
    expect(EBENE.avatar).toBeGreaterThan(EBENE.figuren);
  });
});
