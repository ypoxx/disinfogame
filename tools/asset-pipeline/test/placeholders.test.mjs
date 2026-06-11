import { test } from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { renderPlaceholder } from '../src/placeholders.mjs';

test('Raum-Platzhalter hat exakt die Zielauflösung 1344×768 (PNG)', async () => {
  const png = await renderPlaceholder({
    id: 'room_zentrale',
    type: 'image',
    kind: 'room',
    size: { w: 1344, h: 768 },
  });
  const meta = await sharp(png).metadata();
  assert.equal(meta.format, 'png');
  assert.equal(meta.width, 1344);
  assert.equal(meta.height, 768);
});

test('Sheet-Platzhalter hat exaktes Frame-Raster (8×32 = 256 breit) mit Alpha', async () => {
  const png = await renderPlaceholder({
    id: 'player_walk',
    type: 'sheet',
    frameWidth: 32,
    frameHeight: 32,
    cols: 8,
    rows: 1,
  });
  const meta = await sharp(png).metadata();
  assert.equal(meta.width, 256);
  assert.equal(meta.height, 32);
  assert.equal(meta.hasAlpha, true);
});

test('Porträt-Platzhalter wird kompakt gerendert (≤256px)', async () => {
  const png = await renderPlaceholder({
    id: 'portrait_marina',
    type: 'image',
    kind: 'portrait',
    size: { w: 1024, h: 1024 },
  });
  const meta = await sharp(png).metadata();
  assert.equal(meta.width, 256);
  assert.equal(meta.height, 256);
});
