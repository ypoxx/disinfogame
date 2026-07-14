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
import { StoryModeColors, StoryModeFonts } from '../theme';
import { FIGURE_BY_SEGMENT, wohnzimmerBadgeFor, type BroadcastTier, type WohnzimmerBadge } from './broadcastMapping';
import type { AudienceBroadcastState } from './useAudienceBroadcast';
import type { Mood } from '../audience/audienceModel';

/** Wohnzimmer-Alphabet-Eintrag je Milieu (Vertrag: `engine.getWohnzimmerAlphabet()`). */
export interface WohnzimmerAlphabetEntry {
  milieuId: string;
  bild: 'zeitung' | 'abwinken' | null;
  grund_de: string;
}

/** Badge-Kürzel: 2-Zeichen-Pixel-Text statt Emoji — feste Bildsprache (Zielbild §6). */
const BADGE_LABEL: Record<WohnzimmerBadge, string> = {
  fahne: 'FA',
  zeitung: 'ZG',
  abwinken: 'AB',
  streit: 'ST',
  einsam: 'EI',
};

/** Kühle Farbgebung — kein Feier-Grün, keine Alarm-Ästhetik.
 *  v3: Badges sitzen auf dunklem Chip — Text-/danger-Tinten wären unlesbar,
 *  daher helle Papier-Töne bzw. das helle v2-Rot (diegetische Sendeleiste). */
const BADGE_COLOR: Record<WohnzimmerBadge, string> = {
  fahne: '#3a7acc',
  zeitung: StoryModeColors.lightConcrete,
  abwinken: StoryModeColors.warning,
  streit: '#E5484D',
  einsam: StoryModeColors.concrete,
};

const KEYFRAMES = `
  @keyframes bb-slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
  @keyframes bb-scan { 0%,100% { opacity: .14 } 50% { opacity: .05 } }
  @keyframes bb-ticker { from { transform: translateX(100%); } to { transform: translateX(-100%); } }
  @keyframes bb-bubble { 0% { transform: translateY(4px); opacity: 0 } 15% { opacity: 1 } 85% { opacity: 1 } 100% { transform: translateY(-6px); opacity: 0 } }
  @keyframes bb-blink { 0%,100% { opacity: 1 } 50% { opacity: .25 } }
`;

/** Stimmung → Bildfilter der Figur — NUR noch Fallback, falls das Mimik-Sheet
 *  `audience_<id>_<mood>` fehlt (v5: Stimmung trägt die MIMIK der Figur selbst,
 *  Owner 2026-07-07 — „anhand der Mimik die Stimmung erkennen"). Bewusst subtil. */
const MOOD_FILTER: Record<Mood, string> = {
  ruhig: 'none',
  verunsichert: 'grayscale(0.3) brightness(0.9)',
  wuetend: 'sepia(0.35) hue-rotate(-16deg) saturate(1.7)',
  misstrauisch: 'saturate(0.72) brightness(0.9) contrast(1.05)',
};

/** Sitzplätze auf dem Sofa (pixelvermessen, Messraster 2026-07-07): sitzbarer
 *  Bereich x≈150–455 zwischen den Armlehnen; 4 Zellen à 72 px, Fußlinie 16 px
 *  über dem Panel-Boden → Oberschenkel landen auf der Kissen-Vorderkante (b≈52),
 *  die Füße (b16, Boden b10) verschwinden im Sockel-Schatten. */
const SEAT_LEFTS = [152, 228, 304, 380];
const SEAT_WIDTH = 72;
// 13 statt 16: Figuren sinken 3 px in die Kissen (Gemini-QC: „aufgesetzt"),
// Füße landen damit fast exakt auf der Boden-Linie (b≈10).
const SEAT_BOTTOM = 13;

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

// v3: danger ist Tinte — der GROSS-Stempel auf der dunklen Leiste trägt
// das helle v2-Rot, damit die schwarze Chip-Schrift lesbar bleibt.
const TIER_COLOR: Record<BroadcastTier, string> = {
  klein: '#8a8a7a',
  mittel: StoryModeColors.warning,
  gross: '#E5484D',
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
  /** Voll ausgeklappt (Wohnzimmer sichtbar) vs. kompakter Dauer-Streifen. */
  expanded: boolean;
  /** Taste B / Klick: zwischen kompakt und voll umschalten. */
  onToggle: () => void;
  /** Etappe 4 (Zielbild §6): Maschen-Gedächtnis-Anteil des Wohnzimmer-Alphabets je Milieu. */
  wohnzimmerAlphabet?: WohnzimmerAlphabetEntry[];
}

