/**
 * Actor AI & Reaction System
 *
 * Implements intelligent behavior for actors, allowing them to react to
 * manipulation attempts and execute counter-strategies.
 */

import type { Actor, GameState, ActorReaction } from '@/game-logic/types';
import type { ActorBehavior } from '@/game-logic/types';
import { globalRandom } from '@/services/globalRandom';

// ============================================
// TYPES
// ============================================

export interface ReactionTrigger {
  type: 'trust_drop' | 'manipulation_detected' | 'ally_attacked' | 'defensive_spawn';
  severity: number; // 0-1
  targetActorId?: string;
}

export interface CounterStrategy {
  id: string;
  name: string;
  condition: (actor: Actor, gameState: GameState) => boolean;
  effect: (actor: Actor, gameState: GameState) => void;
  priority: number;
}

// ============================================
// BEHAVIOR DEFINITIONS
// ============================================

export const ACTOR_BEHAVIORS: Record<string, ActorBehavior> = {
  passive: {
    awarenessGrowth: 0.02,
    resistanceBonus: 0,
    counterAttackChance: 0,
    allySupport: false,
  },
  vigilant: {
    awarenessGrowth: 0.05,
    resistanceBonus: 0.1,
    counterAttackChance: 0.1,
    allySupport: true,
  },
  defensive: {
    awarenessGrowth: 0.08,
    resistanceBonus: 0.2,
    counterAttackChance: 0.3,
    allySupport: true,
  },
  aggressive: {
    awarenessGrowth: 0.03,
    resistanceBonus: 0.05,
    counterAttackChance: 0.5,
    allySupport: false,
  },
};

// ============================================
// AWARENESS SYSTEM
// ============================================

/**
 * Update actor awareness based on manipulation attempts
 */
export function updateAwareness(
  actor: Actor,
  manipulationStrength: number,
  behavior: ActorBehavior
): number {
  const currentAwareness = actor.awareness || 0;
  const growthRate = behavior.awarenessGrowth * manipulationStrength;

  // Awareness increases when being manipulated
  const newAwareness = Math.min(1, currentAwareness + growthRate);

  // High awareness increases resilience
  if (newAwareness > 0.5) {
    actor.resilience = Math.min(1, actor.resilience + 0.02);
  }

  return newAwareness;
}

/**
 * Awareness decay over time (if not being targeted)
 */
export function decayAwareness(actor: Actor, decayRate: number = 0.01): number {
  return Math.max(0, (actor.awareness || 0) - decayRate);
}

// ============================================
// REACTION SYSTEM
// ============================================

/**
 * Determine if an actor should react to a manipulation attempt
 */
export function shouldReact(
  actor: Actor,
  trigger: ReactionTrigger,
  behavior: ActorBehavior
): boolean {
  const awareness = actor.awareness || 0;
  const resilience = actor.resilience;

  // Base reaction chance
  let reactionChance = behavior.counterAttackChance;

  // Awareness increases reaction chance
  reactionChance += awareness * 0.3;

  // Resilience increases reaction chance
  reactionChance += resilience * 0.2;

  // Severity increases reaction chance
  reactionChance += trigger.severity * 0.2;

  // Defensive actors always react to severe threats
  if (actor.category === 'defensive' && trigger.severity > 0.6) {
    return true;
  }

  return globalRandom.random() < reactionChance;
}

/**
 * Generate actor reaction
 */
export function generateReaction(
  actor: Actor,
  trigger: ReactionTrigger,
  gameState: GameState
): ActorReaction | null {
  const behavior = actor.behavior || ACTOR_BEHAVIORS.passive;

  if (!shouldReact(actor, trigger, behavior)) {
    return null;
  }

  // Determine reaction type based on trigger and actor
  let reactionType: ActorReaction['type'];
  let targetId: string | undefined;

  switch (trigger.type) {
    case 'trust_drop':
      reactionType = 'resist';
      break;
    case 'manipulation_detected':
      reactionType = 'expose';
      break;
    case 'ally_attacked':
      reactionType = 'defend_ally';
      targetId = trigger.targetActorId;
      break;
    case 'defensive_spawn':
      reactionType = 'counter_campaign';
      break;
    default:
      reactionType = 'resist';
  }

  return {
    actorId: actor.id,
    type: reactionType,
    targetActorId: targetId,
    strength: trigger.severity * (1 + (actor.awareness || 0)),
    round: gameState.round,
  };
}

