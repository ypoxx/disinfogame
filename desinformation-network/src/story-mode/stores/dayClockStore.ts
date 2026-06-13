import { create } from 'zustand';

// ============================================
// TAGES-UHR (K1) — Ereignis-Uhr, kein Echtzeit-Ticken
// ============================================
// Eine Phase (= Monat) wird als ein Arbeitstag inszeniert: 09:00–18:00.
// Die Uhr läuft NICHT von selbst — sie springt durch Handlungen vor
// (advance()). Pure Zustand-Logik ohne Seiteneffekte, voll testbar.

/** Tagesbeginn (Stunde) — 09:00 = minutes 0. */
export const DAY_START_HOUR = 9;
/** Redaktionsschluss (Stunde) — bei oder nach 18:00 ist der Tag vorbei. */
export const DAY_END_HOUR = 18;
/** Ab dieser Stunde mahnt die HUD-Anzeige (17:00). */
export const WARN_HOUR = 17;

/** Spielminuten je Handlungsart (MadTV-Zeitökonomie, s. NEXT_LEVEL_PLAN §K1). */
export const TIME_COST = {
  action: 90, // Aktion ausführen ≈ 1,5 h
  dialog: 30, // NPC-Gespräch ≈ 30 min
  walkPerFloor: 10, // Etagenwechsel zu Fuß ≈ 10 min
  elevatorPerFloor: 5, // Fahrstuhl ≈ 5 min/Etage
  doorway: 2, // Tür/Raum betreten ≈ 2 min
} as const;

/** Minuten von 09:00 bis 18:00 — Klemm-Obergrenze. */
const DAY_LENGTH_MIN = (DAY_END_HOUR - DAY_START_HOUR) * 60;

// ============================================
// HELPER / SELEKTOREN (pure)
// ============================================

/** Minuten seit 09:00 → "HH:MM" (09:00-basiert). Klemmt bei 18:00. */
export function clockLabel(minutes: number): string {
  const clamped = Math.max(0, Math.min(minutes, DAY_LENGTH_MIN));
  const total = DAY_START_HOUR * 60 + clamped;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** True ab 17:00 (Redaktionsschluss-Mahnung). */
export function isAfterWarn(minutes: number): boolean {
  return DAY_START_HOUR * 60 + minutes >= WARN_HOUR * 60;
}

// ============================================
// STORE
// ============================================

interface DayClockState {
  /** Minuten seit 09:00 (Start 0). Klemmt bei DAY_LENGTH_MIN. */
  minutes: number;
  /** Tag vorbei (>= 18:00 erreicht)? */
  dayEnded: boolean;
  /** Uhr vorspringen lassen; klemmt bei Tagesende und setzt dayEnded. */
  advance: (minutes: number) => void;
  /** Neuen Tag starten (09:00, nicht beendet). */
  resetDay: () => void;
}

export const useDayClockStore = create<DayClockState>((set) => ({
  minutes: 0,
  dayEnded: false,
  advance: (delta) =>
    set((state) => {
      // Negative Werte ignorieren — die Uhr läuft nur vorwärts.
      const next = Math.min(state.minutes + Math.max(0, delta), DAY_LENGTH_MIN);
      return { minutes: next, dayEnded: next >= DAY_LENGTH_MIN };
    }),
  resetDay: () => set({ minutes: 0, dayEnded: false }),
}));
