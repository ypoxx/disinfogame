/**
 * directorStore (Spine Slice 2/4): hält den gekürten Beat und — bei einem
 * Entscheidungs-Beat — die offene Präsentation (`pendingDecisionBeatId`), die das
 * DecisionBeatModal in StoryModeGame auslöst. Schließt die Naht pickNext → Store → UI.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { useDirectorStore } from '../stores/directorStore';
import type { Beat } from '../engine/StoryDirector';

const entscheidung: Beat = {
  id: 'entscheidung_stadtrat',
  typ: 'entscheidung',
  quelleId: 'stadtrat',
  vorgriffZeile_de: 'Marina: …',
  decisionBeatId: 'stadtrat',
};
const stups: Beat = { id: 'stups_marina', typ: 'stups', quelleId: 'marina', vorgriffZeile_de: '…' };

describe('directorStore', () => {
  beforeEach(() => useDirectorStore.getState().reset());

  it('ein Entscheidungs-Beat setzt die offene Präsentation (pendingDecisionBeatId)', () => {
    useDirectorStore.getState().setBeat(entscheidung);
    const s = useDirectorStore.getState();
    expect(s.currentBeat).toBe(entscheidung);
    expect(s.pendingDecisionBeatId).toBe('stadtrat');
  });

  it('ein Nicht-Entscheidungs-Beat lässt eine offene Präsentation bestehen (geht nicht verloren)', () => {
    useDirectorStore.getState().setBeat(entscheidung); // pending = stadtrat
    useDirectorStore.getState().setBeat(stups);        // rotiert current→last, pending bleibt
    const s = useDirectorStore.getState();
    expect(s.currentBeat).toBe(stups);
    expect(s.lastBeat).toBe(entscheidung);
    expect(s.pendingDecisionBeatId).toBe('stadtrat');
  });

  it('clearPendingDecision schließt die Präsentation (nach der Wahl)', () => {
    useDirectorStore.getState().setBeat(entscheidung);
    useDirectorStore.getState().clearPendingDecision();
    expect(useDirectorStore.getState().pendingDecisionBeatId).toBeNull();
  });

  it('reset löscht alles (Spielneustart)', () => {
    useDirectorStore.getState().setBeat(entscheidung);
    useDirectorStore.getState().reset();
    const s = useDirectorStore.getState();
    expect(s.currentBeat).toBeNull();
    expect(s.lastBeat).toBeNull();
    expect(s.pendingDecisionBeatId).toBeNull();
  });
});
