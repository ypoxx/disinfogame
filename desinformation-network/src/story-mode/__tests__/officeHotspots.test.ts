/**
 * officeHotspots — Geometrie- und Daten-Invarianten (PLAN 2026-07-07, N1).
 * Die Polygone sind gegen room_spieler_buero.png (1344×768) eingemessen;
 * diese Tests sichern die Mathematik und die Daten-Hygiene, nicht die Optik
 * (die prüft die Overlay-Ernte, s. scripts/visual-review/nav-audit.mjs).
 */
import { describe, expect, it } from 'vitest';
import {
  OFFICE_HOTSPOTS,
  OFFICE_IMG,
  OFFICE_DECOR,
  coverTransform,
  hotspotAnchor,
  imgToContainer,
  polygonBBox,
  rectToContainer,
  svgPoints,
} from '../components/officeHotspots';

describe('officeHotspots Daten', () => {
  it('hat eindeutige Ids und nicht-leere Labels', () => {
    const ids = OFFICE_HOTSPOTS.map((h) => h.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const h of OFFICE_HOTSPOTS) expect(h.label.length).toBeGreaterThan(0);
  });

  it('alle Polygone haben ≥ 3 Punkte und liegen im Bild', () => {
    for (const h of OFFICE_HOTSPOTS) {
      expect(h.polygon.length).toBeGreaterThanOrEqual(3);
      for (const [x, y] of h.polygon) {
        expect(x).toBeGreaterThanOrEqual(0);
        expect(y).toBeGreaterThanOrEqual(0);
        expect(x).toBeLessThanOrEqual(OFFICE_IMG.w);
        expect(y).toBeLessThanOrEqual(OFFICE_IMG.h);
      }
    }
  });

  it('Deko-Anker liegen im Bild', () => {
    for (const r of Object.values(OFFICE_DECOR)) {
      expect(r.x).toBeGreaterThanOrEqual(0);
      expect(r.y).toBeGreaterThanOrEqual(0);
      expect(r.x + r.w).toBeLessThanOrEqual(OFFICE_IMG.w);
      expect(r.y + r.h).toBeLessThanOrEqual(OFFICE_IMG.h);
    }
  });
});

describe('Geometrie-Helfer', () => {
  it('polygonBBox umschließt ein Dreieck', () => {
    expect(polygonBBox([[10, 20], [30, 5], [20, 40]])).toEqual({ x: 10, y: 5, w: 20, h: 35 });
  });

  it('svgPoints formatiert als "x,y x,y …"', () => {
    expect(svgPoints([[1, 2], [3, 4]])).toBe('1,2 3,4');
  });

  it('coverTransform verankert unten-zentriert (center bottom)', () => {
    // Fläche 1280×760, Snap 1:1 (1344×768): 32 px seitlicher Beschnitt, 8 px oben.
    const t = coverTransform({ w: 1280, h: 760 }, { width: 1344, height: 768 });
    expect(t).toEqual({ offsetX: -32, offsetY: -8, scaleX: 1, scaleY: 1 });
    expect(imgToContainer([0, 0], t)).toEqual({ x: -32, y: -8 });
    expect(imgToContainer([1344, 768], t)).toEqual({ x: 1312, y: 760 });
  });

  it('imgToContainer skaliert mit dem Snap', () => {
    const t = coverTransform({ w: 672, h: 384 }, { width: 672, height: 384 });
    expect(t.scaleX).toBe(0.5);
    expect(imgToContainer([100, 200], t)).toEqual({ x: 50, y: 100 });
  });

  it('rectToContainer bildet Deko-Anker ab', () => {
    const t = coverTransform({ w: 1344, h: 768 }, { width: 1344, height: 768 });
    expect(rectToContainer({ x: 10, y: 20, w: 30, h: 40 }, t))
      .toEqual({ left: 10, top: 20, width: 30, height: 40 });
  });

  it('hotspotAnchor: Default = BBox oben Mitte, labelAnchor gewinnt', () => {
    const window = OFFICE_HOTSPOTS.find((h) => h.id === 'window')!;
    expect(hotspotAnchor(window)).toEqual([800, 130]);
    const exit = OFFICE_HOTSPOTS.find((h) => h.id === 'exit')!;
    expect(hotspotAnchor(exit)).toEqual([138, 300]);
  });
});
