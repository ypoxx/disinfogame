/**
 * ActionExecutor — Extracted from StoryEngineAdapter (Phase 1)
 *
 * Handles the complete action execution pipeline:
 * 1. Validate & check affordability
 * 2. Deduct costs (with NPC discounts)
 * 3. Apply effects (trust erosion, objective progress)
 * 4. Register potential consequences
 * 5. Process NPC reactions (betrayal, morale, relationships)
 * 6. Calculate actor effectiveness & narrative
 * 7. Process combos
 * 8. Track for AI arms race
 * 9. Record history & generate news
 *
 * Follows Strangler Fig pattern: StoryEngineAdapter delegates to this class.
 */

import type { StoryAction, ActionResult, StoryResources, StoryPhase, NPCState, PendingConsequence } from './StoryEngineAdapter';
import type { ActionLoader, LoadedAction } from '../story-mode/engine/ActionLoader';
import type { ConsequenceSystem } from '../story-mode/engine/ConsequenceSystem';
import type { StoryComboSystem, StoryComboActivation, ComboHint } from '../story-mode/engine/StoryComboSystem';
import type { BetrayalSystem, BetrayalWarning } from '../story-mode/engine/BetrayalSystem';
import type { StoryActorAI } from '../story-mode/engine/StoryActorAI';
import type { ExtendedActorLoader, ActorEffectivenessModifier } from '../story-mode/engine/ExtendedActorLoader';
import { StoryNarrativeGenerator } from '../story-mode/engine/StoryNarrativeGenerator';
import { playSound } from '../story-mode/utils/SoundSystem';
import { storyLogger } from '../utils/logger';

// ============================================
// Dependency Interface (Constructor Injection)
// ============================================

export interface ActionExecutorDeps {
  // State access
  getResources(): StoryResources;
  getPhase(): StoryPhase;
  getNPCStates(): Map<string, NPCState>;
  getObjectives(): import('./StoryEngineAdapter').Objective[];
  getPendingConsequences(): PendingConsequence[];
  getNewsEvents(): import('./StoryEngineAdapter').NewsEvent[];

  // State mutation
  setResources(resources: StoryResources): void;
  addPendingConsequence(consequence: PendingConsequence): void;
  addNewsEvent(event: import('./StoryEngineAdapter').NewsEvent): void;
  addActionHistory(entry: { phase: number; actionId: string; result: ActionResult }): void;

  // Subsystem access
  actionLoader: ActionLoader;
  consequenceSystem: ConsequenceSystem;
  comboSystem: StoryComboSystem;
  betrayalSystem: BetrayalSystem;
  actorAI: StoryActorAI;
  extendedActorLoader: ExtendedActorLoader;

  // Utilities
  seededRandom(input: string): number;
  convertToStoryAction(loaded: LoadedAction): StoryAction;
  generateActionNews(action: StoryAction, result: ActionResult): import('./StoryEngineAdapter').NewsEvent[];
}

// ============================================
// ActionExecutor Class
// ============================================

export class ActionExecutor {
  constructor(private deps: ActionExecutorDeps) {}

