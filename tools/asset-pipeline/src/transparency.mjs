// ===========================================
// FREISTELLEN — Chroma-Key für Sheets/Props
// ===========================================
// Bildmodelle liefern keine echte Alpha-Transparenz: "transparent background"
// wird als gemaltes Schachbrett oder Szene interpretiert. Deshalb fordern die
// Prompts einen uniformen Magenta-Hintergrund (#FF00FF), der hier zu echtem
// Alpha ausgestanzt wird.

import sharp from 'sharp';

export const CHROMA_HEX = '#FF00FF';
export const CHROMA_PROMPT =
  'The background is one single flat uniform solid magenta color (#FF00FF) everywhere ' +
  'outside the subject — no checkerboard pattern, no scene, no gradient, no shadows on the background.';

/**
 * Stanzt magenta-nahe Pixel aus einem rohen RGBA-Buffer aus (in-place).
 * @param {Buffer} rgba - Rohpixel, 4 Kanäle
 * @param {number} tolerance - max. Kanalabweichung von reinem Magenta
 * @returns {number} Anzahl transparent gesetzter Pixel
 */
export function keyOutMagentaRaw(rgba, tolerance = 90) {
  let cleared = 0;
  for (let i = 0; i < rgba.length; i += 4) {
    const r = rgba[i];
    const g = rgba[i + 1];
    const b = rgba[i + 2];
    if (255 - r <= tolerance && g <= tolerance && 255 - b <= tolerance) {
      rgba[i + 3] = 0;
      cleared++;
    }
  }
  return cleared;
}

/**
 * Entfernt Magenta-Säume (Anti-Aliasing-Reste an den Kanten): alle Pixel,
 * in denen Rot UND Blau deutlich über Grün liegen, werden transparent.
 * Motivfarben (rote Krawatte: Blau niedrig; Grau/Olive: Kanäle nah beieinander)
 * bleiben unberührt.
 * @param {Buffer} rgba - Rohpixel, 4 Kanäle
 * @returns {number} Anzahl transparent gesetzter Pixel
 */
export function defringeMagentaRaw(rgba, dominance = 50) {
  let cleared = 0;
  for (let i = 0; i < rgba.length; i += 4) {
    if (rgba[i + 3] === 0) continue;
    const g = rgba[i + 1];
    if (rgba[i] - g >= dominance && rgba[i + 2] - g >= dominance) {
      rgba[i + 3] = 0;
      cleared++;
    }
  }
  return cleared;
}

/**
 * PNG-Buffer → PNG-Buffer mit echtem Alpha statt Magenta-Hintergrund.
 * @param {Buffer} pngBuffer
 * @returns {Promise<Buffer>}
 */
export async function keyOutMagenta(pngBuffer) {
  const { data, info } = await sharp(pngBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  keyOutMagentaRaw(data);
  defringeMagentaRaw(data);
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toBuffer();
}

/**
 * Findet zusammenhängende Posen-Segmente (Spalten mit sichtbaren Pixeln)
 * in einem freigestellten RGBA-Bild.
 * @returns {Array<{x0:number,x1:number}>} Segmente (x1 exklusiv)
 */
export function findPoseSegments(rgba, width, height, minGap = 2, minWidth = 4) {
  const colHasPixel = new Array(width).fill(false);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (rgba[(y * width + x) * 4 + 3] > 0) colHasPixel[x] = true;
    }
  }
  const segments = [];
  let start = -1;
  let gap = 0;
  for (let x = 0; x <= width; x++) {
    const filled = x < width && colHasPixel[x];
    if (filled) {
      if (start === -1) start = x;
      gap = 0;
    } else if (start !== -1 && ++gap >= minGap) {
      const end = x - gap + 1;
      if (end - start >= minWidth) segments.push({ x0: start, x1: end });
      start = -1;
      gap = 0;
    }
  }
  if (start !== -1) segments.push({ x0: start, x1: width });
  return segments.filter((s) => s.x1 - s.x0 >= minWidth);
}

/**
 * Findet Posen-Bounding-Boxen in Lesereihenfolge: erst horizontale
 * Zeilenbänder (Modelle malen Sheets gern mehrzeilig), darin Spalten-Segmente,
 * je Segment die enge y-Ausdehnung.
 * @returns {Array<{x0:number,x1:number,y0:number,y1:number}>} (x1/y1 exklusiv)
 */
