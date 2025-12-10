/**
 * Compact Side Panel (Phase 0.3)
 *
 * Replaces BottomSheet to fix the following issues:
 * - Bottom sheet blocks the network visualization
 * - Takes up too much vertical space
 * - Overlaps with controls
 *
 * Solution:
 * - 300px fixed-width right-side panel
 * - Always visible (no collapsing to 0)
 * - Minimizable to narrow strip (60px)
 * - Doesn't block network view
 *
 * Benefits:
 * - Network always visible
 * - No overlap conflicts
 * - Better use of widescreen space
 * - Consistent information location
 */

import { useState } from 'react';
import type { Actor, Ability, Resources } from '@/game-logic/types';
import { trustToHex, getCategoryColor } from '@/utils/colors';
import { formatPercent } from '@/utils';
import { cn } from '@/utils/cn';
import { AbilityPreview } from './AbilityPreview';

type CompactSidePanelProps = {
  actor: Actor | null;
  abilities: Ability[];
  resources: Resources;
  canUseAbility: (abilityId: string) => boolean;
  onSelectAbility: (abilityId: string) => void;
  onCancel: () => void;
  selectedAbilityId: string | null;
  targetingMode: boolean;
  addNotification: (type: 'info' | 'warning' | 'success' | 'error', message: string) => void;
  getValidTargets: (abilityId: string) => Actor[];
};

