import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import {
  verifyPermission,
  getStoredDirHandle,
  forgetDirHandle,
  exportToHandle,
  type FsDirHandle,
} from '@/lib/export';
import { STORES, DB_NAME, dbPut } from '@/lib/studio/db';
import { createLibraryAsset } from '@/lib/assets';

function resetDb(): Promise<void> {
  return new Promise((resolve) => {
    const req = indexedDB.deleteDatabase(DB_NAME);
    req.onsuccess = () => resolve();
    req.onerror = () => resolve();
    req.onblocked = () => resolve();
  });
}

/** In-Memory-Fake eines File-System-Access-Ordners (sammelt Dateinamen). */
function fakeDir(): { handle: FsDirHandle; writes: string[] } {
  const writes: string[] = [];
  const handle = {
    name: 'public-assets',
    async getDirectoryHandle() {
      return handle; // alle Unterordner → selber Sammler
    },
    async getFileHandle(name: string) {
      return {
        async createWritable() {
          return {
            async write() {},
            async close() {
              writes.push(name);
            },
          };
        },
      };
    },
  } as unknown as FsDirHandle;
  return { handle, writes };
}

describe('verifyPermission', () => {
  it('granted → true ohne Nachfrage', async () => {
    const h = { queryPermission: async () => 'granted' } as unknown as FsDirHandle;
    expect(await verifyPermission(h, false)).toBe(true);
  });
  it('prompt + request=false → false (fragt nicht)', async () => {
    const h = { queryPermission: async () => 'prompt', requestPermission: async () => 'granted' } as unknown as FsDirHandle;
    expect(await verifyPermission(h, false)).toBe(false);
  });
  it('prompt + request=true → fragt nach und respektiert das Ergebnis', async () => {
    let asked = false;
    const ok = { queryPermission: async () => 'prompt', requestPermission: async () => { asked = true; return 'granted'; } } as unknown as FsDirHandle;
    expect(await verifyPermission(ok, true)).toBe(true);
    expect(asked).toBe(true);

    const denied = { queryPermission: async () => 'prompt', requestPermission: async () => 'denied' } as unknown as FsDirHandle;
    expect(await verifyPermission(denied, true)).toBe(false);
  });
});

describe('exportToHandle', () => {
  it('schreibt assets.json + je gewähltem Asset eine Datei (Unchosen übersprungen)', async () => {
    const { handle, writes } = fakeDir();
    const assets = [
      createLibraryAsset({ id: 'door', type: 'sfx', dataBase64: 'QQ==', mime: 'audio/mpeg', chosen: true }),
      createLibraryAsset({ id: 'room', type: 'image', dataBase64: 'QQ==', mime: 'image/png', chosen: true }),
      createLibraryAsset({ id: 'skip', type: 'image', dataBase64: 'QQ==', mime: 'image/png', chosen: false }),
    ];
    const { files } = await exportToHandle(handle, assets);
    expect(files).toBe(2);
    expect(writes).toContain('assets.json');
    expect(writes).toContain('door.mp3');
    expect(writes).toContain('room.png');
    expect(writes).not.toContain('skip.png');
  });
});

describe('Ordner-Handle-Persistenz (Store: fs)', () => {
  beforeEach(resetDb);
  it('merkt und vergisst den Handle', async () => {
    expect(await getStoredDirHandle()).toBeNull();
    await dbPut(STORES.fs, { k: 'exportDir', v: { name: 'mein-ordner' } });
    expect((await getStoredDirHandle())?.name).toBe('mein-ordner');
    await forgetDirHandle();
    expect(await getStoredDirHandle()).toBeNull();
  });
});
