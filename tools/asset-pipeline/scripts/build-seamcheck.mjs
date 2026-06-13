// Nahtprüfung der kachelbaren Gebäudeteile (ohne App): kachelt jeden Teil so wie
// BuildingStage (slab/city/corridor = repeat-x, facade/shaft = repeat-y) und legt
// die Streifen untereinander → sichtbare Nähte/Schachbrett fallen sofort auf.
// Ausgabe → runs/build-check/ (gitignored).
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { OUT_DIR, RUNS_DIR } from '../src/paths.mjs';

const OUT = path.join(RUNS_DIR, 'build-check');
fs.mkdirSync(OUT, { recursive: true });
const img = (f) => path.join(OUT_DIR, 'images', f);

async function tileTo(file, W, H, axis) {
  const src = await sharp(img(file)).resize(axis === 'x' ? { height: H } : { width: W }).png().toBuffer();
  return sharp({ create: { width: W, height: H, channels: 4, background: { r: 16, g: 17, b: 22, alpha: 1 } } })
    .composite([{ input: src, tile: true }])
    .png()
    .toBuffer();
}

// repeat-x: slab (24px hoch, hier 32 zur Sichtbarkeit), city, corridor; repeat-y: facade, shaft
const strips = [
  await tileTo('bld_floor_slab.png', 760, 36, 'x'),
  await tileTo('bld_corridor.png', 760, 150, 'x'),
  await tileTo('bld_city_far.png', 760, 130, 'x'),
  await tileTo('bld_facade_pillar.png', 96, 300, 'y'),
  await tileTo('bld_shaft.png', 96, 300, 'y'),
];
// vertikale Stapelung der x-Streifen
const xH = 36 + 150 + 130 + 24;
const xImg = sharp({ create: { width: 760, height: xH, channels: 4, background: { r: 10, g: 10, b: 14, alpha: 1 } } })
  .composite([
    { input: strips[0], top: 0, left: 0 },
    { input: strips[1], top: 48, left: 0 },
    { input: strips[2], top: 48 + 150 + 8, left: 0 },
  ]);
fs.writeFileSync(path.join(OUT, 'seam_x_slab_corridor_city.png'), await xImg.png().toBuffer());
// y-Streifen nebeneinander
const yImg = sharp({ create: { width: 220, height: 300, channels: 4, background: { r: 10, g: 10, b: 14, alpha: 1 } } })
  .composite([{ input: strips[3], top: 0, left: 8 }, { input: strips[4], top: 0, left: 116 }]);
fs.writeFileSync(path.join(OUT, 'seam_y_facade_shaft.png'), await yImg.png().toBuffer());
console.log('seam-check geschrieben →', OUT);
