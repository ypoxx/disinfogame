/**
 * VictorySystem — die Ausgangs-Entscheidung als pure Funktion (Etappe 1 + 3).
 * Pinnt die Prioritätsreihenfolge, insbesondere den neuen `immune`-Zweig
 * (Etappe 3): Abwehr ≥ 100 verliert VOR dem Sieg (Zielbild §4: Sieg verlangt
 * „Abwehr unter 100") und VOR dem Wahltag-Timeout.
 */
import { describe, it, expect } from 'vitest';
import {
  evaluateEnd,
  EXPOSED_RISK,
  IMMUNE_ABWEHR,
  type EndEvaluationInput,
} from '../engine/VictorySystem';

/** Laufendes Spiel ohne besondere Vorkommnisse. */
const base: EndEvaluationInput = {
  auftragProgressMin: 0.2,
  winThreshold: 0.5,
  abwehr: 30,
  risk: 20,
  phaseNumber: 10,
  maxPhases: 40,
};

describe('evaluateEnd (Etappe 3: der immune-Zweig)', () => {
  it('läuft weiter, solange nichts entschieden ist', () => {
    expect(evaluateEnd(base)).toBeNull();
  });

  it('Abwehr ≥ 100 → immune (Das Land hält stand)', () => {
    const d = evaluateEnd({ ...base, abwehr: IMMUNE_ABWEHR });
    expect(d?.branch).toBe('immune');
  });

  it('immune schlägt den Sieg: volle Abwehr verhindert den Auftrag-Erfolg (Zielbild §4)', () => {
    const d = evaluateEnd({ ...base, abwehr: 100, auftragProgressMin: 0.9 });
    expect(d?.branch).toBe('immune');
    expect(d?.auftragMet).toBe(true); // erfüllt, aber zu spät — das Land ist immun
  });

  it('immune schlägt den Timeout (wird VOR dem Wahltag geprüft)', () => {
    const d = evaluateEnd({ ...base, abwehr: 100, phaseNumber: 40 });
    expect(d?.branch).toBe('immune');
  });

  it('Enttarnung (risk ≥ 85, Auftrag offen) bleibt EIGENER Verlustweg vor immune (Falle 3)', () => {
    const d = evaluateEnd({ ...base, abwehr: 100, risk: EXPOSED_RISK });
    expect(d?.branch).toBe('exposed');
  });

  it('unter der Schwelle entscheidet weiter der Auftrag (victory)', () => {
    const d = evaluateEnd({ ...base, abwehr: 99, auftragProgressMin: 0.9 });
    expect(d?.branch).toBe('victory');
  });

  it('Wahltag erreicht, Auftrag verfehlt, Abwehr unter 100 → timeout (Wahlabend verloren)', () => {
    const d = evaluateEnd({ ...base, phaseNumber: 40 });
    expect(d?.branch).toBe('timeout');
  });
});
