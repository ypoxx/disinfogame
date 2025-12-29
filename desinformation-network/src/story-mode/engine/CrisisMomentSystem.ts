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
      'Investigation Results': 'Ergebnis der Ermittlungen',
      'Content Goes Viral': 'Viraler Durchbruch',
      'Platform Policy Update': 'Neue Plattform-Richtlinien',
      'Mass Account Suspensions': 'Massensperrung von Konten',
      'Foreign Influence Allegations': 'Verdacht ausländischer Einflussnahme',
      'Academic Research Exposes Tactics': 'Forscher enthüllen Taktiken',
      'Influencer Approaches': 'Influencer-Kontakt',
      'Citizen Fact-Checkers Mobilize': 'Bürger-Faktenchecker formieren sich',
      'Social Media Algorithm Update': 'Algorithmus-Änderung',
    };
    return translations[name] || name;
  }

  private translateDescription(description: string): string {
    const translations: Record<string, string> = {
      'A whistleblower has contacted a journalist about suspicious online activity. They claim to have evidence of a coordinated disinformation campaign.':
        'Ein Whistleblower hat einen Journalisten über verdächtige Online-Aktivitäten informiert. Er behauptet, Beweise für eine koordinierte Desinformationskampagne zu haben.',
      'The investigation has concluded. Your earlier choices now determine the outcome.':
        'Die Ermittlungen sind abgeschlossen. Ihre früheren Entscheidungen bestimmen nun das Ergebnis.',
      'One of your disinformation pieces has unexpectedly gone viral, reaching millions. This is a critical moment - how do you capitalize on it?':
        'Einer Ihrer Desinformationsinhalte ist unerwartet viral gegangen und erreicht Millionen. Dies ist ein entscheidender Moment – wie nutzen Sie ihn?',
      'A major social media platform announces new content moderation policies targeting coordinated inauthentic behavior.':
        'Eine große Social-Media-Plattform kündigt neue Moderationsrichtlinien gegen koordiniertes unechtes Verhalten an.',
      'The platform begins enforcing its new policies. Hundreds of accounts are suspended.':
        'Die Plattform setzt ihre neuen Richtlinien durch. Hunderte Konten werden gesperrt.',
      'Government officials claim your campaign may have foreign backing. This narrative is spreading through legitimate news channels.':
        'Regierungsbeamte behaupten, Ihre Kampagne könnte ausländische Unterstützung haben. Dieses Narrativ verbreitet sich über seriöse Nachrichtenkanäle.',
      'Researchers publish a comprehensive study identifying the exact manipulation techniques you\'ve been using.':
        'Forscher veröffentlichen eine umfassende Studie, die genau die Manipulationstechniken identifiziert, die Sie verwendet haben.',
      'A controversial influencer with millions of followers is willing to amplify your narratives. They have credibility with your target audience.':
        'Ein kontroverser Influencer mit Millionen Followern ist bereit, Ihre Narrative zu verstärken. Er hat Glaubwürdigkeit bei Ihrer Zielgruppe.',
      'Ordinary citizens have started organizing to counter your disinformation. They\'re creating crowdsourced fact-checking networks.':
        'Gewöhnliche Bürger haben begonnen, sich gegen Ihre Desinformation zu organisieren. Sie bauen ein Netzwerk für gemeinschaftliches Fact-Checking auf.',
      'A major platform updates its recommendation algorithm to demote sensational content. Your reach is affected.':
        'Eine große Plattform aktualisiert ihren Empfehlungsalgorithmus, um sensationelle Inhalte herabzustufen. Ihre Reichweite ist betroffen.',
    };
    return translations[description] || description;
  }

  private translateNewsTicker(text: string): string {
    const translations: Record<string, string> = {
      '🔍 Anonymous tip received by investigative journalist':
        '🔍 Investigativjournalist erhält anonymen Hinweis',
      '📰 Investigation report published - Fact-checkers mobilizing':
        '📰 Ermittlungsbericht veröffentlicht – Faktenchecker mobilisieren',
      '🔥 Controversial content trending #1':
        '🔥 Kontroverser Inhalt auf Platz 1 der Trends',
      '🛡️ Tech platforms tighten content policies':
        '🛡️ Tech-Plattformen verschärfen Inhaltsrichtlinien',
      '🚫 Wave of account suspensions - Network disrupted':
        '🚫 Welle von Kontosperrungen – Netzwerk gestört',
      '🌍 Foreign interference suspected by authorities':
        '🌍 Behörden vermuten ausländische Einmischung',
      '📚 Academic study exposes disinformation playbook':
        '📚 Wissenschaftler enthüllen Desinformations-Handbuch',
      '⭐ High-profile figure joins conversation':
        '⭐ Prominente Persönlichkeit schaltet sich ein',
      '👥 Grassroots fact-checking movement gains momentum':
        '👥 Bürger-Faktenchecker gewinnen an Dynamik',
      '🔄 Algorithm changes reduce viral misinformation':
        '🔄 Algorithmus-Änderungen reduzieren virale Falschinformationen',
    };
    return translations[text] || text;
  }

  private translateChoiceText(text: string): string {
    const translations: Record<string, string> = {
      // Whistleblower crisis
      'Accelerate campaign - Strike before investigation gains traction':
        'Offensive verstärken – Zuschlagen, bevor die Ermittlung Fahrt aufnimmt',
      'Lay low - Pause operations and reduce detection':
        'Untertauchen – Operationen pausieren und Entdeckungsrisiko senken',
      'Discredit whistleblower - Launch counter-narrative':
        'Whistleblower diskreditieren – Gegenkampagne starten',

      // Viral content crisis
      'Double down - Amplify with coordinated bot network':
        'Alles auf eine Karte – Mit Bot-Netzwerk massiv verstärken',
      'Ride the wave - Let it spread organically':
        'Auf der Welle reiten – Organische Verbreitung nutzen',
      'Distance yourself - Claim it was \'satire\'':
        'Distanzieren – Als „Satire" deklarieren',

      // Platform policy crisis
      'Adapt tactics - Invest in more sophisticated methods':
        'Taktik anpassen – In raffiniertere Methoden investieren',
      'Shift platforms - Move operations to alternative networks':
        'Plattform wechseln – Auf alternative Netzwerke ausweichen',
      'Legal challenge - Sue platform claiming censorship':
        'Rechtsweg – Plattform wegen Zensur verklagen',

      // Foreign influence crisis
      'Deny everything - Claim it\'s a witch hunt':
        'Alles abstreiten – Als Hexenjagd abtun',
      'Provide \'evidence\' - Create fake documentation of domestic origin':
        '„Beweise" liefern – Gefälschte Dokumente inländischer Herkunft erstellen',
      'Go dark - Completely shut down operations':
        'Abtauchen – Alle Operationen sofort einstellen',

      // Academic study crisis
      'Attack the researchers - Discredit their methodology':
        'Forscher angreifen – Deren Methodik in Frage stellen',
      'Adapt and evolve - Develop new techniques':
        'Weiterentwickeln – Neue Techniken entwickeln',
      'Embrace transparency - Claim you\'re conducting research too':
        'Transparenz vortäuschen – Eigene „Forschung" behaupten',

      // Influencer crisis
      'Full partnership - Pay for consistent amplification':
        'Volle Partnerschaft – Für dauerhafte Verstärkung bezahlen',
      'Subtle coordination - Light collaboration':
        'Subtile Koordination – Lockere Zusammenarbeit',
      'Decline - Too risky to involve public figures':
        'Ablehnen – Öffentliche Personen sind zu riskant',

      // Grassroots crisis
      'Infiltrate - Plant agents in their groups':
        'Unterwandern – Agenten in deren Gruppen einschleusen',
      'Overwhelm - Flood with contradictory \'evidence\'':
        'Überfluten – Mit widersprüchlichen „Beweisen" bombardieren',
      'Ignore - Focus elsewhere':
        'Ignorieren – Woanders weitermachen',

      // Algorithm crisis
      'Game the algorithm - Hire experts to find exploits':
        'Algorithmus austricksen – Experten für Schwachstellen engagieren',
      'Shift content strategy - Make it look more legitimate':
        'Content-Strategie anpassen – Seriöser erscheinen',
      'Accept the hit - Wait for next opportunity':
        'Rückschlag akzeptieren – Auf die nächste Chance warten',
    };

    return translations[text] || text;
  }

  private translateConsequence(consequence: string): string {
    const translations: Record<string, string> = {
      'Gain resources but risk exposure':
        'Kurzfristiger Ressourcengewinn, aber erhöhtes Enttarnungsrisiko',
      'Network recovers slightly but buys time':
        'Das Netzwerk erholt sich etwas und gewinnt wertvolle Zeit',
      'Confuse media but increase attention':
        'Medien werden verwirrt, aber die Aufmerksamkeit steigt',
      'Massive trust damage but huge detection risk':
        'Massiver Vertrauensschaden bei der Zielgruppe, aber extrem hohes Entdeckungsrisiko',
      'Moderate impact with controlled risk':
        'Solide Wirkung bei überschaubarem Risiko',
      'Minimal impact but reduces detection':
        'Geringe Wirkung, aber deutlich reduziertes Entdeckungsrisiko',
      'Expensive but maintains operational capacity':
        'Kostspielig, aber die operative Handlungsfähigkeit bleibt erhalten',
      'Lose some reach but evade enforcement':
        'Etwas Reichweite geht verloren, aber die Durchsetzung wird umgangen',
      'Draw sympathetic attention but expensive':
        'Erzeugt Sympathie in bestimmten Kreisen, aber kostspielig',
      'Polarizes the narrative further':
        'Treibt die Polarisierung der öffentlichen Debatte voran',
      'May convince experts but risky':
        'Könnte Experten täuschen, birgt aber erhebliche Risiken',
      'Major setback but avoids investigation':
        'Schwerer Rückschlag, aber die Ermittlungen werden abgewendet',
      'Undermines academic credibility':
        'Untergräbt die akademische Glaubwürdigkeit der Kritiker',
      'Expensive but stays ahead of defenders':
        'Teuer, aber Sie bleiben den Verteidigern einen Schritt voraus',
      'Confuses the narrative':
        'Verwirrt das öffentliche Narrativ',
      'Massive reach but expensive and risky':
        'Enorme Reichweite, aber teuer und mit hohem Risiko verbunden',
      'Good impact with less exposure':
        'Gute Wirkung bei geringerer eigener Sichtbarkeit',
      'Missed opportunity but safer':
        'Chance verpasst, aber die sichere Variante',
      'Disrupt from within but high risk':
        'Störung von innen, aber mit erheblichem Risiko',
      'Confusion strategy but draws attention':
        'Verwirrungsstrategie funktioniert, zieht aber Aufmerksamkeit auf sich',
      'They gain ground but you avoid escalation':
        'Die Gegner gewinnen an Boden, aber eine Eskalation wird vermieden',
      'Expensive but restores reach':
        'Kostspielig, aber die Reichweite wird wiederhergestellt',
      'Moderate effectiveness':
        'Mittelmäßige Wirksamkeit',
      'Temporary setback':
        'Vorübergehender Rückschlag – nichts Dauerhaftes',
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
    this.ignoredCrises = 0;
  }

  // ============================================
  // ADDITIONAL METHODS FOR STORY ENGINE ADAPTER
  // ============================================

  private ignoredCrises: number = 0;

  /**
   * Get count of resolved crises
   */
  getResolvedCount(): number {
    return this.resolvedCrises.length;
  }

  /**
   * Get count of ignored/expired crises
   */
  getIgnoredCount(): number {
    return this.ignoredCrises;
  }

  /**
   * Mark a crisis as ignored (called when expired)
   */
  markAsIgnored(): void {
    this.ignoredCrises++;
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
