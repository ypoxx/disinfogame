import { StoryModeColors } from '../theme';
import type { BetrayalState } from '../engine/BetrayalSystem';
import type { NPCState } from '../../game-logic/StoryEngineAdapter';

// ============================================
// TYPES
// ============================================

interface BetrayalIndicatorsProps {
  npcs: NPCState[];
  betrayalStates: Map<string, BetrayalState>;
}

// ============================================
// HELPERS
// ============================================

function getWarningColor(level: number): string {
  switch (level) {
    case 0: return StoryModeColors.success;      // Green - loyal
    case 1: return StoryModeColors.warning;      // Yellow - early warning
    case 2: return '#FF8C00';                     // Orange - mid warning
    case 3: return StoryModeColors.danger;        // Red - critical
    case 4: return '#8B0000';                     // Dark red - imminent
    default: return StoryModeColors.textMuted;
  }
}

function getWarningLabel(level: number): string {
  switch (level) {
    case 0: return 'Loyal';
    case 1: return 'Unruhig';
    case 2: return 'Besorgt';
    case 3: return 'Kritisch';
    case 4: return 'Verrat droht!';
    default: return 'Unbekannt';
  }
}

// ============================================
// COMPONENT
// ============================================

export function BetrayalIndicators({ npcs, betrayalStates }: BetrayalIndicatorsProps) {
  if (npcs.length === 0) return null;

  // Only show NPCs that have betrayal state
  const npcsWithState = npcs.filter(npc => betrayalStates.has(npc.id));
  if (npcsWithState.length === 0) return null;

  // Check if any NPC has warning level > 0
  const hasWarnings = npcsWithState.some(npc => {
    const state = betrayalStates.get(npc.id);
    return state && state.warningLevel > 0;
  });

  // Only show when there are actual warnings (don't clutter HUD when everything is fine)
  if (!hasWarnings) return null;

  return (
    <div
      className="flex items-center gap-1.5 px-2 py-1 border-2"
      style={{
        backgroundColor: StoryModeColors.surfaceLight,
        borderColor: StoryModeColors.border,
      }}
      title="NPC Loyalitäts-Status"
    >
      <span className="text-xs font-bold mr-1" style={{ color: StoryModeColors.textSecondary }}>
        NPC:
      </span>
      {npcsWithState.map(npc => {
        const state = betrayalStates.get(npc.id);
        const level = state?.warningLevel ?? 0;
        const color = getWarningColor(level);
        const label = getWarningLabel(level);
        const initial = npc.name.charAt(0).toUpperCase();

        return (
          <div
            key={npc.id}
            className="relative group"
            title={`${npc.name}: ${label} (Risiko: ${state?.betrayalRisk ?? 0}%)`}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all"
              style={{
                backgroundColor: color,
                borderColor: level >= 3 ? '#fff' : 'transparent',
                color: level >= 2 ? '#fff' : StoryModeColors.background,
                animation: level >= 3 ? 'pulse 1.5s infinite' : undefined,
              }}
            >
              {initial}
            </div>
            {/* Warning dot for levels 3+ */}
            {level >= 3 && (
              <div
                className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border animate-pulse"
                style={{
                  backgroundColor: StoryModeColors.danger,
                  borderColor: StoryModeColors.darkConcrete,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default BetrayalIndicators;
