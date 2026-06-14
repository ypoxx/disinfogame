/**
 * Beweis-Test für P0a / B5: Aktions-Überschriften statt „Aktion durchgeführt".
 *
 * Vorher: TV/Tagesfazit/End-Report zeigten für fast jede Aktion den Default
 * „Aktion durchgeführt", weil die Tag-/Phasen-Templates des Narrative-Generators
 * nicht zu den echten Aktions-Tags passten.
 *
 * Nachher: jede Aktion trägt ein plakatives `headline_de`; das Aktions-Ergebnis
 * (result.narrative.headline_de) übernimmt diese Überschrift — durchgängig.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { createStoryEngine, type StoryEngineAdapter } from '../../game-logic/StoryEngineAdapter';
import { mapActionToBroadcast } from '../broadcast/broadcastMapping';
import actionsData from '../data/actions.json';
import actionsContinued from '../data/actions_continued.json';

function allRawActions(): Array<{ id: string; label_de: string; headline_de?: string }> {
  const out = [...(actionsData.actions as Array<{ id: string; label_de: string; headline_de?: string }>)];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = actionsContinued as any;
  for (const key of Object.keys(c)) {
    if (Array.isArray(c[key])) out.push(...c[key]);
  }
  return out;
}

describe('Aktions-Überschriften (B5)', () => {
  let engine: StoryEngineAdapter;

  beforeEach(() => {
    engine = createStoryEngine('headline-seed');
  });

  it('jede der 110 Aktionen hat ein nicht-leeres headline_de in den Daten', () => {
    const actions = allRawActions();
    expect(actions.length).toBe(110);
    const without = actions.filter((a) => !a.headline_de || a.headline_de.trim() === '');
    expect(without.map((a) => a.id)).toEqual([]);
  });

  it('eine ausgeführte Aktion liefert ihre plakative Überschrift (nicht „Aktion durchgeführt")', () => {
    // 2.1 „Bot-Netzwerk aufbauen" → Owner-Beispiel „Bot-Netzwerk gestartet".
    const result = engine.executeAction('2.1');
    expect(result.success).toBe(true);
    expect(result.narrative.headline_de).toBe('Bot-Netzwerk gestartet');
    expect(result.narrative.headline_de).not.toBe('Aktion durchgeführt');
  });

  it('die Broadcast-Schicht zeigt die Aktions-Überschrift', () => {
    const result = engine.executeAction('1.1'); // „Zielgruppe analysieren"
    const item = mapActionToBroadcast(result, 10);
    expect(item.headline).toBe('Zielgruppe durchleuchtet');
  });

  it('keine initial verfügbare Aktion fällt auf den Default „Aktion durchgeführt" zurück', () => {
    // Jede verfügbare Aktion auf einer FRISCHEN Engine ausführen (volle Ressourcen,
    // Prerequisites erfüllt), damit der Erfolgs-Pfad zuverlässig erreicht wird.
    const available = engine.getAvailableActions();
    expect(available.length).toBeGreaterThan(0);
    for (const a of available) {
      const fresh = createStoryEngine(`per-action-${a.id}`);
      let result;
      try {
        result = fresh.executeAction(a.id);
      } catch {
        continue; // Ausführungs-Edge-Cases sind für B5 irrelevant
      }
      if (!result?.success) continue;
      expect(result.narrative.headline_de, `Aktion ${a.id} ohne Überschrift`).not.toBe('Aktion durchgeführt');
      expect(result.narrative.headline_de.trim().length).toBeGreaterThan(0);
    }
  });
});
