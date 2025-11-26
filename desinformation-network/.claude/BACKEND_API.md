# Backend API Documentation

## Overview

The backend uses **Netlify Functions** (serverless) with **Upstash Redis** for fast access and **Neon Postgres** for structured queries.

**Philosophy:**
- Frontend-first: Backend only for features that require persistence/sharing
- Stateless functions: Each request is independent
- Edge-optimized: Deploy close to users via Netlify CDN
- Type-safe: Full TypeScript support

---

## API Endpoints

### Base URL

- **Production:** `https://your-site.netlify.app/.netlify/functions/`
- **Local Dev:** `http://localhost:8888/.netlify/functions/`
- **With Redirects:** `/api/` → `/.netlify/functions/`

### Seeds API

**Purpose:** Enable seed-based replay and challenge sharing

#### POST /.netlify/functions/seed-create

Create a new seed entry.

```typescript
// Request
type CreateSeedRequest = {
  seed: string;           // 12-char Base62 string
  metadata: {
    rounds: number;        // Total rounds played
    finalTrust: number;    // Final network trust (0-1)
    difficulty: 'easy' | 'normal' | 'hard';
    tacticsUsed: string[]; // Array of ability IDs
  };
};

// Response
type CreateSeedResponse = {
  success: boolean;
  seed: string;
};

// Implementation
import type { Handler } from '@netlify/functions';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers, 
      body: JSON.stringify({ error: 'Method not allowed' }) 
    };
  }

  try {
    const { seed, metadata } = JSON.parse(event.body || '{}');

    if (!seed || seed.length !== 12) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid seed' }),
      };
    }

    // Store in Redis (fast access)
    await redis.hset(`seed:${seed}`, {
      created: Date.now(),
      rounds: metadata.rounds,
      finalTrust: metadata.finalTrust,
      difficulty: metadata.difficulty,
      tactics: JSON.stringify(metadata.tacticsUsed),
      playCount: 1,
    });

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ success: true, seed }),
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
```

**Example Usage:**
```typescript
// Frontend
const response = await fetch('/.netlify/functions/seed-create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    seed: 'a1b2c3d4e5f6',
    metadata: {
      rounds: 24,
      finalTrust: 0.32,
      difficulty: 'normal',
      tacticsUsed: ['agenda_setting', 'undermine_authority', 'astroturfing']
    }
  })
});

const data = await response.json();
// { success: true, seed: 'a1b2c3d4e5f6' }
```

#### GET /.netlify/functions/seed-get

Retrieve seed metadata.

```typescript
// Request
// GET /.netlify/functions/seed-get?id=a1b2c3d4e5f6

// Response
type GetSeedResponse = {
  seed: string;
  created: number;          // Timestamp
  rounds: number;
  finalTrust: number;
  difficulty: string;
  tactics: string[];
  playCount: number;
};

// Implementation
export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  const id = event.queryStringParameters?.id;

  if (!id) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing seed ID' }),
    };
  }

  // Get from Redis (fast)
  const seedData = await redis.hgetall(`seed:${id}`);

  if (!seedData || Object.keys(seedData).length === 0) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Seed not found' }),
    };
  }

  // Increment play count
  await redis.hincrby(`seed:${id}`, 'playCount', 1);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      seed: id,
      created: seedData.created,
      rounds: seedData.rounds,
      finalTrust: seedData.finalTrust,
      difficulty: seedData.difficulty,
      tactics: JSON.parse(seedData.tactics as string),
      playCount: seedData.playCount,
    }),
  };
};
```

#### GET /.netlify/functions/seed-popular

Get most played seeds.

```typescript
// Request
// GET /.netlify/functions/seed-popular?limit=10

// Response
type PopularSeedsResponse = {
  seeds: Array<{
    seed: string;
    playCount: number;
    rounds: number;
    difficulty: string;
  }>;
};
```

---

### Analytics API

**Purpose:** Collect anonymous gameplay data for balance adjustments

#### POST /.netlify/functions/analytics-record

Log a game action.

```typescript
// Request
type RecordAnalyticsRequest = {
  seed: string;
  round: number;
  action: {
    type: 'ability_used' | 'round_end' | 'game_end';
    abilityId?: string;
    targetActorId?: string;
    resourceCost?: number;
    result?: {
      trustDelta: number;
      success: boolean;
    };
  };
};

// Response
type RecordAnalyticsResponse = {
  success: boolean;
};

// Implementation
export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers, 
      body: JSON.stringify({ error: 'Method not allowed' }) 
    };
  }

  try {
    const { seed, round, action } = JSON.parse(event.body || '{}');

    // Update aggregated stats in Redis
    if (action.type === 'ability_used' && action.abilityId) {
      await redis.hincrby('stats:abilities', action.abilityId, 1);
    }

    if (action.type === 'game_end') {
      await redis.hincrby('stats:global', 'games_played', 1);
      await redis.hincrby('stats:global', 'total_rounds', round);

      if (action.result?.success) {
        await redis.hincrby('stats:global', 'wins', 1);
      }
    }

    return {
      statusCode: 200,
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
```

