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

  it('Frühe Welle: garantiert genau einmal beim Eintritt in Tag 4 (News sichtbar)', () => {
    const engine = freshEngine('pacing_early');

    // Vor Tag 4 darf die Welle NICHT da sein.
    advanceTo(engine, 3);
    const before = engine.getNewsEvents({ limit: 300 });
    expect(before.some(n => n.id === 'pacing_first_wave_4')).toBe(false);

    // Eintritt in Tag 4 → garantierte erste Gegenwehr.
    advanceTo(engine, 4);
    const after = engine.getNewsEvents({ limit: 300 });
    expect(after.some(n => n.id === 'pacing_first_wave_4')).toBe(true);
  });

  it('Schonzeit: im ersten Kampagnendrittel bleibt passives Spiel risiko-arm (keine Eskalation)', () => {
    const engine = freshEngine('pacing_grace');
    // Bis Tag 10 (innerhalb der Schonzeit von 12 Tagen) baut Untätigkeit kaum Risiko auf
    // — der frühe Welle-Stups (Tag 4) ist weitgehend wieder abgebaut.
    advanceTo(engine, 10);
    expect(engine.getResources().risk).toBeLessThanOrEqual(12);
  });

  it('Späte Eskalation: passives Dauer-Spiel läuft spät in die Gefahr (kann auffliegen)', () => {
    const engine = freshEngine('pacing_late');
    let maxLate = 0;
    // Unbeirrt weiter enden lassen (Spielende ignorieren) und das Spät-Risiko messen.
    // Kampagne ist ~40 Tage; die Eskalation greift im letzten Drittel (ab ~Tag 30).
    for (let p = 0; p < 60; p++) {
      engine.advancePhase();
      if (engine.getCurrentPhase().number >= 30) {
        maxLate = Math.max(maxLate, engine.getResources().risk);
      }
    }
    // Ohne Pacing bliebe vorsichtiges/passives Spiel bei ~0 Risiko.
    // Mit der Eskalation steigt es spät klar in die Gefahrenzone (in der 40-Tage-Kampagne
    // knapp unter die Enttarnungs-Schwelle 85 — passives Dauer-Spiel wird real gefährlich).
    expect(maxLate).toBeGreaterThanOrEqual(60);
  });
});
