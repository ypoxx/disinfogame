# Holistisches Review — Juni/Juli 2026

> **Datum:** 2026-07-10 · **Umfang:** ~230 Commits / ~65.000 neue Zeilen seit Ende Mai
> **Methode:** 9 parallele Review-Dimensionen (Engine-Korrektheit, UI/State, Daten-Integrität,
> Doku↔Code-Drift, Testlücken, toter Code, Performance, Balance/Design, Architektur),
> anschließend adversariale Verifikation **aller** P1/P2-Befunde durch 4 unabhängige Prüfer
> (Auftrag: widerlegen, nicht bestätigen).
> **Verifikations-Endstand: 39× bestätigt · 1× teilweise · 0× widerlegt.**

---

## 0. Gesamtbild

**Die Basis ist stabil.** Typecheck sauber, Produktions-Build läuft, **637 Tests in 81 Dateien grün**,
das Sim-Gate (72 deterministische Partien) besteht 7/7. Die Import-Hygiene im aktiv umgebauten
`story-mode/`-Kern ist bemerkenswert gut, das Asset-Manifest ist 1:1 synchron mit der Platte,
es gibt keine ID-Duplikate über 143 Aktionen und 431 Dialoge.

**Aber:** Das schnelle Wachstum hat fünf strukturelle Problemzonen hinterlassen, die sich
gegenseitig verstärken:

| # | Problemzone | Kern |
|---|---|---|
| 1 | **Konsequenzen-System faktisch tot** | 21/24 Konsequenzen können nie feuern (NaN-Bug + tote Trigger) → Enttarnungsdruck fehlt → Random-Spielweise gewinnt 100 % |
| 2 | **204 MB Erststart** | Preloader lädt alle 229 unoptimierten True-Color-PNGs eager; ~85–90 % Einsparung wäre verlustfrei möglich |
| 3 | **Neustart/Speichern leckt** | Tagesuhr, ~9 React-Slices, DialogLoader-Gedächtnis und der Save-Umfang verlieren oder vererben Zustand zwischen Partien |
| 4 | **Kein Sicherheitsnetz** | Keine CI — alle Gates laufen nur bei manueller Disziplin; die Asset-Pipeline-Tests sind bereits unbemerkt rot |
| 5 | **Einstiegs-Doku führt in die Irre** | 4 Dokumente beanspruchen konkurrierende „kanonische Wahrheit"; START_HERE ist 5 Wochen und 3 Umbrüche alt |

Dazu ein struktureller Befund, der alles andere teurer macht: **`StoryEngineAdapter.ts` ist mit
7.574 Zeilen (14,5 % des Quellcodes) der eigentliche Spielkern** — in der Datei, die „Brücke" heißen sollte.

---

## 1. P1 — Kaputt mit Spielerwirkung (alle adversarial bestätigt)

### H-01 · Konsequenzen-System zu ~87 % tot (NaN + tote Trigger)
**Dateien:** `desinformation-network/src/story-mode/engine/ConsequenceSystem.ts:205/213`, `data/consequences.json`
Zwei unabhängig gefundene, unabhängig verifizierte Ursachen:
- **NaN-Bug:** `per_use_increase` fehlt bei **21 von 24** Einträgen und wird ohne Default gelesen →
  `probability = NaN` → `roll < NaN` ist immer false. Der frühere P0-1-Fix sicherte nur `max` ab.
  Live-Beleg aus dem Sim-Log: `Rolling for "Unerwarteter Verbündeter": 0.600 < NaN = miss`.
- **Tote Trigger:** 7 Konsequenzen (u. a. `cons_investigation`, `cons_exposure_imminent`,
  `cons_whistleblower`, `cons_sanctions`, `cons_fact_check_surge`) haben in `triggered_by` nur
  Consequence-IDs oder Pseudo-Keywords (`budget_stress`), die der Loader ausschließlich als
  Aktions-IDs indexiert. `can_trigger` liest kein Code; `effects_if_ignored.chain_trigger`
  (der einzige implementierte Ketten-Mechanismus) kommt in den Daten 0-mal vor.

