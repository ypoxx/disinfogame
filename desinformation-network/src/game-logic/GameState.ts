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
  EventEffect,
  NetworkMetrics,
  Position,
  ActorDefinition,
  GameStatistics,
  RoundStatistics,
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
import { calculateSmartConnections } from '@/utils/network/connections';
import { calculateForceLayout, getRecommendedConfig } from '@/utils/network/force-layout';
import { analyzeNetworkTopology } from '@/utils/network/topology-analysis';
import {
  type BalanceConfig,
  type DifficultyLevel,
  DEFAULT_BALANCE_CONFIG,
  getBalanceConfig,
  filterActorsByTiers,
  adjustAbilityCost,
  calculateVictoryConditions,
} from './balance-config';
import {
  type ComboDefinition,
  type ComboActivation,
  updateComboProgress,
  cleanExpiredCombos,
  applyComboBonus,
  getComboStatistics,
} from './combo-system';
import {
  type ReactionTrigger,
  ACTOR_BEHAVIORS,
  updateAwareness,
  generateReaction,
  processActorAI,
  applyReactionEffects,
  shouldSupportAlly,
  supportAlly,
} from './actor-ai';
import {
  startEventChain,
  processEventChains,
  requiresPlayerChoice,
  applyPlayerChoice,
  cleanupExpiredChains,
} from './event-chain-system';

// ============================================
// CONSTANTS (Now using balance config)
// ============================================

// Default to Normal difficulty (58 actors)
const DEFAULT_DIFFICULTY: DifficultyLevel = 'normal';

// Legacy constants for backwards compatibility
// These are now overridden by balance config
const INITIAL_MONEY = 150;
const INITIAL_ATTENTION = 0;
const INITIAL_INFRASTRUCTURE = 0;
const MONEY_PER_ROUND = 30;
const ATTENTION_DECAY_RATE = 0.15;
const DETECTION_THRESHOLD = 0.8;
const EXPOSURE_THRESHOLD = 0.85;
const INFRASTRUCTURE_BONUS_MULTIPLIER = 0.1;
const MAX_ROUNDS = 32;
const VICTORY_THRESHOLD = 0.75;
const VICTORY_TRUST_LEVEL = 0.4;
const DEFENSIVE_VICTORY_TRUST = 0.7;
const DEFENSIVE_SPAWN_INTERVAL = 8;
const MAX_DEFENSIVE_ACTORS = 3;
const RANDOM_EVENT_CHANCE = 0.3;

// ============================================
// RE-EXPORTS
// ============================================

// Re-export for convenience
export type { DifficultyLevel, BalanceConfig } from './balance-config';

// ============================================
// GAME STATE CLASS
// ============================================

export class GameStateManager {
  private state: GameState;
  private rng: SeededRandom;
  private actorDefinitions: ActorDefinition[] = [];
  private abilityDefinitions: Ability[] = [];
  private eventDefinitions: GameEvent[] = [];
  private comboDefinitions: ComboDefinition[] = [];
  private lastTriggeredEvent: GameEvent | null = null;
  private balanceConfig: BalanceConfig;

  constructor(seed?: string, difficulty: DifficultyLevel = DEFAULT_DIFFICULTY) {
    const gameSeed = seed || generateSeedString();
    this.rng = new SeededRandom(gameSeed);
    this.balanceConfig = getBalanceConfig(difficulty);
    this.state = this.createInitialState(gameSeed);
  }
  
  // ============================================
  // INITIALIZATION
  // ============================================
  
  /**
   * Create initial game state
   */
  private createInitialState(seed: string): GameState {
    const config = this.balanceConfig;

    return {
      phase: 'start',
      round: 0,
      maxRounds: config.maxRounds,
      resources: {
        money: config.initialMoney,
        attention: INITIAL_ATTENTION,
        infrastructure: INITIAL_INFRASTRUCTURE,
      },
      detectionRisk: 0,
      network: {
        actors: [],
        connections: [],
        averageTrust: 0,
        polarizationIndex: 0,
      },
      topology: undefined, // NEW: Computed on demand
      abilityUsage: {},
      eventsTriggered: [],
      defensiveActorsSpawned: 0,
      activeCombos: [], // NEW: Combo system
      completedCombos: [], // NEW: Combo system
      actorReactions: [], // NEW: Actor AI
      statistics: this.createInitialStatistics(),
      history: [],
      seed,
    };
  }

