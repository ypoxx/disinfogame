# 🎬 Spieler-Einstieg & Gebäude-Visualisierung — Plan

**Status:** Aktiv — kanonisch für Einstieg + Gebäude-Optik
**Aktualisiert:** 2026-06-12
**Scope:** Story
**Supersedes:** `VISION_LOCK.md §5` Einstufung „(B) = spätere, optionale Schicht" — (B) ist jetzt **aktiver Track**.
Ergänzt `BUILDING_AND_ASSETS.md` (Schritte 3–5 werden hier konkretisiert) und
`story-mode/BROADCAST_AND_AUDIENCE_CONCEPT.md` (HUD bekommt Grafik).
**Kanonisch für:** Spieler-Einstieg · Gebäude-Baukasten · Avatar/Bewegung · Zeit-Hook

> **Entscheidungen vom 2026-06-12 (Owner):**
> 1. Einstieg = **geführter Avatar-Einstieg** (Title → Lobby → Fahrstuhl → Direktor).
> 2. Der Spieler bekommt ein **eigenes Büro als Raum im Gebäude**; der alte
>    `OfficeScreen` bleibt bis Funktions-Parität als Fallback erreichbar (wie in
>    `BUILDING_AND_ASSETS.md` vorgesehen), danach `archive/`.
> 3. Bewegung ist in v1 **atmosphärisch** (animiert, kostet nichts), läuft aber durch
>    einen zentralen Navigator mit **Zeit-Hook** — Zeitkosten sind später nur ein Parameter.
> 4. Gebäude-Grafik = **modularer Baukasten** aus Gemini-Assets (gleicher Stil-Kern wie
>    Räume/Porträts, `tools/asset-pipeline`), komponiert aus `building.json` —
>    inkl. Kamera-/Figuren-Bewegung und Figur im Fahrstuhl.

---

## 0. Problem (Ist-Stand, ehrlich)

| Problem | Beleg |
|---|---|
| Einstieg ist ein Dev-Button („📖 Story Mode starten") + Text-Intro — kein Spieler-Onboarding, visuell ohne Bezug zum Zielbild | `App.tsx:35-50`, `StoryModeGame.tsx:48-150` |
| Danach landet man je nach `viewMode` in der alten CSS/DOS-Büro-Oberfläche | `OfficeScreen.tsx`, Umschalter `StoryModeGame.tsx:587` |
| Das Gebäude ist noch das CSS-**Skelett** aus Track A-1 (Grid-Boxen, CSS-Fahrstuhl) — war als Hilfsmittel gedacht, nicht als Zielbild | `building/BuildingView.tsx` |
| Avatar/Bewegung/Zeitkonto: konzeptionell offen, nicht implementiert | `BUILDING_AND_ASSETS.md` Schritt 4 |
| ☭-Symbole in der UI verstoßen gegen die Stil-Regel „keine realen Staatssymbole" (Stil-Lock 2026-06-12, PR #73) | `StoryModeGame.tsx:74`, `OfficeScreen.tsx:489`, `MissionPanel.tsx:48`, `StatsPanel.tsx:280`, `DashboardView.tsx:294` |

**Was bereits trägt (nicht neu erfinden):**
- 67 stil-konsistente Assets aus PR #73: 5 Raum-Hintergründe, 25 Porträts (Basis + 4 Mimiken
  je NPC), `player_walk` (8 Frames) + `player_idle` (4 Frames), 5 NPC-Figuren-Sheets,
  8 Props, 17 SFX (inkl. `sfx_door_open/close`, `sfx_elevator`!), 4 Musik-Loops, Direktor-Intro vertont.
- `AssetRegistry`/`useSprite` laden alles datengetrieben; CSS-Fallback bleibt.
- `BroadcastHUD` (F1/Q/P) existiert als CSS-Entwurf inkl. Resonanz-Modell (`audienceModel.ts`).
- `building.json` als Daten-Wahrheit (Etagen/Räume/NPCs).

