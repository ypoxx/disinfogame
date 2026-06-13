/**
 * Tests für NewsroomView-Komponente und Hilfsfunktionen.
 * Prüft Rendering, isOurs-Markierung, Hash-Determinismus und derivePosts-Mapping.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  NewsroomView,
  derivePosts,
  deriveLikes,
  deriveShares,
  hashString,
  type NewsPost,
  type TrendingTopic,
} from '../components/NewsroomView';
import type { NewsEvent } from '../../game-logic/StoryEngineAdapter';
import type { BroadcastItem } from '../broadcast/broadcastMapping';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const samplePosts: NewsPost[] = [
  {
    id: 'p1',
    text: 'Ministerium startet neue Kampagne',
    author: '@ministerium_ops',
    likes: 100,
    shares: 20,
    isOurs: true,
    phase: 3,
  },
  {
    id: 'p2',
    text: 'Journalisten berichten von Netzwerk-Aktivitaeten',
    author: '@westunion_watch',
    likes: 450,
    shares: 89,
    isOurs: false,
    phase: 4,
  },
];

const sampleTrending: TrendingTopic[] = [
  { topic: '#WestunionLuegt', volume: 45000, rising: true },
  { topic: '#Faktenchecker', volume: 12000, rising: false },
];

const noopClose = vi.fn();

// ─── Tests: hashString / deriveLikes / deriveShares (Determinismus) ───────────

describe('hashString', () => {
  it('liefert identisches Ergebnis bei mehrfachem Aufruf mit gleicher Eingabe', () => {
    const h1 = hashString('test_id_42');
    const h2 = hashString('test_id_42');
    expect(h1).toBe(h2);
  });

  it('liefert unterschiedliche Werte fuer unterschiedliche Eingaben', () => {
    expect(hashString('abc')).not.toBe(hashString('xyz'));
  });

  it('gibt immer einen nicht-negativen Wert zurueck (unsigned)', () => {
    const values = ['', 'a', 'post_001', 'x'.repeat(200)];
    for (const v of values) {
      expect(hashString(v)).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('deriveLikes / deriveShares', () => {
  it('deriveLikes ist deterministisch', () => {
    expect(deriveLikes('post_abc')).toBe(deriveLikes('post_abc'));
  });

  it('deriveShares ist deterministisch', () => {
    expect(deriveShares('post_abc')).toBe(deriveShares('post_abc'));
  });

  it('deriveLikes liegt im Bereich 12..4095', () => {
    const ids = ['a', 'b', 'news_001', 'post_xyz_123'];
    for (const id of ids) {
      const v = deriveLikes(id);
      expect(v).toBeGreaterThanOrEqual(12);
      expect(v).toBeLessThanOrEqual(4095);
    }
  });

  it('deriveShares liegt im Bereich 0..511', () => {
    const ids = ['a', 'b', 'news_001', 'post_xyz_123'];
    for (const id of ids) {
      const v = deriveShares(id);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(511);
    }
  });

  it('verschiedene IDs erzeugen (fast immer) verschiedene Likes', () => {
    // Kein Math.random im Render — Kollisionen theoretisch moeglich, aber sehr unwahrscheinlich
    const ids = Array.from({ length: 20 }, (_, i) => `post_${i}`);
    const vals = ids.map(deriveLikes);
    const uniqueCount = new Set(vals).size;
    // Mindestens 15 der 20 Werte sollten eindeutig sein (konservative Schwelle)
    expect(uniqueCount).toBeGreaterThanOrEqual(15);
  });
});

// ─── Tests: derivePosts ────────────────────────────────────────────────────────

describe('derivePosts', () => {
  const newsEvents: NewsEvent[] = [
    {
      id: 'ne_001',
      phase: 2,
      headline_de: 'Operation gestartet',
      headline_en: 'Operation launched',
      description_de: 'Details...',
      description_en: 'Details...',
      type: 'action_result',
      severity: 'success',
      read: false,
      pinned: false,
    },
    {
      id: 'ne_002',
      phase: 3,
      headline_de: 'Weltpresse berichtet',
      headline_en: 'World press reports',
      description_de: 'Details...',
      description_en: 'Details...',
      type: 'world_event',
      severity: 'warning',
      read: false,
      pinned: false,
    },
  ];

  const broadcastItems: BroadcastItem[] = [
    {
      id: 'bc_broadcast_001',
      channel: 'social',
      themes: ['misstrauen_medien'],
      intensity: 0.6,
      headline: 'Propagandawelle erfasst Social Media',
      tier: 'mittel',
      kind: 'eigen',
    },
    {
      id: 'bc_broadcast_002',
      channel: 'tv',
      themes: ['anti_establishment'],
      intensity: 0.4,
      headline: 'Gegenreaktion im Fernsehen',
      tier: 'klein',
      kind: 'gegenreaktion',
    },
  ];

  it('mappt NewsEvents korrekt auf Posts', () => {
    const posts = derivePosts(newsEvents, []);
    expect(posts).toHaveLength(2);
    expect(posts[0].text).toBe('Operation gestartet');
    expect(posts[1].text).toBe('Weltpresse berichtet');
  });

  it('setzt isOurs=true fuer action_result, false fuer world_event', () => {
    const posts = derivePosts(newsEvents, []);
    expect(posts[0].isOurs).toBe(true);   // action_result
    expect(posts[1].isOurs).toBe(false);  // world_event
  });

  it('mappt Broadcast-Items mit kind=eigen auf isOurs=true', () => {
    const posts = derivePosts([], broadcastItems);
    expect(posts[0].isOurs).toBe(true);   // kind: 'eigen'
    expect(posts[1].isOurs).toBe(false);  // kind: 'gegenreaktion'
  });

  it('dedupliziert Eintraege mit gleicher ID', () => {
    // Gleiche Events zweimal übergeben
    const doubled = [...newsEvents, ...newsEvents];
    const posts = derivePosts(doubled, []);
    // Jede ID wird nur einmal verarbeitet
    expect(posts).toHaveLength(2);
  });

  it('kombiniert News-Events und Broadcast-Items', () => {
    const posts = derivePosts(newsEvents, broadcastItems);
    expect(posts).toHaveLength(4); // 2 + 2
  });

  it('gibt bei leerer Eingabe leeres Array zurueck', () => {
    expect(derivePosts([], [])).toHaveLength(0);
  });
});

// ─── Tests: NewsroomView Rendering ────────────────────────────────────────────

describe('NewsroomView', () => {
  it('rendert ohne Absturz (Smoke-Test)', () => {
    render(
      <NewsroomView
        posts={samplePosts}
        trending={sampleTrending}
        onClose={noopClose}
      />,
    );
    // Kein Fehler → Test bestanden
  });

  it('zeigt Kopfzeile NEWSROOM an', () => {
    render(
      <NewsroomView posts={samplePosts} trending={sampleTrending} onClose={noopClose} />,
    );
    expect(screen.getByText('NEWSROOM')).toBeTruthy();
  });

  it('zeigt Post-Texte im Feed an', () => {
    render(
      <NewsroomView posts={samplePosts} trending={sampleTrending} onClose={noopClose} />,
    );
    // Jeder Text erscheint mindestens einmal (duplikate Liste fuer Loop)
    const matches = screen.getAllByText(/Ministerium startet neue Kampagne/);
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it('zeigt ⬢-Marker nur bei isOurs=true-Posts', () => {
    render(
      <NewsroomView posts={samplePosts} trending={sampleTrending} onClose={noopClose} />,
    );
    // ⬢ muss im DOM vorhanden sein (mindestens 1× durch Loop)
    const markers = screen.getAllByTitle('Eigene Operation');
    expect(markers.length).toBeGreaterThanOrEqual(1);
  });

  it('zeigt Trending-Topics an', () => {
    render(
      <NewsroomView posts={samplePosts} trending={sampleTrending} onClose={noopClose} />,
    );
    expect(screen.getByText('#WestunionLuegt')).toBeTruthy();
    expect(screen.getByText('#Faktenchecker')).toBeTruthy();
  });

  it('ruft onClose auf, wenn Schließen-Button geklickt wird', async () => {
    const onClose = vi.fn();
    render(
      <NewsroomView posts={samplePosts} trending={sampleTrending} onClose={onClose} />,
    );
    const btn = screen.getByRole('button', { name: /newsroom schliessen/i });
    await userEvent.click(btn);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('rendert auch ohne Posts und Trending-Topics ohne Fehler', () => {
    render(<NewsroomView posts={[]} trending={[]} onClose={noopClose} />);
    // Fallback-Texte statt Kacheln
    expect(screen.getByText(/Keine Beitraege vorhanden/)).toBeTruthy();
    expect(screen.getByText(/Keine Trends/)).toBeTruthy();
  });
});
