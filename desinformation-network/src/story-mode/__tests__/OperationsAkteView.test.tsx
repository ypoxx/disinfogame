/**
 * OperationsAkteView (P2): reine Helfer + Render/Interaktion.
 *
 * Beweist den UI-seitigen params-Durchstich: vier Schritte zusammenklicken →
 * „Ausspielen" reicht exakt die gewählten ids + das Engine-Resultat zurück.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  OperationsAkteView,
  operationParamsOf,
  missingSteps,
  formatPct,
  gaugeColor,
  EMPTY_SELECTION,
} from '../components/OperationsAkteView';
import { StoryModeColors } from '../theme';
import { loadTargets, loadCarriers, loadPlatforms, resolveOperationParams } from '../battlefield/BattlefieldChain';

describe('OperationsAkteView — reine Helfer', () => {
  it('operationParamsOf lässt leere Felder weg', () => {
    expect(operationParamsOf(EMPTY_SELECTION)).toEqual({
      target: undefined,
      vulnerability: undefined,
      carrier: undefined,
      platforms: undefined,
    });
    expect(operationParamsOf({ targetId: 't', vulnId: 'v', carrierId: 'c', platformIds: ['p1', 'p2'] })).toEqual({
      target: 't',
      vulnerability: 'v',
      carrier: 'c',
      platforms: ['p1', 'p2'],
    });
  });

  it('missingSteps nennt die fehlenden Schritte in Reihenfolge', () => {
    expect(missingSteps(resolveOperationParams({}))).toEqual(['Ziel', 'Schwäche', 'Verbreiter', 'Plattform']);
    const t = loadTargets()[0];
    const complete = resolveOperationParams({
      target: t.id,
      vulnerability: t.vulnerabilities[0].id,
      carrier: loadCarriers()[0].id,
      platforms: [loadPlatforms()[0].id],
    });
    expect(missingSteps(complete)).toEqual([]);
  });

  it('formatPct/gaugeColor', () => {
    expect(formatPct(0.726)).toBe('73 %');
    expect(gaugeColor(0.8)).toBe(StoryModeColors.success);
    expect(gaugeColor(0.1)).toBe(StoryModeColors.danger);
    expect(gaugeColor(0.8, true)).toBe(StoryModeColors.danger); // invertiert: hoch = gefährlich
  });
});

describe('OperationsAkteView — Render + Durchstich', () => {
  const targets = loadTargets();
  const carriers = loadCarriers();
  const platforms = loadPlatforms();

  function setup() {
    const onAusspielen = vi.fn();
    const onClose = vi.fn();
    render(
      <OperationsAkteView
        targets={targets}
        carriers={carriers}
        platforms={platforms}
        onAusspielen={onAusspielen}
        onClose={onClose}
      />,
    );
    return { onAusspielen, onClose };
  }

  it('Ausspielen ist erst nach vollständiger Auswahl aktiv und reicht die ids zurück', () => {
    const { onAusspielen } = setup();
    const t = targets[0];
    const v = t.vulnerabilities[0];
    const c = carriers[0];
    const p = platforms[0];

    const button = screen.getByTestId('oa-ausspielen') as HTMLButtonElement;
    expect(button.disabled).toBe(true); // unvollständig

    fireEvent.click(screen.getByTestId(`oa-target-${t.id}`));
    fireEvent.click(screen.getByTestId(`oa-vuln-${v.id}`));
    fireEvent.click(screen.getByTestId(`oa-carrier-${c.id}`));
    fireEvent.click(screen.getByTestId(`oa-platform-${p.id}`));

    // Vorschau zeigt jetzt die Schlagzeile mit dem Zielnamen.
    expect(screen.getByTestId('oa-headline').textContent).toContain(t.name);

    expect(button.disabled).toBe(false);
    fireEvent.click(button);

    expect(onAusspielen).toHaveBeenCalledTimes(1);
    const [params, result] = onAusspielen.mock.calls[0];
    expect(params).toEqual({ target: t.id, vulnerability: v.id, carrier: c.id, platforms: [p.id] });
    expect(result.impact).toBeGreaterThan(0);
    expect(result.headline_de).toContain(t.name);
  });

  it('Ziel-Wechsel setzt die Schwäche zurück (vuln-ids sind zielgebunden)', () => {
    setup();
    const t0 = targets[0];
    fireEvent.click(screen.getByTestId(`oa-target-${t0.id}`));
    fireEvent.click(screen.getByTestId(`oa-vuln-${t0.vulnerabilities[0].id}`));
    // Anderes Ziel wählen → Schwäche-Auswahl weg, Vorschau verlangt wieder „Schwäche".
    const t1 = targets[1];
    fireEvent.click(screen.getByTestId(`oa-target-${t1.id}`));
    expect(screen.getByTestId('oa-headline').textContent).toMatch(/Schwäche/);
  });

  it('Klick auf den abgedunkelten Hintergrund schließt die Akte', () => {
    const { onClose } = setup();
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalled();
  });
});

describe('OperationsAkteView — Ökonomie-Gate (Aufbauen/Beschaffen)', () => {
  const targets = loadTargets();
  const carriers = loadCarriers();
  const platforms = loadPlatforms();
  const t = targets[0];
  const v = t.vulnerabilities[0];
  const c = carriers[0];
  const p = platforms[0];

  it('Ausspielen bleibt gesperrt, bis Verbreiter aufgebaut UND Kompromat beschafft ist', () => {
    const onBuildCarrier = vi.fn();
    const onAcquireKompromat = vi.fn();
    const onAusspielen = vi.fn();
    const { rerender } = render(
      <OperationsAkteView
        targets={targets} carriers={carriers} platforms={platforms}
        carrierStates={{ [c.id]: 'verfügbar' }}
        acquiredKompromat={[]}
        onBuildCarrier={onBuildCarrier}
        onAcquireKompromat={onAcquireKompromat}
        onAusspielen={onAusspielen}
        onClose={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByTestId(`oa-target-${t.id}`));
    fireEvent.click(screen.getByTestId(`oa-vuln-${v.id}`));
    fireEvent.click(screen.getByTestId(`oa-carrier-${c.id}`));
    fireEvent.click(screen.getByTestId(`oa-platform-${p.id}`));

    // vollständige Auswahl, aber Ökonomie fehlt → Ausspielen gesperrt, Hinweis sichtbar
    expect((screen.getByTestId('oa-ausspielen') as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByTestId('oa-headline').textContent).toMatch(/aufbauen|beschaffen/i);

    // Aktions-Knöpfe lösen die Callbacks aus
    fireEvent.click(screen.getByTestId(`oa-build-${c.id}`));
    expect(onBuildCarrier).toHaveBeenCalledWith(c.id);
    fireEvent.click(screen.getByTestId(`oa-acquire-${v.id}`));
    expect(onAcquireKompromat).toHaveBeenCalledWith(t.id, v.id);

    // Nach Aufbau + Beschaffung (Props aktualisiert) → Ausspielen frei
    rerender(
      <OperationsAkteView
        targets={targets} carriers={carriers} platforms={platforms}
        carrierStates={{ [c.id]: 'aktiv' }}
        acquiredKompromat={[`${t.id}:${v.id}`]}
        onBuildCarrier={onBuildCarrier}
        onAcquireKompromat={onAcquireKompromat}
        onAusspielen={onAusspielen}
        onClose={vi.fn()}
      />,
    );
    expect((screen.getByTestId('oa-ausspielen') as HTMLButtonElement).disabled).toBe(false);
    fireEvent.click(screen.getByTestId('oa-ausspielen'));
    expect(onAusspielen).toHaveBeenCalledTimes(1);
  });
});
