# Architecture Documentation

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend (React)                    │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Components  │  │    Hooks     │  │  Game Logic  │ │
│  │   (View)     │◄─┤  (Bridge)    │◄─┤   (Pure TS)  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│         │                  │                  │         │
└─────────┼──────────────────┼──────────────────┼─────────┘
          │                  │                  │
          │         ┌────────▼────────┐         │
          │         │   API Client    │         │
          │         │    (fetch)      │         │
          │         └────────┬────────┘         │
          │                  │                  │
          │    ┌─────────────▼─────────────┐   │
          │    │     Netlify Edge CDN      │   │
          │    └─────────────┬─────────────┘   │
          │                  │                  │
    ┌─────▼──────────────────▼─────────────────▼─────┐
    │           Netlify Functions (Serverless)       │
    │  ┌─────────┐  ┌─────────┐  ┌──────────────┐  │
    │  │  Seeds  │  │Analytics│  │  Leaderboard │  │
    │  └────┬────┘  └────┬────┘  └──────┬───────┘  │
    └───────┼────────────┼───────────────┼──────────┘
            │            │               │
    ┌───────▼────────────▼───────────────▼──────────┐
    │              Data Layer                        │
    │  ┌──────────┐  ┌─────────────────────────┐   │
    │  │ Upstash  │  │     Neon Postgres       │   │
    │  │ (Redis)  │  │  (Structured Storage)   │   │
    │  └──────────┘  └─────────────────────────┘   │
    └────────────────────────────────────────────────┘
```

---

## Core Architecture Patterns

### 1. Unidirectional Data Flow

```
User Action
  ↓
React Component (onClick)
  ↓
Hook (useGameState)
  ↓
Game Logic (GameState.applyAbility)
  ↓
New State (immutable update)
  ↓
Hook updates (via setState)
  ↓
React re-renders
  ↓
Canvas redraws
```

**Key principle:** State flows down, events flow up. Never mutate state directly.

### 2. Separation of Concerns

```
┌─────────────────────────────────────────────┐
│             PRESENTATION LAYER              │
│  (React Components - src/components/)       │
│  - Render UI                                │
│  - Handle user input                        │
│  - Display state                            │
│  - NO business logic                        │
└─────────────┬───────────────────────────────┘
              │ via Hooks
┌─────────────▼───────────────────────────────┐
│              BRIDGE LAYER                   │
│  (React Hooks - src/hooks/)                 │
│  - Connect React to game logic              │
│  - Manage React lifecycle                   │
│  - Convert between formats                  │
└─────────────┬───────────────────────────────┘
              │ uses
┌─────────────▼───────────────────────────────┐
│            BUSINESS LOGIC LAYER             │
│  (Pure TypeScript - src/game-logic/)        │
│  - Game rules & calculations                │
│  - State management                         │
│  - Algorithms                               │
│  - NO React dependencies                    │
└─────────────────────────────────────────────┘
```

### 3. Actor-Ability-Effect System

```typescript
// Core Game Loop
class GameState {
  actors: Actor[]
  network: Network
  resources: number
  round: number
  
  // Main action handler
  applyAbility(
    abilityId: string, 
    sourceActorId: string, 
    targetActorIds: string[]
  ): GameState {
    // 1. Validate
    const ability = this.getAbility(abilityId);
    const source = this.getActor(sourceActorId);
    if (!this.canUseAbility(ability, source)) {
      throw new Error('Cannot use ability');
    }
    
    // 2. Spend resources
    const newResources = this.resources - ability.resourceCost;
    
    // 3. Apply effects
    const effects = ability.calculateEffects(
      source, 
      this.getActors(targetActorIds),
      this.network
    );
    
    // 4. Update network
    const newNetwork = this.network.applyEffects(effects);
    
    // 5. Set cooldown
    const newActors = this.actors.map(a =>
      a.id === sourceActorId
        ? a.setAbilityCooldown(abilityId, ability.cooldown)
        : a
    );
    
    // 6. Return new immutable state
    return new GameState({
      actors: newActors,
      network: newNetwork,
      resources: newResources,
      round: this.round
    });
  }
  
