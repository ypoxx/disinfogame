/**
 * pixelScale — pixel-saubere Skalierung der Welt-Ebene (§4.1, Review B1,
 * Memo 2026-07-06 §1).
 *
 * Regel: Der PHYSISCHE Faktor (css-Scale × devicePixelRatio) muss ganzzahlig
 * (Hochskalieren) oder ein Stammbruch 1/n (Herunterskalieren) sein — jeder
 * andere Faktor lässt Nearest-Neighbor ungleich große Pixel rastern
 * („Matsch", csswg #5837). Offsets werden auf ganze Geräte-Pixel gerundet,
 * damit das Sampling-Raster stabil liegt (Subpixel-Verbot).
 */

/** Aktuelles devicePixelRatio, SSR-/Test-sicher. */
export function currentDpr(): number {
  if (typeof window === 'undefined') return 1;
  return window.devicePixelRatio || 1;
}

/**
 * Größter pixel-sauberer Scale ≤ fit: physisch ganzzahlig oder 1/n.
 * `fit` ist der Wunsch-Faktor (z. B. clientWidth / Weltbreite).
 */
export function snapPixelScale(fit: number, dpr: number = currentDpr()): number {
  if (!Number.isFinite(fit) || fit <= 0) return 1 / Math.max(1, dpr);
  const phys = fit * dpr;
  const snapped = phys >= 1 ? Math.floor(phys) : 1 / Math.ceil(1 / phys);
  return snapped / dpr;
}

/** Kleinster pixel-sauberer Scale ≥ fit (für Cover-Zuschnitt statt Lücke). */
export function snapPixelScaleUp(fit: number, dpr: number = currentDpr()): number {
  if (!Number.isFinite(fit) || fit <= 0) return 1 / Math.max(1, dpr);
  const phys = fit * dpr;
  const snapped = phys > 1 ? Math.ceil(phys) : 1 / Math.floor(1 / phys);
  return snapped / dpr;
}

/** CSS-Offset auf ganze GERÄTE-Pixel runden (stabiles Sampling-Raster). */
export function snapToDevicePixel(cssPx: number, dpr: number = currentDpr()): number {
  return Math.round(cssPx * dpr) / dpr;
}

export type CoverSnap = {
  /** pixel-sauberer Scale fürs Bild */
  scale: number;
  /** cover = leichter Zuschnitt (Bild ≥ Fläche) · contain = Bild kleiner, Rand-Ausgleich */
  mode: 'cover' | 'contain';
  /** Anzeigegröße in css-px */
  width: number;
  height: number;
};

/**
 * Ersatz für `background-size: cover` (Review B1: cover ≈ ×0,94 = Matsch):
 * wählt den pixel-sauberen Scale, der die Fläche mit ≤ `maxCrop` Zuschnitt
 * füllt — sonst die nächstkleinere Stufe mit Rand-Ausgleich (Letterbox,
 * diegetisch als Scrim/Rahmen, §4.7-Kontrast-Regel).
 */
export function snapCoverScale(
  areaW: number,
  areaH: number,
  nativeW: number,
  nativeH: number,
  dpr: number = currentDpr(),
  maxCrop = 0.2,
): CoverSnap {
  if (areaW <= 0 || areaH <= 0 || nativeW <= 0 || nativeH <= 0) {
    return { scale: 1, mode: 'contain', width: nativeW, height: nativeH };
  }
  const coverFit = Math.max(areaW / nativeW, areaH / nativeH);
  const up = snapPixelScaleUp(coverFit, dpr);
  // Zuschnitt-Anteil, wenn wir auf `up` vergrößern (größte der beiden Achsen).
  const cropW = 1 - areaW / (nativeW * up);
  const cropH = 1 - areaH / (nativeH * up);
  if (Math.max(cropW, cropH) <= maxCrop) {
    return { scale: up, mode: 'cover', width: nativeW * up, height: nativeH * up };
  }
  // contain snappt am CONTAIN-Fit (min der Achsen), nicht am Cover-Fit — sonst
  // überragt „contain" die Fläche (Review Etappe 1: Ultrawide schnitt 41 % ab).
  const containFit = Math.min(areaW / nativeW, areaH / nativeH);
  const down = snapPixelScale(containFit, dpr);
  return { scale: down, mode: 'contain', width: nativeW * down, height: nativeH * down };
}
