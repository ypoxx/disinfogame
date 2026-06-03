import { useEffect, useState } from 'react';
import { StoryModeGame } from '@/story-mode/StoryModeGame';
import { BlueprintStudio } from '@/studio/BlueprintStudio';
import { StudioScene } from '@/studio/StudioScene';

/**
 * App entry — Story-Mode-only (2026-05-31).
 *
 * Das Projekt ist auf Story Mode fokussiert ("frischer Neustart"). Der frühere
 * Pro-Mode (Netzwerk-/Vertrauens-Spiel) ist eingefroren und nach `archive/pro-mode/`
 * ausgelagert; siehe `docs/VISION_LOCK.md` §6 und `archive/pro-mode/SPEC.md`.
 */
function App() {
  const [started, setStarted] = useState(false);
  const [hash, setHash] = useState(() => (typeof window !== 'undefined' ? window.location.hash : ''));
  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Neuanfang-Skizzen (eigenständige Flächen, eigenes Design-System):
  //   #studio = gezeichneter Gebäude-Schnitt (Szene) · #dash = Blueprint-Dashboard-Variante
  if (hash.startsWith('#dash')) {
    return <BlueprintStudio />;
  }
  if (hash.startsWith('#studio') || hash.startsWith('#blueprint')) {
    return <StudioScene />;
  }

  if (started) {
    return <StoryModeGame onExit={() => setStarted(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white gap-6 p-8">
      <h1 className="text-4xl font-bold">Desinformation Network</h1>
      <p className="text-gray-400 max-w-md text-center leading-relaxed">
        Story Mode: Führe einen Mitarbeiter einer Desinformations-Agentur durch
        moralische Entscheidungen, NPC-Beziehungen und bleibende Konsequenzen —
        eine brutalistische Büro-Simulation im Stil von Papers Please.
      </p>
      <button
        onClick={() => setStarted(true)}
        className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white text-xl font-semibold rounded-xl transition-colors shadow-lg"
      >
        📖 Story Mode starten
      </button>
    </div>
  );
}

export default App;
