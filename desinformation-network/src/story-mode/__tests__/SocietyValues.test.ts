/**
 * P1 — Gesellschaftswerte als Zustand (B2a).
 *
 * Belegt: (1) das volle Werte-Set existiert mit sinnvollen Startwerten; (2) genau die
 * vorgesehenen 4 sind im HUD sichtbar markiert (3 Felder + Vertrauen separat → O3);
 * (3) ab P2 BEWEGEN sich die Werte durch Aktionen/Phasen (Effekt-Splitting), und
 *     Strategien differenzieren sich (aggressiv verroht stärker als zurückhaltend);
 * (4) sie persistieren über save/load und erben Defaults aus alten Saves.
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

  it('P2: Werte bewegen sich durch Aktionen + Phasen (Effekt-Splitting)', () => {
    const engine = createStoryEngine('soc_move');
    const before = { ...engine.getResources() };
    for (const id of ['5.2', '4.1', '4.4', '8.2']) {
      try { engine.executeAction(id); } catch { /* egal */ }
    }
    engine.advancePhase();
    const after = engine.getResources();
    // Mindestens die Informationslast steigt (Reichweite/„Lärm").
    expect(after.informationslast).toBeGreaterThan(before.informationslast);
    // obj_destabilize bleibt die Sieg-Achse — Gesellschaftswerte sind ZUSÄTZLICH.
    expect(after.budget).toBeLessThanOrEqual(before.budget + 5); // nur Phasen-Regen
  });

  it('P2: aggressive Strategie verroht stärker als zurückhaltende', () => {
    function zynismusAfter(ids: string[]): number {
      const e = createStoryEngine('soc_diff');
      for (const id of ids) { try { e.executeAction(id); } catch { /* egal */ } }
      return e.getResources().zynismus;
    }
    // Illegale/aggressive Aktionen erzeugen Zynismus; rein legale kaum.
    const aggressive = zynismusAfter(['8.2', '8.1', '8.5']); // illegale Ziel-Aktionen
    const restrained = zynismusAfter(['1.1', '1.2']);        // Vorbereitung (legal)
    expect(aggressive).toBeGreaterThan(restrained);
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
