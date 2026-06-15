/**
 * DisinfoMethodAtlas (Bildungs-Kern): die reale Methode hinter jeder Mechanik.
 * Prüft Klassifikation, Gewichtung und die konzeptionelle Breite (Schlachtfeld =
 * nur EINE Familie) sowie die Daten-Integrität des Atlas.
 */
import { describe, it, expect } from 'vitest';
import {
  classifyMethods,
  loadDisinfoMethods,
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
