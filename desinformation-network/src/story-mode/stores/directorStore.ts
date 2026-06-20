/**
 * directorStore — hält den vom StoryDirector gekürten Beat (Spine Slice 2) und den
 * noch offenen Entscheidungs-Beat (Slice 4).
 *
 * Bewusst klein (wie `dayClockStore`): der `endPhase`-Pfad ruft `pickNext()` und legt
 * das Ergebnis hier ab; die UI (Morgenbriefing) liest `currentBeat`. `lastBeat` speist
 * die Anti-Wiederholung. `pendingDecisionBeatId` merkt sich, dass ein gekürter
 * Entscheidungs-Beat noch präsentiert/aufgelöst werden muss (überlebt die Beat-Rotation,
 * bis der Spieler entschieden hat). Noch NICHT in Save/Load (Owner-Entscheidung (a)).
 */
import { create } from 'zustand';
import type { Beat } from '../engine/StoryDirector';

interface DirectorState {
  currentBeat: Beat | null;
  /** Der zuvor gesetzte Beat — für die Anti-Wiederholung in pickNext(). */
  lastBeat: Beat | null;
  /** Offener Entscheidungs-Beat (DecisionBeat-Id), den die UI noch präsentieren muss. */
  pendingDecisionBeatId: string | null;
  setBeat: (beat: Beat | null) => void;
  clearPendingDecision: () => void;
  reset: () => void;
}

export const useDirectorStore = create<DirectorState>((set) => ({
  currentBeat: null,
  lastBeat: null,
  pendingDecisionBeatId: null,
  // Neuer Beat wird current; der bisherige current rückt auf last (Anti-Wiederholung).
  // Ein Entscheidungs-Beat hinterlässt zusätzlich eine offene Präsentation; andere Beats
  // lassen eine bereits offene Entscheidung unangetastet (sie soll nicht verloren gehen).
  setBeat: (beat) =>
    set((s) => ({
      currentBeat: beat,
      lastBeat: s.currentBeat,
      pendingDecisionBeatId:
        beat?.typ === 'entscheidung' && beat.decisionBeatId
          ? beat.decisionBeatId
          : s.pendingDecisionBeatId,
    })),
  clearPendingDecision: () => set({ pendingDecisionBeatId: null }),
  reset: () => set({ currentBeat: null, lastBeat: null, pendingDecisionBeatId: null }),
}));
