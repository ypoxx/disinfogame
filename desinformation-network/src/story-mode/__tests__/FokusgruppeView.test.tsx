/**
 * Tests für FokusgruppeView und exportierte Hilfsfunktionen.
 * Prüft: Persona-Filterung, Kommentar je Stimmung, Headline-Einbau, Rendering.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  FokusgruppeView,
  personaComment,
  personasForSegments,
  PERSONAS,
  type FokusgruppeSegmentInput,
} from '../components/FokusgruppeView';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

/** Segmente, die zu PERSONAS passen (besorgte Mitte + zorniger). */
const twoSegments: FokusgruppeSegmentInput[] = [
  {
    id: 'wu_besorgte_mitte',
    label_de: 'Die besorgte Mitte',
    milieu: 'buergerlich',
    mood: 'verunsichert',
    belief: 0.45,
  },
  {
    id: 'wu_zorniger',
    label_de: 'Die Abgehängten',
    milieu: 'prekaer',
    mood: 'wuetend',
    belief: 0.55,
  },
];

const allSixSegments: FokusgruppeSegmentInput[] = [
  { id: 'wu_besorgte_mitte', label_de: '', mood: 'ruhig', belief: 0.3 },
  { id: 'wu_zorniger',       label_de: '', mood: 'wuetend', belief: 0.5 },
  { id: 'wu_liberale',       label_de: '', mood: 'misstrauisch', belief: 0.2 },
  { id: 'wu_bohemien',       label_de: '', mood: 'misstrauisch', belief: 0.35 },
  { id: 'wu_eigenheimer',    label_de: '', mood: 'ruhig', belief: 0.3 },
  { id: 'wu_optimiererin',   label_de: '', mood: 'ruhig', belief: 0.2 },
];

const noopClose = vi.fn();

// ─── Tests: personasForSegments ───────────────────────────────────────────────

describe('personasForSegments', () => {
  it('gibt nur Personas zurueck, deren segmentId in der Liste ist', () => {
    const result = personasForSegments(['wu_besorgte_mitte', 'wu_zorniger']);
    expect(result.map((p) => p.segmentId)).toContain('wu_besorgte_mitte');
    expect(result.map((p) => p.segmentId)).toContain('wu_zorniger');
    // andere Personas muessen fehlen
    expect(result.map((p) => p.segmentId)).not.toContain('wu_liberale');
  });

  it('gibt alle 6 Personas zurueck, wenn alle segmentIds uebergeben werden', () => {
    const ids = PERSONAS.map((p) => p.segmentId);
    const result = personasForSegments(ids);
    expect(result).toHaveLength(PERSONAS.length);
  });

  it('gibt leeres Array zurueck, wenn keine IDs passen', () => {
    const result = personasForSegments(['wu_nicht_vorhanden', 'wu_auch_nicht']);
    expect(result).toHaveLength(0);
  });

  it('gibt leeres Array zurueck bei leerer Eingabe', () => {
    expect(personasForSegments([])).toHaveLength(0);
  });
});

// ─── Tests: personaComment ────────────────────────────────────────────────────

describe('personaComment', () => {
  const marlene = PERSONAS.find((p) => p.segmentId === 'wu_besorgte_mitte')!;
  const kevin   = PERSONAS.find((p) => p.segmentId === 'wu_zorniger')!;

  it('liefert unterschiedliche Texte fuer verschiedene Stimmungen', () => {
    const ruhig       = personaComment(marlene, 'ruhig', null);
    const verunsichert = personaComment(marlene, 'verunsichert', null);
    const wuetend     = personaComment(marlene, 'wuetend', null);
    const misstrauisch = personaComment(marlene, 'misstrauisch', null);
    // Alle vier muessen verschieden sein
    const all = [ruhig, verunsichert, wuetend, misstrauisch];
    const unique = new Set(all);
    expect(unique.size).toBe(4);
  });

  it('baut die Headline in den Kommentar ein (Platzhalter ersetzt)', () => {
    const headline = 'Energiepreise steigen dramatisch';
    const comment = personaComment(kevin, 'wuetend', headline);
    expect(comment).toContain(headline);
  });

  it('ersetzt Platzhalter auch ohne Headline durch Fallback-Text', () => {
    // Template mit {headline} darf bei null-Headline keinen rohen Platzhalter enthalten
    const comment = personaComment(marlene, 'verunsichert', null);
    expect(comment).not.toContain('{headline}');
  });

  it('faellt bei ungueiltiger Stimmung auf ruhig zurueck', () => {
    const commentFallback = personaComment(marlene, 'xyz_ungueltig', null);
    const commentRuhig    = personaComment(marlene, 'ruhig', null);
    expect(commentFallback).toBe(commentRuhig);
  });

  it('ist deterministisch (gleiche Eingabe → gleicher Text)', () => {
    const a = personaComment(marlene, 'wuetend', 'Test');
    const b = personaComment(marlene, 'wuetend', 'Test');
    expect(a).toBe(b);
  });
});

