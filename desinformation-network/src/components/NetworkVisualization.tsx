import { useRef, useEffect, useCallback, useState } from 'react';
import type { Actor, Connection } from '@/game-logic/types';
import { trustToHex, getCategoryColor } from '@/utils/colors';

// ============================================
// FULLSCREEN RESPONSIVE NETWORK VISUALIZATION
// Modern, scalable design with grouped nodes
// Supports zoom/pan via mouse, touch, and keyboard
// ============================================

type NetworkVisualizationProps = {
  actors: Actor[];
  connections: Connection[];
  selectedActorId: string | null;
  hoveredActorId: string | null;
  targetingMode: boolean;
  validTargets: string[];
  onActorClick: (actorId: string) => void;
  onActorHover: (actorId: string | null) => void;
};

// Zoom/Pan configuration
const MIN_SCALE = 0.5;
const MAX_SCALE = 3.0;
const ZOOM_SPEED = 0.1;
const KEYBOARD_ZOOM_STEP = 0.2;

// Relative positions (0-1 range) for responsive layout
const CATEGORY_POSITIONS_RELATIVE: Record<string, { x: number; y: number }> = {
  media: { x: 0.25, y: 0.3 },
  expert: { x: 0.75, y: 0.3 },
  lobby: { x: 0.25, y: 0.7 },
  organization: { x: 0.75, y: 0.7 },
  defensive: { x: 0.5, y: 0.5 }, // Center
};

const CATEGORY_LABELS: Record<string, string> = {
  media: 'Media Outlets',
  expert: 'Expert Community',
  lobby: 'Lobby Groups',
  organization: 'Organizations',
  defensive: 'Defensive Actors',
};

