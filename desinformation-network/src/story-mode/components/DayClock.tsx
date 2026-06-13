import { StoryModeColors } from '../theme';
import { useDayClockStore, clockLabel, isAfterWarn } from '../stores/dayClockStore';
import { Icon } from './Icon';

// ============================================
// DAY CLOCK (K1) — kleine HUD-Uhr im Pixel/Brutalist-Stil
// ============================================
// Zeigt die Tages-Uhr aus dem dayClockStore. Ab 17:00 warnend mit dezentem
// Puls (Muster wie hud-risk-pulse in StoryHUD), nach 18:00 "FEIERABEND".

// Eigener Puls-Keyframe (analog StoryHUD), einmalig injiziert.
const CLOCK_PULSE_STYLE = `
  @keyframes day-clock-pulse {
    0%, 100% { opacity: 1; }
    50%      { opacity: 0.6; }
  }
`;

export function DayClock() {
  const minutes = useDayClockStore((s) => s.minutes);
  const dayEnded = useDayClockStore((s) => s.dayEnded);

  const warning = isAfterWarn(minutes);
  // Tagesende > Warnung > normal — Farbe und Text richten sich danach.
  const color = dayEnded
    ? StoryModeColors.danger
    : warning
      ? StoryModeColors.warning
      : StoryModeColors.textPrimary;

  // Dezenter Puls erst ab 17:00 (Redaktionsschluss-Druck).
  const pulse: React.CSSProperties = warning
    ? { animation: 'day-clock-pulse 1.4s ease-in-out infinite' }
    : {};

  return (
    <>
      <style>{CLOCK_PULSE_STYLE}</style>
      <div
        className="flex items-center gap-2 px-3 py-1.5 border-2 font-bold font-mono"
        style={{
          backgroundColor: StoryModeColors.darkConcrete,
          borderColor: StoryModeColors.border,
          color,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.35)',
          ...pulse,
        }}
        title="Arbeitstag 09:00–18:00 — Handlungen kosten Zeit"
      >
        <Icon name="clock" size={16} title="Uhr" fallback="[T]" />
        <span className="text-sm tracking-wider">
          {dayEnded ? 'FEIERABEND' : clockLabel(minutes)}
        </span>
      </div>
    </>
  );
}

export default DayClock;
