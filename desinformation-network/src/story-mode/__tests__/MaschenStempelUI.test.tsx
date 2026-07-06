/**
 * Etappe 4 Paket D (E7): die Aktionskarte zeigt VOR dem Ausgeben einen Frische-
 * Stempel je Ziel-Milieu (FRISCH/BEKANNT/VERBRANNT). Dieser Test pinnt den
 * UI-Vertrag der optionalen `getMaschenVorschau`-Prop — NIE eine Multiplikator-
 * Zahl (E6), nichts rendern, wenn die Aktion keine Masche ist.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ActionCard, type StoryAction, type MaschenVorschau } from '../components/ActionCard';

function baseAction(overrides: Partial<StoryAction> = {}): StoryAction {
  return {
    id: 'a1',
    phase: 'ta05',
    label_de: 'Testaktion',
    costs: {},
    npc_affinity: [],
    legality: 'grey',
    tags: [],
    isUnlocked: true,
    isUsed: false,
    ...overrides,
  };
}

const vorschau: MaschenVorschau = {
  familieId: 'fam_emotionalisierung',
  familieLabel: 'Emotionalisierung',
  stempel: [
    { milieuId: 'wu_zorniger', milieuLabel: 'Der Zornige', stempel: 'frisch' },
    { milieuId: 'wu_macher', milieuLabel: 'Der Macher', stempel: 'bekannt' },
    { milieuId: 'wu_liberale', milieuLabel: 'Die Liberale', stempel: 'verbrannt' },
  ],
  multiplikator: 0.3,
};

describe('ActionCard — Maschen-Stempel (E7)', () => {
  it('rendert Stempel-Chips samt Familien-Label, wenn getMaschenVorschau eine Vorschau liefert', () => {
    render(
      <ActionCard
        action={baseAction()}
        canAfford
        onSelect={() => {}}
        getMaschenVorschau={() => vorschau}
      />,
    );
    expect(screen.getByText(/Emotionalisierung/)).toBeInTheDocument();
    expect(screen.getByText(/FRISCH/)).toBeInTheDocument();
    expect(screen.getByText(/BEKANNT/)).toBeInTheDocument();
    expect(screen.getByText(/VERBRANNT/)).toBeInTheDocument();
    // E6: die Matrix-Zahl (Multiplikator) darf nirgends als Zahl auftauchen.
    expect(screen.queryByText(/0[.,]3/)).not.toBeInTheDocument();
  });

  it('rendert keine Stempel-Zeile, wenn getMaschenVorschau null liefert (Aktion ist keine Masche)', () => {
    render(
      <ActionCard
        action={baseAction()}
        canAfford
        onSelect={() => {}}
        getMaschenVorschau={() => null}
      />,
    );
    expect(screen.queryByText(/FRISCH/)).not.toBeInTheDocument();
    expect(screen.queryByText(/BEKANNT/)).not.toBeInTheDocument();
    expect(screen.queryByText(/VERBRANNT/)).not.toBeInTheDocument();
  });

  it('bleibt ohne die Prop rückwärtskompatibel (kein Absturz, keine Stempel-Zeile)', () => {
    render(
      <ActionCard
        action={baseAction()}
        canAfford
        onSelect={() => {}}
      />,
    );
    expect(screen.queryByText(/FRISCH/)).not.toBeInTheDocument();
  });
});
