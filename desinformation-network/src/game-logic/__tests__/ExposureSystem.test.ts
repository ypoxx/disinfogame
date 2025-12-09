import { describe, it, expect, beforeEach } from 'vitest';
import { GameStateManager } from '../GameState';
import type { Ability, ActorDefinition } from '../types';

// Test data - minimal actor definitions
const testActorDefinitions: ActorDefinition[] = [
  {
    id: 'media_1',
    name: 'Test Media',
    category: 'media',
    tier: 1,

    baseTrust: 0.7,
    resilience: 0.3,
    influenceRadius: 150,
    emotionalState: 0.5,
    recoveryRate: 0.02,

    abilities: ['high_attention_ability'],
    vulnerabilities: [],
    resistances: [],
    color: '#3b82f6',
    size: 1.0,
  },
  {
    id: 'expert_1',
    name: 'Test Expert',
    category: 'expert',
    tier: 1,

    baseTrust: 0.8,
    resilience: 0.6,
    influenceRadius: 100,
    emotionalState: 0.2,
    recoveryRate: 0.03,

    abilities: [],
    vulnerabilities: [],
    resistances: [],
    color: '#8b5cf6',
    size: 1.0,
  },
];

// Ability that generates lots of attention
const testAbilityDefinitions: Ability[] = [
  {
    id: 'high_attention_ability',
    name: 'High Attention Ability',
    description: 'Generates lots of attention (risky!)',
    
    targetType: 'single',
    effectType: 'direct',
    resourceCost: { money: 10, attention: 25, infrastructure: 0 }, // 25 attention!
    cooldown: 0,
    effects: {
      trustDelta: -0.1,
      duration: 0,
      propagates: false,
    },
    basedOn: [],
    diminishingFactor: 1.0,
    animationType: 'pulse',
    animationColor: '#ff0000',
    
  },
];

