/**
 * useAudienceBroadcast — hält den Anzeige-Zustand des Publikums (Westunion-Land
 * „Westunion") und lässt es auf ausgeführte Aktionen reagieren.
 *
 * Reine Anzeige-Schicht über audienceModel (Leitprinzip aus
 * BROADCAST_AND_AUDIENCE_CONCEPT.md §1): keinerlei Rückwirkung auf die
 * Spielmechanik. Phasenwechsel lässt Stimmung/Überzeugung abklingen (Decay).
 */
import { useEffect, useRef, useState } from 'react';
import {
  getCountry,
  reactToEffect,
  decaySegment,
  type AudienceCountry,
  type CountryReaction,
  type SocietyMood,
} from '../audience/audienceModel';
import { broadcastForEvent, broadcastForWochenschau, mapActionToBroadcast, type BroadcastItem } from './broadcastMapping';
import type { Channel, Mood } from '../audience/audienceModel';
import type { ActionResult } from '../../game-logic/StoryEngineAdapter';
import type { Episode } from '../engine/EpisodeLoader';

export interface AudienceBroadcastState {
  country: AudienceCountry;
  lastItem: BroadcastItem | null;
  lastReaction: CountryReaction | null;
  history: BroadcastItem[];
}

/** P6: Episoden-Kontext + Gesellschafts-Vektor fürs Publikum (Anzeige, keine Rückwirkung). */
export interface BroadcastContext {
  activeEpisodes?: Episode[];
  society?: SocietyMood;
}

/**
 * Erzählerisches Ereignis fürs Fernsehen (Owner 2026-07-06, §7): Faktencheck der
 * Gegenseite, Krise/Sondersendung, Enttarnung, Wahlabend. Kommt NICHT aus einem
 * Aktions-Ergebnis, bekommt aber ein eigenes Motiv. `key` identifiziert das Ereignis
 * (Wechsel = neue Sendung); gleicher key sendet nicht doppelt.
 */
export interface BroadcastNarrativeEvent {
  key: string;
  category: 'faktencheck' | 'krise' | 'enttarnung' | 'wahltag';
  headline: string;
  channel?: Channel;
  themes?: string[];
}

/** Display-only Stimmungs-Nudge je Ereignis (§4 „Segment wird misstrauisch/blau"). */
const EVENT_MOOD: Partial<Record<BroadcastNarrativeEvent['category'], Mood>> = {
  faktencheck: 'misstrauisch',
  enttarnung: 'misstrauisch',
  krise: 'verunsichert',
};

const DECAY_RATE_PER_PHASE = 0.12;
const HISTORY_LIMIT = 5;

function cloneCountry(): AudienceCountry {
  const source = getCountry('westunion');
  if (!source) throw new Error('audience.json: Land "westunion" fehlt');
  return JSON.parse(JSON.stringify(source)) as AudienceCountry;
}

