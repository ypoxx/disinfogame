# 🛠️ Orchestrierungs-Feedback — Lehren aus dem Komplett-Ausbau (2026-06-12)

**Status:** Erfahrungsbericht für Roadmap/Prozess-Updates
**Kontext:** Eine Session hat V0–V7 des Einstiegs-/Gebäude-Plans umgesetzt: 26 neue
Bilder + 6 SFX + 50 Stimmen generiert, Gebäude-Stage/Navigator/Titel/Büro/Broadcast
gebaut, Entwürfe archiviert, Experten-Reviews orchestriert. Was dabei auffiel:

## Was gut funktioniert hat (beibehalten)

1. **Daten-getriebene Shot-Liste:** Lobby + Spielerbüro in `building.json` eintragen
   → `room_lobby`/`room_spieler_buero` erschienen automatisch als Muss-Shots.
   Dieses Muster (Daten → Soll-Liste → Status) auf weitere Bereiche ausdehnen
   (z. B. Dialog→Voice-Kopplung, s. u.).
2. **Stil-Kern + deterministische Seeds:** Alle 20 Baukasten-/HUD-Bilder bestanden
   das Vision-Review im ersten Lauf. Der Stil-Lock-Invest aus PR #73 zahlt sich aus.
3. **Pure-TS-Kern + dünne React-Hülle:** `buildingLayout`/`BuildingNavigator` waren
   in Minuten testbar (12 Tests), die Stage blieb reines Rendering. Für künftige
   Systeme (Zeitkonto, Wochenschau) gleiches Schnittmuster verwenden.
4. **Parallel-Agenten auf disjunkten Dateien:** TitleScreen/ArrivalSequence und
   PlayerOfficeView entstanden parallel ohne Konflikt, weil die Specs exakte
   Datei-Grenzen zogen („NUR diese Datei, Integration macht der Orchestrator").
   PlayerOfficeView-Agent hat das generierte Raumbild per Vision gelesen und die
   Hotspots selbst daraus positioniert — das Muster taugt als Standard.
5. **CSS-Fallbacks überall:** Stage/HUD funktionieren ohne Manifest — Reviews und
   Tests hängen nicht an Assets.

## Reibungen (Prozess-Fixes empfohlen)

1. **Agenten, die ankündigen statt arbeiten (wiederholt bestätigt):** Auch bei
   Recherche-Aufträgen starten Standard-Agenten gern eigene Hintergrund-Sub-Agenten
   und beenden ihren Turn mit „Ich warte auf Ergebnisse". Wirksames Gegenmittel,
   jetzt Standard für ALLE Agenten-Briefings: ① „Führe alles SELBST und SEQUENZIELL
   aus, starte KEINE eigenen Agenten/Hintergrund-Tasks", ② „Antwort MUSS mit
   BERICHT: beginnen", ③ messbares Abgabe-Artefakt nennen (tsc-/vitest-Ausgabe,
   Quellen-URLs). Kurios: Die verwaisten Sub-Agenten liefern ihre Ergebnisse
   trotzdem ab — Befunde nicht wegwerfen, sondern einsammeln.
2. **Verständliche Sprache gegenüber dem Owner (neu, 2026-06-12):** Fachwörter wie
   „Diegese" haben eine Owner-Frage unnötig blockiert. Regel: Konzepte und Fragen
   in einfacher Sprache; Fachbegriff höchstens in Klammern mit Erklärung.
3. **Env-Namens-Drift:** behoben — `gemini.mjs` akzeptiert jetzt auch `GEMINI_API_KEY`.
4. **Stilles Überspringen beim Stimmen-Casting:** 40 Voice-Shots wurden mangels
   `voices.json`-Einträgen kommentarlos übersprungen; `status` wies nicht darauf
   hin. → `status` sollte „blockiert durch fehlendes Casting" getrennt ausweisen.
