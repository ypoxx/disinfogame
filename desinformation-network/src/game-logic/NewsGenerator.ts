/**
 * NewsGenerator — Extracted from StoryEngineAdapter (Strangler Fig)
 *
 * Handles all news generation and world event processing:
 * 1. Action news (primary + world reactions)
 * 2. World events (phase-based, random, threshold-triggered, cascades)
 * 3. NPC crisis events (character-specific manifestations)
 * 4. Resource trend events (risk, attention, budget, capacity, moral)
 * 5. NPC event reactions (character-specific dialogue responses)
 *
 * Follows Strangler Fig pattern: StoryEngineAdapter delegates to this class.
 * Tracking state (triggered events, cooldowns) is owned by this class and
 * persists for the lifetime of the game instance.
 */

import type {
  StoryAction,
  ActionResult,
  StoryResources,
  StoryPhase,
  NPCState,
  NewsEvent,
  Objective,
  OpportunityWindow,
  OpportunityType,
  MemberState,
} from './StoryEngineAdapter';
import { storyLogger } from '../utils/logger';

// ============================================
// Dependency Interface (Constructor Injection)
// ============================================

export interface NewsGeneratorDeps {
  // State access (mutable references — mutations go through these directly)
  getPhase(): StoryPhase;
  getResources(): StoryResources;
  getNPCStates(): Map<string, NPCState>;
  getObjectives(): Objective[];

  // State mutation
  addNewsEvent(event: NewsEvent): void;
  addOpportunityWindow(id: string, window: OpportunityWindow): void;
  hasOpportunityWindow(id: string): boolean;

  // Subsystem refs (narrowed interface — only what NewsGenerator needs)
  betrayalSystem: {
    getBetrayalRisk(npcId: string): { risk: number } | null;
  } | null;

  // Utilities
  seededRandom(input: string): number;
  playSound(sound: string): void;

  // Constants (from story-balance-config.ts)
  WORLD_EVENT_COOLDOWN: number;
  OPPORTUNITY_WINDOW_DURATION: number;

  // Data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  worldEventsData: any;
}

// ============================================
// NewsGenerator Class
// ============================================

export class NewsGenerator {
  // Constants (injected from story-balance-config via deps)
  private readonly WORLD_EVENT_COOLDOWN: number;
  private readonly OPPORTUNITY_WINDOW_DURATION: number;

  // Tracking state (owned by NewsGenerator, persists across phases)
  private triggeredEventsThisPhase: Set<string> = new Set();
  private allTriggeredEvents: Map<string, number> = new Map();
  private worldEventCooldowns: Map<string, number> = new Map();

  constructor(private deps: NewsGeneratorDeps) {
    this.WORLD_EVENT_COOLDOWN = deps.WORLD_EVENT_COOLDOWN;
    this.OPPORTUNITY_WINDOW_DURATION = deps.OPPORTUNITY_WINDOW_DURATION;
  }

  // ============================================
  // Public Methods
  // ============================================

  /**
   * Generate news events for an executed action.
   * Only significant actions generate news.
   */
  generateActionNews(action: StoryAction, result: ActionResult): NewsEvent[] {
    const news: NewsEvent[] = [];

    // SMART FILTERING: Only significant actions generate news
    const resources = this.deps.getResources();
    const isSignificant =
      action.legality !== 'legal' ||                           // Illegal/grey actions
      (action.costs.moralWeight && action.costs.moralWeight >= 5) ||  // High moral weight
      (action.costs.risk && action.costs.risk >= 30) ||        // High risk
      (action.costs.attention && action.costs.attention >= 25) || // High attention
      action.tags.includes('viral') ||                         // Viral potential
      action.tags.includes('violent') ||                       // Violence
      resources.risk >= 60;                                    // Already hot

    if (!isSignificant) {
      // Skip news for routine, low-impact actions
      return news;
    }

    // === PRIMARY ACTION NEWS ===
    const primaryNews = this.createPrimaryActionNews(action, result);
    news.push(primaryNews);

    // === WORLD REACTION NEWS (for very significant actions) ===
    const worldReaction = this.createWorldReactionNews(action, result);
    if (worldReaction) {
      news.push(worldReaction);
    }

    return news;
  }

