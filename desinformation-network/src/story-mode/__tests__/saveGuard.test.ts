import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Wache gegen Spielstand-Lücken.
 *
 * Vorgeschichte: `saveState()` ließ neun Zustandsfelder aus. Am teuersten war
 * das Schlachtfeld — gekaufte Verbreiter und beschafftes Kompromat fielen beim
 * Fortsetzen auf „verfügbar" zurück, während Budget, Kapazität und Risiko der
 * Käufe gespeichert blieben. Der Spieler zahlte dieselbe Ware zweimal. Dazu
 * verschwand eine wartende Konsequenz samt Frist, und `trustTargetHeldPhases`
 * begann wieder bei null, obwohl der Sieg drei gehaltene Phasen verlangt.
 *
 * Der Test liest den Quelltext, statt eine Liste von Feldnamen zu pflegen: Er
 * findet **jedes** neue Zustandsfeld und verlangt, dass es entweder gespeichert
 * oder ausdrücklich als ephemer eingetragen wird. Eine Namensliste hätte genau
 * die Lücke, die sie schließen soll — niemand denkt beim Anlegen eines Feldes
 * an den Test.
 */

const quelle = readFileSync(
  resolve(__dirname, '../../game-logic/StoryEngineAdapter.ts'),
  'utf8'
);

/**
 * Felder, die bewusst NICHT in den Spielstand gehören — jeweils mit Grund.
 * Wer hier etwas einträgt, trifft eine Entscheidung; wer es vergisst, bekommt
 * einen roten Test.
 */
const EPHEMER: Record<string, string> = {
  // Aus Spieldaten geladen, bei jedem Start identisch.
  audienceSegments: 'readonly, kommt aus audience.json',
  methodFamilies: 'readonly, kommt aus disinfo_methods.json',
  npcDialogues: 'wird beim Start aus npcs.json befüllt',
  // Subsysteme: ihr Zustand wird separat über exportState gesichert.
  betrayalSystem: 'Zustand über betrayalSystemState',
  countermeasureSystem: 'Zustand über countermeasureSystemState',
  dialogLoader: 'Zustand über dialogLoaderState',
  extendedActorLoader: 'Zustand über extendedActorLoaderState',
  endingSystem: 'zustandslos — errechnet das Ende aus dem übrigen Stand',
  // Bewusst genullt (siehe Kommentare in loadState).
  lastMaschenDaempfung: 'bewusst genullt: sonst Quittung aus der Vorpartie',
  letzterFamilienEinsatz: 'bewusst genullt: sonst impft der erste Faktencheck die Vorpartie ein',
  // Zwischenzustand innerhalb einer Phase.
  triggeredEventsThisPhase: 'wird bei jedem Phasenwechsel geleert',
  engineState: 'Brücke zum Pro-Mode-Zustand, im Story-Mode ungenutzt',
};

function zustandsfelder(): string[] {
  const klasse = quelle.slice(quelle.indexOf('export class StoryEngineAdapter'));
  const namen = new Set<string>();
  for (const zeile of klasse.split('\n')) {
    const m = zeile.match(/^ {2}(?:private|public|protected)\s+(?:readonly\s+)?([a-zA-Z_][a-zA-Z0-9_]*)\s*(?::|=)/);
    if (!m) continue;
    const bis = zeile.search(/[:=]/);
    if (zeile.slice(0, bis).includes('(')) continue;   // Methode, kein Feld
    if (/^[A-Z_0-9]+$/.test(m[1])) continue;            // Konstante
    namen.add(m[1]);
  }
  return [...namen];
}

function gespeicherteFelder(): Set<string> {
  const von = quelle.indexOf('saveState(): string');
  const bis = quelle.indexOf('loadState(savedState');
  const block = quelle.slice(von, bis);
  return new Set([...block.matchAll(/this\.([a-zA-Z_][a-zA-Z0-9_]*)/g)].map((m) => m[1]));
}

describe('Spielstand-Vollständigkeit', () => {
  it('findet überhaupt Zustandsfelder (Regex nicht verrutscht)', () => {
    expect(zustandsfelder().length).toBeGreaterThan(30);
  });

  it('jedes Zustandsfeld wird gespeichert oder ist als ephemer eingetragen', () => {
    const fehlend = zustandsfelder()
      .filter((f) => !gespeicherteFelder().has(f))
      .filter((f) => !(f in EPHEMER));
    expect(
      fehlend,
      `Diese Felder gehen beim Fortsetzen verloren. Entweder in saveState/loadState ` +
      `aufnehmen oder in EPHEMER mit Begründung eintragen: ${fehlend.join(', ')}`
    ).toEqual([]);
  });

  it('jedes gespeicherte Feld wird beim Laden auch zurückgelesen', () => {
    const von = quelle.indexOf('loadState(savedState');
    const load = quelle.slice(von, von + 12000);
    // Felder, die saveState schreibt, müssen in loadState wieder auftauchen.
    const nurLesen = ['activeOpportunityWindows'];  // wird über Map-Konstruktor gesetzt
    const vergessen = [...gespeicherteFelder()]
      .filter((f) => !nurLesen.includes(f))
      .filter((f) => !(f in EPHEMER))
      .filter((f) => !load.includes(`this.${f}`));
    expect(
      vergessen,
      `In saveState gespeichert, in loadState nicht zurückgelesen: ${vergessen.join(', ')}`
    ).toEqual([]);
  });

  it('EPHEMER trägt zu jedem Eintrag eine Begründung', () => {
    const ohne = Object.entries(EPHEMER).filter(([, grund]) => !grund.trim());
    expect(ohne.map(([f]) => f)).toEqual([]);
  });
});
