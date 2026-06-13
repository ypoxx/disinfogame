// Composite-Vorschau: NPC-Halbfigur in ihren Raum, exakt wie NpcRoomView platziert
// (bodenbündig, Hüftschnitt läuft aus dem Bild). Verifiziert: kein Briefmarken-Effekt.
// Ausgabe → runs/npc-half-preview/ (gitignored). KEINE API-Aufrufe.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { OUT_DIR, RUNS_DIR } from '../src/paths.mjs';

const MAP = { alexei: 'cyber_lab', marina: 'medien_zentrum', katja: 'feld_ops', direktor: 'zentrale', igor: 'finanzen' };
const OUT = path.join(RUNS_DIR, 'npc-half-preview');
fs.mkdirSync(OUT, { recursive: true });
const img = (f) => path.join(OUT_DIR, 'images', f);

const W = 960, H = 540;
for (const [npc, room] of Object.entries(MAP)) {
  const roomBuf = await sharp(img(`room_${room}.png`)).resize(W, H, { fit: 'fill' }).png().toBuffer();
  // Lesbarkeits-Verlauf unten (wie NpcRoomView)
  const grad = Buffer.from(
    `<svg width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="55%" stop-color="rgba(5,7,13,0)"/><stop offset="100%" stop-color="rgba(5,7,13,0.82)"/>` +
    `</linearGradient></defs><rect width="${W}" height="${H}" fill="url(#g)"/></svg>`
  );
  // Figur: bodenbündig (bottom:0), Höhe ~74%, rechts der Mitte
  const figH = Math.round(H * 0.74);
  const fig = await sharp(img(`npc_half_${npc}.png`)).resize({ height: figH }).png().toBuffer();
  const fm = await sharp(fig).metadata();
  const out = await sharp(roomBuf)
    .composite([
      { input: fig, top: H - figH, left: Math.round(W * 0.60 - fm.width / 2) },
      { input: grad, top: 0, left: 0 },
    ])
    .png()
    .toBuffer();
  const file = path.join(OUT, `room_with_${npc}.png`);
  fs.writeFileSync(file, out);
  console.log('   ✔', path.relative(process.cwd(), file));
}
console.log('Fertig.');
