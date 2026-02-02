// ===========================================
// API ROUTE: /api/inpaint
// Inpainting mit Nano Banana Pro
// ===========================================

import { NextRequest, NextResponse } from 'next/server';
import { inpaintImage } from '@/lib/nanoBanana';
import type { InpaintRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: InpaintRequest = await request.json();

    // Validierung
    if (!body.image || typeof body.image !== 'string') {
      return NextResponse.json(
        { error: 'image (base64) ist erforderlich' },
        { status: 400 }
      );
    }

    if (!body.prompt || typeof body.prompt !== 'string') {
      return NextResponse.json(
        { error: 'prompt ist erforderlich' },
        { status: 400 }
      );
    }

    // Inpainting durchführen
    const result = await inpaintImage({
      image: body.image,
      mask: body.mask,
      prompt: body.prompt,
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('Inpaint API Error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';

    // Prüfe auf API Key Fehler
    if (errorMessage.includes('API_KEY') || errorMessage.includes('401') || errorMessage.includes('403')) {
      return NextResponse.json(
        { error: 'Google AI API Key ungültig oder nicht konfiguriert' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
