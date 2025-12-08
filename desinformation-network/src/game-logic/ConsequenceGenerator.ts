import type { Actor, AbilityResult, Ability } from './types';
import actorPersonas from '@/data/game/actor-personas.json';

// ============================================
// CONSEQUENCE GENERATOR - Sprint 4
// Creates narrative consequences for player actions
// "Emotionale Realität schafft Bedeutung" - This War of Mine
// ============================================

export type PersonaData = {
  personName: string;
  role: string;
  age: number | string;
  backstory: string;
  family: string;
  motivation: string;
  quirk: string;
  vulnerability: string;
  consequenceTemplates: {
    attacked: string;
    controlled: string;
  };
};

export type Consequence = {
  id: string;
  actorId: string;
  actorName: string;
  personName: string;
  type: 'attacked' | 'controlled' | 'reputation_damaged' | 'silenced' | 'radicalized';
  narrative: string;
  severity: 'minor' | 'moderate' | 'severe' | 'devastating';
  humanCost: {
    description: string;
    peopleAffected: number;
    emotionalImpact: string;
  };
  round: number;
};

export type SocietalImpact = {
  livesAffected: number;
  trustInInstitutions: number; // 0-1
  polarizationLevel: number; // 0-1
  misinformationSpread: number; // 0-1
  silencedVoices: number;
  radicalizedGroups: number;
  economicCost: number; // in millions
};

// Consequence narratives based on ability type
const ABILITY_CONSEQUENCES: Record<string, string[]> = {
  scandalize: [
    '{person} erhält innerhalb von 24 Stunden 2.340 Hassnachrichten.',
    'Die Familie von {person} wird von Trollen belästigt. {pronoun} Kinder werden in der Schule gemobbt.',
    '{person}s privater Briefkasten wird mit Drohbriefen gefüllt. Die Polizei ermittelt.',
  ],
  emotional_manipulation: [
    '47.000 Menschen teilen den manipulierten Inhalt, ohne ihn zu hinterfragen.',
    '{person}s sachliche Antwort wird als "kalt" und "unmenschlich" dargestellt.',
    'Eine Welle der Empörung überrollt {person}. Rationale Argumente werden ignoriert.',
  ],
  astroturfing: [
    'Die Fake-Kampagne generiert 120.000 scheinbar organische Posts. {person} kann nicht schnell genug reagieren.',
    'Eine "Bürgerinitiative" mit 50.000 gefälschten Unterstützern fordert {person}s Rücktritt.',
    'Die Grenze zwischen echter und gefälschter Empörung verschwimmt. {person} weiß nicht mehr, wem {pronoun_dative} trauen kann.',
  ],
  create_bot_army: [
    '200.000 Bot-Accounts verbreiten Falschinformationen über {person}. Die Algorithmen verstärken die Reichweite.',
    'Hashtags gegen {person} trenden bundesweit. 80% der Tweets stammen von Bots.',
    'Die koordinierte Kampagne erreicht 5 Millionen Deutsche in 48 Stunden.',
  ],
  conspiracy_framing: [
    '{person} wird in Telegram-Gruppen als Teil einer "Elite-Verschwörung" bezeichnet.',
    '23% der Befragten glauben nun, dass {person} geheime Interessen vertritt.',
    'Die Verschwörungstheorie hat ein Eigenleben entwickelt. {person} kann sie nicht mehr widerlegen.',
  ],
  sow_doubt: [
    'Die "Zweifel" an {person}s Expertise verbreiten sich. Einladungen zu Talkshows werden weniger.',
    'Eine einst vertraute Stimme wird nun mit "angeblich" und "umstritten" zitiert.',
    '{person} verbringt mehr Zeit damit, sich zu rechtfertigen, als Forschung zu betreiben.',
  ],
  agenda_setting: [
    'Das Narrativ hat sich gedreht. {person}s Position wird jetzt als "Minderheitsmeinung" dargestellt.',
    'Medien übernehmen das gesetzte Framing. Die ursprüngliche Wahrheit geht verloren.',
    '{person} ist nur noch eine von vielen Stimmen - obwohl {pronoun} der einzige Experte ist.',
  ],
};

