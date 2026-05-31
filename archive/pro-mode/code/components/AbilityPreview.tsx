import { useMemo } from 'react';
import type { Actor, Ability } from '@/game-logic/types';
import { formatPercent } from '@/utils';
import { trustToHex } from '@/utils/colors';

type AbilityPreviewProps = {
  ability: Ability;
  sourceActor: Actor;
  validTargets: Actor[];
  onClose: () => void;
};

export function AbilityPreview({ ability, sourceActor, validTargets, onClose }: AbilityPreviewProps) {
  const estimatedImpact = useMemo(() => {
    const affected: Array<{ actor: Actor; trustChange: number }> = [];

    validTargets.forEach(target => {
      const trustDelta = ability.effects.trustDelta || 0;
      const resilienceFactor = 1 - target.resilience * 0.5;
      const emotionalFactor = target.emotionalState > 0.7 ? 1.2 : 1;
      const estimatedChange = trustDelta * resilienceFactor * emotionalFactor;

      affected.push({
        actor: target,
        trustChange: estimatedChange,
      });
    });

    return affected.sort((a, b) => a.trustChange - b.trustChange).slice(0, 8); // Top 8
  }, [ability, validTargets]);

  const totalAffected = ability.effects.propagates
    ? validTargets.length + Math.floor(validTargets.length * 0.5)
    : validTargets.length;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 max-w-md w-full border border-gray-700 shadow-2xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - fixed */}
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-white">{ability.name}</h2>
            <p className="text-gray-400 text-xs">Preview estimated impact</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl leading-none p-1"
          >
            ×
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 min-h-0">
          {/* Impact Summary */}
          <div className="bg-gray-800/50 rounded-lg p-3 mb-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] text-gray-400 mb-0.5">Targets Affected</p>
                <p className="text-xl font-bold text-blue-400">{totalAffected}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 mb-0.5">Effect Type</p>
                <p className="text-sm font-semibold text-white capitalize">{ability.effectType}</p>
              </div>
            </div>

            {ability.effects.propagates && (
              <div className="mt-2 text-[10px] text-purple-400">
                ⚡ This ability propagates through network connections
              </div>
            )}
          </div>

          {/* Most Affected Actors */}
          <div>
            <h3 className="text-xs font-semibold text-white mb-2">Most Affected Actors</h3>
            <div className="space-y-1.5">
              {estimatedImpact.map(({ actor, trustChange }) => (
                <div
                  key={actor.id}
                  className="bg-gray-800/30 rounded-lg p-2 flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-xs truncate">{actor.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[9px] text-gray-400">Current:</span>
                      <span className="text-[10px] font-semibold" style={{ color: trustToHex(actor.trust) }}>
                        {formatPercent(actor.trust)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className={`text-sm font-bold ${trustChange < 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {trustChange < 0 ? '' : '+'}{Math.round(trustChange * 100)}%
                    </p>
                    <p className="text-[9px] text-gray-500">
                      → {formatPercent(Math.max(0, Math.min(1, actor.trust + trustChange)))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer - fixed */}
        <div className="mt-3 flex justify-end flex-shrink-0 pt-2 border-t border-gray-700/50">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
