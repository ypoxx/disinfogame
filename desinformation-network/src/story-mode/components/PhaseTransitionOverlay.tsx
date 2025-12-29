import { StoryModeColors } from '../theme';

interface PhaseTransitionOverlayProps {
  isVisible: boolean;
  currentPhase: number;
  currentYear: number;
  currentMonth: number;
}

export function PhaseTransitionOverlay({
  isVisible,
  currentPhase,
  currentYear,
  currentMonth,
}: PhaseTransitionOverlayProps) {
  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        animation: 'story-phase-transition 2s ease-in-out',
      }}
    >
      <div className="text-center">
        {/* Phase indicator */}
        <div className="mb-8">
          <div
            className="text-6xl font-bold mb-4 animate-pulse"
            style={{ color: StoryModeColors.warning }}
          >
            PHASE {currentPhase}
          </div>
          <div
            className="text-2xl font-mono"
            style={{ color: StoryModeColors.textSecondary }}
          >
            {currentYear} • MONAT {currentMonth}
          </div>
        </div>

        {/* Loading bar */}
        <div
          className="w-64 h-2 mx-auto rounded-sm overflow-hidden"
          style={{ backgroundColor: StoryModeColors.darkConcrete }}
        >
          <div
            className="h-full animate-pulse"
            style={{
              backgroundColor: StoryModeColors.sovietRed,
              animation: 'progress-load 1.5s ease-in-out infinite',
            }}
          />
        </div>

        {/* Loading text */}
        <div
          className="mt-6 text-sm font-mono animate-pulse"
          style={{ color: StoryModeColors.textMuted }}
        >
          Analysiere Kampagnenergebnisse...
        </div>
      </div>
    </div>
  );
}

export default PhaseTransitionOverlay;