// Human cost estimates based on severity
const HUMAN_COST_TEMPLATES = {
  minor: {
    descriptions: [
      'Einzelne Personen werden verunsichert',
      'Lokale Diskussionen werden verzerrt',
      'Kurzfristige Aufmerksamkeitsspitzen',
    ],
    peopleRange: [100, 1000],
    emotionalImpacts: ['Frustration', 'Verunsicherung', 'Misstrauen'],
  },
  moderate: {
    descriptions: [
      'Tausende Menschen übernehmen Falschinformationen',
      'Familien streiten über die "Wahrheit"',
      'Experten werden eingeschüchtert',
    ],
    peopleRange: [1000, 50000],
    emotionalImpacts: ['Angst', 'Wut', 'Hilflosigkeit', 'Spaltung'],
  },
  severe: {
    descriptions: [
      'Hunderttausende sind fehlinformiert',
      'Gesellschaftliche Gräben vertiefen sich',
      'Demokratische Institutionen werden geschwächt',
    ],
    peopleRange: [50000, 500000],
    emotionalImpacts: ['Trauma', 'Radikalisierung', 'Vertrauensverlust'],
  },
  devastating: {
    descriptions: [
      'Millionen Menschen glauben an Falschinformationen',
      'Wissenschaftliche Erkenntnisse werden ignoriert',
      'Die Gesellschaft zerfällt in Filterblasen',
    ],
    peopleRange: [500000, 5000000],
    emotionalImpacts: ['Massenpanik', 'Gesellschaftliche Spaltung', 'Zusammenbruch des Vertrauens'],
  },
};

export class ConsequenceGenerator {
  private consequences: Consequence[] = [];
  private societalImpact: SocietalImpact = {
    livesAffected: 0,
    trustInInstitutions: 0.65,
    polarizationLevel: 0.3,
    misinformationSpread: 0.1,
    silencedVoices: 0,
    radicalizedGroups: 0,
    economicCost: 0,
  };

  /**
   * Get persona data for an actor
   */
  getPersona(actorId: string): PersonaData | null {
    return (actorPersonas as Record<string, PersonaData>)[actorId] || null;
  }

  /**
   * Generate consequence for an ability result
   */
  generateConsequence(
    result: AbilityResult,
    ability: Ability,
    targetActor: Actor,
    round: number
  ): Consequence | null {
    const persona = this.getPersona(targetActor.id);
    if (!persona) return null;

    const effect = result.effects.find(e => e.actorId === targetActor.id);
    if (!effect) return null;

    // Determine severity based on trust delta
    const severity = this.calculateSeverity(effect.trustDelta, targetActor.trust);

    // Determine consequence type
    const type = this.determineType(effect, targetActor);

    // Generate narrative
    const narrative = this.generateNarrative(ability.id, persona, type, targetActor);

    // Calculate human cost
    const humanCost = this.calculateHumanCost(severity, targetActor);

    const consequence: Consequence = {
      id: `consequence_${round}_${targetActor.id}_${Date.now()}`,
      actorId: targetActor.id,
      actorName: targetActor.name,
      personName: persona.personName,
      type,
      narrative,
      severity,
      humanCost,
      round,
    };

    this.consequences.push(consequence);
    this.updateSocietalImpact(consequence, targetActor);

    return consequence;
  }

  /**
   * Calculate severity based on trust change
   */
  private calculateSeverity(
    trustDelta: number,
    currentTrust: number
  ): Consequence['severity'] {
    const absDelta = Math.abs(trustDelta);

    // More severe if actor crosses control threshold
    if (currentTrust < 0.4 && currentTrust + absDelta >= 0.4) {
      return 'devastating';
    }

    if (absDelta >= 0.2) return 'devastating';
    if (absDelta >= 0.12) return 'severe';
    if (absDelta >= 0.06) return 'moderate';
    return 'minor';
  }

  /**
   * Determine consequence type
   */
  private determineType(
    effect: AbilityResult['effects'][0],
    actor: Actor
  ): Consequence['type'] {
    if (actor.trust < 0.4) return 'controlled';
    if (effect.trustDelta < -0.15) return 'reputation_damaged';
    if (actor.trust < 0.5) return 'silenced';
    return 'attacked';
  }

  /**
   * Generate narrative text
   */
  private generateNarrative(
    abilityId: string,
    persona: PersonaData,
    type: Consequence['type'],
    actor: Actor
  ): string {
    // Use consequence template if available for type
    if (type === 'controlled' && persona.consequenceTemplates?.controlled) {
      return persona.consequenceTemplates.controlled;
    }
    if (type === 'attacked' && persona.consequenceTemplates?.attacked) {
      return this.fillTemplate(persona.consequenceTemplates.attacked, persona, actor);
    }

    // Use ability-specific consequences
    const templates = ABILITY_CONSEQUENCES[abilityId];
    if (templates && templates.length > 0) {
      const template = templates[Math.floor(Math.random() * templates.length)];
      return this.fillTemplate(template, persona, actor);
    }

    // Fallback generic consequences
    return this.generateGenericConsequence(persona, type, actor);
  }

