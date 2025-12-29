/**
 * CrisisMomentSystem - Handles critical decision points in Story Mode
 *
 * Crisis Moments are dramatic events that require player choice.
 * They create tension and have lasting consequences.
 *
 * Based on event-chains.json and designed for platinum-level gameplay.
 */

import eventChainsData from '../../data/game/event-chains.json';

// ============================================
// TYPES
// ============================================

export interface CrisisChoice {
  id: string;
  text_de: string;
  text_en: string;
  cost: {
    budget?: number;
    attention?: number;
    risk?: number;
  };
  effects: CrisisEffect[];
  consequence_de: string;
  consequence_en: string;
  isRisky?: boolean;
  requiresNPC?: string;  // NPC ID needed for this option
}

export interface CrisisEffect {
  type: 'trust_delta' | 'resource_bonus' | 'emotional_delta' | 'spawn_defensive' |
        'unlock_action' | 'trigger_chain' | 'npc_reaction' | 'objective_progress';
  target?: string;
  targetCategory?: string;
  value?: number | string;
}

export interface CrisisMoment {
  id: string;
  name_de: string;
  name_en: string;
  description_de: string;
  description_en: string;
  newsTickerText_de: string;
  newsTickerText_en: string;
  iconType: string;
  choices: CrisisChoice[];
  chainTo?: string;  // ID of follow-up crisis
  deadline?: number; // Phases until auto-resolution
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ActiveCrisis {
  id: string;
  crisisId: string;
  crisis: CrisisMoment;
  triggeredPhase: number;
  expiresPhase?: number;
  resolved: boolean;
  choiceMade?: string;
}

export interface CrisisResolution {
  crisisId: string;
  choiceId: string;
  effects: CrisisEffect[];
  consequence_de: string;
  consequence_en: string;
  triggeredChain?: string;
}

// ============================================
// CRISIS DEFINITIONS (from event-chains.json)
// ============================================

interface RawEventChain {
  id: string;
  name: string;
  description: string;
  triggerType: string;
  condition?: string;
  probability?: number;
  triggerRound?: number;
  effects: any[];
  newsTickerText: string;
  iconType: string;
  playerChoice?: {
    text: string;
    cost: any;
    effects: any[];
    consequence: string;
  }[];
  chainTo?: string;
}

// ============================================
// CRISIS MOMENT SYSTEM CLASS
// ============================================

export class CrisisMomentSystem {
  private crisisDefinitions: Map<string, CrisisMoment> = new Map();
  private activeCrises: Map<string, ActiveCrisis> = new Map();
  private resolvedCrises: string[] = [];
  private chainQueue: string[] = [];  // Crisis IDs to trigger next

  constructor() {
    this.loadCrisisDefinitions();
  }

  private loadCrisisDefinitions(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawData = eventChainsData as RawEventChain[];

    for (const raw of rawData) {
      if (!raw.playerChoice || raw.playerChoice.length === 0) continue;

      const crisis: CrisisMoment = {
        id: raw.id,
        name_de: this.translateName(raw.name),
        name_en: raw.name,
        description_de: this.translateDescription(raw.description),
        description_en: raw.description,
        newsTickerText_de: this.translateNewsTicker(raw.newsTickerText),
        newsTickerText_en: raw.newsTickerText,
        iconType: raw.iconType,
        choices: raw.playerChoice.map((choice, index) => this.convertChoice(choice, index)),
        chainTo: raw.chainTo,
        deadline: raw.triggerRound || 3,
        severity: this.determineSeverity(raw),
      };

      this.crisisDefinitions.set(crisis.id, crisis);
    }

    console.log(`[CrisisMomentSystem] Loaded ${this.crisisDefinitions.size} crisis definitions`);
  }