---

## 1. Leitbild (die MadTV/MadNews/TVTower-Analogie)

Referenzen des Owners (Screenshots 2026-06-12): MadTV (Turm-Querschnitt, Büro-Besuch mit
Charakter+Dialog, TV-Programm + Publikum), MadNews (gleiches Prinzip im Schiff, Titelseite
statt Programm, Leser statt Zuschauer), TVTower.org (offene MadTV-Reimplementierung;
Bewegung kostet dort Spielzeit).

Übersetzt auf unser Spiel:

| MadTV | Bei uns |
|---|---|
| Fernsehturm im Querschnitt | Agentur-Gebäude (3 Etagen, `building.json`) im Pixel-Querschnitt |
| Spielfigur läuft, nimmt Fahrstuhl, besucht Büros | Avatar (`player_walk/idle`) + `BuildingNavigator` (Zeit-Hook) |
| Büro-Besuch: Charakter + Dialogbox | Raum-Ansicht: Raum-Hintergrund + NPC-Porträt (mit Mimik) + DialogBox — **existiert** |
| Eigenes Büro mit Geräten (Hotspots) | Spieler-Büro als Raum im Gebäude (neu, ersetzt `OfficeScreen`) |
| TV zeigt Programm, Publikum schaut zu | `BroadcastHUD`: F1 = ausgespielte Desinfo-Maßnahme, P = Publikums-Segmente (Konzept §3 in `BROADCAST_AND_AUDIENCE_CONCEPT.md`) |
| Quote/Geld/Uhr-Leiste | S = `cost_types` + Phase + (später) Uhr |

---

## 2. Spieler-Einstieg (neu)

**Flow (geführt, überspringbar):**

1. **Title-Screen:** Gebäude-Außenansicht bei Nacht im Pixel-Stil (Asset `building_exterior`,
   MadTV-Poster-Komposition: Turm vor Stadt-Silhouette). Menü: „Neue Mission" / „Speicherstand
   laden" / Lautstärke. Musik: `music_theme_main`. Ersetzt `App.tsx`-Intro **und**
   `StoryModeGame`-IntroScreen (eine Quelle statt zwei).
2. **Ankunft (Sequenz, ~15s, skip per Klick):** Avatar betritt die Lobby (Asset
   `room_lobby`), läuft zum Fahrstuhl (`player_walk` + `sfx_door_open`), Fahrstuhl fährt zu
   Etage 1 (`sfx_elevator`, Figur sichtbar in der Kabine — Asset `elevator_cabin`).
3. **Erster Dialog:** Avatar läuft zur Zentrale, Tür auf → bestehende Raum/Dialog-Ansicht mit
   `portrait_direktor` + **vertonter Intro-Zeile** (`voice_direktor_intro` — verdrahtet).
   Der Dialog vergibt die Mission = bisheriger Intro-Text, nun diegetisch.
4. **Tutorial-Hinweis:** „Ihr Büro ist nebenan" → Spieler läuft selbst (erste eigene
   Bewegung = Tutorial), im Büro erklären 3 Hotspot-Tooltips E-Mail/Mission/TV.
5. Danach freies Spiel; `phase: 'intro'`-Logik in `useStoryGameState` bleibt die
   State-Quelle, nur die Präsentation wird ersetzt.

**Technisch:** neue Komponente `TitleScreen.tsx` + `ArrivalSequence.tsx` (nutzt dieselben
Bausteine wie das Gebäude, keine Sonder-Engine; Sequenz = Liste von Navigator-Schritten).
Dev-Zugänge (`#studio`, `#dash`, OfficeScreen-Toggle) bleiben, sichtbar nur per Hash/Dev-Flag.

---

## 3. Gebäude-Baukasten (Ersatz fürs CSS-Skelett)

