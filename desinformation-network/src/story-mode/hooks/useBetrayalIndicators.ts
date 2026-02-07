import { useMemo } from 'react';
import type { BetrayalState } from '../engine/BetrayalSystem';
import type { NPCState } from '../../game-logic/StoryEngineAdapter';

export interface BetrayalIndicator {
  npcId: string;
  name: string;
  initial: string;
  warningLevel: number;
  betrayalRisk: number;
  grievanceCount: number;
  hasUnaddressedGrievances: boolean;
  available: boolean;
}

export function useBetrayalIndicators(
  npcs: NPCState[],
  betrayalStates: Map<string, BetrayalState>,
) {
  return useMemo(() => {
    const indicators: BetrayalIndicator[] = [];
    let maxWarningLevel = 0;
    let totalRisk = 0;

    for (const npc of npcs) {
      const state = betrayalStates.get(npc.id);
      if (!state) continue;

      const indicator: BetrayalIndicator = {
        npcId: npc.id,
        name: npc.name,
        initial: npc.name.charAt(0).toUpperCase(),
        warningLevel: state.warningLevel,
        betrayalRisk: state.betrayalRisk,
        grievanceCount: state.grievances.length,
        hasUnaddressedGrievances: state.grievances.some(g => !g.addressed),
        available: npc.available,
      };

      indicators.push(indicator);
      maxWarningLevel = Math.max(maxWarningLevel, state.warningLevel);
      totalRisk += state.betrayalRisk;
    }

    return {
      indicators,
      hasWarnings: maxWarningLevel > 0,
      maxWarningLevel,
      averageRisk: indicators.length > 0 ? totalRisk / indicators.length : 0,
      criticalCount: indicators.filter(i => i.warningLevel >= 3).length,
    };
  }, [npcs, betrayalStates]);
}
