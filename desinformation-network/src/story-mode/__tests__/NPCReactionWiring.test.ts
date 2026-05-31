/**
 * Beweis-Test für den Reaktions-Fix (2026-05-31).
 *
 * Vorher: Nach einer normalen Aktion zeigte das Spiel KEINE bzw. immer dieselbe
 * hartkodierte NPC-Reaktion, weil `processNPCReactions` die reichen, autorisierten
 * Reaktionen aus `dialogues.json` nie abfragte (getReaction war nur über einen toten
 * Pfad erreichbar).
 *
 * Nachher: `executeAction` liefert für die Affinitäts-NPCs eine ECHTE autorisierte
 * Reaktion, ausgelöst über die echten Aktions-Tags.
 *
 * Siehe docs/DIALOGUE_DIAGNOSIS.md
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { createStoryEngine, type StoryEngineAdapter } from '../../game-logic/StoryEngineAdapter';
import dialoguesData from '../data/dialogues.json';

// Alle autorisierten Reaktions-Texte einer Figur (über alle Kategorien)
function authoredReactionTexts(npcId: string): Set<string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reactions = (dialoguesData as any).npcs?.[npcId]?.reactions ?? {};
  const texts = new Set<string>();
  for (const category of Object.values(reactions)) {
    if (!Array.isArray(category)) continue;
    for (const r of category) if (r?.text_de) texts.add(r.text_de);
  }
  return texts;
}

describe('NPC-Reaktions-Verdrahtung (autorisierte Reaktionen erreichen den Live-Pfad)', () => {
  let engine: StoryEngineAdapter;

  beforeEach(() => {
    engine = createStoryEngine('test-seed-123');
  });

  it('zeigt nach einer Analyse-Aktion (1.1) eine ECHTE autorisierte Marina-Reaktion', () => {
    // Aktion 1.1 "Zielgruppe analysieren": tags ['analysis', ...], npc_affinity ['marina'],
    // moralWeight 0 -> erzeugte vorher GAR KEINE Marina-Reaktion.
    const result = engine.executeAction('1.1');

    const marinaReaction = result.npcReactions?.find(r => r.npcId === 'marina');
    expect(marinaReaction, 'Marina sollte auf eine Analyse-Aktion reagieren').toBeDefined();

    // Der Text muss aus den autorisierten Reaktionen stammen (nicht leer, nicht hartkodiert):
    expect(authoredReactionTexts('marina').has(marinaReaction!.dialogue_de)).toBe(true);
    expect(marinaReaction!.reaction).not.toBe('crisis'); // eine Analyse ist keine Krise
  });
});
