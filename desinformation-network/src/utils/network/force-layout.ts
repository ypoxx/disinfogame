/**
 * Force-Directed Graph Layout
 *
 * Automatically positions actors in a visually pleasing network layout.
 * Based on physics simulation with multiple forces:
 * - Repulsion: Actors push each other away (prevents overlap)
 * - Attraction: Connected actors pull together
 * - Centering: Keeps network centered in canvas
 * - Category Clustering: Same-category actors group together
 *
 * Essential for 60+ actors where manual positioning is impractical.
 */

import type { Actor, Connection, Position } from '@/game-logic/types';
import { euclideanDistance, clamp, groupBy } from '@/utils';

// ============================================
// FORCE SIMULATION
// ============================================

export interface ForceSimulationConfig {
  width: number;
  height: number;
  iterations?: number;            // Number of simulation steps (default: 300)

  // Force strengths (tune these for different layouts)
  repulsionStrength?: number;     // How strongly actors repel (default: 1000)
  attractionStrength?: number;    // How strongly connections attract (default: 0.01)
  centeringStrength?: number;     // Pull toward center (default: 0.01)
  categoryClusterStrength?: number; // Same-category grouping (default: 0.005)

  // Damping
  damping?: number;               // Velocity damping per iteration (default: 0.9)

  // Optional constraints
  pinTier1?: boolean;             // Pin Tier 1 actors in place (default: false)
  boundaryPadding?: number;       // Keep actors away from edges (default: 50)
}

export interface SimulationResult {
  actors: Actor[];
  iterations: number;
  finalEnergy: number;  // Total kinetic energy (lower = more stable)
}

/**
 * Run force-directed layout simulation
 * Returns actors with updated positions
 */
export function calculateForceLayout(
  actors: Actor[],
  connections: Connection[],
  config: ForceSimulationConfig
): SimulationResult {
  const {
    width,
    height,
    iterations = 300,
    repulsionStrength = 1000,
    attractionStrength = 0.01,
    centeringStrength = 0.01,
    categoryClusterStrength = 0.005,
    damping = 0.9,
    pinTier1 = false,
    boundaryPadding = 50,
  } = config;

  // Clone actors to avoid mutating originals
  let nodes = actors.map(actor => ({
    ...actor,
    // Initialize velocity if not present
    velocity: actor.velocity || { x: 0, y: 0 },
    // Track if this node is pinned
    pinned: pinTier1 && actor.tier === 1,
  }));

  // Run simulation for N iterations
  for (let i = 0; i < iterations; i++) {
    // Calculate progress (0 to 1)
    const progress = i / iterations;

    // Gradually reduce force strength (simulated annealing)
    const temperatur = 1 - progress;

    // Apply all forces
    applyRepulsionForce(nodes, repulsionStrength * temperature);
    applyAttractionForce(nodes, connections, attractionStrength);
    applyCenteringForce(nodes, width / 2, height / 2, centeringStrength);
    applyCategoryClusteringForce(nodes, categoryClusterStrength);

    // Update positions
    nodes = updatePositions(nodes, damping, width, height, boundaryPadding);
  }

  // Calculate final energy (for debugging/monitoring)
  const finalEnergy = calculateKineticEnergy(nodes);

  return {
    actors: nodes.map(n => ({
      ...n,
      velocity: n.velocity,
    })),
    iterations,
    finalEnergy,
  };
}

/**
 * Animated force layout - returns generator for smooth animation
 * Usage:
 *   const sim = animatedForceLayout(actors, connections, config);
 *   for (const step of sim) {
 *     updateActorPositions(step.actors);
 *     await sleep(16); // ~60fps
 *   }
 */