export function NetworkVisualization({
  actors,
  connections,
  selectedActorId,
  hoveredActorId,
  targetingMode,
  validTargets,
  onActorClick,
  onActorHover,
}: NetworkVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [hoveredActor, setHoveredActor] = useState<Actor | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  // Zoom and Pan state
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const lastPanPosition = useRef({ x: 0, y: 0 });
  const lastTouchDistance = useRef<number | null>(null);
  const lastTouchCenter = useRef<{ x: number; y: number } | null>(null);

  // Constants scaled by canvas size
  const NODE_RADIUS = Math.min(canvasSize.width, canvasSize.height) * 0.04; // 4% of smaller dimension
  const CATEGORY_RADIUS = Math.min(canvasSize.width, canvasSize.height) * 0.15; // 15% of smaller dimension
  const ACTOR_SPREAD_RADIUS = Math.min(canvasSize.width, canvasSize.height) * 0.12; // 12% for actor arrangement

  // Group actors by category
  const actorsByCategory = actors.reduce((groups, actor) => {
    if (!groups[actor.category]) {
      groups[actor.category] = [];
    }
    groups[actor.category].push(actor);
    return groups;
  }, {} as Record<string, Actor[]>);

  // Convert relative position to absolute based on canvas size
  const getCategoryPosition = useCallback((category: string) => {
    const relPos = CATEGORY_POSITIONS_RELATIVE[category] || { x: 0.5, y: 0.5 };
    return {
      x: relPos.x * canvasSize.width,
      y: relPos.y * canvasSize.height,
    };
  }, [canvasSize]);

  // Calculate positions in grouped layout (responsive)
  const getActorPosition = useCallback((actor: Actor, index: number, categoryActors: Actor[]) => {
    const basePos = getCategoryPosition(actor.category);
    const count = categoryActors.length;

    if (count === 1) {
      return basePos;
    }

    // Arrange in circle around category center
    const angle = (index / count) * Math.PI * 2 - Math.PI / 2; // Start from top
    return {
      x: basePos.x + Math.cos(angle) * ACTOR_SPREAD_RADIUS,
      y: basePos.y + Math.sin(angle) * ACTOR_SPREAD_RADIUS,
    };
  }, [getCategoryPosition, ACTOR_SPREAD_RADIUS]);

  // Convert screen coordinates to world coordinates (accounting for zoom/pan)
  const screenToWorld = useCallback((screenX: number, screenY: number) => {
    return {
      x: (screenX - offset.x) / scale,
      y: (screenY - offset.y) / scale,
    };
  }, [scale, offset]);

  // Convert world coordinates to screen coordinates
  const worldToScreen = useCallback((worldX: number, worldY: number) => {
    return {
      x: worldX * scale + offset.x,
      y: worldY * scale + offset.y,
    };
  }, [scale, offset]);

  // Drawing function
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Clear entire canvas (before transform)
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Apply zoom and pan transform
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);

    // Draw category regions
    Object.keys(CATEGORY_POSITIONS_RELATIVE).forEach((category) => {
      const actors = actorsByCategory[category] || [];
      if (actors.length === 0 && category !== 'defensive') return;

      const pos = getCategoryPosition(category);

      // Category background
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, CATEGORY_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = `${getCategoryColor(category as any)}08`;
      ctx.fill();
      ctx.strokeStyle = `${getCategoryColor(category as any)}30`;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Category label background for better readability
      const label = CATEGORY_LABELS[category] || category;
      const fontSize = Math.max(12, NODE_RADIUS * 0.3);
      ctx.font = `bold ${fontSize}px Inter, sans-serif`;
      const labelMetrics = ctx.measureText(label);
      const labelWidth = labelMetrics.width;
      const labelX = pos.x;
      const labelY = pos.y - CATEGORY_RADIUS - 20;

      // Label background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fillRect(
        labelX - labelWidth / 2 - 6,
        labelY - 10,
        labelWidth + 12,
        20
      );

      // Label border
      ctx.strokeStyle = `${getCategoryColor(category as any)}50`;
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      ctx.strokeRect(
        labelX - labelWidth / 2 - 6,
        labelY - 10,
        labelWidth + 12,
        20
      );

      // Category label text
      ctx.fillStyle = getCategoryColor(category as any);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, labelX, labelY);
    });

    // Draw connections (edges)
    connections.forEach(conn => {
      const source = actors.find(a => a.id === conn.sourceId);
      const target = actors.find(a => a.id === conn.targetId);
      if (!source || !target) return;

      const categoryActors = actorsByCategory[source.category] || [];
      const sourceIndex = categoryActors.indexOf(source);
      const sourcPos = getActorPosition(source, sourceIndex, categoryActors);

      const targetCategoryActors = actorsByCategory[target.category] || [];
      const targetIndex = targetCategoryActors.indexOf(target);
      const targetPos = getActorPosition(target, targetIndex, targetCategoryActors);

      const isHighlighted =
        source.id === selectedActorId ||
        target.id === selectedActorId ||
        source.id === hoveredActorId ||
        target.id === hoveredActorId;

      // Connection line
      ctx.beginPath();
      ctx.moveTo(sourcPos.x, sourcPos.y);
      ctx.lineTo(targetPos.x, targetPos.y);
      ctx.strokeStyle = isHighlighted
        ? `rgba(59, 130, 246, ${conn.strength})`
        : `rgba(156, 163, 175, ${conn.strength * 0.4})`;
      ctx.lineWidth = isHighlighted ? 3 : 1;
      ctx.stroke();

      // Connection strength indicator (dot in middle)
      if (conn.strength > 0.5) {
        const midX = (sourcPos.x + targetPos.x) / 2;
        const midY = (sourcPos.y + targetPos.y) / 2;
        ctx.beginPath();
        ctx.arc(midX, midY, 3, 0, Math.PI * 2);
        ctx.fillStyle = isHighlighted ? '#3B82F6' : '#9CA3AF';
        ctx.fill();
      }
    });

    // Draw actors (nodes)
    Object.entries(actorsByCategory).forEach(([category, categoryActors]) => {
      categoryActors.forEach((actor, index) => {
        const pos = getActorPosition(actor, index, categoryActors);

        const isSelected = actor.id === selectedActorId;
        const isHovered = actor.id === hoveredActorId;
        const isValidTarget = validTargets.includes(actor.id);

        // Glow for targeting mode
        if (targetingMode && isValidTarget) {
          const pulse = (Date.now() % 1000) / 1000;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, NODE_RADIUS * 1.3 + pulse * 15, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(239, 68, 68, ${1 - pulse})`;
          ctx.lineWidth = 4;
          ctx.stroke();
        }

        // Selection ring
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, NODE_RADIUS * 1.3, 0, Math.PI * 2);
          ctx.strokeStyle = '#3B82F6';
          ctx.lineWidth = 5;
          ctx.stroke();
        }

        // Hover ring
        if (isHovered && !isSelected) {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, NODE_RADIUS * 1.2, 0, Math.PI * 2);
          ctx.strokeStyle = '#9CA3AF';
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        // Actor outer circle (category color)
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, NODE_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = getCategoryColor(actor.category);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Actor inner circle (trust color)
        const innerRadius = NODE_RADIUS * 0.7;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, innerRadius, 0, Math.PI * 2);
        ctx.fillStyle = trustToHex(actor.trust);
        ctx.fill();

        // Trust percentage arc
        const arcRadius = NODE_RADIUS * 0.85;
        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + actor.trust * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, arcRadius, startAngle, endAngle);
        ctx.strokeStyle = trustToHex(actor.trust);
        ctx.lineWidth = 4;
        ctx.stroke();

        // Actor name with text wrapping for long names
        const maxNameWidth = NODE_RADIUS * 4;
        const nameFontSize = Math.max(11, NODE_RADIUS * 0.3);
        ctx.font = `${isSelected || isHovered ? 'bold ' : ''}${nameFontSize}px Inter, sans-serif`;
        ctx.fillStyle = '#1F2937';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        // Truncate name if too long
        let displayName = actor.name;
        const nameMetrics = ctx.measureText(displayName);
        if (nameMetrics.width > maxNameWidth) {
          // Shorten the name
          while (ctx.measureText(displayName + '...').width > maxNameWidth && displayName.length > 0) {
            displayName = displayName.slice(0, -1);
          }
          displayName = displayName + '...';
        }

        // Name background for better readability
        const textWidth = ctx.measureText(displayName).width;
        const nameY = pos.y + NODE_RADIUS + 8;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(pos.x - textWidth / 2 - 4, nameY, textWidth + 8, nameFontSize + 6);

        ctx.fillStyle = '#1F2937';
        ctx.fillText(displayName, pos.x, nameY + 2);

        // Trust percentage below name
        if (isSelected || isHovered) {
          const trustFontSize = Math.max(10, NODE_RADIUS * 0.25);
          ctx.font = `${trustFontSize}px Inter, sans-serif`;
          ctx.fillStyle = trustToHex(actor.trust);
          const trustText = `${Math.round(actor.trust * 100)}%`;
          const trustWidth = ctx.measureText(trustText).width;

          const trustY = nameY + nameFontSize + 10;
          // Background for trust percentage
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fillRect(pos.x - trustWidth / 2 - 3, trustY, trustWidth + 6, trustFontSize + 4);

          ctx.fillStyle = trustToHex(actor.trust);
          ctx.fillText(trustText, pos.x, trustY + 2);
        }
      });
    });

    // Restore transform
    ctx.restore();

    animationFrameRef.current = requestAnimationFrame(draw);
  }, [actors, connections, selectedActorId, hoveredActorId, targetingMode, validTargets, actorsByCategory, getActorPosition, NODE_RADIUS, CATEGORY_RADIUS, getCategoryPosition, scale, offset]);

  // Find actor at click position (screen coordinates input, converts to world)
  const findActorAtPosition = useCallback((screenX: number, screenY: number): Actor | null => {
    // Convert screen coordinates to world coordinates
    const world = screenToWorld(screenX, screenY);

    for (const [category, categoryActors] of Object.entries(actorsByCategory)) {
      for (let i = 0; i < categoryActors.length; i++) {
        const actor = categoryActors[i];
        const pos = getActorPosition(actor, i, categoryActors);
        const distance = Math.sqrt(Math.pow(world.x - pos.x, 2) + Math.pow(world.y - pos.y, 2));
        if (distance <= NODE_RADIUS * 1.5) {
          return actor;
        }
      }
    }
    return null;
  }, [actorsByCategory, getActorPosition, NODE_RADIUS, screenToWorld]);

  // Zoom helper - zoom towards a point
  const zoomToPoint = useCallback((newScale: number, pointX: number, pointY: number) => {
    const clampedScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
    const scaleRatio = clampedScale / scale;

    // Adjust offset to zoom towards the point
    setOffset(prev => ({
      x: pointX - (pointX - prev.x) * scaleRatio,
      y: pointY - (pointY - prev.y) * scaleRatio,
    }));
    setScale(clampedScale);
  }, [scale]);

  // Reset zoom/pan to default
  const resetView = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  // Event handlers
  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    // Don't process click if we just finished panning
    if (isPanning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const actor = findActorAtPosition(x, y);
    if (actor) {
      onActorClick(actor.id);
    }
  }, [findActorAtPosition, onActorClick, isPanning]);

  // Mouse wheel zoom handler (supports trackpad pinch via ctrlKey)
  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Determine zoom direction and amount
    // ctrlKey is typically set for trackpad pinch gestures
    const delta = e.ctrlKey ? -e.deltaY * 0.01 : -e.deltaY * ZOOM_SPEED * 0.01;
    const newScale = scale * (1 + delta);

    zoomToPoint(newScale, mouseX, mouseY);
  }, [scale, zoomToPoint]);

  // Mouse pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    // Middle mouse button or left mouse button with space key (checked elsewhere)
    // For now, just use any mouse button for panning (except if clicking on an actor)
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on an actor - if so, don't start pan
    const actor = findActorAtPosition(x, y);
    if (actor) return;

    setIsPanning(true);
    lastPanPosition.current = { x: e.clientX, y: e.clientY };
    canvas.style.cursor = 'grabbing';
  }, [findActorAtPosition]);

  const handleMouseMoveForPan = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPanning) return;

    const dx = e.clientX - lastPanPosition.current.x;
    const dy = e.clientY - lastPanPosition.current.y;

    setOffset(prev => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));

    lastPanPosition.current = { x: e.clientX, y: e.clientY };
  }, [isPanning]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.cursor = 'pointer';
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    // Handle pan movement if panning
    handleMouseMoveForPan(e);
    if (isPanning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const actor = findActorAtPosition(x, y);
    onActorHover(actor?.id || null);

    // Update cursor and tooltip
    canvas.style.cursor = actor ? 'pointer' : 'grab';
    if (actor) {
      setHoveredActor(actor);
      setTooltipPosition({ x: e.clientX, y: e.clientY });
    } else {
      setHoveredActor(null);
      setTooltipPosition(null);
    }
  }, [findActorAtPosition, onActorHover, handleMouseMoveForPan, isPanning]);

  // Touch event handlers for tablet/mobile support with pinch-to-zoom
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (e.touches.length === 1) {
      // Single touch - check for actor click or start pan
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      const actor = findActorAtPosition(x, y);
      if (actor) {
        onActorClick(actor.id);
        setHoveredActor(actor);
        setTooltipPosition({ x: touch.clientX, y: touch.clientY });
      } else {
        // Start panning
        setIsPanning(true);
        lastPanPosition.current = { x: touch.clientX, y: touch.clientY };
      }
    } else if (e.touches.length === 2) {
      // Two finger touch - start pinch-to-zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      lastTouchDistance.current = distance;
      lastTouchCenter.current = {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
      };
    }
  }, [findActorAtPosition, onActorClick]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    if (e.touches.length === 1 && isPanning) {
      // Single finger pan
      const touch = e.touches[0];
      const dx = touch.clientX - lastPanPosition.current.x;
      const dy = touch.clientY - lastPanPosition.current.y;

      setOffset(prev => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));

      lastPanPosition.current = { x: touch.clientX, y: touch.clientY };
    } else if (e.touches.length === 2 && lastTouchDistance.current !== null) {
      // Pinch-to-zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const newDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      const center = {
        x: (touch1.clientX + touch2.clientX) / 2 - rect.left,
        y: (touch1.clientY + touch2.clientY) / 2 - rect.top,
      };

      // Calculate scale change
      const scaleChange = newDistance / lastTouchDistance.current;
      const newScale = scale * scaleChange;

      zoomToPoint(newScale, center.x, center.y);

      lastTouchDistance.current = newDistance;
      lastTouchCenter.current = center;
    } else if (e.touches.length === 1 && !isPanning) {
      // Single touch hover (not panning)
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      const actor = findActorAtPosition(x, y);
      onActorHover(actor?.id || null);

      if (actor) {
        setHoveredActor(actor);
        setTooltipPosition({ x: touch.clientX, y: touch.clientY });
      } else {
        setHoveredActor(null);
        setTooltipPosition(null);
      }
    }
  }, [findActorAtPosition, onActorHover, isPanning, scale, zoomToPoint]);

  const handleTouchEnd = useCallback(() => {
    setIsPanning(false);
    lastTouchDistance.current = null;
    lastTouchCenter.current = null;

    // Keep tooltip visible briefly after touch ends, then clear
    setTimeout(() => {
      onActorHover(null);
      setHoveredActor(null);
      setTooltipPosition(null);
    }, 1500);
  }, [onActorHover]);

  // Keyboard zoom handler (+/- keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if focus is in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;

      // Center of canvas for keyboard zoom
      const centerX = canvasSize.width / 2;
      const centerY = canvasSize.height / 2;

      if (e.key === '+' || e.key === '=' || (e.key === '=' && e.shiftKey)) {
        e.preventDefault();
        zoomToPoint(scale + KEYBOARD_ZOOM_STEP, centerX, centerY);
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        zoomToPoint(scale - KEYBOARD_ZOOM_STEP, centerX, centerY);
      } else if (e.key === '0' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        resetView();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scale, canvasSize, zoomToPoint, resetView]);

  // Resize canvas
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

      // Update canvas size state for responsive calculations
      setCanvasSize({ width, height });

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation loop
  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [draw]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-grab touch-none"
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          handleMouseUp();
          onActorHover(null);
          setHoveredActor(null);
          setTooltipPosition(null);
        }}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {/* Legend - positioned at bottom left to avoid network overlap */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2.5 text-xs max-w-[160px]">
        <h4 className="font-bold text-gray-900 mb-1.5 text-[11px]">Legend</h4>
        <div className="space-y-1">
          {Object.entries(CATEGORY_LABELS).map(([cat, label]) => {
            const count = actorsByCategory[cat]?.length || 0;
            if (count === 0 && cat !== 'defensive') return null;
            return (
              <div key={cat} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: getCategoryColor(cat as any) }}
                />
                <span className="text-gray-700 text-[10px] leading-tight truncate">
                  {label.replace('Community', '').replace('Outlets', '').trim()} ({count})
                </span>
              </div>
            );
          })}
          <div className="border-t border-gray-200 my-1"></div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#EF4444' }} />
            <span className="text-gray-700 text-[10px]">Low trust</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#EAB308' }} />
            <span className="text-gray-700 text-[10px]">Med trust</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#22C55E' }} />
            <span className="text-gray-700 text-[10px]">High trust</span>
          </div>
        </div>
      </div>

      {/* Zoom Controls - bottom right, above bottom sheet area */}
      <div className="absolute bottom-[300px] right-4 flex flex-col gap-1 z-20">
        <button
          onClick={() => zoomToPoint(scale + KEYBOARD_ZOOM_STEP, canvasSize.width / 2, canvasSize.height / 2)}
          className="w-9 h-9 bg-gray-900/90 hover:bg-gray-800 text-white rounded-lg flex items-center justify-center shadow-lg transition-colors"
          title="Zoom in (+)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <button
          onClick={resetView}
          className="w-9 h-9 bg-gray-900/90 hover:bg-gray-800 text-white rounded-lg flex items-center justify-center shadow-lg transition-colors text-xs font-bold"
          title="Reset view (Ctrl+0)"
        >
          {Math.round(scale * 100)}%
        </button>
        <button
          onClick={() => zoomToPoint(scale - KEYBOARD_ZOOM_STEP, canvasSize.width / 2, canvasSize.height / 2)}
          className="w-9 h-9 bg-gray-900/90 hover:bg-gray-800 text-white rounded-lg flex items-center justify-center shadow-lg transition-colors"
          title="Zoom out (-)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>

      {/* Actor Tooltip */}
      {hoveredActor && tooltipPosition && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: tooltipPosition.x + 15,
            top: tooltipPosition.y + 15,
          }}
        >
          <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl max-w-[250px]">
            <div className="font-bold mb-1">{hoveredActor.name}</div>
            <div className="text-gray-300 capitalize mb-1">{hoveredActor.category}</div>
            <div className="space-y-0.5 text-[11px]">
              <div>Trust: <span className="font-semibold">{Math.round(hoveredActor.trust * 100)}%</span></div>
              <div>Resilience: <span className="font-semibold">{Math.round(hoveredActor.resilience * 100)}%</span></div>
              <div>Emotional: <span className="font-semibold">{Math.round(hoveredActor.emotionalState * 100)}%</span></div>
            </div>
            {hoveredActor.vulnerabilities.length > 0 && (
              <div className="mt-1 pt-1 border-t border-gray-700">
                <div className="text-red-400 text-[10px]">
                  Vulnerable to: {hoveredActor.vulnerabilities.join(', ').replace(/_/g, ' ')}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NetworkVisualization;
