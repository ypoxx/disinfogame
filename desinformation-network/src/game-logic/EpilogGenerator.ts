import type { NetworkMetrics, Actor } from './types';
import type { SocietalImpact, Consequence } from './ConsequenceGenerator';
import actorPersonas from '@/data/game/actor-personas.json';

// ============================================
// EPILOG GENERATOR - Sprint 4
// Shows long-term consequences of player actions
// "Was passiert 2, 10 Jahre später?"
// ============================================

export type EpilogEntry = {
  timeframe: '6_months' | '2_years' | '10_years';
  category: 'personal' | 'institutional' | 'societal' | 'global';
  text: string;
  severity: 'neutral' | 'concerning' | 'severe' | 'catastrophic';
  icon: string;
};

export type EpilogData = {
  gameResult: 'victory' | 'defeat';
  roundsPlayed: number;
  finalMetrics: NetworkMetrics;
  societalImpact: SocietalImpact;
  entries: {
    sixMonths: EpilogEntry[];
    twoYears: EpilogEntry[];
    tenYears: EpilogEntry[];
  };
  finalStatement: string;
};

type PersonaData = {
  personName: string;
  role: string;
  consequenceTemplates?: {
    attacked?: string;
    controlled?: string;
  };
};

// Personal fate templates for controlled actors
const PERSONAL_FATES_6_MONTHS: Record<string, string[]> = {
  media: [
    '{person} hat den Job gewechselt. "Ich konnte nicht mehr guten Gewissens arbeiten."',
    '{person}s Redaktion hat 30% der Mitarbeiter entlassen. Die Qualität leidet sichtbar.',
    '{person} braucht jetzt Personenschutz. Das Familienleben ist zerstört.',
  ],
  expert: [
    '{person} hat aufgehört, öffentlich aufzutreten. "Es ist den Stress nicht wert."',
    '{person}s Forschungsantrag wurde abgelehnt - zu "politisch".',
    '{person} ist nach Skandinavien gezogen. "Dort hört man noch auf Experten."',
  ],
  organization: [
    '{person}s Institution hat 40% des öffentlichen Vertrauens verloren.',
    '{person} ist zurückgetreten. Der Nachfolger ist "weniger kontrovers".',
    '{person} arbeitet jetzt in der Privatwirtschaft. "Mehr Geld, weniger Anfeindungen."',
  ],
};

const PERSONAL_FATES_2_YEARS: Record<string, string[]> = {
  media: [
    'Die Redaktion existiert nicht mehr in der alten Form. {person} schreibt jetzt einen Blog.',
    '{person} hat ein Buch über die Erfahrungen geschrieben. Es verkauft sich schlecht.',
    '{person}s Kinder haben die Schule gewechselt. Dreimal.',
  ],
  expert: [
    '{person} forscht nicht mehr. Das Burn-out hat zu lange gedauert.',
    '{person}s Lehrstuhl wurde nicht nachbesetzt. "Zu viel Aufwand für zu wenig Akzeptanz."',
    '{person} ist einer der letzten verbliebenen Experten des Fachs in Deutschland.',
  ],
  organization: [
    'Die Institution wurde "reformiert". Kritische Stimmen sind verstummt.',
    '{person}s Nachfolger macht vor allem PR, keine Aufklärung.',
    'Das Budget wurde halbiert. "Effizienzsteigerung".',
  ],
};

const PERSONAL_FATES_10_YEARS: Record<string, string[]> = {
  media: [
    'Niemand erinnert sich mehr an {person}. Die neue Generation kennt nur noch Clickbait.',
    '{person}s Warnungen von damals haben sich bewahrheitet. Zu spät.',
    'Ein Dokumentarfilm über {person}s Kampf gewinnt einen Preis. Er ändert nichts.',
  ],
  expert: [
    'Das Fachgebiet, das {person} aufgebaut hat, existiert in Deutschland kaum noch.',
    'Junge Wissenschaftler zitieren {person}s Arbeit. Sie fragen sich, warum niemand zuhörte.',
    '{person} wurde posthum rehabilitiert. Ein schwacher Trost.',
  ],
  organization: [
    'Die Institution, für die {person} stand, ist ein Schatten ihrer selbst.',
    'Historiker schreiben über den "institutionellen Verfall" dieser Jahre.',
    'Was {person} aufgebaut hat, muss von Grund auf neu errichtet werden.',
  ],
};

