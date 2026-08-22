// Ende-zu-Ende: die CLI gegen einen lokalen Attrappen-Server, einmal komplett
// mit --live. Beweist ohne echten Netzzugriff, dass Paket → Aufruf → Bericht
// zusammenpassen und dass die Kostenbremse wirklich vor dem Aufruf greift.
import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const CLI = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'cli.mjs');

const KATALOG = [
  {
    id: 'anbieter/gross',
    context_length: 200_000,
    pricing: { prompt: '0.000003', completion: '0.000015' },
    architecture: { input_modalities: ['text', 'image'] },
  },
  {
    id: 'anbieter/teuer',
    context_length: 200_000,
    pricing: { prompt: '0.001', completion: '0.002' },
    architecture: { input_modalities: ['text', 'image'] },
  },
  {
    id: 'anbieter/blind',
    context_length: 200_000,
    pricing: { prompt: '0.000001', completion: '0.000002' },
    architecture: { input_modalities: ['text'] },
  },
];

// 1×1-PNG als echter Screenshot-Ersatz.
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
);

function screenshotOrdner(namen = ['01_title.png', '05_hud.png']) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mr-shots-'));
  for (const n of namen) fs.writeFileSync(path.join(dir, n), PNG);
  return dir;
}

async function attrappe() {
  const anfragen = [];
  const s = http.createServer((req, res) => {
    let roh = '';
    req.on('data', (c) => (roh += c));
    req.on('end', () => {
      const body = roh ? JSON.parse(roh) : null;
      anfragen.push({ url: req.url, body });

      if (req.url.endsWith('/models')) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ data: KATALOG }));
      }

      // OpenRouter spiegelt das angeforderte Modell zurück; ohne `model` im
      // Rumpf greift die Kontovorgabe — hier ein fester Platzhalter.
      const modell = body?.model || 'konto/standardmodell';
      const antwort = '## Kurzfazit\nDie Siegachse ist entkoppelt.';
      const usage = { prompt_tokens: 30_000, completion_tokens: 900, cost: 0.1035 };

      // Strom-Antwort (Standardpfad der CLI): Server-Sent Events wie bei OpenRouter.
      if (body?.stream) {
        res.writeHead(200, { 'Content-Type': 'text/event-stream' });
        const sende = (o) => res.write(`data: ${JSON.stringify(o)}\n\n`);
        sende({ model: modell, choices: [{ delta: { reasoning: 'kurz nachgedacht' } }] });
        sende({ model: modell, choices: [{ delta: { content: antwort.slice(0, 12) } }] });
        sende({ model: modell, choices: [{ delta: { content: antwort.slice(12) }, finish_reason: 'stop' }] });
        sende({ model: modell, usage, choices: [{ delta: {} }] });
        res.write('data: [DONE]\n\n');
        return res.end();
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          id: 'gen-1',
          model: modell,
          choices: [{ message: { content: antwort }, finish_reason: 'stop' }],
          usage,
        })
      );
    });
  });
  await new Promise((r) => s.listen(0, '127.0.0.1', r));
  return {
    baseUrl: `http://127.0.0.1:${s.address().port}`,
    anfragen,
    schliessen: () => new Promise((r) => s.close(r)),
  };
}

function laufe(args, env = {}) {
  return new Promise((resolve) => {
    execFile(
      process.execPath,
      [CLI, ...args],
      { env: { ...process.env, OPENROUTER_API_KEY: 'sk-test', NO_PROXY: '127.0.0.1,localhost', ...env } },
      (err, stdout, stderr) => resolve({ code: err?.code ?? 0, stdout, stderr })
    );
  });
}

