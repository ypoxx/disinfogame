import { StoryModeColors } from '../theme';
import type { PendingConsequence } from '../../game-logic/StoryEngineAdapter';

// ============================================
// TYPES
// ============================================

interface ConsequenceTimelineProps {
  pendingConsequences: PendingConsequence[];
  currentPhase: number;
}

// ============================================
// HELPERS
// ============================================

function getSeverityColor(severity: PendingConsequence['severity']): string {
  switch (severity) {
    case 'chance': return StoryModeColors.success;
    case 'minor': return StoryModeColors.textSecondary;
    case 'moderate': return StoryModeColors.warning;
    case 'severe': return StoryModeColors.danger;
    case 'critical': return '#8B0000';
    default: return StoryModeColors.textMuted;
  }
}

/**
 * Beschriftung der Schwere. Fällt auf „OFFEN" zurück, statt auf einem fehlenden
 * Wert `toUpperCase()` aufzurufen — genau das hat früher die gesamte Oberfläche
 * mitgerissen, weil `severity` in keiner einzigen Definition gepflegt war.
 */
function severityLabel(severity: PendingConsequence['severity']): string {
  if (severity === 'chance') return 'CHANCE';
  return severity ? severity.toUpperCase() : 'OFFEN';
}

function getTypeIcon(type: PendingConsequence['type']): string {
  switch (type) {
    case 'exposure': return '▲';
    case 'blowback': return '✷';
    case 'escalation': return '↑';
    case 'internal': return '⌂';
    case 'collateral': return '✕';
    case 'opportunity': return '★';
    default: return '•';
  }
}

// ============================================
// COMPONENT
// ============================================

export function ConsequenceTimeline({ pendingConsequences, currentPhase }: ConsequenceTimelineProps) {
  if (pendingConsequences.length === 0) return null;

  // Sort by activation phase (soonest first)
  const sorted = [...pendingConsequences].sort((a, b) => a.activatesAtPhase - b.activatesAtPhase);
  const upcoming = sorted.slice(0, 5); // Show at most 5

  // Gelegenheiten sind keine Bedrohung und dürfen den Warnzähler nicht treiben:
  // drei anstehende Chancen hätten die Leiste sonst rot eingefärbt.
  const drohend = pendingConsequences.filter((c) => c.severity !== 'chance').length;
  const chancen = pendingConsequences.length - drohend;

  return (
    <div
      className="px-3 py-2 border-2"
      style={{
        backgroundColor: StoryModeColors.surfaceLight,
        borderColor: StoryModeColors.border,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm"></span>
        <span className="text-xs font-bold" style={{ color: StoryModeColors.textSecondary }}>
          AUSSTEHENDE KONSEQUENZEN
        </span>
        {drohend > 0 && (
          <span
            className="text-xs px-1.5 py-0.5 font-bold"
            style={{
              backgroundColor: drohend > 3 ? StoryModeColors.danger : StoryModeColors.warning,
              color: '#fff',
            }}
          >
            {drohend}
          </span>
        )}
        {chancen > 0 && (
          <span
            className="text-xs px-1.5 py-0.5 font-bold"
            style={{ backgroundColor: StoryModeColors.success, color: '#fff' }}
            title={chancen === 1 ? 'Eine Gelegenheit zeichnet sich ab' : `${chancen} Gelegenheiten zeichnen sich ab`}
          >
            ★ {chancen}
          </span>
        )}
      </div>

      {/* Timeline bar */}
      <div className="relative">
        {/* Horizontal timeline line */}
        <div
          className="h-0.5 w-full mb-1"
          style={{ backgroundColor: StoryModeColors.border }}
        />

        {/* Consequence markers */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {upcoming.map((consequence) => {
            const phasesUntil = consequence.activatesAtPhase - currentPhase;
            const isImminent = phasesUntil <= 1;
            const severityColor = getSeverityColor(consequence.severity);

            return (
              <div
                key={consequence.id}
                className="flex-shrink-0 p-1.5 border text-center transition-all"
                style={{
                  backgroundColor: StoryModeColors.surface,
                  borderColor: isImminent ? StoryModeColors.danger : StoryModeColors.border,
                  minWidth: '80px',
                  animation: isImminent ? 'pulse 2s infinite' : undefined,
                }}
                title={consequence.label_de}
              >
                <div className="text-sm leading-none">{getTypeIcon(consequence.type)}</div>
                <div
                  className="text-[10px] font-bold mt-0.5 truncate"
                  style={{ color: severityColor, maxWidth: '75px' }}
                >
                  {severityLabel(consequence.severity)}
                </div>
                <div
                  className="text-[10px] mt-0.5"
                  style={{ color: isImminent ? StoryModeColors.danger : StoryModeColors.textMuted }}
                >
                  {phasesUntil <= 0 ? 'JETZT!' : `${phasesUntil} Ph.`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ConsequenceTimeline;
