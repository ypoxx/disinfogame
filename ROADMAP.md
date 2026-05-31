# 🗺️ Roadmap (kanonisch)

> **Status:** Aktiv — die EINE gültige Roadmap · **Aktualisiert:** 2026-05-31 · **Scope:** Story Mode
> Verbindliche Projektwahrheit (Figuren, Zahlen, Stil, Entscheidungen): **[`docs/VISION_LOCK.md`](docs/VISION_LOCK.md)**
> Einstieg/Startanleitung: **[`START_HERE.md`](START_HERE.md)**

## Worauf wir hinarbeiten
**Story Mode im MadTV-/TVTower-Stil:** ein **mehrstöckiges Gebäude im Querschnitt**, klickbare Räume
(= NPCs/Funktionen), durch das **kleine Figuren laufen** — in konsistentem brutalistischem Pixel-Art-Look,
gespeist aus einer **Grafik-Pipeline** („Backend" für Assets).
Heute sichtbar ist erst **ein** Büro-Raum (`OfficeScreen`). Der Weg dahin steht detailliert in
**[`docs/BUILDING_AND_ASSETS.md`](docs/BUILDING_AND_ASSETS.md)**.

Der frühere abstrakte **Pro Mode** ist eingefroren und liegt in `archive/pro-mode/`.

---

## Track A — Visuelle Verwandlung zum Gebäude *(Priorität, das eigentliche Ziel)*
Details & Schritte: **[`docs/BUILDING_AND_ASSETS.md`](docs/BUILDING_AND_ASSETS.md)**.
1. **Gebäude als Daten + Querschnitt-Ansicht** (klickbar, ohne Figur) — `building.json` + `BuildingView` als neuer `viewMode`; der heutige `OfficeScreen` bleibt als **„klassische Ansicht"/Referenz** erreichbar (Abzweigung), bis das Gebäude gleichwertig ist (dann ins Archiv). *Erster sichtbarer TVTower-Schritt — zugleich erste Skizze & Doku.*
2. **Grafik-Pipeline** — `sprite-tool` um Sprite-Sheet-Zusammenbau erweitern; konsistente Assets über den Stil-Guide; `public/assets/` + `assets.json` datengetrieben laden.
3. **Räume grafisch** statt CSS (je Raum ein Hintergrund-Asset).
4. **Laufende Figur (Avatar) + NPC-Figuren** — hängt nur an **einem** Lauf-Zyklus-Asset; `useSprite`-Bauplan steht in `BUILDING_CONCEPT.md`.
5. **Politur** — Ambiente-Animationen, Übergänge, Schritt-/Tür-Sounds.

## Track B — Story-Tiefe & Spielgefühl *(parallel, inhaltlich)*
- Dialog-System weiter verbessern (Reaktions-Fix ist erledigt — siehe `docs/DIALOGUE_DIAGNOSIS.md`); mehr Reaktionen/Themen/Endings.
- Balance & Konsequenzen spürbarer machen (die `attention`-Kopplung, NPC-Moral/Verrat).
- Inhalt nutzen, der schon da ist (Taxonomy, Combos, Welt-Events) — siehe `CLAUDE_INSTRUCTIONS.md`.

## Track C — Engine-Hygiene *(sekundär, nur nach Bedarf)*
Die drei großen Dateien — `StoryEngineAdapter.ts` (5119 Z.), `useStoryGameState.ts` (1447 Z.),
`DialogLoader.ts` (1336 Z.) — **nicht** als großen Vorab-Umbau zerlegen. Stattdessen **gezielt** dort
aufteilen, **wo Track A/B es konkret verlangt** (z. B. einen sauberen Gebäude-/Navigations-Zustand aus
`useStoryGameState` herauslösen, wenn Track A Schritt 1 drankommt). Build/Tests nach jedem Schnitt grün halten.

> **Antwort auf „lohnt sich das Zerlegen jetzt?"** — Für das TVTower-Ziel **nein, nicht als Selbstzweck**.
> Die Gebäude-/Asset-Arbeit ist überwiegend **neuer** Code (Track A) und braucht den Umbau nicht vorab.
> Zerlegen passiert **begleitend**, in kleinen, geprüften Schnitten, wenn ein Feature es nötig macht.

---

## Empfohlene nächste 3 Schritte (konkret)
1. **Track A‑1:** `building.json` + `BuildingView` (Querschnitt, klickbar) — OfficeScreen als erster Raum einhängen.
2. **Track A‑2 (a):** `sprite-tool` Sprite-Sheet-Export bauen (Frames → PNG-Raster + JSON).
3. **Track A‑4:** erstes Figuren-Sprite-Sheet erzeugen und mit `useSprite` einbauen.

## Bewusst NICHT jetzt entschieden
- Genaue Etagen-/Raum-Aufteilung final (Vorschlag steht in `BUILDING_CONCEPT.md`).
- Pixel-Art vs. KI-Foto-Look pro Raum (Pipeline unterstützt beides).
- Story-Länge in „Phasen".

*Details je Schritt werden vor Beginn mit dem Projektinhaber abgestimmt.*
