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
  EscalationState,
  EscalationLevel,
  VictoryType,
  VictoryDetails,
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

// Escalation constants
const ESCALATION_THRESHOLDS = [0, 0.2, 0.4, 0.6, 0.8, 1.0]; // Level thresholds
const BASE_DEFENSIVE_SPAWN_CHANCE = 0.1;
const ESCALATION_SPAWN_BONUS = 0.15; // +15% per escalation level

// ============================================
// GAME STATE CLASS
// ============================================

export class GameStateManager {
  private state: GameState;
  private rng: SeededRandom;
  private actorDefinitions: ActorDefinition[] = [];
  private abilityDefinitions: Ability[] = [];
  private eventDefinitions: GameEvent[] = [];
  
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
      escalation: {
        level: 0,
        publicAwareness: 0,
        mediaAttention: 0,
        counterMeasures: 0,
        lastEscalationRound: 0,
      },
      abilityUsage: {},
      eventsTriggered: [],
      defensiveActorsSpawned: 0,
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
      case 'any':
      case 'any_actor':
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

      case 'media':
        // Target media actors only
        return actors.filter(a => a.category === 'media' && a.id !== sourceActorId);

      case 'multi_actor':
        // Can target multiple actors (for now, return all as valid)
        return actors.filter(a => a.id !== sourceActorId);

      // No-target ability types (handled immediately in useGameState)
      case 'network':
      case 'self':
      case 'platform':
      case 'creates_new_actor':
      case 'self_and_media':
        return [];

