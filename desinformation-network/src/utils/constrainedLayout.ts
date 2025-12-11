/**
 * Constrained Layout Utilities (Phase 2 - Optimized)
 *
 * Ensures actors are evenly distributed within their category circles.
 * Uses ring-based distribution for optimal spacing and readability.
 */

// ============================================
// TYPES
// ============================================

export interface CategoryConstraint {
  center: { x: number; y: number };
  radius: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface ActorLayoutInfo {
  id: string;
  category: string;
  index: number; // Index within category
}

// ============================================
// CATEGORY LAYOUT CONFIGURATION
// ============================================

/**
 * Relative positions (0-1 range) for each category.
 * Optimized for 4 corners + center layout with more spacing.
 */
export const CATEGORY_LAYOUT: Record<string, { rx: number; ry: number }> = {
  media: { rx: 0.22, ry: 0.28 },
  expert: { rx: 0.78, ry: 0.28 },
  lobby: { rx: 0.22, ry: 0.72 },
  organization: { rx: 0.78, ry: 0.72 },
  defensive: { rx: 0.5, ry: 0.5 }, // Center
};

/**
 * Category radius as percentage of the smaller canvas dimension.
 * INCREASED from 15% to 22% for better actor spacing.
 */
export const CATEGORY_RADIUS_PERCENT = 0.22; // 22% - larger circles

// ============================================
// RING-BASED DISTRIBUTION
// ============================================

/**
 * Configuration for ring-based actor distribution.
 * Optimized for readability and minimal overlap.
 */
const RING_CONFIG = {
  centerCount: 1,        // 1 actor in center (if any)
  innerRingCount: 6,     // 6 actors in first ring
  middleRingCount: 10,   // 10 actors in second ring
  outerRingCount: 14,    // 14 actors in third ring

  centerRadius: 0.0,     // Center position
  innerRadius: 0.35,     // 35% of category radius
  middleRadius: 0.60,    // 60% of category radius
  outerRadius: 0.85,     // 85% of category radius
};

/**
 * Calculate position for an actor based on their index within the category.
 * Uses ring-based distribution for even spacing.
 */
export function calculateRingPosition(
  actorIndex: number,
  totalInCategory: number,
  constraint: CategoryConstraint
): Position {
  const { center, radius } = constraint;

  // For single actor, place in center
  if (totalInCategory === 1) {
    return center;
  }

  // For 2-3 actors, place in small triangle/line near center
  if (totalInCategory <= 3) {
    const angle = (actorIndex / totalInCategory) * Math.PI * 2 - Math.PI / 2;
    const dist = radius * 0.3;
    return {
      x: center.x + Math.cos(angle) * dist,
      y: center.y + Math.sin(angle) * dist,
    };
  }

  // For more actors, use ring distribution
  let remaining = actorIndex;
  let ringIndex = 0;

  // Ring capacities (center, inner, middle, outer, extra outer...)
  const rings = [
    { count: 1, radius: 0 },
    { count: Math.min(6, Math.ceil(totalInCategory * 0.2)), radius: 0.35 },
    { count: Math.min(10, Math.ceil(totalInCategory * 0.35)), radius: 0.58 },
    { count: Math.min(14, Math.ceil(totalInCategory * 0.35)), radius: 0.80 },
  ];

  // Find which ring this actor belongs to
  for (let i = 0; i < rings.length; i++) {
    if (remaining < rings[i].count) {
      ringIndex = i;
      break;
    }
    remaining -= rings[i].count;
    ringIndex = i + 1;
  }

  // If we're past defined rings, add to outer ring
  if (ringIndex >= rings.length) {
    ringIndex = rings.length - 1;
    remaining = actorIndex - (rings.slice(0, -1).reduce((s, r) => s + r.count, 0));
  }

  const ring = rings[ringIndex];
  const ringRadius = radius * ring.radius;

  // Calculate angle with offset per ring to avoid alignment
  const actorsInRing = ring.count;
  const angleOffset = ringIndex * (Math.PI / 6); // Rotate each ring
  const angle = angleOffset + (remaining / actorsInRing) * Math.PI * 2 - Math.PI / 2;

  return {
    x: center.x + Math.cos(angle) * ringRadius,
    y: center.y + Math.sin(angle) * ringRadius,
  };
}

// ============================================
// CONSTRAINT FUNCTIONS
// ============================================

/**
 * Get the constraint (center and radius) for a category based on canvas size.
 */
export function getCategoryConstraint(
  category: string,
  canvasWidth: number,
  canvasHeight: number
): CategoryConstraint {
  const layout = CATEGORY_LAYOUT[category] || { rx: 0.5, ry: 0.5 };
  const radius = Math.min(canvasWidth, canvasHeight) * CATEGORY_RADIUS_PERCENT;

  return {
    center: {
      x: layout.rx * canvasWidth,
      y: layout.ry * canvasHeight,
    },
    radius,
  };
}

/**
 * Get constrained position for an actor.
 *
 * NEW APPROACH: Instead of just constraining the force-layout position,
 * we calculate a deterministic ring-based position using the actor's
 * index within their category.
 */
export function getConstrainedActorPosition(
  actorPosition: Position,
  category: string,
  canvasWidth: number,
  canvasHeight: number,
  actorIndex: number = 0,
  totalInCategory: number = 1
): Position {
  const constraint = getCategoryConstraint(category, canvasWidth, canvasHeight);

  // Use ring-based distribution for deterministic, even spacing
  return calculateRingPosition(actorIndex, totalInCategory, constraint);
}

/**
 * Legacy constraint function - just projects to circle edge.
 * Kept for reference but not recommended.
 */
export function constrainPositionToCategory(
  position: Position,
  constraint: CategoryConstraint,
  padding: number = 0.85
): Position {
  const dx = position.x - constraint.center.x;
  const dy = position.y - constraint.center.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const maxDistance = constraint.radius * padding;

  if (distance <= maxDistance) {
    return position;
  }

  const scale = maxDistance / distance;
  return {
    x: constraint.center.x + dx * scale,
    y: constraint.center.y + dy * scale,
  };
}

// ============================================
// ZOOM-BASED SCALING (Google Maps Style)
// ============================================

/**
 * Level of Detail configuration for different zoom levels.
 * Inspired by how Google Maps shows more detail as you zoom in.
 */
export interface ZoomLevelConfig {
  nodeScale: number;      // Multiplier for node size
  showLabels: boolean;    // Whether to show actor names
  showStats: boolean;     // Whether to show trust % on node
  labelFontSize: number;  // Font size multiplier
  connectionWidth: number; // Connection line width multiplier
}

/**
 * Get rendering configuration based on zoom level.
 * Higher zoom = more detail, larger nodes.
 */
export function getZoomLevelConfig(zoom: number): ZoomLevelConfig {
  if (zoom < 0.7) {
    // Zoomed out - minimal detail
    return {
      nodeScale: 0.7,
      showLabels: false,
      showStats: false,
      labelFontSize: 0.8,
      connectionWidth: 0.5,
    };
  } else if (zoom < 1.0) {
    // Default zoom - normal detail
    return {
      nodeScale: 0.85,
      showLabels: true,
      showStats: false,
      labelFontSize: 0.9,
      connectionWidth: 0.8,
    };
  } else if (zoom < 1.5) {
    // Slightly zoomed - full detail
    return {
      nodeScale: 1.0,
      showLabels: true,
      showStats: true,
      labelFontSize: 1.0,
      connectionWidth: 1.0,
    };
  } else if (zoom < 2.0) {
    // Zoomed in - larger nodes
    return {
      nodeScale: 1.15,
      showLabels: true,
      showStats: true,
      labelFontSize: 1.1,
      connectionWidth: 1.2,
    };
  } else {
    // Very zoomed - maximum detail
    return {
      nodeScale: 1.3,
      showLabels: true,
      showStats: true,
      labelFontSize: 1.2,
      connectionWidth: 1.5,
    };
  }
}

/**
 * Calculate node radius based on base radius and zoom level.
 */
export function getZoomAdjustedNodeRadius(
  baseRadius: number,
  zoom: number
): number {
  const config = getZoomLevelConfig(zoom);
  return baseRadius * config.nodeScale;
}
