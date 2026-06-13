/**
 * PlayerOfficeView — Spielerbüro als begehbarer Pixel-Art-Raum.
 *
 * Das generierte Raumfoto (room_spieler_buero, 1344×768) dient als
 * Vollbild-Hintergrund; darüber liegen unsichtbare Hotspot-Buttons, die
 * die bestehenden Seiten-Panels öffnen. Kein CSS-Nachbau der Möbel.
 */
import { useState, useCallback } from 'react';
import { Icon } from './Icon';
import { StoryModeColors } from '../theme';
import { useAssets } from '../assets/useAssets';
import { playSound } from '../utils/SoundSystem';
import { usePlayerProfile, playerPortraitAssetId } from '../stores/playerProfileStore';

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
  /** Erste Sitzung: nummerierte Hinweis-Marker einblenden. */
  showTutorialHints?: boolean;
}

/** Einzelner Hotspot — Position und Größe in % der Containerfläche. */
interface HotspotDef {
  id: string;
  label: string;
  left: number;   // % von links
  top: number;    // % von oben
  width: number;  // % Breite
  height: number; // % Höhe
}

// ─── Keyframes (Präfix po-) ───────────────────────────────────────────────────

const KEYFRAMES = `
  @keyframes po-tv-flicker {
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

// ─── Hotspot-Definitionen (Koordinaten anhand des Bildes room_spieler_buero) ──
//
// Bild 1344×768 px. Objekte und ihre ungefähren Pixel-Bereiche:
//   CRT-Terminal (Monitor + Tastatur):  ca. x 440–755 px, y 270–510 px → links≈33% top≈35% w≈24% h≈31%
//   Rotes Telefon auf dem Schreibtisch: ca. x 295–430 px, y 430–555 px → links≈22% top≈56% w≈10% h≈16%
//   Pinnwand/Korkbrett (an der Wand):   ca. x 200–560 px, y 50–385 px  → links≈15% top≈7%  w≈27% h≈43%
//   Akten/Bücher (rechts am Schreibt.): ca. x 730–900 px, y 430–530 px → links≈54% top≈56% w≈13% h≈13%
//   Fernseher (kleines Gerät rechts):   ca. x 1120–1300px, y 370–570px → links≈83% top≈48% w≈13% h≈26%
//   Fenster (Mitte, Jalousie):          ca. x 680–980 px, y 30–320 px  → links≈51% top≈4%  w≈22% h≈38%
//   Linker Bildrand (Poster/Ausgang):   ca. x 0–95 px,   y 0–768 px   → links≈0%  top≈0%  w≈7%  h≈100%

const HOTSPOTS: HotspotDef[] = [
  { id: 'computer', label: 'AKTIONEN PLANEN',     left: 33, top: 35, width: 24, height: 31 },
  { id: 'phone',    label: 'KONTAKTE',             left: 22, top: 56, width: 10, height: 16 },
  { id: 'board',    label: 'NARRATIV-TAFEL',        left: 15, top:  7, width: 27, height: 43 },
  { id: 'files',    label: 'NACHRICHTEN',          left: 54, top: 56, width: 13, height: 13 },
  { id: 'tv',       label: 'LAGEBILD',               left: 83, top: 48, width: 13, height: 26 },
  { id: 'window',   label: 'WELT-EREIGNISSE',      left: 51, top:  4, width: 22, height: 38 },
  // 2g: Diegetischer Ausgang über die Tür am linken Bildrand (ersetzt den
  // „GEBÄUDE"-Web-Button der Unterleiste — Bedienung diegetisch).
  { id: 'exit',     label: '← GEBÄUDE',             left:  0, top:  0, width:  6, height: 100 },
];

// Tutorial-Marker (Computer, Pinnwand, TV)
interface TutorialMarker {
  hotspotId: string;
  num: string;
  text: string;
}
const TUTORIAL_MARKERS: TutorialMarker[] = [
  { hotspotId: 'computer', num: '①', text: 'Aktionen planen' },
  { hotspotId: 'board',    num: '②', text: 'Tafel planen'    },
  { hotspotId: 'tv',       num: '③', text: 'Lagebild'       },
];

// ─── Hilfsfunktionen ──────────────────────────────────────────────────────────

function hotspotByIdPos(id: string): HotspotDef | undefined {
  return HOTSPOTS.find((h) => h.id === id);
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
  showTutorialHints = false,
}: PlayerOfficeViewProps): React.JSX.Element {
  const assets = useAssets();
  const bgUrl = assets.imageUrl('room_spieler_buero');

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tutorialVisible, setTutorialVisible] = useState<boolean>(showTutorialHints);

  // Jeder Hotspot-Klick blendet Tutorial aus.
  const dismissTutorial = useCallback((): void => {
    setTutorialVisible(false);
  }, []);

  // Klick-Handler je Hotspot
  const handleClick = useCallback(
    (id: string): void => {
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
  const badgeFor = (id: string): number => {
    if (id === 'files') return unreadNewsCount;
    if (id === 'window') return worldEventCount;
    return 0;
  };

  // Label-Chip-Farbe je Hotspot
  const chipColor = (id: string): string => {
    switch (id) {
      case 'computer': return StoryModeColors.ministryRed;
      case 'phone':    return StoryModeColors.warning;
      case 'board':    return StoryModeColors.agencyBlue;
      case 'files':    return StoryModeColors.danger;
      case 'tv':       return StoryModeColors.agencyBlue;
      case 'window':   return StoryModeColors.militaryOlive;
      case 'exit':     return StoryModeColors.concrete;
      default:         return StoryModeColors.surface;
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        fontFamily: 'monospace',
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
            backgroundSize: 'cover',
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
          <span style={{ color: StoryModeColors.textMuted, fontSize: 14 }}>
            Büro wird geladen…
          </span>
        </div>
      )}

      {/* Mikro-Animationen: TV-Flacker-Overlay */}
      <div
        style={{
          position: 'absolute',
          // TV-Bildfläche innerhalb des Hotspots (grobe Näherung: innere ~60%)
          left: '85%',
          top: '51%',
          width: '9%',
          height: '15%',
          backgroundColor: '#c8d8ff',
          opacity: 0.10,
          pointerEvents: 'none',
          animation: 'po-tv-flicker 1.3s steps(3) infinite',
          zIndex: 2,
        }}
      />

      {/* Mikro-Animation: CRT-Bildschirm-Glühen */}
      <div
        style={{
          position: 'absolute',
          left: '36%',
          top: '36%',
          width: '20%',
          height: '17%',
          borderRadius: 2,
          pointerEvents: 'none',
          animation: hoveredId === 'computer' ? undefined : 'po-crt-glow 2.4s ease-in-out infinite',
          zIndex: 2,
        }}
      />

      {/* Hotspots */}
      {HOTSPOTS.map((hs) => {
        const isHovered = hoveredId === hs.id;
        const badge = badgeFor(hs.id);
        const color = chipColor(hs.id);
        return (
          <button
            key={hs.id}
            onClick={() => handleClick(hs.id)}
            onMouseEnter={() => setHoveredId(hs.id)}
            onMouseLeave={() => setHoveredId(null)}
            onFocus={() => setHoveredId(hs.id)}
            onBlur={() => setHoveredId(null)}
            title={hs.label}
            aria-label={hs.label}
            style={{
              position: 'absolute',
              left: `${hs.left}%`,
              top: `${hs.top}%`,
              width: `${hs.width}%`,
              height: `${hs.height}%`,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              zIndex: 10,
              // Ruhezustand: dezenter Ring, damit Klickflächen ohne Hover erkennbar
              // bleiben (Review-Befund A2); Hover/Fokus: kräftige Outline + Inset.
              outline: isHovered ? `2px solid ${StoryModeColors.warning}` : '1px solid rgba(212,160,23,0.28)',
              outlineOffset: -1,
              boxShadow: isHovered ? 'inset 0 0 0 9999px rgba(255,255,255,0.08)' : 'none',
              transition: 'outline 120ms ease, box-shadow 120ms ease',
            }}
          >
            {/* Label-Chip (erscheint bei Hover/Fokus) */}
            {isHovered && (
              <span
                style={{
                  position: 'absolute',
                  bottom: '105%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  whiteSpace: 'nowrap',
                  backgroundColor: '#0d0d0d',
                  color: '#e8e4d8',
                  border: `2px solid ${color}`,
                  padding: '2px 8px',
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  letterSpacing: 1,
                  pointerEvents: 'none',
                  zIndex: 20,
                  imageRendering: 'pixelated',
                }}
              >
                {hs.label}
              </span>
            )}

            {/* Badge (roter Zähler) */}
            {badge > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
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
                  fontFamily: 'monospace',
                  pointerEvents: 'none',
                  zIndex: 21,
                  animation: 'po-badge-pulse 1.6s ease-in-out infinite',
                }}
              >
                {badge}
              </span>
            )}
          </button>
        );
      })}

      {/* Tutorial-Hints (nummerierte Marker) */}
      {tutorialVisible && TUTORIAL_MARKERS.map((marker) => {
        const hs = hotspotByIdPos(marker.hotspotId);
        if (!hs) return null;
        // Marker mittig über dem Hotspot
        const markerLeft = hs.left + hs.width / 2;
        const markerTop = hs.top;
        return (
          <div
            key={marker.hotspotId}
            style={{
              position: 'absolute',
              left: `${markerLeft}%`,
              top: `${markerTop}%`,
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              pointerEvents: 'none',
              zIndex: 30,
              animation: 'po-hint-pulse 2s ease-in-out infinite',
            }}
          >
            <span
              style={{
                fontSize: 20,
                color: StoryModeColors.warning,
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
                border: `1px solid ${StoryModeColors.warning}`,
                padding: '1px 5px',
                fontSize: 9,
                fontFamily: 'monospace',
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
            top: 12,
            right: 12,
            backgroundColor: StoryModeColors.militaryOlive,
            border: `2px solid ${StoryModeColors.darkOlive}`,
            color: '#e8e4d8',
            padding: '4px 10px',
            fontSize: 11,
            fontFamily: 'monospace',
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
        {/* Ausgang ist jetzt diegetisch: Tür-Hotspot am linken Bildrand (2g). */}

        {/* Dienstausweis — gewähltes Spieler-Porträt + Name (K10/D27) */}
        <Dienstausweis />

        {/* Feierabend: Tag beenden (diegetischer Heimweg-Auslöser) */}
        <button
          onClick={onEndPhase}
          style={{
            backgroundColor: StoryModeColors.ministryRed,
            border: `2px solid ${StoryModeColors.darkRed}`,
            color: '#fff',
            padding: '6px 20px',
            fontSize: 13,
            fontFamily: 'monospace',
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
          <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', imageRendering: 'pixelated' }} />
        ) : (
          <Icon name="npcs" size={16} />
        )}
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
        <span style={{ fontSize: 9, color: StoryModeColors.textSecondary, letterSpacing: 1 }}>SONDEROPERATIONEN</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: StoryModeColors.textPrimary, fontFamily: 'monospace' }}>{name}</span>
      </span>
    </div>
  );
}

export default PlayerOfficeView;
