import type {
  Actor,
  ActorCategory,
  Ability,
  Effect,
  Network,
  GameState,
  GamePhase,
  DefeatReason,
  GameEvent,
  NetworkMetrics,
  Position,
  ActorDefinition,
  AbilityResult,
  VisualEffect,
  RiskState,
  DetectionEvent,
  ExposureLevel,
  ActorAction,
  ActorMemory,
  PersonalityTrait,
} from './types';
import { SeededRandom, generateSeedString } from './seed/SeededRandom';
import {
  clamp,
  calculateConnections,
  propagateTrust,
  applyRecovery,
  calculateNetworkMetrics,
  getConnectedActors,
} from '@/utils';

// ============================================
// CONSTANTS
// ============================================

const INITIAL_RESOURCES = 100;
const RESOURCES_PER_ROUND = 20;
const MAX_ROUNDS = 32;
const VICTORY_THRESHOLD = 0.75;  // 75% of actors
const VICTORY_TRUST_LEVEL = 0.4; // Below 40% trust
const DEFENSIVE_VICTORY_TRUST = 0.7; // Above 70% average
const DEFENSIVE_SPAWN_INTERVAL = 8; // Every 8 rounds
const MAX_DEFENSIVE_ACTORS = 3;
const RANDOM_EVENT_CHANCE = 0.3;

// Sprint 2: Risk system constants
const BASE_DETECTION_CHANCE = 0.08;    // 8% base detection per ability
const EXPOSURE_GROWTH_PER_USE = 0.02;  // +2% detection per same ability use
const BACKLASH_TRUST_RESTORE = 0.05;   // 5% trust restored on detection
const EXPOSURE_DECAY_PER_ROUND = 0.01; // 1% exposure decay per round

// Ability-specific risk modifiers
const ABILITY_RISK_MODIFIERS: Record<string, number> = {
  'astroturfing': 0.15,        // High risk - easily detected
  'create_bot_army': 0.20,     // Very high risk
  'scandalize': 0.10,          // Medium-high risk
  'conspiracy_framing': 0.12,  // Medium-high risk
  'sow_doubt': 0.03,           // Low risk - subtle
  'agenda_setting': 0.05,      // Low risk - common tactic
  'emotional_appeal': 0.04,    // Low risk
};

// Sprint 3: Personality traits by category
const CATEGORY_PERSONALITIES: Record<ActorCategory, {
  trait: PersonalityTrait;
  retaliationChance: number;
  allianceSeekChance: number;
  grudgeDecay: number;
}> = {
  media: { trait: 'aggressive', retaliationChance: 0.4, allianceSeekChance: 0.2, grudgeDecay: 0.15 },
  expert: { trait: 'defensive', retaliationChance: 0.2, allianceSeekChance: 0.5, grudgeDecay: 0.1 },
  lobby: { trait: 'vindictive', retaliationChance: 0.5, allianceSeekChance: 0.3, grudgeDecay: 0.05 },
  organization: { trait: 'influential', retaliationChance: 0.15, allianceSeekChance: 0.4, grudgeDecay: 0.2 },
  defensive: { trait: 'defensive', retaliationChance: 0.3, allianceSeekChance: 0.6, grudgeDecay: 0.25 },
};

// Sprint 3: Actor action narratives
const ACTION_NARRATIVES: Record<string, string[]> = {
  retaliate: [
    '{source} publishes a counter-investigation targeting the attacker.',
    '{source} releases damaging information in response.',
    '{source} strikes back with a public statement.',
  ],
  seek_ally: [
    '{source} reaches out to {target} for support.',
    '{source} forms an alliance with {target}.',
    '{source} and {target} issue a joint statement of solidarity.',
  ],
  defend: [
    '{source} increases security measures.',
    '{source} publishes a fact-check defending their reputation.',
    '{source} strengthens their position with evidence.',
  ],
  influence: [
    '{source} extends influence over {target}.',
    '{source} convinces {target} to support their narrative.',
  ],
};

// ============================================
// GAME STATE CLASS
// ============================================

export class GameStateManager {
  private state: GameState;
  private rng: SeededRandom;
  private actorDefinitions: ActorDefinition[] = [];
  private abilityDefinitions: Ability[] = [];
  private eventDefinitions: GameEvent[] = [];

  // Sprint 3: Actor memory and actions
  private actorMemory: Map<string, ActorMemory[]> = new Map();
  private lastRoundActions: ActorAction[] = [];

  constructor(seed?: string) {
    const gameSeed = seed || generateSeedString();
    this.rng = new SeededRandom(gameSeed);
    this.state = this.createInitialState(gameSeed);
  }
  
  // ============================================
  // INITIALIZATION
  // ============================================
  
