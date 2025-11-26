import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { neon } from '@neondatabase/serverless';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize database
const sql = neon(process.env.DATABASE_URL || '');

// Initialize Redis for rate limiting
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL || '',
  token: process.env.UPSTASH_REDIS_TOKEN || '',
});

// Rate limiter: 100 requests per minute per IP
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  analytics: true,
});

// Types
type AnalyticsEvent = {
  sessionId: string;
  eventType: 'ability_used' | 'round_end' | 'game_end' | 'game_start';
  seed: string;
  round: number;
  data: {
    abilityId?: string;
    targetActorId?: string;
    trustDelta?: number;
    resourceCost?: number;
    averageTrust?: number;
    victory?: boolean;
    defeatReason?: string;
  };
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
    const { success } = await ratelimit.limit(ip);

    if (!success) {
      return {
        statusCode: 429,
        headers,
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

    const analyticsEvent = JSON.parse(event.body) as AnalyticsEvent;

    // Validate required fields
    if (!analyticsEvent.sessionId || !analyticsEvent.eventType || !analyticsEvent.seed) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Insert into database
    await sql`
      INSERT INTO analytics_events (
        session_id,
        event_type,
        seed,
        round,
        ability_id,
        target_actor_id,
        trust_delta,
        resource_cost,
        average_trust,
        victory,
        defeat_reason,
        created_at
      ) VALUES (
        ${analyticsEvent.sessionId},
        ${analyticsEvent.eventType},
        ${analyticsEvent.seed},
        ${analyticsEvent.round || 0},
        ${analyticsEvent.data.abilityId || null},
        ${analyticsEvent.data.targetActorId || null},
        ${analyticsEvent.data.trustDelta || null},
        ${analyticsEvent.data.resourceCost || null},
        ${analyticsEvent.data.averageTrust || null},
        ${analyticsEvent.data.victory || null},
        ${analyticsEvent.data.defeatReason || null},
        NOW()
      )
    `;

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Error recording analytics:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
