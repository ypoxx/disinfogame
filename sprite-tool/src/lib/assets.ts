// ===========================================
// ASSET-MODELL + MANIFEST (assets.json)
// ===========================================
// Kuratierte Assets der Bibliothek und das Manifest, das das Spiel
// datengetrieben lädt. Schema siehe docs/ASSET_STUDIO_SPEC.md.

export type ManifestAssetType = 'image' | 'sheet' | 'sfx' | 'voice' | 'music';

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

/** Baut das assets.json aus den gewählten Assets. */
export function buildManifest(assets: LibraryAsset[]): AssetsManifest {
  return {
    assets: assets
      .filter((a) => a.chosen)
      .map((a) => ({
        id: a.id,
        type: a.type,
        file: filePathFor(a),
        ...(a.provider ? { provider: a.provider } : {}),
        ...(a.prompt ? { prompt: a.prompt } : {}),
        ...(a.seed !== undefined ? { seed: a.seed } : {}),
        ...(a.styleVersion ? { styleVersion: a.styleVersion } : {}),
        chosen: true,
      })),
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
    seen.set(a.id, (seen.get(a.id) || 0) + 1);
  }
  for (const [id, count] of seen) {
    if (count > 1) errors.push(`id „${id}" ist ${count}× vergeben (muss eindeutig sein).`);
  }
  return errors;
}

let counter = 0;

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
