/**
 * playerProfileStore — die einfache Avatar-Wahl des Spielers (K10/D27).
 *
 * Name + gewähltes Porträt (eines der portrait_player_*-Assets). Persistiert,
 * damit der Spieler sich wiedererkennt (Dienstausweis im Büro, Erfolgs-Porträt).
 * Bewusst minimal: Auswahl statt Charakter-Editor.
 */
import { create } from 'zustand';

export interface PlayerPortraitOption {
  id: string;
  label: string;
}

/** Auswahl-Optionen (Assets liegen als portrait_player_<id> vor). */
export const PLAYER_PORTRAITS: PlayerPortraitOption[] = [
  { id: 'm1', label: 'Jung' },
  { id: 'm2', label: 'Mittel' },
  { id: 'm3', label: 'Erfahren' },
  { id: 'f1', label: 'Jung' },
  { id: 'f2', label: 'Mittel' },
  { id: 'f3', label: 'Erfahren' },
];

const PROFILE_ROWS = new Map(PLAYER_PORTRAITS.map((profile, row) => [profile.id, row]));

/** Persistierte Alt-/Fremdwerte auf ein verfügbares Profil zurückführen. */
export function normalizedPlayerPortraitId(portraitId: string): string {
  return PROFILE_ROWS.has(portraitId) ? portraitId : 'm2';
}

/** Einheitlicher Ausschnitt der neu erzeugten quadratischen Dienstporträts. */
export interface PortraitRahmen {
  x: number;
  y: number;
  groesse: number;
}

const PORTRAIT_RAHMEN: Record<string, PortraitRahmen> = {
  m1: { x: 0, y: 0, groesse: 1 },
  m2: { x: 0, y: 0, groesse: 1 },
  m3: { x: 0, y: 0, groesse: 1 },
  f1: { x: 0, y: 0, groesse: 1 },
  f2: { x: 0, y: 0, groesse: 1 },
  f3: { x: 0, y: 0, groesse: 1 },
};

/** Ausschnitt eines Porträts; unbekannte IDs bekommen das ganze Bild. */
export function playerPortraitRahmen(portraitId: string): PortraitRahmen {
  return PORTRAIT_RAHMEN[portraitId] ?? { x: 0, y: 0, groesse: 1 };
}

/**
 * Inline-Styles für ein `<img>` in einem quadratischen `overflow: hidden`-Kasten.
 * Das Bild wird auf `100/groesse` % aufgezogen und so verschoben, dass genau der
 * Rahmen im Fenster steht.
 */
export function playerPortraitImgStyle(portraitId: string): {
  width: string; height: string; marginLeft: string; marginTop: string; imageRendering: 'auto';
} {
  const { x, y, groesse } = playerPortraitRahmen(portraitId);
  const skala = 100 / groesse;
  return {
    width: `${skala}%`,
    height: `${skala}%`,
    marginLeft: `${-(x / groesse) * 100}%`,
    marginTop: `${-(y / groesse) * 100}%`,
    imageRendering: 'auto',
  };
}

interface PlayerProfileState {
  name: string;
  portraitId: string;
  /** true, sobald der Spieler die Wahl bestätigt hat (Intro-Gate). */
  chosen: boolean;
  setProfile: (name: string, portraitId: string) => void;
}

const STORAGE_KEY = 'storyMode_profile';

function load(): { name: string; portraitId: string; chosen: boolean } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      return {
        name: typeof p.name === 'string' ? p.name : 'Agent',
        portraitId: normalizedPlayerPortraitId(typeof p.portraitId === 'string' ? p.portraitId : 'm2'),
        chosen: !!p.chosen,
      };
    }
  } catch {
    // Defaults unten
  }
  return { name: 'Agent', portraitId: 'm2', chosen: false };
}

const initial = load();

export const usePlayerProfile = create<PlayerProfileState>((set) => ({
  name: initial.name,
  portraitId: initial.portraitId,
  chosen: initial.chosen,
  setProfile: (name, portraitId) => {
    // T2/#10: Fallback nicht mehr „Direktor" (kollidiert mit Direktor Volkov) → neutral.
    const clean = name.trim().slice(0, 24) || 'Agent';
    const cleanPortraitId = normalizedPlayerPortraitId(portraitId);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ name: clean, portraitId: cleanPortraitId, chosen: true }));
    } catch {
      // localStorage nicht verfügbar — Wahl gilt nur für diese Sitzung.
    }
    set({ name: clean, portraitId: cleanPortraitId, chosen: true });
  },
}));

/** Asset-id des gewählten Spieler-Porträts. */
export function playerPortraitAssetId(portraitId: string): string {
  return `portrait_player_${normalizedPlayerPortraitId(portraitId)}`;
}

/** Weibliche Avatar-Wahl? Die portraitId-Konvention kodiert das Geschlecht ('f…'/'m…'). */
export function isFemaleProfile(portraitId: string): boolean {
  return portraitId.startsWith('f');
}

/** Alle sechs Profile teilen sich je ein sauber ausgerichtetes 96-px-Atlas. */
export function playerWalkSheetId(_portraitId: string): string {
  return 'player_profiles_walk';
}

export function playerIdleSheetId(_portraitId: string): string {
  return 'player_profiles_idle';
}

/** Animationszeile bleibt an die konkrete Auswahl gekoppelt, nicht nur ans Geschlecht. */
export function playerWalkAnimationId(portraitId: string): string {
  return `walk_${normalizedPlayerPortraitId(portraitId)}`;
}

export function playerIdleAnimationId(portraitId: string): string {
  return `idle_${normalizedPlayerPortraitId(portraitId)}`;
}
