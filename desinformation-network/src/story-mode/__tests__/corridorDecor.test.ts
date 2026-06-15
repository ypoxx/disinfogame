/**
 * corridorDecor (R4): jede platzierte Deko hat eine Höhe, liegt im gültigen
 * x-Bereich und referenziert ein bekanntes Asset (kein stiller Fehlplatz).
 */
import { describe, it, expect } from 'vitest';
import { FLOOR_DECOR, DECOR_HEIGHT, POSTER_SLOGANS, shredderLine } from '../building/corridorDecor';

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
});
