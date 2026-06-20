import { describe, it, expect } from 'vitest';
import { previewSocietyDeltas } from '../components/ActionPanel';

/**
 * S0 / M1 (Lesbarkeit am Entscheidungspunkt): Die Planungskarte zeigt die
 * Gesellschaftswert-Wirkung VOR dem Klick. Dieser Test pinnt das Versprechen:
 * aggressive Phänomen-Aktionen liefern eine sichtbare Vorschau, reine Analyse nicht.
 */
describe('previewSocietyDeltas (Wirkungs-Vorschau)', () => {
  it('liefert für eine Überflutungs-Aktion eine sichtbare Informationslast-Verschiebung', () => {
    const preview = previewSocietyDeltas({ flooding: 0.6, impact_scale: 'medium' }, 'grey');
    expect(preview.length).toBeGreaterThan(0);
    const last = preview.find(d => d.key === 'informationslast');
    expect(last).toBeDefined();
    expect(last!.value).toBeGreaterThan(0);
  });

  it('liefert für eine Loyalitätsfalle eine Polarisierungs-Verschiebung (▲)', () => {
    const preview = previewSocietyDeltas({ loyalty_trap: 0.5 }, 'grey');
    const pol = preview.find(d => d.key === 'polarisierung');
    expect(pol).toBeDefined();
    expect(pol!.value).toBeGreaterThan(0);
  });

  it('gibt für reine Analyse (keine Effekt-Keys) nichts aus — kein Rauschen', () => {
    expect(previewSocietyDeltas(undefined, 'legal')).toEqual([]);
    expect(previewSocietyDeltas({}, 'legal')).toEqual([]);
  });

  it('begrenzt auf die drei stärksten Verschiebungen (Betrag absteigend)', () => {
    const preview = previewSocietyDeltas(
      { flooding: 0.8, loyalty_trap: 0.7, memory_conflict: 0.6, emotional_impact: 0.5 },
      'illegal',
    );
    expect(preview.length).toBeLessThanOrEqual(3);
    for (let i = 1; i < preview.length; i++) {
      expect(Math.abs(preview[i - 1].value)).toBeGreaterThanOrEqual(Math.abs(preview[i].value));
    }
  });
});