  private convertChoice(choice: any, index: number): CrisisChoice {
    return {
      id: `choice_${index}`,
      text_de: this.translateChoiceText(choice.text),
      text_en: choice.text,
      cost: {
        budget: choice.cost?.money,
        attention: choice.cost?.attention,
      },
      effects: choice.effects || [],
      consequence_de: this.translateConsequence(choice.consequence),
      consequence_en: choice.consequence,
      isRisky: this.isRiskyChoice(choice),
    };
  }

  private determineSeverity(raw: RawEventChain): 'low' | 'medium' | 'high' | 'critical' {
    // Determine based on effects and trigger conditions
    if (raw.condition?.includes('detectionRisk > 0.7')) return 'critical';
    if (raw.condition?.includes('detectionRisk > 0.6')) return 'high';
    if (raw.condition?.includes('detectionRisk > 0.5')) return 'medium';
    return 'low';
  }

  private isRiskyChoice(choice: any): boolean {
    const text = choice.text.toLowerCase();
    return text.includes('attack') ||
           text.includes('double down') ||
           text.includes('discredit') ||
           text.includes('infiltrate') ||
           text.includes('overwhelm');
  }

  // Translation helpers (German versions)
  private translateName(name: string): string {
    const translations: Record<string, string> = {
      'Anonymous Tip': 'Anonymer Hinweis',
      'Investigation Results': 'Ermittlungsergebnisse',
      'Content Goes Viral': 'Inhalt wird viral',
      'Platform Policy Update': 'Plattform-Richtlinienänderung',
      'Mass Account Suspensions': 'Massenhafte Kontosperrungen',
      'Foreign Influence Allegations': 'Vorwürfe ausländischer Einflussnahme',
      'Academic Research Exposes Tactics': 'Akademische Studie enthüllt Taktiken',
      'Influencer Approaches': 'Influencer zeigt Interesse',
      'Citizen Fact-Checkers Mobilize': 'Bürger-Faktenchecker mobilisieren',
      'Social Media Algorithm Update': 'Social-Media-Algorithmus-Update',
    };
    return translations[name] || name;
  }

  private translateDescription(description: string): string {
    // For now, keep English for longer descriptions
    // In production, this would use a translation service
    return description;
  }

  private translateNewsTicker(text: string): string {
    // Keep emojis, translate key phrases
    return text
      .replace('Anonymous tip received', 'Anonymer Hinweis eingegangen')
      .replace('Controversial content trending', 'Kontroverser Inhalt trending')
      .replace('Tech platforms tighten', 'Tech-Plattformen verschärfen')
      .replace('Foreign interference suspected', 'Ausländische Einmischung vermutet')
      .replace('Academic study exposes', 'Akademische Studie enthüllt')
      .replace('Grassroots fact-checking movement', 'Faktencheck-Bewegung gewinnt')
      .replace('Algorithm changes', 'Algorithmus-Änderungen');
  }

