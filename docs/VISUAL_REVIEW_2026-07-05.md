# 🔎 VISUAL REVIEW 2026-07-05 — optisches Gesamt-Review (Befunde + Plan, KEINE Fixes)

**Status:** Befund-Dokument. Es wurde NICHTS generiert und NICHTS gefixt — Umsetzung erst
nach Owner-Budget-Freigabe (Shot-List-Plan in §6).
**Methodik:** wiederverwendbare Playwright-Ernte über alle Screens/Zustände
(`desinformation-network/scripts/visual-review/`, README dort) → 105 Artefakte
(94 Screenshots inkl. Boden-Linien-Overlays, 11 Video-Clips) → zweischichtige
Realitätssicht (pixelgenaue Geometrie ohne KI + Wahrnehmungs-Prüfung mit eingezeichneter
Engine-Boden-Linie) → orchestriertes Vision-Review (parallele Prüfer je Screen-Bündel
gegen Stil-Bibel `GESAMTKONZEPT_VISUELL.md` §4 + M1–M8; Gemini 3.1 Pro als Zweitmeinung,
Haupt-Prüfer für die Video-Clips) → **jeder Befund adversarial verifiziert** →
Regressions-Sweep der früher gefixten Klassen (V7-Schweben, Wand-Fuß-Linie, V9-Kacheln).

> Lese-Reihenfolge für die nächste Session: dieses Dokument → §6 Shot-List-Plan →
> `scripts/visual-review/README.md` (Ernte wiederholen/erweitern).
> **Owner-Galerie (Top-Befunde in einfacher Sprache, annotiert):**
> https://claude.ai/code/artifact/e7d66e94-a4bb-4c53-9e0f-c31a6a96d380

---

## 1. Realitätssicht, Schicht a — pixelgenaue Messung (ohne KI)

Referenz-Maßstab: **Avatar = 1,75 m = 128 px ⇒ 73,1 px/m.** Engine-Soll-Standlinie =
Wand-Fuß-Linie (`floor.y + STAGE.floorHeight − STAGE.floorStrip`). Gemessen wurde je
sichtbarem Element die tatsächliche Pixel-Unterkante (DOM-Box × Alpha-Scan der Assets,
Schwelle 8 wie `pixel-asset-pipeline`). Voller Report: `runs/visual-review/latest/geometry-report.json`.

### 1.1 Standlinien: die Objektklassen sind gegeneinander versetzt (Kern-Messbefund)

| Klasse | sichtbare Unterkante vs. Boden-Linie | Ursache | Einordnung |
|---|---|---|---|
| Deko-Props (Pflanze, Automat, Bank, …) | **exakt AUF der Linie (0 px)** | Assets sauber getrimmt (padBottom 0) | ✅ Referenz-Klasse |
| Avatar (m + w) | **6 px darüber** | bewusster `−6`-Offset in `walkY` (`buildingLayout.ts:94`) | Code-Fix (Offset entfernen oder für alle Klassen vereinheitlichen) |
| Türen (alle 5 Etagen) | **7,5 px darüber** | **eingebacktes Boden-Padding: 10 px Transparenz** im 192-px-Asset (`bld_door_closed` padB=10, `bld_door_open` padB=9) | Asset-Korrektur (trim) ODER Code-Kompensation |
| Statisten/Pförtner/Tür-Dummies/Walker | **11–16 px darüber** (clerk 16 px Etage 3/4, 11 px Etage 1 · cleaner_walk 16 px · Pförtner 13 px) | `PixelSprite`-Span (96 px nativ) richtet sich im höheren Container (112/116 px) NICHT an der Container-Unterkante aus; `transformOrigin: bottom` skaliert von der Span-Unterkante bei y=96 | **Code-Fix (eine Stelle, heilt 4 Figuren-Typen)** |

Der frühere V7-Fix (Avatar-Schweben) hält für den AVATAR; die Statisten-Klasse aus
Strang 5 hat denselben Fehler-TYP an anderer Stelle neu eingeführt → Regressions-Befund.

### 1.2 Maßstabs-Tabelle (sichtbare Höhe in Metern, Klassen über Etagen konsistent?)

