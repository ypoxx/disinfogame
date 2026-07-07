/**
 * maschenVortest (Phase 1): Vortest EINER Masche gegen die 8 Resonanzgruppen über die
 * ECHTE Live-Kette (tags → Familie → Ziel-Gruppen → Stempel/Wirkung). Deterministisch.
 */
import { describe, it, expect } from 'vitest';
import { vortestMasche, cardRegister } from '../audience/maschenVortest';
import { loadAudience } from '../audience/audienceModel';
import { leeresMaschenGedaechtnis, registriereEinsatz } from '../engine/MaschenGedaechtnis';
import type { MethodFamilyRef } from '../engine/ImmuneSystem';

const segmente = loadAudience()[0].segments;
const FAMILIES = [
  { id: 'rumor_ecology', label_de: 'Gerüchte-Ökologie', matchTags: ['rumor', 'confusion'], counter_de: 'Wer ist die Quelle? Ein „man hört" ist kein Beleg.' },
] satisfies (MethodFamilyRef & { counter_de: string })[];
const RUMOR = ['rumor', 'confusion', 'conspiracy'];
const alleIds = segmente.map((s) => s.id);
const seg = (r: ReturnType<typeof vortestMasche>, id: string) => r.segmente.find((s) => s.segmentId === id)!;

describe('vortestMasche', () => {
  it('liest die echte Kette: Familie + Ziel-Gruppen + frische Stempel', () => {
    const r = vortestMasche(RUMOR, alleIds, { segmente, gedaechtnis: leeresMaschenGedaechtnis(), phase: 1, families: FAMILIES });
    expect(r.familieId).toBe('rumor_ecology');
    // Die Abgehängten (anti_establishment + misstrauen_medien, tv) resonieren voll.
    const zorn = seg(r, 'wu_zorniger');
    expect(zorn.reached).toBe(true);
    expect(zorn.resonanz).toBeCloseTo(1);
    expect(zorn.stempel).toBe('frisch');
    expect(zorn.geimpft).toBe(false);
    expect(zorn.wirkung).toBeCloseTo(1);
  });

  it('geführter Querschnitt (alle) → Bias 0; Wunsch-Stichprobe → Bias > 0', () => {
    const ctx = { segmente, gedaechtnis: leeresMaschenGedaechtnis(), phase: 1, families: FAMILIES };
    const voll = vortestMasche(RUMOR, alleIds, ctx);
    expect(voll.sampleBias).toBeCloseTo(0);
    expect(voll.representativeness).toBeCloseTo(1);
    const wunsch = vortestMasche(RUMOR, ['wu_zorniger'], ctx);
    expect(wunsch.predictedReception).toBeGreaterThan(wunsch.trueReception);
    expect(wunsch.sampleBias).toBeGreaterThan(0);
    expect(wunsch.warning).toBeTruthy();
  });

  it('Wiederholung stumpft ab: Stempel kippt, Wirkung sinkt (E1-Vorschau)', () => {
    let g = leeresMaschenGedaechtnis();
    const frisch = seg(vortestMasche(RUMOR, alleIds, { segmente, gedaechtnis: g, phase: 1, families: FAMILIES }), 'wu_zorniger');
    for (let i = 0; i < 4; i++) g = registriereEinsatz(g, 'rumor_ecology', ['wu_zorniger'], 1).state;
    const abgenutzt = seg(vortestMasche(RUMOR, alleIds, { segmente, gedaechtnis: g, phase: 1, families: FAMILIES }), 'wu_zorniger');
    expect(abgenutzt.stempel).not.toBe('frisch');
    expect(abgenutzt.wirkung).toBeLessThan(frisch.wirkung);
  });

  it('deterministisch: gleiche Eingabe → gleiche Ausgabe', () => {
    const ctx = { segmente, gedaechtnis: leeresMaschenGedaechtnis(), phase: 3, families: FAMILIES };
    expect(vortestMasche(RUMOR, alleIds, ctx)).toEqual(vortestMasche(RUMOR, alleIds, ctx));
  });

  it('E2/E3: Einwand-Keim der Familie + Kipp-Nähe qualitativ (Stöße, keine Zahl)', () => {
    const r = vortestMasche(RUMOR, alleIds, { segmente, gedaechtnis: leeresMaschenGedaechtnis(), phase: 1, families: FAMILIES });
    // E2: der counter_de der getroffenen Familie ist der versteckte Einwand.
    expect(r.einwand_de).toMatch(/Quelle/);
    expect(r.einwandReife).toEqual({ einsaetze: 0, patchBei: 3 });
    // E3: die Abgehängten (belief 0.50, volle Wirkung) stehen kurz vorm Umschlagen.
    const zorn = seg(r, 'wu_zorniger');
    expect(zorn.kippNah).toBe(true);
    expect(zorn.stoesseBisFahne).toBe(2); // (0.75−0.50)/(1.0×0.2) = 2 Stöße
    // Eine nicht resonante, erreichte Gruppe kippt nicht.
    const mitte = seg(r, 'wu_besorgte_mitte');
    expect(mitte.wirkung).toBe(0);
    expect(mitte.kippNah).toBe(false);
  });

  it('cardRegister etikettiert Familie · Themen · Kanal', () => {
    const c = cardRegister(RUMOR, FAMILIES);
    expect(c.familieId).toBe('rumor_ecology');
    expect(c.themen).toContain('anti_establishment');
    expect(c.kanal).toBe('tv');
  });
});
