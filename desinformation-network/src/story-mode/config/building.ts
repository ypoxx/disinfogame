// ===========================================
// STORY MODE: BUILDING & ROOM CONFIGURATION
// MadTV-style Gebäudestruktur
// ===========================================

import type { AmbientAnimation } from './animations';

// ── Layer System ──
// Rendering-Reihenfolge: niedrigster z-Wert zuerst

export interface RoomLayer {
  id: string;
  src: string | null; // null = dynamisch (z.B. NPC)
  z: number;
  dynamic?: boolean;
  animated?: boolean;
  animationConfig?: {
    frameCount: number;
    frameDuration: number;
    loop: boolean;
  };
}

// ── Interaktive Objekte ──

export interface Interactable {
  id: string;
  type: 'door' | 'object' | 'npc';
  bounds: { x: number; y: number; width: number; height: number };
  action: string;
  tooltip_de: string;
  hotkey?: string;
}

// ── Raum Definition ──

export interface Room {
  id: string;
  name_de: string;
  floor: number;
  position: number; // Position auf der Etage (0 = links)
  size: 'small' | 'medium' | 'large';
  npcId?: string;
  layers: RoomLayer[];
  interactables: Interactable[];
  ambientAnimations: AmbientAnimation[];
  unlockPhase?: number; // Ab welcher Phase verfügbar
  description_de: string;
}

// ── Etage Definition ──

export interface Floor {
  id: number;
  name_de: string;
  rooms: string[]; // Room IDs
  background: string;
  accessible: boolean;
}

// ── Aufzug ──

export const ELEVATOR = {
  travelTimePerFloor: 1200, // ms
  doorAnimTime: 400,
  sprite: '/story-assets/building/elevator.png',
};

// ══════════════════════════════════════
// GEBÄUDE-KONFIGURATION
// ══════════════════════════════════════

export const BUILDING_FLOORS: Floor[] = [
  {
    id: 0,
    name_de: 'Keller',
    rooms: ['server_room', 'archive'],
    background: '/story-assets/building/floor_basement.png',
    accessible: true,
  },
  {
    id: 1,
    name_de: 'Erdgeschoss',
    rooms: ['player_office', 'reception'],
    background: '/story-assets/building/floor_1.png',
    accessible: true,
  },
  {
    id: 2,
    name_de: '1. Etage',
    rooms: ['cyber_lab', 'analysis'],
    background: '/story-assets/building/floor_2.png',
    accessible: true,
  },
  {
    id: 3,
    name_de: '2. Etage',
    rooms: ['media_center', 'command'],
    background: '/story-assets/building/floor_3.png',
    accessible: false, // Wird in Phase 3 freigeschaltet
  },
];

// ══════════════════════════════════════
// RAUM-KONFIGURATIONEN
// ══════════════════════════════════════

