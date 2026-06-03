'use client';

// ===========================================
// FREI ERZEUGEN — der klassische Direkt-Flow (ohne Regie)
// ===========================================
// Asset-Typ → Prompt (optional Claude) → Varianten → Editor. Bleibt als
// schneller Power-User-Weg neben dem geführten Regie-Modus erhalten.

import { useState } from 'react';
import { PromptAssistant } from '@/components/PromptAssistant';
import { ImageGenerator } from '@/components/ImageGenerator';
import { ImageEditor } from '@/components/ImageEditor';
import type { AssetType, GeneratedImage } from '@/types';

type Mode = 'select' | 'create' | 'edit';

export function FreeCreate() {
  const [mode, setMode] = useState<Mode>('select');
  const [assetType, setAssetType] = useState<AssetType>('sprite');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [generateToken, setGenerateToken] = useState(0);

  function handleAssetTypeSelect(type: AssetType) {
    setAssetType(type);
    setMode('create');
  }
  function handlePromptReady(prompt: string) {
    setCurrentPrompt(prompt);
    setGenerateToken((p) => p + 1);
  }
  function handleImageSelect(image: GeneratedImage) {
    setSelectedImage(image);
    setMode('edit');
  }
  function handleSave(image: GeneratedImage) {
    const link = document.createElement('a');
    link.download = `${assetType}-${Date.now()}.png`;
    link.href = `data:image/png;base64,${image.base64}`;
    link.click();
    setMode('select');
    setSelectedImage(null);
    setCurrentPrompt('');
  }
  function handleBack() {
    setMode(mode === 'edit' ? 'create' : 'select');
  }

  if (mode === 'select') {
    return (
      <div className="space-y-8">
        <div className="space-y-1 text-center">
          <h2 className="text-2xl font-bold">Frei erzeugen</h2>
          <p className="text-gray-400">Schneller Direkt-Weg ohne Regie. Für geführtes Arbeiten → Tab „Regie".</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {(
            [
              { t: 'sprite' as const, icon: '🚶', title: 'Sprite Sheet', desc: 'Animierte Charaktere (Frames im Tab „Sprite-Sheet" zerlegen)' },
              { t: 'scene' as const, icon: '🏢', title: 'Szene / Hintergrund', desc: 'Räume, Gebäude-Ansichten' },
              { t: 'element' as const, icon: '🖼️', title: 'Element / Prop', desc: 'Möbel, Geräte, Deko' },
            ]
          ).map((o) => (
            <button
              key={o.t}
              onClick={() => handleAssetTypeSelect(o.t)}
              className="group rounded-xl border border-gray-800 bg-gray-900 p-6 text-left transition-all hover:border-blue-500 hover:bg-gray-800"
            >
              <div className="mb-3 text-4xl">{o.icon}</div>
              <h3 className="mb-1 font-bold group-hover:text-blue-400">{o.title}</h3>
              <p className="text-sm text-gray-400">{o.desc}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (mode === 'create') {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <PromptAssistant assetType={assetType} onPromptReady={handlePromptReady} />
        <ImageGenerator
          prompt={currentPrompt}
          onImageSelect={handleImageSelect}
          onBack={handleBack}
          autoGenerateToken={generateToken}
          assetType={assetType}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {selectedImage && <ImageEditor image={selectedImage} onSave={handleSave} onBack={handleBack} />}
    </div>
  );
}
