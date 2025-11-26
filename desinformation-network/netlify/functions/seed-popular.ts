import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL || '',
  token: process.env.UPSTASH_REDIS_TOKEN || '',
});

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

// Handler
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  // Only allow GET
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Get limit from query params (default 10, max 50)
    const limitParam = event.queryStringParameters?.limit;
    const limit = Math.min(Math.max(parseInt(limitParam || '10', 10), 1), 50);

    // Get popular seeds from sorted set (most recent first)
    const popularSeeds = await redis.zrange<string[]>('seeds:popular', -limit, -1, {
      rev: true,
    });

    if (!popularSeeds || popularSeeds.length === 0) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: [],
        }),
      };
    }

    // Get full data for each seed
    const seedDataPromises = popularSeeds.map(async (seed) => {
      const key = `seed:${seed}`;
      const data = await redis.get<string>(key);
      if (data) {
        return typeof data === 'string' ? JSON.parse(data) : data;
      }
      return null;
    });

    const seedDataResults = await Promise.all(seedDataPromises);
    const validSeedData = seedDataResults.filter((data): data is SeedMetadata => data !== null);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: validSeedData,
        count: validSeedData.length,
      }),
    };
  } catch (error) {
    console.error('Error getting popular seeds:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
