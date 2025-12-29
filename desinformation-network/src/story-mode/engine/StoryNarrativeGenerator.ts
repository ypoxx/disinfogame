/**
 * StoryNarrativeGenerator - Dynamic narrative text for Story Mode
 *
 * Wraps the core NarrativeGenerator and adds:
 * - German translations
 * - Story Mode specific context
 * - NPC-aware narratives
 * - Phase-based flavor text
 */

import { NarrativeGenerator } from '../../game-logic/NarrativeGenerator';
import type { ExtendedActor } from './ExtendedActorLoader';

// ============================================
// TYPES
// ============================================

export interface StoryNarrative {
  headline_de: string;
  headline_en: string;
  description_de: string;
  description_en: string;
  examples_de: string[];
  examples_en: string[];
  impactLevel: 'minimal' | 'minor' | 'moderate' | 'significant' | 'major' | 'devastating';
}

export interface ActionNarrativeContext {
  actionId: string;
  actionLabel_de: string;
  actionLabel_en: string;
  phase: string;  // ta01-ta07
  tags: string[];
  legality: 'legal' | 'grey' | 'illegal';
  targetActors?: ExtendedActor[];
  npcAssist?: string;
  effectiveness: number;  // 0-100
  risk: number;
  moralWeight: number;
}

// ============================================
// GERMAN NARRATIVE TEMPLATES
// ============================================

const ACTION_NARRATIVES_DE: Record<string, {
  headline: (targets: string[]) => string;
  description: (targets: string[], effectiveness: number) => string;
  examples: () => string[];
}> = {
  agenda_setting: {
    headline: (t) => `Nachrichtenagenda erfolgreich beeinflusst`,
    description: (t, e) => `Durch gezielte Platzierung wurde der öffentliche Diskurs auf vorbestimmte Themen gelenkt. ${t.length > 0 ? `Betroffen: ${t.join(', ')}.` : ''} Wirksamkeit: ${e}%.`,
    examples: () => [
      'Nachrichtenzyklen werden von sensationalisierten Meldungen dominiert',
      'Social-Media-Trends werden künstlich verstärkt',
      'Experteninterviews werden selektiv eingesetzt',
    ],
  },
  scandalize: {
    headline: (t) => `Skandal erschüttert ${t[0] || 'Ziel'}`,
    description: (t, e) => `Kleinere Vorfälle wurden zu größeren Skandalen aufgebauscht. Emotionale Reaktionen überlagern rationale Bewertung. Wirksamkeit: ${e}%.`,
    examples: () => [
      'Kontextlose Zitate verbreiten sich viral',
      'Social-Media-Aufruhr basierend auf unvollständigen Informationen',
      'Rücktrittsforderungen bevor alle Fakten bekannt sind',
    ],
  },
  undermine_authority: {
    headline: (t) => `Expertenglaubwürdigkeit angegriffen`,
    description: (t, e) => `Koordinierte Angriffe auf ${t.join(', ') || 'Experten'} stellen Qualifikationen und Motive in Frage statt Beweise zu widerlegen.`,
    examples: () => [
      'Ad-hominem-Angriffe mit unbelegten Interessenkonflikten',
      'Vergangene Fehler als Beweis für systematische Unzuverlässigkeit',
      '"Recherchiert selbst"-Kampagnen gegen institutionelle Expertise',
    ],
  },
  sow_doubt: {
    headline: (t) => `Zweifel breiten sich aus`,
    description: (t, e) => `Gezielt platzierte Unsicherheit über etablierte Fakten lässt ${t.join(', ') || 'die Öffentlichkeit'} an bisherigem Verständnis zweifeln.`,
    examples: () => [
      '"Manche sagen..."-Framing legitimiert Randmeinungen',
      'False Balance: Außenseitermeinungen als gleichwertig dargestellt',
      'Normale wissenschaftliche Debatte als fundamentale Unsicherheit gedeutet',
    ],
  },
  conspiracy_framing: {
    headline: (t) => `Verborgene Agenden "enthüllt"`,
    description: (t, e) => `Ereignisse wurden durch Verschwörungslinse neu gerahmt. ${t.join(', ') || 'Institutionen'} erscheinen als Teil koordinierter Manipulation.`,
    examples: () => [
      'Zufälle als Beweis für Koordination präsentiert',
      'Normale institutionelle Prozesse als geheime Kabalen dargestellt',
      'Komplexität auf Gut-gegen-Böse-Narrativ reduziert',
    ],
  },
  astroturfing: {
    headline: (t) => `Künstliche Graswurzelbewegung gewinnt an Fahrt`,
    description: (t, e) => `Gefälschte Basisunterstützung wurde erzeugt. ${t.join(', ') || 'Die Zielgruppe'} glaubt an organische Unterstützung für bestimmte Positionen.`,
    examples: () => [
      'Bot-Netzwerke erzeugen Trending-Hashtags',
      'Bezahlte Demonstranten als besorgte Bürger präsentiert',
      'Formbrief-Kampagnen als individuelle Korrespondenz getarnt',
    ],
  },
  emotional_appeal: {
    headline: (t) => `Emotionen überwältigen Vernunft`,
    description: (t, e) => `Starke emotionale Reaktionen bei ${t.join(', ') || 'der Zielgruppe'} ausgelöst. Kritisches Denken durch Angst, Wut oder moralische Empörung umgangen.`,
    examples: () => [
      'Erschütternde Bilder ohne Kontext oder Verifizierung',
      'Appelle an Kinder-/Familienschutz rechtfertigen jede Maßnahme',
      'Angstmacherei über existenzielle Bedrohungen',
    ],
  },
  divide_conquer: {
    headline: (t) => `Gesellschaftliche Spaltung vertieft`,
    description: (t, e) => `Bestehende Gräben wurden vertieft. ${t.join(', ') || 'Die Gesellschaft'} wird an einheitlichen Antworten durch Betonung der Unterschiede gehindert.`,
    examples: () => [
      'Keilthemen gezielt hervorgehoben',
      'Identitätspolitik für Ingroup-/Outgroup-Dynamik instrumentalisiert',
      'Moderate Stimmen durch Verstärkung der Extreme übertönt',
    ],
  },
};

