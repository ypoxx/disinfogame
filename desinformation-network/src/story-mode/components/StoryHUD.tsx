import { StoryModeColors } from '../theme';
import { Icon, type IconName } from './Icon';

// E29: Keyframe für pulsierendes RISIKO bei ≥70 — einmalig injiziert.
const HUD_PULSE_STYLE = `
  @keyframes hud-risk-pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.55; }
  }
`;

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

/**
 * Gesellschaftswerte fürs HUD (B2/P1, O3: 4 sichtbar, niedrigschwellig).
 * Vertrauen kommt aus obj_destabilize; der Rest aus den neuen Zustandsfeldern.
 */
export interface SocietyInfo {
  vertrauen: number;        // Institutionen-Vertrauen (0–100, sinkt = Auftrags-Mittel)
  polarisierung: number;
  informationslast: number;
  zynismus: number;
}

interface StoryHUDProps {
  resources: StoryResources;
  phase: StoryPhaseInfo;
  objectives: ObjectiveInfo[];
  /** B2/P1: mehrdimensionaler Gesellschafts-Zustand (4 sichtbar). */
  society?: SocietyInfo;
  onEndPhase?: () => void;
  onOpenMenu?: () => void;
  onOpenObjectives?: () => void;
  /** E1/2g: HUD wieder ausblenden (nur auf Knopfdruck sichtbar). */
  onHideHud?: () => void;
}

// ============================================
// RESOURCE BAR COMPONENT
// ============================================

interface ResourceBarProps {
  icon: IconName;
  label: string;
  value: number;
  maxValue?: number;
  format?: 'currency' | 'percent' | 'number';
  color: string;
  warningThreshold?: number;
  dangerThreshold?: number;
  /** E29: 'primary' = größere Schrift/fett, 'secondary' = kleiner/gedimmt */
  priority?: 'primary' | 'secondary';
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
  priority,
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

  // E29: Primäre Indikatoren fett + etwas größer; Sekundär dezent verkleinert.
  const isPrimary = priority === 'primary';
  const isSecondary = priority === 'secondary';

  // E29: RISIKO pulsiert bei ≥70 (danger).
  const isDanger = dangerThreshold !== undefined && value >= dangerThreshold;
  const pulseStyle: React.CSSProperties = isDanger && isPrimary
    ? { animation: 'hud-risk-pulse 1.2s ease-in-out infinite' }
    : {};

