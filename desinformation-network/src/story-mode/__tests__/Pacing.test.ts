/**
 * P2-17 Pacing („spürbar härter") — Regressionsschutz für die zwei Gegenwehr-Wellen.
 *
 * Owner-Entscheidung 2026-06-20: „Spürbar härter (mehr Nervenkitzel)" — eine späte,
 * mechanische Eskalation, gegen die auch passives/vorsichtiges Dauer-Spiel auffliegen
 * KANN (vorher unmöglich: vorsichtiges Spiel blieb risiko-frei und lief nur in „Zeit
 * abgelaufen"). Belegt zusätzlich von balance-sim.test.ts (Verteilung). Hier pinnen
 * wir die deterministischen Eckpunkte des Mechanismus.
 *
 * Wichtig (R2): Die Pacing-Schicht berührt NUR Risiko/Aufmerksamkeit, NIE die
 * Sieg-Achse (obj_destabilize). Das pinnt BalanceInvariant.test.ts auf Formel-Ebene;
 * hier prüfen wir, dass der Risiko-Aufbau real entsteht.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { createStoryEngine } from '../../game-logic/StoryEngineAdapter';
import { resetStoryActorAI } from '../engine/StoryActorAI';
import { resetStoryComboSystem } from '../engine/StoryComboSystem';
import { resetCrisisMomentSystem } from '../engine/CrisisMomentSystem';

function freshEngine(seed: string) {
  resetStoryActorAI();
  resetStoryComboSystem();
  resetCrisisMomentSystem();
  return createStoryEngine(seed);
}

/** Bringt die Engine durch passives Phasenende auf eine Zielphase (keine Aktionen). */
function advanceTo(engine: ReturnType<typeof createStoryEngine>, targetPhase: number): void {
  let guard = 0;
  while (engine.getCurrentPhase().number < targetPhase && guard++ < 200) {
    engine.advancePhase();
  }
}

describe('P2-17 Pacing — Gegenwehr-Wellen', () => {
  beforeEach(() => {
    resetStoryActorAI();
    resetStoryComboSystem();
    resetCrisisMomentSystem();
  });

  it('Frühe Welle: garantiert genau einmal beim Eintritt in Phase 6 (News sichtbar)', () => {
    const engine = freshEngine('pacing_early');

    // Vor Phase 6 darf die Welle NICHT da sein.
    advanceTo(engine, 5);
    const before = engine.getNewsEvents({ limit: 300 });
    expect(before.some(n => n.id === 'pacing_first_wave_6')).toBe(false);

    // Eintritt in Phase 6 → garantierte erste Gegenwehr.
    advanceTo(engine, 6);
    const after = engine.getNewsEvents({ limit: 300 });
    expect(after.some(n => n.id === 'pacing_first_wave_6')).toBe(true);
  });

  it('Schonzeit: in den ersten Jahren bleibt passives Spiel risiko-arm (keine Eskalation)', () => {
    const engine = freshEngine('pacing_grace');
    // Bis Phase 40 (innerhalb der 3,5-Jahre-Schonzeit) baut Untätigkeit kein Risiko auf
    // — der frühe Welle-Stups (+3) ist längst wieder abgebaut.
    advanceTo(engine, 40);
    expect(engine.getResources().risk).toBeLessThanOrEqual(10);
  });

  it('Späte Eskalation: passives Dauer-Spiel läuft spät in die Gefahr (kann auffliegen)', () => {
    const engine = freshEngine('pacing_late');
    let maxLate = 0;
    // Unbeirrt weiter enden lassen (Spielende ignorieren) und das Spät-Risiko messen.
    for (let p = 0; p < 100; p++) {
      engine.advancePhase();
      if (engine.getCurrentPhase().number >= 80) {
        maxLate = Math.max(maxLate, engine.getResources().risk);
      }
    }
    // Ohne Pacing bliebe vorsichtiges/passives Spiel bei ~0 Risiko (nur „Zeit abgelaufen").
    // Mit der Eskalation steigt es spät klar in die Enttarnungs-Zone (Schwelle 85).
    expect(maxLate).toBeGreaterThanOrEqual(70);
  });
});
