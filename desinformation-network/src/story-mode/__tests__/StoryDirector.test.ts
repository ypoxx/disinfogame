/**
 * StoryDirector (Spine, dünner Dirigent): Entscheidung ② — Dringlichkeit + Abwechslung.
 */
import { describe, it, expect } from 'vitest';
import { pickNext, type Beat } from '../engine/StoryDirector';

describe('StoryDirector.pickNext', () => {
  it('Krise hat Vorfahrt vor Episode und Stups', () => {
    const beat = pickNext({
      crisis: { id: 'c1', vorgriffZeile_de: 'Eine Krise braut sich zusammen.' },
      ripeEpisode: { id: 'ep1', titel_de: 'Die Brücke' },
      stupsCandidates: [{ quelleId: 'marina', vorgriffZeile_de: 'Marina rät…' }],
    });
    expect(beat?.typ).toBe('krise');
    expect(beat?.quelleId).toBe('c1');
  });

  it('Reife Episode schlägt den Stups, wenn keine Krise', () => {
    const beat = pickNext({
      ripeEpisode: { id: 'ep1', titel_de: 'Die Brücke' },
      stupsCandidates: [{ quelleId: 'marina', vorgriffZeile_de: 'Marina rät…' }],
    });
    expect(beat?.typ).toBe('episode');
    expect(beat?.quelleId).toBe('ep1');
    expect(beat?.vorgriffZeile_de).toContain('Die Brücke');
  });

  it('Stups als Fallback am ruhigen Tag', () => {
    const beat = pickNext({
      stupsCandidates: [{ quelleId: 'igor', vorgriffZeile_de: 'Igor warnt vor der Kasse.' }],
    });
    expect(beat?.typ).toBe('stups');
    expect(beat?.quelleId).toBe('igor');
  });

  it('Anti-Wiederholung: bevorzugt eine andere Quelle als zuletzt', () => {
    const last: Beat = { id: 'stups_marina', typ: 'stups', quelleId: 'marina', vorgriffZeile_de: '…' };
    const beat = pickNext(
      {
        stupsCandidates: [
          { quelleId: 'marina', vorgriffZeile_de: 'Marina (wieder).' },
          { quelleId: 'katja', vorgriffZeile_de: 'Katja meldet sich.' },
        ],
      },
      last,
    );
    expect(beat?.quelleId).toBe('katja'); // nicht erneut marina
  });

  it('Anti-Wiederholung greift nicht bei der Krise (Dringlichkeit > Abwechslung)', () => {
    const last: Beat = { id: 'krise_c1', typ: 'krise', quelleId: 'c1', vorgriffZeile_de: '…' };
    const beat = pickNext({ crisis: { id: 'c1', vorgriffZeile_de: 'Dieselbe Krise eskaliert weiter.' } }, last);
    expect(beat?.typ).toBe('krise'); // Krise wird nie unterdrückt
  });

  it('gibt null, wenn nichts ansteht', () => {
    expect(pickNext({})).toBeNull();
    expect(pickNext({ stupsCandidates: [] })).toBeNull();
  });
});
