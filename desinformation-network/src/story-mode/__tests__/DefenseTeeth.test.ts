/**
 * Etappe 3 Paket C — „Zähne scharfschalten": drei dormante Verteidiger-Mechaniken
 * wirken jetzt. (1) Plattform-Sperren werden in getAvailableActions/executeAction
 * DURCHGESETZT, (2) reach_reduction dämpft die Aktions-Wirkung real (mit Abklingen),
 * (3) BetrayalEvent.effects werden angewandt; Verrat = +15-Abwehr-Ereignis statt
 * eigener Game-Over (apparatus-Zweig entfernt → 3 Kern-Verlustwege).
 */
import { describe, it, expect } from 'vitest';
import { createStoryEngine } from '../../game-logic/StoryEngineAdapter';
import { getStoryActorAI, resetStoryActorAI } from '../engine/StoryActorAI';
import type { BetrayalEvent } from '../engine/BetrayalSystem';

describe('Plattform-Sperren durchgesetzt (C1)', () => {
  it('gesperrte Aktion ist ausgegraut („Kanal gesperrt") und nicht ausführbar', () => {
    resetStoryActorAI();
    const e = createStoryEngine('teeth_ban');
    const ai = getStoryActorAI();
    ai.disableAction('1.1', e.getCurrentPhase().number + 3);

    const banned = e.getAvailableActions().find(a => a.id === '1.1');
    expect(banned).toBeDefined();
    expect(banned!.available).toBe(false);
    expect(banned!.unavailableReason).toContain('Kanal gesperrt');

    const result = e.executeAction('1.1');
    expect(result.success).toBe(false);
    expect(result.narrative.headline_de).toBe('Kanal gesperrt');
    // Keine Kosten abgezogen, kein Aktionspunkt verbraucht.
    expect(e.getResources().actionPointsRemaining).toBe(5);
  });

  it('nach Ablauf der Sperre ist der Kanal wieder frei', () => {
    resetStoryActorAI();
    const e = createStoryEngine('teeth_unban');
    const ai = getStoryActorAI();
    ai.disableAction('1.1', e.getCurrentPhase().number + 1); // nur heute gesperrt
    e.advancePhase();
    const action = e.getAvailableActions().find(a => a.id === '1.1');
    expect(action!.available).toBe(true);
    expect(e.executeAction('1.1').success).toBe(true);
  });
});

describe('reach_reduction dämpft die Wirkung (C2)', () => {
  it('gedämpfte Aktion bewegt die Gesellschaft schwächer als ungedämpfte', () => {
    // Zwei identische Engines; in einer wird die Dämpfung über einen Alt-Save injiziert.
    function polarisierungGain(dampening: number): number {
      resetStoryActorAI();
      const e = createStoryEngine('teeth_damp');
      if (dampening > 0) {
        const save = JSON.parse(e.saveState());
        save.reachDampening = dampening;
        e.loadState(JSON.stringify(save));
      }
      const before = e.getResources().polarisierung;
      e.executeAction('8.2'); // illegale Ziel-Aktion mit Gesellschafts-Wirkung
      return e.getResources().polarisierung - before;
    }
    const voll = polarisierungGain(0);
    const gedaempft = polarisierungGain(0.5);
    expect(voll).toBeGreaterThan(0);
    expect(gedaempft).toBeLessThan(voll);
  });

  it('die Dämpfung klingt über Phasen ab', () => {
    resetStoryActorAI();
    const e = createStoryEngine('teeth_decay');
    const save = JSON.parse(e.saveState());
    save.reachDampening = 0.4;
    e.loadState(JSON.stringify(save));
    e.advancePhase();
    e.advancePhase();
    const after = JSON.parse(e.saveState()).reachDampening;
    expect(after).toBeLessThan(0.4 * 0.7 * 0.7 + 0.001);
  });
});

describe('Verrat = Abwehr-Ereignis (C3)', () => {
  const event: BetrayalEvent = {
    npcId: 'marina',
    npcName: 'Marina',
    type: 'whistleblower',
    severity: 'major',
    consequence_de: 'Marina hat sich an die Presse gewandt.',
    consequence_en: 'Marina has gone to the press.',
    effects: [
      { type: 'risk_increase', value: 45, description_de: 'Leak', description_en: 'Leak' },
      { type: 'evidence_exposed', value: 1, description_de: 'Beweise', description_en: 'Evidence' },
      { type: 'npc_lost', value: 1, description_de: 'Verloren', description_en: 'Lost' },
    ],
    finalDialogue_de: '…',
    finalDialogue_en: '…',
  };

  it('wendet die Effekte an: Risiko, Ermittlung, NPC-Verlust, Abwehr +15, Leak-News', () => {
    resetStoryActorAI();
    const e = createStoryEngine('teeth_betray');
    const abwehrBefore = e.getAbwehr();
    const riskBefore = e.getResources().risk;

    e.applyBetrayalEvent(event);

    expect(e.getResources().risk).toBe(Math.min(100, riskBefore + 45));
    expect(e.getAbwehr()).toBeCloseTo(abwehrBefore + 15, 5);
    expect(JSON.parse(e.saveState()).exposureCountdown).toBe(10);
    const marina = e.getAllNPCs().find(n => n.id === 'marina');
    expect(marina!.inCrisis).toBe(true);
    expect(marina!.available).toBe(false);
    expect(e.getNewsEvents().some(n => n.id.startsWith('betrayal_leak_marina'))).toBe(true);
  });

  it('drei Verräter beenden das Spiel NICHT mehr von selbst (apparatus entfernt)', () => {
    resetStoryActorAI();
    const e = createStoryEngine('teeth_no_apparatus');
    // Früher: betrayingNpcs >= 3 → „Der Apparat zerfällt". Heute zählt nur noch, was
    // die Verrats-EREIGNISSE mit Risiko/Abwehr machen. Ohne diese: Spiel läuft weiter.
    expect(e.checkGameEnd()).toBeNull();
  });
});
