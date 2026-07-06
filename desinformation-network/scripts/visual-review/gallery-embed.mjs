// Galerie-Helfer: skaliert/croppt Screenshots und gibt data:-URIs aus (JSON),
// damit eine selbst-enthaltene HTML-Galerie gebaut werden kann (Artifact/Owner).
// Lauf: node scripts/visual-review/gallery-embed.mjs spec.json > embeds.json
//   spec.json: [{ id, file, crop?: {left,top,width,height}, width?: 640 }]
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require_ = createRequire(import.meta.url);
let sharp;
try {
  sharp = require_('sharp');
} catch {
  sharp = createRequire(path.resolve(process.cwd(), '..', 'tools', 'asset-pipeline', 'package.json'))('sharp');
}

const spec = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const out = [];
for (const s of spec) {
  let img = sharp(s.file);
  if (s.crop) img = img.extract(s.crop);
  img = img.resize({ width: s.width ?? 640, withoutEnlargement: false, kernel: 'nearest' });
  const buf = await img.png({ compressionLevel: 9, palette: true }).toBuffer();
  out.push({ id: s.id, dataUri: `data:image/png;base64,${buf.toString('base64')}`, bytes: buf.length });
}
console.log(JSON.stringify(out));
console.error('gesamt:', out.reduce((a, b) => a + b.bytes, 0), 'bytes');
