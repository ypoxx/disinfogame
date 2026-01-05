/**
 * TaxonomyLoader - Loads and provides access to persuasion techniques taxonomy
 *
 * Links game actions to real-world persuasion research for educational value.
 */

import taxonomyData from '../../data/persuasion/taxonomy.json';
import { storyLogger } from '../../utils/logger';

export interface TaxonomyTechnique {
  id: string;
  name: string;
  category: string;
  description: string;
  longDescription: string;
  example: string;
  extendedExample: string;
  wikipediaQuery: string;
  taxonomyGroups: string[];
  applications: string[];
  manipulationPotential: number;
  uncertainty: {
    confidenceInterval: [number, number];
    confidenceLevel: string;
    basis: string;
  };
  empiricalEvidence: string[];
  counterStrategies: string[];
}

export interface TaxonomyInfo {
  techniques: TaxonomyTechnique[];
  primaryTechnique: TaxonomyTechnique | null;
  combinedManipulationPotential: number;
  allCounterStrategies: string[];
  allEvidence: string[];
}

// Mapping from action tags/types to taxonomy technique IDs
const ACTION_TAG_TO_TAXONOMY: Record<string, string[]> = {
  // Content creation
  'fake_news': ['framing', 'emotional_appeal', 'narrative_persuasion'],
  'propaganda': ['framing', 'emotional_appeal', 'bandwagon'],
  'conspiracy': ['narrative_persuasion', 'authority', 'false_balance'],
  'meme': ['emotional_appeal', 'priming', 'social_proof'],
  'deepfake': ['authority', 'narrative_persuasion'],

  // Amplification
  'bot': ['bandwagon', 'social_proof', 'astroturfing'],
  'amplification': ['social_proof', 'bandwagon', 'repetition'],
  'viral': ['emotional_appeal', 'social_proof'],
  'astroturfing': ['astroturfing', 'social_proof'],

  // Targeting
  'targeting': ['priming', 'framing'],
  'microtargeting': ['priming', 'emotional_appeal'],
  'polarization': ['false_balance', 'emotional_appeal', 'whataboutism'],

  // Attacks
  'attack': ['ad_hominem', 'strawman'],
  'discredit': ['ad_hominem', 'authority'],
  'harassment': ['emotional_appeal', 'intimidation'],
  'doxxing': ['intimidation', 'emotional_appeal'],

  // Manipulation
  'manipulation': ['framing', 'emotional_appeal', 'priming'],
  'exploit': ['emotional_appeal', 'scarcity'],
  'division': ['false_balance', 'whataboutism', 'emotional_appeal'],

  // Infrastructure
  'infiltration': ['authority', 'social_proof'],
  'network': ['social_proof', 'bandwagon'],
  'platform': ['algorithmic_manipulation'],

  // Analysis
  'analysis': ['framing'],
  'planning': ['framing'],
  'strategy': ['framing'],

  // Political
  'election': ['framing', 'emotional_appeal', 'bandwagon'],
  'political': ['framing', 'emotional_appeal', 'whataboutism'],
  'influence': ['authority', 'social_proof'],

  // Default mappings for common patterns
  'content': ['framing', 'narrative_persuasion'],
  'social_media': ['social_proof', 'bandwagon'],
  'media': ['framing', 'agenda_setting'],
};

// Direct action ID to taxonomy mapping for key actions
const ACTION_ID_TO_TAXONOMY: Record<string, string[]> = {
  '1.1': ['framing'],  // Zielgruppe analysieren
  '1.2': ['framing'],  // Strategische Ziele
  '1.3': ['framing', 'emotional_appeal', 'whataboutism'],  // 5Ds Framework
  '3.1': ['narrative_persuasion', 'framing'],  // Narrative entwickeln
  '3.2': ['framing', 'emotional_appeal'],  // Emotionale Hooks
  '3.3': ['narrative_persuasion'],  // Memes erstellen
  '3.4': ['framing', 'emotional_appeal'],  // Fake News
  '3.5': ['narrative_persuasion', 'authority'],  // Conspiracy theories
  '4.1': ['social_proof', 'bandwagon'],  // Social Media Kampagne
  '4.2': ['social_proof', 'bandwagon', 'astroturfing'],  // Bot-Netzwerk
  '4.3': ['repetition', 'bandwagon'],  // Hashtag-Kampagne
  '5.1': ['ad_hominem'],  // Journalist attackieren
  '5.2': ['ad_hominem', 'intimidation'],  // Doxxing
  '5.3': ['emotional_appeal', 'intimidation'],  // Harassment
  '6.1': ['authority', 'social_proof'],  // Politiker bestechen
  '6.2': ['authority'],  // Lobby-Kontakte
  '7.1': ['false_balance', 'emotional_appeal'],  // Polarisierung
  '7.2': ['whataboutism'],  // Whataboutism
};

