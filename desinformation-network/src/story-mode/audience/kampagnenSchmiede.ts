/**
 * kampagnenSchmiede — reine Logik der „Kampagnen-Schmiede" (testbar, ohne UI).
 *
 * Verbindet die Zielgruppen-Analyse (Fokusgruppe) mit der Handlung (Operations-Akte):
 *
 *   1. WIRKUNGS-MATRIX  — Appell × Milieu über die befragte Stichprobe. Zeigt, wo welcher
 *      Appell zündet (Sweet Spot) und wo er zurückschlägt (Falle). Unbefragte Milieus
 *      bleiben „unbekannt" — eine schmale Stichprobe lässt die Landkarte im Nebel.
 *
 *   2. KAMPAGNEN-EMPFEHLUNGEN — aus den Sweet Spots werden startklare Operations-Seeds:
 *      Ziel (Person im Milieu) → Schwäche → Verbreiter → Plattform, samt erwarteter
 *      Engine-Wirkung. Ein Klick befüllt die Operations-Akte vor (Brücke Analyse → Tat).
 *
 *   3. SAMPLE-BIAS („Zähne") — ruht eine Empfehlung auf einer geschönten Wunsch-Stichprobe
 *      (Prognose ≫ wahrer Milieu-Wert), trägt der Seed `biasWarned`. Startet der Spieler
 *      sie trotzdem, reagiert die echte Zielgruppe schwächer (Engine wertet das aus).
 *
 * Bewusst deterministisch/lesbar (Bildungszweck): gleiche Eingabe → gleiche Empfehlung.
 */

import type { Persona, MessageAppeal } from './fokusgruppeModel';
import {
  evaluateOperation,
  type Target,
  type Carrier,
  type Platform,
  type OperationAnalysis,
} from '../battlefield/BattlefieldChain';

// ─── Appell-Metadaten ─────────────────────────────────────────────────────────

export const APPEALS: MessageAppeal[] = ['hope', 'fear', 'anger', 'trust'];

export const APPEAL_LABEL: Record<MessageAppeal, string> = {
  hope: 'Aufbruch',
  fear: 'Abstiegsangst',
  anger: 'Empörung',
  trust: 'Seriosität',
};

/** Personas nutzen die kurze Milieu-Form (`zorniger`), Audience/Targets die `wu_`-Form. */
export function toSegmentKey(id: string): string {
  return id.startsWith('wu_') ? id : `wu_${id}`;
}

// ─── Wirkungs-Matrix ──────────────────────────────────────────────────────────

export type CellClass = 'sweet' | 'gut' | 'neutral' | 'falle' | 'unbekannt';

export interface MatrixCell {
  appeal: MessageAppeal;
  /** Milieu-Schlüssel in `wu_`-Form. */
  segmentId: string;
  /** Anzahl befragter Personas dieses Milieus (0 = unbefragt). */
  sampled: number;
  /** Mittlere Empfänglichkeit im Sample (−1..1) oder null, wenn unbefragt. */
  value: number | null;
  klass: CellClass;
}

export interface WirkungsMatrix {
  /** Milieus als Spalten (wu_-Form), in Reihenfolge des ersten Auftretens in `personas`. */
  segmentIds: string[];
  /** Zeilen (Appelle) × Spalten (Milieus). */
  cells: MatrixCell[];
}

const mean = (xs: number[]): number => (xs.length === 0 ? 0 : xs.reduce((s, x) => s + x, 0) / xs.length);

/** Klassifiziert einen Zellenwert (Schwellen symmetrisch, an moodForShift angelehnt). */
export function classifyCell(value: number | null): CellClass {
  if (value === null) return 'unbekannt';
  if (value >= 0.4) return 'sweet';
  if (value >= 0.15) return 'gut';
  if (value <= -0.4) return 'falle';
  return 'neutral';
}

/** Eindeutige Milieus (wu_-Form) in Auftretens-Reihenfolge. */
function orderedSegmentKeys(personas: Persona[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of personas) {
    const key = toSegmentKey(p.segmentId);
    if (!seen.has(key)) {
      seen.add(key);
      out.push(key);
    }
  }
  return out;
}

/**
 * Baut die Wirkungs-Matrix aus der befragten Stichprobe. Nur Personas in `sampleIds`
 * fließen in die Werte — unbefragte Milieus bleiben `null` („unbekannt").
 */
export function buildWirkungsMatrix(personas: Persona[], sampleIds: string[]): WirkungsMatrix {
  const sampleSet = new Set(sampleIds);
  const sampled = personas.filter((p) => sampleSet.has(p.id));
  const segmentIds = orderedSegmentKeys(personas);

  const cells: MatrixCell[] = [];
  for (const appeal of APPEALS) {
    for (const segmentId of segmentIds) {
      const inSeg = sampled.filter((p) => toSegmentKey(p.segmentId) === segmentId);
      const value = inSeg.length === 0 ? null : mean(inSeg.map((p) => p.receptivity[appeal] ?? 0));
      cells.push({ appeal, segmentId, sampled: inSeg.length, value, klass: classifyCell(value) });
    }
  }
  return { segmentIds, cells };
}

