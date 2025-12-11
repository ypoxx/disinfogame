/**
 * Unified Right Panel (Phase 3.2)
 *
 * Integrates all right-side UI elements into one cohesive panel:
 * - Victory Progress (header)
 * - Resources display
 * - End Round action
 * - Actor Details (when selected)
 *
 * Solves:
 * - Layer overlap between VictoryProgressBar HUD and CompactSidePanel
 * - Inconsistent positioning of related UI elements
 * - Visual competition for attention
 */

import { useState } from 'react';
import type { Actor, Ability, Resources, NetworkMetrics } from '@/game-logic/types';
import { trustToHex, getCategoryColor } from '@/utils/colors';
import { formatPercent } from '@/utils';
import { cn } from '@/utils/cn';
import { AbilityPreview } from './AbilityPreview';

// ============================================
// TYPES
// ============================================

type UnifiedRightPanelProps = {
  // Game State
  round: number;
  maxRounds: number;
  resources: Resources;
  networkMetrics: NetworkMetrics;
  victoryThreshold: number;
  trustThreshold: number;

  // Actor State
  selectedActor: Actor | null;
  abilities: Ability[];
  selectedAbilityId: string | null;
  targetingMode: boolean;

  // Callbacks
  onAdvanceRound: () => void;
  onSelectAbility: (abilityId: string) => void;
  onCancelAbility: () => void;
  onClosePanel: () => void;
  canUseAbility: (abilityId: string) => boolean;
  addNotification: (type: 'info' | 'warning' | 'success' | 'error', message: string) => void;
  getValidTargets: (abilityId: string) => Actor[];
};

// ============================================
// MAIN COMPONENT
// ============================================

