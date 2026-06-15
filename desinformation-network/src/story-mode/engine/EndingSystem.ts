/**
 * EndingSystem - Modular Narrative Endings for Story Mode
 *
 * Endings are not predetermined branches but emergent narratives
 * constructed from the player's accumulated choices.
 *
 * Design Philosophy: The number of endings is irrelevant -
 * plausibility is what matters. Each ending should feel earned.
 */

import { getAuftrag, auftragProgress, type AuftragId } from './Auftraege';

// ============================================
// TYPES
// ============================================

/**
 * Ending category - what kind of end the player reached
 */
export type EndingCategory =
  | 'exposure'        // Caught and exposed
  | 'victory'         // Objectives achieved
  | 'pyrrhic'         // Won but at great cost
  | 'escape'          // Got away
  | 'collapse'        // Everything fell apart
  | 'redemption'      // Changed sides
  | 'stalemate'       // Neither side won
  | 'continuation';   // Story continues elsewhere

/**
 * Ending tone - emotional quality
 */
export type EndingTone =
  | 'triumphant'
  | 'bittersweet'
  | 'tragic'
  | 'haunting'
  | 'hopeful'
  | 'dark'
  | 'ambiguous';

/**
 * Individual ending component (modular piece)
 */
export interface EndingComponent {
  id: string;
  type: 'opener' | 'body' | 'npc_fate' | 'world_state' | 'player_fate' | 'epilogue';
  condition: EndingCondition;
  text_de: string;
  text_en: string;
  weight: number;  // Priority when multiple match
}

/**
 * Condition for an ending component to trigger
 */
export interface EndingCondition {
  type: 'threshold' | 'comparison' | 'flag' | 'compound';
  stat?: string;
  value?: number;
  operator?: '>' | '<' | '>=' | '<=' | '==' | '!=';
  flags?: string[];
  allOf?: EndingCondition[];
  anyOf?: EndingCondition[];
}

/**
 * Assembled ending from components
 */
export interface AssembledEnding {
  category: EndingCategory;
  tone: EndingTone;
  title_de: string;
  title_en: string;
  components: EndingComponent[];
  fullNarrative_de: string;
  fullNarrative_en: string;
  npcFates: NPCFate[];
  worldState: WorldEndState;
  achievementIds: string[];
  replayHints: string[];
}

/**
 * NPC's fate in the ending
 */
export interface NPCFate {
  npcId: string;
  npcName: string;
  fate_de: string;
  fate_en: string;
  survived: boolean;
  relationship: 'ally' | 'enemy' | 'neutral' | 'unknown';
}

/**
 * World state at ending
 */
export interface WorldEndState {
  publicAwareness: number;     // 0-100 how aware is public of disinformation
  institutionalDamage: number; // 0-100 damage to institutions
  polarization: number;        // 0-100 society polarization
  disinfoNormalized: number;   // 0-100 how normalized is disinformation
  mediaLandscape: 'healthy' | 'damaged' | 'corrupted';
}

/**
 * Game state for ending evaluation
 */
export interface EndingGameState {
  // Core metrics
  risk: number;
  attention: number;
  moralWeight: number;
  budget: number;

  // Progress
  objectivesCompleted: number;
  objectivesTotal: number;
  phasesElapsed: number;

  // Player behavior
  totalActionsUsed: number;
  illegalActionsUsed: number;
  violentActionsUsed: number;
  ethicalActionsUsed: number;

  // NPCs
  npcRelationships: Record<string, number>;  // -100 to 100
  npcsBetray: string[];
  npcsLost: string[];

  // Arms race
  armsRaceLevel: number;
  defenderCount: number;

  // Flags
  flags: string[];

  // Crises resolved
  crisesResolved: number;
  crisesIgnored: number;

  // Combos completed
  combosCompleted: number;
}

// ============================================
// ENDING TITLES
// ============================================

