/**
 * Story Mode State Hook
 *
 * This hook manages Story Mode specific state and bridges to the game engine.
 * It provides a simplified interface for the Story Mode UI while utilizing
 * the full power of the underlying game mechanics.
 */

import { useState, useCallback, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import type {
  StoryModeState,
  Email,
  EmailChoice,
  NPC,
  NPCDialog,
  NPCDialogOption,
  StoryDecision,
  DecisionConsequence,
  DaySummary,
  StoryLocation,
  TargetingMode,
} from './types';
import { INITIAL_STORY_STATE } from './types';

// ============================================
// HOOK RETURN TYPE
// ============================================

export interface UseStoryModeStateReturn {
  // State
  storyState: StoryModeState;
  targetingMode: TargetingMode | null;

  // Game engine state (pass-through)
  gameState: ReturnType<typeof useGameState>['gameState'];
  networkMetrics: ReturnType<typeof useGameState>['networkMetrics'];

  // Location navigation
  goToLocation: (location: StoryLocation) => void;
  goToOffice: () => void;

  // Email system
  getAvailableEmails: () => Email[];
  openEmail: (emailId: string) => Email | null;
  makeEmailChoice: (emailId: string, choiceId: string) => void;

  // NPC system
  getAvailableNPCs: () => NPC[];
  talkToNPC: (npcId: string) => void;
  getCurrentNPCDialog: () => NPCDialog | null;
  chooseDialogOption: (optionId: string) => void;

  // Targeting (simplified for Story Mode)
  enterTargeting: (abilityId: string, npcId: string, suggestedTargets?: string[]) => void;
  selectTarget: (actorId: string) => void;
  cancelTargeting: () => void;

  // Day progression
  canEndDay: () => boolean;
  endDay: () => void;
  getDaySummary: () => DaySummary | null;
  advanceToNextDay: () => void;

  // Utility
  canAfford: (costs: { money?: number; attention?: number; infrastructure?: number }) => boolean;
  getRelationship: (npcId: string) => number;
  hasFlag: (flagKey: string) => boolean;
  setFlag: (flagKey: string, value: any) => void;
}

// ============================================
// MAIN HOOK
// ============================================

export function useStoryModeState(
  emailDatabase: Email[],
  npcDatabase: NPC[]
): UseStoryModeStateReturn {
  // Game engine hook
  const gameEngine = useGameState();

  // Story Mode specific state
  const [storyState, setStoryState] = useState<StoryModeState>({
    ...INITIAL_STORY_STATE,
  });

  const [currentEmail, setCurrentEmail] = useState<Email | null>(null);
  const [currentNPC, setCurrentNPC] = useState<NPC | null>(null);
  const [currentDialog, setCurrentDialog] = useState<NPCDialog | null>(null);
  const [targetingMode, setTargetingMode] = useState<TargetingMode | null>(null);
  const [daySummary, setDaySummary] = useState<DaySummary | null>(null);

  // ============================================
  // INITIALIZE AVAILABLE EMAILS ON DAY START
  // ============================================

  useEffect(() => {
    const availableEmails = emailDatabase
      .filter((email) => {
        // Email is for current day
        if (email.day !== storyState.currentDay) return false;

        // Email hasn't been completed
        if (storyState.completedEmails.includes(email.id)) return false;

        // Check conditions
        if (email.conditions) {
          return checkConditions(email.conditions, storyState);
        }

        return true;
      })
      .map((e) => e.id);

    setStoryState((prev) => ({
      ...prev,
      availableEmails,
      unreadEmails: availableEmails.length,
    }));
  }, [storyState.currentDay, emailDatabase]);

  // ============================================
  // CONDITION CHECKING
  // ============================================

  const checkConditions = useCallback(
    (conditions: any[], state: StoryModeState): boolean => {
      return conditions.every((cond) => {
        switch (cond.type) {
          case 'flag':
            const flagValue = state.flags[cond.target];
            switch (cond.operator) {
              case 'equals':
                return flagValue === cond.value;
              case 'greaterThan':
                return typeof flagValue === 'number' && flagValue > cond.value;
              case 'lessThan':
                return typeof flagValue === 'number' && flagValue < cond.value;
              default:
                return false;
            }

          case 'relationship':
            const relValue = (state.relationships as any)[cond.target] || 0;
            switch (cond.operator) {
              case 'greaterThan':
                return relValue > cond.value;
              case 'lessThan':
                return relValue < cond.value;
              default:
                return false;
            }

          case 'day':
            switch (cond.operator) {
              case 'equals':
                return state.currentDay === cond.value;
              case 'greaterThan':
                return state.currentDay > cond.value;
              default:
                return false;
            }

          case 'decision':
            return state.decisions.some((d) => d.choiceId === cond.value);

          default:
            return true;
        }
      });
    },
    []
  );

  // ============================================
  // NAVIGATION
  // ============================================

  const goToLocation = useCallback((location: StoryLocation) => {
    setStoryState((prev) => ({ ...prev, currentLocation: location }));

    // Reset context when changing location
    if (location === 'office') {
      setCurrentEmail(null);
      setCurrentNPC(null);
      setCurrentDialog(null);
      setTargetingMode(null);
    }
  }, []);

  const goToOffice = useCallback(() => {
    goToLocation('office');
  }, [goToLocation]);

  // ============================================
  // EMAIL SYSTEM
  // ============================================

  const getAvailableEmails = useCallback((): Email[] => {
    return emailDatabase.filter((email) =>
      storyState.availableEmails.includes(email.id)
    );
  }, [emailDatabase, storyState.availableEmails]);

  const openEmail = useCallback(
    (emailId: string): Email | null => {
      const email = emailDatabase.find((e) => e.id === emailId);
      if (!email) return null;

      setCurrentEmail(email);
      goToLocation('inbox');
      return email;
    },
    [emailDatabase, goToLocation]
  );

  const applyConsequences = useCallback(
    (consequences: DecisionConsequence[]) => {
      setStoryState((prev) => {
        const newState = { ...prev };

        consequences.forEach((cons) => {
          switch (cons.type) {
            case 'resource':
              if (cons.target in newState.resources) {
                (newState.resources as any)[cons.target] += cons.value as number;
              }
              break;

            case 'relationship':
              if (cons.target in newState.relationships) {
                (newState.relationships as any)[cons.target] += cons.value as number;
                // Clamp to -100 to +100
                (newState.relationships as any)[cons.target] = Math.max(
                  -100,
                  Math.min(100, (newState.relationships as any)[cons.target])
                );
              }
              break;

            case 'flag':
              newState.flags[cons.target] = cons.value;
              break;

            case 'moral':
              newState.moralAlignment += cons.value as number;
              newState.moralAlignment = Math.max(-100, Math.min(100, newState.moralAlignment));
              break;
          }
        });

        return newState;
      });
    },
    []
  );

  const makeEmailChoice = useCallback(
    (emailId: string, choiceId: string) => {
      const email = emailDatabase.find((e) => e.id === emailId);
      if (!email) return;

      const choice = email.choices.find((c) => c.id === choiceId);
      if (!choice) return;

      // Apply costs
      if (choice.costs) {
        setStoryState((prev) => ({
          ...prev,
          resources: {
            money: prev.resources.money - (choice.costs?.money || 0),
            attention: prev.resources.attention + (choice.costs?.attention || 0),
            infrastructure: prev.resources.infrastructure + (choice.costs?.infrastructure || 0),
          },
        }));
      }

      // Apply consequences
      applyConsequences(choice.consequences);

      // Record decision
      const decision: StoryDecision = {
        day: storyState.currentDay,
        emailId,
        choiceId: choice.id,
        choiceText: choice.text,
        timestamp: Date.now(),
        consequences: choice.consequences,
      };

      setStoryState((prev) => ({
        ...prev,
        decisions: [...prev.decisions, decision],
        completedEmails: [...prev.completedEmails, emailId],
        availableEmails: prev.availableEmails.filter((id) => id !== emailId),
        unreadEmails: prev.unreadEmails - 1,
        actionsToday: prev.actionsToday + 1,
      }));

      // Execute ability if specified
      if (choice.executesAbility) {
        const { abilityId, targetActorId, targetActorIds } = choice.executesAbility;

        if (targetActorIds && targetActorIds.length > 0) {
          gameEngine.applyAbility(targetActorIds);
        } else if (targetActorId) {
          gameEngine.applyAbility([targetActorId]);
        } else {
          // Network-wide ability
          gameEngine.applyAbility([]);
        }
      }

      // Trigger follow-up email if specified
      if (choice.triggersEmail) {
        setStoryState((prev) => ({
          ...prev,
          availableEmails: [...prev.availableEmails, choice.triggersEmail!],
          unreadEmails: prev.unreadEmails + 1,
        }));
      }

      // TODO: Show feedback modal before returning to office
      // For now, just return to office
      setTimeout(() => {
        goToOffice();
      }, 100);
    },
    [emailDatabase, storyState.currentDay, applyConsequences, gameEngine, goToOffice]
  );

  // ============================================
  // NPC SYSTEM
  // ============================================

  const getAvailableNPCs = useCallback((): NPC[] => {
    return npcDatabase.filter((npc) => {
      // Check if available from current day
      if (npc.availableFromDay > storyState.currentDay) return false;

      // Check unlock conditions
      if (npc.unlockConditions) {
        return checkConditions(npc.unlockConditions, storyState);
      }

      return true;
    });
  }, [npcDatabase, storyState, checkConditions]);

  const talkToNPC = useCallback(
    (npcId: string) => {
      const npc = npcDatabase.find((n) => n.id === npcId);
      if (!npc) return;

      setCurrentNPC(npc);

      // Find first available dialog
      const availableDialogs = npc.dialogs
        .filter((d) => !d.conditions || checkConditions(d.conditions, storyState))
        .sort((a, b) => b.priority - a.priority);

      if (availableDialogs.length > 0) {
        setCurrentDialog(availableDialogs[0]);
      }

      goToLocation(`npc-${npcId}` as StoryLocation);
    },
    [npcDatabase, storyState, checkConditions, goToLocation]
  );

  const getCurrentNPCDialog = useCallback((): NPCDialog | null => {
    return currentDialog;
  }, [currentDialog]);

  const chooseDialogOption = useCallback(
    (optionId: string) => {
      if (!currentDialog || !currentNPC) return;

      const option = currentDialog.options.find((o) => o.id === optionId);
      if (!option) return;

      // Apply consequences if any
      if (option.consequences) {
        applyConsequences(option.consequences);
      }

      // Update relationship
      if (option.relationshipChange) {
        setStoryState((prev) => ({
          ...prev,
          relationships: {
            ...prev.relationships,
            [currentNPC.id]: Math.max(
              -100,
              Math.min(
                100,
                prev.relationships[currentNPC.id as keyof typeof prev.relationships] +
                  option.relationshipChange!
              )
            ),
          },
        }));
      }

      // Record decision
      const decision: StoryDecision = {
        day: storyState.currentDay,
        npcId: currentNPC.id,
        choiceId: option.id,
        choiceText: option.text,
        timestamp: Date.now(),
        consequences: option.consequences || [],
      };

      setStoryState((prev) => ({
        ...prev,
        decisions: [...prev.decisions, decision],
        actionsToday: prev.actionsToday + 1,
      }));

      // Handle next dialog
      if (option.nextDialog) {
        const nextDialog = currentNPC.dialogs.find((d) => d.id === option.nextDialog);
        if (nextDialog) {
          setCurrentDialog(nextDialog);
          return;
        }
      }

      // Handle ability execution
      if (option.executesAbility) {
        const { abilityId, requiresTargeting, suggestedTargets } = option.executesAbility;

        if (requiresTargeting) {
          enterTargeting(abilityId, currentNPC.id, suggestedTargets);
          return;
        } else {
          // Execute network-wide ability
          gameEngine.selectAbility(abilityId);
          gameEngine.applyAbility([]);
        }
      }

      // Handle location change
      if (option.opensLocation) {
        goToLocation(option.opensLocation);
        return;
      }

      // Close dialog and return to office
      if (option.closesDialog !== false) {
        goToOffice();
      }
    },
    [
      currentDialog,
      currentNPC,
      storyState.currentDay,
      applyConsequences,
      gameEngine,
      goToOffice,
      goToLocation,
    ]
  );

  // ============================================
  // TARGETING SYSTEM
  // ============================================

  const enterTargeting = useCallback(
    (abilityId: string, npcId: string, suggestedTargets?: string[]) => {
      // Get valid targets from game engine
      const validTargets = gameEngine.getValidTargets(abilityId);

      // Create suggestions
      const suggestions = (suggestedTargets || validTargets.slice(0, 3).map((a) => a.id)).map(
        (actorId) => {
          const actor = gameEngine.getActor(actorId);
          return {
            actorId,
            actorName: actor?.name || 'Unknown',
            reason: 'Suggested target',
            effectiveness: 'high' as const,
          };
        }
      );

      setTargetingMode({
        active: true,
        abilityId,
        sourceNPC: npcId,
        suggestedTargets: suggestions,
        allowCustomTarget: true,
      });
    },
    [gameEngine]
  );

  const selectTarget = useCallback(
    (actorId: string) => {
      if (!targetingMode) return;

      // Apply ability through game engine
      gameEngine.selectAbility(targetingMode.abilityId);
      gameEngine.applyAbility([actorId]);

      // Exit targeting mode
      setTargetingMode(null);

      // Return to office
      goToOffice();
    },
    [targetingMode, gameEngine, goToOffice]
  );

  const cancelTargeting = useCallback(() => {
    setTargetingMode(null);
  }, []);

  // ============================================
  // DAY PROGRESSION
  // ============================================

  const canEndDay = useCallback((): boolean => {
    // Must have handled at least some emails or taken actions
    return storyState.actionsToday > 0 || storyState.unreadEmails === 0;
  }, [storyState.actionsToday, storyState.unreadEmails]);

  const endDay = useCallback(() => {
    if (!canEndDay()) return;

    // Advance round in game engine
    gameEngine.advanceRound();

    // Generate day summary
    const summary: DaySummary = {
      day: storyState.currentDay,
      decisions: storyState.decisions
        .filter((d) => d.day === storyState.currentDay)
        .map((d) => ({
          emailId: d.emailId || '',
          emailSubject: emailDatabase.find((e) => e.id === d.emailId)?.subject || 'NPC Interaction',
          choiceText: d.choiceText,
          choiceType: d.choiceId,
        })),
      resourceChanges: {
        money: { start: 150, end: storyState.resources.money, change: storyState.resources.money - 150 },
        attention: { start: 0, end: storyState.resources.attention, change: storyState.resources.attention },
        infrastructure: { start: 0, end: storyState.resources.infrastructure, change: storyState.resources.infrastructure },
      },
      impacts: [],
      newsHeadlines: [],
      gameState: {
        trustPublic: gameEngine.networkMetrics.averageTrust,
        electionChance: 50, // TODO: Calculate from game state
        crisisLevel: 30, // TODO: Calculate from flags
      },
    };

    setDaySummary(summary);
    setStoryState((prev) => ({ ...prev, dayComplete: true, currentLocation: 'day-summary' }));
  }, [canEndDay, gameEngine, storyState, emailDatabase]);

  const advanceToNextDay = useCallback(() => {
    setStoryState((prev) => ({
      ...prev,
      currentDay: prev.currentDay + 1,
      timeOfDay: 'morning',
      actionsToday: 0,
      dayComplete: false,
      currentLocation: 'office',
    }));

    setDaySummary(null);
  }, []);

  const getDaySummary = useCallback((): DaySummary | null => {
    return daySummary;
  }, [daySummary]);

  // ============================================
  // UTILITY
  // ============================================

  const canAfford = useCallback(
    (costs: { money?: number; attention?: number; infrastructure?: number }): boolean => {
      if (costs.money && storyState.resources.money < costs.money) return false;
      // Note: attention and infrastructure can go over limits (they're risk/capacity)
      return true;
    },
    [storyState.resources]
  );

  const getRelationship = useCallback(
    (npcId: string): number => {
      return (storyState.relationships as any)[npcId] || 0;
    },
    [storyState.relationships]
  );

  const hasFlag = useCallback(
    (flagKey: string): boolean => {
      return !!storyState.flags[flagKey];
    },
    [storyState.flags]
  );

  const setFlag = useCallback((flagKey: string, value: any) => {
    setStoryState((prev) => ({
      ...prev,
      flags: { ...prev.flags, [flagKey]: value },
    }));
  }, []);

  // ============================================
  // RETURN
  // ============================================

  return {
    storyState,
    targetingMode,
    gameState: gameEngine.gameState,
    networkMetrics: gameEngine.networkMetrics,

    goToLocation,
    goToOffice,

    getAvailableEmails,
    openEmail,
    makeEmailChoice,

    getAvailableNPCs,
    talkToNPC,
    getCurrentNPCDialog,
    chooseDialogOption,

    enterTargeting,
    selectTarget,
    cancelTargeting,

    canEndDay,
    endDay,
    getDaySummary,
    advanceToNextDay,

    canAfford,
    getRelationship,
    hasFlag,
    setFlag,
  };
}
