/**
 * Visual Hierarchy & Level of Detail (LOD) System
 *
 * Controls which actors are rendered and how based on:
 * - Actor tier (1=Core, 2=Secondary, 3=Background)
 * - Zoom level
 * - Viewport bounds
 * - Render priority
 *
 * Essential for maintaining 60fps with 60+ actors
 */

import type { Actor, Connection } from '@/game-logic/types';

// ============================================
// TYPES
// ============================================

export interface RenderOptions {
  zoomLevel: number;               // 0.1 - 3.0 (1.0 = normal)
  showTier1: boolean;              // Show Tier 1 actors
  showTier2: boolean;              // Show Tier 2 actors
  showTier3: boolean;              // Show Tier 3 actors
  showWeakConnections: boolean;    // Show connections with strength < 0.4
  minActorSize: number;            // Don't render actors smaller than this (pixels)
}

export interface ActorRenderInfo {
  actor: Actor;
  shouldRender: boolean;
  size: number;
  opacity: number;
  strokeWidth: number;
  zIndex: number;  // Render order (higher = on top)
}

export interface ConnectionRenderInfo {
  connection: Connection;
  shouldRender: boolean;
  opacity: number;
  strokeWidth: number;
}

// ============================================
// DEFAULT OPTIONS
// ============================================

export const DEFAULT_RENDER_OPTIONS: RenderOptions = {
  zoomLevel: 1.0,
  showTier1: true,
  showTier2: true,
  showTier3: true,
  showWeakConnections: false,
  minActorSize: 10,
};

// ============================================
// ACTOR RENDERING
// ============================================

/**
 * Determine if actor should be rendered
 */
export function shouldRenderActor(
  actor: Actor,
  options: RenderOptions
): boolean {
  // Check tier visibility toggles
  if (actor.tier === 1 && !options.showTier1) return false;
  if (actor.tier === 2 && !options.showTier2) return false;
  if (actor.tier === 3 && !options.showTier3) return false;

  // Always show Tier 1
  if (actor.tier === 1) return true;

  // Tier 2: Show if zoomed in or high priority
  if (actor.tier === 2) {
    return options.zoomLevel > 0.8 || actor.renderPriority >= 7;
  }

  // Tier 3: Only when zoomed in significantly
  if (actor.tier === 3) {
    return options.zoomLevel > 1.2 && actor.renderPriority >= 5;
  }

  return true;
}

/**
 * Get visual properties for actor based on tier and zoom
 */
export function getActorRenderInfo(
  actor: Actor,
  options: RenderOptions
): ActorRenderInfo {
  const shouldRender = shouldRenderActor(actor, options);

  // Base properties
  const baseSize = actor.size || 50;
  const baseOpacity = 1.0;

  // Tier-based scaling
  let sizeMultiplier = 1.0;
  let opacity = baseOpacity;
  let zIndex = 0;

  switch (actor.tier) {
    case 1:
      sizeMultiplier = 1.2;
      opacity = 1.0;
      zIndex = 300;  // Always on top
      break;
    case 2:
      sizeMultiplier = 1.0;
      opacity = 0.9;
      zIndex = 200;
      break;
    case 3:
      sizeMultiplier = 0.85;
      opacity = 0.75;
      zIndex = 100;
      break;
  }

  // Zoom-based adjustments
  if (options.zoomLevel < 1.0) {
    // Zoomed out: emphasize important actors
    if (actor.tier === 1) {
      sizeMultiplier *= 1.2;
    } else {
      sizeMultiplier *= 0.85;
      opacity *= 0.8;
    }
  } else if (options.zoomLevel > 1.5) {
    // Zoomed in: show more detail
    sizeMultiplier *= 1.1;
  }

  // Render priority affects opacity
  if (actor.renderPriority < 5) {
    opacity *= 0.9;
  }

  // Calculate final size
  const finalSize = baseSize * sizeMultiplier * options.zoomLevel;

  // Don't render if too small
  if (finalSize < options.minActorSize) {
    return {
      actor,
      shouldRender: false,
      size: finalSize,
      opacity,
      strokeWidth: 0,
      zIndex,
    };
  }

  return {
    actor,
    shouldRender,
    size: finalSize,
    opacity: shouldRender ? opacity : 0,
    strokeWidth: actor.tier === 1 ? 3 : 2,
    zIndex,
  };
}

