import { StoryModeColors, stampCtaStyle } from '../theme';
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
  year: number;    // DEPRECATED (Etappe 2: Kampagnen-Uhr) — konstant 1
  month: number;   // DEPRECATED — konstant 1
  /** Wahltag (Ziellinie); Etappe 2 „Die Uhr". */
  electionDay?: number;
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
  /** P5: Titel des laufenden strategischen Auftrags („Vertrauen = Mittel, Auftrag = Ziel"). */
  auftragTitel?: string;
}

/** Etappe 3 Paket A: Stufen-Marken + bereits gezündete Stufen (`engine.getAbwehrStageInfo()`). */
export interface AbwehrStageInfo {
  stages: readonly number[];
  fired: number[];
}

/** Etappe 5 (Zielbild §6): der eigene Läufer — die Sonntagsfrage (% mit Zielstrich). */
export interface SonntagsfrageInfo {
  /** Umfragewert der Partei (%, diegetisches Gesicht von auftragProgress). */
  pollPct: number;
  /** Machtwechsel-Schwelle (%, = WIN_THRESHOLD in derselben Abbildung). */
  thresholdPct: number;
  /** Titel des laufenden Auftrags („Die Wahl"). */
  auftragTitel?: string;
}

interface StoryHUDProps {
  resources: StoryResources;
  phase: StoryPhaseInfo;
  objectives: ObjectiveInfo[];
  /** DEPRECATED (Etappe 5, §6): die 8 Gesellschaftswerte verschwinden als HUD-Anzeige
   *  (Wohnzimmer-Alphabet ersetzt sie). Prop bleibt optional für Rückwärts-Kompatibilität. */
  society?: SocietyInfo;
  /** Etappe 5: der eigene Rennläufer — die Sonntagsfrage (Zielbild §6, HUD-Größe 1). */
  sonntagsfrage?: SonntagsfrageInfo;
  /** Etappe 3 Paket D: der zweite Rennläufer — ABWEHR 0–100 (befördertes wehrhaftigkeit). */
  abwehr?: number;
  /** Stufen-Marken 25/50/75 + bereits gezündete Stufen fürs Balken-Overlay. */
  abwehrStageInfo?: AbwehrStageInfo;
  /** Etappe 5: SITUATIVE Ermittler-Countdown-Warnung (nur wenn eine Untersuchung läuft, §12.4). */
  exposureCountdown?: number | null;
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
        // B23: symbolfrei („150K") — kein „$" in der fiktiven Ost-Block-Welt.
        return `${value}K`;
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
            className="overflow-hidden"
            style={{
              height: isPrimary ? '4px' : '3px',
              backgroundColor: StoryModeColors.oldPaper,
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
// ABWEHR BAR (Etappe 3 Paket D — der zweite Rennläufer)
// ============================================

interface AbwehrBarProps {
  value: number;
  stageInfo: AbwehrStageInfo;
}

/**
 * Der Gegner-Balken: ABWEHR 0–100 mit Stufen-Kerben bei 25/50/75 (gezündet = hell).
 * Nüchtern-bedrohlich statt spielerisch: Rot/Orange, kein Grün — das ist der Läufer,
 * der uns einholt, nicht unser eigener Fortschritt (Zielbild §3 Läufer 2).
 */
function AbwehrBar({ value, stageInfo }: AbwehrBarProps) {
  const pct = Math.max(0, Math.min(100, value));
  // Kritisch = auf/über der höchsten Stufe (Task-Force-Niveau) → dezenter Puls.
  const topStage = stageInfo.stages[stageInfo.stages.length - 1];
  const isCritical = topStage !== undefined && pct >= topStage;
  const pulseStyle: React.CSSProperties = isCritical
    ? { animation: 'hud-risk-pulse 1.2s ease-in-out infinite' }
    : {};

  return (
    <div className="flex items-center gap-2" data-testid="abwehr-bar">
      <Icon name="risk" size={20} title="ABWEHR — die Gegenseite holt auf" fallback="A" />
      <div className="flex-1" style={pulseStyle}>
        <div className="flex justify-between mb-0.5" style={{ fontSize: '0.8rem' }}>
          <span
            style={{
              color: StoryModeColors.textSecondary,
              fontWeight: 700,
              letterSpacing: '0.05em',
            }}
          >
            ABWEHR
          </span>
          <span style={{ color: StoryModeColors.danger, fontWeight: 800, fontSize: '0.85rem' }}>
            {Math.round(pct)}
          </span>
        </div>
        <div className="relative" style={{ height: '4px' }}>
          <div
            className="overflow-hidden h-full"
            style={{ backgroundColor: StoryModeColors.oldPaper }}
          >
            <div
              className="h-full transition-all duration-300"
              style={{ width: `${pct}%`, backgroundColor: StoryModeColors.danger }}
            />
          </div>
          {/* Stufen-Marken: kleine Kerben im Balken, gezündete Stufen hell hervorgehoben. */}
          {stageInfo.stages.map((stage) => {
            const fired = stageInfo.fired.includes(stage);
            return (
              <div
                key={stage}
                data-testid={`abwehr-stage-mark-${stage}`}
                title={`Stufe ${stage}${fired ? ' — gezündet' : ''}`}
                className="absolute"
                style={{
                  left: `${stage}%`,
                  top: '-1px',
                  bottom: '-1px',
                  width: '2px',
                  // „gezündet = hell": textPrimary ist seit v3 Tinte (dunkel) — auf dem
                  // dunklen Balken-Träger muss die Kerbe Papier-hell sein (§4.7 Regel 2).
                  backgroundColor: fired ? StoryModeColors.document : 'rgba(0,0,0,0.55)',
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================
// SONNTAGSFRAGE BAR (Etappe 5 — der eigene Läufer, Zielbild §6)
// ============================================

/**
 * Der eigene Balken: die Sonntagsfrage (Umfragewert der Partei) mit ZIELSTRICH an der
 * Machtwechsel-Schwelle. Das diegetische Gesicht von auftragProgress — jeder versteht
 * eine Umfrage ohne ein Wort Erklärung (Zielbild §3). Rot wie die eigene Sache; der
 * Balken wächst Richtung Schwelle, der Zielstrich zeigt, wie weit noch fehlt.
 */
function SonntagsfrageBar({ info }: { info: SonntagsfrageInfo }) {
  // Skala bis knapp über die Schwelle, damit der Zielstrich nicht am Rand klebt.
  const scaleMax = Math.max(info.pollPct, info.thresholdPct) + 6;
  const barPct = Math.min(100, (info.pollPct / scaleMax) * 100);
  const linePct = Math.min(100, (info.thresholdPct / scaleMax) * 100);
  const reached = info.pollPct >= info.thresholdPct;
  return (
    <div className="flex items-center gap-2" data-testid="sonntagsfrage-bar">
      <Icon name="mission" size={20} title="SONNTAGSFRAGE — Ihr Umfragewert" fallback="S" />
      <div className="flex-1" style={{ minWidth: 96 }}>
        <div className="flex justify-between mb-0.5" style={{ fontSize: '0.8rem' }}>
          <span style={{ color: StoryModeColors.textSecondary, fontWeight: 700, letterSpacing: '0.05em' }}>
            SONNTAGSFRAGE
          </span>
          <span style={{ color: StoryModeColors.warning, fontWeight: 800, fontSize: '0.85rem' }}>
            {info.pollPct.toFixed(1)}%
          </span>
        </div>
        <div className="relative" style={{ height: '4px' }}>
          <div className="overflow-hidden h-full" style={{ backgroundColor: StoryModeColors.oldPaper }}>
            <div
              className="h-full transition-all duration-300"
              style={{ width: `${barPct}%`, backgroundColor: reached ? StoryModeColors.success : StoryModeColors.ministryRed }}
            />
          </div>
          {/* Zielstrich = Machtwechsel-Schwelle. */}
          <div
            data-testid="sonntagsfrage-schwelle"
            title="Machtwechsel-Schwelle"
            className="absolute"
            style={{ left: `${linePct}%`, top: '-2px', bottom: '-2px', width: '2px', backgroundColor: StoryModeColors.warning }}
          />
        </div>
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
  // Etappe 2 „Die Uhr": Kampagnen-Countdown statt Jahr/Monat-Kalender.
  const daysLeft = Math.max(0, (phase.electionDay ?? 40) - phase.current);

  return (
    <div className="flex items-center gap-3">
      {/* Kampagnen-Uhr (sekundär): Tag X + Countdown zum Wahltag als EIN Kontext. */}
      <div className="text-center">
        <div className="text-[10px]" style={{ color: StoryModeColors.textSecondary }}>
          TAG {phase.current}
        </div>
        {/* Papier-Ton wäre auf der hellen HUD-Leiste unsichtbar → Tinte (§4.7 Regel 1). */}
        <div className="font-bold text-sm" style={{ color: StoryModeColors.textPrimary }}>
          {daysLeft === 0 ? 'WAHLTAG' : `WAHL IN ${daysLeft} T.`}
        </div>
      </div>
      <div
        className="h-8 w-0.5"
        style={{ backgroundColor: StoryModeColors.borderLight }}
      />
      {/* AP (primär) — die heute verfügbaren Aktionen; der eigentliche Zug-Takt. */}
      <div className="text-center">
        <div className="text-[10px]" style={{ color: StoryModeColors.textSecondary }}>
          AKTIONEN HEUTE
        </div>
        <div
          className="font-bold text-2xl"
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

  // B22: `progress` ist bereits der richtungs-bewusste Engine-Prozentwert (0–100).
  const progress = Math.max(0, Math.min(100, primaryObjective.progress));

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
        className="h-1 mt-1 overflow-hidden"
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

// (Etappe 5, §6: Der frühere „SocietyStrip" — 4 Gesellschaftswerte im HUD — ist entfallen.
//  Die Gesellschaft zeigt sich als Bild, nie als Balken: das Wohnzimmer-Alphabet.)

// ============================================
// MAIN STORY HUD COMPONENT
// ============================================

export function StoryHUD({
  resources,
  phase,
  objectives,
  sonntagsfrage,
  abwehr,
  abwehrStageInfo,
  exposureCountdown,
  onEndPhase,
  onOpenMenu,
  onOpenObjectives,
  onHideHud,
}: StoryHUDProps) {
  return (
    <>
      {/* E29: Puls-Keyframe einmalig ins DOM */}
      <style>{HUD_PULSE_STYLE}</style>

      {/* Top Bar — Papierfläche (§4.7: auch der Spiel-UI-Rand ist aus Papier);
          die Tinten-Labels und Akzent-Werte bleiben darauf lesbar. */}
      <div
        className="fixed top-0 left-0 right-0 z-40 border-b-4"
        style={{
          backgroundColor: StoryModeColors.surface,
          borderColor: StoryModeColors.border,
        }}
      >
        <div className="flex items-center justify-between px-4 py-2">
          {/* Left: Phase Info */}
          <PhaseDisplay phase={phase} />

          {/* Center: die vier Größen (Zielbild §6) — SONNTAGSFRAGE · ABWEHR · KASSE · (TAG links).
              Risiko/Aufmerksamkeit sind keine eigenen Anzeigen mehr (nur noch Abwehr-Zuflüsse, §12.4);
              die 8 Gesellschaftswerte zeigt das Wohnzimmer-Alphabet, nicht der HUD. */}
          <div className="flex items-center gap-6">
            {/* Läufer 1 — die Sonntagsfrage (unser Fortschritt). */}
            {sonntagsfrage && <SonntagsfrageBar info={sonntagsfrage} />}
            {/* Läufer 2 — die ABWEHR (das Immunsystem holt auf). */}
            {abwehr !== undefined && abwehrStageInfo && (
              <>
                <div className="h-8 w-0.5" style={{ backgroundColor: StoryModeColors.borderLight }} />
                <AbwehrBar value={abwehr} stageInfo={abwehrStageInfo} />
              </>
            )}
            <div className="h-8 w-0.5" style={{ backgroundColor: StoryModeColors.borderLight }} />
            {/* KASSE — die Zentrale zahlt in Tranchen (E18); Warnfarben ab knapper Kasse. */}
            <ResourceBar
              icon="budget"
              label="KASSE"
              value={resources.budget}
              format="currency"
              color={StoryModeColors.warning}
              warningThreshold={20}
              dangerThreshold={10}
            />
            {/* SITUATIVE Ermittler-Countdown-Warnung — nur wenn eine Untersuchung läuft (§12.4). */}
            {exposureCountdown !== null && exposureCountdown !== undefined && (
              <div
                data-testid="exposure-warning"
                title="Eine Untersuchung läuft — der Countdown bis zur Enttarnung"
                className="flex items-center gap-1 px-2 py-1 border-2"
                style={{
                  borderColor: StoryModeColors.danger,
                  color: StoryModeColors.danger,
                  fontWeight: 900,
                  fontSize: '0.75rem',
                  letterSpacing: '0.05em',
                  animation: 'hud-risk-pulse 1.2s ease-in-out infinite',
                }}
              >
                ⚠ ENTTARNUNG IN {Math.max(0, exposureCountdown)} T.
              </div>
            )}
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
                className="px-4 py-1.5 font-bold text-sm transition-all hover:brightness-95 active:translate-y-0.5"
                style={stampCtaStyle}
              >
                PHASE BEENDEN →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Left: das laufende Ziel (die Akte). Die 8 Gesellschaftswerte sind aus dem
          HUD verschwunden (Zielbild §6) — das Wohnzimmer-Alphabet zeigt die Gesellschaft. */}
      <div className="fixed bottom-4 left-4 z-30 flex flex-col gap-2">
        <ObjectiveTracker
          objectives={objectives}
          onClick={onOpenObjectives}
        />
      </div>
    </>
  );
}

export default StoryHUD;
