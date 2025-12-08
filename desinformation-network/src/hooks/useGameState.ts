import { useState, useCallback, useEffect, useRef } from 'react';
import { GameStateManager, createGameState } from '@/game-logic/GameState';
import type {
  GameState,
  Actor,
  Ability,
  NetworkMetrics,
  UIState,
  SelectedActor,
  SelectedAbility,
  VisualEffect,
  AbilityResult,
  RiskState,
  ActorAction,
} from '@/game-logic/types';
import {
  ConsequenceGenerator,
  type Consequence,
  type SocietalImpact,
} from '@/game-logic/ConsequenceGenerator';
import { EpilogGenerator, type EpilogData } from '@/game-logic/EpilogGenerator';

// Import definitions (will be loaded from JSON)
import actorDefinitions from '@/data/game/actor-definitions-v2.json';
import abilityDefinitions from '@/data/game/ability-definitions-v2.json';
import eventDefinitions from '@/data/game/event-definitions.json';

// ============================================
// INITIAL UI STATE
// ============================================

const initialUIState: UIState = {
  selectedActor: null,
  selectedAbility: null,
  targetingMode: false,
  validTargets: [],
  hoveredActor: null,
  showEncyclopedia: false,
  showTutorial: false,
  showSettings: false,
  currentEvent: null,
  notifications: [],
};

// ============================================
// HOOK RETURN TYPE
// ============================================

type UseGameStateReturn = {
  // Game state
  gameState: GameState;
  uiState: UIState;
  networkMetrics: NetworkMetrics;

  // Visual effects (Sprint 1.1)
  visualEffects: VisualEffect[];
  lastAbilityResult: AbilityResult | null;

  // Risk state (Sprint 2)
  riskState: RiskState;

  // Actor actions (Sprint 3)
  actorActions: ActorAction[];

  // Sprint 4: Consequences & Impact
  lastConsequence: Consequence | null;
  societalImpact: SocietalImpact;
  allConsequences: Consequence[];
  generateEpilog: () => EpilogData;
  dismissConsequence: () => void;

  // Game actions
  startGame: () => void;
  advanceRound: () => void;
  resetGame: () => void;
  undoAction: () => void;

  // Actor selection
  selectActor: (actorId: string | null) => void;
  hoverActor: (actorId: string | null) => void;
  getActor: (actorId: string) => Actor | undefined;

  // Ability actions
  selectAbility: (abilityId: string) => void;
  cancelAbility: () => void;
  applyAbility: (targetActorIds: string[]) => boolean;
  canUseAbility: (abilityId: string) => boolean;
  getActorAbilities: (actorId: string) => Ability[];

  // UI actions
  toggleEncyclopedia: () => void;
  toggleTutorial: () => void;
  toggleSettings: () => void;
  addNotification: (type: 'info' | 'warning' | 'success' | 'error', message: string) => void;
  dismissNotification: (id: string) => void;
};

// ============================================
// MAIN HOOK
// ============================================

