/**
 * Finanzen — Geld-Tranchen (Etappe 5, E18). Pinnt die Bewertungs-Treppe:
 * liefern → Tranche/Bonus (Mahnstufe sinkt) · stagnieren → eskalierende Mahnung → Kürzung.
 */
import { describe, it, expect } from 'vitest';
import {
  bewerteTranche,
  istTrancheTag,
  TRANCHE_BASE,
  TRANCHE_BONUS_EXTRA,
  TRANCHE_KUERZUNG,
  TRANCHE_INTERVAL_DAYS,
  DELTA_BONUS,
  DELTA_PLAN,
} from '../engine/Finanzen';

describe('Finanzen — istTrancheTag', () => {
  it('feuert an Vielfachen des Intervalls, nie an Tag 0', () => {
    expect(istTrancheTag(0)).toBe(false);
    expect(istTrancheTag(TRANCHE_INTERVAL_DAYS)).toBe(true);
    expect(istTrancheTag(TRANCHE_INTERVAL_DAYS * 2)).toBe(true);
    expect(istTrancheTag(TRANCHE_INTERVAL_DAYS + 1)).toBe(false);
  });
});

describe('Finanzen — bewerteTranche', () => {
  const ctx = (delta: number, mahn = 0) => ({
    day: 10,
    progressNow: 0.2 + delta,
    progressAtLastTranche: 0.2,
    mahnstufe: mahn,
  });

  it('Übererfolg → Bonus, Mahnstufe zurück auf 0', () => {
    const r = bewerteTranche(ctx(DELTA_BONUS + 0.01, 2));
    expect(r.bewertung).toBe('bonus');
    expect(r.auszahlung).toBe(TRANCHE_BASE + TRANCHE_BONUS_EXTRA);
    expect(r.neueMahnstufe).toBe(0);
    expect(r.headline_de).not.toBe('');
  });

  it('im Plan → volle Tranche, Mahnstufe sinkt um 1', () => {
    const r = bewerteTranche(ctx(DELTA_PLAN + 0.001, 2));
    expect(r.bewertung).toBe('plan');
    expect(r.auszahlung).toBe(TRANCHE_BASE);
    expect(r.neueMahnstufe).toBe(1);
  });

  it('Stagnation eskaliert: Mahnung1 → Mahnung2 → Kürzung', () => {
    const m1 = bewerteTranche(ctx(0, 0));
    expect(m1.bewertung).toBe('mahnung1');
    expect(m1.neueMahnstufe).toBe(1);
    expect(m1.auszahlung).toBeGreaterThan(0);

    const m2 = bewerteTranche(ctx(0, 1));
    expect(m2.bewertung).toBe('mahnung2');
    expect(m2.auszahlung).toBe(0);

    const m3 = bewerteTranche(ctx(0, 2));
    expect(m3.bewertung).toBe('kuerzung');
    expect(m3.auszahlung).toBe(TRANCHE_KUERZUNG);
    expect(m3.auszahlung).toBeLessThan(0);
    expect(m3.headline_de).not.toBe('');
  });

  it('negativer Fortschritt zählt als Stagnation', () => {
    const r = bewerteTranche(ctx(-0.1, 0));
    expect(r.bewertung).toBe('mahnung1');
  });
});
