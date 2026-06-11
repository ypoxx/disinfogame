// ===========================================
// SHOT-LISTE — deterministisch aus den Spieldaten abgeleitet
// ===========================================
// Quellen: building.json (Räume), npcs.json (Personen + Sprachzeilen),
// Style-Guide (Prompt-Kern). Neue Räume/NPCs in den JSONs erscheinen hier
// automatisch — gleiche Philosophie wie concept.ts im sprite-tool.
//
// Namenskonventionen (identisch mit Spiel + Asset Studio):
//   room_<roomId>, portrait_<npcId>[_<mood>], figure_<npcId>,
//   player_walk, player_idle, prop_<name>, sfx_<name>, music_<name>,
//   voice_<npcId>_<lineKey>

import fs from 'node:fs';
import crypto from 'node:crypto';
import { BUILDING_JSON, NPCS_JSON } from './paths.mjs';
import { styleCore } from './styleguide.mjs';

/** Deterministischer Seed je Shot-id (reproduzierbare Läufe). */
export function seedFor(id) {
  const hash = crypto.createHash('sha256').update(id).digest();
  return hash.readUInt32BE(0) % 1_000_000;
}

export const MOODS = ['happy', 'angry', 'worried', 'suspicious']; // + Basis "neutral" = Default-Porträt

/** Intro-Zeile des Direktors — exakt der Text aus useStoryGameState (verdrahtet). */
export const INTRO_VOICE_LINE = {
  npcId: 'direktor',
  lineKey: 'intro',
  text:
    'Willkommen in der Abteilung für Sonderoperationen. Ihre Mission: die politische ' +
    'Landschaft von Westunion zu destabilisieren. Sie haben 10 Jahre Zeit. Nutzen Sie sie weise.',
};

// Englische Bild-Beschreibungen je Raum/NPC (Inhalts-Hinweise aus dem Style-Guide
// bzw. BUILDING_CONCEPT.md; Räume/NPCs ohne Eintrag bekommen einen generischen Text).
const ROOM_HINTS = {
  cyber_lab:
    'underground tech office: several CRT monitors with green text, server racks with blinking LEDs, cable bundles on the floor, dark room lit mostly by monitor glow',
  medien_zentrum:
    'propaganda media center: large vintage CRT television showing news, VHS recorders and tapes, stacks of newspapers, microphones, broadcast posters on the wall',
  zentrale:
    'command office of the agency director: large world map on the wall, heavy wooden desk with a red telephone, medals in a display case, plain dark-red banner without any emblem, dim desk lamp',
  feld_ops:
    'field operations room: metal lockers, pinned maps with routes, radio equipment, duffel bags, harsh fluorescent light',
  finanzen:
    'basement finance vault: heavy vault door, metal filing cabinets, ledgers and stacked banknotes on a desk, counting machine, single hanging lamp',
};

const NPC_HINTS = {
  direktor:
    'stern agency director, age 55-65, military-style uniform with medals, piercing gaze, grey hair',
  marina:
    'confident media specialist, age 30-40, fashionable 1980s suit, groomed appearance, slight smile',
  alexei:
    'nervous young tech specialist, age 25-35, hoodie, large glasses, messy hair, alert eyes',
  katja:
    'pragmatic field operative, age 30-40, practical jacket, short tied-back hair, watchful expression',
  igor: 'cautious financial analyst, age 45-55, worn grey suit, balding, skeptical look, ledger under his arm',
};

const PROPS = [
  ['prop_tv', 'old CRT television set on a metal stand, screen glowing'],
  ['prop_server_rack', 'server rack with blinking red and green LEDs'],
  ['prop_red_phone', 'red rotary telephone'],
  ['prop_world_map', 'wall-mounted world map with pins and string'],
  ['prop_files', 'stack of beige paper files and folders'],
  ['prop_safe', 'heavy steel safe with a rotary dial'],
  ['prop_coffee', 'steaming coffee cup on a saucer'],
  ['prop_typewriter', 'soviet-era mechanical typewriter'],
];

