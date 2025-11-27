import { useRef, useEffect, useCallback, useState } from 'react';
import type { Actor, Connection } from '@/game-logic/types';
import { trustToHex, getCategoryColor } from '@/utils/colors';
import { euclideanDistance } from '@/utils';

// ============================================
// DEMOCRACY 4 STYLE NETWORK VISUALIZATION
// Mind-map style with grouped nodes and clear connections
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

const CATEGORY_POSITIONS: Record<string, { x: number; y: number }> = {
  media: { x: 200, y: 150 },
  expert: { x: 600, y: 150 },
  lobby: { x: 200, y: 400 },
  organization: { x: 600, y: 400 },
  defensive: { x: 400, y: 275 }, // Center
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

  // Group actors by category
  const actorsByCategory = actors.reduce((groups, actor) => {
    if (!groups[actor.category]) {
      groups[actor.category] = [];
    }
    groups[actor.category].push(actor);
    return groups;
  }, {} as Record<string, Actor[]>);

  // Calculate positions in grouped layout
  const getActorPosition = useCallback((actor: Actor, index: number, categoryActors: Actor[]) => {
    const basePos = CATEGORY_POSITIONS[actor.category] || { x: 400, y: 300 };
    const count = categoryActors.length;

    if (count === 1) {
      return basePos;
    }

    // Arrange in circle around category center
    const radius = 80;
    const angle = (index / count) * Math.PI * 2;
    return {
      x: basePos.x + Math.cos(angle) * radius,
      y: basePos.y + Math.sin(angle) * radius,
    };
  }, []);

  // Drawing function
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw category regions
    Object.entries(CATEGORY_POSITIONS).forEach(([category, pos]) => {
      const actors = actorsByCategory[category] || [];
      if (actors.length === 0 && category !== 'defensive') return;

      // Category background
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 120, 0, Math.PI * 2);
      ctx.fillStyle = `${getCategoryColor(category as any)}08`;
      ctx.fill();
      ctx.strokeStyle = `${getCategoryColor(category as any)}30`;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Category label
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillStyle = getCategoryColor(category as any);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(CATEGORY_LABELS[category] || category, pos.x, pos.y - 100);
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
          ctx.arc(pos.x, pos.y, 35 + pulse * 10, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(239, 68, 68, ${1 - pulse})`;
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        // Selection ring
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 38, 0, Math.PI * 2);
          ctx.strokeStyle = '#3B82F6';
          ctx.lineWidth = 4;
          ctx.stroke();
        }

        // Hover ring
        if (isHovered && !isSelected) {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 36, 0, Math.PI * 2);
          ctx.strokeStyle = '#9CA3AF';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Actor outer circle (category color)
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 30, 0, Math.PI * 2);
        ctx.fillStyle = getCategoryColor(actor.category);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Actor inner circle (trust color)
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 22, 0, Math.PI * 2);
        ctx.fillStyle = trustToHex(actor.trust);
        ctx.fill();

        // Trust percentage arc
        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + actor.trust * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 26, startAngle, endAngle);
        ctx.strokeStyle = trustToHex(actor.trust);
        ctx.lineWidth = 3;
        ctx.stroke();

        // Actor name (always show in Democracy 4 style)
        ctx.font = `${isSelected || isHovered ? 'bold ' : ''}11px Inter, sans-serif`;
        ctx.fillStyle = '#1F2937';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(actor.name, pos.x, pos.y + 38);

        // Trust percentage below name
        if (isSelected || isHovered) {
          ctx.font = '10px Inter, sans-serif';
          ctx.fillStyle = trustToHex(actor.trust);
          ctx.fillText(`${Math.round(actor.trust * 100)}%`, pos.x, pos.y + 52);
        }
      });
    });

    animationFrameRef.current = requestAnimationFrame(draw);
  }, [actors, connections, selectedActorId, hoveredActorId, targetingMode, validTargets, actorsByCategory, getActorPosition]);

  // Find actor at click position
  const findActorAtPosition = useCallback((x: number, y: number): Actor | null => {
    for (const [category, categoryActors] of Object.entries(actorsByCategory)) {
      for (let i = 0; i < categoryActors.length; i++) {
        const actor = categoryActors[i];
        const pos = getActorPosition(actor, i, categoryActors);
        const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
        if (distance <= 35) {
          return actor;
        }
      }
    }
    return null;
  }, [actorsByCategory, getActorPosition]);

  // Event handlers
  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const actor = findActorAtPosition(x, y);
    if (actor) {
      onActorClick(actor.id);
    }
  }, [findActorAtPosition, onActorClick]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const actor = findActorAtPosition(x, y);
    onActorHover(actor?.id || null);
  }, [findActorAtPosition, onActorHover]);

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
        className="absolute inset-0 cursor-pointer"
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => onActorHover(null)}
      />

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 text-xs">
        <h4 className="font-bold text-gray-900 mb-2">Network Map</h4>
        <div className="space-y-1">
          {Object.entries(CATEGORY_LABELS).map(([cat, label]) => {
            const count = actorsByCategory[cat]?.length || 0;
            if (count === 0 && cat !== 'defensive') return null;
            return (
              <div key={cat} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getCategoryColor(cat as any) }}
                />
                <span className="text-gray-700">{label} ({count})</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 text-xs">
        <h4 className="font-bold text-gray-900 mb-2">Trust Levels</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#EF4444' }} />
            <span className="text-gray-700">Low (&lt; 40%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#EAB308' }} />
            <span className="text-gray-700">Medium (40-70%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#22C55E' }} />
            <span className="text-gray-700">High (&gt; 70%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NetworkVisualization;
