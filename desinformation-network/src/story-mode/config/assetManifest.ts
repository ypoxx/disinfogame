// ===========================================
// ASSET MANIFEST & LOADER
// Central registry for all story-mode assets.
// Generated assets from sprite-tool slot into this manifest.
// ===========================================

import { ROOMS } from './building';

// ── Asset Status ──

export type AssetStatus = 'missing' | 'placeholder' | 'ready';

export interface AssetEntry {
  path: string;
  status: AssetStatus;
  category: 'room-layer' | 'figure' | 'ambient' | 'building' | 'ui';
  roomId?: string;
  description: string;
}

// ── Manifest ──

function buildManifest(): AssetEntry[] {
  const entries: AssetEntry[] = [];

  // Building floor backgrounds
  const floors = [
    { id: 0, file: 'floor_basement.png', desc: 'Keller-Hintergrund (Flur-Ansicht)' },
    { id: 1, file: 'floor_1.png', desc: 'Erdgeschoss-Hintergrund (Flur-Ansicht)' },
    { id: 2, file: 'floor_2.png', desc: '1. Etage-Hintergrund (Flur-Ansicht)' },
    { id: 3, file: 'floor_3.png', desc: '2. Etage-Hintergrund (Flur-Ansicht)' },
  ];

  for (const floor of floors) {
    entries.push({
      path: `/story-assets/building/${floor.file}`,
      status: 'missing',
      category: 'building',
      description: floor.desc,
    });
  }

  // Elevator sprite
  entries.push({
    path: '/story-assets/building/elevator.png',
    status: 'missing',
    category: 'building',
    description: 'Aufzug-Sprite (Tür-Animation)',
  });

  // Room layers (from building.ts config)
  for (const room of ROOMS) {
    for (const layer of room.layers) {
      if (!layer.src) continue; // Dynamic layers (NPC) handled separately
      entries.push({
        path: layer.src,
        status: 'missing',
        category: 'room-layer',
        roomId: room.id,
        description: `${room.name_de} — Layer: ${layer.id}`,
      });
    }
  }

  // Player figure sprites
  const playerSprites = [
    { file: 'idle.png', desc: 'Spieler — Idle (4 Frames, 64x64)' },
    { file: 'walk.png', desc: 'Spieler — Laufen (8 Frames, 64x64)' },
    { file: 'climb.png', desc: 'Spieler — Klettern/Treppe (4 Frames, 64x64)' },
    { file: 'enter_door.png', desc: 'Spieler — Tür betreten (4 Frames, 64x64)' },
  ];

  for (const sprite of playerSprites) {
    entries.push({
      path: `/story-assets/figures/player/${sprite.file}`,
      status: 'missing',
      category: 'figure',
      description: sprite.desc,
    });
  }

  // NPC figure sprites
  const npcSprites = [
    { npc: 'hacker', files: ['hacker_idle.png', 'hacker_typing.png'] },
    { npc: 'analyst', files: ['analyst_idle.png', 'analyst_reading.png'] },
    { npc: 'media', files: ['media_idle.png', 'media_talking.png'] },
    { npc: 'general', files: ['general_idle.png', 'general_nodding.png'] },
  ];

  for (const { npc, files } of npcSprites) {
    for (const file of files) {
      entries.push({
        path: `/story-assets/figures/npcs/${file}`,
        status: 'missing',
        category: 'figure',
        description: `NPC ${npc} — ${file.replace('.png', '').replace(`${npc}_`, '')} (64x64)`,
      });
    }
  }

  return entries;
}

export const ASSET_MANIFEST = buildManifest();

// ── Loader & Cache ──

const imageCache = new Map<string, HTMLImageElement>();
const failedPaths = new Set<string>();

/** Preload an image and cache it. Returns null if load fails. */
export function preloadImage(path: string): Promise<HTMLImageElement | null> {
  if (imageCache.has(path)) {
    return Promise.resolve(imageCache.get(path)!);
  }
  if (failedPaths.has(path)) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      imageCache.set(path, img);
      resolve(img);
    };
    img.onerror = () => {
      failedPaths.add(path);
      resolve(null);
    };
    img.src = path;
  });
}

/** Check which assets from the manifest are available (by trying to load them). */
export async function checkAssetAvailability(): Promise<Map<string, AssetStatus>> {
  const results = new Map<string, AssetStatus>();

  const checks = ASSET_MANIFEST.map(async (entry) => {
    const img = await preloadImage(entry.path);
    results.set(entry.path, img ? 'ready' : 'missing');
  });

  await Promise.all(checks);
  return results;
}

/** Get a summary of asset completion by category. */
export function getAssetSummary(
  availability: Map<string, AssetStatus>
): Record<string, { total: number; ready: number }> {
  const summary: Record<string, { total: number; ready: number }> = {};

  for (const entry of ASSET_MANIFEST) {
    if (!summary[entry.category]) {
      summary[entry.category] = { total: 0, ready: 0 };
    }
    summary[entry.category].total++;
    if (availability.get(entry.path) === 'ready') {
      summary[entry.category].ready++;
    }
  }

  return summary;
}

/** Get all missing assets for a specific room. */
export function getMissingAssetsForRoom(
  roomId: string,
  availability: Map<string, AssetStatus>
): AssetEntry[] {
  return ASSET_MANIFEST.filter(
    (e) => e.roomId === roomId && availability.get(e.path) !== 'ready'
  );
}
