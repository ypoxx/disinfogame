# 🏢 Gebäude (TVTower-Stil) & Grafik-Pipeline — Roadmap

> **Status:** Aktiv (kanonisch für die visuelle Richtung) · **Aktualisiert:** 2026-05-31 · **Scope:** Story
> Dies ist der verbindliche Plan, um vom heutigen Einzel-Büro zur **MadTV-/TVTower-Optik** zu kommen
> (mehrstöckiges Gebäude, klickbare Räume, laufende Figuren) — inklusive der **Grafik-„Backend"-Pipeline**,
> mit der wir konsistente Bilder erzeugen und ins Spiel bringen.

---

## Das Ziel (Vorbild: MadTV / TVTower)
- **Gebäude im Querschnitt:** mehrere Etagen, jede mit Räumen. Jeder Raum = ein NPC / eine Funktion.
- **Kleine Figuren** (Spieler + NPCs) laufen durch das Haus, nehmen Treppe/Aufzug, betreten Räume.
- **Klickbare Navigation** und konsistenter **brutalistischer Pixel-Art-Look**.

## Ehrlicher Ist-Stand (heute)
| Was | Stand |
|---|---|
| Sichtbarer Bildschirm | **Ein** Raum: `OfficeScreen.tsx` (CSS-Möbel + 1 KI-Hintergrundbild `public/office-brutalist-scene.jpg`) |
| Mehrstöckiges Gebäude / Figuren | **noch nicht vorhanden** (kein `building/`-Modul) |
| Detaillierter Bauplan | ✅ vorhanden: `desinformation-network/src/story-mode/BUILDING_CONCEPT.md` (Etagen, Räume, Sprite-Sheet-Layout, Komponenten, `useSprite`-Hook) |
| Asset-Werkzeug | ✅ vorhanden: `sprite-tool/` (KI-Bilderzeugung mit festem Stil-Guide) — erzeugt **Einzelbilder**; das **Zusammensetzen zu Sprite-Sheets fehlt noch** |

→ Die Bausteine sind also da; sie müssen **verbunden** werden.

---

## Der Weg dahin (datengetrieben, in Schritten)

### Schritt 1 — Gebäude als **Daten** + Querschnitt-Ansicht *(ohne Figur)*
- Räume/Etagen in eine editierbare Liste `src/story-mode/data/building.json`: `{ id, floor, name, npcId, x, y, unlocked }`.
- Neue `BuildingView` rendert den **Querschnitt** aus diesen Daten; der heutige `OfficeScreen` wird **ein** Raum darin.
- Klick auf einen Raum → öffnet die bestehende Raum-/Dialog-UI (NpcPanel, Aktionen).
- **Ergebnis:** der „klickbare Querschnitt" — der erste sichtbare TVTower-Schritt, ohne neue Grafik nötig.

> **Schritt 1 ist zugleich die erste „Skizze" UND Dokumentation:** Schon mit groben CSS-Kästen (ohne jede
> Grafik) wird die TVTower-Struktur **sichtbar, klickbar und testbar**. `building.json` beschreibt
> Etagen/Räume/NPCs **als Daten** — das ist gelebte Dokumentation, an der man die Struktur sofort sieht und ändert.
>
> ### Umgang mit dem heutigen `OfficeScreen` (wichtig)
> Der `OfficeScreen` ist das **alte Einzel-Raum-Konzept**. Sein Funktions-Inhalt (Aktionen, NPCs, News …)
> liegt ohnehin in **geteilten Panels** rundherum (`ActionPanel`, `NpcPanel`, …), **nicht** im Screen selbst —
> `StoryModeGame` schaltet schon heute per `viewMode` zwischen `'office'` und `'dashboard'`. Vorgehen:
> 1. `BuildingView` als **neuer dritter `viewMode: 'building'`** (neben `'office'` / `'dashboard'`).
> 2. OfficeScreen **nicht löschen**, sondern als **„klassische Ansicht" erreichbar lassen** (Abzweigung über
>    den bestehenden viewMode-Umschalter) — als **Referenz & Fallback** während des Umbaus. Er ist die
>    **Parität-Checkliste**: was er kann, muss das Gebäude können.
> 3. Funktionen **Raum für Raum** ins Gebäude überführen: erst öffnen die Räume die **bestehenden Panels**
>    (einfach, schnell sichtbar), später zeigt jeder Raum seinen NPC + dessen Aktionen **direkt** (TVTower-typisch).
> 4. Erst wenn das Gebäude **gleichwertig** ist, wandert `OfficeScreen` ins `archive/`.
>
> So gibt es **keinen riskanten Big-Bang**: das Alte bleibt Sicherheitsnetz **und** Spezifikation, bis das Neue steht.

