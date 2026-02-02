'use client';

// ===========================================
// IMAGE EDITOR COMPONENT
// Masken-basiertes Inpainting
// ===========================================

import { useState, useRef, useEffect } from 'react';
import type { GeneratedImage } from '@/types';

interface ImageEditorProps {
  image: GeneratedImage;
  onSave: (editedImage: GeneratedImage) => void;
  onBack: () => void;
}

export function ImageEditor({ image, onSave, onBack }: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(20);
  const [brushMode, setBrushMode] = useState<'paint' | 'erase'>('paint');
  const [inpaintPrompt, setInpaintPrompt] = useState('');
  const [isInpainting, setIsInpainting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState(image);
  const [history, setHistory] = useState<GeneratedImage[]>([image]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showMask, setShowMask] = useState(true);
  const [zoom, setZoom] = useState(1);

  // Canvas initialisieren
  useEffect(() => {
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!canvas || !maskCanvas) return;

    const ctx = canvas.getContext('2d');
    const maskCtx = maskCanvas.getContext('2d');
    if (!ctx || !maskCtx) return;

    // Bild laden
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      maskCanvas.width = img.width;
      maskCanvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      // Maske zurücksetzen
      maskCtx.fillStyle = 'black';
      maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
    };
    img.src = `data:image/png;base64,${currentImage.base64}`;
  }, [currentImage]);

  // Zeichnen-Funktionen
  function startDrawing(e: React.MouseEvent<HTMLCanvasElement>) {
    setIsDrawing(true);
    draw(e);
  }

  function stopDrawing() {
    setIsDrawing(false);
  }

  function draw(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDrawing) return;

    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;

    const rect = maskCanvas.getBoundingClientRect();
    const scaleX = maskCanvas.width / rect.width;
    const scaleY = maskCanvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) return;

    maskCtx.fillStyle = brushMode === 'paint' ? 'white' : 'black';
    maskCtx.beginPath();
    maskCtx.arc(x, y, brushSize, 0, Math.PI * 2);
    maskCtx.fill();
  }

  function clearMask() {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;

    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) return;

    maskCtx.fillStyle = 'black';
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
  }

  async function handleInpaint() {
    if (!inpaintPrompt.trim()) {
      setError('Bitte beschreibe, was geändert werden soll');
      return;
    }

    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;

    setIsInpainting(true);
    setError(null);

    try {
      // Maske als base64
      const maskBase64 = maskCanvas.toDataURL('image/png').split(',')[1];

      const response = await fetch('/api/inpaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: currentImage.base64,
          mask: maskBase64,
          prompt: inpaintPrompt,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Inpainting fehlgeschlagen');
      }

      const data = await response.json();

      const newImage: GeneratedImage = {
        id: `img-${Date.now()}`,
        base64: data.image,
        timestamp: new Date(),
      };

      // History aktualisieren
      const newHistory = [...history.slice(0, historyIndex + 1), newImage];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setCurrentImage(newImage);
      setInpaintPrompt('');
      clearMask();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    } finally {
      setIsInpainting(false);
    }
  }

  function handleUndo() {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentImage(history[historyIndex - 1]);
    }
  }

  function handleRedo() {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentImage(history[historyIndex + 1]);
    }
  }

  function handleDownload() {
    const link = document.createElement('a');
    link.download = `sprite-${Date.now()}.png`;
    link.href = `data:image/png;base64,${currentImage.base64}`;
    link.click();
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-lg font-medium text-white">Bearbeitung</h2>
        </div>

        {/* Undo/Redo */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={historyIndex === 0}
            className="p-2 text-gray-400 hover:text-white disabled:text-gray-600 transition-colors"
            title="Rückgängig"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex === history.length - 1}
            className="p-2 text-gray-400 hover:text-white disabled:text-gray-600 transition-colors"
            title="Wiederholen"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <div className="relative overflow-auto max-h-[520px]">
          <div
            className="relative origin-top-left"
            style={{ transform: `scale(${zoom})`, width: 'fit-content' }}
          >
            {/* Main Image Canvas */}
            <canvas
              ref={canvasRef}
              className="max-w-full h-auto"
            />

            {/* Mask Canvas (overlay) */}
            <canvas
              ref={maskCanvasRef}
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onMouseMove={draw}
              className={`absolute inset-0 w-full h-full cursor-crosshair ${
                showMask ? 'opacity-40' : 'opacity-0'
              }`}
              style={{ mixBlendMode: 'screen' }}
            />
          </div>
        </div>
      </div>

      {/* Brush Controls */}
      <div className="flex flex-wrap items-center gap-4 p-3 bg-gray-800 rounded-lg">
        <label className="flex items-center gap-2 text-sm text-gray-400">
          <span>Pinsel:</span>
          <input
            type="range"
            min="5"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-24"
          />
          <span className="w-8 text-center">{brushSize}px</span>
        </label>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <button
            onClick={() => setBrushMode('paint')}
            className={`px-3 py-1 rounded transition-colors ${
              brushMode === 'paint'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            Malen
          </button>
          <button
            onClick={() => setBrushMode('erase')}
            className={`px-3 py-1 rounded transition-colors ${
              brushMode === 'erase'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            Radierer
          </button>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-400">
          <span>Zoom:</span>
          <input
            type="range"
            min="1"
            max="4"
            step="0.5"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-24"
          />
          <span className="w-10 text-center">{zoom}x</span>
        </label>
        <button
          onClick={() => setShowMask((prev) => !prev)}
          className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
        >
          {showMask ? 'Maske ausblenden' : 'Maske anzeigen'}
        </button>
        <button
          onClick={clearMask}
          className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
        >
          Maske löschen
        </button>
      </div>

      {/* Inpaint Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Was soll im markierten Bereich geändert werden?
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={inpaintPrompt}
            onChange={(e) => setInpaintPrompt(e.target.value)}
            placeholder="z.B. 'Arm natürlicher, mehr geschwungen'"
            className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg
                       text-white placeholder-gray-500 focus:border-blue-500 outline-none"
          />
          <button
            onClick={handleInpaint}
            disabled={isInpainting || !inpaintPrompt.trim()}
            className="px-6 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700
                       disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {isInpainting ? 'Bearbeite...' : 'Anwenden'}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-700">
        <button
          onClick={handleDownload}
          className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600
                     text-white rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download PNG
        </button>
        <button
          onClick={() => onSave(currentImage)}
          className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700
                     text-white font-medium rounded-lg transition-colors"
        >
          Fertig
        </button>
      </div>
    </div>
  );
}