  /**
   * Execute an action — main entry point.
   * This is a 1:1 behavioral copy of StoryEngineAdapter.executeAction().
   */
  execute(actionId: string, options?: {
    targetId?: string;
    npcAssist?: string;
  }): ActionResult {
    const action = this.getActionById(actionId);
    if (!action) {
      throw new Error(`Action ${actionId} not found`);
    }

    // Check resources
    if (!this.canAffordAction(action)) {
      return {
        success: false,
        action,
        effects: [],
        resourceChanges: {},
        narrative: {
          headline_de: 'Nicht genug Ressourcen',
          headline_en: 'Not enough resources',
          description_de: 'Diese Aktion kann nicht durchgeführt werden.',
          description_en: 'This action cannot be performed.',
        },
        potentialConsequences: [],
      };
    }

    // Deduct costs
    this.deductActionCosts(action, options?.npcAssist);

    // Reduce action points
    const resources = this.deps.getResources();
    resources.actionPointsRemaining--;
    this.deps.setResources(resources);

    // Apply effects
    const effects = this.applyActionEffects(action, options);

    // Register consequences
    const potentialConsequences = this.registerPotentialConsequences(action);

    // NPC reactions (includes betrayal warnings)
    const { reactions: npcReactions, betrayalWarnings } = this.processNPCReactions(action);

    // NPC Relationship Progress
    this.updateNPCRelationships(action, options?.npcAssist);

    // NPC Morale Update
    this.updateNPCMorale(action);

    // === EXTENDED ACTORS INTEGRATION ===
    const actorModifiers = this.deps.extendedActorLoader.calculateEffectivenessModifiers(
      action.tags,
      [action.phase]
    );

    // Apply trust damage to vulnerable actors
    for (const mod of actorModifiers) {
      if (mod.isVulnerable) {
        this.deps.extendedActorLoader.applyTrustDamage(
          mod.actorId,
          5 * (action.costs.moralWeight || 1),
          mod.modifier
        );
      }
    }

    // === NARRATIVE GENERATOR INTEGRATION ===
    const storyNarrative = StoryNarrativeGenerator.generateActionNarrative({
      actionId: action.id,
      actionLabel_de: action.label_de,
      actionLabel_en: action.label_en,
      phase: action.phase,
      tags: action.tags,
      legality: action.legality,
      targetActors: actorModifiers
        .filter(m => m.isVulnerable)
        .slice(0, 3)
        .map(m => this.deps.extendedActorLoader.getActor(m.actorId)!)
        .filter(Boolean),
      npcAssist: options?.npcAssist,
      effectiveness: Math.min(100, 50 + actorModifiers.reduce((sum, m) => sum + (m.modifier - 1) * 50, 0)),
      risk: this.deps.getResources().risk,
      moralWeight: this.deps.getResources().moralWeight,
    });

    // Build result
    const result: ActionResult = {
      success: true,
      action,
      effects,
      resourceChanges: action.costs,
      narrative: {
        headline_de: storyNarrative.headline_de,
        headline_en: storyNarrative.headline_en,
        description_de: storyNarrative.description_de,
        description_en: storyNarrative.description_en,
      },
      potentialConsequences,
      npcReactions,
      actorModifiers: actorModifiers.length > 0 ? actorModifiers : undefined,
      betrayalWarnings: betrayalWarnings.length > 0 ? betrayalWarnings : undefined,
    };

    // Play appropriate sound
    if (action.legality === 'illegal' || (action.costs.moralWeight && action.costs.moralWeight > 5)) {
      playSound('moralShift');
    } else {
      playSound('success');
    }

    // Mark action as used
    this.deps.actionLoader.markAsUsed(actionId);
    this.deps.actionLoader.checkUnlocks(actionId);

    // Process combo progress
    const comboResult = this.deps.comboSystem.processAction(
      actionId,
      action.tags,
      this.deps.getPhase().number
    );

    // Apply combo effects
    if (comboResult.completedCombos.length > 0) {
      result.completedCombos = comboResult.completedCombos;

      for (const combo of comboResult.completedCombos) {
        this.applyComboBonus(combo);
        playSound('combo');

        this.deps.addNewsEvent({
          id: `news_combo_${combo.comboId}_${Date.now()}`,
          phase: this.deps.getPhase().number,
          headline_de: `Kombination: ${combo.comboName}`,
          headline_en: `Combo: ${combo.comboName}`,
          description_de: combo.description,
          description_en: combo.description,
          type: 'action_result',
          severity: 'success',
          read: false,
          pinned: false,
        });
      }
    }

    // Add combo hints
    if (comboResult.newHints.length > 0) {
      result.comboHints = comboResult.newHints;
    }

    // Track for AI arms race
    this.deps.actorAI.trackAction(actionId, action.tags, this.deps.getPhase().number);

    // Record history
    this.deps.addActionHistory({
      phase: this.deps.getPhase().number,
      actionId,
      result,
    });

    // Generate action news
    const actionNews = this.deps.generateActionNews(action, result);
    for (const news of actionNews) {
      this.deps.addNewsEvent(news);
    }

    return result;
  }

  // ============================================
  // Private helpers (exact copies from adapter)
  // ============================================

  private getActionById(id: string): StoryAction | null {
    const loaded = this.deps.actionLoader.getAction(id);
    if (!loaded) return null;
    return this.deps.convertToStoryAction(loaded);
  }

  canAffordAction(action: StoryAction): boolean {
    const costs = action.costs;
    const resources = this.deps.getResources();

    if (costs.budget) {
      const discountPercent = this.calculateNPCDiscount(action);
      const actualCost = Math.ceil(costs.budget * (1 - discountPercent / 100));
      if (resources.budget < actualCost) return false;
    }

    if (costs.capacity && resources.capacity < costs.capacity) return false;
    if (resources.actionPointsRemaining <= 0) return false;

    return true;
  }

