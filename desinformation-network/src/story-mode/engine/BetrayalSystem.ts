/**
 * BetrayalSystem - NPC Betrayal Warning Signs for Story Mode
 *
 * Based on research into authoritarian collapse patterns:
 * NPCs don't betray suddenly - they show warning signs that
 * observant players can address before it's too late.
 *
 * Design Philosophy: Betrayal should feel earned, not random.
 * Players who ignore warnings deserve the consequences.
 */

// ============================================
// TYPES
// ============================================

/**
 * Warning level for NPC betrayal risk
 * 0 = Loyal (no concerns)
 * 1 = Early warning (hints of discomfort)
 * 2 = Mid warning (direct questions about ethics)
 * 3 = Critical warning (evasive behavior, external contacts)
 * 4 = Betrayal imminent (about to flip)
 */
export type BetrayalWarningLevel = 0 | 1 | 2 | 3 | 4;

/**
 * NPC's personal red lines - moral categories that trigger betrayal faster
 */
export type MoralRedLine =
  | 'violence'           // Harming innocents
  | 'children'           // Involving minors
  | 'whistleblowers'     // Attacking truth-tellers
  | 'journalists'        // Attacking press freedom
  | 'democracy'          // Direct attacks on democratic institutions
  | 'foreign_power'      // Clear foreign interference
  | 'personal_gain'      // Pure greed over ideology
  | 'colleague_harm';    // Sacrificing team members

/**
 * Betrayal state for an NPC
 */
export interface BetrayalState {
  npcId: string;
  warningLevel: BetrayalWarningLevel;
  warningsShown: string[];           // IDs of warnings already displayed
  betrayalRisk: number;              // 0-100 accumulated risk
  personalRedLines: MoralRedLine[];  // What triggers this NPC
  recentMoralActions: string[];      // Recent morally heavy actions witnessed
  lastWarningPhase: number;          // When was last warning shown
  grievances: BetrayalGrievance[];   // Specific complaints
  recoveryActions: string[];         // Actions player took to address concerns
}

/**
 * Specific grievance an NPC has
 */
export interface BetrayalGrievance {
  id: string;
  type: 'moral_action' | 'red_line_crossed' | 'low_morale' | 'overwork' | 'ignored';
  description_de: string;
  description_en: string;
  severity: number;  // 1-10
  createdPhase: number;
  addressed: boolean;
}

/**
 * Warning sign to display to player
 */
export interface BetrayalWarning {
  npcId: string;
  npcName: string;
  warningLevel: BetrayalWarningLevel;
  type: 'dialogue' | 'behavior' | 'event';
  warning_de: string;
  warning_en: string;
  suggestion_de?: string;   // What player can do
  suggestion_en?: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  grievance?: BetrayalGrievance;
  // Aliased fields for adapter integration
  level?: BetrayalWarningLevel;
  narrative_de?: string;
  narrative_en?: string;
}

/**
 * Betrayal event when NPC flips
 */
export interface BetrayalEvent {
  npcId: string;
  npcName: string;
  type: BetrayalType;
  severity: 'minor' | 'major' | 'catastrophic';
  consequence_de: string;
  consequence_en: string;
  effects: BetrayalEffect[];
  finalDialogue_de: string;
  finalDialogue_en: string;
}

/**
 * Types of betrayal
 */
export type BetrayalType =
  | 'whistleblower'     // Goes to press
  | 'defection'         // Joins opposition
  | 'sabotage'          // Internal sabotage
  | 'evidence_leak'     // Leaks documents
  | 'testimony'         // Cooperates with investigators
  | 'disappearance';    // Simply leaves

/**
 * Effects of betrayal
 */
export interface BetrayalEffect {
  type: 'risk_increase' | 'attention_increase' | 'evidence_exposed' |
        'network_damage' | 'action_disabled' | 'npc_lost' | 'countdown_accelerate';
  value: number;
  description_de: string;
  description_en: string;
}

