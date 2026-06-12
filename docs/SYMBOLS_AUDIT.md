# 🔍 Symbol-Audit — reale Staatssymbole

**Status:** Aktiv (Pflegedokument)
**Aktualisiert:** 2026-06-12
**Regel (Stil-Lock PR #73, bestätigt 2026-06-12):** Keine realen Staatssymbole in
spielersichtbaren Inhalten — kein ☭, keine echten Flaggen/Wappen/Embleme. Das Spiel
nutzt eine **fiktive** Ost-Block-Ästhetik (Westunion/Nordmark/Gallia) mit dem
abstrakten Agentur-Emblem **⬢**.

## Entfernt (2026-06-12, Commit d0befe1)

| Stelle | Vorher | Nachher |
|---|---|---|
| StoryModeGame Intro-Header (inzwischen ganz ersetzt durch TitleScreen) | ☭ | ⬢ |
| OfficeScreen Akten-Ordner (inzwischen archiviert) | ☭ | ⬢ |
| MissionPanel Briefing-Kopf | ☭ | ⬢ |
| StatsPanel „HAUPTZIELE" | ☭ | ⬢ |
| DashboardView Kopfzeile | ☭ | ⬢ |

## Geprüft und bewusst BELASSEN

| Stelle | Befund | Begründung |
|---|---|---|
| `⭐` (ActionPanel, TutorialOverlay, StoryActorAI-News, event-chains) | Stern-Emoji | Generischer „Prominenten/Empfehlungs"-Marker, kein Staatssymbol |
| `StoryModeColors.sovietRed` (~70 Code-Stellen) | interner Farb-Token-NAME | Nie spielersichtbar. **Empfehlung für später:** Umbenennung → `ministryRed` (rein mechanisch, niedriges Risiko, eigener kleiner PR) |
| `theme.ts` Kommentar „USSR aesthetics …" | Code-Kommentar | Stil-Referenz für Entwickler, nicht sichtbar |
| Pipeline-Prompts („soviet-era typewriter", „soviet bureaucrat") | Generierungs-Anweisung | Stil-Richtung; die Prompts verbieten gleichzeitig explizit Embleme/Text im Bild („no emblems", „plain dark-red banner without any emblem") |
| Generierte Assets (67+26 Bilder) | per Vision geprüft | Poster sind abstrakt-konstruktivistisch ohne reale Embleme; Lobby-Poster, Fassaden-Ornament und Zentrale-Banner emblemfrei |

## Verfahren für neue Inhalte

1. Neue Bilder: Prompt enthält „no emblems, no text"; nach Generierung Vision-Review
   gegen diese Regel (Pipeline-Workflow, `tools/asset-pipeline/README.md`).
2. Neue UI-Texte/Icons: kein Einsatz realer Flaggen-Emojis (🇷🇺 🇺🇸 …) — Länder heißen
   Westunion/Nordmark/Gallia und bleiben allegorisch.
3. Fundstellen melden/ergänzen: dieses Dokument fortschreiben.
