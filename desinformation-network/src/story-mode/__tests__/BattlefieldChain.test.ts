/**
 * Tests für die Schlachtfeld-Zustandsmaschine (P2c): deterministische, nachvollziehbare
 * Formeln — mehr Plattformen → mehr Reichweite, Milieu-Passung hebt die Wirkung,
 * Faktencheck dämpft unglaubwürdige Verbreiter, Heikelheit/Exposure treiben das Risiko.
 */
import { describe, it, expect } from 'vitest';
import {
  evaluateOperation,
  combinedPlatformReach,
  milieuFit,
  loadTargets,
  loadCarriers,
  loadPlatforms,
  type Carrier,
  type Platform,
  type Target,
} from '../battlefield/BattlefieldChain';

const target: Target = {
  id: 't', name: 'Testziel', role_de: 'Archetyp', milieu: 'wu_bohemien', fiktiv: true, standing: 0.8,
  vulnerabilities: [{ id: 'v', label_de: 'Schwäche', heikelheit: 0.5, glaubwuerdigkeit: 0.7 }],
};
const vuln = target.vulnerabilities[0];

const creator: Carrier = {
  id: 'creator', label_de: 'Creator', reach: 0.8, credibility: 0.75, exposure: 0.5,
  milieus: ['wu_bohemien'], buildCost: { budget: 12, capacity: 2, phases: 1 },
};
const botnetz: Carrier = {
  id: 'botnetz', label_de: 'Bot-Netz', reach: 0.9, credibility: 0.15, exposure: 0.85,
  milieus: [], buildCost: { budget: 12, capacity: 2, phases: 1 },
};
const kurzvideo: Platform = { id: 'kv', label_de: 'Kurzvideo', reach: 0.85, decay: 0.8, moderation: 0.35, milieus: ['wu_bohemien'] };
const feed: Platform = { id: 'feed', label_de: 'Feed', reach: 0.7, decay: 0.6, moderation: 0.9, milieus: ['wu_liberale'] };

describe('BattlefieldChain (P2c Zustandsmaschine)', () => {
  it('mehr Plattformen → mehr (aber abnehmende) Reichweite', () => {
    const one = combinedPlatformReach([kurzvideo]);
    const two = combinedPlatformReach([kurzvideo, feed]);
    expect(two).toBeGreaterThan(one);
    expect(two).toBeLessThanOrEqual(1);
    expect(combinedPlatformReach([])).toBe(0);
  });

  it('Milieu-Passung des Verbreiters hebt die Wirkung', () => {
    const fitMatch = milieuFit(creator, [kurzvideo], target); // creator+kurzvideo treffen wu_bohemien
    const offMilieu: Target = { ...target, milieu: 'wu_liberale' };
    const fitMiss = milieuFit(creator, [kurzvideo], offMilieu);
    expect(fitMatch).toBeGreaterThan(fitMiss);
  });

  it('Faktencheck dämpft unglaubwürdige Verbreiter auf moderierten Plattformen', () => {
    const calm = evaluateOperation({ target, vulnerability: vuln, carrier: botnetz, platforms: [feed], factcheckPressure: 0 });
    const pressure = evaluateOperation({ target, vulnerability: vuln, carrier: botnetz, platforms: [feed], factcheckPressure: 1 });
    expect(pressure.impact).toBeLessThan(calm.impact);
  });

  it('höhere Exposure + Heikelheit → höheres Enttarnungs-Risiko', () => {
    const low = evaluateOperation({ target, vulnerability: { ...vuln, heikelheit: 0.1 }, carrier: creator, platforms: [kurzvideo] });
    const high = evaluateOperation({ target, vulnerability: { ...vuln, heikelheit: 0.9 }, carrier: botnetz, platforms: [feed] });
    expect(high.exposureRisk).toBeGreaterThan(low.exposureRisk);
    expect(high.exposureRisk).toBeLessThanOrEqual(1);
  });

  it('liefert eine plakative Schlagzeile mit Ziel + Schwäche', () => {
    const r = evaluateOperation({ target, vulnerability: vuln, carrier: creator, platforms: [kurzvideo] });
    expect(r.headline_de).toContain('Testziel');
    expect(r.headline_de).toContain('Schwäche');
    expect(r.impact).toBeGreaterThan(0);
  });

  it('alle Werte bleiben in 0..1', () => {
    for (const c of [creator, botnetz]) {
      const r = evaluateOperation({ target, vulnerability: vuln, carrier: c, platforms: [kurzvideo, feed], factcheckPressure: 0.7, saturation: 0.5 });
      for (const v of [r.reach, r.milieuFit, r.impact, r.exposureRisk]) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
      }
    }
  });

  it('Daten-Loader liefern den fiktiven Roster (6 Ziele, 8 Verbreiter, 5 Plattformen)', () => {
    expect(loadTargets().length).toBe(6);
    expect(loadCarriers().length).toBe(8);
    expect(loadPlatforms().length).toBe(5);
    expect(loadTargets().every((t) => t.fiktiv === true)).toBe(true);
  });
});
