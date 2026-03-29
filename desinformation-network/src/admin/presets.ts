// ===========================================
// PROMPT PRESETS
// Portiert aus sprite-tool/src/lib/presets.ts
// ===========================================

import type { AssetType } from './types';

export type Preset = {
  id: string;
  name: string;
  nameDE: string;
  description: string;
  assetType: AssetType;
  prompt: string;
  tags: string[];
};

export type PresetCategory = {
  id: string;
  name: string;
  nameDE: string;
  presets: Preset[];
};

// ===========================================
// STYLE ANCHOR
// ===========================================
export const STYLE_ANCHOR = {
  base: '16-bit pixel art, Soviet-era brutalist aesthetic, 1970s-80s DDR style',
  colors: 'muted colors: concrete grey (#6B7280), military olive (#4A5D23), rust brown (#8B4513), soviet red accents (#B22234)',
  atmosphere: 'fluorescent lighting, cold atmosphere, worn textures',
  technical: 'sharp edges, geometric forms, no anti-aliasing',
};

// ===========================================
// RAUM-PRESETS
// ===========================================
const ROOM_PRESETS: Preset[] = [
  {
    id: 'room_cyber_lab',
    name: 'Cyber Lab',
    nameDE: 'Cyber-Labor',
    description: 'Technik-Büro des Hackers mit Servern und Monitoren',
    assetType: 'scene',
    prompt: `A pixel art game background scene. Soviet-era hacker den / cyber laboratory.
Multiple CRT monitors showing green terminal text, server racks with blinking LEDs,
tangled cables on the floor, industrial cooling fans, dim lighting from screens only.
Concrete walls, metal equipment. 320x180 pixels. ${STYLE_ANCHOR.base}.
${STYLE_ANCHOR.colors}, neon green (#00FF00) for monitors.
${STYLE_ANCHOR.atmosphere}. Side-view perspective.`,
    tags: ['room', 'tech', 'hacker'],
  },
  {
    id: 'room_analysis',
    name: 'Analysis Office',
    nameDE: 'Analyse-Büro',
    description: 'Büro der Analystin mit Pinnwänden und Akten',
    assetType: 'scene',
    prompt: `A pixel art game background scene. Soviet-era intelligence analysis office.
Large corkboard with connection lines and photos, grey metal filing cabinets,
desk covered with paper stacks and files, standing lamp, diagrams on walls,
coffee cup. Concrete walls, linoleum floor. 320x180 pixels. ${STYLE_ANCHOR.base}.
${STYLE_ANCHOR.colors}. ${STYLE_ANCHOR.atmosphere}. Side-view perspective.`,
    tags: ['room', 'analysis', 'office'],
  },
  {
    id: 'room_media_center',
    name: 'Media Center',
    nameDE: 'Medien-Zentrum',
    description: 'Büro des Medien-Spezialisten mit TV und Aufnahmegeräten',
    assetType: 'scene',
    prompt: `A pixel art game background scene. Soviet-era media propaganda center.
Large CRT television, VHS recorders, stacks of newspapers, reel-to-reel tape recorder,
microphones, broadcast equipment, news agency posters. Concrete walls.
320x180 pixels. ${STYLE_ANCHOR.base}. ${STYLE_ANCHOR.colors}.
${STYLE_ANCHOR.atmosphere}. Side-view perspective.`,
    tags: ['room', 'media', 'tv'],
  },
  {
    id: 'room_command',
    name: 'Command Center',
    nameDE: 'Kommando-Zentrale',
    description: 'Büro des Generals mit Weltkarte und rotem Telefon',
    assetType: 'scene',
    prompt: `A pixel art game background scene. Soviet-era military command office.
Large world map on wall with pins, heavy wooden desk, red rotary telephone,
military medals in display case, Soviet flag, portrait of leader, globe,
strategic documents. Concrete walls, carpet floor. 320x180 pixels.
${STYLE_ANCHOR.base}. ${STYLE_ANCHOR.colors}. ${STYLE_ANCHOR.atmosphere}.
Side-view perspective.`,
    tags: ['room', 'military', 'command'],
  },
  {
    id: 'room_player_office',
    name: 'Player Office',
    nameDE: 'Spieler-Büro',
    description: 'Startbüro des Spielers',
    assetType: 'scene',
    prompt: `A pixel art game background scene. Soviet-era bureaucrat office, modest.
Simple wooden desk with old computer terminal, rotary phone, metal filing cabinet,
coat rack, single window with blinds, propaganda poster, wall clock, radiator.
Concrete walls, linoleum floor. 320x180 pixels. ${STYLE_ANCHOR.base}.
${STYLE_ANCHOR.colors}. ${STYLE_ANCHOR.atmosphere}. Side-view perspective.`,
    tags: ['room', 'office', 'start'],
  },
  {
    id: 'room_reception',
    name: 'Reception / Lobby',
    nameDE: 'Empfang / Lobby',
    description: 'Eingangsbereich mit Aufzug',
    assetType: 'scene',
    prompt: `A pixel art game background scene. Soviet-era government building lobby.
Reception desk with typewriter, elevator doors (brass, art deco style),
waiting bench, large propaganda mural, directory sign, potted plant (dying),
security checkpoint. Marble floor, concrete walls. 320x180 pixels.
${STYLE_ANCHOR.base}. ${STYLE_ANCHOR.colors}. ${STYLE_ANCHOR.atmosphere}.
Side-view perspective.`,
    tags: ['room', 'lobby', 'elevator'],
  },
];

