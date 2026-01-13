import { StoryModeColors } from '../theme';
import type { BetrayalState, BetrayalGrievance } from '../engine/BetrayalSystem';

// ============================================
// TYPES
// ============================================

interface GrievanceModalProps {
  isVisible: boolean;
  betrayalState: BetrayalState | null;
  npcName: string;
  onClose: () => void;
  onAddressGrievance?: (grievanceId: string) => void;
}

// ============================================
// COMPONENT
// ============================================

export function GrievanceModal({
  isVisible,
  betrayalState,
  npcName,
  onClose,
  onAddressGrievance,
}: GrievanceModalProps) {
  if (!isVisible || !betrayalState) return null;

  const getSeverityColor = (severity: number) => {
    if (severity >= 8) return StoryModeColors.danger;
    if (severity >= 5) return '#FF8C00';
    if (severity >= 3) return StoryModeColors.warning;
    return StoryModeColors.textSecondary;
  };

  const getSeverityLabel = (severity: number) => {
    if (severity >= 8) return 'KRITISCH';
    if (severity >= 5) return 'HOCH';
    if (severity >= 3) return 'MITTEL';
    return 'NIEDRIG';
  };

  const getGrievanceTypeLabel = (type: BetrayalGrievance['type']) => {
    switch (type) {
      case 'moral_action': return '⚖️ Moralische Bedenken';
      case 'red_line_crossed': return '🔴 Rote Linie überschritten';
      case 'low_morale': return '😞 Niedrige Moral';
      case 'overwork': return '😰 Überlastung';
      case 'ignored': return '🚫 Ignoriert';
      default: return '❓ Unbekannt';
    }
  };

  const activeGrievances = betrayalState.grievances.filter(g => !g.addressed);
  const addressedGrievances = betrayalState.grievances.filter(g => g.addressed);
  const totalRisk = betrayalState.betrayalRisk;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[85vh] mx-4 border-4 flex flex-col overflow-hidden"
        style={{
          backgroundColor: StoryModeColors.background,
          borderColor: totalRisk >= 70 ? StoryModeColors.danger : StoryModeColors.warning,
          boxShadow: `0 0 30px ${totalRisk >= 70 ? StoryModeColors.danger : StoryModeColors.warning}`,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b-4"
          style={{
            backgroundColor: totalRisk >= 70 ? StoryModeColors.danger : StoryModeColors.warning,
            borderColor: StoryModeColors.border,
          }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: '#fff' }}>
                🔥 LOYALITÄTS-STATUS: {npcName.toUpperCase()}
              </h2>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.9)' }}>
                Verrats-Risiko: {totalRisk}% | Warnstufe: {betrayalState.warningLevel}/4
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 font-bold border-2 hover:brightness-110 transition"
              style={{
                backgroundColor: 'rgba(0,0,0,0.3)',
                borderColor: '#fff',
                color: '#fff',
              }}
            >
              ✕ SCHLIESSEN
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Risk Overview */}
          <div
            className="p-4 mb-6 border-2"
            style={{
              backgroundColor: StoryModeColors.surface,
              borderColor: StoryModeColors.border,
            }}
          >
            <div className="text-xs font-bold mb-2" style={{ color: StoryModeColors.textSecondary }}>
              RISIKOANALYSE
            </div>
            <div className="relative h-4 bg-black border-2" style={{ borderColor: StoryModeColors.border }}>
              <div
                className="absolute inset-0 transition-all duration-500"
                style={{
                  width: `${totalRisk}%`,
                  backgroundColor: totalRisk >= 70 ? StoryModeColors.danger :
                                 totalRisk >= 40 ? '#FF8C00' : StoryModeColors.warning,
                }}
              />
              <div
                className="absolute inset-0 flex items-center justify-center text-xs font-bold"
                style={{ color: totalRisk >= 30 ? '#fff' : StoryModeColors.textPrimary }}
              >
                {totalRisk}%
              </div>
            </div>
            {totalRisk >= 70 && (
              <div className="mt-2 text-xs font-bold animate-pulse" style={{ color: StoryModeColors.danger }}>
                ⚠️ WARNUNG: VERRAT STEHT UNMITTELBAR BEVOR!
              </div>
            )}
          </div>

          {/* Active Grievances */}
          {activeGrievances.length > 0 && (
            <div className="mb-6">
              <div className="text-lg font-bold mb-3" style={{ color: StoryModeColors.textPrimary }}>
                🔴 AKTIVE BESCHWERDEN ({activeGrievances.length})
              </div>
              <div className="space-y-3">
                {activeGrievances.map(grievance => (
                  <div
                    key={grievance.id}
                    className="p-4 border-2"
                    style={{
                      backgroundColor: StoryModeColors.surface,
                      borderColor: getSeverityColor(grievance.severity),
                    }}
                  >
                    {/* Grievance Header */}
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-xs font-bold mb-1" style={{ color: getSeverityColor(grievance.severity) }}>
                          {getGrievanceTypeLabel(grievance.type)} • {getSeverityLabel(grievance.severity)}
                        </div>
                        <div className="text-sm" style={{ color: StoryModeColors.textPrimary }}>
                          {grievance.description_de}
                        </div>
                      </div>
                      {onAddressGrievance && (
                        <button
                          onClick={() => onAddressGrievance(grievance.id)}
                          className="px-3 py-1 text-xs font-bold border-2 hover:brightness-110 transition ml-3"
                          style={{
                            backgroundColor: StoryModeColors.success,
                            borderColor: '#15803d',
                            color: '#fff',
                          }}
                        >
                          ANSPRECHEN
                        </button>
                      )}
                    </div>

                    {/* Severity Bar */}
                    <div className="relative h-1 bg-black mt-2">
                      <div
                        className="absolute inset-0"
                        style={{
                          width: `${grievance.severity * 10}%`,
                          backgroundColor: getSeverityColor(grievance.severity),
                        }}
                      />
                    </div>

                    {/* Phase Info */}
                    <div className="text-xs mt-2" style={{ color: StoryModeColors.textMuted }}>
                      Phase {grievance.createdPhase}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Addressed Grievances */}
          {addressedGrievances.length > 0 && (
            <div>
              <div className="text-lg font-bold mb-3" style={{ color: StoryModeColors.textSecondary }}>
                ✅ BEHANDELTE BESCHWERDEN ({addressedGrievances.length})
              </div>
              <div className="space-y-2">
                {addressedGrievances.map(grievance => (
                  <div
                    key={grievance.id}
                    className="p-3 border opacity-60"
                    style={{
                      backgroundColor: StoryModeColors.surface,
                      borderColor: StoryModeColors.border,
                    }}
                  >
                    <div className="text-xs font-bold mb-1" style={{ color: StoryModeColors.success }}>
                      {getGrievanceTypeLabel(grievance.type)} • GELÖST
                    </div>
                    <div className="text-xs" style={{ color: StoryModeColors.textSecondary }}>
                      {grievance.description_de}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Grievances */}
          {activeGrievances.length === 0 && addressedGrievances.length === 0 && (
            <div
              className="p-6 text-center border-2"
              style={{
                backgroundColor: StoryModeColors.surface,
                borderColor: StoryModeColors.border,
              }}
            >
              <div className="text-lg mb-2" style={{ color: StoryModeColors.success }}>✅</div>
              <div className="text-sm" style={{ color: StoryModeColors.textSecondary }}>
                Keine aktiven Beschwerden. {npcName} scheint zufrieden zu sein.
              </div>
            </div>
          )}

          {/* Red Lines Info */}
          {betrayalState.personalRedLines.length > 0 && (
            <div
              className="mt-6 p-4 border-2"
              style={{
                backgroundColor: StoryModeColors.surface,
                borderColor: StoryModeColors.border,
              }}
            >
              <div className="text-xs font-bold mb-2" style={{ color: StoryModeColors.danger }}>
                🔴 PERSÖNLICHE ROTE LINIEN
              </div>
              <div className="text-xs" style={{ color: StoryModeColors.textSecondary }}>
                {npcName} hat starke moralische Grenzen in diesen Bereichen:
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {betrayalState.personalRedLines.map(redLine => (
                  <span
                    key={redLine}
                    className="px-2 py-1 text-xs font-bold border"
                    style={{
                      backgroundColor: StoryModeColors.background,
                      borderColor: StoryModeColors.danger,
                      color: StoryModeColors.danger,
                    }}
                  >
                    {redLine.replace('_', ' ').toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GrievanceModal;