  /**
   * Create initial game state
   */
  private createInitialState(seed: string): GameState {
    return {
      phase: 'start',
      round: 0,
      maxRounds: MAX_ROUNDS,
      resources: INITIAL_RESOURCES,
      network: {
        actors: [],
        connections: [],
        averageTrust: 0,
        polarizationIndex: 0,
      },
      abilityUsage: {},
      eventsTriggered: [],
      defensiveActorsSpawned: 0,
      // Sprint 2: Risk system
      riskState: {
        exposure: 0,
        exposureLevel: 'hidden',
        detectionHistory: [],
        abilityRiskModifiers: {},
      },
      history: [],
      seed,
    };
  }
  
  /**
   * Load game definitions from JSON
   */
  loadDefinitions(
    actors: ActorDefinition[],
    abilities: Ability[],
    events: GameEvent[]
  ): void {
    this.actorDefinitions = actors;
    this.abilityDefinitions = abilities;
    this.eventDefinitions = events;
  }
  
  /**
   * Create initial network from definitions
   */
  createInitialNetwork(): void {
    if (this.actorDefinitions.length === 0) {
      console.warn('No actor definitions loaded');
      return;
    }
    
    const actors: Actor[] = this.actorDefinitions.map(def => {
      // Generate position with some randomness
      const position = this.rng.nextPosition(100, 700, 100, 500);
      
      // Vary initial trust slightly
      const trust = clamp(
        def.baseTrust + this.rng.vary(0, 0.05),
        0,
        1
      );
      
      return {
        ...def,
        trust,
        position,
        activeEffects: [],
        cooldowns: {},
      };
    });
    
    const connections = calculateConnections(actors);
    const metrics = calculateNetworkMetrics({ actors, connections, averageTrust: 0, polarizationIndex: 0 });
    
    this.state.network = {
      actors,
      connections,
      averageTrust: metrics.averageTrust,
      polarizationIndex: metrics.polarizationIndex,
    };
  }
  
  /**
   * Start the game
   */
  startGame(): void {
    if (this.state.network.actors.length === 0) {
      this.createInitialNetwork();
    }
    this.state.phase = 'playing';
    this.state.round = 1;
    this.saveSnapshot();
  }
  
  // ============================================
  // GETTERS
  // ============================================
  
  getState(): GameState {
    return this.state;
  }
  
  getActor(actorId: string): Actor | undefined {
    return this.state.network.actors.find(a => a.id === actorId);
  }
  
  getAbility(abilityId: string): Ability | undefined {
    return this.abilityDefinitions.find(a => a.id === abilityId);
  }
  
  getActorAbilities(actorId: string): Ability[] {
    const actor = this.getActor(actorId);
    if (!actor) return [];
    
    return actor.abilities
      .map(id => this.getAbility(id))
      .filter((a): a is Ability => a !== undefined);
  }
  
  getNetworkMetrics(): NetworkMetrics {
    return calculateNetworkMetrics(this.state.network);
  }
  
  // ============================================
  // ABILITY SYSTEM
  // ============================================
  
  /**
   * Check if an ability can be used
   */
  canUseAbility(abilityId: string, sourceActorId: string): boolean {
    const ability = this.getAbility(abilityId);
    const actor = this.getActor(sourceActorId);
    
    if (!ability || !actor) return false;
    
    // Check if actor has this ability
    if (!actor.abilities.includes(abilityId)) return false;
    
    // Check cooldown
    const cooldown = actor.cooldowns[abilityId] || 0;
    if (cooldown > 0) return false;
    
    // Check resources
    if (this.state.resources < ability.resourceCost) return false;
    
    return true;
  }
  
  /**
   * Get valid targets for an ability
   */
  getValidTargets(abilityId: string, sourceActorId: string): Actor[] {
    const ability = this.getAbility(abilityId);
    if (!ability) return [];
    
    const { actors, connections } = this.state.network;
    
    switch (ability.targetType) {
      case 'single':
        // Can target any actor except self
        return actors.filter(a => a.id !== sourceActorId);
        
      case 'adjacent':
        // Can only target connected actors
        return getConnectedActors(sourceActorId, actors, connections);
        
      case 'category':
        // Target all actors of a specific category
        return actors.filter(a => 
          a.category === ability.targetCategory && 
          a.id !== sourceActorId
        );
        
      case 'network':
        // Affects entire network (no targeting needed)
        return [];
        
      default:
        return [];
    }
  }
  
