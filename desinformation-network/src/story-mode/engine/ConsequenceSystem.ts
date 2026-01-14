/**
 * Story Mode Consequence System
 * Manages delayed consequences from player actions
 */

import consequencesData from '../data/consequences.json';
import { storyLogger } from '../../utils/logger';

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

export interface ConsequenceEffects {
  // Resource changes
  risk_increase?: number;
  attention_increase?: number;
  capacity_reduction?: number;
  budget_reduction_permanent?: number;
  moral_weight_increase?: number;

  // Infrastructure loss
  infrastructure_loss?: string;  // 'bot_network', 'persona_network', etc.

  // Efficiency reductions
  troll_efficiency_reduction?: number;
  persona_pool_reduction?: number;
  reach_reduction?: number;
  credibility_loss?: number;
  content_reach_reduction?: number;
  credibility_damage?: number;
  forgery_credibility_loss?: number;
  future_deepfake_penalty?: number;
  political_influence_reduction?: number;
  organic_reach_reduction?: number;
  npc_effectiveness_reduction?: number;
  study_credibility_reduction?: number;
  media_access_reduction?: number;

  // Boolean flags
  asset_lost?: boolean;
  investigation_active?: boolean;
  emergency_mode?: boolean;
  public_backlash?: boolean;
  npc_moral_crisis?: boolean;
  political_access_threatened?: boolean;
  critical_exposure_risk?: boolean;
  technical_attribution?: boolean;
  diplomatic_incident?: boolean;
  international_operations_restricted?: boolean;
  some_assets_frozen?: boolean;
  academic_legitimacy_lost?: boolean;
  community_trust_lost?: boolean;
  counter_movement_spawned?: boolean;
  religious_influence_lost?: boolean;
  organic_amplification?: boolean;
  massive_reach_bonus?: boolean;
  platform_warnings?: boolean;
  job_security_threatened?: boolean;
  pressure_increased?: boolean;
  target_party_boost?: boolean;

  // Special counters
  countdown_to_exposure?: number;
  final_countdown?: number;
  all_risks_increased?: number;
  all_hacking_risk_increased?: number;
  defection_risk?: number;
  legitimacy_boost?: number;
  narrative_penetration?: number;
  narrative_effectiveness_in_religious_communities_reduced?: number;
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
  effects?: ConsequenceEffects;
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

    storyLogger.log(`✅ ConsequenceSystem: Loaded ${this.definitions.size} consequences`);
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

    // BALANCE FIX 2026-01-14: Log when action has potential consequences
    if (triggerIds.length > 0) {
      storyLogger.log(`🎲 [Consequence] Action "${actionId}" has ${triggerIds.length} potential consequences`);
    }

    for (const consequenceId of triggerIds) {
      const def = this.definitions.get(consequenceId);
      if (!def) continue;

      // Calculate probability based on use count
      // P0-1 Fix: Default max to 1.0 when undefined to prevent NaN
      const baseProbability = def.probability.base;
      const increasePerUse = def.probability.per_use_increase;
      const maxProbability = def.probability.max ?? 1.0;

      // BALANCE FIX 2026-01-14: Apply minimum probability boost
      // State actors face consequences - ensure meaningful chance of consequences
      // Boost: First use gets +0.15, repeated use increases faster
      const probabilityBoost = 0.15;
      const boostedBase = baseProbability + probabilityBoost;
      const boostedIncrease = increasePerUse * 1.5;  // 50% faster increase per use

      const probability = Math.min(
        boostedBase + (count - 1) * boostedIncrease,
        maxProbability
      );

      // Roll for trigger
      const roll = rng();

      // BALANCE FIX 2026-01-14: Debug logging for consequence rolls
      storyLogger.log(`🎲 [Consequence] Rolling for "${def.label_de}": ${roll.toFixed(3)} < ${probability.toFixed(3)} (base: ${baseProbability}, boost: +${probabilityBoost}) = ${roll < probability ? 'TRIGGERED!' : 'miss'}`);

      if (roll < probability) {
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

        storyLogger.log(`⚠️ Consequence scheduled: ${def.label_de} (activates phase ${pending.activatesAtPhase})`);
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

        storyLogger.log(`🚨 Consequence activated: ${def.label_de}`);
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
   * Get consequence definition by ID
   */
  getDefinition(consequenceId: string): ConsequenceDefinition | undefined {
    return this.definitions.get(consequenceId);
  }

  /**
   * Manually trigger a consequence (for chain triggers from effects_if_ignored)
   * TD-003: Consequence Chain implementation
   */
  triggerConsequence(
    consequenceId: string,
    triggeredByAction: string,
    currentPhase: number
  ): PendingConsequence | null {
    const def = this.definitions.get(consequenceId);
    if (!def) {
      console.warn(`[ChainTrigger] Consequence ${consequenceId} not found`);
      return null;
    }

    // Calculate activation phase (use min delay for chain triggers)
    const delay = def.delay.min_phases;

    const pending: PendingConsequence = {
      id: `chain_${Date.now()}_${consequenceId}`,
      consequenceId,
      triggeredByAction,
      triggeredAtPhase: currentPhase,
      activatesAtPhase: currentPhase + delay,
      probability: 1.0, // Chain triggers are guaranteed
      hasActivated: false,
    };

    this.pendingConsequences.push(pending);

    storyLogger.log(`🔗 Chain consequence triggered: ${def.label_de} (activates phase ${pending.activatesAtPhase})`);
    return pending;
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

    storyLogger.log(`✅ Consequence resolved: ${choice.label_de}`);
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

    storyLogger.log(`❌ Consequence ignored: ${consequence.label_de}`);
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
