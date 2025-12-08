# Testing Guide for DisInfoGame

## 📋 Overview

This guide explains how to write and run tests for the DisInfoGame project. Use this as a reference for Claude Code when implementing new features or fixing bugs.

---

## 🎯 Test Philosophy

**Why We Test:**
- ✅ Prevent regressions when fixing bugs
- ✅ Document expected behavior
- ✅ Enable confident refactoring
- ✅ Catch edge cases (extreme resilience, emotional state, etc.)

**What We Test:**
- ✅ Core game logic (GameStateManager)
- ✅ Network mechanics (propagation, connections)
- ✅ Ability system (targeting, effects, cooldowns)
- ✅ Round progression (recovery, events, resource management)
- ✅ Victory/defeat conditions
- ✅ Edge cases and boundary conditions

---

## 🛠️ Setup

### Install Dependencies

```bash
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

### Configuration Files

**vitest.config.ts** (already created):
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/dist/',
        '**/build/',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**src/test/setup.ts** (already created):
```typescript
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});
```

---

## 🚀 Running Tests

### Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm test -- --watch

# Run with coverage report
npm run test:coverage

# Run specific test file
npm test -- GameState.test.ts

# Run tests matching a pattern
npm test -- --grep "network propagation"

# Run with UI
npm test -- --ui
```

---

## ✍️ Writing Tests

### Test File Structure

**Location:** Place tests next to the code they test, in a `__tests__` folder.

```
src/
  game-logic/
    GameState.ts
    __tests__/
      GameState.test.ts
  utils/
    index.ts
    __tests__/
      utils.test.ts
```

### Basic Test Template

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { GameStateManager } from '../GameState';
import type { ActorDefinition, Ability } from '../types';

describe('Feature Name', () => {
  let gameManager: GameStateManager;

  beforeEach(() => {
    // Setup: Create fresh game state for each test
    gameManager = new GameStateManager('test-seed-123');
    gameManager.loadDefinitions(
      testActorDefinitions,
      testAbilityDefinitions,
      []
    );
    gameManager.startGame();
  });

  describe('Sub-feature', () => {
    it('should do something specific', () => {
      // Arrange: Set up test data
      const actor = gameManager.getActor('test_actor')!;
      const trustBefore = actor.trust;

      // Act: Perform the action
      gameManager.applyAbility('test_ability', 'source_id', ['test_actor']);

      // Assert: Verify the result
      const actorAfter = gameManager.getActor('test_actor')!;
      expect(actorAfter.trust).toBeLessThan(trustBefore);
    });
  });
});
```

---

## 📝 Test Data Creation

### Minimal Actor Definitions

Always create **minimal** test data to keep tests fast and focused:

```typescript
const testActorDefinitions: ActorDefinition[] = [
  {
    id: 'media_1',
    name: 'Test Media',
    category: 'media',
    trust: 0.7,
    baseTrust: 0.7,
    resilience: 0.3,
    influenceRadius: 150,
    emotionalState: 0.5,
    recoveryRate: 0.02,
    position: { x: 200, y: 200 },
    abilities: ['test_single'],
    vulnerabilities: ['emotional_appeal'],
    resistances: ['factual_appeal'],
  },
  // Add more actors as needed for your specific test
];
```

### Minimal Ability Definitions

```typescript
const testAbilityDefinitions: Ability[] = [
  {
    id: 'test_single',
    name: 'Test Single Target',
    description: 'Single target test ability',
    longDescription: 'Test',
    targetType: 'single',
    effectType: 'direct',
    resourceCost: { money: 20, attention: 5, infrastructure: 0 },
    cooldown: 2,
    effects: {
      trustDelta: -0.2,
      emotionalDelta: 0.1,
      duration: 0,
      propagates: false,
    },
    basedOn: ['emotional_appeal'],
    diminishingFactor: 0.85,
    animationType: 'pulse',
    animationColor: '#ff0000',
    realWorldExamples: [],
  },
];
```

---

## 🎯 Common Test Patterns

### 1. Testing State Changes

```typescript
it('should reduce target trust when ability is applied', () => {
  const target = gameManager.getActor('expert_1')!;
  const trustBefore = target.trust;

  gameManager.applyAbility('test_single', 'media_1', ['expert_1']);

  const targetAfter = gameManager.getActor('expert_1')!;
  expect(targetAfter.trust).toBeLessThan(trustBefore);
});
```

### 2. Testing Resource Management

```typescript
it('should deduct resources when using ability', () => {
  const resourcesBefore = { ...gameManager.getState().resources };

  gameManager.applyAbility('test_single', 'media_1', ['expert_1']);

  const resourcesAfter = gameManager.getState().resources;
  expect(resourcesAfter.money).toBe(resourcesBefore.money - 20);
  expect(resourcesAfter.attention).toBe(resourcesBefore.attention + 5);
});
```

### 3. Testing Cooldowns

```typescript
it('should set cooldown on source actor', () => {
  gameManager.applyAbility('test_single', 'media_1', ['expert_1']);

  const actor = gameManager.getActor('media_1')!;
  expect(actor.cooldowns['test_single']).toBe(2);
});

