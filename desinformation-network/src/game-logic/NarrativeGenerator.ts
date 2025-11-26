import type { Actor, Ability, GameEvent } from './types';
import type { ActionRecord, ImpactLevel, RoundSummary } from './types/narrative';

// ============================================
// NARRATIVE TEMPLATES
// ============================================

const ABILITY_NARRATIVES: Record<string, {
  headline: (source: Actor, targets: Actor[]) => string;
  description: (source: Actor, targets: Actor[]) => string;
  examples: (source: Actor, targets: Actor[]) => string[];
}> = {
  agenda_setting: {
    headline: (s, t) => `${s.name} Reshapes Public Discourse`,
    description: (s, t) =>
      `${s.name} successfully controlled the narrative, making ${t.map(a => a.name).join(', ')} focus on predetermined talking points while ignoring other critical issues.`,
    examples: (s, t) => [
      `News cycles dominated by sensationalized coverage of minor incidents, drowning out substantive policy discussions`,
      `Social media trends artificially amplified to create the illusion of widespread concern`,
      `Expert interviews carefully selected to present only specific perspectives`
    ]
  },

  scandalize: {
    headline: (s, t) => `${t[0]?.name || 'Target'} Engulfed in Controversy`,
    description: (s, t) =>
      `${s.name} amplified minor incidents into major scandals targeting ${t.map(a => a.name).join(', ')}, triggering emotional reactions that overwhelmed rational assessment.`,
    examples: (s, t) => [
      `Out-of-context quotes circulated widely, creating impression of impropriety`,
      `Social media pile-on with thousands of angry comments based on incomplete information`,
      `Calls for resignation before all facts emerged, driven by manufactured outrage`
    ]
  },

  undermine_authority: {
    headline: (s, t) => `Expert Credibility Under Attack`,
    description: (s, t) =>
      `${s.name} launched coordinated attacks on ${t.map(a => a.name).join(', ')}, questioning their credentials, funding sources, and motives rather than their evidence.`,
    examples: (s, t) => [
      `Ad hominem attacks suggesting financial conflicts of interest without evidence`,
      `Cherry-picked past mistakes presented as proof of systematic unreliability`,
      `'Do your own research' campaigns undermining institutional expertise`
    ]
  },

  sow_doubt: {
    headline: (s, t) => `Uncertainty Spreads Through ${t[0]?.category || 'Network'}`,
    description: (s, t) =>
      `${s.name} introduced carefully crafted uncertainty about established facts, making ${t.map(a => a.name).join(', ')} question their previous understanding.`,
    examples: (s, t) => [
      `"Some people say..." framing to legitimize fringe views`,
      `False balance in coverage: presenting outlier opinions as equally valid`,
      `Highlighting normal scientific debate as proof of fundamental uncertainty`
    ]
  },

  conspiracy_framing: {
    headline: (s, t) => `Hidden Agendas Allegedly Exposed`,
    description: (s, t) =>
      `${s.name} reframed events through conspiracy lens, making ${t.map(a => a.name).join(', ')} appear part of coordinated manipulation, regardless of evidence.`,
    examples: (s, t) => [
      `Coincidences presented as proof of coordination`,
      `Normal institutional processes depicted as secretive cabals`,
      `Complexity simplified into good vs. evil narrative with hidden puppet masters`
    ]
  },

  astroturfing: {
    headline: (s, t) => `Manufactured Grassroots Movement Gains Traction`,
    description: (s, t) =>
      `${s.name} created fake grassroots support, making ${t.map(a => a.name).join(', ')} believe there was widespread organic backing for specific positions.`,
    examples: (s, t) => [
      `Bot networks creating trending hashtags and viral content`,
      `Paid protesters presented as concerned citizens`,
      `Form letter campaigns disguised as individual correspondence`
    ]
  },

  emotional_appeal: {
    headline: (s, t) => `Emotions Override Reason`,
    description: (s, t) =>
      `${s.name} triggered strong emotional responses in ${t.map(a => a.name).join(', ')}, bypassing critical thinking with fear, anger, or moral outrage.`,
    examples: (s, t) => [
      `Heartbreaking imagery used without context or verification`,
      `Appeals to protecting children/families to justify any measure`,
      `Fear-mongering about existential threats requiring immediate action`
    ]
  },

  divide_conquer: {
    headline: (s, t) => `Social Divisions Amplified`,
    description: (s, t) =>
      `${s.name} exacerbated existing divisions, preventing ${t.map(a => a.name).join(', ')} from forming unified responses by emphasizing differences over common ground.`,
    examples: (s, t) => [
      `Wedge issues deliberately highlighted to split potential coalitions`,
      `Identity politics weaponized to create in-group/out-group dynamics`,
      `Moderate voices drowned out by amplifying extremes on both sides`
    ]
  }
};

