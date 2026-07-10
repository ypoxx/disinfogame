// Story Mode UI Components
export { DialogBox } from './DialogBox';
export type { DialogChoice, DialogMessage } from './DialogBox';

export { StoryHUD } from './StoryHUD';
export type {
  StoryResources,
  StoryPhaseInfo,
  ObjectiveInfo,
} from './StoryHUD';

export { ActionCard } from './ActionCard';
export type { StoryAction as ActionPanelAction } from './ActionCard';
export { TerminalView } from './TerminalView';

// ActionQueueWidget → archive/story-mode-drafts/ (F-D: Queue-Chip statt Widget, 2026-07-07)
export { QueuePinChip } from './QueuePinChip';

export { TutorialOverlay, useTutorial, TUTORIAL_STEPS } from './TutorialOverlay';
export type { TutorialStep } from './TutorialOverlay';

export { GameEndScreen } from './GameEndScreen';
export type { GameEndData, EndingType } from './GameEndScreen';

export { BetrayalWarningBadge } from './BetrayalWarningBadge';
export { GrievanceModal } from './GrievanceModal';
export { BetrayalEventModal } from './BetrayalEventModal';

export { CrisisModal } from './CrisisModal';
export type { CrisisMoment, CrisisChoice } from '../engine/CrisisMomentSystem';

// ActorEffectivenessWidget entfernt (verwaist, kein Importeur) — 2026-05-31
export type { ActorEffectivenessModifier } from '../engine/ExtendedActorLoader';

// ComboHintsWidget → archive/story-mode-drafts/ (T2/L3: Zettel am Korkbrett, 2026-07-08)
export type { ComboHint } from '../engine/StoryComboSystem';
