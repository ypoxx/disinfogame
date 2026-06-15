/**
 * BALANCE-INVARIANTE — pinnt die Sieg-Mathematik (applyActionEffects) deterministisch.
 *
 * WARUM SO: Die Balance-Sim ist verrauscht (Math.random-Seedung im Kern) UND der
 * ENDWERT von obj_destabilize nach executeAction schwankt zusätzlich, weil Combos
 * (StoryEngineAdapter ~4270) das Vertrauen direkt nachträglich modifizieren — combo-/
 * seed-abhängig. NICHT verrauscht ist aber der von `applyActionEffects` berechnete
 * EFFEKTWERT (`result.effects[type='trust_erosion'].value` etc.): er ist seed- und
 * combo-unabhängig und spiegelt die reine Erosions-Mathematik (×10/×2/×3/×4/×5-Faktoren,
 * Basis-Erosion je Phase/Legalität). Genau diese Mathematik darf P1 (Werte als Zustand)
 * und P2 (Effekt-Splitting) NICHT verändern.
 *
 * Bewegt sich hier etwas, ist die K14-Balance betroffen (R2) — bewusst entscheiden + Sim.
 */
import { describe, it, expect } from 'vitest';
import { createStoryEngine, type ActionResult } from '../../game-logic/StoryEngineAdapter';

/** Effekt-Map (type → value) einer EINZELNEN Aktion auf frischer Engine. */
function effectMap(actionId: string, seed = 'invariant'): Record<string, number> {
  const result: ActionResult = createStoryEngine(seed).executeAction(actionId);
  const map: Record<string, number> = {};
  for (const ef of result.effects ?? []) map[ef.type] = ef.value;
  return map;
}

describe('Balance-Invariante (applyActionEffects-Mathematik)', () => {
  // Gepinnte, seed-/combo-unabhängige Effektwerte (Stand nach P0).
  const PINNED_TRUST_EROSION: Record<string, number> = {
    '4.1': 1,   // Social Media Post
    '4.4': 1,   // YouTube-Video
    '5.2': 2,   // Hashtag-Kampagne
    '5.7': 2,   // Kampagne fortsetzen
    '8.2': 2,   // Person diskreditieren
    '3.18': 3,  // Fake-Whistleblower
  };

  for (const [id, te] of Object.entries(PINNED_TRUST_EROSION)) {
    it(`Aktion ${id}: trust_erosion = ${te}`, () => {
      expect(effectMap(id).trust_erosion).toBe(te);
    });
  }

  it('Aktion 3.18: content_quality = 2 (zweiter Effekt-Pfad)', () => {
    expect(effectMap('3.18').content_quality).toBe(2);
  });

  it('Effektwerte sind seed-unabhängig (reine Mathematik)', () => {
    expect(effectMap('5.2', 'seedA').trust_erosion).toBe(effectMap('5.2', 'seedB').trust_erosion);
    expect(effectMap('3.18', 'seedA').content_quality).toBe(effectMap('3.18', 'seedB').content_quality);
  });
});
