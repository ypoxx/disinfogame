/**
 * P3/B3 — Angriffs-Phänomene (die „Verben"). Belegt, dass jede Familie ihren
 * Heimat-Wert bewegt, das Krisenfenster verstärkt + abläuft, der Gerüchte-Druck
 * verzögert blutet, und der Zustand save/load-fest ist.
 */
import { describe, it, expect } from 'vitest';
import { createStoryEngine } from '../../game-logic/StoryEngineAdapter';

function deltaAfter(actionId: string): Record<string, number> {
  const e = createStoryEngine('phen');
  const b = e.getResources();
  e.executeAction(actionId);
  const a = e.getResources();
  return {
    informationslast: a.informationslast - b.informationslast,
    polarisierung: a.polarisierung - b.polarisierung,
    zynismus: a.zynismus - b.zynismus,
    fragmentierung: a.fragmentierung - b.fragmentierung,
    diskursqualitaet: a.diskursqualitaet - b.diskursqualitaet,
  };
}

describe('Phänomen-Familien bewegen ihren Heimat-Wert', () => {
  it('Überflutung (Bot-Flut) → Informationslast↑, Diskursqualität↓', () => {
    const d = deltaAfter('11.2');
    expect(d.informationslast).toBeGreaterThan(3);
    expect(d.diskursqualitaet).toBeLessThan(0);
  });

  it('Zermürbung (Dauer-Empörung) → Zynismus↑', () => {
    expect(deltaAfter('11.8').zynismus).toBeGreaterThan(3);
  });

  it('Loyalitätsfalle (Identität vs. Fakten) → Polarisierung↑', () => {
    expect(deltaAfter('11.14').polarisierung).toBeGreaterThan(3);
  });

  it('Erinnerungskonflikt (Gedenken) → Polarisierung↑ und Fragmentierung↑', () => {
    const d = deltaAfter('11.18');
    expect(d.polarisierung).toBeGreaterThan(3);
    expect(d.fragmentierung).toBeGreaterThan(2);
  });
});

describe('Krisenfenster (P3)', () => {
  it('öffnet sich, verstärkt die nächste Aktion und läuft ab', () => {
    // Referenz: Informationslast-Delta von 11.2 OHNE Krisenfenster.
    const ref = deltaAfter('11.2').informationslast;

    const e = createStoryEngine('crisis');
    e.executeAction('11.10');            // Krisenfenster öffnen
    expect(e.getCrisisWindowPhasesLeft()).toBe(3);
    const before = e.getResources().informationslast;
    e.executeAction('11.2');             // im Fenster → verstärkt (×1.5)
    const amplified = e.getResources().informationslast - before;
    expect(amplified).toBeGreaterThan(ref);

    // Fenster läuft über Phasen ab.
    e.advancePhase(); e.advancePhase(); e.advancePhase();
    expect(e.getCrisisWindowPhasesLeft()).toBe(0);
  });
});

describe('Gerüchte-Druck (P3)', () => {
  it('baut Druck auf und blutet verzögert in die Informationslast', () => {
    const e = createStoryEngine('rumor');
    e.executeAction('11.5');             // Gerücht mutieren lassen
    expect(e.getRumorPressure()).toBeGreaterThan(0);
    const infoBefore = e.getResources().informationslast;
    e.advancePhase();                    // verzögerter Effekt
    expect(e.getResources().informationslast).toBeGreaterThan(infoBefore);
  });
});

describe('Persistenz des Phänomen-Zustands', () => {
  it('Krisenfenster + Gerüchte-Druck überstehen save/load; alte Saves → 0', () => {
    const e = createStoryEngine('persist');
    e.executeAction('11.10');            // Krisenfenster
    e.executeAction('11.5');             // Gerüchte-Druck
    const saved = e.saveState();
    const loaded = createStoryEngine('fresh');
    loaded.loadState(saved);
    expect(loaded.getCrisisWindowPhasesLeft()).toBe(e.getCrisisWindowPhasesLeft());
    expect(loaded.getRumorPressure()).toBeCloseTo(e.getRumorPressure(), 5);

    // Alter Save ohne die Felder → Default 0.
    const old = JSON.parse(saved);
    old.version = '1.0.0';
    delete old.crisisWindowPhasesLeft;
    delete old.rumorPressure;
    const loaded2 = createStoryEngine('fresh2');
    loaded2.loadState(JSON.stringify(old));
    expect(loaded2.getCrisisWindowPhasesLeft()).toBe(0);
    expect(loaded2.getRumorPressure()).toBe(0);
  });
});