**Wirkung:** Die gesamte Enttarnungs-Eskalation (Ermittlung → Enttarnung droht → Sanktionen →
Whistleblower → Faktencheck-Welle) existiert für den Spieler nicht. Das erklärt die
Sim-Ergebnisse direkt (siehe H-13): Enttarnung nur 4/72, Random gewinnt 24/24.
**Fix:** `const increasePerUse = def.probability.per_use_increase ?? 0;` (eine Zeile) +
Konsequenz-auf-Konsequenz-Trigger implementieren oder Daten auf `chain_trigger` umstellen +
Regressionstest „jede Konsequenz hat endliche Wahrscheinlichkeit". Danach Sim-Gate neu kalibrieren.

### H-02 · Erststart lädt ~204 MB — Preloader × unoptimierte PNGs
**Dateien:** `src/story-mode/assets/preloadAssets.ts:147`, `StoryModeGame.tsx:541`, `public/assets/images/`, `netlify.toml:42–57`
Nachgemessen und bestätigt:
- Preloader (#97) lädt **alle** 229 image+sheet-Assets: 90 Dateien/71,6 MiB sofort (`fetchPriority=high`),
  139 Dateien/123,1 MiB spätestens 2,5 s später. Kein saveData-/Verbindungs-Gate, keine Byte-Obergrenze.
- Die 207 PNGs sind **ausnahmslos True-Color** (Ø ~960 kB, 118 Stück > 1 MB) — für Pixel-Art die
  teuerste Auslieferungsform. PIL-Stichprobe: Palettenquantisierung → **10–14 % der Originalgröße**.
- Cache-Verstärker: `max-age=0, must-revalidate` auf allen Asset-Pfaden → **jeder** Wiederbesuch
  feuert 229 Revalidierungs-Requests; `assets.json` (337 kB, davon ~90 % KI-Generierungs-Prompts)
  wird mit `no-store` bei jedem Start voll geladen und blockiert die Registry-Initialisierung.

**Wirkung:** Bei 16 Mbit/s ≈ 98 s Dauerlast beim Erststart; auf Mobilfunk sprengt es jedes Datenbudget.
**Fix-Reihenfolge:** (1) pngquant/oxipng über `public/assets/images` (−85–90 %, verlustfrei fürs Auge),
(2) Preload kontextabhängig (nur Titel/Lobby/erste Räume eager) + Byte-Deckel + `saveData`-Gate,
(3) Assets versionieren (styleVersion steht schon im Manifest) → wieder `immutable`,
(4) Client-Manifest ohne Prompts emittieren (~30 kB statt 337 kB).

### H-03 · Neustart-Lecks: Tagesuhr + 9 vergessene React-Slices + DialogLoader-Doppelinstanz
**Dateien:** `useStoryGameState.ts:1680`, `StoryModeGame.tsx:482–487/1388`, `DialogLoader.ts:1336`, `StoryEngineAdapter.ts:880`
Drei unabhängig gefundene, sich stapelnde Lecks beim „Neue Partie"-Pfad (Engine-Seite via
`createStoryEngine()` ist dagegen sauber):
- **Tagesuhr:** `resetDay()` wird nur im Tagesfazit aufgerufen. Endet eine Partie mitten am Tag,
  startet die nächste mit alter Uhrzeit; stand `dayEnded=true`, feuert der Auto-Heimweg-Effekt
  sofort — **Tag 1 der neuen Partie endet ungespielt**.
