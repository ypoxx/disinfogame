/**
 * Tests for Event Chain System
 *
 * Tests event chains, player choices, affordability checks, and cleanup
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  startEventChain,
  processEventChains,
  requiresPlayerChoice,
  applyPlayerChoice,
  canAffordChoice,
  getChoiceStatistics,
  cleanupExpiredChains,
} from '../event-chain-system';
import type { GameState, GameEvent, EventChoice } from '../types';

// ============================================
// TEST FIXTURES
// ============================================

function createMockGameState(overrides: Partial<GameState> = {}): GameState {
  return {
    phase: 'playing',
    round: 1,
    resources: {
      money: 100,
      attention: 20,
      infrastructure: 10,
    },
    detectionRisk: 0,
    network: {
      actors: [],
      connections: [],
    },
    history: [],
    statistics: {
      totalTrustReduced: 0,
      actorsCorrupted: 0,
      actionsUsed: 0,
      peakDetectionRisk: 0,
    },
    activeEventChains: [],
    eventChoicesMade: [],
    ...overrides,
  } as GameState;
}

function createMockEvent(overrides: Partial<GameEvent> = {}): GameEvent {
  return {
    id: 'test_event_1',
    name: 'Test Event',
    description: 'A test event',
    category: 'political',
    severity: 'medium',
    round: 1,
    duration: 1,
    effects: [{ type: 'resource', target: 'money', value: -10 }],
    ...overrides,
  } as GameEvent;
}

function createMockChoice(overrides: Partial<EventChoice> = {}): EventChoice {
  return {
    text: 'Test choice',
    effects: [{ type: 'resource', target: 'money', value: 10 }],
    ...overrides,
  } as EventChoice;
}

// ============================================
// TESTS
// ============================================

describe('Event Chain System', () => {
  describe('startEventChain', () => {
    it('should start a chain when event has chainTo', () => {
      const gameState = createMockGameState();
      const event = createMockEvent({ chainTo: 'next_event' });

      startEventChain(gameState, event);

      expect(gameState.activeEventChains).toHaveLength(1);
      expect(gameState.activeEventChains![0].chainId).toBe('test_event_1');
      expect(gameState.activeEventChains![0].nextEventId).toBe('next_event');
    });

    it('should not start a chain when event has no chainTo', () => {
      const gameState = createMockGameState();
      const event = createMockEvent({ chainTo: undefined });

      startEventChain(gameState, event);

      expect(gameState.activeEventChains).toHaveLength(0);
    });

    it('should set delay of 3 for events with player choice', () => {
      const gameState = createMockGameState();
      const event = createMockEvent({
        chainTo: 'next_event',
        playerChoice: [createMockChoice()],
      });

      startEventChain(gameState, event);

      expect(gameState.activeEventChains![0].nextEventDelay).toBe(3);
    });

    it('should set delay of 2 for events without player choice', () => {
      const gameState = createMockGameState();
      const event = createMockEvent({ chainTo: 'next_event' });

      startEventChain(gameState, event);

      expect(gameState.activeEventChains![0].nextEventDelay).toBe(2);
    });
  });

  describe('processEventChains', () => {
    it('should trigger next event when delay has passed', () => {
      const gameState = createMockGameState({ round: 3 });
      gameState.activeEventChains = [
        {
          chainId: 'chain_1',
          startRound: 1,
          nextEventId: 'follow_up_event',
          nextEventDelay: 2,
        },
      ];

      const eventDefinitions = [
        createMockEvent({ id: 'follow_up_event', name: 'Follow Up' }),
      ];

      const triggeredEvent = processEventChains(gameState, eventDefinitions);

      expect(triggeredEvent).not.toBeNull();
      expect(triggeredEvent?.id).toBe('follow_up_event');
    });

    it('should not trigger event before delay has passed', () => {
      const gameState = createMockGameState({ round: 2 });
      gameState.activeEventChains = [
        {
          chainId: 'chain_1',
          startRound: 1,
          nextEventId: 'follow_up_event',
          nextEventDelay: 3,
        },
      ];

      const eventDefinitions = [
        createMockEvent({ id: 'follow_up_event' }),
      ];

      const triggeredEvent = processEventChains(gameState, eventDefinitions);

      expect(triggeredEvent).toBeNull();
    });

    it('should remove chain after triggering event', () => {
      const gameState = createMockGameState({ round: 5 });
      gameState.activeEventChains = [
        {
          chainId: 'chain_1',
          startRound: 1,
          nextEventId: 'follow_up_event',
          nextEventDelay: 2,
        },
      ];

      const eventDefinitions = [
        createMockEvent({ id: 'follow_up_event' }),
      ];

      processEventChains(gameState, eventDefinitions);

      expect(gameState.activeEventChains).toHaveLength(0);
    });

    it('should return null when no active chains', () => {
      const gameState = createMockGameState();
      gameState.activeEventChains = [];

      const result = processEventChains(gameState, []);

      expect(result).toBeNull();
    });

    it('should only trigger one event per round', () => {
      const gameState = createMockGameState({ round: 5 });
      gameState.activeEventChains = [
        {
          chainId: 'chain_1',
          startRound: 1,
          nextEventId: 'event_a',
          nextEventDelay: 2,
        },
        {
          chainId: 'chain_2',
          startRound: 1,
          nextEventId: 'event_b',
          nextEventDelay: 2,
        },
      ];

      const eventDefinitions = [
        createMockEvent({ id: 'event_a' }),
        createMockEvent({ id: 'event_b' }),
      ];

      const triggeredEvent = processEventChains(gameState, eventDefinitions);

      expect(triggeredEvent).not.toBeNull();
      expect(gameState.activeEventChains).toHaveLength(1);
    });
  });

  describe('requiresPlayerChoice', () => {
    it('should return true when event has player choices', () => {
      const event = createMockEvent({
        playerChoice: [createMockChoice()],
      });

      expect(requiresPlayerChoice(event)).toBe(true);
    });

    it('should return false when event has no player choices', () => {
      const event = createMockEvent({ playerChoice: undefined });

      expect(requiresPlayerChoice(event)).toBe(false);
    });

    it('should return false when player choices array is empty', () => {
      const event = createMockEvent({ playerChoice: [] });

      expect(requiresPlayerChoice(event)).toBe(false);
    });
  });

  describe('applyPlayerChoice', () => {
    it('should record the choice in game state', () => {
      const gameState = createMockGameState();
      const event = createMockEvent({
        playerChoice: [createMockChoice({ text: 'Option A' })],
      });

      applyPlayerChoice(gameState, event, 0);

      expect(gameState.eventChoicesMade).toHaveLength(1);
      expect(gameState.eventChoicesMade![0].eventId).toBe('test_event_1');
      expect(gameState.eventChoicesMade![0].choiceText).toBe('Option A');
    });

    it('should deduct money cost', () => {
      const gameState = createMockGameState({ resources: { money: 100, attention: 0, infrastructure: 0 } });
      const event = createMockEvent({
        playerChoice: [createMockChoice({ cost: { money: 30 } })],
      });

      applyPlayerChoice(gameState, event, 0);

      expect(gameState.resources.money).toBe(70);
    });

    it('should deduct attention cost', () => {
      const gameState = createMockGameState({ resources: { money: 100, attention: 50, infrastructure: 0 } });
      const event = createMockEvent({
        playerChoice: [createMockChoice({ cost: { attention: 20 } })],
      });

      applyPlayerChoice(gameState, event, 0);

      expect(gameState.resources.attention).toBe(30);
    });

    it('should deduct infrastructure cost', () => {
      const gameState = createMockGameState({ resources: { money: 100, attention: 0, infrastructure: 30 } });
      const event = createMockEvent({
        playerChoice: [createMockChoice({ cost: { infrastructure: 10 } })],
      });

      applyPlayerChoice(gameState, event, 0);

      expect(gameState.resources.infrastructure).toBe(20);
    });

    it('should not go below zero for resources', () => {
      const gameState = createMockGameState({ resources: { money: 10, attention: 5, infrastructure: 0 } });
      const event = createMockEvent({
        playerChoice: [createMockChoice({ cost: { money: 50 } })],
      });

      applyPlayerChoice(gameState, event, 0);

      expect(gameState.resources.money).toBe(0);
    });

    it('should return choice effects', () => {
      const gameState = createMockGameState();
      const effects = [{ type: 'resource', target: 'money', value: 50 }];
      const event = createMockEvent({
        playerChoice: [createMockChoice({ effects: effects as any })],
      });

      const result = applyPlayerChoice(gameState, event, 0);

      expect(result).toEqual(effects);
    });

    it('should return empty array for invalid choice index', () => {
      const gameState = createMockGameState();
      const event = createMockEvent({
        playerChoice: [createMockChoice()],
      });

      const result = applyPlayerChoice(gameState, event, 99);

      expect(result).toEqual([]);
    });
  });

  describe('canAffordChoice', () => {
    it('should return true when no cost', () => {
      const gameState = createMockGameState();
      const choice = createMockChoice({ cost: undefined });

      expect(canAffordChoice(gameState, choice)).toBe(true);
    });

    it('should return true when player has enough money', () => {
      const gameState = createMockGameState({ resources: { money: 100, attention: 0, infrastructure: 0 } });
      const choice = createMockChoice({ cost: { money: 50 } });

      expect(canAffordChoice(gameState, choice)).toBe(true);
    });

    it('should return false when player has insufficient money', () => {
      const gameState = createMockGameState({ resources: { money: 30, attention: 0, infrastructure: 0 } });
      const choice = createMockChoice({ cost: { money: 50 } });

      expect(canAffordChoice(gameState, choice)).toBe(false);
    });

    it('should check all resource types', () => {
      const gameState = createMockGameState({
        resources: { money: 100, attention: 10, infrastructure: 5 },
      });
      const choice = createMockChoice({
        cost: { money: 50, attention: 20 },
      });

      // Has money but not enough attention
      expect(canAffordChoice(gameState, choice)).toBe(false);
    });

    it('should work with partial game state (just resources)', () => {
      const partialState = { resources: { money: 100, attention: 0, infrastructure: 0 } };
      const choice = createMockChoice({ cost: { money: 50 } });

      expect(canAffordChoice(partialState, choice)).toBe(true);
    });
  });

  describe('getChoiceStatistics', () => {
    it('should return zero for empty choices', () => {
      const gameState = createMockGameState();

      const stats = getChoiceStatistics(gameState);

      expect(stats.totalChoices).toBe(0);
      expect(Object.keys(stats.choicesByEvent)).toHaveLength(0);
      expect(stats.recentChoices).toHaveLength(0);
    });

    it('should count total choices', () => {
      const gameState = createMockGameState();
      gameState.eventChoicesMade = [
        { eventId: 'e1', choiceIndex: 0, round: 1, choiceText: 'A' },
        { eventId: 'e2', choiceIndex: 0, round: 2, choiceText: 'B' },
        { eventId: 'e3', choiceIndex: 0, round: 3, choiceText: 'C' },
      ];

      const stats = getChoiceStatistics(gameState);

      expect(stats.totalChoices).toBe(3);
    });

    it('should group choices by event', () => {
      const gameState = createMockGameState();
      gameState.eventChoicesMade = [
        { eventId: 'e1', choiceIndex: 0, round: 1, choiceText: 'A' },
        { eventId: 'e1', choiceIndex: 1, round: 2, choiceText: 'B' },
        { eventId: 'e2', choiceIndex: 0, round: 3, choiceText: 'C' },
      ];

      const stats = getChoiceStatistics(gameState);

      expect(stats.choicesByEvent['e1']).toBe(2);
      expect(stats.choicesByEvent['e2']).toBe(1);
    });

    it('should return last 5 recent choices', () => {
      const gameState = createMockGameState();
      gameState.eventChoicesMade = [
        { eventId: 'e1', choiceIndex: 0, round: 1, choiceText: 'A' },
        { eventId: 'e2', choiceIndex: 0, round: 2, choiceText: 'B' },
        { eventId: 'e3', choiceIndex: 0, round: 3, choiceText: 'C' },
        { eventId: 'e4', choiceIndex: 0, round: 4, choiceText: 'D' },
        { eventId: 'e5', choiceIndex: 0, round: 5, choiceText: 'E' },
        { eventId: 'e6', choiceIndex: 0, round: 6, choiceText: 'F' },
        { eventId: 'e7', choiceIndex: 0, round: 7, choiceText: 'G' },
      ];

      const stats = getChoiceStatistics(gameState);

      expect(stats.recentChoices).toHaveLength(5);
      expect(stats.recentChoices[0].eventId).toBe('e3'); // First of last 5
      expect(stats.recentChoices[4].eventId).toBe('e7'); // Last of last 5
    });
  });

  describe('cleanupExpiredChains', () => {
    it('should remove chains older than 10 rounds', () => {
      const gameState = createMockGameState({ round: 15 });
      gameState.activeEventChains = [
        { chainId: 'old_chain', startRound: 1, nextEventId: 'x', nextEventDelay: 20 },
        { chainId: 'new_chain', startRound: 10, nextEventId: 'y', nextEventDelay: 10 },
      ];

      cleanupExpiredChains(gameState);

      expect(gameState.activeEventChains).toHaveLength(1);
      expect(gameState.activeEventChains![0].chainId).toBe('new_chain');
    });

    it('should keep chains within 10 rounds', () => {
      const gameState = createMockGameState({ round: 8 });
      gameState.activeEventChains = [
        { chainId: 'chain_1', startRound: 1, nextEventId: 'x', nextEventDelay: 10 },
        { chainId: 'chain_2', startRound: 5, nextEventId: 'y', nextEventDelay: 10 },
      ];

      cleanupExpiredChains(gameState);

      expect(gameState.activeEventChains).toHaveLength(2);
    });

    it('should handle undefined activeEventChains', () => {
      const gameState = createMockGameState();
      gameState.activeEventChains = undefined as any;

      // Should not throw
      expect(() => cleanupExpiredChains(gameState)).not.toThrow();
    });
  });
});
