/**
 * DialogManager — Extracted from StoryEngineAdapter (Strangler Fig)
 *
 * Consolidates ALL dialogue-related logic:
 *
 * 1. Legacy Dialogue Methods (greeting, briefing, reaction, crisis, first meeting, game end)
 * 2. Platinum Dialog System (topics, progressive disclosure, debates, memory, metrics)
 * 3. Dialogue Response Processing (relationship/morale changes, action coupling)
 * 4. Context Building (game state → DialogueContext)
 *
 * Follows Strangler Fig pattern: StoryEngineAdapter delegates to this class.
 */

import type {
  StoryPhase,
  StoryResources,
  NPCState,
  Objective,
} from './StoryEngineAdapter';

import {
  DialogLoader,
  dialogLoader,
  type Dialogue,
  type DialogueResponse,
  type TopicDialogue,
  type TopicLayer,
  type DialogueContext,
  type Debate,
} from '../story-mode/engine/DialogLoader';

import { storyLogger } from '../utils/logger';

// ============================================
// Dependency Interface (Constructor Injection)
// ============================================

export interface DialogManagerDeps {
  // State access
  getPhase(): StoryPhase;
  getResources(): StoryResources;
  getNPCStates(): Map<string, NPCState>;
  getObjectives(): Objective[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getNPCDialogues(): Map<string, any>;

  // Utilities
  seededRandom(input: string): number;
}

// ============================================
// DialogManager Class
// ============================================

export class DialogManager {
  private dialogLoaderInstance: DialogLoader;

  constructor(private deps: DialogManagerDeps) {
    this.dialogLoaderInstance = new DialogLoader();
  }

  // ============================================
  // PLATINUM DIALOG SYSTEM — Public Methods
  // ============================================

  /**
   * Get NPC dialogue based on context (unified entry point)
   * Supports greeting, reaction, and topic types with progressive disclosure
   */
  getNPCDialogue(npcId: string, context: {
    type: 'greeting' | 'reaction' | 'topic';
    subtype?: string;
    relationshipLevel?: number;
    layer?: TopicLayer;
  }): string | null {
    const npc = this.deps.getNPCStates().get(npcId);
    if (!npc) return null;

    const phase = this.deps.getPhase();
    const rng = () => this.deps.seededRandom(`dialog_${npcId}_${context.type}_${phase.number}`);

    switch (context.type) {
      case 'greeting': {
        const level = context.relationshipLevel ?? npc.relationshipLevel;
        const dialogue = dialogLoader.getGreeting(npcId, level, rng);
        if (dialogue) return dialogue.text_de;
        const simpleDialogues = this.deps.getNPCDialogues().get(npcId);
        if (simpleDialogues?.greetings) {
          return simpleDialogues.greetings[level.toString()] || simpleDialogues.greetings['0'] || null;
        }
        return null;
      }
      case 'reaction': {
        const actionTags = context.subtype ? [context.subtype] : [];
        const resources = this.deps.getResources();
        const conditions = {
          risk: resources.risk,
          morale: npc.morale,
          moral_weight: resources.moralWeight,
        };
        const dialogue = dialogLoader.getReaction(npcId, actionTags, conditions, rng);
        if (dialogue) return dialogue.text_de;
        const simpleDialogues = this.deps.getNPCDialogues().get(npcId);
        return simpleDialogues?.reactions?.[context.subtype || 'success'] || null;
      }
      case 'topic': {
        const topicId = context.subtype;
        if (!topicId) return null;
        const layer = context.layer || 'intro';
        const dialogueContext = this.buildDialogueContext(npcId);
        const topicDialogue = dialogLoader.getTopicDialogue(npcId, topicId, layer, dialogueContext, rng);
        if (topicDialogue) return topicDialogue.text_de;
        const simpleDialogues = this.deps.getNPCDialogues().get(npcId);
        return simpleDialogues?.topics?.[topicId] || null;
      }
      default:
        return null;
    }
  }

  /**
   * Get full topic dialogue object (for responses and Progressive Disclosure)
   */
  getTopicDialogueObject(npcId: string, topicId: string, layer: TopicLayer = 'intro'): TopicDialogue | null {
    const npc = this.deps.getNPCStates().get(npcId);
    if (!npc) return null;

    const phase = this.deps.getPhase();
    const rng = () => this.deps.seededRandom(`topic_${npcId}_${topicId}_${layer}_${phase.number}`);
    const dialogueContext = this.buildDialogueContext(npcId);

    return dialogLoader.getTopicDialogue(npcId, topicId, layer, dialogueContext, rng);
  }

