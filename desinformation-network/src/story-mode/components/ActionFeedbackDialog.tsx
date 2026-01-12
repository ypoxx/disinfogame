import { useState } from 'react';
import { StoryModeColors } from '../theme';
import type { ActionResult } from '../../game-logic/StoryEngineAdapter';
import { COMBO_COLORS } from '../../utils/colors';

interface ActionFeedbackDialogProps {
  isVisible: boolean;
  result: ActionResult | ActionResult[] | null;
  onClose: () => void;
}

export function ActionFeedbackDialog({
  isVisible,
  result,
  onClose,
}: ActionFeedbackDialogProps) {
  if (!isVisible || !result) return null;

  // Handle both single and multiple results
  const results = Array.isArray(result) ? result : [result];
  const isBatchMode = Array.isArray(result) && result.length > 1;
  const [expandedIndex, setExpandedIndex] = useState<number>(0);

  // Calculate cumulative stats for batch mode
  const cumulativeChanges = isBatchMode ? results.reduce((acc, r) => {
    if (r.resourceChanges) {
      acc.budget += r.resourceChanges.budget || 0;
      acc.capacity += r.resourceChanges.capacity || 0;
      acc.risk += r.resourceChanges.risk || 0;
      acc.attention += r.resourceChanges.attention || 0;
      acc.moralWeight += r.resourceChanges.moralWeight || 0;
    }
    return acc;
  }, { budget: 0, capacity: 0, risk: 0, attention: 0, moralWeight: 0 }) : null;

  const allSuccess = results.every(r => r.success);
  const successCount = results.filter(r => r.success).length;

  const getOutcomeColor = (singleResult?: ActionResult) => {
    if (singleResult) {
      return singleResult.success ? StoryModeColors.success : StoryModeColors.danger;
    }
    if (!allSuccess) return StoryModeColors.warning;
    return StoryModeColors.success;
  };

  const getOutcomeIcon = (singleResult?: ActionResult) => {
    if (singleResult) {
      return singleResult.success ? '✓' : '❌';
    }
    if (allSuccess) return '✓';
    return '⚠';
  };

  // Batch Mode - Multi-Step Results View
  if (isBatchMode) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center z-50"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
        onClick={onClose}
      >
        <div
          className="w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col border-4 animate-fade-in"
          style={{
            backgroundColor: StoryModeColors.surface,
            borderColor: getOutcomeColor(),
            boxShadow: '10px 10px 0px 0px rgba(0,0,0,0.9)',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Batch Header */}
          <div
            className="px-6 py-4 border-b-4"
            style={{
              backgroundColor: getOutcomeColor(),
              borderColor: StoryModeColors.border,
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{getOutcomeIcon()}</span>
              <h2 className="font-bold text-xl" style={{ color: '#fff' }}>
                {allSuccess ? 'AKTIONEN ERFOLGREICH' : 'BATCH TEILWEISE ERFOLGREICH'}
              </h2>
            </div>
            <div className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              {successCount} von {results.length} Aktionen erfolgreich
            </div>
          </div>

          {/* Cumulative Summary */}
          {cumulativeChanges && (
            <div
              className="px-6 py-4 border-b-2"
              style={{
                backgroundColor: StoryModeColors.darkConcrete,
                borderColor: StoryModeColors.border,
              }}
            >
              <h3
                className="font-bold mb-3 text-sm"
                style={{ color: StoryModeColors.textSecondary }}
              >
                📊 GESAMT-BILANZ
              </h3>
              <div className="grid grid-cols-3 gap-3 text-sm">
                {cumulativeChanges.budget !== 0 && (
                  <div className="flex justify-between">
                    <span style={{ color: StoryModeColors.textMuted }}>Budget:</span>
                    <span
                      className="font-bold"
                      style={{
                        color: cumulativeChanges.budget > 0
                          ? StoryModeColors.success
                          : StoryModeColors.danger,
                      }}
                    >
                      {cumulativeChanges.budget > 0 ? '+' : ''}
                      ${cumulativeChanges.budget}K
                    </span>
                  </div>
                )}
                {cumulativeChanges.capacity !== 0 && (
                  <div className="flex justify-between">
                    <span style={{ color: StoryModeColors.textMuted }}>Kapazität:</span>
                    <span
                      className="font-bold"
                      style={{
                        color: cumulativeChanges.capacity > 0
                          ? StoryModeColors.success
                          : StoryModeColors.danger,
                      }}
                    >
                      {cumulativeChanges.capacity > 0 ? '+' : ''}
                      {cumulativeChanges.capacity}
                    </span>
                  </div>
                )}
                {cumulativeChanges.risk !== 0 && (
                  <div className="flex justify-between">
                    <span style={{ color: StoryModeColors.textMuted }}>Risiko:</span>
                    <span
                      className="font-bold"
                      style={{
                        color: cumulativeChanges.risk > 0
                          ? StoryModeColors.danger
                          : StoryModeColors.success,
                      }}
                    >
                      {cumulativeChanges.risk > 0 ? '+' : ''}
                      {cumulativeChanges.risk}%
                    </span>
                  </div>
                )}
                {cumulativeChanges.attention !== 0 && (
                  <div className="flex justify-between">
                    <span style={{ color: StoryModeColors.textMuted }}>Aufmerksamkeit:</span>
                    <span
                      className="font-bold"
                      style={{
                        color: cumulativeChanges.attention > 0
                          ? StoryModeColors.warning
                          : StoryModeColors.success,
                      }}
                    >
                      {cumulativeChanges.attention > 0 ? '+' : ''}
                      {cumulativeChanges.attention}%
                    </span>
                  </div>
                )}
                {cumulativeChanges.moralWeight !== 0 && (
                  <div className="flex justify-between">
                    <span style={{ color: StoryModeColors.textMuted }}>Moral. Last:</span>
                    <span
                      className="font-bold"
                      style={{ color: StoryModeColors.sovietRed }}
                    >
                      +{cumulativeChanges.moralWeight}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Steps */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {results.map((actionResult, index) => (
              <div
                key={index}
                className="border-2"
                style={{
                  backgroundColor: StoryModeColors.background,
                  borderColor: getOutcomeColor(actionResult),
                  boxShadow: '2px 2px 0px rgba(0,0,0,0.5)',
                }}
              >
                {/* Action Step Header */}
                <button
                  onClick={() => setExpandedIndex(expandedIndex === index ? -1 : index)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:brightness-110 transition-all"
                  style={{
                    backgroundColor: StoryModeColors.surfaceLight,
                    borderBottom: expandedIndex === index ? `2px solid ${StoryModeColors.border}` : 'none',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xl"
                      style={{ color: getOutcomeColor(actionResult) }}
                    >
                      {getOutcomeIcon(actionResult)}
                    </span>
                    <span
                      className="font-bold text-xs px-2 py-1 border"
                      style={{
                        backgroundColor: StoryModeColors.background,
                        borderColor: StoryModeColors.borderLight,
                        color: StoryModeColors.textSecondary,
                      }}
                    >
                      #{index + 1}
                    </span>
                    <span
                      className="font-bold"
                      style={{ color: StoryModeColors.textPrimary }}
                    >
                      {actionResult.action?.label_de || 'Aktion'}
                    </span>
                  </div>
                  <span style={{ color: StoryModeColors.textSecondary }}>
                    {expandedIndex === index ? '▲' : '▼'}
                  </span>
                </button>

                {/* Expanded Details */}
                {expandedIndex === index && (
                  <div className="p-4 space-y-3">
                    {/* Render single result details - reusing existing logic */}
                    {actionResult.narrative && (
                      <div
                        className="p-4 border-l-4"
                        style={{
                          backgroundColor: StoryModeColors.background,
                          borderColor: StoryModeColors.document,
                        }}
                      >
                        <div
                          className="font-bold mb-2"
                          style={{ color: StoryModeColors.textPrimary }}
                        >
                          {actionResult.narrative.headline_de}
                        </div>
                        <p
                          className="text-sm italic"
                          style={{ color: StoryModeColors.textSecondary }}
                        >
                          {actionResult.narrative.description_de}
                        </p>
                      </div>
                    )}

                    {/* Resource Changes */}
                    {actionResult.resourceChanges && (
                      <div
                        className="border-2 p-3"
                        style={{
                          backgroundColor: StoryModeColors.concrete,
                          borderColor: StoryModeColors.borderLight,
                        }}
                      >
                        <h4
                          className="font-bold mb-2 text-xs"
                          style={{ color: StoryModeColors.textSecondary }}
                        >
                          RESSOURCEN-ÄNDERUNGEN
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {actionResult.resourceChanges.budget !== undefined && actionResult.resourceChanges.budget !== 0 && (
                            <div className="flex justify-between">
                              <span style={{ color: StoryModeColors.textMuted }}>Budget:</span>
                              <span
                                className="font-bold"
                                style={{
                                  color: actionResult.resourceChanges.budget > 0
                                    ? StoryModeColors.success
                                    : StoryModeColors.danger,
                                }}
                              >
                                {actionResult.resourceChanges.budget > 0 ? '+' : ''}
                                ${actionResult.resourceChanges.budget}K
                              </span>
                            </div>
                          )}
                          {actionResult.resourceChanges.risk !== undefined && actionResult.resourceChanges.risk !== 0 && (
                            <div className="flex justify-between">
                              <span style={{ color: StoryModeColors.textMuted }}>Risiko:</span>
                              <span
                                className="font-bold"
                                style={{
                                  color: actionResult.resourceChanges.risk > 0
                                    ? StoryModeColors.danger
                                    : StoryModeColors.success,
                                }}
                              >
                                {actionResult.resourceChanges.risk > 0 ? '+' : ''}
                                {actionResult.resourceChanges.risk}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* NPC Reactions */}
                    {actionResult.npcReactions && actionResult.npcReactions.length > 0 && (
                      <div
                        className="border-2 p-3"
                        style={{
                          backgroundColor: StoryModeColors.concrete,
                          borderColor: StoryModeColors.warning,
                        }}
                      >
                        <h4
                          className="font-bold mb-2 text-xs"
                          style={{ color: StoryModeColors.warning }}
                        >
                          NPC-REAKTIONEN
                        </h4>
                        <div className="space-y-2">
                          {actionResult.npcReactions.map((reaction, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 text-xs"
                            >
                              <span
                                className="font-bold"
                                style={{
                                  color: reaction.reaction === 'positive'
                                    ? StoryModeColors.success
                                    : reaction.reaction === 'negative'
                                    ? StoryModeColors.danger
                                    : StoryModeColors.textPrimary,
                                }}
                              >
                                {reaction.npcId}:
                              </span>
                              <span style={{ color: StoryModeColors.textSecondary }}>
                                {reaction.reaction === 'positive' ? '👍' :
                                 reaction.reaction === 'negative' ? '👎' :
                                 reaction.reaction === 'crisis' ? '😱' : '😐'}
                                {' '}{reaction.dialogue_de}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Batch Footer */}
          <div
            className="px-6 py-4 border-t-4 flex justify-end"
            style={{
              backgroundColor: StoryModeColors.darkConcrete,
              borderColor: StoryModeColors.border,
            }}
          >
            <button
              onClick={onClose}
              className="px-6 py-2 border-4 font-bold transition-all hover:brightness-110 active:translate-y-0.5"
              style={{
                backgroundColor: StoryModeColors.sovietRed,
                borderColor: StoryModeColors.darkRed,
                color: '#fff',
                boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.8)',
              }}
            >
              VERSTANDEN
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Single Mode - Original View (backwards compatible)
  const singleResult = results[0];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg mx-4 border-4 animate-fade-in"
        style={{
          backgroundColor: StoryModeColors.surface,
          borderColor: getOutcomeColor(singleResult),
          boxShadow: '10px 10px 0px 0px rgba(0,0,0,0.9)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b-4 flex items-center gap-3"
          style={{
            backgroundColor: getOutcomeColor(singleResult),
            borderColor: StoryModeColors.border,
          }}
        >
          <span className="text-2xl">{getOutcomeIcon(singleResult)}</span>
          <h2 className="font-bold text-xl" style={{ color: '#fff' }}>
            {singleResult.success ? 'AKTION ERFOLGREICH' : 'AKTION FEHLGESCHLAGEN'}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Action Name */}
          <div
            className="text-center py-3 border-2"
            style={{
              backgroundColor: StoryModeColors.background,
              borderColor: StoryModeColors.border,
            }}
          >
            <span
              className="font-bold text-lg"
              style={{ color: StoryModeColors.textPrimary }}
            >
              {singleResult.action?.label_de || 'Aktion'}
            </span>
          </div>

          {/* Narrative */}
          {singleResult.narrative && (
            <div
              className="p-4 border-l-4"
              style={{
                backgroundColor: StoryModeColors.background,
                borderColor: StoryModeColors.document,
              }}
            >
              <div
                className="font-bold mb-2"
                style={{ color: StoryModeColors.textPrimary }}
              >
                {singleResult.narrative.headline_de}
              </div>
              <p
                className="text-sm italic"
                style={{ color: StoryModeColors.textSecondary }}
              >
                {singleResult.narrative.description_de}
              </p>
            </div>
          )}

          {/* Resource Changes */}
          {singleResult.resourceChanges && (
            <div
              className="border-2 p-4"
              style={{
                backgroundColor: StoryModeColors.darkConcrete,
                borderColor: StoryModeColors.border,
              }}
            >
              <h3
                className="font-bold mb-3 text-sm"
                style={{ color: StoryModeColors.textSecondary }}
              >
                RESSOURCEN-ANDERUNGEN
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {singleResult.resourceChanges.budget !== undefined && singleResult.resourceChanges.budget !== 0 && (
                  <div className="flex justify-between">
                    <span style={{ color: StoryModeColors.textMuted }}>Budget:</span>
                    <span
                      className="font-bold"
                      style={{
                        color: singleResult.resourceChanges.budget > 0
                          ? StoryModeColors.success
                          : StoryModeColors.danger,
                      }}
                    >
                      {singleResult.resourceChanges.budget > 0 ? '+' : ''}
                      ${singleResult.resourceChanges.budget}K
                    </span>
                  </div>
                )}
                {singleResult.resourceChanges.capacity !== undefined && singleResult.resourceChanges.capacity !== 0 && (
                  <div className="flex justify-between">
                    <span style={{ color: StoryModeColors.textMuted }}>Kapazitat:</span>
                    <span
                      className="font-bold"
                      style={{
                        color: singleResult.resourceChanges.capacity > 0
                          ? StoryModeColors.success
                          : StoryModeColors.danger,
                      }}
                    >
                      {singleResult.resourceChanges.capacity > 0 ? '+' : ''}
                      {singleResult.resourceChanges.capacity}
                    </span>
                  </div>
                )}
                {singleResult.resourceChanges.risk !== undefined && singleResult.resourceChanges.risk !== 0 && (
                  <div className="flex justify-between">
                    <span style={{ color: StoryModeColors.textMuted }}>Risiko:</span>
                    <span
                      className="font-bold"
                      style={{
                        color: singleResult.resourceChanges.risk > 0
                          ? StoryModeColors.danger
                          : StoryModeColors.success,
                      }}
                    >
                      {singleResult.resourceChanges.risk > 0 ? '+' : ''}
                      {singleResult.resourceChanges.risk}%
                    </span>
                  </div>
                )}
                {singleResult.resourceChanges.attention !== undefined && singleResult.resourceChanges.attention !== 0 && (
                  <div className="flex justify-between">
                    <span style={{ color: StoryModeColors.textMuted }}>Aufmerksamkeit:</span>
                    <span
                      className="font-bold"
                      style={{
                        color: singleResult.resourceChanges.attention > 0
                          ? StoryModeColors.warning
                          : StoryModeColors.success,
                      }}
                    >
                      {singleResult.resourceChanges.attention > 0 ? '+' : ''}
                      {singleResult.resourceChanges.attention}%
                    </span>
                  </div>
                )}
                {singleResult.resourceChanges.moralWeight !== undefined && singleResult.resourceChanges.moralWeight !== 0 && (
                  <div className="flex justify-between">
                    <span style={{ color: StoryModeColors.textMuted }}>Moral. Last:</span>
                    <span
                      className="font-bold"
                      style={{ color: StoryModeColors.sovietRed }}
                    >
                      +{singleResult.resourceChanges.moralWeight}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Effects */}
          {singleResult.effects && singleResult.effects.length > 0 && (
            <div
              className="border-2 p-4"
              style={{
                backgroundColor: StoryModeColors.darkConcrete,
                borderColor: StoryModeColors.agencyBlue,
              }}
            >
              <h3
                className="font-bold mb-3 text-sm"
                style={{ color: StoryModeColors.agencyBlue }}
              >
                EFFEKTE
              </h3>
              <div className="space-y-2">
                {singleResult.effects.map((effect, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span style={{ color: StoryModeColors.success }}>+</span>
                    <span style={{ color: StoryModeColors.textSecondary }}>
                      {effect.description_de}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NPC Reactions */}
          {singleResult.npcReactions && singleResult.npcReactions.length > 0 && (
            <div
              className="border-2 p-4"
              style={{
                backgroundColor: StoryModeColors.darkConcrete,
                borderColor: StoryModeColors.warning,
              }}
            >
              <h3
                className="font-bold mb-3 text-sm"
                style={{ color: StoryModeColors.warning }}
              >
                NPC-REAKTIONEN
              </h3>
              <div className="space-y-2">
                {singleResult.npcReactions.map((reaction, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span
                      className="font-bold"
                      style={{
                        color: reaction.reaction === 'positive'
                          ? StoryModeColors.success
                          : reaction.reaction === 'negative'
                          ? StoryModeColors.danger
                          : StoryModeColors.textPrimary,
                      }}
                    >
                      {reaction.npcId}:
                    </span>
                    <span style={{ color: StoryModeColors.textSecondary }}>
                      {reaction.reaction === 'positive' ? '👍' :
                       reaction.reaction === 'negative' ? '👎' :
                       reaction.reaction === 'crisis' ? '😱' : '😐'}
                      {' '}{reaction.dialogue_de}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Combos - Celebration */}
          {singleResult.completedCombos && singleResult.completedCombos.length > 0 && (
            <div
              className="border-4 p-4 animate-pulse-soft"
              style={{
                backgroundColor: 'rgba(139, 92, 246, 0.15)',
                borderColor: COMBO_COLORS.ready,
                boxShadow: `0 0 20px ${COMBO_COLORS.glow}`,
              }}
            >
              <div
                className="text-center font-bold text-xl mb-3"
                style={{ color: COMBO_COLORS.ready }}
              >
                🎯 COMBO ABGESCHLOSSEN!
              </div>
              {singleResult.completedCombos.map((combo, i) => (
                <div
                  key={i}
                  className="border-2 p-3 mt-2"
                  style={{
                    backgroundColor: StoryModeColors.background,
                    borderColor: COMBO_COLORS.active,
                  }}
                >
                  <div
                    className="font-bold"
                    style={{ color: COMBO_COLORS.active }}
                  >
                    {combo.comboName}
                  </div>
                  <div
                    className="text-sm mt-1"
                    style={{ color: StoryModeColors.textSecondary }}
                  >
                    {combo.description}
                  </div>
                  {combo.bonus && (
                    <div
                      className="text-xs mt-2 flex gap-2 flex-wrap"
                      style={{ color: StoryModeColors.success }}
                    >
                      {combo.bonus.trustReduction && (
                        <span>📉 Trust -{combo.bonus.trustReduction}%</span>
                      )}
                      {combo.bonus.bonusAttention && (
                        <span>📢 Attention +{combo.bonus.bonusAttention}%</span>
                      )}
                      {combo.bonus.propagationBonus && (
                        <span>🌐 Verbreitung +{combo.bonus.propagationBonus}%</span>
                      )}
                      {combo.bonus.emotionalDamage && (
                        <span>💔 Emotional -{combo.bonus.emotionalDamage}</span>
                      )}
                      {combo.bonus.moneyRefund && (
                        <span>💰 Rückzahlung ${combo.bonus.moneyRefund}K</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Combo Hints - Progress */}
          {singleResult.comboHints && singleResult.comboHints.length > 0 && (
            <div
              className="border-2 p-4"
              style={{
                backgroundColor: StoryModeColors.darkConcrete,
                borderColor: COMBO_COLORS.building,
              }}
            >
              <h3
                className="font-bold mb-3 text-sm flex items-center gap-2"
                style={{ color: COMBO_COLORS.building }}
              >
                <span>🔗</span>
                COMBO-FORTSCHRITT
              </h3>
              <div className="space-y-3">
                {singleResult.comboHints.map((hint, i) => (
                  <div
                    key={i}
                    className="border p-2"
                    style={{
                      backgroundColor: StoryModeColors.background,
                      borderColor: StoryModeColors.borderLight,
                    }}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span
                        className="font-bold text-sm"
                        style={{ color: StoryModeColors.textPrimary }}
                      >
                        {hint.comboName}
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: COMBO_COLORS.building }}
                      >
                        {Math.round(hint.progress * 100)}%
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div
                      className="h-2 w-full rounded-full overflow-hidden"
                      style={{ backgroundColor: StoryModeColors.border }}
                    >
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${hint.progress * 100}%`,
                          backgroundColor: hint.progress >= 0.75
                            ? COMBO_COLORS.ready
                            : COMBO_COLORS.building,
                        }}
                      />
                    </div>
                    <div
                      className="text-xs mt-1 flex justify-between"
                      style={{ color: StoryModeColors.textMuted }}
                    >
                      <span>{hint.hint_de}</span>
                      <span>{hint.expiresIn} Phasen übrig</span>
                    </div>
                    {hint.nextAction_de && (
                      <div
                        className="text-xs mt-1"
                        style={{ color: COMBO_COLORS.building }}
                      >
                        Nächste: {hint.nextAction_de}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Potential Consequences Warning */}
          {singleResult.potentialConsequences && singleResult.potentialConsequences.length > 0 && (
            <div
              className="p-3 text-center text-xs border-2"
              style={{
                backgroundColor: 'rgba(255, 71, 71, 0.1)',
                borderColor: StoryModeColors.danger,
                color: StoryModeColors.danger,
              }}
            >
              ⚠️ Diese Aktion könnte zukünftige Konsequenzen auslösen
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 border-t-4 flex justify-end"
          style={{
            backgroundColor: StoryModeColors.darkConcrete,
            borderColor: StoryModeColors.border,
          }}
        >
          <button
            onClick={onClose}
            className="px-6 py-2 border-4 font-bold transition-all hover:brightness-110 active:translate-y-0.5"
            style={{
              backgroundColor: StoryModeColors.sovietRed,
              borderColor: StoryModeColors.darkRed,
              color: '#fff',
              boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.8)',
            }}
          >
            VERSTANDEN
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActionFeedbackDialog;