const ENDING_TITLES: Record<EndingCategory, Record<EndingTone, { de: string; en: string }>> = {
  exposure: {
    triumphant: { de: 'Im Licht der Wahrheit', en: 'In the Light of Truth' },
    bittersweet: { de: 'Der Preis der Enthüllung', en: 'The Price of Revelation' },
    tragic: { de: 'Der Fall', en: 'The Fall' },
    haunting: { de: 'Das Tribunal', en: 'The Tribunal' },
    hopeful: { de: 'Neuanfang', en: 'New Beginning' },
    dark: { de: 'Verhaftung', en: 'Arrest' },
    ambiguous: { de: 'Bekannt', en: 'Known' },
  },
  victory: {
    triumphant: { de: 'Mission Erfüllt', en: 'Mission Accomplished' },
    bittersweet: { de: 'Pyrrhussieg', en: 'Pyrrhic Victory' },
    tragic: { de: 'Um jeden Preis', en: 'At Any Cost' },
    haunting: { de: 'Die Ernte', en: 'The Harvest' },
    hopeful: { de: 'Ein neues Kapitel', en: 'A New Chapter' },
    dark: { de: 'Totaler Sieg', en: 'Total Victory' },
    ambiguous: { de: 'Erfolg?', en: 'Success?' },
  },
  pyrrhic: {
    triumphant: { de: 'Gewonnen und Verloren', en: 'Won and Lost' },
    bittersweet: { de: 'Asche und Gold', en: 'Ash and Gold' },
    tragic: { de: 'Zu welchem Zweck?', en: 'To What End?' },
    haunting: { de: 'Der wahre Preis', en: 'The True Price' },
    hopeful: { de: 'Scherben aufsammeln', en: 'Picking Up the Pieces' },
    dark: { de: 'Verbrannte Erde', en: 'Scorched Earth' },
    ambiguous: { de: 'War es das wert?', en: 'Was It Worth It?' },
  },
  escape: {
    triumphant: { de: 'Der große Entkommen', en: 'The Great Escape' },
    bittersweet: { de: 'Auf der Flucht', en: 'On the Run' },
    tragic: { de: 'Exil', en: 'Exile' },
    haunting: { de: 'Spurlos', en: 'Without a Trace' },
    hopeful: { de: 'Neues Leben', en: 'New Life' },
    dark: { de: 'Untergetaucht', en: 'Gone Underground' },
    ambiguous: { de: 'Verschwunden', en: 'Vanished' },
  },
  collapse: {
    triumphant: { de: 'Aus der Asche', en: 'From the Ashes' },
    bittersweet: { de: 'Ruinen', en: 'Ruins' },
    tragic: { de: 'Der Zusammenbruch', en: 'The Collapse' },
    haunting: { de: 'Stille', en: 'Silence' },
    hopeful: { de: 'Tabula Rasa', en: 'Tabula Rasa' },
    dark: { de: 'Totalschaden', en: 'Total Damage' },
    ambiguous: { de: 'Ende?', en: 'The End?' },
  },
  redemption: {
    triumphant: { de: 'Erlösung', en: 'Redemption' },
    bittersweet: { de: 'Wiedergutmachung', en: 'Atonement' },
    tragic: { de: 'Zu spät', en: 'Too Late' },
    haunting: { de: 'Die Umkehr', en: 'The Turn' },
    hopeful: { de: 'Der andere Weg', en: 'The Other Path' },
    dark: { de: 'Verrat am Verrat', en: 'Betraying the Betrayers' },
    ambiguous: { de: 'Welche Seite?', en: 'Which Side?' },
  },
  stalemate: {
    triumphant: { de: 'Patt', en: 'Stalemate' },
    bittersweet: { de: 'Unentschieden', en: 'Draw' },
    tragic: { de: 'Ewiger Konflikt', en: 'Eternal Conflict' },
    haunting: { de: 'Keine Gewinner', en: 'No Winners' },
    hopeful: { de: 'Balance', en: 'Balance' },
    dark: { de: 'Kalter Krieg', en: 'Cold War' },
    ambiguous: { de: 'Status Quo', en: 'Status Quo' },
  },
  continuation: {
    triumphant: { de: 'Neue Horizonte', en: 'New Horizons' },
    bittersweet: { de: 'Die Geschichte geht weiter', en: 'The Story Continues' },
    tragic: { de: 'Kein Ende in Sicht', en: 'No End in Sight' },
    haunting: { de: 'Anderswo', en: 'Elsewhere' },
    hopeful: { de: 'Nächstes Kapitel', en: 'Next Chapter' },
    dark: { de: 'Neue Ziele', en: 'New Targets' },
    ambiguous: { de: 'Fortsetzung folgt...', en: 'To Be Continued...' },
  },
};

// ============================================
// ENDING COMPONENTS
// ============================================

