import { useRef, useEffect, useCallback, useState, useMemo, memo } from 'react';
import type { Actor, Connection } from '@/game-logic/types';
import { trustToHex, awarenessToHex, getCategoryColor } from '@/utils/colors';
import { euclideanDistance, cn } from '@/utils';
import type { GraphMode } from '@/components/GraphModeToggle';
import {
  detectSpatialClusters,
  getClusterColor,
  getClusterBorderColor,
} from '@/utils/network/cluster-detection';

// ============================================
// FULLSCREEN RESPONSIVE NETWORK VISUALIZATION
// Modern, scalable design with grouped nodes
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
  graphMode?: GraphMode; // PHASE 1.3: Dual-Graph System
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
  onActorClick,
  onActorHover,
  graphMode = 'trust', // PHASE 1.3: Default to trust mode
}: NetworkVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [hoveredActor, setHoveredActor] = useState<Actor | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  // Zoom and Pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Cluster visualization (Phase 2: UX Layer)
  const [showClusters, setShowClusters] = useState(true);

  // PHASE 1.2: Enhanced Microinteractions - Ripple effects
  interface Ripple {
    id: string;
    x: number;
    y: number;
    maxRadius: number;
    startTime: number;
    duration: number;
    color: string;
  }
  const [ripples, setRipples] = useState<Ripple[]>([]);

  // PHASE 1.4: Connection Explorer - Hovered connection
  const [hoveredConnection, setHoveredConnection] = useState<Connection | null>(null);
  const [connectionTooltipPos, setConnectionTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Constants scaled by canvas size
  const BASE_NODE_RADIUS = Math.min(canvasSize.width, canvasSize.height) * 0.04; // 4% of smaller dimension (base size)
  const CATEGORY_RADIUS = Math.min(canvasSize.width, canvasSize.height) * 0.15; // 15% of smaller dimension
  const ACTOR_SPREAD_RADIUS = Math.min(canvasSize.width, canvasSize.height) * 0.12; // 12% for actor arrangement

  // PHASE 1.1: Visual Hierarchy - Calculate node radius based on actor tier
  // Tier 3 (most influential): 1.3x base size
  // Tier 2 (medium influence): 1.0x base size
  // Tier 1 (least influential): 0.7x base size
  const getNodeRadius = useCallback((actor: Actor) => {
    const tierScales: Record<number, number> = {
      3: 1.3,  // High-tier actors (most influential)
      2: 1.0,  // Mid-tier actors (standard size)
      1: 0.7,  // Low-tier actors (smaller)
    };
    const scale = tierScales[actor.tier] || 1.0;
    return BASE_NODE_RADIUS * scale;
  }, [BASE_NODE_RADIUS]);

  // PHASE 1.2: Create ripple effect at position
  const createRipple = useCallback((x: number, y: number, color: string = '#3B82F6', maxRadius: number = 100) => {
    const ripple: Ripple = {
      id: `ripple_${Date.now()}_${Math.random()}`,
      x,
      y,
      maxRadius,
      startTime: Date.now(),
      duration: 600, // 600ms animation
      color,
    };

    setRipples(prev => [...prev, ripple]);

    // Remove ripple after duration
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== ripple.id));
    }, ripple.duration + 50);
  }, []);

  // Group actors by category
  const actorsByCategory = actors.reduce((groups, actor) => {
    if (!groups[actor.category]) {
      groups[actor.category] = [];
    }
    groups[actor.category].push(actor);
    return groups;
  }, {} as Record<string, Actor[]>);

  // PHASE 5: Performance - Create actor map for O(1) lookups
  const actorMap = useMemo(() => {
    const map = new Map<string, Actor>();
    actors.forEach(actor => map.set(actor.id, actor));
    return map;
  }, [actors]);

  // Detect spatial clusters (Phase 2: UX Layer)
  const spatialClusters = useMemo(() => {
    if (!showClusters || actors.length < 3) return [];
    return detectSpatialClusters(actors, 180, 3); // epsilon=180px, minPoints=3
  }, [actors, showClusters]);

  // Convert relative position to absolute based on canvas size
  const getCategoryPosition = useCallback((category: string) => {
    const relPos = CATEGORY_POSITIONS_RELATIVE[category] || { x: 0.5, y: 0.5 };
    return {
      x: relPos.x * canvasSize.width,
      y: relPos.y * canvasSize.height,
    };
  }, [canvasSize]);

  // Use actor's own position (from force-directed layout)
  // Phase 3: Actors now have positions calculated by force-directed layout
  const getActorPosition = useCallback((actor: Actor) => {
    // Actors now have positions set by force-directed layout in GameState
    return actor.position;
  }, []);

  // PHASE 1.3: Get color based on graph mode
  const getActorColor = useCallback((actor: Actor): string => {
    if (graphMode === 'awareness') {
      return awarenessToHex(actor.awareness || 0);
    }
    return trustToHex(actor.trust);
  }, [graphMode]);

  // PHASE 5: Performance - Viewport culling helper
  const isInViewport = useCallback((pos: { x: number; y: number }, padding: number = BASE_NODE_RADIUS * 2) => {
    const viewX = -pan.x / zoom;
    const viewY = -pan.y / zoom;
    const viewWidth = canvasSize.width / zoom;
    const viewHeight = canvasSize.height / zoom;

    return (
      pos.x >= viewX - padding &&
      pos.x <= viewX + viewWidth + padding &&
      pos.y >= viewY - padding &&
      pos.y <= viewY + viewHeight + padding
    );
  }, [pan, zoom, canvasSize, BASE_NODE_RADIUS]);

  // Drawing function
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context and apply zoom/pan transform
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Draw spatial clusters (Phase 2: UX Layer)
    if (showClusters && spatialClusters.length > 0) {
      spatialClusters.forEach(cluster => {
        ctx.beginPath();
        ctx.arc(cluster.center.x, cluster.center.y, cluster.radius, 0, Math.PI * 2);

        // Fill with semi-transparent color (generic cluster color since category removed)
        ctx.fillStyle = getClusterColor('mixed', 0.12);
        ctx.fill();

        // Border based on trust level
        ctx.strokeStyle = getClusterBorderColor(cluster.averageTrust);
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Cluster label (optional, for debugging)
        // ctx.font = '12px Inter, sans-serif';
        // ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        // ctx.textAlign = 'center';
        // ctx.fillText(`Cluster (${cluster.actorIds.length})`, cluster.center.x, cluster.center.y);
      });
    }

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
      const fontSize = Math.max(14, BASE_NODE_RADIUS * 0.4);
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

    // Draw connections (edges) - PHASE 5: Use actorMap for O(1) lookups
    connections.forEach(conn => {
      const source = actorMap.get(conn.sourceId);
      const target = actorMap.get(conn.targetId);
      if (!source || !target) return;

      const sourcPos = getActorPosition(source);
      const targetPos = getActorPosition(target);

      // PHASE 1.4: Include hovered connection in highlighting
      const isConnectionHovered = hoveredConnection &&
        conn.sourceId === hoveredConnection.sourceId &&
        conn.targetId === hoveredConnection.targetId;

      const isHighlighted =
        isConnectionHovered ||
        source.id === selectedActorId ||
        target.id === selectedActorId ||
        source.id === hoveredActorId ||
        target.id === hoveredActorId;

      // Connection line with gradient for depth
      if (isHighlighted) {
        const gradient = ctx.createLinearGradient(sourcPos.x, sourcPos.y, targetPos.x, targetPos.y);
        gradient.addColorStop(0, `rgba(59, 130, 246, ${conn.strength})`);
        gradient.addColorStop(0.5, `rgba(139, 92, 246, ${conn.strength})`);
        gradient.addColorStop(1, `rgba(59, 130, 246, ${conn.strength})`);

        ctx.beginPath();
        ctx.moveTo(sourcPos.x, sourcPos.y);
        ctx.lineTo(targetPos.x, targetPos.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Add glow effect to highlighted connections
        ctx.beginPath();
        ctx.moveTo(sourcPos.x, sourcPos.y);
        ctx.lineTo(targetPos.x, targetPos.y);
        ctx.strokeStyle = `rgba(59, 130, 246, ${conn.strength * 0.3})`;
        ctx.lineWidth = 8;
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(sourcPos.x, sourcPos.y);
        ctx.lineTo(targetPos.x, targetPos.y);
        ctx.strokeStyle = `rgba(156, 163, 175, ${conn.strength * 0.4})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Connection strength indicator (dot in middle) - enhanced
      if (conn.strength > 0.5 && isHighlighted) {
        const midX = (sourcPos.x + targetPos.x) / 2;
        const midY = (sourcPos.y + targetPos.y) / 2;

        // Glow for connection point
        const dotGradient = ctx.createRadialGradient(midX, midY, 0, midX, midY, 6);
        dotGradient.addColorStop(0, '#3B82F6');
        dotGradient.addColorStop(0.5, '#3B82F680');
        dotGradient.addColorStop(1, '#3B82F600');

        ctx.beginPath();
        ctx.arc(midX, midY, 6, 0, Math.PI * 2);
        ctx.fillStyle = dotGradient;
        ctx.fill();

        // Solid center
        ctx.beginPath();
        ctx.arc(midX, midY, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#3B82F6';
        ctx.fill();
      }
    });

    // Draw actors (nodes) - PHASE 5: Apply viewport culling + PHASE 1.1: Tier-based sizing
    actors.forEach((actor) => {
      const pos = getActorPosition(actor);
      const nodeRadius = getNodeRadius(actor); // PHASE 1.1: Dynamic radius based on tier

      // Skip actors outside viewport (with padding for smooth entry/exit)
      if (!isInViewport(pos, nodeRadius * 3)) {
        return;
      }

      const isSelected = actor.id === selectedActorId;
      const isHovered = actor.id === hoveredActorId;
      const isValidTarget = validTargets.includes(actor.id);

        // Glow for targeting mode
        if (targetingMode && isValidTarget) {
          const pulse = (Date.now() % 1000) / 1000;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, nodeRadius * 1.3 + pulse * 15, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(239, 68, 68, ${1 - pulse})`;
          ctx.lineWidth = 4;
          ctx.stroke();
        }

        // Selection ring
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, nodeRadius * 1.3, 0, Math.PI * 2);
          ctx.strokeStyle = '#3B82F6';
          ctx.lineWidth = 5;
          ctx.stroke();
        }

        // Hover ring
        if (isHovered && !isSelected) {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, nodeRadius * 1.2, 0, Math.PI * 2);
          ctx.strokeStyle = '#9CA3AF';
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        // Glow effect for selected/hovered actors
        if (isSelected || isHovered) {
          const glowRadius = nodeRadius * 1.5;
          const gradient = ctx.createRadialGradient(pos.x, pos.y, nodeRadius, pos.x, pos.y, glowRadius);
          const glowColor = isSelected ? '#3B82F6' : '#9CA3AF';
          gradient.addColorStop(0, `${glowColor}40`);
          gradient.addColorStop(0.5, `${glowColor}20`);
          gradient.addColorStop(1, `${glowColor}00`);

          ctx.beginPath();
          ctx.arc(pos.x, pos.y, glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Actor outer circle (category color) with subtle gradient
        const outerGradient = ctx.createRadialGradient(
          pos.x - nodeRadius * 0.3,
          pos.y - nodeRadius * 0.3,
          0,
          pos.x,
          pos.y,
          nodeRadius
        );
        const categoryColor = getCategoryColor(actor.category);
        outerGradient.addColorStop(0, categoryColor);
        outerGradient.addColorStop(1, categoryColor + 'CC');

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = outerGradient;
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Actor inner circle (trust color) with gradient
        const innerRadius = nodeRadius * 0.7;
        const innerGradient = ctx.createRadialGradient(
          pos.x - innerRadius * 0.3,
          pos.y - innerRadius * 0.3,
          0,
          pos.x,
          pos.y,
          innerRadius
        );
        const actorColor = getActorColor(actor); // PHASE 1.3: Use mode-based color
        innerGradient.addColorStop(0, actorColor);
        innerGradient.addColorStop(1, actorColor + 'DD');

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, innerRadius, 0, Math.PI * 2);
        ctx.fillStyle = innerGradient;
        ctx.fill();

        // Metric percentage arc (trust or awareness based on mode)
        const arcRadius = nodeRadius * 0.85;
        const startAngle = -Math.PI / 2;
        const metricValue = graphMode === 'awareness' ? (actor.awareness || 0) : actor.trust;
        const endAngle = startAngle + metricValue * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, arcRadius, startAngle, endAngle);
        ctx.strokeStyle = actorColor; // PHASE 1.3: Use mode-based color
        ctx.lineWidth = 4;
        ctx.stroke();

        // Actor name with text wrapping for long names
        const maxNameWidth = nodeRadius * 4;
        const nameFontSize = Math.max(12, nodeRadius * 0.35);
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
        const nameY = pos.y + nodeRadius + 8;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(pos.x - textWidth / 2 - 4, nameY, textWidth + 8, nameFontSize + 6);

        ctx.fillStyle = '#1F2937';
        ctx.fillText(displayName, pos.x, nameY + 2);

        // Metric percentage below name (trust or awareness based on mode)
        if (isSelected || isHovered) {
          const metricFontSize = Math.max(11, nodeRadius * 0.3);
          ctx.font = `${metricFontSize}px Inter, sans-serif`;
          const metricColor = getActorColor(actor); // PHASE 1.3: Mode-based color
          const metricText = `${Math.round(metricValue * 100)}%`;
          const metricWidth = ctx.measureText(metricText).width;

          const metricY = nameY + nameFontSize + 10;
          // Background for metric percentage
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fillRect(pos.x - metricWidth / 2 - 3, metricY, metricWidth + 6, metricFontSize + 4);

          ctx.fillStyle = metricColor; // PHASE 1.3: Mode-based color
          ctx.fillText(metricText, pos.x, metricY + 2);
        }
    });

    // PHASE 1.2: Draw ripple effects
    const now = Date.now();
    ripples.forEach(ripple => {
      const elapsed = now - ripple.startTime;
      const progress = Math.min(1, elapsed / ripple.duration);

      // Easing function (ease-out)
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      const currentRadius = ripple.maxRadius * easedProgress;
      const opacity = (1 - progress) * 0.6; // Fade out

      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, currentRadius, 0, Math.PI * 2);
      ctx.strokeStyle = ripple.color + Math.round(opacity * 255).toString(16).padStart(2, '0');
      ctx.lineWidth = 3;
      ctx.stroke();

      // Inner ripple for depth
      if (progress < 0.7) {
        const innerRadius = currentRadius * 0.7;
        const innerOpacity = opacity * 0.5;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, innerRadius, 0, Math.PI * 2);
        ctx.strokeStyle = ripple.color + Math.round(innerOpacity * 255).toString(16).padStart(2, '0');
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // Restore context after zoom/pan transform
    ctx.restore();

    animationFrameRef.current = requestAnimationFrame(draw);
  }, [actors, connections, selectedActorId, hoveredActorId, targetingMode, validTargets, spatialClusters, showClusters, actorsByCategory, getActorPosition, getNodeRadius, getActorColor, BASE_NODE_RADIUS, CATEGORY_RADIUS, getCategoryPosition, zoom, pan, ripples, graphMode, hoveredConnection]);

  // Transform screen coordinates to canvas coordinates (accounting for zoom/pan)
  const screenToCanvas = useCallback((screenX: number, screenY: number) => {
    return {
      x: (screenX - pan.x) / zoom,
      y: (screenY - pan.y) / zoom,
    };
  }, [zoom, pan]);

  // Find actor at click position - PHASE 1.1: Use tier-based radius
  const findActorAtPosition = useCallback((screenX: number, screenY: number): Actor | null => {
    const { x, y } = screenToCanvas(screenX, screenY);

    for (const actor of actors) {
      const pos = getActorPosition(actor);
      const nodeRadius = getNodeRadius(actor); // PHASE 1.1: Tier-based hit detection
      const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
      if (distance <= nodeRadius * 1.5) {
        return actor;
      }
    }
    return null;
  }, [actors, getActorPosition, getNodeRadius, screenToCanvas]);

  // PHASE 1.4: Find connection near mouse position
  const findConnectionAtPosition = useCallback((screenX: number, screenY: number): Connection | null => {
    const { x, y } = screenToCanvas(screenX, screenY);
    const threshold = 10; // pixels

    for (const conn of connections) {
      const source = actorMap.get(conn.sourceId);
      const target = actorMap.get(conn.targetId);
      if (!source || !target) continue;

      const sourcePos = getActorPosition(source);
      const targetPos = getActorPosition(target);

      // Calculate distance from point to line segment
      const lineLength = Math.sqrt(
        Math.pow(targetPos.x - sourcePos.x, 2) + Math.pow(targetPos.y - sourcePos.y, 2)
      );

      if (lineLength === 0) continue;

      // Calculate the perpendicular distance from the point to the line
      const t = Math.max(0, Math.min(1,
        ((x - sourcePos.x) * (targetPos.x - sourcePos.x) + (y - sourcePos.y) * (targetPos.y - sourcePos.y)) / (lineLength * lineLength)
      ));

      const projectionX = sourcePos.x + t * (targetPos.x - sourcePos.x);
      const projectionY = sourcePos.y + t * (targetPos.y - sourcePos.y);

      const distance = Math.sqrt(
        Math.pow(x - projectionX, 2) + Math.pow(y - projectionY, 2)
      );

      if (distance <= threshold) {
        return conn;
      }
    }

    return null;
  }, [connections, actorMap, getActorPosition, screenToCanvas]);

  // Event handlers
  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const actor = findActorAtPosition(x, y);
    if (actor) {
      // PHASE 1.2: Create ripple effect on click
      const pos = getActorPosition(actor);
      const canvasX = pos.x * zoom + pan.x;
      const canvasY = pos.y * zoom + pan.y;
      const nodeRadius = getNodeRadius(actor);
      createRipple(pos.x, pos.y, getCategoryColor(actor.category), nodeRadius * 3);

      onActorClick(actor.id);
    }
  }, [findActorAtPosition, onActorClick, getActorPosition, getNodeRadius, createRipple, zoom, pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Handle panning
    if (isPanning) {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      setPan(prevPan => ({
        x: prevPan.x + dx,
        y: prevPan.y + dy,
      }));
      setPanStart({ x: e.clientX, y: e.clientY });
      return; // Don't update tooltip while panning
    }

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const actor = findActorAtPosition(x, y);
    onActorHover(actor?.id || null);

    // PHASE 1.4: Check for connection hover if no actor found
    if (!actor) {
      const connection = findConnectionAtPosition(x, y);
      if (connection) {
        setHoveredConnection(connection);
        setConnectionTooltipPos({ x: e.clientX, y: e.clientY });
        canvas.style.cursor = 'pointer';
      } else {
        setHoveredConnection(null);
        setConnectionTooltipPos(null);
        canvas.style.cursor = 'default';
      }
    } else {
      setHoveredConnection(null);
      setConnectionTooltipPos(null);
    }

    // Update tooltip
    if (actor) {
      setHoveredActor(actor);
      setTooltipPosition({ x: e.clientX, y: e.clientY });
    } else {
      setHoveredActor(null);
      setTooltipPosition(null);
    }
  }, [findActorAtPosition, findConnectionAtPosition, onActorHover, isPanning, panStart]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    // Start panning on right-click (button 2), middle mouse (button 1), or space+left click
    if (e.button === 2 || e.button === 1) {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    // Smooth zoom factor based on best practices
    const zoomFactor = e.deltaY > 0 ? 0.95 : 1.05;
    setZoom(prevZoom => Math.max(0.5, Math.min(3, prevZoom * zoomFactor)));
  }, []);

  // Touch support for pinch-to-zoom
  const [touchStart, setTouchStart] = useState<{ dist: number; zoom: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );
      setTouchStart({ dist, zoom });
    } else if (e.touches.length === 1) {
      // Single touch for panning
      const touch = e.touches[0];
      setIsPanning(true);
      setPanStart({ x: touch.clientX, y: touch.clientY });
    }
  }, [zoom]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();

    if (e.touches.length === 2 && touchStart) {
      // Pinch-to-zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );
      const scale = dist / touchStart.dist;
      const newZoom = touchStart.zoom * scale;
      setZoom(Math.max(0.5, Math.min(3, newZoom)));
    } else if (e.touches.length === 1 && isPanning) {
      // Pan with single touch
      const touch = e.touches[0];
      const dx = touch.clientX - panStart.x;
      const dy = touch.clientY - panStart.y;
      setPan(prevPan => ({
        x: prevPan.x + dx,
        y: prevPan.y + dy,
      }));
      setPanStart({ x: touch.clientX, y: touch.clientY });
    }
  }, [touchStart, isPanning, panStart]);

  const handleTouchEnd = useCallback(() => {
    setTouchStart(null);
    setIsPanning(false);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return; // Don't interfere with input fields
      }

      switch (e.key) {
        case '+':
        case '=':
          e.preventDefault();
          setZoom(prev => Math.min(3, prev * 1.2));
          break;
        case '-':
        case '_':
          e.preventDefault();
          setZoom(prev => Math.max(0.5, prev / 1.2));
          break;
        case '0':
          e.preventDefault();
          setZoom(1);
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          setZoom(1);
          setPan({ x: 0, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
        className={isPanning ? "absolute inset-0 cursor-grabbing" : "absolute inset-0 cursor-pointer"}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()} // Prevent context menu on right-click
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseLeave={() => {
          onActorHover(null);
          setHoveredActor(null);
          setTooltipPosition(null);
          setIsPanning(false);
        }}
      />

      {/* Zoom Controls - positioned on left side to avoid HUD overlap */}
      <div className="absolute bottom-20 left-4 flex flex-col gap-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2">
        <button
          onClick={() => setZoom(prev => Math.min(3, prev * 1.2))}
          className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-bold text-lg transition-colors"
          title="Zoom In (+, Scroll Up)"
        >
          +
        </button>
        <button
          onClick={() => setZoom(1)}
          className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded text-gray-700 text-xs font-semibold transition-colors"
          title="Reset Zoom (0)"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          onClick={() => setZoom(prev => Math.max(0.5, prev / 1.2))}
          className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-bold text-lg transition-colors"
          title="Zoom Out (-, Scroll Down)"
        >
          −
        </button>
        <button
          onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
          className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded text-gray-700 text-xs transition-colors"
          title="Reset View (R)"
        >
          ⟲
        </button>
        <div className="h-6 w-px bg-gray-300"></div>
        <button
          onClick={() => setShowClusters(!showClusters)}
          className={cn(
            "w-8 h-8 flex items-center justify-center rounded text-xs transition-colors",
            showClusters
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          )}
          title={showClusters ? "Hide Clusters (C)" : "Show Clusters (C)"}
        >
          ◉
        </button>
      </div>

      {/* Legend - positioned at bottom right */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2.5 text-xs max-w-[160px]">
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

      {/* PHASE 1.4: Connection Tooltip */}
      {hoveredConnection && connectionTooltipPos && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: connectionTooltipPos.x + 15,
            top: connectionTooltipPos.y + 15,
          }}
        >
          <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl max-w-[250px]">
            <div className="font-bold mb-1.5">Connection Details</div>
            <div className="space-y-0.5 text-[11px]">
              <div className="text-gray-300">
                <span className="font-semibold text-blue-400">{actorMap.get(hoveredConnection.sourceId)?.name}</span>
                {' → '}
                <span className="font-semibold text-purple-400">{actorMap.get(hoveredConnection.targetId)?.name}</span>
              </div>
              <div className="mt-1.5 pt-1.5 border-t border-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-400">Strength:</span>
                  <span className="font-semibold text-green-400">{Math.round(hoveredConnection.strength * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span className="font-semibold capitalize">{hoveredConnection.type}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// PHASE 5: Performance - Wrap with React.memo to prevent unnecessary re-renders
export default memo(NetworkVisualization, (prevProps, nextProps) => {
  // Custom comparison function for performance
  return (
    prevProps.actors === nextProps.actors &&
    prevProps.connections === nextProps.connections &&
    prevProps.selectedActorId === nextProps.selectedActorId &&
    prevProps.hoveredActorId === nextProps.hoveredActorId &&
    prevProps.targetingMode === nextProps.targetingMode &&
    prevProps.validTargets === nextProps.validTargets
  );
});
