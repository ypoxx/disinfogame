/**
 * Story Mode Consequence System
 * Manages delayed consequences from player actions
 */

import consequencesData from '../../../../docs/story-mode/data/consequences.json';

// ============================================
// TYPES
// ============================================

export interface ConsequenceChoice {
  id: string;
  label_de: string;
  label_en: string;
  costs?: {
    budget?: number;
    risk?: number;
    moral_weight?: number;
  };
  effects?: {
    risk_change?: number;
    attention_change?: number;
    npc_relationship?: { npc: string; change: number };
    chain_break?: boolean;
  };
  outcome_de: string;
  outcome_en: string;
}

export interface ConsequenceDefinition {
  id: string;
  type: 'exposure' | 'blowback' | 'escalation' | 'internal' | 'collateral' | 'opportunity';
  triggered_by: string[];  // Action IDs
  delay: {
    min_phases: number;
    max_phases: number;
  };
  probability: {
    base: number;
    per_use_increase: number;
    max: number;
  };
  severity: 'minor' | 'moderate' | 'severe' | 'critical';
  label_de: string;
  label_en: string;
  description_de: string;
  description_en: string;
  player_choices: ConsequenceChoice[];
  effects_if_ignored?: {
    risk_increase?: number;
    attention_increase?: number;
    chain_trigger?: string;
  };
}

export interface PendingConsequence {
  id: string;
  consequenceId: string;
  triggeredByAction: string;
  triggeredAtPhase: number;
  activatesAtPhase: number;
  probability: number;
  hasActivated: boolean;
}

export interface ActiveConsequence {
  id: string;
  consequence: ConsequenceDefinition;
  triggeredByAction: string;
  choices: ConsequenceChoice[];
  deadline?: number;  // Phase by which player must decide
}

// ============================================
// CONSEQUENCE SYSTEM CLASS
// ============================================

export class ConsequenceSystem {
  private definitions: Map<string, ConsequenceDefinition> = new Map();
  private actionTriggers: Map<string, string[]> = new Map();  // action ID -> consequence IDs
  private pendingConsequences: PendingConsequence[] = [];
  private activeConsequence: ActiveConsequence | null = null;
  private resolvedConsequences: string[] = [];
  private actionUseCounts: Map<string, number> = new Map();

  constructor() {
    this.loadDefinitions();
  }

  /**
   * Load consequence definitions from JSON
   */
  private loadDefinitions(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = consequencesData as any;

    for (const def of data.consequences) {
      this.definitions.set(def.id, def);

      // Index by trigger actions
      for (const actionId of def.triggered_by) {
        const triggers = this.actionTriggers.get(actionId) || [];
        triggers.push(def.id);
        this.actionTriggers.set(actionId, triggers);
      }
    }

    console.log(`✅ ConsequenceSystem: Loaded ${this.definitions.size} consequences`);
  }

  // ============================================
  // TRIGGER MANAGEMENT
  // ============================================

  /**
   * Called when an action is executed - may trigger consequences
   */
  onActionExecuted(
    actionId: string,
    currentPhase: number,
    rng: () => number  // Random number generator (0-1)
  ): PendingConsequence[] {
    // Track action usage
    const count = (this.actionUseCounts.get(actionId) || 0) + 1;
    this.actionUseCounts.set(actionId, count);

    const newPending: PendingConsequence[] = [];
    const triggerIds = this.actionTriggers.get(actionId) || [];

    for (const consequenceId of triggerIds) {
      const def = this.definitions.get(consequenceId);
      if (!def) continue;

      // Calculate probability based on use count
      const baseProbability = def.probability.base;
      const increasePerUse = def.probability.per_use_increase;
      const maxProbability = def.probability.max;

      const probability = Math.min(
        baseProbability + (count - 1) * increasePerUse,
        maxProbability
      );

      // Roll for trigger
      if (rng() < probability) {
        // Calculate activation phase
        const delay = def.delay.min_phases +
          Math.floor(rng() * (def.delay.max_phases - def.delay.min_phases + 1));

        const pending: PendingConsequence = {
          id: `pending_${Date.now()}_${consequenceId}`,
          consequenceId,
          triggeredByAction: actionId,
          triggeredAtPhase: currentPhase,
          activatesAtPhase: currentPhase + delay,
          probability,
          hasActivated: false,
        };

        this.pendingConsequences.push(pending);
        newPending.push(pending);

        console.log(`⚠️ Consequence scheduled: ${def.label_de} (activates phase ${pending.activatesAtPhase})`);
      }
    }

    return newPending;
  }