  return (
    <div
      className="flex items-center gap-2"
      style={isSecondary ? { opacity: 0.75 } : undefined}
    >
      <Icon name={icon} size={isPrimary ? 20 : 16} title={label} fallback={label[0]} />
      <div className="flex-1" style={pulseStyle}>
        <div className="flex justify-between mb-0.5" style={{ fontSize: isPrimary ? '0.8rem' : '0.7rem' }}>
          <span
            style={{
              color: StoryModeColors.textSecondary,
              fontWeight: isPrimary ? 700 : 400,
              letterSpacing: isPrimary ? '0.05em' : undefined,
            }}
          >
            {label}
          </span>
          <span
            style={{
              color: statusColor,
              fontWeight: isPrimary ? 800 : 700,
              fontSize: isPrimary ? '0.85rem' : undefined,
            }}
          >
            {formatValue()}
          </span>
        </div>
        {percentage !== undefined && (
          <div
            className="rounded-sm overflow-hidden"
            style={{
              height: isPrimary ? '4px' : '3px',
              backgroundColor: StoryModeColors.border,
            }}
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
    'JAN', 'FEB', 'MÄR', 'APR', 'MAI', 'JUN',
    'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DEZ'
  ];

  return (
    <div className="flex items-center gap-4">
      <div className="text-center">
        <div className="text-xs" style={{ color: StoryModeColors.textSecondary }}>
          JAHR
        </div>
        <div
          className="font-bold text-xl"
          style={{ color: StoryModeColors.ministryRed }}
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
          MONAT
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

  const progress = primaryObjective.target > 0 ? (primaryObjective.progress / primaryObjective.target) * 100 : 0;

  return (
    <button
      onClick={onClick}
      className="text-left px-3 py-2 border-2 transition-all hover:brightness-110"
      style={{
        backgroundColor: StoryModeColors.surfaceLight,
        borderColor: StoryModeColors.border,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.35)',
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon name="mission" size={14} title="Aktuelles Ziel" fallback="Z" />
        <span
          className="text-xs font-bold uppercase"
          style={{ color: StoryModeColors.textSecondary }}
        >
          Aktuelles Ziel
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
// SOCIETY STRIP (Gesellschaftswerte B2/P1)
// ============================================

interface SocietyStripProps {
  society: SocietyInfo;
}

/** Eine kompakte Mini-Zeile je Gesellschaftswert: Label · Wert · dünner Balken. */
function SocietyMeter({ label, value, color }: { label: string; value: number; color: string }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="flex items-center gap-1.5" title={`${label}: ${Math.round(value)}%`}>
      <span
        className="uppercase tracking-wide shrink-0"
        style={{ color: StoryModeColors.textMuted, fontSize: '0.55rem', width: 64 }}
      >
        {label}
      </span>
      <div
        className="rounded-sm overflow-hidden shrink-0"
        style={{ width: 48, height: 4, backgroundColor: StoryModeColors.border }}
      >
        <div className="h-full transition-all duration-300" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="tabular-nums" style={{ color: StoryModeColors.textSecondary, fontSize: '0.6rem', width: 26, textAlign: 'right' }}>
        {Math.round(value)}
      </span>
    </div>
  );
}

/** Niedrigschwellige Schnellanzeige des Gesellschafts-Zustands (4 Werte, O3/F3). */
function SocietyStrip({ society }: SocietyStripProps) {
  return (
    <div
      className="px-3 py-2 border-2"
      style={{
        backgroundColor: StoryModeColors.surfaceLight,
        borderColor: StoryModeColors.border,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.35)',
      }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <Icon name="stats" size={12} title="Gesellschaft" fallback="G" />
        <span className="text-xs font-bold uppercase" style={{ color: StoryModeColors.textSecondary }}>
          Gesellschaft
        </span>
      </div>
      <div className="flex flex-col gap-1">
        {/* Vertrauen = Sieg-Mittel; sinkt durch aggressive Operationen. */}
        <SocietyMeter label="Vertrauen" value={society.vertrauen} color={StoryModeColors.agencyBlue} />
        <SocietyMeter label="Polaris." value={society.polarisierung} color={StoryModeColors.ministryRed} />
        <SocietyMeter label="Info-Last" value={society.informationslast} color={StoryModeColors.warning} />
        <SocietyMeter label="Zynismus" value={society.zynismus} color={StoryModeColors.militaryOlive} />
      </div>
    </div>
  );
}

// ============================================
// MAIN STORY HUD COMPONENT
// ============================================

export function StoryHUD({
  resources,
  phase,
  objectives,
  society,
  onEndPhase,
  onOpenMenu,
  onOpenObjectives,
  onHideHud,
}: StoryHUDProps) {
  return (
    <>
      {/* E29: Puls-Keyframe einmalig ins DOM */}
      <style>{HUD_PULSE_STYLE}</style>

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
              icon="budget"
              label="BUDGET"
              value={resources.budget}
              format="currency"
              color={StoryModeColors.warning}
              warningThreshold={20}
              dangerThreshold={10}
            />
            {/* E29: KAPAZITÄT primär — zentrale Spielressource */}
            <ResourceBar
              icon="capacity"
              label="KAPAZITÄT"
              value={resources.capacity}
              maxValue={100}
              color={StoryModeColors.agencyBlue}
              priority="primary"
            />
            {/* E29: RISIKO primär — kritischster Indikator, pulsiert bei ≥70 */}
            <ResourceBar
              icon="risk"
              label="RISIKO"
              value={resources.risk}
              format="percent"
              color={StoryModeColors.militaryOlive}
              warningThreshold={50}
              dangerThreshold={70}
              priority="primary"
            />
            <ResourceBar
              icon="attention"
              label="AUFMERKSAMKEIT"
              value={resources.attention}
              format="percent"
              color={StoryModeColors.danger}
              warningThreshold={60}
              dangerThreshold={80}
            />
            {/* E29: MORALISCHE LAST sekundär — ethischer Indikator, weniger sofort-kritisch */}
            <ResourceBar
              icon="moral"
              label="MORALISCHE LAST"
              value={resources.moralWeight}
              format="number"
              color={StoryModeColors.ministryRed}
              warningThreshold={50}
              dangerThreshold={75}
              priority="secondary"
            />
          </div>

          {/* Right: Actions — kein View-Umschalter mehr (§4.4, Strang 2/2c) */}
          <div className="flex items-center gap-2">
            {onHideHud && (
              <button
                onClick={onHideHud}
                aria-label="HUD ausblenden"
                title="HUD ausblenden (H)"
                className="px-2 py-1.5 border-2 font-bold text-sm transition-all hover:brightness-110"
                style={{ backgroundColor: StoryModeColors.concrete, borderColor: StoryModeColors.borderLight, color: StoryModeColors.textSecondary }}
              >
                ▴ H
              </button>
            )}
            {onOpenMenu && (
              <button
                onClick={onOpenMenu}
                className="px-3 py-1.5 border-2 font-bold text-sm transition-all hover:brightness-110 active:translate-y-0.5"
                style={{
                  backgroundColor: StoryModeColors.concrete,
                  borderColor: StoryModeColors.borderLight,
                  color: StoryModeColors.textPrimary,
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.35)',
                }}
              >
                ☰ MENÜ
              </button>
            )}
            {onEndPhase && (
              <button
                onClick={onEndPhase}
                className="px-4 py-1.5 border-2 font-bold text-sm transition-all hover:brightness-110 active:translate-y-0.5"
                style={{
                  backgroundColor: StoryModeColors.ministryRed,
                  borderColor: StoryModeColors.darkRed,
                  color: '#fff',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.35)',
                }}
              >
                PHASE BEENDEN →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Left: Gesellschaftswerte (B2) + Ziel — gruppiert „Zustand & Auftrag" */}
      <div className="fixed bottom-4 left-4 z-30 flex flex-col gap-2">
        {society && <SocietyStrip society={society} />}
        <ObjectiveTracker
          objectives={objectives}
          onClick={onOpenObjectives}
        />
      </div>
    </>
  );
}

export default StoryHUD;
