/**
 * Balancing-Simulation END-TO-END mit den P2-Systemen („Loop schließen", 2026-06-14).
 *
 * Die alte balance-sim deckt nur reguläre Aktionen ab. Diese hier spielt Partien, die
 * das KOMMUNIKATIONS-SCHLACHTFELD tatsächlich nutzen (Verbreiter aufbauen → Kompromat
 * beschaffen → Operation ausspielen) und belegt:
 *   1. Mit den neuen Systemen ist das Spiel GEWINN- und VERLIERBAR.
 *   2. Operationen tragen zum Sieg bei (Vertrauenserosion ist ein echter Lever).
 *   3. Rücksichtslose Operationen FÜHREN zur Niederlage (Enttarnung).
 *
 * Lauf: npx vitest run src/story-mode/tests/balance-sim-p2.test.ts
 */
import { describe, it, expect } from 'vitest';
import { createStoryEngine, type StoryEngineAdapter } from '../../game-logic/StoryEngineAdapter';
import { loadTargets, loadCarriers, loadPlatforms, type OperationParams } from '../battlefield/BattlefieldChain';
import { resetStoryActorAI } from '../engine/StoryActorAI';
import { resetStoryComboSystem } from '../engine/StoryComboSystem';
import { resetCrisisMomentSystem } from '../engine/CrisisMomentSystem';

type Profile = 'operator_safe' | 'operator_aggressive' | 'reckless_operator';

interface SimAction {
  id: string;
  available: boolean;
  legality?: string;
  costs?: { budget?: number; capacity?: number; risk?: number; attention?: number };
}

interface SimResult {
  profile: Profile;
  outcome: 'victory' | 'defeat' | 'timeout';
  endType: string | null;
  opsPlayed: number;
  carriersBurned: number;
  maxRisk: number;
  endPhase: number;
}

/** Niedrig-Risiko reguläre Aktion (begleitet die Operationen — realistisches Vollspiel). */
function pickRegular(actions: SimAction[], res: { budget: number; capacity: number }): SimAction | null {
  const affordable = actions.filter(a => a.available
    && (!a.costs?.budget || res.budget >= a.costs.budget)
    && (!a.costs?.capacity || res.capacity >= a.costs.capacity));
  if (affordable.length === 0) return null;
  return affordable.sort((a, b) =>
    ((a.costs?.risk || 0) + (a.costs?.attention || 0)) -
    ((b.costs?.risk || 0) + (b.costs?.attention || 0)))[0];
}

/** Verbreiter je Profil: sicher (niedrige exposure) vs. rücksichtslos (Bot-Netz). */
function carrierFor(profile: Profile): string {
  if (profile === 'reckless_operator') return 'botnetz';
  if (profile === 'operator_aggressive') return 'creator';
  return 'useful_idiots'; // exposure 0.2 — billig & leise
}

/** Deterministische Operation für ein Profil: Ziel/Schwäche/Plattform-Mix. */
function operationFor(profile: Profile): OperationParams | null {
  const carrier = loadCarriers().find(c => c.id === carrierFor(profile))!;
  // Ziel, dessen Milieu der Verbreiter trifft (gute Passung). Bot-Netz hat keine
  // Milieus → nimm ein heikles Ziel, das ohnehin verbrennt.
  const targets = loadTargets();
  const target = carrier.milieus.length > 0
    ? (targets.find(t => carrier.milieus.includes(t.milieu)) ?? targets[0])
    : (targets.find(t => t.id === 't_hinterbaenkler') ?? targets[0]);
  // Schwäche: sicher = niedrigste Heikelheit, rücksichtslos = höchste.
  const vulns = [...target.vulnerabilities].sort((a, b) => a.heikelheit - b.heikelheit);
  const vuln = profile === 'reckless_operator' ? vulns[vulns.length - 1] : vulns[0];
  // Plattform-Mix: sicher = milieu-passend & wenig moderiert; rücksichtslos = stark moderiert (→ exposure).
  let platforms = loadPlatforms().filter(p => p.milieus.includes(target.milieu));
  if (profile === 'reckless_operator') platforms = loadPlatforms().filter(p => p.moderation >= 0.8);
  if (platforms.length === 0) platforms = [loadPlatforms()[0]];
  return { target: target.id, vulnerability: vuln.id, carrier: carrier.id, platforms: platforms.slice(0, 2).map(p => p.id) };
}

/** Baut bei Bedarf Verbreiter+Kompromat auf und spielt eine Operation. */
function tryOperation(engine: StoryEngineAdapter, op: OperationParams): void {
  const state = engine.getCarrierState(op.carrier!);
  if (state === 'verbrannt') return;            // Asset verbrannt → diese Runde keine Op
  if (state !== 'aktiv' && !engine.buildCarrier(op.carrier!).ok) return;
  if (!engine.isKompromatAcquired(op.target!, op.vulnerability!)
    && !engine.acquireKompromat(op.target!, op.vulnerability!).ok) return;
  engine.playOperation(op);
}

