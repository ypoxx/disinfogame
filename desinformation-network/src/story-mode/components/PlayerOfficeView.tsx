/**
 * PlayerOfficeView — Spielerbüro als begehbarer Pixel-Art-Raum.
 *
 * Das generierte Raumfoto (room_spieler_buero, 1344×768) dient als
 * Vollbild-Hintergrund; darüber liegt EIN SVG in Bild-Koordinaten mit
 * präzisen Möbel-Polygonen als Klickzonen (PLAN 2026-07-07, N1) — kein
 * %-vom-Container-Raster mehr, das bei Layout-Änderungen von den Möbeln
 * driftete. Kein CSS-Nachbau der Möbel.
 */
import { useState, useCallback, useRef } from 'react';
import { Icon } from './Icon';
import { StoryModeColors, stampCtaStyle, stampCtaClass } from '../theme';
import { useAssets } from '../assets/useAssets';
import { useElementSize, useNaturalSize, usePixelCover } from '../hooks/usePixelFit';
import { playSound } from '../utils/SoundSystem';
import { usePlayerProfile, playerPortraitAssetId, playerPortraitImgStyle } from '../stores/playerProfileStore';
import {
  OFFICE_HOTSPOTS,
  OFFICE_IMG,
  OFFICE_DECOR,
  clampAnchor,
  coverTransform,
  hotspotAnchor,
  imgToContainer,
  polygonBBox,
  rectToContainer,
  svgPoints,
  visibleFraction,
  type CoverTransform,
  type OfficeHotspotDef,
  type OfficeHotspotId,
} from './officeHotspots';

// ─── Typen ────────────────────────────────────────────────────────────────────

interface PlayerOfficeViewProps {
  onOpenActions: () => void;
  onOpenNews: () => void;
  /** Wand-Monitor → Lagebild-Übersicht (Strang 2/2e). */
  onOpenLagebild: () => void;
  onOpenNpcs: () => void;
  /** Pinnwand → Narrativ-Tafel (Sendeplan, Strang 2/2f). */
  onOpenBoard: () => void;
  onOpenEvents: () => void;
  onEndPhase: () => void;
  onExitToBuilding: () => void;
  unreadNewsCount: number;
  worldEventCount: number;
  /** N3: angeheftete Maßnahmen — Zähler-Badge an der Narrativ-Tafel. */
  pinnedActionCount?: number;
  /** Erste Sitzung: nummerierte Hinweis-Marker einblenden. */
  showTutorialHints?: boolean;
}

// ─── Keyframes (Präfix po-) ───────────────────────────────────────────────────

const KEYFRAMES = `
  @keyframes po-screen-flicker {
    0%,100% { opacity: 0.10; }
    20%      { opacity: 0.05; }
    40%      { opacity: 0.18; }
    60%      { opacity: 0.08; }
    80%      { opacity: 0.14; }
  }
  @keyframes po-crt-glow {
    0%,100% { box-shadow: 0 0 6px 2px rgba(0,220,80,0.18); }
    50%     { box-shadow: 0 0 14px 5px rgba(0,220,80,0.38); }
  }
  @keyframes po-badge-pulse {
    0%,100% { transform: scale(1);   }
    50%     { transform: scale(1.18); }
  }
  @keyframes po-hint-pulse {
    0%,100% { transform: scale(1);    opacity: 1;   }
    50%     { transform: scale(1.12); opacity: 0.8; }
  }
`;

// Tutorial-Marker (Computer, Pinnwand, Wand-Monitor)
interface TutorialMarker {
  hotspotId: OfficeHotspotId;
  num: string;
  text: string;
}
const TUTORIAL_MARKERS: TutorialMarker[] = [
  { hotspotId: 'computer', num: '①', text: 'Aktionen planen' },
  { hotspotId: 'board',    num: '②', text: 'Tafel planen'    },
  { hotspotId: 'tv',       num: '③', text: 'Lagebild'        },
];

// Label-Chip-Farbe je Hotspot — Record statt switch: ein neuer Hotspot ohne
// Farbeintrag ist damit ein Compile-Fehler, kein stiller Default.
const CHIP_COLOR: Record<OfficeHotspotId, string> = {
  computer: StoryModeColors.ministryRed,
  phone:    StoryModeColors.warning,
  board:    StoryModeColors.agencyBlue,
  files:    StoryModeColors.danger,
  tv:       StoryModeColors.agencyBlue,
  window:   StoryModeColors.militaryOlive,
  exit:     StoryModeColors.concrete,
};

