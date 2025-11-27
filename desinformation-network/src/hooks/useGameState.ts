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
} from '@/game-logic/types';

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
  }, [uiState.selectedAbility, gameManager, syncState]);

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
  }, [uiState.selectedActor, gameManager]);

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
  // UI ACTIONS
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
  }, []);
  
  const dismissNotification = useCallback((id: string) => {
    setUIState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id),
    }));
  }, []);
  
  // ============================================
  // COMPUTED VALUES
  // ============================================
  
  const networkMetrics = gameManager.getNetworkMetrics();
  
  // ============================================
  // RETURN
  // ============================================
  
  return {
    gameState,
    uiState,
    networkMetrics,
    
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
