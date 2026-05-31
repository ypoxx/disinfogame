import { useMemo } from 'react';
import type { Actor, Ability } from '@/game-logic/types';
import { cn } from '@/utils/cn';
import { formatPercent } from '@/utils';
import { trustToHex, getCategoryColor, getCategoryColorLight, getTrustLabel } from '@/utils/colors';

// ============================================
// TYPES
// ============================================

type ActorPanelProps = {
  actor: Actor;
  abilities: Ability[];
  canUseAbility: (abilityId: string) => boolean;
  onSelectAbility: (abilityId: string) => void;
  selectedAbilityId?: string;
  targetingMode: boolean;
  onCancelAbility: () => void;
};

// ============================================
// SUB-COMPONENTS
// ============================================

function StatBar({ 
  label, 
  value, 
  color,
  showLabel = true,
}: { 
  label: string; 
  value: number; 
  color: string;
  showLabel?: boolean;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        {showLabel && (
          <span className="font-medium" style={{ color }}>
            {formatPercent(value)}
          </span>
        )}
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-2 rounded-full transition-all duration-300"
          style={{ 
            width: `${value * 100}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

function AbilityCard({
  ability,
  cooldown,
  canUse,
  isSelected,
  onClick,
}: {
  ability: Ability;
  cooldown: number;
  canUse: boolean;
  isSelected: boolean;
  onClick: () => void;
}) {
  const effectDescription = useMemo(() => {
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
    
    return effects.join(', ');
  }, [ability.effects]);

  return (
    <button
      onClick={onClick}
      disabled={!canUse}
      className={cn(
        "w-full p-3 rounded-lg border text-left transition-all",
        isSelected
          ? "border-blue-500 bg-blue-50 shadow-sm"
          : canUse
            ? "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
            : "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"
      )}
    >
      <div className="flex justify-between items-start mb-1">
        <span className={cn(
          "font-medium text-sm",
          isSelected ? "text-blue-900" : "text-gray-900"
        )}>
          {ability.name}
        </span>
        <span className={cn(
          "text-xs font-medium px-2 py-0.5 rounded",
          canUse
            ? "bg-blue-100 text-blue-700"
            : "bg-gray-100 text-gray-500"
        )}>
          {typeof ability.resourceCost === 'object'
            ? `💰${ability.resourceCost.money || 0}${ability.resourceCost.attention ? ` 👁️+${ability.resourceCost.attention}` : ''}`
            : `${ability.resourceCost} pts`}
        </span>
      </div>
      
      <p className="text-xs text-gray-500 mb-2 line-clamp-2">
        {ability.description}
      </p>
      
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">
          {effectDescription}
        </span>
        
        {cooldown > 0 ? (
          <span className="text-orange-600 font-medium">
            ⏱ {cooldown} rounds
          </span>
        ) : (
          <span className="text-green-600">Ready</span>
        )}
      </div>
    </button>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function ActorPanel({
  actor,
  abilities,
  canUseAbility,
  onSelectAbility,
  selectedAbilityId,
  targetingMode,
  onCancelAbility,
}: ActorPanelProps) {
  const categoryColor = getCategoryColor(actor.category);
  const categoryColorLight = getCategoryColorLight(actor.category);
  const trustColor = trustToHex(actor.trust);

  return (
    <div className="h-full flex flex-col">
      {/* Actor Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-14 h-14 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: categoryColorLight }}
          >
            <div 
              className="w-8 h-8 rounded-full border-2"
              style={{ 
                backgroundColor: trustColor,
                borderColor: categoryColor,
              }}
            />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900 text-lg">
              {actor.name}
            </h2>
            <p 
              className="text-sm font-medium capitalize"
              style={{ color: categoryColor }}
            >
              {actor.category}
            </p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="space-y-3">
          <StatBar 
            label="Trust" 
            value={actor.trust} 
            color={trustColor}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-gray-500">Resilience</span>
              <p className="font-semibold text-gray-900">
                {formatPercent(actor.resilience)}
              </p>
            </div>
            <div>
              <span className="text-xs text-gray-500">Emotional</span>
              <p className="font-semibold text-gray-900">
                {formatPercent(actor.emotionalState)}
              </p>
            </div>
          </div>
          
          <div className="text-xs text-gray-500">
            Trust level: <span className="font-medium" style={{ color: trustColor }}>
              {getTrustLabel(actor.trust)}
            </span>
          </div>
        </div>
      </div>

      {/* Vulnerabilities & Resistances */}
      {(actor.vulnerabilities.length > 0 || actor.resistances.length > 0) && (
        <div className="mb-6 p-3 bg-gray-50 rounded-lg">
          {actor.vulnerabilities.length > 0 && (
            <div className="mb-2">
              <span className="text-xs font-medium text-red-600">Vulnerabilities:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {actor.vulnerabilities.map(v => (
                  <span 
                    key={v}
                    className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded"
                  >
                    {v.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {actor.resistances.length > 0 && (
            <div>
              <span className="text-xs font-medium text-green-600">Resistances:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {actor.resistances.map(r => (
                  <span 
                    key={r}
                    className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded"
                  >
                    {r.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active Effects */}
      {actor.activeEffects.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Active Effects
          </h3>
          <div className="space-y-1">
            {actor.activeEffects.map(effect => (
              <div 
                key={effect.id}
                className="text-xs p-2 bg-yellow-50 border border-yellow-100 rounded flex justify-between"
              >
                <span className="text-yellow-800">
                  {effect.type.replace(/_/g, ' ')}
                </span>
                <span className="text-yellow-600">
                  {effect.duration} rounds left
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Abilities */}
      <div className="flex-1 overflow-y-auto">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Abilities
        </h3>
        <div className="space-y-2">
          {abilities.map(ability => (
            <AbilityCard
              key={ability.id}
              ability={ability}
              cooldown={actor.cooldowns[ability.id] || 0}
              canUse={canUseAbility(ability.id)}
              isSelected={selectedAbilityId === ability.id}
              onClick={() => canUseAbility(ability.id) && onSelectAbility(ability.id)}
            />
          ))}
          
          {abilities.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">
              No abilities available
            </p>
          )}
        </div>
      </div>

      {/* Cancel Button (when targeting) */}
      {targetingMode && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={onCancelAbility}
            className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
          >
            Cancel Targeting
          </button>
        </div>
      )}
    </div>
  );
}

export default ActorPanel;
