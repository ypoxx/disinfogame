import { useState, useEffect } from 'react';
import { StoryModeColors } from '../theme';
import type { StoryResources, StoryPhase, NewsEvent } from '../../game-logic/StoryEngineAdapter';

// ============================================
// PHASE NEWS SUMMARY - "Tagesschau" style
// Shows the end-of-phase summary as a news broadcast
// ============================================

type ResourceDelta = {
  budget: number;
  capacity: number;
  risk: number;
  attention: number;
  moralWeight: number;
};

type PhaseNewsSummaryProps = {
  isVisible: boolean;
  phase: StoryPhase;
  resources: StoryResources;
  resourceDeltas: ResourceDelta;
  newsEvents: NewsEvent[]; // events from this phase only
  onContinue: () => void;
};

// Generate "headline" from resource changes
function getTopStory(deltas: ResourceDelta, phase: StoryPhase): { headline: string; severity: string } {
  // Determine the most significant change
  if (deltas.risk > 15) {
    return { headline: `Sicherheitslage verschärft sich dramatisch`, severity: 'danger' };
  }
  if (deltas.risk < -10) {
    return { headline: `Verdacht auf ausländische Einflussnahme nimmt ab`, severity: 'success' };
  }
  if (deltas.budget < -30) {
    return { headline: `Massive Investitionen in verdeckte Operationen`, severity: 'warning' };
  }
  if (deltas.moralWeight > 20) {
    return { headline: `Ethische Grenzen zunehmend überschritten`, severity: 'danger' };
  }
  if (deltas.attention > 20) {
    return { headline: `Öffentliche Aufmerksamkeit auf Desinformation steigt`, severity: 'warning' };
  }
  return {
    headline: `Operationen in Monat ${phase.month}, Jahr ${phase.year} verlaufen planmäßig`,
    severity: 'info',
  };
}

function DeltaIndicator({ value, label }: { value: number; label: string }) {
  if (Math.abs(value) < 0.5) return null;

  const isPositive = value > 0;
  // For risk/attention/moral, "positive" is actually bad
  const isBad = ['RISIKO', 'AUFMERKSAMKEIT', 'MORAL'].includes(label) ? isPositive : !isPositive;

  return (
    <div className="flex items-center justify-between py-1 px-2">
      <span className="text-[10px] font-bold" style={{ color: StoryModeColors.textSecondary }}>
        {label}
      </span>
      <span
        className="text-xs font-bold"
        style={{ color: isBad ? StoryModeColors.danger : StoryModeColors.success }}
      >
        {isPositive ? '+' : ''}{Math.round(value)}
        <span className="ml-1">{isBad ? '▼' : '▲'}</span>
      </span>
    </div>
  );
}

