// ===========================================
// SICHERUNG & WIEDERHERSTELLUNG (Durability)
// ===========================================
// "Git/Dateien = Quelle der Wahrheit": Die IndexedDB ist nur ein Cache. Hier
// liegt die verlustfreie Sicherung ALLER Stores (Assets inkl. Roh-Daten, Bibel,
// Shots, kv) als ein JSON-Objekt — herunterladbar, ins Repo committbar,
// jederzeit wiederherstellbar. Bewusst DOM-frei (Datei-I/O macht die UI),
// damit diese Logik pur und testbar bleibt.

import { STORES, dbGetAll, dbPut } from './db';
import type { LibraryAsset } from '../assets';

export const BACKUP_SCHEMA = 1;
const APP_TAG = 'asset-studio';

export interface StudioBackup {
  app: typeof APP_TAG;
  schema: number;
  exportedAt: string;
  library: LibraryAsset[];
  bible: unknown[];
  shots: unknown[];
  kv: { k: string; v: string }[];
}

/** Liest ALLE Stores aus IndexedDB in ein verlustfreies Snapshot-Objekt. */
export async function buildBackup(): Promise<StudioBackup> {
  const [library, bible, shots, kv] = await Promise.all([
    dbGetAll<LibraryAsset>(STORES.library),
    dbGetAll<unknown>(STORES.bible),
    dbGetAll<unknown>(STORES.shots),
    dbGetAll<{ k: string; v: string }>(STORES.kv),
  ]);
  return {
    app: APP_TAG,
    schema: BACKUP_SCHEMA,
    exportedAt: new Date().toISOString(),
    library,
    bible,
    shots,
    kv,
  };
}

export interface RestoreSummary {
  library: number;
  bible: number;
  shots: number;
  kv: number;
}

/**
 * Spielt eine Sicherung zurück (zusammenführend: gleiche Schlüssel werden
 * überschrieben, Neues bleibt erhalten). Wirft bei ungültigem Format.
 */
export async function restoreBackup(data: unknown): Promise<RestoreSummary> {
  const b = data as Partial<StudioBackup> | null;
  if (!b || b.app !== APP_TAG || !Array.isArray(b.library)) {
    throw new Error('Keine gültige Studio-Sicherung (Feld „app: asset-studio" fehlt).');
  }
  const summary: RestoreSummary = { library: 0, bible: 0, shots: 0, kv: 0 };
  for (const a of b.library ?? []) {
    await dbPut(STORES.library, a);
    summary.library++;
  }
  for (const x of b.bible ?? []) {
    await dbPut(STORES.bible, x);
    summary.bible++;
  }
  for (const x of b.shots ?? []) {
    await dbPut(STORES.shots, x);
    summary.shots++;
  }
  for (const row of b.kv ?? []) {
    await dbPut(STORES.kv, row);
    summary.kv++;
  }
  return summary;
}

// ----- Browser-Persistenz (gegen stilles Wegräumen unter Speicherdruck) -----

/** Bittet den Browser, die Datenbank dauerhaft zu behalten. true = persistent. */
export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.storage || !navigator.storage.persist) return false;
  try {
    if (navigator.storage.persisted && (await navigator.storage.persisted())) return true;
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}

export interface StorageStatus {
  persisted: boolean;
  usage: number;
  quota: number;
}

export async function storageStatus(): Promise<StorageStatus | null> {
  if (typeof navigator === 'undefined' || !navigator.storage) return null;
  try {
    const persisted = navigator.storage.persisted ? await navigator.storage.persisted() : false;
    const est = navigator.storage.estimate ? await navigator.storage.estimate() : ({} as StorageEstimate);
    return { persisted, usage: est.usage ?? 0, quota: est.quota ?? 0 };
  } catch {
    return null;
  }
}
