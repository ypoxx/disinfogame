import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import { buildBackup, restoreBackup, requestPersistentStorage, storageStatus } from '@/lib/studio/backup';
import { STORES, DB_NAME, dbPut, dbGetAll } from '@/lib/studio/db';
import { createLibraryAsset, type LibraryAsset } from '@/lib/assets';

function resetDb(): Promise<void> {
  return new Promise((resolve) => {
    const req = indexedDB.deleteDatabase(DB_NAME);
    req.onsuccess = () => resolve();
    req.onerror = () => resolve();
    req.onblocked = () => resolve();
  });
}

beforeEach(resetDb);

describe('buildBackup / restoreBackup', () => {
  it('sichert alle Stores und stellt sie verlustfrei wieder her', async () => {
    const a = createLibraryAsset({ id: 'door_open', type: 'sfx', dataBase64: 'QUJD', mime: 'audio/mpeg', chosen: true });
    await dbPut(STORES.library, a);
    await dbPut(STORES.bible, { id: 'active', text: 'noir, brutalist' });
    await dbPut(STORES.shots, { id: 's1', title: 'Lobby' });
    await dbPut(STORES.kv, { k: 'voiceCasting', v: '{"marina":"v1"}' });

    const snap = await buildBackup();
    expect(snap.app).toBe('asset-studio');
    expect(snap.library).toHaveLength(1);
    expect(snap.kv).toContainEqual({ k: 'voiceCasting', v: '{"marina":"v1"}' });

    // Simuliert "Browser geleert".
    await resetDb();
    expect(await dbGetAll(STORES.library)).toHaveLength(0);

    const summary = await restoreBackup(snap);
    expect(summary).toEqual({ library: 1, bible: 1, shots: 1, kv: 1 });

    const restored = await dbGetAll<LibraryAsset>(STORES.library);
    expect(restored[0]).toMatchObject({ id: 'door_open', dataBase64: 'QUJD', type: 'sfx' });
    const kv = await dbGetAll<{ k: string; v: string }>(STORES.kv);
    expect(kv).toContainEqual({ k: 'voiceCasting', v: '{"marina":"v1"}' });
  });

  it('überlebt eine Sicherung→JSON→Wiederherstellung (Serialisierung)', async () => {
    await dbPut(STORES.library, createLibraryAsset({ id: 'a', type: 'image', dataBase64: 'eA==', mime: 'image/png', chosen: true }));
    const roundTripped = JSON.parse(JSON.stringify(await buildBackup()));
    await resetDb();
    const summary = await restoreBackup(roundTripped);
    expect(summary.library).toBe(1);
  });

  it('lehnt ungültige Daten ab', async () => {
    await expect(restoreBackup({ foo: 1 })).rejects.toThrow();
    await expect(restoreBackup(null)).rejects.toThrow();
    await expect(restoreBackup({ app: 'something-else', library: [] })).rejects.toThrow();
  });
});

describe('Browser-Persistenz (ohne navigator → sichere Defaults)', () => {
  it('requestPersistentStorage liefert false statt zu werfen', async () => {
    await expect(requestPersistentStorage()).resolves.toBe(false);
  });
  it('storageStatus liefert null statt zu werfen', async () => {
    await expect(storageStatus()).resolves.toBeNull();
  });
});
