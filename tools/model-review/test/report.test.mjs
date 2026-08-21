import test from 'node:test';
import assert from 'node:assert/strict';
import { rendereBericht, berichtDateiname, modellSlug } from '../src/report.mjs';

const BASIS = {
  linse: { id: 'konzept', titel: 'Gesamtkonzept & Kernschleife' },
  model: 'anbieter/modell-1.5',
  verwendetesModell: 'anbieter/modell-1.5',
  datum: '2026-08-21',
  zeitstempel: '2026-08-21T10:00:00.000Z',
  kontext: {
    chars: 102_408,
    tokens: 28_447,
    teile: [
      { rel: 'docs/SOUL.md', modus: 'voll', chars: 10_012, status: 'vollständig' },
      { rel: 'docs/STATUS.md', modus: 'kopf', chars: 20_127, status: 'gekürzt' },
      { rel: 'docs/EXTRA.md', modus: 'voll', chars: 0, status: 'ausgelassen' },
    ],
  },
  antwort: '## Kurzfazit\nDas Spiel hat zwei Ökonomien.',
  usage: { prompt_tokens: 29_046, completion_tokens: 3_120 },
  kosten: 0.1345,
  dauerMs: 42_000,
  frage: 'Beurteile das Gesamtkonzept.',
  denyDataCollection: true,
};

test('modellSlug macht Kürzel dateisystemtauglich', () => {
  assert.equal(modellSlug('anbieter/Modell-1.5'), 'anbieter-modell-1.5');
  assert.equal(modellSlug('a b/c:d'), 'a-b-c-d');
});

test('Dateiname trägt Datum, Linse und Modell', () => {
  assert.equal(
    berichtDateiname({ linse: 'konzept', model: 'anbieter/modell-1.5', datum: '2026-08-21' }),
    '2026-08-21_konzept_anbieter-modell-1.5.md'
  );
});

test('Bericht dokumentiert Herkunft, Kosten und Nutzung', () => {
  const md = rendereBericht(BASIS);
  assert.match(md, /# 🛰️ Fremdmodell-Review — Gesamtkonzept & Kernschleife/);
  assert.match(md, /`anbieter\/modell-1\.5`/);
  assert.match(md, /\$0\.13/);
  assert.match(md, /29\.046 Prompt \+ 3\.120 Antwort Tokens/);
  assert.match(md, /42\.0 s/);
  assert.match(md, /ausgeschlossen \(deny\)/);
});

// Ohne diese Warnung wird ein Fremdmodell-Urteil im Repo später als Fakt gelesen.
test('Bericht warnt vor der Verwechslung von Hypothese und Befund', () => {
  const md = rendereBericht(BASIS);
  assert.match(md, /kuratierten Ausschnitt/);
  assert.match(md, /Hypothesen/);
  assert.match(md, /VISION_LOCK/);
});

test('Bericht weist Gekürztes und Ausgelassenes offen aus', () => {
  const md = rendereBericht(BASIS);
  assert.match(md, /1 gekürzt/);
  assert.match(md, /\*\*1 ausgelassen \(Budget erschöpft\)\*\*/);
  assert.match(md, /\| `docs\/STATUS\.md` \| kopf \|/);
});

test('Bericht enthält Frage und Antwort im Klartext', () => {
  const md = rendereBericht(BASIS);
  assert.match(md, /Beurteile das Gesamtkonzept\./);
  assert.match(md, /Das Spiel hat zwei Ökonomien\./);
});

test('Bericht kommt ohne Nutzungsdaten aus', () => {
  const md = rendereBericht({ ...BASIS, usage: null, kosten: null });
  assert.match(md, /nicht gemeldet/);
  assert.match(md, /unbekannt/);
});
