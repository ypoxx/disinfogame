/**
 * Cluster Detection & Community Analysis
 *
 * Detects communities and clusters in the actor network for visualization.
 * Uses multiple algorithms for robustness.
 */

import type { Actor, Connection, ActorCategory } from '@/game-logic/types';
import type { ActorCluster, Community } from '@/game-logic/types';

// ============================================
// TYPES
// ============================================

export interface ClusterResult {
  clusters: ActorCluster[];
  communities: Community[];
  modularity: number; // Quality metric for clustering
}

// ============================================
// COMMUNITY DETECTION
// ============================================

/**
 * Detect communities using Label Propagation Algorithm
 * Fast and works well for large networks
 */
export function detectCommunities(
  actors: Actor[],
  connections: Connection[]
): Community[] {
  // Build adjacency map
  const adjacency = new Map<string, Set<string>>();
  actors.forEach(a => adjacency.set(a.id, new Set()));

  connections.forEach(conn => {
    adjacency.get(conn.sourceId)?.add(conn.targetId);
    adjacency.get(conn.targetId)?.add(conn.sourceId);
  });

  // Initialize each actor in its own community
  const labels = new Map<string, string>();
  actors.forEach(a => labels.set(a.id, a.id));

  // Iterate until convergence (max 10 iterations)
  let changed = true;
  let iterations = 0;
  const maxIterations = 10;

  while (changed && iterations < maxIterations) {
    changed = false;
    iterations++;

    // Shuffle actors for randomness
    const shuffled = [...actors].sort(() => Math.random() - 0.5);

    for (const actor of shuffled) {
      const neighbors = adjacency.get(actor.id);
      if (!neighbors || neighbors.size === 0) continue;

      // Count label frequencies among neighbors
      const labelCounts = new Map<string, number>();
      neighbors.forEach(neighborId => {
        const label = labels.get(neighborId);
        if (label) {
          labelCounts.set(label, (labelCounts.get(label) || 0) + 1);
        }
      });

      // Find most common label
      let maxCount = 0;
      let maxLabel = labels.get(actor.id)!;
      labelCounts.forEach((count, label) => {
        if (count > maxCount) {
          maxCount = count;
          maxLabel = label;
        }
      });

      // Update label if changed
      if (maxLabel !== labels.get(actor.id)) {
        labels.set(actor.id, maxLabel);
        changed = true;
      }
    }
  }

  // Group actors by community
  const communityMap = new Map<string, string[]>();
  labels.forEach((label, actorId) => {
    if (!communityMap.has(label)) {
      communityMap.set(label, []);
    }
    communityMap.get(label)!.push(actorId);
  });

  // Convert to Community objects
  const communities: Community[] = [];
  communityMap.forEach((memberIds, communityId) => {
    if (memberIds.length > 1) { // Only include communities with 2+ members
      const memberActors = actors.filter(a => memberIds.includes(a.id));
      const dominantCategory = findDominantCategory(memberActors);

      // Determine community type based on dominant category
      let type: Community['type'] = 'mixed';
      if (dominantCategory === 'media') type = 'media_ecosystem';
      else if (dominantCategory === 'expert') type = 'expert_network';
      else if (dominantCategory === 'lobby') type = 'lobby_coalition';

      communities.push({
        id: `community_${communities.length}`,
        type,
        members: memberIds,
        cohesion: calculateCohesion(memberIds, connections),
      });
    }
  });

  return communities;
}

/**
 * Calculate cohesion (internal connection density) of a community
 */
function calculateCohesion(memberIds: string[], connections: Connection[]): number {
  const memberSet = new Set(memberIds);
  const internalConnections = connections.filter(
    conn => memberSet.has(conn.sourceId) && memberSet.has(conn.targetId)
  );

  const maxConnections = (memberIds.length * (memberIds.length - 1)) / 2;
  if (maxConnections === 0) return 0;

  return internalConnections.length / maxConnections;
}

/**
 * Find the most common category in a group of actors
 */
function findDominantCategory(actors: Actor[]): ActorCategory {
  const counts = new Map<ActorCategory, number>();
  actors.forEach(a => {
    counts.set(a.category, (counts.get(a.category) || 0) + 1);
  });

  let maxCategory: ActorCategory = actors[0]?.category || 'media';
  let maxCount = 0;
  counts.forEach((count, category) => {
    if (count > maxCount) {
      maxCount = count;
      maxCategory = category;
    }
  });

  return maxCategory;
}

// ============================================
// SPATIAL CLUSTERING
// ============================================

/**
 * Detect spatial clusters using DBSCAN-like algorithm
 * Groups actors that are physically close together
 */
