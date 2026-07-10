/**
 * AKTIONS-INVARIANTE (Etappe 5, Zielbild §12.7)
 * =============================================
 * „Jede Aktion bewegt sichtbar mindestens einen der zwei Läufer." Dieser Test sichert die
 * Invariante DAUERHAFT: eine neue Aktion, die weder die ABWEHR (Lärm) noch die
 * SONNTAGSFRAGE (Sieg-Achse) bewegt, lässt das Gate rot werden. Die vier ta01-
 * Aufklärungs-Enabler (1.1/1.2/1.3/1.5) tragen dafür eine faint ABWEHR-Spur (attention: 1).
 *
 * ABWEHR bewegt: risk ≠ 0 (Lärm, auch senkend = Bremse) · attention > 0 · legality illegal
 *   (implizite +2 Aufmerksamkeit) — alles Zuflüsse des ImmuneSystem.
 * SONNTAGSFRAGE bewegt: ein von SocietyDynamics gelesener Sieg-Achsen-Key · reach_multiplier>1
 *   · aggressive Phase (implizite trust_erosion).
 *
 * ETAPPE 5 (Zielbild §12.7): `impact_scale` ist als WIRKMODELL ABGESCHAFFT. Sein exakter
 * Beitrag wurde per Bake in EXPLIZITE Effekt-Keys je Aktion geschrieben (amplification_base/
 * political_leverage/polarization/emotional_impact); die SocietyDynamics-Baseline ist entfernt.
 * Deshalb zählt impact_scale hier NICHT mehr als Läufer-Beweger — jede Aktion muss ihre
 * Wirkung über explizite Keys (oder Abwehr-Kosten) tragen. Das macht die Kuratierung
 * (143→60–80) gefahrlos: löschen entfernt genau die sichtbare Wirkung dieser Aktion.
 */
import { describe, it, expect } from 'vitest';
import { getActionLoader } from '../engine/ActionLoader';

const num = (v: unknown): number => (typeof v === 'number' && Number.isFinite(v) ? v : 0);

// Von SocietyDynamics/applyActionEffects gelesene Keys, die eine Sieg-Achse der Wahl-
// Signatur (fraktionsstaerke/vertrauen/zynismus) bewegen (siehe SocietyDynamics.ts).
const SIEG_KEYS = [
  'trust_erosion', 'content_quality', 'virality_boost', 'polarization',
  'amplification_base', 'amplification_bonus', 'political_leverage', 'political_influence',
  'long_term_influence', 'emotional_impact', 'backlash_risk', 'target_damage',
  'demoralization', 'social_division', 'divisiveness_bonus', 'flooding',
  'rumor_mutation', 'loyalty_trap', 'memory_conflict',
];
const AGGRESSIVE_PHASES = ['ta03', 'ta04', 'ta05', 'targeting'];

function movesAbwehr(a: { costs?: Record<string, number>; legality: string }): boolean {
  const c = a.costs ?? {};
  return num(c.risk) !== 0 || num(c.attention) > 0 || a.legality === 'illegal';
}
function movesSonntagsfrage(a: { effects?: Record<string, unknown>; legality: string; phase: string }): boolean {
  const e = a.effects ?? {};
  if (SIEG_KEYS.some((k) => num(e[k]) > 0)) return true;
  if (num(e.reach_multiplier) > 1) return true;
  // impact_scale zählt NICHT mehr (Etappe 5: als Wirkmodell abgeschafft, s. Kopf).
  if (AGGRESSIVE_PHASES.includes(a.phase)) return true;
  return false;
}

describe('Aktions-Invariante (Etappe 5): jede Aktion bewegt einen Läufer', () => {
  const actions = getActionLoader().getAllActions();

  it('lädt den vollständigen Aktionskatalog', () => {
    // Nach der Kuratierung (143→60–80) liegt der Katalog im Zielkorridor. Diese
    // Invariante gilt für JEDE geladene Aktion, unabhängig von der Katalog-Größe.
    expect(actions.length).toBeGreaterThan(55);
  });

  it('bewegt für JEDE Aktion mindestens einen der zwei Läufer', () => {
    const tot = actions.filter((a) => !movesAbwehr(a) && !movesSonntagsfrage(a));
    expect(tot.map((a) => a.id)).toEqual([]);
  });
});
