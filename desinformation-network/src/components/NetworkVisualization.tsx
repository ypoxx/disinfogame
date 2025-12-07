import { useRef, useEffect, useCallback, useState } from 'react';
import type { Actor, Connection, VisualEffect } from '@/game-logic/types';
import { trustToHex, getCategoryColor } from '@/utils/colors';
import { euclideanDistance } from '@/utils';

// ============================================
// FULLSCREEN RESPONSIVE NETWORK VISUALIZATION
// Modern, scalable design with grouped nodes
// Enhanced with visual effects (Sprint 1.1)
// ============================================

type NetworkVisualizationProps = {
  actors: Actor[];
  connections: Connection[];
  selectedActorId: string | null;
  hoveredActorId: string | null;
  targetingMode: boolean;
  validTargets: string[];
  visualEffects?: VisualEffect[];
  onActorClick: (actorId: string) => void;
  onActorHover: (actorId: string | null) => void;
};

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
  visualEffects = [],
  onActorClick,
  onActorHover,
}: NetworkVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [hoveredActor, setHoveredActor] = useState<Actor | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

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

  // Drawing function
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
        const isControlled = actor.trust < 0.4;
        const isInDangerZone = actor.trust < 0.5 && actor.trust >= 0.4;

        // Dynamic node size based on trust (Sprint 1.2)
        // Lower trust = slightly smaller, controlled = even smaller
        const trustSizeMultiplier = 0.85 + actor.trust * 0.15;
        const dynamicNodeRadius = NODE_RADIUS * trustSizeMultiplier;

        // Danger zone pulsing for actors between 40-50% trust
        if (isInDangerZone) {
          const dangerPulse = (Math.sin(Date.now() * 0.004) + 1) / 2;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, dynamicNodeRadius * (1.2 + dangerPulse * 0.2), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(234, 179, 8, ${0.3 + dangerPulse * 0.3})`;
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Controlled indicator - red glow for actors below 40%
        if (isControlled) {
          const controlledPulse = (Math.sin(Date.now() * 0.003) + 1) / 2;
          ctx.save();
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, dynamicNodeRadius * 1.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(239, 68, 68, ${0.1 + controlledPulse * 0.15})`;
          ctx.fill();
          ctx.restore();
        }

        // Glow for targeting mode
        if (targetingMode && isValidTarget) {
          const pulse = (Date.now() % 1000) / 1000;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, dynamicNodeRadius * 1.3 + pulse * 15, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(239, 68, 68, ${1 - pulse})`;
          ctx.lineWidth = 4;
          ctx.stroke();
        }

        // Selection ring
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, dynamicNodeRadius * 1.3, 0, Math.PI * 2);
          ctx.strokeStyle = '#3B82F6';
          ctx.lineWidth = 5;
          ctx.stroke();
        }

        // Hover ring
        if (isHovered && !isSelected) {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, dynamicNodeRadius * 1.2, 0, Math.PI * 2);
          ctx.strokeStyle = '#9CA3AF';
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        // Actor outer circle (category color)
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, dynamicNodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = getCategoryColor(actor.category);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Actor inner circle (trust color)
        const innerRadius = dynamicNodeRadius * 0.7;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, innerRadius, 0, Math.PI * 2);
        ctx.fillStyle = trustToHex(actor.trust);
        ctx.fill();

        // Trust percentage arc
        const arcRadius = dynamicNodeRadius * 0.85;
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

    // ============================================
    // VISUAL EFFECTS RENDERING (Sprint 1.1)
    // ============================================
    const now = Date.now();

    for (const effect of visualEffects) {
      const elapsed = now - effect.startTime;
      const progress = Math.min(elapsed / effect.duration, 1);

      // Find target actor position
      const targetActor = actors.find((a) => a.id === effect.targetActorId);
      if (!targetActor) continue;

      const targetCategoryActors = actorsByCategory[targetActor.category] || [];
      const targetIndex = targetCategoryActors.indexOf(targetActor);
      const targetPos = getActorPosition(targetActor, targetIndex, targetCategoryActors);

      switch (effect.type) {
        case 'impact_number': {
          // Floating number that rises and fades
          const floatY = targetPos.y - NODE_RADIUS - 20 - progress * 40;
          const opacity = 1 - progress * 0.7;
          const scale = 1 + progress * 0.3;

          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.font = `bold ${Math.round(18 * scale)}px Inter, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // Shadow for better visibility
          ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 1;
          ctx.shadowOffsetY = 1;

          ctx.fillStyle = effect.color;
          ctx.fillText(effect.label || '', targetPos.x, floatY);
          ctx.restore();
          break;
        }

        case 'trust_pulse': {
          // Expanding pulse ring
          const pulseRadius = NODE_RADIUS * (1 + progress * 0.8);
          const opacity = 1 - progress;

          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.beginPath();
          ctx.arc(targetPos.x, targetPos.y, pulseRadius, 0, Math.PI * 2);
          ctx.strokeStyle = effect.color;
          ctx.lineWidth = 4 * (1 - progress * 0.5);
          ctx.stroke();
          ctx.restore();
          break;
        }

        case 'ability_beam': {
          // Beam from source to target
          if (!effect.sourceActorId) break;

          const sourceActor = actors.find((a) => a.id === effect.sourceActorId);
          if (!sourceActor) break;

          const sourceCategoryActors = actorsByCategory[sourceActor.category] || [];
          const sourceIndex = sourceCategoryActors.indexOf(sourceActor);
          const sourcePos = getActorPosition(sourceActor, sourceIndex, sourceCategoryActors);

          // Animated beam with head
          const beamProgress = Math.min(progress * 2, 1);
          const fadeProgress = Math.max(0, (progress - 0.5) * 2);

          const currentX = sourcePos.x + (targetPos.x - sourcePos.x) * beamProgress;
          const currentY = sourcePos.y + (targetPos.y - sourcePos.y) * beamProgress;

          ctx.save();
          ctx.globalAlpha = 1 - fadeProgress;

          // Beam line
          ctx.beginPath();
          ctx.moveTo(sourcePos.x, sourcePos.y);
          ctx.lineTo(currentX, currentY);
          ctx.strokeStyle = effect.color;
          ctx.lineWidth = 3;
          ctx.stroke();

          // Beam head glow
          ctx.beginPath();
          ctx.arc(currentX, currentY, 8, 0, Math.PI * 2);
          ctx.fillStyle = effect.color;
          ctx.fill();

          ctx.restore();
          break;
        }

        case 'propagation_wave': {
          // Expanding wave effect
          const waveRadius = NODE_RADIUS * (1 + progress * 3);
          const opacity = 0.6 * (1 - progress);

          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.beginPath();
          ctx.arc(targetPos.x, targetPos.y, waveRadius, 0, Math.PI * 2);
          ctx.strokeStyle = effect.color;
          ctx.lineWidth = 2;
          ctx.setLineDash([8, 8]);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
          break;
        }

        case 'controlled': {
          // "CONTROLLED!" celebration effect
          const bounceY = targetPos.y - NODE_RADIUS - 50 - Math.sin(progress * Math.PI * 3) * 10;
          const scaleEffect = 1 + Math.sin(progress * Math.PI) * 0.3;
          const opacity = progress < 0.8 ? 1 : (1 - progress) * 5;

          ctx.save();
          ctx.globalAlpha = Math.min(opacity, 1);
          ctx.font = `bold ${Math.round(16 * scaleEffect)}px Inter, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // Glow effect
          ctx.shadowColor = effect.color;
          ctx.shadowBlur = 15;

          // Background pill
          const labelWidth = ctx.measureText(effect.label || '').width + 16;
          ctx.fillStyle = effect.color;
          ctx.beginPath();
          ctx.roundRect(targetPos.x - labelWidth / 2, bounceY - 12, labelWidth, 24, 12);
          ctx.fill();

          // Text
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowBlur = 0;
          ctx.fillText(effect.label || '', targetPos.x, bounceY);
          ctx.restore();
          break;
        }

        case 'celebration': {
          // Generic celebration particles (could be expanded)
          const particleCount = 8;
          for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const distance = progress * 60;
            const px = targetPos.x + Math.cos(angle) * distance;
            const py = targetPos.y + Math.sin(angle) * distance;
            const opacity = 1 - progress;

            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.beginPath();
            ctx.arc(px, py, 4, 0, Math.PI * 2);
            ctx.fillStyle = effect.color;
            ctx.fill();
            ctx.restore();
          }
          break;
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(draw);
  }, [actors, connections, selectedActorId, hoveredActorId, targetingMode, validTargets, actorsByCategory, getActorPosition, NODE_RADIUS, CATEGORY_RADIUS, getCategoryPosition, visualEffects]);

  // Find actor at click position
  const findActorAtPosition = useCallback((x: number, y: number): Actor | null => {
    for (const [category, categoryActors] of Object.entries(actorsByCategory)) {
      for (let i = 0; i < categoryActors.length; i++) {
        const actor = categoryActors[i];
        const pos = getActorPosition(actor, i, categoryActors);
        const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
        if (distance <= NODE_RADIUS * 1.5) {
          return actor;
        }
      }
    }
    return null;
  }, [actorsByCategory, getActorPosition, NODE_RADIUS]);

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
        className="absolute inset-0 cursor-pointer"
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          onActorHover(null);
          setHoveredActor(null);
          setTooltipPosition(null);
        }}
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
