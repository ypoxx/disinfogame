// ============================================
// CORE TYPES - Desinformation Network Game
// ============================================

// Actor Categories
export type ActorCategory =
  | 'media'
  | 'expert'
  | 'lobby'
  | 'organization'
  | 'infrastructure'
  | 'defensive';

// Actor Tiers (importance/visibility)
export type ActorTier = 1 | 2 | 3;  // 1=Core, 2=Secondary, 3=Background

// Connection Types (for advanced network topology)
export type ConnectionType =
  | 'structural'   // Basic network structure
  | 'ideological'  // Shared beliefs/values
  | 'financial'    // Money/funding relationships
  | 'social';      // Social/professional ties

// Position in 2D space
export type Position = {
  x: number;
  y: number;
};

// ============================================
// ACTOR TYPES
// ============================================

export type Actor = {
  // Identity
  id: string;
  name: string;
  category: ActorCategory;
  subcategory?: string;       // NEW: Detailed classification (e.g., "quality", "tabloid")

  // Core properties (0-1 normalized)
  trust: number;              // Current trust level
  baseTrust: number;          // Starting value (for recovery)
  resilience: number;         // Resistance to manipulation
  influenceRadius: number;    // Pixel radius for connections
  emotionalState: number;     // 0=rational, 1=emotional
  recoveryRate: number;       // How fast trust recovers per round

  // NEW: Tier & Visibility System
  tier: ActorTier;            // Importance level (1=Core, 2=Secondary, 3=Background)
  renderPriority: number;     // 1-10, for sorting when culling needed
  minZoomLevel?: number;      // Only render when zoomed past this level

  // NEW: Grouping & Clustering
  groupId?: string;           // Visual/logical group identifier
  representsCount?: number;   // For aggregate actors (e.g., "represents 50 influencers")

  // NEW: AI & Behavior
  behavior?: ActorBehavior;   // How this actor reacts to player actions
  awareness: number;          // 0-1, tracks if actor is aware of manipulation
  lastAttacked?: number;      // Round number of last attack

  // NEW: Network Topology (computed)
  centrality?: number;        // Betweenness centrality (0-1)
  isBottleneck?: boolean;     // True if high centrality actor
  communityId?: string;       // Which community this actor belongs to

  // Spatial
  position: Position;
  velocity?: Position;        // NEW: For force-directed layout animation

  // Visual
  color: string;
  size: number;
  icon?: string;              // NEW: Emoji/icon for actor

  // Gameplay
  abilities: string[];        // Ability IDs this actor can use
  activeEffects: Effect[];    // Currently active effects on this actor
  cooldowns: Record<string, number>;  // Ability ID → rounds remaining

  // Taxonomy links
  vulnerabilities: string[];  // Technique IDs from taxonomy
  resistances: string[];      // Technique IDs from taxonomy
};

// NEW: Actor Behavior Definition
export type ActorBehavior = {
  type: 'passive' | 'defensive' | 'aggressive';
  triggerThreshold: number;           // Trust level that triggers behavior
  counterAbilities?: string[];        // Abilities actor can use to counter player
  reactionProbability?: number;       // 0-1, chance to react each round
};

// Actor definition from JSON (for factory)
export type ActorDefinition = {
  id: string;
  name: string;
  category: ActorCategory;
  subcategory?: string;
  baseTrust: number;
  resilience: number;
  influenceRadius: number;
  emotionalState: number;
  recoveryRate: number;
  abilities: string[];
  vulnerabilities: string[];
  resistances: string[];
  color: string;
  size: number;
  icon?: string;

  // NEW: Tier & visibility
  tier: ActorTier;
  renderPriority?: number;      // Default: derived from tier
  minZoomLevel?: number;

  // NEW: Grouping
  groupId?: string;
  representsCount?: number;

  // NEW: AI Behavior
  behavior?: ActorBehavior;

  // NEW: Auto-connection rules
  connections?: {
    categories?: string[];      // Connect to these actor categories
    specific?: string[];        // Connect to these specific actor IDs
    strength?: number;          // Connection strength (0-1)
  };
};

// ============================================
// ABILITY TYPES
// ============================================

export type TargetType = 
  | 'single'      // One actor
  | 'adjacent'    // Connected actors
  | 'category'    // All actors of a category
  | 'network';    // Entire network

export type EffectType = 
  | 'direct'       // Immediate effect
  | 'propagation'  // Spreads through network
  | 'network'      // Affects network structure
  | 'delayed';     // Takes effect after rounds

export type AnimationType = 
  | 'pulse' 
  | 'wave' 
  | 'beam' 
  | 'ripple';

export type Ability = {
  id: string;
  name: string;
  description: string;

  // Costs
  resourceCost: ResourceCost;  // Multi-resource costs
  cooldown: number;            // Rounds

  // Taxonomy links
  basedOn: string[];           // Persuasion technique IDs
  
  // Mechanics
  effectType: EffectType;
  targetType: TargetType;
  targetCategory?: ActorCategory;  // If targetType is 'category'
  
  // Effects
  effects: {
    trustDelta: number;
    resilienceDelta?: number;
    emotionalDelta?: number;
    duration?: number;        // 0 = instant
    propagates?: boolean;
  };
  
  // Balance
  diminishingFactor: number;  // 0.85 = 15% less effective each use
  
  // Visual
  animationType: AnimationType;
  animationColor: string;
};

