// Spielversion und Changelog — zentrale Quelle für alle UI-Stellen.

export const GAME_VERSION = '0.9.0';

// Dynamischer Build-Stempel (§14.6): wird beim `vite build`/`vite dev` über `define`
// (vite.config.ts) auf „<commit> · <datum>" gesetzt, damit man den ausgelieferten
// Stand direkt am Titelbildschirm sieht — hilft bei Cache-Diagnose. Ohne Build (Tests)
// fällt er auf 'dev' zurück; `typeof` wirft nie, auch wenn die Variable undeklariert ist.
declare const __BUILD_STAMP__: string | undefined;
export const BUILD_STAMP: string =
  typeof __BUILD_STAMP__ !== 'undefined' && __BUILD_STAMP__ ? __BUILD_STAMP__ : 'dev';

export const CHANGELOG: Array<{ version: string; date: string; points: string[] }> = [
  {
    version: '0.9.0',
    date: '2026-06-12',
    points: [
      'Pixel-Gebäude mit Avatar und Fahrstuhl',
      'Geführter Spieleinstieg mit Titelbildschirm und Ankunft',
      'Spielerbüro als begehbarer Raum',
      'Broadcast-Leiste mit Publikums-Wohnzimmer (Taste B)',
      'Vollständige Grafik- und Sound-Ausstattung, NPC-Stimmen',
    ],
  },
  {
    version: '0.8.0',
    date: '2026-06-11',
    points: [
      'KI-generierte Grafiken und Audio, Stil-Festlegung',
    ],
  },
  {
    version: '0.7.0',
    date: '2026-05-31',
    points: [
      'Story-Mode-Fokus, Pro-Modus archiviert',
    ],
  },
];
