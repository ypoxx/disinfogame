/**
 * NotificationToast Component (Phase 1: Notification Consolidation)
 *
 * Toast notification system with notification history.
 *
 * Features:
 * - Auto-dismiss after 5 seconds (extended for better readability)
 * - Click to dismiss manually
 * - Stackable (max 2 visible)
 * - Bell icon to open notification history
 * - Scrollable history panel
 * - Audio feedback for new notifications
 *
 * Uses z-index CSS variable: var(--z-notification)
 */

import { useEffect, useState, useCallback } from 'react';
import { cn } from '@/utils/cn';
import type { ActorReaction } from '@/game-logic/types';
import type { Actor } from '@/game-logic/types';

// Counter for deterministic toast IDs
let toastCounter = 0;

// ============================================
// NOTIFICATION SOUND (Web Audio API)
// ============================================

/**
 * Play a subtle notification sound using Web Audio API
 */
function playNotificationSound() {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.1);

    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);

    setTimeout(() => audioContext.close(), 500);
  } catch (e) {
    console.debug('Notification sound not available:', e);
  }
}

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
  duration?: number;
  timestamp?: number;
}

interface NotificationToastProps {
  notifications: ToastNotification[];
  onDismiss: (id: string) => void;
  maxVisible?: number;
  notificationHistory: ToastNotification[];
  onClearHistory: () => void;
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
    duration: 5000, // Extended from 3500ms
    timestamp: Date.now(),
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

/**
 * Format timestamp for history display
 */
function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

// ============================================
// TOAST ITEM COMPONENT
// ============================================

function ToastItem({ notification, onDismiss, index }: ToastItemProps) {
  const [isLeaving, setIsLeaving] = useState(false);
  const colors = getToastColors(notification.type);
  const duration = notification.duration || 5000;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => onDismiss(notification.id), 300);
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
        'relative mb-2 w-64 overflow-hidden rounded-lg border backdrop-blur-md shadow-lg transition-all duration-300',
        colors.bg,
        colors.border,
        isLeaving
          ? '-translate-y-4 opacity-0'
          : 'translate-y-0 opacity-100 animate-slide-down'
      )}
      style={{
        transitionDelay: `${index * 50}ms`,
      }}
    >
      {/* Progress bar */}
      <div
        className="absolute top-0 left-0 h-0.5 bg-white/30 transition-all"
        style={{
          width: '100%',
          animation: `progress ${duration}ms linear forwards`,
        }}
      />

      {/* Content */}
      <div className="p-3">
        <div className="flex items-start gap-2">
          {notification.icon && (
            <div className="flex-shrink-0 text-lg">
              {notification.icon}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h4 className={cn('font-semibold text-xs mb-0.5', colors.titleText)}>
              {notification.title}
            </h4>
            <p className={cn('text-[10px] leading-relaxed', colors.text)}>
              {notification.message}
            </p>
          </div>

          <button
            onClick={handleDismiss}
            className={cn(
              'flex-shrink-0 p-0.5 rounded transition-colors',
              'hover:bg-white/10 active:bg-white/20',
              colors.text
            )}
            aria-label="Dismiss notification"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// HISTORY ITEM COMPONENT (for panel)
// ============================================

function HistoryItem({ notification }: { notification: ToastNotification }) {
  const colors = getToastColors(notification.type);

  return (
    <div className={cn(
      'p-2 rounded-lg border mb-1.5 last:mb-0',
      colors.bg,
      colors.border
    )}>
      <div className="flex items-start gap-2">
        {notification.icon && (
          <div className="flex-shrink-0 text-sm">
            {notification.icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className={cn('font-semibold text-[10px]', colors.titleText)}>
              {notification.title}
            </h4>
            {notification.timestamp && (
              <span className="text-[9px] text-gray-400 flex-shrink-0">
                {formatTime(notification.timestamp)}
              </span>
            )}
          </div>
          <p className={cn('text-[9px] leading-tight mt-0.5', colors.text)}>
            {notification.message}
          </p>
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
  maxVisible = 2,
  notificationHistory,
  onClearHistory,
}: NotificationToastProps) {
  const [historyOpen, setHistoryOpen] = useState(false);

  const visibleNotifications = notifications.slice(-maxVisible);
  const hasUnread = notifications.length > 0;
  const historyCount = notificationHistory.length;

  return (
    <>
      {/* Bell icon button - always visible */}
      <div className="fixed top-4 right-[340px] z-[var(--z-notification)]">
        <button
          onClick={() => setHistoryOpen(!historyOpen)}
          className={cn(
            'relative w-9 h-9 flex items-center justify-center rounded-lg transition-all',
            'bg-gray-800/90 border border-gray-600/50 backdrop-blur-sm',
            'hover:bg-gray-700/90 hover:border-gray-500/50',
            historyOpen && 'bg-gray-700/90 border-blue-500/50'
          )}
          title="Notification History"
        >
          {/* Bell Icon */}
          <svg
            className={cn(
              'w-5 h-5 transition-colors',
              hasUnread ? 'text-blue-400' : 'text-gray-400'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>

          {/* Badge with count */}
          {historyCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 flex items-center justify-center text-[9px] font-bold text-white bg-blue-500 rounded-full">
              {historyCount > 99 ? '99+' : historyCount}
            </span>
          )}
        </button>

        {/* History Panel */}
        {historyOpen && (
          <div className="absolute top-11 right-0 w-72 max-h-80 bg-gray-900/95 border border-gray-700/50 rounded-lg shadow-2xl backdrop-blur-md overflow-hidden animate-slide-down">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700/50">
              <h3 className="text-xs font-semibold text-gray-200">
                Notifications ({historyCount})
              </h3>
              {historyCount > 0 && (
                <button
                  onClick={onClearHistory}
                  className="text-[10px] text-gray-400 hover:text-red-400 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Scrollable content */}
            <div className="max-h-64 overflow-y-auto p-2">
              {historyCount === 0 ? (
                <p className="text-center text-gray-500 text-xs py-4">
                  No notifications yet
                </p>
              ) : (
                [...notificationHistory].reverse().map((notification) => (
                  <HistoryItem key={notification.id} notification={notification} />
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Toast notifications - below bell icon */}
      {visibleNotifications.length > 0 && (
        <div className="fixed top-16 right-[340px] z-[var(--z-notification)] pointer-events-none">
          <div className="flex flex-col pointer-events-auto">
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
      )}
    </>
  );
}

// ============================================
// HELPER HOOK (with history support)
// ============================================

/**
 * Hook to manage toast notifications with history
 */
export function useToastNotifications() {
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);
  const [notificationHistory, setNotificationHistory] = useState<ToastNotification[]>([]);

  const addNotification = useCallback((notification: Omit<ToastNotification, 'id'>) => {
    const newNotification: ToastNotification = {
      ...notification,
      id: `toast_${Date.now()}_${++toastCounter}`,
      timestamp: Date.now(),
    };

    playNotificationSound();

    setNotifications(prev => [...prev, newNotification]);
    setNotificationHistory(prev => [...prev, newNotification].slice(-50)); // Keep last 50
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const clearHistory = useCallback(() => {
    setNotificationHistory([]);
  }, []);

  return {
    notifications,
    notificationHistory,
    addNotification,
    dismissNotification,
    clearAll,
    clearHistory,
  };
}

export default NotificationToast;
