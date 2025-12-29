import { useState, useMemo } from 'react';
import { StoryModeColors } from '../theme';

// ============================================
// TYPES
// ============================================

export interface StoryAction {
  id: string;
  phase: string;
  label_de: string;
  label_en?: string;
  narrative_de?: string;
  costs: {
    budget?: number;
    capacity?: number;
    risk?: number;
    attention?: number;
    moral_weight?: number;
  };
  npc_affinity: string[];
  legality: 'legal' | 'grey' | 'illegal';
  tags: string[];
  prerequisites?: string[];
  unlocks?: string[];
  disarm_ref?: string;
  effects?: {
    trust_impact?: number;
    reach?: number;
    detection_risk?: number;
  };
  isUnlocked: boolean;
  isUsed: boolean;
}

interface ActionPanelProps {
  actions: StoryAction[];
  currentPhase: string;
  availableResources: {
    budget: number;
    capacity: number;
    actionPoints: number;
  };
  onSelectAction: (actionId: string) => void;
  onClose: () => void;
  isVisible: boolean;
}

// ============================================
// FILTER TABS
// ============================================

type FilterTab = 'all' | 'legal' | 'grey' | 'illegal' | 'unlocked';

const FILTER_TABS: { id: FilterTab; label: string; color: string }[] = [
  { id: 'all', label: 'ALL', color: StoryModeColors.textPrimary },
  { id: 'legal', label: 'LEGAL', color: StoryModeColors.success },
  { id: 'grey', label: 'GREY', color: StoryModeColors.warning },
  { id: 'illegal', label: 'ILLEGAL', color: StoryModeColors.danger },
  { id: 'unlocked', label: 'NEW', color: StoryModeColors.agencyBlue },
];

// ============================================
// ACTION CARD COMPONENT
// ============================================

interface ActionCardProps {
  action: StoryAction;
  canAfford: boolean;
  onSelect: () => void;
}

