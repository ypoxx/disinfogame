import { useMemo } from 'react';
import type { AdvisorRecommendation } from '../engine/AdvisorRecommendation';

export interface AdvisorSummary {
  totalRecommendations: number;
  byPriority: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  topRecommendation: AdvisorRecommendation | null;
  suggestedActionIds: string[];
}

export function useAdvisorSummary(recommendations: AdvisorRecommendation[]) {
  return useMemo((): AdvisorSummary => {
    const byPriority = { critical: 0, high: 0, medium: 0, low: 0 };
    const suggestedActionIds = new Set<string>();

    for (const rec of recommendations) {
      if (rec.priority in byPriority) {
        byPriority[rec.priority as keyof typeof byPriority]++;
      }
      rec.suggestedActions?.forEach(id => suggestedActionIds.add(id));
    }

    // Top recommendation = highest priority, then most recent
    const sorted = [...recommendations].sort((a, b) => {
      const priorityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
      return (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3);
    });

    return {
      totalRecommendations: recommendations.length,
      byPriority,
      topRecommendation: sorted[0] ?? null,
      suggestedActionIds: [...suggestedActionIds],
    };
  }, [recommendations]);
}
