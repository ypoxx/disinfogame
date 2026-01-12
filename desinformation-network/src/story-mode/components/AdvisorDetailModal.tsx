/**
 * Advisor Detail Modal - Full recommendation view for a single NPC
 *
 * Shows all recommendations from the selected NPC with full details,
 * reasoning, and suggested actions.
 */

import React from 'react';
import { StoryModeColors } from '../theme';
import type { AdvisorRecommendation } from '../engine/AdvisorRecommendation';
import { getPriorityEmoji, getPriorityColor } from '../engine/AdvisorRecommendation';
import type { NPC } from './AdvisorPanel';

// ============================================
// TYPES
// ============================================

interface AdvisorDetailModalProps {
  npc: NPC | null;
  recommendations: AdvisorRecommendation[];
  onClose: () => void;
  onSelectAction: (actionId: string) => void;
}

// ============================================
// COMPONENT
// ============================================

export function AdvisorDetailModal({
  npc,
  recommendations,
  onClose,
  onSelectAction,
}: AdvisorDetailModalProps) {
  if (!npc) return null;

  // Filter recommendations for this NPC
  const npcRecommendations = recommendations.filter(r => r.npcId === npc.id);

  // Sort by priority
  const sortedRecommendations = [...npcRecommendations].sort((a, b) => {
    const weights = { critical: 4, high: 3, medium: 2, low: 1 };
    return weights[b.priority] - weights[a.priority];
  });

  // Get category label
  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      opportunity: 'CHANCE',
      threat: 'BEDROHUNG',
      efficiency: 'EFFIZIENZ',
      strategy: 'STRATEGIE',
    };
    return labels[category] || category.toUpperCase();
  };

  // Get category color
  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      opportunity: StoryModeColors.success,
      threat: StoryModeColors.danger,
      efficiency: StoryModeColors.warning,
      strategy: '#6366F1', // Indigo
    };
    return colors[category] || StoryModeColors.textSecondary;
  };

  // Get relationship level text
  const getRelationshipText = (level: number): string => {
    if (level === 0) return 'DISTANZIERT';
    if (level === 1) return 'PROFESSIONELL';
    if (level === 2) return 'VERTRAUT';
    return 'LOYAL';
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] flex flex-col border-4"
        style={{
          backgroundColor: StoryModeColors.surface,
          borderColor: StoryModeColors.sovietRed,
          boxShadow: '0 0 40px rgba(0, 0, 0, 0.9)',
        }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="border-b-4 p-4 flex items-center justify-between"
          style={{
            backgroundColor: StoryModeColors.militaryOlive,
            borderColor: StoryModeColors.darkOlive,
          }}
        >
          <div className="flex-1">
            <h2
              className="font-bold text-xl tracking-wider"
              style={{ color: StoryModeColors.warning }}
            >
              {npc.name}
            </h2>
            <p
              className="text-sm mt-1"
              style={{ color: StoryModeColors.textSecondary }}
            >
              {npc.title_de}
            </p>
            <div className="flex gap-4 mt-2 text-xs">
              <span style={{ color: StoryModeColors.textSecondary }}>
                Moral: <span style={{ color: StoryModeColors.textPrimary }}>{npc.morale}%</span>
              </span>
              <span style={{ color: StoryModeColors.textSecondary }}>
                Beziehung: <span style={{ color: StoryModeColors.textPrimary }}>
                  {getRelationshipText(npc.relationshipLevel)}
                </span>
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:brightness-110 transition-all text-2xl font-bold"
            style={{ color: StoryModeColors.danger }}
            title="Schließen (ESC)"
          >
            ✕
          </button>
        </div>

        {/* Recommendations List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {sortedRecommendations.length === 0 ? (
            <div
              className="text-center py-12"
              style={{ color: StoryModeColors.textSecondary }}
            >
              <div className="text-4xl mb-4">📝</div>
              <p className="text-lg">Keine Empfehlungen verfügbar</p>
              <p className="text-sm mt-2">
                {npc.name} hat aktuell keine Hinweise für Sie.
              </p>
            </div>
          ) : (
            sortedRecommendations.map((rec, index) => (
              <div
                key={rec.id}
                className="border-2 p-4"
                style={{
                  backgroundColor: StoryModeColors.background,
                  borderColor: getPriorityColor(rec.priority),
                  boxShadow: rec.priority === 'critical'
                    ? `0 0 8px ${getPriorityColor(rec.priority)}`
                    : '2px 2px 0px rgba(0,0,0,0.5)',
                }}
              >
                {/* Recommendation Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {/* Priority Indicator */}
                    <span
                      className="text-2xl"
                      style={{
                        color: getPriorityColor(rec.priority),
                        animation: rec.priority === 'critical' ? 'pulse 2s infinite' : undefined,
                      }}
                    >
                      {getPriorityEmoji(rec.priority)}
                    </span>

                    {/* Category Badge */}
                    <span
                      className="px-2 py-1 text-xs font-bold border"
                      style={{
                        backgroundColor: StoryModeColors.surface,
                        borderColor: getCategoryColor(rec.category),
                        color: getCategoryColor(rec.category),
                      }}
                    >
                      {getCategoryLabel(rec.category)}
                    </span>
                  </div>

                  {/* Priority Label */}
                  <span
                    className="text-xs font-bold px-2 py-1 border"
                    style={{
                      backgroundColor: StoryModeColors.surface,
                      borderColor: getPriorityColor(rec.priority),
                      color: getPriorityColor(rec.priority),
                    }}
                  >
                    {rec.priority.toUpperCase()}
                  </span>
                </div>

                {/* Message */}
                <div
                  className="text-sm mb-3 leading-relaxed"
                  style={{ color: StoryModeColors.textPrimary }}
                >
                  {rec.message}
                </div>

                {/* Reasoning */}
                {rec.reasoning && (
                  <div
                    className="text-xs mb-3 p-2 border-l-2"
                    style={{
                      color: StoryModeColors.textSecondary,
                      borderColor: StoryModeColors.borderLight,
                      backgroundColor: StoryModeColors.concrete,
                    }}
                  >
                    <span className="font-bold">Analyse: </span>
                    {rec.reasoning}
                  </div>
                )}

                {/* Suggested Actions */}
                {rec.suggestedActions && rec.suggestedActions.length > 0 && (
                  <div>
                    <div
                      className="text-xs font-bold mb-2"
                      style={{ color: StoryModeColors.textSecondary }}
                    >
                      EMPFOHLENE AKTIONEN:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {rec.suggestedActions.map(actionId => (
                        <button
                          key={actionId}
                          onClick={() => {
                            onSelectAction(actionId);
                            onClose();
                          }}
                          className="px-3 py-1.5 border-2 text-xs font-bold transition-all hover:brightness-110 active:translate-y-0.5"
                          style={{
                            backgroundColor: StoryModeColors.militaryOlive,
                            borderColor: StoryModeColors.darkOlive,
                            color: StoryModeColors.warning,
                            boxShadow: '2px 2px 0px rgba(0,0,0,0.5)',
                          }}
                          title="Zum Terminal"
                        >
                          ⭐ {actionId.split('_').slice(1).join(' ').toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="flex gap-4 mt-3 pt-3 border-t text-xs"
                  style={{
                    borderColor: StoryModeColors.borderLight,
                    color: StoryModeColors.textSecondary,
                  }}
                >
                  <span>Phase: {rec.phase}</span>
                  {rec.expiresPhase && (
                    <span className="font-bold" style={{ color: StoryModeColors.warning }}>
                      ⏰ Läuft ab: Phase {rec.expiresPhase}
                    </span>
                  )}
                  {rec.confidence !== undefined && (
                    <span>Sicherheit: {(rec.confidence * 100).toFixed(0)}%</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          className="border-t-2 p-4 flex justify-between items-center"
          style={{
            backgroundColor: StoryModeColors.concrete,
            borderColor: StoryModeColors.borderLight,
          }}
        >
          <div
            className="text-xs"
            style={{ color: StoryModeColors.textSecondary }}
          >
            {sortedRecommendations.length > 0
              ? `${sortedRecommendations.length} Empfehlung${sortedRecommendations.length > 1 ? 'en' : ''}`
              : 'Keine Empfehlungen'}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 border-2 font-bold transition-all hover:brightness-110 active:translate-y-0.5"
            style={{
              backgroundColor: StoryModeColors.sovietRed,
              borderColor: StoryModeColors.darkRed,
              color: '#fff',
              boxShadow: '2px 2px 0px rgba(0,0,0,0.5)',
            }}
          >
            SCHLIESSEN
          </button>
        </div>
      </div>
    </div>
  );
}