export function useAudienceBroadcast(
  lastActionResult: ActionResult | null,
  phaseNumber: number,
  riskLevel: number,
  context?: BroadcastContext,
  narrativeEvent?: BroadcastNarrativeEvent | null
): AudienceBroadcastState {
  const [country, setCountry] = useState<AudienceCountry>(cloneCountry);
  const [lastItem, setLastItem] = useState<BroadcastItem | null>(null);
  const [lastReaction, setLastReaction] = useState<CountryReaction | null>(null);
  const [history, setHistory] = useState<BroadcastItem[]>([]);
  const seenResult = useRef<ActionResult | null>(null);
  const seenEventKey = useRef<string | null>(null);
  // Zahl der eigenen Sendungen seit dem letzten Phasenwechsel → Wochenschau-Auslöser.
  const measuresSincePhase = useRef(0);
  // Aktuellen Kontext in einem Ref halten → kein erneuter Effekt-Lauf bei Werte-Änderung
  // (das Publikum reagiert nur auf NEUE Aktionen, nicht auf jeden Werte-Tick).
  const contextRef = useRef<BroadcastContext | undefined>(context);
  contextRef.current = context;

  // Neue Aktion → Sendung + Publikums-Reaktion (newBelief/newMood übernehmen).
  useEffect(() => {
    if (!lastActionResult || lastActionResult === seenResult.current) return;
    seenResult.current = lastActionResult;
    const ctx = contextRef.current;
    // P6: gehört die Aktion zu einem aktiven Episoden-Strang? → Broadcast bekommt den Titel.
    const episode = ctx?.activeEpisodes?.find((e) => e.einklink_aktionen.includes(lastActionResult.action.id));
    const item = mapActionToBroadcast(lastActionResult, riskLevel, episode?.titel_de ?? null);
    if (item.kind === 'eigen') measuresSincePhase.current += 1;
    setLastItem(item);
    setHistory((h) => [item, ...h].slice(0, HISTORY_LIMIT));
    setCountry((c) => {
      const reaction = reactToEffect(c, {
        themes: item.themes,
        channel: item.channel,
        intensity: item.intensity,
      }, ctx?.society);
      setLastReaction(reaction);
      const bySegment = new Map(reaction.reactions.map((r) => [r.segmentId, r]));
      return {
        ...c,
        segments: c.segments.map((s) => {
          const r = bySegment.get(s.id);
          return r ? { ...s, belief: r.newBelief, mood: r.newMood } : s;
        }),
      };
    });
  }, [lastActionResult, riskLevel]);

  // Phasenwechsel → Wochenschau (wenn diese Runde gesendet wurde) + Abklingen.
  const lastPhase = useRef(phaseNumber);
  useEffect(() => {
    if (phaseNumber === lastPhase.current) return;
    lastPhase.current = phaseNumber;
    // Wochenschau (Konzept §3): Zusammenschau der Phase als eigene „Sendung" mit Motiv,
    // aber nur, wenn überhaupt etwas lief (kein Leer-Trailer).
    if (measuresSincePhase.current > 0) {
      const item = broadcastForWochenschau(phaseNumber, measuresSincePhase.current);
      setLastItem(item);
      setLastReaction(null);
      setHistory((h) => [item, ...h].slice(0, HISTORY_LIMIT));
    }
    measuresSincePhase.current = 0;
    setCountry((c) => ({
      ...c,
      segments: c.segments.map((s) => {
        const d = decaySegment(s.belief, s.mood, DECAY_RATE_PER_PHASE);
        return { ...s, belief: d.belief, mood: d.mood };
      }),
    }));
  }, [phaseNumber]);

  // Erzählerisches Ereignis (Krise/Enttarnung/Faktencheck/Wahltag) → eigene Sendung
  // mit eigenem Motiv (§7). Keine gezielte Botschaft → kein reactToEffect; nur ein
  // display-seitiger Stimmungs-Nudge der überzeugten Segmente (§4-Wirkungs-Treppe).
  // BEWUSST als LETZTER Effekt: fällt ein Ereignis mit einem Phasenwechsel zusammen,
  // sticht das Ereignis (Krise/Enttarnung) die routinemäßige Wochenschau (letztes
  // setLastItem gewinnt).
  useEffect(() => {
    if (!narrativeEvent || narrativeEvent.key === seenEventKey.current) return;
    seenEventKey.current = narrativeEvent.key;
    const item = broadcastForEvent(narrativeEvent);
    setLastItem(item);
    setLastReaction(null);
    setHistory((h) => [item, ...h].slice(0, HISTORY_LIMIT));
    const nudge = EVENT_MOOD[narrativeEvent.category];
    if (nudge) {
      setCountry((c) => ({
        ...c,
        // Nur die (noch) überzeugten Milieus werden nachdenklich — kein globaler Reset.
        segments: c.segments.map((s) => (s.belief > 0.45 ? { ...s, mood: nudge } : s)),
      }));
    }
  }, [narrativeEvent]);

  return { country, lastItem, lastReaction, history };
}
