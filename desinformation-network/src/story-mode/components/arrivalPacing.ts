/**
 * arrivalPacing — Kino-Pacing der Ankunfts-Sequenz (pure TS, testbar).
 *
 * Problem: `playVoiceLine` ist einkanalig — der nächste Abschnitt stoppt die
 * laufende Erzähler-Zeile. Die Routen-Schritte (0,8–4,7 s) sind aber kürzer als
 * die Zeilen (3,2–6,5 s), also wurde bisher JEDE Zeile mitten im Satz gekappt.
 *
 * Lösung: Jeder Abschnitt bekommt VOR seiner Bewegung so viel Standzeit, dass
 * seine Zeile fertig ist, bevor der nächste Abschnitt übernimmt. Der Avatar
 * wartet dabei sichtbar — genau da, wo Warten ohnehin natürlich ist (Eingang,
 * vor dem Fahrstuhl, aus der Kabine getreten, vor der Tür).
 *
 * Die Längen kommen aus den Audio-Metadaten, nicht aus einer Tabelle: eine neue
 * Vertonung (anderer Sprecher, anderes Tempo) pacet sich damit von selbst.
 */
import type { NavStep } from '../building/BuildingNavigator';

/** Abschnitte der Ankunft; jeder trägt Caption UND Erzähler-Asset (voice_narrator_<key>). */
export type ArrivalBeat = 'lobby' | 'ride' | 'floor' | 'door';

/** Grundständige Standzeit je Abschnitt — gilt auch ohne Ton. */
export const BASE_HOLD_MS: Record<ArrivalBeat, number> = {
  lobby: 1400, // Lobby erst als Bild wirken lassen (Review-Befund B3)
  ride: 0,
  floor: 0,
  door: 0,
};

/** Luft hinter der Sprachzeile, bevor der nächste Abschnitt sie ablöst. */
export const BEAT_TAIL_MS = 250;

/** Obergrenze je Standzeit — schützt vor kaputten/absurd langen Metadaten. */
export const MAX_HOLD_MS = 9000;

/** Abschnitt eines Routen-Schritts — identische Logik wie die frühere Caption-Auflösung. */
export function beatForStep(step: NavStep): ArrivalBeat {
  if (step.kind === 'elevator') return 'ride';
  if (step.kind === 'door') return 'door';
  return Math.round(step.floorLevel) === 0 ? 'lobby' : 'floor';
}

export interface ArrivalHold {
  beat: ArrivalBeat;
  /** Standzeit vor der Bewegung dieses Abschnitts (ms). */
  holdMs: number;
}

/**
 * Standzeiten je Routen-Schritt.
 *
 * @param steps        geplante Route (entryPosition → Zentrale)
 * @param narrationMs  gemessene Länge der Erzähler-Zeile je Abschnitt;
 *                     `null`/fehlend = keine Messung (z. B. Ton aus) → Grundwert
 */
export function planArrivalHolds(
  steps: readonly NavStep[],
  narrationMs: Partial<Record<ArrivalBeat, number | null>>
): ArrivalHold[] {
  return steps.map((step) => {
    const beat = beatForStep(step);
    const line = narrationMs[beat];
    const base = BASE_HOLD_MS[beat];
    // Die Bewegung läuft unter dem Zeilen-Ende weiter — nur der Überhang wartet.
    const needed = line && line > 0 ? line + BEAT_TAIL_MS - step.durationMs : 0;
    return { beat, holdMs: Math.min(MAX_HOLD_MS, Math.max(base, Math.round(needed), 0)) };
  });
}

/** Gesamtdauer der Sequenz in ms (Standzeiten + Bewegungen) — für Tests/Diagnose. */
export function arrivalDurationMs(steps: readonly NavStep[], holds: readonly ArrivalHold[]): number {
  return steps.reduce((sum, step, i) => sum + step.durationMs + (holds[i]?.holdMs ?? 0), 0);
}
