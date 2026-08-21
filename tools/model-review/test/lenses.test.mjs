import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { LINSEN, findeLinse, linsenIds, AUSGABE_REGELN } from '../src/lenses.mjs';
import { baueKontext } from '../src/pack.mjs';
import { REPO_ROOT } from '../src/paths.mjs';

test('Linsen-Ids sind eindeutig', () => {
  const ids = linsenIds();
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.length >= 5);
});

test('jede Linse hat Rolle, Auftrag und Quellen', () => {
  for (const l of LINSEN) {
    assert.ok(l.titel && l.kurz, `${l.id}: Titel/Kurzbeschreibung fehlt`);
    assert.ok(l.rolle.length > 100, `${l.id}: Rolle zu dünn`);
    assert.ok(l.auftrag.length > 100, `${l.id}: Auftrag zu dünn`);
    assert.ok(l.quellen.length >= 3, `${l.id}: zu wenige Quellen`);
  }
});

// Dieser Test ist der eigentliche Wächter: Werden Dokumente umbenannt oder
// verschoben, schlägt er fehl — statt dass ein Review-Lauf erst beim Nutzer bricht.
test('alle Quellen aller Linsen existieren im Repo', () => {
  for (const l of LINSEN) {
    for (const q of l.quellen) {
      if (q.optional) continue;
      const abs = path.join(REPO_ROOT, q.pfad);
      assert.ok(fs.existsSync(abs), `Linse "${l.id}": ${q.pfad} existiert nicht (umbenannt?)`);
    }
  }
});

test('jede Linse baut ein nicht-leeres Paket im Budget', () => {
  for (const l of LINSEN) {
    const k = baueKontext(l.quellen, { maxChars: 320_000 });
    assert.ok(k.chars > 5000, `${l.id}: Paket verdächtig klein (${k.chars})`);
    assert.ok(k.chars <= 320_000, `${l.id}: Paket über Budget (${k.chars})`);
    assert.equal(k.ausgelassen, 0, `${l.id}: Quellen fielen aus dem Budget`);
  }
});

test('JSON-Quellen mit Feld-Projektion nennen ihre Felder', () => {
  for (const l of LINSEN) {
    for (const q of l.quellen.filter((x) => x.modus === 'projektion')) {
      assert.ok(Array.isArray(q.felder) && q.felder.length > 0, `${l.id}/${q.pfad}: felder fehlt`);
    }
  }
});

test('Ausgaberegeln fordern Belege und verbieten Erfindungen', () => {
  assert.match(AUSGABE_REGELN, /Beleg/);
  assert.match(AUSGABE_REGELN, /Erfinde keine/);
  assert.match(AUSGABE_REGELN, /Blinde Flecken/);
});

test('findeLinse liefert null statt zu werfen', () => {
  assert.equal(findeLinse('gibtsnicht'), null);
  assert.equal(findeLinse('konzept').id, 'konzept');
});
