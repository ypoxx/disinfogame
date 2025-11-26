import { useRef, useEffect, useCallback, useState } from 'react';
import type { Actor, Connection, Position } from '@/game-logic/types';
import { trustToHex, getCategoryColor, getConnectionColor } from '@/utils/colors';
import { euclideanDistance } from '@/utils';

// ============================================
// TYPES
// ============================================

type GameCanvasProps = {
  actors: Actor[];
  connections: Connection[];
  selectedActorId: string | null;
  hoveredActorId: string | null;
  targetingMode: boolean;
  validTargets: string[];
  onActorClick: (actorId: string) => void;
  onActorHover: (actorId: string | null) => void;
  onCanvasClick: (position: Position) => void;
};

type CanvasState = {
  scale: number;
  offsetX: number;
  offsetY: number;
};

// ============================================
// CONSTANTS
// ============================================

const MIN_SCALE = 0.5;
const MAX_SCALE = 2.0;
const ACTOR_HIT_TOLERANCE = 15;

// ============================================
// COMPONENT
// ============================================

export function GameCanvas({
  actors,
  connections,
  selectedActorId,
  hoveredActorId,
  targetingMode,
  validTargets,
  onActorClick,
  onActorHover,
  onCanvasClick,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);
  
  const [canvasState, setCanvasState] = useState<CanvasState>({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
  });
  
  // Touch/pan state
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPosition, setLastPanPosition] = useState<Position | null>(null);

  // ============================================
  // COORDINATE TRANSFORMATION
  // ============================================

  const screenToWorld = useCallback((screenX: number, screenY: number): Position => {
    const { scale, offsetX, offsetY } = canvasState;
    return {
      x: (screenX - offsetX) / scale,
      y: (screenY - offsetY) / scale,
    };
  }, [canvasState]);

  const worldToScreen = useCallback((worldX: number, worldY: number): Position => {
    const { scale, offsetX, offsetY } = canvasState;
    return {
      x: worldX * scale + offsetX,
      y: worldY * scale + offsetY,
    };
  }, [canvasState]);

  // ============================================
  // DRAWING
  // ============================================

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { scale, offsetX, offsetY } = canvasState;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply transformations
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    // Draw connections
    connections.forEach(conn => {
      const source = actors.find(a => a.id === conn.sourceId);
      const target = actors.find(a => a.id === conn.targetId);
      if (!source || !target) return;

      const isHighlighted = 
        source.id === selectedActorId || 
        target.id === selectedActorId ||
        source.id === hoveredActorId ||
        target.id === hoveredActorId;

      ctx.beginPath();
      ctx.moveTo(source.position.x, source.position.y);
      ctx.lineTo(target.position.x, target.position.y);
      ctx.strokeStyle = isHighlighted 
        ? 'rgba(59, 130, 246, 0.5)' 
        : getConnectionColor(conn.strength);
      ctx.lineWidth = isHighlighted ? 3 : 1.5;
      ctx.stroke();
    });

    // Draw actors
    actors.forEach(actor => {
      const { x, y } = actor.position;
      const radius = actor.size / 2;
      
      const isSelected = actor.id === selectedActorId;
      const isHovered = actor.id === hoveredActorId;
      const isValidTarget = validTargets.includes(actor.id);

      // Influence radius (only for selected/hovered)
      if (isSelected || isHovered) {
        ctx.beginPath();
        ctx.arc(x, y, actor.influenceRadius, 0, Math.PI * 2);
        ctx.fillStyle = `${getCategoryColor(actor.category)}15`;
        ctx.fill();
        ctx.strokeStyle = `${getCategoryColor(actor.category)}40`;
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Valid target indicator
      if (targetingMode && isValidTarget) {
        ctx.beginPath();
        ctx.arc(x, y, radius + 8, 0, Math.PI * 2);
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Pulsing ring animation
        const pulse = (Date.now() % 1000) / 1000;
        ctx.beginPath();
        ctx.arc(x, y, radius + 8 + pulse * 15, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(239, 68, 68, ${1 - pulse})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Selection ring
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(x, y, radius + 6, 0, Math.PI * 2);
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Hover ring
      if (isHovered && !isSelected) {
        ctx.beginPath();
        ctx.arc(x, y, radius + 4, 0, Math.PI * 2);
        ctx.strokeStyle = '#9CA3AF';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Actor circle - outer (category color)
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = getCategoryColor(actor.category);
      ctx.fill();

      // Actor circle - inner (trust color)
      const innerRadius = radius * 0.7;
      ctx.beginPath();
      ctx.arc(x, y, innerRadius, 0, Math.PI * 2);
      ctx.fillStyle = trustToHex(actor.trust);
      ctx.fill();

      // Trust percentage arc
      const startAngle = -Math.PI / 2;
      const endAngle = startAngle + (actor.trust * Math.PI * 2);
      ctx.beginPath();
      ctx.arc(x, y, radius + 2, startAngle, endAngle);
      ctx.strokeStyle = trustToHex(actor.trust);
      ctx.lineWidth = 3;
      ctx.stroke();

      // Actor name (only when zoomed in or selected/hovered)
      if (scale > 0.8 || isSelected || isHovered) {
        ctx.font = `${isSelected ? 'bold ' : ''}12px Inter, sans-serif`;
        ctx.fillStyle = '#1F2937';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(actor.name, x, y + radius + 8);
      }
    });

    ctx.restore();

    // Continue animation loop
    animationFrameRef.current = requestAnimationFrame(draw);
  }, [actors, connections, selectedActorId, hoveredActorId, targetingMode, validTargets, canvasState]);

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const findActorAtPosition = useCallback((worldPos: Position): Actor | null => {
    // Check in reverse order (top actors first)
    for (let i = actors.length - 1; i >= 0; i--) {
      const actor = actors[i];
      const distance = euclideanDistance(actor.position, worldPos);
      if (distance <= actor.size / 2 + ACTOR_HIT_TOLERANCE) {
        return actor;
      }
    }
    return null;
  }, [actors]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const worldPos = screenToWorld(screenX, screenY);

    const actor = findActorAtPosition(worldPos);
    if (actor) {
      onActorClick(actor.id);
    } else {
      onCanvasClick(worldPos);
    }
  }, [screenToWorld, findActorAtPosition, onActorClick, onCanvasClick]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;

    if (isPanning && lastPanPosition) {
      // Pan the canvas
      const deltaX = screenX - lastPanPosition.x;
      const deltaY = screenY - lastPanPosition.y;
      setCanvasState(prev => ({
        ...prev,
        offsetX: prev.offsetX + deltaX,
        offsetY: prev.offsetY + deltaY,
      }));
      setLastPanPosition({ x: screenX, y: screenY });
    } else {
      // Check for hover
      const worldPos = screenToWorld(screenX, screenY);
      const actor = findActorAtPosition(worldPos);
      onActorHover(actor?.id || null);
    }
  }, [isPanning, lastPanPosition, screenToWorld, findActorAtPosition, onActorHover]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      // Middle click or Alt+click for panning
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        setIsPanning(true);
        setLastPanPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    setLastPanPosition(null);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, canvasState.scale * zoomFactor));

    // Zoom toward mouse position
    const worldPos = screenToWorld(mouseX, mouseY);
    const newOffsetX = mouseX - worldPos.x * newScale;
    const newOffsetY = mouseY - worldPos.y * newScale;

    setCanvasState({
      scale: newScale,
      offsetX: newOffsetX,
      offsetY: newOffsetY,
    });
  }, [canvasState.scale, screenToWorld]);

  // Touch handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        setLastPanPosition({
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
        });
      }
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1 && lastPanPosition) {
      const touch = e.touches[0];
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const currentX = touch.clientX - rect.left;
        const currentY = touch.clientY - rect.top;
        const deltaX = currentX - lastPanPosition.x;
        const deltaY = currentY - lastPanPosition.y;
        
        setCanvasState(prev => ({
          ...prev,
          offsetX: prev.offsetX + deltaX,
          offsetY: prev.offsetY + deltaY,
        }));
        setLastPanPosition({ x: currentX, y: currentY });
      }
    }
  }, [lastPanPosition]);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 0) {
      // Single tap detection
      const touch = e.changedTouches[0];
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const screenX = touch.clientX - rect.left;
        const screenY = touch.clientY - rect.top;
        const worldPos = screenToWorld(screenX, screenY);
        const actor = findActorAtPosition(worldPos);
        if (actor) {
          onActorClick(actor.id);
        }
      }
      setLastPanPosition(null);
    }
  }, [screenToWorld, findActorAtPosition, onActorClick]);

  // ============================================
  // EFFECTS
  // ============================================

  // Resize canvas to container
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const { width, height } = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Start animation loop
  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [draw]);

  // Center view on initial load
  useEffect(() => {
    if (actors.length > 0 && canvasState.offsetX === 0 && canvasState.offsetY === 0) {
      const container = containerRef.current;
      if (!container) return;

      const { width, height } = container.getBoundingClientRect();
      
      // Calculate bounds of all actors
      const minX = Math.min(...actors.map(a => a.position.x));
      const maxX = Math.max(...actors.map(a => a.position.x));
      const minY = Math.min(...actors.map(a => a.position.y));
      const maxY = Math.max(...actors.map(a => a.position.y));
      
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;

      setCanvasState(prev => ({
        ...prev,
        offsetX: width / 2 - centerX * prev.scale,
        offsetY: height / 2 - centerY * prev.scale,
      }));
    }
  }, [actors, canvasState.offsetX, canvasState.offsetY]);

  // ============================================
  // RENDER
  // ============================================

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full relative game-canvas"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-crosshair"
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
      
      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={() => setCanvasState(prev => ({
            ...prev,
            scale: Math.min(MAX_SCALE, prev.scale * 1.2),
          }))}
          className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50"
        >
          +
        </button>
        <button
          onClick={() => setCanvasState(prev => ({
            ...prev,
            scale: Math.max(MIN_SCALE, prev.scale / 1.2),
          }))}
          className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50"
        >
          −
        </button>
        <button
          onClick={() => setCanvasState({ scale: 1, offsetX: 0, offsetY: 0 })}
          className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 text-xs"
        >
          1:1
        </button>
      </div>

      {/* Scale indicator */}
      <div className="absolute bottom-4 left-4 px-2 py-1 bg-white/80 rounded text-xs text-gray-500">
        {Math.round(canvasState.scale * 100)}%
      </div>
    </div>
  );
}

export default GameCanvas;
