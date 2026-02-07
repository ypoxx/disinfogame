/**
 * GameEventBus — Lightweight event system (Phase 2.3)
 *
 * Provides observable hooks into the game engine pipeline.
 * Initially used for logging/observability, later for decoupling subsystems.
 *
 * NOT event-sourcing — just pub/sub for game lifecycle events.
 */

import type { ActionResult, StoryPhase, StoryResources } from './StoryEngineAdapter';

// ============================================
// Event Types
// ============================================

export type GameEvent =
  | { type: 'ACTION_EXECUTED'; actionId: string; result: ActionResult; phase: number }
  | { type: 'PHASE_ADVANCED'; from: number; to: number; resources: StoryResources }
  | { type: 'CONSEQUENCE_TRIGGERED'; consequenceId: string; phase: number; severity: string }
  | { type: 'CONSEQUENCE_RESOLVED'; consequenceId: string; choiceId: string; phase: number }
  | { type: 'NPC_BETRAYAL'; npcId: string; warningLevel: number; phase: number }
  | { type: 'NPC_CRISIS'; npcId: string; morale: number; phase: number }
  | { type: 'NPC_RECOVERY'; npcId: string; phase: number }
  | { type: 'COMBO_COMPLETED'; comboId: string; comboName: string; phase: number }
  | { type: 'GAME_END'; endType: string; phase: number }
  | { type: 'AI_DEFENDER_SPAWNED'; defenderId: string; phase: number }
  | { type: 'WORLD_EVENT'; eventId: string; phase: number };

export type GameEventType = GameEvent['type'];

type EventHandler = (event: GameEvent) => void;

// ============================================
// EventBus Class
// ============================================

export class GameEventBus {
  private listeners = new Map<string, Set<EventHandler>>();
  private globalListeners = new Set<EventHandler>();
  private eventLog: GameEvent[] = [];
  private maxLogSize = 500;

  /**
   * Subscribe to a specific event type.
   * Returns unsubscribe function.
   */
  on(type: GameEventType, handler: EventHandler): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(handler);

    return () => {
      this.listeners.get(type)?.delete(handler);
    };
  }

  /**
   * Subscribe to ALL events (for logging/debugging).
   * Returns unsubscribe function.
   */
  onAll(handler: EventHandler): () => void {
    this.globalListeners.add(handler);
    return () => {
      this.globalListeners.delete(handler);
    };
  }

  /**
   * Emit an event to all matching listeners.
   */
  emit(event: GameEvent): void {
    // Log event
    this.eventLog.push(event);
    if (this.eventLog.length > this.maxLogSize) {
      this.eventLog.shift();
    }

    // Notify type-specific listeners
    const handlers = this.listeners.get(event.type);
    if (handlers) {
      for (const handler of handlers) {
        handler(event);
      }
    }

    // Notify global listeners
    for (const handler of this.globalListeners) {
      handler(event);
    }
  }

  /**
   * Get the event log (for debugging/testing).
   */
  getLog(): readonly GameEvent[] {
    return this.eventLog;
  }

  /**
   * Get events of a specific type from the log.
   */
  getLogByType<T extends GameEventType>(type: T): GameEvent[] {
    return this.eventLog.filter(e => e.type === type);
  }

  /**
   * Clear all listeners and log.
   */
  reset(): void {
    this.listeners.clear();
    this.globalListeners.clear();
    this.eventLog = [];
  }
}
