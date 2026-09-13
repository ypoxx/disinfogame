import { describe, expect, it } from 'vitest';
import { audienceBubbleSegmentId, newsSceneIndex } from '../broadcast/BroadcastBar';

describe('linker Nachrichtenfernseher', () => {
  it('wählt für die Themen klar unterscheidbare Bildmotive', () => {
    expect(newsSceneIndex({ channel: 'tv', themes: ['misstrauen_medien'] })).toBe(0);
    expect(newsSceneIndex({ channel: 'tv', themes: ['energie_angst'] })).toBe(1);
    expect(newsSceneIndex({ channel: 'tv', themes: ['anti_establishment'] })).toBe(2);
    expect(newsSceneIndex({ channel: 'social', themes: ['anti_establishment'] })).toBe(3);
  });
});

describe('Publikumsreaktionsblase', () => {
  it('zeigt nur die stärkste sichtbare Reaktion oberhalb der Schwelle', () => {
    expect(
      audienceBubbleSegmentId(
        ['mitte', 'macher'],
        [
          { segmentId: 'mitte', beliefDelta: 0.05 },
          { segmentId: 'macher', beliefDelta: -0.12 },
          { segmentId: 'unsichtbar', beliefDelta: 0.3 },
        ],
      ),
    ).toBe('macher');
    expect(audienceBubbleSegmentId(['mitte'], [{ segmentId: 'mitte', beliefDelta: 0.039 }])).toBeNull();
  });
});
