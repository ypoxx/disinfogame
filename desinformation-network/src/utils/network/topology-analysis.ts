/**
 * Network Topology Analysis
 *
 * Analyzes network structure to identify key actors, bottlenecks, and
 * critical paths. Used for strategic gameplay and AI decision-making.
 */

import type { Actor, Connection, NetworkTopology } from '@/game-logic/types';

// ============================================
// TYPES
// ============================================

export interface CentralityScores {
  degree: number;
  betweenness: number;
  closeness: number;
  eigenvector: number;
}

export interface BottleneckAnalysis {
  actorId: string;
  importance: number; // 0-1, higher = more critical
  connectsComponents: boolean;
  bridgeConnections: number;
}

// ============================================
// CENTRALITY CALCULATIONS
// ============================================

/**
 * Calculate degree centrality for all actors
 * Measures how many connections an actor has (normalized)
 */
export function calculateDegreeCentrality(
  actors: Actor[],
  connections: Connection[]
): Map<string, number> {
  const degrees = new Map<string, number>();
  const maxDegree = actors.length - 1;

  // Initialize
  actors.forEach(a => degrees.set(a.id, 0));

  // Count connections
  connections.forEach(conn => {
    degrees.set(conn.sourceId, (degrees.get(conn.sourceId) || 0) + 1);
    degrees.set(conn.targetId, (degrees.get(conn.targetId) || 0) + 1);
  });

  // Normalize
  degrees.forEach((degree, actorId) => {
    degrees.set(actorId, maxDegree > 0 ? degree / maxDegree : 0);
  });

  return degrees;
}

/**
 * Calculate betweenness centrality using Brandes' algorithm
 * Measures how often an actor lies on shortest paths between other actors
 */
export function calculateBetweennessCentrality(
  actors: Actor[],
  connections: Connection[]
): Map<string, number> {
  const betweenness = new Map<string, number>();
  actors.forEach(a => betweenness.set(a.id, 0));

  // Build adjacency list
  const adjacency = buildAdjacencyList(actors, connections);

  // For each source actor
  for (const source of actors) {
    const stack: string[] = [];
    const paths = new Map<string, string[][]>();
    const distances = new Map<string, number>();
    const sigma = new Map<string, number>();

    actors.forEach(a => {
      paths.set(a.id, []);
      distances.set(a.id, -1);
      sigma.set(a.id, 0);
    });

    distances.set(source.id, 0);
    sigma.set(source.id, 1);

    const queue: string[] = [source.id];

    // BFS
    while (queue.length > 0) {
      const v = queue.shift()!;
      stack.push(v);

      const neighbors = adjacency.get(v) || [];
      for (const w of neighbors) {
        // First visit to w?
        if (distances.get(w)! < 0) {
          queue.push(w);
          distances.set(w, distances.get(v)! + 1);
        }

        // Shortest path to w via v?
        if (distances.get(w) === distances.get(v)! + 1) {
          sigma.set(w, sigma.get(w)! + sigma.get(v)!);
          const wPaths = paths.get(w)!;
          const vPaths = paths.get(v)!;
          if (vPaths.length === 0) {
            wPaths.push([v]);
          } else {
            vPaths.forEach(path => {
              wPaths.push([...path, v]);
            });
          }
        }
      }
    }

    // Accumulation
    const delta = new Map<string, number>();
    actors.forEach(a => delta.set(a.id, 0));

    while (stack.length > 0) {
      const w = stack.pop()!;
      const wPaths = paths.get(w)!;

      wPaths.forEach(path => {
        path.forEach(v => {
          if (v !== source.id) {
            const fraction = sigma.get(v)! / sigma.get(w)!;
            delta.set(v, delta.get(v)! + fraction * (1 + delta.get(w)!));
          }
        });
      });

      if (w !== source.id) {
        betweenness.set(w, betweenness.get(w)! + delta.get(w)!);
      }
    }
  }

  // Normalize
  const n = actors.length;
  const normalization = n > 2 ? (n - 1) * (n - 2) : 1;
  betweenness.forEach((value, actorId) => {
    betweenness.set(actorId, value / normalization);
  });

  return betweenness;
}