describe('Exposure System', () => {
  let gameManager: GameStateManager;

  beforeEach(() => {
    gameManager = new GameStateManager('exposure-test-seed');
    gameManager.loadDefinitions(testActorDefinitions, testAbilityDefinitions, []);
    gameManager.startGame();
  });

  describe('Detection Risk Calculation', () => {
    it('should start with zero detection risk', () => {
      expect(gameManager.getState().detectionRisk).toBe(0);
    });

    it('should increase detection risk when attention increases', () => {
      const detectionBefore = gameManager.getState().detectionRisk;

      // Use high-attention ability
      gameManager.applyAbility('high_attention_ability', 'media_1', ['expert_1']);

      const detectionAfter = gameManager.getState().detectionRisk;
      expect(detectionAfter).toBeGreaterThan(detectionBefore);
    });

    it('should calculate detection risk as attention/100', () => {
      // Generate attention
      gameManager.applyAbility('high_attention_ability', 'media_1', ['expert_1']);

      const state = gameManager.getState();
      const expectedRisk = state.resources.attention / 100;

      expect(state.detectionRisk).toBeCloseTo(expectedRisk, 2);
    });

    it('should decay detection risk when attention decays', () => {
      // Generate attention
      gameManager.applyAbility('high_attention_ability', 'media_1', ['expert_1']);
      const detectionAfter = gameManager.getState().detectionRisk;

      // Advance round (attention decays)
      gameManager.advanceRound();

      const detectionAfterDecay = gameManager.getState().detectionRisk;
      expect(detectionAfterDecay).toBeLessThan(detectionAfter);
    });
  });

  describe('Exposure Defeat Condition', () => {
    it('should trigger exposure defeat when detection risk >= 0.85', () => {
      // Generate excessive attention to trigger exposure
      // Each use: +25 attention, detectionRisk = attention/100
      // Need: detectionRisk >= 0.85, so attention >= 85
      // 85 / 25 = 3.4 → need 4 uses
      // But attention decays 15% per round, so we need more uses

      // Use ability multiple times without advancing round (no decay)
      for (let i = 0; i < 4; i++) {
        gameManager.applyAbility('high_attention_ability', 'media_1', ['expert_1']);
      }

      const state = gameManager.getState();
      const defeatReason = gameManager.checkDefeat();

      // Should be exposed
      expect(state.detectionRisk).toBeGreaterThanOrEqual(0.85);
      expect(defeatReason).toBe('exposure');
    });

    it('should NOT trigger exposure defeat when detection risk < 0.85', () => {
      // Use ability only twice (detectionRisk will be < 0.85)
      gameManager.applyAbility('high_attention_ability', 'media_1', ['expert_1']);
      gameManager.advanceRound();
      gameManager.applyAbility('high_attention_ability', 'media_1', ['expert_1']);

      const state = gameManager.getState();
      const defeatReason = gameManager.checkDefeat();

      // Should NOT be exposed
      expect(state.detectionRisk).toBeLessThan(0.85);
      expect(defeatReason).not.toBe('exposure');
    });

    it('should check exposure before time_out', () => {
      // Exposure should be checked first (higher priority)
      // Even if round limit is reached, exposure takes precedence

      // Generate excessive attention
      for (let i = 0; i < 4; i++) {
        gameManager.applyAbility('high_attention_ability', 'media_1', ['expert_1']);
      }

      const defeatReason = gameManager.checkDefeat();

      // Should be exposure, not time_out
      expect(defeatReason).toBe('exposure');
    });
  });

  describe('Risk Management Strategy', () => {
    it('should allow player to stay below exposure threshold with careful play', () => {
      // Use ability only when safe
      gameManager.applyAbility('high_attention_ability', 'media_1', ['expert_1']);

      expect(gameManager.getState().detectionRisk).toBeLessThan(0.85);
      expect(gameManager.checkDefeat()).toBeNull();

      // Wait for attention decay
      gameManager.advanceRound();
      gameManager.advanceRound();

      // Should be safe now
      expect(gameManager.getState().detectionRisk).toBeLessThan(0.5);
    });

    it('should penalize reckless attention generation', () => {
      // Spam high-attention abilities recklessly
      for (let i = 0; i < 5; i++) {
        gameManager.applyAbility('high_attention_ability', 'media_1', ['expert_1']);
      }

      const defeatReason = gameManager.checkDefeat();

      // Should be caught due to reckless play
      expect(defeatReason).toBe('exposure');
    });
  });

  describe('Attention Decay Mechanics', () => {
    it('should reduce attention by 15% per round', () => {
      // Generate attention
      gameManager.applyAbility('high_attention_ability', 'media_1', ['expert_1']);
      const attentionBefore = gameManager.getState().resources.attention;

      // Advance round
      gameManager.advanceRound();

      const attentionAfter = gameManager.getState().resources.attention;

      // Should decay by ~15%
      const expectedAttention = attentionBefore * (1 - 0.15);
      expect(attentionAfter).toBeCloseTo(expectedAttention, 1);
    });

    it('should eventually reduce attention to near-zero if no new abilities used', () => {
      // Generate attention
      gameManager.applyAbility('high_attention_ability', 'media_1', ['expert_1']);

      // Wait many rounds
      for (let i = 0; i < 20; i++) {
        gameManager.advanceRound();
      }

      const finalAttention = gameManager.getState().resources.attention;

      // Should be very low (allowing for decay curve)
      expect(finalAttention).toBeLessThan(10);
    });
  });

  describe('Statistics Tracking', () => {
    it('should track peak detection risk in statistics', () => {
      // Generate attention
      gameManager.applyAbility('high_attention_ability', 'media_1', ['expert_1']);
      gameManager.advanceRound(); // Trigger statistics update

      const peakAfterFirst = gameManager.getStatistics().peakDetectionRisk;

      // Generate more attention
      gameManager.applyAbility('high_attention_ability', 'media_1', ['expert_1']);
      gameManager.advanceRound();

      const peakAfterSecond = gameManager.getStatistics().peakDetectionRisk;

      // Peak should have increased
      expect(peakAfterSecond).toBeGreaterThanOrEqual(peakAfterFirst);
      expect(peakAfterSecond).toBeGreaterThan(0);
    });
  });
});
