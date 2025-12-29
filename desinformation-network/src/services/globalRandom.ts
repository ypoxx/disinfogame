/**
 * Global Seeded Random Number Generator
 *
 * Provides a singleton instance of SeededRandom that can be used
 * throughout the application for deterministic randomness.
 * This ensures game replays work correctly.
 */

import { SeededRandom } from '../game-logic/seed/SeededRandom';

class GlobalRandomService {
  private instance: SeededRandom;
  private currentSeed: string;

  constructor() {
    // Initialize with a random seed
    this.currentSeed = this.generateSeed();
    this.instance = new SeededRandom(this.currentSeed);
  }

  /**
   * Generate a random seed string
   */
  private generateSeed(): string {
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  }

  /**
   * Get the current seeded random instance
   */
  public getRandom(): SeededRandom {
    return this.instance;
  }

  /**
   * Reset with a new seed
   */
  public reset(seed?: string): void {
    this.currentSeed = seed || this.generateSeed();
    this.instance = new SeededRandom(this.currentSeed);
  }

  /**
   * Get the current seed
   */
  public getSeed(): string {
    return this.currentSeed;
  }

  /**
   * Get a random number between 0 and 1
   */
  public random(): number {
    return this.instance.next();
  }

  /**
   * Get a random integer between min (inclusive) and max (inclusive)
   */
  public randomInt(min: number, max: number): number {
    return this.instance.nextInt(min, max);
  }

  /**
   * Get a random element from an array
   */
  public choice<T>(array: T[]): T {
    const result = this.instance.pick(array);
    if (result === undefined) throw new Error('Cannot pick from empty array');
    return result;
  }

  /**
   * Shuffle an array in place
   */
  public shuffle<T>(array: T[]): T[] {
    return this.instance.shuffle(array);
  }
}

// Export singleton instance
export const globalRandom = new GlobalRandomService();
