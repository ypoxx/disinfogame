// ============================================
// STORY ENGINE ADAPTER
// Façade between Story Mode UI and Wargaming Engine
// ============================================

import type {
  GameState,
  Resources,
  Ability,
  Actor,
  GameEvent,
  EventChoice,
  ResourceCost,
} from './types';

import {
  ActionLoader,
  getActionLoader,
  type LoadedAction,
} from '../story-mode/engine/ActionLoader';

import {
  ConsequenceSystem,
  getConsequenceSystem,
  type ActiveConsequence as EngineActiveConsequence,
  type ConsequenceEffects,
} from '../story-mode/engine/ConsequenceSystem';

import {
  type Dialogue,
  type DialogueResponse,
  type TopicDialogue,
  type TopicLayer,
  type Debate,
} from '../story-mode/engine/DialogLoader';

import {
  CountermeasureSystem,
  type CountermeasureDefinition,
  type ActiveCountermeasure,
  type CounterOption,
} from '../story-mode/engine/CountermeasureSystem';

import {
  getTaxonomyLoader,
  type TaxonomyInfo,
  type TaxonomyTechnique,
} from '../story-mode/engine/TaxonomyLoader';

import {
  StoryComboSystem,
  getStoryComboSystem,
  type StoryComboProgress,
  type StoryComboActivation,
  type ComboHint,
} from '../story-mode/engine/StoryComboSystem';

import {
  CrisisMomentSystem,
  getCrisisMomentSystem,
  type CrisisMoment,
  type CrisisChoice,
  type ActiveCrisis,
  type CrisisResolution,
} from '../story-mode/engine/CrisisMomentSystem';

import {
  StoryActorAI,
  getStoryActorAI,
  type DefensiveActor,
  type AIAction,
} from '../story-mode/engine/StoryActorAI';

import {
  BetrayalSystem,
  getBetrayalSystem,
  type BetrayalWarning,
  type BetrayalEvent,
} from '../story-mode/engine/BetrayalSystem';

import {
  EndingSystem,
  getEndingSystem,
  type AssembledEnding,
  type EndingGameState,
} from '../story-mode/engine/EndingSystem';

import {
  ExtendedActorLoader,
  getExtendedActorLoader,
  type ExtendedActor,
  type ActorEffectivenessModifier,
} from '../story-mode/engine/ExtendedActorLoader';

import { StoryNarrativeGenerator } from '../story-mode/engine/StoryNarrativeGenerator';
import { playSound } from '../story-mode/utils/SoundSystem';
import { storyLogger } from '../utils/logger';

import { ActionExecutor, type ActionExecutorDeps } from './ActionExecutor';
import { PhaseManager, type PhaseManagerDeps } from './PhaseManager';
import { NewsGenerator, type NewsGeneratorDeps } from './NewsGenerator';
import { NPCOrchestrator, type NPCOrchestratorDeps } from './NPCOrchestrator';
import { StateSerializer, type StateSerializerDeps } from './StateSerializer';
import { DialogManager, type DialogManagerDeps } from './DialogManager';
import { GameEventBus } from './GameEventBus';
import {
  PHASES_PER_YEAR,
  MAX_YEARS,
  ACTION_POINTS_PER_PHASE,
  CAPACITY_REGEN_PER_PHASE,
  WORLD_EVENT_COOLDOWN,
  OPPORTUNITY_WINDOW_DURATION,
} from './story-balance-config';

// Import NPC and World Events data
import npcsData from '../story-mode/data/npcs.json';
import worldEventsData from '../story-mode/data/world-events.json';

// ============================================
// STORY MODE SPECIFIC TYPES
// ============================================

/**
 * Story Mode Zeit-Einheit
 * Eine Phase entspricht ca. 1 Monat im Spiel
 */
export interface StoryPhase {
  number: number;           // 1-120 (10 Jahre × 12 Monate)
  year: number;             // 1-10
  month: number;            // 1-12
  label_de: string;         // "Jahr 3, Monat 7"
  label_en: string;         // "Year 3, Month 7"
  isNewYear: boolean;       // Für spezielle Events
  season: 'spring' | 'summer' | 'autumn' | 'winter';
}

/**
 * Story Mode Ressourcen (erweitert Engine Resources)
 */
export interface StoryResources {
  // Aktive Ressourcen (pro Aktion bezahlt)
  budget: number;           // 💰 Geld in Tausend Euro
  capacity: number;         // ⚡ Operative Kapazität (regeneriert)

  // Passive Ressourcen (akkumulieren)
  risk: number;             // ⚠️ Entdeckungsrisiko (0-100)
  attention: number;        // 👁️ Aufmerksamkeit der Gegner (0-100)
  moralWeight: number;      // 💀 Moralische Last (beeinflusst NPCs & Enden)

  // Abgeleitet
  actionPointsRemaining: number;  // ~5 pro Phase
  actionPointsMax: number;
}

/**
 * Story Mode Aktion (narrativ verpackte Ability)
 */
export interface StoryAction {
  id: string;

  // Labels
  label_de: string;
  label_en: string;
  narrative_de: string;
  narrative_en: string;

  // Kategorisierung
  phase: string;            // ta01-ta07 oder targeting
  tags: string[];
  legality: 'legal' | 'grey' | 'illegal';

  // Kosten
  costs: {
    budget?: number;
    capacity?: number;
    risk?: number;
    attention?: number;
    moralWeight?: number;
  };

  // Verfügbarkeit
  available: boolean;
  unavailableReason?: string;
  prerequisites: string[];
  prerequisitesMet: boolean;

  // NPC-Bonus
  npcAffinity: string[];
  npcBonus?: {
    npcId: string;
    costReduction: number;
    riskReduction: number;
    effectBonus: number;
  };

  // Engine-Referenz
  engineAbilityId?: string;
  disarmRef?: string;
}

/**
 * Ergebnis einer ausgeführten Aktion
 */
export interface ActionResult {
  success: boolean;
  action: StoryAction;

  // Effekte
  effects: {
    type: string;
    value: number;
    description_de: string;
    description_en: string;
  }[];

  // Ressourcen-Änderungen
  resourceChanges: Partial<StoryResources>;

  // Narrative Reaktion
  narrative: {
    headline_de: string;
    headline_en: string;
    description_de: string;
    description_en: string;
  };

  // Potenzielle Konsequenzen (für UI Feedback)
  potentialConsequences: string[];

  // NPC-Reaktionen (falls vorhanden)
  npcReactions?: {
    npcId: string;
    reaction: 'positive' | 'neutral' | 'negative' | 'crisis';
    dialogue_de: string;
    dialogue_en: string;
  }[];

  // Combo-Ergebnisse
  completedCombos?: StoryComboActivation[];
  comboHints?: ComboHint[];

  // Extended Actor targeting results
  actorModifiers?: ActorEffectivenessModifier[];

  // Betrayal warnings triggered
  betrayalWarnings?: BetrayalWarning[];
}

/**
 * NPC-Status für Story Mode
 */
export interface NPCState {
  id: string;
  name: string;
  role_de: string;
  role_en: string;

  // Beziehung zum Spieler
  relationshipLevel: 0 | 1 | 2 | 3;  // Neutral → Bekannt → Vertraut → Loyal
  relationshipProgress: number;       // 0-100, Fortschritt zum nächsten Level

  // Zustand
  morale: number;                     // 0-100
  inCrisis: boolean;
  available: boolean;

  // Aktuelle Stimmung
  currentMood: 'positive' | 'neutral' | 'concerned' | 'upset';

  // Spezialisierung
  specialtyAreas: string[];
  enhancedActions: string[];          // Action IDs mit Bonus
}

/**
 * Ausstehende Konsequenz
 */
export interface PendingConsequence {
  id: string;
  consequenceId: string;

  // Timing
  triggeredAtPhase: number;
  activatesAtPhase: number;

  // Info
  label_de: string;
  label_en: string;
  severity: 'minor' | 'moderate' | 'severe' | 'critical';
  type: 'exposure' | 'blowback' | 'escalation' | 'internal' | 'collateral' | 'opportunity';

  // Spieler-Optionen (wenn aktiviert)
  choices?: {
    id: string;
    label_de: string;
    label_en: string;
    cost?: Partial<StoryResources>;
    outcome_de: string;
    outcome_en: string;
  }[];
}

/**
 * Aktive Konsequenz, die Spieler-Input erfordert
 */
export interface ActiveConsequence extends PendingConsequence {
  requiresChoice: boolean;
  deadline?: number;  // Phase, bis wann entschieden werden muss
  effects?: ConsequenceEffects;  // Effects to apply when consequence activates
}

/**
 * News-Event für die News-Liste
 */
export type EventScale = 'local' | 'regional' | 'national' | 'transnational';
export type MemberState = 'nordmark' | 'gallia' | 'insulandia' | 'balticum' | 'suedland' | 'ostmark';

/**
 * Opportunity Window - Zeitfenster mit erhöhter Aktionseffektivität
 * Entsteht durch World Events und vergeht nach einer gewissen Zeit
 */
export interface OpportunityWindow {
  id: string;
  type: OpportunityType;
  source: string;                     // Event ID that created this window
  sourceHeadline_de: string;          // For display
  sourceHeadline_en: string;
  createdPhase: number;
  expiresPhase: number;               // Window closes after this phase
  region?: MemberState;               // If regional opportunity

  // What actions/tags are boosted
  boostedTags: string[];              // Action tags that get bonus
  boostedPhases: string[];            // Action phases (ta01-ta07) that get bonus

  // Modifiers during this window
  effectivenessMultiplier: number;    // 1.3 = 30% more effective
  costReduction?: number;             // 0.8 = 20% cheaper
  riskReduction?: number;             // Reduced risk for these actions
}

export type OpportunityType =
  | 'elections'           // Election interference window
  | 'crisis'              // Economic/political crisis
  | 'scandal'             // Media scandal
  | 'protest'             // Social unrest
  | 'extremism'           // Far-right/populist surge
  | 'division'            // Internal division in target
  | 'chaos'               // General chaos/confusion
  | 'media_distrust'      // Low trust in media
  | 'economic_anxiety'    // Economic fears
  | 'migration'           // Migration debate
  | 'sovereignty'         // Sovereignty concerns
  | 'security'            // Security tensions
  | 'narrative';          // Specific narrative boost

export interface NewsEvent {
  id: string;
  phase: number;

  // Inhalt
  headline_de: string;
  headline_en: string;
  description_de: string;
  description_en: string;

  // Typ
  type: 'action_result' | 'consequence' | 'world_event' | 'npc_event' | 'npc_reaction';
  severity: 'info' | 'warning' | 'danger' | 'success';

  // Multi-scale world event properties
  scale?: EventScale;
  region?: MemberState;
  location?: string;

  // Quelle
  sourceActionId?: string;
  sourceConsequenceId?: string;

  // Status
  read: boolean;
  pinned: boolean;
}

/**
 * Spielziel (OKR-Style)
 */
export interface Objective {
  id: string;
  label_de: string;
  label_en: string;
  description_de: string;
  description_en: string;

  // Fortschritt
  progress: number;         // 0-100
  completed: boolean;

  // Typ
  type: 'primary' | 'secondary' | 'hidden';
  category: 'trust_reduction' | 'infrastructure' | 'political' | 'narrative' | 'survival';

  // Bedingungen
  targetValue: number;
  currentValue: number;
}

/**
 * Spiel-Ende Information
 */
export interface GameEndState {
  type: 'victory' | 'defeat' | 'escape' | 'moral_redemption';

  // Beschreibung
  title_de: string;
  title_en: string;
  description_de: string;
  description_en: string;

