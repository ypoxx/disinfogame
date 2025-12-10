/**
 * Balance Configuration for Massive Expansion (58 Actors)
 *
 * Adjusts game balance for increased actor count while maintaining
 * challenge and strategic depth across all difficulty levels.
 */

export interface BalanceConfig {
  // Resource Economy
  initialMoney: number;
  moneyPerRound: number;
  infrastructureBonusMultiplier: number;

  // Detection & Exposure
  attentionDecayRate: number;
  detectionThreshold: number;
  exposureThreshold: number;

  // Victory Conditions
  maxRounds: number;
  victoryThreshold: number;      // % of actors needed
  victoryTrustLevel: number;     // Trust level needed
  defensiveVictoryTrust: number; // Trust level for defensive victory

  // Defensive Spawns
  defensiveSpawnInterval: number;
  maxDefensiveActors: number;

  // Events
  randomEventChance: number;

  // NEW: Network Size Scaling
  actorCount: number;
  enableTier2Actors: boolean;
  enableTier3Actors: boolean;

  // NEW: Ability Costs Scaling
  abilityCostMultiplier: number;

  // NEW: Trust Propagation
  trustPropagationStrength: number;

  // NEW: Event Scaling
  eventImpactMultiplier: number;
}

/**
 * Difficulty Presets
 */
export type DifficultyLevel = 'tutorial' | 'easy' | 'normal' | 'hard' | 'expert';

/**
 * Balance configs for different network sizes
 */
export const BALANCE_PRESETS: Record<DifficultyLevel, BalanceConfig> = {
  tutorial: {
    // Basic 16 actor game for learning
    initialMoney: 200,
    moneyPerRound: 40,
    infrastructureBonusMultiplier: 0.15,
    attentionDecayRate: 0.10,
    detectionThreshold: 0.75,      // Reduced: makes detection more meaningful
    exposureThreshold: 0.85,       // Reduced: makes exposure a real threat
    maxRounds: 24,
    victoryThreshold: 0.6,  // Only 60% needed
    victoryTrustLevel: 0.5, // 50% trust
    defensiveVictoryTrust: 0.65,
    defensiveSpawnInterval: 12,
    maxDefensiveActors: 2,
    randomEventChance: 0.2,
    actorCount: 16,
    enableTier2Actors: false,
    enableTier3Actors: false,
    abilityCostMultiplier: 0.8,
    trustPropagationStrength: 0.5,
    eventImpactMultiplier: 0.8,
  },

  easy: {
    // 32 actors (Tier 1 + some Tier 2)
    initialMoney: 180,
    moneyPerRound: 35,
    infrastructureBonusMultiplier: 0.12,
    attentionDecayRate: 0.12,
    detectionThreshold: 0.70,      // Reduced
    exposureThreshold: 0.80,       // Reduced
    maxRounds: 28,
    victoryThreshold: 0.65,
    victoryTrustLevel: 0.45,
    defensiveVictoryTrust: 0.68,
    defensiveSpawnInterval: 10,
    maxDefensiveActors: 3,
    randomEventChance: 0.25,
    actorCount: 32,
    enableTier2Actors: true,
    enableTier3Actors: false,
    abilityCostMultiplier: 0.9,
    trustPropagationStrength: 0.6,
    eventImpactMultiplier: 0.9,
  },

  normal: {
    // Full 58 actors (Standard difficulty)
    initialMoney: 150,
    moneyPerRound: 30,
    infrastructureBonusMultiplier: 0.10,
    attentionDecayRate: 0.15,
    detectionThreshold: 0.60,      // Reduced: makes detection meaningful
    exposureThreshold: 0.70,       // Reduced: exposure is now a real threat
    maxRounds: 32,
    victoryThreshold: 0.70,      // 70% of 58 = ~41 actors
    victoryTrustLevel: 0.40,     // Below 40% trust
    defensiveVictoryTrust: 0.70, // Above 70% average
    defensiveSpawnInterval: 8,
    maxDefensiveActors: 4,
    randomEventChance: 0.30,
    actorCount: 58,
    enableTier2Actors: true,
    enableTier3Actors: true,
    abilityCostMultiplier: 1.0,
    trustPropagationStrength: 0.7,
    eventImpactMultiplier: 1.0,
  },

  hard: {
    // Full 58 actors (Challenging)
    initialMoney: 120,
    moneyPerRound: 25,
    infrastructureBonusMultiplier: 0.08,
    attentionDecayRate: 0.18,
    detectionThreshold: 0.55,      // Reduced
    exposureThreshold: 0.65,       // Reduced
    maxRounds: 36,
    victoryThreshold: 0.75,      // 75% of 58 = ~44 actors
    victoryTrustLevel: 0.35,
    defensiveVictoryTrust: 0.72,
    defensiveSpawnInterval: 6,
    maxDefensiveActors: 5,
    randomEventChance: 0.35,
    actorCount: 58,
    enableTier2Actors: true,
    enableTier3Actors: true,
    abilityCostMultiplier: 1.2,
    trustPropagationStrength: 0.8,
    eventImpactMultiplier: 1.2,
  },

  expert: {
    // Full 58 actors (Expert mode)
    initialMoney: 100,
    moneyPerRound: 20,
    infrastructureBonusMultiplier: 0.05,
    attentionDecayRate: 0.20,
    detectionThreshold: 0.50,      // Reduced: very challenging
    exposureThreshold: 0.60,       // Reduced: exposure is a constant threat
    maxRounds: 40,
    victoryThreshold: 0.80,      // 80% of 58 = ~47 actors
    victoryTrustLevel: 0.30,
    defensiveVictoryTrust: 0.75,
    defensiveSpawnInterval: 5,
    maxDefensiveActors: 6,
    randomEventChance: 0.40,
    actorCount: 58,
    enableTier2Actors: true,
    enableTier3Actors: true,
    abilityCostMultiplier: 1.5,
    trustPropagationStrength: 0.9,
    eventImpactMultiplier: 1.5,
  },
};

