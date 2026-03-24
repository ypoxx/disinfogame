// ===========================================
// API ROUTE: /api/setup
// API-Key Setup & Validierung
// Nur auf localhost erlaubt!
// ===========================================

import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

// Security: Nur localhost-Requests erlauben
function isLocalhost(request: NextRequest): boolean {
  const host = request.headers.get('host') || '';
  return (
    host.startsWith('localhost') ||
    host.startsWith('127.0.0.1') ||
    host.startsWith('0.0.0.0')
  );
}

// GET: Aktuellen Key-Status prüfen
export async function GET(request: NextRequest) {
  if (!isLocalhost(request)) {
    return NextResponse.json(
      { error: 'Setup nur auf localhost erlaubt' },
      { status: 403 }
    );
  }

  const envPath = join(process.cwd(), '.env.local');
  const hasEnvFile = existsSync(envPath);

  let openaiKey = process.env.OPENAI_API_KEY || '';
  let googleKey = process.env.GOOGLE_AI_API_KEY || '';

  // Maskierte Keys für Anzeige (nur letzte 4 Zeichen)
  const maskKey = (key: string): string => {
    if (!key || key.includes('xxx')) return '';
    if (key.length < 8) return '';
    return '****' + key.slice(-4);
  };

  return NextResponse.json({
    hasEnvFile,
    openai: {
      configured: !!openaiKey && !openaiKey.includes('xxx'),
      masked: maskKey(openaiKey),
    },
    google: {
      configured: !!googleKey && !googleKey.includes('xxx'),
      masked: maskKey(googleKey),
    },
  });
}

// POST: Keys speichern und/oder testen
export async function POST(request: NextRequest) {
  if (!isLocalhost(request)) {
    return NextResponse.json(
      { error: 'Setup nur auf localhost erlaubt' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { action, openaiKey, googleKey } = body as {
      action: 'save' | 'test';
      openaiKey?: string;
      googleKey?: string;
    };

    if (action === 'test') {
      return await testKeys(openaiKey, googleKey);
    }

    if (action === 'save') {
      return await saveKeys(openaiKey, googleKey);
    }

    return NextResponse.json({ error: 'Ungültige Aktion' }, { status: 400 });
  } catch (error) {
    console.error('Setup Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unbekannter Fehler' },
      { status: 500 }
    );
  }
}

// Keys testen (ohne zu speichern)
async function testKeys(
  openaiKey?: string,
  googleKey?: string
): Promise<NextResponse> {
  const results: {
    openai?: { valid: boolean; error?: string };
    google?: { valid: boolean; error?: string };
  } = {};

  // OpenAI testen
  if (openaiKey) {
    try {
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${openaiKey}` },
      });
      if (res.ok) {
        results.openai = { valid: true };
      } else {
        const data = await res.json().catch(() => ({}));
        results.openai = {
          valid: false,
          error: data?.error?.message || `HTTP ${res.status}`,
        };
      }
    } catch (e) {
      results.openai = {
        valid: false,
        error: e instanceof Error ? e.message : 'Verbindungsfehler',
      };
    }
  }

  // Google AI testen
  if (googleKey) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${googleKey}`
      );
      if (res.ok) {
        results.google = { valid: true };
      } else {
        const data = await res.json().catch(() => ({}));
        results.google = {
          valid: false,
          error: data?.error?.message || `HTTP ${res.status}`,
        };
      }
    } catch (e) {
      results.google = {
        valid: false,
        error: e instanceof Error ? e.message : 'Verbindungsfehler',
      };
    }
  }

  return NextResponse.json({ results });
}

// Keys in .env.local speichern
async function saveKeys(
  openaiKey?: string,
  googleKey?: string
): Promise<NextResponse> {
  const envPath = join(process.cwd(), '.env.local');

  // Bestehende .env.local lesen (falls vorhanden)
  let existingContent = '';
  if (existsSync(envPath)) {
    existingContent = readFileSync(envPath, 'utf-8');
  }

  // Keys aktualisieren oder hinzufügen
  const lines = existingContent.split('\n');
  const keyMap = new Map<string, string>();

  // Bestehende Key-Value-Paare parsen
  for (const line of lines) {
    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (match) {
      keyMap.set(match[1], match[2]);
    }
  }

  // Neue Keys setzen (nur wenn angegeben)
  if (openaiKey) {
    keyMap.set('OPENAI_API_KEY', openaiKey);
  }
  if (googleKey) {
    keyMap.set('GOOGLE_AI_API_KEY', googleKey);
  }

  // Datei schreiben
  const header = `# ===========================================
# SPRITE TOOL - API KEYS (auto-generated)
# ===========================================
# NIEMALS committen! Steht in .gitignore.
# ===========================================

`;

  const keyLines = Array.from(keyMap.entries())
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  writeFileSync(envPath, header + keyLines + '\n', 'utf-8');

  return NextResponse.json({
    saved: true,
    message:
      'Keys gespeichert! Server muss neu gestartet werden (npm run dev), damit die Keys geladen werden.',
    needsRestart: true,
  });
}
