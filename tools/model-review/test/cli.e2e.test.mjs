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
  { id: 'anbieter/gross', context_length: 200_000, pricing: { prompt: '0.000003', completion: '0.000015' } },
  { id: 'anbieter/teuer', context_length: 200_000, pricing: { prompt: '0.001', completion: '0.002' } },
];

async function attrappe() {
  const anfragen = [];
  const s = http.createServer((req, res) => {
    let roh = '';
    req.on('data', (c) => (roh += c));
    req.on('end', () => {
      anfragen.push({ url: req.url, body: roh ? JSON.parse(roh) : null });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      if (req.url.endsWith('/models')) return res.end(JSON.stringify({ data: KATALOG }));
      res.end(
        JSON.stringify({
          id: 'gen-1',
          model: 'anbieter/gross',
          choices: [{ message: { content: '## Kurzfazit\nDie Siegachse ist entkoppelt.' }, finish_reason: 'stop' }],
          usage: { prompt_tokens: 30_000, completion_tokens: 900, cost: 0.1035 },
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
