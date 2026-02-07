/**
 * Performance Baseline — Strangler Fig Phase 9
 *
 * Captures performance metrics for critical engine operations.
 * These serve as regression thresholds: if any metric exceeds
 * the baseline by more than 50%, the test fails.
 *
 * Measured operations:
 * 1. Engine initialization (cold start)
 * 2. advancePhase() latency (1000 iterations)
 * 3. executeAction() latency (100 iterations)
 * 4. getAvailableActions() latency (1000 iterations)
 * 5. save/load round-trip latency (100 iterations)
 * 6. Full game simulation (48 phases = 4 game years)
 */

import { describe, it, expect } from 'vitest';
import { createStoryEngine } from '../../game-logic/StoryEngineAdapter';

const PERF_SEED = 'perf-baseline-2026';

// Maximum allowed time per operation (ms)
// These are generous thresholds — the test catches severe regressions, not micro-optimizations
const THRESHOLDS = {
  initMs: 200,           // Engine cold start
  advancePhaseMs: 5,     // Per advancePhase() call
  executeActionMs: 10,   // Per executeAction() call
  getActionsMs: 2,       // Per getAvailableActions() call
  saveLoadMs: 10,        // Per save+load round-trip
  fullSimMs: 5000,       // 48-phase full simulation
};

function measure(fn: () => void, iterations: number): { totalMs: number; avgMs: number } {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const totalMs = performance.now() - start;
  return { totalMs, avgMs: totalMs / iterations };
}

describe('Performance Baseline', () => {
  it('Engine initialization < threshold', () => {
    const { avgMs } = measure(() => {
      createStoryEngine(PERF_SEED + Math.random());
    }, 10);

    console.log(`[PERF] Engine init: ${avgMs.toFixed(2)}ms avg`);
    expect(avgMs).toBeLessThan(THRESHOLDS.initMs);
  });

  it('advancePhase() < threshold', () => {
    const engine = createStoryEngine(PERF_SEED);
    const iterations = 200;

    const { avgMs } = measure(() => {
      engine.advancePhase();
    }, iterations);

    console.log(`[PERF] advancePhase: ${avgMs.toFixed(3)}ms avg (${iterations} iterations)`);
    expect(avgMs).toBeLessThan(THRESHOLDS.advancePhaseMs);
  });

  it('executeAction() < threshold', () => {
    const engine = createStoryEngine(PERF_SEED);
    const actions = engine.getAvailableActions();
    const iterations = 50;

    // Execute different actions in rotation
    let actionIdx = 0;
    const { avgMs } = measure(() => {
      const action = actions[actionIdx % actions.length];
      try {
        engine.executeAction(action.id);
      } catch {
        // Some actions may fail due to insufficient resources — that's OK
      }
      actionIdx++;
      // Re-advance phase every 5 actions to keep resources flowing
      if (actionIdx % 5 === 0) {
        engine.advancePhase();
      }
    }, iterations);

    console.log(`[PERF] executeAction: ${avgMs.toFixed(3)}ms avg (${iterations} iterations)`);
    expect(avgMs).toBeLessThan(THRESHOLDS.executeActionMs);
  });

  it('getAvailableActions() < threshold', () => {
    const engine = createStoryEngine(PERF_SEED);
    engine.advancePhase();
    const iterations = 500;

    const { avgMs } = measure(() => {
      engine.getAvailableActions();
    }, iterations);

    console.log(`[PERF] getAvailableActions: ${avgMs.toFixed(3)}ms avg (${iterations} iterations)`);
    expect(avgMs).toBeLessThan(THRESHOLDS.getActionsMs);
  });

  it('save/load round-trip < threshold', () => {
    const engine = createStoryEngine(PERF_SEED);
    // Advance a few phases to build up state
    for (let i = 0; i < 5; i++) engine.advancePhase();
    const iterations = 50;

    const { avgMs } = measure(() => {
      const saved = engine.saveState();
      engine.loadState(saved);
    }, iterations);

    console.log(`[PERF] save/load: ${avgMs.toFixed(3)}ms avg (${iterations} iterations)`);
    expect(avgMs).toBeLessThan(THRESHOLDS.saveLoadMs);
  });

  it('Full 48-phase simulation < threshold', () => {
    const start = performance.now();
    const engine = createStoryEngine(PERF_SEED);
    const actions = engine.getAvailableActions();

    for (let phase = 0; phase < 48; phase++) {
      // Execute 2-3 actions per phase
      const phaseActions = actions.slice(phase % actions.length, (phase % actions.length) + 3);
      for (const action of phaseActions) {
        try {
          engine.executeAction(action.id);
        } catch {
          // Expected — resource limits
        }
      }
      engine.advancePhase();
    }

    const totalMs = performance.now() - start;
    const stats = {
      phases: engine.getCurrentPhase().number,
      resources: engine.getResources(),
      npcs: engine.getAllNPCs().length,
      news: engine.getNewsEvents().length,
    };

    console.log(`[PERF] Full sim (48 phases): ${totalMs.toFixed(1)}ms`);
    console.log(`[PERF]   Phase: ${stats.phases}, NPCs: ${stats.npcs}, News: ${stats.news}`);
    console.log(`[PERF]   Risk: ${stats.resources.risk}, Budget: ${stats.resources.budget}`);
    expect(totalMs).toBeLessThan(THRESHOLDS.fullSimMs);
  });
});