// ===========================================
// NPC-PRESETS
// ===========================================
const NPC_PRESETS: Preset[] = [
  {
    id: 'npc_hacker_idle', name: 'Hacker (Idle)', nameDE: 'Hacker (Ruhig)',
    description: '4-Frame Idle-Animation des Hackers', assetType: 'sprite',
    prompt: `A 4-frame pixel art sprite sheet of a young hacker character.
Male, age 25-35, wearing hoodie or lab coat, large glasses, messy hair,
nervous alert expression, slightly hunched posture. Idle animation: subtle breathing,
occasional twitch. Horizontal layout, 64x64 pixels per frame.
${STYLE_ANCHOR.base}. ${STYLE_ANCHOR.colors}. Transparent background.
Side view. ${STYLE_ANCHOR.technical}.`,
    tags: ['npc', 'hacker', 'idle', 'animation'],
  },
  {
    id: 'npc_hacker_typing', name: 'Hacker (Typing)', nameDE: 'Hacker (Tippt)',
    description: '6-Frame Tipp-Animation des Hackers', assetType: 'sprite',
    prompt: `A 6-frame pixel art sprite sheet of a young hacker character typing.
Male, age 25-35, wearing hoodie or lab coat, large glasses, messy hair.
Typing animation: rapid finger movement, focused expression, occasional screen glance.
Seated position. Horizontal layout, 64x64 pixels per frame.
${STYLE_ANCHOR.base}. ${STYLE_ANCHOR.colors}. Transparent background.
Side view. ${STYLE_ANCHOR.technical}.`,
    tags: ['npc', 'hacker', 'typing', 'animation'],
  },
  {
    id: 'npc_analyst_idle', name: 'Analyst (Idle)', nameDE: 'Analystin (Ruhig)',
    description: '4-Frame Idle-Animation der Analystin', assetType: 'sprite',
    prompt: `A 4-frame pixel art sprite sheet of a female intelligence analyst.
Age 35-45, professional blazer, hair in tight bun or short cut, glasses optional,
concentrated focused expression. Idle animation: subtle breathing, thinking pose.
Horizontal layout, 64x64 pixels per frame. ${STYLE_ANCHOR.base}.
${STYLE_ANCHOR.colors}. Transparent background. Side view. ${STYLE_ANCHOR.technical}.`,
    tags: ['npc', 'analyst', 'idle', 'animation'],
  },
  {
    id: 'npc_media_idle', name: 'Media Specialist (Idle)', nameDE: 'Medien-Spezialist (Ruhig)',
    description: '4-Frame Idle-Animation des Medien-Spezialisten', assetType: 'sprite',
    prompt: `A 4-frame pixel art sprite sheet of a charismatic media specialist.
Male, age 35-45, fashionable (for 1980s) suit, well-groomed appearance,
confident slight smile, good posture. Idle animation: subtle movements,
adjusting tie. Horizontal layout, 64x64 pixels per frame.
${STYLE_ANCHOR.base}. ${STYLE_ANCHOR.colors}. Transparent background.
Side view. ${STYLE_ANCHOR.technical}.`,
    tags: ['npc', 'media', 'idle', 'animation'],
  },
  {
    id: 'npc_general_idle', name: 'General (Idle)', nameDE: 'General (Ruhig)',
    description: '4-Frame Idle-Animation des Generals', assetType: 'sprite',
    prompt: `A 4-frame pixel art sprite sheet of a Soviet military general.
Male, age 55-65, military uniform with medals and insignia, grey hair,
possibly mustache, stern piercing gaze, authoritative posture.
Idle animation: subtle breathing, slight head movement.
Horizontal layout, 64x64 pixels per frame. ${STYLE_ANCHOR.base}.
${STYLE_ANCHOR.colors}. Transparent background. Side view. ${STYLE_ANCHOR.technical}.`,
    tags: ['npc', 'general', 'idle', 'animation'],
  },
];

