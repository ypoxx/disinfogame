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
 *   · impact_scale (grey/illegal, Baseline-Kopplung) · aggressive Phase (implizite trust_erosion).
 *
 * HINWEIS (Balance-Befund): Die weitere Reduktion 143 → 60–80 ist NICHT balance-neutral
 * machbar, solange `impact_scale` das Wirkmodell ist — fast jede „Grundrauschen"-Aktion
 * treibt über die impact_scale-Baseline verdeckt den Sonntagsfrage-Fortschritt. Empirisch:
 * Entfernen von impact_scale-Aktionen lässt greedy einbrechen (58 %→12 %), Entfernen von
 * Legal/Low-Risk-Aktionen macht passives Spiel zu stark (low_risk 4 %→75 %). Die Kuratierung
 * ist damit an die impact_scale-Abschaffung GEKOPPELT (Zielbild §12.7) → dediziertes
 * Balance-Follow-up (siehe Handoff). Diese Invariante ist die tragende Leitplanke dafür.
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
  if (['high', 'medium', 'low'].includes(e.impact_scale as string) && (a.legality === 'grey' || a.legality === 'illegal')) return true;
  if (AGGRESSIVE_PHASES.includes(a.phase)) return true;
  return false;
}

describe('Aktions-Invariante (Etappe 5): jede Aktion bewegt einen Läufer', () => {
  const actions = getActionLoader().getAllActions();

  it('lädt den vollständigen Aktionskatalog', () => {
    // Die Reduktion Richtung 60–80 ist an die impact_scale-Abschaffung gekoppelt
    // (s. Kopf) → deferred. Diese Invariante gilt für JEDE geladene Aktion, unabhängig
    // von der Katalog-Größe.
    expect(actions.length).toBeGreaterThan(60);
  });

  it('bewegt für JEDE Aktion mindestens einen der zwei Läufer', () => {
    const tot = actions.filter((a) => !movesAbwehr(a) && !movesSonntagsfrage(a));
    expect(tot.map((a) => a.id)).toEqual([]);
  });
});
