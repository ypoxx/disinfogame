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

// ─── Kampagnen-Schmiede: Matrix + Empfehlungen (Brücke Analyse → Tat) ──────────

import type { Target, Carrier, Platform } from '../battlefield/BattlefieldChain';
import type { SegmentInfo, CampaignSeed } from '../audience/kampagnenSchmiede';

const SEGMENTS: SegmentInfo[] = [
  { id: 'wu_optimiererin', label_de: 'Die Optimierer', milieu: 'performer', size: 0.1, belief: 0.2 },
  { id: 'wu_besorgte_mitte', label_de: 'Die besorgte Mitte', milieu: 'buergerlich', size: 0.2, belief: 0.3 },
  { id: 'wu_zorniger', label_de: 'Die Abgehängten', milieu: 'prekaer', size: 0.12, belief: 0.5 },
];
const TARGETS: Target[] = [
  { id: 't_mitte', name: 'Rolf Veen', role_de: 'Hinterbänkler', milieu: 'wu_besorgte_mitte', fiktiv: true, standing: 0.5, vulnerabilities: [{ id: 'schulden', label_de: 'Spielschulden', heikelheit: 0.7, glaubwuerdigkeit: 0.7 }] },
];
const CARRIERS: Carrier[] = [
  { id: 'c_mitte', label_de: 'Frontmedium', reach: 0.8, credibility: 0.55, exposure: 0.7, milieus: ['wu_besorgte_mitte'], buildCost: { budget: 22, capacity: 3, phases: 2 } },
  { id: 'c_none', label_de: 'Bot-Netz', reach: 0.9, credibility: 0.15, exposure: 0.85, milieus: [], buildCost: { budget: 12, capacity: 2, phases: 1 } },
];
const PLATFORMS: Platform[] = [
  { id: 'p_mitte', label_de: 'Video', reach: 0.75, decay: 0.4, moderation: 0.5, milieus: ['wu_besorgte_mitte'] },
];

describe('FokusgruppePreTest — Kampagnen-Schmiede', () => {
  it('Ergebnis zeigt Wirkungs-Matrix + Empfehlungen; „Kampagne starten" liefert den Seed', async () => {
    const user = userEvent.setup();
    const onLaunch = vi.fn<(seed: CampaignSeed) => void>();
    render(
      <FokusgruppePreTest
        personas={POP}
        budget={100}
        onCommission={() => {}}
        segments={SEGMENTS}
        targets={TARGETS}
        carriers={CARRIERS}
        platforms={PLATFORMS}
        onLaunchCampaign={onLaunch}
        onClose={() => {}}
      />,
    );
    await user.click(screen.getByTestId('pretest-commission')); // Default-Stichprobe = alle Milieus

    // Baustein 2: Matrix ist da, ein Sweet Spot der Mitte (fear +80).
    expect(screen.getByTestId('pretest-matrix')).toBeTruthy();
    expect(screen.getByTestId('matrix-cell-fear-wu_besorgte_mitte').textContent).toBe('+80');

    // Baustein 1: Empfehlung für die Mitte mit vorbefülltem Ziel → Klick reicht den Seed durch.
    expect(screen.getByTestId('pretest-empfehlungen')).toBeTruthy();
    await user.click(screen.getByTestId('pretest-launch-wu_besorgte_mitte'));
    expect(onLaunch).toHaveBeenCalledOnce();
    const seed = onLaunch.mock.calls[0][0];
    expect(seed.targetId).toBe('t_mitte');
    expect(seed.carrierId).toBe('c_mitte');
    expect(seed.platformIds).toContain('p_mitte');
    expect(seed.analysis.segmentId).toBe('wu_besorgte_mitte');
    expect(seed.analysis.appeal).toBe('fear');
  });

  it('ohne Rosters/Callback: keine Empfehlungen (rückwärtskompatibel)', async () => {
    const user = userEvent.setup();
    render(<FokusgruppePreTest personas={POP} budget={100} onCommission={() => {}} onClose={() => {}} />);
    await user.click(screen.getByTestId('pretest-commission'));
    expect(screen.queryByTestId('pretest-empfehlungen')).toBeNull();
    // Matrix funktioniert auch ohne Rosters (nur Personas + Stichprobe).
    expect(screen.getByTestId('pretest-matrix')).toBeTruthy();
    // Ohne dossier-Prop kein Dossier (rückwärtskompatibel).
    expect(screen.queryByTestId('pretest-dossier')).toBeNull();
  });
});

// ─── Erkenntnis-Dossier: Befunde sammeln + Arcs ───────────────────────────────

import type { Erkenntnis } from '../audience/dossierModel';

describe('FokusgruppePreTest — Erkenntnis-Dossier', () => {
  it('meldet Befunde bei Beauftragung + zeigt Dossier mit Zwei-Fronten-Arc', async () => {
    const user = userEvent.setup();
    const onRecord = vi.fn<(f: Erkenntnis[]) => void>();
    render(
      <FokusgruppePreTest
        personas={POP}
        budget={100}
        onCommission={() => {}}
        segments={SEGMENTS}
        dossier={[]}
        phase={2}
        onRecordFindings={onRecord}
        onClose={() => {}}
      />,
    );
    await user.click(screen.getByTestId('pretest-commission')); // Default = alle Milieus

    // Befunde ans Dossier gemeldet (Sweet Spots: hope@optimiererin, fear@mitte, anger@zorniger).
    expect(onRecord).toHaveBeenCalledOnce();
    const found = onRecord.mock.calls[0][0];
    // opt hat trust 0.4 == Schwelle → zählt ebenfalls als Sweet Spot.
    expect(found.map((f) => f.id).sort()).toEqual([
      'anger_wu_zorniger',
      'fear_wu_besorgte_mitte',
      'hope_wu_optimiererin',
      'trust_wu_optimiererin',
    ]);
    expect(found.every((f) => f.phase === 2)).toBe(true);

    // Dossier-Sektion sichtbar; drei Sweet Spots ergeben einen Zwei-Fronten-Arc.
    expect(screen.getByTestId('pretest-dossier')).toBeTruthy();
    expect(screen.getByTestId('pretest-arc-zwei_fronten')).toBeTruthy();
  });
});
