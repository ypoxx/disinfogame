import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Wache über die Wirkung der Konsequenz-Wahlen.
 *
 * Die Konsequenzen sind das Lehrstück des Spiels: „Jede Aktion hat
 * Konsequenzen." Sechs von ihnen tragen eine Wahl, deren ganzer Preis in einem
 * Feld `effect` steht — und dieses Feld liest die Engine nicht. In allen sechs
 * Fällen ist ausgerechnet DIESE Wahl die einzige ohne Budget, Kapazität, Risiko
 * und Moralgewicht. Wer immer sie nimmt, zahlt für sechs Konsequenzen nichts,
 * darunter eine kritische. Aus dem Lehrstück wird eine Freikarte.
 *
 * Der Befund ist mechanisch belegbar, die Abhilfe ist eine Design-Entscheidung
 * (was soll „Operationen pausieren" kosten?). Diese Wache tut deshalb das, was
 * ohne Entscheidung richtig ist: Sie hält die Schuld sichtbar und schlägt an,
 * sobald eine ACHTE tote Wirkung dazukommt oder eine der sieben umgesetzt wird,
 * ohne aus der Liste zu wandern.
 */

const WURZEL = resolve(__dirname, '../..');
const DATEN = resolve(WURZEL, 'story-mode/data/consequences.json');
const ADAPTER = resolve(WURZEL, 'game-logic/StoryEngineAdapter.ts');

/** Wirkungen, die die Engine tatsächlich ausführt. */
const UMGESETZT: string[] = [];

/**
 * Wirkungen, die nur in den Daten stehen. Jede mit dem, was sie bedeuten
 * sollte — damit die Entscheidung vorbereitet ist und nicht neu erhoben
 * werden muss.
 */
const OHNE_WIRKUNG: Record<string, string> = {
  all_actions_paused_2_phases: 'cons_investigation/go_dark — zwei Phasen ohne Maßnahmen',
  targeting_paused_3_phases: 'cons_victim_suicide/pause_operations — drei Phasen ohne Angriffs-Operationen',
  npc_restricted_actions: 'cons_npc_moral_crisis/reduce_role — dieser Berater trägt keine dunklen Ops mehr',
  lose_npc: 'cons_npc_moral_crisis/let_go — der Berater ist weg',
  lose_election_influence: 'cons_election_backfire/withdraw — der Wahl-Hebel fällt dauerhaft',
  reduced_scope: 'cons_international_coalition/retreat — Operationen nur noch im Kerngebiet',
  increases_risk_taking: 'cons_internal_power_struggle/big_win — künftige Züge werden riskanter',
};

interface Wahl { id: string; effect?: string; cost?: Record<string, number>; moral_weight?: number }
interface Konsequenz { id: string; severity: string; player_choices?: Wahl[] }

const daten = JSON.parse(readFileSync(DATEN, 'utf8')) as { consequences: Konsequenz[] };
const adapterQuelle = readFileSync(ADAPTER, 'utf8');

function alleWahlen(): { k: Konsequenz; w: Wahl }[] {
  return daten.consequences.flatMap((k) => (k.player_choices ?? []).map((w) => ({ k, w })));
}

describe('Wirkung der Konsequenz-Wahlen', () => {
  it('jede Wirkung ist entweder umgesetzt oder als offen verzeichnet', () => {
    const unbekannt = alleWahlen()
      .filter(({ w }) => w.effect && !UMGESETZT.includes(w.effect) && !(w.effect in OHNE_WIRKUNG))
      .map(({ k, w }) => `${k.id}/${w.id} — ${w.effect}`);
    expect(
      unbekannt,
      'Neue `effect`-Kennung ohne Umsetzung und ohne Eintrag in OHNE_WIRKUNG:\n  ' + unbekannt.join('\n  ')
    ).toEqual([]);
  });

  it('was als umgesetzt gilt, steht auch im Adapter', () => {
    const fehlen = UMGESETZT.filter((id) => !adapterQuelle.includes(id));
    expect(fehlen, 'als umgesetzt geführt, im Adapter aber nicht auffindbar').toEqual([]);
  });

  it('was als offen gilt, ist im Adapter wirklich nicht umgesetzt', () => {
    // Sobald jemand eine der sieben einbaut, soll dieser Test ihn daran
    // erinnern, sie aus OHNE_WIRKUNG nach UMGESETZT zu heben.
    const doch = Object.keys(OHNE_WIRKUNG).filter((id) => adapterQuelle.includes(id));
    expect(doch, 'steht im Adapter — gehört nach UMGESETZT statt nach OHNE_WIRKUNG').toEqual([]);
  });

  it('benennt jede offene Wirkung mit ihrer gemeinten Bedeutung', () => {
    expect(Object.entries(OHNE_WIRKUNG).filter(([, t]) => !t.trim()).map(([id]) => id)).toEqual([]);
  });

  it('keine Wahl ist gleichzeitig kostenlos und wirkungslos', () => {
    // Der eigentliche Schaden war nicht die fehlende Mechanik, sondern die
    // Freikarte: In allen sechs betroffenen Konsequenzen war ausgerechnet die
    // Wahl mit der toten Wirkung die EINZIGE ohne Budget, Kapazität, Risiko und
    // Moralgewicht — bei „cons_international_coalition" (kritisch) kostenlos
    // gegen 20–40 Budget der Geschwister. Wer sie immer nahm, zahlte für sechs
    // Konsequenzen nichts. Seit 2026-09-12 trägt jede einen Preis.
    const gratisUndWirkungslos = alleWahlen()
      .filter(({ w }) => w.effect && w.effect in OHNE_WIRKUNG)
      .filter(({ w }) => !w.cost && !w.moral_weight)
      .map(({ k, w }) => `${k.id}/${w.id}`);
    expect(
      gratisUndWirkungslos.sort(),
      'Diese Wahlen kosten nichts UND wirken nichts — sie sind eine Freikarte:\n  ' +
        gratisUndWirkungslos.join('\n  ')
    ).toEqual([]);
  });

  it('die Preise liegen auf der Skala der übrigen Wahlen', () => {
    // Kein Ausreißer nach oben oder unten: Die vorhandenen Wahlen kosten
    // Budget 15–40, Kapazität 1–4, Risiko 8–15. Die neuen Preise bleiben darin.
    const GRENZEN: Record<string, [number, number]> = {
      budget: [5, 50],      // Obergrenze: cons_whistleblower/negotiate (Schweigegeld)
      capacity: [1, 4],
      risk: [3, 15],
      moral_weight: [1, 5],
      political_influence: [-1, 1],  // Anteil, kein Punktwert
    };
    const ausreisser: string[] = [];
    for (const { k, w } of alleWahlen()) {
      for (const [feld, wert] of Object.entries(w.cost ?? {})) {
        const grenze = GRENZEN[feld];
        if (!grenze) { ausreisser.push(`${k.id}/${w.id}: unbekanntes Kostenfeld ${feld}`); continue; }
        if (wert < grenze[0] || wert > grenze[1]) {
          ausreisser.push(`${k.id}/${w.id}: ${feld}=${wert} außerhalb ${grenze[0]}–${grenze[1]}`);
        }
      }
    }
    expect(ausreisser).toEqual([]);
  });

  /**
   * Felder, die absichtlich nur in den Daten stehen — mit Grund. Ein Preis,
   * den niemand abbucht, ist sonst auch nur ein Text: `cost.risk` wurde so
   * verschluckt, und `cost.moral_weight` ebenso, weil Adapter und Modal auf
   * `moralWeight` lasen — einen Schlüssel, den es in den Daten nie gab.
   */
  const NUR_DATEN: Record<string, string> = {
    political_influence:
      'Diese Ressource gibt es im Spiel nicht; die Wahl trägt daneben einen wirksamen Preis. Bleibt als Absichtserklärung für die Mechanik (offener Punkt 1b).',
  };

  it('die Engine wendet jedes wirksame Kostenfeld an', () => {
    const felder = new Set<string>();
    for (const { w } of alleWahlen()) for (const f of Object.keys(w.cost ?? {})) felder.add(f);
    const nichtGezogen = [...felder]
      .filter((f) => !(f in NUR_DATEN))
      .filter((f) => !adapterQuelle.includes(`choice.cost.${f}`));
    expect(
      nichtGezogen,
      'Kostenfeld steht in den Daten, wird aber nirgends abgebucht:\n  ' + nichtGezogen.join('\n  ')
    ).toEqual([]);
  });

  it('jede Wahl mit einem Nur-Daten-Feld trägt daneben einen wirksamen Preis', () => {
    // Sonst ist die Wahl trotz gefüllter `cost` faktisch gratis.
    const WIRKSAM = ['budget', 'capacity', 'risk', 'moral_weight'];
    const scheinPreis = alleWahlen()
      .filter(({ w }) => w.cost && Object.keys(w.cost).some((f) => f in NUR_DATEN))
      .filter(({ w }) => !WIRKSAM.some((f) => w.cost?.[f]))
      .map(({ k, w }) => `${k.id}/${w.id}`);
    expect(scheinPreis, 'trägt nur ein Feld, das die Engine nicht kennt').toEqual([]);
  });

  it('benennt zu jedem Nur-Daten-Feld einen Grund', () => {
    expect(Object.entries(NUR_DATEN).filter(([, g]) => !g.trim()).map(([f]) => f)).toEqual([]);
  });
});
