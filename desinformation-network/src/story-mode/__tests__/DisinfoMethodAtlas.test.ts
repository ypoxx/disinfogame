/**
 * DisinfoMethodAtlas (Bildungs-Kern): die reale Methode hinter jeder Mechanik.
 * Prüft Klassifikation, Gewichtung und die konzeptionelle Breite (Schlachtfeld =
 * nur EINE Familie) sowie die Daten-Integrität des Atlas.
 */
import { describe, it, expect } from 'vitest';
import {
  classifyMethods,
  loadDisinfoMethods,
  withEpisodeLearnings,
  type MethodActionEntry,
} from '../engine/DisinfoMethodAtlas';

const catalog: MethodActionEntry[] = [
  { id: 'a_bot', tags: ['bots', 'automation', 'amplification'] },
  { id: 'a_emo', tags: ['emotional', 'division', 'polarization'] },
  { id: 'a_expert', tags: ['academic', 'expert', 'legitimacy'] },
  { id: 'a_fin', tags: ['financial', 'funding'] },
  { id: 'a_plain', tags: [] },
];

describe('Atlas-Daten', () => {
  it('lädt eine breite Methoden-Liste (Schlachtfeld ist nur eine von vielen)', () => {
    const methods = loadDisinfoMethods();
    expect(methods.length).toBeGreaterThanOrEqual(12);
    // Jeder Eintrag ist vollständig befüllt (Bildungs-Inhalt).
    for (const m of methods) {
      expect(m.id).toBeTruthy();
      expect(m.label_de).toBeTruthy();
      expect(m.real_method_de).toBeTruthy();
      expect(m.what_de.length).toBeGreaterThan(20);
      expect(m.real_case_de.length).toBeGreaterThan(20);
      expect(['niedrig', 'mittel', 'hoch']).toContain(m.severity);
    }
  });

  it('hat eindeutige ids', () => {
    const ids = loadDisinfoMethods().map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('P7/B4: jede Methode trägt eine Gegenmaßnahme (Resilienz-Geländer)', () => {
    for (const m of loadDisinfoMethods()) {
      expect(m.counter_de, `counter_de fehlt bei ${m.id}`).toBeTruthy();
      expect((m.counter_de ?? '').length).toBeGreaterThan(20);
    }
  });

  it('enthält die Kompromat-/Schlachtfeld-Familie als EINE unter vielen', () => {
    const methods = loadDisinfoMethods();
    const kompromat = methods.find((m) => m.matchKinds.includes('kompromat'));
    expect(kompromat).toBeTruthy();
    // Aber es gibt klar mehr als nur diese eine Familie.
    expect(methods.length).toBeGreaterThan(8);
  });
});

describe('classifyMethods', () => {
  it('gibt leere Liste, wenn nichts getan wurde', () => {
    expect(classifyMethods({ completedActionIds: [], catalog })).toHaveLength(0);
  });

  it('erkennt die Methode hinter genutzten Aktions-Tags', () => {
    const result = classifyMethods({ completedActionIds: ['a_emo', 'a_emo'], catalog });
    const ids = result.map((r) => r.id);
    expect(ids).toContain('divisive_narratives');
    const emo = result.find((r) => r.id === 'divisive_narratives')!;
    expect(emo.count).toBeGreaterThan(0);
    expect(emo.evidence_de).toMatch(/Maßnahme/);
    expect(emo.real_method_de).toBeTruthy();
    // P7/B4: die Gegenmaßnahme wird in den End-Report durchgereicht.
    expect(emo.counter_de).toBeTruthy();
  });

  it('gewichtet häufiger genutzte Methoden nach oben', () => {
    const result = classifyMethods({
      completedActionIds: ['a_emo', 'a_emo', 'a_emo', 'a_fin'],
      catalog,
    });
    // divisive_narratives (3 Aktionen × 3 Tags) muss vor covert_financing stehen.
    expect(result[0].id).toBe('divisive_narratives');
  });

  it('erkennt P2-Verbreiter, -Plattformen, Operationen und Kompromat', () => {
    const result = classifyMethods({
      completedActionIds: [],
      catalog,
      carriersUsed: ['botnetz'],
      platformsUsed: ['kurzvideo'],
      operationsPlayed: 2,
      kompromatAcquired: 1,
    });
    const ids = result.map((r) => r.id);
    // Verbreiter Bot-Netz → Bot-Verstärkung
    expect(ids).toContain('bot_amplification');
    // Operation + Kompromat → Rufmord/Kompromat-Familie
    expect(ids).toContain('character_assassination');
    const ca = result.find((r) => r.id === 'character_assassination')!;
    expect(ca.evidence_de).toMatch(/Operation|Kompromat/);
  });

  it('ist deterministisch (gleiche Eingabe → gleiche Reihenfolge)', () => {
    const usage = { completedActionIds: ['a_bot', 'a_emo', 'a_expert'], catalog };
    expect(classifyMethods(usage)).toEqual(classifyMethods(usage));
  });
});

describe('withEpisodeLearnings (P4-Politur: Episoden-Lernmomente explizit)', () => {
  // 'a_emo' → divisive_narratives ist eine echte Atlas-Methode (auch ein Episoden-Lernmoment).
  const classified = () => classifyMethods({ completedActionIds: ['a_emo', 'a_emo'], catalog });

  it('markiert eine bereits klassifizierte Methode als Episoden-Lernmoment', () => {
    const out = withEpisodeLearnings(classified(), ['divisive_narratives']);
    const m = out.find((x) => x.id === 'divisive_narratives');
    expect(m?.fromEpisode).toBe(true);
    // andere Methoden bleiben unmarkiert
    expect(out.every((x) => x.id === 'divisive_narratives' || !x.fromEpisode)).toBe(true);
  });

  it('ergänzt einen Episoden-Lernmoment, den die Tag-Klassifikation gar nicht erfasst hat', () => {
    const before = classified();
    expect(before.some((x) => x.id === 'fake_experts')).toBe(false); // nicht gespielt
    const out = withEpisodeLearnings(before, ['fake_experts']);
    const added = out.find((x) => x.id === 'fake_experts');
    expect(added).toBeTruthy();
    expect(added?.fromEpisode).toBe(true);
    expect(added?.count).toBe(0); // kein Tag-Beleg
    expect(added?.evidence_de).toMatch(/Episode/);
    // voller Bildungs-Inhalt mitgeliefert (kein leerer Eintrag)
    expect((added?.what_de ?? '').length).toBeGreaterThan(20);
    expect(added?.counter_de).toBeTruthy();
  });

  it('zählt mehrfach vermittelte Lernmomente und stellt Episoden-Lernmomente nach vorn', () => {
    const out = withEpisodeLearnings([], ['fake_experts', 'fake_experts']);
    expect(out[0].fromEpisode).toBe(true);
    expect(out[0].evidence_de).toMatch(/2 abgeschlossene Episoden/);
  });

  it('ist rückwärtskompatibel: keine Episoden → keine Markierung, Reihenfolge stabil', () => {
    const base = classified();
    const out = withEpisodeLearnings(base, []);
    expect(out.some((x) => x.fromEpisode)).toBe(false);
    expect(out.map((x) => x.id)).toEqual(base.map((x) => x.id));
  });

  it('ignoriert unbekannte Lernmoment-Ids ohne zu werfen', () => {
    const out = withEpisodeLearnings([], ['kein_echter_eintrag_xyz']);
    expect(out).toHaveLength(0);
  });
});
