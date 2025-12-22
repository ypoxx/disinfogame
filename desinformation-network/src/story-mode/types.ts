/**
 * Story Mode Type Definitions
 *
 * This file defines all types for the Story Mode interface.
 * Story Mode is a narrative wrapper around the core game engine,
 * presenting the same mechanics through an office-simulation UI.
 */

// ============================================
// CORE STORY STATE
// ============================================

export type TimeOfDay = 'morning' | 'midday' | 'afternoon' | 'evening' | 'night';

export interface StoryModeState {
  // Progress tracking
  currentDay: number;
  maxDays: number;
  timeOfDay: TimeOfDay;

  // Resources (mirrors game engine but presented differently)
  resources: {
    money: number;        // Budget in thousands (💰)
    attention: number;    // Detection risk (👁️)
    infrastructure: number; // Bot farms, assets (🏭)
  };

  // NPC Relationships (-100 to +100)
  relationships: {
    pm: number;           // Prime Minister trust
    volkov: number;       // Bot Farm Chief (Alexei Volkov)
    weber: number;        // Media Director (Dr. Weber)
    fischer: number;      // Strategy Director (M. Fischer)
    mueller: number;      // NGO Coordinator (S. Müller)
  };

  // Moral tracking (hidden from player, affects endings)
  moralAlignment: number; // -100 (ruthless) to +100 (ethical)

  // Decision history
  decisions: StoryDecision[];

  // Persistent flags for branching narrative
  flags: Record<string, boolean | number | string>;

  // UI state
  unreadEmails: number;
  currentLocation: StoryLocation;
  availableEmails: string[]; // IDs of unread emails
  completedEmails: string[]; // IDs of read/acted emails

  // Day progression
  actionsToday: number;
  maxActionsPerDay: number;
  dayComplete: boolean;
}

export type StoryLocation =
  | 'office'
  | 'inbox'
  | 'npc-volkov'
  | 'npc-weber'
  | 'npc-fischer'
  | 'npc-mueller'
  | 'status-board'
  | 'day-summary';

export interface StoryDecision {
  day: number;
  emailId?: string;
  npcId?: string;
  choiceId: string;
  choiceText: string;
  timestamp: number;
  consequences: DecisionConsequence[];
}

export interface DecisionConsequence {
  type: 'resource' | 'relationship' | 'flag' | 'moral' | 'narrative';
  target: string;
  value: number | boolean | string;
  description: string;
}

// ============================================
// EMAIL SYSTEM
// ============================================

export type EmailPriority = 'low' | 'normal' | 'urgent' | 'critical';

export interface Email {
  id: string;
  day: number;

  // Metadata
  from: string;
  subject: string;
  time: string; // e.g., "08:30"
  priority: EmailPriority;

  // Content
  body: string; // Can include markdown

  // Choices (decision points)
  choices: EmailChoice[];

  // Conditions for appearance
  conditions?: EmailCondition[];

  // Narrative tags for tracking
  tags: string[]; // e.g., ['pandemic', 'economy', 'moral-dilemma']
}

export interface EmailChoice {
  id: string;
  text: string;
  description?: string; // Hover tooltip

  // Categorization
  type: 'truth' | 'soft-lie' | 'hard-lie' | 'postpone' | 'delegate' | 'neutral';

  // Costs and requirements
  costs?: {
    money?: number;
    attention?: number;
    infrastructure?: number;
  };

  requires?: {
    flags?: Record<string, any>;
    relationships?: Record<string, number>; // min values
    resources?: Record<string, number>; // min values
  };

  // Consequences
  consequences: DecisionConsequence[];

  // Narrative feedback shown after choice
  feedbackTitle: string;
  feedbackBody: string;
  feedbackCynicism?: string; // Cynical narrator comment
  feedbackPoetry?: string;   // Poetic reflection

  // Follow-up actions
  triggersEmail?: string; // ID of email to trigger
  opensNPC?: string;      // ID of NPC to unlock

  // Engine integration
  executesAbility?: {
    abilityId: string;
    targetActorId?: string;
    targetActorIds?: string[];
  };
}

export interface EmailCondition {
  type: 'flag' | 'relationship' | 'day' | 'decision';
  target: string;
  operator: 'equals' | 'greaterThan' | 'lessThan' | 'includes';
  value: any;
}

// ============================================
// NPC SYSTEM
// ============================================

export type NPCRole =
  | 'bot-farm-chief'
  | 'media-director'
  | 'strategy-director'
  | 'ngo-coordinator'
  | 'prime-minister';

export interface NPC {
  id: string;
  name: string;
  role: NPCRole;

  // Visual representation
  portrait?: string; // Path to portrait image or emoji
  appearance: string; // Description for CSS-based representation

