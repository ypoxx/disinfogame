import { useState } from 'react';
import type { Actor, Ability } from '@/game-logic/types';
import { trustToHex, getCategoryColor, getTrustLabel } from '@/utils/colors';
import { formatPercent } from '@/utils';
import { cn } from '@/utils/cn';
import { AbilityPreview } from './AbilityPreview';

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
  addNotification: (type: 'info' | 'warning' | 'success' | 'error', message: string) => void;
  getValidTargets: (abilityId: string, actorId: string) => Actor[];
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
  getValidTargets,
}: BottomSheetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [previewAbility, setPreviewAbility] = useState<Ability | null>(null);
  const [previewTargets, setPreviewTargets] = useState<Actor[]>([]);

  if (!actor) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/95 to-gray-900/90 backdrop-blur-md text-white px-8 py-4 text-center border-t border-gray-700 z-50">
        <p className="text-gray-400">Wähle einen Akteur aus dem Netzwerk</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/95 to-gray-800/90 backdrop-blur-md text-white transition-all duration-300 border-t border-gray-700/50 shadow-2xl z-50",
        isExpanded ? "h-[65vh]" : "h-auto max-h-[45vh]"
      )}
    >
      {/* Drag Handle & Close Button */}
      <div className="relative">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-600 rounded-full hover:bg-gray-500 transition-colors"
          aria-label={isExpanded ? "Minimieren" : "Erweitern"}
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 transition-colors text-gray-300 hover:text-white"
          aria-label="Schließen"
        >
          ✕
        </button>
      </div>

      {/* Targeting Mode Banner */}
      {targetingMode && (
        <div className="bg-red-600 px-6 py-3 flex items-center gap-3 animate-pulse">
          <span className="text-2xl">🎯</span>
          <div className="flex-1">
            <div className="font-bold text-lg">WÄHLE EIN ZIEL</div>
            <div className="text-sm text-red-100">
              Klicke auf einen markierten Akteur im Netzwerk
            </div>
          </div>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-red-800 hover:bg-red-900 rounded-lg font-medium transition-colors"
          >
            Abbrechen
          </button>
        </div>
      )}

      {/* Content */}
      <div className={cn(
        "overflow-y-auto px-6 pb-6",
        isExpanded ? "h-full pt-10" : "max-h-[40vh] pt-8"
      )}>
        {/* Actor Header - Compact */}
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: getCategoryColor(actor.category) + '20' }}
          >
            <div
              className="w-9 h-9 rounded-full border-2 border-white"
              style={{ backgroundColor: trustToHex(actor.trust) }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white mb-0.5 truncate">
              {actor.name}
            </h2>
            <p className="text-gray-400 capitalize text-sm">
              {actor.category}
            </p>
          </div>

          {/* Quick Stats - Compact */}
          <div className="flex gap-4 text-center flex-shrink-0">
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Trust</p>
              <p
                className="text-xl font-bold"
                style={{ color: trustToHex(actor.trust) }}
              >
                {formatPercent(actor.trust)}
              </p>
              <p className="text-[10px] text-gray-500">{getTrustLabel(actor.trust)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Resilience</p>
              <p className="text-xl font-bold text-blue-400">
                {formatPercent(actor.resilience)}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Emotional</p>
              <p className="text-xl font-bold text-orange-400">
                {formatPercent(actor.emotionalState)}
              </p>
            </div>
          </div>
        </div>

        {/* Vulnerabilities & Resistances - Compact */}
        {(actor.vulnerabilities.length > 0 || actor.resistances.length > 0) && (
          <div className="flex gap-3 mb-4">
            {actor.vulnerabilities.length > 0 && (
              <div className="flex-1 bg-red-900/20 border border-red-800/30 rounded-lg p-2">
                <p className="text-red-400 text-xs font-semibold mb-1">Anfällig für:</p>
                <div className="flex flex-wrap gap-1">
                  {actor.vulnerabilities.map(v => (
                    <span key={v} className="text-xs bg-red-800/40 px-1.5 py-0.5 rounded">
                      {v.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {actor.resistances.length > 0 && (
              <div className="flex-1 bg-green-900/20 border border-green-800/30 rounded-lg p-2">
                <p className="text-green-400 text-xs font-semibold mb-1">Resistent gegen:</p>
                <div className="flex flex-wrap gap-1">
                  {actor.resistances.map(r => (
                    <span key={r} className="text-xs bg-green-800/40 px-1.5 py-0.5 rounded">
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
          <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
            <span>Verfügbare Fähigkeiten</span>
            <span className="text-sm text-gray-400">({abilities.length})</span>
          </h3>

          {abilities.length === 0 ? (
            <div className="bg-gray-800/50 rounded-lg p-6 text-center border border-gray-700">
              <p className="text-gray-400 mb-2">Keine Fähigkeiten verfügbar</p>
              <p className="text-sm text-gray-500">
                Dieser Akteur ist defensiv/neutral und kann nicht zur Verbreitung von Desinformation genutzt werden.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-4">
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
                  effects.push('⚡ propagates');
                }

                const hasEnoughResources = resources >= ability.resourceCost;
                const notOnCooldown = cooldown === 0;

                let disabledReason = '';
                if (!canUse) {
                  if (!hasEnoughResources) {
                    disabledReason = `Benötigt ${ability.resourceCost} (habe ${resources})`;
                  } else if (!notOnCooldown) {
                    disabledReason = `Cooldown: ${cooldown} Runden`;
                  } else {
                    disabledReason = 'Kann nicht verwendet werden';
                  }
                }

                return (
                  <div key={ability.id} className="relative">
                    <button
                      onClick={() => {
                        if (canUse) {
                          onSelectAbility(ability.id);
                        } else {
                          addNotification('warning', disabledReason);
                        }
                      }}
                      className={cn(
                        "relative p-3 rounded-lg border text-left transition-all group w-full",
                        isSelected
                          ? "border-blue-500 bg-blue-600/20 shadow-lg shadow-blue-500/20"
                          : canUse
                            ? "border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800"
                            : "border-orange-700/50 bg-orange-900/10 hover:border-orange-600/50 cursor-pointer"
                      )}
                    >
                      {/* Ability Name & Cost */}
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="font-semibold text-white text-sm pr-2 flex-1">{ability.name}</span>
                        <span className="text-blue-400 font-bold text-xs flex-shrink-0">
                          {ability.resourceCost} pts
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                        {ability.description}
                      </p>

                      {/* Effects */}
                      {effects.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-1.5">
                          {effects.map((effect, i) => (
                            <span
                              key={i}
                              className="text-xs bg-gray-700/50 px-1.5 py-0.5 rounded text-gray-300"
                            >
                              {effect}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Status Indicators & Preview Button */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex-1">
                          {cooldown > 0 && (
                            <div className="text-xs text-orange-400 font-semibold">
                              ⏱ Cooldown: {cooldown} Runden
                            </div>
                          )}
                          {!hasEnoughResources && (
                            <div className="text-xs text-red-400 font-semibold">
                              ❌ {disabledReason}
                            </div>
                          )}
                          {!canUse && cooldown === 0 && hasEnoughResources && (
                            <div className="text-xs text-orange-300 font-semibold">
                              ⚠️ Klicke für Details
                            </div>
                          )}
                        </div>

                        {/* Preview Button */}
                        {canUse && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const targets = getValidTargets(ability.id, actor.id);
                              setPreviewAbility(ability);
                              setPreviewTargets(targets);
                            }}
                            className="px-2 py-1 bg-purple-600/80 hover:bg-purple-700 text-white text-xs rounded transition-colors flex-shrink-0"
                            title="Vorschau des Effekts"
                          >
                            👁️ Vorschau
                          </button>
                        )}
                      </div>

                      {/* Hover Tooltip - Only for available abilities */}
                      {canUse && (
                        <div className="invisible group-hover:visible absolute left-0 right-0 bottom-full mb-2 bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl z-[55] pointer-events-none border border-gray-600">
                          <div className="font-bold mb-1">{ability.name}</div>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Ziel:</span>
                              <span className="text-blue-300 capitalize">{ability.targetType}</span>
                            </div>
                            {ability.targetCategory && (
                              <div className="flex justify-between">
                                <span className="text-gray-400">Kategorie:</span>
                                <span className="text-purple-300 capitalize">{ability.targetCategory}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-gray-400">Cooldown:</span>
                              <span className="text-yellow-300">{ability.cooldown} Runden</span>
                            </div>
                            <div className="text-green-400 mt-1 pt-1 border-t border-gray-700">
                              ✓ Klicken zum Auswählen
                            </div>
                          </div>
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
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