export const ROOMS: Room[] = [
  // ── Erdgeschoss ──
  {
    id: 'player_office',
    name_de: 'Dein Büro',
    floor: 1,
    position: 0,
    size: 'medium',
    layers: [
      { id: 'bg', src: '/story-assets/rooms/player_office/background.png', z: 0 },
      { id: 'furniture', src: '/story-assets/rooms/player_office/furniture.png', z: 1 },
      { id: 'desk_items', src: '/story-assets/rooms/player_office/desk_items.png', z: 4 },
    ],
    interactables: [
      {
        id: 'door',
        type: 'door',
        bounds: { x: 10, y: 80, width: 50, height: 120 },
        action: 'exit_room',
        tooltip_de: 'Flur',
      },
      {
        id: 'computer',
        type: 'object',
        bounds: { x: 300, y: 140, width: 80, height: 60 },
        action: 'open_actions',
        tooltip_de: 'Aktionen planen [A]',
        hotkey: 'a',
      },
      {
        id: 'phone',
        type: 'object',
        bounds: { x: 200, y: 160, width: 40, height: 30 },
        action: 'open_npcs',
        tooltip_de: 'Kontakte [P]',
        hotkey: 'p',
      },
      {
        id: 'tv',
        type: 'object',
        bounds: { x: 450, y: 40, width: 120, height: 80 },
        action: 'open_stats',
        tooltip_de: 'Statistiken [S]',
        hotkey: 's',
      },
      {
        id: 'smartphone',
        type: 'object',
        bounds: { x: 380, y: 170, width: 25, height: 40 },
        action: 'open_news',
        tooltip_de: 'Nachrichten [N]',
        hotkey: 'n',
      },
      {
        id: 'folder',
        type: 'object',
        bounds: { x: 250, y: 180, width: 50, height: 30 },
        action: 'open_mission',
        tooltip_de: 'Mission [M]',
        hotkey: 'm',
      },
    ],
    ambientAnimations: [],
    description_de: 'Dein Büro. Von hier aus steuerst du die Operationen.',
  },

  {
    id: 'reception',
    name_de: 'Empfang',
    floor: 1,
    position: 1,
    size: 'small',
    layers: [
      { id: 'bg', src: '/story-assets/rooms/reception/background.png', z: 0 },
      { id: 'furniture', src: '/story-assets/rooms/reception/furniture.png', z: 1 },
    ],
    interactables: [
      {
        id: 'door',
        type: 'door',
        bounds: { x: 10, y: 80, width: 50, height: 120 },
        action: 'exit_room',
        tooltip_de: 'Flur',
      },
    ],
    ambientAnimations: [],
    description_de: 'Der Empfangsbereich. Hier beginnt alles.',
  },

  // ── 1. Etage ──
  {
    id: 'cyber_lab',
    name_de: 'Cyber-Labor',
    floor: 2,
    position: 0,
    size: 'medium',
    npcId: 'hacker',
    layers: [
      { id: 'bg', src: '/story-assets/rooms/cyber_lab/background.png', z: 0 },
      { id: 'furniture', src: '/story-assets/rooms/cyber_lab/furniture.png', z: 1 },
      { id: 'cables', src: '/story-assets/rooms/cyber_lab/effects.png', z: 2 },
      { id: 'npc', src: null, z: 3, dynamic: true },
      {
        id: 'screens',
        src: '/story-assets/rooms/cyber_lab/screens.png',
        z: 5,
        animated: true,
        animationConfig: { frameCount: 4, frameDuration: 200, loop: true },
      },
    ],
    interactables: [
      {
        id: 'door',
        type: 'door',
        bounds: { x: 10, y: 80, width: 50, height: 120 },
        action: 'exit_room',
        tooltip_de: 'Flur',
      },
      {
        id: 'hacker_npc',
        type: 'npc',
        bounds: { x: 200, y: 140, width: 64, height: 64 },
        action: 'talk_to_npc:hacker',
        tooltip_de: 'Mit Hacker sprechen',
      },
      {
        id: 'server_rack',
        type: 'object',
        bounds: { x: 400, y: 60, width: 80, height: 160 },
        action: 'inspect_servers',
        tooltip_de: 'Server untersuchen',
      },
    ],
    ambientAnimations: [
      { id: 'led1', type: 'led_blink', position: { x: 410, y: 70 }, config: { color: '#33FF33', interval: 500 } },
      { id: 'led2', type: 'led_blink', position: { x: 420, y: 80 }, config: { color: '#FF3333', interval: 700 } },
      { id: 'led3', type: 'led_blink', position: { x: 430, y: 90 }, config: { color: '#33FF33', interval: 300 } },
      { id: 'fan1', type: 'fan_spin', position: { x: 450, y: 30 }, config: { speed: 2 } },
      { id: 'scr1', type: 'screen_flicker', position: { x: 180, y: 100 }, config: { intensity: 0.15 } },
    ],
    description_de: 'Das technische Herzstück. Server, Monitore, und der Hacker, der alles am Laufen hält.',
  },

  {
    id: 'analysis',
    name_de: 'Analyse-Büro',
    floor: 2,
    position: 1,
    size: 'medium',
    npcId: 'analyst',
    layers: [
      { id: 'bg', src: '/story-assets/rooms/analysis/background.png', z: 0 },
      { id: 'furniture', src: '/story-assets/rooms/analysis/furniture.png', z: 1 },
      { id: 'npc', src: null, z: 3, dynamic: true },
      { id: 'charts', src: '/story-assets/rooms/analysis/charts.png', z: 4 },
      { id: 'papers', src: '/story-assets/rooms/analysis/papers.png', z: 5 },
    ],
    interactables: [
      {
        id: 'door',
        type: 'door',
        bounds: { x: 10, y: 80, width: 50, height: 120 },
        action: 'exit_room',
        tooltip_de: 'Flur',
      },
      {
        id: 'analyst_npc',
        type: 'npc',
        bounds: { x: 220, y: 150, width: 64, height: 64 },
        action: 'talk_to_npc:analyst',
        tooltip_de: 'Mit Analystin sprechen',
      },
      {
        id: 'pinboard',
        type: 'object',
        bounds: { x: 300, y: 30, width: 150, height: 100 },
        action: 'view_analysis',
        tooltip_de: 'Pinnwand ansehen',
      },
    ],
    ambientAnimations: [
      { id: 'steam1', type: 'steam', position: { x: 180, y: 185 }, config: { intensity: 0.3 } },
      { id: 'neon1', type: 'neon_flicker', position: { x: 250, y: 10 }, config: { interval: 8000, intensity: 0.05 } },
    ],
    description_de: 'Aktenberge, Diagramme und eine Analystin mit scharfem Blick.',
  },

  // ── 2. Etage ──
  {
    id: 'media_center',
    name_de: 'Medien-Zentrum',
    floor: 3,
    position: 0,
    size: 'large',
    npcId: 'media',
    unlockPhase: 3,
    layers: [
      { id: 'bg', src: '/story-assets/rooms/media_center/background.png', z: 0 },
      { id: 'furniture', src: '/story-assets/rooms/media_center/furniture.png', z: 1 },
      { id: 'npc', src: null, z: 3, dynamic: true },
      {
        id: 'tv_screens',
        src: '/story-assets/rooms/media_center/tv_screens.png',
        z: 5,
        animated: true,
        animationConfig: { frameCount: 3, frameDuration: 2000, loop: true },
      },
    ],
    interactables: [
      {
        id: 'door',
        type: 'door',
        bounds: { x: 10, y: 80, width: 50, height: 120 },
        action: 'exit_room',
        tooltip_de: 'Flur',
      },
      {
        id: 'media_npc',
        type: 'npc',
        bounds: { x: 250, y: 150, width: 64, height: 64 },
        action: 'talk_to_npc:media',
        tooltip_de: 'Mit Medien-Spezialist sprechen',
      },
    ],
    ambientAnimations: [
      { id: 'scr1', type: 'screen_flicker', position: { x: 350, y: 50 }, config: { intensity: 0.1 } },
      { id: 'paper1', type: 'paper_flutter', position: { x: 100, y: 190 }, config: { speed: 0.5 } },
    ],
    description_de: 'Fernseher, Kameras, Zeitungen. Das Propagandazentrum.',
  },

  {
    id: 'command',
    name_de: 'Kommando-Zentrale',
    floor: 3,
    position: 1,
    size: 'large',
    npcId: 'general',
    unlockPhase: 3,
    layers: [
      { id: 'bg', src: '/story-assets/rooms/command/background.png', z: 0 },
      { id: 'furniture', src: '/story-assets/rooms/command/furniture.png', z: 1 },
      { id: 'npc', src: null, z: 3, dynamic: true },
      { id: 'world_map', src: '/story-assets/rooms/command/world_map.png', z: 4 },
    ],
    interactables: [
      {
        id: 'door',
        type: 'door',
        bounds: { x: 10, y: 80, width: 50, height: 120 },
        action: 'exit_room',
        tooltip_de: 'Flur',
      },
      {
        id: 'general_npc',
        type: 'npc',
        bounds: { x: 200, y: 150, width: 64, height: 64 },
        action: 'talk_to_npc:general',
        tooltip_de: 'Mit General sprechen',
      },
      {
        id: 'world_map',
        type: 'object',
        bounds: { x: 250, y: 20, width: 200, height: 120 },
        action: 'open_events',
        tooltip_de: 'Weltkarte [E]',
        hotkey: 'e',
      },
      {
        id: 'red_phone',
        type: 'object',
        bounds: { x: 150, y: 170, width: 40, height: 30 },
        action: 'emergency_call',
        tooltip_de: 'Rotes Telefon',
      },
    ],
    ambientAnimations: [
      { id: 'led1', type: 'led_blink', position: { x: 300, y: 60 }, config: { color: '#FF3333', interval: 2000 } },
    ],
    description_de: 'Das Nervenzentrum. Weltkarte, rotes Telefon und der General.',
  },

  // ── Keller ──
  {
    id: 'server_room',
    name_de: 'Server-Raum',
    floor: 0,
    position: 0,
    size: 'large',
    layers: [
      { id: 'bg', src: '/story-assets/rooms/server_room/background.png', z: 0 },
      { id: 'racks', src: '/story-assets/rooms/server_room/racks.png', z: 1 },
    ],
    interactables: [
      {
        id: 'door',
        type: 'door',
        bounds: { x: 10, y: 80, width: 50, height: 120 },
        action: 'exit_room',
        tooltip_de: 'Flur',
      },
    ],
    ambientAnimations: [
      { id: 'led1', type: 'led_blink', position: { x: 100, y: 50 }, config: { color: '#33FF33', interval: 200 } },
      { id: 'led2', type: 'led_blink', position: { x: 110, y: 55 }, config: { color: '#33FF33', interval: 350 } },
      { id: 'led3', type: 'led_blink', position: { x: 200, y: 50 }, config: { color: '#FF3333', interval: 400 } },
      { id: 'led4', type: 'led_blink', position: { x: 210, y: 55 }, config: { color: '#33FF33', interval: 250 } },
      { id: 'led5', type: 'led_blink', position: { x: 300, y: 50 }, config: { color: '#33FF33', interval: 600 } },
      { id: 'fan1', type: 'fan_spin', position: { x: 350, y: 20 }, config: { speed: 3 } },
      { id: 'fan2', type: 'fan_spin', position: { x: 450, y: 20 }, config: { speed: 2.5 } },
    ],
    description_de: 'Botfarmen, Server, das Brummen der Maschinen. Hier läuft die Infrastruktur.',
  },

  {
    id: 'archive',
    name_de: 'Archiv',
    floor: 0,
    position: 1,
    size: 'medium',
    layers: [
      { id: 'bg', src: '/story-assets/rooms/archive/background.png', z: 0 },
      { id: 'shelves', src: '/story-assets/rooms/archive/shelves.png', z: 1 },
    ],
    interactables: [
      {
        id: 'door',
        type: 'door',
        bounds: { x: 10, y: 80, width: 50, height: 120 },
        action: 'exit_room',
        tooltip_de: 'Flur',
      },
    ],
    ambientAnimations: [
      { id: 'neon1', type: 'neon_flicker', position: { x: 250, y: 10 }, config: { interval: 12000, intensity: 0.08 } },
    ],
    description_de: 'Reihen von Aktenschränken. Staub und Geheimnisse.',
  },
];

// ── Helper ──

export function getRoomById(id: string): Room | undefined {
  return ROOMS.find((r) => r.id === id);
}

export function getRoomsForFloor(floorId: number): Room[] {
  return ROOMS.filter((r) => r.floor === floorId);
}

export function getFloorById(id: number): Floor | undefined {
  return BUILDING_FLOORS.find((f) => f.id === id);
}
