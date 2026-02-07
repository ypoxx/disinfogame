/**
 * useStoryGameState - Orchestrator hook (Phase 6 Strangler Fig)
 *
 * Composes 7 sub-hooks while maintaining the EXACT same public interface.
 * All state + callbacks are delegated to focused sub-hooks.
 * Cross-cutting mutations are coordinated via syncAll() and explicit
 * side-effect propagation.
 *
 * Sub-hooks:
 *  1. useGameLifecycle   - gamePhase, gameEnd, save/load/reset
 *  2. useActionExecution  - actions, queue, combos, actors
 *  3. usePhaseManagement  - storyPhase, resources, trust history
 *  4. useNPCInteraction   - npcs, dialog
 *  5. useBetrayalCrisis   - betrayal + crisis systems
 *  6. useNewsSystem       - news, objectives, consequences
 *  7. useAdvisorSystem    - recommendations, tracking
 */

import { useState, useCallback, useMemo } from 'react';
import {
  StoryEngineAdapter,
  createStoryEngine,
  StoryPhase,
  StoryResources,
  StoryAction,
  ActionResult,
  NPCState,
  NewsEvent,
  Objective,
  ActiveConsequence,
  GameEndState,
} from '../../game-logic/StoryEngineAdapter';
import { playSound } from '../utils/SoundSystem';
import { getBetrayalSystem } from '../engine/BetrayalSystem';
import type { BetrayalState, BetrayalEvent, BetrayalWarning, BetrayalGrievance } from '../engine/BetrayalSystem';
import type { ActiveCrisis, CrisisResolution } from '../engine/CrisisMomentSystem';
import { storyLogger } from '../../utils/logger';
import type { AdvisorRecommendation, WorldEventSnapshot } from '../engine/AdvisorRecommendation';
import type { TrustHistoryPoint } from '../../components/TrustEvolutionChart';
import type { ExtendedActor, ActorEffectivenessModifier } from '../engine/ExtendedActorLoader';

// Sub-hooks
import { useGameLifecycle } from './useGameLifecycle';
import { useActionExecution } from './useActionExecution';
import { usePhaseManagement } from './usePhaseManagement';
import { useNPCInteraction } from './useNPCInteraction';
import { useBetrayalCrisis } from './useBetrayalCrisis';
import { useNewsSystem } from './useNewsSystem';
import { useAdvisorSystem } from './useAdvisorSystem';

// ============================================
// TYPES (public - re-exported for consumers)
// ============================================

export type GamePhase = 'intro' | 'tutorial' | 'playing' | 'consequence' | 'paused' | 'ended';

// ============================================
// ACTION QUEUE
// ============================================

export interface QueuedAction {
  id: string; // unique queue item id (timestamp-based)
  actionId: string; // the story action to execute
  label: string; // action label for display
  costs: {
    budget?: number;
    capacity?: number;
    actionPoints?: number;
  };
  legality: 'legal' | 'grey' | 'illegal';
  options?: {
    targetId?: string;
    npcAssist?: string;
  };
}

export interface StoryGameState {
  // Engine
  engine: StoryEngineAdapter;

  // UI State
  gamePhase: GamePhase;
  storyPhase: StoryPhase;
  resources: StoryResources;

  // NPCs
  npcs: NPCState[];
  activeNpcId: string | null;

  // Actions
  availableActions: StoryAction[];
  lastActionResult: ActionResult | null;
  completedActions: string[]; // Track completed action IDs for history

  // News & Events
  newsEvents: NewsEvent[];
  worldEvents: WorldEventSnapshot[]; // World-scale events for crisis system
  unreadNewsCount: number;

  // Objectives
  objectives: Objective[];

  // Consequences
  activeConsequence: ActiveConsequence | null;

  // Game End
  gameEnd: GameEndState | null;

  // Dialog
  currentDialog: DialogState | null;

  // Advisor System
  recommendations: AdvisorRecommendation[];

  // Action Queue
  actionQueue: QueuedAction[];

  // Trust Evolution Tracking
  trustHistory: TrustHistoryPoint[];
  extendedActors: ExtendedActor[];

  // Betrayal System
  betrayalStates: Map<string, BetrayalState>;
  activeBetrayalWarnings: BetrayalWarning[];
  activeBetrayalEvent: BetrayalEvent | null;

  // Crisis System
  activeCrisis: ActiveCrisis | null;

  // Recommendation Tracking
  recommendationTracking: Map<string, {
    followed: number;
    ignored: number;
    lastFollowed?: number; // phase number
    lastIgnored?: number;  // phase number
  }>;