/**
 * Get balance config for difficulty level
 */
export function getBalanceConfig(difficulty: DifficultyLevel): BalanceConfig {
  return BALANCE_PRESETS[difficulty];
}

/**
 * Filter actors by enabled tiers based on config
 */
export function filterActorsByTiers(
  actors: any[],
  config: BalanceConfig
): any[] {
  return actors.filter(actor => {
    const tier = actor.tier || 1;

    if (tier === 1) return true; // Always include Tier 1
    if (tier === 2) return config.enableTier2Actors;
    if (tier === 3) return config.enableTier3Actors;

    return false;
  });
}

/**
 * Adjust ability costs based on config
 */
export function adjustAbilityCost(
  baseCost: number,
  config: BalanceConfig
): number {
  return Math.round(baseCost * config.abilityCostMultiplier);
}

/**
 * Calculate scaled trust propagation
 */
export function calculateScaledTrustFlow(
  baseTrustFlow: number,
  config: BalanceConfig
): number {
  return baseTrustFlow * config.trustPropagationStrength;
}

/**
 * Calculate scaled event impact
 */
export function calculateScaledEventImpact(
  baseImpact: number,
  config: BalanceConfig
): number {
  return baseImpact * config.eventImpactMultiplier;
}

/**
 * Calculate dynamic defensive spawn threshold
 * More actors = higher trust needed before spawning defensive
 */
export function getDynamicDefensiveSpawnTrust(config: BalanceConfig): number {
  // Scale based on actor count
  // 16 actors: 0.35 threshold
  // 58 actors: 0.45 threshold
  const baseThreshold = 0.35;
  const scaleFactor = (config.actorCount - 16) / 42; // 0-1 range
  return baseThreshold + (scaleFactor * 0.10);
}

/**
 * Get recommended actor count based on difficulty
 */
export function getRecommendedActorCount(difficulty: DifficultyLevel): number {
  const counts: Record<DifficultyLevel, number> = {
    tutorial: 16,
    easy: 32,
    normal: 58,
    hard: 58,
    expert: 58,
  };
  return counts[difficulty];
}

/**
 * Calculate victory conditions based on current game state
 */
export interface VictoryConditions {
  requiredActorCount: number;   // Number of actors that must be below trust threshold
  requiredTrustLevel: number;    // Trust level threshold
  maxRounds: number;             // Maximum rounds to complete
  defensiveVictoryTrust: number; // Trust level for defensive victory
}

export function calculateVictoryConditions(
  totalActors: number,
  config: BalanceConfig
): VictoryConditions {
  return {
    requiredActorCount: Math.ceil(totalActors * config.victoryThreshold),
    requiredTrustLevel: config.victoryTrustLevel,
    maxRounds: config.maxRounds,
    defensiveVictoryTrust: config.defensiveVictoryTrust,
  };
}

/**
 * Balance recommendations for game designers
 */
export const BALANCE_NOTES = {
  actorScaling: `
    With 58 actors, victory requires manipulating ~41 actors (70% threshold).
    This maintains strategic challenge while accounting for increased complexity.
  `,

  resourceScaling: `
    Money per round (30) allows ~1 major action per round with saving required
    for expensive combos. Infrastructure investment becomes more valuable with
    more actors to influence.
  `,

  eventScaling: `
    Event probability (30%) means roughly 1 event every 3 rounds.
    With 58 actors, events can create more complex network effects and
    opportunities for strategic plays.
  `,

  defensiveScaling: `
    Defensive actors spawn every 8 rounds with max 4 actors.
    They represent societal immune response to excessive manipulation.
    Spawn threshold scales with actor count to maintain challenge.
  `,

  tierSystem: `
    Tier 1 (16 actors): Core actors, always visible, high impact
    Tier 2 (26 actors): Secondary actors, medium impact
    Tier 3 (16 actors): Background actors, contextual depth

    Lower difficulties can disable Tier 2/3 for simpler games.
  `,
};

/**
 * Default balance config (Normal difficulty)
 */
export const DEFAULT_BALANCE_CONFIG = BALANCE_PRESETS.normal;