// ============================================
// NPC RED LINE DEFINITIONS
// ============================================

/**
 * Default red lines by NPC archetype
 */
const ARCHETYPE_RED_LINES: Record<string, MoralRedLine[]> = {
  ideologue: ['personal_gain', 'foreign_power'],
  opportunist: ['violence', 'children'],
  techie: ['violence', 'whistleblowers', 'journalists'],
  veteran: ['colleague_harm', 'democracy'],
  newbie: ['violence', 'children', 'journalists'],
  analyst: ['children', 'democracy', 'whistleblowers'],
};

// ============================================
// WARNING DIALOGUES
// ============================================

const WARNING_DIALOGUES: Record<BetrayalWarningLevel, {
  patterns_de: string[];
  patterns_en: string[];
  behaviors_de: string[];
  behaviors_en: string[];
}> = {
  0: {
    patterns_de: [],
    patterns_en: [],
    behaviors_de: [],
    behaviors_en: [],
  },
  1: {
    patterns_de: [
      '"{name}" wirkt nachdenklicher als sonst.',
      '"{name}" stellt ungewöhnlich viele Fragen zur Zielsetzung.',
      '"{name}" erwähnt beiläufig moralische Bedenken.',
      '"{name}" ist bei Meetings stiller als üblich.',
    ],
    patterns_en: [
      '"{name}" seems more pensive than usual.',
      '"{name}" is asking unusual questions about our objectives.',
      '"{name}" casually mentions moral concerns.',
      '"{name}" is quieter than usual in meetings.',
    ],
    behaviors_de: [
      'Antwortet langsamer auf Nachrichten',
      'Vermeidet Blickkontakt bei heiklen Themen',
      'Arbeitet mechanischer, ohne Enthusiasmus',
    ],
    behaviors_en: [
      'Responds slower to messages',
      'Avoids eye contact on sensitive topics',
      'Works more mechanically, without enthusiasm',
    ],
  },
  2: {
    patterns_de: [
      '"{name}" fragt direkt: "Sind wir hier noch die Guten?"',
      '"{name}" äußert offen Unbehagen über bestimmte Aktionen.',
      '"{name}" verpasst Deadlines und macht vermeidbare Fehler.',
      '"{name}" erwähnt, mit jemandem Externem gesprochen zu haben.',
    ],
    patterns_en: [
      '"{name}" asks directly: "Are we still the good guys here?"',
      '"{name}" openly expresses discomfort about certain actions.',
      '"{name}" misses deadlines and makes avoidable errors.',
      '"{name}" mentions having spoken with someone external.',
    ],
    behaviors_de: [
      'Macht "Fehler" bei sensiblen Operationen',
      'Hinterfragt Anweisungen öffentlich',
      'Dokumentiert Aktivitäten sorgfältiger als nötig',
    ],
    behaviors_en: [
      'Makes "mistakes" on sensitive operations',
      'Questions orders publicly',
      'Documents activities more carefully than necessary',
    ],
  },
  3: {
    patterns_de: [
      '"{name}" weicht direkten Fragen aus und wirkt nervös.',
      '"{name}" wurde mit einem Journalisten gesehen.',
      '"{name}" hat mehrere persönliche Gegenstände aus dem Büro mitgenommen.',
      '"{name}" fragt nach Details zu Operationen, an denen sie nicht beteiligt ist.',
    ],
    patterns_en: [
      '"{name}" evades direct questions and seems nervous.',
      '"{name}" was seen meeting with a journalist.',
      '"{name}" has taken personal items from the office.',
      '"{name}" asks about operations they\'re not involved in.',
    ],
    behaviors_de: [
      'Kopiert ungewöhnlich viele Dateien',
      'Trifft sich mit unbekannten Personen',
      'Vermeidet es, allein mit Ihnen zu sein',
      'Hat plötzlich "Familienprobleme"',
    ],
    behaviors_en: [
      'Copying unusually many files',
      'Meeting with unknown individuals',
      'Avoids being alone with you',
      'Suddenly has "family problems"',
    ],
  },
  4: {
    patterns_de: [
      '"{name}" hat Kontakt zu einem Anwalt aufgenommen.',
      '"{name}" wurde bei einem Treffen mit Ermittlern fotografiert.',
      '"{name}" hat ein verschlüsseltes Paket an eine unbekannte Adresse geschickt.',
      '"{name}" wirkt seltsam ruhig – als hätte sie bereits eine Entscheidung getroffen.',
    ],
    patterns_en: [
      '"{name}" has contacted a lawyer.',
      '"{name}" was photographed meeting with investigators.',
      '"{name}" sent an encrypted package to an unknown address.',
      '"{name}" seems strangely calm – as if they\'ve made a decision.',
    ],
    behaviors_de: [
      'Schreibt ein "Testament" für die Arbeit',
      'Räumt den Schreibtisch auf',
      'Verabschiedet sich seltsam herzlich von Kollegen',
    ],
    behaviors_en: [
      'Writing a work "testament"',
      'Cleaning out their desk',
      'Saying strangely warm goodbyes to colleagues',
    ],
  },
};

