/**
 * Tests für die NPC-Berater-Regie (Auftrag 2026-07-06).
 * Belegt R0/R1/R5: substanzielle Bestätigung statt betoniertem Einheitssatz,
 * Freischaltung/Wirkung aus echten Daten, kein Tempus-Widerspruch, kein
 * Möbel-/Dev-Vokabular, und die didaktische Trennung Rhetorik ≠ Korrektheit.
 */
import { describe, it, expect } from 'vitest';
import {
  buildAngebot,
  renderBestaetigung,
  renderVariante,
  wirkungNomenAusEffekten,
  freischaltungAusUnlocks,
  appealAusTags,
  audienceFitForAction,
  renderWettstreit,
  renderUebergangen,
} from '../engine/BeraterRegie';
import type { RawAction } from '../engine/ActionLoader';
import { getActionLoader } from '../engine/ActionLoader';
import bank from '../data/formulierungsbank.json';

/** Minimale Roh-Aktion für die Appell-/Fit-Tests. */
const mkAction = (tags: string[]): RawAction => ({
  id: 't', phase: 'ta01', label_de: 'Test', costs: {}, npc_affinity: ['marina'], legality: 'legal', tags,
});

const loader = getActionLoader();
const resolveLabel = (id: string) => loader.getAction(id)?.label_de;

// Wörter, die im Bestätigungstext NIE auftauchen dürfen (Verbotsliste + Möbel).
const VERBOTEN = ['Sendeplan', 'Narrativ-Tafel', 'Maßnahme ausspielen', 'ordnen Sie'];

describe('BeraterRegie — Ableitungen', () => {
  it('leitet die Wirkung als Akkusativ-Nominalphrase aus effects ab', () => {
    expect(wirkungNomenAusEffekten({ reveals_weaknesses: true })).toBe('ihre wunden Punkte');
    expect(wirkungNomenAusEffekten({ reach_multiplier: 2 })).toBe('mehr Reichweite');
    // markanteste Wirkung gewinnt vor generischen Kostenschlüsseln
    expect(wirkungNomenAusEffekten({ risk: 3, target_damage: 1 })).toBe('einen Treffer, der sitzt');
    expect(wirkungNomenAusEffekten({ risk: 3, budget: 4 })).toBeNull();
    expect(wirkungNomenAusEffekten(undefined)).toBeNull();
  });

  it('löst Freischaltung aus unlocks zum Label auf, in Anführungszeichen', () => {
    expect(freischaltungAusUnlocks(['8.7'], resolveLabel)).toBe('„Person erpressen"');
    expect(freischaltungAusUnlocks([], resolveLabel)).toBeNull();
    expect(freischaltungAusUnlocks(undefined, resolveLabel)).toBeNull();
  });
});

describe('BeraterRegie — Angebot aus echter Aktion 1.4 (Dossier)', () => {
  const raw = loader.getAction('1.4');

  it('Aktion 1.4 existiert und ist Katjas Dossier', () => {
    expect(raw).toBeTruthy();
    expect(raw?.label_de).toBe('Akteur-Dossier erstellen');
    expect(raw?.npc_affinity).toContain('katja');
    expect(raw?.unlocks).toContain('8.7');
  });

  it('baut ein Angebot mit Wirkung + Freischaltung', () => {
    const a = buildAngebot(raw!, 'katja', resolveLabel, 'Dr. Ferro');
    expect(a.label_de).toBe('Akteur-Dossier erstellen'); // Infinitiv, nicht Perfekt-Schlagzeile
    expect(a.wirkungNomen).toBe('ihre wunden Punkte');
    expect(a.freischaltung).toBe('„Person erpressen"');
    expect(a.ziel).toBe('Dr. Ferro');
  });

  it('rendert die Bestätigung in Katjas Stimme, mit Ziel + Freischaltung, ohne Möbel-Vokabular', () => {
    const a = buildAngebot(raw!, 'katja', resolveLabel, 'Dr. Ferro');
    // rng=0 → reichste Variante (needs ziel+freischaltung)
    const text = renderBestaetigung(a, 0);
    expect(text).toContain('Dr. Ferro');
    expect(text).toContain('„Person erpressen"');
    for (const w of VERBOTEN) expect(text).not.toContain(w);
    // kein Tempus-Widerspruch: die Perfekt-Schlagzeile taucht nicht auf
    expect(text).not.toContain('angelegt');
  });
});

