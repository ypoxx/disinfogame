/**
 * T1 „Die Tafel wird wahr" (KONZEPT 2026-07-07): Spuren = aktive Episoden-Stränge.
 * Prüft die pure Karten-Zuordnung (einklink_aktionen statt index-Rotation), das
 * Strang-Rendering (Titel, Wendung, Stummel), den Deck-Auszug (kein Katalog mehr,
 * nur der Terminal-Sprung) und dass die alten Füllwerte (99 Phasen, K40) weg sind.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NarrativeBoard, verteileKarten, type BoardStrand } from '../components/NarrativeBoard';
import { DayReport } from '../components/DayReport';
import { istPlanLeistbar } from '../utils/queueAffordability';
import type { QueuedAction } from '../hooks/useStoryGameState';

function karte(id: string, actionId: string): QueuedAction {
  return { id, actionId, label: `Karte ${actionId}`, costs: { budget: 5, actionPoints: 1 }, legality: 'grey' };
}

const STRAENGE: BoardStrand[] = [
  { id: 'ep_bruecke', titel: 'Die Brücke, die zweimal steht', wendung: 'Öl ins Feuer — oder nur den Riss zeigen?', aktionen: ['11.13', '11.14', '7.2'], erledigt: ['11.13'] },
  { id: 'ep_ferro', titel: 'Frau Ferro hat Feierabend gemacht', wendung: 'Müder machen statt widerlegen?', aktionen: ['11.2', '11.3'], erledigt: [] },
];

describe('verteileKarten — Zuordnung über einklink_aktionen (keine Rotation)', () => {
  it('hängt Karten an die Spur ihres Strangs, Rest ans Tagesgeschäft', () => {
    const queue = [karte('q1', '11.14'), karte('q2', '5.8'), karte('q3', '11.2')];
    const v = verteileKarten(queue, STRAENGE);
    expect(v.byStrand.get('ep_bruecke')!.map((q) => q.id)).toEqual(['q1']);
    expect(v.byStrand.get('ep_ferro')!.map((q) => q.id)).toEqual(['q3']);
    expect(v.tagesgeschaeft.map((q) => q.id)).toEqual(['q2']);
  });

  it('ist bei Aktionen in mehreren Strängen deterministisch (erster Strang gewinnt)', () => {
    const doppelt: BoardStrand[] = [
      { ...STRAENGE[0], aktionen: ['x.1'] },
      { ...STRAENGE[1], aktionen: ['x.1'] },
    ];
    const v = verteileKarten([karte('q1', 'x.1')], doppelt);
    expect(v.byStrand.get('ep_bruecke')!).toHaveLength(1);
    expect(v.byStrand.get('ep_ferro')!).toHaveLength(0);
  });

  it('legt ohne Stränge alles ins Tagesgeschäft', () => {
    const v = verteileKarten([karte('q1', '11.13')], []);
    expect(v.tagesgeschaeft).toHaveLength(1);
  });
});

function renderBoard(over: Partial<React.ComponentProps<typeof NarrativeBoard>> = {}) {
  const props: React.ComponentProps<typeof NarrativeBoard> = {
    objectives: [],
    strands: STRAENGE,
    windows: [{ id: 'w1', name: 'Wahl-Fenster', hint: 'Empörung verfängt doppelt', expiresIn: 2 }],
    queue: [karte('q1', '11.14'), karte('q2', '5.8')],
    resources: { budget: 100, capacity: 10, actionPoints: 5 },
    onUnpin: () => {},
    onPlay: () => {},
    onClear: () => {},
    onOpenTerminal: () => {},
    onClose: () => {},
    ...over,
  };
  return render(<NarrativeBoard {...props} />);
}

describe('NarrativeBoard — Spur = Strang', () => {
  it('zeigt je Strang Titel, Wendung und zählbaren Stummel-Fortschritt', () => {
    renderBoard();
    expect(screen.getByText(/Die Brücke, die zweimal steht/)).toBeInTheDocument();
    expect(screen.getByText('Öl ins Feuer — oder nur den Riss zeigen?')).toBeInTheDocument();
    // ep_bruecke: 1 von 3 gesendet — Stummel + Zähler.
    expect(screen.getByText('1/3')).toBeInTheDocument();
    expect(screen.getByText('0/2')).toBeInTheDocument();
    expect(screen.getAllByLabelText('Sendung ausgespielt')).toHaveLength(1);
    expect(screen.getAllByLabelText('Sendung offen')).toHaveLength(4);
  });

  it('hängt die Karte an ihre Strang-Spur, freie Karten ans Tagesgeschäft', () => {
    renderBoard();
    const strangLane = screen.getByTestId('lane-strand-ep_bruecke');
    expect(strangLane.textContent).toContain('Karte 11.14');
    const tagesLane = screen.getByTestId('lane-tagesgeschaeft');
    expect(tagesLane.textContent).toContain('Karte 5.8');
  });

  it('führt kein Karten-Deck mehr — nur den Sprung ins Terminal (§4.1)', () => {
    const onOpenTerminal = vi.fn();
    renderBoard({ onOpenTerminal });
    expect(screen.queryByText(/MASSNAHMEN — je Büro/)).not.toBeInTheDocument();
    expect(screen.queryByText('ANHEFTEN')).not.toBeInTheDocument();
    expect(screen.queryByText('SOFORT')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText(/TERMINAL \(A\)/));
    expect(onOpenTerminal).toHaveBeenCalledTimes(1);
  });

  it('zeigt echte Verfallsdaten statt Füllwerten (kein „99 Phasen", kein K40)', () => {
    renderBoard();
    expect(screen.getByText('läuft ab in 2 Tagen')).toBeInTheDocument();
    expect(screen.queryByText(/99/)).not.toBeInTheDocument();
    expect(screen.queryByText(/K40/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Gebäude-Wachstum/)).not.toBeInTheDocument();
  });

  it('erklärt das leere Brett, statt leere Buchstaben-Spuren zu zeigen', () => {
    renderBoard({ strands: [], queue: [], windows: [] });
    expect(screen.getByText(/Noch kein Strang auf dem Brett/)).toBeInTheDocument();
    expect(screen.queryByText('SPUR A')).not.toBeInTheDocument();
    expect(screen.getByText(/Maßnahmen wählst du am Terminal \(A\)/)).toBeInTheDocument();
  });

  it('sperrt AUSSPIELEN, wenn der Plan die Ressourcen überzieht', () => {
    const onPlay = vi.fn();
    renderBoard({ resources: { budget: 1, capacity: 10, actionPoints: 5 }, onPlay });
    fireEvent.click(screen.getByText('AUSSPIELEN ▸'));
    expect(onPlay).not.toHaveBeenCalled();
  });

  it('zeigt die Einzelkosten je angehefteter Karte (Plan trimmen braucht das)', () => {
    renderBoard();
    // karte(): budget 5, 1 AP — beide Chips an der Karte sichtbar (2 Karten in der Queue).
    expect(screen.getAllByText('5K')).toHaveLength(2);
    expect(screen.getAllByText('1 AP')).toHaveLength(2);
  });
});

describe('NarrativeBoard — Kapazität, Akt & Fenster-Zettel (T2–T4)', () => {
  it('zeigt freie Spuren und die gesperrte dritte Spur (F-B: Akt 3 statt K40)', () => {
    renderBoard({ strands: [STRAENGE[0]], queue: [] });
    expect(screen.getAllByTestId('lane-frei')).toHaveLength(1);
    expect(screen.getByTestId('lane-gesperrt').textContent).toContain('Akt 3');
  });

  it('blendet die Sperr-Zeile aus, sobald drei Spuren genehmigt sind', () => {
    renderBoard({ slots: 3 });
    expect(screen.queryByTestId('lane-gesperrt')).not.toBeInTheDocument();
    // 2 Stränge aktiv + 1 freie Spur = volle Kapazität sichtbar.
    expect(screen.getAllByTestId('lane-frei')).toHaveLength(1);
  });

  it('zeigt Akt-Band und Sonntagsfrage-Zettel (T4)', () => {
    renderBoard({ akt: { nummer: 2, titel: 'Den Zweifel säen' }, naechsteSonntagsfrageIn: 3 });
    expect(screen.getByTestId('akt-band').textContent).toContain('AKT 2');
    expect(screen.getByText('Nächste Sonntagsfrage in 3 Tagen')).toBeInTheDocument();
  });

  it('Fenster-Zettel trägt den nächsten Schritt (Erbe des Floating-Widgets)', () => {
    renderBoard({
      windows: [{ id: 'w1', name: 'Wahl-Fenster', hint: 'Empörung verfängt doppelt', expiresIn: 2, nextAction: 'Bot-Netz aktivieren' }],
    });
    expect(screen.getByText(/Nächster Schritt: Bot-Netz aktivieren/)).toBeInTheDocument();
  });
});

describe('istPlanLeistbar — EIN Prädikat für Tafel-Gate und Chip-Warnung', () => {
  const res = { budget: 50, capacity: 10, actionPoints: 5 };
  const teuer = { ...karte('q1', 'x'), costs: { budget: 60, actionPoints: 1 } };
  const kredit = { ...karte('q2', 'y'), costs: { budget: -22, actionPoints: 1 } };

  it('prüft das Budget prefix-genau (Kredit zählt erst an seiner Position)', () => {
    expect(istPlanLeistbar([teuer, kredit], res)).toBe(false); // 50-60 → Minus vor dem Kredit
    expect(istPlanLeistbar([kredit, teuer], res)).toBe(true);  // 50+22-60 → nie im Minus
  });

  it('sperrt bei AP-Überziehung trotz passendem Budget', () => {
    const vielAp = { ...karte('q3', 'z'), costs: { budget: 1, actionPoints: 9 } };
    expect(istPlanLeistbar([vielAp], res)).toBe(false);
  });
});

describe('DayReport — „Die Stränge am Brett"', () => {
  function renderReport(straenge: { id: string; titel: string; done: number; total: number }[]) {
    return render(
      <DayReport
        phase={3}
        headline={null}
        tierLabel={null}
        audienceSegments={[]}
        counterHeadlines={[]}
        resources={{ risk: 10, budget: 100, attention: 5 }}
        trustProgress={0.4}
        straenge={straenge}
        onNextDay={() => {}}
      />,
    );
  }

  it('zeigt offenen Fortschritt und den Abschluss-Payoff', () => {
    renderReport([
      { id: 'ep_a', titel: 'Grenzstadt-Gerücht', done: 2, total: 3 },
      { id: 'ep_b', titel: 'Brücken-Streit', done: 2, total: 2 },
    ]);
    expect(screen.getByText(/Grenzstadt-Gerücht: 2\/3 — noch 1 Sendung/)).toBeInTheDocument();
    expect(screen.getByText(/Brücken-Streit: 2\/2 — ausgespielt ✓/)).toBeInTheDocument();
  });

  it('lässt den Block ohne Stränge weg', () => {
    renderReport([]);
    expect(screen.queryByTestId('straenge-row')).not.toBeInTheDocument();
  });
});