export function PhaseNewsSummary({
  isVisible,
  phase,
  resources,
  resourceDeltas,
  newsEvents,
  onContinue,
}: PhaseNewsSummaryProps) {
  const [revealPhase, setRevealPhase] = useState(0); // 0-4: progressive reveal
  const [tickerOffset, setTickerOffset] = useState(0);

  // Progressive reveal animation
  useEffect(() => {
    if (!isVisible) {
      setRevealPhase(0);
      return;
    }

    const timers = [
      setTimeout(() => setRevealPhase(1), 300),  // Banner
      setTimeout(() => setRevealPhase(2), 800),  // Top story
      setTimeout(() => setRevealPhase(3), 1400), // Resource changes
      setTimeout(() => setRevealPhase(4), 2000), // News items + continue
    ];

    return () => timers.forEach(clearTimeout);
  }, [isVisible]);

  // Ticker animation
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setTickerOffset(prev => prev - 1);
    }, 30);
    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  const topStory = getTopStory(resourceDeltas, phase);
  const phaseNews = newsEvents.slice(-5); // Last 5 events from this phase

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
    >
      <div
        className="w-[700px] max-w-[95vw] max-h-[85vh] overflow-hidden flex flex-col"
        style={{
          backgroundColor: '#0a0a0a',
          border: `3px solid ${StoryModeColors.agencyBlue}`,
          boxShadow: '0 0 60px rgba(0, 51, 102, 0.3)',
        }}
      >
        {/* Top Banner - NACHRICHTEN */}
        <div
          className="relative overflow-hidden shrink-0"
          style={{
            opacity: revealPhase >= 1 ? 1 : 0,
            transform: revealPhase >= 1 ? 'scaleY(1)' : 'scaleY(0)',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            transformOrigin: 'top',
          }}
        >
          <div
            className="px-6 py-3 flex items-center justify-between"
            style={{
              backgroundColor: StoryModeColors.agencyBlue,
              borderBottom: '3px solid rgba(255,255,255,0.1)',
            }}
          >
            <div className="flex items-center gap-3">
              <div className="text-xl">📡</div>
              <div>
                <div className="font-bold text-sm tracking-[3px]" style={{ color: '#fff' }}>
                  DISINFO-TV NACHRICHTEN
                </div>
                <div className="text-[9px]" style={{ color: StoryModeColors.warning }}>
                  MONAT {phase.month} | JAHR {phase.year} | PHASE {phase.number}
                </div>
              </div>
            </div>
            <div
              className="text-[10px] font-bold px-2 py-1"
              style={{
                backgroundColor: StoryModeColors.sovietRed,
                color: '#fff',
              }}
            >
              ZUSAMMENFASSUNG
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto">
          {/* Top Story */}
          <div
            className="px-6 py-4 border-b-2"
            style={{
              borderColor: StoryModeColors.border,
              opacity: revealPhase >= 2 ? 1 : 0,
              transform: revealPhase >= 2 ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.5s ease',
            }}
          >
            <div
              className="text-[9px] font-bold mb-1 px-2 py-0.5 inline-block"
              style={{
                backgroundColor: topStory.severity === 'danger' ? StoryModeColors.sovietRed
                  : topStory.severity === 'success' ? StoryModeColors.success
                  : StoryModeColors.warning,
                color: topStory.severity === 'warning' ? '#000' : '#fff',
              }}
            >
              TOP-MELDUNG
            </div>
            <h3 className="font-bold text-lg leading-tight" style={{ color: '#fff' }}>
              {topStory.headline}
            </h3>
          </div>

          {/* Resource Changes - "Börsen-Ticker" style */}
          <div
            className="px-6 py-3 border-b-2"
            style={{
              borderColor: StoryModeColors.border,
              opacity: revealPhase >= 3 ? 1 : 0,
              transform: revealPhase >= 3 ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.5s ease',
            }}
          >
            <div className="text-[9px] font-bold mb-2" style={{ color: StoryModeColors.textMuted }}>
              KENNZAHLEN-ENTWICKLUNG
            </div>
            <div
              className="grid grid-cols-2 gap-x-4"
              style={{
                backgroundColor: StoryModeColors.background,
                border: `1px solid ${StoryModeColors.borderLight}`,
              }}
            >
              <DeltaIndicator value={resourceDeltas.budget} label="BUDGET" />
              <DeltaIndicator value={resourceDeltas.capacity} label="KAPAZITÄT" />
              <DeltaIndicator value={resourceDeltas.risk} label="RISIKO" />
              <DeltaIndicator value={resourceDeltas.attention} label="AUFMERKSAMKEIT" />
              <DeltaIndicator value={resourceDeltas.moralWeight} label="MORAL" />
            </div>

            {/* Current totals bar */}
            <div className="mt-2 flex gap-3 text-[9px]" style={{ color: StoryModeColors.textMuted }}>
              <span>Budget: <span style={{ color: StoryModeColors.warning }}>{Math.round(resources.budget)}</span></span>
              <span>Kapaz: <span style={{ color: StoryModeColors.agencyBlue }}>{resources.capacity}</span></span>
              <span>Risiko: <span style={{ color: resources.risk > 60 ? StoryModeColors.danger : StoryModeColors.textPrimary }}>{Math.round(resources.risk)}%</span></span>
            </div>
          </div>

          {/* News Headlines from this phase */}
          <div
            className="px-6 py-3"
            style={{
              opacity: revealPhase >= 4 ? 1 : 0,
              transform: revealPhase >= 4 ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.5s ease',
            }}
          >
            <div className="text-[9px] font-bold mb-2" style={{ color: StoryModeColors.textMuted }}>
              MELDUNGEN DIESER PHASE
            </div>
            {phaseNews.length > 0 ? (
              <div className="space-y-1">
                {phaseNews.map((news, i) => (
                  <div
                    key={news.id || i}
                    className="flex items-start gap-2 py-1.5 px-2"
                    style={{
                      backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                      borderLeft: `3px solid ${
                        news.severity === 'danger' ? StoryModeColors.danger
                        : news.severity === 'warning' ? StoryModeColors.warning
                        : news.severity === 'success' ? StoryModeColors.success
                        : StoryModeColors.agencyBlue
                      }`,
                    }}
                  >
                    <span className="text-[10px] shrink-0" style={{ color: StoryModeColors.textMuted }}>
                      {news.type === 'action_result' ? '📰'
                        : news.type === 'consequence' ? '⚡'
                        : news.type === 'world_event' ? '🌍'
                        : '👤'}
                    </span>
                    <span className="text-xs" style={{ color: StoryModeColors.textPrimary }}>
                      {news.headline_de || news.description_de || 'Keine Details'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs py-2" style={{ color: StoryModeColors.textMuted }}>
                Keine besonderen Vorkommnisse in dieser Phase.
              </div>
            )}
          </div>
        </div>

        {/* Bottom ticker + Continue */}
        <div className="shrink-0">
          {/* Scrolling ticker */}
          <div
            className="h-5 flex items-center overflow-hidden"
            style={{ backgroundColor: StoryModeColors.sovietRed }}
          >
            <div
              className="whitespace-nowrap text-[8px] font-bold"
              style={{
                color: '#fff',
                transform: `translateX(${tickerOffset % 2000}px)`,
              }}
            >
              {phaseNews.map((n, i) => (
                <span key={i}>
                  {n.headline_de || n.description_de?.slice(0, 50) || ''}
                  <span style={{ color: StoryModeColors.warning }}> +++ </span>
                </span>
              ))}
              {/* Pad with generic text if few events */}
              <span>DISINFO-TV +++ VERTRAUEN SIE NIEMANDEM +++ WESTUNION NACHRICHTEN +++ </span>
            </div>
          </div>

          {/* Continue button */}
          <div
            className="px-6 py-3 flex justify-center"
            style={{
              backgroundColor: '#111',
              borderTop: `2px solid ${StoryModeColors.border}`,
              opacity: revealPhase >= 4 ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          >
            <button
              onClick={onContinue}
              className="px-8 py-2 border-4 font-bold text-sm transition-all hover:brightness-110 active:translate-y-0.5"
              style={{
                backgroundColor: StoryModeColors.sovietRed,
                borderColor: StoryModeColors.darkRed,
                color: '#fff',
                boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.8)',
              }}
            >
              NÄCHSTE PHASE →
            </button>
          </div>
        </div>

        {/* Scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 6px)',
          }}
        />
      </div>
    </div>
  );
}
