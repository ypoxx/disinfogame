// ============================================
// POST-GAME ANALYSIS TYPES
// ============================================

export type TechniqueUsageStats = {
  abilityId: string;
  name: string;
  category: string;
  timesUsed: number;
  totalTrustImpact: number;
  averageEffectiveness: number;
  resourcesSpent: number;
  realWorldExample?: string;
  educationalNote?: string;
};

export type TimelineEvent = {
  round: number;
  type: 'ability_used' | 'event_triggered' | 'defensive_spawn' | 'escalation_change' | 'milestone';
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  trustChange?: number;
};

export type CampaignPhase = {
  name: string;
  startRound: number;
  endRound: number;
  description: string;
  dominantTechniques: string[];
  averageTrust: number;
};

export type EducationalInsight = {
  id: string;
  title: string;
  description: string;
  technique?: string;
  realWorldConnection: string;
  counterStrategy: string;
  learnMoreUrl?: string;
};

export type ReflectionQuestion = {
  id: string;
  question: string;
  context: string;
  relatedTechnique?: string;
};

export type PostGameAnalysis = {
  // Overall stats
  roundsPlayed: number;
  totalAbilitiesUsed: number;
  totalResourcesSpent: number;
  finalAverageTrust: number;
  actorsCompromised: number;
  totalActors: number;

  // Victory info
  victoryType: string;
  score: number;
  escalationLevel: number;

  // Technique breakdown
  techniqueStats: TechniqueUsageStats[];
  mostEffectiveTechnique?: TechniqueUsageStats;
  mostUsedTechnique?: TechniqueUsageStats;

  // Campaign phases
  phases: CampaignPhase[];

  // Timeline
  timeline: TimelineEvent[];

  // Events
  eventsTriggered: string[];
  defensiveActorsSpawned: number;

  // Educational content
  insights: EducationalInsight[];
  reflectionQuestions: ReflectionQuestion[];

  // Category breakdown
  categoryBreakdown: {
    media: { initial: number; final: number };
    expert: { initial: number; final: number };
    lobby: { initial: number; final: number };
    organization: { initial: number; final: number };
  };
};
