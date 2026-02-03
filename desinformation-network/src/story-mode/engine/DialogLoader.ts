/**
 * Story Mode Dialog Loader
 * Platinum Dialog System - Advanced NPC dialogue management
 *
 * Features:
 * - Progressive Disclosure (intro/deep/options layers)
 * - JSON-based condition evaluation
 * - Dynamic insert resolution ({budget_state}, etc.)
 * - Anti-repetition engine
 * - Emotional memory system
 * - Multi-speaker debates
 *
 * @see docs/story-mode/PLATINUM_DIALOG_SYSTEM_PLAN.md
 */

import dialoguesData from '../data/dialogues.json';
import topicsData from '../data/topics_dialogues.json';
import insertLibraryData from '../data/insert_library.json';

// ============================================
// PLATINUM DIALOG SYSTEM TYPES
// ============================================

/**
 * JSON-based condition clause for advanced dialogue filtering
 */
export interface ConditionClause {
  var: string;
  op: '<' | '<=' | '>' | '>=' | '==' | '!=' | 'contains' | 'notContains' | 'in' | 'inRange';
  value: number | string | boolean | string[] | [number, number];
}

/**
 * Composite condition with all/any logic
 */
export interface Condition {
  all?: ConditionClause[];
  any?: ConditionClause[];
}

/**
 * Extended dialogue response with action coupling
 */
export interface DialogueResponse {
  id: string;
  text_de: string;
  text_en?: string;
  effect: 'positive' | 'neutral' | 'dismissive' | 'threatening' | 'unlock_action' | 'lock_action' | 'modify_action_cost' | 'add_memory_tag' | 'trigger_event';
  consequence?: string;
  leads_to?: string;
  payload?: {
    actionId?: string;
    duration_phases?: number;
    cost_modifier?: number;
    memory_tag?: string;
    event_id?: string;
  };
}

/**
 * Topic dialogue layer type for Progressive Disclosure
 */
export type TopicLayer = 'intro' | 'deep' | 'options';

/**
 * Context for dialogue selection
 */
export interface DialogueContext {
  phase: number;
  risk: number;
  morale: number;
  budget: number;
  attention?: number;
  capacity?: number;
  relationshipLevel: number;
  tags?: string[];
  memoryTags?: string[];
  npcName?: string;
  inCrisis?: boolean;
  recentActionName?: string;
  recentActionSuccess?: boolean;
  objectiveProgress?: number;
  year?: number;
  availableActionsCount?: number;
  crisisType?: string;
}

/**
 * Topic entry with progressive disclosure layers
 */
export interface TopicEntry {
  core_message?: string;
  intro: TopicDialogue[];
  deep?: TopicDialogue[];
  options?: TopicDialogue[];
  npc_variants?: Record<string, {
    intro?: TopicDialogue[];
    deep?: TopicDialogue[];
    options?: TopicDialogue[];
  }>;
}

/**
 * Extended dialogue for topics
 */
export interface TopicDialogue {
  id: string;
  text_de: string;
  text_en?: string;
  tone?: string;
  probability?: number;
  phase_range?: [number, number];
  condition?: Condition;
  triggered_by_tags?: string[];
  npc_id?: string;
  core_id?: string;
  responses?: DialogueResponse[];
  leads_to?: string;
  relationship_bonus?: number;
  morale_change?: number;
  unlocks_info?: string;
}

/**
 * Debate turn in multi-speaker dialogue
 */
export interface DebateTurn {
  speaker: string;
  text_de: string;
  text_en?: string;
  tone?: string;
}

/**
 * Multi-speaker debate dialogue
 */
export interface Debate {
  id: string;
  dialogue_type: 'debate';
  participants: string[];
  phase_range?: [number, number];
  condition?: Condition;
  triggered_by_tags?: string[];
  turns: DebateTurn[];
  resolution?: {
    choices: DialogueResponse[];
  };
}

/**
 * Insert library entry for dynamic placeholders
 */