// Ability definition from JSON (for factory)
export type AbilityDefinition = Omit<Ability, 'calculateEffects'>;

// ============================================
// EFFECT TYPES
// ============================================

export type Effect = {
  id: string;
  type: 'trust_delta' | 'resilience_delta' | 'emotional_delta' | 'connection_break';
  targetActorId: string;
  
  // Magnitude
  value: number;              // Can be negative
  duration: number;           // Remaining rounds (0 = expires this round)
  
  // Metadata
  sourceAbilityId: string;
  sourceActorId: string;
  appliedAtRound: number;
};

// ============================================
// NETWORK TYPES
// ============================================

export type Connection = {
  id: string;
  sourceId: string;
  targetId: string;
  strength: number;           // 0-1, connection strength
  trustFlow: number;          // How much trust propagates per round
  type: ConnectionType;       // NEW: Type of connection
  visible: boolean;           // NEW: Should be rendered (false for weak connections)
  bidirectional: boolean;     // NEW: Trust flows both ways
};

export type Network = {
  actors: Actor[];
  connections: Connection[];
  
  // Computed metrics
  averageTrust: number;
  polarizationIndex: number;
};

export type NetworkMetrics = {
  averageTrust: number;
  trustVariance: number;
  polarizationIndex: number;
  connectionDensity: number;
  lowTrustCount: number;      // Actors with trust < 0.4
  highTrustCount: number;     // Actors with trust > 0.7
};

// NEW: Network Topology Analysis
export type ActorCluster = {
  id: string;
  name: string;                // Auto-generated name based on composition
  actors: string[];            // Actor IDs in this cluster
  averageTrust: number;
  center: Position;            // Visual center point
  radius: number;              // Visual radius
};

export type Community = {
  id: string;
  type: 'media_ecosystem' | 'expert_network' | 'lobby_coalition' | 'mixed';
  members: string[];           // Actor IDs
  cohesion: number;            // 0-1, density of internal connections
};

export type NetworkTopology = {
  clusters: ActorCluster[];
  bottlenecks: string[];       // Actor IDs with high centrality
  communities: Community[];
  centralActors: string[];     // Actor IDs with high betweenness centrality
};

// ============================================
// COMBO SYSTEM
// ============================================

export type AbilityCombo = {
  id: string;
  name: string;
  description: string;
  sequence: string[];          // Array of ability IDs in order
  timeWindow: number;          // Rounds to complete combo
  bonusEffect: number;         // Multiplier (e.g., 2.0 = double effect)
  category?: string;           // For organization
  unlockAt?: number;           // Min round to unlock
  realExample?: string;        // Real-world example for education
};

export type ComboProgress = {
  comboId: string;
  startRound: number;
  completedSteps: Array<{
    abilityId: string;
    targetId: string;
    round: number;
  }>;
};

export type ComboDetection = {
  inProgress: ComboProgress[];
  triggered: AbilityCombo[];
};

// ============================================
// EVENT TYPES
// ============================================

export type EventTriggerType = 'random' | 'conditional' | 'timed';

export type EventEffect = {
  type: 'trust_delta' | 'emotional_delta' | 'resilience_delta' | 'spawn_defensive' | 'resource_bonus';
  target: 'all' | 'random' | 'category' | string;  // Actor ID or filter
  targetCategory?: ActorCategory;
  value: number | string;
};

export type GameEvent = {
  id: string;
  name: string;
  description: string;

  // Trigger
  triggerType: EventTriggerType;
  probability?: number;       // For random events (0-1)
  condition?: string;         // For conditional (evaluated)
  triggerRound?: number;      // For timed

  // Effects
  effects: EventEffect[];

  // Presentation
  newsTickerText: string;
  iconType: string;
  duration?: number;          // How long to show in ticker

  // NEW: Advanced features
  chainTo?: string;           // ID of next event in chain
  playerChoice?: EventChoice[];  // Player can choose response
};

// NEW: Player choice in events
export type EventChoice = {
  text: string;               // Choice text shown to player
  cost?: ResourceCost;        // Cost to select this choice
  effects: EventEffect[];     // Effects if chosen
  consequence?: string;       // Description of outcome
};

// ============================================
// GAME STATE TYPES
// ============================================

export type GamePhase = 
  | 'start'       // Title screen
  | 'playing'     // Main game
  | 'paused'      // Game paused
  | 'victory'     // Player won
  | 'defeat';     // Player lost

export type DefeatReason = 
  | 'time_out'           // Ran out of rounds
  | 'defensive_victory'  // Defensive actors restored trust
  | 'exposure';          // Got caught (future)

// ============================================
// MULTI-RESOURCE ECONOMY (Plague Inc-Style)
// ============================================

export type Resources = {
  money: number;           // Buy bot farms, fake experts, etc.
  attention: number;       // Public awareness - too high = detection risk
  infrastructure: number;  // Bot farms, telegram channels, etc. (persistent)
};

