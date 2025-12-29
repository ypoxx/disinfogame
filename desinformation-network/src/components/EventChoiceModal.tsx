/**
 * Event Choice Modal (Phase 4.4)
 *
 * Displays a modal when an event requires player decision.
 * Shows event description, available choices with costs and consequences.
 */

import type { GameEvent, Resources } from '@/game-logic/types';
import { canAffordChoice } from '@/game-logic/event-chain-system';
import { cn } from '@/utils/cn';

// ============================================
// TYPES
// ============================================

export interface EventChoiceModalProps {
  event: GameEvent;
  resources: Resources;
  onChoose: (choiceIndex: number) => void;
}

// ============================================
// COMPONENT
// ============================================

export function EventChoiceModal({
  event,
  resources,
  onChoose,
}: EventChoiceModalProps) {
  if (!event.playerChoice || event.playerChoice.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl mx-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-orange-500/30 max-h-[90vh] overflow-hidden">
        {/* Header with animated border */}
        <div className="relative p-6 border-b border-orange-500/20">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-pulse" />

          <div className="flex items-start gap-4">
            <div className="text-4xl">⚠️</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">
                {event.name}
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-sm text-yellow-200">
              <span className="font-bold">⏳ Critical Decision:</span> Your choice will have
              lasting consequences on the campaign.
            </p>
          </div>
        </div>

        {/* Choices */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
          {event.playerChoice.map((choice, index) => {
            const affordable = !choice.cost || canAffordChoice({ resources } as any, choice);

            return (
              <button
                key={index}
                onClick={() => affordable && onChoose(index)}
                disabled={!affordable}
                className={cn(
                  'w-full text-left p-5 rounded-xl border-2 transition-all duration-200',
                  affordable
                    ? 'bg-gray-800/50 border-gray-600 hover:border-orange-500 hover:bg-gray-700/70 hover:shadow-lg hover:shadow-orange-500/20 cursor-pointer'
                    : 'bg-gray-900/30 border-gray-700/30 opacity-50 cursor-not-allowed',
                  'group'
                )}
              >
                {/* Choice header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-semibold text-white group-hover:text-orange-400 transition-colors">
                        {String.fromCharCode(65 + index)}. {choice.text}
                      </span>
                    </div>

                    {choice.consequence && (
                      <p className="text-sm text-gray-400 italic">
                        → {choice.consequence}
                      </p>
                    )}
                  </div>

                  {!affordable && (
                    <div className="flex-shrink-0 px-3 py-1 bg-red-500/20 border border-red-500/40 rounded-full">
                      <span className="text-xs text-red-300 font-medium">
                        Cannot Afford
                      </span>
                    </div>
                  )}
                </div>

                {/* Cost */}
                {choice.cost && (
                  <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-gray-700/50">
                    <div className="text-xs text-gray-400 font-medium">Cost:</div>
                    {choice.cost.money !== undefined && choice.cost.money > 0 && (
                      <div className={cn(
                        'flex items-center gap-1 px-2 py-1 rounded-md',
                        resources.money >= choice.cost.money
                          ? 'bg-green-500/10 text-green-300'
                          : 'bg-red-500/10 text-red-300'
                      )}>
                        <span className="text-sm">💰</span>
                        <span className="text-xs font-medium">{choice.cost.money}</span>
                      </div>
                    )}
                    {choice.cost.attention !== undefined && choice.cost.attention > 0 && (
                      <div className={cn(
                        'flex items-center gap-1 px-2 py-1 rounded-md',
                        resources.attention >= choice.cost.attention
                          ? 'bg-green-500/10 text-green-300'
                          : 'bg-red-500/10 text-red-300'
                      )}>
                        <span className="text-sm">👁️</span>
                        <span className="text-xs font-medium">{choice.cost.attention}</span>
                      </div>
                    )}
                    {choice.cost.infrastructure !== undefined && choice.cost.infrastructure > 0 && (
                      <div className={cn(
                        'flex items-center gap-1 px-2 py-1 rounded-md',
                        resources.infrastructure >= choice.cost.infrastructure
                          ? 'bg-green-500/10 text-green-300'
                          : 'bg-red-500/10 text-red-300'
                      )}>
                        <span className="text-sm">🏗️</span>
                        <span className="text-xs font-medium">{choice.cost.infrastructure}</span>
                      </div>
                    )}
                    {(!choice.cost.money && !choice.cost.attention && !choice.cost.infrastructure) && (
                      <div className="text-xs text-green-400 font-medium">Free</div>
                    )}
                  </div>
                )}

                {/* Hover hint */}
                {affordable && (
                  <div className="mt-3 text-xs text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to choose this option
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700/50 bg-gray-900/50">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4 text-gray-400">
              <div className="flex items-center gap-1">
                <span>💰</span>
                <span className="font-medium">{resources.money}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>👁️</span>
                <span className="font-medium">{resources.attention}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>🏗️</span>
                <span className="font-medium">{resources.infrastructure}</span>
              </div>
            </div>
            <div className="text-gray-500 text-xs">
              Press 1-{event.playerChoice.length} to choose
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