  private translateChoiceText(text: string): string {
    const translations: Record<string, string> = {
      // Whistleblower crisis
      'Accelerate campaign - Strike before investigation gains traction':
        'Kampagne beschleunigen - Zuschlagen bevor die Untersuchung Fahrt aufnimmt',
      'Lay low - Pause operations and reduce detection':
        'Abtauchen - Operationen pausieren und Entdeckungsrisiko senken',
      'Discredit whistleblower - Launch counter-narrative':
        'Whistleblower diskreditieren - Gegen-Narrativ starten',

      // Viral content crisis
      'Double down - Amplify with coordinated bot network':
        'Verdoppeln - Mit koordiniertem Bot-Netzwerk verstärken',
      'Ride the wave - Let it spread organically':
        'Die Welle reiten - Organisch verbreiten lassen',
      'Distance yourself - Claim it was \'satire\'':
        'Distanzieren - Als "Satire" bezeichnen',

      // Platform policy crisis
      'Adapt tactics - Invest in more sophisticated methods':
        'Taktik anpassen - In ausgefeiltere Methoden investieren',
      'Shift platforms - Move operations to alternative networks':
        'Plattform wechseln - Operationen auf alternative Netzwerke verlagern',
      'Legal challenge - Sue platform claiming censorship':
        'Rechtlich vorgehen - Plattform wegen Zensur verklagen',

      // Foreign influence crisis
      'Deny everything - Claim it\'s a witch hunt':
        'Alles abstreiten - Als Hexenjagd bezeichnen',
      'Provide \'evidence\' - Create fake documentation of domestic origin':
        'Beweise liefern - Gefälschte Dokumentation inländischer Herkunft erstellen',
      'Go dark - Completely shut down operations':
        'Untertauchen - Operationen komplett einstellen',

      // Academic study crisis
      'Attack the researchers - Discredit their methodology':
        'Forscher attackieren - Deren Methodik diskreditieren',
      'Adapt and evolve - Develop new techniques':
        'Anpassen und entwickeln - Neue Techniken entwickeln',
      'Embrace transparency - Claim you\'re conducting research too':
        'Transparenz vortäuschen - Behaupten, selbst zu forschen',

      // Influencer crisis
      'Full partnership - Pay for consistent amplification':
        'Volle Partnerschaft - Für konstante Verstärkung bezahlen',
      'Subtle coordination - Light collaboration':
        'Subtile Koordination - Lockere Zusammenarbeit',
      'Decline - Too risky to involve public figures':
        'Ablehnen - Zu riskant, öffentliche Personen einzubeziehen',

      // Grassroots crisis
      'Infiltrate - Plant agents in their groups':
        'Infiltrieren - Agenten in deren Gruppen einschleusen',
      'Overwhelm - Flood with contradictory \'evidence\'':
        'Überfluten - Mit widersprüchlichen Beweisen überschwemmen',
      'Ignore - Focus elsewhere':
        'Ignorieren - Auf anderes konzentrieren',

      // Algorithm crisis
      'Game the algorithm - Hire experts to find exploits':
        'Algorithmus austricksen - Experten für Exploits engagieren',
      'Shift content strategy - Make it look more legitimate':
        'Content-Strategie anpassen - Legitimer erscheinen lassen',
      'Accept the hit - Wait for next opportunity':
        'Rückschlag akzeptieren - Auf nächste Gelegenheit warten',
    };

    return translations[text] || text;
  }

  private translateConsequence(consequence: string): string {
    const translations: Record<string, string> = {
      'Gain resources but risk exposure': 'Ressourcengewinn aber Enttarnungsrisiko',
      'Network recovers slightly but buys time': 'Netzwerk erholt sich leicht, gewinnt Zeit',
      'Confuse media but increase attention': 'Medien verwirren, aber mehr Aufmerksamkeit',
      'Massive trust damage but huge detection risk': 'Massiver Vertrauensschaden, hohes Enttarnungsrisiko',
      'Moderate impact with controlled risk': 'Moderater Effekt mit kontrolliertem Risiko',
      'Minimal impact but reduces detection': 'Minimaler Effekt, reduzierte Entdeckung',
      'Expensive but maintains operational capacity': 'Teuer aber operative Kapazität erhalten',
      'Lose some reach but evade enforcement': 'Etwas Reichweite verlieren, aber Durchsetzung umgehen',
      'Draw sympathetic attention but expensive': 'Sympathie gewinnen, aber teuer',
      'Polarizes the narrative further': 'Polarisiert das Narrativ weiter',
      'May convince experts but risky': 'Könnte Experten überzeugen, aber riskant',
      'Major setback but avoids investigation': 'Großer Rückschlag, aber Untersuchung vermeiden',
      'Undermines academic credibility': 'Untergräbt akademische Glaubwürdigkeit',
      'Expensive but stays ahead of defenders': 'Teuer aber Verteidigern voraus bleiben',
      'Confuses the narrative': 'Verwirrt das Narrativ',
      'Massive reach but expensive and risky': 'Massive Reichweite aber teuer und riskant',
      'Good impact with less exposure': 'Guter Effekt mit weniger Sichtbarkeit',
      'Missed opportunity but safer': 'Verpasste Gelegenheit aber sicherer',
      'Disrupt from within but high risk': 'Von innen stören aber hohes Risiko',
      'Confusion strategy but draws attention': 'Verwirrungsstrategie aber zieht Aufmerksamkeit',
      'They gain ground but you avoid escalation': 'Sie gewinnen Boden, aber Eskalation vermieden',
      'Expensive but restores reach': 'Teuer aber Reichweite wiederhergestellt',
      'Moderate effectiveness': 'Moderate Wirksamkeit',
      'Temporary setback': 'Vorübergehender Rückschlag',
    };

    return translations[consequence] || consequence;
  }

