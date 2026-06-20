/**
 * StoryDirector — der „dünne Dirigent" der Spine (BAUPLAN_STORY_DIRECTOR_SPINE.md).
 *
 * KEIN neues Inhaltssystem: eine reine, testbare Auswahl-Funktion, die am Phasenende
 * aus den schon existierenden Quellen (Krise / reife Episode / Berater-Stups) den
 * nächsten Beat kürt. Der Aufrufer (Slice 2) füllt `DirectorInputs` aus dem
 * Engine-Zustand; die einzige Unreinheit ist die injizierbare `rng` (Default
 * `Math.random`) für den gewichteten Zug aus Slice 3 — Tests reichen ein
 * deterministisches `rng` herein und bleiben damit reproduzierbar.
 *
 * Entscheidung ② (Bauplan): Dringlichkeit + Prise Abwechslung
 *   1. Krise akut?  -> Krisen-Beat   (Vorfahrt — wird NIE unterdrückt, nicht im Pool)
 *   2./3. sonst      -> gewichteter Zug aus dem Pool (reife Episoden + Berater-Stups)
 *
 * Slice 3 (Schicht 2, „Beat-Pool mit Gewichtung"): statt immer DEN Top-Beat zu nehmen,
 * zieht der Dirigent gewichtet aus einem Pool passender Beats. Gewicht steigt mit der
 * Dringlichkeit (autorierte Episode > Routine-Stups) und SINKT für den zuletzt
 * gesehenen Typ bzw. dieselbe Quelle („jüngst gesehener Typ ↓"). Folge: zwei ähnliche
 * Spielstände driften auseinander, und die Tagesabfolge nutzt sich nicht ab — die Kur
 * gegen „Tag 3,4,5 immer dasselbe", jetzt auch an Episoden-Tagen statt nur auf der
 * Stups-Ebene.
 */

export type BeatTyp = 'krise' | 'episode' | 'stups';

/** Minimaler Beat-Datentyp (Bauplan §„Das einzige wirklich Neue"). */
export interface Beat {
  id: string;
  typ: BeatTyp;
  /** Quelle (Krisen-/Episoden-/Stups-Id) — auch Schlüssel für die Anti-Wiederholung. */
  quelleId: string;
  /** Marinas Vorgriffszeile im Lagebericht + Aufhänger fürs Morgenbriefing. */
  vorgriffZeile_de: string;
  /** Optionaler Hook auf einen Fortschrittswert, den der Beat bewegt (Slice 2+). */
  fortschrittHook?: string;
}

/** Vom Aufrufer aus dem Engine-Zustand befüllt (reine Daten — testbar). */
export interface DirectorInputs {
  /** Akute Krise (CrisisMomentSystem) — hat immer Vorfahrt. */
  crisis?: { id: string; vorgriffZeile_de: string };
  /** JETZT reife, noch nicht laufende Episoden (getOfferableEpisodes). */
  ripeEpisodes?: { id: string; titel_de: string }[];
  /** Berater-/Ziel-Stupser (NPCAdvisorEngine), nach Priorität sortiert. */
  stupsCandidates?: { quelleId: string; vorgriffZeile_de: string }[];
}

/**
 * Gewichte für den Pool-Zug (Slice 3). Höher = wahrscheinlicher. „Dringlichkeit ↑":
 * der autorierte Episoden-Bogen wiegt schwerer als der Routine-Stups. Die Dämpfer
 * unterdrücken den zuletzt gesehenen Typ bzw. dieselbe Quelle, ohne sie ganz
 * auszuschließen — „bevorzugt etwas anderes", nicht „verbietet das Gleiche".
 */
const BASE_WEIGHT: Record<Exclude<BeatTyp, 'krise'>, number> = {
  episode: 6,
  stups: 2,
};
/** Multiplikator, wenn der Kandidat denselben Typ wie der letzte Beat hat. */
const DAMP_SAME_TYPE = 0.4;
/** Multiplikator, wenn der Kandidat dieselbe Quelle wie der letzte Beat hat (Slice-1-Erbe). */
const DAMP_SAME_SOURCE = 0.25;

interface PoolEntry {
  beat: Beat;
  weight: number;
}

function gewicht(typ: Exclude<BeatTyp, 'krise'>, quelleId: string, lastBeat?: Beat | null): number {
  let w = BASE_WEIGHT[typ];
  if (lastBeat) {
    if (lastBeat.typ === typ) w *= DAMP_SAME_TYPE;
    if (lastBeat.quelleId === quelleId) w *= DAMP_SAME_SOURCE;
  }
  return w;
}

function episodeBeat(ep: { id: string; titel_de: string }): Beat {
  return {
    id: `episode_${ep.id}`,
    typ: 'episode',
    quelleId: ep.id,
    vorgriffZeile_de: `Ein Strang reift heran: „${ep.titel_de}".`,
  };
}

function stupsBeat(s: { quelleId: string; vorgriffZeile_de: string }): Beat {
  return {
    id: `stups_${s.quelleId}`,
    typ: 'stups',
    quelleId: s.quelleId,
    vorgriffZeile_de: s.vorgriffZeile_de,
  };
}

function buildPool(inputs: DirectorInputs, lastBeat?: Beat | null): PoolEntry[] {
  const pool: PoolEntry[] = [];
  for (const ep of inputs.ripeEpisodes ?? []) {
    pool.push({ beat: episodeBeat(ep), weight: gewicht('episode', ep.id, lastBeat) });
  }
  for (const s of inputs.stupsCandidates ?? []) {
    pool.push({ beat: stupsBeat(s), weight: gewicht('stups', s.quelleId, lastBeat) });
  }
  return pool;
}

/**
 * Gewichteter Zug. Nach Gewicht ABSTEIGEND stabil sortiert: so kürt `rng()→0` den
 * schwersten Beat (= der alte „immer Top-Beat"-Determinismus als Randfall, praktisch
 * für Tests), während größere `rng`-Werte die leichteren, gedämpften Beats erreichen.
 */
function drawWeighted(pool: PoolEntry[], rng: () => number): Beat | null {
  if (pool.length === 0) return null;
  const ordered = [...pool].sort((a, b) => b.weight - a.weight);
  const total = ordered.reduce((sum, e) => sum + e.weight, 0);
  if (total <= 0) return ordered[0].beat;
  const threshold = rng() * total;
  let cumulative = 0;
  for (const entry of ordered) {
    cumulative += entry.weight;
    if (threshold < cumulative) return entry.beat;
  }
  return ordered[ordered.length - 1].beat; // Float-Sicherheit am oberen Rand
}

/**
 * Kürt den nächsten Beat. `lastBeat` (der zuletzt gesetzte) speist die
 * Anti-Wiederholung im Pool-Gewicht; `rng` (Default `Math.random`) den gewichteten
 * Zug. Gibt `null`, wenn nichts ansteht.
 */
export function pickNext(
  inputs: DirectorInputs,
  lastBeat?: Beat | null,
  rng: () => number = Math.random,
): Beat | null {
  // 1. Krise: Vorfahrt, nie unterdrückt — bewusst NICHT im gewichteten Pool.
  if (inputs.crisis) {
    return {
      id: `krise_${inputs.crisis.id}`,
      typ: 'krise',
      quelleId: inputs.crisis.id,
      vorgriffZeile_de: inputs.crisis.vorgriffZeile_de,
    };
  }

  // 2./3. Ruhiger oder episodenreifer Tag: gewichteter Zug aus dem Pool.
  return drawWeighted(buildPool(inputs, lastBeat), rng);
}
