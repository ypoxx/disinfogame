/**
 * TitleScreen — Vollbild-Titelbildschirm von „OPERATION: WESTUNION".
 *
 * Pixel-Art-Nachtbild des Ministeriums-Turms als Hintergrund (Asset-first,
 * dunkler Verlauf als Fallback). Sound-Toggle + Browser-Hinweis + Version.
 * Tastatur und Maus bedienbar; Enter löst den ersten Menüeintrag aus.
 */
import { useEffect, useRef, useState } from 'react';
import { useAssets } from '../assets/useAssets';
import { StoryModeColors, StoryModeFonts } from '../theme';
import { isSoundEnabled, setSoundEnabled, playMusic } from '../utils/SoundSystem';
import { GAME_VERSION, BUILD_STAMP, CHANGELOG } from '../version';

// ---------------------------------------------------------------------------
// Changelog-Overlay (H48) — Pixel/Brutalist-Stil, aria-modal, Escape-schließt.
// ---------------------------------------------------------------------------

function ChangelogOverlay({ onClose }: { onClose: () => void }): JSX.Element {
  // Escape schließt das Overlay.
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Changelog"
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        backgroundColor: 'rgba(0,0,0,0.82)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          backgroundColor: StoryModeColors.surface,
          border: `4px solid ${StoryModeColors.border}`,
          boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.06), inset 0 -3px 0 rgba(0,0,0,0.5)',
          minWidth: 340,
          maxWidth: 480,
          width: '90%',
          fontFamily: "'VT323', monospace",
        }}
      >
        {/* Kopfzeile */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 16px',
            borderBottom: `4px solid ${StoryModeColors.border}`,
            backgroundColor: StoryModeColors.agencyBlue,
          }}
        >
          <span
            style={{
              color: StoryModeColors.warning,
              fontWeight: 700,
              letterSpacing: '0.1em',
              fontSize: '0.9rem',
            }}
          >
            CHANGELOG
          </span>
          <button
            onClick={onClose}
            aria-label="Changelog schließen"
            style={{
              background: 'none',
              border: `2px solid ${StoryModeColors.borderLight}`,
              color: StoryModeColors.textSecondary,
              cursor: 'pointer',
              fontFamily: "'VT323', monospace",
              fontSize: '1rem',
              lineHeight: 1,
              padding: '2px 8px',
              transition: 'color 120ms, border-color 120ms',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = '#fff';
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#fff';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = StoryModeColors.textSecondary;
              (e.currentTarget as HTMLButtonElement).style.borderColor = StoryModeColors.borderLight;
            }}
          >
            ✕
          </button>
        </div>

        {/* Einträge */}
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 16, maxHeight: '60vh', overflowY: 'auto' }}>
          {CHANGELOG.map((entry) => (
            <div key={entry.version}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'baseline', marginBottom: 6 }}>
                <span style={{ color: StoryModeColors.warning, fontWeight: 700, fontSize: '0.85rem' }}>
                  v{entry.version}
                </span>
                <span style={{ color: StoryModeColors.textMuted, fontSize: '0.75rem' }}>
                  {entry.date}
                </span>
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, listStyle: 'disc' }}>
                {entry.points.map((point, i) => (
                  <li
                    key={i}
                    style={{ color: StoryModeColors.textPrimary, fontSize: '0.8rem', lineHeight: 1.6 }}
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export interface TitleScreenProps {
  onNewGame: () => void;
  onContinue: () => void;
  hasSave: boolean;
}

/** Einmalige CSS-Keyframes (Präfix ts-). */
const TITLE_KEYFRAMES = `
  @keyframes ts-flicker {
    0%,100% { opacity: 1; }
    10%      { opacity: .92; }
    20%      { opacity: 1; }
    42%      { opacity: .6; }
    44%      { opacity: 1; }
    76%      { opacity: .85; }
    78%      { opacity: 1; }
  }
  @keyframes ts-nebel-a {
    0%   { transform: translateX(0%); }
    50%  { transform: translateX(-12%); }
    100% { transform: translateX(0%); }
  }
  @keyframes ts-nebel-b {
    0%   { transform: translateX(0%); }
    50%  { transform: translateX(10%); }
    100% { transform: translateX(0%); }
  }
  @keyframes ts-fade-slide {
    0%   { opacity: 0; transform: translateY(14px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes ts-emblem-in {
    0%   { opacity: 0; transform: scale(.6); }
    70%  { opacity: 1; transform: scale(1.05); }
    100% { opacity: 1; transform: scale(1); }
  }
`;

export function TitleScreen({ onNewGame, onContinue, hasSave }: TitleScreenProps): JSX.Element {
  const assets = useAssets();
  const bgUrl = assets.imageUrl('building_exterior');

  // Lokaler Spiegel des Sound-Zustands (SoundSystem ist kein React-Store).
  const [soundOn, setSoundOn] = useState<boolean>(() => isSoundEnabled());
  // H48: Changelog-Overlay-Zustand.
  const [showChangelog, setShowChangelog] = useState(false);

  // Musik nur EINMAL beim ersten Klick auf den Container starten.
  const musicStarted = useRef(false);

  const handleMusicStart = (): void => {
    if (musicStarted.current) return;
    musicStarted.current = true;
    playMusic('music_theme_main');
  };

  const handleSoundToggle = (): void => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    // Wenn Ton gerade eingeschaltet: Musik gleich starten.
    if (next) {
      musicStarted.current = true;
      playMusic('music_theme_main');
    }
  };

  // Tastatur: Enter löst den obersten Menü-Eintrag aus.
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Enter') {
        handleMusicStart();
        if (hasSave) {
          onContinue();
        } else {
          onNewGame();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSave, onContinue, onNewGame]);

  // Hintergrund-Stil: Pixel-Art-Bild oder dunkler Verlauf.
  const bgStyle: React.CSSProperties = bgUrl
    ? {
        backgroundImage: `url(${bgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        imageRendering: 'pixelated',
      }
    : {
        background: 'linear-gradient(180deg, #05070d 0%, #11131c 100%)',
      };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        overflow: 'hidden',
        ...bgStyle,
      }}
      // Erster Klick irgendwo aktiviert die Musik (Browser-Autoplay-Policy).
      onClickCapture={handleMusicStart}
    >
      <style>{TITLE_KEYFRAMES}</style>

      {/* Nebel-Drift — zwei überlagerte halbtransparente Verlaufs-Ebenen */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(5,7,13,.55) 0%, transparent 60%, rgba(5,7,13,.45) 100%)',
          animation: 'ts-nebel-a 40s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(270deg, rgba(17,19,28,.4) 0%, transparent 55%, rgba(17,19,28,.35) 100%)',
          animation: 'ts-nebel-b 47s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      {/* Dunkle Vignette für Lesbarkeit */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,.72) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Unterer Bereich: Emblem, Titel, Menü */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingBottom: '6vh',
          gap: 0,
          width: '100%',
          maxWidth: 520,
        }}
      >
        {/* Emblem */}
        <div
          aria-hidden
          style={{
            fontSize: 64,
            color: StoryModeColors.ministryRed,
            lineHeight: 1,
            marginBottom: 12,
            animation: 'ts-emblem-in .9s cubic-bezier(.22,1,.36,1) both',
            textShadow: `0 0 24px ${StoryModeColors.ministryRed}88`,
          }}
        >
          ⬢
        </div>

        {/* Haupttitel */}
        <h1
          style={{
            color: StoryModeColors.warning,
            // Press Start 2P (Headlines-Set): läuft deutlich breiter → kleinere clamp + engeres Tracking,
            // damit „OPERATION: WESTUNION" auf schmalen Schirmen nicht überläuft (Preview gegenprüfen).
            fontFamily: StoryModeFonts.display,
            fontSize: 'clamp(0.85rem, 3.4vw, 1.5rem)',
            letterSpacing: '0.04em',
            lineHeight: 1.35,
            textTransform: 'uppercase',
            margin: 0,
            marginBottom: 8,
            textAlign: 'center',
            animation: 'ts-flicker 3.5s ease-in-out 0.8s both, ts-fade-slide .6s ease .3s both',
            textShadow: `0 0 18px ${StoryModeColors.warning}66`,
          }}
        >
          OPERATION: WESTUNION
        </h1>

        {/* Untertitel */}
        <p
          style={{
            color: StoryModeColors.textSecondary,
            fontSize: '0.95rem',
            letterSpacing: '0.08em',
            margin: 0,
            marginBottom: 40,
            textAlign: 'center',
            animation: 'ts-fade-slide .6s ease .55s both',
            opacity: 0,
            animationFillMode: 'forwards',
          }}
        >
          Ein Desinformations-Planspiel
        </p>

        {/* Menü-Einträge */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            width: '100%',
            paddingInline: 24,
          }}
        >
          {/* „MISSION FORTSETZEN" erscheint NUR wenn hasSave, und zwar ZUERST */}
          {hasSave && (
            <MenuButton
              label="MISSION FORTSETZEN"
              onClick={onContinue}
              delay={0.7}
              ariaLabel="Gespeicherte Mission fortsetzen"
              accent={StoryModeColors.agencyBlue}
            />
          )}
          <MenuButton
            label="▶ NEUE MISSION"
            onClick={onNewGame}
            delay={hasSave ? 0.85 : 0.7}
            ariaLabel="Neue Mission starten"
            accent={StoryModeColors.ministryRed}
          />
        </div>

        {/* Sound-Toggle + Browser-Hinweis */}
        <div
          style={{
            marginTop: 36,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap',
            justifyContent: 'center',
            animation: 'ts-fade-slide .5s ease 1.1s both',
            opacity: 0,
            animationFillMode: 'forwards',
          }}
        >
          <button
            onClick={handleSoundToggle}
            aria-label={soundOn ? 'Ton ausschalten' : 'Ton einschalten'}
            style={{
              background: 'none',
              border: `2px solid ${StoryModeColors.borderLight}`,
              color: StoryModeColors.textSecondary,
              fontSize: '0.8rem',
              letterSpacing: '0.06em',
              padding: '5px 12px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'color 150ms, border-color 150ms',
            }}
            onMouseEnter={(e): void => {
              (e.currentTarget as HTMLButtonElement).style.color = StoryModeColors.textPrimary;
              (e.currentTarget as HTMLButtonElement).style.borderColor = StoryModeColors.textPrimary;
            }}
            onMouseLeave={(e): void => {
              (e.currentTarget as HTMLButtonElement).style.color = StoryModeColors.textSecondary;
              (e.currentTarget as HTMLButtonElement).style.borderColor = StoryModeColors.borderLight;
            }}
          >
            {soundOn ? 'TON AN' : 'TON AUS'}
          </button>
          <span
            style={{
              color: StoryModeColors.textMuted,
              fontSize: '0.72rem',
              letterSpacing: '0.04em',
            }}
          >
            Erstes Klicken aktiviert den Ton (Browser-Richtlinie)
          </span>
        </div>

        {/* Bildungszweck + Versionshinweis */}
        <p
          style={{
            marginTop: 16,
            padding: '6px 12px',
            border: `1px solid ${StoryModeColors.warning}`,
            color: StoryModeColors.warning,
            fontSize: '0.68rem',
            letterSpacing: '0.04em',
            textAlign: 'center',
            maxWidth: 480,
          }}
        >
          BILDUNGSZWECK: Dieses Spiel dient dem Verständnis von
          Desinformationstaktiken und deren Gegenmaßnahmen.
        </p>
        {/* H48: Versionsnummer klickbar → Changelog-Overlay */}
        <button
          onClick={() => setShowChangelog(true)}
          aria-label="Changelog öffnen"
          style={{
            marginTop: 10,
            background: 'none',
            border: 'none',
            color: StoryModeColors.textMuted,
            fontSize: '0.68rem',
            letterSpacing: '0.06em',
            textAlign: 'center',
            cursor: 'pointer',
            fontFamily: 'inherit',
            padding: 0,
            textDecoration: 'underline dotted',
            transition: 'color 150ms',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = StoryModeColors.textSecondary;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = StoryModeColors.textMuted;
          }}
        >
          v{GAME_VERSION} · Build {BUILD_STAMP} — Vorabversion für Testspieler
        </button>
      </div>

      {/* Changelog-Overlay */}
      {showChangelog && <ChangelogOverlay onClose={() => setShowChangelog(false)} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Interner Hilfs-Button (pixel/brutalist)
// ---------------------------------------------------------------------------

interface MenuButtonProps {
  label: string;
  onClick: () => void;
  delay: number;
  ariaLabel: string;
  accent: string;
}

function MenuButton({ label, onClick, delay, ariaLabel, accent }: MenuButtonProps): JSX.Element {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{
        position: 'relative',
        left: '50%',
        // Hover hebt den Button an (translate).
        transform: hovered
          ? 'translateY(-4px) translateX(-50%)'
          : 'translateY(0) translateX(-50%)',
        width: '100%',
        maxWidth: 340,
        padding: '14px 32px',
        fontSize: '1rem',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: '#fff',
        backgroundColor: accent,
        border: '4px solid #000',
        boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.15), inset 0 -4px 0 rgba(0,0,0,0.45)',
        filter: hovered ? 'brightness(1.12)' : undefined,
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'transform 120ms ease, box-shadow 120ms ease',
        // Stagger-fade-in — jeder Button versetzt.
        animation: `ts-fade-slide .45s ease ${delay}s both`,
        opacity: 0,
        animationFillMode: 'forwards',
        // Sichtbarer Fokus-Outline für Tastaturnutzung.
        outline: 'none',
      }}
      // Fokus-Ring via box-shadow statt outline (besser kontrollierbar).
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick();
      }}
    >
      {label}
      {/* Sichtbarer Fokus-Indikator (fokussiert = Outline sichtbar). */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          inset: -6,
          border: `2px solid ${accent}`,
          opacity: hovered ? 1 : 0,
          pointerEvents: 'none',
          transition: 'opacity 100ms',
        }}
      />
    </button>
  );
}

export default TitleScreen;