  /**
   * Check if any crises should trigger based on current game state
   */
  checkForCrises(gameState: {
    phase: number;
    risk: number;
    attention: number;
    actionCount: number;
    lowTrustActors: number;
  }): CrisisMoment[] {
    const triggered: CrisisMoment[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawData = eventChainsData as RawEventChain[];

    for (const raw of rawData) {
      // Skip if no player choices or already active/resolved
      if (!raw.playerChoice || raw.playerChoice.length === 0) continue;
      if (this.activeCrises.has(raw.id)) continue;
      if (this.resolvedCrises.includes(raw.id)) continue;

      // Check if in chain queue
      if (this.chainQueue.includes(raw.id)) {
        const crisis = this.crisisDefinitions.get(raw.id);
        if (crisis) {
          triggered.push(crisis);
          this.chainQueue = this.chainQueue.filter(id => id !== raw.id);
        }
        continue;
      }

      // Check trigger conditions
      let shouldTrigger = false;

      if (raw.triggerType === 'conditional' && raw.condition) {
        // Parse condition (simplified evaluation)
        shouldTrigger = this.evaluateCondition(raw.condition, gameState);
      } else if (raw.triggerType === 'random') {
        const probability = raw.probability || 0.2;
        shouldTrigger = Math.random() < probability;
      }

      // Check probability even for conditional triggers
      if (shouldTrigger && raw.probability) {
        shouldTrigger = Math.random() < raw.probability;
      }

      if (shouldTrigger) {
        const crisis = this.crisisDefinitions.get(raw.id);
        if (crisis) {
          triggered.push(crisis);
        }
      }
    }

    // Activate triggered crises
    for (const crisis of triggered) {
      this.activeCrises.set(crisis.id, {
        id: `crisis_${crisis.id}_${gameState.phase}`,
        crisisId: crisis.id,
        crisis,
        triggeredPhase: gameState.phase,
        expiresPhase: crisis.deadline ? gameState.phase + crisis.deadline : undefined,
        resolved: false,
      });
    }

    return triggered;
  }

  private evaluateCondition(condition: string, state: {
    phase: number;
    risk: number;
    attention: number;
    actionCount: number;
    lowTrustActors: number;
  }): boolean {
    // Simple condition evaluation
    // Format: "detectionRisk > 0.6 && round > 8"
    try {
      // Convert condition to evaluable form
      let expr = condition
        .replace(/detectionRisk/g, String(state.risk / 100))
        .replace(/round/g, String(state.phase))
        .replace(/lowTrustCount/g, String(state.lowTrustActors));

      // Very basic evaluation - only handles simple comparisons
      if (expr.includes('&&')) {
        const parts = expr.split('&&').map(p => p.trim());
        return parts.every(p => this.evaluateSimpleExpr(p));
      }

      return this.evaluateSimpleExpr(expr);
    } catch {
      return false;
    }
  }

  private evaluateSimpleExpr(expr: string): boolean {
    // Handle simple comparisons like "0.7 > 0.6"
    const gtMatch = expr.match(/([\d.]+)\s*>\s*([\d.]+)/);
    if (gtMatch) {
      return parseFloat(gtMatch[1]) > parseFloat(gtMatch[2]);
    }

    const ltMatch = expr.match(/([\d.]+)\s*<\s*([\d.]+)/);
    if (ltMatch) {
      return parseFloat(ltMatch[1]) < parseFloat(ltMatch[2]);
    }

    return false;
  }

  /**
   * Resolve a crisis with a player choice
   */
  resolveCrisis(crisisId: string, choiceId: string, currentPhase: number): CrisisResolution | null {
    const active = this.activeCrises.get(crisisId);
    if (!active || active.resolved) return null;

    const choice = active.crisis.choices.find(c => c.id === choiceId);
    if (!choice) return null;

    // Mark as resolved
    active.resolved = true;
    active.choiceMade = choiceId;
    this.resolvedCrises.push(crisisId);
    this.activeCrises.delete(crisisId);

    // Queue chain crisis if any
    if (active.crisis.chainTo) {
      this.chainQueue.push(active.crisis.chainTo);
    }

    return {
      crisisId,
      choiceId,
      effects: choice.effects,
      consequence_de: choice.consequence_de,
      consequence_en: choice.consequence_en,
      triggeredChain: active.crisis.chainTo,
    };
  }

  /**
   * Get active crises
   */
  getActiveCrises(): ActiveCrisis[] {
    return Array.from(this.activeCrises.values()).filter(c => !c.resolved);
  }

  /**
   * Get most urgent crisis (for display)
   */
  getMostUrgentCrisis(): ActiveCrisis | null {
    const active = this.getActiveCrises();
    if (active.length === 0) return null;

    // Sort by severity and expiration
    active.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const aSeverity = severityOrder[a.crisis.severity] || 0;
      const bSeverity = severityOrder[b.crisis.severity] || 0;

      if (aSeverity !== bSeverity) return bSeverity - aSeverity;

      // If same severity, prioritize by deadline
      const aExpires = a.expiresPhase || Infinity;
      const bExpires = b.expiresPhase || Infinity;
      return aExpires - bExpires;
    });

