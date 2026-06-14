/**
 * Render-Test für das Morgenbriefing (P0b): das Overlay mountet und zeigt den
 * konkreten Tageshinweis inkl. zuständigem Büro — ohne Browser (jsdom).
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MorningBriefing } from '../components/MorningBriefing';

describe('MorningBriefing (Rendering)', () => {
  it('zeigt Briefing-Kopf und konkreten Tageshinweis mit Büro-Verweis', () => {
    render(
      <MorningBriefing
        phase={4}
        risk={72}
        trustProgress={0.5}
        budget={80}
        attention={20}
        onDone={vi.fn()}
      />,
    );

    // Kopfzeile + Tageshinweis-Sektion sind sichtbar.
    expect(screen.getByText(/MORGENBRIEFING — TAG 4/i)).toBeTruthy();
    expect(screen.getByText(/Tageshinweis/i)).toBeTruthy();

    // Bei Risiko 72 nennt der Hinweis konkret die Zahl und das zuständige Büro.
    expect(screen.getByText(/72 %/)).toBeTruthy();
    expect(screen.getByText(/Cyber-Lab/)).toBeTruthy();
  });
});
