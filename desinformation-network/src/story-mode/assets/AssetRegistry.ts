// ===========================================
// ASSET-REGISTRY — lädt assets.json und löst Asset-ids zu URLs auf
// ===========================================
// Reine Logik ohne React (testbar). Das Manifest ist optional: Ohne
// public/assets/assets.json bleibt die Registry leer und alle Aufrufer
// fallen auf den bisherigen CSS-/Synth-Look zurück (kein Fehler, kein Log).
//
// Namenskonventionen (identisch mit Asset Studio + tools/asset-pipeline):
//   room_<roomId>            Raum-Hintergrund (image)
//   portrait_<npcId>[_<mood>] NPC-Porträt (image)
//   figure_<npcId>           kleine Figur im Gebäude (sheet)
//   player_walk / player_idle Spielfigur (sheet)
//   sfx_<name> / music_<name> Audio
//   voice_<npcId>_<lineKey>  NPC-Sprachzeile, z. B. voice_marina_greeting_2

import type { AssetsManifest, ManifestAssetType, ManifestEntry, SheetInfo } from './types';

export class AssetRegistry {
  private readonly byId: Map<string, ManifestEntry>;
  private readonly baseUrl: string;

  constructor(manifest: AssetsManifest | null, baseUrl: string = '/assets') {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.byId = new Map();
    for (const entry of manifest?.assets ?? []) {
      if (entry && typeof entry.id === 'string' && typeof entry.file === 'string') {
        this.byId.set(entry.id, entry);
      }
    }
  }

  /** Anzahl geladener Einträge (0 = Fallback-Modus). */
  get size(): number {
    return this.byId.size;
  }

  has(id: string): boolean {
    return this.byId.has(id);
  }

  entry(id: string): ManifestEntry | undefined {
    return this.byId.get(id);
  }

  /** Absolute URL eines Assets (oder null, wenn unbekannt). */
  url(id: string): string | null {
    const entry = this.byId.get(id);
    return entry ? `${this.baseUrl}/${entry.file}` : null;
  }

  /** URL eines Bild-Assets (image ODER sheet), sonst null. */
  imageUrl(id: string): string | null {
    const entry = this.byId.get(id);
    if (!entry || (entry.type !== 'image' && entry.type !== 'sheet')) return null;
    return `${this.baseUrl}/${entry.file}`;
  }

  /** URL eines Audio-Assets (sfx/voice/music), sonst null. */
  soundUrl(id: string): string | null {
    const entry = this.byId.get(id);
    if (!entry || (entry.type !== 'sfx' && entry.type !== 'voice' && entry.type !== 'music')) {
      return null;
    }
    return `${this.baseUrl}/${entry.file}`;
  }

  /** Sheet-Metadaten inkl. URL — nur wenn Frame-Maße vollständig sind. */
  sheet(id: string): SheetInfo | null {
    const entry = this.byId.get(id);
    if (!entry || entry.type !== 'sheet') return null;
    if (entry.frameWidth === undefined || entry.frameHeight === undefined) return null;
    return {
      id: entry.id,
      url: `${this.baseUrl}/${entry.file}`,
      frameWidth: entry.frameWidth,
      frameHeight: entry.frameHeight,
      animations: entry.animations ?? {},
    };
  }

  idsByType(type: ManifestAssetType): string[] {
    const ids: string[] = [];
    for (const entry of this.byId.values()) {
      if (entry.type === type) ids.push(entry.id);
    }
    return ids.sort();
  }
}

/** Asset-id einer NPC-Sprachzeile (Konvention des Asset Studios, concept.ts). */
export function voiceAssetId(npcId: string, lineKey: string): string {
  return `voice_${npcId}_${lineKey}`;
}

// ===========================================
// Singleton + Subscription (für React via useSyncExternalStore)
// ===========================================

let currentRegistry: AssetRegistry = new AssetRegistry(null);
let loadStarted = false;
const listeners = new Set<() => void>();

export function getAssetRegistry(): AssetRegistry {
  return currentRegistry;
}

export function subscribeAssets(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setRegistry(registry: AssetRegistry): void {
  currentRegistry = registry;
  for (const listener of listeners) listener();
}

/**
 * Lädt das Manifest genau einmal (fire-and-forget beim Spielstart).
 * 404/Netzwerkfehler/kaputtes JSON => leere Registry, bewusst still.
 */
export async function initAssetRegistry(baseUrl: string = '/assets'): Promise<AssetRegistry> {
  if (loadStarted) return currentRegistry;
  loadStarted = true;
  try {
    const res = await fetch(`${baseUrl}/assets.json`, { cache: 'no-store' });
    if (res.ok) {
      const manifest = (await res.json()) as AssetsManifest;
      if (manifest && Array.isArray(manifest.assets)) {
        setRegistry(new AssetRegistry(manifest, baseUrl));
        console.log(`[DisInfo] [Assets] Manifest geladen: ${currentRegistry.size} Assets`);
      }
    }
  } catch {
    // Kein Manifest => Fallback-Look; kein Fehler nötig.
  }
  return currentRegistry;
}

/** Nur für Tests: Registry zurücksetzen bzw. direkt setzen. */
export function __resetAssetRegistryForTests(manifest: AssetsManifest | null = null): void {
  loadStarted = false;
  setRegistry(new AssetRegistry(manifest));
}
