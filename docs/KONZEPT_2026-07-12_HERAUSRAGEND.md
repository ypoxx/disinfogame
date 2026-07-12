# 🏆 KONZEPT — Was trennt das Spiel von „herausragend"? (Konzept- & Visual-Review)

> **Datum:** 2026-07-12 · **Anlass:** Owner-Frage „Was kann konzeptionell und visuell verbessert
> werden, damit es ein herausragendes Spiel wird — und warum?"
> **Methode:** 15 unabhängige Agenten — 10 Dimensions-Tiefenleser (Kanon, letzte Updates, Kern-Loop,
> Narrativ, Art-Direction, UX/Onboarding, Pädagogik, Sound, Genre-Benchmark, **Live-Build mit
> Playwright-Ernte**: 92 Harvest-Artefakte + 6 Clean-Shots, alle gesichtet) → 3-köpfige Design-Jury
> (Mechanik / Art-Direction / Erlebnis+Serious-Game) → adversariale **Kanon-Gegenprüfung jedes
> Konzepts** mit Fundstellen (E1–E20, Stil-Bibel §4.6/§4.7, ZIELBILD, PLAN_UI_LUXUS, Tafel-Konzept)
> → Vollständigkeits-Kritik (blinde Flecken).
> **Verhältnis zu `REVIEW_HOLISTISCH_2026-07-10.md`:** Das war das Technik-Review (Bugs, Architektur,
> Performance). Dieses Dokument ist das **Erlebnis-Review**: Konzept, Dramaturgie, Bild, Klang.
> Technik-Befunde tauchen nur auf, wo sie ein Kern-Erlebnis fressen — dann mit Erlebnis-Ziel.

---

## 0. Die Leitthese

**Das Spiel hat fast alle Systeme eines herausragenden Spiels bereits gebaut — es hat sie nur noch
nicht zu einem Erlebnis geschlossen.** Zwei-Läufer-Rennen, lernendes Publikum (8×18-Maschen-
Gedächtnis — das hat kein Vorbild im Genre), eigene Materialsprache „Behörden-Akte", begehbares
lebendiges Gebäude, Terminal auf Poster-Niveau, NPC-Verrat, ein wörtlich ausformuliertes
End-Drehbuch (ZIELBILD §9): alles da. Aber:

Papers Please und Frostpunk lehren, dass ein Druck-Spiel herausragend wird, wenn **vier Kräfte
gleichzeitig am Spieler ziehen**: eine **Ziellinie, die man fürchtet** · ein **Gegner, dessen Züge
man sieht** · ein **Einsatz, der einem selbst gehört** · **Konsequenzen, die als Gesichter
wiederkehren**. Alle vier sind hier zu ~80 % gebaut und zu 0 % geschlossen:

1. **Die Ziellinie fehlt:** Siege enden im Median an Tag 14–16 statt am Wahltag (H-14) — Akt 2/3,
   Wahlabend, Tranchen-Würgeschlinge und Sonntagsfrage-Ritual sind in Siegen unerreichbarer Content.
2. **Der Gegner ist unsichtbar:** Die Abwehr ist mechanisch exzellent (4 Zuflüsse, Patches,
   Stufen-Zähne), erlebnismäßig ein Balken plus max. 3 Modals pro Partie — sie zieht nie auf der
   Fläche, auf der der Spieler plant.
3. **Der Direktor hat nichts zu verlieren:** kein Gehalt, keine Post, keine Ausstiegs-Tür — die
   einzige persönliche Größe ist eine Prämien-Textzeile im Sieg (`WahlabendScene.tsx:236`).
4. **Konsequenzen erreichen den Spieler nicht:** Die komplette fertig geschriebene Gewissens-Schicht
   ist toter Code (`getNPCCrisisDialogue`/`getNPCGameEndDialogue` ohne Aufrufer, `npcFates` berechnet
   und nie gerendert, Konsequenzen ~87 % tot per H-01, Opfer fallen nach ihrer Episode ins Nichts).

**Visuell gilt dasselbe Muster:** Die Materialsprache ist als Möblierung gebaut, nicht als Regie.
An den drei Momenten, aus denen Erinnerung, Screenshots und Let's-Play-Clips entstehen — **die
ersten 60 Sekunden, die eine wiederholte Kern-Geste, das Finale** — zeigt das Spiel heute seine
schwächsten Bilder: ein Web-Menü mit Unicode-⬢ hinter einem ~98-Sekunden-Ladebalken (H-02); Stempel,
die als statische CSS-Chips erscheinen statt zu KNALLEN; ein Wahlabend als ~90 % leerer CSS-Kasten
in Ambience-Stille, dessen End-Musik das Ergebnis vorab spoilert (Live-Sichtung
`end_victory_wahlabend_s2.png`; 0 Sound-Aufrufe in `WahlabendScene.tsx`). Dazu zerfällt das Spiel
live in **drei visuelle Dialekte** (grobe Pixel-Bühne · fein gerenderte NPC-Räume/Porträts ·
Papier-UI), und das Planungs-Herzstück Narrativ-Tafel ist auf dem Kork-Rauschen praktisch unlesbar
und an Tag 1 leer (`board_direct.png`).

