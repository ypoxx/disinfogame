/**
 * P0-2: `checkGameEnd()` hängt jetzt das state-getriebene `AssembledEnding` (8 Kategorien ×
 * 7 Tonalitäten) an die 4-Typ-GameEndState an — bisher war `evaluateEnding` toter Code.
 * Additiv/balance-neutral: die 4 Trigger bleiben, nur die Anzeige-Tiefe kommt hinzu.
 */
import { describe, it, expect } from 'vitest';
import { createStoryEngine } from '../../game-logic/StoryEngineAdapter';
import { resetStoryActorAI } from '../engine/StoryActorAI';
import { resetStoryComboSystem } from '../engine/StoryComboSystem';
import { resetCrisisMomentSystem } from '../engine/CrisisMomentSystem';

describe('P0-2: checkGameEnd trägt ein AssembledEnding', () => {
  it('Timeout-Niederlage liefert Kategorie + Tonalität + nicht-leere Erzählung + Wiederspiel-Hinweise', () => {
    resetStoryActorAI();
    resetStoryComboSystem();
    resetCrisisMomentSystem();
    const engine = createStoryEngine('p0-2-timeout');

    // Ohne Aktionen bis zum Zeitlimit (Phase 120) vorrücken → deterministische Timeout-Niederlage.
    let end = engine.checkGameEnd();
    for (let i = 0; i < 130 && !end; i++) {
      engine.advancePhase();
      end = engine.checkGameEnd();
    }

    expect(end).not.toBeNull();
    expect(end!.type).toBe('defeat');
    const a = end!.assembledEnding;
    expect(a).toBeDefined();
    expect(typeof a!.category).toBe('string');
    expect(typeof a!.tone).toBe('string');
    expect(a!.fullNarrative_de.length).toBeGreaterThan(0);
    expect(Array.isArray(a!.replayHints)).toBe(true);

    // Codex-Review 2026-06-15: Die angehängte Ending-Kategorie MUSS zum Live-Branch passen.
    // Eine Niederlage darf nie eine Sieg-Optik im End-Report erzeugen, auch wenn die
    // unabhängige `checkGameEnding()`-Klassifikation den Zustand anders einstuft.
    expect(a!.category).not.toBe('victory');
    expect(a!.category).toBe('exposure');
  });
});
