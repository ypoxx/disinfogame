/**
 * API Service for Desinformation Network
 * Handles all communication with Netlify Functions
 */

const API_BASE = '/.netlify/functions';

// Types
type SeedMetadata = {
  seed: string;
  createdAt: string;
  rounds: number;
  finalTrust: number;
  difficulty: 'easy' | 'normal' | 'hard';
  tacticsUsed: string[];
  victory: boolean;
};

type LeaderboardEntry = {
  rank: number;
  playerName: string;
  seed: string;
  rounds: number;
  finalTrust: number;
  score: number;
  difficulty: string;
  createdAt: string;
};

type AnalyticsEvent = {
  sessionId: string;
  eventType: 'ability_used' | 'round_end' | 'game_end' | 'game_start';
  seed: string;
  round: number;
  data: Record<string, unknown>;
};

// ============================================
// SEED API
// ============================================

/**
 * Create a new seed record
 */
export async function createSeed(
  seed: string,
  metadata: Omit<SeedMetadata, 'seed' | 'createdAt'>
): Promise<{ success: boolean; shareUrl?: string; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/seed-create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seed, metadata }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error };
    }

    return { success: true, shareUrl: data.shareUrl };
  } catch (error) {
    console.error('Error creating seed:', error);
    return { success: false, error: 'Network error' };
  }
}

/**
 * Get seed data
 */
export async function getSeed(
  seed: string
): Promise<{ success: boolean; data?: SeedMetadata; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/seed-get?seed=${encodeURIComponent(seed)}`);
    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error };
    }

    return { success: true, data: data.data };
  } catch (error) {
    console.error('Error getting seed:', error);
    return { success: false, error: 'Network error' };
  }
}

/**
 * Get popular seeds
 */
export async function getPopularSeeds(
  limit: number = 10
): Promise<{ success: boolean; data?: SeedMetadata[]; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/seed-popular?limit=${limit}`);
    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error };
    }

    return { success: true, data: data.data };
  } catch (error) {
    console.error('Error getting popular seeds:', error);
    return { success: false, error: 'Network error' };
  }
}

// ============================================
// LEADERBOARD API
// ============================================

/**
 * Submit score to leaderboard
 */
export async function submitScore(submission: {
  playerName: string;
  seed: string;
  rounds: number;
  finalTrust: number;
  tacticsUsed: string[];
  difficulty: 'easy' | 'normal' | 'hard';
}): Promise<{ success: boolean; rank?: number; score?: number; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/leaderboard-submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error };
    }

    return { success: true, rank: data.rank, score: data.score };
  } catch (error) {
    console.error('Error submitting score:', error);
    return { success: false, error: 'Network error' };
  }
}

/**
 * Get leaderboard entries
 */
export async function getLeaderboard(options?: {
  limit?: number;
  offset?: number;
  difficulty?: 'easy' | 'normal' | 'hard';
  timeframe?: 'today' | 'week' | 'month' | 'all';
}): Promise<{
  success: boolean;
  data?: LeaderboardEntry[];
  pagination?: { total: number; hasMore: boolean };
  error?: string;
}> {
  try {
    const params = new URLSearchParams();
    if (options?.limit) params.set('limit', options.limit.toString());
    if (options?.offset) params.set('offset', options.offset.toString());
    if (options?.difficulty) params.set('difficulty', options.difficulty);
    if (options?.timeframe) params.set('timeframe', options.timeframe);

    const response = await fetch(`${API_BASE}/leaderboard-get?${params.toString()}`);
    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error };
    }

    return {
      success: true,
      data: data.data,
      pagination: data.pagination,
    };
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return { success: false, error: 'Network error' };
  }
}

// ============================================
// ANALYTICS API
// ============================================

// Session ID (generated once per session)
let sessionId: string | null = null;

function getSessionId(): string {
  if (!sessionId) {
    sessionId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
  return sessionId;
}

/**
 * Record analytics event
 * Non-blocking - errors are logged but not thrown
 */
export async function recordAnalytics(
  eventType: AnalyticsEvent['eventType'],
  seed: string,
  round: number,
  data: Record<string, unknown> = {}
): Promise<void> {
  try {
    const event: AnalyticsEvent = {
      sessionId: getSessionId(),
      eventType,
      seed,
      round,
      data,
    };

    // Fire and forget - don't await
    fetch(`${API_BASE}/analytics-record`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    }).catch(console.error);
  } catch (error) {
    console.error('Error recording analytics:', error);
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generate a shareable URL for a seed
 */
export function generateShareUrl(seed: string): string {
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://desinformation-network.netlify.app';
  return `${baseUrl}/?seed=${encodeURIComponent(seed)}`;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
}

/**
 * Parse seed from URL
 */
export function parseSeedFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const seed = params.get('seed');
  return seed && /^[0-9A-Za-z]{12}$/.test(seed) ? seed : null;
}
