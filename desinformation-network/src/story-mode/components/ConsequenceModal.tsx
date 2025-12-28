import { StoryModeColors } from '../theme';
import type { ActiveConsequence } from '../../game-logic/StoryEngineAdapter';

interface ConsequenceModalProps {
  isVisible: boolean;
  consequence: ActiveConsequence | null;
  currentPhase: number;
  onChoice: (choiceId: string) => void;
}

export function ConsequenceModal({
  isVisible,
  consequence,
  currentPhase,
  onChoice,
}: ConsequenceModalProps) {
  if (!isVisible || !consequence) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return StoryModeColors.danger;
      case 'severe': return StoryModeColors.sovietRed;
      case 'moderate': return StoryModeColors.warning;
      case 'minor': return StoryModeColors.textSecondary;
      default: return StoryModeColors.textMuted;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🚨';
      case 'severe': return '⚠️';
      case 'moderate': return '⚡';
      case 'minor': return '💡';
      default: return '❓';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'exposure': return 'ENTHULLUNG';
      case 'blowback': return 'RUCKSCHLAG';
      case 'escalation': return 'ESKALATION';
      case 'internal': return 'INTERNER KONFLIKT';
      case 'collateral': return 'KOLLATERALSCHADEN';
      case 'opportunity': return 'GELEGENHEIT';
      default: return type.toUpperCase();
    }
  };

  const phasesRemaining = consequence.deadline
    ? consequence.deadline - currentPhase
    : null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
    >
      <div
        className="w-full max-w-xl mx-4 border-4 animate-shake"
        style={{
          backgroundColor: StoryModeColors.surface,
          borderColor: getSeverityColor(consequence.severity),
          boxShadow: `0 0 40px ${getSeverityColor(consequence.severity)}, 12px 12px 0px 0px rgba(0,0,0,0.9)`,
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b-4 flex items-center justify-between"
          style={{
            backgroundColor: getSeverityColor(consequence.severity),
            borderColor: StoryModeColors.border,
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getSeverityIcon(consequence.severity)}</span>
            <div>
              <h2 className="font-bold text-xl" style={{ color: '#fff' }}>
                KONSEQUENZ
              </h2>
              <span
                className="text-xs uppercase"
                style={{ color: 'rgba(255,255,255,0.8)' }}
              >
                {getTypeLabel(consequence.type)}
              </span>
            </div>
          </div>
          {phasesRemaining !== null && (
            <div
              className="text-center px-4 py-2 border-2"
              style={{
                backgroundColor: 'rgba(0,0,0,0.3)',
                borderColor: 'rgba(255,255,255,0.3)',
              }}
            >
              <div className="text-xl font-bold" style={{ color: '#fff' }}>
                {phasesRemaining}
              </div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                PHASEN
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Title */}
          <h3
            className="text-xl font-bold text-center"
            style={{ color: StoryModeColors.textPrimary }}
          >
            {consequence.label_de}
          </h3>

          {/* Choices */}
          {consequence.choices && consequence.choices.length > 0 && (
            <div className="space-y-3">
              <h4
                className="font-bold text-sm"
                style={{ color: StoryModeColors.textSecondary }}
              >
                WAHLEN SIE IHRE REAKTION:
              </h4>
              {consequence.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => onChoice(choice.id)}
                  className="w-full text-left p-4 border-4 transition-all hover:brightness-110 active:translate-y-0.5"
                  style={{
                    backgroundColor: StoryModeColors.darkConcrete,
                    borderColor: StoryModeColors.border,
                    boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.8)',
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className="font-bold"
                      style={{ color: StoryModeColors.textPrimary }}
                    >
                      {choice.label_de}
                    </span>
                    {choice.cost && (
                      <div className="flex gap-2 text-xs">
                        {choice.cost.budget && (
                          <span style={{ color: StoryModeColors.warning }}>
                            -${choice.cost.budget}K
                          </span>
                        )}
                        {choice.cost.risk && (
                          <span style={{ color: StoryModeColors.danger }}>
                            +{choice.cost.risk}% Risiko
                          </span>
                        )}
                        {choice.cost.moralWeight && (
                          <span style={{ color: StoryModeColors.sovietRed }}>
                            +{choice.cost.moralWeight} Moral
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <p
                    className="text-sm"
                    style={{ color: StoryModeColors.textSecondary }}
                  >
                    {choice.outcome_de}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-6 py-3 border-t-4 text-center text-xs"
          style={{
            backgroundColor: StoryModeColors.darkConcrete,
            borderColor: StoryModeColors.border,
            color: StoryModeColors.textMuted,
          }}
        >
          Jede Entscheidung hat langfristige Auswirkungen
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default ConsequenceModal;
