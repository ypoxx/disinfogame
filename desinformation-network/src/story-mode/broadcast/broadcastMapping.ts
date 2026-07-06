/**
 * broadcastMapping — PROVISORISCHE Brücke zwischen Spiel-Aktionen und Publikums-Modell.
 *
 * Die Aktions-Tags sind operativ (infrastructure, recruitment, …), die
 * Publikums-Themen soziologisch (energie_angst, misstrauen_medien, …) — eine
 * inhaltlich saubere Zuordnung braucht das breitere „Ministerium sendet"-Konzept
 * (Schlagzeilen, Talkshows mit Agenten, Zeitungen) und eine Owner-Diskussion.
 * Festgehalten in docs/story-mode/MINISTRY_BROADCAST_CONCEPT.md — diese Tabelle
 * ist bewusst klein, sichtbar und leicht austauschbar (reine Anzeige-Schicht,
 * KEINE Rückwirkung auf die Spielmechanik).
 */
import type { ActionResult } from '../../game-logic/StoryEngineAdapter';
import type { Channel, Mood } from '../audience/audienceModel';
import { kanalFuerTags, themenFuerTags } from '../engine/MaschenGedaechtnis';
import {
  motifForCategory,
  motifForMeasure,
  type BroadcastCategory,
  type BroadcastMotifId,
  type BroadcastTier,
} from './broadcastMotifs';

// BroadcastTier + BroadcastCategory leben jetzt in broadcastMotifs (die Motiv-Tabelle
// ist die untere Schicht) — hier re-exportiert, damit bestehende Importe tragen.
export type { BroadcastTier, BroadcastCategory } from './broadcastMotifs';

export interface BroadcastItem {
  id: string;
  /** Über welchen Kanal die Maßnahme „läuft" (bestimmt TV- vs. Zeitungs-Rahmen). */
  channel: Channel;
  /** Publikums-Themen (Vokabular aus audience.json meta.vulnerabilities). */
  themes: string[];
  /** 0..1 — speist reactToEffect und die Klein/Mittel/Groß-Einstufung. */
  intensity: number;
  headline: string;
  tier: BroadcastTier;
  /** Eigene Maßnahme oder Gegenreaktion (gescheiterte Aktion = öffentlicher Rückschlag). */
  kind: 'eigen' | 'gegenreaktion';
  /** Ereignis-Klasse (Konzept §3/§4) — bestimmt zusammen mit Kanal/Tier/Masche das Motiv. */
  category: BroadcastCategory;
  /** Das Pixel-Art-Motiv im Fernseher (Owner 2026-07-06, §7): jedes Ereignis ein eigenes Bild. */
  motifId: BroadcastMotifId;
}

// Etappe 4: Die Tag→Kanal/Themen-Tabellen sind in die Engine gezogen
// (`engine/MaschenGedaechtnis.ts`) — das Maschen-Gedächtnis bestimmt damit dieselben
// Ziel-Milieus, die die Anzeige zeigt (E16: Publikum wirkt mechanisch zurück).

export function tierForIntensity(intensity: number): BroadcastTier {
  if (intensity >= 0.66) return 'gross';
  if (intensity >= 0.34) return 'mittel';
  return 'klein';
}

/**
 * Aktions-Ergebnis → Broadcast-Eintrag.
 * Intensität: Aufmerksamkeits-Kosten der Aktion (Hauptsignal) + Risiko-Anteil.
 * `episodeTitle` (P6): gehört die Aktion zu einem aktiven Episoden-Strang, wird der
 * Broadcast „eine Geschichte mit Namen" (Konzept §7) statt nur einer Aktionszeile.
 */
export function mapActionToBroadcast(result: ActionResult, riskLevel: number, episodeTitle?: string | null): BroadcastItem {
  const tags = result.action.tags ?? [];
  const channel: Channel = kanalFuerTags(tags);
  const themes = themenFuerTags(tags);
  const attention = result.action.costs?.attention ?? 0;
  const intensity = Math.max(
    0.15,
    Math.min(1, attention / 12 + (riskLevel / 100) * 0.3 + (result.success ? 0.25 : 0.1))
  );

  // B5: plakative Aktions-Überschrift NUR bei Erfolg; bei Misserfolg/Gegenreaktion die
  // narrative Überschrift (Fehler-/Rückschlag-Text wie „Nicht genug Ressourcen"), Codex-Review #80.
  const baseHeadline = (result.success && result.action.headline_de) || result.narrative?.headline_de || result.action.label_de;
  const tier = tierForIntensity(intensity);
  // Owner 2026-07-06 (§7): jedes Ereignis ein eigenes Motiv. Erfolg = Maßnahme-Motiv
  // (je Kanal/Masche/Tier); Misserfolg = öffentlicher Rückschlag (Gegenwind).
  const category: BroadcastCategory = result.success ? 'massnahme' : 'gegenreaktion';
  const motifId = result.success ? motifForMeasure(channel, tier, tags) : motifForCategory('gegenreaktion');
  return {
    id: `${result.action.id}_${Date.now()}`,
    channel,
    themes,
    intensity,
    headline: episodeTitle ? `${episodeTitle}: ${baseHeadline}` : baseHeadline,
    tier,
    kind: result.success ? 'eigen' : 'gegenreaktion',
    category,
    motifId,
  };
}

