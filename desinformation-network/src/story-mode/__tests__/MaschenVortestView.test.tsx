/**
 * MaschenVortestView (Redesign Phase 3): Karten-Picker + geführte Stichprobe → Prognose je
 * Resonanzgruppe (Stempel/Stöße, NIE Prozente). runVortest wird gestubbt, damit die UI isoliert
 * von der Live-Engine prüfbar ist. „Nur Stempel/Stöße" (Owner-Entscheid) wird mitgeprüft.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MaschenVortestView } from '../components/MaschenVortestView';
import type { GruppeInfo } from '../components/MaschenVortestView';
import type { MascheKarte, MaschenVortestResult, PersonaLite, SegmentVortest } from '../audience/maschenVortest';

const MASCHEN: MascheKarte[] = [
  { id: '11.4', label_de: 'Ein Gerücht aussetzen', botschaft_de: 'Man hört, im Rathaus sei die Liste längst geschrieben.', headline_de: 'Gerücht in Umlauf gebracht', familieLabel: 'Gerüchte-Ökologie', themen: ['anti_establishment'], kanal: 'tv' },
  { id: '11.7', label_de: 'Debatten-Erschöpfung', botschaft_de: 'Bringt doch eh nichts.', headline_de: 'Stimmung gesetzt', familieLabel: 'Zermürbung', themen: ['abstiegs_angst'], kanal: 'tv' },
];

const GRUPPEN: GruppeInfo[] = [
  { id: 'wu_zorniger', label_de: 'Die Abgehängten', size: 0.18 },
  { id: 'wu_besorgte_mitte', label_de: 'Die verunsicherte Mitte', size: 0.2 },
  { id: 'wu_liberale', label_de: 'Die Aufgeklärten', size: 0.12 },
];

const PERSONAS: PersonaLite[] = [
  { name: 'Doreen', segmentId: 'zorniger' },
  { name: 'Dr. Hofer', segmentId: 'liberale' },
];

const seg = (over: Partial<SegmentVortest> & { segmentId: string; label_de: string }): SegmentVortest => ({
  reached: true, resonanz: 1, gewicht: 0.3, stempel: 'frisch', geimpft: false,
  wirkung: 1, wittert: false, kippNah: false, stoesseBisFahne: 2, ...over,
});

const RESULT: MaschenVortestResult = {
  familieId: 'rumor_ecology',
  familieLabel: 'Gerüchte-Ökologie',
  segmente: [
    seg({ segmentId: 'wu_zorniger', label_de: 'Die Abgehängten', stempel: 'frisch', wirkung: 0.9, kippNah: true, stoesseBisFahne: 2 }),
    seg({ segmentId: 'wu_liberale', label_de: 'Die Aufgeklärten', stempel: 'verbrannt', wirkung: 0.1, wittert: true, geimpft: false, gewicht: 0.4 }),
    seg({ segmentId: 'wu_besorgte_mitte', label_de: 'Die verunsicherte Mitte', reached: false, resonanz: 0, wirkung: 0, gewicht: 0 }),
  ],
  predictedReception: 0.6,
  trueReception: 0.4,
  sampleBias: 0.2,
  representativeness: 0.5,
  warning: 'Einseitige Stichprobe: überwiegend empfängliche Gruppen befragt.',
  einwand_de: 'Wer ist die Quelle? Ein „man hört" ist kein Beleg.',
  einwandReife: { einsaetze: 2, patchBei: 3 },
};

function renderView(over: Partial<React.ComponentProps<typeof MaschenVortestView>> = {}) {
  const props = {
    maschen: MASCHEN,
    gruppen: GRUPPEN,
    personas: PERSONAS,
    budget: 100,
    cost: 8,
    allowFreeSample: false,
    runVortest: vi.fn(() => RESULT),
    onCommission: vi.fn(),
    onLaunchMasche: vi.fn(),
    onClose: vi.fn(),
    ...over,
  };
  render(<MaschenVortestView {...props} />);
  return props;
}

describe('MaschenVortestView', () => {
  it('Masche wählen → beauftragen → Prognose je Gruppe (Stempel + Kipp-Stöße)', async () => {
    const user = userEvent.setup();
    const props = renderView();

    // Vor der Auswahl ist die Beauftragung gesperrt.
    expect((screen.getByTestId('mv-commission') as HTMLButtonElement).disabled).toBe(true);
    await user.click(screen.getByTestId('mv-masche-11.4'));
    expect((screen.getByTestId('mv-commission') as HTMLButtonElement).disabled).toBe(false);

    await user.click(screen.getByTestId('mv-commission'));
    expect(props.onCommission).toHaveBeenCalledOnce();
    expect(props.runVortest).toHaveBeenCalledWith('11.4', ['wu_zorniger', 'wu_besorgte_mitte', 'wu_liberale']);

    // Ergebnis: Prognose-Tabelle, Stempel, Kipp-Nähe qualitativ.
    expect(screen.getByTestId('mv-prognose')).toBeTruthy();
    expect(screen.getByTestId('mv-stempel-wu_zorniger').textContent).toMatch(/FRISCH/);
    expect(screen.getByTestId('mv-stempel-wu_liberale').textContent).toMatch(/VERBRANNT/);
    expect(screen.getByTestId('mv-kipp-wu_zorniger').textContent).toMatch(/noch 2 Stöße/);
    // Nicht erreichte Gruppe ohne Wirkung wird als solche markiert.
    expect(screen.getByTestId('mv-stempel-wu_besorgte_mitte').textContent).toMatch(/nicht erreicht/);
  });

  it('zeigt Sample-Bias-Warnung + versteckten Einwand + Persona-Stimmen', async () => {
    const user = userEvent.setup();
    renderView();
    await user.click(screen.getByTestId('mv-masche-11.4'));
    await user.click(screen.getByTestId('mv-commission'));

    expect(screen.getByTestId('mv-warning').textContent).toMatch(/Einseitige Stichprobe/);
    expect(screen.getByTestId('mv-einwand').textContent).toMatch(/Quelle/);
    expect(screen.getByTestId('mv-einwand').textContent).toMatch(/schon 2× gelaufen/);
    // §6: das Motiv kippt frisch↔verbrannt.
    const stimmen = screen.getByTestId('mv-stimmen');
    expect(within(stimmen).getByText(/alle spüren/)).toBeTruthy();
    expect(within(stimmen).getByText(/immer dieselbe Masche/)).toBeTruthy();
  });

  it('„nie die Matrix als Zahl": das Wirkungs-Barometer trägt keine Prozente', async () => {
    const user = userEvent.setup();
    renderView();
    await user.click(screen.getByTestId('mv-masche-11.4'));
    await user.click(screen.getByTestId('mv-commission'));
    expect(screen.getByTestId('mv-barometer').textContent).not.toMatch(/%/);
    expect(screen.getByTestId('mv-bias').textContent).toMatch(/schmeichelt/);
  });

  it('MASCHE STARTEN reiht genau die getestete Aktion ein', async () => {
    const user = userEvent.setup();
    const props = renderView();
    await user.click(screen.getByTestId('mv-masche-11.7'));
    await user.click(screen.getByTestId('mv-commission'));
    await user.click(screen.getByTestId('mv-launch'));
    expect(props.onLaunchMasche).toHaveBeenCalledWith('11.7');
  });

  it('Budget zu niedrig → Beauftragung gesperrt + Hinweis', () => {
    renderView({ budget: 1, cost: 8 });
    expect((screen.getByTestId('mv-commission') as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByTestId('mv-unaffordable')).toBeTruthy();
  });

  it('geführte Stichprobe ist Standard, Profi-Auswahl gesperrt (Gate = Phase)', () => {
    renderView({ allowFreeSample: false });
    expect(screen.getByTestId('mv-profi-locked')).toBeTruthy();
    expect(screen.queryByTestId('mv-profi-toggle')).toBeNull();
    // Im geführten Modus sind die Gruppen-Kacheln nicht abwählbar.
    expect((screen.getByTestId('mv-gruppe-wu_zorniger') as HTMLButtonElement).disabled).toBe(true);
  });

  it('freigeschaltete Profi-Schublade lässt die Stichprobe zuschneiden', async () => {
    const user = userEvent.setup();
    const props = renderView({ allowFreeSample: true });
    await user.click(screen.getByTestId('mv-profi-toggle'));
    // Jetzt abwählbar: die verunsicherte Mitte raus → Stichprobe schrumpft.
    await user.click(screen.getByTestId('mv-gruppe-wu_besorgte_mitte'));
    await user.click(screen.getByTestId('mv-masche-11.4'));
    await user.click(screen.getByTestId('mv-commission'));
    expect(props.runVortest).toHaveBeenCalledWith('11.4', ['wu_zorniger', 'wu_liberale']);
  });
});
