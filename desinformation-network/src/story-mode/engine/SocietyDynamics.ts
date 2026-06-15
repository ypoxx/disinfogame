/**
 * Gesellschafts-Dynamik (B2b/P2) — PURE Formeln für das Effekt-Splitting.
 *
 * Heute kollabiert die Engine viele berechnete Wirkungen in EINE Zahl (obj_destabilize).
 * Hier werden dieselben rohen Aktions-Effekte ZUSÄTZLICH auf die Gesellschaftswerte
 * verteilt — obj_destabilize bleibt unangetastet (K14/R2). Zwei Schichten:
 *   1) societyDeltaFromAction: pro Aktion (aus den rohen Effekt-Keys).
 *   2) societyFormulaStep: pro Phase, die Werte beeinflussen EINANDER nicht-linear
 *      („schöne Komplexität hinten" — Owner-Leitsatz: intelligent, nicht plus/minus).
 *
 * Alles pur + deterministisch → eigene Unit-Tests, kein Math.random, kein React.
 * Die Magnituden sind bewusst klein (Werte 0–100, ~30–60 Phasen Spiel).
 */

import type { SocietyValueKey } from '../../game-logic/StoryEngineAdapter';

export type SocietyDelta = Partial<Record<SocietyValueKey, number>>;

/** Lese-Schnappschuss der acht Gesellschaftswerte (für die Phasen-Formel). */
export type SocietySnapshot = Record<SocietyValueKey, number>;

function num(v: unknown): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : 0;
}

/** Qualitatives impact_scale → Gewicht (95 Aktionen tragen es; allgemeiner „Lärm"-Treiber). */
function impactWeight(scale: unknown): number {
  if (scale === 'high') return 1.5;
  if (scale === 'medium') return 1.0;
  if (scale === 'low') return 0.5;
  return 0;
}

function addDelta(d: SocietyDelta, key: SocietyValueKey, value: number): void {
  if (value === 0) return;
  d[key] = (d[key] ?? 0) + value;
}

/**
 * Verteilt die rohen Effekte EINER Aktion auf die Gesellschaftswerte.
 * `mult` = Effektivitäts-Multiplikator (NPC-Assist), wie in applyActionEffects.
 */
export function societyDeltaFromAction(
  effects: Record<string, unknown> | undefined | null,
  mult: number,
  ctx: { legality?: string; impactScale?: unknown },
): SocietyDelta {
  const d: SocietyDelta = {};
  if (!effects) return d;

  // Polarisierung: explizite Spaltungs-Effekte (+ etwas Fragmentierung).
  const division = num(effects.polarization) + num(effects.social_division) + num(effects.divisiveness_bonus);
  if (division > 0) {
    addDelta(d, 'polarisierung', division * mult * 6);
    addDelta(d, 'fragmentierung', division * mult * 3);
  }

  // Informationslast: Netto-Verstärkung/Reichweite (reach_multiplier > 1 = Verstärkung).
  const amp =
    Math.max(0, num(effects.reach_multiplier) - 1) +
    num(effects.amplification_base) +
    num(effects.amplification_bonus) +
    num(effects.virality_boost) +
    num(effects.network_reach) +
    num(effects.organic_reach);
  if (amp > 0) addDelta(d, 'informationslast', amp * mult * 2.5);

  // Diskursqualität: gutes Manipulations-„content_quality" degradiert die öffentliche
  // Debatte; narrative_resilience hebt sie (defensiver Effekt).
  addDelta(d, 'diskursqualitaet', (num(effects.narrative_resilience) - num(effects.content_quality)) * mult * 5);
  // gute „Inhalte" tragen auch zur Überflutung bei
  if (num(effects.content_quality) > 0) addDelta(d, 'informationslast', num(effects.content_quality) * mult * 2);

  // Zynismus: emotionaler Schaden / Empörungs-Backlash / Ziel-Schaden.
  const cyn = num(effects.emotional_impact) + num(effects.backlash_risk) + num(effects.target_damage);
  if (cyn > 0) addDelta(d, 'zynismus', cyn * mult * 4);

  // Fraktions-Stärke (uns-nahe Kraft): politischer Einfluss/Hebel.
  const polInfl = num(effects.political_leverage) + num(effects.political_influence) + num(effects.long_term_influence);
  if (polInfl > 0) addDelta(d, 'fraktionsstaerke', polInfl * mult * 4);

  // Baseline-„Lärm": nur WENIGE Aktionen tragen explizite Spaltungs-/Reichweiten-Keys,
  // deshalb treibt das allgemeine impact_scale die Werte breit (sonst bleiben sie tot).
  // Aggressive (grey/illegal) Aktionen polarisieren und verrohen — niedrigschwellige
  // Aktionen kaum. So differenzieren sich Strategien hörbar.
  const iw = impactWeight(ctx.impactScale);
  if (iw > 0) {
    addDelta(d, 'informationslast', iw * mult * 0.4);
    if (ctx.legality === 'grey' || ctx.legality === 'illegal') {
      addDelta(d, 'polarisierung', iw * mult * 0.6);
    }
    if (ctx.legality === 'illegal') {
      addDelta(d, 'zynismus', iw * mult * 0.5);
      addDelta(d, 'diskursqualitaet', -iw * mult * 0.3);
    }
  }

  return d;
}

/**
 * Phasen-Formel: die Werte wirken NICHT-LINEAR aufeinander. Klein gehalten, je Phase.
 * Liefert NUR Deltas (der Aufrufer klemmt auf 0–100 und wendet sie an).
 */
export function societyFormulaStep(s: SocietySnapshot): SocietyDelta {
  const d: SocietyDelta = {};

  // Hohe Polarisierung beschleunigt Fragmentierung (Lager kapseln sich ab).
  if (s.polarisierung > 45) addDelta(d, 'fragmentierung', (s.polarisierung - 45) * 0.05);

  // Hohe Informationslast dämpft die Diskursqualität (Korrektur wird schwerer).
  if (s.informationslast > 40) addDelta(d, 'diskursqualitaet', -(s.informationslast - 40) * 0.03);

  // Anhaltende Polarisierung + Fragmentierung lähmt die Reformfähigkeit (Stillstand-Signatur).
  const blockade = (s.polarisierung + s.fragmentierung) / 2;
  if (blockade > 35) addDelta(d, 'reformfaehigkeit', -(blockade - 35) * 0.03);

  // Hoher Zynismus senkt die Wehrhaftigkeit (Rückzug-Signatur).
  if (s.zynismus > 40) addDelta(d, 'wehrhaftigkeit', -(s.zynismus - 40) * 0.04);

  // Resilienz: bei niedrigem Druck erholen sich Diskursqualität und (langsamer) Wehrhaftigkeit.
  if (s.informationslast < 30 && s.polarisierung < 40) {
    addDelta(d, 'diskursqualitaet', 0.3);
    if (s.wehrhaftigkeit < 60) addDelta(d, 'wehrhaftigkeit', 0.1);
  }

  return d;
}

/** Klemmt einen Wert auf das gültige 0–100-Band. */
export function clampSocietyValue(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(100, v));
}
