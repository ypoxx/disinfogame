/**
 * FokusgruppeView — Vollbild-Fokusgruppen-Screen (Empathie-/Erkenntnisort, read-only).
 *
 * Zeigt 4–6 benannte Personas aus dem Publikum in einer Videokonferenz-Ansicht
 * (Einwegspiegel-Metapher). Keine Rückwirkung auf den Spielmechanismus.
 * Integration macht der Orchestrator (Props-getrieben, kein Hook auf Spiel-State).
 *
 * Hintergrund: room_analyse (Raumbild mit Einwegspiegel).
 * Animationen mit Präfix fg-, prefers-reduced-motion global abgedeckt.
 */

import { useEffect, useCallback, useState } from 'react';
import { useAssets } from '../assets/useAssets';
import { StoryModeColors } from '../theme';
import type { Mood } from '../audience/audienceModel';

// ─── Öffentliche Props ────────────────────────────────────────────────────────

export interface FokusgruppeSegmentInput {
  id: string;
  label_de: string;
  milieu?: string;
  mood: string;
  belief: number;
  vulnerabilities?: string[];
}

export interface FokusgruppeViewProps {
  segments: FokusgruppeSegmentInput[];
  /** Letzte ausgespielte Maßnahme (Broadcast-Headline), kann null sein. */
  lastHeadline: string | null;
  /** P6: laufende Episoden-Stränge — die Gruppe reagiert auch auf das „Warum". */
  episodeHints?: string[];
  onClose: () => void;
}

// ─── Stimmungs-Darstellung (wie BroadcastBar) ─────────────────────────────────

const MOOD_LABEL: Record<Mood, string> = {
  ruhig: 'ruhig',
  verunsichert: 'verunsichert',
  wuetend: 'wütend',
  misstrauisch: 'misstrauisch',
};

/** Hintergrundfarbe der Initialen-Kachel je Stimmung. */
const MOOD_COLOR: Record<Mood, string> = {
  ruhig: '#3a5a3a',
  verunsichert: '#5a4a20',
  wuetend: '#7a1a1a',
  misstrauisch: '#1a3a5a',
};

/** Randfarbe je Stimmung. */
const MOOD_BORDER: Record<Mood, string> = {
  ruhig: '#4a8a4a',
  verunsichert: '#c8960c',
  wuetend: StoryModeColors.danger,
  misstrauisch: '#3a7acc',
};

// ─── Persona-Tabelle (statisch, im Modul) ────────────────────────────────────

export interface Persona {
  name: string;
  alter: number;
  beruf: string;
  /** Verknüpftes Milieu-Segment */
  segmentId: string;
  /** Kurzsteckbrief */
  steckbrief: string;
  /** Je Stimmung ein Kommentar-Satz aus der Lebenswelt */
  kommentare: Record<Mood, string>;
}

/**
 * Statische Persona-Liste. Jede Person ist einem Segment zugeordnet.
 * Kommentare reflektieren die jeweilige Lebenswelt; „{headline}" wird
 * zur Laufzeit durch personaComment() mit der aktuellen Headline ersetzt.
 */
