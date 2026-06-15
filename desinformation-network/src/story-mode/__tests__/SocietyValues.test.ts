/**
 * P1 — Gesellschaftswerte als Zustand (B2a).
 *
 * Belegt: (1) das volle Werte-Set existiert mit sinnvollen Startwerten; (2) genau die
 * vorgesehenen 4 sind im HUD sichtbar markiert (3 Felder + Vertrauen separat → O3);
 * (3) in P1 BEWEGEN sich die Werte noch NICHT (kein Effekt-Splitting → Balance identisch);
 * (4) sie persistieren über save/load und erben Defaults aus alten Saves.
 *
 * HINWEIS: Assertion (3) wird in P2 (Effekt-Splitting) bewusst umgekehrt — dann sollen
 * sich die Werte durch Aktionen bewegen.
 */
import { describe, it, expect } from 'vitest';
import {
  createStoryEngine,
  SOCIETY_VALUE_META,
  VISIBLE_SOCIETY_KEYS,
  type SocietyValueKey,
} from '../../game-logic/StoryEngineAdapter';

const ALL_KEYS = Object.keys(SOCIETY_VALUE_META) as SocietyValueKey[];

describe('Gesellschaftswerte (P1/B2a)', () => {
  it('hat das volle Werte-Set mit Startwerten', () => {
    const res = createStoryEngine('soc').getResources();
    expect(res.polarisierung).toBe(25);
    expect(res.informationslast).toBe(20);
    expect(res.zynismus).toBe(20);
    expect(res.fragmentierung).toBe(15);
    expect(res.diskursqualitaet).toBe(70);
    expect(res.wehrhaftigkeit).toBe(60);
    expect(res.reformfaehigkeit).toBe(55);
    expect(res.fraktionsstaerke).toBe(25);
    // Alle Werte sind im 0–100-Band.
    for (const k of ALL_KEYS) {
      expect(res[k]).toBeGreaterThanOrEqual(0);
      expect(res[k]).toBeLessThanOrEqual(100);
    }
  });

  it('markiert genau die 4 sichtbaren Werte (3 Felder + Vertrauen separat im HUD)', () => {
    // Vertrauen ist KEIN Society-Feld (kommt aus obj_destabilize), daher 3 sichtbare Felder.
    expect(VISIBLE_SOCIETY_KEYS).toEqual(['polarisierung', 'informationslast', 'zynismus']);
    expect(VISIBLE_SOCIETY_KEYS).toHaveLength(3);
    // Die Auftrags-Achsen laufen intern.
    expect(SOCIETY_VALUE_META.wehrhaftigkeit.visible).toBe(false);
    expect(SOCIETY_VALUE_META.reformfaehigkeit.visible).toBe(false);
    expect(SOCIETY_VALUE_META.fraktionsstaerke.visible).toBe(false);
  });

  it('P1: Werte bewegen sich (noch) NICHT durch Aktionen oder Phasen', () => {
    const engine = createStoryEngine('soc_static');
    const before = { ...engine.getResources() };
    // Mehrere aggressive Aktionen + Phasenwechsel — in P1 ohne Effekt-Splitting.
    for (const id of ['5.2', '4.1', '7.2']) {
      try { engine.executeAction(id); } catch { /* egal */ }
    }
    engine.advancePhase();
    const after = engine.getResources();
    for (const k of ALL_KEYS) {
      expect(after[k]).toBe(before[k]);
    }
  });

  it('persistiert über save/load und erbt Defaults aus altem Save', () => {
    const engine = createStoryEngine('soc_save');
    const saved = JSON.parse(engine.saveState());
    // Society-Werte sind im Save enthalten.
    expect(saved.storyResources.polarisierung).toBe(25);

    // Alter Save (1.0.0) ohne Society-Felder → Default-Merge füllt auf.
    saved.version = '1.0.0';
    for (const k of ALL_KEYS) delete saved.storyResources[k];
    const loaded = createStoryEngine('soc_fresh');
    loaded.loadState(JSON.stringify(saved));
    const res = loaded.getResources();
    for (const k of ALL_KEYS) {
      expect(typeof res[k]).toBe('number');
      expect(Number.isNaN(res[k])).toBe(false);
    }
    expect(res.diskursqualitaet).toBe(70);
  });
});