export interface InsertEntry {
  type?: 'direct_value' | 'context_value' | 'computed';
  var?: string;
  format?: string;
  suffix_de?: string;
  suffix_en?: string;
  formula?: string;
  conditions?: Array<{
    condition: ConditionClause;
    text_de: string;
    text_en?: string;
  }>;
  default?: {
    text_de: string;
    text_en?: string;
  };
  fallback?: {
    text_de: string;
    text_en?: string;
  };
}

/**
 * Dialogue history entry for anti-repetition
 */
export interface DialogueHistoryEntry {
  dialogueId: string;
  timestamp: number;
  npcId?: string;
  topicId?: string;
}

/**
 * Emotional memory state
 */
export interface EmotionalMemory {
  memoryTags: string[];
  tagCounts: Record<string, number>;
  lastUpdated: number;
}

export interface Dialogue {
  id: string;
  text_de: string;
  text_en?: string;
  tone?: string;
  probability?: number;
  condition?: string | Condition; // Support both legacy string and new JSON format
  phase_range?: [number, number];
  triggered_by_tags?: string[];
  relationship_bonus?: number;
  morale_change?: number;
  unlocks_info?: string;
  responses?: DialogueResponse[];
  npc_id?: string;
  core_id?: string;
  leads_to?: string;
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

  // ============================================
  // PLATINUM DIALOG SYSTEM STATE
  // ============================================

  /** Topic dialogues with progressive disclosure */
  private topics: Map<string, TopicEntry> = new Map();

  /** Multi-speaker debate dialogues */
  private debates: Map<string, Debate> = new Map();

  /** Insert library for dynamic placeholders */
  private insertLibrary: Map<string, InsertEntry> = new Map();

  /** Dialogue history for anti-repetition (last 10 dialogues) */
  private dialogueHistory: DialogueHistoryEntry[] = [];
  private readonly MAX_HISTORY_SIZE = 10;
  private readonly COOLDOWN_WINDOW = 5; // Prevent repetition within last 5 dialogues

  /** Emotional memory per NPC */
  private emotionalMemory: Map<string, EmotionalMemory> = new Map();

  /** Feature flags for gradual rollout */
  private featureFlags = {
    useNewTopics: true,
    useInsertLibrary: true,
    useDebateDialogues: true,
    useAntiRepetition: true,
    useEmotionalMemory: true
  };

  constructor() {
    this.loadDialogues();
    this.loadPlatinumDialogues();
  }

