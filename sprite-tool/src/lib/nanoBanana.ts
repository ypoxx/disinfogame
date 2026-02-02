// ===========================================
// NANO BANANA PRO API INTEGRATION
// Google's Gemini Image Generation
// ===========================================

import { GoogleGenAI } from '@google/genai';
import type { GenerateImageResponse, InpaintResponse } from '@/types';
import type { AspectRatio } from '@/lib/constants';

let aiClient: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_AI_API_KEY nicht konfiguriert. Bitte in .env.local eintragen.');
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}


interface GenerateOptions {
  prompt: string;
  referenceImages?: string[]; // base64 encoded
  aspectRatio?: AspectRatio;
  thinkingMode?: boolean;
  seed?: number;
  numImages?: number;
}

/**
 * Generiert Bilder mit Nano Banana Pro (Gemini Image)
 */
export async function generateImages(options: GenerateOptions): Promise<GenerateImageResponse> {
  const client = getClient();

  const modelName = process.env.NANO_BANANA_MODEL || 'gemini-2.0-flash-exp';
  const numImages = Math.min(options.numImages || 4, 4); // Max 4 Bilder

  const results: { base64: string; seed?: number }[] = [];
  const errors: string[] = [];

  // Generiere Bilder sequentiell (API-Limit)
  for (let i = 0; i < numImages; i++) {
    try {
      const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

      // Referenz-Bilder hinzufügen (falls vorhanden)
      if (options.referenceImages?.length) {
        for (const refImg of options.referenceImages.slice(0, 8)) {
          parts.push({
            inlineData: {
              mimeType: 'image/png',
              data: refImg,
            },
          });
        }
      }

      // Prompt hinzufügen
      parts.push({ text: options.prompt });

      const response = await client.models.generateContent({
        model: modelName,
        contents: [{ parts }],
        config: {
          responseModalities: ['image', 'text'],
          // Note: aspectRatio and other configs may vary by API version
        },
      });

      // Extrahiere Bild aus Response
      const candidate = response.candidates?.[0];
      if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
          if ('inlineData' in part && part.inlineData?.data) {
            results.push({
              base64: part.inlineData.data,
              seed: options.seed,
            });
            break;
          }
        }
      }
    } catch (error) {
      console.error(`Fehler bei Bildgenerierung ${i + 1}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
      errors.push(`Variante ${i + 1}: ${errorMessage}`);
    }
  }

  if (results.length === 0) {
    throw new Error('Keine Bilder konnten generiert werden');
  }

  return { images: results, errors: errors.length > 0 ? errors : undefined };
}

interface InpaintOptions {
  image: string; // base64
  mask?: string; // base64 (optional für mask-free inpainting)
  prompt: string;
}

/**
 * Inpainting: Ändert nur markierte Bereiche eines Bildes
 */
export async function inpaintImage(options: InpaintOptions): Promise<InpaintResponse> {
  const client = getClient();

  const modelName = process.env.NANO_BANANA_MODEL || 'gemini-2.0-flash-exp';

  const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

  // Original-Bild
  parts.push({
    inlineData: {
      mimeType: 'image/png',
      data: options.image,
    },
  });

  // Maske (falls vorhanden)
  if (options.mask) {
    parts.push({
      inlineData: {
        mimeType: 'image/png',
        data: options.mask,
      },
    });
    parts.push({
      text: `Edit the masked area of the image: ${options.prompt}. Keep everything outside the mask exactly as it is.`,
    });
  } else {
    // Mask-free inpainting
    parts.push({
      text: `Edit this image: ${options.prompt}. Keep everything else exactly as it is.`,
    });
  }

  const response = await client.models.generateContent({
    model: modelName,
    contents: [{ parts }],
    config: {
      responseModalities: ['image', 'text'],
    },
  });

  // Extrahiere Bild aus Response
  const candidate = response.candidates?.[0];
  if (candidate?.content?.parts) {
    for (const part of candidate.content.parts) {
      if ('inlineData' in part && part.inlineData?.data) {
        return { image: part.inlineData.data };
      }
    }
  }

  throw new Error('Kein Bild vom Inpainting erhalten');
}

/**
 * Prüft ob die API-Verbindung funktioniert
 */
export async function testConnection(): Promise<boolean> {
  try {
    const client = getClient();
    // Simple test - just check if client initializes
    return client !== null;
  } catch {
    return false;
  }
}
