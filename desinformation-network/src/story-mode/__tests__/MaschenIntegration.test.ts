/**
 * Etappe 4 — Integration: das Maschen-Gedächtnis lebt im Adapter.
 * Belegt am ECHTEN Engine-Pfad: (1) Wiederholung verpufft sichtbar (Wirkung sinkt,
 * E5-Quittung nennt Ursache), (2) Stempel-Vorschau VOR dem Ausgeben (E7),
 * (3) „Gepatcht" markiert die Familie überall als bekannt (EIN System, Falle 6),
 * (4) Prebunking (cm24) impft statt Trust-Regen — mit medienferner Lücke,
 * (5) Save/Load + Migration der alten globalen Zählung, (6) Wohnzimmer-Alphabet.
 *
 * Test-Familie: `divisive_narratives` — 3.3/3.9/3.11/3.12 sind voraussetzungsfrei,
 * billig und teilen Kanal (tv) + Themen → dieselben Ziel-Milieus.
 */
import { describe, it, expect } from 'vitest';
import { createStoryEngine } from '../../game-logic/StoryEngineAdapter';
import { loadAudience } from '../audience/audienceModel';

const FAMILIE = ['3.3', '3.12', '3.9', '3.11'];

/** Budget/Kapazität aufpumpen, damit die Kosten nie der limitierende Faktor sind. */
function pumpResources(e: ReturnType<typeof createStoryEngine>): void {
  const save = JSON.parse(e.saveState());
  save.storyResources.budget = 900;
  save.storyResources.capacity = 900;
  e.loadState(JSON.stringify(save));
}

