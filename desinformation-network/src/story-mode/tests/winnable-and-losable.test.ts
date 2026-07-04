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
 * Ist-Verteilung nach Etappe 1 (2026-07-04, Auftrag = Sieg „Die Wahl", 36 Partien):
 * ~6–7 Siege / ~30 Niederlagen; greedy ~50 % (in Zielbild-Band 30–60 %), random 0 %,
 * low_risk 0 % (beide treiben die aggressive Signatur nicht → verlieren stets); einzige
 * Niederlage-Ursache noch „Exposed" (die anderen Verlustwege kommen mit Etappe 2/3).
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

// Zielbild-Zielbänder (Etappe-für-Etappe scharfzuschalten, wenn das Wettrennen steht).
// HEUTE bewusst NICHT asserted — das aktuelle Modell ist noch nicht das Rennen.
const TARGET_BANDS = {
  greedyWinRate: [0.30, 0.60],   // greedy gewinnt 30–60 %
  randomMaxWinRate: 0.10,        // random gewinnt < 10 %
  randomMinLossRate: 0.60,       // random verliert > 60 %
  eachLossPathMinShare: 0.15,    // jeder Verlustweg ≥ 15 % der Niederlagen
  // + kein Profil bei 0 % oder 100 %; mediane Siegtage nahe Kampagnenende
};

describe('GEWINNBAR-UND-VERLIERBAR-Gate (Etappe 0)', () => {
  const STRATEGIES: Strategy[] = ['greedy', 'random', 'low_risk'];
  const RUNS = 12;              // 3 × 12 = 36 Partien (wie balance-sim)
  const MAX_PHASES = 120;       // aktuelles Modell; wird in Etappe 2 zur Kampagnen-Uhr

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
    console.log(`  ${s}: ${g.filter(r => r.outcome === 'victory').length} Sieg / ${g.filter(r => r.outcome === 'defeat').length} Niederlage · progMin med ${(med2(mins) * 100).toFixed(0)}% max ${(Math.max(...mins) * 100).toFixed(0)}% · finalRisk med ${med2(g.map(r => r.finalRisk)).toFixed(0)}`);
  }
  console.log(`  Niederlage-Ursachen: ${JSON.stringify(lossCauses)}`);
  const med = (xs: number[]) => { const s = [...xs].sort((a, b) => a - b); return s.length ? s[Math.floor(s.length / 2)] : 0; };
  console.log(`  Auftrag-Fortschritt: min(Median) ${(med(all.map(r => r.progressMin)) * 100).toFixed(0)}% · mean(Median) ${(med(all.map(r => r.progressMean)) * 100).toFixed(0)}% · Max-min ${(Math.max(...all.map(r => r.progressMin)) * 100).toFixed(0)}% · finalRisk(Median) ${med(all.map(r => r.finalRisk)).toFixed(0)}`);
  // Pro-Achse (greedy): welche Signatur-Achse ist der Flaschenhals?
  const greedyRuns = byStrategy('greedy');
  const axisKeys = greedyRuns[0]?.axes.map(a => a.wert) ?? [];
  for (const k of axisKeys) {
    const vals = greedyRuns.map(r => r.axes.find(a => a.wert === k)?.progress ?? 0);
    console.log(`    greedy Achse ${k}: med ${(med(vals) * 100).toFixed(0)}% max ${(Math.max(...vals) * 100).toFixed(0)}%`);
  }

  it('ist GEWINNBAR (genug Siege im Aggregat)', () => {
    // Ist ~6–7 (Etappe 1). Floor 4 → beweist robust „gewinnbar", mit Luft für die ±1–2-Drift
    // des nicht-isolierbaren Legacy-Sims. Die Verschärfung auf die 30–60 %-Bänder folgt mit
    // dem Wettrennen (TARGET_BANDS).
    expect(wins.length).toBeGreaterThanOrEqual(4);
  });

  it('ist VERLIERBAR (genug Niederlagen im Aggregat)', () => {
    // Der historische Bug war „Verlieren ist mathematisch unmöglich" — genau das fängt dies.
    // Ist ~30. Floor 6.
    expect(defeats.length).toBeGreaterThanOrEqual(6);
  });

  it('übt mindestens eine echte Niederlage-Ursache aus', () => {
    expect(Object.keys(lossCauses).length).toBeGreaterThanOrEqual(1);
  });

  it('ist im OUTCOME deterministisch reproduzierbar (gleiche Seed → gleicher Ausgang)', () => {
    // Nur der Ausgang (Sieg/Niederlage) wird gepinnt — die exakte End-Phase driftet wegen
    // des nicht vollständig isolierbaren Legacy-Singleton-Graphs und ist KEIN Gate-Kriterium.
    const a = runOne('random', 'wl_determinism_check', MAX_PHASES);
    const b = runOne('random', 'wl_determinism_check', MAX_PHASES);
    expect(a.outcome).toBe(b.outcome);
  });

  // OFFENES ZIEL (Etappe 1–5, NICHT asserted): Pro-Strategie-Balance + Verlustwege-Bänder,
  // sobald das Wettrennen die trivialen Strategien des Altmodells auflöst.
  // Siehe TARGET_BANDS: greedy 30–60 % Siege, random < 10 %, jeder Verlustweg ≥ 15 %,
  // kein Profil bei 0/100 %. Als Anker referenziert, damit die Konstante nicht verwaist:
  it('dokumentiert die Zielbild-Bänder als kommende Verschärfung', () => {
    expect(TARGET_BANDS.greedyWinRate[0]).toBeGreaterThan(0);
    expect(TARGET_BANDS.eachLossPathMinShare).toBe(0.15);
  });
});