  /**
   * Load Platinum Dialog System data
   */
  private loadPlatinumDialogues(): void {
    // Load topics
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const topics = (topicsData as any).topics;
    if (topics) {
      for (const [topicId, topicData] of Object.entries(topics)) {
        this.topics.set(topicId, topicData as TopicEntry);
      }
    }

    // Load debates
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const debates = (topicsData as any).debates;
    if (debates) {
      for (const [debateId, debateData] of Object.entries(debates)) {
        this.debates.set(debateId, debateData as Debate);
      }
    }

    // Load insert library
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const inserts = (insertLibraryData as any).inserts;
    if (inserts) {
      for (const [key, value] of Object.entries(inserts)) {
        this.insertLibrary.set(key, value as InsertEntry);
      }
    }
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
   * Evaluate a condition string against provided context (legacy format)
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

  // ============================================
  // PLATINUM DIALOG SYSTEM - CONDITION EVALUATOR
  // ============================================

  /**
   * Evaluate a JSON condition clause
   */
  private evaluateConditionClause(clause: ConditionClause, context: DialogueContext): boolean {
    const value = this.getContextValue(clause.var, context);

    try {
      switch (clause.op) {
        case '<':
          return typeof value === 'number' && value < (clause.value as number);
        case '<=':
          return typeof value === 'number' && value <= (clause.value as number);
        case '>':
          return typeof value === 'number' && value > (clause.value as number);
        case '>=':
          return typeof value === 'number' && value >= (clause.value as number);
        case '==':
          return value === clause.value;
        case '!=':
          return value !== clause.value;
        case 'contains':
          if (Array.isArray(value)) {
            return value.includes(clause.value as string);
          }
          if (typeof value === 'string') {
            return value.includes(clause.value as string);
          }
          return false;
        case 'notContains':
          if (Array.isArray(value)) {
            return !value.includes(clause.value as string);
          }
          if (typeof value === 'string') {
            return !value.includes(clause.value as string);
          }
          return true;
        case 'in':
          if (Array.isArray(clause.value)) {
            return clause.value.includes(value as string);
          }
          return false;
        case 'inRange':
          if (typeof value === 'number' && Array.isArray(clause.value) && clause.value.length === 2) {
            const [min, max] = clause.value as [number, number];
            return value >= min && value <= max;
          }
          return false;
        default:
          console.warn(`Unknown condition operator: ${clause.op}`);
          return false;
      }
    } catch (error) {
      console.warn(`Condition evaluation error for ${clause.var}:`, error);
      return false;
    }
  }

  /**
   * Get a value from the dialogue context
   */
  private getContextValue(varName: string, context: DialogueContext): unknown {
    // Direct property access
    if (varName in context) {
      return context[varName as keyof DialogueContext];
    }

    // Check emotional memory for memory-related vars
    if (varName === 'memoryTags') {
      return context.memoryTags || [];
    }

    // Handle computed values
    if (varName === 'ignored_advice_count') {
      const memory = context.memoryTags || [];
      return memory.filter(tag => tag === 'ignored_advice').length;
    }

    return undefined;
  }

  /**
   * Evaluate a complete JSON condition (all/any logic)
   */
  private evaluateJsonCondition(condition: Condition | undefined, context: DialogueContext): boolean {
    if (!condition) return true;

    // Evaluate 'all' conditions (AND logic)
    if (condition.all && condition.all.length > 0) {
      const allPass = condition.all.every(clause => this.evaluateConditionClause(clause, context));
      if (!allPass) return false;
    }

    // Evaluate 'any' conditions (OR logic)
    if (condition.any && condition.any.length > 0) {
      const anyPass = condition.any.some(clause => this.evaluateConditionClause(clause, context));
      if (!anyPass) return false;
    }

    return true;
  }

  /**
   * Universal condition evaluator - handles both legacy string and new JSON format
   */
  private evaluateUniversalCondition(
    condition: string | Condition | undefined,
    context: DialogueContext
  ): boolean {
    if (!condition) return true;

    // Legacy string format
    if (typeof condition === 'string') {
      return this.evaluateCondition(condition, context as Record<string, unknown>);
    }

    // New JSON format
    return this.evaluateJsonCondition(condition, context);
  }

  // ============================================
  // PLATINUM DIALOG SYSTEM - INSERT RESOLVER
  // ============================================

  /**
   * Resolve all {insert} placeholders in a text
   */
  resolveInserts(text: string, context: DialogueContext, locale: 'de' | 'en' = 'de'): string {
    if (!this.featureFlags.useInsertLibrary) return text;

    const insertPattern = /\{(\w+)\}/g;

    return text.replace(insertPattern, (match, insertKey) => {
      const resolved = this.resolveInsert(insertKey, context, locale);
      return resolved !== null ? resolved : match; // Keep original if not found
    });
  }

  /**
   * Resolve a single insert placeholder
   */
  private resolveInsert(insertKey: string, context: DialogueContext, locale: 'de' | 'en'): string | null {
    const entry = this.insertLibrary.get(insertKey);
    if (!entry) {
      console.warn(`Insert not found: ${insertKey}`);
      return null;
    }

    const textKey = locale === 'en' ? 'text_en' : 'text_de';
    const suffixKey = locale === 'en' ? 'suffix_en' : 'suffix_de';

    // Direct value from context
    if (entry.type === 'direct_value' && entry.var) {
      const value = this.getContextValue(entry.var, context);
      if (value !== undefined) {
        let result = entry.format ? entry.format.replace('{value}', String(value)) : String(value);
        if (entry[suffixKey]) {
          result += entry[suffixKey];
        }
        return result;
      }
      return entry.fallback?.[textKey] || entry.fallback?.text_de || null;
    }

    // Context value (string from context)
    if (entry.type === 'context_value' && entry.var) {
      const value = this.getContextValue(entry.var, context);
      if (value !== undefined && value !== null) {
        return String(value);
      }
      return entry.fallback?.[textKey] || entry.fallback?.text_de || null;
    }

    // Computed value
    if (entry.type === 'computed' && entry.formula) {
      try {
        const result = this.evaluateFormula(entry.formula, context);
        if (result !== null) {
          let output = String(result);
          if (entry[suffixKey]) {
            output += entry[suffixKey];
          }
          return output;
        }
      } catch {
        // Fall through to fallback
      }
      return entry.fallback?.[textKey] || entry.fallback?.text_de || null;
    }

    // Conditional values
    if (entry.conditions) {
      for (const condEntry of entry.conditions) {
        if (this.evaluateConditionClause(condEntry.condition, context)) {
          return condEntry[textKey] || condEntry.text_de;
        }
      }
    }

    // Default value
    if (entry.default) {
      return entry.default[textKey] || entry.default.text_de;
    }

    return null;
  }

  /**
   * Evaluate a simple formula (floor(budget / 2000), etc.)
   */
  private evaluateFormula(formula: string, context: DialogueContext): number | null {
    // Simple formula parser for common patterns
    const floorMatch = formula.match(/floor\((\w+)\s*\/\s*(\d+)\)/);
    if (floorMatch) {
      const [, varName, divisor] = floorMatch;
      const value = this.getContextValue(varName, context);
      if (typeof value === 'number') {
        return Math.floor(value / parseInt(divisor, 10));
      }
    }

    const subtractMatch = formula.match(/(\d+)\s*-\s*(\w+)/);
    if (subtractMatch) {
      const [, num, varName] = subtractMatch;
      const value = this.getContextValue(varName, context);
      if (typeof value === 'number') {
        return parseInt(num, 10) - value;
      }
    }

    return null;
  }

  // ============================================
  // PLATINUM DIALOG SYSTEM - ANTI-REPETITION
  // ============================================

  /**
   * Check if a dialogue was recently shown (within cooldown window)
   */
  private isInCooldown(dialogueId: string): boolean {
    if (!this.featureFlags.useAntiRepetition) return false;

    const recentHistory = this.dialogueHistory.slice(-this.COOLDOWN_WINDOW);
    return recentHistory.some(entry => entry.dialogueId === dialogueId);
  }

  /**
   * Record a dialogue as shown
   */
  recordDialogueShown(dialogueId: string, npcId?: string, topicId?: string): void {
    this.dialogueHistory.push({
      dialogueId,
      timestamp: Date.now(),
      npcId,
      topicId
    });

    // Trim history to max size
    if (this.dialogueHistory.length > this.MAX_HISTORY_SIZE) {
      this.dialogueHistory = this.dialogueHistory.slice(-this.MAX_HISTORY_SIZE);
    }
  }

  /**
   * Apply cooldown penalty to candidate weights
   */
  private applyCooldownWeights(
    candidates: TopicDialogue[],
    weights: number[]
  ): number[] {
    return weights.map((weight, index) => {
      const dialogue = candidates[index];
      if (this.isInCooldown(dialogue.id)) {
        return weight * 0.1; // 90% penalty for recent dialogues
      }
      return weight;
    });
  }

  // ============================================
  // PLATINUM DIALOG SYSTEM - EMOTIONAL MEMORY
  // ============================================

  /**
   * Add a memory tag for an NPC
   */
  addMemoryTag(npcId: string, tag: string): void {
    if (!this.featureFlags.useEmotionalMemory) return;

    let memory = this.emotionalMemory.get(npcId);
    if (!memory) {
      memory = {
        memoryTags: [],
        tagCounts: {},
        lastUpdated: Date.now()
      };
      this.emotionalMemory.set(npcId, memory);
    }

    memory.memoryTags.push(tag);
    memory.tagCounts[tag] = (memory.tagCounts[tag] || 0) + 1;
    memory.lastUpdated = Date.now();

    // Keep only last 10 tags
    if (memory.memoryTags.length > 10) {
      const removed = memory.memoryTags.shift();
      if (removed && memory.tagCounts[removed] > 0) {
        memory.tagCounts[removed]--;
      }
    }
  }

  /**
   * Get memory tags for an NPC
   */
  getMemoryTags(npcId: string): string[] {
    const memory = this.emotionalMemory.get(npcId);
    return memory?.memoryTags || [];
  }

  /**
   * Get memory tag count
   */
  getMemoryTagCount(npcId: string, tag: string): number {
    const memory = this.emotionalMemory.get(npcId);
    return memory?.tagCounts[tag] || 0;
  }

  /**
   * Check if NPC should have tone override based on memory
   */
  getMemoryToneOverride(npcId: string): string | null {
    const memory = this.emotionalMemory.get(npcId);
    if (!memory) return null;

    // If ignored_advice >= 3, tone becomes skeptical/cold
    if ((memory.tagCounts['ignored_advice'] || 0) >= 3) {
      return 'skeptical';
    }

    // If resource_cut >= 2, tone becomes concerned
    if ((memory.tagCounts['resource_cut'] || 0) >= 2) {
      return 'concerned';
    }

    return null;
  }

  // ============================================
  // PLATINUM DIALOG SYSTEM - TOPIC DIALOGUES
  // ============================================

  /**
   * Get topic dialogue with Progressive Disclosure
   *
   * @param npcId - The NPC to get dialogue from
   * @param topicId - The topic ID (e.g., 'budget', 'risks')
   * @param layer - The disclosure layer ('intro', 'deep', 'options')
   * @param context - Current game context for condition evaluation
   * @param rng - Optional RNG function for deterministic selection
   */
  getTopicDialogue(
    npcId: string,
    topicId: string,
    layer: TopicLayer,
    context: DialogueContext,
    rng?: () => number
  ): TopicDialogue | null {
    if (!this.featureFlags.useNewTopics) {
      return null; // Fall back to legacy system
    }

    const topic = this.topics.get(topicId);
    if (!topic) return null;

    // Get candidates from the appropriate layer
    let candidates = this.getTopicLayerCandidates(topic, npcId, layer);
    if (candidates.length === 0) return null;

    // Filter by phase range
    candidates = candidates.filter(d => {
      if (!d.phase_range) return true;
      return context.phase >= d.phase_range[0] && context.phase <= d.phase_range[1];
    });

    // Filter by conditions
    candidates = candidates.filter(d => this.evaluateUniversalCondition(d.condition, context));

    // Filter by NPC if specified
    candidates = candidates.filter(d => !d.npc_id || d.npc_id === npcId);

    if (candidates.length === 0) return null;

    // Calculate weights based on probability
    let weights = candidates.map(d => d.probability ?? 0.5);

    // Apply cooldown weights for anti-repetition
    weights = this.applyCooldownWeights(candidates, weights);

    // Select using weighted random
    const randomFn = rng || Math.random;
    const selected = this.weightedSelect(candidates, weights, randomFn);

    if (selected) {
      // Resolve inserts in text
      const locale = 'de'; // Could be parameterized
      selected.text_de = this.resolveInserts(selected.text_de, context, 'de');
      if (selected.text_en) {
        selected.text_en = this.resolveInserts(selected.text_en, context, 'en');
      }

      // Record for anti-repetition
      this.recordDialogueShown(selected.id, npcId, topicId);
    }

    return selected;
  }

  /**
   * Get candidates from a topic layer, including NPC variants
   */
  private getTopicLayerCandidates(
    topic: TopicEntry,
    npcId: string,
    layer: TopicLayer
  ): TopicDialogue[] {
    const candidates: TopicDialogue[] = [];

    // Add base layer dialogues
    const baseLayer = topic[layer];
    if (baseLayer) {
      candidates.push(...baseLayer);
    }

    // Add NPC-specific variants
    const npcVariant = topic.npc_variants?.[npcId];
    if (npcVariant?.[layer]) {
      candidates.push(...npcVariant[layer]!);
    }

    return candidates;
  }

  /**
   * Weighted random selection
   */
  private weightedSelect<T>(
    items: T[],
    weights: number[],
    rng: () => number
  ): T | null {
    if (items.length === 0) return null;

    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    if (totalWeight <= 0) {
      // If all weights are 0, select uniformly
      return items[Math.floor(rng() * items.length)];
    }

    let random = rng() * totalWeight;
    for (let i = 0; i < items.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return items[i];
      }
    }

    return items[items.length - 1];
  }

