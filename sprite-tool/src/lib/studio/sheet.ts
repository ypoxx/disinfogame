// ===========================================
// SPRITE-SHEET: SLICEN & PACKEN (Canvas, clientseitig)
// ===========================================
// Zwei Wege zum spielfertigen Sheet:
//  1) Ein generiertes Sheet-Bild (z. B. "8-frame walk cycle, horizontal") in
//     Frames ZERLEGEN (Raster aus Spalten×Zeilen oder feste Frame-Größe).
//  2) Einzeln erzeugte Frames zu einem sauberen Raster-PNG PACKEN.
// Beides liefert das, was der `useSprite`-Hook des Spiels braucht:
// ein PNG-Raster + Frame-Maße/Animationen (→ assets.json type:"sheet").

import { loadImageEl } from './pixel';

export interface SliceResult {
  frames: string[]; // Base64 (ohne Präfix), Lesereihenfolge zeilenweise
  cols: number;
  rows: number;
  frameWidth: number;
  frameHeight: number;
  warnings: string[];
}

function canvasOf(w: number, h: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(w));
  canvas.height = Math.max(1, Math.round(h));
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas-2D-Kontext nicht verfügbar.');
  return { canvas, ctx };
}

function toBase64(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL('image/png').split(',')[1] ?? '';
}

/** Zerlegt ein Bild in cols×rows gleich große Frames. */
export async function sliceGrid(base64: string, cols: number, rows: number): Promise<SliceResult> {
  const safeCols = Math.max(1, Math.floor(cols));
  const safeRows = Math.max(1, Math.floor(rows));
  const img = await loadImageEl(base64);
  const warnings: string[] = [];

  // Ganzzahlige Frame-Größe; Rest wird verworfen und gemeldet (Edge-Case).
  const frameWidth = Math.floor(img.naturalWidth / safeCols);
  const frameHeight = Math.floor(img.naturalHeight / safeRows);
  if (frameWidth <= 0 || frameHeight <= 0) {
    throw new Error('Bild ist zu klein für diese Raster-Aufteilung.');
  }
  const remW = img.naturalWidth - frameWidth * safeCols;
  const remH = img.naturalHeight - frameHeight * safeRows;
  if (remW !== 0 || remH !== 0) {
    warnings.push(
      `Bildgröße ${img.naturalWidth}×${img.naturalHeight} ist nicht exakt durch ${safeCols}×${safeRows} teilbar — ${remW}px/${remH}px Rest werden ignoriert.`
    );
  }

  const frames: string[] = [];
  for (let r = 0; r < safeRows; r++) {
    for (let c = 0; c < safeCols; c++) {
      const { canvas, ctx } = canvasOf(frameWidth, frameHeight);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(
        img,
        c * frameWidth,
        r * frameHeight,
        frameWidth,
        frameHeight,
        0,
        0,
        frameWidth,
        frameHeight
      );
      frames.push(toBase64(canvas));
    }
  }
  return { frames, cols: safeCols, rows: safeRows, frameWidth, frameHeight, warnings };
}

/** Zerlegt anhand fester Frame-Maße (leitet cols/rows ab). */
export async function sliceByFrameSize(
  base64: string,
  frameWidth: number,
  frameHeight: number
): Promise<SliceResult> {
  const img = await loadImageEl(base64);
  if (frameWidth <= 0 || frameHeight <= 0) throw new Error('Frame-Maße müssen > 0 sein.');
  const cols = Math.max(1, Math.floor(img.naturalWidth / frameWidth));
  const rows = Math.max(1, Math.floor(img.naturalHeight / frameHeight));
  return sliceGrid(base64, cols, rows);
}

export interface PackResult {
  sheetBase64: string;
  frameWidth: number;
  frameHeight: number;
  cols: number;
  rows: number;
}

/**
 * Packt Frames in ein einzeiliges (oder cols-breites) Raster. Alle Frames
 * werden auf die größte vorkommende Frame-Box normalisiert (zentriert).
 */
export async function packFrames(frames: string[], cols?: number): Promise<PackResult> {
  if (frames.length === 0) throw new Error('Keine Frames zum Packen.');
  const imgs = await Promise.all(frames.map((f) => loadImageEl(f)));
  const frameWidth = Math.max(...imgs.map((i) => i.naturalWidth));
  const frameHeight = Math.max(...imgs.map((i) => i.naturalHeight));
  const safeCols = Math.max(1, Math.floor(cols ?? frames.length));
  const rows = Math.ceil(frames.length / safeCols);

  const { canvas, ctx } = canvasOf(frameWidth * safeCols, frameHeight * rows);
  ctx.imageSmoothingEnabled = false;
  imgs.forEach((img, idx) => {
    const c = idx % safeCols;
    const r = Math.floor(idx / safeCols);
    const dx = c * frameWidth + Math.floor((frameWidth - img.naturalWidth) / 2);
    const dy = r * frameHeight + Math.floor((frameHeight - img.naturalHeight) / 2);
    ctx.drawImage(img, dx, dy);
  });

  return { sheetBase64: toBase64(canvas), frameWidth, frameHeight, cols: safeCols, rows };
}
