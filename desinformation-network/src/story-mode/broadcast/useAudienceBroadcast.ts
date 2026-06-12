/**
 * useAudienceBroadcast — hält den Anzeige-Zustand des Publikums (Westunion-Land
 * „Nordmark") und lässt es auf ausgeführte Aktionen reagieren.
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
} from '../audience/audienceModel';
import { mapActionToBroadcast, type BroadcastItem } from './broadcastMapping';
import type { ActionResult } from '../../game-logic/StoryEngineAdapter';

export interface AudienceBroadcastState {
  country: AudienceCountry;
  lastItem: BroadcastItem | null;
  lastReaction: CountryReaction | null;
  history: BroadcastItem[];
}

const DECAY_RATE_PER_PHASE = 0.12;
const HISTORY_LIMIT = 5;

function cloneCountry(): AudienceCountry {
  const source = getCountry('nordmark');
  if (!source) throw new Error('audience.json: Land "nordmark" fehlt');
  return JSON.parse(JSON.stringify(source)) as AudienceCountry;
}

export function useAudienceBroadcast(
  lastActionResult: ActionResult | null,
  phaseNumber: number,
  riskLevel: number
): AudienceBroadcastState {
  const [country, setCountry] = useState<AudienceCountry>(cloneCountry);
  const [lastItem, setLastItem] = useState<BroadcastItem | null>(null);
  const [lastReaction, setLastReaction] = useState<CountryReaction | null>(null);
  const [history, setHistory] = useState<BroadcastItem[]>([]);
  const seenResult = useRef<ActionResult | null>(null);

  // Neue Aktion → Sendung + Publikums-Reaktion (newBelief/newMood übernehmen).
  useEffect(() => {
    if (!lastActionResult || lastActionResult === seenResult.current) return;
    seenResult.current = lastActionResult;
    const item = mapActionToBroadcast(lastActionResult, riskLevel);
    setLastItem(item);
    setHistory((h) => [item, ...h].slice(0, HISTORY_LIMIT));
    setCountry((c) => {
      const reaction = reactToEffect(c, {
        themes: item.themes,
        channel: item.channel,
        intensity: item.intensity,
      });
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
