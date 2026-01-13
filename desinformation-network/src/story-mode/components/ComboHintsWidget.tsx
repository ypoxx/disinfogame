import { StoryModeColors } from '../theme';
import type { ComboHint } from '../engine/StoryComboSystem';

// ============================================
// TYPES
// ============================================

interface ComboHintsWidgetProps {
  hints: ComboHint[];
}

// ============================================
// COMPONENT
// ============================================

export function ComboHintsWidget({ hints }: ComboHintsWidgetProps) {
  if (hints.length === 0) {
    return null;
  }

  return (
    <div
      className="p-3 border-2 space-y-2"
      style={{
        backgroundColor: StoryModeColors.surface,
        borderColor: StoryModeColors.agencyBlue,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">🎯</span>
        <div className="flex-1">
          <div className="text-sm font-bold" style={{ color: StoryModeColors.agencyBlue }}>
            AKTIVE KOMBINATIONEN
          </div>
          <div className="text-xs" style={{ color: StoryModeColors.textSecondary }}>
            Kombiniere Aktionen für Bonus-Effekte
          </div>
        </div>
      </div>

      {/* Hints List */}
      <div className="space-y-2">
        {hints.map(hint => (
          <div
            key={hint.comboId}
            className="p-2 border"
            style={{
              backgroundColor: StoryModeColors.background,
              borderColor: StoryModeColors.border,
            }}
          >
            {/* Combo Name & Progress */}
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs font-bold" style={{ color: StoryModeColors.textPrimary }}>
                {hint.comboName}
              </div>
              <div className="text-xs" style={{ color: StoryModeColors.agencyBlue }}>
                {Math.round(hint.progress * 100)}%
              </div>
            </div>

            {/* Progress Bar */}
            <div
              className="h-1 mb-2 bg-black border"
              style={{ borderColor: StoryModeColors.border }}
            >
              <div
                className="h-full transition-all"
                style={{
                  width: `${hint.progress * 100}%`,
                  backgroundColor: StoryModeColors.agencyBlue,
                }}
              />
            </div>

            {/* Next Action Hint */}
            {hint.nextAction_de && (
              <div className="text-xs mb-1" style={{ color: StoryModeColors.textSecondary }}>
                💡 Nächster Schritt: <span style={{ color: StoryModeColors.textPrimary }}>{hint.nextAction_de}</span>
              </div>
            )}

            {/* Expiration Warning */}
            {hint.expiresIn <= 3 && (
              <div
                className="text-xs flex items-center gap-1"
                style={{ color: hint.expiresIn <= 1 ? StoryModeColors.danger : StoryModeColors.warning }}
              >
                ⚠️ Läuft in {hint.expiresIn} {hint.expiresIn === 1 ? 'Phase' : 'Phasen'} ab
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ComboHintsWidget;
