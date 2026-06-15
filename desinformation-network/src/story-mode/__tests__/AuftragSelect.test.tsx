/**
 * P5 — Auftrags-Wahl beim Einstieg/Neustart.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuftragSelect } from '../components/AuftragSelect';
import { AUFTRAEGE } from '../engine/Auftraege';

describe('AuftragSelect', () => {
  it('zeigt alle drei Auftrags-Archetypen', () => {
    render(<AuftragSelect onChoose={() => {}} />);
    for (const a of Object.values(AUFTRAEGE)) {
      expect(screen.getByText(a.titel_de)).toBeInTheDocument();
    }
  });

  it('ruft onChoose mit der gewählten Auftrags-ID', () => {
    const onChoose = vi.fn();
    render(<AuftragSelect onChoose={onChoose} />);
    fireEvent.click(screen.getByText(AUFTRAEGE.zweifel.titel_de));
    expect(onChoose).toHaveBeenCalledWith('zweifel');
  });

  it('onSkip übernimmt den Einstiegs-Auftrag', () => {
    const onSkip = vi.fn();
    render(<AuftragSelect onChoose={() => {}} onSkip={onSkip} />);
    fireEvent.click(screen.getByText(/Einstiegs-Auftrag/));
    expect(onSkip).toHaveBeenCalled();
  });
});
