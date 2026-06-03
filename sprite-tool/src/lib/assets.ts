// ===========================================
// ASSET-MODELL + MANIFEST (assets.json)
// ===========================================
// Kuratierte Assets der Bibliothek und das Manifest, das das Spiel
// datengetrieben lädt. Schema siehe docs/ASSET_STUDIO_SPEC.md.

export type ManifestAssetType = 'image' | 'sheet' | 'sfx' | 'voice' | 'music';

/** Eine Animation in einem Sprite-Sheet (Zeile + Frame-Anzahl + Timing). */
export interface SheetAnimation {
  name: string;
  row?: number;
  frames: number;
  frameTime: number; // ms pro Frame
  loop: boolean;
}

/** Klickbarer Bereich (Hotspot) auf einem Raum-Hintergrund → building.json. */
export interface AssetRegion {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Ein kuratiertes Asset in der Bibliothek (lokal in IndexedDB gespeichert). */
export interface LibraryAsset {
  key: string; // interner, unveränderlicher Schlüssel (IndexedDB keyPath)
  id: string; // Spiel-Asset-id (editierbar), z. B. "room_medien_bg"
  type: ManifestAssetType;
  dataBase64: string; // Dateiinhalt base64 (ohne data:-Präfix)
  mime: string; // z. B. "image/png"
  prompt?: string;
  seed?: number;
  provider?: string; // z. B. "gemini-3-pro-image"
  styleVersion?: string;
  chosen: boolean;
  createdAt: number;

  // --- Studio-Erweiterungen (Regie-/Konsistenz-Workflow) ---
  family?: string; // Asset-Familie, z. B. "character" oder "room:medien_zentrum"
  role?: 'master' | 'asset'; // Master = Stil-Referenz für die Familie
  referenceMasterKeys?: string[]; // welche Master beim Erzeugen mitgegeben wurden
  shotId?: string; // verknüpfter Shot aus der Shot-Liste

  // --- Sprite-Sheet-Metadaten (type === 'sheet') ---
  frameWidth?: number;
  frameHeight?: number;
  cols?: number;
  rows?: number;
  animations?: SheetAnimation[];

  // --- Hotspots (type === 'image' für Räume) ---
  regions?: AssetRegion[];
}

/** Ein Eintrag im exportierten assets.json. */
export interface ManifestEntry {
  id: string;
  type: ManifestAssetType;
  file: string; // relativer Pfad, z. B. "images/room_medien_bg.png"
  provider?: string;
  prompt?: string;
  seed?: number;
  styleVersion?: string;
  chosen: boolean;
  frameWidth?: number;
  frameHeight?: number;
  animations?: Record<string, { row?: number; frames: number; frameTime: number; loop: boolean }>;
  regions?: AssetRegion[];
}

export interface AssetsManifest {
  assets: ManifestEntry[];
}

/** Zielordner je Typ (passt zu public/assets/ im Spiel). */
export function folderForType(type: ManifestAssetType): string {
  switch (type) {
    case 'image':
      return 'images';
    case 'sheet':
      return 'sheets';
    case 'sfx':
    case 'voice':
    case 'music':
      return 'sounds';
  }
}

/** Dateiendung aus MIME bzw. Typ ableiten. */
export function extForAsset(asset: Pick<LibraryAsset, 'mime' | 'type'>): string {
  const byMime: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
    'audio/mpeg': 'mp3',
    'audio/mp3': 'mp3',
    'audio/wav': 'wav',
  };
  if (asset.mime && byMime[asset.mime]) return byMime[asset.mime];
  // Fallback nach Typ
  return asset.type === 'image' || asset.type === 'sheet' ? 'png' : 'mp3';
}

/** Relativer Dateipfad eines Assets im Manifest/Export. */
export function filePathFor(asset: LibraryAsset): string {
  return `${folderForType(asset.type)}/${asset.id}.${extForAsset(asset)}`;
}

