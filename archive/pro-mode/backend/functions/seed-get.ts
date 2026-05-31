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
    // Get seed from query params
    const seed = event.queryStringParameters?.seed;

    if (!seed) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing seed parameter' }),
      };
    }

    // Validate seed format
    if (!/^[0-9A-Za-z]{12}$/.test(seed)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid seed format' }),
      };
    }

    // Get seed from Redis
    const key = `seed:${seed}`;
    const data = await redis.get<string>(key);

    if (!data) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Seed not found' }),
      };
    }

    // Parse stored data
    const seedData: SeedMetadata = typeof data === 'string' ? JSON.parse(data) : data;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: seedData,
      }),
    };
  } catch (error) {
    console.error('Error getting seed:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
