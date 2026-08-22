// Prüft den API-Pfad gegen einen lokalen Attrappen-Server: Kopfzeilen, Rumpf,
// Fehlerbehandlung, Wiederholversuche. Kein echter Netzzugriff, keine Kosten.
import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {
  listeModelle, schluesselInfo, frageModell, findeModell, baueNutzerinhalt, kannBilder, sehendeModelle, ApiFehler,
} from '../src/openrouter.mjs';

const KATALOG = [
  {
    id: 'anbieter/gross',
    context_length: 200_000,
    pricing: { prompt: '0.000003', completion: '0.000015' },
    architecture: { input_modalities: ['text', 'image'] },
  },
  {
    id: 'anbieter/klein',
    context_length: 128_000,
    pricing: { prompt: '0', completion: '0' },
    architecture: { input_modalities: ['text'] },
  },
];

/** Attrappe starten; `handler` bekommt (req, res, body). */
async function server(handler) {
  const s = http.createServer((req, res) => {
    let roh = '';
    req.on('data', (c) => (roh += c));
    req.on('end', () => handler(req, res, roh ? JSON.parse(roh) : null));
  });
  await new Promise((r) => s.listen(0, '127.0.0.1', r));
  return { baseUrl: `http://127.0.0.1:${s.address().port}`, schliessen: () => new Promise((r) => s.close(r)) };
}

function json(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
}

test('listeModelle liefert den Katalog', async () => {
  const s = await server((req, res) => json(res, 200, { data: KATALOG }));
  try {
    const k = await listeModelle({ apiKey: 'sk-test', baseUrl: s.baseUrl });
    assert.equal(k.length, 2);
    assert.equal(k[0].id, 'anbieter/gross');
  } finally {
    await s.schliessen();
  }
});

test('schluesselInfo maskiert den Schlüssel in der Antwort', async () => {
  const s = await server((req, res) => json(res, 200, { data: { label: 'test', usage: 1.5, limit: 10 } }));
  try {
    const info = await schluesselInfo({ apiKey: 'sk-or-v1-0123456789abcdef', baseUrl: s.baseUrl });
    assert.equal(info.usage, 1.5);
    assert.ok(!info.maskiert.includes('0123456789'));
  } finally {
    await s.schliessen();
  }
});

test('frageModell schickt Auth, Rollen, Limits und die Anbieter-Sperre mit', async () => {
  let gesehen = null;
  let kopf = null;
  const s = await server((req, res, body) => {
    gesehen = body;
    kopf = req.headers;
    json(res, 200, {
      id: 'gen-1',
      model: 'anbieter/gross',
      choices: [{ message: { content: 'Befund: zwei Ökonomien.' }, finish_reason: 'stop' }],
      usage: { prompt_tokens: 100, completion_tokens: 20, cost: 0.0042 },
    });
  });
  try {
    const a = await frageModell({
      apiKey: 'sk-test', baseUrl: s.baseUrl, model: 'anbieter/gross',
      system: 'Du bist Gutachter.', user: 'Beurteile.', maxTokens: 8000, temperature: 0.3,
    });
    assert.equal(a.text, 'Befund: zwei Ökonomien.');
    assert.equal(a.usage.cost, 0.0042);
    assert.equal(a.verwendetesModell, 'anbieter/gross');

    assert.equal(kopf.authorization, 'Bearer sk-test');
    assert.equal(gesehen.model, 'anbieter/gross');
    assert.equal(gesehen.max_tokens, 8000);
    assert.equal(gesehen.messages[0].role, 'system');
    assert.equal(gesehen.messages[1].content, 'Beurteile.');
    assert.deepEqual(gesehen.provider, { data_collection: 'deny' }, 'Daten-Sperre muss mitgehen');
    assert.deepEqual(gesehen.usage, { include: true }, 'ohne usage.include gäbe es keine Kostenmeldung');
  } finally {
    await s.schliessen();
  }
});

test('frageModell lässt die Anbieter-Sperre nur auf ausdrücklichen Wunsch weg', async () => {
  let gesehen = null;
  const s = await server((req, res, body) => {
    gesehen = body;
    json(res, 200, { choices: [{ message: { content: 'ok' } }] });
  });
  try {
    await frageModell({
      apiKey: 'k', baseUrl: s.baseUrl, model: 'm', system: 's', user: 'u',
      maxTokens: 10, temperature: 0, denyDataCollection: false,
    });
    assert.equal(gesehen.provider, undefined);
  } finally {
    await s.schliessen();
  }
});

test('leere Antwort wird als Fehler gemeldet, nicht als leerer Bericht', async () => {
  const s = await server((req, res) =>
    json(res, 200, { choices: [{ message: { content: '' }, finish_reason: 'content_filter' }] })
  );
  try {
    await assert.rejects(
      frageModell({ apiKey: 'k', baseUrl: s.baseUrl, model: 'm', system: 's', user: 'u', maxTokens: 10 }),
      (err) => err instanceof ApiFehler && /content_filter/.test(err.message)
    );
  } finally {
    await s.schliessen();
  }
});