  /**
   * Fill template with persona data
   */
  private fillTemplate(template: string, persona: PersonaData, actor: Actor): string {
    const isFemale = persona.personName.includes('Elisabeth') ||
                     persona.personName.includes('Maria') ||
                     persona.personName.includes('Sandra') ||
                     persona.personName.includes('Sabine') ||
                     persona.personName.includes('Lena') ||
                     persona.personName.includes('Hannah');

    return template
      .replace(/{name}/g, actor.name)
      .replace(/{person}/g, persona.personName)
      .replace(/{pronoun}/g, isFemale ? 'ihre' : 'seine')
      .replace(/{pronoun_dative}/g, isFemale ? 'ihr' : 'ihm')
      .replace(/{role}/g, persona.role);
  }

  /**
   * Generate generic consequence
   */
  private generateGenericConsequence(
    persona: PersonaData,
    type: Consequence['type'],
    actor: Actor
  ): string {
    switch (type) {
      case 'controlled':
        return `${persona.personName} hat aufgegeben. ${actor.name} ist nun ein Sprachrohr für Desinformation.`;
      case 'reputation_damaged':
        return `Das Vertrauen in ${persona.personName} ist schwer beschädigt. ${persona.role} - eine Position, die einst Respekt bedeutete.`;
      case 'silenced':
        return `${persona.personName} hat aufgehört, sich öffentlich zu äußern. Eine wichtige Stimme verstummt.`;
      case 'radicalized':
        return `Die Angriffe haben ${persona.personName} radikalisiert. Nuancierte Positionen weichen extremen Ansichten.`;
      default:
        return `${persona.personName} wurde Ziel einer Kampagne. Die Auswirkungen werden lange spürbar sein.`;
    }
  }

  /**
   * Calculate human cost
   */
  private calculateHumanCost(
    severity: Consequence['severity'],
    actor: Actor
  ): Consequence['humanCost'] {
    const template = HUMAN_COST_TEMPLATES[severity];
    const [minPeople, maxPeople] = template.peopleRange;

    // Scale by actor's reach
    const reachMultiplier = 1 + (actor.influenceRadius / 100);
    const peopleAffected = Math.floor(
      (minPeople + Math.random() * (maxPeople - minPeople)) * reachMultiplier
    );

    return {
      description: template.descriptions[Math.floor(Math.random() * template.descriptions.length)],
      peopleAffected,
      emotionalImpact: template.emotionalImpacts[Math.floor(Math.random() * template.emotionalImpacts.length)],
    };
  }

  /**
   * Update societal impact
   */
  private updateSocietalImpact(consequence: Consequence, actor: Actor): void {
    // Add to lives affected
    this.societalImpact.livesAffected += consequence.humanCost.peopleAffected;

    // Adjust trust in institutions
    const trustDelta = {
      minor: -0.005,
      moderate: -0.015,
      severe: -0.03,
      devastating: -0.05,
    }[consequence.severity];
    this.societalImpact.trustInInstitutions = Math.max(
      0.1,
      this.societalImpact.trustInInstitutions + trustDelta
    );

    // Increase polarization
    const polarizationDelta = {
      minor: 0.01,
      moderate: 0.03,
      severe: 0.05,
      devastating: 0.08,
    }[consequence.severity];
    this.societalImpact.polarizationLevel = Math.min(
      1,
      this.societalImpact.polarizationLevel + polarizationDelta
    );

    // Increase misinformation spread
    const misinfoDelta = {
      minor: 0.005,
      moderate: 0.02,
      severe: 0.04,
      devastating: 0.07,
    }[consequence.severity];
    this.societalImpact.misinformationSpread = Math.min(
      1,
      this.societalImpact.misinformationSpread + misinfoDelta
    );

    // Track silenced voices
    if (consequence.type === 'silenced' || consequence.type === 'controlled') {
      this.societalImpact.silencedVoices++;
    }

    // Economic cost (in millions)
    const economicCost = {
      minor: 0.1,
      moderate: 1,
      severe: 5,
      devastating: 20,
    }[consequence.severity];
    this.societalImpact.economicCost += economicCost;
  }

  /**
   * Get all consequences
   */
  getConsequences(): Consequence[] {
    return this.consequences;
  }

  /**
   * Get recent consequences (last N)
   */
  getRecentConsequences(count: number = 5): Consequence[] {
    return this.consequences.slice(-count);
  }

  /**
   * Get societal impact
   */
  getSocietalImpact(): SocietalImpact {
    return { ...this.societalImpact };
  }

  /**
   * Reset for new game
   */
  reset(): void {
    this.consequences = [];
    this.societalImpact = {
      livesAffected: 0,
      trustInInstitutions: 0.65,
      polarizationLevel: 0.3,
      misinformationSpread: 0.1,
      silencedVoices: 0,
      radicalizedGroups: 0,
      economicCost: 0,
    };
  }
}

// Singleton instance
export const consequenceGenerator = new ConsequenceGenerator();