it('should not allow using ability during cooldown', () => {
  gameManager.applyAbility('test_single', 'media_1', ['expert_1']);
  const result = gameManager.applyAbility('test_single', 'media_1', ['expert_1']);

  expect(result).toBe(false);
});
```

### 4. Testing Network Effects

```typescript
it('should apply network-wide effect to all actors', () => {
  const trustBefore = gameManager.getState().network.actors.map(a => a.trust);

  gameManager.applyAbility('test_network', 'media_1', []);

  const trustAfter = gameManager.getState().network.actors.map(a => a.trust);

  // All actors should have reduced trust
  trustAfter.forEach((trust, i) => {
    expect(trust).toBeLessThan(trustBefore[i]);
  });
});
```

### 5. Testing Propagation

**CRITICAL: Testing the Network-Propagation Bug Fix**

```typescript
it('CRITICAL: network-type ability with propagates=true should propagate to connected actors', () => {
  // This tests the bug we fixed!
  // Before fix: propagation did nothing because targetActorIds was empty
  // After fix: propagation should work from all actors

  const state = gameManager.getState();
  const initialTrust = state.network.actors.map(a => ({ id: a.id, trust: a.trust }));

  // Use network ability with propagates=true
  const result = gameManager.applyAbility('test_network', 'media_1', []);
  expect(result).toBe(true);

  const finalState = gameManager.getState();
  const finalTrust = finalState.network.actors.map(a => ({ id: a.id, trust: a.trust }));

  // Verify that:
  // 1. Direct network effect was applied (all actors trust decreased)
  // 2. Propagation also happened (connected actors got additional decrease)

  finalTrust.forEach((actor, i) => {
    const initial = initialTrust[i].trust;
    const final = actor.trust;

    // Trust should be lower
    expect(final).toBeLessThan(initial);

    // The decrease should be more than just the direct effect
    // because propagation also happened
    expect(final).not.toBe(initial);
  });
});
```

### 6. Testing Edge Cases

**Extreme Resilience:**

```typescript
it('should reduce effect on high-resilience actors', () => {
  // expert_1 has resilience 0.6, media_1 has resilience 0.3
  const expertBefore = gameManager.getActor('expert_1')!.trust;
  const mediaBefore = gameManager.getActor('media_1')!.trust;

  // Use network ability (affects all)
  gameManager.applyAbility('test_network', 'media_1', []);

  const expertAfter = gameManager.getActor('expert_1')!.trust;
  const mediaAfter = gameManager.getActor('media_1')!.trust;

  const expertChange = expertBefore - expertAfter;
  const mediaChange = mediaBefore - mediaAfter;

  // Expert should have smaller change due to higher resilience
  expect(expertChange).toBeLessThan(mediaChange);
});
```

**Extreme Emotional State:**

```typescript
it('should amplify emotional effects on emotional actors', () => {
  // lobby_1 has emotionalState 0.7, expert_1 has 0.2
  const lobbyBefore = gameManager.getActor('lobby_1')!.trust;

  // Use ability with emotional effect
  gameManager.applyAbility('test_single', 'media_1', ['lobby_1']);

  const lobbyAfter = gameManager.getActor('lobby_1')!.trust;
  expect(lobbyAfter).toBeLessThan(lobbyBefore);
});
```

### 7. Testing Round Progression

```typescript
it('should apply passive trust recovery', () => {
  // First damage an actor
  gameManager.applyAbility('test_single', 'media_1', ['expert_1']);
  const trustAfterDamage = gameManager.getActor('expert_1')!.trust;

  // Advance round to allow recovery
  gameManager.advanceRound();

  const trustAfterRecovery = gameManager.getActor('expert_1')!.trust;

  // Trust should recover toward base trust
  expect(trustAfterRecovery).toBeGreaterThan(trustAfterDamage);
});
```

### 8. Testing Victory/Defeat

```typescript
it('should detect victory when 75% of actors have low trust', () => {
  // Reduce trust of all actors below 0.4
  for (let i = 0; i < 5; i++) {
    gameManager.applyAbility('test_network', 'media_1', []);
    gameManager.advanceRound();
  }

  const result = gameManager.checkVictory();
  expect(typeof result).toBe('boolean');
});
```

---

## 🚨 Common Pitfalls

### ❌ DON'T: Forget to call loadDefinitions()

```typescript
// WRONG - Will fail with "No actor definitions loaded"
beforeEach(() => {
  gameManager = new GameStateManager('test-seed');
  gameManager.startGame(); // ❌ No definitions loaded!
});

