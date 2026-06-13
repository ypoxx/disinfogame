/**
 * BroadcastBar — die MadTV-Leiste des Ministeriums (Taste B).
 *
 * Links: „Was läuft" — Röhren-TV (hud_tv_frame) bzw. Zeitung (hud_paper_frame)
 * mit der letzten Maßnahme. Mitte: Wirkung (Klein/Mittel/Groß, Quote, Verlauf).
 * Rechts: das Wohnzimmer — Publikums-Segmente als sitzende Pixel-Figuren,
 * Stimmung als Färbung, Reaktions-Bubbles bei deutlicher Wirkung.
 *
 * Reine Anzeige-Schicht (useAudienceBroadcast); das inhaltlich breitere
 * „Ministerium sendet"-Konzept ist offen: docs/story-mode/MINISTRY_BROADCAST_CONCEPT.md.
 */
import type { CSSProperties } from 'react';
import { useAssets } from '../assets/useAssets';
import { PixelSprite } from '../assets/PixelSprite';
import { StoryModeColors } from '../theme';
import { FIGURE_BY_SEGMENT, type BroadcastTier } from './broadcastMapping';
import type { AudienceBroadcastState } from './useAudienceBroadcast';
import type { Mood } from '../audience/audienceModel';

const KEYFRAMES = `
  @keyframes bb-slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
  @keyframes bb-scan { 0%,100% { opacity: .14 } 50% { opacity: .05 } }
  @keyframes bb-ticker { from { transform: translateX(100%); } to { transform: translateX(-100%); } }
  @keyframes bb-bubble { 0% { transform: translateY(4px); opacity: 0 } 15% { opacity: 1 } 85% { opacity: 1 } 100% { transform: translateY(-6px); opacity: 0 } }
  @keyframes bb-blink { 0%,100% { opacity: 1 } 50% { opacity: .25 } }
`;

/** Stimmung → Bildfilter der Figur (ruhig = neutral). */
const MOOD_FILTER: Record<Mood, string> = {
  ruhig: 'none',
  verunsichert: 'grayscale(0.45) brightness(0.85)',
  wuetend: 'sepia(0.6) hue-rotate(-28deg) saturate(2.4)',
  misstrauisch: 'hue-rotate(165deg) saturate(0.55) brightness(0.8)',
};

const MOOD_LABEL: Record<Mood, string> = {
  ruhig: 'ruhig',
  verunsichert: 'verunsichert',
  wuetend: 'wütend',
  misstrauisch: 'misstrauisch',
};

const TIER_LABEL: Record<BroadcastTier, string> = {
  klein: 'KLEINE WIRKUNG',
  mittel: 'MITTLERE WIRKUNG',
  gross: 'GROSSE WIRKUNG',
};

const TIER_COLOR: Record<BroadcastTier, string> = {
  klein: '#8a8a7a',
  mittel: StoryModeColors.warning,
  gross: StoryModeColors.danger,
};

/**
 * Betroffenen-Zitate je Stimmung: macht den menschlichen Preis der eigenen
 * „Effizienz" sichtbar (Empathie-Korrektiv, Psychologie-Gutachten C2).
 */
const MOOD_QUOTES: Record<Mood, string[]> = {
  ruhig: ['Mal sehen, was die Nachrichten sagen.'],
  verunsichert: ['Was soll man denn noch glauben…', 'Irgendwas stimmt da doch nicht.'],
  wuetend: ['Die lügen uns alle an!', 'Das lasse ich mir nicht mehr gefallen!'],
  misstrauisch: ['Den Nachbarn glaube ich nichts mehr.', 'Wer steckt da wohl dahinter?'],
};

/** Deterministische Zitat-Wahl (kein Re-Render-Flackern). */
function quoteFor(segmentId: string, mood: Mood): string {
  const list = MOOD_QUOTES[mood];
  let h = 0;
  for (const ch of segmentId) h = (h * 31 + ch.charCodeAt(0)) % 997;
  return list[h % list.length];
}

interface BroadcastBarProps {
  audience: AudienceBroadcastState;
  onClose: () => void;
}