export const PERSONAS: Persona[] = [
  {
    name: 'Marlene',
    alter: 58,
    beruf: 'Sachbearbeiterin',
    segmentId: 'wu_besorgte_mitte',
    steckbrief: 'Zwei Kinder, Reihenhaus, liest morgens Zeitung – vertraut Institutionen, aber ihre Geduld schwindet.',
    kommentare: {
      ruhig: 'Man muss die Dinge ja im Blick behalten. Aber ich mach mir keine schlaflosen Nächte.',
      verunsichert: 'Das mit »{headline}« — davon hab ich im Bus gehört. Ich weiß nicht mehr, wem ich glauben soll.',
      wuetend: 'Ich bin so müde davon. Die sagen, was sie wollen, und wir schlucken es einfach.',
      misstrauisch: 'Hinter allem steckt was. Bei »{headline}« hab ich sofort gedacht: da stimmt was nicht.',
    },
  },
  {
    name: 'Kevin',
    alter: 24,
    beruf: 'Lagerist',
    segmentId: 'wu_zorniger',
    steckbrief: 'Schichtarbeit, wenig Freizeit, fühlt sich von der Politik vergessen – Informationen kommen über Smartphone.',
    kommentare: {
      ruhig: 'Lass die machen. Ich kümmere mich um meinen Scheiß.',
      verunsichert: '»{headline}« — klar, die lenken mal wieder ab. Aber was ist wirklich dran?',
      wuetend: 'Das reicht mir! »{headline}« — das ist doch alles gelogen! Wir werden alle verarscht.',
      misstrauisch: 'Ich glaub dem gar nichts mehr. Auch das hier mit »{headline}« ist bestimmt Ablenkung.',
    },
  },
  {
    name: 'Dr. Hofer',
    alter: 61,
    beruf: 'em. Dozent',
    segmentId: 'wu_liberale',
    steckbrief: 'Pensionierter Politikwissenschaftler, liest mehrere Quellen täglich, schätzt Differenzierung.',
    kommentare: {
      ruhig: 'Die Medienlage ist komplex, aber ich sehe keine unmittelbare Bedrohung der öffentlichen Vernunft.',
      verunsichert: 'Interessant — »{headline}« taucht jetzt überall auf. Da sollte man genauer hinschauen.',
      wuetend: 'Das ist Desinformation nach Lehrbuch! »{headline}« — ich erkenne das Muster sofort.',
      misstrauisch: 'Quellenvielfalt ist entscheidend. Bei »{headline}« frage ich mich, wer das wirklich streut.',
    },
  },
  {
    name: 'Sina',
    alter: 27,
    beruf: 'Grafikerin',
    segmentId: 'wu_bohemien',
    steckbrief: 'Freelancerin, lebt in der Stadt, misstraut Algorithmen und Mainstream-Medien gleichermaßen.',
    kommentare: {
      ruhig: 'Klar, alles eine große Inszenierung. Ich scroll da einfach drüber weg.',
      verunsichert: 'Ich weiß nicht — »{headline}« fühlt sich irgendwie orchestriert an. Sehr seltsam.',
      wuetend: 'Das ist so durchsichtig. »{headline}« — und alle fallen drauf rein!',
      misstrauisch: '»{headline}« — hm. Wer hat davon was? Ich folg da lieber Unabhängigen.',
    },
  },
  {
    name: 'Bernd',
    alter: 67,
    beruf: 'Rentner',
    segmentId: 'wu_eigenheimer',
    steckbrief: 'Früher Elektriker, Haus abbezahlt, hängt am Abend beim Fernsehen — früher war alles übersichtlicher.',
    kommentare: {
      ruhig: 'Ich schau Nachrichten, dann weiß ich, was Sache ist. Nicht alles ist so wild.',
      verunsichert: '»{headline}« — das hab ich gestern im Fernsehen gesehen. Früher wusste man noch, was stimmt.',
      wuetend: 'Das ist ein Skandal! »{headline}« — das wäre früher undenkbar gewesen!',
      misstrauisch: 'Ich vertrau dem nicht. Auch dieses »{headline}« — die sagen, was die sagen wollen.',
    },
  },
  {
    name: 'Aylin',
    alter: 34,
    beruf: 'Projektleiterin',
    segmentId: 'wu_optimiererin',
    steckbrief: 'Zwei Sprachen, viel unterwegs, optimiert alles — auch ihren Medienkonsum. Fakten vor Gefühl.',
    kommentare: {
      ruhig: 'Ich halte mich auf dem Laufenden, aber ohne mich zu beunruhigen. Sachlich bleiben.',
      verunsichert: '»{headline}« — ich hab das gecheckt, aber die Quellen widersprechen sich. Irritierend.',
      wuetend: 'Das läuft komplett aus dem Ruder. »{headline}« — wie kann man so etwas einfach verbreiten?',
      misstrauisch: 'Vorsicht ist angebracht. »{headline}« klingt nach gezielter Kampagne. Ich warte auf Belege.',
    },
  },
];

