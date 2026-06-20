/**
 * StoryDirector (Spine, dünner Dirigent):
 *  - Entscheidung ② — Dringlichkeit + Abwechslung (Slice 1/2)
 *  - Schicht 2 — gewichteter Beat-Pool (Slice 3)
 *
 * Gewichte (für die Schwellen unten): episode = 6, stups = 2;
 * Dämpfer same-type = 0.4, same-source = 0.25. Da der Zug nach Gewicht ABSTEIGEND
 * sortiert, kürt `rng()→0` immer den schwersten Beat; größere Werte erreichen die
 * leichteren — so sind die Tests deterministisch und reproduzierbar.
 */
import { describe, it, expect } from 'vitest';
import { pickNext, type Beat } from '../engine/StoryDirector';

/** Deterministisches rng für Tests: liefert konstant `v`. */
const fixed = (v: number) => () => v;

describe('StoryDirector.pickNext — Vorfahrt & Fallback (Slice 1/2)', () => {
  it('Krise hat Vorfahrt vor Episode und Stups', () => {
    const beat = pickNext({
      crisis: { id: 'c1', vorgriffZeile_de: 'Eine Krise braut sich zusammen.' },
      ripeEpisodes: [{ id: 'ep1', titel_de: 'Die Brücke' }],
      stupsCandidates: [{ quelleId: 'marina', vorgriffZeile_de: 'Marina rät…' }],
    });
    expect(beat?.typ).toBe('krise');
    expect(beat?.quelleId).toBe('c1');
  });

  it('Anti-Wiederholung greift nicht bei der Krise (Dringlichkeit > Abwechslung)', () => {
    const last: Beat = { id: 'krise_c1', typ: 'krise', quelleId: 'c1', vorgriffZeile_de: '…' };
    const beat = pickNext({ crisis: { id: 'c1', vorgriffZeile_de: 'Dieselbe Krise eskaliert weiter.' } }, last);
    expect(beat?.typ).toBe('krise'); // Krise wird nie unterdrückt
  });

  it('Stups als Fallback am ruhigen Tag (Pool mit einem Kandidaten ist rng-invariant)', () => {
    const beat = pickNext(
      { stupsCandidates: [{ quelleId: 'igor', vorgriffZeile_de: 'Igor warnt vor der Kasse.' }] },
      null,
      fixed(0.99),
    );
    expect(beat?.typ).toBe('stups');
    expect(beat?.quelleId).toBe('igor');
  });

  it('gibt null, wenn nichts ansteht', () => {
    expect(pickNext({})).toBeNull();
    expect(pickNext({ stupsCandidates: [] })).toBeNull();
    expect(pickNext({ ripeEpisodes: [] })).toBeNull();
  });
});

