/**
 * Combo Tracker Component
 *
 * Displays active combo progress and notifications for completed combos.
 * Shows players which ability combinations are in progress.
 */

import { useMemo, memo } from 'react';
import type { ComboProgress, Actor } from '@/game-logic/types';
import type { ComboDefinition } from '@/game-logic/combo-system';
import { cn } from '@/utils/cn';

// ============================================
// TYPES
// ============================================

export interface ComboTrackerProps {
  activeCombos: ComboProgress[];
  comboDefinitions: ComboDefinition[];
  actors: Actor[];
  currentRound: number;
}

// ============================================
// COMPONENT
// ============================================

function ComboTrackerComponent({
  activeCombos,
  comboDefinitions,
  actors,
  currentRound,
}: ComboTrackerProps) {
  // Group combos by target actor
  const combosByTarget = useMemo(() => {
    const grouped = new Map<string, Array<{ progress: ComboProgress; definition: ComboDefinition }>>();

    activeCombos.forEach((progress) => {
      const definition = comboDefinitions.find((d) => d.id === progress.comboId);
      if (!definition) return;

      if (!grouped.has(progress.targetActorId)) {
        grouped.set(progress.targetActorId, []);
      }

      grouped.get(progress.targetActorId)!.push({ progress, definition });
    });

    return grouped;
  }, [activeCombos, comboDefinitions]);

  if (activeCombos.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 backdrop-blur rounded-lg shadow-2xl p-3 w-80 border border-purple-500/30">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-purple-500/30">
        <div className="text-xl">🎯</div>
        <div>
          <h3 className="text-sm font-bold text-white">Active Combos</h3>
          <p className="text-xs text-purple-300">{activeCombos.length} in progress</p>
        </div>
      </div>

      {/* Combo list */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {Array.from(combosByTarget.entries()).map(([targetId, combos]) => {
          const actor = actors.find((a) => a.id === targetId);
          if (!actor) return null;

          return (
            <div key={targetId} className="bg-black/30 rounded-lg p-2">
              {/* Target actor */}
              <div className="flex items-center gap-2 mb-2">
                <div className="text-xs font-semibold text-purple-300 truncate">
                  Target: {actor.name}
                </div>
              </div>

              {/* Combos for this target */}
              <div className="space-y-2">
                {combos.map(({ progress, definition }) => {
                  const progressPercent =
                    (progress.usedAbilities.length / definition.requiredAbilities.length) * 100;
                  const roundsLeft = definition.windowRounds - (currentRound - progress.startRound);
                  const isExpiringSoon = roundsLeft <= 1;

                  return (
                    <div
                      key={progress.comboId}
                      className={cn(
                        'bg-black/40 rounded p-2 border',
                        isExpiringSoon ? 'border-yellow-500/50' : 'border-purple-500/30'
                      )}
                    >
                      {/* Combo name and category */}
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-white truncate">
                            {definition.name}
                          </div>
                          <div className="text-[10px] text-purple-400 capitalize">
                            {definition.category}
                          </div>
                        </div>
                        {isExpiringSoon && (
                          <div className="text-yellow-500 text-xs" title="Expiring soon!">
                            ⚠️
                          </div>
                        )}
                      </div>

                      {/* Progress bar */}
                      <div className="mb-1">
                        <div className="h-1.5 bg-black/50 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              'h-full transition-all duration-300 rounded-full',
                              isExpiringSoon
                                ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                : 'bg-gradient-to-r from-purple-500 to-pink-500'
                            )}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Progress text */}
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-400">
                          {progress.usedAbilities.length} / {definition.requiredAbilities.length} abilities
                        </span>
                        <span
                          className={cn(
                            'font-semibold',
                            isExpiringSoon ? 'text-yellow-400' : 'text-purple-300'
                          )}
                        >
                          {roundsLeft} round{roundsLeft !== 1 ? 's' : ''} left
                        </span>
                      </div>

                      {/* Next ability hint */}
                      {progressPercent < 100 && (
                        <div className="mt-1.5 pt-1.5 border-t border-purple-500/20">
                          <div className="text-[10px] text-gray-400">Next ability:</div>
                          <div className="text-[10px] text-purple-300 font-mono">
                            {definition.requiredAbilities[progress.usedAbilities.length]
                              .replace(/_/g, ' ')
                              .toLowerCase()}
                          </div>
                        </div>
                      )}

                      {/* Bonus preview (on hover) */}
                      <div className="mt-1.5 pt-1.5 border-t border-purple-500/20">
                        <div className="text-[10px] text-gray-400 mb-0.5">Bonus:</div>
                        <div className="text-[9px] text-purple-200 leading-tight">
                          {formatComboBonus(definition.bonusEffect)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hint */}
      <div className="mt-2 pt-2 border-t border-purple-500/30 text-[10px] text-purple-300">
        💡 Complete combo sequences for powerful bonuses!
      </div>
    </div>
  );
}

// PHASE 5: Performance - Wrap with React.memo
export const ComboTracker = memo(ComboTrackerComponent);

// ============================================
// COMBO NOTIFICATION (Flash when completed)
// ============================================

export interface ComboNotificationProps {
  comboName: string;
  targetActorName: string;
  onDismiss: () => void;
}

export function ComboNotification({
  comboName,
  targetActorName,
  onDismiss,
}: ComboNotificationProps) {
  return (
    <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none animate-bounce">
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white px-8 py-4 rounded-xl shadow-2xl border-4 border-yellow-400">
        <div className="text-center">
          <div className="text-4xl mb-2">🎯✨</div>
          <div className="text-2xl font-bold mb-1">COMBO!</div>
          <div className="text-lg font-semibold">{comboName}</div>
          <div className="text-sm opacity-90 mt-1">on {targetActorName}</div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// HELPERS
// ============================================

function formatComboBonus(bonusEffect: any): string {
  const parts: string[] = [];

  if (bonusEffect.trustReduction) {
    parts.push(`-${Math.round(bonusEffect.trustReduction * 100)}% trust`);
  }
  if (bonusEffect.emotionalDamage) {
    parts.push(`-${Math.round(bonusEffect.emotionalDamage * 100)}% emotional`);
  }
  if (bonusEffect.infrastructureGain) {
    parts.push(`+${bonusEffect.infrastructureGain} infrastructure`);
  }
  if (bonusEffect.moneyRefund) {
    parts.push(`+$${bonusEffect.moneyRefund}`);
  }
  if (bonusEffect.attentionCost) {
    parts.push(`${bonusEffect.attentionCost} attention`);
  }
  if (bonusEffect.spreadToConnected) {
    parts.push('spreads to connected');
  }
  if (bonusEffect.cascadeDepth) {
    parts.push(`cascade depth ${bonusEffect.cascadeDepth}`);
  }
  if (bonusEffect.propagationBonus) {
    parts.push(`+${Math.round(bonusEffect.propagationBonus * 100)}% propagation`);
  }

  return parts.slice(0, 2).join(', ') + (parts.length > 2 ? '...' : '');
}
