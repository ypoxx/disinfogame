/**
 * FokusgruppePreTest: Beauftragung → Pre-Test-Ergebnis inkl. Sample-Bias-Warnung.
 * Nutzt eine kontrollierte 3-Personas-Fixture (kontrastierende Milieus), damit die
 * Bias-Logik deterministisch prüfbar ist — unabhängig von der vollen personas.json.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FokusgruppePreTest } from '../components/FokusgruppePreTest';
import type { Persona } from '../audience/fokusgruppeModel';

const POP: Persona[] = [
  { id: 'opt', name: 'Optimist', milieu: 'Optimisten', segmentId: 'optimiererin', bio: '', vulnerabilities: ['FOMO'], receptivity: { hope: 0.8, fear: 0, anger: -0.6, trust: 0.4 } },
  { id: 'worried', name: 'Besorgt', milieu: 'Mitte', segmentId: 'besorgte_mitte', bio: '', vulnerabilities: ['Abstiegsangst'], receptivity: { hope: -0.2, fear: 0.8, anger: 0.1, trust: -0.3 } },
  { id: 'angry', name: 'Wütend', milieu: 'Abgehängte', segmentId: 'zorniger', bio: '', vulnerabilities: ['Empörung'], receptivity: { hope: -0.7, fear: 0.2, anger: 0.9, trust: -0.8 } },
];

describe('FokusgruppePreTest', () => {
  it('einseitige Stichprobe (nur der Optimist) → Bias-Warnung + onCommission', async () => {
    const user = userEvent.setup();
    const onCommission = vi.fn();
    render(<FokusgruppePreTest personas={POP} budget={100} onCommission={onCommission} onClose={() => {}} />);
    // Default-Stichprobe = alle; Besorgt + Wütend abwählen → nur der Optimist bleibt.
    await user.click(screen.getByTestId('pretest-sample-worried'));
    await user.click(screen.getByTestId('pretest-sample-angry'));
    await user.click(screen.getByTestId('pretest-commission'));

    expect(onCommission).toHaveBeenCalledOnce();
    expect(screen.getByTestId('pretest-warning').textContent).toMatch(/bestätigt vor allem Sie selbst/);
  });

  it('repräsentative Stichprobe (alle) → keine Warnung, Reaktionskarte je Persona', async () => {
    const user = userEvent.setup();
    render(<FokusgruppePreTest personas={POP} budget={100} onCommission={() => {}} onClose={() => {}} />);
    await user.click(screen.getByTestId('pretest-commission')); // Default = alle Milieus

    expect(screen.queryByTestId('pretest-warning')).toBeNull();
    expect(screen.getByTestId('pretest-reaction-opt')).toBeTruthy();
    expect(screen.getByTestId('pretest-reaction-worried')).toBeTruthy();
    expect(screen.getByTestId('pretest-reaction-angry')).toBeTruthy();
  });

  it('Budget zu niedrig → Beauftragung gesperrt', () => {
    render(<FokusgruppePreTest personas={POP} budget={1} onCommission={() => {}} onClose={() => {}} />);
    expect((screen.getByTestId('pretest-commission') as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByTestId('pretest-unaffordable')).toBeTruthy();
  });
});