describe('Maschen-Gedächtnis im Adapter (Etappe 4)', () => {
  it('Wiederholung derselben Familie verpufft: Quittung nennt Ursache + Tag (E5), Stempel warnen vorher (E7)', () => {
    const e = createStoryEngine('mg_repeat');
    pumpResources(e);

    // Vorschau VOR dem ersten Einsatz: FRISCH, volle Wirkung.
    const vorschau0 = e.getMaschenVorschau('3.9');
    expect(vorschau0).not.toBeNull();
    expect(vorschau0!.familieId).toBe('divisive_narratives');
    expect(vorschau0!.stempel.every((s) => s.stempel === 'frisch')).toBe(true);
    expect(vorschau0!.multiplikator).toBe(1);

    expect(e.executeAction('3.3').success).toBe(true);
    expect(e.executeAction('3.12').success).toBe(true);

    // Vorschau VOR dem dritten Einsatz warnt: das RESONANTE Milieu ist verbrannt (E7 —
    // die Abstumpfung warnt VOR dem Ausgeben); die nur beiläufig Erreichten bleiben
    // frisch („Milieu wechseln" ist ein echter Ausweg, Zielbild §7).
    const vorschau2 = e.getMaschenVorschau('3.9');
    expect(vorschau2!.stempel.some((s) => s.stempel === 'verbrannt')).toBe(true);
    expect(vorschau2!.multiplikator).toBeLessThan(1);

    // Dritter Einsatz: Quittung nennt Ursache + Tag — nie eine Matrix-Zahl (E6).
    const r3 = e.executeAction('3.9');
    expect(r3.success).toBe(true);
    expect(r3.maschenQuittung).toBeDefined();
    expect(r3.maschenQuittung!.multiplikator).toBeLessThan(1);
    expect(r3.maschenQuittung!.text_de).toMatch(/Wirkung: (gering|verpufft)\. Grund: Masche bekannt/);
    expect(r3.maschenQuittung!.text_de).toMatch(/Tag \d+/);
    expect(r3.effects.some((ef) => ef.type === 'verpuffung')).toBe(true);
  });

  it('die Wirkung sinkt messbar: dieselbe Aktion trifft abgestumpft schwächer als frisch', () => {
    const frisch = createStoryEngine('mg_fresh');
    pumpResources(frisch);
    const rFrisch = frisch.executeAction('3.9');

    const abgenutzt = createStoryEngine('mg_worn');
    pumpResources(abgenutzt);
    abgenutzt.executeAction('3.3');
    abgenutzt.executeAction('3.12');
    const rWorn = abgenutzt.executeAction('3.9');

    const pFrisch = rFrisch.effects.find((ef) => ef.type === 'polarization')?.value ?? 0;
    const pWorn = rWorn.effects.find((ef) => ef.type === 'polarization')?.value ?? 0;
    expect(pFrisch).toBeGreaterThan(0);
    expect(pWorn).toBeLessThan(pFrisch);
  });

  it('„Gepatcht" zieht aufs Gedächtnis um: Familie stempelt danach überall bekannt (Falle 6)', () => {
    const e = createStoryEngine('mg_patch');
    pumpResources(e);
    e.executeAction('3.3');
    e.executeAction('3.12');
    e.executeAction('3.9'); // 3. Einsatz → Patch (PATCH_EVERY_N_USES)

    expect(e.getNewsEvents().some((n) => n.id.startsWith('abwehr_patch_divisive_narratives'))).toBe(true);
    expect(e.getPatchedFamilies()).toContain('divisive_narratives');

    // Nach dem Patch stempelt die Familie in den Ziel-Milieus nicht mehr FRISCH.
    const vorschau = e.getMaschenVorschau('3.11');
    expect(vorschau!.stempel.every((s) => s.stempel !== 'frisch')).toBe(true);
  });

  it('Prebunking (cm24, Stufe 25) impft die meistgenutzte Familie — medienferne Milieus bleiben Lücke', () => {
    const e = createStoryEngine('mg_prebunk');
    pumpResources(e);
    e.executeAction('3.3');
    e.executeAction('3.12');

    const save = JSON.parse(e.saveState());
    save.storyResources.wehrhaftigkeit = 24.95;
    e.loadState(JSON.stringify(save));
    e.advancePhase();
    const res = e.resolveStageCountermeasure('aussitzen');
    expect(res).not.toBeNull();
    expect(res!.lines_de.join(' ')).toContain('Prebunking wirkt');
    expect(res!.lines_de.join(' ')).toContain('unerreicht');

    // Wohnzimmer-Alphabet: klassisch erreichte Milieus lesen jetzt Faktenchecks
    // („Zeitung auf dem Tisch"), das rein soziale Milieu bleibt ungeimpft (Doppelboden).
    const alphabet = e.getWohnzimmerAlphabet();
    expect(alphabet.find((a) => a.milieuId === 'wu_besorgte_mitte')!.bild).toBe('zeitung');
    expect(alphabet.find((a) => a.milieuId === 'wu_bohemien')!.bild).not.toBe('zeitung');
  });

  it('ohne gespielte Masche läuft Prebunking ins Leere (Fallback: kleiner Vertrauens-Rest)', () => {
    const e = createStoryEngine('mg_prebunk_leer');
    const save = JSON.parse(e.saveState());
    save.storyResources.wehrhaftigkeit = 24.95;
    const obj = save.objectives.find((o: { id: string }) => o.id === 'obj_destabilize');
    if (obj) obj.currentValue = 80;
    e.loadState(JSON.stringify(save));
    e.advancePhase();
    const res = e.resolveStageCountermeasure('aussitzen');
    expect(res!.lines_de.join(' ')).toContain('läuft ins Leere');
  });

  it('persistiert das Gedächtnis über save/load und migriert die alte globale Zählung (< 2.2.0)', () => {
    const e = createStoryEngine('mg_save');
    pumpResources(e);
    e.executeAction('3.3');
    e.executeAction('3.12');
    const vorschau = e.getMaschenVorschau('3.9');

    const loaded = createStoryEngine('mg_load');
    loaded.loadState(e.saveState());
    expect(loaded.getMaschenVorschau('3.9')).toEqual(vorschau);

    // Alt-Save (2.1.0): keine Matrix, nur globale Zählung + gepatchte Familie →
    // Einsatz-Historie übernommen, gepatchte Familie überall mindestens BEKANNT.
    const alt = JSON.parse(e.saveState());
    delete alt.maschenGedaechtnis;
    alt.version = '2.1.0';
    alt.methodFamilyUseCounts = [['divisive_narratives', 5]];
    alt.patchedFamilies = ['divisive_narratives'];
    const migriert = createStoryEngine('mg_migrate');
    migriert.loadState(JSON.stringify(alt));
    const mv = migriert.getMaschenVorschau('3.9');
    expect(mv!.stempel.every((s) => s.stempel !== 'frisch')).toBe(true);
  });

  it('Wohnzimmer-Alphabet liefert je Milieu höchstens EIN Gedächtnis-Bild (E6: nie Zahlen)', () => {
    const e = createStoryEngine('mg_alpha');
    const alphabet = e.getWohnzimmerAlphabet();
    expect(alphabet.length).toBe(loadAudience()[0].segments.length);
    for (const eintrag of alphabet) {
      expect([null, 'zeitung', 'abwinken']).toContain(eintrag.bild);
    }
  });
});