function ActionCard({ action, canAfford, onSelect }: ActionCardProps) {
  const legalityColors = {
    legal: StoryModeColors.success,
    grey: StoryModeColors.warning,
    illegal: StoryModeColors.danger,
  };

  const legalityLabels = {
    legal: '✓ LEGAL',
    grey: '⚠ GREY ZONE',
    illegal: '✕ ILLEGAL',
  };

  const isDisabled = !canAfford || action.isUsed || !action.isUnlocked;

  return (
    <button
      onClick={onSelect}
      disabled={isDisabled}
      className={`
        w-full text-left p-4 border-2 transition-all
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110 active:translate-y-0.5'}
      `}
      style={{
        backgroundColor: action.isUsed
          ? StoryModeColors.border
          : StoryModeColors.surfaceLight,
        borderColor: action.isUsed
          ? StoryModeColors.borderLight
          : legalityColors[action.legality],
        boxShadow: isDisabled ? 'none' : '3px 3px 0px 0px rgba(0,0,0,0.6)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1">
          <div
            className="font-bold text-sm"
            style={{ color: StoryModeColors.textPrimary }}
          >
            {action.label_de}
          </div>
          <div
            className="text-xs mt-0.5"
            style={{ color: legalityColors[action.legality] }}
          >
            {legalityLabels[action.legality]}
          </div>
        </div>
        <div
          className="text-xs px-2 py-0.5 border"
          style={{
            backgroundColor: StoryModeColors.background,
            borderColor: StoryModeColors.borderLight,
            color: StoryModeColors.textSecondary,
          }}
        >
          ID: {action.id}
        </div>
      </div>

      {/* Narrative */}
      {action.narrative_de && (
        <div
          className="text-xs mb-3 line-clamp-2"
          style={{ color: StoryModeColors.textSecondary }}
        >
          {action.narrative_de}
        </div>
      )}

      {/* Costs */}
      <div className="flex flex-wrap gap-2 mb-2">
        {action.costs.budget && action.costs.budget > 0 && (
          <span
            className="text-xs px-2 py-0.5 border"
            style={{
              backgroundColor: StoryModeColors.background,
              borderColor: StoryModeColors.warning,
              color: StoryModeColors.warning,
            }}
          >
            💰 ${action.costs.budget}K
          </span>
        )}
        {action.costs.capacity && action.costs.capacity > 0 && (
          <span
            className="text-xs px-2 py-0.5 border"
            style={{
              backgroundColor: StoryModeColors.background,
              borderColor: StoryModeColors.agencyBlue,
              color: StoryModeColors.agencyBlue,
            }}
          >
            ⚡ {action.costs.capacity}
          </span>
        )}
        {action.costs.risk && action.costs.risk > 0 && (
          <span
            className="text-xs px-2 py-0.5 border"
            style={{
              backgroundColor: StoryModeColors.background,
              borderColor: StoryModeColors.danger,
              color: StoryModeColors.danger,
            }}
          >
            ⚠️ +{action.costs.risk}%
          </span>
        )}
        {action.costs.moral_weight && action.costs.moral_weight > 0 && (
          <span
            className="text-xs px-2 py-0.5 border"
            style={{
              backgroundColor: StoryModeColors.background,
              borderColor: StoryModeColors.sovietRed,
              color: StoryModeColors.sovietRed,
            }}
          >
            💀 +{action.costs.moral_weight}
          </span>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {action.tags.slice(0, 3).map(tag => (
          <span
            key={tag}
            className="text-xs px-1.5 py-0.5"
            style={{
              backgroundColor: StoryModeColors.border,
              color: StoryModeColors.textMuted,
            }}
          >
            #{tag}
          </span>
        ))}
        {action.tags.length > 3 && (
          <span
            className="text-xs px-1.5 py-0.5"
            style={{ color: StoryModeColors.textMuted }}
          >
            +{action.tags.length - 3}
          </span>
        )}
      </div>

      {/* NPC Affinity */}
      {action.npc_affinity.length > 0 && (
        <div
          className="mt-2 pt-2 border-t text-xs flex items-center gap-1"
          style={{ borderColor: StoryModeColors.borderLight }}
        >
          <span style={{ color: StoryModeColors.textMuted }}>Suggested by:</span>
          {action.npc_affinity.map(npc => (
            <span
              key={npc}
              className="px-1.5 py-0.5 capitalize"
              style={{
                backgroundColor: StoryModeColors.agencyBlue,
                color: StoryModeColors.textPrimary,
              }}
            >
              {npc}
            </span>
          ))}
        </div>
      )}

      {/* Status Badges */}
      {action.isUsed && (
        <div
          className="mt-2 text-xs font-bold text-center py-1"
          style={{
            backgroundColor: StoryModeColors.border,
            color: StoryModeColors.textMuted,
          }}
        >
          ✓ ALREADY USED
        </div>
      )}
      {!action.isUnlocked && !action.isUsed && (
        <div
          className="mt-2 text-xs font-bold text-center py-1"
          style={{
            backgroundColor: StoryModeColors.border,
            color: StoryModeColors.textMuted,
          }}
        >
          🔒 LOCKED
        </div>
      )}
    </button>
  );
}

// ============================================
// MAIN ACTION PANEL COMPONENT
// ============================================

export function ActionPanel({
  actions,
  currentPhase,
  availableResources,
  onSelectAction,
  onClose,
  isVisible,
}: ActionPanelProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredActions = useMemo(() => {
    let result = actions;

    // Filter by phase
    result = result.filter(a => a.phase === currentPhase || a.phase === 'any');

    // Filter by tab
    if (activeTab !== 'all') {
      if (activeTab === 'unlocked') {
        result = result.filter(a => a.isUnlocked && !a.isUsed);
      } else {
        result = result.filter(a => a.legality === activeTab);
      }
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        a =>
          a.label_de.toLowerCase().includes(query) ||
          a.tags.some(t => t.toLowerCase().includes(query)) ||
          a.narrative_de?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [actions, currentPhase, activeTab, searchQuery]);

  const canAffordAction = (action: StoryAction) => {
    if (action.costs.budget && action.costs.budget > availableResources.budget) {
      return false;
    }
    if (action.costs.capacity && action.costs.capacity > availableResources.capacity) {
      return false;
    }
    if (availableResources.actionPoints <= 0) {
      return false;
    }
    return true;
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-8 animate-fade-in"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] flex flex-col border-4"
        style={{
          backgroundColor: StoryModeColors.surface,
          borderColor: StoryModeColors.border,
          boxShadow: '12px 12px 0px 0px rgba(0,0,0,0.9)',
          animation: 'story-modal-appear 0.3s ease-out',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b-4"
          style={{
            backgroundColor: StoryModeColors.sovietRed,
            borderColor: StoryModeColors.border,
          }}
        >
          <div>
            <h2 className="font-bold text-xl text-white">AVAILABLE ACTIONS</h2>
            <p className="text-sm text-white/70">
              Phase: {currentPhase.toUpperCase()} | {filteredActions.length} actions available
            </p>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 border-2 font-bold transition-all hover:brightness-110 active:translate-y-0.5"
            style={{
              backgroundColor: StoryModeColors.darkRed,
              borderColor: StoryModeColors.border,
              color: '#fff',
              boxShadow: '2px 2px 0px 0px rgba(0,0,0,0.8)',
            }}
          >
            ✕ CLOSE
          </button>
        </div>

        {/* Filter Tabs */}
        <div
          className="flex gap-1 px-4 py-2 border-b-2"
          style={{
            backgroundColor: StoryModeColors.darkConcrete,
            borderColor: StoryModeColors.borderLight,
          }}
        >
          {FILTER_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-3 py-1.5 text-xs font-bold border-2 transition-all
                ${activeTab === tab.id ? 'translate-y-0.5' : 'hover:brightness-110'}
              `}
              style={{
                backgroundColor:
                  activeTab === tab.id ? tab.color : StoryModeColors.surface,
                borderColor:
                  activeTab === tab.id ? StoryModeColors.border : StoryModeColors.borderLight,
                color:
                  activeTab === tab.id ? '#fff' : tab.color,
                boxShadow:
                  activeTab === tab.id ? 'none' : '2px 2px 0px 0px rgba(0,0,0,0.5)',
              }}
            >
              {tab.label}
            </button>
          ))}

          {/* Search */}
          <div className="flex-1 ml-4">
            <input
              type="text"
              placeholder="Search actions..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 text-sm font-mono border-2"
              style={{
                backgroundColor: StoryModeColors.background,
                borderColor: StoryModeColors.borderLight,
                color: StoryModeColors.textPrimary,
              }}
            />
          </div>
        </div>

        {/* Actions Grid */}
        <div
          className="flex-1 overflow-y-auto p-4"
          style={{ backgroundColor: StoryModeColors.background }}
        >
          {filteredActions.length === 0 ? (
            <div
              className="text-center py-12"
              style={{ color: StoryModeColors.textSecondary }}
            >
              No actions available for current filters.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredActions.map(action => (
                <ActionCard
                  key={action.id}
                  action={action}
                  canAfford={canAffordAction(action)}
                  onSelect={() => onSelectAction(action.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-4 py-3 border-t-4 flex items-center justify-between"
          style={{
            backgroundColor: StoryModeColors.darkConcrete,
            borderColor: StoryModeColors.border,
          }}
        >
          <div className="flex gap-4 text-sm">
            <span style={{ color: StoryModeColors.warning }}>
              💰 ${availableResources.budget}K
            </span>
            <span style={{ color: StoryModeColors.agencyBlue }}>
              ⚡ {availableResources.capacity}
            </span>
            <span style={{ color: StoryModeColors.textPrimary }}>
              🎯 {availableResources.actionPoints} AP
            </span>
          </div>
          <div
            className="text-xs"
            style={{ color: StoryModeColors.textMuted }}
          >
            Click an action to execute. Grey/Illegal actions increase risk.
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActionPanel;
