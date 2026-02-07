import { useState, useMemo, useEffect, useRef } from 'react';
import { StoryModeColors } from '../theme';
import type { AdvisorRecommendation } from '../engine/AdvisorRecommendation';

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
  onAddToQueue?: (actionId: string) => void;
  onClose: () => void;
  isVisible: boolean;
  recommendations?: AdvisorRecommendation[];
  highlightActionId?: string | null;
  variant?: 'modal' | 'sidebar';
}

// ============================================
// FILTER TABS
// ============================================

type FilterTab = 'all' | 'legal' | 'grey' | 'illegal' | 'unlocked';

const FILTER_TABS: { id: FilterTab; label: string; color: string }[] = [
  { id: 'all', label: 'ALLE', color: StoryModeColors.textPrimary },
  { id: 'legal', label: 'LEGAL', color: StoryModeColors.success },
  { id: 'grey', label: 'GRAUZONE', color: StoryModeColors.warning },
  { id: 'illegal', label: 'ILLEGAL', color: StoryModeColors.danger },
  { id: 'unlocked', label: 'NEU', color: StoryModeColors.agencyBlue },
];

// ============================================
// ACTION CARD COMPONENT
// ============================================

interface ActionCardProps {
  action: StoryAction;
  canAfford: boolean;
  onSelect: () => void;
  onAddToQueue?: () => void;
  isRecommended?: boolean;
  isHighlighted?: boolean;
  actionRef?: React.RefObject<HTMLDivElement>;
}