  // Round progression
  advanceRound(): GameState {
    // 1. Propagate trust through network
    const propagatedNetwork = this.network.propagateTrust();
    
    // 2. Apply recovery
    const recoveredNetwork = propagatedNetwork.applyRecovery();
    
    // 3. Decrement cooldowns
    const updatedActors = this.actors.map(a => a.decrementCooldowns());
    
    // 4. Trigger random events (30% chance)
    const { network: eventNetwork, newActors } = 
      Math.random() < 0.3 
        ? this.triggerRandomEvent(recoveredNetwork, updatedActors)
        : { network: recoveredNetwork, newActors: updatedActors };
    
    // 5. Add resources
    const resourceBonus = this.calculateResourceBonus();
    const newResources = this.resources + 20 + resourceBonus;
    
    // 6. Check for defensive spawns (every 8 rounds)
    const finalNetwork = (this.round + 1) % 8 === 0
      ? this.spawnDefensiveActor(eventNetwork)
      : eventNetwork;
    
    // 7. Return new state
    return new GameState({
      actors: newActors,
      network: finalNetwork,
      resources: newResources,
      round: this.round + 1
    });
  }
}
```

---

## Data Models

### Core Types

```typescript
// src/game-logic/types/Actor.ts
type Actor = {
  // Identity
  id: string;
  name: string;
  category: 'media' | 'expert' | 'lobby' | 'organization' | 'defensive';
  
  // Core properties (0-1 normalized)
  trust: number;              // Current trust level
  baseTrust: number;          // Starting value (for recovery)
  resilience: number;         // Resistance to manipulation
  influenceRadius: number;    // Pixel radius for connections
  emotionalState: number;     // 0=rational, 1=emotional
  recoveryRate: number;       // How fast trust recovers
  
  // Spatial
  position: { x: number; y: number };
  
  // Visual
  color: string;
  size: number;
  
  // Gameplay
  abilities: string[];        // Ability IDs
  activeEffects: Effect[];    // Currently active effects
  cooldowns: Map<string, number>;  // Ability ID → rounds remaining
  
  // Metadata
  vulnerabilities: string[];  // Technique IDs from taxonomy
  resistances: string[];      // Technique IDs from taxonomy
};

// src/game-logic/types/Ability.ts
type Ability = {
  id: string;
  name: string;
  description: string;
  
  // Costs
  resourceCost: number;
  cooldown: number;
  
  // Taxonomy link
  basedOn: string[];          // Persuasion technique IDs
  
  // Mechanics
  effectType: 'direct' | 'propagation' | 'network' | 'delayed';
  targetType: 'single' | 'adjacent' | 'category' | 'network';
  targetFilter?: (actor: Actor) => boolean;
  
  // Effect calculation
  calculateEffects: (
    source: Actor,
    targets: Actor[],
    network: Network
  ) => Effect[];
  
  // Visual
  animationType: 'pulse' | 'wave' | 'beam' | 'ripple';
  animationColor: string;
};

// src/game-logic/types/Effect.ts
type Effect = {
  id: string;
  type: 'trust_delta' | 'resilience_delta' | 'emotional_delta';
  targetActorId: string;
  
  // Magnitude
  value: number;              // Can be negative
  duration: number;           // Rounds (0 = instant)
  
  // Metadata
  sourceAbilityId: string;
  appliedAtRound: number;
  
  // Handlers
  onApply?: (actor: Actor, network: Network) => void;
  onUpdate?: (actor: Actor, network: Network) => void;
  onExpire?: (actor: Actor, network: Network) => void;
};

// src/game-logic/types/Network.ts
type Network = {
  actors: Actor[];
  connections: Connection[];
  
  // Global state
  averageTrust: number;
  globalEmotionalState: number;
  polarizationIndex: number;
  
  // Defensive mechanics
  defensiveActors: Actor[];
  defensiveSpawnThreshold: number;
};

type Connection = {
  sourceId: string;
  targetId: string;
  strength: number;           // 0-1, calculated from distance/radius
  trustFlow: number;          // How much trust propagates per round
};

