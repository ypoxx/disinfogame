// ===========================================
// LINSEN — welcher Ausschnitt des Spiels, welche Frage
// ===========================================
// Eine Linse bündelt: Rolle (Systemprompt), Auftrag (die eigentliche Frage)
// und die Quellen, die dem fremden Modell gezeigt werden. Wer eine neue Linse
// braucht, ergänzt hier einen Eintrag — der Test `lenses.test.mjs` prüft, dass
// alle Pfade wirklich existieren (schützt vor umbenannten Dokumenten).

const DATA = 'desinformation-network/src/story-mode/data';

/** Gilt für alle Linsen: Form der Antwort + Ehrlichkeitsregeln. */
export const AUSGABE_REGELN = `
## Form deiner Antwort (bitte genau so)

1. **Kurzfazit** — 5–8 Sätze. Was ist das hier, was trägt, was trägt nicht?
2. **Die stärksten Befunde** — 5 bis 8 Stück, jeder mit:
   - *Befund* (ein Satz, zugespitzt)
   - *Beleg* (welche Datei/welcher Eintrag aus dem Paket — zitiere den Namen wörtlich)
   - *Warum das zählt* (Wirkung auf Spielerlebnis bzw. Lernziel)
   - *Zuversicht* (hoch/mittel/niedrig)
3. **Was ich ändern würde** — 3 bis 5 konkrete, umsetzbare Eingriffe, nach Wirkung/Aufwand sortiert.
4. **Was ich streichen würde** — mindestens ein Vorschlag. Kürzen ist erlaubt.
5. **Blinde Flecken** — was konntest du aus diesem Ausschnitt NICHT beurteilen?

## Ehrlichkeitsregeln (wichtig)

- Du siehst einen **kuratierten Ausschnitt**, nicht das ganze Repository. Erfinde keine
  Dateien, Zeilennummern, Funktionen oder Zahlen, die nicht im Paket stehen.
- Wenn dir für ein Urteil etwas fehlt, sage das ausdrücklich, statt zu raten.
- Widersprich ruhig dem Projekt selbst — die Dokumente sind Selbstbeschreibung, nicht Beweis.
- Antworte auf **Deutsch**, sachlich, ohne Höflichkeitsfloskeln und ohne Lob als Einleitung.
`.trim();

const ROLLE_BASIS =
  'Du bist ein erfahrener, unbestechlicher Gutachter. Du bekommst Auszüge aus einem in Entwicklung ' +
  'befindlichen, deutschsprachigen narrativen Strategiespiel über Desinformation ("Desinformation ' +
  'Network", Story Mode: der Spieler arbeitet für eine Desinformations-Agentur in einer fiktiven Welt — ' +
  'Westunion ≈ EU, Ostland ≈ das Heimatland der Agentur). Ziel des Projekts ist ein Spiel, das ' +
  'unterhält UND gegen reale Manipulation immunisiert. Du sollst nicht ermutigen, sondern schärfen.';

