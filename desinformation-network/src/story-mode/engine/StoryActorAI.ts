/**
 * StoryActorAI - Arms Race System for Story Mode
 *
 * Adapts the core Actor-AI for Story Mode's phase-based gameplay.
 * Creates a dynamic "arms race" where defensive actors evolve in
 * response to player disinformation tactics.
 *
 * Design Philosophy: AI should feel like a worthy opponent,
 * not a rubber-band difficulty system.
 */

import {
  processActorAI,
  executeCounterStrategy,
  ACTOR_BEHAVIORS,
  type ReactionTrigger,
  type CounterStrategy,
} from '../../game-logic/actor-ai';

import type { GameState, Actor, ActorReaction } from '../../game-logic/types';

// ============================================
// STORY MODE DEFENSIVE ACTORS
// ============================================

/**
 * Types of defensive actors the AI can spawn
 */
export type DefensiveActorType =
  | 'fact_checker'       // Investigative journalism
  | 'platform_moderator' // Social media enforcement
  | 'researcher'         // Academic analysis
  | 'watchdog'           // Civil society monitor
  | 'investigator'       // Government investigation
  | 'influencer'         // Counter-narrative spreader
  | 'citizen_network';   // Grassroots resistance

/**
 * Defensive actor definition
 */
export interface DefensiveActor {
  id: string;
  type: DefensiveActorType;
  name_de: string;
  name_en: string;
  spawnCondition: SpawnCondition;
  strength: number;       // 0-1, affects effectiveness
  awareness: number;      // 0-1, tracks player activity
  resilience: number;     // 0-1, resistance to counter-attacks
  tactics: string[];      // What counter-tactics they use
  newsOnSpawn_de: string;
  newsOnSpawn_en: string;
}

/**
 * Conditions that trigger defensive actor spawning
 */
export interface SpawnCondition {
  type: 'risk_threshold' | 'action_count' | 'phase_trigger' | 'combo_detected' | 'crisis_response';
  threshold?: number;
  actions?: string[];     // Specific action IDs that trigger
  tags?: string[];        // Tags that trigger
  phase?: number;         // Specific phase
}

/**
 * AI action against the player
 */
export interface AIAction {
  id: string;
  type: 'counter_narrative' | 'platform_action' | 'investigation' | 'exposure' | 'network_boost';
  source: string;         // Defensive actor ID
  target?: string;        // What the action targets
  strength: number;
  effects: AIActionEffect[];
  news_de: string;
  news_en: string;
}

/**
 * Effects of AI actions
 */
export interface AIActionEffect {
  type: 'risk_increase' | 'attention_increase' | 'reach_reduction' | 'network_boost' |
        'action_disabled' | 'cost_increase' | 'countdown_start';
  value: number;
  targetActionId?: string;
  duration?: number;      // Phases
}

// ============================================
// DEFENSIVE ACTOR DEFINITIONS
// ============================================

