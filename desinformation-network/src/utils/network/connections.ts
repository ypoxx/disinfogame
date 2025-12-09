/**
 * Smart Connection Algorithm
 *
 * Rule-based connection system that creates realistic network structures
 * based on actor properties (category, subcategory, etc.) rather than
 * just spatial distance.
 *
 * This replaces the simple distance-based algorithm in utils/index.ts
 */

import type { Actor, Connection, ConnectionType, ActorCategory } from '@/game-logic/types';
import { euclideanDistance, clamp } from '@/utils';

// ============================================
// CONNECTION RULES
// ============================================

export interface ConnectionRule {
  id: string;
  description: string;

  // Match criteria
  fromCategory?: ActorCategory;
  toCategory?: ActorCategory;
  fromSubcategory?: string;
  toSubcategory?: string;

  // Connection properties
  strength: number;           // 0-1
  type: ConnectionType;
  maxDistance?: number;       // Optional spatial constraint (pixels)
  probability?: number;       // 0-1, chance to create this connection

  // Optional conditions
  requiresBoth?: boolean;     // Both actors must match (for same-category rules)
}

/**
 * Predefined connection rules for realistic network structure
 * These are based on real-world relationships between actor types
 */
export const DEFAULT_CONNECTION_RULES: ConnectionRule[] = [
  // ========== MEDIA CONNECTIONS ==========
  {
    id: 'media_general',
    description: 'General media connections',
    fromCategory: 'media',
    toCategory: 'media',
    strength: 0.6,
    type: 'structural',
    probability: 0.7,
  },
  {
    id: 'quality_media_strong',
    description: 'Quality media outlets have stronger connections',
    fromSubcategory: 'quality',
    toSubcategory: 'quality',
    strength: 0.8,
    type: 'ideological',
    probability: 0.9,
  },
  {
    id: 'tabloid_network',
    description: 'Tabloids share content heavily',
    fromSubcategory: 'tabloid',
    toSubcategory: 'tabloid',
    strength: 0.75,
    type: 'structural',
    probability: 0.85,
  },
  {
    id: 'regional_media',
    description: 'Regional media connects with national',
    fromSubcategory: 'regional',
    fromCategory: 'media',
    toCategory: 'media',
    strength: 0.5,
    type: 'structural',
    probability: 0.6,
  },

  // ========== MEDIA <-> EXPERT CONNECTIONS ==========
  {
    id: 'media_expert_general',
    description: 'Media interviews and cites experts',
    fromCategory: 'media',
    toCategory: 'expert',
    strength: 0.55,
    type: 'social',
    probability: 0.7,
  },
  {
    id: 'quality_media_expert_strong',
    description: 'Quality media relies heavily on experts',
    fromSubcategory: 'quality',
    fromCategory: 'media',
    toCategory: 'expert',
    strength: 0.8,
    type: 'social',
    probability: 0.9,
  },
  {
    id: 'tv_expert_booking',
    description: 'TV shows book experts as guests',
    fromSubcategory: 'tv_private',
    fromCategory: 'media',
    toCategory: 'expert',
    strength: 0.7,
    type: 'social',
    probability: 0.8,
  },

  // ========== EXPERT CONNECTIONS ==========
  {
    id: 'expert_network',
    description: 'Experts in academic/professional networks',
    fromCategory: 'expert',
    toCategory: 'expert',
    strength: 0.65,
    type: 'social',
    probability: 0.75,
  },
  {
    id: 'same_field_experts',
    description: 'Experts in same field strongly connected',
    fromCategory: 'expert',
    toCategory: 'expert',
    fromSubcategory: 'same', // Special: checked programmatically
    strength: 0.85,
    type: 'ideological',
    probability: 0.9,
  },

  // ========== LOBBY CONNECTIONS ==========
  {
    id: 'lobby_expert_funding',
    description: 'Lobbies fund/influence experts',
    fromCategory: 'lobby',
    toCategory: 'expert',
    strength: 0.65,
    type: 'financial',
    probability: 0.6,
  },
  {
    id: 'lobby_media_advertising',
    description: 'Lobbies advertise in media',
    fromCategory: 'lobby',
    toCategory: 'media',
    strength: 0.5,
    type: 'financial',
    probability: 0.7,
  },
  {
    id: 'industry_lobby_network',
    description: 'Industry lobbies coordinate',
    fromCategory: 'lobby',
    toCategory: 'lobby',
    fromSubcategory: 'industry',
    toSubcategory: 'industry',
    strength: 0.7,
    type: 'structural',
    probability: 0.8,
  },
  {
    id: 'ngo_coordination',
    description: 'NGOs form coalitions',
    fromCategory: 'lobby',
    toCategory: 'lobby',
    fromSubcategory: 'ngo',
    toSubcategory: 'ngo',
    strength: 0.75,
    type: 'ideological',
    probability: 0.85,
  },

  // ========== INFRASTRUCTURE CONNECTIONS ==========
  {
    id: 'infrastructure_media_hub',
    description: 'Infrastructure (social media) connects to all media',
    fromCategory: 'infrastructure',
    toCategory: 'media',
    strength: 0.9,
    type: 'structural',
    probability: 0.95,
  },
  {
    id: 'infrastructure_expert_platform',
    description: 'Experts use social platforms',
    fromCategory: 'infrastructure',
    toCategory: 'expert',
    strength: 0.75,
    type: 'structural',
    probability: 0.85,
  },
  {
    id: 'infrastructure_network',
    description: 'Infrastructure platforms interconnect',
    fromCategory: 'infrastructure',
    toCategory: 'infrastructure',
    strength: 0.8,
    type: 'structural',
    probability: 0.9,
  },

  // ========== ORGANIZATION CONNECTIONS ==========
  {
    id: 'org_media_official',
    description: 'Organizations issue official statements to media',
    fromCategory: 'organization',
    toCategory: 'media',
    strength: 0.7,
    type: 'social',
    probability: 0.8,
  },
  {
    id: 'org_expert_affiliation',
    description: 'Experts affiliated with organizations',
    fromCategory: 'organization',
    toCategory: 'expert',
    strength: 0.75,
    type: 'social',
    probability: 0.85,
  },
  {
    id: 'government_org_network',
    description: 'Government organizations coordinate',
    fromCategory: 'organization',
    toCategory: 'organization',
    fromSubcategory: 'government',
    toSubcategory: 'government',
    strength: 0.8,
    type: 'structural',
    probability: 0.9,
  },

  // ========== DEFENSIVE ACTOR CONNECTIONS ==========
  {
    id: 'defensive_media_monitoring',
    description: 'Fact-checkers monitor media',
    fromCategory: 'defensive',
    toCategory: 'media',
    strength: 0.6,
    type: 'social',
    probability: 1.0, // Always connect
  },
  {
    id: 'defensive_expert_collaboration',
    description: 'Fact-checkers work with experts',
    fromCategory: 'defensive',
    toCategory: 'expert',
    strength: 0.7,
    type: 'social',
    probability: 0.9,
  },
];

