/**
 * Test für die prefix-genaue Budget-Prüfung (Codex-Review #80): Kredite (negative
 * Budget-Kosten) zählen erst an ihrer Position — eine teure Ausgabe DAVOR darf die
 * Kasse nicht zwischendurch ins Minus reißen, auch wenn die Summe machbar aussieht.
 */
import { describe, it, expect } from 'vitest';
import { isQueueBudgetFeasible } from '../utils/queueAffordability';
import type { QueuedAction } from '../hooks/useStoryGameState';

function q(budget: number, id = `${budget}`): QueuedAction {
  return { id, actionId: id, label: id, costs: { budget }, legality: 'legal' };
}

describe('isQueueBudgetFeasible (prefix-genaue Budget-Prüfung)', () => {
  it('leere Queue ist machbar', () => {
    expect(isQueueBudgetFeasible([], 50)).toBe(true);
  });

  it('einzelne Ausgabe über Budget ist nicht machbar', () => {
    expect(isQueueBudgetFeasible([q(60)], 50)).toBe(false);
  });

  it('Kredit VOR der Ausgabe macht es machbar', () => {
    // -22 Kredit (Budget 50 → 72), dann 60 Ausgabe (→ 12) — nie negativ.
    expect(isQueueBudgetFeasible([q(-22, 'kredit'), q(60, 'spend')], 50)).toBe(true);
  });

  it('Ausgabe VOR dem Kredit ist NICHT machbar (Summe täuscht)', () => {
    // 60 Ausgabe zuerst (50 → -10) reißt die Kasse ins Minus, obwohl Summe 38 ≤ 50.
    expect(isQueueBudgetFeasible([q(60, 'spend'), q(-22, 'kredit')], 50)).toBe(false);
  });

  it('mehrere Ausgaben innerhalb des Budgets sind machbar', () => {
    expect(isQueueBudgetFeasible([q(20), q(20), q(10)], 50)).toBe(true);
    expect(isQueueBudgetFeasible([q(20), q(20), q(20)], 50)).toBe(false);
  });
});
