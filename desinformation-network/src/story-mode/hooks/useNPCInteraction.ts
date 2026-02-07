/**
 * useNPCInteraction - Sub-hook for NPC dialog and interaction management
 *
 * Phase 6 Strangler Fig: Extracted from useStoryGameState.ts
 * Owns: npcs, activeNpcId, currentDialog
 * Callbacks: interactWithNpc, handleDialogChoice, dismissDialog, continueDialog
 */

import { useState, useCallback } from 'react';
import {
  StoryEngineAdapter,
  NPCState,
} from '../../game-logic/StoryEngineAdapter';
import { playSound } from '../utils/SoundSystem';
import { storyLogger } from '../../utils/logger';
import type { BetrayalState, BetrayalGrievance } from '../engine/BetrayalSystem';
import type { AdvisorRecommendation } from '../engine/AdvisorRecommendation';
import type { DialogState, GamePhase } from './useStoryGameState';
import dialoguesData from '../data/dialogues.json';

// ============================================
// HELPERS (copied from original monolith)
// ============================================

function getTopicLabel(topic: string): string {
  const labels: Record<string, string> = {
    mission: 'Über die Mission',
    resources: 'Über Ressourcen',
    risks: 'Über Risiken',
    content: 'Über Inhalte',
    platforms: 'Über Plattformen',
    viral: 'Über Viralität',
    infrastructure: 'Über Infrastruktur',
    bots: 'Über Bot-Netzwerke',
    security: 'Über Sicherheit',
    field: 'Über Feldarbeit',
    contacts: 'Über Kontakte',
    budget: 'Über das Budget',
    fronts: 'Über Tarnfirmen',
    flow: 'Über Geldflüsse',
  };
  return labels[topic] || topic.charAt(0).toUpperCase() + topic.slice(1);
}

function enhanceTopicResponse(
  baseResponse: string,
  topic: string,
  npcId: string,
  contextData: {
    recommendations: Array<{ npcId: string; message: string; category: string; priority: string }>;
    betrayalState?: { warningLevel: number; betrayalRisk: number; grievances: BetrayalGrievance[] };
    phase: number;
    budget: number;
    influence: number;
  }
): string {
  let enhanced = baseResponse;

  if (topic === 'risks' || topic === 'security') {
    if (contextData.betrayalState && contextData.betrayalState.warningLevel >= 2) {
      const riskPercent = Math.round(contextData.betrayalState.betrayalRisk);
      enhanced += `\n\n*wird ernster* Und zwischen uns gesagt: Ich mache mir Sorgen. Mein Verrats-Risiko liegt bei ${riskPercent}%. `;
      if (contextData.betrayalState.grievances.length > 0) {
        enhanced += `Besonders stört mich: ${contextData.betrayalState.grievances[0].description_de}.`;
      }
    } else {
      enhanced += `\n\n*denkt nach* Momentan läuft alles nach Plan. Wir sollten es so beibehalten.`;
    }
  }

  if (topic === 'resources' || topic === 'budget') {
    if (contextData.budget < 3000) {
      enhanced += '\n\n*schaut besorgt* Unser Budget wird knapp. Wir müssen vorsichtiger planen.';
    } else if (contextData.budget > 8000) {
      enhanced += '\n\n*nickt zufrieden* Finanziell stehen wir gut da. Wir haben Spielraum für größere Aktionen.';
    } else {
      enhanced += `\n\n*überprüft Zahlen* Wir haben aktuell ${Math.round(contextData.budget)}K Budget verfügbar. Solide, aber nicht übermäßig.`;
    }
  }

  if (topic === 'mission' || topic === 'field') {
    if (contextData.influence > 70) {
      enhanced += '\n\n*lächelt* Wir machen gute Fortschritte. Unser Einfluss wächst stetig.';
    } else if (contextData.influence < 30) {
      enhanced += '\n\n*runzelt die Stirn* Wir müssen unsere Strategie überdenken. Der Fortschritt ist zu langsam.';
    } else {
      enhanced += `\n\n*nickt* Wir sind in Phase ${contextData.phase}. Noch viel Arbeit vor uns.`;
    }
  }

  if (topic === 'contacts') {
    if (contextData.phase < 3) {
      enhanced += '\n\n*lächelt vielsagend* Ich habe da ein paar interessante Leute kennengelernt. Geben Sie mir noch etwas Zeit, sie aufzubauen.';
    } else {
      enhanced += '\n\n*tippt auf Notizbuch* Mein Netzwerk wächst. Jeden Tag neue Verbindungen, neue Möglichkeiten.';
    }
  }

  if (topic === 'content' || topic === 'platforms') {
    if (contextData.influence > 60) {
      enhanced += '\n\n*zeigt auf Bildschirm* Unsere letzten Posts haben gut funktioniert. Die Engagement-Rate steigt.';
    } else {
      enhanced += '\n\n*scrollt durch Analytics* Wir müssen unsere Inhalte schärfer machen. Mehr Emotion, weniger Fakten.';
    }
  }

  if (topic === 'viral') {
    enhanced += '\n\n*tippt energisch* Das Geheimnis? Empörung. Menschen teilen, was sie wütend macht. Das nutzen wir aus.';
  }

  if (topic === 'infrastructure' || topic === 'bots') {
    if (contextData.budget > 6000) {
      enhanced += '\n\n*grinst* Mit unserem aktuellen Budget kann ich die Bot-Armeen gut ausbauen. Mehr Accounts, mehr Reichweite.';
    } else {
      enhanced += '\n\n*seufzt* Bots kosten Geld für Server und Proxies. Wenn das Budget knapp wird, müssen wir Prioritäten setzen.';
    }
  }

  if (topic === 'fronts' || topic === 'flow') {
    if (contextData.phase > 5) {
      enhanced += '\n\n*blättert durch Papiere* Die Tarnfirmen laufen gut. Niemand kann unsere Geldflüsse mehr nachverfolgen.';
    } else {
      enhanced += '\n\n*schiebt Dokumente* Die Strukturen sind komplex, aber notwendig. Je länger wir aktiv sind, desto wichtiger wird Verschleierung.';
    }
  }

  const relevantRecs = contextData.recommendations.filter(rec => rec.npcId === npcId);
  if (relevantRecs.length > 0 && relevantRecs[0].priority !== 'low') {
    const rec = relevantRecs[0];
    enhanced += `\n\n\u{1F4A1} *Übrigens:* ${rec.message}`;
  }

  return enhanced;
}

