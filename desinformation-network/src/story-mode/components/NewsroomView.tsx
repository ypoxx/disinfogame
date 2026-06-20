/**
 * NewsroomView — Vollbild-Newsroom-Screen (Etage 3, Raum "newsroom").
 *
 * Zeigt Social-Feed (scrollende Post-Kacheln) + Trending-Spalte in
 * einem Pixel/Brutalist-Monitor-Rahmen. Integration macht der Orchestrator:
 * Er ruft derivePosts() auf und übergibt Posts + Trending via Props.
 *
 * Keine Hook-Zugriffe auf globalen State — die Komponente ist rein
 * prop-getrieben und damit isoliert testbar.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useAssets } from '../assets/useAssets';
import { StoryModeColors } from '../theme';

// ─── Öffentliche Typen ─────────────────────────────────────────────────────────

export interface NewsPost {
  id: string;
  text: string;
  author: string;
  likes: number;
  shares: number;
  /** Eigener (gesponsorer) Post — leicht rötlicher Rahmen + ⬢-Marker. */
  isOurs: boolean;
  phase: number;
}

export interface TrendingTopic {
  topic: string;
  volume: number;
  rising: boolean;
}

/** P6/C9: erzählerische Gegenseite (Aufklärungs-Stand als kleine Geschichte). */
export interface GegenseitePanel {
  awareness: number;   // 0..1
  format_de: string;
  lines: string[];
  /** Optionaler Kopf der Gegenseite (Asset-ID, z. B. 'portrait_factcheckerin'). */
  portraitId?: string;
}

export interface NewsroomViewProps {
  posts: NewsPost[];
  trending: TrendingTopic[];
  /** P6/C9: erzählerische Gegenseite (optional) — die Aufklärung wird wahrnehmbar. */
  gegenseite?: GegenseitePanel;
  onClose: () => void;
}

// ─── Hilfsfunktionen (importierbar und testbar) ────────────────────────────────

/**
 * Einfacher 32-Bit-Hash über eine Zeichenkette (djb2-Variante).
 * Deterministisch, kein Math.random — sicher im Render-Pfad.
 */
export function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    // Bitweise Verschiebung bleibt in 32-Bit-Bereich (ToInt32 via |0).
    h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  }
  // Unsigned → immer positiv.
  return h >>> 0;
}

/**
 * Deterministisch abgeleitete Likes aus Post-ID (kein Math.random).
 * Bereich: 12–4095 (zwei Hash-Schichten für bessere Streuung).
 */
export function deriveLikes(id: string): number {
  return 12 + (hashString(id + '_likes') % 4084);
}

/**
 * Deterministisch abgeleitete Shares aus Post-ID.
 * Bereich: 0–511 (immer kleiner als Likes).
 */
export function deriveShares(id: string): number {
  return hashString(id + '_shares') % 512;
}

// ─── Typ-Importe für derivePosts ──────────────────────────────────────────────
// Nur Typ-Imports — keine Laufzeit-Abhängigkeit auf die Engine.

import type { NewsEvent } from '../../game-logic/StoryEngineAdapter';
import type { BroadcastItem } from '../broadcast/broadcastMapping';

/**
 * Ableitung von NewsPost-Einträgen aus Spiel-Ereignissen und Broadcast-History.
 *
 * Für den Orchestrator (StoryModeGame / Newsroom-Wrapper):
 *   const posts = derivePosts(state.newsEvents, broadcastHistory);
 *
 * - NewsEvents vom Typ 'action_result' → isOurs=true (eigene Aktionen)
 * - Broadcast-Items mit kind='eigen' → ebenfalls als eigene Posts
 * - Duplikate (gleiche Basis-ID) werden dedupliziert
 * - Likes/Shares deterministisch aus ID (kein Math.random)
 */