// ============================================
// BETRAYAL SYSTEM CLASS
// ============================================

export class BetrayalSystem {
  private betrayalStates: Map<string, BetrayalState> = new Map();
  private completedBetrayals: string[] = [];  // NPCs who have betrayed

  constructor() {}

  /**
   * Initialize betrayal tracking for an NPC
   */
  initializeNPC(npcId: string, archetype: string, morale: number): void {
    if (this.betrayalStates.has(npcId)) return;

    const redLines = ARCHETYPE_RED_LINES[archetype] || ['violence', 'children'];

    this.betrayalStates.set(npcId, {
      npcId,
      warningLevel: 0,
      warningsShown: [],
      betrayalRisk: morale < 50 ? 100 - morale : 0,
      personalRedLines: redLines,
      recentMoralActions: [],
      lastWarningPhase: 0,
      grievances: [],
      recoveryActions: [],
    });
  }

  /**
   * Process a morally heavy action and update betrayal risk
   */
  processMoralAction(
    npcId: string,
    actionId: string,
    moralWeight: number,
    tags: string[],
    currentPhase: number
  ): BetrayalWarning | null {
    const state = this.betrayalStates.get(npcId);
    if (!state) return null;

    // Track the action
    state.recentMoralActions.push(actionId);
    if (state.recentMoralActions.length > 10) {
      state.recentMoralActions.shift();
    }

    // Calculate risk increase
    let riskIncrease = moralWeight * 2;

    // Check for red line violations
    const redLineViolated = this.checkRedLineViolation(state.personalRedLines, tags);
    if (redLineViolated) {
      riskIncrease *= 3; // Triple risk for red line violation

      // Add grievance
      state.grievances.push({
        id: `grievance_${npcId}_${currentPhase}`,
        type: 'red_line_crossed',
        description_de: `Rote Linie überschritten: ${this.translateRedLine(redLineViolated, 'de')}`,
        description_en: `Red line crossed: ${this.translateRedLine(redLineViolated, 'en')}`,
        severity: 8,
        createdPhase: currentPhase,
        addressed: false,
      });
    }

    // Update risk
    state.betrayalRisk = Math.min(100, state.betrayalRisk + riskIncrease);

    // Update warning level based on risk
    const newLevel = this.calculateWarningLevel(state.betrayalRisk);
    const levelIncreased = newLevel > state.warningLevel;
    state.warningLevel = newLevel;

    // Generate warning if level increased
    if (levelIncreased && newLevel > 0) {
      return this.generateWarning(state, 'moral_action', currentPhase);
    }

    return null;
  }