**Prinzip:** Code komponiert das Gebäude aus `building.json` + generierten Bausteinen.
Neue Räume/Etagen in den Daten erscheinen automatisch im Bild — dieselbe Philosophie wie
Shot-Liste/AssetRegistry.

**Baustein-Assets (alle über `tools/asset-pipeline`, Stil-Kern v1, Chroma-Key wo nötig):**

| Asset-id | Inhalt | Format |
|---|---|---|
| `building_exterior` | Außenfassade/Title (Nacht, Stadt-Silhouette) | 1344×768 |
| `tile_facade_left/right` | Backstein/Beton-Randpfeiler | schmal, kachelbar |
| `tile_floor_slab` | Etagen-Deckenplatte | kachelbar |
| `tile_elevator_shaft` | Schacht-Segment (1 Etage hoch) | kachelbar |
| `elevator_cabin` | Kabine offen/zu (2 Zustände) + Innenraum groß genug für 32px-Figur | sheet |
| `tile_door_frame` | Bürotür zu/offen (2 Frames) | sheet |
| `room_lobby` | Erdgeschoss-Lobby (Pförtner-Loge, Aufzugtüren) | 1344×768 |
| `room_spieler_buero` | Spieler-Büro (Schreibtisch, Röhren-TV, Computer, Telefon, Tür) | 1344×768 |
| `roof_antenna` | Dach mit Antenne (MadTV-Zitat, abstraktes Emblem) | breit |

Die 5 vorhandenen `room_*`-Bilder werden im Querschnitt als „Fenster" in die Raumzellen
skaliert (wie MadTV: kleine Raum-Vignette im Turm; Klick = Raum groß).

