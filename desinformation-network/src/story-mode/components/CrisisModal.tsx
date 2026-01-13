import { StoryModeColors } from '../theme';
import type { CrisisMoment, CrisisChoice } from '../engine/CrisisMomentSystem';

// ============================================
// TYPES
// ============================================

interface CrisisModalProps {
  isVisible: boolean;
  crisis: CrisisMoment | null;
  currentResources: {
    budget: number;
    attention: number;
    risk: number;
  };
  phasesRemaining?: number; // Phases until deadline
  onSelectChoice: (choiceId: string) => void;
  onDismiss?: () => void;
}

// ============================================
// COMPONENT
// ============================================

export function CrisisModal({
  isVisible,
  crisis,
  currentResources,
  phasesRemaining,
  onSelectChoice,
  onDismiss,
}: CrisisModalProps) {
  if (!isVisible || !crisis) return null;

  const getSeverityColor = () => {
    switch (crisis.severity) {
      case 'critical': return '#8B0000';  // Dark red
      case 'high': return StoryModeColors.danger;
      case 'medium': return '#FF8C00';  // Orange
      case 'low': return StoryModeColors.warning;
      default: return StoryModeColors.warning;
    }
  };

  const getSeverityLabel = () => {
    switch (crisis.severity) {
      case 'critical': return 'KRITISCH';
      case 'high': return 'HOCH';
      case 'medium': return 'MITTEL';
      case 'low': return 'NIEDRIG';
      default: return 'WARNUNG';
    }
  };

  const canAffordChoice = (choice: CrisisChoice): boolean => {
    if (choice.cost.budget && currentResources.budget < choice.cost.budget) return false;
    if (choice.cost.attention && currentResources.attention + (choice.cost.attention || 0) > 100) return false;
    if (choice.cost.risk && currentResources.risk + (choice.cost.risk || 0) > 100) return false;
    return true;
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[70]"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
      onClick={onDismiss}
    >
      <div
        className="w-full max-w-5xl max-h-[90vh] mx-4 border-8 flex flex-col overflow-hidden"
        style={{
          backgroundColor: StoryModeColors.background,
          borderColor: getSeverityColor(),
          boxShadow: `0 0 60px ${getSeverityColor()}`,
          animation: crisis.severity === 'critical' ? 'pulse 2s ease-in-out infinite' : undefined,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* HEADER */}
        <div
          className="px-8 py-6 border-b-8 relative"
          style={{
            backgroundColor: getSeverityColor(),
            borderColor: '#000',
          }}
        >
          {/* Deadline Warning */}
          {phasesRemaining !== undefined && phasesRemaining <= 3 && (
            <div className="absolute top-2 left-2 flex items-center gap-2 animate-pulse">
              <div className="w-3 h-3 rounded-full bg-white" />
              <span className="text-xs font-bold" style={{ color: '#fff' }}>
                FRIST: {phasesRemaining} PHASEN
              </span>
            </div>
          )}

          <div className="text-center">
            <div className="text-5xl mb-2">{crisis.iconType === 'warning' ? '⚠️' : crisis.iconType === 'urgent' ? '🔥' : '⚡'}</div>
            <div className="text-xs font-bold mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>
              KRISEN-MOMENT • {getSeverityLabel()}
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#fff', textShadow: '3px 3px 6px rgba(0,0,0,0.8)' }}>
              {crisis.name_de.toUpperCase()}
            </h1>
          </div>

          {onDismiss && (
            <button
              onClick={onDismiss}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center border-2 hover:brightness-110 transition"
              style={{
                backgroundColor: 'rgba(0,0,0,0.3)',
                borderColor: '#fff',
                color: '#fff',
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Description */}
          <div
            className="mb-8 p-6 border-4"
            style={{
              backgroundColor: StoryModeColors.surface,
              borderColor: StoryModeColors.border,
            }}
          >
            <div className="text-xs font-bold mb-3" style={{ color: getSeverityColor() }}>
              SITUATION
            </div>
            <div className="text-base leading-relaxed" style={{ color: StoryModeColors.textPrimary }}>
              {crisis.description_de}
            </div>
          </div>

          {/* Choices */}
          <div className="space-y-4">
            <div className="text-lg font-bold mb-4" style={{ color: StoryModeColors.textPrimary }}>
              🎯 IHRE ENTSCHEIDUNG
            </div>

            {crisis.choices.map((choice, index) => {
              const affordable = canAffordChoice(choice);
              const isRisky = choice.isRisky;

              return (
                <button
                  key={choice.id}
                  onClick={() => affordable && onSelectChoice(choice.id)}
                  disabled={!affordable}
                  className="w-full text-left p-6 border-4 transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed relative"
                  style={{
                    backgroundColor: affordable ? StoryModeColors.surface : StoryModeColors.darkConcrete,
                    borderColor: isRisky ? StoryModeColors.danger : StoryModeColors.border,
                    boxShadow: affordable ? '4px 4px 0px rgba(0,0,0,0.5)' : 'none',
                  }}
                >
                  {/* Choice Number Badge */}
                  <div
                    className="absolute -left-4 top-6 w-8 h-8 flex items-center justify-center font-bold border-4"
                    style={{
                      backgroundColor: getSeverityColor(),
                      borderColor: '#000',
                      color: '#fff',
                      borderRadius: '50%',
                    }}
                  >
                    {index + 1}
                  </div>

                  {/* Choice Text */}
                  <div className="mb-3">
                    <div className="text-base font-bold mb-2" style={{ color: StoryModeColors.textPrimary }}>
                      {choice.text_de}
                    </div>
                    <div className="text-sm" style={{ color: StoryModeColors.textSecondary }}>
                      {choice.consequence_de}
                    </div>
                  </div>

                  {/* Costs */}
                  <div className="flex flex-wrap gap-3 text-xs">
                    {choice.cost.budget !== undefined && choice.cost.budget > 0 && (
                      <div
                        className="px-2 py-1 border"
                        style={{
                          backgroundColor: currentResources.budget >= choice.cost.budget ? StoryModeColors.background : StoryModeColors.danger,
                          borderColor: StoryModeColors.border,
                          color: currentResources.budget >= choice.cost.budget ? StoryModeColors.warning : '#fff',
                        }}
                      >
                        💰 ${choice.cost.budget}K
                      </div>
                    )}
                    {choice.cost.attention !== undefined && choice.cost.attention > 0 && (
                      <div
                        className="px-2 py-1 border"
                        style={{
                          backgroundColor: StoryModeColors.background,
                          borderColor: StoryModeColors.danger,
                          color: StoryModeColors.danger,
                        }}
                      >
                        👁️ +{choice.cost.attention} Attention
                      </div>
                    )}
                    {choice.cost.risk !== undefined && choice.cost.risk > 0 && (
                      <div
                        className="px-2 py-1 border"
                        style={{
                          backgroundColor: StoryModeColors.background,
                          borderColor: StoryModeColors.danger,
                          color: StoryModeColors.danger,
                        }}
                      >
                        ⚠️ +{choice.cost.risk} Risk
                      </div>
                    )}
                    {isRisky && (
                      <div
                        className="px-2 py-1 border animate-pulse"
                        style={{
                          backgroundColor: StoryModeColors.danger,
                          borderColor: '#8B0000',
                          color: '#fff',
                        }}
                      >
                        🔥 RISKANT
                      </div>
                    )}
                    {choice.requiresNPC && (
                      <div
                        className="px-2 py-1 border"
                        style={{
                          backgroundColor: StoryModeColors.agencyBlue,
                          borderColor: StoryModeColors.darkBlue,
                          color: '#fff',
                        }}
                      >
                        👤 Benötigt NPC
                      </div>
                    )}
                  </div>

                  {!affordable && (
                    <div className="mt-2 text-xs font-bold" style={{ color: StoryModeColors.danger }}>
                      ❌ NICHT VERFÜGBAR - Unzureichende Ressourcen
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Deadline Warning Box */}
          {phasesRemaining !== undefined && phasesRemaining > 0 && (
            <div
              className="mt-6 p-4 border-4"
              style={{
                backgroundColor: phasesRemaining <= 2 ? '#1a0000' : StoryModeColors.surface,
                borderColor: phasesRemaining <= 2 ? StoryModeColors.danger : StoryModeColors.warning,
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{phasesRemaining <= 2 ? '⏰' : '⏳'}</span>
                <div className="flex-1">
                  <div className="text-xs font-bold" style={{ color: phasesRemaining <= 2 ? StoryModeColors.danger : StoryModeColors.warning }}>
                    ZEITDRUCK
                  </div>
                  <div className="text-sm" style={{ color: StoryModeColors.textSecondary }}>
                    Sie haben noch <span className="font-bold">{phasesRemaining} Phasen</span>, um zu entscheiden. Andernfalls wird die Krise automatisch eskalieren.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}

export default CrisisModal;