test('review ohne --live sendet nichts', async () => {
  const s = await attrappe();
  try {
    const r = await laufe(['review', '--lens', 'bildung', '--model', 'anbieter/gross'], {
      OPENROUTER_BASE_URL: s.baseUrl,
    });
    assert.equal(r.code, 0, r.stderr);
    assert.match(r.stdout, /TROCKENLAUF — nichts gesendet, keine Kosten/);
    assert.equal(
      s.anfragen.filter((a) => a.url.includes('chat/completions')).length,
      0,
      'im Trockenlauf darf kein Review-Aufruf rausgehen'
    );
  } finally {
    await s.schliessen();
  }
});

test('review --live schreibt einen vollständigen Bericht', async () => {
  const s = await attrappe();
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'mr-out-'));
  try {
    const r = await laufe(['review', '--lens', 'bildung', '--model', 'anbieter/gross', '--live'], {
      OPENROUTER_BASE_URL: s.baseUrl,
      MODEL_REVIEW_OUT_DIR: out,
    });
    assert.equal(r.code, 0, r.stderr);

    const dateien = fs.readdirSync(out);
    assert.equal(dateien.length, 1, `erwartet: ein Bericht, war: ${dateien.join(', ')}`);
    assert.match(dateien[0], /^\d{4}-\d{2}-\d{2}_bildung_anbieter-gross\.md$/);

    const md = fs.readFileSync(path.join(out, dateien[0]), 'utf8');
    assert.match(md, /Die Siegachse ist entkoppelt\./, 'Antwort des Modells fehlt');
    assert.match(md, /docs\/SOUL\.md/, 'Quellenverzeichnis fehlt');
    assert.match(md, /\$0\.10/, 'gemeldete Kosten fehlen');
    assert.match(md, /Hypothesen/, 'Warnhinweis fehlt');

    const aufruf = s.anfragen.find((a) => a.url.includes('chat/completions'));
    assert.ok(aufruf, 'kein Review-Aufruf angekommen');
    assert.match(aufruf.body.messages[1].content, /Kontext-Paket/);
    assert.match(aufruf.body.messages[1].content, /SOUL\.md/);
  } finally {
    await s.schliessen();
  }
});

test('die Kostenbremse greift VOR dem Aufruf', async () => {
  const s = await attrappe();
  try {
    const r = await laufe(['review', '--lens', 'balance', '--model', 'anbieter/teuer', '--live', '--max-cost', '0.5'], {
      OPENROUTER_BASE_URL: s.baseUrl,
    });
    assert.equal(r.code, 1);
    assert.match(r.stderr, /Kostenbremse/);
    assert.equal(
      s.anfragen.filter((a) => a.url.includes('chat/completions')).length,
      0,
      'bei gerissener Bremse darf nichts gesendet werden'
    );
  } finally {
    await s.schliessen();
  }
});

test('unbekanntes Modell wird vor dem Aufruf abgefangen, mit Vorschlag', async () => {
  const s = await attrappe();
  try {
    const r = await laufe(['review', '--lens', 'bildung', '--model', 'falsch/gross', '--live'], {
      OPENROUTER_BASE_URL: s.baseUrl,
    });
    assert.equal(r.code, 1);
    assert.match(r.stderr, /gibt es bei OpenRouter nicht/);
    assert.match(r.stderr, /anbieter\/gross/, 'Vorschlag fehlt');
  } finally {
    await s.schliessen();
  }
});

test('mehrere Modelle in einem Lauf ergeben mehrere Berichte', async () => {
  const s = await attrappe();
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'mr-out-'));
  try {
    const r = await laufe(
      ['review', '--lens', 'bildung', '--model', 'anbieter/gross', '--model', 'anbieter/teuer', '--live', '--max-cost', '99'],
      { OPENROUTER_BASE_URL: s.baseUrl, MODEL_REVIEW_OUT_DIR: out }
    );
    assert.equal(r.code, 0, r.stderr);
    assert.equal(fs.readdirSync(out).length, 2);
    assert.match(r.stdout, /Fertig: 2\/2 Berichte/);
  } finally {
    await s.schliessen();
  }
});

