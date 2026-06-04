'use client';

// ===========================================
// STUDIO-CONTEXT — zentraler Zustand (Konzept, Bibel, Shots, Keys)
// ===========================================
// Lädt einmal das Spielkonzept + die Stil-Bibel + die (gemergte) Shot-Liste und
// stellt Speicher-Helfer bereit. So bleiben die Panels schlank.

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { loadGameConcept, type GameConcept } from './concept';
import { DEFAULT_BIBLE, loadActiveBible, saveActiveBible, snapshotBible, type StyleBible } from './bible';
import {
  deriveShots,
  loadPersistedShots,
  mergeShots,
  saveShot,
  deleteShot as dbDeleteShot,
  type Shot,
} from './shots';
import { loadKeys } from '../keys';
import { requestPersistentStorage } from './backup';
import { listAssets } from '../library';
import { validateForExport } from '../assets';
import {
  getStoredDirHandle,
  verifyPermission,
  pickAndStoreDirectory,
  forgetDirHandle,
  exportToHandle,
  type FsDirHandle,
} from '../export';

interface KeyStatus {
  google: boolean;
  anthropic: boolean;
  elevenlabs: boolean;
}

interface StudioContextValue {
  concept: GameConcept | null;
  conceptLoading: boolean;
  bible: StyleBible;
  saveBible: (b: StyleBible, snapshot?: boolean) => Promise<void>;
  shots: Shot[];
  updateShot: (s: Shot) => Promise<void>;
  addShot: (s: Shot) => Promise<void>;
  removeShot: (id: string) => Promise<void>;
  keys: KeyStatus;
  refreshKeys: () => void;
  libraryVersion: number;
  bumpLibrary: () => void;
  /** Lädt Konzept/Bibel/Shots neu (z. B. nach Wiederherstellung einer Sicherung). */
  reload: () => Promise<void>;
  // --- Auto-Export in den Spielordner (Stufe 2) ---
  exportDir: string | null;
  autoExport: 'off' | 'ready' | 'needs-permission';
  lastExport: number | null;
  connectExportDir: () => Promise<void>;
  disconnectExportDir: () => Promise<void>;
  exportNow: () => Promise<number>;
}

const StudioContext = createContext<StudioContextValue | null>(null);

function readKeyStatus(): KeyStatus {
  const k = loadKeys();
  return {
    google: Boolean(k.google?.trim()),
    anthropic: Boolean(k.anthropic?.trim()),
    elevenlabs: Boolean(k.elevenlabs?.trim()),
  };
}

