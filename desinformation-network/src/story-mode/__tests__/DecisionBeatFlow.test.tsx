/**
 * Integrations-Naht (Spine Slice 4): der ECHTE Spiel-Loop löst die Modal-Präsentation
 * aus. `endPhase` lässt den Director laufen → bei einem Entscheidungs-Beat setzt der
 * directorStore `pendingDecisionBeatId`, was in StoryModeGame das DecisionBeatModal
 * rendert. Math.random→0 ⇒ der gewichtete Zug kürt den schwersten Beat = Entscheidung.
 * Zusammen mit DecisionBeatModal.test.tsx (rendert das Modal) ist der Pfad geschlossen.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStoryGameState } from '../hooks/useStoryGameState';
import { useDirectorStore } from '../stores/directorStore';
import { getDecisionBeat } from '../engine/DecisionBeats';
import { getCrisisMomentSystem } from '../engine/CrisisMomentSystem';

describe('Decision-Beat-Flow (Integration über den echten Hook)', () => {
  beforeEach(() => useDirectorStore.getState().reset());
  afterEach(() => { vi.restoreAllMocks(); useDirectorStore.getState().reset(); });

  it('endPhase kürt einen Entscheidungs-Beat und öffnet die Präsentation (pendingDecisionBeatId)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // schwerster Pool-Beat = Entscheidung (Gewicht 8)
    // Deterministisch: eine (Date.now-geseedete) Krise hätte Vorfahrt und würde den
    // Entscheidungs-Beat verdrängen. Krisen-Singleton (dieselbe Instanz wie im Hook)
    // neutralisieren → der erste endPhase kürt garantiert den Entscheidungs-Beat.
    const crisis = getCrisisMomentSystem();
    vi.spyOn(crisis, 'getMostUrgentCrisis').mockReturnValue(null);
    vi.spyOn(crisis, 'checkForCrises').mockReturnValue([]);

    const { result } = renderHook(() => useStoryGameState());
    act(() => { result.current.startGame(); });
    act(() => { result.current.chooseAuftrag('keil'); });
    act(() => { result.current.endPhase(); });

    const pending = useDirectorStore.getState().pendingDecisionBeatId;
    expect(pending, 'endPhase muss eine offene Entscheidung setzen').toBeTruthy();
    const beat = getDecisionBeat(pending!);
    expect(beat).toBeTruthy();
    expect(useDirectorStore.getState().currentBeat?.typ).toBe('entscheidung');

    // Auflösen über den Hook-Handler räumt die Präsentation wieder ab.
    act(() => { result.current.handleDecisionBeatChoice(pending!, beat!.optionen[0].id); });
    act(() => { result.current.closeDecisionBeat(); });
    expect(useDirectorStore.getState().pendingDecisionBeatId).toBeNull();
  });
});