const DEFENSIVE_ACTORS: DefensiveActor[] = [
  {
    id: 'fact_checker_network',
    type: 'fact_checker',
    name_de: 'Faktenchecker-Netzwerk',
    name_en: 'Fact-Checker Network',
    spawnCondition: {
      type: 'action_count',
      actions: ['3.4', '3.5', '3.3'], // Fake news, conspiracy, memes
      threshold: 5,
    },
    strength: 0.4,
    awareness: 0.3,
    resilience: 0.6,
    tactics: ['debunk', 'source_verification', 'network_analysis'],
    newsOnSpawn_de: '📰 Neues Faktenchecker-Kollektiv nimmt Arbeit auf',
    newsOnSpawn_en: '📰 New fact-checking collective begins operations',
  },
  {
    id: 'platform_trust_safety',
    type: 'platform_moderator',
    name_de: 'Plattform-Sicherheitsteam',
    name_en: 'Platform Trust & Safety Team',
    spawnCondition: {
      type: 'action_count',
      tags: ['bot', 'amplification', 'astroturfing'],
      threshold: 4,
    },
    strength: 0.5,
    awareness: 0.4,
    resilience: 0.8,
    tactics: ['account_suspension', 'content_removal', 'reach_reduction'],
    newsOnSpawn_de: '🛡️ Social-Media-Plattform verstärkt Moderation',
    newsOnSpawn_en: '🛡️ Social media platform strengthens moderation',
  },
  {
    id: 'university_research_group',
    type: 'researcher',
    name_de: 'Forschungsgruppe Digitale Manipulation',
    name_en: 'Digital Manipulation Research Group',
    spawnCondition: {
      type: 'phase_trigger',
      phase: 24, // After 2 years
    },
    strength: 0.3,
    awareness: 0.6,
    resilience: 0.7,
    tactics: ['pattern_analysis', 'academic_exposure', 'media_literacy'],
    newsOnSpawn_de: '🎓 Universität gründet Forschungsgruppe zu Desinformation',
    newsOnSpawn_en: '🎓 University establishes disinformation research group',
  },
  {
    id: 'ngo_watchdog',
    type: 'watchdog',
    name_de: 'Demokratie-Watchdog NGO',
    name_en: 'Democracy Watchdog NGO',
    spawnCondition: {
      type: 'risk_threshold',
      threshold: 40,
    },
    strength: 0.4,
    awareness: 0.5,
    resilience: 0.5,
    tactics: ['public_awareness', 'policy_advocacy', 'international_coordination'],
    newsOnSpawn_de: '👁️ NGO startet Beobachtungsmission zu Online-Manipulation',
    newsOnSpawn_en: '👁️ NGO launches monitoring mission for online manipulation',
  },
  {
    id: 'government_investigation',
    type: 'investigator',
    name_de: 'Parlamentarischer Untersuchungsausschuss',
    name_en: 'Parliamentary Investigation Committee',
    spawnCondition: {
      type: 'risk_threshold',
      threshold: 70,
    },
    strength: 0.7,
    awareness: 0.8,
    resilience: 0.9,
    tactics: ['formal_investigation', 'subpoena_power', 'public_hearings'],
    newsOnSpawn_de: '⚖️ Parlament setzt Untersuchungsausschuss zu Desinformation ein',
    newsOnSpawn_en: '⚖️ Parliament establishes investigation committee on disinformation',
  },
  {
    id: 'counter_influencer_coalition',
    type: 'influencer',
    name_de: 'Influencer gegen Fake News',
    name_en: 'Influencers Against Fake News',
    spawnCondition: {
      type: 'action_count',
      tags: ['viral', 'emotional', 'polarization'],
      threshold: 6,
    },
    strength: 0.5,
    awareness: 0.3,
    resilience: 0.4,
    tactics: ['counter_narrative', 'reach_competition', 'audience_building'],
    newsOnSpawn_de: '⭐ Prominente Influencer formieren sich gegen Desinformation',
    newsOnSpawn_en: '⭐ Prominent influencers unite against disinformation',
  },
  {
    id: 'citizen_fact_check_army',
    type: 'citizen_network',
    name_de: 'Bürger-Faktenchecker-Netzwerk',
    name_en: 'Citizen Fact-Checking Network',
    spawnCondition: {
      type: 'crisis_response',
    },
    strength: 0.3,
    awareness: 0.4,
    resilience: 0.3,
    tactics: ['crowdsourced_verification', 'rapid_response', 'community_education'],
    newsOnSpawn_de: '👥 Bürgerinitiative zur Bekämpfung von Falschinformationen gegründet',
    newsOnSpawn_en: '👥 Citizens organize grassroots fact-checking initiative',
  },
];

// ============================================
// STORY ACTOR AI CLASS
// ============================================

export interface StoryActorAIState {
  spawnedActors: DefensiveActor[];
  actorStrengths: Record<string, number>;
  actorAwareness: Record<string, number>;
  lastActionPhase: Record<string, number>;
  actionCounts: Record<string, number>;
  tagCounts: Record<string, number>;
  disabledActions: Record<string, number>; // actionId -> phase when reenables
  armsRaceLevel: number; // 0-5, overall opposition intensity
}

export class StoryActorAI {
  private spawnedActors: DefensiveActor[] = [];
  private actorStrengths: Map<string, number> = new Map();
  private actorAwareness: Map<string, number> = new Map();
  private lastActionPhase: Map<string, number> = new Map();
  private actionCounts: Map<string, number> = new Map();
  private tagCounts: Map<string, number> = new Map();
  private disabledActions: Map<string, number> = new Map();
  private armsRaceLevel: number = 0;

  constructor() {
    // Initialize with base state
  }

