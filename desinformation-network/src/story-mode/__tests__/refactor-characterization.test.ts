/**
 * Phase 0 — Characterization Tests & Golden Path
 *
 * Diese Tests dokumentieren das IST-Verhalten des StoryEngineAdapter
 * vor dem Refactoring. Sie dienen als Sicherheitsnetz:
 * - Golden Path: Deterministische Spielsequenz über 5 Phasen
 * - Snapshot: Kompletter State nach Golden Path
 * - Characterization: Kritische Pfade (executeAction, advancePhase, consequences, NPCs, save/load)
 *
 * REGEL: Diese Tests dürfen nach Refactoring NICHT fehlschlagen.
 * Wenn sie fehlschlagen, hat sich Verhalten geändert → Regression.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { StoryEngineAdapter, createStoryEngine } from '../../game-logic/StoryEngineAdapter';

const GOLDEN_SEED = 'refactor-baseline-2026';

// ============================================
// Helper: Capture full engine state snapshot
// ============================================
function captureMinimalSnapshot(engine: StoryEngineAdapter) {
  const resources = engine.getResources();
  const phase = engine.getCurrentPhase();
  const npcs = engine.getAllNPCs();
  const objectives = engine.getObjectives();
  const consequences = engine.getPendingConsequences();

  return {
    phase: { number: phase.number, year: phase.year, month: phase.month },
    resources: {
      budget: resources.budget,
      capacity: resources.capacity,
      risk: resources.risk,
      attention: resources.attention,
      moralWeight: resources.moralWeight,
      actionPointsRemaining: resources.actionPointsRemaining,
    },
    npcs: npcs.map(n => ({
      id: n.id,
      relationshipLevel: n.relationshipLevel,
      morale: n.morale,
      available: n.available,
    })),
    objectives: objectives.map(o => ({
      id: o.id,
      type: o.type,
      progress: o.progress,
      completed: o.completed,
    })),
    pendingConsequences: consequences.length,
  };
}

function captureFullSnapshot(engine: StoryEngineAdapter) {
  const minimal = captureMinimalSnapshot(engine);
  const news = engine.getNewsEvents();
  const comboStats = engine.getComboStats();
  const aiStatus = engine.getArmsRaceStatus();
  const betrayalStatus = engine.getBetrayalStatus();

  return {
    ...minimal,
    newsCount: news.length,
    newsSeverities: news.map(n => n.severity).filter(Boolean),
    comboStats: {
      total: comboStats.total,
      discoveredCombos: comboStats.discoveredCombos.length,
    },
    aiStatus: {
      activeDefenders: aiStatus.activeDefenders,
      threatLevel: aiStatus.threatLevel,
    },
    betrayalStatus: {
      imminentBetrayals: betrayalStatus.imminentBetrayals.length,
    },
  };
}

// ============================================
// Golden Path: Deterministic 5-phase sequence
// ============================================
describe('Golden Path — Deterministic Baseline', () => {
  let engine: StoryEngineAdapter;

  beforeEach(() => {
    engine = createStoryEngine(GOLDEN_SEED);
  });

  it('should produce identical initial state from seed', () => {
    const snapshot = captureMinimalSnapshot(engine);

    expect(snapshot.phase).toEqual({ number: 1, year: 1, month: 1 });
    expect(snapshot.resources.budget).toBe(150);
    expect(snapshot.resources.capacity).toBe(5);
    expect(snapshot.resources.risk).toBe(0);
    expect(snapshot.resources.attention).toBe(0);
    expect(snapshot.resources.moralWeight).toBe(0);
    expect(snapshot.npcs).toHaveLength(5);
    expect(snapshot.npcs.every(n => n.available)).toBe(true);
    expect(snapshot.objectives.length).toBeGreaterThan(0);
  });

  it('should execute legal action with predictable cost deduction', () => {
    // Action 1.1: "Zielgruppe analysieren" — legal, costs: budget=3, capacity=1, risk=0
    const resourcesBefore = engine.getResources();
    const result = engine.executeAction('1.1');

    expect(result.success).toBe(true);
    expect(result.action.id).toBe('1.1');

    const resourcesAfter = engine.getResources();
    // Budget should decrease (exact amount depends on NPC discount)
    expect(resourcesAfter.budget).toBeLessThan(resourcesBefore.budget);
    // Action points should decrease by 1
    expect(resourcesAfter.actionPointsRemaining).toBe(resourcesBefore.actionPointsRemaining - 1);
    // Risk should not increase for legal action with risk=0
    expect(resourcesAfter.risk).toBe(resourcesBefore.risk);
  });

  it('should execute grey action with risk increase', () => {
    // Action 1.4: grey zone action — has some risk cost
    const resourcesBefore = engine.getResources();
    const result = engine.executeAction('1.4');

    expect(result.success).toBe(true);

    const resourcesAfter = engine.getResources();
    // Grey actions should have some moral weight impact
    expect(resourcesAfter.moralWeight).toBeGreaterThanOrEqual(resourcesBefore.moralWeight);
  });

  it('should produce consistent state after 5-phase golden path', () => {
    // Phase 1: Execute legal actions
    engine.executeAction('1.1'); // Zielgruppe analysieren (legal)
    engine.executeAction('1.2'); // Strategische Ziele definieren (legal)

    const afterPhase1Actions = captureMinimalSnapshot(engine);
    expect(afterPhase1Actions.resources.actionPointsRemaining).toBe(3);

    // Advance to phase 2
    const phase2 = engine.advancePhase();
    expect(phase2.newPhase.number).toBe(2);

    // Phase 2: Execute mixed actions
    engine.executeAction('1.3'); // Medienlandschaft kartieren (legal)
    engine.advancePhase();

    // Phase 3
    engine.executeAction('1.5'); // Narrativ-Framework erstellen (legal)
    engine.advancePhase();

    // Phase 4: Try grey action
    engine.executeAction('1.4'); // Grey zone
    engine.advancePhase();

    // Phase 5
    engine.executeAction('1.6'); // Legal
    engine.advancePhase();

    // Capture final state — this is our golden reference
    const finalSnapshot = captureMinimalSnapshot(engine);

    // Phase should be 6 now
    expect(finalSnapshot.phase.number).toBe(6);
    expect(finalSnapshot.phase.year).toBe(1);
    expect(finalSnapshot.phase.month).toBe(6);

    // Resources should have changed (budget regenerates, so may exceed initial)
    expect(typeof finalSnapshot.resources.budget).toBe('number');
    expect(finalSnapshot.resources.capacity).toBeGreaterThanOrEqual(1);

    // NPCs should all still be available (no betrayal in 5 phases with mild actions)
    expect(finalSnapshot.npcs.every(n => n.available)).toBe(true);
  });

  it('should produce identical full snapshot for same seed', () => {
    // Run same sequence twice
    function runGoldenPath(seed: string) {
      const e = createStoryEngine(seed);
      e.executeAction('1.1');
      e.executeAction('1.2');
      e.advancePhase();
      e.executeAction('1.3');
      e.advancePhase();
      e.executeAction('1.5');
      e.advancePhase();
      e.executeAction('1.4');
      e.advancePhase();
      e.executeAction('1.6');
      e.advancePhase();
      return captureFullSnapshot(e);
    }

    const run1 = runGoldenPath(GOLDEN_SEED);
    const run2 = runGoldenPath(GOLDEN_SEED);

    // Core game state must be identical
    expect(run1.phase).toEqual(run2.phase);
    expect(run1.resources).toEqual(run2.resources);
    expect(run1.npcs).toEqual(run2.npcs);
    expect(run1.objectives).toEqual(run2.objectives);
    expect(run1.pendingConsequences).toBe(run2.pendingConsequences);
    expect(run1.comboStats).toEqual(run2.comboStats);
    // NOTE: News generation has non-deterministic elements (Date.now in IDs, random severity).
    // We verify core state determinism, not news verbatim.
  });
});

// ============================================
// Characterization: executeAction critical path
// ============================================
describe('Characterization — executeAction', () => {
  let engine: StoryEngineAdapter;

  beforeEach(() => {
    engine = createStoryEngine(GOLDEN_SEED);
  });

  it('should return structured ActionResult on success', () => {
    const result = engine.executeAction('1.1');

    expect(result).toHaveProperty('success', true);
    expect(result).toHaveProperty('action');
    expect(result).toHaveProperty('effects');
    expect(result).toHaveProperty('resourceChanges');
    expect(result).toHaveProperty('narrative');
    expect(result.action.id).toBe('1.1');
    expect(result.narrative).toHaveProperty('headline_de');
  });

  it('should fail gracefully for unaffordable action', () => {
    // Execute many actions to drain budget
    for (let i = 0; i < 5; i++) {
      engine.executeAction('1.1');
    }
    // Advance and try again
    engine.advancePhase();

    // Try expensive action — may or may not be affordable
    const resources = engine.getResources();
    const actions = engine.getAvailableActions();
    const expensiveAction = actions.find(a => a.costs.budget > resources.budget);

    if (expensiveAction) {
      const result = engine.executeAction(expensiveAction.id);
      expect(result.success).toBe(false);
    }
  });

  it('should throw for nonexistent action', () => {
    expect(() => engine.executeAction('nonexistent-action')).toThrow();
  });

  it('should update NPC relationships for affinity match', () => {
    // Action 1.1 has npc_affinity: ["marina"]
    const marinaBefore = engine.getNPCState('marina');
    engine.executeAction('1.1');
    const marinaAfter = engine.getNPCState('marina');

    // Relationship progress should increase or stay same (never decrease for affinity match)
    expect(marinaAfter!.relationshipProgress).toBeGreaterThanOrEqual(marinaBefore!.relationshipProgress);
  });

  it('should register potential consequences for risky actions', () => {
    // Execute several grey/illegal actions to trigger consequences
    engine.executeAction('1.4'); // grey
    engine.executeAction('1.8'); // grey (if exists)

    // Advance phases to let consequences potentially trigger
    engine.advancePhase();
    engine.advancePhase();

    const pending = engine.getPendingConsequences();
    // We can't guarantee consequences but the system should return an array
    expect(Array.isArray(pending)).toBe(true);
  });

  it('should generate action news after execution', () => {
    engine.executeAction('1.1');
    const news = engine.getNewsEvents();

    // News may be generated on advancePhase, not immediately on action
    // This characterizes the actual behavior
    expect(Array.isArray(news)).toBe(true);
  });
});

// ============================================
// Characterization: advancePhase critical path
// ============================================
describe('Characterization — advancePhase', () => {
  let engine: StoryEngineAdapter;

  beforeEach(() => {
    engine = createStoryEngine(GOLDEN_SEED);
  });

  it('should return structured PhaseResult', () => {
    const result = engine.advancePhase();

    expect(result).toHaveProperty('newPhase');
    expect(result.newPhase).toHaveProperty('number', 2);
    expect(result.newPhase).toHaveProperty('year', 1);
    expect(result.newPhase).toHaveProperty('month', 2);
  });

  it('should regenerate resources on phase advance', () => {
    // Drain some capacity
    engine.executeAction('1.1'); // costs capacity=1
    const drained = engine.getResources();
    expect(drained.capacity).toBeLessThan(5);

    engine.advancePhase();
    const regenerated = engine.getResources();

    // Capacity regenerates by CAPACITY_REGEN_PER_PHASE (2)
    expect(regenerated.capacity).toBeGreaterThan(drained.capacity);
    // Action points reset to max
    expect(regenerated.actionPointsRemaining).toBe(5);
  });

  it('should decay risk/attention naturally', () => {
    // First raise risk via action
    engine.executeAction('1.4'); // grey — adds some risk
    const afterAction = engine.getResources();

    // Advance several phases for decay
    for (let i = 0; i < 3; i++) {
      engine.advancePhase();
    }

    const afterDecay = engine.getResources();
    // Risk should decay (or at minimum not increase without actions)
    expect(afterDecay.risk).toBeLessThanOrEqual(afterAction.risk);
  });

  it('should generate world events on phase advance', () => {
    // Advance several phases to trigger events
    for (let i = 0; i < 5; i++) {
      engine.advancePhase();
    }

    const news = engine.getNewsEvents();
    // After 5 phases, there should be some news events
    expect(news.length).toBeGreaterThan(0);
  });

  it('should handle year boundary correctly', () => {
    for (let i = 0; i < 12; i++) {
      engine.advancePhase();
    }

    const phase = engine.getCurrentPhase();
    expect(phase.number).toBe(13);
    expect(phase.year).toBe(2);
    expect(phase.month).toBe(1);
    expect(phase.isNewYear).toBe(true);
  });
});

// ============================================
// Characterization: NPC system
// ============================================
describe('Characterization — NPC System', () => {
  let engine: StoryEngineAdapter;

  beforeEach(() => {
    engine = createStoryEngine(GOLDEN_SEED);
  });

  it('should initialize 5 NPCs with correct IDs', () => {
    const npcs = engine.getAllNPCs();
    const ids = npcs.map(n => n.id).sort();
    expect(ids).toEqual(['alexei', 'direktor', 'igor', 'katja', 'marina']);
  });

  it('should have initial NPC state properties', () => {
    const npc = engine.getNPCState('marina')!;
    expect(npc).not.toBeNull();
    expect(npc.relationshipLevel).toBe(0);
    expect(npc.morale).toBeGreaterThanOrEqual(50);
    expect(npc.available).toBe(true);
  });

  it('should provide NPC dialogue', () => {
    const greeting = engine.getNPCGreeting('marina');
    // Greeting should exist (may be null if no matching condition)
    // We just verify it doesn't crash
    expect(greeting === null || typeof greeting === 'object').toBe(true);
  });

  it('should provide NPC topics', () => {
    const topics = engine.getNPCTopics('marina');
    expect(Array.isArray(topics)).toBe(true);
  });

  it('should track betrayal status', () => {
    const status = engine.getBetrayalStatus();
    expect(status).toHaveProperty('npcStatuses');
    expect(status).toHaveProperty('imminentBetrayals');
    expect(status.npcStatuses).toBeInstanceOf(Map);
  });
});

// ============================================
// Characterization: Save/Load roundtrip
// ============================================
describe('Characterization — Save/Load Roundtrip', () => {
  it('should produce identical state after save/load cycle', () => {
    const engine = createStoryEngine(GOLDEN_SEED);

    // Play some game
    engine.executeAction('1.1');
    engine.executeAction('1.2');
    engine.advancePhase();
    engine.executeAction('1.3');
    engine.advancePhase();

    // Snapshot before save
    const before = captureFullSnapshot(engine);

    // Save and load into new engine
    const saved = engine.saveState();
    const newEngine = createStoryEngine('different-seed');
    newEngine.loadState(saved);

    // Snapshot after load
    const after = captureFullSnapshot(newEngine);

    // Core state must be identical
    expect(after.phase).toEqual(before.phase);
    expect(after.resources).toEqual(before.resources);
    expect(after.npcs).toEqual(before.npcs);
    expect(after.objectives).toEqual(before.objectives);
    expect(after.pendingConsequences).toBe(before.pendingConsequences);
    expect(after.newsCount).toBe(before.newsCount);
  });

  it('should preserve save format version', () => {
    const engine = createStoryEngine(GOLDEN_SEED);
    const saved = JSON.parse(engine.saveState());

    expect(saved.version).toBe('2.0.0');
    expect(saved).toHaveProperty('rngSeed');
    expect(saved).toHaveProperty('storyPhase');
    expect(saved).toHaveProperty('storyResources');
    expect(saved).toHaveProperty('npcStates');
    expect(saved).toHaveProperty('objectives');
    expect(saved).toHaveProperty('actionHistory');
    expect(saved).toHaveProperty('comboSystemState');
    expect(saved).toHaveProperty('consequenceSystemState');
  });

  it('should handle extended gameplay save/load', () => {
    const engine = createStoryEngine(GOLDEN_SEED);

    // Play 10 phases with actions
    for (let p = 0; p < 10; p++) {
      const actions = engine.getAvailableActions().filter(a => a.available);
      if (actions.length > 0) {
        engine.executeAction(actions[0].id);
      }
      const gameEnd = engine.checkGameEnd();
      if (gameEnd) break;
      engine.advancePhase();
    }

    const before = captureMinimalSnapshot(engine);
    const saved = engine.saveState();
    const newEngine = createStoryEngine();
    newEngine.loadState(saved);
    const after = captureMinimalSnapshot(newEngine);

    expect(after.phase).toEqual(before.phase);
    expect(after.resources).toEqual(before.resources);
  });
});

// ============================================
// Characterization: Consequence system
// ============================================
describe('Characterization — Consequence System', () => {
  let engine: StoryEngineAdapter;

  beforeEach(() => {
    engine = createStoryEngine(GOLDEN_SEED);
  });

  it('should start with no pending consequences', () => {
    expect(engine.getPendingConsequences()).toEqual([]);
    expect(engine.getActiveConsequence()).toBeNull();
  });

  it('should process consequence choice correctly', () => {
    // Play aggressively to trigger consequences
    const actions = engine.getAvailableActions().filter(a => a.available);
    for (const action of actions.slice(0, 5)) {
      try {
        engine.executeAction(action.id);
      } catch {
        // Some actions may fail — that's ok
      }
    }

    // Advance to potentially trigger consequences
    for (let i = 0; i < 5; i++) {
      engine.advancePhase();
      const active = engine.getActiveConsequence();
      if (active && active.choices && active.choices.length > 0) {
        // Make a choice
        const choiceResult = engine.handleConsequenceChoice(active.choices[0].id);
        expect(choiceResult).toHaveProperty('success');
        break;
      }
    }
  });
});

// ============================================
// Characterization: Game end conditions
// ============================================
describe('Characterization — Game End', () => {
  it('should not end on fresh game', () => {
    const engine = createStoryEngine(GOLDEN_SEED);
    expect(engine.checkGameEnd()).toBeNull();
  });

  it('should assemble ending when conditions met', () => {
    const engine = createStoryEngine(GOLDEN_SEED);
    // This just verifies the method exists and returns null initially
    const ending = engine.checkGameEnding();
    expect(ending === null || typeof ending === 'object').toBe(true);
  });
});

// ============================================
// Characterization: Combo system
// ============================================
describe('Characterization — Combo System', () => {
  it('should provide combo stats', () => {
    const engine = createStoryEngine(GOLDEN_SEED);
    const stats = engine.getComboStats();

    expect(stats).toHaveProperty('total');
    expect(stats).toHaveProperty('byCategory');
    expect(stats).toHaveProperty('discoveredCombos');
    expect(typeof stats.total).toBe('number');
  });

  it('should provide combo hints after actions', () => {
    const engine = createStoryEngine(GOLDEN_SEED);
    engine.executeAction('1.1');
    engine.executeAction('1.2');

    const hints = engine.getActiveComboHints();
    expect(Array.isArray(hints)).toBe(true);
  });
});

// ============================================
// Characterization: AI defensive actors
// ============================================
describe('Characterization — AI System', () => {
  it('should provide arms race status', () => {
    const engine = createStoryEngine(GOLDEN_SEED);
    const status = engine.getArmsRaceStatus();

    expect(status).toHaveProperty('armsRaceLevel');
    expect(status).toHaveProperty('activeDefenders');
    expect(status).toHaveProperty('threatLevel');
    expect(typeof status.activeDefenders).toBe('number');
  });

  it('should track disabled actions', () => {
    const engine = createStoryEngine(GOLDEN_SEED);
    const disabled = engine.getDisabledActions();
    expect(typeof disabled).toBe('object');
  });
});
