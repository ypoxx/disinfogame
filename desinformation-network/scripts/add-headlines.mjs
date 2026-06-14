/**
 * Einmaliges Daten-Skript (P0a / B5): plakative `headline_de` an ALLE Aktionen.
 *
 * Arbeitet TEXTBASIERT (nicht über JSON.stringify), um die bestehende Formatierung
 * der Dateien 1:1 zu erhalten — der Diff zeigt nur je eine neue Zeile pro Aktion,
 * direkt hinter `label_de`. Die Zuordnung läuft über die (eindeutigen) label_de-Texte
 * je Aktions-Id; danach wird per JSON.parse gegengeprüft, dass alle 110 Aktionen ein
 * headline_de besitzen. Idempotent: vorhandene headline_de werden nicht doppelt gesetzt.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '..', 'src', 'story-mode', 'data');

/** id → plakative, result-gerahmte Überschrift fürs Ausspielen. */
const HEADLINES = {
  // ta01 — Strategie & Analyse
  '1.1': 'Zielgruppe durchleuchtet',
  '1.2': 'Kampagnenziele festgelegt',
  '1.3': '5-D-Taktik in Stellung gebracht',
  '1.4': 'Akteur-Dossier angelegt',
  '1.5': 'Stimmung im Netz abgehört',
  '1.6': 'Einfluss-Netzwerk kartiert',
  '1.7': 'Spaltthemen ausgemacht',
  '1.8': 'Gegenseite unter Beobachtung',
  '1.9': 'Botschaften auf Wirkung getestet',
  '1.10': 'Kampagnenbilanz gezogen',
  // ta02 — Infrastruktur & Assets
  '2.1': 'Bot-Netzwerk gestartet',
  '2.2': 'Bot-Armee verdoppelt',
  '2.3': 'Troll-Fabrik in Betrieb',
  '2.4': 'Hunderte Fake-Profile angelegt',
  '2.5': 'Operationen anonymisiert',
  '2.6': 'Eigene Server am Netz',
  '2.7': 'Auto-Posting rund um die Uhr',
  '2.8': 'Tarnverein gegründet',
  '2.9': 'Schein-NGO aus der Taufe gehoben',
  '2.10': 'Pseudo-Thinktank eröffnet',
  '2.11': 'Tarnfirma im Handelsregister',
  '2.12': 'Partei heimlich finanziert',
  '2.13': 'Strohmann-Partei aufgestellt',
  '2.14': 'Bildungsträger als Deckmantel gegründet',
  '2.15': 'Schein-Experten erschaffen',
  '2.16': 'Akademiker auf unsere Seite gezogen',
  '2.17': 'Maulwurf in der Redaktion platziert',
  '2.18': 'Drähte zur Politik geknüpft',
  '2.19': 'Nützliche Idioten angeworben',
  '2.20': 'Bewussten Agenten verpflichtet',
  // ta03 — Content-Erzeugung
  '3.1': 'Falschmeldung in Umlauf gebracht',
  '3.2': 'Meme-Welle losgetreten',
  '3.3': 'Empörungs-Video veröffentlicht',
  '3.4': 'KI-Textflut produziert',
  '3.5': 'Deepfake-Video in Umlauf',
  '3.6': 'Gefälschte Tonaufnahme gestreut',
  '3.7': 'Nachrichtenportal gefälscht',
  '3.8': 'Gefälschte „Beweise“ geleakt',
  '3.9': 'Verschwörungserzählung lanciert',
  '3.10': 'Spaltungs-Narrativ ausgerollt',
  '3.11': 'Fakten verwässert',
  '3.12': 'Geschichte umgeschrieben',
  '3.13': 'Empörung als Reichweite gezüchtet',
  '3.14': '„Enthüllungsbuch“ erschienen',
  '3.15': 'Gefällige Studie fabriziert',
  '3.16': 'Pseudo-Doku abgedreht',
  '3.17': 'Pressemitteilung verschickt',
  '3.18': 'Schein-Whistleblower präsentiert',
  '3.19': 'KI-Modelle vergiftet',
  // ta04 — Distribution
  '4.1': 'Botschaft in die Timeline gespült',
  '4.2': 'Blog-Netzwerk in Gang gesetzt',
  '4.3': 'Telegram-Kanal befeuert',
  '4.4': 'Video auf YouTube platziert',
  '4.5': 'Newsletter in die Postfächer',
  '4.6': 'Boulevard mit Skandal gefüttert',
  '4.7': 'Redakteur eingewickelt',
  '4.8': 'Werbekampagne geschaltet',
  '4.9': 'Leserbrief-Flut organisiert',
  '4.10': 'Journalist mit Exklusivstory geködert',
  '4.11': 'Talkradio mit Anrufern geflutet',
  '4.12': 'Unser „Experte“ im TV-Studio',
  '4.13': 'Demonstranten auf die Straße gebracht',
  '4.14': 'Pressekonferenz inszeniert',
  '4.15': 'Fachkonferenz gekapert',
  // ta05 — Verstärkung
  '5.1': 'Bot-Schwarm losgelassen',
  '5.2': 'Hashtag zum Trend gepusht',
  '5.3': 'Troll-Sturm entfesselt',
  '5.4': 'Künstliche Graswurzelbewegung gestartet',
  '5.5': 'Plattformübergreifender Großangriff',
  '5.6': 'Influencer eingekauft',
  '5.7': 'Kampagne am Köcheln gehalten',
  '5.8': 'Informationsraum geflutet',
  '5.9': 'Fake-Personas aufpoliert',
  '5.10': 'Suchergebnisse manipuliert',
  '5.11': 'Narrativ im Mainstream angekommen',
  '5.12': 'Treue Anhängerschaft aufgebaut',
  // ta06 — Politik & Lobbying
  '6.1': 'Wahlkampf heimlich befeuert',
  '6.2': 'Partei von innen gespalten',
  '6.3': 'Lobby-Maschine angeworfen',
  '6.4': 'Gesetzentwurf in unserem Sinne gedreht',
  '6.5': 'Berufsverband unterwandert',
  '6.6': 'Wirtschaftslobby auf Linie gebracht',
  '6.7': 'Schmiergeld geflossen',
  '6.8': 'NGO von innen gekapert',
  '6.9': 'Schein-Bürgerinitiative gegründet',
  '6.10': 'Jugendorganisation ins Leben gerufen',
  // ta07 — Gesellschaft & Kultur
  '7.1': 'Gläubige ins Boot geholt',
  '7.2': 'Kulturkampf angeheizt',
  '7.3': 'Prediger auf unsere Seite gezogen',
  '7.4': 'Kulturevent gekapert',
  '7.5': 'Nationale Ressentiments geschürt',
  '7.6': 'Gesellschaftliche Mitte ausgehöhlt',
  '7.7': 'Wirtschaftsangst geschürt',
  '7.8': 'Medienhaus übernommen',
  // targeting — Targeting & Angriffe
  '8.1': 'Zielperson eingeschüchtert',
  '8.2': 'Rufmord-Kampagne gestartet',
  '8.3': 'Faktenchecker diskreditiert',
  '8.4': 'Vertrauen in Institution untergraben',
  '8.5': 'Fremder Account gekapert',
  '8.6': 'Privatmails erbeutet',
  '8.7': 'Zielperson erpresst',
  '8.8': 'Politiker im Skandal versenkt',
  '8.9': 'Whistleblower mundtot gemacht',
  '8.10': 'Informant angeworben',
  '8.11': 'Gegner-Website lahmgelegt',
  '8.12': 'Algorithmus ausgetrickst',
  '8.13': 'Gefälschtes Daten-Leak gestreut',
  '8.14': 'Kommentarspalten geflutet',
  '8.15': 'Gegner von der Plattform gefegt',
  '8.16': 'False-Flag-Aktion inszeniert',
};

