import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {
  keyOutMagenta,
  keyOutMagentaRaw,
  defringeMagentaRaw,
  findPoseSegments,
  findPoseBoxes,
  repackSheet,
} from '../src/transparency.mjs';
import { buildShotlist } from '../src/shotlist.mjs';

test('keyOutMagentaRaw: magenta wird transparent, Motivfarben bleiben deckend', () => {
  // 4 Pixel: reines Magenta, fast-Magenta, Grau (Anzug), Olivgrün
  const rgba = Buffer.from([
    255, 0, 255, 255,
    230, 40, 235, 255,
    107, 114, 128, 255,
    74, 93, 35, 255,
  ]);
  const cleared = keyOutMagentaRaw(rgba);
  assert.equal(cleared, 2);
  assert.equal(rgba[3], 0);
  assert.equal(rgba[7], 0);
  assert.equal(rgba[11], 255);
  assert.equal(rgba[15], 255);
});

test('keyOutMagenta: PNG bekommt echten Alphakanal', async () => {
  // 2×1-PNG: links Magenta, rechts Grau
  const raw = Buffer.from([255, 0, 255, 255, 107, 114, 128, 255]);
  const png = await sharp(raw, { raw: { width: 2, height: 1, channels: 4 } }).png().toBuffer();
  const out = await keyOutMagenta(png);
  const { data, info } = await sharp(out).raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.channels, 4);
  assert.equal(data[3], 0, 'Magenta-Pixel muss transparent sein');
  assert.equal(data[7], 255, 'Motiv-Pixel muss deckend bleiben');
});

test('defringeMagentaRaw: Magenta-Saum verschwindet, rote Krawatte bleibt', () => {
  // Pixel 1: violetter Saum (R/B deutlich über G), Pixel 2: Sowjet-Rot #B22234
  const rgba = Buffer.from([180, 90, 190, 255, 178, 34, 52, 255]);
  const cleared = defringeMagentaRaw(rgba);
  assert.equal(cleared, 1);
  assert.equal(rgba[3], 0);
  assert.equal(rgba[7], 255);
});

test('findPoseSegments: erkennt durch Lücken getrennte Posen', () => {
  // 12×1: Pixel an x=0..3 und x=8..11, Lücke dazwischen
  const w = 12;
  const rgba = Buffer.alloc(w * 4);
  for (const x of [0, 1, 2, 3, 8, 9, 10, 11]) rgba[x * 4 + 3] = 255;
  const segs = findPoseSegments(rgba, w, 1, 2, 2);
  assert.equal(segs.length, 2);
  assert.deepEqual(segs[0], { x0: 0, x1: 4 });
  assert.deepEqual(segs[1], { x0: 8, x1: 12 });
});

test('repackSheet: montiert erkannte Posen in exakte Zellen (bodenbündig)', async () => {
  // 64×16-Bild mit 2 deckenden 8×8-Blöcken bei x=4 und x=36, Rest transparent
  const w = 64;
  const h = 16;
  const rgba = Buffer.alloc(w * h * 4);
  for (let y = 4; y < 12; y++) {
    for (const x0 of [4, 36]) {
      for (let x = x0; x < x0 + 8; x++) {
        const i = (y * w + x) * 4;
        rgba[i] = 107;
        rgba[i + 1] = 114;
        rgba[i + 2] = 128;
        rgba[i + 3] = 255;
      }
    }
  }
  const png = await sharp(rgba, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
  const out = await repackSheet(png, { cols: 2, frameWidth: 16, frameHeight: 16 });
  assert.ok(out, 'Repack muss bei 2 erkannten Posen greifen');
  const meta = await sharp(out).metadata();
  assert.equal(meta.width, 32);
  assert.equal(meta.height, 16);
  const { data } = await sharp(out).raw().toBuffer({ resolveWithObject: true });
  // Posen stehen bodenbündig: unterste Zeile jeder Zelle hat sichtbare Pixel
  const lastRow = 15;
  const cell0 = data[(lastRow * 32 + 8) * 4 + 3];
  const cell1 = data[(lastRow * 32 + 24) * 4 + 3];
  assert.ok(cell0 > 0 && cell1 > 0, 'Posen müssen auf der Zell-Unterkante stehen');
  // Zu wenig Posen → null (Fallback aufs alte Verhalten)
  assert.equal(await repackSheet(png, { cols: 4, frameWidth: 16, frameHeight: 16 }), null);
});

test('findPoseBoxes: erkennt Posen auch in mehrzeiligen Sheets (Lesereihenfolge)', () => {
  // 32×32: je 2 Posen (6×6) in 2 Zeilenbändern
  const w = 32;
  const h = 32;
  const rgba = Buffer.alloc(w * h * 4);
  const put = (x0, y0) => {
    for (let y = y0; y < y0 + 6; y++)
      for (let x = x0; x < x0 + 6; x++) rgba[(y * w + x) * 4 + 3] = 255;
  };
  put(2, 2);
  put(20, 2);
  put(2, 20);
  put(20, 20);
  const boxes = findPoseBoxes(rgba, w, h);
  assert.equal(boxes.length, 4);
  assert.deepEqual(boxes[0], { x0: 2, x1: 8, y0: 2, y1: 8 });
  assert.deepEqual(boxes[3], { x0: 20, x1: 26, y0: 20, y1: 26 });
});

test('Sheets und Props fordern den Magenta-Hintergrund im Prompt an', () => {
  const shots = buildShotlist();
  for (const s of shots.filter((x) => x.type === 'sheet' || x.kind === 'prop')) {
    assert.ok(/#FF00FF/.test(s.prompt), `Chroma-Prompt fehlt in ${s.id}`);
  }
});