  // Personality
  personality: {
    loyalty: number;      // How loyal to player (-100 to +100)
    morality: number;     // Ethical (-100) to Ruthless (+100)
    pragmatism: number;   // Idealistic (-100) to Pragmatic (+100)
    description: string;
  };

  // Dialog system
  dialogs: NPCDialog[];

  // Game engine mapping
  providesAbilities: string[]; // IDs of abilities this NPC offers

  // Availability
  availableFromDay: number;
  unlockConditions?: EmailCondition[];
}

export interface NPCDialog {
  id: string;

  // Conditions for this dialog to appear
  conditions?: EmailCondition[];
  priority: number; // Higher priority shown first

  // Dialog content
  text: string; // NPC's initial statement (can include markdown)

  // Player response options
  options: NPCDialogOption[];

  // Special dialog types
  type?: 'intro' | 'mission' | 'question' | 'warning' | 'result';
}

export interface NPCDialogOption {
  id: string;
  text: string; // What player says

  // Type of response
  type: 'question' | 'command' | 'challenge' | 'accept' | 'decline';

  // What happens next
  nextDialog?: string;      // ID of next dialog
  executesAbility?: {       // Maps to game engine
    abilityId: string;
    requiresTargeting: boolean;
    suggestedTargets?: string[]; // Actor IDs to suggest
  };

  // Consequences
  consequences?: DecisionConsequence[];

  // Relationship impact
  relationshipChange?: number;

  // Special actions
  closesDialog?: boolean;   // Returns to office
  triggersEmail?: string;   // Triggers new email
  opensLocation?: StoryLocation; // Opens different location
}

// ============================================
// TARGETING SYSTEM (Simplified for Story Mode)
// ============================================

export interface TargetingSuggestion {
  actorId: string;
  actorName: string;
  reason: string; // Why this is suggested
  effectiveness: 'low' | 'medium' | 'high';
}

export interface TargetingMode {
  active: boolean;
  abilityId: string;
  sourceNPC: string;
  suggestedTargets: TargetingSuggestion[];
  allowCustomTarget: boolean;
}

// ============================================
// DAY SUMMARY
// ============================================

export interface DaySummary {
  day: number;

  // Decisions recap
  decisions: {
    emailId: string;
    emailSubject: string;
    choiceText: string;
    choiceType: string;
  }[];

  // Resource changes
  resourceChanges: {
    money: { start: number; end: number; change: number };
    attention: { start: number; end: number; change: number };
    infrastructure: { start: number; end: number; change: number };
  };

  // Impact summary
  impacts: {
    category: string; // e.g., "Pandemic Crisis", "Election Campaign"
    effects: string[];
  }[];

  // Narrative feedback
  newsHeadlines: string[];

  // Night sequence (optional)
  nightNarrative?: {
    text: string;
    mood: 'hopeful' | 'tense' | 'dark' | 'cynical';
  };

  // Game state evaluation
  gameState: {
    trustPublic: number;
    electionChance: number;
    crisisLevel: number;
  };
}

// ============================================
// NARRATIVE FEEDBACK
// ============================================

export interface NarrativeFeedback {
  type: 'cynicism' | 'poetry' | 'consequence' | 'reflection';
  text: string;
  mood?: 'dark' | 'light' | 'neutral' | 'ironic';
  triggeredBy?: string; // Decision ID
}

// ============================================
// GAME INTEGRATION
// ============================================

/**
 * Bridge between Story Mode UI state and Game Engine state
 */
export interface StoryEngineMapping {
  // How Story Mode resources map to Game Engine
  resourceMapping: {
    storyMode: keyof StoryModeState['resources'];
    engineKey: string;
    multiplier?: number;
  }[];

  // How NPCs map to Abilities
  npcAbilityMapping: {
    npcId: string;
    abilityIds: string[];
  }[];

  // How Actors are presented in Story Mode
  actorPresentationMode: 'simplified' | 'categories' | 'full';
}

// ============================================
// INITIALIZATION
// ============================================

export const INITIAL_STORY_STATE: StoryModeState = {
  currentDay: 1,
  maxDays: 32,
  timeOfDay: 'morning',

  resources: {
    money: 150,
    attention: 0,
    infrastructure: 0,
  },

  relationships: {
    pm: 0,
    volkov: 0,
    weber: 0,
    fischer: 0,
    mueller: 0,
  },

  moralAlignment: 0,

  decisions: [],
  flags: {},

  unreadEmails: 0,
  currentLocation: 'office',
  availableEmails: [],
  completedEmails: [],

  actionsToday: 0,
  maxActionsPerDay: 10, // Can be adjusted
  dayComplete: false,
};
