# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „ending-3von4"

**Modell:** `stealth/ox-alpha` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-21
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-21T16:57:37.470Z · **Dauer:** 356.2 s
**Nutzung:** 18.372 Prompt + 8.672 Antwort Tokens · **Kosten:** $0.00 (gratis) · **Anbieter-Datensammlung:** ausgeschlossen (deny)

> ⚠️ **Wie das zu lesen ist:** Ein *fremdes* Modell hat einen **kuratierten Ausschnitt**
> des Projekts gesehen — nicht das laufende Spiel und nicht das ganze Repository. Es kann
> daher weder Laufzeitverhalten prüfen noch `file:line`-Belege verifizieren. Befunde sind
> **Hypothesen**, die vor dem Umsetzen am Code/an den Daten gegenzuprüfen sind. Die
> kanonische Wahrheit bleibt [`docs/VISION_LOCK.md`](../VISION_LOCK.md) bzw. die Spieldaten.

## Gestellte Frage

Sieh dir die beigefügten Screenshots des laufenden Spiels an und mache einen UX/UI-Durchgang. Die Optik soll eine Behörden-/Papierwelt sein (Stil-Anker und Farbtoken liegen bei). Sag mir: Wo führt das Bild den Blick falsch, welche Grafiken sitzen an der falschen Stelle oder in der falschen Größe, wo stimmen Abstände und Ausrichtung nicht, und welche drei Änderungen bringen am meisten? Sei so konkret, dass man es direkt umsetzen kann.

## Dieser Durchgang: Bündel „ending-3von4" (10 Screenshots)

Das siehst du, in dieser Reihenfolge:
- end_victory_gameend.png — GameEndScreen (victory)
- end_victory_endreport_top.png — End-Report (victory), Anfang: „Das Rennen"-Kurven
- end_victory_endreport_mid.png — End-Report (victory), Mitte: Methoden-Atlas/Bilanz
- end_victory_endreport_bottom.png — End-Report (victory), Ende: Gegenmaßnahmen/Debrief
- fixture_wahlabend_victory_s0.png — Wahlabend-Fixture (victory): Titelkarte
- fixture_wahlabend_victory_s1.png — Wahlabend-Fixture (victory): Schritt 1 (Hochrechnung/Sondersendung)
- fixture_wahlabend_victory_s2.png — Wahlabend-Fixture (victory): Schritt 2 (Ergebnis/Stempel)
- fixture_wahlabend_victory_s3.png — Wahlabend-Fixture (victory): Schritt 3 (Wohnzimmer-Schnitt + Nachsatz)
- fixture_wahlabend_timeout_s0.png — Wahlabend-Fixture (timeout): Titelkarte
- fixture_wahlabend_timeout_s1.png — Wahlabend-Fixture (timeout): Schritt 1 (Hochrechnung/Sondersendung)

Beurteile **nur diese** Aufnahmen, dafür gründlich. Andere Teile des Spiels kommen in
eigenen Durchgängen dran — verweise nicht auf Dinge, die du hier nicht siehst.

## Gezeigter Ausschnitt

15.047 Zeichen ≈ 4.180 Tokens (geschätzt) aus 3 Quellen · 1 gekürzt

| Quelle | Modus | Zeichen | Status |
|---|---|---:|---|
| `sprite-tool/public/context/game-style-guide.md` | voll | 5.496 | vollständig |
| `desinformation-network/src/story-mode/theme.ts` | voll | 3.375 | vollständig |
| `desinformation-network/runs/visual-review/latest/manifest.json` | projektion | 6.176 | gekürzt |

### Gezeigtes Anschauungsmaterial (10 Screenshot(s))