/**
 * Calculate closeness centrality
 * Measures average distance to all other actors (inverse)
 */
export function calculateClosenessCentrality(
  actors: Actor[],
  connections: Connection[]
): Map<string, number> {
  const closeness = new Map<string, number>();
  const adjacency = buildAdjacencyList(actors, connections);

  for (const source of actors) {
    const distances = dijkstra(source.id, actors, adjacency);
    const totalDistance = Array.from(distances.values()).reduce((sum, d) => sum + d, 0);

    if (totalDistance > 0) {
      const avgDistance = totalDistance / (actors.length - 1);
      closeness.set(source.id, 1 / avgDistance);
    } else {
      closeness.set(source.id, 0);
    }
  }

  // Normalize
  const maxCloseness = Math.max(...Array.from(closeness.values()));
  if (maxCloseness > 0) {
    closeness.forEach((value, actorId) => {
      closeness.set(actorId, value / maxCloseness);
    });
  }

  return closeness;
}

/**
 * Calculate all centrality scores for all actors
 */
export function calculateAllCentralities(
  actors: Actor[],
  connections: Connection[]
): Map<string, CentralityScores> {
  const degree = calculateDegreeCentrality(actors, connections);
  const betweenness = calculateBetweennessCentrality(actors, connections);
  const closeness = calculateClosenessCentrality(actors, connections);

  const scores = new Map<string, CentralityScores>();

  actors.forEach(actor => {
    scores.set(actor.id, {
      degree: degree.get(actor.id) || 0,
      betweenness: betweenness.get(actor.id) || 0,
      closeness: closeness.get(actor.id) || 0,
      eigenvector: 0, // Simplified - would require iterative calculation
    });
  });

  return scores;
}

// ============================================
// BOTTLENECK DETECTION
// ============================================

/**
 * Detect bottleneck actors in the network
 * Actors whose removal would significantly fragment the network
 */
export function detectBottlenecks(
  actors: Actor[],
  connections: Connection[]
): BottleneckAnalysis[] {
  const bottlenecks: BottleneckAnalysis[] = [];
  const adjacency = buildAdjacencyList(actors, connections);

  // Calculate baseline connectivity
  const baselineComponents = countConnectedComponents(actors, connections);

  for (const actor of actors) {
    // Simulate removing this actor
    const remainingActors = actors.filter(a => a.id !== actor.id);
    const remainingConnections = connections.filter(
      c => c.sourceId !== actor.id && c.targetId !== actor.id
    );

    // Count components after removal
    const componentsAfterRemoval = countConnectedComponents(
      remainingActors,
      remainingConnections
    );

    // Check if this actor is a bridge
    const bridgeConnections = countBridgeConnections(actor.id, connections, adjacency);

    const importance =
      (componentsAfterRemoval - baselineComponents) / Math.max(baselineComponents, 1) +
      bridgeConnections * 0.1;

    if (importance > 0 || bridgeConnections > 0) {
      bottlenecks.push({
        actorId: actor.id,
        importance: Math.min(importance, 1),
        connectsComponents: componentsAfterRemoval > baselineComponents,
        bridgeConnections,
      });
    }
  }

  // Sort by importance
  bottlenecks.sort((a, b) => b.importance - a.importance);

  return bottlenecks;
}

/**
 * Count number of connected components in the graph
 */
function countConnectedComponents(
  actors: Actor[],
  connections: Connection[]
): number {
  const visited = new Set<string>();
  let components = 0;

  const adjacency = buildAdjacencyList(actors, connections);

  for (const actor of actors) {
    if (!visited.has(actor.id)) {
      components++;
      dfsVisit(actor.id, adjacency, visited);
    }
  }

  return components;
}

/**
 * DFS visit for component detection
 */
