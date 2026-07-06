/**
 * kampagnenSchmiede: Wirkungs-Matrix + Kampagnen-Empfehlungen (Brücke Analyse → Tat)
 * inkl. Sample-Bias-Erkennung. Kontrollierte Fixtures (3 Milieus), damit die
 * Priorisierung und die Bias-Logik deterministisch prüfbar sind.
 */
import { describe, it, expect } from 'vitest';
import type { Persona } from '../audience/fokusgruppeModel';
import type { Target, Carrier, Platform } from '../battlefield/BattlefieldChain';
import {
  buildWirkungsMatrix,
  classifyCell,
  recommendCampaigns,
  toSegmentKey,
  type SegmentInfo,
} from '../audience/kampagnenSchmiede';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const angry1: Persona = { id: 'angry1', name: 'Wütend A', milieu: 'Abgehängte', segmentId: 'zorniger', bio: '', vulnerabilities: ['Empörung'], receptivity: { hope: -0.7, fear: 0.2, anger: 0.9, trust: -0.8 } };
const angry2: Persona = { id: 'angry2', name: 'Wütend B', milieu: 'Abgehängte', segmentId: 'zorniger', bio: '', vulnerabilities: ['Ohnmacht'], receptivity: { hope: -0.1, fear: 0.3, anger: 0.3, trust: -0.4 } };
const worried: Persona = { id: 'worried', name: 'Besorgt', milieu: 'Mitte', segmentId: 'besorgte_mitte', bio: '', vulnerabilities: ['Abstiegsangst'], receptivity: { hope: -0.2, fear: 0.8, anger: 0.1, trust: -0.3 } };
const lib: Persona = { id: 'lib', name: 'Liberal', milieu: 'Liberale', segmentId: 'liberale', bio: '', vulnerabilities: ['Seriosität'], receptivity: { hope: 0.35, fear: -0.3, anger: -0.4, trust: 0.6 } };

const POP: Persona[] = [angry1, angry2, worried, lib];

const SEGMENTS: SegmentInfo[] = [
  { id: 'wu_zorniger', label_de: 'Die Abgehängten', milieu: 'prekaer', size: 0.12, belief: 0.3 },
  { id: 'wu_besorgte_mitte', label_de: 'Die besorgte Mitte', milieu: 'buergerlich', size: 0.2, belief: 0.3 },
  { id: 'wu_liberale', label_de: 'Die Liberalen', milieu: 'liberal', size: 0.1, belief: 0.3 },
];

// Ziele nur für Mitte + Liberale (Abgehängte bleiben ziel-los → Teil-Empfehlung).
const TARGETS: Target[] = [
  { id: 't_mitte', name: 'Rolf Veen', role_de: 'Hinterbänkler', milieu: 'wu_besorgte_mitte', fiktiv: true, standing: 0.5, vulnerabilities: [{ id: 'schulden', label_de: 'Spielschulden', heikelheit: 0.7, glaubwuerdigkeit: 0.7 }] },
  { id: 't_lib', name: 'Dr. Ferro', role_de: 'Ökonom', milieu: 'wu_liberale', fiktiv: true, standing: 0.9, vulnerabilities: [{ id: 'fehler', label_de: 'Fehleinschätzung', heikelheit: 0.4, glaubwuerdigkeit: 0.5 }] },
];

const CARRIERS: Carrier[] = [
  { id: 'c_mitte', label_de: 'Frontmedium', reach: 0.8, credibility: 0.55, exposure: 0.7, milieus: ['wu_besorgte_mitte'], buildCost: { budget: 22, capacity: 3, phases: 2 } },
  { id: 'c_none', label_de: 'Bot-Netz', reach: 0.9, credibility: 0.15, exposure: 0.85, milieus: [], buildCost: { budget: 12, capacity: 2, phases: 1 } },
];

const PLATFORMS: Platform[] = [
  { id: 'p_mitte', label_de: 'Video', reach: 0.75, decay: 0.4, moderation: 0.5, milieus: ['wu_besorgte_mitte'] },
  { id: 'p_lib', label_de: 'Feed', reach: 0.7, decay: 0.6, moderation: 0.55, milieus: ['wu_liberale'] },
];

// ─── Wirkungs-Matrix ──────────────────────────────────────────────────────────

