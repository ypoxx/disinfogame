/**
 * Tests für EndReport-Komponente und Hilfsfunktionen.
 * Prüft Rendering, Zähllogik und Pivot-Berechnung.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  EndReport,
  findTrustPivots,
  countByLegality,
  topTags,
  type ActionCatalogEntry,
  type EndReportProps,
} from '../components/EndReport';
import type { TrustHistoryPoint } from '../../components/TrustEvolutionChart';

// ============================================
// TEST-FIXTURES
// ============================================

const minimalTrustHistory: TrustHistoryPoint[] = [
  { round: 0, actorTrust: {}, averageTrust: 0.8 },
  { round: 12, actorTrust: {}, averageTrust: 0.6 },
  { round: 24, actorTrust: {}, averageTrust: 0.4, event: { type: 'consequence', description: 'Leaks veröffentlicht' } },
];

const sampleCatalog: ActionCatalogEntry[] = [
  { id: 'a1', label: 'Pressekonferenz', legality: 'legal', tags: ['media', 'public'] },
  { id: 'a2', label: 'Falschmeldung', legality: 'illegal', tags: ['fake_news', 'media'] },
  { id: 'a3', label: 'Lobbyarbeit', legality: 'grey', tags: ['political'] },
  { id: 'a4', label: 'Bot-Netz', legality: 'illegal', tags: ['bots', 'media'] },
  { id: 'a5', label: 'Dokument-Leak', legality: 'illegal', tags: ['leak', 'media'] },
];

const defaultProps: EndReportProps = {
  endType: 'defeat',
  endTitle: 'Verhaftung',
  endNarrative: 'Die Operation wurde aufgedeckt.',
  phasesPlayed: 36,
  completedActionIds: ['a1', 'a2', 'a2', 'a3', 'a4'],
  actionsCatalog: sampleCatalog,
  trustHistory: minimalTrustHistory,
  finalResources: { budget: 1200, risk: 88, moralWeight: 65 },
  onClose: () => {},
};

// ============================================
// TESTS: findTrustPivots (pure Funktion)
// ============================================

describe('findTrustPivots', () => {
  it('gibt leere Liste zurück bei weniger als 2 Punkten', () => {
    expect(findTrustPivots([])).toHaveLength(0);
    expect(findTrustPivots([{ round: 0, actorTrust: {}, averageTrust: 0.5 }])).toHaveLength(0);
  });

  it('erkennt den größten Sprung korrekt', () => {
    const history: TrustHistoryPoint[] = [
      { round: 0, actorTrust: {}, averageTrust: 0.9 },
      { round: 12, actorTrust: {}, averageTrust: 0.5 },  // Delta 0.4 — größter
      { round: 24, actorTrust: {}, averageTrust: 0.4 },  // Delta 0.1
      { round: 36, actorTrust: {}, averageTrust: 0.35 }, // Delta 0.05
    ];

    const pivots = findTrustPivots(history, 1);
    expect(pivots).toHaveLength(1);
    expect(pivots[0].delta).toBeCloseTo(0.4, 2);
    expect(pivots[0].direction).toBe('down');
    expect(pivots[0].year).toBe(1); // round 12 → Jahr 1
  });

  it('erkennt Vertrauensgewinn als direction "up"', () => {
    const history: TrustHistoryPoint[] = [
      { round: 0, actorTrust: {}, averageTrust: 0.3 },
      { round: 6, actorTrust: {}, averageTrust: 0.7 },
    ];
    const pivots = findTrustPivots(history, 1);
    expect(pivots[0].direction).toBe('up');
  });

  it('gibt maximal topN Pivots zurück', () => {
    const history: TrustHistoryPoint[] = Array.from({ length: 10 }, (_, i) => ({
      round: i * 12,
      actorTrust: {},
      averageTrust: 1.0 - i * 0.08,
    }));
    expect(findTrustPivots(history, 3)).toHaveLength(3);
  });
});

// ============================================
// TESTS: countByLegality (pure Funktion)
// ============================================

describe('countByLegality', () => {
  it('zählt legal/grau/illegal korrekt', () => {
    const ids = ['a1', 'a2', 'a2', 'a3', 'a4'];
    const result = countByLegality(ids, sampleCatalog);
    expect(result.legal).toBe(1);   // a1
    expect(result.grey).toBe(1);    // a3
    expect(result.illegal).toBe(3); // a2, a2, a4
  });

  it('behandelt unbekannte Aktions-IDs als grey', () => {
    const result = countByLegality(['unknown_action'], sampleCatalog);
    expect(result.grey).toBe(1);
    expect(result.legal).toBe(0);
    expect(result.illegal).toBe(0);
  });

  it('gibt 0/0/0 bei leerem Input zurück', () => {
    const result = countByLegality([], sampleCatalog);
    expect(result.legal).toBe(0);
    expect(result.grey).toBe(0);
    expect(result.illegal).toBe(0);
  });
});

// ============================================
// TESTS: Komponenten-Rendering
// ============================================

describe('EndReport Komponente', () => {
  it('rendert mit Minimaldaten ohne Fehler', () => {
    render(<EndReport {...defaultProps} />);
    // Kein Absturz — einfaches Smoke-Test
  });

  it('zeigt den Endtitel an', () => {
    render(<EndReport {...defaultProps} />);
    expect(screen.getByText('Verhaftung')).toBeTruthy();
  });

  it('zeigt die Amtszeit korrekt an (36 Phasen = 3 Jahre)', () => {
    render(<EndReport {...defaultProps} phasesPlayed={36} />);
    expect(screen.getByText(/3 Jahre/)).toBeTruthy();
  });

  it('zeigt Schließen-Button und ruft onClose auf', async () => {
    const onClose = vi.fn();
    render(<EndReport {...defaultProps} onClose={onClose} />);
    const btn = screen.getByText('BERICHT SCHLIESSEN');
    await userEvent.click(btn);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('markiert das erreichte Ende in der Ending-Liste', () => {
    // endType 'defeat' → EndingCategory 'exposure' → Label 'Enthüllung'
    render(<EndReport {...defaultProps} endType="defeat" />);
    expect(screen.getByText(/Enthüllung/)).toBeTruthy();
    // "(erreicht)" als span soll genau einmal erscheinen
    const reachedSpans = screen.getAllByText('(erreicht)');
    expect(reachedSpans).toHaveLength(1);
  });
});

// ============================================
// TESTS: topTags
// ============================================

describe('topTags', () => {
  it('zählt Tags und sortiert absteigend', () => {
    // 'media' erscheint in a1, a2, a4, a5 = 4× (wenn alle genutzt)
    const ids = ['a1', 'a2', 'a4', 'a5'];
    const result = topTags(ids, sampleCatalog, 3);
    // 'media' sollte ganz oben stehen
    expect(result[0].tag).toBe('media');
    expect(result[0].count).toBe(4);
  });

  it('gibt maximal topN Einträge zurück', () => {
    const ids = ['a1', 'a2', 'a3', 'a4', 'a5'];
    expect(topTags(ids, sampleCatalog, 2)).toHaveLength(2);
  });

  it('gibt leere Liste bei leerem Input zurück', () => {
    expect(topTags([], sampleCatalog)).toHaveLength(0);
  });
});