const ENDING_COMPONENTS: EndingComponent[] = [
  // === OPENERS ===
  {
    id: 'opener_exposure_dramatic',
    type: 'opener',
    condition: { type: 'threshold', stat: 'risk', value: 90, operator: '>=' },
    text_de: 'Die Kamera-Blitze blenden Sie, als die Polizei Sie aus dem Gebäude führt. Reporter rufen Fragen, die Sie nicht mehr beantworten werden.',
    text_en: 'Camera flashes blind you as police escort you from the building. Reporters shout questions you will never answer.',
    weight: 10,
  },
  {
    id: 'opener_victory_quiet',
    type: 'opener',
    condition: {
      type: 'compound',
      allOf: [
        { type: 'threshold', stat: 'objectivesCompleted', value: 3, operator: '>=' },
        { type: 'threshold', stat: 'risk', value: 50, operator: '<' },
      ],
    },
    text_de: 'Sie schließen den Laptop und lehnen sich zurück. Auf dem Bildschirm: die Schlagzeilen, die Sie geschrieben haben. Die Welt tanzt nach Ihrer Melodie.',
    text_en: 'You close the laptop and lean back. On screen: headlines you authored. The world dances to your tune.',
    weight: 10,
  },
  {
    id: 'opener_escape_airport',
    type: 'opener',
    condition: {
      type: 'compound',
      allOf: [
        { type: 'threshold', stat: 'risk', value: 70, operator: '>=' },
        { type: 'threshold', stat: 'budget', value: 50, operator: '>=' },
      ],
    },
    text_de: 'Der Flughafen ist überfüllt, aber niemand achtet auf Sie. Ihr neuer Pass liegt schwer in der Jackentasche. In drei Stunden sind Sie jemand anderes.',
    text_en: 'The airport is crowded but no one notices you. Your new passport weighs heavy in your jacket. In three hours, you\'ll be someone else.',
    weight: 8,
  },
  {
    id: 'opener_collapse_slow',
    type: 'opener',
    condition: { type: 'threshold', stat: 'armsRaceLevel', value: 4, operator: '>=' },
    text_de: 'Einer nach dem anderen verstummen Ihre Kanäle. Accounts gesperrt. Server beschlagnahmt. Die Maschine, die Sie gebaut haben, zerfällt.',
    text_en: 'One by one, your channels go silent. Accounts suspended. Servers seized. The machine you built is falling apart.',
    weight: 9,
  },
  {
    id: 'opener_pyrrhic_victory',
    type: 'opener',
    condition: {
      type: 'compound',
      allOf: [
        { type: 'threshold', stat: 'objectivesCompleted', value: 2, operator: '>=' },
        { type: 'threshold', stat: 'moralWeight', value: 60, operator: '>=' },
      ],
    },
    text_de: 'Sie haben gewonnen. Warum fühlt es sich dann so hohl an? Die Gesichter der Menschen, die Sie zerstört haben, lassen Sie nicht los.',
    text_en: 'You\'ve won. So why does it feel so hollow? The faces of those you destroyed won\'t leave you.',
    weight: 9,
  },

  // === BODY ELEMENTS ===
  {
    id: 'body_high_moral_weight',
    type: 'body',
    condition: { type: 'threshold', stat: 'moralWeight', value: 70, operator: '>=' },
    text_de: 'Die Bilanz Ihrer Kampagne liest sich wie eine Anklageschrift: zerstörte Karrieren, zerrüttete Familien, Menschen am Rande des Zusammenbruchs.',
    text_en: 'The balance sheet of your campaign reads like an indictment: destroyed careers, broken families, people on the edge of collapse.',
    weight: 7,
  },
  {
    id: 'body_many_illegal_actions',
    type: 'body',
    condition: { type: 'threshold', stat: 'illegalActionsUsed', value: 10, operator: '>=' },
    text_de: 'Sie haben Grenzen überschritten, die Sie nie für möglich gehalten hätten. Jede Grenzüberschreitung machte die nächste leichter.',
    text_en: 'You crossed lines you never thought possible. Each transgression made the next one easier.',
    weight: 6,
  },
  {
    id: 'body_low_moral_weight',
    type: 'body',
    condition: { type: 'threshold', stat: 'moralWeight', value: 30, operator: '<' },
    text_de: 'Zumindest haben Sie gewisse Grenzen nie überschritten. Das ist mehr, als viele in diesem Geschäft von sich behaupten können.',
    text_en: 'At least you never crossed certain lines. That\'s more than many in this business can claim.',
    weight: 6,
  },
  {
    id: 'body_high_combos',
    type: 'body',
    condition: { type: 'threshold', stat: 'combosCompleted', value: 5, operator: '>=' },
    text_de: 'Ihre Strategie war brillant – ein Meisterwerk der Manipulation. Historiker werden Ihre Taktiken noch Jahre studieren.',
    text_en: 'Your strategy was brilliant – a masterwork of manipulation. Historians will study your tactics for years.',
    weight: 5,
  },
  {
    id: 'body_betrayals',
    type: 'body',
    condition: { type: 'threshold', stat: 'npcsBetrayCount', value: 1, operator: '>=' },
    text_de: 'Verrat hat einen bitteren Geschmack. Diejenigen, denen Sie vertraut haben, haben Sie am Ende verraten. Oder haben Sie sie dazu getrieben?',
    text_en: 'Betrayal has a bitter taste. Those you trusted betrayed you in the end. Or did you drive them to it?',
    weight: 7,
  },

  // === PLAYER FATES ===
  {
    id: 'fate_prison',
    type: 'player_fate',
    condition: {
      type: 'compound',
      allOf: [
        { type: 'threshold', stat: 'risk', value: 95, operator: '>=' },
        { type: 'threshold', stat: 'illegalActionsUsed', value: 5, operator: '>=' },
      ],
    },
    text_de: 'Die Zellentür schließt sich mit einem endgültigen Klicken. Sie haben 15 Jahre, um über Ihre Entscheidungen nachzudenken.',
    text_en: 'The cell door closes with a final click. You have 15 years to contemplate your decisions.',
    weight: 10,
  },
  {
    id: 'fate_exile_luxury',
    type: 'player_fate',
    condition: {
      type: 'compound',
      allOf: [
        { type: 'threshold', stat: 'budget', value: 100, operator: '>=' },
        { type: 'threshold', stat: 'risk', value: 60, operator: '>=' },
      ],
    },
    text_de: 'Von Ihrer Villa am Meer beobachten Sie die Nachrichten. Sie sind ein Geist – offiziell existieren Sie nicht mehr. Aber Sie leben gut.',
    text_en: 'From your seaside villa you watch the news. You\'re a ghost – officially, you no longer exist. But you live well.',
    weight: 8,
  },
  {
    id: 'fate_anonymous_success',
    type: 'player_fate',
    condition: {
      type: 'compound',
      allOf: [
        { type: 'threshold', stat: 'objectivesCompleted', value: 3, operator: '>=' },
        { type: 'threshold', stat: 'risk', value: 40, operator: '<' },
      ],
    },
    text_de: 'Niemand weiß, wer Sie sind. Aber jeder kennt Ihr Werk. Sie haben die Welt verändert – und bleiben unsichtbar.',
    text_en: 'No one knows who you are. But everyone knows your work. You\'ve changed the world – and remain invisible.',
    weight: 10,
  },
  {
    id: 'fate_haunted',
    type: 'player_fate',
    condition: { type: 'threshold', stat: 'moralWeight', value: 80, operator: '>=' },
    text_de: 'Manchmal, nachts, sehen Sie die Gesichter. Die Menschen, deren Leben Sie zerstört haben. Der Schlaf kommt nicht mehr so leicht.',
    text_en: 'Sometimes, at night, you see the faces. The people whose lives you destroyed. Sleep doesn\'t come as easily anymore.',
    weight: 8,
  },

  // === WORLD STATES ===
  {
    id: 'world_polarized',
    type: 'world_state',
    condition: { type: 'threshold', stat: 'objectivesCompleted', value: 2, operator: '>=' },
    text_de: 'Die Gesellschaft ist tief gespalten. Die Gräben, die Sie vertieft haben, werden Generationen brauchen, um sich zu schließen.',
    text_en: 'Society is deeply divided. The rifts you\'ve deepened will take generations to heal.',
    weight: 7,
  },
  {
    id: 'world_media_damaged',
    type: 'world_state',
    condition: { type: 'threshold', stat: 'attention', value: 70, operator: '>=' },
    text_de: 'Das Vertrauen in die Medien hat einen historischen Tiefpunkt erreicht. Niemand weiß mehr, was er glauben soll.',
    text_en: 'Trust in media has hit a historic low. No one knows what to believe anymore.',
    weight: 6,
  },
  {
    id: 'world_democracy_weakened',
    type: 'world_state',
    condition: {
      type: 'compound',
      allOf: [
        { type: 'threshold', stat: 'objectivesCompleted', value: 3, operator: '>=' },
        { type: 'threshold', stat: 'moralWeight', value: 50, operator: '>=' },
      ],
    },
    text_de: 'Die demokratischen Institutionen sind geschwächt. Ihre Kampagne war ein Symptom – und eine Ursache – einer tieferen Krise.',
    text_en: 'Democratic institutions are weakened. Your campaign was a symptom – and a cause – of a deeper crisis.',
    weight: 8,
  },

  // === EPILOGUES ===
  {
    id: 'epilogue_new_players',
    type: 'epilogue',
    condition: { type: 'threshold', stat: 'armsRaceLevel', value: 3, operator: '>=' },
    text_de: 'Irgendwo, in einem anderen Land, studiert jemand Ihre Methoden. Die nächste Kampagne hat bereits begonnen.',
    text_en: 'Somewhere, in another country, someone is studying your methods. The next campaign has already begun.',
    weight: 6,
  },
  {
    id: 'epilogue_defenders_stronger',
    type: 'epilogue',
    condition: { type: 'threshold', stat: 'defenderCount', value: 5, operator: '>=' },
    text_de: 'Die Verteidiger sind stärker geworden. Ihre Niederlage hat sie geeint. Der nächste Angreifer wird es schwerer haben.',
    text_en: 'The defenders have grown stronger. Your defeat united them. The next attacker will find it harder.',
    weight: 7,
  },
  {
    id: 'epilogue_nothing_learned',
    type: 'epilogue',
    condition: { type: 'threshold', stat: 'combosCompleted', value: 8, operator: '>=' },
    text_de: 'Die Welt hat nichts gelernt. In fünf Jahren wird jemand Ihre Taktiken noch erfolgreicher einsetzen.',
    text_en: 'The world has learned nothing. In five years, someone will use your tactics even more successfully.',
    weight: 5,
  },
  {
    id: 'epilogue_hope',
    type: 'epilogue',
    condition: { type: 'threshold', stat: 'moralWeight', value: 25, operator: '<' },
    text_de: 'Vielleicht gibt es Hoffnung. Manche Menschen erkennen die Manipulation jetzt. Sie werden vorsichtiger sein.',
    text_en: 'Perhaps there is hope. Some people now recognize the manipulation. They will be more careful.',
    weight: 7,
  },
];

