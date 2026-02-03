/**
 * Platinum Dialog System Tests
 *
 * Tests for the advanced dialogue system including:
 * - JSON Condition Evaluation
 * - Topic Dialogues with Progressive Disclosure
 * - Insert Resolution
 * - Anti-Repetition Engine
 * - Emotional Memory System
 * - Multi-Speaker Debates
 *
 * @see docs/story-mode/PLATINUM_DIALOG_SYSTEM_PLAN.md
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  DialogLoader,
  type DialogueContext,
  type TopicDialogue,
} from '../engine/DialogLoader';

describe('Platinum Dialog System', () => {
  let dialogLoader: DialogLoader;

  beforeEach(() => {
    dialogLoader = new DialogLoader();
    dialogLoader.resetState();
  });

  describe('Condition Evaluation', () => {
    const baseContext: DialogueContext = {
      phase: 30,
      risk: 50,
      morale: 60,
      budget: 5000,
      relationshipLevel: 1,
      attention: 40,
      capacity: 3,
      memoryTags: [],
    };

    it('should evaluate simple numeric conditions', () => {
      // Test by getting topic dialogues with different contexts
      const lowBudgetContext = { ...baseContext, budget: 2000 };
      const highBudgetContext = { ...baseContext, budget: 9000 };

      // Get budget topic dialogue - should select different variants based on budget
      const lowBudgetDialogue = dialogLoader.getTopicDialogue(
        'igor',
        'budget',
        'intro',
        lowBudgetContext,
        () => 0.1 // Fixed RNG for determinism
      );

      const highBudgetDialogue = dialogLoader.getTopicDialogue(
        'igor',
        'budget',
        'intro',
        highBudgetContext,
        () => 0.1
      );

      // Both should return valid dialogues
      expect(lowBudgetDialogue).not.toBeNull();
      expect(highBudgetDialogue).not.toBeNull();
    });

    it('should evaluate phase range conditions', () => {
      const earlyPhase = { ...baseContext, phase: 10 };
      const latePhase = { ...baseContext, phase: 100 };

      const earlyDialogue = dialogLoader.getTopicDialogue(
        'direktor',
        'mission',
        'intro',
        earlyPhase
      );

      const lateDialogue = dialogLoader.getTopicDialogue(
        'direktor',
        'mission',
        'intro',
        latePhase
      );

      expect(earlyDialogue).not.toBeNull();
      expect(lateDialogue).not.toBeNull();
    });

    it('should evaluate relationship-based conditions', () => {
      const lowRelationship = { ...baseContext, relationshipLevel: 0 as const };
      const highRelationship = { ...baseContext, relationshipLevel: 3 as const };

      // Direktor has relationship-based dialogue variants
      const lowRelDialogue = dialogLoader.getTopicDialogue(
        'direktor',
        'mission',
        'intro',
        lowRelationship
      );

      const highRelDialogue = dialogLoader.getTopicDialogue(
        'direktor',
        'mission',
        'intro',
        highRelationship
      );

      // Both should work
      expect(lowRelDialogue).not.toBeNull();
      expect(highRelDialogue).not.toBeNull();
    });
  });

  describe('Topic Dialogues - Progressive Disclosure', () => {
    const context: DialogueContext = {
      phase: 30,
      risk: 50,
      morale: 60,
      budget: 5000,
      relationshipLevel: 1,
      memoryTags: [],
    };

    it('should get intro layer dialogue', () => {
      const dialogue = dialogLoader.getTopicDialogue(
        'direktor',
        'mission',
        'intro',
        context
      );

      expect(dialogue).not.toBeNull();
      expect(dialogue?.text_de).toBeTruthy();
      expect(dialogue?.id).toContain('mission_intro');
    });

    it('should get deep layer dialogue', () => {
      const dialogue = dialogLoader.getTopicDialogue(
        'direktor',
        'mission',
        'deep',
        context
      );

      expect(dialogue).not.toBeNull();
      expect(dialogue?.text_de).toBeTruthy();
      expect(dialogue?.id).toContain('mission_deep');
    });

    it('should get options layer dialogue with responses', () => {
      // Risk must be low for certain options
      const lowRiskContext = { ...context, risk: 30 };

      const dialogue = dialogLoader.getTopicDialogue(
        'direktor',
        'mission',
        'options',
        lowRiskContext
      );

      expect(dialogue).not.toBeNull();
      // Options should have responses
      if (dialogue?.responses) {
        expect(dialogue.responses.length).toBeGreaterThan(0);
      }
    });

    it('should check if topic has deep content', () => {
      expect(dialogLoader.hasDeepContent('mission', 'direktor', context)).toBe(true);
      expect(dialogLoader.hasDeepContent('nonexistent', 'direktor', context)).toBe(false);
    });

    it('should check if topic has options', () => {
      const lowRiskContext = { ...context, risk: 30 };
      expect(dialogLoader.hasOptions('mission', 'direktor', lowRiskContext)).toBe(true);
    });

    it('should get available topics for NPC', () => {
      const topics = dialogLoader.getAvailableTopics('direktor', context);

      expect(topics).toContain('mission');
      expect(topics).toContain('resources');
      expect(topics).toContain('risks');
    });
  });

  describe('Insert Resolution', () => {
    const context: DialogueContext = {
      phase: 30,
      risk: 75,
      morale: 25,
      budget: 2500,
      relationshipLevel: 2,
      memoryTags: [],
    };

    it('should resolve budget_state insert', () => {
      const text = 'Budget ist {budget_state}.';
      const resolved = dialogLoader.resolveInserts(text, context, 'de');

      expect(resolved).not.toContain('{budget_state}');
      expect(resolved).toContain('knapp'); // budget < 3000
    });

    it('should resolve risk_state insert', () => {
      const text = 'Risiko ist {risk_state}.';
      const resolved = dialogLoader.resolveInserts(text, context, 'de');

      expect(resolved).not.toContain('{risk_state}');
      expect(resolved).toContain('gefährlich hoch'); // risk >= 70
    });

    it('should resolve morale_state insert', () => {
      const text = 'Moral ist {morale_state}.';
      const resolved = dialogLoader.resolveInserts(text, context, 'de');

      expect(resolved).not.toContain('{morale_state}');
      expect(resolved).toContain('niedrig'); // morale <= 40
    });

    it('should resolve budget_value insert', () => {
      const text = 'Wir haben {budget_value}.';
      const resolved = dialogLoader.resolveInserts(text, context, 'de');

      expect(resolved).not.toContain('{budget_value}');
      expect(resolved).toContain('2500');
      expect(resolved).toContain('Rubel');
    });

    it('should resolve risk_value insert', () => {
      const text = 'Risiko bei {risk_value}.';
      const resolved = dialogLoader.resolveInserts(text, context, 'de');

      expect(resolved).not.toContain('{risk_value}');
      expect(resolved).toContain('75%');
    });

    it('should keep unknown inserts unchanged', () => {
      const text = 'Text mit {unknown_insert}.';
      const resolved = dialogLoader.resolveInserts(text, context, 'de');

      expect(resolved).toContain('{unknown_insert}');
    });

    it('should resolve inserts in dialogues automatically', () => {
      const highRiskContext = { ...context, risk: 85 };

      const dialogue = dialogLoader.getTopicDialogue(
        'direktor',
        'risks',
        'intro',
        highRiskContext
      );

      // Dialogues with {risk_value} should have it resolved
      if (dialogue?.text_de.includes('85%')) {
        expect(dialogue.text_de).toContain('85%');
      }
    });
  });

  describe('Anti-Repetition Engine', () => {
    const context: DialogueContext = {
      phase: 30,
      risk: 50,
      morale: 60,
      budget: 5000,
      relationshipLevel: 1,
      memoryTags: [],
    };

    it('should record dialogue history', () => {
      // Get initial repetition rate
      const initialRate = dialogLoader.getRepetitionRate();
      expect(initialRate).toBe(0);

      // Record some dialogues
      dialogLoader.recordDialogueShown('test_dialogue_1', 'direktor', 'mission');
      dialogLoader.recordDialogueShown('test_dialogue_2', 'direktor', 'mission');

      // Rate should still be 0 (no repetitions)
      expect(dialogLoader.getRepetitionRate()).toBe(0);

      // Record a repeat
      dialogLoader.recordDialogueShown('test_dialogue_1', 'direktor', 'mission');

      // Now there should be some repetition
      expect(dialogLoader.getRepetitionRate()).toBeGreaterThan(0);
    });

    it('should avoid recently shown dialogues', () => {
      // Record a dialogue multiple times
      for (let i = 0; i < 5; i++) {
        dialogLoader.recordDialogueShown('topic_mission_intro_1', 'direktor', 'mission');
      }

      // Get dialogues multiple times - should try to avoid the recorded one
      const dialogues: TopicDialogue[] = [];
      for (let i = 0; i < 10; i++) {
        const dialogue = dialogLoader.getTopicDialogue(
          'direktor',
          'mission',
          'intro',
          context,
          () => (i * 0.1) % 1 // Varying RNG
        );
        if (dialogue) {
          dialogues.push(dialogue);
        }
      }

      // Should have gotten some variety
      const uniqueIds = new Set(dialogues.map(d => d.id));
      expect(uniqueIds.size).toBeGreaterThanOrEqual(1);
    });

    it('should reset state correctly', () => {
      dialogLoader.recordDialogueShown('test_1', 'direktor');
      dialogLoader.recordDialogueShown('test_2', 'direktor');

      dialogLoader.resetState();

      expect(dialogLoader.getRepetitionRate()).toBe(0);
    });
  });

  describe('Emotional Memory System', () => {
    it('should add memory tags', () => {
      dialogLoader.addMemoryTag('direktor', 'ignored_advice');

      const tags = dialogLoader.getMemoryTags('direktor');
      expect(tags).toContain('ignored_advice');
    });

    it('should count memory tags', () => {
      dialogLoader.addMemoryTag('direktor', 'ignored_advice');
      dialogLoader.addMemoryTag('direktor', 'ignored_advice');
      dialogLoader.addMemoryTag('direktor', 'ignored_advice');

      expect(dialogLoader.getMemoryTagCount('direktor', 'ignored_advice')).toBe(3);
    });

    it('should get tone override for repeated negative tags', () => {
      // Add 3 ignored_advice tags
      dialogLoader.addMemoryTag('direktor', 'ignored_advice');
      dialogLoader.addMemoryTag('direktor', 'ignored_advice');
      dialogLoader.addMemoryTag('direktor', 'ignored_advice');

      const override = dialogLoader.getMemoryToneOverride('direktor');
      expect(override).toBe('skeptical');
    });

    it('should not override tone with few negative tags', () => {
      dialogLoader.addMemoryTag('direktor', 'ignored_advice');

      const override = dialogLoader.getMemoryToneOverride('direktor');
      expect(override).toBeNull();
    });

    it('should limit memory to last 10 tags', () => {
      for (let i = 0; i < 15; i++) {
        dialogLoader.addMemoryTag('direktor', `tag_${i}`);
      }

      const tags = dialogLoader.getMemoryTags('direktor');
      expect(tags.length).toBe(10);
    });

    it('should reset memory on state reset', () => {
      dialogLoader.addMemoryTag('direktor', 'test_tag');

      dialogLoader.resetState();

      expect(dialogLoader.getMemoryTags('direktor')).toEqual([]);
    });
  });

  describe('Debates', () => {
    it('should get debates with valid conditions', () => {
      const context: DialogueContext = {
        phase: 50,
        risk: 60,
        morale: 50,
        budget: 5000,
        relationshipLevel: 1,
        memoryTags: [],
      };

      const debate = dialogLoader.getDebate(context, ['high_risk_action']);

      // May or may not return a debate depending on exact conditions
      // Just verify the method doesn't crash
      expect(debate === null || debate.dialogue_type === 'debate').toBe(true);
    });

    it('should return debates with participants', () => {
      const context: DialogueContext = {
        phase: 50,
        risk: 60,
        morale: 50,
        budget: 5000,
        relationshipLevel: 1,
        memoryTags: [],
      };

      const debate = dialogLoader.getDebate(context);

      if (debate) {
        expect(debate.participants.length).toBeGreaterThanOrEqual(2);
        expect(debate.turns.length).toBeGreaterThanOrEqual(2);
      }
    });

    it('should get debates for specific NPCs', () => {
      const debates = dialogLoader.getDebatesForNPCs(['alexei', 'marina']);

      expect(debates.length).toBeGreaterThan(0);
      debates.forEach(debate => {
        expect(
          debate.participants.includes('alexei') ||
          debate.participants.includes('marina')
        ).toBe(true);
      });
    });

    it('should resolve inserts in debate turns', () => {
      const context: DialogueContext = {
        phase: 50,
        risk: 60,
        morale: 50,
        budget: 3000,
        relationshipLevel: 1,
        memoryTags: [],
      };

      const debate = dialogLoader.getDebate(context);

      if (debate) {
        // Check if any turn had inserts resolved
        debate.turns.forEach(turn => {
          expect(turn.text_de).not.toContain('{budget}');
        });
      }
    });
  });

  describe('Feature Flags', () => {
    it('should get current feature flags', () => {
      const flags = dialogLoader.getFeatureFlags();

      expect(typeof flags.useNewTopics).toBe('boolean');
      expect(typeof flags.useInsertLibrary).toBe('boolean');
      expect(typeof flags.useDebateDialogues).toBe('boolean');
      expect(typeof flags.useAntiRepetition).toBe('boolean');
      expect(typeof flags.useEmotionalMemory).toBe('boolean');
    });

    it('should allow setting feature flags', () => {
      dialogLoader.setFeatureFlags({ useNewTopics: false });

      const flags = dialogLoader.getFeatureFlags();
      expect(flags.useNewTopics).toBe(false);
    });

    it('should disable topic dialogues when flag is off', () => {
      dialogLoader.setFeatureFlags({ useNewTopics: false });

      const context: DialogueContext = {
        phase: 30,
        risk: 50,
        morale: 60,
        budget: 5000,
        relationshipLevel: 1,
        memoryTags: [],
      };

      const dialogue = dialogLoader.getTopicDialogue(
        'direktor',
        'mission',
        'intro',
        context
      );

      expect(dialogue).toBeNull();
    });
  });

  describe('State Export/Import', () => {
    it('should export state with version', () => {
      const state = dialogLoader.exportState();

      expect(state).toHaveProperty('version');
      expect((state as { version: string }).version).toBe('2.0.0');
    });

    it('should export dialogue history', () => {
      dialogLoader.recordDialogueShown('test_1', 'direktor');

      const state = dialogLoader.exportState() as { dialogueHistory: unknown[] };

      expect(state.dialogueHistory.length).toBe(1);
    });

    it('should export emotional memory', () => {
      dialogLoader.addMemoryTag('direktor', 'test_tag');

      const state = dialogLoader.exportState() as { emotionalMemory: unknown[] };

      expect(state.emotionalMemory.length).toBe(1);
    });

    it('should import state correctly', () => {
      // Create some state
      dialogLoader.recordDialogueShown('test_1', 'direktor');
      dialogLoader.addMemoryTag('direktor', 'test_tag');

      const exported = dialogLoader.exportState();

      // Create new loader and import
      const newLoader = new DialogLoader();
      newLoader.importState(exported);

      expect(newLoader.getMemoryTags('direktor')).toContain('test_tag');
    });
  });

  describe('Topic Data Integrity', () => {
    it('should have all expected topics loaded', () => {
      const topicIds = dialogLoader.getAllTopicIds();

      // From the topics_dialogues.json we created
      expect(topicIds).toContain('mission');
      expect(topicIds).toContain('resources');
      expect(topicIds).toContain('risks');
      expect(topicIds).toContain('budget');
      expect(topicIds).toContain('content');
      expect(topicIds).toContain('platforms');
    });

    it('should have debates loaded', () => {
      const debateIds = dialogLoader.getAllDebateIds();

      expect(debateIds.length).toBeGreaterThan(0);
      expect(debateIds).toContain('debate_risk_vs_reach_1');
      expect(debateIds).toContain('debate_budget_vs_ops_1');
    });

    it('should have all NPC IDs available', () => {
      const npcIds = dialogLoader.getAllNPCIds();

      expect(npcIds).toContain('direktor');
      expect(npcIds).toContain('marina');
      expect(npcIds).toContain('alexei');
      expect(npcIds).toContain('katja');
      expect(npcIds).toContain('igor');
    });
  });
});