export function UnifiedRightPanel({
  round,
  maxRounds,
  resources,
  networkMetrics,
  victoryThreshold,
  trustThreshold,
  selectedActor,
  abilities,
  selectedAbilityId,
  targetingMode,
  onAdvanceRound,
  onSelectAbility,
  onCancelAbility,
  onClosePanel,
  canUseAbility,
  addNotification,
  getValidTargets,
}: UnifiedRightPanelProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [previewAbility, setPreviewAbility] = useState<Ability | null>(null);
  const [previewTargets, setPreviewTargets] = useState<Actor[]>([]);

  // Victory calculations
  const totalActors = networkMetrics.lowTrustCount + networkMetrics.highTrustCount;
  const targetActors = Math.ceil(totalActors * victoryThreshold);
  const currentActors = networkMetrics.lowTrustCount;
  const progress = currentActors / targetActors;

  // Pace calculation
  const expectedProgress = (round / maxRounds) * targetActors;
  const paceStatus = currentActors > expectedProgress ? 'ahead' : currentActors < expectedProgress * 0.7 ? 'behind' : 'on-track';

  const paceConfig = {
    'ahead': { icon: '🟢', color: 'text-green-400', label: 'Ahead' },
    'on-track': { icon: '🔵', color: 'text-blue-400', label: 'On track' },
    'behind': { icon: '🟡', color: 'text-orange-400', label: 'Behind' },
  }[paceStatus];

  // ============================================
  // MINIMIZED STATE
  // ============================================

  if (isMinimized) {
    return (
      <div className="fixed top-0 right-0 bottom-0 w-16 bg-gray-900/95 backdrop-blur-md border-l border-gray-700/50 z-30 flex flex-col animate-fade-in">
        {/* Expand Button */}
        <button
          onClick={() => setIsMinimized(false)}
          className="h-12 flex items-center justify-center border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
          aria-label="Expand panel"
        >
          <span className="text-gray-400 text-lg">◀</span>
        </button>

        {/* Mini Progress Indicator */}
        <div className="p-2 border-b border-gray-700/50">
          <div className="w-full h-24 bg-gray-800 rounded-lg overflow-hidden relative">
            <div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-red-500 to-red-600 transition-all duration-500"
              style={{ height: `${Math.min(progress * 100, 100)}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white drop-shadow-md writing-mode-vertical">
                {Math.round(progress * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Resources (vertical) */}
        <div className="flex-1 flex flex-col items-center justify-center gap-3 py-4">
          <div className="text-center">
            <span className="text-yellow-400 text-lg">💰</span>
            <p className="text-xs font-bold text-yellow-300">{resources.money}</p>
          </div>
          <div className="text-center">
            <span className="text-red-400 text-lg">👁️</span>
            <p className="text-xs font-bold text-red-300">{Math.round(resources.attention)}</p>
          </div>
          <div className="text-center">
            <span className="text-purple-400 text-lg">🔧</span>
            <p className="text-xs font-bold text-purple-300">{resources.infrastructure}</p>
          </div>
        </div>

        {/* End Round Button (compact) */}
        <button
          onClick={onAdvanceRound}
          className="h-14 bg-green-600 hover:bg-green-500 text-white font-bold text-lg transition-colors"
          title="End Round"
        >
          →
        </button>
      </div>
    );
  }

  // ============================================
  // FULL PANEL
  // ============================================

  return (
    <div className="fixed top-0 right-0 bottom-0 w-80 bg-gray-900/95 backdrop-blur-md border-l border-gray-700/50 z-30 flex flex-col overflow-hidden animate-fade-in">

      {/* ========== HEADER: Round & Victory ========== */}
      <div className="flex-shrink-0 p-4 border-b border-gray-700/50 bg-gray-900/50">
        {/* Round & Minimize */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Round</span>
            <span className="text-xl font-bold text-white">{round}<span className="text-gray-500 text-sm">/{maxRounds}</span></span>
          </div>
          <button
            onClick={() => setIsMinimized(true)}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-700/50 transition-colors text-gray-400 hover:text-white"
            aria-label="Minimize panel"
          >
            <span className="text-sm">▶</span>
          </button>
        </div>

        {/* Victory Progress Bar */}
        <div className="mb-2">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-gray-400">Victory Progress</span>
            <div className={cn("flex items-center gap-1", paceConfig.color)}>
              <span>{paceConfig.icon}</span>
              <span className="font-medium">{paceConfig.label}</span>
            </div>
          </div>

          <div className="h-5 bg-gray-800 rounded-full overflow-hidden relative">
            <div
              className={cn(
                "h-full transition-all duration-700 ease-out",
                progress >= 1
                  ? "bg-gradient-to-r from-green-500 to-green-400"
                  : "bg-gradient-to-r from-red-600 to-red-500"
              )}
              style={{ width: `${Math.min(progress * 100, 100)}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white drop-shadow-md">
                {currentActors}/{targetActors} ({Math.round(progress * 100)}%)
              </span>
            </div>
          </div>

          <p className="text-[10px] text-gray-500 mt-1">
            Target: {formatPercent(victoryThreshold)} below {formatPercent(trustThreshold)} trust
          </p>
        </div>

        {/* Network Stats Row */}
        <div className="flex justify-between text-xs pt-2 border-t border-gray-700/30">
          <div>
            <span className="text-gray-500">Avg Trust: </span>
            <span className="font-semibold" style={{ color: trustToHex(networkMetrics.averageTrust) }}>
              {formatPercent(networkMetrics.averageTrust)}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Low Trust: </span>
            <span className="font-semibold text-red-400">{networkMetrics.lowTrustCount}</span>
          </div>
        </div>
      </div>

      {/* ========== RESOURCES BAR ========== */}
      <div className="flex-shrink-0 px-4 py-2.5 border-b border-gray-700/50 bg-gray-800/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-yellow-400">💰</span>
              <span className="font-bold text-yellow-300 text-sm">{resources.money}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-red-400">👁️</span>
              <span className="font-bold text-red-300 text-sm">{Math.round(resources.attention)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-purple-400">🔧</span>
              <span className="font-bold text-purple-300 text-sm">{resources.infrastructure}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========== END ROUND BUTTON ========== */}
      <div className="flex-shrink-0 p-3 border-b border-gray-700/50">
        <button
          onClick={onAdvanceRound}
          className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-green-600/30 active:scale-[0.98]"
        >
          End Round →
        </button>
      </div>

      {/* ========== TARGETING MODE BANNER ========== */}
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
            onClick={onCancelAbility}
            className="w-full px-3 py-1.5 bg-red-800 hover:bg-red-900 rounded text-sm font-medium transition-colors text-white"
          >
            Cancel
          </button>
        </div>
      )}

      {/* ========== ACTOR DETAILS (scrollable) ========== */}
      <div className="flex-1 overflow-y-auto">
        {selectedActor ? (
          <ActorDetailsSection
            actor={selectedActor}
            abilities={abilities}
            resources={resources}
            selectedAbilityId={selectedAbilityId}
            canUseAbility={canUseAbility}
            onSelectAbility={onSelectAbility}
            onClosePanel={onClosePanel}
            addNotification={addNotification}
            getValidTargets={getValidTargets}
            previewAbility={previewAbility}
            setPreviewAbility={setPreviewAbility}
            setPreviewTargets={setPreviewTargets}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="text-5xl mb-4 opacity-50">👆</div>
            <h3 className="text-base font-semibold text-white mb-2">No Actor Selected</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Click on any actor in the network to view their details and abilities
            </p>
          </div>
        )}
      </div>

      {/* ========== ABILITY PREVIEW MODAL ========== */}
      {previewAbility && selectedActor && (
        <AbilityPreview
          ability={previewAbility}
          sourceActor={selectedActor}
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

// ============================================
// ACTOR DETAILS SUB-COMPONENT
// ============================================

type ActorDetailsSectionProps = {
  actor: Actor;
  abilities: Ability[];
  resources: Resources;
  selectedAbilityId: string | null;
  canUseAbility: (abilityId: string) => boolean;
  onSelectAbility: (abilityId: string) => void;
  onClosePanel: () => void;
  addNotification: (type: 'info' | 'warning' | 'success' | 'error', message: string) => void;
  getValidTargets: (abilityId: string) => Actor[];
  previewAbility: Ability | null;
  setPreviewAbility: (ability: Ability | null) => void;
  setPreviewTargets: (targets: Actor[]) => void;
};

function ActorDetailsSection({
  actor,
  abilities,
  resources,
  selectedAbilityId,
  canUseAbility,
  onSelectAbility,
  onClosePanel,
  addNotification,
  getValidTargets,
  setPreviewAbility,
  setPreviewTargets,
}: ActorDetailsSectionProps) {
  return (
    <div className="px-4 py-4 space-y-4">
      {/* Actor Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: getCategoryColor(actor.category) + '20' }}
          >
            <div
              className="w-8 h-8 rounded-full border-2 border-white"
              style={{ backgroundColor: trustToHex(actor.trust) }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-white truncate">{actor.name}</h2>
            <p className="text-gray-400 capitalize text-xs">
              {actor.category} · Tier {actor.tier}
            </p>
          </div>
        </div>
        <button
          onClick={onClosePanel}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-red-600/20 transition-colors text-gray-400 hover:text-red-400 flex-shrink-0"
          aria-label="Close panel"
        >
          <span className="text-sm">✕</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 bg-gray-800/30 rounded-lg p-2.5 border border-gray-700/30">
        <div className="text-center">
          <p className="text-gray-400 text-[10px] mb-0.5">Trust</p>
          <p className="text-sm font-bold" style={{ color: trustToHex(actor.trust) }}>
            {formatPercent(actor.trust)}
          </p>
        </div>
        <div className="text-center border-x border-gray-700/30">
          <p className="text-gray-400 text-[10px] mb-0.5">Resilience</p>
          <p className="text-sm font-bold text-blue-400">{formatPercent(actor.resilience)}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-[10px] mb-0.5">Emotional</p>
          <p className="text-sm font-bold text-orange-400">{formatPercent(actor.emotionalState)}</p>
        </div>
      </div>

      {/* Vulnerabilities & Resistances */}
      {(actor.vulnerabilities.length > 0 || actor.resistances.length > 0) && (
        <div className="space-y-2">
          {actor.vulnerabilities.length > 0 && (
            <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-2.5">
              <p className="text-red-400 text-[10px] font-semibold mb-1.5">Vulnerable to:</p>
              <div className="flex flex-wrap gap-1">
                {actor.vulnerabilities.map(v => (
                  <span key={v} className="text-[10px] bg-red-800/40 text-red-200 px-1.5 py-0.5 rounded">
                    {v.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
          {actor.resistances.length > 0 && (
            <div className="bg-green-900/20 border border-green-800/30 rounded-lg p-2.5">
              <p className="text-green-400 text-[10px] font-semibold mb-1.5">Resistant to:</p>
              <div className="flex flex-wrap gap-1">
                {actor.resistances.map(r => (
                  <span key={r} className="text-[10px] bg-green-800/40 text-green-200 px-1.5 py-0.5 rounded">
                    {r.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Abilities Section */}
      <div>
        <h3 className="text-xs font-semibold text-white mb-2.5 flex items-center justify-between">
          <span>Abilities</span>
          <span className="text-gray-500">({abilities.length})</span>
        </h3>

        {abilities.length === 0 ? (
          <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700/50">
            <p className="text-gray-400 text-xs mb-1">No abilities available</p>
            <p className="text-[10px] text-gray-500">
              This actor cannot be used to spread disinformation.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {abilities.map(ability => (
              <AbilityCard
                key={ability.id}
                ability={ability}
                actor={actor}
                resources={resources}
                isSelected={selectedAbilityId === ability.id}
                canUse={canUseAbility(ability.id)}
                onSelect={() => onSelectAbility(ability.id)}
                onPreview={() => {
                  const targets = getValidTargets(ability.id);
                  setPreviewAbility(ability);
                  setPreviewTargets(targets);
                }}
                addNotification={addNotification}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// ABILITY CARD SUB-COMPONENT
// ============================================

type AbilityCardProps = {
  ability: Ability;
  actor: Actor;
  resources: Resources;
  isSelected: boolean;
  canUse: boolean;
  onSelect: () => void;
  onPreview: () => void;
  addNotification: (type: 'info' | 'warning' | 'success' | 'error', message: string) => void;
};

function AbilityCard({
  ability,
  actor,
  resources,
  isSelected,
  canUse,
  onSelect,
  onPreview,
  addNotification,
}: AbilityCardProps) {
  const cooldown = actor.cooldowns[ability.id] || 0;
  const cost = ability.resourceCost;

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
    const sign = ability.effects.resilienceDelta < 0 ? '' : '+';
    effects.push(`${sign}${Math.round(ability.effects.resilienceDelta * 100)}% resilience`);
  }
  if (ability.effects.propagates) {
    effects.push('propagates');
  }

  const hasEnoughResources =
    resources.money >= (cost.money || 0) &&
    resources.infrastructure >= (cost.infrastructure || 0);

  let disabledReason = '';
  if (!canUse) {
    if (!hasEnoughResources) {
      const missing: string[] = [];
      if (resources.money < (cost.money || 0)) missing.push(`💰${cost.money}`);
      if (resources.infrastructure < (cost.infrastructure || 0)) missing.push(`🔧${cost.infrastructure}`);
      disabledReason = `Need ${missing.join(', ')}`;
    } else if (cooldown > 0) {
      disabledReason = `On cooldown: ${cooldown} rounds`;
    } else {
      disabledReason = 'Cannot use this ability';
    }
  }

  return (
    <button
      onClick={() => {
        if (canUse) {
          onSelect();
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
            <span key={i} className="text-[9px] bg-gray-700/50 px-1 py-0.5 rounded text-gray-300">
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
          {!hasEnoughResources && cooldown === 0 && (
            <div className="text-[10px] text-red-400 font-semibold truncate">
              ❌ {disabledReason}
            </div>
          )}
        </div>

        {/* Preview Button */}
        {canUse && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview();
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
}

export default UnifiedRightPanel;