  /**
   * Apply an ability and return detailed result with visual effects
   */
  applyAbility(
    abilityId: string,
    sourceActorId: string,
    targetActorIds: string[]
  ): AbilityResult | null {
    if (!this.canUseAbility(abilityId, sourceActorId)) {
      return null;
    }

    const ability = this.getAbility(abilityId);
    const sourceActor = this.getActor(sourceActorId);
    if (!ability || !sourceActor) return null;

    // Store trust values BEFORE applying effects
    const trustBefore: Record<string, number> = {};
    for (const actor of this.state.network.actors) {
      trustBefore[actor.id] = actor.trust;
    }

    // Spend resources
    this.state.resources -= ability.resourceCost;

    // Track usage for diminishing returns
    this.state.abilityUsage[abilityId] =
      (this.state.abilityUsage[abilityId] || 0) + 1;

    // Set cooldown
    this.updateActorCooldown(sourceActorId, abilityId, ability.cooldown);

    // Apply effects to targets
    const usageCount = this.state.abilityUsage[abilityId];
    const affectedActorIds: string[] = [];

    if (ability.targetType === 'network') {
      // Network-wide effect
      this.applyNetworkEffect(ability, usageCount);
      affectedActorIds.push(...this.state.network.actors.map(a => a.id));
    } else {
      // Targeted effect
      for (const targetId of targetActorIds) {
        this.applyTargetedEffect(ability, sourceActor, targetId, usageCount);
        affectedActorIds.push(targetId);
      }
    }

    // Propagate if ability propagates
    if (ability.effects.propagates) {
      const propagatedIds = this.propagateEffectAndTrack(ability, targetActorIds, usageCount);
      affectedActorIds.push(...propagatedIds);
    }

    // Update network metrics
    this.updateNetworkMetrics();

    // Calculate effects and generate visual effects
    const effects: AbilityResult['effects'] = [];
    const visualEffects: VisualEffect[] = [];
    const now = Date.now();

    for (const actorId of [...new Set(affectedActorIds)]) {
      const actor = this.getActor(actorId);
      if (!actor) continue;

      const before = trustBefore[actorId];
      const after = actor.trust;
      const delta = after - before;

      if (Math.abs(delta) > 0.001) {
        effects.push({
          actorId,
          trustBefore: before,
          trustAfter: after,
          trustDelta: delta,
        });

        // Generate impact number visual effect
        visualEffects.push({
          id: `impact_${actorId}_${now}`,
          type: 'impact_number',
          targetActorId: actorId,
          sourceActorId,
          value: delta,
          color: delta < 0 ? '#EF4444' : '#22C55E',
          startTime: now,
          duration: 1500,
          label: `${delta > 0 ? '+' : ''}${Math.round(delta * 100)}%`,
        });

        // Generate pulse effect
        visualEffects.push({
          id: `pulse_${actorId}_${now}`,
          type: 'trust_pulse',
          targetActorId: actorId,
          color: ability.animationColor || '#3B82F6',
          startTime: now,
          duration: 800,
        });

        // Check if actor just became "controlled" (below 40%)
        if (before >= 0.4 && after < 0.4) {
          visualEffects.push({
            id: `controlled_${actorId}_${now}`,
            type: 'controlled',
            targetActorId: actorId,
            color: '#EF4444',
            startTime: now,
            duration: 2000,
            label: 'CONTROLLED!',
          });
        }
      }
    }

    // Add beam effect from source to primary targets
    for (const targetId of targetActorIds) {
      visualEffects.push({
        id: `beam_${sourceActorId}_${targetId}_${now}`,
        type: 'ability_beam',
        targetActorId: targetId,
        sourceActorId,
        color: ability.animationColor || '#3B82F6',
        startTime: now,
        duration: 600,
      });
    }

    // Add propagation wave if ability propagates
    if (ability.effects.propagates) {
      for (const targetId of targetActorIds) {
        visualEffects.push({
          id: `wave_${targetId}_${now}`,
          type: 'propagation_wave',
          targetActorId: targetId,
          color: ability.animationColor || '#3B82F6',
          startTime: now + 300, // Delayed start after beam
          duration: 1000,
        });
      }
    }

    // Sprint 2: Calculate detection risk
    const detectionResult = this.calculateDetection(abilityId, usageCount);
    let backlashApplied = false;

    if (detectionResult.detected) {
      // Apply backlash - restore some trust to all actors
      backlashApplied = true;
      for (const actor of this.state.network.actors) {
        this.updateActor(actor.id, {
          trust: clamp(actor.trust + BACKLASH_TRUST_RESTORE, 0, 1),
        });
      }

      // Add detection visual effect
      visualEffects.push({
        id: `detection_${now}`,
        type: 'celebration', // Reuse celebration for detection alert
        targetActorId: targetActorIds[0] || sourceActorId,
        color: '#F59E0B', // Warning orange
        startTime: now,
        duration: 2000,
        label: '⚠️ DETECTED!',
      });

      // Record detection event
      this.state.riskState.detectionHistory.push({
        round: this.state.round,
        abilityId,
        wasDetected: true,
        exposureGained: detectionResult.exposureGained,
        backlashTrust: BACKLASH_TRUST_RESTORE * this.state.network.actors.length,
      });
    }

    // Update exposure
    this.state.riskState.exposure = clamp(
      this.state.riskState.exposure + detectionResult.exposureGained,
      0,
      1
    );
    this.updateExposureLevel();

    // Track ability-specific risk modifier increase
    this.state.riskState.abilityRiskModifiers[abilityId] =
      (this.state.riskState.abilityRiskModifiers[abilityId] || 0) + EXPOSURE_GROWTH_PER_USE;

    // Sprint 3: Record attacks in actor memory
    for (const effect of effects) {
      if (effect.trustDelta < 0) {
        this.recordAttack(effect.actorId, sourceActorId, Math.abs(effect.trustDelta));
      }
    }

    return {
      success: true,
      abilityId,
      sourceActorId,
      targetActorIds,
      effects,
      resourcesSpent: ability.resourceCost,
      visualEffects,
      detected: detectionResult.detected,
      exposureGained: detectionResult.exposureGained,
      backlashApplied,
    };
  }

