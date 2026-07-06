# 📍 STATUS — zentrale Übersicht: erledigt · offen · TODO

**Zweck:** EIN zentraler, lebender Einstieg über den Projektstand — was erledigt ist, was
offen/zurückgestellt ist, und die priorisierte TODO-Liste. Ersetzt nicht die Detailpläne,
sondern verlinkt sie. **Jede Session aktualisiert dieses Dokument.**

> Lese-Reihenfolge: `SOUL.md` → **`DECISIONS_2026-07-04_TRANSKRIPT_SIEG.md`** (bindend) →
> **`ZIELBILD_2026-07-04_WETTRENNEN.md`** (kanonisches Zielbild + Etappenplan) →
> `GESAMTKONZEPT_VISUELL.md` → dieses Dokument für den aktuellen Bau-Stand.
> Lessons Learned: `ORCHESTRATION_FEEDBACK.md`.

**Stand:** 2026-07-05 (VISUAL-COHERENCE-REVIEW — Befunde + Plan, KEINE Fixes) · Branch
`claude/visual-coherence-review-26f8av` (Draft-PR #95) · Gate grün (`tsc 0` · `vitest 575` · `build`).
> Optisches Gesamt-Review per wiederverwendbarer Playwright-Ernte + orchestriertem Vision-Review.
> **Zentrale Ergebnisse: `docs/VISUAL_REVIEW_2026-07-05.md`** (P1–P5 priorisiert nach Code-Fix /
> Asset-Korrektur / neues Asset / Owner-Geschmack; Voll-Liste `_BEFUNDE.json`; Owner-Galerie verlinkt).
> - **Harness (wiederverwendbar):** `desinformation-network/scripts/visual-review/` — Ernte über
>   ALLE Screens/Zustände (Tag/Nacht, alle Etagen, 5 Raum-Nahsichten, Panels/Modals, Tageszyklus,
>   3 echte Wahlabend-Enden per Force-End + 4 Fixture-Branches, EndReport) + 11 Video-Clips +
>   Boden-Linien-Overlays + Geometrie-Dumps; `?vqa=1`-Hook (sonst inert), Fixture-Bühne `vqa.html`.
> - **Realitätssicht (pixelgenau, ohne KI):** Standlinien-Klassen versetzt — Props 0 px / Avatar
>   +6 px / Türen +7,5 px (eingebacktes Padding) / Statisten +11–16 px (PixelSprite-Ausrichtung,
>   V7-Fehlertyp neu bei Strang 5); sichtbare Türhöhe 1,77 m = 1,01 H statt Soll 1,15 H; übrige
>   Möbel-Skala konsistent. Welt-Ebene wird **nicht-ganzzahlig skaliert** (§4.1-Wurzelverstoß).
> - **Vision-Review:** 172 Roh-Befunde aus 16 Prüf-Bündeln (Gemini 3.1 als Zweitmeinung, Videos
>   mit Gemini als Haupt-Prüfer) → adversarial verifiziert: **115 bestätigt** / 37 widerlegt /
>   7 Duplikate. Schwerste Funde u. a.: Alt-Enden-Raster im End-Report („Enthüllung ✓" bei jedem
>   Branch), leerer CSS-TvSet (E17), Web-Sidebar/Floating-Widgets (V14/V6 offen), Fahrstuhl-Z-Order,
>   Umlaut-/Englisch-Reste. Regressions-Sweep: V9/V16 halten, V7 hält am Avatar (neu bei Statisten),
>   V13 teilbehoben (Hotspot-Geometrie verrutscht), V14/V6 offen.
> - **NICHTS generiert/gefixt** (Owner-Vorgabe): Shot-List Paket 0 (0 €, Trim+Code) / A (TV-Studio,
>   ~1,10 $) / B (Wohnzimmer, ~1,35 $) / C (Kür, ~3 $) mit Budget-Ansage wartet auf Freigabe.
> - **Harness-Backlog:** 15 Ernte-Lücken mit Rezepten (`_BEFUNDE.json → luecken`); Nebenbefund:
>   `requestNachspielzeit()` hat keinen UI-Aufrufer (Zielbild-§5b-Lücke).

**Stand:** 2026-07-05 (ETAPPE 5 „Fertig" — der Versionssprung, TEILWEISE) · Branch
`claude/etappe-5-handoff-setup-29psoe` (Draft-PR, baut auf Etappe 0–4) · Gate grün
(`tsc 0` · `vitest 575` · `build`; beide Sim-Gates tragfähig, greedy 15/24, low_risk 1/24).
> Der Versionssprung ist in 6 Paketen geliefert; die tiefe Aktions-Kuratierung ist bewusst
> an die impact_scale-Abschaffung gekoppelt und als Balance-Follow-up dokumentiert (siehe unten).
> - **Kurator-Rename (§10/O6):** Der Spieler bleibt „Direktor"; Volkov ist „Kurator Volkov —
>   Verbindung zur Zentrale" (npcs.json, DialogBox-Alias volkov/kurator→direktor-Assets,
>   Erzähl-Reaktionen, Intro-Text „40 Tage" statt „10 Jahre"). Browser-Smoke bestätigt.
> - **Paket B — Geld-Tranchen (E18, §11):** `engine/Finanzen.ts` (pur): die Zentrale zahlt in
>   Tranchen NACH Fortschritt (Bonus/Plan/Partial/Mahnung→Kürzung, eskalierende Mahnstufe) statt
>   +5/Phase passiv. Pleite = Würgeschlinge Richtung Timeout, kein eigener Game-Over. Läufer-
>   Historie fürs Endreport aufgezeichnet. Nachspielzeit (§5b) als guarded Einmal-Hebel. Save **2.3.0**.
> - **Paket C — Enden-Beschnitt + Wahlabend (§4/§9):** VictorySystem auf EIN Siegweg / DREI
>   Verlustwege beschnitten (broke/moral_redemption/escape als eigene Game-Over raus →
>   Timeout-Vorstufe bzw. Epilog-Färbungen). `GameEndState.type` = victory|defeat + `branch`.
>   **`WahlabendScene.tsx`** (ein TV-Set, drei Enden: Balken kippt / bleibt stehen / Sondersendung
>   mit GEFÄLSCHT-Stempel) + **TvSet-Baukasten** (E17, CSS-Fallback; echtes Studio-Asset später).
> - **Paket D — HUD + Vergabe-Szene + Endreport:** HUD auf 4 Größen (SONNTAGSFRAGE-Balken NEU +
>   ABWEHR + KASSE + TAG; Risiko/Aufmerksamkeit/8-Werte-Strip raus, §6/§12.4; situative
>   Enttarnungs-Warnung). AuftragSelect → **Vergabe-Szene** (EINE Akte „Die Wahl", Partei
>   „Westunion Erwacht", Browser-Smoke bestätigt). Endreport: **„Das Rennen"-Kurven** (beide Läufer),
>   Jahres-Achse-Degeneration behoben (round = Kampagnentag).
> - **Paket A — Aktions-Invariante:** `ActionRunnerInvariant.test` sichert dauerhaft „jede Aktion
>   bewegt einen Läufer" (7 ta01-Enabler mit faint ABWEHR-Spur, balance-neutral). **BEFUND:** die
>   Reduktion 143→60–80 ist NICHT balance-neutral, solange impact_scale das Wirkmodell ist
>   (empirisch belegt: impact_scale-Aktionen entfernen bricht greedy 58→12 %; Low-Risk entfernen
>   macht Passivität zu stark 4→75 %). WIN_THRESHOLD bleibt 0.6.
> - **Offen / Carry-forward:** (1) **Deep-Kuratierung** = impact_scale abschaffen → explizite
>   Läufer-Effekte je Aktion → 143→60–80 → WIN_THRESHOLD→1.0 (dedizierte Balance-Session,
>   `HANDOFF_2026-07-05B_ETAPPE5_FOLLOWUP.md`). (2) **Tag-0-Hoax-Tutorial** (O7) — **beschlossen**
>   (Zielbild §10/§15, bestätigt 2026-07-05) → als Zwei-Balken-Onboarding **bauen**; die frühere
>   „NICHT beschlossen"-Kopfzeile war überholt und ist korrigiert. (3) **TV-/Wohnzimmer-Assets**
>   (Studio, 5 Alphabet-Bilder) via pixel-asset-pipeline mit Budget-Ansage.

**Stand:** 2026-07-04 (RICHTUNGSWECHSEL) · **Owner-Transkript F1–F25 beantwortet** → bindende
Entscheidungen E1–E20 (`DECISIONS_2026-07-04_TRANSKRIPT_SIEG.md`), ausgearbeitet per Design-Panel
(5 Entwürfe + 3 Juroren + 2 Sweeps) zum kanonischen **`ZIELBILD_2026-07-04_WETTRENNEN.md`**:
> - **Sieg = EIN Weg:** Auftrag „Die Wahl" — Sonntagsfrage über die Schwelle bringen, bevor die
>   ABWEHR (Immunsystem, befördertes `wehrhaftigkeit`) 100 erreicht oder der Wahltag (~Tag 40) kommt.
>   **R2 ist gefallen** (Beats/Episoden koppeln an den Sieg); `obj_destabilize`-Sieg + Halte-Logik entfallen.
> - **Drei Verlustwege:** Land hält stand · Wahlabend verloren (Pleite = Vorstufe) · Enttarnt.
>   Verrat = +15-Abwehr-Ereignis statt eigener Game-Over.
> - **Nächster Schritt = Etappe 0 „Leitplanke":** hartes Gewinnbar/Verlierbar-Sim-Gate + die 8
>   Nebenbefunde fixen (KONZEPT-Anhang), DANN erst umverdrahten (Etappen 1–5, Zielbild §13).
> - SOUL.md revidiert (P3 Uhr, P5 Lernmomente, P11/P12 neu); alte R2-Dokumente mit Superseded-Kopf.

**Stand:** 2026-07-05 (ETAPPE 4 „Impfung & Abstumpfung" ✅) · Branch `claude/etappe-4-startup-ad97om` · Gate grün (`tsc 0` · `vitest` · `build`). Baut auf Etappe 0–3 (PR #89/#90, main).
> Das Immunsystem hat sein **Gedächtnis**: Abstumpfung + Impfung je (Milieu × Maschen-Familie), sichtbar NUR als Stempel/Bilder (E6), warnend VOR dem Ausgeben (E7), erklärend nach der Verpuffung (E5).
> - **Paket A — MaschenGedaechtnis** (`engine/MaschenGedaechtnis.ts`, pur, Muster NarrativeMemory): 8×18-Matrix, Abnutzung je Zelle mit Multiplikator-Treppe **1,0 → 0,6 → 0,3** (FRISCH/BEKANNT/VERBRANNT), Verfall beim Lesen (Ruhen lohnt: BEKANNT→FRISCH in ~4 Tagen). **Abstumpfung nur in RESONANTEN Milieus** (wo die Botschaft verfängt) — „Milieu wechseln" bleibt ein echter Ausweg (Zielbild §7). Impfung als eigener Kanal: **Prebunking groß/langsam** (0,45, ~Wochen) **> Faktencheck klein/schnell** (0,2, ~3 Tage). Untergrenze 0,15 (E9: nie Null). Ziel-Milieu-Ableitung (Tag→Kanal/Themen) aus der Anzeige-Schicht in die Engine gezogen (E16); broadcastMapping importiert von dort — EIN Vokabular.
> - **Paket B — Engine-Integration:** Multiplikator steckt in `applyActionEffects` neben `reachDampening` (wirkt auf Sieg-Mathematik UND Gesellschafts-Deltas — keine doppelte Buchhaltung, Falle 4/10). E5-Quittung im Aktions-Ergebnis (`maschenQuittung`): „Wirkung: gering. Grund: Masche bekannt — Prebunking-Kampagne der Landeszentrale, Tag 9." **„Gepatcht" umgezogen** (Falle 6): die alte globale Zählung (`methodFamilyUseCounts`) ist ERSETZT — der Patch-Trigger zählt jetzt im Gedächtnis, und ein Patch stempelt die Familie ÜBERALL mindestens BEKANNT (dafür Abwehr-Sprung 4→3, sonst doppelte Strafe). Save **2.1.0→2.2.0** (additiv; Alt-Zählung wird migriert, gepatchte Familien bleiben bekannt).
> - **Paket C — Prebunking > Debunking:** cm24 (Abwehr-Stufe 25) **impft statt Trust-Regen**: Familien-Immunität auf die meistgenutzten Maschen, nur über klassische Kanäle (tv/print) — das rein soziale Milieu (Bohemiens) bleibt unerreicht (Doppelboden). Ohne gespielte Masche läuft die Kampagne diegetisch ins Leere (kleiner Vertrauens-Rest). Reaktive Faktenchecker-Gegen-Narrative impfen klein/schnell NUR das zuletzt bespielte Milieu statt globaler Dauer-Dämpfung (Falle 10). KEIN Backfire-Malus (E9).
> - **Paket D — UI:** FRISCH/BEKANNT/VERBRANNT-Stempel auf der Aktionskarte (an der Impact-Preview-Stelle), Verpuffungs-Quittung als grauer Kastenstempel im Ergebnis (E8), Wohnzimmer-Alphabet-Grundzustände (Faktencheck-Zeitung/Abwinken aus dem Gedächtnis; Streit/einsam/Fahne aus Stimmung/Glaube) als CSS-/Text-Badges — Asset-Batch (5 Bilder) als Budget-Vorschlag offen.
> - **Paket E — Balance:** Das Rennen neu kalibriert (Gedächtnis dämpft den Spieler-Durchsatz ~⅓ → Abwehr-Zuflüsse proportional runter: Lärm 0,46/0,29→0,41/0,26 · Verteidiger 0,85→0,70 · Grundrauschen 0,35→0,22 · Patch 4→3). Sim-Gate 8× flakefrei: Aggregat ~37–42 Sieg / 30–35 Niederlage (72 Partien), greedy 13–16/24 (Median ~60 % — obere Korridor-Kante, Feinschliff via Aktions-Kuratierung Etappe 5), random ~24/24 (Rotation gewinnt — der Kern der Etappe wirkt), **low_risk 0–3/24: reine Passivität verliert jetzt mechanisch** (Zielbild §3d; bewusste Band-Verschiebung ggü. Etappe 3, wo low_risk 29–63 % hielt). **Enttarnung feuert wieder** (3–7/72 statt ausgehungert). `balance-sim-p2` grün (16/24; op-Spiel intakt, reckless 0/8).
> - **Carry-forward Etappe 5:** greedy an die Korridor-Mitte holen + „jeder Verlustweg ≥ 15 %" (beides via Aktions-Kuratierung); Wohnzimmer-Alphabet-Asset-Batch (pixel-asset-pipeline, Budget-Ansage); HUD-Konsolidierung (Risiko raus); Sim-Referenz-Strategie „rotierend" optional nachrüsten.

**Stand:** 2026-07-04 (ETAPPE 3 „Immunsystem sichtbar" ✅) · Branch `claude/etappe-3-handoff-startup-0fr81v` · Gate grün (`tsc 0` · `vitest 533` · `build`). Baut auf Etappe 0–2 (PR #89).
> Der zweite Rennläufer lebt: **ABWEHR 0–100** (befördertes `wehrhaftigkeit`) mit Stufen 25/50/75, Verlust „Das Land hält stand" bei 100 (Zielbild §3/§4/§7).
> - **Paket A — ImmuneSystem** (`engine/ImmuneSystem.ts`, pur/testbar wie VictorySystem): nächtlicher Abwehr-Schritt aus vier Zuflüssen — Lärm (Risiko/Aufmerksamkeit der eigenen Aktionen+Operationen), Verteidiger-Maschinerie (`getDefenderStrengthSum`+`armsRaceLevel`), Maschen-Wiederholung („Gepatcht" übers 18er-Atlas-Vokabular, `counter_de`-Lernmoment), Zeitgrundrauschen. `wehrhaftigkeit` Start 60→8 (das Land ist naiv); passive Formeldrift auf die Abwehr **entfernt** (Falle 4, falsches Vorzeichen). Neuer Verlustweg `immune` in `VictorySystem` (VOR Sieg+Timeout; Enttarnung bleibt getrennt). Save **2.0.0→2.1.0** (Altstände erben den neuen Abwehr-Start).
> - **Paket B — Stufen-Gegenmaßnahmen:** an 25/50/75 feuert je eine kuratierte DISARM-Maßnahme (Prebunking cm24 · Plattform-Sperre cm05 · Task-Force cm22) mit vereinheitlichten Reaktionen kontern/aussitzen/ablenken (`StageCountermeasureModal`). `CountermeasureSystem.triggerById` (vorher null Aufrufer). Nacht-Vorschau `getNightPreview` fürs Tagesfazit.
> - **Paket C — Zähne scharf:** Plattform-Sperren durchgesetzt (`isActionDisabledByAI` in getAvailableActions **und** executeAction — „Kanal gesperrt"), `reach_reduction` implementiert (Wirkungs-Dämpfung, klingt ab), `BetrayalEvent.effects` angewandt → **Verrat = +15-Abwehr-Ereignis** mit Leak-Story; `apparatus`-Verlustweg entfernt (3 Kern-Verlustwege).
> - **Paket D — UI:** ABWEHR-Balken im HUD (Stufen-Marken 25/50/75), Nacht-Transparenz im DayReport („Über Nacht: …"), Gegenseite-Vignetten mit Stufen-Attribution.
> - **Paket E — Balance:** Wettrennen austariert — aggressives Spiel fliegt jetzt am Immunsystem auf statt an Sofort-Enttarnung. Sim-Gate (`winnable-and-losable`, 72 Partien, 8× flakefrei) mit **scharfgeschalteten Bändern**: greedy 29–50 % (Median ~42 %, Zielbild-Korridor 30–60 %), low_risk 29–63 % (Passivität kein sicherer Weg), Immun-Verlustweg feuert robust. Operationen mobilisieren die radikale Kraft (op-Spiel bleibt gewinnbar). **Carry-forward Etappe 5:** 2. Verlustweg (Enttarnung) ≥15 % — im Sim dünn, weil der Rambo vorher an der Abwehr scheitert; die Aktions-Kuratierung formt den Draw um.
> - **Detail-Arbeitsplan/Fallen:** `HANDOFF_2026-07-04_ETAPPE3.md`. **Offen (Preview/Owner):** ABWEHR-Balken-Optik + Nacht-Box am Deploy-Preview sichten; HUD-Konsolidierung (Risiko raus) ist Etappe 5.

**Stand:** 2026-07-04 (ETAPPE 2 „Die Uhr" ✅) · Branch `claude/gracious-keller-g43bu3`, PR #89 · Gate grün (`tsc 0` · `vitest 482` · `build`).
> - **Kampagnen-Uhr:** 120-Phasen-Kalender (12 Monate × 10 Jahre) → **40-Tage-Wahlkampagne** (1 Tag =
>   1 Phase, `electionDay`, `CAMPAIGN_DAYS_DEFAULT=40`). `StoryPhase.year/month` deprecated (konstant),
>   neu `electionDay` + Countdown-Labels. Timeout-Ende → **„Wahlabend verloren"**. Pacing/Poll/Cooldown
>   auf Tage umgerechnet (Grace 42→12, Welle 6→4, Poll 3→5 = Sonntagsfrage, Cooldown 12→6). Alle
>   HUD/Report-Komponenten zeigen Tag+Countdown. `shiftElectionDay`-API bereit. Save 1.1.0→**2.0.0**.
> - **Isolation geschlossen:** `createStoryEngine()` resettet jetzt alle Gameplay-Singletons → der
>   Etappe-0-State-Leak zwischen Partien (Spiel-Neustart + Sim-Läufe) ist behoben; Sim jetzt stabil.
> - **Selbst-Review-Fixes:** Doppel-Sound bei Krisen-Auflösung entfernt; EndReport/GameEndScreen von
>   Jahre/Monate auf Kampagnen-Tage umgestellt. Tests geflippt (Pacing, PollNews, StoryEngineAdapter,
>   EndReport, DecisionBeatFlow — letzterer: Krisen-Mock NACH startGame wegen neuem Reset).
> - ⚠️ **Balance invertiert (Tuning-Ziel Etappe 3):** greedy 0 % / low_risk 100 % in der kurzen
>   Kampagne; Gate (gewinnbar UND verlierbar, 23/13) hält robust. Bewusst NICHT jetzt getunt — das
>   ImmuneSystem (Etappe 3) formt Risiko/Ertrag neu. Nächster Schritt: **Etappe 3 „Immunsystem sichtbar"**.

**Stand:** 2026-07-04 (ETAPPE 1 „Auftrag = Sieg" ✅) · Branch `claude/gracious-keller-g43bu3`, PR #89 · Gate grün (`tsc 0` · `vitest 482` · `build`).
> - **Sieg = Auftrag:** neues Modul `story-mode/engine/VictorySystem.ts` (reine Ausgangs-Entscheidung).
>   Sieg = Signatur „Die Wahl" erfüllt (Min-Regel, `auftragProgress(…,'min')`) — nicht mehr gehaltenes
>   Vertrauen (`obj_destabilize`-Halte-Logik ist raus). R2 gefallen: Beats/Episoden mit `vertrauen`-Delta
>   koppeln jetzt an die Sieg-Achse (`applyTrustDelta`). EIN Auftrag (Default `wahl`).
> - **Reachability-Fix (vom Gate aufgedeckt):** Sieg war zunächst UNerreichbar (0/36), weil
>   `fraktionsstaerke` nur über ~6 `political_*`-Aktionen treibbar ist. Zwei design-sinnvolle Kopplungen in
>   `SocietyDynamics`: aggressive Aktionen mobilisieren die radikale Fraktion + gespaltene/verdrossene
>   Gesellschaft driftet zu ihr. Danach: gewinnbar UND verlierbar (greedy ~50 %, random/low_risk 0 %).
> - **Tests geflippt:** `DecisionBeatApply` (R2 → Kopplung), `Auftraege` (Default keil → wahl). Gate um
>   Pro-Achsen-Diagnose erweitert; Win-Floor auf 4 (Luft für Sim-Drift), TARGET_BANDS für Etappe 2/3.
> - **Carry-forward:** Enden-Beschnitt + `AuftragSelect`-UI-Entfernung → Etappe 5; `WIN_THRESHOLD` 0.5→1.0
>   mit Aktions-Kuratierung. Nächster Schritt: **Etappe 2 „Die Uhr"** (`CAMPAIGN_DAYS`/Wahltag, Zielbild §13).

**Stand:** 2026-07-04 (ETAPPE 0 „Leitplanke" ✅) · Branch `claude/gracious-keller-g43bu3`, PR #89 · Gate grün (`tsc 0` · `vitest 482` · `build`).
> - **Sim-Gate gebaut:** `src/story-mode/tests/winnable-and-losable.test.ts` — das erste harte
>   „gewinnbar UND verlierbar"-Gate des Projekts (bis heute gab es KEINES; nur loggende Sims). 36
>   deterministische Partien (seed-PRNG statt `Math.random`), prüft die über Reset-/Reihenfolge-Varianten
>   stabile Aggregat-Invariante (Siege 15–18, Niederlagen 18–21; Floor 6/6). Pro-Strategie-Bänder als
>   `TARGET_BANDS` dokumentiert (Etappe 1–5 scharfzuschalten).
> - **Wichtiger Befund (für Etappe 2):** Der Legacy-Singleton-Graph lässt sich NICHT billig vollständig
>   isolieren — je nach Reset-Set kippt die Feinverteilung stark (voller Loader-Reset: greedy 0/12,
>   low_risk 12/0). Die früher „ausgewogen" wirkenden Zahlen waren teils State-Leak-Artefakt; das alte
>   Modell hat sauber gemessen triviale Strategien. Der Sim wird in Etappe 2 mit sauberer Isolation neu
>   aufgesetzt; bis dahin trägt das Gate nur die robuste Aggregat-Invariante.
> - **Nebenbefunde gefixt:** (1) doppelte Verrats-Verarbeitung entfernt (`useStoryGameState.ts`: kein
>   zweites `betrayalSystem.processAction` mehr — Adapter ist einzige Wahrheit; Warnungen aus
>   `result.betrayalWarnings`). (2) Folgenlose Krisen-Auflösung behoben: Hook ruft jetzt
>   `engine.resolveCrisis()` (wendet Effekte an) statt nur zu loggen. (3) Kaputte Krisen-Clamp-Mathe
>   in `applyCrisisEffects` korrigiert (alter `Math.min(target, current+…)` snappte `obj_destabilize`
>   von 100 auf 40 = Insta-Complete → jetzt bounded).
> - **Nicht-Befunde (verifiziert):** Endspiel-Schwellen (85 vs. 90/95) sind bereits defensiv versöhnt
>   (`assembledEndingForBranch`, Guard erzwingt Branch-Kategorie) → kein Live-Bug, Doku-Note für Etappe 1.
>   Die „veraltete Datenkopie `docs/story-mode/data/`" EXISTIERT NICHT (nur `schema/` + `playtests/`,
>   beide referenziert) → nichts zu entfernen.

**Stand:** 2026-06-20 (Kuratieren-Paket) · **S0 + alle 3 Auftrags-Scheiben gebaut** (Branch `claude/gracious-keller-g43bu3`, PR #89). Owner-Go: kuratieren + Jahres-Gate kappen + alle Scheiben parallel auf ein Qualitätsniveau. Maßstab: **`QUALITAETSMERKMALE.md`** (8 Merkmale M1–M8 = Abnahme-Gate).
> - **S0 (Fundament, balance-neutral):** Terminal-Jahres-Gate gekappt (kein `ta0{year}`-Filter mehr); Episoden-Strang-Aktionen hervorgehoben (`● STRANG`) + zuerst sortiert (M2); Gesellschaftswert-Wirkung als Vorschau auf der Planungskarte (M1, `previewSocietyDeltas`); interne Aktions-ID von der Karte entfernt (M4). Test `ActionImpactPreview` (+4).
> - **3 Scheiben (Text/Kuration, balance-neutral; parallel von 3 Autoren-Agenten entworfen, zentral integriert + synchronisiert):** **Keil** (7 Aktionen Voice-Lift), **Zweifel** (12 Aktionen + 3 Episoden auf 2 nicht-dominierte Wege gekürzt), **Wahl** (unterversorgt: 1→4 Episoden, +3 neue Wahl-Episoden mit realer Methode als `lernmoment_id`; 5 Aktionen Voice-Lift). Episoden gesamt **13** (war 10).
> - **Offen / Follow-up (geflaggt, NICHT in diesem Text-Pass):** **Balance-Pass** für 2 Text↔Mechanik-Lücken — (a) `ep_denkmalstreit`-Aktionen (11.16/17/18 = `memory_conflict`) treiben `diskursqualitaet` nicht, das aber die Keil-Signatur misst; (b) `7.2 social_division` mechanisch schwach (als „breiter" Weg evtl. dominiert). Beide brauchen `BalanceInvariant`+Sim. Optional: Zweifel-Episode `ep_echtes_video` („Lügner-Dividende"/`synthetic_media`) vom Agenten vorgeschlagen.
> - Gate je Scheibe grün (`tsc 0`·`vitest 477`·`build`).

**Stand:** 2026-06-20 (Review) · **Review Episoden & Aktionen** — `REVIEW_2026-06-20_EPISODEN_AKTIONEN.md` (Branch `claude/gracious-keller-g43bu3`). Benennt das Owner-„Bauchgefühl" in drei messbaren Befunden: (A) zwei Inhalts-Klassen (Episoden/`9.x`/`11.x` gut, `1.x`–`8.x` Lehrbuch-Ton), (B) **Terminal-Jahres-Gate** (`ta0{year}`, `StoryModeGame.tsx:929` × `ActionPanel.tsx:449`, `PHASES_PER_YEAR=12`) → im 1. Jahr nur klinische Analyse-Aktionen, die guten Phänomen-Aktionen erst Jahr 4–8 → „falsche Zeit" + IA-Bruch zur Tafel (zwei Inventare); harter Beleg: `ep_bruecke` (always) braucht nur „Jahr-7"-Aktionen, (C) Redundanz (143 → ~70–80 Familien). **Leitsatz-Empfehlung:** Aktionen = Vokabular der Episoden/Beats (kuratieren), Jahres-Gate kappen, vertikale „Keil"-Scheibe als Konzept-Probe. **4 Owner-Entscheidungen offen** (Review §7). Gate grün (`tsc 0`·`vitest 473`·`build`).

**Stand:** 2026-06-20 · **PR #87 (gemergt, `main` @ `b7a4ea6`)** — **Spine/Beats: Director-Pool · Entscheidungs-Beats (6/6) · Narrativ-Gedächtnis**. Setzt die Spine-Arbeit aus `HANDOFF_2026-06-18.md` (PR #86: Slice 1/2 + T1/T2/T3) fort. Owner-Entscheidung dieser Session: `DECISIONS_2026-06-20_BEATS.md`.

> 🤝 **Neueste Übergabe für die nächste Session:** `HANDOFF_2026-06-20.md` (Stand, Pacing, Next-Steps).
> 🗺️ **Voll-Plan / Roadmap:** `GESAMTPLAN_2026-06-20.md` (konsolidiert TODO + Spine/Beats + Owner-Entscheidungen).
> 📦 **Gebaut, aber noch nicht auf main:** **PR #85** (Asset-Pakete: Avatar m/w, Operationszentrale, Skylines, sitzende Audience) — konfliktfrei mergebar, Owner-Preview offen. Sound (J34–36) **ist** auf main.

### 🎚️ Phase B — Pacing „spürbar härter" (Session 2026-06-20, PR #89, Branch `claude/gracious-keller-g43bu3`)
Owner-Entscheidung: **„Spürbar härter (mehr Nervenkitzel)"** → späte mechanische Eskalation, gegen die auch passives Spiel auffliegen kann. Umgesetzt in `StoryEngineAdapter` (P2-17):
- **Garantierte erste Gegenwehr-Welle (Phase 6):** einmaliger Aufmerksamkeits-/Risiko-Stups + News „Erste Gegenwehr formiert sich" — Früh-Druck + Lehrmoment, dass Untätigkeit nicht ewig folgenlos bleibt.
- **Späte Eskalation (`oppositionPressure`):** mit der Phase wachsender Gegendruck nach 3,5-Jahre-Schonzeit; überwiegt spät den passiven Abbau → Dauer-Vorsicht/Leerlauf wird gefährlich. **Nur Risiko/Aufmerksamkeit, NIE die Sieg-Achse** (R2; `BalanceInvariant` grün).
- **Balance-Sim-Beleg (36 Partien):** Das „Zeit abgelaufen"-Fizzle **entfällt komplett**; vorsichtiges/zufälliges Spiel (vorher max. Risiko ~3, nie enttarnt) **kann jetzt enttarnt werden** (max. Risiko ~85–100). Gewinn- UND verlierbar bleibt (16 Sieg / 20 Niederlage). Regressionstest `Pacing.test.ts` (3) pinnt die Eckpunkte.
- **Gate:** `tsc 0` · `vitest 473` · `build` grün. Owner-Sichtprüfung am Deploy-Preview empfohlen (fühlt sich der Spät-Druck stimmig an?).

### 🎬 Story-Director-Spine (PR #87) — alle Schichten + Beat-Katalog (Gate je Commit: `tsc 0`·`vitest 456`·`build`)
Bau-Plan `BAUPLAN_STORY_DIRECTOR_SPINE.md`, Baukasten `BEAT_MUSTER_KATALOG.md`.
- **✅ Slice 3 — gewichteter Beat-Pool:** `StoryDirector.pickNext()` zieht gewichtet aus einem Pool
  (Krise = harte Vorfahrt; Dämpfer same-type/same-source) statt immer den Top-Beat; `rng = Math.random`
  injizierbar (Kern testbar). Kur gegen „Tag 3,4,5 immer dasselbe".
- **✅ Slice 4 — Entscheidungs-Beats als Inhalt:** `engine/DecisionBeats.ts` — **kein neues System**,
  jede Option mappt auf bestehende Achsen (Gesellschaftswerte + Spieler-Kosten). `bestForContext` ist der
  gemeinsame Kern für Empfehlung UND Gate (dispatcht je Relativitäts-Achse); `evaluateBeatGate` prüft
  **Deckung + kein Universalsieger**. `StoryEngineAdapter.applyDecisionBeatOption` ist **balance-neutral
  auf `obj_destabilize`** (R2, per Invariant-Test über alle Beats × Optionen). Präsentation:
  `DecisionBeatModal` nach dem Morgenbriefing via `directorStore.pendingDecisionBeatId`.
- **✅ Schicht 3 — Narrativ-Gedächtnis:** `engine/NarrativeMemory.ts` (Themen/Inokulation, verfällt mit
  der Zeit; Save/Load). First-Class-Input für reaktive Beats.
- **✅ Beat-Katalog vollständig (6/6):** Stadtrat · Reale Vorlage · Schwelbrand (auftrags-relativ) ·
  Loyalitätsprobe · Nebel (operative Lage; Nebel **stochastisch**) · Bumerang (Spielgeschichte; reaktiv:
  Inokulation/Streisand). Alle drei Relativitäts-Achsen abgedeckt.
- **✅ Live-Berater-Hinweis:** `recommendForState` → „★ BERATER RÄT"-Badge im Modal (strategie-/lage-/
  geschichte-relativ). **✅ `startGame` ruft `directorStore.reset()`** (Slice-2-Restpunkt).
- **Verifikation:** Runtime-Auslöser deterministisch getestet (`DecisionBeatFlow.test.tsx`: echter
  `endPhase` → `pendingDecisionBeatId`), Modal-Rendern (`DecisionBeatModal.test.tsx`, RTL),
  Store-Naht (`directorStore.test.ts`). Owner-Sichtprüfung am `deploy-preview-87` empfohlen.
- **Owner-Entscheidung:** Beats bewegen **nur andere Achsen, nicht die Sieg-Achse** (`DECISIONS_2026-06-20_BEATS.md`).

> ⚠️ **Container-Hinweis (Toolchain-Drift):** Im frischen Web-Container fehlten die `node_modules`
> bzw. lag TS 6.0.2 statt der gepinnten 5.9.3 vor → vor dem Gate `npm ci` in `desinformation-network/`
> (Lockfile = TS 5.9.3). Kandidat für den SessionStart-Hook.

---

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
