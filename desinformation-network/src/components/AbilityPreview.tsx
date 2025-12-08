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
      // Estimate trust change based on ability effects
      const trustDelta = ability.effects.trustDelta || 0;

      // Factor in resilience and emotional state
      const resilienceFactor = 1 - target.resilience * 0.5;
      const emotionalFactor = target.emotionalState > 0.7 ? 1.2 : 1;

      const estimatedChange = trustDelta * resilienceFactor * emotionalFactor;

      affected.push({
        actor: target,
        trustChange: estimatedChange,
      });
    });

    return affected.sort((a, b) => a.trustChange - b.trustChange).slice(0, 5); // Top 5
  }, [ability, validTargets]);

  const totalAffected = ability.effects.propagates
    ? validTargets.length + Math.floor(validTargets.length * 0.5)
    : validTargets.length;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 max-w-2xl w-full border border-gray-700 shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{ability.name}</h2>
            <p className="text-gray-400">Vorschau des erwarteten Effekts</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 transition-colors text-gray-300 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {/* Impact Summary */}
        <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Betroffene Ziele</p>
              <p className="text-3xl font-bold text-blue-400">{totalAffected}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Effekt-Typ</p>
              <p className="text-lg font-semibold text-white capitalize">
                {ability.targetType === 'single' ? 'Einzelziel' :
                 ability.targetType === 'adjacent' ? 'Benachbart' :
                 ability.targetType === 'category' ? 'Kategorie' : 'Netzwerk'}
              </p>
            </div>
          </div>

          {ability.effects.propagates && (
            <div className="mt-4 text-sm text-purple-400 flex items-center gap-2">
              <span>⚡</span>
              <span>Diese Fähigkeit verbreitet sich durch Netzwerk-Verbindungen</span>
            </div>
          )}
        </div>

        {/* Most Affected Actors */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Am stärksten betroffen</h3>
          {estimatedImpact.length === 0 ? (
            <p className="text-gray-400 text-sm">Keine gültigen Ziele verfügbar</p>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {estimatedImpact.map(({ actor, trustChange }) => (
                <div
                  key={actor.id}
                  className="bg-gray-800/30 rounded-lg p-3 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <p className="font-medium text-white">{actor.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">Aktuell:</span>
                      <span className="text-sm font-semibold" style={{ color: trustToHex(actor.trust) }}>
                        {formatPercent(actor.trust)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${trustChange < 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {trustChange < 0 ? '' : '+'}{Math.round(trustChange * 100)}%
                    </p>
                    <p className="text-xs text-gray-500">
                      → {formatPercent(Math.max(0, Math.min(1, actor.trust + trustChange)))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action hint */}
        <div className="mt-6 pt-4 border-t border-gray-700/50 text-center">
          <p className="text-sm text-gray-400">
            Klicke außerhalb oder auf ✕ um zu schließen
          </p>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes scale-in {
          0% {
            transform: scale(0.95);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default AbilityPreview;
