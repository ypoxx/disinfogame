/**
 * P5-Politur — signatur-getriebene Auftrags-Enden (EndingSystem.assembleAuftragEnding).
 * Belegt: Tonalität aus Moral/Risiko, Kategorie, eigene Erzählung je Auftrag × Ton,
 * und die konkrete Signatur-Bilanz aus den Endwerten. Pure → deterministisch.
 */
import { describe, it, expect } from 'vitest';
import {
  assembleAuftragEnding,
  auftragEndingTone,
  type AuftragEndingTone,
} from '../engine/EndingSystem';
import { AUFTRAEGE, auftragProgress, type AuftragId } from '../engine/Auftraege';

const AUFTRAG_IDS: AuftragId[] = ['keil', 'wahl', 'zweifel'];
// Erzwingt eine bestimmte Tonalität über Moral/Risiko.
const TONE_CTX: Record<AuftragEndingTone, { moralWeight: number; risk: number }> = {
  kalt: { moralWeight: 20, risk: 20 },
  pyrrhisch: { moralWeight: 70, risk: 20 },
  knapp: { moralWeight: 20, risk: 80 },
};
const TONES = Object.keys(TONE_CTX) as AuftragEndingTone[];

describe('auftragEndingTone', () => {
  it('hoher Moral-Preis → pyrrhisch, Enttarnungsnähe → knapp, sonst kalt', () => {
    expect(auftragEndingTone(70, 10)).toBe('pyrrhisch');
    expect(auftragEndingTone(20, 80)).toBe('knapp');
    expect(auftragEndingTone(20, 20)).toBe('kalt');
    // Moral schlägt Risiko (der teurere Sieg dominiert die Tonalität).
    expect(auftragEndingTone(60, 90)).toBe('pyrrhisch');
  });
});

describe('assembleAuftragEnding', () => {
  it('jede Auftrag × Tonalität-Kombination hat eigene, nicht-leere Erzählung', () => {
    const titles = new Set<string>();
    const epilogs = new Set<string>();
    for (const id of AUFTRAG_IDS) {
      for (const tone of TONES) {
        const e = assembleAuftragEnding(id, { ...TONE_CTX[tone], values: {} });
        expect(e.tone).toBe(tone);
        expect(e.title_de.length).toBeGreaterThan(3);
        expect(e.title_en.length).toBeGreaterThan(3);
        expect(e.epilog_de.length).toBeGreaterThan(40);
        expect(e.epilog_en.length).toBeGreaterThan(40);
        titles.add(e.title_de);
        epilogs.add(e.epilog_de);
      }
    }
    // 3 Aufträge × 3 Tonalitäten = 9 unterscheidbare Titel + Schluss-Erzählungen.
    expect(titles.size).toBe(9);
    expect(epilogs.size).toBe(9);
  });

  it('Kategorie folgt der Tonalität (pyrrhisch → pyrrhic, sonst victory)', () => {
    expect(assembleAuftragEnding('keil', { ...TONE_CTX.pyrrhisch, values: {} }).category).toBe('pyrrhic');
    expect(assembleAuftragEnding('keil', { ...TONE_CTX.kalt, values: {} }).category).toBe('victory');
    expect(assembleAuftragEnding('keil', { ...TONE_CTX.knapp, values: {} }).category).toBe('victory');
  });

  it('Signatur-Bilanz nennt jede Achse des Auftrags mit Zielmarke + Treffer-Markierung', () => {
    // Keil-Signatur erfüllt: polarisierung↑65, fragmentierung↑45, diskursqualitaet↓40.
    const e = assembleAuftragEnding('keil', {
      moralWeight: 20, risk: 20,
      values: { polarisierung: 70, fragmentierung: 50, diskursqualitaet: 35 },
    });
    for (const sig of AUFTRAEGE.keil.signatur) {
      expect(e.bilanz_de).toContain(String(sig.ziel)); // Zielmarke sichtbar
    }
    expect(e.bilanz_de).toContain('✓'); // mind. eine Achse erfüllt
    expect(e.bilanz_de).toContain('Polarisierung');
    // signaturProgress entspricht der reinen Auftrags-Formel.
    expect(e.signaturProgress).toBeCloseTo(
      auftragProgress(AUFTRAEGE.keil, { polarisierung: 70, fragmentierung: 50, diskursqualitaet: 35 }),
      5,
    );
    expect(e.signaturProgress).toBeGreaterThan(0.8);
  });

  it('verfehlte Signatur markiert die Achse als nicht erfüllt (–)', () => {
    const e = assembleAuftragEnding('zweifel', {
      moralWeight: 20, risk: 20,
      values: { vertrauen: 90, zynismus: 22, diskursqualitaet: 68 }, // weit von den Zielen
    });
    expect(e.bilanz_de).toContain('–');
    expect(e.signaturProgress).toBeLessThan(0.2);
  });
});
