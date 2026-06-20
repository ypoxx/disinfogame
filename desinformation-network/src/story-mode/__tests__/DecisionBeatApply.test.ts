/**
 * Spine Slice 4 — Engine-Andockung der Entscheidungs-Beats: `applyDecisionBeatOption`
 * bewegt die Gesellschaftswerte + Spieler-Kosten über die bestehenden Pfade, bleibt
 * aber balance-neutral auf der Sieg-Achse (obj_destabilize/Vertrauen, R2).
 */
import { describe, it, expect } from 'vitest';
import { createStoryEngine } from '../../game-logic/StoryEngineAdapter';

const trustOf = (e: ReturnType<typeof createStoryEngine>) =>
  e.getObjectives().find((o) => o.id === 'obj_destabilize')!.currentValue;

describe('applyDecisionBeatOption', () => {
  it('Stadtrat/A (Hetzen) hebt Polarisierung + kostet Aufmerksamkeit/Risiko', () => {
    const e = createStoryEngine();
    const before = e.getResources();
    const res = e.applyDecisionBeatOption('stadtrat', 'A');
    expect(res).not.toBeNull();
    const after = e.getResources();
    expect(after.polarisierung).toBeGreaterThan(before.polarisierung);
    expect(after.attention).toBeGreaterThan(before.attention);
    expect(after.risk).toBeGreaterThan(before.risk);
    // Rückgabe macht die Wirkung sichtbar (T1).
    expect(res!.societyChanges?.polarisierung).toBeGreaterThan(0);
    expect(res!.resourceChanges.attention).toBeGreaterThan(0);
    expect(res!.optionLabel_de).toContain('Hetzen');
  });

  it('bleibt balance-neutral: obj_destabilize/Vertrauen unverändert (R2)', () => {
    const e = createStoryEngine();
    const trustBefore = trustOf(e);
    // Auch eine Option mit „vertrauen↓" im Werte-Delta darf die Sieg-Achse nicht bewegen.
    e.applyDecisionBeatOption('stadtrat', 'B');
    expect(trustOf(e)).toBe(trustBefore);
    const e2 = createStoryEngine();
    const t2 = trustOf(e2);
    e2.applyDecisionBeatOption('reale_vorlage', 'A');
    expect(trustOf(e2)).toBe(t2);
  });

  it('Abkühl-Option (Stadtrat/D) senkt Risiko + Aufmerksamkeit', () => {
    const e = createStoryEngine();
    // Erst aufheizen, damit das Senken sichtbar ist (Startwerte könnten 0 sein).
    e.applyDecisionBeatOption('reale_vorlage', 'C'); // viel Risiko/Aufmerksamkeit
    const before = e.getResources();
    e.applyDecisionBeatOption('stadtrat', 'D');
    const after = e.getResources();
    expect(after.risk).toBeLessThanOrEqual(before.risk);
    expect(after.attention).toBeLessThanOrEqual(before.attention);
  });

  it('markiert den Beat als aufgelöst (Director zieht ihn nicht erneut)', () => {
    const e = createStoryEngine();
    expect(e.getResolvedDecisionBeatIds()).not.toContain('stadtrat');
    e.applyDecisionBeatOption('stadtrat', 'C');
    expect(e.getResolvedDecisionBeatIds()).toContain('stadtrat');
  });

  it('Resolved-Status überlebt save/load', () => {
    const e = createStoryEngine();
    e.applyDecisionBeatOption('stadtrat', 'A');
    const saved = e.saveState();
    const loaded = createStoryEngine();
    loaded.loadState(saved);
    expect(loaded.getResolvedDecisionBeatIds()).toContain('stadtrat');
  });

  it('unbekannter Beat / unbekannte Option → null (kein Effekt)', () => {
    const e = createStoryEngine();
    const before = e.getResources();
    expect(e.applyDecisionBeatOption('gibtsnicht', 'A')).toBeNull();
    expect(e.applyDecisionBeatOption('stadtrat', 'Z')).toBeNull();
    expect(e.getResources()).toEqual(before);
  });
});