  /**
   * Get all available topics for an NPC
   */
  getAvailableTopics(npcId: string, context: DialogueContext): string[] {
    const availableTopics: string[] = [];

    for (const [topicId, topic] of this.topics) {
      // Check if there are any valid intro dialogues for this NPC
      const candidates = this.getTopicLayerCandidates(topic, npcId, 'intro');
      const validCandidates = candidates.filter(d => {
        if (d.phase_range && (context.phase < d.phase_range[0] || context.phase > d.phase_range[1])) {
          return false;
        }
        if (!this.evaluateUniversalCondition(d.condition, context)) {
          return false;
        }
        if (d.npc_id && d.npc_id !== npcId) {
          return false;
        }
        return true;
      });

      if (validCandidates.length > 0) {
        availableTopics.push(topicId);
      }
    }

    return availableTopics;
  }

  /**
   * Check if a topic has deeper content available
   */
  hasDeepContent(topicId: string, npcId: string, context: DialogueContext): boolean {
    const topic = this.topics.get(topicId);
    if (!topic) return false;

    const candidates = this.getTopicLayerCandidates(topic, npcId, 'deep');
    return candidates.some(d => {
      if (d.phase_range && (context.phase < d.phase_range[0] || context.phase > d.phase_range[1])) {
        return false;
      }
      return this.evaluateUniversalCondition(d.condition, context);
    });
  }