  /**
   * Create initial statistics object
   */
  private createInitialStatistics(): GameStatistics {
    return {
      totalRounds: 0,
      victory: false,
      finalTrust: 0,
      totalMoneySpent: 0,
      totalAttentionGenerated: 0,
      infrastructureBuilt: 0,
      peakDetectionRisk: 0,
      totalAbilitiesUsed: 0,
      mostUsedAbility: null,
      mostEffectiveAbility: null,
      mostTargetedActor: null,
      roundHistory: [],
      trustEvolution: [],
      achievements: [],
    };
  }
  
  /**
   * Load game definitions from JSON
   * Filters actors based on balance config tier settings
   */
  loadDefinitions(
    actors: ActorDefinition[],
    abilities: Ability[],
    events: GameEvent[],
    combos: ComboDefinition[] = []
  ): void {
    // Filter actors by tier based on difficulty
    this.actorDefinitions = filterActorsByTiers(actors, this.balanceConfig);
    this.abilityDefinitions = abilities;
    this.eventDefinitions = events;
    this.comboDefinitions = combos;

    console.log(`✅ Loaded ${this.actorDefinitions.length} actors for difficulty: ${this.balanceConfig.actorCount} target`);
    console.log(`✅ Loaded ${this.comboDefinitions.length} combo definitions`);
  }
  
  /**
   * Create initial network from definitions
   * Uses smart connections and force-directed layout for positioning
   */
  createInitialNetwork(): void {
    if (this.actorDefinitions.length === 0) {
      console.warn('No actor definitions loaded');
      return;
    }

    console.log(`🎮 Creating network with ${this.actorDefinitions.length} actors...`);

    // Step 1: Create actors with temporary random positions
    let actors: Actor[] = this.actorDefinitions.map(def => {
      // Temporary position (will be replaced by force layout)
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
        // NEW: Initialize new fields
        awareness: 0,
        renderPriority: def.renderPriority || (def.tier === 1 ? 10 : def.tier === 2 ? 6 : 3),
        velocity: { x: 0, y: 0 }, // For force layout
      };
    });

    // Step 2: Calculate smart connections based on actor relationships
    console.log('🔗 Calculating smart connections...');
    const connections = calculateSmartConnections(actors);
    console.log(`✅ Created ${connections.length} connections`);

    // Step 3: Apply force-directed layout for better positioning
    console.log('📐 Applying force-directed layout...');
    const canvasWidth = 1200;
    const canvasHeight = 800;
    const layoutConfig = getRecommendedConfig(actors.length, canvasWidth, canvasHeight);

    // FIX: Add fixed category positions to align actors with visual circles
    // These match the CATEGORY_POSITIONS_RELATIVE from NetworkVisualization.tsx
    layoutConfig.categoryPositions = {
      media: { x: 0.25 * canvasWidth, y: 0.3 * canvasHeight },
      expert: { x: 0.75 * canvasWidth, y: 0.3 * canvasHeight },
      lobby: { x: 0.25 * canvasWidth, y: 0.7 * canvasHeight },
      organization: { x: 0.75 * canvasWidth, y: 0.7 * canvasHeight },
      defensive: { x: 0.5 * canvasWidth, y: 0.5 * canvasHeight },
    };
    // Increase category clustering strength to keep actors in their circles
    layoutConfig.categoryClusterStrength = 0.02; // Increased from default 0.005

    const layoutResult = calculateForceLayout(actors, connections, layoutConfig);

    // Update actor positions from layout
    actors = layoutResult.actors;
    console.log(`✅ Layout converged in ${layoutResult.iterations} iterations`);

    // Step 4: Calculate network metrics
    const metrics = calculateNetworkMetrics({ actors, connections, averageTrust: 0, polarizationIndex: 0 });

