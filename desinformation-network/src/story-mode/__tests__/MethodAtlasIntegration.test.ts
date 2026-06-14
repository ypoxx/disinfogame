/**
 * Integration: der Bildungs-Atlas gegen die ECHTEN Spieldaten.
 * Stellt sicher, dass das Tag→Methode-Mapping die reale Aktions-Landschaft (125 Aktionen)
 * breit abdeckt und ein normales Spiel (inkl. Operation) sinnvolle Lern-Insights ergibt.
 */
import { describe, it, expect } from 'vitest';
import { createStoryEngine } from '../../game-logic/StoryEngineAdapter';
import { classifyMethods, loadDisinfoMethods } from '../engine/DisinfoMethodAtlas';
import { loadTargets, loadCarriers, loadPlatforms } from '../battlefield/BattlefieldChain';

describe('Atlas-Abdeckung der echten Aktionsdaten', () => {
  it('die meisten echten Aktionen lassen sich einer Methode zuordnen (keine Bildungs-Lücken)', () => {
    const engine = createStoryEngine('atlas-cov');
    const catalog = engine.getActionCatalog();
    expect(catalog.length).toBeGreaterThan(100); // ~125 Aktionen

    const mappedTags = new Set<string>();
    for (const m of loadDisinfoMethods()) for (const t of m.matchTags) mappedTags.add(t);

    const covered = catalog.filter((a) => (a.tags ?? []).some((t) => mappedTags.has(t)));
    const ratio = covered.length / catalog.length;
    // Mind. 85% der Aktionen treffen eine Methoden-Familie.
    expect(ratio).toBeGreaterThanOrEqual(0.85);
  });
});

describe('Atlas an einem realen Mini-Spiel', () => {
  it('ein normales Spiel inkl. Operation ergibt mehrere Lern-Insights', () => {
    const engine = createStoryEngine('atlas-game');

    // Ein paar reguläre Aktionen ausführen (Variation).
    const completed: string[] = [];
    for (let i = 0; i < 8; i++) {
      const avail = engine.getAvailableActions().filter((a) => a.available);
      if (avail.length === 0) break;
      const a = avail[i % avail.length];
      try {
        engine.executeAction(a.id);
        completed.push(a.id);
      } catch { /* überspringen */ }
    }

    // Eine Operation ausspielen (Schlachtfeld).
    const t = loadTargets()[0];
    const carrier = loadCarriers().find((c) => c.id === 'creator')!;
    const platform = loadPlatforms().find((p) => p.milieus.includes(t.milieu)) ?? loadPlatforms()[0];
    engine.buildCarrier(carrier.id);
    engine.acquireKompromat(t.id, t.vulnerabilities[0].id);
    engine.playOperation({ target: t.id, vulnerability: t.vulnerabilities[0].id, carrier: carrier.id, platforms: [platform.id] });

    const ops = engine.getOperationsSummary();
    const insights = classifyMethods({
      completedActionIds: completed,
      catalog: engine.getActionCatalog(),
      carriersUsed: ops.carriersUsed,
      platformsUsed: ops.platformsUsed,
      operationsPlayed: ops.operationsPlayed,
      kompromatAcquired: ops.kompromatAcquired,
    });

    // Mehrere Familien erkannt — und jede trägt echten Bildungs-Inhalt.
    expect(insights.length).toBeGreaterThanOrEqual(2);
    for (const m of insights) {
      expect(m.real_method_de.length).toBeGreaterThan(3);
      expect(m.real_case_de.length).toBeGreaterThan(20);
      expect(m.evidence_de.length).toBeGreaterThan(0);
    }
    // Operation + Kompromat → Rufmord/Kompromat-Familie taucht auf.
    expect(insights.some((m) => m.id === 'character_assassination')).toBe(true);
  });
});
