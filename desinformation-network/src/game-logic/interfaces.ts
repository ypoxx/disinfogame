/**
 * interfaces.ts — Dependency Injection Architecture Overview
 *
 * This file serves as the central documentation and type hub for the
 * Strangler Fig extraction of StoryEngineAdapter into focused modules.
 *
 * ## Architecture
 *
 * StoryEngineAdapter is a ~5100-line God-object (facade over 10+ subsystems).
 * We are incrementally extracting logic into standalone classes that receive
 * their dependencies via Constructor Injection. Each extracted module defines
 * a narrow `*Deps` interface describing exactly what it needs from the engine.
 *
 * ```
 *  StoryEngineAdapter (facade)
 *    ├── ActionExecutor      ← ActionExecutorDeps
 *    ├── PhaseManager         ← PhaseManagerDeps
 *    ├── NewsGenerator        ← NewsGeneratorDeps
 *    ├── NPCOrchestrator      ← NPCOrchestratorDeps
 *    ├── StateSerializer      ← StateSerializerDeps
 *    ├── DialogManager        ← DialogManagerDeps
 *    └── GameEventBus         ← standalone (no deps)
 * ```
 *
 * StoryEngineAdapter implements all `*Deps` interfaces by wiring its internal
 * state and subsystem references into each module's constructor. The modules
 * do NOT import StoryEngineAdapter — they only depend on their `*Deps` type.
 * This enables:
 *   - Unit testing each module with a mock deps object
 *   - Incremental migration (modules can be swapped independently)
 *   - Clear dependency documentation (each interface is the contract)
 *
 * ## IStoryEngine
 *
 * The `IStoryEngine` interface below captures every public method that
 * StoryEngineAdapter exposes to the React UI layer (useStoryGameState hook).
 * It is intentionally NOT implemented by StoryEngineAdapter today — it exists
 * as a reference contract for consumers and future refactoring.
 *
 * @module interfaces
 */

// ============================================
// Type Imports (used by IStoryEngine)
// ============================================

import type {
  StoryPhase,
  StoryResources,
  StoryAction,
  ActionResult,
  NPCState,
  PendingConsequence,
  ActiveConsequence,
  NewsEvent,
  Objective,
  GameEndState,
  OpportunityWindow,
} from './StoryEngineAdapter';

import type { CrisisMoment, ActiveCrisis, CrisisResolution } from '../story-mode/engine/CrisisMomentSystem';
import type { AIAction, DefensiveActor } from '../story-mode/engine/StoryActorAI';
import type { ComboHint } from '../story-mode/engine/StoryComboSystem';
import type { BetrayalWarning } from '../story-mode/engine/BetrayalSystem';
import type { AssembledEnding } from '../story-mode/engine/EndingSystem';
import type { ExtendedActor, ActorEffectivenessModifier } from '../story-mode/engine/ExtendedActorLoader';
import type { CountermeasureDefinition, ActiveCountermeasure, CounterOption } from '../story-mode/engine/CountermeasureSystem';
import type { TaxonomyInfo, TaxonomyTechnique } from '../story-mode/engine/TaxonomyLoader';
import type { Dialogue, DialogueResponse, TopicDialogue, TopicLayer, Debate } from '../story-mode/engine/DialogLoader';

// ============================================
// Re-export all Deps interfaces from modules
// ============================================

/**
 * ActionExecutor dependency contract.
 * Provides state access/mutation, subsystem refs, and utilities
 * needed to execute an action and process its full side-effect chain.
 */
export type { ActionExecutorDeps } from './ActionExecutor';

/**
 * PhaseManager dependency contract.
 * Provides state access/mutation, subsystem narrow-interfaces,
 * and utilities needed to advance the game by one phase.
 */
export type { PhaseManagerDeps } from './PhaseManager';

/**
 * NewsGenerator dependency contract.
 * Provides state access, opportunity window management,
 * subsystem refs (betrayal), and RNG needed to generate
 * action news, world events, NPC crisis events, and resource trend events.
 */
export type { NewsGeneratorDeps } from './NewsGenerator';

