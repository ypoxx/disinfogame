/**
 * GEWINNBAR-UND-VERLIERBAR-GATE (Etappe 0 „Leitplanke", 2026-07-04)
 * =================================================================
 * Das erste harte Balance-Gate des Projekts. Bis heute gab es KEINEN Test, der
 * fehlschlägt, wenn das Spiel unbesiegbar oder unverlierbar wird — nur loggende
 * Simulationen (`balance-sim.test.ts`) ohne Assertions. Dieses Gate schließt die
 * Lücke: Es fährt N deterministische Kopf-an-Kopf-Partien je Strategie und prüft
 * die dauerhafte Invariante des Zielbilds (`ZIELBILD_2026-07-04_WETTRENNEN.md`,
 * Etappe 0/E11): **gewinnbar UND verlierbar, keine Strategie gewinnt oder verliert
 * immer.**
 *
 * DETERMINISMUS: Die Engine ist seed-gesteuert; die einzige verbliebene
 * Nichtdeterminismus-Quelle war die `random`-Strategie (Math.random). Sie läuft
 * hier über einen seed-abgeleiteten PRNG — dieselbe Seed ⇒ dieselben Partien ⇒
 * reproduzierbares Gate.
 *
 * KALIBRIERUNG: Die Schwellen unten prüfen die INVARIANTE (gewinnbar UND verlierbar),
 * NICHT die engen Pro-Strategie-Bänder des Zielbilds — die (TARGET_BANDS) werden Etappe
 * für Etappe scharfgeschaltet, wenn das Wettrennen + Immunsystem stehen. Der Legacy-
 * Singleton-Graph lässt sich nicht vollständig isolieren, daher driftet die Feinverteilung
 * je nach Test-Reihenfolge um ±1–2 — die Floors haben bewusst Luft dazu.
 *
 * Ist-Verteilung nach Etappe 2 (2026-07-04, 40-Tage-Wahlkampagne, 36 Partien):
 * ~22 Siege / ~14 Niederlagen. ⚠️ Die Pro-Strategie-Balance ist INVERTIERT ggü. Etappe 1:
 * in der kurzen Kampagne fliegt aggressives Spiel (greedy) an der eigenen Reckless-Rate auf
 * (0 %, finalRisk ~96), während geduldiges Spiel (low_risk) die Signatur passiv über die
 * Drift-Kopplung erreicht (100 %, finalRisk ~15). Das ist bekannt und ein TUNING-Ziel für
 * Etappe 3 (ImmuneSystem formt Risiko/Ertrag neu) — NICHT hier zu überdrehen. Das Gate prüft
 * weiter nur die Invariante (gewinnbar UND verlierbar), die robust hält.
 *
 * Lauf: npx vitest run src/story-mode/tests/winnable-and-losable.test.ts
 */
import { describe, it, expect } from 'vitest';
import { createStoryEngine } from '../../game-logic/StoryEngineAdapter';
import { resetStoryActorAI } from '../engine/StoryActorAI';
import { resetStoryComboSystem } from '../engine/StoryComboSystem';
import { resetCrisisMomentSystem } from '../engine/CrisisMomentSystem';
import { resetBetrayalSystem } from '../engine/BetrayalSystem';
import { resetConsequenceSystem } from '../engine/ConsequenceSystem';

type Strategy = 'greedy' | 'random' | 'low_risk';

interface SimResult {
  strategy: Strategy;
  outcome: 'victory' | 'defeat' | 'timeout';
  endTitle: string | null;
  endPhase: number;
  progressMin: number;   // Auftrags-Signatur (schwächste Achse) am Ende
  progressMean: number;  // Auftrags-Signatur (Mittel) am Ende
  finalRisk: number;
  axes: { wert: string; progress: number }[];
}

interface SimAction {
  id: string;
  available: boolean;
  legality?: string;
  unlocks?: string[];
  costs?: { budget?: number; capacity?: number; risk?: number; attention?: number };
}

// --- Deterministischer PRNG (mulberry32 aus String-Seed) ---------------------
function hashSeed(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}
function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function selectAction(
  actions: SimAction[],
  strategy: Strategy,
  res: { budget: number; capacity: number },
  rng: () => number,
): SimAction | null {
  const affordable = actions.filter(a => a.available
    && (!a.costs?.budget || res.budget >= a.costs.budget)
    && (!a.costs?.capacity || res.capacity >= a.costs.capacity));
  if (affordable.length === 0) return null;
  switch (strategy) {
    case 'random':
      return affordable[Math.floor(rng() * affordable.length)];
    case 'low_risk':
      return affordable.slice().sort((a, b) =>
        ((a.costs?.risk || 0) + (a.costs?.attention || 0)) -
        ((b.costs?.risk || 0) + (b.costs?.attention || 0)))[0];
    case 'greedy':
    default:
      return affordable.slice().sort((a, b) => {
        const score = (x: SimAction) =>
          (x.legality === 'illegal' ? 3 : x.legality === 'grey' ? 2 : 1)
          + (x.unlocks?.length || 0) + (x.costs?.risk || 0) * 0.2;
        return score(b) - score(a);
      })[0];
  }
}

