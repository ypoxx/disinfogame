/**
 * rennen — geteilte Skala/Formatierung der zwei Läufer: HUD, Lagebild und
 * Tafel müssen dieselben Zahlen identisch darstellen (Review 2026-07-07).
 */
import { describe, expect, it } from 'vitest';
import { formatAbwehr, formatPollPct, formatSchwellePct, sonntagsfrageScale } from '../utils/rennen';

describe('sonntagsfrageScale', () => {
  it('Zielstrich liegt unter 100 % (klebt nie am Rand) und reached kippt an der Schwelle', () => {
    const s = sonntagsfrageScale(9, 20);
    expect(s.linePct).toBeCloseTo((20 / 26) * 100, 5);
    expect(s.barPct).toBeCloseTo((9 / 26) * 100, 5);
    expect(s.reached).toBe(false);
    expect(sonntagsfrageScale(20, 20).reached).toBe(true);
  });

  it('Balken übersteigt 100 % nie, auch wenn der Poll über der Schwelle liegt', () => {
    const s = sonntagsfrageScale(60, 20);
    expect(s.barPct).toBeLessThanOrEqual(100);
    expect(s.reached).toBe(true);
  });
});

describe('Formatierung', () => {
  it('Poll mit deutschem Komma, Schwelle ganzzahlig, Abwehr geclampt', () => {
    expect(formatPollPct(9)).toBe('9,0 %');
    expect(formatPollPct(18.35)).toBe('18,4 %');
    expect(formatSchwellePct(20)).toBe('20 %');
    expect(formatAbwehr(41.7)).toBe('42/100');
    expect(formatAbwehr(140)).toBe('100/100');
    expect(formatAbwehr(-3)).toBe('0/100');
  });
});