// ─── Tests: FokusgruppeView Rendering ────────────────────────────────────────

describe('FokusgruppeView', () => {
  it('rendert ohne Absturz (Smoke-Test)', () => {
    render(
      <FokusgruppeView
        segments={twoSegments}
        lastHeadline={null}
        onClose={noopClose}
      />,
    );
  });

  it('zeigt Kopfzeile FOKUSGRUPPE an', () => {
    render(
      <FokusgruppeView segments={twoSegments} lastHeadline={null} onClose={noopClose} />,
    );
    expect(screen.getByText('FOKUSGRUPPE')).toBeTruthy();
  });

  it('zeigt nur Personas fuer uebergebene Segmente (2 von 6)', () => {
    render(
      <FokusgruppeView segments={twoSegments} lastHeadline={null} onClose={noopClose} />,
    );
    // Marlene (besorgte Mitte) und Kevin (zorniger) muessen sichtbar sein
    expect(screen.getByTestId('fg-tile-wu_besorgte_mitte')).toBeTruthy();
    expect(screen.getByTestId('fg-tile-wu_zorniger')).toBeTruthy();
    // Dr. Hofer (liberale) darf NICHT erscheinen
    expect(screen.queryByTestId('fg-tile-wu_liberale')).toBeNull();
  });

  it('zeigt alle 6 Personas, wenn alle passenden Segmente uebergeben werden', () => {
    render(
      <FokusgruppeView segments={allSixSegments} lastHeadline={null} onClose={noopClose} />,
    );
    for (const p of PERSONAS) {
      expect(screen.getByTestId(`fg-tile-${p.segmentId}`)).toBeTruthy();
    }
  });

  it('zeigt Kommentar je Stimmung korrekt an (verunsichert vs wuetend unterschiedlich)', () => {
    render(
      <FokusgruppeView segments={twoSegments} lastHeadline={null} onClose={noopClose} />,
    );
    const commentMarlene = screen.getByTestId('fg-comment-wu_besorgte_mitte').textContent ?? '';
    const commentKevin   = screen.getByTestId('fg-comment-wu_zorniger').textContent ?? '';
    // Unterschiedliche Stimmungen → unterschiedliche Texte
    expect(commentMarlene).not.toBe(commentKevin);
    // Marlene ist verunsichert, Kevin wuetend — keine Platzhalter mehr
    expect(commentMarlene).not.toContain('{headline}');
    expect(commentKevin).not.toContain('{headline}');
  });

  it('baut lastHeadline in sichtbare Kommentare ein', () => {
    const headline = 'Sicherheitslücke im Stromnetz entdeckt';
    // verunsichert-Kommentar von Marlene enthält den Headline-Platzhalter
    render(
      <FokusgruppeView
        segments={[{ id: 'wu_besorgte_mitte', label_de: '', mood: 'verunsichert', belief: 0.4 }]}
        lastHeadline={headline}
        onClose={noopClose}
      />,
    );
    const comment = screen.getByTestId('fg-comment-wu_besorgte_mitte').textContent ?? '';
    expect(comment).toContain(headline);
  });

  it('zeigt lastHeadline als Badge in der Kopfzeile', () => {
    const headline = 'Ministerium startet neue Kampagne';
    render(
      <FokusgruppeView segments={twoSegments} lastHeadline={headline} onClose={noopClose} />,
    );
    // Badge-Text enthält die Headline (mit ⬢-Prefix)
    expect(screen.getByTitle(`Letzte Maßnahme: ${headline}`)).toBeTruthy();
  });

  it('zeigt Leer-Hinweis wenn keine Segmente passen', () => {
    render(
      <FokusgruppeView
        segments={[{ id: 'wu_unbekannt', label_de: '', mood: 'ruhig', belief: 0.1 }]}
        lastHeadline={null}
        onClose={noopClose}
      />,
    );
    expect(screen.getByText(/Keine Teilnehmer verfügbar/)).toBeTruthy();
  });

  it('ruft onClose auf, wenn Schliessen-Button geklickt wird', async () => {
    const onClose = vi.fn();
    render(
      <FokusgruppeView segments={twoSegments} lastHeadline={null} onClose={onClose} />,
    );
    const btn = screen.getByRole('button', { name: /fokusgruppe schliessen/i });
    await userEvent.click(btn);
    expect(onClose).toHaveBeenCalledOnce();
  });
});
