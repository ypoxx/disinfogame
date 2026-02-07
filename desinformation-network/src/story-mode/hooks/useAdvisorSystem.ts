/**
 * useAdvisorSystem - Sub-hook for NPC advisor recommendations
 *
 * Phase 6 Strangler Fig: Extracted from useStoryGameState.ts
 * Owns: recommendations, recommendationTracking
 * Callbacks: generateRecommendations
 */

import { useState, useCallback } from 'react';
import {
  StoryEngineAdapter,
} from '../../game-logic/StoryEngineAdapter';
import { getAdvisorEngine } from '../engine/NPCAdvisorEngine';
import type { AdvisorRecommendation, WorldEventSnapshot } from '../engine/AdvisorRecommendation';
import { storyLogger } from '../../utils/logger';

// ============================================
// HOOK
// ============================================

export function useAdvisorSystem(engine: StoryEngineAdapter) {
  const [recommendations, setRecommendations] = useState<AdvisorRecommendation[]>([]);
  const [recommendationTracking, setRecommendationTracking] = useState<Map<string, {
    followed: number;
    ignored: number;
    lastFollowed?: number;
    lastIgnored?: number;
  }>>(new Map());

  // ============================================
  // SYNC (no engine sync needed - internal state)
  // ============================================

  const sync = useCallback(() => {
    // No engine sync needed for advisor system
  }, []);

  // ============================================
  // ACTIONS
  // ============================================

  const generateRecommendations = useCallback((crossHookRefs?: {
    completedActions: string[];
    worldEvents: WorldEventSnapshot[];
  }) => {
    try {
      const advisorEngine = getAdvisorEngine();
      const currentPhase = engine.getCurrentPhase();
      const currentResources = engine.getResources();
      const currentObjectives = engine.getObjectives();
      const currentNpcs = engine.getAllNPCs();
      const completedActions = crossHookRefs?.completedActions || [];
      const worldEvents = crossHookRefs?.worldEvents || [];

      const newRecommendations = advisorEngine.generateRecommendations({
        gameState: {
          storyPhase: {
            phaseNumber: currentPhase.number,
            phaseName: currentPhase.label_de,
            year: currentPhase.year,
            month: currentPhase.month,
          },
          resources: {
            budget: currentResources.budget,
            maxBudget: 1000,
            capacity: currentResources.capacity,
            maxCapacity: 100,
            risk: currentResources.risk,
            attention: currentResources.attention,
            moralWeight: currentResources.moralWeight,
          },
          npcs: currentNpcs,
          availableActions: engine.getAvailableActions(),
          completedActions: completedActions,
          newsEvents: engine.getNewsEvents(),
          worldEvents: worldEvents,
          objectives: currentObjectives.map(obj => ({
            id: obj.id,
            type: obj.type,
            currentValue: obj.currentValue,
            targetValue: obj.targetValue,
            progress: obj.progress,
            completed: obj.completed,
          })),
        },
        npc: currentNpcs[0],
        actionHistory: [],
        metricsHistory: {
          reachHistory: [],
          trustHistory: [],
          riskHistory: [],
          budgetHistory: [],
        },
        otherNPCs: currentNpcs,
        playerRelationship: 0,
      });

      setRecommendations(newRecommendations);
      storyLogger.info('Generated advisor recommendations', {
        count: newRecommendations.length,
        phase: currentPhase.number,
      });

      // DEBUG: If no recommendations, add a test one to verify UI works
      if (newRecommendations.length === 0 && currentNpcs.length > 0) {
        const testRec = {
          id: 'test_rec_' + Date.now(),
          npcId: currentNpcs[0].id,
          priority: 'high' as const,
          category: 'strategy' as const,
          message: 'TEST: Deep Integration System aktiv - Diese Empfehlung beweist dass das UI funktioniert!',
          reasoning: 'Dies ist eine Test-Empfehlung um zu zeigen dass alle Systeme integriert sind.',
          suggestedActions: [],
          phase: currentPhase.number,
          timestamp: Date.now(),
        };
        setRecommendations([testRec]);
        storyLogger.info('[DEBUG] Added test recommendation to verify UI');
      }
    } catch (error) {
      storyLogger.error('Failed to generate advisor recommendations', { error });
    }
  }, [engine]);

  // ============================================
  // RETURN
  // ============================================

  return {
    state: { recommendations, recommendationTracking },
    actions: { generateRecommendations },
    sync,
    // Exposed setters for orchestrator
    setRecommendations,
    setRecommendationTracking,
  };
}
