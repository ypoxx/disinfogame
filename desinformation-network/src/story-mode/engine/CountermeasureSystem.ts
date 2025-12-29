/**
 * Story Mode Countermeasure System
 * Handles enemy responses and countermeasures to player actions
 * Based on DISARM Framework
 */

import countermeasuresData from '../data/countermeasures.json';

// ============================================
// TYPES
// ============================================

export type SeverityLevel = 'minor' | 'moderate' | 'severe' | 'critical';
export type TriggerType = 'risk_threshold' | 'attention_threshold' | 'action_specific' | 'random_check' | 'time_based';

export interface CounterOption {
  action: string;
  action_ref?: string;
  cost?: {
    budget?: number;
    capacity?: number;
    risk?: number;
    moral_weight?: number;
  };
  effect?: string;
  probability_success?: number;
  cost_multiplier?: number;
}

export interface CountermeasureDefinition {
  id: string;
  disarm_ref?: string;
  label_de: string;
  label_en?: string;
  narrative_de: string;
  narrative_en?: string;
  severity: SeverityLevel;
  trigger: {
    type: TriggerType;
    triggers_on?: string[];
    threshold?: 'low' | 'medium' | 'high' | 'critical';
    probability_base: number;
    probability_increase_per_use?: number;
    probability_increase_with_moral_weight?: number;
    probability_increase_with_team_size?: number;
    phases_after_start?: number;
    phases_without_major_success?: number;
    conditions?: string[];
  };
  effects: Record<string, unknown>;
  counter_options: CounterOption[];
}

export interface ActiveCountermeasure {
  id: string;
  definitionId: string;
  triggeredPhase: number;
  resolvedPhase?: number;
  chosenOption?: string;
  status: 'active' | 'resolved' | 'escalated';
}

export interface CountermeasureContext {
  risk: number;
  attention: number;
  phase: number;
  actionId?: string;
  actionTags?: string[];
  moralWeight?: number;
  teamSize?: number;
  actionUseCounts?: Map<string, number>;
}

// ============================================
// COUNTERMEASURE SYSTEM CLASS
// ============================================

export class CountermeasureSystem {
  private countermeasures: Map<string, CountermeasureDefinition> = new Map();
  private activeCountermeasures: Map<string, ActiveCountermeasure> = new Map();
  private triggeredCountermeasureIds: Set<string> = new Set();
  private countermeasureTriggerCounts: Map<string, number> = new Map();

  // Threshold mappings
  private readonly thresholdValues: Record<string, number> = {
    low: 25,
    medium: 50,
    high: 75,
    critical: 90
  };

  constructor() {
    this.loadCountermeasures();
  }

  /**
   * Load countermeasures from JSON data
   */
  private loadCountermeasures(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = countermeasuresData as any;

    if (data.countermeasures) {
      for (const cm of data.countermeasures) {
        this.countermeasures.set(cm.id, cm as CountermeasureDefinition);
      }
    }
  }

  /**
   * Check for triggered countermeasures based on context
   * Returns list of newly triggered countermeasures
   */
  checkForCountermeasures(context: CountermeasureContext, rng: () => number): CountermeasureDefinition[] {
    const triggered: CountermeasureDefinition[] = [];

    for (const [cmId, cm] of this.countermeasures) {
      // Skip if already active
      if (this.activeCountermeasures.has(cmId)) continue;

      // Check if trigger conditions are met
      if (this.shouldTrigger(cm, context, rng)) {
        triggered.push(cm);
        this.triggerCountermeasure(cm.id, context.phase);
      }
    }

    return triggered;
  }

  /**
   * Check if a specific countermeasure should trigger
   */
  private shouldTrigger(cm: CountermeasureDefinition, context: CountermeasureContext, rng: () => number): boolean {
    const trigger = cm.trigger;

    switch (trigger.type) {
      case 'risk_threshold':
        return this.checkThresholdTrigger(trigger, context.risk, rng);

      case 'attention_threshold':
        return this.checkThresholdTrigger(trigger, context.attention, rng);

      case 'action_specific':
        return this.checkActionTrigger(cm, context, rng);

      case 'random_check':
        return this.checkRandomTrigger(trigger, context, rng);

      case 'time_based':
        return this.checkTimeTrigger(trigger, context);

      default:
        return false;
    }
  }

  /**
   * Check threshold-based triggers (risk or attention)
   */
  private checkThresholdTrigger(
    trigger: CountermeasureDefinition['trigger'],
    value: number,
    rng: () => number
  ): boolean {
    if (!trigger.threshold) return false;

    const thresholdValue = this.thresholdValues[trigger.threshold];
    if (value < thresholdValue) return false;

    // Roll probability
    const probability = trigger.probability_base;
    return rng() < probability;
  }

  /**
   * Check action-specific triggers
   */
  private checkActionTrigger(
    cm: CountermeasureDefinition,
    context: CountermeasureContext,
    rng: () => number
  ): boolean {
    const trigger = cm.trigger;
    if (!trigger.triggers_on || !context.actionId) return false;

    // Check if action matches
    const actionMatches = trigger.triggers_on.some(actionRef => {
      // Match by ID or by tag
      if (context.actionId === actionRef) return true;
      if (context.actionTags?.includes(actionRef)) return true;
      return false;
    });

    if (!actionMatches) return false;

    // Calculate probability with increases
    let probability = trigger.probability_base;

    // Increase per use
    if (trigger.probability_increase_per_use && context.actionUseCounts) {
      const useCount = context.actionUseCounts.get(context.actionId) || 0;
      probability += trigger.probability_increase_per_use * useCount;
    }

    // Increase with moral weight
    if (trigger.probability_increase_with_moral_weight && context.moralWeight) {
      probability += trigger.probability_increase_with_moral_weight * context.moralWeight;
    }

    // Cap at 1.0
    probability = Math.min(1.0, probability);

    return rng() < probability;
  }

