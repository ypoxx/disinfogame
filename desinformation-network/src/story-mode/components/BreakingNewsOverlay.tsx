import { useState, useEffect, useCallback } from 'react';
import { StoryModeColors } from '../theme';
import { playSound } from '../utils/SoundSystem';

// ============================================
// BREAKING NEWS OVERLAY
// Full-screen news interrupt for critical events
// Inspired by real TV breaking news broadcasts
// ============================================

export type BreakingNewsEvent = {
  id: string;
  headline: string;
  subtext?: string;
  severity: 'crisis' | 'warning' | 'revelation' | 'success';
  source?: string; // "DISINFO-TV" | "WESTUNION NACHRICHTEN" etc.
};

type BreakingNewsOverlayProps = {
  event: BreakingNewsEvent | null;
  onDismiss: () => void;
  autoDismissMs?: number;
};

function getSeverityStyles(severity: BreakingNewsEvent['severity']) {
  switch (severity) {
    case 'crisis':
      return {
        bannerBg: '#CC0000',
        bannerText: '#FFFFFF',
        flash: 'rgba(204, 0, 0, 0.15)',
        label: 'EILMELDUNG',
      };
    case 'warning':
      return {
        bannerBg: '#D4A017',
        bannerText: '#000000',
        flash: 'rgba(212, 160, 23, 0.1)',
        label: 'SONDERMELDUNG',
      };
    case 'revelation':
      return {
        bannerBg: '#003366',
        bannerText: '#FFFFFF',
        flash: 'rgba(0, 51, 102, 0.15)',
        label: 'ENTHÜLLUNG',
      };
    case 'success':
      return {
        bannerBg: '#2D5016',
        bannerText: '#FFFFFF',
        flash: 'rgba(45, 80, 22, 0.1)',
        label: 'DURCHBRUCH',
      };
  }
}