/**
 * NPCOrchestrator dependency contract.
 * Provides state access for context building, news event mutation,
 * betrayal system ref, and RNG needed to manage NPC state,
 * consequence morale impacts, dialogue, and betrayal status.
 */
export type { NPCOrchestratorDeps } from './NPCOrchestrator';

/**
 * StateSerializer dependency contract.
 * Provides all state getters/setters and subsystem export/import methods
 * needed to serialize and deserialize the full game state.
 */
export type { StateSerializerDeps } from './StateSerializer';

/**
 * DialogManager dependency contract.
 * Provides state access (phase, resources, NPCs, objectives, dialogues)
 * and RNG needed to power both the Platinum and Legacy dialogue systems.
 */
export type { DialogManagerDeps } from './DialogManager';

// GameEventBus is standalone — no deps interface needed.

// ============================================
// IStoryEngine — Public API Contract
// ============================================

/**
 * Complete public interface of StoryEngineAdapter.
 *
 * Every method listed here is callable from the React layer
 * (primarily via useStoryGameState.ts). This interface serves as:
 *   1. Documentation of the engine's surface area
 *   2. A future extraction target (program to the interface, not the class)
 *   3. A contract for test doubles and mock engines
 *
 * Methods are grouped by subsystem to match the internal module boundaries.
 */
export interface IStoryEngine {

  // ------------------------------------------
  // Phase & Core State
  // ------------------------------------------

  /** Advance the game by one phase (month). Returns phase transition results. */
  advancePhase(): {
    newPhase: StoryPhase;
    resourceChanges: Partial<StoryResources>;
    triggeredConsequences: ActiveConsequence[];
    worldEvents: NewsEvent[];
    triggeredCrises: CrisisMoment[];
    aiActions: AIAction[];
    newDefenders: DefensiveActor[];
  };

  /** Get the current phase (year, month, season, etc.). */
  getCurrentPhase(): StoryPhase;

  /** Get a snapshot of current resources. */
  getResources(): StoryResources;

  /** Reset the game to initial state. */
  reset(): void;

  // ------------------------------------------
  // Action System
  // ------------------------------------------

  /** Get all actions available to the player this phase. */
  getAvailableActions(): StoryAction[];

  /** Execute an action by ID, optionally with a target or NPC assist. */
  executeAction(actionId: string, options?: {
    targetId?: string;
    npcAssist?: string;
  }): ActionResult;

  // ------------------------------------------
  // Combo System
  // ------------------------------------------

  /** Get active combo hints for UI display. */
  getActiveComboHints(): ComboHint[];

  /** Get combo statistics (total completions, by category, discovered combos). */
  getComboStats(): {
    total: number;
    byCategory: Record<string, number>;
    discoveredCombos: string[];
  };

  // ------------------------------------------
  // Crisis Moment System
  // ------------------------------------------

  /** Get all currently active crisis moments. */
  getActiveCrises(): ActiveCrisis[];

  /** Get the most urgent unresolved crisis. */
  getMostUrgentCrisis(): ActiveCrisis | null;

  /** Resolve a crisis by selecting a choice. */
  resolveCrisis(crisisId: string, choiceId: string): CrisisResolution | null;

  // ------------------------------------------
  // Consequence System
  // ------------------------------------------

  /** Get the currently active consequence requiring player choice (if any). */
  getActiveConsequence(): ActiveConsequence | null;

  /** Handle the player's choice for an active consequence. */
  handleConsequenceChoice(choiceId: string): {
    success: boolean;
    outcome_de?: string;
    outcome_en?: string;
  };

  /** Get all pending (not yet activated) consequences. */
  getPendingConsequences(): PendingConsequence[];

  // ------------------------------------------
  // Opportunity Windows
  // ------------------------------------------

  /** Get all active opportunity windows (time-limited boosts from world events). */
  getActiveOpportunityWindows(): OpportunityWindow[];

  /** Calculate effectiveness modifiers for an action based on active windows. */
  getOpportunityModifiers(actionId: string, tags: string[], phase: string): {
    effectivenessMultiplier: number;
    costMultiplier: number;
    riskMultiplier: number;
    activeWindows: OpportunityWindow[];
  };

