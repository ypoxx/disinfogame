import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildShotlist, INTRO_VOICE_LINE, npcLines, seedFor } from '../src/shotlist.mjs';
import { ID_PATTERN } from '../src/manifest.mjs';

const shots = buildShotlist();

test('alle Shot-ids erfüllen das Manifest-Muster (a-z, 0-9, _)', () => {
  for (const s of shots) {
    assert.match(s.id, ID_PATTERN, `ungültige id: ${s.id}`);
  }
});

test('ids sind je Typ eindeutig', () => {
  const seen = new Set();
  for (const s of shots) {
    const key = `${s.type}/${s.id}`;
    assert.ok(!seen.has(key), `doppelt: ${key}`);
    seen.add(key);
  }
});

test('deckt alle Räume aus building.json und alle NPCs aus npcs.json ab', () => {
  const ids = new Set(shots.map((s) => s.id));
  for (const room of ['cyber_lab', 'medien_zentrum', 'zentrale', 'feld_ops', 'finanzen']) {
    assert.ok(ids.has(`room_${room}`), `room_${room} fehlt`);
  }
  for (const npc of ['direktor', 'marina', 'alexei', 'katja', 'igor']) {
    assert.ok(ids.has(`portrait_${npc}`), `portrait_${npc} fehlt`);
    assert.ok(ids.has(`figure_${npc}`), `figure_${npc} fehlt`);
  }
  assert.ok(ids.has('player_walk') && ids.has('player_idle'));
});

test('Räume sind MUSS in 16:9 (1344×768), Sheets tragen Frame-Raster + Animationen', () => {
  const room = shots.find((s) => s.id === 'room_zentrale');
  assert.equal(room.priority, 'must');
  assert.deepEqual(room.size, { w: 1344, h: 768 });

  const walk = shots.find((s) => s.id === 'player_walk');
  assert.equal(walk.frameWidth, 32);
  assert.equal(walk.cols * walk.frameWidth, walk.size.w);
  assert.equal(walk.animations.walkRight.frames, 8);
  assert.equal(walk.animations.walkRight.loop, true);
});

test('SFX decken alle SoundTypes des Spiels in snake_case ab', () => {
  const ids = new Set(shots.filter((s) => s.type === 'sfx').map((s) => s.id));
  // Spiegel der SoundType-Liste in SoundSystem.ts (camelCase → snake_case).
  const soundTypes = [
    'click', 'success', 'warning', 'error', 'notification', 'phaseEnd', 'consequence',
    'combo', 'crisis', 'betrayal', 'moralShift', 'opportunityOpen', 'countermeasure', 'worldEvent',
  ];
  for (const t of soundTypes) {
    const id = `sfx_${t.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)}`;
    assert.ok(ids.has(id), `${id} fehlt`);
  }
});

test('Stimmen: verdrahtete Intro-Zeile als MUSS + alle npcs.json-Zeilen als Kür', () => {
  const intro = shots.find((s) => s.id === 'voice_direktor_intro');
  assert.equal(intro.priority, 'must');
  assert.equal(intro.voice.text, INTRO_VOICE_LINE.text);
  assert.ok(intro.voice.text.startsWith('Willkommen in der Abteilung'));

  // 5 NPCs × (4 Begrüßungen + 3 Reaktionen + 3 Themen) + Intro = 51
  const voices = shots.filter((s) => s.type === 'voice');
  assert.equal(voices.length, 51);
  const ids = new Set(voices.map((s) => s.id));
  assert.ok(ids.has('voice_marina_greeting_2'));
  assert.ok(ids.has('voice_igor_reaction_crisis'));
  assert.ok(ids.has('voice_alexei_topic_security'));
});

test('npcLines folgt der Studio-Konvention (concept.ts)', () => {
  const lines = npcLines({
    dialogues: {
      greetings: { 0: 'a', 1: 'b' },
      reactions: { success: 'c' },
      topics: { mission: 'd' },
    },
  });
  assert.deepEqual(
    lines.map((l) => l.key),
    ['greeting_0', 'greeting_1', 'reaction_success', 'topic_mission']
  );
});

test('Seeds sind deterministisch; Stimmungs-Porträts erben Seed + Referenz der Basis', () => {
  assert.equal(seedFor('room_zentrale'), seedFor('room_zentrale'));
  assert.notEqual(seedFor('room_zentrale'), seedFor('room_cyber_lab'));
  const base = shots.find((s) => s.id === 'portrait_marina');
  const angry = shots.find((s) => s.id === 'portrait_marina_angry');
  assert.equal(angry.seed, base.seed);
  assert.equal(angry.referenceId, 'portrait_marina');
  assert.equal(angry.priority, 'nice');
});

test('alle Bild-Prompts enthalten den Stil-Kern (Pixel-Art + Sowjet-Brutalismus)', () => {
  for (const s of shots.filter((x) => x.type === 'image' || x.type === 'sheet')) {
    assert.ok(/16-bit pixel art/i.test(s.prompt), `Stil-Kern fehlt in ${s.id}`);
    assert.ok(/brutalist/i.test(s.prompt), `Brutalismus fehlt in ${s.id}`);
  }
});
