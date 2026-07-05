/**
 * WahlabendScene (Etappe 5, Paket C) — „Ein TV-Set, drei Enden" (Zielbild §9).
 * Prüft, dass das TV-Set rendert, die Sondersendung den GEFÄLSCHT-Stempel zieht
 * und ein Klick die Szene bis zum onComplete durchschaltet.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WahlabendScene } from '../components/WahlabendScene';

const baseProps = {
  partyName: 'Westunion Erwacht',
  startPollPct: 9,
  finalPollPct: 24,
  thresholdPct: 20,
  audience: [
    { label: 'Wutbürger', belief: 80, mood: 'angry' },
    { label: 'Mitte', belief: 40, mood: 'neutral' },
    { label: 'Aufgeklärte', belief: 10, mood: 'calm' },
  ],
  playerHeadlines: ['Skandal an der Klinik', 'Brücke bald gesperrt'],
  onComplete: () => {},
};

describe('WahlabendScene', () => {
  it('rendert die Titelkarte, dann das TV-Set beim Fortschalten', () => {
    render(<WahlabendScene {...baseProps} branch="victory" />);
    expect(screen.getByText(/DIE HOCHRECHNUNG/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('dialog'));
    expect(screen.getByTestId('tv-set')).toBeInTheDocument();
    expect(screen.getByText('Westunion Erwacht')).toBeInTheDocument();
  });

  it('Sondersendung (Enttarnt) zeigt den GEFÄLSCHT-Stempel', () => {
    render(<WahlabendScene {...baseProps} branch="exposed" />);
    const dialog = screen.getByRole('dialog');
    fireEvent.click(dialog); // → Sondersendung
    fireEvent.click(dialog); // → Belege durchgestrichen + Stempel
    expect(screen.getByText('GEFÄLSCHT')).toBeInTheDocument();
  });

  it('ein Klick am Ende ruft onComplete', () => {
    const onComplete = vi.fn();
    render(<WahlabendScene {...baseProps} branch="timeout" onComplete={onComplete} />);
    const dialog = screen.getByRole('dialog');
    fireEvent.click(dialog); // 0→1
    fireEvent.click(dialog); // 1→2
    fireEvent.click(dialog); // 2→3 (Wohnzimmer + WEITER)
    fireEvent.click(screen.getByText('WEITER ▸'));
    expect(onComplete).toHaveBeenCalled();
  });
});
