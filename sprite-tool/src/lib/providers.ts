// ===========================================
// PROVIDER KEYS — UI-Eingabe ↔ .env.local-Fallback
// ===========================================
//
// Keys können in der Tool-UI (Einstellungen) eingegeben und pro Request
// über einen Header mitgeschickt werden. Fehlt der Header, greifen die
// Lib-Funktionen NUR LOKAL auf process.env (.env.local) zurück — im
// Production-Build ist dieser Fallback deaktiviert (siehe lib/claude.ts /
// lib/nanoBanana.ts). Keys werden bewusst per HEADER (nicht im JSON-Body)
// übertragen und nie geloggt/persistiert.

export const KEY_HEADERS = {
  google: 'x-google-ai-key',
  anthropic: 'x-anthropic-key',
  elevenlabs: 'x-elevenlabs-key',
} as const;

export type ProviderId = keyof typeof KEY_HEADERS;

/** Liest einen optionalen, in der UI eingegebenen Key aus den Request-Headern. */
export function getKeyFromHeaders(headers: Headers, provider: ProviderId): string | undefined {
  const value = headers.get(KEY_HEADERS[provider])?.trim();
  return value ? value : undefined;
}
