/**
 * broadcastStore — persistenter Zustand der „Sendung & Publikum"-Schicht (Zustand/zustand).
 *
 * Hält eine veränderliche Arbeitskopie des Publikums (belief/mood entwickeln sich über die
 * Kampagne) und die zuletzt ausgestrahlte Sendung. Wird sowohl manuell (HUD-Button „Ausstrahlen")
 * als auch automatisch aus gespielten Aktionen (StoryModeGame → actionToEffect) gespeist.
 *
 * Entkoppelt von der großen Story-Engine: kein Eingriff in useStoryGameState/StoryEngineAdapter.
 */
import { create } from 'zustand';
import {
  loadAudience,
  reactToEffect,
  type AudienceCountry,
  type Channel,
  type CountryReaction,
  type Effect,
} from '../audience/audienceModel';

function freshCountries(): AudienceCountry[] {
  // Tiefe Kopie, damit belief/mood pro Spiel verändert werden können.
  return loadAudience().map((c) => ({
    ...c,
    segments: c.segments.map((s) => ({
      ...s,
      vulnerabilities: [...s.vulnerabilities],
      reachedBy: [...s.reachedBy],
      demographics: { ...s.demographics },
    })),
  }));
}

export interface AiredBroadcast {
  headline: string;
  source: string; // Aktionsname oder „Manuelle Sendung"
  channel: Channel;
  themes: string[];
  quote: number; // 0..1
}

interface BroadcastState {
  countries: AudienceCountry[];
  activeCountryId: string;
  lastAired: AiredBroadcast | null;
  setActiveCountry: (id: string) => void;
  /** Strahlt eine Sendung aus: persistiert belief/mood des aktiven Landes. */
  air: (effect: Effect, headline: string, source: string) => CountryReaction | null;
  /** Gegen-Sendung/Faktencheck: dämpft Glaube + beruhigt Stimmung (counter-Schicht). */
  counter: (strength: number) => void;
  reset: () => void;
}

export const useBroadcastStore = create<BroadcastState>((set, get) => ({
  countries: freshCountries(),
  activeCountryId: 'nordmark',
  lastAired: null,

  setActiveCountry: (id) => set({ activeCountryId: id }),

  air: (effect, headline, source) => {
    const { countries, activeCountryId } = get();
    const idx = countries.findIndex((c) => c.id === activeCountryId);
    if (idx < 0) return null;

    const country = countries[idx];
    const reaction = reactToEffect(country, effect);
    const byId = new Map(reaction.reactions.map((r) => [r.segmentId, r]));

    const updated: AudienceCountry = {
      ...country,
      segments: country.segments.map((s) => {
        const r = byId.get(s.id);
        return r ? { ...s, belief: r.newBelief, mood: r.newMood } : s;
      }),
    };

    const next = countries.slice();
    next[idx] = updated;
    set({
      countries: next,
      lastAired: { headline, source, channel: effect.channel, themes: effect.themes, quote: reaction.quote },
    });
    return reaction;
  },

  counter: (strength) => {
    const s = Math.max(0, Math.min(1, strength));
    set((state) => ({
      countries: state.countries.map((c) =>
        c.id !== state.activeCountryId
          ? c
          : {
              ...c,
              segments: c.segments.map((seg) => ({
                ...seg,
                belief: Math.max(0, seg.belief - 0.1 * s),
                mood: 0.1 * s > 0.04 && seg.mood !== 'ruhig' ? 'misstrauisch' : seg.mood,
              })),
            },
      ),
    }));
  },

  reset: () => set({ countries: freshCountries(), activeCountryId: 'nordmark', lastAired: null }),
}));
