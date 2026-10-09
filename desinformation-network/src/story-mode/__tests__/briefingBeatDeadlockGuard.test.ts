import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Wache gegen die Briefing-/Beat-Verklemmung.
 *
 * Das Entscheidungs-Modal erscheint erst NACH dem bestätigten Morgenbriefing
 * (`briefedPhase === state.storyPhase.number`). Seit #106 zählt der anstehende
 * Beat aber zu `vollbildOverlayOffen` — und das Briefing trat hinter genau
 * dieses Prädikat zurück. Kürte der Director über Nacht einen Beat, blieben
 * beide unsichtbar, und A/T öffneten den ganzen Tag nichts (im Browser an
 * Tag 3 reproduziert: „loyalitaetsprobe").
 *
 * Die Regel: Das Briefing prüft das Prädikat OHNE den Beat.
 */

const QUELLE = readFileSync(resolve(__dirname, '../StoryModeGame.tsx'), 'utf8');

describe('Morgenbriefing und Entscheidungs-Beat', () => {
  it('der Beat wartet auf das Briefing', () => {
    const beatBlock = QUELLE.slice(QUELLE.indexOf('{pendingDecisionBeatId &&'));
    expect(beatBlock.slice(0, 400)).toContain('briefedPhase === state.storyPhase.number');
  });

  it('das Briefing wartet darum NICHT auf den Beat', () => {
    const start = QUELLE.indexOf('<MorningBriefing');
    const bedingung = QUELLE.slice(QUELLE.lastIndexOf("state.gamePhase === 'playing'", start), start);
    expect(bedingung, 'Briefing-Bedingung nicht gefunden').toContain('briefedPhase !== state.storyPhase.number');
    expect(bedingung).not.toMatch(/!vollbildOverlayOffen\b/);
    expect(bedingung).not.toContain('pendingDecisionBeatId');
  });

  it('das Beat-freie Prädikat lässt den Beat wirklich weg', () => {
    const m = QUELLE.match(/const vollbildOhneBeat =([\s\S]*?);/);
    expect(m, 'vollbildOhneBeat fehlt').toBeTruthy();
    expect(m![1]).not.toContain('pendingDecisionBeatId');
  });
});