export function derivePosts(
  newsEvents: NewsEvent[],
  broadcastHistory: BroadcastItem[],
): NewsPost[] {
  const seen = new Set<string>();
  const posts: NewsPost[] = [];

  // 1. Aus News-Events
  for (const ev of newsEvents) {
    const id = `ne_${ev.id}`;
    if (seen.has(id)) continue;
    seen.add(id);

    // Kurzen Autor-Namen aus Typ ableiten
    const authorMap: Record<string, string> = {
      action_result: '@ministerium_ops',
      consequence: '@westunion_watch',
      world_event: '@eu_nachrichten',
      npc_event: '@intern_memo',
      npc_reaction: '@team_intern',
    };
    const author = authorMap[ev.type] ?? '@unbekannt';

    posts.push({
      id,
      text: ev.headline_de,
      author,
      likes: deriveLikes(id),
      shares: deriveShares(id),
      isOurs: ev.type === 'action_result',
      phase: ev.phase,
    });
  }

  // 2. Aus Broadcast-History (ergänzende eigene Beiträge)
  for (const item of broadcastHistory) {
    const id = `bc_${item.id}`;
    if (seen.has(id)) continue;
    seen.add(id);

    posts.push({
      id,
      text: item.headline,
      author: item.kind === 'eigen' ? '@ministerium_media' : '@reaktion_extern',
      likes: deriveLikes(id),
      shares: deriveShares(id),
      isOurs: item.kind === 'eigen',
      phase: 0,
    });
  }

  return posts;
}

// ─── CSS-Keyframes (Präfix nr-) ────────────────────────────────────────────────

const KEYFRAMES = `
  @keyframes nr-scroll {
    0%   { transform: translateY(0); }
    100% { transform: translateY(-50%); }
  }
  @keyframes nr-fade-in {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes nr-bar-grow {
    from { width: 0; }
    to   { width: var(--nr-bar-w); }
  }
  @keyframes nr-scanline {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  @keyframes nr-close-pulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(196,30,58,0); }
    50%     { box-shadow: 0 0 0 4px rgba(196,30,58,0.5); }
  }

  /* prefers-reduced-motion: alle Bewegungs-Animationen deaktivieren */
  @media (prefers-reduced-motion: reduce) {
    [data-nr-scroll], [data-nr-scan] {
      animation: none !important;
    }
  }
`;

// ─── Hilfsfunktion: Initialen aus Autor-Handle ────────────────────────────────

