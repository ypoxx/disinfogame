/**
 * „Loop schließen" (P2-Konsequenzen): Operationen koppeln an Sieg/Niederlage.
 *  · Gelungene Operation → erodiert Institutionen-Vertrauen (Richtung Sieg).
 *  · Enttarnung (verbrannt) → öffentlicher Rückschlag: Vertrauen der Gegenseite ↑,
 *    Risiko/Aufmerksamkeit springen, moralische Last steigt.
 *  · Kompromat-Heikelheit → moralische Last (↔ moral_weight ↔ Enden).
 *  · Operations-Bilanz wird mitgeschrieben (End-Report/Atlas).
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { createStoryEngine, type StoryEngineAdapter } from '../../game-logic/StoryEngineAdapter';
import { loadTargets, loadCarriers, loadPlatforms, type OperationParams } from '../battlefield/BattlefieldChain';

function destabilizeValue(engine: StoryEngineAdapter): number {
  return engine.getObjectives().find((o) => o.id === 'obj_destabilize')!.currentValue;
}

/** Ziel/Schwäche/Verbreiter/Plattform für eine wirksame (nicht sofort verbrennende) Operation. */
function effectiveParams(): OperationParams {
  const t = loadTargets()[0];
  const carrier = loadCarriers().find((c) => c.id === 'creator')!;
  // Plattform, die das Ziel-Milieu trifft (hohe Wirkung, niedrige Moderation).
  const platform = loadPlatforms().find((p) => p.milieus.includes(t.milieu)) ?? loadPlatforms()[0];
  return { target: t.id, vulnerability: t.vulnerabilities[0].id, carrier: carrier.id, platforms: [platform.id] };
}

function prepare(engine: StoryEngineAdapter, p: OperationParams) {
  engine.buildCarrier(p.carrier!);
  engine.acquireKompromat(p.target!, p.vulnerability!);
}

describe('Operation-Loop: Ertrag (Vertrauenserosion)', () => {
  let engine: StoryEngineAdapter;
  beforeEach(() => { engine = createStoryEngine('loop-seed-1'); });

  it('gelungene Operation senkt das Institutionen-Vertrauen (trustDelta < 0)', () => {
    const p = effectiveParams();
    prepare(engine, p);
    const before = destabilizeValue(engine);
    const out = engine.playOperation(p);
    expect(out.success).toBe(true);
    expect(out.result!.impact).toBeGreaterThan(0);
    expect(out.trustDelta!).toBeLessThan(0);            // Erosion Richtung Sieg
    expect(destabilizeValue(engine)).toBeLessThan(before);
  });

  it('schreibt die Operations-Bilanz mit (Verbreiter/Plattform/Operation/Kompromat)', () => {
    const p = effectiveParams();
    prepare(engine, p);
    engine.playOperation(p);
    const sum = engine.getOperationsSummary();
    expect(sum.operationsPlayed).toBe(1);
    expect(sum.carriersUsed).toContain(p.carrier);
    expect(sum.platformsUsed).toContain(p.platforms![0]);
    expect(sum.kompromatAcquired).toBe(1);
  });
});

describe('Operation-Loop: moralische Last (Heikelheit ↔ moral_weight)', () => {
  let engine: StoryEngineAdapter;
  beforeEach(() => { engine = createStoryEngine('loop-seed-2'); });

  it('Beschaffung heiklen Kompromats hebt die moralische Last', () => {
    // Hinterbänkler hat eine sehr heikle Schwäche (Spielschulden, heikelheit 0.7).
    const t = loadTargets().find((x) => x.id === 't_hinterbaenkler')!;
    const heikel = t.vulnerabilities.find((v) => v.heikelheit >= 0.6)!;
    const moralBefore = engine.getResources().moralWeight;
    engine.acquireKompromat(t.id, heikel.id);
    expect(engine.getResources().moralWeight).toBeGreaterThan(moralBefore);
  });
});

describe('Operation-Loop: Enttarnung = öffentlicher Rückschlag', () => {
  let engine: StoryEngineAdapter;
  beforeEach(() => { engine = createStoryEngine('loop-seed-3'); });

  it('verbrannter Verbreiter lässt das Vertrauen der Gegenseite zurückspringen', () => {
    // Bot-Netz (hohe exposure) auf moderierter Plattform + heikles Ziel → Burn.
    const t = loadTargets().find((x) => x.id === 't_hinterbaenkler')!;
    const p: OperationParams = {
      target: t.id,
      vulnerability: t.vulnerabilities[0].id,
      carrier: 'botnetz',
      platforms: ['etablierte_medien'],
    };
    prepare(engine, p);

    let burnedOutcome = null as ReturnType<StoryEngineAdapter['playOperation']> | null;
    let before = 0;
    for (let i = 0; i < 40; i++) {
      before = destabilizeValue(engine);
      const riskBefore = engine.getResources().risk;
      const out = engine.playOperation(p);
      if (!out.success) break;          // bereits verbrannt → Gate
      if (out.carrierBurned) {
        burnedOutcome = out;
        // Beim Verbrennen: Vertrauen springt zurück (currentValue steigt),
        // Risiko springt, moralische Last steigt.
        expect(destabilizeValue(engine)).toBeGreaterThan(before);
        expect(engine.getResources().risk).toBeGreaterThan(riskBefore);
        expect(out.moralAdded!).toBeGreaterThan(0);
        break;
      }
    }
    expect(burnedOutcome).not.toBeNull();
    expect(engine.getCarrierState('botnetz')).toBe('verbrannt');
    expect(engine.getOperationsSummary().carriersBurned).toBeGreaterThanOrEqual(1);
  });
});
