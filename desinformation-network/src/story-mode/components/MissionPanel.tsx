import { StoryModeColors } from '../theme';
import { Icon } from './Icon';
import { PixelFrame } from './PixelFrame';
import { SOCIETY_VALUE_META, type StoryPhase, type Objective, type SocietyValueKey } from '../../game-logic/StoryEngineAdapter';
import type { Auftrag } from '../engine/Auftraege';

interface MissionPanelProps {
  isVisible: boolean;
  phase: StoryPhase;
  objectives: Objective[];
  /** T1/#14: aktiver Auftrag — zeigt die Zielrichtung (hoch/runter) je Signatur-Wert. */
  auftrag?: Auftrag;
  /** Aktuelle Gesellschaftswerte (für den Ist-Stand je Signatur-Achse). */
  societyValues?: Partial<Record<SocietyValueKey, number>>;
  /** Aktuelles Vertrauen (aus obj_destabilize) — separate Signatur-Achse. */
  vertrauen?: number;
  onClose: () => void;
  variant?: 'modal' | 'sidebar';
}

export function MissionPanel({
  isVisible,
  phase,
  objectives,
  auftrag,
  societyValues,
  vertrauen,
  onClose,
  variant = 'modal',
}: MissionPanelProps) {
  if (!isVisible) return null;

  const primaryObjectives = objectives.filter(o => o.type === 'primary');
  const secondaryObjectives = objectives.filter(o => o.type === 'secondary');

  const getPhaseDescription = (year: number) => {
    if (year <= 2) return 'GRÜNDUNG - Bauen Sie Ihr Netzwerk auf und etablieren Sie erste Kanäle.';
    if (year <= 4) return 'EXPANSION - Erweitern Sie Ihren Einfluss und rekrutieren Sie Schlüsselfiguren.';
    if (year <= 6) return 'INFILTRATION - Unterwandern Sie Institutionen und verbreiten Sie Narrative.';
    if (year <= 8) return 'ESKALATION - Verstärken Sie die Spaltung und destabilisieren Sie das System.';
    return 'ENDSPIEL - Führen Sie den finalen Schlag aus.';
  };

  const content = (
    <div className={`flex-1 overflow-y-auto ${variant === 'sidebar' ? 'p-3 space-y-3' : 'p-6 space-y-6'}`}>
      {/* Classification Banner */}
      <div
        className="p-4 text-center border-4"
        style={{
          backgroundColor: StoryModeColors.background,
          borderColor: StoryModeColors.ministryRed,
        }}
      >
        <div
          className="text-xs font-bold mb-2"
          style={{ color: StoryModeColors.ministryRed }}
        >
          STRENG GEHEIM - NUR FUR AUTORISIERTES PERSONAL
        </div>
        <div className="text-4xl mb-2">⬢</div>
        <h1
          className="text-2xl font-bold"
          style={{ color: StoryModeColors.warning }}
        >
          OPERATION: WESTUNION
        </h1>
        <div
          className="text-sm mt-2"
          style={{ color: StoryModeColors.textSecondary }}
        >
          Abteilung fur Sonderoperationen
        </div>
      </div>

      {/* Current Phase */}
      <div
        className="border-4 p-4"
        style={{
          backgroundColor: StoryModeColors.darkConcrete,
          borderColor: StoryModeColors.agencyBlue,
        }}
      >
        <div className="flex justify-between items-center mb-3">
          <h3
            className="font-bold"
            style={{ color: StoryModeColors.agencyBlue }}
          >
            AKTUELLE PHASE
          </h3>
          <span
            className="px-3 py-1 font-bold"
            style={{
              backgroundColor: StoryModeColors.agencyBlue,
              color: StoryModeColors.warning,
            }}
          >
            JAHR {phase.year} / MONAT {phase.month}
          </span>
        </div>
        <p style={{ color: StoryModeColors.textPrimary }}>
          {getPhaseDescription(phase.year)}
        </p>
      </div>

      {/* Mission Directive */}
      <div
        className="border-4 p-4"
        style={{
          backgroundColor: StoryModeColors.document,
          borderColor: StoryModeColors.border,
        }}
      >
        <h3
          className="font-bold mb-3"
          style={{ color: StoryModeColors.ministryRed }}
        >
          DIREKTIVE
        </h3>
        <p
          className="mb-4 leading-relaxed"
          style={{ color: StoryModeColors.textPrimary }}
        >
          Sie wurden beauftragt, die demokratischen Institutionen von Westunion
          systematisch zu untergraben. Nutzen Sie Desinformation, soziale Spaltung
          und strategische Manipulation, um das Vertrauen der Bevolkerung in ihre
          Regierung zu zerstoren.
        </p>
        <p style={{ color: StoryModeColors.textSecondary }}>
          Denken Sie daran: Jede Aktion hat Konsequenzen. Handeln Sie klug.
        </p>
      </div>

      {/* T1/#14: Auftrags-Zielrichtung — welche Werte in welche Richtung sollen.
          Ohne das weiß der Spieler nicht, ob ein Barometer hoch oder runter „gut" ist. */}
      {auftrag && (
        <div
          className="border-4 p-4"
          style={{ backgroundColor: StoryModeColors.darkConcrete, borderColor: StoryModeColors.warning }}
        >
          <h3 className="font-bold mb-1 flex items-center gap-2" style={{ color: StoryModeColors.warning }}>
            <Icon name="mission" size={16} title="Auftrag" fallback="◎" /> AUFTRAG: {auftrag.titel_de.toUpperCase()}
          </h3>
          <div className="text-xs mb-3" style={{ color: StoryModeColors.textMuted }}>
            {auftrag.instrument_de} — diese Werte sollst du bewegen:
          </div>
          <div className="space-y-3">
            {auftrag.signatur.map((s) => {
              const cur = s.wert === 'vertrauen' ? vertrauen ?? s.start : societyValues?.[s.wert] ?? s.start;
              const label = s.wert === 'vertrauen' ? 'Vertrauen' : SOCIETY_VALUE_META[s.wert].label_de;
              const reached = s.richtung === 'hoch' ? cur >= s.ziel : cur <= s.ziel;
              const prog =
                s.richtung === 'hoch'
                  ? (cur - s.start) / Math.max(1, s.ziel - s.start)
                  : (s.start - cur) / Math.max(1, s.start - s.ziel);
              const pct = Math.max(0, Math.min(1, prog)) * 100;
              return (
                <div key={s.wert}>
                  <div className="flex justify-between text-sm mb-1">
                    <span style={{ color: StoryModeColors.textPrimary }}>
                      {s.richtung === 'hoch' ? '▲' : '▼'} {label}
                      <span style={{ color: StoryModeColors.textMuted }}>
                        {' '}
                        — {s.richtung === 'hoch' ? 'hochtreiben' : 'drücken'}
                      </span>
                    </span>
                    <span style={{ color: reached ? StoryModeColors.success : StoryModeColors.textSecondary }}>
                      {reached ? '✓ ' : ''}
                      jetzt {Math.round(cur)} → Ziel {s.ziel}
                    </span>
                  </div>
                  <div className="h-2 w-full" style={{ backgroundColor: StoryModeColors.border }}>
                    <div
                      className="h-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: reached ? StoryModeColors.success : StoryModeColors.warning }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Primary Objectives */}
      <div
        className="border-4 p-4"
        style={{
          backgroundColor: StoryModeColors.darkConcrete,
          borderColor: StoryModeColors.ministryRed,
        }}
      >
        <h3
          className="font-bold mb-4 flex items-center gap-2"
          style={{ color: StoryModeColors.ministryRed }}
        >
          <Icon name="mission" size={16} title="Hauptziele" fallback="*" /> HAUPTZIELE
        </h3>
        <div className="space-y-3">
          {primaryObjectives.map(obj => (
            <div
              key={obj.id}
              className="flex items-start gap-3 p-3"
              style={{
                backgroundColor: obj.completed
                  ? 'rgba(75, 181, 67, 0.2)'
                  : StoryModeColors.background,
                border: `2px solid ${
                  obj.completed ? StoryModeColors.success : StoryModeColors.border
                }`,
              }}
            >
              <span
                className="text-lg"
                style={{
                  color: obj.completed
                    ? StoryModeColors.success
                    : StoryModeColors.textMuted,
                }}
              >
                {obj.completed ? '✓' : '○'}
              </span>
              <div className="flex-1">
                <div
                  className="font-bold"
                  style={{
                    color: obj.completed
                      ? StoryModeColors.success
                      : StoryModeColors.textPrimary,
                  }}
                >
                  {obj.label_de}
                </div>
                <div
                  className="text-sm mt-1"
                  style={{ color: StoryModeColors.textSecondary }}
                >
                  Fortschritt: {obj.currentValue} / {obj.targetValue}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Secondary Objectives */}
      {secondaryObjectives.length > 0 && (
        <div
          className="border-4 p-4"
          style={{
            backgroundColor: StoryModeColors.darkConcrete,
            borderColor: StoryModeColors.militaryOlive,
          }}
        >
          <h3
            className="font-bold mb-4 flex items-center gap-2"
            style={{ color: StoryModeColors.militaryOlive }}
          >
            <Icon name="mission" size={16} title="Nebenziele" fallback="-" /> NEBENZIELE
          </h3>
          <div className="space-y-2">
            {secondaryObjectives.map(obj => (
              <div
                key={obj.id}
                className="flex items-center gap-3 p-2"
                style={{
                  backgroundColor: StoryModeColors.background,
                  border: `1px solid ${StoryModeColors.border}`,
                }}
              >
                <span
                  className="text-sm"
                  style={{
                    color: obj.completed
                      ? StoryModeColors.success
                      : StoryModeColors.textMuted,
                  }}
                >
                  {obj.completed ? '✓' : '○'}
                </span>
                <span
                  className="text-sm"
                  style={{
                    color: obj.completed
                      ? StoryModeColors.success
                      : StoryModeColors.textSecondary,
                  }}
                >
                  {obj.label_de}
                </span>
                <span
                  className="text-xs ml-auto"
                  style={{ color: StoryModeColors.textMuted }}
                >
                  {obj.currentValue}/{obj.targetValue}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warning */}
      <div
        className="border-4 p-4 text-center"
        style={{
          backgroundColor: 'rgba(255, 71, 71, 0.1)',
          borderColor: StoryModeColors.danger,
        }}
      >
        <div
          className="text-sm font-bold flex items-center justify-center gap-2"
          style={{ color: StoryModeColors.danger }}
        >
          <Icon name="risk" size={14} title="Warnung" fallback="!" /> WARNUNG
        </div>
        <p
          className="text-sm mt-2"
          style={{ color: StoryModeColors.textSecondary }}
        >
          Dieses Spiel dient Bildungszwecken. Es zeigt die Taktiken,
          die von staatlichen Akteuren zur Destabilisierung demokratischer
          Gesellschaften eingesetzt werden.
        </p>
      </div>
    </div>
  );

  if (variant === 'sidebar') {
    return (
      <div className="flex flex-col h-full" style={{ backgroundColor: StoryModeColors.surface }}>
        {/* Compact Header */}
        <div
          className="px-3 py-2 border-b-2 flex items-center gap-2"
          style={{
            backgroundColor: StoryModeColors.ministryRed,
            borderColor: StoryModeColors.border,
          }}
        >
          <Icon name="mission" size={16} title="Mission" fallback="M" />
          <h2 className="font-bold text-sm" style={{ color: StoryModeColors.warning }}>
            MISSION BRIEFING
          </h2>
        </div>

        {content}
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
      onClick={onClose}
    >
      <PixelFrame
        variant="alarm"
        className="w-full max-w-2xl max-h-[85vh] mx-4 flex flex-col overflow-hidden"
        style={{
          border: `3px solid ${StoryModeColors.ministryRed}`,
        }}
      >
        <div
          className="flex flex-col max-h-[85vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="px-6 py-4 border-b-4 flex justify-between items-center"
            style={{
              backgroundColor: StoryModeColors.ministryRed,
              borderColor: StoryModeColors.border,
            }}
          >
            <div className="flex items-center gap-3">
              <Icon name="mission" size={24} title="Mission" fallback="M" />
              <h2 className="font-bold text-xl" style={{ color: StoryModeColors.warning }}>
                MISSION BRIEFING
              </h2>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-1 font-bold border-2 transition-all hover:brightness-110"
              style={{
                backgroundColor: StoryModeColors.darkConcrete,
                borderColor: StoryModeColors.border,
                color: StoryModeColors.textPrimary,
              }}
            >
              SCHLIESSEN [ESC]
            </button>
          </div>

          {content}

          {/* Footer */}
          <div
            className="px-6 py-3 border-t-4 flex justify-between text-xs"
            style={{
              backgroundColor: StoryModeColors.darkConcrete,
              borderColor: StoryModeColors.border,
              color: StoryModeColors.textMuted,
            }}
          >
            <span>Dokument: OP-WU-{phase.year.toString().padStart(2, '0')}{phase.month.toString().padStart(2, '0')}</span>
            <span>Freigabestufe: GAMMA</span>
          </div>
        </div>
      </PixelFrame>
    </div>
  );
}

export default MissionPanel;