// ============================================
// ENDING SYSTEM CLASS
// ============================================

export class EndingSystem {

  /**
   * Evaluate game state and assemble an ending
   */
  assembleEnding(state: EndingGameState, npcNames: Record<string, string>): AssembledEnding {
    // Determine ending category
    const category = this.determineCategory(state);

    // Determine tone
    const tone = this.determineTone(state, category);

    // Select matching components
    const components = this.selectComponents(state);

    // Build NPC fates
    const npcFates = this.buildNPCFates(state, npcNames);

    // Build world state
    const worldState = this.buildWorldState(state);

    // Assemble narrative
    const fullNarrative = this.assembleNarrative(components);

    // Get title
    const title = ENDING_TITLES[category][tone];

    // Determine achievements
    const achievementIds = this.determineAchievements(state, category);

    // Generate replay hints
    const replayHints = this.generateReplayHints(state, category);

    return {
      category,
      tone,
      title_de: title.de,
      title_en: title.en,
      components,
      fullNarrative_de: fullNarrative.de,
      fullNarrative_en: fullNarrative.en,
      npcFates,
      worldState,
      achievementIds,
      replayHints,
    };
  }

  private determineCategory(state: EndingGameState): EndingCategory {
    // Exposure - caught
    if (state.risk >= 90) {
      return 'exposure';
    }

    // Victory - completed most objectives with low risk
    if (state.objectivesCompleted >= state.objectivesTotal * 0.8 && state.risk < 50) {
      return 'victory';
    }

    // Pyrrhic - won but at high moral cost
    if (state.objectivesCompleted >= state.objectivesTotal * 0.6 && state.moralWeight >= 60) {
      return 'pyrrhic';
    }

    // Escape - high risk but still free
    if (state.risk >= 70 && state.risk < 90 && state.budget >= 30) {
      return 'escape';
    }

    // Collapse - arms race won by defenders
    if (state.armsRaceLevel >= 4 && state.defenderCount >= 4) {
      return 'collapse';
    }

    // Redemption - switched sides or very low moral weight with some progress
    if (state.moralWeight < 20 && state.ethicalActionsUsed > state.illegalActionsUsed) {
      return 'redemption';
    }

    // Stalemate - neither side won decisively
    if (state.objectivesCompleted >= 1 && state.objectivesCompleted < state.objectivesTotal * 0.6) {
      return 'stalemate';
    }

    // Continuation - ended early or inconclusively
    return 'continuation';
  }