  calculateNPCDiscount(action: StoryAction): number {
    let totalDiscount = 0;
    const npcStates = this.deps.getNPCStates();

    for (const npcId of action.npcAffinity) {
      const npc = npcStates.get(npcId);
      if (!npc) continue;

      const levelDiscount = npc.relationshipLevel * 10;
      const moraleModifier = npc.morale / 100;
      const effectiveDiscount = levelDiscount * moraleModifier;
      totalDiscount += effectiveDiscount;

      storyLogger.log(`💰 NPC ${npc.name}: ${levelDiscount}% discount × ${moraleModifier.toFixed(2)} morale = ${effectiveDiscount.toFixed(1)}%`);
    }

    return Math.min(50, totalDiscount);
  }

  private deductActionCosts(action: StoryAction, npcAssist?: string): void {
    const costs = action.costs;
    const resources = this.deps.getResources();

    const discountPercent = this.calculateNPCDiscount(action);
    const costMultiplier = 1 - (discountPercent / 100);

    if (discountPercent > 0 && costs.budget) {
      const originalCost = costs.budget;
      const discountedCost = Math.ceil(originalCost * costMultiplier);
      const saved = originalCost - discountedCost;
      storyLogger.log(`💸 Cost Reduction: ${originalCost} → ${discountedCost} (saved ${saved}, -${discountPercent.toFixed(1)}%)`);
    }

    if (costs.budget) {
      resources.budget -= Math.ceil(costs.budget * costMultiplier);
    }
    if (costs.capacity) {
      resources.capacity -= costs.capacity;
    }
    if (costs.risk) {
      resources.risk += costs.risk;
    }

    let attentionGain = costs.attention || 0;
    if (action.legality === 'illegal') {
      attentionGain += 3;
    } else if (action.legality === 'grey') {
      attentionGain += 1;
    }
    if (attentionGain > 0) {
      resources.attention = Math.min(100, resources.attention + attentionGain);
    }

    if (costs.moralWeight) {
      resources.moralWeight += costs.moralWeight;
    }

    this.deps.setResources(resources);
  }

