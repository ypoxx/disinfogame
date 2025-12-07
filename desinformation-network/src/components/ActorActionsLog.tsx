import type { ActorAction } from '@/game-logic/types';
import { cn } from '@/utils/cn';

// ============================================
// ACTOR ACTIONS LOG - Sprint 3
// Shows autonomous actions taken by actors
// ============================================

type ActorActionsLogProps = {
  actions: ActorAction[];
};

const ACTION_ICONS: Record<ActorAction['type'], string> = {
  retaliate: '⚔️',
  seek_ally: '🤝',
  defend: '🛡️',
  influence: '📢',
  statement: '📜',
};

const ACTION_COLORS: Record<ActorAction['type'], string> = {
  retaliate: 'border-red-500/50 bg-red-900/20',
  seek_ally: 'border-green-500/50 bg-green-900/20',
  defend: 'border-blue-500/50 bg-blue-900/20',
  influence: 'border-purple-500/50 bg-purple-900/20',
  statement: 'border-yellow-500/50 bg-yellow-900/20',
};

export function ActorActionsLog({ actions }: ActorActionsLogProps) {
  if (actions.length === 0) return null;

  return (
    <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-xl px-4 py-3 shadow-xl max-w-xs">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">🎭</span>
        <span className="text-sm font-medium text-gray-300">Actor Reactions</span>
        <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded text-gray-400">
          {actions.length}
        </span>
      </div>

      {/* Actions List */}
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {actions.map((action, i) => (
          <div
            key={i}
            className={cn(
              'text-xs p-2 rounded border-l-2',
              ACTION_COLORS[action.type]
            )}
          >
            <div className="flex items-start gap-1.5">
              <span className="flex-shrink-0">{ACTION_ICONS[action.type]}</span>
              <span className="text-gray-300 leading-tight">
                {action.narrative}
              </span>
            </div>
            {action.effect.trustDelta && (
              <div className="mt-1 text-[10px] text-gray-500">
                {action.effect.trustDelta > 0 ? '+' : ''}
                {Math.round(action.effect.trustDelta * 100)}% trust
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer hint */}
      <div className="mt-2 text-[10px] text-gray-500 italic">
        Actors remember and react to attacks
      </div>
    </div>
  );
}

export default ActorActionsLog;
