/**
 * Episoden-Loader (B1/P4) — lädt episodes.json und wertet Auslöser PURE aus.
 *
 * Episoden referenzieren nur per ID (Ziele/NPCs/Aktionen/Methoden) → eine Quelle der
 * Wahrheit (Konzept §3.2). Der Loader ist dünn + testbar; die Verfügbarkeit
 * (emergent-kuratiert, O1) ergibt sich aus den Auslöser-Bedingungen.
 */

import episodesData from '../data/episodes.json';
import type { SocietyValueKey } from '../../game-logic/StoryEngineAdapter';

export type AuftragArchetyp = 'keil' | 'wahl' | 'zweifel' | 'stillstand' | 'rueckzug';

/** Eine einzelne Auslöse-Bedingung (anyOf → eine genügt). */
export interface EpisodeTrigger {
  always?: boolean;
  worldEvent?: string;
  wert?: SocietyValueKey | 'vertrauen';
  op?: '>=' | '<=' | '>' | '<';
  v?: number;
}

export interface Episode {
  id: string;
  titel_de: string;
  schauplatz_de: string;
  lage_de: string;
  beteiligte: {
    ziel?: string | null;
    anbieter_npc?: string | null;
    stimmen_npc?: string[];
  };
  ausloeser?: { anyOf?: EpisodeTrigger[] };
  einklink_aktionen: string[];
  wendung_de: string;
  /** P4: NUR Gesellschaftswerte (balance-neutral). 'vertrauen' wird ab P5 gekoppelt. */
  wirkt_auf: Partial<Record<SocietyValueKey | 'vertrauen', number>>;
  lernmoment_id: string;
  auftrag?: AuftragArchetyp;
  freischaltung?: { unlocksRoom?: string | null; unlocksNpc?: string | null };
}

/** Kontext für die Auslöser-Prüfung. */
export interface EpisodeTriggerContext {
  values: Partial<Record<SocietyValueKey | 'vertrauen', number>>;
  recentWorldEventIds: string[];
}

let cache: Episode[] | null = null;

/** Alle Episoden (memoisiert). */
export function loadEpisodes(): Episode[] {
  if (cache === null) {
    cache = ((episodesData as { episodes: Episode[] }).episodes ?? []).slice();
  }
  return cache;
}

export function getEpisode(id: string): Episode | undefined {
  return loadEpisodes().find(e => e.id === id);
}

/** Wertet eine einzelne Bedingung aus. */
function evalTrigger(t: EpisodeTrigger, ctx: EpisodeTriggerContext): boolean {
  if (t.always) return true;
  if (t.worldEvent) return ctx.recentWorldEventIds.includes(t.worldEvent);
  if (t.wert && t.op && typeof t.v === 'number') {
    const current = ctx.values[t.wert];
    if (typeof current !== 'number') return false;
    switch (t.op) {
      case '>=': return current >= t.v;
      case '<=': return current <= t.v;
      case '>': return current > t.v;
      case '<': return current < t.v;
    }
  }
  return false;
}

/** Ist die Episode aktuell auslösbar? Ohne Auslöser = immer (Default/Tutorial). */
export function isEpisodeTriggered(ep: Episode, ctx: EpisodeTriggerContext): boolean {
  const conditions = ep.ausloeser?.anyOf;
  if (!conditions || conditions.length === 0) return true;
  return conditions.some(c => evalTrigger(c, ctx));
}

export function resetEpisodeLoader(): void {
  cache = null;
}
