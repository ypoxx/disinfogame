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
import { CHROMA_PROMPT } from './transparency.mjs';

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
  analyse:
    'audience research room: a one-way mirror window showing a focus group of modern western citizens sitting in a bright room beyond, on this side a dark observation space with clipboards, a tape recorder, monitors showing demographic charts, two office chairs',
  newsroom:
    'social media monitoring newsroom: a wall of mounted CRT monitors showing scrolling feeds and trending charts, a long desk with keyboards and coffee cups, pinned printouts of posts on a board, cable trays, cool blue monitor glow',
  lobby:
    'ministry entrance lobby at ground level: polished stone floor, reception desk with a uniformed guard post, two heavy elevator doors with a mechanical floor indicator above, potted plant, notice board, revolving entrance door letting in cold night light',
  spieler_buero:
    "the player's own modest office: wooden desk with a CRT computer terminal and a red telephone, stack of beige files, corkboard with pinned notes and red string, old CRT television on a side table, coat rack, window with closed blinds",
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
    'stern male agency director, age 55-65, military-style uniform with medals, piercing gaze, grey hair',
  marina:
    'confident woman media specialist, age 30-40, fashionable 1980s skirt suit, groomed appearance, slight smile',
  alexei:
    'nervous young male tech specialist, age 25-35, hoodie, large glasses, messy hair, alert eyes',
  katja:
    'pragmatic woman field operative, age 30-40, practical jacket, short tied-back hair, watchful expression',
  igor: 'cautious male financial analyst, age 45-55, worn grey suit, balding, skeptical look, ledger under his arm',
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

// Gebäude-Baukasten: Querschnitts-Bausteine für die Stage (BuildingView).
// [id, aspectRatio, {w,h}, chroma, prompt-Hint, priority]
const BUILDING_KIT = [
  [
    'building_exterior',
    '16:9',
    { w: 1344, h: 768 },
    false,
    'night exterior view of a monolithic brutalist government ministry tower, rows of small lit windows, tall antenna on the flat roof, cold dark blue night sky, distant city silhouette with chimneys, light fog at street level, view slightly from below like a movie poster',
    'must',
  ],
  [
    'bld_facade_pillar',
    '9:16',
    { w: 384, h: 768 },
    false,
    'vertical strip of a brutalist concrete building facade, raw weathered concrete with shallow vertical grooves and water stains, seamlessly tileable from top to bottom, flat frontal view, no windows, no sky',
    'must',
  ],
  [
    'bld_floor_slab',
    '21:9',
    { w: 1344, h: 192 },
    false,
    'horizontal concrete floor slab of a building cross-section, raw concrete edge with a thin steel beam line, seamlessly tileable from left to right, flat frontal view, no background',
    'must',
  ],
  [
    'bld_shaft',
    '9:16',
    { w: 256, h: 768 },
    false,
    'interior of an elevator shaft in cross-section view, dark concrete walls with two vertical steel guide rails and a hanging cable, dim, seamlessly tileable from top to bottom, flat frontal view',
    'must',
  ],
  [
    'bld_roof',
    '21:9',
    { w: 1344, h: 576 },
    true,
    'flat roof line of a brutalist ministry building with a tall steel lattice antenna with a single red warning light and two ventilation pipes, frontal cross-section view',
    'must',
  ],
  [
    'bld_door_closed',
    '2:3',
    { w: 128, h: 192 },
    true,
    'a single closed heavy wooden office door with a dark frame and a small nameplate-shaped blank sign, frontal view, single object',
    'must',
  ],
  [
    'bld_door_open',
    '2:3',
    { w: 128, h: 192 },
    true,
    'a single heavy wooden office door standing open inward showing warm light from inside, dark door frame, frontal view, single object',
    'must',
  ],
  [
    'elevator_cabin_closed',
    '3:4',
    { w: 168, h: 224 },
    true,
    'an old elevator with closed riveted metal double doors and a small round floor indicator light above, frontal view, single object',
    'must',
  ],
  [
    'elevator_cabin_open',
    '3:4',
    { w: 168, h: 224 },
    true,
    'an old elevator with open riveted metal double doors revealing an empty cabin lit by a single warm ceiling lamp, wood-panelled cabin walls, frontal view, single object',
    'must',
  ],
  [
    'bld_corridor',
    '16:9',
    { w: 1344, h: 768 },
    false,
    'interior corridor wall of a brutalist ministry, cross-section view: plain concrete wall with a painted dado line, a notice board, a wall clock, ceiling with one fluorescent tube, linoleum floor strip at the bottom, seamlessly tileable from left to right, flat frontal view, NO doors, no people',
    'must',
  ],
  [
    'bld_city_far',
    '21:9',
    { w: 1344, h: 576 },
    true,
    'distant city skyline silhouette at night for a side-scrolling pixel game background: dark block buildings with small lit windows, chimneys with faint smoke, a thin TV tower, cool blue-grey night haze, flat layered silhouette, seamlessly tileable from left to right',
    'must',
  ],
  [
    'bld_street',
    '21:9',
    { w: 1344, h: 192 },
    false,
    'empty night street in front of a government building, cross-section view: asphalt with a curb, one street lamp pool of light, a parked boxy 1980s sedan in dark colors, seamlessly tileable from left to right, flat frontal view',
    'must',
  ],
];

