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
// v2 (modern 2026): jede Zeile endet mit dem Zonen-Licht (E16). CRT→Flachbild,
// Sowjet-Möbel→moderne, gepflegte Einrichtung; bewusst NICHT 70er-braun.
const ROOM_HINTS = {
  analyse:
    'audience research / focus-group observation room: a large one-way mirror window showing a focus group of modern western citizens in a bright room beyond, on this side a clean observation desk with tablets, slim monitors showing demographic charts, ergonomic chairs. Zone lighting: clean, cool, fairly bright',
  newsroom:
    'modern social-media monitoring newsroom: a wall of slim flat-panel monitors showing scrolling feeds, trend charts and maps, a long clean desk with keyboards and coffee cups, a pinboard of printouts, cable management. Zone lighting: cool blue-white screen glow, fairly bright',
  lobby:
    'modern ministry entrance lobby at ground level: polished stone-and-glass floor, a clean reception counter with a small guard post, two metal elevator doors with a digital floor indicator above, large potted plants, a backlit notice wall, a glass revolving entrance door letting in cool city light. Zone lighting: bright, airy',
  spieler_buero:
    "the player's own modest modern office: a clean desk with a flat computer monitor and a slim telephone, a small stack of files, a corkboard with pinned notes and red string, a wall-mounted flat screen, a chair, a window with city light. Zone lighting: neutral, slightly warm, comfortable",
  cyber_lab:
    'underground cyber operations room: several slim multi-monitor workstations with cyan and blue screen glow, server racks with status LEDs, tidy overhead cable trays, a dark room lit mostly by the screens. Zone lighting: dark, cool, cyan-tinted',
  medien_zentrum:
    'modern media / broadcast monitoring center: a wall of flat screens showing abstract news graphics, a long clean desk, a soft seating corner, a large window with city light, plants, an abstract constructivist poster. Zone lighting: one of the brighter, warmer rooms',
  zentrale:
    "the agency director's command office: a large screen-and-map wall, a substantial clean desk with a slim telephone, a glass display cabinet, a plain dark-red banner without any emblem, indirect lighting. Zone lighting: stern, cool-neutral with a single dark-red accent, medium brightness",
  feld_ops:
    'field operations room: metal lockers, wall screens with route maps, radio and comms equipment, gear bags, a planning table. Zone lighting: neutral, focused task lighting',
  finanzen:
    'a secure modern finance office: a heavy secure door, metal filing cabinets, ledgers and a counting machine on a clean desk, a monitor with figures, a single pendant lamp. Zone lighting: cool, clean, slightly dim and serious',
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

// v2-Beschreibungen für die GROSSE Raum-Halbfigur (modern 2026). Bewusst PUR
// (nur Person, kein Möbel) — verhindert den "halber Schreibtisch"-/Briefmarken-
// Effekt beim Einsetzen (Owner-Hinweis 2026-06-13): der Tisch kommt aus dem Raum.
const HALF_HINTS = {
  direktor:
    'a stern agency director in his early 60s, grey hair, sharp authoritative face, dark formal high-collar service suit with a single subtle plain insignia bar (no real emblem)',
  marina:
    'a confident woman media strategist in her late 30s, short dark hair, smart modern dark blazer, a slight knowing smile',
  alexei:
    'a nervous young male cyber specialist in his late 20s, messy hair, large glasses, a dark hoodie over a shirt, alert eyes',
  katja:
    'a pragmatic woman field operative in her late 30s, short tied-back hair, a practical dark field jacket, a watchful steady expression',
  igor:
    'a cautious male financial analyst in his early 50s, balding, glasses, a plain dark suit, a skeptical look',
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
    'vertical strip of a modern brutalist concrete building facade that COMPLETELY FILLS the image as one solid opaque concrete surface, raw weathered concrete with shallow vertical grooves and faint water stains, uniform concrete with NO colored lights, NO colored reflections, NO glass, seamlessly tileable from top to bottom, flat frontal view, no windows, no sky',
    'must',
  ],
  [
    'bld_floor_slab',
    '21:9',
    { w: 1344, h: 192 },
    false,
    'a horizontal concrete floor-and-ceiling slab band of a building cross-section that COMPLETELY FILLS the image from top to bottom as one solid opaque concrete band (no empty area, NO checkerboard pattern, NO transparency), raw concrete with a thin steel beam edge line near the top, seamlessly tileable from left to right, flat frontal view',
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
    'empty night street in front of a government building, cross-section view: asphalt with a curb, one street lamp pool of light, a parked modern dark sedan, seamlessly tileable from left to right, flat frontal view',
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

// Publikums-Figuren: 8 moderne WESTLICHE Milieus (B13/K2, sitzend, 2-Frame-Idle, Chroma).
const AUDIENCE_FIGURES = [
  ['audience_optimiererin', 'a career woman in her mid 30s in a white blazer, holding a smoothie cup, sitting upright'],
  ['audience_macher', 'a hands-on tradesman in his mid 40s in a fleece jacket and jeans, beer bottle on his knee'],
  ['audience_bohemien', 'a young creative in an oversized hoodie with headphones around the neck, slouched with a smartphone'],
  ['audience_besorgte_mitte', 'a woman around 55 in a polo shirt with a tablet on her lap, reading glasses'],
  ['audience_zorniger', 'a frustrated man in a faded t-shirt, arms crossed, cigarette behind the ear'],
  ['audience_idealistin', 'a woman in her mid 30s in a linen shirt with a tote bag leaning against the sofa'],
  ['audience_eigenheimer', 'a retired man in a knitted cardigan with a cat on his lap and a tablet'],
  ['audience_liberale', 'a woman around 60 with round glasses, folded quality newspaper, podcast earphones around the neck'],
];

// Spieler-Porträts zur Avatar-Wahl (K10/D27: m/w × jung/mittel/erfahren).
const PLAYER_PORTRAITS = [
  ['portrait_player_m1', 'a young ambitious man in his late 20s, grey suit, neatly combed hair, alert eyes'],
  ['portrait_player_m2', 'a middle-aged man in his 40s, grey suit, briefcase posture, tired but determined look'],
  ['portrait_player_m3', 'an experienced man around 60, grey suit, silver hair, calm calculating gaze'],
  ['portrait_player_f1', 'a young ambitious woman in her late 20s, grey blazer, tied-back hair, alert eyes'],
  ['portrait_player_f2', 'a middle-aged woman in her 40s, grey blazer, short practical haircut, determined look'],
  ['portrait_player_f3', 'an experienced woman around 60, grey blazer, silver bun, calm calculating gaze'],
];

// Pixel-Icon-Set (E30: ersetzt Emojis; einzelne Objekte, Chroma, 1:1).
const ICONS = [
  ['icon_budget', 'a small stack of banknotes with a coin'],
  ['icon_capacity', 'a lightning bolt over a small gear'],
  ['icon_risk', 'a warning triangle with an exclamation mark'],
  ['icon_attention', 'a wide open eye'],
  ['icon_moral', 'a small balance scale tilted to one side'],
  ['icon_actions', 'a clipboard with a checked list'],
  ['icon_news', 'a folded newspaper'],
  ['icon_stats', 'a small bar chart with three rising bars'],
  ['icon_npcs', 'two simple person silhouettes side by side'],
  ['icon_mission', 'a beige dossier folder with a red seal'],
  ['icon_events', 'a small globe with a signal arc'],
  ['icon_building', 'a small brutalist office tower'],
  ['icon_office', 'a wooden desk with a tiny CRT monitor'],
  ['icon_dashboard', 'a small control panel with gauges'],
  ['icon_broadcast', 'a small CRT television with antenna'],
  ['icon_sound_on', 'a loudspeaker with sound waves'],
  ['icon_sound_off', 'a loudspeaker crossed out'],
  ['icon_save', 'an old floppy disk'],
  ['icon_clock', 'a round wall clock face'],
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
  ['sfx_dialog_end', 'single very soft short low typewriter thock, gentle, quiet', 0.3, 'nice'],
  ['sfx_amb_lobby', 'large echoing entrance hall room tone with distant footsteps and a revolving door swoosh, loopable', 10.0, 'nice'],
  ['sfx_amb_buero', 'quiet office room tone with a ticking wall clock and faint radiator hum, loopable', 10.0, 'nice'],
  ['sfx_amb_keller', 'deep basement room tone with low electrical hum and occasional pipe knock, loopable', 10.0, 'nice'],
  ['sfx_amb_newsroom', 'busy newsroom room tone with soft keyboard typing and CRT monitor hum, loopable', 10.0, 'nice'],
  ['sfx_amb_cyber', 'server room tone with computer fans and soft electronic beeps, loopable', 10.0, 'nice'],
  ['sfx_amb_zentrale', 'stately office room tone with a slow pendulum clock and distant telephone ring, loopable', 10.0, 'nice'],
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
    'music_calm_archive',
    'very calm contemplative cold-war office ambience, soft vibraphone and warm tape pads, sparse, loopable instrumental',
    60_000,
    'nice',
  ],
  [
    'music_night_city',
    'slow nocturnal cold-war city mood, distant saxophone, soft rain texture, muted upright bass, loopable instrumental',
    60_000,
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
        `Concrete and glass walls, a clean floor, an abstract constructivist-style poster ` +
        `(geometric shapes only, no emblems, no text). ` +
        // Proportions-Realitätscheck (Teil C): Möbel klein halten, Standfläche frei lassen.
        `Furniture and desks are modest in size and clearly smaller than a standing adult; ` +
        `keep the lower third of the scene as clear floor space for a character to stand. ` +
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

  // --- NPC-Halbfiguren für die Raum-Nahsicht (groß "hinter dem Schreibtisch") ---
  // PUR: nur die Person, kein Möbel/Tisch/Boden → sauberes Alpha, kein Briefmarken-
  // Effekt. Hüfthoch beschnitten; im Spiel bodenbündig (Schnitt läuft aus dem Bild).
  for (const npc of npcs) {
    const desc = HALF_HINTS[npc.id] ?? NPC_HINTS[npc.id] ?? npc.name;
    shots.push({
      id: `npc_half_${npc.id}`,
      type: 'image',
      kind: 'npc_half',
      priority: 'must',
      aspectRatio: '3:4',
      size: { w: 768, h: 1024 },
      chroma: true,
      seed: seedFor(`npc_half_${npc.id}`),
      prompt:
        `A pixel art character: a single person shown from the hips up, large like a ` +
        `visual-novel / adventure-game character. ${desc}. Calm, natural posture, facing ` +
        `slightly toward the centre. Full head and both shoulders inside the frame, NOT ` +
        `cropped at the top. ONLY the person — absolutely NO desk, NO table, NO chair, NO ` +
        `furniture, NO props, NO floor, nothing in front of the body. ${CHROMA_PROMPT} ${style}`,
    });
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

  // --- Spieler-Porträts (K10: Avatar-Wahl) ---
  for (const [id, hint] of PLAYER_PORTRAITS) {
    shots.push({
      id,
      type: 'image',
      kind: 'portrait',
      priority: 'must',
      aspectRatio: '1:1',
      size: { w: 1024, h: 1024 },
      seed: seedFor(id),
      prompt:
        `A pixel art character portrait, head and shoulders, facing slightly left, neutral expression. ` +
        `${hint}. Plain dark concrete wall background. No text. ${style}`,
    });
  }

  // --- Pixel-Icons (E30: ein Icon-Vokabular statt Emojis) ---
  for (const [id, hint] of ICONS) {
    shots.push({
      id,
      type: 'image',
      kind: 'icon',
      priority: 'must',
      aspectRatio: '1:1',
      size: { w: 256, h: 256 },
      chroma: true,
      seed: seedFor(id),
      prompt:
        `A tiny pixel art game icon: ${hint}. Bold readable silhouette, 2px dark outline, ` +
        `flat shading, single object centered, no text. ${CHROMA_PROMPT} ${style}`,
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
