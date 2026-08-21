// ===========================================
// BERICHT — Markdown im Stil von docs/EXPERT_REVIEWS_*
// ===========================================
// Der Bericht dokumentiert IMMER, wie er entstanden ist (Modell, Linse,
// Paketgröße, Kosten, was gekürzt/ausgelassen wurde). Ohne diesen Kopf ist ein
// Fremdmodell-Urteil nicht bewertbar.

import fs from 'node:fs';
import path from 'node:path';
import { REPORT_DIR } from './paths.mjs';
import { usd } from './cost.mjs';

/** Modellkürzel → dateisystemtauglicher Name. */
export function modellSlug(id) {
  return String(id)
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

export function berichtDateiname({ linse, model, datum }) {
  return `${datum}_${linse}_${modellSlug(model)}.md`;
}

/** Welche Screenshots das Modell gesehen hat — sonst ist die Antwort nicht nachvollziehbar. */
function bilderAbschnitt(bilder, videos = []) {
  if (!bilder.length && !videos.length) return '';
  const zeile = (m, art) => `| ${art} | \`${m.name}\` | \`${m.rel}\` | ${Math.round(m.bytes / 1024)} kB |`;
  const teile = [];
  if (bilder.length) teile.push(`${bilder.length} Screenshot(s)`);
  if (videos.length) teile.push(`${videos.length} Clip(s)`);
  return [
    '',
    `### Gezeigtes Anschauungsmaterial (${teile.join(' · ')})`,
    '',
    '| Art | Im Text genannt als | Datei | Größe |',
    '|---|---|---|---:|',
    ...bilder.map((b) => zeile(b, '🖼 Bild')),
    ...videos.map((v) => zeile(v, '🎬 Clip')),
    '',
  ].join('\n');
}

function teileTabelle(teile) {
  const zeilen = teile.map(
    (t) => `| \`${t.rel}\` | ${t.modus} | ${t.chars.toLocaleString('de-DE')} | ${t.status} |`
  );
  return ['| Quelle | Modus | Zeichen | Status |', '|---|---|---:|---|', ...zeilen].join('\n');
}

export function rendereBericht({
  linse,
  model,
  verwendetesModell,
  datum,
  zeitstempel,
  kontext,
  bilder = [],
  videos = [],
  antwort,
  usage,
  kosten,
  dauerMs,
  frage,
  denyDataCollection,
}) {
  const genutzt = usage
    ? `${(usage.prompt_tokens ?? 0).toLocaleString('de-DE')} Prompt + ${(usage.completion_tokens ?? 0).toLocaleString('de-DE')} Antwort Tokens`
    : 'nicht gemeldet';

  const ausgelassen = kontext.teile.filter((t) => t.status === 'ausgelassen');
  const gekuerzt = kontext.teile.filter((t) => t.status === 'gekürzt');

  return `# 🛰️ Fremdmodell-Review — ${linse.titel}

**Modell:** \`${verwendetesModell || model}\` (via OpenRouter) · **Linse:** \`${linse.id}\` · **Datum:** ${datum}
**Erzeugt von:** \`tools/model-review\` · **Lauf:** ${zeitstempel} · **Dauer:** ${(dauerMs / 1000).toFixed(1)} s
**Nutzung:** ${genutzt} · **Kosten:** ${usd(kosten)} · **Anbieter-Datensammlung:** ${denyDataCollection ? 'ausgeschlossen (deny)' : 'zugelassen'}

> ⚠️ **Wie das zu lesen ist:** Ein *fremdes* Modell hat einen **kuratierten Ausschnitt**
> des Projekts gesehen — nicht das laufende Spiel und nicht das ganze Repository. Es kann
> daher weder Laufzeitverhalten prüfen noch \`file:line\`-Belege verifizieren. Befunde sind
> **Hypothesen**, die vor dem Umsetzen am Code/an den Daten gegenzuprüfen sind. Die
> kanonische Wahrheit bleibt [\`docs/VISION_LOCK.md\`](../VISION_LOCK.md) bzw. die Spieldaten.

## Gestellte Frage

${frage}

## Gezeigter Ausschnitt

${kontext.chars.toLocaleString('de-DE')} Zeichen ≈ ${kontext.tokens.toLocaleString('de-DE')} Tokens (geschätzt) aus ${kontext.teile.length} Quellen${
    gekuerzt.length ? ` · ${gekuerzt.length} gekürzt` : ''
  }${ausgelassen.length ? ` · **${ausgelassen.length} ausgelassen (Budget erschöpft)**` : ''}

${kontext.teile.length ? teileTabelle(kontext.teile) : '_(Synthese über Einzelberichte — kein Datei-Paket)_'}
${bilderAbschnitt(bilder, videos)}
---

## Antwort des Modells

${antwort.trim()}

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in \`docs/STATUS.md\` einordnen.*
`;
}

export function schreibeBericht(markdown, dateiname, dir = REPORT_DIR) {
  fs.mkdirSync(dir, { recursive: true });
  const ziel = path.join(dir, dateiname);
  fs.writeFileSync(ziel, markdown, 'utf8');
  return ziel;
}
