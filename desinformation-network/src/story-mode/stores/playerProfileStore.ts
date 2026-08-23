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

/**
 * Deterministischer Porträt-Ausschnitt (P10, Fremdmodell-Durchgang 2026-08-22).
 *
 * Die sechs Dienstporträts sind NICHT normiert: Die Kopfhöhe reichte von 19 %
 * (m2, Ganzfigur) bis 40 % (m1, Brustbild) der Bildhöhe — Faktor 2,1 — und die
 * Augenlinien lagen zwischen 28 % und 40 %. In der Auswahl standen sie
 * nebeneinander, was den Unterschied unübersehbar machte.
 *
 * Interessant ist der Mechanismus: Die Normierung wurde schon einmal VERSUCHT und
 * lebt bis heute ausschließlich als Prompt-Satz in der Shot-Liste — „head is
 * exactly 40 percent of the image height, the eye line sits on the …". Ein
 * Bildgenerator hält so etwas nicht ein, und danach prüft es niemand nach.
 * Deshalb steht die Normierung jetzt im Code, wo sie nachprüfbar ist, statt in
 * einem Prompt, wo sie nur gewünscht war.
 *
 * Die Werte sind an den PNGs gemessen und am gerenderten Ausschnitt gegengeprüft
 * (vier Runden, zuletzt gegen die Ernte selbst), nicht geschätzt. Ziel: Augenlinie auf 40 % des Ausschnitts,
 * Kopfhöhe ~40 % — wo beides nicht gleichzeitig geht (Kopf sitzt zu hoch in der
 * Quelle), gewinnt die Augenlinie: Ein versetzter Blick fällt stärker auf als
 * eine um 5 % abweichende Kopfgröße.
 *
 * Ohne neue Assets — reiner Zuschnitt. `x`/`y`/`groesse` sind Anteile der
 * Quellkante (die Bilder sind quadratisch, 1024×1024).
 */
export interface PortraitRahmen {
  x: number;
  y: number;
  groesse: number;
}

const PORTRAIT_RAHMEN: Record<string, PortraitRahmen> = {
  m1: { x: 0.000, y: 0.000, groesse: 1.000 },
  m2: { x: 0.131, y: 0.130, groesse: 0.430 },
  m3: { x: 0.145, y: 0.001, groesse: 0.710 },
  f1: { x: 0.066, y: 0.122, groesse: 0.600 },
  f2: { x: 0.062, y: 0.043, groesse: 0.875 },
  f3: { x: 0.053, y: 0.000, groesse: 0.880 },
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
  width: string; height: string; marginLeft: string; marginTop: string; imageRendering: 'pixelated';
} {
  const { x, y, groesse } = playerPortraitRahmen(portraitId);
  const skala = 100 / groesse;
  return {
    width: `${skala}%`,
    height: `${skala}%`,
    marginLeft: `${-(x / groesse) * 100}%`,
    marginTop: `${-(y / groesse) * 100}%`,
    imageRendering: 'pixelated',
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
