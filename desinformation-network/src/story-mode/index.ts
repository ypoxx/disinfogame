// Story Mode - Main Entry Points
// (StoryModeTest entfernt — App rendert StoryModeGame direkt; Pro-Mode archiviert 2026-05-31)
export { StoryModeGame } from './StoryModeGame';
export { OfficeScreen } from './OfficeScreen';

// Components
export * from './components';

// Hooks
export { useStoryGameState } from './hooks/useStoryGameState';
export type { StoryGameState, DialogState, GamePhase } from './hooks/useStoryGameState';

// Theme
export { StoryModeColors } from './theme';

// Sound System
export {
  playSound,
  setSoundEnabled,
  isSoundEnabled,
  setSoundVolume,
  getSoundVolume,
  getSoundSystem
} from './utils/SoundSystem';