| Art | Im Text genannt als | Datei | Größe |
|---|---|---|---:|
| 🖼 Bild | `end_victory_gameend.png` | `desinformation-network/runs/visual-review/latest/shots/end_victory_gameend.png` | 66 kB |
| 🖼 Bild | `end_victory_endreport_top.png` | `desinformation-network/runs/visual-review/latest/shots/end_victory_endreport_top.png` | 66 kB |
| 🖼 Bild | `end_victory_endreport_mid.png` | `desinformation-network/runs/visual-review/latest/shots/end_victory_endreport_mid.png` | 97 kB |
| 🖼 Bild | `end_victory_endreport_bottom.png` | `desinformation-network/runs/visual-review/latest/shots/end_victory_endreport_bottom.png` | 97 kB |
| 🖼 Bild | `fixture_wahlabend_victory_s0.png` | `desinformation-network/runs/visual-review/latest/shots/fixture_wahlabend_victory_s0.png` | 178 kB |
| 🖼 Bild | `fixture_wahlabend_victory_s1.png` | `desinformation-network/runs/visual-review/latest/shots/fixture_wahlabend_victory_s1.png` | 128 kB |
| 🖼 Bild | `fixture_wahlabend_victory_s2.png` | `desinformation-network/runs/visual-review/latest/shots/fixture_wahlabend_victory_s2.png` | 128 kB |
| 🖼 Bild | `fixture_wahlabend_victory_s3.png` | `desinformation-network/runs/visual-review/latest/shots/fixture_wahlabend_victory_s3.png` | 152 kB |
| 🖼 Bild | `fixture_wahlabend_timeout_s0.png` | `desinformation-network/runs/visual-review/latest/shots/fixture_wahlabend_timeout_s0.png` | 178 kB |
| 🖼 Bild | `fixture_wahlabend_timeout_s1.png` | `desinformation-network/runs/visual-review/latest/shots/fixture_wahlabend_timeout_s1.png` | 128 kB |

---

## Antwort des Modells

# UX/UI-Durchgang: Bündel „ending-3von4"

**Vorbemerkung zur Ernte:** `end_victory_gameend.png` und `end_victory_endreport_top.png` sind **bildidentisch**, ebenso `end_victory_endreport_mid.png` und `end_victory_endreport_bottom.png`. Die im Durchgangs-Text angekündigten Abschnitte „Methoden-Atlas/Bilanz" und „Gegenmaßnahmen/Debrief" sind auf keinen der zehn Bilder zu sehen. Ich beurteile die vier tatsächlich vorhandenen Motive (Report oben, Report unten, Fixture-Titelkarte, Fixture-TV-Schritte) und markiere die Duplikate als Ernte-Fehler.

---

## 1. Erster Eindruck