  /**
   * Track player action for AI analysis
   */
  trackAction(actionId: string, tags: string[], phase: number): void {
    // Increment action count
    const currentCount = this.actionCounts.get(actionId) || 0;
    this.actionCounts.set(actionId, currentCount + 1);

    // Increment tag counts
    for (const tag of tags) {
      const tagCount = this.tagCounts.get(tag) || 0;
      this.tagCounts.set(tag, tagCount + 1);
    }

    // Update actor awareness
    for (const actor of this.spawnedActors) {
      const relevantTags = actor.tactics.some(t =>
        tags.includes(t) || this.tacticMatchesTags(t, tags)
      );
      if (relevantTags) {
        const currentAwareness = this.actorAwareness.get(actor.id) || actor.awareness;
        this.actorAwareness.set(actor.id, Math.min(1, currentAwareness + 0.05));
      }
    }
  }

  private tacticMatchesTags(tactic: string, tags: string[]): boolean {
    const tacticToTags: Record<string, string[]> = {
      debunk: ['fake_news', 'conspiracy', 'propaganda'],
      source_verification: ['fake_news', 'bot', 'astroturfing'],
      account_suspension: ['bot', 'amplification', 'harassment'],
      content_removal: ['fake_news', 'harassment', 'doxxing'],
      pattern_analysis: ['bot', 'astroturfing', 'amplification'],
    };
    return tacticToTags[tactic]?.some(t => tags.includes(t)) || false;
  }

  /**
   * Check and spawn new defensive actors based on game state
   */
  checkSpawnConditions(
    phase: number,
    risk: number,
    recentCrisis: boolean
  ): DefensiveActor[] {
    const newSpawns: DefensiveActor[] = [];

    for (const actorDef of DEFENSIVE_ACTORS) {
      // Skip if already spawned
      if (this.spawnedActors.some(a => a.id === actorDef.id)) continue;

      let shouldSpawn = false;

      switch (actorDef.spawnCondition.type) {
        case 'risk_threshold':
          shouldSpawn = risk >= (actorDef.spawnCondition.threshold || 50);
          break;

        case 'phase_trigger':
          shouldSpawn = phase >= (actorDef.spawnCondition.phase || 999);
          break;

        case 'action_count':
          if (actorDef.spawnCondition.actions) {
            const count = actorDef.spawnCondition.actions.reduce(
              (sum, id) => sum + (this.actionCounts.get(id) || 0),
              0
            );
            shouldSpawn = count >= (actorDef.spawnCondition.threshold || 5);
          } else if (actorDef.spawnCondition.tags) {
            const count = actorDef.spawnCondition.tags.reduce(
              (sum, tag) => sum + (this.tagCounts.get(tag) || 0),
              0
            );
            shouldSpawn = count >= (actorDef.spawnCondition.threshold || 5);
          }
          break;

        case 'crisis_response':
          shouldSpawn = recentCrisis;
          break;
      }

      if (shouldSpawn) {
        const spawnedActor = { ...actorDef };
        this.spawnedActors.push(spawnedActor);
        this.actorStrengths.set(spawnedActor.id, spawnedActor.strength);
        this.actorAwareness.set(spawnedActor.id, spawnedActor.awareness);
        newSpawns.push(spawnedActor);

        // Increase arms race level
        this.armsRaceLevel = Math.min(5, this.armsRaceLevel + 0.5);

        console.log(`[StoryActorAI] Spawned: ${spawnedActor.name_en} (Arms Race Level: ${this.armsRaceLevel})`);
      }
    }

    return newSpawns;
  }