  private checkRedLineViolation(redLines: MoralRedLine[], tags: string[]): MoralRedLine | null {
    const tagToRedLine: Record<string, MoralRedLine> = {
      violence: 'violence',
      harassment: 'violence',
      doxxing: 'violence',
      children: 'children',
      minors: 'children',
      journalist: 'journalists',
      press: 'journalists',
      whistleblower: 'whistleblowers',
      democracy: 'democracy',
      election: 'democracy',
      foreign: 'foreign_power',
      intelligence: 'foreign_power',
    };

    for (const tag of tags) {
      const redLine = tagToRedLine[tag.toLowerCase()];
      if (redLine && redLines.includes(redLine)) {
        return redLine;
      }
    }

    return null;
  }

  private translateRedLine(redLine: MoralRedLine, lang: 'de' | 'en'): string {
    const translations: Record<MoralRedLine, { de: string; en: string }> = {
      violence: { de: 'Gewalt gegen Unschuldige', en: 'Violence against innocents' },
      children: { de: 'Kinder betroffen', en: 'Children involved' },
      whistleblowers: { de: 'Whistleblower angegriffen', en: 'Whistleblowers attacked' },
      journalists: { de: 'Journalisten attackiert', en: 'Journalists attacked' },
      democracy: { de: 'Demokratie untergraben', en: 'Democracy undermined' },
      foreign_power: { de: 'Ausländische Einmischung', en: 'Foreign interference' },
      personal_gain: { de: 'Reiner Eigennutz', en: 'Pure self-interest' },
      colleague_harm: { de: 'Kollegen geopfert', en: 'Colleagues sacrificed' },
    };
    return translations[redLine]?.[lang] || redLine;
  }

  /**
   * Update betrayal risk based on NPC morale
   */
  updateMoraleRisk(
    npcId: string,
    morale: number,
    currentPhase: number
  ): BetrayalWarning | null {
    const state = this.betrayalStates.get(npcId);
    if (!state) return null;

    // Low morale increases betrayal risk
    if (morale < 40) {
      const riskIncrease = (40 - morale) / 10;
      state.betrayalRisk = Math.min(100, state.betrayalRisk + riskIncrease);

      if (morale < 25 && !state.grievances.some(g => g.type === 'low_morale' && !g.addressed)) {
        state.grievances.push({
          id: `grievance_morale_${npcId}_${currentPhase}`,
          type: 'low_morale',
          description_de: 'Motivation und Arbeitszufriedenheit stark gesunken',
          description_en: 'Motivation and job satisfaction significantly decreased',
          severity: 5,
          createdPhase: currentPhase,
          addressed: false,
        });
      }
    } else if (morale > 60) {
      // High morale decreases risk
      state.betrayalRisk = Math.max(0, state.betrayalRisk - 1);
    }

    // Update warning level
    const newLevel = this.calculateWarningLevel(state.betrayalRisk);
    const levelIncreased = newLevel > state.warningLevel;
    state.warningLevel = newLevel;

    if (levelIncreased && newLevel > 0 && currentPhase - state.lastWarningPhase >= 2) {
      return this.generateWarning(state, 'low_morale', currentPhase);
    }

    return null;
  }

  private calculateWarningLevel(risk: number): BetrayalWarningLevel {
    if (risk >= 90) return 4;
    if (risk >= 70) return 3;
    if (risk >= 50) return 2;
    if (risk >= 30) return 1;
    return 0;
  }

