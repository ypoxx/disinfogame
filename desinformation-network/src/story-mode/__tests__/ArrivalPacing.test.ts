/**
 * Pacing der Ankunfts-Sequenz: Der Erzähler darf ausreden.
 *
 * Regression zum Befund „Test-Audio wird beim Szenenwechsel abgeschnitten":
 * die Routen-Schritte sind kürzer als die Sprachzeilen, also muss vor jedem
 * Abschnitt genug Standzeit liegen.
 */
import { describe, it, expect } from 'vitest';
import { planRoute, entryPosition, routeDurationMs } from '../building/BuildingNavigator';
import {
  planArrivalHolds,
  arrivalDurationMs,
  beatForStep,
  BASE_HOLD_MS,
  BEAT_TAIL_MS,
  MAX_HOLD_MS,
  type ArrivalBeat,
} from '../components/arrivalPacing';

const route = () => planRoute(entryPosition(), 'zentrale');

/** Gemessene Längen der ausgelieferten Erzähler-Zeilen (ms, gerundet). */
const NARRATION_MS: Record<ArrivalBeat, number> = {
  lobby: 6450,
  ride: 4750,
  floor: 5750,
  door: 3240,
};

describe('Ankunfts-Route', () => {
  it('besteht aus vier Abschnitten in der erwarteten Reihenfolge', () => {
    expect(route().map(beatForStep)).toEqual(['lobby', 'ride', 'floor', 'door']);
  });
});

describe('planArrivalHolds', () => {
  it('gibt jeder Zeile genug Zeit, bevor der nächste Abschnitt sie ablöst', () => {
    const steps = route();
    const holds = planArrivalHolds(steps, NARRATION_MS);

    steps.forEach((step, i) => {
      const beat = beatForStep(step);
      const abschnittMs = holds[i].holdMs + step.durationMs;
      expect(abschnittMs).toBeGreaterThanOrEqual(NARRATION_MS[beat] + BEAT_TAIL_MS);
    });
  });

  it('schneidet ohne Standzeit jede Zeile ab (Beleg für den Befund)', () => {
    const steps = route();
    const zuKurz = steps.filter((s) => s.durationMs < NARRATION_MS[beatForStep(s)]);
    expect(zuKurz).toHaveLength(steps.length);
  });

  it('bleibt ohne Messung beim alten, knappen Takt', () => {
    const steps = route();
    const holds = planArrivalHolds(steps, {});
    expect(holds.map((h) => h.holdMs)).toEqual([BASE_HOLD_MS.lobby, 0, 0, 0]);
    // Vorher: 1400 ms Lobby-Pause + Routendauer.
    expect(arrivalDurationMs(steps, holds)).toBe(BASE_HOLD_MS.lobby + routeDurationMs(steps));
  });

  it('ignoriert unbrauchbare Messwerte und deckelt absurde Längen', () => {
    const steps = route();
    const holds = planArrivalHolds(steps, { lobby: null, ride: 0, floor: -1, door: 999_999 });
    expect(holds[0].holdMs).toBe(BASE_HOLD_MS.lobby);
    expect(holds[1].holdMs).toBe(0);
    expect(holds[2].holdMs).toBe(0);
    expect(holds[3].holdMs).toBe(MAX_HOLD_MS);
  });

  it('pacet eine neue Vertonung automatisch mit (kein fester Zeitplan)', () => {
    const steps = route();
    const schnell = planArrivalHolds(steps, { lobby: 3000, ride: 2000, floor: 2500, door: 1500 });
    const langsam = planArrivalHolds(steps, { lobby: 9000, ride: 7000, floor: 8000, door: 6000 });
    expect(arrivalDurationMs(steps, langsam)).toBeGreaterThan(arrivalDurationMs(steps, schnell));
  });
});
