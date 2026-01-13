/**
 * Feature Registry - Central configuration for all Story Mode features
 *
 * This registry:
 * 1. Lists all available features and their status
 * 2. Provides feature flags for easy enable/disable
 * 3. Documents what triggers each feature
 * 4. Helps agents/developers find relevant code
 *
 * IMPORTANT: Update this file when adding new features!
 */

// ============================================
// FEATURE CONFIGURATION
// ============================================

export interface FeatureConfig {
  /** Unique feature ID */
  id: string;
  /** Human-readable name */
  name: string;
  /** Brief description */
  description: string;
  /** Is feature enabled? */
  enabled: boolean;
  /** Primary component file */
  component?: string;
  /** Hook/logic file */
  logic?: string;
  /** What triggers this feature */
  trigger?: string;
  /** Debug mode - shows test data when enabled */
  debugMode?: boolean;
  /** Notes for developers */
  notes?: string;
}

// ============================================
// STORY MODE FEATURES
// ============================================

export const FEATURE_REGISTRY: Record<string, FeatureConfig> = {
  // =====================================
  // CORE UI FEATURES
  // =====================================

  advisorPanel: {
    id: 'advisorPanel',
    name: 'NPC Advisor Panel',
    description: 'Zeigt NPC-Empfehlungen in der Seitenleiste',
    enabled: true,
    component: 'components/AdvisorPanel.tsx',
    logic: 'engine/NPCAdvisorEngine.ts',
    trigger: 'Immer sichtbar wenn gamePhase === "playing"',
    debugMode: true, // Shows test recommendation if no real ones
    notes: 'Collapsible, zeigt bis zu 5 Empfehlungen pro NPC',
  },

  actionQueue: {
    id: 'actionQueue',
    name: 'Action Queue Widget',
    description: 'Terminal-style Aktionswarteschlange',
    enabled: true,
    component: 'components/ActionQueueWidget.tsx',
    logic: 'hooks/useStoryGameState.ts (addToQueue, executeQueue)',
    trigger: 'Immer sichtbar wenn gamePhase === "playing"',
    notes: 'Batch-Ausführung von Aktionen',
  },

  comboHints: {
    id: 'comboHints',
    name: 'Combo Hints Widget',
    description: 'Zeigt aktive Combo-Fortschritte',
    enabled: true,
    component: 'components/ComboHintsWidget.tsx',
    logic: 'engine/StoryComboSystem.ts',
    trigger: 'Erscheint wenn comboHints.length > 0 (Combo >= 33% fertig)',
    notes: 'Entdeckungs-Mechanik: Combos werden erst sichtbar wenn teilweise abgeschlossen',
  },

  newsPanel: {
    id: 'newsPanel',
    name: 'News Panel',
    description: 'Zeigt Nachrichten und Events',
    enabled: true,
    component: 'components/NewsPanel.tsx',
    trigger: 'Click auf News-Button in Office',
    notes: 'Enthält auch Defensive AI Reaktionen',
  },

  // =====================================
  // CRISIS & EVENT FEATURES
  // =====================================

  crisisSystem: {
    id: 'crisisSystem',
    name: 'Crisis Moments',
    description: 'Dramatische Entscheidungsmomente',
    enabled: true,
    component: 'components/CrisisModal.tsx',
    logic: 'engine/CrisisMomentSystem.ts',
    trigger: 'Bei Phase-Ende: Risk > 35% ab Phase 3, oder Random-Events (35% Chance)',
    notes: 'Schwellen gesenkt am 2025-01-13 für mehr Spannung',
  },

  betrayalSystem: {
    id: 'betrayalSystem',
    name: 'NPC Betrayal System',
    description: 'NPCs können bei niedriger Loyalität verraten',
    enabled: true,
    component: 'components/BetrayalEventModal.tsx, GrievanceModal.tsx',
    logic: 'engine/BetrayalSystem.ts',
    trigger: 'Bei moralWeight-Aktionen: Betrayal-Risiko steigt',
    notes: 'Verrat bei Risk > 85% und warningLevel >= 4',
  },

  defensiveAI: {
    id: 'defensiveAI',
    name: 'Defensive AI Reactions',
    description: 'Plattformen/Fact-Checker reagieren auf Angriffe',
    enabled: true,
    logic: 'hooks/useStoryGameState.ts (executeAction)',
    trigger: 'Bei Trust-Drop > 0.1 durch Aktion',
    notes: 'Zeigt Reaktionen als News-Events',
  },

  // =====================================
  // ACTOR INTELLIGENCE
  // =====================================

  actorEffectiveness: {
    id: 'actorEffectiveness',
    name: 'Actor Effectiveness Widget',
    description: 'Zeigt voraussichtliche Aktions-Effektivität',
    enabled: true,
    component: 'components/ActorEffectivenessWidget.tsx',
    logic: 'engine/ExtendedActorLoader.ts',
    trigger: 'Bei Aktionsauswahl im ActionPanel',
    notes: 'Basiert auf Akteur-Vulnerabilities und Resistenzen',
  },

  // =====================================
  // TUTORIAL & ONBOARDING
  // =====================================

  tutorial: {
    id: 'tutorial',
    name: 'Tutorial Overlay',
    description: 'Schritt-für-Schritt Einführung',
    enabled: true,
    component: 'components/TutorialOverlay.tsx',
    trigger: 'Automatisch bei erstem Spielstart',
    notes: 'Kann übersprungen werden, zeigt Advisor-System Tipps',
  },

  // =====================================
  // FEEDBACK & DIALOGS
  // =====================================

  actionFeedback: {
    id: 'actionFeedback',
    name: 'Action Feedback Dialog',
    description: 'Zeigt detailliertes Ergebnis nach Aktionen',
    enabled: true,
    component: 'components/ActionFeedbackDialog.tsx',
    trigger: 'Nach Aktionsausführung',
    notes: 'Erweitert um Deep Integration Infos',
  },

  dialogBox: {
    id: 'dialogBox',
    name: 'NPC Dialog Box',
    description: 'Gespräche mit NPCs',
    enabled: true,
    component: 'components/DialogBox.tsx',
    trigger: 'Bei NPC-Interaktion',
    notes: 'Mit langsamerer Typing-Animation und kontextuellen Antworten',
  },

  // =====================================
  // END GAME
  // =====================================

  gameEndScreen: {
    id: 'gameEndScreen',
    name: 'Game End Screen',
    description: 'Detaillierte Endauswertung',
    enabled: true,
    component: 'components/GameEndScreen.tsx',
    trigger: 'Bei gamePhase === "ended"',
    notes: 'Mit Trust-Evolution-Chart und Statistiken',
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(featureId: string): boolean {
  return FEATURE_REGISTRY[featureId]?.enabled ?? false;
}

/**
 * Get all enabled features
 */
export function getEnabledFeatures(): FeatureConfig[] {
  return Object.values(FEATURE_REGISTRY).filter(f => f.enabled);
}

/**
 * Get all features with debug mode
 */
export function getDebugFeatures(): FeatureConfig[] {
  return Object.values(FEATURE_REGISTRY).filter(f => f.debugMode);
}

/**
 * Get feature by component name
 */
export function getFeatureByComponent(componentPath: string): FeatureConfig | undefined {
  return Object.values(FEATURE_REGISTRY).find(f =>
    f.component?.includes(componentPath)
  );
}

/**
 * Log all features status (for debugging)
 */
export function logFeatureStatus(): void {
  console.log('=== FEATURE REGISTRY STATUS ===');
  for (const [id, config] of Object.entries(FEATURE_REGISTRY)) {
    const status = config.enabled ? '✅' : '❌';
    const debug = config.debugMode ? ' [DEBUG]' : '';
    console.log(`${status} ${id}: ${config.name}${debug}`);
  }
  console.log('================================');
}

// ============================================
// FEATURE FLAGS (Quick toggles)
// ============================================

export const FEATURE_FLAGS = {
  // Core Features
  ENABLE_ADVISOR_PANEL: true,
  ENABLE_ACTION_QUEUE: true,
  ENABLE_COMBO_HINTS: true,

  // Crisis & Events
  ENABLE_CRISIS_SYSTEM: true,
  ENABLE_BETRAYAL_SYSTEM: true,
  ENABLE_DEFENSIVE_AI: true,

  // Debug Options
  DEBUG_RECOMMENDATIONS: true,  // Shows test recommendation if none exist
  DEBUG_LOG_FEATURES: false,    // Logs feature status on load

  // Experimental
  EXPERIMENTAL_ACTOR_INTELLIGENCE: true,
};

// Log features on module load if debug enabled
if (FEATURE_FLAGS.DEBUG_LOG_FEATURES) {
  logFeatureStatus();
}
