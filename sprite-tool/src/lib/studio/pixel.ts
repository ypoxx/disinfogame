// ===========================================
// PIXEL-NACHBEARBEITUNG (Canvas, clientseitig)
// ===========================================
// Macht aus einem "Pixel-Look"-Raster ein engine-näheres Asset:
// - Downscale auf Ziel-Raster mit Nearest-Neighbor (knackige Kanten statt Blur)
// - Hintergrund → Transparenz (Chroma-Key per Ecken-Farbe oder fixem Hex)
// - optionaler Paletten-Lock auf die Stil-Bibel-Farben
// Alle Funktionen arbeiten mit reinem Base64 (ohne data:-Präfix), passend zum
// restlichen Tool.

/** Lädt Base64 (ohne Präfix) als <img>. */
export function loadImageEl(base64: string, mime = 'image/png'): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Bild konnte nicht geladen werden.'));
    img.src = `data:${mime};base64,${base64}`;
  });
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

export interface Dimensions {
  width: number;
  height: number;
}

export async function getDimensions(base64: string): Promise<Dimensions> {
  const img = await loadImageEl(base64);
  return { width: img.naturalWidth, height: img.naturalHeight };
}

/** Verkleinert hart (Nearest-Neighbor) auf Zielgröße. */
export async function downscaleNearest(
  base64: string,
  targetW: number,
  targetH: number
): Promise<string> {
  const img = await loadImageEl(base64);
  const { canvas, ctx } = canvasOf(targetW, targetH);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, 0, 0, targetW, targetH);
  return toBase64(canvas);
}

/** Skaliert hoch (Nearest), nur für Vorschau/Export-Schärfe. */
export async function upscaleNearest(base64: string, factor: number): Promise<string> {
  const img = await loadImageEl(base64);
  const { canvas, ctx } = canvasOf(img.naturalWidth * factor, img.naturalHeight * factor);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return toBase64(canvas);
}

function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/**
 * Macht Pixel nahe einer Hintergrundfarbe transparent.
 * sample: 'corner' nimmt die obere-linke Ecke als BG-Farbe; sonst fixes Hex.
 * tolerance 0..255 (euklidischer Abstand im RGB-Raum).
 */
export async function keyOutBackground(
  base64: string,
  options: { sample?: 'corner' | string; tolerance?: number } = {}
): Promise<string> {
  const tolerance = options.tolerance ?? 28;
  const img = await loadImageEl(base64);
  const { canvas, ctx } = canvasOf(img.naturalWidth, img.naturalHeight);
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const px = data.data;

  let bg: [number, number, number];
  if (options.sample && options.sample !== 'corner') {
    const rgb = hexToRgb(options.sample);
    if (!rgb) return base64; // ungültiges Hex → nichts tun
    bg = rgb;
  } else {
    bg = [px[0], px[1], px[2]];
  }

  const tol2 = tolerance * tolerance;
  for (let i = 0; i < px.length; i += 4) {
    const dr = px[i] - bg[0];
    const dg = px[i + 1] - bg[1];
    const db = px[i + 2] - bg[2];
    if (dr * dr + dg * dg + db * db <= tol2) {
      px[i + 3] = 0; // transparent
    }
  }
  ctx.putImageData(data, 0, 0);
  return toBase64(canvas);
}

/** Bindet jeden Pixel an die nächste Palettenfarbe (Style-Lock). Erhält Alpha. */
export async function quantizeToPalette(base64: string, hexes: string[]): Promise<string> {
  const palette = hexes.map(hexToRgb).filter((c): c is [number, number, number] => c !== null);
  if (palette.length === 0) return base64;
  const img = await loadImageEl(base64);
  const { canvas, ctx } = canvasOf(img.naturalWidth, img.naturalHeight);
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const px = data.data;
  for (let i = 0; i < px.length; i += 4) {
    if (px[i + 3] === 0) continue; // transparent lassen
    let best = 0;
    let bestDist = Infinity;
    for (let p = 0; p < palette.length; p++) {
      const dr = px[i] - palette[p][0];
      const dg = px[i + 1] - palette[p][1];
      const db = px[i + 2] - palette[p][2];
      const d = dr * dr + dg * dg + db * db;
      if (d < bestDist) {
        bestDist = d;
        best = p;
      }
    }
    px[i] = palette[best][0];
    px[i + 1] = palette[best][1];
    px[i + 2] = palette[best][2];
  }
  ctx.putImageData(data, 0, 0);
  return toBase64(canvas);
}

/** Verkleinert proportional auf max. Kantenlänge (für leichte Critique-Payloads). */
export async function toThumb(base64: string, maxEdge = 384): Promise<string> {
  const img = await loadImageEl(base64);
  const scale = Math.min(1, maxEdge / Math.max(img.naturalWidth, img.naturalHeight));
  if (scale >= 1) return base64;
  const { canvas, ctx } = canvasOf(img.naturalWidth * scale, img.naturalHeight * scale);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return toBase64(canvas);
}
