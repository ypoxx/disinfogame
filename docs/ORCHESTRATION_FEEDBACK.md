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