export function StudioProvider({ children }: { children: ReactNode }) {
  const [concept, setConcept] = useState<GameConcept | null>(null);
  const [conceptLoading, setConceptLoading] = useState(true);
  const [bible, setBible] = useState<StyleBible>(DEFAULT_BIBLE);
  const [shots, setShots] = useState<Shot[]>([]);
  const [keys, setKeys] = useState<KeyStatus>({ google: false, anthropic: false, elevenlabs: false });
  const [libraryVersion, setLibraryVersion] = useState(0);
  const [exportDir, setExportDir] = useState<string | null>(null);
  const [autoExport, setAutoExport] = useState<'off' | 'ready' | 'needs-permission'>('off');
  const [lastExport, setLastExport] = useState<number | null>(null);
  const handleRef = useRef<FsDirHandle | null>(null);
  const didMountExport = useRef(false);

  // Initiales Laden (clientseitig).
  useEffect(() => {
    let active = true;
    (async () => {
      setKeys(readKeyStatus());
      void requestPersistentStorage(); // Browser bitten, die DB nicht wegzuräumen
      const [loadedConcept, loadedBible, persisted] = await Promise.all([
        loadGameConcept(),
        loadActiveBible(),
        loadPersistedShots(),
      ]);
      if (!active) return;
      setConcept(loadedConcept);
      setBible(loadedBible);
      setShots(mergeShots(deriveShots(loadedConcept), persisted));
      setConceptLoading(false);
    })().catch(() => {
      if (active) setConceptLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  // Gemerkten Spielordner laden (für Auto-Export über Sitzungen hinweg).
  useEffect(() => {
    getStoredDirHandle()
      .then(async (handle) => {
        if (!handle) return;
        handleRef.current = handle;
        setExportDir(handle.name ?? 'Ordner');
        setAutoExport((await verifyPermission(handle, false)) ? 'ready' : 'needs-permission');
      })
      .catch(() => {});
  }, []);

  // Auto-Export: nach jeder Bibliotheks-Änderung (debounced) in den Ordner schreiben.
  useEffect(() => {
    if (!didMountExport.current) {
      didMountExport.current = true; // beim ersten Lauf NICHT exportieren
      return;
    }
    if (autoExport !== 'ready' || !handleRef.current) return;
    const handle = handleRef.current;
    const timer = setTimeout(async () => {
      try {
        const all = await listAssets();
        if (all.filter((a) => a.chosen).length === 0) return; // nie mit Leerstand überschreiben
        if (validateForExport(all).length > 0) return; // keinen kaputten Stand schreiben
        if (!(await verifyPermission(handle, false))) {
          setAutoExport('needs-permission');
          return;
        }
        await exportToHandle(handle, all);
        setLastExport(Date.now());
      } catch {
        setAutoExport('needs-permission');
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [libraryVersion, autoExport]);

  const saveBible = useCallback(async (b: StyleBible, snapshot = false) => {
    setBible(b);
    await saveActiveBible(b);
    if (snapshot) await snapshotBible(b);
  }, []);

  const updateShot = useCallback(async (s: Shot) => {
    setShots((prev) => prev.map((x) => (x.id === s.id ? s : x)));
    await saveShot(s);
  }, []);

  const addShot = useCallback(async (s: Shot) => {
    setShots((prev) => [...prev, s]);
    await saveShot(s);
  }, []);

  const removeShot = useCallback(async (id: string) => {
    setShots((prev) => prev.filter((x) => x.id !== id));
    await dbDeleteShot(id);
  }, []);

  const refreshKeys = useCallback(() => setKeys(readKeyStatus()), []);
  const bumpLibrary = useCallback(() => setLibraryVersion((v) => v + 1), []);

  const reload = useCallback(async () => {
    const [loadedConcept, loadedBible, persisted] = await Promise.all([
      loadGameConcept(),
      loadActiveBible(),
      loadPersistedShots(),
    ]);
    setConcept(loadedConcept);
    setBible(loadedBible);
    setShots(mergeShots(deriveShots(loadedConcept), persisted));
    setLibraryVersion((v) => v + 1);
  }, []);

  const connectExportDir = useCallback(async () => {
    let handle = handleRef.current;
    if (!handle || !(await verifyPermission(handle, true))) {
      handle = await pickAndStoreDirectory(); // wirft bei Abbruch (AbortError)
      handleRef.current = handle;
    }
    setExportDir(handle.name ?? 'Ordner');
    setAutoExport('ready');
    try {
      const all = await listAssets();
      if (all.filter((a) => a.chosen).length > 0 && validateForExport(all).length === 0) {
        await exportToHandle(handle, all);
        setLastExport(Date.now());
      }
    } catch {
      /* Erst-Export ist optional */
    }
  }, []);

  const disconnectExportDir = useCallback(async () => {
    handleRef.current = null;
    await forgetDirHandle();
    setExportDir(null);
    setAutoExport('off');
    setLastExport(null);
  }, []);

  const exportNow = useCallback(async () => {
    const handle = handleRef.current;
    if (!handle) throw new Error('Kein Ordner verbunden.');
    if (!(await verifyPermission(handle, true))) {
      setAutoExport('needs-permission');
      throw new Error('Ordner-Freigabe nötig.');
    }
    const { files } = await exportToHandle(handle, await listAssets());
    setLastExport(Date.now());
    setAutoExport('ready');
    return files;
  }, []);

  return (
    <StudioContext.Provider
      value={{
        concept,
        conceptLoading,
        bible,
        saveBible,
        shots,
        updateShot,
        addShot,
        removeShot,
        keys,
        refreshKeys,
        libraryVersion,
        bumpLibrary,
        reload,
        exportDir,
        autoExport,
        lastExport,
        connectExportDir,
        disconnectExportDir,
        exportNow,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
}

export function useStudio(): StudioContextValue {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error('useStudio muss innerhalb von <StudioProvider> verwendet werden.');
  return ctx;
}
