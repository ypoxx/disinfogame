import { useState } from 'react';
import type { Actor, Ability, Resources, ResourceCost } from '@/game-logic/types';
import { trustToHex, getCategoryColor, getTrustLabel } from '@/utils/colors';
import { formatPercent } from '@/utils';
import { cn } from '@/utils/cn';

type BottomSheetProps = {
  actor: Actor | null;
  abilities: Ability[];
  resources: Resources;
  canUseAbility: (abilityId: string) => boolean;
  onSelectAbility: (abilityId: string) => void;
  onCancel: () => void;
  selectedAbilityId: string | null;
  targetingMode: boolean;
  addNotification: (type: 'info' | 'warning' | 'success' | 'error', message: string) => void;
};

export function BottomSheet({
  actor,
  abilities,
  resources,
  canUseAbility,
  onSelectAbility,
  onCancel,
  selectedAbilityId,
  targetingMode,
  addNotification,
}: BottomSheetProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!actor) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/95 to-gray-900/90 backdrop-blur-sm text-white px-8 py-4 text-center border-t border-gray-700 z-50 animate-fade-in">
        <p className="text-gray-400">Select an actor from the network to view details and abilities</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-gray-800 backdrop-blur-sm text-white transition-all duration-500 ease-out border-t border-gray-700 shadow-2xl z-50",
        isExpanded ? "h-[60vh]" : "h-auto",
        "animate-slide-up"
      )}
    >
      {/* Drag Handle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-600 rounded-full hover:bg-gray-500 transition-colors"
      />

      {/* Targeting Mode Banner */}
      {targetingMode && (
        <div className="bg-red-600 px-6 py-3 flex items-center gap-3 animate-pulse">
          <span className="text-2xl">🎯</span>
          <div className="flex-1">
            <div className="font-bold text-lg">SELECT A TARGET</div>
            <div className="text-sm text-red-100">
              Click on a highlighted actor in the network to apply the ability
            </div>
          </div>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-red-800 hover:bg-red-900 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Content */}
      <div className={cn(
        "overflow-y-auto px-8 py-6",
        isExpanded ? "h-full" : "max-h-[40vh]"
      )}>
        {/* Actor Header */}
        <div className="flex items-center gap-6 mb-6">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: getCategoryColor(actor.category) + '20' }}
          >
            <div
              className="w-12 h-12 rounded-full border-4 border-white"
              style={{ backgroundColor: trustToHex(actor.trust) }}
            />
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-1">
              {actor.name}
            </h2>
            <p className="text-gray-400 capitalize text-lg">
              {actor.category}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-gray-400 text-sm mb-1">Trust</p>
              <p
                className="text-3xl font-bold"
                style={{ color: trustToHex(actor.trust) }}
              >
                {formatPercent(actor.trust)}
              </p>
              <p className="text-xs text-gray-500">{getTrustLabel(actor.trust)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Resilience</p>
              <p className="text-3xl font-bold text-blue-400">
                {formatPercent(actor.resilience)}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Emotional</p>
              <p className="text-3xl font-bold text-orange-400">
                {formatPercent(actor.emotionalState)}
              </p>
            </div>
          </div>
        </div>

        {/* Vulnerabilities & Resistances */}
        {(actor.vulnerabilities.length > 0 || actor.resistances.length > 0) && (
          <div className="flex gap-4 mb-6">
            {actor.vulnerabilities.length > 0 && (
              <div className="flex-1 bg-red-900/20 border border-red-800/30 rounded-lg p-3">
                <p className="text-red-400 text-xs font-semibold mb-1.5">Vulnerable to:</p>
                <div className="flex flex-wrap gap-1.5">
                  {actor.vulnerabilities.map(v => (
                    <span key={v} className="text-xs bg-red-800/40 px-2 py-1 rounded">
                      {v.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {actor.resistances.length > 0 && (
              <div className="flex-1 bg-green-900/20 border border-green-800/30 rounded-lg p-3">
                <p className="text-green-400 text-xs font-semibold mb-1.5">Resistant to:</p>
                <div className="flex flex-wrap gap-1.5">
                  {actor.resistances.map(r => (
                    <span key={r} className="text-xs bg-green-800/40 px-2 py-1 rounded">
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
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <span>Available Abilities</span>
            <span className="text-sm text-gray-400">({abilities.length})</span>
          </h3>

          {abilities.length === 0 ? (
            <div className="bg-gray-800/50 rounded-lg p-6 text-center border border-gray-700">
              <p className="text-gray-400 mb-2">No abilities available</p>
              <p className="text-sm text-gray-500">
                This actor is a defensive/neutral entity and cannot be used to spread disinformation.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
                    disabledReason = 'Cannot use this ability right now';
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
                      "relative p-4 rounded-lg border text-left transition-all group",
                      isSelected
                        ? "border-blue-500 bg-blue-600/20 shadow-lg shadow-blue-500/20"
                        : canUse
                          ? "border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800"
                          : "border-orange-700/50 bg-orange-900/10 hover:border-orange-600/50 cursor-pointer"
                    )}
                  >
                    {/* Ability Name & Cost */}
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-white pr-2">{ability.name}</span>
                      <div className="flex gap-2 text-xs flex-shrink-0">
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
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                      {ability.description}
                    </p>

                    {/* Effects */}
                    {effects.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {effects.map((effect, i) => (
                          <span
                            key={i}
                            className="text-xs bg-gray-700/50 px-2 py-0.5 rounded text-gray-300"
                          >
                            {effect}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Status Indicators */}
                    {cooldown > 0 && (
                      <div className="mt-2 text-xs text-orange-400 font-semibold">
                        ⏱ Cooldown: {cooldown} rounds
                      </div>
                    )}
                    {!hasEnoughResources && (
                      <div className="mt-2 text-xs text-red-400 font-semibold">
                        ❌ {disabledReason}
                      </div>
                    )}
                    {!canUse && (
                      <div className="mt-2 text-xs text-orange-300 font-semibold">
                        ⚠️ Click to see why unavailable
                      </div>
                    )}

                    {/* Hover Tooltip */}
                    {canUse && (
                      <div className="invisible group-hover:visible absolute left-0 right-0 bottom-full mb-2 bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl z-50 pointer-events-none">
                        <div className="font-bold mb-1">{ability.name}</div>
                        <div className="space-y-1">
                          <div className="text-blue-300">Target: {ability.targetType}</div>
                          {ability.targetCategory && (
                            <div className="text-blue-300">Category: {ability.targetCategory}</div>
                          )}
                          <div className="text-yellow-300">Cooldown: {ability.cooldown} rounds</div>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
