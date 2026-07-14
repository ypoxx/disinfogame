# Holistisches Review — 2026-07-14 (Konsolidierung + Lagebild)

> **Datum:** 2026-07-14 · **Stand:** main `9dfbb38` · **Charakter:** Fortschreibung von
> [`REVIEW_HOLISTISCH_2026-07-10.md`](REVIEW_HOLISTISCH_2026-07-10.md) — **ersetzt dessen §5/§6
> als Arbeitsvorrat**, wiederholt nichts, was dort steht.
> **Methode:** 10 parallele Dimensionen (Alt-Befund-Verifikation, 4× Post-Merge-Tiefenprüfung
> #100/#105/#106/#107, Security/Deploy/Repo, Prozess-Meta, Integration PR #109/#110),
> anschließend adversariale Verifikation aller neuen P1/P2-Befunde durch je 2 unabhängige
> Widerleger. **Endstand: 14 neue P1/P2 bestätigt · 1 widerlegt (gute Nachricht, s. §5) · 1 Duplikat.**

---

## 0. Gesamtbild

**Das Projekt hat kein Erkenntnis-, sondern ein Durchsatzproblem.** Die Code-Basis ist
handwerklich gut (Ground Truth heute: Typecheck sauber, **727 Tests in 92 Dateien grün**,
43,9 s; die vier seit dem 07-10-Review gemergten Umbauten sind in ihrem Kern solide gebaut —
s. Positivbefunde §4). Aber:

| # | Kernbefund | Beleg |
|---|---|---|
| 1 | **Alle 18 Befunde des 07-10-Reviews sind offen** (H-06 sogar verschlechtert: Adapter 7.574 → 7.780 Zeilen) | §1 |
| 2 | **0 von 5 „Paket A"-Sofortmaßnahmen** (laut Review: Stunden Aufwand) sind 4 Tage später auf main; der 1-Zeilen-P1-Fix liegt ungemergt als Draft #109; **main ist seit 07-10 17:16 eingefroren** | §5 |
| 3 | Die einzige neue Arbeit seit dem Review ist **ein weiteres Analyse-Dokument** (PR #110, 22 Hebel + 8 neue Owner-Entscheide) — die Entscheidungs-Schlange wächst schneller als sie abgearbeitet wird | §5 |
| 4 | Das 07-10-Review ist **prozessual unsichtbar**: 0 aktive Dokumente verlinken es; der Pflicht-Lesepfad einer frischen Session (12–14 Dokumente, ~3.000 Zeilen, 3 konkurrierende Reihenfolgen) endet bei einem 8 Tage alten HANDOFF | §5 |
| 5 | Die frisch gemergten Umbauten enthalten **8 neue, adversarial bestätigte P2-Bugs** (u. a. Doppelausführung von Einmal-Aktionen über die Tafel, zwei divergierende Belief-Buchhaltungen, App-Crash bei localStorage-Fehler) | §2 |
| 6 | **Brisantester Einzelbefund:** Der Merge von #109 würde `cons_victim_suicide` mit ~20 % Trigger-Chance pro Nutzung (Aktionen 8.1/8.2/5.3) scharf schalten — ohne den von #110 §3.3 ausdrücklich geforderten Owner-Entscheid O-H. In einem Bildungsspiel ein No-Go ohne bewusste Entscheidung | N-01 |

---

## 1. Status der Alt-Befunde (je einzeln am Code verifiziert)

**H-01 … H-18: alle OFFEN.** Kurzfassung der Verifikation (Details: je Befund Datei:Zeile
im 07-10-Review, hier nur Änderungen/Präzisierungen):

| Befund | Status | Präzisierung 07-14 |
|---|---|---|
| H-01 NaN + tote Trigger | offen | Fix-PR #109 existiert, ungemergt — und deckt **nur Ursache 1** ab: nach #109 wären 17/24 Konsequenzen feuerfähig, **7 bleiben trigger-tot — darunter die komplette Enttarnungs-Eskalationskette** (cons_investigation → exposure_imminent → whistleblower → sanctions → fact_check_surge) (eigene Trigger-Auflösung gegen alle 156 Aktions-IDs) |
| H-02 204-MB-Erststart | offen | unverändert 196 MB / 208 True-Color-PNGs (0 palettiert), kein Byte-Deckel, Cache-Header unverändert; **#106 hat eine neue Instanz hinzugefügt** (ui_cork_tile.png, 487 kB, rutscht übers `ui_`-Präfix in den High-Priority-Preload) |
| H-03 Neustart-Lecks | offen | resetGame() nullt weiter keinen der 9 Slices, kein resetDay(); **+2 neue Slices derselben Klasse gefunden**: `activeBetrayalWarnings`/`activeBetrayalEvent` (Verrats-Modal der Vorpartie überlagert neue Partie) |
| H-04 keine CI | offen | kein `.github/`, Netlify baut ohne Tests; die 2 roten Asset-Pipeline-Tests unangetastet |
| H-05 Doku-Widersprüche | offen | 0/5 Fix-Schritte umgesetzt; STATUS.md wurde in #106 angefasst, verletzt aber den eigenen Kontrakt erneut (kennt #100/#105/#107/#108 nicht) |
| H-06 Gott-Adapter | **verschlechtert** | 7.780 Zeilen (+206), kein `engine/types.ts`, nichts extrahiert; useStoryGameState 1.913 Z., StoryModeGame 1.831 Z. |
| H-07…H-11 | offen | wortgleich verifiziert (Esc-Doppelwirkung H-11 trotz #107-Umbau unverändert in 3 Views; Muster liegt weiter 3× im Code vor) |
| H-12 Crossfade-Waisen | offen | **Merge-Auflage aus Review-§6 (#105: „5-Zeilen-Fix zeitnah") nicht erfüllt.** Präzisierung: Pool-Tracks loopen seit #105 nicht mehr → In-Game-Waisen verstummen nach ≤60 s; **endlos** loopen nur noch Titel-/Sieg-/Niederlagen-Musik. Dafür gibt es durch Rotation + Pflicht-Crossfades deutlich mehr 700-ms-Fenster |
| H-13…H-18 | offen | Kerndateien seit Review unangetastet (git log verifiziert); keiner der neuen Tests deckt die H-18-Lücken |
| P3-Stichproben (tote utils/, vqa.html+Sourcemaps im Prod, Math.random in 11 Engine-Modulen, ungeklemmtes Tranchen-Budget, personas-Präfix, Rules-of-Hooks in ActionFeedbackDialog, BuildingStage unmemoisiert) | alle offen | personas-Präfix-Falle ist im **neuen** E16-Code durch kurzKey-Normalisierung entschärft (maschenVortest.ts:134) — die Datenlücke selbst besteht |

---

## 2. Neue Befunde (P1/P2 — alle adversarial bestätigt, je 2 Widerleger)

### N-01 · P1 · #109-Merge schaltet `cons_victim_suicide` ungeprüft scharf
`consequences.json:401`: base 0.05, kein per_use_increase (bisher NaN-tot), reale Trigger
8.1/8.2/5.3. Nach #109: **~20 % pro Nutzung**. #110 §3.3 verlangt für genau diesen Fall den
Owner-Entscheid **O-H vor Reaktivierung** — #109 enthält weder Daten-Gate noch Hinweis.
**Fix:** Vor dem Merge O-H entscheiden ODER #109 um 1 Zeile Daten-Gate ergänzen (Eintrag
deaktivieren) und die Reaktivierung als eigenen, O-H-gebundenen Schritt führen.

### N-02 · P2 · Vorzeichen-Bug: „Erfolgs"-Weltereignisse ERHÖHEN das Institutionen-Vertrauen
`StoryEngineAdapter.ts:3160–3165`: `Math.abs(change)` auf `trust_media_change:-10` /
`trust_government_change:-15` (world-events.json:45/252, beide severity `success`, beide auf
dem Live-Pfad, p=0.12/0.10 pro Phase). Das Vertrauen **steigt**, obwohl die Schlagzeile
„erschüttert" sagt — und wirft die sieg-relevante Vertrauens-Achse (Min-Regel!) um 10–15 Punkte
zurück; zudem fehlt die 100er-Oberklemme.
**Fix:** `Math.min(100, Math.max(0, current + change))` + progress/completed nachführen.

### N-03 · P2 · Tafel-Tausch erzeugt Queue-Duplikate — und die Engine führt Einmal-Aktionen doppelt aus
Beide Anheft-Pfade pinnen ohne Dedup (`useStoryGameState.ts:730-734`/`:760-765`); Abhängen
lässt Karten hängen, Wiederaufnahme pinnt erneut. `engine.executeAction` hat **keinen
isUsed-Guard** (`StoryEngineAdapter.ts:3753-3783`): Kosten/Effekte/Risiko doppelt; reicht das
Budget nicht, leert `executeQueue` den Restplan **kommentarlos** (`:1413-1420`).
**Fix:** Dedup beim Anheften + isUsed-Ablehnung in executeAction + Hook-Test für den
Tausch-Zyklus (aktuell ungetestet).

### N-04 · P2 · Sonntagsfragen-Countdown um einen Tag verschoben — Test pinnt die falsche Semantik
`getNaechsteSonntagsfrageIn` (`StoryEngineAdapter.ts:4407-4411`) rechnet `day % 5`; emittiert
wird aber mit der **neuen** Phasennummer (Umfrage für Tag 5 erscheint am Ende von Tag 4). An
der Planungs-Grenze invertiert: am Mess-Tag „noch 1 Tag", am Folgetag kündigt sie eine Umfrage
an, die nicht kommt — **an 2 von 5 Tagen falsch**. `EpisodeSlots.test.ts:81-88` fixiert den Fehler.
**Fix:** `(day + 1) % POLL_EVERY_PHASES` + Test drehen.

### N-05 · P2 · Zwei Belief-Buchhaltungen: Kipp-News und Wohnzimmer-Fahne divergieren systematisch
Engine-belief (persistiert, monoton, `StoryEngineAdapter.ts:808-812/4585`) vs. Anzeige-belief
(React-State mit Decay 0.12/Phase Richtung 0.35, nicht persistiert, `useAudienceBroadcast.ts:50/70-99`).
Fahnen-Badge liest **nur** den Anzeige-belief (`BroadcastBar.tsx:300-305`), Kipp-News/Vortest
**nur** den Engine-belief. Folge: TV meldet „X kippt", im Fenster hängt keine Fahne; nach
Save/Load garantiert falsch; Fahne kann trotz „irreversibel" wieder verschwinden.
**Fix:** Badge aus `engine.gekippteGruppen` speisen; Schwelle als EINE exportierte Konstante.

### N-06 · P2 · Kampagnen-Schmiede-Kette ohne Produzenten: Bias-Lektion mechanisch folgenlos, ~550 Zeilen toter gemergter Code
Phase 3 des Redesigns entfernte die einzigen Producer (`setOperationQueue`/`record`); seitdem
ist `biasWarned` im Live-Spiel nie true → OP_BIAS_*-Backfire (`StoryEngineAdapter.ts:5264/4013-4015`),
Erkenntnis-Dossier und Analysis-Strip unerreichbar; `dossierStore.record()` hat 0 Live-Caller.
FOKUSGRUPPE_REDESIGN_PLAN §11 begründet das Behalten mit „lebenden Flächen", die nachweislich
tote Zweige sind.
**Fix:** Entscheid: Bias-Konsequenz an den neuen Vortest-Pfad koppeln ODER Kette konsequent
archivieren + Plan §11 korrigieren.

### N-07 · P2 · Panel-Hotkeys feuern unsichtbar HINTER offenen Vollbild-Views
Hotkey-Switch (`StoryModeGame.tsx:716-758`) prüft nur Terminal/Tafel — M/S/N/P/E/B/I/H/?
mounten Panels hinter Lagebild/Tagesfazit & Co., **obwohl das Lagebild „Taste M"/„Taste S"
selbst bewirbt** (`LagebildView.tsx:130/244`). `?` erscheint z-50 UNTER dem Lagebild (z-100).
**Fix:** Panel-Switch komplett unter `!vollbildOverlayOffen` stellen; die zwei fast gleichen
Overlay-Prädikate (Z. 605/643) zu einem zusammenführen.

### N-08 · P2 · Autosave ohne try/catch + keine ErrorBoundary: localStorage-Fehler = weißer Bildschirm
`saveGame` ruft `localStorage.setItem` 3× ungeschützt (`useStoryGameState.ts:1693-1699`),
Aufruf bei **jedem Phasenwechsel** (`StoryModeGame.tsx:769-775`); 0 ErrorBoundaries im Baum.
Quota/Privatmodus ⇒ Exception aus dem Effect ⇒ React unmountet alles, reproduzierbar je Tageswechsel.
(Kontrast: SoundSystem/playerProfileStore wrappen korrekt.)
**Fix:** try/catch + `handleSave`-Fehlermeldung; ErrorBoundary um `<StoryModeGame>`.

### N-09 · P2 · Selbst-Crossfade + weitere #105-Folgen (Sound)
Kein Same-Track-Guard: Krisenbeginn/Niederlage bei laufendem `music_tense` startet **denselben
Track hörbar neu** und spielt ihn 700 ms doppelt — genau an den inszenierten Höhepunkten
(`SoundSystem.ts:356/371-406`, `soundDirector.ts:58-59`). Dazu (P3): 1 Netz-Request pro
Rotationswechsel auf max-age=0-Pfad; ~1-s-Energie-Loch je Trackende (ended-Trigger statt
echtem Crossfade); auf iOS ist der komplette volume-basierte Mix (Trim/Ducking/Fades) wirkungslos.
**Fix:** Early-Return bei `assetId === musicAssetId`; Element-Cache je Track; Rotation via
timeupdate bei duration−0,7 s; langfristig Trim in die MP3s baken (braucht CI/ffmpeg).

### N-10 · P2 · „Die EINE Sim-Rekalibrierung" ist in drei Quellen an drei Stellen geplant
#109 (ohne Kalibrierung) vs. Review §6 („nach #94-Rebase, EINMAL, dabei H-14 mitnehmen") vs.
#110 Paket 1 („H-01-Fix + EINE Rekalibrierung sofort", Wahltag-Sieg aber erst Paket 3).
Wörtlich befolgt: 2–3 Kalibrierrunden — oder ein unbemerkt rotes Sim-Gate (keine CI).
**Fix:** Kanonische Sequenz: O-A+O-H entscheiden → #109 (+Regressionstest) → #94-Rebase inkl.
Wahltag-Check → **genau eine** Rekalibrierung. Bis dahin Sim-Gate nach jedem Merge manuell.

### N-11/N-12 · P1/P2 · Prozess (bestätigt): Umsetzungs-Stau + unsichtbares Review
(a) Paket A 0/5 nach 4 Tagen, main eingefroren, DoD ist faktisch „PR erstellt" statt „gemergt".
(b) 0 Verweise auf REVIEW_HOLISTISCH aus aktiven Dokumenten; STATUS.md-Kontrakt zum zweiten
Mal in Folge verletzt (Kopf-Stand 07-08, kennt 4 Merges + Review nicht; 611-Zeilen-Append-Log).
**Fix:** s. Empfehlungen E1/E7.

### Neue P3-Befunde (aus den Dimension-Reviews, nicht einzeln gegenverifiziert)
- **Tafel:** loadGame lässt actionQueue der Vor-Lade-Sitzung stehen (Geister-Sendeplan + isUsed-Falle);
  queueAffordability ignoriert NPC-Rabatt (bei Kredit-Aktionen bricht die Engine den Plan mittendrin ab);
  `tausche_`-&&-Kette kann halb ausführen (Strang weg, kein Ersatz, kein UI-Sync);
  fehlendes useMemo um strangStatus macht die Tafel-Memoisierung wirkungslos.
- **NAV:** Text-Tutorial ist unerreichbarer toter Pfad (~440 Z., lehrt „10 Jahre/120 Phasen" +
  nicht existente Anker; #107 hat Schritte eines toten Overlays aktualisiert!); PixelModal-Esc
  schließt gestapelte Modals gemeinsam; PANEL_META verwaist; „PHASE BEENDEN" vs. „FEIERABEND";
  beide AdvisorPanel-Klapp-Knöpfe seit Emoji-Purge **leer/unsichtbar**.
- **E16:** Kipp-Sprung +0,48–1,2 Punkte statt Zielbild „+3–5" (unaufgelöster Zielbild-Drift,
  H-13/H-14-Muster); commission() ignoriert Zahlungserfolg; Esc öffnet Pausenmenü unsichtbar
  HINTER dem Vortest-Modal (4. H-11-Fläche); E16-Test würde KIPP_FRAKTION=0 nicht bemerken;
  gekippte Gruppen im bezahlten Vortest nicht als solche erkennbar.
- **Sound:** Duck-Sprung am Blenden-Ende beim Spielstart.
- **Security/Repo:** loadGame-Fehlschlag stumm + Engine kann halb-mutiert bleiben; keine
  CSP/HSTS; Netlify-Build auf Node 18 (EOL 04/2025); npm audit 19 Dev-Vulns (2 critical,
  vitest-UI/vite5); tote Backend-Deps (@neondatabase/@upstash/@netlify) + `dev:netlify` ohne CLI;
  package-lock.json getrackt UND in .gitignore; **Clone-Gewicht 270 MiB Git-Pack** (245 MiB
  PNG-Blobs in der Historie — pngquant heilt nur den Checkout); 2 Drittwerk-Binärdateien
  (epub/pdf) mit ungeklärter Lizenz in docs/.
- **Prozess:** Onboarding ~3.000 Zeilen Pflichtlektüre mit Faktenfehlern (CLAUDE.md „130+ Tests",
  real 727); 147 aktive .md, 51 datierte Einweg-Dokumente, 23 mit Kanonizitäts-Anspruch.

---

## 3. PR-Lage (Aktualisierung von Review-§6)

**Gute Nachricht (widerlegter Verdacht):** Alle offenen PR-Branches wurden am 07-10 auf den
aktuellen main `9dfbb38` **rebased** (merge-base je Branch = main-Spitze, per git verifiziert).
**Basis-Drift = 0 — das Merge-Fenster ist JETZT.** Die §6-Auflagen je PR (Mini-Fixes) bleiben
bestehen und sind vor dem Merge je PR zu verifizieren.

| PR | Einordnung 07-14 |
|---|---|
| **#109** NaN-Fix | Korrekt + minimal, aber: N-01 (O-H-Gate nötig!), nur halber H-01 (N-10-Sequenz beachten), kein Regressionstest |
| **#110** Konzept „Herausragend" | **Splitten:** Verify-Suite (2 additive Test-Gates day40-marathon/content-coverage + 3 Harnesse — schließt einen H-18-Teil, liefert Leitzahl „43,3 % der Content-Objekte / 27,4 % der Wörter unerreichbar") sofort mergebar; Konzept-Doku vor Merge um 2 belegte Ungenauigkeiten korrigieren (#102 „merge-reif" stimmt nicht; „H-01-Fix" ohne Trigger-Hälfte) |
| #99/#102/#104/#101/#94 | Wie Review-§6, Reihenfolge unten (E8); #94 zwingend NACH #109 + O-A |

---

## 4. Positivbefunde (explizit geprüft)

- **E16-Engine-Kern vorbildlich:** Writeback einmalig/geklemmt/idempotent, Vorschau=Wirklichkeit
  konstruktiv (geteilte Konstanten), Save/Load **vollständig** (H-08-Muster NICHT wiederholt),
  Kosten real, Vortest keine Gratis-Strategie; personas-Präfix-Falle im neuen Code entschärft.
- **#107-Geometrie solide:** natives SVG-Hit-Testing, Cover-Transform exakt, Beschnitt-Wächter
  mit Regressionstests; rennen.ts mathematisch sauber, EINE Quelle für HUD/Lagebild/Tafel;
  panelStore-Reset vollständig; ActionQueueWidget rückstandsfrei archiviert.
- **#106-Kern:** neuer episodeAbschluesse-Slice auf BEIDEN Reset-Pfaden genullt (Systemleiden
  nicht wiederholt), Brett-Cap engine-seitig + korrekt geordneter Save-Guard, Esc nach
  Terminal-Muster, Affordability-Grundrechnung im rabattfreien Fall korrekt + getestet.
- **#105-Substanz:** Lautheits-Trim unabhängig nachgemessen — alle 5 Werte auf ≤0,05 dB exakt;
  Musik strikt on-demand; Autoplay-Policy sauber; keine Timer-Leaks.
- **Security-Basis:** 0 Secrets (inkl. kompletter Historie), 0 aktive Functions, 0 innerHTML/eval,
  sprite-tool-Deploy vorbildlich gehärtet (Basic-Auth, Prod-Key-Fallback hart deaktiviert).

---

## 5. Prozess-Lagebild (Kennzahlen)

| Kennzahl | Wert |
|---|---|
| Commits auf main seit Review-Merge (07-10 17:16) | **0** in 4 Tagen |
| Paket A umgesetzt | **0/5** (1/5 als ungemergter Draft) |
| Review-§6-Fahrplan | Schritt 1/9 (am Review-Tag selbst: #105 gemergt, #29/#61/#62 geschlossen — danach Stillstand) |
| Offene Entscheidungsschuld | 18 H-Befunde + H-13/H-14 + #101-Routing + 8× O-A–O-H (#110) + N-01/N-06/N-10 (neu) |
| Aktive .md / mit Kanon-Anspruch / Einweg-datiert | 147 / 23 / 51 |
| Pflicht-Lesepfad frische Session | 12–14 Dokumente, ~3.000 Zeilen, 3 konkurrierende Reihenfolgen, 0 Verweise aufs Review |
| Doku- vs. Code-Zeilen | 36.301 vs. 65.305 (0,56:1) |
| Frischer Clone | ~270 MiB Pack + 210 MB Assets + 204 MB node_modules ≈ 700 MB je Session |

**Kernaussage:** Die Analyse-Maschinerie produziert verifizierte Befunde schneller, als der
eine Owner sie mergen oder entscheiden kann. Jedes weitere Analyse-Dokument verlängert die
Schlange, veraltet selbst und erhöht die Onboarding-Last. Das Projekt **kann** sein Ziel
erreichen — aber nur mit umgestelltem Modus: **Sessions schließen bestehende Arbeit**, DoD =
„auf main", Owner-Entscheide werden gebündelt bewirtschaftet.

---

## 6. Empfehlungen (Reihenfolge = Priorität)

**E1 · Umsetzungs-Modus statt Analyse-Modus (sofort, 0 Aufwand).**
Analyse-Moratorium bis Paket A gemergt ist; DoD projektweit = „auf main"; WIP-Limit ~3 offene PRs.
*Begründung: Engpass ist Owner-Bandbreite; alles andere in dieser Liste setzt das voraus.*

**E2 · Drei Owner-Entscheide zuerst bündeln (Minuten, entsperrt am meisten):**
**O-H** (Umgang cons_victim_suicide — blockiert #109-Merge, N-01) · **O-A** (Sieg nur am
Wahltag — blockiert #94-Rebase, die EINE Rekalibrierung, Finale-/Mittelspiel-Hebel; Juroren
einstimmig pro) · **O-B** (Broadcast-Routing Masche vs. Kanal — blockiert #101). Im bewährten
DECISIONS-Transkript-Format, zusammen mit H-13/H-14 und O-E/O-G.
*Begründung: billigste Aktionen mit größter Blockade-Lösung (N-01, N-10, Review-§6).*

**E3 · CI als allererster Merge (H-04, Stunden).**
`npm ci && typecheck && vitest run` (Sim-Gate benannt) + Asset-Pipeline-Job; die 2 fertigen
Test-Gates vom #110-Branch (day40-marathon, content-coverage — rein additiv) gleich einhängen;
die 2 roten Pipeline-Tests fixen. *Begründung: „grün auf Branch, rot nach Merge" ist 2× belegt;
jede weitere Merge-Reihenfolge ist ohne CI blind; N-10 braucht das Sim-Gate als Anker.*

**E4 · #109 mit O-H-Gate + Regressionstest mergen, dann kanonische Kalibrier-Sequenz (N-10).**
Sequenz: O-A+O-H → #109 (+Test „jede Konsequenz: endliche Wahrscheinlichkeit UND auflösender
Trigger" — erweitert zugleich H-16) → #94-Rebase inkl. Wahltag-Check → **genau EINE**
Rekalibrierung. Follow-up: die 7 trigger-toten Konsequenzen (Enttarnungs-Kette!) reparieren.
*Begründung: H-01 ist Haupttreiber von H-13 (Random gewinnt 100 %); ohne Sequenz 2–3 Kalibrierrunden.*

**E5 · Stabilitäts-Batch (mechanisch, Rezepte liegen vor; ~1 Session).**
N-08 (try/catch + ErrorBoundary) · H-03 inkl. der 2 neuen Slices + resetDay + loadGame-Queue ·
H-11 + N-07 + Overlay-Stack als EINE zentrale Esc-/Ebenen-Regel (statt 6 Einzel-Fixes) ·
H-12-5-Zeilen-Fix + N-09-Same-Track-Guard · N-02 (Math.abs) · N-04 (Countdown) · N-03
(Dedup + isUsed-Guard). *Begründung: alles bestätigte Spieler-Bugs mit fertigen Fix-Rezepten;
zusammen kleiner als eine Feature-Session.*

**E6 · pngquant + Preload-Deckel (H-02(1–2), Stunden, −~180 MB).**
*Begründung: größter Erlebnis-Hebel pro Aufwand; Voraussetzung für „erste 60 Sekunden"-Hebel
und jeden externen Playtest (#110 Blindfleck 7).*

**E7 · Doku-Konsolidierung (30–60 Min, mechanisch).**
H-05-Fixliste ausführen (EINE Hierarchie, START_HERE → 3 Zeilen, SESSION_KICKOFF-Branchregel,
ROADMAP-Superseded-Kopf) + **Arbeitsvorrat-Verweis** („= REVIEW_HOLISTISCH_2026-07-14 §6")
in SESSION_KICKOFF/STATUS + CLAUDE.md-Faktenfehler fixen + STATUS-Kontrakt per CI-Check
erzwingen oder Kopf aus git log generieren. Lebenszyklus-Regel: datierte Dokumente nach
docs/log/, lebende Wahrheit = 5 Dateien. *Begründung: Multiplikator — jede künftige Session
arbeitet sonst mit falscher Karte (der Grund, warum Paket A liegen blieb).*

**E8 · PR-Backlog nach Rezept schließen (Fenster ist jetzt, Drift = 0).**
#99 (Text fixen) → #102 (2 Mini-Fixes: pendingDebate-Reset, Abmildern-Preis) → #104 (2 Fixes)
→ Erstbegegnungs-Guard → #101 (mit O-B) → #94 (nach E4-Sequenz). #110 splitten (Verify-Suite
mergen; Konzept-Doku korrigiert mergen). *Begründung: die teuren Tiefenprüfungen sind gemacht
und aktuell gültig — Warten entwertet sie erneut.*

**E9 · Danach Erlebnis-Quick-Wins (S-Aufwand, aus #110 verifiziert):**
Stempel-Slam/„VOLLZOGEN" (#11) · „Erkannt an:"-Zeile (#13 — counter_de 18/18 vorhanden) ·
Wahlabend-Ambience + End-Musik (Assets liegen tot) · Tafel-Kontrast/Nie-leer (#16) · die 5
kleinen Verify-Suite-UX-Fixes. Dann die großen Pakete (Finale, Gegner sichtbar, Mittelspiel-Motor)
entlang der O-Entscheide. *Begründung: hohe Identitätswirkung, null Abhängigkeiten — aber erst
sinnvoll, wenn E4/E5 das Fundament tragen.*

**E10 · Repo-/Deploy-Hygiene (1 Sammel-PR, niedrig, gern parallel).**
CSP+HSTS · Node 22 · tote Backend-Deps + dev:netlify raus · package-lock aus .gitignore ·
epub/pdf durch Zitate ersetzen · VQA hinter Build-Flag + sourcemap hidden · npm audit fix ·
shallow-Clone als Session-Standard dokumentieren (270-MiB-Pack); History-Rewrite erst NACH
pngquant erwägen. *Begründung: lauter Einzeiler; das Clone-Gewicht besteuert jede Session.*

---

## 7. Methodik

44 Agenten: 10 Dimensions-Prüfer (Alt-Befund-Verifikation P1/P2×3, Post-Merge-Tiefenprüfung
#106/#107/#100+5abc/#105, Security/Deploy/Repo, Prozess-Meta mit eigenen Messungen,
PR-#109/#110-Integration mit eigener Trigger-Auflösung) + je 2 adversariale Widerleger pro
neuem P1/P2-Befund (Auftrag: widerlegen; Duplikate zum 07-10-Review aussortieren). Nur
Bestätigtes ist oben als P1/P2 geführt; der einzige widerlegte Befund (PR-Basis-Drift) ist als
gute Nachricht in §3 dokumentiert. Ground Truth separat: `tsc` sauber, `vitest run` 727/727
grün (43,9 s), main `9dfbb38`.
