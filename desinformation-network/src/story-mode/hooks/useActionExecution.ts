/**
 * useActionExecution - Sub-hook for action execution and queue management
 *
 * Phase 6 Strangler Fig: Extracted from useStoryGameState.ts
 * Owns: availableActions, lastActionResult, completedActions, actionQueue,
 *       comboHints, extendedActors
 * Callbacks: executeAction, addToQueue, removeFromQueue, clearQueue,
 *            reorderQueue, executeQueue, calculateActionEffectiveness,
 *            refreshAvailableActions
 */

import { useState, useCallback } from 'react';
import {
  StoryEngineAdapter,
  StoryAction,
  ActionResult,
  NewsEvent,
} from '../../game-logic/StoryEngineAdapter';
import { playSound } from '../utils/SoundSystem';
import { getBetrayalSystem } from '../engine/BetrayalSystem';
import type { BetrayalState, BetrayalEvent, BetrayalWarning } from '../engine/BetrayalSystem';
import { storyLogger } from '../../utils/logger';
import type { TrustHistoryPoint } from '../../components/TrustEvolutionChart';
import type { ExtendedActor, ActorEffectivenessModifier } from '../engine/ExtendedActorLoader';
import type { ComboHint } from '../engine/StoryComboSystem';
import type { AdvisorRecommendation } from '../engine/AdvisorRecommendation';
import type { DialogState, QueuedAction } from './useStoryGameState';

// ============================================
// HOOK
// ============================================