// SFX: alle SoundTypes des Spiels (SoundSystem.ts) in snake_case + Gebäude-Sounds.
const SFX = [
  ['sfx_click', 'short dry mechanical button click, UI sound', 0.6, 'must'],
  ['sfx_success', 'short positive two-tone confirmation chime, retro game UI', 0.8, 'must'],
  ['sfx_warning', 'short tense warning buzz, muted, bureaucratic alarm', 0.8, 'must'],
  ['sfx_error', 'short harsh negative buzzer, low, retro game UI', 0.8, 'must'],
  ['sfx_notification', 'soft single notification ping, typewriter bell character', 0.7, 'must'],
  ['sfx_phase_end', 'short stamp on paper plus page turn, bureaucratic end-of-round', 1.2, 'must'],
  ['sfx_consequence', 'low ominous swell with a paper rustle, consequence revealed', 1.5, 'must'],
  ['sfx_combo', 'quick ascending three-note retro arpeggio, triumphant but muted', 1.0, 'nice'],
  ['sfx_crisis', 'low alarming drone with distant siren character, crisis begins', 2.0, 'must'],
  ['sfx_betrayal', 'shocking low dissonant sting, dramatic betrayal reveal', 1.8, 'must'],
  ['sfx_moral_shift', 'dark subtle descending tone, moral weight shift', 1.2, 'nice'],
  ['sfx_opportunity_open', 'bright short unlock chime, hopeful, retro', 0.8, 'nice'],
  ['sfx_countermeasure', 'descending two-tone threat motif, opponent reacts', 1.0, 'nice'],
  ['sfx_world_event', 'newsflash sting: teletype burst plus short brass hit', 1.5, 'nice'],
  ['sfx_door_open', 'heavy wooden office door opens with old hinges', 1.2, 'nice'],
  ['sfx_door_close', 'heavy wooden office door closes with a thud', 1.0, 'nice'],
  ['sfx_elevator', 'old soviet elevator hum with a ding on arrival', 2.5, 'nice'],
];

