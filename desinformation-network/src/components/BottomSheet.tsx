import { useState } from 'react';
import type { Actor, Ability } from '@/game-logic/types';
import { trustToHex, getCategoryColor } from '@/utils/colors';
import { formatPercent } from '@/utils';
import { cn } from '@/utils/cn';

type NotificationType = 'info' | 'warning' | 'success' | 'error';

type BottomSheetProps = {
  actor: Actor | null;
  abilities: Ability[];
  resources: number;
  canUseAbility: (abilityId: string) => boolean;
  onSelectAbility: (abilityId: string) => void;
  onCancel: () => void;
  onClose: () => void;
  selectedAbilityId: string | null;
  targetingMode: boolean;
  addNotification: (type: NotificationType, message: string) => void;
};

export function BottomSheet({
  actor,
  abilities,
  resources,
  canUseAbility,
  onSelectAbility,
  onCancel,
  onClose,
  selectedAbilityId,
  targetingMode,
  addNotification,
}: BottomSheetProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!actor) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white px-6 py-3 text-center border-t border-gray-700 z-30">
        <p className="text-gray-400 text-sm">Select an actor from the network to view details and abilities</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-gray-900 text-white transition-all duration-300 border-t border-gray-600 shadow-2xl z-30",
        isExpanded ? "max-h-[50vh]" : "max-h-[280px]"
      )}
    >
      {/* Header Bar with Close Button */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Actor Panel</span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-gray-400 hover:text-white px-2 py-0.5 rounded border border-gray-700 hover:border-gray-500 transition-colors"
          >
            {isExpanded ? '▼ Collapse' : '▲ Expand'}
          </button>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
          title="Close panel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Targeting Mode Banner */}
      {targetingMode && (
        <div className="bg-red-600 px-4 py-2 flex items-center gap-2 animate-pulse">
          <span className="text-lg">🎯</span>
          <div className="flex-1">
            <div className="font-bold text-sm">SELECT A TARGET</div>
            <div className="text-xs text-red-100">Click on a highlighted actor</div>
          </div>
          <button
            onClick={onCancel}
            className="px-3 py-1 bg-red-800 hover:bg-red-900 rounded text-sm font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Content */}
      <div className={cn(
        "overflow-y-auto px-4 py-3",
        isExpanded ? "h-[calc(50vh-60px)]" : "h-[220px]"
      )}>
        {/* Compact Actor Header */}
        <div className="flex items-center gap-3 mb-3">
          {/* Actor Icon */}
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: getCategoryColor(actor.category) + '30' }}
          >
            <div
              className="w-6 h-6 rounded-full border-2 border-white"
              style={{ backgroundColor: trustToHex(actor.trust) }}
            />
          </div>

          {/* Name and Category */}
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-white truncate">
              {actor.name}
            </h2>
            <p className="text-gray-400 capitalize text-xs">
              {actor.category}
            </p>
          </div>

          {/* Compact Stats */}
          <div className="flex gap-3 text-xs">
            <div className="text-center">
              <div className="font-bold" style={{ color: trustToHex(actor.trust) }}>
                {formatPercent(actor.trust)}
              </div>
              <div className="text-gray-500">Trust</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-blue-400">
                {formatPercent(actor.resilience)}
              </div>
              <div className="text-gray-500">Res</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-orange-400">
                {formatPercent(actor.emotionalState)}
              </div>
              <div className="text-gray-500">Emo</div>
            </div>
          </div>
        </div>

        {/* Compact Vulnerabilities & Resistances */}
        {(actor.vulnerabilities.length > 0 || actor.resistances.length > 0) && (
          <div className="flex gap-2 mb-3 text-[10px]">
            {actor.vulnerabilities.length > 0 && (
              <div className="flex items-center gap-1 bg-red-900/30 px-2 py-1 rounded">
                <span className="text-red-400 font-semibold">Weak:</span>
                <span className="text-red-300">{actor.vulnerabilities.map(v => v.replace(/_/g, ' ')).join(', ')}</span>
              </div>
            )}
            {actor.resistances.length > 0 && (
              <div className="flex items-center gap-1 bg-green-900/30 px-2 py-1 rounded">
                <span className="text-green-400 font-semibold">Resist:</span>
                <span className="text-green-300">{actor.resistances.map(r => r.replace(/_/g, ' ')).join(', ')}</span>
              </div>
            )}
          </div>
        )}

        {/* Abilities - Main Focus */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-white">
              Abilities ({abilities.length})
            </h3>
            <div className="text-xs text-blue-400 font-semibold">
              Resources: {resources}
            </div>
          </div>

          {abilities.length === 0 ? (
            <div className="bg-gray-800/50 rounded-lg p-3 text-center border border-gray-700">
              <p className="text-gray-400 text-sm">No abilities available</p>
              <p className="text-xs text-gray-500">Defensive/neutral entity</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
              {abilities.map(ability => {
                const cooldown = actor.cooldowns[ability.id] || 0;
                const canUse = canUseAbility(ability.id);
                const isSelected = selectedAbilityId === ability.id;
                const hasEnoughResources = resources >= ability.resourceCost;

                let disabledReason = '';
                if (!canUse) {
                  if (!hasEnoughResources) {
                    disabledReason = `Need ${ability.resourceCost} (have ${resources})`;
                  } else if (cooldown > 0) {
                    disabledReason = `Cooldown: ${cooldown} rounds`;
                  } else {
                    disabledReason = 'Cannot use right now';
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
                      "relative p-2 rounded-lg border text-left transition-all",
                      isSelected
                        ? "border-blue-500 bg-blue-600/20 shadow-lg shadow-blue-500/20"
                        : canUse
                          ? "border-gray-700 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-800"
                          : "border-orange-700/30 bg-gray-800/30 opacity-60"
                    )}
                  >
                    {/* Ability Header */}
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-white text-xs leading-tight pr-1 truncate">
                        {ability.name}
                      </span>
                      <span className={cn(
                        "text-xs font-bold flex-shrink-0",
                        hasEnoughResources ? "text-blue-400" : "text-red-400"
                      )}>
                        {ability.resourceCost}
                      </span>
                    </div>

                    {/* Effect Summary */}
                    <div className="text-[10px] text-gray-400 mb-1">
                      {ability.effects.trustDelta && (
                        <span className="text-red-400">
                          {Math.round(ability.effects.trustDelta * 100)}% trust
                        </span>
                      )}
                      {ability.effects.propagates && (
                        <span className="text-purple-400 ml-1">• spreads</span>
                      )}
                    </div>

                    {/* Target Type Indicator */}
                    <div className="text-[9px] text-gray-500">
                      {ability.targetType === 'network' && (
                        <span className="text-yellow-500">⚡ Network-wide</span>
                      )}
                      {ability.targetType === 'self' && (
                        <span className="text-cyan-500">↻ Self-buff</span>
                      )}
                      {ability.targetType === 'adjacent' && (
                        <span className="text-blue-500">◎ Adjacent only</span>
                      )}
                      {ability.targetType === 'creates_new_actor' && (
                        <span className="text-green-500">+ Creates actor</span>
                      )}
                    </div>

                    {/* Status */}
                    {cooldown > 0 && (
                      <div className="text-[10px] text-orange-400">
                        ⏱ {cooldown}r
                      </div>
                    )}
                    {!hasEnoughResources && cooldown === 0 && (
                      <div className="text-[10px] text-red-400">
                        💰 Need {ability.resourceCost}
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
