// ===========================================
// ZENTRALE INDEXEDDB (eine Definition, ein Upgrade-Pfad)
// ===========================================
// Alle Studio-Speicher liegen in EINER Datenbank/Version. Würden mehrere Module
// dieselbe DB mit unterschiedlichen Versionen öffnen, wirft IndexedDB — deshalb
// geht jeder Zugriff hier durch. Bild-Base64 sprengt localStorage (~5 MB), daher
// IndexedDB. Stores: library (Assets), bible (Stil-Bibel), shots (Aufgaben),
// kv (kleine Schlüssel/Wert-Notizen), fs (Ordner-Handle für Auto-Export —
// bewusst getrennt, da nicht JSON-serialisierbar und aus der Sicherung raus).

export const DB_NAME = 'asset-studio';
export const DB_VERSION = 3;

export const STORES = {
  library: 'library',
  bible: 'bible',
  shots: 'shots',
  kv: 'kv',
  fs: 'fs',
} as const;

export type StoreName = (typeof STORES)[keyof typeof STORES];

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB ist hier nicht verfügbar (nur im Browser).'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      // keyPath je Store; fehlende Stores werden additiv angelegt (alte Daten bleiben).
      if (!db.objectStoreNames.contains(STORES.library)) {
        db.createObjectStore(STORES.library, { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains(STORES.bible)) {
        db.createObjectStore(STORES.bible, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.shots)) {
        db.createObjectStore(STORES.shots, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.kv)) {
        db.createObjectStore(STORES.kv, { keyPath: 'k' });
      }
      if (!db.objectStoreNames.contains(STORES.fs)) {
        db.createObjectStore(STORES.fs, { keyPath: 'k' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function run<T>(
  store: StoreName,
  mode: IDBTransactionMode,
  op: (s: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  return openDB().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(store, mode);
        const request = op(tx.objectStore(store));
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        tx.oncomplete = () => db.close();
      })
  );
}

export function dbGet<T>(store: StoreName, key: string): Promise<T | undefined> {
  return run<T | undefined>(store, 'readonly', (s) => s.get(key) as IDBRequest<T | undefined>);
}

export function dbGetAll<T>(store: StoreName): Promise<T[]> {
  return run<T[]>(store, 'readonly', (s) => s.getAll() as IDBRequest<T[]>);
}

export function dbPut<T>(store: StoreName, value: T): Promise<void> {
  return run(store, 'readwrite', (s) => s.put(value as unknown as Record<string, unknown>)).then(() => undefined);
}

export function dbDelete(store: StoreName, key: string): Promise<void> {
  return run(store, 'readwrite', (s) => s.delete(key)).then(() => undefined);
}

/** Kleiner Schlüssel/Wert-Speicher (z. B. globale Notizen). */
export async function kvGet(k: string): Promise<string | undefined> {
  const row = await dbGet<{ k: string; v: string }>(STORES.kv, k);
  return row?.v;
}

export async function kvSet(k: string, v: string): Promise<void> {
  await dbPut(STORES.kv, { k, v });
}
