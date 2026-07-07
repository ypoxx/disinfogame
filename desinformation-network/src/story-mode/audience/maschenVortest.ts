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
import { methodFamilyForTags, PATCH_EVERY_N_USES, type MethodFamilyRef } from '../engine/ImmuneSystem';

/** Ab dieser effektiven Immunität gilt eine Gruppe als „geimpft" (identisch zum Wohnzimmer-Alphabet). */
export const GEIMPFT_SCHWELLE = 0.15;
/** Überzeugungs-Schwelle, ab der die Parteifahne im Fenster hängt (= broadcastMapping.FAHNE_BELIEF_SCHWELLE). */
export const FAHNE_SCHWELLE = 0.75;
/** Innerhalb so vieler Stöße bis zur Fahne gilt eine Gruppe als Kipp-Kandidat (E3, qualitativ). */
export const KIPP_STOSS_NAH = 3;

/** Familie inkl. Gegennarrativ-Text (counter_de) — die Live-Familien tragen ihn bereits. */
export interface FamilieRef extends MethodFamilyRef {
  counter_de?: string;
}

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
  /** Wittert die Masche (geimpft ODER verbrannt) — Keim des Gegen-Narrativs (E2). */
  wittert: boolean;
  /** Kurz vorm Umschlagen (in ≤ KIPP_STOSS_NAH Stößen bis zur Fahne, E3). */
  kippNah: boolean;
  /** Qualitativ: geschätzte Stöße bis zur Parteifahne (keine Sonntagsfrage-Zahl). */
  stoesseBisFahne: number;
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
  /** Versteckter Einwand (Gegennarrativ der Familie), den die ABWEHR später aufgreift (E2). */
  einwand_de: string | null;
  /** Reife des Einwands: wie oft die Familie schon lief, wann die Abwehr ihn aufgreift (E2). */
  einwandReife: { einsaetze: number; patchBei: number } | null;
}

export interface VortestContext {
  segmente: AudienceSegment[];
  gedaechtnis: MaschenGedaechtnisState;
  phase: number;
  families: FamilieRef[];
}

/** Eine im Vortest testbare Masche als Karte (Draußen-O-Ton + Register + Vorgriff). */
export interface MascheKarte {
  /** Aktions-id (z. B. „11.4") — die getestete Masche IST die spätere Aktion. */
  id: string;
  label_de: string;
  /** Draußen-O-Ton (botschaft_de) oder Fallback narrative_de. */
  botschaft_de: string;
  /** Geghostete Sendungs-Headline (Vorgriff auf das Ausspielen). */
  headline_de: string;
  familieLabel: string | null;
  themen: string[];
  kanal: Channel;
}

// ─── Persona-O-Ton (§6): das Leitmotiv „Das ist doch…" kippt mit dem Stempel ────

/** Minimal-Persona für den Stimmen-Vorgriff (Name + Gruppen-Zugehörigkeit). */
export interface PersonaLite {
  name: string;
  /** Kurzform (`zorniger`) ODER `wu_`-Form — wird normalisiert. */
  segmentId: string;
}

/** Eine repräsentative Stimme aus der Stichprobe (Vorgriff auf die Wohnzimmer-Reaktion). */
export interface Stimme {
  name: string;
  gruppeLabel: string;
  stempel: MaschenStempel;
  geimpft: boolean;
  /** Ein Satz in Anführungszeichen — die WELT darf laut sein. */
  oTon: string;
}

const stimmeIntro = '»Das ist doch… ';
/** Der O-Ton kippt am selben Satzanfang: von der Inhalts- zur Muster-/Quellen-Ebene (§6). */
function oTonFuer(stempel: MaschenStempel, geimpft: boolean): string {
  if (geimpft) return stimmeIntro + 'erst mal die Quelle. Von wem „hört man" das?«';
  if (stempel === 'verbrannt') return stimmeIntro + 'immer dieselbe Masche. Nett versucht.«';
  if (stempel === 'bekannt') return stimmeIntro + 'hatten wir das nicht schon?«';
  return stimmeIntro + 'genau das, was hier alle spüren.«';
}

const kurzKey = (id: string): string => (id.startsWith('wu_') ? id : `wu_${id}`);

/**
 * Zwei repräsentative Stimmen zum Vortest: die stärkste (frische) Zustimmung und der
 * schärfste (verbrannte/geimpfte) Widerstand — beide beginnen mit „Das ist doch…",
 * enden aber verschieden (der Spieler hört die Impfung wirken). Rein/deterministisch.
 */
export function repraesentativeStimmen(segmente: SegmentVortest[], personas: PersonaLite[]): Stimme[] {
  const personaFuer = (segId: string): string | null =>
    personas.find((p) => kurzKey(p.segmentId) === segId)?.name ?? null;
  const stimmeAus = (s: SegmentVortest): Stimme => ({
    name: personaFuer(s.segmentId) ?? s.label_de,
    gruppeLabel: s.label_de,
    stempel: s.stempel,
    geimpft: s.geimpft,
    oTon: oTonFuer(s.stempel, s.geimpft),
  });

  const erreicht = segmente.filter((s) => s.reached && s.wirkung > 0.001);
  // Zustimmung: stärkste Wirkung, noch frisch/bekannt und nicht geimpft.
  const zustimmung = [...erreicht]
    .filter((s) => !s.geimpft && s.stempel !== 'verbrannt')
    .sort((a, b) => b.wirkung - a.wirkung)[0];
  // Widerstand: die gewichtigste Gruppe, die wittert (geimpft ODER verbrannt).
  const widerstand = [...segmente]
    .filter((s) => s.wittert)
    .sort((a, b) => b.gewicht - a.gewicht)[0];

  const out: Stimme[] = [];
  if (zustimmung) out.push(stimmeAus(zustimmung));
  if (widerstand && widerstand.segmentId !== zustimmung?.segmentId) out.push(stimmeAus(widerstand));
  return out;
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
    const wirkung = reached ? resonanz * mult : 0;
    // E3: Stöße bis zur Fahne = Lücke bis zur Kipp-Schwelle / Überzeugungs-Gewinn je Einsatz
    // (beliefDelta = Wirkung × 0,2, wie audienceModel.reactToEffect). Nur qualitativ, keine Punktzahl.
    const luecke = FAHNE_SCHWELLE - seg.belief;
    const deltaProStoss = wirkung * 0.2;
    const stoesseBisFahne = luecke <= 0 ? 0 : deltaProStoss <= 0.001 ? 99 : Math.ceil(luecke / deltaProStoss);
    const kippNah = stoesseBisFahne >= 1 && stoesseBisFahne <= KIPP_STOSS_NAH;
    return {
      segmentId: seg.id,
      label_de: seg.label_de,
      reached,
      resonanz,
      gewicht,
      stempel,
      geimpft,
      wirkung,
      wittert: geimpft || stempel === 'verbrannt',
      kippNah,
      stoesseBisFahne,
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

  // E2: der Gegennarrativ-Keim der Familie + wie oft sie schon lief (Reife bis zum Patch).
  const einwand_de = fam ? (ctx.families.find((f) => f.id === fam.id)?.counter_de ?? null) : null;
  const einsaetze = fam ? (ctx.gedaechtnis.familienEinsaetze[fam.id] ?? 0) : 0;
  const einwandReife = fam ? { einsaetze, patchBei: PATCH_EVERY_N_USES } : null;

  return {
    familieId: fam?.id ?? null,
    familieLabel: fam?.label_de ?? null,
    segmente,
    predictedReception,
    trueReception,
    sampleBias,
    representativeness,
    warning,
    einwand_de,
    einwandReife,
  };
}