| Klasse | gemessen | Soll-Bereich (aus 1,75-m-Referenz) | Konsistenz über Etagen |
|---|---|---|---|
| **Tür** | **1,77 m = 1,01 H** | 1,9–2,3 m (Stil-Bibel: **1,15 H ≈ 2,0 m**) | ✅ einheitlich — aber **klassenweit zu klein**: Tür = Avatarhöhe wirkt gedrungen; Ursache ist das eingebackene Padding (Box 144 px stimmt, sichtbar nur ~130 px) |
| Statisten-Figuren | 1,53 m | 1,5–1,95 m | ✅ (bewusst etwas kleiner als Avatar) |
| Pförtner | 1,56 m | 1,5–1,85 m | ✅ |
| Pflanze groß | 1,48 m | 1,0–1,9 m | ✅ |
| Pflanze klein | 0,60 m | 0,5–1,2 m | ✅ |
| Wasserspender | 1,31 m | 0,9–1,4 m | ✅ |
| Getränkeautomat | 1,91 m | 1,5–2,0 m | ✅ |
| Kaffee-Station | 1,42 m | 0,85–1,5 m | ✅ (obere Kante) |
| Bank | 0,74 m | 0,7–1,1 m | ✅ |
| Stühle | 0,90 m | 0,7–1,2 m | ✅ |
| **Aktenvernichter** | **1,20 m** | 0,5–1,1 m | leicht drüber (brusthoher Shredder — vertretbar, Owner-Blick) |
| Mülleimer | 0,74 m | 0,3–0,9 m | ✅ |
| Fahrstuhl-Kabine | 2,86 m | (Schacht) | ✅ plausibel; **aber Content-Sprung offen↔zu: 194 vs. 209 px** → sichtbarer Versatz beim Überblenden |

**Fazit Schicht a:** Die Möbel-/Geräte-Skala ist insgesamt bemerkenswert konsistent
(Ergebnis der Pipeline-Disziplin). Die drei echten Ausreißer sind die
**Standlinien-Klassen-Versätze (1.1)**, die **zu kleine sichtbare Türhöhe** und der
**Kabinen-Content-Sprung** — alle drei mit Pixel-Beleg, alle drei günstig behebbar.

### 1.3 Asset-Padding-Audit (218 Assets)

Alle im Gebäude platzierten Props/Figuren-Sheets sind sauber getrimmt (padBottom 0).
Eingebacktes Padding tragen: `bld_door_closed/open` (10/9 px unten — s. o.),
`elevator_cabin_open` (16 px unten vs. 7 px bei `closed`), sowie (unkritisch, da nicht
bodenstehend platziert) `prop_coffee` 246 px, `prop_safe` 165 px, `prop_world_map` 144 px
und mehrere `icon_*` (asymmetrische Content-Boxen — für Icon-Ausrichtung relevant).
Voll-Liste: `runs/visual-review/latest/asset-audit.json`.

## 2. Vision-Review — bestätigte Befunde, priorisiert

