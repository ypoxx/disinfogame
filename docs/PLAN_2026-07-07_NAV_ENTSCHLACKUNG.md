# 🧭 PLAN: Navigations-Entschlackung & präzise Büro-Hotspots

**Status:** Aktiv — vom Owner beauftragt (2026-07-07, Session-Transkript)
**Aktualisiert:** 2026-07-07
**Scope:** Story
**Grundlage:** `ZIELBILD_2026-07-04_WETTRENNEN.md` §6/§12 · `STRANG2_FEINPLAN_2026-06-13_DIEGESE.md` (E1/A1/§4.4) · `PLAN_2026-07-06_UI_LUXUS.md` (L-Etappen)
**Verhältnis zu L3/L4/L5:** N3 nimmt den L3-Kern (Queue geht in der Tafel auf) **ohne** die Luxus-Animationen vorweg; L4 (Berater→Kontakte) und L5 (HUD-Objekt-Leiste) bleiben unberührt und werden durch N0–N3 leichter.

---

## 0. Anlass (Owner-Frage) und Methode

Owner-Frage: *„Was spricht noch für das HUD? Braucht es alle Elemente im Büro? …
Meine die teils doppelten oder dreifachen Navigationselemente."* — mit ausdrücklichem
Auftrag: planen, festhalten, umsetzen, nachkontrollieren; **präzise Vermessung statt
platter rechteckiger Klick-Container**; neues Büro-Asset erlaubt, wenn nötig.

Methode: Live-Ernte einer frischen Partie (Tag 1) per Playwright über den
`?vqa=1`-Hook, 12 Zustände (Büro/Gebäude × HUD an/aus × Panels/Overlays), Viewport
1280×800. Reproduzierbar über `scripts/visual-review/nav-audit.mjs` (Teil dieses
Pakets). Zusätzlich Quellbild-Vermessung von `room_spieler_buero.png` (1344×768)
per sharp-Crops in Originalauflösung.

## 1. Befunde (verifiziert am 2026-07-07)

### 1a. Sechs gleichzeitige Chrome-Schichten (Tag 1, Grundzustand)

| # | Schicht | Beleg (Code) | Problem |
|---|---|---|---|
| B1 | **Aktionen-Warteschlange** schwebend, default AUSGEKLAPPT, auch leer | `panelStore.ts:66` (`queueCollapsed: false`), `StoryModeGame.tsx:1631` | **Verdeckt den FEIERABEND-Knopf** der Büro-Unterleiste — der wichtigste Schleifen-Knopf ist für Erstspieler unsichtbar; Panel zeigt dabei nur „Keine Aktionen geplant" |
| B2 | ☰-Pause + „HUD · H"-Knöpfe, `fixed top-right z-50` | `StoryModeGame.tsx:944–965` | **Verdecken die Tagesuhr** (DayClock, `absolute top-2 right-2 z-40`); bei offenem Panel verdecken sie den MISSION-Reiter; sie schweben über Vollbild-Overlays (Terminal/Tafel/Lagebild) |
| B3 | Berater-Leiste (5 Buchstaben-Knöpfe), `fixed right-0 top-16 bottom-0` | `AdvisorPanel.tsx:87/133` | Zweites Dauer-HUD; schwebt ebenfalls **über** Terminal/Tafel/Lagebild |
| B4 | Broadcast-Streifen (permanent, unten) | `BroadcastBar.tsx` | gewollt/diegetisch — bleibt |
| B5 | Büro-Unterleiste (Dienstausweis + FEIERABEND) | `PlayerOfficeView.tsx:446–485` | ok, aber von B1 verdeckt |
| B6 | HUD (Taste H) + Sub-HUD + Ziel-Tracker unten links | `StoryHUD.tsx` | Tracker überlappt Broadcast-Text; zeigt das ALTE Zielvokabular (s. B9) |

### 1b. Vier parallele Navigationssysteme (Dopplungs-Matrix)