describe('StoryDirector.pickNext — gewichteter Pool-Zug (Slice 3)', () => {
  it('rng→0 kürt den schwersten Beat: reife Episode schlägt den Stups', () => {
    const beat = pickNext(
      {
        ripeEpisodes: [{ id: 'ep1', titel_de: 'Die Brücke' }],
        stupsCandidates: [{ quelleId: 'marina', vorgriffZeile_de: 'Marina rät…' }],
      },
      null,
      fixed(0),
    );
    expect(beat?.typ).toBe('episode');
    expect(beat?.quelleId).toBe('ep1');
    expect(beat?.vorgriffZeile_de).toContain('Die Brücke');
  });

  it('ein größeres rng erreicht den leichteren Stups (statt immer den Top-Beat)', () => {
    // pool [ep1(6), marina(2)], total 8 → Schwelle 7.2 fällt in den marina-Bereich.
    const beat = pickNext(
      {
        ripeEpisodes: [{ id: 'ep1', titel_de: 'Die Brücke' }],
        stupsCandidates: [{ quelleId: 'marina', vorgriffZeile_de: 'Marina rät…' }],
      },
      null,
      fixed(0.9),
    );
    expect(beat?.typ).toBe('stups');
    expect(beat?.quelleId).toBe('marina');
  });

  it('Anti-Wiederholung: rng→0 bevorzugt eine andere Quelle als zuletzt', () => {
    const last: Beat = { id: 'stups_marina', typ: 'stups', quelleId: 'marina', vorgriffZeile_de: '…' };
    const beat = pickNext(
      {
        stupsCandidates: [
          { quelleId: 'marina', vorgriffZeile_de: 'Marina (wieder).' },
          { quelleId: 'katja', vorgriffZeile_de: 'Katja meldet sich.' },
        ],
      },
      last,
      fixed(0),
    );
    expect(beat?.quelleId).toBe('katja'); // marina ist (Typ + Quelle) gedämpft
  });

  it('Anti-Wiederholung ist weich: bei großem rng kann dieselbe Quelle zurückkehren', () => {
    // Gewichte katja=0.8, marina=0.2 (Typ+Quelle gedämpft), total 1.0 → Schwelle 0.9 → marina.
    const last: Beat = { id: 'stups_marina', typ: 'stups', quelleId: 'marina', vorgriffZeile_de: '…' };
    const beat = pickNext(
      {
        stupsCandidates: [
          { quelleId: 'marina', vorgriffZeile_de: 'Marina (wieder).' },
          { quelleId: 'katja', vorgriffZeile_de: 'Katja meldet sich.' },
        ],
      },
      last,
      fixed(0.9),
    );
    expect(beat?.quelleId).toBe('marina'); // weich gedämpft, nicht verboten
  });

  it('„jüngst gesehener Typ ↓": derselbe Zug kippt von Episode auf Stups, wenn zuletzt eine Episode lief', () => {
    const inputs = {
      ripeEpisodes: [{ id: 'ep1', titel_de: 'Die Brücke' }],
      stupsCandidates: [{ quelleId: 'marina', vorgriffZeile_de: 'Marina rät…' }],
    };
    // Ohne Vorgeschichte: Schwelle 0.6*8=4.8 < 6 → Episode.
    expect(pickNext(inputs, null, fixed(0.6))?.typ).toBe('episode');
    // Letzter Beat war eine Episode → ep1 auf 2.4 gedämpft, marina 2, total 4.4;
    // Schwelle 0.6*4.4=2.64 fällt jetzt in den marina-Bereich → Stups.
    const lastEpisode: Beat = { id: 'episode_epPrev', typ: 'episode', quelleId: 'epPrev', vorgriffZeile_de: '…' };
    expect(pickNext(inputs, lastEpisode, fixed(0.6))?.typ).toBe('stups');
  });

  it('mehrere reife Episoden: rng variiert, welcher Strang vorgegriffen wird', () => {
    const inputs = {
      ripeEpisodes: [
        { id: 'ep1', titel_de: 'Die Brücke' },
        { id: 'ep2', titel_de: 'Das Leck' },
      ],
    };
    expect(pickNext(inputs, null, fixed(0))?.quelleId).toBe('ep1');
    // total 12, Schwelle 0.6*12=7.2 → zweiter Eintrag (ep2).
    expect(pickNext(inputs, null, fixed(0.6))?.quelleId).toBe('ep2');
  });

  it('deterministisch: gleiche Inputs + gleiches rng → gleicher Beat', () => {
    const inputs = {
      ripeEpisodes: [{ id: 'ep1', titel_de: 'Die Brücke' }],
      stupsCandidates: [{ quelleId: 'marina', vorgriffZeile_de: 'Marina rät…' }],
    };
    const a = pickNext(inputs, null, fixed(0.42));
    const b = pickNext(inputs, null, fixed(0.42));
    expect(a?.id).toBe(b?.id);
  });

  it('divergiert: zwei verschiedene rng-Ströme können verschiedene Beats liefern', () => {
    const inputs = {
      ripeEpisodes: [{ id: 'ep1', titel_de: 'Die Brücke' }],
      stupsCandidates: [{ quelleId: 'marina', vorgriffZeile_de: 'Marina rät…' }],
    };
    const low = pickNext(inputs, null, fixed(0.1));
    const high = pickNext(inputs, null, fixed(0.95));
    expect(low?.quelleId).not.toBe(high?.quelleId);
  });
});
