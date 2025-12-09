/**
 * Spatial Index for Actor Network
 *
 * Grid-based spatial indexing for O(1) nearby actor queries.
 * Essential for performance with 60+ actors.
 *
 * Instead of checking all N actors (O(n)) to find nearby actors,
 * we partition space into a grid and only check actors in nearby cells (O(1)).
 */

import type { Actor, Position } from '@/game-logic/types';
import { euclideanDistance } from '@/utils';

// ============================================
// SPATIAL INDEX
// ============================================

interface GridCell {
  x: number;
  y: number;
  actors: Actor[];
}

export class SpatialIndex {
  private gridSize: number;
  private grid: Map<string, GridCell>;
  private bounds: { width: number; height: number };

  /**
   * Create spatial index
   * @param width Canvas width
   * @param height Canvas height
   * @param gridSize Size of each grid cell (pixels). Larger = fewer cells but more actors per cell
   */
  constructor(width: number, height: number, gridSize: number = 150) {
    this.gridSize = gridSize;
    this.bounds = { width, height };
    this.grid = new Map();
  }

  /**
   * Insert actor into spatial index
   * Call this after actor positions change
   */
  insert(actor: Actor): void {
    const cell = this.getCell(actor.position);
    const key = this.getCellKey(cell.x, cell.y);

    if (!this.grid.has(key)) {
      this.grid.set(key, { x: cell.x, y: cell.y, actors: [] });
    }

    this.grid.get(key)!.actors.push(actor);
  }

  /**
   * Get all actors within radius of position (fast!)
   * This is the main performance optimization: O(1) instead of O(n)
   */
  getNearby(position: Position, radius: number): Actor[] {
    const cells = this.getCellsInRadius(position, radius);
    const nearby: Actor[] = [];

    for (const cell of cells) {
      const key = this.getCellKey(cell.x, cell.y);
      const gridCell = this.grid.get(key);

      if (gridCell) {
        // Add all actors from this cell
        nearby.push(...gridCell.actors);
      }
    }

    // Filter by actual distance (actors might be in cell but outside radius)
    return nearby.filter(actor => {
      const dist = euclideanDistance(position, actor.position);
      return dist <= radius;
    });
  }

  /**
   * Get actor at specific position (for click detection)
   * More efficient than checking all actors
   */
  getAtPosition(position: Position, tolerance: number = 30): Actor | null {
    const nearby = this.getNearby(position, tolerance);

    // Find closest actor within tolerance
    let closest: Actor | null = null;
    let minDist = Infinity;

    for (const actor of nearby) {
      const dist = euclideanDistance(position, actor.position);
      const hitRadius = actor.size / 2 + tolerance;

      if (dist <= hitRadius && dist < minDist) {
        closest = actor;
        minDist = dist;
      }
    }

    return closest;
  }

  /**
   * Rebuild entire spatial index
   * Call this when actor positions change (e.g., after force layout)
   */
  rebuild(actors: Actor[]): void {
    this.grid.clear();
    actors.forEach(actor => this.insert(actor));
  }

  /**
   * Get all actors in a rectangular area
   * Useful for viewport culling (only render visible actors)
   */
  getInRectangle(
    topLeft: Position,
    bottomRight: Position
  ): Actor[] {
    const minCell = this.getCell(topLeft);
    const maxCell = this.getCell(bottomRight);
    const actors: Actor[] = [];

    for (let x = minCell.x; x <= maxCell.x; x++) {
      for (let y = minCell.y; y <= maxCell.y; y++) {
        const key = this.getCellKey(x, y);
        const cell = this.grid.get(key);

        if (cell) {
          // Filter actors actually in rectangle
          const inRect = cell.actors.filter(actor =>
            actor.position.x >= topLeft.x &&
            actor.position.x <= bottomRight.x &&
            actor.position.y >= topLeft.y &&
            actor.position.y <= bottomRight.y
          );
          actors.push(...inRect);
        }
      }
    }

    return actors;
  }