test('unbekannte Linse endet mit Hilfestellung statt Absturz', async () => {
  const r = await laufe(['review', '--lens', 'quatsch']);
  assert.equal(r.code, 1);
  assert.match(r.stderr, /Unbekannte Linse/);
  assert.match(r.stderr, /konzept/);
});

test('--frage ersetzt die Linsen-Frage im Prompt', async () => {
  const s = await attrappe();
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'mr-out-'));
  try {
    await laufe(
      ['review', '--lens', 'bildung', '--model', 'anbieter/gross', '--live', '--frage', 'Ist Igor glaubwürdig?'],
      { OPENROUTER_BASE_URL: s.baseUrl, MODEL_REVIEW_OUT_DIR: out }
    );
    const aufruf = s.anfragen.find((a) => a.url.includes('chat/completions'));
    assert.match(aufruf.body.messages[1].content, /^Ist Igor glaubwürdig\?/);
    const md = fs.readFileSync(path.join(out, fs.readdirSync(out)[0]), 'utf8');
    assert.match(md, /Ist Igor glaubwürdig\?/, 'die gestellte Frage gehört in den Bericht');
  } finally {
    await s.schliessen();
  }
});

test('ui-Linse schickt die Screenshots mit und nennt sie im Bericht', async () => {
  const s = await attrappe();
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'mr-out-'));
  const shots = screenshotOrdner();
  try {
    const r = await laufe(
      ['review', '--lens', 'ui', '--model', 'anbieter/gross', '--bild', shots, '--live', '--max-cost', '99'],
      { OPENROUTER_BASE_URL: s.baseUrl, MODEL_REVIEW_OUT_DIR: out }
    );
    assert.equal(r.code, 0, r.stderr);

    const aufruf = s.anfragen.find((a) => a.url.includes('chat/completions'));
    const inhalt = aufruf.body.messages[1].content;
    assert.ok(Array.isArray(inhalt), 'mit Bildern muss der user-Inhalt eine ContentPart-Liste sein');
    assert.equal(inhalt.filter((t) => t.type === 'image_url').length, 2);
    assert.ok(inhalt.some((t) => t.text === 'Screenshot: 05_hud.png'));
    assert.match(
      inhalt[0].text,
      /Erster Eindruck/,
      'die ui-Linse muss ihre eigene Antwortform mitschicken, nicht die Text-Form'
    );

    const md = fs.readFileSync(path.join(out, fs.readdirSync(out)[0]), 'utf8');
    assert.match(md, /Gezeigtes Anschauungsmaterial \(2 Screenshot\(s\)\)/);
    assert.match(md, /`05_hud\.png`/);
  } finally {
    await s.schliessen();
  }
});

// Bilder an ein blindes Modell zu schicken kostet Geld und bringt nichts.
test('ein Modell ohne Bild-Eingabe wird vor dem Aufruf abgelehnt', async () => {
  const s = await attrappe();
  const shots = screenshotOrdner();
  try {
    const r = await laufe(['review', '--lens', 'ui', '--model', 'anbieter/blind', '--bild', shots, '--live'], {
      OPENROUTER_BASE_URL: s.baseUrl,
    });
    assert.equal(r.code, 1);
    assert.match(r.stderr, /kann keine Bilder lesen/);
    assert.match(r.stderr, /anbieter\/gross/, 'sehende Alternative fehlt');
    assert.equal(s.anfragen.filter((a) => a.url.includes('chat/completions')).length, 0);
  } finally {
    await s.schliessen();
  }
});

test('--model konto lässt das Modellfeld weg und benennt den Bericht nach der Antwort', async () => {
  const s = await attrappe();
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'mr-out-'));
  try {
    const r = await laufe(['review', '--lens', 'ui', '--model', 'konto', '--live'], {
      OPENROUTER_BASE_URL: s.baseUrl,
      MODEL_REVIEW_OUT_DIR: out,
    });
    assert.equal(r.code, 0, r.stderr);
    const aufruf = s.anfragen.find((a) => a.url.includes('chat/completions'));
    assert.ok(!('model' in aufruf.body), 'bei der Kontovorgabe darf kein model gesendet werden');
    assert.match(r.stdout, /Kontovorgabe/);
    assert.equal(fs.readdirSync(out)[0], `${new Date().toISOString().slice(0, 10)}_ui_konto-standardmodell.md`);
  } finally {
    await s.schliessen();
  }
});