// ─── Kampagnen-Empfehlungen ───────────────────────────────────────────────────

/** Minimal-Info je Audience-Milieu, die die Schmiede zum Priorisieren braucht. */
export interface SegmentInfo {
  /** wu_-Form. */
  id: string;
  label_de: string;
  milieu: string;
  /** Bevölkerungsanteil 0..1 (gewichtet die Priorität — große Milieus zuerst). */
  size: number;
  /** Aktueller Glaube ans gegnerische Narrativ 0..1 (1−belief = Luft nach oben). */
  belief: number;
}

/** Operations-Vorbelegung (strukturgleich zur AkteSelection der Operations-Akte). */
export interface CampaignSeed {
  targetId: string | null;
  vulnId: string | null;
  carrierId: string | null;
  platformIds: string[];
  analysis: OperationAnalysis;
}

export interface KampagnenEmpfehlung {
  id: string;
  appeal: MessageAppeal;
  /** wu_-Form. */
  segmentId: string;
  segmentLabel: string;
  title_de: string;
  rationale_de: string;
  seed: CampaignSeed;
  /** Prognose der Stichprobe für (Appell, Milieu) −1..1. */
  predictedReception: number;
  /** Wahrer Milieu-Wert über die Gesamt-Personas −1..1. */
  trueReception: number;
  biasWarned: boolean;
  /** Erwartete Engine-Wirkung, falls Ziel/Verbreiter/Plattform bestimmbar — sonst null. */
  expected: { reach: number; impact: number; exposureRisk: number } | null;
  /** true, wenn kein Ziel im Milieu existiert → Seed teil-vorbefüllt (Ziel offen). */
  partial: boolean;
}

export interface RecommendContext {
  personas: Persona[];
  sampleIds: string[];
  segments: SegmentInfo[];
  targets: Target[];
  carriers: Carrier[];
  platforms: Platform[];
  /** Aktueller Faktencheck-/Gegendruck 0..1 (für die erwartete Wirkung). */
  factcheckPressure?: number;
  /** Sättigung des Informationsraums 0..1. */
  saturation?: number;
  /** Höchstzahl der Empfehlungen (Default 3). */
  limit?: number;
}

/** Wahrer Milieu-Wert eines Appells über ALLE Personas des Milieus (nicht nur die Stichprobe). */
function trueSegmentReception(personas: Persona[], segmentId: string, appeal: MessageAppeal): number {
  const inSeg = personas.filter((p) => toSegmentKey(p.segmentId) === segmentId);
  return inSeg.length === 0 ? 0 : mean(inSeg.map((p) => p.receptivity[appeal] ?? 0));
}

/** Bestes Ziel im Milieu: das mit der glaubwürdigsten Schwäche. */
function pickTarget(targets: Target[], segmentId: string): { target: Target; vulnId: string } | null {
  const inSeg = targets.filter((t) => t.milieu === segmentId && t.vulnerabilities.length > 0);
  if (inSeg.length === 0) return null;
  let best: { target: Target; vulnId: string; score: number } | null = null;
  for (const t of inSeg) {
    for (const v of t.vulnerabilities) {
      // Glaubwürdiges, aber nicht zu heikles Material bevorzugt.
      const score = v.glaubwuerdigkeit - v.heikelheit * 0.3;
      if (!best || score > best.score) best = { target: t, vulnId: v.id, score };
    }
  }
  return best ? { target: best.target, vulnId: best.vulnId } : null;
}

/** Bester Verbreiter fürs Milieu (Milieu-Treffer bevorzugt, sonst milieu-loses Rauschen). */
function pickCarrier(carriers: Carrier[], segmentId: string): Carrier | null {
  const matching = carriers.filter((c) => c.milieus.includes(segmentId));
  const pool = matching.length > 0 ? matching : carriers.filter((c) => c.milieus.length === 0);
  if (pool.length === 0) return null;
  // Reichweite + Glaubwürdigkeit hoch, Enttarnungs-Risiko niedrig.
  return [...pool].sort(
    (a, b) => b.reach + b.credibility - b.exposure * 0.5 - (a.reach + a.credibility - a.exposure * 0.5),
  )[0];
}

/** Bis zu zwei reichweitenstärkste Plattformen fürs Milieu (sonst die stärkste überhaupt). */
function pickPlatforms(platforms: Platform[], segmentId: string): Platform[] {
  const matching = platforms.filter((p) => p.milieus.includes(segmentId));
  const pool = matching.length > 0 ? matching : platforms;
  return [...pool].sort((a, b) => b.reach - a.reach).slice(0, matching.length > 0 ? 2 : 1);
}