  /**
   * Generate a warning for the player
   */
  private generateWarning(
    state: BetrayalState,
    triggerType: string,
    currentPhase: number
  ): BetrayalWarning {
    state.lastWarningPhase = currentPhase;

    const levelDialogues = WARNING_DIALOGUES[state.warningLevel];
    const npcName = state.npcId; // Would be replaced with actual name in adapter

    // Pick a random pattern that hasn't been shown
    const availablePatterns_de = levelDialogues.patterns_de.filter(
      p => !state.warningsShown.includes(p)
    );
    const availablePatterns_en = levelDialogues.patterns_en.filter(
      p => !state.warningsShown.includes(p)
    );

    const pattern_de = availablePatterns_de[0] || levelDialogues.patterns_de[0];
    const pattern_en = availablePatterns_en[0] || levelDialogues.patterns_en[0];

    state.warningsShown.push(pattern_de);

    const urgencyMap: Record<BetrayalWarningLevel, 'low' | 'medium' | 'high' | 'critical'> = {
      0: 'low',
      1: 'low',
      2: 'medium',
      3: 'high',
      4: 'critical',
    };

    const suggestionMap: Record<BetrayalWarningLevel, { de: string; en: string }> = {
      0: { de: '', en: '' },
      1: {
        de: 'Sprechen Sie mit {name} und zeigen Sie Verständnis.',
        en: 'Talk to {name} and show understanding.',
      },
      2: {
        de: 'Führen Sie ein ernstes Gespräch mit {name}. Gehen Sie auf ihre Bedenken ein.',
        en: 'Have a serious conversation with {name}. Address their concerns.',
      },
      3: {
        de: 'DRINGEND: {name} braucht sofortige Aufmerksamkeit. Erwägen Sie Zugeständnisse.',
        en: 'URGENT: {name} needs immediate attention. Consider making concessions.',
      },
      4: {
        de: 'KRITISCH: Letzte Chance, {name} zu halten. Drastische Maßnahmen erforderlich.',
        en: 'CRITICAL: Last chance to keep {name}. Drastic measures required.',
      },
    };

    const mostRecentGrievance = state.grievances
      .filter(g => !g.addressed)
      .sort((a, b) => b.createdPhase - a.createdPhase)[0];

    return {
      npcId: state.npcId,
      npcName,
      warningLevel: state.warningLevel,
      type: state.warningLevel >= 3 ? 'event' : 'dialogue',
      warning_de: pattern_de.replace('{name}', npcName),
      warning_en: pattern_en.replace('{name}', npcName),
      suggestion_de: suggestionMap[state.warningLevel].de.replace('{name}', npcName),
      suggestion_en: suggestionMap[state.warningLevel].en.replace('{name}', npcName),
      urgency: urgencyMap[state.warningLevel],
      grievance: mostRecentGrievance,
    };
  }

  /**
   * Player attempts to address NPC concerns (recovery action)
   */
  addressConcerns(
    npcId: string,
    actionType: 'talk' | 'bonus' | 'reduce_workload' | 'concession',
    currentPhase: number
  ): { success: boolean; riskReduction: number; message_de: string; message_en: string } {
    const state = this.betrayalStates.get(npcId);
    if (!state) {
      return {
        success: false,
        riskReduction: 0,
        message_de: 'NPC nicht gefunden.',
        message_en: 'NPC not found.',
      };
    }

    let riskReduction = 0;
    let message_de = '';
    let message_en = '';

    switch (actionType) {
      case 'talk':
        riskReduction = 10;
        message_de = 'Sie haben ein offenes Gespräch geführt. Die Situation hat sich etwas entspannt.';
        message_en = 'You had an open conversation. The situation has eased somewhat.';
        break;
      case 'bonus':
        riskReduction = 15;
        message_de = 'Die finanzielle Anerkennung wurde positiv aufgenommen.';
        message_en = 'The financial recognition was well received.';
        break;
      case 'reduce_workload':
        riskReduction = 12;
        message_de = 'Die reduzierte Arbeitsbelastung zeigt bereits positive Effekte.';
        message_en = 'The reduced workload is already showing positive effects.';
        break;
      case 'concession':
        riskReduction = 25;
        message_de = 'Ihre Zugeständnisse haben Vertrauen wiederhergestellt.';
        message_en = 'Your concessions have restored trust.';
        break;
    }

    // Apply reduction but effectiveness decreases with warning level
    const effectivenessMultiplier = 1 - (state.warningLevel * 0.15);
    riskReduction = Math.floor(riskReduction * effectivenessMultiplier);

    state.betrayalRisk = Math.max(0, state.betrayalRisk - riskReduction);
    state.recoveryActions.push(actionType);

    // Mark grievances as addressed
    const addressedCount = Math.min(state.grievances.filter(g => !g.addressed).length, 1);
    let addressed = 0;
    for (const grievance of state.grievances) {
      if (!grievance.addressed && addressed < addressedCount) {
        grievance.addressed = true;
        addressed++;
      }
    }

    // Recalculate warning level
    state.warningLevel = this.calculateWarningLevel(state.betrayalRisk);

    if (riskReduction < 5) {
      message_de += ' Allerdings scheint es zu spät für einfache Lösungen zu sein.';
      message_en += ' However, it seems too late for simple solutions.';
    }

    return { success: true, riskReduction, message_de, message_en };
  }

