/**
 * Etappe 3 — Integration: die ABWEHR lebt im Adapter (wehrhaftigkeit befördert).
 * Belegt am ECHTEN Engine-Pfad: (1) Start niedrig, (2) nächtlicher Schritt +
 * NightReport (Nacht-Transparenz), (3) Lärm beschleunigt, (4) Stufen-News +
 * Gegenmaßnahmen-Queue, (5) Verlust „Das Land hält stand" bei 100,
 * (6) Save/Load + Alt-Save-Migration.
 */
import { describe, it, expect } from 'vitest';
import { createStoryEngine } from '../../game-logic/StoryEngineAdapter';
import { ABWEHR_START } from '../engine/ImmuneSystem';

describe('ABWEHR im Adapter (Etappe 3)', () => {
  it('startet niedrig — das Land ist naiv', () => {
    const e = createStoryEngine('imm_start');
    expect(e.getAbwehr()).toBe(ABWEHR_START);
    expect(e.getAbwehrStageInfo().stages).toEqual([25, 50, 75]);
    expect(e.getAbwehrStageInfo().fired).toEqual([]);
    expect(e.getNightReport()).toBeNull();
  });

  it('wächst über Nacht (Grundrauschen) und liefert den NightReport fürs Tagesfazit', () => {
    const e = createStoryEngine('imm_night');
    const before = e.getAbwehr();
    e.advancePhase();
    const report = e.getNightReport();
    expect(e.getAbwehr()).toBeGreaterThan(before);
    expect(report).not.toBeNull();
    expect(report!.day).toBe(1);
    expect(report!.abwehrDelta).toBeGreaterThan(0);
    expect(report!.abwehrAfter).toBe(e.getAbwehr());
    expect(report!.abwehrParts.baseline).toBeGreaterThan(0);
    expect(typeof report!.trustRegeneration).toBe('number');
  });

  it('eigener Lärm (laute Aktionen) beschleunigt die Abwehr gegenüber einer stillen Nacht', () => {
    const still = createStoryEngine('imm_quiet');
    still.advancePhase();
    const stillDelta = still.getNightReport()!.abwehrDelta;

    const laut = createStoryEngine('imm_loud');
    // Illegale Ziel-Aktionen tragen Risiko-/Aufmerksamkeits-Kosten (Lärm).
    for (const id of ['8.2', '8.1', '8.5', '5.2']) {
      try { laut.executeAction(id); } catch { /* nicht verfügbar → egal */ }
    }
    laut.advancePhase();
    const lautReport = laut.getNightReport()!;
    expect(lautReport.abwehrParts.noise).toBeGreaterThan(0);
    expect(lautReport.abwehrDelta).toBeGreaterThan(stillDelta);
  });

  it('Stufen-Übergang feuert News + Gegenmaßnahmen-Queue genau einmal', () => {
    const e = createStoryEngine('imm_stage');
    // Abwehr knapp unter die Stufe setzen (Save/Load als sauberer Zustands-Injektor).
    const save = JSON.parse(e.saveState());
    save.storyResources.wehrhaftigkeit = 24.9;
    e.loadState(JSON.stringify(save));
    e.advancePhase();

    expect(e.getAbwehr()).toBeGreaterThanOrEqual(25);
    expect(e.getAbwehrStageInfo().fired).toContain(25);
    expect(e.getPendingAbwehrStages()).toContain(25);
    const news = e.getNewsEvents().find(n => n.id === 'abwehr_stage_25');
    expect(news).toBeDefined();
    expect(news!.pinned).toBe(true);

    // Queue konsumieren (Paket B) — danach leer; Stufe zündet nie erneut.
    expect(e.consumePendingAbwehrStage()).toBe(25);
    expect(e.consumePendingAbwehrStage()).toBeNull();
  });

  it('Abwehr 100 → Niederlage „Das Land hält stand" (auch bei erfülltem Auftrag)', () => {
    const e = createStoryEngine('imm_loss');
    const save = JSON.parse(e.saveState());
    save.storyResources.wehrhaftigkeit = 100;
    e.loadState(JSON.stringify(save));

    const end = e.checkGameEnd();
    expect(end).not.toBeNull();
    expect(end!.type).toBe('defeat');
    expect(end!.title_de).toBe('Das Land hält stand');
  });

  it('persistiert den Immunsystem-Zustand über save/load', () => {
    const e = createStoryEngine('imm_save');
    for (const id of ['8.2', '8.1']) {
      try { e.executeAction(id); } catch { /* egal */ }
    }
    e.advancePhase();
    const abwehr = e.getAbwehr();
    const report = e.getNightReport();

    const loaded = createStoryEngine('imm_load');
    loaded.loadState(e.saveState());
    expect(loaded.getAbwehr()).toBe(abwehr);
    expect(loaded.getNightReport()).toEqual(report);
  });

  it('migriert Alt-Saves (< 2.1.0): alter Gesellschafts-Wert 60 wird NICHT zur Abwehr', () => {
    const e = createStoryEngine('imm_migrate');
    const save = JSON.parse(e.saveState());
    // Alt-Save simulieren: kein Etappe-3-Marker, alter wehrhaftigkeit-Wert.
    save.version = '2.0.0';
    save.storyResources.wehrhaftigkeit = 60;
    delete save.firedAbwehrStages;
    delete save.methodFamilyUseCounts;
    delete save.patchedFamilies;
    delete save.pendingAbwehrStages;
    delete save.lastNightReport;
    delete save.noiseRiskToday;
    delete save.noiseAttentionToday;

    const loaded = createStoryEngine('imm_migrate2');
    loaded.loadState(JSON.stringify(save));
    expect(loaded.getAbwehr()).toBe(ABWEHR_START);
  });
});
