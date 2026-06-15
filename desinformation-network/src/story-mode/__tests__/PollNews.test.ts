/**
 * P6/F3 — Umfragen/Barometer als News (erzählerisches Gesicht des Zustands).
 */
import { describe, it, expect } from 'vitest';
import { buildPollNews, pickPollInstrument, POLL_INSTRUMENTS, getPollInstrument } from '../engine/PollNews';
import { createStoryEngine } from '../../game-logic/StoryEngineAdapter';

describe('PollNews (pure)', () => {
  it('baut Schlagzeile + Beschreibung mit Wert, Institut und Tendenz', () => {
    const stim = getPollInstrument('stimmungsbarometer')!;
    const first = buildPollNews(stim, 43, undefined);
    expect(first.headline_de).toContain('43%');
    expect(first.description_de).toContain(stim.institut_de);
    expect(first.description_de).toContain('erste Erhebung');

    expect(buildPollNews(stim, 50, 43).description_de).toContain('steigend');
    expect(buildPollNews(stim, 40, 43).description_de).toContain('fallend');
    expect(buildPollNews(stim, 43, 43).description_de).toContain('stabil');
  });

  it('pickPollInstrument bevorzugt das Auftrags-Leit-Instrument (gerader Index)', () => {
    // keil-Leitwert = polarisierung → Stimmungsbarometer.
    expect(pickPollInstrument('polarisierung', 0).id).toBe('stimmungsbarometer');
    expect(pickPollInstrument('polarisierung', 2).id).toBe('stimmungsbarometer');
    // ungerader Index → ein anderes Instrument.
    expect(pickPollInstrument('polarisierung', 1).id).not.toBe('stimmungsbarometer');
  });

  it('jedes Instrument bildet einen realen Gesellschaftswert ab', () => {
    expect(POLL_INSTRUMENTS.length).toBeGreaterThanOrEqual(5);
    for (const p of POLL_INSTRUMENTS) {
      expect(p.name_de.length).toBeGreaterThan(5);
      expect(p.frage_de.length).toBeGreaterThan(5);
    }
  });
});

describe('Umfrage-Emission (Engine)', () => {
  it('emittiert periodisch eine Umfrage-News, die den Zustand spiegelt', () => {
    const e = createStoryEngine('poll_emit');
    e.setAuftrag('keil');
    for (let i = 0; i < 3; i++) { try { e.executeAction('11.14'); } catch { /* egal */ } e.advancePhase(); }
    const polls = e.getNewsEvents().filter(n => n.id.startsWith('poll_'));
    expect(polls.length).toBeGreaterThanOrEqual(1);
    // keil → erstes Instrument = Stimmungsbarometer (Polarisierung).
    expect(polls.some(p => p.id.includes('stimmungsbarometer'))).toBe(true);
  });

  it('Umfrage-Zustand übersteht save/load; alte Saves → Default', () => {
    const e = createStoryEngine('poll_save');
    for (let i = 0; i < 3; i++) e.advancePhase();
    const saved = e.saveState();
    const parsed = JSON.parse(saved);
    expect(parsed.pollIndex).toBeGreaterThanOrEqual(1);

    parsed.version = '1.0.0'; delete parsed.pollIndex; delete parsed.lastPollValues;
    const loaded = createStoryEngine('fresh');
    expect(() => loaded.loadState(JSON.stringify(parsed))).not.toThrow();
  });
});
