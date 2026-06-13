import { StoryModeGame } from '@/story-mode/StoryModeGame';

/**
 * App entry — Story-Mode-only.
 *
 * Das Spiel startet direkt im Title-Screen (TitleScreen in StoryModeGame);
 * es gibt keinen Entwickler-Vorschaltbildschirm mehr. Die früheren
 * Entwurfs-Flächen (#studio/#dash, Blueprint-Skizzen) liegen dokumentiert
 * unter `archive/story-mode-drafts/` — siehe dortiges README für den
 * Rückwärtsgang. Pro-Mode: `archive/pro-mode/` (VISION_LOCK.md §6).
 */
function App() {
  return <StoryModeGame onExit={() => window.location.reload()} />;
}

export default App;
