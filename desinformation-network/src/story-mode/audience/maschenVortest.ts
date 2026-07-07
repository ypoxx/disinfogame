/**
 * maschenVortest — reiner Vortest EINER konkreten Masche gegen die 8 Resonanzgruppen.
 *
 * Der entscheidende Punkt (Owner A): Der Vortest führt KEIN zweites Datensilo, sondern
 * liest exakt dieselbe Kette, die im 40-Tage-Wettrennen wirkt —
 *   tags → Methoden-Familie (methodFamilyForTags)
 *        → Ziel-Resonanzgruppen + Resonanz/Gewicht (zielMilieusFuerTags)
 *        → je Gruppe FRISCH/BEKANNT/VERBRANNT + Wirkungs-Multiplikator (Abnutzung × (1−Impfung)).
 * Damit ist der Vortest per Konstruktion die WAHRE Vorschau (E16).
 *
 * Rein/deterministisch (kein React, kein Math.random): gleiche Eingabe + gleicher
 * Gedächtnis-/Phasen-Stand → gleiche Ausgabe. Die Adapter-Methode `getSegmentVortest`
 * reicht den Live-Zustand herein; die UI konsumiert nur das fertige Row-Objekt.
 */

import type { AudienceSegment, Channel } from './audienceModel';
import {
  zielMilieusFuerTags,
  stempelFuer,
  effektiveImpfung,
  wirkungsMultiplikator,
  themenFuerTags,
  kanalFuerTags,
  type MaschenStempel,
  type MaschenGedaechtnisState,
} from '../engine/MaschenGedaechtnis';
import { methodFamilyForTags, type MethodFamilyRef } from '../engine/ImmuneSystem';

/** Ab dieser effektiven Immunität gilt eine Gruppe als „geimpft" (identisch zum Wohnzimmer-Alphabet). */
export const GEIMPFT_SCHWELLE = 0.15;

/** Vortest-Zeile je Resonanzgruppe. */
export interface SegmentVortest {
  segmentId: string;
  label_de: string;
  /** Erreicht der Kanal der Masche diese Gruppe überhaupt? */
  reached: boolean;
  /** Themen-Resonanz 0..1. */
  resonanz: number;
  /** Reichweiten-Gewicht (Größe × Resonanz-Anteil). */
  gewicht: number;
  /** FRISCH/BEKANNT/VERBRANNT aus dem Maschen-Gedächtnis (E1). */
  stempel: MaschenStempel;
  /** Prebunkt/faktengecheckt — wehrt ab (E4). */
  geimpft: boolean;
  /** Prognostizierte Aufnahme 0..1 = Resonanz × (Abnutzung × (1−Impfung)). */
  wirkung: number;
}

export interface MaschenVortestResult {
  familieId: string | null;
  familieLabel: string | null;
  /** Alle 8 Gruppen, sortiert nach Gewicht absteigend. */
  segmente: SegmentVortest[];
  /** Größen-gewichtetes Mittel der Wirkung über die BEFRAGTE Stichprobe (0..1). */
  predictedReception: number;
  /** Größen-gewichtetes Mittel über ALLE Gruppen (der wahre Effekt, 0..1). */
  trueReception: number;
  /** predicted − true; > 0 = Wunsch-Stichprobe (überschätzt). */
  sampleBias: number;
  /** Bevölkerungsanteil in der Stichprobe (0..1). */
  representativeness: number;
  warning: string | null;
}

export interface VortestContext {
  segmente: AudienceSegment[];
  gedaechtnis: MaschenGedaechtnisState;
  phase: number;
  families: MethodFamilyRef[];
}

/** Kühles Aktendeckel-Etikett einer Masche-Karte: Familie · Themen · Kanal (kein Lehrsatz). */
export interface CardRegister {
  familieId: string | null;
  familieLabel: string | null;
  themen: string[];
  kanal: Channel;
}

export function cardRegister(tags: string[], families: MethodFamilyRef[]): CardRegister {
  const fam = methodFamilyForTags(tags, families);
  return {
    familieId: fam?.id ?? null,
    familieLabel: fam?.label_de ?? null,
    themen: themenFuerTags(tags),
    kanal: kanalFuerTags(tags),
  };
}

/**
 * Vortest einer Masche (durch ihre `tags`) gegen alle Resonanzgruppen; `sampleSegmentIds`
 * ist die befragte Stichprobe (geführter Querschnitt = alle Gruppen-IDs → Bias 0).
 */
export function vortestMasche(
  tags: string[],
  sampleSegmentIds: string[],
  ctx: VortestContext,
): MaschenVortestResult {
  const fam = methodFamilyForTags(tags, ctx.families);
  const zielById = new Map(zielMilieusFuerTags(tags, ctx.segmente).map((z) => [z.id, z]));
  const sampleSet = new Set(sampleSegmentIds);

  const segmente: SegmentVortest[] = ctx.segmente.map((seg) => {
    const ziel = zielById.get(seg.id);
    const reached = ziel !== undefined;
    const resonanz = ziel?.resonanz ?? 0;
    const gewicht = ziel?.gewicht ?? 0;
    const mult = fam ? wirkungsMultiplikator(ctx.gedaechtnis, seg.id, fam.id, ctx.phase) : 1;
    const stempel: MaschenStempel = fam ? stempelFuer(ctx.gedaechtnis, seg.id, fam.id, ctx.phase) : 'frisch';
    const geimpft = fam ? effektiveImpfung(ctx.gedaechtnis, seg.id, fam.id, ctx.phase) >= GEIMPFT_SCHWELLE : false;
    return {
      segmentId: seg.id,
      label_de: seg.label_de,
      reached,
      resonanz,
      gewicht,
      stempel,
      geimpft,
      wirkung: reached ? resonanz * mult : 0,
    };
  });
  segmente.sort((a, b) => b.gewicht - a.gewicht);

  const sizeOf = new Map(ctx.segmente.map((s) => [s.id, s.size]));
  const gewichtetesMittel = (ids: Set<string>): number => {
    let num = 0;
    let den = 0;
    for (const s of segmente) {
      if (!ids.has(s.segmentId)) continue;
      const size = sizeOf.get(s.segmentId) ?? 0;
      num += s.wirkung * size;
      den += size;
    }
    return den > 0 ? num / den : 0;
  };
  const allIds = new Set(ctx.segmente.map((s) => s.id));
  const predictedReception = gewichtetesMittel(sampleSet);
  const trueReception = gewichtetesMittel(allIds);
  const sampleBias = predictedReception - trueReception;

  const totalSize = ctx.segmente.reduce((s, x) => s + x.size, 0);
  const sampleSize = ctx.segmente.filter((s) => sampleSet.has(s.id)).reduce((s, x) => s + x.size, 0);
  const representativeness = totalSize > 0 ? sampleSize / totalSize : 0;

  let warning: string | null = null;
  if (sampleSet.size === 0) {
    warning = 'Keine Resonanzgruppe befragt — keine Aussage möglich.';
  } else if (representativeness < 0.6 && sampleBias > 0.08) {
    warning =
      'Einseitige Stichprobe: überwiegend empfängliche Gruppen befragt. ' +
      'Die Prognose überschätzt die echte Wirkung.';
  } else if (representativeness < 0.6) {
    warning = 'Stichprobe deckt nicht die ganze Westunion ab — Ergebnis mit Vorsicht lesen.';
  }

  return {
    familieId: fam?.id ?? null,
    familieLabel: fam?.label_de ?? null,
    segmente,
    predictedReception,
    trueReception,
    sampleBias,
    representativeness,
    warning,
  };
}
