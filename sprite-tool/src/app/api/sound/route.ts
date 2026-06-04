// ===========================================
// API ROUTE: /api/sound  (M5 — ElevenLabs)
// SFX · Musik · TTS · Stimmen-Liste
// ===========================================

import { NextRequest, NextResponse } from 'next/server';
import { getKeyFromHeaders } from '@/lib/providers';
import { generateSfx, composeMusic, synthesizeSpeech, listVoices } from '@/lib/studio/elevenlabs';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const kind = body.kind as string | undefined;
    const apiKey = getKeyFromHeaders(request.headers, 'elevenlabs');

    switch (kind) {
      case 'sfx': {
        const text = String(body.text ?? '');
        if (!text.trim()) return NextResponse.json({ error: 'text ist erforderlich' }, { status: 400 });
        const result = await generateSfx({
          text,
          durationSeconds: body.durationSeconds ? Number(body.durationSeconds) : undefined,
          apiKey,
        });
        return NextResponse.json(result);
      }
      case 'music': {
        const prompt = String(body.prompt ?? '');
        if (!prompt.trim()) return NextResponse.json({ error: 'prompt ist erforderlich' }, { status: 400 });
        const result = await composeMusic({
          prompt,
          lengthMs: body.lengthMs ? Number(body.lengthMs) : undefined,
          apiKey,
        });
        return NextResponse.json(result);
      }
      case 'tts': {
        const text = String(body.text ?? '');
        const voiceId = String(body.voiceId ?? '');
        if (!text.trim()) return NextResponse.json({ error: 'text ist erforderlich' }, { status: 400 });
        if (!voiceId) return NextResponse.json({ error: 'voiceId ist erforderlich' }, { status: 400 });
        const result = await synthesizeSpeech({ text, voiceId, apiKey });
        return NextResponse.json(result);
      }
      case 'voices': {
        const voices = await listVoices(apiKey);
        return NextResponse.json({ voices });
      }
      default:
        return NextResponse.json({ error: `Unbekannte kind: ${kind}` }, { status: 400 });
    }
  } catch (error) {
    console.error('Sound API Error:', error);
    const message = error instanceof Error ? error.message : 'Unbekannter Fehler';
    const status = message.includes('Kein ElevenLabs-Key') || message.includes('401')
      ? 401
      : message.includes('429')
        ? 429
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