  /**
   * Get available topics for an NPC with context-aware filtering
   */
  getNPCTopics(npcId: string): string[] {
    const npc = this.deps.getNPCStates().get(npcId);
    if (!npc) return [];

    const dialogueContext = this.buildDialogueContext(npcId);
    const platinumTopics = dialogLoader.getAvailableTopics(npcId, dialogueContext);
    if (platinumTopics.length > 0) return platinumTopics;

    const dialogues = this.deps.getNPCDialogues().get(npcId);
    if (!dialogues || !dialogues.topics) return [];
    return Object.keys(dialogues.topics);
  }

  /**
   * Check if topic has deeper content
   */
  hasTopicDeepContent(npcId: string, topicId: string): boolean {
    const dialogueContext = this.buildDialogueContext(npcId);
    return dialogLoader.hasDeepContent(topicId, npcId, dialogueContext);
  }

  /**
   * Check if topic has options/choices
   */
  hasTopicOptions(npcId: string, topicId: string): boolean {
    const dialogueContext = this.buildDialogueContext(npcId);
    return dialogLoader.hasOptions(topicId, npcId, dialogueContext);
  }

  /**
   * Get debate dialogue if conditions are met
   */
  getDebate(tags?: string[]): Debate | null {
    const dialogueContext = this.buildDialogueContext('direktor');
    return dialogLoader.getDebate(dialogueContext, tags);
  }

  /**
   * Process dialogue response with action coupling
   */
  processTopicResponse(npcId: string, response: DialogueResponse): void {
    const npc = this.deps.getNPCStates().get(npcId);
    if (!npc) return;

    const effects = dialogLoader.getResponseEffects(response.effect);
    if (effects) {
      npc.relationshipProgress += effects.relationship_change;
      if (npc.relationshipProgress >= 100 && npc.relationshipLevel < 3) {
        npc.relationshipLevel++;
        npc.relationshipProgress -= 100;
      } else if (npc.relationshipProgress < 0 && npc.relationshipLevel > 0) {
        npc.relationshipLevel--;
        npc.relationshipProgress = 100 + npc.relationshipProgress;
      }
      npc.morale = Math.max(0, Math.min(100, npc.morale + effects.morale_change));
    }

    switch (response.effect) {
      case 'unlock_action':
        if (response.payload?.actionId) {
          storyLogger.log(`Action unlocked: ${response.payload.actionId} for ${response.payload.duration_phases || 'permanent'} phases`);
        }
        break;
      case 'lock_action':
        if (response.payload?.actionId) {
          storyLogger.log(`Action locked: ${response.payload.actionId}`);
        }
        break;
      case 'modify_action_cost':
        if (response.payload?.actionId && response.payload?.cost_modifier) {
          storyLogger.log(`Action cost modified: ${response.payload.actionId} x${response.payload.cost_modifier}`);
        }
        break;
      case 'add_memory_tag':
        if (response.payload?.memory_tag) {
          dialogLoader.addMemoryTag(npcId, response.payload.memory_tag);
        }
        break;
      case 'trigger_event':
        if (response.payload?.event_id) {
          storyLogger.log(`Event triggered: ${response.payload.event_id}`);
        }
        break;
    }
  }

  /**
   * Add memory tag to NPC
   */
  addNPCMemoryTag(npcId: string, tag: string): void {
    dialogLoader.addMemoryTag(npcId, tag);
  }

  /**
   * Get NPC memory tags
   */
  getNPCMemoryTags(npcId: string): string[] {
    return dialogLoader.getMemoryTags(npcId);
  }

  /**
   * Get dialogue system metrics
   */
  getDialogueMetrics(): { repetitionRate: number; featureFlags: Record<string, boolean> } {
    return {
      repetitionRate: dialogLoader.getRepetitionRate(),
      featureFlags: { ...dialogLoader.getFeatureFlags() },
    };
  }

  // ============================================
  // LEGACY DIALOGUE METHODS (via instance DialogLoader)
  // ============================================

  /**
   * Get greeting dialogue for an NPC based on current relationship
   */
  getNPCGreeting(npcId: string): Dialogue | null {
    const npc = this.deps.getNPCStates().get(npcId);
    if (!npc) return null;

    const phase = this.deps.getPhase();
    return this.dialogLoaderInstance.getGreeting(
      npcId,
      npc.relationshipLevel,
      () => this.deps.seededRandom(`greeting_${npcId}_${phase.number}`)
    );
  }

  /**
   * Get briefing dialogue for an NPC
   */
  getNPCBriefing(npcId: string): Dialogue | null {
    const phase = this.deps.getPhase();
    return this.dialogLoaderInstance.getBriefing(
      npcId,
      phase.number,
      () => this.deps.seededRandom(`briefing_${npcId}_${phase.number}`)
    );
  }