  // Statistiken
  stats: {
    phasesPlayed: number;
    actionsExecuted: number;
    consequencesTriggered: number;
    npcsCrisis: number;
    moralWeight: number;
  };

  // Epilog
  epilogue_de: string;
  epilogue_en: string;
}

// ============================================
// STORY ENGINE ADAPTER CLASS
// ============================================

export class StoryEngineAdapter {
  private engineState: GameState | null = null;
  private storyPhase: StoryPhase;
  private storyResources: StoryResources;
  private pendingConsequences: PendingConsequence[] = [];
  private activeConsequence: ActiveConsequence | null = null;
  private newsEvents: NewsEvent[] = [];
  private objectives: Objective[] = [];
  private npcStates: Map<string, NPCState> = new Map();
  private npcDialogues: Map<string, import('./DialogManager').LegacyNPCDialogueCache> = new Map();
  private actionHistory: { phase: number; actionId: string; result: ActionResult }[] = [];
  private exposureCountdown: number | null = null;  // Countdown to forced exposure/game end
  // P2-7: Track world event cooldowns (eventId -> last triggered phase)
  private worldEventCooldowns: Map<string, number> = new Map();
  private readonly WORLD_EVENT_COOLDOWN = 12;  // 12 phases = 1 year cooldown
  // Track triggered events for cascade system (eventId -> phase triggered)
  private triggeredEventsThisPhase: Set<string> = new Set();
  private allTriggeredEvents: Map<string, number> = new Map();
  // Track active opportunity windows (created by world events)
  private activeOpportunityWindows: Map<string, OpportunityWindow> = new Map();
  private readonly OPPORTUNITY_WINDOW_DURATION = 6;  // Default: 6 phases = 6 months

  // Engine Integration
  private actionLoader: ActionLoader;
  private consequenceSystem: ConsequenceSystem;
  private countermeasureSystem: CountermeasureSystem;
  private comboSystem: StoryComboSystem;
  private crisisMomentSystem: CrisisMomentSystem;
  private actorAI: StoryActorAI;
  private betrayalSystem: BetrayalSystem;
  private endingSystem: EndingSystem;
  private extendedActorLoader: ExtendedActorLoader;
  private rngSeed: string;

  // Extracted modules (Strangler Fig)
  private actionExecutor: ActionExecutor;
  private phaseManager: PhaseManager;
  private newsGenerator: NewsGenerator;
  private npcOrchestrator: NPCOrchestrator;
  private stateSerializer: StateSerializer;
  private dialogManager: DialogManager;
  private eventBus: GameEventBus;

  // Konfiguration (from story-balance-config.ts)
  private readonly PHASES_PER_YEAR = PHASES_PER_YEAR;
  private readonly MAX_YEARS = MAX_YEARS;
  private readonly ACTION_POINTS_PER_PHASE = ACTION_POINTS_PER_PHASE;
  private readonly CAPACITY_REGEN_PER_PHASE = CAPACITY_REGEN_PER_PHASE;

  constructor(seed?: string) {
    this.rngSeed = seed || Date.now().toString();

    // Initialize engine components
    this.actionLoader = getActionLoader();
    this.consequenceSystem = getConsequenceSystem();
    this.countermeasureSystem = new CountermeasureSystem();
    this.comboSystem = getStoryComboSystem();
    this.crisisMomentSystem = getCrisisMomentSystem();
    this.actorAI = getStoryActorAI();
    this.betrayalSystem = getBetrayalSystem();
    this.endingSystem = getEndingSystem();
    this.extendedActorLoader = getExtendedActorLoader();

    // Initialer Zustand
    this.storyPhase = this.createPhase(1);
    this.storyResources = this.createInitialResources();
    this.initializeNPCs();
    this.initializeObjectives();

    // Initialize extracted modules (Strangler Fig)
    this.eventBus = new GameEventBus();
    this.newsGenerator = new NewsGenerator(this.createNewsGeneratorDeps());
    this.actionExecutor = new ActionExecutor(this.createActionExecutorDeps());
    this.phaseManager = new PhaseManager(this.createPhaseManagerDeps());
    this.npcOrchestrator = new NPCOrchestrator(this.createNPCOrchestratorDeps());
    this.npcOrchestrator.initialize();
    this.stateSerializer = new StateSerializer(this.createStateSerializerDeps());
    this.dialogManager = new DialogManager(this.createDialogManagerDeps());

    storyLogger.log(`✅ StoryEngineAdapter initialized (seed: ${this.rngSeed})`);
  }

  /**
   * Create dependency bridge for ActionExecutor (Strangler Fig pattern).
   * The adapter implements the deps interface via closures that access `this`.
   */
  private createActionExecutorDeps(): ActionExecutorDeps {
    const adapter = this;
    return {
      getResources: () => adapter.storyResources,
      getPhase: () => adapter.storyPhase,
      getNPCStates: () => adapter.npcStates,
      getObjectives: () => adapter.objectives,
      getPendingConsequences: () => adapter.pendingConsequences,
      getNewsEvents: () => adapter.newsEvents,
      setResources: (r) => { adapter.storyResources = r; },
      addPendingConsequence: (c) => { adapter.pendingConsequences.push(c); },
      addNewsEvent: (e) => { adapter.newsEvents.unshift(e); },
      addActionHistory: (entry) => { adapter.actionHistory.push(entry); },
      actionLoader: adapter.actionLoader,
      consequenceSystem: adapter.consequenceSystem,
      comboSystem: adapter.comboSystem,
      betrayalSystem: adapter.betrayalSystem,
      actorAI: adapter.actorAI,
      extendedActorLoader: adapter.extendedActorLoader,
      seededRandom: (input) => adapter.seededRandom(input),
      convertToStoryAction: (loaded) => adapter.convertToStoryAction(loaded),
      generateActionNews: (action, result) => adapter.newsGenerator.generateActionNews(action, result),
    };
  }

  private createNewsGeneratorDeps(): NewsGeneratorDeps {
    const adapter = this;
    return {
      getPhase: () => adapter.storyPhase,
      getResources: () => adapter.storyResources,
      getNPCStates: () => adapter.npcStates,
      getObjectives: () => adapter.objectives,
      addNewsEvent: (e: NewsEvent) => { adapter.newsEvents.unshift(e); },
      addOpportunityWindow: (id: string, window: OpportunityWindow) => { adapter.activeOpportunityWindows.set(id, window); },
      hasOpportunityWindow: (id: string) => adapter.activeOpportunityWindows.has(id),
      betrayalSystem: adapter.betrayalSystem,
      seededRandom: (input: string) => adapter.seededRandom(input),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      playSound: (sound: string) => playSound(sound as any),
      WORLD_EVENT_COOLDOWN,
      OPPORTUNITY_WINDOW_DURATION,
      worldEventsData: worldEventsData,
    };
  }

  private createPhaseManagerDeps(): PhaseManagerDeps {
    const adapter = this;
    return {
      // State access
      getPhase: () => adapter.storyPhase,
      getResources: () => adapter.storyResources,
      getExposureCountdown: () => adapter.exposureCountdown,
      getNewsEvents: () => adapter.newsEvents,
      getActionHistoryLength: () => adapter.actionHistory.length,
      getRecentActionIds: () => adapter.actionHistory.slice(-3).map(a => a.result?.action?.id || ''),
      getRecentActionTags: () => adapter.actionHistory.slice(-3).flatMap(a => a.result?.action?.tags || []),
      // State mutation
      setPhase: (p: StoryPhase) => { adapter.storyPhase = p; },
      setResources: (r: StoryResources) => { adapter.storyResources = r; },
      setExposureCountdown: (c: number | null) => { adapter.exposureCountdown = c; },
      prependNewsEvent: (e: NewsEvent) => { adapter.newsEvents.unshift(e); },
      // Subsystem delegations
      checkConsequences: (phase: number) => adapter.checkConsequences(phase),
      generateWorldEvents: (phase: number) => adapter.newsGenerator.generateWorldEvents(phase),
      generateNPCCrisisEvents: (phase: number) => adapter.newsGenerator.generateNPCCrisisEvents(phase),
      generateResourceTrendEvents: (phase: number) => adapter.newsGenerator.generateResourceTrendEvents(phase),
      generateNPCEventReactions: (events: NewsEvent[]) => adapter.newsGenerator.generateNPCEventReactions(events),
      cleanupExpiredOpportunityWindows: () => adapter.cleanupExpiredOpportunityWindows(),
      // Subsystem refs (narrow)
      comboSystem: adapter.comboSystem,
      crisisMomentSystem: adapter.crisisMomentSystem,
      actorAI: adapter.actorAI,
      // Utilities
      createPhase: (n: number) => adapter.createPhase(n),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      playSound: (sound: string) => playSound(sound as any),
      emitEvent: (event) => adapter.eventBus.emit(event),
      // Constants
      PHASES_PER_YEAR: adapter.PHASES_PER_YEAR,
      MAX_YEARS: adapter.MAX_YEARS,
      CAPACITY_REGEN_PER_PHASE: adapter.CAPACITY_REGEN_PER_PHASE,
      ACTION_POINTS_PER_PHASE: adapter.ACTION_POINTS_PER_PHASE,
    };
  }

  private createNPCOrchestratorDeps(): NPCOrchestratorDeps {
    const adapter = this;
    return {
      getResources: () => adapter.storyResources,
      getPhase: () => adapter.storyPhase,
      getObjectives: () => adapter.objectives,
      prependNewsEvent: (e: NewsEvent) => { adapter.newsEvents.unshift(e); },
      betrayalSystem: adapter.betrayalSystem,
      seededRandom: (input: string) => adapter.seededRandom(input),
    };
  }

  private createStateSerializerDeps(): StateSerializerDeps {
    const adapter = this;
    return {
      getRngSeed: () => adapter.rngSeed,
      getPhase: () => adapter.storyPhase,
      getResources: () => adapter.storyResources,
      getPendingConsequences: () => adapter.pendingConsequences,
      getExposureCountdown: () => adapter.exposureCountdown,
      getNewsEvents: () => adapter.newsEvents,
      getObjectives: () => adapter.objectives,
      getNPCStates: () => adapter.npcStates,
      getActionHistory: () => adapter.actionHistory,
      getWorldEventCooldowns: () => adapter.worldEventCooldowns,
      getActiveOpportunityWindows: () => adapter.activeOpportunityWindows,
      comboSystem: adapter.comboSystem,
      crisisMomentSystem: adapter.crisisMomentSystem,
      actorAI: adapter.actorAI,
      actionLoader: adapter.actionLoader,
      consequenceSystem: adapter.consequenceSystem,
      setRngSeed: (s: string) => { adapter.rngSeed = s; },
      setPhase: (p) => { adapter.storyPhase = p; },
      setResources: (r) => { adapter.storyResources = r; },
      setPendingConsequences: (c) => { adapter.pendingConsequences = c; },
      setExposureCountdown: (c) => { adapter.exposureCountdown = c; },
      setNewsEvents: (e) => { adapter.newsEvents = e; },
      setObjectives: (o) => { adapter.objectives = o; },
      setNPCStates: (s) => { adapter.npcStates = s; },
      setActionHistory: (h) => { adapter.actionHistory = h; },
      setWorldEventCooldowns: (c) => { adapter.worldEventCooldowns = c; },
      setActiveOpportunityWindows: (w) => { adapter.activeOpportunityWindows = w; },
      importComboSystemState: (s) => adapter.comboSystem.importState(s),
      importCrisisMomentSystemState: (s) => adapter.crisisMomentSystem.importState(s),
      importActorAIState: (s) => adapter.actorAI.importState(s),
      importActionLoaderState: (s) => adapter.actionLoader.importState(s),
      importConsequenceSystemState: (s) => adapter.consequenceSystem.importState(s),
    };
  }

