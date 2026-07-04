/**
 * P6/C9 — Erzählerische Gegenseite (die Aufklärung wird wahrnehmbar, §14.3).
 */
import { describe, it, expect } from 'vitest';
import { deriveGegenseite, gegenseiteAwareness } from '../engine/Gegenseite';

describe('Gegenseite', () => {
  it('Aufklärungsgrad steigt mit Aufmerksamkeit/Risiko/verbrannten Verbreitern', () => {
    const low = gegenseiteAwareness({ attention: 5, risk: 5, carriersBurned: 0, phase: 1 });
    const high = gegenseiteAwareness({ attention: 80, risk: 70, carriersBurned: 2, phase: 1 });
    expect(low).toBeLessThan(0.3);
    expect(high).toBeGreaterThan(0.7);
    expect(high).toBeLessThanOrEqual(1);
  });

  it('manchmal weiß die Gegenseite (fast) nichts — manchmal viel (§14.3)', () => {
    const dark = deriveGegenseite({ attention: 0, risk: 0, carriersBurned: 0, phase: 0 });
    expect(dark.awareness).toBeLessThan(0.25);
    expect(dark.lines.join(' ')).toMatch(/Dunkeln|niemand|Niemand/);

    const hot = deriveGegenseite({ attention: 90, risk: 85, carriersBurned: 3, phase: 0 });
    expect(hot.awareness).toBeGreaterThanOrEqual(0.75);
    expect(hot.lines.join(' ')).toMatch(/Enttarnung|rekonstruiert|Handschrift/);
  });

  it('rotiert die Newsroom-Formate über die Phasen', () => {
    const f0 = deriveGegenseite({ attention: 50, risk: 50, carriersBurned: 0, phase: 0 }).format_de;
    const f1 = deriveGegenseite({ attention: 50, risk: 50, carriersBurned: 0, phase: 1 }).format_de;
    const f2 = deriveGegenseite({ attention: 50, risk: 50, carriersBurned: 0, phase: 2 }).format_de;
    expect(new Set([f0, f1, f2]).size).toBe(3);
  });

  // Etappe 3 Paket D: die aktive ABWEHR-Stufe bekommt eine Attributions-Zeile.
  it('zeigt keine Stufen-Attribution ohne abwehrStage (Rückwärts-Kompatibilität)', () => {
    const noStage = deriveGegenseite({ attention: 50, risk: 50, carriersBurned: 0, phase: 0 });
    expect(noStage.lines.join(' ')).not.toMatch(/Abwehr 25|Stufe 50|Stufe 75/);

    const stageZero = deriveGegenseite({ attention: 50, risk: 50, carriersBurned: 0, phase: 0, abwehrStage: 0 });
    expect(stageZero.lines.join(' ')).not.toMatch(/Abwehr 25|Stufe 50|Stufe 75/);
  });

  it('Stufen-Attribution erscheint ab der jeweiligen Stufe (25/50/75)', () => {
    const s25 = deriveGegenseite({ attention: 50, risk: 50, carriersBurned: 0, phase: 0, abwehrStage: 25 });
    expect(s25.lines.join(' ')).toMatch(/Behörden hinsehen \[Abwehr 25\]/);

    const s50 = deriveGegenseite({ attention: 50, risk: 50, carriersBurned: 0, phase: 0, abwehrStage: 50 });
    expect(s50.lines.join(' ')).toMatch(/koordiniert \[Stufe 50\]/);

    const s75 = deriveGegenseite({ attention: 50, risk: 50, carriersBurned: 0, phase: 0, abwehrStage: 75 });
    expect(s75.lines.join(' ')).toMatch(/Task-Force-Niveau \[Stufe 75\]/);
  });
});
