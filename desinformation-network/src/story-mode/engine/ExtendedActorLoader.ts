/**
 * ExtendedActorLoader - Loads German media, experts, and lobby actors
 *
 * These actors provide:
 * - Realistic targets for disinformation actions
 * - Vulnerabilities/resistances that affect action effectiveness
 * - Defensive behaviors that create counter-actions
 */

import mediaExtended from '../../data/game/actors/media-extended.json';
import expertsExtended from '../../data/game/actors/experts-extended.json';
import lobbyExtended from '../../data/game/actors/lobby-extended.json';
import { globalRandom } from '../../services/globalRandom';
import { storyLogger } from '../../utils/logger';

// ============================================
// TYPES
// ============================================

export interface ExtendedActor {
  id: string;
  name: string;
  tier: number;
  category: 'media' | 'expert' | 'lobby' | 'organization';
  subcategory?: string;
  baseTrust: number;
  currentTrust?: number;
  resilience: number;
  influenceRadius?: number;
  emotionalState?: number;
  recoveryRate?: number;
  abilities?: string[];
  vulnerabilities: string[];
  resistances: string[];
  color?: string;
  size?: number;
  icon?: string;
  connections?: {
    categories?: string[];
    specific?: string[];
    strength?: number;
  };
  behavior?: {
    type: 'passive' | 'defensive' | 'vigilant' | 'aggressive';
    triggerThreshold?: number;
    counterAbilities?: string[];
    reactionProbability?: number;
  };
}

export interface ActorEffectivenessModifier {
  actorId: string;
  actorName: string;
  modifier: number;  // Multiplier (1.0 = normal, 1.3 = 30% more effective, 0.7 = 30% less)
  reason_de: string;
  reason_en: string;
  isVulnerable: boolean;
  isResistant: boolean;
}

// ============================================
// EXTENDED ACTOR LOADER
// ============================================

export class ExtendedActorLoader {
  private actors: Map<string, ExtendedActor> = new Map();
  private actorsByCategory: Map<string, ExtendedActor[]> = new Map();
  private actorsBySubcategory: Map<string, ExtendedActor[]> = new Map();

  constructor() {
    this.loadActors();
  }

  private loadActors(): void {
    // Load media actors
    for (const actor of mediaExtended as ExtendedActor[]) {
      actor.currentTrust = actor.baseTrust;
      this.actors.set(actor.id, actor);
      this.addToCategory(actor);
    }

    // Load expert actors
    for (const actor of expertsExtended as ExtendedActor[]) {
      actor.currentTrust = actor.baseTrust;
      this.actors.set(actor.id, actor);
      this.addToCategory(actor);
    }

    // Load lobby actors
    for (const actor of lobbyExtended as ExtendedActor[]) {
      actor.currentTrust = actor.baseTrust;
      this.actors.set(actor.id, actor);
      this.addToCategory(actor);
    }

    storyLogger.log(`[ExtendedActorLoader] Loaded ${this.actors.size} actors`);
  }

  private addToCategory(actor: ExtendedActor): void {
    // Add to category map
    const categoryActors = this.actorsByCategory.get(actor.category) || [];
    categoryActors.push(actor);
    this.actorsByCategory.set(actor.category, categoryActors);

    // Add to subcategory map
    if (actor.subcategory) {
      const fullSubcategory = `${actor.category}.${actor.subcategory}`;
      const subActors = this.actorsBySubcategory.get(fullSubcategory) || [];
      subActors.push(actor);
      this.actorsBySubcategory.set(fullSubcategory, subActors);
    }
  }

  /**
   * Get actor by ID
   */
  getActor(id: string): ExtendedActor | undefined {
    return this.actors.get(id);
  }

  /**
   * Get all actors
   */
  getAllActors(): ExtendedActor[] {
    return Array.from(this.actors.values());
  }

  /**
   * Get actors by category
   */
  getActorsByCategory(category: string): ExtendedActor[] {
    return this.actorsByCategory.get(category) || [];
  }

  /**
   * Get actors by subcategory
   */
  getActorsBySubcategory(subcategory: string): ExtendedActor[] {
    return this.actorsBySubcategory.get(subcategory) || [];
  }

  /**
   * Get defensive actors (can counter player actions)
   */
  getDefensiveActors(): ExtendedActor[] {
    return this.getAllActors().filter(a =>
      a.behavior?.type === 'defensive' || a.behavior?.type === 'vigilant'
    );
  }

  /**
   * Calculate effectiveness modifier for an action against actors
   * based on their vulnerabilities and resistances
   */
  calculateEffectivenessModifiers(
    actionTags: string[],
    taxonomyTechniques: string[]
  ): ActorEffectivenessModifier[] {
    const modifiers: ActorEffectivenessModifier[] = [];

    // Combine tags and techniques for matching
    const attackVectors = [...actionTags, ...taxonomyTechniques].map(t => t.toLowerCase());

    for (const actor of this.actors.values()) {
      let modifier = 1.0;
      let isVulnerable = false;
      let isResistant = false;
      const reasons_de: string[] = [];
      const reasons_en: string[] = [];

      // Check vulnerabilities (increase effectiveness)
      for (const vuln of actor.vulnerabilities) {
        if (attackVectors.includes(vuln.toLowerCase())) {
          modifier += 0.2;  // +20% per matched vulnerability
          isVulnerable = true;
          reasons_de.push(`Anfällig für ${vuln}`);
          reasons_en.push(`Vulnerable to ${vuln}`);
        }
      }

      // Check resistances (decrease effectiveness)
      for (const resist of actor.resistances) {
        if (attackVectors.includes(resist.toLowerCase())) {
          modifier -= 0.15;  // -15% per matched resistance
          isResistant = true;
          reasons_de.push(`Resistent gegen ${resist}`);
          reasons_en.push(`Resistant to ${resist}`);
        }
      }

      // Only include if there's a significant modifier
      if (modifier !== 1.0) {
        modifiers.push({
          actorId: actor.id,
          actorName: actor.name,
          modifier: Math.max(0.5, Math.min(2.0, modifier)),  // Clamp between 0.5x and 2x
          reason_de: reasons_de.join(', '),
          reason_en: reasons_en.join(', '),
          isVulnerable,
          isResistant,
        });
      }
    }

    // Sort by modifier (most vulnerable first)
    return modifiers.sort((a, b) => b.modifier - a.modifier);
  }