// ─── Hilfskomponenten ─────────────────────────────────────────────────────────

/** Vier dezente Eck-Marken (┌ ┐ └ ┘) an der Polygon-BBox als Ruhe-Hinweis. */
function CornerTicks({ hs }: { hs: OfficeHotspotDef }): React.JSX.Element {
  const b = polygonBBox(hs.polygon);
  const len = 12; // Bild-px
  const c = 'rgba(240,180,41,0.45)';
  const corners = [
    `M ${b.x} ${b.y + len} L ${b.x} ${b.y} L ${b.x + len} ${b.y}`,
    `M ${b.x + b.w - len} ${b.y} L ${b.x + b.w} ${b.y} L ${b.x + b.w} ${b.y + len}`,
    `M ${b.x + b.w} ${b.y + b.h - len} L ${b.x + b.w} ${b.y + b.h} L ${b.x + b.w - len} ${b.y + b.h}`,
    `M ${b.x + len} ${b.y + b.h} L ${b.x} ${b.y + b.h} L ${b.x} ${b.y + b.h - len}`,
  ];
  return (
    <>
      {corners.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={c}
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
          pointerEvents="none"
        />
      ))}
    </>
  );
}

// ─── Komponente ───────────────────────────────────────────────────────────────

export function PlayerOfficeView({
  onOpenActions,
  onOpenNews,
  onOpenLagebild,
  onOpenNpcs,
  onOpenBoard,
  onOpenEvents,
  onEndPhase,
  onExitToBuilding,
  unreadNewsCount,
  worldEventCount,
  pinnedActionCount = 0,
  showTutorialHints = false,
}: PlayerOfficeViewProps): React.JSX.Element {
  const assets = useAssets();
  const bgUrl = assets.imageUrl('room_spieler_buero');

  // (B1) Pixel-sauberer Cover-Snap statt freiem `cover` (≈ ×0,94 = Matsch).
  const containerRef = useRef<HTMLDivElement>(null);
  const areaSize = useElementSize(containerRef);
  const bgNat = useNaturalSize(bgUrl);
  const bgSnap = usePixelCover(areaSize, bgNat);

  // Bild→Container-Transformation. Ohne Snap (kein Asset, Ladefehler ODER Bild
  // noch unterwegs) bleiben die Zonen bedienbar (A1): contain-zentriert — die
  // alte Bedingung `!bgUrl` ließ das Büro bei einem 404 dauerhaft ohne einen
  // einzigen Hotspot zurück (Review-Befund A1/B2).
  const t: CoverTransform | null = (() => {
    if (bgSnap) return coverTransform(areaSize, bgSnap);
    if (areaSize.w > 0 && areaSize.h > 0) {
      const s = Math.min(areaSize.w / OFFICE_IMG.w, areaSize.h / OFFICE_IMG.h);
      return coverTransform(areaSize, { width: OFFICE_IMG.w * s, height: OFFICE_IMG.h * s });
    }
    return null;
  })();

  // Cover-Beschnitt-Wächter: Zonen, die (fast) ganz außerhalb liegen — Tür bei
  // schmalen, Wand-Monitor/Korkbrett bei flachen Flächen — bekommen einen
  // Ersatz-Knopf in der Unterleiste, statt stumm zu verschwinden (A2/B3/C3).
  const croppedHotspots = t
    ? OFFICE_HOTSPOTS.filter((hs) => visibleFraction(hs, t, areaSize) < 0.25)
    : [];

  const [hoveredId, setHoveredId] = useState<OfficeHotspotId | null>(null);
  const [tutorialVisible, setTutorialVisible] = useState<boolean>(showTutorialHints);

  // Jeder Hotspot-Klick blendet Tutorial aus.
  const dismissTutorial = useCallback((): void => {
    setTutorialVisible(false);
  }, []);

  // Klick-Handler je Hotspot
  const handleClick = useCallback(
    (id: OfficeHotspotId): void => {
      dismissTutorial();
      switch (id) {
        case 'computer': playSound('typewriter'); onOpenActions();   break;
        case 'phone':    playSound('click');      onOpenNpcs();      break;
        case 'board':    playSound('paper');      onOpenBoard();     break;
        case 'files':    playSound('paper');      onOpenNews();      break;
        case 'tv':       playSound('tvOn');       onOpenLagebild();  break;
        case 'window':   playSound('click');      onOpenEvents();    break;
        case 'exit':     playSound('doorOpen');   onExitToBuilding();break;
      }
    },
    [dismissTutorial, onOpenActions, onOpenNpcs, onOpenBoard, onOpenNews, onOpenLagebild, onOpenEvents, onExitToBuilding],
  );

  // Badge-Zähler je Hotspot
  const badgeFor = (id: OfficeHotspotId): number => {
    if (id === 'files') return unreadNewsCount;
    if (id === 'window') return worldEventCount;
    if (id === 'board') return pinnedActionCount;
    return 0;
  };

  const crt = t ? rectToContainer(OFFICE_DECOR.crtScreen, t) : null;
  const wall = t ? rectToContainer(OFFICE_DECOR.wallScreen, t) : null;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        fontFamily: "'VT323', monospace",
        backgroundColor: '#1a1a1a',
      }}
    >
      {/* Globale Keyframes */}
      <style>{KEYFRAMES}</style>

      {/* Hintergrund — Pixel-Art-Raum */}
      {bgUrl ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${bgUrl})`,
            // (B1) Ganzzahl-/Stammbruch-Faktor statt freiem `cover`;
            // Fallback vor Bildmaß-Kenntnis = bisheriges cover (ein Frame lang).
            backgroundSize: bgSnap ? `${bgSnap.width}px ${bgSnap.height}px` : 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center bottom',
            imageRendering: 'pixelated',
          }}
        />
      ) : (
        /* Fallback: dunkle Fläche — KEIN CSS-Nachbau des alten OfficeScreen */
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: StoryModeColors.background,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* v3: dunkler Träger → heller Papier-Ton statt Tinten-Token. */}
          <span style={{ color: StoryModeColors.lightConcrete, fontSize: 14 }}>
            Büro wird geladen…
          </span>
        </div>
      )}

      {/* Mikro-Animationen — in Bild-Koordinaten verankert (kein Drift):
          CRT-Glühen auf dem Röhrenschirm, Flackern auf dem Wand-Monitor. */}
      {crt && (
        <div
          style={{
            position: 'absolute',
            ...crt,
            borderRadius: 2,
            pointerEvents: 'none',
            animation: hoveredId === 'computer' ? undefined : 'po-crt-glow 2.4s ease-in-out infinite',
            zIndex: 2,
          }}
        />
      )}
      {wall && (
        <div
          style={{
            position: 'absolute',
            ...wall,
            backgroundColor: '#c8d8ff',
            opacity: 0.1,
            pointerEvents: 'none',
            animation: 'po-screen-flicker 1.3s steps(3) infinite',
            zIndex: 2,
          }}
        />
      )}

      {/* Klickzonen: EIN SVG in Bild-Koordinaten über der gesnappten Bildfläche.
          Treffer-Fläche = Möbel-Polygon (nicht BBox); Hover/Fokus = Kontur. */}
      {t && (
        <svg
          viewBox={`0 0 ${OFFICE_IMG.w} ${OFFICE_IMG.h}`}
          preserveAspectRatio="none"
          style={{
            position: 'absolute',
            left: t.offsetX,
            top: t.offsetY,
            width: OFFICE_IMG.w * t.scaleX,
            height: OFFICE_IMG.h * t.scaleY,
            zIndex: 10,
            overflow: 'visible',
          }}
        >
          {OFFICE_HOTSPOTS.map((hs) => {
            const isHovered = hoveredId === hs.id;
            return (
              <g key={hs.id}>
                {/* Ruhe-Hinweis: nur vier kleine Ecken statt voller Rahmen */}
                {!isHovered && <CornerTicks hs={hs} />}
                <polygon
                  points={svgPoints(hs.polygon)}
                  role="button"
                  tabIndex={0}
                  aria-label={hs.label}
                  onClick={() => handleClick(hs.id)}
                  onMouseEnter={() => setHoveredId(hs.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onFocus={() => setHoveredId(hs.id)}
                  onBlur={() => setHoveredId(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleClick(hs.id);
                    }
                  }}
                  fill={isHovered ? 'rgba(255,255,255,0.08)' : 'transparent'}
                  stroke={isHovered ? '#F0B429' : 'none'}
                  strokeWidth={2}
                  vectorEffect="non-scaling-stroke"
                  style={{ cursor: 'pointer', outline: 'none', pointerEvents: 'all' }}
                >
                  <title>{hs.label}</title>
                </polygon>
              </g>
            );
          })}
        </svg>
      )}

      {/* Chips, Badges, Tutorial-Marker — HTML über dem SVG, per Transformation
          an den Polygon-Ankern ausgerichtet. */}
      {t && OFFICE_HOTSPOTS.map((hs) => {
        // Beschnittene Zonen: Chip/Badge übernimmt der Ersatz-Knopf der Unterleiste.
        if (croppedHotspots.includes(hs)) return null;
        // Anker/Badge-Ecke in den Sichtbereich clampen — der Cover-Beschnitt darf
        // Hinweise nicht unsichtbar machen (Befunde A3/A4).
        const anchor = clampAnchor(imgToContainer(hotspotAnchor(hs), t), areaSize);
        const badge = badgeFor(hs.id);
        const bbox = polygonBBox(hs.polygon);
        const corner = clampAnchor(imgToContainer([bbox.x + bbox.w, bbox.y], t), areaSize, 14, 14);
        return (
          <div key={hs.id} style={{ pointerEvents: 'none' }}>
            {/* Label-Chip (erscheint bei Hover/Fokus) */}
            {hoveredId === hs.id && (
              <span
                style={{
                  position: 'absolute',
                  left: anchor.x,
                  top: anchor.y - 8,
                  transform: 'translate(-50%, -100%)',
                  whiteSpace: 'nowrap',
                  backgroundColor: '#0d0d0d',
                  color: '#e8e4d8',
                  border: `2px solid ${CHIP_COLOR[hs.id]}`,
                  padding: '2px 8px',
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: "'VT323', monospace",
                  letterSpacing: 1,
                  zIndex: 20,
                  imageRendering: 'pixelated',
                }}
              >
                {hs.label}
              </span>
            )}

            {/* Badge (roter Zähler) an der BBox-Ecke oben rechts */}
            {badge > 0 && (
              <span
                style={{
                  position: 'absolute',
                  left: corner.x,
                  top: corner.y,
                  transform: 'translate(-50%, -50%)',
                  minWidth: 20,
                  height: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: StoryModeColors.danger,
                  border: '2px solid #000',
                  borderRadius: '50%',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: "'VT323', monospace",
                  padding: '0 3px',
                  zIndex: 21,
                  animation: 'po-badge-pulse 1.6s ease-in-out infinite',
                }}
              >
                {badge}
              </span>
            )}
          </div>
        );
      })}

      {/* Tutorial-Hints (nummerierte Marker) */}
      {t && tutorialVisible && TUTORIAL_MARKERS.map((marker) => {
        const hs = OFFICE_HOTSPOTS.find((h) => h.id === marker.hotspotId);
        if (!hs || croppedHotspots.includes(hs)) return null;
        // Marker ist ~44 px hoch und hängt ÜBER dem Anker → y-Clamp entsprechend.
        const anchor = clampAnchor(imgToContainer(hotspotAnchor(hs), t), areaSize, 70, 48);
        return (
          <div
            key={marker.hotspotId}
            style={{
              position: 'absolute',
              left: anchor.x,
              top: anchor.y,
              transform: 'translate(-50%, -100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              pointerEvents: 'none',
              zIndex: 30,
              animation: 'po-hint-pulse 2s ease-in-out infinite',
            }}
          >
            {/* v3: warning ist Marker-Tinte — Tutorial-Marker über dem Foto in hellem v2-Amber. */}
            <span
              style={{
                fontSize: 20,
                color: '#F0B429',
                textShadow: '0 0 6px #000, 1px 1px 0 #000',
                fontWeight: 900,
              }}
            >
              {marker.num}
            </span>
            <span
              style={{
                backgroundColor: 'rgba(0,0,0,0.82)',
                color: '#e8e4d8',
                border: `1px solid #F0B429`,
                padding: '1px 5px',
                fontSize: 10,
                fontFamily: "'VT323', monospace",
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              {marker.text}
            </span>
          </div>
        );
      })}

      {/* „Verstanden"-Button (nur wenn Tutorial sichtbar) */}
      {tutorialVisible && (
        <button
          onClick={() => setTutorialVisible(false)}
          style={{
            position: 'absolute',
            // Unter dem Eck-Cluster (Uhr/Pause/HUD, N0) — top-12 kollidierte damit.
            top: 52,
            right: 12,
            backgroundColor: StoryModeColors.militaryOlive,
            border: `2px solid ${StoryModeColors.darkOlive}`,
            color: '#e8e4d8',
            padding: '4px 10px',
            fontSize: 11,
            fontFamily: "'VT323', monospace",
            fontWeight: 700,
            cursor: 'pointer',
            zIndex: 40,
          }}
        >
          Verstanden ✓
        </button>
      )}

      {/* Untere Leiste — halbtransparente Schreibtischkante */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 16px',
          backgroundColor: 'rgba(20,18,14,0.82)',
          borderTop: `3px solid ${StoryModeColors.border}`,
          zIndex: 15,
        }}
      >
        {/* Ausgang ist diegetisch: Glastür-Polygon am linken Bildrand. */}

        {/* Dienstausweis — gewähltes Spieler-Porträt + Name (K10/D27) */}
        <Dienstausweis />

        {/* Ersatz-Knöpfe für Zonen, die der Cover-Beschnitt aus dem Sichtfeld
            geschoben hat (schmale/flache Flächen) — sonst hätte das Büro z. B.
            keinen Ausgang mehr (A1; Befunde A2/B3/C3). */}
        {croppedHotspots.length > 0 && (
          <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
            {croppedHotspots.map((hs) => {
              const badge = badgeFor(hs.id);
              return (
                <button
                  key={hs.id}
                  onClick={() => handleClick(hs.id)}
                  style={{
                    backgroundColor: 'rgba(10,10,14,0.6)',
                    border: `2px solid ${CHIP_COLOR[hs.id]}`,
                    color: '#e8e4d8',
                    padding: '3px 8px',
                    fontSize: 11,
                    fontFamily: "'VT323', monospace",
                    fontWeight: 700,
                    letterSpacing: 1,
                    cursor: 'pointer',
                  }}
                >
                  {hs.label}{badge > 0 ? ` (${badge})` : ''}
                </button>
              );
            })}
          </span>
        )}

        {/* Feierabend: Tag beenden (diegetischer Heimweg-Auslöser) */}
        <button
          onClick={onEndPhase}
          className={stampCtaClass}
          style={{
            ...stampCtaStyle,
            padding: '6px 20px',
            fontSize: 13,
            fontFamily: "'VT323', monospace",
            fontWeight: 900,
            cursor: 'pointer',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.35)',
            letterSpacing: 2,
          }}
        >
          FEIERABEND →
        </button>
      </div>
    </div>
  );
}