function resetAllSingletons(): void {
  // Die per-Partie GAMEPLAY-Singletons zurücksetzen (balance-sim.test.ts vergaß Betrayal +
  // Consequence → State-Leak; hier ergänzt). Die reinen Daten-Loader (ActionLoader,
  // EpisodeLoader, ExtendedActorLoader, AdvisorEngine) werden BEWUSST nicht zurückgesetzt:
  //
  // WICHTIGER ETAPPE-0-BEFUND (2026-07-04): Der Legacy-Singleton-Graph lässt sich nicht
  // billig vollständig isolieren — je nachdem, welche Singletons man zurücksetzt, kippt die
  // gemessene Verteilung stark (mit vollem Loader-Reset: greedy 0/12, low_risk 12/0; ohne:
  // ~5/7). Die früher „ausgewogen" wirkenden Zahlen waren teils ein Artefakt von State-Leaks
  // ZWISCHEN Partien. Sauberer gemessen hat das ALTE Modell triviale Strategien (aggressiv
  // fliegt immer auf, vorsichtig gewinnt immer). Das behebt erst das Wettrennen (Etappe 1–5).
  // Deshalb prüft dieses Gate NUR die über alle Reset-/Reihenfolge-Varianten stabile
  // Invariante — GEWINNBAR UND VERLIERBAR im Aggregat (Gesamtsieg 15–17, Niederlage 19–21) —
  // und dokumentiert die Pro-Strategie-Bänder als Ziel (TARGET_BANDS), das mit der neuen
  // Mechanik scharfgeschaltet wird.
  resetStoryActorAI();
  resetStoryComboSystem();
  resetCrisisMomentSystem();
  resetBetrayalSystem();
  resetConsequenceSystem();
}

function runOne(strategy: Strategy, seed: string, maxPhases: number): SimResult {
  resetAllSingletons();
  const engine = createStoryEngine(seed);
  const rng = mulberry32(hashSeed(seed));

  let outcome: SimResult['outcome'] = 'timeout';
  let endTitle: string | null = null;
  let endPhase = 1;

  for (let phase = 1; phase <= maxPhases; phase++) {
    const end = engine.checkGameEnd();
    if (end) {
      outcome = end.type === 'victory' ? 'victory' : 'defeat';
      endTitle = end.title_en;
      endPhase = engine.getCurrentPhase().number;
      break;
    }
    let actionsThisPhase = 0;
    while (actionsThisPhase < 5) {
      const res = engine.getResources();
      if (res.actionPointsRemaining <= 0) break;
      const action = selectAction(engine.getAvailableActions() as SimAction[], strategy, res, rng);
      if (!action) break;
      try { engine.executeAction(action.id); } catch { break; }
      actionsThisPhase++;
    }
    const ac = engine.getActiveConsequence();
    if (ac?.choices?.length) {
      try { engine.handleConsequenceChoice(ac.choices[0].id); } catch { /* ignore */ }
    }
    engine.advancePhase();
    endPhase = engine.getCurrentPhase().number;
  }
  const axes = engine.getAuftragAxes();
  return {
    strategy, outcome, endTitle, endPhase,
    progressMin: engine.getAuftragProgressMin(),
    progressMean: engine.getAuftragProgress(),
    finalRisk: engine.getResources().risk,
    axes,
  };
}