  /**
   * Process AI actions for the current phase
   * Returns counter-actions taken by defensive actors
   */
  processPhase(
    phase: number,
    gameState: {
      risk: number;
      attention: number;
      recentActions: string[];
      recentTags: string[];
    }
  ): AIAction[] {
    const actions: AIAction[] = [];

    // Clean up expired disabled actions
    for (const [actionId, expiresPhase] of this.disabledActions.entries()) {
      if (phase >= expiresPhase) {
        this.disabledActions.delete(actionId);
      }
    }

    // Each spawned actor may take action
    for (const actor of this.spawnedActors) {
      const strength = this.actorStrengths.get(actor.id) || actor.strength;
      const awareness = this.actorAwareness.get(actor.id) || actor.awareness;
      const lastAction = this.lastActionPhase.get(actor.id) || 0;

      // Cooldown check (actors don't act every phase)
      const cooldown = Math.max(2, 5 - this.armsRaceLevel);
      if (phase - lastAction < cooldown) continue;

      // Action chance based on awareness and strength
      const actionChance = awareness * strength * (0.3 + this.armsRaceLevel * 0.1);
      if (Math.random() > actionChance) continue;

      // Determine action type based on actor type
      const action = this.generateAction(actor, phase, gameState);
      if (action) {
        actions.push(action);
        this.lastActionPhase.set(actor.id, phase);

        // Actor strength grows after successful actions
        this.actorStrengths.set(actor.id, Math.min(1, strength + 0.05));
      }
    }

    // Natural awareness decay when player is quiet
    if (gameState.recentActions.length === 0) {
      for (const actor of this.spawnedActors) {
        const awareness = this.actorAwareness.get(actor.id) || actor.awareness;
        this.actorAwareness.set(actor.id, Math.max(0.1, awareness - 0.02));
      }
    }

    return actions;
  }

  private generateAction(
    actor: DefensiveActor,
    phase: number,
    gameState: {
      risk: number;
      attention: number;
      recentActions: string[];
      recentTags: string[];
    }
  ): AIAction | null {
    const strength = this.actorStrengths.get(actor.id) || actor.strength;

    switch (actor.type) {
      case 'fact_checker':
        return {
          id: `ai_${actor.id}_${phase}`,
          type: 'counter_narrative',
          source: actor.id,
          strength,
          effects: [
            { type: 'reach_reduction', value: strength * 10 },
            { type: 'attention_increase', value: strength * 5 },
          ],
          news_de: `🔍 ${actor.name_de}: Faktencheck widerlegt virale Falschmeldung`,
          news_en: `🔍 ${actor.name_en}: Fact-check debunks viral misinformation`,
        };

      case 'platform_moderator':
        // May disable certain actions temporarily
        const targetAction = gameState.recentActions[0];
        if (targetAction && Math.random() < strength * 0.5) {
          this.disabledActions.set(targetAction, phase + 3);
          return {
            id: `ai_${actor.id}_${phase}`,
            type: 'platform_action',
            source: actor.id,
            target: targetAction,
            strength,
            effects: [
              { type: 'action_disabled', value: 3, targetActionId: targetAction },
              { type: 'reach_reduction', value: strength * 15 },
            ],
            news_de: `🛡️ ${actor.name_de}: Koordinierte unechte Aktivitäten eingeschränkt`,
            news_en: `🛡️ ${actor.name_en}: Coordinated inauthentic behavior restricted`,
          };
        }
        return null;

      case 'researcher':
        return {
          id: `ai_${actor.id}_${phase}`,
          type: 'exposure',
          source: actor.id,
          strength,
          effects: [
            { type: 'risk_increase', value: strength * 8 },
            { type: 'attention_increase', value: strength * 10 },
          ],
          news_de: `📚 ${actor.name_de}: Neue Studie identifiziert Manipulationsmuster`,
          news_en: `📚 ${actor.name_en}: New study identifies manipulation patterns`,
        };

      case 'watchdog':
        return {
          id: `ai_${actor.id}_${phase}`,
          type: 'investigation',
          source: actor.id,
          strength,
          effects: [
            { type: 'risk_increase', value: strength * 5 },
            { type: 'attention_increase', value: strength * 8 },
          ],
          news_de: `👁️ ${actor.name_de}: Öffentlicher Bericht zu Online-Manipulation`,
          news_en: `👁️ ${actor.name_en}: Public report on online manipulation`,
        };

      case 'investigator':
        if (gameState.risk > 60) {
          return {
            id: `ai_${actor.id}_${phase}`,
            type: 'investigation',
            source: actor.id,
            strength,
            effects: [
              { type: 'risk_increase', value: strength * 15 },
              { type: 'countdown_start', value: 12 }, // Start exposure countdown
            ],
            news_de: `⚖️ ${actor.name_de}: Formelle Ermittlungen eingeleitet`,
            news_en: `⚖️ ${actor.name_en}: Formal investigation launched`,
          };
        }
        return null;

      case 'influencer':
        return {
          id: `ai_${actor.id}_${phase}`,
          type: 'counter_narrative',
          source: actor.id,
          strength,
          effects: [
            { type: 'reach_reduction', value: strength * 12 },
            { type: 'network_boost', value: strength * 5 },
          ],
          news_de: `⭐ ${actor.name_de}: Prominente sprechen sich gegen Falschinformationen aus`,
          news_en: `⭐ ${actor.name_en}: Celebrities speak out against misinformation`,
        };

      case 'citizen_network':
        return {
          id: `ai_${actor.id}_${phase}`,
          type: 'network_boost',
          source: actor.id,
          strength,
          effects: [
            { type: 'network_boost', value: strength * 8 },
            { type: 'reach_reduction', value: strength * 5 },
          ],
          news_de: `👥 ${actor.name_de}: Grassroots-Bewegung wächst`,
          news_en: `👥 ${actor.name_en}: Grassroots movement grows`,
        };

      default:
        return null;
    }
  }