  /**
   * Check if betrayal should trigger and execute it
   */
  checkBetrayalTrigger(
    npcId: string,
    npcName: string,
    currentPhase: number
  ): BetrayalEvent | null {
    const state = this.betrayalStates.get(npcId);
    if (!state) return null;
    if (this.completedBetrayals.includes(npcId)) return null;

    // Betrayal triggers at risk 100 or warning level 4 for 2+ phases
    const shouldBetray = state.betrayalRisk >= 100 ||
      (state.warningLevel === 4 && currentPhase - state.lastWarningPhase >= 2);

    if (!shouldBetray) return null;

    // Mark as betrayed
    this.completedBetrayals.push(npcId);

    // Determine betrayal type based on grievances and risk
    const hasRedLineGrievance = state.grievances.some(
      g => g.type === 'red_line_crossed' && !g.addressed
    );
    const type: BetrayalType = hasRedLineGrievance ? 'whistleblower' : 'defection';

    const severity = state.betrayalRisk >= 95 ? 'catastrophic' :
                     state.betrayalRisk >= 80 ? 'major' : 'minor';

    const effects = this.generateBetrayalEffects(type, severity);

    return {
      npcId,
      npcName,
      type,
      severity,
      consequence_de: this.getBetrayalConsequence(type, npcName, 'de'),
      consequence_en: this.getBetrayalConsequence(type, npcName, 'en'),
      effects,
      finalDialogue_de: this.getFinalDialogue(type, npcName, 'de'),
      finalDialogue_en: this.getFinalDialogue(type, npcName, 'en'),
    };
  }

  private generateBetrayalEffects(type: BetrayalType, severity: string): BetrayalEffect[] {
    const effects: BetrayalEffect[] = [];
    const severityMultiplier = severity === 'catastrophic' ? 2 : severity === 'major' ? 1.5 : 1;

    switch (type) {
      case 'whistleblower':
        effects.push({
          type: 'risk_increase',
          value: 30 * severityMultiplier,
          description_de: 'Interne Informationen wurden geleakt',
          description_en: 'Internal information was leaked',
        });
        effects.push({
          type: 'evidence_exposed',
          value: 1,
          description_de: 'Beweise liegen jetzt vor',
          description_en: 'Evidence has been exposed',
        });
        break;

      case 'defection':
        effects.push({
          type: 'attention_increase',
          value: 25 * severityMultiplier,
          description_de: 'Die Opposition hat einen neuen Informanten',
          description_en: 'The opposition has a new informant',
        });
        effects.push({
          type: 'network_damage',
          value: 15 * severityMultiplier,
          description_de: 'Netzwerk-Verbindungen geschwächt',
          description_en: 'Network connections weakened',
        });
        break;

      case 'sabotage':
        effects.push({
          type: 'action_disabled',
          value: 3,
          description_de: 'Mehrere Aktionen vorübergehend nicht verfügbar',
          description_en: 'Multiple actions temporarily unavailable',
        });
        break;

      case 'testimony':
        effects.push({
          type: 'countdown_accelerate',
          value: 5,
          description_de: 'Ermittlungen beschleunigt',
          description_en: 'Investigation accelerated',
        });
        effects.push({
          type: 'risk_increase',
          value: 40 * severityMultiplier,
          description_de: 'Kooperiert mit Ermittlern',
          description_en: 'Cooperating with investigators',
        });
        break;
    }

    effects.push({
      type: 'npc_lost',
      value: 1,
      description_de: 'Mitarbeiter verloren',
      description_en: 'Team member lost',
    });

    return effects;
  }