  /**
   * Sprint 3: Record an attack in actor's memory
   */
  private recordAttack(victimId: string, attackerId: string, magnitude: number): void {
    const memory = this.actorMemory.get(victimId) || [];
    memory.push({
      actorId: attackerId,
      action: 'attacked',
      round: this.state.round,
      magnitude,
    });
    this.actorMemory.set(victimId, memory);
  }

  /**
   * Sprint 2: Calculate detection probability and result
   */
  private calculateDetection(abilityId: string, usageCount: number): {
    detected: boolean;
    exposureGained: number;
  } {
    // Base detection chance
    let detectionChance = BASE_DETECTION_CHANCE;

    // Add ability-specific modifier
    detectionChance += ABILITY_RISK_MODIFIERS[abilityId] || 0;

    // Add accumulated risk from previous uses
    detectionChance += this.state.riskState.abilityRiskModifiers[abilityId] || 0;

    // Add exposure-based modifier (higher exposure = higher detection)
    detectionChance += this.state.riskState.exposure * 0.1;

    // Roll for detection
    const detected = this.rng.nextBool(clamp(detectionChance, 0, 0.5)); // Cap at 50%

    // Calculate exposure gain
    const exposureGained = detected
      ? EXPOSURE_GROWTH_PER_USE * 2 // Double exposure on detection
      : EXPOSURE_GROWTH_PER_USE * 0.5; // Small exposure even when not detected

    return { detected, exposureGained };
  }

  /**
   * Sprint 2: Update exposure level based on current exposure
   */
  private updateExposureLevel(): void {
    const exposure = this.state.riskState.exposure;
    let level: ExposureLevel;

    if (exposure < 0.15) {
      level = 'hidden';
    } else if (exposure < 0.35) {
      level = 'suspected';
    } else if (exposure < 0.6) {
      level = 'known';
    } else {
      level = 'exposed';
    }

    this.state.riskState.exposureLevel = level;
  }

  /**
   * Sprint 2: Get current risk state
   */
  getRiskState(): RiskState {
    return this.state.riskState;
  }
  
  /**
   * Calculate effect magnitude with diminishing returns
   */
  private calculateEffectMagnitude(
    ability: Ability,
    target: Actor,
    usageCount: number
  ): number {
    let effect = ability.effects.trustDelta;
    
    // Resilience reduction
    effect *= (1 - target.resilience * 0.5);
    
    // Vulnerability bonus
    if (ability.basedOn.some(t => target.vulnerabilities.includes(t))) {
      effect *= 1.3; // 30% more effective
    }
    
    // Resistance penalty
    if (ability.basedOn.some(t => target.resistances.includes(t))) {
      effect *= 0.7; // 30% less effective
    }
    
    // Diminishing returns
    effect *= Math.pow(ability.diminishingFactor, usageCount - 1);
    
    // Emotional state modifier
    if (ability.effects.emotionalDelta && ability.effects.emotionalDelta > 0) {
      effect *= (1 + target.emotionalState * 0.2);
    }
    
    return effect;
  }
  
  /**
   * Apply effect to a single target
   */
  private applyTargetedEffect(
    ability: Ability,
    source: Actor,
    targetId: string,
    usageCount: number
  ): void {
    const target = this.getActor(targetId);
    if (!target) return;
    
    const trustDelta = this.calculateEffectMagnitude(ability, target, usageCount);
    
    // Update actor
    this.updateActor(targetId, {
      trust: clamp(target.trust + trustDelta, 0, 1),
      emotionalState: ability.effects.emotionalDelta
        ? clamp(target.emotionalState + ability.effects.emotionalDelta, 0, 1)
        : target.emotionalState,
      resilience: ability.effects.resilienceDelta
        ? clamp(target.resilience + ability.effects.resilienceDelta, 0, 1)
        : target.resilience,
    });
    
    // Add effect if it has duration
    if (ability.effects.duration && ability.effects.duration > 0) {
      this.addEffect({
        id: `${ability.id}_${targetId}_${Date.now()}`,
        type: 'trust_delta',
        targetActorId: targetId,
        value: trustDelta * 0.1, // Ongoing effect is smaller
        duration: ability.effects.duration,
        sourceAbilityId: ability.id,
        sourceActorId: source.id,
        appliedAtRound: this.state.round,
      });
    }
  }
  
