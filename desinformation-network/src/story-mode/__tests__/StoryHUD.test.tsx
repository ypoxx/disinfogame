/**
 * StoryHUD: die zwei Rennläufer müssen sichtbar sein — die SONNTAGSFRAGE (eigener Läufer,
 * Etappe 5, Zielbild §6) mit Zielstrich UND die ABWEHR (zweiter Läufer, Etappe 3) mit den
 * Stufen-Marken. Etappe 5 (§6/§12.4): Risiko/Aufmerksamkeit sind KEINE HUD-Größen mehr.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StoryHUD } from '../components/StoryHUD';

const baseProps = {
  resources: { budget: 50, capacity: 60, risk: 20, attention: 15, moralWeight: 10 },
  phase: { current: 5, year: 1, month: 1, electionDay: 40, actionPoints: 3, maxActionPoints: 5 },
  objectives: [],
  sonntagsfrage: { pollPct: 18, thresholdPct: 20, auftragTitel: 'Die Wahl' },
};

describe('StoryHUD — ABWEHR-Balken', () => {
  it('rendert ABWEHR-Balken mit Wert und drei Stufen-Marken, wenn abwehr gesetzt ist', () => {
    render(
      <StoryHUD
        {...baseProps}
        abwehr={42}
        abwehrStageInfo={{ stages: [25, 50, 75], fired: [25] }}
      />,
    );
    expect(screen.getByText('ABWEHR')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByTestId('abwehr-stage-mark-25')).toBeInTheDocument();
    expect(screen.getByTestId('abwehr-stage-mark-50')).toBeInTheDocument();
    expect(screen.getByTestId('abwehr-stage-mark-75')).toBeInTheDocument();
  });

  it('zeigt keinen ABWEHR-Balken, wenn die Prop fehlt (Rückwärts-Kompatibilität)', () => {
    render(<StoryHUD {...baseProps} />);
    expect(screen.queryByTestId('abwehr-bar')).not.toBeInTheDocument();
  });

  it('zeigt die SONNTAGSFRAGE (eigener Läufer) mit Zielstrich + KASSE', () => {
    render(
      <StoryHUD
        {...baseProps}
        abwehr={10}
        abwehrStageInfo={{ stages: [25, 50, 75], fired: [] }}
      />,
    );
    expect(screen.getByTestId('sonntagsfrage-bar')).toBeInTheDocument();
    expect(screen.getByText('SONNTAGSFRAGE')).toBeInTheDocument();
    expect(screen.getByTestId('sonntagsfrage-schwelle')).toBeInTheDocument();
    expect(screen.getByText('KASSE')).toBeInTheDocument();
  });

  it('Etappe 5 (§12.4): RISIKO/AUFMERKSAMKEIT sind KEINE HUD-Größen mehr', () => {
    render(<StoryHUD {...baseProps} abwehr={10} abwehrStageInfo={{ stages: [25, 50, 75], fired: [] }} />);
    expect(screen.queryByText('RISIKO')).not.toBeInTheDocument();
    expect(screen.queryByText('AUFMERKSAMKEIT')).not.toBeInTheDocument();
  });

  it('zeigt die situative Enttarnungs-Warnung nur bei laufender Untersuchung', () => {
    const { rerender } = render(<StoryHUD {...baseProps} exposureCountdown={null} />);
    expect(screen.queryByTestId('exposure-warning')).not.toBeInTheDocument();
    rerender(<StoryHUD {...baseProps} exposureCountdown={3} />);
    expect(screen.getByTestId('exposure-warning')).toBeInTheDocument();
  });
});
