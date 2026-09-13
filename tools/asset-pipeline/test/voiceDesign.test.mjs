import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { readVoiceDesign, resolveDesign, previewFileName, pickCandidate, saveCasting } from '../src/voiceDesign.mjs';
import { NARRATOR_VOICE_LINES, narratorShotIds } from '../src/shotlist.mjs';
import { REPO_ROOT } from '../src/paths.mjs';

test('voice-design.json liefert für jede Rolle ein brauchbares Design', () => {
  const config = readVoiceDesign();
  for (const role of Object.keys(config.roles)) {
    const design = resolveDesign(config, role);
    // ElevenLabs-Grenzen: Beschreibung ≥ 20, Probetext ≥ 100 Zeichen.
    assert.ok(design.description.length >= 20 && design.description.length <= 1000, `${role}: Beschreibung`);
    assert.ok(design.previewText.length >= 100 && design.previewText.length <= 1000, `${role}: Probetext`);
  }
});

test('alle Design-Varianten einer Rolle sind auflösbar', () => {
  const config = readVoiceDesign();
  const varianten = Object.keys(config.roles.narrator.designs);
  assert.ok(varianten.length >= 2, 'mindestens eine Alternative zum Anhören');
  for (const key of varianten) {
    assert.equal(resolveDesign(config, 'narrator', key).designKey, key);
  }
});

test('unbekannte Rolle/Variante melden, was es gibt', () => {
  const config = readVoiceDesign();
  assert.throws(() => resolveDesign(config, 'nixda'), /Unbekannte Rolle/);
  assert.throws(() => resolveDesign(config, 'narrator', 'nixda'), /Unbekannte Design-Variante/);
});

test('Probetext des Erzählers besteht aus den echten Spielzeilen', () => {
  const { previewText } = resolveDesign(readVoiceDesign(), 'narrator');
  for (const line of NARRATOR_VOICE_LINES) {
    assert.ok(previewText.includes(line.text), `fehlt im Probetext: ${line.lineKey}`);
  }
});

test('Erzähler-Zeilen sind deckungsgleich mit ArrivalSequence.tsx', () => {
  const source = fs.readFileSync(
    path.join(REPO_ROOT, 'desinformation-network', 'src', 'story-mode', 'components', 'ArrivalSequence.tsx'),
    'utf8'
  );
  const block = source.match(/const NARRATION[^{]*\{([\s\S]*?)\n\};/);
  assert.ok(block, 'NARRATION-Block in ArrivalSequence.tsx nicht gefunden');
  const imSpiel = new Map(
    [...block[1].matchAll(/^\s*(\w+):\s*'(.*?)',?\s*$/gm)].map((m) => [m[1], m[2]])
  );
  assert.equal(imSpiel.size, NARRATOR_VOICE_LINES.length);
  for (const line of NARRATOR_VOICE_LINES) {
    assert.equal(imSpiel.get(line.lineKey), line.text, `Text von „${line.lineKey}" driftet auseinander`);
  }
});

test('narratorShotIds folgt der Asset-Konvention', () => {
  assert.deepEqual(narratorShotIds(), [
    'voice_narrator_lobby',
    'voice_narrator_ride',
    'voice_narrator_floor',
    'voice_narrator_door',
  ]);
});

test('previewFileName ist sprechend und sortierbar', () => {
  assert.equal(previewFileName('narrator', 'aktenleser', 0), 'narrator_aktenleser_01.mp3');
  assert.equal(previewFileName('narrator', 'aktenleser', 9), 'narrator_aktenleser_10.mp3');
});

test('pickCandidate ist 1-basiert und meldet Fehlgriffe', () => {
  const run = { candidates: [{ generatedVoiceId: 'a' }, { generatedVoiceId: 'b' }] };
  assert.equal(pickCandidate(run, '2').generatedVoiceId, 'b');
  assert.throws(() => pickCandidate(run, '3'), /Kandidat 3 gibt es nicht/);
});

test('saveCasting ergänzt die Rolle und lässt die übrigen Stimmen stehen', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'casting-'));
  const file = path.join(dir, 'voices.json');
  fs.writeFileSync(file, JSON.stringify({ direktor: 'alt-direktor', narrator: 'alt-narrator' }));

  const { previous } = saveCasting('narrator', 'neu-narrator', file);
  assert.equal(previous, 'alt-narrator');
  const casting = JSON.parse(fs.readFileSync(file, 'utf8'));
  assert.equal(casting.narrator, 'neu-narrator');
  assert.equal(casting.direktor, 'alt-direktor');
});
