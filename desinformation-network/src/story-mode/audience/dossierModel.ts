/**
 * dossierModel — reine Logik des „Erkenntnis-Dossiers" (testbar, ohne UI).
 *
 * Sammelt die Sweet Spots (Appell × Milieu) aus den Fokusgruppen ÜBER RUNDEN HINWEG und
 * verdichtet sie zu „Kampagnen-Arcs" — höherstufige Strategie-Muster, die mehrere Befunde
 * zusammenbinden:
 *
 *   · FLÄCHENBRAND     — ein Appell zündet in ≥3 Milieus → breit streuen.
 *   · ZWEI-FRONTEN     — zwei starke Befunde mit unterschiedlichem Appell in
 *                        unterschiedlichen Milieus → beide Milieus parallel anspielen.
 *
 * Deterministisch/lesbar (Bildungszweck). Persistenz macht `stores/dossierStore.ts`.
 */

import type { MessageAppeal } from './fokusgruppeModel';
import { APPEAL_LABEL, APPEALS, type WirkungsMatrix } from './kampagnenSchmiede';

/** Ein über eine Befragung gewonnener Sweet-Spot-Befund. */
export interface Erkenntnis {
  /** Stabiler Schlüssel `${appeal}_${segmentId}` (dedupe über Runden). */
  id: string;
  appeal: MessageAppeal;
  /** Milieu-Schlüssel (wu_-Form). */
  segmentId: string;
  /** Stärkste gemessene Empfänglichkeit (−1..1, hier ≥ Schwelle). */
  value: number;
  /** Phase, in der der Befund (erstmals) entdeckt wurde. */
  phase: number;
}

/** Ab dieser Empfänglichkeit gilt eine Zelle als Sweet Spot / Erkenntnis. */
export const SWEET_THRESHOLD = 0.4;

/** Sweet-Spot-Zellen einer Befragung als Erkenntnisse (nur befragte, ≥ Schwelle). */
export function findingsFromMatrix(matrix: WirkungsMatrix, phase: number, threshold = SWEET_THRESHOLD): Erkenntnis[] {
  return matrix.cells
    .filter((c) => c.value !== null && c.value >= threshold)
    .map((c) => ({
      id: `${c.appeal}_${c.segmentId}`,
      appeal: c.appeal,
      segmentId: c.segmentId,
      value: c.value as number,
      phase,
    }));
}

/**
 * Neue Erkenntnisse ins Dossier einmischen: dedupe über die id, den stärkeren Wert
 * behalten, die früheste Entdeckungs-Phase bewahren.
 */
export function mergeFindings(existing: Erkenntnis[], incoming: Erkenntnis[]): Erkenntnis[] {
  const byId = new Map(existing.map((e) => [e.id, e]));
  for (const f of incoming) {
    const prev = byId.get(f.id);
    if (!prev) {
      byId.set(f.id, f);
    } else {
      byId.set(f.id, {
        ...prev,
        value: Math.max(prev.value, f.value),
        phase: Math.min(prev.phase, f.phase),
      });
    }
  }
  return [...byId.values()];
}

// ─── Kampagnen-Arcs ───────────────────────────────────────────────────────────

export type ArcKind = 'flaechenbrand' | 'zwei_fronten';

export interface KampagnenArc {
  id: string;
  kind: ArcKind;
  title_de: string;
  rationale_de: string;
  /** Beteiligte Erkenntnis-ids. */
  findingIds: string[];
  /** Beteiligte Milieus (wu_-Form). */
  segmentIds: string[];
}

const shortLabel = (segmentId: string, labels?: Map<string, string>): string =>
  (labels?.get(segmentId) ?? segmentId.replace(/^wu_/, '')).replace(/^Die /, '');

/**
 * Verdichtet die gesammelten Befunde zu Arcs. Deterministisch: Flächenbrand je Appell,
 * dann der stärkste Zwei-Fronten-Kontrast. `labels` liefert lesbare Milieu-Namen.
 */
export function detectArcs(findings: Erkenntnis[], labels?: Map<string, string>): KampagnenArc[] {
  const arcs: KampagnenArc[] = [];

  // FLÄCHENBRAND: ein Appell ist in ≥3 verschiedenen Milieus ein Sweet Spot.
  for (const appeal of APPEALS) {
    const forAppeal = findings.filter((f) => f.appeal === appeal);
    const segs = [...new Set(forAppeal.map((f) => f.segmentId))];
    if (segs.length >= 3) {
      arcs.push({
        id: `arc_flaechenbrand_${appeal}`,
        kind: 'flaechenbrand',
        title_de: `Flächenbrand · ${APPEAL_LABEL[appeal]}`,
        rationale_de: `${APPEAL_LABEL[appeal]} zündet in ${segs.length} Milieus (${segs
          .map((s) => shortLabel(s, labels))
          .join(', ')}). Ein Appell trägt breit — über mehrere Kanäle gleichzeitig streuen.`,
        findingIds: forAppeal.map((f) => f.id),
        segmentIds: segs,
      });
    }
  }

  // ZWEI-FRONTEN: stärkstes Paar mit unterschiedlichem Appell UND unterschiedlichem Milieu.
  const sorted = [...findings].sort((a, b) => b.value - a.value);
  let pair: [Erkenntnis, Erkenntnis] | null = null;
  outer: for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      if (sorted[i].appeal !== sorted[j].appeal && sorted[i].segmentId !== sorted[j].segmentId) {
        pair = [sorted[i], sorted[j]];
        break outer;
      }
    }
  }
  if (pair) {
    const [a, b] = pair;
    arcs.push({
      id: `arc_zwei_fronten_${a.id}__${b.id}`,
      kind: 'zwei_fronten',
      title_de: 'Zwei-Fronten-Narrativ',
      rationale_de: `${APPEAL_LABEL[a.appeal]} bei „${shortLabel(a.segmentId, labels)}" und ${APPEAL_LABEL[b.appeal]} bei „${shortLabel(
        b.segmentId,
        labels,
      )}" — zwei Milieus mit gegensätzlichen Hebeln parallel anspielen.`,
      findingIds: [a.id, b.id],
      segmentIds: [a.segmentId, b.segmentId],
    });
  }

  return arcs;
}
