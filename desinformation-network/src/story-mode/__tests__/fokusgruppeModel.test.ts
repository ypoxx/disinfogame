/**
 * fokusgruppeModel: Pre-Test + Sample-Bias (die „schlechte Marktforschung").
 */
import { describe, it, expect } from 'vitest';
import { preTest, reactionFor, moodForShift, representativeness, type Persona } from '../audience/fokusgruppeModel';
import personasJson from '../data/personas.json';

const POP = personasJson.personas as unknown as Persona[];
const lena = POP.find((p) => p.id === 'lena')!;

describe('fokusgruppeModel', () => {
  it('moodForShift mappt symmetrisch', () => {
    expect(moodForShift(0.5)).toBe('zustimmend');
    expect(moodForShift(0)).toBe('skeptisch');
    expect(moodForShift(-0.5)).toBe('ablehnend');
  });

  it('reactionFor liest die Receptivity der Persona', () => {
    const r = reactionFor(lena, 'hope'); // lena.hope = 0.8
    expect(r.personaId).toBe('lena');
    expect(r.shift).toBeCloseTo(0.8);
    expect(r.mood).toBe('zustimmend');
  });

  it('repräsentative Stichprobe (alle Milieus) → kein Sample-Bias, keine Warnung', () => {
    const res = preTest('hope', POP, POP.map((p) => p.id));
    expect(res.representativeness).toBe(1);
    expect(res.predictedReception).toBeCloseTo(res.trueReception);
    expect(res.sampleBias).toBeCloseTo(0);
    expect(res.warning).toBeNull();
  });

  it('einseitige Stichprobe (nur der Optimist) überschätzt die Wirkung → Bias + Warnung', () => {
    // hope: lena 0.8, walter -0.2, doreen -0.7 → wahr ≈ -0.033; nur lena → 0.8.
    const res = preTest('hope', POP, ['lena']);
    expect(res.predictedReception).toBeCloseTo(0.8);
    expect(res.trueReception).toBeLessThan(0.1);
    expect(res.sampleBias).toBeGreaterThan(0.5);
    expect(res.representativeness).toBeLessThan(0.6);
    expect(res.warning).toMatch(/bestätigt vor allem Sie selbst/);
  });

  it('einseitig ablehnende Stichprobe ist pessimistischer als die Realität', () => {
    // anger: lena -0.6, walter 0.1, doreen 0.9 → wahr ≈ 0.133; nur lena → -0.6.
    const res = preTest('anger', POP, ['lena']);
    expect(res.predictedReception).toBeLessThan(res.trueReception);
    expect(res.sampleBias).toBeLessThan(-0.15);
    expect(res.warning).toMatch(/pessimistischer/);
  });

  it('leere Stichprobe → Warnung', () => {
    expect(preTest('hope', POP, []).warning).toMatch(/Keine Personas/);
  });

  it('representativeness zählt abgedeckte Milieus', () => {
    expect(representativeness([lena], POP)).toBeCloseTo(1 / 3);
    expect(representativeness(POP, POP)).toBe(1);
  });
});
