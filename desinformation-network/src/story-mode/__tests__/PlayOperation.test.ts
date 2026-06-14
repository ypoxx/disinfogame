/**
 * params-Durchstich (P2): die „Operations-Akte" spielt eine zusammengesetzte
 * Operation aus {Ziel, Schwäche, Verbreiter, Plattform-Mix} aus.
 *
 * Beweist die Kette ids → BattlefieldChain → Nachricht + Broadcast + Risiko,
 * ohne dass eine Aktion-Karte oder ein Aktionspunkt nötig ist (additives Werkzeug).
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { createStoryEngine, type StoryEngineAdapter } from '../../game-logic/StoryEngineAdapter';
import { loadTargets, loadCarriers, loadPlatforms, type OperationParams } from '../battlefield/BattlefieldChain';

function fullParams(): OperationParams {
  const t = loadTargets()[0];
  return {
    target: t.id,
    vulnerability: t.vulnerabilities[0].id,
    carrier: loadCarriers()[0].id,
    platforms: [loadPlatforms()[0].id],
  };
}

describe('StoryEngineAdapter.playOperation (P2 Operations-Akte)', () => {
  let engine: StoryEngineAdapter;
  beforeEach(() => {
    engine = createStoryEngine('op-seed-1');
  });

  it('unvollständige Operation → kein Effekt, success=false', () => {
    const riskBefore = engine.getResources().risk;
    const newsBefore = engine.getNewsEvents().length;
    const outcome = engine.playOperation({ target: loadTargets()[0].id });
    expect(outcome.success).toBe(false);
    expect(outcome.result).toBeNull();
    expect(outcome.broadcastResult).toBeNull();
    expect(engine.getResources().risk).toBe(riskBefore);
    expect(engine.getNewsEvents().length).toBe(newsBefore);
  });

  it('vollständige Operation → Resultat, Broadcast-Headline und Nachricht', () => {
    const params = fullParams();
    const target = loadTargets()[0];
    const outcome = engine.playOperation(params);

    expect(outcome.success).toBe(true);
    expect(outcome.result).not.toBeNull();
    expect(outcome.result!.impact).toBeGreaterThan(0);

    // Broadcast-förmiges Ergebnis trägt dieselbe plakative Schlagzeile.
    expect(outcome.broadcastResult).not.toBeNull();
    expect(outcome.broadcastResult!.success).toBe(true);
    expect(outcome.broadcastResult!.action.headline_de).toBe(outcome.result!.headline_de);
    expect(outcome.broadcastResult!.action.headline_de).toContain(target.name);

    // Sichtbar in den Nachrichten.
    const news = engine.getNewsEvents();
    expect(news.some((n) => n.headline_de === outcome.result!.headline_de)).toBe(true);
  });

  it('Enttarnungs-Risiko hebt das Entdeckungsrisiko (moderater Lage-Effekt)', () => {
    const riskBefore = engine.getResources().risk;
    const attentionBefore = engine.getResources().attention;
    const outcome = engine.playOperation(fullParams());
    expect(outcome.success).toBe(true);
    expect(engine.getResources().risk).toBeGreaterThanOrEqual(riskBefore);
    expect(engine.getResources().attention).toBeGreaterThanOrEqual(attentionBefore);
    // geklammert in 0..100
    expect(engine.getResources().risk).toBeLessThanOrEqual(100);
  });
});
