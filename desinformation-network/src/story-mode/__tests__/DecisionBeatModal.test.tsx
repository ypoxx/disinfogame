/**
 * DecisionBeatModal (Spine Slice 4): das Präsentations-/Ergebnis-Modal eines
 * Entscheidungs-Beats rendert die Optionen, hebt die Berater-Empfehlung hervor, ruft
 * `onChoose` und zeigt nach der Wahl die Ergebnis-Ansicht (T1: Wirkung sichtbar).
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DecisionBeatModal } from '../components/DecisionBeatModal';
import { getDecisionBeat } from '../engine/DecisionBeats';
import type { DecisionBeatResult } from '../../game-logic/StoryEngineAdapter';

const stadtrat = getDecisionBeat('stadtrat')!;

describe('DecisionBeatModal', () => {
  it('rendert nichts ohne Beat / wenn unsichtbar', () => {
    const { container } = render(
      <DecisionBeatModal isVisible={false} beat={stadtrat} result={null} onChoose={() => {}} onClose={() => {}} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('Auswahl-Ansicht zeigt alle Optionen + die Berater-Empfehlung; Klick meldet die Option', () => {
    const onChoose = vi.fn();
    render(
      <DecisionBeatModal
        isVisible
        beat={stadtrat}
        result={null}
        recommendedOptionId="A"
        onChoose={onChoose}
        onClose={() => {}}
      />,
    );
    // Bühne + alle Optionen sichtbar.
    expect(screen.getByText(stadtrat.name_de)).toBeInTheDocument();
    for (const opt of stadtrat.optionen) {
      expect(screen.getByText(new RegExp(opt.label_de.slice(0, 12)))).toBeInTheDocument();
    }
    // Berater-Empfehlung markiert.
    expect(screen.getByText(/BERATER RÄT/)).toBeInTheDocument();
    // Klick auf die erste Option meldet ihre id.
    fireEvent.click(screen.getByText(/Hetzen/));
    expect(onChoose).toHaveBeenCalledWith('A');
  });

  it('Ergebnis-Ansicht zeigt Option, Technik und einen Schließen-Knopf', () => {
    const onClose = vi.fn();
    const result: DecisionBeatResult = {
      beatId: 'stadtrat',
      beatName_de: stadtrat.name_de,
      optionId: 'A',
      optionLabel_de: 'Hetzen — den Skandal aufladen',
      technik_de: 'Emotionalisierung / Skandalisierung',
      narrative_de: 'Treibt die Lager auseinander.',
      societyChanges: { polarisierung: 18 },
      resourceChanges: { attention: 18 },
    };
    render(
      <DecisionBeatModal isVisible beat={stadtrat} result={result} onChoose={() => {}} onClose={onClose} />,
    );
    expect(screen.getByText(/Emotionalisierung/)).toBeInTheDocument();
    expect(screen.getByText(/Polarisierung/)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/ZURÜCK AN DIE ARBEIT/));
    expect(onClose).toHaveBeenCalled();
  });
});
