/**
 * officeHotspots — präzise Klickzonen des Spielerbüros (PLAN 2026-07-07, N1).
 *
 * Polygone in BILD-Pixelkoordinaten von room_spieler_buero.png (1344×768),
 * am 2026-07-07 per sharp-Crops in Originalauflösung eingemessen und per
 * Overlay-Render gegen das Asset verifiziert. Die Umrechnung Bild→Container
 * läuft über den CoverSnap der Hintergrund-Skalierung (unten-zentriert
 * verankert, B1): damit liegen die Zonen bei jeder Flächen-/Layout-Änderung
 * (Broadcast klappt aus, Panel öffnet, HUD an) weiter auf den Möbeln —
 * der alte %-vom-Container-Ansatz driftete genau dann von den Objekten weg.
 */

export const OFFICE_IMG = { w: 1344, h: 768 } as const;

export type ImgPoint = readonly [number, number];

export type OfficeHotspotId =
  | 'computer' | 'phone' | 'board' | 'files' | 'tv' | 'window' | 'exit';

export interface OfficeHotspotDef {
  id: OfficeHotspotId;
  label: string;
  /** Möbel-Silhouette in Bild-Pixeln (im Uhrzeigersinn). */
  polygon: readonly ImgPoint[];
  /** Anker für Label-Chip/Marker (Bild-px); Default = BBox oben Mitte. */
  labelAnchor?: ImgPoint;
}

/** Die Treffer-Fläche ist das Polygon selbst (Möbel-Silhouette), nicht die BBox. */
export const OFFICE_HOTSPOTS: readonly OfficeHotspotDef[] = [
  {
    id: 'computer',
    label: 'AKTIONEN PLANEN',
    // CRT-Monitor + Standfuß + Rechner-Turm + Tastatur auf dem Schreibtisch.
    polygon: [[386, 390], [461, 390], [461, 428], [490, 430], [492, 500], [428, 500], [404, 492], [388, 472]],
  },
  {
    id: 'phone',
    label: 'KONTAKTE',
    polygon: [[328, 478], [398, 478], [402, 512], [332, 514]],
  },
  {
    id: 'board',
    label: 'NARRATIV-TAFEL',
    polygon: [[462, 308], [633, 303], [635, 434], [463, 428]],
  },
  {
    id: 'files',
    label: 'NACHRICHTEN',
    // Ablagestapel (Mappen) rechts neben dem Rechner.
    polygon: [[488, 442], [575, 448], [577, 492], [490, 492]],
  },
  {
    id: 'tv',
    label: 'LAGEBILD',
    // Der geneigte Wand-Monitor OBEN LINKS — vorher zeigte der Hotspot auf
    // die rechte Wand, wo im aktuellen Asset gar kein Gerät hängt.
    polygon: [[316, 221], [431, 236], [428, 356], [321, 336]],
  },
  {
    id: 'window',
    label: 'WELT-EREIGNISSE',
    polygon: [[654, 130], [946, 130], [946, 468], [654, 468]],
  },
  {
    id: 'exit',
    label: '← GEBÄUDE',
    // Glastür in der linken Trennwand (Trapez wegen Perspektive).
    polygon: [[50, 10], [226, 30], [226, 698], [50, 744]],
    // BBox-Oberkante läge am Bildrand — Chip/Fokus-Anker auf Griffhöhe.
    labelAnchor: [138, 300],
  },
] as const;

/** Bildbereiche der Mikro-Animationen (Bild-px, gleiche Vermessung). */
export const OFFICE_DECOR = {
  /** CRT-Bildschirmfläche → Glüh-Animation. */
  crtScreen: { x: 392, y: 394, w: 62, h: 72 },
  /** Wand-Monitor-Bildfläche → Flacker-Overlay (ersetzt das alte „TV rechts"). */
  wallScreen: { x: 330, y: 236, w: 90, h: 100 },
} as const;

// ─── Geometrie-Helfer (pur, getestet) ────────────────────────────────────────

export interface BBox { x: number; y: number; w: number; h: number }

export function polygonBBox(poly: readonly ImgPoint[]): BBox {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of poly) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

/** SVG-`points`-Attribut. */
export function svgPoints(poly: readonly ImgPoint[]): string {
  return poly.map(([x, y]) => `${x},${y}`).join(' ');
}

/**
 * Abbildung Bild-px → Container-px für einen unten-zentriert verankerten
 * Cover-Snap (background-position: center bottom, s. PlayerOfficeView).
 */
export interface CoverTransform {
  offsetX: number;
  offsetY: number;
  scaleX: number;
  scaleY: number;
}

export function coverTransform(
  area: { w: number; h: number },
  snap: { width: number; height: number },
): CoverTransform {
  return {
    offsetX: (area.w - snap.width) / 2,
    offsetY: area.h - snap.height,
    scaleX: snap.width / OFFICE_IMG.w,
    scaleY: snap.height / OFFICE_IMG.h,
  };
}

export function imgToContainer(pt: ImgPoint, t: CoverTransform): { x: number; y: number } {
  return { x: t.offsetX + pt[0] * t.scaleX, y: t.offsetY + pt[1] * t.scaleY };
}

export function rectToContainer(
  r: { x: number; y: number; w: number; h: number },
  t: CoverTransform,
): { left: number; top: number; width: number; height: number } {
  const p = imgToContainer([r.x, r.y], t);
  return { left: p.x, top: p.y, width: r.w * t.scaleX, height: r.h * t.scaleY };
}

/** Chip-/Marker-Anker eines Hotspots in Bild-px (Default: BBox oben Mitte). */
export function hotspotAnchor(hs: OfficeHotspotDef): ImgPoint {
  if (hs.labelAnchor) return hs.labelAnchor;
  const b = polygonBBox(hs.polygon);
  return [b.x + b.w / 2, b.y];
}

/**
 * Sichtbarer Anteil der Hotspot-BBox im Container (0..1). Der Cover-Beschnitt
 * (unten-zentriert) kann Zonen aus dem Sichtfeld schieben — die Tür horizontal
 * bei schmalen Flächen, Wand-Monitor/Korkbrett vertikal bei flachen. Wer unter
 * die Schwelle fällt, bekommt einen Ersatz-Knopf in der Unterleiste (A1).
 */
export function visibleFraction(
  hs: OfficeHotspotDef,
  t: CoverTransform,
  area: { w: number; h: number },
): number {
  const r = rectToContainer(polygonBBox(hs.polygon), t);
  const ix = Math.min(r.left + r.width, area.w) - Math.max(r.left, 0);
  const iy = Math.min(r.top + r.height, area.h) - Math.max(r.top, 0);
  const full = r.width * r.height;
  if (full <= 0) return 0;
  return (Math.max(0, ix) * Math.max(0, iy)) / full;
}

/**
 * Anker in den sichtbaren Bereich clampen (Chips, Badges, Tutorial-Marker):
 * beschnittene Ränder dürfen Hinweise nicht unsichtbar machen.
 */
export function clampAnchor(
  pt: { x: number; y: number },
  area: { w: number; h: number },
  marginX = 70,
  marginY = 28,
): { x: number; y: number } {
  return {
    x: Math.max(marginX, Math.min(area.w - marginX, pt.x)),
    y: Math.max(marginY, Math.min(area.h - 8, pt.y)),
  };
}
