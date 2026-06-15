import { StoryModeColors } from '../theme';
import { Icon } from './Icon';
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

  const getWarningIcon = (): JSX.Element => {
    switch (warningLevel) {
      case 1: return <Icon name="risk" size={14} title="Warnung" />;
      case 2: return <Icon name="risk" size={14} title="Warnung" />;
      case 3: return <Icon name="risk" size={14} title="Kritisch" />;
      case 4: return <Icon name="moral" size={14} title="Gefahr" />;
      default: return <Icon name="risk" size={14} title="Warnung" />;
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
        className="flex items-center gap-1 px-2 py-1 border-2 font-bold text-xs"
        style={{
          backgroundColor: warningLevel >= 3 ? getWarningColor() : StoryModeColors.background,
          borderColor: getWarningColor(),
          color: warningLevel >= 3 ? '#fff' : getWarningColor(),
          boxShadow: `inset 0 0 0 1px ${getWarningColor()}`,
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
