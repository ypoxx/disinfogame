# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „panels-1von2"

**Modell:** `stealth/ox-alpha` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-21
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-21T16:57:37.470Z · **Dauer:** 349.6 s
**Nutzung:** 14.608 Prompt + 10.039 Antwort Tokens · **Kosten:** $0.00 (gratis) · **Anbieter-Datensammlung:** ausgeschlossen (deny)

> ⚠️ **Wie das zu lesen ist:** Ein *fremdes* Modell hat einen **kuratierten Ausschnitt**
> des Projekts gesehen — nicht das laufende Spiel und nicht das ganze Repository. Es kann
> daher weder Laufzeitverhalten prüfen noch `file:line`-Belege verifizieren. Befunde sind
> **Hypothesen**, die vor dem Umsetzen am Code/an den Daten gegenzuprüfen sind. Die
> kanonische Wahrheit bleibt [`docs/VISION_LOCK.md`](../VISION_LOCK.md) bzw. die Spieldaten.

## Gestellte Frage

Sieh dir die beigefügten Screenshots des laufenden Spiels an und mache einen UX/UI-Durchgang. Die Optik soll eine Behörden-/Papierwelt sein (Stil-Anker und Farbtoken liegen bei). Sag mir: Wo führt das Bild den Blick falsch, welche Grafiken sitzen an der falschen Stelle oder in der falschen Größe, wo stimmen Abstände und Ausrichtung nicht, und welche drei Änderungen bringen am meisten? Sei so konkret, dass man es direkt umsetzen kann.

## Dieser Durchgang: Bündel „panels-1von2" (7 Screenshots)

Das siehst du, in dieser Reihenfolge:
- floor_directory.png — Etagen-Tableau (Fahrstuhl-Navigation, Taste F)
- terminal_vorgaenge.png — Vorgangs-Terminal (L2): kuratierte Tür-Auswahl mit M1-Vorgangsblättern (Wirkung/Preis/Frische-Stempel)
- terminal_archiv.png — Vorgangs-Terminal (L2): ARCHIV-Schublade mit Filter-/Such-/Porträt-Zeile (voller Katalog)
- panel_news.png — Seiten-Panel: Nachrichten
- panel_stats.png — Seiten-Panel: Statistiken/Gesellschaft
- panel_npcs.png — Seiten-Panel: Kontakte/NPCs
- panel_mission.png — Seiten-Panel: Auftrag/Mission

Beurteile **nur diese** Aufnahmen, dafür gründlich. Andere Teile des Spiels kommen in
eigenen Durchgängen dran — verweise nicht auf Dinge, die du hier nicht siehst.

## Gezeigter Ausschnitt

15.047 Zeichen ≈ 4.180 Tokens (geschätzt) aus 3 Quellen · 1 gekürzt

| Quelle | Modus | Zeichen | Status |
|---|---|---:|---|
| `sprite-tool/public/context/game-style-guide.md` | voll | 5.496 | vollständig |
| `desinformation-network/src/story-mode/theme.ts` | voll | 3.375 | vollständig |
| `desinformation-network/runs/visual-review/latest/manifest.json` | projektion | 6.176 | gekürzt |

### Gezeigtes Anschauungsmaterial (7 Screenshot(s))

| Art | Im Text genannt als | Datei | Größe |
|---|---|---|---:|
| 🖼 Bild | `floor_directory.png` | `desinformation-network/runs/visual-review/latest/shots/floor_directory.png` | 516 kB |
| 🖼 Bild | `terminal_vorgaenge.png` | `desinformation-network/runs/visual-review/latest/shots/terminal_vorgaenge.png` | 185 kB |
| 🖼 Bild | `terminal_archiv.png` | `desinformation-network/runs/visual-review/latest/shots/terminal_archiv.png` | 192 kB |
| 🖼 Bild | `panel_news.png` | `desinformation-network/runs/visual-review/latest/shots/panel_news.png` | 319 kB |
| 🖼 Bild | `panel_stats.png` | `desinformation-network/runs/visual-review/latest/shots/panel_stats.png` | 334 kB |
| 🖼 Bild | `panel_npcs.png` | `desinformation-network/runs/visual-review/latest/shots/panel_npcs.png` | 331 kB |
| 🖼 Bild | `panel_mission.png` | `desinformation-network/runs/visual-review/latest/shots/panel_mission.png` | 354 kB |

---

## Antwort des Modells

