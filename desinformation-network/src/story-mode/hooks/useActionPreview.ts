import { useMemo } from 'react';
import type { StoryAction } from '../components/ActionPanel';

export interface ActionImpact {
  totalCost: number;
  riskIncrease: number;
  moralIncrease: number;
  attentionIncrease: number;
  npcBonusCount: number;
  consequenceLikelihood: 'low' | 'medium' | 'high';
  affordability: 'affordable' | 'tight' | 'unaffordable';
}

export function useActionPreview(
  action: StoryAction | null,
  availableResources: { budget: number; capacity: number; actionPoints: number },
) {
  return useMemo((): ActionImpact | null => {
    if (!action) return null;

    const budgetCost = action.costs.budget ?? 0;
    const capacityCost = action.costs.capacity ?? 0;
    const riskIncrease = action.costs.risk ?? 0;
    const moralIncrease = action.costs.moral_weight ?? 0;
    const attentionIncrease = action.costs.attention ?? 0;

    const totalCost = budgetCost + capacityCost * 10; // Normalize

    // Assess consequence likelihood based on legality and risk
    let consequenceLikelihood: ActionImpact['consequenceLikelihood'] = 'low';
    if (action.legality === 'illegal' || riskIncrease > 15) {
      consequenceLikelihood = 'high';
    } else if (action.legality === 'grey' || riskIncrease > 5) {
      consequenceLikelihood = 'medium';
    }

    // Assess affordability
    let affordability: ActionImpact['affordability'] = 'affordable';
    if (budgetCost > availableResources.budget || capacityCost > availableResources.capacity) {
      affordability = 'unaffordable';
    } else if (budgetCost > availableResources.budget * 0.5) {
      affordability = 'tight';
    }

    return {
      totalCost,
      riskIncrease,
      moralIncrease,
      attentionIncrease,
      npcBonusCount: action.npc_affinity.length,
      consequenceLikelihood,
      affordability,
    };
  }, [action, availableResources]);
}
