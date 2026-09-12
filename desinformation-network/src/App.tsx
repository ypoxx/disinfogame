import { StoryModeGame } from '@/story-mode/StoryModeGame';
import { Fehlergrenze } from '@/story-mode/components/Fehlergrenze';

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
  // Letzte Instanz: Ohne diese Grenze nimmt ein einzelner Renderfehler den
  // kompletten Baum mit und hinterlässt eine weiße Seite.
  return (
    <Fehlergrenze variante="ganz" bereich="Spiel">
      <StoryModeGame onExit={() => window.location.reload()} />
    </Fehlergrenze>
  );
}

export default App;
