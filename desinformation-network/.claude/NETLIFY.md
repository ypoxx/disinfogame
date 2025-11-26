# Netlify Setup Guide

## Overview

This project uses Netlify for:
- **Static Hosting** - React app served via CDN
- **Serverless Functions** - Backend API
- **Continuous Deployment** - Auto-deploy from GitHub

---

## Quick Start

### 1. Install Netlify CLI

```bash
npm install -g netlify-cli
```

### 2. Login

```bash
netlify login
```

### 3. Initialize Project

```bash
# From project root
netlify init

# Or link to existing site
netlify link
```

### 4. Local Development

```bash
# Start dev server with functions
netlify dev
```

This starts:
- Vite dev server on port 5173
- Netlify functions on port 8888
- Proxy at http://localhost:8888

---

## Project Configuration

### netlify.toml

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"

[dev]
  command = "npm run dev"
  port = 8888
  targetPort = 5173
  autoLaunch = false

# API redirect
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

# SPA fallback
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Headers for security
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

# Cache static assets
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## Functions Setup

### Directory Structure

```
netlify/
└── functions/
    ├── seed-create.ts
    ├── seed-get.ts
    ├── seed-popular.ts
    ├── analytics-record.ts
    ├── analytics-aggregate.ts
    ├── leaderboard-submit.ts
    ├── leaderboard-get.ts
    └── game-state-save.ts
```

### Function Template

```typescript
// netlify/functions/example.ts
import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json',
};

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Your logic here
    const data = { message: 'Hello from Netlify Functions!' };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
```

### TypeScript Configuration

```json
// netlify/functions/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "outDir": "../../.netlify/functions-serve"
  },
  "include": ["./**/*.ts"]
}
```

---

## Environment Variables

### Required Variables

```bash
# Upstash Redis
UPSTASH_REDIS_URL=https://xxx.upstash.io
UPSTASH_REDIS_TOKEN=xxx

# Neon Postgres
DATABASE_URL=postgres://user:pass@xxx.neon.tech/dbname?sslmode=require
```

### Setting Variables

**Netlify Dashboard:**
1. Go to Site Settings → Environment Variables
2. Add each variable
3. Set scope (Production, Deploy Preview, Local)

**Netlify CLI:**
```bash
netlify env:set UPSTASH_REDIS_URL "https://xxx.upstash.io"
netlify env:set UPSTASH_REDIS_TOKEN "xxx"
netlify env:set DATABASE_URL "postgres://..."
```

**Local Development (.env):**
```bash
# .env (gitignored!)
UPSTASH_REDIS_URL=https://xxx.upstash.io
UPSTASH_REDIS_TOKEN=xxx
DATABASE_URL=postgres://...
```

---

## Database Setup

### Upstash Redis

1. Go to https://console.upstash.com
2. Create new Redis database
3. Select region closest to Netlify deployment
4. Copy REST URL and Token
5. Add to environment variables

**Usage in Functions:**
```typescript
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

// Example operations
await redis.set('key', 'value');
await redis.get('key');
await redis.hset('hash', { field: 'value' });
await redis.hgetall('hash');
```

### Neon Postgres

1. Go to https://neon.tech
2. Create new project
3. Copy connection string
4. Add to environment variables

**Usage in Functions:**
```typescript
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// Example query
const result = await sql`
  SELECT * FROM seeds 
  WHERE id = ${seedId}
`;
```

**Schema Migration:**
```sql
-- Run in Neon SQL Editor
CREATE TABLE seeds (
  id VARCHAR(12) PRIMARY KEY,
  metadata JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  play_count INTEGER DEFAULT 1
);

CREATE TABLE leaderboard_entries (
  id SERIAL PRIMARY KEY,
  seed VARCHAR(12),
  player_name VARCHAR(50),
  rounds INTEGER NOT NULL,
  final_trust DECIMAL(5,4) NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

---

## Deployment

### Automatic Deployment

1. Connect GitHub repo in Netlify Dashboard
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
3. Push to main branch → Auto deploy

### Manual Deployment

```bash
# Build locally
npm run build

# Deploy preview
netlify deploy

# Deploy to production
netlify deploy --prod
```

### Branch Deploys

- `main` → Production (your-site.netlify.app)
- `develop` → Preview (develop--your-site.netlify.app)
- Pull requests → Unique preview URL

---

## Monitoring

### Function Logs

```bash
# Real-time logs
netlify functions:log

# Specific function
netlify functions:log seed-create
```

### Netlify Dashboard

1. Go to Functions tab
2. View invocations, errors, duration
3. Set up alerts for failures

### Upstash Dashboard

- Monitor Redis usage
- View request metrics
- Check latency

---

## Performance Optimization

### Edge Functions (Optional)

For ultra-low latency, consider Edge Functions:

```typescript
// netlify/edge-functions/hello.ts
export default async (request: Request) => {
  return new Response('Hello from the Edge!');
};
```

Configure in `netlify.toml`:
```toml
[[edge_functions]]
  path = "/api/edge/*"
  function = "hello"
```

### Caching

```typescript
// Set cache headers in functions
return {
  statusCode: 200,
  headers: {
    ...headers,
    'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
  },
  body: JSON.stringify(data),
};
```

### Bundle Optimization

```typescript
// Only import what you need
import { Redis } from '@upstash/redis';
// Not: import * as Upstash from '@upstash/redis';
```

---

## Troubleshooting

### Function Not Found (404)

- Check file is in `netlify/functions/`
- Verify `netlify.toml` functions path
- Run `netlify functions:list` to verify

### Environment Variables Not Working

- Check variable is set for correct scope
- Restart `netlify dev` after changes
- Verify with `netlify env:list`

### CORS Errors

Ensure all functions return proper headers:
```typescript
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};
```

### Build Failures

- Check Node version in `netlify.toml`
- Run `npm run build` locally first
- Review build logs in Netlify Dashboard

---

## Security Checklist

- [ ] Environment variables not committed to git
- [ ] CORS configured appropriately
- [ ] Rate limiting implemented
- [ ] Input validation in all functions
- [ ] No sensitive data in client bundle
- [ ] HTTPS enforced (automatic with Netlify)

---

## Useful Commands

```bash
# Start local dev
netlify dev

# List functions
netlify functions:list

# Invoke function locally
netlify functions:invoke seed-create --payload '{"seed":"test123"}'

# View environment
netlify env:list

# Open site
netlify open

# View deploy status
netlify status

# Clear cache and redeploy
netlify deploy --prod --clear
```

---

*Last updated: 2025-01*
*Version: 1.0.0*