// Phase-specific flavor text
const PHASE_FLAVOR_DE: Record<string, string[]> = {
  ta01: [
    'Die Vorbereitungen laufen im Verborgenen.',
    'Infrastruktur wird aufgebaut, Netzwerke etabliert.',
    'Niemand ahnt, was sich anbahnt.',
  ],
  ta02: [
    'Content wird produziert - Wahrheit und Fiktion verschmelzen.',
    'Die Narrative nehmen Gestalt an.',
    'Jede Geschichte hat einen Kern von Plausibilität.',
  ],
  ta03: [
    'Die Botschaften finden ihren Weg in die Öffentlichkeit.',
    'Kanäle werden aktiviert, Netzwerke genutzt.',
    'Die ersten Wellen der Desinformation breiten sich aus.',
  ],
  ta04: [
    'Verstärkung läuft auf Hochtouren.',
    'Bots, Trolle und nützliche Idioten verbreiten die Narrative.',
    'Die Reichweite wächst exponentiell.',
  ],
  ta05: [
    'Einflussoperationen greifen in die Realität ein.',
    'Die Grenzen zwischen online und offline verschwimmen.',
    'Reale Konsequenzen für reale Menschen.',
  ],
  ta06: [
    'Die Narrative festigen sich im öffentlichen Bewusstsein.',
    'Widerspruch wird marginalisiert oder neutralisiert.',
    'Die neue "Wahrheit" etabliert sich.',
  ],
  ta07: [
    'Spuren werden verwischt, Verbindungen gekappt.',
    'Deniability ist alles.',
    'Was nicht bewiesen werden kann, ist nie passiert.',
  ],
};

// ============================================
// STORY NARRATIVE GENERATOR
// ============================================

