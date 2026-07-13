/**
 * TAG-40-MARATHON-GATE (Verify-Suite, 2026-07-13)
 * ================================================
 * Erster Engine-Langlauf, der die 40-Tage-Kampagne strukturell bis zum ECHTEN
 * Ende fährt (bisher hat nachweislich kein Test/Runthrough je Tag 40 erreicht —
 * winnable-and-losable prüft Ausgangs-VERTEILUNGEN, nicht die Tages-Struktur).
 *
 * 2 Strategien × 3 Seeds = 6 Läufe:
 *   - „passiv":  0 Aktionen/Tag (reines Verstreichenlassen)
 *   - „sparsam": 1 billigste LEGALE Aktion/Tag (legality === 'legal', minimaler
 *                Budget-Preis); offene Konsequenzen werden mit der 1. Wahl gelöst.
 *
 * Assertions sind STRUKTURELL (kein Balance-Urteil):
 *   1. Der Tag steigt je advancePhase() monoton um GENAU 1.
 *   2. Nie Tag > electionDay ohne gemeldetes Spielende (checkGameEnd != null).
 *   3. Jedes Ende hat type ∈ {victory, defeat} UND einen branch.
 *   4. Keine Exceptions aus der Engine-Schleife.
 *   5. Kein Lauf braucht den Hard-Stop (Tag > 45) — der Hard-Stop selbst ist ein
 *      BEFUND (im JSON als hardStop dokumentiert), kein Assertion-Spam je Tag.
 *
 * Output: runs/verify-suite/day40-marathon.json + console.table.
 * Lauf:   npx vitest run src/story-mode/tests/day40-marathon.test.ts
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { createStoryEngine } from '../../game-logic/StoryEngineAdapter';
import { resetStoryActorAI } from '../engine/StoryActorAI';
import { resetStoryComboSystem } from '../engine/StoryComboSystem';
import { resetCrisisMomentSystem } from '../engine/CrisisMomentSystem';
import { resetBetrayalSystem } from '../engine/BetrayalSystem';
import { resetConsequenceSystem } from '../engine/ConsequenceSystem';

type Strategy = 'passiv' | 'sparsam';

/** Hard-Stop deutlich HINTER dem Wahltag (electionDay=40): erreicht ihn ein Lauf,
 *  ist die Kampagnen-Uhr strukturell gebrochen (Befund, kein Test-Fail-Spam). */
const HARD_STOP_DAY = 45;

interface SimAction {
  id: string;
  available: boolean;
  legality?: string;
  costs?: { budget?: number; capacity?: number; risk?: number; attention?: number };
}

interface DayTrace {
  day: number;
  actionsExecuted: number;
  abwehr: number;
  risk: number;
}

interface MarathonRun {
  strategy: Strategy;
  seed: string;
  endDay: number;
  endType: string | null;    // 'victory' | 'defeat' | null (nur bei hardStop)
  endBranch: string | null;
  endTitle: string | null;
  abwehrFinal: number;       // Abwehr-Endstand (storyResources.wehrhaftigkeit)
  riskFinal: number;
  budgetFinal: number;
  hardStop: boolean;         // Tag > HARD_STOP_DAY erreicht ohne Ende (= Befund)
  monotonicViolations: string[]; // Tage, an denen der Tag NICHT um genau 1 stieg
  pastElectionWithoutEnd: string[]; // Tage > electionDay ohne gemeldetes Ende
  exception: string | null;  // Exception aus der Schleife (= Befund)
  daysSimulated: number;
  trace: DayTrace[];         // kompakter Verlauf (für die JSON-Auswertung)
}

function resetAllSingletons(): void {
  // Gleiches Reset-Set wie winnable-and-losable.test.ts (per-Partie-Gameplay-
  // Singletons; die reinen Daten-Loader bleiben bewusst stehen — s. Befund dort).
  resetStoryActorAI();
  resetStoryComboSystem();
  resetCrisisMomentSystem();
  resetBetrayalSystem();
  resetConsequenceSystem();
}

