import { useState, useCallback } from 'react';
import { PromptBuilder } from './PromptBuilder';
import { ImageGallery } from './ImageGallery';
import { ImageEditor } from './ImageEditor';
import { generateImages } from './api';
import type { GeneratedImage, SpriteStudioPhase, AssetType } from './types';
import type { AspectRatio } from './constants';

export function SpriteStudio() {
  const [phase, setPhase] = useState<SpriteStudioPhase>('prompt');
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [editingImage, setEditingImage] = useState<GeneratedImage | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateProgress, setGenerateProgress] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = useCallback(async (
    prompt: string,
    _assetType: AssetType,
    _aspectRatio: AspectRatio,
    numImages: number,
  ) => {
    setIsGenerating(true);
    setError('');
    setGenerateProgress(`Generiere ${numImages} Bild${numImages > 1 ? 'er' : ''}... Das kann 10-30 Sekunden dauern.`);

    try {
      const result = await generateImages({
        prompt,
        numImages,
      });

      const newImages: GeneratedImage[] = result.images.map((img, i) => ({
        id: `img_${Date.now()}_${i}`,
        base64: img.base64,
        seed: img.seed,
        timestamp: Date.now(),
      }));

      setImages(prev => [...newImages, ...prev]);
      setPhase('gallery');

      if (result.errors?.length) {
        setError(`${result.images.length} von ${numImages} erfolgreich. Fehler: ${result.errors.join('; ')}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler bei Bildgenerierung');
    }
    setIsGenerating(false);
    setGenerateProgress('');
  }, []);

  const handleDownload = useCallback((image: GeneratedImage) => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${image.base64}`;
    link.download = `sprite_${image.id}.png`;
    link.click();
  }, []);

  const handleEdit = useCallback((image: GeneratedImage) => {
    setEditingImage(image);
    setPhase('editing');
  }, []);

  const handleEditorSave = useCallback((editedBase64: string) => {
    // Create new image entry with edited version
    const newImage: GeneratedImage = {
      id: `edited_${Date.now()}`,
      base64: editedBase64,
      timestamp: Date.now(),
    };
    setImages(prev => [newImage, ...prev]);

    // Download
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${editedBase64}`;
    link.download = `sprite_edited_${Date.now()}.png`;
    link.click();

    setEditingImage(null);
    setPhase('gallery');
  }, []);

  const handleEditorBack = useCallback(() => {
    setEditingImage(null);
    setPhase('gallery');
  }, []);

  // Editing phase
  if (phase === 'editing' && editingImage) {
    return (
      <ImageEditor
        imageBase64={editingImage.base64}
        onSave={handleEditorSave}
        onBack={handleEditorBack}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-gray-700">
        <button
          onClick={() => setPhase('prompt')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            phase === 'prompt'
              ? 'text-blue-400 border-blue-400'
              : 'text-gray-500 border-transparent hover:text-gray-300'
          }`}
        >
          Erstellen
        </button>
        <button
          onClick={() => setPhase('gallery')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            phase === 'gallery'
              ? 'text-blue-400 border-blue-400'
              : 'text-gray-500 border-transparent hover:text-gray-300'
          }`}
        >
          Galerie ({images.length})
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-red-400 text-sm">
          {error}
          <button onClick={() => setError('')} className="ml-2 text-red-500 hover:text-red-300">x</button>
        </div>
      )}

      {/* Content */}
      {phase === 'prompt' && (
        <PromptBuilder
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />
      )}

      {phase === 'gallery' && (
        <ImageGallery
          images={images}
          selectedId={selectedImageId}
          onSelect={img => setSelectedImageId(img.id)}
          onDownload={handleDownload}
          onEdit={handleEdit}
          isGenerating={isGenerating}
          progress={generateProgress}
        />
      )}
    </div>
  );
}
