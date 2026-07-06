import { describe, expect, it } from 'vitest';
import { snapPixelScale, snapPixelScaleUp, snapToDevicePixel, snapCoverScale } from '../building/pixelScale';

// §4.1/B1: physisch (css × dpr) muss ganzzahlig oder Stammbruch sein.
const physOf = (css: number, dpr: number) => css * dpr;
const isClean = (phys: number) => {
  if (phys >= 1) return Math.abs(phys - Math.round(phys)) < 1e-9;
  const inv = 1 / phys;
  return Math.abs(inv - Math.round(inv)) < 1e-9;
};

describe('snapPixelScale', () => {
  it('snapt den Review-Fall ×0,544 auf ×0,5 (dpr 1)', () => {
    expect(snapPixelScale(0.544, 1)).toBe(0.5);
  });

  it('floort Hochskalierung auf ganze Faktoren', () => {
    expect(snapPixelScale(1.46, 1)).toBe(1);
    expect(snapPixelScale(3.9, 1)).toBe(3);
  });

  it('liefert Stammbrüche beim Herunterskalieren', () => {
    expect(snapPixelScale(0.4, 1)).toBeCloseTo(1 / 3, 12);
    expect(snapPixelScale(0.15, 1)).toBeCloseTo(1 / 7, 12);
  });

  it('korrigiert fraktionale dpr auf physisch ganze Pixel (Windows 125 %)', () => {
    const css = snapPixelScale(3.6, 1.25);
    expect(isClean(physOf(css, 1.25))).toBe(true);
    expect(css).toBe(4 / 1.25); // phys 4.5 → 4 → css 3.2
  });

  it('bleibt nie ≤ 0 und übersteigt fit nie', () => {
    for (const fit of [0.07, 0.3, 0.544, 0.9, 1.1, 2.7]) {
      for (const dpr of [1, 1.25, 1.5, 2]) {
        const s = snapPixelScale(fit, dpr);
        expect(s).toBeGreaterThan(0);
        expect(s).toBeLessThanOrEqual(fit + 1e-9);
        expect(isClean(physOf(s, dpr))).toBe(true);
      }
    }
  });

  it('fängt kaputte Eingaben ab', () => {
    expect(snapPixelScale(0, 1)).toBe(1);
    expect(snapPixelScale(NaN, 2)).toBe(0.5);
  });
});

describe('snapPixelScaleUp', () => {
  it('wählt die nächstgrößere saubere Stufe', () => {
    expect(snapPixelScaleUp(0.94, 1)).toBe(1);
    expect(snapPixelScaleUp(1.2, 1)).toBe(2);
    expect(snapPixelScaleUp(0.4, 1)).toBe(0.5);
  });
});

describe('snapToDevicePixel', () => {
  it('rundet auf ganze Geräte-Pixel', () => {
    expect(snapToDevicePixel(10.3, 1)).toBe(10);
    expect(snapToDevicePixel(10.3, 2)).toBe(10.5);
    expect(snapToDevicePixel(10.26, 1.25)).toBeCloseTo(10.4, 12);
  });
});

describe('snapCoverScale', () => {
  it('Review-Fall Raum-Nahsicht: cover ≈ 0,94 → exakt 1,0 mit kleinem Zuschnitt', () => {
    // 1264×707-Fläche, 1344×768-Raumbild → coverFit ≈ 0,94
    const r = snapCoverScale(1264, 707, 1344, 768, 1);
    expect(r.scale).toBe(1);
    expect(r.mode).toBe('cover');
    expect(r.width).toBe(1344);
  });

  it('weicht auf exaktes Cover aus (füllt weiter), wenn der Zuschnitt zu groß würde', () => {
    // Fläche verlangt ×1,45 → saubere Stufe ×2 wäre >maxCrop → exaktes Cover.
    const r = snapCoverScale(1950, 1080, 1344, 768, 1, 0.2);
    expect(r.mode).toBe('cover-soft');
    // Bildfüllend: Anzeige ≥ Fläche auf beiden Achsen (nie Letterbox).
    expect(r.width).toBeGreaterThanOrEqual(1950);
    expect(r.height).toBeGreaterThanOrEqual(1080);
    expect(r.scale).toBeCloseTo(Math.max(1950 / 1344, 1080 / 768), 5);
  });

  it('cover-Modus liefert pixel-saubere Faktoren (die soft-Stufe darf exakt sein)', () => {
    for (const [w, h] of [[800, 600], [1920, 1080], [1280, 720], [400, 300]] as const) {
      const r = snapCoverScale(w, h, 1344, 768, 1);
      if (r.mode === 'cover') expect(isClean(r.scale)).toBe(true);
      // In JEDEM Fall bildfüllend.
      expect(r.width).toBeGreaterThanOrEqual(w);
      expect(r.height).toBeGreaterThanOrEqual(h);
    }
  });

  it('füllt die Fläche IMMER — nie Letterbox, auch bei Ultrawide (Owner-Fix 2026-07-06)', () => {
    const EPS = 1e-6; // exaktes Cover trifft die Kante bis auf Float-Rundung genau
    // Ultrawide: saubere Stufe würde 61 % abschneiden → exaktes Cover füllt.
    const r1 = snapCoverScale(3440, 900, 1344, 768, 1);
    expect(r1.width).toBeGreaterThanOrEqual(3440 - EPS);
    expect(r1.height).toBeGreaterThanOrEqual(900 - EPS);
    // Gleichheits-Falle: coverFit=2 exakt, Zuschnitt 29,7 % > maxCrop.
    const r2 = snapCoverScale(2688, 1080, 1344, 768, 1, 0.2);
    expect(r2.width).toBeGreaterThanOrEqual(2688 - EPS);
    expect(r2.height).toBeGreaterThanOrEqual(1080 - EPS);
  });
});