describe('BeraterRegie — renderVariante wählt die reichste erfüllbare Variante', () => {
  const varianten = [
    { needs: [], text_de: 'schlicht' },
    { needs: ['a'], text_de: 'mit {a}' },
    { needs: ['a', 'b'], text_de: '{a} und {b}' },
  ];

  it('nimmt needs:[] wenn nichts vorhanden', () => {
    expect(renderVariante(varianten, {}, 0)).toBe('schlicht');
  });
  it('nimmt die zweit-reichste, wenn nur a vorhanden', () => {
    expect(renderVariante(varianten, { a: 'X' }, 0)).toBe('mit X');
  });
  it('nimmt die reichste, wenn a und b vorhanden', () => {
    expect(renderVariante(varianten, { a: 'X', b: 'Y' }, 0)).toBe('X und Y');
  });

  it('ist gegen NaN/negatives rng abgesichert (kein Absturz)', () => {
    expect(renderVariante(varianten, { a: 'X' }, NaN)).toBe('mit X');
    expect(renderVariante(varianten, { a: 'X' }, -1)).toBe('mit X');
    expect(renderVariante(varianten, {}, 0.999)).toBe('schlicht');
  });

  it('Kosten von 0 füllen keinen budget/kapazitaet-Slot (kein „0 Taler")', () => {
    // Igor-Variante braucht {budget}; bei budget=0 fällt sie auf eine kostenlose zurück.
    const gratis = buildAngebot(mkAction([]), 'igor', resolveLabel);
    gratis.kosten = { budget: 0, kapazitaet: 0 };
    const text = renderBestaetigung(gratis, 0);
    expect(text).not.toMatch(/\b0 Taler\b/);
  });
});

describe('BeraterRegie — jeder NPC hat eine eigene Stimme (Rückfall nie generisch gleich)', () => {
  it('rendert für alle 5 NPCs eine nicht-leere Bestätigung ohne Verbots-Vokabular', () => {
    const raw = loader.getAction('1.4')!;
    const texte = ['direktor', 'marina', 'alexei', 'katja', 'igor'].map((npc) =>
      renderBestaetigung(buildAngebot(raw, npc, resolveLabel), 0),
    );
    for (const t of texte) {
      expect(t.length).toBeGreaterThan(10);
      for (const w of VERBOTEN) expect(t).not.toContain(w);
    }
    // mindestens 4 verschiedene Formulierungen (Stimmen unterscheiden sich)
    expect(new Set(texte).size).toBeGreaterThanOrEqual(4);
  });
});

