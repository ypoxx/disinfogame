import { StoryModeColors } from '../theme';
import type { CrisisMoment, CrisisChoice } from '../engine/CrisisMomentSystem';
import { Icon } from './Icon';
import { PixelFrame } from './PixelFrame';

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
      case 'critical': return StoryModeColors.darkRed;
      case 'high': return StoryModeColors.danger;
      case 'medium': return StoryModeColors.warning;
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

  // Liefert ein kurzes Text-Label für den Icon-Typ (kein Emoji).
  const getIconLabel = () => {
    switch (crisis.iconType) {
      case 'warning': return 'WARNUNG';
      case 'urgent': return 'DRINGEND';
      default: return 'KRISE';
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
      <PixelFrame
        variant="alarm"
        className="w-full max-w-5xl max-h-[90vh] mx-4 flex flex-col overflow-hidden"
        style={{
          // §4.7: Dringlichkeit wird GESTEMPELT (Severity-Rand), nicht geblinkt.
          borderColor: getSeverityColor(),
        }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div
          className="px-8 py-6 border-b-4 relative"
          style={{
            backgroundColor: getSeverityColor(),
            borderColor: StoryModeColors.border,
          }}
        >
          {/* Deadline Warning — statischer Stempel statt Blinken (§4.7) */}
          {phasesRemaining !== undefined && phasesRemaining <= 3 && (
            <div
              className="absolute top-2 left-2 px-2 py-0.5 border-2 text-xs font-bold"
              style={{ borderColor: 'rgba(255,255,255,0.9)', color: '#fff' }}
            >
              FRIST: {phasesRemaining} PHASEN
            </div>
          )}

          <div className="text-center">
            {/* Kein Emoji: Icon-Typ als Text-Label */}
            <div
              className="text-xs font-bold mb-2 px-3 py-1 inline-block border"
              style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'rgba(255,255,255,0.9)' }}
            >
              {getIconLabel()}
            </div>
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
              X
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
            <div className="flex items-center gap-2 text-lg font-bold mb-4" style={{ color: StoryModeColors.textPrimary }}>
              <Icon name="mission" size={16} title="Entscheidung" fallback="Z" />
              IHRE ENTSCHEIDUNG
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
                    // v3: auch gesperrte Wahl bleibt PAPIER (gedimmt), sonst Tinte auf Dunkel.
                    backgroundColor: affordable ? StoryModeColors.surface : StoryModeColors.oldPaper,
                    borderColor: isRisky ? StoryModeColors.danger : StoryModeColors.border,
                  }}
                >
                  {/* Choice Number Badge */}
                  <div
                    className="absolute -left-4 top-6 w-8 h-8 flex items-center justify-center font-bold border-4"
                    style={{
                      backgroundColor: getSeverityColor(),
                      borderColor: StoryModeColors.border,
                      color: '#fff',
                      borderRadius: 0,
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
                        className="flex items-center gap-1 px-2 py-1 border"
                        style={{
                          backgroundColor: currentResources.budget >= choice.cost.budget ? StoryModeColors.surfaceLight : StoryModeColors.danger,
                          borderColor: StoryModeColors.border,
                          color: currentResources.budget >= choice.cost.budget ? StoryModeColors.textPrimary : '#fff',
                        }}
                      >
                        <Icon name="budget" size={12} title="Budget" fallback="¤" />
                        {choice.cost.budget}K
                      </div>
                    )}
                    {choice.cost.attention !== undefined && choice.cost.attention > 0 && (
                      <div
                        className="flex items-center gap-1 px-2 py-1 border"
                        style={{
                          backgroundColor: StoryModeColors.surfaceLight,
                          borderColor: StoryModeColors.danger,
                          color: StoryModeColors.danger,
                        }}
                      >
                        <Icon name="attention" size={12} title="Aufmerksamkeit" fallback="A" />
                        +{choice.cost.attention} Attention
                      </div>
                    )}
                    {choice.cost.risk !== undefined && choice.cost.risk > 0 && (
                      <div
                        className="flex items-center gap-1 px-2 py-1 border"
                        style={{
                          backgroundColor: StoryModeColors.surfaceLight,
                          borderColor: StoryModeColors.danger,
                          color: StoryModeColors.danger,
                        }}
                      >
                        <Icon name="risk" size={12} title="Risiko" fallback="R" />
                        +{choice.cost.risk} Risk
                      </div>
                    )}
                    {isRisky && (
                      <div
                        className="px-2 py-1 border-2 font-bold"
                        style={{
                          // Stempel (§4.7): Rahmen + Tinte statt Farbfläche/Blinken.
                          backgroundColor: 'transparent',
                          borderColor: StoryModeColors.danger,
                          color: StoryModeColors.danger,
                        }}
                      >
                        RISKANT
                      </div>
                    )}
                    {choice.requiresNPC && (
                      <div
                        className="flex items-center gap-1 px-2 py-1 border-2"
                        style={{
                          backgroundColor: 'transparent',
                          borderColor: StoryModeColors.agencyBlue,
                          color: StoryModeColors.agencyBlue,
                        }}
                      >
                        <Icon name="npcs" size={12} title="NPC" fallback="N" />
                        Benötigt NPC
                      </div>
                    )}
                  </div>

                  {!affordable && (
                    <div className="mt-2 text-xs font-bold" style={{ color: StoryModeColors.danger }}>
                      NICHT VERFÜGBAR - Unzureichende Ressourcen
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
                // v3: Warn-Box bleibt Papier; Dringlichkeit trägt der Stempel-Rand.
                backgroundColor: StoryModeColors.surface,
                borderColor: phasesRemaining <= 2 ? StoryModeColors.danger : StoryModeColors.warning,
              }}
            >
              <div className="flex items-center gap-3">
                <Icon name="clock" size={20} title="Zeitdruck" fallback="T" />
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
      </PixelFrame>
    </div>
  );
}

export default CrisisModal;
