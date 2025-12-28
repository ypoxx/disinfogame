/**
 * Story Mode Dialog Loader
 * Loads and manages NPC dialogues from JSON data
 */

import dialoguesData from '../data/dialogues.json';

// ============================================
// TYPES
// ============================================

export interface DialogueResponse {
  id: string;
  text_de: string;
  text_en?: string;
  effect: 'positive' | 'neutral' | 'dismissive' | 'threatening';
  consequence?: string;
  leads_to?: string;
}

export interface Dialogue {
  id: string;
  text_de: string;
  text_en?: string;
  tone?: string;
  probability?: number;
  condition?: string;
  phase_range?: [number, number];
  triggered_by_tags?: string[];
  relationship_bonus?: number;
  morale_change?: number;
  unlocks_info?: string;
  responses?: DialogueResponse[];
}

export interface NPCDialogues {
  dialogue_style: {
    formality: 'low' | 'medium' | 'high';
    directness: 'low' | 'medium' | 'high';
    emotion: 'low' | 'medium' | 'high';
  };
  greetings: {
    level_0: Dialogue[];
    level_1: Dialogue[];
    level_2: Dialogue[];
    level_3: Dialogue[];
  };
  briefings?: Record<string, Dialogue[]>;
  reactions?: Record<string, Dialogue[]>;
  crisis?: Dialogue[];
  ambient?: Dialogue[];
}

export interface ResponseEffects {
  relationship_change: number;
  morale_change: number;
  triggers?: string[];
}

export type DialogueType = 'greeting' | 'briefing' | 'reaction' | 'crisis' | 'ambient' | 'story';

// ============================================
// DIALOG LOADER CLASS
// ============================================

export class DialogLoader {
  private npcDialogues: Map<string, NPCDialogues> = new Map();
  private firstMeetingDialogues: Map<string, Dialogue> = new Map();
  private gameEndDialogues: {
    victory: Map<string, string>;
    defeat_exposed: Map<string, string>;
  } = {
    victory: new Map(),
    defeat_exposed: new Map()
  };
  private responseEffects: Map<string, ResponseEffects> = new Map();

  constructor() {
    this.loadDialogues();
  }

  /**
   * Load all dialogues from JSON data
   */
  private loadDialogues(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = dialoguesData as any;

    // Load response effects
    if (data.response_effects) {
      for (const [key, value] of Object.entries(data.response_effects)) {
        this.responseEffects.set(key, value as ResponseEffects);
      }
    }

    // Load NPC dialogues
    if (data.npcs) {
      for (const [npcId, npcData] of Object.entries(data.npcs)) {
        this.npcDialogues.set(npcId, npcData as NPCDialogues);
      }
    }

    // Load special dialogues
    if (data.special_dialogues) {
      // First meeting dialogues
      if (data.special_dialogues.first_meeting) {
        for (const [npcId, dialogue] of Object.entries(data.special_dialogues.first_meeting)) {
          this.firstMeetingDialogues.set(npcId, dialogue as Dialogue);
        }
      }

      // Game end dialogues
      if (data.special_dialogues.game_end_dialogues) {
        const endDialogues = data.special_dialogues.game_end_dialogues;
        if (endDialogues.victory) {
          for (const [npcId, text] of Object.entries(endDialogues.victory)) {
            this.gameEndDialogues.victory.set(npcId, text as string);
          }
        }
        if (endDialogues.defeat_exposed) {
          for (const [npcId, text] of Object.entries(endDialogues.defeat_exposed)) {
            this.gameEndDialogues.defeat_exposed.set(npcId, text as string);
          }
        }
      }
    }
  }

  /**
   * Get greeting dialogue for an NPC based on relationship level
   */
  getGreeting(npcId: string, relationshipLevel: number, rng?: () => number): Dialogue | null {
    const npcData = this.npcDialogues.get(npcId);
    if (!npcData) return null;

    const level = Math.min(3, Math.max(0, Math.floor(relationshipLevel)));
    const levelKey = `level_${level}` as keyof typeof npcData.greetings;
    const greetings = npcData.greetings[levelKey];

    if (!greetings || greetings.length === 0) return null;

    const randomFn = rng || Math.random;
    const index = Math.floor(randomFn() * greetings.length);
    return greetings[index];
  }

  /**
   * Get briefing dialogue for an NPC based on game phase
   */
  getBriefing(npcId: string, phase: number, rng?: () => number): Dialogue | null {
    const npcData = this.npcDialogues.get(npcId);
    if (!npcData || !npcData.briefings) return null;

    // Determine game stage
    let stageKey = 'early_game';
    if (phase >= 96) stageKey = 'late_game';
    else if (phase >= 48) stageKey = 'mid_game';

    const briefings = npcData.briefings[stageKey];
    if (!briefings || briefings.length === 0) return null;

    // Filter by phase range if specified
    const validBriefings = briefings.filter(b => {
      if (!b.phase_range) return true;
      return phase >= b.phase_range[0] && phase <= b.phase_range[1];
    });

    if (validBriefings.length === 0) return null;

    const randomFn = rng || Math.random;
    const index = Math.floor(randomFn() * validBriefings.length);
    return validBriefings[index];
  }

