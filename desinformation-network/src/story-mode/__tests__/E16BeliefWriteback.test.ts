/**
 * E16-Rückwirkung (Phase 5): der belief-Writeback macht die Vortest-Vorschau ehrlich.
 * Wer eine Masche wiederholt ausspielt, schiebt die getroffenen Gruppen tatsächlich Richtung
 * Parteifahne — „noch N Stöße" sinkt über den Lauf. Deterministisch, End-to-End über die Engine.
 */
import { describe, it, expect } from 'vitest';
import { createStoryEngine } from '../../game-logic/StoryEngineAdapter';
import { resetStoryActorAI } from '../engine/StoryActorAI';
import { resetStoryComboSystem } from '../engine/StoryComboSystem';
import { resetCrisisMomentSystem } from '../engine/CrisisMomentSystem';

const RUMOR = '11.4'; // „Ein Gerücht aussetzen" — trifft die Abgehängten voll.

function freshEngine(seed: string) {
  resetStoryActorAI();
  resetStoryComboSystem();
  resetCrisisMomentSystem();
  return createStoryEngine(seed);
}

/** Die am stärksten getroffene, noch nicht gekippte Gruppe der Masche. */
function topSegment(engine: ReturnType<typeof createStoryEngine>, actionId: string) {
  const r = engine.getSegmentVortest(actionId)!;
  return [...r.segmente]
    .filter((s) => s.reached && s.wirkung > 0 && s.stoesseBisFahne > 0 && s.stoesseBisFahne < 90)
    .sort((a, b) => b.wirkung - a.wirkung)[0];
}

describe('E16 belief-Writeback', () => {
  it('wiederholtes Ausspielen schiebt die getroffene Gruppe Richtung Fahne (Stöße sinken)', () => {
    const engine = freshEngine('e16-writeback');
    const top = topSegment(engine, RUMOR);
    expect(top).toBeTruthy();
    const startStoesse = top.stoesseBisFahne;

    // Die Masche über mehrere Tage hämmern (Budget/AP-Grenzen abfedern).
    let hits = 0;
    for (let i = 0; i < 10 && hits < 6; i++) {
      try { engine.executeAction(RUMOR); hits++; } catch { /* nicht leistbar → nächster Tag */ }
      engine.advancePhase();
    }
    expect(hits).toBeGreaterThan(0);

    const after = engine.getSegmentVortest(RUMOR)!.segmente.find((s) => s.segmentId === top.segmentId)!;
    // belief ist gestiegen → weniger Stöße bis zur Fahne (kein Zerfall, nur Abnutzung als Bremse).
    expect(after.stoesseBisFahne).toBeLessThan(startStoesse);
  });

  it('ohne Einsatz bleibt der belief-Stand unverändert (deterministisch)', () => {
    const a = freshEngine('e16-idle').getSegmentVortest(RUMOR)!;
    const b = freshEngine('e16-idle').getSegmentVortest(RUMOR)!;
    expect(a.segmente.map((s) => s.stoesseBisFahne)).toEqual(b.segmente.map((s) => s.stoesseBisFahne));
  });

  it('eine gekippte Gruppe stärkt die Fraktion und meldet sich in der Welt (E16-Kippen)', () => {
    const engine = freshEngine('e16-kippen');
    const frVorher = engine.getResources().fraktionsstaerke;
    // Die Masche hart hämmern, bis die stärkste Gruppe über die Parteifahne geht.
    let gekippt = false;
    for (let i = 0; i < 40 && !gekippt; i++) {
      try { engine.executeAction(RUMOR); } catch { /* nicht leistbar */ }
      engine.advancePhase();
      gekippt = engine.getNewsEvents().some((n) => n.id.startsWith('kippen_'));
    }
    expect(gekippt).toBe(true);
    // Kippen ist ein echter Sieg-Hebel: die Fraktions-Stärke ist gestiegen.
    expect(engine.getResources().fraktionsstaerke).toBeGreaterThan(frVorher);
  });
});