  /**
   * Called at the start of each phase - checks for activating consequences
   */
  checkPhase(currentPhase: number): ActiveConsequence | null {
    // Already have an active consequence - don't trigger another
    if (this.activeConsequence) {
      return this.activeConsequence;
    }

    // Find consequences that should activate this phase
    for (const pending of this.pendingConsequences) {
      if (!pending.hasActivated && pending.activatesAtPhase <= currentPhase) {
        const def = this.definitions.get(pending.consequenceId);
        if (!def) continue;

        pending.hasActivated = true;

        // Create active consequence
        this.activeConsequence = {
          id: pending.id,
          consequence: def,
          triggeredByAction: pending.triggeredByAction,
          choices: def.player_choices,
          deadline: currentPhase + 2,  // 2 phases to decide
        };

        console.log(`🚨 Consequence activated: ${def.label_de}`);
        return this.activeConsequence;
      }
    }

    return null;
  }

  // ============================================
  // CHOICE HANDLING
  // ============================================

  /**
   * Get currently active consequence (if any)
   */
  getActiveConsequence(): ActiveConsequence | null {
    return this.activeConsequence;
  }

  /**
   * Handle player's choice for active consequence
   */
  resolveConsequence(choiceId: string): {
    success: boolean;
    choice?: ConsequenceChoice;
    effects?: ConsequenceChoice['effects'];
  } {
    if (!this.activeConsequence) {
      return { success: false };
    }

    const choice = this.activeConsequence.choices.find(c => c.id === choiceId);
    if (!choice) {
      return { success: false };
    }

    // Mark as resolved
    this.resolvedConsequences.push(this.activeConsequence.id);

    // Remove from pending
    this.pendingConsequences = this.pendingConsequences.filter(
      p => p.id !== this.activeConsequence!.id
    );

    const result = {
      success: true,
      choice,
      effects: choice.effects,
    };

    // Clear active
    this.activeConsequence = null;

    console.log(`✅ Consequence resolved: ${choice.label_de}`);
    return result;
  }

  /**
   * Handle consequence being ignored (deadline passed)
   */
  ignoreConsequence(): {
    consequence: ConsequenceDefinition;
    effects?: ConsequenceDefinition['effects_if_ignored'];
  } | null {
    if (!this.activeConsequence) {
      return null;
    }

    const consequence = this.activeConsequence.consequence;
    const effects = consequence.effects_if_ignored;

    // Mark as resolved (ignored)
    this.resolvedConsequences.push(this.activeConsequence.id);

    // Remove from pending
    this.pendingConsequences = this.pendingConsequences.filter(
      p => p.id !== this.activeConsequence!.id
    );

    // Clear active
    this.activeConsequence = null;

    console.log(`❌ Consequence ignored: ${consequence.label_de}`);
    return { consequence, effects };
  }

  // ============================================
  // STATE QUERIES
  // ============================================

  /**
   * Get all pending consequences
   */
  getPendingConsequences(): PendingConsequence[] {
    return [...this.pendingConsequences];
  }

  /**
   * Get count of pending consequences by severity
   */
  getPendingBySeverity(): Record<string, number> {
    const counts: Record<string, number> = {
      minor: 0,
      moderate: 0,
      severe: 0,
      critical: 0,
    };

    for (const pending of this.pendingConsequences) {
      if (!pending.hasActivated) {
        const def = this.definitions.get(pending.consequenceId);
        if (def) {
          counts[def.severity]++;
        }
      }
    }

    return counts;
  }

  /**
   * Check if any critical consequences are pending
   */
  hasCriticalPending(): boolean {
    return this.pendingConsequences.some(p => {
      if (p.hasActivated) return false;
      const def = this.definitions.get(p.consequenceId);
      return def?.severity === 'critical';
    });
  }

  // ============================================
  // SERIALIZATION
  // ============================================

  /**
   * Export state for save
   */
  exportState(): {
    pendingConsequences: PendingConsequence[];
    activeConsequence: ActiveConsequence | null;
    resolvedConsequences: string[];
    actionUseCounts: [string, number][];
  } {
    return {
      pendingConsequences: this.pendingConsequences,
      activeConsequence: this.activeConsequence,
      resolvedConsequences: this.resolvedConsequences,
      actionUseCounts: Array.from(this.actionUseCounts.entries()),
    };
  }

  /**
   * Import state from save
   */
  importState(state: {
    pendingConsequences: PendingConsequence[];
    activeConsequence: ActiveConsequence | null;
    resolvedConsequences: string[];
    actionUseCounts: [string, number][];
  }): void {
    this.pendingConsequences = state.pendingConsequences;
    this.activeConsequence = state.activeConsequence;
    this.resolvedConsequences = state.resolvedConsequences;
    this.actionUseCounts = new Map(state.actionUseCounts);
  }

  /**
   * Reset all state
   */
  reset(): void {
    this.pendingConsequences = [];
    this.activeConsequence = null;
    this.resolvedConsequences = [];
    this.actionUseCounts.clear();
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

let consequenceSystemInstance: ConsequenceSystem | null = null;

export function getConsequenceSystem(): ConsequenceSystem {
  if (!consequenceSystemInstance) {
    consequenceSystemInstance = new ConsequenceSystem();
  }
  return consequenceSystemInstance;
}

export function resetConsequenceSystem(): void {
  if (consequenceSystemInstance) {
    consequenceSystemInstance.reset();
  }
}
