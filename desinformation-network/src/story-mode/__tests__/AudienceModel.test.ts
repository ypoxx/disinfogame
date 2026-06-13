import { describe, it, expect } from 'vitest';
import { decaySegment, detectionDampen, getCountry, loadAudience, reactToEffect, themeResonance } from '../audience/audienceModel';

// K2 (2026-06-13): EIN föderales Zielland „Westunion" mit 8 modernen Milieus.
describe('Publikums-Modell (Westunion)', () => {
  it('lädt Westunion; Segment-Größen summieren ~1.0', () => {
    const wu = getCountry('westunion');
    expect(wu).toBeDefined();
    const total = wu!.segments.reduce((s, x) => s + x.size, 0);
    expect(total).toBeCloseTo(1, 2);
  });

  it('Energie-Angst über TV resoniert mit den „Machern", erreicht aber die social-only Bohemiens nicht', () => {
    const wu = getCountry('westunion')!;
    const r = reactToEffect(wu, { themes: ['energie_angst'], channel: 'tv', intensity: 1 });

    const macher = r.reactions.find((x) => x.segmentId === 'wu_macher')!;
    expect(macher.resonance).toBeGreaterThan(0); // energie_angst ist eine ihrer Verwundbarkeiten
    expect(macher.reached).toBe(true); // über tv erreichbar
    expect(macher.beliefDelta).toBeGreaterThan(0);

    const bohemien = r.reactions.find((x) => x.segmentId === 'wu_bohemien')!;
    expect(bohemien.reached).toBe(false); // Bohemiens nur über social erreichbar
    expect(bohemien.beliefDelta).toBe(0);

    expect(r.quote).toBeGreaterThan(0);
    expect(r.quote).toBeLessThanOrEqual(1);
  });

  it('thematisch irrelevanter TV-Inhalt verschiebt keinen Glauben', () => {
    const wu = getCountry('westunion')!;
    // klima_sorge betrifft nur die Idealisten — und die sind nur über social/print erreichbar.
    const r = reactToEffect(wu, { themes: ['klima_sorge'], channel: 'tv', intensity: 1 });
    const moved = r.reactions.filter((x) => x.beliefDelta > 0);
    expect(moved.length).toBe(0);
  });

  it('Klima-Sorge über social resoniert mit den grünen Idealisten', () => {
    const wu = getCountry('westunion')!;
    const r = reactToEffect(wu, { themes: ['klima_sorge'], channel: 'social', intensity: 1 });
    const ideal = r.reactions.find((x) => x.segmentId === 'wu_idealistin')!;
    expect(ideal.reached).toBe(true);
    expect(ideal.resonance).toBeGreaterThan(0);
    expect(ideal.beliefDelta).toBeGreaterThan(0);
  });

  it('Resonanz ist 0 bei leerer Themenliste', () => {
    const wu = getCountry('westunion')!;
    expect(themeResonance(wu.segments[0], [])).toBe(0);
  });

  it('loadAudience liefert mindestens das Zielland', () => {
    const all = loadAudience();
    expect(all.length).toBeGreaterThanOrEqual(1);
    expect(all.some((c) => c.id === 'westunion')).toBe(true);
  });

  it('detectionDampen senkt die Wirkung mit steigendem Entdeckungs-Risiko', () => {
    expect(detectionDampen(0.8, 0)).toBeCloseTo(0.8, 5);
    expect(detectionDampen(0.8, 50)).toBeLessThan(0.8);
    expect(detectionDampen(0.8, 100)).toBeCloseTo(0.8 * 0.4, 5);
  });

  it('geringere Intensität (= höheres Risiko) senkt auch die Quote/Reichweite', () => {
    const wu = getCountry('westunion')!;
    const hi = reactToEffect(wu, { themes: ['energie_angst'], channel: 'tv', intensity: 1 });
    const lo = reactToEffect(wu, { themes: ['energie_angst'], channel: 'tv', intensity: 0.4 });
    expect(lo.quote).toBeLessThan(hi.quote);
  });

  it('decaySegment zieht den Glauben zur Grundlinie und beruhigt die Stimmung', () => {
    const a = decaySegment(0.9, 'wuetend', 1);
    expect(a.belief).toBeCloseTo(0.35, 5);
    expect(a.mood).toBe('ruhig');
    const b = decaySegment(0.9, 'wuetend', 0); // keine Zeit -> unverändert
    expect(b.belief).toBeCloseTo(0.9, 5);
    expect(b.mood).toBe('wuetend');
  });
});
