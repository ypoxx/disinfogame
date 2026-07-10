/**
 * dossierModel: Sweet-Spot-Befunde sammeln (über Runden dedupen) + Kampagnen-Arcs.
 */
import { describe, it, expect } from 'vitest';
import type { Erkenntnis } from '../audience/dossierModel';
import {
  findingsFromMatrix,
  mergeFindings,
  detectArcs,
} from '../audience/dossierModel';
import type { WirkungsMatrix } from '../audience/kampagnenSchmiede';

function cell(appeal: string, segmentId: string, value: number | null) {
  return {
    appeal: appeal as Erkenntnis['appeal'],
    segmentId,
    value,
    sampled: value === null ? 0 : 1,
    klass: 'sweet' as const,
  };
}

describe('findingsFromMatrix', () => {
  it('nur befragte Zellen ab Schwelle 0.4 werden zu Erkenntnissen', () => {
    const matrix: WirkungsMatrix = {
      segmentIds: ['wu_a', 'wu_b'],
      cells: [
        cell('anger', 'wu_a', 0.9),   // Sweet Spot
        cell('anger', 'wu_b', 0.2),   // zu schwach
        cell('fear', 'wu_a', null),   // unbefragt
        cell('fear', 'wu_b', 0.5),    // Sweet Spot
      ],
    };
    const found = findingsFromMatrix(matrix, 3);
    expect(found.map((f) => f.id).sort()).toEqual(['anger_wu_a', 'fear_wu_b']);
    expect(found.every((f) => f.phase === 3)).toBe(true);
  });
});

describe('mergeFindings', () => {
  it('dedupe über id: stärkerer Wert bleibt, früheste Phase bleibt', () => {
    const existing: Erkenntnis[] = [{ id: 'anger_wu_a', appeal: 'anger', segmentId: 'wu_a', value: 0.6, phase: 2 }];
    const incoming: Erkenntnis[] = [
      { id: 'anger_wu_a', appeal: 'anger', segmentId: 'wu_a', value: 0.9, phase: 4 }, // stärker, später
      { id: 'fear_wu_b', appeal: 'fear', segmentId: 'wu_b', value: 0.5, phase: 4 },   // neu
    ];
    const merged = mergeFindings(existing, incoming);
    const anger = merged.find((f) => f.id === 'anger_wu_a')!;
    expect(anger.value).toBe(0.9);
    expect(anger.phase).toBe(2); // früheste Entdeckung bewahrt
    expect(merged).toHaveLength(2);
  });
});

describe('detectArcs', () => {
  it('Flächenbrand: gleicher Appell in ≥3 Milieus', () => {
    const findings: Erkenntnis[] = [
      { id: 'anger_wu_a', appeal: 'anger', segmentId: 'wu_a', value: 0.9, phase: 1 },
      { id: 'anger_wu_b', appeal: 'anger', segmentId: 'wu_b', value: 0.7, phase: 1 },
      { id: 'anger_wu_c', appeal: 'anger', segmentId: 'wu_c', value: 0.6, phase: 2 },
    ];
    const arcs = detectArcs(findings);
    const brand = arcs.find((a) => a.kind === 'flaechenbrand');
    expect(brand).toBeTruthy();
    expect(brand!.segmentIds.sort()).toEqual(['wu_a', 'wu_b', 'wu_c']);
  });

  it('Zwei-Fronten: stärkstes Paar mit verschiedenem Appell + Milieu', () => {
    const findings: Erkenntnis[] = [
      { id: 'anger_wu_a', appeal: 'anger', segmentId: 'wu_a', value: 0.9, phase: 1 },
      { id: 'fear_wu_b', appeal: 'fear', segmentId: 'wu_b', value: 0.8, phase: 1 },
    ];
    const arcs = detectArcs(findings);
    const zf = arcs.find((a) => a.kind === 'zwei_fronten');
    expect(zf).toBeTruthy();
    expect(zf!.findingIds.sort()).toEqual(['anger_wu_a', 'fear_wu_b']);
  });

  it('kein Zwei-Fronten-Arc bei nur einem Milieu / einem Appell', () => {
    const findings: Erkenntnis[] = [
      { id: 'anger_wu_a', appeal: 'anger', segmentId: 'wu_a', value: 0.9, phase: 1 },
      { id: 'fear_wu_a', appeal: 'fear', segmentId: 'wu_a', value: 0.8, phase: 1 }, // gleiches Milieu
    ];
    expect(detectArcs(findings).some((a) => a.kind === 'zwei_fronten')).toBe(false);
  });
});
