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

  it('hält fest, dass genau diese Wahlen derzeit nichts kosten', () => {
    // Der eigentliche Schaden: Es ist jedes Mal die EINZIGE kostenlose Wahl
    // ihrer Konsequenz. Ändert jemand das (Preis dran oder Wirkung gebaut),
    // schlägt dieser Test an — und dann ist die Freikarte weg, was gut ist.
    const gratisUndWirkungslos = alleWahlen()
      .filter(({ w }) => w.effect && w.effect in OHNE_WIRKUNG)
      .filter(({ w }) => !w.cost && !w.moral_weight)
      .map(({ k, w }) => `${k.id}/${w.id}`);
    expect(gratisUndWirkungslos.sort()).toEqual([
      'cons_election_backfire/withdraw',
      'cons_internal_power_struggle/big_win',
      'cons_international_coalition/retreat',
      'cons_investigation/go_dark',
      'cons_npc_moral_crisis/let_go',
      'cons_npc_moral_crisis/reduce_role',
      'cons_victim_suicide/pause_operations',
    ]);
  });
});