function getRecommendationReaction(
  npcId: string,
  type: 'followed' | 'ignored'
): Array<{ id: string; text_de: string; text_en: string; mood: string }> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dialogues = dialoguesData as any;
    const reactions = dialogues?.special_dialogues?.recommendation_reactions;

    if (!reactions || !reactions[npcId]) {
      return [];
    }

    return reactions[npcId][type] || [];
  } catch (error) {
    storyLogger.error('Failed to load recommendation reactions:', error);
    return [];
  }
}

// ============================================
// HOOK
// ============================================

export function useNPCInteraction(engine: StoryEngineAdapter) {
  const [npcs, setNpcs] = useState<NPCState[]>(engine.getAllNPCs());
  const [activeNpcId, setActiveNpcId] = useState<string | null>(null);
  const [currentDialog, setCurrentDialog] = useState<DialogState | null>(null);

  // ============================================
  // SYNC
  // ============================================

  const sync = useCallback(() => {
    setNpcs(engine.getAllNPCs());
  }, [engine]);

  // ============================================
  // ACTIONS
  // ============================================

  const dismissDialog = useCallback(() => {
    setCurrentDialog(null);
    setActiveNpcId(null);
  }, []);

  const continueDialog = useCallback((
    gamePhase: GamePhase,
    onGenerateRecommendations: () => void
  ) => {
    if (gamePhase === 'tutorial') {
      onGenerateRecommendations();
    }
    setCurrentDialog(null);
  }, []);

  const handleDialogChoice = useCallback((
    choiceId: string,
    crossHookRefs: {
      recommendations: AdvisorRecommendation[];
      betrayalStates: Map<string, BetrayalState>;
    }
  ) => {
    // TD-006: Handle NPC topic choices
    if (choiceId.startsWith('topic_') && activeNpcId) {
      const topic = choiceId.replace('topic_', '');
      const npc = engine.getNPCState(activeNpcId);
      if (npc) {
        const baseResponse = engine.getNPCDialogue(activeNpcId, { type: 'topic', subtype: topic });
        if (baseResponse) {
          const currentResources = engine.getResources();
          const betrayalState = crossHookRefs.betrayalStates.get(activeNpcId);
          const currentPhase = engine.getCurrentPhase();

          const enhancedResponse = enhanceTopicResponse(
            baseResponse,
            topic,
            activeNpcId,
            {
              recommendations: crossHookRefs.recommendations,
              betrayalState: betrayalState ? {
                warningLevel: betrayalState.warningLevel,
                betrayalRisk: betrayalState.betrayalRisk,
                grievances: betrayalState.grievances,
              } : undefined,
              phase: currentPhase.number,
              budget: currentResources.budget,
              influence: 100 - currentResources.attention,
            }
          );

          setCurrentDialog({
            speaker: npc.name,
            speakerTitle: npc.role_de,
            text: enhancedResponse,
            mood: 'neutral',
            choices: [{ id: 'back_to_npc', text: 'Zurück' }],
          });
          return;
        }
      }
    }

    // Handle going back to NPC greeting
    if (choiceId === 'back_to_npc' && activeNpcId) {
      const npc = engine.getNPCState(activeNpcId);
      if (npc) {
        const greeting = engine.getNPCDialogue(activeNpcId, { type: 'greeting' });
        const topics = engine.getNPCTopics(activeNpcId);
        const topicChoices = topics.map(topic => ({
          id: `topic_${topic}`,
          text: getTopicLabel(topic),
        }));

        setCurrentDialog({
          speaker: npc.name,
          speakerTitle: npc.role_de,
          text: greeting || 'Was gibt es?',
          mood: npc.inCrisis ? 'angry' :
                npc.currentMood === 'positive' ? 'happy' :
                npc.currentMood === 'concerned' ? 'worried' :
                npc.currentMood === 'upset' ? 'angry' : 'neutral',
          choices: topicChoices.length > 0 ? [
            ...topicChoices,
            { id: 'dismiss', text: 'Auf Wiedersehen' },
          ] : undefined,
        });
      }
      return;
    }

    // Handle dismiss
    if (choiceId === 'dismiss' || choiceId === 'continue') {
      setCurrentDialog(null);
      setActiveNpcId(null);
      return;
    }

    // Default: close dialog
    playSound('click');
    setCurrentDialog(null);
  }, [activeNpcId, engine]);

  const interactWithNpc = useCallback((
    npcId: string,
    crossHookRefs: {
      recommendationTracking: Map<string, { followed: number; ignored: number; lastFollowed?: number; lastIgnored?: number }>;
      recommendations: AdvisorRecommendation[];
      betrayalStates: Map<string, BetrayalState>;
    }
  ) => {
    const npc = engine.getNPCState(npcId);
    if (!npc) return;

    setActiveNpcId(npcId);

    const tracking = crossHookRefs.recommendationTracking.get(npcId);
    const currentPhase = engine.getCurrentPhase().number;
    let greetingText = engine.getNPCDialogue(npcId, { type: 'greeting' }) || 'Was gibt es?';
    let mood: 'neutral' | 'happy' | 'angry' | 'worried' | 'suspicious' = npc.inCrisis ? 'angry' :
          npc.currentMood === 'positive' ? 'happy' :
          npc.currentMood === 'concerned' ? 'worried' :
          npc.currentMood === 'upset' ? 'angry' : 'neutral';

    if (tracking) {
      const recentlyFollowed = tracking.lastFollowed && (currentPhase - tracking.lastFollowed) <= 2;
      const recentlyIgnored = tracking.lastIgnored && (currentPhase - tracking.lastIgnored) <= 2;

      if (recentlyFollowed && tracking.followed > 0) {
        const reactions = getRecommendationReaction(npcId, 'followed');
        if (reactions.length > 0) {
          const reaction = reactions[Math.floor(Math.random() * reactions.length)];
          greetingText = reaction.text_de;
          mood = reaction.mood as typeof mood || 'happy';
          storyLogger.info(`[DIALOG] ${npcId} reacts positively to followed recommendation`);
        }
      } else if (recentlyIgnored && tracking.ignored > 0) {
        const reactions = getRecommendationReaction(npcId, 'ignored');
        if (reactions.length > 0) {
          const reaction = reactions[Math.floor(Math.random() * reactions.length)];
          greetingText = reaction.text_de;
          mood = reaction.mood as typeof mood || 'worried';
          storyLogger.info(`[DIALOG] ${npcId} reacts negatively to ignored recommendation`);
        }
      }
    }

    const npcRecommendations = crossHookRefs.recommendations.filter(rec => rec.npcId === npcId);
    let recommendationText: string | undefined;
    if (npcRecommendations.length > 0) {
      const topRec = npcRecommendations[0];
      recommendationText = `${topRec.message} (Priorität: ${topRec.priority.toUpperCase()})`;
    }

    const betrayalState = crossHookRefs.betrayalStates.get(npcId);
    let betrayalWarning: string | undefined;
    if (betrayalState && betrayalState.warningLevel >= 2) {
      const riskPercent = Math.round(betrayalState.betrayalRisk);
      const warningLabels = ['', 'Leicht besorgt', 'Unzufrieden', 'Kritisch', 'GEFAHR!'];
      betrayalWarning = `${warningLabels[betrayalState.warningLevel]} - Verrats-Risiko: ${riskPercent}%`;
    }

    const topics = engine.getNPCTopics(npcId);
    const topicChoices = topics.map(topic => ({
      id: `topic_${topic}`,
      text: getTopicLabel(topic),
    }));

    setCurrentDialog({
      speaker: npc.name,
      speakerTitle: npc.role_de,
      text: greetingText,
      mood,
      npcRecommendation: recommendationText,
      npcBetrayalWarning: betrayalWarning,
      choices: topicChoices.length > 0 ? [
        ...topicChoices,
        { id: 'dismiss', text: 'Auf Wiedersehen' },
      ] : undefined,
    });
  }, [engine]);

  // ============================================
  // RETURN
  // ============================================

  return {
    state: { npcs, activeNpcId, currentDialog },
    actions: {
      interactWithNpc,
      handleDialogChoice,
      dismissDialog,
      continueDialog,
    },
    sync,
    // Exposed setters for orchestrator
    setNpcs,
    setActiveNpcId,
    setCurrentDialog,
  };
}
