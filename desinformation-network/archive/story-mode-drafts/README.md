# Archiv: Story-Mode-Entwurfshilfen

**Archiviert:** 2026-06-12 (Branch `claude/stoic-hamilton-8kx6k5`)
**Grund:** Owner-Ziel „Das Spiel soll von den alten Elementen für den Entwurf nichts
mehr haben" — Skelette und Entwurfs-Flächen raus aus dem Spielerpfad, aber
dokumentiert für den Rückwärtsgang.

## Inhalt

| Datei/Ordner | Was es war | Ersetzt durch |
|---|---|---|
| `OfficeScreen.tsx` | CSS-gezeichnetes Büro (Hotspots als geometrische Formen, „Papers Please"-Skizze) | `src/story-mode/components/PlayerOfficeView.tsx` (generiertes Raumbild `room_spieler_buero` + Hotspots auf dieselben Panels) |
| `studio/BlueprintStudio.tsx` | Entwurfs-Dashboard (#dash): Publikums-Modell-Spielwiese | Publikum läuft jetzt im Spiel: `src/story-mode/broadcast/` (Taste B) |
| `studio/StudioScene.tsx` | Gezeichneter Gebäude-Schnitt (#studio/#blueprint), Vorstudie | `src/story-mode/building/BuildingStage.tsx` (Pixel-Querschnitt aus Baukasten-Assets) |

Nur im Git-Verlauf (vollständig ersetzt, nicht kopiert):

- **CSS-Skelett der BuildingView** (Track A-1, Grid-Boxen + CSS-Fahrstuhl,
  „🧭 Koordinaten"-Overlay): letzter Stand in Commit `d0befe1`
  (`git show d0befe1:desinformation-network/src/story-mode/building/BuildingView.tsx`).
- **Dev-Vorschaltbildschirm** in `App.tsx` („📖 Story Mode starten") und der
  **Text-IntroScreen** in `StoryModeGame.tsx`: letzter Stand ebenfalls `d0befe1`.

## Rückwärtsgang

1. Datei aus diesem Ordner zurück nach `src/...` verschieben (Pfad s. Tabelle)
   bzw. per `git show <commit>:<pfad> > <ziel>` aus dem Verlauf holen.
2. `OfficeScreen`: Export in `src/story-mode/index.ts` wieder eintragen und in
   `StoryModeGame.tsx` den `viewMode === 'office'`-Zweig zurücktauschen.
3. `studio/*`: Hash-Routing in `src/App.tsx` wiederherstellen (`#dash`, `#studio`),
   siehe `git show d0befe1:desinformation-network/src/App.tsx`.
4. `npx tsc --noEmit && npx vitest run` — die Archiv-Dateien kompilieren nicht mit
   (`tsconfig.include = ["src"]`), erst nach dem Zurückverschieben.

⚠️ Diese Dateien werden NICHT mitgepflegt; nach API-Änderungen im Spiel können
sie veralten. Sie dienen als Referenz, nicht als lebender Code.
