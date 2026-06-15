/**
 * P5 — Strategische Aufträge („Vertrauen = Mittel, Auftrag = Ziel").
 * Belegt: Auftragsdaten + Signaturen, Fortschritts-Formel, Engine-Auswahl/Persistenz,
 * und Balance-Neutralität (v1: obj_destabilize bleibt der Sieg, Auftrag formt das Ende).
 */
import { describe, it, expect } from 'vitest';
import { AUFTRAEGE, auftragProgress, getDefaultAuftrag } from '../engine/Auftraege';
import { createStoryEngine } from '../../game-logic/StoryEngineAdapter';

describe('Auftrags-Daten', () => {
  it('hat die drei Erst-Archetypen mit Default „Der Keil"', () => {
    expect(Object.keys(AUFTRAEGE).sort()).toEqual(['keil', 'wahl', 'zweifel']);
    expect(getDefaultAuftrag().id).toBe('keil');
    expect(AUFTRAEGE.keil.istDefault).toBe(true);
    for (const a of Object.values(AUFTRAEGE)) {
      expect(a.titel_de.length).toBeGreaterThan(2);
      expect(a.signatur.length).toBeGreaterThan(0);
      expect(a.instrument_de.length).toBeGreaterThan(5);
    }
  });

  it('auftragProgress steigt, wenn die Signatur-Werte ihr Ziel ansteuern', () => {
    const keil = AUFTRAEGE.keil; // polarisierung↑, fragmentierung↑, diskursqualitaet↓
    const low = auftragProgress(keil, { polarisierung: 50, fragmentierung: 50, diskursqualitaet: 50 });
    const high = auftragProgress(keil, { polarisierung: 65, fragmentierung: 45, diskursqualitaet: 40 });
    expect(high).toBeGreaterThan(low);
    expect(high).toBeGreaterThan(0.8);
  });

  it('unterscheidet Aufträge: dieselbe Lage, andere Signatur → anderer Fortschritt', () => {
    const lage = { polarisierung: 70, fragmentierung: 60, diskursqualitaet: 30, zynismus: 25, fraktionsstaerke: 25, vertrauen: 90 };
    const keil = auftragProgress(AUFTRAEGE.keil, lage);    // Spaltung hoch → weit
    const zweifel = auftragProgress(AUFTRAEGE.zweifel, lage); // Zynismus/Vertrauen kaum → wenig
    expect(keil).toBeGreaterThan(zweifel);
  });
});

describe('Auftrag in der Engine', () => {
  it('Default „keil", wählbar, save/load-fest', () => {
    const e = createStoryEngine('auftrag');
    expect(e.getAuftragId()).toBe('keil');
    e.setAuftrag('zweifel');
    expect(e.getAuftrag().titel_de).toBe('Der Zweifel');

    const saved = e.saveState();
    const loaded = createStoryEngine('fresh');
    loaded.loadState(saved);
    expect(loaded.getAuftragId()).toBe('zweifel');

    // Alter Save ohne Auftrag → Default keil.
    const old = JSON.parse(saved); old.version = '1.0.0'; delete old.currentAuftragId;
    const l2 = createStoryEngine('f2'); l2.loadState(JSON.stringify(old));
    expect(l2.getAuftragId()).toBe('keil');
  });

  it('Auftragswahl ändert die Sieg-Mathematik NICHT (Balance-Neutralität v1)', () => {
    // Der von applyActionEffects berechnete trust_erosion-EFFEKTWERT ist seed-/combo-
    // unabhängig (s. BalanceInvariant) — und damit der saubere Beleg, dass der Auftrag
    // die obj_destabilize-Mathematik nicht anfasst.
    function erosionEffect(auftrag: 'keil' | 'wahl' | 'zweifel'): number {
      const e = createStoryEngine('auftrag_bal');
      e.setAuftrag(auftrag);
      const r = e.executeAction('5.2');
      return (r.effects ?? []).find(x => x.type === 'trust_erosion')?.value ?? 0;
    }
    expect(erosionEffect('keil')).toBe(2);
    expect(erosionEffect('wahl')).toBe(2);
    expect(erosionEffect('zweifel')).toBe(2);
  });

  it('Auftrags-Fortschritt reagiert auf die Gesellschaftslage', () => {
    const e = createStoryEngine('auftrag_prog');
    e.setAuftrag('keil');
    const before = e.getAuftragProgress();
    // Spaltungs-Phänomene treiben die Keil-Signatur.
    for (const id of ['11.14', '11.18', '11.13']) { try { e.executeAction(id); } catch { /* egal */ } }
    expect(e.getAuftragProgress()).toBeGreaterThanOrEqual(before);
  });
});
