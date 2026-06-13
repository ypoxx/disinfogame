# 🎛️ Strang 2 — Diegetische Bedienung · Feinplan (Vorlage zur Owner-Abnahme)

**Status:** Planung — **noch kein Bau.** Owner-Abnahme abwarten.
**Datum:** 2026-06-13 · **Branch:** `claude/amazing-noether-4arm99` (setzt auf `main`/PR #77 auf)
**Quellen:** `GESAMTKONZEPT_VISUELL.md` (§4 visuelle Verfassung) · `DECISIONS_2026-06-12_NEXT_LEVEL.md`
· `REWORK_PLAN_2026-06-13_STIL_BIBEL.md` (8-Stränge-Plan, Strang 2 ab Z.234) · `NEXT_LEVEL_PLAN.md`
(K-Items) · `SOUL.md` · **eigene Code-Inventur** (2026-06-13, IST-Stand verifiziert).

> **Was dieses Dokument ist:** der „verlustfreie Übergabepunkt" für Strang 2. Es beschreibt
> den IST-Stand der Bedienung (code-belegt), die Ziel-Architektur, einen **kleinteiligen
> PR-Schnitt** (je grün getestet), Abhängigkeiten, Risiken und die wenigen **Owner-
> Entscheidungen**, die den Bau wesentlich verzweigen. Kein Budget, kein Asset-Spend.

---

## 0. IST-Stand der Bedienung (selbst geprüft, mit Datei-Belegen)

**Grün-Basis:** `tsc --noEmit` läuft sauber durch (Stand Branch-Spitze, 2026-06-13).

Heute wird das Spiel über **drei parallele Welten + Rand-Knöpfe** bedient — genau die
„Knopfbalken"-Schicht, die Strang 2 auflöst:

| Befund | Ort (Datei:Zeile) | Bewertung |
|---|---|---|
| **View-Umschalter** als schwebende Web-Pillen-Tableiste (Gebäude / Büro / Dashboard) + „Sendung (B)" | `StoryModeGame.tsx:698–725` | 🔴 Verbotsliste (abgerundete Web-Tabs); §4.4: „View-Umschalter entfällt" |
| **Dashboard** als drittes paralleles Bedien-Panel (`QuickActions`-Raster = 6 Panel-Knöpfe, ResourceCards, Phase-Beenden) | `DashboardView.tsx` (369 Z.) | 🔴 dupliziert Büro-Hotspots; soll in Büro-Objekte aufgehen |
| **Büro-Unterleiste** mit Web-Buttons „GEBÄUDE" / „PHASE BEENDEN" + Dienstausweis | `PlayerOfficeView.tsx:415–471` | 🟡 nicht-diegetische Knöpfe in der Pixel-Welt |
| **Broadcast-Leiste** standard **versteckt**, Toggle per Taste B + 4,5-s-Auto-Peek | `StoryModeGame.tsx:316–328, 786`; `BroadcastBar.tsx` | 🟡 soll **permanent sichtbar** (Echo der Zielgesellschaft, B8) |
| **Keine Narrativ-Tafel.** Der Büro-Hotspot `board` öffnet das **MissionPanel** | `PlayerOfficeView.tsx:80,140`; `StoryModeGame.tsx:873` | 🔴 das „Sendeplan"-Herzstück fehlt komplett (s. Verfassung §2) |
| **Aktionen** als Seiten-Panel (`ActionPanel`, Sidebar) statt Karten auf der Tafel | `StoryModeGame.tsx:791–840`; `ActionPanel.tsx` (691 Z.) | 🟡 soll **Inhalt der Tafel** werden (Karten anheften), kein paralleles Panel |
| **~13 Modals/Panels** noch im Alt-Idiom (`border-4/8` + harte/Glow-Schatten) | s. Inventur unten | 🟡 „~10 Modals → EIN Rahmen-System" |

**Was schon GUT trägt (darauf bauen wir auf — NICHT neu erfinden):**
- **Navigations-Engine ist fertig & getestet:** `BuildingNavigator.ts` (pure TS) plant
  `walk → elevator → door` inkl. Zeitkosten; `useNavigator.ts` spielt die Route als Animation
  (Avatar läuft, Fahrstuhl fährt, Tür öffnet). Position überlebt View-Wechsel.
  **Es fehlt nur die diegetische *Auslösung* (Etagenwahl) statt der Teleport-Tabs.**
- **Gebäude-Bühne** rendert Fassade/Flure/Türen/Fahrstuhlschacht+Kabine schon korrekt
  (`BuildingStage.tsx`), Türklick → Avatar läuft hin → Dialog/Büro/Spezialraum öffnet.
- **`PixelFrame`** existiert (CSS-9-Slice-Ersatz, 3 Gewichte; `PixelFrame.tsx`). **6**
  Komponenten schon migriert: BetrayalEventModal, ConsequenceModal, CrisisModal, EventsPanel,
  MissionPanel, NpcPanel.
- **Büro** ist bereits ein begehbarer Pixel-Raum mit unsichtbaren Hotspots
  (`PlayerOfficeView.tsx`) — Computer→Aktionen, Pinnwand→Mission, TV→Stats, Telefon→Kontakte,
  Akten→News, Fenster→Events.
- **Broadcast** ist reine Anzeige-Schicht (`useAudienceBroadcast` → `BroadcastBar`), keine
  Engine-Rückwirkung — gefahrlos umzubauen.

**Modal-/Panel-Inventur (Rahmen-System):**
- *Schon `PixelFrame`:* BetrayalEventModal, ConsequenceModal, CrisisModal, EventsPanel,
  MissionPanel, NpcPanel.
- *Noch Alt-Idiom (`border-4/8`, harte/Glow-Schatten):* ActionFeedbackDialog, ActionPanel,
  ActionQueueWidget, AdvisorDetailModal, AvatarChoice, DashboardView, DayReport, GameEndScreen,
  GrievanceModal, MorningBriefing, NewsPanel, StatsPanel, TutorialOverlay, FokusgruppeView,
  NewsroomView.
- *Pixel-Font:* `font-mono` (System-Mono) wird in 11 Dateien noch als Weltschrift simuliert —
  **bleibt vorerst**, da die echte Pixel-Font per Netz-Policy blockiert ist (s. Risiko R4).

---

## 1. Leitplanken (verbindlich — gelten in JEDEM PR)

1. **A1 — KEINE Funktion fällt weg** (`GESAMTKONZEPT_VISUELL.md`). Jede entfernte Bedien-
   möglichkeit bekommt **zuerst/zeitgleich** ein diegetisches Zuhause. Jeder PR führt eine
   **A1-Checkliste** (Affordanz → neues Zuhause) und ist sonst nicht „grün".
2. **§4.4 Drei-Schichten-Regel:** Welt · Diegetisches UI (an Möbel gekoppelt) · Spiel-UI
   (nur Rand). **Der View-Umschalter entfällt; Ortswechsel diegetisch (Tür/Fahrstuhl).**
3. **E1 — GAR KEINE Randleiste.** System-Menü nur über Pause (Esc). HUD-Rand
   (Zeit/Risiko/Budget) nur **auf Knopfdruck** einblendbar (I32), nicht dauerhaft.
4. **E2 — Narrativ-Tafel max 3 Spuren, Start 2 → 3** (3. Slot via Gebäude-Wachstum K40).
5. **Herzstück (Panel-Konsens):** Die **Narrativ-Tafel ist unser „Sendeplan"**. Die heutige
   Aktions-Liste wird ihr **INHALT** (Karten anheften), **kein paralleles Panel**. Warnung des
   Game-Designers: Karten müssen **anfassbar** wirken (heften) — sonst „verkleidetes Dropdown".
6. **Stil-Bibel-Learnings:** Pur-Figuren-Regel (frei platzierte Figuren ohne mitgemaltes Möbel);
   opake Kachel-Strips; keine CSS-gezeichneten Möbel/Gesichter; keine Emojis; keine Web-Pillen.
7. **E33 — volle Tastatur-Spielbarkeit:** jede neue diegetische Affordanz braucht einen
   Tastatur-Pfad (Etagenwahl, Tafel-Karten, Büro-Objekte). Wird je PR mitgeführt.

---

## 2. Ziel-Architektur (Soll nach Strang 2)

- **Nur noch zwei Welt-Ansichten — kein Umschalter:** **Gebäude-Querschnitt** und **Raum-
  Nahsicht** (Büro / NPC-Raum / Spezialräume). Man **wechselt diegetisch**: Tür betreten,
  Fahrstuhl fahren. Das `dashboard`-Drittel verschwindet.
- **Etagenwahl diegetisch:** Klick auf den Fahrstuhl (oder Ruf-Knopf) öffnet ein **Pixel-
  Etagenpanel** (sieht aus wie das Tableau im Aufzug) — Schnellreise über die vorhandene
  Navigations-Engine; Türklick-zu-Raum bleibt zusätzlich.
- **Broadcast permanent (Schicht 2, diegetisch):** „Sendung läuft" + Publikums-Wohnzimmer als
  **dauerhaft sichtbares diegetisches Objekt** (kompakter, ausklappbarer Streifen / Wand-TV) —
  spiegelt immer den Live-Zustand (B8). Kein versteckter Toggle, kein Auto-Peek-Hack.
- **Narrativ-Tafel als Bedien-Herzstück:** Das Korkbrett im Büro wird der zentrale Planungs-
  und Aktions-Ort: 2–3 Narrativ-Spuren, Maßnahmen-**Karten** zum Anheften, rote **Verfalls-
  Fäden** (Gelegenheits-Fenster mit Ablaufdatum). Animiert + **ziehbar**.
- **EIN Rahmen-System:** alle Modals/Panels über `PixelFrame` + einen gemeinsamen
  `PixelModal`-Rahmen (Overlay + Titelzeile + Schließen). Schluss mit Per-Modal-Chrome.
- **Spiel-UI schrumpft (E1):** HUD nur auf Knopfdruck; System nur über Pause. Keine
  Randleisten, keine Web-Knopfbalken.

---

## 3. PR-Schnitt (kleine, je grün getestete Häppchen)

> Reihenfolge nach Abhängigkeit **und** früher Sichtbarkeit. **2b/2c/2d** sind weitgehend
> parallelisierbar; **2e** braucht **2c+2f** (Inhalte erst diegetisch verankern, dann Dashboard
> auflösen); **2f** ist der größte Brocken und wird zweigeteilt.

### PR 2a — Dieser Feinplan *(kein Code-Risiko)*
Dieses Dokument + die Owner-Entscheidungen (Abschnitt 7). Nach Abnahme starten 2b ff.

### PR 2b — Rahmen-System vollenden (`PixelFrame` → `PixelModal` auf alle Modals/Panels)
- **Ziel:** „~10 Modals → EIN Rahmen-System". Reiner Kohärenz-PR, **kein Verhaltens-Wechsel**.
- **Inhalt:** `PixelModal` bauen (Overlay + `PixelFrame` + Titelzeile + Schließen-Icon, drei
  Gewichte standard/alarm/light). Die 13 Alt-Idiom-Komponenten darauf umstellen; `border-4/8`
  + harte/Glow-Schatten raus.
- **A1-Erhalt:** identische Inhalte/Buttons, nur Rahmen getauscht. Keine Funktion verändert.
- **Risiko:** niedrig (visuelle Regression). **Test:** `tsc/build/vitest` grün; Browser-Smoke-
  Screenshots der wichtigsten Modals visuell prüfen.
- **Abhängigkeit:** keine. **Früher Sicht-Gewinn.**

### PR 2c — Diegetische Navigation: View-Umschalter weg + Etagenwahl
- **Ziel:** §4.4 — Ortswechsel nur noch über Tür/Fahrstuhl.
- **Inhalt:**
  1. Schwebende Tableiste (`StoryModeGame.tsx:698–725`) **entfernen**.
  2. Gebäude↔Büro läuft über die schon vorhandene Verdrahtung (`onEnterOffice`,
     `onExitToBuilding`) — Avatar geht durch die Tür.
  3. **Etagenpanel** (neu, `ElevatorPanel`): Klick auf Kabine/Ruf-Knopf in `BuildingStage`
     öffnet ein Pixel-Tableau der 6 Etagen → `nav.goTo(...)` der Engine. Tastatur: Ziffern/
     Pfeile wählen die Etage (E33).
  4. **Dashboard bleibt übergangsweise** über einen Tasten-Fallback erreichbar (A1!), bis 2e
     es auflöst — `panelStore.viewMode` vorerst unverändert.
- **A1-Erhalt:** Schnellwechsel bleibt (Etagenpanel statt Tabs); Dashboard bleibt erreichbar.
- **Risiko:** mittel (zentrale `StoryModeGame`). **Test:** `BuildingNavigator`-Tests bleiben grün;
  neuer `ElevatorPanel`-Logiktest; Browser-Smoke „Etage wählen → Avatar fährt → Raum".

### PR 2d — Broadcast permanent (statt versteckter Toggle)
- **Ziel:** „Broadcast permanent sichtbar".
- **Inhalt:** `BroadcastBar` als **dauerhaft sichtbares**, kompaktes diegetisches Objekt
  (Standard eingeklappt = schmaler „ON AIR"-Streifen mit Mini-Wohnzimmer; ausklappbar zur
  vollen Leiste). Auto-Peek-Hack + reiner B-Toggle raus; B schaltet nur noch Ein-/Ausklappen.
- **A1-Erhalt:** alle Broadcast-Infos bleiben; nur immer sichtbar statt versteckt.
- **Risiko:** niedrig–mittel (Layout-Platz gegen Welt-Ansicht). **Test:** `useAudienceBroadcast`-
  Tests grün; Smoke: Streifen sichtbar in Gebäude **und** Büro, Ausklappen ok.
- **Abhängigkeit:** harmoniert mit 2c (gemeinsamer Welt-Layout-Raum) — danach einplanen.

### PR 2f — Narrativ-Tafel (Korkbrett): animiert + ziehbar **(Herzstück, zweigeteilt)**
- **2f-1 — Statische Tafel:** Korkbrett-Vollbild beim Pinnwand-Hotspot statt MissionPanel.
  2–3 Narrativ-**Spuren** (E2: Start 2), Maßnahmen-**Karten** je Spur, rote **Verfalls-Fäden**
  (Gelegenheits-Fenster mit „läuft ab um …"). Karten öffnen den **bestehenden** Aktions-/
  Missions-Fluss (`executeAction`) — **Engine unangetastet** (A1).
- **2f-2 — Interaktion:** Karten **ziehbar** (an Spur heften → `addToQueue`/Planung), Anheft-/
  Ablöse-Animation, Faden-Animation. **Tastatur-Äquivalent** (Karte fokussieren → Spur wählen),
  damit E33 erfüllt bleibt.
- **A1-Erhalt:** Aktions-Planung, Mission und Gelegenheits-Fenster sind hier vollständig
  bedienbar; `ActionPanel` bleibt als Karten-Detail/-Quelle erreichbar (kein Funktionsverlust).
- **Risiko:** **hoch** (neue Interaktion: Drag + Pixel-Look + Tastatur, ohne Funktion zu
  verlieren). **Gegenmittel:** Split statisch/interaktiv; Spur-/Karten-/Verfalls-Logik als
  **pure, vitest-getestete** Funktion; Drag per Browser-Smoke. **Assets:** ggf. 1 Korkbrett-
  Hintergrund + Pin/Karte/Faden-Props (Budget-Schätzung in §6, **erst nach Freigabe `--live`**).
- **Abhängigkeit:** liefert das diegetische Zuhause für Ziele/Gelegenheiten/Aktionen, das **2e**
  braucht.

### PR 2e — Dashboard auflösen → Büro-Objekte
- **Ziel:** „Dashboard → Büro-Objekte (Möbel-UI statt Panels)".
- **Inhalt:** Jede Dashboard-Information bekommt ein diegetisches Zuhause **bevor** Code gelöscht
  wird: Ressourcen → HUD-auf-Knopfdruck + Schreibtisch-Anzeige; Ziele/Gelegenheiten → **Narrativ-
  Tafel** (aus 2f); News-Feed → Akten/TV; NPC-Status → Telefon/Kontakte; das „Lagebild auf einen
  Blick" → **ein** diegetisches Übersichtsobjekt (Schreibtisch-Monitor / Wandkarte `prop_world_map`).
  Danach `DashboardView` + `viewMode:'dashboard'` + Tasten-Fallback aus 2c **entfernen**;
  `ViewMode` schrumpft auf `'office' | 'building'`.
- **A1-Erhalt:** **A1-Audit als Akzeptanzkriterium** — jede Dashboard-Kennzahl nachweislich
  diegetisch erreichbar, sonst kein Merge.
- **Risiko:** mittel (Informationsverlust). **Test:** Audit-Checkliste; Smoke aller Wege.
- **Abhängigkeit:** **2c + 2f**.

### PR 2g — Aufräumen, HUD-auf-Knopfdruck & A1-Gesamtaudit
- **Inhalt:** Büro-Unterleiste (Web-Buttons „GEBÄUDE"/„PHASE BEENDEN") **diegetisch** ersetzen
  (Tür zum Verlassen; „Feierabend"/Heimweg ist über K1-Redaktionsschluss bereits diegetisch —
  zusätzlich ein anklickbarer diegetischer Heimweg). **E1/I32:** HUD standardmäßig aus, per
  Taste einblendbar; System nur über Pause. **E33:** vollständiger Tastatur-Pass. **A1-Gesamt-
  audit:** Liste aller Vor-Strang-2-Affordanzen + diegetisches Zuhause.
- **Risiko:** niedrig–mittel; teils Überschneidung mit Strang-1-Resten (HUD/Font — s. R4/R8).
- **Abhängigkeit:** nach 2c–2f.

---

## 4. Abhängigkeitsgraph

```
2a (Plan, Abnahme)
   ├── 2b  Rahmen-System            (unabhängig, früh)
   ├── 2c  Diegetische Navigation   (zentral; Dashboard bleibt via Fallback)
   │     └── 2d  Broadcast permanent (gemeinsamer Welt-Layout-Raum)
   └── 2f  Narrativ-Tafel (2f-1 → 2f-2)
         └── 2e  Dashboard auflösen  (braucht 2c + 2f)
               └── 2g  Aufräumen / HUD / A1-Gesamtaudit
```

---

## 5. Risiken & Gegenmittel

| # | Risiko | Gegenmittel |
|---|---|---|
| R1 | **A1-Verletzung** — UI entfernt, bevor Funktion umzieht | Per-PR-A1-Checkliste; Entfernen erst NACH diegetischem Zuhause; 2g-Gesamtaudit |
| R2 | **Zentrale `StoryModeGame.tsx` (1182 Z.)** ist Hotspot vieler PRs → Rebase-Reibung | Kleine PRs, häufig rebasen, Änderungen lokal halten, Logik in Unterkomponenten ziehen |
| R3 | **Narrativ-Tafel-Interaktion** (Drag + Pixel + Tastatur) neuartig & riskant | Split 2f-1/2f-2; Spur-/Karten-Logik pure + vitest; Tastatur-first; `PixelFrame` wiederverwenden |
| R4 | **Pixel-Font blockiert** (Font-CDN 403) → `font-mono`-Cleanup nicht abschließbar | Kein Strang-2-Blocker (Rahmen-System fontfrei); im Plan markiert, Cleanup bei Font-Freigabe |
| R5 | **Asset-Bedarf** Tafel (Korkbrett/Pin/Karte/Faden), evtl. Broadcast-TV | Erst Bestand prüfen/komponieren; nur bei Bedarf generieren; Kostenschätzung VOR `--live` (§6) |
| R6 | **„Broadcast permanent" vs. E1 „keine Randleiste"** | Auflösung: Broadcast ist **Schicht 2 (diegetisch)**, keine Spiel-UI-Randleiste → zulässig. Owner bestätigt (D-A) |
| R7 | **E33 Tastatur** — jede neue diegetische Affordanz braucht Tasten-Pfad | Je PR mitführen; 2g-Tastatur-Pass als Gate |
| R8 | **HUD-auf-Knopfdruck (E1/I32)** überschneidet Strang-1-Reste | In 2g bündeln; mit Strang-1-Offenpunkten abgleichen |

---

## 6. Asset-Bedarf & Budget (kein Spend ohne Freigabe)

- **2b/2c/2d/2e/2g:** **kein** neues Bild-Asset nötig (CSS-`PixelFrame`, vorhandene Props/Räume).
- **2f (Tafel):** evtl. **1 Korkbrett-Hintergrund** + **Pin/Karte/Faden**-Props (im Manifest
  bislang **nicht** vorhanden — vorhanden sind u. a. `prop_tv`, `prop_world_map`, `prop_red_phone`,
  `prop_files`). Erst prüfen, ob aus Bestand komponierbar.
- **Schätzung (falls generiert):** ~3–5 kleine Props @2K Standard ≈ **$0,40–0,67** (Batch
  ~$0,20–0,34) — vernachlässigbar im Rest-Budget (~23 € von +30 €, ~7 € verbraucht).
- **Regel:** Standard ist Dry-Run; echte Läufe nur `--live` mit **vorheriger Kostenansage**,
  harten Per-Lauf-Limits, inkrementellem Manifest; jedes neue Bild Vision-Review gegen die
  Stil-Bibel; `npm test` der Pipeline grün.

---

## 7. Owner-Entscheidungen zur Abnahme (mit Empfehlung)

> Bitte je Punkt knapp bestätigen oder korrigieren (Format wie A1–H48: Nummer nennen genügt).

- **D-A · Broadcast-Platzierung.** *Empfehlung:* permanenter, **kompakter diegetischer Streifen**
  (Mini-TV + Mini-Wohnzimmer) an der Welt-Ansicht, per Taste B aus-/einklappbar zur vollen Leiste.
  Eingestuft als Schicht-2-Diegese (kein Widerspruch zu E1). **OK? Oder lieber nur Wand-TV im Büro?**
- **D-B · Etagenwahl.** *Empfehlung:* diegetisches **Aufzug-Tableau** (Pixel) für Schnellreise zu
  jeder Etage, zusätzlich zum direkten Türklick. **OK?**
- **D-C · Dashboard-„Lagebild".** *Empfehlung:* ein einzelnes diegetisches Übersichtsobjekt im Büro
  (Schreibtisch-Monitor / Wandkarte) bewahrt den „auf einen Blick"-Nutzen. **OK? Oder Übersicht ganz
  streichen (alles nur noch an Einzel-Objekten)?**
- **D-D · Tafel als Aktions-Heimat.** *Empfehlung:* die Narrativ-Tafel wird die **primäre**
  Aktions-Planungsfläche (Karten); das separate `ActionPanel` bleibt als Karten-Detail/-Quelle
  erreichbar, verliert aber seine eigene Sidebar-Rolle. **OK?**
- **D-E · HUD-auf-Knopfdruck (E1/I32).** *Empfehlung:* in Strang 2 (PR 2g) umsetzen — HUD standard
  aus, per Taste einblendbar. **Jetzt umsetzen, oder HUD vorerst dauerhaft sichtbar lassen?**

---

## 8. Qualitäts-Kontrakt je PR (SOUL §4)

`tsc --noEmit` + `npm run build` + `npx vitest run` **grün vor jedem Push** · Browser-Smoke
(`vite preview` + `app-smoke.mjs`, Screenshots per Read visuell prüfen) · neue Bilder Vision-Review
gegen die Stil-Bibel · **A1-Checkliste je PR** (Affordanz → diegetisches Zuhause) · Commit auf
Deutsch mit Session-Footer; nach Push **Draft-PR**.

---

## FORTSCHRITT & ABSCHLUSS (2026-06-13 — Strang 2 umgesetzt)

**Branch:** `claude/amazing-noether-4arm99` · PR #78. Alle Schritte je grün
(`tsc` 0 · `npm run build` 0 · `vitest` 214/214) + Browser-Smoke (Screenshots
unter `tools/asset-pipeline/runs/smoke-2*`).

| Schritt | Inhalt | Commit |
|---|---|---|
| 2b | EIN Rahmen-System: `PixelModal`-Overlay + Modal-Migration, Verbots-Schatten raus | 2e2761c |
| 2c | Diegetische Navigation: View-Umschalter weg (Leiste + HUD-Toggle), `FloorDirectory` (Fahrstuhl/Etagen-Tableau, Taste F) | 894bb0e |
| 2d | Broadcast permanent: Dauer-Streifen + Ausklappen (B) statt versteckter Toggle | f4b58fa |
| 2f | Narrativ-Tafel (Korkbrett): Spuren, Karten anheften (Drag/Enter), rote Verfalls-Fäden, Ausspielen | f28a0d8 |
| 2e | Dashboard aufgelöst → diegetisches `LagebildView` am Wand-Monitor | 10b5978 |
| 2g | Aufräumen: HUD nur auf Knopfdruck (E1/I32, Taste H), Büro-Ausgang als Tür-Hotspot, Verbots-Schatten-Reste | (dieser) |

### A1-Gesamtaudit — „keine Funktion fällt weg"

| Vor-Strang-2-Bedienweg | Diegetisches Zuhause jetzt |
|---|---|
| View-Tabs Gebäude/Büro/Dashboard | Bürotür (Büro), Etagen-Tableau/Fahrstuhl + Türen (Räume), Dashboard aufgelöst |
| HUD-View-Toggle (BÜRO/DASHBOARD…) | entfällt (diegetischer Wechsel) |
| Broadcast-Toggle (versteckt, Taste B) | permanenter Streifen, B = aus-/einklappen |
| Pinnwand → MissionPanel | Pinnwand → Narrativ-Tafel (Ziele als Notizen); volle Mission weiter per Taste M |
| Aktions-Panel (Planen/Queue) | Tafel: Anheften=Queue, Sofort=Ausführen, Ausspielen=Queue; Terminal/Taste A weiter da |
| Dashboard (Ressourcen/Ziele/News/Team) | Wand-Monitor → Lagebild; Ressourcen/Phase im HUD; Ziele=Tafel/M; News=Akten/N; Team=Telefon/P |
| HUD dauerhaft sichtbar | HUD auf Knopfdruck (Taste H) + immer sichtbarer Pause-/HUD-Einstieg (E1) |
| Büro „GEBÄUDE"-Web-Button | Tür-Hotspot am linken Bildrand |
| „PHASE BEENDEN"-Web-Button (Büro) | „FEIERABEND" (Desk) + HUD + Redaktionsschluss-Heimweg (K1) |
| ~14 Modals, je eigenes Idiom | `PixelModal`/`PixelFrame`, ein Rahmen, keine Verbots-Schatten |

**Tastatur (E33):** A/N/S/P/M/E/B/I bleiben · neu F (Etagen-Tableau) · neu H (HUD) ·
entfernt V (View-Zyklus → diegetisch) und G (Übergangs-Dashboard). Tafel, Etagen-
Tableau und Lagebild sind tastaturbedienbar; Esc schließt Overlays.

### Offen / Folgearbeiten (nicht Strang-2-Scope)
- **Asset-Politur:** Korkbrett/Pin/Karte derzeit CSS-komponiert (kein Spend) —
  optionales echtes Pixel-Asset später (Budget-Schätzung vorab).
- **Pixel-Font** weiter blockiert (Netz-Policy) — `font-mono`-Reste bleiben, bis
  eine lizenzfreie Font-Datei vorliegt.
- **Berater-Panel überlappt** den rechten Büro-Hotspot (Monitor/Lagebild) leicht —
  vorbestehend; in Strang 5 (Atmosphäre/Hotspot-Feinlage) mitnehmen.
