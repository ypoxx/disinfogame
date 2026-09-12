// ===========================================
// SERIE — ein ausführlicher Durchgang statt eines Rundumschlags
// ===========================================
// Bei einem Gratis-Modell mit riesigem Kontext ist die Versuchung groß, ALLE
// Screenshots in einen einzigen Aufruf zu kippen. Das Ergebnis ist dann aber
// flach: 60 Bilder in einem Prompt bekommen je zwei Sätze. Stattdessen läuft
// die Serie bündelweise (intro · gebäude · panels · tag/nacht · clips …),
// jedes Bündel bekommt einen eigenen, konzentrierten Durchgang — und am Ende
// fasst ein Synthese-Aufruf die Einzelberichte zusammen.

import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT } from './paths.mjs';

/** Standard-Ort der Visual-Review-Ernte (harvest.mjs). */
export const ERNTE_DIR = path.join(
  REPO_ROOT,
  'desinformation-network',
  'runs',
  'visual-review',
  'latest'
);

export class SerienFehler extends Error {}

/** Manifest der Ernte lesen (ein Eintrag je Screenshot/Clip). */
export function liesManifest(dir = ERNTE_DIR) {
  const datei = path.join(dir, 'manifest.json');
  if (!fs.existsSync(datei)) {
    throw new SerienFehler(
      `Keine Ernte gefunden (${datei}).\n` +
        '  Erst ernten:  cd desinformation-network && npm run build && npm run preview -- --port 4173 &\n' +
        '                node scripts/visual-review/harvest.mjs'
    );
  }
  const roh = JSON.parse(fs.readFileSync(datei, 'utf8'));
  if (!Array.isArray(roh)) throw new SerienFehler(`${datei} enthält kein Array.`);
  return roh;
}

/**
 * Manifest-Einträge zu Bündeln gruppieren. Ein Bündel = ein Durchgang.
 * Reihenfolge folgt dem ersten Auftreten im Manifest (Spielverlauf), nicht dem Alphabet.
 */
export function baueBuendel(manifest, dir = ERNTE_DIR, { nurBuendel = null, maxProBuendel = 12 } = {}) {
  const gesammelt = new Map();

  for (const eintrag of manifest) {
    const kind = eintrag.kind === 'clip' ? 'clip' : 'shot';
    const name = `${eintrag.bundle || 'sonstige'}${kind === 'clip' ? '_clips' : ''}`;
    if (nurBuendel && !nurBuendel.includes(name)) continue;

    const datei = path.join(dir, eintrag.file || '');
    if (!eintrag.file || !fs.existsSync(datei)) continue;

    if (!gesammelt.has(name)) gesammelt.set(name, { name, kind, eintraege: [] });
    gesammelt.get(name).eintraege.push({
      datei,
      text: `${path.basename(datei)} — ${eintrag.desc || eintrag.id || '(ohne Beschreibung)'}`,
    });
  }

  // Zu große Bündel werden GETEILT, nicht beschnitten: ein Durchgang bleibt
  // konzentriert, aber keine Aufnahme fällt still unter den Tisch. Die Teile
  // werden GLEICHMÄSSIG gefüllt — „voll, voll, Rest" ergäbe sonst einen
  // Durchgang mit einer einzelnen Aufnahme (13 Stück wären 12 + 1 statt 7 + 6).
  const fertig = [];
  for (const { name, kind, eintraege } of gesammelt.values()) {
    const teile = Math.ceil(eintraege.length / maxProBuendel);
    const proTeil = Math.ceil(eintraege.length / teile);
    for (let i = 0; i < teile; i++) {
      const stueck = eintraege.slice(i * proTeil, (i + 1) * proTeil);
      fertig.push({
        name: teile > 1 ? `${name}-${i + 1}von${teile}` : name,
        kind,
        dateien: stueck.map((e) => e.datei),
        beschreibungen: stueck.map((e) => e.text),
      });
    }
  }
  return fertig;
}

/** Die Frage für einen Bündel-Durchgang: Linsen-Auftrag plus was hier zu sehen ist. */
export function buendelFrage(linse, buendel, args = {}) {
  const basis = args.frage || linse.auftrag;
  const art = buendel.kind === 'clip' ? 'Clips' : 'Screenshots';
  return [
    basis,
    '',
    `## Dieser Durchgang: Bündel „${buendel.name}" (${buendel.dateien.length} ${art})`,
    '',
    'Das siehst du, in dieser Reihenfolge:',
    ...buendel.beschreibungen.map((b) => `- ${b}`),
    '',
    'Beurteile **nur diese** Aufnahmen, dafür gründlich. Andere Teile des Spiels kommen in',
    'eigenen Durchgängen dran — verweise nicht auf Dinge, die du hier nicht siehst.',
  ].join('\n');
}

/** Die Frage für den abschließenden Synthese-Aufruf über alle Einzelberichte. */
export function syntheseFrage(berichte) {
  return [
    'Du bekommst mehrere Einzel-Gutachten zur Oberfläche desselben Spiels — je eines pro',
    'Bildschirm-Bündel, alle von dir selbst verfasst. Fasse sie jetzt zu EINEM Urteil zusammen.',
    '',
    '## Form',
    '',
    '1. **Das eine Gesamtbild** — 6–10 Sätze: Was ist der rote Faden der Oberfläche? Wo trägt',
    '   die Papier-/Behörden-Idee, wo bricht sie?',
    '2. **Wiederkehrende Muster** — welche Befunde tauchen in MEHREREN Bündeln auf? Genau die',
    '   sind systemisch und nicht Einzelfall. Nenne je Muster die Bündel, in denen es auftrat.',
    '3. **Widersprüche zwischen den Bündeln** — wo verhält sich die Oberfläche uneinheitlich',
    '   (Abstände, Schriftgrößen, Knopf-Formen, Bildsprache)?',
    '4. **Rangliste der 10 wirksamsten Änderungen** — über das ganze Spiel, sortiert nach',
    '   Wirkung pro Aufwand. Je Eintrag: was, wo, warum, geschätzter Aufwand (klein/mittel/groß).',
    '5. **Was zuerst?** — die drei Dinge für die nächste Arbeitssitzung, mit Begründung.',
    '',
    'Antworte auf Deutsch, sachlich, ohne Wiederholung ganzer Passagen aus den Einzelberichten.',
    '',
    '---',
    '',
    ...berichte.map((b) => `\n# Einzel-Gutachten: Bündel „${b.name}"\n\n${b.text}\n`),
  ].join('\n');
}

/**
 * Aufgaben mit begrenzter Gleichzeitigkeit abarbeiten — die Bündel-Durchgänge
 * sind voneinander unabhängig, und ein Denk-Modell braucht je Aufruf Minuten.
 * Nacheinander wäre die Serie sonst stundenlang unterwegs.
 * Die Ergebnisse behalten die Eingabereihenfolge.
 */
export async function parallelBegrenzt(aufgaben, grenze = 3) {
  const ergebnisse = new Array(aufgaben.length);
  let naechste = 0;

  const arbeiter = async () => {
    while (naechste < aufgaben.length) {
      const i = naechste++;
      ergebnisse[i] = await aufgaben[i]();
    }
  };

  await Promise.all(Array.from({ length: Math.max(1, Math.min(grenze, aufgaben.length)) }, arbeiter));
  return ergebnisse;
}
