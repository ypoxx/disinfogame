// ===========================================
// KONTEXT-PAKET — was das fremde Modell zu sehen bekommt
// ===========================================
// Ein Review-Lauf schickt kein ganzes Repo, sondern ein kuratiertes Paket:
// Prosa-Dokumente ganz oder gekürzt, JSON-Spieldaten als Struktur-Digest oder
// als Feld-Projektion (alle Einträge, aber nur die relevanten Felder).
// Alles ist hart in Zeichen begrenzt — der Kostenwächter arbeitet auf diesen Zahlen.

import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT, relToRepo } from './paths.mjs';

/** Grobe Token-Schätzung. Deutsche Prosa + JSON ≈ 3.6 Zeichen/Token. */
export function schaetzeTokens(text) {
  return Math.ceil(String(text).length / 3.6);
}

/**
 * Kürzt auf höchstens `limit` Zeichen — INKLUSIVE des Hinweises. Der Hinweis
 * muss mitgerechnet werden, sonst hält die Obergrenze des Pakets nicht (und
 * damit auch die Kostenschätzung nicht).
 */
function kuerze(text, limit) {
  const s = String(text);
  if (limit == null || s.length <= limit) return { text: s, gekuerzt: false };
  const hinweis = (n) => `\n… [gekürzt: ${s.length - n} von ${s.length} Zeichen ausgelassen]`;
  let n = Math.max(0, limit - hinweis(0).length);
  // Die Hinweislänge hängt (über die Ziffern) minimal von n ab — zweimal nachjustieren genügt.
  for (let i = 0; i < 2; i++) n = Math.max(0, limit - hinweis(n).length);
  return { text: s.slice(0, n) + hinweis(n), gekuerzt: true };
}

/** Nur die genannten Felder eines Objekts behalten (fehlende werden ausgelassen). */
export function projiziere(item, felder) {
  if (!felder || felder.length === 0) return item;
  const out = {};
  for (const f of felder) {
    if (item && Object.prototype.hasOwnProperty.call(item, f)) out[f] = item[f];
  }
  return out;
}

/**
 * Struktur-Digest für eine JSON-Datei: Top-Level-Schlüssel, Array-Längen,
 * Feldnamen und einige Beispiel-Einträge. Reine Funktion auf geparsten Daten.
 */
export function digestJson(data, { samples = 2, itemChars = 1200 } = {}) {
  const zeilen = [];
  const wurzel = Array.isArray(data) ? { _root: data } : (data ?? {});
  if (!Array.isArray(data)) {
    zeilen.push(`Top-Level-Schlüssel: ${Object.keys(wurzel).join(', ') || '(keine)'}`);
  }
  for (const [key, value] of Object.entries(wurzel)) {
    if (Array.isArray(value)) {
      const felder = new Set();
      for (const item of value) {
        if (item && typeof item === 'object') for (const k of Object.keys(item)) felder.add(k);
      }
      zeilen.push('');
      zeilen.push(`[${key}] Array · ${value.length} Einträge · Felder: ${[...felder].join(', ')}`);
      const zeigen = value.slice(0, samples);
      if (zeigen.length) {
        zeilen.push(`Beispiele (${zeigen.length} von ${value.length}):`);
        for (const item of zeigen) {
          zeilen.push(kuerze(JSON.stringify(item, null, 2), itemChars).text);
        }
      }
    } else {
      zeilen.push('');
      zeilen.push(`[${key}] ${kuerze(JSON.stringify(value), itemChars).text}`);
    }
  }
  return zeilen.join('\n').trim();
}

/**
 * Feld-Projektion: ALLE Einträge der genannten Arrays, aber nur ausgewählte
 * Felder — so sieht das Modell z. B. alle 110 Aktionen mit Kosten/Effekten,
 * ohne dass die Erzähltexte das Paket sprengen.
 */
export function projiziereJson(data, { arrays = null, felder = null, itemChars = 900 } = {}) {
  const zeilen = [];
  const wurzel = Array.isArray(data) ? { _root: data } : (data ?? {});
  for (const [key, value] of Object.entries(wurzel)) {
    if (!Array.isArray(value)) continue;
    if (arrays && !arrays.includes(key)) continue;
    zeilen.push(`[${key}] ${value.length} Einträge · Felder: ${(felder || ['(alle)']).join(', ')}`);
    for (const item of value) {
      zeilen.push(kuerze(JSON.stringify(projiziere(item, felder)), itemChars).text);
    }
    zeilen.push('');
  }
  return zeilen.join('\n').trim();
}

