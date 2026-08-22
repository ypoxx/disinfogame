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

async function anfrage(pfad, { apiKey, method = 'GET', body, timeoutMs, baseUrl, anbieter = 'openrouter' } = {}) {
  const cfg = defaults();
  const url = `${baseUrl || cfg.baseUrl}${pfad}`;
  // HTTP-Referer/X-Title kennt nur OpenRouter (Herkunfts-Kennzeichnung).
  const kopf = anbieter === 'openrouter' ? KOPFZEILEN : {};
  const versuche = 3;
  let letzterFehler;

  for (let i = 1; i <= versuche; i++) {
    try {
      const res = await fetch(url, {
        method,
        headers: {
          ...kopf,
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
export async function listeModelle({ apiKey, baseUrl, anbieter = 'openrouter' } = {}) {
  const json = await anfrage('/models', { apiKey, baseUrl, anbieter, timeoutMs: 60_000 });
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
export function baueNutzerinhalt(text, bilder = [], videos = []) {
  if (!bilder.length && !videos.length) return text;
  const teile = [{ type: 'text', text }];

  if (bilder.length) {
    teile.push({
      type: 'text',
      text: `\n# Screenshots (${bilder.length}) — jeweils mit Dateinamen angekündigt:`,
    });
    for (const bild of bilder) {
      teile.push({ type: 'text', text: `Screenshot: ${bild.name}` });
      teile.push({ type: 'image_url', image_url: { url: bild.dataUrl } });
    }
  }

  if (videos.length) {
    teile.push({
      type: 'text',
      text:
        `\n# Clips (${videos.length}) — bewegte Aufnahmen aus dem laufenden Spiel. ` +
        'Beurteile hier zusätzlich Timing, Übergänge, Ruckeln und ob Bewegung die Aufmerksamkeit ' +
        'an die richtige Stelle lenkt:',
    });
    for (const clip of videos) {
      teile.push({ type: 'text', text: `Clip: ${clip.name}` });
      teile.push({ type: 'video_url', video_url: { url: clip.dataUrl } });
    }
  }

  return teile;
}

/**
 * Server-Sent-Events von OpenRouter lesen und Textstücke ausgeben.
 * Warum überhaupt streamen: Ein Denk-Modell mit großem Bild-Paket braucht
 * Minuten. Ohne Strom sieht der Nutzer ein stilles Terminal und weiß nicht, ob
 * noch etwas passiert — und ein reines Gesamt-Zeitlimit schlägt zu, obwohl die
 * Antwort noch fließt. Mit Strom zählt die Zeit seit dem LETZTEN Lebenszeichen.
 */
async function liesStrom(res, { onStueck, stilleMs }) {
  const leser = res.body.getReader();
  const dekoder = new TextDecoder();
  let puffer = '';
  let text = '';
  let denken = '';
  let usage = null;
  let modell = null;
  let finishReason = null;
  let letztes = Date.now();

  const wecker = setInterval(() => {
    if (Date.now() - letztes > stilleMs) leser.cancel(new Error('Stille')).catch(() => {});
  }, 5000);

  try {
    for (;;) {
      const { done, value } = await leser.read();
      if (done) break;
      letztes = Date.now();
      puffer += dekoder.decode(value, { stream: true });

      const zeilen = puffer.split('\n');
      puffer = zeilen.pop() ?? '';
      for (const zeile of zeilen) {
        if (!zeile.startsWith('data: ')) continue;
        const nutzlast = zeile.slice(6).trim();
        if (nutzlast === '[DONE]') continue;
        let stueck;
        try {
          stueck = JSON.parse(nutzlast);
        } catch {
          continue; // Kommentar-/Keepalive-Zeile
        }
        if (stueck.error) {
          throw new ApiFehler(`API-Fehler im Strom: ${stueck.error.message || JSON.stringify(stueck.error)}`);
        }
        modell = stueck.model || modell;
        if (stueck.usage) usage = stueck.usage;
        const delta = stueck.choices?.[0]?.delta;
        if (delta?.content) {
          text += delta.content;
          onStueck?.(delta.content.length, text.length);
        }
        if (delta?.reasoning) denken += delta.reasoning;
        const fr = stueck.choices?.[0]?.finish_reason;
        if (fr) finishReason = fr;
      }
    }
  } finally {
    clearInterval(wecker);
  }

  return { text, reasoning: denken || null, usage, verwendetesModell: modell, finishReason };
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
  videos = [],
  maxTokens,
  temperature,
  timeoutMs,
  denyDataCollection = true,
  denkAufwand = null,
  anbieter = 'openrouter',
  strom = false,
  onStueck = null,
  stilleMs = 180_000,
}) {
  // Die beiden Anbieter sprechen fast dieselbe Sprache, aber nicht ganz:
  //  · OpenRouter: `max_tokens`, `reasoning:{effort}`, `provider:{…}`, `usage:{include}`
  //  · OpenAI:     `max_completion_tokens`, `reasoning_effort` — und lehnt unbekannte
  //    Felder mit HTTP 400 ab, deshalb dürfen Routing/usage dort NICHT mitgehen.
  const direktOpenAi = anbieter === 'openai';
  const body = {
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: baueNutzerinhalt(user, bilder, videos) },
    ],
  };
  // `temperature` ist optional: OpenAIs Denk-Modelle akzeptieren nur ihre eigene
  // Vorgabe und antworten sonst mit HTTP 400 (siehe ANBIETER.openai in config.mjs).
  // Wer null/undefined übergibt, lässt dem Modell seine Vorgabe.
  if (Number.isFinite(temperature)) body.temperature = temperature;
  if (model) body.model = model;

  if (direktOpenAi) {
    body.max_completion_tokens = maxTokens;
    if (denkAufwand) body.reasoning_effort = denkAufwand;
  } else {
    body.max_tokens = maxTokens;
    body.usage = { include: true };
    if (denyDataCollection) body.provider = { data_collection: 'deny' };
    if (denkAufwand) body.reasoning = { effort: denkAufwand };
  }

  if (strom) {
    const cfg = defaults();
    // Ein Denk-Modell schweigt vor dem ersten Token minutenlang. In dieser
    // Stille reißt die Verbindung gelegentlich ab ("terminated") — beobachtet
    // beim Bündel-Lauf am 2026-08-21. Das ist kein Modell-, sondern ein
    // Leitungsproblem: einmal neu versuchen, statt das Bündel zu verlieren.
    let ergebnis;
    let letzterAbriss;
    for (let versuch = 1; versuch <= 2; versuch++) {
      const res = await fetch(`${baseUrl || cfg.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          ...(direktOpenAi ? {} : KOPFZEILEN),
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
        },
        body: JSON.stringify({ ...body, stream: true }),
      });
      if (!res.ok) {
        const roh = await res.text();
        throw new ApiFehler(`HTTP ${res.status}: ${roh.slice(0, 400) || res.statusText}`, { status: res.status });
      }
      try {
        ergebnis = await liesStrom(res, { onStueck, stilleMs });
        break;
      } catch (err) {
        if (err instanceof ApiFehler) throw err; // echter Fehler im Strom
        letzterAbriss = err;
        if (versuch === 2) {
          throw new ApiFehler(
            `Strom zweimal abgerissen (${err.message}). Mit --kein-strom holt die CLI die ` +
              'Antwort am Stück — das übersteht lange Denkpausen besser.'
          );
        }
        onStueck?.(0, 0);
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
    if (!ergebnis) throw new ApiFehler(`Strom fehlgeschlagen: ${letzterAbriss?.message || 'unbekannt'}`);
    if (!ergebnis.text.trim()) {
      throw new ApiFehler(
        `Modell ${model || '(Kontovorgabe)'} hat keinen Text geliefert ` +
          `(finish_reason: ${ergebnis.finishReason || 'unbekannt'}` +
          `${ergebnis.reasoning ? `, ${ergebnis.reasoning.length} Zeichen Denkschritte` : ''}). ` +
          'Bei Denk-Modellen hilft ein größeres --max-tokens oder ein kleinerer --denk-aufwand.'
      );
    }
    return { ...ergebnis, verwendetesModell: ergebnis.verwendetesModell || model || null, id: null };
  }

  const json = await anfrage('/chat/completions', { apiKey, baseUrl, method: 'POST', body, timeoutMs });
  const choice = json?.choices?.[0];
  const text = choice?.message?.content ?? '';
  if (!text.trim()) {
    // Häufigste Ursache bei Denk-Modellen (reasoning.mandatory): die Antwort lief
    // ins Token-Limit, BEVOR sichtbarer Text entstand — das Nachdenken hat alles
    // aufgebraucht. Das ist kein Netzfehler, sondern eine zu kleine Obergrenze.
    const denkzeichen = (choice?.message?.reasoning || '').length;
    const grund =
      choice?.finish_reason === 'length' || denkzeichen > 0
        ? ' Vermutlich ist das Token-Budget beim Nachdenken aufgebraucht worden' +
          `${denkzeichen ? ` (${denkzeichen} Zeichen Denkschritte, kein Antworttext)` : ''}` +
          ' — mit --max-tokens deutlich erhöhen (Denk-Modelle brauchen ein Vielfaches).'
        : '';
    throw new ApiFehler(
      `Modell ${model || '(Kontovorgabe)'} hat keinen Text geliefert ` +
        `(finish_reason: ${choice?.finish_reason || 'unbekannt'}).${grund}`,
      { body: json }
    );
  }
  return {
    text,
    reasoning: choice?.message?.reasoning || null,
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

/** Kann das Modell Clips lesen? */
export function kannVideo(model) {
  return Boolean(model?.architecture?.input_modalities?.includes('video'));
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