// src/game-logic/types/Event.ts
type GameEvent = {
  id: string;
  name: string;
  description: string;
  
  // Trigger
  triggerType: 'random' | 'conditional' | 'timed';
  triggerCondition?: (state: GameState) => boolean;
  probability?: number;       // For random events
  
  // Effects
  effects: Effect[];
  globalEffects?: {
    trustShift?: number;
    polarizationShift?: number;
    resourceBonus?: number;
  };
  
  // Presentation
  newsTickerText: string;
  iconType: string;
};
```

---

## API Architecture (Netlify Functions)

### Function Structure

```
netlify/functions/
├── seed-create.ts       # POST - Create new seed
├── seed-get.ts          # GET - Retrieve seed by ID
├── seed-popular.ts      # GET - Get popular seeds
├── analytics-record.ts  # POST - Log game action
├── analytics-aggregate.ts # GET - Get aggregated stats
├── leaderboard-submit.ts  # POST - Submit score
├── leaderboard-get.ts     # GET - Get leaderboard
└── game-state-save.ts     # POST - Cloud save
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/.netlify/functions/seed-create` | POST | Create game seed |
| `/.netlify/functions/seed-get?id=xxx` | GET | Get seed metadata |
| `/.netlify/functions/seed-popular` | GET | Get popular seeds |
| `/.netlify/functions/analytics-record` | POST | Log game action |
| `/.netlify/functions/analytics-aggregate` | GET | Get stats |
| `/.netlify/functions/leaderboard-submit` | POST | Submit score |
| `/.netlify/functions/leaderboard-get` | GET | Get leaderboard |

### Function Example

```typescript
// netlify/functions/seed-create.ts
import type { Handler } from '@netlify/functions';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export const handler: Handler = async (event) => {
  // CORS headers
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
    
    await redis.hset(`seed:${seed}`, {
      created: Date.now(),
      rounds: metadata.rounds,
      finalTrust: metadata.finalTrust,
      difficulty: metadata.difficulty,
      tactics: JSON.stringify(metadata.tacticsUsed),
      playCount: 1,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, seed }),
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

-- Analytics
CREATE TABLE game_actions (
  id SERIAL PRIMARY KEY,
  seed VARCHAR(12) REFERENCES seeds(id),
  round INTEGER,
  action_type VARCHAR(50),
  action_data JSONB,
  result JSONB,
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
  rounds INTEGER,
  final_trust DECIMAL(5,4),
  tactics_used JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_leaderboard_rounds ON leaderboard_entries(rounds ASC);
CREATE INDEX idx_leaderboard_timestamp ON leaderboard_entries(timestamp DESC);
```

### Upstash Redis Schema

```typescript
// Seed metadata (fast access)
// Key: seed:{seedId}
// Value: Hash
{
  created: timestamp,
  rounds: number,
  finalTrust: number,
  difficulty: string,
  tactics: string, // JSON
  playCount: number
}

// Global stats (aggregated)
// Key: stats:global
// Value: Hash
{
  games_played: number,
  total_rounds: number,
  wins: number,
  avg_rounds: number,
  avg_final_trust: number
}

// Ability usage stats
// Key: stats:abilities
// Value: Hash
{
  [abilityId]: count
}

// Cached leaderboard
// Key: leaderboard:fastest
// Value: Sorted Set (score = rounds)
[
  { player: "Alice", seed: "abc123", rounds: 12 },
  { player: "Bob", seed: "def456", rounds: 15 },
]
```

---

## Performance Optimization

### Bundle Size

**Code splitting:**
```typescript
// Lazy load encyclopedia
const Encyclopedia = lazy(() => import('./components/Encyclopedia/EncyclopediaModal'));

// Lazy load screens
const VictoryScreen = lazy(() => import('./components/Screens/VictoryScreen'));
```

**Tree shaking:**
```typescript
// ✅ Import only what you need
import { clamp } from '@/utils/math';

// ❌ Avoid default imports of large libraries
import _ from 'lodash';  // Imports entire library!
```

### Render Optimization

**Memoize expensive components:**
```typescript
const ActorCard = memo(function ActorCard({ actor }: ActorCardProps) {
  // Only re-renders if actor changes
}, (prev, next) => {
  return prev.actor.trust === next.actor.trust &&
         prev.actor.resilience === next.actor.resilience;
});
```

**Use keys properly:**
```tsx
{actors.map(actor => (
  <ActorCard 
    key={actor.id}  // Stable key
    actor={actor} 
  />
))}
```

### State Updates

**Batch updates:**
```typescript
// ✅ Single state update
const [state, setState] = useState(initialState);
setState(prev => ({
  ...prev,
  actors: newActors,
  network: newNetwork,
  resources: newResources
}));

// ❌ Multiple updates (triggers 3 re-renders!)
setActors(newActors);
setNetwork(newNetwork);
setResources(newResources);
```

---

## Testing Strategy

### Unit Tests (Game Logic)

```typescript
// __tests__/game-logic/Network.test.ts
import { describe, it, expect } from 'vitest';
import { Network } from '@/game-logic/network/Network';

describe('Network', () => {
  it('calculates connections based on distance', () => {
    const actors = [
      { id: 'a1', position: { x: 0, y: 0 }, influenceRadius: 100 },
      { id: 'a2', position: { x: 50, y: 0 }, influenceRadius: 100 },
      { id: 'a3', position: { x: 200, y: 0 }, influenceRadius: 100 },
    ];
    
    const network = new Network(actors);
    const connections = network.connections;
    
    // a1 and a2 should be connected (distance 50 < avg radius 100)
    expect(connections.some(c => 
      c.sourceId === 'a1' && c.targetId === 'a2'
    )).toBe(true);
    
    // a1 and a3 should NOT be connected (distance 200 > avg radius 100)
    expect(connections.some(c => 
      c.sourceId === 'a1' && c.targetId === 'a3'
    )).toBe(false);
  });
  
  it('propagates trust through network', () => {
    // Setup test network
    // Apply propagation
    // Assert trust values changed as expected
  });
});
```

### Integration Tests (API)

```typescript
// __tests__/api/seeds.test.ts
import { describe, it, expect } from 'vitest';

describe('Seeds API', () => {
  it('creates and retrieves seed', async () => {
    // POST /.netlify/functions/seed-create
    const createResponse = await fetch('/.netlify/functions/seed-create', {
      method: 'POST',
      body: JSON.stringify({
        seed: 'test123',
        metadata: { rounds: 20, finalTrust: 0.35 }
      })
    });
    
    expect(createResponse.ok).toBe(true);
    
    // GET /.netlify/functions/seed-get?id=test123
    const getResponse = await fetch('/.netlify/functions/seed-get?id=test123');
    const data = await getResponse.json();
    
    expect(data.seed).toBe('test123');
    expect(data.metadata.rounds).toBe(20);
  });
});
```

---

## Security Considerations

### API Rate Limiting

```typescript
// Using Upstash Rate Limit
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

export const handler: Handler = async (event) => {
  const ip = event.headers['x-forwarded-for'] || 'unknown';
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return {
      statusCode: 429,
      body: JSON.stringify({ error: 'Rate limit exceeded' }),
    };
  }
  
  // Continue with request...
};
```

### Input Validation

```typescript
import { z } from 'zod';

const createSeedSchema = z.object({
  seed: z.string().length(12),
  metadata: z.object({
    rounds: z.number().int().min(1).max(32),
    finalTrust: z.number().min(0).max(1),
    difficulty: z.enum(['easy', 'normal', 'hard'])
  })
});

export const handler: Handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const validated = createSeedSchema.parse(body);
    
    // Proceed with validated data
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid input' }),
    };
  }
};
```

---

## Deployment Pipeline

### Netlify Auto-Deploy

```yaml
# Automatic on push to main
# Configure in netlify.toml

[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

### GitHub Actions (Optional)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Netlify

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run typecheck
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2
        with:
          publish-dir: './dist'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

*Last updated: 2025-01*
*Version: 1.0.0*
