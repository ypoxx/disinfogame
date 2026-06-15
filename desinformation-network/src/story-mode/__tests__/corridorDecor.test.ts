/**
 * corridorDecor (R4): jede platzierte Deko hat eine Höhe, liegt im gültigen
 * x-Bereich und referenziert ein bekanntes Asset (kein stiller Fehlplatz).
 */
import { describe, it, expect } from 'vitest';
import {
  FLOOR_DECOR, DECOR_HEIGHT, POSTER_SLOGANS, shredderLine,
  economyPressure, coffeeLine, volksbrauseLine, employeeOfMonth,
  plantWilted, plantAsset, plantLine, EMPLOYEE_OF_MONTH_NAMES,
} from '../building/corridorDecor';

describe('corridorDecor', () => {
  it('jede Deko-Platzierung ist gültig (xFrac 0..1, Höhe bekannt, mount gültig)', () => {
    for (const [floorId, items] of Object.entries(FLOOR_DECOR)) {
      for (const d of items) {
        expect(d.xFrac, `${floorId}/${d.id} xFrac`).toBeGreaterThanOrEqual(0);
        expect(d.xFrac, `${floorId}/${d.id} xFrac`).toBeLessThanOrEqual(1);
        expect(['floor', 'wall']).toContain(d.mount);
        expect(DECOR_HEIGHT[d.id], `${floorId}/${d.id} ohne Höhe`).toBeGreaterThan(0);
      }
    }
  });

  it('Höhen sind plausibel (≤ Avatarhöhe 128px, außer mannshohe Geräte)', () => {
    for (const [id, h] of Object.entries(DECOR_HEIGHT)) {
      expect(h, `${id}`).toBeGreaterThan(0);
      expect(h, `${id} zu groß`).toBeLessThanOrEqual(160);
    }
  });

  it('P7/§14.4: der Reißwolf-Kommentar spiegelt den Entdeckungsdruck', () => {
    const calm = shredderLine(10);
    const busy = shredderLine(50);
    const hot = shredderLine(85);
    expect(calm).not.toBe(busy);
    expect(busy).not.toBe(hot);
    expect(hot).toMatch(/heiß|häufen/i);
    // platziert + mit Höhe hinterlegt
    expect(DECOR_HEIGHT.prop_shredder).toBeGreaterThan(0);
    expect(Object.values(FLOOR_DECOR).flat().some((d) => d.id === 'prop_shredder')).toBe(true);
  });

  it('P7/§14.4: jedes platzierte Plakat hat einen Spruch (klickbar)', () => {
    const placedPosters = new Set(
      Object.values(FLOOR_DECOR).flat().map((d) => d.id).filter((id) => id.startsWith('prop_poster')),
    );
    for (const id of placedPosters) {
      expect(POSTER_SLOGANS[id], `${id} ohne Slogan`).toBeTruthy();
      expect(POSTER_SLOGANS[id].titel_de.length).toBeGreaterThan(2);
      expect(POSTER_SLOGANS[id].slogan_de.length).toBeGreaterThan(10);
    }
  });

  it('P7/§14.4 (#2): die Kaffeeküche spiegelt die Wirtschafts-/Sanktionslage', () => {
    const gut = coffeeLine(0, 0, 0);
    const mittel = coffeeLine(60, 50, 30);
    const schlecht = coffeeLine(95, 90, 80);
    expect(gut).not.toBe(mittel);
    expect(mittel).not.toBe(schlecht);
    expect(schlecht).toMatch(/Zichorie|Sanktionen/i);
    // Druck steigt monoton mit den Eingaben.
    expect(economyPressure(90, 90, 90)).toBeGreaterThan(economyPressure(10, 10, 10));
    expect(economyPressure(0, 0, 0)).toBe(0);
    // platziert + mit Höhe hinterlegt
    expect(DECOR_HEIGHT.prop_coffee_station).toBeGreaterThan(0);
    expect(Object.values(FLOOR_DECOR).flat().some((d) => d.id === 'prop_coffee_station')).toBe(true);
  });

  it('P7/§14.4 (#9): das Volksbrause-Etikett reagiert aufs Narrativ (Auftrag)', () => {
    const keil = volksbrauseLine('keil');
    const wahl = volksbrauseLine('wahl');
    const zweifel = volksbrauseLine('zweifel');
    const fallback = volksbrauseLine('unbekannt');
    expect(new Set([keil, wahl, zweifel, fallback]).size).toBe(4); // alle verschieden
    expect(keil).toMatch(/Volksbrause/);
    // prop_vending ist platziert (wird als Volksbrause klickbar)
    expect(Object.values(FLOOR_DECOR).flat().some((d) => d.id === 'prop_vending')).toBe(true);
  });

  it('P7/§14.4 (#8): „Mitarbeiter des Monats" wechselt den Deckname, Gesicht bleibt', () => {
    const a = employeeOfMonth(0);
    const b = employeeOfMonth(1);
    expect(a.deckname).not.toBe(b.deckname);
    // zyklisch + negativ-sicher
    expect(employeeOfMonth(EMPLOYEE_OF_MONTH_NAMES.length).deckname).toBe(a.deckname);
    expect(employeeOfMonth(-1).deckname).toBe(employeeOfMonth(EMPLOYEE_OF_MONTH_NAMES.length - 1).deckname);
    expect(a.spruch).toMatch(/gleich aus|dasselbe Gesicht/i);
    expect(DECOR_HEIGHT.prop_employee_wall).toBeGreaterThan(0);
    expect(Object.values(FLOOR_DECOR).flat().some((d) => d.id === 'prop_employee_wall')).toBe(true);
  });

  it('P7/§14.4 (#4): die Büropflanze welkt je nach moralischer Last (Asset-Swap)', () => {
    expect(plantWilted(10)).toBe(false);
    expect(plantWilted(70)).toBe(true);
    expect(plantAsset('prop_plant_tall', 10)).toBe('prop_plant_tall');
    expect(plantAsset('prop_plant_tall', 70)).toBe('prop_plant_wilted');
    // kleine Pflanze welkt nicht (bleibt Deko)
    expect(plantAsset('prop_plant_small', 70)).toBe('prop_plant_small');
    // gewelktes Asset hat eine Höhe
    expect(DECOR_HEIGHT.prop_plant_wilted).toBeGreaterThan(0);
    // Kommentar variiert mit der Moral
    expect(plantLine(10)).not.toBe(plantLine(70));
  });
});
