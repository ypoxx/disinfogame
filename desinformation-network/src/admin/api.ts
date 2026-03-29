// ===========================================
// ADMIN API CLIENT
// Kommuniziert mit den Sprite-Studio Netlify Functions
// ===========================================

import type {
  ImprovePromptRequest,
  ImprovePromptResponse,
  GenerateImageRequest,
  GenerateImageResponse,
  InpaintRequest,
  InpaintResponse,
} from './types';

function getAdminToken(): string {
  return sessionStorage.getItem('admin_token') || '';
}

async function adminFetch<T>(endpoint: string, body: unknown): Promise<T> {
  const response = await fetch(`/api/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': getAdminToken(),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
    throw new Error(error.error || `Fehler ${response.status}`);
  }

  return response.json();
}

export async function improvePrompt(request: ImprovePromptRequest): Promise<ImprovePromptResponse> {
  return adminFetch<ImprovePromptResponse>('sprite-improve', request);
}

export async function generateImages(request: GenerateImageRequest): Promise<GenerateImageResponse> {
  return adminFetch<GenerateImageResponse>('sprite-generate', request);
}

export async function inpaintImage(request: InpaintRequest): Promise<InpaintResponse> {
  return adminFetch<InpaintResponse>('sprite-inpaint', request);
}

export type ApiStatus = {
  openai: boolean;
  google: boolean;
};

export async function checkApiStatus(): Promise<ApiStatus> {
  const results: ApiStatus = { openai: false, google: false };

  try {
    // Quick test: send a minimal request to each endpoint
    const openaiRes = await fetch('/api/sprite-improve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': getAdminToken(),
      },
      body: JSON.stringify({ userPrompt: 'test', assetType: 'element' }),
    });
    // 401 = auth ok but key bad, 500 = key missing, 200 = works
    results.openai = openaiRes.ok;
  } catch {
    // Network error
  }

  try {
    const googleRes = await fetch('/api/sprite-generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': getAdminToken(),
      },
      body: JSON.stringify({ prompt: 'test pixel art dot', numImages: 1 }),
    });
    results.google = googleRes.ok;
  } catch {
    // Network error
  }

  return results;
}