// Societal consequences templates
const SOCIETAL_CONSEQUENCES: Record<string, { threshold: number; entries: Partial<Record<EpilogEntry['timeframe'], string>> }[]> = {
  trustInInstitutions: [
    {
      threshold: 0.5,
      entries: {
        '6_months': 'Umfragen zeigen: Nur noch 45% vertrauen "den Medien".',
        '2_years': 'Die Wahlbeteiligung sinkt auf 55%. "Alle lügen sowieso."',
        '10_years': 'Eine Generation ist aufgewachsen, die keiner Institution vertraut.',
      }
    },
    {
      threshold: 0.3,
      entries: {
        '6_months': 'Verschwörungstheorien sind Mainstream geworden.',
        '2_years': 'Extremistische Parteien erreichen 25% in Umfragen.',
        '10_years': 'Die Demokratie wurde grundlegend verändert. Experten sprechen von "illiberaler Demokratie".',
      }
    },
  ],
  polarizationLevel: [
    {
      threshold: 0.6,
      entries: {
        '6_months': 'Familienfeiern enden in Streit. "Wir reden nicht mehr über Politik."',
        '2_years': 'Dating-Apps zeigen jetzt politische Einstellungen. Um "Zeitverschwendung" zu vermeiden.',
        '10_years': 'Die Gesellschaft lebt in getrennten Realitäten. Gemeinsame Fakten gibt es nicht mehr.',
      }
    },
    {
      threshold: 0.8,
      entries: {
        '6_months': 'Gewalt bei Demonstrationen nimmt zu. Die Polizei ist überfordert.',
        '2_years': 'Nachbarschaften spalten sich. "Die von der anderen Seite" sind Feinde.',
        '10_years': 'Historiker vergleichen die Spaltung mit der Weimarer Republik.',
      }
    },
  ],
  misinformationSpread: [
    {
      threshold: 0.5,
      entries: {
        '6_months': '35% der Deutschen glauben mindestens eine Verschwörungstheorie.',
        '2_years': 'Die Impfquote bei Kindern sinkt auf 70%. Masern kehren zurück.',
        '10_years': 'Wissenschaftliche Erkenntnisse werden routinemäßig angezweifelt.',
      }
    },
    {
      threshold: 0.7,
      entries: {
        '6_months': 'Fake News verbreiten sich 6x schneller als Korrekturen.',
        '2_years': 'Schulen unterrichten "Medienkompetenz", aber es ist zu spät für eine Generation.',
        '10_years': '"Alternative Fakten" sind ein akzeptierter Begriff geworden.',
      }
    },
  ],
};

export class EpilogGenerator {
  /**
   * Generate complete epilog for game end
   */
  generateEpilog(
    gameResult: 'victory' | 'defeat',
    roundsPlayed: number,
    finalMetrics: NetworkMetrics,
    societalImpact: SocietalImpact,
    controlledActors: Actor[],
    consequences: Consequence[]
  ): EpilogData {
    const entries = {
      sixMonths: this.generateTimeframeEntries('6_months', societalImpact, controlledActors, consequences),
      twoYears: this.generateTimeframeEntries('2_years', societalImpact, controlledActors, consequences),
      tenYears: this.generateTimeframeEntries('10_years', societalImpact, controlledActors, consequences),
    };

    const finalStatement = this.generateFinalStatement(gameResult, societalImpact, roundsPlayed);

    return {
      gameResult,
      roundsPlayed,
      finalMetrics,
      societalImpact,
      entries,
      finalStatement,
    };
  }

  /**
   * Generate entries for a specific timeframe
   */
  private generateTimeframeEntries(
    timeframe: EpilogEntry['timeframe'],
    impact: SocietalImpact,
    controlledActors: Actor[],
    consequences: Consequence[]
  ): EpilogEntry[] {
    const entries: EpilogEntry[] = [];

    // Personal fates for controlled actors (max 3)
    const personalFates = this.generatePersonalFates(timeframe, controlledActors.slice(0, 3));
    entries.push(...personalFates);

    // Societal consequences based on impact metrics
    const societalEntries = this.generateSocietalEntries(timeframe, impact);
    entries.push(...societalEntries);

    // Statistical summary
    if (timeframe === '2_years') {
      entries.push(this.generateStatisticalEntry(impact));
    }

    return entries;
  }

  /**
   * Generate personal fate entries
   */
  private generatePersonalFates(
    timeframe: EpilogEntry['timeframe'],
    actors: Actor[]
  ): EpilogEntry[] {
    const fateTemplates = {
      '6_months': PERSONAL_FATES_6_MONTHS,
      '2_years': PERSONAL_FATES_2_YEARS,
      '10_years': PERSONAL_FATES_10_YEARS,
    }[timeframe];

    return actors.map(actor => {
      const persona = (actorPersonas as Record<string, PersonaData>)[actor.id];
      const categoryFates = fateTemplates[actor.category] || fateTemplates['media'];
      const template = categoryFates[Math.floor(Math.random() * categoryFates.length)];

      const text = persona
        ? template.replace(/{person}/g, persona.personName)
        : template.replace(/{person}/g, actor.name);

      return {
        timeframe,
        category: 'personal' as const,
        text,
        severity: this.calculateSeverity(actor.trust),
        icon: this.getIconForCategory(actor.category),
      };
    });
  }