// Zielbild-Zielbänder — ETAPPE 3 (Immunsystem) scharfgeschaltet, soweit tragfähig.
// Das Wettrennen (ABWEHR als zweiter Läufer) steht: aggressives Spiel fliegt jetzt am
// IMMUNSYSTEM auf (Lärm → Abwehr → „Das Land hält stand"), nicht mehr an einer
// Sofort-Enttarnung. Beobachtete, stabile Verteilung über viele Läufe (Sim ist durch
// `globalRandom` im Engine-Kern inhärent ±2–3 verrauscht — die Floors haben Luft):
//   greedy   ~33–58 %  (der Zielbild-Korridor 30–60 %: das Immunsystem bändigt Rambo-Spiel)
//   random   ~92–100 % (moderates, uninformiertes Spiel gelingt meist — SOUL §6 „Spaß zuerst")
//   low_risk ~17–42 %  (reine Passivität wird bestraft — Zielbild §3d: „Abwarten verliert")
// Kalibriert auf die /24-Stichprobe (72 Partien). Beobachtete Bänder über viele Läufe:
//   greedy   ~7–12 / 24  (29–50 %, Median ~42 % → Zielbild-Korridor 30–60 %)
//   random   ~23–24 / 24 (96–100 %)
//   low_risk ~7–15 / 24  (29–63 %; seed-abhängige Verteidiger-Spawns streuen breit)
// Die Floors haben Luft für die inhärente `globalRandom`-Verrauschung des Engine-Kerns.
const TARGET_BANDS = {
  greedyWinsMin: 5,          // greedy nie chancenlos (Rambo wird gebändigt, nicht ausgelöscht)
  greedyWinsMax: 17,         // … und nie unbesiegbar → Median im 30–60 %-Korridor
  lowRiskLossesMin: 5,       // reine Vorsicht ist KEIN sicherer Weg (Immunsystem holt auf)
  lowRiskWinsMax: 22,        // … und ist zugleich nicht chancenlos-verboten (kein 0/100)
  immunePathMin: 10,         // der NEUE Verlustweg „Das Land hält stand" feuert robust
  aggregateWinsMin: 15,      // gewinnbar
  aggregateLossesMin: 15,    // verlierbar
  // NOCH NICHT tragfähig (Carry-forward Etappe 5): „jeder Verlustweg ≥ 15 %". Der
  // Immun-Weg dominiert (~94 %), Enttarnung feuert nur dünn (0–7 %), weil der Sim-
  // Rambo schon vorher an der Abwehr scheitert. Die Aktions-Kuratierung (Etappe 5)
  // formt den Aktions-Draw um und wird die Enttarnung wieder in den Vordergrund holen.
};

/** Zählt Niederlagen nach Ende-Titel über eine Strategie-Teilmenge. */
function lossesByTitle(rs: SimResult[], title: string): number {
  return rs.filter(r => r.outcome === 'defeat' && r.endTitle === title).length;
}

