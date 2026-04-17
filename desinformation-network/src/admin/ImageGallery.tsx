import type { GeneratedImage } from './types';

type ImageGalleryProps = {
  images: GeneratedImage[];
  selectedId: string | null;
  onSelect: (image: GeneratedImage) => void;
  onDownload: (image: GeneratedImage) => void;
  onEdit: (image: GeneratedImage) => void;
  isGenerating: boolean;
  progress: string;
};

export function ImageGallery({
  images,
  selectedId,
  onSelect,
  onDownload,
  onEdit,
  isGenerating,
  progress,
}: ImageGalleryProps) {
  if (images.length === 0 && !isGenerating) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="text-4xl mb-3">🎨</div>
        <p className="text-sm">Noch keine Bilder generiert.</p>
        <p className="text-xs mt-1">Wähle einen Preset oder schreibe einen Prompt.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress indicator */}
      {isGenerating && (
        <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-4 text-center">
          <div className="animate-pulse text-blue-400 text-sm font-medium mb-2">
            Generiere Bilder...
          </div>
          <p className="text-xs text-blue-300">{progress}</p>
          <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      )}

      {/* Image Grid */}
      <div className="grid grid-cols-2 gap-4">
        {images.map(img => (
          <div
            key={img.id}
            onClick={() => onSelect(img)}
            className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-colors ${
              selectedId === img.id ? 'border-blue-500' : 'border-gray-700 hover:border-gray-500'
            }`}
          >
            <img
              src={`data:image/png;base64,${img.base64}`}
              alt="Generiertes Bild"
              className="w-full h-auto bg-gray-900"
              loading="lazy"
            />

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={e => { e.stopPropagation(); onDownload(img); }}
                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors"
              >
                Download
              </button>
              <button
                onClick={e => { e.stopPropagation(); onEdit(img); }}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg transition-colors"
              >
                Bearbeiten
              </button>
            </div>

            {/* Timestamp */}
            <div className="absolute bottom-1 right-1 text-xs text-gray-400 bg-black/50 px-1 rounded">
              {new Date(img.timestamp).toLocaleTimeString('de')}
            </div>
          </div>
        ))}
      </div>

      {/* Selected image info */}
      {selectedId && images.find(i => i.id === selectedId) && (
        <div className="bg-gray-900/50 rounded-lg p-3 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            Bild ausgewählt — klicke "Bearbeiten" um Bereiche zu ändern
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const img = images.find(i => i.id === selectedId);
                if (img) onDownload(img);
              }}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
            >
              Download
            </button>
            <button
              onClick={() => {
                const img = images.find(i => i.id === selectedId);
                if (img) onEdit(img);
              }}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition-colors"
            >
              Bearbeiten
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
