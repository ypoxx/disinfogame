/**
 * Story Mode Balance Configuration — Centralized game constants
 *
 * All magic numbers from StoryEngineAdapter in one place.
 * Extracted as Phase 5.2 of the Strangler Fig refactoring.
 */

// ============================================
// TIME & PHASES
// ============================================

export const PHASES_PER_YEAR = 12;
export const MAX_YEARS = 10;
export const MAX_PHASES = PHASES_PER_YEAR * MAX_YEARS; // 120

// ============================================
// ACTION POINTS & CAPACITY
// ============================================

export const ACTION_POINTS_PER_PHASE = 5;
export const CAPACITY_REGEN_PER_PHASE = 2;
export const MAX_CAPACITY = 10;

// ============================================
// RESOURCE REGENERATION (per phase)
// ============================================

export const BUDGET_REGEN_PER_PHASE = 5;
export const ATTENTION_DECAY_PER_PHASE = 2;
/** BALANCE 2026-01-14: Increased from -2 to -5 — state actors can manage risk */
export const RISK_DECAY_PER_PHASE = 5;

// ============================================
// INITIAL RESOURCES
// ============================================

/** P1-5 Fix: Increased from 100 to 150 */
export const INITIAL_BUDGET = 150;
export const INITIAL_CAPACITY = 5;

// ============================================
// WIN/LOSE THRESHOLDS
// ============================================

export const RISK_DEFEAT_THRESHOLD = 85;
export const MORAL_REDEMPTION_THRESHOLD = 80;
export const TRUST_TARGET = 40;

// ============================================
// WORLD EVENTS
// ============================================

/** 12 phases = 1 year cooldown between same event */
export const WORLD_EVENT_COOLDOWN = 12;
/** Default opportunity window: 6 phases = 6 months */
export const OPPORTUNITY_WINDOW_DURATION = 6;
/** Max cascade passes to prevent infinite loops */
export const MAX_CASCADE_PASSES = 3;
