import { describe, it, expect } from 'vitest';
import consequencesData from '../data/consequences.json';
import { CONSEQUENCE_SEVERITIES, ignorierFolgen, type ConsequenceDefinition } from '../engine/ConsequenceSystem';
import { ausgangText } from '../engine/consequenceOutcome';

/**
 * Wache für den Konsequenz-Datenpfad.
 *
 * Vorgeschichte: `consequences.json` und der TypeScript-Typ beschrieben zwei
 * verschiedene Schemata. Sichtbar wurde das nicht, weil die Daten per `as any`
 * an der Typprüfung vorbeigingen — `tsc` blieb grün, während im Spiel
 * `severity.toUpperCase()` auf `undefined` lief und die gesamte Oberfläche
 * mitriss. Weitere stille Folgen derselben Lücke: die Wahl-Kosten waren nie
 * sichtbar (`costs` statt `cost`), der Erzähltext jeder Konsequenz wurde durch
 * einen Platzhalter ersetzt (`description_de` statt `narrative_de`), und die
 * sieben angelegten Eskalationsketten liefen ins Leere.
 *
 * Diese Tests prüfen die **Regel**, nicht die heutigen Zahlen: Sie schlagen
 * fehl, sobald eine neue Definition ein Pflichtfeld auslässt — nicht erst,
 * wenn ein Spieler darüber stolpert.
 */

const defs = (consequencesData as { consequences: ConsequenceDefinition[] }).consequences;

describe('consequences.json — Pflichtfelder', () => {
  it('hat überhaupt Definitionen', () => {
    expect(defs.length).toBeGreaterThan(0);
  });

  it('jede Definition trägt eine gültige severity', () => {
    const ohne = defs
      .filter((d) => !CONSEQUENCE_SEVERITIES.includes(d.severity))
      .map((d) => `${d.id} (${String(d.severity)})`);
    expect(ohne, `Ohne gültige severity: ${ohne.join(', ')}`).toEqual([]);
  });

  it('jede Definition trägt label_de und narrative_de', () => {
    const luecken = defs
      .filter((d) => !d.label_de?.trim() || !d.narrative_de?.trim())
      .map((d) => d.id);
    expect(luecken, `Ohne Text: ${luecken.join(', ')}`).toEqual([]);
  });

  it('positive Konsequenzen sind als chance eingestuft, negative nicht', () => {
    const falsch = defs
      .filter((d) => (d.type === 'opportunity') !== (d.severity === 'chance'))
      .map((d) => `${d.id}: type=${d.type} severity=${d.severity}`);
    expect(falsch, `Typ und Schwere widersprechen sich: ${falsch.join(' · ')}`).toEqual([]);
  });
});

describe('consequences.json — Spielerwahlen', () => {
  const wahlen = defs.flatMap((d) => (d.player_choices ?? []).map((c) => ({ def: d.id, c })));

  it('jede Wahl hat eine Beschriftung', () => {
    const ohne = wahlen.filter(({ c }) => !c.label_de?.trim()).map(({ def, c }) => `${def}/${c.id}`);
    expect(ohne).toEqual([]);
  });

  it('jeder outcome-Bezeichner hat einen lesbaren Text', () => {
    const ohne = wahlen
      .filter(({ c }) => c.outcome && !ausgangText(c.outcome))
      .map(({ def, c }) => `${def}/${c.id}: ${c.outcome}`);
    expect(ohne, `Ohne Text in consequenceOutcome.ts: ${ohne.join(' · ')}`).toEqual([]);
  });

  it('Kosten nutzen nur Schlüssel, die der Adapter auch anwendet', () => {
    // Der Adapter liest budget/capacity/risk/moral_weight. Ein weiterer
    // Schlüssel würde stillschweigend verschluckt — genau so ging `capacity`
    // früher verloren.
    const erlaubt = new Set(['budget', 'capacity', 'risk', 'moral_weight', 'political_influence']);
    const fremd = wahlen
      .flatMap(({ def, c }) => Object.keys(c.cost ?? {}).map((k) => ({ def, id: c.id, k })))
      .filter(({ k }) => !erlaubt.has(k))
      .map(({ def, id, k }) => `${def}/${id}: ${k}`);
    expect(fremd, `Unbekannte Kostenart: ${fremd.join(' · ')}`).toEqual([]);
  });
});

describe('Eskalationsketten', () => {
  it('jede can_trigger-Angabe zeigt auf eine existierende Konsequenz', () => {
    const ids = new Set(defs.map((d) => d.id));
    const tot = defs
      .flatMap((d) => (d.can_trigger ?? []).map((t) => ({ von: d.id, t })))
      .filter(({ t }) => !ids.has(t))
      .map(({ von, t }) => `${von} → ${t}`);
    expect(tot, `Kette ins Leere: ${tot.join(' · ')}`).toEqual([]);
  });

  it('Ignorieren löst die angelegte Folgekonsequenz aus', () => {
    const mitKette = defs.find((d) => d.can_trigger?.length);
    expect(mitKette, 'Keine Konsequenz mit can_trigger in den Daten').toBeDefined();
    expect(ignorierFolgen(mitKette!).chain_trigger).toBe(mitKette!.can_trigger![0]);
  });
});

describe('Strafe fürs Aussitzen', () => {
  it('steigt streng mit der Schwere', () => {
    const stufen = ['minor', 'moderate', 'severe', 'critical'] as const;
    const werte = stufen.map((s) => ignorierFolgen({ severity: s } as unknown as ConsequenceDefinition).risk_increase);
    for (let i = 1; i < werte.length; i++) {
      expect(werte[i], `${stufen[i]} muss teurer sein als ${stufen[i - 1]}`).toBeGreaterThan(werte[i - 1]);
    }
  });

  it('bestraft eine verpasste Gelegenheit nicht', () => {
    const folgen = ignorierFolgen({ severity: 'chance' } as unknown as ConsequenceDefinition);
    expect(folgen.risk_increase).toBe(0);
    expect(folgen.attention_increase).toBe(0);
  });

  it('fällt bei unbekannter Schwere auf eine mittlere Strafe zurück', () => {
    const folgen = ignorierFolgen({ severity: 'quatsch' } as unknown as ConsequenceDefinition);
    expect(folgen.risk_increase).toBeGreaterThan(0);
  });
});
