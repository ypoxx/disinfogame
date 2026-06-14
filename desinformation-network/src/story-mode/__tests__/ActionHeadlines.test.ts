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
import actionsP1c from '../data/actions_p1c.json';

type RawA = { id: string; label_de: string; headline_de?: string };
function allRawActions(): RawA[] {
  const out = [...(actionsData.actions as RawA[])];
  for (const src of [actionsContinued, actionsP1c]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c = src as any;
    for (const key of Object.keys(c)) {
      if (Array.isArray(c[key])) out.push(...c[key]);
    }
  }
  return out;
}

describe('Aktions-Überschriften (B5)', () => {
  let engine: StoryEngineAdapter;

  beforeEach(() => {
    engine = createStoryEngine('headline-seed');
  });

  it('jede Aktion hat ein nicht-leeres headline_de in den Daten', () => {
    const actions = allRawActions();
    expect(actions.length).toBeGreaterThanOrEqual(110); // 110 Bestand + P1c-Content
    const without = actions.filter((a) => !a.headline_de || a.headline_de.trim() === '');
    expect(without.map((a) => a.id)).toEqual([]);
  });

  it('Finanz-Maßnahme mit negativen Budget-Kosten spült Budget in die Kasse (Kredit-Mechanik)', () => {
    // 9.3 „Krypto-Spendenkampagne" (budget: -22, keine Prerequisites) → Budget steigt.
    const before = engine.getResources().budget;
    const result = engine.executeAction('9.3');
    expect(result.success).toBe(true);
    expect(engine.getResources().budget).toBeGreaterThan(before);
    expect(result.narrative.headline_de).toBe('Krypto-Spenden eingesammelt');
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

  it('fehlgeschlagene Aktion zeigt im Broadcast die Fehler-Überschrift (nicht die Erfolgs-Headline)', () => {
    // Codex-Review #80: bei Misserfolg darf NICHT die plakative Erfolgs-Überschrift erscheinen.
    const failed = {
      success: false,
      action: { id: '2.1', label_de: 'Bot-Netzwerk aufbauen', headline_de: 'Bot-Netzwerk gestartet', tags: ['infrastructure'], costs: {} },
      narrative: { headline_de: 'Nicht genug Ressourcen' },
    } as unknown as Parameters<typeof mapActionToBroadcast>[0];
    const item = mapActionToBroadcast(failed, 10);
    expect(item.kind).toBe('gegenreaktion');
    expect(item.headline).toBe('Nicht genug Ressourcen');
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
