import { StoryModeColors, scrim } from '../theme';
import { Icon } from './Icon';
import type { StoryResources, StoryPhase, Objective } from '../../game-logic/StoryEngineAdapter';

interface StatsPanelProps {
  isVisible: boolean;
  resources: StoryResources;
  phase: StoryPhase;
  objectives: Objective[];
  onClose: () => void;
  variant?: 'modal' | 'sidebar';
}

export function StatsPanel({
  isVisible,
  resources,
  phase,
  objectives,
  onClose,
  variant = 'modal',
}: StatsPanelProps) {
  if (!isVisible) return null;

  const primaryObjectives = objectives.filter(o => o.type === 'primary');
  const secondaryObjectives = objectives.filter(o => o.type === 'secondary');

  // B22: Farbe/Balken hängen am richtungs-bewussten Engine-Fortschritt (0–100) —
  // der alte Quotient current/target war beim Senk-Ziel (100→40) ab Start „voll".
  const getProgressColor = (progressPct: number) => {
    if (progressPct >= 100) return StoryModeColors.success;
    if (progressPct >= 70) return StoryModeColors.warning;
    if (progressPct >= 40) return StoryModeColors.agencyBlue;
    return StoryModeColors.danger;
  };
  const progressPct = (obj: { progress: number }) => Math.max(0, Math.min(100, obj.progress));
  // Ziel-Beschriftung je Kategorie: Senk-Ziel zeigt Stand+Marke, Halte-Ziel nur die Marke
  // (obj_survive führt kein lebendes currentValue — „jetzt 0" wäre erfunden).
  const zielText = (obj: { category?: string; currentValue: number; targetValue: number }) =>
    obj.category === 'survival'
      ? `unter ${obj.targetValue} halten`
      : `Stand ${Math.round(obj.currentValue)} · Ziel unter ${obj.targetValue}`;

  const content = (
    <div className={`flex-1 overflow-y-auto ${variant === 'sidebar' ? 'p-3 space-y-3' : 'p-6 space-y-6'}`}>
      {/* Phase Info */}
      <div
        className="border-2 p-4"
        style={{
          // §4.7 Regel 3: Inhalts-Kästen = Papier (Tinten-/Stempel-Farben bleiben lesbar).
          backgroundColor: StoryModeColors.surfaceLight,
          borderColor: StoryModeColors.border,
        }}
      >
        <h3
          className="font-bold mb-3 text-lg"
          style={{ color: StoryModeColors.ministryRed }}
        >
          AKTUELLER STATUS
        </h3>
        <div className={`grid ${variant === 'sidebar' ? 'grid-cols-2' : 'grid-cols-4'} gap-4`}>
          <div className="text-center">
            <div
              className="text-3xl font-bold"
              style={{ color: StoryModeColors.ministryRed }}
            >
              {phase.number}
            </div>
            <div className="text-xs" style={{ color: StoryModeColors.textMuted }}>
              TAG
            </div>
          </div>
          <div className="text-center">
            <div
              className="text-3xl font-bold"
              style={{ color: StoryModeColors.warning }}
            >
              {Math.max(0, (phase.electionDay ?? 40) - phase.number)}
            </div>
            <div className="text-xs" style={{ color: StoryModeColors.textMuted }}>
              BIS ZUR WAHL
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
        className="border-2 p-4"
        style={{
          backgroundColor: StoryModeColors.surfaceLight,
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
            <div className="flex justify-between gap-2 mb-1">
              <span className="min-w-0" style={{ color: StoryModeColors.textSecondary }}>
                <Icon name="budget" size={14} title="Budget" /> BUDGET
              </span>
              {/* B23/B24: symbolfrei („150K"); nowrap + shrink-0, damit der Wert
                  in der schmalen Seitenleiste nie mehr zu „15" gekappt wird. */}
              <span
                className="font-bold whitespace-nowrap shrink-0"
                style={{ color: StoryModeColors.warning }}
              >
                {resources.budget}K
              </span>
            </div>
            <div
              className="h-4 w-full"
              style={{ backgroundColor: StoryModeColors.lightConcrete }}
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
                <Icon name="capacity" size={14} title="Kapazität" /> KAPAZITÄT
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
              style={{ backgroundColor: StoryModeColors.lightConcrete }}
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
              {/* N2 (§12.4): keine eigenständige Größe mehr — Zufluss der ABWEHR. */}
              <span style={{ color: StoryModeColors.textSecondary }}>
                <Icon name="risk" size={14} title="Risiko — Zufluss der Abwehr" /> RISIKO (→ ABWEHR)
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
              style={{ backgroundColor: StoryModeColors.lightConcrete }}
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
              {/* N2 (§12.4): keine eigenständige Größe mehr — Zufluss der ABWEHR. */}
              <span style={{ color: StoryModeColors.textSecondary }}>
                <Icon name="attention" size={14} title="Aufmerksamkeit — Zufluss der Abwehr" /> AUFMERKS. (→ ABWEHR)
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
              style={{ backgroundColor: StoryModeColors.lightConcrete }}
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
                <Icon name="moral" size={14} title="Moralische Last" /> MORALISCHE LAST
              </span>
              <span
                className="font-bold"
                style={{ color: StoryModeColors.ministryRed }}
              >
                {resources.moralWeight}
              </span>
            </div>
            <div
              className="h-4 w-full"
              style={{ backgroundColor: StoryModeColors.lightConcrete }}
            >
              <div
                className="h-full transition-all"
                style={{
                  width: `${Math.min(resources.moralWeight, 100)}%`,
                  backgroundColor: StoryModeColors.ministryRed,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Primary Objectives */}
      <div
        className="border-2 p-4"
        style={{
          backgroundColor: StoryModeColors.surfaceLight,
          borderColor: StoryModeColors.ministryRed,
        }}
      >
        <h3
          className="font-bold mb-4 text-lg"
          style={{ color: StoryModeColors.ministryRed }}
        >
          ⬢ HAUPTZIELE
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
                  className="font-bold whitespace-nowrap shrink-0"
                  style={{
                    color: getProgressColor(progressPct(obj)),
                  }}
                >
                  {zielText(obj)}
                </span>
              </div>
              <div
                className="h-3 w-full"
                style={{ backgroundColor: StoryModeColors.lightConcrete }}
              >
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${progressPct(obj)}%`,
                    backgroundColor: getProgressColor(progressPct(obj)),
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
          className="border-2 p-4"
          style={{
            backgroundColor: StoryModeColors.surfaceLight,
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
                    className="font-bold whitespace-nowrap shrink-0"
                    style={{
                      color: getProgressColor(progressPct(obj)),
                    }}
                  >
                    {zielText(obj)}
                  </span>
                </div>
                <div
                  className="h-2 w-full"
                  style={{ backgroundColor: StoryModeColors.lightConcrete }}
                >
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${progressPct(obj)}%`,
                      backgroundColor: getProgressColor(progressPct(obj)),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (variant === 'sidebar') {
    return (
      <div className="flex flex-col h-full" style={{ backgroundColor: StoryModeColors.surface }}>
        {/* Compact Header */}
        <div
          className="px-3 py-2 border-b-2 flex items-center gap-2"
          style={{
            // v3 §4.7: Kraftband statt Groß-Blau (Vision-Review E2 Runde 2).
            backgroundColor: StoryModeColors.darkConcrete,
            borderColor: StoryModeColors.border,
          }}
        >
          <Icon name="stats" size={16} title="Statistik" />
          {/* v3: warning ist Tinte — auf dem dunklen Blau-Kopfband heller Papier-Text. */}
          <h2 className="font-bold text-sm" style={{ color: StoryModeColors.surfaceLight }}>
            KAMPAGNEN-STATISTIK
          </h2>
        </div>

        {content}
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: scrim('normal') }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[85vh] mx-4 border-2 flex flex-col overflow-hidden"
        style={{
          backgroundColor: StoryModeColors.surface,
          borderColor: StoryModeColors.agencyBlue,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.35)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b-2 flex justify-between items-center"
          style={{
            backgroundColor: StoryModeColors.agencyBlue,
            borderColor: StoryModeColors.border,
          }}
        >
          <div className="flex items-center gap-3">
            <Icon name="broadcast" size={24} title="Statistik" />
            <h2 className="font-bold text-xl" style={{ color: StoryModeColors.surfaceLight }}>
              KAMPAGNEN-STATISTIK
            </h2>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1 font-bold border-2 transition-all hover:brightness-110"
            style={{
              // Dunkler Knopf → heller Text (§4.7 Regel 2).
              backgroundColor: StoryModeColors.darkConcrete,
              borderColor: StoryModeColors.border,
              color: StoryModeColors.surfaceLight,
            }}
          >
            SCHLIESSEN [ESC]
          </button>
        </div>

        {content}

        {/* Footer */}
        <div
          className="px-6 py-3 border-t-2 text-xs text-center"
          style={{
            // §4.7: Fußleiste = Papier, Tinten-Text bleibt.
            backgroundColor: StoryModeColors.surfaceLight,
            borderColor: StoryModeColors.border,
            color: StoryModeColors.textMuted,
          }}
        >
          Verbleibende Zeit: {Math.max(0, (phase.electionDay ?? 40) - phase.number)} Tage bis zur Wahl
        </div>
      </div>
    </div>
  );
}

export default StatsPanel;
