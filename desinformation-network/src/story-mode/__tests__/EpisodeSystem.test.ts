/**
 * P4/B1 — Episoden (die Wirbelsäule). Belegt Loader, Auslöser-Logik, Lebenszyklus
 * (angeboten → aktiv → abgeschlossen), balance-neutrale Wirkung, Lernmoment-Debrief
 * und save/load-Festigkeit.
 */
import { describe, it, expect } from 'vitest';
import { createStoryEngine } from '../../game-logic/StoryEngineAdapter';
import {
  loadEpisodes,
  getEpisode,
  isEpisodeTriggered,
  type EpisodeTriggerContext,
} from '../engine/EpisodeLoader';

const emptyCtx: EpisodeTriggerContext = { values: {}, recentWorldEventIds: [] };

describe('EpisodeLoader', () => {
  it('lädt die Episoden-Batch (≥10) mit Pflichtfeldern', () => {
    const eps = loadEpisodes();
    expect(eps.length).toBeGreaterThanOrEqual(10);
    for (const e of eps) {
      expect(e.titel_de.length).toBeGreaterThan(3);
      expect(e.lage_de.length).toBeGreaterThan(10);
      expect(e.einklink_aktionen.length).toBeGreaterThan(0);
      expect(e.lernmoment_id.length).toBeGreaterThan(0);
    }
  });

  it('Auslöser: „always" immer, Wert-Schwelle und worldEvent korrekt', () => {
    const bruecke = getEpisode('ep_bruecke')!;       // always
    expect(isEpisodeTriggered(bruecke, emptyCtx)).toBe(true);

    const denkmal = getEpisode('ep_denkmalstreit')!; // polarisierung >= 50
    expect(isEpisodeTriggered(denkmal, emptyCtx)).toBe(false);
    expect(isEpisodeTriggered(denkmal, { values: { polarisierung: 55 }, recentWorldEventIds: [] })).toBe(true);

    const veen = getEpisode('ep_veen')!;             // worldEvent election_announced ODER polarisierung>=40
    expect(isEpisodeTriggered(veen, { values: {}, recentWorldEventIds: ['election_announced'] })).toBe(true);
  });
});

describe('Episoden-Lebenszyklus (Engine)', () => {
  it('emergent-kuratiert: nur ausgelöste, noch nicht laufende Episoden; nach NPC filterbar', () => {
    const e = createStoryEngine('ep_life');
    const offer = e.getOfferableEpisodes();
    expect(offer.some(x => x.id === 'ep_bruecke')).toBe(true);   // always-on
    expect(offer.some(x => x.id === 'ep_denkmalstreit')).toBe(false); // Schwelle nicht erreicht

    const marina = e.getOfferableEpisodes('marina');
    expect(marina.every(x => x.beteiligte.anbieter_npc === 'marina')).toBe(true);
  });

  it('aktivieren → aktiv; abschließen → abgeschlossen + Lernmoment', () => {
    const e = createStoryEngine('ep_cycle');
    expect(e.activateEpisode('ep_bruecke')).toBe(true);
    expect(e.getActiveEpisodes().map(x => x.id)).toContain('ep_bruecke');
    // nicht mehr offerierbar, solange aktiv
    expect(e.getOfferableEpisodes().some(x => x.id === 'ep_bruecke')).toBe(false);

    expect(e.completeEpisode('ep_bruecke')).toBe(true);
    expect(e.getCompletedEpisodes().map(x => x.id)).toContain('ep_bruecke');
    expect(e.getEpisodeLernmomentIds()).toContain('divisive_narratives');
    // doppeltes Abschließen schlägt fehl
    expect(e.completeEpisode('ep_bruecke')).toBe(false);
  });

  it('Abschluss bewegt Gesellschaftswerte, aber NICHT das Vertrauen (P4 balance-neutral)', () => {
    const e = createStoryEngine('ep_balance');
    const trustBefore = e.getObjectives().find(o => o.id === 'obj_destabilize')!.currentValue;
    const polBefore = e.getResources().polarisierung;
    e.activateEpisode('ep_bruecke');
    e.completeEpisode('ep_bruecke');                // wirkt_auf: polarisierung +5, fragmentierung +3
    expect(e.getResources().polarisierung).toBe(polBefore + 5);
    expect(e.getObjectives().find(o => o.id === 'obj_destabilize')!.currentValue).toBe(trustBefore);
  });

  it('Episoden-Zustand übersteht save/load; alte Saves → leer', () => {
    const e = createStoryEngine('ep_save');
    e.activateEpisode('ep_bruecke');
    const saved = e.saveState();
    const loaded = createStoryEngine('fresh');
    loaded.loadState(saved);
    expect(loaded.getActiveEpisodes().map(x => x.id)).toContain('ep_bruecke');

    const old = JSON.parse(saved);
    old.version = '1.0.0';
    delete old.episodesActive; delete old.episodesOffered; delete old.episodesCompleted;
    const loaded2 = createStoryEngine('fresh2');
    loaded2.loadState(JSON.stringify(old));
    expect(loaded2.getActiveEpisodes()).toHaveLength(0);
  });
});
