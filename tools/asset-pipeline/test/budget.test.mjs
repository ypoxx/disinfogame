import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Budget, BudgetExceeded } from '../src/budget.mjs';

test('Budget stoppt VOR Überschreitung der Limits', () => {
  const b = new Budget({ maxImages: 2, maxAudio: 1, maxTtsChars: 10, maxMusic: 1 });
  b.takeImage();
  b.takeImage();
  assert.throws(() => b.takeImage(), BudgetExceeded);

  b.takeAudio();
  assert.throws(() => b.takeAudio(), BudgetExceeded);

  b.takeTtsChars(8);
  assert.throws(() => b.takeTtsChars(3), BudgetExceeded);
  b.takeTtsChars(2); // exakt bis zum Limit ist erlaubt

  b.takeMusic();
  assert.throws(() => b.takeMusic(), BudgetExceeded);
});

test('Budget-Defaults kommen aus der Umgebung (PIPELINE_MAX_*)', () => {
  process.env.PIPELINE_MAX_IMAGES = '3';
  try {
    const b = new Budget();
    assert.equal(b.maxImages, 3);
  } finally {
    delete process.env.PIPELINE_MAX_IMAGES;
  }
});

test('summary() zeigt Verbrauch/Limit', () => {
  const b = new Budget({ maxImages: 5, maxAudio: 5, maxTtsChars: 100, maxMusic: 1 });
  b.takeImage();
  assert.match(b.summary(), /Bilder 1\/5/);
});
