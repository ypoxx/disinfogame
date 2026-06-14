/**
 * skyTime (Tageszeit-Himmel): Verlauf wandert von hell (Mittag) nach dunkel (Nacht),
 * bleibt in 0..255, und liefert ein gültiges CSS-linear-gradient.
 */
import { describe, it, expect } from 'vitest';
import { skyStopsForMinutes, skyGradientForMinutes } from '../building/skyTime';

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
});