  /**
   * Check if a topic has options available
   */
  hasOptions(topicId: string, npcId: string, context: DialogueContext): boolean {
    const topic = this.topics.get(topicId);
    if (!topic) return false;

    const candidates = this.getTopicLayerCandidates(topic, npcId, 'options');
    return candidates.some(d => {
      if (d.phase_range && (context.phase < d.phase_range[0] || context.phase > d.phase_range[1])) {
        return false;
      }
      return this.evaluateUniversalCondition(d.condition, context);
    });
  }

  // ============================================
  // PLATINUM DIALOG SYSTEM - DEBATES
  // ============================================

  /**
   * Get a debate dialogue if conditions are met
   */
  getDebate(
    context: DialogueContext,
    tags?: string[]
  ): Debate | null {
    if (!this.featureFlags.useDebateDialogues) return null;

    for (const [, debate] of this.debates) {
      // Check phase range
      if (debate.phase_range) {
        if (context.phase < debate.phase_range[0] || context.phase > debate.phase_range[1]) {
          continue;
        }
      }

      // Check condition
      if (debate.condition && !this.evaluateJsonCondition(debate.condition, context)) {
        continue;
      }

      // Check triggered_by_tags
      if (debate.triggered_by_tags && tags) {
        const hasMatchingTag = debate.triggered_by_tags.some(t => tags.includes(t));
        if (!hasMatchingTag) continue;
      }

      // Resolve inserts in debate turns
      const resolvedDebate = { ...debate };
      resolvedDebate.turns = debate.turns.map(turn => ({
        ...turn,
        text_de: this.resolveInserts(turn.text_de, context, 'de'),
        text_en: turn.text_en ? this.resolveInserts(turn.text_en, context, 'en') : undefined
      }));

      return resolvedDebate;
    }

    return null;
  }

