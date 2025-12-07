// ============================================
// CORE TYPES - Desinformation Network Game
// ============================================

// Actor Categories
export type ActorCategory = 
  | 'media' 
  | 'expert' 
  | 'lobby' 
  | 'organization' 
  | 'defensive';

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
  
  // Core properties (0-1 normalized)
  trust: number;              // Current trust level
  baseTrust: number;          // Starting value (for recovery)
  resilience: number;         // Resistance to manipulation
  influenceRadius: number;    // Pixel radius for connections
  emotionalState: number;     // 0=rational, 1=emotional
  recoveryRate: number;       // How fast trust recovers per round
  
  // Spatial
  position: Position;
  
  // Visual
  color: string;
  size: number;
  
  // Gameplay
  abilities: string[];        // Ability IDs this actor can use
  activeEffects: Effect[];    // Currently active effects on this actor
  cooldowns: Record<string, number>;  // Ability ID → rounds remaining
  
  // Taxonomy links
  vulnerabilities: string[];  // Technique IDs from taxonomy
  resistances: string[];      // Technique IDs from taxonomy
};

// Actor definition from JSON (for factory)
export type ActorDefinition = {
  id: string;
  name: string;
  category: ActorCategory;
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
};

// ============================================
// ABILITY TYPES
// ============================================

export type TargetType =
  | 'single'           // One actor
  | 'any'              // Any actor (same as single)
  | 'any_actor'        // Any actor (same as single)
  | 'adjacent'         // Connected actors
  | 'category'         // All actors of a category
  | 'media'            // Media actors only
  | 'multi_actor'      // Multiple actors
  | 'network'          // Entire network
  | 'self'             // Self only
  | 'self_and_media'   // Self + media actors
  | 'platform'         // Platform-wide effect
  | 'creates_new_actor'; // Creates a new actor

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
  resourceCost: number;
  cooldown: number;           // Rounds
  
  // Taxonomy links
  basedOn: string[];          // Persuasion technique IDs
  
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
  strength: number;           // 0-1, based on distance/radius
  trustFlow: number;          // How much trust propagates per round
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

// ============================================
// EVENT TYPES
// ============================================

export type EventTriggerType = 'random' | 'conditional' | 'timed';

export type EventEffect = {
  type: 'trust_delta' | 'emotional_delta' | 'resilience_delta' | 'spawn_defensive' | 'resource_bonus' | 'resource_penalty' | 'escalation_increase';
  target: 'all' | 'random' | 'category' | 'game' | 'player' | string;  // Actor ID or filter
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
};

// ============================================
// ESCALATION TYPES
// ============================================

export type EscalationLevel = 0 | 1 | 2 | 3 | 4 | 5;

export type EscalationState = {
  level: EscalationLevel;          // 0-5 escalation level
  publicAwareness: number;         // 0-1: How aware is the public of manipulation
  mediaAttention: number;          // 0-1: How much media coverage
  counterMeasures: number;         // Number of active countermeasures
  lastEscalationRound: number;     // Round when level last increased
};

// ============================================
// VICTORY TYPES
// ============================================

export type VictoryType =
  | 'complete_victory'    // 100% unter 40%
  | 'strategic_victory'   // 75% unter 40%, <24 Runden
  | 'tactical_victory'    // 75% unter 40%, normal
  | 'pyrrhic_victory'     // 75% unter 40%, aber hohe Eskalation
  | 'partial_success'     // 50-74% unter 40%
  | 'stalemate'           // Timeout ohne klaren Sieger
  | 'defeat';             // Defensive Victory

export type VictoryDetails = {
  type: VictoryType;
  roundsPlayed: number;
  finalTrust: number;
  actorsCompromised: number;
  totalActors: number;
  escalationLevel: EscalationLevel;
  score: number;
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

export type GameState = {
  // Core state
  phase: GamePhase;
  round: number;
  maxRounds: number;
  resources: number;

  // Network
  network: Network;

  // Escalation
  escalation: EscalationState;

  // Tracking
  abilityUsage: Record<string, number>;  // Ability ID → times used
  eventsTriggered: string[];             // Event IDs
  defensiveActorsSpawned: number;

  // History (for undo/replay)
  history: GameStateSnapshot[];

  // Seed
  seed: string;

  // Result
  defeatReason?: DefeatReason;
  victoryDetails?: VictoryDetails;
};

export type GameStateSnapshot = {
  round: number;
  network: Network;
  resources: number;
  timestamp: number;
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
