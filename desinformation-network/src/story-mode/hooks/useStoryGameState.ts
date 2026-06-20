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
  OperationOutcome,
  OperationsSummary,
  DecisionBeatResult,
} from '../../game-logic/StoryEngineAdapter';
import type { OperationParams } from '../battlefield/BattlefieldChain';
import { getEpisode, type Episode } from '../engine/EpisodeLoader';
import type { AuftragId } from '../engine/Auftraege';
import { pickNext, type DirectorInputs } from '../engine/StoryDirector';
import { unresolvedDecisionCandidates } from '../engine/DecisionBeats';
import { useDirectorStore } from '../stores/directorStore';
import { playSound } from '../utils/SoundSystem';
import { getAdvisorEngine } from '../engine/NPCAdvisorEngine';
import type { AdvisorRecommendation, WorldEventSnapshot } from '../engine/AdvisorRecommendation';
import { getBetrayalSystem } from '../engine/BetrayalSystem';
import type { BetrayalState, BetrayalEvent, BetrayalWarning, BetrayalGrievance } from '../engine/BetrayalSystem';
import { getCrisisMomentSystem } from '../engine/CrisisMomentSystem';
import type { ActiveCrisis, CrisisResolution } from '../engine/CrisisMomentSystem';
import { storyLogger } from '../../utils/logger';
import type { TrustHistoryPoint } from '../../components/TrustEvolutionChart';
import type { ExtendedActor, ActorEffectivenessModifier } from '../engine/ExtendedActorLoader';
import dialoguesData from '../data/dialogues.json';

// ============================================
// TYPES
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

// ============================================
// HELPERS
// ============================================

/**
 * Baut ein Sendeplan-Element (Queue) aus einer Aktion. Gemeinsam genutzt von
 * `addToQueue` (Tafel/Terminal) und „Aktion aus Dialog" (P1a), damit beide Wege
 * identisch auf den Sendeplan heften.
 */
