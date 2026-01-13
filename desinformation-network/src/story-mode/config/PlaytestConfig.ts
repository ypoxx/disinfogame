/**
 * Playtest Configuration
 *
 * Settings for testing and debugging Story Mode.
 * Toggle these flags to test specific features in isolation.
 *
 * HOW TO USE:
 * 1. Set PLAYTEST_MODE = true to enable all playtest features
 * 2. Or enable individual features below
 * 3. Check browser console for debug output
 */

// ============================================
// MASTER TOGGLE
// ============================================

/**
 * Enable playtest mode - activates all debug features
 * Set to false for production
 */
export const PLAYTEST_MODE = false;

// ============================================
// INDIVIDUAL DEBUG FLAGS
// ============================================

export const DEBUG_FLAGS = {
  // =====================================
  // LOGGING
  // =====================================

  /** Log all state changes to console */
  LOG_STATE_CHANGES: PLAYTEST_MODE || false,

  /** Log NPC recommendation generation */
  LOG_RECOMMENDATIONS: PLAYTEST_MODE || true,

  /** Log crisis system triggers */
  LOG_CRISIS_SYSTEM: PLAYTEST_MODE || true,

  /** Log combo system progress */
  LOG_COMBO_SYSTEM: PLAYTEST_MODE || true,

  /** Log betrayal system updates */
  LOG_BETRAYAL_SYSTEM: PLAYTEST_MODE || true,

  // =====================================
  // VISUAL DEBUG
  // =====================================

  /** Show debug overlay with current state */
  SHOW_DEBUG_OVERLAY: PLAYTEST_MODE || false,

  /** Highlight recommended actions in ActionPanel */
  HIGHLIGHT_RECOMMENDATIONS: true,

  /** Show all combos (not just discovered ones) */
  SHOW_ALL_COMBOS: PLAYTEST_MODE || false,

  /** Show betrayal risk percentages in UI */
  SHOW_BETRAYAL_PERCENTAGES: true,

  // =====================================
  // GAMEPLAY CHEATS
  // =====================================

  /** Start with extra resources */
  EXTRA_STARTING_RESOURCES: PLAYTEST_MODE || false,

  /** Disable risk penalties */
  DISABLE_RISK: PLAYTEST_MODE || false,

  /** Force crisis every N phases (0 = disabled) */
  FORCE_CRISIS_EVERY_N_PHASES: PLAYTEST_MODE ? 3 : 0,

  /** Skip tutorial */
  SKIP_TUTORIAL: PLAYTEST_MODE || false,

  // =====================================
  // BALANCE TESTING
  // =====================================

  /** Multiplier for all costs (0.5 = half cost) */
  COST_MULTIPLIER: 1.0,

  /** Multiplier for all rewards */
  REWARD_MULTIPLIER: 1.0,

  /** Multiplier for crisis trigger chance */
  CRISIS_CHANCE_MULTIPLIER: 1.0,

  /** Multiplier for betrayal risk accumulation */
  BETRAYAL_RISK_MULTIPLIER: 1.0,
};

// ============================================
// BALANCE PRESETS
// ============================================

export const BALANCE_PRESETS = {
  /** Default balanced gameplay */
  normal: {
    COST_MULTIPLIER: 1.0,
    REWARD_MULTIPLIER: 1.0,
    CRISIS_CHANCE_MULTIPLIER: 1.0,
    BETRAYAL_RISK_MULTIPLIER: 1.0,
  },

  /** Easier gameplay for testing */
  easy: {
    COST_MULTIPLIER: 0.7,
    REWARD_MULTIPLIER: 1.3,
    CRISIS_CHANCE_MULTIPLIER: 0.5,
    BETRAYAL_RISK_MULTIPLIER: 0.7,
  },

  /** Harder gameplay */
  hard: {
    COST_MULTIPLIER: 1.3,
    REWARD_MULTIPLIER: 0.8,
    CRISIS_CHANCE_MULTIPLIER: 1.5,
    BETRAYAL_RISK_MULTIPLIER: 1.3,
  },

  /** Maximum chaos for stress testing */
  chaos: {
    COST_MULTIPLIER: 0.5,
    REWARD_MULTIPLIER: 0.5,
    CRISIS_CHANCE_MULTIPLIER: 3.0,
    BETRAYAL_RISK_MULTIPLIER: 2.0,
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Apply a balance preset
 */
export function applyBalancePreset(presetName: keyof typeof BALANCE_PRESETS): void {
  const preset = BALANCE_PRESETS[presetName];
  if (!preset) {
    console.warn(`Unknown balance preset: ${presetName}`);
    return;
  }

  Object.assign(DEBUG_FLAGS, preset);
  console.log(`[PLAYTEST] Applied balance preset: ${presetName}`);
}

/**
 * Log current debug state
 */
export function logDebugState(): void {
  console.log('=== PLAYTEST DEBUG STATE ===');
  console.log('PLAYTEST_MODE:', PLAYTEST_MODE);
  console.log('DEBUG_FLAGS:', DEBUG_FLAGS);
  console.log('============================');
}

/**
 * Check if any debug feature is active
 */
export function isAnyDebugActive(): boolean {
  return PLAYTEST_MODE ||
    DEBUG_FLAGS.SHOW_DEBUG_OVERLAY ||
    DEBUG_FLAGS.EXTRA_STARTING_RESOURCES ||
    DEBUG_FLAGS.DISABLE_RISK ||
    DEBUG_FLAGS.FORCE_CRISIS_EVERY_N_PHASES > 0;
}
