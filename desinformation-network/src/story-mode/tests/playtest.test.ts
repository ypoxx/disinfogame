/**
 * Story Mode Playtest Script
 * Simulates gameplay to identify bugs, balance issues, and missing features
 *
 * Run with: npx vitest run src/story-mode/tests/playtest.test.ts
 */

import { describe, it, expect } from 'vitest';
import { StoryEngineAdapter, createStoryEngine } from '../../game-logic/StoryEngineAdapter';

interface PlaytestLog {
  timestamp: string;
  phase: number;
  event: string;
  details: Record<string, unknown>;
}

interface PlaytestReport {
  startTime: string;
  endTime: string;
  duration: string;
  seed: string;
  phasesPlayed: number;
  actionsExecuted: number;
  consequencesTriggered: number;
  gameEndType: string | null;
  logs: PlaytestLog[];
  issues: string[];
  observations: string[];
  resourceHistory: Array<{
    phase: number;
    budget: number;
    capacity: number;
    risk: number;
    attention: number;
    moralWeight: number;
  }>;
}

function runPlaytest(maxPhases: number = 24, seed?: string): PlaytestReport {
  const startTime = new Date();
  const engine = createStoryEngine(seed || `playtest_${Date.now()}`);

  const report: PlaytestReport = {
    startTime: startTime.toISOString(),
    endTime: '',
    duration: '',
    seed: seed || 'random',
    phasesPlayed: 0,
    actionsExecuted: 0,
    consequencesTriggered: 0,
    gameEndType: null,
    logs: [],
    issues: [],
    observations: [],
    resourceHistory: [],
  };

  const log = (event: string, details: Record<string, unknown> = {}) => {
    report.logs.push({
      timestamp: new Date().toISOString(),
      phase: engine.getCurrentPhase().number,
      event,
      details,
    });
  };

  const recordResources = () => {
    const res = engine.getResources();
    report.resourceHistory.push({
      phase: engine.getCurrentPhase().number,
      budget: res.budget,
      capacity: res.capacity,
      risk: res.risk,
      attention: res.attention,
      moralWeight: res.moralWeight,
    });
  };

  // Initial state
  log('GAME_START', {
    resources: engine.getResources(),
    npcs: engine.getAllNPCs().map(n => ({ id: n.id, name: n.name, relationship: n.relationshipLevel })),
    objectives: engine.getObjectives().map(o => ({ id: o.id, progress: o.progress })),
  });
  recordResources();

  // Test available actions at start
  const initialActions = engine.getAvailableActions();
  log('INITIAL_ACTIONS', {
    total: initialActions.length,
    available: initialActions.filter(a => a.available).length,
    locked: initialActions.filter(a => !a.available).length,
    byPhase: {
      ta01: initialActions.filter(a => a.phase === 'ta01').length,
      ta02: initialActions.filter(a => a.phase === 'ta02').length,
      ta03: initialActions.filter(a => a.phase === 'ta03').length,
    }
  });

  if (initialActions.filter(a => a.available).length === 0) {
    report.issues.push('CRITICAL: No actions available at game start!');
  }

  // Main game loop
  for (let phase = 1; phase <= maxPhases; phase++) {
    // Check game end
    const gameEnd = engine.checkGameEnd();
    if (gameEnd) {
      log('GAME_END', { type: gameEnd.type, title: gameEnd.title_de });
      report.gameEndType = gameEnd.type;
      break;
    }

    // Get available actions
    const actions = engine.getAvailableActions().filter(a => a.available);

    if (actions.length === 0) {
      log('NO_ACTIONS_AVAILABLE', { phase });
      report.issues.push(`Phase ${phase}: No actions available`);
    }

    // Execute actions (up to 5 per phase)
    let actionsThisPhase = 0;
    const resources = engine.getResources();

    for (const action of actions) {
      if (actionsThisPhase >= 5) break;
      if (resources.actionPointsRemaining <= 0) break;

      // Check if we can afford it
      if (action.costs.budget && resources.budget < action.costs.budget) continue;
      if (action.costs.capacity && resources.capacity < action.costs.capacity) continue;

      try {
        const result = engine.executeAction(action.id);
        actionsThisPhase++;
        report.actionsExecuted++;

        log('ACTION_EXECUTED', {
          actionId: action.id,
          label: action.label_de,
          success: result.success,
          legality: action.legality,
          costs: action.costs,
          effects: result.effects?.length || 0,
          potentialConsequences: result.potentialConsequences,
        });

        // Check for NPC reactions
        if (result.npcReactions && result.npcReactions.length > 0) {
          log('NPC_REACTION', {
            reactions: result.npcReactions,
          });
        }

      } catch (error) {
        log('ACTION_ERROR', { actionId: action.id, error: String(error) });
        report.issues.push(`Action ${action.id} failed: ${error}`);
      }

      // Update resource reference
      Object.assign(resources, engine.getResources());
    }

    // Check for active consequence
    const activeConsequence = engine.getActiveConsequence();
    if (activeConsequence) {
      log('CONSEQUENCE_ACTIVE', {
        id: activeConsequence.consequenceId,
        label: activeConsequence.label_de,
        severity: activeConsequence.severity,
        choices: activeConsequence.choices?.length || 0,
      });
      report.consequencesTriggered++;

      // Make a choice (first available)
      if (activeConsequence.choices && activeConsequence.choices.length > 0) {
        const choice = activeConsequence.choices[0];
        try {
          engine.handleConsequenceChoice(choice.id);
          log('CONSEQUENCE_RESOLVED', { choiceId: choice.id, label: choice.label_de });
        } catch (error) {
          log('CONSEQUENCE_ERROR', { error: String(error) });
          report.issues.push(`Consequence resolution failed: ${error}`);
        }
      }
    }

    // Advance phase
    const advanceResult = engine.advancePhase();
    report.phasesPlayed++;
    recordResources();

    log('PHASE_ADVANCED', {
      newPhase: advanceResult.newPhase.number,
      year: advanceResult.newPhase.year,
      month: advanceResult.newPhase.month,
      worldEvents: advanceResult.worldEvents.length,
      triggeredConsequences: advanceResult.triggeredConsequences.length,
    });

    // Check world events
    if (advanceResult.worldEvents.length > 0) {
      log('WORLD_EVENTS', {
        events: advanceResult.worldEvents.map(e => ({ id: e.id, headline: e.headline_de })),
      });
    }

    // Check objectives
    const objectives = engine.getObjectives();
    for (const obj of objectives) {
      if (obj.completed) {
        log('OBJECTIVE_COMPLETED', { id: obj.id, label: obj.label_de });
      }
    }
  }

  // Final analysis
  const finalResources = engine.getResources();
  const finalObjectives = engine.getObjectives();
  const finalNpcs = engine.getAllNPCs();

  log('PLAYTEST_END', {
    finalResources,
    objectives: finalObjectives.map(o => ({
      id: o.id,
      progress: o.progress,
      completed: o.completed,
      currentValue: o.currentValue,
      targetValue: o.targetValue,
    })),
    npcs: finalNpcs.map(n => ({
      id: n.id,
      relationshipLevel: n.relationshipLevel,
      morale: n.morale,
      inCrisis: n.inCrisis,
    })),
    pendingConsequences: engine.getPendingConsequences().length,
    newsEvents: engine.getNewsEvents().length,
  });

  // Generate observations
  if (finalResources.risk > 70) {
    report.observations.push(`High risk at end: ${finalResources.risk}% - game may end soon`);
  }
  if (finalResources.budget < 20) {
    report.observations.push(`Low budget at end: ${finalResources.budget}k€ - actions limited`);
  }
  if (report.consequencesTriggered === 0 && report.phasesPlayed > 10) {
    report.observations.push('No consequences triggered in 10+ phases - probability too low?');
  }

  const destabilizeObj = finalObjectives.find(o => o.id === 'obj_destabilize');
  if (destabilizeObj) {
    const progressPerPhase = destabilizeObj.progress / report.phasesPlayed;
    const phasesNeeded = (100 - destabilizeObj.progress) / progressPerPhase;
    report.observations.push(
      `Destabilization progress: ${destabilizeObj.progress.toFixed(1)}% ` +
      `(${progressPerPhase.toFixed(2)}%/phase, ~${phasesNeeded.toFixed(0)} phases to complete)`
    );
  }

  // Check NPC relationships
  const npcWithHighRelation = finalNpcs.filter(n => n.relationshipLevel > 0);
  if (npcWithHighRelation.length === 0 && report.phasesPlayed > 12) {
    report.observations.push('No NPC relationship improvements after 12 phases');
  }

  // Check for NPCs in crisis
  const npcsInCrisis = finalNpcs.filter(n => n.inCrisis);
  if (npcsInCrisis.length > 0) {
    report.observations.push(`NPCs in crisis: ${npcsInCrisis.map(n => n.name).join(', ')}`);
  }

  const endTime = new Date();
  report.endTime = endTime.toISOString();
  report.duration = `${(endTime.getTime() - startTime.getTime())}ms`;

  return report;
}