**Example Usage:**
```typescript
// Frontend - Log ability use
await fetch('/.netlify/functions/analytics-record', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    seed: currentSeed,
    round: currentRound,
    action: {
      type: 'ability_used',
      abilityId: 'agenda_setting',
      targetActorId: 'actor_media_1',
      resourceCost: 20,
      result: {
        trustDelta: -0.15,
        success: true
      }
    }
  })
});
```

#### GET /.netlify/functions/analytics-aggregate

Get aggregated statistics.

```typescript
// Request
// GET /.netlify/functions/analytics-aggregate

// Response
type AggregateAnalyticsResponse = {
  global: {
    gamesPlayed: number;
    totalRounds: number;
    averageRounds: number;
    wins: number;
    winRate: number;
  };
  abilities: {
    [abilityId: string]: {
      usageCount: number;
    };
  };
};

// Implementation
export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  // Get from Redis (fast aggregated stats)
  const globalStats = await redis.hgetall('stats:global') || {};
  const abilityStats = await redis.hgetall('stats:abilities') || {};

  // Calculate derived metrics
  const gamesPlayed = parseInt(globalStats.games_played as string) || 0;
  const totalRounds = parseInt(globalStats.total_rounds as string) || 0;
  const wins = parseInt(globalStats.wins as string) || 0;

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      global: {
        gamesPlayed,
        totalRounds,
        averageRounds: gamesPlayed > 0 ? totalRounds / gamesPlayed : 0,
        wins,
        winRate: gamesPlayed > 0 ? wins / gamesPlayed : 0,
      },
      abilities: Object.entries(abilityStats).reduce((acc, [id, count]) => {
        acc[id] = { usageCount: parseInt(count as string) };
        return acc;
      }, {} as Record<string, { usageCount: number }>),
    }),
  };
};
```

---

### Leaderboard API

**Purpose:** Track top scores (optional feature)

#### POST /.netlify/functions/leaderboard-submit

Submit a score.

```typescript
// Request
type SubmitLeaderboardRequest = {
  seed: string;
  playerName: string;
  rounds: number;
  finalTrust: number;
  tacticsUsed: string[];
};

// Response
type SubmitLeaderboardResponse = {
  success: boolean;
  rank: number;
};
```

#### GET /.netlify/functions/leaderboard-get

Get leaderboard entries.

```typescript
// Request
// GET /.netlify/functions/leaderboard-get?mode=fastest&limit=50

// Response
type GetLeaderboardResponse = {
  entries: Array<{
    rank: number;
    playerName: string;
    rounds: number;
    finalTrust: number;
    timestamp: string;
  }>;
};
```

---

### Game State API

**Purpose:** Cloud save/load (optional)

#### POST /.netlify/functions/game-state-save

Save game state to cloud.

```typescript
// Request
type SaveGameStateRequest = {
  seed: string;
  round: number;
  state: string;  // JSON-encoded GameState
};

// Response
type SaveGameStateResponse = {
  success: boolean;
  saveId: string;
};

// Implementation
export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers, 
      body: JSON.stringify({ error: 'Method not allowed' }) 
    };
  }

  try {
    const { seed, round, state } = JSON.parse(event.body || '{}');

    // Generate save ID
    const saveId = `${seed}_${round}_${Date.now()}`;

    // Store in Redis with expiration (30 days)
    await redis.set(`save:${saveId}`, state, {
      ex: 60 * 60 * 24 * 30,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, saveId }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
```

#### GET /.netlify/functions/game-state-load

Load game state from cloud.

```typescript
// Request
// GET /.netlify/functions/game-state-load?id=abc123_10_1234567890

// Response
type LoadGameStateResponse = {
  success: boolean;
  state?: string;
};
```

---

## Database Schemas

### Neon Postgres