// ============================================
// CONNECTION ALGORITHM
// ============================================

/**
 * Calculate smart connections based on rules
 * This is the main function that replaces calculateConnections from utils/index.ts
 */
export function calculateSmartConnections(
  actors: Actor[],
  rules: ConnectionRule[] = DEFAULT_CONNECTION_RULES,
  options: {
    useCustomRules?: boolean;  // Use actor-specific connection rules
    useSpatialConstraints?: boolean;  // Apply distance limits
    minStrength?: number;  // Only create connections above this strength
  } = {}
): Connection[] {
  const {
    useCustomRules = true,
    useSpatialConstraints = true,
    minStrength = 0.2,
  } = options;

  const connections: Connection[] = [];
  const processedPairs = new Set<string>();

  // Process each pair of actors
  for (let i = 0; i < actors.length; i++) {
    for (let j = i + 1; j < actors.length; j++) {
      const a1 = actors[i];
      const a2 = actors[j];

      const pairId = getPairId(a1.id, a2.id);
      if (processedPairs.has(pairId)) continue;
      processedPairs.add(pairId);

      // Try custom rules first (from actor definitions)
      if (useCustomRules) {
        const customConnection = tryCustomConnectionRules(a1, a2, actors);
        if (customConnection && customConnection.strength >= minStrength) {
          connections.push(customConnection);
          continue;
        }
      }

      // Try predefined rules
      const ruleConnection = tryConnectionRules(a1, a2, rules, useSpatialConstraints);
      if (ruleConnection && ruleConnection.strength >= minStrength) {
        connections.push(ruleConnection);
      }
    }
  }

  return connections;
}

/**
 * Try to create connection using custom rules from actor definitions
 */
function tryCustomConnectionRules(
  a1: Actor,
  a2: Actor,
  allActors: Actor[]
): Connection | null {
  // Check if a1 has custom connection rules
  const def1 = a1 as any; // ActorDefinition fields might be present
  if (!def1.connections) return null;

  const rules = def1.connections;

  // Check if a2 matches any of the connection rules
  let shouldConnect = false;
  let connectionStrength = rules.strength || 0.6;

  // Check category matches
  if (rules.categories && rules.categories.length > 0) {
    const categoryMatch = rules.categories.some((cat: string) => {
      // Support "category.subcategory" notation
      if (cat.includes('.')) {
        const [category, subcategory] = cat.split('.');
        return a2.category === category && a2.subcategory === subcategory;
      }
      return a2.category === cat;
    });
    if (categoryMatch) shouldConnect = true;
  }

  // Check specific actor IDs
  if (rules.specific && rules.specific.includes(a2.id)) {
    shouldConnect = true;
  }

  if (!shouldConnect) return null;

  return {
    id: `${a1.id}-${a2.id}`,
    sourceId: a1.id,
    targetId: a2.id,
    strength: connectionStrength,
    trustFlow: connectionStrength * 0.1,
    type: 'structural', // Custom rules default to structural
    visible: connectionStrength > 0.4,
    bidirectional: true,
  };
}

