/**
 * Publikums-Modell (Track: Sendung & Publikum) — reine TypeScript-Logik, KEIN React.
 *
 * Bildet ab, wie eine ausgespielte Desinformations-Maßnahme („Effekt") beim Publikum wirkt:
 *   - Resonanz  = Treffer zwischen Effekt-Themen und den Vulnerabilitäten eines Segments.
 *   - Kanal     = ob der Effekt das Segment überhaupt erreicht (tv/print/social ↔ reachedBy).
 *   - Wirkung   = Resonanz × Intensität → Glaubens-/Stimmungs-Verschiebung + Reichweite (Quote).
 *
 * Bewusst LESBAR/deterministisch gehalten (Bildungs-/Inokulations-Zweck): gleiche Eingabe → gleiche
 * Reaktion, nachvollziehbar „Angst-Thema → verunsichert → anfälliger".
 *
 * Daten: ../data/audience.json · Konzept: docs/story-mode/BROADCAST_AND_AUDIENCE_CONCEPT.md
 */
import audienceData from '../data/audience.json';

export type Mood = 'ruhig' | 'verunsichert' | 'wuetend' | 'misstrauisch';
export type Channel = 'tv' | 'print' | 'social';

export interface AudienceSegment {
  id: string;
  label_de: string;
  milieu: string;
  demographics: { age: string; lean: string };
  /** IDs aus audience.json → meta.vulnerabilities */
  vulnerabilities: string[];
  /** Anteil an der Bevölkerung des Landes (0..1) */
  size: number;
  mood: Mood;
  /** Glaube an das operator-/gegnerische Narrativ (0..1) */
  belief: number;
  reachedBy: Channel[];
}

export interface AudienceCountry {
  id: string;
  label_de: string;
  allegory?: string;
  segments: AudienceSegment[];
}

/** Eine ausgespielte Maßnahme, wie sie das Publikum „sieht". */
export interface Effect {
  /** Themen-IDs (decken sich mit segment.vulnerabilities), z. B. ['energie_angst'] */
  themes: string[];
  channel: Channel;
  /** 0..1, Standard 0.5 */
  intensity?: number;
}

export interface SegmentReaction {
  segmentId: string;
  reached: boolean;
  /** 0..1: Anteil der Effekt-Themen, die eine Vulnerabilität treffen */
  resonance: number;
  /** 0..1: Resonanz × Intensität, nur wenn erreicht */
  effectiveness: number;
  /** 0..1: Anteil der Gesamtbevölkerung, der erreicht wird (mit Resonanz-Gewicht) */
  reach: number;
  beliefDelta: number;
  newBelief: number;
  newMood: Mood;
}

export interface CountryReaction {
  countryId: string;
  reactions: SegmentReaction[];
  /** Einschaltquote/Gesamtreichweite 0..1 */
  quote: number;
}

const clamp01 = (n: number): number => Math.max(0, Math.min(1, n));

/** Alle Länder (v1: nur Nordmark). */
export function loadAudience(): AudienceCountry[] {
  return audienceData.countries as unknown as AudienceCountry[];
}

export function getCountry(id: string): AudienceCountry | undefined {
  return loadAudience().find((c) => c.id === id);
}

/** Anteil der Effekt-Themen, die eine Vulnerabilität des Segments treffen (0..1). */
export function themeResonance(segment: AudienceSegment, themes: string[]): number {
  if (themes.length === 0) return 0;
  const hits = themes.filter((t) => segment.vulnerabilities.includes(t)).length;
  return hits / themes.length;
}

/**
 * Folge-Stimmung. v1 bewusst einfach (Intensitäts-Stufen).
 * TODO (Vertiefung): Thema unterscheiden (Wut- vs. Angst-Narrative → wuetend vs. verunsichert).
 */
function nextMood(current: Mood, effectiveness: number): Mood {
  if (effectiveness >= 0.66) return 'wuetend';
  if (effectiveness >= 0.33) return 'verunsichert';
  return current;
}

/** Reaktion eines Landes auf einen Effekt (pro Segment + Gesamt-Quote). */
export function reactToEffect(country: AudienceCountry, effect: Effect): CountryReaction {
  const intensity = clamp01(effect.intensity ?? 0.5);

  const reactions: SegmentReaction[] = country.segments.map((seg) => {
    const reached = seg.reachedBy.includes(effect.channel);
    const resonance = themeResonance(seg, effect.themes);
    const effectiveness = reached ? resonance * intensity : 0;
    // Auch wenig resonante Erreichte „sehen" es (Grundreichweite 0.3), Resonanz gewichtet den Rest.
    const reach = reached ? seg.size * (0.3 + 0.7 * resonance) : 0;
    const beliefDelta = effectiveness * 0.2;
    return {
      segmentId: seg.id,
      reached,
      resonance,
      effectiveness,
      reach,
      beliefDelta,
      newBelief: clamp01(seg.belief + beliefDelta),
      newMood: nextMood(seg.mood, effectiveness),
    };
  });

  const quote = clamp01(reactions.reduce((sum, r) => sum + r.reach, 0));
  return { countryId: country.id, reactions, quote };
}

/** Höheres Entdeckungs-Risiko dämpft die Wirkung (Faktenchecker/Gegen-Sendungen). risk: 0..100. */
export function detectionDampen(intensity: number, risk: number): number {
  const r = Math.max(0, Math.min(100, risk)) / 100;
  return clamp01(intensity * (1 - r * 0.6));
}
