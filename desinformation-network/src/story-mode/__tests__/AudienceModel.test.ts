import { describe, it, expect } from 'vitest';
import { detectionDampen, getCountry, loadAudience, reactToEffect, themeResonance } from '../audience/audienceModel';

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

  it('unterstützt mehrere Länder; Gallia-Größen summieren ~1.0', () => {
    const all = loadAudience();
    expect(all.length).toBeGreaterThanOrEqual(2);
    const ga = getCountry('gallia');
    expect(ga).toBeDefined();
    expect(ga!.segments.reduce((s, x) => s + x.size, 0)).toBeCloseTo(1, 2);
  });

  it('Nationale-Identität-Sendung (social) resoniert mit Gallias Nationalisten', () => {
    const ga = getCountry('gallia')!;
    const r = reactToEffect(ga, { themes: ['nationale_identitaet'], channel: 'social', intensity: 1 });
    const nat = r.reactions.find((x) => x.segmentId === 'ga_nationalist')!;
    expect(nat.reached).toBe(true);
    expect(nat.resonance).toBeCloseTo(1, 5);
    expect(nat.beliefDelta).toBeGreaterThan(0);
  });

  it('detectionDampen senkt die Wirkung mit steigendem Entdeckungs-Risiko', () => {
    expect(detectionDampen(0.8, 0)).toBeCloseTo(0.8, 5);
    expect(detectionDampen(0.8, 50)).toBeLessThan(0.8);
    expect(detectionDampen(0.8, 100)).toBeCloseTo(0.8 * 0.4, 5);
  });
});
