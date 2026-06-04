'use client';

// ===========================================
// STUDIO-CONTEXT — zentraler Zustand (Konzept, Bibel, Shots, Keys)
// ===========================================
// Lädt einmal das Spielkonzept + die Stil-Bibel + die (gemergte) Shot-Liste und
// stellt Speicher-Helfer bereit. So bleiben die Panels schlank.

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
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