// ─── Exportierte Hilfsfunktionen (testbar) ────────────────────────────────────

/**
 * Gibt den Kommentar-Satz einer Persona für die aktuelle Stimmung zurück.
 * Falls eine Headline vorhanden ist, wird „{headline}" ersetzt.
 * Ungültige Stimmung → Fallback auf 'ruhig'.
 */
export function personaComment(
  persona: Persona,
  mood: string,
  headline: string | null,
): string {
  const validMoods: Mood[] = ['ruhig', 'verunsichert', 'wuetend', 'misstrauisch'];
  const safeMood: Mood = validMoods.includes(mood as Mood) ? (mood as Mood) : 'ruhig';
  const template = persona.kommentare[safeMood];
  if (!headline) {
    // Platzhalter durch allgemeinen Text ersetzen, wenn keine Headline
    return template.replace(/»\{headline\}«/g, '»die letzte Meldung«').replace(/\{headline\}/g, 'die Lage');
  }
  return template.replace(/\{headline\}/g, headline);
}

/**
 * Filtert PERSONAS nach vorhandenen Segment-IDs.
 * Reihenfolge folgt PERSONAS-Array.
 */
export function personasForSegments(segmentIds: string[]): Persona[] {
  const idSet = new Set(segmentIds);
  return PERSONAS.filter((p) => idSet.has(p.segmentId));
}

// ─── CSS-Keyframes (Präfix fg-) ───────────────────────────────────────────────

const KEYFRAMES = `
  @keyframes fg-tile-in {
    from { opacity: 0; transform: scale(0.92) translateY(10px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes fg-rec-blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.15; }
  }
  @keyframes fg-close-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(196,30,58,0); }
    50%       { box-shadow: 0 0 0 4px rgba(196,30,58,0.5); }
  }

  /* prefers-reduced-motion: alle fg-Bewegungs-Animationen abschalten */
  @media (prefers-reduced-motion: reduce) {
    [data-fg-tile] { animation: none !important; }
    [data-fg-rec]  { animation: none !important; }
  }
`;

// ─── Hilfsfunktion: Initialen aus Name ───────────────────────────────────────

function nameInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

// ─── Unter-Komponente: Videokachel ────────────────────────────────────────────

interface PersonaTileProps {
  persona: Persona;
  mood: Mood;
  comment: string;
  /** Gestaffelte Einblend-Verzögerung (ms). */
  delay: number;
}

