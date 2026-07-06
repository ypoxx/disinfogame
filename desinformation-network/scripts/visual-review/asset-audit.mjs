// Asset-PNG-Audit (Realitätssicht, Schicht a — pixelgenau, ohne KI):
// scannt alle Bild-Assets auf eingebacktes Rand-Padding (v. a. transparente
// Zeilen UNTER dem sichtbaren Inhalt → Objekt „schwebt" trotz korrekter
// Engine-Standlinie) und vermisst die Content-Box. Für Sprite-Sheets wird
// jeder Frame einzeln gescannt (Min/Max der Boden-Lücke über die Frames).
//
// Lauf: node scripts/visual-review/asset-audit.mjs [--out runs/visual-review/latest/asset-audit.json]
// (sharp wird aus tools/asset-pipeline/node_modules aufgelöst — dort liegt es.)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GAME = path.resolve(__dirname, '..', '..');
const REPO = path.resolve(GAME, '..');

const require_ = createRequire(import.meta.url);
let sharp;
try {
  sharp = require_('sharp');
} catch {
  sharp = createRequire(path.join(REPO, 'tools', 'asset-pipeline', 'package.json'))('sharp');
}

const arg = (name, dflt) => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : dflt;
};
const OUT = path.resolve(GAME, arg('out', 'runs/visual-review/latest/asset-audit.json'));

const manifest = JSON.parse(fs.readFileSync(path.join(GAME, 'public/assets/assets.json'), 'utf8'));
const ALPHA_THRESHOLD = 8; // wie pixel-asset-pipeline trim({threshold: 8})

/** Content-Box (erste/letzte Zeile/Spalte mit Alpha > Schwelle) eines RGBA-Buffers. */
function contentBox(data, w, h, x0 = 0, y0 = 0, boxW = w, boxH = h) {
  let top = -1, bottom = -1, left = -1, right = -1;
  for (let y = y0; y < y0 + boxH; y++) {
    for (let x = x0; x < x0 + boxW; x++) {
      const a = data[(y * w + x) * 4 + 3];
      if (a > ALPHA_THRESHOLD) {
        if (top < 0) top = y;
        bottom = y;
        if (left < 0 || x < left) left = x;
        if (right < 0 || x > right) right = x;
      }
    }
  }
  if (top < 0) return null; // komplett transparent
  return {
    top: top - y0,
    bottom: bottom - y0,
    left: left - x0,
    right: right - x0,
    padBottom: y0 + boxH - 1 - bottom,
    padTop: top - y0,
    contentH: bottom - top + 1,
    contentW: right - left + 1,
  };
}

const results = [];
for (const asset of manifest.assets) {
  if (asset.type !== 'image' && asset.type !== 'sheet') continue;
  const file = path.join(GAME, 'public/assets', asset.file);
  if (!fs.existsSync(file)) {
    results.push({ id: asset.id, type: asset.type, error: 'Datei fehlt' });
    continue;
  }
  const img = sharp(file).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels } = info;
  if (channels !== 4) {
    results.push({ id: asset.id, type: asset.type, w, h, note: 'kein Alpha-Kanal (opakes Bild)' });
    continue;
  }
  if (asset.type === 'image') {
    const box = contentBox(data, w, h);
    results.push({
      id: asset.id,
      type: 'image',
      file: asset.file,
      w, h,
      box,
      hasAlpha: box ? box.padBottom + box.padTop + box.left + (w - 1 - box.right) > 0 : null,
    });
  } else {
    // Sheet: Frames nebeneinander (Zeile 0) — frameWidth/frameHeight aus dem Manifest.
    const fw = asset.frameWidth ?? w;
    const fh = asset.frameHeight ?? h;
    const cols = Math.max(1, Math.floor(w / fw));
    const rows = Math.max(1, Math.floor(h / fh));
    const frames = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const box = contentBox(data, w, h, c * fw, r * fh, fw, fh);
        if (box) frames.push({ frame: r * cols + c, ...box });
      }
    }
    const padBottoms = frames.map((f) => f.padBottom);
    results.push({
      id: asset.id,
      type: 'sheet',
      file: asset.file,
      w, h, frameWidth: fw, frameHeight: fh, frames: frames.length,
      padBottomMin: Math.min(...padBottoms),
      padBottomMax: Math.max(...padBottoms),
      contentHMax: Math.max(...frames.map((f) => f.contentH)),
      perFrame: frames,
    });
  }
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({ generatedAt: null, alphaThreshold: ALPHA_THRESHOLD, results }, null, 2));
console.log(`Asset-Audit: ${results.length} Assets → ${OUT}`);
const worst = results
  .filter((r) => (r.type === 'image' && r.box && r.box.padBottom > 0) || (r.type === 'sheet' && r.padBottomMin > 0))
  .sort((a, b) => (b.box?.padBottom ?? b.padBottomMin ?? 0) - (a.box?.padBottom ?? a.padBottomMin ?? 0))
  .slice(0, 15);
for (const r of worst) {
  console.log(`  ⬇ ${r.id}: padBottom=${r.box?.padBottom ?? `${r.padBottomMin}–${r.padBottomMax}`}px (h=${r.h})`);
}