  /**
   * Check random/periodic triggers
   */
  private checkRandomTrigger(
    trigger: CountermeasureDefinition['trigger'],
    context: CountermeasureContext,
    rng: () => number
  ): boolean {
    let probability = trigger.probability_base;

    // Team size increase
    if (trigger.probability_increase_with_team_size && context.teamSize) {
      probability += trigger.probability_increase_with_team_size * context.teamSize;
    }

    // Check conditions
    if (trigger.conditions) {
      // For now, conditions are just flags - could be extended
      // e.g., "low_campaign_effectiveness"
    }

    probability = Math.min(1.0, probability);
    return rng() < probability;
  }

  /**
   * Check time-based triggers
   */
  private checkTimeTrigger(
    trigger: CountermeasureDefinition['trigger'],
    context: CountermeasureContext
  ): boolean {
    if (trigger.phases_after_start !== undefined) {
      return context.phase >= trigger.phases_after_start;
    }

    // Could add more time-based checks here
    return false;
  }

  /**
   * Trigger a countermeasure
   */
  private triggerCountermeasure(cmId: string, phase: number): void {
    const active: ActiveCountermeasure = {
      id: `active_${cmId}_${phase}`,
      definitionId: cmId,
      triggeredPhase: phase,
      status: 'active'
    };

    this.activeCountermeasures.set(cmId, active);
    this.triggeredCountermeasureIds.add(cmId);

    // Track trigger count
    const count = this.countermeasureTriggerCounts.get(cmId) || 0;
    this.countermeasureTriggerCounts.set(cmId, count + 1);
  }

  /**
   * Resolve a countermeasure with a chosen option
   */
  resolveCountermeasure(cmId: string, chosenOptionIndex: number, phase: number): CounterOption | null {
    const active = this.activeCountermeasures.get(cmId);
    if (!active || active.status !== 'active') return null;

    const definition = this.countermeasures.get(cmId);
    if (!definition) return null;

    const option = definition.counter_options[chosenOptionIndex];
    if (!option) return null;

    active.resolvedPhase = phase;
    active.chosenOption = option.action;
    active.status = 'resolved';

    return option;
  }

  /**
   * Get all active countermeasures
   */
  getActiveCountermeasures(): Array<{ active: ActiveCountermeasure; definition: CountermeasureDefinition }> {
    const result: Array<{ active: ActiveCountermeasure; definition: CountermeasureDefinition }> = [];

    for (const [cmId, active] of this.activeCountermeasures) {
      if (active.status !== 'active') continue;

      const definition = this.countermeasures.get(cmId);
      if (definition) {
        result.push({ active, definition });
      }
    }

    return result;
  }

  /**
   * Get a countermeasure definition by ID
   */
  getCountermeasure(cmId: string): CountermeasureDefinition | null {
    return this.countermeasures.get(cmId) || null;
  }

  /**
   * Get all countermeasures that could be triggered by an action
   */
  getPotentialCountermeasuresForAction(actionId: string, actionTags: string[]): CountermeasureDefinition[] {
    const potential: CountermeasureDefinition[] = [];

    for (const [, cm] of this.countermeasures) {
      if (cm.trigger.type !== 'action_specific') continue;
      if (!cm.trigger.triggers_on) continue;

      const matches = cm.trigger.triggers_on.some(ref =>
        ref === actionId || actionTags.includes(ref)
      );

      if (matches) {
        potential.push(cm);
      }
    }

    return potential;
  }

  /**
   * Get severity level info
   */
  getSeverityInfo(severity: SeverityLevel): { label_de: string; description: string } {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = countermeasuresData as any;
    return data.severity_levels?.[severity] || { label_de: severity, description: '' };
  }

  /**
   * Reset all countermeasures
   */
  reset(): void {
    this.activeCountermeasures.clear();
    this.triggeredCountermeasureIds.clear();
    this.countermeasureTriggerCounts.clear();
  }

  /**
   * Export state for save/load
   */
  exportState(): object {
    return {
      activeCountermeasures: Array.from(this.activeCountermeasures.entries()),
      triggeredCountermeasureIds: Array.from(this.triggeredCountermeasureIds),
      countermeasureTriggerCounts: Array.from(this.countermeasureTriggerCounts.entries())
    };
  }

  /**
   * Import state for save/load
   */
  importState(state: {
    activeCountermeasures?: Array<[string, ActiveCountermeasure]>;
    triggeredCountermeasureIds?: string[];
    countermeasureTriggerCounts?: Array<[string, number]>;
  }): void {
    if (state.activeCountermeasures) {
      this.activeCountermeasures = new Map(state.activeCountermeasures);
    }
    if (state.triggeredCountermeasureIds) {
      this.triggeredCountermeasureIds = new Set(state.triggeredCountermeasureIds);
    }
    if (state.countermeasureTriggerCounts) {
      this.countermeasureTriggerCounts = new Map(state.countermeasureTriggerCounts);
    }
  }
}

// Export singleton instance
export const countermeasureSystem = new CountermeasureSystem();
