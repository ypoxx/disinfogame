/**
 * fokusgruppeModel — reine Logik der beauftragbaren Fokusgruppe (testbar, ohne UI).
 *
 * Kern (Konzept §3 + §7): Der Spieler testet eine Botschaft (Appell) an einer
 * SELBST GEWÄHLTEN Stichprobe von Personas. Ist die Stichprobe einseitig (nur
 * Zustimmer), überschätzt die Prognose die Wirkung → „Sample-Bias": schlechte
 * Marktforschung, die einen nur selbst bestätigt. Der wahre Effekt misst sich an
 * der GESAMTEN Bevölkerung, nicht an der Wunsch-Stichprobe.
 */

export type MessageAppeal = 'hope' | 'fear' | 'anger' | 'trust';
export type PersonaMood = 'zustimmend' | 'skeptisch' | 'ablehnend';

export interface Persona {
  id: string;
  name: string;
  milieu: string;
  segmentId: string;
  bio: string;
  vulnerabilities: string[];
  /** Reaktion je Appell in [-1,1] (1 = starke Zustimmung). */
  receptivity: Record<MessageAppeal, number>;
}

export interface PersonaReaction {
  personaId: string;
  mood: PersonaMood;
  /** Überzeugungs-Verschiebung in [-1,1]. */
  shift: number;
}

export interface PreTestResult {
  appeal: MessageAppeal;
  reactions: PersonaReaction[];
  /** Mittel über die STICHPROBE (was der Spieler „sieht"). */
  predictedReception: number;
  /** Mittel über die GESAMTE Bevölkerung (der wahre Effekt). */
  trueReception: number;
  /** predicted − true. > 0 = zu optimistisch (Wunsch-Stichprobe). */
  sampleBias: number;
  /** Stichproben-Repräsentativität 0..1 (Milieu-Abdeckung). */
  representativeness: number;
  /** Warnung, wenn die Stichprobe das Ergebnis verzerrt — sonst null. */
  warning: string | null;
}

const clamp = (x: number, lo = -1, hi = 1): number => Math.max(lo, Math.min(hi, x));
const mean = (xs: number[]): number => (xs.length === 0 ? 0 : xs.reduce((s, x) => s + x, 0) / xs.length);

/** Stimmung aus der Verschiebung (Schwellen bewusst symmetrisch). */
export function moodForShift(shift: number): PersonaMood {
  if (shift >= 0.33) return 'zustimmend';
  if (shift <= -0.33) return 'ablehnend';
  return 'skeptisch';
}

/** Reaktion einer Persona auf einen Appell. */
export function reactionFor(p: Persona, appeal: MessageAppeal): PersonaReaction {
  const shift = clamp(p.receptivity[appeal] ?? 0);
  return { personaId: p.id, mood: moodForShift(shift), shift };
}

/** Anteil der Bevölkerungs-Milieus, die die Stichprobe abdeckt (0..1). */
export function representativeness(sample: Persona[], population: Persona[]): number {
  const popSegments = new Set(population.map((p) => p.segmentId));
  if (popSegments.size === 0) return 0;
  const sampleSegments = new Set(sample.map((p) => p.segmentId));
  let covered = 0;
  for (const seg of popSegments) if (sampleSegments.has(seg)) covered++;
  return covered / popSegments.size;
}

/**
 * Pre-Test: prognostiziert die Wirkung eines Appells anhand der gewählten Stichprobe
 * und deckt den Sample-Bias gegenüber der Gesamtbevölkerung auf.
 */
export function preTest(
  appeal: MessageAppeal,
  population: Persona[],
  sampleIds: string[],
): PreTestResult {
  const sample = population.filter((p) => sampleIds.includes(p.id));
  const reactions = sample.map((p) => reactionFor(p, appeal));
  const predictedReception = mean(sample.map((p) => clamp(p.receptivity[appeal] ?? 0)));
  const trueReception = mean(population.map((p) => clamp(p.receptivity[appeal] ?? 0)));
  const sampleBias = predictedReception - trueReception;
  const repr = representativeness(sample, population);

  let warning: string | null = null;
  if (sample.length === 0) {
    warning = 'Keine Personas befragt — keine Aussage möglich.';
  } else if (repr < 0.6 && sampleBias > 0.15) {
    warning =
      'Einseitige Stichprobe: Sie haben überwiegend Zustimmungs-Milieus befragt. ' +
      'Die Prognose bestätigt vor allem Sie selbst — die echte Wirkung liegt darunter.';
  } else if (repr < 0.6 && sampleBias < -0.15) {
    warning =
      'Einseitige Stichprobe: überwiegend ablehnende Milieus befragt. ' +
      'Die Prognose ist pessimistischer als die echte Wirkung.';
  } else if (repr < 0.6) {
    warning = 'Stichprobe deckt nicht alle Milieus ab — Ergebnis mit Vorsicht lesen.';
  }

  return {
    appeal,
    reactions,
    predictedReception,
    trueReception,
    sampleBias,
    representativeness: repr,
    warning,
  };
}
