/**
 * VQA-Hook — Instrumentierung für die Visual-Review-Ernte
 * (scripts/visual-review/, siehe docs/VISUAL_REVIEW_*).
 *
 * NUR aktiv, wenn die URL `?vqa=1` trägt (Playwright-Läufe); im normalen
 * Spiel wird nichts installiert und nichts verändert. Exponiert die
 * Engine-Boden-Linien-Geometrie (STAGE/Layout/Deko-Tabellen) als Ground-Truth
 * für pixelgenaue Messungen sowie Zustands-Schalter (Tagesuhr, Avatar-Wahl),
 * damit die Ernte Tag/Nacht & Co. deterministisch erzwingen kann.
 */
import { useDayClockStore } from '../stores/dayClockStore';
import { useDirectorStore } from '../stores/directorStore';
import { usePlayerProfile } from '../stores/playerProfileStore';
import { getBuildingLayout, STAGE } from '../building/buildingLayout';
import {
  FLOOR_DECOR,
  DECOR_HEIGHT,
  FLOOR_AMBIENT,
  AMBIENT_HEIGHT,
} from '../building/corridorDecor';
import { AMBIENT_AGENTS, AMBIENT_TIMING } from '../building/ambientLife';

/** Aktiv nur im expliziten Ernte-Modus (?vqa=1). */
export function vqaEnabled(): boolean {
  try {
    return new URLSearchParams(window.location.search).get('vqa') === '1';
  } catch {
    return false;
  }
}

type VqaWindow = Window & { __VQA__?: Record<string, unknown> };

/** Statische Ground-Truth + Store-Schalter einmalig anmelden. */
export function installVqaBase(): void {
  if (!vqaEnabled()) return;
  const w = window as VqaWindow;
  w.__VQA__ = {
    ...(w.__VQA__ ?? {}),
    STAGE,
    layout: getBuildingLayout(),
    decor: { FLOOR_DECOR, DECOR_HEIGHT, FLOOR_AMBIENT, AMBIENT_HEIGHT },
    // LB: Routen-Statisten (ambientLife) — `ambientNudge(level)` wird vom
    // AmbientLifeLayer nachgereicht, sobald die Bühne steht.
    ambient: { AMBIENT_AGENTS, AMBIENT_TIMING },
    setMinutes: (m: number) => useDayClockStore.setState({ minutes: Math.max(0, Math.min(540, m)) }),
    getMinutes: () => useDayClockStore.getState().minutes,
    setPortrait: (portraitId: string, name = 'Tester') => usePlayerProfile.getState().setProfile(name, portraitId),
    directorStore: useDirectorStore,
  };
}

/** Lebende Spiel-API (Engine, Callbacks, UI-Setter) je Render nachführen. */
export function publishVqa(extra: Record<string, unknown>): void {
  if (!vqaEnabled()) return;
  const w = window as VqaWindow;
  w.__VQA__ = { ...(w.__VQA__ ?? {}), ...extra };
}
