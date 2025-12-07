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

  // Tracking
  abilityUsage: Record<string, number>;  // Ability ID → times used
  eventsTriggered: string[];             // Event IDs
  defensiveActorsSpawned: number;

  // Sprint 2: Risk system
  riskState: RiskState;

  // History (for undo/replay)
  history: GameStateSnapshot[];

  // Seed
  seed: string;

  // Result
  defeatReason?: DefeatReason;
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
// VISUAL EFFECTS TYPES (Sprint 1.1)
// ============================================

export type VisualEffectType =
  | 'impact_number'      // Floating number showing trust change
  | 'trust_pulse'        // Pulsing ring on trust change
  | 'ability_beam'       // Beam connecting source to target
  | 'propagation_wave'   // Expanding wave for propagation
  | 'celebration'        // Celebration effect for milestones
  | 'controlled';        // Actor controlled indicator

export type VisualEffect = {
  id: string;
  type: VisualEffectType;
  targetActorId: string;
  sourceActorId?: string;
  value?: number;                    // For impact_number
  color: string;
  startTime: number;
  duration: number;                  // ms
  label?: string;                    // Optional label text
};

export type AbilityResult = {
  success: boolean;
  abilityId: string;
  sourceActorId: string;
  targetActorIds: string[];
  effects: Array<{
    actorId: string;
    trustBefore: number;
    trustAfter: number;
    trustDelta: number;
    emotionalDelta?: number;
    resilienceDelta?: number;
  }>;
  resourcesSpent: number;
  visualEffects: VisualEffect[];

  // Sprint 2: Risk system
  detected: boolean;
  exposureGained: number;
  backlashApplied: boolean;
};

// ============================================
// SPRINT 2: RISK & TRADE-OFF SYSTEM
// ============================================

export type ExposureLevel = 'hidden' | 'suspected' | 'known' | 'exposed';

export type RiskState = {
  exposure: number;                    // 0-1: Overall exposure level
  exposureLevel: ExposureLevel;        // Human-readable level
  detectionHistory: DetectionEvent[];  // Record of past detections
  abilityRiskModifiers: Record<string, number>; // Ability-specific risk increases
};

export type DetectionEvent = {
  round: number;
  abilityId: string;
  wasDetected: boolean;
  exposureGained: number;
  backlashTrust: number;               // How much trust was restored
};

export type AbilityRisk = {
  baseDetectionChance: number;         // 0-1: Base chance of detection
  exposureGrowth: number;              // How much exposure increases per use
  backlashMultiplier: number;          // How severe the backlash is
};

// ============================================
// SPRINT 2: ACTOR RELATIONSHIPS
// ============================================

export type RelationshipType = 'ally' | 'rival' | 'neutral';

export type ActorRelationship = {
  targetActorId: string;
  type: RelationshipType;
  strength: number;                    // -1 to +1 (negative = rivalry)
  reason?: string;                     // Why this relationship exists
};

export type ActorWithRelations = Actor & {
  relationships: ActorRelationship[];
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
