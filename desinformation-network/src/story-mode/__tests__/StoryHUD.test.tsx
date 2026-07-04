/**
 * StoryHUD (Etappe 3 Paket D): der ABWEHR-Balken — der zweite Rennläufer — muss
 * sichtbar sein mit Zahl + den drei Stufen-Marken (25/50/75, Zielbild §3).
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StoryHUD } from '../components/StoryHUD';

const baseProps = {
  resources: { budget: 50, capacity: 60, risk: 20, attention: 15, moralWeight: 10 },
  phase: { current: 5, year: 1, month: 1, electionDay: 40, actionPoints: 3, maxActionPoints: 5 },
  objectives: [],
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

  it('behält bestehende HUD-Größen (z. B. RISIKO) bei — nichts wurde entfernt', () => {
    render(
      <StoryHUD
        {...baseProps}
        abwehr={10}
        abwehrStageInfo={{ stages: [25, 50, 75], fired: [] }}
      />,
    );
    expect(screen.getByText('RISIKO')).toBeInTheDocument();
    expect(screen.getByText('BUDGET')).toBeInTheDocument();
  });
});