test('Fehler mit HTTP 200 im Rumpf werden erkannt', async () => {
  const s = await server((req, res) => json(res, 200, { error: { message: 'Kein Guthaben' } }));
  try {
    await assert.rejects(
      frageModell({ apiKey: 'k', baseUrl: s.baseUrl, model: 'm', system: 's', user: 'u', maxTokens: 10 }),
      /Kein Guthaben/
    );
  } finally {
    await s.schliessen();
  }
});

test('401 wird nicht wiederholt und nennt den Grund', async () => {
  let aufrufe = 0;
  const s = await server((req, res) => {
    aufrufe++;
    json(res, 401, { error: { message: 'Ungültiger Schlüssel' } });
  });
  try {
    await assert.rejects(
      listeModelle({ apiKey: 'falsch', baseUrl: s.baseUrl }),
      (err) => err instanceof ApiFehler && err.status === 401 && /Ungültiger Schlüssel/.test(err.message)
    );
    assert.equal(aufrufe, 1, 'ein Schlüsselfehler wird durch Wiederholen nicht besser');
  } finally {
    await s.schliessen();
  }
});

test('429 wird wiederholt und kann noch gelingen', async () => {
  let aufrufe = 0;
  const s = await server((req, res) => {
    aufrufe++;
    if (aufrufe === 1) return json(res, 429, { error: { message: 'zu schnell' } });
    json(res, 200, { data: KATALOG });
  });
  try {
    const k = await listeModelle({ apiKey: 'k', baseUrl: s.baseUrl });
    assert.equal(k.length, 2);
    assert.equal(aufrufe, 2);
  } finally {
    await s.schliessen();
  }
});

test('findeModell schlägt bei Tippfehlern Ähnliches vor', () => {
  assert.equal(findeModell(KATALOG, 'anbieter/gross').model.id, 'anbieter/gross');
  const daneben = findeModell(KATALOG, 'anderer/klein');
  assert.equal(daneben.model, null);
  assert.deepEqual(daneben.vorschlaege, ['anbieter/klein']);
});

test('baueNutzerinhalt bleibt ohne Bilder ein schlichter String', () => {
  assert.equal(baueNutzerinhalt('nur Text'), 'nur Text');
});

// Ohne den Dateinamen im Text kann die Antwort nicht sagen, WELCHER Screen gemeint ist.
test('baueNutzerinhalt kündigt jedes Bild mit seinem Dateinamen an', () => {
  const teile = baueNutzerinhalt('Frage', [
    { name: '01_title.png', dataUrl: 'data:image/png;base64,AAA' },
    { name: '05_hud.png', dataUrl: 'data:image/png;base64,BBB' },
  ]);
  assert.equal(teile[0].text, 'Frage');
  const namen = teile.filter((t) => t.type === 'text' && t.text.startsWith('Screenshot:')).map((t) => t.text);
  assert.deepEqual(namen, ['Screenshot: 01_title.png', 'Screenshot: 05_hud.png']);
  const bilder = teile.filter((t) => t.type === 'image_url');
  assert.equal(bilder.length, 2);
  assert.equal(bilder[0].image_url.url, 'data:image/png;base64,AAA');
});

test('frageModell schickt Bilder als ContentParts im user-Inhalt', async () => {
  let gesehen = null;
  const s = await server((req, res, body) => {
    gesehen = body;
    json(res, 200, { model: 'anbieter/gross', choices: [{ message: { content: 'gesehen' } }] });
  });
  try {
    await frageModell({
      apiKey: 'k', baseUrl: s.baseUrl, model: 'anbieter/gross', system: 'sys', user: 'Beurteile die Optik.',
      bilder: [{ name: '05_hud.png', dataUrl: 'data:image/png;base64,AAA' }], maxTokens: 100, temperature: 0.3,
    });
    assert.equal(gesehen.messages[0].role, 'system');
    assert.equal(typeof gesehen.messages[0].content, 'string', 'Bilder gehören nur in die user-Rolle');
    assert.ok(Array.isArray(gesehen.messages[1].content));
    assert.ok(gesehen.messages[1].content.some((t) => t.type === 'image_url'));
  } finally {
    await s.schliessen();
  }
});

// "Kontovorgabe": ohne model-Feld nimmt OpenRouter das im Konto hinterlegte Modell.
test('frageModell lässt model weg, wenn keins genannt ist, und meldet das benutzte zurück', async () => {
  let gesehen = null;
  const s = await server((req, res, body) => {
    gesehen = body;
    json(res, 200, { model: 'konto/standardmodell', choices: [{ message: { content: 'ok' } }] });
  });
  try {
    const a = await frageModell({
      apiKey: 'k', baseUrl: s.baseUrl, model: null, system: 'sys', user: 'Frage', maxTokens: 100,
    });
    assert.ok(!('model' in gesehen), 'model darf gar nicht im Rumpf stehen');
    assert.equal(a.verwendetesModell, 'konto/standardmodell');
  } finally {
    await s.schliessen();
  }
});

test('kannBilder liest die Modalitäten aus dem Katalog', () => {
  assert.equal(kannBilder(KATALOG[0]), true);
  assert.equal(kannBilder(KATALOG[1]), false);
  assert.equal(kannBilder(undefined), false);
});

test('sehendeModelle schlägt nur Modelle mit Bild-Eingabe vor', () => {
  assert.deepEqual(sehendeModelle(KATALOG), ['anbieter/gross']);
});
