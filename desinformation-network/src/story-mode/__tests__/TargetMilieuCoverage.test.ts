/**
 * Ziel-Milieu-Abdeckung: Jedes Audience-Milieu braucht mindestens ein Ziel, damit
 * die Kampagnen-Empfehlungen der Fokusgruppe voll vorbefüllt werden (kein „Ziel offen").
 */
import { describe, it, expect } from 'vitest';
import { loadTargets } from '../battlefield/BattlefieldChain';
import { loadAudience } from '../audience/audienceModel';

describe('Ziel-Milieu-Abdeckung', () => {
  it('jedes Audience-Milieu hat mindestens ein Ziel', () => {
    const targetMilieus = new Set(loadTargets().map((t) => t.milieu));
    const segments = loadAudience()[0].segments.map((s) => s.id);
    const uncovered = segments.filter((id) => !targetMilieus.has(id));
    expect(uncovered).toEqual([]);
  });
});