// ============================================
// COUNTER STRATEGIES
// ============================================

/**
 * Execute counter-strategy for defensive actors
 */
export function executeCounterStrategy(
  actor: Actor,
  gameState: GameState
): ActorReaction | null {
  if (actor.category !== 'defensive') {
    return null;
  }

  const strategies = getAvailableStrategies(actor, gameState);

  if (strategies.length === 0) {
    return null;
  }

  // Pick highest priority strategy
  strategies.sort((a, b) => b.priority - a.priority);
  const strategy = strategies[0];

  // Execute strategy
  strategy.effect(actor, gameState);

  return {
    actorId: actor.id,
    type: 'counter_campaign',
    strength: 0.3 + (actor.trust - 0.5) * 0.5, // Stronger at high trust
    round: gameState.round,
  };
}

/**
 * Get available counter-strategies for an actor
 */
function getAvailableStrategies(
  actor: Actor,
  gameState: GameState
): CounterStrategy[] {
  const available: CounterStrategy[] = [];

  for (const strategy of COUNTER_STRATEGIES) {
    if (strategy.condition(actor, gameState)) {
      available.push(strategy);
    }
  }

  return available;
}

/**
 * Predefined counter-strategies
 */
const COUNTER_STRATEGIES: CounterStrategy[] = [
  {
    id: 'restore_low_trust',
    name: 'Restore Trust in Vulnerable Actors',
    condition: (actor, gameState) => {
      const lowTrustActors = gameState.network.actors.filter(
        a => a.trust < 0.3 && a.category !== 'defensive'
      );
      return lowTrustActors.length > 5;
    },
    effect: (actor, gameState) => {
      // Boost trust of most vulnerable actors
      const lowTrustActors = gameState.network.actors
        .filter(a => a.trust < 0.3 && a.category !== 'defensive')
        .sort((a, b) => a.trust - b.trust)
        .slice(0, 3);

      lowTrustActors.forEach(a => {
        a.trust = Math.min(1, a.trust + 0.15);
        a.resilience = Math.min(1, a.resilience + 0.05);
      });
    },
    priority: 10,
  },
  {
    id: 'boost_network_resilience',
    name: 'Boost Network Resilience',
    condition: (actor, gameState) => {
      const avgResilience = gameState.network.actors.reduce(
        (sum, a) => sum + a.resilience, 0
      ) / gameState.network.actors.length;
      return avgResilience < 0.4;
    },
    effect: (actor, gameState) => {
      // Increase resilience across network
      gameState.network.actors.forEach(a => {
        if (a.category !== 'defensive') {
          a.resilience = Math.min(1, a.resilience + 0.03);
        }
      });
    },
    priority: 7,
  },
  {
    id: 'expose_manipulation',
    name: 'Expose Manipulation Campaign',
    condition: (actor, gameState) => {
      return gameState.detectionRisk > 0.5;
    },
    effect: (actor, gameState) => {
      // Reduce detection risk and boost awareness
      gameState.detectionRisk = Math.max(0, gameState.detectionRisk - 0.2);

      gameState.network.actors.forEach(a => {
        if (a.category !== 'defensive') {
          a.awareness = Math.min(1, (a.awareness || 0) + 0.1);
        }
      });
    },
    priority: 8,
  },
  {
    id: 'strengthen_connections',
    name: 'Strengthen Network Connections',
    condition: (actor, gameState) => {
      const weakConnections = gameState.network.connections.filter(
        c => c.strength < 0.3
      );
      return weakConnections.length > gameState.network.connections.length * 0.3;
    },
    effect: (actor, gameState) => {
      // Strengthen weak connections
      gameState.network.connections.forEach(conn => {
        if (conn.strength < 0.5) {
          conn.strength = Math.min(1, conn.strength + 0.1);
        }
      });
    },
    priority: 6,
  },
  {
    id: 'targeted_recovery',
    name: 'Targeted Trust Recovery',
    condition: (actor, gameState) => {
      // Target high-centrality actors with low trust
      return gameState.network.actors.some(
        a => a.centrality && a.centrality > 0.6 && a.trust < 0.4
      );
    },
    effect: (actor, gameState) => {
      // Boost trust of central actors
      gameState.network.actors.forEach(a => {
        if (a.centrality && a.centrality > 0.6 && a.trust < 0.4) {
          a.trust = Math.min(1, a.trust + 0.2);
        }
      });
    },
    priority: 9,
  },
];

