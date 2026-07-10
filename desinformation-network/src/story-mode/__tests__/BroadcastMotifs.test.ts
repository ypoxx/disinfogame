/**
 * Broadcast-Motive (Owner 2026-07-06, MINISTRY_BROADCAST_CONCEPT.md §7): jedes Ereignis
 * bekommt ein eigenes Motiv. Diese Tests sichern die Integrität der gepflegten Tabelle:
 * jede Masche/jeder Kanal/jedes Tier und jede Ereignis-Klasse löst auf ein KATALOGISIERTES
 * Motiv auf, und kein Katalog-Motiv ist verwaist (unerreichbar).
 */
import { describe, it, expect } from 'vitest';
import disinfoMethods from '../data/disinfo_methods.json';
import {
  MOTIF_CATALOG,
  FAMILY_ARCHETYPE,
  archetypeForTags,
  motifForMeasure,
  motifForCategory,
  motif,
  type BroadcastCategory,
  type BroadcastMotifId,
  type BroadcastTier,
  type MascheArchetype,
} from '../broadcast/broadcastMotifs';
import {
  broadcastForEvent,
  broadcastForWochenschau,
  mapActionToBroadcast,
} from '../broadcast/broadcastMapping';
import type { ActionResult } from '../../game-logic/StoryEngineAdapter';
import type { Channel } from '../audience/audienceModel';

const CHANNELS: Channel[] = ['tv', 'print', 'social'];
const TIERS: BroadcastTier[] = ['klein', 'mittel', 'gross'];
const CATEGORIES: BroadcastCategory[] = [
  'massnahme',
  'gegenreaktion',
  'faktencheck',
  'krise',
  'enttarnung',
  'wahltag',
  'wochenschau',
];
const ARCHETYPES: MascheArchetype[] = ['bots', 'fake', 'spaltung', 'kompromat', 'strasse', 'firehose'];

function fakeResult(tags: string[], success = true, headline = 'Testschlagzeile', attention = 2): ActionResult {
  return {
    success,
    action: {
      id: 'x.1', label_de: 'x', label_en: 'x', narrative_de: '', narrative_en: '',
      headline_de: headline, phase: 'ta05', tags, legality: 'grey',
      costs: { attention }, available: true, prerequisites: [], prerequisitesMet: true, npcAffinity: [],
    },
    effects: [], resourceChanges: {},
    narrative: { headline_de: headline, headline_en: headline, description_de: '', description_en: '' },
    potentialConsequences: [],
  } as unknown as ActionResult;
}

describe('MOTIF_CATALOG — Integrität', () => {
  it('jeder Eintrag ist selbstkonsistent (key === id, assetId gesetzt, Glyph vorhanden)', () => {
    for (const [key, m] of Object.entries(MOTIF_CATALOG)) {
      expect(m.id).toBe(key);
      expect(m.assetId).toBeTruthy();
      expect(m.glyph).toBeTruthy();
      expect(m.caption_de.length).toBeGreaterThan(0);
    }
  });

  it('kein Motiv ist verwaist — jedes Katalog-Motiv ist über eine Auflösung erreichbar', () => {
    const reachable = new Set<BroadcastMotifId>();
    for (const ch of CHANNELS) {
      for (const t of TIERS) {
        // repräsentative Tags je Archetyp abdecken
        for (const arch of ARCHETYPES) {
          const sampleTag = Object.entries(FAMILY_ARCHETYPE).find(([, a]) => a === arch)?.[0];
          reachable.add(motifForMeasure(ch, t, sampleTag ? [tagOf(sampleTag)] : []));
        }
      }
    }
    for (const c of CATEGORIES) reachable.add(motifForCategory(c));
    const catalog = new Set(Object.keys(MOTIF_CATALOG) as BroadcastMotifId[]);
    const orphans = [...catalog].filter((id) => !reachable.has(id));
    expect(orphans).toEqual([]);
  });
});

/** Ein realer matchTag der Familie (die erste), damit archetypeForTags sie trifft. */
function tagOf(familyId: string): string {
  const fam = (disinfoMethods.methods as Array<{ id: string; matchTags?: string[] }>).find((m) => m.id === familyId);
  return fam?.matchTags?.[0] ?? 'division';
}

describe('FAMILY_ARCHETYPE — deckt alle 18 Atlas-Familien ab', () => {
  it('jede disinfo_methods-Familie hat einen gültigen Archetyp', () => {
    for (const m of disinfoMethods.methods as Array<{ id: string }>) {
      expect(ARCHETYPES).toContain(FAMILY_ARCHETYPE[m.id]);
    }
  });

  it('jeder Archetyp verweist auf ein Katalog-Motiv', () => {
    for (const arch of ARCHETYPES) {
      const sampleTag = tagOf(Object.entries(FAMILY_ARCHETYPE).find(([, a]) => a === arch)![0]);
      const id = motifForMeasure('tv', 'mittel', [sampleTag]);
      expect(MOTIF_CATALOG[id]).toBeTruthy();
    }
  });
});

describe('archetypeForTags', () => {
  it('klassifiziert je nach Familie', () => {
    expect(archetypeForTags(['bots'])).toBe('bots');
    expect(archetypeForTags(['deepfake'])).toBe('fake');
    expect(archetypeForTags(['hacking', 'leak'])).toBe('kompromat');
    expect(archetypeForTags(['fact_checkers'])).toBe('firehose');
  });
  it('fällt bei unbekannten Tags auf „spaltung" zurück', () => {
    expect(archetypeForTags([])).toBe('spaltung');
    expect(archetypeForTags(['völlig_unbekannt'])).toBe('spaltung');
  });
});