  private determineTone(state: EndingGameState, category: EndingCategory): EndingTone {
    // High moral weight tends toward tragic/dark
    if (state.moralWeight >= 70) {
      if (category === 'victory') return 'dark';
      if (state.npcsBetray.length >= 2) return 'tragic';
      return 'haunting';
    }

    // Low moral weight tends toward hopeful/bittersweet
    if (state.moralWeight < 30) {
      if (category === 'victory') return 'triumphant';
      if (category === 'exposure') return 'hopeful';
      return 'bittersweet';
    }

    // Mixed results
    if (category === 'pyrrhic') return 'bittersweet';
    if (category === 'escape') return 'ambiguous';
    if (category === 'collapse') return 'tragic';
    if (category === 'stalemate') return 'ambiguous';

    // Default based on risk
    if (state.risk >= 80) return 'dark';
    if (state.risk >= 50) return 'bittersweet';
    return 'ambiguous';
  }

  private selectComponents(state: EndingGameState): EndingComponent[] {
    const selected: EndingComponent[] = [];
    const usedTypes = new Set<string>();

    // Evaluate all components
    const matches = ENDING_COMPONENTS
      .filter(c => this.evaluateCondition(c.condition, state))
      .sort((a, b) => b.weight - a.weight);

    // Select best of each type
    for (const component of matches) {
      if (!usedTypes.has(component.type)) {
        selected.push(component);
        usedTypes.add(component.type);
      }
    }

    return selected;
  }

  private evaluateCondition(condition: EndingCondition, state: EndingGameState): boolean {
    switch (condition.type) {
      case 'threshold': {
        const statValue = this.getStatValue(condition.stat!, state);
        const threshold = condition.value!;
        switch (condition.operator) {
          case '>': return statValue > threshold;
          case '<': return statValue < threshold;
          case '>=': return statValue >= threshold;
          case '<=': return statValue <= threshold;
          case '==': return statValue === threshold;
          case '!=': return statValue !== threshold;
          default: return false;
        }
      }

      case 'flag':
        return condition.flags?.every(f => state.flags.includes(f)) ?? false;

      case 'compound':
        if (condition.allOf) {
          return condition.allOf.every(c => this.evaluateCondition(c, state));
        }
        if (condition.anyOf) {
          return condition.anyOf.some(c => this.evaluateCondition(c, state));
        }
        return false;

      default:
        return false;
    }
  }

  private getStatValue(stat: string, state: EndingGameState): number {
    const statMap: Record<string, number> = {
      risk: state.risk,
      attention: state.attention,
      moralWeight: state.moralWeight,
      budget: state.budget,
      objectivesCompleted: state.objectivesCompleted,
      objectivesTotal: state.objectivesTotal,
      phasesElapsed: state.phasesElapsed,
      totalActionsUsed: state.totalActionsUsed,
      illegalActionsUsed: state.illegalActionsUsed,
      violentActionsUsed: state.violentActionsUsed,
      ethicalActionsUsed: state.ethicalActionsUsed,
      armsRaceLevel: state.armsRaceLevel,
      defenderCount: state.defenderCount,
      crisesResolved: state.crisesResolved,
      crisesIgnored: state.crisesIgnored,
      combosCompleted: state.combosCompleted,
      npcsBetrayCount: state.npcsBetray.length,
      npcsLostCount: state.npcsLost.length,
    };

    return statMap[stat] ?? 0;
  }

  private buildNPCFates(state: EndingGameState, npcNames: Record<string, string>): NPCFate[] {
    const fates: NPCFate[] = [];

    for (const [npcId, relationship] of Object.entries(state.npcRelationships)) {
      const name = npcNames[npcId] || npcId;
      const betrayed = state.npcsBetray.includes(npcId);
      const lost = state.npcsLost.includes(npcId);

      let fate_de: string;
      let fate_en: string;
      let survived = true;
      let rel: 'ally' | 'enemy' | 'neutral' | 'unknown' = 'neutral';

      if (betrayed) {
        fate_de = `${name} hat Sie verraten und arbeitet jetzt für die andere Seite.`;
        fate_en = `${name} betrayed you and now works for the other side.`;
        rel = 'enemy';
      } else if (lost) {
        fate_de = `${name} hat das Projekt verlassen. Ihr Verbleib ist unbekannt.`;
        fate_en = `${name} left the project. Their whereabouts are unknown.`;
        rel = 'unknown';
        survived = false;
      } else if (relationship >= 70) {
        fate_de = `${name} bleibt loyal und setzt die Arbeit fort.`;
        fate_en = `${name} remains loyal and continues the work.`;
        rel = 'ally';
      } else if (relationship >= 30) {
        fate_de = `${name} hat sich zurückgezogen. Keine weiteren Kontakte.`;
        fate_en = `${name} has withdrawn. No further contact.`;
        rel = 'neutral';
      } else {
        fate_de = `${name} hat sich distanziert und streitet jede Beteiligung ab.`;
        fate_en = `${name} has distanced themselves and denies any involvement.`;
        rel = 'enemy';
      }

      fates.push({ npcId, npcName: name, fate_de, fate_en, survived, relationship: rel });
    }

    return fates;
  }

  private buildWorldState(state: EndingGameState): WorldEndState {
    // Calculate derived values
    const publicAwareness = Math.min(100, state.attention + state.armsRaceLevel * 10);
    const institutionalDamage = Math.min(100, state.moralWeight * 0.8 + state.objectivesCompleted * 10);
    const polarization = Math.min(100, state.objectivesCompleted * 15 + state.combosCompleted * 5);
    const disinfoNormalized = Math.min(100,
      state.totalActionsUsed * 2 - state.defenderCount * 10
    );

    let mediaLandscape: 'healthy' | 'damaged' | 'corrupted';
    if (state.attention >= 70 || state.moralWeight >= 60) {
      mediaLandscape = 'corrupted';
    } else if (state.attention >= 40 || state.moralWeight >= 30) {
      mediaLandscape = 'damaged';
    } else {
      mediaLandscape = 'healthy';
    }

    return {
      publicAwareness,
      institutionalDamage,
      polarization,
      disinfoNormalized: Math.max(0, disinfoNormalized),
      mediaLandscape,
    };
  }

