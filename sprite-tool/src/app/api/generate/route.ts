// ===========================================
// API ROUTE: /api/generate
// Bildgenerierung mit Nano Banana Pro
// ===========================================

import { NextRequest, NextResponse } from 'next/server';
import { generateImages } from '@/lib/nanoBanana';
import type { GenerateImageRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: GenerateImageRequest = await request.json();

    // Validierung
    if (!body.prompt || typeof body.prompt !== 'string') {
      return NextResponse.json(
        { error: 'prompt ist erforderlich' },
        { status: 400 }
      );
    }

    // Anzahl Bilder begrenzen
    const numImages = Math.min(Math.max(body.numImages || 4, 1), 4);

    // Bilder generieren
    const result = await generateImages({
      prompt: body.prompt,
      referenceImages: body.referenceImages,
      aspectRatio: body.aspectRatio as '1:1' | '16:9' | '9:16' | '4:3' | '3:4',
      thinkingMode: body.thinkingMode,
      seed: body.seed,
      numImages,
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('Generate API Error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';

    // Prüfe auf API Key Fehler
    if (errorMessage.includes('API_KEY') || errorMessage.includes('401') || errorMessage.includes('403')) {
      return NextResponse.json(
        { error: 'Google AI API Key ungültig oder nicht konfiguriert' },
        { status: 401 }
      );
    }

    // Rate Limit
    if (errorMessage.includes('429') || errorMessage.includes('rate')) {
      return NextResponse.json(
        { error: 'Rate Limit erreicht. Bitte warte einen Moment.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
