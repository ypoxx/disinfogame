/**
 * Prefix-genaue Budget-Prüfung für den Sendeplan (Queue).
 *
 * Hintergrund (Codex-Review #80): Seit es Finanz-Aktionen mit NEGATIVEN Budget-Kosten
 * gibt (Kredit/Spenden = Geldspritze), reicht die reine Summen-Prüfung nicht mehr:
 * Die Queue wird in Reihenfolge ausgeführt; ein Kredit zählt erst, wenn er an der Reihe
 * ist. Eine teure Ausgabe VOR dem Kredit kann die Kasse zwischendurch ins Minus reißen,
 * obwohl die Summe machbar aussieht. Daher prüfen wir den laufenden Kontostand prefixweise.
 */
import type { QueuedAction } from '../hooks/useStoryGameState';

/** True, wenn das Budget in Ausführungs-Reihenfolge nie negativ wird. */
export function isQueueBudgetFeasible(queue: QueuedAction[], budget: number): boolean {
  let running = budget;
  for (const q of queue) {
    running -= q.costs.budget || 0;
    if (running < 0) return false;
  }
  return true;
}

/**
 * Gesamt-Leistbarkeit des Sendeplans: Budget prefix-genau, Kapazität/AP als Summe.
 * EIN Prädikat für Tafel (AUSSPIELEN-Gate) und Angeheftet-Chip (Warnfarbe),
 * damit die beiden Signale nie auseinanderdriften.
 */
export function istPlanLeistbar(
  queue: QueuedAction[],
  resources: { budget: number; capacity: number; actionPoints: number },
): boolean {
  const summe = queue.reduce(
    (a, q) => ({
      capacity: a.capacity + (q.costs.capacity || 0),
      actionPoints: a.actionPoints + (q.costs.actionPoints || 0),
    }),
    { capacity: 0, actionPoints: 0 },
  );
  return (
    isQueueBudgetFeasible(queue, resources.budget) &&
    summe.capacity <= resources.capacity &&
    summe.actionPoints <= resources.actionPoints
  );
}