/**
 * Leitet aus der befragten Stichprobe 1–N startklare Kampagnen ab: je Milieu der stärkste
 * positive Appell, priorisiert nach (Wirkung × Milieu-Größe × Luft nach oben). Sweet Spots
 * mit geschönter Stichprobe (Prognose ≫ Wahrheit) tragen `biasWarned`.
 */
export function recommendCampaigns(ctx: RecommendContext): KampagnenEmpfehlung[] {
  const { personas, sampleIds, segments, targets, carriers, platforms } = ctx;
  const limit = ctx.limit ?? 3;
  const matrix = buildWirkungsMatrix(personas, sampleIds);
  const segInfoById = new Map(segments.map((s) => [s.id, s]));

  interface Candidate extends KampagnenEmpfehlung {
    score: number;
  }
  const candidates: Candidate[] = [];

  for (const segmentId of matrix.segmentIds) {
    // Stärkste positive Zelle dieses Milieus (Sweet Spot / gut) über die Stichprobe.
    const cellsForSeg = matrix.cells.filter(
      (c) => c.segmentId === segmentId && c.value !== null && c.value >= 0.15,
    );
    if (cellsForSeg.length === 0) continue;
    const best = cellsForSeg.reduce((a, b) => ((b.value ?? -1) > (a.value ?? -1) ? b : a));
    const appeal = best.appeal;
    const predicted = best.value ?? 0;
    const trueVal = trueSegmentReception(personas, segmentId, appeal);
    // Wunsch-Stichprobe: schmal befragt UND deutlich rosiger als der wahre Milieu-Wert.
    const biasWarned = best.sampled <= 1 && predicted - trueVal > 0.2;

    const seg = segInfoById.get(segmentId);
    const label = seg?.label_de ?? segmentId.replace(/^wu_/, '');
    const size = seg?.size ?? 0.1;
    const headroom = 1 - (seg?.belief ?? 0.3);

    const targetPick = pickTarget(targets, segmentId);
    const carrier = pickCarrier(carriers, segmentId);
    const pickedPlatforms = pickPlatforms(platforms, segmentId);
    const partial = targetPick === null;

    // Erwartete Engine-Wirkung nur, wenn Ziel + Verbreiter + Plattform bestimmbar.
    let expected: KampagnenEmpfehlung['expected'] = null;
    if (targetPick && carrier && pickedPlatforms.length > 0) {
      const vuln = targetPick.target.vulnerabilities.find((v) => v.id === targetPick.vulnId)!;
      const res = evaluateOperation({
        target: targetPick.target,
        vulnerability: vuln,
        carrier,
        platforms: pickedPlatforms,
        factcheckPressure: ctx.factcheckPressure,
        saturation: ctx.saturation,
      });
      expected = { reach: res.reach, impact: res.impact, exposureRisk: res.exposureRisk };
    }

    const analysis: OperationAnalysis = {
      appeal,
      segmentId,
      predictedReception: predicted,
      trueReception: trueVal,
      biasWarned,
    };
    const seed: CampaignSeed = {
      targetId: targetPick?.target.id ?? null,
      vulnId: targetPick?.vulnId ?? null,
      carrierId: carrier?.id ?? null,
      platformIds: pickedPlatforms.map((p) => p.id),
      analysis,
    };

    const targetName = targetPick?.target.name ?? 'ein Ziel im Milieu';
    const carrierName = carrier?.label_de ?? 'einen Verbreiter';
    const rationale_de = biasWarned
      ? `${APPEAL_LABEL[appeal]} schien bei „${label}" stark (+${Math.round(predicted * 100)} %) — doch die Stichprobe war einseitig. Der echte Milieu-Wert liegt bei +${Math.round(trueVal * 100)} %.`
      : `${APPEAL_LABEL[appeal]} zündet bei „${label}" (+${Math.round(predicted * 100)} %). Angriff auf ${targetName} über ${carrierName}.`;

    // Priorität: positive Prognose × Milieu-Größe × Luft nach oben; Bias-Fälle abgewertet.
    const score = Math.max(0, predicted) * size * Math.max(0.1, headroom) * (biasWarned ? 0.4 : 1) * (partial ? 0.7 : 1);

    candidates.push({
      id: `emp_${appeal}_${segmentId}`,
      appeal,
      segmentId,
      segmentLabel: label,
      title_de: `${APPEAL_LABEL[appeal]}-Kampagne · ${label}`,
      rationale_de,
      seed,
      predictedReception: predicted,
      trueReception: trueVal,
      biasWarned,
      expected,
      partial,
      score,
    });
  }

  return candidates
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ score: _score, ...rest }) => rest);
}
