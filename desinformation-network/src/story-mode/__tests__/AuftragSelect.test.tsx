/**
 * Vergabe-Szene (Etappe 5, Zielbild §8): EINE Akte „Die Wahl", kein Auswahlmenü mehr.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuftragSelect } from '../components/AuftragSelect';
import { AUFTRAEGE, PARTEI_NAME_DE } from '../engine/Auftraege';

describe('AuftragSelect — Vergabe-Szene', () => {
  it('zeigt die EINE Akte „Die Wahl" mit Partei und Barometer', () => {
    render(<AuftragSelect onChoose={() => {}} />);
    expect(screen.getByText(AUFTRAEGE.wahl.titel_de)).toBeInTheDocument();
    expect(screen.getByText(PARTEI_NAME_DE)).toBeInTheDocument();
    expect(screen.getByText('STRENG GEHEIM')).toBeInTheDocument();
  });

  it('bietet keine Auswahl der anderen Archetypen mehr an', () => {
    render(<AuftragSelect onChoose={() => {}} />);
    expect(screen.queryByText(AUFTRAEGE.keil.titel_de)).not.toBeInTheDocument();
    expect(screen.queryByText(AUFTRAEGE.zweifel.titel_de)).not.toBeInTheDocument();
  });

  it('übernimmt die Akte mit onChoose("wahl")', () => {
    const onChoose = vi.fn();
    render(<AuftragSelect onChoose={onChoose} />);
    fireEvent.click(screen.getByText(/AKTE ÜBERNEHMEN/));
    expect(onChoose).toHaveBeenCalledWith('wahl');
  });
});
