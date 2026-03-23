import { useState, useEffect, useRef } from 'react';
import { StoryModeColors } from '../theme';
import type { NewsEvent } from '../../game-logic/StoryEngineAdapter';

// ============================================
// NEWS TV - Dynamic broadcast on the WallTV
// Shows player's disinformation actions as "news"
// ============================================

type NewsTVProps = {
  newsEvents: NewsEvent[];
  resources?: {
    budget: number;
    capacity: number;
    risk: number;
  };
  isHovered: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

// Generate a headline from a news event
function eventToHeadline(event: NewsEvent): string {
  const text = event.headline_de || event.description_de || '';
  if (text.length > 80) return text.slice(0, 77) + '...';
  return text;
}

// Get severity color for the news category bar
function getSeverityColor(severity?: string): string {
  switch (severity) {
    case 'danger': return '#FF4444';
    case 'warning': return '#D4A017';
    case 'success': return '#4A7023';
    default: return StoryModeColors.agencyBlue;
  }
}

// Get news type label
function getTypeLabel(type?: string): string {
  switch (type) {
    case 'action_result': return 'AKTION';
    case 'consequence': return 'KONSEQUENZ';
    case 'world_event': return 'WELTNACHRICHT';
    case 'npc_event': return 'PERSONAL';
    default: return 'MELDUNG';
  }
}

export function NewsTV({
  newsEvents,
  resources,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: NewsTVProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [tickerOffset, setTickerOffset] = useState(0);
  const tickerRef = useRef<number>(0);

  // Get the latest 5 news events for cycling
  const recentNews = newsEvents.slice(-5).reverse();
  const hasNews = recentNews.length > 0;
  const currentNews = hasNews ? recentNews[currentIndex % recentNews.length] : null;

  // Cycle through headlines every 4 seconds
  useEffect(() => {
    if (!hasNews || recentNews.length <= 1) return;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % recentNews.length);
        setIsTransitioning(false);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, [hasNews, recentNews.length]);

  // Animate the bottom ticker
  useEffect(() => {
    const allHeadlines = recentNews.map(e => eventToHeadline(e)).join('  +++  ');
    const tickerWidth = allHeadlines.length * 6; // approximate char width

    const animate = () => {
      setTickerOffset(prev => {
        const next = prev - 0.5;
        return next < -tickerWidth ? 0 : next;
      });
      tickerRef.current = requestAnimationFrame(animate);
    };
    tickerRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(tickerRef.current);
  }, [recentNews]);

  return (
    <div
      className="absolute cursor-pointer transition-all duration-200"
      style={{
        top: '5%',
        left: '8%',
        width: '35%',
        height: '28%',
        zIndex: 10,
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* TV Frame - thick retro border */}
      <div
        className="w-full h-full relative overflow-hidden"
        style={{
          backgroundColor: '#1a1a1a',
          border: `8px solid ${isHovered ? StoryModeColors.agencyBlue : '#333'}`,
          boxShadow: isHovered
            ? `0 0 30px ${StoryModeColors.agencyBlue}, inset 0 0 20px rgba(74, 157, 255, 0.3)`
            : '8px 8px 0 rgba(0,0,0,0.5)',
        }}
      >
        {/* Screen content */}
        <div className="absolute inset-1 overflow-hidden" style={{ backgroundColor: '#0a0a0a' }}>
          {hasNews ? (
            <>
              {/* Channel/Station Logo */}
              <div
                className="absolute top-1 right-2 px-2 py-0.5 font-bold text-[9px] z-10"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: '#fff',
                  letterSpacing: '1px',
                }}
              >
                DISINFO-TV
              </div>

              {/* Main headline area */}
              <div
                className="absolute inset-0 flex flex-col justify-center px-3 py-2 transition-opacity duration-300"
                style={{ opacity: isTransitioning ? 0 : 1 }}
              >
                {/* Category bar */}
                {currentNews && (
                  <div
                    className="text-[8px] font-bold px-2 py-0.5 mb-1 inline-block self-start"
                    style={{
                      backgroundColor: getSeverityColor(currentNews.severity),
                      color: '#fff',
                    }}
                  >
                    {getTypeLabel(currentNews.type)}
                  </div>
                )}

                {/* Headline text */}
                <div
                  className="text-[10px] font-bold leading-tight"
                  style={{ color: '#fff' }}
                >
                  {currentNews ? eventToHeadline(currentNews) : ''}
                </div>
              </div>

              {/* Bottom ticker bar */}
              <div
                className="absolute bottom-0 left-0 right-0 h-4 flex items-center overflow-hidden"
                style={{
                  backgroundColor: StoryModeColors.sovietRed,
                }}
              >
                {/* Risk indicator on left */}
                <div
                  className="px-2 h-full flex items-center text-[7px] font-bold shrink-0 z-10"
                  style={{
                    backgroundColor: resources && resources.risk > 60 ? '#FF0000' : StoryModeColors.darkRed,
                    color: '#fff',
                  }}
                >
                  RISIKO {resources ? `${Math.round(resources.risk)}%` : '0%'}
                </div>

                {/* Scrolling ticker text */}
                <div
                  className="flex-1 h-full flex items-center overflow-hidden"
                  style={{ position: 'relative' }}
                >
                  <div
                    className="whitespace-nowrap text-[7px] font-bold absolute"
                    style={{
                      color: '#fff',
                      transform: `translateX(${tickerOffset}px)`,
                    }}
                  >
                    {recentNews.map((e, i) => (
                      <span key={e.id || i}>
                        {eventToHeadline(e)}
                        <span style={{ color: StoryModeColors.warning }}> +++ </span>
                      </span>
                    ))}
                    {/* Repeat for seamless scroll */}
                    {recentNews.map((e, i) => (
                      <span key={`repeat-${e.id || i}`}>
                        {eventToHeadline(e)}
                        <span style={{ color: StoryModeColors.warning }}> +++ </span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* No news yet - show standby pattern */
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div
                className="text-[10px] font-bold mb-1"
                style={{ color: StoryModeColors.agencyBlue }}
              >
                DISINFO-TV
              </div>
              <div
                className="text-[8px]"
                style={{ color: StoryModeColors.textMuted }}
              >
                BEREITSCHAFT
              </div>
              <div className="flex gap-1 mt-2">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{
                      backgroundColor: StoryModeColors.agencyBlue,
                      animationDelay: `${i * 0.3}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Scanline overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
              mixBlendMode: 'multiply',
            }}
          />

          {/* Screen glare */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)',
            }}
          />
        </div>

        {/* Power LED */}
        <div
          className="absolute bottom-1 right-2 w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: StoryModeColors.success }}
        />
      </div>

      {/* Hover Label */}
      {isHovered && (
        <div
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-3 py-1 border-2 font-bold text-xs whitespace-nowrap z-10"
          style={{
            backgroundColor: StoryModeColors.agencyBlue,
            borderColor: StoryModeColors.darkBlue,
            color: StoryModeColors.warning,
          }}
        >
          NACHRICHTEN-MONITOR
        </div>
      )}
    </div>
  );
}
