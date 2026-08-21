import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { liesManifest, baueBuendel, buendelFrage, syntheseFrage, SerienFehler } from '../src/serie.mjs';

const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
);

const MANIFEST = [
  { id: 'title', kind: 'shot', file: 'shots/title.png', bundle: 'intro', desc: 'Titelbildschirm' },
  { id: 'avatar', kind: 'shot', file: 'shots/avatar.png', bundle: 'intro', desc: 'Avatar-Wahl' },
  { id: 'lobby', kind: 'shot', file: 'shots/lobby.png', bundle: 'building', desc: 'Lobby am Tag' },
  { id: 'walk', kind: 'clip', file: 'clips/walk.webm', bundle: 'building', desc: 'Laufzyklus' },
  { id: 'weg', kind: 'shot', file: 'shots/fehlt.png', bundle: 'building', desc: 'nicht geerntet' },
];

/** Ernte-Ordner nachbauen — ohne die Datei „fehlt.png". */
function ernte(manifest = MANIFEST) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mr-ernte-'));
  fs.mkdirSync(path.join(dir, 'shots'));
  fs.mkdirSync(path.join(dir, 'clips'));
  for (const e of manifest) {
    if (e.id === 'weg') continue;
    fs.writeFileSync(path.join(dir, e.file), PNG);
  }
  fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(manifest));
  return dir;
}

test('fehlende Ernte nennt den Befehl zum Ernten', () => {
  assert.throws(
    () => liesManifest('/gibt/es/nicht'),
    (err) => err instanceof SerienFehler && /harvest\.mjs/.test(err.message)
  );
});

test('Bündel entstehen nach Bündel-Namen, Clips getrennt von Bildern', () => {
  const dir = ernte();
  const b = baueBuendel(liesManifest(dir), dir);
  assert.deepEqual(b.map((x) => x.name), ['intro', 'building', 'building_clips']);
  assert.equal(b[0].dateien.length, 2);
  assert.equal(b[1].kind, 'shot');
  assert.equal(b[2].kind, 'clip');
});

// Ein Manifest-Eintrag ohne Datei würde den Lauf sonst mitten drin abbrechen.
test('Einträge ohne vorhandene Datei werden übersprungen', () => {
  const dir = ernte();
  const b = baueBuendel(liesManifest(dir), dir);
  const building = b.find((x) => x.name === 'building');
  assert.equal(building.dateien.length, 1, 'nur die wirklich vorhandene Lobby');
  assert.ok(!building.beschreibungen.join(' ').includes('nicht geerntet'));
});

test('--buendel grenzt ein', () => {
  const dir = ernte();
  const b = baueBuendel(liesManifest(dir), dir, { nurBuendel: ['intro'] });
  assert.deepEqual(b.map((x) => x.name), ['intro']);
});

// Beschneiden würde Aufnahmen still verschlucken — genau das, was bei einem
// „möglichst ausführlichen" Durchgang niemand will.
test('zu große Bündel werden geteilt statt beschnitten', () => {
  const dir = ernte();
  const b = baueBuendel(liesManifest(dir), dir, { maxProBuendel: 1 });
  const introTeile = b.filter((x) => x.name.startsWith('intro'));
  assert.deepEqual(introTeile.map((x) => x.name), ['intro-1von2', 'intro-2von2']);
  assert.equal(introTeile.flatMap((x) => x.dateien).length, 2, 'keine Aufnahme darf verloren gehen');
});

test('passt ein Bündel in einen Durchgang, bleibt der Name schlicht', () => {
  const dir = ernte();
  const b = baueBuendel(liesManifest(dir), dir, { maxProBuendel: 12 });
  assert.ok(b.some((x) => x.name === 'intro'));
  assert.ok(!b.some((x) => x.name.includes('von')));
});

// Ohne diese Liste weiß das Modell nicht, WAS es da sieht.
test('die Bündel-Frage zählt auf, was zu sehen ist, und grenzt den Blick ein', () => {
  const dir = ernte();
  const [intro] = baueBuendel(liesManifest(dir), dir);
  const f = buendelFrage({ auftrag: 'Beurteile die Optik.' }, intro);
  assert.match(f, /Beurteile die Optik\./);
  assert.match(f, /Bündel „intro" \(2 Screenshots\)/);
  assert.match(f, /title\.png — Titelbildschirm/);
  assert.match(f, /verweise nicht auf Dinge, die du hier nicht siehst/);
});

test('Clip-Bündel werden als Clips angekündigt', () => {
  const dir = ernte();
  const clips = baueBuendel(liesManifest(dir), dir).find((x) => x.kind === 'clip');
  assert.match(buendelFrage({ auftrag: 'x' }, clips), /\(1 Clips\)/);
});

test('die Synthese-Frage sucht Muster über die Bündel statt Wiederholung', () => {
  const f = syntheseFrage([
    { name: 'intro', text: 'Befund A' },
    { name: 'building', text: 'Befund B' },
  ]);
  assert.match(f, /Wiederkehrende Muster/);
  assert.match(f, /Widersprüche zwischen den Bündeln/);
  assert.match(f, /Rangliste der 10 wirksamsten/);
  assert.match(f, /Bündel „intro"/);
  assert.match(f, /Befund B/);
});

test('parallelBegrenzt hält die Reihenfolge und die Obergrenze ein', async () => {
  const { parallelBegrenzt } = await import('../src/serie.mjs');
  let gleichzeitig = 0;
  let hoechststand = 0;
  const aufgaben = Array.from({ length: 9 }, (_, i) => async () => {
    gleichzeitig++;
    hoechststand = Math.max(hoechststand, gleichzeitig);
    await new Promise((r) => setTimeout(r, 10));
    gleichzeitig--;
    return i;
  });
  const ergebnis = await parallelBegrenzt(aufgaben, 3);
  assert.deepEqual(ergebnis, [0, 1, 2, 3, 4, 5, 6, 7, 8], 'Reihenfolge muss der Eingabe entsprechen');
  assert.ok(hoechststand <= 3, `nie mehr als 3 gleichzeitig, war ${hoechststand}`);
  assert.ok(hoechststand > 1, 'es soll auch wirklich parallel laufen');
});

test('parallelBegrenzt kommt mit weniger Aufgaben als Plätzen klar', async () => {
  const { parallelBegrenzt } = await import('../src/serie.mjs');
  assert.deepEqual(await parallelBegrenzt([async () => 'a'], 8), ['a']);
  assert.deepEqual(await parallelBegrenzt([], 3), []);
});

// "voll, voll, Rest" erzeugt sonst einen Durchgang mit einer einzelnen Aufnahme.
test('geteilte Bündel werden gleichmäßig gefüllt', () => {
  const manifest = Array.from({ length: 13 }, (_, i) => ({
    id: `s${i}`, kind: 'shot', file: `shots/s${i}.png`, bundle: 'panels', desc: `Bild ${i}`,
  }));
  const dir = ernte(manifest);
  const teile = baueBuendel(liesManifest(dir), dir, { maxProBuendel: 12 });
  assert.deepEqual(teile.map((t) => t.dateien.length), [7, 6]);
  assert.deepEqual(teile.map((t) => t.name), ['panels-1von2', 'panels-2von2']);
});