  /**
   * Check if an action is currently disabled by platform moderation
   */
  isActionDisabled(actionId: string, currentPhase: number): boolean {
    const expiresPhase = this.disabledActions.get(actionId);
    if (!expiresPhase) return false;
    return currentPhase < expiresPhase;
  }

  /**
   * Get all currently disabled actions with their reenable phase
   */
  getDisabledActions(): Record<string, number> {
    return Object.fromEntries(this.disabledActions.entries());
  }

  /**
   * Get spawned defensive actors
   */
  getSpawnedActors(): DefensiveActor[] {
    return [...this.spawnedActors];
  }

  /**
   * Get current arms race level (0-5)
   */
  getArmsRaceLevel(): number {
    return this.armsRaceLevel;
  }

  /**
   * Get AI status for display
   */
  getStatus(): {
    armsRaceLevel: number;
    activeDefenders: number;
    threatLevel: 'low' | 'medium' | 'high' | 'critical';
  } {
    let threatLevel: 'low' | 'medium' | 'high' | 'critical';
    if (this.armsRaceLevel >= 4) threatLevel = 'critical';
    else if (this.armsRaceLevel >= 2.5) threatLevel = 'high';
    else if (this.armsRaceLevel >= 1) threatLevel = 'medium';
    else threatLevel = 'low';

    return {
      armsRaceLevel: this.armsRaceLevel,
      activeDefenders: this.spawnedActors.length,
      threatLevel,
    };
  }

  /**
   * Export state for save/load
   */
  exportState(): StoryActorAIState {
    return {
      spawnedActors: this.spawnedActors,
      actorStrengths: Object.fromEntries(this.actorStrengths),
      actorAwareness: Object.fromEntries(this.actorAwareness),
      lastActionPhase: Object.fromEntries(this.lastActionPhase),
      actionCounts: Object.fromEntries(this.actionCounts),
      tagCounts: Object.fromEntries(this.tagCounts),
      disabledActions: Object.fromEntries(this.disabledActions),
      armsRaceLevel: this.armsRaceLevel,
    };
  }

  /**
   * Import state from save
   */
  importState(state: StoryActorAIState): void {
    this.spawnedActors = state.spawnedActors || [];
    this.actorStrengths = new Map(Object.entries(state.actorStrengths || {}));
    this.actorAwareness = new Map(Object.entries(state.actorAwareness || {}));
    this.lastActionPhase = new Map(Object.entries(state.lastActionPhase || {}));
    this.actionCounts = new Map(Object.entries(state.actionCounts || {}));
    this.tagCounts = new Map(Object.entries(state.tagCounts || {}));
    this.disabledActions = new Map(Object.entries(state.disabledActions || {}));
    this.armsRaceLevel = state.armsRaceLevel || 0;
  }

  /**
   * Reset system
   */
  reset(): void {
    this.spawnedActors = [];
    this.actorStrengths.clear();
    this.actorAwareness.clear();
    this.lastActionPhase.clear();
    this.actionCounts.clear();
    this.tagCounts.clear();
    this.disabledActions.clear();
    this.armsRaceLevel = 0;
  }
}

// Singleton instance
let storyActorAIInstance: StoryActorAI | null = null;

export function getStoryActorAI(): StoryActorAI {
  if (!storyActorAIInstance) {
    storyActorAIInstance = new StoryActorAI();
  }
  return storyActorAIInstance;
}

export function resetStoryActorAI(): void {
  if (storyActorAIInstance) {
    storyActorAIInstance.reset();
  }
  storyActorAIInstance = null;
}