// ===========================================
// PLAYER-PRESETS
// ===========================================
const PLAYER_PRESETS: Preset[] = [
  {
    id: 'player_idle', name: 'Player (Idle)', nameDE: 'Spieler (Ruhig)',
    description: '4-Frame Idle-Animation des Spielers', assetType: 'sprite',
    prompt: `A 4-frame pixel art sprite sheet of a Soviet bureaucrat protagonist.
Male, age 40-50, grey or dark blue suit, briefcase, neutral to slightly worried
expression, average build. Idle animation: subtle breathing, shifting weight.
Horizontal layout, 64x64 pixels per frame. ${STYLE_ANCHOR.base}.
${STYLE_ANCHOR.colors}. Transparent background. Side view. ${STYLE_ANCHOR.technical}.`,
    tags: ['player', 'idle', 'animation'],
  },
  {
    id: 'player_walk', name: 'Player (Walk)', nameDE: 'Spieler (Gehen)',
    description: '8-Frame Geh-Animation des Spielers', assetType: 'sprite',
    prompt: `An 8-frame pixel art sprite sheet of a Soviet bureaucrat walking.
Male, age 40-50, grey or dark blue suit, briefcase in hand.
Walk cycle animation: full walking loop, arms swinging, legs moving.
Horizontal layout, 64x64 pixels per frame. ${STYLE_ANCHOR.base}.
${STYLE_ANCHOR.colors}. Transparent background. Side view. ${STYLE_ANCHOR.technical}.`,
    tags: ['player', 'walk', 'animation'],
  },
];

// ===========================================
// ELEMENT-PRESETS
// ===========================================
const ELEMENT_PRESETS: Preset[] = [
  {
    id: 'element_crt_monitor', name: 'CRT Monitor', nameDE: 'Röhrenmonitor',
    description: 'Alter CRT-Monitor mit grünem Text', assetType: 'element',
    prompt: `A pixel art game asset: vintage CRT computer monitor.
Soviet-era design, bulky plastic casing in beige/grey, curved glass screen
showing green terminal text. 64x64 pixels. Transparent background.
${STYLE_ANCHOR.base}. ${STYLE_ANCHOR.technical}.`,
    tags: ['element', 'tech', 'monitor'],
  },
  {
    id: 'element_rotary_phone', name: 'Rotary Phone', nameDE: 'Wählscheiben-Telefon',
    description: 'Altes Telefon mit Wählscheibe', assetType: 'element',
    prompt: `A pixel art game asset: vintage rotary telephone.
Soviet-era design, heavy bakelite construction, black or dark red color,
coiled cord, rotary dial. 32x32 pixels. Transparent background.
${STYLE_ANCHOR.base}. ${STYLE_ANCHOR.technical}.`,
    tags: ['element', 'phone', 'office'],
  },
  {
    id: 'element_filing_cabinet', name: 'Filing Cabinet', nameDE: 'Aktenschrank',
    description: 'Grauer Metall-Aktenschrank', assetType: 'element',
    prompt: `A pixel art game asset: metal filing cabinet.
Soviet-era design, grey metal construction, 4 drawers, worn handles,
some rust spots, slightly dented. 64x96 pixels. Transparent background.
${STYLE_ANCHOR.base}. ${STYLE_ANCHOR.technical}.`,
    tags: ['element', 'furniture', 'office'],
  },
  {
    id: 'element_server_rack', name: 'Server Rack', nameDE: 'Server-Rack',
    description: 'Server-Schrank mit blinkenden LEDs', assetType: 'element',
    prompt: `A pixel art game asset: vintage server/mainframe rack.
Soviet-era design, tall metal cabinet with many blinking LEDs (red, green),
tape drives, ventilation slots, cables. 64x128 pixels. Transparent background.
${STYLE_ANCHOR.base}. Neon green and red LED accents. ${STYLE_ANCHOR.technical}.`,
    tags: ['element', 'tech', 'server'],
  },
  {
    id: 'element_propaganda_poster', name: 'Propaganda Poster', nameDE: 'Propaganda-Poster',
    description: 'Sowjetisches Propaganda-Plakat', assetType: 'element',
    prompt: `A pixel art game asset: Soviet propaganda poster on wall.
Bold constructivist design, worker or soldier figure, Cyrillic text,
red and black color scheme, geometric shapes. 48x64 pixels.
Transparent background. ${STYLE_ANCHOR.base}. ${STYLE_ANCHOR.technical}.`,
    tags: ['element', 'decoration', 'poster'],
  },
  {
    id: 'element_tv_set', name: 'Television Set', nameDE: 'Fernseher',
    description: 'Alter Röhrenfernseher', assetType: 'element',
    prompt: `A pixel art game asset: vintage CRT television set.
Soviet-era design, wooden cabinet housing, curved glass screen,
channel dial, antenna on top, warm screen glow. 64x64 pixels.
Transparent background. ${STYLE_ANCHOR.base}. ${STYLE_ANCHOR.technical}.`,
    tags: ['element', 'tech', 'tv', 'media'],
  },
];