  /**
   * Get debates involving specific NPCs
   */
  getDebatesForNPCs(npcIds: string[]): Debate[] {
    const result: Debate[] = [];
    for (const [, debate] of this.debates) {
      if (npcIds.some(id => debate.participants.includes(id))) {
        result.push(debate);
      }
    }
    return result;
  }

  // ============================================
  // PLATINUM DIALOG SYSTEM - STATE MANAGEMENT
  // ============================================

  /**
   * Set feature flags for gradual rollout
   */
  setFeatureFlags(flags: Partial<typeof this.featureFlags>): void {
    this.featureFlags = { ...this.featureFlags, ...flags };
  }

  /**
   * Get current feature flags
   */
  getFeatureFlags(): Readonly<typeof this.featureFlags> {
    return { ...this.featureFlags };
  }

  /**
   * Calculate repetition rate for metrics
   */
  getRepetitionRate(): number {
    if (this.dialogueHistory.length < 2) return 0;

    const recentWindow = this.dialogueHistory.slice(-5);
    const uniqueIds = new Set(recentWindow.map(e => e.dialogueId));
    const repeated = recentWindow.length - uniqueIds.size;

    return repeated / recentWindow.length;
  }

  /**
   * Get all NPC IDs that have dialogues
   */
  getAllNPCIds(): string[] {
    return Array.from(this.npcDialogues.keys());
  }