  private applyActionEffects(action: StoryAction, options?: {
    targetId?: string;
    npcAssist?: string;
  }): ActionResult['effects'] {
    const effects: ActionResult['effects'] = [];
    const npcStates = this.deps.getNPCStates();

    const loadedAction = this.deps.actionLoader.getAction(action.id);
    if (!loadedAction || !loadedAction.effects) {
      return effects;
    }

    let effectivenessMultiplier = 1.0;
    if (options?.npcAssist && action.npcAffinity.includes(options.npcAssist)) {
      const npc = npcStates.get(options.npcAssist);
      if (npc) {
        effectivenessMultiplier = 1 + (npc.relationshipLevel * 0.1);
      }
    }

    const actionEffects = loadedAction.effects as Record<string, unknown>;

    // Content quality
    if (actionEffects.content_quality && typeof actionEffects.content_quality === 'number') {
      const value = Math.round(actionEffects.content_quality * effectivenessMultiplier * 10);
      effects.push({ type: 'content_quality', value, description_de: `Inhaltsqualität +${value}%`, description_en: `Content quality +${value}%` });
    }

    // Virality boost
    if (actionEffects.virality_boost && typeof actionEffects.virality_boost === 'number') {
      const value = Math.round(actionEffects.virality_boost * effectivenessMultiplier * 10);
      effects.push({ type: 'virality', value, description_de: `Virale Reichweite +${value}%`, description_en: `Viral reach +${value}%` });
    }

    // Trust erosion calculation
    let trustErosionValue = 0;

    if (actionEffects.trust_erosion && typeof actionEffects.trust_erosion === 'number') {
      trustErosionValue += Math.round(actionEffects.trust_erosion * effectivenessMultiplier * 10);
    }
    if (actionEffects.content_quality && typeof actionEffects.content_quality === 'number') {
      trustErosionValue += Math.round(actionEffects.content_quality * effectivenessMultiplier * 2);
    }
    if (actionEffects.virality_boost && typeof actionEffects.virality_boost === 'number') {
      trustErosionValue += Math.round(actionEffects.virality_boost * effectivenessMultiplier * 3);
    }
    if (actionEffects.polarization && typeof actionEffects.polarization === 'number') {
      trustErosionValue += Math.round(actionEffects.polarization * effectivenessMultiplier * 4);
    }
    if (actionEffects.amplification_base && typeof actionEffects.amplification_base === 'number') {
      trustErosionValue += Math.round(actionEffects.amplification_base * effectivenessMultiplier * 5);
    }
    if (actionEffects.amplification_bonus && typeof actionEffects.amplification_bonus === 'number') {
      trustErosionValue += Math.round(actionEffects.amplification_bonus * effectivenessMultiplier * 3);
    }

    // Base trust erosion for aggressive actions
    if (trustErosionValue === 0) {
      const la = this.deps.actionLoader.getAction(action.id);
      if (la) {
        const aggressivePhases = ['ta03', 'ta04', 'ta05', 'targeting'];
        if (aggressivePhases.includes(la.phase)) {
          trustErosionValue = la.legality === 'illegal' ? 3 : la.legality === 'grey' ? 2 : 1;
        }
      }
    }

    if (trustErosionValue > 0) {
      effects.push({ type: 'trust_erosion', value: trustErosionValue, description_de: `Vertrauenserosion +${trustErosionValue}%`, description_en: `Trust erosion +${trustErosionValue}%` });

      // Update primary objective
      const objectives = this.deps.getObjectives();
      const destabilizeObj = objectives.find(o => o.id === 'obj_destabilize');
      if (destabilizeObj) {
        destabilizeObj.currentValue = Math.max(0, destabilizeObj.currentValue - trustErosionValue * 1.25);
        destabilizeObj.progress = Math.min(100, ((100 - destabilizeObj.currentValue) / (100 - destabilizeObj.targetValue)) * 100);
        if (destabilizeObj.currentValue <= destabilizeObj.targetValue) {
          destabilizeObj.completed = true;
          storyLogger.log(`🎯 Objective completed: ${destabilizeObj.label_de}`);
        }
      }
    }

    // Polarization
    if (actionEffects.polarization && typeof actionEffects.polarization === 'number') {
      const value = Math.round(actionEffects.polarization * effectivenessMultiplier * 10);
      effects.push({ type: 'polarization', value, description_de: `Gesellschaftliche Spaltung +${value}%`, description_en: `Social polarization +${value}%` });
    }

    // Infrastructure boost
    if (actionEffects.infrastructure_boost && typeof actionEffects.infrastructure_boost === 'number') {
      effects.push({ type: 'infrastructure', value: actionEffects.infrastructure_boost, description_de: 'Infrastruktur ausgebaut', description_en: 'Infrastructure expanded' });
    }

    // Network reach
    if (actionEffects.network_reach && typeof actionEffects.network_reach === 'number') {
      const value = Math.round(actionEffects.network_reach * effectivenessMultiplier * 10);
      effects.push({ type: 'network', value, description_de: `Netzwerk-Reichweite +${value}%`, description_en: `Network reach +${value}%` });
    }

    // Political leverage
    if (actionEffects.political_leverage && typeof actionEffects.political_leverage === 'number') {
      const value = Math.round(actionEffects.political_leverage * effectivenessMultiplier * 10);
      effects.push({ type: 'political', value, description_de: `Politischer Einfluss +${value}%`, description_en: `Political leverage +${value}%` });
    }

    return effects;
  }

  private registerPotentialConsequences(action: StoryAction): string[] {
    let rngCounter = 0;
    const pendingFromSystem = this.deps.consequenceSystem.onActionExecuted(
      action.id,
      this.deps.getPhase().number,
      () => this.deps.seededRandom(`action_${action.id}_${this.deps.getPhase().number}_${rngCounter++}`)
    );

    const consequenceLabels: string[] = [];

    for (const pending of pendingFromSystem) {
      const def = this.deps.consequenceSystem.getDefinition(pending.consequenceId);
      if (def) {
        this.deps.addPendingConsequence({
          id: pending.id,
          consequenceId: pending.consequenceId,
          triggeredAtPhase: pending.triggeredAtPhase,
          activatesAtPhase: pending.activatesAtPhase,
          label_de: def.label_de,
          label_en: def.label_en,
          severity: def.severity,
          type: def.type,
          choices: def.player_choices.map(c => ({
            id: c.id,
            label_de: c.label_de,
            label_en: c.label_en,
            cost: c.costs ? {
              budget: c.costs.budget,
              moralWeight: c.costs.moral_weight,
            } : undefined,
            outcome_de: c.outcome_de,
            outcome_en: c.outcome_en,
          })),
        });

        consequenceLabels.push(def.label_de);
      }
    }

    return consequenceLabels;
  }

