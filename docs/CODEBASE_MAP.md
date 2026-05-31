# 🗺️ Codebase-Karte — was liegt wo (Gesamtüberblick)

> **Status:** Referenz · **Aktualisiert:** 2026-05-31 · **Scope:** Beide
> **Methodik:** Struktur & Dateigrößen selbst gemessen; Dialog-Kette selbst im Code geprüft; die übrige
> Verdrahtung stammt aus einem Architektur-Scan und ist als solche markiert.
> **Vertrauens-Legende:** ✅ *[geprüft]* = selbst im Code/Daten nachgesehen · 🔎 *[Scan]* = aus dem Architektur-Scan, bei Bedarf bestätigbar.

## Das Projekt in einem Satz
Im Ordner `desinformation-network/` stecken eigentlich **zwei Spiele nebeneinander**, die sich Grundbausteine teilen:
- **Pro Mode** — das abstrakte Netzwerk-/Vertrauens-Spiel (der „Standard"-Einstieg).
- **Story Mode** — die Erzähl-Variante (hier steckt die meiste Arbeit; das Herz des Projekts).

## Verzeichnis-Landkarte (vereinfacht)

```
desinformation-network/        ← das eigentliche Spiel
├── src/
│   ├── components/            ← Pro-Mode-Oberfläche (Netzwerk-Grafik, Panels)
│   ├── story-mode/            ← STORY MODE (der größte Teil, 76 Dateien)
│   │   ├── components/        ← Oberfläche (DialogBox, NpcPanel, ActionPanel …)
│   │   ├── engine/            ← Story-Systeme (DialogLoader, Betrayal, Ending, Crisis …)
│   │   ├── data/              ← die ECHTEN Story-Daten (Aktionen, Dialoge, NPCs …)
│   │   ├── hooks/             ← useStoryGameState (Bindeglied UI ↔ Engine)
│   │   └── stores/            ← UI-Zustand (welches Panel offen ist)
│   ├── game-logic/            ← Pro-Engine (GameState) + StoryEngineAdapter (Klebe-Schicht)
│   ├── data/game/             ← Pro-Mode-Daten (Akteure, Fähigkeiten, Events)
│   ├── data/persuasion/       ← wissenschaftliche Überzeugungs-Taxonomie
│   └── stores/, services/     ← globale Einstellungen, API-Aufrufe
│   └── netlify/functions/     ← Backend (6 Funktionen)
├── docs/                       ← Doku (enthält eine VERALTETE Daten-Kopie, s. u.)
sprite-tool/                    ← eigenständiges KI-Bild-Werkzeug (NICHT Teil des Spiels)
archive/                        ← die ausgemisteten alten Pläne (Doku-Detox)
```

## Wichtigste Befunde

### A. Story Mode steckt hinter einem „Test"-Knopf  🔎 *[Scan]*
Story Mode wird über einen Button **„📖 Story Mode Test"** als Overlay gestartet — also technisch wie ein **Prototyp** behandelt, obwohl die meiste inhaltliche Arbeit darin steckt. Aktiv ist `StoryModeGame.tsx`; es nutzt `OfficeScreen.tsx` als Büro-Ansicht (umschaltbar mit `DashboardView` über `viewMode`).

> **Korrektur (2026-05-31, per Code-Suche verifiziert):** Eine frühere Fassung dieser Datei behauptete, `OfficeScreen.tsx` werde „gar nicht mehr ausgeführt". Das war falsch (Fehler des ersten Architektur-Scans) — `OfficeScreen` **lebt** und ist die Standard-Büro-Ansicht. Siehe `INVENTORY.md`.

### B. Eine Datei ist viel zu groß: `StoryEngineAdapter.ts` — 5119 Zeilen  ✅ *[geprüft]*
Das ist die zentrale „Klebe-Schicht" zwischen Story-Oberfläche und Spiel-Logik — ein 100-Seiten-Alles-Ordner. Genau hier verheddert sich Verdrahtung (auch die der Dialoge), und Fehler verstecken sich gut. Weitere große Brocken: `useStoryGameState.ts` (1447), `GameState.ts` (1528), `DialogLoader.ts` (1336).

### C. Story-Daten liegen doppelt — und sind auseinandergelaufen  ✅ *[geprüft]*
- Echt & vom Spiel genutzt: `desinformation-network/src/story-mode/data/`
- Veraltete Kopie: `docs/story-mode/data/` — bei mehreren Dateien (Aktionen, Konsequenzen, Gegenmaßnahmen, Dialoge) weicht der Inhalt inzwischen ab.
Das ist eine klassische Verwirrungsquelle („zwei verschiedene Wege").

### D. Viel toter / nicht-angeschlossener Code  🔎 *[Scan]*
- `OfficeScreen.tsx`, `ActorEffectivenessWidget.tsx`, `EventNotification`, `EventChoiceModal`, `ActorReactionsOverlay` — abgelöst oder ungenutzt.
- **Backend (`netlify/functions`, 6 Stück):** vorhanden, aber vom Spiel **nie aufgerufen** — vorbereitete Infrastruktur (Bestenliste, Statistik), die nie verkabelt wurde.

### E. Bewusste Doppel-Systeme Pro ↔ Story  🔎 *[Scan]*
Combo-, Narrativ-, Actor-AI- und Tutorial-System existieren je **zweimal** (eins pro Modus). Nicht falsch — aber doppelter Pflegeaufwand, passend zur Entscheidung „Pro Mode einfrieren".

## sprite-tool/
Ein **eigenständiges** Next.js-Werkzeug zur KI-Bilderzeugung (Claude-API). Nicht Teil des ausgelieferten Spiels — ein Entwickler-Hilfsmittel.

## Was das fürs weitere Vorgehen heißt
Die gute Nachricht: Es ist **kein hoffnungsloser Wust**, sondern ein gut gefülltes, aber teils **nur halb verkabeltes** Projekt mit zu großen Dateien und doppelten Daten. Das lässt sich Stück für Stück ordnen — kein Neuanfang nötig. Die konkrete Dialog-Diagnose steht in [`DIALOGUE_DIAGNOSIS.md`](DIALOGUE_DIAGNOSIS.md).