# UX/UI-Durchgang — Bündel `panels-1von2` (7 Screenshots)

## 1. Erster Eindruck

**floor_directory.png** — Das Auge landet zuerst auf dem Papier-Modal in der Bildmitte, das ist richtig. Aber der zweite Blick geht nicht in die Liste, sondern an die rechte Bildkante: Dort wird eine vertikale Reihe kleiner Tasten-Kacheln (K/M/A/K/I) vom Rand abgeschnitten — das wirkt wie ein Renderfehler und stiehlt der Liste Aufmerksamkeit. Innerhalb des Modals bleibt der Blick unorientiert: Alle neun Einträge und fünf Gruppenköpfe haben denselben Zeilenrhythmus, nichts sagt „du bist hier". Genau diese Information (Zeile 7, rote Kante) ist der leiseste Marker im ganzen Bild.

**terminal_vorgaenge.png** — Der Blick springt zuerst auf die beiden großen, gelb gerahmten Karten — zu Recht, das sind die Hauptobjekte. Aber er bleibt nicht bei einem Inhalt hängen: Die beiden Karten sind inhaltlich parallel gebaut, ihre Aktionsknöpfe stehen jedoch auf unterschiedlichen Höhen (rechts höher, weil weniger Text), und die FRISCH-Stempelzeilen umbrechen unterschiedlich. Dazu kommt eine Weltbruch-Stimmung: CRT-grüner Schirm-Chrom außen, Creme-Papierkarten innen — zwei Materialmetaphern kämpfen um dasselbe Panel. Unten werden zwei weitere Karten ohne jeden Scroll-Hinweis enthauptet.

**terminal_archiv.png** — Gleicher Eindruck wie `terminal_vorgaenge.png`, plus zwei neue Filterzeilen, die zu nah beieinander kleben und mit den Tabs oben eine dreistufige Filterlandschaft bilden, deren Hierarchie unklar ist (Tabs → Status-Chips → Zuträger). Das Suchfeld zieht sich mit viel Leerraum bis zum rechten Rand, während die Chips links gedrängt sitzen. Die Zuträger-Porträts zeigen keinen erkennbaren Auswahlzustand.