function animationsToRecord(
  animations?: SheetAnimation[]
): Record<string, { row?: number; frames: number; frameTime: number; loop: boolean }> | undefined {
  if (!animations || animations.length === 0) return undefined;
  const out: Record<string, { row?: number; frames: number; frameTime: number; loop: boolean }> = {};
  for (const a of animations) {
    out[a.name] = { row: a.row, frames: a.frames, frameTime: a.frameTime, loop: a.loop };
  }
  return out;
}

/** Baut das assets.json aus den gewählten Assets. */
export function buildManifest(assets: LibraryAsset[]): AssetsManifest {
  return {
    assets: assets
      .filter((a) => a.chosen)
      .map((a) => {
        const entry: ManifestEntry = {
          id: a.id,
          type: a.type,
          file: filePathFor(a),
          chosen: true,
          ...(a.provider ? { provider: a.provider } : {}),
          ...(a.prompt ? { prompt: a.prompt } : {}),
          ...(a.seed !== undefined ? { seed: a.seed } : {}),
          ...(a.styleVersion ? { styleVersion: a.styleVersion } : {}),
        };
        if (a.type === 'sheet') {
          if (a.frameWidth !== undefined) entry.frameWidth = a.frameWidth;
          if (a.frameHeight !== undefined) entry.frameHeight = a.frameHeight;
          const anims = animationsToRecord(a.animations);
          if (anims) entry.animations = anims;
        }
        if (a.regions && a.regions.length > 0) entry.regions = a.regions;
        return entry;
      }),
  };
}

const ID_PATTERN = /^[a-z0-9_]+$/;

/** Prüft die gewählten Assets vor dem Export; liefert Fehlermeldungen (leer = ok). */
export function validateForExport(assets: LibraryAsset[]): string[] {
  const chosen = assets.filter((a) => a.chosen);
  const errors: string[] = [];
  if (chosen.length === 0) errors.push('Keine Assets als „fürs Spiel" markiert.');

  const seen = new Map<string, number>();
  for (const a of chosen) {
    if (!a.id.trim()) {
      errors.push('Ein gewähltes Asset hat keine id.');
      continue;
    }
    if (!ID_PATTERN.test(a.id)) {
      errors.push(`id „${a.id}" enthält ungültige Zeichen (erlaubt: a–z, 0–9, _).`);
    }
    if (a.type === 'sheet' && (a.frameWidth === undefined || a.frameHeight === undefined)) {
      errors.push(`Sheet „${a.id}" hat keine Frame-Maße (im Sprite-Sheet-Studio setzen).`);
    }
    seen.set(a.id, (seen.get(a.id) || 0) + 1);
  }
  // Kollision nur INNERHALB desselben Typs ist kritisch (eigener Ordner je Typ).
  const byTypeId = new Map<string, number>();
  for (const a of chosen) {
    if (!a.id.trim()) continue;
    const k = `${a.type}/${a.id}`;
    byTypeId.set(k, (byTypeId.get(k) || 0) + 1);
  }
  for (const [k, count] of byTypeId) {
    if (count > 1) errors.push(`„${k}" ist ${count}× vergeben (muss je Typ eindeutig sein).`);
  }
  return errors;
}

let counter = 0;

/** Leitet eine gültige Default-id aus dem Prompt ab (a–z, 0–9, _). */
export function defaultIdFromPrompt(prompt: string, fallback = 'asset'): string {
  const slug = prompt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .split('_')
    .filter(Boolean)
    .slice(0, 5)
    .join('_');
  return slug || fallback;
}

/** Erzeugt ein neues Bibliotheks-Asset mit internem Schlüssel + Defaults. */
export function createLibraryAsset(
  init: Omit<LibraryAsset, 'key' | 'createdAt' | 'chosen'> & { chosen?: boolean }
): LibraryAsset {
  const key =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `asset_${Date.now()}_${counter++}`;
  return { key, createdAt: Date.now(), chosen: init.chosen ?? false, ...init };
}
