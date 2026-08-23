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

    const dusk = skylineLayersForMinutes(450); // 16:30 — Dämmerung steht
    expect(dusk.dusk).toBeGreaterThan(0.5);

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

  /**
   * P13 (Fremdmodell-Durchgang 2026-08-22): Die Rampen lagen so früh, dass der
   * Arbeitstag im Dunkeln endete — Dämmerung ab 13:30, volle Nacht um 17:17, also
   * 43 Minuten VOR dem Feierabend um 18:00. Das ist die eigentliche Zusicherung,
   * nicht die konkrete Rampen-Zahl.
   */
  describe('Tageslicht hält bis zum Feierabend', () => {
    it('ist mittags noch tageshell — keine Dämmerung vor 14:30', () => {
      for (const min of [0, 90, 180, 270, 330]) {
        expect(skylineLayersForMinutes(min).dusk, `${min} min nach 09:00`).toBe(0);
        expect(skylineLayersForMinutes(min).night).toBe(0);
      }
    });

    it('erreicht die volle Nacht frühestens zum Redaktionsschluss', () => {
      expect(skylineLayersForMinutes(539).night).toBeLessThan(1);
      expect(skylineLayersForMinutes(540).night).toBe(1);
    });

    it('lässt den Nachmittag nicht abrupt kippen', () => {
      // Zwischen 15:00 und 18:00 wächst die Nacht monoton, ohne Sprung > 0,2.
      let vorher = skylineLayersForMinutes(360).night;
      for (let min = 366; min <= 540; min += 6) {
        const jetzt = skylineLayersForMinutes(min).night;
        expect(jetzt).toBeGreaterThanOrEqual(vorher);
        expect(jetzt - vorher).toBeLessThan(0.2);
        vorher = jetzt;
      }
    });
  });

  /** Der Verlauf muss dort enden, wo der Himmel aufhört — nicht am Fensterrand. */
  describe('Verlaufs-Geometrie folgt der sichtbaren Himmelszone', () => {
    it('staucht die Stützpunkte auf den sichtbaren Anteil', () => {
      const g = skyGradientForMinutes(300, 540, 0.44);
      expect(g).toContain('44%');
      expect(g).toContain('26%'); // 58 % von 44 %
    });

    it('hält den Horizont-Ton von dort bis zum Fensterrand', () => {
      const g = skyGradientForMinutes(300, 540, 0.44);
      const horizont = skyStopsForMinutes(300).horizon;
      expect(g).toContain(`${horizont} 44%`);
      expect(g).toContain(`${horizont} 100%`);
    });

    it('bleibt ohne Angabe beim alten Vollfenster-Verlauf', () => {
      expect(skyGradientForMinutes(300)).toBe(skyGradientForMinutes(300, 540, 1));
      expect(skyGradientForMinutes(300)).toContain('58%');
    });
  });
});