  /**
   * Generate societal consequence entries
   */
  private generateSocietalEntries(
    timeframe: EpilogEntry['timeframe'],
    impact: SocietalImpact
  ): EpilogEntry[] {
    const entries: EpilogEntry[] = [];

    // Check trust in institutions
    for (const config of SOCIETAL_CONSEQUENCES.trustInInstitutions) {
      if (impact.trustInInstitutions <= config.threshold && config.entries[timeframe]) {
        entries.push({
          timeframe,
          category: 'institutional',
          text: config.entries[timeframe]!,
          severity: config.threshold <= 0.3 ? 'catastrophic' : 'severe',
          icon: '🏛️',
        });
        break;
      }
    }

    // Check polarization
    for (const config of SOCIETAL_CONSEQUENCES.polarizationLevel) {
      if (impact.polarizationLevel >= config.threshold && config.entries[timeframe]) {
        entries.push({
          timeframe,
          category: 'societal',
          text: config.entries[timeframe]!,
          severity: config.threshold >= 0.8 ? 'catastrophic' : 'severe',
          icon: '⚡',
        });
        break;
      }
    }

    // Check misinformation spread
    for (const config of SOCIETAL_CONSEQUENCES.misinformationSpread) {
      if (impact.misinformationSpread >= config.threshold && config.entries[timeframe]) {
        entries.push({
          timeframe,
          category: 'societal',
          text: config.entries[timeframe]!,
          severity: config.threshold >= 0.7 ? 'catastrophic' : 'severe',
          icon: '📱',
        });
        break;
      }
    }

    return entries;
  }

  /**
   * Generate statistical summary entry
   */
  private generateStatisticalEntry(impact: SocietalImpact): EpilogEntry {
    const livesFormatted = impact.livesAffected >= 1000000
      ? `${(impact.livesAffected / 1000000).toFixed(1)} Millionen`
      : `${Math.floor(impact.livesAffected / 1000)}k`;

    return {
      timeframe: '2_years',
      category: 'global',
      text: `Bilanz: ${livesFormatted} Menschen wurden direkt beeinflusst. ${impact.silencedVoices} wichtige Stimmen sind verstummt. Volkswirtschaftlicher Schaden: geschätzte ${impact.economicCost.toFixed(1)} Millionen Euro.`,
      severity: impact.livesAffected > 1000000 ? 'catastrophic' : 'severe',
      icon: '📊',
    };
  }

  /**
   * Generate final statement
   */
  private generateFinalStatement(
    result: 'victory' | 'defeat',
    impact: SocietalImpact,
    rounds: number
  ): string {
    if (result === 'victory') {
      if (impact.trustInInstitutions < 0.3) {
        return 'Du hast gewonnen. Aber zu welchem Preis? Die Gesellschaft, die du hinterlässt, wird Generationen brauchen, um sich zu erholen. War es das wert?';
      }
      if (impact.polarizationLevel > 0.7) {
        return 'Dein Sieg hat die Gesellschaft gespalten. Familien reden nicht mehr miteinander. Freundschaften sind zerbrochen. Die Wahrheit ist zu einem Luxusgut geworden.';
      }
      if (rounds < 15) {
        return 'Ein schneller Sieg - aber die Wunden heilen langsam. Die Menschen, die du manipuliert hast, werden die Narben tragen.';
      }
      return 'Du hast das System gebrochen. Die Frage ist nur: Wer baut es wieder auf?';
    } else {
      return 'Die Gesellschaft hat sich gewehrt. Dieses Mal. Aber die Werkzeuge, die du benutzt hast, existieren weiter. Der nächste Versuch wird kommen.';
    }
  }

  /**
   * Calculate severity from trust level
   */
  private calculateSeverity(trust: number): EpilogEntry['severity'] {
    if (trust < 0.2) return 'catastrophic';
    if (trust < 0.4) return 'severe';
    if (trust < 0.6) return 'concerning';
    return 'neutral';
  }

  /**
   * Get icon for actor category
   */
  private getIconForCategory(category: string): string {
    const icons: Record<string, string> = {
      media: '📰',
      expert: '🔬',
      lobby: '💼',
      organization: '🏥',
      infrastructure: '🌐',
      defensive: '🛡️',
    };
    return icons[category] || '👤';
  }
}

// Singleton instance
export const epilogGenerator = new EpilogGenerator();