/**
 * Kompakter Dauer-Streifen (2d): immer sichtbar am unteren Welt-Rand, zeigt
 * „läuft gerade" + Lauftext der letzten Sendung. Klick/Taste B klappt das volle
 * Wohnzimmer aus. So bleibt der Feedback-Loop (Tat → Publikum) permanent präsent,
 * ohne den Bildschirm zu belegen (Schicht-2-Diegese, kein Spiel-UI-Randbalken).
 */
function CollapsedStrip({ audience, onToggle }: { audience: AudienceBroadcastState; onToggle: () => void }) {
  const item = audience.lastItem;
  return (
    <button
      onClick={onToggle}
      aria-label="Sendung & Publikum ausklappen (Taste B)"
      title="Sendung & Publikum (B)"
      className="relative w-full flex items-center gap-3 px-3 text-left"
      style={{
        height: 40,
        flexShrink: 0,
        backgroundColor: 'rgba(8,8,12,0.94)',
        borderTop: `3px solid ${StoryModeColors.ministryRed}`,
        cursor: 'pointer',
        fontFamily: "'VT323', monospace",
      }}
      data-testid="broadcast-strip"
    >
      <style>{KEYFRAMES}</style>
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 1,
          // v3: danger ist Tinte — ON-AIR-Licht bleibt helles v2-Rot (diegetisch).
          color: item ? '#E5484D' : '#6a7',
          animation: item ? 'bb-blink 1.4s ease-in-out infinite' : undefined,
          flexShrink: 0,
        }}
      >
        {item ? '● ON AIR' : '○ STANDBY'}
      </span>
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#c8c8b8', flexShrink: 0 }}>
        MINISTERIUM SENDET
      </span>
      {item && (
        <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', color: '#0d0d0d', backgroundColor: TIER_COLOR[item.tier], flexShrink: 0 }}>
          {TIER_LABEL[item.tier]}
        </span>
      )}
      <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: 11, color: '#9aa' }}>
        {item ? item.headline : 'Noch keine Maßnahme ausgespielt — geplante Aktionen erscheinen hier als Sendung.'}
      </span>
      <span style={{ fontSize: 11, color: '#ccc', border: `2px solid #555`, padding: '2px 10px', flexShrink: 0 }}>
        PUBLIKUM ▴ B
      </span>
    </button>
  );
}

/** Röhren-TV bzw. Zeitung mit der aktuellen „Sendung". */
function BroadcastScreen({ audience }: { audience: AudienceBroadcastState }) {
  const assets = useAssets();
  const item = audience.lastItem;
  const isPrint = item?.channel === 'print';
  const frameUrl = assets.imageUrl(isPrint ? 'hud_paper_frame' : 'hud_tv_frame');
  // Sendepause-Testbild fürs Röhren-TV (nur im Standby, kein Print): füllt die
  // Bildröhre statt eines toten „KEIN SIGNAL"-Textes.
  const testcardUrl = !item && !isPrint ? assets.imageUrl('hud_tv_testcard') : null;

  // Inhaltsfenster relativ zum Rahmenbild (TV: Bildröhre links, Zeitung: Foto-Loch mittig).
  const hole: CSSProperties = isPrint
    ? { left: '16%', top: '30%', width: '68%', height: '34%' }
    : { left: '17%', top: '29%', width: '48%', height: '45%' };

  // v4 (Owner 2026-07-06): Röhren-TV im Gesamtverhältnis größer — füllt die
  // Leisten-Höhe fast ganz und wird zum linken Blickfang (statt schmaler Kachel).
  return (
    <div style={{ position: 'relative', width: 273, height: 204, flexShrink: 0 }}>
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
              fontFamily: "'VT323', monospace",
              color: isPrint ? '#26221a' : '#9be89b',
              animation: 'bb-ticker 9s linear infinite',
              paddingLeft: 4,
            }}
          >
            {item.kind === 'gegenreaktion' ? 'GEGENWIND: ' : '● '}
            {item.headline}
          </span>
        ) : testcardUrl ? (
          // Sendepause: klassisches Testbild füllt die Röhre (Scanlines liegen darüber).
          <img
            src={testcardUrl}
            alt=""
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', imageRendering: 'pixelated' }}
          />
        ) : (
          <span style={{ width: '100%', textAlign: 'center', fontSize: 10, color: '#5a7a5a', fontFamily: "'VT323', monospace" }}>
            ··· KEIN SIGNAL ···
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
          // v3: danger ist Tinte — ON-AIR-Licht bleibt helles v2-Rot (diegetisch).
          color: '#E5484D',
          animation: item ? 'bb-blink 1.4s ease-in-out infinite' : undefined,
          zIndex: 3,
        }}
      >
        {item ? (isPrint ? '● DRUCK' : '● ON AIR') : '○ STANDBY'}
      </span>
    </div>
  );
}

