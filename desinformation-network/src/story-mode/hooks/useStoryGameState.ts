import { useState, useCallback, useEffect, useMemo } from 'react';
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

// ============================================
// TYPES
// ============================================

export type GamePhase = 'intro' | 'tutorial' | 'playing' | 'consequence' | 'paused' | 'ended';

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

  // News & Events
  newsEvents: NewsEvent[];
  unreadNewsCount: number;

  // Objectives
  objectives: Objective[];

  // Consequences
  activeConsequence: ActiveConsequence | null;

  // Game End
  gameEnd: GameEndState | null;

  // Dialog
  currentDialog: DialogState | null;
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
}

// ============================================
// HOOK
// ============================================

export function useStoryGameState(seed?: string) {
  // Engine instance (stable reference)
  const [engine] = useState(() => createStoryEngine(seed));

  // UI State
  const [gamePhase, setGamePhase] = useState<GamePhase>('intro');
  const [storyPhase, setStoryPhase] = useState<StoryPhase>(engine.getCurrentPhase());
  const [resources, setResources] = useState<StoryResources>(engine.getResources());

  // NPCs
  const [npcs, setNpcs] = useState<NPCState[]>(engine.getAllNPCs());
  const [activeNpcId, setActiveNpcId] = useState<string | null>(null);

  // Actions
  const [availableActions, setAvailableActions] = useState<StoryAction[]>([]);
  const [lastActionResult, setLastActionResult] = useState<ActionResult | null>(null);

  // News
  const [newsEvents, setNewsEvents] = useState<NewsEvent[]>(engine.getNewsEvents());

  // Objectives
  const [objectives, setObjectives] = useState<Objective[]>(engine.getObjectives());

  // Consequences
  const [activeConsequence, setActiveConsequence] = useState<ActiveConsequence | null>(null);

  // Game End
  const [gameEnd, setGameEnd] = useState<GameEndState | null>(null);

  // Dialog
  const [currentDialog, setCurrentDialog] = useState<DialogState | null>(null);

  // ============================================
  // DERIVED STATE
  // ============================================

  const unreadNewsCount = useMemo(
    () => newsEvents.filter(e => !e.read).length,
    [newsEvents]
  );

  // ============================================
  // GAME FLOW ACTIONS
  // ============================================

  const startGame = useCallback(() => {
    setGamePhase('tutorial');

    // Show intro dialog
    setCurrentDialog({
      speaker: 'Direktor',
      speakerTitle: 'Leiter der Agentur',
      text: 'Willkommen in der Abteilung für Sonderoperationen. Ihre Mission: die politische Landschaft von Westunion zu destabilisieren. Sie haben 10 Jahre Zeit. Nutzen Sie sie weise.',
      mood: 'neutral',
    });
  }, []);

  const skipTutorial = useCallback(() => {
    setGamePhase('playing');
    setCurrentDialog(null);
  }, []);

  const continueDialog = useCallback(() => {
    if (gamePhase === 'tutorial') {
      // Move to next tutorial step or start playing
      setGamePhase('playing');
      setCurrentDialog(null);
    } else {
      setCurrentDialog(null);
    }
  }, [gamePhase]);

  const handleDialogChoice = useCallback((choiceId: string) => {
    // Handle dialog choices
    setCurrentDialog(null);
  }, []);

  // ============================================
  // PHASE ACTIONS
  // ============================================

  const endPhase = useCallback(() => {
    const result = engine.advancePhase();

    // Update state
    setStoryPhase(result.newPhase);
    setResources(engine.getResources());
    setNpcs(engine.getAllNPCs());
    setNewsEvents(engine.getNewsEvents());
    setObjectives(engine.getObjectives());

    // Check for triggered consequences
    if (result.triggeredConsequences.length > 0) {
      const consequence = result.triggeredConsequences[0];
      if (consequence.requiresChoice) {
        setActiveConsequence(consequence);
        setGamePhase('consequence');
      }
    }

    // Check for game end
    const endState = engine.checkGameEnd();
    if (endState) {
      setGameEnd(endState);
      setGamePhase('ended');
    }
  }, [engine]);

  // ============================================
  // ACTION EXECUTION
  // ============================================

  const executeAction = useCallback((actionId: string, options?: {
    targetId?: string;
    npcAssist?: string;
  }) => {
    try {
      const result = engine.executeAction(actionId, options);

      setLastActionResult(result);
      setResources(engine.getResources());
      setNewsEvents(engine.getNewsEvents());
      setNpcs(engine.getAllNPCs());

      // Show result dialog if there are NPC reactions
      if (result.npcReactions && result.npcReactions.length > 0) {
        const reaction = result.npcReactions[0];
        const npc = npcs.find(n => n.id === reaction.npcId);

        setCurrentDialog({
          speaker: npc?.name || reaction.npcId,
          speakerTitle: npc?.role_de,
          text: reaction.dialogue_de,
          mood: reaction.reaction === 'crisis' ? 'angry' :
                reaction.reaction === 'negative' ? 'worried' :
                reaction.reaction === 'positive' ? 'happy' : 'neutral',
        });
      }

      // Check game end conditions
      const endState = engine.checkGameEnd();
      if (endState) {
        setGameEnd(endState);
        setGamePhase('ended');
      }

      return result;
    } catch (error) {
      console.error('Action execution failed:', error);
      return null;
    }
  }, [engine, npcs]);

  // ============================================
  // CONSEQUENCE HANDLING
  // ============================================

  const handleConsequenceChoice = useCallback((choiceId: string) => {
    if (!activeConsequence) return;

    engine.handleConsequenceChoice(choiceId);

    setActiveConsequence(null);
    setResources(engine.getResources());
    setGamePhase('playing');

    // Check game end
    const endState = engine.checkGameEnd();
    if (endState) {
      setGameEnd(endState);
      setGamePhase('ended');
    }
  }, [engine, activeConsequence]);

  // ============================================
  // NPC INTERACTIONS
  // ============================================

  const interactWithNpc = useCallback((npcId: string) => {
    const npc = engine.getNPCState(npcId);
    if (!npc) return;

    setActiveNpcId(npcId);

    // Generate greeting based on relationship level
    const greetings: Record<number, string> = {
      0: `Hmm. Was wollen Sie?`,
      1: `Ah, Sie sind es. Was gibt es?`,
      2: `Schön Sie zu sehen. Wie kann ich helfen?`,
      3: `Endlich! Ich habe auf Sie gewartet.`,
    };

    setCurrentDialog({
      speaker: npc.name,
      speakerTitle: npc.role_de,
      text: greetings[npc.relationshipLevel] || greetings[0],
      mood: npc.currentMood === 'positive' ? 'happy' :
            npc.currentMood === 'concerned' ? 'worried' :
            npc.currentMood === 'upset' ? 'angry' : 'neutral',
    });
  }, [engine]);

  // ============================================
  // NEWS MANAGEMENT
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

  // ============================================
  // SAVE / LOAD
  // ============================================

  const saveGame = useCallback(() => {
    const savedState = engine.saveState();
    localStorage.setItem('storyMode_save', savedState);
    localStorage.setItem('storyMode_save_timestamp', new Date().toISOString());
    return true;
  }, [engine]);

  const loadGame = useCallback(() => {
    const savedState = localStorage.getItem('storyMode_save');
    if (!savedState) return false;

    try {
      engine.loadState(savedState);

      // Refresh all state from engine
      setStoryPhase(engine.getCurrentPhase());
      setResources(engine.getResources());
      setNpcs(engine.getAllNPCs());
      setNewsEvents(engine.getNewsEvents());
      setObjectives(engine.getObjectives());
      setActiveConsequence(engine.getActiveConsequence());
      setGamePhase('playing');

      return true;
    } catch (error) {
      console.error('Failed to load save:', error);
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
  // PAUSE / RESUME
  // ============================================

  const pauseGame = useCallback(() => {
    if (gamePhase === 'playing') {
      setGamePhase('paused');
    }
  }, [gamePhase]);

  const resumeGame = useCallback(() => {
    if (gamePhase === 'paused') {
      setGamePhase('playing');
    }
  }, [gamePhase]);

  // ============================================
  // RESET
  // ============================================

  const resetGame = useCallback(() => {
    const newEngine = createStoryEngine();

    setGamePhase('intro');
    setStoryPhase(newEngine.getCurrentPhase());
    setResources(newEngine.getResources());
    setNpcs(newEngine.getAllNPCs());
    setAvailableActions([]);
    setLastActionResult(null);
    setNewsEvents([]);
    setObjectives(newEngine.getObjectives());
    setActiveConsequence(null);
    setGameEnd(null);
    setCurrentDialog(null);
    setActiveNpcId(null);
  }, []);

  // ============================================
  // RETURN STATE & ACTIONS
  // ============================================

  return {
    // State
    state: {
      engine,
      gamePhase,
      storyPhase,
      resources,
      npcs,
      activeNpcId,
      availableActions,
      lastActionResult,
      newsEvents,
      unreadNewsCount,
      objectives,
      activeConsequence,
      gameEnd,
      currentDialog,
    } as StoryGameState,

    // Game Flow
    startGame,
    skipTutorial,
    continueDialog,
    handleDialogChoice,
    pauseGame,
    resumeGame,
    resetGame,

    // Phase
    endPhase,

    // Actions
    executeAction,

    // Consequences
    handleConsequenceChoice,

    // NPCs
    interactWithNpc,

    // News
    markNewsAsRead,
    toggleNewsPinned,

    // Save/Load
    saveGame,
    loadGame,
    hasSaveGame,
    deleteSaveGame,
  };
}

export default useStoryGameState;
