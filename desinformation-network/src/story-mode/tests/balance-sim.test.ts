/**
 * Balancing-Simulation (K14 2026-06-12)
 *
 * Spielt mehrere Partien je Strategie (greedy/random/low_risk) bis Spielende
 * oder maxPhases und gibt Sieg/Niederlage/Enden-Verteilung, Siegphase
 * (Median/Min) und max. Risiko aus. Dient als Mess-Werkzeug für das Balancing.
 *
 * Lauf: npx vitest run src/story-mode/tests/balance-sim.test.ts
 */
import { describe, it, expect } from 'vitest';
import { createStoryEngine } from '../../game-logic/StoryEngineAdapter';
import { resetStoryActorAI } from '../engine/StoryActorAI';
import { resetStoryComboSystem } from '../engine/StoryComboSystem';
import { resetCrisisMomentSystem } from '../engine/CrisisMomentSystem';

type Strategy = 'greedy' | 'random' | 'low_risk';

interface SimResult {
  strategy: Strategy;
  outcome: 'victory' | 'defeat' | 'timeout';
  endType: string | null;
  endTitle: string | null;
  maxRisk: number;
  endPhase: number;
}

interface SimAction {
  id: string;
  available: boolean;
  legality?: string;
  unlocks?: string[];
  costs?: { budget?: number; capacity?: number; risk?: number; attention?: number };
}

function selectAction(actions: SimAction[], strategy: Strategy, res: { budget: number; capacity: number }): SimAction | null {
  const affordable = actions.filter(a => a.available
    && (!a.costs?.budget || res.budget >= a.costs.budget)
    && (!a.costs?.capacity || res.capacity >= a.costs.capacity));
  if (affordable.length === 0) return null;
  switch (strategy) {
    case 'random':
      return affordable[Math.floor(Math.random() * affordable.length)];
    case 'low_risk':
      return affordable.sort((a, b) =>
        ((a.costs?.risk || 0) + (a.costs?.attention || 0)) -
        ((b.costs?.risk || 0) + (b.costs?.attention || 0)))[0];
    case 'greedy':
    default:
      // aggressiv: hohe Wirkung (illegal/grey + unlocks + Risiko)
      return affordable.sort((a, b) => {
        const score = (x: SimAction) =>
          (x.legality === 'illegal' ? 3 : x.legality === 'grey' ? 2 : 1)
          + (x.unlocks?.length || 0) + (x.costs?.risk || 0) * 0.2;
        return score(b) - score(a);
      })[0];
  }
}

function runOne(strategy: Strategy, seed: string, maxPhases: number): SimResult {
  resetStoryActorAI();
  resetStoryComboSystem();
  resetCrisisMomentSystem();
  const engine = createStoryEngine(seed);

  let outcome: SimResult['outcome'] = 'timeout';
  let endType: string | null = null;
  let endTitle: string | null = null;
  let maxRisk = 0;
  let endPhase = 1;

  for (let phase = 1; phase <= maxPhases; phase++) {
    const end = engine.checkGameEnd();
    if (end) {
      outcome = end.type === 'victory' ? 'victory' : 'defeat';
      endType = end.type;
      endTitle = end.title_en;
      endPhase = engine.getCurrentPhase().number;
      break;
    }
    let actionsThisPhase = 0;
    while (actionsThisPhase < 5) {
      const res = engine.getResources();
      if (res.actionPointsRemaining <= 0) break;
      const action = selectAction(engine.getAvailableActions() as SimAction[], strategy, res);
      if (!action) break;
      try { engine.executeAction(action.id); } catch { break; }
      actionsThisPhase++;
    }
    const ac = engine.getActiveConsequence();
    if (ac?.choices?.length) {
      try { engine.handleConsequenceChoice(ac.choices[0].id); } catch { /* ignore */ }
    }
    engine.advancePhase();
    maxRisk = Math.max(maxRisk, engine.getResources().risk);
    endPhase = engine.getCurrentPhase().number;
  }
  maxRisk = Math.max(maxRisk, engine.getResources().risk);
  return { strategy, outcome, endType, endTitle, maxRisk, endPhase };
}

function median(arr: number[]): number | null {
  if (arr.length === 0) return null;
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function report(label: string, runs: SimResult[]): void {
  const wins = runs.filter(r => r.outcome === 'victory');
  const defeats = runs.filter(r => r.outcome === 'defeat');
  const timeouts = runs.filter(r => r.outcome === 'timeout');
  const winPhases = wins.map(r => r.endPhase);
  const endDist: Record<string, number> = {};
  for (const r of runs) {
    const key = r.endType ? `${r.endType}/${r.endTitle}` : 'timeout';
    endDist[key] = (endDist[key] || 0) + 1;
  }
  console.log(`\n--- ${label} (${runs.length}) ---`);
  console.log(`  Sieg: ${wins.length}  Niederlage: ${defeats.length}  Timeout: ${timeouts.length}`);
  console.log(`  Sieg-Phase  Median: ${median(winPhases) ?? '-'}  Min: ${winPhases.length ? Math.min(...winPhases) : '-'}  Max: ${winPhases.length ? Math.max(...winPhases) : '-'}`);
  console.log(`  Max-Risiko  Median: ${median(runs.map(r => Math.round(r.maxRisk)))}  Max: ${Math.round(Math.max(...runs.map(r => r.maxRisk)))}`);
  console.log(`  Enden: ${JSON.stringify(endDist)}`);
}

describe('Balance Simulation K14', () => {
  it('runs >=30 games and reports outcome distribution', () => {
    const MAX_PHASES = 120;
    const RUNS = 12; // 3 Strategien * 12 = 36 Partien
    const strategies: Strategy[] = ['greedy', 'random', 'low_risk'];
    const all: SimResult[] = [];
    for (const strat of strategies) {
      for (let i = 0; i < RUNS; i++) {
        all.push(runOne(strat, `sim_${strat}_${i}`, MAX_PHASES));
      }
    }
    console.log('\n' + '='.repeat(70));
    console.log(`BALANCE-SIM  ${all.length} Partien  (maxPhases=${MAX_PHASES})`);
    console.log('='.repeat(70));
    report('GESAMT', all);
    for (const strat of strategies) report(strat, all.filter(r => r.strategy === strat));

    expect(all.length).toBe(strategies.length * RUNS);
  });
});
