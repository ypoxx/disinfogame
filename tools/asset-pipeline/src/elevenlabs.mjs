// ===========================================
// ELEVENLABS (SFX, Musik, TTS) — Headless
// ===========================================
// Spiegel von sprite-tool/src/lib/studio/elevenlabs.ts (gleiche Endpunkte,
// Clamps und Fehlertexte), Key aus ELEVENLABS_API_KEY.
// Benötigte Netz-Freigabe: api.elevenlabs.io

const BASE = process.env.ELEVENLABS_API_BASE || 'https://api.elevenlabs.io/v1';
const TTS_MODEL = process.env.ELEVENLABS_TTS_MODEL || 'eleven_multilingual_v2';
const AUDIO_FORMAT = process.env.ELEVENLABS_AUDIO_FORMAT || 'mp3_44100_128';

export function requireElevenKey() {
  const key = process.env.ELEVENLABS_API_KEY?.trim();
  if (!key) {
    throw new Error('ELEVENLABS_API_KEY fehlt. Als Umgebungsvariable setzen (Allowlist: api.elevenlabs.io).');
  }
  return key;
}

async function toError(res) {
  let detail = '';
  try {
    const j = await res.json();
    const d = j?.detail;
    detail = typeof d === 'string' ? d : d?.message || JSON.stringify(j);
  } catch {
    detail = await res.text().catch(() => '');
  }
  if (res.status === 401) return new Error('ElevenLabs-Key ungültig (401).');
  if (res.status === 422) return new Error(`ElevenLabs: ungültige Anfrage (422): ${String(detail).slice(0, 300)}`);
  if (res.status === 429) return new Error('ElevenLabs: Rate-Limit/Guthaben erreicht (429).');
  return new Error(`ElevenLabs-Fehler ${res.status}: ${String(detail).slice(0, 300)}`);
}

async function postAudio(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'xi-api-key': requireElevenKey(), 'Content-Type': 'application/json', accept: 'audio/mpeg' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await toError(res);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length === 0) throw new Error('ElevenLabs lieferte kein Audio.');
  return { buffer: buf, mime: 'audio/mpeg' };
}

export function generateSfx({ text, durationSeconds }) {
  const body = { text };
  if (durationSeconds) body.duration_seconds = Math.min(Math.max(durationSeconds, 0.5), 30);
  return postAudio(`/sound-generation?output_format=${AUDIO_FORMAT}`, body);
}

export function composeMusic({ prompt, lengthMs }) {
  const body = { prompt };
  if (lengthMs) body.music_length_ms = Math.min(Math.max(Math.round(lengthMs), 3000), 300000);
  return postAudio(`/music?output_format=${AUDIO_FORMAT}`, body);
}

export function synthesizeSpeech({ text, voiceId, modelId }) {
  if (!voiceId) throw new Error('Keine Stimme gewählt (voiceId fehlt) — config/voices.json pflegen.');
  const body = { text, model_id: modelId || TTS_MODEL };
  return postAudio(`/text-to-speech/${encodeURIComponent(voiceId)}?output_format=${AUDIO_FORMAT}`, body);
}

export async function listVoices() {
  const res = await fetch(`${BASE}/voices`, { headers: { 'xi-api-key': requireElevenKey() } });
  if (!res.ok) throw await toError(res);
  const j = await res.json();
  return j.voices ?? [];
}
