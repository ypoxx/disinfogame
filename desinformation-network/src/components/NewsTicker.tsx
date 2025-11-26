import { useState, useEffect, useRef } from 'react';
import type { GameEvent } from '@/game-logic/types';
import { cn } from '@/utils/cn';

// ============================================
// TYPES
// ============================================

type NewsTickerProps = {
  events: GameEvent[];
  currentEvent: GameEvent | null;
};

type TickerItem = {
  id: string;
  text: string;
  type: 'event' | 'tip' | 'status';
  icon: string;
};

// ============================================
// TIPS DATA
// ============================================

const TIPS: TickerItem[] = [
  { 
    id: 'tip_1', 
    text: 'TIP: Emotional targets are more susceptible to manipulation', 
    type: 'tip',
    icon: '💡'
  },
  { 
    id: 'tip_2', 
    text: 'TIP: Target vulnerabilities for bonus effectiveness', 
    type: 'tip',
    icon: '🎯'
  },
  { 
    id: 'tip_3', 
    text: 'TIP: Abilities become less effective with repeated use', 
    type: 'tip',
    icon: '📉'
  },
  { 
    id: 'tip_4', 
    text: 'TIP: Connected actors spread distrust to each other', 
    type: 'tip',
    icon: '🔗'
  },
  { 
    id: 'tip_5', 
    text: 'TIP: Media actors can reach many others through their influence', 
    type: 'tip',
    icon: '📺'
  },
  { 
    id: 'tip_6', 
    text: 'TIP: Defensive actors spawn when trust drops too low', 
    type: 'tip',
    icon: '🛡️'
  },
  { 
    id: 'tip_7', 
    text: 'TIP: Trust slowly recovers over time - keep up the pressure', 
    type: 'tip',
    icon: '⏱️'
  },
];

// ============================================
// ICON MAPPING
// ============================================

const EVENT_ICONS: Record<string, string> = {
  alert: '🚨',
  trending: '📈',
  check: '✅',
  award: '🏆',
  warning: '⚠️',
  document: '📄',
  'chart-down': '📉',
  book: '📚',
  shield: '🛡️',
  'users-x': '👥',
  globe: '🌍',
  settings: '⚙️',
};

// ============================================
// COMPONENT
// ============================================

export function NewsTicker({ events, currentEvent }: NewsTickerProps) {
  const [items, setItems] = useState<TickerItem[]>(TIPS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Add current event to items
  useEffect(() => {
    if (currentEvent) {
      const eventItem: TickerItem = {
        id: currentEvent.id,
        text: currentEvent.newsTickerText,
        type: 'event',
        icon: EVENT_ICONS[currentEvent.iconType] || '📰',
      };
      
      setItems(prev => {
        // Don't add duplicate events
        if (prev.some(item => item.id === eventItem.id)) {
          return prev;
        }
        return [eventItem, ...prev];
      });
      
      // Show the event immediately
      setCurrentIndex(0);
      setIsAnimating(true);
    }
  }, [currentEvent]);

  // Rotate through items
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % items.length);
        setIsAnimating(false);
      }, 300);
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [items.length]);

  const currentItem = items[currentIndex];

  if (!currentItem) return null;

  return (
    <div className="bg-gray-900 text-white overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-4 py-2">
        <div className={cn(
          "flex items-center gap-3 transition-all duration-300",
          isAnimating ? "opacity-0 transform translate-y-2" : "opacity-100 transform translate-y-0"
        )}>
          {/* Icon */}
          <span className="text-lg flex-shrink-0">{currentItem.icon}</span>
          
          {/* Text */}
          <p className={cn(
            "text-sm font-medium truncate",
            currentItem.type === 'event' && "text-red-400",
            currentItem.type === 'tip' && "text-blue-400",
            currentItem.type === 'status' && "text-gray-300"
          )}>
            {currentItem.text}
          </p>
          
          {/* Type Badge */}
          <span className={cn(
            "text-xs px-2 py-0.5 rounded-full flex-shrink-0",
            currentItem.type === 'event' && "bg-red-900/50 text-red-300",
            currentItem.type === 'tip' && "bg-blue-900/50 text-blue-300",
            currentItem.type === 'status' && "bg-gray-700 text-gray-300"
          )}>
            {currentItem.type === 'event' ? 'BREAKING' : 
             currentItem.type === 'tip' ? 'TIP' : 'STATUS'}
          </span>
          
          {/* Progress dots */}
          <div className="flex items-center gap-1 ml-auto flex-shrink-0">
            {items.slice(0, Math.min(items.length, 5)).map((_, idx) => (
              <div 
                key={idx}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-colors",
                  idx === currentIndex ? "bg-white" : "bg-gray-600"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewsTicker;
