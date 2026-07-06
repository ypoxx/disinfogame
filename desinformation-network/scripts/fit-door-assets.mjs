// Tür-Assets auf ihre WELT-Box einpassen (Auflösungs-Etappe, Review B1/B7-Folge):
// bld_door_closed/open liegen seit dem B7-Trim auf einer 110×173-Leinwand, werden
// aber in einer 96×144-Box mit objectFit:fill angezeigt → nicht-ganzzahlig UND
// leicht verzerrt (0,87×/0,83×). Dieses Skript resampelt EINMALIG hochwertig
// (lanczos3) auf Zielhöhe 144, zentriert auf einer 96×144-Leinwand, bodenbündig —
// danach ist die Anzeige 1:1 Welt-Pixel und bei Bühnen-Scale ½ pixel-sauber.
//
// Idempotent: Assets, die bereits 96×144 sind, werden übersprungen.
// Lauf: node scripts/fit-door-assets.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GAME = path.resolve(__dirname, '..');
const REPO = path.resolve(GAME, '..');

const require_ = createRequire(import.meta.url);
const sharp = require_(path.join(REPO, 'tools', 'asset-pipeline', 'node_modules', 'sharp'));

const TARGET_W = 96; // STAGE.doorWidth
const TARGET_H = 144; // STAGE.doorHeight (≈ 1,97 m = 1,13 H, Stil-Bibel-Soll)

const manifest = JSON.parse(fs.readFileSync(path.join(GAME, 'public/assets/assets.json'), 'utf8'));
const byId = Object.fromEntries(manifest.assets.map((a) => [a.id, a]));

for (const id of ['bld_door_closed', 'bld_door_open']) {
  const entry = byId[id];
  if (!entry) { console.error(`${id}: nicht im Manifest`); process.exitCode = 1; continue; }
  const file = path.join(GAME, 'public/assets', entry.file);
  const img = sharp(file);
  const meta = await img.metadata();
  if (meta.width === TARGET_W && meta.height === TARGET_H) {
    console.log(`${id}: bereits ${TARGET_W}×${TARGET_H} — übersprungen`);
    continue;
  }
  // Auf Zielhöhe skalieren (Aspekt bleibt), horizontal zentriert auf die Box padden.
  const scaled = await img.resize({ height: TARGET_H, kernel: 'lanczos3' }).toBuffer();
  const w = (await sharp(scaled).metadata()).width;
  if (w > TARGET_W) {
    // Breiter als die Box: mittig beschneiden (sollte bei 110×173 → 92×144 nie greifen).
    const left = Math.floor((w - TARGET_W) / 2);
    await sharp(scaled).extract({ left, top: 0, width: TARGET_W, height: TARGET_H }).toFile(file + '.tmp');
  } else {
    const padL = Math.floor((TARGET_W - w) / 2);
    await sharp({
      create: { width: TARGET_W, height: TARGET_H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
    })
      .composite([{ input: scaled, left: padL, top: 0 }])
      .png()
      .toFile(file + '.tmp');
  }
  fs.renameSync(file + '.tmp', file);
  console.log(`${id}: ${meta.width}×${meta.height} → ${TARGET_W}×${TARGET_H} (Inhalt ${w}px breit, bodenbündig)`);
}
