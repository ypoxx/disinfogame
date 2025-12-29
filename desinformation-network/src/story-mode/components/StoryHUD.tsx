import { StoryModeColors } from '../theme';

// ============================================
// TYPES
// ============================================

export interface StoryResources {
  budget: number;
  capacity: number;
  risk: number;
  attention: number;
  moralWeight: number;
}

export interface StoryPhaseInfo {
  current: number;
  year: number;
  month: number;
  actionPoints: number;
  maxActionPoints: number;
}

export interface ObjectiveInfo {
  id: string;
  title: string;
  progress: number;
  target: number;
  isCompleted: boolean;
  isPrimary: boolean;
}

interface StoryHUDProps {
  resources: StoryResources;
  phase: StoryPhaseInfo;
  objectives: ObjectiveInfo[];
  onEndPhase?: () => void;
  onOpenMenu?: () => void;
  onOpenObjectives?: () => void;
}

// ============================================
// RESOURCE BAR COMPONENT
// ============================================

interface ResourceBarProps {
  icon: string;
  label: string;
  value: number;
  maxValue?: number;
  format?: 'currency' | 'percent' | 'number';
  color: string;
  warningThreshold?: number;
  dangerThreshold?: number;
}

function ResourceBar({
  icon,
  label,
  value,
  maxValue,
  format = 'number',
  color,
  warningThreshold,
  dangerThreshold,
}: ResourceBarProps) {
  const formatValue = () => {
    switch (format) {
      case 'currency':
        return `$${value}K`;
      case 'percent':
        return `${Math.round(value)}%`;
      default:
        return maxValue ? `${value}/${maxValue}` : value.toString();
    }
  };

  const getStatusColor = () => {
    if (dangerThreshold !== undefined && value >= dangerThreshold) {
      return StoryModeColors.danger;
    }
    if (warningThreshold !== undefined && value >= warningThreshold) {
      return StoryModeColors.warning;
    }
    return color;
  };

  const statusColor = getStatusColor();
  const percentage = maxValue ? (value / maxValue) * 100 : undefined;

  return (
    <div className="flex items-center gap-2">
      <span className="text-lg">{icon}</span>
      <div className="flex-1">
        <div className="flex justify-between text-xs mb-0.5">
          <span style={{ color: StoryModeColors.textSecondary }}>{label}</span>
          <span className="font-bold" style={{ color: statusColor }}>
            {formatValue()}
          </span>
        </div>
        {percentage !== undefined && (
          <div
            className="h-1.5 rounded-sm overflow-hidden"
            style={{ backgroundColor: StoryModeColors.border }}
          >
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: statusColor,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// PHASE DISPLAY COMPONENT
// ============================================

interface PhaseDisplayProps {
  phase: StoryPhaseInfo;
}

function PhaseDisplay({ phase }: PhaseDisplayProps) {
  const months = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
  ];

  return (
    <div className="flex items-center gap-4">
      <div className="text-center">
        <div className="text-xs" style={{ color: StoryModeColors.textSecondary }}>
          YEAR
        </div>
        <div
          className="font-bold text-xl"
          style={{ color: StoryModeColors.sovietRed }}
        >
          {phase.year}
        </div>
      </div>
      <div
        className="h-8 w-0.5"
        style={{ backgroundColor: StoryModeColors.borderLight }}
      />
      <div className="text-center">
        <div className="text-xs" style={{ color: StoryModeColors.textSecondary }}>
          MONTH
        </div>
        <div
          className="font-bold text-xl"
          style={{ color: StoryModeColors.document }}
        >
          {months[phase.month - 1] || 'JAN'}
        </div>
      </div>
      <div
        className="h-8 w-0.5"
        style={{ backgroundColor: StoryModeColors.borderLight }}
      />
      <div className="text-center">
        <div className="text-xs" style={{ color: StoryModeColors.textSecondary }}>
          AP
        </div>
        <div
          className="font-bold text-xl"
          style={{ color: StoryModeColors.warning }}
        >
          {phase.actionPoints}/{phase.maxActionPoints}
        </div>
      </div>
    </div>
  );
}

// ============================================
// OBJECTIVE TRACKER COMPONENT
// ============================================

interface ObjectiveTrackerProps {
  objectives: ObjectiveInfo[];
  onClick?: () => void;
}

function ObjectiveTracker({ objectives, onClick }: ObjectiveTrackerProps) {
  const primaryObjective = objectives.find(o => o.isPrimary && !o.isCompleted);
  const completedCount = objectives.filter(o => o.isCompleted).length;

  if (!primaryObjective) return null;

  const progress = (primaryObjective.progress / primaryObjective.target) * 100;

  return (
    <button
      onClick={onClick}
      className="text-left px-3 py-2 border-2 transition-all hover:brightness-110 active:translate-y-0.5 story-btn-ripple overflow-hidden"
      style={{
        backgroundColor: StoryModeColors.surfaceLight,
        borderColor: StoryModeColors.border,
        boxShadow: '2px 2px 0px 0px rgba(0,0,0,0.5)',
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm">🎯</span>
        <span
          className="text-xs font-bold uppercase"
          style={{ color: StoryModeColors.textSecondary }}
        >
          Current Objective
        </span>
        <span
          className="text-xs ml-auto"
          style={{ color: StoryModeColors.textMuted }}
        >
          {completedCount}/{objectives.length}
        </span>
      </div>
      <div
        className="text-sm font-mono truncate max-w-[200px]"
        style={{ color: StoryModeColors.textPrimary }}
      >
        {primaryObjective.title}
      </div>
      <div
        className="h-1 mt-1 rounded-sm overflow-hidden"
        style={{ backgroundColor: StoryModeColors.border }}
      >
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${progress}%`,
            backgroundColor: StoryModeColors.militaryOlive,
          }}
        />
      </div>
    </button>
  );
}

// ============================================
// MAIN STORY HUD COMPONENT
// ============================================

export function StoryHUD({
  resources,
  phase,
  objectives,
  onEndPhase,
  onOpenMenu,
  onOpenObjectives,
}: StoryHUDProps) {
  return (
    <>
      {/* Top Bar */}
      <div
        className="fixed top-0 left-0 right-0 z-40 border-b-4"
        style={{
          backgroundColor: StoryModeColors.darkConcrete,
          borderColor: StoryModeColors.border,
        }}
      >
        <div className="flex items-center justify-between px-4 py-2">
          {/* Left: Phase Info */}
          <PhaseDisplay phase={phase} />

          {/* Center: Resources */}
          <div className="flex items-center gap-6">
            <ResourceBar
              icon="💰"
              label="BUDGET"
              value={resources.budget}
              format="currency"
              color={StoryModeColors.warning}
              warningThreshold={20}
              dangerThreshold={10}
            />
            <ResourceBar
              icon="⚡"
              label="CAPACITY"
              value={resources.capacity}
              maxValue={100}
              color={StoryModeColors.agencyBlue}
            />
            <ResourceBar
              icon="⚠️"
              label="RISK"
              value={resources.risk}
              format="percent"
              color={StoryModeColors.militaryOlive}
              warningThreshold={50}
              dangerThreshold={75}
            />
            <ResourceBar
              icon="👁️"
              label="ATTENTION"
              value={resources.attention}
              format="percent"
              color={StoryModeColors.danger}
              warningThreshold={60}
              dangerThreshold={80}
            />
            <ResourceBar
              icon="💀"
              label="MORAL"
              value={resources.moralWeight}
              format="number"
              color={StoryModeColors.sovietRed}
              warningThreshold={50}
              dangerThreshold={75}
            />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {onOpenMenu && (
              <button
                onClick={onOpenMenu}
                className="px-3 py-1.5 border-2 font-bold text-sm transition-all hover:brightness-110 active:translate-y-0.5 story-btn-ripple overflow-hidden"
                style={{
                  backgroundColor: StoryModeColors.concrete,
                  borderColor: StoryModeColors.borderLight,
                  color: StoryModeColors.textPrimary,
                  boxShadow: '2px 2px 0px 0px rgba(0,0,0,0.8)',
                }}
              >
                ☰ MENU
              </button>
            )}
            {onEndPhase && (
              <button
                onClick={onEndPhase}
                className="px-4 py-1.5 border-2 font-bold text-sm transition-all hover:brightness-110 active:translate-y-0.5 story-btn-ripple overflow-hidden"
                style={{
                  backgroundColor: StoryModeColors.sovietRed,
                  borderColor: StoryModeColors.darkRed,
                  color: '#fff',
                  boxShadow: '2px 2px 0px 0px rgba(0,0,0,0.8)',
                }}
              >
                END PHASE →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Left: Objective Tracker */}
      <div className="fixed bottom-4 left-4 z-30">
        <ObjectiveTracker
          objectives={objectives}
          onClick={onOpenObjectives}
        />
      </div>
    </>
  );
}

export default StoryHUD;
