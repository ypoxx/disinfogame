/**
 * terminalCuration (L2/M2): Die Tür-Auswahl ist anlassbezogen — Strang zuerst,
 * dann Empfehlung, dann frische leistbare Maßnahmen; nie gesperrte/verbrauchte;
 * Deckel 8. Der volle Katalog bleibt dem ARCHIV vorbehalten.
 */
import { describe, it, expect } from 'vitest';
import { kuratiereVorgaenge, istLeistbar, istVerbrannt } from '../components/terminalCuration';
import type { StoryAction, MaschenVorschau } from '../components/ActionCard';

const mkAction = (id: string, over: Partial<StoryAction> = {}): StoryAction => ({
  id,
  phase: 'ta01',
  label_de: `Aktion ${id}`,
  costs: { budget: 10, capacity: 1 },
  npc_affinity: [],
  legality: 'legal',
  tags: [],
  isUnlocked: true,
  isUsed: false,
  ...over,
});

const RES = { budget: 100, capacity: 10 };

const vorschau = (stempel: 'frisch' | 'bekannt' | 'verbrannt'): MaschenVorschau => ({
  familieId: 'f1',
  familieLabel: 'Testmasche',
  stempel: [
    { milieuId: 'm1', milieuLabel: 'Milieu 1', stempel },
    { milieuId: 'm2', milieuLabel: 'Milieu 2', stempel },
  ],
  multiplikator: 1,
});

describe('terminalCuration (M2)', () => {
  it('Strang vor Empfehlung vor Rest; stabil innerhalb der Stufe', () => {
    const actions = [mkAction('x1'), mkAction('emp'), mkAction('x2'), mkAction('strang'), mkAction('x3')];
    const tuer = kuratiereVorgaenge({
      actions,
      episodeActionIds: ['strang'],
      recommendedActionIds: ['emp'],
      resources: RES,
    });
    expect(tuer.map((a) => a.id)).toEqual(['strang', 'emp', 'x1', 'x2', 'x3']);
  });

  it('deckelt auf 8 Vorgänge (M2: 3–8 als Eingangstür)', () => {
    const actions = Array.from({ length: 20 }, (_, i) => mkAction(`a${i}`));
    const tuer = kuratiereVorgaenge({ actions, episodeActionIds: [], recommendedActionIds: [], resources: RES });
    expect(tuer).toHaveLength(8);
  });

  it('zeigt NIE gesperrte oder verbrauchte Aktionen in der Tür', () => {
    const actions = [
      mkAction('locked', { isUnlocked: false }),
      mkAction('used', { isUsed: true }),
      mkAction('ok'),
    ];
    const tuer = kuratiereVorgaenge({ actions, episodeActionIds: [], recommendedActionIds: [], resources: RES });
    expect(tuer.map((a) => a.id)).toEqual(['ok']);
  });

  it('nicht leistbare Maßnahmen rutschen ans Ende (aber Strang schlägt Kasse)', () => {
    const actions = [
      mkAction('teuer', { costs: { budget: 999, capacity: 1 } }),
      mkAction('billig'),
      mkAction('strang_teuer', { costs: { budget: 999, capacity: 1 } }),
    ];
    const tuer = kuratiereVorgaenge({
      actions,
      episodeActionIds: ['strang_teuer'],
      recommendedActionIds: [],
      resources: RES,
    });
    expect(tuer.map((a) => a.id)).toEqual(['strang_teuer', 'billig', 'teuer']);
  });

  it('E7: überall verbrannte Maschen werden hinter frische einsortiert', () => {
    const actions = [mkAction('verbrannt'), mkAction('frisch')];
    const tuer = kuratiereVorgaenge({
      actions,
      episodeActionIds: [],
      recommendedActionIds: [],
      resources: RES,
      getMaschenVorschau: (id) => (id === 'verbrannt' ? vorschau('verbrannt') : vorschau('frisch')),
    });
    expect(tuer.map((a) => a.id)).toEqual(['frisch', 'verbrannt']);
  });

  it('Rang: leistbar+verbrannt (3) steht VOR nicht leistbar (4)', () => {
    // Mutationsschutz: vertauscht man Rang 3↔4, kippt diese Reihenfolge.
    const actions = [
      mkAction('teuer', { costs: { budget: 999, capacity: 1 } }),
      mkAction('leistbar_verbrannt'),
    ];
    const tuer = kuratiereVorgaenge({
      actions,
      episodeActionIds: [],
      recommendedActionIds: [],
      resources: RES,
      getMaschenVorschau: (id) => (id === 'leistbar_verbrannt' ? vorschau('verbrannt') : null),
    });
    // leistbar (auch verbrannt) schlägt nicht-leistbar.
    expect(tuer.map((a) => a.id)).toEqual(['leistbar_verbrannt', 'teuer']);
  });

  it('max-Klammer: expliziter max wird auf 3..8 geklemmt', () => {
    const actions = Array.from({ length: 12 }, (_, i) => mkAction(`a${i}`));
    const base = { actions, episodeActionIds: [], recommendedActionIds: [], resources: RES };
    expect(kuratiereVorgaenge({ ...base, max: 1 })).toHaveLength(3); // Boden 3
    expect(kuratiereVorgaenge({ ...base, max: 5 })).toHaveLength(5); // dazwischen frei
    expect(kuratiereVorgaenge({ ...base, max: 99 })).toHaveLength(8); // Deckel 8
  });

  it('istVerbrannt: nur wenn ALLE Ziel-Milieus verbrannt sind (teilweise zählt nicht)', () => {
    expect(istVerbrannt(vorschau('verbrannt'))).toBe(true);
    expect(istVerbrannt(vorschau('bekannt'))).toBe(false);
    expect(istVerbrannt(null)).toBe(false);
    // Leere Stempel-Liste ist NICHT verbrannt (keine Masche zu prüfen — Guard Z. 34).
    expect(istVerbrannt({ familieId: 'f', familieLabel: 'F', stempel: [], multiplikator: 1 })).toBe(false);
    const teils: MaschenVorschau = {
      ...vorschau('verbrannt'),
      stempel: [
        { milieuId: 'm1', milieuLabel: 'M1', stempel: 'verbrannt' },
        { milieuId: 'm2', milieuLabel: 'M2', stempel: 'frisch' },
      ],
    };
    expect(istVerbrannt(teils)).toBe(false);
  });

  it('istLeistbar prüft Budget UND Kapazität', () => {
    expect(istLeistbar(mkAction('a', { costs: { budget: 100, capacity: 10 } }), RES)).toBe(true);
    expect(istLeistbar(mkAction('b', { costs: { budget: 101 } }), RES)).toBe(false);
    expect(istLeistbar(mkAction('c', { costs: { capacity: 11 } }), RES)).toBe(false);
    expect(istLeistbar(mkAction('d', { costs: {} }), RES)).toBe(true);
  });
});
