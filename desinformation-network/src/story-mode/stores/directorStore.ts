/**
 * directorStore — hält den vom StoryDirector gekürten Beat (Spine Slice 2).
 *
 * Bewusst klein (wie `dayClockStore`): der `endPhase`-Pfad ruft `pickNext()` und
 * legt das Ergebnis hier ab; die UI (Morgenbriefing) liest `currentBeat`. `lastBeat`
 * speist die Anti-Wiederholung. Noch NICHT in Save/Load (Owner-Entscheidung (a) —
 * später nach Engine-State heben, falls ein gesetzter Beat einen Spielstand
 * überleben muss).
 */
import { create } from 'zustand';
import type { Beat } from '../engine/StoryDirector';

interface DirectorState {
  currentBeat: Beat | null;
  /** Der zuvor gesetzte Beat — für die Anti-Wiederholung in pickNext(). */
  lastBeat: Beat | null;
  setBeat: (beat: Beat | null) => void;
  reset: () => void;
}

export const useDirectorStore = create<DirectorState>((set) => ({
  currentBeat: null,
  lastBeat: null,
  // Neuer Beat wird current; der bisherige current rückt auf last (Anti-Wiederholung).
  setBeat: (beat) => set((s) => ({ currentBeat: beat, lastBeat: s.currentBeat })),
  reset: () => set({ currentBeat: null, lastBeat: null }),
}));
