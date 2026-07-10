/**
 * useAudienceBroadcast — Ereignis-Feed (§7) & Wochenschau am Phasen-Ende.
 * Sichert: Narrativ-Ereignisse werden als eigene Sendung mit Motiv gezeigt, ein
 * gleicher `key` sendet nicht doppelt, die Wochenschau läuft nach einer Maßnahme,
 * und ein Ereignis sticht die routinemäßige Wochenschau bei gleichzeitigem Anfall.
 */
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAudienceBroadcast, type BroadcastNarrativeEvent } from '../broadcast/useAudienceBroadcast';
import type { ActionResult } from '../../game-logic/StoryEngineAdapter';

function measure(id = 'a1'): ActionResult {
  return {
    success: true,
    action: {
      id, label_de: id, label_en: id, narrative_de: '', narrative_en: '',
      headline_de: 'Maßnahme läuft', phase: 'ta05', tags: ['bots'], legality: 'grey',
      costs: { attention: 2 }, available: true, prerequisites: [], prerequisitesMet: true, npcAffinity: [],
    },
    effects: [], resourceChanges: {},
    narrative: { headline_de: 'Maßnahme läuft', headline_en: '', description_de: '', description_en: '' },
    potentialConsequences: [],
  } as unknown as ActionResult;
}

const krise: BroadcastNarrativeEvent = { key: 'crisis_1', category: 'krise', headline: 'Krise!' };

describe('useAudienceBroadcast — Ereignis-Feed & Wochenschau', () => {
  it('zeigt ein Narrativ-Ereignis als eigene Sendung mit passendem Motiv', () => {
    const { result } = renderHook(
      ({ e }) => useAudienceBroadcast(null, 1, 10, undefined, e),
      { initialProps: { e: krise as BroadcastNarrativeEvent | null } },
    );
    expect(result.current.lastItem?.category).toBe('krise');
    expect(result.current.lastItem?.motifId).toBe('bc_krise');
  });

  it('sendet den gleichen key nicht doppelt (Dedupe per key)', () => {
    const { result, rerender } = renderHook(
      ({ e }) => useAudienceBroadcast(null, 1, 10, undefined, e),
      { initialProps: { e: krise as BroadcastNarrativeEvent | null } },
    );
    const first = result.current.lastItem;
    // Neues Objekt, gleicher key → kein neues Item.
    rerender({ e: { ...krise } });
    expect(result.current.lastItem).toBe(first);
  });

  it('läuft die Wochenschau am Phasen-Ende, wenn eine Maßnahme lief', () => {
    const m = measure();
    const { result, rerender } = renderHook(
      ({ a, p }) => useAudienceBroadcast(a, p, 10),
      { initialProps: { a: null as ActionResult | null, p: 1 } },
    );
    rerender({ a: m, p: 1 }); // Maßnahme läuft
    expect(result.current.lastItem?.category).toBe('massnahme');
    rerender({ a: m, p: 2 }); // Phasenwechsel (gleiche m-Referenz → kein Re-Fire der Aktion)
    expect(result.current.lastItem?.category).toBe('wochenschau');
    expect(result.current.lastItem?.motifId).toBe('bc_wochenschau');
  });

  it('färbt bei einem Ereignis nur die überzeugten Milieus (§4 Wirkungs-Treppe)', () => {
    // wu_zorniger startet mit belief 0.5 (>0.45) → wird vom Nudge erfasst;
    // wu_liberale startet mit belief 0.15 → bleibt unberührt.
    const { result, rerender } = renderHook(
      ({ e }) => useAudienceBroadcast(null, 1, 10, undefined, e),
      { initialProps: { e: null as BroadcastNarrativeEvent | null } },
    );
    expect(result.current.country.segments.find((s) => s.id === 'wu_zorniger')?.belief).toBeGreaterThan(0.45);
    rerender({ e: { key: 'k1', category: 'krise', headline: 'X' } });
    expect(result.current.country.segments.find((s) => s.id === 'wu_zorniger')?.mood).toBe('verunsichert');
    expect(result.current.country.segments.find((s) => s.id === 'wu_liberale')?.mood).toBe('ruhig');
  });

  it('Enttarnung macht die überzeugten Milieus misstrauisch', () => {
    const { result, rerender } = renderHook(
      ({ e }) => useAudienceBroadcast(null, 1, 10, undefined, e),
      { initialProps: { e: null as BroadcastNarrativeEvent | null } },
    );
    rerender({ e: { key: 'e1', category: 'enttarnung', headline: 'X' } });
    expect(result.current.country.segments.find((s) => s.id === 'wu_zorniger')?.mood).toBe('misstrauisch');
  });

  it('Wahltag färbt NICHT (EVENT_MOOD lässt wahltag bewusst aus)', () => {
    const { result, rerender } = renderHook(
      ({ e }) => useAudienceBroadcast(null, 1, 10, undefined, e),
      { initialProps: { e: null as BroadcastNarrativeEvent | null } },
    );
    const before = result.current.country.segments.find((s) => s.id === 'wu_zorniger')?.mood;
    rerender({ e: { key: 'w1', category: 'wahltag', headline: 'X' } });
    expect(result.current.lastItem?.category).toBe('wahltag'); // Sendung läuft,
    expect(result.current.country.segments.find((s) => s.id === 'wu_zorniger')?.mood).toBe(before); // aber ohne Stimmungs-Nudge.
  });

  it('ein Ereignis sticht die Wochenschau, wenn beides zusammenfällt', () => {
    const m = measure();
    const { result, rerender } = renderHook(
      ({ a, p, e }) => useAudienceBroadcast(a, p, 10, undefined, e),
      { initialProps: { a: null as ActionResult | null, p: 1, e: null as BroadcastNarrativeEvent | null } },
    );
    rerender({ a: m, p: 1, e: null }); // Maßnahme diese Phase
    // Phasenwechsel UND neues Ereignis gleichzeitig
    rerender({ a: m, p: 2, e: { key: 'crisis_9', category: 'krise', headline: 'Zugleich' } });
    expect(result.current.lastItem?.category).toBe('krise');
  });
});
