import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildShotlist, INTRO_VOICE_LINE, NARRATOR_VOICE_LINES, npcLines, seedFor } from '../src/shotlist.mjs';
import { styleCore, styleObject, styleHome, stylePaper } from '../src/styleguide.mjs';
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

  // 64 px je Frame seit 9c45bf4 („Spielfigur in hoeherer Aufloesung, 32→64 px"):
  // ausgeliefertes player_walk.png ist 512×64, das Manifest führt 64, und
  // STAGE.avatarSize = 128 ist im Spiel als „64px-Frames ×2" dokumentiert.
  const walk = shots.find((s) => s.id === 'player_walk');
  assert.equal(walk.frameWidth, 64);
  assert.equal(walk.frameHeight, 64);
  assert.equal(walk.cols * walk.frameWidth, walk.size.w);
  assert.equal(walk.rows * walk.frameHeight, walk.size.h);
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

  // 51 Zeilen aus npcs.json + Intro + 4 Erzähler-Zeilen der Ankunfts-Sequenz.
  const voices = shots.filter((s) => s.type === 'voice');
  const narrator = voices.filter((s) => s.voice.npcId === 'narrator');
  assert.equal(voices.length - narrator.length, 52);
  assert.equal(narrator.length, NARRATOR_VOICE_LINES.length);
  // Der Erzähler ist verdrahtet (ArrivalSequence) — also Muss, nicht Kür.
  assert.ok(narrator.every((s) => s.priority === 'must'));
  const ids = new Set(voices.map((s) => s.id));
  assert.ok(ids.has('voice_marina_greeting_2'));
  assert.ok(ids.has('voice_igor_reaction_crisis'));
  assert.ok(ids.has('voice_alexei_topic_security'));
  assert.ok(ids.has('voice_narrator_lobby'));
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

test('jeder Bild-Prompt trägt Pixel-Art-Marker und das Symbol-Verbot', () => {
  // Gilt ausnahmslos — auch für Papier-UI und die TV-Testbild-Grafik, die keinen
  // Raum-Stil tragen können. Das Symbol-Verbot ist Projektregel (SYMBOLS_AUDIT.md).
  for (const s of shots.filter((x) => x.type === 'image' || x.type === 'sheet')) {
    assert.ok(/pixel art/i.test(s.prompt), `Pixel-Art-Marker fehlt in ${s.id}`);
    assert.ok(/no real-world/i.test(s.prompt), `Symbol-Verbot fehlt in ${s.id}`);
    assert.ok(/no readable text|almost no text/i.test(s.prompt), `Text-Verbot fehlt in ${s.id}`);
  }
});

test('Bild-Prompts benutzen die definierten Stil-Kerne, nicht eigene Formulierungen', () => {
  // Vier Kerne, vier Welten: Ministerium (Räume/Porträts/Haus-Figuren), freigestellte
  // Objekte, das warme Westunion-Wohnzimmer, die Papier-Bedienung. Neue Shots sollen
  // einen davon anhängen statt den Stil frei nachzudichten.
  const kerne = { styleCore: styleCore(), styleObject: styleObject(), styleHome: styleHome(), stylePaper: stylePaper() };
  const ohneKern = shots
    .filter((x) => x.type === 'image' || x.type === 'sheet')
    .filter((x) => !Object.values(kerne).some((kern) => x.prompt.includes(kern)))
    .map((x) => x.id);
  // hud_tv_testcard ist bewusst ohne Kern: ein randloses Testbild hat weder Raum
  // noch Material — die Marker oben prüft der Test davor trotzdem.
  assert.deepEqual(ohneKern, ['hud_tv_testcard']);
});

test('„brutalist" gehört ins Ministerium — freigestellte Objekte tragen es bewusst nicht', () => {
  // R4-Befund: Mit dem Setting-Satz malte das Modell um jedes Prop eine Mini-Szene.
  // styleObject/styleHome/stylePaper lassen ihn deshalb weg; das ist Absicht, kein Loch.
  const bilder = shots.filter((x) => x.type === 'image' || x.type === 'sheet');
  const ministerium = bilder.filter((x) => x.prompt.includes(styleCore()));
  assert.ok(ministerium.length > 100, 'die große Mehrheit der Shots ist Ministerium');
  for (const s of ministerium) assert.ok(/brutalist/i.test(s.prompt), `Brutalismus fehlt in ${s.id}`);

  const freigestellt = bilder.filter((x) => !x.prompt.includes(styleCore()));
  for (const s of freigestellt) {
    assert.ok(!/brutalist/i.test(s.prompt), `${s.id} zieht den Raum-Stil an ein freigestelltes Motiv`);
  }
  // Props, UI-Kit, Wohnzimmer, Testbild — die vier Ausnahmen sind namentlich bekannt.
  assert.ok(freigestellt.every((s) => /^(prop_|ui_|audience_room$|hud_tv_testcard$|figure_(pfoertner|cleaner|clerk))/.test(s.id)),
    `unerwarteter Shot ohne Ministeriums-Kern: ${freigestellt.map((s) => s.id).join(', ')}`);
});