export function findPoseBoxes(rgba, width, height, minGap = 2, minSize = 4) {
  const rowHasPixel = new Array(height).fill(false);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (rgba[(y * width + x) * 4 + 3] > 0) {
        rowHasPixel[y] = true;
        break;
      }
    }
  }
  // Zeilenbänder bestimmen
  const bands = [];
  let start = -1;
  let gap = 0;
  for (let y = 0; y <= height; y++) {
    const filled = y < height && rowHasPixel[y];
    if (filled) {
      if (start === -1) start = y;
      gap = 0;
    } else if (start !== -1 && ++gap >= minGap) {
      const end = y - gap + 1;
      if (end - start >= minSize) bands.push({ y0: start, y1: end });
      start = -1;
      gap = 0;
    }
  }
  if (start !== -1) bands.push({ y0: start, y1: height });

  const boxes = [];
  for (const band of bands.filter((b) => b.y1 - b.y0 >= minSize)) {
    // Spalten-Segmente nur innerhalb des Bands betrachten
    const bandHeight = band.y1 - band.y0;
    const bandRgba = Buffer.alloc(width * bandHeight * 4);
    rgba.copy(bandRgba, 0, band.y0 * width * 4, band.y1 * width * 4);
    for (const seg of findPoseSegments(bandRgba, width, bandHeight, minGap, minSize)) {
      let yMin = band.y1;
      let yMax = band.y0 - 1;
      for (let y = band.y0; y < band.y1; y++) {
        for (let x = seg.x0; x < seg.x1; x++) {
          if (rgba[(y * width + x) * 4 + 3] > 0) {
            if (y < yMin) yMin = y;
            if (y > yMax) yMax = y;
          }
        }
      }
      if (yMax >= yMin) boxes.push({ x0: seg.x0, x1: seg.x1, y0: yMin, y1: yMax + 1 });
    }
  }
  return boxes;
}

/**
 * Rastet ein freigestelltes Sheet neu ein: erkennt Einzelposen (auch wenn das
 * Modell mehrzeilig gemalt hat) und montiert die ersten `cols` Posen
 * mittig/bodenbündig in exakte frameWidth×frameHeight-Zellen. Alle Posen
 * werden mit DEMSELBEN Faktor skaliert, damit die Animation nicht "pumpt".
 * Liefert null, wenn zu wenig Posen erkannt wurden (Fallback: Original-Raster).
 * @param {Buffer} pngBuffer - freigestelltes PNG (das Modell darf größer malen)
 * @param {{cols:number, frameWidth:number, frameHeight:number}} grid
 * @returns {Promise<Buffer|null>}
 */
export async function repackSheet(pngBuffer, { cols, frameWidth, frameHeight }) {
  const { data, info } = await sharp(pngBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const boxes = findPoseBoxes(data, info.width, info.height);
  if (boxes.length < cols) return null;
  const used = boxes.slice(0, cols);

  // Einheitlicher Skalierungsfaktor: größte Pose füllt die Zelle gerade aus.
  const maxW = Math.max(...used.map((b) => b.x1 - b.x0));
  const maxH = Math.max(...used.map((b) => b.y1 - b.y0));
  const scale = Math.min(frameWidth / maxW, frameHeight / maxH);

  const composites = [];
  for (let c = 0; c < cols; c++) {
    const box = used[c];
    const w = Math.max(1, Math.round((box.x1 - box.x0) * scale));
    const h = Math.max(1, Math.round((box.y1 - box.y0) * scale));
    const pose = await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
      .extract({ left: box.x0, top: box.y0, width: box.x1 - box.x0, height: box.y1 - box.y0 })
      .resize(Math.min(w, frameWidth), Math.min(h, frameHeight), { fit: 'fill', kernel: 'nearest' })
      .png()
      .toBuffer();
    const meta = await sharp(pose).metadata();
    composites.push({
      input: pose,
      left: c * frameWidth + Math.floor((frameWidth - meta.width) / 2),
      top: frameHeight - meta.height, // bodenbündig: Figuren stehen auf der Zell-Unterkante
    });
  }
  return sharp({
    create: { width: cols * frameWidth, height: frameHeight, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite(composites)
    .png()
    .toBuffer();
}
