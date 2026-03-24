'use client';

// ===========================================
// SPRITE TOOL - HAUPTSEITE
// ===========================================

import { useState, useEffect, useCallback } from 'react';
import { PromptAssistant } from '@/components/PromptAssistant';
import { ImageGenerator } from '@/components/ImageGenerator';
import { ImageEditor } from '@/components/ImageEditor';
import { SetupWizard } from '@/components/SetupWizard';
import type { AssetType, GeneratedImage, ProjectMode } from '@/types';

type AppMode = 'setup' | 'app';

export default function Home() {
  const [appMode, setAppMode] = useState<AppMode>('setup');
  const [keysConfigured, setKeysConfigured] = useState(false);
  const [mode, setMode] = useState<ProjectMode>('select');
  const [assetType, setAssetType] = useState<AssetType>('sprite');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [generateToken, setGenerateToken] = useState(0);

  // Key-Status im Hintergrund prüfen
  const checkKeyStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/setup');
      if (res.ok) {
        const data = await res.json();
        setKeysConfigured(data.openai.configured && data.google.configured);
      }
    } catch {
      // Ignorieren — nicht auf localhost
    }
  }, []);

  useEffect(() => {
    checkKeyStatus();
  }, [checkKeyStatus]);

  function handleSetupComplete() {
    setAppMode('app');
    checkKeyStatus();
  }

  function handleAssetTypeSelect(type: AssetType) {
    setAssetType(type);
    setMode('create');
  }

  function handlePromptReady(prompt: string) {
    setCurrentPrompt(prompt);
    setGenerateToken((prev) => prev + 1);
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
      case 'create':
        setMode('select');
        break;
      case 'edit':
        setMode('create');
        break;
      default:
        setMode('select');
    }
  }

  function handleReset() {
    setMode('select');
    setSelectedImage(null);
    setCurrentPrompt('');
    setGenerateToken(0);
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

          <div className="flex items-center gap-4">
            {/* Key Status Indicator */}
            <button
              onClick={() => setAppMode('setup')}
              className="flex items-center gap-1.5 text-xs hover:opacity-80 transition-opacity"
              title={keysConfigured ? 'API Keys konfiguriert' : 'API Keys einrichten'}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  keysConfigured ? 'bg-green-500' : 'bg-red-500 animate-pulse'
                }`}
              />
              <span className="text-gray-500">
                {keysConfigured ? 'Keys OK' : 'Keys fehlen'}
              </span>
            </button>

            {/* Breadcrumb Navigation */}
            {appMode === 'app' && mode !== 'select' && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <button
                  onClick={() => setMode('select')}
                  className="hover:text-gray-300"
                >
                  Typ
                </button>
                <span>/</span>
                <button
                  onClick={() => mode !== 'create' && setMode('create')}
                  className={mode === 'create' ? 'text-blue-400' : 'hover:text-gray-300'}
                >
                  Erstellen
                </button>
                {mode === 'edit' && (
                  <>
                    <span>/</span>
                    <span className="text-blue-400">Bearbeiten</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Setup Wizard */}
        {appMode === 'setup' && (
          <SetupWizard onComplete={handleSetupComplete} />
        )}

        {/* App Content */}
        {appMode === 'app' && (
          <>
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

                {/* Warning if keys not configured */}
                {!keysConfigured && (
                  <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
                    <h4 className="font-medium text-red-400 mb-2">API Keys nicht konfiguriert</h4>
                    <p className="text-sm text-gray-400 mb-3">
                      Ohne API Keys kann keine Bildgenerierung oder Prompt-Verbesserung durchgeführt werden.
                    </p>
                    <button
                      onClick={() => setAppMode('setup')}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-lg transition-colors"
                    >
                      Jetzt einrichten →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Create Flow */}
            {mode === 'create' && (
              <div className="space-y-6">
                <div className="max-w-2xl mx-auto">
                  <PromptAssistant
                    assetType={assetType}
                    onPromptReady={handlePromptReady}
                  />
                </div>
                <div className="max-w-2xl mx-auto">
                  <ImageGenerator
                    prompt={currentPrompt}
                    onImageSelect={handleImageSelect}
                    onBack={handleBack}
                    autoGenerateToken={generateToken}
                    assetType={assetType}
                  />
                </div>
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
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
          Sprite Studio für das Disinfo-Spiel | Powered by OpenAI + Google AI
        </div>
      </footer>
    </div>
  );
}
