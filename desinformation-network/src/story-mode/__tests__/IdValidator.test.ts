/**
 * P0 — Zentraler ID-Validator (R3/R4). Prüft, dass tote Referenzen erkannt werden
 * und dass die REALEN Spieldaten sauber sind (keine Fehler, keine toten Refs).
 */
import { describe, it, expect } from 'vitest';
import { validateReferences } from '../engine/IdValidator';
import { getDataIntegrityIssues } from '../../game-logic/StoryEngineAdapter';

describe('IdValidator — pure', () => {
  it('meldet saubere Daten ohne Befunde', () => {
    const issues = validateReferences({
      actions: [
        { id: 'a1', prerequisites: [], unlocks: ['a2'], npc_affinity: ['n1'] },
        { id: 'a2', prerequisites: ['a1'], npc_affinity: [] },
      ],
      npcs: [{ id: 'n1' }],
    });
    expect(issues).toHaveLength(0);
  });

  it('erkennt doppelte Aktions-IDs (error)', () => {
    const issues = validateReferences({
      actions: [{ id: 'dup' }, { id: 'dup' }],
      npcs: [],
    });
    expect(issues.some(i => i.code === 'duplicate_action_id' && i.severity === 'error')).toBe(true);
  });

  it('erkennt tote Prerequisites/Unlocks/Affinitäten', () => {
    const issues = validateReferences({
      actions: [{ id: 'a1', prerequisites: ['ghost'], unlocks: ['phantom'], npc_affinity: ['nobody'] }],
      npcs: [{ id: 'real' }],
    });
    expect(issues.some(i => i.code === 'dead_prerequisite')).toBe(true);
    expect(issues.some(i => i.code === 'dead_unlock')).toBe(true);
    expect(issues.some(i => i.code === 'dead_npc_affinity')).toBe(true);
  });

  it('erkennt tote Episoden-Referenzen (B1-Schema)', () => {
    const issues = validateReferences({
      actions: [{ id: 'a1' }],
      npcs: [{ id: 'igor' }],
      targets: [{ id: 't_real' }],
      methods: [{ id: 'm_real' }],
      episodes: [
        {
          id: 'ep1',
          beteiligte: { ziel: 't_ghost', anbieter_npc: 'unknown', stimmen_npc: ['igor', 'phantom'] },
          einklink_aktionen: ['a1', 'a_ghost'],
          lernmoment_id: 'm_ghost',
        },
      ],
    });
    expect(issues.some(i => i.code === 'episode_dead_target')).toBe(true);
    expect(issues.some(i => i.code === 'episode_dead_npc')).toBe(true);
    expect(issues.some(i => i.code === 'episode_dead_action')).toBe(true);
    expect(issues.some(i => i.code === 'episode_dead_method')).toBe(true);
  });
});

describe('IdValidator — reale Spieldaten', () => {
  it('hat keine Fehler und keine toten Referenzen', () => {
    const issues = getDataIntegrityIssues();
    const errors = issues.filter(i => i.severity === 'error');
    const warnings = issues.filter(i => i.severity === 'warning');
    // Sollte heute komplett sauber sein (125 Aktionen, 5 NPCs, alle Refs aufgehend).
    expect(errors).toHaveLength(0);
    expect(warnings).toHaveLength(0);
  });
});
