import { StoryModeColors } from '../theme';
import type { ActionResult } from '../../game-logic/StoryEngineAdapter';

interface ActionFeedbackDialogProps {
  isVisible: boolean;
  result: ActionResult | null;
  onClose: () => void;
}

export function ActionFeedbackDialog({
  isVisible,
  result,
  onClose,
}: ActionFeedbackDialogProps) {
  if (!isVisible || !result) return null;

  const getOutcomeColor = () => {
    if (!result.success) return StoryModeColors.danger;
    return StoryModeColors.success;
  };

  const getOutcomeIcon = () => {
    if (!result.success) return '❌';
    return '✓';
  };

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
          borderColor: getOutcomeColor(),
          boxShadow: '10px 10px 0px 0px rgba(0,0,0,0.9)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b-4 flex items-center gap-3"
          style={{
            backgroundColor: getOutcomeColor(),
            borderColor: StoryModeColors.border,
          }}
        >
          <span className="text-2xl">{getOutcomeIcon()}</span>
          <h2 className="font-bold text-xl" style={{ color: '#fff' }}>
            {result.success ? 'AKTION ERFOLGREICH' : 'AKTION FEHLGESCHLAGEN'}
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
              {result.action?.label_de || 'Aktion'}
            </span>
          </div>

          {/* Narrative */}
          {result.narrative && (
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
                {result.narrative.headline_de}
              </div>
              <p
                className="text-sm italic"
                style={{ color: StoryModeColors.textSecondary }}
              >
                {result.narrative.description_de}
              </p>
            </div>
          )}

          {/* Resource Changes */}
          {result.resourceChanges && (
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
                {result.resourceChanges.budget !== undefined && result.resourceChanges.budget !== 0 && (
                  <div className="flex justify-between">
                    <span style={{ color: StoryModeColors.textMuted }}>Budget:</span>
                    <span
                      className="font-bold"
                      style={{
                        color: result.resourceChanges.budget > 0
                          ? StoryModeColors.success
                          : StoryModeColors.danger,
                      }}
                    >
                      {result.resourceChanges.budget > 0 ? '+' : ''}
                      ${result.resourceChanges.budget}K
                    </span>
                  </div>
                )}
                {result.resourceChanges.capacity !== undefined && result.resourceChanges.capacity !== 0 && (
                  <div className="flex justify-between">
                    <span style={{ color: StoryModeColors.textMuted }}>Kapazitat:</span>
                    <span
                      className="font-bold"
                      style={{
                        color: result.resourceChanges.capacity > 0
                          ? StoryModeColors.success
                          : StoryModeColors.danger,
                      }}
                    >
                      {result.resourceChanges.capacity > 0 ? '+' : ''}
                      {result.resourceChanges.capacity}
                    </span>
                  </div>
                )}
                {result.resourceChanges.risk !== undefined && result.resourceChanges.risk !== 0 && (
                  <div className="flex justify-between">
                    <span style={{ color: StoryModeColors.textMuted }}>Risiko:</span>
                    <span
                      className="font-bold"
                      style={{
                        color: result.resourceChanges.risk > 0
                          ? StoryModeColors.danger
                          : StoryModeColors.success,
                      }}
                    >
                      {result.resourceChanges.risk > 0 ? '+' : ''}
                      {result.resourceChanges.risk}%
                    </span>
                  </div>
                )}
                {result.resourceChanges.attention !== undefined && result.resourceChanges.attention !== 0 && (
                  <div className="flex justify-between">
                    <span style={{ color: StoryModeColors.textMuted }}>Aufmerksamkeit:</span>
                    <span
                      className="font-bold"
                      style={{
                        color: result.resourceChanges.attention > 0
                          ? StoryModeColors.warning
                          : StoryModeColors.success,
                      }}
                    >
                      {result.resourceChanges.attention > 0 ? '+' : ''}
                      {result.resourceChanges.attention}%
                    </span>
                  </div>
                )}
                {result.resourceChanges.moralWeight !== undefined && result.resourceChanges.moralWeight !== 0 && (
                  <div className="flex justify-between">
                    <span style={{ color: StoryModeColors.textMuted }}>Moral. Last:</span>
                    <span
                      className="font-bold"
                      style={{ color: StoryModeColors.sovietRed }}
                    >
                      +{result.resourceChanges.moralWeight}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Effects */}
          {result.effects && result.effects.length > 0 && (
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
                {result.effects.map((effect, i) => (
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
          {result.npcReactions && result.npcReactions.length > 0 && (
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
                {result.npcReactions.map((reaction, i) => (
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

          {/* Potential Consequences Warning */}
          {result.potentialConsequences && result.potentialConsequences.length > 0 && (
            <div
              className="p-3 text-center text-xs border-2"
              style={{
                backgroundColor: 'rgba(255, 71, 71, 0.1)',
                borderColor: StoryModeColors.danger,
                color: StoryModeColors.danger,
              }}
            >
              ⚠️ Diese Aktion konnte zukunftige Konsequenzen auslosen
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
