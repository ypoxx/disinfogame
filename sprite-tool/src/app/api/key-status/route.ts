// ===========================================
// API ROUTE: /api/key-status
// ===========================================
// Sagt der UI, für welche Provider serverseitig ein .env.local-FALLBACK
// verfügbar ist. Das gilt BEWUSST nur lokal — in Produktion ist der Env-Fallback
// hart deaktiviert (siehe lib/claude.ts / lib/nanoBanana.ts), daher meldet die
// Route dort immer false. So kann die Regie-UI ihre Aktionen im dokumentierten
// .env.local-Workflow freigeben, ohne die Prod-Härtung zu lockern. Es werden NUR
// Booleans geliefert, nie Key-Werte.

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export function GET() {
  const dev = process.env.NODE_ENV !== 'production';
  return NextResponse.json({
    google: dev && Boolean(process.env.GOOGLE_AI_API_KEY),
    anthropic: dev && Boolean(process.env.ANTHROPIC_API_KEY),
    elevenlabs: false, // ElevenLabs hat keinen Env-Fallback (immer UI-Key nötig)
  });
}