  private processNPCReactions(action: StoryAction): {
    reactions: ActionResult['npcReactions'];
    betrayalWarnings: BetrayalWarning[];
  } {
    const reactions: ActionResult['npcReactions'] = [];
    const betrayalWarnings: BetrayalWarning[] = [];
    const npcStates = this.deps.getNPCStates();

    const betrayalResult = this.deps.betrayalSystem.processAction(
      action.id,
      action.tags,
      action.costs.moralWeight || 0,
      this.deps.getPhase().number
    );

    for (const [npcId, npcState] of npcStates) {
      const npcWarnings = betrayalResult.warnings.filter(w => w.npcId === npcId);
      betrayalWarnings.push(...npcWarnings);

      for (const warning of npcWarnings) {
        const warnLevel = warning.warningLevel;
        const reactionType = warnLevel >= 4 ? 'crisis' :
                            warnLevel >= 3 ? 'negative' :
                            warnLevel >= 2 ? 'concerned' : 'neutral';

        if (warnLevel >= 2) {
          reactions.push({
            npcId,
            reaction: reactionType === 'concerned' ? 'negative' : reactionType as 'positive' | 'neutral' | 'negative' | 'crisis',
            dialogue_de: warning.warning_de,
            dialogue_en: warning.warning_en,
          });
        }

        npcState.morale = Math.max(0, npcState.morale - (warnLevel * 10));

        if (warnLevel >= 4 && !npcState.inCrisis) {
          npcState.inCrisis = true;
        }
      }
    }

    // Legacy moral weight processing
    if (action.costs.moralWeight && action.costs.moralWeight >= 3) {
      const marina = npcStates.get('marina');
      if (marina && !betrayalWarnings.some(w => w.npcId === 'marina')) {
        marina.morale -= action.costs.moralWeight * 5;
        if (marina.morale < 30 && !marina.inCrisis) {
          marina.inCrisis = true;
          reactions.push({
            npcId: 'marina',
            reaction: 'crisis',
            dialogue_de: 'Das geht zu weit. Ich kann das nicht mehr mittragen.',
            dialogue_en: 'This goes too far. I can\'t support this anymore.',
          });
        }
      }
    }

    return { reactions, betrayalWarnings };
  }

  private updateNPCRelationships(action: StoryAction, npcAssist?: string): void {
    const npcStates = this.deps.getNPCStates();

    for (const npcId of action.npcAffinity) {
      const npc = npcStates.get(npcId);
      if (!npc) continue;

      let progressGain = 10;
      if (npcAssist === npcId) {
        progressGain = 20;
      }

      npc.relationshipProgress += progressGain;

      if (npc.relationshipProgress >= 100 && npc.relationshipLevel < 3) {
        npc.relationshipLevel++;
        npc.relationshipProgress -= 100;
        storyLogger.log(`🤝 NPC ${npc.name} relationship upgraded to level ${npc.relationshipLevel}`);
        playSound('success');
        npc.currentMood = 'positive';
      }

      if (!action.costs.moralWeight || action.costs.moralWeight < 3) {
        npc.morale = Math.min(100, npc.morale + 2);
      }

      if (npc.inCrisis && npc.morale >= 50) {
        npc.inCrisis = false;
        storyLogger.log(`✅ NPC ${npc.name} recovered from crisis`);

        this.deps.addNewsEvent({
          id: `news_npc_recovery_${npc.id}_${Date.now()}`,
          phase: this.deps.getPhase().number,
          headline_de: `${npc.name} hat sich von der Krise erholt`,
          headline_en: `${npc.name} has recovered from crisis`,
          description_de: `${npc.name} scheint wieder stabiler zu sein.`,
          description_en: `${npc.name} seems more stable again.`,
          type: 'npc_event',
          severity: 'success',
          read: false,
          pinned: false,
        });
      }
    }
  }

