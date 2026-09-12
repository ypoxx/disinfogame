import { describe, it, expect } from 'vitest';
import { StoryEngineAdapter, START_BUDGET, MAX_CAPACITY } from '../../game-logic/StoryEngineAdapter';
import actionsData from '../data/actions.json';

/**
 * Wache: Die angezeigte Budgetzahl ist die, um die das Budget sinkt.
 *
 * Vorgeschichte: Der NPC-Rabatt wurde erst beim Abbuchen verrechnet, nie in der
 * Anzeige. Karte, Terminal und Tafel nannten den Listenpreis, das Budget sank
 * um weniger. Am Rand der Kasse sperrte die Tafel Pläne als „ZU TEUER", die in
 * Wahrheit bezahlbar waren — und gerade die teuren Struktur-Aktionen hängen am
 * Direktor-Rabatt.
 *
 * Der Rabatt greift jetzt genau einmal, in `convertToStoryAction`. Dieser Test
 * hält beide Richtungen fest: Er schlägt an, wenn die Anzeige den Listenpreis
 * zurückbekommt — und ebenso, wenn irgendwo ein zweiter Rabatt einzieht und der
 * Spieler weniger zahlt als angezeigt.
 */

describe('Preis-Wahrheit', () => {
  it('Budget sinkt um exakt die angezeigte Zahl', () => {
    const engine = new StoryEngineAdapter('preis-wahrheit');

    const kandidat = engine
      .getAvailableActions()
      .find((a) => a.available !== false && (a.costs.budget ?? 0) > 0);

    expect(kandidat, 'Zu Spielbeginn muss eine bezahlbare Aktion mit Budgetkosten verfügbar sein').toBeDefined();

    const angezeigt = kandidat!.costs.budget as number;
    const vorher = engine.getResources().budget;

    const ergebnis = engine.executeAction(kandidat!.id);
    expect(ergebnis.success, 'Die Aktion musste durchlaufen, sonst prüft der Test nichts').toBe(true);

    const gezahlt = vorher - engine.getResources().budget;
    expect(
      gezahlt,
      `Angezeigt ${angezeigt}K, abgebucht ${gezahlt}K — Anzeige und Abbuchung müssen übereinstimmen`
    ).toBe(angezeigt);
  });

  it('das Ergebnis-Delta nennt denselben Betrag wie die Anzeige', () => {
    const engine = new StoryEngineAdapter('preis-delta');
    const kandidat = engine
      .getAvailableActions()
      .find((a) => a.available !== false && (a.costs.budget ?? 0) > 0);
    expect(kandidat).toBeDefined();

    const angezeigt = kandidat!.costs.budget as number;
    const ergebnis = engine.executeAction(kandidat!.id);
    const delta = ergebnis.resourceChanges?.budget;

    // Deltas sind signiert: Verbrauch ist negativ.
    expect(delta, 'Das Ergebnis-Modal muss denselben Betrag zeigen wie die Karte').toBe(-angezeigt);
  });

  it('keine Aktion kostet mehr als das Startbudget — sonst wäre sie nie spielbar', () => {
    const engine = new StoryEngineAdapter('preis-obergrenze');
    const zuTeuer = engine
      .getAvailableActions()
      .filter((a) => (a.costs.budget ?? 0) > START_BUDGET * 3)
      .map((a) => `${a.id} (${a.costs.budget}K)`);
    // Dreifaches Startbudget als großzügige Schranke: Tranchen kommen dazu.
    expect(zuTeuer, `Unerreichbar teuer: ${zuTeuer.join(', ')}`).toEqual([]);
  });

  it('der NPC-Rabatt ist in der Anzeige schon enthalten', () => {
    // Ohne diesen Test genügt es, den Rabatt ÜBERALL wegzulassen: Anzeige und
    // Abbuchung stimmen dann zwar überein, aber der Rabatt ist wirkungslos.
    // Genau das ist mir beim Schreiben der Wache zuerst passiert.
    const engine = new StoryEngineAdapter('rabatt-wirkt');
    const listenpreise = new Map<string, number>(
      (actionsData as { actions: Array<{ id: string; costs?: { budget?: number } }> }).actions
        .filter((a) => (a.costs?.budget ?? 0) > 0)
        .map((a) => [a.id, a.costs!.budget as number])
    );

    const rabattiert = engine
      .getAvailableActions()
      .filter((a) => (a.npcAffinity?.length ?? 0) > 0)
      .map((a) => ({ id: a.id, gezeigt: a.costs.budget ?? 0, liste: listenpreise.get(a.id) ?? 0 }))
      .filter((x) => x.liste > 0 && x.gezeigt < x.liste);

    expect(
      rabattiert.length,
      'Keine einzige Aktion wird günstiger angezeigt als ihr Listenpreis — ' +
      'der NPC-Rabatt greift in der Anzeige nicht.'
    ).toBeGreaterThan(0);
  });

  it('die Bezugswerte des Beraters stammen aus dem Spiel, nicht aus der Luft', () => {
    const engine = new StoryEngineAdapter('berater-bezug');
    const res = engine.getResources();
    // Der Berater meldete „kritisch" ab Zug 1, weil er gegen 1000/100 rechnete.
    expect(res.budget).toBe(START_BUDGET);
    expect(res.capacity).toBeLessThanOrEqual(MAX_CAPACITY);
    expect(START_BUDGET).toBeLessThan(1000);
    expect(MAX_CAPACITY).toBeLessThan(100);
  });
});
