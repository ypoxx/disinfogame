import test from 'node:test';
import assert from 'node:assert/strict';
import { preise, schaetzeKosten, pruefeBudget, usd, summe, BudgetUeberschritten } from '../src/cost.mjs';

const MODELL = { id: 'x/y', pricing: { prompt: '0.000003', completion: '0.000015' } };

test('preise wandelt OpenRouter-Strings in Zahlen', () => {
  assert.deepEqual(preise(MODELL), { prompt: 0.000003, completion: 0.000015 });
});

test('preise meldet Unbekanntes als null statt als 0', () => {
  assert.deepEqual(preise({ pricing: { prompt: '-', completion: undefined } }), {
    prompt: null,
    completion: null,
  });
  assert.deepEqual(preise({}), { prompt: null, completion: null });
});

test('preise erkennt echte Gratis-Modelle (0) korrekt', () => {
  assert.deepEqual(preise({ pricing: { prompt: '0', completion: '0' } }), { prompt: 0, completion: 0 });
});

test('schaetzeKosten rechnet Prompt und Antwort zusammen', () => {
  const k = schaetzeKosten({ promptTokens: 30_000, completionTokens: 8_000, pricing: preise(MODELL) });
  assert.ok(Math.abs(k - (0.09 + 0.12)) < 1e-9, `war ${k}`);
});

test('schaetzeKosten liefert null, wenn ein Preis fehlt', () => {
  assert.equal(schaetzeKosten({ promptTokens: 1, completionTokens: 1, pricing: { prompt: null, completion: 1 } }), null);
});

test('pruefeBudget lässt durch, was unter dem Limit liegt', () => {
  assert.doesNotThrow(() => pruefeBudget({ geschaetzt: 0.21, maxCostUsd: 1, modelId: 'x/y' }));
});

test('pruefeBudget bremst über dem Limit und erklärt die Auswege', () => {
  assert.throws(
    () => pruefeBudget({ geschaetzt: 3.5, maxCostUsd: 1, modelId: 'x/y' }),
    (err) => err instanceof BudgetUeberschritten && /--max-cost/.test(err.message)
  );
});

// Ohne Preisangabe könnte ein Modell die Bremse umgehen — das muss ein
// bewusster Opt-in sein, kein stiller Durchlauf.
test('pruefeBudget blockt unbekannte Preise, außer man erlaubt sie ausdrücklich', () => {
  assert.throws(() => pruefeBudget({ geschaetzt: null, maxCostUsd: 1, modelId: 'x/y' }), BudgetUeberschritten);
  assert.doesNotThrow(() =>
    pruefeBudget({ geschaetzt: null, maxCostUsd: 1, modelId: 'x/y', erlaubeUnbekannt: true })
  );
});

test('usd bleibt bei Cent-Beträgen lesbar', () => {
  assert.equal(usd(0), '$0.00 (gratis)');
  assert.equal(usd(null), 'unbekannt');
  assert.equal(usd(0.0004), '$0.00040');
  assert.equal(usd(1.2345678), '$1.2346');
});

test('summe ignoriert Unbekanntes, liefert null wenn alles unbekannt ist', () => {
  assert.equal(summe([0.1, null, 0.2]), 0.30000000000000004);
  assert.equal(summe([null, null]), null);
});