function dfsVisit(
  actorId: string,
  adjacency: Map<string, string[]>,
  visited: Set<string>
): void {
  visited.add(actorId);
  const neighbors = adjacency.get(actorId) || [];

  for (const neighbor of neighbors) {
    if (!visited.has(neighbor)) {
      dfsVisit(neighbor, adjacency, visited);
    }
  }
}

/**
 * Count bridge connections for an actor
 * Connections that, if removed, would increase number of components
 */
function countBridgeConnections(
  actorId: string,
  connections: Connection[],
  adjacency: Map<string, string[]>
): number {
  const actorConnections = connections.filter(
    c => c.sourceId === actorId || c.targetId === actorId
  );

  return actorConnections.length;
}

// ============================================
// NETWORK TOPOLOGY ANALYSIS
// ============================================

/**
 * Perform complete network topology analysis
 */
export function analyzeNetworkTopology(
  actors: Actor[],
  connections: Connection[]
): NetworkTopology {
  const centralities = calculateAllCentralities(actors, connections);
  const bottlenecks = detectBottlenecks(actors, connections);

  return {
    centralities,
    bottlenecks,
    analyzedAt: Date.now(),
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Build adjacency list from connections
 */
function buildAdjacencyList(
  actors: Actor[],
  connections: Connection[]
): Map<string, string[]> {
  const adjacency = new Map<string, string[]>();

  actors.forEach(a => adjacency.set(a.id, []));

  connections.forEach(conn => {
    adjacency.get(conn.sourceId)?.push(conn.targetId);
    adjacency.get(conn.targetId)?.push(conn.sourceId);
  });

  return adjacency;
}

/**
 * Dijkstra's algorithm for shortest paths
 */
function dijkstra(
  sourceId: string,
  actors: Actor[],
  adjacency: Map<string, string[]>
): Map<string, number> {
  const distances = new Map<string, number>();
  const visited = new Set<string>();
  const queue: Array<{ id: string; distance: number }> = [];

  actors.forEach(a => distances.set(a.id, Infinity));
  distances.set(sourceId, 0);
  queue.push({ id: sourceId, distance: 0 });

  while (queue.length > 0) {
    queue.sort((a, b) => a.distance - b.distance);
    const current = queue.shift()!;

    if (visited.has(current.id)) continue;
    visited.add(current.id);

    const neighbors = adjacency.get(current.id) || [];
    for (const neighborId of neighbors) {
      if (visited.has(neighborId)) continue;

      const newDistance = distances.get(current.id)! + 1;
      if (newDistance < distances.get(neighborId)!) {
        distances.set(neighborId, newDistance);
        queue.push({ id: neighborId, distance: newDistance });
      }
    }
  }

  return distances;
}

// ============================================
// GAMEPLAY UTILITIES
// ============================================

/**
 * Get top N most central actors
 */
export function getTopCentralActors(
  topology: NetworkTopology,
  n: number = 5
): Array<{ actorId: string; score: number }> {
  const scores: Array<{ actorId: string; score: number }> = [];

  topology.centralities.forEach((centrality, actorId) => {
    // Composite score (weighted average)
    const score =
      centrality.degree * 0.3 +
      centrality.betweenness * 0.4 +
      centrality.closeness * 0.3;

    scores.push({ actorId, score });
  });

  scores.sort((a, b) => b.score - a.score);
  return scores.slice(0, n);
}

/**
 * Get actors that are critical bottlenecks
 */
export function getCriticalBottlenecks(
  topology: NetworkTopology,
  threshold: number = 0.5
): BottleneckAnalysis[] {
  return topology.bottlenecks.filter(b => b.importance >= threshold);
}

/**
 * Calculate network fragility
 * How vulnerable the network is to actor removal
 */
export function calculateNetworkFragility(topology: NetworkTopology): number {
  if (topology.bottlenecks.length === 0) return 0;

  const topBottlenecks = topology.bottlenecks.slice(0, 5);
  const avgImportance =
    topBottlenecks.reduce((sum, b) => sum + b.importance, 0) / topBottlenecks.length;

  return avgImportance;
}
