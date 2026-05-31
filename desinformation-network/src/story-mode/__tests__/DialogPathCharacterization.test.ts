/**
 * Charakterisierungs-Test: NPC-Dialog-Pfade (Stand 2026-05-31)
 *
 * Zweck (zweifach):
 *  1) SICHERUNGSNETZ: hält das aktuelle Verhalten fest, damit spätere Reparaturen
 *     nichts unbemerkt kaputt machen.
 *  2) BELEG des gemeldeten Fehlers: Die App löst NPC-Reaktionen mit ERGEBNIS-Stichworten
 *     ('success' / 'failure' / 'crisis') aus. Die autorisierten Reaktionen in dialogues.json
 *     tragen aber HANDLUNGS-Stichworte ('harassment', 'analysis', 'data', ...). Es gibt also
 *     keinen Treffer -> das Spiel fällt auf immer denselben Einzeiler zurück.
 *
 * Siehe docs/DIALOGUE_DIAGNOSIS.md
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { DialogLoader, type DialogueContext } from '../engine/DialogLoader';
import dialoguesData from '../data/dialogues.json';

const NPCS = ['direktor', 'marina', 'alexei', 'katja', 'igor'] as const;

// Genau diese Stichworte schickt der Spielablauf an das Reaktions-System
// (siehe StoryEngineAdapter.getNPCDialogue, Zweig 'reaction').
const APP_REACTION_TAGS = ['success', 'failure', 'crisis'];

const baseContext: DialogueContext = {
  phase: 30,
  risk: 50,
  morale: 60,
  budget: 5000,
  relationshipLevel: 1,
  attention: 40,
  capacity: 3,
  memoryTags: [],
};

function authoredReactionTags(npcId: string): Set<string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reactions = (dialoguesData as any).npcs?.[npcId]?.reactions ?? {};
  const tags = new Set<string>();
  for (const category of Object.values(reactions)) {
    if (!Array.isArray(category)) continue;
    for (const reaction of category) {
      for (const tag of reaction?.triggered_by_tags ?? []) tags.add(tag);
    }
  }
  return tags;
}

describe('Charakterisierung: NPC-Dialog-Pfade (2026-05-31)', () => {
  let loader: DialogLoader;

  beforeEach(() => {
    loader = new DialogLoader();
    loader.resetState();
  });

  it('BUG: App-Reaktions-Stichworte (success/failure/crisis) passen zu KEINER autorisierten Reaktion', () => {
    for (const id of NPCS) {
      const authored = authoredReactionTags(id);
      // Inhalt IST vorhanden ...
      expect(authored.size).toBeGreaterThan(0);
      // ... aber die Stichworte, die die App tatsächlich schickt, kommen darin nicht vor:
      for (const appTag of APP_REACTION_TAGS) {
        expect(authored.has(appTag)).toBe(false);
      }
    }
  });

  it('FUNKTIONIERT: Begrüßungen liefern Inhalt (alle NPCs, Stufe 0)', () => {
    for (const id of NPCS) {
      expect(loader.getGreeting(id, 0)).not.toBeNull();
    }
  });

  it('FUNKTIONIERT: Themen-Gespräche liefern reichen Inhalt (Beispiele)', () => {
    expect(loader.getTopicDialogue('igor', 'budget', 'intro', baseContext, () => 0.1)).not.toBeNull();
    expect(loader.getTopicDialogue('direktor', 'mission', 'intro', baseContext, () => 0.1)).not.toBeNull();
  });
});