/** Wohnzimmer mit Publikums-Figuren (Stimmung = Färbung, Größe des Segments = Sockelbreite). */
function AudienceRoom({ audience, wohnzimmerAlphabet }: { audience: AudienceBroadcastState; wohnzimmerAlphabet?: WohnzimmerAlphabetEntry[] }) {
  const assets = useAssets();
  const roomUrl = assets.imageUrl('audience_room');
  const reactionBySegment = new Map(audience.lastReaction?.reactions.map((r) => [r.segmentId, r]) ?? []);
  const alphabetByMilieu = new Map((wohnzimmerAlphabet ?? []).map((a) => [a.milieuId, a]));

  return (
    <div
      style={{
        position: 'relative',
        flex: '0 0 500px',
        height: '100%',
        overflow: 'hidden',
        border: '3px solid #2c2d35',
        backgroundColor: '#15161c',
        ...(roomUrl
          ? { backgroundImage: `url(${roomUrl})`, backgroundSize: 'cover', backgroundPosition: 'center 65%', imageRendering: 'pixelated' }
          : {}),
      }}
      title="Publikum: Westunion"
    >
      <span style={{ position: 'absolute', top: 4, left: 8, fontFamily: StoryModeFonts.label, fontSize: 10, fontWeight: 700, letterSpacing: 1, color: '#c8c8b8', backgroundColor: 'rgba(10,10,14,0.7)', padding: '1px 6px', zIndex: 3 }}>
        PUBLIKUM — WESTUNION
      </span>
      {/* v4 (F5): weicher Sockel-Schatten unten — die hart abgeschnittenen Beine sinken in den
          Polster-Schatten ein statt frei über der Panel-Kante zu schweben (Review 2026-07-06). */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 38,
          background: 'linear-gradient(to top, rgba(12,10,8,0.5) 0%, rgba(12,10,8,0) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      {/* v5 (Owner 2026-07-07): PIXELGENAUES SITZEN — 4 vermessene Sofa-Plätze
          (SEAT_LEFTS) statt zentrierter Flex-Reihe (die setzte die linke Figur neben
          das Sofa auf den Beistelltisch). Sprites 72×96 nativ (scale 1, §4.1) —
          repräsentative Teilmenge, das Sofa fasst nicht alle 8 Milieus. */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
        {audience.country.segments.slice(0, 4).map((seg, seatIndex) => {
          const figure = FIGURE_BY_SEGMENT[seg.id] ?? 'audience_besorgte_mitte';
          // v5: Stimmung = MIMIK — eigenes Sheet je Mood (audience_<id>_<mood>);
          // fehlt es (Registry-Fallback), bleibt der subtile Farb-Filter.
          const moodSheetId = seg.mood === 'ruhig' ? figure : `${figure}_${seg.mood}`;
          const hasMoodSheet = assets.sheet(moodSheetId) !== null;
          const sheetId = hasMoodSheet ? moodSheetId : figure;
          const fallbackFilter = hasMoodSheet ? 'none' : MOOD_FILTER[seg.mood];
          const reaction = reactionBySegment.get(seg.id);
          const showBubble = reaction && Math.abs(reaction.beliefDelta) >= 0.04;
          // Wohnzimmer-Alphabet (Zielbild §6): feste Bildsprache, ein Badge bedeutet
          // IMMER dasselbe — Priorität fahne > zeitung > abwinken > streit > einsam.
          const alphabetEntry = alphabetByMilieu.get(seg.id);
          const badgeResult = wohnzimmerBadgeFor({
            bild: alphabetEntry?.bild ?? null,
            grund_de: alphabetEntry?.grund_de ?? '',
            mood: seg.mood,
            belief: seg.belief,
          });
          return (
            <div
              key={seg.id}
              style={{
                position: 'absolute',
                left: SEAT_LEFTS[seatIndex] ?? SEAT_LEFTS[SEAT_LEFTS.length - 1],
                bottom: SEAT_BOTTOM,
                width: SEAT_WIDTH,
                height: 96,
                pointerEvents: 'auto',
              }}
              title={`${seg.label_de} — ${MOOD_LABEL[seg.mood]}, Überzeugung ${(seg.belief * 100).toFixed(0)}%`}
            >
              {badgeResult.badge && (
                <span
                  data-testid={`wz-badge-${seg.id}`}
                  title={badgeResult.title_de}
                  style={{
                    position: 'absolute',
                    top: -6,
                    right: -2,
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    padding: '1px 3px',
                    color: BADGE_COLOR[badgeResult.badge],
                    border: `1px solid ${BADGE_COLOR[badgeResult.badge]}`,
                    backgroundColor: 'rgba(10,10,14,0.85)',
                    fontFamily: StoryModeFonts.label,
                    zIndex: 5,
                  }}
                >
                  {BADGE_LABEL[badgeResult.badge]}
                </span>
              )}
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
                  {seg.mood === 'wuetend' ? '' : seg.mood === 'misstrauisch' ? '' : ''}
                  {quoteFor(seg.id, seg.mood)}
                </span>
              )}
              {/* v4 (F3): Kontakt-Schatten erdet die Figur aufs Polster, drop-shadow gibt Tiefe —
                  gegen den „Sticker"-Effekt (Review 2026-07-06). */}
              <span style={{ position: 'absolute', inset: 0, display: 'inline-flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                <span
                  aria-hidden
                  style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: 0,
                    transform: 'translateX(-50%)',
                    width: '84%',
                    height: 12,
                    background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0) 68%)',
                    zIndex: 0,
                  }}
                />
                <span
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    filter: `${fallbackFilter === 'none' ? '' : fallbackFilter + ' '}drop-shadow(0 3px 2px rgba(0,0,0,0.5))`,
                    transition: 'filter 600ms ease',
                  }}
                >
                  {/* scale 1 = native 72×96-Frames (§4.1 Integer/Pixel-Dichte, v5) */}
                  <PixelSprite sheetId={sheetId} animation="idle" fallback="" scale={1} title={seg.label_de} />
                </span>
              </span>
              {/* Überzeugungs-Sockel: füllt sich mit der Wirkung der Desinformation */}
              <span
                role="progressbar"
                aria-valuenow={Math.round(seg.belief * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${seg.label_de}: Überzeugung ${Math.round(seg.belief * 100)}%, Stimmung ${MOOD_LABEL[seg.mood]}`}
                style={{ position: 'absolute', left: '50%', bottom: -13, transform: 'translateX(-50%)', width: 40, height: 4, backgroundColor: 'rgba(0,0,0,0.55)' }}
              >
                <span
                  style={{
                    display: 'block',
                    width: `${Math.round(seg.belief * 100)}%`,
                    height: '100%',
                    // v3: danger ist Tinte — auf dem dunklen Sockel das helle v2-Rot.
                    backgroundColor: seg.belief > 0.6 ? '#E5484D' : seg.belief > 0.4 ? StoryModeColors.warning : '#6a8a6a',
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

export function BroadcastBar({ audience, expanded, onToggle, wohnzimmerAlphabet }: BroadcastBarProps) {
  const item = audience.lastItem;
  const quote = audience.lastReaction?.quote ?? 0;
  const reach = audience.lastReaction ? audience.lastReaction.reactions.reduce((s, r) => s + r.reach, 0) : 0;

  // Dauer-Streifen, solange nicht ausgeklappt (permanent sichtbar, 2d).
  if (!expanded) return <CollapsedStrip audience={audience} onToggle={onToggle} />;

  return (
    <div
      className="relative w-full z-30"
      style={{
        height: 224,
        flexShrink: 0,
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
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6, fontFamily: "'VT323', monospace" }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: StoryModeFonts.label, fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#c8c8b8' }}>● MINISTERIUM SENDET</span>
          {item && (
            <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', color: '#0d0d0d', backgroundColor: TIER_COLOR[item.tier] }}>
              {TIER_LABEL[item.tier]}
            </span>
          )}
          <button
            onClick={onToggle}
            aria-label="Wohnzimmer einklappen (Taste B)"
            title="Einklappen (B)"
            style={{ marginLeft: 'auto', fontSize: 12, color: '#ccc', border: '2px solid #555', padding: '6px 14px', minHeight: 32, background: 'transparent', cursor: 'pointer' }}
          >
            ▾ B
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
              // v3: danger ist Tinte — Gegenreaktion auf der dunklen Leiste in hellem v2-Rot.
              <div key={h.id} style={{ fontSize: 11, color: h.kind === 'gegenreaktion' ? '#E5484D' : '#9aa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {h.kind === 'gegenreaktion' ? '' : '●'} [{h.tier.toUpperCase()}] {h.headline}
              </div>
            ))
          )}
        </div>
      </div>

      <AudienceRoom audience={audience} wohnzimmerAlphabet={wohnzimmerAlphabet} />
    </div>
  );
}

export default BroadcastBar;