export function BreakingNewsOverlay({
  event,
  onDismiss,
  autoDismissMs = 6000,
}: BreakingNewsOverlayProps) {
  const [phase, setPhase] = useState<'static' | 'reveal' | 'display' | 'fadeout'>('static');
  const [staticOpacity, setStaticOpacity] = useState(1);

  const startSequence = useCallback(() => {
    // Phase 1: TV Static (0.4s)
    setPhase('static');
    setStaticOpacity(1);

    setTimeout(() => {
      // Phase 2: Reveal with banner animation (0.3s)
      setPhase('reveal');
      playSound('crisis');
    }, 400);

    setTimeout(() => {
      // Phase 3: Display headline
      setPhase('display');
    }, 700);
  }, []);

  // Start animation when event appears
  useEffect(() => {
    if (!event) {
      setPhase('static');
      return;
    }
    startSequence();
  }, [event, startSequence]);

  // Auto-dismiss
  useEffect(() => {
    if (!event || phase !== 'display') return;
    const timer = setTimeout(() => {
      setPhase('fadeout');
      setTimeout(onDismiss, 500);
    }, autoDismissMs);
    return () => clearTimeout(timer);
  }, [event, phase, autoDismissMs, onDismiss]);

  // Static noise animation
  useEffect(() => {
    if (phase !== 'static' || !event) return;
    const interval = setInterval(() => {
      setStaticOpacity(Math.random() * 0.5 + 0.5);
    }, 50);
    return () => clearInterval(interval);
  }, [phase, event]);

  if (!event) return null;

  const styles = getSeverityStyles(event.severity);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center cursor-pointer"
      onClick={() => {
        if (phase === 'display') {
          setPhase('fadeout');
          setTimeout(onDismiss, 300);
        }
      }}
      style={{
        backgroundColor: phase === 'fadeout' ? 'transparent' : 'rgba(0, 0, 0, 0.85)',
        transition: 'background-color 0.5s ease',
      }}
    >
      {/* TV Static noise layer */}
      {phase === 'static' && (
        <div
          className="absolute inset-0"
          style={{
            opacity: staticOpacity,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '256px 256px',
            filter: 'contrast(2) brightness(1.5)',
          }}
        />
      )}

      {/* Main content - only visible after static */}
      {(phase === 'reveal' || phase === 'display' || phase === 'fadeout') && (
        <div
          className="w-full max-w-3xl mx-4 relative"
          style={{
            opacity: phase === 'fadeout' ? 0 : 1,
            transform: phase === 'reveal' ? 'scaleY(0.02)' : 'scaleY(1)',
            transition: phase === 'reveal'
              ? 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              : 'opacity 0.5s ease',
          }}
        >
          {/* Background flash */}
          <div
            className="absolute inset-0 -m-8"
            style={{
              backgroundColor: styles.flash,
              animation: phase === 'display' ? 'breakingFlash 1.5s ease-in-out infinite' : 'none',
            }}
          />

          {/* Top bar - BREAKING NEWS label */}
          <div
            className="relative flex items-center"
            style={{
              backgroundColor: styles.bannerBg,
              borderBottom: '3px solid rgba(0,0,0,0.3)',
            }}
          >
            {/* Animated left accent */}
            <div
              className="w-2 h-full absolute left-0 top-0 bottom-0"
              style={{
                backgroundColor: '#fff',
                opacity: 0.3,
                animation: phase === 'display' ? 'bannerPulse 2s ease-in-out infinite' : 'none',
              }}
            />

            <div className="px-6 py-3 flex items-center gap-4 w-full">
              {/* Alert icon */}
              <div
                className="w-8 h-8 flex items-center justify-center font-bold text-lg shrink-0"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  color: styles.bannerText,
                }}
              >
                !
              </div>

              {/* Label */}
              <div
                className="font-bold text-lg tracking-[4px] flex-1"
                style={{ color: styles.bannerText }}
              >
                {styles.label}
              </div>

              {/* Source */}
              <div
                className="text-xs font-bold opacity-70"
                style={{ color: styles.bannerText }}
              >
                {event.source || 'DISINFO-TV'}
              </div>
            </div>
          </div>

          {/* Headline area */}
          <div
            className="relative px-6 py-6"
            style={{
              backgroundColor: 'rgba(10, 10, 10, 0.95)',
              borderLeft: `4px solid ${styles.bannerBg}`,
              borderRight: `4px solid ${styles.bannerBg}`,
            }}
          >
            <h2
              className="font-bold text-xl leading-tight mb-2"
              style={{
                color: '#fff',
                opacity: phase === 'display' || phase === 'fadeout' ? 1 : 0,
                transform: phase === 'display' || phase === 'fadeout' ? 'translateY(0)' : 'translateY(10px)',
                transition: 'all 0.4s ease 0.1s',
              }}
            >
              {event.headline}
            </h2>

            {event.subtext && (
              <p
                className="text-sm"
                style={{
                  color: StoryModeColors.textSecondary,
                  opacity: phase === 'display' || phase === 'fadeout' ? 1 : 0,
                  transform: phase === 'display' || phase === 'fadeout' ? 'translateY(0)' : 'translateY(10px)',
                  transition: 'all 0.4s ease 0.3s',
                }}
              >
                {event.subtext}
              </p>
            )}
          </div>

          {/* Bottom bar */}
          <div
            className="relative px-6 py-2 flex justify-between items-center"
            style={{
              backgroundColor: styles.bannerBg,
              borderTop: '3px solid rgba(0,0,0,0.3)',
            }}
          >
            <div
              className="text-xs font-bold"
              style={{ color: styles.bannerText, opacity: 0.8 }}
            >
              Klicken zum Fortfahren
            </div>
            <div
              className="text-xs font-bold tracking-wider"
              style={{ color: styles.bannerText, opacity: 0.6 }}
            >
              LIVE
            </div>
          </div>

          {/* Scanlines over the whole overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 6px)',
            }}
          />
        </div>
      )}

      {/* CSS Keyframes */}
      <style>{`
        @keyframes breakingFlash {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        @keyframes bannerPulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