/** JSON-String escapen wie ein JSON-Wert (für die eingefügte Zeile). */
function jsonStr(s) {
  return JSON.stringify(s);
}

/** Alle {id, label_de} einer Datei in Dokument-Reihenfolge. */
function collectActions(json) {
  const out = [];
  const visit = (arr) => arr.forEach((a) => out.push({ id: a.id, label_de: a.label_de, has: 'headline_de' in a }));
  if (Array.isArray(json.actions)) visit(json.actions);
  for (const k of Object.keys(json)) if (Array.isArray(json[k]) && k !== 'actions') visit(json[k]);
  return out;
}

function process(file) {
  const path = join(dataDir, file);
  const raw = readFileSync(path, 'utf8');
  const json = JSON.parse(raw);
  const actions = collectActions(json);

  let text = raw;
  let added = 0;
  for (const { id, label_de, has } of actions) {
    if (has) continue; // idempotent
    const headline = HEADLINES[id];
    if (!headline) throw new Error(`Kein Headline-Mapping für Aktion ${id}`);

    // Exakte label_de-Zeile finden (eindeutig je Aktion), Einrückung übernehmen.
    const needle = `"label_de": ${jsonStr(label_de)}`;
    const idx = text.indexOf(needle);
    if (idx === -1) throw new Error(`label_de-Zeile nicht gefunden für ${id}: ${needle}`);
    const lineStart = text.lastIndexOf('\n', idx) + 1;
    const indent = text.slice(lineStart, idx); // Whitespace vor "label_de"
    const lineEnd = text.indexOf('\n', idx);
    const newLine = `\n${indent}"headline_de": ${jsonStr(headline)},`;
    text = text.slice(0, lineEnd) + newLine + text.slice(lineEnd);
    added++;
  }

  writeFileSync(path, text);

  // Gegenprüfung: gültiges JSON + alle Aktionen haben jetzt headline_de.
  const reparsed = JSON.parse(readFileSync(path, 'utf8'));
  const after = collectActions(reparsed);
  const missing = after.filter((a) => !a.has);
  if (missing.length) throw new Error(`headline_de fehlt nach Lauf: ${missing.map((a) => a.id).join(', ')}`);
  return { file, count: after.length, added };
}

let total = 0;
for (const f of ['actions.json', 'actions_continued.json']) {
  const r = process(f);
  total += r.added;
  console.log(`${r.file}: ${r.added} headline_de eingefügt (${r.count} Aktionen gesamt)`);
}
console.log(`Summe eingefügt: ${total}`);
