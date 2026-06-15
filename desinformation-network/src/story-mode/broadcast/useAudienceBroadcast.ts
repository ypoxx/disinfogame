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
import { mapActionToBroadcast, type BroadcastItem } from './broadcastMapping';
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
  context?: BroadcastContext
): AudienceBroadcastState {
  const [country, setCountry] = useState<AudienceCountry>(cloneCountry);
  const [lastItem, setLastItem] = useState<BroadcastItem | null>(null);
  const [lastReaction, setLastReaction] = useState<CountryReaction | null>(null);
  const [history, setHistory] = useState<BroadcastItem[]>([]);
  const seenResult = useRef<ActionResult | null>(null);
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

  // Phasenwechsel → Abklingen Richtung Grundlinie.
  const lastPhase = useRef(phaseNumber);
  useEffect(() => {
    if (phaseNumber === lastPhase.current) return;
    lastPhase.current = phaseNumber;
    setCountry((c) => ({
      ...c,
      segments: c.segments.map((s) => {
        const d = decaySegment(s.belief, s.mood, DECAY_RATE_PER_PHASE);
        return { ...s, belief: d.belief, mood: d.mood };
      }),
    }));
  }, [phaseNumber]);

  return { country, lastItem, lastReaction, history };
}
