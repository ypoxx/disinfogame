/**
 * Spine Slice 4 — Engine-Andockung der Entscheidungs-Beats: `applyDecisionBeatOption`
 * bewegt die Gesellschaftswerte + Spieler-Kosten über die bestehenden Pfade, bleibt
 * aber balance-neutral auf der Sieg-Achse (obj_destabilize/Vertrauen, R2).
 */
import { describe, it, expect } from 'vitest';
import { createStoryEngine } from '../../game-logic/StoryEngineAdapter';
import { ALL_DECISION_BEATS } from '../engine/DecisionBeats';

const trustOf = (e: ReturnType<typeof createStoryEngine>) =>
  e.getObjectives().find((o) => o.id === 'obj_destabilize')!.currentValue;

describe('applyDecisionBeatOption', () => {
  it('Stadtrat/A (Hetzen) hebt Polarisierung + kostet Aufmerksamkeit/Risiko', () => {
    const e = createStoryEngine();
    const before = e.getResources();
    const res = e.applyDecisionBeatOption('stadtrat', 'A');
    expect(res).not.toBeNull();
    const after = e.getResources();
    expect(after.polarisierung).toBeGreaterThan(before.polarisierung);
    expect(after.attention).toBeGreaterThan(before.attention);
    expect(after.risk).toBeGreaterThan(before.risk);
    // Rückgabe macht die Wirkung sichtbar (T1).
    expect(res!.societyChanges?.polarisierung).toBeGreaterThan(0);
    expect(res!.resourceChanges.attention).toBeGreaterThan(0);
    expect(res!.optionLabel_de).toContain('Hetzen');
  });

  it('bleibt balance-neutral: obj_destabilize/Vertrauen unverändert (R2)', () => {
    const e = createStoryEngine();
    const trustBefore = trustOf(e);
    // Auch eine Option mit „vertrauen↓" im Werte-Delta darf die Sieg-Achse nicht bewegen.
    e.applyDecisionBeatOption('stadtrat', 'B');
    expect(trustOf(e)).toBe(trustBefore);
    const e2 = createStoryEngine();
    const t2 = trustOf(e2);
    e2.applyDecisionBeatOption('reale_vorlage', 'A');
    expect(trustOf(e2)).toBe(t2);
  });

  it('KEIN Beat bewegt die Sieg-Achse — gilt für ALLE Beats × Optionen (Owner-Entscheidung)', () => {
    for (const beat of ALL_DECISION_BEATS) {
      for (const opt of beat.optionen) {
        const e = createStoryEngine();
        const before = trustOf(e);
        e.applyDecisionBeatOption(beat.id, opt.id, () => 0.5);
        expect(trustOf(e), `${beat.id}/${opt.id} darf obj_destabilize nicht bewegen`).toBe(before);
      }
    }
  });

  it('Abkühl-Option (Stadtrat/D) senkt Risiko + Aufmerksamkeit', () => {
    const e = createStoryEngine();
    // Erst aufheizen, damit das Senken sichtbar ist (Startwerte könnten 0 sein).
    e.applyDecisionBeatOption('reale_vorlage', 'C'); // viel Risiko/Aufmerksamkeit
    const before = e.getResources();
    e.applyDecisionBeatOption('stadtrat', 'D');
    const after = e.getResources();
    expect(after.risk).toBeLessThanOrEqual(before.risk);
    expect(after.attention).toBeLessThanOrEqual(before.attention);
  });

  it('markiert den Beat als aufgelöst (Director zieht ihn nicht erneut)', () => {
    const e = createStoryEngine();
    expect(e.getResolvedDecisionBeatIds()).not.toContain('stadtrat');
    e.applyDecisionBeatOption('stadtrat', 'C');
    expect(e.getResolvedDecisionBeatIds()).toContain('stadtrat');
  });

  it('Resolved-Status überlebt save/load', () => {
    const e = createStoryEngine();
    e.applyDecisionBeatOption('stadtrat', 'A');
    const saved = e.saveState();
    const loaded = createStoryEngine();
    loaded.loadState(saved);
    expect(loaded.getResolvedDecisionBeatIds()).toContain('stadtrat');
  });

  it('unbekannter Beat / unbekannte Option → null (kein Effekt)', () => {
    const e = createStoryEngine();
    const before = e.getResources();
    expect(e.applyDecisionBeatOption('gibtsnicht', 'A')).toBeNull();
    expect(e.applyDecisionBeatOption('stadtrat', 'Z')).toBeNull();
    expect(e.getResources()).toEqual(before);
  });
});

