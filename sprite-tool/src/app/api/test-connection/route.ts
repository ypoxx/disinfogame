// ===========================================
// API ROUTE: /api/test-connection
// "Verbindung testen" für die Keys-UI (echter Auth-Check)
// ===========================================

import { NextRequest, NextResponse } from 'next/server';
import { testConnection as testGoogle } from '@/lib/nanoBanana';
import { testConnection as testAnthropic } from '@/lib/claude';
import { testConnection as testEleven } from '@/lib/studio/elevenlabs';
import { getKeyFromHeaders, type ProviderId } from '@/lib/providers';

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { provider?: string };
  const provider = body.provider as ProviderId | undefined;

  if (provider !== 'google' && provider !== 'anthropic' && provider !== 'elevenlabs') {
    return NextResponse.json(
      { error: 'provider muss google, anthropic oder elevenlabs sein' },
      { status: 400 }
    );
  }

  if (provider === 'google') {
    const ok = await testGoogle(getKeyFromHeaders(request.headers, 'google'));
    return NextResponse.json({ ok });
  }

  if (provider === 'anthropic') {
    const ok = await testAnthropic(getKeyFromHeaders(request.headers, 'anthropic'));
    return NextResponse.json({ ok });
  }

  // ElevenLabs (Audio, M5): echter Auth-Check über die Stimmen-Liste.
  const ok = await testEleven(getKeyFromHeaders(request.headers, 'elevenlabs'));
  return NextResponse.json({ ok });
}