/** Kleiner Dienstausweis in der Schreibtischkante: „das bin ich". */
function Dienstausweis(): React.JSX.Element {
  const assets = useAssets();
  const name = usePlayerProfile((s) => s.name);
  const portraitId = usePlayerProfile((s) => s.portraitId);
  const url = assets.imageUrl(playerPortraitAssetId(portraitId));
  return (
    <div
      title="Dienstausweis"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '3px 10px 3px 3px',
        backgroundColor: 'rgba(10,10,14,0.6)',
        border: `1px solid ${StoryModeColors.borderLight}`,
      }}
    >
      <span
        style={{
          width: 28,
          height: 28,
          flexShrink: 0,
          backgroundColor: StoryModeColors.background,
          border: `1px solid ${StoryModeColors.border}`,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {url ? (
          <img src={url} alt="" style={playerPortraitImgStyle(portraitId)} />
        ) : (
          <Icon name="npcs" size={16} />
        )}
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
        {/* v3: dunkler Ausweis-Grund → helle Papier-Töne statt Tinten-Token. */}
        <span style={{ fontSize: 10, color: StoryModeColors.lightConcrete, letterSpacing: 1 }}>SONDEROPERATIONEN</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: StoryModeColors.document, fontFamily: "'VT323', monospace" }}>{name}</span>
      </span>
    </div>
  );
}

export default PlayerOfficeView;
