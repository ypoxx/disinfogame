/**
 * Advisor Panel - Right sidebar showing NPC recommendations
 *
 * Displays all NPCs with their current top recommendation and priority indicator.
 * Click on an NPC to open the detailed recommendation modal.
 */

import { useState } from 'react';
import { StoryModeColors } from '../theme';
import type { AdvisorRecommendation } from '../engine/AdvisorRecommendation';
import { getPriorityEmoji, getPriorityColor } from '../engine/AdvisorRecommendation';

// ============================================
// TYPES
// ============================================

export interface NPC {
  id: string;
  name: string;
  title_de: string;
  morale: number;
  relationshipLevel: number;
  available: boolean;
}

interface AdvisorPanelProps {
  npcs: NPC[];
  recommendations: AdvisorRecommendation[];
  onSelectNpc: (npcId: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

// ============================================
// COMPONENT
// ============================================

export function AdvisorPanel({
  npcs,
  recommendations,
  onSelectNpc,
  isCollapsed = false,
  onToggleCollapse,
}: AdvisorPanelProps) {
  const [hoveredNpc, setHoveredNpc] = useState<string | null>(null);

  // Group recommendations by NPC
  const recommendationsByNpc = recommendations.reduce((acc, rec) => {
    if (!acc[rec.npcId]) {
      acc[rec.npcId] = [];
    }
    acc[rec.npcId].push(rec);
    return acc;
  }, {} as Record<string, AdvisorRecommendation[]>);

  // Get top recommendation for each NPC (highest priority)
  const getTopRecommendation = (npcId: string): AdvisorRecommendation | null => {
    const npcRecs = recommendationsByNpc[npcId];
    if (!npcRecs || npcRecs.length === 0) return null;

    // Sort by priority weight (highest first)
    const sorted = [...npcRecs].sort((a, b) => {
      const weights = { critical: 4, high: 3, medium: 2, low: 1 };
      return weights[b.priority] - weights[a.priority];
    });

    return sorted[0];
  };

  // Get morale bar color
  const getMoraleColor = (morale: number): string => {
    if (morale >= 70) return StoryModeColors.success;
    if (morale >= 40) return StoryModeColors.warning;
    return StoryModeColors.danger;
  };

  // Collapsed view
  if (isCollapsed) {
    return (
      <div
        className="fixed right-0 top-16 bottom-0 w-12 border-l-4 flex flex-col items-center py-4 gap-2"
        style={{
          backgroundColor: StoryModeColors.surface,
          borderColor: StoryModeColors.sovietRed,
          zIndex: 40,
        }}
      >
        <button
          onClick={onToggleCollapse}
          className="p-2 hover:brightness-110 transition-all text-xl"
          style={{ color: StoryModeColors.warning }}
          title="Berater öffnen"
        >
          ◀
        </button>

        {/* Mini NPC indicators */}
        {npcs.filter(npc => npc.available).map(npc => {
          const topRec = getTopRecommendation(npc.id);
          return (
            <button
              key={npc.id}
              onClick={() => {
                onToggleCollapse?.();
                onSelectNpc(npc.id);
              }}
              className="w-8 h-8 border-2 flex items-center justify-center hover:brightness-110 transition-all text-xs"
              style={{
                backgroundColor: StoryModeColors.background,
                borderColor: topRec ? getPriorityColor(topRec.priority) : StoryModeColors.borderLight,
                color: StoryModeColors.textPrimary,
              }}
              title={npc.name}
            >
              {topRec ? getPriorityEmoji(topRec.priority) : '○'}
            </button>
          );
        })}
      </div>
    );
  }

  // Full view
  return (
    <div
      className="fixed right-0 top-16 bottom-0 w-80 border-l-4 flex flex-col"
      style={{
        backgroundColor: StoryModeColors.surface,
        borderColor: StoryModeColors.sovietRed,
        zIndex: 40,
      }}
    >
      {/* Header */}
      <div
        className="border-b-2 p-3 flex items-center justify-between"
        style={{
          backgroundColor: StoryModeColors.militaryOlive,
          borderColor: StoryModeColors.darkOlive,
        }}
      >
        <div>
          <h3
            className="font-bold text-sm tracking-wider"
            style={{ color: StoryModeColors.warning }}
          >
            BERATER
          </h3>
          <p
            className="text-xs mt-0.5"
            style={{ color: StoryModeColors.textSecondary }}
          >
            Empfehlungen vom Team
          </p>
        </div>
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-1 hover:brightness-110 transition-all"
            style={{ color: StoryModeColors.warning }}
            title="Einklappen"
          >
            ▶
          </button>
        )}
      </div>

      {/* NPC List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {npcs
          .filter(npc => npc.available)
          .map(npc => {
            const topRec = getTopRecommendation(npc.id);
            const npcRecs = recommendationsByNpc[npc.id] || [];
            const isHovered = hoveredNpc === npc.id;

            return (
              <button
                key={npc.id}
                onClick={() => onSelectNpc(npc.id)}
                onMouseEnter={() => setHoveredNpc(npc.id)}
                onMouseLeave={() => setHoveredNpc(null)}
                className="w-full text-left border-2 p-3 transition-all hover:brightness-110 active:translate-y-0.5"
                style={{
                  backgroundColor: isHovered ? StoryModeColors.background : StoryModeColors.concrete,
                  borderColor: topRec ? getPriorityColor(topRec.priority) : StoryModeColors.borderLight,
                  boxShadow: topRec?.priority === 'critical'
                    ? `0 0 8px ${getPriorityColor(topRec.priority)}`
                    : '2px 2px 0px rgba(0,0,0,0.5)',
                }}
              >
                {/* NPC Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div
                      className="font-bold text-sm truncate"
                      style={{ color: StoryModeColors.textPrimary }}
                    >
                      {npc.name}
                    </div>
                    <div
                      className="text-xs truncate"
                      style={{ color: StoryModeColors.textSecondary }}
                    >
                      {npc.title_de}
                    </div>
                  </div>

                  {/* Priority Indicator */}
                  {topRec && (
                    <div
                      className="text-xl ml-2"
                      style={{
                        color: getPriorityColor(topRec.priority),
                        animation: topRec.priority === 'critical' ? 'pulse 2s infinite' : undefined,
                      }}
                      title={topRec.priority.toUpperCase()}
                    >
                      {getPriorityEmoji(topRec.priority)}
                    </div>
                  )}
                </div>

                {/* Morale Bar */}
                <div className="mb-2">
                  <div
                    className="h-1.5 border"
                    style={{
                      backgroundColor: StoryModeColors.background,
                      borderColor: StoryModeColors.borderLight,
                    }}
                  >
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${npc.morale}%`,
                        backgroundColor: getMoraleColor(npc.morale),
                      }}
                    />
                  </div>
                  <div
                    className="text-xs mt-0.5"
                    style={{ color: StoryModeColors.textSecondary }}
                  >
                    Moral: {npc.morale}%
                  </div>
                </div>

                {/* Top Recommendation Preview */}
                {topRec ? (
                  <div>
                    <div
                      className="text-xs line-clamp-2"
                      style={{ color: StoryModeColors.textPrimary }}
                    >
                      {topRec.message}
                    </div>
                    {npcRecs.length > 1 && (
                      <div
                        className="text-xs mt-1 font-bold"
                        style={{ color: StoryModeColors.textSecondary }}
                      >
                        +{npcRecs.length - 1} weitere
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="text-xs italic"
                    style={{ color: StoryModeColors.textSecondary }}
                  >
                    Keine Empfehlungen
                  </div>
                )}
              </button>
            );
          })}
      </div>

      {/* Footer Info */}
      <div
        className="border-t-2 p-2 text-xs text-center"
        style={{
          backgroundColor: StoryModeColors.background,
          borderColor: StoryModeColors.borderLight,
          color: StoryModeColors.textSecondary,
        }}
      >
        Klicken für Details
      </div>

      {/* Pulse animation for critical */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
