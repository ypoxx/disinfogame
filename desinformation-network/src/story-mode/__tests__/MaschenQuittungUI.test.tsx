/**
 * Etappe 4 Paket D (E5/E8): die Verpuffungs-Quittung im Ergebnis-Modal — kühler
 * Kastenstempel, kein Rot-Alarm. Zeigt `text_de` nur, wenn das Maschen-Gedächtnis
 * die Wirkung spürbar gedämpft hat (`result.maschenQuittung` gesetzt).
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ActionFeedbackDialog } from '../components/ActionFeedbackDialog';
import type { ActionResult } from '../../game-logic/StoryEngineAdapter';

function baseResult(): ActionResult {
  return {
    success: true,
    action: {
      id: 'a1',
      label_de: 'Testaktion',
      label_en: 'Test action',
      narrative_de: '',
      narrative_en: '',
      phase: 'ta05',
      tags: [],
      legality: 'grey',
      costs: {},
      available: true,
      prerequisites: [],
      prerequisitesMet: true,
      npcAffinity: [],
    },
    effects: [],
    resourceChanges: {},
    narrative: {
      headline_de: 'Kopfzeile',
      headline_en: 'Headline',
      description_de: 'Beschreibung',
      description_en: 'Description',
    },
    potentialConsequences: [],
  } as unknown as ActionResult;
}

describe('ActionFeedbackDialog — Verpuffungs-Quittung (E5/E8)', () => {
  it('zeigt die Quittungs-Box mit text_de, wenn maschenQuittung gesetzt ist', () => {
    const result: ActionResult = {
      ...baseResult(),
      maschenQuittung: {
        text_de: 'Wirkung: gering. Grund: Masche bekannt — Prebunking-Kampagne der Landeszentrale, Tag 9.',
        multiplikator: 0.6,
        familieLabel: 'Emotionalisierung',
      },
    };
    render(<ActionFeedbackDialog isVisible result={result} onClose={() => {}} />);
    expect(
      screen.getByText(/Wirkung: gering\. Grund: Masche bekannt — Prebunking-Kampagne der Landeszentrale, Tag 9\./),
    ).toBeInTheDocument();
    expect(screen.getByText(/Emotionalisierung/)).toBeInTheDocument();
  });

  it('zeigt keine Quittungs-Box, wenn maschenQuittung fehlt', () => {
    render(<ActionFeedbackDialog isVisible result={baseResult()} onClose={() => {}} />);
    expect(screen.queryByText(/Grund: Masche bekannt/)).not.toBeInTheDocument();
  });
});
