/**
 * DecisionBeats (Spine Slice 4): die Inhalts-Schicht + das testbare Qualitäts-Gate.
 * Pinnt die Autoren-Disziplin aus `BEAT_MUSTER_KATALOG.md`: jede Option ist für ≥1
 * Strategie/Lage die beste (Deckung) und keine für alle (kein Universalsieger).
 */
import { describe, it, expect } from 'vitest';
import {
  ALL_DECISION_BEATS,
  getDecisionBeat,
  recommendOption,
  evaluateBeatGate,
  unresolvedDecisionCandidates,
} from '../engine/DecisionBeats';

describe('DecisionBeats — Struktur', () => {
  it('jeder Beat hat ≥3 Optionen mit stabilen ids und mappt auf bestehende Achsen', () => {
    for (const beat of ALL_DECISION_BEATS) {
      expect(beat.optionen.length).toBeGreaterThanOrEqual(3);
      const ids = beat.optionen.map((o) => o.id);
      expect(new Set(ids).size).toBe(ids.length); // eindeutig
      expect(beat.vorgriffZeile_de.length).toBeGreaterThan(0);
    }
  });
});

describe('DecisionBeats — Qualitäts-Gate (Deckung + kein Universalsieger)', () => {
  it('alle authorierten Beats bestehen das Gate', () => {
    for (const beat of ALL_DECISION_BEATS) {
      const gate = evaluateBeatGate(beat);
      expect(gate.coverage, `${beat.id}: ungedeckte Optionen ${gate.uncovered.join(',')}`).toBe(true);
      expect(gate.noUniversalWinner, `${beat.id}: Universalsieger`).toBe(true);
      expect(gate.ok).toBe(true);
    }
  });
});

describe('DecisionBeats — Strategie-Relativität (Stadtrat)', () => {
  const stadtrat = getDecisionBeat('stadtrat')!;
  it('Keil → A (Hetzen), Wahl → C (Fraktion), Zweifel → B (Einschleusen)', () => {
    expect(recommendOption(stadtrat, 'keil').id).toBe('A');
    expect(recommendOption(stadtrat, 'wahl').id).toBe('C');
    expect(recommendOption(stadtrat, 'zweifel').id).toBe('B');
  });
  it('überhitzte Lage schlägt den Auftrag → D (Abkühlen) als Ventil', () => {
    expect(recommendOption(stadtrat, 'keil', true).id).toBe('D');
    expect(recommendOption(stadtrat, 'wahl', true).id).toBe('D');
  });
});

describe('DecisionBeats — Strategie-Relativität (Reale Vorlage, sauberes 1:1)', () => {
  const rv = getDecisionBeat('reale_vorlage')!;
  it('Zweifel → A (Verkürzen), Keil → B (Aufbauschen), Wahl → C (Anreichern)', () => {
    expect(recommendOption(rv, 'zweifel').id).toBe('A');
    expect(recommendOption(rv, 'keil').id).toBe('B');
    expect(recommendOption(rv, 'wahl').id).toBe('C');
  });
  it('überhitzt → D (Liegenlassen)', () => {
    expect(recommendOption(rv, 'zweifel', true).id).toBe('D');
  });
});

describe('DecisionBeats — Director-Kandidaten', () => {
  it('liefert unaufgelöste Beats; aufgelöste fallen raus', () => {
    expect(unresolvedDecisionCandidates([]).map((c) => c.id)).toEqual(['stadtrat', 'reale_vorlage']);
    const rest = unresolvedDecisionCandidates(['stadtrat']);
    expect(rest.map((c) => c.id)).toEqual(['reale_vorlage']);
    expect(rest[0].vorgriffZeile_de).toContain('Video');
    expect(unresolvedDecisionCandidates(['stadtrat', 'reale_vorlage'])).toEqual([]);
  });
});
