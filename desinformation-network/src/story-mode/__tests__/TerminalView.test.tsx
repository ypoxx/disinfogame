/**
 * TerminalView (L2 „Herzstück 1"): Die Eingangstür zeigt die KURATIERTE Auswahl
 * (M2), das ARCHIV den vollen Katalog mit Filtern; M1-Stempel erscheinen auf den
 * Vorgangsblättern; AUSFÜHREN/ANHEFTEN reichen an die Handler durch; der
 * Scanline-Layer ist separat und abschaltbar (Memo §2.6).
 */
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import { TerminalView } from '../components/TerminalView';
import type { StoryAction, MaschenVorschau } from '../components/ActionPanel';

const mkAction = (id: string, over: Partial<StoryAction> = {}): StoryAction => ({
  id,
  phase: 'ta01',
  label_de: `Vorgang ${id}`,
  costs: { budget: 10, capacity: 1 },
  npc_affinity: [],
  legality: 'legal',
  tags: [],
  isUnlocked: true,
  isUsed: false,
  ...over,
});

// 12 Aktionen ⇒ Tür zeigt 8, Archiv alle 12.
const ACTIONS = Array.from({ length: 12 }, (_, i) => mkAction(`a${i}`));
const RES = { budget: 100, capacity: 10, actionPoints: 2 };

const renderTerminal = (over: Partial<Parameters<typeof TerminalView>[0]> = {}) =>
  render(
    <TerminalView
      actions={ACTIONS}
      availableResources={RES}
      onExecuteAction={vi.fn()}
      onClose={vi.fn()}
      {...over}
    />,
  );

afterEach(cleanup);

describe('TerminalView (L2)', () => {
  it('Tür zeigt kuratierte 8, ARCHIV öffnet den vollen Katalog', () => {
    const { container, getByText } = renderTerminal();
    expect(container.querySelectorAll('[data-testid="terminal-view"]').length).toBe(1);
    // Tür: 8 Vorgangsblätter (Deckel), Vorgang a8..a11 fehlen.
    expect(getByText('Vorgang a0')).toBeTruthy();
    expect(container.textContent).not.toContain('Vorgang a11');
    // Schublade auf:
    fireEvent.click(getByText(/ARCHIV \(12\)/));
    expect(container.textContent).toContain('Vorgang a11');
  });

  it('M2-Rangfolge: Strang-Vorgang steht in der Tür vorn und trägt den STRANG-Stempel', () => {
    const { container } = renderTerminal({ episodeActionIds: ['a7'] });
    const text = container.textContent ?? '';
    expect(text.indexOf('Vorgang a7')).toBeGreaterThan(-1);
    expect(text.indexOf('Vorgang a7')).toBeLessThan(text.indexOf('Vorgang a0'));
    expect(text).toContain('● STRANG');
  });

  it('M1: Frische-Stempel je Ziel-Milieu erscheinen auf dem Vorgangsblatt', () => {
    const vorschau: MaschenVorschau = {
      familieId: 'f1',
      familieLabel: 'Emotionalisierung',
      stempel: [{ milieuId: 'm1', milieuLabel: 'Stadtmilieu', stempel: 'verbrannt' }],
      multiplikator: 0.3,
    };
    const { container } = renderTerminal({ getMaschenVorschau: () => vorschau });
    expect(container.textContent).toContain('MASCHE: Emotionalisierung');
    expect(container.textContent).toContain('Stadtmilieu: VERBRANNT');
    // E6: Der Multiplikator (0,3) darf NIE als Zahl auftauchen.
    expect(container.textContent).not.toContain('0.3');
  });

  it('AUSFÜHREN und ANHEFTEN reichen die Aktions-Id durch', () => {
    const onExecuteAction = vi.fn();
    const onAddToQueue = vi.fn();
    const { getAllByText } = renderTerminal({ onExecuteAction, onAddToQueue });
    fireEvent.click(getAllByText('AUSFÜHREN')[0]);
    expect(onExecuteAction).toHaveBeenCalledWith('a0');
    fireEvent.click(getAllByText('+ ANHEFTEN')[1]);
    expect(onAddToQueue).toHaveBeenCalledWith('a1');
  });

  it('Berater-Sprung: liegt die Aktion nicht in der Tür, öffnet das ARCHIV direkt', () => {
    const { container } = renderTerminal({ highlightActionId: 'a11' });
    expect(container.textContent).toContain('Vorgang a11');
    expect(container.textContent).toContain('vollständiger Maßnahmen-Katalog');
  });

  it('ARCHIV-Filter: GRAUZONE zeigt nur graue Vorgänge; Suche filtert nach Label', () => {
    const actions = [
      mkAction('leg', { legality: 'legal', label_de: 'Plakatkampagne' }),
      mkAction('grau', { legality: 'grey', label_de: 'Gerücht streuen' }),
    ];
    const { container, getByText, getByLabelText } = renderTerminal({ actions });
    fireEvent.click(getByText(/ARCHIV \(2\)/));
    fireEvent.click(getByText('GRAUZONE'));
    expect(container.textContent).toContain('Gerücht streuen');
    expect(container.textContent).not.toContain('Plakatkampagne');
    fireEvent.click(getByText('ALLE'));
    fireEvent.change(getByLabelText('Vorgänge durchsuchen'), { target: { value: 'plakat' } });
    expect(container.textContent).toContain('Plakatkampagne');
    expect(container.textContent).not.toContain('Gerücht streuen');
  });

  it('Porträt-Zeile: Zuträger-Filter zeigt nur Vorgänge mit dieser NPC-Affinität', () => {
    const actions = [
      mkAction('mit_katja', { npc_affinity: ['katja'], label_de: 'Feldbericht fälschen' }),
      mkAction('ohne', { label_de: 'Plakatkampagne' }),
    ];
    const { container, getByText, getByLabelText } = renderTerminal({ actions });
    fireEvent.click(getByText(/ARCHIV \(2\)/));
    fireEvent.click(getByLabelText('Nach katja filtern'));
    expect(container.textContent).toContain('Feldbericht fälschen');
    expect(container.textContent).not.toContain('Plakatkampagne');
    // Zweiter Klick hebt den Filter wieder auf.
    fireEvent.click(getByLabelText('Nach katja filtern'));
    expect(container.textContent).toContain('Plakatkampagne');
  });

  it('Memo §2.6: Scanline-Layer ist separat, pointer-events-frei und abschaltbar', () => {
    const { container, getByTitle } = renderTerminal();
    const layer = container.querySelector('[data-testid="terminal-scanlines"]') as HTMLElement;
    expect(layer).toBeTruthy();
    expect(layer.style.pointerEvents).toBe('none');
    fireEvent.click(getByTitle(/Scanline-Layer/));
    expect(container.querySelector('[data-testid="terminal-scanlines"]')).toBeNull();
  });

  it('Escape schließt das Terminal', () => {
    const onClose = vi.fn();
    renderTerminal({ onClose });
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('ohne Aktionspunkte meldet die Systemzeile PHASE BEENDEN', () => {
    const { container } = renderTerminal({ availableResources: { ...RES, actionPoints: 0 } });
    expect(container.textContent).toContain('KEINE AKTIONSPUNKTE');
  });
});