  /**
   * Apply network-wide effect
   */
  private applyNetworkEffect(ability: Ability, usageCount: number): void {
    for (const actor of this.state.network.actors) {
      const trustDelta = this.calculateEffectMagnitude(ability, actor, usageCount);
      this.updateActor(actor.id, {
        trust: clamp(actor.trust + trustDelta, 0, 1),
      });
    }
  }
  
  /**
   * Propagate effect to connected actors
   */
  private propagateEffect(
    ability: Ability,
    sourceActorIds: string[],
    usageCount: number
  ): void {
    this.propagateEffectAndTrack(ability, sourceActorIds, usageCount);
  }

  /**
   * Propagate effect to connected actors and return affected IDs
   */
  private propagateEffectAndTrack(
    ability: Ability,
    sourceActorIds: string[],
    usageCount: number
  ): string[] {
    const { actors, connections } = this.state.network;
    const affectedIds: string[] = [];

    for (const sourceId of sourceActorIds) {
      const connected = getConnectedActors(sourceId, actors, connections);

      for (const target of connected) {
        // Reduced effect for propagation
        const trustDelta = this.calculateEffectMagnitude(ability, target, usageCount) * 0.5;
        this.updateActor(target.id, {
          trust: clamp(target.trust + trustDelta, 0, 1),
        });
        affectedIds.push(target.id);
      }
    }

    return affectedIds;
  }
  
  // ============================================
  // ROUND PROGRESSION
  // ============================================
  
  /**
   * Advance to next round
   */
  advanceRound(): void {
    if (this.state.phase !== 'playing') return;
    
    // Save snapshot for undo
    this.saveSnapshot();
    
    // 1. Propagate trust through network
    this.state.network.actors = propagateTrust(
      this.state.network.actors,
      this.state.network.connections
    );
    
    // 2. Apply recovery
    this.state.network.actors = applyRecovery(this.state.network.actors);
    
    // 3. Process ongoing effects
    this.processEffects();
    
    // 4. Decrement cooldowns
    this.decrementCooldowns();
    
    // 5. Trigger random events
    if (this.rng.nextBool(RANDOM_EVENT_CHANCE)) {
      this.triggerRandomEvent();
    }
    
    // 6. Check conditional events
    this.checkConditionalEvents();
    
    // 7. Add resources
    const resourceBonus = this.calculateResourceBonus();
    this.state.resources += RESOURCES_PER_ROUND + resourceBonus;
    
    // 8. Check for defensive spawns
    if (this.state.round % DEFENSIVE_SPAWN_INTERVAL === 0) {
      this.checkDefensiveSpawn();
    }

    // 9. Sprint 2: Decay exposure over time
    this.state.riskState.exposure = clamp(
      this.state.riskState.exposure - EXPOSURE_DECAY_PER_ROUND,
      0,
      1
    );
    this.updateExposureLevel();

    // 10. Sprint 3: Process actor autonomous actions
    this.processActorActions();

    // 11. Sprint 3: Decay actor memory (grudges fade)
    this.decayActorMemory();

    // 12. Update network metrics
    this.updateNetworkMetrics();

    // 13. Increment round
    this.state.round++;

    // 14. Check win/lose conditions
    this.checkGameEnd();
  }

  /**
   * Sprint 3: Process autonomous actor actions
   */
  private processActorActions(): void {
    this.lastRoundActions = [];

    for (const actor of this.state.network.actors) {
      const memory = this.actorMemory.get(actor.id) || [];
      const recentAttacks = memory.filter(m => m.action === 'attacked' && m.round >= this.state.round - 2);

      if (recentAttacks.length === 0) continue;

      const personality = CATEGORY_PERSONALITIES[actor.category];
      const totalGrudge = recentAttacks.reduce((sum, m) => sum + m.magnitude, 0);

      // Check for retaliation
      if (this.rng.nextBool(personality.retaliationChance * Math.min(totalGrudge * 2, 1))) {
        const action = this.createRetaliationAction(actor, recentAttacks);
        if (action) {
          this.executeActorAction(action);
          this.lastRoundActions.push(action);
        }
      }
      // Check for alliance seeking
      else if (this.rng.nextBool(personality.allianceSeekChance * Math.min(totalGrudge, 1))) {
        const action = this.createAllianceAction(actor);
        if (action) {
          this.executeActorAction(action);
          this.lastRoundActions.push(action);
        }
      }
      // Check for defensive action
      else if (totalGrudge > 0.2 && this.rng.nextBool(0.3)) {
        const action = this.createDefenseAction(actor);
        this.executeActorAction(action);
        this.lastRoundActions.push(action);
      }
    }
  }

