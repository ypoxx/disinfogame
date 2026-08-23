// ===========================================
// KONFIGURATION — API-Schlüssel, Standardwerte, Env-Datei
// ===========================================
// Der Schlüssel kommt aus der Umgebung (OPENROUTER_API_KEY). Zusätzlich darf
// eine lokale, gitignorierte Datei tools/model-review/.env existieren — sie
// überschreibt NIE bereits gesetzte Env-Variablen.

import fs from 'node:fs';
import { ENV_FILE } from './paths.mjs';

/** Sehr einfacher KEY=VALUE-Parser (kein dotenv-Paket nötig). */
export function parseEnvText(text) {
  const out = {};
  for (const raw of String(text).split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim().replace(/^export\s+/, '');
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"') && value.length >= 2) ||
      (value.startsWith("'") && value.endsWith("'") && value.length >= 2)
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

/** .env einlesen, ohne bestehende Env-Variablen zu überschreiben. */
export function loadEnvFile(file = ENV_FILE, env = process.env) {
  if (!fs.existsSync(file)) return {};
  const parsed = parseEnvText(fs.readFileSync(file, 'utf8'));
  for (const [k, v] of Object.entries(parsed)) {
    if (env[k] === undefined || env[k] === '') env[k] = v;
  }
  return parsed;
}

export class KonfigFehler extends Error {}

/** Unterstützte Anbieter. OpenRouter ist der Regelfall; OpenAI der Direktweg. */
export const ANBIETER = {
  openrouter: {
    id: 'openrouter',
    baseUrl: (env = process.env) => env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
    schluesselVar: 'OPENROUTER_API_KEY',
    /** OpenRouter kennt Katalogpreise → Kostenbremse greift. */
    hatPreise: true,
    /** Nur OpenRouter kennt provider-Routing und usage.include. */
    routing: true,
    /** OpenRouter normalisiert `temperature` für jedes Modell. */
    nimmtTemperatur: true,
    /** Ob Clips überhaupt gehen, entscheidet dort das Modell (input_modalities). */
    kannVideo: null,
  },
  openai: {
    id: 'openai',
    baseUrl: (env = process.env) => env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
    schluesselVar: 'OPENAI_API_KEY',
    // OpenAIs /v1/models nennt keine Preise → keine Vorab-Schätzung möglich.
    hatPreise: false,
    routing: false,
    // Die Denk-Modelle der GPT-5-Reihe lehnen jedes `temperature` ab, das nicht
    // der Vorgabe 1 entspricht — gemessen am 2026-08-22 gegen gpt-5.6-sol:
    //   HTTP 400 · "Unsupported value: 'temperature' does not support 0.3 with
    //   this model. Only the default (1) value is supported."
    // Der Default 0.3 der CLI hätte also JEDEN OpenAI-Lauf gekippt. Deshalb
    // geht das Feld hier nur mit, wenn es ausdrücklich verlangt wurde.
    nimmtTemperatur: false,
    // OpenAIs /chat/completions kennt gar keinen `video_url`-Inhaltsteil — egal
    // welches Modell. Ohne diese Vorgabe würde `serie` Clip-Bündel an OpenAI
    // schicken, weil ohne Katalog niemand widerspricht: HTTP 400 statt Bericht.
    // Der Weg über Einzelbilder (`frames`) bleibt davon unberührt.
    kannVideo: false,
  },
};

export function findeAnbieter(name = 'openrouter') {
  const a = ANBIETER[name];
  if (!a) {
    throw new KonfigFehler(`Unbekannter Anbieter "${name}" — möglich: ${Object.keys(ANBIETER).join(', ')}`);
  }
  return a;
}

/** API-Schlüssel des Anbieters holen — mit einer Fehlermeldung, die weiterhilft. */
export function getApiKey(env = process.env, anbieter = ANBIETER.openrouter) {
  const name = anbieter.schluesselVar;
  const key = (env[name] || '').trim();
  if (!key) {
    throw new KonfigFehler(
      `Kein ${name} gefunden.\n` +
        `  Entweder:  export ${name}="..."\n` +
        '  oder:      tools/model-review/.env anlegen (Vorlage: .env.example) — die Datei ist gitignored.'
    );
  }
  return key;
}

/** Schlüssel für Ausgaben unkenntlich machen (nie vollständig drucken). */
export function maskKey(key) {
  const k = String(key || '');
  if (k.length <= 12) return '***';
  return `${k.slice(0, 8)}…${k.slice(-4)}`;
}

function numEnv(env, name, fallback) {
  const v = Number.parseFloat(env[name] ?? '');
  return Number.isFinite(v) && v >= 0 ? v : fallback;
}

function intEnv(env, name, fallback) {
  const v = Number.parseInt(env[name] ?? '', 10);
  return Number.isFinite(v) && v >= 0 ? v : fallback;
}

/** Standardwerte — alle per Env überschreibbar. */
export function defaults(env = process.env) {
  return {
    /** Basis-URL der OpenRouter-API. */
    baseUrl: env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
    /** Modell, wenn --model fehlt. */
    model: env.MODEL_REVIEW_MODEL || 'openai/gpt-5.1',
    /** Harte Kostenbremse pro Lauf (USD, Schätzung VOR dem Aufruf). */
    maxCostUsd: numEnv(env, 'MODEL_REVIEW_MAX_COST_USD', 1.0),
    /** Obergrenze der Antwortlänge. */
    maxCompletionTokens: intEnv(env, 'MODEL_REVIEW_MAX_TOKENS', 8000),
    /** Obergrenze des Kontext-Pakets in Zeichen (~ 4 Zeichen/Token). */
    maxContextChars: intEnv(env, 'MODEL_REVIEW_MAX_CONTEXT_CHARS', 320_000),
    /** Zeitlimit je API-Aufruf (ms) — Reviews denken lange. */
    timeoutMs: intEnv(env, 'MODEL_REVIEW_TIMEOUT_MS', 600_000),
    temperature: numEnv(env, 'MODEL_REVIEW_TEMPERATURE', 0.3),
    /** Nur Anbieter ohne Daten-Sammlung zulassen (siehe README §Datenschutz). */
    denyDataCollection: (env.MODEL_REVIEW_ALLOW_DATA_COLLECTION || '') !== '1',
  };
}