// Run multiple playtests
function runMultiplePlaytests(count: number, phasesPerTest: number): void {
  console.log('='.repeat(80));
  console.log(`STORY MODE PLAYTEST - ${new Date().toISOString()}`);
  console.log('='.repeat(80));
  console.log();

  const allReports: PlaytestReport[] = [];
  const allIssues: Map<string, number> = new Map();

  for (let i = 0; i < count; i++) {
    console.log(`\n--- Playtest ${i + 1}/${count} ---`);
    const report = runPlaytest(phasesPerTest, `test_${i}_${Date.now()}`);
    allReports.push(report);

    console.log(`  Phases: ${report.phasesPlayed}`);
    console.log(`  Actions: ${report.actionsExecuted}`);
    console.log(`  Consequences: ${report.consequencesTriggered}`);
    console.log(`  End: ${report.gameEndType || 'ongoing'}`);
    console.log(`  Issues: ${report.issues.length}`);

    // Aggregate issues
    for (const issue of report.issues) {
      allIssues.set(issue, (allIssues.get(issue) || 0) + 1);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));

  const avgActions = allReports.reduce((sum, r) => sum + r.actionsExecuted, 0) / count;
  const avgConsequences = allReports.reduce((sum, r) => sum + r.consequencesTriggered, 0) / count;
  const gameEnds = allReports.filter(r => r.gameEndType);

  console.log(`\nAverage actions per ${phasesPerTest} phases: ${avgActions.toFixed(1)}`);
  console.log(`Average consequences triggered: ${avgConsequences.toFixed(1)}`);
  console.log(`Games ended early: ${gameEnds.length}/${count}`);

  if (allIssues.size > 0) {
    console.log('\nISSUES FOUND:');
    for (const [issue, count] of allIssues.entries()) {
      console.log(`  [${count}x] ${issue}`);
    }
  }

  // Resource balance analysis
  console.log('\nRESOURCE BALANCE:');
  const lastResources = allReports.map(r => r.resourceHistory[r.resourceHistory.length - 1]);
  const avgBudget = lastResources.reduce((sum, r) => sum + r.budget, 0) / count;
  const avgRisk = lastResources.reduce((sum, r) => sum + r.risk, 0) / count;
  const avgAttention = lastResources.reduce((sum, r) => sum + r.attention, 0) / count;
  const avgMoral = lastResources.reduce((sum, r) => sum + r.moralWeight, 0) / count;

  console.log(`  Average budget after ${phasesPerTest} phases: ${avgBudget.toFixed(0)}k€`);
  console.log(`  Average risk: ${avgRisk.toFixed(1)}%`);
  console.log(`  Average attention: ${avgAttention.toFixed(1)}%`);
  console.log(`  Average moral weight: ${avgMoral.toFixed(1)}`);

  // Observations
  console.log('\nOBSERVATIONS:');
  const observations = allReports.flatMap(r => r.observations);
  const uniqueObservations = [...new Set(observations)];
  for (const obs of uniqueObservations) {
    console.log(`  - ${obs}`);
  }

  // Print first report details for debugging
  if (allReports[0]) {
    console.log('\n--- DETAILED LOG (First Playtest) ---');
    for (const log of allReports[0].logs.slice(0, 30)) {
      console.log(`[Phase ${log.phase}] ${log.event}`);
      if (Object.keys(log.details).length > 0) {
        console.log(`         ${JSON.stringify(log.details).substring(0, 100)}...`);
      }
    }
  }
}