  private getBetrayalConsequence(type: BetrayalType, name: string, lang: 'de' | 'en'): string {
    const consequences: Record<BetrayalType, { de: string; en: string }> = {
      whistleblower: {
        de: `${name} hat sich an die Presse gewandt. Ihre Aktivitäten werden nun öffentlich untersucht.`,
        en: `${name} has gone to the press. Your activities are now under public scrutiny.`,
      },
      defection: {
        de: `${name} hat die Seiten gewechselt und arbeitet jetzt für die Opposition.`,
        en: `${name} has switched sides and is now working for the opposition.`,
      },
      sabotage: {
        de: `${name} hat kritische Systeme sabotiert, bevor sie verschwunden ist.`,
        en: `${name} sabotaged critical systems before disappearing.`,
      },
      evidence_leak: {
        de: `${name} hat belastende Dokumente an einen Journalisten weitergegeben.`,
        en: `${name} has passed incriminating documents to a journalist.`,
      },
      testimony: {
        de: `${name} kooperiert mit den Ermittlern und belastet Sie schwer.`,
        en: `${name} is cooperating with investigators and implicating you heavily.`,
      },
      disappearance: {
        de: `${name} ist spurlos verschwunden - mit allem, was sie wusste.`,
        en: `${name} has vanished without a trace - along with everything they knew.`,
      },
    };
    return consequences[type][lang];
  }

  private getFinalDialogue(type: BetrayalType, name: string, lang: 'de' | 'en'): string {
    const dialogues: Record<BetrayalType, { de: string; en: string }> = {
      whistleblower: {
        de: '"Ich kann das nicht mehr mit meinem Gewissen vereinbaren. Die Wahrheit muss ans Licht."',
        en: '"I can no longer reconcile this with my conscience. The truth must come out."',
      },
      defection: {
        de: '"Sie haben mich zu lange ignoriert. Jetzt werde ich gehört – nur nicht von Ihnen."',
        en: '"You ignored me for too long. Now I will be heard – just not by you."',
      },
      sabotage: {
        de: '"Wenn ich das System nicht ändern kann, werde ich es zumindest aufhalten."',
        en: '"If I can\'t change the system, I\'ll at least stop it."',
      },
      evidence_leak: {
        de: '"Die Menschen haben ein Recht zu erfahren, was hier wirklich passiert."',
        en: '"People have a right to know what\'s really happening here."',
      },
      testimony: {
        de: '"Es tut mir leid, aber ich wähle meine Freiheit über Ihre Loyalität."',
        en: '"I\'m sorry, but I choose my freedom over your loyalty."',
      },
      disappearance: {
        de: '"..."',
        en: '"..."',
      },
    };
    return dialogues[type][lang];
  }

  /**
   * Get current betrayal risk for an NPC
   */
  getBetrayalRisk(npcId: string): {
    risk: number;
    warningLevel: BetrayalWarningLevel;
    grievances: BetrayalGrievance[];
  } | null {
    const state = this.betrayalStates.get(npcId);
    if (!state) return null;

    return {
      risk: state.betrayalRisk,
      warningLevel: state.warningLevel,
      grievances: state.grievances.filter(g => !g.addressed),
    };
  }

  /**
   * Get all NPCs at risk of betrayal
   */
  getNPCsAtRisk(): string[] {
    const atRisk: string[] = [];
    for (const [npcId, state] of this.betrayalStates) {
      if (state.warningLevel >= 2 && !this.completedBetrayals.includes(npcId)) {
        atRisk.push(npcId);
      }
    }
    return atRisk;
  }

