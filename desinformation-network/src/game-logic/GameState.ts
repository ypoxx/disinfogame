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
    const sourceActor = actors.find(a => a.id === sourceActorId);
    if (!sourceActor) return [];

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

      case 'self':
        // Targets self - return source actor for auto-application
        return [sourceActor];

      case 'any_actor':
        // Can target any actor including self
        return actors;

      case 'platform':
      case 'network':
        // Affects platform/network (no specific targeting needed)
        // Return empty array - ability should be auto-applied
        return [];

      default:
        console.warn(`Unknown target type: ${ability.targetType}`);
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
    
    // Apply effects to targets
    const usageCount = this.state.abilityUsage[abilityId];
    
    if (ability.targetType === 'network') {
      // Network-wide effect
      this.applyNetworkEffect(ability, usageCount);
    } else {
      // Targeted effect
      for (const targetId of targetActorIds) {
        this.applyTargetedEffect(ability, sourceActor, targetId, usageCount);
      }
    }
    
    // Propagate if ability propagates
    if (ability.effects.propagates) {
      this.propagateEffect(ability, targetActorIds, usageCount);
    }
    
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
    
    // 9. Update network metrics
    this.updateNetworkMetrics();
    
    // 10. Increment round
    this.state.round++;
    
    // 11. Check win/lose conditions
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
