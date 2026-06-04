// ===========================================
// SOUND (M5) — Client-Wrapper für /api/sound
// ===========================================

import { keyHeaders } from '../keys';

export interface AudioResult {
  audioBase64: string;
  mime: string;
}

export interface Voice {
  voice_id: string;
  name: string;
  category?: string;
  labels?: Record<string, string>;
}

async function postSound<T>(body: Record<string, unknown>): Promise<T> {
  const res = await fetch('/api/sound', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...keyHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error || `Sound-Anfrage fehlgeschlagen (HTTP ${res.status})`);
  }
  return (await res.json()) as T;
}

export function genSfx(text: string, durationSeconds?: number): Promise<AudioResult> {
  return postSound<AudioResult>({ kind: 'sfx', text, durationSeconds });
}

export function genMusic(prompt: string, lengthMs?: number): Promise<AudioResult> {
  return postSound<AudioResult>({ kind: 'music', prompt, lengthMs });
}

export function genSpeech(text: string, voiceId: string): Promise<AudioResult> {
  return postSound<AudioResult>({ kind: 'tts', text, voiceId });
}

export async function getVoices(): Promise<Voice[]> {
  const data = await postSound<{ voices: Voice[] }>({ kind: 'voices' });
  return data.voices ?? [];
}
