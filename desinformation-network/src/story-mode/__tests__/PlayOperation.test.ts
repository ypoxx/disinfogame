/**
 * params-Durchstich + Operations-Ökonomie (P2): die „Operations-Akte" spielt eine
 * Operation aus {Ziel, Schwäche, Verbreiter, Plattform-Mix} aus — aber erst nachdem
 * der Verbreiter AUFGEBAUT und das Kompromat BESCHAFFT ist (kein Spam, Kette §2/§5).
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { createStoryEngine, type StoryEngineAdapter } from '../../game-logic/StoryEngineAdapter';
import { loadTargets, loadCarriers, loadPlatforms, type OperationParams } from '../battlefield/BattlefieldChain';

function fullParams(): OperationParams {
  const t = loadTargets()[0];
  return {
    target: t.id,
    vulnerability: t.vulnerabilities[0].id,
    carrier: loadCarriers()[0].id,
    platforms: [loadPlatforms()[0].id],
  };
}

/** Verbreiter aufbauen + Kompromat beschaffen, damit eine Operation spielbar ist. */
function prepare(engine: StoryEngineAdapter, p: OperationParams) {
  engine.buildCarrier(p.carrier!);
  engine.acquireKompromat(p.target!, p.vulnerability!);
}

describe('StoryEngineAdapter.playOperation (P2 Operations-Akte + Ökonomie)', () => {
  let engine: StoryEngineAdapter;
  beforeEach(() => {
    engine = createStoryEngine('op-seed-1');
  });

  it('unvollständige Operation → kein Effekt, success=false', () => {
    const out = engine.playOperation({ target: loadTargets()[0].id });
    expect(out.success).toBe(false);
    expect(out.result).toBeNull();
  });

  it('Gate: ohne Aufbau → „noch nicht aufgebaut"', () => {
    const out = engine.playOperation(fullParams());
    expect(out.success).toBe(false);
    expect(out.reason).toMatch(/aufgebaut/i);
  });

  it('Gate: aufgebaut, aber Kompromat nicht beschafft → „nicht beschafft"', () => {
    const p = fullParams();
    expect(engine.buildCarrier(p.carrier!).ok).toBe(true);
    const out = engine.playOperation(p);
    expect(out.success).toBe(false);
    expect(out.reason).toMatch(/beschafft/i);
  });

  it('buildCarrier zieht Budget+Kapazität ab und setzt „aktiv"', () => {
    const carrier = loadCarriers()[0];
    const budget0 = engine.getResources().budget;
    const cap0 = engine.getResources().capacity;
    expect(engine.getCarrierState(carrier.id)).toBe('verfügbar');
    expect(engine.buildCarrier(carrier.id).ok).toBe(true);
    expect(engine.getCarrierState(carrier.id)).toBe('aktiv');
    expect(engine.getResources().budget).toBe(budget0 - carrier.buildCost.budget);
    expect(engine.getResources().capacity).toBe(cap0 - carrier.buildCost.capacity);
    // zweimal aufbauen ist idempotent (bereits aktiv)
    expect(engine.buildCarrier(carrier.id).ok).toBe(true);
  });

  it('acquireKompromat zieht Budget ab (heikelheit-skaliert) und schaltet die Schwäche frei', () => {
    const t = loadTargets()[0];
    const v = t.vulnerabilities[0];
    const cost = engine.kompromatCostFor(t.id, v.id)!;
    expect(cost).toBeGreaterThan(0);
    const budget0 = engine.getResources().budget;
    expect(engine.isKompromatAcquired(t.id, v.id)).toBe(false);
    expect(engine.acquireKompromat(t.id, v.id).ok).toBe(true);
    expect(engine.isKompromatAcquired(t.id, v.id)).toBe(true);
    expect(engine.getResources().budget).toBe(budget0 - cost);
  });

  it('vollständiger Ablauf (aufbauen → beschaffen → ausspielen) → Resultat + Nachricht', () => {
    const p = fullParams();
    const target = loadTargets()[0];
    prepare(engine, p);
    const out = engine.playOperation(p);
    expect(out.success).toBe(true);
    expect(out.result!.impact).toBeGreaterThan(0);
    expect(out.broadcastResult!.action.headline_de).toBe(out.result!.headline_de);
    expect(engine.getNewsEvents().some((n) => n.headline_de === out.result!.headline_de)).toBe(true);
  });

  it('Enttarnung: hoch-exponierter Verbreiter verbrennt im heißen Informationsraum', () => {
    // Bot-Netz (hohe exposure) auf moderierter Plattform → exposureRisk hoch.
    const t = loadTargets()[2]; // Hinterbänkler, vuln heikelheit 0.7
    const p: OperationParams = {
      target: t.id,
      vulnerability: t.vulnerabilities[0].id,
      carrier: 'botnetz',
      platforms: ['etablierte_medien'],
    };
    prepare(engine, p);
    let burned = false;
    for (let i = 0; i < 40; i++) {
      const out = engine.playOperation(p);
      if (!out.success) { // verbrannt → Gate schlägt zu
        expect(out.reason).toMatch(/verbrannt/i);
        burned = true;
        break;
      }
    }
    expect(burned).toBe(true);
    expect(engine.getCarrierState('botnetz')).toBe('verbrannt');
  });
});