/** Röhren-TV bzw. Zeitung mit der aktuellen „Sendung". */
function BroadcastScreen({ audience }: { audience: AudienceBroadcastState }) {
  const assets = useAssets();
  const item = audience.lastItem;
  const isPrint = item?.channel === 'print';
  const frameUrl = assets.imageUrl(isPrint ? 'hud_paper_frame' : 'hud_tv_frame');

  // Inhaltsfenster relativ zum Rahmenbild (TV: Bildröhre links, Zeitung: Foto-Loch mittig).
  const hole: CSSProperties = isPrint
    ? { left: '16%', top: '30%', width: '68%', height: '34%' }
    : { left: '17%', top: '29%', width: '48%', height: '45%' };

  return (
    <div style={{ position: 'relative', width: 230, height: 172, flexShrink: 0 }}>
      {frameUrl ? (
        <img
          src={frameUrl}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', imageRendering: 'pixelated', zIndex: 2, pointerEvents: 'none' }}
        />
      ) : (
        <div style={{ position: 'absolute', inset: 0, border: '4px solid #3a3b43', backgroundColor: '#15161c', zIndex: 2 }} />
      )}
      {/* Bildschirm-/Foto-Inhalt unter dem Rahmen (Loch ist transparent) */}
      <div
        style={{
          position: 'absolute',
          ...hole,
          backgroundColor: isPrint ? '#d8cfae' : '#0a0f0a',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          zIndex: 1,
        }}
      >
        {item ? (
          <span
            style={{
              whiteSpace: 'nowrap',
              fontSize: 11,
              fontWeight: 700,
              fontFamily: 'monospace',
              color: isPrint ? '#26221a' : '#9be89b',
              animation: 'bb-ticker 9s linear infinite',
              paddingLeft: 4,
            }}
          >
            {item.kind === 'gegenreaktion' ? '⚠ GEGENWIND: ' : '⬢ '}
            {item.headline}
          </span>
        ) : (
          <span style={{ width: '100%', textAlign: 'center', fontSize: 10, color: '#5a7a5a', fontFamily: 'monospace' }}>
            ▚▞ KEIN SIGNAL ▚▞
          </span>
        )}
        {!isPrint && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'repeating-linear-gradient(transparent 0 2px, rgba(140,255,140,0.16) 2px 3px)',
              animation: 'bb-scan 1.6s steps(2) infinite',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
      <span
        style={{
          position: 'absolute',
          top: 2,
          left: 6,
          fontSize: 10,
          fontWeight: 700,
          color: StoryModeColors.danger,
          animation: item ? 'bb-blink 1.4s ease-in-out infinite' : undefined,
          zIndex: 3,
        }}
      >
        {item ? (isPrint ? '◉ DRUCK' : '◉ ON AIR') : '○ STANDBY'}
      </span>
    </div>
  );
}

/** Wohnzimmer mit Publikums-Figuren (Stimmung = Färbung, Größe des Segments = Sockelbreite). */
function AudienceRoom({ audience }: { audience: AudienceBroadcastState }) {
  const assets = useAssets();
  const roomUrl = assets.imageUrl('audience_room');
  const reactionBySegment = new Map(audience.lastReaction?.reactions.map((r) => [r.segmentId, r]) ?? []);

  return (
    <div
      style={{
        position: 'relative',
        flex: '0 0 420px',
        height: '100%',
        overflow: 'hidden',
        border: '3px solid #2c2d35',
        backgroundColor: '#15161c',
        ...(roomUrl
          ? { backgroundImage: `url(${roomUrl})`, backgroundSize: 'cover', backgroundPosition: 'center 65%', imageRendering: 'pixelated' }
          : {}),
      }}
      title="Publikum: Nordmark"
    >
      <span style={{ position: 'absolute', top: 4, left: 8, fontSize: 10, fontWeight: 700, letterSpacing: 1, color: '#c8c8b8', backgroundColor: 'rgba(10,10,14,0.7)', padding: '1px 6px', zIndex: 3 }}>
        PUBLIKUM — NORDMARK
      </span>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 12, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 14, zIndex: 2 }}>
        {audience.country.segments.map((seg) => {
          const figure = FIGURE_BY_SEGMENT[seg.id] ?? 'audience_worker';
          const reaction = reactionBySegment.get(seg.id);
          const showBubble = reaction && Math.abs(reaction.beliefDelta) >= 0.04;
          return (
            <div
              key={seg.id}
              style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              title={`${seg.label_de} — ${MOOD_LABEL[seg.mood]}, Überzeugung ${(seg.belief * 100).toFixed(0)}%`}
            >
              {showBubble && (
                <span
                  style={{
                    position: 'absolute',
                    top: -30,
                    fontSize: 10,
                    lineHeight: 1.25,
                    maxWidth: 120,
                    whiteSpace: 'nowrap',
                    color: '#ddd',
                    backgroundColor: 'rgba(10,10,14,0.88)',
                    border: '1px solid #3a3b43',
                    padding: '1px 5px',
                    animation: 'bb-bubble 3.4s ease-out forwards',
                    zIndex: 4,
                  }}
                >
                  {seg.mood === 'wuetend' ? '💢 ' : seg.mood === 'misstrauisch' ? '🤨 ' : ''}
                  {quoteFor(seg.id, seg.mood)}
                </span>
              )}
              <span style={{ filter: MOOD_FILTER[seg.mood], transition: 'filter 600ms ease' }}>
                <PixelSprite sheetId={figure} animation="idle" fallback="🧍" scale={1.6} title={seg.label_de} />
              </span>
              {/* Überzeugungs-Sockel: füllt sich mit der Wirkung der Desinformation */}
              <span
                role="progressbar"
                aria-valuenow={Math.round(seg.belief * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${seg.label_de}: Überzeugung ${Math.round(seg.belief * 100)}%, Stimmung ${MOOD_LABEL[seg.mood]}`}
                style={{ width: 40, height: 4, marginTop: 2, backgroundColor: 'rgba(0,0,0,0.55)' }}
              >
                <span
                  style={{
                    display: 'block',
                    width: `${Math.round(seg.belief * 100)}%`,
                    height: '100%',
                    backgroundColor: seg.belief > 0.6 ? StoryModeColors.danger : seg.belief > 0.4 ? StoryModeColors.warning : '#6a8a6a',
                    transition: 'width 600ms ease',
                  }}
                />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function BroadcastBar({ audience, onClose }: BroadcastBarProps) {
  const item = audience.lastItem;
  const quote = audience.lastReaction?.quote ?? 0;
  const reach = audience.lastReaction ? audience.lastReaction.reactions.reduce((s, r) => s + r.reach, 0) : 0;

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-30"
      style={{
        height: 188,
        display: 'flex',
        gap: 12,
        alignItems: 'stretch',
        padding: '10px 12px',
        backgroundColor: 'rgba(8,8,12,0.94)',
        borderTop: `3px solid ${StoryModeColors.ministryRed}`,
        animation: 'bb-slide-up 240ms ease-out',
      }}
      data-testid="broadcast-bar"
    >
      <style>{KEYFRAMES}</style>
      <BroadcastScreen audience={audience} />

      {/* Mitte: Wirkung + Verlauf */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'monospace' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#c8c8b8' }}>⬢ MINISTERIUM SENDET</span>
          {item && (
            <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', color: '#0d0d0d', backgroundColor: TIER_COLOR[item.tier] }}>
              {TIER_LABEL[item.tier]}
            </span>
          )}
          <button
            onClick={onClose}
            aria-label="Broadcast-Leiste schließen (Taste B)"
            style={{ marginLeft: 'auto', fontSize: 12, color: '#ccc', border: '2px solid #555', padding: '6px 14px', minHeight: 32, background: 'transparent', cursor: 'pointer' }}
          >
            B ✕
          </button>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#9aa' }}>
          <span>
            QUOTE{' '}
            <b style={{ color: quote > 0.25 ? StoryModeColors.warning : '#ccc' }}>{(quote * 100).toFixed(0)}%</b>
          </span>
          <span>
            REICHWEITE <b style={{ color: '#ccc' }}>{(reach * 100).toFixed(0)}%</b>
          </span>
          <span>
            KANAL <b style={{ color: '#ccc' }}>{item ? (item.channel === 'tv' ? 'FERNSEHEN' : item.channel === 'print' ? 'PRESSE' : 'NETZWERKE') : '—'}</b>
          </span>
        </div>
        {/* Verlauf der letzten Maßnahmen */}
        <div style={{ flex: 1, overflow: 'hidden', borderTop: '1px solid #2c2d35', paddingTop: 4 }}>
          {audience.history.length === 0 ? (
            <span style={{ fontSize: 11, color: '#666' }}>
              Noch keine Maßnahme ausgespielt — geplante Aktionen erscheinen hier als Sendung.
            </span>
          ) : (
            audience.history.slice(0, 3).map((h) => (
              <div key={h.id} style={{ fontSize: 11, color: h.kind === 'gegenreaktion' ? StoryModeColors.danger : '#9aa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {h.kind === 'gegenreaktion' ? '⚠' : '⬢'} [{h.tier.toUpperCase()}] {h.headline}
              </div>
            ))
          )}
        </div>
      </div>

      <AudienceRoom audience={audience} />
    </div>
  );
}

export default BroadcastBar;