export type ResourceCost = {
  money?: number;
  attention?: number;
  infrastructure?: number;
};

export type GameState = {
  // Core state
  phase: GamePhase;
  round: number;
  maxRounds: number;
  resources: Resources;    // Multi-resource economy
  detectionRisk: number;   // 0-1, based on attention

  // Network
  network: Network;

  // NEW: Network Topology (computed each round)
  topology?: NetworkTopology;

  // Tracking
  abilityUsage: Record<string, number>;  // Ability ID → times used
  eventsTriggered: string[];             // Event IDs
  defensiveActorsSpawned: number;

  // NEW: Combo System
  activeCombos: ComboProgress[];         // Currently in-progress combos
  completedCombos: string[];             // Combo IDs that were completed

  // NEW: Actor AI tracking
  actorReactions: ActorReaction[];       // Recent actor reactions

  // Statistics
  statistics: GameStatistics;

  // History (for undo/replay)
  history: GameStateSnapshot[];

  // Seed
  seed: string;

  // Result
  defeatReason?: DefeatReason;
};

// NEW: Actor Reaction (for AI system)
export type ActorReaction = {
  actorId: string;
  round: number;
  type: 'defensive' | 'aggressive' | 'passive';
  action: string;
  targetTactic?: string;       // If countering specific ability
  effects: any[];
  message: string;
};

export type GameStateSnapshot = {
  round: number;
  network: Network;
  resources: Resources;
  detectionRisk: number;
  timestamp: number;
};

// ============================================
// GAME STATISTICS & ANALYTICS
// ============================================

export type RoundStatistics = {
  round: number;
  averageTrust: number;
  lowTrustCount: number;
  resources: Resources;
  detectionRisk: number;
  actionsPerformed: number;
  resourcesSpent: number;
  mostAffectedActor?: {
    id: string;
    name: string;
    trustChange: number;
  };
};

export type GameStatistics = {
  // Overview
  totalRounds: number;
  victory: boolean;
  finalTrust: number;

  // Resource usage
  totalMoneySpent: number;
  totalAttentionGenerated: number;
  infrastructureBuilt: number;
  peakDetectionRisk: number;

  // Actions
  totalAbilitiesUsed: number;
  mostUsedAbility: {
    id: string;
    name: string;
    timesUsed: number;
  } | null;
  mostEffectiveAbility: {
    id: string;
    name: string;
    avgTrustDelta: number;
  } | null;

  // Targets
  mostTargetedActor: {
    id: string;
    name: string;
    timesTargeted: number;
  } | null;

  // Timeline
  roundHistory: RoundStatistics[];
  trustEvolution: Array<{ round: number; trust: number }>;

  // Achievements
  achievements: string[];
};

// ============================================
// UI TYPES
// ============================================

export type SelectedActor = {
  actorId: string;
  selectedAt: number;
};

export type SelectedAbility = {
  abilityId: string;
  sourceActorId: string;
};

export type UIState = {
  selectedActor: SelectedActor | null;
  selectedAbility: SelectedAbility | null;
  targetingMode: boolean;
  validTargets: string[];     // Actor IDs
  hoveredActor: string | null;
  showEncyclopedia: boolean;
  showTutorial: boolean;
  showSettings: boolean;
  currentEvent: GameEvent | null;
  notifications: Notification[];
};

export type Notification = {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  message: string;
  duration: number;
  createdAt: number;
};

// ============================================
// API TYPES
// ============================================

export type SeedMetadata = {
  rounds: number;
  finalTrust: number;
  difficulty: 'easy' | 'normal' | 'hard';
  tacticsUsed: string[];
};

export type AnalyticsAction = {
  type: 'ability_used' | 'round_end' | 'game_end';
  abilityId?: string;
  targetActorId?: string;
  resourceCost?: number;
  result?: {
    trustDelta: number;
    success: boolean;
  };
};

export type LeaderboardEntry = {
  rank: number;
  playerName: string;
  seed: string;
  rounds: number;
  finalTrust: number;
  timestamp: string;
};

// ============================================
// PERSUASION TAXONOMY TYPES
// ============================================

export type PersuasionTechnique = {
  id: string;
  name: string;
  category: string;
  description: string;
  longDescription: string;
  example: string;
  extendedExample: string;
  wikipediaQuery: string;
  taxonomyGroups: string[];
  applications: string[];
  manipulationPotential: number;
  uncertainty: {
    confidenceInterval: [number, number];
    confidenceLevel: string;
    basis: string;
  };
  empiricalEvidence: string[];
  counterStrategies: string[];
};

export type TaxonomyEdge = {
  source: string;
  target: string;
  relationship: string;
  strength: number;
};

export type PersuasionTaxonomy = {
  nodes: PersuasionTechnique[];
  edges: TaxonomyEdge[];
  phases: any[];
  countermeasureInteractions: any[];
  populationDifferences: any;
};

// ============================================
// UTILITY TYPES
// ============================================

export type Clamp = (value: number, min: number, max: number) => number;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Re-export narrative types
export * from './narrative';