/**
 * Get render info for all actors, sorted by z-index
 */
export function getActorRenderList(
  actors: Actor[],
  options: RenderOptions
): ActorRenderInfo[] {
  const renderInfos = actors.map(actor => getActorRenderInfo(actor, options));

  // Sort by z-index (render from back to front)
  return renderInfos.sort((a, b) => a.zIndex - b.zIndex);
}

// ============================================
// CONNECTION RENDERING
// ============================================

/**
 * Determine if connection should be rendered
 */
export function shouldRenderConnection(
  connection: Connection,
  sourceRenderInfo: ActorRenderInfo | null,
  targetRenderInfo: ActorRenderInfo | null,
  options: RenderOptions
): boolean {
  // Don't render if either endpoint is not rendered
  if (!sourceRenderInfo?.shouldRender || !targetRenderInfo?.shouldRender) {
    return false;
  }

  // Check if connection itself is marked visible
  if (!connection.visible) return false;

  // Filter weak connections if disabled
  if (!options.showWeakConnections && connection.strength < 0.4) {
    return false;
  }

  // When zoomed out, only show strong connections
  if (options.zoomLevel < 0.8 && connection.strength < 0.6) {
    return false;
  }

  return true;
}

/**
 * Get visual properties for connection
 */
export function getConnectionRenderInfo(
  connection: Connection,
  sourceRenderInfo: ActorRenderInfo | null,
  targetRenderInfo: ActorRenderInfo | null,
  options: RenderOptions
): ConnectionRenderInfo {
  const shouldRender = shouldRenderConnection(
    connection,
    sourceRenderInfo,
    targetRenderInfo,
    options
  );

  // Base opacity from connection strength
  let opacity = connection.strength * 0.6;

  // Reduce opacity for background actors
  if (sourceRenderInfo && targetRenderInfo) {
    const avgOpacity = (sourceRenderInfo.opacity + targetRenderInfo.opacity) / 2;
    opacity *= avgOpacity;
  }

  // Stroke width based on strength
  const strokeWidth = 1 + connection.strength * 2;

  return {
    connection,
    shouldRender,
    opacity: shouldRender ? opacity : 0,
    strokeWidth,
  };
}

/**
 * Get render info for all connections
 */
export function getConnectionRenderList(
  connections: Connection[],
  actorRenderMap: Map<string, ActorRenderInfo>,
  options: RenderOptions
): ConnectionRenderInfo[] {
  return connections
    .map(connection => {
      const sourceInfo = actorRenderMap.get(connection.sourceId) || null;
      const targetInfo = actorRenderMap.get(connection.targetId) || null;

      return getConnectionRenderInfo(connection, sourceInfo, targetInfo, options);
    })
    .filter(info => info.shouldRender);
}

// ============================================
// VIEWPORT CULLING
// ============================================

export interface Viewport {
  centerX: number;
  centerY: number;
  width: number;
  height: number;
  zoom: number;
}

/**
 * Check if actor is within viewport bounds
 */
export function isActorInViewport(
  actor: Actor,
  viewport: Viewport
): boolean {
  const margin = 100; // Extra margin to avoid pop-in

  const minX = viewport.centerX - (viewport.width / 2) / viewport.zoom - margin;
  const maxX = viewport.centerX + (viewport.width / 2) / viewport.zoom + margin;
  const minY = viewport.centerY - (viewport.height / 2) / viewport.zoom - margin;
  const maxY = viewport.centerY + (viewport.height / 2) / viewport.zoom + margin;

  return (
    actor.position.x >= minX &&
    actor.position.x <= maxX &&
    actor.position.y >= minY &&
    actor.position.y <= maxY
  );
}