- **React-Slices:** `resetGame()` vergisst `completedActions` (wird im ganzen Code nie geleert!),
  `actionQueue`, `activeCrisis`, `activeStageCountermeasure`, `betrayalStates`, `comboHints`,
  `carrierStates`, `acquiredKompromat`, `recommendationTracking`. Folgen: Krisen-Modal der
  Vorpartie liegt über der neuen Partie (und ist nicht auflösbar, weil die neue Engine die alte
  crisisId nicht kennt — nur „ignorieren" räumt es weg); der Episoden-Abschluss-Effekt matcht
  neue Episoden gegen **alte** completedActions und schließt ungespielte Stränge ab.
- **DialogLoader:** Zwei Instanzen gleichzeitig aktiv (Modul-Singleton + Adapter-Instanz),
  gemischt benutzt; `resetState()` wird im Spielcode nie aufgerufen → `emotionalMemory`
  (NPC-Erinnerungs-Tags) **überlebt Partien** innerhalb einer Browser-Session.

**Fix:** `useDayClockStore.getState().resetDay()` in `resetGame()`/`loadGame()`; alle Slices in
`resetGame()` explizit nullen; eine DialogLoader-Quelle wählen und in den `createStoryEngine`-Reset
aufnehmen. Plus Isolationstest: Partie spielen → Neustart → Zustand feldweise gegen frische Engine diffen.

### H-04 · Keine CI — und die Asset-Pipeline-Tests sind bereits still verrottet
**Dateien:** (fehlend: `.github/workflows/`), `netlify.toml:2`, `tools/asset-pipeline/test/`
Kein Workflow, keine Git-Hooks, Netlify baut ohne Tests. Die Pflicht „vor jedem Push: build +
tsc + vitest" existiert nur als Prosa in CLAUDE.md. **Konkreter Schaden schon eingetreten:**
Die Asset-Pipeline-Suite ist rot — frisch ausgecheckt 3/11 Fehler (`sharp` fehlt), nach
`npm install` verbleiben **2 echte Assertion-Fehler** (`shotlist.test.mjs:35` Formatregel,
`:99` „Brutalismus fehlt in prop_server_rack").
**Wirkung:** Eine Balance-Änderung, die das Spiel unverlierbar macht, würde das (vorbildliche)
Sim-Gate rot färben — aber niemand erzwingt dessen Lauf; der Bug ginge live.
**Fix:** GitHub-Actions-Workflow: `npm ci && npm run typecheck && npx vitest run` (Sim-Gate als
benannter Step) + zweiter Job für die Asset-Pipeline; die 2 roten Pipeline-Tests fixen.

### H-05 · Einstiegs-Doku: vier konkurrierende „Wahrheiten", tote Regeln
**Dateien:** `START_HERE.md`, `docs/VISION_LOCK.md`, `docs/SESSION_KICKOFF.md`, `ROADMAP.md`, `CLAUDE_INSTRUCTIONS.md`
- **START_HERE.md** (Stand 2026-05-31): „88 Tests" (real 637), nicht existenter Start-Knopf,
  empfiehlt als nächsten Schritt den längst gebauten Gebäude-Querschnitt, erwähnt weder
  ZIELBILD noch STATUS noch SOUL. Der empfohlene Test-Befehl überspringt zudem die Sim-Gates.
- **Kanonizitäts-Konflikt:** START_HERE + CLAUDE_INSTRUCTIONS erklären VISION_LOCK zur
  „verbindlichen Wahrheit"; STATUS definiert die Kette SOUL → DECISIONS_2026-07-04 → ZIELBILD.
  VISION_LOCK behauptet, Roster/Zähl-Fakten gälten „unverändert" — real: **143** Aktionen statt
  „kanonisch 110", NPC heißt seit Etappe 5 **Kurator** (nicht Direktor) Volkov.
- **SESSION_KICKOFF** („bleibt gültig") schreibt als eiserne Regel einen **Branch vor, der nicht
  existiert** (`claude/gracious-keller-g43bu3`); **ROADMAP** („Status: Aktiv") empfiehlt seit
  3 Wochen erledigte P2-Arbeit und kennt das Wettrennen nicht; **CLAUDE_INSTRUCTIONS** nennt als
  Priorität TVTower/Pipeline statt der bindenden Broadcast-Entscheidung; **STATUS** verletzt den
  eigenen Kontrakt (drei Merges vom 07-07 — #97/#98/#103 — fehlen im Kopf).

**Wirkung:** Genau in einem Projekt, das von wechselnden Agenten-Sessions gebaut wird, ist die
Einstiegs-Doku der Multiplikator — jede Fehlorientierung wird zu falscher Arbeit.
**Fix (klein):** EINE Hierarchie festschreiben (Vorschlag: DECISIONS+ZIELBILD > STATUS >
VISION_LOCK nur noch Roster/Stil/Lore), START_HERE auf 3 Zeilen Verweis eindampfen,
SESSION_KICKOFF-Branchregel durch „je Session neuer Branch von main" ersetzen,
ROADMAP mit Superseded-Kopf versehen, STATUS-Kopf nachziehen (#97/#98/#103).

### H-06 · StoryEngineAdapter: 7.574-Zeilen-Gott-Datei ist der eigentliche Spielkern
**Datei:** `desinformation-network/src/game-logic/StoryEngineAdapter.ts`
Exakt nachgemessen: 7.574 Zeilen (nächstgrößte Datei: 1.825), 35 Import-Blöcke, importiert
rückwärts aus `story-mode/engine` (24 Module), `audience/`, `battlefield/` und sogar
`SoundSystem` (9 `playSound`-Aufrufe im Engine-Kern). Die Schichtung ist invertiert: die
„Brücke" ist das Zentrum. Dazu 9 zirkuläre Importe (madge; alle type-only, also Architektur-,
kein Laufzeitrisiko) und drei Generationen von Singleton-Zustandshaltung nebeneinander
(Etappe-2-Muster mit 8/9 Resets; eager Exports, davon `countermeasureSystem` toter Export;
`adapter.reset()` als zweiter, abweichender, unvollständiger Reset-Pfad).
**Wirkung:** Jede Etappen-Session hat hier angebaut; ~11.100 Zeilen (Adapter + useStoryGameState
+ StoryModeGame) liegen auf dem kritischen Pfad jeder Änderung. Merge-Konflikte und Regressionen
konzentrieren sich in einer Datei.
**Fix (schrittweise, kein Big Bang):** Shared-Typen (`SocietyValueKey`, `StoryResources`,
`NPCState`, `NewsEvent`) in ein `engine/types.ts` ziehen (löst 5 der 9 Zyklen sofort), dann
entlang der vorhandenen Sektionen (Finanzen, WorldEvents, Episoden, News) Module herausschneiden;
`madge --circular` als CI-Check festschreiben; Reset-Muster vereinheitlichen mit
„jede exportierte resetX wird von createStoryEngine aufgerufen"-Test.

---

## 2. P2 — Echte Probleme (adversarial bestätigt)

### Engine & Zustand
- **H-07 · Krisen würfeln doppelt pro Nacht** — `advancePhase` (Adapter) und `endPhase` (Hook)
  rufen dasselbe `CrisisMomentSystem` für dieselbe Phase → Zufalls-Krisen-Rate ~verdoppelt
  (p→~2p) gegenüber der Autorierung; nur der Hook-Wurf setzt das Modal, nur der Adapter-Wurf
  die News → inkonsistente Anzeige. Nur EINE Stelle darf würfeln.
  (`StoryEngineAdapter.ts:1201`, `useStoryGameState.ts:912`)
- **H-08 · saveState() vergisst Operations-Ökonomie und Verrat** — weder `carrierStates`/
  `acquiredKompromat`/`operationsPlayed` noch `betrayalSystem.exportState()` (existiert
  ungenutzt!) werden persistiert. Nach Reload+„Weiter": verbrannte Verbreiter wieder nutzbar
  (**Un-Burn-Exploit**), Kompromat weg, Verrats-Warnstufen auf Null — ein übergelaufener NPC
  kann ein zweites Mal auspacken. (`StoryEngineAdapter.ts:6723`, `BetrayalSystem.ts:788`)
- **H-09 · loadGame() synchronisiert den Hook nicht** — `completedActions`/`comboHints` bleiben
  leer/stale → Korkbrett-Fortschritt fällt auf 0, vor dem Speichern gespielte Einklink-Aktionen
  können Episoden nie mehr abschließen, End-Report-Bilanz falsch. (`useStoryGameState.ts:1626`)
- **H-10 · End-Erzählung aus Mock-Zustand** *(teilweise bestätigt)* — `assembledEndingForBranch`
  erzwingt für jede Niederlage Kategorie `exposure`; die veralteten Gates in `shouldGameEnd`
  (risk≥95, 120 Phasen) lassen den „reichen" Pfad bei Timeout-/Immun-Enden praktisch nie greifen
  → Fallback baut das End-Narrativ aus einem **hartkodierten Mock** (risk 95, illegal 20):
  stiller Timeout-Verlust bekommt Verhaftungs-Prosa, sauberer Sieg „Grenzen überschritten".
  Präzisierung der Prüfer: betrifft nur das End-Report-Narrativ (Titel/Wahlabend sind korrekt);
  Countdown-Enttarnungen und übererfüllte Siege liefern den echten Zustand.
  (`StoryEngineAdapter.ts:6556/6563`, `EndingSystem.ts:819–898`)
- **H-11 · Esc-Doppelwirkung in drei Views** — OperationsAkte, Newsroom, Fokusgruppe registrieren
  Esc ohne capture/stopImmediatePropagation → Esc schließt das Overlay UND öffnet das Pausenmenü.
  Exakt dieser Bug wurde für das Terminal schon gefixt (Muster liegt vor: `TerminalView.tsx:157–178`),
  die drei Views wurden nicht nachgezogen. (`OperationsAkteView.tsx:302`, `NewsroomView.tsx:455`, `FokusgruppeView.tsx:410`)
- **H-12 · Crossfade verwaist Musik-Tracks** — `stopMusic()`/zweiter Crossfade während der
  700-ms-Blende pausiert nur den neuen Track; der alte (loop=true) spielt **trotz Sound=AUS**
  endlos weiter bis zum Reload. (`SoundSystem.ts:378–397/417–429`)

### Balance & Design (Sim-Gate selbst ausgeführt, Zahlen reproduziert)
- **H-13 · Balance an den Rändern degeneriert** — Sim-Lauf 2026-07-10: greedy 14/24 Siege,
  **random 24/24 (100 %)**, **low_risk 0/24 (0 %)**, Timeout-Verlustweg **0/72**. Das
  Zielbild-Band („Random <10 %, kein Profil bei 0/100 %, jeder Verlustweg ≥15 %") ist verletzt;
  die scharfgeschalteten TARGET_BANDS prüfen random gar nicht. Einordnung der Prüfer: teilweise
  dokumentierte Absicht („Spaß zuerst", Etappe 4), aber der Widerspruch zum kanonischen Zielbild
  ist nirgends aufgelöst — und H-01 ist ein Haupttreiber (kein Enttarnungsdruck).
  „Wahlabend verloren" samt E18-Würgeschlingen-Dramaturgie ist de facto toter Content.
- **H-14 · Sofort-Sieg mitten in der Kampagne** — `evaluateEnd` gibt `victory` sofort bei
  Schwellen-Erreichen (WIN_THRESHOLD 0.6) zurück; Sim: Siege enden Median **Tag 14–16 von 40**.
  Das Zielbild formuliert den Sieg „AM Wahltag" und begründet damit den Wegfall der Halte-Regel —
  diese Begründung ist ausgehebelt: die 40-Tage-Dramaturgie (Tranchen, Sonntagsfragen, Wahlabend-
  Countdown, Episoden ab Tag ~16) findet in Siegen nicht statt. Owner-Entscheidung nötig:
  Sieg-Check an den Wahltag binden ODER First-past-the-post kanonisieren und Zielbild nachführen.
  (`VictorySystem.ts:64–85`)
- **H-15 · Kampagnen-Content hinter unerreichbaren Phasen-Schwellen** — `getBriefing` schaltet
  mid_game ab Phase 48, late_game ab 96 — die Kampagne endet Tag 40. Marinas Briefing-Key
  `analysis_ready` wird nie nachgeschlagen; `topic_mission_intro_3` [60,120] und
  `debate_strategy_1` [50,100] liegen auf **live verdrahteten** Pfaden und sind unerreichbar.
  (Der Briefing-Pfad selbst hat aktuell keinen UI-Aufrufer — doppelt verwaist.)
  (`DialogLoader.ts:394`, `dialogues.json:603`)

### Daten & Werkzeuge
- **H-16 · IdValidator validiert einen Bruchteil seines Versprechens** — geprüft werden nur
  Aktions-/Episoden-Duplikate + prerequisites/unlocks/npc_affinity + Episoden-Refs. NICHT:
  consequences.triggered_by (hätte H-01b gefunden), countermeasures, dialogues.leads_to,
  world-events.actions_unlocked (hätte H-17 gefunden), personas.segmentId. Er läuft nur als Log
  (bricht nie ab), und der grüne Test „reale Spieldaten sauber" erzeugt falsche Sicherheit.
  (`IdValidator.ts:62–142`)
- **H-17 · Wahl-Ankündigungs-Event verspricht tote Freischaltung** — `election_announced`
  (garantiert, Phase 12) trägt `actions_unlocked:['ta06_election_interference']`: die ID existiert
  nicht, UND `applyWorldEventEffects` liest das Feld überhaupt nicht. (`world-events.json:31`)
- **H-18 · Testlücken auf den neuen Kernpfaden** — ungetestet sind: die komplette
  BetrayalSystem-Trigger-Kette (rote Linien → Warnstufen → Event), der reguläre
  CountermeasureSystem-Pfad (nur die 3 Stufen-Maßnahmen sind abgedeckt), die
  applyTranche-Verdrahtung (Auszahlung/Mahnstufen-Persistenz/Save-Migration — nur die puren
  Formeln sind getestet) und die exakte Tag-40-Grenze (kein Test fährt eine Engine real bis zum
  Wahltag; empirisch erreicht auch keine Sim-Partie Tag 40).

---

## 3. P3/P4 — Qualität, Wartbarkeit, Politur (Auswahl, aus den Dimension-Reviews)

**Zustand/Architektur**
- Doppelte Zustandsführung UI↔Engine: 31 gespiegelte useState-Slices + 22 direkte
  `engine.getX()`-Aufrufe im Render von StoryModeGame — zwei Wahrheitsquellen (`useStoryGameState.ts`).
- `useStoryGameState.ts` (1.825 Z.) und `StoryModeGame.tsx` (1.729 Z.) sind Gott-Dateien;
  die vier begonnenen Zustand-Stores (zusammen 294 Z.) zeigen die nicht durchgezogene zweite
  State-Generation. Weitere >800-Z.-Dateien: EndReport, DialogLoader, BuildingStage, EndingSystem,
  ActionFeedbackDialog, BetrayalSystem, NewsroomView.
- Engine importiert aus hooks/ (`AdvisorRecommendation.ts:10`), UI importiert Engine-Interna aus
  18 Dateien direkt — keine API-Grenze (ESLint `no-restricted-imports` empfohlen).
- Drei RNG-Generationen; 14 Engine-Module würfeln mit `Math.random` → Seed-Determinismus nur
  scheinbar; `globalRandom` wird bei `createStoryEngine(seed)` nicht zurückgesetzt → Krisen/
  Verteidiger-AI trotz Seed nicht reproduzierbar (betrifft Balancing-Messbarkeit).
- `BuildingStage` (1.078 Z., nicht memoisiert) re-rendert 60×/s bei jeder Avatar-Bewegung —
  die Lösung existiert im selben File bereits als Muster (`AmbientLifeLayer`).
- Rules-of-Hooks-Verstoß: `useState` nach bedingtem early return in `ActionFeedbackDialog.tsx:32` —
  funktioniert heute nur zufällig, crasht bei der nächsten Hook-Ergänzung.

**Engine-Detail**
- `applyTranche` klemmt Budget nicht auf 0 → bis ~−84 möglich, Comeback stiller verschärft
  (`StoryEngineAdapter.ts:4731`; einzige ungeklemmte Budget-Schreibstelle).
- Countermeasure-Zufallspfad: konstanter Würfelwert pro Phase + nie Re-Trigger nach resolve —
  latent (kein Live-Aufrufer), aber eine geladene Falle (dasselbe Muster wurde bei den
  Konsequenzen schon einmal als „P0-2" gefixt).
- EndingSystem: 6 von 8 Kategorien (~30 Textbausteine) im Live-Pfad unerreichbar; tote Alt-Gates
  (120 Phasen/risk 95). Zielbild-versprochene Epilog-Färbungen („Flucht nach Osten",
  „Gewissensentscheidung") erscheinen nie.
- Zielbild-Features ohne Verdrahtung: Milieu-Kippen als Sprung-Ereignis (+3–5 Punkte, §3) fehlt
  komplett; `shiftElectionDay`/`requestNachspielzeit` (§5a/b) sind tote API ohne Trigger;
  Halte-Regel-Relikt `REQUIRED_HOLD_PHASES` mit falschem Kommentar.
- Wahlabend-Klangkulisse tot verdrahtet: `sfx_amb_tvstudio` existiert samt Mapping, aber das
  Overlay `'wahlabend'` wird nie gesetzt → dramaturgischer Höhepunkt läuft in Ambience-Stille.

**Toter Code / Altlasten** (~2.700 Zeilen, fast alles Pro-Mode-Reste)
- `src/utils/network/` + `src/utils/rendering/` (~1.760 Z.) komplett unimportiert;
  `utils/index.ts` zu ~95 % tot; `balance-config.ts` (Pro-Mode-Balance) als falsche
  „Config-Quelle" neben der echten; 3 tote Barrel-index.ts; `themeText.ts` verwaist;
  Pro-Mode-JSONs in `src/data/game/` zwischen lebenden Dateien.
- `vqa.html` + `?vqa=1`-Hook (window.__VQA__ mit Engine-Fernsteuerung) im Prod-Deploy;
  Sourcemaps (2,9 MB) öffentlich; `office-brutalist-scene.jpg` (1,35 MB) unreferenziert.
- Irreführende Fossil-TODOs: „TODO: Implement action execution" über dem voll implementierten
  Haupt-Ausführungspfad (`StoryEngineAdapter.ts:3731`) — Einladung zur Doppel-Implementierung.
- 6 veraltete Planungs-Dokumente der Pro-Mode-Ära im Projekt-Root (Stand Januar).

**Daten-Detail**
- personas.json: alle 30 segmentIds ohne `wu_`-Präfix → kein Join zu audience.json möglich
  (heute folgenlos, latente Falle für E16); FokusgruppeView hält einen zweiten, hartkodierten
  Persona-Satz.
- 5 „relationship_level_up"-NPC-Reaktionen + 1 „data"-Reaktion können nie triggern (Tag existiert
  nirgends); 12 von 21 Insert-Platzhaltern ungenutzt; `narrative_en` fehlt bei 78/80 Aktionen in
  actions_continued.json; tote Doku-als-Daten-Sektionen (consequence_chains mit unparsebaren
  Pseudo-IDs, event_chains, cascades_to).
- 27 JSON-Dateien (523 kB) statisch ins main-Bundle gebacken (~37 % des 1.071-kB-Chunks;
  Auslagern allein behebt die Vite-Warnung nicht, gehört aber zur Bundle-Diät).

**Tests**
- balance-sim/playtest-Sims: viele Partien, fast keine Assertions (1–6 expects) — Pseudo-Abdeckung,
  die Suite-Zeit kostet und (dokumentiert) Singleton-Leaks in Folge-Tests injiziert.
- dayClock.test.ts pinnt Implementierungs-Konstanten 1:1 (Change-Detector statt Verhalten).
- Sim-Gate hat kein npm-Skript (`"sim": "vitest run …"` fehlt) — der kanonische
  Vorher/Nachher-Einstieg für Balance-Arbeit (SOUL-Kontrakt) fehlt.
- Sprach-Mix ohne Regel (ImmuneSystem.ts liefert deutsche „Abwehr"-APIs; Glossar/Konvention fehlt).

---

## 4. Positivbefunde (explizit geprüft, nicht beanstandet)

- **Sim-Gate** `winnable-and-losable.test.ts`: 72 deterministische Partien, 7 echte Invarianten,
  ehrlich dokumentierte Grenzen — vorbildlich (es fehlt nur der CI-Anker und das npm-Skript).
- **Datenkern konsistent:** 0 ID-Duplikate (143 Aktionen, 431 Dialoge), alle prerequisites/
  unlocks/Episoden-Refs/leads_to/Countermeasure-Trigger lösen auf; Asset-Manifest 1:1 synchron
  (329 Einträge = 329 Dateien, 0 Waisen).
- **Audio-Auslieferung solide:** 9,3 MB MP3 korrekt on-demand, Preloader fasst Audio nicht an,
  SFX mit Synth-Fallback, Timer sauber aufgeräumt.
- **Import-Hygiene im Kern:** nur 1 tote Fachdatei + 3 tote Barrels unter 130+ geprüften Dateien.
- **Test-Suite überwiegend verhaltensorientiert:** 0× .skip/.todo/.only, nur 2 reine Smoke-Tests
  unter 637.

---

## 5. Empfohlene Reihenfolge

**Paket A — Sofort (Stunden, hohe Wirkung):**
1. H-01 NaN-Fix (1 Zeile) + Konsequenz-Regressionstest → danach Sim-Gate neu kalibrieren
2. H-03 Tagesuhr-Reset + resetGame-Slices (mechanisch)
3. H-04 CI-Workflow (typecheck + vitest + Sim-Gate + Asset-Pipeline) + die 2 roten Pipeline-Tests
4. H-02(1) pngquant über public/assets/images (−~180 MB ohne sichtbaren Verlust)
5. H-11 Esc-Fix (Muster aus TerminalView kopieren, 3 Views)

**Paket B — Diese Woche (Owner-Entscheidungen + Stabilisierung):**
6. H-14 Owner-Entscheid: Sieg am Wahltag vs. First-past-the-post → Zielbild nachführen
7. H-13 Balance-Bänder auflösen (random-Band ins Gate oder Abweichung kanonisieren) — nach H-01!
8. H-08/H-09 Save/Load vervollständigen (+ Migrationstest)
9. H-05 Doku-Hierarchie festschreiben; START_HERE/SESSION_KICKOFF/ROADMAP/STATUS nachziehen
10. H-07 Krisen-Doppelwurf, H-10 Mock-Ending, H-15 Phasen-Schwellen, H-12 Crossfade

**Paket C — Struktur (nächste Etappen, schrittweise):**
11. H-06 Typen-Extraktion aus dem Adapter (löst 5/9 Zyklen), dann Sektions-Schnitte;
    Reset-Registry mit Vollständigkeits-Test; madge als CI-Check
12. H-02(2–4) Preload-Kontextualisierung, Asset-Versionierung, Client-Manifest
13. H-16 IdValidator auf alle Kopplungen erweitern (Wegwerf-Skript des Reviews als Vorlage)
14. Pro-Mode-Altlasten archivieren (~2.700 Z.), VQA hinter Build-Flag, RNG vereinheitlichen

---

## 6. Methodik

13 unabhängige Agenten: 9 Befund-Dimensionen (mit programmatischen Eigen-Checks: JSON-Kreuzreferenz-
Skripte, madge-Läufe, PIL-Bildanalyse, Bundle-Vermessung, eigene vitest-/Sim-Läufe) + 4 adversariale
Verifizierer, die **jeden P1/P2-Befund** mit Widerlegungs-Auftrag am Code nachgeprüft haben
(Aufrufpfade rekonstruiert, Gegenbeweise gesucht, Zahlen nachgemessen). Nur Bestätigtes ist oben
als P1/P2 geführt; die einzige Teilbestätigung (H-10) ist als solche markiert. P3/P4-Befunde
stammen aus den Dimension-Reviews und sind dort belegt (Datei:Zeile), aber nicht einzeln
gegenverifiziert.
