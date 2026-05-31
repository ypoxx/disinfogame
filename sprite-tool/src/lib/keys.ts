// ===========================================
// API-KEYS im Browser (localStorage) — nur lokal, nie ins Repo
// ===========================================
//
// Die in der UI eingegebenen Keys werden lokal im Browser gespeichert und
// pro Request als Header an die lokalen API-Routen geschickt (siehe
// providers.ts). Fehlt ein UI-Key, greift serverseitig der .env.local-Fallback.

import { KEY_HEADERS, type ProviderId } from '@/lib/providers';

const STORAGE_KEY = 'asset-studio-keys';

export type ApiKeys = Partial<Record<ProviderId, string>>;

export function loadKeys(): ApiKeys {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ApiKeys) : {};
  } catch {
    return {};
  }
}

export function saveKeys(keys: ApiKeys): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
}

/** Header mit allen gesetzten UI-Keys — an fetch() für die lokalen API-Routen anhängen. */
export function keyHeaders(keys: ApiKeys = loadKeys()): Record<string, string> {
  const headers: Record<string, string> = {};
  for (const provider of Object.keys(KEY_HEADERS) as ProviderId[]) {
    const value = keys[provider]?.trim();
    if (value) headers[KEY_HEADERS[provider]] = value;
  }
  return headers;
}