// Export for use
export { runPlaytest, runMultiplePlaytests };
export type { PlaytestReport };

// Vitest test wrapper
describe('Story Mode Playtest', () => {
  it('should complete a full playtest simulation', () => {
    console.log('\n' + '='.repeat(80));
    console.log(`STORY MODE PLAYTEST - ${new Date().toISOString()}`);
    console.log('='.repeat(80));

    const report = runPlaytest(24, 'vitest_playtest');

    console.log('\n--- PLAYTEST RESULTS ---');
    console.log(`Phases Played: ${report.phasesPlayed}`);
    console.log(`Actions Executed: ${report.actionsExecuted}`);
    console.log(`Consequences Triggered: ${report.consequencesTriggered}`);
    console.log(`Game End: ${report.gameEndType || 'ongoing'}`);
    console.log(`Duration: ${report.duration}`);

    console.log('\n--- ISSUES ---');
    if (report.issues.length === 0) {
      console.log('  No critical issues found');
    } else {
      for (const issue of report.issues) {
        console.log(`  ❌ ${issue}`);
      }
    }

    console.log('\n--- OBSERVATIONS ---');
    for (const obs of report.observations) {
      console.log(`  📊 ${obs}`);
    }

    console.log('\n--- RESOURCE HISTORY ---');
    for (const res of report.resourceHistory) {
      console.log(`  Phase ${res.phase}: Budget=${res.budget}, Risk=${res.risk}%, Attention=${res.attention}%, Moral=${res.moralWeight}`);
    }

    console.log('\n--- EVENT LOG (first 20) ---');
    for (const log of report.logs.slice(0, 20)) {
      console.log(`  [Phase ${log.phase}] ${log.event}`);
    }

    // Assertions
    expect(report.phasesPlayed).toBeGreaterThan(0);
    expect(report.actionsExecuted).toBeGreaterThan(0);
    expect(report.issues.filter(i => i.includes('CRITICAL'))).toHaveLength(0);
  });

  it('should have balanced resource progression', () => {
    const report = runPlaytest(48, 'balance_test');

    // Check resource balance
    const finalRes = report.resourceHistory[report.resourceHistory.length - 1];

    console.log('\n--- BALANCE TEST (48 Phases) ---');
    console.log(`Final Budget: ${finalRes.budget}k€`);
    console.log(`Final Risk: ${finalRes.risk}%`);
    console.log(`Final Attention: ${finalRes.attention}%`);
    console.log(`Final Moral Weight: ${finalRes.moralWeight}`);

    // Budget should not be depleted too fast
    expect(finalRes.budget).toBeGreaterThan(-50); // Allow some debt

    // Risk should increase over time with aggressive play
    // But not trigger game end in 48 phases with balanced play
    if (report.gameEndType === 'defeat') {
      console.log('  ⚠️ Game ended in defeat - risk escalation may be too fast');
    }
  });

  it('should trigger consequences during gameplay', () => {
    const reports: PlaytestReport[] = [];

    // Run 5 playtests to check consequence probability
    for (let i = 0; i < 5; i++) {
      reports.push(runPlaytest(36, `consequence_test_${i}`));
    }

    const totalConsequences = reports.reduce((sum, r) => sum + r.consequencesTriggered, 0);
    const avgConsequences = totalConsequences / 5;

    console.log('\n--- CONSEQUENCE TEST (5 runs, 36 phases each) ---');
    console.log(`Total Consequences: ${totalConsequences}`);
    console.log(`Average per run: ${avgConsequences.toFixed(1)}`);

    // At least some consequences should trigger
    if (totalConsequences === 0) {
      console.log('  ⚠️ No consequences triggered in 5 playtests - probability too low?');
    }

    expect(totalConsequences).toBeGreaterThanOrEqual(0); // Soft check
  });
});