  /**
   * Get potential targets for an action based on category
   */
  getSuggestedTargets(
    actionPhase: string,
    actionTags: string[]
  ): ExtendedActor[] {
    const targets: ExtendedActor[] = [];

    // Map action phases to likely target categories
    const phaseTargets: Record<string, string[]> = {
      'ta01': ['media'],                           // Preparation - target media
      'ta02': ['media', 'expert'],                 // Content creation
      'ta03': ['media'],                           // Content distribution
      'ta04': ['media', 'expert', 'lobby'],        // Amplification
      'ta05': ['expert', 'lobby'],                 // Influence operations
      'ta06': ['media', 'expert'],                 // Narrative control
      'ta07': ['media', 'expert', 'lobby'],        // Cover-up
    };

    const categories = phaseTargets[actionPhase] || ['media'];

    for (const category of categories) {
      targets.push(...this.getActorsByCategory(category));
    }

    // Sort by vulnerability to action tags
    const modifiers = this.calculateEffectivenessModifiers(actionTags, []);
    const modifierMap = new Map(modifiers.map(m => [m.actorId, m.modifier]));

    return targets.sort((a, b) =>
      (modifierMap.get(b.id) || 1) - (modifierMap.get(a.id) || 1)
    );
  }

  /**
   * Apply trust damage to an actor
   */
  applyTrustDamage(actorId: string, damage: number, modifier: number = 1.0): number {
    const actor = this.actors.get(actorId);
    if (!actor) return 0;

    const effectiveDamage = damage * modifier;
    const resilienceReduction = effectiveDamage * (1 - actor.resilience);

    actor.currentTrust = Math.max(0, (actor.currentTrust || actor.baseTrust) - resilienceReduction);

    return resilienceReduction;
  }

  /**
   * Process recovery for all actors (called each phase)
   */
  processRecovery(): void {
    for (const actor of this.actors.values()) {
      if (actor.recoveryRate && actor.currentTrust !== undefined) {
        const maxRecovery = actor.baseTrust - actor.currentTrust;
        if (maxRecovery > 0) {
          actor.currentTrust = Math.min(
            actor.baseTrust,
            actor.currentTrust + (maxRecovery * actor.recoveryRate)
          );
        }
      }
    }
  }

  /**
   * Get actors that might counter-attack based on trigger threshold
   */
  getTriggeredDefenders(averageTrustDrop: number): ExtendedActor[] {
    return this.getDefensiveActors().filter(actor => {
      const threshold = actor.behavior?.triggerThreshold || 0.5;
      const reactionProb = actor.behavior?.reactionProbability || 0.3;
      return averageTrustDrop >= threshold && globalRandom.random() < reactionProb;
    });
  }

  /**
   * Get summary statistics
   */
  getStats(): {
    totalActors: number;
    byCategory: Record<string, number>;
    averageTrust: number;
    defensiveActors: number;
  } {
    const actors = this.getAllActors();
    const byCategory: Record<string, number> = {};

    for (const actor of actors) {
      byCategory[actor.category] = (byCategory[actor.category] || 0) + 1;
    }

    const avgTrust = actors.reduce((sum, a) => sum + (a.currentTrust || a.baseTrust), 0) / actors.length;

    return {
      totalActors: actors.length,
      byCategory,
      averageTrust: avgTrust,
      defensiveActors: this.getDefensiveActors().length,
    };
  }

  /**
   * Reset all actors to base state
   */
  reset(): void {
    for (const actor of this.actors.values()) {
      actor.currentTrust = actor.baseTrust;
    }
  }

  /**
   * Export state for save/load
   */
  exportState(): Record<string, number> {
    const state: Record<string, number> = {};
    for (const [id, actor] of this.actors) {
      if (actor.currentTrust !== actor.baseTrust) {
        state[id] = actor.currentTrust || actor.baseTrust;
      }
    }
    return state;
  }

  /**
   * Import state from save
   */
  importState(state: Record<string, number>): void {
    for (const [id, trust] of Object.entries(state)) {
      const actor = this.actors.get(id);
      if (actor) {
        actor.currentTrust = trust;
      }
    }
  }
}

// Singleton instance
let extendedActorLoaderInstance: ExtendedActorLoader | null = null;

export function getExtendedActorLoader(): ExtendedActorLoader {
  if (!extendedActorLoaderInstance) {
    extendedActorLoaderInstance = new ExtendedActorLoader();
  }
  return extendedActorLoaderInstance;
}

export function resetExtendedActorLoader(): void {
  if (extendedActorLoaderInstance) {
    extendedActorLoaderInstance.reset();
  }
}
