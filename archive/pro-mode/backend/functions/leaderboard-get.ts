import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { neon } from '@neondatabase/serverless';

// Initialize database
const sql = neon(process.env.DATABASE_URL || '');

// Types
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

// Handler
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=60', // Cache for 1 minute
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
    // Get query params
    const { limit, offset, difficulty, timeframe } = event.queryStringParameters || {};

    const queryLimit = Math.min(Math.max(parseInt(limit || '50', 10), 1), 100);
    const queryOffset = Math.max(parseInt(offset || '0', 10), 0);

    // Build query conditions
    let whereClause = '';
    const conditions: string[] = [];

    if (difficulty && ['easy', 'normal', 'hard'].includes(difficulty)) {
      conditions.push(`difficulty = '${difficulty}'`);
    }

    if (timeframe) {
      switch (timeframe) {
        case 'today':
          conditions.push(`created_at >= CURRENT_DATE`);
          break;
        case 'week':
          conditions.push(`created_at >= CURRENT_DATE - INTERVAL '7 days'`);
          break;
        case 'month':
          conditions.push(`created_at >= CURRENT_DATE - INTERVAL '30 days'`);
          break;
      }
    }

    if (conditions.length > 0) {
      whereClause = `WHERE ${conditions.join(' AND ')}`;
    }

    // Get leaderboard entries
    const entries = await sql`
      SELECT 
        ROW_NUMBER() OVER (ORDER BY score ASC) as rank,
        player_name,
        seed,
        rounds,
        final_trust,
        score,
        difficulty,
        created_at
      FROM leaderboard
      ORDER BY score ASC
      LIMIT ${queryLimit}
      OFFSET ${queryOffset}
    `;

    // Get total count
    const countResult = await sql`
      SELECT COUNT(*) as total FROM leaderboard
    `;

    const total = parseInt(countResult[0]?.total || '0', 10);

    // Format entries
    const formattedEntries: LeaderboardEntry[] = entries.map((entry: any, index: number) => ({
      rank: queryOffset + index + 1,
      playerName: entry.player_name,
      seed: entry.seed,
      rounds: entry.rounds,
      finalTrust: parseFloat(entry.final_trust),
      score: entry.score,
      difficulty: entry.difficulty,
      createdAt: entry.created_at,
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: formattedEntries,
        pagination: {
          total,
          limit: queryLimit,
          offset: queryOffset,
          hasMore: queryOffset + formattedEntries.length < total,
        },
      }),
    };
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
