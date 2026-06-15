/**
 * FokusgruppePreTest: Beauftragung → Pre-Test-Ergebnis inkl. Sample-Bias-Warnung.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FokusgruppePreTest } from '../components/FokusgruppePreTest';
import personasJson from '../data/personas.json';
import type { Persona } from '../audience/fokusgruppeModel';

const POP = personasJson.personas as unknown as Persona[];

describe('FokusgruppePreTest', () => {
  it('einseitige Stichprobe (nur der Optimist) → Bias-Warnung + onCommission', async () => {
    const user = userEvent.setup();
    const onCommission = vi.fn();
    render(<FokusgruppePreTest personas={POP} onCommission={onCommission} onClose={() => {}} />);
    // Default-Stichprobe = alle; Walter + Doreen abwählen → nur Lena (Optimistin) bleibt.
    await user.click(screen.getByTestId('pretest-sample-walter'));
    await user.click(screen.getByTestId('pretest-sample-doreen'));
    await user.click(screen.getByTestId('pretest-commission'));

    expect(onCommission).toHaveBeenCalledOnce();
    const warning = screen.getByTestId('pretest-warning');
    expect(warning.textContent).toMatch(/bestätigt vor allem Sie selbst/);
  });

  it('repräsentative Stichprobe (alle) → keine Warnung, Reaktionskarte je Persona', async () => {
    const user = userEvent.setup();
    render(<FokusgruppePreTest personas={POP} onCommission={() => {}} onClose={() => {}} />);
    await user.click(screen.getByTestId('pretest-commission')); // Default = alle Milieus

    expect(screen.queryByTestId('pretest-warning')).toBeNull();
    expect(screen.getByTestId('pretest-reaction-lena')).toBeTruthy();
    expect(screen.getByTestId('pretest-reaction-walter')).toBeTruthy();
    expect(screen.getByTestId('pretest-reaction-doreen')).toBeTruthy();
  });
});