  /**
   * Get NPC reaction to an action
   */
  getNPCReaction(npcId: string, actionTags: string[]): Dialogue | null {
    const npc = this.deps.getNPCStates().get(npcId);
    if (!npc) return null;

    const resources = this.deps.getResources();
    const phase = this.deps.getPhase();
    const conditions = {
      morale: npc.morale,
      risk: resources.risk,
      moral_weight: resources.moralWeight || 0,
    };

    return this.dialogLoaderInstance.getReaction(
      npcId,
      actionTags,
      conditions,
      () => this.deps.seededRandom(`reaction_${npcId}_${phase.number}`)
    );
  }

  /**
   * Get crisis dialogue for an NPC (if in crisis state)
   */
  getNPCCrisisDialogue(npcId: string): Dialogue | null {
    const npc = this.deps.getNPCStates().get(npcId);
    if (!npc || !npc.inCrisis) return null;

    const resources = this.deps.getResources();
    const phase = this.deps.getPhase();
    const objectives = this.deps.getObjectives();
    const primaryObjective = objectives.find(o => o.id === 'obj_destabilize');
    const objectiveProgress = primaryObjective
      ? (primaryObjective.currentValue / primaryObjective.targetValue) * 100
      : 0;

    const conditions = {
      morale: npc.morale,
      risk: resources.risk,
      moscow_pressure: phase.number > 60 && objectiveProgress < 50,
      moral_weight: resources.moralWeight || 0,
    };

    return this.dialogLoaderInstance.getCrisisDialogue(npcId, conditions);
  }

  /**
   * Get first meeting dialogue for an NPC
   */
  getNPCFirstMeeting(npcId: string): Dialogue | null {
    return this.dialogLoaderInstance.getFirstMeetingDialogue(npcId);
  }

  /**
   * Get game end dialogue for an NPC
   */
  getNPCGameEndDialogue(npcId: string, isVictory: boolean): string | null {
    return this.dialogLoaderInstance.getGameEndDialogue(npcId, isVictory);
  }

  /**
   * Process player response to dialogue (legacy path)
   */
  processDialogueResponse(response: DialogueResponse, npcId: string): void {
    const effects = this.dialogLoaderInstance.getResponseEffects(response.effect);
    if (!effects) return;

    const npc = this.deps.getNPCStates().get(npcId);
    if (!npc) return;

    npc.relationshipProgress += effects.relationship_change;
    if (npc.relationshipProgress >= 100 && npc.relationshipLevel < 3) {
      npc.relationshipLevel++;
      npc.relationshipProgress -= 100;
    } else if (npc.relationshipProgress < 0 && npc.relationshipLevel > 0) {
      npc.relationshipLevel--;
      npc.relationshipProgress = 100 + npc.relationshipProgress;
    }

    npc.morale = Math.max(0, Math.min(100, npc.morale + effects.morale_change));

    if (effects.triggers?.includes('npc_fear')) {
      npc.inCrisis = true;
    }
  }

  // ============================================
  // PRIVATE HELPERS
  // ============================================

  /**
   * Build dialogue context from current game state
   */
  private buildDialogueContext(npcId: string): DialogueContext {
    const npc = this.deps.getNPCStates().get(npcId);
    const resources = this.deps.getResources();
    const phase = this.deps.getPhase();

    return {
      phase: phase.number,
      risk: resources.risk,
      morale: npc?.morale ?? 50,
      budget: resources.budget,
      attention: resources.attention,
      capacity: resources.capacity,
      relationshipLevel: npc?.relationshipLevel ?? 0,
      tags: [],
      memoryTags: dialogLoader.getMemoryTags(npcId),
      npcName: npc?.name,
      inCrisis: npc?.inCrisis ?? false,
      objectiveProgress: this.calculateObjectiveProgress(),
      year: phase.year,
      availableActionsCount: this.getAvailableActionsCount(),
    };
  }

  /**
   * Calculate overall objective progress (0-100)
   */
  private calculateObjectiveProgress(): number {
    const objectives = this.deps.getObjectives();
    if (objectives.length === 0) return 0;
    const totalProgress = objectives.reduce((sum, obj) => {
      return sum + (obj.currentValue / obj.targetValue) * 100;
    }, 0);
    return Math.min(100, Math.round(totalProgress / objectives.length));
  }

  /**
   * Get count of available actions (placeholder)
   */
  private getAvailableActionsCount(): number {
    return 10;
  }
}
