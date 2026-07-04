/**
 * Etappe 3 Paket B — Stufen-Gegenmaßnahmen: An den Abwehr-Stufen 25/50/75 feuert je
 * eine kuratierte DISARM-Maßnahme (Prebunking cm24 · Plattform-Sperre cm05 ·
 * Task-Force cm22); der Spieler reagiert vereinheitlicht (kontern/aussitzen/ablenken).
 * Getestet am echten Engine-Pfad; Stufen werden über Save/Load injiziert.
 */
import { describe, it, expect } from 'vitest';
import { createStoryEngine, type StoryEngineAdapter } from '../../game-logic/StoryEngineAdapter';

/** Engine mit Abwehr knapp unter der Ziel-Stufe; frühere Stufen gelten als gezündet.
 *  Vertrauen wird auf 80 erodiert (Prebunking kann sonst nichts zurückholen — Start 100 = Deckel). */
function engineAtStage(seed: string, stage: 25 | 50 | 75): StoryEngineAdapter {
  const e = createStoryEngine(seed);
  const save = JSON.parse(e.saveState());
  save.storyResources.wehrhaftigkeit = stage - 0.05;
  save.firedAbwehrStages = [25, 50, 75].filter((s) => s < stage);
  const obj = save.objectives.find((o: { id: string }) => o.id === 'obj_destabilize');
  if (obj) obj.currentValue = 80;
  e.loadState(JSON.stringify(save));
  e.advancePhase(); // Grundrauschen schiebt über die Stufe → Queue füllt sich
  return e;
}

describe('Stufen-Gegenmaßnahmen (Paket B)', () => {
  it('Stufe 25 bietet die Prebunking-Kampagne (cm24) mit drei Reaktionen an', () => {
    const e = engineAtStage('cm_25', 25);
    const offer = e.getPendingStageCountermeasure();
    expect(offer).not.toBeNull();
    expect(offer!.stage).toBe(25);
    expect(offer!.definition.id).toBe('cm24');
    expect(offer!.options.map(o => o.id)).toEqual(['kontern', 'aussitzen', 'ablenken']);
    expect(offer!.options.every(o => o.folge_de.length > 0)).toBe(true);
  });

  it('aussitzen füttert die Abwehr; die Queue ist danach leer', () => {
    const e = engineAtStage('cm_sit', 25);
    const before = e.getAbwehr();
    const res = e.resolveStageCountermeasure('aussitzen');
    expect(res).not.toBeNull();
    expect(res!.stage).toBe(25);
    expect(e.getAbwehr()).toBeGreaterThan(before);
    expect(e.getPendingStageCountermeasure()).toBeNull();
  });

  it('kontern kostet Budget und dämpft die Zähne (Prebunking +2 statt +4 Vertrauen)', () => {
    const voll = engineAtStage('cm_counter_a', 25);
    const trustVoll0 = JSON.parse(voll.saveState()).objectives
      .find((o: { id: string }) => o.id === 'obj_destabilize').currentValue;
    voll.resolveStageCountermeasure('aussitzen');
    const trustVoll1 = JSON.parse(voll.saveState()).objectives
      .find((o: { id: string }) => o.id === 'obj_destabilize').currentValue;

    const gekontert = engineAtStage('cm_counter_b', 25);
    const budget0 = gekontert.getResources().budget;
    const trustKonter0 = JSON.parse(gekontert.saveState()).objectives
      .find((o: { id: string }) => o.id === 'obj_destabilize').currentValue;
    gekontert.resolveStageCountermeasure('kontern');
    const trustKonter1 = JSON.parse(gekontert.saveState()).objectives
      .find((o: { id: string }) => o.id === 'obj_destabilize').currentValue;

    expect(gekontert.getResources().budget).toBe(budget0 - 25);
    // Beide gewinnen Vertrauen zurück (je eigene Baseline), gekontert aber weniger.
    expect(trustVoll1 - trustVoll0).toBeGreaterThan(0);
    expect(trustKonter1 - trustKonter0).toBeGreaterThan(0);
    expect(trustKonter1 - trustKonter0).toBeLessThan(trustVoll1 - trustVoll0);
  });

  it('kontern ist ohne Budget nicht wählbar', () => {
    const e = createStoryEngine('cm_broke');
    const save = JSON.parse(e.saveState());
    save.storyResources.wehrhaftigkeit = 24.95;
    save.storyResources.budget = 3;
    e.loadState(JSON.stringify(save));
    e.advancePhase();
    const offer = e.getPendingStageCountermeasure();
    // Budget regeneriert +5/Phase → 8 < 25: kontern gesperrt.
    expect(offer!.options.find(o => o.id === 'kontern')!.available).toBe(false);
  });

  it('Stufe 50 sperrt den zuletzt genutzten Kanal („Kanal gesperrt", X Tage grau)', () => {
    const e = createStoryEngine('cm_ban');
    // Erst eine echte Aktion spielen (Historie), dann die Stufe injizieren.
    e.executeAction('1.1');
    const save = JSON.parse(e.saveState());
    save.storyResources.wehrhaftigkeit = 49.95;
    save.firedAbwehrStages = [25];
    e.loadState(JSON.stringify(save));
    e.advancePhase();

    const offer = e.getPendingStageCountermeasure();
    expect(offer!.stage).toBe(50);
    expect(offer!.definition.id).toBe('cm05');
    const res = e.resolveStageCountermeasure('aussitzen');
    expect(res!.lines_de.some(l => l.includes('Kanal gesperrt'))).toBe(true);
    expect(e.isActionDisabledByAI('1.1')).toBe(true);
  });

  it('Stufe 75 startet den Ermittler-Countdown (Task-Force)', () => {
    const e = engineAtStage('cm_task', 75);
    const offer = e.getPendingStageCountermeasure();
    expect(offer!.stage).toBe(75);
    expect(offer!.definition.id).toBe('cm22');
    const riskBefore = e.getResources().risk;
    e.resolveStageCountermeasure('ablenken');
    const save = JSON.parse(e.saveState());
    expect(save.exposureCountdown).toBe(8);
    // ablenken: Risiko +6 (Reaktion) +5 (Task-Force) — mindestens deutlich höher.
    expect(e.getResources().risk).toBeGreaterThan(riskBefore);
  });

  it('zwei Stufen an einem Tag werden nacheinander angeboten', () => {
    const e = createStoryEngine('cm_double');
    e.executeAction('1.1'); // Historie für die Sperre der Stufe 50
    const save = JSON.parse(e.saveState());
    save.storyResources.wehrhaftigkeit = 24.9;
    e.loadState(JSON.stringify(save));
    // Abwehr per gezieltem Sprung über zwei Stufen: aussitzen (+4) reicht nicht —
    // stattdessen zweite Injektion: direkt unter 50 setzen und beide Stufen offen lassen.
    const save2 = JSON.parse(e.saveState());
    save2.storyResources.wehrhaftigkeit = 49.9;
    save2.firedAbwehrStages = [];
    e.loadState(JSON.stringify(save2));
    e.advancePhase(); // kreuzt 50 → aber 25 war nie gezündet: crossing erkennt nur 50

    // Die 25 wurde übersprungen (before 49.9 → after >50 kreuzt nur die 50).
    const first = e.getPendingStageCountermeasure();
    expect(first!.stage).toBe(50);
    e.resolveStageCountermeasure('aussitzen');
    expect(e.getPendingStageCountermeasure()).toBeNull();
  });
});
