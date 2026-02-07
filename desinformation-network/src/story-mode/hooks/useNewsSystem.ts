/**
 * useNewsSystem - Sub-hook for news events, objectives, and consequence management
 *
 * Phase 6 Strangler Fig: Extracted from useStoryGameState.ts
 * Owns: newsEvents, objectives, activeConsequence
 * Callbacks: markNewsAsRead, toggleNewsPinned, handleConsequenceChoice
 */

import { useState, useCallback, useMemo } from 'react';
import {
  StoryEngineAdapter,
  NewsEvent,
  Objective,
  ActiveConsequence,
} from '../../game-logic/StoryEngineAdapter';
import type { GamePhase } from './useStoryGameState';

// ============================================
// HOOK
// ============================================

export function useNewsSystem(engine: StoryEngineAdapter) {
  const [newsEvents, setNewsEvents] = useState<NewsEvent[]>(engine.getNewsEvents());
  const [objectives, setObjectives] = useState<Objective[]>(engine.getObjectives());
  const [activeConsequence, setActiveConsequence] = useState<ActiveConsequence | null>(null);

  // ============================================
  // DERIVED STATE
  // ============================================

  const unreadNewsCount = useMemo(
    () => newsEvents.filter(e => !e.read).length,
    [newsEvents]
  );

  // ============================================
  // SYNC
  // ============================================

  const sync = useCallback(() => {
    setNewsEvents(engine.getNewsEvents());
    setObjectives(engine.getObjectives());
  }, [engine]);

  // ============================================
  // ACTIONS
  // ============================================

  const markNewsAsRead = useCallback((newsId: string) => {
    setNewsEvents(prev =>
      prev.map(e => e.id === newsId ? { ...e, read: true } : e)
    );
  }, []);

  const toggleNewsPinned = useCallback((newsId: string) => {
    setNewsEvents(prev =>
      prev.map(e => e.id === newsId ? { ...e, pinned: !e.pinned } : e)
    );
  }, []);

  /**
   * Handle a consequence choice. Returns side-effect data that the orchestrator
   * needs to propagate (gamePhase change, potential game end).
   */
  const handleConsequenceChoice = useCallback((choiceId: string): {
    gamePhase: GamePhase;
    gameEnd?: import('../../game-logic/StoryEngineAdapter').GameEndState;
  } | null => {
    if (!activeConsequence) return null;

    engine.handleConsequenceChoice(choiceId);

    setActiveConsequence(null);

    // Check game end
    const endState = engine.checkGameEnd();
    if (endState) {
      return { gamePhase: 'ended', gameEnd: endState };
    }

    return { gamePhase: 'playing' };
  }, [engine, activeConsequence]);

  // ============================================
  // RETURN
  // ============================================

  return {
    state: { newsEvents, objectives, activeConsequence, unreadNewsCount },
    actions: {
      markNewsAsRead,
      toggleNewsPinned,
      handleConsequenceChoice,
    },
    sync,
    // Exposed setters for orchestrator
    setNewsEvents,
    setObjectives,
    setActiveConsequence,
  };
}
