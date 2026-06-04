// ===========================================
// API ROUTE: /api/director
// Regie-Assistent (Claude) — Stil-Richtungen, Shot-Prompts, Varianten-Kritik, Chat
// ===========================================

import { NextRequest, NextResponse } from 'next/server';
import { getKeyFromHeaders } from '@/lib/providers';
import {
  proposeStyleDirections,
  writeShotPrompt,
  critiqueVariants,
  chatTurn,
  suggestVoiceCast,
} from '@/lib/studio/directorServer';
import type { ChatMessage } from '@/lib/studio/directorTypes';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const task = body.task as string | undefined;
    const apiKey = getKeyFromHeaders(request.headers, 'anthropic');

    switch (task) {
      case 'style-directions': {
        const directions = await proposeStyleDirections({
          brief: String(body.brief ?? ''),
          styleGuide: String(body.styleGuide ?? ''),
          conceptSummary: String(body.conceptSummary ?? ''),
          count: Number(body.count ?? 3),
          apiKey,
        });
        return NextResponse.json({ directions });
      }
      case 'shot-prompt': {
        const result = await writeShotPrompt({
          anchor: String(body.anchor ?? ''),
          styleGuide: String(body.styleGuide ?? ''),
          shot: body.shot as { id: string; kind: string; title: string; brief: string },
          subject: body.subject as { name?: string; role?: string; traits?: string[] } | undefined,
          notes: String(body.notes ?? ''),
          apiKey,
        });
        return NextResponse.json(result);
      }
      case 'critique': {
        const images = Array.isArray(body.images) ? (body.images as string[]) : [];
        if (images.length === 0) {
          return NextResponse.json({ error: 'Keine Bilder zur Bewertung übergeben.' }, { status: 400 });
        }
        const result = await critiqueVariants({
          anchor: String(body.anchor ?? ''),
          subject: String(body.subject ?? ''),
          images,
          apiKey,
        });
        return NextResponse.json(result);
      }
      case 'chat': {
        const messages = Array.isArray(body.messages) ? (body.messages as ChatMessage[]) : [];
        const result = await chatTurn({
          context: String(body.context ?? ''),
          messages,
          apiKey,
        });
        return NextResponse.json(result);
      }
      case 'voice-cast': {
        const result = await suggestVoiceCast({
          npc: body.npc as { name: string; role?: string; traits?: string[] },
          voices: Array.isArray(body.voices)
            ? (body.voices as { voice_id: string; name: string; labels?: Record<string, string>; category?: string }[])
            : [],
          apiKey,
        });
        return NextResponse.json(result);
      }
      default:
        return NextResponse.json({ error: `Unbekannte task: ${task}` }, { status: 400 });
    }
  } catch (error) {
    console.error('Director API Error:', error);
    const message = error instanceof Error ? error.message : 'Unbekannter Fehler';
    const isKey = message.includes('API_KEY') || message.includes('401') || message.includes('Key');
    return NextResponse.json({ error: message }, { status: isKey ? 401 : 500 });
  }
}