  /**
   * Sprint 3: Create retaliation action
   */
  private createRetaliationAction(actor: Actor, attacks: ActorMemory[]): ActorAction | null {
    // For now, retaliation affects the network positively (actors fight back)
    const narratives = ACTION_NARRATIVES.retaliate;
    const narrative = this.rng.pick(narratives)?.replace('{source}', actor.name) || '';

    return {
      type: 'retaliate',
      sourceActorId: actor.id,
      effect: {
        trustDelta: 0.03, // Small trust recovery from fighting back
      },
      narrative,
    };
  }

  /**
   * Sprint 3: Create alliance action
   */
  private createAllianceAction(actor: Actor): ActorAction | null {
    // Find a potential ally (same category, high trust)
    const potentialAllies = this.state.network.actors.filter(
      a => a.id !== actor.id && a.category === actor.category && a.trust > 0.5
    );

    if (potentialAllies.length === 0) return null;

    const ally = this.rng.pick(potentialAllies);
    if (!ally) return null;

    const narratives = ACTION_NARRATIVES.seek_ally;
    const narrative = this.rng.pick(narratives)
      ?.replace('{source}', actor.name)
      .replace('{target}', ally.name) || '';

    return {
      type: 'seek_ally',
      sourceActorId: actor.id,
      targetActorId: ally.id,
      effect: {
        trustDelta: 0.02, // Both gain trust
      },
      narrative,
    };
  }

  /**
   * Sprint 3: Create defense action
   */
  private createDefenseAction(actor: Actor): ActorAction {
    const narratives = ACTION_NARRATIVES.defend;
    const narrative = this.rng.pick(narratives)?.replace('{source}', actor.name) || '';

    return {
      type: 'defend',
      sourceActorId: actor.id,
      effect: {
        trustDelta: 0.02,
      },
      narrative,
    };
  }

  /**
   * Sprint 3: Execute an actor action
   */
  private executeActorAction(action: ActorAction): void {
    const actor = this.getActor(action.sourceActorId);
    if (!actor) return;

    // Apply trust change to source
    if (action.effect.trustDelta) {
      this.updateActor(actor.id, {
        trust: clamp(actor.trust + action.effect.trustDelta, 0, 1),
      });
    }

    // Apply to target if exists
    if (action.targetActorId && action.effect.trustDelta) {
      const target = this.getActor(action.targetActorId);
      if (target) {
        this.updateActor(target.id, {
          trust: clamp(target.trust + action.effect.trustDelta, 0, 1),
        });
      }
    }
  }

  /**
   * Sprint 3: Decay actor memory over time
   */
  private decayActorMemory(): void {
    for (const [actorId, memory] of this.actorMemory.entries()) {
      const actor = this.getActor(actorId);
      if (!actor) continue;

      const personality = CATEGORY_PERSONALITIES[actor.category];
      const decayedMemory = memory
        .map(m => ({ ...m, magnitude: m.magnitude * (1 - personality.grudgeDecay) }))
        .filter(m => m.magnitude > 0.05); // Remove memories that are too faint

      this.actorMemory.set(actorId, decayedMemory);
    }
  }

  /**
   * Sprint 3: Get last round's actor actions
   */
  getLastRoundActions(): ActorAction[] {
    return this.lastRoundActions;
  }
  
  /**
   * Calculate resource bonus from controlled actors
   */
  private calculateResourceBonus(): number {
    return this.state.network.actors
      .filter(a => a.trust < 0.3) // "Controlled" actors
      .reduce((sum, a) => {
        switch (a.category) {
          case 'media': return sum + 5;
          case 'expert': return sum + 3;
          case 'lobby': return sum + 4;
          case 'organization': return sum + 2;
          default: return sum;
        }
      }, 0);
  }
  
  /**
   * Process ongoing effects
   */
  private processEffects(): void {
    for (const actor of this.state.network.actors) {
      const activeEffects = actor.activeEffects.filter(e => {
        // Apply effect
        if (e.type === 'trust_delta') {
          this.updateActor(actor.id, {
            trust: clamp(actor.trust + e.value, 0, 1),
          });
        }
        
        // Decrement duration
        e.duration--;
        
        // Keep if duration > 0
        return e.duration > 0;
      });
      
      // Update actor's active effects
      this.updateActor(actor.id, { activeEffects });
    }
  }
  
  /**
   * Decrement all ability cooldowns
   */
  private decrementCooldowns(): void {
    for (const actor of this.state.network.actors) {
      const newCooldowns: Record<string, number> = {};
      
      for (const [abilityId, cooldown] of Object.entries(actor.cooldowns)) {
        if (cooldown > 1) {
          newCooldowns[abilityId] = cooldown - 1;
        }
        // If cooldown is 1 or less, don't include it (expired)
      }
      
      this.updateActor(actor.id, { cooldowns: newCooldowns });
    }
  }
  
