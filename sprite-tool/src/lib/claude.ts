// ===========================================
// CLAUDE API INTEGRATION
// Prompt-Verbesserung mit Spiel-Kontext
// ===========================================

import Anthropic from '@anthropic-ai/sdk';
import type { AssetType, ImprovePromptResponse } from '@/types';

// Client wird server-side initialisiert
let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY nicht konfiguriert. Bitte in .env.local eintragen.');
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}

const SYSTEM_PROMPT = `Du bist ein Experte für Bild-KI-Prompts, spezialisiert auf Pixel-Art für Retro-Spiele.

DEINE AUFGABE:
1. Verbessere den User-Prompt für optimale Ergebnisse mit Nano Banana Pro (Google's Bild-KI)
2. Füge technische Details hinzu (Auflösung, Transparenz, Stil, Perspektive)
3. Behalte den Sowjet-Brutalismus-Stil des Spiels bei
4. Schlage 3-4 Variationen/Verbesserungen vor

SPIEL-KONTEXT:
- Strategie-Spiel über Desinformationskampagnen
- Ästhetik: Sowjet-Brutalismus der 1970er-80er
- Farben: Gedeckte Töne (Grau, Olive, Rost), Akzente in Sowjet-Rot
- Stil: 16-bit Pixel-Art (SNES-Ära)
- Atmosphäre: Bürokratisch, klaustrophobisch, kalt

ANTWORT-FORMAT (JSON):
{
  "improvedPrompt": "Der verbesserte, technisch präzise Prompt auf Englisch",
  "suggestions": ["Vorschlag 1", "Vorschlag 2", "Vorschlag 3"],
  "technicalNotes": "Kurze Erklärung der Änderungen"
}`;

export async function improvePrompt(
  userPrompt: string,
  assetType: AssetType,
  gameContext: string,
  additionalContext?: string
): Promise<ImprovePromptResponse> {
  const anthropic = getClient();

  const assetTypeInfo = {
    sprite: 'Sprite-Sheet mit mehreren Frames für Animation',
    scene: 'Hintergrund-Szene / Raum',
    element: 'Einzelnes Element / Möbelstück / Prop',
  };

  const userMessage = `
ASSET-TYP: ${assetTypeInfo[assetType]}

USER-PROMPT: "${userPrompt}"

${additionalContext ? `ZUSÄTZLICHER KONTEXT: ${additionalContext}` : ''}

STIL-GUIDE DES SPIELS:
${gameContext}

Bitte verbessere den Prompt und gib deine Antwort als JSON zurück.`;

  const response = await anthropic.messages.create({
    model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: userMessage,
      },
    ],
  });

  // Extract text content
  const textContent = response.content.find((block) => block.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('Keine Text-Antwort von Claude erhalten');
  }

  // Parse JSON response
  try {
    // Find JSON in response (might be wrapped in markdown code block)
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Kein JSON in der Antwort gefunden');
    }

    const parsed = JSON.parse(jsonMatch[0]) as ImprovePromptResponse;
    return {
      improvedPrompt: parsed.improvedPrompt || userPrompt,
      suggestions: parsed.suggestions || [],
      technicalNotes: parsed.technicalNotes || '',
    };
  } catch (parseError) {
    console.error('JSON Parse Error:', parseError);
    // Fallback: return original prompt
    return {
      improvedPrompt: userPrompt,
      suggestions: [],
      technicalNotes: 'Fehler beim Parsen der Claude-Antwort',
    };
  }
}
