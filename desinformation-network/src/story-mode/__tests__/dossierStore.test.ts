/**
 * dossierStore: sammelt Fokusgruppen-Befunde über Runden. `record` mischt (dedupe),
 * `hydrate` ersetzt vollständig (Save/Load), `reset` leert (Spielneustart).
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { useDossierStore } from '../stores/dossierStore';
import type { Erkenntnis } from '../audience/dossierModel';

const a: Erkenntnis = { id: 'anger_wu_a', appeal: 'anger', segmentId: 'wu_a', value: 0.9, phase: 1 };
const b: Erkenntnis = { id: 'fear_wu_b', appeal: 'fear', segmentId: 'wu_b', value: 0.6, phase: 2 };

describe('dossierStore', () => {
  beforeEach(() => useDossierStore.getState().reset());

  it('record mischt neue Befunde ein (dedupe über id)', () => {
    useDossierStore.getState().record([a]);
    useDossierStore.getState().record([a, b]); // a erneut → kein Duplikat
    const f = useDossierStore.getState().findings;
    expect(f).toHaveLength(2);
  });

  it('hydrate ersetzt den Bestand vollständig (Save/Load)', () => {
    useDossierStore.getState().record([a]);
    useDossierStore.getState().hydrate([b]); // vollständiger Ersatz
    const f = useDossierStore.getState().findings;
    expect(f).toHaveLength(1);
    expect(f[0].id).toBe('fear_wu_b');
  });

  it('reset leert das Dossier (Spielneustart)', () => {
    useDossierStore.getState().record([a, b]);
    useDossierStore.getState().reset();
    expect(useDossierStore.getState().findings).toEqual([]);
  });
});