  // ============================================
  // EVENT SYSTEM
  // ============================================
  
  /**
   * Trigger a random event
   */
  private triggerRandomEvent(): void {
    const randomEvents = this.eventDefinitions.filter(
      e => e.triggerType === 'random' && !this.state.eventsTriggered.includes(e.id)
    );
    
    if (randomEvents.length === 0) return;
    
    // Weighted random selection
    const totalProbability = randomEvents.reduce(
      (sum, e) => sum + (e.probability || 0.1),
      0
    );
    
    let random = this.rng.next() * totalProbability;
    
    for (const event of randomEvents) {
      random -= event.probability || 0.1;
      if (random <= 0) {
        this.applyEvent(event);
        break;
      }
    }
  }
  
  /**
   * Check and trigger conditional events
   */
  private checkConditionalEvents(): void {
    const conditionalEvents = this.eventDefinitions.filter(
      e => e.triggerType === 'conditional' && !this.state.eventsTriggered.includes(e.id)
    );
    
    for (const event of conditionalEvents) {
      if (this.evaluateCondition(event.condition)) {
        this.applyEvent(event);
      }
    }
  }
  
  /**
   * Evaluate event condition
   */
  private evaluateCondition(condition?: string): boolean {
    if (!condition) return false;
    
    const metrics = this.getNetworkMetrics();
    
    // Simple condition evaluation
    if (condition.includes('averageTrust < 0.3')) {
      return metrics.averageTrust < 0.3;
    }
    if (condition.includes('polarizationIndex > 0.8')) {
      return metrics.polarizationIndex > 0.8;
    }
    
    return false;
  }
  
  /**
   * Apply event effects
   */
  private applyEvent(event: GameEvent): void {
    this.state.eventsTriggered.push(event.id);
    
    for (const effect of event.effects) {
      switch (effect.type) {
        case 'trust_delta':
          this.applyEventTrustDelta(effect);
          break;
        case 'emotional_delta':
          this.applyEventEmotionalDelta(effect);
          break;
        case 'spawn_defensive':
          this.spawnDefensiveActor(effect.value as string);
          break;
        case 'resource_bonus':
          this.state.resources += effect.value as number;
          break;
      }
    }
  }
  
  private applyEventTrustDelta(effect: { target: string; targetCategory?: ActorCategory; value: number | string }): void {
    const delta = typeof effect.value === 'number' ? effect.value : 0;
    
    if (effect.target === 'all') {
      for (const actor of this.state.network.actors) {
        this.updateActor(actor.id, {
          trust: clamp(actor.trust + delta, 0, 1),
        });
      }
    } else if (effect.target === 'category' && effect.targetCategory) {
      for (const actor of this.state.network.actors) {
        if (actor.category === effect.targetCategory) {
          this.updateActor(actor.id, {
            trust: clamp(actor.trust + delta, 0, 1),
          });
        }
      }
    } else if (effect.target === 'random') {
      const actor = this.rng.pick(this.state.network.actors);
      if (actor) {
        this.updateActor(actor.id, {
          trust: clamp(actor.trust + delta, 0, 1),
        });
      }
    }
  }
  
  private applyEventEmotionalDelta(effect: { target: string; value: number | string }): void {
    const delta = typeof effect.value === 'number' ? effect.value : 0;
    
    if (effect.target === 'all') {
      for (const actor of this.state.network.actors) {
        this.updateActor(actor.id, {
          emotionalState: clamp(actor.emotionalState + delta, 0, 1),
        });
      }
    }
  }
  
  // ============================================
  // DEFENSIVE ACTORS
  // ============================================
  
  /**
   * Check if defensive actor should spawn
   */
  private checkDefensiveSpawn(): void {
    if (this.state.defensiveActorsSpawned >= MAX_DEFENSIVE_ACTORS) return;
    
    const metrics = this.getNetworkMetrics();
    
    // Higher chance to spawn if trust is low
    const spawnChance = 0.3 + (0.5 - metrics.averageTrust) * 0.5;
    
    if (this.rng.nextBool(spawnChance)) {
      const types = ['fact_checker', 'media_literacy', 'regulatory'];
      const type = this.rng.pick(types) || 'fact_checker';
      this.spawnDefensiveActor(type);
    }
  }
  
