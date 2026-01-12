/**
 * NPC Advisor Engine
 *
 * Core system for generating context-aware recommendations from NPCs.
 * Each NPC analyzes the game state from their expertise perspective
 * and provides strategic advice to the player.
 *
 * @module NPCAdvisorEngine
 */

import { storyLogger } from '../../utils/logger';
import type {
  AdvisorRecommendation,
  NPCAnalysisContext,
  NPCAnalysisStrategy,
  RecommendationPriority,
  RecommendationCategory,
  NPCConflict,
} from './AdvisorRecommendation';
import { getPriorityWeight } from './AdvisorRecommendation';

// Import NPC strategies (will be implemented separately)
import { MarinaAnalysisStrategy } from './strategies/MarinaAnalysisStrategy';
import { AlexeiAnalysisStrategy } from './strategies/AlexeiAnalysisStrategy';
import { IgorAnalysisStrategy } from './strategies/IgorAnalysisStrategy';
import { KatjaAnalysisStrategy } from './strategies/KatjaAnalysisStrategy';
import { DirektorAnalysisStrategy } from './strategies/DirektorAnalysisStrategy';

/**
 * Main NPC Advisor Engine
 *
 * Coordinates all NPC analysis strategies and generates recommendations
 * that guide player decisions based on current game state.
 */
export class NPCAdvisorEngine {
  private analysisStrategies: Map<string, NPCAnalysisStrategy>;
  private lastRecommendations: Map<string, AdvisorRecommendation[]>;

  constructor() {
    // Initialize all NPC analysis strategies
    this.analysisStrategies = new Map([
      ['marina', new MarinaAnalysisStrategy()],
      ['alexei', new AlexeiAnalysisStrategy()],
      ['igor', new IgorAnalysisStrategy()],
      ['katja', new KatjaAnalysisStrategy()],
      ['direktor', new DirektorAnalysisStrategy()],
    ]);

    this.lastRecommendations = new Map();

    storyLogger.info('NPCAdvisorEngine initialized', {
      strategies: Array.from(this.analysisStrategies.keys()),
    });
  }

  /**
   * Generate recommendations from all available NPCs
   *
   * This is the main entry point called every phase or on-demand.
   * Each NPC analyzes independently and generates recommendations.
   *
   * @param context - Complete analysis context with game state
   * @returns Array of recommendations sorted by priority
   */
  public generateRecommendations(
    context: NPCAnalysisContext
  ): AdvisorRecommendation[] {
    const allRecommendations: AdvisorRecommendation[] = [];
    const timingStart = performance.now();

    // Each NPC analyzes independently
    for (const [npcId, strategy] of this.analysisStrategies) {
      try {
        // Find NPC in game state
        const npc = context.gameState.npcs.find(n => n.id === npcId);

        // Skip if NPC not available or in severe crisis
        if (!npc || !npc.available) {
          storyLogger.debug(`NPC ${npcId} not available, skipping analysis`);
          continue;
        }

        // Skip if NPC morale is too low (they refuse to help)
        if (npc.morale < 20) {
          storyLogger.warn(`NPC ${npcId} morale too low (${npc.morale}), refusing to advise`);
          continue;
        }

        // Create NPC-specific context
        const npcContext: NPCAnalysisContext = {
          ...context,
          npc,
          playerRelationship: npc.relationshipLevel,
        };

        // Generate recommendations from this NPC
        const npcRecommendations = strategy.analyze(npcContext);

        // Store for this NPC
        this.lastRecommendations.set(npcId, npcRecommendations);

        allRecommendations.push(...npcRecommendations);

        storyLogger.debug(`NPC ${npcId} generated ${npcRecommendations.length} recommendations`, {
          priorities: this.countByPriority(npcRecommendations),
        });
      } catch (error) {
        storyLogger.error(`Error in ${npcId} analysis`, { error });
      }
    }

    // Sort by priority (critical first)
    const sorted = this.sortByPriority(allRecommendations);

    // Detect conflicts between NPCs
    const conflicts = this.detectConflicts(sorted);
    if (conflicts.length > 0) {
      storyLogger.info(`Detected ${conflicts.length} NPC conflicts`, {
        conflicts: conflicts.map(c => `${c.npc1} vs ${c.npc2}`),
      });
    }

    const timingEnd = performance.now();
    storyLogger.info('Recommendations generated', {
      total: sorted.length,
      byNPC: this.countByNPC(sorted),
      byPriority: this.countByPriority(sorted),
      timingMs: (timingEnd - timingStart).toFixed(2),
    });

    return sorted;
  }

  /**
   * Filter recommendations by category
   *
   * Useful for showing category-specific views
   */
  public filterByCategory(
    recommendations: AdvisorRecommendation[],
    category: RecommendationCategory
  ): AdvisorRecommendation[] {
    return recommendations.filter(r => r.category === category);
  }

  /**
   * Filter recommendations by priority
   */
  public filterByPriority(
    recommendations: AdvisorRecommendation[],
    priority: RecommendationPriority
  ): AdvisorRecommendation[] {
    return recommendations.filter(r => r.priority === priority);
  }

  /**
   * Filter recommendations by NPC
   */
  public filterByNPC(
    recommendations: AdvisorRecommendation[],
    npcId: string
  ): AdvisorRecommendation[] {
    return recommendations.filter(r => r.npcId === npcId);
  }

