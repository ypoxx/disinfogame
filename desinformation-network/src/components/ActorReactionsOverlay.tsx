/**
 * Actor Reactions Overlay
 *
 * Displays recent actor reactions: resistance, exposure attempts,
 * ally defense, and counter-campaigns. Shows players that actors
 * are fighting back against manipulation.
 */

import { useMemo, memo } from 'react';
import type { Actor, ActorReaction } from '@/game-logic/types';
import { cn } from '@/utils/cn';

// ============================================
// TYPES
// ============================================

export interface ActorReactionsOverlayProps {
  reactions: ActorReaction[];
  actors: Actor[];
  currentRound: number;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

// ============================================
// COMPONENT
// ============================================

function ActorReactionsOverlayComponent({
  reactions,
  actors,
  currentRound,
  collapsed = false,
  onToggleCollapse,
}: ActorReactionsOverlayProps) {
  // Show only reactions from the last 3 rounds
  const recentReactions = useMemo(() => {
    return reactions
      .filter(r => currentRound - r.round <= 3)
      .sort((a, b) => b.round - a.round)
      .slice(0, 8); // Limit to 8 most recent
  }, [reactions, currentRound]);

  // Get actor name by ID
  const getActorName = (actorId: string) => {
    return actors.find(a => a.id === actorId)?.name || 'Unknown';
  };

  if (recentReactions.length === 0) {
    return null;
  }

  if (collapsed) {
    return (
      <div className="bg-white/95 backdrop-blur rounded-lg shadow-lg p-3">
        <button
          onClick={onToggleCollapse}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Reactions
          <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {recentReactions.length}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur rounded-lg shadow-lg p-4 w-80">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Actor Reactions</h3>
            <p className="text-xs text-gray-500">Actors fighting back</p>
          </div>
        </div>
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="text-gray-400 hover:text-gray-600"
            title="Collapse"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Reactions list */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {recentReactions.map((reaction, index) => {
          const actor = actors.find(a => a.id === reaction.actorId);
          if (!actor) return null;

          const isRecent = currentRound - reaction.round === 0;

          return (
            <div
              key={`${reaction.actorId}-${reaction.round}-${index}`}
              className={cn(
                'rounded-lg p-2 border transition-all',
                isRecent ? 'bg-red-50 border-red-300 shadow-sm' : 'bg-gray-50 border-gray-200'
              )}
            >
              {/* Actor and round */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-gray-900 truncate">
                    {actor.name}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    Round {reaction.round}
                  </div>
                </div>
                <div className="text-lg flex-shrink-0">
                  {getReactionIcon(reaction.type)}
                </div>
              </div>

              {/* Reaction type and description */}
              <div className="space-y-1">
                <div className={cn(
                  'text-xs font-bold',
                  getReactionColor(reaction.type)
                )}>
                  {getReactionTitle(reaction.type)}
                </div>
                <div className="text-[10px] text-gray-600 leading-relaxed">
                  {getReactionDescription(reaction, actors)}
                </div>

                {/* Strength indicator */}
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        getReactionBarColor(reaction.type)
                      )}
                      style={{ width: `${Math.min(reaction.strength * 100, 100)}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-gray-500 font-medium">
                    {Math.round(reaction.strength * 100)}%
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-600 bg-orange-50 rounded p-2">
          <span className="font-semibold text-orange-700">⚠️ Warning:</span>{' '}
          Actors with high awareness will resist manipulation more effectively!
        </div>
      </div>
    </div>
  );
}

// ============================================
// HELPERS
// ============================================

function getReactionIcon(type: ActorReaction['type']): string {
  switch (type) {
    case 'resist':
      return '🛡️';
    case 'expose':
      return '🔍';
    case 'defend_ally':
      return '🤝';
    case 'counter_campaign':
      return '⚔️';
    default:
      return '⚠️';
  }
}

function getReactionTitle(type: ActorReaction['type']): string {
  switch (type) {
    case 'resist':
      return 'Resisting Manipulation';
    case 'expose':
      return 'Exposing Campaign';
    case 'defend_ally':
      return 'Defending Ally';
    case 'counter_campaign':
      return 'Counter-Campaign';
    default:
      return 'Unknown Reaction';
  }
}

function getReactionDescription(reaction: ActorReaction, actors: Actor[]): string {
  switch (reaction.type) {
    case 'resist':
      return 'Increasing personal resilience against manipulation attempts';
    case 'expose':
      return 'Attempting to expose the disinformation campaign to the network';
    case 'defend_ally':
      if (reaction.targetActorId) {
        const ally = actors.find(a => a.id === reaction.targetActorId);
        return `Boosting trust and resilience of ${ally?.name || 'ally'}`;
      }
      return 'Supporting an ally under attack';
    case 'counter_campaign':
      return 'Launching defensive strategy to restore network integrity';
    default:
      return 'Taking defensive action';
  }
}

function getReactionColor(type: ActorReaction['type']): string {
  switch (type) {
    case 'resist':
      return 'text-blue-700';
    case 'expose':
      return 'text-yellow-700';
    case 'defend_ally':
      return 'text-green-700';
    case 'counter_campaign':
      return 'text-red-700';
    default:
      return 'text-gray-700';
  }
}

function getReactionBarColor(type: ActorReaction['type']): string {
  switch (type) {
    case 'resist':
      return 'bg-blue-500';
    case 'expose':
      return 'bg-yellow-500';
    case 'defend_ally':
      return 'bg-green-500';
    case 'counter_campaign':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}


// PHASE 5: Performance - Wrap with React.memo
export const ActorReactionsOverlay = memo(ActorReactionsOverlayComponent);
