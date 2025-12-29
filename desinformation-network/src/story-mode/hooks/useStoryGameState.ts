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
import { playSound } from '../utils/SoundSystem';

// ============================================
// TYPES
// ============================================

export type GamePhase = 'intro' | 'tutorial' | 'playing' | 'consequence' | 'paused' | 'ended';

// ============================================
// HELPERS
// ============================================

/**
 * Convert topic key to human-readable label
 * TD-006: Part of dynamic NPC dialogue system
 */
function getTopicLabel(topic: string): string {
  const labels: Record<string, string> = {
    // Direktor topics
    mission: 'Über die Mission',
    resources: 'Über Ressourcen',
    risks: 'Über Risiken',
    // Marina topics
    content: 'Über Inhalte',
    platforms: 'Über Plattformen',
    viral: 'Über Viralität',
    // Alexei topics
    infrastructure: 'Über Infrastruktur',
    bots: 'Über Bot-Netzwerke',
    security: 'Über Sicherheit',
    // Katja topics
    field: 'Über Feldarbeit',
    contacts: 'Über Kontakte',
    // Igor topics
    budget: 'Über das Budget',
    fronts: 'Über Tarnfirmen',
    flow: 'Über Geldflüsse',
  };
  return labels[topic] || topic.charAt(0).toUpperCase() + topic.slice(1);
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

  // Refresh available actions from engine
  const refreshAvailableActions = useCallback(() => {
    const actions = engine.getAvailableActions();
    setAvailableActions(actions);
  }, [engine]);

  const startGame = useCallback(() => {
    setGamePhase('tutorial');
    playSound('notification');

    // Load available actions from engine
    refreshAvailableActions();

    // Show intro dialog
    setCurrentDialog({
      speaker: 'Direktor',
      speakerTitle: 'Leiter der Agentur',
      text: 'Willkommen in der Abteilung für Sonderoperationen. Ihre Mission: die politische Landschaft von Westunion zu destabilisieren. Sie haben 10 Jahre Zeit. Nutzen Sie sie weise.',
      mood: 'neutral',
    });
  }, [refreshAvailableActions]);

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
    // TD-006: Handle NPC topic choices
    if (choiceId.startsWith('topic_') && activeNpcId) {
      const topic = choiceId.replace('topic_', '');
      const npc = engine.getNPCState(activeNpcId);
      if (npc) {
        const response = engine.getNPCDialogue(activeNpcId, { type: 'topic', subtype: topic });
        if (response) {
          setCurrentDialog({
            speaker: npc.name,
            speakerTitle: npc.role_de,
            text: response,
            mood: 'neutral',
            choices: [{ id: 'back_to_npc', text: 'Zurück' }],
          });
          return;
        }
      }
    }

    // Handle going back to NPC greeting - inline the logic to avoid circular dependency
    if (choiceId === 'back_to_npc' && activeNpcId) {
      const npc = engine.getNPCState(activeNpcId);
      if (npc) {
        const greeting = engine.getNPCDialogue(activeNpcId, { type: 'greeting' });
        const topics = engine.getNPCTopics(activeNpcId);
        const topicChoices = topics.map(topic => ({
          id: `topic_${topic}`,
          text: getTopicLabel(topic),
        }));

        setCurrentDialog({
          speaker: npc.name,
          speakerTitle: npc.role_de,
          text: greeting || 'Was gibt es?',
          mood: npc.inCrisis ? 'angry' :
                npc.currentMood === 'positive' ? 'happy' :
                npc.currentMood === 'concerned' ? 'worried' :
                npc.currentMood === 'upset' ? 'angry' : 'neutral',
          choices: topicChoices.length > 0 ? [
            ...topicChoices,
            { id: 'dismiss', text: 'Auf Wiedersehen' },
          ] : undefined,
        });
      }
      return;
    }

    // Handle dismiss
    if (choiceId === 'dismiss' || choiceId === 'continue') {
      setCurrentDialog(null);
      setActiveNpcId(null);
      return;
    }

    // Default: close dialog
    playSound('click');
    setCurrentDialog(null);
  }, [activeNpcId, engine]);

  // ============================================
  // PHASE ACTIONS
  // ============================================

  const endPhase = useCallback(() => {
    const result = engine.advancePhase();
    playSound('phaseEnd');

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
        playSound('consequence');
        setActiveConsequence(consequence);
        setGamePhase('consequence');
      }
    }

    // Check for game end
    const endState = engine.checkGameEnd();
    if (endState) {
      playSound(endState.type === 'victory' ? 'success' : 'error');
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

      // Play sound based on action result
      if (result.success) {
        const action = result.action;
        if (action.legality === 'illegal') {
          playSound('warning'); // Risky action
        } else {
          playSound('success');
        }
      } else {
        playSound('error');
      }

      setLastActionResult(result);
      setResources(engine.getResources());
      setNewsEvents(engine.getNewsEvents());
      setNpcs(engine.getAllNPCs());
      setObjectives(engine.getObjectives());

      // Refresh available actions (some may be unlocked or used)
      refreshAvailableActions();

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
  }, [engine, npcs, refreshAvailableActions]);

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
    console.log('📞 [Story Mode] interactWithNpc called with npcId:', npcId);

    const npc = engine.getNPCState(npcId);
    if (!npc) {
      console.error('❌ [Story Mode] NPC not found:', npcId);
      return;
    }

    console.log('✅ [Story Mode] NPC found:', npc.name);
    setActiveNpcId(npcId);

    // TD-006: Get dynamic greeting from JSON data based on relationship level
    const greeting = engine.getNPCDialogue(npcId, { type: 'greeting' });
    console.log('💬 [Story Mode] NPC greeting:', greeting);

    // Get available topics for conversation choices
    const topics = engine.getNPCTopics(npcId);
    console.log('📋 [Story Mode] Available topics:', topics);

    const topicChoices = topics.map(topic => ({
      id: `topic_${topic}`,
      text: getTopicLabel(topic),
    }));

    setCurrentDialog({
      speaker: npc.name,
      speakerTitle: npc.role_de,
      text: greeting || 'Was gibt es?',
      mood: npc.inCrisis ? 'angry' :
            npc.currentMood === 'positive' ? 'happy' :
            npc.currentMood === 'concerned' ? 'worried' :
            npc.currentMood === 'upset' ? 'angry' : 'neutral',
      choices: topicChoices.length > 0 ? [
        ...topicChoices,
        { id: 'dismiss', text: 'Auf Wiedersehen' },
      ] : undefined,
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
      refreshAvailableActions();
      setGamePhase('playing');

      return true;
    } catch (error) {
      console.error('Failed to load save:', error);
      return false;
    }
  }, [engine, refreshAvailableActions]);

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
