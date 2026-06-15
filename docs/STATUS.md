# 📍 STATUS — zentrale Übersicht: erledigt · offen · TODO

**Zweck:** EIN zentraler, lebender Einstieg über den Projektstand — was erledigt ist, was
offen/zurückgestellt ist, und die priorisierte TODO-Liste. Ersetzt nicht die Detailpläne,
sondern verlinkt sie. **Jede Session aktualisiert dieses Dokument.**

> Lese-Reihenfolge: `SOUL.md` → `DECISIONS_2026-06-13B_TRANSCRIPT.md` →
> `STRANG34_FEINPLAN_2026-06-13_AKTIONEN_DIALOGE.md` → `GESAMTKONZEPT_VISUELL.md` →
> dieses Dokument für den aktuellen Bau-Stand. Lessons Learned: `ORCHESTRATION_FEEDBACK.md`.

**Stand:** 2026-06-15 · **PR #83 (Draft, Branch `claude/gifted-curie-5bgc0c`)** — **„Herzstück" (Episoden · Gesellschaftswerte · Aufträge · Vernetzung)**, baut auf main nach Merge von PR #82.

### 🎭 Herzstück-Bau (PR #83) — Fortschritt P0→P7 (alle Phasen grün: `tsc`·`vitest`·`build`)
Bau-Plan `BAUPLAN_2026-06-14_HERZSTUECK.md`, strikt in Reihenfolge. Gate je Commit grün (vitest **388**).
**Optionale Politur abgeschlossen (Session 2026-06-15):** (1) Umgebungshumor-Asset-Batch §14.4, (2) tiefere
signatur-getriebene Enden im EndingSystem, (3) Episoden-Lernmoment explizit im End-Report — Details unten je Phase.
- **✅ P0 — Hygiene:** Save/Load-Migration (`SAVE_FORMAT_VERSION` 1.1.0 + Default-Merge, R1), zentraler
  ID-Validator (`IdValidator.ts`, R3/R4, warn-only, prüft auch Episoden-Refs), dynamische Versionsanzeige
  (`__BUILD_STAMP__` via vite `define`, §14.6). Tests: SaveLoadMigration, IdValidator.
- **✅ P1 — Gesellschaftswerte als Zustand (B2a):** volles Werte-Set in `StoryResources` (sichtbar
  Polarisierung/Informationslast/Zynismus + Vertrauen aus dem Ziel; intern Fragmentierung/Diskursqualität
  + Auftrags-Achsen Wehrhaftigkeit/Reformfähigkeit/Fraktions-Stärke). HUD-Leiste „GESELLSCHAFT". **OHNE
  Sieg-/Balance-Änderung** (deterministischer `BalanceInvariant`-Test pinnt die obj_destabilize-Mathematik).
- **✅ P2 — Effekt-Splitting + Formeln (B2b):** `SocietyDynamics.ts` (pure) — Aktions-Effekte speisen die
  Werte; nicht-lineare Phasen-Formeln (Polarisierung→Fragmentierung, Info-Last→Diskurs↓, …). Werte
  differenzieren Strategien; obj_destabilize unangetastet.
- **✅ P3 — Angriffs-Phänomene (B3):** 6 Familien / 18 Aktionen (`actions_p3_phenomena.json`):
  Überflutung · Gerüchte-Mutation · Zermürbung · Krisen-Zeitfenster (×1.5, 3 Phasen) · Loyalitätsfalle ·
  Erinnerungskonflikt. +4 Atlas-Methoden (14→18). Gerüchte-Druck reift verzögert. Sim im Rausch-Band.
- **✅ P4 — Episoden + Korkbrett (B1):** `episodes.json` (10er-Batch inkl. Veen/Ferro/Brücke), `EpisodeLoader.ts`
  (pure, Auslöser always/Wert/worldEvent), Engine-`episodeState` (offered/active/completed) auf dem lebenden
  NPC-Pfad, `wirkt_auf` balance-neutral (nur Gesellschaftswerte). **UI:** NPC bietet Episode im Dialog an →
  aktiver Strang am Korkbrett (**Spuren = Episoden-Stränge**) + Einklink-Maßnahmen auf den Sendeplan.
