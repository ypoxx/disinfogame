'use client';

// ===========================================
// SPRITE TOOL - HAUPTSEITE
// ===========================================

import { useState } from 'react';
import { PromptAssistant } from '@/components/PromptAssistant';
import { ImageGenerator } from '@/components/ImageGenerator';
import { ImageEditor } from '@/components/ImageEditor';
import type { AssetType, GeneratedImage, ProjectMode } from '@/types';

export default function Home() {
  const [mode, setMode] = useState<ProjectMode>('select');
  const [assetType, setAssetType] = useState<AssetType>('sprite');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  function handleAssetTypeSelect(type: AssetType) {
    setAssetType(type);
    setMode('prompt');
  }

  function handlePromptReady(prompt: string) {
    setCurrentPrompt(prompt);
    setMode('generate');
  }

  function handleImageSelect(image: GeneratedImage) {
    setSelectedImage(image);
    setMode('edit');
  }

  function handleSave(image: GeneratedImage) {
    // Bild speichern (Download)
    const link = document.createElement('a');
    link.download = `${assetType}-${Date.now()}.png`;
    link.href = `data:image/png;base64,${image.base64}`;
    link.click();

    // Zurück zur Auswahl
    setMode('select');
    setSelectedImage(null);
    setCurrentPrompt('');
  }

  function handleBack() {
    switch (mode) {
      case 'prompt':
        setMode('select');
        break;
      case 'generate':
        setMode('prompt');
        break;
      case 'edit':
        setMode('generate');
        break;
      default:
        setMode('select');
    }
  }

  function handleReset() {
    setMode('select');
    setSelectedImage(null);
    setCurrentPrompt('');
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 hover:text-gray-300 transition-colors"
          >
            <span className="text-2xl">🎨</span>
            <span className="font-bold text-lg">Sprite Studio</span>
          </button>

          {mode !== 'select' && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <button
                onClick={() => setMode('select')}
                className="hover:text-gray-300"
              >
                Typ
              </button>
              <span>/</span>
              <button
                onClick={() => mode !== 'prompt' && setMode('prompt')}
                className={mode === 'prompt' ? 'text-blue-400' : 'hover:text-gray-300'}
              >
                Prompt
              </button>
              {(mode === 'generate' || mode === 'edit') && (
                <>
                  <span>/</span>
                  <button
                    onClick={() => mode !== 'generate' && setMode('generate')}
                    className={mode === 'generate' ? 'text-blue-400' : 'hover:text-gray-300'}
                  >
                    Generieren
                  </button>
                </>
              )}
              {mode === 'edit' && (
                <>
                  <span>/</span>
                  <span className="text-blue-400">Bearbeiten</span>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Asset Type Selection */}
        {mode === 'select' && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Was möchtest du erstellen?</h1>
              <p className="text-gray-400">
                Wähle den Asset-Typ für dein Disinfo-Spiel
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Sprite Sheet */}
              <button
                onClick={() => handleAssetTypeSelect('sprite')}
                className="group p-6 bg-gray-900 hover:bg-gray-800 border border-gray-800
                           hover:border-blue-500 rounded-xl transition-all text-left"
              >
                <div className="text-4xl mb-4">🚶</div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition-colors">
                  Sprite Sheet
                </h3>
                <p className="text-sm text-gray-400">
                  Animierte Charaktere mit mehreren Frames (Walk, Idle, etc.)
                </p>
              </button>

              {/* Scene */}
              <button
                onClick={() => handleAssetTypeSelect('scene')}
                className="group p-6 bg-gray-900 hover:bg-gray-800 border border-gray-800
                           hover:border-green-500 rounded-xl transition-all text-left"
              >
                <div className="text-4xl mb-4">🏢</div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-green-400 transition-colors">
                  Szene / Hintergrund
                </h3>
                <p className="text-sm text-gray-400">
                  Büro-Räume, Gebäude-Ansichten, Hintergründe
                </p>
              </button>

              {/* Element */}
              <button
                onClick={() => handleAssetTypeSelect('element')}
                className="group p-6 bg-gray-900 hover:bg-gray-800 border border-gray-800
                           hover:border-orange-500 rounded-xl transition-all text-left"
              >
                <div className="text-4xl mb-4">🖼️</div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-orange-400 transition-colors">
                  Element / Prop
                </h3>
                <p className="text-sm text-gray-400">
                  Möbel, Geräte, Dekorationen, UI-Elemente
                </p>
              </button>
            </div>

            {/* Info Box */}
            <div className="p-4 bg-gray-900 border border-gray-800 rounded-lg">
              <h4 className="font-medium text-yellow-400 mb-2">🔑 API Keys erforderlich</h4>
              <p className="text-sm text-gray-400 mb-2">
                Dieses Tool benötigt API Keys für Claude (Anthropic) und Nano Banana Pro (Google AI).
              </p>
              <p className="text-sm text-gray-500">
                Kopiere <code className="px-1 bg-gray-800 rounded">.env.example</code> zu{' '}
                <code className="px-1 bg-gray-800 rounded">.env.local</code> und trage deine Keys ein.
              </p>
            </div>
          </div>
        )}

        {/* Prompt Assistant */}
        {mode === 'prompt' && (
          <div className="max-w-2xl mx-auto">
            <PromptAssistant
              assetType={assetType}
              onPromptReady={handlePromptReady}
            />
          </div>
        )}

        {/* Image Generator */}
        {mode === 'generate' && (
          <div className="max-w-2xl mx-auto">
            <ImageGenerator
              prompt={currentPrompt}
              onImageSelect={handleImageSelect}
              onBack={handleBack}
            />
          </div>
        )}

        {/* Image Editor */}
        {mode === 'edit' && selectedImage && (
          <div className="max-w-3xl mx-auto">
            <ImageEditor
              image={selectedImage}
              onSave={handleSave}
              onBack={handleBack}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
          Sprite Studio für das Disinfo-Spiel | Powered by Claude + Nano Banana Pro
        </div>
      </footer>
    </div>
  );
}
