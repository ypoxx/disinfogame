// ===========================================
// STORY MODE: ANIMATION DEFINITIONS
// Sprite-Sheet Konventionen & Animationsdaten
// ===========================================

// ── Sprite-Sheet Format ──
// Alle Frames horizontal in einer Zeile
// Transparenter Hintergrund (PNG-24 mit Alpha)
// Pivot-Punkt: Füße mittig-unten

export interface SpriteAnimation {
  name: string;
  src: string;
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  frameDuration: number; // ms
  loop: boolean;
}

// ── Player Animationen ──

export const PLAYER_ANIMATIONS: Record<string, SpriteAnimation> = {
  idle: {
    name: 'idle',
    src: '/story-assets/figures/player/idle.png',
    frameWidth: 64,
    frameHeight: 64,
    frameCount: 4,
    frameDuration: 250,
    loop: true,
  },
  walk_right: {
    name: 'walk_right',
    src: '/story-assets/figures/player/walk.png',
    frameWidth: 64,
    frameHeight: 64,
    frameCount: 8,
    frameDuration: 100,
    loop: true,
  },
  // walk_left = walk_right gespiegelt (CSS scaleX(-1))
  climb_up: {
    name: 'climb_up',
    src: '/story-assets/figures/player/climb.png',
    frameWidth: 64,
    frameHeight: 64,
    frameCount: 4,
    frameDuration: 150,
    loop: true,
  },
  enter_door: {
    name: 'enter_door',
    src: '/story-assets/figures/player/enter_door.png',
    frameWidth: 64,
    frameHeight: 64,
    frameCount: 4,
    frameDuration: 200,
    loop: false,
  },
};

// ── NPC Animationen ──

export const NPC_ANIMATIONS: Record<string, Record<string, SpriteAnimation>> = {
  hacker: {
    idle: {
      name: 'idle',
      src: '/story-assets/figures/npcs/hacker_idle.png',
      frameWidth: 64,
      frameHeight: 64,
      frameCount: 4,
      frameDuration: 300,
      loop: true,
    },
    typing: {
      name: 'typing',
      src: '/story-assets/figures/npcs/hacker_typing.png',
      frameWidth: 64,
      frameHeight: 64,
      frameCount: 6,
      frameDuration: 120,
      loop: true,
    },
  },
  analyst: {
    idle: {
      name: 'idle',
      src: '/story-assets/figures/npcs/analyst_idle.png',
      frameWidth: 64,
      frameHeight: 64,
      frameCount: 4,
      frameDuration: 350,
      loop: true,
    },
    reading: {
      name: 'reading',
      src: '/story-assets/figures/npcs/analyst_reading.png',
      frameWidth: 64,
      frameHeight: 64,
      frameCount: 4,
      frameDuration: 400,
      loop: true,
    },
  },
  media: {
    idle: {
      name: 'idle',
      src: '/story-assets/figures/npcs/media_idle.png',
      frameWidth: 64,
      frameHeight: 64,
      frameCount: 4,
      frameDuration: 300,
      loop: true,
    },
    talking: {
      name: 'talking',
      src: '/story-assets/figures/npcs/media_talking.png',
      frameWidth: 64,
      frameHeight: 64,
      frameCount: 6,
      frameDuration: 150,
      loop: true,
    },
  },
  general: {
    idle: {
      name: 'idle',
      src: '/story-assets/figures/npcs/general_idle.png',
      frameWidth: 64,
      frameHeight: 64,
      frameCount: 4,
      frameDuration: 400,
      loop: true,
    },
    nodding: {
      name: 'nodding',
      src: '/story-assets/figures/npcs/general_nodding.png',
      frameWidth: 64,
      frameHeight: 64,
      frameCount: 4,
      frameDuration: 250,
      loop: false,
    },
  },
};

// ── Ambient Animationen ──

export type AmbientType =
  | 'led_blink'
  | 'screen_flicker'
  | 'fan_spin'
  | 'steam'
  | 'paper_flutter'
  | 'neon_flicker';

export interface AmbientAnimation {
  id: string;
  type: AmbientType;
  position: { x: number; y: number };
  config: {
    color?: string;
    interval?: number;
    intensity?: number;
    speed?: number;
  };
}
