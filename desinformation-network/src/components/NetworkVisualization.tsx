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
  media: { x: 180, y: 180 },
  expert: { x: 600, y: 180 },
  lobby: { x: 180, y: 420 },
  organization: { x: 600, y: 420 },
  defensive: { x: 390, y: 300 }, // Center
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
    const radius = 85;
    const angle = (index / count) * Math.PI * 2 - Math.PI / 2; // Start from top
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
      ctx.arc(pos.x, pos.y, 125, 0, Math.PI * 2);
      ctx.fillStyle = `${getCategoryColor(category as any)}08`;
      ctx.fill();
      ctx.strokeStyle = `${getCategoryColor(category as any)}30`;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Category label background for better readability
      const label = CATEGORY_LABELS[category] || category;
      ctx.font = 'bold 13px Inter, sans-serif';
      const labelMetrics = ctx.measureText(label);
      const labelWidth = labelMetrics.width;
      const labelX = pos.x;
      const labelY = pos.y - 115;

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

        // Actor name with text wrapping for long names
        const maxNameWidth = 100;
        ctx.font = `${isSelected || isHovered ? 'bold ' : ''}11px Inter, sans-serif`;
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
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(pos.x - textWidth / 2 - 4, pos.y + 36, textWidth + 8, 16);

        ctx.fillStyle = '#1F2937';
        ctx.fillText(displayName, pos.x, pos.y + 38);

        // Trust percentage below name
        if (isSelected || isHovered) {
          ctx.font = '10px Inter, sans-serif';
          ctx.fillStyle = trustToHex(actor.trust);
          const trustText = `${Math.round(actor.trust * 100)}%`;
          const trustWidth = ctx.measureText(trustText).width;

          // Background for trust percentage
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fillRect(pos.x - trustWidth / 2 - 3, pos.y + 53, trustWidth + 6, 14);

          ctx.fillStyle = trustToHex(actor.trust);
          ctx.fillText(trustText, pos.x, pos.y + 55);
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

    // Update tooltip
    if (actor) {
      setHoveredActor(actor);
      setTooltipPosition({ x: e.clientX, y: e.clientY });
    } else {
      setHoveredActor(null);
      setTooltipPosition(null);
    }
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
        onMouseLeave={() => {
          onActorHover(null);
          setHoveredActor(null);
          setTooltipPosition(null);
        }}
      />

      {/* Legend - moved to top right to avoid network overlap */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 text-xs max-w-[180px]">
        <h4 className="font-bold text-gray-900 mb-2">Legend</h4>
        <div className="space-y-1.5">
          <div className="font-semibold text-gray-700 text-[10px] uppercase tracking-wide mb-1">Categories</div>
          {Object.entries(CATEGORY_LABELS).map(([cat, label]) => {
            const count = actorsByCategory[cat]?.length || 0;
            if (count === 0 && cat !== 'defensive') return null;
            return (
              <div key={cat} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: getCategoryColor(cat as any) }}
                />
                <span className="text-gray-700 text-[11px] leading-tight">{label} ({count})</span>
              </div>
            );
          })}
          <div className="font-semibold text-gray-700 text-[10px] uppercase tracking-wide mt-2 mb-1">Trust</div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: '#EF4444' }} />
            <span className="text-gray-700 text-[11px]">Low (&lt; 40%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: '#EAB308' }} />
            <span className="text-gray-700 text-[11px]">Med (40-70%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: '#22C55E' }} />
            <span className="text-gray-700 text-[11px]">High (&gt; 70%)</span>
          </div>
        </div>
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
