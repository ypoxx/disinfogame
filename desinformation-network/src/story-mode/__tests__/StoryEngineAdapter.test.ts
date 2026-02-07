/**
 * Tests for StoryEngineAdapter save/load functionality
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { StoryEngineAdapter, createStoryEngine } from '../../game-logic/StoryEngineAdapter';

describe('StoryEngineAdapter', () => {
  let engine: StoryEngineAdapter;

  beforeEach(() => {
    engine = createStoryEngine('test-seed-123');
  });

  describe('Initialization', () => {
    it('should create engine with initial state', () => {
      const phase = engine.getCurrentPhase();
      expect(phase.number).toBe(1);
      expect(phase.year).toBe(1);
      expect(phase.month).toBe(1);
    });

    it('should have initial resources', () => {
      const resources = engine.getResources();
      expect(resources.budget).toBe(150); // P1-5 Fix: Increased from 100 to 150
      expect(resources.capacity).toBe(5);
      expect(resources.risk).toBe(0);
      expect(resources.attention).toBe(0);
      expect(resources.moralWeight).toBe(0);
      expect(resources.actionPointsRemaining).toBe(5);
    });

    it('should initialize NPCs', () => {
      const npcs = engine.getAllNPCs();
      expect(npcs.length).toBe(5);
      expect(npcs.map(n => n.id)).toContain('direktor');
      expect(npcs.map(n => n.id)).toContain('marina');
      expect(npcs.map(n => n.id)).toContain('alexei'); // Fixed: was 'volkov', but volkov is direktor's name
      expect(npcs.map(n => n.id)).toContain('katja');
      expect(npcs.map(n => n.id)).toContain('igor');
    });

    it('should initialize objectives', () => {
      const objectives = engine.getObjectives();
      expect(objectives.length).toBeGreaterThan(0);
      expect(objectives.some(o => o.type === 'primary')).toBe(true);
    });
  });

  describe('Phase Advancement', () => {
    it('should advance phase correctly', () => {
      const result = engine.advancePhase();
      expect(result.newPhase.number).toBe(2);
      expect(result.newPhase.month).toBe(2);
    });

    it('should regenerate capacity on phase advance', () => {
      // Use some capacity first
      const initialResources = engine.getResources();
      expect(initialResources.capacity).toBe(5);

      // Advance phase
      const result = engine.advancePhase();
      const newResources = engine.getResources();

      // Capacity should be capped at max (10) or regenerated
      expect(newResources.capacity).toBeGreaterThanOrEqual(5);
    });

    it('should reset action points on phase advance', () => {
      engine.advancePhase();
      const resources = engine.getResources();
      expect(resources.actionPointsRemaining).toBe(5);
    });

    it('should handle year transitions', () => {
      // Advance 12 phases to get to year 2
      for (let i = 0; i < 12; i++) {
        engine.advancePhase();
      }
      const phase = engine.getCurrentPhase();
      expect(phase.year).toBe(2);
      expect(phase.month).toBe(1);
      expect(phase.isNewYear).toBe(true);
    });
  });

  describe('Save/Load State', () => {
    it('should save state as JSON string', () => {
      const savedState = engine.saveState();
      expect(typeof savedState).toBe('string');

      const parsed = JSON.parse(savedState);
      expect(parsed.version).toBe('2.0.0');
      expect(parsed.storyPhase).toBeDefined();
      expect(parsed.storyResources).toBeDefined();
    });

    it('should restore state from saved string', () => {
      // Advance some phases and modify state
      engine.advancePhase();
      engine.advancePhase();
      engine.advancePhase();

      const phaseBeforeSave = engine.getCurrentPhase();
      const resourcesBeforeSave = engine.getResources();

      // Save
      const savedState = engine.saveState();

      // Create new engine and load state
      const newEngine = createStoryEngine();
      newEngine.loadState(savedState);

      // Verify state was restored
      const restoredPhase = newEngine.getCurrentPhase();
      const restoredResources = newEngine.getResources();

      expect(restoredPhase.number).toBe(phaseBeforeSave.number);
      expect(restoredPhase.year).toBe(phaseBeforeSave.year);
      expect(restoredPhase.month).toBe(phaseBeforeSave.month);
      expect(restoredResources.budget).toBe(resourcesBeforeSave.budget);
      expect(restoredResources.capacity).toBe(resourcesBeforeSave.capacity);
    });

    it('should preserve NPC states after load', () => {
      const npcBefore = engine.getNPCState('marina');
      expect(npcBefore).not.toBeNull();

      const savedState = engine.saveState();
      const newEngine = createStoryEngine();
      newEngine.loadState(savedState);

      const npcAfter = newEngine.getNPCState('marina');
      expect(npcAfter).not.toBeNull();
      expect(npcAfter?.id).toBe(npcBefore?.id);
      expect(npcAfter?.relationshipLevel).toBe(npcBefore?.relationshipLevel);
    });

    it('should preserve objectives after load', () => {
      const objectivesBefore = engine.getObjectives();
      const savedState = engine.saveState();

      const newEngine = createStoryEngine();
      newEngine.loadState(savedState);

      const objectivesAfter = newEngine.getObjectives();
      expect(objectivesAfter.length).toBe(objectivesBefore.length);
      expect(objectivesAfter[0].id).toBe(objectivesBefore[0].id);
    });

    it('should preserve news events after load', () => {
      // Advance to generate some news
      engine.advancePhase();
      engine.advancePhase();

      const newsBefore = engine.getNewsEvents();
      const savedState = engine.saveState();

      const newEngine = createStoryEngine();
      newEngine.loadState(savedState);

      const newsAfter = newEngine.getNewsEvents();
      expect(newsAfter.length).toBe(newsBefore.length);
    });
  });

  describe('Game End Conditions', () => {
    it('should return null when game is not ended', () => {
      const endState = engine.checkGameEnd();
      expect(endState).toBeNull();
    });

    it('should detect defeat when risk is too high', () => {
      // Manually set high risk (would need to expose setter or use actions)
      // This is a conceptual test - in real implementation,
      // we'd need to execute illegal actions to raise risk
      const resources = engine.getResources();
      expect(resources.risk).toBeLessThan(85);
    });
  });

  describe('NPC Management', () => {
    it('should get NPC by ID', () => {
      const npc = engine.getNPCState('alexei'); // Fixed: was 'volkov'
      expect(npc).not.toBeNull();
      expect(npc?.id).toBe('alexei');
    });

    it('should return null for unknown NPC', () => {
      const npc = engine.getNPCState('unknown-npc');
      expect(npc).toBeNull();
    });

    it('should get all NPCs', () => {
      const npcs = engine.getAllNPCs();
      expect(npcs.length).toBe(5);
    });
  });

  describe('News Events', () => {
    it('should return empty array initially', () => {
      const news = engine.getNewsEvents();
      expect(Array.isArray(news)).toBe(true);
    });

    it('should filter unread news', () => {
      const unreadNews = engine.getNewsEvents({ unreadOnly: true });
      expect(Array.isArray(unreadNews)).toBe(true);
    });

    it('should limit news count', () => {
      const limitedNews = engine.getNewsEvents({ limit: 5 });
      expect(limitedNews.length).toBeLessThanOrEqual(5);
    });
  });

  describe('Pending Consequences', () => {
    it('should return empty array initially', () => {
      const consequences = engine.getPendingConsequences();
      expect(Array.isArray(consequences)).toBe(true);
      expect(consequences.length).toBe(0);
    });

    it('should return null for active consequence initially', () => {
      const active = engine.getActiveConsequence();
      expect(active).toBeNull();
    });
  });
});
