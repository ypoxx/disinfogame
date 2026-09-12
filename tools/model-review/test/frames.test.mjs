import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { marken, ziehe, FFMPEG, FrameFehler } from '../src/frames.mjs';

// Die Clips der Ernte haben vorne den Spiel-Vorlauf; interessant ist das ENDE.
// Deshalb sind alle Marken negativ (Suche vom Clip-Ende her, ffmpeg -sseof).
test('Marken liegen im letzten Fenster und laufen aufs Ende zu', () => {
  const m = marken(4, 6);
  assert.equal(m.length, 4);
  assert.ok(m.every((x) => x < 0), `alle Marken müssen vom Ende her zählen: ${m}`);
  assert.deepEqual(m, [-6, -4, -2, -0.2]);
  for (let i = 1; i < m.length; i++) assert.ok(m[i] > m[i - 1], 'Marken müssen aufs Ende zulaufen');
});

test('eine einzelne Marke liegt in der Mitte des Fensters', () => {
  assert.deepEqual(marken(1, 6), [-3]);
});

test('keine Marken bei Anzahl 0', () => {
  assert.deepEqual(marken(0, 6), []);
});

test('fehlender Clip wird klar gemeldet', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mr-f-'));
  assert.throws(() => ziehe('/gibt/es/nicht.webm', dir), (err) => err instanceof FrameFehler && /Clip fehlt/.test(err.message));
});

test('fehlendes ffmpeg nennt die Stellschraube', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mr-f-'));
  const clip = path.join(dir, 'x.webm');
  fs.writeFileSync(clip, 'nicht wirklich video');
  assert.throws(
    () => ziehe(clip, dir, { ffmpeg: '/gibt/es/nicht/ffmpeg' }),
    (err) => err instanceof FrameFehler && /MODEL_REVIEW_FFMPEG/.test(err.message)
  );
});

// Läuft nur, wo das Container-ffmpeg liegt — sonst übersprungen statt rot.
test('aus einem echten Clip entstehen Bilder', { skip: !fs.existsSync(FFMPEG) }, () => {
  const quelle = '/home/user/disinfogame/desinformation-network/runs/visual-review/latest/clips';
  if (!fs.existsSync(quelle)) return;
  const clip = fs.readdirSync(quelle).find((n) => n.endsWith('.webm'));
  if (!clip) return;
  const ziel = fs.mkdtempSync(path.join(os.tmpdir(), 'mr-f-'));
  const bilder = ziehe(path.join(quelle, clip), ziel, { anzahl: 3, durationMs: 4000 });
  assert.ok(bilder.length >= 1, 'mindestens ein Bild');
  assert.ok(bilder.every((b) => fs.statSync(b).size > 1000), 'Bilder dürfen nicht leer sein');
  assert.match(path.basename(bilder[0]), /__f\d+\.png$/);
});
