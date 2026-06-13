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
import type { Channel } from '../audience/audienceModel';

export type BroadcastTier = 'klein' | 'mittel' | 'gross';

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
}

/** Tag → Kanal (erste Übereinstimmung gewinnt; Default: tv). */
const CHANNEL_BY_TAG: Array<[string[], Channel]> = [
  [['digital', 'automation', 'personas', 'persona', 'online', 'amplification', 'organic'], 'social'],
  [['academic', 'institutional', 'legitimacy', 'financial', 'expert', 'education'], 'print'],
];

/** Tag → Publikums-Themen (PROVISORISCH, s. Kopfkommentar). */
const THEMES_BY_TAG: Record<string, string[]> = {
  political: ['anti_establishment'],
  media: ['misstrauen_medien'],
  amplification: ['misstrauen_medien'],
  financial: ['wirtschafts_sorge'],
  funding: ['wirtschafts_sorge'],
  security: ['sicherheits_beduerfnis'],
  defense: ['sicherheits_beduerfnis'],
  division: ['anti_establishment', 'soziale_gerechtigkeit'],
  targeting: ['abstiegs_angst'],
  recruitment: ['anti_establishment'],
  espionage: ['misstrauen_medien'],
};

const DEFAULT_THEMES = ['misstrauen_medien'];

export function tierForIntensity(intensity: number): BroadcastTier {
  if (intensity >= 0.66) return 'gross';
  if (intensity >= 0.34) return 'mittel';
  return 'klein';
}

/**
 * Aktions-Ergebnis → Broadcast-Eintrag.
 * Intensität: Aufmerksamkeits-Kosten der Aktion (Hauptsignal) + Risiko-Anteil.
 */
export function mapActionToBroadcast(result: ActionResult, riskLevel: number): BroadcastItem {
  const tags = result.action.tags ?? [];

  let channel: Channel = 'tv';
  for (const [tagList, ch] of CHANNEL_BY_TAG) {
    if (tags.some((t) => tagList.includes(t))) {
      channel = ch;
      break;
    }
  }

  const themes = [...new Set(tags.flatMap((t) => THEMES_BY_TAG[t] ?? []))];
  const attention = result.action.costs?.attention ?? 0;
  const intensity = Math.max(
    0.15,
    Math.min(1, attention / 12 + (riskLevel / 100) * 0.3 + (result.success ? 0.25 : 0.1))
  );

  return {
    id: `${result.action.id}_${Date.now()}`,
    channel,
    themes: themes.length > 0 ? themes : DEFAULT_THEMES,
    intensity,
    headline: result.narrative?.headline_de || result.action.label_de,
    tier: tierForIntensity(intensity),
    kind: result.success ? 'eigen' : 'gegenreaktion',
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