**Die gute Nachricht:** Fast nichts davon verlangt neue Systeme. Es verlangt Verdrahtung, Regie und
etwa ein Dutzend gezielter Owner-Entscheide. Die Konzepte unten sind kanon-geprüft; nichts kollidiert
mit E6/E9 („nie Zahlen-Matrix", „Spaß zuerst"), dem Immunsystem-ohne-Gesicht-Verbot oder der
Stil-Verfassung — wo eine Owner-Vorlage nötig ist, steht es dabei.

---

## 1. Prioritätentafel

| # | Konzept | Typ | Status (kanon-geprüft) | Aufwand |
|---|---|---|---|---|
| 1 | Ziellinie zurückholen: Sieg NUR am Wahltag + „Führung verteidigen"-Endspiel | konzeptionell | H-14-Entscheid offen; ZIELBILD §4 sagt „AM Wahltag" wörtlich | M |
| 2 | Das Finale bauen: Wahlabend als Bild-Ton-Szene + Ende als EIN Erkenntnis-Bogen | beides | §9 wörtlich ausformuliert, ungebaut (grep „Kein einziger Schuss" = 0); Paket A wartet | M |
| 3 | Der Gegner zieht auf deinem Brett: Gegen-Karten + benanntes Verteidiger-Ensemble | beides | NEU — Owner-Vorlage (Spannungsfeld §7 „kein Gegner-Gesicht": Ensemble ≠ Avatar) | M |
| 4 | Risiko wird eine Wette: Lärm-Vorschau VOR dem Ausspielen + Ermittlungs-Gegen-Akte | konzeptionell | Lärm-Hinweis in §6 beschlossen, ungebaut; Akte neu; setzt H-01-Fix voraus | S–M |
| 5 | Mittelspiel-Motor: Direktiven der Zentrale (zustandsgeneriert) + Beats 6→~18 | konzeptionell | Direktiven §8 beschlossen, ungebaut (grep = 0); Beat-Ausbau = Experten-Empfehlung | M–L |
| 6 | Milieu-Kippen als Sprung-Ereignis: die Parteifahne im Fenster | beides | §3 beschlossen, fehlt komplett (Review P3); Anzeige-Schwelle existiert schon | M |
| 7 | Der Direktor hat etwas zu verlieren: eigene Akte + die Tür, die man nie nimmt | konzeptionell | D-009 beschlossen (2025-12-27), nie gebaut; Kollision mit Enden-Beschnitt → Owner | M |
| 8 | Mittäter mit Gedächtnis: NPC-Drei-Akt-Bögen, Verrat mit Gesicht, Gewissens-Schicht anschließen | konzeptionell | teils geplant (K7, PR #102); Ist: alle 5 NPCs = identische `ideologue`-Rotlinien | M |
| 9 | Die Uhr wird Akteur: Misstrauensvotum + Nachspielzeit-Telefonat | konzeptionell | §5a/b beschlossen; API existiert komplett und hat 0 Aufrufer | S–M |
| 10 | Erste 15 Minuten: Tag-0-Hoax live + Abwehr-Debüt + Nie-leer-Regel | beides | Tag-0 beschlossen (§10/O7), steckt in PR #94; Abwehr wird heute NIE vorgestellt | M |
| 11 | Der Stempel-Slam: die eine Signature-Geste | visuell | VOLLZOGEN-Stempel doppelt beschlossen (§10/§12.8), unumgesetzt; Slam-Anatomie neu | S |
| 12 | Renn-Quittung: jede Aktion + jeder Tageswechsel spricht die zwei Läufer | beides | L6 plant den Vokabeltausch fürs Tagesfazit; Ergebnis-Modal-Kopplung neu | M |
| 13 | „Erkannt an:"-Zeile auf JEDER Quittung (Impf-Dosis komplett) | konzeptionell | Experten-Empfehlung Sofort #5; `counter_de`-Daten vollständig vorhanden | S |
| 14 | Broadcast-Bildwelt auf main + das TV bekommt eine Stimme | beides | BINDENDE Owner-Priorität (§7), seit 6 Tagen offen; PR #101 braucht Routing-Entscheid | M |
| 15 | Erste 60 Sekunden: Dienstsiegel, Akten-Kaltstart, Laden als Inszenierung | visuell | überwiegend neu; Titel-Befund schon in VISUAL_REVIEW B2; braucht H-02-Fix | S–M |
| 16 | Tafel lesbar & nie leer: Kontrast-Regel + Erste-Tage-Bestückung | visuell | T1–T4 sind komplett — die zwei Regeln gehen darüber hinaus (Live-Beleg: unlesbar) | S |
| 17 | Eine Materialwelt: Lore-Satz + Papier-Prop-Pass + Stil-Brücke der drei Dialekte | visuell | neu; nur Zonen-Licht war geplant (Stil-Bibel A2, Abnahme nicht nachweisbar) | M |
| 18 | Kampagne als sichtbarer Bogen: Poster je Akt, Faktencheck-Überkleben, Blaulicht | visuell | teils geplant (§5 Kalender/Wahlplakate, L5); Abwehr-/Verlaufs-Kanäle neu | M |
| 19 | Stempel-Ikonografie: 18 Maschen-Familien + Milieus bekommen Symbole | visuell | neu; E6-konform (Stempel statt Zahlen); Icon-System der Stil-Bibel als Fundament | M |
| 20 | Musik hört das Rennen: zweite Musik-Achse (Abwehr/Countdown/Akt) + Wahlabend-Klang | Klang | neu; heute hängt Musik NUR an risk/Krise; ~8 fertige Assets liegen tot | S–M |
| 21 | Materielle Übergänge: CRT-Sweep, Brett-Zoom, Kalenderblatt (150–300 ms) | visuell | neu; 0 € Assets, reine Code-Session | S |
| 22 | L8-Playtest radikal vorziehen: 3–5 echte Menschen, Erste-15-Minuten-Protokoll | Prozess | L8 geplant, aber als LETZTER Schritt — Vorziehen braucht Owner-Go (Plan bindend) | S |

Aufwand: S = Teil-Session · M = 1–2 Sessions · L = mehrere Sessions. Details je Konzept in §2–§6.

---

## 2. Dramaturgie schließen (das Rennen findet statt)

### 2.1 Die Ziellinie zurückholen (#1) — der größte Einzelhebel
`evaluateEnd` (`VictorySystem.ts:64–85`) gibt `victory` sofort bei Schwellen-Erreichen zurück.
**Vorschlag (Juror-Votum, einstimmig):** Schwellen-Erreichen vor Tag 40 schaltet den sichtbaren
Zustand **„IN FÜHRUNG"** (TV: „Westunion Erwacht erstmals über der Schwelle", verfrühte Gratulation
der Zentrale), gegen den die Abwehr asymmetrisch mobilisiert — der Sieg wird erst **am Wahltag**
ausgewertet. Dazu die **Endspurt-Woche** (ab ~Tag 33): eigene Musik-Farbe, dichteres TV, tägliche
statt 5-Tage-Umfragen. **Warum:** Das Spiel bricht sein Ein-Satz-Versprechen („BEVOR der Wahltag
kommt") im Normalfall an Tag 14 ab. Ein Rennen ohne Zielgerade ist kein Rennen; Frostpunk legt den
Sturm ans ENDE. Wichtig (Kanon-Prüfer): Der Halte-Druck muss aus der **Abwehr** kommen, nicht aus
einer neuen Halte-Regel — sonst kehrt die in §4 ausdrücklich verworfene Regel durch die Hintertür
zurück. Nach dem H-01-Fix EINE Sim-Rekalibrierung (E11-Gate), nicht zwei.

### 2.2 Das Finale bauen (#2) — höchste Wirkung pro Aufwand im ganzen Backlog
Drei der vier Enden münden in dieselbe Szene — und sie ist heute der ärmste Screen des Projekts
(~90 % Schwarzfläche, ein Balken, null Klang). Das Material liegt fast vollständig da:
- **Bild:** Shot-List **Paket A** generieren (Wahlstudio, Sondersendung, Sprecherin, Grafik ≈ 1,10 $ —
  wartet seit dem Visual-Review auf Freigabe) und die Szene als SZENE komponieren: dunkles
  Spielerbüro als Raumkontext, Röhren-TV, etappenweise kriechender Hochrechnungs-Balken; im
  `exposed`-Branch ein echtes Bild des eigenen Turms mit Blaulicht statt Prosa.
- **Klang:** `wahlabend`-Ambience-Overlay setzen (gemappt, nie gesetzt — 5 Zeilen), End-Musik erst
  NACH dem Balken-Kipp (heute spoilert sie das Ergebnis), 1–2 Stings.
- **Der Erkenntnis-Bogen** (ersetzt den heutigen Tonalitäts-Stapel Szene → Belehrungs-Block →
  Gutachten): (a) Die Sondersendung erklärt „**Masche für Masche**" — die eigenen Schlagzeilen mit
  Familien-Stempel + `counter_de`-Halbsatz etikettiert; (b) **Gesichter-Epilog**: `npcFates`
  (berechnet, nie gerendert) + die 7 Zielfiguren („Was aus ihnen wurde"); (c) der
  **„Kein einziger Schuss"-Splitscreen** mit echten Partie-Zahlen; (d) die **Pförtner-Szene**
  („Mein Schwager hat sie gewählt…"). Alles §9-Wortlaut. **Warum:** Ein 40-Tage-Druck-Spiel wird an
  seinem Ende erinnert (Frostpunk: „But was it worth it?"); der E15-Moment, für den das Spiel laut
  Owner existiert, ist heute nicht gebaut. Voraussetzung: H-10-Mock-Fix (End-Narrativ aus echtem
  Zustand).

### 2.3 Der sichtbare Gegner (#3, #4)
- **Gegen-Karten am Strang (NEU, Owner-Vorlage):** Trifft ein Patch/Faktencheck einen laufenden
  Episoden-Strang, heftet die Gegenseite eine **graue Gegen-Karte auf genau diese Korkbrett-Spur**
  (GEPATCHT-Stempel, Faktencheck-Zeitung als Motiv). Sie dämpft die nächste Einklink-Aktion, bis der
  Spieler mit den existierenden Verben antwortet (kontern/ablenken kostet, aussitzen füttert die
  Abwehr). Dazu ein **benanntes Verteidiger-Ensemble** (2–3 wiederkehrende Namen in Vignetten und
  TV-Porträts: die Faktencheckerin, der Sonderermittler — ein Ensemble, KEIN Avatar; §7-konform, aber
  als Owner-Vorlage führen). **Warum:** Eskalation wird erst als Drama erlebt, wenn man den Gegner
  ziehen SIEHT und ihn beim Wiedersehen fürchtet. Heute: anonyme Textzeilen (`Gegenseite.ts:46–77`).
- **Lärm-Vorschau (§6 beschlossen, ungebaut):** Tafel-Fußzeile zeigt vor dem AUSSPIELEN die
  projizierte Abwehr-Wirkung des Tagesplans — qualitativ, E6-konform („leise / laut / sehr laut"),
  mit Ist-Quittung im Tagesfazit. Nach dem H-01-Fix wird zudem die Enttarnungs-Eskalation als
  **Gegen-Akte über die eigene Agentur** sichtbar (die Ermittlung, die über DICH geführt wird).
  **Warum:** Risiko ist heute weder vorher kalkulierbar noch nachher spürbar — es gibt weder Angst
  noch Wette. Papers Please lebt von der wachsenden Angst vor der Kontrolle.

### 2.4 Mittelspiel-Motor (#5) + Sprung-Ereignisse (#6)
Der autorierte Stoff trägt ~15 von 40 Tagen (6 Einmal-Beats, 13 Episoden ohne Tages-Taktung,
8 Krisen). Sobald #1 das Spiel wirklich bis Tag 40 laufen lässt, wird der Midgame-Sag akut —
**#1 und #5 sind ein Gespann:**
- **Direktiven der Zentrale** (§8 beschlossen, ungebaut): optionale 5-Tage-Nebenziele als
  Akten-Objekt im Tranchen-Takt, aber **aus dem Live-Zustand generiert** („Kippen Sie das
  Grenzland-Milieu vor Tag 20" / „Familie Gerüchte-Ökologie ruht — 4 Tage ausweichen"), Erfüllung =
  Geld (E18). Erweiterung über den statischen §8-Plan hinaus — statische Alt-Signatur-Ziele erzeugen
  kaum Varianz.
- **Beat-Nachschub 6→~18**, teils parametrisiert (themaId/Ort) — Muster-Katalog existiert.
- **Milieu-Kippen als Sprung-Ereignis** (§3 beschlossen, fehlt komplett): +3–5 Punkte auf einmal,
  dreifach inszeniert — Wohnzimmer „Parteifahne im Fenster" (Schwelle existiert:
  `FAHNE_BELIEF_SCHWELLE=0.75`), eigenes TV-Motiv (zahlt auf §7 ein), NPC-Nebensatz, dauerhaft
  umgefärbtes Skyline-Fenster. Schärfung: ein „WANKT"-Stempel macht das Kippen VORHER lesbar.
  **Warum:** Ohne Sprünge ist Läufer 1 exakt der Prozente-Grind, den §3 vermeiden wollte; Plague
  Inc. (die Prinzip-Referenz!) lebt vom Länder-Kippen als abzählbarem Ritual-Moment.

### 2.5 Die Uhr wird Akteur (#9)
`shiftElectionDay` (`StoryEngineAdapter.ts:4419`) und `requestNachspielzeit` (`:4970`) sind fertige,
tote API. Drei Trigger: (a) **Misstrauensvotum-Beat** (einmalig, hohe Polarisierung in Akt 2/3):
die Wahl rückt 3–5 Tage VOR — echtes Dilemma; (b) bei Mahnstufe ≥2 bietet Volkov per rotem Telefon
die **einmalige Nachspielzeit** (+5 Tage gegen Kürzung + höhere Zielmarke); (c) die telegrafierte
Sondersendung als Termin. **Warum:** Die Uhr ist heute ein Kilometerzähler; eine Ziellinie, die
sich EINMAL pro Partie bewegt, ist der beste Schock des Genres — und das E4-Versprechen „Termin ist
Anker, kein Korsett" ist bisher nur Doku.

---

## 3. Mensch und Moral (der Einsatz, die Kosten, die Gesichter)

### 3.1 Der Direktor hat etwas zu verlieren (#7)
(a) **Gehalt** als Ableitung der Tranchen, trockene Privat-Zeile im Tagesfazit; (b) **Post aus der
Heimat** im Papier-Kit — die Schwester konsumiert die eigene Propaganda: „Stimmt das mit den
Kliniken? Hier erzählen das alle." (der Spieler erlebt die eigene Masche von der Empfängerseite);
(c) die **Personalakte**, die die Zentrale über einen selbst führt. Dazu (d) **die Tür, die man nie
nimmt** (D-009, beschlossen 2025-12-27, nie gebaut): der Arbeitsvertrag in der Schreibtischschublade,
„Kündigung aufsetzen" — früh billig, spät teuer. **Warum:** Papers Please ist herausragend, WEIL
jeder Stempel gegen Miete/Familie gerechnet wird — und weil man jeden Tag NICHT kündigt. Ohne
Einsatz keine Komplizenschaft, ohne Ausstiegsfantasie keine Selbstbefragung („ich hätte gehen
können — und bin geblieben"). **Owner-Entscheide nötig:** D-008 (Spieler bleibt Hülle) ist
respektierbar — die Briefe charakterisieren die WELT, nicht den Avatar; aber D-009 kollidiert mit
dem Enden-Beschnitt (§12.5 hat „Gewissensentscheidung als eigenes Ende" gestrichen) → als stilles
Nicht-Ende („Zug nach Hause") oder als Epilog-Färbung vorlegen.

### 3.2 Mittäter mit Gedächtnis (#8)
Ist-Zustand verifiziert: `npcs.json` hat kein `archetype`-Feld → **alle fünf NPCs fallen auf
identische `ideologue`-Rotlinien zurück** (`StoryEngineAdapter.ts:992–1003`); die besten
geschriebenen Szenen (`getNPCCrisisDialogue` — Marinas Schlaflosigkeits-Krise mit 4 Antwortoptionen;
`getNPCGameEndDialogue`) haben **keinen Aufrufer**; an Erstbegegnung/Spielende spricht noch die
Alt-Besetzung. Paket: (a) `archetype` je Figur + eigene rote Linien + je eine GESCHRIEBENE
Verrats-Szene, die den konkreten Auslöser zitiert; (b) ~15 Akt-Szenen (je Figur × Akt) — die
40-Tage-Struktur ist das perfekte Arc-Gerüst und liegt brach; (c) die tote Gewissens-Schicht
anschließen (nach H-01-Fix auch die Konsequenz-Ketten). PR #102 (Berater-Regie) zuerst mergen —
liegt laut Review merge-reif. **Warum:** Verrat ist der einzige Moment, in dem das Spiel emotional
bestrafen kann, ohne zu belehren (E8-konform) — heute ist er ein anonymes +15-Ereignis.

### 3.3 Akte der Namen (Opfer-Kontinuität)
Die 7 benannten Zielfiguren (`targets.json`, statisches `standing`-Feld) bekommen einen
fortschreibbaren Zustand (unbehelligt → unter Druck → beschädigt → verstummt), sichtbar als grauer
Quittungs-Nachsatz, beiläufige News Tage später und „Was aus ihnen wurde"-Spalte im EndReport.
Optional ein **benannter Haushalt** im Wohnzimmer (eine wiederkehrende Familie statt Soziologie-
Segment). **Warum:** This War of Mine wirkt, weil Konsequenz im Zustand benannter Figuren sitzt
und einen WIEDER ansieht. Die geplanten E8-Nachsätze (§10) bleiben ohne Zustands-Tracking
Einmal-Gags — Wiederkehr ist der Mechanismus, nicht die Erwähnung.
**⚠️ Sensibilität:** Falls die `cons_victim_suicide`-Kette (nach H-01-Fix) reaktiviert wird, braucht
sie eine bewusste Owner-Entscheidung inkl. Umgangsform (Andeutung statt Ausspielen, ggf.
Inhaltshinweis) — für ein Bildungsspiel ist das keine Nebensache.

---

## 4. Visuelle Regie (von Möblierung zu Signature-Momenten)

### 4.1 Der Stempel-Slam (#11) — die eine Geste
Wiederverwendbare `StampSlam`-Komponente: Stempel fällt in 2–3 Frames (1.4→1.0 mit 2-px-Überschwingen),
Papier ruckt 1–2 px, Tinte sitzt minimal rotiert, `sfx_stamp` (existiert) mit Nachbeben. Einsatzorte:
FRISCH→BEKANNT→VERBRANNT-Wechsel, Verpuffungs-Quittung, der **doppelt beschlossene, unumgesetzte
VOLLZOGEN-Stempel** statt „AKTION ERFOLGREICH ✓" in Grün (`ActionFeedbackDialog.tsx:574` — der
teuerste Tonbruch des Spiels: Papers Please hat nie gratuliert), Direktiven-Unterschrift, Enden.
**Warum:** Papers Please wird als GESTE erinnert, nicht als Screen. Dieses Spiel hat eine eigene
Stempel-MECHANIK — aber keine Körperlichkeit dafür. Kleinster Aufwand, größter Identitätsgewinn.

### 4.2 Erste 60 Sekunden (#15)
(a) Ein fiktives **Westunion-Dienstsiegel** als Pixel-Asset (SYMBOLS_AUDIT-konform) ersetzt das
rote Unicode-⬢ mit CSS-Glow und wird die Bildmarke: Titel, Stempel, Briefköpfe, TV-Bauchbinde,
Ladebild. (b) Titel-Umbau bei erhaltener Key-Art: Typo-Hierarchie (der Schriftzug läuft durch die
Turm-Silhouette, die Unterzeile ersäuft), Menü als Akten-Objekte statt Web-Buttons. (c) **Laden als
Inszenierung**: „Ihre Akte wird zusammengestellt…" mit Stempel-Takt — setzt den H-02-Fix voraus
(~98 s Erststart sabotieren jede Erste-Minute-Inszenierung; siehe §7). **Warum:** Die ersten
60 Sekunden sind aktuell die schwächste Strecke — ein §4.5/§4.6-Bruch über dem besten Asset des
Projekts (Turm-Nachtbild).

### 4.3 Tafel lesbar & nie leer (#16)
Zwei harte Regeln über das (komplette) T2 hinaus: **Kontrast-Regel** — Information liegt NIE direkt
auf der Kork-Kachel (heute 10–11-px-Text in `#c9b48f` auf rauschendem Kork,
`NarrativeBoard.tsx:373–383`, live praktisch unlesbar); jede Zeile gehört auf ein Papier-Objekt.
**Nie-leer-Regel** — die Tafel öffnet an Tag 1 nicht mit drei Geister-Spuren: Tagesgeschäft ab
Minute 1 bestückt, eine vorbereitete Spur der Zentrale. Gleiche Regel für Newsroom/Broadcast
(„Erste-Session-Füllung: kein Screen darf beim ersten Öffnen leer sein"). **Warum:** Das Herzstück
PLANEN wurde gebaut, um ein Owner-Verständnisproblem zu heilen — und wirkt auf den ersten Blick
kaputt und leer. Die versprochene ≤10-Sekunden-Antwort scheitert heute an Lesbarkeit, nicht Logik.

### 4.4 Eine Materialwelt (#17)
Der größte Kohärenz-Riss: Papier-UI ohne diegetische Quelle in einer Glas-Holo-Welt; drei Dialekte.
(a) **Lore-Kitt** — EIN Kurator-Satz im Intro macht den Kontrast zum Thema statt zum Unfall:
„Digitales lässt sich leaken — Papier kann man schreddern." (historisch korrekt: reale Trollfabriken
druckten Tagesvorgaben aus; der Aktenvernichter-Prop existiert schon). (b) **Prop-Pass**: 6–10
Papier-Props (Aktenwagen, Stempelkissen, Ablagekörbe, ausgedruckte Tagesvorgaben) in die Räume.
(c) **Stil-Brücke**: Palette-/Grain-Overlay-Pass über die fein gerenderten Räume/Porträts +
Porträts in Kartei-Fenster fassen. **Warum:** „Aus einem Guss" ist laut SOUL das ERSTE
Urteilskriterium der Nutzer — und der Riss ist überwiegend Filter-/Prop-Arbeit, keine Neugenerierung.

### 4.5 Kampagne als sichtbarer Bogen (#18)
Tag 39 sieht heute exakt aus wie Tag 1. Drei Zustands-Kanäle in die bestehende Welt: **AKT** —
Flur-/Lobby-Poster wechseln je Kampagnendrittel (Keil: Ministeriums-Plakate; Zweifel:
zerrissen/übersprüht; Wahl: Wahlplakate); **ABWEHR** — Faktencheck-Plakate ÜBERKLEBEN die eigenen
bei 25/50/75; **RISIKO** — Blaulicht-Streifer in der Skyline bei Rot. Plus Abreißkalender (§5
wörtlich geplant) und die L5-Objekt-Leiste geschärft. **Warum:** „Gesellschaft zeigt sich als Bild,
nie als Balken" (E6) ist Kanon — der Spielstand braucht einen Kanal außer Zahlen hinter Taste H.
Ein Heimweg durch die Lobby, der jeden Akt anders aussieht, erzählt das Rennen gratis mit.

### 4.6 Stempel-Ikonografie (#19) + materielle Übergänge (#21)
Icon-Batch im Behörden-Duktus (~20–30 Assets): je Maschen-Familie ein Stempel-Symbol, je Milieu
Silhouette + Kennfarbe — überall, wo heute 10-px-Fließtext steht (Terminal-Karten, Tafel, Vortest
mit 16+ Textkarten, FRISCH/BEKANNT/VERBRANNT als Stempel-Reihe). **Warum:** Text-Wände sind die
konsistenteste Live-Schwäche, und die originellste Mechanik (8×18-Gedächtnis) ist als Wort-Tabelle
nicht auf einen Blick lesbar — also nicht planbar. · Übergänge: Jeder Welt→Objekt-Wechsel bekommt
eine 150–300-ms-Materialblende (Terminal = CRT-Einschalt-Sweep, Brett = Kamera-Zoom, Akte =
Aufklappen, Tagesende = Licht aus → Kalenderblatt). **Warum:** Genau an den View-Wechseln fühlt
sich das Spiel noch wie eine Web-App an; Übergänge BEWEISEN, dass Terminal und Brett im Raum stehen.

---

## 5. Klang (die billigste Exzellenz im Projekt)

Das Fundament ist ungewöhnlich professionell (EBU-R128-normalisiert, diegetische SFX, 8 Raum-Atmos,
Ducking, 3-Kanal-Mixer) — aber die Dramaturgie ist akustisch flach, und **~8 fertige, normalisierte
Assets werden nie abgespielt** (Verrat, Applaus, rotes Telefon, `sfx_amb_tvstudio`):
- **Musik hört das Rennen (#20):** Heute hängt Musik nur an risk/Krise (`musicPoolForState`).
  Zweite Achse: Abwehr-Stufen + Wahltag-Nähe + Akt — inkl. Endspurt-Eskalation (gehört zu #1).
- **Wahlabend-Klangdramaturgie:** Ambience an (5 Zeilen), Musik erst NACH dem Balken-Kipp
  (Spoiler-Fix), Studio-Atmo, Sting.
- **Verrat hat einen Klang:** der 2-Sekunden-Blackout (fertiges Asset).
- **Stempel-Semantik:** FRISCH/BEKANNT/VERBRANNT klingen verschieden (füttert #11).
- **Das TV spricht:** Audio-Spalte im §7-Broadcast-Ausbau (Jingle, Störbild-Rauschen, Krisen-Puls) —
  „Die WELT darf laut sein" macht das TV zum einzigen legitimen Emotionsträger; heute ist es stumm.

---

## 6. Onboarding, Lesbarkeit, Pädagogik (die ersten 15 Minuten und die Impf-Dosis)

- **Tag-0-Hoax live bringen (#10):** beschlossen (§10/O7), steckt in PR #94 (Review: „Tutorial
  sauber UI-only" — Reihenfolge: erst H-01-Fix, dann herauslösen). UX-Schärfung: das Hoax-Echo zeigt
  beide Läufer en miniature als animierte Mini-Balken. Dazu **Abwehr-Debüt**: die ABWEHR wird heute
  in den ersten 15 Minuten kein einziges Mal vorgestellt (Volkov-Intro nennt nur den Wahltag) — eine
  Marina-Zeile + ein TV-Beat vor dem ersten Feierabend. Und: totes/irreführendes Onboarding
  entsorgen (12-Schritte-TutorialOverlay lehrt „10 Jahre/120 Phasen" und ist zugleich unerreichbar —
  `tutorial.start()` hat 0 Aufrufer).
- **Renn-Quittung (#12):** Ergebnis-Modal, Morgenbriefing und Tagesfazit sprechen heute
  Alt-Vokabular (Gesellschafts-Deltas, RISIKO/AUFMERKSAMKEIT) — die zwei Läufer kommen in den
  meistgesehenen Screens nicht vor (grep sonntagsfrage/abwehr in `ActionFeedbackDialog` = 0).
  Oberste Zeile jeder Quittung: Abwehr-Tick mit Ursache + Einzahlungs-Pfeil auf die nächste
  Sonntagsfrage („zahlt in 3 Tagen ein ▲" — lehrt nebenbei Umfrage-Trägheit). L6 plant den
  Vokabeltausch fürs Tagesfazit bereits; das Modal ist der neue Teil.
- **„Erkannt an:"-Zeile (#13):** Auf JEDER Quittung — auch und gerade der erfolgreichen — ein
  `counter_de`-Halbsatz („Erkannt an: identische Formulierungen in 40 Konten"). **Warum:** Die
  häufigste Erfahrung der ersten Stunde (erfolgreiche frische Masche) läuft heute als Dosis ohne
  Widerlegung — die Inokulations-Forschung ist eindeutig, dass erst die Widerlegung impft. Zusammen
  mit dem VOLLZOGEN-Stempel (#11) ist das die vollständige „kühle Quittung" (E8).
- **Debriefing der Zentrale (NEU):** Der EndReport öffnet mit einer Kurator-Rückfrage als
  Abschlussformular (welche Maschen verbrannt, wo hat Prebunking Sie gestoppt) und schließt mit
  Forewarning für Partie 2 — Rechenschaft an den Auftraggeber, nie Quiz (E8/E9-konform). Dazu ein
  **prüfbares Bildungs-Gate** analog zum Sim-Gate (E11): das Lernziel hat heute kein
  Nachweis-Kriterium.
- **L8-Playtest vorziehen (#22):** Das Spiel wurde noch nie von einem Menschen gespielt, der es
  nicht gebaut hat. Protokoll: Kann ein Neuling nach Tag 1 die zwei Läufer und den Wahltag in
  eigenen Worten erklären? Tafel-Frage in ≤10 s? (Braucht Owner-Go, weil es die beschlossene
  L-Reihenfolge ändert.)

---

## 7. Blinde Flecken (Vollständigkeits-Kritik — bisher in KEINEM Plan)

1. **Spieldauer & Sitzungsstruktur:** Niemand hat definiert, wie viele Stunden eine 40-Tage-Kampagne
   dauern soll — und die Top-Konzepte (#1, #5) verdoppeln bis verdreifachen die effektive
   Partielänge. Ziel-Spieldauer + Sitzungs-Schnitte festlegen; Save/Load-Integrität (H-08/H-09) ist
   dafür Erlebnis-Voraussetzung, nicht Technik-Detail.
2. **Schwierigkeitsgrade:** Der ungelöste H-13-Konflikt („Spaß zuerst" vs. Zielbild-Bänder) wäre
   über Stufen elegant kanonisierbar (mild/normal/hart) statt wegdiskutierbar — Material liegt in
   den drei Auftrags-Signaturen.
3. **Teilbare End-Karte:** Der „Kein einziger Schuss"-Splitscreen mit echten Partie-Zahlen ist das
   perfekte Share-Asset (PNG-Export, eine Session) — organischer Marketing-Kanal UND
   Prebunking-Booster für Dritte. Kein navigator.share/Export im ganzen src.
4. **Meta-Progression / Grund für Partie 2:** Enden-Galerie, partieübergreifender Maschen-Atlas
   („welche der 18 Familien habe ich gemeistert/verbrannt?"), keil/zweifel als NG+-Kampagnen (§8
   deutet es an). Heute gibt es keinen Anlass, Partie 2 zu starten — trotz Plague-Inc-Referenz.
5. **EN-Lokalisierung:** Datenlage halb zweisprachig und unbeaufsichtigt verrottend
   (`narrative_en` fehlt bei 78/80 Aktionen); kein i18n-Layer. Entscheid: pflegen oder streichen.
6. **Barrierefreiheit + Mobile/Tablet:** Skalierbare Schrift (die eigene Diagnose ist „10-px-Text
   unlesbar"!), farbfehlsicht-feste Zustandsfarben, Tastatur-Vollbedienbarkeit; Touch = 0 Treffer im
   Code. Mindestens als bewusster Owner-Entscheid (ja/nein/später) dokumentieren.
7. **Performance hat keinen Besitzer:** H-02 (204 MB / ~98 s) wird von vier Konzepten als
   Voraussetzung zitiert und von allen delegiert. Als EIN Erlebnis-Deliverable führen: Byte-Budget,
   kontextabhängiger Preload, <15 s Erststart als Abnahmekriterium.
8. **Titel & Außen-Framing:** Das Spiel heißt im Titel „OPERATION: WESTUNION", das Projekt
   „Desinformation Network" — Namens- und Pitch-Entscheid (Täter-Perspektive als Hook) fehlt; ebenso
   Demo-/Release-Strategie (itch/Steam/Web, Trailer, Store-Text).
9. **Musik-Dramaturgie des 40-Tage-Bogens** (siehe #20) und **H-12** (verwaiste Loops trotz
   Sound=AUS) als hörbarer Qualitätskiller.

---

## 8. Anstehende Owner-Entscheide (gesammelt)

| # | Entscheid | Kontext |
|---|---|---|
| O-A | **Sieg am Wahltag** (Empfehlung aller Juroren: JA, mit „IN FÜHRUNG"-Zustand) | H-14, §2.1 |
| O-B | Broadcast-Routing Masche-Vorrang vs. Kanal-Format (sonst 2/17 Motive tot) | PR #101 |
| O-C | Gegen-Karten + benanntes Verteidiger-Ensemble (dehnt §7 „kein Gesicht" kontrolliert) | §2.3 |
| O-D | Eigene Akte/Briefe (D-008-Verträglichkeit) + Ausstiegs-Tür (D-009 vs. Enden-Beschnitt) | §3.1 |
| O-E | Budget-Freigaben: Paket A Wahlstudio (~1,10 $), Dienstsiegel, Prop-Pass, Icon-Batch (~3–5 $) | §4 |
| O-F | L8-Playtest vorziehen (ändert bindende Plan-Reihenfolge) | §6 |
| O-G | Schwierigkeitsgrade als H-13-Auflösung · Ziel-Spieldauer · Titel/Framing · EN ja/nein | §7 |
| O-H | Umgang mit `cons_victim_suicide` bei Reaktivierung (Sensibilität) | §3.3 |

---

## 9. Empfohlene Reihenfolge

**Paket 1 — Fundament (Owner-Entscheide + Technik-Voraussetzungen):** O-A entscheiden · H-01-Fix +
EINE Rekalibrierung · H-02 als Erlebnis-Deliverable (<15 s) · PR-Halde nach Review-§6-Reihenfolge
(#105 → #99 → #102 → #104 → #101 mit O-B).
**Paket 2 — Die Ränder:** Erste 15 Minuten (#10, #15, #16) + Das Finale (#2, Wahlabend-Klang).
**Paket 3 — Das Rennen spürbar machen:** #1 (Wahltag-Sieg + Endspurt) · #12 (Renn-Quittung) ·
#4 (Lärm-Vorschau) · #6 (Milieu-Kippen) · #11/#13 (VOLLZOGEN + Erkannt-an).
**Paket 4 — Gegner & Mitte:** #3 (Gegen-Karten/Ensemble) · #5 (Direktiven + Beats) · #9 (Uhr).
**Paket 5 — Mensch & Moral:** #8 (NPC-Bögen) · #7 (Akte/Tür) · Akte der Namen.
**Paket 6 — Kohärenz-Kür:** #17 (Materialwelt) · #18 (Kampagnen-Bogen) · #19 (Ikonografie) ·
#21 (Übergänge) · #20 (Musik-Achse).
**Quer:** #22 Playtest so früh wie möglich (nach Paket 2); Blinde Flecken §7 je als Owner-Vorlage.

---

## 10. Methodik & Belege

Alle Ist-Behauptungen wurden adversarial gegengeprüft (Datei:Zeile-Verifikation, greps, eigene
Läufe); Status-Spalten („beschlossen/geplant/neu") tragen Fundstellen aus DECISIONS/ZIELBILD/PLAN/
KONZEPT/STATUS. Der Live-Eindruck stammt aus einem echten Build dieser Session (npm install →
dev-Server → Playwright-Ernte über Titel, Ankunft, Büro, Gebäude, Terminal, Tafel, Lagebild,
Briefing/Fazit, Beats, Newsroom, Fokusgruppe, Operations-Akte, drei Wahlabend-Enden, EndReport).
Kern-Belege der visuellen Urteile: `title.png` (Typo durch Turm, ⬢, Web-Buttons), `board_direct.png`
(Text auf Kork-Rauschen, Geister-Spuren), `end_victory_wahlabend_s2.png` (~90 % Leerfläche),
`terminal_vorgaenge.png` (Referenz-Niveau — so gut kann das ganze Spiel aussehen).