/** Billigste LEGALE, bezahlbare Aktion (minimaler Budget-Preis; Tie-Break:
 *  Kapazität, dann id — deterministisch ohne RNG). */
function cheapestLegalAction(
  actions: SimAction[],
  res: { budget: number; capacity: number },
): SimAction | null {
  const candidates = actions.filter(a =>
    a.available
    && (a.legality ?? 'legal') === 'legal'
    && (!a.costs?.budget || res.budget >= a.costs.budget)
    && (!a.costs?.capacity || res.capacity >= a.costs.capacity));
  if (candidates.length === 0) return null;
  return candidates.slice().sort((a, b) =>
    (a.costs?.budget ?? 0) - (b.costs?.budget ?? 0)
    || (a.costs?.capacity ?? 0) - (b.costs?.capacity ?? 0)
    || a.id.localeCompare(b.id))[0];
}

function runMarathon(strategy: Strategy, seed: string): MarathonRun {
  resetAllSingletons();
  const engine = createStoryEngine(seed);

  const run: MarathonRun = {
    strategy, seed,
    endDay: 1, endType: null, endBranch: null, endTitle: null,
    abwehrFinal: 0, riskFinal: 0, budgetFinal: 0,
    hardStop: false,
    monotonicViolations: [], pastElectionWithoutEnd: [],
    exception: null, daysSimulated: 0, trace: [],
  };

  try {
    // Obergrenze der Schleifen-Iterationen: HARD_STOP_DAY + Luft — die Schleife
    // endet regulär über checkGameEnd() oder den Hard-Stop-Ausstieg.
    for (let iter = 0; iter < HARD_STOP_DAY + 5; iter++) {
      const day = engine.getCurrentPhase().number;
      const electionDay = engine.getElectionInfo().electionDay;

      const end = engine.checkGameEnd();
      if (end) {
        run.endDay = day;
        run.endType = end.type ?? null;
        run.endBranch = end.branch ?? null;
        run.endTitle = end.title_en ?? null;
        break;
      }

      // Struktur-Invariante 2: hinter dem Wahltag darf es kein „weiter so" geben.
      if (day > electionDay) {
        run.pastElectionWithoutEnd.push(`Tag ${day} > electionDay ${electionDay} ohne GameEnd`);
      }
      if (day > HARD_STOP_DAY) {
        run.hardStop = true;
        run.endDay = day;
        break;
      }

      // Strategie ausspielen.
      let actionsToday = 0;
      if (strategy === 'sparsam') {
        const res = engine.getResources();
        if (res.actionPointsRemaining > 0) {
          const action = cheapestLegalAction(engine.getAvailableActions() as SimAction[], res);
          if (action) {
            engine.executeAction(action.id);
            actionsToday = 1;
          }
        }
        // Offene Konsequenz nicht liegen lassen (blockiert sonst den Risiko-Abbau
        // dauerhaft und ist kein realistisches Spielerverhalten): 1. Wahl nehmen.
        const ac = engine.getActiveConsequence();
        if (ac?.choices?.length) {
          try { engine.handleConsequenceChoice(ac.choices[0].id); } catch { /* strukturell egal */ }
        }
      }

      const r = engine.getResources();
      run.trace.push({ day, actionsExecuted: actionsToday, abwehr: Math.round(r.wehrhaftigkeit), risk: Math.round(r.risk) });

      engine.advancePhase();
      run.daysSimulated++;

      // Struktur-Invariante 1: Tag steigt monoton um GENAU 1.
      const newDay = engine.getCurrentPhase().number;
      if (newDay !== day + 1) {
        run.monotonicViolations.push(`Tag ${day} -> ${newDay} (erwartet ${day + 1})`);
      }
      run.endDay = newDay;
    }
  } catch (e) {
    run.exception = e instanceof Error ? `${e.message}\n${e.stack}` : String(e);
  }

  const res = engine.getResources();
  run.abwehrFinal = Math.round(res.wehrhaftigkeit * 10) / 10;
  run.riskFinal = Math.round(res.risk * 10) / 10;
  run.budgetFinal = Math.round(res.budget);
  return run;
}

