import { useMemo } from 'react';

export interface ComboProgress {
  totalCombos: number;
  discoveredCombos: string[];
  byCategory: Record<string, number>;
  discoveryRate: number; // 0-100
}

interface ComboStats {
  total: number;
  byCategory: Record<string, number>;
  discoveredCombos: string[];
}

export function useComboProgress(comboStats: ComboStats | null) {
  return useMemo((): ComboProgress => {
    if (!comboStats) {
      return {
        totalCombos: 0,
        discoveredCombos: [],
        byCategory: {},
        discoveryRate: 0,
      };
    }

    return {
      totalCombos: comboStats.total,
      discoveredCombos: comboStats.discoveredCombos,
      byCategory: comboStats.byCategory,
      discoveryRate: comboStats.total > 0
        ? (comboStats.discoveredCombos.length / comboStats.total) * 100
        : 0,
    };
  }, [comboStats]);
}