  /**
   * Get all available topic IDs
   */
  getAllTopicIds(): string[] {
    return Array.from(this.topics.keys());
  }

  /**
   * Get all debate IDs
   */
  getAllDebateIds(): string[] {
    return Array.from(this.debates.keys());
  }

  /**
   * Export state for save/load (Platinum Dialog System)
   */
  exportState(): object {
    return {
      version: '2.0.0', // Platinum Dialog System
      dialogueHistory: this.dialogueHistory,
      emotionalMemory: Array.from(this.emotionalMemory.entries()).map(([npcId, memory]) => ({
        npcId,
        ...memory
      })),
      featureFlags: this.featureFlags
    };
  }

  /**
   * Import state for save/load (Platinum Dialog System)
   */
  importState(state: object): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const s = state as any;

    // Import dialogue history
    if (Array.isArray(s.dialogueHistory)) {
      this.dialogueHistory = s.dialogueHistory;
    }

    // Import emotional memory
    if (Array.isArray(s.emotionalMemory)) {
      this.emotionalMemory.clear();
      for (const entry of s.emotionalMemory) {
        if (entry.npcId) {
          this.emotionalMemory.set(entry.npcId, {
            memoryTags: entry.memoryTags || [],
            tagCounts: entry.tagCounts || {},
            lastUpdated: entry.lastUpdated || Date.now()
          });
        }
      }
    }

    // Import feature flags (preserve defaults for missing flags)
    if (s.featureFlags) {
      this.featureFlags = { ...this.featureFlags, ...s.featureFlags };
    }
  }

  /**
   * Reset all runtime state (for testing)
   */
  resetState(): void {
    this.dialogueHistory = [];
    this.emotionalMemory.clear();
  }
}

// ============================================
// UI STATE TYPES FOR DIALOGUE FLOW
// ============================================

/**
 * UI state for tracking dialogue flow (Progressive Disclosure)
 */
export interface DialogueUIState {
  phase: number;
  npcId?: string;
  topicId?: string;
  layer?: TopicLayer;
  dialogueId?: string;
  history: string[];
  deepRemaining: number;
  pendingActionId?: string;
  inDebate?: boolean;
  debateId?: string;
  debateTurnIndex?: number;
}

// Export singleton instance
export const dialogLoader = new DialogLoader();
