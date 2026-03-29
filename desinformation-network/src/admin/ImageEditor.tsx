import { useState, useRef, useCallback, useEffect } from 'react';
import { inpaintImage } from './api';

type ImageEditorProps = {
  imageBase64: string;
  onSave: (editedBase64: string) => void;
  onBack: () => void;
};

export function ImageEditor({ imageBase64, onSave, onBack }: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(20);
  const [editPrompt, setEditPrompt] = useState('');
  const [isInpainting, setIsInpainting] = useState(false);
  const [error, setError] = useState('');
  const [hasMask, setHasMask] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 512, height: 512 });

  // Load image onto canvas
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      // Scale to fit max 512px while keeping aspect ratio
      const maxSize = 512;
      let w = img.width;
      let h = img.height;
      if (w > maxSize || h > maxSize) {
        const scale = maxSize / Math.max(w, h);
        w = Math.round(w * scale);
        h = Math.round(h * scale);
      }
      setCanvasDimensions({ width: w, height: h });

      const canvas = canvasRef.current;
      const maskCanvas = maskCanvasRef.current;
      if (!canvas || !maskCanvas) return;

      canvas.width = w;
      canvas.height = h;
      maskCanvas.width = w;
      maskCanvas.height = h;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, w, h);
        // Save initial state to history
        setHistory([canvas.toDataURL()]);
        setHistoryIndex(0);
      }

      // Clear mask
      const maskCtx = maskCanvas.getContext('2d');
      if (maskCtx) {
        maskCtx.clearRect(0, 0, w, h);
      }
    };
    img.src = `data:image/png;base64,${imageBase64}`;
  }, [imageBase64]);

  const getPos = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = maskCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  const drawDot = useCallback((x: number, y: number) => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    const ctx = maskCanvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
    setHasMask(true);
  }, [brushSize]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const pos = getPos(e);
    drawDot(pos.x, pos.y);
  }, [getPos, drawDot]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const pos = getPos(e);
    drawDot(pos.x, pos.y);
  }, [isDrawing, getPos, drawDot]);

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const clearMask = () => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    const ctx = maskCanvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
      setHasMask(false);
    }
  };

  const getMaskBase64 = (): string | undefined => {
    if (!hasMask) return undefined;
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return undefined;

    // Convert red overlay to white-on-black mask
    const ctx = maskCanvas.getContext('2d');
    if (!ctx) return undefined;

    const imageData = ctx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
    const data = imageData.data;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = maskCanvas.width;
    tempCanvas.height = maskCanvas.height;
    const tempCtx = tempCanvas.getContext('2d')!;
    const tempData = tempCtx.createImageData(maskCanvas.width, maskCanvas.height);

    for (let i = 0; i < data.length; i += 4) {
      const hasColor = data[i + 3] > 0; // Any alpha = masked
      tempData.data[i] = hasColor ? 255 : 0;
      tempData.data[i + 1] = hasColor ? 255 : 0;
      tempData.data[i + 2] = hasColor ? 255 : 0;
      tempData.data[i + 3] = 255;
    }

    tempCtx.putImageData(tempData, 0, 0);
    return tempCanvas.toDataURL('image/png').split(',')[1];
  };

  const getCanvasBase64 = (): string => {
    const canvas = canvasRef.current;
    if (!canvas) return imageBase64;
    return canvas.toDataURL('image/png').split(',')[1];
  };

  const handleInpaint = async () => {
    if (!editPrompt.trim()) return;
    setIsInpainting(true);
    setError('');

    try {
      const result = await inpaintImage({
        image: getCanvasBase64(),
        mask: getMaskBase64(),
        prompt: editPrompt,
      });

      // Draw result onto canvas
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          // Add to history
          const newHistory = history.slice(0, historyIndex + 1);
          newHistory.push(canvas.toDataURL());
          setHistory(newHistory);
          setHistoryIndex(newHistory.length - 1);
        }
        clearMask();
      };
      img.src = `data:image/png;base64,${result.image}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Inpainting');
    }
    setIsInpainting(false);
  };

  const handleUndo = () => {
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.drawImage(img, 0, 0);
    };
    img.src = history[newIndex];
  };

  const handleRedo = () => {
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.drawImage(img, 0, 0);
    };
    img.src = history[newIndex];
  };

  const handleSave = () => {
    onSave(getCanvasBase64());
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded transition-colors"
          >
            Zurück
          </button>
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-gray-300 text-sm rounded transition-colors"
          >
            Undo
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-gray-300 text-sm rounded transition-colors"
          >
            Redo
          </button>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs text-gray-500">Pinsel:</label>
          <input
            type="range"
            min={5}
            max={50}
            value={brushSize}
            onChange={e => setBrushSize(Number(e.target.value))}
            className="w-24"
          />
          <span className="text-xs text-gray-400 w-6">{brushSize}</span>
          <button
            onClick={clearMask}
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded transition-colors"
          >
            Maske löschen
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative inline-block bg-gray-900 rounded-lg overflow-hidden border border-gray-700" style={{ width: canvasDimensions.width, maxWidth: '100%' }}>
        <canvas
          ref={canvasRef}
          style={{ display: 'block', width: '100%', height: 'auto' }}
        />
        <canvas
          ref={maskCanvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="absolute inset-0 cursor-crosshair"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <p className="text-xs text-gray-500">
        Male auf dem Bild um einen Bereich zu maskieren (rot). Nur der maskierte Bereich wird verändert.
      </p>

      {/* Edit Prompt */}
      <div className="flex gap-2">
        <input
          type="text"
          value={editPrompt}
          onChange={e => setEditPrompt(e.target.value)}
          placeholder="Was soll im markierten Bereich geändert werden?"
          className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
          onKeyDown={e => { if (e.key === 'Enter') handleInpaint(); }}
        />
        <button
          onClick={handleInpaint}
          disabled={!editPrompt.trim() || isInpainting}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
        >
          {isInpainting ? 'Bearbeite...' : 'Bearbeiten'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Save */}
      <div className="flex gap-2 justify-end">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Speichern & Download
        </button>
      </div>
    </div>
  );
}