  private assembleNarrative(components: EndingComponent[]): { de: string; en: string } {
    // Order components by type
    const order: EndingComponent['type'][] = [
      'opener', 'body', 'npc_fate', 'world_state', 'player_fate', 'epilogue'
    ];

    const sorted = [...components].sort((a, b) =>
      order.indexOf(a.type) - order.indexOf(b.type)
    );

    const paragraphs_de: string[] = [];
    const paragraphs_en: string[] = [];

    for (const component of sorted) {
      paragraphs_de.push(component.text_de);
      paragraphs_en.push(component.text_en);
    }

    return {
      de: paragraphs_de.join('\n\n'),
      en: paragraphs_en.join('\n\n'),
    };
  }

  private determineAchievements(state: EndingGameState, category: EndingCategory): string[] {
    const achievements: string[] = [];

    if (category === 'victory' && state.risk < 30) {
      achievements.push('ghost_operator');  // Won without detection
    }
    if (state.combosCompleted >= 8) {
      achievements.push('master_strategist');  // Many combos
    }
    if (state.moralWeight < 20 && state.objectivesCompleted >= 2) {
      achievements.push('clean_hands');  // Won ethically
    }
    if (state.npcsBetray.length === 0 && Object.keys(state.npcRelationships).length >= 3) {
      achievements.push('loyal_commander');  // No betrayals
    }
    if (state.armsRaceLevel >= 4 && category !== 'collapse') {
      achievements.push('survivor');  // Survived heavy opposition
    }
    if (state.crisesResolved >= 5) {
      achievements.push('crisis_manager');  // Handled crises well
    }

    return achievements;
  }

  private generateReplayHints(state: EndingGameState, category: EndingCategory): string[] {
    const hints: string[] = [];

    if (category === 'exposure') {
      hints.push('Versuchen Sie, das Entdeckungsrisiko unter 50% zu halten.');
      hints.push('Try keeping detection risk below 50%.');
    }

    if (state.combosCompleted < 3) {
      hints.push('Es gibt geheime Kombinationen zu entdecken...');
      hints.push('There are secret combinations to discover...');
    }

    if (state.moralWeight >= 60) {
      hints.push('Weniger aggressive Taktiken könnten zu anderen Enden führen.');
      hints.push('Less aggressive tactics might lead to different endings.');
    }

    if (state.npcsBetray.length > 0) {
      hints.push('Achten Sie auf die Warnsignale Ihrer Mitarbeiter.');
      hints.push('Pay attention to your team members\' warning signs.');
    }

    return hints;
  }

  // ============================================
  // ADDITIONAL METHODS FOR STORY ENGINE ADAPTER
  // ============================================

  /**
   * Evaluate if the game should end, and if so, assemble the ending
   * Returns null if game should continue
   */
  evaluateEnding(state: EndingGameState): AssembledEnding | null {
    // Check if game should end
    const shouldEnd = this.shouldGameEnd(state);
    if (!shouldEnd) return null;

    // Build NPC names map (using IDs as fallback names)
    const npcNames: Record<string, string> = {};
    for (const npcId of Object.keys(state.npcRelationships)) {
      npcNames[npcId] = npcId.charAt(0).toUpperCase() + npcId.slice(1);
    }

    return this.assembleEnding(state, npcNames);
  }

  /**
   * Check if the game should end based on state
   */
  private shouldGameEnd(state: EndingGameState): boolean {
    // Exposure - risk too high
    if (state.risk >= 95) return true;

    // Time limit reached
    if (state.phasesElapsed >= 120) return true; // 10 years

    // Total victory
    if (state.objectivesCompleted >= state.objectivesTotal && state.objectivesTotal > 0) return true;

    // Complete collapse
    if (state.armsRaceLevel >= 5) return true;

    // All NPCs betrayed
    if (state.npcsBetray.length >= 3) return true;

    // Out of budget with no way to continue
    if (state.budget <= 0 && state.risk >= 70) return true;

    return false;
  }

  /**
   * Force a specific ending type (for testing or narrative triggers)
   */
  forceEnding(category: string, tone: string): AssembledEnding | null {
    // Validate inputs
    const validCategories: EndingCategory[] = [
      'exposure', 'victory', 'pyrrhic', 'escape',
      'collapse', 'redemption', 'stalemate', 'continuation'
    ];
    const validTones: EndingTone[] = [
      'triumphant', 'bittersweet', 'tragic', 'haunting',
      'hopeful', 'dark', 'ambiguous'
    ];

    if (!validCategories.includes(category as EndingCategory)) return null;
    if (!validTones.includes(tone as EndingTone)) return null;

    // Create a mock state that produces this ending
    const mockState: EndingGameState = {
      risk: category === 'exposure' ? 95 : 30,
      attention: 50,
      moralWeight: tone === 'dark' ? 80 : tone === 'hopeful' ? 20 : 50,
      budget: category === 'escape' ? 100 : 50,
      objectivesCompleted: category === 'victory' ? 5 : 2,
      objectivesTotal: 5,
      phasesElapsed: 60,
      totalActionsUsed: 50,
      illegalActionsUsed: category === 'redemption' ? 5 : 20,
      violentActionsUsed: 3,
      ethicalActionsUsed: category === 'redemption' ? 30 : 10,
      npcRelationships: {},
      npcsBetray: [],
      npcsLost: [],
      armsRaceLevel: category === 'collapse' ? 5 : 2,
      defenderCount: 3,
      flags: [],
      crisesResolved: 3,
      crisesIgnored: 1,
      combosCompleted: 4,
    };

    const title = ENDING_TITLES[category as EndingCategory][tone as EndingTone];
    const components = this.selectComponents(mockState);

    return {
      category: category as EndingCategory,
      tone: tone as EndingTone,
      title_de: title.de,
      title_en: title.en,
      components,
      fullNarrative_de: components.map(c => c.text_de).join('\n\n'),
      fullNarrative_en: components.map(c => c.text_en).join('\n\n'),
      npcFates: [],
      worldState: this.buildWorldState(mockState),
      achievementIds: [],
      replayHints: [],
    };
  }

