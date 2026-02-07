import { useMemo } from 'react';
import type { PendingConsequence } from '../../game-logic/StoryEngineAdapter';

export interface TimelineEntry {
  id: string;
  label: string;
  severity: PendingConsequence['severity'];
  type: PendingConsequence['type'];
  activatesAtPhase: number;
  phasesUntil: number;
  isImminent: boolean;
}

export function useConsequenceTimeline(
  pendingConsequences: PendingConsequence[],
  currentPhase: number,
) {
  return useMemo(() => {
    const entries: TimelineEntry[] = pendingConsequences
      .map(c => {
        const phasesUntil = c.activatesAtPhase - currentPhase;
        return {
          id: c.id,
          label: c.label_de,
          severity: c.severity,
          type: c.type,
          activatesAtPhase: c.activatesAtPhase,
          phasesUntil,
          isImminent: phasesUntil <= 1,
        };
      })
      .sort((a, b) => a.phasesUntil - b.phasesUntil);

    return {
      entries,
      total: entries.length,
      imminentCount: entries.filter(e => e.isImminent).length,
      hasCritical: entries.some(e => e.severity === 'critical' || e.severity === 'severe'),
    };
  }, [pendingConsequences, currentPhase]);
}