const MUSIC = [
  [
    'music_theme_main',
    'slow brooding cold-war spy theme, muted brass, sparse piano, tape hiss, 80 BPM, loopable instrumental',
    60_000,
    'must',
  ],
  [
    'music_tense',
    'tense minimal pulse, low strings and ticking percussion, cold-war thriller, loopable instrumental',
    45_000,
    'nice',
  ],
  [
    'music_victory',
    'restrained somber triumph, brass swell over minor piano, cold-war era, short instrumental sting',
    20_000,
    'nice',
  ],
  [
    'music_gameplay',
    'quiet bureaucratic ambience, soft typewriter rhythm, distant radio, sparse bass, loopable instrumental',
    60_000,
    'nice',
  ],
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

/** Alle sprechbaren Zeilen eines NPC (identisch zu npcLines in concept.ts). */
export function npcLines(npc) {
  const out = [];
  const d = npc.dialogues ?? {};
  for (const [k, v] of Object.entries(d.greetings ?? {})) if (v) out.push({ key: `greeting_${k}`, text: v });
  for (const [k, v] of Object.entries(d.reactions ?? {})) if (v) out.push({ key: `reaction_${k}`, text: v });
  for (const [k, v] of Object.entries(d.topics ?? {})) if (v) out.push({ key: `topic_${k}`, text: v });
  return out;
}

/**
 * Baut die komplette Shot-Liste.
 * @returns {Array<object>} Shots mit id/type/kind/priority/prompt bzw. Audio-Parametern.
 */
export function buildShotlist({ buildingFile = BUILDING_JSON, npcsFile = NPCS_JSON } = {}) {
  const building = readJson(buildingFile);
  const npcsDoc = readJson(npcsFile);
  const npcs = npcsDoc.npcs ?? [];
  const npcById = new Map(npcs.map((n) => [n.id, n]));
  const style = styleCore();
  const shots = [];

  // --- Räume (groß, 16:9 = 1344×768 laut sprite-tool ASPECT_RATIOS) ---
  for (const room of building.rooms ?? []) {
    const npc = npcById.get(room.npcId);
    const hint = ROOM_HINTS[room.id] ?? `office room "${room.label_en ?? room.label_de}"`;
    shots.push({
      id: `room_${room.id}`,
      type: 'image',
      kind: 'room',
      priority: 'must',
      aspectRatio: '16:9',
      size: { w: 1344, h: 768 },
      seed: seedFor(`room_${room.id}`),
      prompt:
        `A pixel art game background scene, wide interior view. ${hint}. ` +
        `${npc ? `This is the workplace of ${NPC_HINTS[npc.id] ?? npc.name} (no person visible in the scene). ` : ''}` +
        `Concrete walls, fluorescent ceiling tubes, linoleum floor, old radiator, ` +
        `abstract constructivist-style propaganda poster (geometric shapes only, no emblems, no text). ` +
        `No people, no text, no UI elements. ${style}`,
    });
  }

  // --- Porträts (mittel, 1:1) — neutral als Muss, Stimmungen als Kür ---
  for (const npc of npcs) {
    const base = NPC_HINTS[npc.id] ?? `${npc.name}, ${npc.role_en ?? npc.role_de ?? 'agency employee'}`;
    shots.push({
      id: `portrait_${npc.id}`,
      type: 'image',
      kind: 'portrait',
      priority: 'must',
      aspectRatio: '1:1',
      size: { w: 1024, h: 1024 },
      seed: seedFor(`portrait_${npc.id}`),
      prompt:
        `A pixel art character portrait, head and shoulders, facing slightly left, neutral expression. ` +
        `${base}. Plain dark concrete wall background. No text. ${style}`,
    });
    for (const mood of MOODS) {
      shots.push({
        id: `portrait_${npc.id}_${mood}`,
        type: 'image',
        kind: 'portrait',
        priority: 'nice',
        aspectRatio: '1:1',
        size: { w: 1024, h: 1024 },
        seed: seedFor(`portrait_${npc.id}`), // gleicher Seed wie Basis → konsistentes Gesicht
        referenceId: `portrait_${npc.id}`,
        prompt:
          `Same pixel art character as the reference image, identical face, clothes and framing, ` +
          `but with a clearly ${mood} facial expression. Plain dark concrete wall background. No text. ${style}`,
      });
    }
  }

  // --- Spielfigur-Sheets (Bauplan: BUILDING_CONCEPT.md, 32×32 je Frame) ---
  shots.push({
    id: 'player_walk',
    type: 'sheet',
    kind: 'sheet',
    priority: 'must',
    frameWidth: 32,
    frameHeight: 32,
    cols: 8,
    rows: 1,
    size: { w: 256, h: 32 },
    animations: { walkRight: { row: 0, frames: 8, frameTime: 90, loop: true } },
    seed: seedFor('player_walk'),
    prompt:
      `An 8-frame pixel art sprite sheet of a middle-aged soviet bureaucrat in a grey suit ` +
      `with a briefcase, walking to the right, side view. Horizontal layout, exactly 8 frames ` +
      `in one row, each frame exactly 32x32 pixels, total 256x32. Transparent background. ${style}`,
  });
  shots.push({
    id: 'player_idle',
    type: 'sheet',
    kind: 'sheet',
    priority: 'must',
    frameWidth: 32,
    frameHeight: 32,
    cols: 4,
    rows: 1,
    size: { w: 128, h: 32 },
    animations: { idle: { row: 0, frames: 4, frameTime: 220, loop: true } },
    seed: seedFor('player_idle'),
    prompt:
      `A 4-frame pixel art sprite sheet of a middle-aged soviet bureaucrat in a grey suit ` +
      `standing idle and subtly breathing, front view. Horizontal layout, exactly 4 frames ` +
      `in one row, each frame exactly 32x32 pixels, total 128x32. Transparent background. ${style}`,
  });

  // --- NPC-Figuren im Gebäude (klein, Kür) ---
  for (const npc of npcs) {
    shots.push({
      id: `figure_${npc.id}`,
      type: 'sheet',
      kind: 'sheet',
      priority: 'nice',
      frameWidth: 32,
      frameHeight: 32,
      cols: 4,
      rows: 1,
      size: { w: 128, h: 32 },
      animations: { idle: { row: 0, frames: 4, frameTime: 260, loop: true } },
      seed: seedFor(`figure_${npc.id}`),
      prompt:
        `A 4-frame pixel art sprite sheet of ${NPC_HINTS[npc.id] ?? npc.name}, full body, ` +
        `standing idle with subtle movement, front view. Horizontal layout, exactly 4 frames in one row, ` +
        `each frame exactly 32x32 pixels, total 128x32. Transparent background. ${style}`,
    });
  }

  // --- Props (klein, Kür) ---
  for (const [id, hint] of PROPS) {
    shots.push({
      id,
      type: 'image',
      kind: 'prop',
      priority: 'nice',
      aspectRatio: '1:1',
      size: { w: 1024, h: 1024 },
      seed: seedFor(id),
      prompt: `A pixel art game asset: ${hint}. Single object, centered, transparent background, no text. ${style}`,
    });
  }

  // --- SFX / Musik ---
  for (const [id, text, durationSeconds, priority] of SFX) {
    shots.push({ id, type: 'sfx', kind: 'sfx', priority, sfx: { text, durationSeconds } });
  }
  for (const [id, prompt, lengthMs, priority] of MUSIC) {
    shots.push({ id, type: 'music', kind: 'music', priority, music: { prompt, lengthMs } });
  }

  // --- Stimmen: verdrahtete Intro-Zeile (Muss) + alle npcs.json-Zeilen (Kür) ---
  shots.push({
    id: `voice_${INTRO_VOICE_LINE.npcId}_${INTRO_VOICE_LINE.lineKey}`,
    type: 'voice',
    kind: 'voice',
    priority: 'must',
    voice: { ...INTRO_VOICE_LINE },
  });
  for (const npc of npcs) {
    for (const line of npcLines(npc)) {
      shots.push({
        id: `voice_${npc.id}_${line.key}`,
        type: 'voice',
        kind: 'voice',
        priority: 'nice',
        voice: { npcId: npc.id, lineKey: line.key, text: line.text },
      });
    }
  }

  return shots;
}
