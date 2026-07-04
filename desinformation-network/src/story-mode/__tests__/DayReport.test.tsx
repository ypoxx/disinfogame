/**
 * DayReport (Etappe 3 Paket D): Nacht-Transparenz — das Tagesfazit weist die
 * nächtliche Abwehr-Regeneration aus (Zielbild §3: „Über Nacht holen die
 * Institutionen X Punkte zurück"). An Tag 1 (kein Vorgänger-Tag) entfällt die Zeile.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DayReport } from '../components/DayReport';
import type { NightReport } from '../engine/ImmuneSystem';

const baseProps = {
  phase: 3,
  headline: null,
  tierLabel: null,
  audienceSegments: [],
  counterHeadlines: [],
  resources: { risk: 10, budget: 40, attention: 5 },
  trustProgress: 50,
  onNextDay: vi.fn(),
};

const nightReport: NightReport = {
  day: 2,
  trustRegeneration: 2.1,
  abwehrDelta: 1.7,
  abwehrParts: { noise: 0.9, defenders: 0.5, baseline: 0.15 },
  abwehrAfter: 12.4,
};

describe('DayReport — Nacht-Transparenz', () => {
  it('zeigt die "Über Nacht"-Zeile mit Werten, wenn nightReport gesetzt ist', () => {
    render(<DayReport {...baseProps} nightReport={nightReport} />);
    expect(screen.getByText('Über Nacht')).toBeInTheDocument();
    expect(
      screen.getByText(/Institutionen holen 2,1 Punkte Vertrauen zurück · Abwehr \+1,7 → 12/),
    ).toBeInTheDocument();
    // Aufschlüsselung: alle drei Zuflüsse liegen über der 0,05-Schwelle.
    expect(screen.getByText(/Lärm \+0,9 · Verteidiger \+0,5 · Grundrauschen \+0,1/)).toBeInTheDocument();
  });

  it('lässt kleine Zuflüsse (<= 0,05) in der Aufschlüsselung weg', () => {
    const tiny: NightReport = {
      ...nightReport,
      abwehrParts: { noise: 0.9, defenders: 0.02, baseline: 0.15 },
    };
    render(<DayReport {...baseProps} nightReport={tiny} />);
    expect(screen.getByText(/Lärm \+0,9 · Grundrauschen \+0,1/)).toBeInTheDocument();
  });

  it('lässt die "Über Nacht"-Zeile weg, wenn nightReport null ist (Tag 1)', () => {
    render(<DayReport {...baseProps} nightReport={null} />);
    expect(screen.queryByText('Über Nacht')).not.toBeInTheDocument();
    expect(screen.queryByTestId('night-report-row')).not.toBeInTheDocument();
  });

  it('lässt die Zeile auch weg, wenn die Prop ganz fehlt', () => {
    render(<DayReport {...baseProps} />);
    expect(screen.queryByTestId('night-report-row')).not.toBeInTheDocument();
  });
});