export class StoryNarrativeGenerator {

  /**
   * Generate narrative for an action result
   */
  static generateActionNarrative(context: ActionNarrativeContext): StoryNarrative {
    const targetNames = context.targetActors?.map(a => a.name) || [];

    // Try to find specific template
    let template = ACTION_NARRATIVES_DE[context.actionId];

    // Fall back to phase-based template
    if (!template) {
      template = this.getPhaseTemplate(context.phase, context.tags);
    }

    const headline_de = template.headline(targetNames);
    const description_de = template.description(targetNames, context.effectiveness);
    const examples_de = template.examples();

    // Generate English version using core NarrativeGenerator as fallback
    const headline_en = `Operation ${context.actionLabel_en} executed`;
    const description_en = `The action targeted ${targetNames.join(', ') || 'the network'} with ${context.effectiveness}% effectiveness.`;
    const examples_en = [
      'Information spread through network connections',
      'Trust levels shifted based on recent events',
      'Public discourse influenced by competing narratives',
    ];

    // Determine impact level
    const impactLevel = NarrativeGenerator.determineImpactLevel(
      context.effectiveness / 10,
      targetNames.length || 1
    );

    return {
      headline_de,
      headline_en,
      description_de,
      description_en,
      examples_de,
      examples_en,
      impactLevel,
    };
  }

  private static getPhaseTemplate(phase: string, tags: string[]): typeof ACTION_NARRATIVES_DE[string] {
    // Generic templates based on action tags
    if (tags.includes('viral') || tags.includes('amplification')) {
      return ACTION_NARRATIVES_DE.astroturfing;
    }
    if (tags.includes('emotional') || tags.includes('fear')) {
      return ACTION_NARRATIVES_DE.emotional_appeal;
    }
    if (tags.includes('conspiracy') || tags.includes('framing')) {
      return ACTION_NARRATIVES_DE.conspiracy_framing;
    }
    if (tags.includes('polarization') || tags.includes('division')) {
      return ACTION_NARRATIVES_DE.divide_conquer;
    }
    if (tags.includes('discredit') || tags.includes('attack')) {
      return ACTION_NARRATIVES_DE.undermine_authority;
    }

    // Default template
    return {
      headline: (t) => `Aktion durchgeführt`,
      description: (t, e) => `Die Operation wurde mit ${e}% Wirksamkeit abgeschlossen.${t.length > 0 ? ` Betroffene Ziele: ${t.join(', ')}.` : ''}`,
      examples: () => PHASE_FLAVOR_DE[phase] || ['Die Kampagne schreitet voran.'],
    };
  }

  /**
   * Generate phase transition narrative
   */
  static generatePhaseNarrative(
    phaseNumber: number,
    resources: { risk: number; attention: number; moralWeight: number },
    recentEvents: string[]
  ): { de: string; en: string } {
    const year = Math.ceil(phaseNumber / 12);
    const month = ((phaseNumber - 1) % 12) + 1;

    let narrative_de = `Monat ${month}, Jahr ${year}. `;
    let narrative_en = `Month ${month}, Year ${year}. `;

    // Risk-based flavor
    if (resources.risk >= 80) {
      narrative_de += 'Die Luft wird dünn. Ermittler sind Ihnen auf der Spur. ';
      narrative_en += 'The walls are closing in. Investigators are on your trail. ';
    } else if (resources.risk >= 50) {
      narrative_de += 'Die Aufmerksamkeit der Behörden wächst. Vorsicht ist geboten. ';
      narrative_en += 'Authorities are paying attention. Caution is advised. ';
    } else if (resources.risk >= 30) {
      narrative_de += 'Erste Verdachtsmomente. Noch nichts Konkretes. ';
      narrative_en += 'First suspicions arise. Nothing concrete yet. ';
    } else {
      narrative_de += 'Die Operation läuft unbemerkt. ';
      narrative_en += 'Operations continue undetected. ';
    }

    // Moral weight flavor
    if (resources.moralWeight >= 60) {
      narrative_de += 'Der Preis Ihres Erfolgs wird sichtbar. ';
      narrative_en += 'The price of your success becomes visible. ';
    }

    // Attention flavor
    if (resources.attention >= 60) {
      narrative_de += 'Ihre Gegner formieren sich.';
      narrative_en += 'Your opponents are organizing.';
    }

    return { de: narrative_de, en: narrative_en };
  }

