/**
 * Etappe 3 „Immunsystem sichtbar" — der zweite Rennläufer als pures Modul.
 * Belegt: (1) die vier Zuflüsse wirken einzeln und gemeinsam, (2) Klemmen auf 0–100,
 * (3) Stufen-Erkennung 25/50/75, (4) „Gepatcht"-Takt (jede n-te Wiederholung),
 * (5) Familien-Zuordnung über das 18er-Atlas-Vokabular.
 */
import { describe, it, expect } from 'vitest';
import {
  abwehrStep,
  clampAbwehr,
  crossedAbwehrStages,
  isPatchTriggered,
  methodFamilyForTags,
  ABWEHR_START,
  ABWEHR_MAX,
  ABWEHR_STAGES,
  BASELINE_PER_DAY,
  PATCH_EVERY_N_USES,
} from '../engine/ImmuneSystem';
import { loadDisinfoMethods } from '../engine/DisinfoMethodAtlas';

const quietNight = {
  current: ABWEHR_START,
  noiseRisk: 0,
  noiseAttention: 0,
  defenderStrengthSum: 0,
  armsRaceLevel: 0,
};

describe('abwehrStep (nächtlicher Schritt)', () => {
  it('Zeitgrundrauschen: auch eine völlig stille Nacht lässt die Abwehr wachsen', () => {
    const r = abwehrStep(quietNight);
    expect(r.delta).toBeCloseTo(BASELINE_PER_DAY, 5);
    expect(r.parts.noise).toBe(0);
    expect(r.parts.defenders).toBe(0);
  });

  it('Lärm füttert die Abwehr (Risiko- und Aufmerksamkeits-Kosten)', () => {
    const r = abwehrStep({ ...quietNight, noiseRisk: 20, noiseAttention: 10 });
    expect(r.parts.noise).toBeGreaterThan(0);
    expect(r.delta).toBeGreaterThan(BASELINE_PER_DAY);
  });

  it('Verteidiger erzeugen passiven Zuwachs, skaliert mit der Eskalation', () => {
    const ohne = abwehrStep({ ...quietNight, defenderStrengthSum: 1.5, armsRaceLevel: 0 });
    const mit = abwehrStep({ ...quietNight, defenderStrengthSum: 1.5, armsRaceLevel: 4 });
    expect(ohne.parts.defenders).toBeGreaterThan(0);
    expect(mit.parts.defenders).toBeGreaterThan(ohne.parts.defenders);
  });

  it('klemmt auf ABWEHR_MAX (100)', () => {
    const r = abwehrStep({ ...quietNight, current: 99.5, noiseRisk: 100, noiseAttention: 100 });
    expect(r.next).toBe(ABWEHR_MAX);
  });

  it('negative Eingaben zählen nicht als Lärm', () => {
    const r = abwehrStep({ ...quietNight, noiseRisk: -50, noiseAttention: -50 });
    expect(r.parts.noise).toBe(0);
  });
});

describe('crossedAbwehrStages', () => {
  it('erkennt einzelne und mehrere aufwärts überschrittene Stufen', () => {
    expect(crossedAbwehrStages(20, 30)).toEqual([25]);
    expect(crossedAbwehrStages(20, 80)).toEqual([25, 50, 75]);
    expect(crossedAbwehrStages(25, 30)).toEqual([]);   // exakt AUF der Stufe gestartet
    expect(crossedAbwehrStages(30, 20)).toEqual([]);   // abwärts feuert nie
    expect(crossedAbwehrStages(24, 25)).toEqual([25]); // Erreichen zählt
  });

  it('kennt genau die Zielbild-Stufen 25/50/75', () => {
    expect([...ABWEHR_STAGES]).toEqual([25, 50, 75]);
  });
});

describe('isPatchTriggered (Maschen-Wiederholung)', () => {
  it(`patcht jede ${PATCH_EVERY_N_USES}. Wiederholung, nicht davor`, () => {
    const triggered = [1, 2, 3, 4, 5, 6, 7].filter(isPatchTriggered);
    expect(triggered).toEqual([3, 6]);
    expect(isPatchTriggered(0)).toBe(false);
  });
});

describe('methodFamilyForTags (18er-Atlas-Vokabular)', () => {
  const families = loadDisinfoMethods();

  it('ordnet typische Aktions-Tags einer Familie zu', () => {
    // "bot"/"amplification" sind Kern-Tags des Katalogs — mindestens eine Familie matcht.
    const fam = methodFamilyForTags(['bot', 'amplification'], families);
    expect(fam).not.toBeNull();
    expect(fam!.id).toBeTruthy();
    expect(fam!.label_de).toBeTruthy();
  });

  it('liefert null für unbekannte Tags und leere Eingabe', () => {
    expect(methodFamilyForTags(['völlig_unbekannter_tag_xyz'], families)).toBeNull();
    expect(methodFamilyForTags([], families)).toBeNull();
  });

  it('ist deterministisch (erste passende Familie in Atlas-Reihenfolge)', () => {
    const a = methodFamilyForTags(['fake_news'], families);
    const b = methodFamilyForTags(['fake_news'], families);
    expect(a).toEqual(b);
  });
});

describe('clampAbwehr', () => {
  it('klemmt auf 0–100 und fängt NaN', () => {
    expect(clampAbwehr(150)).toBe(100);
    expect(clampAbwehr(-5)).toBe(0);
    expect(clampAbwehr(NaN)).toBe(0);
    expect(clampAbwehr(42)).toBe(42);
  });
});
