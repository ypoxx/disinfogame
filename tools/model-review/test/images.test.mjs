import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { ladeBilder, sammleBildpfade, bildTokens, BildFehler } from '../src/images.mjs';

// 1×1-PNG, damit die Tests echte Bilddateien lesen statt Attrappen-Bytes.
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
);

function bilderOrdner(namen) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mr-img-'));
  for (const n of namen) fs.writeFileSync(path.join(dir, n), PNG);
  return dir;
}

test('ein Verzeichnis liefert alle Bilder darin, alphabetisch', () => {
  const dir = bilderOrdner(['03_c.png', '01_a.png', '02_b.png', 'notizen.txt']);
  const pfade = sammleBildpfade(dir);
  assert.deepEqual(pfade.map((p) => path.basename(p)), ['01_a.png', '02_b.png', '03_c.png']);
});

test('ein leeres Verzeichnis sagt, welche Endungen gehen', () => {
  const dir = bilderOrdner(['nur-text.txt']);
  assert.throws(() => sammleBildpfade(dir), (err) => err instanceof BildFehler && /\.png/.test(err.message));
});

test('ladeBilder erzeugt Daten-URLs mit passendem MIME-Typ', () => {
  const dir = bilderOrdner(['05_hud.png']);
  const [b] = ladeBilder([dir]);
  assert.equal(b.name, '05_hud.png');
  assert.equal(b.mime, 'image/png');
  assert.match(b.dataUrl, /^data:image\/png;base64,iVBOR/);
  assert.equal(b.bytes, PNG.length);
});

// Bilder sind der teuerste Teil des Prompts — die Zahl muss gedeckelt sein.
test('zu viele Bilder werden abgelehnt, mit Hinweis auf den Ausweg', () => {
  const dir = bilderOrdner(['a.png', 'b.png', 'c.png']);
  assert.throws(
    () => ladeBilder([dir], { maxAnzahl: 2 }),
    (err) => err instanceof BildFehler && /--max-bilder/.test(err.message)
  );
  assert.doesNotThrow(() => ladeBilder([dir], { maxAnzahl: 3 }));
});

test('zu große Bilder werden abgelehnt, mit Hinweis auf den Ausweg', () => {
  const dir = bilderOrdner(['riesig.png']);
  assert.throws(
    () => ladeBilder([dir], { maxBytes: 10 }),
    (err) => err instanceof BildFehler && /Screenshot verkleinern/.test(err.message)
  );
});

test('unbekannte Endungen fliegen auf', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mr-img-'));
  const datei = path.join(dir, 'bild.bmp');
  fs.writeFileSync(datei, PNG);
  assert.throws(() => ladeBilder([datei]), (err) => err instanceof BildFehler && /bmp/.test(err.message));
});

test('fehlender Pfad wird klar gemeldet', () => {
  assert.throws(() => sammleBildpfade('gibt/es/nicht.png'), BildFehler);
});

test('bildTokens skaliert mit der Anzahl und ist per Env einstellbar', () => {
  assert.equal(bildTokens(0), 0);
  assert.equal(bildTokens(3, 1000), 3000);
  assert.ok(bildTokens(1) > 0);
});

// 40 Screenshots (~8 MB) wurden am 2026-08-21 mit HTTP 502 quittiert — die
// Summe muss VOR dem Aufruf auffallen, nicht als HTML-Fehlerseite danach.
test('die Gesamtgröße aller Bilder ist gedeckelt, mit Hinweis aufs Aufteilen', () => {
  const dir = bilderOrdner(['a.png', 'b.png']);
  assert.throws(
    () => ladeBilder([dir], { maxSumme: 10 }),
    (err) => err instanceof BildFehler && /502/.test(err.message) && /aufteilen/i.test(err.message)
  );
  assert.doesNotThrow(() => ladeBilder([dir], { maxSumme: 10_000 }));
});