  /**
   * Get all actors in viewport (for rendering optimization)
   */
  getInViewport(
    center: Position,
    viewportWidth: number,
    viewportHeight: number
  ): Actor[] {
    const halfWidth = viewportWidth / 2;
    const halfHeight = viewportHeight / 2;

    return this.getInRectangle(
      { x: center.x - halfWidth, y: center.y - halfHeight },
      { x: center.x + halfWidth, y: center.y + halfHeight }
    );
  }

  /**
   * Clear the spatial index
   */
  clear(): void {
    this.grid.clear();
  }

  /**
   * Get grid statistics (for debugging/monitoring)
   */
  getStats(): {
    totalCells: number;
    occupiedCells: number;
    totalActors: number;
    avgActorsPerCell: number;
    maxActorsInCell: number;
  } {
    const occupiedCells = this.grid.size;
    let totalActors = 0;
    let maxActors = 0;

    this.grid.forEach(cell => {
      const count = cell.actors.length;
      totalActors += count;
      maxActors = Math.max(maxActors, count);
    });

    const totalCells = Math.ceil(this.bounds.width / this.gridSize) *
                       Math.ceil(this.bounds.height / this.gridSize);

    return {
      totalCells,
      occupiedCells,
      totalActors,
      avgActorsPerCell: occupiedCells > 0 ? totalActors / occupiedCells : 0,
      maxActorsInCell: maxActors,
    };
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  /**
   * Get grid cell coordinates for a position
   */
  private getCell(pos: Position): { x: number; y: number } {
    return {
      x: Math.floor(pos.x / this.gridSize),
      y: Math.floor(pos.y / this.gridSize),
    };
  }

  /**
   * Get unique key for grid cell
   */
  private getCellKey(x: number, y: number): string {
    return `${x},${y}`;
  }

  /**
   * Get all grid cells within radius of position
   */
  private getCellsInRadius(
    pos: Position,
    radius: number
  ): Array<{ x: number; y: number }> {
    const cells: Array<{ x: number; y: number }> = [];
    const cellRadius = Math.ceil(radius / this.gridSize);
    const center = this.getCell(pos);

    for (let x = center.x - cellRadius; x <= center.x + cellRadius; x++) {
      for (let y = center.y - cellRadius; y <= center.y + cellRadius; y++) {
        cells.push({ x, y });
      }
    }

    return cells;
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Create spatial index from actors
 * Convenience function
 */
export function createSpatialIndex(
  actors: Actor[],
  width: number,
  height: number,
  gridSize?: number
): SpatialIndex {
  const index = new SpatialIndex(width, height, gridSize);
  index.rebuild(actors);
  return index;
}

/**
 * Find nearest actor to position using spatial index
 */
export function findNearestActor(
  position: Position,
  actors: Actor[],
  spatialIndex: SpatialIndex,
  maxDistance: number = 100
): Actor | null {
  const nearby = spatialIndex.getNearby(position, maxDistance);

  if (nearby.length === 0) return null;

  let nearest: Actor | null = null;
  let minDist = Infinity;

  for (const actor of nearby) {
    const dist = euclideanDistance(position, actor.position);
    if (dist < minDist) {
      nearest = actor;
      minDist = dist;
    }
  }

  return nearest;
}

/**
 * Find all actors within radius using spatial index
 * Faster than filtering all actors
 */
export function findActorsInRadius(
  center: Position,
  radius: number,
  spatialIndex: SpatialIndex
): Actor[] {
  return spatialIndex.getNearby(center, radius);
}

/**
 * Check if any actors are within radius of position
 * Useful for collision detection
 */
export function hasActorsInRadius(
  center: Position,
  radius: number,
  spatialIndex: SpatialIndex,
  minCount: number = 1
): boolean {
  const nearby = spatialIndex.getNearby(center, radius);
  return nearby.length >= minCount;
}
