import { StoryModeColors } from '../theme';
import type { BetrayalEvent } from '../engine/BetrayalSystem';
import { PixelFrame } from './PixelFrame';
import { Icon } from './Icon';

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

  // Kein Emoji — kurzes Text-Label je Verrats-Typ.
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
      case 'catastrophic': return StoryModeColors.darkRed;
      case 'major': return StoryModeColors.danger;
      case 'minor': return StoryModeColors.warning;
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

  // Liefert ein passendes Effekt-Icon ohne Emoji.
  const getEffectIconName = (type: string): 'risk' | 'attention' | 'npcs' | 'stats' => {
    if (type.includes('increase')) return 'risk';
    if (type.includes('lost')) return 'npcs';
    return 'stats';
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[60]"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
    >
      <PixelFrame
        variant="alarm"
        className="w-full max-w-4xl max-h-[90vh] mx-4 flex flex-col overflow-hidden"
        style={{
          borderColor: getSeverityColor(),
          animation: 'pulse 1.5s ease-in-out 3',
        }}
      >
        {/* ALERT HEADER */}
        <div
          className="relative px-8 py-6 border-b-4"
          style={{
            backgroundColor: getSeverityColor(),
            borderColor: StoryModeColors.border,
          }}
        >
          {/* Blinkende Warnlampen (CSS-only, kein Emoji) */}
          <div className="absolute top-2 left-2 flex gap-2 animate-pulse">
            <div className="w-3 h-3 rounded-full bg-white" />
            <div className="w-3 h-3 rounded-full bg-white" style={{ animationDelay: '0.5s' }} />
            <div className="w-3 h-3 rounded-full bg-white" style={{ animationDelay: '1s' }} />
          </div>

          <div className="text-center">
            {/* Typ-Badge statt Emoji */}
            <div
              className="inline-block mb-3 px-4 py-1 text-sm font-bold border-2"
              style={{ borderColor: 'rgba(255,255,255,0.5)', color: '#fff' }}
            >
              {getBetrayalTypeLabel()}
            </div>
            <h1 className="text-4xl font-bold mb-2 tracking-wider" style={{ color: '#fff', textShadow: '3px 3px 6px rgba(0,0,0,0.8)' }}>
              SICHERHEITSVERLETZUNG
            </h1>
            <div className="flex items-center justify-center gap-2">
              <Icon name="risk" size={16} title="Warnung" fallback="!" />
              <span className="text-xl font-bold" style={{ color: 'rgba(255,255,255,0.95)' }}>
                {getBetrayalTypeLabel()} • {getSeverityLabel()}
              </span>
              <Icon name="risk" size={16} title="Warnung" fallback="!" />
            </div>
          </div>

          {/* Blinkende Warnlampen rechts */}
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
              backgroundColor: StoryModeColors.background,
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
            <div className="flex items-center gap-2 text-sm font-bold mb-3" style={{ color: getSeverityColor() }}>
              <Icon name="risk" size={14} title="Konsequenzen" fallback="!" />
              UNMITTELBARE KONSEQUENZEN
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
                  <Icon name={getEffectIconName(effect.type)} size={20} title={effect.type} fallback="!" />
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

          {/* Warning Box — nur bei katastrophalem Verrat */}
          {event.severity === 'catastrophic' && (
            <div
              className="p-4 border-4 text-center animate-pulse"
              style={{
                backgroundColor: '#1a0000',
                borderColor: getSeverityColor(),
              }}
            >
              <div className="flex justify-center mb-2">
                <Icon name="moral" size={28} title="Kritisch" fallback="KR" />
              </div>
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
          className="p-6 border-t-4 flex justify-center"
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
              borderColor: StoryModeColors.border,
              color: '#fff',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.35)',
            }}
          >
            VERSTANDEN • FORTFAHREN
          </button>
        </div>
      </PixelFrame>

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
