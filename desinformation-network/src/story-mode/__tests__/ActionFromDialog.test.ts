/**
 * Test für P1a — „Aktion aus Dialog": kontextuelle Maßnahmen-Angebote eines NPCs.
 * buildActionOfferChoices filtert nach npc_affinity + Verfügbarkeit, deckelt die Anzahl
 * und beschriftet mit der plakativen Überschrift (B5).
 */
import { describe, it, expect } from 'vitest';
import { buildActionOfferChoices } from '../hooks/useStoryGameState';
import type { StoryAction } from '../../game-logic/StoryEngineAdapter';

function mk(
  id: string,
  npcAffinity: string[],
  available: boolean,
  headline_de?: string,
): StoryAction {
  return {
    id,
    label_de: `Label ${id}`,
    label_en: id,
    headline_de,
    narrative_de: '',
    narrative_en: '',
    phase: 'ta01',
    tags: [],
    legality: 'legal',
    costs: { budget: 5, capacity: 1 },
    available,
    prerequisites: [],
    prerequisitesMet: true,
    npcAffinity,
  } as StoryAction;
}

describe('buildActionOfferChoices (Aktion aus Dialog)', () => {
  const actions = [
    mk('1.1', ['marina'], true, 'Zielgruppe durchleuchtet'),
    mk('2.1', ['volkov', 'igor'], true, 'Bot-Netzwerk gestartet'),
    mk('1.4', ['marina'], false, 'Akteur-Dossier angelegt'), // nicht verfügbar
    mk('3.1', ['katja'], true, 'Falschmeldung in Umlauf gebracht'),
  ];

  it('bietet nur verfügbare Aktionen des passenden NPCs an', () => {
    const offers = buildActionOfferChoices(actions, 'marina');
    expect(offers.map(o => o.id)).toEqual(['action_1.1']); // 1.4 ist nicht verfügbar
  });

  it('Choice-Id folgt der action_-Konvention und Text nutzt die Überschrift (B5)', () => {
    const [offer] = buildActionOfferChoices(actions, 'igor');
    expect(offer.id).toBe('action_2.1');
    expect(offer.text).toContain('Bot-Netzwerk gestartet');
    expect(offer.cost?.budget).toBe(5);
  });

  it('deckelt die Anzahl der Angebote', () => {
    const many = Array.from({ length: 6 }, (_, i) => mk(`9.${i}`, ['katja'], true, `Maßnahme ${i}`));
    expect(buildActionOfferChoices(many, 'katja', 3)).toHaveLength(3);
  });

  it('fällt auf label_de zurück, wenn keine Überschrift gesetzt ist', () => {
    const [offer] = buildActionOfferChoices([mk('x.1', ['katja'], true)], 'katja');
    expect(offer.text).toContain('Label x.1');
  });

  it('gibt nichts zurück, wenn der NPC keine passenden Aktionen hat', () => {
    expect(buildActionOfferChoices(actions, 'direktor')).toEqual([]);
  });
});
