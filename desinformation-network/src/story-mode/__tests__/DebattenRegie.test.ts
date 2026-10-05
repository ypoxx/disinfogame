/**
 * R2-Debatten (Berater-Regie, Owner §13): Trigger-Ableitung + Wortwechsel-Text.
 * Die reinen Bausteine; die Verzögerung/Auflösung im Hook ist Integrations-Ebene.
 */
import { describe, it, expect } from 'vitest';
import { deriveDebateTags, debateTurnsText } from '../hooks/useStoryGameState';
import { createStoryEngine, type StoryAction } from '../../game-logic/StoryEngineAdapter';
import type { Debate } from '../engine/DialogLoader';

const mk = (over: Partial<StoryAction>): StoryAction => ({
  id: 'x', label_de: 'Test', label_en: 'Test', narrative_de: '', narrative_en: '',
  phase: 'ta01', tags: [], legality: 'legal', costs: {}, available: true,
  prerequisites: [], prerequisitesMet: true, npcAffinity: [], ...over,
} as StoryAction);

describe('deriveDebateTags', () => {
  it('hohe Risiko-Kosten → high_risk_action', () => {
    expect(deriveDebateTags(mk({ costs: { risk: 3 } }))).toContain('high_risk_action');
    expect(deriveDebateTags(mk({ costs: { risk: 1 } }))).not.toContain('high_risk_action');
  });
  it('teure Aktion → expensive_action', () => {
    expect(deriveDebateTags(mk({ costs: { budget: 12 } }))).toContain('expensive_action');
  });
  it('Reichweiten-/Medien-Tags → viral_campaign', () => {
    expect(deriveDebateTags(mk({ tags: ['viral'] }))).toContain('viral_campaign');
    expect(deriveDebateTags(mk({ tags: ['media', 'reach'] }))).toContain('viral_campaign');
  });
  it('Feld-/Ziel-Tags → field_operation', () => {
    expect(deriveDebateTags(mk({ tags: ['field'] }))).toContain('field_operation');
    expect(deriveDebateTags(mk({ tags: ['targeting', 'intelligence'] }))).toContain('field_operation');
  });
  it('unauffällige Aufbau-Aktion → keine Debatten-Tags', () => {
    const tags = deriveDebateTags(mk({ tags: ['analysis'], costs: { risk: 0, budget: 2 } }));
    expect(tags).not.toContain('high_risk_action');
    expect(tags).not.toContain('viral_campaign');
    expect(tags).not.toContain('field_operation');
    expect(tags).not.toContain('expensive_action');
  });
});

describe('debateTurnsText', () => {
  const debate: Debate = {
    id: 'd', dialogue_type: 'debate', participants: ['alexei', 'marina'],
    turns: [
      { speaker: 'alexei', text_de: 'Zu riskant.' },
      { speaker: 'marina', text_de: 'Aber die Reichweite!' },
    ],
  };
  it('setzt die Sprecher-Namen vor jede Zeile', () => {
    const text = debateTurnsText(debate, (id) => (id === 'alexei' ? 'Alexei' : 'Marina'));
    expect(text).toBe('Alexei: Zu riskant.\n\nMarina: Aber die Reichweite!');
  });
});

describe('engine.getDebate (Auswahl heil, Tag-Filter greift)', () => {
  it('unbekannte Tags → null; frischer Stand crasht nicht', () => {
    const e = createStoryEngine('debate_smoke');
    expect(e.getDebate(['voellig_unbekannt'])).toBeNull();
    // high_risk_action bei frischem (niedrigem) Risiko: Bedingung risk>=50 nicht
    // erfüllt → null, aber kein Crash. (Debatten feuern in angespannter Lage.)
    const d = e.getDebate(['high_risk_action']);
    expect(d === null || typeof d.id === 'string').toBe(true);
  });
});