**Statistik:** 16 Prüf-Bündel (11 Screen-Bündel + Realitätssicht + 4 Video-Gruppen) →
172 Roh-Befunde → adversarial verifiziert: **115 bestätigt** · 37 widerlegt · 7 Duplikate ·
24 ohne abgeschlossene Verifikation (davon die wichtigsten unten von der Session selbst
nachverifiziert, Rest im Anhang als „unverifiziert" markiert).
**Voll-Liste:** `VISUAL_REVIEW_2026-07-05_BEFUNDE.json` (alle Befunde inkl. Belegen,
Widerlegungs-Begründungen und Quelle claude/gemini/beide).

Priorisierung in fünf Handlungspakete — **P1/P2 heilen mit wenigen Code-Stellen ganze
Befund-Familien**, P3–P5 sind Einzelkorrekturen.

### P1 — Fundament „aus einem Guss" (systemische Code-Fixes, heilen viele Screens)

| # | Befund | Regel | Beleg | Kategorie |
|---|---|---|---|---|
| B1 | **Die ganze Welt-Ebene wird nicht-ganzzahlig skaliert** (Gebäude ≈ ×0,544, Raum-Nahsicht `cover` ≈ ×0,94, NPC-Halbfiguren beliebig) und dabei weichgezeichnet — Bitmap-Schrift und Sprites sind überall matschig statt knackig. Der §4.1-Kern („nur ganzzahlig, pixelated") ist an der Wurzel verletzt; JEDER andere Politur-Schritt wirkt erst nach diesem Fix voll. | §4.1 | pfoertner_bubble, dialog_marina, alle Gebäude-Shots | code-fix |
| B2 | **Zwei Schriftsysteme parallel:** Titel, Avatar-Wahl (komplett), Überspringen-Button, BILDUNGSZWECK-Box u. a. nutzen glatte Web-Sans mit Anti-Aliasing neben der Pixel-Font — der erste Eindruck (Einstiegs-Strecke!) bricht §4.5. | §4.5/§4.6 | title, avatar_choice, arrival_early | code-fix |
| B3 | **Seiten-Panels = flache Web-Sidebar** über volle Bildschirmhöhe statt diegetischem Pixel-Bildschirm/HUD-Rand (V14 unverändert offen); zusätzlich verdecken die schwebenden ≡/HUD-Buttons zwei Panel-Tabs (u. a. den aktiven). | §4.4/V14, M8 | panel_actions…panel_events, panel_mission | code-fix |
| B4 | **Floating-Widgets über der Welt:** „AKTIONEN-WARTESCHLANGE" hängt permanent unten rechts (verdeckt Publikums-Panel, FEIERABEND-Button, Ticker), „AKTUELLES ZIEL" überdeckt die Ticker-Zeile (V6-Familie unverändert). | §4.4/V6, M8 | floor_directory, broadcast_expanded, hud_on, office | code-fix |
| B5 | **Tag-Briefing blockiert nicht:** Morgenbriefing bleibt während Lauf/Fahrstuhl/Raum-Betreten geöffnet, Navigation läuft durch das Modal hindurch, der Dialog ersetzt es kommentarlos. | M8 | clip_elevator | code-fix |

### P2 — Realitätssicht/Standlinien (Messwerte aus §1 + Wahrnehmung bestätigt)

| # | Befund | Beleg | Kategorie |
|---|---|---|---|
| B6 | **Statisten/Pförtner/Walker/Tür-Dummies schweben 11–16 px** über der Wand-Fuß-Linie („Füße enden mitten im Wandsockel") — EIN `PixelSprite`-Container-Fix heilt alle vier Figuren-Typen. V7-Fehler-Typ an neuer Stelle. | building_etage3/4, overlay-Renders, §1.1 | code-fix |
| B7 | **Türen schweben 7,5 px** (eingebacktes Asset-Padding) UND sind sichtbar nur **1,77 m ≈ 1,01 H** hoch — „NPC-Kopf stößt an den Sturz". Trim von `bld_door_closed/open` behebt beides zugleich (danach ~1,97 m ≈ 1,13 H). | building_lobby_day, building_etage4, §1.2 | asset-korrektur |
| B8 | **Avatar-Offset −6 px** (walkY) — nach B6/B7 als letzte Klasse auf die gemeinsame Linie ziehen. | §1.1 | code-fix |
| B9 | **Fahrstuhl-Z-Ordnung:** Während der Fahrt wird der Avatar VOR den geschlossenen Kabinentüren gerendert (Türnaht läuft durch die Figur); Ein-/Ausstieg „ploppt" ohne Choreografie (<0,5 s Positionswechsel bei zu). | clip_elevator, clip_arrival | code-fix |
| B10 | **Untergrund zeigt eingerichtete Nachbarräume:** Links neben dem Keller sind im `bld_underground`-Band voll möblierte Innenräume (Monitore, Serverschrank) sichtbar — Röntgenblick-Verbot §4.3 im Asset verletzt. | building_lobby_day (unten links) | asset-korrektur |
| B11 | **Sprite-Fragment an der Operationszentrale-Tür** (~10×14 px Schwarz/Weiß/Türkis-Rauschen in Griffhöhe, halb über dem Türblatt) — kaputtes Detail im Korridor-Asset oder Deko-Fehlplatzierung. | building_etage4 | asset-korrektur |
| B12 | Kleinere Realitäts-Brüche: Kaffeeküche ragt in Katjas Türöffnung (Möbel im Türweg) · Wanduhr hängt auf 1,4 m Brusthöhe mit ausgefransten Rauschpixeln · Wartestühle/Bank in leichter ¾-Draufsicht im streng frontalen Flur · Geldzählmaschine bei Igor ~doppelt real groß · Statist mit Aktenmappe ~15 % kleiner als Nachbar-Figuren. | building_lobby_day, dialog_igor, building_avatar_f | asset-korrektur |

### P3 — Wahlabend & Enden (Etappe-5-Politur)

| # | Befund | Beleg | Kategorie |
|---|---|---|---|
| B13 | **CSS-TvSet trägt die Szene nicht** (riesige leere dunkle Fläche, kein TV-Gehäuse/Raumkontext „dunkles Büro") — der bekannte E17-Zwischenstand; Ausgestaltung siehe Shot-List Paket A. | end_*_wahlabend_s0/s1 | **neues-asset** |
| B14 | **End-Report zeigt die 8 Alt-Enden von VOR Etappe 5** („MÖGLICHE SPIELENDEN": Sieg/Pyrrhussieg/Enthüllung/Flucht/…) und markiert bei Timeout- UND Immun-Ende fälschlich „✓ Enthüllung (erreicht)" — widerspricht dem eigenen Report-Titel und dem EIN-Sieg-/DREI-Verlustwege-Modell. Session-nachverifiziert. | end_timeout/immune_endreport_mid | code-fix |
| B15 | **Englischer GameEndScreen-Titel** („A Manufactured Majority") ragt hinter dem deutschen Report-Modal hervor; zusätzlich bleibt der HUD-Button als abgeschnittenes „STÄNDIGER LAGEBERICHT ▸" sichtbar. Session-nachverifiziert. | end_victory_wahlabend_s3, end_*_gameend | code-fix |
| B16 | **Debrief-Text passt nicht zum Branch:** Beim Timeout-Ende („Regierung bestätigt, nicht enttarnt") erzählt der Fließtext Verhaftungs-/Enttarnungs-Inhalte. | end_timeout_wahlabend_s3 | code-fix |
| B17 | Wahlabend-Layout/Detail: Balken wächst nicht (steht ab Frame 1 auf Endwert — die Kern-Dramaturgie entfällt) · Prozent-Label klebt am Track-Ende statt am Füllstand · Schritt 2/3 überlaufen den Viewport (TV oben abgeschnitten, WEITER-Button angeschnitten) · GEFÄLSCHT-Stempel anti-aliased statt pixelig · Milieu-Chips grammatisch falsch („Die Optimierer schaltet ab"). | clip_wahlabend_victory, end/fixture_wahlabend_* | code-fix |
| B18 | Tagesfazit/Briefing tragen Alt-Metriken: Deutungshoheits-Balken Ministerium↔Institutionen im DayReport-Fuß, Briefing-Hinweis argumentiert über „Vertrauensbruch/2 % des Ziels" statt Sonntagsfrage/Abwehr; Milieu-Balken in „DAS LAND" praktisch leer trotz ~35 % Belief; Mood-Label zeigt rohe ID „wuetend". Session-nachverifiziert (day_report). | day_report, morning_briefing | code-fix |

### P4 — Text-/M4-Sweep (billig, hohe Wirkung — ein Durchgang)

| # | Befund | Beleg |
|---|---|---|
| B19 | **Fehlende Umlaute in Versal-Texten:** „NUR FUR AUTORISIERTES PERSONAL", „Abteilung fur Sonderoperationen", „RESSOURCEN-ANDERUNGEN", „Kapazitat:", „0 BEITRAEGE" — vermutlich Glyphen-Lücke der Pixel-Font bzw. bewusste ASCII-Ausweichschreibung; ein Font-/Text-Fix schließt die Familie. | panel_mission, action_feedback, newsroom |
| B20 | **Englische Reste:** Karten-Tags „#infrastructure #automation #digital", Panel-Titel „TRENDING TOPICS"/„SOCIAL FEED", Maßnahme „Social Listening". | panel_actions, newsroom, board_korkbrett |
| B21 | **Ligatur-Bug:** ff/fi/fl werden als Ligatur-Glyphen gerendert und wirken im Pixel-Raster wie fehlende Buchstaben („Differenzierung"). | fokusgruppe |
| B22 | **Irreführende Zahlen:** Ziel-Chip „Westunion destabilisieren 100/40" (liest sich als 100 von 40); Lagebild-Fortschrittsbalken fast voll bei „0/2 erledigt". | board_korkbrett, lagebild |
| B23 | **„$"-Währung** auf Karten/Bilanz/HUD („KASSE $150K") in der fiktiven Ost-Block-Welt — Welt-Kohärenz-Frage (Alternative: ₴-artiges Fantasie-Zeichen oder „K" ohne Symbol). | board_direct, hud_on, panel_stats |
| B24 | Abgeschnittene Texte (M8-Familie): Spiel-Uhr hinter Schnellzugriffs-Spalte (nur „13" lesbar) · „$150K"→„$15" im Stats-Panel · „Kosten-Rabatt"→„Kosten-Rabat" · Dialog-Option [5] halb abgeschnitten · Entscheidungs-Beat-Option D mitten im Satz gekappt (Modal höher als Bildschirm). | hud_on, panel_stats, panel_actions, clip_door_dummy, decision_beat |

### P5 — Einzelbefunde (Auswahl; Rest im JSON-Anhang)

- **Büro-Hotspots (V13 nur teilbehoben):** Zuordnung verrutscht — ② „Tafel planen" auf leerer Wand, Korkbrett trägt ①, ③ „Lagebild" auf Betonpfeiler ohne TV-Objekt; grüne Markierungs-Region ~doppelt so breit wie das Korkbrett; unbeschriftete gelbe Eckwinkel auf Leerflächen; Drahtgitter-Overlay im Broadcast-Zustand sichtbar (office, hud_on, broadcast_expanded).
- **Tag/Nacht:** Skyline-Blende zerfällt zur goldenen Stunde in Farbblöcke mit harten Nähten (sky_1425) · Sterne bleiben mittags sichtbar (sky_1200) · Nacht-Skyline hat eine kaputte Dachkante aus violettem Pixel-Rauschen (sky_1800, asset-korrektur) · Spiel-UI bleibt nachts ungetönt vollhell (owner-geschmack).
- **DialogBox:** Broadcast-Streifen ragt halbiert unter der Box hervor (alle 6 Dialog-Shots) · Katja-Header weiß-auf-hellbeige (Kontrast) · Fokusgruppen-PreTest ohne Panel-Rahmen/Scrim auf heller Raumszene.
- **Diegese:** Lagebild öffnet als nacktes graues UI-Fenster (kein TV-Rahmen); Warteschlange fordert „Wähle Aktionen im Terminal", aber kein Hotspot heißt Terminal; Korkbrett-Karten zeigen Preis, aber keine Wirkung/Stempel (M1 — Etappe-4-Stempel fehlen an der Tafel).
- **Owner-Geschmack (5 bestätigt):** Kürzel-Hilfe nutzt Alarm-Rot-Rahmen · Lobby-Boden hat gemalte Tiefen-Perspektive im sonst flachen Querschnitt · „Social Listening"-Label · UI-Nacht-Tönung · Tagesbogen komprimiert (09:00 fast nächtlich, goldene Stunde ab 14:25).

## 2b. Nachtrag (Owner-Feedback 2026-07-06): der blinde Fleck „UI-Materialwelt"

Der Owner hat mit eigenen Screenshots (Berater-Panel ausgeklappt, Berater-Detail-Modal,
Aktionen-Warteschlange, Avatar-Wahl) einen Punkt benannt, den das Review NICHT
herausgearbeitet hat — Verdikt: **berechtigt, echter Methodik-Befund.**

**Was das Review sah und was nicht:** Die Warteschlange wurde 8× beanstandet — aber
immer wegen Position/Überdeckung, nie wegen ihrer GESTALT (Oliv-Kopfband, graue
Web-Karte, glatte Fortschrittsbalken). Das **ausgeklappte Berater-Panel und sein
Detail-Modal wurden gar nicht geerntet** (standen bereits als Lücke 6 im Backlog —
die Owner-Screenshots zeigen genau diese Ansichten). Die Avatar-Wahl wurde nur für
die Web-Schrift beanstandet; die **uneinheitlichen Porträt-Ausschnitte** (mal große
Kopf-Nahaufnahme, mal kleine Halbfigur — die Köpfe unterschiedlich groß im Raster)
hat kein Prüfer gemeldet.

**Warum das systematisch passierte (nicht nur Pech):** Das Review prüfte gegen die
Stil-Bibel — und die definiert für die Spiel-UI-Schicht nur Rahmen/Font/Icons (§4.5)
plus Verbotsliste (§4.6). Sie definiert **keine UI-Material- und Farbwelt** (Woraus
sind Panels „gemacht"? Akten-Papier? Beton? Warum Olivgrün?). Ohne Soll kein
Verstoß: Die Prüfer konnten „flach/Web" melden, aber nicht „falsche Farbwelt".
Das Olivgrün/Grau/Rot der Panels stammt aus `theme.ts` (`StoryModeColors`,
militaryOlive etc.) — der Alt-Welt VOR der visuellen Verfassung; die Panels wurden
beim Rework umgefärbt, aber nie aus dem neuen Konzept heraus NEU GEDACHT (der Owner-
Begriff dafür: die UI soll diegetisch wirken — wie Objekte der Spielwelt: Akte,
Klemmbrett, Terminal — verwandt mit Skeuomorphismus). Zweite Methodik-Lücke:
Kompositions-Konsistenz ÜBER Asset-Familien (Porträt-Zuschnitte) stand nicht in der
Prüf-Basis — die verglich Größen in der Welt, nicht Bild-Ausschnitte im UI.

**Konsequenz (drei konkrete Schritte, siehe §6 Paket D):**
1. **UI-Stil-Lock zuerst (Owner-Entscheidung):** 2–3 Material-/Farbwelt-Varianten als
   Gemini-Mockups für DIESELBE Ansicht (Berater-Panel) — z. B. „Behörden-Akte"
   (Papier/Karteikarten/Stempel), „Beton & Bakelit" (Ministeriic-Hardware), „Oliv-
   Militaria" (bewusst beibehalten, aber texturiert). Owner wählt EINE → wird als
   **§4.7 „UI-Material & Farben" in die Stil-Bibel** geschrieben. Ohne dieses Soll
   bleibt jedes künftige Review hier blind.
2. **UI-Material-Kit generieren (Paket D):** 9-Slice-Rahmen-Set + kachelbare
   Panel-/Kopfband-Texturen + Balken-/Badge-Stile in der gewählten Welt — die
   bestehenden Panels werden damit UMGEKLEIDET (CSS bleibt, Material wird Pixel).
3. **Ernte-Nachschlag:** Berater ausgeklappt + Detail-Modal + gefüllte Queue in die
   nächste Ernte (Lücken 6/13); Porträt-Zuschnitt-Konsistenz in die Prüf-Basis.

## 3. Regressions-Sweep (früher gefixte Klassen)

| Klasse | Ergebnis |
|---|---|
| V7 Avatar-Schweben/Beine | **Avatar selbst: hält** (Laufzyklus animiert; leichtes Foot-Sliding + wenige Frames = niedrig/mittel). **ABER: Fehler-Typ neu eingeführt bei Strang-5-Statisten** (B6, 11–16 px). |
| Wand-Fuß-Linie (Deko) | **Props: hält perfekt** (0 px, §1.1) — Türen (B7) und Figuren (B6) verletzen sie. |
| V9 Lobby-Kacheln | **Hält** (eine durchgehende Halle; kein Prüfer fand Wiederholungs-Nahtstellen in den Fluren). Rest-Punkt „breiteres Lobby-Asset + Empfangstresen" bleibt offen (Lobby wirkt groß und leer, Tresen aus dem Art-Prompt nicht im Bild). |
| V12 Himmel/Skyline | **Grundsätzlich geheilt** (Tagesuhr-Verlauf + 3 Skylines) — neue Detail-Befunde: Blend-Nähte (goldene Stunde), Mittags-Sterne, kaputte Dachkante nachts. |
| V13 Hotspot-Drahtgitter | **Teilbehoben:** Ruhe-Ring weg, aber Zuordnung/Geometrie verrutscht + Drahtgitter im Broadcast-Zustand sichtbar (P5). |
| V14 Web-Sidebar | **Offen** (B3 — unverändert die größte Zwei-Welten-Quelle). |
| V15 Wohnzimmer/Publikum | Sitzkomposition ok; Broadcast-Panel wird vom Queue-Widget verdeckt (B4); echtes Studio-/Wohnzimmer-Upgrade = Shot-List A/B. |
| V16 Avatar-Kopplung | **Behoben bestätigt:** weibliche Wahl nutzt `player_idle_f/walk_f` (building_avatar_f, §1-Messung). Hi-Res-Frage bleibt Owner-Budget. |
| V3/V6 DialogBox/Floating | V3: DialogBox funktional, aber Broadcast-Streifen-Leck darunter (P5); V6: **offen** (B4). |

## 4. Video-/Animations-Befunde (Gemini Haupt-Prüfer + Frame-Gegenkontrolle)

Bestätigt: Fahrstuhl-Plopp + Z-Ordnung (B9) · Wahlabend-Balken ohne Wachstums-Animation
(B17) · Avatar-über-Tür/NPC-Überlappung beim Ankunfts-Finale · leichtes Foot-Sliding
(Schrittfrequenz vs. ~45 px/0,5 s) · Morgenbriefing blockiert Navigation nicht (B5).
**Ohne Befund (positiv):** Pendel-Statist (Flip am Wendepunkt sauber), Tür-Dummy-Zyklus,
Broadcast-Ausklappen, Tag/Nacht-Sweep (Blenden zeitlich sauber — nur die räumliche
Kachel-Naht aus P5), Heimweg-Kamera.

## 5. Ehrlichkeits-Bilanz: Widerlegtes, Grenzen, Lücken

- **37 widerlegt** — häufigste Gründe: Tag-1-Leerzustände als Befund gemeldet (leere
  Listen, 0-%-Werte), bewusstes Design (Lobby-no-repeat, HUD auf Knopfdruck,
  CSS-Fallback-Existenz), nicht reproduzierbare Bildbeschreibungen. 7 Duplikate.
- **Kabinen-Content-Sprung (§1, Messwert 194↔209 px):** wahrnehmungsseitig NICHT
  bestätigt (in Standbildern/Clip nicht sichtbar) — Messbefund bleibt dokumentiert,
  Priorität abgestuft.
- **24 unverifizierte Befunde** (Verify-Chunks nicht mehr gelaufen): die 6 wichtigsten
  von der Session selbst nachverifiziert (B14, B15, B18); Rest im JSON als
  `unverifiziert` gekennzeichnet.
- **Ernte-Artefakte (nicht dem Spiel anlasten):** `clip_avatar_walk` verfehlt den
  Lauf (Klick landete auf Tür) · `end_*_gameend` zeigt den Report statt des
  GameEndScreens (Report öffnet automatisch; echter GameEndScreen nur hinter dem Modal
  sichtbar) · `endreport_mid`=`bottom` byte-identisch (Report ist bei 1-Tages-Partie
  nur ~2 Bildschirme lang) · „Rennen-Kurven fehlen" ist Force-End-Folge
  (`laeuferHistorie < 2` blendet die Sektion aus) — der davor erscheinende
  Alt-„VERTRAUENSVERLAUF" und das Alt-Enden-Raster (B14) sind hingegen echt.
- **Bekannte Nicht-Erfassung** (Harness-Backlog, siehe §7): Krisen-/Gegenmaßnahmen-/
  Verrats-/Konsequenz-Modals, FRISCH/BEKANNT/VERBRANNT-Stempel im Spielverlauf,
  welke Pflanze/hohes Risiko, Jahreszeiten-Overlays (Kampagne = konstanter Monat —
  vermutlich toter Code), Midgame-HUD mit gefüllten Werten, MethodenDossier, Changelog.

## 6. Shot-List-Plan (pixel-asset-pipeline-Format) + Kostenschätzung

> **NICHTS davon ist generiert.** Format = `tools/asset-pipeline/src/shotlist.mjs`-Einträge
> (`id/type/kind/priority/aspectRatio/size/seed: seedFor(id)/prompt`), Stile aus
> `styleguide.mjs` (`styleCore()`/`styleHome()`/`styleObject()`), Budget-Mechanik der
> Pipeline (Dry-Run-Default, `PIPELINE_MAX_IMAGES=12`/Lauf, idempotent) bleibt in Kraft.
> Generierung erst nach Owner-Freigabe, dann per
> `node src/cli.mjs generate --images --only <ids> --live --limit 12`.

### Kosten-Basis (Stand 2026-07, Google-API-Preisliste)
`gemini-3-pro-image`: ~**0,134 $/Bild** im 1–2K-Tier (unsere Räume 1344×768, Porträts
1024×1024 teils im 0,039-$-Tier); 4K 0,24 $. Kalkulation unten konservativ mit
**~0,27 $/Shot effektiv** (Vision-QC verwirft erfahrungsgemäß ~jede zweite Erzeugung;
Stil-Lock-Kandidaten ×2–3 beim jeweils ersten Bild einer neuen Familie). Die reine
API-Rechnung ist also **Cent-Bereich — der eigentliche Aufwand ist die QC-/Platzierungs-
Session** (Trimmen, Standlinie, Gate), nicht der Bild-Preis.

### Paket 0 — KEINE Generierung: Asset-Nachbearbeitung + Code (behebt §1-Messbefunde)
| Was | Art | Aufwand |
|---|---|---|
| `bld_door_closed`/`bld_door_open` unten trimmen (10/9 px) → Türen stehen AUF der Linie und wirken wieder ~1,97 m hoch (1,13 H ≈ Stil-Bibel-Soll) | Asset-Korrektur (sharp-trim, 0 $) | Minuten + Gate |
| `elevator_cabin_open` Content-Box an `closed` angleichen (16 vs. 7 px unten) → kein Sprung beim Überblenden | Asset-Korrektur (0 $) | Minuten + Gate |
| `PixelSprite`-Bodenbündigkeit im Container (heilt Statisten/Pförtner/Walker/Tür-Dummies, 11–16 px) | Code-Fix | 1 Stelle + Smoke |
| `walkY`-Offset −6 px vereinheitlichen (Avatar exakt auf Klassen-Linie) | Code-Fix | 1 Zeile + Smoke |

### Paket A — TV-Studio-Set (E17, Owner-Priorität aus Etappe 5; „4 Bilder tragen 80 %")
| id | kind | priority | Format | Prompt-Kern |
|---|---|---|---|---|
| `tv_studio_wahlstudio` | room | must | 4:3, 1024×768 | election-night TV studio backdrop, anchor desk, big abstract poll graphic wall, cool blue studio light, no people, no text, `styleCore()` |
| `tv_studio_sondersendung` | room | must | 4:3, 1024×768 | same studio re-lit in alarm red for a breaking-news special, `referenceId: tv_studio_wahlstudio` (gleicher Seed → gleiche Geometrie) |
| `tv_anchor_sprecherin` | figure | must | 1:1, 1024 | news anchor woman, bust, facing camera, modest western TV dress, isolated on chroma magenta (Objekt-Isolation!) |
| `tv_grafik_hochrechnung` | prop | nice | 16:9 klein | abstract election bar-chart overlay panel, no text (Text bleibt flexible Ebene, §4.5/E35) |

Einsatzorte: `TvSet`-Baukasten (`WahlabendScene`) — Drop-in unter die bestehende
Text-Ebene ohne API-Änderung; derselbe Baukasten bespielt künftig Broadcast-„Sondersendung".
**Kosten: 4 Shots ≈ 1,10 $** (inkl. QC-Verschnitt).

### Paket B — Wohnzimmer-Alphabet (5 Bilder, Etappe-4-Carry-forward, styleHome!)
`wz_kuechenstreit` · `wz_einsam_videospiel` · `wz_abwinken_tv` · `wz_parteifahne` ·
`wz_faktencheck_zeitung` — je kind `room`-Detail, 4:3, priority must (E6: Zustände NUR
als Bilder sichtbar). WARNUNG aus dem Skill: zwingend `styleHome()` (warm), sonst
„Propaganda-Fabrik-Look". **Kosten: 5 Shots ≈ 1,35 $.**

### Paket C — aus den Review-Befunden (§2) abgeleitet (priority nice, einzeln freigeben)
| id | kind | Format | Anlass (Befund) | Prompt-Kern |
|---|---|---|---|---|
| `bld_underground_v2` | tile | 16:9 flach | B10 (Röntgen-Räume im Untergrund) | underground earth cross-section: soil, pipes, cables, concrete foundations, NO furnished rooms, no interiors, seamless tile, `styleCore()` |
| `bld_door_closed_v2`/`_open_v2` | prop | 128×192 | B7-Alternative, falls Trim nicht reicht (Tür soll ~2,05 m wirken) | flat frontal ministry door, full height content (no padding), slightly taller proportions |
| `bld_city_far_night_v2` | tile | wie Bestand | P5 (kaputte Dachkante) | Nachbesserung nur des Nacht-Tiles |
| `room_lobby_wide` | room | 21:9, 2016×768 | V9-Rest („Lobby groß und leer", Empfangstresen im Prompt nicht im Bild) | wide continuous entrance hall WITH visible reception counter + guard post left of the elevators, revolving door ~1.15× figure height |
| `ui_9slice_set` | prop | 3×256² | V3/B3-Unterstützung (EIN Rahmen-Set leicht/standard/alarm) | pixel 9-slice frame set, three variants, no text |
| `player_walk_hd`/`player_idle_hd` (m/w) | sheet | 8×64px/4×64px | V16 (Owner: „zu pixelig") — nur nach Geschmacks-Vorab (2 Kandidaten) | higher-fidelity 64px walk cycle matching current silhouette |

Paket C gesamt: ~9–11 Shots ≈ **3 $** API (+ QC). **Erst nach Owner-Blick auf die
Galerie freigeben** — B7/B10 sind ggf. schon durch Paket 0 + Trim erledigt.

### Paket D — UI-Materialwelt (Nachtrag §2b, Owner-Auftrag 2026-07-06)
**Schritt 1 — Stil-Lock (zuerst, ~6–9 Mockup-Bilder ≈ 1,50 $):** dieselbe Ansicht
(Berater-Panel) in 2–3 Material-Varianten („Behörden-Akte" Papier/Karteikarte/Stempel ·
„Beton & Bakelit" · „Oliv-Militaria texturiert") — Owner wählt EINE; Ergebnis wird
§4.7 der Stil-Bibel.
**Schritt 2 — Material-Kit in der Sieger-Welt (~8–10 Shots ≈ 2,50 $):**
| id | kind | Inhalt |
|---|---|---|
| `ui_frame_light/standard/alarm` | prop (9-Slice) | DIE drei Rahmen für alle Panels/Modals |
| `ui_panel_paper`/`ui_panel_dark` | tile | kachelbare Panel-Hintergründe (statt Flächenfarbe) |
| `ui_header_band` | tile | Kopfband-Textur (ersetzt das flache Oliv) |
| `ui_bar_segments` | prop | Fortschritts-/Moral-Balken als Pixel-Segmente |
| `ui_badge_set` | prop | HOCH/Prio-/Legalitäts-Badges als Stempel |
| `ui_clipboard_frame` | prop | Klemmbrett-/Akten-Motiv für Warteschlange + Berater |
**Zusätzlich (Porträt-Konsistenz, Owner-Befund):** 6 Avatar-Porträts mit einheitlichem
Zuschnitt re-generieren (`referenceId` je Bestandsbild, gleicher Seed ≈ 1,60 $) —
gleicher Kopf-Anteil, gleiche Schulterhöhe im Raster.
Paket D gesamt: **~5,60 $ API** + Stil-Lock-Entscheidung + eine Umbau-Session
(Panels umkleiden, reine CSS-/Asset-Arbeit ohne Logik-Änderung).

**Gesamt-Budget-Ansage: Pakete A+B ≈ 2,50 $ · Paket C ≈ 3 $ API + je eine QC-/
Platzierungs-Session.** Weit unter der SOUL-§3.8-Warnschwelle; die Budget-Ansage
erfolgt trotzdem, weil Owner-Freigabe für JEDE Generierung vereinbart ist.
**Wichtig: P1/P2/P4 aus §2 sind reine Code-/Trim-Arbeit (0 $) und bringen nach
Einschätzung dieses Reviews MEHR Kohärenz-Gewinn als jedes neue Asset.**

## 7. Harness-Backlog + Methodik-Notizen (für die nächste Session)

**Ernte-Lücken (Voll-Liste mit Ernte-Rezepten: `_BEFUNDE.json` → `luecken`, 15 Stück
vom Vollständigkeits-Kritiker):** die wichtigsten — echter **exposed-End-Pfad**
(forceEnd-Zweig via Risiko-Schwelle) · **CrisisModal / ConsequenceModal /
BetrayalEventModal / StageCountermeasureModal** (Fixture-Szenen bzw. Engine-Trigger
wie `raiseAbwehr(25)`) · Karten-Stempel **BEKANNT/VERBRANNT** (Gedächtnis vorbelegen) ·
**Midgame-Bundle** (~10 Tage Auto-Play → alle Panels gefüllt + Report mit
Rennen-Kurven) · HUD-**Alarm-Zustand** (risk-Puls) · welke Pflanze/Krisen-Lampe ·
TutorialOverlay · Fokusgruppen-★ + Beat-Ergebnis · Changelog · GameEndScreen separat
(`ui.setShowEndReport(false)`) · EndReport-Scroll per PageDown · `clip_avatar_walk`
auf freie Lauffläche. **Nebenbefund (Produkt, nicht Ernte):**
`requestNachspielzeit()` hat keinen UI-Aufrufer — Zielbild-§5b-Lücke.
**Jahreszeiten:** `month` ist in der 40-Tage-Kampagne konstant → SeasonOverlay
vermutlich toter Code (klären/entfernen).

**Orchestrierungs-Lehren (→ ORCHESTRATION_FEEDBACK.md):** (1) Workflow-`args` kam im
Runtime nicht an (alle Prompts `undefined`) → Konfiguration in Shard-Scripts einbacken.
(2) 4-Kern-Container ⇒ 2 Agenten/Workflow → in 3 parallele Workflows sharden.
(3) Lange Läufe überleben Kontext-/Container-Pausen nicht zuverlässig → Ergebnisse
sind aus den Journalen rekonstruierbar (`journal.jsonl` + Agent-Prompts joinen).