describe('buildWirkungsMatrix', () => {
  it('4 Appelle × alle Milieus; befragte Zellen tragen den Stichproben-Mittelwert', () => {
    const m = buildWirkungsMatrix(POP, POP.map((p) => p.id));
    expect(m.segmentIds).toEqual(['wu_zorniger', 'wu_besorgte_mitte', 'wu_liberale']);
    expect(m.cells).toHaveLength(4 * 3);

    const angerZorn = m.cells.find((c) => c.appeal === 'anger' && c.segmentId === 'wu_zorniger')!;
    expect(angerZorn.value).toBeCloseTo(0.6); // (0.9 + 0.3) / 2
    expect(angerZorn.klass).toBe('sweet');
  });

  it('unbefragte Milieus bleiben null / „unbekannt"', () => {
    const m = buildWirkungsMatrix(POP, ['angry1']); // nur ein Abgehängter befragt
    const mitte = m.cells.find((c) => c.appeal === 'fear' && c.segmentId === 'wu_besorgte_mitte')!;
    expect(mitte.value).toBeNull();
    expect(mitte.klass).toBe('unbekannt');
    expect(mitte.sampled).toBe(0);
  });
});

describe('classifyCell', () => {
  it('Schwellen: sweet / gut / neutral / falle / unbekannt', () => {
    expect(classifyCell(0.8)).toBe('sweet');
    expect(classifyCell(0.2)).toBe('gut');
    expect(classifyCell(0.0)).toBe('neutral');
    expect(classifyCell(-0.5)).toBe('falle');
    expect(classifyCell(null)).toBe('unbekannt');
  });
});

describe('toSegmentKey', () => {
  it('normalisiert Personas-Milieu (kurz) auf die wu_-Form', () => {
    expect(toSegmentKey('zorniger')).toBe('wu_zorniger');
    expect(toSegmentKey('wu_zorniger')).toBe('wu_zorniger');
  });
});

// ─── Empfehlungen ─────────────────────────────────────────────────────────────

const baseCtx = { personas: POP, segments: SEGMENTS, targets: TARGETS, carriers: CARRIERS, platforms: PLATFORMS };

describe('recommendCampaigns', () => {
  it('vollständige Stichprobe: größtes Milieu zuerst, Seed vorbefüllt, kein Bias', () => {
    const recs = recommendCampaigns({ ...baseCtx, sampleIds: POP.map((p) => p.id) });
    expect(recs.length).toBeGreaterThanOrEqual(1);

    const top = recs[0];
    expect(top.segmentId).toBe('wu_besorgte_mitte'); // größtes Milieu (size 0.2)
    expect(top.appeal).toBe('fear');
    expect(top.seed.targetId).toBe('t_mitte');
    expect(top.seed.vulnId).toBe('schulden');
    expect(top.seed.carrierId).toBe('c_mitte');
    expect(top.seed.platformIds).toContain('p_mitte');
    expect(top.partial).toBe(false);
    expect(top.biasWarned).toBe(false);
    expect(top.expected).not.toBeNull();
    expect(top.seed.analysis.appeal).toBe('fear');
    expect(top.seed.analysis.segmentId).toBe('wu_besorgte_mitte');
  });

  it('milieu-los: ziel-loses Milieu ergibt eine Teil-Empfehlung (Ziel offen)', () => {
    const recs = recommendCampaigns({ ...baseCtx, sampleIds: POP.map((p) => p.id) });
    const zorn = recs.find((r) => r.segmentId === 'wu_zorniger');
    expect(zorn).toBeTruthy();
    expect(zorn!.partial).toBe(true);
    expect(zorn!.seed.targetId).toBeNull();
    expect(zorn!.expected).toBeNull();
    // Verbreiter fällt auf milieu-loses Rauschen zurück.
    expect(zorn!.seed.carrierId).toBe('c_none');
  });

  it('Wunsch-Stichprobe: nur der wütendste Abgehängte → biasWarned', () => {
    const recs = recommendCampaigns({ ...baseCtx, sampleIds: ['angry1'] });
    const zorn = recs.find((r) => r.segmentId === 'wu_zorniger')!;
    expect(zorn.biasWarned).toBe(true);
    expect(zorn.predictedReception).toBeCloseTo(0.9); // nur angry1
    expect(zorn.trueReception).toBeCloseTo(0.6);       // beide Abgehängten
    expect(zorn.seed.analysis.biasWarned).toBe(true);
    expect(zorn.rationale_de).toMatch(/einseitig/);
  });

  it('limit begrenzt die Anzahl der Empfehlungen', () => {
    const recs = recommendCampaigns({ ...baseCtx, sampleIds: POP.map((p) => p.id), limit: 1 });
    expect(recs).toHaveLength(1);
  });
});