5. **Browser-Verifikation im Container:** `playwright install` schlägt fehl
   (Netz-Policy); es liegt aber ein Chromium unter
   `/opt/pw-browsers/chromium-1194/...` bereit → `executablePath` nutzen.
   → Kandidat für ein Projekt-Skill (`/run-skill-generator`).
6. **Dialog-Texte vs. Vertonung zweigleisig:** `npcs.json` (Quelle der Voice-Shots)
   und `dialogues.json` (Quelle der angezeigten Texte) können divergieren; die
   Vertonung darf nur die exakte Text-Schnittmenge verdrahten. → Mittelfristig EINE
   Dialog-Quelle mit `voiceKey`-Feld pro Zeile (Schema-Änderung, kleiner Migrator).
7. **CLAUDE.md aktuell halten:** war auf Pro-Mode-Stand, neu geschrieben 2026-06-12.
8. **Webrecherche hinter 403-Mauern:** Viele Retro-/Fach-Seiten blocken WebFetch
   (HTTP 403). Such-Snippets reichen oft — Agenten anweisen, bei 403 nicht
   aufzugeben, sondern Snippet-Synthese mit Quellenliste zu liefern.

## Roadmap-Ergänzungen (aus Funden dieser Session)

| Punkt | Quelle | Aufwand |
|---|---|---|
| Save/Load sichert `DialogLoader`-Zustand nicht (Emotional Memory geht verloren) | Architektur-Exploration | S |
| `StoryHUD.ViewToggleButton` kennt nur 2 von 3 Views (Label falsch bei `building`) | Architektur-Exploration | XS |
| `sovietRed` → `ministryRed` umbenennen (interner Token, 70 Stellen) | SYMBOLS_AUDIT.md | XS |
| Komponenten-/E2E-Smoke als CI-Schritt (Playwright gegen Vite-Preview) | diese Session | M |
| Broadcast-Mapping in Aktions-Daten verlagern (`actions.json` + `broadcast`-Feld) | MINISTRY_BROADCAST_CONCEPT.md §5.2 | S–M |
| Talkshow-/Sondersendungs-Formate + Wochenschau am Phasen-Ende | MINISTRY_BROADCAST_CONCEPT.md §3 | M |
| Zeitkosten aktivieren (Navigator-Hook) + Balancing-Sitzung | PLAYER_ENTRY_AND_BUILDING_PLAN.md §8 | M |
| Zweites Publikums-Land (gallia) sichtbar machen | MINISTRY_BROADCAST_CONCEPT.md §5.5 | S |
| NPC-Tagesabläufe (Figuren bewegen sich im Gebäude) | Plan §8 | M |

### Aus den Experten-Gutachten (2026-06-12, Quick Wins bereits umgesetzt)

Umgesetzt in dieser Session: Tutorial-Wand entfernt (Onboarding = diegetisch),
Broadcast-Auto-Peek nach jeder Aktion, Ankunfts-Captions + Pause, Tutorial-Kanon
(Alexei/110/8 Enden, Slogan raus), Dialog-Zifferntasten, prefers-reduced-motion,
WCAG-Kontraste, persistente Hotspot-Ringe, Hover-Tiefe, ARIA-Progressbars,
Publikums-Sprechblasen mit Betroffenen-Zitaten.

Offen für die Roadmap (priorisiert nach Gutachten):

