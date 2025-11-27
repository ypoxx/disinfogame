// ============================================
// NARRATIVE & ROUND SUMMARY TYPES
// ============================================

export type ImpactLevel = 'minimal' | 'minor' | 'moderate' | 'significant' | 'major' | 'devastating';

export type ActionRecord = {
  id: string;
  round: number;
  timestamp: number;

  // What happened
  type: 'ability_used' | 'event_triggered' | 'defensive_spawn' | 'natural_change';
  abilityId?: string;
  eventId?: string;
  sourceActorId?: string;
  targetActorIds: string[];

  // Impact
  trustChanges: Record<string, number>; // actorId -> delta
  resilienceChanges: Record<string, number>;
  emotionalChanges: Record<string, number>;

  // Narrative
  headline: string;
  description: string;
  examples: string[]; // Concrete story examples
  impactLevel: ImpactLevel;
};

export type RoundSummary = {
  round: number;

  // Player actions
  playerActions: ActionRecord[];

  // Automatic events
  automaticEvents: ActionRecord[];

  // Network state changes
  networkBefore: {
    averageTrust: number;
    lowTrustCount: number;
    highTrustCount: number;
    polarization: number;
  };

  networkAfter: {
    averageTrust: number;
    lowTrustCount: number;
    highTrustCount: number;
    polarization: number;
  };

  // Metrics
  totalTrustChange: number;
  actorsAffected: number;
  propagationDepth: number;

  // Narrative
  roundNarrative: string;
  keyMoments: string[];
  consequences: string[];
};

export type ImpactVisualization = {
  actorId: string;
  actorName: string;
  before: {
    trust: number;
    resilience: number;
    emotional: number;
  };
  after: {
    trust: number;
    resilience: number;
    emotional: number;
  };
  changes: {
    trust: number;
    resilience: number;
    emotional: number;
  };
  affectedBy: string[]; // Action IDs that affected this actor
  narrative: string; // Story of what happened to this actor
};
