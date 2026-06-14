/**
 * corridorDecor (R4): jede platzierte Deko hat eine Höhe, liegt im gültigen
 * x-Bereich und referenziert ein bekanntes Asset (kein stiller Fehlplatz).
 */
import { describe, it, expect } from 'vitest';
import { FLOOR_DECOR, DECOR_HEIGHT } from '../building/corridorDecor';

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
});
