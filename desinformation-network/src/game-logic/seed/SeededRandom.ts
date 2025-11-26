/**
 * SeededRandom - Deterministic pseudo-random number generator
 * Uses Mulberry32 algorithm for consistency across platforms
 */
export class SeededRandom {
  private seed: number;
  private initialSeed: number;
  
  constructor(seedString: string) {
    this.seed = this.hashString(seedString);
    this.initialSeed = this.seed;
  }
  
  /**
   * Convert string to numeric seed using simple hash
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) || 1; // Ensure non-zero
  }
  
  /**
   * Get next random number between 0 and 1
   * Uses Mulberry32 algorithm
   */
  next(): number {
    let t = this.seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
  
  /**
   * Get random integer between min and max (inclusive)
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
  
  /**
   * Get random float between min and max
   */
  nextFloat(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
  
  /**
   * Get random boolean with given probability of true
   */
  nextBool(probability: number = 0.5): boolean {
    return this.next() < probability;
  }
  
  /**
   * Shuffle an array (Fisher-Yates algorithm)
   */
  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  
  /**
   * Pick random element from array
   */
  pick<T>(array: T[]): T | undefined {
    if (array.length === 0) return undefined;
    return array[this.nextInt(0, array.length - 1)];
  }
  
  /**
   * Pick N random elements from array
   */
  pickN<T>(array: T[], n: number): T[] {
    const shuffled = this.shuffle(array);
    return shuffled.slice(0, Math.min(n, array.length));
  }
  
  /**
   * Get random position within bounds
   */
  nextPosition(
    minX: number,
    maxX: number,
    minY: number,
    maxY: number
  ): { x: number; y: number } {
    return {
      x: this.nextInt(minX, maxX),
      y: this.nextInt(minY, maxY),
    };
  }
  
  /**
   * Get random variation of a base value
   */
  vary(base: number, variance: number): number {
    return base + (this.next() - 0.5) * 2 * variance;
  }
  
  /**
   * Reset to initial seed (for replay)
   */
  reset(): void {
    this.seed = this.initialSeed;
  }
  
  /**
   * Get current seed state (for saving)
   */
  getState(): number {
    return this.seed;
  }
  
  /**
   * Set seed state (for loading)
   */
  setState(state: number): void {
    this.seed = state;
  }
}

/**
 * Generate a random seed string
 */
export function generateSeedString(length: number = 12): string {
  const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let seed = '';
  for (let i = 0; i < length; i++) {
    seed += BASE62[Math.floor(Math.random() * 62)];
  }
  return seed;
}

/**
 * Validate seed string format
 */
export function isValidSeed(seed: string): boolean {
  if (typeof seed !== 'string') return false;
  if (seed.length !== 12) return false;
  return /^[0-9A-Za-z]+$/.test(seed);
}
