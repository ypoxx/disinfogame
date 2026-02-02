'use client';

// ===========================================
// IMAGE GENERATOR COMPONENT
// Zeigt generierte Bilder und ermöglicht Auswahl
// ===========================================

import { useState } from 'react';
import type { GeneratedImage } from '@/types';

interface ImageGeneratorProps {
  prompt: string;
  onImageSelect: (image: GeneratedImage) => void;
  onBack: () => void;
}

export function ImageGenerator({ prompt, onImageSelect, onBack }: ImageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  async function handleGenerate() {
    setIsGenerating(true);
    setError(null);
    setImages([]);
    setSelectedIndex(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          numImages: 4,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fehler bei der Bildgenerierung');
      }

      const data = await response.json();

      const generatedImages: GeneratedImage[] = data.images.map(
        (img: { base64: string; seed?: number }, index: number) => ({
          id: `img-${Date.now()}-${index}`,
          base64: img.base64,
          seed: img.seed,
          timestamp: new Date(),
        })
      );

      setImages(generatedImages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    } finally {
      setIsGenerating(false);
    }
  }

  function handleSelect(index: number) {
    setSelectedIndex(index);
  }

  function handleConfirm() {
    if (selectedIndex !== null && images[selectedIndex]) {
      onImageSelect(images[selectedIndex]);
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-medium text-white">Bildgenerierung</h2>
      </div>

      {/* Prompt Display */}
      <div className="p-3 bg-gray-800 rounded-lg">
        <div className="text-xs text-gray-500 mb-1">Prompt</div>
        <div className="text-sm text-gray-300 font-mono line-clamp-3">{prompt}</div>
      </div>

      {/* Generate Button */}
      {images.length === 0 && !isGenerating && (
        <button
          onClick={handleGenerate}
          className="w-full py-4 px-4 bg-green-600 hover:bg-green-700
                     text-white font-bold rounded-lg transition-colors text-lg"
        >
          4 Varianten generieren
        </button>
      )}

      {/* Loading State */}
      {isGenerating && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-gray-700 rounded-full" />
            <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
          </div>
          <p className="text-gray-400">Generiere Bilder mit Nano Banana Pro...</p>
          <p className="text-xs text-gray-500">Das kann bis zu 30 Sekunden dauern</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg">
          <div className="text-red-300 mb-2">{error}</div>
          <button
            onClick={handleGenerate}
            className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded transition-colors"
          >
            Erneut versuchen
          </button>
        </div>
      )}

      {/* Generated Images Grid */}
      {images.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-4">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => handleSelect(index)}
                className={`relative aspect-square rounded-lg overflow-hidden border-4 transition-all ${
                  selectedIndex === index
                    ? 'border-blue-500 ring-2 ring-blue-500/50'
                    : 'border-transparent hover:border-gray-600'
                }`}
              >
                <img
                  src={`data:image/png;base64,${image.base64}`}
                  alt={`Variante ${index + 1}`}
                  className="w-full h-full object-contain bg-gray-900"
                />
                <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 rounded text-xs text-white">
                  #{index + 1}
                </div>
                {selectedIndex === index && (
                  <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                    <svg className="w-12 h-12 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800
                         text-white rounded-lg transition-colors"
            >
              Neue Varianten
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedIndex === null}
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700
                         disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              Auswahl bestätigen
            </button>
          </div>
        </>
      )}
    </div>
  );
}
