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

1. **Agenten, die ankündigen statt arbeiten:** Zwei Anläufe für die Dialog-Vertonung
   endeten nach 1 Werkzeugaufruf mit „Ich werde …". Wirksam war erst eine harte
   Abschluss-Klausel („Antwort MUSS mit BERICHT: beginnen, niemals ankündigen,
   tsc/vitest-Ausgabe anhängen"). → In Agenten-Briefings standardisieren.
2. **Env-Namens-Drift:** Pipeline erwartet `GOOGLE_AI_API_KEY`, Umgebung liefert
   `GEMINI_API_KEY`. → Pipeline sollte beide akzeptieren (1-Zeilen-Fix in
   `gemini.mjs`).
3. **Stilles Überspringen beim Stimmen-Casting:** 40 Voice-Shots wurden mangels
   `voices.json`-Einträgen kommentarlos übersprungen; `status` wies nicht darauf
   hin. → `status` sollte „blockiert durch fehlendes Casting" getrennt ausweisen.
4. **Browser-Verifikation im Container:** `playwright install` schlägt fehl
   (Netz-Policy); es liegt aber ein Chromium unter
   `/opt/pw-browsers/chromium-1194/...` bereit → `executablePath` nutzen.
   → Kandidat für ein Projekt-Skill (`/run-skill-generator`), damit die nächste
   Session nicht neu rätselt. Smoke-Skripte: `/tmp/smoke*.mjs` (Session-flüchtig).
5. **Dialog-Texte vs. Vertonung zweigleisig:** `npcs.json` (Quelle der Voice-Shots)
   und `dialogues.json` (Quelle der angezeigten Texte) können divergieren; die
   Vertonung darf nur die exakte Text-Schnittmenge verdrahten. → Mittelfristig EINE
   Dialog-Quelle mit `voiceKey`-Feld pro Zeile (Schema-Änderung, kleiner Migrator).
6. **Veraltetes CLAUDE.md:** `desinformation-network/.claude/CLAUDE.md` beschreibt
   den archivierten Pro-Mode und verwirrt jede neue Session. → Neuschreiben auf
   Story-Mode-Realität (Verweis auf VISION_LOCK/START_HERE genügt).

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
| **Besuchs-Belohnung**: NPC-Räume physisch aufsuchen schaltet günstigere Aktionen/Neues frei, sonst umgeht jeder das Gebäude per Tastenkürzel | Game-Design A4 | M |
| **Eskalations-Inszenierung** klein/mittel/groß differenzieren (Ticker → Schlagzeile → Vollbild-Sondersendung; Assets/SFX vorhanden) | Game-Design A5 | S–M |
| Konsequenz-/Gegenreaktions-Badge am Fenster-Hotspot (drohende Enttarnung sichtbar machen) | Game-Design D5 | S |
| HUD-Hierarchie: RISIKO/KAPAZITÄT visuell priorisieren | UX A5 | S |
| Broadcast-Leiste bei offenem Dialog automatisch schließen (Überlagerung) | UX A8 | XS |
| Emojis in der Tab-Leiste durch Pixel-Icons ersetzen (Ästhetik-Bruch) | UX A6 | S |
| Fokus-Ring per `:focus-visible` statt JS-Hover-State (TitleScreen/Hotspots) | UX B2 | S |