// ============================================
// ALLY SUPPORT SYSTEM
// ============================================

/**
 * Check if actor should support an ally under attack
 */
export function shouldSupportAlly(
  actor: Actor,
  ally: Actor,
  behavior: ActorBehavior
): boolean {
  if (!behavior.allySupport) {
    return false;
  }

  // Support if:
  // 1. Same category
  // 2. High trust in both
  // 3. Random chance based on awareness

  const sameCategory = actor.category === ally.category;
  const bothTrusted = actor.trust > 0.6 && ally.trust > 0.6;
  const awarenessBonus = (actor.awareness || 0) * 0.3;

  return sameCategory && bothTrusted && globalRandom.random() < (0.2 + awarenessBonus);
}

/**
 * Execute ally support action
 */
export function supportAlly(
  supporter: Actor,
  ally: Actor,
  gameState: GameState
): ActorReaction {
  // Transfer some resilience/trust
  const supportStrength = 0.05 + (supporter.trust - 0.5) * 0.1;

  ally.resilience = Math.min(1, ally.resilience + supportStrength);
  ally.trust = Math.min(1, ally.trust + supportStrength * 0.5);

  return {
    actorId: supporter.id,
    type: 'defend_ally',
    targetActorId: ally.id,
    strength: supportStrength,
    round: gameState.round,
  };
}

// ============================================
// AI PROCESSING
// ============================================

/**
 * Process all actor AI and reactions for the current round
 */
export function processActorAI(gameState: GameState): ActorReaction[] {
  const reactions: ActorReaction[] = [];

  // 1. Update awareness for all actors
  gameState.network.actors.forEach(actor => {
    const behavior = actor.behavior || ACTOR_BEHAVIORS.passive;

    // Decay awareness if not recently attacked
    if (!actor.lastAttacked || gameState.round - actor.lastAttacked > 3) {
      actor.awareness = decayAwareness(actor);
    }
  });

  // 2. Execute defensive strategies
  const defensiveActors = gameState.network.actors.filter(
    a => a.category === 'defensive'
  );

  defensiveActors.forEach(actor => {
    const reaction = executeCounterStrategy(actor, gameState);
    if (reaction) {
      reactions.push(reaction);
    }
  });

  // 3. Check for spontaneous reactions (high awareness actors)
  gameState.network.actors.forEach(actor => {
    if (actor.category === 'defensive') return; // Already processed

    const awareness = actor.awareness || 0;
    if (awareness > 0.7 && globalRandom.random() < 0.3) {
      const trigger: ReactionTrigger = {
        type: 'manipulation_detected',
        severity: awareness,
      };

      const reaction = generateReaction(actor, trigger, gameState);
      if (reaction) {
        reactions.push(reaction);
      }
    }
  });

  return reactions;
}

/**
 * Apply reaction effects to game state
 */
export function applyReactionEffects(
  reactions: ActorReaction[],
  gameState: GameState
): void {
  reactions.forEach(reaction => {
    const actor = gameState.network.actors.find(a => a.id === reaction.actorId);
    if (!actor) return;

    switch (reaction.type) {
      case 'resist':
        // Boost own resilience
        actor.resilience = Math.min(1, actor.resilience + reaction.strength * 0.1);
        break;

      case 'expose':
        // Reduce detection risk
        gameState.detectionRisk = Math.max(0, gameState.detectionRisk - reaction.strength * 0.1);
        break;

      case 'defend_ally':
        if (reaction.targetActorId) {
          const ally = gameState.network.actors.find(a => a.id === reaction.targetActorId);
          if (ally) {
            ally.trust = Math.min(1, ally.trust + reaction.strength * 0.05);
          }
        }
        break;

      case 'counter_campaign':
        // Already applied in counter-strategy execution
        break;
    }
  });
}
