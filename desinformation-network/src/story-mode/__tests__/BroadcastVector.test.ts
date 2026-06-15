/**
 * P6 — Broadcast/Publikum-Vernetzung: Episoden-Schlagzeile + Werte-Vektor (Anzeige).
 */
import { describe, it, expect } from 'vitest';
import { mapActionToBroadcast } from '../broadcast/broadcastMapping';
import { reactToEffect, type AudienceCountry, type Effect } from '../audience/audienceModel';
import type { ActionResult } from '../../game-logic/StoryEngineAdapter';

function fakeResult(id: string, headline: string): ActionResult {
  return {
    success: true,
    action: {
      id, label_de: id, label_en: id, narrative_de: '', narrative_en: '',
      headline_de: headline, phase: 'ta05', tags: ['amplification'], legality: 'grey',
      costs: { attention: 4 }, available: true, prerequisites: [], prerequisitesMet: true, npcAffinity: [],
    },
    effects: [], resourceChanges: {},
    narrative: { headline_de: headline, headline_en: headline, description_de: '', description_en: '' },
    potentialConsequences: [],
  } as unknown as ActionResult;
}

const country: AudienceCountry = {
  id: 'test', label_de: 'Test',
  segments: [
    {
      id: 's1', label_de: 'Seg 1', milieu: 'm', demographics: { age: 'x', lean: 'y' },
      vulnerabilities: ['misstrauen_medien'], size: 0.5, mood: 'ruhig', belief: 0.3, reachedBy: ['tv'],
    },
  ],
};
const effect: Effect = { themes: ['misstrauen_medien'], channel: 'tv', intensity: 0.5 };

describe('mapActionToBroadcast — Episoden-Schlagzeile (P6)', () => {
  it('rahmt die Schlagzeile mit dem Episoden-Titel, wenn die Aktion dazugehört', () => {
    const withEp = mapActionToBroadcast(fakeResult('11.2', 'Bot-Netz gestartet'), 10, 'Frau Ferro hat Feierabend gemacht');
    expect(withEp.headline).toBe('Frau Ferro hat Feierabend gemacht: Bot-Netz gestartet');
    const without = mapActionToBroadcast(fakeResult('11.2', 'Bot-Netz gestartet'), 10);
    expect(without.headline).toBe('Bot-Netz gestartet');
  });
});

describe('reactToEffect — Werte-Vektor moduliert das Publikum (P6/F2, Anzeige)', () => {
  it('hohe Polarisierung facht die Wirkung an', () => {
    const calm = reactToEffect(country, effect, { polarisierung: 20, zynismus: 0 });
    const hot = reactToEffect(country, effect, { polarisierung: 90, zynismus: 0 });
    expect(hot.reactions[0].effectiveness).toBeGreaterThan(calm.reactions[0].effectiveness);
  });

  it('hoher Zynismus kippt „verunsichert" Richtung Misstrauen/Rückzug', () => {
    // intensity so wählen, dass effectiveness im „verunsichert"-Band (0.33–0.66) liegt.
    const mid: Effect = { themes: ['misstrauen_medien'], channel: 'tv', intensity: 0.5 };
    const cynical = reactToEffect(country, mid, { polarisierung: 20, zynismus: 70 });
    expect(cynical.reactions[0].newMood).toBe('misstrauisch');
  });

  it('ohne Werte-Vektor bleibt das Verhalten unverändert (rückwärtskompatibel)', () => {
    const plain = reactToEffect(country, effect);
    const neutral = reactToEffect(country, effect, { polarisierung: 30, zynismus: 0 });
    expect(plain.reactions[0].effectiveness).toBeCloseTo(neutral.reactions[0].effectiveness, 5);
  });
});
