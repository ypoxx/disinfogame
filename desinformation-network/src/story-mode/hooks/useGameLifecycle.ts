/**
 * useGameLifecycle - Sub-hook for game lifecycle management
 *
 * Phase 6 Strangler Fig: Extracted from useStoryGameState.ts
 * Owns: gamePhase, gameEnd
 * Callbacks: startGame, skipTutorial, pauseGame, resumeGame, resetGame,
 *            saveGame, loadGame, hasSaveGame, deleteSaveGame
 */

import { useState, useCallback } from 'react';
import {
  StoryEngineAdapter,
  createStoryEngine,
  GameEndState,
} from '../../game-logic/StoryEngineAdapter';
import { playSound } from '../utils/SoundSystem';
import { storyLogger } from '../../utils/logger';

import type { GamePhase } from './useStoryGameState';

// ============================================
// HOOK
// ============================================

export function useGameLifecycle(engine: StoryEngineAdapter) {
  const [gamePhase, setGamePhase] = useState<GamePhase>('intro');
  const [gameEnd, setGameEnd] = useState<GameEndState | null>(null);

  // ============================================
  // SYNC
  // ============================================

  const sync = useCallback(() => {
    // gamePhase is UI state, no engine sync needed
    // gameEnd reads from engine
    const endState = engine.checkGameEnd();
    if (endState) {
      setGameEnd(endState);
    }
  }, [engine]);

  // ============================================
  // ACTIONS
  // ============================================

  const startGame = useCallback(() => {
    setGamePhase('tutorial');
    playSound('notification');
  }, []);

  const skipTutorial = useCallback(() => {
    setGamePhase('playing');
  }, []);

  const pauseGame = useCallback(() => {
    setGamePhase(prev => prev === 'playing' ? 'paused' : prev);
  }, []);

  const resumeGame = useCallback(() => {
    setGamePhase(prev => prev === 'paused' ? 'playing' : prev);
  }, []);

  const resetGame = useCallback((): StoryEngineAdapter => {
    const newEngine = createStoryEngine();
    setGamePhase('intro');
    setGameEnd(null);
    return newEngine;
  }, []);

  const saveGame = useCallback(() => {
    const savedState = engine.saveState();
    localStorage.setItem('storyMode_save', savedState);
    localStorage.setItem('storyMode_save_timestamp', new Date().toISOString());
    return true;
  }, [engine]);

  const loadGame = useCallback((): boolean => {
    const savedState = localStorage.getItem('storyMode_save');
    if (!savedState) return false;

    try {
      engine.loadState(savedState);
      setGamePhase('playing');
      return true;
    } catch (error) {
      storyLogger.error('Failed to load save:', error);
      return false;
    }
  }, [engine]);

  const hasSaveGame = useCallback(() => {
    return localStorage.getItem('storyMode_save') !== null;
  }, []);

  const deleteSaveGame = useCallback(() => {
    localStorage.removeItem('storyMode_save');
    localStorage.removeItem('storyMode_save_timestamp');
  }, []);

  // ============================================
  // RETURN
  // ============================================

  return {
    state: { gamePhase, gameEnd },
    actions: {
      startGame,
      skipTutorial,
      pauseGame,
      resumeGame,
      resetGame,
      saveGame,
      loadGame,
      hasSaveGame,
      deleteSaveGame,
    },
    sync,
    // Exposed setters for orchestrator cross-hook state updates
    setGamePhase,
    setGameEnd,
  };
}