| Ziel | Weg 1 | Weg 2 | Weg 3 | Weg 4 |
|---|---|---|---|---|
| Aktion wählen | Computer-Hotspot | Taste A | Berater-Sprung | **Tafel: eigener Voll-Katalog** |
| Aktion ausführen | Terminal AUSFÜHREN | **Tafel SOFORT** | **Queue-Widget Ausführen** | — |
| Nachrichten / Ereignisse / Kontakte / Mission / Stats | Hotspot (teils) | Hotkey | **SidePanel-Tab-Bar** (`SidePanel.tsx:12`, 5 Reiter) | Berater-Leiste (Team) |

Die Tab-Bar ist ein viertes, in keinem Plan dokumentiertes Navigationssystem;
STATISTIK/MISSION haben Reiter+Hotkey, aber keinen Hotspot (Asymmetrie).

### 1c. Hotspots passen nicht zum Raumbild (P0 der Diegese)

Die Hotspot-Rechtecke (`PlayerOfficeView.tsx:80–90`, % vom Container) wurden auf
einem **anderen Stand des Raumbilds** eingemessen und driften zusätzlich
strukturell: Das Bild wird pixel-cover-gesnappt **unten-zentriert** verankert
(`usePixelCover`), die Hotspots sind aber %-vom-Container — jede
Layout-Änderung (Broadcast klappt aus, Panel öffnet, HUD an) verschiebt die
Klickzonen relativ zu den Möbeln. Sichtbare Folgen (Screenshots, Tag 1):

- CRT-„Glüh"-Overlay rahmt das **Korkbrett** statt des Computers;
- Tutorial-Marker ① „Aktionen planen" zeigt aufs Korkbrett, ② „Tafel planen" auf
  nackten Beton, ③ „Lagebild" auf einen leeren Pfeiler;
- Der `tv`-Hotspot (LAGEBILD) liegt bei links≈83 % — der echte Wand-Monitor hängt
  **oben links** (Quelle ≈ x 312–438, y 210–360);
- TV-Flacker-Overlay animiert eine Stelle ohne Gerät (rechter Pfeiler).

### 1d. Zwei Zielmodelle gleichzeitig (Wettrennen vs. Alt-Vokabular)

HUD sagt „SONNTAGSFRAGE 9,0 % → Zielstrich" (Zielbild §6), aber gleichzeitig:

- HUD-**ObjectiveTracker** unten links: „Westunion destabilisieren 0/2";
- **Narrativ-Tafel-Kopf**: „ZIEL: Westunion destabilisieren — Stand 100 · Ziel unter 40";
- **Lagebild**: Karten RISIKO/AUFMERKSAMKEIT (laut §12.4 keine Anzeigen mehr, nur
  Abwehr-Zuflüsse), Gesellschafts-Meter inkl. INFORMATIONSLAST (laut §6 gestrichen),
  „Auftrags-Fortschritt %" statt Sonntagsfrage, altes Missionsziel-Vokabular.

Der Spieler bekommt drei Erklärungen, worum es geht. §6-Regel: Die zwei Läufer
sind die Wahrheit; Vertrauen ist Mittel, nicht Ziel.

### 1e. Kleinbefunde

- `BetrayalWarningBadge` wird importiert, aber nie gerendert (`StoryModeGame.tsx:23`) — toter Import.
- Ausgangs-„Tür" ist ein unsichtbarer 6-%-Streifen am linken Rand; im Bild ist die
  große Glasscheibe (Quelle ≈ x 50–228) als Tür interpretierbar, hat aber keinen Griff.

## 2. Vermessung `room_spieler_buero.png` (1344×768, Quelle der Wahrheit)

Per sharp-Crops in Originalauflösung eingemessen (Bild-Pixelkoordinaten; finale
Polygone leben in `src/story-mode/components/officeHotspots.ts` und werden per
Overlay-Screenshot verifiziert):