function ActionCard({ action, canAfford, onSelect, onAddToQueue, isRecommended, isHighlighted, actionRef }: ActionCardProps) {
  const legalityColors = {
    legal: StoryModeColors.success,
    grey: StoryModeColors.warning,
    illegal: StoryModeColors.danger,
  };

  const legalityLabels = {
    legal: '✓ LEGAL',
    grey: '⚠ GRAUZONE',
    illegal: '✕ ILLEGAL',
  };

  const isDisabled = !canAfford || action.isUsed || !action.isUnlocked;

  // Determine border styling
  const getBorderColor = () => {
    if (action.isUsed) return StoryModeColors.border;
    if (isRecommended) return '#FFD700'; // Gold for recommended
    return legalityColors[action.legality];
  };

  const getBorderWidth = () => {
    if (isRecommended) return '3px';
    return '2px';
  };

  return (
    <div
      ref={actionRef as React.RefObject<HTMLDivElement>}
      className={`
        w-full text-left p-4 transition-all
        ${isDisabled ? 'opacity-50' : ''}
        ${isHighlighted ? 'animate-pulse' : ''}
      `}
      style={{
        backgroundColor: action.isUsed
          ? StoryModeColors.border
          : isRecommended
          ? 'rgba(255, 215, 0, 0.05)' // Slight gold tint for recommended
          : StoryModeColors.surfaceLight,
        border: `${getBorderWidth()} solid ${getBorderColor()}`,
        boxShadow: isDisabled
          ? 'none'
          : isRecommended
          ? '0 0 8px rgba(255, 215, 0, 0.3), 3px 3px 0px rgba(0,0,0,0.6)'
          : '3px 3px 0px rgba(0,0,0,0.6)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div
              className="font-bold text-sm"
              style={{ color: StoryModeColors.textPrimary }}
            >
              {action.label_de}
            </div>
            {isRecommended && (
              <span
                className="text-base"
                style={{ color: '#FFD700' }}
                title="Von NPCs empfohlen"
              >
                ⭐
              </span>
            )}
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
          className="mt-2 pt-2 border-t text-xs"
          style={{ borderColor: StoryModeColors.borderLight }}
        >
          <div
            className="font-bold mb-1"
            style={{ color: StoryModeColors.textSecondary }}
          >
            👥 NPC-Vorteile:
          </div>
          <div className="space-y-1">
            {action.npc_affinity.map(npcId => (
              <div
                key={npcId}
                className="flex items-center justify-between gap-2 px-2 py-1"
                style={{
                  backgroundColor: StoryModeColors.background,
                  border: `1px solid ${StoryModeColors.borderLight}`,
                }}
              >
                <span
                  className="capitalize font-bold"
                  style={{ color: StoryModeColors.agencyBlue }}
                >
                  {npcId}
                </span>
                <div className="flex gap-2 text-xs">
                  <span style={{ color: StoryModeColors.success }}>
                    +10 Beziehung
                  </span>
                  {/* Note: Actual discount calculation would need NPC state here */}
                  <span style={{ color: StoryModeColors.warning }}>
                    Kosten-Rabatt
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div
            className="text-xs mt-1 italic"
            style={{ color: StoryModeColors.textMuted }}
          >
            Höhere Beziehung = größerer Rabatt (max. 30%)
          </div>
        </div>
      )}

      {/* Impact Preview (Phase 3.3) */}
      {!isDisabled && (
        <div
          className="mt-2 p-2 border text-xs space-y-1"
          style={{
            backgroundColor: StoryModeColors.background,
            borderColor: StoryModeColors.borderLight,
          }}
        >
          <div className="font-bold mb-1" style={{ color: StoryModeColors.textSecondary }}>
            AUSWIRKUNG:
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5">
            {(action.costs.risk ?? 0) > 0 && (
              <span style={{ color: (action.costs.risk ?? 0) > 10 ? StoryModeColors.danger : StoryModeColors.warning }}>
                Risiko +{action.costs.risk}%
              </span>
            )}
            {(action.costs.moral_weight ?? 0) > 0 && (
              <span style={{ color: StoryModeColors.sovietRed }}>
                Moral +{action.costs.moral_weight}
              </span>
            )}
            {(action.costs.attention ?? 0) > 0 && (
              <span style={{ color: StoryModeColors.danger }}>
                Aufmerksamkeit +{action.costs.attention}%
              </span>
            )}
            {action.legality === 'illegal' && (
              <span style={{ color: StoryModeColors.danger }}>
                Konsequenz wahrscheinlich
              </span>
            )}
            {action.npc_affinity.length > 0 && (
              <span style={{ color: StoryModeColors.success }}>
                {action.npc_affinity.length} NPC-Bonus
              </span>
            )}
          </div>
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
          ✓ BEREITS VERWENDET
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
          🔒 GESPERRT
        </div>
      )}

      {/* Action Buttons */}
      {!isDisabled && (
        <div className="flex gap-2 mt-3 pt-3 border-t" style={{ borderColor: StoryModeColors.borderLight }}>
          <button
            onClick={onSelect}
            className="flex-1 px-3 py-1.5 border-2 text-xs font-bold transition-all hover:brightness-110 active:translate-y-0.5"
            style={{
              backgroundColor: StoryModeColors.success,
              borderColor: '#15803d',
              color: '#fff',
              boxShadow: '2px 2px 0px rgba(0,0,0,0.5)',
            }}
            title="Sofort ausführen"
          >
            ▶ AUSFÜHREN
          </button>
          {onAddToQueue && (
            <button
              onClick={onAddToQueue}
              className="flex-1 px-3 py-1.5 border-2 text-xs font-bold transition-all hover:brightness-110 active:translate-y-0.5"
              style={{
                backgroundColor: StoryModeColors.militaryOlive,
                borderColor: StoryModeColors.darkOlive,
                color: StoryModeColors.warning,
                boxShadow: '2px 2px 0px rgba(0,0,0,0.5)',
              }}
              title="Zur Warteschlange hinzufügen"
            >
              + EINREIHEN
            </button>
          )}
        </div>
      )}
    </div>
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
  onAddToQueue,
  onClose,
  isVisible,
  recommendations = [],
  highlightActionId = null,
  variant = 'modal',
}: ActionPanelProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const highlightedActionRef = useRef<HTMLDivElement>(null);

  // Get all recommended action IDs
  const recommendedActionIds = useMemo(() => {
    const ids = new Set<string>();
    recommendations.forEach(rec => {
      rec.suggestedActions?.forEach(actionId => ids.add(actionId));
    });
    return ids;
  }, [recommendations]);

  // Check if action is recommended
  const isActionRecommended = (actionId: string) => {
    return recommendedActionIds.has(actionId);
  };

  // Scroll to highlighted action
  useEffect(() => {
    if (highlightActionId && highlightedActionRef.current) {
      highlightedActionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [highlightActionId]);

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

    // Sort: Recommended actions first
    result.sort((a, b) => {
      const aRecommended = isActionRecommended(a.id);
      const bRecommended = isActionRecommended(b.id);
      if (aRecommended && !bRecommended) return -1;
      if (!aRecommended && bRecommended) return 1;
      return 0; // Keep original order for same category
    });

    return result;
  }, [actions, currentPhase, activeTab, searchQuery, isActionRecommended]);

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

  // Shared content: Filter tabs, actions list, footer
  const filterBar = (
    <div
      className={`flex gap-1 ${variant === 'sidebar' ? 'px-2 py-1.5 flex-wrap' : 'px-4 py-2'} border-b-2`}
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
            px-2 py-1 text-xs font-bold border-2 transition-all
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
      <div className={variant === 'sidebar' ? 'w-full mt-1' : 'flex-1 ml-4'}>
        <input
          type="text"
          placeholder="Aktionen suchen..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full px-3 py-1 text-sm font-mono border-2"
          style={{
            backgroundColor: StoryModeColors.background,
            borderColor: StoryModeColors.borderLight,
            color: StoryModeColors.textPrimary,
          }}
        />
      </div>
    </div>
  );

  const actionsList = (
    <div
      className="flex-1 overflow-y-auto p-3"
      style={{ backgroundColor: StoryModeColors.background }}
    >
      {filteredActions.length === 0 ? (
        <div
          className="text-center py-8"
          style={{ color: StoryModeColors.textSecondary }}
        >
          Keine Aktionen fur aktuelle Filter verfugbar.
        </div>
      ) : (
        <div className={variant === 'sidebar' ? 'space-y-3' : 'grid grid-cols-2 gap-3'}>
          {filteredActions.map(action => {
            const isHighlighted = highlightActionId === action.id;
            return (
              <ActionCard
                key={action.id}
                action={action}
                canAfford={canAffordAction(action)}
                onSelect={() => onSelectAction(action.id)}
                onAddToQueue={onAddToQueue ? () => onAddToQueue(action.id) : undefined}
                isRecommended={isActionRecommended(action.id)}
                isHighlighted={isHighlighted}
                actionRef={isHighlighted ? highlightedActionRef : undefined}
              />
            );
          })}
        </div>
      )}
    </div>
  );

  const footer = (
    <div
      className="px-3 py-2 border-t-4 flex items-center justify-between"
      style={{
        backgroundColor: StoryModeColors.darkConcrete,
        borderColor: StoryModeColors.border,
      }}
    >
      <div className="flex gap-3 text-xs">
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
        className="text-[10px]"
        style={{ color: StoryModeColors.textMuted }}
      >
        Grau/Illegal erhoht Risiko
      </div>
    </div>
  );

  // Sidebar variant: render inline (no overlay)
  if (variant === 'sidebar') {
    return (
      <div className="flex flex-col h-full">
        <div
          className="px-3 py-2 border-b-2 flex items-center justify-between"
          style={{
            backgroundColor: StoryModeColors.sovietRed,
            borderColor: StoryModeColors.border,
          }}
        >
          <div>
            <h2 className="font-bold text-sm text-white">AKTIONEN PLANEN</h2>
            <p className="text-[10px] text-white/70">
              {currentPhase.toUpperCase()} | {filteredActions.length} verfugbar
            </p>
          </div>
        </div>
        {filterBar}
        {actionsList}
        {footer}
      </div>
    );
  }

  // Modal variant: original fullscreen overlay
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-8"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] flex flex-col border-4"
        style={{
          backgroundColor: StoryModeColors.surface,
          borderColor: StoryModeColors.border,
          boxShadow: '12px 12px 0px 0px rgba(0,0,0,0.9)',
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
            <h2 className="font-bold text-xl text-white">AKTIONEN PLANEN</h2>
            <p className="text-sm text-white/70">
              Phase: {currentPhase.toUpperCase()} | {filteredActions.length} verfugbar
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
            ✕ SCHLIESSEN
          </button>
        </div>

        {filterBar}
        {actionsList}
        {footer}
      </div>
    </div>
  );
}

export default ActionPanel;
