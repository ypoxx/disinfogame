/**
 * T3 „Fokus-Mechanik" (KONZEPT 2026-07-07 §3.2, Owner F-B): Das Korkbrett hat
 * Kapazität — Start 2 Spuren, die dritte genehmigt die Zentrale mit Akt 3.
 * Prüft Engine-Cap, Abhängen (ohne Auszahlung, Rückkehr in den Pool),
 * Save-Guard für Altstände sowie die Akt-/Umfrage-Ableitungen (T4).
 */
import { describe, it, expect } from 'vitest';
import { createStoryEngine } from '../../game-logic/StoryEngineAdapter';
import { loadEpisodes } from '../engine/EpisodeLoader';

function dreiEpisodenIds(): [string, string, string] {
  const ids = loadEpisodes().map((e) => e.id);
  expect(ids.length).toBeGreaterThanOrEqual(3);
  return [ids[0], ids[1], ids[2]];
}

describe('Brett-Kapazität (T3)', () => {
  it('nimmt in Akt 1 höchstens 2 Stränge an — der dritte wird abgewiesen', () => {
    const engine = createStoryEngine('slots-test');
    const [a, b, c] = dreiEpisodenIds();
    expect(engine.getNarrativeSlots()).toBe(2);
    expect(engine.activateEpisode(a)).toBe(true);
    expect(engine.activateEpisode(b)).toBe(true);
    expect(engine.activateEpisode(c)).toBe(false);
    expect(engine.getActiveEpisodes()).toHaveLength(2);
  });

  it('abhängen macht Platz, zahlt nichts aus und lässt die Episode wiederkehren', () => {
    const engine = createStoryEngine('abandon-test');
    const [a, b, c] = dreiEpisodenIds();
    engine.activateEpisode(a);
    engine.activateEpisode(b);
    const werteVorher = JSON.stringify(engine.getResources());
    expect(engine.abandonEpisode(a)).toBe(true);
    // Keine wirkt_auf-Auszahlung beim Abhängen (nur completeEpisode zahlt aus).
    expect(JSON.stringify(engine.getResources())).toBe(werteVorher);
    // Platz frei → der dritte Strang passt jetzt.
    expect(engine.activateEpisode(c)).toBe(true);
    // Abgehängt ≠ abgeschlossen: die Episode darf erneut ans Brett.
    expect(engine.abandonEpisode(c)).toBe(true);
    expect(engine.activateEpisode(a)).toBe(true);
    expect(engine.abandonEpisode('gibt_es_nicht')).toBe(false);
  });

  it('Save-Guard: Altstände mit mehr Strängen als Spuren werden geklemmt', () => {
    const alt = createStoryEngine('save-alt');
    const [a, b, c] = dreiEpisodenIds();
    // Altstand simulieren: 3 aktive Stränge trotz 2 Spuren (vor dem Cap möglich).
    const state = JSON.parse(alt.saveState());
    state.episodesActive = [a, b, c];
    const neu = createStoryEngine('save-neu');
    neu.loadState(JSON.stringify(state));
    expect(neu.getActiveEpisodes().length).toBeLessThanOrEqual(neu.getNarrativeSlots());
    // Die ältesten (vordersten) bleiben.
    expect(neu.getActiveEpisodes().map((e) => e.id)).toEqual([a, b]);
  });
});

describe('Akt-Dramaturgie & Umfrage-Horizont (T4)', () => {
  it('teilt die Kampagne in drei Akte und schaltet Spur 3 mit Akt 3 frei', () => {
    const engine = createStoryEngine('akt-test');
    const { electionDay } = engine.getElectionInfo();
    expect(engine.getAkt().nummer).toBe(1);
    expect(engine.getNarrativeSlots()).toBe(2);
    // In den Endspurt springen (per Save-Stand statt Phase-Schleife — die könnte
    // vorher am Spielende hängen): Tag electionDay−1 → Akt 3, Spur 3 genehmigt.
    const state = JSON.parse(engine.saveState());
    state.storyPhase.number = electionDay - 1;
    const spaet = createStoryEngine('akt-spaet');
    spaet.loadState(JSON.stringify(state));
    expect(spaet.getAkt().nummer).toBe(3);
    expect(spaet.getNarrativeSlots()).toBe(3);
    // Mittelspiel-Gegenprobe: Tag in der Kampagnenmitte → Akt 2, weiterhin 2 Spuren.
    state.storyPhase.number = Math.round(electionDay / 2);
    const mitte = createStoryEngine('akt-mitte');
    mitte.loadState(JSON.stringify(state));
    expect(mitte.getAkt().nummer).toBe(2);
    expect(mitte.getNarrativeSlots()).toBe(2);
  });

  it('zählt die Tage bis zur nächsten Sonntagsfrage (alle 5 Tage)', () => {
    const engine = createStoryEngine('poll-test');
    // Tag 1 → nächste Umfrage an Tag 5.
    expect(engine.getNaechsteSonntagsfrageIn()).toBe(4);
    for (let i = 0; i < 4; i++) engine.advancePhase();
    // Tag 5 → sie erscheint heute Abend.
    expect(engine.getNaechsteSonntagsfrageIn()).toBe(0);
  });
});
