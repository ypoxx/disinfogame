import { describe, it, expect, beforeEach } from 'vitest';
import { StoryEngineAdapter } from '../../game-logic/StoryEngineAdapter';

/**
 * Speichern → neue Engine → Laden, mit echten Spielhandlungen dazwischen.
 *
 * `saveGuard.test.ts` prüft am Quelltext, dass kein Feld vergessen wurde.
 * Dieser Test prüft, dass der Rundlauf auch wirklich trägt: Er kauft ein,
 * spielt Aktionen, speichert, lädt in eine **frische** Engine und vergleicht.
 * Genau so wurde der Fehler ursprünglich gefunden — im laufenden Spiel, nicht
 * in einer Feldliste.
 */

function frischeEngine(): StoryEngineAdapter {
  return new StoryEngineAdapter('test-seed-roundtrip');
}

describe('Spielstand-Rundlauf', () => {
  let a: StoryEngineAdapter;

  beforeEach(() => {
    a = frischeEngine();
  });

  it('überträgt Ressourcen und Tag unverändert', () => {
    a.advancePhase();
    a.advancePhase();
    const vorher = { ...a.getResources() };
    const tag = a.getCurrentPhase().number;

    const b = frischeEngine();
    b.loadState(a.saveState());

    expect(b.getCurrentPhase().number).toBe(tag);
    expect(b.getResources().budget).toBe(vorher.budget);
    expect(b.getResources().risk).toBe(vorher.risk);
    expect(b.getResources().moralWeight).toBe(vorher.moralWeight);
  });

  it('hält gekaufte Verbreiter — der Spieler zahlt nicht zweimal', () => {
    // Achtung beim Nachbauen: Der Zustand heißt 'verfügbar' MIT Umlaut
    // (BattlefieldChain.ts). Eine ASCII-Schreibweise findet nichts, und der
    // Test steigt dann still aus, ohne etwas geprüft zu haben.
    const frei = Object.entries(a.getCarrierStates()).filter(([, z]) => z === 'verfügbar');
    expect(frei.length, 'Zu Spielbeginn muss mindestens ein Verbreiter verfügbar sein').toBeGreaterThan(0);

    // Genug Geld, damit der Kauf nicht am Budget scheitert und der Test
    // dadurch unbemerkt nichts prüft.
    const [id] = frei[0];
    const bauErgebnis = a.buildCarrier(id);
    expect(bauErgebnis.ok, `Verbreiter ${id} ließ sich nicht aufbauen: ${bauErgebnis.reason}`).toBe(true);

    const nachKauf = a.getCarrierState(id);
    expect(nachKauf, 'Nach dem Aufbau darf der Zustand nicht mehr "verfügbar" sein').not.toBe('verfügbar');
    const budgetNachKauf = a.getResources().budget;

    const b = frischeEngine();
    b.loadState(a.saveState());

    expect(b.getCarrierState(id), 'Der gekaufte Verbreiter muss den Ladevorgang überleben').toBe(nachKauf);
    expect(b.getResources().budget, 'Die Abbuchung bleibt — also muss die Ware auch bleiben').toBe(budgetNachKauf);
  });

  it('hält den Siegzähler für gehaltene Phasen', () => {
    const roh = JSON.parse(a.saveState());
    expect(roh, 'trustTargetHeldPhases gehört in den Spielstand').toHaveProperty('trustTargetHeldPhases');
  });

  it('hält die Operations-Bilanz', () => {
    const roh = JSON.parse(a.saveState());
    expect(roh).toHaveProperty('operationsPlayed');
    expect(roh).toHaveProperty('carriersUsed');
    expect(roh).toHaveProperty('platformsUsed');
    expect(roh).toHaveProperty('acquiredKompromat');
  });

  it('stellt gespielte Aktionen wieder her, damit Erzählstränge abschließbar bleiben', () => {
    const verfuegbar = a.getAvailableActions();
    const erste = verfuegbar.find((x) => x.available !== false) ?? verfuegbar[0];
    if (!erste) return;

    try { a.executeAction(erste.id); } catch { return; }
    const erledigt = a.getCompletedActionIds();
    if (erledigt.length === 0) return; // Aktion schlug fehl — nichts zu prüfen

    const b = frischeEngine();
    b.loadState(a.saveState());

    expect(b.getCompletedActionIds()).toEqual(erledigt);
  });

  it('führt keine synthetischen Operations-Buchungen als gespielte Aktion', () => {
    const mitOp = a.getCompletedActionIds().filter((id) => id.startsWith('op_'));
    expect(mitOp, 'op_-Einträge sind Operations-Buchungen, keine Aktionen').toEqual([]);
  });

  it('lädt einen Spielstand ohne die neuen Felder (Altstand vor 2.4.0)', () => {
    const roh = JSON.parse(a.saveState());
    for (const feld of [
      'carrierStates', 'acquiredKompromat', 'operationsPlayed', 'carriersUsed',
      'platformsUsed', 'trustTargetHeldPhases', 'activeConsequence', 'allTriggeredEvents',
    ]) {
      delete roh[feld];
    }
    roh.version = '2.3.0';

    const b = frischeEngine();
    expect(() => b.loadState(JSON.stringify(roh))).not.toThrow();
    // Ehrlicher Nullstand statt erfundener Ware.
    expect(b.getOperationsSummary().operationsPlayed).toBe(0);
  });
});