const EVENT_NARRATIVES: Record<string, {
  headline: string;
  description: string;
  examples: string[];
}> = {
  viral_misinformation: {
    headline: 'Viral Misinformation Spreads Unchecked',
    description: 'A compelling but false narrative spread across social platforms faster than fact-checkers could respond, reaching millions before corrections could gain traction.',
    examples: [
      'Doctored video shared millions of times before debunking',
      'Emotionally charged falsehood outperformed factual corrections in engagement',
      'Platform algorithms amplified sensational content over accurate reporting'
    ]
  },

  public_scandal: {
    headline: 'Media Outlet Rocked by Scandal',
    description: 'Revelations of misconduct at a major media organization shook public trust, validating pre-existing suspicions of bias and manipulation.',
    examples: [
      'Internal messages revealed editorial bias in supposedly objective coverage',
      'Fact-checking standards bypassed for politically convenient stories',
      'Corrections buried while initial false claims received prominent placement'
    ]
  },

  trust_crisis: {
    headline: 'Emergency Response to Trust Collapse',
    description: 'With trust in institutions at critical lows, defensive mechanisms activated to prevent total breakdown of information ecosystem.',
    examples: [
      'Government announces new anti-disinformation taskforce',
      'Platform policies strengthened after public pressure',
      'Fact-checking organizations receive emergency funding'
    ]
  }
};

// ============================================
// NARRATIVE GENERATOR
// ============================================

export class NarrativeGenerator {
  /**
   * Generate headline for an action
   */
  static generateHeadline(
    type: 'ability' | 'event',
    abilityId: string | undefined,
    eventId: string | undefined,
    source: Actor | undefined,
    targets: Actor[]
  ): string {
    if (type === 'ability' && abilityId && source) {
      const template = ABILITY_NARRATIVES[abilityId];
      if (template) {
        return template.headline(source, targets);
      }
      return `${source.name} takes action`;
    }

    if (type === 'event' && eventId) {
      const template = EVENT_NARRATIVES[eventId];
      if (template) {
        return template.headline;
      }
    }

    return 'Network activity detected';
  }

  /**
   * Generate description for an action
   */
  static generateDescription(
    type: 'ability' | 'event',
    abilityId: string | undefined,
    eventId: string | undefined,
    source: Actor | undefined,
    targets: Actor[]
  ): string {
    if (type === 'ability' && abilityId && source) {
      const template = ABILITY_NARRATIVES[abilityId];
      if (template) {
        return template.description(source, targets);
      }
      return `${source.name} influenced ${targets.length} actors in the network.`;
    }

    if (type === 'event' && eventId) {
      const template = EVENT_NARRATIVES[eventId];
      if (template) {
        return template.description;
      }
    }

    return 'The information landscape shifted in subtle but significant ways.';
  }

  /**
   * Generate concrete examples
   */
  static generateExamples(
    type: 'ability' | 'event',
    abilityId: string | undefined,
    eventId: string | undefined,
    source: Actor | undefined,
    targets: Actor[]
  ): string[] {
    if (type === 'ability' && abilityId) {
      const template = ABILITY_NARRATIVES[abilityId];
      if (template && source) {
        return template.examples(source, targets);
      }
    }

    if (type === 'event' && eventId) {
      const template = EVENT_NARRATIVES[eventId];
      if (template) {
        return template.examples;
      }
    }

    return [
      'Information spread through network connections',
      'Trust levels shifted based on recent events',
      'Public discourse influenced by competing narratives'
    ];
  }

