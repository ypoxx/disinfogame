/**
 * Event Chain System (Phase 4.4)
 *
 * Manages complex event sequences with player choices, dependencies,
 * and branching narratives. Events can trigger follow-up events after
 * delays or based on player decisions.
 */

import type { GameState, GameEvent, EventChoice, EventEffect } from './types';
import { gameLogger } from '@/utils/logger';

// ============================================
// TYPES
// ============================================

export interface ActiveEventChain {
  chainId: string;
  startRound: number;
  nextEventId?: string;
  nextEventDelay?: number; // Rounds to wait before triggering next event
  playerChoice?: {
    eventId: string;
    chosenOption: number;
    round: number;
  };
}

export interface PendingEventChoice {
  event: GameEvent;
  round: number;
}

// ============================================
// EVENT CHAIN TRACKING
// ============================================

/**
 * Start a new event chain
 */
export function startEventChain(
  gameState: GameState,
  event: GameEvent
): void {
  // Check if this event chains to another
  if (event.chainTo) {
    const chain: ActiveEventChain = {
      chainId: event.id,
      startRound: gameState.round,
      nextEventId: event.chainTo,
      nextEventDelay: event.playerChoice ? 3 : 2, // Wait longer if player made choice
    };

    gameState.activeEventChains = gameState.activeEventChains || [];
    gameState.activeEventChains.push(chain);

    gameLogger.log(`🔗 Event chain started: ${event.id} → ${event.chainTo}`);
  }
}

/**
 * Process active event chains and trigger delayed events
 */
export function processEventChains(
  gameState: GameState,
  eventDefinitions: GameEvent[]
): GameEvent | null {
  if (!gameState.activeEventChains || gameState.activeEventChains.length === 0) {
    return null;
  }

  const currentRound = gameState.round;
  const chainsToRemove: number[] = [];
  let triggeredEvent: GameEvent | null = null;

  // Check each active chain
  for (let i = 0; i < gameState.activeEventChains.length; i++) {
    const chain = gameState.activeEventChains[i];

    // Check if it's time to trigger the next event
    if (chain.nextEventId && chain.nextEventDelay !== undefined) {
      const triggerRound = chain.startRound + chain.nextEventDelay;

      if (currentRound >= triggerRound) {
        // Find the next event
        const nextEvent = eventDefinitions.find((e) => e.id === chain.nextEventId);

        if (nextEvent) {
          gameLogger.log(`🔗 Triggering chained event: ${chain.nextEventId}`);
          triggeredEvent = nextEvent;
          chainsToRemove.push(i);
          break; // Only trigger one chained event per round
        } else {
          console.warn(`⚠️ Chained event not found: ${chain.nextEventId}`);
          chainsToRemove.push(i);
        }
      }
    }
  }

  // Remove completed chains
  for (let i = chainsToRemove.length - 1; i >= 0; i--) {
    gameState.activeEventChains.splice(chainsToRemove[i], 1);
  }

  return triggeredEvent;
}

/**
 * Check if an event requires player choice
 */
export function requiresPlayerChoice(event: GameEvent): boolean {
  return !!(event.playerChoice && event.playerChoice.length > 0);
}

/**
 * Apply player's choice to an event
 */
export function applyPlayerChoice(
  gameState: GameState,
  event: GameEvent,
  choiceIndex: number
): EventEffect[] {
  if (!event.playerChoice || choiceIndex >= event.playerChoice.length) {
    console.error(`❌ Invalid choice index: ${choiceIndex}`);
    return [];
  }

  const choice = event.playerChoice[choiceIndex];

  // Record the choice
  gameState.eventChoicesMade = gameState.eventChoicesMade || [];
  gameState.eventChoicesMade.push({
    eventId: event.id,
    choiceIndex,
    round: gameState.round,
    choiceText: choice.text,
  });

  // Deduct costs
  if (choice.cost) {
    if (choice.cost.money) {
      gameState.resources.money = Math.max(0, gameState.resources.money - choice.cost.money);
    }
    if (choice.cost.attention) {
      gameState.resources.attention = Math.max(0, gameState.resources.attention - choice.cost.attention);
    }
    if (choice.cost.infrastructure) {
      gameState.resources.infrastructure = Math.max(0, gameState.resources.infrastructure - choice.cost.infrastructure);
    }
  }

  gameLogger.log(`✅ Player chose: "${choice.text}"`);

  // Return effects to be applied
  return choice.effects;
}

/**
 * Check if player can afford a choice
 */
export function canAffordChoice(
  gameState: GameState,
  choice: EventChoice
): boolean {
  if (!choice.cost) return true;

  const resources = gameState.resources;

  if (choice.cost.money && resources.money < choice.cost.money) {
    return false;
  }
  if (choice.cost.attention && resources.attention < choice.cost.attention) {
    return false;
  }
  if (choice.cost.infrastructure && resources.infrastructure < choice.cost.infrastructure) {
    return false;
  }

  return true;
}

/**
 * Get statistics about player choices
 */
export function getChoiceStatistics(gameState: GameState): {
  totalChoices: number;
  choicesByEvent: Record<string, number>;
  recentChoices: Array<{ eventId: string; choiceText: string; round: number }>;
} {
  const choices = gameState.eventChoicesMade || [];

  const choicesByEvent: Record<string, number> = {};
  for (const choice of choices) {
    choicesByEvent[choice.eventId] = (choicesByEvent[choice.eventId] || 0) + 1;
  }

  const recentChoices = choices
    .slice(-5)
    .map((c) => ({
      eventId: c.eventId,
      choiceText: c.choiceText,
      round: c.round,
    }));

  return {
    totalChoices: choices.length,
    choicesByEvent,
    recentChoices,
  };
}

/**
 * Clean up expired event chains (safety measure)
 */
export function cleanupExpiredChains(gameState: GameState): void {
  if (!gameState.activeEventChains) return;

  const maxChainAge = 10; // Max rounds a chain can be active
  const currentRound = gameState.round;

  gameState.activeEventChains = gameState.activeEventChains.filter((chain) => {
    const age = currentRound - chain.startRound;
    if (age > maxChainAge) {
      gameLogger.log(`🧹 Cleaning up expired chain: ${chain.chainId}`);
      return false;
    }
    return true;
  });
}
