import type { Handler } from '@netlify/functions';

/**
 * ElevenLabs TTS Proxy
 *
 * Generates speech from text using ElevenLabs API.
 * API key stays server-side. Results can be cached in Redis.
 *
 * POST /api/tts-generate
 * Body: { text, voice_id?, model_id?, cache_key? }
 * Response: { audio_base64, content_type, cached }
 */

// Simple in-memory cache for development (Redis for production)
const audioCache = new Map<string, { audio: string; contentType: string }>();

function hashText(text: string, voiceId: string): string {
  // Simple hash for cache keys
  let hash = 0;
  const str = `${voiceId}:${text}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

const handler: Handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'ELEVENLABS_API_KEY not configured' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const {
      text,
      voice_id = '21m00Tcm4TlvDq8ikWAM', // Rachel (default)
      model_id = 'eleven_multilingual_v2',
      cache_key,
    } = body;

    if (!text || typeof text !== 'string') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'text is required' }),
      };
    }

    if (text.length > 500) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Text too long (max 500 chars)' }),
      };
    }

    // Check cache
    const cacheId = cache_key || hashText(text, voice_id);
    const cached = audioCache.get(cacheId);
    if (cached) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          audio_base64: cached.audio,
          content_type: cached.contentType,
          cached: true,
          cache_key: cacheId,
        }),
      };
    }

    // Call ElevenLabs API
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          model_id,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({
          error: `ElevenLabs API error: ${response.status}`,
          details: errorText,
        }),
      };
    }

    // Convert to base64
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const contentType = response.headers.get('content-type') || 'audio/mpeg';

    // Cache result
    audioCache.set(cacheId, { audio: base64, contentType });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        audio_base64: base64,
        content_type: contentType,
        cached: false,
        cache_key: cacheId,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

export { handler };