  /**
   * Export state for save/load
   */
  exportState(): {
    betrayalStates: [string, BetrayalState][];
    completedBetrayals: string[];
  } {
    return {
      betrayalStates: Array.from(this.betrayalStates.entries()),
      completedBetrayals: this.completedBetrayals,
    };
  }

  /**
   * Import state
   */
  importState(state: ReturnType<typeof this.exportState>): void {
    this.betrayalStates = new Map(state.betrayalStates);
    this.completedBetrayals = state.completedBetrayals || [];
  }

  /**
   * Reset system
   */
  reset(): void {
    this.betrayalStates.clear();
    this.completedBetrayals = [];
    this.warningHistory = [];
  }

  // ============================================
  // ADDITIONAL METHODS FOR STORY ENGINE ADAPTER
  // ============================================

  private warningHistory: BetrayalWarning[] = [];

  /**
   * Process an action for ALL registered NPCs at once
   * Returns all warnings generated
   */
  processAction(
    actionId: string,
    tags: string[],
    moralWeight: number,
    currentPhase: number
  ): { warnings: BetrayalWarning[] } {
    const warnings: BetrayalWarning[] = [];

    for (const [npcId] of this.betrayalStates) {
      const warning = this.processMoralAction(npcId, actionId, moralWeight, tags, currentPhase);
      if (warning) {
        // Add narrative fields for adapter integration
        const enrichedWarning: BetrayalWarning = {
          ...warning,
          level: warning.warningLevel,
          narrative_de: warning.warning_de,
          narrative_en: warning.warning_en,
        };
        warnings.push(enrichedWarning);
        this.warningHistory.push(enrichedWarning);
      }
    }

    return { warnings };
  }

  /**
   * Get overall betrayal status for all NPCs
   */
  getStatus(): {
    npcStatuses: Map<string, {
      warningLevel: number;
      redLinesCrossed: string[];
      isBetraying: boolean;
    }>;
    imminentBetrayals: string[];
  } {
    const npcStatuses = new Map<string, {
      warningLevel: number;
      redLinesCrossed: string[];
      isBetraying: boolean;
    }>();

    for (const [npcId, state] of this.betrayalStates) {
      const redLinesCrossed = state.grievances
        .filter(g => g.type === 'red_line_crossed' && !g.addressed)
        .map(g => g.description_en);

      npcStatuses.set(npcId, {
        warningLevel: state.warningLevel,
        redLinesCrossed,
        isBetraying: this.completedBetrayals.includes(npcId),
      });
    }

    const imminentBetrayals = Array.from(this.betrayalStates.entries())
      .filter(([_, state]) => state.warningLevel >= 4)
      .map(([npcId]) => npcId);

    return { npcStatuses, imminentBetrayals };
  }

  /**
   * Get full warning history
   */
  getWarningHistory(): BetrayalWarning[] {
    return [...this.warningHistory];
  }

  /**
   * Get the most recent warning for a specific NPC
   */
  getLatestWarning(npcId: string): BetrayalWarning | null {
    const npcWarnings = this.warningHistory.filter(w => w.npcId === npcId);
    return npcWarnings.length > 0 ? npcWarnings[npcWarnings.length - 1] : null;
  }

  /**
   * Check if any betrayal has occurred
   */
  hasBetrayalOccurred(): boolean {
    return this.completedBetrayals.length > 0;
  }

  /**
   * Get list of NPCs who have betrayed
   */
  getBetrayingNPCs(): string[] {
    return [...this.completedBetrayals];
  }
}

// Singleton instance
let betrayalSystemInstance: BetrayalSystem | null = null;

export function getBetrayalSystem(): BetrayalSystem {
  if (!betrayalSystemInstance) {
    betrayalSystemInstance = new BetrayalSystem();
  }
  return betrayalSystemInstance;
}

export function resetBetrayalSystem(): void {
  if (betrayalSystemInstance) {
    betrayalSystemInstance.reset();
  }
  betrayalSystemInstance = null;
}