```sql
-- Seeds
CREATE TABLE seeds (
  id VARCHAR(12) PRIMARY KEY,
  metadata JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  play_count INTEGER DEFAULT 1,
  average_rounds DECIMAL(5,2),
  win_rate DECIMAL(5,4)
);

CREATE INDEX idx_seeds_play_count ON seeds(play_count DESC);
CREATE INDEX idx_seeds_created ON seeds(created_at DESC);

-- Game Actions
CREATE TABLE game_actions (
  id SERIAL PRIMARY KEY,
  seed VARCHAR(12) REFERENCES seeds(id),
  round INTEGER NOT NULL,
  action_type VARCHAR(50) NOT NULL,
  action_data JSONB NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_actions_seed ON game_actions(seed);
CREATE INDEX idx_actions_type ON game_actions(action_type);
CREATE INDEX idx_actions_timestamp ON game_actions(timestamp DESC);

-- Leaderboard
CREATE TABLE leaderboard_entries (
  id SERIAL PRIMARY KEY,
  seed VARCHAR(12) REFERENCES seeds(id),
  player_name VARCHAR(50),
  rounds INTEGER NOT NULL,
  final_trust DECIMAL(5,4) NOT NULL,
  tactics_used JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_leaderboard_rounds ON leaderboard_entries(rounds ASC);
CREATE INDEX idx_leaderboard_trust ON leaderboard_entries(final_trust ASC);
CREATE INDEX idx_leaderboard_timestamp ON leaderboard_entries(timestamp DESC);
```

### Upstash Redis Schema

```typescript
// Key patterns
const KEY_PATTERNS = {
  // Seed metadata
  seed: (id: string) => `seed:${id}`,
  // Format: { created, rounds, finalTrust, difficulty, tactics, playCount }

  // Game save
  save: (id: string) => `save:${id}`,
  // Format: JSON-encoded GameState string

  // Global stats
  globalStats: 'stats:global',
  // Format: { games_played, total_rounds, wins }

  // Ability stats
  abilityStats: 'stats:abilities',
  // Format: { [abilityId]: count }

  // Leaderboard cache
  leaderboard: (mode: string) => `leaderboard:${mode}`,
  // Format: Sorted Set (score = rounds/trust)
};

// Example operations
await redis.hset('seed:abc123', { rounds: 20, playCount: 1 });
await redis.hincrby('seed:abc123', 'playCount', 1);
await redis.hgetall('seed:abc123');

await redis.set('save:abc123_10_123456', gameStateJson, { ex: 2592000 });
await redis.get('save:abc123_10_123456');

await redis.hincrby('stats:global', 'games_played', 1);
await redis.hincrby('stats:abilities', 'agenda_setting', 1);
```

---

## Rate Limiting

```typescript
// Using Upstash Rate Limit
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
});

// In your function handler
const ip = event.headers['x-forwarded-for'] || 
           event.headers['client-ip'] || 
           'unknown';

const { success, limit, reset, remaining } = await ratelimit.limit(ip);

if (!success) {
  return {
    statusCode: 429,
    headers: {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': reset.toString(),
    },
    body: JSON.stringify({ error: 'Rate limit exceeded' }),
  };
}
```

---

## Environment Variables

```bash
# .env (local development)
UPSTASH_REDIS_URL=https://...
UPSTASH_REDIS_TOKEN=...
DATABASE_URL=postgres://...  # Neon connection string

# Netlify Dashboard (production)
# Site Settings → Environment Variables
# Add the same variables
```

---

## Local Development

### Setup Netlify Dev

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Link to site (or create new)
netlify link

# Start local dev server
netlify dev
```

### Testing Functions Locally

```bash
# Functions available at http://localhost:8888/.netlify/functions/

# Test with curl
curl -X POST http://localhost:8888/.netlify/functions/seed-create \
  -H "Content-Type: application/json" \
  -d '{"seed":"test123abc","metadata":{"rounds":20,"finalTrust":0.35,"difficulty":"normal","tacticsUsed":[]}}'

# View function logs
netlify functions:log seed-create
```

---

## Deployment Checklist

- [ ] Create Upstash Redis database
- [ ] Create Neon Postgres database
- [ ] Add environment variables in Netlify
- [ ] Run database migrations (Neon)
- [ ] Test API routes with curl/Postman
- [ ] Enable rate limiting
- [ ] Set up monitoring (Netlify Analytics)
- [ ] Configure CORS if needed

---

## Monitoring & Analytics

### Netlify Analytics

- Enable in Netlify Dashboard → Analytics
- Tracks page views, function invocations, bandwidth

### Function Logs

```bash
# View live logs
netlify functions:log

# View specific function
netlify functions:log seed-create
```

### Upstash Dashboard

- Monitor Redis usage
- View request metrics
- Set up alerts

---

*Last updated: 2025-01*
*Version: 1.0.0*
