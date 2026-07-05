/**
 * P2/B2b — PURE Gesellschafts-Dynamik (Effekt-Splitting + Phasen-Formeln).
 */
import { describe, it, expect } from 'vitest';
import {
  societyDeltaFromAction,
  societyFormulaStep,
  clampSocietyValue,
  type SocietySnapshot,
} from '../engine/SocietyDynamics';

const baseSnapshot: SocietySnapshot = {
  polarisierung: 25, informationslast: 20, zynismus: 20, fragmentierung: 15,
  diskursqualitaet: 70, wehrhaftigkeit: 60, reformfaehigkeit: 55, fraktionsstaerke: 25,
};

describe('societyDeltaFromAction', () => {
  it('Verstärkung/Reichweite → Informationslast↑', () => {
    const d = societyDeltaFromAction({ reach_multiplier: 1.5 }, 1, { legality: 'grey' });
    expect(d.informationslast).toBeGreaterThan(0);
  });

  it('Spaltungs-Effekt → Polarisierung↑ und Fragmentierung↑', () => {
    const d = societyDeltaFromAction({ social_division: 0.3 }, 1, { legality: 'grey' });
    expect(d.polarisierung).toBeGreaterThan(0);
    expect(d.fragmentierung).toBeGreaterThan(0);
  });

  it('content_quality (gute Manipulation) → Diskursqualität↓', () => {
    const d = societyDeltaFromAction({ content_quality: 0.2 }, 1, { legality: 'grey' });
    expect(d.diskursqualitaet!).toBeLessThan(0);
  });

  it('emotionaler Schaden/Backlash → Zynismus↑', () => {
    const d = societyDeltaFromAction({ emotional_impact: 0.3, backlash_risk: 0.2 }, 1, { legality: 'grey' });
    expect(d.zynismus).toBeGreaterThan(0);
  });

  it('politischer Einfluss → Fraktions-Stärke↑', () => {
    const d = societyDeltaFromAction({ political_leverage: 0.4 }, 1, { legality: 'grey' });
    expect(d.fraktionsstaerke).toBeGreaterThan(0);
  });

  it('impact_scale ist als WIRKMODELL abgeschafft (Etappe 5, §12.7): allein liefert es NICHTS', () => {
    // Früher trieb impact_scale verdeckt die Werte breit. Jetzt liest die Engine es nicht
    // mehr — der Beitrag wurde per Bake in explizite Effekt-Keys je Aktion geschrieben.
    const nurImpact = societyDeltaFromAction({ impact_scale: 'high' }, 1, { legality: 'illegal' });
    expect(nurImpact).toEqual({});
  });

  it('die gebackenen expliziten Keys polarisieren UND verrohen (grey/illegal-Rolle)', () => {
    // So sehen die Aktionen NACH der Bake aus: explizite Keys statt qualitativem Gewicht.
    const aggressiv = societyDeltaFromAction(
      { political_leverage: 0.25, polarization: 0.2167, emotional_impact: 0.35 }, 1, { legality: 'illegal' },
    );
    expect(aggressiv.polarisierung ?? 0).toBeGreaterThan(0);
    expect(aggressiv.zynismus ?? 0).toBeGreaterThan(0);
    expect(aggressiv.fraktionsstaerke ?? 0).toBeGreaterThan(0);
  });

  it('leere Effekte → leeres Delta', () => {
    expect(societyDeltaFromAction({}, 1, {})).toEqual({});
    expect(societyDeltaFromAction(null, 1, {})).toEqual({});
  });

  it('skaliert mit dem Effektivitäts-Multiplikator', () => {
    const a = societyDeltaFromAction({ social_division: 0.3 }, 1, { legality: 'grey' });
    const b = societyDeltaFromAction({ social_division: 0.3 }, 2, { legality: 'grey' });
    expect(b.polarisierung!).toBeCloseTo(a.polarisierung! * 2, 5);
  });
});

describe('societyFormulaStep (nicht-lineare Kopplung)', () => {
  it('hohe Polarisierung beschleunigt Fragmentierung', () => {
    const d = societyFormulaStep({ ...baseSnapshot, polarisierung: 70 });
    expect(d.fragmentierung!).toBeGreaterThan(0);
  });

  it('hohe Informationslast dämpft Diskursqualität', () => {
    const d = societyFormulaStep({ ...baseSnapshot, informationslast: 80 });
    expect(d.diskursqualitaet!).toBeLessThan(0);
  });

  it('Polarisierung+Fragmentierung lähmen Reformfähigkeit (Stillstand)', () => {
    const d = societyFormulaStep({ ...baseSnapshot, polarisierung: 70, fragmentierung: 50 });
    expect(d.reformfaehigkeit!).toBeLessThan(0);
  });

  it('Etappe 3: die Phasen-Formel bewegt die ABWEHR (wehrhaftigkeit) NICHT mehr', () => {
    // Falle 4 (HANDOFF Etappe 3): wehrhaftigkeit ist zur ABWEHR befördert — passive
    // Gesellschafts-Drift (Zynismus-Kopplung/Resilienz-Erholung) zöge den zweiten
    // Rennläufer mit falschem Vorzeichen. Nur gezielte Aktionen (demoralization =
    // „Bremse") und das ImmuneSystem dürfen sie bewegen.
    const hoch = societyFormulaStep({ ...baseSnapshot, zynismus: 65 });
    expect(hoch.wehrhaftigkeit).toBeUndefined();
    const ruhig = societyFormulaStep({ ...baseSnapshot, informationslast: 20, polarisierung: 20, wehrhaftigkeit: 10 });
    expect(ruhig.wehrhaftigkeit).toBeUndefined();
  });

  it('gezielte Zermürbung (demoralization) senkt die ABWEHR weiter — die „Bremse"', () => {
    const d = societyDeltaFromAction({ demoralization: 0.4 }, 1, { legality: 'grey' });
    expect(d.wehrhaftigkeit!).toBeLessThan(0);
  });

  it('niedriger Druck → Diskursqualität erholt sich (Resilienz)', () => {
    const d = societyFormulaStep({ ...baseSnapshot, informationslast: 20, polarisierung: 20, diskursqualitaet: 50 });
    expect(d.diskursqualitaet!).toBeGreaterThan(0);
  });
});

describe('clampSocietyValue', () => {
  it('klemmt auf 0–100 und fängt NaN', () => {
    expect(clampSocietyValue(150)).toBe(100);
    expect(clampSocietyValue(-5)).toBe(0);
    expect(clampSocietyValue(NaN)).toBe(0);
    expect(clampSocietyValue(42)).toBe(42);
  });
});
