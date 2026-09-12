import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  schaetzeTokens, projiziere, digestJson, projiziereJson, baueKontext, ladeQuelle, QuellenFehler,
} from '../src/pack.mjs';

const DATEN = {
  meta: { version: 2 },
  actions: [
    { id: 'a1', label_de: 'Eins', costs: { budget: 10 }, narrative_de: 'x'.repeat(50) },
    { id: 'a2', label_de: 'Zwei', costs: { budget: 20 } },
  ],
};

test('schaetzeTokens wächst mit der Textlänge', () => {
  assert.equal(schaetzeTokens(''), 0);
  assert.ok(schaetzeTokens('a'.repeat(360)) === 100);
});

test('projiziere behält nur vorhandene Wunschfelder', () => {
  assert.deepEqual(projiziere({ a: 1, b: 2, c: 3 }, ['a', 'c', 'fehlt']), { a: 1, c: 3 });
  assert.deepEqual(projiziere({ a: 1 }, []), { a: 1 });
});

test('digestJson nennt Array-Länge, Felder und Beispiele', () => {
  const d = digestJson(DATEN, { samples: 1 });
  assert.match(d, /Top-Level-Schlüssel: meta, actions/);
  assert.match(d, /\[actions\] Array · 2 Einträge/);
  assert.match(d, /Felder: id, label_de, costs, narrative_de/);
  assert.match(d, /Beispiele \(1 von 2\)/);
  assert.ok(!d.includes('"id": "a2"'), 'nur das eine Beispiel, nicht alle Einträge');
});

test('digestJson verträgt ein Top-Level-Array', () => {
  const d = digestJson([{ id: 'x' }], { samples: 1 });
  assert.match(d, /\[_root\] Array · 1 Einträge/);
});

test('projiziereJson zeigt ALLE Einträge, aber nur die Wunschfelder', () => {
  const p = projiziereJson(DATEN, { arrays: ['actions'], felder: ['id', 'costs'] });
  assert.match(p, /\{"id":"a1","costs":\{"budget":10\}\}/);
  assert.match(p, /\{"id":"a2","costs":\{"budget":20\}\}/);
  assert.ok(!p.includes('narrative_de'), 'Erzähltext bleibt draußen');
});

test('projiziereJson ignoriert nicht genannte Arrays', () => {
  const p = projiziereJson({ a: [{ id: 1 }], b: [{ id: 2 }] }, { arrays: ['a'], felder: ['id'] });
  assert.match(p, /\[a\]/);
  assert.ok(!p.includes('[b]'));
});

test('ladeQuelle kürzt im Modus "kopf" und meldet das', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mr-'));
  const datei = path.join(dir, 'lang.md');
  fs.writeFileSync(datei, 'y'.repeat(500));
  const q = ladeQuelle({ pfad: datei, modus: 'kopf', limit: 100 });
  assert.equal(q.gekuerzt, true);
  assert.match(q.text, /gekürzt: \d+ von 500 Zeichen/);
  assert.ok(q.text.length <= 100, `Hinweis muss ins Limit passen, war ${q.text.length}`);
});

test('ladeQuelle wirft mit klarer Meldung bei fehlender Datei', () => {
  assert.throws(() => ladeQuelle({ pfad: 'gibt/es/nicht.md' }), QuellenFehler);
});

test('ladeQuelle wirft bei kaputtem JSON, statt Müll zu schicken', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mr-'));
  const datei = path.join(dir, 'kaputt.json');
  fs.writeFileSync(datei, '{ nicht: json');
  assert.throws(() => ladeQuelle({ pfad: datei, modus: 'digest' }), /kein gültiges JSON/);
});

test('baueKontext hält das Zeichenbudget ein und weist Ausgelassenes aus', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mr-'));
  const a = path.join(dir, 'a.md');
  const b = path.join(dir, 'b.md');
  fs.writeFileSync(a, 'A'.repeat(4000));
  fs.writeFileSync(b, 'B'.repeat(4000));

  const k = baueKontext([{ pfad: a }, { pfad: b }], { maxChars: 2000 });
  assert.ok(k.chars <= 2000, `Budget verletzt: ${k.chars}`);
  assert.equal(k.ausgelassen, 1);
  assert.equal(k.teile[1].status, 'ausgelassen');
  assert.ok(!k.text.includes('BBBB'), 'ausgelassene Quelle darf nicht im Paket landen');
});

test('baueKontext überspringt fehlende Quellen nur, wenn sie optional sind', () => {
  const k = baueKontext([{ pfad: 'weg.md', optional: true }], { maxChars: 1000 });
  assert.equal(k.teile[0].status, 'fehlt (optional)');
  assert.throws(() => baueKontext([{ pfad: 'weg.md' }], { maxChars: 1000 }), QuellenFehler);
});

test('baueKontext schreibt für jede Quelle eine erkennbare Kopfzeile', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mr-'));
  const a = path.join(dir, 'a.md');
  fs.writeFileSync(a, 'Inhalt');
  const k = baueKontext([{ pfad: a }], { maxChars: 5000 });
  assert.match(k.text, /=====.*a\.md · ganze Datei =====/);
  assert.match(k.text, /Inhalt/);
});
