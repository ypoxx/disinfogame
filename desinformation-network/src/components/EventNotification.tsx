import { useEffect, useState } from 'react';
import type { GameEvent } from '@/game-logic/types';
import { cn } from '@/utils/cn';

type EventNotificationProps = {
  event: GameEvent;
  onClose: () => void;
  duration?: number;
};

export function EventNotification({ event, onClose, duration = 5000 }: EventNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIconEmoji = (iconType: string) => {
    const icons: Record<string, string> = {
      election: '🗳️',
      scandal: '📰',
      crisis: '⚠️',
      platform: '📱',
      policy: '📋',
      investigation: '🔍',
      regulation: '⚖️',
      technology: '💻',
      social: '👥',
      economy: '💰',
      default: '📢',
    };
    return icons[iconType] || icons.default;
  };

  const getEventColor = (iconType: string) => {
    const colors: Record<string, string> = {
      election: 'blue',
      scandal: 'red',
      crisis: 'orange',
      platform: 'purple',
      policy: 'green',
      investigation: 'yellow',
      regulation: 'indigo',
      technology: 'cyan',
      social: 'pink',
      economy: 'yellow',
    };
    return colors[iconType] || 'gray';
  };

  const color = getEventColor(event.iconType);

  return (
    <div
      className={cn(
        "fixed top-24 right-6 max-w-md z-50 transition-all duration-300",
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
    >
      <div className={cn(
        "bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border-2 shadow-2xl",
        `border-${color}-500 shadow-${color}-500/20`
      )}>
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0",
            `bg-${color}-600/20 border border-${color}-600/30`
          )}>
            {getIconEmoji(event.iconType)}
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1">
              {event.name}
            </h3>
            <p className="text-sm text-gray-400">
              World Event
            </p>
          </div>

          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-300 leading-relaxed mb-4">
          {event.description}
        </p>

        {/* News Ticker */}
        <div className={cn(
          "rounded-lg p-3 border-l-4",
          `bg-${color}-900/20 border-${color}-500`
        )}>
          <p className="text-sm italic text-gray-300">
            "{event.newsTickerText}"
          </p>
        </div>

        {/* Effects Summary */}
        {event.effects.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-500 mb-2">Effects:</p>
            <div className="flex flex-wrap gap-2">
              {event.effects.map((effect, i) => (
                <span
                  key={i}
                  className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400"
                >
                  {effect.type.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// News ticker component for bottom of screen
export function NewsTicker({ text }: { text: string }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 left-0 right-0 z-40 animate-slide-up">
      <div className="bg-red-600 text-white px-6 py-3 shadow-lg border-t-2 border-red-400">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <span className="font-bold uppercase text-sm tracking-wide flex-shrink-0">
            Breaking News
          </span>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm animate-marquee whitespace-nowrap">
              {text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
