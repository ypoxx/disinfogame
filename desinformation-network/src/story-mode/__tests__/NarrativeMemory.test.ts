/**
 * Spine Schicht 3 — das Narrativ-Gedächtnis (Befund C.3): welche Themen liefen wie oft,
 * wie inokuliert ist das Publikum, und wie klingt eine Erzählung über die Zeit ab.
 */
import { describe, it, expect } from 'vitest';
import {
  recordThema,
  inoculationOf,
  isSeeded,
  seededThemes,
  effectiveInoculation,
  type NarrativeMemoryState,
} from '../engine/NarrativeMemory';

describe('NarrativeMemory', () => {
  it('ein Lauf sät das Thema und setzt eine erste Inokulation', () => {
    const s = recordThema({}, 'reizthema_gallia', 1);
    expect(isSeeded(s, 'reizthema_gallia')).toBe(true);
    expect(s['reizthema_gallia'].timesRun).toBe(1);
    expect(inoculationOf(s, 'reizthema_gallia', 1)).toBe(30);
    expect(isSeeded(s, 'anderes')).toBe(false);
  });

  it('Wiederholung erhöht die Inokulation (gesättigt bei 100)', () => {
    let s: NarrativeMemoryState = {};
    s = recordThema(s, 't', 1);
    s = recordThema(s, 't', 1);
    s = recordThema(s, 't', 1);
    expect(inoculationOf(s, 't', 1)).toBe(90);
    s = recordThema(s, 't', 1);
    s = recordThema(s, 't', 1);
    expect(inoculationOf(s, 't', 1)).toBe(100); // Sättigung
    expect(s['t'].timesRun).toBe(5);
  });

  it('die Inokulation verfällt mit der Zeit (Erzählung „klingt ab", wird recycelbar)', () => {
    const s = recordThema({}, 't', 1); // raw 30 bei Phase 1
    expect(inoculationOf(s, 't', 1)).toBe(30);
    expect(inoculationOf(s, 't', 6)).toBe(15); // 30 - 3*5
    expect(inoculationOf(s, 't', 20)).toBe(0); // vollständig abgeklungen
  });

  it('ein erneuter Lauf rechnet den Verfall ein, bevor er erhöht', () => {
    let s = recordThema({}, 't', 1); // raw 30 @1
    s = recordThema(s, 't', 11); // effektiv 0 @11 → +30 = 30
    expect(inoculationOf(s, 't', 11)).toBe(30);
    expect(s['t'].timesRun).toBe(2);
  });

  it('seededThemes listet nur gelaufene Themen', () => {
    let s: NarrativeMemoryState = {};
    s = recordThema(s, 'a', 1);
    s = recordThema(s, 'b', 2);
    expect(seededThemes(s).sort()).toEqual(['a', 'b']);
  });

  it('effectiveInoculation klemmt nicht unter 0', () => {
    expect(effectiveInoculation({ timesRun: 1, rawInoculation: 5, lastRunPhase: 1 }, 100)).toBe(0);
  });
});