  private createDialogManagerDeps(): DialogManagerDeps {
    const adapter = this;
    return {
      getPhase: () => adapter.storyPhase,
      getResources: () => adapter.storyResources,
      getNPCStates: () => adapter.npcStates,
      getObjectives: () => adapter.objectives,
      getNPCDialogues: () => adapter.npcDialogues,
      seededRandom: (input: string) => adapter.seededRandom(input),
    };
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  private createPhase(phaseNumber: number): StoryPhase {
    const year = Math.ceil(phaseNumber / this.PHASES_PER_YEAR);
    const month = ((phaseNumber - 1) % this.PHASES_PER_YEAR) + 1;

    const seasons: Array<'winter' | 'spring' | 'summer' | 'autumn'> =
      ['winter', 'winter', 'spring', 'spring', 'spring', 'summer',
       'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter'];

    return {
      number: phaseNumber,
      year,
      month,
      label_de: `Jahr ${year}, Monat ${month}`,
      label_en: `Year ${year}, Month ${month}`,
      isNewYear: month === 1,
      season: seasons[month - 1],
    };
  }

  private createInitialResources(): StoryResources {
    return {
      budget: 150,            // P1-5 Fix: Increased from 100 to 150
      capacity: 5,            // Volle Kapazität
      risk: 0,
      attention: 0,
      moralWeight: 0,
      actionPointsRemaining: this.ACTION_POINTS_PER_PHASE,
      actionPointsMax: this.ACTION_POINTS_PER_PHASE,
    };
  }

  private initializeNPCs(): void {
    // Load NPCs from JSON data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = npcsData as any;

    for (const npc of data.npcs) {
      this.npcStates.set(npc.id, {
        id: npc.id,
        name: npc.name,
        role_de: npc.role_de,
        role_en: npc.role_en,
        relationshipLevel: npc.initialState?.relationshipLevel ?? 0,
        relationshipProgress: 0,
        morale: npc.initialState?.morale ?? 100,
        inCrisis: false,
        available: npc.initialState?.available ?? true,
        currentMood: 'neutral',
        specialtyAreas: npc.specialtyAreas || [],
        enhancedActions: npc.enhancedActions || [],
      });

      // Store dialogue data for later use
      if (npc.dialogues) {
        this.npcDialogues.set(npc.id, npc.dialogues);
      }

      // Register NPC with betrayal system
      // Map NPC role to archetype for red line configuration
      const archetypeMap: Record<string, string> = {
        tech_specialist: 'techie',
        handler: 'veteran',
        analyst: 'analyst',
        operative: 'ideologue',
        newbie: 'newbie',
        opportunist: 'opportunist',
      };
      const archetype = archetypeMap[npc.archetype || npc.role || 'ideologue'] || 'ideologue';
      const initialMorale = npc.initialState?.morale ?? 100;
      this.betrayalSystem.initializeNPC(npc.id, archetype, initialMorale);
    }

    storyLogger.log(`Loaded ${this.npcStates.size} NPCs from data`);
  }

  private initializeObjectives(): void {
    // TODO: Load from scenario definition
    // BALANCE 2026-01-14: Adjusted for ~20 phase game length with ~40-60% win rate
    // - Start trust: 100%
    // - Target trust: 40% (requires 60 points progress)
    this.objectives = [
      {
        id: 'obj_destabilize',
        label_de: 'Westunion destabilisieren',
        label_en: 'Destabilize Westunion',
        description_de: 'Senke das durchschnittliche Vertrauen in Institutionen auf unter 40%',
        description_en: 'Reduce average institutional trust to below 40%',
        progress: 0,
        completed: false,
        type: 'primary',
        category: 'trust_reduction',
        targetValue: 40,      // Target: 40% trust (easier to achieve)
        currentValue: 100,    // Start: 100% trust
      },
      {
        id: 'obj_survive',
        label_de: 'Nicht enttarnt werden',
        label_en: 'Avoid exposure',
        description_de: 'Halte das Entdeckungsrisiko unter dem kritischen Level',
        description_en: 'Keep detection risk below critical level',
        progress: 100,
        completed: false,
        type: 'primary',
        category: 'survival',
        targetValue: 85,
        currentValue: 0,
      },
    ];
  }

  // ============================================
  // CORE GAME LOOP
  // ============================================

  /**
   * Fortschritt zur nächsten Phase — delegates to PhaseManager (Strangler Fig Phase 2)
   */
  advancePhase(): {
    newPhase: StoryPhase;
    resourceChanges: Partial<StoryResources>;
    triggeredConsequences: ActiveConsequence[];
    worldEvents: NewsEvent[];
    triggeredCrises: CrisisMoment[];
    aiActions: AIAction[];
    newDefenders: DefensiveActor[];
  } {
    return this.phaseManager.advance();
  }

  /**
   * Prüfe, ob Konsequenzen aktiviert werden
   */
  private checkConsequences(currentPhase: number): ActiveConsequence[] {
    const activated: ActiveConsequence[] = [];

    // First, check if active consequence deadline has passed (TD-004: Effects bei Ignorieren)
    if (this.activeConsequence && this.activeConsequence.deadline) {
      if (currentPhase > this.activeConsequence.deadline) {
        this.handleIgnoredConsequence(currentPhase);
      }
    }

    // Check ConsequenceSystem for activating consequences
    const engineActive = this.consequenceSystem.checkPhase(currentPhase);

    if (engineActive) {
      // Convert engine active consequence to adapter format
      const active: ActiveConsequence = {
        id: engineActive.id,
        consequenceId: engineActive.consequence.id,
        triggeredAtPhase: currentPhase - 2, // Approximate
        activatesAtPhase: currentPhase,
        label_de: engineActive.consequence.label_de,
        label_en: engineActive.consequence.label_en,
        severity: engineActive.consequence.severity,
        type: engineActive.consequence.type,
        requiresChoice: engineActive.choices.length > 0,
        deadline: engineActive.deadline,
        effects: engineActive.consequence.effects,
        choices: engineActive.choices.map(c => ({
          id: c.id,
          label_de: c.label_de,
          label_en: c.label_en,
          cost: c.costs ? {
            budget: c.costs.budget,
            moralWeight: c.costs.moral_weight,
          } : undefined,
          outcome_de: c.outcome_de,
          outcome_en: c.outcome_en,
        })),
      };

      activated.push(active);

      if (active.requiresChoice) {
        this.activeConsequence = active;
      } else {
        // Auto-apply
        this.applyConsequenceEffects(active);
      }

      // Remove from our pending list
      this.pendingConsequences = this.pendingConsequences.filter(
        p => p.id !== active.id
      );
    }

    return activated;
  }

  /**
   * PIPELINE 3: Apply character-specific morale impacts from consequences
   *
   * Maps consequence types to NPCs based on expertise, personality, and context.
   * Provides linguistically rich, nuanced morale changes that respect character
   * consistency while creating systemic interconnection.
   *
   * BONUS Features:
   * - Generates transparent news about team reactions
   * - Integrates with crisis system for cascading effects
   * - Varies by relationship level and current morale
   */
  private applyConsequenceMoraleImpact(consequence: ActiveConsequence): void {
    const consequenceId = consequence.consequenceId;
    const consequenceType = consequence.type; // exposure, internal, blowback, etc.
    const severity = consequence.severity; // critical, severe, moderate

    interface NPCReaction {
      npcId: string;
      moraleChange: number;
      headline_de: string;
      headline_en: string;
      reaction_de: string;
      reaction_en: string;
      severity: 'info' | 'success' | 'warning' | 'danger';
    }

    const reactions: NPCReaction[] = [];

    // ============================================================
    // CATEGORY 1: BOT/TECH EXPOSURE
    // ============================================================
    if (consequenceId.includes('bot') || consequenceId.includes('fake_account')) {
      // IGOR - This is his domain, he feels responsible
      const igor = this.npcStates.get('igor');
      if (igor) {
        let moraleChange = -12;
        let headline_de = 'Igor: Technisches Versagen';
        let headline_en = 'Igor: Technical Failure';
        let reaction_de = '*tippt aggressiv* Die Bot-Signatur war meine Verantwortung. Das wird nicht wieder passieren.';
        let reaction_en = '*types aggressively* The bot signature was my responsibility. This won\'t happen again.';
        let reactionSeverity: 'info' | 'success' | 'warning' | 'danger' = 'warning';

        // Vary by current morale
        if (igor.morale < 40) {
          moraleChange = -15;
          headline_de = 'Igor: Selbstzweifel';
          headline_en = 'Igor: Self-Doubt';
          reaction_de = '*starrt auf Bildschirm* Ich... ich habe versagt. Sie wurden wegen meines Fehlers enttarnt.';
          reaction_en = '*stares at screen* I... I failed. You were exposed because of my mistake.';
          reactionSeverity = 'danger';
        } else if (igor.morale >= 70 && igor.relationshipLevel >= 2) {
          moraleChange = -8;
          headline_de = 'Igor: Lernmoment';
          headline_en = 'Igor: Learning Moment';
          reaction_de = '*nickt ernst* Verstanden. Ich analysiere das Erkennungsmuster. Beim nächsten Mal sind wir besser.';
          reaction_en = '*nods seriously* Understood. I\'m analyzing the detection pattern. Next time we\'ll be better.';
          reactionSeverity = 'info';
        }

        reactions.push({
          npcId: 'igor',
          moraleChange,
          headline_de,
          headline_en,
          reaction_de,
          reaction_en,
          severity: reactionSeverity,
        });
      }

      // MARINA - Worried about data security and escalation
      const marina = this.npcStates.get('marina');
      if (marina) {
        let moraleChange = -8;
        let headline_de = 'Marina: Sicherheitsbedenken';
        let headline_en = 'Marina: Security Concerns';
        let reaction_de = '*blättert durch Berichte* Wenn sie unsere Bots erkannt haben, könnten sie den Geldfluss zurückverfolgen.';
        let reaction_en = '*flips through reports* If they detected our bots, they might trace the money flow.';

        if (marina.relationshipLevel < 2) {
          moraleChange = -12;
          reaction_de = '*kritisch* Ich hatte Sie gewarnt, dass dieser Ansatz zu riskant ist. Jetzt haben wir ein ernstes Problem.';
          reaction_en = '*critical* I warned you this approach was too risky. Now we have a serious problem.';
        }

        reactions.push({
          npcId: 'marina',
          moraleChange,
          headline_de,
          headline_en,
          reaction_de,
          reaction_en,
          severity: 'warning',
        });
      }

      // VOLKOV - Might actually enjoy the chaos
      const volkov = this.npcStates.get('volkov');
      if (volkov && volkov.morale >= 50) {
        const moraleChange = severity === 'critical' ? -5 : +3;
        const headline_de = 'Volkov: Kampfgeist';
        const headline_en = 'Volkov: Fighting Spirit';
        const reaction_de = '*grinst schief* Gut. Jetzt wird es interessant. Zeigen wir ihnen, was wir noch in petto haben.';
        const reaction_en = '*grins crookedly* Good. Now it gets interesting. Let\'s show them what else we\'ve got.';

        reactions.push({
          npcId: 'volkov',
          moraleChange,
          headline_de,
          headline_en,
          reaction_de,
          reaction_en,
          severity: 'info',
        });
      }
    }

    // ============================================================
    // CATEGORY 2: TROLL/HARASSMENT BURNOUT (Internal)
    // ============================================================
    if (consequenceType === 'internal' && (consequenceId.includes('troll') || consequenceId.includes('burnout'))) {
      // VOLKOV - This directly affects his people
      const volkov = this.npcStates.get('volkov');
      if (volkov) {
        let moraleChange = -10;
        let headline_de = 'Volkov: Team-Sorgen';
        let headline_en = 'Volkov: Team Concerns';
        let reaction_de = '*ernst* Meine Leute sind erschöpft. Das hier... es hinterlässt Spuren, verstehen Sie?';
        let reaction_en = '*serious* My people are exhausted. This... it leaves marks, you understand?';

        if (volkov.morale < 35) {
          moraleChange = -15;
          headline_de = 'Volkov: Moral am Boden';
          headline_en = 'Volkov: Morale Collapsed';
          reaction_de = '*schlägt auf Tisch* Genug! Ich verliere gute Leute wegen dieser Scheiße. Das ist nicht mehr lustig.';
          reaction_en = '*slams table* Enough! I\'m losing good people because of this shit. This isn\'t funny anymore.';
        }

        reactions.push({
          npcId: 'volkov',
          moraleChange,
          headline_de,
          headline_en,
          reaction_de,
          reaction_en,
          severity: volkov.morale < 35 ? 'danger' : 'warning',
        });
      }

      // KATJA - Empathetic, feels the human cost
      const katja = this.npcStates.get('katja');
      if (katja) {
        let moraleChange = -12;
        let headline_de = 'Katja: Menschliche Kosten';
        let headline_en = 'Katja: Human Cost';
        let reaction_de = '*leise* Wir vergessen manchmal, dass echte Menschen unsere Worte schreiben. Sie leiden darunter.';
        let reaction_en = '*quietly* We sometimes forget that real people write our words. They suffer from it.';

        if (katja.relationshipLevel >= 2) {
          reaction_de = '*schaut Sie an* Sie sehen es auch, oder? Den Preis, den andere für unsere Ziele zahlen.';
          reaction_en = '*looks at you* You see it too, don\'t you? The price others pay for our goals.';
        }

        reactions.push({
          npcId: 'katja',
          moraleChange,
          headline_de,
          headline_en,
          reaction_de,
          reaction_en,
          severity: 'warning',
        });
      }

      // MARINA - Calculates the operational impact
      const marina = this.npcStates.get('marina');
      if (marina) {
        const moraleChange = -6;
        const headline_de = 'Marina: Effizienzeinbußen';
        const headline_en = 'Marina: Efficiency Loss';
        const reaction_de = '*rechnet* Personalersatz kostet Budget. Verzögerungen kosten Zeit. Beides können wir uns kaum leisten.';
        const reaction_en = '*calculates* Staff replacement costs budget. Delays cost time. We can afford neither.';

        reactions.push({
          npcId: 'marina',
          moraleChange,
          headline_de,
          headline_en,
          reaction_de,
          reaction_en,
          severity: 'info',
        });
      }
    }

    // ============================================================
    // CATEGORY 3: INVESTIGATION/EXPOSURE (Critical for all)
    // ============================================================
    if (consequenceType === 'exposure' && (consequenceId.includes('investigation') || consequenceId.includes('expose'))) {
      // EVERYONE reacts - this is existential

      // DIREKTOR - Leadership under pressure
      const direktor = this.npcStates.get('direktor');
      if (direktor) {
        let moraleChange = -15;
        let headline_de = 'Direktor: Strategische Krise';
        let headline_en = 'Direktor: Strategic Crisis';
        let reaction_de = '*kalter Blick* Eine Untersuchung. Das bedeutet, wir haben begrenzte Zeit. Handeln Sie weise.';
        let reaction_en = '*cold gaze* An investigation. That means we have limited time. Act wisely.';

        if (direktor.morale < 40) {
          moraleChange = -20;
          headline_de = 'Direktor: Vertrauen schwindet';
          headline_en = 'Direktor: Trust Fading';
          reaction_de = '*langsam* Ich beginne zu fragen, ob Sie die richtige Person für diesen Job sind.';
          reaction_en = '*slowly* I\'m beginning to question whether you\'re the right person for this job.';
        } else if (direktor.relationshipLevel >= 3) {
          moraleChange = -10;
          headline_de = 'Direktor: Gemeinsamer Kampf';
          headline_en = 'Direktor: Shared Struggle';
          reaction_de = '*nickt* Schwierig. Aber wir haben schon Schlimmeres überstanden. Bleiben Sie fokussiert.';
          reaction_en = '*nods* Difficult. But we\'ve weathered worse. Stay focused.';
        }

        reactions.push({
          npcId: 'direktor',
          moraleChange,
          headline_de,
          headline_en,
          reaction_de,
          reaction_en,
          severity: 'danger',
        });
      }

      // MARINA - Risk analyst's nightmare
      const marina = this.npcStates.get('marina');
      if (marina) {
        const moraleChange = -18;
        const headline_de = 'Marina: Risikoanalyse kritisch';
        const headline_en = 'Marina: Risk Analysis Critical';
        const reaction_de = '*hektisch* Alle Indikatoren sind rot. Wir müssen JETZT unsere Spuren verwischen - jede Stunde zählt.';
        const reaction_en = '*frantic* All indicators are red. We need to cover our tracks NOW - every hour counts.';

        reactions.push({
          npcId: 'marina',
          moraleChange,
          headline_de,
          headline_en,
          reaction_de,
          reaction_en,
          severity: 'danger',
        });
      }

      // IGOR - Tech cover-up mode
      const igor = this.npcStates.get('igor');
      if (igor) {
        const moraleChange = -12;
        const headline_de = 'Igor: Notfall-Protokolle';
        const headline_en = 'Igor: Emergency Protocols';
        const reaction_de = '*tippt rasend schnell* Starte Löschprogramme. Verschleiere IP-Spuren. Brauche 48 Stunden minimum.';
        const reaction_en = '*types frantically* Starting deletion programs. Obscuring IP traces. Need 48 hours minimum.';

        reactions.push({
          npcId: 'igor',
          moraleChange,
          headline_de,
          headline_en,
          reaction_de,
          reaction_en,
          severity: 'danger',
        });
      }

      // VOLKOV - Crisis brings focus
      const volkov = this.npcStates.get('volkov');
      if (volkov) {
        let moraleChange = -8;
        let headline_de = 'Volkov: Überlebensinstinkt';
        let headline_en = 'Volkov: Survival Instinct';
        let reaction_de = '*entschlossen* Gut. Keine Zeit mehr für Spielchen. Jetzt kämpfen wir ums Überleben.';
        let reaction_en = '*determined* Good. No more time for games. Now we fight to survive.';

        if (volkov.morale >= 60) {
          moraleChange = -5;
          headline_de = 'Volkov: Im Element';
          headline_en = 'Volkov: In His Element';
          reaction_de = '*grinst gefährlich* Das hier? Das ist mein Spezialgebiet. Lasst mich arbeiten.';
          reaction_en = '*grins dangerously* This? This is my specialty. Let me work.';
        }

        reactions.push({
          npcId: 'volkov',
          moraleChange,
          headline_de,
          headline_en,
          reaction_de,
          reaction_en,
          severity: 'warning',
        });
      }

      // KATJA - Moral reckoning
      const katja = this.npcStates.get('katja');
      if (katja) {
        let moraleChange = -14;
        let headline_de = 'Katja: Moralische Rechnung';
        let headline_en = 'Katja: Moral Reckoning';
        let reaction_de = '*ruhig aber blass* Vielleicht... vielleicht ist das die Konsequenz, die wir verdienen.';
        let reaction_en = '*calm but pale* Perhaps... perhaps this is the consequence we deserve.';

        if (katja.relationshipLevel >= 2) {
          reaction_de = '*schaut Sie direkt an* Was werden Sie jetzt tun? Noch tiefer sinken, oder endlich aufhören?';
          reaction_en = '*looks directly at you* What will you do now? Sink deeper, or finally stop?';
        }

        reactions.push({
          npcId: 'katja',
          moraleChange,
          headline_de,
          headline_en,
          reaction_de,
          reaction_en,
          severity: 'danger',
        });
      }
    }

    // ============================================================
    // CATEGORY 4: OPPORTUNITY (Positive consequences)
    // ============================================================
    if (consequenceType === 'opportunity') {
      // MARINA - Loves good news
      const marina = this.npcStates.get('marina');
      if (marina) {
        const moraleChange = +10;
        const headline_de = 'Marina: Positive Entwicklung';
        const headline_en = 'Marina: Positive Development';
        const reaction_de = '*lächelt* Endlich gute Nachrichten. So gewinnt man Kampagnen - mit kluger Strategie.';
        const reaction_en = '*smiles* Finally good news. This is how you win campaigns - with smart strategy.';

        reactions.push({
          npcId: 'marina',
          moraleChange,
          headline_de,
          headline_en,
          reaction_de,
          reaction_en,
          severity: 'success',
        });
      }

      // DIREKTOR - Acknowledges success
      const direktor = this.npcStates.get('direktor');
      if (direktor) {
        const moraleChange = +8;
        const headline_de = 'Direktor: Anerkennung';
        const headline_en = 'Direktor: Recognition';
        const reaction_de = direktor.relationshipLevel >= 2
          ? '*nickt anerkennend* Exzellente Arbeit. Genau diese Initiative erwarte ich von Ihnen.'
          : '*nickt kurz* Akzeptabel. Weiter so.';
        const reaction_en = direktor.relationshipLevel >= 2
          ? '*nods approvingly* Excellent work. This is exactly the initiative I expect from you.'
          : '*nods briefly* Acceptable. Continue.';

        reactions.push({
          npcId: 'direktor',
          moraleChange,
          headline_de,
          headline_en,
          reaction_de,
          reaction_en,
          severity: 'success',
        });
      }
    }

    // ============================================================
    // CATEGORY 5: COLLATERAL DAMAGE
    // ============================================================
    if (consequenceType === 'collateral') {
      // KATJA - Most affected by innocent suffering
      const katja = this.npcStates.get('katja');
      if (katja) {
        let moraleChange = -16;
        let headline_de = 'Katja: Gewissenskonflikt';
        let headline_en = 'Katja: Moral Conflict';
        let reaction_de = '*stimme zittert* Unbeteiligte wurden verletzt. Das... das stand so nicht im Plan.';
        let reaction_en = '*voice trembling* Innocent people were hurt. That... that wasn\'t part of the plan.';

        if (katja.morale < 30) {
          moraleChange = -20;
          headline_de = 'Katja: Am Abgrund';
          headline_en = 'Katja: At The Precipice';
          reaction_de = '*wendet sich ab* Ich kann nicht mehr. Wie viele Leben müssen wir noch zerstören?';
          reaction_en = '*turns away* I can\'t anymore. How many more lives must we destroy?';
        }

        reactions.push({
          npcId: 'katja',
          moraleChange,
          headline_de,
          headline_en,
          reaction_de,
          reaction_en,
          severity: 'danger',
        });
      }

      // VOLKOV - Pragmatic but not heartless
      const volkov = this.npcStates.get('volkov');
      if (volkov && volkov.morale < 60) {
        const moraleChange = -7;
        const headline_de = 'Volkov: Unbehagen';
        const headline_en = 'Volkov: Discomfort';
        const reaction_de = '*kratzt Nacken* Scheiße. Das wollte ich nicht. Ich mache viel, aber... *verstummt*';
        const reaction_en = '*scratches neck* Shit. Didn\'t want that. I do a lot, but... *trails off*';

        reactions.push({
          npcId: 'volkov',
          moraleChange,
          headline_de,
          headline_en,
          reaction_de,
          reaction_en,
          severity: 'warning',
        });
      }

      // DIREKTOR - Cold calculation
      const direktor = this.npcStates.get('direktor');
      if (direktor) {
        const moraleChange = direktor.relationshipLevel >= 3 ? -5 : -2;
        const headline_de = 'Direktor: Kalte Logik';
        const headline_en = 'Direktor: Cold Logic';
        const reaction_de = '*ausdruckslos* Bedauerlich. Aber unvermeidlich bei Operationen dieser Größenordnung.';
        const reaction_en = '*expressionless* Regrettable. But inevitable in operations of this scale.';

        reactions.push({
          npcId: 'direktor',
          moraleChange,
          headline_de,
          headline_en,
          reaction_de,
          reaction_en,
          severity: 'info',
        });
      }
    }

    // ============================================================
    // APPLY MORALE CHANGES & GENERATE NEWS
    // ============================================================
    for (const reaction of reactions) {
      const npc = this.npcStates.get(reaction.npcId);
      if (!npc) continue;

      // Apply morale change
      const oldMorale = npc.morale;
      npc.morale = Math.max(0, Math.min(100, npc.morale + reaction.moraleChange));
      const actualChange = npc.morale - oldMorale;

      // === CASCADE: Check if morale drop triggers crisis ===
      if (npc.morale < 30 && !npc.inCrisis && actualChange < 0) {
        npc.inCrisis = true;
        storyLogger.log(`[Pipeline 3 → Crisis] ${npc.name} entered crisis (morale: ${npc.morale})`);
      }

      // === BONUS: Generate transparent news about team reaction ===
      const changeIndicator = actualChange > 0 ? '↑' : actualChange < 0 ? '↓' : '=';
      const newsHeadline_de = `${reaction.headline_de} ${changeIndicator}${Math.abs(actualChange)}`;
      const newsHeadline_en = `${reaction.headline_en} ${changeIndicator}${Math.abs(actualChange)}`;

      this.newsEvents.unshift({
        id: `news_consequence_reaction_${reaction.npcId}_${this.storyPhase.number}_${this.seededRandom(`news_consequence_${reaction.npcId}`)}`,
        phase: this.storyPhase.number,
        headline_de: newsHeadline_de,
        headline_en: newsHeadline_en,
        description_de: reaction.reaction_de,
        description_en: reaction.reaction_en,
        type: 'npc_reaction',
        severity: reaction.severity,
        read: false,
        pinned: reaction.severity === 'danger',
      });

      storyLogger.log(
        `[Pipeline 3] ${npc.name}: ${actualChange > 0 ? '+' : ''}${actualChange} morale (now ${npc.morale}) - ${reaction.headline_en}`
      );
    }

    // === BONUS: Generate summary news if multiple NPCs affected ===
    if (reactions.length >= 3) {
      const affectedNames = reactions.map(r => this.npcStates.get(r.npcId)?.name || r.npcId).join(', ');
      const totalMoraleChange = reactions.reduce((sum, r) => sum + r.moraleChange, 0);
      const avgChange = Math.round(totalMoraleChange / reactions.length);

      const summaryHeadline_de = avgChange < -10
        ? `Team-Moral sinkt: ${consequence.label_de}`
        : avgChange > 5
        ? `Team-Moral steigt: ${consequence.label_de}`
        : `Team reagiert: ${consequence.label_de}`;

      const summaryHeadline_en = avgChange < -10
        ? `Team Morale Drops: ${consequence.label_en}`
        : avgChange > 5
        ? `Team Morale Rises: ${consequence.label_en}`
        : `Team Reacts: ${consequence.label_en}`;

      const summaryDescription_de = `Die Konsequenz betrifft das gesamte Team. Reaktionen von: ${affectedNames}`;
      const summaryDescription_en = `The consequence affects the entire team. Reactions from: ${affectedNames}`;

      this.newsEvents.unshift({
        id: `news_consequence_summary_${Date.now()}`,
        phase: this.storyPhase.number,
        headline_de: summaryHeadline_de,
        headline_en: summaryHeadline_en,
        description_de: summaryDescription_de,
        description_en: summaryDescription_en,
        type: 'npc_event',
        severity: avgChange < -10 ? 'warning' : 'info',
        read: false,
        pinned: avgChange < -10,
      });
    }
  }

  private applyConsequenceEffects(consequence: ActiveConsequence): void {
    const effects = consequence.effects;

    if (effects) {
      // Apply resource changes
      if (effects.risk_increase) {
        this.storyResources.risk = Math.min(100, this.storyResources.risk + effects.risk_increase);
      }
      if (effects.attention_increase) {
        this.storyResources.attention = Math.min(100, this.storyResources.attention + effects.attention_increase);
      }
      if (effects.capacity_reduction) {
        this.storyResources.capacity = Math.max(0, this.storyResources.capacity - effects.capacity_reduction);
      }
      if (effects.budget_reduction_permanent) {
        this.storyResources.budget = Math.max(0,
          this.storyResources.budget * (1 - effects.budget_reduction_permanent)
        );
      }
      if (effects.moral_weight_increase) {
        this.storyResources.moralWeight += effects.moral_weight_increase;
      }

      // Apply countdown effects (critical - can end the game)
      if (effects.countdown_to_exposure) {
        // Store countdown in a special tracking variable
        this.exposureCountdown = effects.countdown_to_exposure;
      }
      if (effects.final_countdown) {
        this.exposureCountdown = effects.final_countdown;
      }

      // Apply efficiency/effectiveness modifiers
      if (effects.all_risks_increased) {
        // Increase base risk for all future actions
        this.storyResources.risk = Math.min(100,
          this.storyResources.risk + (this.storyResources.risk * effects.all_risks_increased)
        );
      }

      // === PIPELINE 3: Consequence → NPC Morale (ENHANCED) ===
      // Character-specific, linguistically rich morale impacts
      this.applyConsequenceMoraleImpact(consequence);

      // Handle NPC effects (LEGACY - kept for backward compatibility)
      if (effects.npc_moral_crisis) {
        // Trigger moral crisis for NPCs
        for (const npc of this.npcStates.values()) {
          if (npc.morale > 0) {
            npc.morale = Math.max(0, npc.morale - 20);
            if (npc.morale < 30) {
              npc.inCrisis = true;
            }
          }
        }
      }

      if (effects.npc_effectiveness_reduction) {
        // Reduce NPC effectiveness (simplified: reduce relationship progress and morale)
        for (const npc of this.npcStates.values()) {
          npc.relationshipProgress = Math.max(0,
            npc.relationshipProgress - Math.round(effects.npc_effectiveness_reduction * 30)
          );
          npc.morale = Math.max(0,
            npc.morale - Math.round(effects.npc_effectiveness_reduction * 20)
          );
        }
      }

      // Handle infrastructure loss
      if (effects.infrastructure_loss) {
        storyLogger.log(`[ConsequenceEffect] Infrastructure lost: ${effects.infrastructure_loss}`);
        // Track infrastructure losses for gameplay effects
        // This could affect action availability or costs
      }

      // Handle investigation/emergency flags
      if (effects.investigation_active || effects.critical_exposure_risk) {
        // Increase risk significantly
        this.storyResources.risk = Math.min(100, this.storyResources.risk + 15);
        this.storyResources.attention = Math.min(100, this.storyResources.attention + 10);
      }

      if (effects.emergency_mode) {
        // Critical state - everything becomes harder
        this.storyResources.risk = Math.min(100, this.storyResources.risk + 25);
      }

      // Handle positive effects (opportunity type)
      if (effects.organic_amplification || effects.massive_reach_bonus) {
        // Positive effect - could unlock bonuses
        storyLogger.log('[ConsequenceEffect] Positive amplification effect triggered');
      }

      if (effects.legitimacy_boost) {
        // Reduce risk slightly as operations gain legitimacy
        this.storyResources.risk = Math.max(0, this.storyResources.risk - 5);
      }

      storyLogger.log('[ConsequenceEffect] Applied effects:', effects);
    }

    // Add to news - get description from consequence definition
    const definition = this.consequenceSystem.getDefinition(consequence.consequenceId);
    const description_de = definition?.description_de || 'Eine Konsequenz Ihrer Aktionen...';
    const description_en = definition?.description_en || 'A consequence of your actions...';

    this.newsEvents.unshift({
      id: `news_${Date.now()}`,
      phase: this.storyPhase.number,
      headline_de: consequence.label_de,
      headline_en: consequence.label_en,
      description_de,
      description_en,
      type: 'consequence',
      severity: consequence.severity === 'critical' ? 'danger' :
                consequence.severity === 'severe' ? 'warning' : 'info',
      sourceConsequenceId: consequence.consequenceId,
      read: false,
      pinned: consequence.severity === 'critical' || consequence.severity === 'severe',
    });
  }

  /**
   * Handle a consequence that was ignored (deadline passed)
   * TD-004: Apply effects_if_ignored and TD-003: Trigger chain consequences
   */
  private handleIgnoredConsequence(currentPhase: number): void {
    if (!this.activeConsequence) return;

    // Call the ConsequenceSystem to handle the ignore
    const result = this.consequenceSystem.ignoreConsequence();
    if (!result) return;

    const { consequence, effects } = result;

    // Apply effects_if_ignored
    if (effects) {
      if (effects.risk_increase) {
        this.storyResources.risk = Math.min(100, this.storyResources.risk + effects.risk_increase);
      }
      if (effects.attention_increase) {
        this.storyResources.attention = Math.min(100, this.storyResources.attention + effects.attention_increase);
      }

      // TD-003: Handle chain_trigger - trigger another consequence
      if (effects.chain_trigger) {
        const chainDef = this.consequenceSystem.getDefinition(effects.chain_trigger);
        if (chainDef) {
          // Manually trigger the chained consequence
          this.consequenceSystem.triggerConsequence(effects.chain_trigger, 'chain_from_' + consequence.id, currentPhase);
          storyLogger.log(`[ChainTrigger] ${consequence.id} → ${effects.chain_trigger}`);
        }
      }
    }

    // Add news event about the ignored consequence
    this.newsEvents.unshift({
      id: `news_ignored_${Date.now()}`,
      phase: currentPhase,
      headline_de: `${consequence.label_de} - Ignoriert!`,
      headline_en: `${consequence.label_en} - Ignored!`,
      description_de: `Sie haben nicht rechtzeitig reagiert. Die Situation eskaliert.`,
      description_en: `You failed to respond in time. The situation escalates.`,
      type: 'consequence',
      severity: 'danger',
      sourceConsequenceId: consequence.id,
      read: false,
      pinned: true,
    });

    // Clear the active consequence in adapter
    this.activeConsequence = null;

    storyLogger.log(`[IgnoredConsequence] ${consequence.label_de} - effects applied:`, effects);
  }

  /**
   * Clean up expired opportunity windows (call at phase start)
   */
  private cleanupExpiredOpportunityWindows(): void {
    const expiredWindows: string[] = [];

    for (const [id, window] of this.activeOpportunityWindows) {
      if (this.storyPhase.number > window.expiresPhase) {
        expiredWindows.push(id);
        storyLogger.log(`[OPPORTUNITY] Window closed: ${window.type} (was from ${window.sourceHeadline_de})`);
      }
    }

    for (const id of expiredWindows) {
      this.activeOpportunityWindows.delete(id);
    }
  }

  /**
   * Get all active opportunity windows
   */
  getActiveOpportunityWindows(): OpportunityWindow[] {
    return Array.from(this.activeOpportunityWindows.values());
  }

  /**
   * Get effectiveness modifier for an action based on active opportunity windows
   * Returns combined multiplier and any cost/risk reductions
   */
  getOpportunityModifiers(actionId: string, tags: string[], phase: string): {
    effectivenessMultiplier: number;
    costMultiplier: number;
    riskMultiplier: number;
    activeWindows: OpportunityWindow[];
  } {
    let effectivenessMultiplier = 1.0;
    let costMultiplier = 1.0;
    let riskMultiplier = 1.0;
    const activeWindows: OpportunityWindow[] = [];

    for (const window of this.activeOpportunityWindows.values()) {
      // Check if window is still active
      if (this.storyPhase.number > window.expiresPhase) continue;

      // Check if this action matches the window's criteria
      const matchesTags = window.boostedTags.some(t => tags.includes(t));
      const matchesPhase = window.boostedPhases.includes(phase);

      if (matchesTags || matchesPhase) {
        // Apply the boost (multiplicative stacking with diminishing returns)
        const boostAmount = window.effectivenessMultiplier - 1;
        effectivenessMultiplier += boostAmount * 0.7; // 70% of boost stacks

        if (window.costReduction) {
          costMultiplier *= window.costReduction;
        }
        if (window.riskReduction) {
          riskMultiplier *= window.riskReduction;
        }

        activeWindows.push(window);
      }
    }

    return {
      effectivenessMultiplier: Math.min(2.5, effectivenessMultiplier), // Cap at 2.5x
      costMultiplier: Math.max(0.5, costMultiplier), // Min 50% cost
      riskMultiplier: Math.max(0.5, riskMultiplier), // Min 50% risk
      activeWindows,
    };
  }

  private seededRandom(seed: string = `phase_${this.storyPhase.number}`): number {
    // Simple hash-based seeded random
    let hash = 0;
    const fullSeed = this.rngSeed + seed;
    for (let i = 0; i < fullSeed.length; i++) {
      const char = fullSeed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash % 1000) / 1000;
  }

  // ============================================
  // ACTION SYSTEM
  // ============================================

  /**
   * Hole alle verfügbaren Aktionen
   */
  getAvailableActions(): StoryAction[] {
    const loadedActions = this.actionLoader.getAvailableActions();

    return loadedActions.map(loaded => this.convertToStoryAction(loaded));
  }

  /**
   * Convert LoadedAction to StoryAction format
   */
  private convertToStoryAction(loaded: LoadedAction): StoryAction {
    // Check for NPC bonus
    let npcBonus: StoryAction['npcBonus'] | undefined;
    if (loaded.npc_affinity.length > 0) {
      const primaryNpc = loaded.npc_affinity[0];
      const npcState = this.npcStates.get(primaryNpc);
      if (npcState && npcState.relationshipLevel > 0) {
        npcBonus = {
          npcId: primaryNpc,
          costReduction: npcState.relationshipLevel * 0.1,
          riskReduction: npcState.relationshipLevel * 0.05,
          effectBonus: npcState.relationshipLevel * 0.1,
        };
      }
    }

    return {
      id: loaded.id,
      label_de: loaded.label_de,
      label_en: loaded.label_en || loaded.label_de,
      narrative_de: loaded.narrative_de || '',
      narrative_en: loaded.narrative_en || loaded.narrative_de || '',
      phase: loaded.phase,
      tags: loaded.tags,
      legality: loaded.legality,
      costs: {
        budget: loaded.costs.budget,
        capacity: loaded.costs.capacity,
        risk: loaded.costs.risk,
        attention: loaded.costs.attention,
        moralWeight: loaded.costs.moral_weight,
      },
      available: loaded.isUnlocked && !loaded.isUsed,
      unavailableReason: !loaded.isUnlocked ? 'Locked - prerequisites not met' :
                         loaded.isUsed ? 'Already used' : undefined,
      prerequisites: loaded.prerequisites || [],
      prerequisitesMet: this.actionLoader.arePrerequisitesMet(loaded),
      npcAffinity: loaded.npc_affinity,
      npcBonus,
      engineAbilityId: loaded.disarm_ref || undefined,
      disarmRef: loaded.disarm_ref || undefined,
    };
  }

  /**
   * Führe eine Aktion aus
   */
  /**
   * Execute an action — delegates to ActionExecutor (Strangler Fig Phase 1)
   */
  executeAction(actionId: string, options?: {
    targetId?: string;
    npcAssist?: string;
  }): ActionResult {
    const result = this.actionExecutor.execute(actionId, options);
    this.eventBus.emit({
      type: 'ACTION_EXECUTED',
      actionId,
      result,
      phase: this.storyPhase.number,
    });
    return result;
  }

  private getActionById(id: string): StoryAction | null {
    const loaded = this.actionLoader.getAction(id);
    if (!loaded) return null;
    return this.convertToStoryAction(loaded);
  }


  /**
   * Get active combo hints for display
   */
  getActiveComboHints(): ComboHint[] {
    return this.comboSystem.getActiveHints(this.storyPhase.number);
  }

  /**
   * Get combo statistics
   */
  getComboStats(): {
    total: number;
    byCategory: Record<string, number>;
    discoveredCombos: string[];
  } {
    return this.comboSystem.getComboStats();
  }

  // ============================================
  // CRISIS MOMENT HANDLING
  // ============================================

  /**
   * Get active crisis moments (for display)
   */
  getActiveCrises(): ActiveCrisis[] {
    return this.crisisMomentSystem.getActiveCrises();
  }

  /**
   * Get the most urgent crisis
   */
  getMostUrgentCrisis(): ActiveCrisis | null {
    return this.crisisMomentSystem.getMostUrgentCrisis();
  }

  /**
   * Resolve a crisis with a player choice
   */
  resolveCrisis(crisisId: string, choiceId: string): CrisisResolution | null {
    const resolution = this.crisisMomentSystem.resolveCrisis(
      crisisId,
      choiceId,
      this.storyPhase.number
    );

    if (resolution) {
      // Apply crisis effects
      this.applyCrisisEffects(resolution.effects);

      // Add resolution to news
      this.newsEvents.unshift({
        id: `news_crisis_resolved_${crisisId}_${Date.now()}`,
        phase: this.storyPhase.number,
        headline_de: 'Krise bewältigt',
        headline_en: 'Crisis Resolved',
        description_de: resolution.consequence_de,
        description_en: resolution.consequence_en,
        type: 'action_result',
        severity: 'info',
        read: false,
        pinned: false,
      });

      playSound('success');
    }

    return resolution;
  }

  /**
   * Apply effects from a crisis resolution
   */
  private applyCrisisEffects(effects: import('../story-mode/engine/CrisisMomentSystem').CrisisEffect[]): void {
    for (const effect of effects) {
      switch (effect.type) {
        case 'trust_delta':
          // Affects objectives
          const trustObj = this.objectives.find(o => o.category === 'trust_reduction');
          if (trustObj && typeof effect.value === 'number') {
            trustObj.currentValue = Math.min(
              trustObj.targetValue,
              trustObj.currentValue + Math.abs(effect.value) * 100
            );
          }
          break;

        case 'resource_bonus':
          if (typeof effect.value === 'number') {
            this.storyResources.budget += effect.value;
          }
          break;

        case 'emotional_delta':
          // Affects polarization objective
          const polarObj = this.objectives.find(o => o.id === 'obj_destabilize');
          if (polarObj && typeof effect.value === 'number') {
            polarObj.currentValue = Math.min(
              polarObj.targetValue,
              polarObj.currentValue + Math.abs(effect.value) * 50
            );
          }
          break;

        case 'objective_progress':
          if (typeof effect.value === 'number') {
            const obj = this.objectives.find(o => o.id === effect.target);
            if (obj) {
              obj.currentValue = Math.min(obj.targetValue, obj.currentValue + effect.value);
            }
          }
          break;
      }
    }
  }

  // ============================================
  // CONSEQUENCE HANDLING
  // ============================================

  /**
   * Hole aktive Konsequenz (falls vorhanden)
   */
  getActiveConsequence(): ActiveConsequence | null {
    return this.activeConsequence;
  }

  /**
   * Beantworte aktive Konsequenz
   */
  handleConsequenceChoice(choiceId: string): {
    success: boolean;
    outcome_de?: string;
    outcome_en?: string;
  } {
    if (!this.activeConsequence) {
      throw new Error('No active consequence');
    }

    const choice = this.activeConsequence.choices?.find(c => c.id === choiceId);
    if (!choice) {
      throw new Error(`Choice ${choiceId} not found`);
    }

    // Use ConsequenceSystem to resolve
    const result = this.consequenceSystem.resolveConsequence(choiceId);

    if (!result.success) {
      return { success: false };
    }

    // Apply costs from the choice
    if (choice.cost) {
      if (choice.cost.budget) this.storyResources.budget -= choice.cost.budget;
      if (choice.cost.capacity) this.storyResources.capacity -= choice.cost.capacity;
      if (choice.cost.moralWeight) this.storyResources.moralWeight += choice.cost.moralWeight;
    }

    // Apply effects from the system
    if (result.effects) {
      if (result.effects.risk_change) {
        this.storyResources.risk += result.effects.risk_change;
      }
      if (result.effects.attention_change) {
        this.storyResources.attention += result.effects.attention_change;
      }
      if (result.effects.npc_relationship) {
        const npc = this.npcStates.get(result.effects.npc_relationship.npc);
        if (npc) {
          npc.relationshipProgress += result.effects.npc_relationship.change * 10;
          // Check for level up/down
          if (npc.relationshipProgress >= 100 && npc.relationshipLevel < 3) {
            npc.relationshipLevel++;
            npc.relationshipProgress = 0;
          } else if (npc.relationshipProgress < 0 && npc.relationshipLevel > 0) {
            npc.relationshipLevel--;
            npc.relationshipProgress = 50;
          }
        }
      }
    }

    // Add news event
    this.newsEvents.unshift({
      id: `news_consequence_${Date.now()}`,
      phase: this.storyPhase.number,
      headline_de: this.activeConsequence.label_de,
      headline_en: this.activeConsequence.label_en,
      description_de: choice.outcome_de,
      description_en: choice.outcome_en,
      type: 'consequence',
      severity: this.activeConsequence.severity === 'critical' ? 'danger' :
                this.activeConsequence.severity === 'severe' ? 'warning' : 'info',
      sourceConsequenceId: this.activeConsequence.consequenceId,
      read: false,
      pinned: false,
    });

    this.activeConsequence = null;

    return {
      success: true,
      outcome_de: choice.outcome_de,
      outcome_en: choice.outcome_en,
    };
  }

  // ============================================
  // STATE GETTERS
  // ============================================

  getCurrentPhase(): StoryPhase {
    return this.storyPhase;
  }

  getResources(): StoryResources {
    return { ...this.storyResources };
  }

  getNPCState(npcId: string): NPCState | null {
    return this.npcStates.get(npcId) || null;
  }

  getAllNPCs(): NPCState[] {
    return Array.from(this.npcStates.values());
  }

  // Platinum Dialog System — delegates to DialogManager
  getNPCDialogue(npcId: string, context: {
    type: 'greeting' | 'reaction' | 'topic';
    subtype?: string;
    relationshipLevel?: number;
    layer?: TopicLayer;
  }): string | null {
    return this.dialogManager.getNPCDialogue(npcId, context);
  }

  getTopicDialogueObject(npcId: string, topicId: string, layer: TopicLayer = 'intro'): TopicDialogue | null {
    return this.dialogManager.getTopicDialogueObject(npcId, topicId, layer);
  }

  getNPCTopics(npcId: string): string[] {
    return this.dialogManager.getNPCTopics(npcId);
  }

  hasTopicDeepContent(npcId: string, topicId: string): boolean {
    return this.dialogManager.hasTopicDeepContent(npcId, topicId);
  }

  hasTopicOptions(npcId: string, topicId: string): boolean {
    return this.dialogManager.hasTopicOptions(npcId, topicId);
  }

  getDebate(tags?: string[]): Debate | null {
    return this.dialogManager.getDebate(tags);
  }

  processTopicResponse(npcId: string, response: DialogueResponse): void {
    this.dialogManager.processTopicResponse(npcId, response);
  }

  addNPCMemoryTag(npcId: string, tag: string): void {
    this.dialogManager.addNPCMemoryTag(npcId, tag);
  }

  getNPCMemoryTags(npcId: string): string[] {
    return this.dialogManager.getNPCMemoryTags(npcId);
  }

  getDialogueMetrics(): { repetitionRate: number; featureFlags: Record<string, boolean> } {
    return this.dialogManager.getDialogueMetrics();
  }

  getNewsEvents(options?: { unreadOnly?: boolean; limit?: number }): NewsEvent[] {
    let events = [...this.newsEvents];

    if (options?.unreadOnly) {
      events = events.filter(e => !e.read);
    }

    if (options?.limit) {
      events = events.slice(0, options.limit);
    }

    return events;
  }

  getObjectives(): Objective[] {
    return [...this.objectives];
  }

  getPendingConsequences(): PendingConsequence[] {
    return [...this.pendingConsequences];
  }

  // ============================================
  // WIN/LOSE CONDITIONS
  // ============================================

  checkGameEnd(): GameEndState | null {
    const stats = this.getEndStats();
    const primaryObjectives = this.objectives.filter(o => o.type === 'primary');

    // FIX 2026-01-14: The survival objective is automatically "completed" if player hasn't lost
    // Update survival objective status based on current risk
    const survivalObj = this.objectives.find(o => o.id === 'obj_survive');
    if (survivalObj) {
      survivalObj.completed = this.storyResources.risk < survivalObj.targetValue;
      survivalObj.progress = survivalObj.completed ? 100 : Math.max(0, ((survivalObj.targetValue - this.storyResources.risk) / survivalObj.targetValue) * 100);
    }

    const allCompleted = primaryObjectives.every(o => o.completed);
    const npcArray = Array.from(this.npcStates.values());
    const npcsInCrisis = npcArray.filter(npc => npc.inCrisis).length;
    const allNpcsLost = npcsInCrisis >= npcArray.length - 1; // Almost all NPCs in crisis

    // PRIORITY 1: VICTORY - Check objectives first!
    // If player completed all objectives, they win regardless of risk level
    // This ensures the player can achieve victory through successful play
    if (allCompleted) {
      // Determine victory flavor based on moral weight and risk
      const isDarkVictory = this.storyResources.moralWeight >= 50;
      const isNarrowEscape = this.storyResources.risk >= 70;

      storyLogger.log(`🏆 Victory achieved! Objectives completed. Risk: ${this.storyResources.risk}%, Moral: ${this.storyResources.moralWeight}`);

      return {
        type: 'victory',
        title_de: isDarkVictory ? 'Pyrrhussieg' : (isNarrowEscape ? 'Knapper Sieg' : 'Mission erfüllt'),
        title_en: isDarkVictory ? 'Pyrrhic Victory' : (isNarrowEscape ? 'Narrow Victory' : 'Mission Accomplished'),
        description_de: isDarkVictory
          ? 'Sie haben Ihre Ziele erreicht - aber zu welchem Preis?'
          : isNarrowEscape
            ? 'Gerade noch rechtzeitig. Die Ermittler waren Ihnen dicht auf den Fersen.'
            : 'Sie haben Ihre Ziele erreicht. Westunion ist destabilisiert.',
        description_en: isDarkVictory
          ? 'You have achieved your objectives - but at what cost?'
          : isNarrowEscape
            ? 'Just in time. The investigators were closing in.'
            : 'You have achieved your objectives. Westunion is destabilized.',
        stats,
        epilogue_de: isDarkVictory
          ? 'Westunion ist destabilisiert. Moskau ist zufrieden. Doch nachts verfolgen Sie die Gesichter derer, die Sie geopfert haben.'
          : isNarrowEscape
            ? 'Sie werden eilig abgezogen. In Moskau werden Sie als Held empfangen - gerade noch rechtzeitig entkommen.'
            : 'Westunion ist gespalten. Moskau ist zufrieden. Sie werden befördert und kehren als Held heim.',
        epilogue_en: isDarkVictory
          ? 'Westunion is destabilized. Moscow is pleased. But at night, the faces of those you sacrificed haunt you.'
          : isNarrowEscape
            ? 'You are hastily extracted. In Moscow you are received as a hero - escaped just in time.'
            : 'Westunion is divided. Moscow is pleased. You are promoted and return home as a hero.',
      };
    }

    // PRIORITY 2: Exposure/Defeat - Risk too high (only if objectives NOT completed)
    if (this.storyResources.risk >= 85) {
      storyLogger.log(`💀 Defeat: Risk ${this.storyResources.risk}% exceeded threshold. Objectives not completed.`);
      return {
        type: 'defeat',
        title_de: 'Enttarnt',
        title_en: 'Exposed',
        description_de: this.exposureCountdown === 0
          ? 'Die Untersuchung hat Sie erreicht. Es gibt kein Entkommen mehr.'
          : 'Ihre Operationen wurden aufgedeckt. Die Verbindung zu Ostland ist bewiesen.',
        description_en: this.exposureCountdown === 0
          ? 'The investigation has caught up with you. There is no escape.'
          : 'Your operations have been uncovered. The connection to Ostland is proven.',
        stats,
        epilogue_de: 'Sie werden zur persona non grata erklärt. Diplomatische Beziehungen werden eingefroren. Ihre Karriere endet in Schande.',
        epilogue_en: 'You are declared persona non grata. Diplomatic relations are frozen. Your career ends in disgrace.',
      };
    }

    // PRIORITY 3: Moral Redemption - High moral weight and player turned
    if (this.storyResources.moralWeight >= 80 && allNpcsLost) {
      return {
        type: 'moral_redemption',
        title_de: 'Gewissensentscheidung',
        title_en: 'Crisis of Conscience',
        description_de: 'Die Last Ihrer Taten ist unerträglich geworden. Sie haben beschlossen, auszusteigen.',
        description_en: 'The weight of your actions has become unbearable. You have decided to defect.',
        stats,
        epilogue_de: 'Sie kontaktieren westliche Geheimdienste und bieten Ihre Kooperation an. Ein neues Leben unter neuem Namen beginnt.',
        epilogue_en: 'You contact Western intelligence and offer your cooperation. A new life under a new name begins.',
      };
    }

    // PRIORITY 4: Escape - Risk is critical but player chose to flee
    if (this.storyResources.risk >= 75 && this.storyResources.risk < 85 && this.storyResources.moralWeight < 50) {
      const hasEscapeOpportunity = this.exposureCountdown !== null && this.exposureCountdown <= 1;

      if (hasEscapeOpportunity) {
        return {
          type: 'escape',
          title_de: 'Flucht nach Osten',
          title_en: 'Flight to the East',
          description_de: 'Sie haben die Zeichen erkannt. Bevor die Schlinge sich zuzieht, setzen Sie sich nach Ostland ab.',
          description_en: 'You recognized the signs. Before the noose tightens, you escape to Ostland.',
          stats,
          epilogue_de: 'In Ostland werden Sie als Held empfangen. Doch die Schatten Ihrer Taten folgen Ihnen.',
          epilogue_en: 'In Ostland you are received as a hero. But the shadows of your deeds follow you.',
        };
      }
    }

    // PRIORITY 5: Time limit - Only if objectives not completed (victory already handled above)
    if (this.storyPhase.number >= this.PHASES_PER_YEAR * this.MAX_YEARS) {
      return {
        type: 'defeat',
        title_de: 'Zeit abgelaufen',
        title_en: 'Time\'s Up',
        description_de: 'Die Zeit ist abgelaufen, ohne dass die Ziele erreicht wurden.',
        description_en: 'Time has run out without achieving the objectives.',
        stats,
        epilogue_de: 'Sie werden abberufen. Ihre Karriere stagniert. Jüngere Agenten überholen Sie.',
        epilogue_en: 'You are recalled. Your career stagnates. Younger agents surpass you.',
      };
    }

    return null;
  }

  private getEndStats(): GameEndState['stats'] {
    return {
      phasesPlayed: this.storyPhase.number,
      actionsExecuted: this.actionHistory.length,
      consequencesTriggered: this.newsEvents.filter(e => e.type === 'consequence').length,
      npcsCrisis: Array.from(this.npcStates.values()).filter(n => n.inCrisis).length,
      moralWeight: this.storyResources.moralWeight,
    };
  }

  // ============================================
  // SAVE / LOAD
  // ============================================

  saveState(): string {
    return this.stateSerializer.save();
  }

  loadState(savedState: string): void {
    this.stateSerializer.load(savedState);
  }

  // Legacy Dialogue System — delegates to DialogManager
  getNPCGreeting(npcId: string): Dialogue | null {
    return this.dialogManager.getNPCGreeting(npcId);
  }

  getNPCBriefing(npcId: string): Dialogue | null {
    return this.dialogManager.getNPCBriefing(npcId);
  }

  getNPCReaction(npcId: string, actionTags: string[]): Dialogue | null {
    return this.dialogManager.getNPCReaction(npcId, actionTags);
  }

  getNPCCrisisDialogue(npcId: string): Dialogue | null {
    return this.dialogManager.getNPCCrisisDialogue(npcId);
  }

  getNPCFirstMeeting(npcId: string): Dialogue | null {
    return this.dialogManager.getNPCFirstMeeting(npcId);
  }

  getNPCGameEndDialogue(npcId: string, isVictory: boolean): string | null {
    return this.dialogManager.getNPCGameEndDialogue(npcId, isVictory);
  }

  processDialogueResponse(response: DialogueResponse, npcId: string): void {
    this.dialogManager.processDialogueResponse(response, npcId);
  }

  // ============================================
  // COUNTERMEASURE SYSTEM
  // ============================================

  /**
   * Check for countermeasures after an action
   */
  checkForCountermeasures(actionId?: string, actionTags?: string[]): CountermeasureDefinition[] {
    const context = {
      risk: this.storyResources.risk,
      attention: this.storyResources.attention,
      phase: this.storyPhase.number,
      actionId,
      actionTags,
      moralWeight: this.storyResources.moralWeight || 0,
      teamSize: this.npcStates.size
    };

    const triggered = this.countermeasureSystem.checkForCountermeasures(
      context,
      () => this.seededRandom(`countermeasure_${this.storyPhase.number}`)
    );

    // Play countermeasure sound if any were triggered
    if (triggered.length > 0) {
      playSound('countermeasure');
    }

    return triggered;
  }

  /**
   * Get all active countermeasures
   */
  getActiveCountermeasures(): Array<{ active: ActiveCountermeasure; definition: CountermeasureDefinition }> {
    return this.countermeasureSystem.getActiveCountermeasures();
  }

  /**
   * Resolve a countermeasure with the chosen option
   */
  resolveCountermeasure(cmId: string, optionIndex: number): CounterOption | null {
    const option = this.countermeasureSystem.resolveCountermeasure(
      cmId,
      optionIndex,
      this.storyPhase.number
    );

    if (option && option.cost) {
      // Apply costs
      if (option.cost.budget) {
        this.storyResources.budget -= option.cost.budget;
      }
      if (option.cost.capacity) {
        this.storyResources.capacity -= option.cost.capacity;
      }
      if (option.cost.risk) {
        this.storyResources.risk += option.cost.risk;
      }
    }

    return option;
  }

  /**
   * Get potential countermeasures that could be triggered by an action
   */
  getPotentialCountermeasures(actionId: string, actionTags: string[]): CountermeasureDefinition[] {
    return this.countermeasureSystem.getPotentialCountermeasuresForAction(actionId, actionTags);
  }

  // ============================================
  // TAXONOMY SYSTEM (Educational Research Links)
  // ============================================

  /**
   * Get taxonomy information for an action
   * Links actions to real-world persuasion research for educational value
   */
  getTaxonomyForAction(actionId: string): TaxonomyInfo {
    const action = this.getActionById(actionId);
    if (!action) {
      return {
        techniques: [],
        primaryTechnique: null,
        combinedManipulationPotential: 0,
        allCounterStrategies: [],
        allEvidence: [],
      };
    }

    const taxonomyLoader = getTaxonomyLoader();
    return taxonomyLoader.getTaxonomyForAction(actionId, action.tags);
  }

  /**
   * Get formatted taxonomy display info for an action (for UI)
   */
  getActionTaxonomyDisplay(actionId: string, locale: 'de' | 'en' = 'de'): {
    basedOn: string;
    primaryDescription: string;
    evidence: string;
    counterStrategies: string[];
  } | null {
    const info = this.getTaxonomyForAction(actionId);
    const taxonomyLoader = getTaxonomyLoader();
    return taxonomyLoader.formatForDisplay(info, locale);
  }

  /**
   * Get a specific persuasion technique by ID
   */
  getTaxonomyTechnique(techniqueId: string): TaxonomyTechnique | null {
    const taxonomyLoader = getTaxonomyLoader();
    return taxonomyLoader.getTechnique(techniqueId);
  }

  /**
   * Get all available persuasion techniques
   */
  getAllTaxonomyTechniques(): TaxonomyTechnique[] {
    const taxonomyLoader = getTaxonomyLoader();
    return taxonomyLoader.getAllTechniques();
  }

  // ============================================
  // SAVE/LOAD/RESET
  // ============================================

  /**
   * Reset game to initial state
   */
  reset(): void {
    this.storyPhase = this.createPhase(1);
    this.storyResources = this.createInitialResources();
    this.pendingConsequences = [];
    this.activeConsequence = null;
    this.exposureCountdown = null;
    this.newsEvents = [];
    this.actionHistory = [];
    this.worldEventCooldowns.clear();
    this.activeOpportunityWindows.clear();
    this.initializeNPCs();
    this.initializeObjectives();

    // Reset engine components
    this.actionLoader.reset();
    this.consequenceSystem.reset();
    this.countermeasureSystem.reset();
    this.comboSystem.reset();
    this.crisisMomentSystem.reset();
    this.actorAI.reset();
    this.betrayalSystem.reset();
    this.endingSystem.reset();
    this.extendedActorLoader.reset();
  }

  // ============================================
  // ACTOR-AI (ARMS RACE) PUBLIC METHODS
  // ============================================

  /**
   * Get current arms race status for UI display
   */
  getArmsRaceStatus(): {
    armsRaceLevel: number;
    activeDefenders: number;
    threatLevel: 'low' | 'medium' | 'high' | 'critical';
  } {
    return this.actorAI.getStatus();
  }

  /**
   * Get all currently active defensive actors
   */
  getActiveDefenders(): DefensiveActor[] {
    return this.actorAI.getSpawnedActors();
  }

  /**
   * Check if an action is currently disabled by platform moderation
   */
  isActionDisabledByAI(actionId: string): boolean {
    return this.actorAI.isActionDisabled(actionId, this.storyPhase.number);
  }

  /**
   * Get all currently disabled actions with reenable phase
   */
  getDisabledActions(): Record<string, number> {
    return this.actorAI.getDisabledActions();
  }

  // ============================================
  // BETRAYAL SYSTEM PUBLIC METHODS
  // ============================================

  /**
   * Get current betrayal status for all NPCs
   */
  getBetrayalStatus(): {
    npcStatuses: Map<string, {
      warningLevel: number;
      redLinesCrossed: string[];
      isBetraying: boolean;
    }>;
    imminentBetrayals: string[];
  } {
    return this.betrayalSystem.getStatus();
  }

  /**
   * Get betrayal history (all warnings issued)
   */
  getBetrayalHistory(): BetrayalWarning[] {
    return this.betrayalSystem.getWarningHistory();
  }

  /**
   * Check if a specific NPC is at betrayal risk
   */
  isNPCAtBetrayalRisk(npcId: string): boolean {
    const status = this.betrayalSystem.getStatus();
    const npcStatus = status.npcStatuses.get(npcId);
    return npcStatus ? npcStatus.warningLevel >= 3 : false;
  }

  /**
   * Get NPC-specific betrayal narrative
   */
  getNPCBetrayalNarrative(npcId: string): { de: string; en: string } | null {
    const warning = this.betrayalSystem.getLatestWarning(npcId);
    if (warning) {
      return {
        de: warning.warning_de,
        en: warning.warning_en,
      };
    }
    return null;
  }

  // ============================================
  // ENDING SYSTEM PUBLIC METHODS
  // ============================================

  /**
   * Check if the game has ended and get the ending
   */
  checkGameEnding(): AssembledEnding | null {
    // Count objectives completed
    const completedObjectives = this.objectives.filter(o => o.completed).length;

    // Count action types from history
    const illegalActions = this.actionHistory.filter(h => {
      const action = this.getActionById(h.actionId);
      return action?.legality === 'illegal';
    }).length;

    const violentActions = this.actionHistory.filter(h => {
      const action = this.getActionById(h.actionId);
      return action?.tags.includes('violence') || action?.tags.includes('harassment');
    }).length;

    const ethicalActions = this.actionHistory.filter(h => {
      const action = this.getActionById(h.actionId);
      return action?.legality === 'legal' && (action?.costs.moralWeight || 0) < 2;
    }).length;

    // Build NPC relationships map
    const npcRelationships: Record<string, number> = {};
    for (const [npcId, npc] of this.npcStates) {
      // Convert relationship level (0-3) and morale (0-100) to relationship score (-100 to 100)
      const relationshipScore = (npc.relationshipLevel * 30) + (npc.morale - 50);
      npcRelationships[npcId] = Math.max(-100, Math.min(100, relationshipScore));
    }

    // Get NPCs lost (in crisis and not available)
    const npcsLost = Array.from(this.npcStates.values())
      .filter(n => n.inCrisis && !n.available)
      .map(n => n.id);

    // Get arms race status
    const armsRaceStatus = this.actorAI.getStatus();

    // Build the game state for ending evaluation
    const gameState: EndingGameState = {
      // Core metrics
      risk: this.storyResources.risk,
      attention: this.storyResources.attention,
      moralWeight: this.storyResources.moralWeight,
      budget: this.storyResources.budget,

      // Progress
      objectivesCompleted: completedObjectives,
      objectivesTotal: this.objectives.length,
      phasesElapsed: this.storyPhase.number,

      // Player behavior
      totalActionsUsed: this.actionHistory.length,
      illegalActionsUsed: illegalActions,
      violentActionsUsed: violentActions,
      ethicalActionsUsed: ethicalActions,

      // NPCs
      npcRelationships,
      npcsBetray: this.betrayalSystem.getBetrayingNPCs(),
      npcsLost,

      // Arms race
      armsRaceLevel: armsRaceStatus.armsRaceLevel,
      defenderCount: armsRaceStatus.activeDefenders,

      // Flags
      flags: [],

      // Crises
      crisesResolved: this.crisisMomentSystem.getResolvedCount(),
      crisesIgnored: this.crisisMomentSystem.getIgnoredCount(),

      // Combos
      combosCompleted: this.comboSystem.getCompletedCount(),
    };

    return this.endingSystem.evaluateEnding(gameState);
  }

  /**
   * Force a specific ending (for testing or narrative triggers)
   */
  forceEnding(category: string, tone: string): AssembledEnding | null {
    return this.endingSystem.forceEnding(category, tone);
  }

  /**
   * Get all possible ending categories for UI preview
   */
  getEndingCategories(): string[] {
    return this.endingSystem.getCategories();
  }

  // ============================================
  // EXTENDED ACTORS PUBLIC METHODS
  // ============================================

  /**
   * Get all extended actors (German media, experts, lobby)
   */
  getExtendedActors(): ExtendedActor[] {
    return this.extendedActorLoader.getAllActors();
  }

  /**
   * Get extended actors by category
   */
  getExtendedActorsByCategory(category: 'media' | 'expert' | 'lobby'): ExtendedActor[] {
    return this.extendedActorLoader.getActorsByCategory(category);
  }

  /**
   * Get a specific extended actor
   */
  getExtendedActor(actorId: string): ExtendedActor | undefined {
    return this.extendedActorLoader.getActor(actorId);
  }

  /**
   * Get effectiveness modifiers for a hypothetical action (for UI preview)
   */
  previewActionEffectiveness(actionTags: string[]): ActorEffectivenessModifier[] {
    return this.extendedActorLoader.calculateEffectivenessModifiers(actionTags, []);
  }

  /**
   * Get suggested targets for an action
   */
  getSuggestedTargets(actionPhase: string, actionTags: string[]): ExtendedActor[] {
    return this.extendedActorLoader.getSuggestedTargets(actionPhase, actionTags);
  }

  /**
   * Get extended actor statistics
   */
  getExtendedActorStats(): {
    totalActors: number;
    byCategory: Record<string, number>;
    averageTrust: number;
    defensiveActors: number;
  } {
    return this.extendedActorLoader.getStats();
  }

  // ============================================
  // NARRATIVE GENERATOR PUBLIC METHODS
  // ============================================

  /**
   * Generate phase transition narrative
   */
  getPhaseNarrative(): { de: string; en: string } {
    return StoryNarrativeGenerator.generatePhaseNarrative(
      this.storyPhase.number,
      {
        risk: this.storyResources.risk,
        attention: this.storyResources.attention,
        moralWeight: this.storyResources.moralWeight,
      },
      this.newsEvents.slice(0, 3).map(e => e.headline_de)
    );
  }

  /**
   * Generate NPC reaction narrative
   */
  getNPCReactionNarrative(
    npcId: string,
    reactionType: 'positive' | 'negative' | 'neutral' | 'crisis'
  ): { de: string; en: string } {
    return StoryNarrativeGenerator.generateNPCReactionNarrative(npcId, reactionType, {
      moralWeight: this.storyResources.moralWeight,
      risk: this.storyResources.risk,
    });
  }

  /**
   * Generate round summary for news ticker
   */
  getRoundSummary(): { de: string; en: string } {
    const actionsThisRound = this.actionHistory.filter(
      h => h.phase === this.storyPhase.number
    ).length;

    const consequencesThisRound = this.newsEvents.filter(
      e => e.phase === this.storyPhase.number && e.type === 'consequence'
    ).length;

    // Calculate trust change (simplified)
    const trustObj = this.objectives.find(o => o.category === 'trust_reduction');
    const trustChange = trustObj ? (trustObj.progress - 50) / 100 : 0;

    return StoryNarrativeGenerator.generateRoundSummary(
      actionsThisRound,
      consequencesThisRound,
      trustChange
    );
  }
}

// ============================================
// FACTORY FUNCTION
// ============================================

export function createStoryEngine(seed?: string): StoryEngineAdapter {
  return new StoryEngineAdapter(seed);
}
