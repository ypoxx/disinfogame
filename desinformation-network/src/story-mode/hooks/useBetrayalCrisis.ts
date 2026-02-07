/**
 * useBetrayalCrisis - Sub-hook for betrayal and crisis system management
 *
 * Phase 6 Strangler Fig: Extracted from useStoryGameState.ts
 * Owns: betrayalStates, activeBetrayalWarnings, activeBetrayalEvent, activeCrisis
 * Callbacks: acknowledgeBetrayal, dismissBetrayalWarnings, addressGrievance,
 *            resolveCrisis, dismissCrisis
 */

import { useState, useCallback } from 'react';
import {
  StoryEngineAdapter,
} from '../../game-logic/StoryEngineAdapter';
import { playSound } from '../utils/SoundSystem';
import { getBetrayalSystem } from '../engine/BetrayalSystem';
import type { BetrayalState, BetrayalWarning, BetrayalEvent } from '../engine/BetrayalSystem';
import { getCrisisMomentSystem } from '../engine/CrisisMomentSystem';
import type { ActiveCrisis } from '../engine/CrisisMomentSystem';
import { storyLogger } from '../../utils/logger';

// ============================================
// HOOK
// ============================================

export function useBetrayalCrisis(engine: StoryEngineAdapter) {
  const [betrayalStates, setBetrayalStates] = useState<Map<string, BetrayalState>>(new Map());
  const [activeBetrayalWarnings, setActiveBetrayalWarnings] = useState<BetrayalWarning[]>([]);
  const [activeBetrayalEvent, setActiveBetrayalEvent] = useState<BetrayalEvent | null>(null);
  const [activeCrisis, setActiveCrisis] = useState<ActiveCrisis | null>(null);

  // ============================================
  // SYNC
  // ============================================

  const sync = useCallback(() => {
    // Rebuild betrayal states from the betrayal system
    const betrayalSystem = getBetrayalSystem();
    const allNpcs = engine.getAllNPCs();
    const newBetrayalStates = new Map<string, BetrayalState>();

    allNpcs.forEach(npc => {
      const risk = betrayalSystem.getBetrayalRisk(npc.id);
      if (risk) {
        const state: BetrayalState = {
          npcId: npc.id,
          warningLevel: risk.warningLevel,
          warningsShown: [],
          betrayalRisk: risk.risk,
          personalRedLines: [],
          recentMoralActions: [],
          lastWarningPhase: 0,
          grievances: risk.grievances,
          recoveryActions: [],
        };
        newBetrayalStates.set(npc.id, state);
      }
    });

    setBetrayalStates(newBetrayalStates);
  }, [engine]);

  // ============================================
  // ACTIONS
  // ============================================

  const acknowledgeBetrayal = useCallback(() => {
    setActiveBetrayalEvent(null);
  }, []);

  const dismissBetrayalWarnings = useCallback(() => {
    setActiveBetrayalWarnings([]);
  }, []);

  const addressGrievance = useCallback((npcId: string, _grievanceId: string) => {
    const betrayalSystem = getBetrayalSystem();
    const currentPhase = engine.getCurrentPhase();
    const result = betrayalSystem.addressConcerns(npcId, 'talk', currentPhase.number);

    storyLogger.info(`Addressed concerns for ${npcId}: ${result.message_de}`);

    // Update UI state
    const risk = betrayalSystem.getBetrayalRisk(npcId);
    if (risk) {
      setBetrayalStates(prev => {
        const newMap = new Map(prev);
        const existingState = newMap.get(npcId);
        if (existingState) {
          newMap.set(npcId, {
            ...existingState,
            betrayalRisk: risk.risk,
            warningLevel: risk.warningLevel,
            grievances: risk.grievances,
          });
        }
        return newMap;
      });
    }
  }, [engine]);

  const resolveCrisis = useCallback((choiceId: string) => {
    if (!activeCrisis) return;

    const crisisSystem = getCrisisMomentSystem();
    const currentPhase = engine.getCurrentPhase();

    const resolution = crisisSystem.resolveCrisis(
      activeCrisis.crisisId,
      choiceId,
      currentPhase.number
    );

    if (resolution) {
      storyLogger.log(`[CRISIS] Resolved: ${activeCrisis.crisis.name_en} with choice ${choiceId}`);

      resolution.effects.forEach(effect => {
        if (effect.type === 'resource_bonus' && effect.value) {
          storyLogger.log(`[CRISIS] Effect: ${effect.type} = ${effect.value}`);
        }
      });

      setActiveCrisis(null);
      playSound('success');

      if (resolution.triggeredChain) {
        storyLogger.log(`[CRISIS] Chained to: ${resolution.triggeredChain}`);
      }
    }
  }, [activeCrisis, engine]);

  const dismissCrisis = useCallback(() => {
    setActiveCrisis(null);
  }, []);

  // ============================================
  // RETURN
  // ============================================

  return {
    state: {
      betrayalStates,
      activeBetrayalWarnings,
      activeBetrayalEvent,
      activeCrisis,
    },
    actions: {
      acknowledgeBetrayal,
      dismissBetrayalWarnings,
      addressGrievance,
      resolveCrisis,
      dismissCrisis,
    },
    sync,
    // Exposed setters for orchestrator
    setBetrayalStates,
    setActiveBetrayalWarnings,
    setActiveBetrayalEvent,
    setActiveCrisis,
  };
}