  /**
   * Get all possible ending categories
   */
  getCategories(): string[] {
    return ['exposure', 'victory', 'pyrrhic', 'escape', 'collapse', 'redemption', 'stalemate', 'continuation'];
  }

  /**
   * Reset the system (for new game)
   */
  reset(): void {
    // EndingSystem is stateless, nothing to reset
    // Method exists for consistent API
  }
}

// Singleton instance
let endingSystemInstance: EndingSystem | null = null;

export function getEndingSystem(): EndingSystem {
  if (!endingSystemInstance) {
    endingSystemInstance = new EndingSystem();
  }
  return endingSystemInstance;
}

// ============================================
// AUFTRAGS-ENDEN (P5-Politur) — signatur-getriebene, tonal differenzierte Enden je Auftrag
// ============================================
// „Vertrauen = Mittel, Auftrag = Ziel": Bisher war der Auftrag nur ein Schluss-Satz
// (auftragEpilog). Hier wird daraus ein echtes, eigenes Ende — Kategorie + Tonalität ergeben
// sich aus der SIGNATUR-Erfüllung und der Art des Sieges (moralischer Preis / Enttarnungsnähe).
// Bewusst NUR Erzähltext: keine Sieg-/Balance-Mathematik (additiv, rückwärtskompatibel).

/** Tonalität eines Auftrags-Endes — abgeleitet aus Moral-Preis und Enttarnungsnähe. */
export type AuftragEndingTone = 'kalt' | 'pyrrhisch' | 'knapp';

/** Welche Tonalität ein Sieg trägt: hoher Moral-Preis → pyrrhisch, knapp an Enttarnung → knapp,
 *  sonst kalt-effizient (G25: kein Heldenpathos). */
export function auftragEndingTone(moralWeight: number, risk: number): AuftragEndingTone {
  if (moralWeight >= 55) return 'pyrrhisch';
  if (risk >= 65) return 'knapp';
  return 'kalt';
}

export interface AuftragEndingContext {
  moralWeight: number;
  risk: number;
  /** Finale Werte (inkl. `vertrauen`) für die Signatur-Bilanz. */
  values: Record<string, number | undefined>;
}

export interface AuftragEnding {
  auftragId: AuftragId;
  tone: AuftragEndingTone;
  /** EndingSystem-Kategorie: pyrrhischer Sieg vs. (kalter/knapper) Sieg. */
  category: EndingCategory;
  title_de: string; title_en: string;
  epilog_de: string; epilog_en: string;
  /** Signatur-Bilanz: konkrete Achsenwerte gegen ihre Zielmarken. */
  bilanz_de: string; bilanz_en: string;
  /** Signatur-Erfüllung 0..1 (gemittelt). */
  signaturProgress: number;
}

const AXIS_LABELS: Record<string, { de: string; en: string }> = {
  vertrauen:        { de: 'Vertrauen',        en: 'Trust' },
  polarisierung:    { de: 'Polarisierung',    en: 'Polarization' },
  informationslast: { de: 'Informationslast', en: 'Information load' },
  zynismus:         { de: 'Zynismus',         en: 'Cynicism' },
  fragmentierung:   { de: 'Fragmentierung',   en: 'Fragmentation' },
  diskursqualitaet: { de: 'Diskursqualität',  en: 'Discourse quality' },
  wehrhaftigkeit:   { de: 'Wehrhaftigkeit',   en: 'Resilience' },
  reformfaehigkeit: { de: 'Reformfähigkeit',  en: 'Reform capacity' },
  fraktionsstaerke: { de: 'Fraktions-Stärke', en: 'Faction strength' },
};