// Broadcast-HUD: Rahmen + Publikum (docs/story-mode/BROADCAST_AND_AUDIENCE_CONCEPT.md).
// Rahmen nutzen Magenta auch für das "Loch" (Screen/Bildfläche) → echtes Alpha-Fenster.
const HUD_KIT = [
  [
    'hud_tv_frame',
    '4:3',
    { w: 512, h: 384 },
    true,
    'front view of an old wooden CRT television set with dials and a small antenna; the entire screen area is filled with the same solid magenta as the background so it can be cut out, single object',
    'must',
  ],
  [
    'hud_paper_frame',
    '3:4',
    { w: 384, h: 512 },
    true,
    'front page of a vintage newspaper with abstract scribble lines instead of letters and a large empty rectangular photo area filled with the same solid magenta as the background, slightly yellowed paper, single object, no readable text',
    'must',
  ],
  [
    'audience_room',
    '16:9',
    { w: 1344, h: 768 },
    false,
    'cozy but worn 1980s eastern-bloc living room facing the viewer: a long empty sofa centered against patterned wallpaper, small side tables with a doily and a radio, warm lamp light, the unseen television illuminates the scene from the viewer direction with a faint blue glow, no people, no text',
    'must',
  ],
];

// Publikums-Figuren (sitzend, 2-Frame-Idle für Mikro-Animation, Chroma-Sheet).
const AUDIENCE_FIGURES = [
  ['audience_worker', 'a tired factory worker in blue overalls, middle-aged man'],
  ['audience_pensioner', 'an elderly pensioner woman with a headscarf and knitting'],
  ['audience_youth', 'a young student with a walkman headphones around the neck'],
  ['audience_intellectual', 'a thin man with round glasses holding a folded newspaper'],
  ['audience_family', 'a mother with a small child on her lap'],
  ['audience_official', 'a stiff mid-level official in a grey uniform-like suit'],
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
  ['sfx_footsteps', 'two or three soft footsteps on a linoleum office floor', 1.0, 'nice'],
  ['sfx_tv_on', 'old CRT television switching on with a static crackle and hum', 1.0, 'nice'],
  ['sfx_paper', 'paper shuffle and a single page turn on a wooden desk', 0.8, 'nice'],
  ['sfx_phone_ring', 'single ring of an old rotary telephone', 1.5, 'nice'],
  ['sfx_typewriter', 'short mechanical typewriter burst ending with the carriage bell', 1.2, 'nice'],
  ['sfx_applause', 'small studio audience applause, muffled vintage broadcast quality', 2.0, 'nice'],
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
      `An 8-frame pixel art sprite sheet of a middle-aged bureaucrat in a grey suit ` +
      `with a briefcase in his left hand, walking to the right, strict side view. ` +
      `Horizontal layout, exactly 8 evenly spaced frames in one row, SAME character with ` +
      `identical suit and colors in every frame. The frames form one full walk cycle with ` +
      `DRAMATIC, clearly different leg poses: ` +
      `frame 1 right heel strikes the ground in front, legs wide apart, body at its lowest; ` +
      `frame 2 weight sinks onto the bent right leg; ` +
      `frame 3 body rises, left leg swings past the standing right leg; ` +
      `frame 4 body at its highest, left foot reaching forward, only right toes touch ground; ` +
      `frame 5 left heel strikes the ground in front, legs wide apart, body at its lowest; ` +
      `frame 6 weight sinks onto the bent left leg; ` +
      `frame 7 body rises, right leg swings past the standing left leg; ` +
      `frame 8 body at its highest, right foot reaching forward, only left toes touch ground. ` +
      `The head moves up and down by 2 pixels across the cycle (lowest in frames 1 and 5, ` +
      `highest in frames 4 and 8); the free right arm swings opposite to the legs. ` +
      `Adjacent frames MUST differ visibly, especially the legs. ${CHROMA_PROMPT} ${style}`,
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
      `standing idle and subtly breathing, front view. Horizontal layout, exactly 4 evenly ` +
      `spaced frames in one row showing the SAME character with identical outfit and colors in ` +
      `every frame, only a subtle breathing motion changes. ${CHROMA_PROMPT} ${style}`,
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
        `standing idle with subtle movement, front view. Horizontal layout, exactly 4 evenly ` +
        `spaced frames in one row showing the SAME character with identical outfit and colors in ` +
        `every frame, only a subtle idle motion changes. ${CHROMA_PROMPT} ${style}`,
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
      prompt: `A pixel art game asset: ${hint}. Single object, centered, no text. ${CHROMA_PROMPT} ${style}`,
    });
  }

  // --- Gebäude-Baukasten + HUD-Rahmen (Stage / Broadcast-Leiste) ---
  for (const [id, aspectRatio, size, chroma, hint, priority] of BUILDING_KIT) {
    shots.push({
      id,
      type: 'image',
      kind: 'building',
      priority,
      aspectRatio,
      size,
      chroma,
      seed: seedFor(id),
      prompt: `A pixel art game asset: ${hint}. No people, no readable text. ${chroma ? `${CHROMA_PROMPT} ` : ''}${style}`,
    });
  }
  for (const [id, aspectRatio, size, chroma, hint, priority] of HUD_KIT) {
    shots.push({
      id,
      type: 'image',
      kind: 'hud',
      priority,
      aspectRatio,
      size,
      chroma,
      seed: seedFor(id),
      prompt: `A pixel art game asset: ${hint}. ${chroma ? `${CHROMA_PROMPT} ` : ''}${style}`,
    });
  }

  // --- Publikums-Figuren (sitzend, 2-Frame-Idle, Chroma-Sheet) ---
  for (const [id, hint] of AUDIENCE_FIGURES) {
    shots.push({
      id,
      type: 'sheet',
      kind: 'hud',
      priority: 'must',
      frameWidth: 48,
      frameHeight: 48,
      cols: 2,
      rows: 1,
      size: { w: 96, h: 48 },
      animations: { idle: { row: 0, frames: 2, frameTime: 600, loop: true } },
      seed: seedFor(id),
      prompt:
        `A 2-frame pixel art sprite sheet of ${hint}, sitting and facing the viewer, full body ` +
        `including the seat. Horizontal layout, exactly 2 evenly spaced frames in one row showing ` +
        `the SAME character with identical outfit and colors in every frame, only a subtle idle ` +
        `motion changes (blink, small head turn). ${CHROMA_PROMPT} ${style}`,
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