  // ------------------------------------------
  // NPC State
  // ------------------------------------------

  /** Get a single NPC's state by ID. */
  getNPCState(npcId: string): NPCState | null;

  /** Get all NPC states. */
  getAllNPCs(): NPCState[];

  // ------------------------------------------
  // Dialogue System (Platinum)
  // ------------------------------------------

  /** Get NPC dialogue by context type (greeting, reaction, topic). */
  getNPCDialogue(npcId: string, context: {
    type: 'greeting' | 'reaction' | 'topic';
    subtype?: string;
    relationshipLevel?: number;
    layer?: TopicLayer;
  }): string | null;

  /** Get full topic dialogue object for progressive disclosure UI. */
  getTopicDialogueObject(npcId: string, topicId: string, layer?: TopicLayer): TopicDialogue | null;

  /** Get available conversation topics for an NPC. */
  getNPCTopics(npcId: string): string[];

  /** Check if a topic has deeper content layers. */
  hasTopicDeepContent(npcId: string, topicId: string): boolean;

  /** Check if a topic has player-choice options. */
  hasTopicOptions(npcId: string, topicId: string): boolean;

  /** Get a debate dialogue if conditions are met. */
  getDebate(tags?: string[]): Debate | null;

  /** Process the player's response to a topic dialogue (applies effects). */
  processTopicResponse(npcId: string, response: DialogueResponse): void;

  /** Add a memory tag to an NPC's dialogue memory. */
  addNPCMemoryTag(npcId: string, tag: string): void;

  /** Get an NPC's dialogue memory tags. */
  getNPCMemoryTags(npcId: string): string[];

  /** Get dialogue system metrics (repetition rate, feature flags). */
  getDialogueMetrics(): { repetitionRate: number; featureFlags: Record<string, boolean> };

  // ------------------------------------------
  // Dialogue System (Legacy)
  // ------------------------------------------

  /** Get greeting dialogue for an NPC. */
  getNPCGreeting(npcId: string): Dialogue | null;

  /** Get briefing dialogue for an NPC. */
  getNPCBriefing(npcId: string): Dialogue | null;

  /** Get NPC reaction dialogue to action tags. */
  getNPCReaction(npcId: string, actionTags: string[]): Dialogue | null;

  /** Get crisis dialogue for an NPC in crisis. */
  getNPCCrisisDialogue(npcId: string): Dialogue | null;

  /** Get first meeting dialogue for an NPC. */
  getNPCFirstMeeting(npcId: string): Dialogue | null;

  /** Get game-end dialogue for an NPC. */
  getNPCGameEndDialogue(npcId: string, isVictory: boolean): string | null;

  /** Process player response to legacy dialogue (applies relationship/morale). */
  processDialogueResponse(response: DialogueResponse, npcId: string): void;

  // ------------------------------------------
  // News & Events
  // ------------------------------------------

  /** Get news events, optionally filtered. */
  getNewsEvents(options?: { unreadOnly?: boolean; limit?: number }): NewsEvent[];

  // ------------------------------------------
  // Objectives
  // ------------------------------------------

  /** Get all game objectives with progress. */
  getObjectives(): Objective[];

  // ------------------------------------------
  // Win/Lose Conditions
  // ------------------------------------------

  /** Check if the game has ended (legacy check). */
  checkGameEnd(): GameEndState | null;

  // ------------------------------------------
  // Save / Load
  // ------------------------------------------

  /** Serialize the game state to a JSON string. */
  saveState(): string;

  /** Load game state from a JSON string. */
  loadState(savedState: string): void;

  // ------------------------------------------
  // Countermeasure System
  // ------------------------------------------

  /** Check for countermeasures triggered after an action. */
  checkForCountermeasures(actionId?: string, actionTags?: string[]): CountermeasureDefinition[];

  /** Get all currently active countermeasures. */
  getActiveCountermeasures(): Array<{ active: ActiveCountermeasure; definition: CountermeasureDefinition }>;

  /** Resolve a countermeasure with the chosen option index. */
  resolveCountermeasure(cmId: string, optionIndex: number): CounterOption | null;

