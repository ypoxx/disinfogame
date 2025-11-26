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

// Rate limiter: 5 submissions per hour per IP
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  analytics: true,
});

// Types
type LeaderboardSubmission = {
  playerName: string;
  seed: string;
  rounds: number;
  finalTrust: number;
  tacticsUsed: string[];
  difficulty: 'easy' | 'normal' | 'hard';
};

// Profanity filter (basic)
const BLOCKED_WORDS = ['fuck', 'shit', 'ass', 'nazi', 'hitler'];

function containsProfanity(text: string): boolean {
  const lowerText = text.toLowerCase();
  return BLOCKED_WORDS.some(word => lowerText.includes(word));
}

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
    const { success, remaining } = await ratelimit.limit(ip);

    if (!success) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({ 
          error: 'Rate limit exceeded',
          message: 'You can only submit 5 scores per hour'
        }),
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

    const submission = JSON.parse(event.body) as LeaderboardSubmission;

    // Validate required fields
    if (!submission.playerName || !submission.seed || submission.rounds === undefined) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Validate player name
    if (submission.playerName.length < 1 || submission.playerName.length > 20) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Player name must be 1-20 characters' }),
      };
    }

    // Check for profanity
    if (containsProfanity(submission.playerName)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Player name contains inappropriate content' }),
      };
    }

    // Validate seed format
    if (!/^[0-9A-Za-z]{12}$/.test(submission.seed)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid seed format' }),
      };
    }

    // Calculate score (lower rounds + lower final trust = better)
    const score = submission.rounds * 100 + Math.round(submission.finalTrust * 1000);

    // Insert into database
    const result = await sql`
      INSERT INTO leaderboard (
        player_name,
        seed,
        rounds,
        final_trust,
        score,
        tactics_used,
        difficulty,
        ip_hash,
        created_at
      ) VALUES (
        ${submission.playerName},
        ${submission.seed},
        ${submission.rounds},
        ${submission.finalTrust},
        ${score},
        ${JSON.stringify(submission.tacticsUsed || [])},
        ${submission.difficulty || 'normal'},
        ${await hashIP(ip)},
        NOW()
      )
      RETURNING id
    `;

    // Get rank
    const rankResult = await sql`
      SELECT COUNT(*) + 1 as rank
      FROM leaderboard
      WHERE score < ${score}
    `;

    const rank = rankResult[0]?.rank || 1;

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        success: true,
        id: result[0]?.id,
        rank,
        score,
        submissionsRemaining: remaining,
      }),
    };
  } catch (error) {
    console.error('Error submitting to leaderboard:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

// Simple IP hashing for privacy
async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + process.env.IP_SALT || 'default-salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
}
