/**
 * ArrivalSequence — überspringbare Ankunfts-Sequenz (~15 s).
 *
 * Avatar betritt die Lobby, fährt mit dem Fahrstuhl zur Etage 1, läuft zur
 * Tür der Zentrale. Danach feuert `onDone` (einmalig, auch bei Skip).
 * Kino-Look: Letterbox-Balken + wechselnde Schreibmaschinen-Caption.
 */
import { useEffect, useRef } from 'react';
import { BuildingStage, type StageNpc } from '../building/BuildingStage';
import { useNavigator, resetAvatarPosition } from '../building/useNavigator';
import { entryPosition } from '../building/BuildingNavigator';

export interface ArrivalSequenceProps {
  npcs: StageNpc[];
  onDone: () => void;
}

/** Globale Keyframes (Präfix as-). */
const ARRIVAL_KEYFRAMES = `
  @keyframes as-letterbox-in {
    0%   { transform: scaleY(0); }
    100% { transform: scaleY(1); }
  }
  @keyframes as-caption-fade {
    0%   { opacity: 0; }
    15%  { opacity: 1; }
    85%  { opacity: 1; }
    100% { opacity: 0; }
  }
`;

/** Letterbox-Höhe oben/unten in Prozent (kinematisch). */
const LETTERBOX_PCT = 10;

export function ArrivalSequence({ npcs, onDone }: ArrivalSequenceProps): JSX.Element {
  // Position vor dem ersten Render auf den Lobby-Eingang setzen —
  // resetAvatarPosition schreibt nur in den modulweiten lastPosition-Speicher,
  // daher ist hier kein Effect nötig; useNavigator liest den Wert sofort.
  resetAvatarPosition(entryPosition());
  const nav = useNavigator(entryPosition());

  // Guard: onDone nur EINMAL feuern, egal ob Route abgelaufen oder Skip.
  const doneFired = useRef(false);

  const fireDone = (): void => {
    if (doneFired.current) return;
    doneFired.current = true;
    onDone();
  };

  // Route starten: kurze Verzögerung, damit der Spieler die Lobby sieht.
  useEffect(() => {
    const id = window.setTimeout(() => {
      nav.goTo('zentrale', () => fireDone());
    }, 1400); // Lobby erst als Bild wirken lassen (Review-Befund B3)
    return () => window.clearTimeout(id);
  // nav.goTo ist stabil (useCallback in useNavigator); onDone über fireDone gekapselt.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Skip: Tastatur (Escape, Enter, Leertaste) + Klick auf die Bühne.
  const handleSkip = (): void => {
    nav.skip();   // skip() ruft den goTo-Callback selbst → fireDone wird dort ausgelöst.
    fireDone();   // Fallback falls skip ohne Callback (kein goTo aktiv).
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  // handleSkip ist in der Closure stabil (kein State-Dep).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Caption-Text: wechselt je nach Navigations-Modus und Etage.
  const caption = resolveCaption(nav.mode, nav.pos.floorLevel);

  return (
    <div
      role="application"
      aria-label="Ankunfts-Sequenz — Klick, Escape oder Enter überspringt"
      style={{
        position: 'fixed',
        inset: 0,
        background: '#05070d',
        overflow: 'hidden',
      }}
      // Klick auf die Bühne → Skip.
      onClick={handleSkip}
    >
      <style>{ARRIVAL_KEYFRAMES}</style>

      {/* Vollbild-Bühne (passiv, kein onRoomClick). */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <BuildingStage npcs={npcs} nav={nav} interactive={false} />
      </div>

      {/* Letterbox oben */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: `${LETTERBOX_PCT}%`,
          backgroundColor: '#000',
          transformOrigin: 'top center',
          animation: 'as-letterbox-in .55s cubic-bezier(.4,0,.2,1) both',
          zIndex: 20,
        }}
      />

      {/* Letterbox unten + Caption */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: `${LETTERBOX_PCT}%`,
          backgroundColor: '#000',
          transformOrigin: 'bottom center',
          animation: 'as-letterbox-in .55s cubic-bezier(.4,0,.2,1) both',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          key={caption}
          aria-live="polite"
          style={{
            color: '#c8c8b8',
            fontSize: 'clamp(.65rem, 1.8vw, .9rem)',
            letterSpacing: '0.12em',
            fontFamily: 'monospace',
            animation: 'as-caption-fade .6s ease both',
          }}
        >
          {caption}
        </span>
      </div>

      {/* Skip-Button oben rechts */}
      <button
        onClick={(e): void => {
          e.stopPropagation(); // Klick nicht doppelt an handleSkip weiterleiten.
          handleSkip();
        }}
        aria-label="Sequenz überspringen"
        style={{
          position: 'absolute',
          top: `calc(${LETTERBOX_PCT}% + 12px)`,
          right: 16,
          zIndex: 30,
          background: 'rgba(0,0,0,.6)',
          border: '2px solid rgba(200,200,184,.3)',
          color: 'rgba(200,200,184,.7)',
          fontSize: '0.75rem',
          letterSpacing: '0.1em',
          padding: '5px 12px',
          cursor: 'pointer',
          fontFamily: 'inherit',
          transition: 'color 120ms, border-color 120ms',
        }}
        onMouseEnter={(e): void => {
          (e.currentTarget as HTMLButtonElement).style.color = '#c8c8b8';
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(200,200,184,.7)';
        }}
        onMouseLeave={(e): void => {
          (e.currentTarget as HTMLButtonElement).style.color = 'rgba(200,200,184,.7)';
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(200,200,184,.3)';
        }}
      >
        ÜBERSPRINGEN ✕
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Caption-Auflösung (mode + Etage → Schreibmaschinen-Text)
// ---------------------------------------------------------------------------

function resolveCaption(mode: string, floorLevel: number): string {
  if (mode === 'ride') {
    return 'Der Aufzug ächzt. Irgendwo über Ihnen rattert ein Fernschreiber.';
  }
  if (mode === 'door') {
    return 'Zimmer 1-01. Der Direktor erwartet Sie.';
  }
  // idle oder walk — Etage 0 = Lobby.
  if (Math.round(floorLevel) === 0) {
    return 'Ihr erster Arbeitstag. Der Pförtner sieht nicht auf — Ihr Name steht bereits auf der Liste.';
  }
  // Höhere Etagen (walk/idle nach Fahrstuhl).
  return 'Etage 1 — Abteilung für Sonderoperationen. Der Flur riecht nach kaltem Kaffee.';
}

export default ArrivalSequence;
