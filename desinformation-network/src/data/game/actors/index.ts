/**
 * Actor Definitions Loader
 *
 * Centralized loading of all actor definitions from JSON files.
 * Supports modular actor definitions organized by category.
 */

import type { ActorDefinition } from '@/game-logic/types';
import { gameLogger } from '@/utils/logger';

// Import core actors (existing 16 actors)
import coreActorsV2 from '../actor-definitions-v2.json';

// Import extended actors (new 42+ actors)
import mediaExtended from './media-extended.json';
import expertsExtended from './experts-extended.json';
import lobbyExtended from './lobby-extended.json';
import orgsInfrastructure from './organizations-infrastructure.json';

/**
 * Enhance core actors with tier information
 * Core actors from v2 become Tier 1 (most important)
 */
function enhanceCoreActors(actors: any[]): ActorDefinition[] {
  return actors.map(actor => ({
    ...actor,
    // Map old 'subtype' field to new 'subcategory'
    subcategory: actor.subcategory || actor.subtype,
    // Add tier info
    tier: actor.tier || 1, // Core actors default to Tier 1
    renderPriority: actor.renderPriority || 10,
    // Default icon based on category
    icon: actor.icon || getDefaultIcon(actor.category),
    // Convert old 'connections' string to new format
    connections: normalizeConnections(actor.connections, actor.category),
  })) as ActorDefinition[];
}

/**
 * Get default icon for category
 */
function getDefaultIcon(category: string): string {
  const icons: Record<string, string> = {
    media: '📰',
    expert: '👨‍🏫',
    lobby: '🏢',
    organization: '🏛️',
    infrastructure: '🌐',
    defensive: '🛡️',
  };
  return icons[category] || '👤';
}

/**
 * Normalize old connections format to new format
 */
function normalizeConnections(oldConnections: any, category: string): any {
  // If already in new format, return as-is
  if (oldConnections && typeof oldConnections === 'object' && oldConnections.categories) {
    return oldConnections;
  }

  // Convert old string format ("high", "medium", etc.) to new format
  const strengthMap: Record<string, number> = {
    'ultra-high': 0.9,
    'high': 0.75,
    'medium-high': 0.65,
    'medium': 0.6,
    'medium-low': 0.5,
    'low': 0.4,
  };

  const strength = typeof oldConnections === 'string'
    ? strengthMap[oldConnections] || 0.6
    : 0.6;

  // Default connections based on category
  return {
    categories: [category],
    strength,
  };
}

/**
 * Combine all actor definitions
 */
function combineActorDefinitions(): ActorDefinition[] {
  const coreActors = enhanceCoreActors(coreActorsV2 as any[]);

  // Cast extended actors (already have tier info)
  const allActors = [
    ...coreActors,
    ...mediaExtended as ActorDefinition[],
    ...expertsExtended as ActorDefinition[],
    ...lobbyExtended as ActorDefinition[],
    ...orgsInfrastructure as ActorDefinition[],
  ];

  // Validate: Check for duplicate IDs
  const ids = new Set<string>();
  const duplicates: string[] = [];

  allActors.forEach(actor => {
    if (ids.has(actor.id)) {
      duplicates.push(actor.id);
    }
    ids.add(actor.id);
  });

  if (duplicates.length > 0) {
    gameLogger.error('Duplicate actor IDs found:', duplicates);
  }

  gameLogger.log(`✅ Loaded ${allActors.length} actor definitions`);
  gameLogger.log(`  - Tier 1 (Core): ${allActors.filter(a => a.tier === 1).length}`);
  gameLogger.log(`  - Tier 2 (Secondary): ${allActors.filter(a => a.tier === 2).length}`);
  gameLogger.log(`  - Tier 3 (Background): ${allActors.filter(a => a.tier === 3).length}`);

  return allActors;
}

/**
 * Get actor definitions by category
 */
export function getActorsByCategory(category: string): ActorDefinition[] {
  return ALL_ACTORS.filter(a => a.category === category);
}

/**
 * Get actor definitions by tier
 */
export function getActorsByTier(tier: 1 | 2 | 3): ActorDefinition[] {
  return ALL_ACTORS.filter(a => a.tier === tier);
}

/**
 * Get single actor definition by ID
 */
export function getActorById(id: string): ActorDefinition | undefined {
  return ALL_ACTORS.find(a => a.id === id);
}

/**
 * Get statistics about loaded actors
 */
export function getActorStats(): {
  total: number;
  byTier: Record<number, number>;
  byCategory: Record<string, number>;
  representsCounts: number; // How many real-world entities are represented
} {
  const byTier: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
  const byCategory: Record<string, number> = {};
  let representsCounts = 0;

  ALL_ACTORS.forEach(actor => {
    byTier[actor.tier] = (byTier[actor.tier] || 0) + 1;
    byCategory[actor.category] = (byCategory[actor.category] || 0) + 1;
    if (actor.representsCount) {
      representsCounts += actor.representsCount;
    } else {
      representsCounts += 1;
    }
  });

  return {
    total: ALL_ACTORS.length,
    byTier,
    byCategory,
    representsCounts,
  };
}

// Export all actors
export const ALL_ACTORS = combineActorDefinitions();

// Default export
export default ALL_ACTORS;