describe('motifForMeasure — je Kanal/Masche/Tier', () => {
  it('Presse trägt das Zeitungs-Format je Tier', () => {
    expect(motifForMeasure('print', 'klein', [])).toBe('bc_print_notice');
    expect(motifForMeasure('print', 'mittel', [])).toBe('bc_print_headline');
    expect(motifForMeasure('print', 'gross', [])).toBe('bc_print_headline');
  });
  it('Netz trägt Feed bzw. Viral (groß)', () => {
    expect(motifForMeasure('social', 'klein', [])).toBe('bc_social_feed');
    expect(motifForMeasure('social', 'gross', [])).toBe('bc_social_viral');
  });
  it('TV trägt die Masche, bei GROSS die Sondersendung', () => {
    expect(motifForMeasure('tv', 'mittel', ['bots'])).toBe('bc_masche_bots');
    expect(motifForMeasure('tv', 'klein', ['deepfake'])).toBe('bc_masche_fake');
    expect(motifForMeasure('tv', 'gross', ['bots'])).toBe('bc_tv_sonder');
  });
  it('ist total (liefert für jede Kombination ein Katalog-Motiv)', () => {
    for (const ch of CHANNELS) {
      for (const t of TIERS) {
        expect(MOTIF_CATALOG[motifForMeasure(ch, t, ['division'])]).toBeTruthy();
      }
    }
  });
});

describe('motifForCategory + motif()', () => {
  it('deckt jede Ereignis-Klasse ab', () => {
    for (const c of CATEGORIES) expect(MOTIF_CATALOG[motifForCategory(c)]).toBeTruthy();
    expect(motifForCategory('faktencheck')).toBe('bc_faktencheck');
    expect(motifForCategory('krise')).toBe('bc_krise');
    expect(motifForCategory('enttarnung')).toBe('bc_enttarnung');
    expect(motifForCategory('wahltag')).toBe('bc_wahltag');
    expect(motifForCategory('wochenschau')).toBe('bc_wochenschau');
    expect(motifForCategory('gegenreaktion')).toBe('bc_gegenwind');
  });
  it('motif() liefert nie undefined', () => {
    expect(motif('bc_krise').id).toBe('bc_krise');
  });
});

describe('mapActionToBroadcast — trägt Motiv + Kategorie', () => {
  it('Erfolg über den Netz-Kanal (bots-Tags sind social) → Feed-Motiv', () => {
    // Engine-Klassifikation (KANAL_JE_TAG): bots/coordinated/flooding laufen über „Netz".
    const item = mapActionToBroadcast(fakeResult(['bots']), 10);
    expect(item.category).toBe('massnahme');
    expect(item.kind).toBe('eigen');
    expect(item.tier).toBe('mittel');
    expect(item.motifId).toBe('bc_social_feed');
  });
  it('GROSS über den Netz-Kanal → Viral-Motiv', () => {
    const big = mapActionToBroadcast(fakeResult(['bots'], true, 'Grosswirkung', 20), 90);
    expect(big.tier).toBe('gross');
    expect(big.motifId).toBe('bc_social_viral');
  });
  it('TV-Kanal: mittel → Masche-Motiv, GROSS übernimmt die Sondersendung', () => {
    // deepfake ist weder social noch print → tv-Kanal.
    const mid = mapActionToBroadcast(fakeResult(['deepfake']), 10);
    expect(mid.tier).toBe('mittel');
    expect(mid.motifId).toMatch(/^bc_masche_/);
    const big = mapActionToBroadcast(fakeResult(['deepfake'], true, 'Grosswirkung', 20), 90);
    expect(big.tier).toBe('gross');
    expect(big.motifId).toBe('bc_tv_sonder');
  });
  it('Misserfolg = Gegenwind', () => {
    const item = mapActionToBroadcast(fakeResult(['bots'], false), 10);
    expect(item.category).toBe('gegenreaktion');
    expect(item.kind).toBe('gegenreaktion');
    expect(item.motifId).toBe('bc_gegenwind');
  });
});

describe('broadcastForEvent / broadcastForWochenschau', () => {
  it('baut Krise/Enttarnung/Faktencheck/Wahltag mit passendem Motiv', () => {
    expect(broadcastForEvent({ key: 'a', category: 'krise', headline: 'X' }).motifId).toBe('bc_krise');
    expect(broadcastForEvent({ key: 'a', category: 'enttarnung', headline: 'X' }).motifId).toBe('bc_enttarnung');
    expect(broadcastForEvent({ key: 'a', category: 'faktencheck', headline: 'X' }).motifId).toBe('bc_faktencheck');
    expect(broadcastForEvent({ key: 'a', category: 'wahltag', headline: 'X' }).motifId).toBe('bc_wahltag');
  });
  it('gleiche Kategorie + key ergibt eine stabile Id (idempotent für den Hook-Dedupe)', () => {
    expect(broadcastForEvent({ key: 'end_exposed', category: 'enttarnung', headline: 'X' }).id).toBe('enttarnung_end_exposed');
  });
  it('Wochenschau nennt die Sendungs-Zahl', () => {
    expect(broadcastForWochenschau(7, 1).headline).toContain('1 Sendung');
    expect(broadcastForWochenschau(7, 3).headline).toContain('3 Sendungen');
    expect(broadcastForWochenschau(7, 3).motifId).toBe('bc_wochenschau');
  });
});