describe('TAG-40-MARATHON (Engine-Langlauf-Gate)', () => {
  const SEEDS = ['11', '23', '42'];
  const STRATEGIES: Strategy[] = ['passiv', 'sparsam'];

  // EINMAL fahren, mehrere Invarianten prüfen (Muster winnable-and-losable).
  const runs: MarathonRun[] = [];
  for (const strategy of STRATEGIES) {
    for (const seed of SEEDS) {
      runs.push(runMarathon(strategy, seed));
    }
  }

  // Report: console.table + JSON-Artefakt für die Verify-Suite.
  const tableRows = runs.map(r => ({
    strategie: r.strategy,
    seed: r.seed,
    endTag: r.endDay,
    ende: r.endType ? `${r.endType}/${r.endBranch}` : (r.hardStop ? 'HARD-STOP' : '—'),
    titel: r.endTitle ?? '—',
    abwehr: r.abwehrFinal,
    risiko: r.riskFinal,
    budget: r.budgetFinal,
    befunde: r.monotonicViolations.length + r.pastElectionWithoutEnd.length + (r.exception ? 1 : 0),
  }));
  // eslint-disable-next-line no-console
  console.log('\n=== TAG-40-MARATHON ===');
  // eslint-disable-next-line no-console
  console.table(tableRows);

  // jsdom-Umgebung: import.meta.url ist KEINE file://-URL — Vitest läuft mit
  // cwd = Paketwurzel (desinformation-network), also von dort auflösen.
  const outFile = path.resolve(process.cwd(), 'runs/verify-suite/day40-marathon.json');
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify({
    generatedAt: new Date().toISOString(),
    hardStopDay: HARD_STOP_DAY,
    runs,
  }, null, 2));

  it('läuft ohne Engine-Exceptions durch', () => {
    const withException = runs.filter(r => r.exception);
    expect(withException.map(r => `${r.strategy}/${r.seed}: ${r.exception?.split('\n')[0]}`)).toEqual([]);
  });

  it('Tag steigt je advancePhase monoton um genau 1 (alle 6 Läufe)', () => {
    const violations = runs.flatMap(r => r.monotonicViolations.map(v => `${r.strategy}/${r.seed}: ${v}`));
    expect(violations).toEqual([]);
  });

  it('nie Tag > electionDay ohne gemeldetes Spielende', () => {
    const violations = runs.flatMap(r => r.pastElectionWithoutEnd.map(v => `${r.strategy}/${r.seed}: ${v}`));
    expect(violations).toEqual([]);
  });

  it('kein Lauf braucht den Hard-Stop (Tag > 45)', () => {
    // Ein Hard-Stop wäre der Befund „Kampagnen-Uhr endet nie" — Details im JSON.
    expect(runs.filter(r => r.hardStop).map(r => `${r.strategy}/${r.seed}`)).toEqual([]);
  });

  it('jedes reguläre Ende hat type ∈ {victory, defeat} UND einen branch', () => {
    for (const r of runs.filter(x => !x.hardStop)) {
      expect(['victory', 'defeat'], `${r.strategy}/${r.seed}: endType`).toContain(r.endType);
      expect(r.endBranch, `${r.strategy}/${r.seed}: endBranch fehlt`).toBeTruthy();
    }
  });

  it('das JSON-Artefakt wurde geschrieben', () => {
    expect(fs.existsSync(outFile)).toBe(true);
    const parsed = JSON.parse(fs.readFileSync(outFile, 'utf-8'));
    expect(parsed.runs).toHaveLength(6);
  });
});