| Objekt | Funktion | Bild-Koordinaten (ca.) |
|---|---|---|
| Wand-Monitor (geneigt, türkis) | LAGEBILD | x 312–438, y 210–360 (Polygon, geneigt) |
| Korkbrett | NARRATIV-TAFEL | x 459–637, y 303–436 |
| CRT + Tastatur | AKTIONEN (Terminal) | x 385–495, y 390–497 |
| Telefon | KONTAKTE | x 328–398, y 478–508 |
| Ordner + Ablagestapel | NACHRICHTEN | x 455–570, y 430–487 |
| Fenster | WELT-EREIGNISSE | x 654–945, y 132–468 |
| Glastür links | ← GEBÄUDE | x 48–232, y 25–745 (Trapez, Perspektive) |
| Poster rechts | — Deko (kein Hotspot) | x 988–1140, y 228–425 |

**Asset-Entscheidung:** Das Bild enthält alle sieben Funktionen → **kein neues
Raumbild nötig.** Optional (Budget freigegeben): kleiner Türgriff-/Druckstangen-Prop
per `pixel-asset-pipeline`, in die PNG einkomponiert, damit die Glastür ohne Hover
als Tür lesbar ist. Wird nur übernommen, wenn der Vision-QC besteht; die
Vermessung bleibt davon unberührt (Rest des Bilds pixelidentisch).

## 3. Etappen

### N0 — Sofort-Fixes Chrome-Kollisionen *(kleinster Eingriff, größte Wirkung)*
1. Queue-Widget: bei leerer Queue **nicht rendern**; sonst default **eingeklappt**
   (`queueCollapsed: true`); Position über die Büro-Unterleiste gehoben, damit
   FEIERABEND nie wieder verdeckt wird. *(Widget fällt in N3 ganz — N0 schützt
   den Zwischenstand.)*
2. Ecke oben rechts = **ein** Cluster: DayClock + ☰ + „HUD · H" in einer Reihe im
   selben Container (Welt-Fläche), keine Überlappung, auch bei offenem Panel.
3. Vollbild-Overlays (Terminal, Tafel, Lagebild, Newsroom, Fokusgruppe, Pre-Test,
   Operations-Akte, Dossier) verdecken das Chrome: Berater-Leiste + Eck-Cluster
   werden bei offenem Overlay ausgeblendet (ein gemeinsames
   `fullscreenOverlayOpen`-Flag statt z-Index-Wettrüsten).
4. Toten Import `BetrayalWarningBadge` entfernen.

### N1 — Präzise Hotspots, bildverankert *(Owner-Wunsch: keine platten Rechtecke)*
1. Neues pures Modul `officeHotspots.ts`: Polygone in **Bild-Pixelkoordinaten**
   (Tabelle §2), BBox-/Transform-Helfer (Bild→Container über den vorhandenen
   `CoverSnap` + unten-zentriert-Anker). **Unit-Tests** für die Mathematik.
2. `PlayerOfficeView`: SVG-Overlay (`viewBox 0 0 1344 768`) exakt über der
   gesnappten Bildfläche; je Hotspot ein `<polygon>` (role=button, Tastatur-fokus,
   aria-label). Treffer = Polygon, nicht BBox. Hover = Kontur + Insel-Highlight;
   Ruhe = Eck-Marken an der Polygon-BBox (bisherige Bildsprache bleibt).
