/**
 * TargetingScreen Component
 *
 * Simplified targeting interface for Story Mode.
 * Shows suggested targets and allows custom selection.
 */

import { StoryModeColors } from '../theme';
import type { TargetingMode } from '../types';

interface TargetingScreenProps {
  targetingMode: TargetingMode;
  onSelectTarget: (actorId: string) => void;
  onCancel: () => void;
}

export function TargetingScreen({ targetingMode, onSelectTarget, onCancel }: TargetingScreenProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0,0,0,0.95)',
        zIndex: 100,
      }}
    >
      <div
        className="max-w-3xl w-full border-8 flex flex-col"
        style={{
          maxHeight: '80vh',
          backgroundColor: StoryModeColors.concrete,
          borderColor: StoryModeColors.sovietRed,
        }}
      >
        {/* Header */}
        <div
          className="p-4 border-b-4"
          style={{
            backgroundColor: StoryModeColors.darkConcrete,
            borderColor: StoryModeColors.border,
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🎯</span>
            <div>
              <h2 className="text-lg font-bold" style={{ color: StoryModeColors.sovietRed }}>
                ZIEL WÄHLEN
              </h2>
              <p className="text-xs" style={{ color: StoryModeColors.textSecondary }}>
                Von: {targetingMode.sourceNPC.toUpperCase()}
              </p>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="text-xs px-3 py-1 border-2 transition-all hover:translate-x-1"
            style={{
              backgroundColor: StoryModeColors.concrete,
              borderColor: StoryModeColors.borderLight,
              color: StoryModeColors.textSecondary,
            }}
          >
            ✕ ABBRECHEN
          </button>
        </div>

        {/* Suggested Targets */}
        <div className="flex-1 overflow-y-auto p-4">
          <div
            className="text-xs mb-3 font-bold"
            style={{ color: StoryModeColors.warning }}
          >
            🎖️ EMPFOHLENE ZIELE
          </div>

          <div className="space-y-2">
            {targetingMode.suggestedTargets.map((suggestion) => (
              <TargetButton
                key={suggestion.actorId}
                actorId={suggestion.actorId}
                actorName={suggestion.actorName}
                reason={suggestion.reason}
                effectiveness={suggestion.effectiveness}
                onSelect={() => onSelectTarget(suggestion.actorId)}
              />
            ))}
          </div>

          {/* Custom Target Option */}
          {targetingMode.allowCustomTarget && (
            <div className="mt-6">
              <div
                className="text-xs mb-3 font-bold"
                style={{ color: StoryModeColors.textSecondary }}
              >
                🔍 ERWEITERTE OPTIONEN
              </div>
              <button
                className="w-full text-left border-4 p-3 transition-all hover:translate-x-2"
                style={{
                  backgroundColor: StoryModeColors.darkConcrete,
                  borderColor: StoryModeColors.border,
                  boxShadow: '3px 3px 0px 0px rgba(0,0,0,0.8)',
                }}
              >
                <div className="text-xs" style={{ color: StoryModeColors.textSecondary }}>
                  🔓 Erweiterte Zielauswahl
                </div>
                <div className="text-sm mt-1" style={{ color: StoryModeColors.textPrimary }}>
                  Alle verfügbaren Akteure anzeigen
                </div>
                <div className="text-xs mt-1" style={{ color: StoryModeColors.textSecondary }}>
                  (Für fortgeschrittene Spieler)
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="p-4 border-t-4"
          style={{
            backgroundColor: StoryModeColors.darkConcrete,
            borderColor: StoryModeColors.border,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="text-xs" style={{ color: StoryModeColors.textSecondary }}>
              💡 Tipp: Wähle Ziele basierend auf ihrer Position im Netzwerk
            </div>
            <button
              onClick={onCancel}
              className="px-4 py-2 border-4 font-bold transition-all"
              style={{
                backgroundColor: StoryModeColors.concrete,
                borderColor: StoryModeColors.border,
                color: StoryModeColors.textSecondary,
              }}
            >
              ABBRECHEN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// TARGET BUTTON
// ============================================

interface TargetButtonProps {
  actorId: string;
  actorName: string;
  reason: string;
  effectiveness: 'low' | 'medium' | 'high';
  onSelect: () => void;
}

function TargetButton({ actorId, actorName, reason, effectiveness, onSelect }: TargetButtonProps) {
  const getEffectivenessColor = (eff: 'low' | 'medium' | 'high'): string => {
    switch (eff) {
      case 'high':
        return StoryModeColors.agencyBlue;
      case 'medium':
        return StoryModeColors.warning;
      case 'low':
        return StoryModeColors.danger;
    }
  };

  const getEffectivenessLabel = (eff: 'low' | 'medium' | 'high'): string => {
    switch (eff) {
      case 'high':
        return '★★★ HOCH';
      case 'medium':
        return '★★☆ MITTEL';
      case 'low':
        return '★☆☆ NIEDRIG';
    }
  };

  return (
    <button
      onClick={onSelect}
      className="w-full text-left border-4 p-4 transition-all hover:translate-x-2"
      style={{
        backgroundColor: StoryModeColors.concrete,
        borderColor: getEffectivenessColor(effectiveness),
        boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.8)',
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div
            className="text-xs mb-1"
            style={{ color: getEffectivenessColor(effectiveness) }}
          >
            {getEffectivenessLabel(effectiveness)}
          </div>

          <div className="text-base font-bold mb-2" style={{ color: StoryModeColors.textPrimary }}>
            {actorName}
          </div>

          <div className="text-xs" style={{ color: StoryModeColors.textSecondary }}>
            {reason}
          </div>

          <div className="text-xs mt-2" style={{ color: StoryModeColors.textSecondary }}>
            ID: {actorId}
          </div>
        </div>

        <div className="text-2xl" style={{ color: getEffectivenessColor(effectiveness) }}>
          →
        </div>
      </div>
    </button>
  );
}