function PersonaTile({ persona, mood, comment, delay }: PersonaTileProps): React.JSX.Element {
  const borderColor = MOOD_BORDER[mood];
  const bgColor = MOOD_COLOR[mood];

  return (
    <div
      data-fg-tile=""
      data-testid={`fg-tile-${persona.segmentId}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        border: `2px solid ${borderColor}`,
        backgroundColor: 'rgba(10,10,14,0.88)',
        boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.04)`,
        animation: `fg-tile-in 0.4s ease-out ${delay}ms both`,
        overflow: 'hidden',
        minWidth: 0,
      }}
    >
      {/* Kachel-Kopf: Porträt + Name/Beruf */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 10px',
          borderBottom: `1px solid rgba(60,60,60,0.6)`,
          backgroundColor: 'rgba(5,5,10,0.7)',
        }}
      >
        {/* Porträt-Platzhalter: Initiale in farbigem Quadrat */}
        <div
          style={{
            width: 40,
            height: 40,
            flexShrink: 0,
            backgroundColor: bgColor,
            border: `2px solid ${borderColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 15,
            fontWeight: 900,
            fontFamily: 'monospace',
            color: '#fff',
            imageRendering: 'pixelated',
          }}
          aria-hidden="true"
        >
          {nameInitials(persona.name)}
        </div>

        {/* Name + Alter/Beruf + Stimmung */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 900,
              fontFamily: 'monospace',
              color: StoryModeColors.textPrimary,
              letterSpacing: 0.5,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {persona.name}, {persona.alter}
          </div>
          <div
            style={{
              fontSize: 10,
              fontFamily: 'monospace',
              color: StoryModeColors.textMuted,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {persona.beruf}
          </div>
          {/* Stimmungs-Badge */}
          <div
            style={{
              display: 'inline-block',
              marginTop: 2,
              fontSize: 9,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: 1,
              color: borderColor,
              textTransform: 'uppercase' as const,
            }}
          >
            {MOOD_LABEL[mood]}
          </div>
        </div>
      </div>

      {/* Steckbrief (kursiv, gedämpft) */}
      <div
        style={{
          padding: '6px 10px',
          fontSize: 10,
          fontFamily: 'monospace',
          fontStyle: 'italic',
          color: StoryModeColors.textMuted,
          lineHeight: 1.4,
          borderBottom: `1px solid rgba(40,40,40,0.8)`,
        }}
      >
        {persona.steckbrief}
      </div>

      {/* Kommentar-Sprechblase */}
      <div
        style={{
          flex: 1,
          padding: '8px 10px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 6,
        }}
      >
        {/* Anführungszeichen-Dekoration */}
        <span
          style={{
            fontSize: 22,
            lineHeight: 1,
            color: borderColor,
            opacity: 0.7,
            fontFamily: 'serif',
            flexShrink: 0,
            marginTop: -2,
          }}
          aria-hidden="true"
        >
          "
        </span>
        <p
          style={{
            margin: 0,
            fontSize: 11,
            fontFamily: 'monospace',
            color: StoryModeColors.textPrimary,
            lineHeight: 1.5,
          }}
          data-testid={`fg-comment-${persona.segmentId}`}
        >
          {comment}
        </p>
      </div>
    </div>
  );
}

// ─── Haupt-Komponente ─────────────────────────────────────────────────────────

export function FokusgruppeView({
  segments,
  lastHeadline,
  episodeHints = [],
  onClose,
}: FokusgruppeViewProps): React.JSX.Element {
  const assets = useAssets();
  const bgUrl = assets.imageUrl('room_analyse');

  // Escape schließt die Ansicht
  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Sichtbare Personas: nur Segmente, die in props.segments vorkommen
  const segmentIds = segments.map((s) => s.id);
  const visiblePersonas = personasForSegments(segmentIds);

  // Segment-Lookup für Stimmung
  const segmentByIdMap = new Map(segments.map((s) => [s.id, s]));

  // REC-Blinker (Simulation laufende Aufnahme)
  const [recVisible, setRecVisible] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setRecVisible((v) => !v), 800);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Fokusgruppe Westunion"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'monospace',
        backgroundColor: '#0d0d0d',
        overflow: 'hidden',
      }}
    >
      {/* Globale Keyframes */}
      <style>{KEYFRAMES}</style>

      {/* ── Hintergrund: room_analyse (Einwegspiegel-Raum) ─────────────────── */}
      {bgUrl ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${bgUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            imageRendering: 'pixelated',
          }}
        >
          {/* Dunkel-Overlay für UI-Lesbarkeit */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.78) 100%)',
            }}
          />
        </div>
      ) : (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: '#080b10' }} />
      )}

      {/* ── Scanline-Overlay (dezent, Monitor-Look) ────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          background:
            'repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)',
        }}
      />

      {/* ── Kopfzeile ─────────────────────────────────────────────────────── */}
      <header
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 16px',
          backgroundColor: 'rgba(10,10,10,0.90)',
          borderBottom: `3px solid ${StoryModeColors.ministryRed}`,
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* REC-Indikator */}
          <span
            data-fg-rec=""
            style={{
              fontSize: 11,
              fontWeight: 900,
              fontFamily: 'monospace',
              color: StoryModeColors.danger,
              letterSpacing: 1,
              animation: 'fg-rec-blink 1.2s ease-in-out infinite',
              opacity: recVisible ? 1 : 0.15,
            }}
            aria-hidden="true"
          >
            REC ●
          </span>

          <span
            style={{
              fontSize: 13,
              fontWeight: 900,
              letterSpacing: 3,
              color: StoryModeColors.textPrimary,
            }}
          >
            FOKUSGRUPPE
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 400,
              letterSpacing: 2,
              color: StoryModeColors.textMuted,
            }}
          >
            — WESTUNION
          </span>

          {/* Letzte Headline als Kontext-Badge */}
          {lastHeadline && (
            <span
              style={{
                fontSize: 10,
                fontFamily: 'monospace',
                color: StoryModeColors.warning,
                backgroundColor: 'rgba(40,30,5,0.7)',
                border: `1px solid ${StoryModeColors.warning}`,
                padding: '1px 8px',
                letterSpacing: 0.5,
                maxWidth: 320,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={`Letzte Maßnahme: ${lastHeadline}`}
            >
              ⬢ {lastHeadline}
            </span>
          )}
          {/* P6: laufende Episoden-Stränge — die Gruppe reagiert auf das „Warum". */}
          {episodeHints.length > 0 && (
            <span
              style={{
                fontSize: 10,
                fontFamily: 'monospace',
                color: StoryModeColors.agencyBlue,
                backgroundColor: 'rgba(5,20,40,0.7)',
                border: `1px solid ${StoryModeColors.agencyBlue}`,
                padding: '1px 8px',
                letterSpacing: 0.5,
                maxWidth: 320,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={`Laufende Episoden: ${episodeHints.join(' · ')}`}
            >
              ★ {episodeHints.join(' · ')}
            </span>
          )}
        </div>

        {/* Schließen-Button ✕ (Escape) */}
        <button
          onClick={onClose}
          aria-label="Fokusgruppe schliessen"
          style={{
            background: 'none',
            border: `2px solid ${StoryModeColors.ministryRed}`,
            color: StoryModeColors.textPrimary,
            fontSize: 16,
            fontFamily: 'monospace',
            fontWeight: 900,
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            animation: 'fg-close-pulse 2.5s ease-in-out infinite',
          }}
        >
          ✕
        </button>
      </header>

      {/* ── Haupt-Bereich: Videokachel-Raster ─────────────────────────────── */}
      <main
        style={{
          position: 'relative',
          zIndex: 10,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 24px 20px',
          gap: 12,
          overflow: 'hidden',
        }}
      >
        {visiblePersonas.length === 0 ? (
          /* Leerstand: noch keine passenden Segmente */
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: StoryModeColors.textMuted,
              fontSize: 13,
              fontFamily: 'monospace',
              letterSpacing: 1,
            }}
          >
            Keine Teilnehmer verfügbar
          </div>
        ) : (
          /* Kachel-Raster: 2–3 Spalten je nach Anzahl */
          <div
            style={{
              flex: 1,
              display: 'grid',
              gridTemplateColumns: `repeat(${visiblePersonas.length <= 2 ? 2 : 3}, 1fr)`,
              gap: 12,
              overflow: 'hidden',
            }}
          >
            {visiblePersonas.map((persona, idx) => {
              const seg = segmentByIdMap.get(persona.segmentId);
              // Stimmung aus Segment, Fallback 'ruhig'
              const moodRaw = seg?.mood ?? 'ruhig';
              const validMoods: Mood[] = ['ruhig', 'verunsichert', 'wuetend', 'misstrauisch'];
              const mood: Mood = validMoods.includes(moodRaw as Mood)
                ? (moodRaw as Mood)
                : 'ruhig';
              const comment = personaComment(persona, mood, lastHeadline);

              return (
                <PersonaTile
                  key={persona.segmentId}
                  persona={persona}
                  mood={mood}
                  comment={comment}
                  delay={idx * 80} // gestaffelte Einblend-Animation
                />
              );
            })}
          </div>
        )}

        {/* Fußzeile: Empathie-Hinweis (read-only) */}
        <div
          style={{
            textAlign: 'center',
            fontSize: 9,
            fontFamily: 'monospace',
            color: StoryModeColors.textMuted,
            letterSpacing: 1,
            flexShrink: 0,
          }}
        >
          BEOBACHTUNG — KEINE DIREKTIVE — ESC ZUM SCHLIESSEN
        </div>
      </main>
    </div>
  );
}

export default FokusgruppeView;
