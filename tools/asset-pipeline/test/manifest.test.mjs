import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  buildEntry,
  filePathFor,
  folderForType,
  mergeManifest,
  readManifest,
  validateManifest,
  writeAssetFile,
  writeManifest,
} from '../src/manifest.mjs';

test('Pfad-Konventionen entsprechen dem sprite-tool (folderForType/filePathFor)', () => {
  assert.equal(folderForType('image'), 'images');
  assert.equal(folderForType('sheet'), 'sheets');
  assert.equal(folderForType('sfx'), 'sounds');
  assert.equal(folderForType('voice'), 'sounds');
  assert.equal(folderForType('music'), 'sounds');
  assert.equal(filePathFor({ type: 'image', id: 'room_zentrale' }), 'images/room_zentrale.png');
  assert.equal(filePathFor({ type: 'voice', id: 'voice_direktor_intro' }), 'sounds/voice_direktor_intro.mp3');
});

test('buildEntry übernimmt Sheet-Metadaten nur für Sheets', () => {
  const sheet = buildEntry({
    id: 'player_walk',
    type: 'sheet',
    frameWidth: 32,
    frameHeight: 32,
    animations: { walkRight: { row: 0, frames: 8, frameTime: 90, loop: true } },
  });
  assert.equal(sheet.file, 'sheets/player_walk.png');
  assert.equal(sheet.frameWidth, 32);
  assert.equal(sheet.animations.walkRight.frames, 8);

  const image = buildEntry({ id: 'room_zentrale', type: 'image', frameWidth: 32 });
  assert.equal(image.frameWidth, undefined);
});

test('mergeManifest: Upsert je (type,id), stabil sortiert, fremde Einträge bleiben', () => {
  const existing = {
    assets: [
      { id: 'zzz_old', type: 'image', file: 'images/zzz_old.png', chosen: true },
      { id: 'room_zentrale', type: 'image', file: 'images/room_zentrale.png', chosen: true, provider: 'placeholder' },
    ],
  };
  const merged = mergeManifest(existing, [
    buildEntry({ id: 'room_zentrale', type: 'image', provider: 'gemini-3-pro-image' }),
    buildEntry({ id: 'sfx_click', type: 'sfx' }),
  ]);
  assert.equal(merged.assets.length, 3);
  const room = merged.assets.find((a) => a.id === 'room_zentrale');
  assert.equal(room.provider, 'gemini-3-pro-image'); // ersetzt den Platzhalter
  assert.ok(merged.assets.some((a) => a.id === 'zzz_old')); // bleibt erhalten
  const ids = merged.assets.map((a) => `${a.type}/${a.id}`);
  assert.deepEqual(ids, [...ids].sort()); // deterministische Ordnung
});

test('validateManifest findet ungültige ids, fehlende Sheet-Maße, Duplikate, fehlende Dateien', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'manifest-test-'));
  const manifest = {
    assets: [
      { id: 'Bad-Id', type: 'image', file: 'images/bad.png', chosen: true },
      { id: 'player_walk', type: 'sheet', file: 'sheets/player_walk.png', chosen: true },
      { id: 'doppelt', type: 'sfx', file: 'sounds/doppelt.mp3', chosen: true },
      { id: 'doppelt', type: 'sfx', file: 'sounds/doppelt.mp3', chosen: true },
      { id: 'existiert', type: 'image', file: 'images/existiert.png', chosen: true },
    ],
  };
  writeAssetFile(dir, 'images/existiert.png', Buffer.from('png'));
  const errors = validateManifest(manifest, dir);
  assert.ok(errors.some((e) => e.includes('Bad-Id')));
  assert.ok(errors.some((e) => e.includes('player_walk') && e.includes('Frame-Maße')));
  assert.ok(errors.some((e) => e.includes('doppelt') && e.includes('2×')));
  assert.ok(errors.some((e) => e.includes('images/bad.png')));
  assert.ok(!errors.some((e) => e.includes('images/existiert.png')));
  fs.rmSync(dir, { recursive: true, force: true });
});

test('write/readManifest Roundtrip', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'manifest-rt-'));
  const manifest = { assets: [buildEntry({ id: 'room_zentrale', type: 'image' })] };
  writeManifest(dir, manifest);
  const back = readManifest(dir);
  assert.deepEqual(back, manifest);
  fs.rmSync(dir, { recursive: true, force: true });
});
