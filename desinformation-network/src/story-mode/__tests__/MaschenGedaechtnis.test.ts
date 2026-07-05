/**
 * MaschenGedaechtnis (Etappe 4 Paket A) — die 8×18-Matrix als pures Modul.
 * Pinnt die Kern-Zusagen des Zielbilds §7: 1,0→0,6→0,3-Treppe, Ruhen lohnt
 * (Verfall), Prebunking > Debunking (groß/langsam vs. klein/schnell), Patch-Folge
 * „Familie gilt überall als BEKANNT", E5-Erklärung und Ziel-Milieu-Ableitung.
 */
import { describe, it, expect } from 'vitest';
import {
  leeresMaschenGedaechtnis,
  registriereEinsatz,
  wirkungsMultiplikator,
  stempelFuer,
  effektiveAbstumpfung,
  effektiveImpfung,
  impfePrebunking,
  impfeFaktencheck,
  markiereFamilieBekannt,
  zielMilieusFuerTags,
  gewichteterMultiplikator,
  erklaereDaempfung,
  kanalFuerTags,
  MULT_FRISCH,
  MULT_BEKANNT,
  MULT_VERBRANNT,
  MIN_WIRKUNG,
  WEAR_DECAY_PER_DAY,
  PREBUNK_DECAY_PER_DAY,
  FACTCHECK_DECAY_PER_DAY,
} from '../engine/MaschenGedaechtnis';
import { loadAudience } from '../audience/audienceModel';

const MILIEU = 'wu_besorgte_mitte';
const FAMILIE = 'flooding';

describe('MaschenGedaechtnis — Abstumpfung (1,0 → 0,6 → 0,3)', () => {
  it('erster Einsatz trifft FRISCH (1,0), Wiederholungen fallen auf 0,6 und 0,3', () => {
    let s = leeresMaschenGedaechtnis();

    // Vor dem 1. Einsatz: frisch, volle Wirkung.
    expect(wirkungsMultiplikator(s, MILIEU, FAMILIE, 1)).toBe(MULT_FRISCH);
    expect(stempelFuer(s, MILIEU, FAMILIE, 1)).toBe('frisch');

    // 1. Einsatz → am Folgetag BEKANNT (0,6) trotz eines Tages Verfall.
    s = registriereEinsatz(s, FAMILIE, [MILIEU], 1).state;
    expect(wirkungsMultiplikator(s, MILIEU, FAMILIE, 2)).toBe(MULT_BEKANNT);
    expect(stempelFuer(s, MILIEU, FAMILIE, 2)).toBe('bekannt');

    // 2. Einsatz → VERBRANNT (0,3).
    s = registriereEinsatz(s, FAMILIE, [MILIEU], 2).state;
    expect(wirkungsMultiplikator(s, MILIEU, FAMILIE, 3)).toBe(MULT_VERBRANNT);
    expect(stempelFuer(s, MILIEU, FAMILIE, 3)).toBe('verbrannt');
  });

  it('Ruhen lohnt: die Abnutzung zerfällt und die Familie wird wieder FRISCH', () => {
    let s = leeresMaschenGedaechtnis();
    s = registriereEinsatz(s, FAMILIE, [MILIEU], 1).state;
    expect(stempelFuer(s, MILIEU, FAMILIE, 2)).toBe('bekannt');

    // Nach genug Ruhetagen ist die Zelle unter der BEKANNT-Schwelle (0,5).
    const tageBisFrisch = Math.ceil((1 - 0.5) / WEAR_DECAY_PER_DAY) + 1;
    expect(stempelFuer(s, MILIEU, FAMILIE, 1 + tageBisFrisch)).toBe('frisch');
  });

  it('Abnutzung ist je Milieu getrennt — Rotation über Milieus hilft', () => {
    let s = leeresMaschenGedaechtnis();
    s = registriereEinsatz(s, FAMILIE, [MILIEU], 1).state;
    s = registriereEinsatz(s, FAMILIE, [MILIEU], 2).state;
    expect(stempelFuer(s, MILIEU, FAMILIE, 3)).toBe('verbrannt');
    expect(stempelFuer(s, 'wu_zorniger', FAMILIE, 3)).toBe('frisch');
  });

  it('Familien-Einsatzzähler zählt Events (Patch-Trigger-Grundlage)', () => {
    let s = leeresMaschenGedaechtnis();
    const r1 = registriereEinsatz(s, FAMILIE, [MILIEU, 'wu_zorniger'], 1);
    expect(r1.einsatzNr).toBe(1); // EIN Event, auch wenn zwei Milieus getroffen werden
    const r2 = registriereEinsatz(r1.state, FAMILIE, [MILIEU], 2);
    expect(r2.einsatzNr).toBe(2);
  });
});

