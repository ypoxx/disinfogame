# Desinformation Network — Arbeitsdokument für Claude Code

> **Stand 2026-06-12: Story-Mode-only, MadTV-artiger Pixel-Look.**
> Verbindliche Quellen: `../../docs/VISION_LOCK.md` (Vision/Entscheidungen),
> `../../START_HERE.md` (Einstieg), `../../docs/PLAYER_ENTRY_AND_BUILDING_PLAN.md`
> (Einstieg/Gebäude), `../../docs/story-mode/MINISTRY_BROADCAST_CONCEPT.md`
> (Broadcast/Publikum — Konzept-Diskussion offen).
> Der frühere Pro-Mode liegt unter `archive/pro-mode/`, die Story-Entwurfshilfen
> (alter OfficeScreen, Studio-Flächen) unter `archive/story-mode-drafts/`.

## Was das Spiel ist

„Operation Westunion" — ein Bildungs-Planspiel über Desinformation. Der Spieler
leitet die Abteilung für Sonderoperationen eines fiktiven Ministeriums (Pixel-Art,
fiktive Ost-Block-Ästhetik, **keine realen Staatssymbole** — `docs/SYMBOLS_AUDIT.md`).

**Spielerpfad:** TitleScreen → ArrivalSequence (Avatar: Lobby → Fahrstuhl →
Direktor, überspringbar) → Direktor-Dialog (vertont) → freies Spiel:
Gebäude-Querschnitt (`BuildingStage`, Klick = Avatar läuft hin), NPC-Dialoge
(Porträts mit Mimik + Stimmen), Spielerbüro (`PlayerOfficeView`, Hotspots →
Panels), Broadcast-Leiste (Taste B: Sendung + Publikums-Wohnzimmer).

## Architektur-Landkarte (src/story-mode/)

| Bereich | Dateien | Prinzip |
|---|---|---|
| Gebäude | `building/buildingLayout.ts`, `BuildingNavigator.ts` (pure TS, getestet), `useNavigator.ts`, `BuildingStage.tsx`, `BuildingView.tsx` | Daten (`data/building.json`) → Layout → Navigator-Schritte (`durationMs` + `timeCostMin`-Hook, v1=0) → Stage rendert |
| Broadcast | `broadcast/broadcastMapping.ts` (PROVISORISCH), `useAudienceBroadcast.ts`, `BroadcastBar.tsx` | reine Anzeige-Schicht über `audience/audienceModel.ts` — KEINE Rückwirkung auf Mechanik |
| Assets | `assets/` (Registry, useSprite, PixelSprite) | lädt `public/assets/assets.json`; **jede** Grafik/jeder Sound hat CSS-/Synth-Fallback |
| Engine | `hooks/useStoryGameState.ts`, `../game-logic/StoryEngineAdapter.ts`, `engine/*` | Phase nur über `endPhase()`; Engine ist mutable Klasse in React-State (bewusst) |
| Daten | `data/*.json` (building, npcs, actions, dialogues, audience, …) | Daten zuerst ändern, Code folgt |

Asset-Erzeugung: `tools/asset-pipeline` (Gemini/ElevenLabs, Shot-Liste aus den
Spieldaten, Vision-Review-Workflow — README dort lesen). 143/143 Assets vorhanden.

## Arbeitsregeln

1. **Vor jedem Push (PFLICHT):** `npm run build` + `npx tsc --noEmit` +
   `npx vitest run` (alle Tests grün, Stand: 130+).
2. **Stil:** TypeScript strict, funktionale Komponenten, Props destrukturieren,
   knappe deutsche Kommentare (das Warum, nicht das Was).
3. **Keine realen Staatssymbole** in sichtbaren Inhalten; neue Bild-Prompts mit
   „no emblems, no text" + Vision-Review.
4. **Entwürfe/Skelette** gehören nach `archive/` mit Rückwärtsgang-Notiz im
   dortigen README — nicht löschen, nicht im Spielerpfad lassen.
5. **Browser-Smoke im Container:** Playwright mit
   `executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'`
   (frisches `playwright install` scheitert an der Netz-Policy).
6. Prozess-Lehren/Roadmap-Funde: `docs/ORCHESTRATION_FEEDBACK.md` fortschreiben.
