import { StoryModeColors } from '../theme';
import type { ActorEffectivenessModifier } from '../engine/ExtendedActorLoader';

// ============================================
// TYPES
// ============================================

interface ActorEffectivenessWidgetProps {
  actionLabel: string;
  modifiers: ActorEffectivenessModifier[];
  onClose: () => void;
}

// ============================================
// COMPONENT
// ============================================

export function ActorEffectivenessWidget({
  actionLabel,
  modifiers,
  onClose,
}: ActorEffectivenessWidgetProps) {
  if (modifiers.length === 0) {
    return null;
  }

  // Separate into vulnerable and resistant
  const vulnerable = modifiers.filter(m => m.isVulnerable);
  const resistant = modifiers.filter(m => m.isResistant);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[80vh] mx-4 border-4 flex flex-col overflow-hidden"
        style={{
          backgroundColor: StoryModeColors.background,
          borderColor: StoryModeColors.agencyBlue,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b-4"
          style={{
            backgroundColor: StoryModeColors.agencyBlue,
            borderColor: StoryModeColors.border,
          }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold" style={{ color: '#fff' }}>
                🎯 ZIEL-ANALYSE: {actionLabel.toUpperCase()}
              </h2>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.9)' }}>
                Akteur-Anfälligkeiten und Resistenzen
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
          {/* Vulnerable Actors */}
          {vulnerable.length > 0 && (
            <div className="mb-6">
              <div className="text-lg font-bold mb-3" style={{ color: StoryModeColors.success }}>
                ✅ ANFÄLLIGE ZIELE ({vulnerable.length})
              </div>
              <div className="space-y-2">
                {vulnerable.map(actor => (
                  <div
                    key={actor.actorId}
                    className="p-4 border-2"
                    style={{
                      backgroundColor: StoryModeColors.surface,
                      borderColor: StoryModeColors.success,
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="text-base font-bold mb-1" style={{ color: StoryModeColors.textPrimary }}>
                          {actor.actorName}
                        </div>
                        <div className="text-xs" style={{ color: StoryModeColors.textSecondary }}>
                          {actor.reason_de}
                        </div>
                      </div>
                      <div
                        className="px-3 py-1 ml-3 border-2 font-bold"
                        style={{
                          backgroundColor: StoryModeColors.success,
                          borderColor: '#15803d',
                          color: '#fff',
                        }}
                      >
                        +{Math.round((actor.modifier - 1) * 100)}%
                      </div>
                    </div>
                    {/* Effectiveness Bar */}
                    <div className="relative h-2 bg-black border" style={{ borderColor: StoryModeColors.border }}>
                      <div
                        className="absolute inset-0"
                        style={{
                          width: `${actor.modifier * 50}%`,
                          backgroundColor: StoryModeColors.success,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resistant Actors */}
          {resistant.length > 0 && (
            <div>
              <div className="text-lg font-bold mb-3" style={{ color: StoryModeColors.danger }}>
                🛡️ RESISTENTE ZIELE ({resistant.length})
              </div>
              <div className="space-y-2">
                {resistant.map(actor => (
                  <div
                    key={actor.actorId}
                    className="p-4 border-2"
                    style={{
                      backgroundColor: StoryModeColors.surface,
                      borderColor: StoryModeColors.danger,
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="text-base font-bold mb-1" style={{ color: StoryModeColors.textPrimary }}>
                          {actor.actorName}
                        </div>
                        <div className="text-xs" style={{ color: StoryModeColors.textSecondary }}>
                          {actor.reason_de}
                        </div>
                      </div>
                      <div
                        className="px-3 py-1 ml-3 border-2 font-bold"
                        style={{
                          backgroundColor: StoryModeColors.danger,
                          borderColor: '#8B0000',
                          color: '#fff',
                        }}
                      >
                        {Math.round((actor.modifier - 1) * 100)}%
                      </div>
                    </div>
                    {/* Effectiveness Bar */}
                    <div className="relative h-2 bg-black border" style={{ borderColor: StoryModeColors.border }}>
                      <div
                        className="absolute inset-0"
                        style={{
                          width: `${actor.modifier * 50}%`,
                          backgroundColor: StoryModeColors.danger,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Box */}
          <div
            className="mt-6 p-4 border-2"
            style={{
              backgroundColor: StoryModeColors.surface,
              borderColor: StoryModeColors.border,
            }}
          >
            <div className="text-xs font-bold mb-2" style={{ color: StoryModeColors.agencyBlue }}>
              💡 STRATEGIE-HINWEIS
            </div>
            <div className="text-xs" style={{ color: StoryModeColors.textSecondary }}>
              Anfällige Ziele erleiden mehr Vertrauensschaden. Resistente Ziele wehren sich besser.
              Wählen Sie Ihre Ziele strategisch, um maximalen Einfluss zu erzielen.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActorEffectivenessWidget;