**`end_victory_gameend.png`**
Das Auge landet zuerst auf dem braunen Kopfbalken mit „Die Mehrheit, gemacht" — das ist korrekt, hier soll es hin. Danach springt es aber sofort unten rechts auf den dunkelroten Flächentext „VOLLSTÄNDIGER LAGEBERICHT →", weil er als einziger warm gesättigter Fleck auf reinem Schwarz liegt und zudem über die rechte Panel-Kante hinausragt. Das ist ein Fremdkörper: Er gehört optisch weder zum Report noch zum Hintergrund und konkurriert mit dem Titel um den ersten Blick. Die Kopfzeile ganz oben („# Manufactured Majority") ist auf Dunkelbraun fast unsichtbar — sie existiert praktisch nicht. Der Einstieg in den Inhalt (SPIELSTIL-BEWERTUNG) funktioniert, wird aber durch den Button rechts gestört.

**`end_victory_endreport_top.png`**
Identisch zum vorherigen Bild — dieselben Beobachtungen gelten. Auffällig beim zweiten Hinsehen: Im Diagramm „VERTRAUENSVERLAUF" klebt das rote Label „40 %" direkt an der rechten Plotkante, während rechts daneben im Panel etwa 15 % Breite ungenutzt bleiben. Die graue Fläche zwischen der roten Strichellinie und der braunen Solidlinie hat keine Legende — ich muss raten, was der graue Bereich bedeutet (Zielband? Unsicherheit?). Die vertikale Achsenbeschriftung „Vertrauen" ist winzig und wird beim Überfliegen übersprungen.

**`end_victory_endreport_mid.png`**
Der Blick bleibt zuerst an der hervorgehobenen „Sieg"-Karte hängen — gut, das ist die richtige Information. Aber die Hervorhebung ist schwach: nur ein etwas dunklerer Rahmen plus ein Mini-Häkchen vor dem Titel; auf Distanz unterscheidet sich die Karte kaum von den sieben Geschwistern. Unten rechts taucht derselbe „VOLLSTÄNDIGER LAGEBERICHT"-Fremdkörper auf. Unter der Panel-Unterkante lugt ein abgeschnittener Folgetext („AUSWIRKUNGEN …") heraus — ein halb sichtbarer Textstreifen ohne Funktion, der wie ein Renderfehler wirkt. Die beiden EINORDNUNG-Callouts haben unterschiedliche Balkenfarben links (oliv vs. blau) ohne erkennbare Semantik.

**`end_victory_endreport_bottom.png`**
Bildidentisch zu `end_victory_endreport_mid.png`. Der primäre CTA „BERICHT SCHLIESSEN" ist ein flacher Beige-Knopf ohne jeden Stempel-Charakter — er sieht aus wie ein deaktiviertes Formularfeld, nicht wie der Abschlussakt eines Runs. Für den wichtigsten Button des Screens fehlt jede visuelle Autorität. Auch hier: der abgeschnittene Textstreifen unter dem Panel und der Lagebericht-Fremdkörper rechts.

**`fixture_wahlabend_victory_s0.png`**
Fast leeres Schwarz, ein kleines Textcluster leicht oberhalb der Mitte. Das Auge findet den Titel „DIE HOCHRECHNUNG" sofort — das funktioniert. Problem: Rund 60 % des Bildes sind tote Fläche ohne jedes Anker-Element, und der Interaktionshinweis „Klicken zum Fortfahren" ist so dunkel, dass man ihn erst beim Suchen entdeckt. Die Gold-/Bernstein-Töne des Titels kommen in den Farbtoken (`theme.ts`) gar nicht vor — dort gibt es nur das dunkle Ochre `warning: '#6E4A0E'`, das für Papierflächen gerechnet ist, nicht für Leuchtschrift auf Schwarz. Der Hintergrund ist nahezu schwarz, nicht das tokenisierte Kraftpapier-Dunkel `background: '#2E2820'` — Bild und Stil-Absicht gehen auseinander.

**`fixture_wahlabend_victory_s1.png`**
Der TV-Rahmen trägt die Komposition, das ist richtig angelegt. Innerhalb des TVs hängt jedoch eine einzelne Balkenzeile in einer riesigen dunklen Fläche — ober- und unterhalb der Zeile je ca. 200 px leerer Bildschirm. Der Wert „21,6 %" steht ganz rechts am Track-Ende, obwohl der Füllstand viel weiter links endet: Zahl und Balkenspitze sind entkoppelt, das Auge muss hin- und herspringen. Das Label „SCHWELLE" sitzt einige Pixel links versetzt über der eigentlichen Markierungslinie. Der Ticker unten ist sauber gesetzt und gibt Boden — der stärkste Teil des Screens.

**`fixture_wahlabend_victory_s2.png`**
Die rote Füllung kreuzt jetzt die Schwelle — die Erzählung liest man sofort, das ist der beste Moment der Fixture. Aber der Moment bekommt keine Bühne: gleiche Größe, gleiche Position, kein visueller Akzent außer der Farbe selbst; statisch wirkt der Schritt fast identisch zu s1. Wert-Label weiterhin abgekoppelt am Track-Ende. Dieselbe große Leerfläche im TV. „Klicken zum Fortfahren" wiederum sehr dunkel.

**`fixture_wahlabend_victory_s3.png`**
Bruch-Screen: Der TV ist nach oben aus dem Viewport geschoben, das LIVE-Badge oben rechts ist halb abgeschnitten — die Komposition wirkt wie ein Overflow-Unfall, nicht wie eine Absicht. Der Nachsatz-Text und die Milieu-Chips darunter sind lesbar, aber die zwei Chip-Reihen (4 + 2, zentriert) ergeben eine ausgefranste, unsymmetrische Blockform. Der „WEITER →"-Button ist eine massiv rot geflutete Fläche — das verstößt direkt gegen §4.7 des eigenen Themes („Ministeriums-Rot NUR für Stempel/Kopfbänder") und gegen `stampCtaStyle`, das genau diesen Fall als Papierfläche mit rotem Doppelring definiert. Hier geht die Absicht klar am Bild vorbei.

**`fixture_wahlabend_timeout_s0.png`**
Pixelidentisch zur Victory-Titelkarte — kein Unterschied in Ton, Text oder Bild. Als Spieler kann ich am S0 nicht erkennen, dass dies der Timeout-Pfad ist; die Verzweigung wird komplett nach hinten verschoben. Ansonsten dieselbe Kritik: viel Leere, kaum sichtbarer Fortfahren-Hinweis.

**`fixture_wahlabend_timeout_s1.png`**
Gleiche Bühne wie victory_s1, Wert 15,3 %, Füllung endet vor der Schwelle — die Geometrie stimmt diesmal (Füllspitze vor der Markierung). Dieselben Probleme: Zahl rechts am Track-Ende statt an der Spitze, „SCHWELLE" leicht versetzt, große Leerfläche im TV. Positiv: Der Kontrast Khaki-Füllung vs. dunklem Rest-Track ist auch auf Distanz lesbar.

---

## 2. Konkrete Eingriffe je Screen

**`end_victory_gameend.png` / `end_victory_endreport_top.png`** (identisch, Eingriffe gelten für beide)
- Schwebender Button „VOLLSTÄNDIGER LAGEBERICHT →" (unten rechts, ragt über die Panel-Rechte-Kante hinaus) → entweder ins Panel integrieren (rechtsbündig zur Panel-Kante, 16 px Innenabstand) oder als eigenständige Papier-Fläche mit Border `border`-Token und Tinten-Text statt Rot-auf-Schwarz → aktuell konkurriert er mit dem Titel um den Erblick und ist auf Schwarz Kontrast-mäßig grenzwertig.
- Rotes Label „40 %" im Diagramm klebt an der Plot-Rechte-Kante → 8–12 px Abstand zur Kante, oder Label ans Ende der Strichellinie innerhalb der Plotfläche setzen → aktuell wirkt es abgeschnitten.
- Graue Bandfläche im Diagramm ohne Bedeutung → Legende (kleine Musterzeile unter dem Diagramm, linksbündig zur Plotkante) ergänzen oder Band entfernen → ohne Legende ist die wichtigste grafische Aussage des Reports nicht dekodierbar.
- Vertikale Achsenbeschriftung „Vertrauen" → weglassen und stattdessen als kleine horizontale Zeile über der Y-Achse platzieren → die gedrehte Micro-Type ist unlesbar und kostet Platz.
- Kopfzeile „# Manufactured Majority" oben mittig → Kontrast mindestens auf `textMuted`-Niveau heben oder entfernen → halbsichtbarer Text wirkt wie Rendering-Rauschen.
- Badge-Paar „TRIUMPH / TRIUMPHAL" sieht aus wie zwei Buttons → wenn Tags gemeint: aktiven Tag mit gefüllter Papierfläche + Stempelrahmen kennzeichnen, inaktiven auf 50 % Tinte → aktuell muss ich raten, ob „TRIUMPHAL" klickbar ist.

**`end_victory_endreport_mid.png` / `end_victory_endreport_bottom.png`** (identisch)
- Karte „Sieg" → Hervorhebung verdoppeln: Stempel-Doppelring (wie `stampCtaStyle`) um die gesamte Karte + Häkchen auf ~150 % vergrößern → die wichtigste Karte hebt sich aktuell zu wenig von sieben Geschwisterkarten ab.
- Halb sichtbarer Folgetext unter der Panel-Unterkante („AUSWIRKUNGEN …") → entweder sauber abschneiden (Panel-Ende = Inhalt-Ende, kein Überlapp) oder nächste Sektion mit vollem Kopfbalken zeigen → der Textstreifen wirkt wie ein Z-Layer-Fehler.
- Callout-Balken in EINORDNUNG (oliv vs. blau) → auf eine Tintenfarbe vereinheitlichen oder Farbcodes mit Bedeutung belegen → zwei verschiedene Akzentfarben ohne Semantik erzeugen Pseudo-Bedeutung.
- Button „BERICHT SCHLIESSEN" → auf `stampCtaStyle` umstellen (Papierfläche, roter Doppelring, rote Stempel-Tinte, Uppercase) → der Abschluss-CTA ist aktuell der visuell schwächste Button im Bild und widerspricht dem eigenen Token-System.
- Karten-Raster: Spaltenabstand (~13 px) und Zeilenabstand sind gleich groß → Zeilenabstand auf ~1,5× Spaltenabstand erhöhen → Zeilen und Spalten sind aktuell nicht unterscheidbar, das Raster „verschmilzt".
- Schwebender „VOLLSTÄNDIGER LAGEBERICHT"-Button → siehe oben, gleicher Eingriff.

**`fixture_wahlabend_victory_s0.png` / `fixture_wahlabend_timeout_s0.png`** (identisch)
- Textblock insgesamt sitzt bei ~45 % Höhe mit kompletter leerer unterer Bildhälfte → Block auf die optische Mitte (leicht über geometrische Mitte, ~45 %) belassen, aber darunter einen zweiten Anker setzen (z. B. dünne Linie + Datum/Uhrzeit „WAHLABEND, 18:00" bei ~75 % Höhe) → aktuell fehlt jede räumliche Verankerung, das Bild kippt nach oben leer weg.
- „Klicken zum Fortfahren" → Helligkeit mindestens verdoppeln oder als pulsierendes Element (2 Frames, subtil) bauen → der einzige Interaktionshint ist aktuell fast unsichtbar.
- Hintergrund ist nahezu Schwarz → auf `background: '#2E2820'` (Kraftpapier-Dunkel) bringen oder bewusst als Ausnahme dokumentieren → aktuell driftet die Fixture vom tokenisierten Grundton ab.
- Titel-Farbe (Gold/Bernstein) → entweder als neues Token (z. B. „Broadcast-Amber") in `StoryModeColors` aufnehmen oder auf `ministryRed`/Tech-Petrol umstellen → aktuell nutzt die Fixture eine Farbe außerhalb des Systems.

**`fixture_wahlabend_victory_s1.png`**
- Wert-Label „21,6 %" steht am Track-Ende → Label an die Füllspitze koppeln (linksbündig 8 px rechts der Balkenkante, vertikal zur Balkenmitte zentriert) → Zahl und Füllstand erzählen gemeinsam, aktuell sind sie getrennt.
- Label „SCHWELLE" → horizontal exakt zur Markierungslinie zentrieren (aktuell ~10 px linksversetzt) → Beschriftung und Linie müssen eine Einheit bilden.
- Balkenmodul vertikal zentriert in ~480 px leerer TV-Fläche → Modul auf ~140 % vergrößern (höherer Balken, größere Labels) und zusätzlich eine zweite Info-Zeile darunter setzen (z. B. Wahlbeteiligung oder zweiter Kandidat) → aktuell wirkt der Sendungs-Bildschirm unbelebt-leer statt dramatisch-reduziert.
- „Klicken zum Fortfahren" unter dem Rahmen → Kontrast erhöhen, siehe S0 → gleiches Problem, gleiche Lösung.
- LIVE-Badge oben rechts → 1–2 px größer, Punkt und Text auf gemeinsame Grundlinie → aktuell sitzt der Punkt minimal hoch.

**`fixture_wahlabend_victory_s2.png`**
- Schwerten-Kreuzung-Moment → beim Überschreiten einen Zustandswechsel am Rahmen sichtbar machen (z. B. rotes Kopfband oben im TV oder Stempel-Grafik „PROJEZIERT" über der Balkenzeile) → der dramaturgische Höhepunkt ist statisch fast unsichtbar.
- Wert-Label und SCHWELLE-Ausrichtung → siehe s1, gleiche Eingriffe.
- Rote Füllung endet knapp hinter der Markierung → Markierungslinie über den gefüllten Bereich weiterzeichnen (Linie in voller Höhe, nicht nur im Track) → aktuell verschluckt die Füllung die untere Hälfte der Schwelle.

**`fixture_wahlabend_victory_s3.png`**
- TV-Rahmen oben angeschnitten, LIVE-Badge halbiert → TV auf ~80 % skalieren und vollständig im Viewport verankern (Oberkante ≥ 24 px unter dem Viewport-Top) → der beschnittene Rahmen ist der auffälligste Fehler des ganzen Bündels.
- Button „WEITER →" (rot geflutet) → auf `stampCtaStyle` umstellen → direkter Verstoß gegen §4.7 und das eigene CTA-Token; Rot ist Stempel/Kopfband vorbehalten.
- Milieu-Chips in Reihen 4 + 2 zentriert → linksbündig zur TV-Rahmen-Kante ausrichten und in einer Reihe mit Wrap laufen lassen (oder Grid 3 + 3) → die zentrierte Treppenform erzeugt Unruhe zwischen Rahmen und Button.
- Chip-Marker (Dreieck/Dreieck/Quadrat/Quadrat/Kreis/Kreis) ohne Legende → Mini-Legende über der Chip-Gruppe („▲ jubelt ■ stumm ○ schaltet ab") oder Marker vereinheitlichen → die Formen tragen offensichtlich Semantik, die niemand dekodieren kann.
- Nachsatz-Text („Das Telefon. …") → max. Zeilenbreite begrenzen (~60 Zeichen) und linksbündig zur TV-Kante setzen → aktuell als zentrierter Zweizeiler schwebt er ohne Bezugskante.

**`fixture_wahlabend_timeout_s1.png`**
- Wert-Label „15,3 %" an Füllspitze koppeln → siehe s1.
- SCHWELLE-Label zur Linie zentrieren → siehe s1.
- Balkenmodul vergrößern / zweite Info-Zeile → siehe s1; im Timeout-Pfad wäre hier z. B. der Hinweis „unter Schwelle" als kleiner Ticker-Zusatz denkbar.

---

## 3. Grafiken / Assets

- **Tragend:** Der TV-Rahmen in den Fixture-Schritten (Gold-Doppelrand, dunkles Petrol-Display, Ticker-Leiste) ist das beste Asset des Bündels — er etabliert die „Sondersendung"-Fiktion allein über Form. Das Diagramm im Report ist funktional, leidet aber unter fehlender Legende.
- **Stildrift:** Die Fixture-Screens nutzen leuchtendes Gold/Bernstein auf Schwarz — diese Farben existieren weder in `theme.ts` (dort ist `warning` ein dunkles Ochre für Papier) noch passen sie zur Papier-Welt. Sie stammen offenbar aus der alten v2-Palette des Game-Style-Guides (Warn-Amber `#F0B429`). Zwei Farbsysteme koexistieren hier unvermittelt.
- **Fehlend:** Jede Papier-Textur. Die Report-Flächen sind flat `surfaceLight` — für die „Behörden-Akte"-Anker wäre eine subtile Papierkörnung oder eine Perforations-/Lochrandschiene am Panel-Rand der billigste Realismus-Gewinn. Ebenso fehlt im Report jeder Stempel als *Bild* (nur der CTA-Style ist als Stempel definiert) — ein „VERTRAULICH"-Stempel schräg über der Report-Ecke würde die Fiktion mehr tragen als jede Typo-Anpassung.
- **Skalierung/Zuschnitt:** In `fixture_wahlabend_victory_s3.png` ist der TV-Rahmen oben beschnitten (LIVE-Badge halbiert) — falscher Zusatz durch Layout-Overflow, kein Asset-Problem, aber das auffälligste Bildproblem des Bündels. Die Chip-Marker in s3 sind drei verschiedene Symbolformen in sehr kleiner Größe — wirken aufgelöst statt ikonisch.
- **Diagramm-Assets:** Die gestrichelten Gitterlinien und die rote Ziel-Strichellinie sind sauber; die graue Bandfläche ist das einzige Grafikelement ohne erkennbare Quelle/Bedeutung.

## 4. Raster & Rhythmus

- **Report:** Panel ist sauber zentriert (~56 % Breite), Kopfbalken und Inhaltsbereich teilen sich die linke Bezugskante — gut. Innerhalb des Inhalts wechseln aber volle Breite (Fließtext), eingezogene Diagramme und das Kartenraster ohne gemeinsames Innenraster; die Diagramm-Plotfläche endet deutlich vor der Text-Rechte-Kante, wodurch rechts eine schmale, wechselnde Restspalte entsteht. Ein einheitliches zweispaltiges Innenraster (Textspalte + schmale Randspalte für Labels/Legenden) würde das lösen.
- **Kartenraster (mid/bottom):** Gleich große Spalten- und Zeilenabstände lassen Zeilen und Gruppen verschmelzen (siehe Eingriffe). Die Sieg-Karte bricht das Raster nur via Rahmen — zu leise.
- **Fixtures:** Der TV ist konsistent platziert (~56 % Breite, zentriert) — gutes, wiedererkennbares Gerüst. S3 bricht es durch den Overflow. Zwischen TV-Unterkante und „Klicken zum Fortfahren" in s1/s2 liegt ein großer Sprung, während in s3 derselbe Raum mit Nachsatz/Chips/Button gefüllt ist — die Fixture-Schritte haben also zwei verschiedene vertikale Systeme; der Übergang s2→s3 springt dadurch hart.
- **Tote Fläche:** S0 (untere Bildhälfte komplett), TV-Innenfläche in s1/s2 (oben/unten der Balkenzeile), rechte Restspalte im Report-Diagramm.

## 5. Lesbarkeit

- **Zweimal hingesehen:** „VOLLSTÄNDIGER LAGEBERICHT →" (Dunkelrot auf Schwarz, alle vier Report-Shots) — Kontrast fragwürdig, Zugehörigkeit unklar. „Klicken zum Fortfahren" (alle Fixture-Shots) — zu dunkel für den einzigen Handlungshinweis. Die Kopfzeile „# Manufactured Majority" — quasi unsichtbar.
- **Grenzwertig:** Die Meta-Zeile im Report-Kopfbalken („Kampagne: 2 Tage …") ist klein, aber auf Braun noch OK; die vertikale Achsenbeschriftung „Vertrauen" ist effektiv unlesbar. Die Chip-Labels in s3 sind klein, aber kontrastreich genug.
- **Zustände:** Aktiv (Sieg-Karte) ist zu schwach differenziert (siehe oben). Gesperrt/neu kommt in diesem Bündel nicht vor — nichts zu beurteilen, aber auch kein Muster erkennbar.
- **Textmengen:** Die acht „Mögliche Spielenden"-Karten sind dicht gesetzt, aber durch die Mono-Schrift gut scanbar; die Bedingungszeilen („_ wenn Sie fast alle Ziele …") könnten um ~10 % größer ohne Layoutbruch vertragen werden.

## 6. Die drei wirksamsten Änderungen

1. **Schwebenden Button „VOLLSTÄNDIGER LAGEBERICHT" reparieren** (Kontrast auf Tinte-on-Papier, Position an Panel-Kante binden oder integrieren) — betrifft vier von vier Report-Shots, ist ein Z-Index-/Style-Fix von Minuten, und entfernt currently den größten Blickfang-Störer des gesamten Reports.
2. **`fixture_wahlabend_victory_s3.png`: TV-Overflow beheben + „WEITER" auf `stampCtaStyle`** — der beschnittene Rahmen ist der hässlichste Einzelbug des Bündels, und der rot geflutete CTA verletzt die eigene Stil-Bibel (§4.7) an der prominentesten Stelle; beide Fixes liegen in derselben Datei/Komponente.
3. **TV-Balkenmodul in s1/s2/timeout_s1: Wert-Label an die Füllspitze koppeln, SCHWELLE-Label exakt zur Linie, Modul ~140 % vergrößern** — drei kleine Geometrie-Fixes, die denselben Baustein betreffen und aus einem leeren Schaubild die tatsächliche Hauptbühne des Wahlabends machen; die Änderung wirkt in vier Screens gleichzeitig.

## 7. Blinde Flecken

- **Ernte-Fehler klären:** Warum sind `end_victory_gameend`/`end_victory_endreport_top` sowie `end_victory_endreport_mid`/`end_victory_endreport_bottom` identisch? Ich brauche Aufnahmen der tatsächlich fehlenden Abschnitte (Methoden-Atlas/Bilanz, Gegenmaßnahmen/Debrief), bevor ich sie beurteilen kann.
- **Bewegung/Zustände:** Stempel-Moment in s2 (Überschreiten der Schwelle) — gibt es Animation, Flash, Sound-Cue? Hover-Zustände der Karten im Report und der Chips in s3. Ob „VOLLSTÄNDIGER LAGEBERICHT" klickbar ist und wohin er führt.
- **Scroll-Verhalten:** Ist der Report ein Modal über dem Spielscreen (der Streifen „AUSWIRKUNGEN …" deutet darauf hin)? Ein Vollseiten-Scroll-Video oder Screenshots der Zwischenpositionen würden klären, ob der abgeschnittene Text ein Layer-Bug oder normales Unterlay ist.
- **Chip-Semantik:** Bedeutung der Markerformen (▲/■/○) und ob es eine Legende an anderer Stelle gibt.
- **Auflösung/Skalierung:** Alle Screens wirken auf 1280×720 aufgenommen; Verhalten bei höherer Auflösung (Pixelfont-Schärfe, TV-Rahmen-Skalierung) ist nicht erkennbar.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
