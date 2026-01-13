import { StoryModeColors } from '../theme';
import type { BetrayalWarningLevel } from '../engine/BetrayalSystem';

// ============================================
// TYPES
// ============================================

interface BetrayalWarningBadgeProps {
  warningLevel: BetrayalWarningLevel;
  betrayalRisk: number;  // 0-100
  onClick?: () => void;
}

// ============================================
// COMPONENT
// ============================================

export function BetrayalWarningBadge({
  warningLevel,
  betrayalRisk,
  onClick,
}: BetrayalWarningBadgeProps) {
  // Don't show badge if loyal (level 0)
  if (warningLevel === 0) return null;

  const getWarningColor = () => {
    switch (warningLevel) {
      case 1: return StoryModeColors.warning;  // Yellow - early warning
      case 2: return '#FF8C00';                 // Orange - mid warning
      case 3: return '#FF4500';                 // Red-orange - critical
      case 4: return StoryModeColors.danger;   // Red - imminent
      default: return StoryModeColors.warning;
    }
  };

  const getWarningIcon = () => {
    switch (warningLevel) {
      case 1: return '⚠️';
      case 2: return '⚠️';
      case 3: return '🔥';
      case 4: return '💀';
      default: return '⚠️';
    }
  };

  const getWarningLabel = () => {
    switch (warningLevel) {
      case 1: return 'Besorgt';
      case 2: return 'Unzufrieden';
      case 3: return 'Kritisch';
      case 4: return 'GEFAHR!';
      default: return 'Warnung';
    }
  };

  const shouldPulse = warningLevel >= 3;

  return (
    <div
      className={`absolute -top-2 -right-2 z-10 cursor-pointer transition-transform hover:scale-110 ${shouldPulse ? 'animate-pulse' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      title={`Loyalität gefährdet: ${betrayalRisk}% Verrats-Risiko`}
    >
      <div
        className="flex items-center gap-1 px-2 py-1 border-2 font-bold text-xs shadow-lg"
        style={{
          backgroundColor: warningLevel >= 3 ? getWarningColor() : StoryModeColors.background,
          borderColor: getWarningColor(),
          color: warningLevel >= 3 ? '#fff' : getWarningColor(),
          boxShadow: `0 0 ${warningLevel * 3}px ${getWarningColor()}`,
        }}
      >
        <span className="text-sm">{getWarningIcon()}</span>
        <span className="uppercase tracking-tight">{getWarningLabel()}</span>
      </div>

      {/* Risk Bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{
          backgroundColor: getWarningColor(),
          width: `${betrayalRisk}%`,
        }}
      />
    </div>
  );
}

export default BetrayalWarningBadge;
