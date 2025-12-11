/**
 * NotificationToast Component (Phase 1: Notification Consolidation)
 *
 * Toast notification system for displaying actor reactions and game events.
 * Replaces ActorReactionsOverlay to fix position conflicts with FilterControls.
 *
 * Features:
 * - Auto-dismiss after 3.5 seconds (reduced from 5s for better flow)
 * - Click to dismiss manually
 * - Stackable (max 2 visible to reduce clutter)
 * - Smooth slide-in/fade-out animations
 * - Bottom-LEFT positioning (moved from right to avoid panel overlap)
 *
 * Uses z-index CSS variable: var(--z-notification)
 */

import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import type { ActorReaction } from '@/game-logic/types';
import type { Actor } from '@/game-logic/types';

// ============================================
// TYPES
// ============================================

export interface ToastNotification {
  id: string;
  type: 'reaction' | 'event' | 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  actorId?: string;
  icon?: string;
  duration?: number; // milliseconds, default 5000
}

interface NotificationToastProps {
  notifications: ToastNotification[];
  onDismiss: (id: string) => void;
  maxVisible?: number; // default 3
}

interface ToastItemProps {
  notification: ToastNotification;
  onDismiss: (id: string) => void;
  index: number;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Convert ActorReaction to ToastNotification
 */
export function actorReactionToToast(
  reaction: ActorReaction,
  actor: Actor
): ToastNotification {
  const icons: Record<ActorReaction['type'], string> = {
    resist: '💪',
    expose: '🔍',
    defend_ally: '🤝',
    counter_campaign: '📢',
  };

  const titles: Record<ActorReaction['type'], string> = {
    resist: 'Actor Resisted',
    expose: 'Manipulation Exposed',
    defend_ally: 'Defended Ally',
    counter_campaign: 'Counter-Campaign',
  };

  const messages: Record<ActorReaction['type'], string> = {
    resist: `${actor.name} resisted manipulation (strength: ${reaction.strength.toFixed(2)})`,
    expose: `${actor.name} exposed your tactics (strength: ${reaction.strength.toFixed(2)})`,
    defend_ally: `${actor.name} defended an ally`,
    counter_campaign: `${actor.name} launched a counter-campaign`,
  };

  return {
    id: `reaction_${reaction.actorId}_${Date.now()}`,
    type: 'reaction',
    title: titles[reaction.type] || 'Actor Reacted',
    message: messages[reaction.type] || `${actor.name} reacted`,
    actorId: reaction.actorId,
    icon: icons[reaction.type] || '💬',
    duration: 3500, // Reduced from 5000ms for better flow
  };
}

/**
 * Get color classes based on toast type
 */
function getToastColors(type: ToastNotification['type']) {
  const colors = {
    reaction: {
      bg: 'bg-blue-900/90',
      border: 'border-blue-500/50',
      text: 'text-blue-100',
      titleText: 'text-blue-50',
    },
    event: {
      bg: 'bg-purple-900/90',
      border: 'border-purple-500/50',
      text: 'text-purple-100',
      titleText: 'text-purple-50',
    },
    info: {
      bg: 'bg-gray-900/90',
      border: 'border-gray-500/50',
      text: 'text-gray-100',
      titleText: 'text-gray-50',
    },
    warning: {
      bg: 'bg-yellow-900/90',
      border: 'border-yellow-500/50',
      text: 'text-yellow-100',
      titleText: 'text-yellow-50',
    },
    success: {
      bg: 'bg-green-900/90',
      border: 'border-green-500/50',
      text: 'text-green-100',
      titleText: 'text-green-50',
    },
    error: {
      bg: 'bg-red-900/90',
      border: 'border-red-500/50',
      text: 'text-red-100',
      titleText: 'text-red-50',
    },
  };

  return colors[type] || colors.info;
}

// ============================================
// TOAST ITEM COMPONENT
// ============================================

function ToastItem({ notification, onDismiss, index }: ToastItemProps) {
  const [isLeaving, setIsLeaving] = useState(false);
  const colors = getToastColors(notification.type);
  const duration = notification.duration || 3500; // Reduced from 5000ms

  // Auto-dismiss after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => onDismiss(notification.id), 300); // Wait for animation
    }, duration);

    return () => clearTimeout(timer);
  }, [notification.id, duration, onDismiss]);

  const handleDismiss = () => {
    setIsLeaving(true);
    setTimeout(() => onDismiss(notification.id), 300);
  };

  return (
    <div
      className={cn(
        'relative mb-3 w-80 overflow-hidden rounded-xl border-2 backdrop-blur-md shadow-xl transition-all duration-300',
        colors.bg,
        colors.border,
        isLeaving
          ? '-translate-x-96 opacity-0'  // Slide out to left
          : 'translate-x-0 opacity-100 animate-slide-in-left'  // Slide in from left
      )}
      style={{
        transitionDelay: `${index * 50}ms`, // Stagger animation
      }}
    >
      {/* Progress bar */}
      <div
        className="absolute top-0 left-0 h-1 bg-white/30 transition-all"
        style={{
          width: '100%',
          animation: `progress ${duration}ms linear forwards`,
        }}
      />

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          {notification.icon && (
            <div className="flex-shrink-0 text-2xl">
              {notification.icon}
            </div>
          )}

          {/* Text */}
          <div className="flex-1 min-w-0">
            <h4 className={cn('font-semibold text-sm mb-1', colors.titleText)}>
              {notification.title}
            </h4>
            <p className={cn('text-xs leading-relaxed', colors.text)}>
              {notification.message}
            </p>
          </div>

          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className={cn(
              'flex-shrink-0 p-1 rounded-lg transition-colors',
              'hover:bg-white/10 active:bg-white/20',
              colors.text
            )}
            aria-label="Dismiss notification"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function NotificationToast({
  notifications,
  onDismiss,
  maxVisible = 2,  // Reduced from 3 to avoid clutter
}: NotificationToastProps) {
  // Only show most recent notifications
  const visibleNotifications = notifications.slice(-maxVisible);

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    // Phase 1: Moved to bottom-LEFT, using CSS variable for z-index
    <div className="fixed bottom-6 left-6 z-[var(--z-notification)] pointer-events-none">
      <div className="flex flex-col-reverse pointer-events-auto">
        {visibleNotifications.map((notification, index) => (
          <ToastItem
            key={notification.id}
            notification={notification}
            onDismiss={onDismiss}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================
// HELPER HOOK
// ============================================

/**
 * Hook to manage toast notifications
 */
export function useToastNotifications() {
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  const addNotification = (notification: Omit<ToastNotification, 'id'>) => {
    const newNotification: ToastNotification = {
      ...notification,
      id: `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    setNotifications(prev => [...prev, newNotification]);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotification,
    dismissNotification,
    clearAll,
  };
}

// ============================================
// CSS ANIMATIONS
// ============================================

// Add to global CSS or Tailwind config:
/*
@keyframes progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

@keyframes slide-in-right {
  from {
    transform: translateX(384px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
*/

export default NotificationToast;
