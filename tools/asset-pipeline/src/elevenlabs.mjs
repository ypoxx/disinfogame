// ===========================================
// ELEVENLABS (SFX, Musik, TTS) — Headless
// ===========================================
// Spiegel von sprite-tool/src/lib/studio/elevenlabs.ts (gleiche Endpunkte,
// Clamps und Fehlertexte), Key aus ELEVENLABS_API_KEY.
// Benötigte Netz-Freigabe: api.elevenlabs.io

const BASE = process.env.ELEVENLABS_API_BASE || 'https://api.elevenlabs.io/v1';
const TTS_MODEL = process.env.ELEVENLABS_TTS_MODEL || 'eleven_multilingual_v2';
/** Voice Design („Text to Voice") — erzeugt synthetische Stimmen aus einer Beschreibung. */
const TTV_MODEL = process.env.ELEVENLABS_TTV_MODEL || 'eleven_ttv_v3';
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

// ---------- Voice Design (synthetische Stimmen) ----------
//
// Zwei Schritte, wie im ElevenLabs-Studio: erst Kandidaten („previews") aus
// einer Beschreibung hören, dann den Gewinner als echte Stimme anlegen. Nur so
// entsteht eine EIGENE Stimme — die Bibliotheks-Stimmen (Daniel & Co.) hören
// Spieler in jedem zweiten Projekt.
//
// Die Endpunkte wurden umbenannt; der ältere Pfad bleibt als Rückfall drin,
// damit ein Konto mit älterem API-Stand nicht ins Leere läuft.

async function postJson(paths, body) {
  let lastError = null;
  for (const path of paths) {
    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: { 'xi-api-key': requireElevenKey(), 'Content-Type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) return res.json();
    // Nur ein „gibt es hier nicht" rechtfertigt den Rückfall auf den Altpfad.
    if (res.status !== 404 && res.status !== 405) throw await toError(res);
    lastError = await toError(res);
  }
  throw lastError ?? new Error('ElevenLabs: kein Voice-Design-Endpunkt erreichbar.');
}

/**
 * Kandidaten-Stimmen zu einer Beschreibung erzeugen.
 * @returns {Promise<{previews: Array<{generated_voice_id: string, audio_base_64: string, media_type?: string, duration_secs?: number}>, text?: string}>}
 */
export async function designVoice({ description, text, modelId }) {
  const d = String(description ?? '').trim();
  const t = String(text ?? '').trim();
  if (d.length < 20) throw new Error('Stimm-Beschreibung zu kurz (ElevenLabs verlangt ≥ 20 Zeichen).');
  if (t.length < 100) throw new Error('Probetext zu kurz (ElevenLabs verlangt ≥ 100 Zeichen).');
  const json = await postJson(['/text-to-voice/design', '/text-to-voice/create-previews'], {
    voice_description: d.slice(0, 1000),
    text: t.slice(0, 1000),
    model_id: modelId || TTV_MODEL,
    auto_generate_text: false,
  });
  const previews = json?.previews ?? [];
  if (previews.length === 0) throw new Error('ElevenLabs lieferte keine Stimm-Kandidaten.');
  return { previews, text: json?.text };
}

/**
 * Gewählten Kandidaten dauerhaft in der Stimmbibliothek anlegen.
 * @returns {Promise<{voice_id: string, name?: string}>}
 */
export async function createVoiceFromPreview({ name, description, generatedVoiceId }) {
  if (!generatedVoiceId) throw new Error('generated_voice_id fehlt — erst designVoice() laufen lassen.');
  const json = await postJson(['/text-to-voice', '/text-to-voice/create-voice-from-preview'], {
    voice_name: name,
    voice_description: String(description ?? '').slice(0, 1000),
    generated_voice_id: generatedVoiceId,
  });
  if (!json?.voice_id) throw new Error('ElevenLabs lieferte keine voice_id.');
  return json;
}