  /**
   * Generate world events for a phase.
   * Handles non-cascade events first, then cascade events (events triggered by other events).
   */
  generateWorldEvents(phase: number): NewsEvent[] {
    const generatedEvents: NewsEvent[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = this.deps.worldEventsData as any;

    // Clear triggered events for this phase (used for cascade tracking)
    this.triggeredEventsThisPhase.clear();

    // First pass: trigger non-cascade events
    for (const eventDef of data.worldEvents) {
      // Skip cascade events in first pass
      if (eventDef.trigger?.type === 'event_cascade') continue;

      if (this.shouldTriggerWorldEvent(eventDef, phase)) {
        const newsEvent = this.createNewsEventFromDef(eventDef, phase);
        generatedEvents.push(newsEvent);
        this.deps.addNewsEvent(newsEvent);

        // Track triggered event for cascades
        this.triggeredEventsThisPhase.add(eventDef.id);
        this.allTriggeredEvents.set(eventDef.id, phase);

        // P2-7: Record cooldown for this event
        this.worldEventCooldowns.set(eventDef.id, phase);

        // Apply event effects and create opportunity windows
        this.applyWorldEventEffects(eventDef.effects, eventDef);

        // Play world event sound
        this.deps.playSound('worldEvent');

        storyLogger.log(`[${eventDef.scale || 'national'}] World event triggered: ${eventDef.headline_de}`);
      }
    }

    // Second pass: process cascade events (events triggered by other events)
    let cascadePass = 0;
    const maxCascadePasses = 3; // Prevent infinite loops
    let newCascades = true;

    while (newCascades && cascadePass < maxCascadePasses) {
      newCascades = false;
      cascadePass++;

      for (const eventDef of data.worldEvents) {
        if (eventDef.trigger?.type !== 'event_cascade') continue;
        if (this.triggeredEventsThisPhase.has(eventDef.id)) continue; // Already triggered

        const parentEventId = eventDef.trigger.conditions?.parentEvent;
        if (!parentEventId) continue;

        // Check if parent event was triggered this phase or recently (within 2 phases)
        const parentTriggeredPhase = this.allTriggeredEvents.get(parentEventId);
        const recentlyTriggered = parentTriggeredPhase !== undefined &&
                                   (phase - parentTriggeredPhase) <= 2;

        if (this.triggeredEventsThisPhase.has(parentEventId) || recentlyTriggered) {
          // Check probability
          const eventRandom = this.deps.seededRandom(`cascade_${eventDef.id}_${phase}`);
          if (eventRandom < (eventDef.probability || 0.5)) {
            const newsEvent = this.createNewsEventFromDef(eventDef, phase);
            generatedEvents.push(newsEvent);
            this.deps.addNewsEvent(newsEvent);

            this.triggeredEventsThisPhase.add(eventDef.id);
            this.allTriggeredEvents.set(eventDef.id, phase);
            this.worldEventCooldowns.set(eventDef.id, phase);
            this.applyWorldEventEffects(eventDef.effects, eventDef);

            storyLogger.log(`[CASCADE] ${eventDef.headline_de} (triggered by ${parentEventId})`);
            newCascades = true;
          }
        }
      }
    }

    return generatedEvents;
  }

  /**
   * PHASE 2 FEEDBACK LOOP: NPC Crisis -> Visible World Events
   *
   * When NPCs are in crisis, their problems become externally visible.
   * This creates a feedback loop where internal mismanagement has external consequences.
   */
  generateNPCCrisisEvents(phase: number): NewsEvent[] {
    const crisisEvents: NewsEvent[] = [];
    const npcStates = this.deps.getNPCStates();

    // Track which NPCs are in crisis
    const npcsInCrisis = Array.from(npcStates.values()).filter(npc => npc.inCrisis);
    const lowMoraleNPCs = Array.from(npcStates.values()).filter(
      npc => npc.morale < 40 && !npc.inCrisis
    );

    // ============================================================
    // CRITICAL: Multiple NPCs in crisis = team breakdown visible
    // ============================================================
    if (npcsInCrisis.length >= 3) {
      const names = npcsInCrisis.map(npc => npc.name).join(', ');
      crisisEvents.push({
        id: `npc_crisis_team_breakdown_${phase}`,
        phase,
        headline_de: '\u26A0\uFE0F Interne Spannungen',
        headline_en: '\u26A0\uFE0F Internal Tensions',
        description_de: `Quellen berichten von Problemen in der Organisation. Mehrere Mitglieder wirken gestresst. (${names})`,
        description_en: `Sources report problems within the organization. Multiple members appear stressed. (${names})`,
        type: 'world_event',
        severity: 'warning',
        read: false,
        pinned: true,
      });

      storyLogger.log(`[Phase 2 Feedback] Team crisis visible: ${npcsInCrisis.length} NPCs in crisis`);
    }

    // ============================================================
    // CHARACTER-SPECIFIC CRISIS MANIFESTATIONS
    // ============================================================

    // IGOR in crisis -> Technical mistakes become visible
    const igor = npcStates.get('igor');
    if (igor?.inCrisis && this.deps.seededRandom(`igor_crisis_${phase}`) < 0.4) {
      crisisEvents.push({
        id: `npc_crisis_igor_${phase}`,
        phase,
        headline_de: 'Technische Anomalien entdeckt',
        headline_en: 'Technical Anomalies Detected',
        description_de: 'Sicherheitsforscher berichten von ungew\u00F6hnlichen digitalen Spuren. Fehlerhafte Verschleierung vermutet.',
        description_en: 'Security researchers report unusual digital traces. Faulty obfuscation suspected.',
        type: 'world_event',
        severity: 'warning',
        read: false,
        pinned: false,
      });

      storyLogger.log(`[Phase 2 Feedback] Igor's crisis manifests: technical errors visible`);
    }

    // MARINA in crisis -> Financial irregularities leak
    const marina = npcStates.get('marina');
    if (marina?.inCrisis && this.deps.seededRandom(`marina_crisis_${phase}`) < 0.35) {
      crisisEvents.push({
        id: `npc_crisis_marina_${phase}`,
        phase,
        headline_de: 'Unklare Geldfl\u00FCsse beobachtet',
        headline_en: 'Unclear Money Flows Observed',
        description_de: 'Finanzjournalisten verfolgen verd\u00E4chtige Transaktionen. Die Spur f\u00FChrt zu verschleierten Konten.',
        description_en: 'Financial journalists trace suspicious transactions. The trail leads to obscured accounts.',
        type: 'world_event',
        severity: 'warning',
        read: false,
        pinned: false,
      });

      storyLogger.log(`[Phase 2 Feedback] Marina's crisis manifests: financial leaks`);
    }

    // VOLKOV in crisis -> Operations become sloppy, visible
    const volkov = npcStates.get('volkov');
    if (volkov?.inCrisis && this.deps.seededRandom(`volkov_crisis_${phase}`) < 0.45) {
      crisisEvents.push({
        id: `npc_crisis_volkov_${phase}`,
        phase,
        headline_de: 'Aggressive Trolling-Kampagne auff\u00E4llig',
        headline_en: 'Aggressive Trolling Campaign Noticeable',
        description_de: 'Plattformen melden koordinierte Bel\u00E4stigung. Muster zu offensichtlich, Accounts bereits gesperrt.',
        description_en: 'Platforms report coordinated harassment. Patterns too obvious, accounts already suspended.',
        type: 'world_event',
        severity: 'info',
        read: false,
        pinned: false,
      });

      storyLogger.log(`[Phase 2 Feedback] Volkov's crisis manifests: sloppy trolling detected`);
    }

    // KATJA in crisis -> Moral messaging becomes incoherent
    const katja = npcStates.get('katja');
    if (katja?.inCrisis && this.deps.seededRandom(`katja_crisis_${phase}`) < 0.3) {
      crisisEvents.push({
        id: `npc_crisis_katja_${phase}`,
        phase,
        headline_de: 'Propaganda-Narrative inkonsistent',
        headline_en: 'Propaganda Narratives Inconsistent',
        description_de: 'Analysten bemerken widerspr\u00FCchliche Botschaften. Die Kampagne wirkt unkoordiniert und verzweifelt.',
        description_en: 'Analysts notice contradictory messages. The campaign seems uncoordinated and desperate.',
        type: 'world_event',
        severity: 'info',
        read: false,
        pinned: false,
      });

      storyLogger.log(`[Phase 2 Feedback] Katja's crisis manifests: narrative breakdown`);
    }

    // DIREKTOR in crisis -> VERY RARE but catastrophic
    const direktor = npcStates.get('direktor');
    if (direktor?.inCrisis && this.deps.seededRandom(`direktor_crisis_${phase}`) < 0.15) {
      crisisEvents.push({
        id: `npc_crisis_direktor_${phase}`,
        phase,
        headline_de: '\uD83D\uDD34 Hochrangige Quelle unter Druck',
        headline_en: '\uD83D\uDD34 High-Ranking Source Under Pressure',
        description_de: 'Ger\u00FCchte \u00FCber interne Probleme bei einer wichtigen Organisation. F\u00FChrungskrise vermutet.',
        description_en: 'Rumors about internal problems at an important organization. Leadership crisis suspected.',
        type: 'world_event',
        severity: 'danger',
        read: false,
        pinned: true,
      });

      storyLogger.log(`[Phase 2 Feedback] DIREKTOR crisis visible - catastrophic implications!`);
    }

    // ============================================================
    // LOW MORALE (not yet crisis) -> Subtle performance issues
    // ============================================================
    if (lowMoraleNPCs.length >= 2 && this.deps.seededRandom(`low_morale_${phase}`) < 0.25) {
      crisisEvents.push({
        id: `npc_low_morale_${phase}`,
        phase,
        headline_de: 'Operative Effizienz schwankt',
        headline_en: 'Operative Efficiency Fluctuates',
        description_de: 'Beobachter bemerken Unregelm\u00E4\u00DFigkeiten in sonst professionellen Operationen.',
        description_en: 'Observers notice irregularities in otherwise professional operations.',
        type: 'world_event',
        severity: 'info',
        read: false,
        pinned: false,
      });

      storyLogger.log(`[Phase 2 Feedback] Low team morale creates subtle inefficiencies`);
    }

    // ============================================================
    // BONUS: Betrayal system integration
    // ============================================================
    // If multiple NPCs are stressed AND betrayal risk is high
    // Calculate average betrayal risk across all NPCs
    let totalBetrayalRisk = 0;
    let npcCount = 0;
    for (const npcId of ['direktor', 'marina', 'volkov', 'katja', 'igor']) {
      if (this.deps.betrayalSystem) {
        const riskData = this.deps.betrayalSystem.getBetrayalRisk(npcId);
        if (riskData && typeof riskData.risk === 'number') {
          totalBetrayalRisk += riskData.risk;
          npcCount++;
        }
      }
    }
    const avgBetrayalRisk = npcCount > 0 ? totalBetrayalRisk / npcCount : 0;

    if (npcsInCrisis.length >= 2 && avgBetrayalRisk >= 60 && this.deps.seededRandom(`betrayal_leak_${phase}`) < 0.2) {
      crisisEvents.push({
        id: `npc_crisis_leak_risk_${phase}`,
        phase,
        headline_de: '\u26A0\uFE0F Potenzielle Informationslecks',
        headline_en: '\u26A0\uFE0F Potential Information Leaks',
        description_de: 'Geheimdienstberichte warnen vor Sicherheitsl\u00FCcken durch gestresste Insider.',
        description_en: 'Intelligence reports warn of security vulnerabilities from stressed insiders.',
        type: 'world_event',
        severity: 'warning',
        read: false,
        pinned: true,
      });

      storyLogger.log(`[Phase 2 Feedback -> Betrayal] Crisis + High betrayal risk = leak warnings`);
    }

    return crisisEvents;
  }

  /**
   * PHASE 2 FEEDBACK LOOP: Resource Trends -> Dynamic Events
   *
   * Monitors resource changes over time and generates world events when patterns emerge.
   * This creates awareness that the world is watching and reacting to your resource state.
   *
   * Tracked trends: Risk, Attention, Budget depletion
   */
  generateResourceTrendEvents(phase: number): NewsEvent[] {
    const trendEvents: NewsEvent[] = [];
    const resources = this.deps.getResources();

    // Skip first 2 phases - need history for trends
    if (phase < 3) return trendEvents;

    // ============================================================
    // RISING RISK TREND
    // ============================================================
    if (resources.risk >= 70) {
      // Check if risk has been high for multiple phases
      if (this.deps.seededRandom(`risk_trend_${phase}`) < 0.3) {
        trendEvents.push({
          id: `resource_trend_risk_${phase}`,
          phase,
          headline_de: '\uD83D\uDD25 Operationales Risiko steigt',
          headline_en: '\uD83D\uDD25 Operational Risk Rising',
          description_de: 'Beobachter warnen vor zunehmenden Sicherheitsl\u00FCcken. Die Organisation agiert immer riskanter.',
          description_en: 'Observers warn of increasing security gaps. The organization is acting increasingly risky.',
          type: 'world_event',
          severity: resources.risk >= 85 ? 'danger' : 'warning',
          read: false,
          pinned: resources.risk >= 85,
        });

        storyLogger.log(`[Phase 2 Feedback] High risk trend generates world attention (risk: ${resources.risk})`);
      }
    }

    // ============================================================
    // RISING ATTENTION TREND
    // ============================================================
    if (resources.attention >= 65) {
      if (this.deps.seededRandom(`attention_trend_${phase}`) < 0.35) {
        trendEvents.push({
          id: `resource_trend_attention_${phase}`,
          phase,
          headline_de: '\uD83D\uDC41\uFE0F Mediale Aufmerksamkeit w\u00E4chst',
          headline_en: '\uD83D\uDC41\uFE0F Media Attention Growing',
          description_de: 'Immer mehr Journalisten verfolgen verd\u00E4chtige Aktivit\u00E4ten. Das Scheinwerferlicht wird heller.',
          description_en: 'More and more journalists track suspicious activities. The spotlight is getting brighter.',
          type: 'world_event',
          severity: resources.attention >= 80 ? 'warning' : 'info',
          read: false,
          pinned: false,
        });

        storyLogger.log(`[Phase 2 Feedback] High attention trend becomes visible (attention: ${resources.attention})`);
      }
    }

    // ============================================================
    // BUDGET CRISIS
    // ============================================================
    if (resources.budget <= 30) {
      if (this.deps.seededRandom(`budget_trend_${phase}`) < 0.25) {
        trendEvents.push({
          id: `resource_trend_budget_${phase}`,
          phase,
          headline_de: '\uD83D\uDCB8 Finanzielle Engp\u00E4sse vermutet',
          headline_en: '\uD83D\uDCB8 Financial Bottlenecks Suspected',
          description_de: 'Quellen berichten von Budgetproblemen. Zahlungen verz\u00F6gern sich, Mitarbeiter werden unruhig.',
          description_en: 'Sources report budget problems. Payments are delayed, staff is getting restless.',
          type: 'world_event',
          severity: resources.budget <= 15 ? 'warning' : 'info',
          read: false,
          pinned: false,
        });

        storyLogger.log(`[Phase 2 Feedback] Low budget creates external visibility (budget: ${resources.budget})`);
      }
    }

    // ============================================================
    // CAPACITY DEPLETION
    // ============================================================
    if (resources.capacity <= 2) {
      if (this.deps.seededRandom(`capacity_trend_${phase}`) < 0.3) {
        trendEvents.push({
          id: `resource_trend_capacity_${phase}`,
          phase,
          headline_de: 'Operative Kapazit\u00E4t ersch\u00F6pft',
          headline_en: 'Operative Capacity Exhausted',
          description_de: 'Insider berichten von \u00DCberlastung. Die Organisation arbeitet am Limit.',
          description_en: 'Insiders report overload. The organization is working at its limit.',
          type: 'world_event',
          severity: 'info',
          read: false,
          pinned: false,
        });

        storyLogger.log(`[Phase 2 Feedback] Low capacity visible (capacity: ${resources.capacity})`);
      }
    }

    // ============================================================
    // MORAL WEIGHT ACCUMULATION
    // ============================================================
    if (resources.moralWeight >= 40) {
      if (this.deps.seededRandom(`moral_trend_${phase}`) < 0.2) {
        trendEvents.push({
          id: `resource_trend_moral_${phase}`,
          phase,
          headline_de: '\u2696\uFE0F Ethische Bedenken h\u00E4ufen sich',
          headline_en: '\u2696\uFE0F Ethical Concerns Mounting',
          description_de: 'Menschenrechtsgruppen dokumentieren fragw\u00FCrdige Praktiken. Der moralische Preis wird sichtbar.',
          description_en: 'Human rights groups document questionable practices. The moral price becomes visible.',
          type: 'world_event',
          severity: resources.moralWeight >= 60 ? 'warning' : 'info',
          read: false,
          pinned: resources.moralWeight >= 60,
        });

        storyLogger.log(`[Phase 2 Feedback] High moral weight creates external scrutiny (moral: ${resources.moralWeight})`);
      }
    }

    // ============================================================
    // COMBINED CRISIS: Multiple resources critical
    // ============================================================
    const criticalResources = [
      resources.risk >= 80,
      resources.attention >= 75,
      resources.budget <= 20,
      resources.capacity <= 1,
    ].filter(Boolean).length;

    if (criticalResources >= 3 && this.deps.seededRandom(`multi_crisis_${phase}`) < 0.4) {
      trendEvents.push({
        id: `resource_trend_multi_crisis_${phase}`,
        phase,
        headline_de: '\uD83D\uDEA8 Mehrfachkrise erkennbar',
        headline_en: '\uD83D\uDEA8 Multiple Crises Detected',
        description_de: 'Analysten warnen: Die Organisation steht unter extremem Druck. Zusammenbruch m\u00F6glich.',
        description_en: 'Analysts warn: The organization is under extreme pressure. Collapse possible.',
        type: 'world_event',
        severity: 'danger',
        read: false,
        pinned: true,
      });

      storyLogger.log(`[Phase 2 Feedback] MULTI-CRISIS: ${criticalResources} resources critical!`);
    }

    return trendEvents;
  }

  /**
   * Generate NPC reactions to world events and action news
   * PIPELINE 2: Events -> NPC Reactions
   *
   * NPCs comment on significant events with character-specific perspectives.
   * Reactions vary based on: Relationship Level, Mood, Morale, NPC Expertise
   */
  generateNPCEventReactions(events: NewsEvent[]): NewsEvent[] {
    const reactions: NewsEvent[] = [];
    const phase = this.deps.getPhase();
    const npcStates = this.deps.getNPCStates();

    for (const event of events) {
      // Determine which NPCs should react to this event
      const reactingNPCs = this.determineReactingNPCs(event);

      for (const npcId of reactingNPCs) {
        const npc = npcStates.get(npcId);
        if (!npc) continue;

        // Generate context-aware dialogue
        const dialogue = this.selectNPCEventDialogue(npcId, npc, event);
        if (!dialogue) continue;

        // Create reaction news event
        reactions.push({
          id: `news_npc_reaction_${npcId}_${phase.number}_${this.deps.seededRandom(`npc_reaction_${npcId}`)}`,
          phase: phase.number,
          headline_de: `${npc.name}: ${dialogue.headline_de}`,
          headline_en: `${npc.name}: ${dialogue.headline_en}`,
          description_de: dialogue.text_de,
          description_en: dialogue.text_en,
          type: 'npc_reaction',
          severity: dialogue.severity || 'info',
          read: false,
          pinned: false,
        });
      }
    }

    return reactions;
  }

  // ============================================
  // Private Helpers (exact copies from adapter)
  // ============================================

  /**
   * Create primary action news with contextual headlines
   */
  private createPrimaryActionNews(action: StoryAction, _result: ActionResult): NewsEvent {
    let headline_de = action.label_de;
    let headline_en = action.label_en;
    let description_de = action.narrative_de;
    let description_en = action.narrative_en;
    let severity: 'info' | 'success' | 'warning' | 'danger' = 'info';
    const resources = this.deps.getResources();
    const phase = this.deps.getPhase();

    // === TAG-BASED HEADLINES ===
    // Generate more dramatic headlines based on action tags
    if (action.tags.includes('bot')) {
      headline_de = 'Koordinierte Bot-Aktivit\u00E4t beobachtet';
      headline_en = 'Coordinated Bot Activity Observed';
      description_de = 'Experten entdecken Muster automatisierter Accounts.';
      description_en = 'Experts detect patterns of automated accounts.';
      severity = 'warning';
    } else if (action.tags.includes('trolling') || action.tags.includes('harassment')) {
      headline_de = 'Welle an Bel\u00E4stigungen in sozialen Medien';
      headline_en = 'Wave of Harassment on Social Media';
      description_de = 'Koordinierte Angriffe gegen Zielpersonen dokumentiert.';
      description_en = 'Coordinated attacks against targets documented.';
      severity = 'warning';
    } else if (action.tags.includes('blackmail')) {
      headline_de = 'Politische Figur unter mysteri\u00F6sem Druck';
      headline_en = 'Political Figure Under Mysterious Pressure';
      description_de = 'Quellen berichten von kompromittierendem Material.';
      description_en = 'Sources report compromising material.';
      severity = 'danger';
    } else if (action.tags.includes('propaganda') || action.tags.includes('content')) {
      headline_de = 'Neue Narrative verbreiten sich viral';
      headline_en = 'New Narratives Spreading Virally';
      description_de = 'Unbekannte Quellen pushen koordinierte Botschaften.';
      description_en = 'Unknown sources push coordinated messages.';
      severity = 'info';
    } else if (action.tags.includes('hacking') || action.tags.includes('technical')) {
      headline_de = 'Sicherheitsexperten warnen vor Cyber-Aktivit\u00E4t';
      headline_en = 'Security Experts Warn of Cyber Activity';
      description_de = 'Verd\u00E4chtige digitale Operationen entdeckt.';
      description_en = 'Suspicious digital operations detected.';
      severity = 'warning';
    } else if (action.tags.includes('recruiting')) {
      headline_de = 'Insider berichten von Rekrutierungsversuchen';
      headline_en = 'Insiders Report Recruitment Attempts';
      description_de = 'Quellen sprechen von geheimnisvollen Angeboten.';
      description_en = 'Sources speak of mysterious offers.';
      severity = 'info';
    } else if (action.tags.includes('violence') || action.tags.includes('violent')) {
      headline_de = 'Gewaltvolle Inhalte nehmen zu';
      headline_en = 'Violent Content on the Rise';
      description_de = 'Extremistische Rhetorik erreicht neue Intensit\u00E4t.';
      description_en = 'Extremist rhetoric reaches new intensity.';
      severity = 'danger';
    } else if (action.tags.includes('viral')) {
      headline_de = 'Mysteri\u00F6se Kampagne erreicht Millionen';
      headline_en = 'Mysterious Campaign Reaches Millions';
      description_de = 'Unklare Quellen hinter viralem Ph\u00E4nomen.';
      description_en = 'Unclear sources behind viral phenomenon.';
      severity = 'success';
    }

    // === SEVERITY ADJUSTMENTS ===
    // Override severity based on legality and moral weight
    if (action.legality === 'illegal') {
      severity = severity === 'info' ? 'warning' : severity;
      severity = severity === 'success' ? 'warning' : severity;
    }

    if (action.costs.moralWeight && action.costs.moralWeight >= 7) {
      severity = 'danger';
    }

    // === RISK-BASED MODIFICATIONS ===
    if (resources.risk >= 70) {
      headline_de = '\u26A0\uFE0F ' + headline_de;
      headline_en = '\u26A0\uFE0F ' + headline_en;
      severity = severity === 'info' ? 'warning' : severity;
    }

    return {
      id: `news_action_${action.id}_${Date.now()}`,
      phase: phase.number,
      headline_de,
      headline_en,
      description_de,
      description_en,
      type: 'action_result',
      severity,
      sourceActionId: action.id,
      read: false,
      pinned: false,
    };
  }

  /**
   * Create world reaction news for very significant actions
   * Only triggered for high-impact operations
   */
  private createWorldReactionNews(action: StoryAction, _result: ActionResult): NewsEvent | null {
    const resources = this.deps.getResources();
    const phase = this.deps.getPhase();

    // Only very significant actions get world reactions
    const needsWorldReaction =
      (action.costs.moralWeight && action.costs.moralWeight >= 8) ||
      (action.costs.risk && action.costs.risk >= 40) ||
      action.tags.includes('blackmail') ||
      action.tags.includes('violence') ||
      resources.risk >= 80;

    if (!needsWorldReaction) {
      return null;
    }

    let headline_de = 'Beh\u00F6rden \u00E4u\u00DFern Bedenken';
    let headline_en = 'Authorities Express Concerns';
    let description_de = 'Offizielle beobachten die Entwicklung mit Sorge.';
    let description_en = 'Officials monitor developments with concern.';

    // Customize based on context
    if (resources.risk >= 80) {
      headline_de = 'Druck auf Ermittlungsbeh\u00F6rden steigt';
      headline_en = 'Pressure on Investigators Mounts';
      description_de = '\u00D6ffentlichkeit fordert Aufkl\u00E4rung verd\u00E4chtiger Aktivit\u00E4ten.';
      description_en = 'Public demands clarification of suspicious activities.';
    } else if (action.tags.includes('blackmail')) {
      headline_de = 'Politische Instabilit\u00E4t nimmt zu';
      headline_en = 'Political Instability Increases';
      description_de = 'Experten warnen vor Destabilisierung.';
      description_en = 'Experts warn of destabilization.';
    } else if (action.tags.includes('violence')) {
      headline_de = 'Sicherheitskr\u00E4fte in Alarmbereitschaft';
      headline_en = 'Security Forces on Alert';
      description_de = 'Beh\u00F6rden erh\u00F6hen \u00DCberwachung extremistischer Aktivit\u00E4ten.';
      description_en = 'Authorities increase monitoring of extremist activities.';
    }

    return {
      id: `news_reaction_${action.id}_${Date.now()}`,
      phase: phase.number,
      headline_de,
      headline_en,
      description_de,
      description_en,
      type: 'world_event',
      severity: 'warning',
      read: false,
      pinned: false,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private shouldTriggerWorldEvent(eventDef: any, phase: number): boolean {
    const trigger = eventDef.trigger;
    if (!trigger) return false;

    const resources = this.deps.getResources();
    const objectives = this.deps.getObjectives();
    const npcStates = this.deps.getNPCStates();

    // P2-7: Check cooldown - prevent same event from triggering too often
    const lastTriggered = this.worldEventCooldowns.get(eventDef.id);
    if (lastTriggered !== undefined) {
      const phasesSinceLastTrigger = phase - lastTriggered;
      if (phasesSinceLastTrigger < this.WORLD_EVENT_COOLDOWN) {
        return false;  // Still on cooldown
      }
    }

    // Use seeded random for consistency
    const eventRandom = this.deps.seededRandom(`event_${eventDef.id}_${phase}`);

    switch (trigger.type) {
      case 'phase':
        // Triggers at specific phase
        if (trigger.conditions.phaseNumber && phase === trigger.conditions.phaseNumber) {
          return true;
        }
        // Triggers at phase multiples (e.g., every 24 phases)
        if (trigger.conditions.phaseMultiple && phase % trigger.conditions.phaseMultiple === 0) {
          return true;
        }
        return false;

      case 'random':
        // Random trigger with minimum phase requirement
        if (trigger.conditions.minPhase && phase < trigger.conditions.minPhase) {
          return false;
        }
        return eventRandom < (trigger.conditions.probability || eventDef.probability || 0.1);

      case 'risk_threshold':
        // Trigger when risk exceeds threshold
        if (resources.risk > (trigger.conditions.riskAbove || 50)) {
          return eventRandom < (trigger.conditions.probability || 0.2);
        }
        return false;

      case 'attention_threshold':
        // Trigger when attention exceeds threshold
        if (resources.attention > (trigger.conditions.attentionAbove || 50)) {
          return eventRandom < (trigger.conditions.probability || 0.2);
        }
        return false;

      case 'objective_progress': {
        // Trigger based on objective progress
        const objective = objectives.find(o => o.category === trigger.conditions.objective);
        if (objective && objective.currentValue >= (trigger.conditions.progressAbove || 50)) {
          return eventRandom < (trigger.conditions.probability || 0.3);
        }
        return false;
      }

      case 'relationship_threshold':
        // Trigger when any NPC relationship exceeds threshold
        for (const npc of npcStates.values()) {
          if (npc.relationshipLevel >= (trigger.conditions.anyNpcAbove || 2)) {
            return eventRandom < (trigger.conditions.probability || 0.3);
          }
        }
        return false;

      default:
        return false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private createNewsEventFromDef(eventDef: any, phase: number): NewsEvent {
    return {
      id: `world_${eventDef.id}_${phase}`,
      phase,
      headline_de: eventDef.headline_de,
      headline_en: eventDef.headline_en,
      description_de: eventDef.description_de,
      description_en: eventDef.description_en,
      type: 'world_event',
      severity: eventDef.severity || 'info',
      scale: eventDef.scale,
      region: eventDef.region,
      location: eventDef.location,
      read: false,
      pinned: false,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private applyWorldEventEffects(effects: any, eventDef?: any): void {
    if (!effects) return;

    const resources = this.deps.getResources();
    const objectives = this.deps.getObjectives();

    // Budget changes
    if (effects.budget_increase) {
      resources.budget += effects.budget_increase;
    }

    // Risk changes
    if (effects.risk_increase) {
      resources.risk = Math.min(100, resources.risk + effects.risk_increase);
    }

    // Attention changes
    if (effects.attention_increase) {
      resources.attention = Math.min(100, resources.attention + effects.attention_increase);
    }

    // Polarization boost affects trust objective
    if (effects.polarization_boost) {
      const trustObj = objectives.find(o => o.category === 'trust_reduction');
      if (trustObj) {
        trustObj.currentValue = Math.max(0, trustObj.currentValue - effects.polarization_boost);
      }
    }

    // Trust in media/government changes
    if (effects.trust_media_change || effects.trust_government_change) {
      const trustObj = objectives.find(o => o.category === 'trust_reduction');
      if (trustObj) {
        const change = (effects.trust_media_change || 0) + (effects.trust_government_change || 0);
        trustObj.currentValue = Math.max(0, trustObj.currentValue + Math.abs(change));
      }
    }

    // Westunion cohesion damage (major success for player)
    if (effects.westunion_cohesion_damage || effects.westunion_division) {
      const damage = (effects.westunion_cohesion_damage || 0) + (effects.westunion_division || 0);
      // Boost primary objective progress - DECREASE trust (currentValue goes down)
      const primaryObj = objectives.find(o => o.id === 'obj_destabilize');
      if (primaryObj) {
        // BALANCE 2026-01-14: Tuned for ~40-60% win rate at 20 phases
        primaryObj.currentValue = Math.max(0, primaryObj.currentValue - damage * 0.75);
        // Update progress: (100 - current) / (100 - target) * 100
        primaryObj.progress = Math.min(100,
          ((100 - primaryObj.currentValue) / (100 - primaryObj.targetValue)) * 100
        );
        if (primaryObj.currentValue <= primaryObj.targetValue) {
          primaryObj.completed = true;
          storyLogger.log(`\uD83C\uDFAF Objective completed: ${primaryObj.label_de}`);
        }
      }
    }

    // Regional effects (affect specific member states)
    const regionalEffects = [
      'regional_anxiety', 'regional_discontent', 'regional_unrest', 'regional_nationalism',
      'ethnic_tension', 'economic_discontent', 'separatism_boost', 'internal_division',
      'political_instability', 'historical_division', 'populist_boost'
    ];

    for (const effectType of regionalEffects) {
      if (effects[effectType] && typeof effects[effectType] === 'object') {
        // Regional effect with member state target
        for (const [region, value] of Object.entries(effects[effectType])) {
          storyLogger.log(`[Regional Effect] ${region}: ${effectType} +${value}`);
          // These regional tensions contribute to overall destabilization
          const primaryObj = objectives.find(o => o.id === 'obj_destabilize');
          if (primaryObj) {
            // BALANCE 2026-01-14: Tuned for ~40-60% win rate at 20 phases
            primaryObj.currentValue = Math.max(0, primaryObj.currentValue - (value as number) * 0.25);
            // Update progress: (100 - current) / (100 - target) * 100
            primaryObj.progress = Math.min(100,
              ((100 - primaryObj.currentValue) / (100 - primaryObj.targetValue)) * 100
            );
            if (primaryObj.currentValue <= primaryObj.targetValue) {
              primaryObj.completed = true;
              storyLogger.log(`\uD83C\uDFAF Objective completed: ${primaryObj.label_de}`);
            }
          }
        }
      }
    }

    // ====================================================
    // OPPORTUNITY WINDOWS - Create from event effects
    // ====================================================
    if (eventDef) {
      this.createOpportunityWindowsFromEvent(effects, eventDef);
    }
  }

  /**
   * Create opportunity windows from world event effects
   * Opportunity windows boost action effectiveness during specific time periods
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private createOpportunityWindowsFromEvent(effects: any, eventDef: any): void {
    const phase = this.deps.getPhase();

    const opportunityMappings: {
      effectKey: string | string[];
      type: OpportunityType;
      boostedTags: string[];
      boostedPhases: string[];
      multiplier: number;
      duration?: number;
    }[] = [
      // Election opportunities
      {
        effectKey: ['opportunity_window', 'election_interference_window'],
        type: 'elections',
        boostedTags: ['election', 'political', 'influence', 'propaganda'],
        boostedPhases: ['ta06', 'ta07'],
        multiplier: 1.5,
        duration: 12, // 1 year window for elections
      },
      // Content effectiveness boost
      {
        effectKey: 'content_effectiveness_boost',
        type: 'media_distrust',
        boostedTags: ['content', 'fake_news', 'meme', 'viral'],
        boostedPhases: ['ta03', 'ta04'],
        multiplier: 0, // Will use effect value
      },
      // Social actions boost (protests, unrest)
      {
        effectKey: 'social_actions_effectiveness',
        type: 'protest',
        boostedTags: ['polarization', 'amplification', 'social'],
        boostedPhases: ['ta04', 'ta07'],
        multiplier: 0,
      },
      // Economic crisis opportunities
      {
        effectKey: ['economic_actions_cost_reduction', 'economic_anxiety', 'financial_panic'],
        type: 'economic_anxiety',
        boostedTags: ['economic', 'exploit', 'division'],
        boostedPhases: ['ta03', 'ta07'],
        multiplier: 1.3,
      },
      // Extremism window
      {
        effectKey: 'extremism_window',
        type: 'extremism',
        boostedTags: ['polarization', 'conspiracy', 'attack'],
        boostedPhases: ['ta05', 'ta07'],
        multiplier: 1.4,
      },
      // Political chaos
      {
        effectKey: ['political_chaos_boost', 'political_instability'],
        type: 'chaos',
        boostedTags: ['political', 'influence', 'infiltration'],
        boostedPhases: ['ta06'],
        multiplier: 1.3,
      },
      // Migration debate
      {
        effectKey: ['migration_debate_boost', 'migration_narrative_boost'],
        type: 'migration',
        boostedTags: ['polarization', 'content', 'targeting'],
        boostedPhases: ['ta03', 'ta04'],
        multiplier: 1.4,
      },
      // Sovereignty concerns (anti-Westunion)
      {
        effectKey: ['anti_westunion_boost', 'anti_westunion_narrative_boost', 'sovereignty_narrative_boost'],
        type: 'sovereignty',
        boostedTags: ['political', 'content', 'propaganda'],
        boostedPhases: ['ta03', 'ta06'],
        multiplier: 1.35,
      },
      // Security tensions
      {
        effectKey: ['security_tension', 'military_tension_boost', 'fear_narrative_boost'],
        type: 'security',
        boostedTags: ['conspiracy', 'fake_news', 'emotional'],
        boostedPhases: ['ta03'],
        multiplier: 1.3,
      },
      // Division/polarization opportunities
      {
        effectKey: ['generational_divide', 'social_division', 'culture_war_boost'],
        type: 'division',
        boostedTags: ['polarization', 'division', 'targeting'],
        boostedPhases: ['ta04', 'ta07'],
        multiplier: 1.35,
      },
    ];

    for (const mapping of opportunityMappings) {
      const effectKeys = Array.isArray(mapping.effectKey) ? mapping.effectKey : [mapping.effectKey];

      for (const key of effectKeys) {
        if (effects[key]) {
          const windowId = `${eventDef.id}_${mapping.type}_${phase.number}`;

          // Don't create duplicate windows
          if (this.deps.hasOpportunityWindow(windowId)) continue;

          const multiplier = mapping.multiplier === 0
            ? (typeof effects[key] === 'number' ? effects[key] : 1.2)
            : mapping.multiplier;

          const window: OpportunityWindow = {
            id: windowId,
            type: mapping.type,
            source: eventDef.id,
            sourceHeadline_de: eventDef.headline_de || eventDef.id,
            sourceHeadline_en: eventDef.headline_en || eventDef.id,
            createdPhase: phase.number,
            expiresPhase: phase.number + (mapping.duration || this.OPPORTUNITY_WINDOW_DURATION),
            region: eventDef.region as MemberState | undefined,
            boostedTags: mapping.boostedTags,
            boostedPhases: mapping.boostedPhases,
            effectivenessMultiplier: multiplier,
            costReduction: effects[`${key}_cost_reduction`] || undefined,
            riskReduction: effects[`${key}_risk_reduction`] || undefined,
          };

          this.deps.addOpportunityWindow(windowId, window);
          this.deps.playSound('opportunityOpen');
          storyLogger.log(`[OPPORTUNITY] Window opened: ${mapping.type} (${multiplier}x) until phase ${window.expiresPhase}`);
          break; // Only create one window per mapping
        }
      }
    }

    // Also create windows for explicit narrative boosts
    const narrativeBoosts = Object.keys(effects).filter(k =>
      (k.endsWith('_narrative_boost') || k.endsWith('_boost')) &&
      typeof effects[k] === 'number' &&
      effects[k] > 1
    );

    for (const boostKey of narrativeBoosts) {
      // Extract narrative type from key (e.g., "energy_narrative_boost" -> "energy")
      const narrativeType = boostKey.replace('_narrative_boost', '').replace('_boost', '');
      const windowId = `${eventDef.id}_narrative_${narrativeType}_${phase.number}`;

      if (this.deps.hasOpportunityWindow(windowId)) continue;

      const window: OpportunityWindow = {
        id: windowId,
        type: 'narrative',
        source: eventDef.id,
        sourceHeadline_de: eventDef.headline_de || eventDef.id,
        sourceHeadline_en: eventDef.headline_en || eventDef.id,
        createdPhase: phase.number,
        expiresPhase: phase.number + this.OPPORTUNITY_WINDOW_DURATION,
        region: eventDef.region as MemberState | undefined,
        boostedTags: [narrativeType, 'content', 'propaganda'],
        boostedPhases: ['ta03', 'ta04'],
        effectivenessMultiplier: effects[boostKey],
      };

      this.deps.addOpportunityWindow(windowId, window);
      storyLogger.log(`[NARRATIVE BOOST] ${narrativeType}: ${effects[boostKey]}x until phase ${window.expiresPhase}`);
    }
  }

  /**
   * Determine which NPCs should react to an event
   * Based on: Event type, NPC specialties, Event severity, Current game state
   */
  private determineReactingNPCs(event: NewsEvent): string[] {
    const reactingNPCs: string[] = [];

    // High-severity events: Everyone reacts
    const isHighSeverity = event.severity === 'danger' || event.severity === 'warning';
    if (isHighSeverity) {
      return ['direktor', 'marina', 'volkov', 'katja', 'igor'];
    }

    // Event-type based reactions
    const eventKeywords = `${event.headline_de} ${event.headline_en} ${event.description_de}`.toLowerCase();

    // Marina: Economics, data, analysis, public opinion
    if (eventKeywords.includes('econom') ||
        eventKeywords.includes('daten') || eventKeywords.includes('data') ||
        eventKeywords.includes('umfrage') || eventKeywords.includes('poll') ||
        eventKeywords.includes('studie') || eventKeywords.includes('study')) {
      reactingNPCs.push('marina');
    }

    // Direktor: Politics, power, strategy
    if (eventKeywords.includes('politik') || eventKeywords.includes('politic') ||
        eventKeywords.includes('wahl') || eventKeywords.includes('election') ||
        eventKeywords.includes('regierung') || eventKeywords.includes('government') ||
        eventKeywords.includes('instabil') || eventKeywords.includes('instability')) {
      reactingNPCs.push('direktor');
    }

    // Volkov: Chaos, protests, social unrest, trolling opportunities
    if (eventKeywords.includes('protest') ||
        eventKeywords.includes('unruhe') || eventKeywords.includes('unrest') ||
        eventKeywords.includes('konflikt') || eventKeywords.includes('conflict') ||
        eventKeywords.includes('krise') || eventKeywords.includes('crisis') ||
        eventKeywords.includes('chaos')) {
      reactingNPCs.push('volkov');
    }

    // Katja: Media, narratives, content, viral
    if (eventKeywords.includes('media') || eventKeywords.includes('medien') ||
        eventKeywords.includes('viral') ||
        eventKeywords.includes('kampagne') || eventKeywords.includes('campaign') ||
        eventKeywords.includes('narrativ') || eventKeywords.includes('narrative') ||
        eventKeywords.includes('story')) {
      reactingNPCs.push('katja');
    }

    // Igor: Technology, security, hacking, cyber
    if (eventKeywords.includes('cyber') ||
        eventKeywords.includes('hack') ||
        eventKeywords.includes('sicherheit') || eventKeywords.includes('security') ||
        eventKeywords.includes('tech') ||
        eventKeywords.includes('bot') ||
        eventKeywords.includes('digital')) {
      reactingNPCs.push('igor');
    }

    // PIPELINE 1 SYNERGY: NPCs react to YOUR actions
    if (event.type === 'action_result' && event.sourceActionId) {
      // Dark actions: Everyone has an opinion
      if (event.severity === 'danger') {
        if (!reactingNPCs.includes('marina')) reactingNPCs.push('marina'); // Moral concern
        if (!reactingNPCs.includes('volkov')) reactingNPCs.push('volkov'); // Celebrates
      }

      // Successful campaigns: Katja + Direktor react
      if (event.severity === 'success') {
        if (!reactingNPCs.includes('katja')) reactingNPCs.push('katja');
        if (!reactingNPCs.includes('direktor')) reactingNPCs.push('direktor');
      }
    }

    // If no specific reactions, pick 1-2 random NPCs (keep it varied)
    if (reactingNPCs.length === 0 && event.severity !== 'info') {
      const allNPCs = ['direktor', 'marina', 'volkov', 'katja', 'igor'];
      const randomCount = this.deps.seededRandom(`event_reaction_count_${event.id}`) > 0.5 ? 1 : 2;
      for (let i = 0; i < randomCount; i++) {
        const npcIndex = Math.floor(this.deps.seededRandom(`event_reaction_npc_${event.id}_${i}`) * allNPCs.length);
        const randomNPC = allNPCs[npcIndex];
        if (!reactingNPCs.includes(randomNPC)) {
          reactingNPCs.push(randomNPC);
        }
      }
    }

    return reactingNPCs;
  }

  /**
   * Select appropriate dialogue for NPC reacting to event
   * Context-aware based on: Relationship, Mood, Morale, Event Type
   */
  private selectNPCEventDialogue(npcId: string, npc: NPCState, event: NewsEvent): {
    headline_de: string;
    headline_en: string;
    text_de: string;
    text_en: string;
    severity?: 'info' | 'success' | 'warning' | 'danger';
  } | null {
    const eventKeywords = `${event.headline_de} ${event.headline_en}`.toLowerCase();

    // ===== DIREKTOR =====
    if (npcId === 'direktor') {
      // Strategic observations
      if (eventKeywords.includes('politik') || eventKeywords.includes('politic')) {
        return {
          headline_de: npc.relationshipLevel >= 2 ? 'Das spielt uns in die H\u00E4nde' : 'Politische Entwicklung',
          headline_en: npc.relationshipLevel >= 2 ? 'This plays into our hands' : 'Political development',
          text_de: npc.morale >= 60
            ? '*nickt zufrieden* Perfekter Zeitpunkt f\u00FCr unsere Operationen.'
            : '*runzelt Stirn* Das k\u00F6nnte kompliziert werden.',
          text_en: npc.morale >= 60
            ? '*nods with satisfaction* Perfect timing for our operations.'
            : '*frowns* This could get complicated.',
          severity: 'info',
        };
      }

      if (eventKeywords.includes('krise') || eventKeywords.includes('crisis')) {
        return {
          headline_de: 'Krise ist Opportunit\u00E4t',
          headline_en: 'Crisis is opportunity',
          text_de: '*lehnt sich zur\u00FCck* In Chaos liegt Macht. Wir m\u00FCssen handeln.',
          text_en: '*leans back* In chaos lies power. We must act.',
          severity: 'success',
        };
      }

      // Player action reactions
      if (event.type === 'action_result') {
        if (event.severity === 'danger') {
          return {
            headline_de: npc.morale >= 50 ? 'Mutige Taktik' : 'Zu riskant',
            headline_en: npc.morale >= 50 ? 'Bold tactics' : 'Too risky',
            text_de: npc.morale >= 50
              ? 'Aggressiv, aber effektiv. So gewinnt man Kriege.'
              : '*schaut Sie an* Das wird Konsequenzen haben.',
            text_en: npc.morale >= 50
              ? 'Aggressive, but effective. This is how wars are won.'
              : '*looks at you* This will have consequences.',
            severity: npc.morale >= 50 ? 'info' : 'warning',
          };
        }
      }
    }

    // ===== MARINA =====
    if (npcId === 'marina') {
      // Data analysis
      if (eventKeywords.includes('econom') || eventKeywords.includes('daten') || eventKeywords.includes('data')) {
        return {
          headline_de: 'Interessante Daten',
          headline_en: 'Interesting data',
          text_de: npc.relationshipLevel >= 2
            ? '*zeigt Ihnen Graphen* Sehen Sie das Muster? Das k\u00F6nnen wir nutzen.'
            : '*analysiert Bildschirm* Die Zahlen sind... aufschlussreich.',
          text_en: npc.relationshipLevel >= 2
            ? '*shows you graphs* See the pattern? We can use this.'
            : '*analyzes screen* The numbers are... revealing.',
          severity: 'info',
        };
      }

      // Moral concerns on dark actions
      if (event.type === 'action_result' && event.severity === 'danger') {
        return {
          headline_de: npc.morale >= 50 ? 'Notwendiges \u00DCbel' : 'Das geht zu weit',
          headline_en: npc.morale >= 50 ? 'Necessary evil' : 'This goes too far',
          text_de: npc.morale >= 50
            ? '*seufzt* Ich verstehe die Notwendigkeit, aber... *schaut weg*'
            : '*blass* Das... das war extrem. Ich brauche... einen Moment.',
          text_en: npc.morale >= 50
            ? '*sighs* I understand the necessity, but... *looks away*'
            : '*pale* That... that was extreme. I need... a moment.',
          severity: npc.morale >= 50 ? 'warning' : 'danger',
        };
      }

      // Crisis reactions
      if (eventKeywords.includes('krise') || eventKeywords.includes('crisis')) {
        return {
          headline_de: npc.morale >= 60 ? 'Besorgniserregend' : 'Ich mache mir Sorgen',
          headline_en: npc.morale >= 60 ? 'Concerning' : 'I\'m worried',
          text_de: npc.morale >= 60
            ? 'Die Daten zeigen Eskalation. Wir sollten vorsichtig sein.'
            : '*nerv\u00F6s* Die Entwicklung ist... beunruhigend. Sehr beunruhigend.',
          text_en: npc.morale >= 60
            ? 'Data shows escalation. We should be careful.'
            : '*nervous* The development is... disturbing. Very disturbing.',
          severity: 'warning',
        };
      }
    }

    // ===== VOLKOV =====
    if (npcId === 'volkov') {
      // Chaos = Joy
      if (eventKeywords.includes('protest') || eventKeywords.includes('unruhe') || eventKeywords.includes('chaos')) {
        return {
          headline_de: npc.relationshipLevel >= 2 ? 'PERFEKT!' : 'Interessant',
          headline_en: npc.relationshipLevel >= 2 ? 'PERFECT!' : 'Interesting',
          text_de: npc.relationshipLevel >= 2
            ? '*reibt sich die H\u00E4nde* Das ist UNSER Moment! Lass uns \u00D6l ins Feuer gie\u00DFen!'
            : '*grinst* Da drau\u00DFen brodelt es. Das k\u00F6nnen wir nutzen.',
          text_en: npc.relationshipLevel >= 2
            ? '*rubs hands* This is OUR moment! Let\'s add fuel to the fire!'
            : '*grins* It\'s simmering out there. We can use this.',
          severity: 'success',
        };
      }

      // Celebrates dark actions
      if (event.type === 'action_result' && event.severity === 'danger') {
        return {
          headline_de: npc.relationshipLevel >= 1 ? 'ENDLICH Aktion!' : 'Jetzt wird\'s interessant',
          headline_en: npc.relationshipLevel >= 1 ? 'FINALLY action!' : 'Now it gets interesting',
          text_de: npc.relationshipLevel >= 1
            ? '*lacht laut* JA! Das ist echte Arbeit! Mehr davon!'
            : '*grinst* Ah, Sie zeigen Z\u00E4hne. Gut.',
          text_en: npc.relationshipLevel >= 1
            ? '*laughs loudly* YES! That\'s real work! More of this!'
            : '*grins* Ah, you show teeth. Good.',
          severity: 'success',
        };
      }

      // Bored by peaceful events
      if (event.severity === 'info') {
        return {
          headline_de: 'Langweilig',
          headline_en: 'Boring',
          text_de: '*g\u00E4hnt* Sagen Sie Bescheid, wenn was Interessantes passiert.',
          text_en: '*yawns* Let me know when something interesting happens.',
          severity: 'info',
        };
      }
    }

    // ===== KATJA =====
    if (npcId === 'katja') {
      // Media narratives
      if (eventKeywords.includes('narrativ') || eventKeywords.includes('kampagne') || eventKeywords.includes('viral')) {
        return {
          headline_de: npc.relationshipLevel >= 2 ? 'Story-Gold!' : 'Story-Potential',
          headline_en: npc.relationshipLevel >= 2 ? 'Story gold!' : 'Story potential',
          text_de: npc.relationshipLevel >= 2
            ? '*springt auf* Das ist PERFEKT f\u00FCr unsere Narrative! Lassen Sie mich ran!'
            : '*notiert eifrig* Da steckt eine Geschichte drin...',
          text_en: npc.relationshipLevel >= 2
            ? '*jumps up* This is PERFECT for our narratives! Let me at it!'
            : '*notes eagerly* There\'s a story in this...',
          severity: 'success',
        };
      }

      // Celebrates viral success
      if (event.type === 'action_result' && event.severity === 'success') {
        return {
          headline_de: npc.relationshipLevel >= 1 ? 'BRILLIANT!' : 'Das funktioniert',
          headline_en: npc.relationshipLevel >= 1 ? 'BRILLIANT!' : 'That works',
          text_de: npc.relationshipLevel >= 1
            ? '*umarmt Sie* Das ist Kunst! Pure Kunst! Die Menschen F\u00DCHLEN es!'
            : '*l\u00E4chelt* Gute Arbeit. Die Resonanz ist stark.',
          text_en: npc.relationshipLevel >= 1
            ? '*hugs you* That\'s art! Pure art! People FEEL it!'
            : '*smiles* Good work. The resonance is strong.',
          severity: 'success',
        };
      }

      // Worried by dark actions
      if (event.type === 'action_result' && event.severity === 'danger') {
        return {
          headline_de: npc.morale >= 50 ? 'Starke Methoden' : 'Das ist... heftig',
          headline_en: npc.morale >= 50 ? 'Strong methods' : 'That\'s... intense',
          text_de: npc.morale >= 50
            ? '*schluckt* Das ist... eine sehr dunkle Geschichte. Sind Sie sicher?'
            : '*starrt* Das sind keine Geschichten mehr. Das sind echte Menschen...',
          text_en: npc.morale >= 50
            ? '*swallows* That\'s... a very dark story. Are you sure?'
            : '*stares* These aren\'t stories anymore. These are real people...',
          severity: 'warning',
        };
      }
    }

    // ===== IGOR =====
    if (npcId === 'igor') {
      // Technical/security events
      if (eventKeywords.includes('cyber') || eventKeywords.includes('hack') || eventKeywords.includes('sicherheit')) {
        return {
          headline_de: event.severity === 'warning' ? 'Sicherheitsrisiko' : 'Noted',
          headline_en: event.severity === 'warning' ? 'Security risk' : 'Noted',
          text_de: event.severity === 'warning'
            ? '*tippt schnell* Erh\u00F6he Encryption. \u00C4ndere Routen. 30 Minuten.'
            : '*nickt* Tracking. Updating protocols.',
          text_en: event.severity === 'warning'
            ? '*types quickly* Increasing encryption. Changing routes. 30 minutes.'
            : '*nods* Tracking. Updating protocols.',
          severity: event.severity === 'warning' ? 'warning' : 'info',
        };
      }

      // Bot detection (player action)
      if (eventKeywords.includes('bot') && event.type === 'action_result') {
        return {
          headline_de: npc.morale >= 60 ? 'Verbesserungsbedarf' : 'Problematisch',
          headline_en: npc.morale >= 60 ? 'Needs improvement' : 'Problematic',
          text_de: npc.morale >= 60
            ? '*runzelt Stirn* Signatur zu offensichtlich. Ich optimiere.'
            : '*ernst* Sie wurden entdeckt. Ich brauche Zeit zum Refactoring.',
          text_en: npc.morale >= 60
            ? '*frowns* Signature too obvious. I\'ll optimize.'
            : '*serious* You were detected. I need time for refactoring.',
          severity: 'warning',
        };
      }

      // Minimal reactions to non-technical events
      return {
        headline_de: 'OK',
        headline_en: 'OK',
        text_de: '*nickt kurz*',
        text_en: '*nods briefly*',
        severity: 'info',
      };
    }

    return null;
  }
}
