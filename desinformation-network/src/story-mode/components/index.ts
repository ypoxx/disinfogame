// Story Mode UI Components
export { DialogBox } from './DialogBox';
export type { DialogChoice, DialogMessage } from './DialogBox';

export { StoryHUD } from './StoryHUD';
export type {
  StoryResources,
  StoryPhaseInfo,
  ObjectiveInfo,
} from './StoryHUD';

export { ActionPanel } from './ActionPanel';
export type { StoryAction as ActionPanelAction } from './ActionPanel';

export { TutorialOverlay, useTutorial, TUTORIAL_STEPS } from './TutorialOverlay';
export type { TutorialStep } from './TutorialOverlay';

export { GameEndScreen } from './GameEndScreen';
export type { GameEndData, EndingType } from './GameEndScreen';