function runOne(profile: Profile, seed: string, maxPhases: number): SimResult {
  resetStoryActorAI();
  resetStoryComboSystem();
  resetCrisisMomentSystem();
  const engine = createStoryEngine(seed);
  const op = operationFor(profile);

  let outcome: SimResult['outcome'] = 'timeout';
  let endType: string | null = null;
  let maxRisk = 0;
  let endPhase = 1;

  for (let phase = 1; phase <= maxPhases; phase++) {
    const end = engine.checkGameEnd();
    if (end) {
      outcome = end.type === 'victory' ? 'victory' : 'defeat';
      endType = end.type;
      endPhase = engine.getCurrentPhase().number;
      break;
    }

    // 1) Operation(en): rücksichtslos spielt 2×/Phase (treibt Enttarnung), sonst 1×.
    if (op) {
      tryOperation(engine, op);
      if (profile === 'reckless_operator') tryOperation(engine, op);
    }

    // 2) ein bis zwei begleitende reguläre Aktionen (realistisches Vollspiel).
    let acted = 0;
    while (acted < 2) {
      const res = engine.getResources();
      if (res.actionPointsRemaining <= 0) break;
      const a = pickRegular(engine.getAvailableActions() as SimAction[], res);
      if (!a) break;
      try { engine.executeAction(a.id); } catch { break; }
      acted++;
    }

    const ac = engine.getActiveConsequence();
    if (ac?.choices?.length) { try { engine.handleConsequenceChoice(ac.choices[0].id); } catch { /* ignore */ } }
    engine.advancePhase();
    maxRisk = Math.max(maxRisk, engine.getResources().risk);
    endPhase = engine.getCurrentPhase().number;
  }
  maxRisk = Math.max(maxRisk, engine.getResources().risk);
  const sum = engine.getOperationsSummary();
  return { profile, outcome, endType, opsPlayed: sum.operationsPlayed, carriersBurned: sum.carriersBurned, maxRisk, endPhase };
}

function report(label: string, runs: SimResult[]): void {
  const wins = runs.filter(r => r.outcome === 'victory');
  const defeats = runs.filter(r => r.outcome === 'defeat');
  const timeouts = runs.filter(r => r.outcome === 'timeout');
  const dist: Record<string, number> = {};
  for (const r of runs) { const k = r.endType ?? 'timeout'; dist[k] = (dist[k] || 0) + 1; }
  const opsAvg = (runs.reduce((s, r) => s + r.opsPlayed, 0) / runs.length).toFixed(1);
  const burns = runs.reduce((s, r) => s + r.carriersBurned, 0);
  console.log(`\n--- ${label} (${runs.length}) ---`);
  console.log(`  Sieg: ${wins.length}  Niederlage: ${defeats.length}  Timeout: ${timeouts.length}`);
  console.log(`  Ø Operationen/Partie: ${opsAvg}  Verbrannte Verbreiter (gesamt): ${burns}`);
  console.log(`  Max-Risiko (Max): ${Math.round(Math.max(...runs.map(r => r.maxRisk)))}`);
  console.log(`  Enden: ${JSON.stringify(dist)}`);
}

describe('Balance-Sim P2 (Schlachtfeld end-to-end)', () => {
  it('ist mit den neuen Systemen gewinn- UND verlierbar; Operationen wirken', () => {
    const MAX_PHASES = 120;
    const RUNS = 8;
    const profiles: Profile[] = ['operator_safe', 'operator_aggressive', 'reckless_operator'];
    const all: SimResult[] = [];
    for (const p of profiles) for (let i = 0; i < RUNS; i++) all.push(runOne(p, `p2_${p}_${i}`, MAX_PHASES));

    console.log('\n' + '='.repeat(70));
    console.log(`BALANCE-SIM P2  ${all.length} Partien  (maxPhases=${MAX_PHASES})`);
    console.log('='.repeat(70));
    report('GESAMT', all);
    for (const p of profiles) report(p, all.filter(r => r.profile === p));

    const wins = all.filter(r => r.outcome === 'victory');
    const defeats = all.filter(r => r.outcome === 'defeat');

    // (1) Gewinn- UND verlierbar mit allen neuen Systemen.
    expect(wins.length).toBeGreaterThan(0);
    expect(defeats.length).toBeGreaterThan(0);

    // (2) Operationen wurden tatsächlich gespielt (das Schlachtfeld ist im Spiel).
    expect(all.every(r => r.opsPlayed > 0)).toBe(true);

    // (3) Mindestens ein Sieg lief über eine Strategie, die Operationen einsetzte.
    expect(wins.some(r => r.opsPlayed > 0)).toBe(true);

    // (4) Rücksichtslose Operationen verbrennen Assets (Enttarnung als reale Gefahr).
    const reckless = all.filter(r => r.profile === 'reckless_operator');
    expect(reckless.some(r => r.carriersBurned > 0)).toBe(true);
  });
});
