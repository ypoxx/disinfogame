import { describe, it, expect } from 'vitest';
import { getCountry, reactToEffect, themeResonance } from '../audience/audienceModel';

describe('Publikums-Modell (Nordmark)', () => {
  it('lädt Nordmark; Segment-Größen summieren ~1.0', () => {
    const nm = getCountry('nordmark');
    expect(nm).toBeDefined();
    const total = nm!.segments.reduce((s, x) => s + x.size, 0);
    expect(total).toBeCloseTo(1, 2);
  });

  it('Energie-Angst über TV resoniert mit ländlichem Segment, erreicht aber Urban-Progressiv nicht', () => {
    const nm = getCountry('nordmark')!;
    const r = reactToEffect(nm, { themes: ['energie_angst'], channel: 'tv', intensity: 1 });

    const rural = r.reactions.find((x) => x.segmentId === 'nm_rural_anxious')!;
    expect(rural.resonance).toBeCloseTo(1, 5);
    expect(rural.reached).toBe(true);
    expect(rural.beliefDelta).toBeGreaterThan(0);
    expect(rural.newMood).toBe('wuetend'); // effectiveness = 1 → höchste Stufe

    const urban = r.reactions.find((x) => x.segmentId === 'nm_urban_progressive')!;
    expect(urban.reached).toBe(false); // urban-progressiv nur über social erreichbar
    expect(urban.beliefDelta).toBe(0);

    expect(r.quote).toBeGreaterThan(0);
    expect(r.quote).toBeLessThanOrEqual(1);
  });

  it('thematisch irrelevanter TV-Inhalt verschiebt keinen Glauben', () => {
    const nm = getCountry('nordmark')!;
    // klima_sorge betrifft nur urban_progressive — und das ist nur über social erreichbar.
    const r = reactToEffect(nm, { themes: ['klima_sorge'], channel: 'tv', intensity: 1 });
    const moved = r.reactions.filter((x) => x.beliefDelta > 0);
    expect(moved.length).toBe(0);
  });

  it('Resonanz ist 0 bei leerer Themenliste', () => {
    const nm = getCountry('nordmark')!;
    expect(themeResonance(nm.segments[0], [])).toBe(0);
  });
});
