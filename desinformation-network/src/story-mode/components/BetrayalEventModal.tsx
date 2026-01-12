import { StoryModeColors } from '../theme';
import type { BetrayalEvent } from '../engine/BetrayalSystem';

// ============================================
// TYPES
// ============================================

interface BetrayalEventModalProps {
  isVisible: boolean;
  event: BetrayalEvent | null;
  onAcknowledge: () => void;
}

// ============================================
// COMPONENT
// ============================================

export function BetrayalEventModal({
  isVisible,
  event,
  onAcknowledge,
}: BetrayalEventModalProps) {
  if (!isVisible || !event) return null;

  const getBetrayalTypeIcon = () => {
    switch (event.type) {
      case 'whistleblower': return '📢';
      case 'defection': return '🏃';
      case 'sabotage': return '💣';
      case 'evidence_leak': return '📄';
      case 'testimony': return '⚖️';
      case 'disappearance': return '👻';
      default: return '💀';
    }
  };

  const getBetrayalTypeLabel = () => {
    switch (event.type) {
      case 'whistleblower': return 'WHISTLEBLOWER';
      case 'defection': return 'ÜBERLÄUFER';
      case 'sabotage': return 'SABOTAGE';
      case 'evidence_leak': return 'DATEN-LEAK';
      case 'testimony': return 'ZEUGE';
      case 'disappearance': return 'VERSCHWUNDEN';
      default: return 'VERRAT';
    }
  };

  const getSeverityColor = () => {
    switch (event.severity) {
      case 'catastrophic': return '#8B0000';  // Dark red
      case 'major': return StoryModeColors.danger;
      case 'minor': return '#FF8C00';
      default: return StoryModeColors.danger;
    }
  };

  const getSeverityLabel = () => {
    switch (event.severity) {
      case 'catastrophic': return 'KATASTROPHAL';
      case 'major': return 'GRAVIEREND';
      case 'minor': return 'MODERAT';
      default: return 'GEFÄHRLICH';
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[60]"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] mx-4 border-8 flex flex-col overflow-hidden animate-pulse"
        style={{
          backgroundColor: StoryModeColors.background,
          borderColor: getSeverityColor(),
          boxShadow: `0 0 60px ${getSeverityColor()}, inset 0 0 30px rgba(139, 0, 0, 0.3)`,
          animation: 'pulse 1.5s ease-in-out 3',
        }}
      >
        {/* ALERT HEADER */}
        <div
          className="relative px-8 py-6 border-b-8"
          style={{
            backgroundColor: getSeverityColor(),
            borderColor: '#000',
          }}
        >
          {/* Flashing Alert */}
          <div className="absolute top-2 left-2 flex gap-2 animate-pulse">
            <div className="w-3 h-3 rounded-full bg-white" />
            <div className="w-3 h-3 rounded-full bg-white" style={{ animationDelay: '0.5s' }} />
            <div className="w-3 h-3 rounded-full bg-white" style={{ animationDelay: '1s' }} />
          </div>

          <div className="text-center">
            <div className="text-6xl mb-2">{getBetrayalTypeIcon()}</div>
            <h1 className="text-4xl font-bold mb-2 tracking-wider" style={{ color: '#fff', textShadow: '3px 3px 6px rgba(0,0,0,0.8)' }}>
              ⚠️ SICHERHEITSVERLETZUNG ⚠️
            </h1>
            <div className="text-xl font-bold" style={{ color: 'rgba(255,255,255,0.95)' }}>
              {getBetrayalTypeLabel()} • {getSeverityLabel()}
            </div>
          </div>

          {/* Flashing Alert */}
          <div className="absolute top-2 right-2 flex gap-2 animate-pulse">
            <div className="w-3 h-3 rounded-full bg-white" />
            <div className="w-3 h-3 rounded-full bg-white" style={{ animationDelay: '0.5s' }} />
            <div className="w-3 h-3 rounded-full bg-white" style={{ animationDelay: '1s' }} />
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* NPC Name Box */}
          <div
            className="mb-6 p-4 border-4 text-center"
            style={{
              backgroundColor: '#000',
              borderColor: getSeverityColor(),
            }}
          >
            <div className="text-sm font-bold mb-1" style={{ color: StoryModeColors.textSecondary }}>
              KOMPROMITTIERTES TEAM-MITGLIED:
            </div>
            <div className="text-3xl font-bold" style={{ color: getSeverityColor() }}>
              {event.npcName.toUpperCase()}
            </div>
          </div>

          {/* Final Dialogue */}
          <div
            className="mb-6 p-6 border-4 relative"
            style={{
              backgroundColor: StoryModeColors.surface,
              borderColor: getSeverityColor(),
            }}
          >
            <div className="absolute -top-3 left-4 px-2 py-1 text-xs font-bold" style={{ backgroundColor: getSeverityColor(), color: '#fff' }}>
              LETZTE NACHRICHT
            </div>
            <div
              className="text-lg italic leading-relaxed"
              style={{
                color: StoryModeColors.textPrimary,
                fontFamily: 'Georgia, serif',
              }}
            >
              "{event.finalDialogue_de}"
            </div>
          </div>

          {/* Consequence */}
          <div
            className="mb-6 p-6 border-4"
            style={{
              backgroundColor: '#1a0000',
              borderColor: getSeverityColor(),
            }}
          >
            <div className="text-sm font-bold mb-3" style={{ color: getSeverityColor() }}>
              ⚠️ UNMITTELBARE KONSEQUENZEN
            </div>
            <div className="text-base mb-4" style={{ color: StoryModeColors.textPrimary }}>
              {event.consequence_de}
            </div>

            {/* Effects List */}
            <div className="space-y-2">
              {event.effects.map((effect, idx) => (
                <div
                  key={idx}
                  className="p-3 border-2 flex items-start gap-3"
                  style={{
                    backgroundColor: StoryModeColors.background,
                    borderColor: StoryModeColors.border,
                  }}
                >
                  <div className="text-2xl">{effect.type.includes('increase') ? '📈' : effect.type.includes('lost') ? '👤' : '🔓'}</div>
                  <div className="flex-1">
                    <div className="text-sm font-bold mb-1" style={{ color: StoryModeColors.danger }}>
                      {effect.description_de}
                    </div>
                    {effect.value > 0 && (
                      <div className="text-xs" style={{ color: StoryModeColors.textSecondary }}>
                        Auswirkung: +{effect.value}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Warning Box */}
          {event.severity === 'catastrophic' && (
            <div
              className="p-4 border-4 text-center animate-pulse"
              style={{
                backgroundColor: '#1a0000',
                borderColor: getSeverityColor(),
              }}
            >
              <div className="text-2xl mb-2">💀</div>
              <div className="text-lg font-bold" style={{ color: getSeverityColor() }}>
                KRITISCHER SCHADEN AN DER OPERATION
              </div>
              <div className="text-sm mt-2" style={{ color: StoryModeColors.textSecondary }}>
                Dieser Verrat kann nicht rückgängig gemacht werden.
              </div>
            </div>
          )}
        </div>

        {/* ACKNOWLEDGE BUTTON */}
        <div
          className="p-6 border-t-8 flex justify-center"
          style={{
            backgroundColor: StoryModeColors.darkConcrete,
            borderColor: getSeverityColor(),
          }}
        >
          <button
            onClick={onAcknowledge}
            className="px-12 py-4 font-bold text-xl border-4 hover:brightness-90 transition active:translate-y-1"
            style={{
              backgroundColor: getSeverityColor(),
              borderColor: '#000',
              color: '#fff',
              boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.8)',
            }}
          >
            VERSTANDEN • FORTFAHREN
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

export default BetrayalEventModal;
