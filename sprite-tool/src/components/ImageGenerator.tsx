'use client';

// ===========================================
// IMAGE GENERATOR COMPONENT
// Zeigt generierte Bilder und ermöglicht Auswahl
// ===========================================

import { useEffect, useMemo, useState } from 'react';
import type { AssetType, GeneratedImage } from '@/types';
import { ASPECT_RATIOS } from '@/lib/constants';

interface ImageGeneratorProps {
  prompt: string;
  onImageSelect: (image: GeneratedImage) => void;
  onBack: () => void;
  autoGenerateToken: number;
  assetType: AssetType;
}

export function ImageGenerator({
  prompt,
  onImageSelect,
  onBack,
  autoGenerateToken,
  assetType,
}: ImageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [numImages, setNumImages] = useState(4);
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3' | '3:4'>('1:1');
  const [seed, setSeed] = useState('');
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const assetDefaults = useMemo(() => {
    switch (assetType) {
      case 'scene':
        return { aspectRatio: '16:9' as const, numImages: 2 };
      case 'element':
        return { aspectRatio: '1:1' as const, numImages: 3 };
      default:
        return { aspectRatio: '1:1' as const, numImages: 4 };
    }
  }, [assetType]);

  useEffect(() => {
    setAspectRatio(assetDefaults.aspectRatio);
    setNumImages(assetDefaults.numImages);
  }, [assetDefaults]);

  useEffect(() => {
    if (!prompt.trim()) return;
    if (autoGenerateToken === 0) return;
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoGenerateToken]);

  async function handleReferenceUpload(files: FileList | null) {
    if (!files) return;
    const fileArray = Array.from(files).slice(0, 8);
    const base64Images = await Promise.all(
      fileArray.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result?.toString() || '';
              resolve(result.split(',')[1] || '');
            };
            reader.onerror = () => reject(new Error('Datei konnte nicht gelesen werden'));
            reader.readAsDataURL(file);
          })
      )
    );
    setReferenceImages(base64Images.filter(Boolean));
  }

  async function handleGenerate() {
    if (!prompt.trim()) {
      setError('Bitte gib zuerst einen Prompt ein.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setWarnings([]);
    setImages([]);
    setSelectedIndex(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          numImages,
          aspectRatio,
          seed: seed ? Number(seed) : undefined,
          referenceImages,
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
      if (data.errors?.length) {
        setWarnings(data.errors);
      }
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

      {/* Controls */}
      <div className="space-y-3 p-4 bg-gray-900 border border-gray-800 rounded-lg">
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
          <label className="flex items-center gap-2">
            <span>Varianten</span>
            <input
              type="range"
              min="1"
              max="4"
              value={numImages}
              onChange={(e) => setNumImages(Number(e.target.value))}
              className="w-24"
            />
            <span>{numImages}</span>
          </label>
          <label className="flex items-center gap-2">
            <span>Ratio</span>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as typeof aspectRatio)}
              className="bg-gray-800 border border-gray-700 rounded px-2 py-1"
            >
              {Object.keys(ASPECT_RATIOS).map((ratio) => (
                <option key={ratio} value={ratio}>
                  {ratio}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2">
            <span>Seed</span>
            <input
              type="number"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              placeholder="optional"
              className="w-28 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm"
            />
          </label>
          <button
            type="button"
            onClick={() => setShowAdvanced((prev) => !prev)}
            className="text-blue-400 hover:text-blue-300"
          >
            {showAdvanced ? 'Erweitert ausblenden' : 'Erweitert anzeigen'}
          </button>
        </div>
        {showAdvanced && (
          <div className="space-y-3 text-sm text-gray-300">
            <label className="flex flex-col gap-2">
              <span>Referenzbilder (max. 8)</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => void handleReferenceUpload(e.target.files)}
                className="text-sm text-gray-400"
              />
            </label>
            {referenceImages.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {referenceImages.map((image, index) => (
                  <div key={`ref-${index}`} className="relative">
                    <img
                      src={`data:image/png;base64,${image}`}
                      alt={`Referenz ${index + 1}`}
                      className="w-16 h-16 object-cover rounded border border-gray-700"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setReferenceImages((prev) => prev.filter((_, i) => i !== index))
                      }
                      className="absolute -top-2 -right-2 bg-gray-800 border border-gray-600 rounded-full w-5 h-5 text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Generate Button */}
      {images.length === 0 && !isGenerating && (
        <button
          onClick={handleGenerate}
          className="w-full py-4 px-4 bg-green-600 hover:bg-green-700
                     text-white font-bold rounded-lg transition-colors text-lg"
        >
          Varianten generieren
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

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="p-4 bg-yellow-900/40 border border-yellow-700 rounded-lg text-yellow-200 text-sm">
          <div className="font-medium mb-2">Teilweise fehlgeschlagen:</div>
          <ul className="list-disc list-inside space-y-1">
            {warnings.map((warning, index) => (
              <li key={`warning-${index}`}>{warning}</li>
            ))}
          </ul>
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