function initials(author: string): string {
  // "@ministerium_ops" → "MO"
  const clean = author.replace(/^@/, '');
  const parts = clean.split(/[_\-\s]/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return clean.slice(0, 2).toUpperCase();
}

// ─── Unter-Komponente: Post-Kachel ────────────────────────────────────────────

interface PostCardProps {
  post: NewsPost;
  /** Erste Kachel in der sichtbaren Liste → Einblend-Animation. */
  isFirst?: boolean;
}

function PostCard({ post, isFirst = false }: PostCardProps): React.JSX.Element {
  // Rötlicher Rahmen bei eigenen Posts, sonst dezent dunkel
  const borderColor = post.isOurs
    ? 'rgba(196,30,58,0.7)'
    : 'rgba(80,80,80,0.5)';
  const bg = post.isOurs ? 'rgba(60,10,15,0.55)' : 'rgba(20,20,20,0.6)';

  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        padding: '8px 10px',
        marginBottom: 6,
        border: `2px solid ${borderColor}`,
        backgroundColor: bg,
        borderRadius: 0, // Brutalist: keine runden Ecken
        animation: isFirst ? 'nr-fade-in 0.35s ease-out' : 'none',
        flexShrink: 0,
      }}
    >
      {/* Avatar-Platzhalter mit Initialen */}
      <div
        style={{
          width: 32,
          height: 32,
          flexShrink: 0,
          backgroundColor: post.isOurs
            ? StoryModeColors.ministryRed
            : StoryModeColors.concrete,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          fontWeight: 900,
          fontFamily: "'VT323', monospace",
          color: '#fff',
          imageRendering: 'pixelated',
          // Pixeliger 1px-Rand simuliert Sprite-Rand
          outline: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        {initials(post.author)}
      </div>

      {/* Inhalt */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Kopfzeile: Autor + Marker */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            marginBottom: 3,
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              fontFamily: "'VT323', monospace",
              color: StoryModeColors.warning,
              letterSpacing: 0.5,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {post.author}
          </span>
          {/* Eigener Post: ⬢-Marker */}
          {post.isOurs && (
            <span
              style={{
                fontSize: 9,
                color: StoryModeColors.ministryRed,
                lineHeight: 1,
                flexShrink: 0,
              }}
              title="Eigene Operation"
            >
              ⬢
            </span>
          )}
        </div>

        {/* Post-Text (max 2 Zeilen, Overflow abschneiden) */}
        <p
          style={{
            margin: 0,
            fontSize: 11,
            fontFamily: "'VT323', monospace",
            color: StoryModeColors.textPrimary,
            lineHeight: 1.4,
            // 2-Zeilen-Clamp via -webkit-line-clamp
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {post.text}
        </p>

        {/* Metriken: Likes + Shares (Text-Glyphen, keine Emoji) */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            marginTop: 5,
            fontSize: 10,
            fontFamily: "'VT323', monospace",
            color: StoryModeColors.textMuted,
          }}
        >
          <span>
            {/* Herz-Glyphe — kein Emoji */}
            <span style={{ color: StoryModeColors.danger }}></span>
            {' '}
            {post.likes.toLocaleString('de-DE')}
          </span>
          <span>
            {/* Teilen-Glyphe */}
            <span style={{ color: StoryModeColors.agencyBlue, filter: 'brightness(1.8)' }}>⇄</span>
            {' '}
            {post.shares.toLocaleString('de-DE')}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Unter-Komponente: Trending-Eintrag ───────────────────────────────────────

interface TrendingRowProps {
  item: TrendingTopic;
  maxVolume: number;
}

function TrendingRow({ item, maxVolume }: TrendingRowProps): React.JSX.Element {
  const pct = maxVolume > 0 ? (item.volume / maxVolume) * 100 : 0;
  const barWidthPct = `${Math.round(pct)}%`;

  return (
    <div style={{ marginBottom: 10 }}>
      {/* Topic-Name + Trend-Pfeil */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 3,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontFamily: "'VT323', monospace",
            fontWeight: 700,
            color: StoryModeColors.textPrimary,
            letterSpacing: 0.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '75%',
          }}
        >
          {item.topic}
        </span>
        {/* Pfeil: ▲ steigend, ▽ fallend */}
        <span
          style={{
            fontSize: 12,
            color: item.rising ? StoryModeColors.danger : StoryModeColors.textMuted,
            fontFamily: "'VT323', monospace",
            flexShrink: 0,
          }}
        >
          {item.rising ? '▲' : '▽'}
        </span>
      </div>

      {/* Volumen-Balken — animiert beim Mount via CSS-Variable */}
      <div
        style={{
          height: 5,
          backgroundColor: 'rgba(60,60,60,0.7)',
          border: '1px solid rgba(80,80,80,0.4)',
          overflow: 'hidden',
        }}
      >
        <div
          // CSS-Custom-Property für den Bar-Grow-Keyframe
          style={
            {
              height: '100%',
              width: barWidthPct,
              '--nr-bar-w': barWidthPct,
              backgroundColor: item.rising
                ? StoryModeColors.danger
                : StoryModeColors.concrete,
              animation: 'nr-bar-grow 0.6s ease-out both',
            } as React.CSSProperties
          }
        />
      </div>

      {/* Volumen-Zahl */}
      <div
        style={{
          fontSize: 9,
          color: StoryModeColors.textMuted,
          fontFamily: "'VT323', monospace",
          marginTop: 2,
          textAlign: 'right',
        }}
      >
        {item.volume.toLocaleString('de-DE')}
      </div>
    </div>
  );
}

// ─── Haupt-Komponente ─────────────────────────────────────────────────────────

export function NewsroomView({
  posts,
  trending,
  gegenseite,
  onClose,
}: NewsroomViewProps): React.JSX.Element {
  const assets = useAssets();
  const bgUrl = assets.imageUrl('room_newsroom');

  // Feed-Container: manuelle Scroll-Steuerung bei Hover
  const feedRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Escape-Taste schließt die Ansicht
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

  // Duplizierte Post-Liste für nahtlosen Marquee-Loop
  // (mindestens 6 Einträge → Duplikat füllt Lücke)
  const loopPosts = posts.length > 0
    ? [...posts, ...posts]
    : [];

  const maxVolume = trending.reduce((m, t) => Math.max(m, t.volume), 0);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Newsroom Netzwerk-Monitor"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'VT323', monospace",
        backgroundColor: '#0d0d0d',
        overflow: 'hidden',
      }}
    >
      {/* Globale Keyframes */}
      <style>{KEYFRAMES}</style>

      {/* ── Hintergrund: room_newsroom ──────────────────────────────────────── */}
      {bgUrl ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${bgUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            imageRendering: 'pixelated',
            // Dunkler Verlauf für Lesbarkeit der UI-Elemente
            backgroundBlendMode: 'normal',
          }}
        >
          {/* Dunkel-Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.72) 100%)',
            }}
          />
        </div>
      ) : (
        /* Fallback: einfache dunkle Fläche */
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#0a0a0a',
          }}
        />
      )}

      {/* ── Scanline-Overlay (dezent) ──────────────────────────────────────── */}
      <div
        data-nr-scan=""
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          background:
            'repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)',
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
          backgroundColor: 'rgba(10,10,10,0.88)',
          borderBottom: `3px solid ${StoryModeColors.ministryRed}`,
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Rotes Indikator-Quadrat (Pixel-Art-Look) */}
          <div
            style={{
              width: 10,
              height: 10,
              backgroundColor: StoryModeColors.ministryRed,
              imageRendering: 'pixelated',
            }}
          />
          <span
            style={{
              fontSize: 13,
              fontWeight: 900,
              letterSpacing: 3,
              color: StoryModeColors.textPrimary,
            }}
          >
            NEWSROOM
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 400,
              letterSpacing: 2,
              color: StoryModeColors.textMuted,
            }}
          >
            — NETZWERK-MONITOR
          </span>
        </div>

        {/* Schließen-Button ✕ */}
        <button
          onClick={onClose}
          aria-label="Newsroom schliessen"
          style={{
            background: 'none',
            border: `2px solid ${StoryModeColors.ministryRed}`,
            color: StoryModeColors.textPrimary,
            fontSize: 16,
            fontFamily: "'VT323', monospace",
            fontWeight: 900,
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            animation: 'nr-close-pulse 2.5s ease-in-out infinite',
          }}
        >
          ✕
        </button>
      </header>

      {/* ── Monitor-Bereich ───────────────────────────────────────────────── */}
      <main
        style={{
          position: 'relative',
          zIndex: 10,
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'stretch',
          padding: '24px 32px',
          gap: 16,
          overflow: 'hidden',
        }}
      >
        {/* Großer Monitor-Rahmen im Pixel/Brutalist-Stil */}
        <div
          style={{
            flex: 1,
            maxWidth: 960,
            display: 'flex',
            gap: 0,
            // Brutalist-Rahmen: dicker Außenrand + Inset-Schatten
            border: `4px solid ${StoryModeColors.concrete}`,
            boxShadow: `inset 0 0 0 2px rgba(0,0,0,0.9)`,
            backgroundColor: 'rgba(5,5,5,0.92)',
            overflow: 'hidden',
          }}
        >
          {/* ─── Feed-Bereich (links, ~65%) ────────────────────────────────── */}
          <div
            style={{
              flex: '0 0 65%',
              display: 'flex',
              flexDirection: 'column',
              borderRight: `2px solid ${StoryModeColors.border}`,
              overflow: 'hidden',
            }}
          >
            {/* P6/C9: erzählerische Gegenseite — der Stand der Aufklärung als kleine Geschichte. */}
            {gegenseite && (
              <div
                style={{
                  padding: '8px 12px',
                  backgroundColor: 'rgba(20,12,12,0.95)',
                  borderBottom: `2px solid ${StoryModeColors.agencyBlue}`,
                  flexShrink: 0,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: StoryModeColors.agencyBlue }}>
                    GEGENSEITE — {gegenseite.format_de.toUpperCase()}
                  </span>
                  <span style={{ fontSize: 9, color: StoryModeColors.textMuted }} title="Stand der Aufklärung">
                    Aufklärung {Math.round(gegenseite.awareness * 100)}%
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  {gegenseite.portraitId && assets.imageUrl(gegenseite.portraitId) && (
                    <img
                      src={assets.imageUrl(gegenseite.portraitId)!}
                      alt="Faktencheckerin"
                      style={{
                        width: 40,
                        height: 40,
                        objectFit: 'cover',
                        flexShrink: 0,
                        border: `1px solid ${StoryModeColors.agencyBlue}`,
                        imageRendering: 'pixelated',
                      }}
                    />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {gegenseite.lines.map((line, i) => (
                      <p key={i} style={{ margin: '2px 0', fontSize: 11, lineHeight: 1.4, color: StoryModeColors.textPrimary }}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Feed-Titel */}
            <div
              style={{
                padding: '8px 12px',
                backgroundColor: 'rgba(15,15,15,0.95)',
                borderBottom: `2px solid rgba(60,60,60,0.7)`,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 2,
                color: StoryModeColors.warning,
                flexShrink: 0,
              }}
            >
              SOCIAL FEED — {posts.length} BEITRAEGE
            </div>

            {/* Scrollender Feed */}
            <div
              style={{
                flex: 1,
                overflow: 'hidden',
                position: 'relative',
                // Bei Hover: overflow-y sichtbar für manuelles Scrollen
                ...(isHovering ? { overflowY: 'auto' } : {}),
              }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {loopPosts.length > 0 ? (
                <div
                  ref={feedRef}
                  data-nr-scroll=""
                  style={{
                    padding: '10px 12px',
                    // Scroll-Animation pausiert bei Hover
                    animation: isHovering
                      ? 'nr-scroll 40s linear infinite paused'
                      : 'nr-scroll 40s linear infinite',
                    // Bei Hover: keine translateY-Begrenzung → normales Scroll
                    ...(isHovering ? { animation: 'none' } : {}),
                  }}
                >
                  {loopPosts.map((post, idx) => (
                    <PostCard
                      key={`${post.id}_${idx}`}
                      post={post}
                      isFirst={idx === 0}
                    />
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: StoryModeColors.textMuted,
                    fontSize: 12,
                    fontFamily: "'VT323', monospace",
                    letterSpacing: 1,
                  }}
                >
                  Keine Beitraege vorhanden
                </div>
              )}
            </div>
          </div>

          {/* ─── Trending-Spalte (rechts, ~35%) ──────────────────────────── */}
          <div
            style={{
              flex: '0 0 35%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Trending-Titel */}
            <div
              style={{
                padding: '8px 12px',
                backgroundColor: 'rgba(15,15,15,0.95)',
                borderBottom: `2px solid rgba(60,60,60,0.7)`,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 2,
                color: StoryModeColors.danger,
                flexShrink: 0,
              }}
            >
              TRENDING TOPICS
            </div>

            {/* Topic-Liste */}
            <div
              style={{
                flex: 1,
                padding: '10px 12px',
                overflowY: 'auto',
              }}
            >
              {trending.length > 0 ? (
                trending.map((item) => (
                  <TrendingRow key={item.topic} item={item} maxVolume={maxVolume} />
                ))
              ) : (
                <div
                  style={{
                    color: StoryModeColors.textMuted,
                    fontSize: 11,
                    fontFamily: "'VT323', monospace",
                    marginTop: 12,
                    textAlign: 'center',
                  }}
                >
                  Keine Trends
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default NewsroomView;