/** Verzeichnis-Baum mit Zeilenzahlen — Grundlage der Architektur-Linse. */
export function baum(dir, { endungen = ['.ts', '.tsx'], maxDateien = 200 } = {}) {
  const treffer = [];
  const gehe = (d) => {
    let eintraege;
    try {
      eintraege = fs.readdirSync(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of eintraege.sort((a, b) => a.name.localeCompare(b.name))) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) {
        if (['node_modules', '__tests__', 'tests', 'dist', 'coverage'].includes(e.name)) continue;
        gehe(p);
      } else if (endungen.some((x) => e.name.endsWith(x))) {
        const zeilen = fs.readFileSync(p, 'utf8').split('\n').length;
        treffer.push({ pfad: relToRepo(p), zeilen });
      }
    }
  };
  gehe(dir);
  treffer.sort((a, b) => b.zeilen - a.zeilen);
  const gezeigt = treffer.slice(0, maxDateien);
  const kopf = `${treffer.length} Dateien · ${treffer.reduce((s, t) => s + t.zeilen, 0)} Zeilen gesamt (größte zuerst)`;
  const liste = gezeigt.map((t) => `${String(t.zeilen).padStart(6)}  ${t.pfad}`).join('\n');
  const rest =
    treffer.length > gezeigt.length ? `\n… ${treffer.length - gezeigt.length} kleinere Dateien ausgelassen` : '';
  return `${kopf}\n${liste}${rest}`;
}

export class QuellenFehler extends Error {}

/** Eine einzelne Quelle laden und in Text verwandeln. */
export function ladeQuelle(quelle) {
  const abs = path.isAbsolute(quelle.pfad) ? quelle.pfad : path.join(REPO_ROOT, quelle.pfad);
  const rel = relToRepo(abs);
  const modus = quelle.modus || 'voll';

  if (modus === 'baum') {
    if (!fs.existsSync(abs)) throw new QuellenFehler(`Verzeichnis fehlt: ${rel}`);
    return { rel, modus, text: baum(abs, quelle), gekuerzt: false };
  }

  if (!fs.existsSync(abs)) throw new QuellenFehler(`Datei fehlt: ${rel}`);
  const roh = fs.readFileSync(abs, 'utf8');

  if (modus === 'digest' || modus === 'projektion') {
    let data;
    try {
      data = JSON.parse(roh);
    } catch (err) {
      throw new QuellenFehler(`${rel} ist kein gültiges JSON: ${err.message}`);
    }
    const text = modus === 'digest' ? digestJson(data, quelle) : projiziereJson(data, quelle);
    const k = kuerze(text, quelle.limit);
    return { rel, modus, text: k.text, gekuerzt: k.gekuerzt };
  }

  const k = kuerze(roh, modus === 'kopf' ? (quelle.limit ?? 8000) : quelle.limit);
  return { rel, modus, text: k.text, gekuerzt: k.gekuerzt };
}

const MODUS_LABEL = {
  voll: 'ganze Datei',
  kopf: 'Anfang der Datei',
  digest: 'JSON-Struktur + Beispiele',
  projektion: 'JSON, alle Einträge, ausgewählte Felder',
  baum: 'Datei-Inventar',
};

/**
 * Kontext-Paket bauen. Quellen werden in Reihenfolge gefüllt; ist das globale
 * Zeichen-Budget erschöpft, wird gekürzt und der Rest ehrlich als ausgelassen
 * ausgewiesen (kein stilles Abschneiden).
 */
export function baueKontext(quellen, { maxChars = 320_000 } = {}) {
  const teile = [];
  const bloecke = [];
  let verbraucht = 0;
  let voll = false;

  for (const quelle of quellen) {
    if (voll) {
      teile.push({ rel: quelle.pfad, modus: quelle.modus || 'voll', chars: 0, status: 'ausgelassen' });
      continue;
    }
    let geladen;
    try {
      geladen = ladeQuelle(quelle);
    } catch (err) {
      if (quelle.optional) {
        teile.push({ rel: quelle.pfad, modus: quelle.modus || 'voll', chars: 0, status: `fehlt (optional)` });
        continue;
      }
      throw err;
    }

    const kopf = `\n===== ${geladen.rel} · ${MODUS_LABEL[geladen.modus] || geladen.modus}${
      quelle.hinweis ? ` · ${quelle.hinweis}` : ''
    } =====\n`;
    const rest = maxChars - verbraucht - kopf.length - 1; // -1 für den abschließenden Zeilenumbruch
    if (rest <= 200) {
      voll = true;
      teile.push({ rel: geladen.rel, modus: geladen.modus, chars: 0, status: 'ausgelassen' });
      continue;
    }
    const k = kuerze(geladen.text, Math.min(geladen.text.length, rest));
    const block = kopf + k.text + '\n';
    bloecke.push(block);
    verbraucht += block.length;
    teile.push({
      rel: geladen.rel,
      modus: geladen.modus,
      chars: block.length,
      status: geladen.gekuerzt || k.gekuerzt ? 'gekürzt' : 'vollständig',
    });
    if (verbraucht >= maxChars) voll = true;
  }

  const text = bloecke.join('');
  return {
    text,
    teile,
    chars: text.length,
    tokens: schaetzeTokens(text),
    ausgelassen: teile.filter((t) => t.status === 'ausgelassen').length,
  };
}
