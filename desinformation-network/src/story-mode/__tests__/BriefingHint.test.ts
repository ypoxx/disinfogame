/**
 * Test für P0b / B5 / D-4: konkrete, diegetische Direktor-Tageshinweise.
 *
 * Der Hinweis benennt das drängendste Problem MIT Zahl und verweist auf das
 * zuständige Büro (nicht klickbar). Prioritäts-Reihenfolge nach Dringlichkeit.
 */
import { describe, it, expect } from 'vitest';
import { deriveBriefingHint } from '../components/MorningBriefing';

const base = { risk: 20, attention: 10, budget: 120, trustProgress: 0.7 };

describe('deriveBriefingHint (konkrete Direktor-Hinweise)', () => {
  it('warnt bei hohem Risiko zuerst und verweist auf Alexei / Cyber-Lab', () => {
    const h = deriveBriefingHint({ ...base, risk: 72 });
    expect(h.problem).toContain('72');
    expect(h.problem.toLowerCase()).toContain('risiko');
    expect(h.pointer).toContain('Alexei');
    expect(h.pointer).toContain('Cyber-Lab');
  });

  it('weist bei knapper Kasse auf Igor / Finanzen hin', () => {
    const h = deriveBriefingHint({ ...base, budget: 8 });
    expect(h.problem).toContain('8');
    expect(h.pointer).toContain('Igor');
    expect(h.pointer).toContain('Finanzen');
  });

  it('Risiko hat Vorrang vor knapper Kasse', () => {
    const h = deriveBriefingHint({ ...base, risk: 80, budget: 5 });
    expect(h.pointer).toContain('Alexei');
  });

  it('warnt bei wacher Gegenseite und verweist auf Katja / Feld-Operationen', () => {
    const h = deriveBriefingHint({ ...base, attention: 66 });
    expect(h.problem).toContain('66');
    expect(h.pointer).toContain('Katja');
    expect(h.pointer).toContain('Feld');
  });

  it('verweist bei stockendem Fortschritt auf Marina / Medien-Zentrum', () => {
    const h = deriveBriefingHint({ ...base, trustProgress: 0.2 });
    expect(h.problem).toContain('20');
    expect(h.pointer).toContain('Marina');
    expect(h.pointer).toContain('Medien-Zentrum');
  });

  it('lobt bei guter Lage und nennt den erreichten Prozentsatz', () => {
    const h = deriveBriefingHint({ ...base, trustProgress: 0.85 });
    expect(h.problem).toContain('85');
    expect(h.pointer).toContain('Marina');
  });

  it('liefert immer Problem UND Pointer (nie leer)', () => {
    for (const s of [base, { ...base, risk: 99 }, { ...base, budget: 0 }]) {
      const h = deriveBriefingHint(s);
      expect(h.problem.trim().length).toBeGreaterThan(0);
      expect(h.pointer.trim().length).toBeGreaterThan(0);
    }
  });
});