function buildQueuedAction(
  action: StoryAction,
  options?: { targetId?: string; npcAssist?: string },
): QueuedAction {
  return {
    id: `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    actionId: action.id,
    label: action.label_de || action.label_en || action.id,
    costs: {
      budget: action.costs.budget,
      capacity: action.costs.capacity,
      actionPoints: 1, // jede Aktion kostet 1 AP
    },
    legality: action.legality,
    options,
  };
}

/**
 * Kontextuelle Maßnahmen-Angebote eines NPCs als Dialog-Optionen (Aktion aus Dialog, P1a).
 * Gefiltert nach `npc_affinity` + Verfügbarkeit (freigeschaltet & ungenutzt). Owner-Entscheidung 1:
 * Maßnahmen entstehen im Gespräch beim zuständigen NPC, nicht aus einer flachen Liste am Brett.
 * Beschriftung mit der plakativen Überschrift (B5), Präfix ▸ grenzt sie von Gesprächsthemen ab.
 */
export function buildActionOfferChoices(
  actions: StoryAction[],
  npcId: string,
  max = 3,
): { id: string; text: string; cost?: { ap?: number; budget?: number } }[] {
  return actions
    .filter((a) => a.available && a.npcAffinity?.includes(npcId))
    .slice(0, max)
    .map((a) => ({
      id: `action_${a.id}`,
      text: `▸ ${a.headline_de || a.label_de}`,
      cost: { ap: 1, budget: a.costs.budget },
    }));
}

/**
 * P4/B1: Episoden-Angebote eines NPCs als Dialog-Auswahl (emergent-kuratiert).
 * Der NPC bietet eine situierte Geschichte an, wenn ihr Auslöser passt.
 */
function buildEpisodeOfferChoices(
  offerable: Episode[],
  max = 2,
): { id: string; text: string }[] {
  return offerable.slice(0, max).map((ep) => ({
    id: `episode_${ep.id}`,
    text: `★ ${ep.titel_de}`,
  }));
}

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

/**
 * Enhance topic response with contextual information
 * Makes NPC dialogs more dynamic and relevant to current game state
 */
function enhanceTopicResponse(
  baseResponse: string,
  topic: string,
  npcId: string,
  contextData: {
    recommendations: Array<{ npcId: string; message: string; category: string; priority: string }>;
    betrayalState?: { warningLevel: number; betrayalRisk: number; grievances: BetrayalGrievance[] };
    phase: number;
    budget: number;
    influence: number;
  }
): string {
  let enhanced = baseResponse;

  // Add context based on topic type
  if (topic === 'risks' || topic === 'security') {
    // Check for betrayal risks
    if (contextData.betrayalState && contextData.betrayalState.warningLevel >= 2) {
      const riskPercent = Math.round(contextData.betrayalState.betrayalRisk);
      enhanced += `\n\n*wird ernster* Und zwischen uns gesagt: Ich mache mir Sorgen. Mein Verrats-Risiko liegt bei ${riskPercent}%. `;
      if (contextData.betrayalState.grievances.length > 0) {
        enhanced += `Besonders stört mich: ${contextData.betrayalState.grievances[0].description_de}.`;
      }
    } else {
      // Always add something even if no betrayal risk
      enhanced += `\n\n*denkt nach* Momentan läuft alles nach Plan. Wir sollten es so beibehalten.`;
    }
  }

  if (topic === 'resources' || topic === 'budget') {
    // Add budget context
    if (contextData.budget < 3000) {
      enhanced += '\n\n*schaut besorgt* Unser Budget wird knapp. Wir müssen vorsichtiger planen.';
    } else if (contextData.budget > 8000) {
      enhanced += '\n\n*nickt zufrieden* Finanziell stehen wir gut da. Wir haben Spielraum für größere Aktionen.';
    } else {
      enhanced += `\n\n*überprüft Zahlen* Wir haben aktuell ${Math.round(contextData.budget)}K Budget verfügbar. Solide, aber nicht übermäßig.`;
    }
  }

  if (topic === 'mission' || topic === 'field') {
    // Add influence/progress context
    if (contextData.influence > 70) {
      enhanced += '\n\n*lächelt* Wir machen gute Fortschritte. Unser Einfluss wächst stetig.';
    } else if (contextData.influence < 30) {
      enhanced += '\n\n*runzelt die Stirn* Wir müssen unsere Strategie überdenken. Der Fortschritt ist zu langsam.';
    } else {
      enhanced += `\n\n*nickt* Wir sind in Phase ${contextData.phase}. Noch viel Arbeit vor uns.`;
    }
  }

  // Katja's topics
  if (topic === 'contacts') {
    if (contextData.phase < 3) {
      enhanced += '\n\n*lächelt vielsagend* Ich habe da ein paar interessante Leute kennengelernt. Geben Sie mir noch etwas Zeit, sie aufzubauen.';
    } else {
      enhanced += '\n\n*tippt auf Notizbuch* Mein Netzwerk wächst. Jeden Tag neue Verbindungen, neue Möglichkeiten.';
    }
  }

  // Marina's topics
  if (topic === 'content' || topic === 'platforms') {
    if (contextData.influence > 60) {
      enhanced += '\n\n*zeigt auf Bildschirm* Unsere letzten Posts haben gut funktioniert. Die Engagement-Rate steigt.';
    } else {
      enhanced += '\n\n*scrollt durch Analytics* Wir müssen unsere Inhalte schärfer machen. Mehr Emotion, weniger Fakten.';
    }
  }

  if (topic === 'viral') {
    enhanced += '\n\n*tippt energisch* Das Geheimnis? Empörung. Menschen teilen, was sie wütend macht. Das nutzen wir aus.';
  }

  // Alexei's topics
  if (topic === 'infrastructure' || topic === 'bots') {
    if (contextData.budget > 6000) {
      enhanced += '\n\n*grinst* Mit unserem aktuellen Budget kann ich die Bot-Armeen gut ausbauen. Mehr Accounts, mehr Reichweite.';
    } else {
      enhanced += '\n\n*seufzt* Bots kosten Geld für Server und Proxies. Wenn das Budget knapp wird, müssen wir Prioritäten setzen.';
    }
  }

  // Igor's topics
  if (topic === 'fronts' || topic === 'flow') {
    if (contextData.phase > 5) {
      enhanced += '\n\n*blättert durch Papiere* Die Tarnfirmen laufen gut. Niemand kann unsere Geldflüsse mehr nachverfolgen.';
    } else {
      enhanced += '\n\n*schiebt Dokumente* Die Strukturen sind komplex, aber notwendig. Je länger wir aktiv sind, desto wichtiger wird Verschleierung.';
    }
  }

  // Add relevant recommendations
  const relevantRecs = contextData.recommendations.filter(rec => rec.npcId === npcId);
  if (relevantRecs.length > 0 && relevantRecs[0].priority !== 'low') {
    const rec = relevantRecs[0];
    enhanced += `\n\n*Übrigens:* ${rec.message}`;
  }

  return enhanced;
}

/**
 * Get recommendation reaction dialogues for an NPC
 */
function getRecommendationReaction(
  npcId: string,
  type: 'followed' | 'ignored'
): Array<{ id: string; text_de: string; text_en: string; mood: string }> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dialogues = dialoguesData as any;
    const reactions = dialogues?.special_dialogues?.recommendation_reactions;

    if (!reactions || !reactions[npcId]) {
      return [];
    }

    return reactions[npcId][type] || [];
  } catch (error) {
    storyLogger.error('Failed to load recommendation reactions:', error);
    return [];
  }
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

  // P4/B1: aktive Episoden-Stränge (Korkbrett-Spuren)
  activeEpisodes: Episode[];

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

  // P2 Operations-Ökonomie (Verbreiter-Zustände, beschaffte Kompromat-Schlüssel `targetId:vulnId`)
  carrierStates: Record<string, string>;
  acquiredKompromat: string[];
  /** Bilanz der P2-Operationen (für End-Report/Methoden-Atlas). */
  getOperationsSummary: () => OperationsSummary;
  /** Vollständiger Aktions-Katalog (id→Tags/Legalität) für den End-Report. */
  getActionCatalog: () => ReturnType<StoryGameStateEngine['getActionCatalog']>;
}

type StoryGameStateEngine = import('../../game-logic/StoryEngineAdapter').StoryEngineAdapter;

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
  /**
   * Sprachzeile (Asset-id, voice_<npc>_<lineKey>) — nur setzen, wenn der
   * angezeigte Text exakt der vertonten Zeile entspricht. Begrüßungen/Topics
   * laufen über dialogues.json und brauchen dafür erst einen Rückgabe-Key aus
   * dem DialogLoader (siehe tools/asset-pipeline/README.md, Phase 3).
   */
  voiceAssetId?: string;
}

// ============================================
// HOOK
// ============================================

export function useStoryGameState(seed?: string) {
  // Engine instance (replaceable on reset)
  const [engine, setEngine] = useState(() => createStoryEngine(seed));

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
  const [completedActions, setCompletedActions] = useState<string[]>([]);

  // News
  const [newsEvents, setNewsEvents] = useState<NewsEvent[]>(engine.getNewsEvents());
  const [worldEvents, setWorldEvents] = useState<WorldEventSnapshot[]>([]);

  // Objectives
  const [objectives, setObjectives] = useState<Objective[]>(engine.getObjectives());

  // Consequences
  const [activeConsequence, setActiveConsequence] = useState<ActiveConsequence | null>(null);
  // Slice 4: Ergebnis einer aufgelösten Entscheidungs-Beat-Option (für die Ergebnis-Ansicht).
  const [decisionBeatResult, setDecisionBeatResult] = useState<DecisionBeatResult | null>(null);

  // Game End
  const [gameEnd, setGameEnd] = useState<GameEndState | null>(null);

  // Dialog
  const [currentDialog, setCurrentDialog] = useState<DialogState | null>(null);

  // Advisor System
  const [recommendations, setRecommendations] = useState<AdvisorRecommendation[]>([]);

  // Action Queue
  const [actionQueue, setActionQueue] = useState<QueuedAction[]>([]);

  // P4/B1: aktive Episoden-Stränge (Korkbrett-Spuren). Reaktiv, damit das Brett mitzieht.
  const [activeEpisodes, setActiveEpisodes] = useState<Episode[]>(() => engine.getActiveEpisodes());

  // Trust Evolution Tracking
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
  const [extendedActors, setExtendedActors] = useState<ExtendedActor[]>(() =>
    engine.getExtendedActors()
  );

  // Betrayal System
  const [betrayalStates, setBetrayalStates] = useState<Map<string, BetrayalState>>(new Map());
  const [activeBetrayalWarnings, setActiveBetrayalWarnings] = useState<BetrayalWarning[]>([]);
  const [activeBetrayalEvent, setActiveBetrayalEvent] = useState<BetrayalEvent | null>(null);

  // Crisis System
  const [activeCrisis, setActiveCrisis] = useState<ActiveCrisis | null>(null);

  // Recommendation Tracking
  const [recommendationTracking, setRecommendationTracking] = useState<Map<string, {
    followed: number;
    ignored: number;
    lastFollowed?: number;
    lastIgnored?: number;
  }>>(new Map());

  // Combo Hints
  const [comboHints, setComboHints] = useState<import('../engine/StoryComboSystem').ComboHint[]>([]);

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

  // Helper: Generate NPC recommendations
  const generateRecommendations = useCallback(() => {
    try {
      const advisorEngine = getAdvisorEngine();
      const currentPhase = engine.getCurrentPhase();
      const currentResources = engine.getResources();
      const currentObjectives = engine.getObjectives();
      const currentNpcs = engine.getAllNPCs();

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
            maxBudget: 1000, // Fixed max budget for analysis
            capacity: currentResources.capacity,
            maxCapacity: 100, // Fixed max capacity for analysis
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
        npc: currentNpcs[0], // Placeholder, will be overridden by engine
        actionHistory: [],
        metricsHistory: {
          reachHistory: [],
          trustHistory: [],
          riskHistory: [],
          budgetHistory: [],
        },
        otherNPCs: currentNpcs,
        playerRelationship: 0, // Placeholder, will be overridden by engine
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

  // Refresh available actions from engine
  const refreshAvailableActions = useCallback(() => {
    const actions = engine.getAvailableActions();
    setAvailableActions(actions);
  }, [engine]);

  // P5: strategischen Auftrag wählen (Plague-Inc.-Stil beim Einstieg/Neustart).
  const chooseAuftrag = useCallback((id: AuftragId) => {
    engine.setAuftrag(id);
    playSound('click');
  }, [engine]);

  const startGame = useCallback(() => {
    setGamePhase('tutorial');
    playSound('notification');

    // Slice 4: Director-Zustand frisch (kein Beat/Pending aus einem früheren Spiel).
    useDirectorStore.getState().reset();
    setDecisionBeatResult(null);

    // Load available actions from engine
    refreshAvailableActions();

    // Initialize Betrayal System for all NPCs
    const betrayalSystem = getBetrayalSystem();
    const allNpcs = engine.getAllNPCs();
    allNpcs.forEach(npc => {
      betrayalSystem.initializeNPC(npc.id, npc.name, npc.morale);
    });

    // Generate initial recommendations immediately so UI is populated
    generateRecommendations();

    // Initialize combo hints
    const hints = engine.getActiveComboHints();
    setComboHints(hints);

    // Begrüßung beim Direktor: aktiver NPC setzen, damit die Raum-Nahsicht
    // (NpcRoomView, „Direktor groß hinter dem Schreibtisch", §4.3/K6.5) erscheint —
    // sonst läuft der Eröffnungsdialog ohne Raum-Eintritt im bloßen Dialogband.
    setActiveNpcId('direktor');
    // Show intro dialog
    setCurrentDialog({
      speaker: 'Direktor',
      speakerTitle: 'Leiter der Agentur',
      text: 'Willkommen in der Abteilung für Sonderoperationen. Ihre Mission: die politische Landschaft von Westunion zu destabilisieren. Sie haben 10 Jahre Zeit. Nutzen Sie sie weise.',
      mood: 'neutral',
    });
  }, [refreshAvailableActions, generateRecommendations]);

  const skipTutorial = useCallback(() => {
    setGamePhase('playing');
    setCurrentDialog(null);
    // Generate initial recommendations
    generateRecommendations();
    // Initialize combo hints
    const hints = engine.getActiveComboHints();
    setComboHints(hints);
  }, [engine, generateRecommendations]);

  const continueDialog = useCallback(() => {
    if (gamePhase === 'tutorial') {
      // Move to next tutorial step or start playing
      setGamePhase('playing');
      setCurrentDialog(null);
      setActiveNpcId(null); // Eröffnungs-Direktor wieder freigeben (Raum-Nahsicht aus)
      // Generate initial recommendations when starting game
      generateRecommendations();
    } else {
      setCurrentDialog(null);
    }
  }, [gamePhase, generateRecommendations]);

  const dismissDialog = useCallback(() => {
    setCurrentDialog(null);
    setActiveNpcId(null);
  }, []);

  const handleDialogChoice = useCallback((choiceId: string) => {
    // P1a: „Aktion aus Dialog" — die im Gespräch angebotene Maßnahme auf den
    // Sendeplan (Narrativ-Tafel) heften und das im Dialog bestätigen.
    if (choiceId.startsWith('action_') && activeNpcId) {
      const actionId = choiceId.slice('action_'.length);
      const action = availableActions.find(a => a.id === actionId);
      const npc = engine.getNPCState(activeNpcId);
      if (action) {
        setActionQueue(prev => [...prev, buildQueuedAction(action)]);
        playSound('click');
        const headline = action.headline_de || action.label_de;
        setCurrentDialog({
          speaker: npc?.name || activeNpcId,
          speakerTitle: npc?.role_de,
          text: `Gut. „${headline}" liegt jetzt auf dem Sendeplan. An der Narrativ-Tafel ordnen Sie die Maßnahme ein und spielen sie aus.`,
          mood: 'neutral',
          choices: [
            { id: 'back_to_npc', text: 'Weitere Maßnahme besprechen' },
            { id: 'dismiss', text: 'Erledigt' },
          ],
        });
      }
      return;
    }

    // P4/B1: „Episode aufnehmen" — der NPC bietet eine Geschichte an, der Spieler nimmt
    // sie als aktiven Strang aufs Korkbrett; die Einklink-Aktionen landen auf dem Sendeplan.
    if (choiceId.startsWith('episode_') && activeNpcId) {
      const episodeId = choiceId.slice('episode_'.length);
      const ep = getEpisode(episodeId);
      const npc = engine.getNPCState(activeNpcId);
      if (ep && engine.activateEpisode(episodeId)) {
        playSound('click');
        setActiveEpisodes(engine.getActiveEpisodes());
        // Einklink-Aktionen, die verfügbar sind, auf den Sendeplan heften.
        const pinned = ep.einklink_aktionen
          .map(id => availableActions.find(a => a.id === id))
          .filter((a): a is StoryAction => !!a);
        if (pinned.length > 0) {
          setActionQueue(prev => [...prev, ...pinned.map(a => buildQueuedAction(a))]);
        }
        setCurrentDialog({
          speaker: npc?.name || activeNpcId,
          speakerTitle: npc?.role_de,
          text: `${ep.lage_de}\n\n— ${ep.wendung_de}\n\n(„${ep.titel_de}" liegt jetzt als Strang auf dem Korkbrett.${pinned.length > 0 ? ' Die passenden Maßnahmen sind auf dem Sendeplan.' : ''})`,
          mood: 'neutral',
          choices: [
            { id: 'back_to_npc', text: 'Weiter besprechen' },
            { id: 'dismiss', text: 'An die Arbeit' },
          ],
        });
      }
      return;
    }

    // TD-006: Handle NPC topic choices
    if (choiceId.startsWith('topic_') && activeNpcId) {
      const topic = choiceId.replace('topic_', '');
      const npc = engine.getNPCState(activeNpcId);
      if (npc) {
        // voiceAssetId nur setzen, wenn Text exakt dem vertonten npcs.json-Text entspricht
        const topicResult = engine.getNPCDialogueWithVoice(activeNpcId, { type: 'topic', subtype: topic });
        const baseResponse = topicResult.text;
        if (baseResponse) {
          // Get context data for enhanced response
          const currentResources = engine.getResources();
          const betrayalState = betrayalStates.get(activeNpcId);
          const currentPhase = engine.getCurrentPhase();

          // Enhance response with contextual information
          const enhancedResponse = enhanceTopicResponse(
            baseResponse,
            topic,
            activeNpcId,
            {
              recommendations: recommendations,
              betrayalState: betrayalState ? {
                warningLevel: betrayalState.warningLevel,
                betrayalRisk: betrayalState.betrayalRisk,
                grievances: betrayalState.grievances,
              } : undefined,
              phase: currentPhase.number,
              budget: currentResources.budget,
              influence: 100 - currentResources.attention, // Lower attention = higher influence
            }
          );

          // voiceAssetId nur, wenn Text nicht durch enhanceTopicResponse verändert wurde
          const isTextUnchanged = enhancedResponse === baseResponse;
          setCurrentDialog({
            speaker: npc.name,
            speakerTitle: npc.role_de,
            text: enhancedResponse,
            mood: topicResult.mood ?? 'neutral',
            // Sprachzeile nur bei unveränderten Texten — sonst falsche Lippensynchronität
            voiceAssetId: isTextUnchanged ? topicResult.voiceAssetId : undefined,
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
        // Begrüßung mit optionaler Sprachzeile (nur bei npcs.json-Fallback gesetzt)
        const greetingResult = engine.getNPCDialogueWithVoice(activeNpcId, { type: 'greeting' });
        const topics = engine.getNPCTopics(activeNpcId);
        const topicChoices = topics.map(topic => ({
          id: `topic_${topic}`,
          text: getTopicLabel(topic),
        }));
        // P4/B1: Episoden-Angebote dieses NPCs zuoberst (das „Warum"), dann Maßnahmen.
        const episodeOffers = buildEpisodeOfferChoices(engine.getOfferableEpisodes(activeNpcId));
        // P1a: kontextuelle Maßnahmen-Angebote dieses NPCs.
        const actionOffers = buildActionOfferChoices(availableActions, activeNpcId);

        setCurrentDialog({
          speaker: npc.name,
          speakerTitle: npc.role_de,
          text: greetingResult.text || 'Was gibt es?',
          mood: greetingResult.mood ?? (
            npc.inCrisis ? 'angry' :
            npc.currentMood === 'positive' ? 'happy' :
            npc.currentMood === 'concerned' ? 'worried' :
            npc.currentMood === 'upset' ? 'angry' : 'neutral'
          ),
          voiceAssetId: greetingResult.voiceAssetId,
          choices: (episodeOffers.length > 0 || actionOffers.length > 0 || topicChoices.length > 0) ? [
            ...episodeOffers,
            ...actionOffers,
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
  }, [activeNpcId, engine, recommendations, betrayalStates, availableActions]);

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

    // Track ignored recommendations before generating new ones
    // If phase is ending and there are unexecuted high-priority recommendations, count as "ignored"
    if (recommendations.length > 0) {
      recommendations.forEach(rec => {
        if (rec.priority === 'critical' || rec.priority === 'high') {
          // Check if any of the suggested actions were executed this phase
          const wasFollowed = rec.suggestedActions.some(actionId =>
            completedActions.includes(actionId)
          );

          if (!wasFollowed) {
            // Count as ignored
            setRecommendationTracking(prev => {
              const newMap = new Map(prev);
              const existing = newMap.get(rec.npcId) || { followed: 0, ignored: 0 };
              newMap.set(rec.npcId, {
                ...existing,
                ignored: existing.ignored + 1,
                lastIgnored: result.newPhase.number,
              });
              return newMap;
            });

            storyLogger.info(`[RECOMMENDATION] Player ignored ${rec.priority} advice from ${rec.npcId}`);
          }
        }
      });
    }

    // Generate NPC recommendations
    generateRecommendations();

    // Track trust evolution
    const actors = engine.getExtendedActors();
    setExtendedActors(actors);

    const actorTrust: Record<string, number> = {};
    let totalTrust = 0;
    actors.forEach(actor => {
      const trust = actor.currentTrust ?? actor.baseTrust;
      actorTrust[actor.id] = trust;
      totalTrust += trust;
    });

    // Find any significant event from this phase
    const latestNews = engine.getNewsEvents().slice(-1)[0];
    const event = latestNews ? {
      type: latestNews.type,
      description: latestNews.headline_de,
    } : undefined;

    setTrustHistory(prev => [...prev, {
      round: result.newPhase.month + (result.newPhase.year - 2024) * 12,
      actorTrust,
      averageTrust: actors.length > 0 ? totalTrust / actors.length : 1,
      event,
    }]);

    // Check for triggered consequences
    if (result.triggeredConsequences.length > 0) {
      const consequence = result.triggeredConsequences[0];
      if (consequence.requiresChoice) {
        playSound('consequence');
        setActiveConsequence(consequence);
        setGamePhase('consequence');
      }
    }

    // Check Crisis System
    const crisisSystem = getCrisisMomentSystem();
    const currentResources = engine.getResources();
    const currentPhase = result.newPhase.number;

    // Auto-resolve expired crises
    crisisSystem.cleanupExpiredCrises(currentPhase);

    // Check for new crises to trigger
    const triggeredCrises = crisisSystem.checkForCrises({
      phase: currentPhase,
      risk: currentResources.risk,
      attention: currentResources.attention,
      actionCount: completedActions.length,
      lowTrustActors: actors.filter(a => (a.currentTrust ?? a.baseTrust) < 30).length,
    });

    // If crises triggered, show the most urgent one
    if (triggeredCrises.length > 0) {
      const mostUrgent = crisisSystem.getMostUrgentCrisis();
      if (mostUrgent) {
        playSound('warning');
        setActiveCrisis(mostUrgent);
        storyLogger.log(`[CRISIS] Triggered: ${mostUrgent.crisis.name_en}`);
      }
    }

    // Spine Slice 2/3: Der Dirigent kürt den nächsten Beat und legt ihn im
    // directorStore ab → Marinas Vorgriffszeile im nächsten Morgenbriefing. Krise hat
    // Vorfahrt; sonst zieht Slice 3 gewichtet aus dem Pool aller reifen Episoden +
    // Berater-Stupser (Math.random als Default → ähnliche Spielstände driften auseinander).
    const directorCrisis = crisisSystem.getMostUrgentCrisis();
    const ripeEpisodes = engine.getOfferableEpisodes();
    const directorInputs: DirectorInputs = {
      crisis: directorCrisis
        ? { id: directorCrisis.crisisId, vorgriffZeile_de: directorCrisis.crisis.newsTickerText_de }
        : undefined,
      decisionCandidates: unresolvedDecisionCandidates(
        engine.getResolvedDecisionBeatIds(),
        engine.getSeededThemes(),
      ),
      ripeEpisodes: ripeEpisodes.map((ep) => ({ id: ep.id, titel_de: ep.titel_de })),
      stupsCandidates: recommendations.map((rec) => ({
        quelleId: rec.npcId,
        vorgriffZeile_de: rec.message,
      })),
    };
    const dirStore = useDirectorStore.getState();
    dirStore.setBeat(pickNext(directorInputs, dirStore.lastBeat));

    // Update combo hints
    const hints = engine.getActiveComboHints();
    setComboHints(hints);

    // Check for game end
    const endState = engine.checkGameEnd();
    if (endState) {
      playSound(endState.type === 'victory' ? 'success' : 'error');
      setGameEnd(endState);
      setGamePhase('ended');
    }
  }, [engine, generateRecommendations, completedActions, recommendations]);

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

      // Get action and phase for processing
      const action = result.action;
      const currentPhase = engine.getCurrentPhase();

      // Track completed action
      if (result.success) {
        setCompletedActions(prev => [...prev, actionId]);

        // Process action through Betrayal System
        const betrayalSystem = getBetrayalSystem();

        // Check if action has moral weight (triggers betrayal risk)
        if (action.costs?.moralWeight && action.costs.moralWeight > 0) {
          const betrayalResult = betrayalSystem.processAction(
            actionId,
            action.tags || [],
            action.costs.moralWeight,
            currentPhase.number
          );

          // Store warnings to show later
          if (betrayalResult.warnings.length > 0) {
            setActiveBetrayalWarnings(betrayalResult.warnings);
          }

          // Check if any NPC is at critical betrayal risk
          const atRisk = betrayalSystem.getNPCsAtRisk();
          if (atRisk.length > 0) {
            storyLogger.info(`NPCs at betrayal risk: ${atRisk.join(', ')}`);
          }

          // Check if betrayal threshold reached (risk > 85%)
          const updatedNpcs = engine.getAllNPCs();
          for (const npc of updatedNpcs) {
            const risk = betrayalSystem.getBetrayalRisk(npc.id);
            if (risk && risk.risk > 85 && risk.warningLevel >= 4) {
              // Trigger betrayal event
              const betrayalEvent = betrayalSystem.checkBetrayalTrigger(
                npc.id,
                npc.name,
                currentPhase.number
              );
              if (betrayalEvent) {
                setActiveBetrayalEvent(betrayalEvent);
                storyLogger.warn(`BETRAYAL: ${npc.name} has betrayed the operation!`);
                // Betrayal event will be shown via modal
                break; // Only one betrayal per action
              }
            }
          }

          // Update betrayal states for UI (build from getBetrayalRisk calls)
          const newBetrayalStates = new Map<string, BetrayalState>();
          updatedNpcs.forEach(npc => {
            const risk = betrayalSystem.getBetrayalRisk(npc.id);
            if (risk) {
              // Reconstruct minimal state for UI (we don't have full state access)
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
          setBetrayalStates(newBetrayalStates);
        }

        // Track recommendation follow/ignore
        const actionWasRecommended = recommendations.some(rec =>
          rec.suggestedActions.includes(actionId)
        );

        if (actionWasRecommended) {
          // Find which NPC(s) recommended this action
          const recommendingNpcs = recommendations
            .filter(rec => rec.suggestedActions.includes(actionId))
            .map(rec => rec.npcId);

          // Mark as "followed" for each NPC who recommended it
          setRecommendationTracking(prev => {
            const newMap = new Map(prev);
            recommendingNpcs.forEach(npcId => {
              const existing = newMap.get(npcId) || { followed: 0, ignored: 0 };
              newMap.set(npcId, {
                ...existing,
                followed: existing.followed + 1,
                lastFollowed: currentPhase.number,
              });
            });
            return newMap;
          });

          storyLogger.info(`[RECOMMENDATION] Player followed advice from: ${recommendingNpcs.join(', ')}`);
        }
      }

      // Check Defensive AI triggers (platforms/fact-checkers react to high-impact actions)
      if (result.success) {
        const actors = engine.getExtendedActors();
        const previousAverageTrust = trustHistory.length > 0
          ? trustHistory[trustHistory.length - 1].averageTrust
          : 1.0;

        // Calculate average trust drop
        const currentAverageTrust = actors.reduce((sum, a) =>
          sum + (a.currentTrust ?? a.baseTrust), 0) / actors.length;
        const averageTrustDrop = previousAverageTrust - currentAverageTrust;

        // If trust drop is significant (> 0.1), check for defensive reactions
        if (averageTrustDrop > 0.1) {
          // Get actors with defensive behavior that might respond
          const defensiveActors = actors.filter(a =>
            a.behavior?.type === 'defensive' || a.behavior?.type === 'vigilant'
          );

          // Check if any defender is triggered
          defensiveActors.forEach(actor => {
            const threshold = actor.behavior?.triggerThreshold || 0.5;
            const reactionProb = actor.behavior?.reactionProbability || 0.3;

            if (averageTrustDrop >= threshold && Math.random() < reactionProb) {
              // Generate defensive counter-action as news event
              const counterActions = [
                'Fact-Check-Initiative gestartet',
                'Verstärkte Moderation angekündigt',
                'Algorithmus-Anpassung durchgeführt',
                'Transparenz-Bericht veröffentlicht',
              ];

              const counterAction = counterActions[Math.floor(Math.random() * counterActions.length)];

              storyLogger.info(`[DEFENSIVE AI] ${actor.name} reagiert: ${counterAction}`);

              // Add as news event (visual feedback)
              setNewsEvents(prev => [{
                id: `defensive_${Date.now()}_${actor.id}`,
                type: 'world_event',
                phase: currentPhase.number,
                headline_de: `${actor.name}: ${counterAction}`,
                headline_en: `${actor.name}: ${counterAction}`,
                description_de: `Als Reaktion auf verdächtige Aktivitäten hat ${actor.name} Gegenmaßnahmen eingeleitet.`,
                description_en: `In response to suspicious activity, ${actor.name} has initiated countermeasures.`,
                severity: 'danger',
                read: false,
                pinned: false,
              }, ...prev]);
            }
          });
        }
      }

      // Refresh available actions (some may be unlocked or used)
      refreshAvailableActions();

      // T3.6 (Option C): Die NPC-Reaktion erscheint jetzt MIT Porträt direkt im
      // Ergebnis-Modal (ActionFeedbackDialog). Die frühere separate Dialog-Pop-up-Box
      // entfällt — eine Anzeige statt doppelter Bestätigung pro Aktion.

      // Update combo hints (fetch active hints from engine)
      const activeHints = engine.getActiveComboHints();
      setComboHints(activeHints);

      // Check game end conditions
      const endState = engine.checkGameEnd();
      if (endState) {
        setGameEnd(endState);
        setGamePhase('ended');
      }

      return result;
    } catch (error) {
      storyLogger.error('Action execution failed:', error);
      return null;
    }
  }, [engine, npcs, refreshAvailableActions, trustHistory, recommendations]);

  // P0-1: Episoden-Strang abschließen — sobald ALLE Einklink-Aktionen einer aktiven Episode
  // gespielt sind, löst sich der Strang auf: `completeEpisode` wendet `wirkt_auf` auf die
  // Gesellschaftswerte an und merkt den Lernmoment für den End-Report vor. (Zuvor wurde
  // completeEpisode NUR in Tests aufgerufen — der Strang füllte sich optisch, zahlte aber nie aus.)
  // Effekt statt Inline-Check, weil `completedActions` nicht in den executeAction-Deps steht
  // (sonst Stale-Closure). completeEpisode ist idempotent → StrictMode-Doppellauf unkritisch.
  useEffect(() => {
    const active = engine.getActiveEpisodes();
    if (active.length === 0) return;
    const justCompleted: Episode[] = [];
    for (const ep of active) {
      if (
        ep.einklink_aktionen.length > 0 &&
        ep.einklink_aktionen.every((id) => completedActions.includes(id)) &&
        engine.completeEpisode(ep.id)
      ) {
        justCompleted.push(ep);
      }
    }
    if (justCompleted.length === 0) return;
    setActiveEpisodes(engine.getActiveEpisodes());
    setResources(engine.getResources()); // wirkt_auf hat die Gesellschaftswerte bewegt
    const phaseNo = engine.getCurrentPhase().number;
    // Abschluss-Beat als News (nicht-intrusiv — kein Hijack einer laufenden Dialog-Box):
    setNewsEvents((prev) => [
      ...justCompleted.map((ep) => ({
        id: `episode_done_${ep.id}_${phaseNo}`,
        phase: phaseNo,
        headline_de: `Strang ausgespielt: „${ep.titel_de}"`,
        headline_en: `Thread played out: "${ep.titel_de}"`,
        description_de: `${ep.wendung_de} — die Maßnahmen dieses Strangs sind ausgespielt; die Wirkung zeigt sich nun in der Gesellschaft. Der Lernmoment steht im Abschlussbericht.`,
        description_en: ep.wendung_de,
        type: 'world_event' as const,
        severity: 'info' as const,
        read: false,
        pinned: false,
      })),
      ...prev,
    ]);
  }, [completedActions, engine]);

  // ============================================
  // P2 OPERATIONS-AKTE (params-Durchstich)
  // ============================================

  /**
   * Spielt eine aus der Operations-Akte zusammengesetzte Operation aus.
   * Eigener Pfad neben executeAction: die Engine bewertet rein (BattlefieldChain),
   * setzt Nachricht + Risiko/Aufmerksamkeit und liefert ein Broadcast-Item, das wir
   * als lastActionResult durchreichen → der Publikums-Streifen reagiert wie gewohnt.
   */
  // Laufzeit-Zustand der Operations-Ökonomie (für die Akte reaktiv gespiegelt).
  const [carrierStates, setCarrierStates] = useState<Record<string, string>>(() => engine.getCarrierStates());
  const [acquiredKompromat, setAcquiredKompromat] = useState<string[]>([]);

  const playOperation = useCallback((params: OperationParams): OperationOutcome => {
    const outcome = engine.playOperation(params);
    if (outcome.success && outcome.broadcastResult) {
      setLastActionResult(outcome.broadcastResult);
      setResources(engine.getResources());
      setNewsEvents(engine.getNewsEvents());
      setCarrierStates(engine.getCarrierStates()); // Verbrennen sichtbar machen
      // „Loop schließen": Operationen bewegen jetzt das Sieg-Ziel (Vertrauen) →
      // Zielfortschritt/HUD muss mitziehen.
      setObjectives(engine.getObjectives());

      const endState = engine.checkGameEnd();
      if (endState) {
        setGameEnd(endState);
        setGamePhase('ended');
      }
    }
    return outcome;
  }, [engine]);

  /** Verbreiter aufbauen (kostet Budget/Kapazität). */
  const buildCarrier = useCallback((carrierId: string) => {
    const res = engine.buildCarrier(carrierId);
    if (res.ok) {
      setResources(engine.getResources());
      setCarrierStates(engine.getCarrierStates());
      playSound('paper');
    } else {
      playSound('error');
    }
    return res;
  }, [engine]);

  /** Kompromat beschaffen (Dossier→Kompromat, kostet Budget ~ Heikelheit). */
  const acquireKompromat = useCallback((targetId: string, vulnId: string) => {
    const res = engine.acquireKompromat(targetId, vulnId);
    if (res.ok) {
      setResources(engine.getResources());
      setAcquiredKompromat((prev) => prev.includes(`${targetId}:${vulnId}`) ? prev : [...prev, `${targetId}:${vulnId}`]);
      playSound('paper');
    } else {
      playSound('error');
    }
    return res;
  }, [engine]);

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

    setActionQueue(prev => [...prev, buildQueuedAction(action, options)]);
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

  const executeQueue = useCallback(async () => {
    if (actionQueue.length === 0) return;

    // Execute all actions in sequence
    const results: (ActionResult | null)[] = [];

    for (const queuedAction of actionQueue) {
      const result = executeAction(queuedAction.actionId, queuedAction.options);
      results.push(result);

      // If any action fails, stop execution
      if (!result || !result.success) {
        storyLogger.warn('Queue execution stopped due to failed action:', queuedAction.actionId);
        break;
      }
    }

    // Clear queue after execution
    setActionQueue([]);

    // Return results for potential feedback
    return results;
  }, [actionQueue, executeAction]);

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
  // ENTSCHEIDUNGS-BEATS (Spine Slice 4)
  // ============================================

  /** Wendet die gewählte Option an und zeigt das Ergebnis (T1: Wirkung sichtbar). */
  const handleDecisionBeatChoice = useCallback((beatId: string, optionId: string) => {
    const res = engine.applyDecisionBeatOption(beatId, optionId);
    if (!res) return;
    setDecisionBeatResult(res);
    setResources(engine.getResources()); // HUD (Gesellschaftswerte + Risiko/Aufmerksamkeit) auffrischen
    playSound('consequence');
  }, [engine]);

  /** Schließt die Entscheidung ab: Ergebnis verwerfen + offene Präsentation löschen. */
  const closeDecisionBeat = useCallback(() => {
    setDecisionBeatResult(null);
    useDirectorStore.getState().clearPendingDecision();
  }, []);

  // ============================================
  // NPC INTERACTIONS
  // ============================================

  const interactWithNpc = useCallback((npcId: string) => {
    const npc = engine.getNPCState(npcId);
    if (!npc) return;

    setActiveNpcId(npcId);

    // Check if NPC has recommendation reaction to show
    const tracking = recommendationTracking.get(npcId);
    const currentPhase = engine.getCurrentPhase().number;
    // Begrüßung mit optionaler Sprachzeile (nur bei npcs.json-Fallback gesetzt)
    const greetingResult = engine.getNPCDialogueWithVoice(npcId, { type: 'greeting' });
    let greetingText = greetingResult.text || 'Was gibt es?';
    let greetingVoiceId: string | undefined = greetingResult.voiceAssetId;
    let mood: 'neutral' | 'happy' | 'angry' | 'worried' | 'suspicious' =
      greetingResult.mood ?? (
        npc.inCrisis ? 'angry' :
        npc.currentMood === 'positive' ? 'happy' :
        npc.currentMood === 'concerned' ? 'worried' :
        npc.currentMood === 'upset' ? 'angry' : 'neutral'
      );

    // If player recently followed/ignored recommendation (within last 2 phases), show reaction
    if (tracking) {
      const recentlyFollowed = tracking.lastFollowed && (currentPhase - tracking.lastFollowed) <= 2;
      const recentlyIgnored = tracking.lastIgnored && (currentPhase - tracking.lastIgnored) <= 2;

      if (recentlyFollowed && tracking.followed > 0) {
        // Reaktion auf Empfehlung (dialogues.json-Text) → kein voiceAssetId (abweichend)
        const reactions = getRecommendationReaction(npcId, 'followed');
        if (reactions.length > 0) {
          const reaction = reactions[Math.floor(Math.random() * reactions.length)];
          greetingText = reaction.text_de;
          greetingVoiceId = undefined; // Empfehlungsreaktionen sind nicht vertont
          mood = reaction.mood as typeof mood || 'happy';
          storyLogger.info(`[DIALOG] ${npcId} reacts positively to followed recommendation`);
        }
      } else if (recentlyIgnored && tracking.ignored > 0) {
        // Reaktion auf ignorierte Empfehlung → kein voiceAssetId
        const reactions = getRecommendationReaction(npcId, 'ignored');
        if (reactions.length > 0) {
          const reaction = reactions[Math.floor(Math.random() * reactions.length)];
          greetingText = reaction.text_de;
          greetingVoiceId = undefined; // Empfehlungsreaktionen sind nicht vertont
          mood = reaction.mood as typeof mood || 'worried';
          storyLogger.info(`[DIALOG] ${npcId} reacts negatively to ignored recommendation`);
        }
      }
    }

    // Get active recommendations for this NPC
    const npcRecommendations = recommendations.filter(rec => rec.npcId === npcId);
    let recommendationText: string | undefined;
    if (npcRecommendations.length > 0) {
      const topRec = npcRecommendations[0]; // Show highest priority
      recommendationText = `${topRec.message} (Priorität: ${topRec.priority.toUpperCase()})`;
    }

    // Get betrayal warning for this NPC
    const betrayalState = betrayalStates.get(npcId);
    let betrayalWarning: string | undefined;
    if (betrayalState && betrayalState.warningLevel >= 2) {
      const riskPercent = Math.round(betrayalState.betrayalRisk);
      const warningLabels = ['', 'Leicht besorgt', 'Unzufrieden', 'Kritisch', 'GEFAHR!'];
      betrayalWarning = `${warningLabels[betrayalState.warningLevel]} - Verrats-Risiko: ${riskPercent}%`;
    }

    // Get available topics for conversation choices
    const topics = engine.getNPCTopics(npcId);
    const topicChoices = topics.map(topic => ({
      id: `topic_${topic}`,
      text: getTopicLabel(topic),
    }));
    // P4/B1: Episoden-Angebote dieses NPCs zuoberst (das „Warum").
    const episodeOffers = buildEpisodeOfferChoices(engine.getOfferableEpisodes(npcId));
    // P1a: kontextuelle Maßnahmen-Angebote dieses NPCs (Aktion aus Dialog).
    const actionOffers = buildActionOfferChoices(availableActions, npcId);

    setCurrentDialog({
      speaker: npc.name,
      speakerTitle: npc.role_de,
      text: greetingText,
      mood,
      voiceAssetId: greetingVoiceId,
      npcRecommendation: recommendationText,
      npcBetrayalWarning: betrayalWarning,
      choices: (episodeOffers.length > 0 || actionOffers.length > 0 || topicChoices.length > 0) ? [
        ...episodeOffers,
        ...actionOffers,
        ...topicChoices,
        { id: 'dismiss', text: 'Auf Wiedersehen' },
      ] : undefined,
    });
  }, [engine, recommendationTracking, recommendations, betrayalStates, availableActions]);

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
  // BETRAYAL SYSTEM HANDLERS
  // ============================================

  const acknowledgeBetrayal = useCallback(() => {
    setActiveBetrayalEvent(null);
  }, []);

  const dismissBetrayalWarnings = useCallback(() => {
    setActiveBetrayalWarnings([]);
  }, []);

  const addressGrievance = useCallback((npcId: string, grievanceId: string) => {
    // Use the built-in addressConcerns method (default to 'talk')
    const betrayalSystem = getBetrayalSystem();
    const currentPhase = engine.getCurrentPhase();
    const result = betrayalSystem.addressConcerns(npcId, 'talk', currentPhase.number);

    storyLogger.info(`Addressed concerns for ${npcId}: ${result.message_de}`);

    // Update UI state
    const risk = betrayalSystem.getBetrayalRisk(npcId);
    if (risk) {
      setBetrayalStates(prev => {
        const newMap = new Map(prev);
        const existingState = newMap.get(npcId);
        if (existingState) {
          newMap.set(npcId, {
            ...existingState,
            betrayalRisk: risk.risk,
            warningLevel: risk.warningLevel,
            grievances: risk.grievances,
          });
        }
        return newMap;
      });
    }
  }, [engine]);

  // ============================================
  // CRISIS SYSTEM HANDLERS
  // ============================================

  const resolveCrisis = useCallback((choiceId: string) => {
    if (!activeCrisis) return;

    const crisisSystem = getCrisisMomentSystem();
    const currentPhase = engine.getCurrentPhase();

    const resolution = crisisSystem.resolveCrisis(
      activeCrisis.crisisId,
      choiceId,
      currentPhase.number
    );

    if (resolution) {
      storyLogger.log(`[CRISIS] Resolved: ${activeCrisis.crisis.name_en} with choice ${choiceId}`);

      // Apply effects from the choice
      resolution.effects.forEach(effect => {
        if (effect.type === 'resource_bonus' && effect.value) {
          // Apply resource changes
          storyLogger.log(`[CRISIS] Effect: ${effect.type} = ${effect.value}`);
        }
      });

      // Clear the active crisis
      setActiveCrisis(null);
      playSound('success');

      // Refresh game state
      setResources(engine.getResources());
      setNpcs(engine.getAllNPCs());
      setNewsEvents(engine.getNewsEvents());

      // Check if there's a chained crisis
      if (resolution.triggeredChain) {
        storyLogger.log(`[CRISIS] Chained to: ${resolution.triggeredChain}`);
      }
    }
  }, [activeCrisis, engine]);

  const dismissCrisis = useCallback(() => {
    setActiveCrisis(null);
  }, []);

  // ============================================
  // ACTOR INTELLIGENCE
  // ============================================

  const calculateActionEffectiveness = useCallback((actionId: string): ActorEffectivenessModifier[] => {
    const action = availableActions.find(a => a.id === actionId);
    if (!action) return [];

    // Use engine's previewActionEffectiveness method
    const modifiers = engine.previewActionEffectiveness(action.tags);

    return modifiers;
  }, [engine, availableActions]);

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
      setActiveEpisodes(engine.getActiveEpisodes());
      refreshAvailableActions();
      setGamePhase('playing');

      return true;
    } catch (error) {
      storyLogger.error('Failed to load save:', error);
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
    setEngine(newEngine);

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
    setActiveEpisodes(newEngine.getActiveEpisodes());

    // Reset trust tracking
    const actors = newEngine.getExtendedActors();
    setExtendedActors(actors);

    const actorTrust: Record<string, number> = {};
    let totalTrust = 0;
    actors.forEach(actor => {
      const trust = actor.currentTrust ?? actor.baseTrust;
      actorTrust[actor.id] = trust;
      totalTrust += trust;
    });

    setTrustHistory([{
      round: 0,
      actorTrust,
      averageTrust: actors.length > 0 ? totalTrust / actors.length : 1,
    }]);
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
      completedActions,
      newsEvents,
      worldEvents,
      unreadNewsCount,
      objectives,
      activeConsequence,
      gameEnd,
      currentDialog,
      recommendations,
      actionQueue,
      trustHistory,
      extendedActors,
      betrayalStates,
      activeBetrayalWarnings,
      activeBetrayalEvent,
      activeCrisis,
      recommendationTracking,
      comboHints,
      carrierStates,
      acquiredKompromat,
      activeEpisodes,
      getOperationsSummary: () => engine.getOperationsSummary(),
      getActionCatalog: () => engine.getActionCatalog(),
    } as StoryGameState,

    // Game Flow
    startGame,
    skipTutorial,
    chooseAuftrag,
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
    playOperation,
    buildCarrier,
    acquireKompromat,

    // Action Queue
    addToQueue,
    removeFromQueue,
    clearQueue,
    reorderQueue,
    executeQueue,

    // Consequences
    handleConsequenceChoice,

    // Entscheidungs-Beats (Slice 4)
    decisionBeatResult,
    handleDecisionBeatChoice,
    closeDecisionBeat,

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