// CORRECT
beforeEach(() => {
  gameManager = new GameStateManager('test-seed');
  gameManager.loadDefinitions(actors, abilities, events); // ✅
  gameManager.startGame();
});
```

### ❌ DON'T: Use production data in tests

```typescript
// WRONG - Tests become slow and brittle
import actorDefinitions from '../data/game/actor-definitions-v2.json';

// CORRECT - Create minimal test data
const testActors = [
  { id: 'test_1', /* minimal fields */ },
];
```

### ❌ DON'T: Test implementation details

```typescript
// WRONG - Tests internal implementation
expect(gameManager.state.network.actors[0].trust).toBe(0.5);

// CORRECT - Test public API
expect(gameManager.getActor('test_1')!.trust).toBe(0.5);
```

### ❌ DON'T: Write tests that depend on each other

```typescript
// WRONG - Tests affect each other
describe('Bad Tests', () => {
  let sharedState; // ❌ Shared state!

  it('test 1', () => {
    sharedState = 5; // ❌ Modifies shared state
  });

  it('test 2', () => {
    expect(sharedState).toBe(5); // ❌ Depends on test 1
  });
});

// CORRECT - Each test is independent
describe('Good Tests', () => {
  beforeEach(() => {
    // ✅ Fresh state for each test
    gameManager = new GameStateManager('test-seed');
    gameManager.loadDefinitions(actors, abilities, []);
    gameManager.startGame();
  });

  it('test 1', () => { /* independent */ });
  it('test 2', () => { /* independent */ });
});
```

### ⚠️ WATCH OUT: Floating-Point Precision

```typescript
// Can fail due to floating point precision
expect(change).toBeLessThan(0.1); // Might be 0.10000000000000001

// Better: Allow small tolerance
expect(change).toBeLessThan(0.11);

// Or use toBeCloseTo
expect(change).toBeCloseTo(0.1, 1); // Within 1 decimal place
```

---

## 📊 Coverage Goals

**Target Coverage:**
- GameStateManager: 90%+
- Network utilities: 85%+
- Ability system: 90%+
- UI components: 70%+ (harder to test)

**How to check coverage:**

```bash
npm run test:coverage
```

**Coverage report will be in:** `coverage/index.html`

---

## 🎓 Best Practices

### ✅ DO: Use descriptive test names

```typescript
// ❌ BAD
it('test 1', () => { /* ... */ });