export function CompactSidePanel({
  actor,
  abilities,
  resources,
  canUseAbility,
  onSelectAbility,
  onCancel,
  selectedAbilityId,
  targetingMode,
  addNotification,
  getValidTargets,
}: CompactSidePanelProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [previewAbility, setPreviewAbility] = useState<Ability | null>(null);
  const [previewTargets, setPreviewTargets] = useState<Actor[]>([]);

  // If no actor selected, show minimized panel with hint
  if (!actor) {
    return (
      <div className="fixed top-0 right-0 bottom-0 w-[300px] bg-gradient-to-l from-gray-900/95 to-gray-800/90 backdrop-blur-md border-l border-gray-700/50 z-30 flex flex-col items-center justify-center text-center p-6 animate-fade-in">
        <div className="text-6xl mb-4 opacity-50">👤</div>
        <h3 className="text-lg font-semibold text-white mb-2">No Actor Selected</h3>
        <p className="text-sm text-gray-400 leading-relaxed">
          Click on any actor in the network to view their details and available abilities
        </p>
      </div>
    );
  }

  // Minimized state - just a narrow strip with actor name
  if (isMinimized) {
    return (
      <div className="fixed top-0 right-0 bottom-0 w-[60px] bg-gradient-to-l from-gray-900/95 to-gray-800/90 backdrop-blur-md border-l border-gray-700/50 z-30 flex flex-col animate-fade-in">
        {/* Expand Button */}
        <button
          onClick={() => setIsMinimized(false)}
          className="w-full h-12 flex items-center justify-center border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
          aria-label="Expand panel"
        >
          <span className="text-gray-400 text-xl">◀</span>
        </button>

        {/* Actor Indicator (rotated) */}
        <div className="flex-1 flex items-center justify-center">
          <div
            className="w-10 h-10 rounded-full border-3 border-white"
            style={{ backgroundColor: trustToHex(actor.trust) }}
          />
        </div>

        {/* Close Button */}
        <button
          onClick={onCancel}
          className="w-full h-12 flex items-center justify-center border-t border-gray-700/50 hover:bg-red-600/20 transition-colors text-gray-400 hover:text-red-400"
          aria-label="Close panel"
        >
          <span className="text-xl">✕</span>
        </button>
      </div>
    );
  }

  // Full panel
  return (
    <div className="fixed top-0 right-0 bottom-0 w-[300px] bg-gradient-to-l from-gray-900/95 to-gray-800/90 backdrop-blur-md border-l border-gray-700/50 z-30 flex flex-col overflow-hidden animate-fade-in">
      {/* Header Bar */}
      <div className="flex-shrink-0 h-12 flex items-center justify-between px-4 border-b border-gray-700/50 bg-gray-900/50">
        <h3 className="text-sm font-semibold text-white">Actor Details</h3>
        <div className="flex gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-700/50 transition-colors text-gray-400 hover:text-white"
            aria-label="Minimize panel"
          >
            <span className="text-sm">▶</span>
          </button>
          <button
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-red-600/20 transition-colors text-gray-400 hover:text-red-400"
            aria-label="Close panel"
          >
            <span className="text-sm">✕</span>
          </button>
        </div>
      </div>

      {/* Targeting Mode Banner */}
      {targetingMode && (
        <div className="flex-shrink-0 bg-red-600 px-4 py-3 animate-pulse">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🎯</span>
            <div className="font-bold text-sm text-white">TARGET MODE</div>
          </div>
          <div className="text-xs text-red-100 mb-2">
            Click on a highlighted actor in the network
          </div>
          <button
            onClick={onCancel}
            className="w-full px-3 py-1.5 bg-red-800 hover:bg-red-900 rounded text-sm font-medium transition-colors text-white"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Actor Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: getCategoryColor(actor.category) + '20' }}
            >
              <div
                className="w-8 h-8 rounded-full border-3 border-white"
                style={{ backgroundColor: trustToHex(actor.trust) }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-white truncate">
                {actor.name}
              </h2>
              <p className="text-gray-400 capitalize text-xs">
                {actor.category} · Tier {actor.tier}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 bg-gray-800/30 rounded-lg p-2 border border-gray-700/30">
            <div className="text-center">
              <p className="text-gray-400 text-[10px] mb-0.5">Trust</p>
              <p
                className="text-sm font-bold"
                style={{ color: trustToHex(actor.trust) }}
              >
                {formatPercent(actor.trust)}
              </p>
            </div>
            <div className="text-center border-x border-gray-700/30">
              <p className="text-gray-400 text-[10px] mb-0.5">Resilience</p>
              <p className="text-sm font-bold text-blue-400">
                {formatPercent(actor.resilience)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-[10px] mb-0.5">Emotional</p>
              <p className="text-sm font-bold text-orange-400">
                {formatPercent(actor.emotionalState)}
              </p>
            </div>
          </div>
        </div>

        {/* Vulnerabilities & Resistances */}
        {(actor.vulnerabilities.length > 0 || actor.resistances.length > 0) && (
          <div className="space-y-2">
            {actor.vulnerabilities.length > 0 && (
              <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-2">
                <p className="text-red-400 text-[10px] font-semibold mb-1">Vulnerable to:</p>
                <div className="flex flex-wrap gap-1">
                  {actor.vulnerabilities.map(v => (
                    <span key={v} className="text-[10px] bg-red-800/40 px-1.5 py-0.5 rounded">
                      {v.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {actor.resistances.length > 0 && (
              <div className="bg-green-900/20 border border-green-800/30 rounded-lg p-2">
                <p className="text-green-400 text-[10px] font-semibold mb-1">Resistant to:</p>
                <div className="flex flex-wrap gap-1">
                  {actor.resistances.map(r => (
                    <span key={r} className="text-[10px] bg-green-800/40 px-1.5 py-0.5 rounded">
                      {r.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Abilities */}
        <div>
          <h3 className="text-xs font-semibold text-white mb-2 flex items-center justify-between">
            <span>Abilities</span>
            <span className="text-gray-400">({abilities.length})</span>
          </h3>

          {abilities.length === 0 ? (
            <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
              <p className="text-gray-400 text-xs mb-1">No abilities available</p>
              <p className="text-[10px] text-gray-500">
                This actor cannot be used to spread disinformation.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {abilities.map(ability => {
                const cooldown = actor.cooldowns[ability.id] || 0;
                const canUse = canUseAbility(ability.id);
                const isSelected = selectedAbilityId === ability.id;

                // Build effect description
                const effects: string[] = [];
                if (ability.effects.trustDelta) {
                  const sign = ability.effects.trustDelta < 0 ? '' : '+';
                  effects.push(`${sign}${Math.round(ability.effects.trustDelta * 100)}% trust`);
                }
                if (ability.effects.emotionalDelta) {
                  effects.push(`+${Math.round(ability.effects.emotionalDelta * 100)}% emotional`);
                }
                if (ability.effects.resilienceDelta) {
                  effects.push(`${ability.effects.resilienceDelta < 0 ? '' : '+'}${Math.round(ability.effects.resilienceDelta * 100)}% resilience`);
                }
                if (ability.effects.propagates) {
                  effects.push('propagates');
                }

                const cost = ability.resourceCost;
                const hasEnoughResources =
                  resources.money >= (cost.money || 0) &&
                  resources.infrastructure >= (cost.infrastructure || 0);
                const notOnCooldown = cooldown === 0;

                let disabledReason = '';
                if (!canUse) {
                  if (!hasEnoughResources) {
                    const missing: string[] = [];
                    if (resources.money < (cost.money || 0)) missing.push(`💰${cost.money}`);
                    if (resources.infrastructure < (cost.infrastructure || 0)) missing.push(`🔧${cost.infrastructure}`);
                    disabledReason = `Need ${missing.join(', ')}`;
                  } else if (!notOnCooldown) {
                    disabledReason = `On cooldown: ${cooldown} rounds`;
                  } else {
                    disabledReason = 'Cannot use this ability';
                  }
                }

                return (
                  <button
                    key={ability.id}
                    onClick={() => {
                      if (canUse) {
                        onSelectAbility(ability.id);
                      } else {
                        addNotification('warning', disabledReason);
                      }
                    }}
                    className={cn(
                      "w-full p-2.5 rounded-lg border text-left transition-all",
                      isSelected
                        ? "border-blue-500 bg-blue-600/20 shadow-lg shadow-blue-500/20"
                        : canUse
                          ? "border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800"
                          : "border-orange-700/50 bg-orange-900/10 hover:border-orange-600/50"
                    )}
                  >
                    {/* Ability Name & Cost */}
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-white text-xs pr-1 flex-1 leading-tight">
                        {ability.name}
                      </span>
                      <div className="flex gap-1 text-[10px] flex-shrink-0">
                        {cost.money && cost.money > 0 && (
                          <span className="text-yellow-400 font-bold">💰{cost.money}</span>
                        )}
                        {cost.attention && cost.attention > 0 && (
                          <span className="text-red-400 font-bold">👁️+{cost.attention}</span>
                        )}
                        {cost.infrastructure && cost.infrastructure > 0 && (
                          <span className="text-purple-400 font-bold">🔧{cost.infrastructure}</span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-[10px] text-gray-400 mb-1.5 line-clamp-2 leading-tight">
                      {ability.description}
                    </p>

                    {/* Effects */}
                    {effects.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-1.5">
                        {effects.map((effect, i) => (
                          <span
                            key={i}
                            className="text-[9px] bg-gray-700/50 px-1 py-0.5 rounded text-gray-300"
                          >
                            {effect}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Status & Preview */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        {cooldown > 0 && (
                          <div className="text-[10px] text-orange-400 font-semibold">
                            ⏱ Cooldown: {cooldown}r
                          </div>
                        )}
                        {!hasEnoughResources && (
                          <div className="text-[10px] text-red-400 font-semibold truncate">
                            ❌ {disabledReason}
                          </div>
                        )}
                      </div>

                      {/* Preview Button */}
                      {canUse && actor && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const targets = getValidTargets(ability.id);
                            setPreviewAbility(ability);
                            setPreviewTargets(targets);
                          }}
                          className="px-2 py-0.5 bg-purple-600/80 hover:bg-purple-700 text-white text-[10px] rounded transition-colors flex-shrink-0"
                          title="Preview impact"
                        >
                          👁️
                        </button>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer - Resource Display */}
      <div className="flex-shrink-0 px-4 py-2 border-t border-gray-700/50 bg-gray-900/50">
        <div className="flex items-center justify-around text-xs">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">💰</span>
            <span className="font-semibold text-yellow-300">{resources.money}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-red-400">👁️</span>
            <span className="font-semibold text-red-300">{Math.round(resources.attention)}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-purple-400">🔧</span>
            <span className="font-semibold text-purple-300">{resources.infrastructure}</span>
          </div>
        </div>
      </div>

      {/* Ability Preview Modal */}
      {previewAbility && actor && (
        <AbilityPreview
          ability={previewAbility}
          sourceActor={actor}
          validTargets={previewTargets}
          onClose={() => {
            setPreviewAbility(null);
            setPreviewTargets([]);
          }}
        />
      )}
    </div>
  );
}

export default CompactSidePanel;
