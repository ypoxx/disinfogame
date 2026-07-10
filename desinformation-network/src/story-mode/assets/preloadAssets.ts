// ===========================================
// ASSET-PRELOADER — wärmt den Browser-Cache vor
// ===========================================
// Problem: Bilder werden per <img src> / CSS background-image referenziert.
// Der Browser lädt ein Bild erst, wenn die Komponente gemountet wird — also
// erst BEIM Betreten eines Raums bzw. wenn ein Porträt erscheint. Dadurch
// „ploppt" die Grafik sichtbar rein (fühlt sich an wie langsames Internet),
// obwohl es nur der erste Netzwerk-Roundtrip ist.
//
// Lösung: Sobald das Manifest geladen ist (schon im Titelbildschirm), warten
// wir NICHT auf das Mounten, sondern legen die Bilder still im Hintergrund an.
// Der Browser hält sie dann im Cache; beim Betreten des Raums sind sie sofort
// da — kein Nachladen mehr.
//
// Zwei Stufen, damit spekulatives Vorladen nie mit dem konkurriert, was der
// Spieler gerade wirklich sieht:
//   1) PRIORITÄT  — Titel/Fassade, UI-Rahmen, Icons, Räume, NPC-Porträts,
//                   Spielfigur. Sofort, mit kleiner Parallelität.
//   2) REST       — z. B. Fokusgruppen-Publikum (persona_*), Deko-Props.
//                   Erst wenn der Browser Leerlauf hat (requestIdleCallback),
//                   und mit niedriger fetchPriority.
//
// Reine Logik (collectPreloadUrls) ist ohne DOM testbar; die DOM-Seite
// (warmImageCache) ist ein No-op auf dem Server / ohne Image.

import type { AssetRegistry } from './AssetRegistry';

/**
 * Asset-id-Präfixe, die früh sichtbar werden und daher zuerst geladen werden.
 * Alles andere (persona_*, prop_*, …) wandert in die Leerlauf-Stufe.
 */
export const PRIORITY_PREFIXES = [
  'building_', // Titel-Fassade (erster Bildschirm)
  'bld_',      // Gebäude-Stage (Ankunft, Fassade, Skyline)
  'ui_',       // UI-Rahmen/Bänder/Balken
  'icon_',     // HUD-Icons (klein, überall)
  'room_',     // Raum-Hintergründe (die großen „Ploppser")
  'portrait_', // NPC-Porträts inkl. Stimmungen
  'player_',   // Spielfigur-Sheet
] as const;

export function isPriorityAsset(id: string): boolean {
  return PRIORITY_PREFIXES.some((prefix) => id.startsWith(prefix));
}

export interface PreloadUrls {
  /** Früh sichtbar — sofort vorladen. */
  priority: string[];
  /** Später/selten — im Leerlauf vorladen. */
  rest: string[];
}

/**
 * Sammelt alle Bild-URLs (image + sheet) aus der Registry und teilt sie in
 * „sofort" und „später" auf. Rein — kein DOM, gut testbar.
 */
export function collectPreloadUrls(registry: AssetRegistry): PreloadUrls {
  const priority: string[] = [];
  const rest: string[] = [];
  const ids = [...registry.idsByType('image'), ...registry.idsByType('sheet')];
  for (const id of ids) {
    const url = registry.imageUrl(id);
    if (!url) continue;
    (isPriorityAsset(id) ? priority : rest).push(url);
  }
  return { priority, rest };
}

// ---------------------------------------------------------------------------
// DOM-Seite: tatsächlich vorladen (Cache vorwärmen)
// ---------------------------------------------------------------------------

/** Schon angeforderte URLs — nie zweimal laden (auch über Aufrufe hinweg). */
const requested = new Set<string>();

type FetchPriority = 'high' | 'low' | 'auto';

function warmOne(url: string, fetchPriority: FetchPriority): Promise<void> {
  return new Promise<void>((resolve) => {
    if (requested.has(url)) {
      resolve();
      return;
    }
    requested.add(url);
    const img = new Image();
    // Nur Cache vorwärmen — die Dekodierung darf den Main-Thread nicht blockieren,
    // und spekulative Ladevorgänge bekommen niedrige Netzwerk-Priorität.
    img.decoding = 'async';
    try {
      (img as unknown as { fetchPriority?: string }).fetchPriority = fetchPriority;
    } catch {
      /* Attribut nicht überall verfügbar — egal. */
    }
    // Erfolg wie Fehler beenden die Stufe (Fehler soll den Fortschritt nicht
    // blockieren; das echte <img> zeigt später ohnehin seinen Fallback).
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = url;
  });
}

/**
 * Lädt eine Liste von URLs mit begrenzter Parallelität, damit die Anfrage-
 * Warteschlange nicht mit 200 spekulativen Downloads geflutet wird.
 */
function runQueue(urls: string[], concurrency: number, fetchPriority: FetchPriority): void {
  let next = 0;
  let active = 0;
  const pump = (): void => {
    while (active < concurrency && next < urls.length) {
      const url = urls[next++];
      active++;
      void warmOne(url, fetchPriority).then(() => {
        active--;
        pump();
      });
    }
  };
  pump();
}

/** Führt `fn` aus, sobald der Browser Leerlauf hat (mit Fallback ohne rIC). */
function scheduleIdle(fn: () => void): void {
  const w = window as unknown as {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  };
  if (typeof w.requestIdleCallback === 'function') {
    w.requestIdleCallback(fn, { timeout: 2500 });
  } else {
    // Kein requestIdleCallback (z. B. Safari älter): kurz warten, dann laden.
    window.setTimeout(fn, 1200);
  }
}

export interface WarmOptions {
  /** Für Tests injizierbar: Leerlauf-Planung. */
  schedule?: (fn: () => void) => void;
}

/**
 * Startet das gestufte Vorladen aller Bild-Assets. Idempotent und ein No-op,
 * wenn kein Browser-Kontext vorhanden ist (SSR/Tests ohne Image).
 *
 * Aufrufen, sobald das Manifest geladen ist (siehe StoryModeGame): dann ist
 * der Cache schon warm, bevor der Spieler den ersten Raum betritt.
 */
export function warmImageCache(registry: AssetRegistry, options: WarmOptions = {}): void {
  if (typeof window === 'undefined' || typeof Image === 'undefined') return;
  if (registry.size === 0) return; // kein Manifest → Fallback-Look, nichts zu laden

  const { priority, rest } = collectPreloadUrls(registry);
  const schedule = options.schedule ?? scheduleIdle;

  // 1) Früh sichtbare Assets sofort — moderate Parallelität.
  runQueue(priority, 4, 'high');
  // 2) Der Rest erst im Leerlauf, sanft und mit niedriger Priorität.
  schedule(() => runQueue(rest, 2, 'low'));
}

/** Nur für Tests: den „schon angefordert"-Cache zurücksetzen. */
export function __resetPreloadCacheForTests(): void {
  requested.clear();
}
