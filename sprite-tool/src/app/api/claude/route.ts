// ===========================================
// API ROUTE: /api/claude
// Prompt-Verbesserung mit OpenAI
// ===========================================

import { NextRequest, NextResponse } from 'next/server';
import { improvePrompt } from '@/lib/claude';
import type { ImprovePromptRequest } from '@/types';
import { readFileSync } from 'fs';
import { join } from 'path';

// Lade Game Context beim Start
let gameContext: string = '';

function loadGameContext(): string {
  if (gameContext) return gameContext;

  try {
    const contextPath = join(process.cwd(), 'public', 'context', 'game-style-guide.md');
    gameContext = readFileSync(contextPath, 'utf-8');
  } catch (error) {
    console.warn('Game context konnte nicht geladen werden:', error);
    gameContext = 'Soviet-brutalist pixel art style, muted colors, 1970s-80s aesthetic.';
  }

  return gameContext;
}

export async function POST(request: NextRequest) {
  try {
    const body: ImprovePromptRequest = await request.json();

    // Validierung
    if (!body.userPrompt || typeof body.userPrompt !== 'string') {
      return NextResponse.json(
        { error: 'userPrompt ist erforderlich' },
        { status: 400 }
      );
    }

    if (!body.assetType || !['sprite', 'scene', 'element'].includes(body.assetType)) {
      return NextResponse.json(
        { error: 'assetType muss sprite, scene oder element sein' },
        { status: 400 }
      );
    }

    // Lade Spiel-Kontext
    const context = loadGameContext();

    // OpenAI aufrufen
    const result = await improvePrompt(
      body.userPrompt,
      body.assetType,
      context,
      body.additionalContext
    );

    return NextResponse.json(result);

  } catch (error) {
    console.error('OpenAI API Error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';

    // Prüfe auf API Key Fehler
    if (errorMessage.includes('API_KEY') || errorMessage.includes('401')) {
      return NextResponse.json(
        { error: 'API Key ungültig oder nicht konfiguriert' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