export function useGameState(initialSeed?: string): UseGameStateReturn {
  // Game state manager ref (persists across renders)
  const gameManagerRef = useRef<GameStateManager | null>(null);

  // Initialize game manager
  if (!gameManagerRef.current) {
    gameManagerRef.current = createGameState(initialSeed);

    // Load definitions
    gameManagerRef.current.loadDefinitions(
      actorDefinitions as any,
      abilityDefinitions as any,
      eventDefinitions as any
    );
  }

  const gameManager = gameManagerRef.current;

  // React state for triggering re-renders
  const [gameState, setGameState] = useState<GameState>(gameManager.getState());
  const [uiState, setUIState] = useState<UIState>(initialUIState);

  // Visual effects state (Sprint 1.1)
  const [visualEffects, setVisualEffects] = useState<VisualEffect[]>([]);
  const [lastAbilityResult, setLastAbilityResult] = useState<AbilityResult | null>(null);

  // Sprint 4: Consequence generator refs
  const consequenceGeneratorRef = useRef<ConsequenceGenerator | null>(null);
  const epilogGeneratorRef = useRef<EpilogGenerator | null>(null);

  if (!consequenceGeneratorRef.current) {
    consequenceGeneratorRef.current = new ConsequenceGenerator();
  }
  if (!epilogGeneratorRef.current) {
    epilogGeneratorRef.current = new EpilogGenerator();
  }

  const consequenceGenerator = consequenceGeneratorRef.current;
  const epilogGenerator = epilogGeneratorRef.current;

  // Sprint 4: Consequence state
  const [lastConsequence, setLastConsequence] = useState<Consequence | null>(null);
  const [societalImpact, setSocietalImpact] = useState<SocietalImpact>(
    consequenceGenerator.getSocietalImpact()
  );

  // Cleanup expired visual effects
  useEffect(() => {
    if (visualEffects.length === 0) return;

    const interval = setInterval(() => {
      const now = Date.now();
      setVisualEffects((prev) =>
        prev.filter((effect) => now - effect.startTime < effect.duration)
      );
    }, 100);

    return () => clearInterval(interval);
  }, [visualEffects.length]);
  
  // Sync game state
  const syncState = useCallback(() => {
    setGameState({ ...gameManager.getState() });
  }, [gameManager]);
  
  // ============================================
  // GAME ACTIONS
  // ============================================
  
  const startGame = useCallback(() => {
    gameManager.startGame();
    syncState();
  }, [gameManager, syncState]);
  
  const advanceRound = useCallback(() => {
    gameManager.advanceRound();
    syncState();
    
    // Clear ability selection
    setUIState(prev => ({
      ...prev,
      selectedAbility: null,
      targetingMode: false,
      validTargets: [],
    }));
  }, [gameManager, syncState]);
  
  const resetGame = useCallback(() => {
    gameManager.reset();
    consequenceGenerator.reset();
    syncState();
    setUIState(initialUIState);
    setLastConsequence(null);
    setSocietalImpact(consequenceGenerator.getSocietalImpact());
  }, [gameManager, syncState, consequenceGenerator]);
  
  const undoAction = useCallback(() => {
    const success = gameManager.undo();
    if (success) {
      syncState();
    }
    return success;
  }, [gameManager, syncState]);

  // ============================================
  // UI ACTIONS (defined early for use in other callbacks)
  // ============================================

  const dismissNotification = useCallback((id: string) => {
    setUIState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id),
    }));
  }, []);

  const addNotification = useCallback((
    type: 'info' | 'warning' | 'success' | 'error',
    message: string
  ) => {
    const id = `notification_${Date.now()}`;
    const notification = {
      id,
      type,
      message,
      duration: 3000,
      createdAt: Date.now(),
    };

    setUIState(prev => ({
      ...prev,
      notifications: [...prev.notifications, notification],
    }));

    // Auto-dismiss after duration
    setTimeout(() => {
      dismissNotification(id);
    }, notification.duration);
  }, [dismissNotification]);

  // ============================================
  // ABILITY ACTIONS
  // ============================================

  const applyAbility = useCallback((targetActorIds: string[]): boolean => {
    const ability = uiState.selectedAbility;
    if (!ability) return false;

    const result = gameManager.applyAbility(
      ability.abilityId,
      ability.sourceActorId,
      targetActorIds
    );

    if (result) {
      syncState();

      // Store result and add visual effects (Sprint 1.1)
      setLastAbilityResult(result);
      setVisualEffects((prev) => [...prev, ...result.visualEffects]);

      // Sprint 4: Generate consequence for primary target
      const abilityDef = gameManager.getAbility(ability.abilityId);
      if (abilityDef && targetActorIds.length > 0) {
        const primaryTargetId = targetActorIds[0];
        const targetActor = gameManager.getActor(primaryTargetId);
        if (targetActor) {
          const consequence = consequenceGenerator.generateConsequence(
            result,
            abilityDef,
            targetActor,
            gameManager.getState().round
          );
          if (consequence) {
            setLastConsequence(consequence);
            setSocietalImpact(consequenceGenerator.getSocietalImpact());
          }
        }
      }

      // Generate success message with impact summary
      const totalDelta = result.effects.reduce((sum, e) => sum + e.trustDelta, 0);
      const impactText = totalDelta < 0
        ? `Trust reduced by ${Math.abs(Math.round(totalDelta * 100))}%`
        : `Trust changed by ${Math.round(totalDelta * 100)}%`;

      // Check for controlled actors
      const newlyControlled = result.effects.filter(
        (e) => e.trustBefore >= 0.4 && e.trustAfter < 0.4
      );
      if (newlyControlled.length > 0) {
        addNotification('success', `🎯 ${newlyControlled.length} actor(s) now controlled!`);
      } else {
        addNotification('success', impactText);
      }

      // Clear selection
      setUIState((prev) => ({
        ...prev,
        selectedAbility: null,
        targetingMode: false,
        validTargets: [],
      }));

      return true;
    } else {
      addNotification('error', 'Failed to apply ability');
      return false;
    }
  }, [uiState.selectedAbility, gameManager, syncState, addNotification, consequenceGenerator]);

  const selectAbility = useCallback((abilityId: string) => {
    const selectedActorId = uiState.selectedActor?.actorId;
    if (!selectedActorId) return;

    if (!gameManager.canUseAbility(abilityId, selectedActorId)) {
      addNotification('warning', 'Cannot use this ability right now');
      return;
    }

    const validTargets = gameManager.getValidTargets(abilityId, selectedActorId);

    setUIState(prev => ({
      ...prev,
      selectedAbility: {
        abilityId,
        sourceActorId: selectedActorId,
      },
      targetingMode: validTargets.length > 0,
      validTargets: validTargets.map(a => a.id),
    }));
  }, [uiState.selectedActor, gameManager, addNotification]);

  const cancelAbility = useCallback(() => {
    setUIState(prev => ({
      ...prev,
      selectedAbility: null,
      targetingMode: false,
      validTargets: [],
    }));
  }, []);

  // ============================================
  // ACTOR SELECTION
  // ============================================

  const selectActor = useCallback((actorId: string | null) => {
    if (uiState.targetingMode && actorId) {
      // In targeting mode - check if valid target
      if (uiState.validTargets.includes(actorId)) {
        // Apply ability to this target
        applyAbility([actorId]);
      }
      return;
    }

    // Normal selection
    setUIState(prev => ({
      ...prev,
      selectedActor: actorId
        ? { actorId, selectedAt: Date.now() }
        : null,
      selectedAbility: null,
      targetingMode: false,
      validTargets: [],
    }));
  }, [uiState.targetingMode, uiState.validTargets, applyAbility]);

  const hoverActor = useCallback((actorId: string | null) => {
    setUIState(prev => ({
      ...prev,
      hoveredActor: actorId,
    }));
  }, []);

  const getActor = useCallback((actorId: string): Actor | undefined => {
    return gameManager.getActor(actorId);
  }, [gameManager]);
  
  const canUseAbility = useCallback((abilityId: string): boolean => {
    const selectedActorId = uiState.selectedActor?.actorId;
    if (!selectedActorId) return false;
    return gameManager.canUseAbility(abilityId, selectedActorId);
  }, [uiState.selectedActor, gameManager]);
  
  const getActorAbilities = useCallback((actorId: string): Ability[] => {
    return gameManager.getActorAbilities(actorId);
  }, [gameManager]);

  // ============================================
  // UI ACTIONS (remaining)
  // ============================================

  const toggleEncyclopedia = useCallback(() => {
    setUIState(prev => ({
      ...prev,
      showEncyclopedia: !prev.showEncyclopedia,
    }));
  }, []);

  const toggleTutorial = useCallback(() => {
    setUIState(prev => ({
      ...prev,
      showTutorial: !prev.showTutorial,
    }));
  }, []);

  const toggleSettings = useCallback(() => {
    setUIState(prev => ({
      ...prev,
      showSettings: !prev.showSettings,
    }));
  }, []);
  
  // ============================================
  // COMPUTED VALUES
  // ============================================
  
  const networkMetrics = gameManager.getNetworkMetrics();
  
  // ============================================
  // RETURN
  // ============================================
  
  // Sprint 2: Get risk state
  const riskState = gameManager.getRiskState();

  // Sprint 3: Get actor actions
  const actorActions = gameManager.getLastRoundActions();

  // Sprint 4: Consequence dismissal and epilog generation
  const dismissConsequence = useCallback(() => {
    setLastConsequence(null);
  }, []);

  const generateEpilog = useCallback((): EpilogData => {
    const controlledActors = gameState.network.actors.filter(a => a.trust < 0.4);
    return epilogGenerator.generateEpilog(
      gameState.phase === 'victory' ? 'victory' : 'defeat',
      gameState.round,
      networkMetrics,
      societalImpact,
      controlledActors,
      consequenceGenerator.getConsequences()
    );
  }, [gameState, networkMetrics, societalImpact, epilogGenerator, consequenceGenerator]);

  return {
    gameState,
    uiState,
    networkMetrics,

    // Visual effects (Sprint 1.1)
    visualEffects,
    lastAbilityResult,

    // Risk state (Sprint 2)
    riskState,

    // Actor actions (Sprint 3)
    actorActions,

    // Sprint 4: Consequences & Impact
    lastConsequence,
    societalImpact,
    allConsequences: consequenceGenerator.getConsequences(),
    generateEpilog,
    dismissConsequence,

    startGame,
    advanceRound,
    resetGame,
    undoAction,

    selectActor,
    hoverActor,
    getActor,

    selectAbility,
    cancelAbility,
    applyAbility,
    canUseAbility,
    getActorAbilities,

    toggleEncyclopedia,
    toggleTutorial,
    toggleSettings,
    addNotification,
    dismissNotification,
  };
}

export default useGameState;