/**
 * Erzählerische Sendung (kein Aktions-Ergebnis) → Broadcast-Eintrag: Faktencheck der
 * Gegenseite, Krise/Sondersendung, Enttarnung, Wahlabend, Wochenschau. Der Owner-Ausbau
 * (§7) verlangt auch für diese Ereignisse ein eigenes Motiv statt einer Textzeile.
 *
 * Kein `reactToEffect` hier: diese Sendungen sind Rahmen/Kontext, keine gezielte
 * Botschaft an ein Milieu — die Stimmungs-Färbung setzt der Hook separat (Krise →
 * verunsichert, Enttarnung → misstrauisch), damit die reine Anzeige-Trennung bleibt.
 */
export function broadcastForEvent(input: {
  key: string;
  category: Exclude<BroadcastCategory, 'massnahme'>;
  headline: string;
  channel?: Channel;
  themes?: string[];
  tier?: BroadcastTier;
}): BroadcastItem {
  const tier = input.tier ?? (input.category === 'krise' || input.category === 'enttarnung' ? 'gross' : 'mittel');
  return {
    id: `${input.category}_${input.key}`,
    channel: input.channel ?? 'tv',
    themes: input.themes ?? [],
    intensity: tier === 'gross' ? 0.85 : 0.5,
    headline: input.headline,
    tier,
    // Gegenreaktion/Faktencheck/Enttarnung sind Gegenwind; Krise/Wahltag/Wochenschau neutral.
    kind:
      input.category === 'gegenreaktion' || input.category === 'faktencheck' || input.category === 'enttarnung'
        ? 'gegenreaktion'
        : 'eigen',
    category: input.category,
    motifId: motifForCategory(input.category),
  };
}

/** Wochenschau am Phasen-Ende (Konzept §3): Zusammenschau der Sendungen der Runde. */
export function broadcastForWochenschau(phase: number, sendungen: number): BroadcastItem {
  return {
    id: `wochenschau_p${phase}`,
    channel: 'tv',
    themes: [],
    intensity: 0.5,
    headline:
      sendungen === 1 ? 'Wochenschau: 1 Sendung diese Runde' : `Wochenschau: ${sendungen} Sendungen diese Runde`,
    tier: 'mittel',
    kind: 'eigen',
    category: 'wochenschau',
    motifId: motifForCategory('wochenschau'),
  };
}

/**
 * Publikums-Segment → Figuren-Archetyp (Sprite audience_<id>).
 * Visuelle Kurzschrift fürs Wohnzimmer — bewusst grob, s. Konzept-Doc.
 */
export const FIGURE_BY_SEGMENT: Record<string, string> = {
  wu_optimiererin: 'audience_optimiererin',
  wu_macher: 'audience_macher',
  wu_bohemien: 'audience_bohemien',
  wu_besorgte_mitte: 'audience_besorgte_mitte',
  wu_zorniger: 'audience_zorniger',
  wu_idealistin: 'audience_idealistin',
  wu_eigenheimer: 'audience_eigenheimer',
  wu_liberale: 'audience_liberale',
};

// ── Wohnzimmer-Alphabet (Zielbild §6, Etappe 4 Paket D) ───────────────────────
// Feste Bildsprache fürs Wohnzimmer: jedes Badge bedeutet IMMER dasselbe. Zwei
// Quellen speisen es — das Maschen-Gedächtnis (`getWohnzimmerAlphabet()`: zeitung/
// abwinken) und die Tages-Stimmung/Überzeugung des Publikums (Anzeige-Schicht,
// keine Rückwirkung). Reine Funktion, damit die Priorität pur testbar ist.

export type WohnzimmerBadge = 'fahne' | 'zeitung' | 'abwinken' | 'streit' | 'einsam';

/** Ab dieser Überzeugung gilt das Milieu als gekippt (Parteifahne im Fenster). */
export const FAHNE_BELIEF_SCHWELLE = 0.75;

export interface WohnzimmerBadgeInput {
  /** Gedächtnis-Bild aus `engine.getWohnzimmerAlphabet()` — null, wenn keins greift. */
  bild: 'zeitung' | 'abwinken' | null;
  /** Klartext-Grund aus dem Gedächtnis (Tooltip), falls `bild` gesetzt ist. */
  grund_de: string;
  mood: Mood;
  belief: number;
}

export interface WohnzimmerBadgeResult {
  badge: WohnzimmerBadge | null;
  /** Klartext-Tooltip (Alt-Text statt Emoji/Zahl). */
  title_de: string;
}

/**
 * Priorität bei Konflikt (Owner-Vorgabe, Zielbild §6): fahne > zeitung > abwinken >
 * streit > einsam. Das gekippte Milieu sticht jede andere Regung; das
 * Maschen-Gedächtnis (Impfung/Abstumpfung) sticht die bloße Tages-Stimmung.
 */
export function wohnzimmerBadgeFor(input: WohnzimmerBadgeInput): WohnzimmerBadgeResult {
  if (input.belief >= FAHNE_BELIEF_SCHWELLE) {
    return { badge: 'fahne', title_de: 'Resonanzgruppe gekippt — Parteifahne im Fenster.' };
  }
  if (input.bild === 'zeitung') {
    return { badge: 'zeitung', title_de: input.grund_de };
  }
  if (input.bild === 'abwinken') {
    return { badge: 'abwinken', title_de: input.grund_de };
  }
  if (input.mood === 'wuetend') {
    return { badge: 'streit', title_de: 'Küchen-Streit — polarisiert/aktiviert.' };
  }
  if (input.mood === 'misstrauisch') {
    return { badge: 'einsam', title_de: 'Einsam am Videospiel — demobilisiert.' };
  }
  return { badge: null, title_de: '' };
}