- **✅ P5 — Strategische Aufträge (Keil/Wahl/Zweifel):** `Auftraege.ts` (Signatur-Achsen + Instrument §14.2),
  Engine-Auswahl + Fortschritt, im HUD sichtbar. **Auftrags-Wahlbildschirm** beim Einstieg/Neustart
  (`AuftragSelect`, Plague-Inc.-Stil). „Vertrauen = Mittel, Auftrag = Ziel." v1 balance-neutral
  (obj_destabilize bleibt der Sieg). **✅ Politur:** **signatur-getriebene Enden** (`EndingSystem.assembleAuftragEnding`)
  — Tonalität (kalt/pyrrhisch/knapp aus Moral-Preis/Enttarnungsnähe) + Kategorie (victory/pyrrhic) + 9 distinkte
  Titel/Schluss-Erzählungen je Auftrag × Ton + **Signatur-Bilanz** (Endwerte gegen Zielmarken); live im Sieg-Ende.
- **🟡 P6 — Vernetzung:** **Umfragen/Barometer als News (F3, §14.2)** — `PollNews.ts` (periodisch,
  Auftrags-Leit-Instrument, Tendenz). **Erzählerische Gegenseite (C9, §14.3)** — `Gegenseite.ts` leitet den
  Aufklärungs-Stand aus Aufmerksamkeit/Risiko/verbrannten Verbreitern ab; im Newsroom als „GEGENSEITE"-Streifen
  **inkl. erzeugtem Faktencheckerin-Porträt** (Asset, Vision-QC ✓). **Fokusgruppe** reagiert auf laufende
  Episoden (★-Hinweis). **Offen:** Broadcast-Schlagzeile direkt aus aktiver Episode · Publikum mechanisch auf
  Werte-Vektor · weitere TV-/Umfrage-Grafiken (Asset-Batch, Pipeline bestätigt lauffähig).