describe('BeraterRegie — didaktischer Kern: Rhetorik ≠ Korrektheit (R3)', () => {
  it('Marina ist überzeugender als Alexei — persona-fix, unabhängig von der Aktion', () => {
    const raw = loader.getAction('1.4')!;
    const marina = buildAngebot(raw, 'marina', resolveLabel);
    const alexei = buildAngebot(raw, 'alexei', resolveLabel);
    expect(marina.rhetorik).toBeGreaterThan(alexei.rhetorik);
  });

  it('leitet den Publikums-Appell aus tags ab (direkt und thematisch)', () => {
    expect(appealAusTags(['anger'])).toBe('anger');
    expect(appealAusTags(['polarization'])).toBe('anger');
    expect(appealAusTags(['authority'])).toBe('trust');
    expect(appealAusTags(['analysis', 'targeting'])).toBeNull(); // Aufbau-Aktion, kein Appell
  });

  it('audienceFit ist datengetrieben und liegt in [-1,1]', () => {
    const anger = audienceFitForAction(['anger']);
    const hope = audienceFitForAction(['hope']);
    expect(anger.appeal).toBe('anger');
    expect(anger.fit).toBeGreaterThanOrEqual(-1);
    expect(anger.fit).toBeLessThanOrEqual(1);
    // hope sitzt beim Publikum besser als anger (Mittel über personas.json)
    expect(hope.fit!).toBeGreaterThan(anger.fit!);
    expect(audienceFitForAction(['analysis']).fit).toBeNull();
  });

  it('DER didaktische Beleg: Marinas glatter Pitch (hohe Rhetorik) kann schlecht sitzen', () => {
    // anger-Aktion, angeboten von Marina: hohe Überzeugungskraft, aber
    // schwache Publikums-Passung — „überzeugend ≠ richtig", mechanisch getrennt.
    const a = buildAngebot(mkAction(['anger']), 'marina', resolveLabel);
    expect(a.rhetorik).toBeGreaterThan(0.8);       // klingt überzeugend
    expect(a.appeal).toBe('anger');
    expect(a.audienceFit!).toBeLessThan(a.rhetorik); // sitzt aber schlecht
    // dieselbe Aktion, hope statt anger: gleiche Rhetorik, bessere Passung →
    // Korrektheit hängt an der Aktion/dem Publikum, nicht an der Stimme.
    const b = buildAngebot(mkAction(['hope']), 'marina', resolveLabel);
    expect(b.rhetorik).toBe(a.rhetorik);
    expect(b.audienceFit!).toBeGreaterThan(a.audienceFit!);
  });
});

describe('BeraterRegie — R2 Wettstreit & R4 Übergangen (jede Stimme vorhanden)', () => {
  const NPCS = ['direktor', 'marina', 'alexei', 'katja', 'igor'];
  const VERBOTEN = ['Sendeplan', 'Narrativ-Tafel', 'Maßnahme ausspielen'];

  it('jeder NPC hat eine Wettstreit-Spitze und eine Übergangen-Reaktion', () => {
    for (const npc of NPCS) {
      const w = renderWettstreit(npc, 0);
      const u = renderUebergangen(npc, 0);
      expect(w, `wettstreit ${npc}`).toBeTruthy();
      expect(u, `uebergangen ${npc}`).toBeTruthy();
      for (const v of VERBOTEN) {
        expect(w!).not.toContain(v);
        expect(u!).not.toContain(v);
      }
    }
  });

  it('unbekannter NPC → null (kein Absturz)', () => {
    expect(renderWettstreit('niemand', 0)).toBeNull();
    expect(renderUebergangen('niemand', 0)).toBeNull();
  });
});

describe('BeraterRegie — Bank-Integrität (keine unbekannten Slots)', () => {
  const KNOWN = new Set(['ziel', 'wirkungNomen', 'freischaltung', 'budget', 'kapazitaet']);

  it('jeder {slot} in der Formulierungsbank ist ein bekannter Slot', () => {
    const offenders: string[] = [];
    for (const [npc, groups] of Object.entries((bank as { npcs: Record<string, Record<string, Array<{ text_de: string; needs?: string[] }>>> }).npcs)) {
      for (const [group, varianten] of Object.entries(groups)) {
        for (const v of varianten) {
          for (const m of v.text_de.matchAll(/\{(\w+)\}/g)) {
            if (!KNOWN.has(m[1])) offenders.push(`${npc}.${group}: {${m[1]}}`);
          }
          // needs müssen ebenfalls bekannte Slots sein
          for (const n of v.needs ?? []) {
            if (!KNOWN.has(n)) offenders.push(`${npc}.${group}.needs: ${n}`);
          }
        }
      }
    }
    expect(offenders, offenders.join(' · ')).toEqual([]);
  });
});
