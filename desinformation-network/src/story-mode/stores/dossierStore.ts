/**
 * dossierStore — hält die über Runden gesammelten Fokusgruppen-Befunde (Erkenntnis-Dossier).
 *
 * Bewusst klein (wie `directorStore`): die Fokusgruppe ruft `record()` mit den neuen
 * Sweet Spots, die UI liest `findings` und leitet daraus die Kampagnen-Arcs ab.
 * `startGame` ruft `reset()`. Noch NICHT in Save/Load (wie directorStore).
 */
import { create } from 'zustand';
import { mergeFindings, type Erkenntnis } from '../audience/dossierModel';

interface DossierState {
  findings: Erkenntnis[];
  /** Neue Befunde einer Befragung einmischen (dedupe über Runden). */
  record: (incoming: Erkenntnis[]) => void;
  reset: () => void;
}

export const useDossierStore = create<DossierState>((set) => ({
  findings: [],
  record: (incoming) => set((s) => ({ findings: mergeFindings(s.findings, incoming) })),
  reset: () => set({ findings: [] }),
}));