    return active[0];
  }

  /**
   * Check for expired crises and auto-resolve with worst outcome
   */
  cleanupExpiredCrises(currentPhase: number): CrisisResolution[] {
    const expired: CrisisResolution[] = [];

    for (const active of this.activeCrises.values()) {
      if (active.expiresPhase && currentPhase > active.expiresPhase && !active.resolved) {
        // Auto-resolve with the "safe" option (usually the last one)
        const safeChoice = active.crisis.choices[active.crisis.choices.length - 1];
        const resolution = this.resolveCrisis(active.crisisId, safeChoice.id, currentPhase);
        if (resolution) {
          expired.push(resolution);
          console.log(`[CRISIS] Auto-resolved expired: ${active.crisis.name_en}`);
        }
      }
    }

    return expired;
  }

  /**
   * Export state for save/load
   */
  exportState(): {
    activeCrises: [string, ActiveCrisis][];
    resolvedCrises: string[];
    chainQueue: string[];
  } {
    return {
      activeCrises: Array.from(this.activeCrises.entries()),
      resolvedCrises: this.resolvedCrises,
      chainQueue: this.chainQueue,
    };
  }

  /**
   * Import state
   */
  importState(state: ReturnType<typeof this.exportState>): void {
    this.activeCrises = new Map(state.activeCrises);
    this.resolvedCrises = state.resolvedCrises || [];
    this.chainQueue = state.chainQueue || [];
  }

  /**
   * Reset system
   */
  reset(): void {
    this.activeCrises.clear();
    this.resolvedCrises = [];
    this.chainQueue = [];
  }
}

// Singleton instance
let crisisMomentSystemInstance: CrisisMomentSystem | null = null;

export function getCrisisMomentSystem(): CrisisMomentSystem {
  if (!crisisMomentSystemInstance) {
    crisisMomentSystemInstance = new CrisisMomentSystem();
  }
  return crisisMomentSystemInstance;
}

export function resetCrisisMomentSystem(): void {
  if (crisisMomentSystemInstance) {
    crisisMomentSystemInstance.reset();
  }
  crisisMomentSystemInstance = null;
}