// ===========================================
// AMBIENT-PRESETS
// ===========================================
const AMBIENT_PRESETS: Preset[] = [
  {
    id: 'ambient_fan', name: 'Spinning Fan', nameDE: 'Drehender Ventilator',
    description: '4-Frame Ventilator-Animation', assetType: 'sprite',
    prompt: `A 4-frame pixel art sprite sheet of a spinning desk/ceiling fan.
Soviet-era design, metal blades, oscillating motion. Animation: rotation loop.
Horizontal layout, 32x32 pixels per frame. ${STYLE_ANCHOR.base}.
Grey metal color. Transparent background. ${STYLE_ANCHOR.technical}.`,
    tags: ['ambient', 'fan', 'animation'],
  },
  {
    id: 'ambient_screen_flicker', name: 'Screen Flicker', nameDE: 'Bildschirm-Flackern',
    description: '4-Frame Monitor-Flacker-Animation', assetType: 'sprite',
    prompt: `A 4-frame pixel art sprite sheet of a flickering CRT screen glow.
Green terminal text effect, scan lines, slight brightness variation.
Animation: subtle flicker loop. Horizontal layout, 64x64 pixels per frame.
Neon green (#00FF00) glow. Transparent background. ${STYLE_ANCHOR.technical}.`,
    tags: ['ambient', 'screen', 'tech', 'animation'],
  },
];

// ===========================================
// KATEGORIEN
// ===========================================
export const PRESET_CATEGORIES: PresetCategory[] = [
  { id: 'rooms', name: 'Rooms', nameDE: 'Räume', presets: ROOM_PRESETS },
  { id: 'npcs', name: 'NPCs', nameDE: 'NPCs', presets: NPC_PRESETS },
  { id: 'player', name: 'Player', nameDE: 'Spieler', presets: PLAYER_PRESETS },
  { id: 'elements', name: 'Elements', nameDE: 'Elemente', presets: ELEMENT_PRESETS },
  { id: 'ambient', name: 'Ambient', nameDE: 'Ambient', presets: AMBIENT_PRESETS },
];

// ===========================================
// HELPER FUNCTIONS
// ===========================================
export function getPresetById(id: string): Preset | undefined {
  for (const category of PRESET_CATEGORIES) {
    const preset = category.presets.find(p => p.id === id);
    if (preset) return preset;
  }
  return undefined;
}

export function getPresetsByAssetType(assetType: AssetType): Preset[] {
  return PRESET_CATEGORIES.flatMap(c => c.presets).filter(p => p.assetType === assetType);
}

export function searchPresets(query: string): Preset[] {
  const lowerQuery = query.toLowerCase();
  return PRESET_CATEGORIES.flatMap(c => c.presets).filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    p.nameDE.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.tags.some(t => t.includes(lowerQuery))
  );
}