export function* animatedForceLayout(
  actors: Actor[],
  connections: Connection[],
  config: ForceSimulationConfig
): Generator<SimulationResult, SimulationResult, undefined> {
  const {
    width,
    height,
    iterations = 300,
    repulsionStrength = 1000,
    attractionStrength = 0.01,
    centeringStrength = 0.01,
    categoryClusterStrength = 0.005,
    damping = 0.9,
    pinTier1 = false,
    boundaryPadding = 50,
  } = config;

  let nodes = actors.map(actor => ({
    ...actor,
    velocity: actor.velocity || { x: 0, y: 0 },
    pinned: pinTier1 && actor.tier === 1,
  }));

  for (let i = 0; i < iterations; i++) {
    const progress = i / iterations;
    const temperature = 1 - progress;

    applyRepulsionForce(nodes, repulsionStrength * temperature);
    applyAttractionForce(nodes, connections, attractionStrength);
    applyCenteringForce(nodes, width / 2, height / 2, centeringStrength);
    applyCategoryClusteringForce(nodes, categoryClusterStrength);

    nodes = updatePositions(nodes, damping, width, height, boundaryPadding);

    // Yield current state every N iterations for smooth animation
    if (i % 5 === 0 || i === iterations - 1) {
      yield {
        actors: nodes.map(n => ({ ...n })),
        iterations: i + 1,
        finalEnergy: calculateKineticEnergy(nodes),
      };
    }
  }

  return {
    actors: nodes,
    iterations,
    finalEnergy: calculateKineticEnergy(nodes),
  };
}

// ============================================
// FORCE FUNCTIONS
// ============================================

/**
 * Repulsion force: All actors repel each other (prevents overlap)
 * Uses inverse square law: F = k / distance²
 */
function applyRepulsionForce(
  nodes: any[],
  strength: number
): void {
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const node1 = nodes[i];
      const node2 = nodes[j];

      const dx = node2.position.x - node1.position.x;
      const dy = node2.position.y - node1.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy) || 1; // Avoid division by zero

      // Inverse square repulsion
      const force = strength / (distance * distance);
      const fx = (dx / distance) * force;
      const fy = (dy / distance) * force;

      // Apply force (node1 pushed away, node2 pushed away)
      if (!node1.pinned) {
        node1.velocity.x -= fx;
        node1.velocity.y -= fy;
      }
      if (!node2.pinned) {
        node2.velocity.x += fx;
        node2.velocity.y += fy;
      }
    }
  }
}

/**
 * Attraction force: Connected actors pull toward each other
 * Uses Hooke's law: F = k * distance
 */
function applyAttractionForce(
  nodes: any[],
  connections: Connection[],
  strength: number
): void {
  connections.forEach(conn => {
    const source = nodes.find(n => n.id === conn.sourceId);
    const target = nodes.find(n => n.id === conn.targetId);

    if (!source || !target) return;

    const dx = target.position.x - source.position.x;
    const dy = target.position.y - source.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy) || 1;

    // Spring force proportional to distance
    const force = distance * strength * conn.strength;
    const fx = (dx / distance) * force;
    const fy = (dy / distance) * force;

    // Pull nodes together
    if (!source.pinned) {
      source.velocity.x += fx;
      source.velocity.y += fy;
    }
    if (!target.pinned) {
      target.velocity.x -= fx;
      target.velocity.y -= fy;
    }
  });
}

/**
 * Centering force: Pull all actors toward center of canvas
 * Prevents network from drifting off-screen
 */
function applyCenteringForce(
  nodes: any[],
  centerX: number,
  centerY: number,
  strength: number
): void {
  nodes.forEach(node => {
    if (node.pinned) return;

    const dx = centerX - node.position.x;
    const dy = centerY - node.position.y;

    node.velocity.x += dx * strength;
    node.velocity.y += dy * strength;
  });
}

/**
 * Category clustering force: Same-category actors attract
 * Creates visual grouping by actor type
 */
function applyCategoryClusteringForce(
  nodes: any[],
  strength: number
): void {
  // Group nodes by category
  const categoryGroups = groupBy(nodes, 'category');

  Object.entries(categoryGroups).forEach(([category, groupNodes]) => {
    if (groupNodes.length < 2) return;

    // Calculate center of mass for this category
    const centerX = groupNodes.reduce((sum, n) => sum + n.position.x, 0) / groupNodes.length;
    const centerY = groupNodes.reduce((sum, n) => sum + n.position.y, 0) / groupNodes.length;

    // Pull nodes toward category center
    groupNodes.forEach(node => {
      if (node.pinned) return;

      const dx = centerX - node.position.x;
      const dy = centerY - node.position.y;

      node.velocity.x += dx * strength;
      node.velocity.y += dy * strength;
    });
  });
}

