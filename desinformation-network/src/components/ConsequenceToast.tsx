import { useEffect, useState } from 'react';
import type { Consequence } from '@/game-logic/ConsequenceGenerator';
import { cn } from '@/utils/cn';

// ============================================
// CONSEQUENCE TOAST - Sprint 4
// Shows narrative consequences of player actions
// ============================================

type ConsequenceToastProps = {
  consequence: Consequence | null;
  onDismiss: () => void;
};

const SEVERITY_STYLES = {
  minor: {
    bg: 'from-gray-800 to-gray-900',
    border: 'border-gray-600',
    icon: '📝',
  },
  moderate: {
    bg: 'from-yellow-900/80 to-gray-900',
    border: 'border-yellow-600/50',
    icon: '⚠️',
  },
  severe: {
    bg: 'from-orange-900/80 to-gray-900',
    border: 'border-orange-500/50',
    icon: '🔥',
  },
  devastating: {
    bg: 'from-red-900/80 to-gray-900',
    border: 'border-red-500/50',
    icon: '💔',
  },
};

const TYPE_LABELS: Record<Consequence['type'], string> = {
  attacked: 'Angegriffen',
  controlled: 'Unter Kontrolle',
  reputation_damaged: 'Ruf beschädigt',
  silenced: 'Zum Schweigen gebracht',
  radicalized: 'Radikalisiert',
};

export function ConsequenceToast({ consequence, onDismiss }: ConsequenceToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (consequence) {
      setIsVisible(true);
      setIsExiting(false);

      // Auto-dismiss after 8 seconds
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setIsVisible(false);
          onDismiss();
        }, 300);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [consequence, onDismiss]);

  if (!consequence || !isVisible) return null;

  const style = SEVERITY_STYLES[consequence.severity];

  return (
    <div
      className={cn(
        'fixed bottom-32 left-1/2 -translate-x-1/2 z-50 max-w-lg w-full mx-4',
        'transition-all duration-300',
        isExiting ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
      )}
    >
      <div
        className={cn(
          'bg-gradient-to-r rounded-xl border shadow-2xl overflow-hidden',
          style.bg,
          style.border
        )}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{style.icon}</span>
            <div>
              <span className="text-white font-semibold">{consequence.personName}</span>
              <span className="text-gray-400 text-sm ml-2">({consequence.actorName})</span>
            </div>
          </div>
          <span className={cn(
            'text-xs px-2 py-1 rounded-full',
            consequence.severity === 'devastating' ? 'bg-red-500/30 text-red-300' :
            consequence.severity === 'severe' ? 'bg-orange-500/30 text-orange-300' :
            consequence.severity === 'moderate' ? 'bg-yellow-500/30 text-yellow-300' :
            'bg-gray-500/30 text-gray-300'
          )}>
            {TYPE_LABELS[consequence.type]}
          </span>
        </div>

        {/* Narrative */}
        <div className="px-4 py-4">
          <p className="text-white/90 text-sm leading-relaxed">
            {consequence.narrative}
          </p>
        </div>

        {/* Human Cost */}
        <div className="px-4 py-3 bg-black/20 border-t border-white/5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <span className="text-gray-400">
                <span className="text-white font-semibold">
                  {consequence.humanCost.peopleAffected.toLocaleString('de-DE')}
                </span> Menschen betroffen
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400">
                {consequence.humanCost.emotionalImpact}
              </span>
            </div>
            <button
              onClick={() => {
                setIsExiting(true);
                setTimeout(() => {
                  setIsVisible(false);
                  onDismiss();
                }, 300);
              }}
              className="text-gray-500 hover:text-white transition-colors"
            >
              Schließen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsequenceToast;
