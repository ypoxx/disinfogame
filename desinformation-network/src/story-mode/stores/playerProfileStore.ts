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
        portraitId: typeof p.portraitId === 'string' ? p.portraitId : 'm2',
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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ name: clean, portraitId, chosen: true }));
    } catch {
      // localStorage nicht verfügbar — Wahl gilt nur für diese Sitzung.
    }
    set({ name: clean, portraitId, chosen: true });
  },
}));

/** Asset-id des gewählten Spieler-Porträts. */
export function playerPortraitAssetId(portraitId: string): string {
  return `portrait_player_${portraitId}`;
}

/** Weibliche Avatar-Wahl? Die portraitId-Konvention kodiert das Geschlecht ('f…'/'m…'). */
export function isFemaleProfile(portraitId: string): boolean {
  return portraitId.startsWith('f');
}

/** Lauf-Sheet je nach gewähltem Avatar-Geschlecht (P2-9). */
export function playerWalkSheetId(portraitId: string): string {
  return isFemaleProfile(portraitId) ? 'player_walk_f' : 'player_walk';
}

/** Idle-Sheet je nach gewähltem Avatar-Geschlecht (P2-9). */
export function playerIdleSheetId(portraitId: string): string {
  return isFemaleProfile(portraitId) ? 'player_idle_f' : 'player_idle';
}