describe('Narrativ-Gedächtnis & Bumerang (Schicht 3)', () => {
  it('eine themen-tragende Option sät das Thema (reaktive Verfügbarkeit)', () => {
    const e = createStoryEngine();
    expect(e.getSeededThemes()).not.toContain('reizthema_gallia');
    e.applyDecisionBeatOption('stadtrat', 'A'); // Stadtrat trägt reizthema_gallia
    expect(e.getSeededThemes()).toContain('reizthema_gallia');
    expect(e.getInoculation('reizthema_gallia')).toBeGreaterThan(0);
  });

  it('Loyalitätsprobe (intern) sät kein Narrativ-Thema', () => {
    const e = createStoryEngine();
    e.applyDecisionBeatOption('loyalitaetsprobe', 'B');
    expect(e.getSeededThemes()).toEqual([]);
  });

  it('Bumerang/Recyceln bei frischem Thema zündet voll (Wiederzündung)', () => {
    const e = createStoryEngine();
    const before = e.getResources();
    const res = e.applyDecisionBeatOption('bumerang', 'A', () => 0.5)!;
    expect(res.narrative_de).toContain('Wiederzündung');
    // inoc 0 → Faktor 1 → volle Polarisierung (+18).
    expect(e.getResources().polarisierung - before.polarisierung).toBe(18);
  });

  it('hohe Inokulation → Rückschlag (Resilienz steigt, Zusatzrisiko), Wirkung gedämpft', () => {
    const e = createStoryEngine();
    e.applyDecisionBeatOption('stadtrat', 'A');     // inoc → 30
    e.applyDecisionBeatOption('reale_vorlage', 'B'); // inoc → 60
    const before = e.getResources();
    const res = e.applyDecisionBeatOption('bumerang', 'A', () => 0.9)! ; // >=0.15 → Rückschlag
    expect(res.narrative_de).toContain('Rückschlag');
    // Diskursqualität (Resilienz) steigt = schlecht für uns.
    expect(e.getResources().diskursqualitaet).toBeGreaterThan(before.diskursqualitaet);
    // Faktor 0.4 → Polarisierung nur +7 (18*0.4 gerundet), nicht +18.
    expect(e.getResources().polarisierung - before.polarisierung).toBe(7);
  });

  it('Streisand-Paradox bei niedrigem rng (selten): verstärkt statt zu dämpfen', () => {
    const e = createStoryEngine();
    e.applyDecisionBeatOption('stadtrat', 'A');
    e.applyDecisionBeatOption('reale_vorlage', 'B'); // inoc 60
    const before = e.getResources();
    const res = e.applyDecisionBeatOption('bumerang', 'A', () => 0.0)!; // <0.15 → Streisand
    expect(res.narrative_de).toContain('Streisand');
    // gedämpfte 7 + Streisand 14 = 21.
    expect(e.getResources().polarisierung - before.polarisierung).toBe(21);
  });

  it('Nebel/voll: hoher rng-Zug → großer Payoff; Einsatz (Kosten) ist immer fällig', () => {
    const e = createStoryEngine();
    const before = e.getResources();
    const res = e.applyDecisionBeatOption('nebel', 'A', () => 0.9)!; // Faktor 1.8
    expect(res.narrative_de).toContain('groß');
    expect(e.getResources().informationslast - before.informationslast).toBe(32); // 18*1.8
    expect(e.getResources().budget).toBeLessThan(before.budget); // Einsatz bezahlt
  });

  it('Nebel/voll: niedriger rng-Zug → Rohrkrepierer (Kosten fällig, kaum Wirkung)', () => {
    const e = createStoryEngine();
    const before = e.getResources();
    const res = e.applyDecisionBeatOption('nebel', 'A', () => 0)!; // Faktor 0
    expect(res.narrative_de).toContain('Rohrkrepierer');
    expect(e.getResources().informationslast).toBe(before.informationslast); // nichts gewirkt
    expect(e.getResources().attention).toBeGreaterThan(before.attention); // aber Aufmerksamkeit verbrannt
  });

  it('Nebel/hedgen: Varianz gekappt — selbst bei rng=0 noch solide Wirkung', () => {
    const e = createStoryEngine();
    const before = e.getResources();
    e.applyDecisionBeatOption('nebel', 'C', () => 0); // Faktor 0.7
    expect(e.getResources().informationslast - before.informationslast).toBe(8); // 12*0.7=8.4→8
  });

  it('Nebel ist deterministisch bei gleichem rng (reproduzierbar)', () => {
    const a = createStoryEngine();
    const b = createStoryEngine();
    const ra = a.applyDecisionBeatOption('nebel', 'A', () => 0.42)!;
    const rb = b.applyDecisionBeatOption('nebel', 'A', () => 0.42)!;
    expect(ra.societyChanges).toEqual(rb.societyChanges);
  });

  it('Narrativ-Gedächtnis überlebt save/load', () => {
    const e = createStoryEngine();
    e.applyDecisionBeatOption('stadtrat', 'A');
    const inoc = e.getInoculation('reizthema_gallia');
    const loaded = createStoryEngine();
    loaded.loadState(e.saveState());
    expect(loaded.getSeededThemes()).toContain('reizthema_gallia');
    expect(loaded.getInoculation('reizthema_gallia')).toBe(inoc);
  });
});
