import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL || '',
  token: process.env.UPSTASH_REDIS_TOKEN || '',
});

// Rate limiter: 10 requests per minute per IP
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  analytics: true,
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

type CreateSeedRequest = {
  seed: string;
  metadata: Omit<SeedMetadata, 'seed' | 'createdAt'>;
};

// Handler
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Rate limiting
    const ip = event.headers['x-forwarded-for'] || 'anonymous';
    const { success, limit, remaining, reset } = await ratelimit.limit(ip);

    if (!success) {
      return {
        statusCode: 429,
        headers: {
          ...headers,
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
        body: JSON.stringify({ error: 'Rate limit exceeded' }),
      };
    }

    // Parse request body
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing request body' }),
      };
    }

    const { seed, metadata } = JSON.parse(event.body) as CreateSeedRequest;

    // Validate seed format (12 char alphanumeric)
    if (!seed || !/^[0-9A-Za-z]{12}$/.test(seed)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid seed format' }),
      };
    }

    // Create seed record
    const seedData: SeedMetadata = {
      seed,
      createdAt: new Date().toISOString(),
      rounds: metadata.rounds || 0,
      finalTrust: metadata.finalTrust || 0,
      difficulty: metadata.difficulty || 'normal',
      tacticsUsed: metadata.tacticsUsed || [],
      victory: metadata.victory || false,
    };

    // Store in Redis
    const key = `seed:${seed}`;
    await redis.set(key, JSON.stringify(seedData), { ex: 60 * 60 * 24 * 30 }); // 30 days expiry

    // Add to popular seeds if victory
    if (seedData.victory) {
      await redis.zadd('seeds:popular', {
        score: Date.now(),
        member: seed,
      });
      // Keep only top 100 popular seeds
      await redis.zremrangebyrank('seeds:popular', 0, -101);
    }

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        success: true,
        seed: seedData.seed,
        shareUrl: `https://desinformation-network.netlify.app/?seed=${seed}`,
      }),
    };
  } catch (error) {
    console.error('Error creating seed:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