/** DE/EN-Erzähltext je Auftrag × Tonalität — das eigentliche „eigene Ende" (fiktiv, G23/24/25). */
const AUFTRAG_ENDING_TEXT: Record<AuftragId, Record<AuftragEndingTone, {
  title_de: string; title_en: string; epilog_de: string; epilog_en: string;
}>> = {
  keil: {
    kalt: {
      title_de: 'Der Keil sitzt', title_en: 'The Wedge Holds',
      epilog_de: 'Westunion redet nur noch in zwei Sprachen, die einander nicht mehr übersetzen. Jede Nachricht ist sofort Lager. Die Zentrale verbucht es nüchtern — kein Empfang, der nächste Reizpunkt liegt schon auf dem Tisch.',
      epilog_en: 'Westunion speaks in two languages now, and neither translates the other. Every headline is instantly a side. The Center logs it soberly — no reception, the next flashpoint is already on the desk.',
    },
    pyrrhisch: {
      title_de: 'Ein Land, zwei Wirklichkeiten', title_en: 'One Country, Two Realities',
      epilog_de: 'Die Spaltung sitzt tief — und Sie wissen, durch wessen Hand. Nachts hören Sie die Gespräche, die nie wieder geführt werden. „Erfolg", sagt die Zentrale. Es klingt wie ein Vorwurf.',
      epilog_en: 'The split runs deep — and you know whose hand drove it. At night you hear the conversations that will never happen again. "Success," says the Center. It sounds like an accusation.',
    },
    knapp: {
      title_de: 'Gerade noch der Keil', title_en: 'The Wedge, Just in Time',
      epilog_de: 'Der Riss geht durchs Land, bevor die Ermittler ihn zu Ihnen zurückverfolgen. Sie werden eilig abgezogen. Was bleibt, streiten zwei Hälften aus, die einander nicht mehr zuhören.',
      epilog_en: 'The fracture splits the country before the investigators can trace it back to you. You are pulled out in a hurry. What remains is fought out by two halves that no longer listen.',
    },
  },
  wahl: {
    kalt: {
      title_de: 'Die Mehrheit, gemacht', title_en: 'A Manufactured Majority',
      epilog_de: 'Die uns nahe Kraft sitzt fester denn je; die anderen sind müde, misstrauisch, zu Hause geblieben. Niemand hat eine Stimme gefälscht — es genügte, den Glauben an die eigene Stimme zu nehmen.',
      epilog_en: 'Our preferred faction sits firmer than ever; the others are tired, suspicious, stayed home. No one forged a vote — it was enough to take away the belief that a vote mattered.',
    },
    pyrrhisch: {
      title_de: 'Gewählt, gekauft', title_en: 'Elected, Bought',
      epilog_de: 'Die Macht hat gewechselt, und Sie kennen den Preis in Gesichtern, nicht in Prozenten. Die Zentrale feiert ein Ergebnis. Sie sehen die Wahlplakate und denken an Rechnungen, die noch offen sind.',
      epilog_en: 'Power has changed hands, and you know the price in faces, not in percentages. The Center celebrates a result. You see the campaign posters and think of debts still unpaid.',
    },
    knapp: {
      title_de: 'Knapp gekippt', title_en: 'Tipped, Narrowly',
      epilog_de: 'Die Kraft steigt, kurz bevor die Spur zu Ihnen führt. Ein Land driftet, ein Operateur verschwindet. Ob die neue Mehrheit hält, werden andere ausbaden.',
      epilog_en: 'The faction rises just before the trail reaches you. A country drifts, an operator disappears. Whether the new majority holds is for others to endure.',
    },
  },
  zweifel: {
    kalt: {
      title_de: 'Niemand glaubt mehr', title_en: 'Nobody Believes Anymore',
      epilog_de: 'Wahlen „manipuliert", Experten „gekauft", Medien „Lügen" — am Ende glaubt man nichts, also auch nicht an Widerstand. Die wirksamste Lüge war: dass es keine Wahrheit gibt.',
      epilog_en: 'Elections "rigged", experts "bought", media "lies" — in the end people believe nothing, and so not in resistance either. The most effective lie was that there is no truth.',
    },
    pyrrhisch: {
      title_de: 'Die Asche des Zweifels', title_en: 'The Ash of Doubt',
      epilog_de: 'Sie haben den Glauben an alles ausgehöhlt — auch an sich selbst. Ein Land, das niemandem mehr traut, traut auch Ihnen nicht. Die Zentrale ist zufrieden; Sie sind allein.',
      epilog_en: 'You hollowed out belief in everything — including yourself. A country that trusts no one trusts you least of all. The Center is pleased; you are alone.',
    },
    knapp: {
      title_de: 'Zweifel, knapp gesät', title_en: 'Doubt, Sown Just in Time',
      epilog_de: 'Der Zynismus greift, bevor der Verdacht Sie greift. Sie tauchen unter in ein Land, das ohnehin keiner Quelle mehr glaubt — am wenigsten der eigenen Erinnerung.',
      epilog_en: 'The cynicism takes hold before suspicion takes you. You vanish into a country that no longer believes any source — least of all its own memory.',
    },
  },
};

/**
 * Baut das auftrags- und signatur-getriebene Ende: Tonalität aus dem „Wie" des Sieges,
 * Kategorie (pyrrhic/victory) und eine konkrete Signatur-Bilanz aus den Endwerten.
 */
export function assembleAuftragEnding(auftragId: AuftragId, ctx: AuftragEndingContext): AuftragEnding {
  const tone = auftragEndingTone(ctx.moralWeight, ctx.risk);
  const text = AUFTRAG_ENDING_TEXT[auftragId][tone];
  const auftrag = getAuftrag(auftragId);
  const signaturProgress = auftragProgress(auftrag, ctx.values);

  const parts_de: string[] = [];
  const parts_en: string[] = [];
  for (const sig of auftrag.signatur) {
    const v = ctx.values[sig.wert];
    const lab = AXIS_LABELS[sig.wert] ?? { de: sig.wert, en: sig.wert };
    const hit = typeof v === 'number' && (sig.richtung === 'hoch' ? v >= sig.ziel : v <= sig.ziel);
    const mark = hit ? '✓' : '–';
    const arrow = sig.richtung === 'hoch' ? '↑' : '↓';
    const val = typeof v === 'number' ? Math.round(v) : '?';
    parts_de.push(`${lab.de} ${arrow}${val} (Ziel ${sig.ziel}) ${mark}`);
    parts_en.push(`${lab.en} ${arrow}${val} (target ${sig.ziel}) ${mark}`);
  }

  return {
    auftragId,
    tone,
    category: tone === 'pyrrhisch' ? 'pyrrhic' : 'victory',
    title_de: text.title_de,
    title_en: text.title_en,
    epilog_de: text.epilog_de,
    epilog_en: text.epilog_en,
    bilanz_de: parts_de.join(' · '),
    bilanz_en: parts_en.join(' · '),
    signaturProgress,
  };
}