export function useActionExecution(engine: StoryEngineAdapter) {
  const [availableActions, setAvailableActions] = useState<StoryAction[]>([]);
  const [lastActionResult, setLastActionResult] = useState<ActionResult | null>(null);
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  const [actionQueue, setActionQueue] = useState<QueuedAction[]>([]);
  const [comboHints, setComboHints] = useState<ComboHint[]>([]);
  const [extendedActors, setExtendedActors] = useState<ExtendedActor[]>(() =>
    engine.getExtendedActors()
  );

  // ============================================
  // SYNC
  // ============================================

  const sync = useCallback(() => {
    setAvailableActions(engine.getAvailableActions());
    const hints = engine.getActiveComboHints();
    setComboHints(hints);
    setExtendedActors(engine.getExtendedActors());
  }, [engine]);

  // ============================================
  // ACTIONS
  // ============================================

  const refreshAvailableActions = useCallback(() => {
    const actions = engine.getAvailableActions();
    setAvailableActions(actions);
  }, [engine]);

  /**
   * Execute a single action. Returns the ActionResult plus side-effect data
   * the orchestrator needs to propagate to other sub-hooks.
   */
  const executeAction = useCallback((
    actionId: string,
    options?: { targetId?: string; npcAssist?: string },
    // Cross-hook refs provided by orchestrator
    crossHookRefs?: {
      npcs: import('../../game-logic/StoryEngineAdapter').NPCState[];
      trustHistory: TrustHistoryPoint[];
      recommendations: AdvisorRecommendation[];
      betrayalStates: Map<string, BetrayalState>;
    }
  ): {
    result: ActionResult | null;
    sideEffects: {
      betrayalWarnings?: BetrayalWarning[];
      betrayalEvent?: BetrayalEvent | null;
      betrayalStates?: Map<string, BetrayalState>;
      newsEventsToAdd?: NewsEvent[];
      recommendationTracking?: Array<{ npcId: string; type: 'followed' }>;
      dialog?: DialogState | null;
      gameEnd?: import('../../game-logic/StoryEngineAdapter').GameEndState | null;
    };
  } => {
    const sideEffects: {
      betrayalWarnings?: BetrayalWarning[];
      betrayalEvent?: BetrayalEvent | null;
      betrayalStates?: Map<string, BetrayalState>;
      newsEventsToAdd?: NewsEvent[];
      recommendationTracking?: Array<{ npcId: string; type: 'followed' }>;
      dialog?: DialogState | null;
      gameEnd?: import('../../game-logic/StoryEngineAdapter').GameEndState | null;
    } = {};

    try {
      const result = engine.executeAction(actionId, options);

      // Play sound based on action result
      if (result.success) {
        const action = result.action;
        if (action.legality === 'illegal') {
          playSound('warning');
        } else {
          playSound('success');
        }
      } else {
        playSound('error');
      }

      setLastActionResult(result);

      // Get action and phase for processing
      const action = result.action;
      const currentPhase = engine.getCurrentPhase();

      // Track completed action
      if (result.success) {
        setCompletedActions(prev => [...prev, actionId]);

        // Process action through Betrayal System
        const betrayalSystem = getBetrayalSystem();

        if (action.costs?.moralWeight && action.costs.moralWeight > 0) {
          const betrayalResult = betrayalSystem.processAction(
            actionId,
            action.tags || [],
            action.costs.moralWeight,
            currentPhase.number
          );

          if (betrayalResult.warnings.length > 0) {
            sideEffects.betrayalWarnings = betrayalResult.warnings;
          }

          const atRisk = betrayalSystem.getNPCsAtRisk();
          if (atRisk.length > 0) {
            storyLogger.info(`NPCs at betrayal risk: ${atRisk.join(', ')}`);
          }

          // Check if betrayal threshold reached
          const updatedNpcs = engine.getAllNPCs();
          for (const npc of updatedNpcs) {
            const risk = betrayalSystem.getBetrayalRisk(npc.id);
            if (risk && risk.risk > 85 && risk.warningLevel >= 4) {
              const betrayalEvent = betrayalSystem.checkBetrayalTrigger(
                npc.id,
                npc.name,
                currentPhase.number
              );
              if (betrayalEvent) {
                sideEffects.betrayalEvent = betrayalEvent;
                storyLogger.warn(`BETRAYAL: ${npc.name} has betrayed the operation!`);
                break;
              }
            }
          }

          // Update betrayal states for UI
          const newBetrayalStates = new Map<string, BetrayalState>();
          updatedNpcs.forEach(npc => {
            const risk = betrayalSystem.getBetrayalRisk(npc.id);
            if (risk) {
              const state: BetrayalState = {
                npcId: npc.id,
                warningLevel: risk.warningLevel,
                warningsShown: [],
                betrayalRisk: risk.risk,
                personalRedLines: [],
                recentMoralActions: [],
                lastWarningPhase: currentPhase.number,
                grievances: risk.grievances,
                recoveryActions: [],
              };
              newBetrayalStates.set(npc.id, state);
            }
          });
          sideEffects.betrayalStates = newBetrayalStates;
        }

        // Track recommendation follow/ignore
        const recommendations = crossHookRefs?.recommendations || [];
        const actionWasRecommended = recommendations.some(rec =>
          rec.suggestedActions.includes(actionId)
        );

        if (actionWasRecommended) {
          const recommendingNpcs = recommendations
            .filter(rec => rec.suggestedActions.includes(actionId))
            .map(rec => rec.npcId);

          sideEffects.recommendationTracking = recommendingNpcs.map(npcId => ({
            npcId,
            type: 'followed' as const,
          }));

          storyLogger.info(`[RECOMMENDATION] Player followed advice from: ${recommendingNpcs.join(', ')}`);
        }
      }

      // Check Defensive AI triggers
      if (result.success) {
        const actors = engine.getExtendedActors();
        const trustHistory = crossHookRefs?.trustHistory || [];
        const currentPhase = engine.getCurrentPhase();
        const previousAverageTrust = trustHistory.length > 0
          ? trustHistory[trustHistory.length - 1].averageTrust
          : 1.0;

        const currentAverageTrust = actors.reduce((sum, a) =>
          sum + (a.currentTrust ?? a.baseTrust), 0) / actors.length;
        const averageTrustDrop = previousAverageTrust - currentAverageTrust;

        if (averageTrustDrop > 0.1) {
          const defensiveActors = actors.filter(a =>
            a.behavior?.type === 'defensive' || a.behavior?.type === 'vigilant'
          );

          const newsEventsToAdd: NewsEvent[] = [];

          defensiveActors.forEach(actor => {
            const threshold = actor.behavior?.triggerThreshold || 0.5;
            const reactionProb = actor.behavior?.reactionProbability || 0.3;

            if (averageTrustDrop >= threshold && Math.random() < reactionProb) {
              const counterActions = [
                'Fact-Check-Initiative gestartet',
                'Verstärkte Moderation angekündigt',
                'Algorithmus-Anpassung durchgeführt',
                'Transparenz-Bericht veröffentlicht',
              ];

              const counterAction = counterActions[Math.floor(Math.random() * counterActions.length)];

              storyLogger.info(`[DEFENSIVE AI] ${actor.name} reagiert: ${counterAction}`);

              newsEventsToAdd.push({
                id: `defensive_${Date.now()}_${actor.id}`,
                type: 'world_event',
                phase: currentPhase.number,
                headline_de: `\u{1F6E1}\uFE0F ${actor.name}: ${counterAction}`,
                headline_en: `\u{1F6E1}\uFE0F ${actor.name}: ${counterAction}`,
                description_de: `Als Reaktion auf verdächtige Aktivitäten hat ${actor.name} Gegenmaßnahmen eingeleitet.`,
                description_en: `In response to suspicious activity, ${actor.name} has initiated countermeasures.`,
                severity: 'danger',
                read: false,
                pinned: false,
              });
            }
          });

          if (newsEventsToAdd.length > 0) {
            sideEffects.newsEventsToAdd = newsEventsToAdd;
          }
        }
      }

      // Refresh available actions
      refreshAvailableActions();

      // Show result dialog if there are NPC reactions
      const npcs = crossHookRefs?.npcs || [];
      if (result.npcReactions && result.npcReactions.length > 0) {
        const reaction = result.npcReactions[0];
        const npc = npcs.find(n => n.id === reaction.npcId);

        sideEffects.dialog = {
          speaker: npc?.name || reaction.npcId,
          speakerTitle: npc?.role_de,
          text: reaction.dialogue_de,
          mood: reaction.reaction === 'crisis' ? 'angry' :
                reaction.reaction === 'negative' ? 'worried' :
                reaction.reaction === 'positive' ? 'happy' : 'neutral',
        };
      }

      // Update combo hints
      const activeHints = engine.getActiveComboHints();
      setComboHints(activeHints);

      // Check game end conditions
      const endState = engine.checkGameEnd();
      if (endState) {
        sideEffects.gameEnd = endState;
      }

      return { result, sideEffects };
    } catch (error) {
      storyLogger.error('Action execution failed:', error);
      return { result: null, sideEffects };
    }
  }, [engine, refreshAvailableActions]);

  // ============================================
  // ACTION QUEUE MANAGEMENT
  // ============================================

  const addToQueue = useCallback((actionId: string, options?: {
    targetId?: string;
    npcAssist?: string;
  }) => {
    const action = availableActions.find(a => a.id === actionId);
    if (!action) {
      storyLogger.warn('Action not found:', actionId);
      return;
    }

    const queuedAction: QueuedAction = {
      id: `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      actionId: action.id,
      label: action.label_de || action.label_en || actionId,
      costs: {
        budget: action.costs.budget,
        capacity: action.costs.capacity,
        actionPoints: 1,
      },
      legality: action.legality,
      options,
    };

    setActionQueue(prev => [...prev, queuedAction]);
    playSound('click');
  }, [availableActions]);

  const removeFromQueue = useCallback((queueItemId: string) => {
    setActionQueue(prev => prev.filter(item => item.id !== queueItemId));
    playSound('click');
  }, []);

  const clearQueue = useCallback(() => {
    setActionQueue([]);
    playSound('click');
  }, []);

  const reorderQueue = useCallback((oldIndex: number, newIndex: number) => {
    setActionQueue(prev => {
      const newQueue = [...prev];
      const [removed] = newQueue.splice(oldIndex, 1);
      newQueue.splice(newIndex, 0, removed);
      return newQueue;
    });
  }, []);

  const calculateActionEffectiveness = useCallback((actionId: string): ActorEffectivenessModifier[] => {
    const action = availableActions.find(a => a.id === actionId);
    if (!action) return [];

    const modifiers = engine.previewActionEffectiveness(action.tags);
    return modifiers;
  }, [engine, availableActions]);

  // ============================================
  // RETURN
  // ============================================

  return {
    state: {
      availableActions,
      lastActionResult,
      completedActions,
      actionQueue,
      comboHints,
      extendedActors,
    },
    actions: {
      executeAction,
      addToQueue,
      removeFromQueue,
      clearQueue,
      reorderQueue,
      calculateActionEffectiveness,
      refreshAvailableActions,
    },
    sync,
    // Exposed setters for orchestrator
    setAvailableActions,
    setLastActionResult,
    setCompletedActions,
    setActionQueue,
    setComboHints,
    setExtendedActors,
  };
}
