/**
 * Combo System for Ability Chains
 *
 * Tracks sequences of abilities and rewards strategic play with bonuses.
 * Combos expire after a certain number of rounds if not completed.
 */

import type {
  GameState,
  Actor,
  AbilityCombo,
  ComboProgress,
} from './types';

// ============================================
// TYPES
// ============================================

export interface ComboDefinition {
  id: string;
  name: string;
  description: string;
  requiredAbilities: string[];
  windowRounds: number; // How many rounds to complete the combo
  bonusEffect: ComboBonus;
  category: string;
}

export interface ComboBonus {
  trustReduction?: number;
  attentionCost?: number;
  attentionReduction?: number;
  bonusAttention?: number;
  propagationBonus?: number;
  emotionalDamage?: number;
  resilienceDamage?: number;
  infrastructureGain?: number;
  moneyRefund?: number;
  spreadToConnected?: boolean;
  spreadRadius?: number;
  cascadeDepth?: number;
  connectionWeakening?: number;
  isolationBonus?: boolean;
  polarizationBonus?: number;
  groupEffect?: number;
  detectionReduction?: number;
  emotionalMultiplier?: number;
  permanentPolarization?: number;
  timedBonus?: string;
  achievementUnlock?: string;
}

export interface ComboActivation {
  comboId: string;
  targetActorId: string;
  completedRound: number;
  bonusEffect: ComboBonus;
}

// ============================================
// COMBO TRACKING
// ============================================

/**
 * Check if an ability usage starts or progresses any combos
 */
export function updateComboProgress(
  gameState: GameState,
  abilityId: string,
  targetActorId: string,
  comboDefinitions: ComboDefinition[]
): {
  newProgress: ComboProgress[];
  completedCombos: ComboActivation[];
} {
  const currentRound = gameState.round;
  const newProgress: ComboProgress[] = [];
  const completedCombos: ComboActivation[] = [];

  // Check each combo definition
  for (const combo of comboDefinitions) {
    // Find existing progress for this combo and target
    const existingProgress = gameState.activeCombos.find(
      (cp) => cp.comboId === combo.id && cp.targetActorId === targetActorId
    );

    if (existingProgress) {
      // Check if ability is next in sequence
      const nextRequired = combo.requiredAbilities[existingProgress.usedAbilities.length];

      if (nextRequired === abilityId) {
        // Progress the combo
        const updatedProgress: ComboProgress = {
          ...existingProgress,
          usedAbilities: [...existingProgress.usedAbilities, abilityId],
        };

        // Check if combo is complete
        if (updatedProgress.usedAbilities.length === combo.requiredAbilities.length) {
          completedCombos.push({
            comboId: combo.id,
            targetActorId,
            completedRound: currentRound,
            bonusEffect: combo.bonusEffect,
          });
        } else {
          newProgress.push(updatedProgress);
        }
      } else {
        // Wrong ability - keep existing progress if still valid
        if (currentRound - existingProgress.startRound <= combo.windowRounds) {
          newProgress.push(existingProgress);
        }
      }
    } else {
      // Check if this ability starts the combo
      if (combo.requiredAbilities[0] === abilityId) {
        newProgress.push({
          comboId: combo.id,
          targetActorId,
          usedAbilities: [abilityId],
          startRound: currentRound,
        });
      }
    }
  }

  // Keep other active combos (different targets or not affected)
  for (const progress of gameState.activeCombos) {
    // Skip if we already processed this combo for this target
    if (progress.targetActorId === targetActorId) {
      const combo = comboDefinitions.find((c) => c.id === progress.comboId);
      if (combo && currentRound - progress.startRound > combo.windowRounds) {
        continue; // Expired
      }
    }

    // Keep if not already in newProgress
    if (!newProgress.some((np) => np.comboId === progress.comboId && np.targetActorId === progress.targetActorId)) {
      // Check if still valid
      const combo = comboDefinitions.find((c) => c.id === progress.comboId);
      if (combo && currentRound - progress.startRound <= combo.windowRounds) {
        newProgress.push(progress);
      }
    }
  }

  return { newProgress, completedCombos };
}

/**
 * Clean up expired combo progress at round end
 */
export function cleanExpiredCombos(
  gameState: GameState,
  comboDefinitions: ComboDefinition[]
): ComboProgress[] {
  const currentRound = gameState.round;

  return gameState.activeCombos.filter((progress) => {
    const combo = comboDefinitions.find((c) => c.id === progress.comboId);
    if (!combo) return false;

    return currentRound - progress.startRound <= combo.windowRounds;
  });
}

// ============================================
// COMBO EFFECTS
// ============================================

/**
 * Apply combo bonus effects to target and game state
 */
