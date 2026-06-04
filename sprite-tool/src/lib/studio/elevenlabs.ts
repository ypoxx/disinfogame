// ===========================================
// ELEVENLABS (Audio, M5) — Server
// ===========================================
// Nur serverseitig. SFX, Musik (Music v2), TTS, Stimmen-Liste. Auth via
// xi-api-key (Nutzer-Key aus dem Header). KEIN Server-Fallback → das offene
// /api ist ohne UI-Key wirkungslos (gleiche Sicherheitslogik wie sonst).
// Endpunkte/Modelle via ENV überschreibbar. Response ist Binär-Audio (mp3).

const BASE = process.env.ELEVENLABS_API_BASE || 'https://api.elevenlabs.io/v1';
const TTS_MODEL = process.env.ELEVENLABS_TTS_MODEL || 'eleven_multilingual_v2';
const AUDIO_FORMAT = process.env.ELEVENLABS_AUDIO_FORMAT || 'mp3_44100_128';

export interface AudioResult {
  audioBase64: string;
  mime: string;
}

export interface ElVoice {
  voice_id: string;
  name: string;
  category?: string;
  labels?: Record<string, string>;
}

function requireKey(apiKey?: string): string {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('Kein ElevenLabs-Key: bitte in der Tool-UI unter ⚙️ Einstellungen eingeben.');
  }
  return apiKey.trim();
}

async function toError(res: Response): Promise<Error> {
  let detail = '';
  try {
    const j = (await res.json()) as { detail?: unknown };
    const d = j?.detail as { message?: string } | string | undefined;
    detail = typeof d === 'string' ? d : d?.message || JSON.stringify(j);
  } catch {
    detail = await res.text().catch(() => '');
  }
  if (res.status === 401) return new Error('ElevenLabs-Key ungültig (401).');
  if (res.status === 422) return new Error(`ElevenLabs: ungültige Anfrage (422): ${String(detail).slice(0, 300)}`);
  if (res.status === 429) return new Error('ElevenLabs: Rate-Limit/Guthaben erreicht (429).');
  return new Error(`ElevenLabs-Fehler ${res.status}: ${String(detail).slice(0, 300)}`);
}

async function postAudio(path: string, apiKey: string, body: Record<string, unknown>): Promise<AudioResult> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json', accept: 'audio/mpeg' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await toError(res);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length === 0) throw new Error('ElevenLabs lieferte kein Audio.');
  return { audioBase64: buf.toString('base64'), mime: 'audio/mpeg' };
}

export function generateSfx(input: {
  text: string;
  durationSeconds?: number;
  promptInfluence?: number;
  apiKey?: string;
}): Promise<AudioResult> {
  const key = requireKey(input.apiKey);
  const body: Record<string, unknown> = { text: input.text };
  if (input.durationSeconds) body.duration_seconds = Math.min(Math.max(input.durationSeconds, 0.5), 30);
  if (input.promptInfluence !== undefined) body.prompt_influence = Math.min(Math.max(input.promptInfluence, 0), 1);
  return postAudio(`/sound-generation?output_format=${AUDIO_FORMAT}`, key, body);
}

export function composeMusic(input: { prompt: string; lengthMs?: number; apiKey?: string }): Promise<AudioResult> {
  const key = requireKey(input.apiKey);
  const body: Record<string, unknown> = { prompt: input.prompt };
  if (input.lengthMs) body.music_length_ms = Math.min(Math.max(Math.round(input.lengthMs), 3000), 300000);
  return postAudio(`/music?output_format=${AUDIO_FORMAT}`, key, body);
}

export function synthesizeSpeech(input: {
  text: string;
  voiceId: string;
  modelId?: string;
  apiKey?: string;
}): Promise<AudioResult> {
  const key = requireKey(input.apiKey);
  if (!input.voiceId) throw new Error('Keine Stimme gewählt (voiceId fehlt).');
  const body: Record<string, unknown> = { text: input.text, model_id: input.modelId || TTS_MODEL };
  return postAudio(`/text-to-speech/${encodeURIComponent(input.voiceId)}?output_format=${AUDIO_FORMAT}`, key, body);
}

export async function listVoices(apiKey?: string): Promise<ElVoice[]> {
  const key = requireKey(apiKey);
  const res = await fetch(`${BASE}/voices`, { headers: { 'xi-api-key': key } });
  if (!res.ok) throw await toError(res);
  const j = (await res.json()) as { voices?: ElVoice[] };
  return j.voices ?? [];
}

export async function testConnection(apiKey?: string): Promise<boolean> {
  try {
    await listVoices(apiKey);
    return true;
  } catch {
    return false;
  }
}
