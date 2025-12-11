/**
 * Constrained Layout Utilities (Phase 2)
 *
 * Ensures actors stay within their category circles visually.
 * The force-directed layout calculates positions freely, but this module
 * constrains those positions to stay within category boundaries.
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

// ============================================
// CATEGORY LAYOUT CONFIGURATION
// ============================================

/**
 * Relative positions (0-1 range) for each category.
 * These define where each category circle is centered on the canvas.
 */
export const CATEGORY_LAYOUT: Record<string, { rx: number; ry: number }> = {
  media: { rx: 0.25, ry: 0.3 },
  expert: { rx: 0.75, ry: 0.3 },
  lobby: { rx: 0.25, ry: 0.7 },
  organization: { rx: 0.75, ry: 0.7 },
  defensive: { rx: 0.5, ry: 0.5 }, // Center
};

/**
 * Category radius as percentage of the smaller canvas dimension.
 * This should match CATEGORY_RADIUS in NetworkVisualization.tsx
 */
export const CATEGORY_RADIUS_PERCENT = 0.15; // 15%

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
 * Constrain a position to stay within a category circle.
 *
 * @param position - The original position from force-directed layout
 * @param constraint - The category constraint (center and radius)
 * @param padding - How much inside the circle to stay (0.85 = 85% of radius)
 * @returns The constrained position
 */
export function constrainPositionToCategory(
  position: Position,
  constraint: CategoryConstraint,
  padding: number = 0.85 // Keep actors 85% inside the radius for visual padding
): Position {
  const dx = position.x - constraint.center.x;
  const dy = position.y - constraint.center.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const maxDistance = constraint.radius * padding;

  // If already inside, return as-is
  if (distance <= maxDistance) {
    return position;
  }

  // Project back onto the circle boundary (with padding)
  const scale = maxDistance / distance;
  return {
    x: constraint.center.x + dx * scale,
    y: constraint.center.y + dy * scale,
  };
}

/**
 * Get a constrained position for an actor based on their category.
 * This is the main function to use in NetworkVisualization.
 */
export function getConstrainedActorPosition(
  actorPosition: Position,
  category: string,
  canvasWidth: number,
  canvasHeight: number
): Position {
  const constraint = getCategoryConstraint(category, canvasWidth, canvasHeight);
  return constrainPositionToCategory(actorPosition, constraint);
}

/**
 * Calculate how far outside their category an actor is.
 * Returns 0 if inside, positive value if outside (as percentage of radius).
 * Useful for visual feedback (e.g., fading actors that would be outside).
 */
export function getOverflowAmount(
  position: Position,
  constraint: CategoryConstraint
): number {
  const dx = position.x - constraint.center.x;
  const dy = position.y - constraint.center.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance <= constraint.radius) {
    return 0;
  }

  return (distance - constraint.radius) / constraint.radius;
}

/**
 * Distribute actors evenly within a category circle.
 * Useful for initial positioning before force-directed layout runs.
 */
export function distributeActorsInCategory(
  actorCount: number,
  constraint: CategoryConstraint,
  startAngle: number = 0
): Position[] {
  const positions: Position[] = [];
  const angleStep = (Math.PI * 2) / actorCount;

  // Use layered rings for many actors
  const maxPerRing = 8;
  const rings = Math.ceil(actorCount / maxPerRing);

  let actorIndex = 0;
  for (let ring = 0; ring < rings && actorIndex < actorCount; ring++) {
    const ringRadius = constraint.radius * (0.3 + (ring * 0.25)); // Start at 30%, expand
    const actorsInRing = Math.min(maxPerRing, actorCount - actorIndex);
    const ringAngleStep = (Math.PI * 2) / actorsInRing;

    for (let i = 0; i < actorsInRing && actorIndex < actorCount; i++) {
      const angle = startAngle + ringAngleStep * i + (ring * Math.PI / 8); // Offset each ring
      positions.push({
        x: constraint.center.x + Math.cos(angle) * ringRadius,
        y: constraint.center.y + Math.sin(angle) * ringRadius,
      });
      actorIndex++;
    }
  }

  return positions;
}
