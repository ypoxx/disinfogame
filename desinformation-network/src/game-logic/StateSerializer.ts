/**
 * StateSerializer — Extracted from StoryEngineAdapter (Strangler Fig Phase 7)
 *
 * Handles save/load with versioned state and migration support.
 * Each state shape change bumps the version, and a migration layer
 * ensures old saves remain compatible.
 */

import { storyLogger } from '../utils/logger';

// Current state version — bump on every shape change
export const CURRENT_STATE_VERSION = '2.0.0';
export const CURRENT_MIGRATION_VERSION = 2;

// ============================================
// Serialized State Shape
// ============================================

export interface SerializedGameState {
  version: string;
  migrationVersion: number;
  rngSeed: string;
  storyPhase: any;
  storyResources: any;
  pendingConsequences: any[];
  exposureCountdown: number | null;
  newsEvents: any[];
  objectives: any[];
  npcStates: [string, any][];
  actionHistory: any[];
  worldEventCooldowns: [string, number][];
  activeOpportunityWindows: [string, any][];
  comboSystemState: any;
  crisisMomentSystemState: any;
  actorAIState: any;
  actionLoaderState: any;
  consequenceSystemState: any;
}

// ============================================
// Dependency Interface
// ============================================

export interface StateSerializerDeps {
  // State getters
  getRngSeed(): string;
  getPhase(): any;
  getResources(): any;
  getPendingConsequences(): any[];
  getExposureCountdown(): number | null;
  getNewsEvents(): any[];
  getObjectives(): any[];
  getNPCStates(): Map<string, any>;
  getActionHistory(): any[];
  getWorldEventCooldowns(): Map<string, number>;
  getActiveOpportunityWindows(): Map<string, any>;

  // Subsystem state export
  comboSystem: { exportState(): any };
  crisisMomentSystem: { exportState(): any };
  actorAI: { exportState(): any };
  actionLoader: { exportState(): any };
  consequenceSystem: { exportState(): any };

  // State setters (for load)
  setRngSeed(seed: string): void;
  setPhase(phase: any): void;
  setResources(resources: any): void;
  setPendingConsequences(consequences: any[]): void;
  setExposureCountdown(countdown: number | null): void;
  setNewsEvents(events: any[]): void;
  setObjectives(objectives: any[]): void;
  setNPCStates(states: Map<string, any>): void;
  setActionHistory(history: any[]): void;
  setWorldEventCooldowns(cooldowns: Map<string, number>): void;
  setActiveOpportunityWindows(windows: Map<string, any>): void;

  // Subsystem state import
  importComboSystemState(state: any): void;
  importCrisisMomentSystemState(state: any): void;
  importActorAIState(state: any): void;
  importActionLoaderState(state: any): void;
  importConsequenceSystemState(state: any): void;
}

// ============================================
// StateSerializer Class
// ============================================

export class StateSerializer {
  constructor(private deps: StateSerializerDeps) {}

  /**
   * Serialize the current game state to a JSON string.
   * Adds version metadata for future migration support.
   */
  save(): string {
    const state: SerializedGameState = {
      version: CURRENT_STATE_VERSION,
      migrationVersion: CURRENT_MIGRATION_VERSION,
      rngSeed: this.deps.getRngSeed(),
      storyPhase: this.deps.getPhase(),
      storyResources: this.deps.getResources(),
      pendingConsequences: this.deps.getPendingConsequences(),
      exposureCountdown: this.deps.getExposureCountdown(),
      newsEvents: this.deps.getNewsEvents(),
      objectives: this.deps.getObjectives(),
      npcStates: Array.from(this.deps.getNPCStates().entries()),
      actionHistory: this.deps.getActionHistory(),
      worldEventCooldowns: Array.from(this.deps.getWorldEventCooldowns().entries()),
      activeOpportunityWindows: Array.from(this.deps.getActiveOpportunityWindows().entries()),
      comboSystemState: this.deps.comboSystem.exportState(),
      crisisMomentSystemState: this.deps.crisisMomentSystem.exportState(),
      actorAIState: this.deps.actorAI.exportState(),
      actionLoaderState: this.deps.actionLoader.exportState(),
      consequenceSystemState: this.deps.consequenceSystem.exportState(),
    };

    return JSON.stringify(state);
  }

  /**
   * Load game state from a JSON string.
   * Applies migrations if the saved version is older than current.
   */
  load(savedState: string): void {
    let state = JSON.parse(savedState) as Partial<SerializedGameState>;

    // Apply migrations if needed
    state = this.migrate(state);

    // Restore core state
    this.deps.setRngSeed(state.rngSeed || '');
    this.deps.setPhase(state.storyPhase);
    this.deps.setResources(state.storyResources);
    this.deps.setPendingConsequences(state.pendingConsequences || []);
    this.deps.setExposureCountdown(state.exposureCountdown ?? null);
    this.deps.setNewsEvents(state.newsEvents || []);
    this.deps.setObjectives(state.objectives || []);
    this.deps.setNPCStates(new Map(state.npcStates || []));
    this.deps.setActionHistory(state.actionHistory || []);
    this.deps.setWorldEventCooldowns(new Map(state.worldEventCooldowns || []));
    this.deps.setActiveOpportunityWindows(new Map(state.activeOpportunityWindows || []));

    // Restore subsystem states
    if (state.comboSystemState) {
      this.deps.importComboSystemState(state.comboSystemState);
    }
    if (state.crisisMomentSystemState) {
      this.deps.importCrisisMomentSystemState(state.crisisMomentSystemState);
    }
    if (state.actorAIState) {
      this.deps.importActorAIState(state.actorAIState);
    }
    if (state.actionLoaderState) {
      this.deps.importActionLoaderState(state.actionLoaderState);
    }
    if (state.consequenceSystemState) {
      this.deps.importConsequenceSystemState(state.consequenceSystemState);
    }
  }

  // ============================================
  // Migration Layer
  // ============================================

  /**
   * Apply state migrations from old versions to current.
   * Each migration handles one version step.
   */
  private migrate(state: Partial<SerializedGameState>): Partial<SerializedGameState> {
    const version = state.version || '1.0.0';

    if (version === CURRENT_STATE_VERSION) {
      return state;
    }

    // v1.0.0 → v2.0.0: Add version metadata and missing fields
    if (version === '1.0.0') {
      storyLogger.log(`[StateSerializer] Migrating save from v1.0.0 to v2.0.0`);
      state.version = '2.0.0';
      state.migrationVersion = 2;
      // v1 saves may lack these fields
      state.exposureCountdown = state.exposureCountdown ?? null;
      state.worldEventCooldowns = state.worldEventCooldowns || [];
      state.activeOpportunityWindows = state.activeOpportunityWindows || [];
    }

    return state;
  }
}
