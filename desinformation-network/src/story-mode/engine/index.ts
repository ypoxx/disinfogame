/**
 * Story Mode Engine - Main entry point
 */

export { ActionLoader, getActionLoader, resetActionLoader } from './ActionLoader';
export type { RawAction, LoadedAction, ActionFilters } from './ActionLoader';

export { ConsequenceSystem, getConsequenceSystem, resetConsequenceSystem } from './ConsequenceSystem';
export type {
  ConsequenceDefinition,
  ConsequenceChoice,
  PendingConsequence,
  ActiveConsequence,
} from './ConsequenceSystem';

export { DialogLoader, dialogLoader } from './DialogLoader';
export type {
  Dialogue,
  DialogueResponse,
  NPCDialogues,
  DialogueType,
  ResponseEffects,
} from './DialogLoader';

export { CountermeasureSystem, countermeasureSystem } from './CountermeasureSystem';
export type {
  CountermeasureDefinition,
  CounterOption,
  ActiveCountermeasure,
  CountermeasureContext,
  SeverityLevel,
} from './CountermeasureSystem';

export { getTaxonomyLoader, taxonomyLoader } from './TaxonomyLoader';
export type {
  TaxonomyTechnique,
  TaxonomyInfo,
} from './TaxonomyLoader';

export { StoryComboSystem, getStoryComboSystem, resetStoryComboSystem } from './StoryComboSystem';
export type {
  StoryComboProgress,
  StoryComboActivation,
  ComboHint,
} from './StoryComboSystem';

export { CrisisMomentSystem, getCrisisMomentSystem, resetCrisisMomentSystem } from './CrisisMomentSystem';
export type {
  CrisisMoment,
  CrisisChoice,
  CrisisEffect,
  ActiveCrisis,
  CrisisResolution,
} from './CrisisMomentSystem';

export { StoryActorAI, getStoryActorAI, resetStoryActorAI } from './StoryActorAI';
export type {
  DefensiveActor,
  DefensiveActorType,
  AIAction,
  AIActionEffect,
  StoryActorAIState,
} from './StoryActorAI';