export function detectSpatialClusters(
  actors: Actor[],
  epsilon: number = 150, // Distance threshold
  minPoints: number = 2   // Minimum points per cluster
): ActorCluster[] {
  const clusters: ActorCluster[] = [];
  const visited = new Set<string>();
  const noise = new Set<string>();

  function getNeighbors(actor: Actor): Actor[] {
    return actors.filter(other => {
      if (other.id === actor.id) return false;
      const dx = actor.position.x - other.position.x;
      const dy = actor.position.y - other.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance <= epsilon;
    });
  }

  function expandCluster(actor: Actor, neighbors: Actor[]): ActorCluster | null {
    if (neighbors.length < minPoints) {
      noise.add(actor.id);
      return null;
    }

    const clusterActors: Actor[] = [actor];
    const clusterQueue = [...neighbors];

    while (clusterQueue.length > 0) {
      const current = clusterQueue.shift()!;
      if (noise.has(current.id)) {
        noise.delete(current.id);
        clusterActors.push(current);
      }

      if (visited.has(current.id)) continue;
      visited.add(current.id);
      clusterActors.push(current);

      const currentNeighbors = getNeighbors(current);
      if (currentNeighbors.length >= minPoints) {
        clusterQueue.push(...currentNeighbors);
      }
    }

    return createCluster(clusterActors);
  }

  // Process each actor
  for (const actor of actors) {
    if (visited.has(actor.id)) continue;
    visited.add(actor.id);

    const neighbors = getNeighbors(actor);
    const cluster = expandCluster(actor, neighbors);

    if (cluster) {
      clusters.push(cluster);
    }
  }

  return clusters;
}

/**
 * Create cluster object from actor list
 */
function createCluster(actors: Actor[]): ActorCluster {
  const centerX = actors.reduce((sum, a) => sum + a.position.x, 0) / actors.length;
  const centerY = actors.reduce((sum, a) => sum + a.position.y, 0) / actors.length;

  const avgTrust = actors.reduce((sum, a) => sum + a.trust, 0) / actors.length;
  const dominantCategory = findDominantCategory(actors);

  // Calculate radius (furthest actor from center)
  const radius = Math.max(
    ...actors.map(a => {
      const dx = a.position.x - centerX;
      const dy = a.position.y - centerY;
      return Math.sqrt(dx * dx + dy * dy);
    })
  );

  // Generate cluster name
  const name = `${dominantCategory} cluster (${actors.length} actors)`;

  return {
    id: `cluster_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    actors: actors.map(a => a.id),
    center: { x: centerX, y: centerY },
    radius: radius + 30, // Add padding
    averageTrust: avgTrust,
  };
}

// ============================================
// COMBINED ANALYSIS
// ============================================

/**
 * Perform complete cluster analysis
 * Combines community detection and spatial clustering
 */
export function analyzeNetworkClusters(
  actors: Actor[],
  connections: Connection[]
): ClusterResult {
  // Detect communities using connection structure
  const communities = detectCommunities(actors, connections);

  // Detect spatial clusters using physical positions
  const clusters = detectSpatialClusters(actors);

  // Calculate modularity (quality metric)
  const modularity = calculateModularity(actors, connections, communities);

  return {
    clusters,
    communities,
    modularity,
  };
}

/**
 * Calculate modularity score for community structure
 * Higher = better community structure (range: -0.5 to 1.0)
 */
function calculateModularity(
  actors: Actor[],
  connections: Connection[],
  communities: Community[]
): number {
  const m = connections.length; // Total edges
  if (m === 0) return 0;

  // Build degree map
  const degrees = new Map<string, number>();
  actors.forEach(a => degrees.set(a.id, 0));
  connections.forEach(conn => {
    degrees.set(conn.sourceId, (degrees.get(conn.sourceId) || 0) + 1);
    degrees.set(conn.targetId, (degrees.get(conn.targetId) || 0) + 1);
  });

  // Build community membership map
  const membership = new Map<string, string>();
  communities.forEach(community => {
    community.members.forEach(id => {
      membership.set(id, community.id);
    });
  });

  // Calculate modularity
  let modularity = 0;
  connections.forEach(conn => {
    const comm1 = membership.get(conn.sourceId);
    const comm2 = membership.get(conn.targetId);

    if (comm1 === comm2 && comm1 !== undefined) {
      const ki = degrees.get(conn.sourceId) || 0;
      const kj = degrees.get(conn.targetId) || 0;
      const expected = (ki * kj) / (2 * m);
      modularity += 1 - expected;
    }
  });

  return modularity / (2 * m);
}

// ============================================
// CLUSTER VISUALIZATION HELPERS
// ============================================

/**
 * Get color for cluster based on dominant category
 */
export function getClusterColor(category: string, alpha: number = 0.2): string {
  const colors: Record<string, string> = {
    media: `rgba(59, 130, 246, ${alpha})`, // Blue
    expert: `rgba(16, 185, 129, ${alpha})`, // Green
    lobby: `rgba(245, 158, 11, ${alpha})`, // Yellow
    organization: `rgba(139, 92, 246, ${alpha})`, // Purple
    infrastructure: `rgba(107, 114, 128, ${alpha})`, // Gray
    defensive: `rgba(239, 68, 68, ${alpha})`, // Red
  };

  return colors[category] || `rgba(156, 163, 175, ${alpha})`;
}

/**
 * Get cluster border color based on trust level
 */
export function getClusterBorderColor(averageTrust: number): string {
  if (averageTrust < 0.3) return 'rgba(239, 68, 68, 0.5)'; // Red - manipulated
  if (averageTrust < 0.5) return 'rgba(245, 158, 11, 0.5)'; // Yellow - concerning
  if (averageTrust < 0.7) return 'rgba(59, 130, 246, 0.5)'; // Blue - moderate
  return 'rgba(16, 185, 129, 0.5)'; // Green - healthy
}