  /**
   * Get reaction dialogue for an NPC based on action tags
   */
  getReaction(npcId: string, actionTags: string[], conditions: Record<string, unknown> = {}, rng?: () => number): Dialogue | null {
    const npcData = this.npcDialogues.get(npcId);
    if (!npcData || !npcData.reactions) return null;

    // Find matching reactions across all reaction categories
    const matchingReactions: Dialogue[] = [];

    for (const reactionCategory of Object.values(npcData.reactions)) {
      for (const reaction of reactionCategory) {
        // Check if action tags match
        if (reaction.triggered_by_tags) {
          const hasMatchingTag = reaction.triggered_by_tags.some(tag => actionTags.includes(tag));
          if (!hasMatchingTag) continue;
        }

        // Check condition if present
        if (reaction.condition) {
          if (!this.evaluateCondition(reaction.condition, conditions)) continue;
        }

        matchingReactions.push(reaction);
      }
    }

    if (matchingReactions.length === 0) return null;

    const randomFn = rng || Math.random;
    const index = Math.floor(randomFn() * matchingReactions.length);
    return matchingReactions[index];
  }

  /**
   * Get crisis dialogue for an NPC based on conditions
   */
  getCrisisDialogue(npcId: string, conditions: Record<string, unknown>): Dialogue | null {
    const npcData = this.npcDialogues.get(npcId);
    if (!npcData || !npcData.crisis) return null;

    // Find first matching crisis dialogue
    for (const crisis of npcData.crisis) {
      if (crisis.condition && this.evaluateCondition(crisis.condition, conditions)) {
        return crisis;
      }
    }

    return null;
  }

  /**
   * Get ambient dialogue for an NPC
   */
  getAmbientDialogue(npcId: string, conditions: Record<string, unknown> = {}, rng?: () => number): Dialogue | null {
    const npcData = this.npcDialogues.get(npcId);
    if (!npcData || !npcData.ambient) return null;

    const randomFn = rng || Math.random;

    // Filter by conditions and check probability
    const eligibleAmbient = npcData.ambient.filter(ambient => {
      if (ambient.condition && !this.evaluateCondition(ambient.condition, conditions)) {
        return false;
      }
      const probability = ambient.probability ?? 0.5;
      return randomFn() < probability;
    });

    if (eligibleAmbient.length === 0) return null;

    const index = Math.floor(randomFn() * eligibleAmbient.length);
    return eligibleAmbient[index];
  }

  /**
   * Get first meeting dialogue for an NPC
   */
  getFirstMeetingDialogue(npcId: string): Dialogue | null {
    return this.firstMeetingDialogues.get(npcId) || null;
  }

  /**
   * Get game end dialogue for an NPC
   */
  getGameEndDialogue(npcId: string, isVictory: boolean): string | null {
    const dialogues = isVictory ? this.gameEndDialogues.victory : this.gameEndDialogues.defeat_exposed;
    return dialogues.get(npcId) || null;
  }

  /**
   * Get response effects for a response type
   */
  getResponseEffects(effectType: string): ResponseEffects | null {
    return this.responseEffects.get(effectType) || null;
  }

  /**
   * Get NPC dialogue style
   */
  getDialogueStyle(npcId: string): NPCDialogues['dialogue_style'] | null {
    const npcData = this.npcDialogues.get(npcId);
    return npcData?.dialogue_style || null;
  }

  /**
   * Evaluate a condition string against provided context
   */
  private evaluateCondition(condition: string, context: Record<string, unknown>): boolean {
    // Simple condition evaluation
    // Format: "key > value", "key < value", "key == value", "key"

    // Check for comparison operators
    const gtMatch = condition.match(/^(\w+)\s*>\s*(\d+)$/);
    if (gtMatch) {
      const [, key, value] = gtMatch;
      const contextValue = context[key];
      if (typeof contextValue === 'number') {
        return contextValue > parseInt(value, 10);
      }
      return false;
    }

    const ltMatch = condition.match(/^(\w+)\s*<\s*(\d+)$/);
    if (ltMatch) {
      const [, key, value] = ltMatch;
      const contextValue = context[key];
      if (typeof contextValue === 'number') {
        return contextValue < parseInt(value, 10);
      }
      return false;
    }

    const eqMatch = condition.match(/^(\w+)\s*==\s*(.+)$/);
    if (eqMatch) {
      const [, key, value] = eqMatch;
      return context[key] === value;
    }

    // Simple boolean check
    return !!context[condition];
  }

  /**
   * Get all NPC IDs that have dialogues
   */
  getAllNPCIds(): string[] {
    return Array.from(this.npcDialogues.keys());
  }

  /**
   * Export state for save/load
   */
  exportState(): object {
    return {
      // DialogLoader is stateless - no runtime state to save
      version: '1.0.0'
    };
  }

  /**
   * Import state for save/load
   */
  importState(_state: object): void {
    // DialogLoader is stateless - nothing to restore
  }
}

// Export singleton instance
export const dialogLoader = new DialogLoader();