  /** Preview countermeasures that could trigger for an action. */
  getPotentialCountermeasures(actionId: string, actionTags: string[]): CountermeasureDefinition[];

  // ------------------------------------------
  // Taxonomy System (Educational)
  // ------------------------------------------

  /** Get taxonomy info linking an action to real-world persuasion research. */
  getTaxonomyForAction(actionId: string): TaxonomyInfo;

  /** Get formatted taxonomy display data for a specific action. */
  getActionTaxonomyDisplay(actionId: string, locale?: 'de' | 'en'): {
    basedOn: string;
    primaryDescription: string;
    evidence: string;
    counterStrategies: string[];
  } | null;

  /** Get a specific persuasion technique by ID. */
  getTaxonomyTechnique(techniqueId: string): TaxonomyTechnique | null;

  /** Get all available persuasion techniques. */
  getAllTaxonomyTechniques(): TaxonomyTechnique[];

  // ------------------------------------------
  // Actor-AI (Arms Race)
  // ------------------------------------------

  /** Get current arms race status for UI display. */
  getArmsRaceStatus(): {
    armsRaceLevel: number;
    activeDefenders: number;
    threatLevel: 'low' | 'medium' | 'high' | 'critical';
  };

  /** Get all currently active defensive actors. */
  getActiveDefenders(): DefensiveActor[];

  /** Check if an action is currently disabled by AI/platform moderation. */
  isActionDisabledByAI(actionId: string): boolean;

  /** Get all disabled actions with their re-enable phase. */
  getDisabledActions(): Record<string, number>;

  // ------------------------------------------
  // Betrayal System
  // ------------------------------------------

  /** Get betrayal status for all NPCs. */
  getBetrayalStatus(): {
    npcStatuses: Map<string, {
      warningLevel: number;
      redLinesCrossed: string[];
      isBetraying: boolean;
    }>;
    imminentBetrayals: string[];
  };

  /** Get full betrayal warning history. */
  getBetrayalHistory(): BetrayalWarning[];

  /** Check if a specific NPC is at high betrayal risk. */
  isNPCAtBetrayalRisk(npcId: string): boolean;

  /** Get the latest betrayal warning narrative for an NPC. */
  getNPCBetrayalNarrative(npcId: string): { de: string; en: string } | null;

  // ------------------------------------------
  // Ending System
  // ------------------------------------------

  /** Evaluate whether the game has ended and assemble the ending. */
  checkGameEnding(): AssembledEnding | null;

  /** Force a specific ending (testing/narrative triggers). */
  forceEnding(category: string, tone: string): AssembledEnding | null;

  /** Get all possible ending categories. */
  getEndingCategories(): string[];

  // ------------------------------------------
  // Extended Actors (German media, experts, lobby)
  // ------------------------------------------

  /** Get all extended actors. */
  getExtendedActors(): ExtendedActor[];

  /** Get extended actors filtered by category. */
  getExtendedActorsByCategory(category: 'media' | 'expert' | 'lobby'): ExtendedActor[];

  /** Get a specific extended actor by ID. */
  getExtendedActor(actorId: string): ExtendedActor | undefined;

  /** Preview action effectiveness against extended actors (for UI). */
  previewActionEffectiveness(actionTags: string[]): ActorEffectivenessModifier[];

  /** Get suggested actor targets for an action. */
  getSuggestedTargets(actionPhase: string, actionTags: string[]): ExtendedActor[];

  /** Get aggregate statistics for extended actors. */
  getExtendedActorStats(): {
    totalActors: number;
    byCategory: Record<string, number>;
    averageTrust: number;
    defensiveActors: number;
  };

  // ------------------------------------------
  // Narrative Generator
  // ------------------------------------------

  /** Generate narrative text for a phase transition. */
  getPhaseNarrative(): { de: string; en: string };

  /** Generate NPC reaction narrative. */
  getNPCReactionNarrative(
    npcId: string,
    reactionType: 'positive' | 'negative' | 'neutral' | 'crisis'
  ): { de: string; en: string };

  /** Generate a round summary for the news ticker. */
  getRoundSummary(): { de: string; en: string };
}
