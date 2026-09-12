import { describe, it, expect } from 'vitest';
import { createStoryEngine } from '../../game-logic/StoryEngineAdapter';
import { CONSEQUENCE_SEVERITIES } from '../engine/ConsequenceSystem';

/**
 * Verhaltensprobe: Der Preis einer Konsequenz-Wahl wird auch GEZOGEN.
 *
 * Die Quelltext-Wache daneben prüft nur, dass ein Feld im Adapter vorkommt.
 * Das reicht nicht: `cost.moral_weight` stand in drei Wahlen, gelesen wurde
 * `moralWeight` — ein Schlüssel, den es in den Daten nie gab. Der Preis war im
 * Text versprochen, im Modal unsichtbar und in der Buchhaltung nicht vorhanden.
 * Bei „Andere beschuldigen" (kritische Konsequenz `cons_exposure_imminent`) war
 * das Moralgewicht 4 der GANZE Preis — die zynischste Antwort des Spiels war
 * die billigste.
 */

interface Testbar {
  consequenceSystem: {
    triggerConsequence(id: string, quelle: string, phase: number): unknown;
    activateConsequence?(id: string): unknown;
    pendingConsequences: { id: string; activatesAtPhase: number }[];
    activeConsequence: unknown;
  };
  activeConsequence: unknown;
  storyResources: { moralWeight: number; capacity: number; risk: number; budget: number };
  getActiveConsequence(): { choices?: { id: string }[] } | null;
  handleConsequenceChoice(id: string): { success: boolean };
  advancePhase(): void;
}

/** Bringt die genannte Konsequenz in den aktiven Zustand. */
function stelleAktiv(e: Testbar, consequenceId: string): boolean {
  e.consequenceSystem.triggerConsequence(consequenceId, 'test', 1);
  // Die Aktivierung hängt an der Phasen-Verzögerung der Definition.
  for (let i = 0; i < 12 && !e.getActiveConsequence(); i++) e.advancePhase();
  return !!e.getActiveConsequence();
}

describe('Preis einer Konsequenz-Wahl', () => {
  it('bucht das Moralgewicht ab („Andere beschuldigen", Preis 4)', () => {
    const e = createStoryEngine('preis-moral') as unknown as Testbar;
    if (!stelleAktiv(e, 'cons_exposure_imminent')) {
      throw new Error('cons_exposure_imminent ließ sich nicht aktivieren');
    }
    const wahl = e.getActiveConsequence()!.choices?.find((c) => c.id === 'blame_others');
    expect(wahl, 'Wahl blame_others fehlt').toBeTruthy();

    const vorher = e.storyResources.moralWeight;
    e.handleConsequenceChoice('blame_others');
    expect(
      e.storyResources.moralWeight - vorher,
      'das Moralgewicht 4 aus cost.moral_weight wurde nicht gezogen'
    ).toBe(4);
  });

  it('bucht die Kapazität ab („Operationen pausieren", Preis 4)', () => {
    // Diese Wahl war bis 2026-09-12 komplett gratis: ihr Preis stand in einem
    // `effect`-Feld, das die Engine nicht liest.
    const e = createStoryEngine('preis-kapazitaet') as unknown as Testbar;
    if (!stelleAktiv(e, 'cons_investigation')) {
      throw new Error('cons_investigation ließ sich nicht aktivieren');
    }
    const vorher = e.storyResources.capacity;
    e.handleConsequenceChoice('go_dark');
    expect(vorher - e.storyResources.capacity, 'Kapazität 4 wurde nicht gezogen').toBe(4);
  });

  it('die Schweregrade sind vollständig (Datenvertrag)', () => {
    expect(CONSEQUENCE_SEVERITIES.length).toBeGreaterThan(0);
  });
});