class TaxonomyLoader {
  private techniques: Map<string, TaxonomyTechnique> = new Map();
  private initialized: boolean = false;

  constructor() {
    this.loadTaxonomy();
  }

  private loadTaxonomy(): void {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = taxonomyData as any;
      for (const node of data.nodes) {
        const technique: TaxonomyTechnique = {
          ...node,
          uncertainty: {
            ...node.uncertainty,
            confidenceInterval: node.uncertainty.confidenceInterval as [number, number],
          },
        };
        this.techniques.set(technique.id, technique);
      }
      this.initialized = true;
      storyLogger.log(`[TaxonomyLoader] Loaded ${this.techniques.size} persuasion techniques`);
    } catch (error) {
      console.error('[TaxonomyLoader] Failed to load taxonomy:', error);
    }
  }

  /**
   * Get taxonomy information for an action
   */
  getTaxonomyForAction(actionId: string, tags: string[] = []): TaxonomyInfo {
    const techniqueIds = new Set<string>();

    // First check direct action mapping
    if (ACTION_ID_TO_TAXONOMY[actionId]) {
      ACTION_ID_TO_TAXONOMY[actionId].forEach(id => techniqueIds.add(id));
    }

    // Then check tag mappings
    for (const tag of tags) {
      if (ACTION_TAG_TO_TAXONOMY[tag]) {
        ACTION_TAG_TO_TAXONOMY[tag].forEach(id => techniqueIds.add(id));
      }
    }

    // Collect techniques
    const techniques: TaxonomyTechnique[] = [];
    for (const id of techniqueIds) {
      const technique = this.techniques.get(id);
      if (technique) {
        techniques.push(technique);
      }
    }

    // Calculate combined manipulation potential (average)
    const combinedManipulationPotential = techniques.length > 0
      ? techniques.reduce((sum, t) => sum + t.manipulationPotential, 0) / techniques.length
      : 0;

    // Collect all counter strategies
    const allCounterStrategies = [...new Set(techniques.flatMap(t => t.counterStrategies))];

    // Collect all evidence
    const allEvidence = [...new Set(techniques.flatMap(t => t.empiricalEvidence))];

    return {
      techniques,
      primaryTechnique: techniques[0] || null,
      combinedManipulationPotential,
      allCounterStrategies,
      allEvidence,
    };
  }

  /**
   * Get a specific technique by ID
   */
  getTechnique(id: string): TaxonomyTechnique | null {
    return this.techniques.get(id) || null;
  }

  /**
   * Get all techniques
   */
  getAllTechniques(): TaxonomyTechnique[] {
    return Array.from(this.techniques.values());
  }

  /**
   * Get techniques by category
   */
  getTechniquesByCategory(category: string): TaxonomyTechnique[] {
    return Array.from(this.techniques.values()).filter(t => t.category === category);
  }

  /**
   * Format taxonomy info for display (optional details)
   */
  formatForDisplay(info: TaxonomyInfo, locale: 'de' | 'en' = 'de'): {
    basedOn: string;
    primaryDescription: string;
    evidence: string;
    counterStrategies: string[];
  } | null {
    if (info.techniques.length === 0) return null;

    const basedOn = info.techniques.map(t => t.name).join(', ');
    const primary = info.primaryTechnique;

    return {
      basedOn,
      primaryDescription: primary?.longDescription || '',
      evidence: info.allEvidence.slice(0, 2).join('; '),
      counterStrategies: info.allCounterStrategies.slice(0, 3),
    };
  }
}

// Singleton instance
let taxonomyLoaderInstance: TaxonomyLoader | null = null;

export function getTaxonomyLoader(): TaxonomyLoader {
  if (!taxonomyLoaderInstance) {
    taxonomyLoaderInstance = new TaxonomyLoader();
  }
  return taxonomyLoaderInstance;
}

export const taxonomyLoader = getTaxonomyLoader();