**panel_news.png** — Das Bild zeigt *nicht* das Nachrichten-Panel, sondern ein Entscheidungsmodal („Die reale Vorlage"), das die Bildmitte besetzt. Vom eigentlichen Panel ist rechts ein dunkler, ca. 250 px schmaler Streifen übrig, in dem nur „…RICHTEN-FEED" und „Keine Nachrichten vorhanden." lesbar sind. Der Blick geht zum roten Modal-Kopf — korrekt — aber der angepeilte Inhalt (Nachrichten) ist schlicht nicht da. Entweder layering-Fehler im Spiel oder Ernte-Fehler; beides muss geklärt werden (siehe Punkt 7).

**panel_stats.png** — Dasselbe Modal, unverändert. Rechts schaut ein Statistik-Panel heraus: große Zahlen (2 / 38 / 5/5), Abschnitt „RESSOURCEN" mit Budget-/Kapazitätsbalken, „HAUPTZIELE". Die Zahlen sind die interessantesten Elemente am rechten Rand — aber gedimmt und angeschnitten. Innerhalb des Modals fällt auf, dass Option C unten von der Fußleiste „Keine Option ist überall die beste…" halb überdeckt wird.

**panel_npcs.png** — Wieder dasselbe Modal. Der rechte Streifen zeigt eine Kontaktliste (Volkov, Petrova, Petrov, Orlova, Smirnov) als reine Textzeilen mit Statuswort — keine Porträts, obwohl genau die im `terminal_archiv.png` existieren und diese Liste tragen würden. Als eigenständiges Panel wäre das nicht bewertbar; als Ausschnitt wirkt es leer.

**panel_mission.png** — Wieder dasselbe Modal. Rechts: „OPERATION: WESTUNION" in Rot, ein Hexagon-Icon darüber, Phasen-Badge „TAG 2 / WAHL IN 38 TAGEN", Auftragstext. Der rote Operationstitel ist der stärkste Anker im Streifen — aber das Hexagon schwebt zentriert über nichts, ohne Bezugskante zum Text.

## 2. Konkrete Eingriffe je Screen

**floor_directory.png**
- Gruppenköpfe („ETAGE 4 – SPEZIAL-OPERATIONEN" usw.) → 1,5-fachen Innenabstand *über* jedem Gruppenkopf, halben Zeilenabstand *darunter*, Ton von textMuted auf textSecondary → derzeit unterscheidet sich der Gruppenkopf kaum von einem Eintrag, die Gruppierung ist nur beim zweiten Blick lesbar.
- Zeile 7 „Direktor / Zentrale · Kurator" (aktuelle Position) → roten linken Balken auf volle Reihenhöhe verbreitern (ca. 4–6 px statt des jetzigen Schlitzes), Reihenfläche zusätzlich mit lightConcrete tönen und das „◂ HIER" aus dem Gruppenkopf als kleines Badge rechts *in* die Zeile versetzen → der wichtigste Zustand des Modals ist currently der schwächste.
- Hintergrund (Gebäudequerschnitt + Skyline) → Dunkel-Overlay mit ~40–50 % Deckkraft in `background` hinter das Modal legen → die hellen Fensterflächen rechts vibrieren gegen die helle Papierkante des Modals.
- Rechte Bildschirmkante, Tasten-Kacheln K/M/A/K/I → entweder komplett ins Bild holen (Breite der Kacheln + 16 px Rand) oder entfernen → halbierte Elemente lesen sich als Bug, nicht als Feature.
- Fußzeilen-Hinweis („↑↓ wählen · Enter betreten · 1–9 direkt · Esc schließen") → Trennlinie in borderLight darüber, 8–10 px Innenabstand oben und unten, linksbündig zur Liste ausrichten → er klebt optisch an der Rahmenkante.
- Nummern-Kästchen 1–9 → einheitlich quadratisch behalten, aber vertikaler Abstand zwischen Gruppen auf ~2× den Zeilenabstand innerhalb einer Gruppe → atmende Blöcke statt gleichförmigem Nietenraster.

**terminal_vorgaenge.png**
- Aktionsknöpfe AUSFÜHREN / ANHEFTEN → beide Karten als Flex-Spalten mit Buttonpaar am Fuß verankern (`margin-top: auto`) → die Knöpfe beider Karten liegen dann auf einer gemeinsamen Baseline; derzeit steht der rechte Knopf deutlich höher.
- FRISCH-Stempel-Chips → feste Chip-Mindestbreite und Umbruch nur nach kompletter Reihe → links umbrochene Reihe („DIE VERUNSICHERTE MITTE") beginnt auf anderer Höhe als rechts; Stempelzeilen sollen kartengleich ausgerichtet sein.
- Gelbe Kartenrahmen (amber) → auf `border` (Braun) zurücknehmen, Amber nur für den kleinen Marker nach dem Kartentitel behalten → §4.7 will Warn-Gelb sparsam; vier dicke gelbe Rahmen im ersten Bildschirm sind Amber-Inflation und konkurrieren mit Rot als Bedeutungsfarbe.
- Untere Kartenkante („Fake-Account-Farm", „Meme-Serie erstellen" abgeschnitten) → Scrollleiste einblenden oder abgeschnittene Karte mit Verlaufsmaske + Zähler („▼ 6 weitere") markieren → ohne Affordance wirkt der Schnitt wie Layoutbruch.
- Ressourcenleiste unten (150K / 5 / 5 AP / ANGEHEFTET: 0) → Icon-Wert-Paare auf festes Raster (gleichmäßige Spaltenbreite, 24 px Zwischenraum), „ANGEHEFTET: 0" als Gruppe nach rechts neben „SYSTEM BEREIT" → aktuell kleben die Paare unterschiedlich eng und die Leiste hat keine innere Struktur.
- Unterleiste: Hinter der Ressourcenleiste schimmert der Ticker („STANDBY MINIST…") → zwei Fußzeilen übereinander vermeiden: Terminal-Fußleiste entweder über dem Ticker enden lassen oder Ticker im Terminal-Screen ausblenden.

**terminal_archiv.png**
- Filterreihe (ALLE/LEGAL/GRAUZONE/ILLEGAL/NEU + Suchfeld) → Suchfeld auf ~40 % der Zeilenbreite begrenzen und rechtsbündig abschließen, Chips linksbündig → jetzt dehnt sich das Eingabefeld über die Hälfte der Breite mit totem Leerraum.
- ZUTRÄGER-Porträtreihe → aktiven Zuträger mit 2-px-Rahmen in tech/agencyBlue + hellerem Namen markieren; Porträtkacheln auf einheitliche Größe mit 8 px Abstand → momentan ist kein Auswahlzustand ablesbar und die Kacheln schwanken leicht in Tonhöhe.
- Abstand zwischen Chip-Reihe und Zuträger-Reihe → 12–16 px Vertikalabstand plus Trennlinie in borderLight → beide Reihen verschmelzen derzeit zu einer Filtermasse.
- Tab-Zähler „ARCHIV (80)" → Zählerzahl in textMuted statt in der aktiven Akzentfarbe → Zahl und Label haben unterschiedliche Bedeutung und sollen das auch farblich zeigen.
- Button-Baseline der beiden Karten → wie bei `terminal_vorgaenge.png` auf gemeinsame Höhe bringen (gleiche Ursache, gleiche Fix).

**panel_news.png**
- Layering Panel ↔ Entscheidungsmodal → klären, ob das Panel während eines modalen Beats überhaupt aufrufbar sein soll; wenn ja, darf das Modal das Panel nicht dimmen+verdecken — wenn nein, Hotspot sperren. Der sichtbare Zustand (Panel als dunkler Reststreifen) ist in keiner Lesart akzeptabel.
- Doppeltes Leerzustands-Textfragment „Keine Nachrichten vorhanden." (einmal im Panelstreifen Mitte rechts, einmal unten rechts am Ticker) → auf eine Instanz reduzieren → Duplikate auf engem Raum lesen sich als Fehler.
- Modal, Option C → Scrollbereich so bemessen, dass die Optionskarte vollständig unterhalb der Fußleiste Platz hat (Fußleiste außerhalb des Scrollcontainers fixieren) → Option C ist aktuell zwischen Karte und Fußleiste enthauptet.

**panel_stats.png**
- Kopfbereich des Statistik-Panels (2 TAG / 38 BIS ZUR WAHL / 5/5 AP) → Zahl groß, Einheitenlabel in fester Zeile *unter* der Zahl, linksbündig zur Zahl ausrichten → die Labels hängen derzeit auf unterschiedlicher Baseline neben den Ziffern.
- Fortschrittsbalken (Budget 150K, Kapazität 7) → Max-Markierung/Skalenende am Balkenende ergänzen → ohne Referenzwert sagt die Balkenlänge nichts.
- Abschnittstitel (RESSOURCEN, HAUPTZIELE) → Kontrast des gedimmten Rot auf Dunkelgrund prüfen; mindestens textSecondary-Niveau → aktuell müssen Titel erraten werden.

**panel_npcs.png**
- Kontaktzeilen → Porträtkacheln (gleiche Assets wie die ZUTRÄGER-Reihe im `terminal_archiv.png`) links vor den Namen setzen → reine Textlisten tragen eine Kontaktliste nicht; die Assets existieren bereits.
- Statuswort (Neutral/Skizziert) → festes rechtsbündiges Tabstop-Feld pro Zeile statt freischwebend hinter dem Namen → die Statuswörter beginnenCurrently auf unregelmäßigen x-Positionen.
- Ganz rechts abgeschnittener Zustandsbalken → Panelbreite so wählen, dass die rechte Spalte im sichtbaren Bereich endet oder klar weitergescrollt wird.

**panel_mission.png**
- Hexagon-Icon über „OPERATION: WESTUNION" → linksbündig zur Titel-Textkante setzen, Größe ≈ 1,5× Zeilenhöhe des Titels → das zentriert schwebende Icon hat keine Bezugs­kante und wirkt wie Deko-Rauschen.
- Phasen-Badge „TAG 2 / WAHL IN 38 TAGEN" → rechtsbündig mit dem Textblock der darunterliegenden Phase abschließen, nicht mit der Panelkante → Badge und Text gehören semantisch zusammen, sind aber optisch entkoppelt.
- Roter Operationstitel → als einziger Rot-Akzent des Panels behalten, umgebende gedimmte rote Linien entschärfen → Rot soll knappen Reservestatus behalten (§4.7).

## 3. Grafiken / Assets

**Tragen:** Die Papier-Vorgangskarten im Terminal (Scanlines, Stempel-Chips „FRISCH", ILLEGAL-Marker) sind die stimmigste Asset-Gruppe — sie erzählen die Aktenwelt ohne Worte. Die Porträt-Kacheln in der ZUTRÄGER-Reihe (`terminal_archiv.png`) funktionieren im Prinzip, sind aber an der Grenze der Lesbarkeit.

**Fremd/widersprüchlich:**
- **Terminal-Chrom:** Laut `desinformation-network/src/story-mode/theme.ts` ist die UI „aus PAPIER", Tech-Töne sind Petrol (`tech: '#275F6B'`). Das Terminal nutzt ein gelbgrünes CRT-Grün, das weder `tech` noch `success` entspricht — es driftet zurück in die v2-Monitorwelt. Entscheidung nötig: entweder Terminal bewusst als Bildschirm-Exception definieren (dann auf `tech`-Petrol oder ein dokumentiertes CRT-Grün festlegen) oder in die Papierwelt ziehen. So ist es ein dritter Stil.
- **Amber-Rahmen:** Vier dicke gelbe Kartenrahmen in `terminal_vorgaenge.png`/`terminal_archiv.png` widersprechen „Warn-Gelb sparsam" (§4.7 im theme.ts-Kommentar). Falsche *Verwendung*, nicht falsches Asset.
- **Gebäude-Hintergrund in `floor_directory.png`:** Wirkt weicher/unschärfer skaliert als die scharfkantige UI-Ebene davor — entweder Auflösungsproblem oder nicht-integer Skalierung; Kanten sollten zur Pixel-UI passen.
- **Porträt-Kacheln:** Uneinheitliche Hintergrundhelligkeit pro Kachel, Zuschnitt variiert leicht; auf einheitlichen Ausschnitt + gemeinsame Grundfläche normalisieren.

**Falsch skaliert/beschnitten:** Die Tasten-Kacheln am rechten Rand von `floor_directory.png` (halbiert); Option C im Modal aller vier Panel-Shots (von der Fußleiste überdeckt); Panelinhalte rechts (durchs Modal beschnitten).

**Fehlt und würde am meisten bringen:** (a) Scroll-Affordance im Terminal-Kartenstrom, (b) Porträts im NPC-Panel, (c) ein sichtbarer Auswahl-/Aktiv-Zustand für Zuträger-Filter und Listenzeilen.

## 4. Raster & Rhythmus

- **Terminal (beide):** Das Zweispalten-Grid der Karten ist sauber. Unruhe entsteht *innerhalb* der Karten: Die Sektionen (Titel / Beschreibung / Chips / NPC-Vorteil / AUSWIRKUNG / Buttons) haben ungleiche Vertikalabstände, und die Fußbereiche beider Karten sind nicht fluchtend. Eine feste Sektionsabstands-Skala (z. B. 8/16/24) würde beide Karten synchronisieren.
- **Terminal-Archiv:** Drei Filterebenen (Tabs, Chips+Suche, Zuträger) mit zu geringem Abstand stapeln sich → eine Filterzone mit interner Gliederung statt drei konkurrierenden Reihen.
- **floor_directory:** Gleichförmiges Nietenraster ohne Gruppenatmung (siehe Punkt 2). Keine tote Fläche, aber auch keine Hierarchie.
- **Panel-Shots:** Das Modal erzeugt links eine große dunkle, funktionslose Zone (das Büro-Hintergrundbild trägt nichts), rechts einen gequälten Reststreifen. Die Aufteilung „Modal mittig + Panel rechts" funktioniert nur, wenn das Panel sichtbar bleibt — aktuell ist die Bildteilung 60 % Modal / 20 % toter Hintergrund / 20 % Panelrest.
- **Ticker:** Läuft als Konstante durch alle sieben Screens — guter Anker. Nur im Terminal kollidiert er mit der Ressourcenleiste (zwei Fußzeilen).

## 5. Lesbarkeit

Zweimal hingesehen musste ich an:
- **floor_directory.png:** Gruppenköpfe in Kleinkapitälchen — zu klein, zu niedrig kontrastig gegen Papier. Auch der Fußzeilen-Hinweis liegt an der Untergrenze.
- **terminal_vorgaenge.png / terminal_archiv.png:** Die kursive Fußnote „Höhere Beziehung = größerer Rabatt (max. 30%)" flimmert auf den Scanlines; Kursiv + Scanline-Textur addieren sich negativ. Die Risiko-Zeile „Risiko +5% · Konsequenz wahrscheinlich · 1 NPC-Bonus" trennt ihre drei Angaben nur über Farbe (rot/rot/oliv) ohne Separator — ich habe zweimal parse müssen.
- **Alle vier Panel-Shots:** Die Mini-Statistikspalten „+4% Risiko / +4% Aufmerksamkeit" in den Optionskarten haben keine Spaltenüberschriften — die Zuordnung läuft nur über Position, und die beiden Wertepaare verschiedener Optionen sind nicht vertikal fluchtend (A/B/C unterschiedlich breite Titelpush). Option C ist zudem physisch von der Fußleiste überdeckt — deren Text „Keine Option ist überall die beste" ist lesbar, die Karte dahinter nicht.
- **panel_stats.png (Streifen):** Zahl/Einheit-Paare auf uneinheitlichen Baselines; Balken ohne Skalenende sind wertlos interpretierbar.

Positiv verifiziert: Tinte-auf-Papier-Kontraste im Modal und in den Vorgangskarten halten AA-Niveau; die Rot-Verwendung im Modal-Kopfband entspricht der Token-Disziplin.

## 6. Die drei wirksamsten Änderungen

1. **Terminal-Karten: Aktionsknöpfe und Stempelzeilen auf gemeinsame Baseline bringen** (`terminal_vorgaenge.png`, `terminal_archiv.png`) — Flex-Spalten mit `margin-top: auto` fürs Buttonpaar, feste Chip-Reihen. Geringer Aufwand (reines Layout), aber er beseitigt die größte Unruhe der beiden informationsdichtesten Screens und macht die Karten vergleichbar — das ist der Kernnutzen dieses Terminals.
2. **Scroll-Affordance im Terminal + Option C im Modal aus der Überdeckung lösen** — Scrollleiste bzw. Verlaufsmaske mit Zähler am Kartenstrom, Fußleiste des Entscheidungsmodals außerhalb des Scrollcontainers fixieren. Beides sind abgeschnittene Inhalte, also direkte Funktionsverluste, nicht nur Schönheitsfehler; der Fix ist jeweils trivial.
3. **floor_directory: Gruppenrhythmus + HIER-Marker verstärken** — Gruppenabstand 2× Zeilenabstand, Gruppenköpfe in textSecondary, aktuelle Zeile mit vollem rotem Balken + Tönung + Badge. Das Modal ist die Hauptnavigation des Gebäudes; dass seine wichtigste Information (Wo bin ich?) der schwächste Marker im Bild ist, ist der teuerste Hierarchiefehler des Bündels.

Nicht in den Top 3, aber sofort klären: das Layering-Problem der vier Panel-Shots (Punkt 7) — falls es ein echtes Spielproblem ist, gehört es vor alles andere.

## 7. Blinde Flecken

- **Die vier Panel-Shots zeigen das Panel nicht.** `panel_news`, `panel_stats`, `panel_npcs`, `panel_mission` sind praktisch derselbe Screenshot mit anderem Reststreifen. Ich brauche Neu-Ernten *ohne* das Entscheidungsmodal — sonst war das gesamte Seiten-Panel-System nicht bewertbar. (Das Manifest listet außerdem `panel_events` und `hud_on` im selben Bundle; beide waren in dieser Lieferung nicht enthalten.)
- **Hover/Fokus/Zustände:** Keine der Aufnahmen zeigt Hover auf Listenzeilen, Tabs, Filter-Chips oder Optionskarten; Fokus-Ringe bei Tastaturbedienung (das Modal wirbt mit Pfeiltasten!) sind unsichtbar.
- **Scrollverhalten:** Ob der Terminal-Kartenstrom und das Entscheidungsmodal smooth scrollen, Snap-Punkte haben oder hart clippen, ist aus Standbildern nicht ableitbar.
- **Semantik ungeklärter Marker:** Der kleine gelbe Punkt nach den Kartentiteln („Bot-Netzwerk aufbauen ▪") — Neustatus? Frische-Warnung? Ohne Zweitzustand (z. B. nach Ausführung) nicht deutbar.
- **Zuträger-Filter:** Kein Shot zeigt einen *gewählten* Zuträger — der Aktiv-Zustand, nach dem ich die Reihe beurteilt habe, fehlt im Material.
- **Animation:** Stempel-Animation beim AUSFÜHREN, Ticker-Lauf, Cursor-Blinken im Suchfeld, Idle der Porträts — alles Bewegung, die nur im Live-Build prüfbar ist.
- **Auflösung:** Die Porträt-Kacheln und die Tasten-Kacheln sitzen an der Grenze ihrer Pixelauflösung; ein 2×-Ausschnitt würde zeigen, ob sie unscharf skaliert oder nativ scharf sind.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