- **✅ P7 — Umgebungshumor + Ethik-Geländer:** **Sieg entheroisiert (G25)** + **reale Symbole „Moskau/Moscow"
  raus** (G23/24, Story-Pfad sauber). **Gegenmaßnahmen je Methode im End-Report** (`counter_de` an allen 18
  Atlas-Methoden). **Debrief verpflichtend** (End-Report öffnet bei Spielende automatisch). **Umgebungshumor
  §14.4:** klickbare Propaganda-Plakate (#1) · Reißwolf = Entdeckungsdruck (#7) · Pförtner liest letzte
  Schlagzeile (#12). **✅ Asset-Batch-Politur (state-reaktiv, Detail-Overlay):** **Kaffeeküche** (#2, Sorten =
  Wirtschafts-/Sanktionslage aus Risiko/Aufmerksamkeit/Moral) · **Volksbrause-Automat** (#9, Etikett reagiert
  aufs Narrativ/Auftrag) · **Mitarbeiter-des-Monats-Wand** (#8, gleiches Gesicht, Deckname zyklisch) ·
  **Büropflanze welk/grün je Moral** (#4, Asset-Swap `prop_plant_tall`↔`prop_plant_wilted`). 3 neue Pixel-Assets
  (Pipeline, Vision-QC'd, getrimmt); pure Helfer in `corridorDecor` getestet.

**Methodik-Notiz (wichtig für künftige Balance-Arbeit):** Die Balance-Sim ist durch `Math.random()`-Seedung
im Engine-Kern **inhärent verrauscht** (greedy/aggressiv ±1–2 run-to-run) — exakte Sieg-Quoten taugen NICHT
als „unverändert"-Beweis. Robuster Ersatz: `BalanceInvariant.test.ts` pinnt die seed-/combo-unabhängigen
**Effektwerte** von `applyActionEffects` (die reine obj_destabilize-Mathematik).

**Politur-Notizen Herzstück (✅ Session 2026-06-15 abgeschlossen):** P4 Episoden-Lernmoment **explizit** im
End-Report (`withEpisodeLearnings` → ★-Callout + Badge, ergänzt auch von der Tag-Klassifikation verfehlte
Episoden-Methoden) · P5 signatur-getriebene Enden im `EndingSystem` · P7 Umgebungshumor-Asset-Batch §14.4.
Alle additiv/balance-neutral (BalanceInvariant grün), Gate je Commit `tsc`·`vitest 388`·`build`.

---

**Vorheriger Stand:** 2026-06-14 · **PR #82 (gemerged)** — „Loop schließen".
**Geliefert PR #82 (alles grün, Gate je Commit `tsc`·`vitest 300`·`build`):**
- **P2-Loop geschlossen (Engine):** `playOperation` koppelt jetzt an Sieg/Niederlage — gelungene
  Operation erodiert das Institutionen-Vertrauen (Sieg-Ziel), Enttarnung (Verbreiter verbrannt) =
  echter öffentlicher Rückschlag (Vertrauen der Gegenseite↑, Risiko/Last springen). **Kompromat-
  Heikelheit ↔ `moral_weight` ↔ Enden** (Beschaffung + Ausspielen). `applyInstitutionalTrustDelta`-Helfer.
- **Bildungs-Kern (breit, SOUL §5):** `data/disinfo_methods.json` (**14 reale Methoden-Familien** —
  Kompromat/Schlachtfeld ist nur EINE) + pure `DisinfoMethodAtlas.classifyMethods` (Spielverhalten →
  reale Methode + dokumentierter Fall). **End-Report**-Abschnitt „Reale Methoden hinter Ihren Mechaniken"
  + Schlachtfeld-Bilanz; `getActionCatalog` für korrekte Legalitäts-Bilanz. Atlas deckt 99,2 % der Aktionen ab.
- **Balancing-Sim end-to-end** (`balance-sim-p2.test.ts`): gewinn- UND verlierbar mit den neuen Systemen
  (24 Partien 8/16; aggressiver Operator 7/8, rücksichtsloser 0/8 + 8 verbrannte Assets). Reguläre Balance unverändert (18/18).
- **Operations-Akte:** „FOLGEN"-Box macht den Loop am Entscheidungspunkt sichtbar. Detail: `STRANG34_P2_…KONZEPT.md` §10.
- **Owner-Hinweis** („Kompromat/Schlachtfeld nicht zu wörtlich") berücksichtigt: Konsequenz- & Bildungs-Schicht **generell**, nicht auf die Kompromat-Kette verengt.

**Geliefert PR #81 (gemerged-Stand, Gate je Commit `tsc`·`vitest ~290`·`build`):**
- **P2 abgerundet:** `OperationsAkteView` (diegetische Akte, Operationszentrale Etage 4) + `playOperation`
  + `params`-Durchstich; **Operations-Ökonomie** (Verbreiter-Aufbau/Budget, Kompromat-Beschaffung,
  Enttarnung→verbrannt) → kein Spam mehr.
- **Visual-Politur (Owner-Screenshots R1–R8):** Skyline (hi-res + Tageszeit-Himmel + natürlicher Übergang +
  dichter/keine Baulücke), **Entkachelung** der Etagen (saubere Korridore + datengetriebene Deko an der
  **Wand-Fuß-Linie**, `STAGE.floorStrip`), **Untergrund** unter dem Keller, **Fernsehfamilie** (warmes
  `styleHome`-Wohnzimmer + Sitzkomposition), Büro-Hotspots entrechteckt, Tür-/Fahrstuhl-Animationen sauber.
- **Sound:** adaptive Musik (J34/J35) + Ducking (J36) + Ambience je Raum/Overlay (`soundDirector`).
- **Strang 5 (6 Slices):** Pförtner (state-aware „Stimme des Landes"), stehende **+ anklickbare**
  Statisten, **laufende Reinigung**, **Tür-Dummies**, saubere Tür-/Fahrstuhl-Animation.
- **Skill** `.claude/skills/pixel-asset-pipeline` + Planungs-Hygiene (ROADMAP/TECHNICAL_DEBT/Konzept-Docs).

### ▶ Für die NÄCHSTE Session — großes Paket (frische Session wg. Token-Budget)
**✅ „Loop schließen" erledigt (PR #82).** **✅ Herzstück-Konzept ABGENOMMEN (2026-06-14, 3 Transkript-Runden):**
`KONZEPT_2026-06-14_HERZSTUECK_EPISODEN_WERTE.md` — das wichtigste *inhaltliche* Update. Kernpunkte gelockt:
- **Episoden/Vignetten** als Wirbelsäule (emergent-kuratiert, NPC bietet an) · **Korkbrett = Kampagnen-Planer**
  (Spuren = aktive Episoden-Stränge).
- **Strategische Aufträge statt generischer Destabilisierung** (Vertrauen = Mittel, Auftrag = Ziel): 5 heute-
  anschlussfähige Archetypen (Keil [Default], Stillstand, Wahl, Rückzug, Zweifel). **Zuerst bauen: Keil + Wahl + Zweifel.**
- **Mehrere Gesellschaftswerte** (4 sichtbar + interne Auftrags-Achsen Wehrhaftigkeit/Reformfähigkeit/Fraktions-Stärke
  von Anfang an im Datenmodell vorsehen) · erzählerisch via **fiktive Umfragen/Barometer als News** (verzögert/nicht-linear).
- **Neue Angriffs-Phänomene** (Überflutung, Gerüchte-Mutation, Zermürbung, Krisenfenster).
- **Vernetzung**: Broadcast = Schnellansicht, **Newsroom = Vertiefung** (erzählerische Gegenseite C9, NPC deutet),
  Fokusgruppe reagiert auf Episoden/Werte, Fernseher spiegelt Episoden-Schlagzeilen (Asset-Paket nötig), Umgebungshumor.
- **Bau-Reihenfolge §9.3** (B2a→B2b→B3→B1→Vernetzung→B4) · **Risiko-Register §10** (save/load-Migration, K14-Balance,
  ID-Kopplung, tote Hooks) · Ethik-Geländer mitgedacht (niedrige Prio).
**Nächster Schritt:** ✅ **Herzstück P0–P7 gebaut (PR #83):** alle Phasen grün (vitest 374). Aufträge wählbar
mit eigenen Enden, Episoden über das Korkbrett, lebendiger Broadcast/Newsroom (Gegenseite C9 + Asset)/Fokusgruppe,
Umgebungshumor (Plakate + Reißwolf), Ethik-Geländer (Gegenmaßnahmen + Debrief verpflichtend), reale Symbole raus.
**✅ Verbleibende Politur abgeschlossen (Session 2026-06-15):** (a) **Umgebungshumor-Asset-Batch** §14.4
(Kaffeeküche/Volksbrause/Mitarbeiter-des-Monats/Pflanze — 3 neue Assets via `pixel-asset-pipeline`, Vision-QC'd,
state-reaktiv in `corridorDecor`/`BuildingStage`); (b) **tiefere signatur-getriebene Enden** im `EndingSystem`
(Kategorien/Tonalität je Auftrag + Signatur-Bilanz); (c) **Episoden-Lernmoment explizit** im End-Report
(`withEpisodeLearnings`). Alles additiv, BalanceInvariant grün. **Offen (Preview/Owner):** Feinjustage der
Prop-Platzierung an der Wand-Fuß-Linie (in-Container nur teilweise verifizierbar; Deploy-Preview prüfen).
> ✅ **Bau-Plan:** `BAUPLAN_2026-06-14_HERZSTUECK.md` (P0 Hygiene → P1 Werte → P2 Splitting → P3 Phänomene →
> P4 Episoden/Korkbrett → P5 Aufträge/Enden → P6 Vernetzung → P7 Humor/Ethik). **Fortschritt: siehe Herzstück-Block oben.**

### 🔎 Aus dieser Session offen / nur im Preview zu prüfen (nicht in-Container verifizierbar)
- **Fernsehfamilie ausgeklappt** (Taste B): Sitzlinie/Köpfe — Preview prüfen, ggf. Skala/Position nachziehen.
- **Wand-Fuß-Linie** `STAGE.floorStrip`=40 + Strang-5-Tempo/Positionen — Owner-Feinjustage abwarten.
- **Avatar:** zu pixelig + Lauf-Figur **nicht** an Avatar-Wahl gekoppelt (Bugs) → hi-res + m/w-Lauf offen.
- Kleinkram: V4-Büro-Audit weiter, Lampen-abends-an, „2"-Welt-Badge diegetisch verorten.
- **PR #81 ist Draft** → reviewen/mergen, wenn Owner mit dem Preview zufrieden ist.

---

## ✅ Erledigt (gemerged)

| Strang | Inhalt | PR |
|---|---|---|
| 1 — Visuelles Rework v2 | Stil-Bibel v2, alle 9 Räume neu, NPC-Halbfiguren transparent, UI ein-Guss (Emojis 241→0, Schlagschatten 37→0*), Tag/Nacht + Jahreszeiten, Dialog-Porträts v2 | #77 |
| 2 — Diegetische Bedienung | Knopfbalken weg, `FloorDirectory` (Etagen-Tableau F), Broadcast permanent, Narrativ-Tafel (Korkbrett), `LagebildView`, HUD auf Knopfdruck (H), `PixelModal`/`PixelFrame` für ~14 Modals | #78 |
| 3+4 — Feinplan | Planungsdokument zur Abnahme (kein Code) | #79 |

\* **Korrektur (ehrlich):** „241→0 Emojis / 37→0 Schatten" war **leicht überzogen** — der
Sweep hat dauerhaft eingeblendete Seiten-Widgets übersehen (s. Visual-Backlog & Lessons).

## 🟢 In Arbeit (PR #80, Draft)

| ID | Inhalt | Status |
|---|---|---|
| **P0a** | `headline_de` an alle **110** Aktionen; Generator/Broadcast nutzen sie → „Aktion durchgeführt" weg | ✅ |
| **P0b** | `MorningBriefing`: konkreter Tageshinweis (Zahl + zuständiges Büro, nicht klickbar, D-4) | ✅ |
| **Visual-Politur** | `AdvisorPanel`: Verbots-Schlagschatten/Glow raus → Pixel-Innenrand; Prioritätsfarben auf v2-Palette | ✅ |
| **P1a (Slice 1)** | **Aktion aus Dialog:** NPC bietet im Gespräch kontextuelle Maßnahmen an (Filter `npc_affinity` + verfügbar) → Wahl heftet auf den Sendeplan (Narrativ-Tafel). Entscheidung 1. | ✅ |
| **Declutter** | Floating-Overlays (Berater/Queue/Combo) **im Gespräch ausgeblendet** + Berater standard eingeklappt → Maßnahmen-Optionen erreichbar, Konversation frei (Smoke-belegt) | ✅ |
| **P1d** | **Sprach-Steckbriefe** je NPC (`docs/NPC_VOICE_PROFILES.md`) — Schreib-Gate für alle Dialog-Texte (K41) | ✅ |
| **P1b (Pilot)** | **Marina-Stimme**: alle 16 Begrüßungen (Level 0–3) nach Steckbrief neu (selbstbewusst, bildreich, trockener Biss); keine Vertonung berührt | ✅ |
| **P1b (Skaliert)** | **Begrüßungen aller NPCs** (Direktor, Alexei, Katja, Igor) nach Steckbrief neu (je 16, Level 0–3); bereinigt zugleich Alt-Persona-/Reale-Orts-Reste (Moskau/Kreml/Wodka) im Direktor | ✅ |
| **Deck-Gruppierung** | Narrativ-Tafel zeigt Maßnahmen **nach zuständigem Büro/NPC** statt flacher Liste (Entscheidung 1) | ✅ |
| **P1c (Affinitäten)** | **Alle 110 Aktions-Affinitäten** auf den kanonischen Roster (Owner: „Rollen wie Stimme") umgemappt → Orphan `volkov` weg, Dialog-Angebote je Büro stimmig | ✅ |
| **P1c (Content)** | **+15 granulare Aktionen** (`actions_p1c.json`, 110→125): **Igor/Finanz 3→10** inkl. **Kredit-Mechanik** (negative Budget-Kosten = Geldspritze, einmalig) + **Fokusgruppe** (K40), je Büro ergänzt. Balance-Sim: **18 Sieg / 18 Niederlage** (gewinn- UND verlierbar) | ✅ |

Gate je Push grün: `tsc` · `npm run build` · `vitest` (262, inkl. P2-Akte/Engine). Smoke: `npm run smoke`
(Playwright, s. unten).

---

## 🔧 Visual-Coherence-Backlog (Owner-Feedback 2026-06-14, Preview #80)

Owner-Beobachtungen am Deploy-Preview + Verdikt **„zurückgestellt vs. übersehen"** nach Code-Inventur.
Prinzip (SOUL): visuelle Kohärenz ist das Erste, was Nutzer beurteilen.

| # | Beobachtung | Befund | Verdikt | Wohin |
|---|---|---|---|---|
| V1 | **Berater-Panel** (rechts) im alten Stil, „floating" | Verbots-Schatten/Glow + Off-Palette-Farben | **übersehen** (Strang 1 verfehlt) | **in #80 behoben** (Schatten/Farben); diegetische Auflösung = P1 |
| V2 | Berater als **dauerhafte Floating-Sidebar** statt diegetisch | widerspricht A2/A4 | **entschärft** (standard eingeklappt + im Gespräch ganz aus; Empfehlungen jetzt im Dialog) | Rest: Berater-Inhalt ganz in KONTAKTE-Panel verlagern → schmaler Rand-Tab entfällt |
| V3 | **Direktor-DialogBox** (roter Balken) wirkt legacy | v2-Farben + inset-Rahmen, aber flach | **Audit erledigt:** „Click to continue…" → „Weiter ▸" (war englisch), Auswahl-Liste gedeckelt+scrollbar (deckt den Raum nicht mehr zu, A3), Padding gestrafft | optional echtes 9-Slice-Pixel-Asset (Budget) |
| V10 | **G23/G24-Altlasten:** reale Bezüge (Moskau/Kreml/Genosse/Wodka/Russisch/Vaterland; „Russian minority/Soviet monument") | widerspricht „fiktiver Ost-Block, keine realen Symbole/Namen" | **✅ vollständig entschärft:** 28 „eigene Seite" (→ „die Zentrale" etc.) + 12 world-events (→ ostsprachige Minderheit, altes Regime). Player-sichtbar 0 reale Bezüge (nur interne ids/keys bleiben) | — |
| V11 | **Reaktions-Texte in Steckbrief-Stimme** (P1b) | Begrüßungen fertig | **✅ ALLE 5 NPCs:** Direktor+Marina vertont; **Alexei/Katja/Igor re-themed** (31 Reaktionen: `triggered_by_tags` auf die neuen Rollen-Aktions-Tags + Voice) — behebt zugleich, dass diese drei nach dem Affinitäts-Remap auf ihre Aktionen GESCHWIEGEN hätten (Tests belegen Feuern). | **Offen:** Topic-Texte in Stimme |
| V4 | **Büro-Panels** (Kontakte etc.) „andere CSS-Sachen" | Modals sind auf `PixelModal`, aber flach; einzelne Panels evtl. nicht migriert | **Audit nötig** | Mounted-Component-Audit (alle Panels gegen Stil-Bibel) |
| V5 | **HUD** teils alter Stil | `StoryHUD` nutzt v2-inset; Knopfdruck (H) da | **gering** | Feinpolitur im Stil-Audit |
| V6 | **Floating-Element links unten** (Auftrag/Hinweise) | `ComboHintsWidget` (`fixed bottom-4 left-4`), nicht-diegetisch | **übersehen** | diegetisch verorten oder in HUD/Tafel ziehen |
| V7 | **Avatar läuft, Beine bewegen sich nicht** (Schweben) | **Code-Bug gefunden & behoben:** `AssetRegistry.sheet()` gab je Render ein NEUES Objekt → `useSprite`-Effekt setzte den Frame bei jedem Re-Render auf 0 (beim Gehen rendert die Bühne ständig → eingefroren). Sheet jetzt referenz-stabil (memoisiert). Sprite-Sheet ist korrekt (256×32 = 8 Frames). | **✅ behoben** (kein Asset nötig) | Falls Frames optisch zu schwach: Neu-Generierung (Budget) als Fallback |
| V8 | „viele Feinheiten" aus Gesprächen fehlen | Atmosphäre (Dummies/Pförtner/Tür-Anim, D13) = **Strang 5**, bewusst später | **geplant** | Strang 5 (Atmosphäre) |
| V9 | **Lobby** = dasselbe Bild 3× nebeneinander → wirkt wie ein Bug, keine ganze Halle | EG-Hintergrund kachelte `repeat-x`; jetzt **`no-repeat` + `cover`** → eine durchgehende Eingangshalle (Flure kacheln weiter) | **✅ behoben** | Rest: optional breiteres Lobby-Asset + Pförtner-Figur (Asset/Budget) |

**Empfohlene Reihenfolge:** V1 (✅) → V4-Audit (klein, klärt Umfang) → **P1** (löst V2 strukturell) →
V3/V6 (Stil-Audit) → V7 (Asset-Arbeit, Budget-Ansage) → V8 (Strang 5).

### 🆕 Runde 2 — Owner-Screenshots 2026-06-14 (Detail: `VISUAL_AUDIO_BACKLOG_2026-06-14.md`)
| # | Beobachtung | Aktion | Kosten |
|---|---|---|---|
| V12 | **Skyline zu klein, schwarzer Himmel zu groß**, kaum Tageszeit-Abwechslung | Himmel als tagesuhr-Verlauf (7 Stops) + Skyline-Band höher; später 2–3 Skyline-Varianten cross-faden; Jahreszeit bleibt Overlay | erst gratis/Code, dann moderat |
| V13 | **Büro-Hotspots = orange Rechteck-Drahtgitter** über den Möbeln („platt") | Ruhe-Ring weg, Hover-Glow folgt der Objektform; „2"-Welt-Badge diegetisch verorten; ggf. Büro-Neuaufbau | gratis/Code (+ggf. Highlight-Assets) |
| V14 | **Seitenleiste** (Nachrichten/Queue) wirkt als flache Web-Sidebar (zwei Welten) | ins diegetische System (Papier/Klemmbrett oder PixelModal wie Akte); Rand-Tab weg (V2-Rest) | Code |
| V15 | **TV/Wohnzimmer:** Publikums-Figuren kaputt, Raum/Sofa altbacken; Leiste zu niedrig | Audience-Figuren + Wohnzimmer/Sofa neu (Asset); **Broadcast-Leiste höher** (Code) | Code + Asset-Paket |
| V16 | **Avatar** zu pixelig + nicht an Wahl gekoppelt (s. Bugs) | höher auflösen; m/w-Lauf-Variante passend zum Porträt | Asset/Budget |

---

## 🗺️ Roadmap Strang 3+4 (Feinplan §3, abgenommen §10)

| Phase | Inhalt | Status |
|---|---|---|
| **P0** | Aktions-Überschriften + Direktor-Hinweise | ✅ (PR #80) |
| **P1** | Aktion-aus-Dialog · Menü→Gespräch · granularere Aktionen · Sprach-Steckbriefe · NPC-Vorschläge im Gespräch (löst V2) | **Kern fertig** (PR #80) — ✅ P1a, ✅ P1b (Begrüßungen ALLER NPCs), ✅ P1c (Affinitäten + 15 neue Aktionen, 125 gesamt, Balance 18/18), ✅ P1d, ✅ Declutter, ✅ Deck nach NPC. **Rest-Politur (laufend):** P1b Topics/Reaktionen in Steckbrief-Stimme; weitere Aktions-Pakete + Marina (50) entlasten; situative Eröffnungen |
| **P2** | Kommunikations-Schlachtfeld (Ziel→Dossier→Kompromat→Verbreiter+Plattform-Mix). | **✅ fertig (Loop geschlossen, PR #82):** Engine (`BattlefieldChain`) + Daten + `playOperation` + Ökonomie (Aufbau/Kompromat/verbrannt) + **an Sieg/Niederlage gekoppelt** (Trust-Erosion/Rückschlag, Moral↔Enden) + **End-Report-Bildung** (`DisinfoMethodAtlas`) + **Sim end-to-end**. Detail: P2-Konzept §10 |
| **P3** | Gebäude-Wachstum (`unlocksRoom`/`unlocksNpc`) + 100–500-Pfade-Simulation | **offen — Empfehlung nächste Session** |

## 🪲 Bekannte Bugs / Altlasten

- **Avatar läuft NICHT mit der Avatar-Wahl mit** (neu 2026-06-14): die Lauf-/Idle-Figur ist ein
  einziges festes Sheet (`player_walk`/`player_idle`, `BuildingStage.tsx:543`); die Avatar-Wahl
  ändert nur das **Porträt** (`portrait_player_<id>`). Entscheidung nötig (Porträt-only vs. m/w-Lauf).
- **Avatar zu pixelig** (Owner 2026-06-14) — 32 px nativ ×4; Neu-Generierung höher aufgelöst (Asset).
- ~~**Avatar-Beine starr** (V7)~~ — **✅ behoben** (Sheet referenz-stabil memoisiert, Strang-1-Bug);
  Schweben weg. (Frühere Doppel-Listung korrigiert.)
- **NPC-Rollen-Inkonsistenz (3-fach, wichtig für P1c):** drei Quellen widersprechen sich —
  (a) `npcs.json` Rollen-Labels (Direktor=Leiter, Alexei=Technik, Katja=Feld, Igor=Finanz,
  Marina=Medien), (b) Aktions-`npc_affinity` (marina=Analyse, **volkov**=Ops/Infra [keine NPC-Id!],
  igor=Technik, katja=Content, direktor=Strategie), (c) alte `dialogues.json`-Personas (Direktor
  sowjetisch, „alexei"-Block = `vol_greet_*`-Chaos-Op, Katja=Content-Künstlerin, Igor=Hacker).
  **Folge:** manche Maßnahmen (volkov-Affinität) haben kein Büro, das sie im Dialog anbietet
  (P1a-Lücke). **GELÖST (2026-06-14):** Begrüßungen auf `npcs.json`-Rollen vereinheitlicht; Owner-Roster
  „Rollen wie Stimme" gelockt; alle 110 Affinitäten umgemappt (marina=Medien&Aufklärung · alexei=Technik ·
  katja=Feld · igor=Finanz · direktor=Strategie/Politik). **Rest:** Verteilung schief (marina 49 / igor 3)
  → in P1c-Content rebalancieren (Igor/Finanz-Aktionen ergänzen, Marina entlasten).
- **`npm run lint` defekt** — keine ESLint-Config im Repo; Gate stützt sich auf tsc/build/vitest.
- **Pixel-Font** blockiert (Netz-Policy) — `font-mono`-Reste bis lizenzfreie Datei vorliegt.

## 🛠️ Werkzeuge

- **Browser-Smoke:** `npm run smoke` (baut nicht; setzt laufenden `vite preview --port 4173` voraus)
  bzw. `scripts/app-smoke.mjs` (Playwright-core, Chromium im Container). Screenshots → `runs/app-smoke/`.
- **Daten-Skripte:** `scripts/add-headlines.mjs` (headline_de-Provenienz, idempotent).
