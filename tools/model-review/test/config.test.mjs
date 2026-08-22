import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseEnvText, loadEnvFile, getApiKey, maskKey, defaults, KonfigFehler } from '../src/config.mjs';

test('parseEnvText versteht Kommentare, Anführungszeichen und export', () => {
  const e = parseEnvText(`
# Kommentar
OPENROUTER_API_KEY="sk-or-v1-geheim"
export MODEL_REVIEW_MODEL=anbieter/modell
LEER=
'KAPUTT
`);
  assert.equal(e.OPENROUTER_API_KEY, 'sk-or-v1-geheim');
  assert.equal(e.MODEL_REVIEW_MODEL, 'anbieter/modell');
  assert.equal(e.LEER, '');
  assert.ok(!('KAPUTT' in e));
});

test('loadEnvFile überschreibt gesetzte Variablen NICHT', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mr-'));
  const datei = path.join(dir, '.env');
  fs.writeFileSync(datei, 'OPENROUTER_API_KEY=aus-datei\nANDERES=aus-datei');
  const env = { OPENROUTER_API_KEY: 'aus-umgebung' };
  loadEnvFile(datei, env);
  assert.equal(env.OPENROUTER_API_KEY, 'aus-umgebung');
  assert.equal(env.ANDERES, 'aus-datei');
});

test('loadEnvFile ist geräuschlos, wenn keine .env existiert', () => {
  assert.deepEqual(loadEnvFile('/gibt/es/nicht/.env', {}), {});
});

test('getApiKey erklärt beide Wege, wenn nichts gesetzt ist', () => {
  assert.throws(() => getApiKey({}), (err) => err instanceof KonfigFehler && /\.env/.test(err.message));
  assert.equal(getApiKey({ OPENROUTER_API_KEY: '  sk-or-v1-abc  ' }), 'sk-or-v1-abc');
});

// Der Schlüssel darf in keiner Ausgabe und in keinem Protokoll vollständig auftauchen.
test('maskKey zeigt nie den ganzen Schlüssel', () => {
  const key = 'sk-or-v1-0123456789abcdef';
  const m = maskKey(key);
  assert.ok(!m.includes('0123456789'), m);
  assert.equal(maskKey('kurz'), '***');
  assert.equal(maskKey(undefined), '***');
});

test('defaults sind sichere Standardwerte', () => {
  const d = defaults({});
  assert.equal(d.denyDataCollection, true, 'Daten-Sammlung ist standardmäßig ausgeschlossen');
  assert.ok(d.maxCostUsd > 0 && d.maxCostUsd <= 5, 'Kostenbremse ist scharf gestellt');
  assert.match(d.baseUrl, /^https:\/\/openrouter\.ai/);
});

test('defaults sind per Env überschreibbar', () => {
  const d = defaults({
    MODEL_REVIEW_MAX_COST_USD: '0.25',
    MODEL_REVIEW_MAX_TOKENS: '2000',
    MODEL_REVIEW_ALLOW_DATA_COLLECTION: '1',
  });
  assert.equal(d.maxCostUsd, 0.25);
  assert.equal(d.maxCompletionTokens, 2000);
  assert.equal(d.denyDataCollection, false);
});

test('unsinnige Env-Werte fallen auf die Standardwerte zurück', () => {
  const d = defaults({ MODEL_REVIEW_MAX_COST_USD: 'viel', MODEL_REVIEW_MAX_TOKENS: '-5' });
  assert.equal(d.maxCostUsd, defaults({}).maxCostUsd);
  assert.equal(d.maxCompletionTokens, defaults({}).maxCompletionTokens);
});
