/**
 * usePhaseManagement - Sub-hook for game phase/turn management
 *
 * Phase 6 Strangler Fig: Extracted from useStoryGameState.ts
 * Owns: storyPhase, resources, worldEvents, trustHistory
 * Callbacks: endPhase
 */

import { useState, useCallback } from 'react';
import {
  StoryEngineAdapter,
  StoryPhase,
  StoryResources,
} from '../../game-logic/StoryEngineAdapter';
import { playSound } from '../utils/SoundSystem';
import { getCrisisMomentSystem } from '../engine/CrisisMomentSystem';
import type { ActiveCrisis } from '../engine/CrisisMomentSystem';
import { storyLogger } from '../../utils/logger';
import type { TrustHistoryPoint } from '../../components/TrustEvolutionChart';
import type { WorldEventSnapshot } from '../engine/AdvisorRecommendation';
import type { AdvisorRecommendation } from '../engine/AdvisorRecommendation';
import type { ExtendedActor } from '../engine/ExtendedActorLoader';
import type { GamePhase } from './useStoryGameState';

// ============================================
// HOOK
// ============================================

export function usePhaseManagement(engine: StoryEngineAdapter) {
  const [storyPhase, setStoryPhase] = useState<StoryPhase>(engine.getCurrentPhase());
  const [resources, setResources] = useState<StoryResources>(engine.getResources());
  const [worldEvents, setWorldEvents] = useState<WorldEventSnapshot[]>([]);
  const [trustHistory, setTrustHistory] = useState<TrustHistoryPoint[]>(() => {
    // Initialize with starting trust values
    const actors = engine.getExtendedActors();
    const actorTrust: Record<string, number> = {};
    let totalTrust = 0;

    actors.forEach(actor => {
      const trust = actor.currentTrust ?? actor.baseTrust;
      actorTrust[actor.id] = trust;
      totalTrust += trust;
    });

    return [{
      round: 0,
      actorTrust,
      averageTrust: actors.length > 0 ? totalTrust / actors.length : 1,
    }];
  });

  // ============================================
  // SYNC
  // ============================================

  const sync = useCallback(() => {
    setStoryPhase(engine.getCurrentPhase());
    setResources(engine.getResources());
  }, [engine]);

  // ============================================
  // ACTIONS
  // ============================================

  /**
   * End the current phase. Returns side-effect data that the orchestrator
   * needs to propagate to other sub-hooks.
   */
  const endPhase = useCallback((crossHookRefs: {
    completedActions: string[];
    recommendations: AdvisorRecommendation[];
  }): {
    result: ReturnType<StoryEngineAdapter['advancePhase']>;
    sideEffects: {
      recommendationIgnores: Array<{ npcId: string; phaseNumber: number }>;
      extendedActors: ExtendedActor[];
      trustHistoryPoint: TrustHistoryPoint;
      crisis?: ActiveCrisis;
      gameEnd?: import('../../game-logic/StoryEngineAdapter').GameEndState;
      gamePhase?: GamePhase;
    };
  } => {
    const result = engine.advancePhase();
    playSound('phaseEnd');

    // Update own state
    setStoryPhase(result.newPhase);
    setResources(engine.getResources());

    // Track ignored recommendations
    const recommendationIgnores: Array<{ npcId: string; phaseNumber: number }> = [];
    const { completedActions, recommendations } = crossHookRefs;

    if (recommendations.length > 0) {
      recommendations.forEach(rec => {
        if (rec.priority === 'critical' || rec.priority === 'high') {
          const wasFollowed = rec.suggestedActions.some(actionId =>
            completedActions.includes(actionId)
          );

          if (!wasFollowed) {
            recommendationIgnores.push({
              npcId: rec.npcId,
              phaseNumber: result.newPhase.number,
            });
            storyLogger.info(`[RECOMMENDATION] Player ignored ${rec.priority} advice from ${rec.npcId}`);
          }
        }
      });
    }

    // Track trust evolution
    const actors = engine.getExtendedActors();
    const actorTrust: Record<string, number> = {};
    let totalTrust = 0;
    actors.forEach(actor => {
      const trust = actor.currentTrust ?? actor.baseTrust;
      actorTrust[actor.id] = trust;
      totalTrust += trust;
    });

    const latestNews = engine.getNewsEvents().slice(-1)[0];
    const event = latestNews ? {
      type: latestNews.type,
      description: latestNews.headline_de,
    } : undefined;

    const trustHistoryPoint: TrustHistoryPoint = {
      round: result.newPhase.month + (result.newPhase.year - 2024) * 12,
      actorTrust,
      averageTrust: actors.length > 0 ? totalTrust / actors.length : 1,
      event,
    };

    setTrustHistory(prev => [...prev, trustHistoryPoint]);

    // Build sideEffects
    const sideEffects: {
      recommendationIgnores: Array<{ npcId: string; phaseNumber: number }>;
      extendedActors: ExtendedActor[];
      trustHistoryPoint: TrustHistoryPoint;
      crisis?: ActiveCrisis;
      gameEnd?: import('../../game-logic/StoryEngineAdapter').GameEndState;
      gamePhase?: GamePhase;
    } = {
      recommendationIgnores,
      extendedActors: actors,
      trustHistoryPoint,
    };

    // Check Crisis System
    const crisisSystem = getCrisisMomentSystem();
    const currentResources = engine.getResources();
    const currentPhase = result.newPhase.number;

    crisisSystem.cleanupExpiredCrises(currentPhase);

    const triggeredCrises = crisisSystem.checkForCrises({
      phase: currentPhase,
      risk: currentResources.risk,
      attention: currentResources.attention,
      actionCount: completedActions.length,
      lowTrustActors: actors.filter(a => (a.currentTrust ?? a.baseTrust) < 30).length,
    });

    if (triggeredCrises.length > 0) {
      const mostUrgent = crisisSystem.getMostUrgentCrisis();
      if (mostUrgent) {
        playSound('warning');
        sideEffects.crisis = mostUrgent;
        storyLogger.log(`[CRISIS] Triggered: ${mostUrgent.crisis.name_en}`);
      }
    }

    // Check for game end
    const endState = engine.checkGameEnd();
    if (endState) {
      playSound(endState.type === 'victory' ? 'success' : 'error');
      sideEffects.gameEnd = endState;
      sideEffects.gamePhase = 'ended';
    }

    return { result, sideEffects };
  }, [engine]);

  // ============================================
  // RETURN
  // ============================================

  return {
    state: { storyPhase, resources, worldEvents, trustHistory },
    actions: { endPhase },
    sync,
    // Exposed setters for orchestrator
    setStoryPhase,
    setResources,
    setWorldEvents,
    setTrustHistory,
  };
}
