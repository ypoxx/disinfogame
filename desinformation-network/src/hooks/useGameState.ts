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
  GameStatistics,
} from '@/game-logic/types';

// Import definitions (will be loaded from JSON)
import actorDefinitions from '@/data/game/actors'; // NEW: 58 actors from modular system
import abilityDefinitions from '@/data/game/ability-definitions-v2.json';
import baseEventDefinitions from '@/data/game/event-definitions.json';
import eventChainDefinitions from '@/data/game/event-chains.json';
import comboDefinitions from '@/data/game/combo-definitions.json';

// Merge event definitions
const eventDefinitions = [...baseEventDefinitions, ...eventChainDefinitions];

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
  statistics: GameStatistics;
  comboDefinitions: any[]; // ComboDefinition[] from combo-system

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
  getValidTargets: (abilityId: string) => Actor[];

  // UI actions
  toggleEncyclopedia: () => void;
  toggleTutorial: () => void;
  toggleSettings: () => void;
  addNotification: (type: 'info' | 'warning' | 'success' | 'error', message: string) => void;
  dismissNotification: (id: string) => void;

  // Event system
  dismissCurrentEvent: () => void;
  makeEventChoice: (choiceIndex: number) => void;
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

    // Convert old ability definitions to new ResourceCost format
    const convertedAbilities = (abilityDefinitions as any[]).map(ability => ({
      ...ability,
      resourceCost: typeof ability.resourceCost === 'number'
        ? { money: ability.resourceCost, attention: Math.floor(ability.resourceCost * 0.3), infrastructure: 0 }
        : ability.resourceCost
    }));

    // Load definitions
    gameManagerRef.current.loadDefinitions(
      actorDefinitions as any,
      convertedAbilities as any,
      eventDefinitions as any,
      comboDefinitions as any
    );
  }
  
  const gameManager = gameManagerRef.current;
  
  // React state for triggering re-renders
  const [gameState, setGameState] = useState<GameState>(gameManager.getState());
  const [uiState, setUIState] = useState<UIState>(initialUIState);
  
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

    // Check for triggered events
    const event = gameManager.getLastTriggeredEvent();
    if (event) {
      setUIState(prev => ({
        ...prev,
        currentEvent: event,
        selectedAbility: null,
        targetingMode: false,
        validTargets: [],
      }));
    } else {
      // Clear ability selection
      setUIState(prev => ({
        ...prev,
        selectedAbility: null,
        targetingMode: false,
        validTargets: [],
      }));
    }
  }, [gameManager, syncState]);
  
  const resetGame = useCallback(() => {
    gameManager.reset();
    syncState();
    setUIState(initialUIState);
  }, [gameManager, syncState]);
  
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

    const success = gameManager.applyAbility(
      ability.abilityId,
      ability.sourceActorId,
      targetActorIds
    );

    if (success) {
      syncState();
      addNotification('success', 'Ability applied successfully');

      // Clear selection
      setUIState(prev => ({
        ...prev,
        selectedAbility: null,
        targetingMode: false,
        validTargets: [],
      }));
    } else {
      addNotification('error', 'Failed to apply ability');
    }

    return success;
  }, [uiState.selectedAbility, gameManager, syncState, addNotification]);

  const selectAbility = useCallback((abilityId: string) => {
    const selectedActorId = uiState.selectedActor?.actorId;
    if (!selectedActorId) return;

    if (!gameManager.canUseAbility(abilityId, selectedActorId)) {
      addNotification('warning', 'Cannot use this ability right now');
      return;
    }

    const validTargets = gameManager.getValidTargets(abilityId, selectedActorId);

    // If no targets needed (network-wide effect), apply immediately
    if (validTargets.length === 0) {
      const success = gameManager.applyAbility(abilityId, selectedActorId, []);
      syncState();

      if (success) {
        addNotification('success', 'Ability applied to entire network');
      } else {
        addNotification('error', 'Failed to apply ability');
      }
      return;
    }

    // Otherwise enter targeting mode
    setUIState(prev => ({
      ...prev,
      selectedAbility: {
        abilityId,
        sourceActorId: selectedActorId,
      },
      targetingMode: true,
      validTargets: validTargets.map(a => a.id),
    }));

    addNotification('info', `Select a target actor (${validTargets.length} available)`);
  }, [uiState.selectedActor, gameManager, addNotification, syncState]);

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

  const getValidTargets = useCallback((abilityId: string): Actor[] => {
    const selectedActorId = uiState.selectedActor?.actorId;
    if (!selectedActorId) return [];
    return gameManager.getValidTargets(abilityId, selectedActorId);
  }, [uiState.selectedActor, gameManager]);

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

  const dismissCurrentEvent = useCallback(() => {
    setUIState(prev => ({
      ...prev,
      currentEvent: null,
    }));
    gameManager.clearLastTriggeredEvent();
  }, [gameManager]);

  const makeEventChoice = useCallback((choiceIndex: number) => {
    gameManager.makeEventChoice(choiceIndex);
    syncState();
  }, [gameManager, syncState]);

  // ============================================
  // COMPUTED VALUES
  // ============================================

  const networkMetrics = gameManager.getNetworkMetrics();
  const statistics = gameManager.getStatistics();
  const comboDefinitions = gameManager.getComboDefinitions();

  // ============================================
  // RETURN
  // ============================================

  return {
    gameState,
    uiState,
    networkMetrics,
    statistics,
    comboDefinitions,

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
    getValidTargets,

    toggleEncyclopedia,
    toggleTutorial,
    toggleSettings,
    addNotification,
    dismissNotification,

    dismissCurrentEvent,
    makeEventChoice,
  };
}

export default useGameState;
