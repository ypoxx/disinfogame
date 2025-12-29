import { StoryModeColors } from '../theme';
import type { StoryPhase, Objective } from '../../game-logic/StoryEngineAdapter';

interface MissionPanelProps {
  isVisible: boolean;
  phase: StoryPhase;
  objectives: Objective[];
  onClose: () => void;
}

export function MissionPanel({
  isVisible,
  phase,
  objectives,
  onClose,
}: MissionPanelProps) {
  if (!isVisible) return null;

  const primaryObjectives = objectives.filter(o => o.type === 'primary');
  const secondaryObjectives = objectives.filter(o => o.type === 'secondary');

  const getPhaseDescription = (year: number) => {
    if (year <= 2) return 'GRUNDUNG - Bauen Sie Ihr Netzwerk auf und etablieren Sie erste Kanale.';
    if (year <= 4) return 'EXPANSION - Erweitern Sie Ihren Einfluss und rekrutieren Sie Schlusselfiguren.';
    if (year <= 6) return 'INFILTRATION - Unterwandern Sie Institutionen und verbreiten Sie Narrative.';
    if (year <= 8) return 'ESKALATION - Verstarken Sie die Spaltung und destabilisieren Sie das System.';
    return 'ENDSPIEL - Fuhren Sie den finalen Schlag aus.';
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 animate-fade-in"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] mx-4 border-4 flex flex-col overflow-hidden"
        style={{
          backgroundColor: StoryModeColors.surface,
          borderColor: StoryModeColors.sovietRed,
          boxShadow: '12px 12px 0px 0px rgba(0,0,0,0.9)',
          animation: 'story-modal-appear 0.3s ease-out',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b-4 flex justify-between items-center"
          style={{
            backgroundColor: StoryModeColors.sovietRed,
            borderColor: StoryModeColors.border,
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">📁</span>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Classification Banner */}
          <div
            className="p-4 text-center border-4"
            style={{
              backgroundColor: StoryModeColors.background,
              borderColor: StoryModeColors.sovietRed,
            }}
          >
            <div
              className="text-xs font-bold mb-2"
              style={{ color: StoryModeColors.sovietRed }}
            >
              STRENG GEHEIM - NUR FUR AUTORISIERTES PERSONAL
            </div>
            <div className="text-4xl mb-2">☭</div>
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
              style={{ color: StoryModeColors.sovietRed }}
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

          {/* Primary Objectives */}
          <div
            className="border-4 p-4"
            style={{
              backgroundColor: StoryModeColors.darkConcrete,
              borderColor: StoryModeColors.sovietRed,
            }}
          >
            <h3
              className="font-bold mb-4 flex items-center gap-2"
              style={{ color: StoryModeColors.sovietRed }}
            >
              <span>⭐</span> HAUPTZIELE
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
                <span>◇</span> NEBENZIELE
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
              className="text-sm font-bold"
              style={{ color: StoryModeColors.danger }}
            >
              ⚠️ WARNUNG
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
    </div>
  );
}

export default MissionPanel;
