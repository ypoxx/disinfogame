// ===========================================
// BIBLIOTHEK-SPEICHER (IndexedDB)
// ===========================================
// Dünne, asset-spezifische Schicht über der zentralen DB (lib/studio/db.ts).
// Eine DB-Definition für alle Stores → keine Versionskonflikte.

import type { LibraryAsset } from './assets';
import { STORES, dbGetAll, dbGet, dbPut, dbDelete } from './studio/db';

/** Alle Assets, neueste zuerst. */
export async function listAssets(): Promise<LibraryAsset[]> {
  const all = await dbGetAll<LibraryAsset>(STORES.library);
  return all.sort((a, b) => b.createdAt - a.createdAt);
}

/** Ein Asset per internem Schlüssel. */
export async function getAsset(key: string): Promise<LibraryAsset | undefined> {
  return dbGet<LibraryAsset>(STORES.library, key);
}

/** Asset anlegen oder aktualisieren (keyPath = key). */
export async function putAsset(asset: LibraryAsset): Promise<void> {
  await dbPut(STORES.library, asset);
}

/** Asset per internem Schlüssel löschen. */
export async function deleteAsset(key: string): Promise<void> {
  await dbDelete(STORES.library, key);
}