test('ohne Bilder bleibt der Aufruf ein reiner Text-Aufruf', async () => {
  const s = await attrappe();
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'mr-out-'));
  try {
    await laufe(['review', '--lens', 'ui', '--model', 'anbieter/gross', '--live', '--max-cost', '99'], {
      OPENROUTER_BASE_URL: s.baseUrl,
      MODEL_REVIEW_OUT_DIR: out,
    });
    const aufruf = s.anfragen.find((a) => a.url.includes('chat/completions'));
    assert.equal(typeof aufruf.body.messages[1].content, 'string');
    const md = fs.readFileSync(path.join(out, fs.readdirSync(out)[0]), 'utf8');
    assert.ok(!md.includes('Anschauungsmaterial'), 'ohne Bilder keine Medien-Tabelle');
  } finally {
    await s.schliessen();
  }
});

test('der Strom setzt die Antwort aus mehreren Stücken korrekt zusammen', async () => {
  const s = await attrappe();
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'mr-out-'));
  try {
    const r = await laufe(['review', '--lens', 'bildung', '--model', 'anbieter/gross', '--live', '--max-cost', '99'], {
      OPENROUTER_BASE_URL: s.baseUrl,
      MODEL_REVIEW_OUT_DIR: out,
    });
    assert.equal(r.code, 0, r.stderr);
    const aufruf = s.anfragen.find((a) => a.url.includes('chat/completions'));
    assert.equal(aufruf.body.stream, true, 'Strom ist der Standardpfad');
    const md = fs.readFileSync(path.join(out, fs.readdirSync(out)[0]), 'utf8');
    assert.match(md, /## Kurzfazit\nDie Siegachse ist entkoppelt\./, 'die Stücke müssen lückenlos zusammengesetzt sein');
    assert.match(md, /\$0\.10/, 'die Nutzung kommt im letzten Strom-Stück');
  } finally {
    await s.schliessen();
  }
});

test('--kein-strom holt die Antwort am Stück', async () => {
  const s = await attrappe();
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'mr-out-'));
  try {
    const r = await laufe(
      ['review', '--lens', 'bildung', '--model', 'anbieter/gross', '--live', '--max-cost', '99', '--kein-strom'],
      { OPENROUTER_BASE_URL: s.baseUrl, MODEL_REVIEW_OUT_DIR: out }
    );
    assert.equal(r.code, 0, r.stderr);
    const aufruf = s.anfragen.find((a) => a.url.includes('chat/completions'));
    assert.ok(!aufruf.body.stream, 'ohne Strom darf kein stream-Feld gesetzt sein');
    assert.match(fs.readFileSync(path.join(out, fs.readdirSync(out)[0]), 'utf8'), /Siegachse/);
  } finally {
    await s.schliessen();
  }
});

test('--denk-aufwand wird als reasoning.effort mitgeschickt', async () => {
  const s = await attrappe();
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'mr-out-'));
  try {
    await laufe(
      ['review', '--lens', 'bildung', '--model', 'anbieter/gross', '--live', '--max-cost', '99', '--denk-aufwand', 'high'],
      { OPENROUTER_BASE_URL: s.baseUrl, MODEL_REVIEW_OUT_DIR: out }
    );
    const aufruf = s.anfragen.find((a) => a.url.includes('chat/completions'));
    assert.deepEqual(aufruf.body.reasoning, { effort: 'high' });
  } finally {
    await s.schliessen();
  }
});