/**
 * Filter actors to only those in viewport (culling)
 */
export function cullActorsByViewport(
  actors: Actor[],
  viewport: Viewport
): Actor[] {
  return actors.filter(actor => isActorInViewport(actor, viewport));
}

// ============================================
// ADAPTIVE QUALITY
// ============================================

/**
 * Adjust render options based on performance
 * Automatically reduces quality if FPS drops
 */
export function adaptiveRenderOptions(
  baseOptions: RenderOptions,
  fps: number,
  actorCount: number
): RenderOptions {
  const options = { ...baseOptions };

  // If FPS is low (< 45) and many actors, reduce quality
  if (fps < 45 && actorCount > 50) {
    options.showTier3 = false;
    options.showWeakConnections = false;
    options.minActorSize = 15;
  }

  // If FPS is very low (< 30), aggressive reduction
  if (fps < 30 && actorCount > 40) {
    options.showTier2 = options.zoomLevel > 1.0;
    options.showTier3 = false;
    options.showWeakConnections = false;
    options.minActorSize = 20;
  }

  return options;
}

/**
 * Get recommended render options based on actor count
 */
export function getRecommendedRenderOptions(
  actorCount: number,
  zoomLevel: number = 1.0
): RenderOptions {
  if (actorCount <= 30) {
    // Small network: show everything
    return {
      zoomLevel,
      showTier1: true,
      showTier2: true,
      showTier3: true,
      showWeakConnections: true,
      minActorSize: 8,
    };
  }

  if (actorCount <= 50) {
    // Medium network: hide weak connections when zoomed out
    return {
      zoomLevel,
      showTier1: true,
      showTier2: true,
      showTier3: zoomLevel > 1.0,
      showWeakConnections: zoomLevel > 1.2,
      minActorSize: 10,
    };
  }

  // Large network: aggressive LOD
  return {
    zoomLevel,
    showTier1: true,
    showTier2: true,
    showTier3: zoomLevel > 1.3,
    showWeakConnections: false,
    minActorSize: 12,
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Create actor render map for quick lookups
 */
export function createActorRenderMap(
  actors: Actor[],
  options: RenderOptions
): Map<string, ActorRenderInfo> {
  const map = new Map<string, ActorRenderInfo>();

  actors.forEach(actor => {
    const renderInfo = getActorRenderInfo(actor, options);
    map.set(actor.id, renderInfo);
  });

  return map;
}

/**
 * Get statistics about what's being rendered (for debugging/monitoring)
 */
export function getRenderStats(
  actorRenderInfos: ActorRenderInfo[],
  connectionRenderInfos: ConnectionRenderInfo[]
): {
  totalActors: number;
  renderedActors: number;
  culledActors: number;
  totalConnections: number;
  renderedConnections: number;
  culledConnections: number;
} {
  const totalActors = actorRenderInfos.length;
  const renderedActors = actorRenderInfos.filter(a => a.shouldRender).length;

  const totalConnections = connectionRenderInfos.length;
  const renderedConnections = connectionRenderInfos.filter(c => c.shouldRender).length;

  return {
    totalActors,
    renderedActors,
    culledActors: totalActors - renderedActors,
    totalConnections,
    renderedConnections,
    culledConnections: totalConnections - renderedConnections,
  };
}

/**
 * Calculate recommended zoom levels for actor count
 */
export function getRecommendedZoomLevels(actorCount: number): {
  min: number;
  default: number;
  max: number;
} {
  if (actorCount <= 20) {
    return { min: 0.5, default: 1.0, max: 2.0 };
  }

  if (actorCount <= 40) {
    return { min: 0.3, default: 0.8, max: 2.5 };
  }

  // Large network needs more zoom range
  return { min: 0.2, default: 0.6, max: 3.0 };
}