### Schritt 2 — Grafik-Pipeline (das „Backend" für Assets)
> 📋 **Detail-Spezifikation: [`docs/ASSET_BACKEND.md`](ASSET_BACKEND.md)** — aktuelle Modelle (Nano Banana / gpt-image-1), Konsistenz-Rezept (Style-Anchor + Referenz + Seed), kompletter Feature-Plan.
- **a)** `sprite-tool` um **Sprite-Sheet-Zusammenbau** erweitern: N erzeugte Frames → ein PNG-Raster **plus** `*.json` mit Frame-Koordinaten/Animationen. *(Genau das fehlt heute; Typen dafür sind schon da.)*
- **b)** Der Stil-Guide `sprite-tool/public/context/game-style-guide.md` ist die **eine Wahrheit** für den Look — **alle** Assets darüber erzeugen ⇒ Konsistenz.
- **c)** Fertige Assets landen in `desinformation-network/public/assets/` (`rooms/`, `figures/`) + eine `assets.json`, die das Spiel **datengetrieben** lädt.
- **Ergebnis:** ein wiederholbarer Weg, konsistente Grafik zu erzeugen und ins Spiel zu holen — einmal gebaut, zahlt es für alles Weitere.

### Schritt 3 — Räume grafisch *(statt reinem CSS)*
- Pro Raum ein Hintergrund-Asset (wie das vorhandene `office-brutalist-scene.jpg`), über `assets.json` geladen.

### Schritt 4 — Laufende Figur (Avatar) + NPC-Figuren
- **Ein** Lauf-Zyklus-Sprite-Sheet (über die Pipeline aus Schritt 2) → `useSprite`-Hook (Bauplan steht in `BUILDING_CONCEPT.md`) → Figur **tweent** zwischen Räumen/Etagen.
- NPCs nutzen **dieselbe** Figuren-Mechanik ⇒ lebendiges Gebäude für wenig Mehr-Code.
- **Einzige echte Abhängigkeit:** dieses eine Lauf-Zyklus-Bild. Kein neuer Engine, kein Pathfinding.

### Schritt 5 — Politur
- Ambiente-Animationen (CSS: blinkende LEDs, dampfender Kaffee — Vorlagen in `BUILDING_CONCEPT.md`), Übergänge, Schritt-/Tür-Sounds (Sound-System existiert).

---

## Reihenfolge & Wirkung
| Schritt | Aufwand | Sichtbarer Effekt | Abhängigkeit |
|---|---|---|---|
| 1 Querschnitt (Daten) | mittel | **hoch** (sofort TVTower-Gefühl) | keine (kein neues Asset nötig) |
| 2 Pipeline | mittel | indirekt (ermöglicht alles) | sprite-tool erweitern |
| 3 Raum-Grafik | klein–mittel | hoch | Schritt 2 |
| 4 Avatar/Figuren | **klein im Code** | hoch | **1** Lauf-Zyklus-Asset (Schritt 2) |
| 5 Politur | klein | mittel | — |

## Was direkt wiederverwendbar ist
- `BUILDING_CONCEPT.md` → detaillierter Komponenten-/Sprite-Bauplan (übernehmen, nicht neu erfinden).
- `sprite-tool/` → Bilderzeugung + Stil-Guide (nur den Sheet-Zusammenbau ergänzen).
- `public/office-brutalist-scene.jpg` → Beweis, dass der KI-Asset-Weg funktioniert.

> **Hinweis zur Engine:** Dieser visuelle Weg braucht **keinen** vorherigen Umbau der großen Engine-Dateien.
> Wo eine Stelle (z. B. der Spielzustand in `useStoryGameState`) für die Gebäude-Navigation angefasst werden
> muss, wird sie **gezielt** und klein refaktoriert — nicht als großer Vorab-Umbau. Siehe `ROADMAP.md`.
