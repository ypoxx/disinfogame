/**
 * skyTime (Tageszeit-Himmel): Verlauf wandert von hell (Mittag) nach dunkel (Nacht),
 * bleibt in 0..255, und liefert ein gültiges CSS-linear-gradient.
 */
import { describe, it, expect } from 'vitest';
import { skyStopsForMinutes, skyGradientForMinutes, skylineLayersForMinutes } from '../building/skyTime';

const lum = (rgb: string): number => {
  const m = rgb.match(/rgb\((\d+), (\d+), (\d+)\)/)!;
  return Number(m[1]) + Number(m[2]) + Number(m[3]);
};

describe('skyTime', () => {
  it('Mittag ist deutlich heller als Nacht (Horizont)', () => {
    const noon = skyStopsForMinutes(180); // ~12:00 (t=0.33)
    const night = skyStopsForMinutes(540); // 18:00 (t=1)
    expect(lum(noon.horizon)).toBeGreaterThan(lum(night.horizon));
    expect(lum(noon.top)).toBeGreaterThan(lum(night.top));
  });

  it('klammert außerhalb des Tagesfensters (kein Überlauf)', () => {
    for (const min of [-100, 0, 270, 540, 9999]) {
      const s = skyStopsForMinutes(min);
      for (const c of [s.top, s.mid, s.horizon]) {
        const m = c.match(/rgb\((\d+), (\d+), (\d+)\)/);
        expect(m).not.toBeNull();
        for (const k of [1, 2, 3]) {
          expect(Number(m![k])).toBeGreaterThanOrEqual(0);
          expect(Number(m![k])).toBeLessThanOrEqual(255);
        }
      }
    }
  });

  it('liefert ein gültiges linear-gradient mit drei Stops', () => {
    const g = skyGradientForMinutes(300);
    expect(g.startsWith('linear-gradient(')).toBe(true);
    expect(g).toContain('0%');
    expect(g).toContain('58%');
    expect(g).toContain('100%');
  });

  it('Skyline-Layer: tagsüber aus, Dämmerung blendet ein, Nacht übernimmt', () => {
    const day = skylineLayersForMinutes(90); // früher Vormittag (t≈0.17)
    expect(day.dusk).toBe(0);
    expect(day.night).toBe(0);

    const dusk = skylineLayersForMinutes(0.7 * 540); // goldene Stunde (t≈0.7)
    expect(dusk.dusk).toBeGreaterThan(0.5);
    expect(dusk.night).toBe(0);

    const night = skylineLayersForMinutes(540); // Nacht (t=1)
    expect(night.night).toBe(1);
    expect(night.dusk).toBe(0); // Nacht hat die Dämmerung wieder ausgeblendet

    // Alle Opazitäten bleiben in 0..1, auch außerhalb des Fensters.
    for (const min of [-100, 0, 200, 400, 540, 9999]) {
      const l = skylineLayersForMinutes(min);
      for (const v of [l.dusk, l.night]) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
      }
    }
  });
});
