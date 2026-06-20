/**
 * StoryDirector — der „dünne Dirigent" der Spine (BAUPLAN_STORY_DIRECTOR_SPINE.md).
 *
 * KEIN neues Inhaltssystem: eine reine, testbare Auswahl-Funktion, die am Phasenende
 * aus den schon existierenden Quellen (Krise / reife Episode / Berater-Stups) DEN EINEN
 * nächsten Beat kürt. Pure TS — kein React, kein Math.random, kein Engine-Zugriff;
 * der Aufrufer (Slice 2) füllt `DirectorInputs` aus dem Engine-Zustand.
 *
 * Entscheidung ② (Bauplan): Dringlichkeit + Prise Abwechslung
 *   1. Krise akut?  -> Krisen-Beat   (Vorfahrt — wird NIE unterdrückt)
 *   2. Episode reif? -> Episoden-Beat (autorierter Bogen)
 *   3. sonst         -> Berater-/Ziel-Stups, aber bewusst eine ANDERE Quelle als
 *                       zuletzt (Anti-Wiederholung gegen „Tag 3,4,5 immer dasselbe").
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
  /** Eine JETZT reife, noch nicht laufende Episode (getOfferableEpisodes). */
  ripeEpisode?: { id: string; titel_de: string };
  /** Berater-/Ziel-Stupser (NPCAdvisorEngine), nach Priorität sortiert. */
  stupsCandidates?: { quelleId: string; vorgriffZeile_de: string }[];
}

/**
 * Kürt den nächsten Beat. `lastBeat` (der zuletzt gesetzte) speist die
 * Anti-Wiederholung auf ruhigen Tagen. Gibt `null`, wenn nichts ansteht.
 */
export function pickNext(inputs: DirectorInputs, lastBeat?: Beat | null): Beat | null {
  // 1. Krise: Vorfahrt, nie unterdrückt.
  if (inputs.crisis) {
    return {
      id: `krise_${inputs.crisis.id}`,
      typ: 'krise',
      quelleId: inputs.crisis.id,
      vorgriffZeile_de: inputs.crisis.vorgriffZeile_de,
    };
  }

  // 2. Reife Episode: autorierter Bogen.
  if (inputs.ripeEpisode) {
    return {
      id: `episode_${inputs.ripeEpisode.id}`,
      typ: 'episode',
      quelleId: inputs.ripeEpisode.id,
      vorgriffZeile_de: `Ein Strang reift heran: „${inputs.ripeEpisode.titel_de}".`,
    };
  }

  // 3. Ruhiger Tag: Stups — bevorzugt eine ANDERE Quelle als zuletzt (Anti-Wiederholung).
  const candidates = inputs.stupsCandidates ?? [];
  if (candidates.length > 0) {
    const fresh = candidates.find((c) => c.quelleId !== lastBeat?.quelleId);
    const pick = fresh ?? candidates[0];
    return {
      id: `stups_${pick.quelleId}`,
      typ: 'stups',
      quelleId: pick.quelleId,
      vorgriffZeile_de: pick.vorgriffZeile_de,
    };
  }

  return null;
}