3. Mikro-Animationen neu verankert: CRT-Glow auf den CRT-Schirm, Flacker auf den
   **Wand-Monitor** (das frühere „TV rechts" existiert im Bild nicht).
4. Tutorial-Marker + Badges aus den Polygon-BBoxen positioniert (kein Drift mehr).
5. Funktions-Korrektur: LAGEBILD am Wand-Monitor **oben links**.
6. Verifikation: Overlay-Screenshots (Polygone eingezeichnet) in 3 Viewports ×
   Zuständen (Broadcast auf/zu, Panel auf/zu, HUD an/aus) — Polygone müssen auf
   den Möbeln liegen.

### N2 — Ein Zielvokabular (Wettrennen überall)
1. HUD: ObjectiveTracker entfällt (Zielbild §6: „genau vier Größen" — der Tracker
   ist Nr. 5 und spricht alt). Ziele wohnen in der Akte (MissionPanel/M) und an
   der Tafel.
2. Tafel-Kopf: statt „destabilisieren unter 40" die zwei Läufer — „SONNTAGSFRAGE
   x % / Ziel y %" + „ABWEHR z/100" (Quelle: `getWahlabendData()`, `getAbwehr()`).
3. Lagebild: RISIKO-/AUFMERKSAMKEIT-Karten und Gesellschafts-Meter raus (§12.4/§6);
   stattdessen die vier HUD-Größen + Läufer-Balken mit Zielstrich/Stufen; Blöcke
   Ziele/Nachrichten/Team bleiben (READ-ONLY-Charakter unverändert).

### N3 — Navigations-Dedup (ein sichtbarer Weg pro Ziel)
1. SidePanel-**Tab-Bar entfernen**: Panels öffnen nur noch über Hotspots (+ stille
   Hotkeys, in der ?-Hilfe dokumentiert). A1 gewahrt: jede Funktion behält
   mindestens einen Weg (Stats = S, Mission = M).
2. Tafel verliert den **Zweitkatalog**: „MASSNAHMEN je Büro" entfällt; die Tafel
   zeigt angeheftete Karten (Queue) + Stränge/Fäden + Verweis „Maßnahmen wählen am
   Terminal [A]". Regel steht: **Terminal WÄHLT, Tafel PLANT/SPIELT AUS**
   (PLAN_2026-07-06 §4.1). Ausführen gibt es genau zweimal: Terminal (sofort),
   Tafel (geplant ausspielen).
3. Schwebendes **Queue-Widget entfällt ersatzlos** (L3-Kern): Queue lebt an der
   Tafel; der Tafel-Hotspot bekommt einen Angeheftet-Zähler-Badge.
4. Bewusst NICHT in diesem Paket: Fenster/Akten-Merge (Fenster = Welt draußen ist
   diegetisch stark; nur die Datenquelle überlappt — spätere Option), L4
   (Berater→Kontakte), L5 (HUD-Objekt-Leiste).

## 4. Definition of Done

- [ ] FEIERABEND in jedem Zustand sichtbar und klickbar; Tagesuhr immer lesbar.
- [ ] Kein Dauer-Chrome über Vollbild-Overlays.
- [ ] Hotspot-Polygone liegen in allen getesteten Viewports/Zuständen auf den
      Möbeln (Overlay-Screenshot-Nachweis); Marker/Badges/Animationen driftfrei.
- [ ] Klickzonen sind Polygone (Treffer = Möbel-Silhouette, nicht BBox).
- [ ] Kein UI-Element spricht mehr das Alt-Vokabular (destabilisieren/Risiko/
      Aufmerksamkeit/Informationslast als Anzeige).
- [ ] Aktion wählen hat genau einen sichtbaren Ort (Terminal), ausführen genau
      zwei (Terminal sofort, Tafel ausspielen), Queue genau einen (Tafel).
- [ ] Gates grün: `npm run build` + `npx tsc --noEmit` + `npx vitest run`.
- [ ] Nachkontrolle: `nav-audit.mjs`-Ernte nachher, Sichtprüfung aller Punkte;
      Code-Review über den Gesamtdiff.

## 5. Umsetzungs-Status

- [ ] N0 Chrome-Fixes
- [ ] N1 Hotspot-Vermessung + SVG-Polygone (+ optional Tür-Prop)
- [ ] N2 Zielvokabular
- [ ] N3 Dedup (Tab-Bar, Tafel-Katalog, Queue-Widget)
- [ ] Verifikation + Review