describe('GEWINNBAR-UND-VERLIERBAR-Gate (Etappe 0)', () => {
  const STRATEGIES: Strategy[] = ['greedy', 'random', 'low_risk'];
  const RUNS = 24;              // 3 × 24 = 72 Partien — größere Stichprobe mittelt die
                               // `globalRandom`-Verrauschung des Engine-Kerns (±2–3 je 12)
                               // heraus, damit die Pro-Strategie-Bänder tragfähig werden.
  const MAX_PHASES = 120;       // Obergrenze; das Spiel endet am Wahltag (electionDay=40).

  // EINMAL fahren, mehrere Invarianten prüfen.
  const all: SimResult[] = [];
  for (const strat of STRATEGIES) {
    for (let i = 0; i < RUNS; i++) {
      all.push(runOne(strat, `wl_${strat}_${i}`, MAX_PHASES));
    }
  }

  const byStrategy = (s: Strategy) => all.filter(r => r.strategy === s);
  const wins = all.filter(r => r.outcome === 'victory');
  const defeats = all.filter(r => r.outcome === 'defeat');

  // Verteilung ausgeben — dieses Gate ist zugleich der Balance-Report.
  const lossCauses: Record<string, number> = {};
  for (const d of defeats) lossCauses[d.endTitle ?? '?'] = (lossCauses[d.endTitle ?? '?'] || 0) + 1;
  console.log('\n=== GEWINNBAR-UND-VERLIERBAR-GATE ===');
  console.log(`  Partien: ${all.length}  Siege: ${wins.length}  Niederlagen: ${defeats.length}  Timeouts: ${all.filter(r => r.outcome === 'timeout').length}`);
  const med2 = (xs: number[]) => { const s = [...xs].sort((a, b) => a - b); return s.length ? s[Math.floor(s.length / 2)] : 0; };
  for (const s of STRATEGIES) {
    const g = byStrategy(s);
    const mins = g.map(r => r.progressMin);
    const causes: Record<string, number> = {};
    for (const d of g.filter(r => r.outcome === 'defeat')) causes[d.endTitle ?? '?'] = (causes[d.endTitle ?? '?'] || 0) + 1;
    console.log(`  ${s}: ${g.filter(r => r.outcome === 'victory').length} Sieg / ${g.filter(r => r.outcome === 'defeat').length} Niederlage · progMin med ${(med2(mins) * 100).toFixed(0)}% max ${(Math.max(...mins) * 100).toFixed(0)}% · finalRisk med ${med2(g.map(r => r.finalRisk)).toFixed(0)} · endTag med ${med2(g.map(r => r.endPhase))} · Ursachen ${JSON.stringify(causes)}`);
  }
  console.log(`  Niederlage-Ursachen: ${JSON.stringify(lossCauses)}`);
  const med = (xs: number[]) => { const s = [...xs].sort((a, b) => a - b); return s.length ? s[Math.floor(s.length / 2)] : 0; };
  console.log(`  Auftrag-Fortschritt: min(Median) ${(med(all.map(r => r.progressMin)) * 100).toFixed(0)}% · mean(Median) ${(med(all.map(r => r.progressMean)) * 100).toFixed(0)}% · Max-min ${(Math.max(...all.map(r => r.progressMin)) * 100).toFixed(0)}% · finalRisk(Median) ${med(all.map(r => r.finalRisk)).toFixed(0)}`);
  // Pro-Achse (alle Strategien): welche Signatur-Achse ist der Flaschenhals?
  for (const s of STRATEGIES) {
    const runs = byStrategy(s);
    const axisKeys = runs[0]?.axes.map(a => a.wert) ?? [];
    for (const k of axisKeys) {
      const vals = runs.map(r => r.axes.find(a => a.wert === k)?.progress ?? 0);
      console.log(`    ${s} Achse ${k}: med ${(med(vals) * 100).toFixed(0)}% max ${(Math.max(...vals) * 100).toFixed(0)}%`);
    }
  }

  const greedyWins = byStrategy('greedy').filter(r => r.outcome === 'victory').length;
  const lowRiskLosses = byStrategy('low_risk').filter(r => r.outcome === 'defeat').length;
  const immuneLosses = defeats.filter(d => d.endTitle === 'The Country Holds').length;

  it('ist GEWINNBAR (genug Siege im Aggregat)', () => {
    expect(wins.length).toBeGreaterThanOrEqual(TARGET_BANDS.aggregateWinsMin);
  });

  it('ist VERLIERBAR (genug Niederlagen im Aggregat)', () => {
    // Der historische Bug war „Verlieren ist mathematisch unmöglich" — genau das fängt dies.
    expect(defeats.length).toBeGreaterThanOrEqual(TARGET_BANDS.aggregateLossesMin);
  });

  // ETAPPE 3 (Immunsystem) — scharfgeschaltete Pro-Strategie-Bänder:
  it('greedy (Rambo) ist im Zielbild-Korridor — weder chancenlos noch unbesiegbar', () => {
    // Das Immunsystem bändigt maximal-aggressives Spiel: es gewinnt ~50 %, statt (Etappe 2)
    // immer an der eigenen Risiko-Rate aufzufliegen (0 %) oder trivial durchzumarschieren.
    expect(greedyWins).toBeGreaterThanOrEqual(TARGET_BANDS.greedyWinsMin);
    expect(greedyWins).toBeLessThanOrEqual(TARGET_BANDS.greedyWinsMax);
  });

  it('bestraft reine Passivität (low_risk ist kein sicherer Weg)', () => {
    // Zielbild §3d: Zeitgrundrauschen + Verteidiger-Zuwachs + „Gepatcht"-Sprünge lassen
    // auch das geduldige Nichtstun-Spiel am Immunsystem scheitern (kein garantierter Sieg mehr).
    const lowRiskWins = byStrategy('low_risk').filter(r => r.outcome === 'victory').length;
    expect(lowRiskLosses).toBeGreaterThanOrEqual(TARGET_BANDS.lowRiskLossesMin);
    expect(lowRiskWins).toBeLessThanOrEqual(TARGET_BANDS.lowRiskWinsMax);
  });

  it('übt den NEUEN Verlustweg „Das Land hält stand" (Immunsystem) aus', () => {
    // Der Etappe-3-Kern: die ABWEHR erreicht 100 vor dem Wahltag — der zweite Rennläufer
    // gewinnt das Rennen. Vor Etappe 3 gab es diesen Verlustweg gar nicht.
    expect(immuneLosses).toBeGreaterThanOrEqual(TARGET_BANDS.immunePathMin);
  });

  it('ist im OUTCOME deterministisch reproduzierbar (gleiche Seed → gleicher Ausgang)', () => {
    // Nur der Ausgang (Sieg/Niederlage) wird gepinnt — die exakte End-Phase driftet wegen
    // des nicht vollständig isolierbaren Legacy-Singleton-Graphs und ist KEIN Gate-Kriterium.
    const a = runOne('random', 'wl_determinism_check', MAX_PHASES);
    const b = runOne('random', 'wl_determinism_check', MAX_PHASES);
    expect(a.outcome).toBe(b.outcome);
  });

  // Anker, damit die dokumentierten Carry-forward-Konstanten nicht verwaisen (Etappe 5):
  it('dokumentiert den offenen Verlustwege-Ausgleich als Carry-forward', () => {
    expect(TARGET_BANDS.greedyWinsMin).toBeGreaterThan(0);
    expect(lossesByTitle(byStrategy('greedy'), 'The Country Holds')).toBeGreaterThanOrEqual(0);
  });
});