// ✅ GOOD
it('should reduce trust when scandal ability is used on media actor', () => {
  /* ... */
});
```

### ✅ DO: Follow Arrange-Act-Assert pattern

```typescript
it('should deduct resources', () => {
  // Arrange
  const resourcesBefore = gameManager.getState().resources.money;

  // Act
  gameManager.applyAbility('test_ability', 'actor_1', ['actor_2']);

  // Assert
  const resourcesAfter = gameManager.getState().resources.money;
  expect(resourcesAfter).toBeLessThan(resourcesBefore);
});
```

### ✅ DO: Test one thing per test

```typescript
// ❌ BAD - Tests multiple things
it('should handle ability application', () => {
  gameManager.applyAbility(...);
  expect(resources).toBeLessThan(100); // Testing resources
  expect(trust).toBeLessThan(0.5);     // Testing trust
  expect(cooldown).toBe(2);            // Testing cooldown
});

// ✅ GOOD - One concept per test
it('should deduct resources when ability is used', () => { /* ... */ });
it('should reduce target trust when ability is used', () => { /* ... */ });
it('should set cooldown when ability is used', () => { /* ... */ });
```

### ✅ DO: Use beforeEach for setup

```typescript
describe('GameStateManager', () => {
  let gameManager: GameStateManager;

  beforeEach(() => {
    // ✅ Fresh setup for each test
    gameManager = new GameStateManager('test-seed');
    gameManager.loadDefinitions(actors, abilities, []);
    gameManager.startGame();
  });

  it('test 1', () => { /* uses gameManager */ });
  it('test 2', () => { /* uses gameManager */ });
});
```

### ✅ DO: Test error cases

```typescript
it('should not allow using ability with insufficient resources', () => {
  // Drain resources
  for (let i = 0; i < 10; i++) {
    if (!gameManager.applyAbility('test_ability', 'actor_1', ['actor_2'])) break;
  }

  const result = gameManager.applyAbility('test_ability', 'actor_1', ['actor_2']);
  expect(result).toBe(false);
});
```

---

## 🔧 Debugging Tests

### Run a single test

```bash
npm test -- --grep "should reduce trust"
```

### Add console.log in tests

```typescript
it('debug test', () => {
  console.log('State:', gameManager.getState());
  console.log('Actor:', gameManager.getActor('test_1'));
  // ...
});
```

### Use vitest UI for debugging

```bash
npm test -- --ui
```

Opens a browser interface with:
- Test results visualization
- Code coverage overlay
- Re-run on file change

---

## 📚 Further Reading

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Test-Driven Development (TDD)](https://en.wikipedia.org/wiki/Test-driven_development)

---

## ✅ Quick Checklist

Before committing new features, ensure:

- [ ] All tests pass (`npm test`)
- [ ] New features have tests
- [ ] Bug fixes have regression tests
- [ ] Coverage didn't decrease
- [ ] Tests are independent (don't rely on each other)
- [ ] Test names are descriptive
- [ ] Edge cases are tested (extreme values, boundary conditions)

---

## 💡 Example: Adding a New Feature with Tests

**Scenario:** Add a new "Amplify Scandal" ability

### 1. Write the test first (TDD)

```typescript
describe('Amplify Scandal Ability', () => {
  it('should amplify existing scandal effects by 50%', () => {
    // Arrange: Apply initial scandal
    gameManager.applyAbility('scandal', 'media_1', ['expert_1']);
    const trustAfterScandal = gameManager.getActor('expert_1')!.trust;

    // Act: Amplify the scandal
    gameManager.applyAbility('amplify_scandal', 'media_1', ['expert_1']);

    // Assert: Trust should decrease further
    const trustAfterAmplify = gameManager.getActor('expert_1')!.trust;
    expect(trustAfterAmplify).toBeLessThan(trustAfterScandal);
  });
});
```

### 2. Run test (it will fail)

```bash
npm test -- --grep "Amplify Scandal"
# ❌ FAIL: ability not found
```

### 3. Implement the feature

Add ability definition, implement logic in GameState.ts

### 4. Run test again (it should pass)

```bash
npm test -- --grep "Amplify Scandal"
# ✅ PASS
```

### 5. Run all tests to ensure no regressions

```bash
npm test
# ✅ All tests pass
```

---

**Happy Testing! 🎉**

*This guide is a living document. Update it as testing practices evolve.*
