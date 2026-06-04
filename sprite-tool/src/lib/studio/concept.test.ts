import { describe, it, expect } from 'vitest';
import { npcLines, describeNpc, type ConceptNpc } from '@/lib/studio/concept';

const marina: ConceptNpc = {
  id: 'marina',
  name: 'Marina',
  role_de: 'Pressechefin',
  personality: { traits: ['kühl', 'kontrolliert'] },
  dialogues: {
    greetings: { '0': 'Guten Tag.', '1': '' },
    reactions: { success: 'Gut gemacht.' },
    topics: { presse: 'Kein Kommentar.' },
  },
};

describe('npcLines', () => {
  it('extrahiert Begrüßungen, Reaktionen und Topics mit stabilen Keys', () => {
    const lines = npcLines(marina);
    expect(lines).toContainEqual({ key: 'greeting_0', category: 'greeting', text: 'Guten Tag.' });
    expect(lines).toContainEqual({ key: 'reaction_success', category: 'reaction', text: 'Gut gemacht.' });
    expect(lines).toContainEqual({ key: 'topic_presse', category: 'topic', text: 'Kein Kommentar.' });
  });

  it('überspringt leere Zeilen', () => {
    expect(npcLines(marina).some((l) => l.key === 'greeting_1')).toBe(false);
  });

  it('liefert eine leere Liste, wenn keine Dialoge da sind', () => {
    expect(npcLines({ id: 'x', name: 'X' })).toEqual([]);
  });
});

describe('describeNpc', () => {
  it('fasst Name, Rolle und Eigenschaften zusammen', () => {
    expect(describeNpc(marina)).toBe('Marina (Pressechefin) — kühl, kontrolliert');
  });
  it('lässt fehlende Teile weg', () => {
    expect(describeNpc({ id: 'x', name: 'Nur Name' })).toBe('Nur Name');
  });
});