  // Combo Hints
  comboHints: import('../engine/StoryComboSystem').ComboHint[];
}

export interface DialogState {
  speaker: string;
  speakerTitle?: string;
  text: string;
  mood?: 'neutral' | 'happy' | 'angry' | 'worried' | 'suspicious';
  choices?: {
    id: string;
    text: string;
    cost?: { ap?: number; budget?: number };
    disabled?: boolean;
    disabledReason?: string;
  }[];
  npcRecommendation?: string;
  npcBetrayalWarning?: string;
}

// ============================================
// ORCHESTRATOR HOOK
// ============================================

export function useStoryGameState(seed?: string) {
  // Engine instance (replaceable on reset)
  const [engine, setEngine] = useState(() => createStoryEngine(seed));

  // ============================================
  // SUB-HOOKS
  // ============================================

  const lifecycle = useGameLifecycle(engine);
  const actionExec = useActionExecution(engine);
  const phaseMgmt = usePhaseManagement(engine);
  const npcInteraction = useNPCInteraction(engine);
  const betrayalCrisis = useBetrayalCrisis(engine);
  const news = useNewsSystem(engine);
  const advisor = useAdvisorSystem(engine);

  // ============================================
  // SYNC ALL
  // ============================================

  const syncAll = useCallback(() => {
    lifecycle.sync();
    actionExec.sync();
    phaseMgmt.sync();
    npcInteraction.sync();
    betrayalCrisis.sync();
    news.sync();
    advisor.sync();
  }, [lifecycle, actionExec, phaseMgmt, npcInteraction, betrayalCrisis, news, advisor]);

  // ============================================
  // ORCHESTRATED CALLBACKS
  // These wrap sub-hook actions to coordinate cross-cutting concerns
  // ============================================

  // --- Game Lifecycle ---

  const startGame = useCallback(() => {
    lifecycle.actions.startGame();

    // Load available actions from engine
    actionExec.actions.refreshAvailableActions();

    // Initialize Betrayal System for all NPCs
    const betrayalSystem = getBetrayalSystem();
    const allNpcs = engine.getAllNPCs();
    allNpcs.forEach(npc => {
      betrayalSystem.initializeNPC(npc.id, npc.name, npc.morale);
    });

    // Generate initial recommendations
    advisor.actions.generateRecommendations({
      completedActions: actionExec.state.completedActions,
      worldEvents: phaseMgmt.state.worldEvents,
    });

    // Initialize combo hints
    const hints = engine.getActiveComboHints();
    actionExec.setComboHints(hints);

    // Show intro dialog
    npcInteraction.setCurrentDialog({
      speaker: 'Direktor',
      speakerTitle: 'Leiter der Agentur',
      text: 'Willkommen in der Abteilung für Sonderoperationen. Ihre Mission: die politische Landschaft von Westunion zu destabilisieren. Sie haben 10 Jahre Zeit. Nutzen Sie sie weise.',
      mood: 'neutral',
    });
  }, [engine, lifecycle, actionExec, advisor, phaseMgmt, npcInteraction]);

  const skipTutorial = useCallback(() => {
    lifecycle.actions.skipTutorial();
    npcInteraction.setCurrentDialog(null);
    // Generate initial recommendations
    advisor.actions.generateRecommendations({
      completedActions: actionExec.state.completedActions,
      worldEvents: phaseMgmt.state.worldEvents,
    });
    // Initialize combo hints
    const hints = engine.getActiveComboHints();
    actionExec.setComboHints(hints);
  }, [engine, lifecycle, npcInteraction, advisor, actionExec, phaseMgmt]);

  const continueDialog = useCallback(() => {
    npcInteraction.actions.continueDialog(
      lifecycle.state.gamePhase,
      () => {
        advisor.actions.generateRecommendations({
          completedActions: actionExec.state.completedActions,
          worldEvents: phaseMgmt.state.worldEvents,
        });
      }
    );
    if (lifecycle.state.gamePhase === 'tutorial') {
      lifecycle.setGamePhase('playing');
    }
  }, [lifecycle, npcInteraction, advisor, actionExec, phaseMgmt]);

  const dismissDialog = useCallback(() => {
    npcInteraction.actions.dismissDialog();
  }, [npcInteraction]);

  const handleDialogChoice = useCallback((choiceId: string) => {
    npcInteraction.actions.handleDialogChoice(choiceId, {
      recommendations: advisor.state.recommendations,
      betrayalStates: betrayalCrisis.state.betrayalStates,
    });
  }, [npcInteraction, advisor, betrayalCrisis]);

  const pauseGame = useCallback(() => {
    lifecycle.actions.pauseGame();
  }, [lifecycle]);

  const resumeGame = useCallback(() => {
    lifecycle.actions.resumeGame();
  }, [lifecycle]);

  const resetGame = useCallback(() => {
    const newEngine = lifecycle.actions.resetGame();
    setEngine(newEngine);

    // Reset all sub-hook state for new engine
    phaseMgmt.setStoryPhase(newEngine.getCurrentPhase());
    phaseMgmt.setResources(newEngine.getResources());
    npcInteraction.setNpcs(newEngine.getAllNPCs());
    npcInteraction.setActiveNpcId(null);
    npcInteraction.setCurrentDialog(null);
    actionExec.setAvailableActions([]);
    actionExec.setLastActionResult(null);
    actionExec.setCompletedActions([]);
    actionExec.setActionQueue([]);
    news.setNewsEvents([]);
    news.setObjectives(newEngine.getObjectives());
    news.setActiveConsequence(null);

    // Reset trust tracking
    const actors = newEngine.getExtendedActors();
    actionExec.setExtendedActors(actors);

    const actorTrust: Record<string, number> = {};
    let totalTrust = 0;
    actors.forEach(actor => {
      const trust = actor.currentTrust ?? actor.baseTrust;
      actorTrust[actor.id] = trust;
      totalTrust += trust;
    });

    phaseMgmt.setTrustHistory([{
      round: 0,
      actorTrust,
      averageTrust: actors.length > 0 ? totalTrust / actors.length : 1,
    }]);
  }, [lifecycle, phaseMgmt, npcInteraction, actionExec, news]);

  const saveGame = useCallback(() => {
    return lifecycle.actions.saveGame();
  }, [lifecycle]);

  const loadGame = useCallback(() => {
    const success = lifecycle.actions.loadGame();
    if (success) {
      // Refresh all state from engine after load
      phaseMgmt.setStoryPhase(engine.getCurrentPhase());
      phaseMgmt.setResources(engine.getResources());
      npcInteraction.setNpcs(engine.getAllNPCs());
      news.setNewsEvents(engine.getNewsEvents());
      news.setObjectives(engine.getObjectives());
      news.setActiveConsequence(engine.getActiveConsequence());
      actionExec.actions.refreshAvailableActions();
    }
    return success;
  }, [lifecycle, engine, phaseMgmt, npcInteraction, news, actionExec]);

  const hasSaveGame = useCallback(() => {
    return lifecycle.actions.hasSaveGame();
  }, [lifecycle]);

  const deleteSaveGame = useCallback(() => {
    lifecycle.actions.deleteSaveGame();
  }, [lifecycle]);

  // --- Phase Management ---

  const endPhase = useCallback(() => {
    const { result, sideEffects } = phaseMgmt.actions.endPhase({
      completedActions: actionExec.state.completedActions,
      recommendations: advisor.state.recommendations,
    });

    // Propagate side effects to other sub-hooks
    // Update NPC state
    npcInteraction.setNpcs(engine.getAllNPCs());

    // Update news/objectives
    news.setNewsEvents(engine.getNewsEvents());
    news.setObjectives(engine.getObjectives());

    // Track recommendation ignores
    sideEffects.recommendationIgnores.forEach(({ npcId, phaseNumber }) => {
      advisor.setRecommendationTracking(prev => {
        const newMap = new Map(prev);
        const existing = newMap.get(npcId) || { followed: 0, ignored: 0 };
        newMap.set(npcId, {
          ...existing,
          ignored: existing.ignored + 1,
          lastIgnored: phaseNumber,
        });
        return newMap;
      });
    });

    // Generate new recommendations
    advisor.actions.generateRecommendations({
      completedActions: actionExec.state.completedActions,
      worldEvents: phaseMgmt.state.worldEvents,
    });

    // Update extended actors
    actionExec.setExtendedActors(sideEffects.extendedActors);

    // Check for triggered consequences
    if (result.triggeredConsequences.length > 0) {
      const consequence = result.triggeredConsequences[0];
      if (consequence.requiresChoice) {
        playSound('consequence');
        news.setActiveConsequence(consequence);
        lifecycle.setGamePhase('consequence');
      }
    }

    // Propagate crisis
    if (sideEffects.crisis) {
      betrayalCrisis.setActiveCrisis(sideEffects.crisis);
    }

    // Update combo hints
    const hints = engine.getActiveComboHints();
    actionExec.setComboHints(hints);

    // Propagate game end
    if (sideEffects.gameEnd) {
      lifecycle.setGameEnd(sideEffects.gameEnd);
      lifecycle.setGamePhase('ended');
    }
  }, [engine, phaseMgmt, actionExec, advisor, npcInteraction, news, lifecycle, betrayalCrisis]);

  // --- Action Execution ---

  const executeAction = useCallback((actionId: string, options?: {
    targetId?: string;
    npcAssist?: string;
  }) => {
    const { result, sideEffects } = actionExec.actions.executeAction(
      actionId,
      options,
      {
        npcs: npcInteraction.state.npcs,
        trustHistory: phaseMgmt.state.trustHistory,
        recommendations: advisor.state.recommendations,
        betrayalStates: betrayalCrisis.state.betrayalStates,
      }
    );

    // Propagate cross-hook side effects
    phaseMgmt.setResources(engine.getResources());
    news.setNewsEvents(engine.getNewsEvents());
    npcInteraction.setNpcs(engine.getAllNPCs());
    news.setObjectives(engine.getObjectives());

    // Betrayal side effects
    if (sideEffects.betrayalWarnings) {
      betrayalCrisis.setActiveBetrayalWarnings(sideEffects.betrayalWarnings);
    }
    if (sideEffects.betrayalEvent !== undefined) {
      betrayalCrisis.setActiveBetrayalEvent(sideEffects.betrayalEvent);
    }
    if (sideEffects.betrayalStates) {
      betrayalCrisis.setBetrayalStates(sideEffects.betrayalStates);
    }

    // Defensive AI news events
    if (sideEffects.newsEventsToAdd && sideEffects.newsEventsToAdd.length > 0) {
      news.setNewsEvents(prev => [...sideEffects.newsEventsToAdd!, ...prev]);
    }

    // Recommendation tracking
    if (sideEffects.recommendationTracking) {
      const currentPhase = engine.getCurrentPhase();
      sideEffects.recommendationTracking.forEach(({ npcId }) => {
        advisor.setRecommendationTracking(prev => {
          const newMap = new Map(prev);
          const existing = newMap.get(npcId) || { followed: 0, ignored: 0 };
          newMap.set(npcId, {
            ...existing,
            followed: existing.followed + 1,
            lastFollowed: currentPhase.number,
          });
          return newMap;
        });
      });
    }

    // Dialog from NPC reactions
    if (sideEffects.dialog) {
      npcInteraction.setCurrentDialog(sideEffects.dialog);
    }

    // Game end
    if (sideEffects.gameEnd) {
      lifecycle.setGameEnd(sideEffects.gameEnd);
      lifecycle.setGamePhase('ended');
    }

    return result;
  }, [engine, actionExec, npcInteraction, phaseMgmt, advisor, betrayalCrisis, news, lifecycle]);

  // --- Action Queue ---

  const addToQueue = useCallback((actionId: string, options?: {
    targetId?: string;
    npcAssist?: string;
  }) => {
    actionExec.actions.addToQueue(actionId, options);
  }, [actionExec]);

  const removeFromQueue = useCallback((queueItemId: string) => {
    actionExec.actions.removeFromQueue(queueItemId);
  }, [actionExec]);

  const clearQueue = useCallback(() => {
    actionExec.actions.clearQueue();
  }, [actionExec]);

  const reorderQueue = useCallback((oldIndex: number, newIndex: number) => {
    actionExec.actions.reorderQueue(oldIndex, newIndex);
  }, [actionExec]);

  const executeQueue = useCallback(async () => {
    if (actionExec.state.actionQueue.length === 0) return;

    const results: (ActionResult | null)[] = [];

    for (const queuedAction of actionExec.state.actionQueue) {
      const result = executeAction(queuedAction.actionId, queuedAction.options);
      results.push(result);

      if (!result || !result.success) {
        storyLogger.warn('Queue execution stopped due to failed action:', queuedAction.actionId);
        break;
      }
    }

    // Clear queue after execution
    actionExec.setActionQueue([]);

    return results;
  }, [actionExec, executeAction]);

  // --- Consequence Handling ---

  const handleConsequenceChoice = useCallback((choiceId: string) => {
    const result = news.actions.handleConsequenceChoice(choiceId);
    if (result) {
      phaseMgmt.setResources(engine.getResources());
      lifecycle.setGamePhase(result.gamePhase);
      if (result.gameEnd) {
        lifecycle.setGameEnd(result.gameEnd);
      }
    }
  }, [engine, news, phaseMgmt, lifecycle]);

  // --- NPC Interactions ---

  const interactWithNpc = useCallback((npcId: string) => {
    npcInteraction.actions.interactWithNpc(npcId, {
      recommendationTracking: advisor.state.recommendationTracking,
      recommendations: advisor.state.recommendations,
      betrayalStates: betrayalCrisis.state.betrayalStates,
    });
  }, [npcInteraction, advisor, betrayalCrisis]);

  // --- News ---

  const markNewsAsRead = useCallback((newsId: string) => {
    news.actions.markNewsAsRead(newsId);
  }, [news]);

  const toggleNewsPinned = useCallback((newsId: string) => {
    news.actions.toggleNewsPinned(newsId);
  }, [news]);

  // --- Betrayal ---

  const acknowledgeBetrayal = useCallback(() => {
    betrayalCrisis.actions.acknowledgeBetrayal();
  }, [betrayalCrisis]);

  const dismissBetrayalWarnings = useCallback(() => {
    betrayalCrisis.actions.dismissBetrayalWarnings();
  }, [betrayalCrisis]);

  const addressGrievance = useCallback((npcId: string, grievanceId: string) => {
    betrayalCrisis.actions.addressGrievance(npcId, grievanceId);
  }, [betrayalCrisis]);

  // --- Crisis ---

  const resolveCrisis = useCallback((choiceId: string) => {
    betrayalCrisis.actions.resolveCrisis(choiceId);
    // Refresh game state after crisis resolution
    phaseMgmt.setResources(engine.getResources());
    npcInteraction.setNpcs(engine.getAllNPCs());
    news.setNewsEvents(engine.getNewsEvents());
  }, [engine, betrayalCrisis, phaseMgmt, npcInteraction, news]);

  const dismissCrisis = useCallback(() => {
    betrayalCrisis.actions.dismissCrisis();
  }, [betrayalCrisis]);

  // --- Actor Intelligence ---

  const calculateActionEffectiveness = useCallback((actionId: string): ActorEffectivenessModifier[] => {
    return actionExec.actions.calculateActionEffectiveness(actionId);
  }, [actionExec]);

  // ============================================
  // RETURN STATE & ACTIONS (IDENTICAL to original)
  // ============================================

  return {
    // State
    state: {
      engine,
      gamePhase: lifecycle.state.gamePhase,
      storyPhase: phaseMgmt.state.storyPhase,
      resources: phaseMgmt.state.resources,
      npcs: npcInteraction.state.npcs,
      activeNpcId: npcInteraction.state.activeNpcId,
      availableActions: actionExec.state.availableActions,
      lastActionResult: actionExec.state.lastActionResult,
      completedActions: actionExec.state.completedActions,
      newsEvents: news.state.newsEvents,
      worldEvents: phaseMgmt.state.worldEvents,
      unreadNewsCount: news.state.unreadNewsCount,
      objectives: news.state.objectives,
      activeConsequence: news.state.activeConsequence,
      gameEnd: lifecycle.state.gameEnd,
      currentDialog: npcInteraction.state.currentDialog,
      recommendations: advisor.state.recommendations,
      actionQueue: actionExec.state.actionQueue,
      trustHistory: phaseMgmt.state.trustHistory,
      extendedActors: actionExec.state.extendedActors,
      betrayalStates: betrayalCrisis.state.betrayalStates,
      activeBetrayalWarnings: betrayalCrisis.state.activeBetrayalWarnings,
      activeBetrayalEvent: betrayalCrisis.state.activeBetrayalEvent,
      activeCrisis: betrayalCrisis.state.activeCrisis,
      recommendationTracking: advisor.state.recommendationTracking,
      comboHints: actionExec.state.comboHints,
    } as StoryGameState,

    // Game Flow
    startGame,
    skipTutorial,
    continueDialog,
    dismissDialog,
    handleDialogChoice,
    pauseGame,
    resumeGame,
    resetGame,

    // Phase
    endPhase,

    // Actions
    executeAction,

    // Action Queue
    addToQueue,
    removeFromQueue,
    clearQueue,
    reorderQueue,
    executeQueue,

    // Consequences
    handleConsequenceChoice,

    // NPCs
    interactWithNpc,

    // News
    markNewsAsRead,
    toggleNewsPinned,

    // Betrayal System
    acknowledgeBetrayal,
    dismissBetrayalWarnings,
    addressGrievance,

    // Crisis System
    resolveCrisis,
    dismissCrisis,

    // Actor Intelligence
    calculateActionEffectiveness,

    // Save/Load
    saveGame,
    loadGame,
    hasSaveGame,
    deleteSaveGame,
  };
}

export default useStoryGameState;