      default:
        console.warn(`Unknown targetType: ${ability.targetType}`);
        return [];
    }
  }
  
  /**
   * Apply an ability
   */
  applyAbility(
    abilityId: string,
    sourceActorId: string,
    targetActorIds: string[]
  ): boolean {
    if (!this.canUseAbility(abilityId, sourceActorId)) {
      return false;
    }
    
    const ability = this.getAbility(abilityId);
    const sourceActor = this.getActor(sourceActorId);
    if (!ability || !sourceActor) return false;
    
    // Spend resources
    this.state.resources -= ability.resourceCost;
    
    // Track usage for diminishing returns
    this.state.abilityUsage[abilityId] = 
      (this.state.abilityUsage[abilityId] || 0) + 1;
    
    // Set cooldown
    this.updateActorCooldown(sourceActorId, abilityId, ability.cooldown);
    
    // Apply effects based on target type
    const usageCount = this.state.abilityUsage[abilityId];

    switch (ability.targetType) {
      case 'network':
        // Network-wide effect - affects all actors
        this.applyNetworkEffect(ability, usageCount);
        break;

      case 'self':
        // Self-targeting - apply effect to source actor
        this.applyTargetedEffect(ability, sourceActor, sourceActorId, usageCount);
        break;

      case 'self_and_media':
        // Apply to self and all media actors
        this.applyTargetedEffect(ability, sourceActor, sourceActorId, usageCount);
        const mediaActors = this.state.network.actors.filter(a => a.category === 'media');
        for (const media of mediaActors) {
          this.applyTargetedEffect(ability, sourceActor, media.id, usageCount);
        }
        break;

      case 'platform':
        // Platform effect - affects actors using the platform
        // For now, treat like network effect with reduced magnitude
        this.applyNetworkEffect(ability, usageCount);
        break;

      case 'creates_new_actor':
        // TODO: Implement new actor creation
        // For now, just log and apply a network effect
        console.log(`Creating new actor via ability: ${ability.name}`);
        this.applyNetworkEffect(ability, usageCount);
        break;

      default:
        // Standard targeted effect
        for (const targetId of targetActorIds) {
          this.applyTargetedEffect(ability, sourceActor, targetId, usageCount);
        }
    }

    // Propagate if ability propagates (not for self-only abilities)
    if (ability.effects.propagates && ability.targetType !== 'self') {
      const propagateTargets = ability.targetType === 'self_and_media'
        ? this.state.network.actors.filter(a => a.category === 'media').map(a => a.id)
        : targetActorIds;
      this.propagateEffect(ability, propagateTargets, usageCount);
    }

    // Update escalation based on ability aggressiveness
    this.updateEscalation(ability);

    // Update network metrics
    this.updateNetworkMetrics();

    return true;
  }
  
  /**
   * Calculate effect magnitude with diminishing returns
   */
  private calculateEffectMagnitude(
    ability: Ability,
    target: Actor,
    usageCount: number
  ): number {
    // Handle abilities without trustDelta (infrastructure abilities, etc.)
    let effect = ability.effects.trustDelta ?? 0;

    // If no trust effect, return 0
    if (effect === 0) {
      return 0;
    }

    // Resilience reduction
    effect *= (1 - target.resilience * 0.5);

    // Vulnerability bonus
    if (ability.basedOn && ability.basedOn.some(t => target.vulnerabilities.includes(t))) {
      effect *= 1.3; // 30% more effective
    }

    // Resistance penalty
    if (ability.basedOn && ability.basedOn.some(t => target.resistances.includes(t))) {
      effect *= 0.7; // 30% less effective
    }

    // Diminishing returns
    if (ability.diminishingFactor) {
      effect *= Math.pow(ability.diminishingFactor, usageCount - 1);
    }

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
    const { actors, connections } = this.state.network;
    
    for (const sourceId of sourceActorIds) {
      const connected = getConnectedActors(sourceId, actors, connections);
      
      for (const target of connected) {
        // Reduced effect for propagation
        const trustDelta = this.calculateEffectMagnitude(ability, target, usageCount) * 0.5;
        this.updateActor(target.id, {
          trust: clamp(target.trust + trustDelta, 0, 1),
        });
      }
    }
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

    // 5. Decay escalation naturally
    this.decayEscalation();

    // 6. Trigger random events (higher chance at high escalation)
    const eventChance = RANDOM_EVENT_CHANCE + (this.state.escalation.level * 0.05);
    if (this.rng.nextBool(eventChance)) {
      this.triggerRandomEvent();
    }

    // 7. Check conditional events
    this.checkConditionalEvents();

    // 8. Add resources
    const resourceBonus = this.calculateResourceBonus();
    this.state.resources += RESOURCES_PER_ROUND + resourceBonus;

    // 9. Check for defensive spawns (every 8 rounds or at high escalation)
    if (this.state.round % DEFENSIVE_SPAWN_INTERVAL === 0 ||
        (this.state.escalation.level >= 3 && this.rng.nextBool(0.2))) {
      this.checkDefensiveSpawn();
    }

    // 10. Process defensive actor auto-abilities
    this.processDefensiveActions();

    // 11. Update network metrics
    this.updateNetworkMetrics();

    // 12. Increment round
    this.state.round++;

    // 13. Check win/lose conditions
    this.checkGameEnd();
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

    // Escalation-based spawn chance + trust-based modifier
    const baseChance = this.getDefensiveSpawnChance();
    const trustModifier = (0.5 - metrics.averageTrust) * 0.3;
    const spawnChance = baseChance + trustModifier;

    if (this.rng.nextBool(spawnChance)) {
      // Higher escalation = stronger defensive actors
      const types = this.state.escalation.level >= 3
        ? ['regulatory', 'fact_checker', 'media_literacy']
        : ['fact_checker', 'media_literacy', 'regulatory'];
      const type = this.rng.pick(types) || 'fact_checker';
      this.spawnDefensiveActor(type);

      // Track counter-measures in escalation
      this.state.escalation.counterMeasures++;
    }
  }
  
  /**
   * Process defensive actor auto-actions
   */
  private processDefensiveActions(): void {
    const defensiveActors = this.state.network.actors.filter(a => a.category === 'defensive');
    if (defensiveActors.length === 0) return;

    const metrics = this.getNetworkMetrics();

    for (const defender of defensiveActors) {
      // Get available abilities (not on cooldown)
      const availableAbilities = defender.abilities
        .map(id => this.getAbility(id))
        .filter((a): a is Ability => a !== undefined && (defender.cooldowns[a.id] || 0) === 0);

      for (const ability of availableAbilities) {
        // Check auto-trigger conditions
        const autoTrigger = (ability as any).autoTrigger;
        if (!autoTrigger) continue;

        const shouldTrigger = this.checkAutoTriggerCondition(autoTrigger.condition, defender);
        if (!shouldTrigger) continue;

        // Probability check
        if (!this.rng.nextBool(autoTrigger.probability || 0.5)) continue;

        // Apply the defensive ability
        this.applyDefensiveAbility(ability, defender);

        // Only one ability per defender per round
        break;
      }
    }
  }

  /**
   * Check if auto-trigger condition is met
   */
  private checkAutoTriggerCondition(condition: string, defender: Actor): boolean {
    const metrics = this.getNetworkMetrics();
    const connectedActors = getConnectedActors(defender.id, this.state.network.actors, this.state.network.connections);

    switch (condition) {
      case 'connected_actor_trust_below_40':
        return connectedActors.some(a => a.trust < 0.4);

      case 'network_trust_below_50':
        return metrics.averageTrust < 0.5;

      case 'escalation_level_above_2':
        return this.state.escalation.level > 2;

      case 'escalation_level_above_3':
        return this.state.escalation.level > 3;

      case 'escalation_level_above_4':
        return this.state.escalation.level > 4;

      case 'high_emotional_state':
        return this.state.network.actors.some(a => a.emotionalState > 0.6);

      default:
        return false;
    }
  }

  /**
   * Apply a defensive ability (positive trust effects)
   */
  private applyDefensiveAbility(ability: Ability, defender: Actor): void {
    // Set cooldown
    this.updateActorCooldown(defender.id, ability.id, ability.cooldown);

    const trustDelta = ability.effects.trustDelta ?? 0;
    const resilienceDelta = ability.effects.resilienceDelta ?? 0;
    const emotionalDelta = ability.effects.emotionalDelta ?? 0;

    switch (ability.targetType) {
      case 'single':
      case 'adjacent':
        // Target connected low-trust actors
        const targets = getConnectedActors(defender.id, this.state.network.actors, this.state.network.connections)
          .filter(a => a.trust < 0.5)
          .slice(0, ability.targetType === 'single' ? 1 : 5);

        for (const target of targets) {
          this.updateActor(target.id, {
            trust: clamp(target.trust + trustDelta, 0, 1),
            resilience: clamp(target.resilience + resilienceDelta, 0, 1),
            emotionalState: clamp(target.emotionalState + emotionalDelta, 0, 1),
          });
        }
        break;

      case 'network':
        // Apply to all actors
        for (const actor of this.state.network.actors) {
          if (actor.category !== 'defensive') {
            this.updateActor(actor.id, {
              trust: clamp(actor.trust + trustDelta * 0.5, 0, 1), // Reduced for network
              resilience: clamp(actor.resilience + resilienceDelta, 0, 1),
              emotionalState: clamp(actor.emotionalState + emotionalDelta, 0, 1),
            });
          }
        }
        break;

      case 'category':
        // Apply to specific category
        const categoryActors = this.state.network.actors.filter(
          a => a.category === ability.targetCategory
        );
        for (const actor of categoryActors) {
          this.updateActor(actor.id, {
            trust: clamp(actor.trust + trustDelta, 0, 1),
            resilience: clamp(actor.resilience + resilienceDelta, 0, 1),
          });
        }
        break;
    }

    // Reduce escalation slightly when defensive actions occur
    this.state.escalation.publicAwareness = Math.max(0, this.state.escalation.publicAwareness - 0.02);
    this.state.escalation.mediaAttention = Math.max(0, this.state.escalation.mediaAttention - 0.02);
    this.calculateEscalationLevel();
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
  // ESCALATION SYSTEM
  // ============================================

  /**
   * Update escalation based on ability usage
   */
  private updateEscalation(ability: Ability): void {
    let awarenessIncrease = 0;
    let attentionIncrease = 0;

    // Aggressive abilities increase awareness more
    const trustEffect = ability.effects.trustDelta ?? 0;
    if (trustEffect < -0.15) {
      awarenessIncrease += 0.05;
    } else if (trustEffect < -0.1) {
      awarenessIncrease += 0.03;
    } else if (trustEffect < 0) {
      awarenessIncrease += 0.01;
    }

    // Propagating effects are more noticeable
    if (ability.effects.propagates) {
      attentionIncrease += 0.04;
    }

    // Network-wide effects draw attention
    if (ability.targetType === 'network') {
      attentionIncrease += 0.05;
      awarenessIncrease += 0.03;
    }

    // Category-wide attacks are visible
    if (ability.targetType === 'category') {
      attentionIncrease += 0.03;
    }

    // Update escalation state
    this.state.escalation.publicAwareness = clamp(
      this.state.escalation.publicAwareness + awarenessIncrease,
      0,
      1
    );
    this.state.escalation.mediaAttention = clamp(
      this.state.escalation.mediaAttention + attentionIncrease,
      0,
      1
    );

    // Calculate new level
    this.calculateEscalationLevel();
  }

  /**
   * Calculate escalation level from awareness and attention
   */
  private calculateEscalationLevel(): void {
    const combined = (this.state.escalation.publicAwareness + this.state.escalation.mediaAttention) / 2;

    let newLevel: EscalationLevel = 0;
    for (let i = ESCALATION_THRESHOLDS.length - 1; i >= 0; i--) {
      if (combined >= ESCALATION_THRESHOLDS[i]) {
        newLevel = i as EscalationLevel;
        break;
      }
    }

    // Track when level increased
    if (newLevel > this.state.escalation.level) {
      this.state.escalation.lastEscalationRound = this.state.round;
    }

    this.state.escalation.level = newLevel;
  }

  /**
   * Get defensive spawn chance based on escalation
   */
  private getDefensiveSpawnChance(): number {
    return BASE_DEFENSIVE_SPAWN_CHANCE +
      (this.state.escalation.level * ESCALATION_SPAWN_BONUS);
  }

  /**
   * Natural decay of escalation over time
   */
  private decayEscalation(): void {
    // Small decay per round if no aggressive actions
    const decayRate = 0.01;
    this.state.escalation.publicAwareness = Math.max(
      0,
      this.state.escalation.publicAwareness - decayRate
    );
    this.state.escalation.mediaAttention = Math.max(
      0,
      this.state.escalation.mediaAttention - decayRate
    );
    this.calculateEscalationLevel();
  }

  // ============================================
  // WIN/LOSE CONDITIONS
  // ============================================

  /**
   * Check if game has ended
   */
  private checkGameEnd(): void {
    // Check victory
    const victoryDetails = this.evaluateVictory();
    if (victoryDetails && victoryDetails.type !== 'defeat' && victoryDetails.type !== 'stalemate') {
      this.state.phase = 'victory';
      this.state.victoryDetails = victoryDetails;
      return;
    }

    // Check defeat
    const defeatReason = this.checkDefeat();
    if (defeatReason) {
      this.state.phase = 'defeat';
      this.state.defeatReason = defeatReason;

      // Still store victory details for stats
      if (victoryDetails) {
        this.state.victoryDetails = victoryDetails;
      }
    }
  }

  /**
   * Evaluate victory type and details
   */
  evaluateVictory(): VictoryDetails | null {
    const nonDefensiveActors = this.state.network.actors.filter(
      a => a.category !== 'defensive'
    );
    const lowTrustActors = nonDefensiveActors.filter(
      a => a.trust < VICTORY_TRUST_LEVEL
    );

    const totalActors = nonDefensiveActors.length;
    const compromised = lowTrustActors.length;
    const lowTrustPercent = compromised / totalActors;
    const metrics = this.getNetworkMetrics();

    let victoryType: VictoryType;
    let score = 0;

    // Determine victory type
    if (lowTrustPercent >= 1.0) {
      victoryType = 'complete_victory';
      score = 10000;
    } else if (lowTrustPercent >= VICTORY_THRESHOLD) {
      if (this.state.escalation.level >= 4) {
        victoryType = 'pyrrhic_victory';
        score = 5000;
      } else if (this.state.round <= 24) {
        victoryType = 'strategic_victory';
        score = 8000;
      } else {
        victoryType = 'tactical_victory';
        score = 7000;
      }
    } else if (lowTrustPercent >= 0.5) {
      victoryType = 'partial_success';
      score = 3000;
    } else if (this.state.round >= this.state.maxRounds) {
      victoryType = 'stalemate';
      score = 1000;
    } else {
      victoryType = 'defeat';
      score = 0;
    }

    // Score modifiers
    score += Math.floor((1 - metrics.averageTrust) * 1000);
    score += Math.floor((MAX_ROUNDS - this.state.round) * 50);
    score -= this.state.escalation.level * 200;

    return {
      type: victoryType,
      roundsPlayed: this.state.round,
      finalTrust: metrics.averageTrust,
      actorsCompromised: compromised,
      totalActors,
      escalationLevel: this.state.escalation.level,
      score: Math.max(0, score),
    };
  }

  /**
   * Check simple victory condition (backwards compatible)
   */
  checkVictory(): boolean {
    const details = this.evaluateVictory();
    return details !== null &&
      details.type !== 'defeat' &&
      details.type !== 'stalemate' &&
      details.type !== 'partial_success';
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

    // Exposure at high escalation (new condition)
    if (this.state.escalation.level >= 5 && this.rng.nextBool(0.3)) {
      return 'exposure';
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
