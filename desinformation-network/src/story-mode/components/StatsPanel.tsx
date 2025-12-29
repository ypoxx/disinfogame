import { StoryModeColors } from '../theme';
import type { StoryResources, StoryPhase, Objective } from '../../game-logic/StoryEngineAdapter';

interface StatsPanelProps {
  isVisible: boolean;
  resources: StoryResources;
  phase: StoryPhase;
  objectives: Objective[];
  onClose: () => void;
}

export function StatsPanel({
  isVisible,
  resources,
  phase,
  objectives,
  onClose,
}: StatsPanelProps) {
  if (!isVisible) return null;

  const primaryObjectives = objectives.filter(o => o.type === 'primary');
  const secondaryObjectives = objectives.filter(o => o.type === 'secondary');

  const getProgressColor = (current: number, target: number) => {
    const progress = current / target;
    if (progress >= 1) return StoryModeColors.success;
    if (progress >= 0.7) return StoryModeColors.warning;
    if (progress >= 0.4) return StoryModeColors.agencyBlue;
    return StoryModeColors.danger;
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[85vh] mx-4 border-4 flex flex-col overflow-hidden"
        style={{
          backgroundColor: StoryModeColors.surface,
          borderColor: StoryModeColors.agencyBlue,
          boxShadow: '12px 12px 0px 0px rgba(0,0,0,0.9)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b-4 flex justify-between items-center"
          style={{
            backgroundColor: StoryModeColors.agencyBlue,
            borderColor: StoryModeColors.border,
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">📺</span>
            <h2 className="font-bold text-xl" style={{ color: StoryModeColors.warning }}>
              KAMPAGNEN-STATISTIK
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
          {/* Phase Info */}
          <div
            className="border-4 p-4"
            style={{
              backgroundColor: StoryModeColors.darkConcrete,
              borderColor: StoryModeColors.border,
            }}
          >
            <h3
              className="font-bold mb-3 text-lg"
              style={{ color: StoryModeColors.sovietRed }}
            >
              AKTUELLER STATUS
            </h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div
                  className="text-3xl font-bold"
                  style={{ color: StoryModeColors.sovietRed }}
                >
                  {phase.year}
                </div>
                <div className="text-xs" style={{ color: StoryModeColors.textMuted }}>
                  JAHR
                </div>
              </div>
              <div className="text-center">
                <div
                  className="text-3xl font-bold"
                  style={{ color: StoryModeColors.warning }}
                >
                  {phase.month}
                </div>
                <div className="text-xs" style={{ color: StoryModeColors.textMuted }}>
                  MONAT
                </div>
              </div>
              <div className="text-center">
                <div
                  className="text-3xl font-bold"
                  style={{ color: StoryModeColors.agencyBlue }}
                >
                  {phase.number}
                </div>
                <div className="text-xs" style={{ color: StoryModeColors.textMuted }}>
                  PHASE
                </div>
              </div>
              <div className="text-center">
                <div
                  className="text-3xl font-bold"
                  style={{ color: StoryModeColors.success }}
                >
                  {resources.actionPointsRemaining}/{resources.actionPointsMax}
                </div>
                <div className="text-xs" style={{ color: StoryModeColors.textMuted }}>
                  AP
                </div>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div
            className="border-4 p-4"
            style={{
              backgroundColor: StoryModeColors.darkConcrete,
              borderColor: StoryModeColors.border,
            }}
          >
            <h3
              className="font-bold mb-4 text-lg"
              style={{ color: StoryModeColors.warning }}
            >
              RESSOURCEN
            </h3>
            <div className="space-y-4">
              {/* Budget */}
              <div>
                <div className="flex justify-between mb-1">
                  <span style={{ color: StoryModeColors.textSecondary }}>
                    💰 BUDGET
                  </span>
                  <span
                    className="font-bold"
                    style={{ color: StoryModeColors.warning }}
                  >
                    ${resources.budget}K
                  </span>
                </div>
                <div
                  className="h-4 w-full"
                  style={{ backgroundColor: StoryModeColors.background }}
                >
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${Math.min(resources.budget, 100)}%`,
                      backgroundColor: StoryModeColors.warning,
                    }}
                  />
                </div>
              </div>

              {/* Capacity */}
              <div>
                <div className="flex justify-between mb-1">
                  <span style={{ color: StoryModeColors.textSecondary }}>
                    ⚡ KAPAZITAT
                  </span>
                  <span
                    className="font-bold"
                    style={{ color: StoryModeColors.agencyBlue }}
                  >
                    {resources.capacity}
                  </span>
                </div>
                <div
                  className="h-4 w-full"
                  style={{ backgroundColor: StoryModeColors.background }}
                >
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${Math.min(resources.capacity * 10, 100)}%`,
                      backgroundColor: StoryModeColors.agencyBlue,
                    }}
                  />
                </div>
              </div>

              {/* Risk */}
              <div>
                <div className="flex justify-between mb-1">
                  <span style={{ color: StoryModeColors.textSecondary }}>
                    ⚠️ RISIKO
                  </span>
                  <span
                    className="font-bold"
                    style={{
                      color: resources.risk > 70
                        ? StoryModeColors.danger
                        : resources.risk > 40
                        ? StoryModeColors.warning
                        : StoryModeColors.success,
                    }}
                  >
                    {resources.risk}%
                  </span>
                </div>
                <div
                  className="h-4 w-full"
                  style={{ backgroundColor: StoryModeColors.background }}
                >
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${resources.risk}%`,
                      backgroundColor:
                        resources.risk > 70
                          ? StoryModeColors.danger
                          : resources.risk > 40
                          ? StoryModeColors.warning
                          : StoryModeColors.success,
                    }}
                  />
                </div>
              </div>

              {/* Attention */}
              <div>
                <div className="flex justify-between mb-1">
                  <span style={{ color: StoryModeColors.textSecondary }}>
                    👁️ AUFMERKSAMKEIT
                  </span>
                  <span
                    className="font-bold"
                    style={{
                      color: resources.attention > 70
                        ? StoryModeColors.danger
                        : StoryModeColors.textPrimary,
                    }}
                  >
                    {resources.attention}%
                  </span>
                </div>
                <div
                  className="h-4 w-full"
                  style={{ backgroundColor: StoryModeColors.background }}
                >
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${resources.attention}%`,
                      backgroundColor:
                        resources.attention > 70
                          ? StoryModeColors.danger
                          : StoryModeColors.militaryOlive,
                    }}
                  />
                </div>
              </div>

              {/* Moral Weight */}
              <div>
                <div className="flex justify-between mb-1">
                  <span style={{ color: StoryModeColors.textSecondary }}>
                    💀 MORALISCHE LAST
                  </span>
                  <span
                    className="font-bold"
                    style={{ color: StoryModeColors.sovietRed }}
                  >
                    {resources.moralWeight}
                  </span>
                </div>
                <div
                  className="h-4 w-full"
                  style={{ backgroundColor: StoryModeColors.background }}
                >
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${Math.min(resources.moralWeight, 100)}%`,
                      backgroundColor: StoryModeColors.sovietRed,
                    }}
                  />
                </div>
              </div>
            </div>
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
              className="font-bold mb-4 text-lg"
              style={{ color: StoryModeColors.sovietRed }}
            >
              ☭ HAUPTZIELE
            </h3>
            <div className="space-y-3">
              {primaryObjectives.map(obj => (
                <div key={obj.id}>
                  <div className="flex justify-between mb-1">
                    <span
                      className="flex items-center gap-2"
                      style={{
                        color: obj.completed
                          ? StoryModeColors.success
                          : StoryModeColors.textPrimary,
                      }}
                    >
                      {obj.completed ? '✓' : '○'} {obj.label_de}
                    </span>
                    <span
                      className="font-bold"
                      style={{
                        color: getProgressColor(obj.currentValue, obj.targetValue),
                      }}
                    >
                      {obj.currentValue} / {obj.targetValue}
                    </span>
                  </div>
                  <div
                    className="h-3 w-full"
                    style={{ backgroundColor: StoryModeColors.background }}
                  >
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${Math.min((obj.currentValue / obj.targetValue) * 100, 100)}%`,
                        backgroundColor: getProgressColor(obj.currentValue, obj.targetValue),
                      }}
                    />
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
                className="font-bold mb-4 text-lg"
                style={{ color: StoryModeColors.militaryOlive }}
              >
                NEBENZIELE
              </h3>
              <div className="space-y-3">
                {secondaryObjectives.map(obj => (
                  <div key={obj.id}>
                    <div className="flex justify-between mb-1">
                      <span
                        className="flex items-center gap-2"
                        style={{
                          color: obj.completed
                            ? StoryModeColors.success
                            : StoryModeColors.textSecondary,
                        }}
                      >
                        {obj.completed ? '✓' : '○'} {obj.label_de}
                      </span>
                      <span
                        className="font-bold"
                        style={{
                          color: getProgressColor(obj.currentValue, obj.targetValue),
                        }}
                      >
                        {obj.currentValue} / {obj.targetValue}
                      </span>
                    </div>
                    <div
                      className="h-2 w-full"
                      style={{ backgroundColor: StoryModeColors.background }}
                    >
                      <div
                        className="h-full transition-all"
                        style={{
                          width: `${Math.min((obj.currentValue / obj.targetValue) * 100, 100)}%`,
                          backgroundColor: getProgressColor(obj.currentValue, obj.targetValue),
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-6 py-3 border-t-4 text-xs text-center"
          style={{
            backgroundColor: StoryModeColors.darkConcrete,
            borderColor: StoryModeColors.border,
            color: StoryModeColors.textMuted,
          }}
        >
          Verbleibende Zeit: {10 - phase.year} Jahre, {12 - phase.month} Monate
        </div>
      </div>
    </div>
  );
}

export default StatsPanel;