export const LINSEN = [
  {
    id: 'konzept',
    titel: 'Gesamtkonzept & Kernschleife',
    kurz: 'Trägt die Idee? Ist die Spielschleife eine Schleife? Wo widerspricht sich das Projekt?',
    rolle: `${ROLLE_BASIS} Deine Schule: Systemdesign (interessante Entscheidungen, keine dominante Strategie, lesbare Rückkopplung).`,
    auftrag:
      'Beurteile das Gesamtkonzept und die Kernschleife. Besonders: Zahlen die interessanten ' +
      'Entscheidungen auf die Siegbedingung ein, oder laufen zwei getrennte Ökonomien nebeneinander her? ' +
      'Ist die Kampagne (~40 Tage bis zum Wahltag) dramaturgisch tragfähig? Wo widersprechen sich die Dokumente?',
    quellen: [
      { pfad: 'docs/SOUL.md' },
      { pfad: 'docs/VISION_LOCK.md' },
      { pfad: 'docs/DECISIONS_2026-07-04_TRANSKRIPT_SIEG.md' },
      { pfad: 'docs/ZIELBILD_2026-07-04_WETTRENNEN.md' },
      { pfad: 'docs/QUALITAETSMERKMALE.md' },
      { pfad: 'docs/TIME_MODEL.md' },
      { pfad: 'ROADMAP.md' },
      { pfad: `${DATA}/episodes.json`, modus: 'digest', samples: 3 },
      {
        pfad: `${DATA}/actions.json`,
        modus: 'projektion',
        arrays: ['actions'],
        felder: ['id', 'phase', 'label_de', 'costs', 'effects', 'prerequisites', 'unlocks'],
      },
      { pfad: 'docs/STATUS.md', modus: 'kopf', limit: 20000, hinweis: 'aktueller Bau-Stand, Anfang' },
    ],
  },
  {
    id: 'narrativ',
    titel: 'Erzählung, Figuren, Textqualität',
    kurz: 'Stimmen, Dialoge, Episoden — klingt das nach Menschen oder nach Datenbank?',
    rolle: `${ROLLE_BASIS} Deine Schule: narratives Design und Dramaturgie (Figurenstimme, Subtext, Konsequenz statt Kommentar).`,
    auftrag:
      'Beurteile Erzählung und Textqualität. Haben die fünf NPCs unterscheidbare Stimmen? Sind die ' +
      'Episoden echte Wendungen oder Aufgabenlisten? Wo erklärt der Text, was er zeigen müsste? ' +
      'Zitiere schwache Formulierungen wörtlich und schreibe mindestens drei davon besser.',
    quellen: [
      { pfad: 'docs/SOUL.md' },
      { pfad: 'docs/story-mode/PERSONAS.md' },
      { pfad: 'docs/story-mode/SCENARIO_FRAMEWORK.md' },
      { pfad: `${DATA}/episodes.json` },
      { pfad: `${DATA}/npcs.json`, modus: 'digest', samples: 2 },
      { pfad: `${DATA}/dialogues.json`, modus: 'digest', samples: 2, itemChars: 4000 },
      { pfad: `${DATA}/topics_dialogues.json`, modus: 'digest', samples: 2, itemChars: 3000 },
      { pfad: `${DATA}/insert_library.json`, modus: 'digest', samples: 3, itemChars: 2500 },
    ],
  },
  {
    id: 'balance',
    titel: 'Balance & Zahlenwerk',
    kurz: 'Kosten, Effekte, Wahrscheinlichkeiten — gibt es dominante Strategien oder tote Optionen?',
    rolle: `${ROLLE_BASIS} Deine Schule: Spielbalance und Systemökonomie. Du rechnest nach, statt zu vermuten.`,
    auftrag:
      'Beurteile das Zahlenwerk. Suche dominante Strategien (eine Aktion/Kette, die fast immer richtig ist), ' +
      'tote Optionen (nie lohnend), Rückkopplungen ohne Gegenkraft und Wahrscheinlichkeiten, die das ' +
      'Wettrennen gegen das Immunsystem entweder trivial oder unfair machen. Rechne konkret mit den ' +
      'Werten aus dem Paket und nenne die Einträge beim Namen.',
    quellen: [
      { pfad: 'docs/BALANCING_ANALYSIS_2026-06-12.md' },
      { pfad: 'docs/TIME_MODEL.md' },
      { pfad: 'docs/ZIELBILD_2026-07-04_WETTRENNEN.md', modus: 'kopf', limit: 16000 },
      {
        pfad: `${DATA}/actions.json`,
        modus: 'projektion',
        arrays: ['actions'],
        felder: ['id', 'phase', 'label_de', 'costs', 'effects', 'prerequisites', 'unlocks'],
      },
      {
        pfad: `${DATA}/actions_continued.json`,
        modus: 'projektion',
        felder: ['id', 'phase', 'label_de', 'costs', 'effects', 'prerequisites', 'unlocks'],
      },
      {
        pfad: `${DATA}/actions_p3_phenomena.json`,
        modus: 'projektion',
        felder: ['id', 'phase', 'label_de', 'costs', 'effects', 'prerequisites', 'unlocks'],
      },
      {
        pfad: `${DATA}/world-events.json`,
        modus: 'projektion',
        arrays: ['worldEvents'],
        felder: ['id', 'type', 'scale', 'trigger', 'probability', 'severity', 'effects', 'cascades_to'],
      },
      {
        pfad: `${DATA}/consequences.json`,
        modus: 'projektion',
        arrays: ['consequences'],
        felder: ['id', 'type', 'triggered_by', 'delay', 'probability', 'effects', 'can_trigger'],
      },
      {
        pfad: `${DATA}/countermeasures.json`,
        modus: 'projektion',
        arrays: ['countermeasures'],
        felder: ['id', 'disarm_ref', 'severity', 'trigger', 'effects', 'counter_options'],
      },
    ],
  },
  {
    id: 'onboarding',
    titel: 'Erste Stunde & Verständlichkeit',
    kurz: 'Versteht ein Neuling, was er tut, warum, und was gerade passiert ist?',
    rolle: `${ROLLE_BASIS} Deine Schule: Onboarding und UX für komplexe Simulationen. Du misst in "Sekunden bis zur ersten sinnvollen Entscheidung".`,
    auftrag:
      'Beurteile den Einstieg. Wann trifft der Spieler die erste bedeutsame Entscheidung? Welche Begriffe ' +
      'muss er kennen, bevor sie erklärt werden? Bekommt er nach jeder Aktion eine lesbare Rückmeldung, ' +
      'was sie bewirkt hat? Formuliere den Ablauf der ersten 10 Minuten so um, wie du ihn bauen würdest.',
    quellen: [
      { pfad: 'docs/DAY_ONE_WALKTHROUGH.md' },
      { pfad: 'docs/GESAMTKONZEPT_VISUELL.md' },
      { pfad: 'docs/DESIGN_GLOSSAR.md' },
      { pfad: 'docs/QUALITAETSMERKMALE.md' },
      { pfad: `${DATA}/building.json`, modus: 'digest', samples: 3 },
      { pfad: `${DATA}/episodes.json`, modus: 'digest', samples: 2 },
      { pfad: 'docs/STATUS.md', modus: 'kopf', limit: 12000, hinweis: 'aktueller Bau-Stand, Anfang' },
    ],
  },
  {
    id: 'bildung',
    titel: 'Bildungswirkung & Verantwortung',
    kurz: 'Immunisiert das Spiel wirklich — oder liefert es nur eine hübsche Anleitung?',
    rolle: `${ROLLE_BASIS} Deine Schule: Medienkompetenz-Forschung (Inoculation Theory, Prebunking) und Ethik von Persuasive Games. Du prüfst Wirkung und Missbrauchsrisiko gleichzeitig.`,
    auftrag:
      'Beurteile die Bildungswirkung. Lernt der Spieler übertragbare Erkennungsmuster oder nur die ' +
      'Spielmechanik? Wo besteht das Risiko, dass das Spiel eher als Handbuch denn als Impfung wirkt, und ' +
      'welche Reibung würde das verhindern, ohne den Spielspaß zu töten? Prüfe außerdem, ob die ' +
      'Fiktionalisierung (Westunion/Ostland) trägt oder an realen Vorlagen entlangschrammt.',
    quellen: [
      { pfad: 'docs/SOUL.md' },
      { pfad: 'docs/QUALITAETSMERKMALE.md' },
      { pfad: 'docs/story-mode/SCENARIO_FRAMEWORK.md' },
      {
        pfad: `${DATA}/disinfo_methods.json`,
        modus: 'digest',
        samples: 3,
        itemChars: 2500,
      },
      {
        pfad: `${DATA}/countermeasures.json`,
        modus: 'digest',
        samples: 3,
        itemChars: 2500,
      },
      { pfad: `${DATA}/personas.json`, modus: 'digest', samples: 3 },
      { pfad: `${DATA}/audience.json`, modus: 'digest', samples: 2, itemChars: 6000 },
      {
        pfad: `${DATA}/actions.json`,
        modus: 'projektion',
        arrays: ['actions'],
        felder: ['id', 'phase', 'disarm_ref', 'label_de', 'narrative_de'],
      },
    ],
  },
  {
    id: 'architektur',
    titel: 'Code-Architektur',
    kurz: 'Wo sammelt sich die Komplexität, und was wird als Nächstes teuer?',
    rolle: `${ROLLE_BASIS} Deine Schule: Software-Architektur für React/TypeScript-Spiele. Du urteilst über Struktur, nicht über Stilfragen.`,
    auftrag:
      'Beurteile die Architektur anhand des Datei-Inventars und der Karte. Wo ballt sich Komplexität? ' +
      'Welche Schnitte würdest du ziehen, in welcher Reihenfolge, und was ist der billigste erste Schritt ' +
      'mit echter Wirkung? Warne ausdrücklich vor Umbauten, die sich nicht lohnen.',
    quellen: [
      { pfad: 'docs/CODEBASE_MAP.md' },
      { pfad: 'CLAUDE_INSTRUCTIONS.md' },
      { pfad: 'desinformation-network/src/story-mode', modus: 'baum', maxDateien: 160 },
      { pfad: 'desinformation-network/src/game-logic', modus: 'baum', maxDateien: 40 },
      { pfad: 'docs/STATUS.md', modus: 'kopf', limit: 12000, hinweis: 'aktueller Bau-Stand, Anfang' },
    ],
  },
];

export function findeLinse(id) {
  return LINSEN.find((l) => l.id === id) || null;
}

export function linsenIds() {
  return LINSEN.map((l) => l.id);
}