/**
 * Update positions based on velocities
 */
function updatePositions(
  nodes: any[],
  damping: number,
  width: number,
  height: number,
  padding: number
): any[] {
  return nodes.map(node => {
    if (node.pinned) return node;

    // Update position
    node.position.x += node.velocity.x;
    node.position.y += node.velocity.y;

    // Apply damping (friction)
    node.velocity.x *= damping;
    node.velocity.y *= damping;

    // Constrain to bounds with padding
    node.position.x = clamp(node.position.x, padding, width - padding);
    node.position.y = clamp(node.position.y, padding, height - padding);

    // If hit boundary, reverse velocity (bounce)
    if (node.position.x <= padding || node.position.x >= width - padding) {
      node.velocity.x *= -0.5;
    }
    if (node.position.y <= padding || node.position.y >= height - padding) {
      node.velocity.y *= -0.5;
    }

    return node;
  });
}

/**
 * Calculate total kinetic energy of system
 * Lower energy = more stable layout
 */
function calculateKineticEnergy(nodes: any[]): number {
  return nodes.reduce((sum, node) => {
    const speed = Math.sqrt(
      node.velocity.x * node.velocity.x +
      node.velocity.y * node.velocity.y
    );
    return sum + speed;
  }, 0);
}

// ============================================
// PRESET CONFIGURATIONS
// ============================================

/**
 * Preset for small networks (< 30 actors)
 */
export const SMALL_NETWORK_CONFIG: Partial<ForceSimulationConfig> = {
  iterations: 200,
  repulsionStrength: 800,
  attractionStrength: 0.015,
  centeringStrength: 0.015,
  categoryClusterStrength: 0.01,
  damping: 0.85,
};

/**
 * Preset for medium networks (30-60 actors)
 */
export const MEDIUM_NETWORK_CONFIG: Partial<ForceSimulationConfig> = {
  iterations: 300,
  repulsionStrength: 1000,
  attractionStrength: 0.01,
  centeringStrength: 0.01,
  categoryClusterStrength: 0.005,
  damping: 0.9,
};

/**
 * Preset for large networks (60+ actors)
 */
export const LARGE_NETWORK_CONFIG: Partial<ForceSimulationConfig> = {
  iterations: 400,
  repulsionStrength: 1200,
  attractionStrength: 0.008,
  centeringStrength: 0.008,
  categoryClusterStrength: 0.003,
  damping: 0.92,
  pinTier1: true, // Pin important actors for stability
};

/**
 * Get recommended config based on actor count
 */
export function getRecommendedConfig(
  actorCount: number,
  width: number,
  height: number
): ForceSimulationConfig {
  const base = actorCount < 30
    ? SMALL_NETWORK_CONFIG
    : actorCount < 60
    ? MEDIUM_NETWORK_CONFIG
    : LARGE_NETWORK_CONFIG;

  return {
    width,
    height,
    ...base,
  } as ForceSimulationConfig;
}

/**
 * Initialize actor positions randomly before running layout
 * Helps avoid local minima in force simulation
 */
export function initializeRandomPositions(
  actors: Actor[],
  width: number,
  height: number,
  padding: number = 100
): Actor[] {
  return actors.map(actor => ({
    ...actor,
    position: {
      x: padding + Math.random() * (width - 2 * padding),
      y: padding + Math.random() * (height - 2 * padding),
    },
    velocity: { x: 0, y: 0 },
  }));
}

/**
 * Initialize positions in a circle (alternative to random)
 * Sometimes produces better initial layout
 */
export function initializeCirclePositions(
  actors: Actor[],
  centerX: number,
  centerY: number,
  radius: number
): Actor[] {
  return actors.map((actor, i) => {
    const angle = (i / actors.length) * 2 * Math.PI;
    return {
      ...actor,
      position: {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      },
      velocity: { x: 0, y: 0 },
    };
  });
}