    this.state.network = {
      actors,
      connections,
      averageTrust: metrics.averageTrust,
      polarizationIndex: metrics.polarizationIndex,
    };

    console.log(`✅ Network initialized: ${actors.length} actors, ${connections.length} connections`);

    // PHASE 4.2: Analyze network topology
    this.updateNetworkTopology();
  }

  /**
   * Update network topology analysis (PHASE 4.2)
   * Calculates centrality scores and detects bottlenecks
   */
  private updateNetworkTopology(): void {
    console.log('🔍 Analyzing network topology...');

    const topology = analyzeNetworkTopology(
      this.state.network.actors,
      this.state.network.connections
    );

    this.state.topology = topology;

    // Update actor centrality scores
    this.state.network.actors.forEach(actor => {
      const centrality = topology.centralities.get(actor.id);
      if (centrality) {
        actor.centrality = (centrality.degree + centrality.betweenness + centrality.closeness) / 3;
      }
    });

    // Mark bottleneck actors
    const bottleneckIds = new Set(topology.bottlenecks.map(b => b.actorId));
    this.state.network.actors.forEach(actor => {
      actor.isBottleneck = bottleneckIds.has(actor.id);
    });

    console.log(`✅ Topology analyzed: ${topology.bottlenecks.length} bottlenecks detected`);
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
  // RESOURCE MANAGEMENT (Multi-Resource Economy)
  // ============================================

  /**
   * Check if player has enough resources for an ability
   */
  private hasEnoughResources(cost: import('./types').ResourceCost): boolean {
    const { money = 0, attention = 0, infrastructure = 0 } = cost;
    return (
      this.state.resources.money >= money &&
      this.state.resources.attention <= 100 && // Can always generate attention
      this.state.resources.infrastructure >= infrastructure
    );
  }

  /**
   * Spend resources for an ability
   */
  private spendResources(cost: import('./types').ResourceCost): void {
    const { money = 0, attention = 0, infrastructure = 0 } = cost;
    this.state.resources.money -= money;
    this.state.resources.attention += attention; // Attention increases!
    this.state.resources.infrastructure -= infrastructure;

    // Update detection risk based on attention
    this.state.detectionRisk = Math.min(
      this.state.resources.attention / 100,
      1
    );
  }

  /**
   * Generate resources each round
   */
  private generateRoundResources(): void {
    // Base money income (from balance config)
    let moneyGain = this.balanceConfig.moneyPerRound;

    // Bonus from infrastructure (from balance config)
    const infraBonus = Math.floor(
      this.state.resources.infrastructure * this.balanceConfig.infrastructureBonusMultiplier
    );
    moneyGain += infraBonus;

    // Bonus from controlled actors (low trust)
    const controlledActors = this.state.network.actors.filter(
      a => a.trust < 0.3 && a.category !== 'defensive'
    );
    controlledActors.forEach(actor => {
      switch (actor.category) {
        case 'media':
          moneyGain += 5;
          break;
        case 'expert':
          moneyGain += 3;
          break;
        case 'lobby':
          moneyGain += 4;
          break;
        case 'organization':
          moneyGain += 2;
          break;
      }
    });

    this.state.resources.money += moneyGain;

    // Attention decays naturally (from balance config)
    this.state.resources.attention = Math.max(
      0,
      this.state.resources.attention * (1 - this.balanceConfig.attentionDecayRate)
    );

    // Update detection risk (from balance config)
    this.state.detectionRisk = this.state.resources.attention / 100;
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

  /**
   * Get current balance configuration
   */
  getBalanceConfig(): BalanceConfig {
    return this.balanceConfig;
  }

  /**
   * Get combo definitions
   */
  getComboDefinitions(): ComboDefinition[] {
    return this.comboDefinitions;
  }

  /**
   * Get game statistics
   */
  getStatistics(): GameStatistics {
    return this.state.statistics;
  }

  /**
   * Get last triggered event
   */
  getLastTriggeredEvent(): GameEvent | null {
    return this.lastTriggeredEvent;
  }

  /**
   * Clear last triggered event (after UI has shown it)
   */
  clearLastTriggeredEvent(): void {
    this.lastTriggeredEvent = null;
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

    // Check resources (multi-resource)
    if (!this.hasEnoughResources(ability.resourceCost)) return false;

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

    // Spend resources (multi-resource)
    this.spendResources(ability.resourceCost);

    // Track statistics
    this.trackAbilityUsage(ability, targetActorIds);

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
      // For network-type abilities, propagate from all actors
      // For targeted abilities, propagate from the specific targets
      const propagationSources = ability.targetType === 'network'
        ? this.state.network.actors.map(a => a.id)
        : targetActorIds;

      this.propagateEffect(ability, propagationSources, usageCount);
    }
    
    // Update network metrics
    this.updateNetworkMetrics();

    // PHASE 4: Combo System - Track ability sequences
    if (this.comboDefinitions.length > 0) {
      // Check combo progress for each target
      const comboNotifications: ComboActivation[] = [];

      for (const targetId of targetActorIds) {
        const { newProgress, completedCombos } = updateComboProgress(
          this.state,
          abilityId,
          targetId,
          this.comboDefinitions
        );

        // Update active combos
        this.state.activeCombos = this.state.activeCombos.filter(
          cp => cp.targetActorId !== targetId || newProgress.some(np => np.comboId === cp.comboId)
        );
        this.state.activeCombos.push(...newProgress);

        // Apply completed combo effects
        for (const activation of completedCombos) {
          const comboDef = this.comboDefinitions.find(c => c.id === activation.comboId);
          if (comboDef) {
            applyComboBonus(this.state, activation, comboDef);
            this.state.completedCombos.push(activation.comboId);
            comboNotifications.push(activation);

            console.log(`🎯 COMBO ACTIVATED: ${comboDef.name} on ${this.getActor(targetId)?.name}`);
          }
        }
      }
    }

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

    // PHASE 4.3: Mark last attacked & update awareness
    const manipulationStrength = Math.abs(trustDelta);
    target.lastAttacked = this.state.round;

    const behavior = target.behavior || ACTOR_BEHAVIORS.passive;
    target.awareness = updateAwareness(target, manipulationStrength, behavior);

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

    // PHASE 4.3: Check for actor reactions
    if (manipulationStrength > 0.1) {
      const trigger: ReactionTrigger = {
        type: 'trust_drop',
        severity: manipulationStrength,
      };

      const reaction = generateReaction(target, trigger, this.state);
      if (reaction) {
        this.state.actorReactions.push(reaction);
      }

      // Check for ally support
      const connectedActors = getConnectedActors(targetId, this.state.network.actors, this.state.network.connections);
      connectedActors.forEach(ally => {
        const allyBehavior = ally.behavior || ACTOR_BEHAVIORS.passive;
        if (shouldSupportAlly(ally, target, allyBehavior)) {
          const supportReaction = supportAlly(ally, target, this.state);
          this.state.actorReactions.push(supportReaction);
        }
      });
    }

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

    // 4.5. PHASE 4: Clean up expired combos
    if (this.comboDefinitions.length > 0) {
      this.state.activeCombos = cleanExpiredCombos(this.state, this.comboDefinitions);
    }

    // 5. Trigger random events (from balance config)
    if (this.rng.nextBool(this.balanceConfig.randomEventChance)) {
      this.triggerRandomEvent();
    }

    // 6. Check conditional events
    this.checkConditionalEvents();

    // 6.5. PHASE 4.4: Process event chains
    const chainedEvent = processEventChains(this.state, this.eventDefinitions);
    if (chainedEvent) {
      this.applyEvent(chainedEvent);
    }

    // 6.6. PHASE 4.4: Clean up expired event chains
    cleanupExpiredChains(this.state);

    // 7. Generate resources (multi-resource economy)
    this.generateRoundResources();

    // 8. Check for defensive spawns (from balance config)
    if (this.state.round % this.balanceConfig.defensiveSpawnInterval === 0) {
      this.checkDefensiveSpawn();
    }

    // 8.5. Defensive AI actions
    this.executeDefensiveAI();

    // 9. Update network metrics
    this.updateNetworkMetrics();

    // 9.5. PHASE 4.2: Update network topology (every 4 rounds)
    if (this.state.round % 4 === 0) {
      this.updateNetworkTopology();
    }

    // 9.6. PHASE 4.3: Process actor AI and reactions
    const aiReactions = processActorAI(this.state);
    this.state.actorReactions.push(...aiReactions);

    // Apply all accumulated reactions
    applyReactionEffects(this.state.actorReactions, this.state);

    console.log(`🤖 AI Processing: ${aiReactions.length} spontaneous reactions generated`);

    // 10. Track round statistics
    this.trackRoundStatistics();

    // 11. Increment round
    this.state.round++;

    // 12. Check win/lose conditions
    this.checkGameEnd();
  }

  /**
   * Track statistics for the current round
   */
  private trackRoundStatistics(): void {
    const metrics = this.getNetworkMetrics();
    const roundStats: RoundStatistics = {
      round: this.state.round,
      averageTrust: metrics.averageTrust,
      lowTrustCount: metrics.lowTrustCount,
      resources: { ...this.state.resources },
      detectionRisk: this.state.detectionRisk,
      actionsPerformed: 0, // Will be tracked when abilities are used
      resourcesSpent: 0, // Will be tracked when abilities are used
    };

    // Add to round history
    this.state.statistics.roundHistory.push(roundStats);

    // Track trust evolution
    this.state.statistics.trustEvolution.push({
      round: this.state.round,
      trust: metrics.averageTrust,
    });

    // Update peak detection risk
    if (this.state.detectionRisk > this.state.statistics.peakDetectionRisk) {
      this.state.statistics.peakDetectionRisk = this.state.detectionRisk;
    }

    // Update total rounds
    this.state.statistics.totalRounds = this.state.round;
  }

  /**
   * Track ability usage statistics
   */
  private trackAbilityUsage(ability: Ability, targetIds: string[]): void {
    const stats = this.state.statistics;

    // Track total abilities used
    stats.totalAbilitiesUsed++;

    // Track resource spending
    const cost = ability.resourceCost;
    stats.totalMoneySpent += cost.money || 0;
    stats.totalAttentionGenerated += cost.attention || 0;
    stats.infrastructureBuilt += cost.infrastructure || 0;

    // Track most used ability
    const usageCount = (this.state.abilityUsage[ability.id] || 0) + 1;
    if (!stats.mostUsedAbility || usageCount > stats.mostUsedAbility.timesUsed) {
      stats.mostUsedAbility = {
        id: ability.id,
        name: ability.name,
        timesUsed: usageCount,
      };
    }

    // Update current round stats
    if (stats.roundHistory.length > 0) {
      const currentRound = stats.roundHistory[stats.roundHistory.length - 1];
      if (currentRound.round === this.state.round) {
        currentRound.actionsPerformed++;
        currentRound.resourcesSpent += cost.money || 0;
      }
    }
  }

  /**
   * Calculate achievements based on game statistics
   */
  private calculateAchievements(): string[] {
    const achievements: string[] = [];
    const stats = this.state.statistics;
    const metrics = this.getNetworkMetrics();

    // Speed achievements
    if (stats.totalRounds <= 10 && stats.victory) {
      achievements.push('Lightning Fast: Won in under 10 rounds');
    } else if (stats.totalRounds <= 15 && stats.victory) {
      achievements.push('Quick Campaign: Won in under 15 rounds');
    }

    // Efficiency achievements
    if (stats.totalMoneySpent < 500 && stats.victory) {
      achievements.push('Budget Master: Won spending less than 500 money');
    }

    // Stealth achievements
    if (stats.peakDetectionRisk < 0.5 && stats.victory) {
      achievements.push('Shadow Operator: Kept detection risk below 50%');
    }

    // Domination achievements
    if (metrics.lowTrustCount >= this.state.network.actors.length * 0.9) {
      achievements.push('Total Collapse: Reduced 90% of actors to low trust');
    }

    // Resource achievements
    if (stats.infrastructureBuilt >= 50) {
      achievements.push('Infrastructure King: Built 50+ infrastructure');
    }

    // Ability achievements
    if (stats.totalAbilitiesUsed >= 100) {
      achievements.push('Power User: Used 100+ abilities');
    }

    return achievements;
  }

  /**
   * Finalize statistics at game end
   */
  private finalizeStatistics(victory: boolean): void {
    const stats = this.state.statistics;
    const metrics = this.getNetworkMetrics();
    stats.victory = victory;
    stats.finalTrust = metrics.averageTrust;
    stats.achievements = this.calculateAchievements();

    // Calculate most effective ability
    let mostEffective: { id: string; name: string; avgDelta: number } | null = null;
    for (const [abilityId, timesUsed] of Object.entries(this.state.abilityUsage)) {
      if (timesUsed > 0) {
        const ability = this.getAbility(abilityId);
        if (ability && ability.effects.trustDelta) {
          const avgDelta = Math.abs(ability.effects.trustDelta);
          if (!mostEffective || avgDelta > mostEffective.avgDelta) {
            mostEffective = {
              id: abilityId,
              name: ability.name,
              avgDelta,
            };
          }
        }
      }
    }

    if (mostEffective) {
      stats.mostEffectiveAbility = {
        id: mostEffective.id,
        name: mostEffective.name,
        avgTrustDelta: mostEffective.avgDelta,
      };
    }
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
    const round = this.state.round;
    const detectionRisk = this.state.detectionRisk;
    const lowTrustCount = metrics.lowTrustCount;

    try {
      // Create evaluation context
      const context = {
        averageTrust: metrics.averageTrust,
        polarizationIndex: metrics.polarizationIndex,
        detectionRisk,
        round,
        lowTrustCount,
      };

      // Replace context variables in condition string
      let evalString = condition;
      for (const [key, value] of Object.entries(context)) {
        evalString = evalString.replace(new RegExp(key, 'g'), String(value));
      }

      // Evaluate using Function constructor (safe for known conditions)
      // eslint-disable-next-line no-new-func
      const result = new Function(`return ${evalString}`)();
      return Boolean(result);
    } catch (error) {
      console.warn(`Failed to evaluate condition: ${condition}`, error);
      return false;
    }
  }
  
  /**
   * Apply event effects
   */
  private applyEvent(event: GameEvent): void {
    this.state.eventsTriggered.push(event.id);
    this.lastTriggeredEvent = event; // Store for UI

    // PHASE 4.4: Check if event requires player choice
    if (requiresPlayerChoice(event)) {
      console.log(`❓ Event requires player choice: ${event.name}`);
      this.state.pendingEventChoice = {
        event,
        round: this.state.round,
      };
      // Don't apply effects yet - wait for player choice
      return;
    }

    // Apply effects immediately
    this.applyEventEffects(event.effects);

    // PHASE 4.4: Start event chain if applicable
    startEventChain(this.state, event);
  }

  /**
   * Apply event effects (extracted for reuse with player choices)
   */
  private applyEventEffects(effects: EventEffect[]): void {
    for (const effect of effects) {
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
          this.state.resources.money += effect.value as number;
          break;
      }
    }
  }

  /**
   * Handle player choice for an event (PHASE 4.4)
   */
  public makeEventChoice(choiceIndex: number): void {
    if (!this.state.pendingEventChoice) {
      console.error('❌ No pending event choice');
      return;
    }

    const { event } = this.state.pendingEventChoice;

    // Apply player's chosen effects
    const effects = applyPlayerChoice(this.state, event, choiceIndex);
    this.applyEventEffects(effects);

    // Start chain if applicable
    startEventChain(this.state, event);

    // Clear pending choice
    this.state.pendingEventChoice = undefined;

    console.log(`✅ Event choice made for: ${event.name}`);
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
    // From balance config
    if (this.state.defensiveActorsSpawned >= this.balanceConfig.maxDefensiveActors) return;

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
      tier: 1, // Defensive actors are always high priority
      renderPriority: 10, // Highest priority
      awareness: 0.9, // Very aware
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

  /**
   * Execute defensive AI actions
   */
  private executeDefensiveAI(): void {
    const defensiveActors = this.state.network.actors.filter(a => a.category === 'defensive');

    for (const defender of defensiveActors) {
      // Find most vulnerable actors (low trust non-defensive actors)
      const vulnerableActors = this.state.network.actors
        .filter(a => a.category !== 'defensive' && a.trust < 0.5)
        .sort((a, b) => a.trust - b.trust); // Lowest trust first

      if (vulnerableActors.length === 0) continue;

      // Target the most vulnerable actor
      const target = vulnerableActors[0];

      // Calculate restoration strength based on defender type
      const restorationStrength = this.getDefensiveRestorationStrength(defender.name);

      // Apply trust restoration
      const trustIncrease = restorationStrength * (1 - target.resilience * 0.3);

      this.updateActor(target.id, {
        trust: clamp(target.trust + trustIncrease, 0, 1),
        resilience: clamp(target.resilience + 0.02, 0, 1), // Slightly increase resilience
      });

      // Add small trust boost to connected actors (ripple effect)
      const connections = this.state.network.connections.filter(
        c => c.sourceId === target.id || c.targetId === target.id
      );

      for (const conn of connections) {
        const connectedId = conn.sourceId === target.id ? conn.targetId : conn.sourceId;
        const connectedActor = this.getActor(connectedId);
        if (connectedActor && connectedActor.category !== 'defensive') {
          this.updateActor(connectedId, {
            trust: clamp(connectedActor.trust + trustIncrease * 0.15, 0, 1),
          });
        }
      }
    }
  }

  /**
   * Get restoration strength for defensive actor type
   */
  private getDefensiveRestorationStrength(name: string): number {
    if (name.includes('Fact Checker')) return 0.08; // 8% trust restoration
    if (name.includes('Media Literacy')) return 0.06; // 6% + resilience focus
    if (name.includes('Regulatory')) return 0.10; // 10% strong restoration
    return 0.05; // Default
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
      this.finalizeStatistics(true);
      return;
    }

    // Check defeat
    const defeatReason = this.checkDefeat();
    if (defeatReason) {
      this.state.phase = 'defeat';
      this.state.defeatReason = defeatReason;
      this.finalizeStatistics(false);
    }
  }
  
  /**
   * Check victory condition
   * Uses balance config for thresholds
   */
  checkVictory(): boolean {
    const lowTrustActors = this.state.network.actors.filter(
      a => a.trust < this.balanceConfig.victoryTrustLevel && a.category !== 'defensive'
    );
    const nonDefensiveActors = this.state.network.actors.filter(
      a => a.category !== 'defensive'
    );

    return lowTrustActors.length >= nonDefensiveActors.length * this.balanceConfig.victoryThreshold;
  }

  /**
   * Check defeat conditions
   * Uses balance config for thresholds
   */
  checkDefeat(): DefeatReason | null {
    // Exposure - caught due to excessive attention/detection risk
    if (this.state.detectionRisk >= this.balanceConfig.exposureThreshold) {
      return 'exposure';
    }

    // Time out
    if (this.state.round >= this.state.maxRounds) {
      return 'time_out';
    }

    // Defensive victory
    const metrics = this.getNetworkMetrics();
    if (
      metrics.averageTrust > this.balanceConfig.defensiveVictoryTrust &&
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
      resources: { ...this.state.resources },
      detectionRisk: this.state.detectionRisk,
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
    this.state.resources = { ...snapshot.resources };
    this.state.detectionRisk = snapshot.detectionRisk;

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

/**
 * Create a new game state manager
 * @param seed - Optional seed for deterministic randomness
 * @param difficulty - Difficulty level (affects balance, actor count, etc.)
 */
export function createGameState(
  seed?: string,
  difficulty: DifficultyLevel = DEFAULT_DIFFICULTY
): GameStateManager {
  return new GameStateManager(seed, difficulty);
}
