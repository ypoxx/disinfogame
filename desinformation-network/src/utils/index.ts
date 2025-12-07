import type { Actor, Connection, Network, NetworkMetrics, Position } from '@/game-logic/types';

// ============================================
// MATH UTILITIES
// ============================================

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Linear interpolation between two values
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * clamp(t, 0, 1);
}

/**
 * Calculate Euclidean distance between two points
 */
export function euclideanDistance(p1: Position, p2: Position): number {
  return Math.sqrt(
    Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
  );
}

/**
 * Normalize a value from one range to another
 */
export function normalize(
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number = 0,
  toMax: number = 1
): number {
  const normalized = (value - fromMin) / (fromMax - fromMin);
  return toMin + normalized * (toMax - toMin);
}

// ============================================
// NETWORK UTILITIES
// ============================================

/**
 * Calculate connections between actors based on influence radius
 */
export function calculateConnections(actors: Actor[]): Connection[] {
  const connections: Connection[] = [];
  
  for (let i = 0; i < actors.length; i++) {
    for (let j = i + 1; j < actors.length; j++) {
      const a1 = actors[i];
      const a2 = actors[j];
      
      const distance = euclideanDistance(a1.position, a2.position);
      const avgRadius = (a1.influenceRadius + a2.influenceRadius) / 2;
      
      if (distance < avgRadius) {
        const strength = 1 - (distance / avgRadius);
        connections.push({
          id: `${a1.id}-${a2.id}`,
          sourceId: a1.id,
          targetId: a2.id,
          strength: clamp(strength, 0, 1),
          trustFlow: strength * 0.1,  // 10% of trust difference flows
        });
      }
    }
  }
  
  return connections;
}

/**
 * Propagate trust through network connections
 * Returns new actors array with updated trust values
 */
export function propagateTrust(actors: Actor[], connections: Connection[]): Actor[] {
  const trustDeltas: Map<string, number> = new Map();
  
  // Initialize deltas to 0
  actors.forEach(a => trustDeltas.set(a.id, 0));
  
  // Calculate trust flow through each connection
  connections.forEach(conn => {
    const source = actors.find(a => a.id === conn.sourceId);
    const target = actors.find(a => a.id === conn.targetId);
    
    if (!source || !target) return;
    
    const trustDiff = source.trust - target.trust;
    const flow = trustDiff * conn.trustFlow;
    
    // Trust flows from higher to lower
    trustDeltas.set(target.id, (trustDeltas.get(target.id) || 0) + flow);
    trustDeltas.set(source.id, (trustDeltas.get(source.id) || 0) - flow);
  });
  
  // Apply deltas
  return actors.map(actor => ({
    ...actor,
    trust: clamp(actor.trust + (trustDeltas.get(actor.id) || 0), 0, 1),
  }));
}

/**
 * Apply trust recovery to actors
 * Actors slowly recover toward their base trust
 */
export function applyRecovery(actors: Actor[]): Actor[] {
  return actors.map(actor => {
    // Only recover if below base trust
    if (actor.trust >= actor.baseTrust) return actor;
    
    // Recovery rate modified by resilience
    const recovery = actor.recoveryRate * (1 + actor.resilience * 0.5);
    
    // Emotional actors recover slower
    const emotionalPenalty = 1 - (actor.emotionalState * 0.3);
    
    const newTrust = Math.min(
      actor.baseTrust,
      actor.trust + recovery * emotionalPenalty
    );
    
    return { ...actor, trust: newTrust };
  });
}

/**
 * Find actor at a given position (for click detection)
 */
export function findActorAtPosition(
  actors: Actor[],
  position: Position,
  tolerance: number = 30
): Actor | null {
  for (const actor of actors) {
    const distance = euclideanDistance(actor.position, position);
    const hitRadius = actor.size / 2 + tolerance;
    
    if (distance <= hitRadius) {
      return actor;
    }
  }
  return null;
}

/**
 * Get actors connected to a specific actor
 */
export function getConnectedActors(
  actorId: string,
  actors: Actor[],
  connections: Connection[]
): Actor[] {
  const connectedIds = new Set<string>();
  
  connections.forEach(conn => {
    if (conn.sourceId === actorId) {
      connectedIds.add(conn.targetId);
    } else if (conn.targetId === actorId) {
      connectedIds.add(conn.sourceId);
    }
  });
  
  return actors.filter(a => connectedIds.has(a.id));
}

/**
 * Calculate network metrics
 */
export function calculateNetworkMetrics(network: Network): NetworkMetrics {
  const { actors, connections } = network;
  const trusts = actors.map(a => a.trust);

  // Handle empty network case
  if (trusts.length === 0) {
    return {
      averageTrust: 0,
      trustVariance: 0,
      polarizationIndex: 0,
      connectionDensity: 0,
      lowTrustCount: 0,
      highTrustCount: 0,
    };
  }

  // Average trust
  const averageTrust = trusts.reduce((a, b) => a + b, 0) / trusts.length;

  // Trust variance
  const variance = trusts.reduce(
    (sum, t) => sum + Math.pow(t - averageTrust, 2),
    0
  ) / trusts.length;

  // Polarization: high variance with clusters at extremes
  const lowTrustCount = trusts.filter(t => t < 0.4).length;
  const highTrustCount = trusts.filter(t => t > 0.7).length;
  const polarizationIndex = (lowTrustCount + highTrustCount) / trusts.length;

  // Connection density
  const maxConnections = (actors.length * (actors.length - 1)) / 2;
  const connectionDensity = maxConnections > 0
    ? connections.length / maxConnections
    : 0;

  return {
    averageTrust,
    trustVariance: variance,
    polarizationIndex,
    connectionDensity,
    lowTrustCount,
    highTrustCount,
  };
}

// ============================================
// ARRAY UTILITIES
// ============================================

/**
 * Shuffle an array (Fisher-Yates)
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Pick random element from array
 */
export function pickRandom<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Group array by key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

// ============================================
// FORMAT UTILITIES
// ============================================

/**
 * Format number as percentage
 */
export function formatPercent(value: number, decimals: number = 0): string {
  if (value === undefined || value === null || isNaN(value)) {
    return '0%';
  }
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format round number as year/quarter
 */
export function formatRound(round: number): string {
  const year = Math.floor(round / 4) + 1;
  const quarter = (round % 4) + 1;
  return `Year ${year}, Q${quarter}`;
}

/**
 * Generate unique ID
 */
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`;
}

// ============================================
// VALIDATION UTILITIES
// ============================================

/**
 * Check if value is within range (0-1)
 */
export function isNormalized(value: number): boolean {
  return value >= 0 && value <= 1;
}

/**
 * Validate actor object
 */
export function isValidActor(actor: unknown): actor is Actor {
  if (!actor || typeof actor !== 'object') return false;
  const a = actor as Record<string, unknown>;
  return (
    typeof a.id === 'string' &&
    typeof a.name === 'string' &&
    typeof a.trust === 'number' &&
    typeof a.resilience === 'number' &&
    isNormalized(a.trust as number) &&
    isNormalized(a.resilience as number)
  );
}

// Re-export cn utility
export { cn } from './cn';