  /**
   * Generate NPC reaction narrative
   */
  static generateNPCReactionNarrative(
    npcId: string,
    reactionType: 'positive' | 'negative' | 'neutral' | 'crisis',
    context: { moralWeight: number; risk: number }
  ): { de: string; en: string } {
    const reactions: Record<string, Record<string, { de: string; en: string }>> = {
      marina: {
        positive: {
          de: 'Marina nickt anerkennend. "Saubere Arbeit."',
          en: 'Marina nods approvingly. "Clean work."',
        },
        negative: {
          de: 'Marina runzelt die Stirn. "War das wirklich nötig?"',
          en: 'Marina frowns. "Was that really necessary?"',
        },
        neutral: {
          de: 'Marina macht sich Notizen ohne aufzusehen.',
          en: 'Marina takes notes without looking up.',
        },
        crisis: {
          de: 'Marina steht auf. "Wir müssen reden. Unter vier Augen."',
          en: 'Marina stands up. "We need to talk. Privately."',
        },
      },
      volkov: {
        positive: {
          de: 'Volkov grinst. "Das wird Moskau gefallen."',
          en: 'Volkov grins. "Moscow will be pleased."',
        },
        negative: {
          de: 'Volkov zuckt mit den Schultern. "Zu viel Risiko für zu wenig Gewinn."',
          en: 'Volkov shrugs. "Too much risk for too little reward."',
        },
        neutral: {
          de: 'Volkov checkt sein Telefon, desinteressiert.',
          en: 'Volkov checks his phone, disinterested.',
        },
        crisis: {
          de: 'Volkov wird still. Ein schlechtes Zeichen.',
          en: 'Volkov goes quiet. A bad sign.',
        },
      },
    };

    const npcReactions = reactions[npcId];
    if (npcReactions && npcReactions[reactionType]) {
      return npcReactions[reactionType];
    }

    // Generic fallback
    return {
      de: 'Keine sichtbare Reaktion.',
      en: 'No visible reaction.',
    };
  }

  /**
   * Generate round summary narrative (for news ticker)
   */
  static generateRoundSummary(
    actionsExecuted: number,
    consequencesTriggered: number,
    trustChange: number
  ): { de: string; en: string } {
    let de = '';
    let en = '';

    if (actionsExecuted === 0) {
      de = 'Ein ruhiger Monat. Das Informationsökosystem entwickelt sich natürlich weiter.';
      en = 'A quiet month. The information ecosystem evolves naturally.';
    } else if (actionsExecuted === 1) {
      de = 'Eine gezielte Aktion mit Welleneffekt durch das Netzwerk.';
      en = 'A single decisive action rippled through the network.';
    } else {
      de = `${actionsExecuted} koordinierte Aktionen erzeugten kaskadierende Effekte.`;
      en = `${actionsExecuted} coordinated actions created cascading effects.`;
    }

    if (consequencesTriggered > 0) {
      de += ` ${consequencesTriggered} Konsequenz${consequencesTriggered > 1 ? 'en' : ''} ausgelöst.`;
      en += ` ${consequencesTriggered} consequence${consequencesTriggered > 1 ? 's' : ''} triggered.`;
    }

    if (trustChange < -0.1) {
      de += ' Das öffentliche Vertrauen ist spürbar gesunken.';
      en += ' Public trust has noticeably declined.';
    } else if (trustChange > 0.05) {
      de += ' Die Verteidiger haben Boden gut gemacht.';
      en += ' Defenders have gained ground.';
    }

    return { de, en };
  }
}