  private updateNPCMorale(action: StoryAction): void {
    const moralWeight = action.costs.moralWeight || 0;
    if (moralWeight < 3) return;

    let baseMoraleLoss = 0;
    if (moralWeight >= 10) {
      baseMoraleLoss = 15;
    } else if (moralWeight >= 7) {
      baseMoraleLoss = 10;
    } else if (moralWeight >= 5) {
      baseMoraleLoss = 5;
    } else if (moralWeight >= 3) {
      baseMoraleLoss = 3;
    }

    const npcStates = this.deps.getNPCStates();

    for (const [npcId, npc] of npcStates) {
      let moraleLoss = baseMoraleLoss;

      // Marina is more sensitive (2x)
      if (npcId === 'marina') {
        moraleLoss *= 2;
      }

      // Volkov/Alexei enjoys dark actions (reversed)
      if (npcId === 'volkov' || npcId === 'alexei') {
        npc.morale = Math.min(100, npc.morale + baseMoraleLoss / 3);
        continue;
      }

      // Direktor is less affected (0.5x)
      if (npcId === 'direktor') {
        moraleLoss *= 0.5;
      }

      const previousMorale = npc.morale;
      npc.morale = Math.max(0, npc.morale - moraleLoss);

      this.updateNPCMood(npc);

      if (previousMorale >= 30 && npc.morale < 30 && !npc.inCrisis) {
        npc.inCrisis = true;
        storyLogger.log(`⚠️ NPC ${npc.name} entered crisis (morale: ${npc.morale})`);

        this.deps.addNewsEvent({
          id: `news_npc_crisis_${npc.id}_${Date.now()}`,
          phase: this.deps.getPhase().number,
          headline_de: `${npc.name} in Krise!`,
          headline_en: `${npc.name} in Crisis!`,
          description_de: `${npc.name} scheint mit der Situation zu kämpfen. Ein Gespräch ist dringend nötig.`,
          description_en: `${npc.name} seems to be struggling. An urgent conversation is needed.`,
          type: 'npc_event',
          severity: 'danger',
          read: false,
          pinned: true,
        });

        playSound('crisis');
      }

      if (moraleLoss >= 10) {
        storyLogger.log(`📉 NPC ${npc.name} morale: ${previousMorale} → ${npc.morale} (-${moraleLoss})`);
      }
    }
  }

  private updateNPCMood(npc: NPCState): void {
    if (npc.morale >= 70) {
      npc.currentMood = 'positive';
    } else if (npc.morale >= 50) {
      npc.currentMood = 'neutral';
    } else if (npc.morale >= 30) {
      npc.currentMood = 'concerned';
    } else {
      npc.currentMood = 'upset';
    }
  }

  private applyComboBonus(combo: StoryComboActivation): void {
    const bonus = combo.bonus;
    const resources = this.deps.getResources();
    const objectives = this.deps.getObjectives();

    if (bonus.trustReduction) {
      const trustObj = objectives.find(o => o.category === 'trust_reduction');
      if (trustObj) {
        trustObj.currentValue = Math.max(0, trustObj.currentValue - bonus.trustReduction * 50);
        trustObj.progress = Math.min(100, ((100 - trustObj.currentValue) / (100 - trustObj.targetValue)) * 100);
        if (trustObj.currentValue <= trustObj.targetValue) {
          trustObj.completed = true;
          storyLogger.log(`🎯 Objective completed via combo: ${trustObj.label_de}`);
        }
      }
    }

    if (bonus.polarizationBonus) {
      const primaryObj = objectives.find(o => o.id === 'obj_destabilize');
      if (primaryObj) {
        primaryObj.currentValue = Math.max(0, primaryObj.currentValue - bonus.polarizationBonus * 25);
        primaryObj.progress = Math.min(100, ((100 - primaryObj.currentValue) / (100 - primaryObj.targetValue)) * 100);
        if (primaryObj.currentValue <= primaryObj.targetValue) {
          primaryObj.completed = true;
          storyLogger.log(`🎯 Objective completed: ${primaryObj.label_de}`);
        }
      }
    }

    if (bonus.attentionCost) {
      resources.attention = Math.max(0, resources.attention + bonus.attentionCost);
    }
    if (bonus.attentionReduction) {
      resources.attention = Math.max(0, resources.attention - bonus.attentionReduction);
    }
    if (bonus.detectionReduction) {
      resources.risk = Math.max(0, resources.risk - bonus.detectionReduction * 100);
    }
    if (bonus.moneyRefund) {
      resources.budget += bonus.moneyRefund;
    }
    if (bonus.infrastructureGain) {
      resources.capacity = Math.min(15, resources.capacity + bonus.infrastructureGain);
    }

    this.deps.setResources(resources);
    storyLogger.log(`[COMBO BONUS] Applied: ${combo.comboName} (${combo.category})`);
  }
}