/**
 * Try to create connection using predefined rules
 */
function tryConnectionRules(
  a1: Actor,
  a2: Actor,
  rules: ConnectionRule[],
  useSpatialConstraints: boolean
): Connection | null {
  // Find matching rules
  const matchingRules = rules.filter(rule =>
    matchesRule(a1, a2, rule)
  );

  if (matchingRules.length === 0) return null;

  // Use the strongest matching rule
  const bestRule = matchingRules.reduce((best, rule) =>
    rule.strength > best.strength ? rule : best
  );

  // Check probability
  if (bestRule.probability && Math.random() > bestRule.probability) {
    return null;
  }

  // Check spatial constraint if enabled
  if (useSpatialConstraints && bestRule.maxDistance) {
    const distance = euclideanDistance(a1.position, a2.position);
    if (distance > bestRule.maxDistance) return null;
  }

  // Create connection
  return {
    id: `${a1.id}-${a2.id}`,
    sourceId: a1.id,
    targetId: a2.id,
    strength: bestRule.strength,
    trustFlow: bestRule.strength * 0.1,
    type: bestRule.type,
    visible: bestRule.strength > 0.4,
    bidirectional: true,
  };
}

/**
 * Check if a pair of actors matches a connection rule
 */
function matchesRule(a1: Actor, a2: Actor, rule: ConnectionRule): boolean {
  // Check category constraints
  if (rule.fromCategory && a1.category !== rule.fromCategory) {
    // Try reverse
    if (rule.toCategory && a2.category !== rule.fromCategory) {
      return false;
    }
  }

  if (rule.toCategory && a2.category !== rule.toCategory) {
    // Try reverse
    if (rule.fromCategory && a1.category !== rule.toCategory) {
      return false;
    }
  }

  // Check subcategory constraints
  if (rule.fromSubcategory) {
    // Special case: "same" means both actors have same subcategory
    if (rule.fromSubcategory === 'same') {
      return a1.subcategory === a2.subcategory && a1.subcategory !== undefined;
    }

    if (a1.subcategory !== rule.fromSubcategory) {
      // Try reverse
      if (rule.toSubcategory && a2.subcategory !== rule.fromSubcategory) {
        return false;
      }
    }
  }

  if (rule.toSubcategory) {
    if (rule.toSubcategory === 'same') {
      return a1.subcategory === a2.subcategory && a1.subcategory !== undefined;
    }

    if (a2.subcategory !== rule.toSubcategory) {
      // Try reverse
      if (rule.fromSubcategory && a1.subcategory !== rule.toSubcategory) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Get consistent pair ID regardless of order
 */
function getPairId(id1: string, id2: string): string {
  return id1 < id2 ? `${id1}-${id2}` : `${id2}-${id1}`;
}

/**
 * Add custom connection rule to existing rules
 */
export function addConnectionRule(rule: ConnectionRule): void {
  DEFAULT_CONNECTION_RULES.push(rule);
}

/**
 * Get connection strength between two specific actors
 * Useful for UI hover/inspection
 */
export function getConnectionStrength(
  a1: Actor,
  a2: Actor,
  rules: ConnectionRule[] = DEFAULT_CONNECTION_RULES
): number {
  const matchingRules = rules.filter(rule => matchesRule(a1, a2, rule));
  if (matchingRules.length === 0) return 0;

  return matchingRules.reduce((max, rule) => Math.max(max, rule.strength), 0);
}

/**
 * Get all potential connections for an actor (for preview)
 */
export function getActorConnectionPotential(
  actor: Actor,
  allActors: Actor[],
  rules: ConnectionRule[] = DEFAULT_CONNECTION_RULES
): Array<{ actor: Actor; strength: number; type: ConnectionType }> {
  const potentials: Array<{ actor: Actor; strength: number; type: ConnectionType }> = [];

  for (const other of allActors) {
    if (other.id === actor.id) continue;

    const matchingRules = rules.filter(rule =>
      matchesRule(actor, other, rule)
    );

    if (matchingRules.length > 0) {
      const bestRule = matchingRules.reduce((best, rule) =>
        rule.strength > best.strength ? rule : best
      );

      potentials.push({
        actor: other,
        strength: bestRule.strength,
        type: bestRule.type,
      });
    }
  }

  return potentials.sort((a, b) => b.strength - a.strength);
}
