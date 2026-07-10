/**
 * Phase 0b: THEMEN_JE_TAG/KANAL_JE_TAG schärfen — jede Phänomen-Familie (11.x) leuchtet
 * ein EIGENES Resonanzgruppen-Profil aus, statt pauschal auf misstrauen_medien zu fallen.
 * Absicherung für den späteren Masche-Vortest (wahre Vorschau des Wettrennens).
 */
import { describe, it, expect } from 'vitest';
import { themenFuerTags, zielMilieusFuerTags, STANDARD_THEMEN } from '../engine/MaschenGedaechtnis';
import { loadAudience } from '../audience/audienceModel';

const segmente = loadAudience()[0].segments;
const topSegment = (tags: string[]): string | undefined => zielMilieusFuerTags(tags, segmente)[0]?.id;

describe('Phänomen-Themen (Phase 0b)', () => {
  it('Gerücht, Zermürbung, Krise, Identität, Erinnerung tragen je eigene Themen', () => {
    expect(themenFuerTags(['rumor', 'confusion', 'conspiracy'])).toContain('anti_establishment');
    expect(themenFuerTags(['demoralization', 'fear'])).toContain('abstiegs_angst');
    expect(themenFuerTags(['crisis'])).toContain('sicherheits_beduerfnis');
    expect(themenFuerTags(['identity', 'nationalism'])).toContain('nostalgie');
    expect(themenFuerTags(['memory', 'history'])).toEqual(['nostalgie']);
  });

  it('kein Phänomen-Tag fällt mehr blind auf STANDARD_THEMEN zurück', () => {
    for (const tag of ['rumor', 'demoralization', 'crisis', 'identity', 'polarization', 'memory']) {
      expect(themenFuerTags([tag])).not.toEqual(STANDARD_THEMEN);
    }
  });

  it('unterschiedliche Familien treffen unterschiedliche Resonanzgruppen', () => {
    const resonant = (tags: string[]): string[] =>
      zielMilieusFuerTags(tags, segmente).filter((z) => z.resonanz > 0).map((z) => z.id).sort();
    // Firehose (Medien-Misstrauen, social) vs. Erinnerung (Nostalgie, print) — andere Mengen UND andere Spitze.
    const firehose = resonant(['flooding', 'amplification']);
    const erinnerung = resonant(['memory', 'history']);
    expect(firehose.length).toBeGreaterThan(0);
    expect(erinnerung.length).toBeGreaterThan(0);
    expect(firehose).not.toEqual(erinnerung);
    expect(topSegment(['flooding', 'amplification'])).not.toBe(topSegment(['memory', 'history']));
  });
});
