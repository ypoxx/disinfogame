/**
 * P0 — Save/Load-Migration härten (Risiko R1).
 *
 * Belegt: (1) Round-Trip erhält den Zustand. (2) Ein ALTER Save ohne neue Felder
 * lädt sauber (Default-Merge → keine undefined/NaN). (3) Fehlende Pflicht-Strukturen
 * (objectives) werden re-initialisiert. (4) Die Save-Version wird geschrieben.
 */
import { describe, it, expect } from 'vitest';
import { createStoryEngine, SAVE_FORMAT_VERSION } from '../../game-logic/StoryEngineAdapter';

describe('Save/Load-Migration (P0/R1)', () => {
  it('schreibt die aktuelle Save-Version', () => {
    const engine = createStoryEngine('save_v');
    const saved = JSON.parse(engine.saveState());
    expect(saved.version).toBe(SAVE_FORMAT_VERSION);
  });

  it('Round-Trip erhält die Ressourcen', () => {
    const engine = createStoryEngine('save_rt');
    engine.executeAction(engine.getAvailableActions()[0].id);
    const before = engine.getResources();
    const blob = engine.saveState();

    const other = createStoryEngine('other_seed');
    other.loadState(blob);
    const after = other.getResources();
    expect(after.budget).toBe(before.budget);
    expect(after.risk).toBe(before.risk);
    expect(after.capacity).toBe(before.capacity);
  });

  it('alter Save ohne neue Felder lädt sauber (Default-Merge)', () => {
    const engine = createStoryEngine('save_old');
    const saved = JSON.parse(engine.saveState());

    // Simuliere einen ALTEN Spielstand: Version 1.0.0, ein Ressourcen-Feld fehlt.
    saved.version = '1.0.0';
    delete saved.storyResources.attention;
    delete saved.storyResources.moralWeight;

    const loaded = createStoryEngine('fresh');
    loaded.loadState(JSON.stringify(saved));
    const res = loaded.getResources();

    // Fehlende Felder dürfen NICHT undefined/NaN sein, sondern den Default tragen.
    expect(typeof res.attention).toBe('number');
    expect(Number.isNaN(res.attention)).toBe(false);
    expect(res.attention).toBe(0);
    expect(typeof res.moralWeight).toBe('number');
    expect(Number.isNaN(res.moralWeight)).toBe(false);
  });

  it('fehlende objectives werden re-initialisiert', () => {
    const engine = createStoryEngine('save_obj');
    const saved = JSON.parse(engine.saveState());
    delete saved.objectives;

    const loaded = createStoryEngine('fresh2');
    loaded.loadState(JSON.stringify(saved));
    const objs = loaded.getObjectives();
    expect(objs.length).toBeGreaterThan(0);
    expect(objs.some(o => o.id === 'obj_destabilize')).toBe(true);
  });
});