**Rendering:** ein absolut positionierter, transform-skalierter Container („Stage") mit
Pixel-Koordinaten aus `building.json` (Zelle = `<Spalte><Etage>`, Koordinatensystem aus
`BROADCAST_AND_AUDIENCE_CONCEPT.md §6` bleibt gültig). CSS-Transforms reichen für Kamera
(pan/zoom auf Avatar folgend, `transition` oder rAF-Tween) und Figuren-Tween — **kein**
Canvas/PixiJS-Umbau nötig; `useSprite` existiert.

**Avatar & Bewegung:**
- `BuildingNavigator` (pure TS, testbar): Zustand `{ position: cellId, walking, inElevator }`,
  API `moveTo(roomId)` → Schrittliste (laufen → Schacht → Kabine → Etage → laufen → Tür).
  Jeder Schritt hat `durationMs` **und** `timeCostMin` (v1: 0) → der Zeit-Hook.
- Avatar rendert `player_walk` (gespiegelt für links) / `player_idle`; im Fahrstuhl sitzt
  die Figur in der Kabine (Container bewegt sich, Figur idle).
- NPC-Figuren (`figure_*`) stehen in ihren Räumen (vorhanden), später eigene kleine Wege.
- Sounds verdrahten: `sfx_door_open/close` bei Türen, `sfx_elevator` bei Fahrt — **Assets da**.

**Mimik:** Porträts mit 4 Stimmungen sind generiert; `DialogBox` unterstützt
`portrait_<id>_<mood>` bereits. Dialog-Daten müssen Stimmungen setzen (kleiner
DialogLoader-Hub, gleiche Stelle wie der geplante Voice-Key-Rückgabewert).

---

## 4. Spieler-Büro (ersetzt OfficeScreen schrittweise)

1. `building.json`: Raum `spieler_buero` (Etage 1, neben `zentrale`, ohne npcId).
2. Raum-Ansicht nutzt `room_spieler_buero` als Hintergrund; die heutigen OfficeScreen-Hotspots
   (TV/Computer/Telefon/Tür/Ordner) werden als positionierte Hotspots über dem Bild neu
   verankert und öffnen **dieselben Panels** (`ActionPanel`, `NewsPanel`, …) — Logik unverändert.
3. OfficeScreen bleibt über Dev-Toggle erreichbar = Paritäts-Checkliste; nach Parität → `archive/`
   (Vorgehen exakt wie `BUILDING_AND_ASSETS.md` „Umgang mit dem heutigen OfficeScreen").

---

## 5. Broadcast-HUD → Pixel-Optik (MadTV-Leiste)

Konzept und CSS-Implementierung existieren (F1/Q/P). Neu sind nur Assets + Skin:
- `hud_tv_frame` (Röhren-TV-Rahmen, F1) · `hud_paper_frame` (Zeitungs-Variante) ·
  `audience_room` (Wohnzimmer-Hintergrund, P) · 4–6 `audience_figure_*` (sitzende
  Pixel-Figuren, Mimik = Stimmungsfarbe/Haltung).
- Publikum MadTV-treu: Anzahl Figuren = Reichweite, Figurentyp = Segment, Haltung = Stimmung.
- Mechanik bleibt `audienceModel.ts` — reine Anzeige-Schicht (Leitprinzip §1 des Konzepts).

---

## 6. Sofortmaßnahmen (unabhängig, klein)

- **☭ entfernen** (5 Stellen, s. §0) → abstraktes Agentur-Emblem (z. B. ⬢ oder generiertes
  `prop_emblem`-Mini-Asset). Begründung: Stil-Regel „keine realen Staatssymbole".
- `VISION_LOCK.md §5` Amendment: (B) ist aktiver Track (dieses Dokument).

---

## 7. Phasenplan (kleine grüne Schritte, je Schritt Build+Tests grün)

| Phase | Inhalt | Abhängigkeit | Aufwand |
|---|---|---|---|
| **V0** | ☭-Ersatz · VISION_LOCK-Amendment | — | XS |
| **V1 Assets** | Baukasten-Shots in Shot-Liste (`tile_*`, `elevator_cabin`, `room_lobby`, `room_spieler_buero`, `building_exterior`, HUD/Publikum) + Generierung mit Vision-Review | Pipeline (da) | S–M |
| **V2 Stage** | BuildingView-Umbau: Stage + Baukasten-Komposition aus `building.json`, Raum-Vignetten, Kamera-Pan/Zoom | V1 (Fallback: CSS bleibt) | M |
| **V3 Navigator** | `BuildingNavigator` (pure TS + Tests) · Avatar-Tween · Fahrstuhl mit Figur · Tür-/Lift-SFX · Zeit-Hook (`timeCostMin=0`) | V2 | M |
| **V4 Einstieg** | TitleScreen · ArrivalSequence (Navigator-Skript) · Direktor-Dialog mit Voice · Tutorial-Hotspots · `App.tsx`-Intro ersetzt | V2+V3 | M |
| **V5 Büro** | `spieler_buero` in Daten · Hotspots → bestehende Panels · OfficeScreen → Dev-Fallback | V1 | S–M |
| **V6 HUD-Skin** | BroadcastHUD-Pixelisierung (TV-Rahmen, Publikums-Figuren) | V1 | S–M |
| **V7 Politur** | NPC-Wege · Ambiente (LED, Dampf) · Kamera-Feinschliff · ggf. Zeitkosten aktivieren (Owner-Entscheidung mit Balancing) | V3 | S |

Reihenfolge V4 vor/nach V5 ist tauschbar; V6 ist parallel möglich. Kein Big-Bang:
CSS-Fallbacks bleiben bis zum jeweiligen Paritätsnachweis.

---

## 8. Offen (bewusst nicht jetzt entschieden)

- **Zeitkosten-Werte** (wenn aktiviert): Minuten je Schritt vs. Phasen-Budget — braucht
  Balancing-Sitzung (TVTower als Referenz).
- **NPC-Tagesabläufe** (Figuren bewegen sich selbst) — nach V7.
- **Mehrsprachigkeit der Sequenz-Texte** — folgt bestehender i18n-Lage.