  /**
   * Determine impact level based on trust changes
   */
  static determineImpactLevel(totalTrustChange: number, actorsAffected: number): ImpactLevel {
    const avgChange = Math.abs(totalTrustChange / Math.max(actorsAffected, 1));

    if (avgChange < 0.05) return 'minimal';
    if (avgChange < 0.10) return 'minor';
    if (avgChange < 0.15) return 'moderate';
    if (avgChange < 0.20) return 'significant';
    if (avgChange < 0.30) return 'major';
    return 'devastating';
  }

  /**
   * Generate round narrative
   */
  static generateRoundNarrative(
    actions: ActionRecord[],
    networkBefore: any,
    networkAfter: any
  ): string {
    const trustDrop = networkBefore.averageTrust - networkAfter.averageTrust;
    const polarizationRise = networkAfter.polarization - networkBefore.polarization;

    let narrative = '';

    if (actions.length === 0) {
      narrative = 'The information ecosystem continued evolving through natural dynamics. ';
    } else if (actions.length === 1) {
      narrative = `A single decisive action rippled through the network. `;
    } else {
      narrative = `Multiple coordinated actions created cascading effects across the network. `;
    }

    if (trustDrop > 0.1) {
      narrative += `Public trust plummeted significantly, with widespread skepticism taking hold. `;
    } else if (trustDrop > 0.05) {
      narrative += `Noticeable erosion of trust as doubt spread through connected actors. `;
    } else if (trustDrop > 0) {
      narrative += `Subtle shifts in trust levels as narratives competed for influence. `;
    } else {
      narrative += `Trust levels remained relatively stable despite ongoing pressures. `;
    }

    if (polarizationRise > 0.1) {
      narrative += `Society fractured further into opposing camps, making dialogue increasingly difficult.`;
    } else if (polarizationRise > 0.05) {
      narrative += `Growing polarization made consensus harder to achieve.`;
    }

    return narrative.trim();
  }

  /**
   * Generate key moments from actions
   */
  static generateKeyMoments(actions: ActionRecord[]): string[] {
    return actions
      .sort((a, b) => Math.abs(Object.values(b.trustChanges).reduce((sum, v) => sum + Math.abs(v), 0)) -
                      Math.abs(Object.values(a.trustChanges).reduce((sum, v) => sum + Math.abs(v), 0)))
      .slice(0, 3)
      .map(action => action.headline);
  }

  /**
   * Generate consequences for the round
   */
  static generateConsequences(
    networkBefore: any,
    networkAfter: any,
    actions: ActionRecord[]
  ): string[] {
    const consequences: string[] = [];

    const newLowTrust = networkAfter.lowTrustCount - networkBefore.lowTrustCount;
    if (newLowTrust > 0) {
      consequences.push(`${newLowTrust} additional actor${newLowTrust > 1 ? 's' : ''} fell to critically low trust levels`);
    }

    const trustDrop = networkBefore.averageTrust - networkAfter.averageTrust;
    if (trustDrop > 0.1) {
      consequences.push('Network-wide trust collapse threatens information ecosystem stability');
    }

    if (networkAfter.polarization > 0.7) {
      consequences.push('Extreme polarization makes unified response nearly impossible');
    }

    const highImpactActions = actions.filter(a =>
      a.impactLevel === 'major' || a.impactLevel === 'devastating'
    );
    if (highImpactActions.length > 0) {
      consequences.push(`${highImpactActions.length} high-impact event${highImpactActions.length > 1 ? 's' : ''} created lasting effects`);
    }

    if (consequences.length === 0) {
      consequences.push('Network maintained relative equilibrium despite ongoing pressures');
    }

    return consequences;
  }
}
