// ===========================================
// OPENROUTER-CLIENT (nur fetch, keine Abhängigkeiten)
// ===========================================

import { defaults, maskKey } from './config.mjs';

export class ApiFehler extends Error {
  constructor(message, { status, body } = {}) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

const KOPFZEILEN = {
  'HTTP-Referer': 'https://github.com/ypoxx/disinfogame',
  'X-Title': 'Disinfogame Model-Review',
};

async function anfrage(pfad, { apiKey, method = 'GET', body, timeoutMs, baseUrl } = {}) {
  const cfg = defaults();
  const url = `${baseUrl || cfg.baseUrl}${pfad}`;
  const versuche = 3;
  let letzterFehler;

  for (let i = 1; i <= versuche; i++) {
    try {
      const res = await fetch(url, {
        method,
        headers: {
          ...KOPFZEILEN,
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
          ...(body ? { 'Content-Type': 'application/json' } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(timeoutMs || cfg.timeoutMs),
      });

      const text = await res.text();
      let json;
      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        json = { _raw: text };
      }

      if (!res.ok) {
        const msg = json?.error?.message || json?.message || text.slice(0, 400) || res.statusText;
        // 429/5xx sind vorübergehend — erneut versuchen.
        if ((res.status === 429 || res.status >= 500) && i < versuche) {
          letzterFehler = new ApiFehler(`HTTP ${res.status}: ${msg}`, { status: res.status, body: json });
          await new Promise((r) => setTimeout(r, 2000 * 2 ** (i - 1)));
          continue;
        }
        throw new ApiFehler(`HTTP ${res.status}: ${msg}`, { status: res.status, body: json });
      }
      // OpenRouter kann Fehler auch mit HTTP 200 im Body melden.
      if (json?.error) {
        throw new ApiFehler(`API-Fehler: ${json.error.message || JSON.stringify(json.error)}`, { body: json });
      }
      return json;
    } catch (err) {
      if (err instanceof ApiFehler) throw err;
      letzterFehler = err;
      if (i < versuche) {
        await new Promise((r) => setTimeout(r, 2000 * 2 ** (i - 1)));
        continue;
      }
    }
  }
  throw new ApiFehler(
    `Netzwerkfehler gegen OpenRouter nach ${versuche} Versuchen: ${letzterFehler?.message || 'unbekannt'}. ` +
      'Hinweis: In der Claude-Code-Web-Umgebung ist openrouter.ai standardmäßig NICHT in der Netz-Allowlist ' +
      '(CONNECT 403) — dann lokal laufen lassen oder die Domain freischalten.',
    { body: null }
  );
}

/** Modell-Katalog inkl. Preisen (öffentlich, Schlüssel optional). */
export async function listeModelle({ apiKey, baseUrl } = {}) {
  const json = await anfrage('/models', { apiKey, baseUrl, timeoutMs: 60_000 });
  return Array.isArray(json.data) ? json.data : [];
}

/** Auskunft über den Schlüssel (Limit/Verbrauch) — gute Vorab-Prüfung. */
export async function schluesselInfo({ apiKey, baseUrl } = {}) {
  const json = await anfrage('/key', { apiKey, baseUrl, timeoutMs: 60_000 });
  return { ...(json.data || {}), maskiert: maskKey(apiKey) };
}

/**
 * Nutzer-Inhalt bauen. Ohne Bilder ein schlichter String, mit Bildern die
 * ContentPart-Liste (die laut OpenRouter-Schema nur der Rolle "user" erlaubt
 * ist). Jedes Bild wird mit seinem Dateinamen angekündigt, damit die Antwort
 * sich eindeutig darauf beziehen kann.
 */
export function baueNutzerinhalt(text, bilder = []) {
  if (!bilder.length) return text;
  const teile = [{ type: 'text', text }];
  teile.push({
    type: 'text',
    text: `\n# Screenshots (${bilder.length}) — jeweils mit Dateinamen angekündigt:`,
  });
  for (const bild of bilder) {
    teile.push({ type: 'text', text: `Screenshot: ${bild.name}` });
    teile.push({ type: 'image_url', image_url: { url: bild.dataUrl } });
  }
  return teile;
}

/**
 * Ein Review-Aufruf. Gibt Text + Nutzung zurück.
 * `model === null` lässt das Feld weg — OpenRouter nimmt dann das im Konto
 * hinterlegte Standardmodell ("If \"model\" is unspecified, uses the user's default").
 * `denyDataCollection` schränkt auf Anbieter ein, die Eingaben nicht zum
 * Training sammeln (siehe README §Datenschutz).
 */
export async function frageModell({
  apiKey,
  baseUrl,
  model,
  system,
  user,
  bilder = [],
  maxTokens,
  temperature,
  timeoutMs,
  denyDataCollection = true,
}) {
  const body = {
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: baueNutzerinhalt(user, bilder) },
    ],
    max_tokens: maxTokens,
    temperature,
    usage: { include: true },
  };
  if (model) body.model = model;
  if (denyDataCollection) body.provider = { data_collection: 'deny' };

  const json = await anfrage('/chat/completions', { apiKey, baseUrl, method: 'POST', body, timeoutMs });
  const choice = json?.choices?.[0];
  const text = choice?.message?.content ?? '';
  if (!text.trim()) {
    throw new ApiFehler(
      `Modell ${model || '(Kontovorgabe)'} hat keinen Text geliefert ` +
        `(finish_reason: ${choice?.finish_reason || 'unbekannt'}).`,
      { body: json }
    );
  }
  return {
    text,
    finishReason: choice?.finish_reason || null,
    usage: json?.usage || null,
    verwendetesModell: json?.model || model || null,
    id: json?.id || null,
  };
}

/**
 * Modellkürzel gegen den Katalog prüfen. Liefert bei Tippfehlern Vorschläge,
 * statt den Aufruf ins Leere laufen zu lassen.
 */
/** Kann das Modell Bilder lesen? (architecture.input_modalities aus dem Katalog) */
export function kannBilder(model) {
  return Boolean(model?.architecture?.input_modalities?.includes('image'));
}

/** Sehende Modelle vorschlagen, wenn das gewählte blind ist. */
export function sehendeModelle(katalog, grenze = 8) {
  return katalog
    .filter((m) => kannBilder(m) && Number.parseFloat(m.pricing?.prompt ?? 'NaN') >= 0)
    .sort((a, b) => a.id.localeCompare(b.id))
    .slice(0, grenze)
    .map((m) => m.id);
}

export function findeModell(katalog, id) {
  const treffer = katalog.find((m) => m.id === id);
  if (treffer) return { model: treffer, vorschlaege: [] };
  const nadel = id.toLowerCase().replace(/^.*\//, '');
  const vorschlaege = katalog
    .filter((m) => m.id.toLowerCase().includes(nadel))
    .slice(0, 8)
    .map((m) => m.id);
  return { model: null, vorschlaege };
}