  /**
   * Get top recommendation for each NPC
   *
   * Useful for displaying one recommendation per NPC in UI
   */
  public getTopRecommendationPerNPC(
    recommendations: AdvisorRecommendation[]
  ): Map<string, AdvisorRecommendation> {
    const topRecs = new Map<string, AdvisorRecommendation>();

    for (const rec of recommendations) {
      const existing = topRecs.get(rec.npcId);

      // Take recommendation with higher priority
      if (!existing || getPriorityWeight(rec.priority) > getPriorityWeight(existing.priority)) {
        topRecs.set(rec.npcId, rec);
      }
    }

    return topRecs;
  }

  /**
   * Check if recommendation is still valid
   *
   * Recommendations can expire based on:
   * - Phase expiration
   * - Action already completed
   * - Conditions no longer met
   */
  public isRecommendationValid(
    rec: AdvisorRecommendation,
    currentPhase: number,
    completedActions: string[]
  ): boolean {
    // Check expiration
    if (rec.expiresPhase && currentPhase > rec.expiresPhase) {
      return false;
    }

    // Check if recommended actions are still available
    if (rec.suggestedActions.length > 0) {
      const allCompleted = rec.suggestedActions.every(actionId =>
        completedActions.includes(actionId)
      );

      if (allCompleted) {
        return false; // All recommended actions already done
      }
    }

    return true;
  }

  /**
   * Get critical recommendations only
   *
   * These require immediate player attention
   */
  public getCriticalRecommendations(
    recommendations: AdvisorRecommendation[]
  ): AdvisorRecommendation[] {
    return recommendations.filter(r => r.priority === 'critical');
  }

  /**
   * Get time-sensitive recommendations
   *
   * These have expiration dates
   */
  public getTimeSensitiveRecommendations(
    recommendations: AdvisorRecommendation[]
  ): AdvisorRecommendation[] {
    return recommendations.filter(r => r.expiresPhase !== undefined);
  }

  /**
   * Detect conflicts between NPC recommendations
   *
   * NPCs may disagree on strategy, resource allocation, etc.
   * The Director can mediate these conflicts.
   */
  private detectConflicts(
    recommendations: AdvisorRecommendation[]
  ): NPCConflict[] {
    const conflicts: NPCConflict[] = [];

    // Check for resource conflicts
    // e.g., Marina wants expensive campaign, Igor says save money
    const highCostRecs = recommendations.filter(r =>
      r.category === 'opportunity' && r.suggestedActions.length > 0
    );
    const budgetWarnings = recommendations.filter(r =>
      r.category === 'threat' && r.message.includes('Budget')
    );

    if (highCostRecs.length > 0 && budgetWarnings.length > 0) {
      conflicts.push({
        npc1: highCostRecs[0].npcId,
        npc2: budgetWarnings[0].npcId,
        recommendation1: highCostRecs[0],
        recommendation2: budgetWarnings[0],
        conflictType: 'resource',
        description: 'Conflict: Expensive opportunity vs budget constraints',
      });
    }

    // Check for risk conflicts
    // e.g., Marina wants aggressive action, Alexei warns about high risk
    const aggressiveRecs = recommendations.filter(r =>
      r.priority === 'high' && r.category === 'opportunity'
    );
    const riskWarnings = recommendations.filter(r =>
      r.category === 'threat' && r.message.includes('Risiko')
    );

    if (aggressiveRecs.length > 0 && riskWarnings.length > 0) {
      conflicts.push({
        npc1: aggressiveRecs[0].npcId,
        npc2: riskWarnings[0].npcId,
        recommendation1: aggressiveRecs[0],
        recommendation2: riskWarnings[0],
        conflictType: 'strategy',
        description: 'Conflict: Aggressive expansion vs security concerns',
      });
    }

    return conflicts;
  }

  /**
   * Sort recommendations by priority
   *
   * Critical > High > Medium > Low
   */
  private sortByPriority(
    recommendations: AdvisorRecommendation[]
  ): AdvisorRecommendation[] {
    return recommendations.sort((a, b) =>
      getPriorityWeight(b.priority) - getPriorityWeight(a.priority)
    );
  }

  /**
   * Count recommendations by NPC
   */
  private countByNPC(recommendations: AdvisorRecommendation[]): Record<string, number> {
    const counts: Record<string, number> = {};

    for (const rec of recommendations) {
      counts[rec.npcId] = (counts[rec.npcId] || 0) + 1;
    }

    return counts;
  }

  /**
   * Count recommendations by priority
   */
  private countByPriority(recommendations: AdvisorRecommendation[]): Record<string, number> {
    const counts: Record<string, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    for (const rec of recommendations) {
      counts[rec.priority]++;
    }

    return counts;
  }

  /**
   * Get last recommendations for specific NPC
   *
   * Useful for debugging or showing history
   */
  public getLastRecommendationsForNPC(npcId: string): AdvisorRecommendation[] {
    return this.lastRecommendations.get(npcId) || [];
  }

  /**
   * Clear all cached recommendations
   *
   * Called when game state changes significantly
   */
  public clearCache(): void {
    this.lastRecommendations.clear();
    storyLogger.debug('Advisor cache cleared');
  }
}

/**
 * Create singleton instance
 * Reuse across game session for performance
 */
let engineInstance: NPCAdvisorEngine | null = null;

export function getAdvisorEngine(): NPCAdvisorEngine {
  if (!engineInstance) {
    engineInstance = new NPCAdvisorEngine();
  }
  return engineInstance;
}

/**
 * Reset engine (for testing or new game)
 */
export function resetAdvisorEngine(): void {
  engineInstance = null;
}