describe('MaschenGedaechtnis — Impfung (Prebunking > Debunking)', () => {
  it('Prebunking dämpft stark und hält lange; Faktencheck klein und schnell verflogen', () => {
    const s0 = leeresMaschenGedaechtnis();
    const sPre = impfePrebunking(s0, FAMILIE, [MILIEU], 5);
    const sFakt = impfeFaktencheck(s0, FAMILIE, [MILIEU], 5);

    // Sofort: Prebunking dämpft stärker als der Faktencheck.
    const multPre = wirkungsMultiplikator(sPre, MILIEU, FAMILIE, 5);
    const multFakt = wirkungsMultiplikator(sFakt, MILIEU, FAMILIE, 5);
    expect(multPre).toBeLessThan(multFakt);
    expect(multFakt).toBeLessThan(MULT_FRISCH);

    // Nach 5 Tagen: der Faktencheck ist praktisch verflogen, Prebunking wirkt weiter.
    expect(effektiveImpfung(sFakt, MILIEU, FAMILIE, 5 + Math.ceil(0.2 / FACTCHECK_DECAY_PER_DAY))).toBe(0);
    expect(effektiveImpfung(sPre, MILIEU, FAMILIE, 10)).toBeGreaterThan(0.3);
    // Und selbst nach 20 Tagen ist Prebunking noch nicht ganz weg (langsamer Zerfall).
    expect(effektiveImpfung(sPre, MILIEU, FAMILIE, 25)).toBeGreaterThan(0.1);
    expect(PREBUNK_DECAY_PER_DAY).toBeLessThan(FACTCHECK_DECAY_PER_DAY);
  });

  it('Impfung und Abstumpfung stapeln, aber nie unter die Untergrenze (E9: kein Null)', () => {
    let s = leeresMaschenGedaechtnis();
    s = impfePrebunking(s, FAMILIE, [MILIEU], 1);
    s = registriereEinsatz(s, FAMILIE, [MILIEU], 1).state;
    s = registriereEinsatz(s, FAMILIE, [MILIEU], 2).state;
    const mult = wirkungsMultiplikator(s, MILIEU, FAMILIE, 3);
    expect(mult).toBeGreaterThanOrEqual(MIN_WIRKUNG);
    expect(mult).toBeLessThan(MULT_VERBRANNT);
  });

  it('geimpftes Milieu stempelt BEKANNT, ohne je eine Zahl zu zeigen (E6)', () => {
    const s = impfePrebunking(leeresMaschenGedaechtnis(), FAMILIE, [MILIEU], 1);
    expect(stempelFuer(s, MILIEU, FAMILIE, 1)).toBe('bekannt');
  });
});

describe('MaschenGedaechtnis — Patch-Folge (EIN System, Falle 6)', () => {
  it('markiereFamilieBekannt setzt die Familie in allen Milieus auf mindestens BEKANNT', () => {
    const alle = loadAudience()[0].segments.map((seg) => seg.id);
    let s = leeresMaschenGedaechtnis();
    s = markiereFamilieBekannt(s, FAMILIE, alle, 4);
    for (const milieu of alle) {
      expect(stempelFuer(s, milieu, FAMILIE, 4)).toBe('bekannt');
    }
    // Bereits VERBRANNTE Zellen werden nicht „geheilt" (max, nicht überschrieben).
    let s2 = leeresMaschenGedaechtnis();
    s2 = registriereEinsatz(s2, FAMILIE, [MILIEU], 3).state;
    s2 = registriereEinsatz(s2, FAMILIE, [MILIEU], 4).state;
    s2 = markiereFamilieBekannt(s2, FAMILIE, alle, 4);
    expect(stempelFuer(s2, MILIEU, FAMILIE, 4)).toBe('verbrannt');
  });
});

describe('MaschenGedaechtnis — Ziel-Milieus & Aggregation', () => {
  const segmente = loadAudience()[0].segments;

  it('leitet Ziel-Milieus aus Tags ab (Kanal + Resonanz, absteigend gewichtet)', () => {
    // „digital" → social: erreicht NICHT die Eigenheimer (tv/print) — wohl aber die Bohemiens.
    const ziele = zielMilieusFuerTags(['digital', 'media'], segmente);
    const ids = ziele.map((z) => z.id);
    expect(kanalFuerTags(['digital', 'media'])).toBe('social');
    expect(ids).toContain('wu_bohemien');
    expect(ids).not.toContain('wu_eigenheimer');
    // Gewichte absteigend sortiert.
    for (let i = 1; i < ziele.length; i++) {
      expect(ziele[i - 1].gewicht).toBeGreaterThanOrEqual(ziele[i].gewicht);
    }
  });

  it('gewichteter Multiplikator liegt zwischen den Zell-Multiplikatoren', () => {
    const ziele = zielMilieusFuerTags(['media'], segmente);
    let s = leeresMaschenGedaechtnis();
    // Nur das größte Ziel-Milieu abnutzen → Gesamt-Multiplikator < 1, aber > VERBRANNT.
    s = registriereEinsatz(s, FAMILIE, [ziele[0].id], 1).state;
    s = registriereEinsatz(s, FAMILIE, [ziele[0].id], 2).state;
    const mult = gewichteterMultiplikator(s, FAMILIE, ziele, 3);
    expect(mult).toBeLessThan(MULT_FRISCH);
    expect(mult).toBeGreaterThan(MULT_VERBRANNT);
    // Leeres Gedächtnis → exakt 1 (BalanceInvariant-Schutz: frisch bleibt frisch).
    expect(gewichteterMultiplikator(leeresMaschenGedaechtnis(), FAMILIE, ziele, 3)).toBe(1);
  });

  it('erklärt die dominante Ursache mit Tag fürs Quittungs-Format (E5)', () => {
    const ziele = zielMilieusFuerTags(['media'], segmente);
    let s = leeresMaschenGedaechtnis();
    s = impfePrebunking(s, FAMILIE, ziele.map((z) => z.id), 9);
    const erklaerung = erklaereDaempfung(s, FAMILIE, ziele, 10);
    expect(erklaerung).not.toBeNull();
    expect(erklaerung!.grund).toBe('prebunking');
    expect(erklaerung!.tag).toBe(9);
    expect(erklaerung!.milieuLabel.length).toBeGreaterThan(0);

    // Ohne jede Dämpfung: keine Erklärung (keine leere Quittung).
    expect(erklaereDaempfung(leeresMaschenGedaechtnis(), FAMILIE, ziele, 10)).toBeNull();
  });
});