test('ohne --denk-aufwand bleibt reasoning weg (Modell-Standard gilt)', async () => {
  const s = await attrappe();
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'mr-out-'));
  try {
    await laufe(['review', '--lens', 'bildung', '--model', 'anbieter/gross', '--live', '--max-cost', '99'], {
      OPENROUTER_BASE_URL: s.baseUrl,
      MODEL_REVIEW_OUT_DIR: out,
    });
    const aufruf = s.anfragen.find((a) => a.url.includes('chat/completions'));
    assert.equal(aufruf.body.reasoning, undefined);
  } finally {
    await s.schliessen();
  }
});

// --- Direkter OpenAI-Weg -----------------------------------------------
// OpenAI spricht fast dasselbe Protokoll wie OpenRouter, aber nicht ganz:
// `max_completion_tokens` statt `max_tokens`, `reasoning_effort` statt
// `reasoning:{effort}` — und unbekannte Felder (provider, usage) quittiert es
// mit HTTP 400. Diese Unterschiede sind hier festgenagelt.
test('--anbieter openai sendet den OpenAI-Rumpf, ohne OpenRouter-Felder', async () => {
  const s = await attrappe();
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'mr-out-'));
  try {
    const r = await laufe(
      ['review', '--lens', 'bildung', '--anbieter', 'openai', '--model', 'gpt-5.6-sol',
       '--live', '--max-tokens', '4000', '--denk-aufwand', 'high'],
      { OPENAI_BASE_URL: s.baseUrl, OPENAI_API_KEY: 'sk-openai-test', MODEL_REVIEW_OUT_DIR: out }
    );
    assert.equal(r.code, 0, r.stderr);

    const aufruf = s.anfragen.find((a) => a.url.includes('chat/completions'));
    assert.equal(aufruf.body.model, 'gpt-5.6-sol', 'Modellname ohne "openai/"-Präfix');
    assert.equal(aufruf.body.max_completion_tokens, 4000, 'OpenAI verlangt max_completion_tokens');
    assert.equal(aufruf.body.max_tokens, undefined, 'max_tokens würde OpenAI mit 400 ablehnen');
    assert.equal(aufruf.body.reasoning_effort, 'high');
    assert.equal(aufruf.body.reasoning, undefined, 'reasoning-Objekt ist OpenRouter-Sprache');
    assert.equal(aufruf.body.provider, undefined, 'provider-Routing kennt OpenAI nicht');
    assert.equal(aufruf.body.usage, undefined, 'usage.include kennt OpenAI nicht');
  } finally {
    await s.schliessen();
  }
});

test('--anbieter openai fragt den Modell-Katalog gar nicht erst ab', async () => {
  const s = await attrappe();
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'mr-out-'));
  try {
    await laufe(
      ['review', '--lens', 'bildung', '--anbieter', 'openai', '--model', 'gpt-5.6-sol', '--live', '--max-tokens', '4000'],
      { OPENAI_BASE_URL: s.baseUrl, OPENAI_API_KEY: 'sk-openai-test', MODEL_REVIEW_OUT_DIR: out }
    );
    assert.equal(
      s.anfragen.filter((a) => a.url.endsWith('/models')).length,
      0,
      'OpenAIs Katalog nennt keine Preise — die Abfrage brächte nichts'
    );
  } finally {
    await s.schliessen();
  }
});

test('--anbieter openai verlangt OPENAI_API_KEY, nicht den OpenRouter-Schlüssel', async () => {
  const r = await laufe(['review', '--lens', 'bildung', '--anbieter', 'openai', '--model', 'gpt-5.6-sol', '--live'], {
    OPENAI_API_KEY: '',
  });
  assert.equal(r.code, 1);
  assert.match(r.stderr, /Kein OPENAI_API_KEY gefunden/);
});

test('unbekannter Anbieter wird mit Auswahl gemeldet', async () => {
  const r = await laufe(['review', '--lens', 'bildung', '--anbieter', 'quatsch']);
  assert.equal(r.code, 1);
  assert.match(r.stderr, /Unbekannter Anbieter/);
  assert.match(r.stderr, /openrouter, openai/);
});