| Punkt | Gutachten | Aufwand |
|---|---|---|
| **Technik-Enttarnung** nach jeder Aktion: eingesetzte Persuasions-Technik benennen + 1 Erkennungsmerkmal (Taxonomie + Encyclopedia existieren) — Kern des Bildungszwecks | Psychologie C1 | M |
| **Wochenschau/Debrief am Phasen-Ende** („3 Techniken eingesetzt, X verunsichert") statt Reflexion nur im Abspann | Psychologie C3 | M |
| **Zeitdruck aktivieren**: sichtbare Uhr + sanfte Bewegungskosten (Zeit-Hook liegt bereit) — Owner-/Balancing-Entscheidung | Game-Design A2 | M |
| ~~Besuchs-Belohnung: NPC-Räume aufsuchen schaltet günstigere Aktionen frei~~ **GESTRICHEN** per Owner-Entscheidung A3 (2026-06-12): keine mechanischen Belohnungen für Bewegung; stattdessen K7 NPC-Tiefe | Game-Design A4 → `DECISIONS_2026-06-12_NEXT_LEVEL.md` | — |
| **Eskalations-Inszenierung** klein/mittel/groß differenzieren (Ticker → Schlagzeile → Vollbild-Sondersendung; Assets/SFX vorhanden) | Game-Design A5 | S–M |
| Konsequenz-/Gegenreaktions-Badge am Fenster-Hotspot (drohende Enttarnung sichtbar machen) | Game-Design D5 | S |
| HUD-Hierarchie: RISIKO/KAPAZITÄT visuell priorisieren | UX A5 | S |
| Broadcast-Leiste bei offenem Dialog automatisch schließen (Überlagerung) | UX A8 | XS |
| Emojis in der Tab-Leiste durch Pixel-Icons ersetzen (Ästhetik-Bruch) | UX A6 | S |
| Fokus-Ring per `:focus-visible` statt JS-Hover-State (TitleScreen/Hotspots) | UX B2 | S |

---

## Lehren 2026-06-14 (Strang 3+4 P0 + Owner-Visual-Feedback)

1. **Visuelle Sweeps brauchen ein Mounted-Component-Audit, keine Modal-Liste.** Strang 1
   meldete „Emojis 241→0 / Schatten 37→0", aber das dauerhaft sichtbare `AdvisorPanel`
   (Berater-Sidebar) behielt Verbots-Schlagschatten/Glow + Off-Palette-Farben. Lehre: bei
   „X überall entfernt"-Aufträgen ALLE im Spielerpfad gemounteten Komponenten auflisten und
   abhaken — nicht nur die offensichtlichen Modals. Erfolgsmeldungen entsprechend vorsichtig
   formulieren („geprüft: Dateien A–Z").
2. **Daten-Inventur gegen ALLE Quell-Dateien.** Der Strang-3+4-Feinplan zählte „30 Aktionen",
   tatsächlich sind es **110** (`actions_continued.json` mit 80 war übersehen). Vor Mengen-
   Aussagen den Loader-Pfad prüfen (`ActionLoader` lädt beide Dateien), nicht nur die
   Hauptdatei. P0 hat alle 110 abgedeckt.
3. **Zentrales `STATUS.md` eingeführt.** Viele verstreute Plan-/Decision-Docs erschwerten
   den „wo stehen wir?"-Blick. `docs/STATUS.md` ist jetzt der eine lebende Einstieg
   (erledigt/offen/TODO) und wird je Session aktualisiert.
4. **Browser-Smoke reproduzierbar gemacht.** `playwright-core` als devDep + `npm run smoke`
   (`scripts/app-smoke.mjs`) gegen `vite preview`; Chromium-Binary liegt im Container
   (`/opt/pw-browsers/chromium-1194`). Bestätigte das Owner-Feedback am echten Build.

## Lehren 2026-06-20 (Story-Director-Spine: Slice 3/4 + Schicht 3 + Beats 6/6)

1. **Toolchain-Drift im frischen Web-Container.** Beim Start fehlten die `node_modules`
   bzw. `npx` zog ad-hoc TypeScript **6.0.2** (statt der im Lockfile gepinnten **5.9.3**),
   was `tsc` an der `baseUrl`-Deprecation (TS5101) abbrechen ließ und React-Typen
   vermissen ließ. Fix: **`npm ci`** in `desinformation-network/` vor dem Gate. → Kandidat
   für einen SessionStart-Hook, damit künftige Web-Sessions sofort grün testen können.
2. **Mehrtägiger, diegetischer E2E ist headless unzuverlässig — Test-Pyramide schlägt
   Browser-Drive.** Der Weg zum Decision-Modal (Auftrag → Büro → FEIERABEND → Heimweg-
   Animation → Tagesbericht → Tag-2-Briefing) ist zu timing-/canvas-empfindlich für einen
   stabilen Playwright-Lauf. Wirksamer und reproduzierbar: **deterministischer
   Hook-Integrationstest** (`renderHook(useStoryGameState)` + `Math.random`-Stub → echter
   `endPhase` setzt `pendingDecisionBeatId`) für den Auslöser **+ RTL** fürs Modal-Rendern
   **+ Store-Unit** für die Naht. Den flakigen Runthrough NICHT als „Verifikation" einchecken.
3. **Programmatische `element.click()` lösen Reacts `onClick` nicht zuverlässig aus** —
   echte Playwright-Klicks (`getByRole(...).click({force})`) verwenden. Und: Eck-Klicks zum
   Dialog-Vorspulen statt Bildschirm-Mitte, sonst wird versehentlich eine Karte gewählt.
4. **Reaktive Beats brauchen ein achsen-bewusstes Gate.** „Richtig" wandert je Beat
   (Auftrag → operative Lage → Spielgeschichte, Befund C.1). Ein auftrags-only-Gate wäre
   für Lage-/Geschichte-Beats falsch; `bestForContext` dispatcht je `relativitaetsAchse` und
   trägt Empfehlung UND Gate.
5. **Owner-Sprache zuerst.** Die erste Rückfrage zur Vertrauens-Kopplung war zu technisch
   (`obj_destabilize`/„Sieg-Achse") und hat Verwirrung erzeugt. Erst nach einer Klartext-
   Erklärung („Beats teilen jede Achse mit Aktionen außer dem Sieg-Zähler") war die
   Entscheidung tragfähig. → Konzept immer in einfacher Sprache führen, Fachbegriff nur in
   Klammern (SOUL §2/§7).
6. **Handoff ergänzt SOUL/STATUS, ersetzt sie nicht.** Diese Session folgte nur dem
   `HANDOFF_2026-06-18.md` und übersprang die SOUL-Lese-Reihenfolge + die STATUS/DECISIONS-
   Pflege. Nachgezogen (STATUS.md, dieses Doc, `DECISIONS_2026-06-20_BEATS.md`). Lehre: auch
   bei einer engen Continuation-Aufgabe STATUS am Ende aktualisieren und Owner-Entscheidungen
   ins datierte DECISIONS-Doc destillieren.
7. **Pacing/Schwierigkeit: die Sim-VERTEILUNG ist der Beweis, nicht die Sieg-Quote.** Für
   P2-17 („spürbar härter") war die exakte Win-Rate (verrauscht, s. STATUS-Methodik-Notiz)
   wertlos — der überzeugende Beleg war die **Struktur** der Enden: das „Zeit abgelaufen"-
   Fizzle verschwand komplett und vorsichtiges Spiel sprang von max. Risiko ~3 (nie enttarnt)
   auf ~85–100 (kann auffliegen). Lehre: Difficulty-Änderungen am **Vorher/Nachher der
   Enden-Verteilung + Max-Risiko je Strategie** messen, nicht an einer Zahl. Erst Baseline
   loggen, dann ändern, dann gegenmessen; die neuen Garantien als Regressionstest pinnen
   (`Pacing.test.ts`: frühe Welle deterministisch, Schonzeit risiko-arm, Spät-Eskalation in
   die Gefahr) — und die Sieg-Achse über `BalanceInvariant` weiter sauber halten (R2).

## Etappe 3 „Immunsystem" — Lehren zum Balance-Tuning (2026-07-04)

8. **Deterministische Sim-Strategien sind bang-bang; Bänder brauchen große Stichproben.**
   Die drei Sim-Strategien (greedy/random/low_risk) sind pro Seed nahezu deterministisch —
   bei 12 Partien/Strategie kippt eine Win-Rate mit einer winzigen Stellschraube komplett
   von 0 % auf 100 % (kein stabiles „50 %"). Erst **24 Partien/Strategie (72 gesamt)** haben
   die `globalRandom`-Verrauschung des Engine-Kerns genug gemittelt, dass greedy stabil bei
   29–50 % lag und tragfähige Bänder (`TARGET_BANDS`) scharfschaltbar wurden. Lehre: Für
   Pro-Strategie-Bänder Stichprobe erhöhen, NICHT die Floors immer weiter aufweichen; und die
   Robustheit **8×-flakefrei** verifizieren, bevor man ein Band als Gate pinnt.
9. **Gekoppelte Balance-Hebel einzeln bewegen und gegen ALLE Gates messen.** Vier Stellschrauben
   (Lärm-Kopplung, Risiko-Melder-Anteil, fraktions-Drift, Win-Threshold) zogen sich gegenseitig:
   der Fix für ein Band brach ein anderes (greedy in Band → p2-Operatoren chancenlos → operator
   fixen → low_risk 100 %). Die Auflösung war kein globaler Kompromiss, sondern ein **sauber
   getrennter Hebel**: Operationen treiben `fraktionsstaerke`, was NUR op-spielende Strategien
   betrifft (die Haupt-Gate-Strategien rufen `playOperation` nie auf). Lehre: Wenn zwei Tests
   Gegensätzliches vom selben Regler wollen, suche einen Hebel, der nur EINE Seite berührt —
   und miss jede Änderung gegen `winnable-and-losable` UND `balance-sim-p2` zugleich.
10. **Das „doppelte Buchhaltung" vermeiden.** Anfangs speiste die Aktions-Risikokost sowohl den
    Enttarnungs-Melder (voll) als auch die Abwehr (voll) — aggressives Spiel flog schon an Tag 8
    auf, bevor die neue Mechanik (Abwehr) je griff. Erst als der Lärm PRIMÄR in die Abwehr floss
    und den rohen Risiko-Melder nur gedämpft traf (`RISK_COST_TO_METER`), wurde die Abwehr zum
    eigentlichen zweiten Rennläufer. Lehre bei neuen Ressourcen: prüfen, ob eine Kost mehrere
    Melder DOPPELT treibt, und den Anteil je Melder bewusst aufteilen.
11. **Container-Toolchain-Drift bleibt akut.** Auch diese Session brauchte `npm ci` im
    `desinformation-network/` vor dem Gate (frischer Web-Container ohne node_modules / mit
    falscher TS-Version). Weiter Kandidat für den SessionStart-Hook.

## Etappe 4 „Impfung & Abstumpfung" — Lehren (2026-07-05)

12. **Eine neue Spieler-Bremse verlangt eine proportionale Gegner-Bremse.** Das
    Maschen-Gedächtnis dämpft den Spieler-Durchsatz um ~⅓ — mit den Etappe-3-
    Abwehr-Zuflüssen fiel greedy sofort auf 0 % (Abwehr gewinnt strukturell, weil sie
    fürs UNGEDÄMPFTE Tempo kalibriert war). Lehre: Wer eine Seite des Wettrennens
    bremst, muss die andere im selben Zug neu kalibrieren — und zwar messend
    (Interpolation zwischen zwei gemessenen Punkten war schneller als Raten).
13. **„Flächige" Strafmechaniken zerstören die gewollten Auswege.** Erste Fassung:
    jeder Einsatz nutzte ALLE erreichten Milieus ab → „Milieu wechseln" (ein im
    Zielbild §7 ausdrücklich genannter Ausweg) war unmöglich, greedy UND low_risk
    fielen auf 0 %. Die design-treue Korrektur (Abnutzung nur in RESONANTEN Milieus)
    war zugleich die Balance-Korrektur. Lehre: Bei Abnutzungs-/Immunitäts-Mechaniken
    zuerst fragen, welche AUSWEICH-Strategie das Zielbild verspricht, und die
    Datenstruktur so schneiden, dass dieser Ausweg mechanisch existiert.
14. **Verfalls-Konstanten und Stufen-Schwellen sind EIN gekoppeltes System.** Der
    Decay-Nachschliff (0,22→0,3) brach still die kanonische 1,0→0,6→0,3-Treppe beim
    Tages-Rhythmus (3. Einsatz landete bei effektiv 1,4 < Schwelle 1,5) — sichtbar nur,
    weil die Treppe als Unit-Test gepinnt war. Lehre: Solche Zusagen IMMER als Test
    pinnen und Schwellen aus dem Rhythmus herleiten (2−2·Verfall), nicht rund wählen.
15. **Band-Verschiebungen ehrlich dokumentieren statt tot-tunen.** low_risk fiel von
    29–63 % (Etappe 3) auf 0–3 gewonnene Partien — das ist KEIN Bug, sondern die
    Zielbild-Zusage „reines Abwarten verliert" (§3d), die mit dem Gedächtnis erstmals
    mechanisch wahr wird. Statt den Kern der Etappe weichzuspülen: Verschiebung in
    STATUS/Zielbild dokumentieren, kodiertes Gate auf die neue Realität stellen,
    Feinschliff der Aktions-Kuratierung (Etappe 5) überlassen.

## Etappe 5 „Fertig" (2026-07-05)

16. **Eine „Aufräum"-Aufgabe kann an ein Wirkmodell gekoppelt sein — dann NICHT halb
    machen.** Die Aktions-Kuratierung (143→60–80) sah nach reiner Daten-Diät aus. Der
    Sim zeigte: fast jede „tote" Aktion treibt VERDECKT über die impact_scale-Baseline
    (`SocietyDynamics`) den Sieg-Fortschritt. Löschen ref-sicherer impact_scale-Aktionen
    ⇒ greedy 58 %→12 %; Löschen von Legal/Low-Risk-Clutter ⇒ Passivität 4 %→75 % (weil
    `low_risk` nach Risiko sortiert und die Clutter-Picks „verschwendete"). Lehre: Erst
    empirisch prüfen, ob das zu Entfernende load-bearing ist; wenn ja, das Wirkmodell
    zuerst explizit machen (impact_scale abschaffen → Läufer-Effekte je Aktion), DANN
    reduzieren. Ein halb gelöschter Katalog mit intaktem impact_scale bricht die Balance.
17. **Empirische Balance-Befunde sind ein Deliverable — auch wenn die Aufgabe „deferred"
    endet.** Statt die Kuratierung zu erzwingen und die 8×-flakefrei kalibrierte Balance
    zu zerbrechen: die Zahlen (58→12, 4→75) in Commit + Handoff festhalten, damit die
    Folge-Session die Kopplung nicht neu entdeckt. Die dauerhafte **Aktions-Invariante**
    („jede Aktion bewegt einen Läufer", als Test) ist die Leitplanke, die die spätere
    Reduktion absichert — der wertvolle, risikofreie Teil, der SOFORT lieferbar war.
18. **JSON-Daten surgisch editieren.** `JSON.stringify(obj, null, 2)` expandiert Inline-
    Arrays → 653-Zeilen-Diff für 7 Ein-Zeilen-Änderungen. Text-basierte Insertion (Regex
    auf die Kosten-Zeile) hielt den Diff bei 13 Zeilen. Kept-Objekte nach jedem
    Skript-Lauf semantisch gegen HEAD prüfen (`JSON.stringify`-Vergleich je ID).
19. **UI-Type-Unions als Supersets lassen Enden-Beschnitt billig sein.** Beim Reduzieren
    von `GameEndState.type` (4→2) mussten die Consumer (GameEndScreen/EndReport) NICHT
    angefasst werden: ihre breiteren Unions akzeptieren den schmaleren Typ weiter. Die
    unerreichbaren Zweige sind toter, aber harmloser Code — spart Churn, ohne zu brechen.
