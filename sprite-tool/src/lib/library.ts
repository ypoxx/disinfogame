// ===========================================
// BIBLIOTHEK-SPEICHER (IndexedDB)
// ===========================================
// Lokaler, browserseitiger Speicher für kuratierte Assets. IndexedDB statt
// localStorage, weil Bild-Base64 schnell die ~5 MB-Grenze sprengt.

import type { LibraryAsset } from './assets';

const DB_NAME = 'asset-studio';
const STORE = 'library';
const VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB ist hier nicht verfügbar.'));
      return;
    }
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'key' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDB().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const transaction = db.transaction(STORE, mode);
        const request = run(transaction.objectStore(STORE));
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        transaction.oncomplete = () => db.close();
      })
  );
}

/** Alle Assets, neueste zuerst. */
export async function listAssets(): Promise<LibraryAsset[]> {
  const all = await tx<LibraryAsset[]>('readonly', (s) => s.getAll() as IDBRequest<LibraryAsset[]>);
  return all.sort((a, b) => b.createdAt - a.createdAt);
}

/** Asset anlegen oder aktualisieren (keyPath = key). */
export async function putAsset(asset: LibraryAsset): Promise<void> {
  await tx('readwrite', (s) => s.put(asset));
}

/** Asset per internem Schlüssel löschen. */
export async function deleteAsset(key: string): Promise<void> {
  await tx('readwrite', (s) => s.delete(key));
}