  /**
   * Spawn a defensive actor
   */
  private spawnDefensiveActor(type: string): void {
    const defensiveActors: Record<string, Partial<Actor>> = {
      fact_checker: {
        name: 'Fact Checker',
        baseTrust: 0.85,
        resilience: 0.8,
        abilities: ['fact_check', 'debunk'],
      },
      media_literacy: {
        name: 'Media Literacy Org',
        baseTrust: 0.80,
        resilience: 0.7,
        abilities: ['educate', 'inoculate'],
      },
      regulatory: {
        name: 'Regulatory Body',
        baseTrust: 0.75,
        resilience: 0.9,
        abilities: ['regulate', 'expose'],
      },
    };
    
    const template = defensiveActors[type];
    if (!template) return;
    
    const newActor: Actor = {
      id: `defensive_${type}_${Date.now()}`,
      name: template.name || 'Defensive Actor',
      category: 'defensive',
      trust: template.baseTrust || 0.8,
      baseTrust: template.baseTrust || 0.8,
      resilience: template.resilience || 0.7,
      influenceRadius: 120,
      emotionalState: 0.1,
      recoveryRate: 0.04,
      position: this.rng.nextPosition(150, 650, 150, 450),
      color: '#22C55E',
      size: 50,
      abilities: template.abilities || [],
      activeEffects: [],
      cooldowns: {},
      vulnerabilities: [],
      resistances: ['emotional_appeal', 'scarcity'],
    };
    
    this.state.network.actors.push(newActor);
    this.state.network.connections = calculateConnections(this.state.network.actors);
    this.state.defensiveActorsSpawned++;
  }
  
  // ============================================
  // WIN/LOSE CONDITIONS
  // ============================================
  
  /**
   * Check if game has ended
   */
  private checkGameEnd(): void {
    // Check victory
    if (this.checkVictory()) {
      this.state.phase = 'victory';
      return;
    }
    
    // Check defeat
    const defeatReason = this.checkDefeat();
    if (defeatReason) {
      this.state.phase = 'defeat';
      this.state.defeatReason = defeatReason;
    }
  }
  
  /**
   * Check victory condition
   */
  checkVictory(): boolean {
    const lowTrustActors = this.state.network.actors.filter(
      a => a.trust < VICTORY_TRUST_LEVEL && a.category !== 'defensive'
    );
    const nonDefensiveActors = this.state.network.actors.filter(
      a => a.category !== 'defensive'
    );
    
    return lowTrustActors.length >= nonDefensiveActors.length * VICTORY_THRESHOLD;
  }
  
  /**
   * Check defeat conditions
   */
  checkDefeat(): DefeatReason | null {
    // Time out
    if (this.state.round >= this.state.maxRounds) {
      return 'time_out';
    }
    
    // Defensive victory
    const metrics = this.getNetworkMetrics();
    if (
      metrics.averageTrust > DEFENSIVE_VICTORY_TRUST &&
      this.state.defensiveActorsSpawned > 0
    ) {
      return 'defensive_victory';
    }
    
    return null;
  }
  
  // ============================================
  // HELPER METHODS
  // ============================================
  
  /**
   * Update an actor's properties
   */
  private updateActor(actorId: string, updates: Partial<Actor>): void {
    this.state.network.actors = this.state.network.actors.map(a =>
      a.id === actorId ? { ...a, ...updates } : a
    );
  }
  
  /**
   * Update actor cooldown
   */
  private updateActorCooldown(
    actorId: string,
    abilityId: string,
    cooldown: number
  ): void {
    const actor = this.getActor(actorId);
    if (!actor) return;
    
    this.updateActor(actorId, {
      cooldowns: { ...actor.cooldowns, [abilityId]: cooldown },
    });
  }
  
  /**
   * Add effect to an actor
   */
  private addEffect(effect: Effect): void {
    const actor = this.getActor(effect.targetActorId);
    if (!actor) return;
    
    this.updateActor(effect.targetActorId, {
      activeEffects: [...actor.activeEffects, effect],
    });
  }
  
  /**
   * Update network metrics
   */
  private updateNetworkMetrics(): void {
    const metrics = calculateNetworkMetrics(this.state.network);
    this.state.network.averageTrust = metrics.averageTrust;
    this.state.network.polarizationIndex = metrics.polarizationIndex;
  }
  
  /**
   * Save state snapshot for undo
   */
  private saveSnapshot(): void {
    this.state.history.push({
      round: this.state.round,
      network: JSON.parse(JSON.stringify(this.state.network)),
      resources: this.state.resources,
      timestamp: Date.now(),
    });
    
    // Keep only last 10 snapshots
    if (this.state.history.length > 10) {
      this.state.history.shift();
    }
  }
  
  /**
   * Undo to previous state
   */
  undo(): boolean {
    const snapshot = this.state.history.pop();
    if (!snapshot) return false;
    
    this.state.round = snapshot.round;
    this.state.network = snapshot.network;
    this.state.resources = snapshot.resources;
    
    return true;
  }
  
  /**
   * Reset game
   */
  reset(): void {
    this.rng.reset();
    this.state = this.createInitialState(this.state.seed);
  }
}

// ============================================
// FACTORY FUNCTION
// ============================================

export function createGameState(seed?: string): GameStateManager {
  return new GameStateManager(seed);
}