export function applyComboBonus(
  gameState: GameState,
  activation: ComboActivation,
  comboDefinition: ComboDefinition
): void {
  const target = gameState.network.actors.find((a) => a.id === activation.targetActorId);
  if (!target) return;

  const bonus = activation.bonusEffect;

  // Trust reduction
  if (bonus.trustReduction) {
    target.trust = Math.max(0, target.trust - bonus.trustReduction);
  }

  // Emotional damage
  if (bonus.emotionalDamage) {
    const multiplier = bonus.emotionalMultiplier || 1;
    const timedMultiplier = bonus.timedBonus === 'when_resilience_low' && target.resilience < 0.3 ? 1.5 : 1;
    target.emotionalState = Math.max(
      0,
      target.emotionalState - bonus.emotionalDamage * multiplier * timedMultiplier
    );
  }

  // Resilience damage
  if (bonus.resilienceDamage) {
    target.resilience = Math.max(0, target.resilience - bonus.resilienceDamage);
  }

  // Attention changes
  if (bonus.attentionCost) {
    gameState.resources.attention = Math.max(
      0,
      gameState.resources.attention + bonus.attentionCost
    );
  }
  if (bonus.attentionReduction) {
    gameState.resources.attention = Math.max(
      0,
      gameState.resources.attention - bonus.attentionReduction
    );
  }
  if (bonus.bonusAttention) {
    gameState.resources.attention = Math.max(
      0,
      gameState.resources.attention + bonus.bonusAttention
    );
  }

  // Infrastructure gain
  if (bonus.infrastructureGain) {
    gameState.resources.infrastructure += bonus.infrastructureGain;
  }

  // Money refund
  if (bonus.moneyRefund) {
    gameState.resources.money += bonus.moneyRefund;
  }

  // Detection reduction
  if (bonus.detectionReduction) {
    gameState.detectionRisk = Math.max(0, gameState.detectionRisk - bonus.detectionReduction);
  }

  // Spread to connected actors
  if (bonus.spreadToConnected) {
    const connected = getConnectedActors(gameState, target.id, bonus.spreadRadius || 1);
    connected.forEach((actor) => {
      if (bonus.trustReduction) {
        actor.trust = Math.max(0, actor.trust - bonus.trustReduction * 0.5); // 50% effect on connected
      }
      if (bonus.emotionalDamage) {
        actor.emotionalState = Math.max(0, actor.emotionalState - bonus.emotionalDamage * 0.5);
      }
    });
  }

  // Connection weakening
  if (bonus.connectionWeakening !== undefined) {
    gameState.network.connections.forEach((conn) => {
      if (conn.sourceId === target.id || conn.targetId === target.id) {
        conn.strength = Math.max(0, conn.strength - (bonus.connectionWeakening ?? 0));
      }
    });
  }

  // Polarization bonus
  if (bonus.polarizationBonus) {
    gameState.network.polarizationIndex = Math.min(
      1,
      gameState.network.polarizationIndex + bonus.polarizationBonus
    );
  }

  // Achievement unlock
  if (bonus.achievementUnlock && !gameState.statistics.achievements.includes(bonus.achievementUnlock)) {
    gameState.statistics.achievements.push(bonus.achievementUnlock);
  }
}

/**
 * Get actors connected to a target within a certain depth
 */
function getConnectedActors(
  gameState: GameState,
  actorId: string,
  maxDepth: number
): Actor[] {
  const visited = new Set<string>();
  const result: Actor[] = [];
  const queue: Array<{ id: string; depth: number }> = [{ id: actorId, depth: 0 }];

  while (queue.length > 0) {
    const { id, depth } = queue.shift()!;

    if (visited.has(id) || depth > maxDepth) continue;
    visited.add(id);

    const actor = gameState.network.actors.find((a) => a.id === id);
    if (actor && id !== actorId) {
      result.push(actor);
    }

    if (depth < maxDepth) {
      gameState.network.connections.forEach((conn) => {
        if (conn.sourceId === id && !visited.has(conn.targetId)) {
          queue.push({ id: conn.targetId, depth: depth + 1 });
        } else if (conn.targetId === id && !visited.has(conn.sourceId)) {
          queue.push({ id: conn.sourceId, depth: depth + 1 });
        }
      });
    }
  }

  return result;
}

// ============================================
// COMBO QUERIES
// ============================================

/**
 * Get active combos for a specific actor
 */
export function getActiveCombosForActor(
  gameState: GameState,
  actorId: string
): ComboProgress[] {
  return gameState.activeCombos.filter((cp) => cp.targetActorId === actorId);
}

/**
 * Get combo definition by ID
 */
export function getComboDefinition(
  comboId: string,
  comboDefinitions: ComboDefinition[]
): ComboDefinition | undefined {
  return comboDefinitions.find((c) => c.id === comboId);
}

/**
 * Calculate combo progress percentage
 */
export function getComboProgressPercentage(
  progress: ComboProgress,
  comboDefinition: ComboDefinition
): number {
  return (progress.usedAbilities.length / comboDefinition.requiredAbilities.length) * 100;
}

/**
 * Get next required ability for a combo in progress
 */
export function getNextRequiredAbility(
  progress: ComboProgress,
  comboDefinition: ComboDefinition
): string | null {
  if (progress.usedAbilities.length >= comboDefinition.requiredAbilities.length) {
    return null;
  }
  return comboDefinition.requiredAbilities[progress.usedAbilities.length];
}

/**
 * Check if a combo is about to expire
 */
export function isComboExpiringSoon(
  progress: ComboProgress,
  comboDefinition: ComboDefinition,
  currentRound: number
): boolean {
  const roundsLeft = comboDefinition.windowRounds - (currentRound - progress.startRound);
  return roundsLeft <= 1;
}

// ============================================
// STATISTICS
// ============================================

/**
 * Get combo statistics for game summary
 */
export function getComboStatistics(gameState: GameState): {
  totalCompleted: number;
  byCategory: Record<string, number>;
  mostUsed: string | null;
} {
  const byCategory: Record<string, number> = {};
  let mostUsedCombo: string | null = null;
  let mostUsedCount = 0;

  const comboCounts = new Map<string, number>();

  gameState.completedCombos.forEach((comboId) => {
    comboCounts.set(comboId, (comboCounts.get(comboId) || 0) + 1);
  });

  comboCounts.forEach((count, comboId) => {
    if (count > mostUsedCount) {
      mostUsedCount = count;
      mostUsedCombo = comboId;
    }
  });

  return {
    totalCompleted: gameState.completedCombos.length,
    byCategory,
    mostUsed: mostUsedCombo,
  };
}
