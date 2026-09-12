# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „ending-2von4"

**Modell:** `stealth/ox-alpha` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-21
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-21T16:57:37.470Z · **Dauer:** 260.7 s
**Nutzung:** 18.342 Prompt + 7.862 Antwort Tokens · **Kosten:** $0.00 (gratis) · **Anbieter-Datensammlung:** ausgeschlossen (deny)

> ⚠️ **Wie das zu lesen ist:** Ein *fremdes* Modell hat einen **kuratierten Ausschnitt**
> des Projekts gesehen — nicht das laufende Spiel und nicht das ganze Repository. Es kann
> daher weder Laufzeitverhalten prüfen noch `file:line`-Belege verifizieren. Befunde sind
> **Hypothesen**, die vor dem Umsetzen am Code/an den Daten gegenzuprüfen sind. Die
> kanonische Wahrheit bleibt [`docs/VISION_LOCK.md`](../VISION_LOCK.md) bzw. die Spieldaten.

## Gestellte Frage

Sieh dir die beigefügten Screenshots des laufenden Spiels an und mache einen UX/UI-Durchgang. Die Optik soll eine Behörden-/Papierwelt sein (Stil-Anker und Farbtoken liegen bei). Sag mir: Wo führt das Bild den Blick falsch, welche Grafiken sitzen an der falschen Stelle oder in der falschen Größe, wo stimmen Abstände und Ausrichtung nicht, und welche drei Änderungen bringen am meisten? Sei so konkret, dass man es direkt umsetzen kann.

## Dieser Durchgang: Bündel „ending-2von4" (10 Screenshots)

Das siehst du, in dieser Reihenfolge:
- end_immune_wahlabend_s2.png — Wahlabend (echt, immune), Schritt 2
- end_immune_wahlabend_s3.png — Wahlabend (echt, immune), Schritt 3
- end_immune_gameend.png — GameEndScreen (immune)
- end_immune_endreport_top.png — End-Report (immune), Anfang: „Das Rennen"-Kurven
- end_immune_endreport_mid.png — End-Report (immune), Mitte: Methoden-Atlas/Bilanz
- end_immune_endreport_bottom.png — End-Report (immune), Ende: Gegenmaßnahmen/Debrief
- end_victory_wahlabend_s0.png — Wahlabend (echt, victory), Titelkarte
- end_victory_wahlabend_s1.png — Wahlabend (echt, victory), Schritt 1
- end_victory_wahlabend_s2.png — Wahlabend (echt, victory), Schritt 2
- end_victory_wahlabend_s3.png — Wahlabend (echt, victory), Schritt 3

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
| 🖼 Bild | `end_immune_wahlabend_s2.png` | `desinformation-network/runs/visual-review/latest/shots/end_immune_wahlabend_s2.png` | 167 kB |
| 🖼 Bild | `end_immune_wahlabend_s3.png` | `desinformation-network/runs/visual-review/latest/shots/end_immune_wahlabend_s3.png` | 78 kB |
| 🖼 Bild | `end_immune_gameend.png` | `desinformation-network/runs/visual-review/latest/shots/end_immune_gameend.png` | 78 kB |
| 🖼 Bild | `end_immune_endreport_top.png` | `desinformation-network/runs/visual-review/latest/shots/end_immune_endreport_top.png` | 78 kB |
| 🖼 Bild | `end_immune_endreport_mid.png` | `desinformation-network/runs/visual-review/latest/shots/end_immune_endreport_mid.png` | 99 kB |
| 🖼 Bild | `end_immune_endreport_bottom.png` | `desinformation-network/runs/visual-review/latest/shots/end_immune_endreport_bottom.png` | 99 kB |
| 🖼 Bild | `end_victory_wahlabend_s0.png` | `desinformation-network/runs/visual-review/latest/shots/end_victory_wahlabend_s0.png` | 127 kB |
| 🖼 Bild | `end_victory_wahlabend_s1.png` | `desinformation-network/runs/visual-review/latest/shots/end_victory_wahlabend_s1.png` | 128 kB |
| 🖼 Bild | `end_victory_wahlabend_s2.png` | `desinformation-network/runs/visual-review/latest/shots/end_victory_wahlabend_s2.png` | 158 kB |
| 🖼 Bild | `end_victory_wahlabend_s3.png` | `desinformation-network/runs/visual-review/latest/shots/end_victory_wahlabend_s3.png` | 66 kB |

---

## Antwort des Modells

# UX/UI-Durchgang: Bündel „ending-2von4"

## 1. Erster Eindruck

**`end_immune_wahlabend_s2.png`**
Das Auge springt zuerst auf den roten „GEFÄLSCHT"-Stempel — das ist korrekt, denn er trägt die Botschaft des Screens. Problem: Der Stempel überdeckt die Zeile „IHRE SCHLAGZEILEN – GEPRÜFT", sodass beide Elemente um dieselbe Bildmitte kämpfen und die Schlagzeile selbst (dunkles Rot auf Dunkelrot) kaum lesbar ist. Die untere Hälfte des TV-Rahmens ist leere dunkle Fläche — fast 40 % des Frames tragen nichts. Dann hängt der Blick auf der Zeile „Unten im Bild: Ihr Bürogebäude, Blaulicht…", die ein beschreibt, was nirgends zu sehen ist — sie liest sich wie ins UI gerutschter Alt-Text bzw. eine Regieanweisung. Die fünf Pill-Buttons darunter sind in Zentrier-Reihen 2/3/1 gebrochen, das Auge läuft Zickzack. Das erste Blickziel sollte der Stempel sein, das zweite die Handlungsaufforderung — aktuell ist das dritte.

**`end_immune_wahlabend_s3.png`**
Klare Hierarchie: brauner Kopfbalken mit Titel „Das Land hält stand", dann Papierkörper. Das Auge landet richtig auf dem Titel, wird aber sofort von den beiden Badge-Kästchen „ENT TAR NUNG / HOFFNUNGSVOLL" gestört — die Letter-Spacing zerbricht die Wörter mitten drin. Die Zusammenfassungszeile „Kampagne: 2 Tage … Finales Vertrauen: 58 %" klebt eng an der Unterkante des Kopfbands. Rechts außen floatet halb außerhalb des Panels ein grauer Button „VOLLSTÄNDIGER LAGEBERICHT →", der mit der Panel-Kante kollidiert und auf Schwarz fast unsichtbar ist. Der Chart-Anfang (100 %/75 %-Achse) wird genau am Fold abgeschnitten — als Teaser okay, aber die Achsenbeschriftung wirkt bereits angeschnitten.

**`end_immune_gameend.png`**
Pixelidentisch mit `end_immune_endreport_top.png` — dasselbe Bild, gleicher Ausschnitt, gleiche Scrollposition. Als eigenständiger „GameEndScreen" ist hier nichts zu beurteilen; entweder ist der Screenshot falsch geerntet worden oder der GameEndScreen ist deckungsgleich mit dem Report-Kopf. Für den Durchgang gilt: alles, was zu `end_immune_endreport_top.png` gesagt wird, trifft hier ebenso zu. Der Duplikat-Befund selbst ist ein Prozessproblem der Review-Ernte.

**`end_immune_endreport_top.png`**
Wie oben: starker Kopfbalken, saubere Papierfläche, gute Tinten-Kontraste im Fließtext. Die Absatzblöcke der Spielstil-Bewertung haben gleichmäßige Abstände — das ist der ruhigste Textbildschirm des Bündels. Schwachpunkte bleiben die zerbrochenen Badges und der rechts überlappende Lagebericht-Button. Der Übergang Kopfbalken → Papierkörper hat keinen Zwischenraum; die Statistik-Zeile sitzt zu nah an der Kante.

**`end_immune_endreport_mid.png`**
Das Raster der „MÖGLICHE SPIELENDEN"-Karten funktioniert: zwei Spalten, klare Kästen, das erreichte Ende („✓ Enttarnung") hebt sich über Rahmen und Tönung ab — Blickführung stimmt. Die Kartenhöhen innerhalb einer Reihe differieren leicht, was die Unterkanten unruhig macht. Die „EINORDNUNG"-Callouts mit farbiger linker Kante sind gut gefunden, aber beide Balken wirken ähnlich blau — die zweite (rote?) Priorisierung geht visuell verloren. Am unteren Rand lugen unter dem Bericht-Panel die Oberkanten zweier dunkelroter Kästen hervor — ein Layering-Fehler, das dahinterliegende Wahlabend-Screen blutet durch. Der Disclaimer „Dieses Spiel dient dem Verständnis…" ist die immunisierende Kernbotschaft und ist die unauffälligste Zeile im Bild.

**`end_immune_endreport_bottom.png`**
Pixelidentisch mit `end_immune_endreport_mid.png`. Kein zusätzlicher Informationsgehalt, keine separaten Befunde. Entweder Ernte-Fehler oder der Screen endet tatsächlich hier — dann fehlt der Nachweis, was nach „BERICHT SCHLIESSEN" kommt.

**`end_victory_wahlabend_s0.png`**
Der TV-Rahmen ist korrekt als Bühne gesetzt, aber die Bühne ist leer: Der Fortschrittsbalken schwebt als schmales Band (~40 % Framebreite, beginnend bei ~30 % Einzug) in einer großen dunkelblauen Fläche mit je ~35 % Totraum ober- und unterhalb. Das Auge findet den Balken erst nach einem Moment — bei einem Wahlabend-Screen sollte die Zahl das erste Ziel sein. Positiv: „● LIVE" oben rechts und der Ticker unten geben dem Frame Fernseh-Glaubwürdigkeit. „Klicken zum Fortfahren" unterhalb ist so dezent, dass es überlesen wird — auf einem Klick-Weiter-Screen ein Problem.

**`end_victory_wahlabend_s1.png`**
Gleiche Komposition, jetzt rot gefüllter Balken bis knapp über die SCHWELLE-Markierung — der dramatische Beat funktioniert, die rote Füllung zieht den Blick sofort. Aber: Die Füllung endet fast exakt auf Höhe des Schwellen-Ticks, das „Knapp-dran/Drüber" ist nur bei genauem Hinsehen ablesbar; der Tick sollte markanter sein. Der Ticker „Damit ist klar – die Regierung ist abgewählt." ist das eigentliche Ergebnis und steht in derselben Größe wie jeder andere Ticker-Text. Totraum-Problematik identisch zu s0.

**`end_victory_wahlabend_s2.png`**
Aufbau wie `end_immune_wahlabend_s2`, aber der obere Frame-Rand ist abgeschnitten — das „● LIVE"-Badge oben rechts ist zur Hälfte gekappt. Ob das Scroll-Zustand oder Layout ist: So darf der Screen nicht gezeigt werden. Der Kurator-Text („Das Telefon. Der Kurator, eine Zeile, kühl…") steht frei zwischen Frame und Pills ohne eigenen Träger — er wirkt schwebend und gehört weder zum TV noch zu den Buttons. Dieselben 2/3/1-Pill-Zickzack-Reihen, derselbe rot geflutete WEITER-Button am unteren Rand, der dort fast am Viewport-Edge klebt.

**`end_victory_wahlabend_s3.png`**
Report „Die Mehrheit, gemacht": gleiche starke Kopfzeile wie beim Immune-Pendant, guter Kontrast. Über dem Panel schwebt eine Geisterzeile („A Manufactured Majority"), die auf Dunkel so gut wie unsichtbar ist — entweder entfernen oder lesbar machen. Der Vertrauensverlauf-Chart ist hier vollständig genug sichtbar, um ihn zu bewerten: flache Linie bei ~58 %, graugrüne Füllfläche darunter, gestrichelte rote Schwelle bei 40 % mit Label „40 %" am rechten Rand. Die Y-Achsenbeschriftung „Vertrauen" ist rotiert und winzig, die Prozentskala links ebenfalls. Der rechte Lagebericht-Float kollidiert wieder mit der Panel-Kante.

## 2. Konkrete Eingriffe je Screen

**`end_immune_wahlabend_s2.png`**
- Stempel „GEFÄLSCHT" → um ~15–20 % verkleinern und so verschieben, dass er die Schlagzeile nur noch am rechten Ende schneidet, nicht deren Mitte → Stempel soll beglaubigen, nicht verdecken; die geprüfte Zeile muss lesbar bleiben.
- Schlagzeile „IHRE SCHLAGZEILEN – GEPRÜFT" → Schrift um ~1,3× vergrößern und Helligkeit anheben (eine Stufe Richtung surfaceLight) → aktuell dunkelrot auf dunklem Grund, zweitwichtigste Info nach dem Stempel.
- Leere untere Frame-Hälfte → Inhaltsblock (Stempel + Zeilen) vertikal ins optische Zentrum des Screenschiebens, oben/unten je ~25 % Rand → tote Fläche eliminieren, TV wirkt gesendet statt leer.
- Zeile „Unten im Bild: Ihr Bürogebäude, Blaulicht…" → entweder das beschriebene Motiv tatsächlich zeigen (Bürogebäude-Silhouette mit Blaulicht-Tönung im unteren Frame-Drittel) oder die Zeile in eine Szenenbeschreibung im Ticker umwandeln → Beschreibung eines nicht vorhandenen Bildes bricht die Fiktion.
- Pill-Buttons (5 Milieu-Zeilen) → aus der 2/3/1-Zentrierung in ein linksbündiges, festes Raster bringen: eine Spalte oder 2 Spalten mit festem Spaltenabstand, linke Kante aller Pills bündig zur Frame-Innenkante → Zickzack-Auge beruhigen, Gruppierung „das schaltet ab" wird lesbar.
- WEITER-Button → von gefülltem Rot auf `stampCtaStyle` (Papierfläche + roter Doppelring) umstellen, Abstand nach oben auf ~1,5× des Pill-Abstands vergrößern → §4.7 reserviert Rot für Stempel/Kopfbänder; außerdem braucht die Primäraktion mehr Luft vom Optionsblock.

**`end_immune_wahlabend_s3.png`**
- Badges „ENTTARNUNG"/„HOFFNUNGSVOLL" → Letter-Spacing auf ~50 % reduzieren oder ganz streichen → Wortbruch „ENT TAR NUNG" zerstört Lesbarkeit.
- Statistik-Zeile „Kampagne: … 58 %" → Innenabstand zur Kopfbalken-Unterkante verdoppeln → klebt aktuell an der Kante.
- Float-Button „VOLLSTÄNDIGER LAGEBERICHT →" → entweder vollständig ins Panel integrieren (rechtsbündig unter dem letzten Abschnitt, gleiche Innenkante wie Text) oder klar außerhalb mit eigenem Kontrast (surfaceLight-Text auf background) → aktueller Zustand: halb auf Papier, halb auf Schwarz, Kontrast fail.
- Chart-Achsenschrift (100 %/75 %) → mindestens 1,2× vergrößern → wird am Fold bereits angeschnitten wahrgenommen und ist zu klein für die wichtigste Grafik des Reports.

**`end_immune_gameend.png`**
- Screenshot/Screen identisch zu `end_immune_endreport_top.png` → klären, ob der GameEndScreen ein eigener Screen sein soll; falls ja, fehlt hier jedes unterscheidende Merkel (kein eigener Titel, kein eigener Abschluss-CTA) → ein „Game End" ohne eigenes Gesicht ist als Screen nicht existent.
- Falls gewollt identisch: mindestens einen eigenen Footer-CTA („ZURÜCK ZUM MENÜ") unterhalb des Report-Kopfs ergänzen → sonst gibt es auf diesem Screen keine Handlungsoption außer Scrollen.

**`end_immune_endreport_top.png`**
- Wie s3: Badges entzerren, Statistik-Zeile absetzen, Float-Button integrieren.
- Kopfbalken → zwischen Statistik-Zeile und Papierkante eine Trennlinie oder 1,5× Abstand → die drei Infos (Kampagne/Aktionen/Vertrauen) verschmelzen aktuell mit der Kante.

**`end_immune_endreport_mid.png`**
- Karten-Unterkanten pro Reihe → Höhen angleichen (feste Mindesthöhe je Reihe oder gleichmäßige Vertikalverteilung) → gestaffelte Unterkanten erzeugen Unruhe im sonst sauberen Raster.
- EINORDNUNG-Callouts → linke Kantenfarben klar trennen (erster Callout agencyBlue, zweiter ministryRed) und zweiten Callout um ~10 % stärker gewichten → die realweltliche Einordnung ist die wichtigste Immunisierungs-Stelle und sieht aus wie ein Duplikat des ersten.
- Disclaimer-Zeile → aus dem muted-Zustand in textSecondary heben und zentriert über dem Schließen-Button mit ~2× Abstand setzen → Kernbotschaft des Spiels darf nicht die schwächste Typo-Ebene tragen.
- Durchblutende dunkelrote Kästen unter der Panel-Unterkante → Modal-Hintergrund abdunkeln oder Panel bis unter den Button verlängern → Fremdkörper im Bild.
- „BERICHT SCHLIESSEN" → auf `stampCtaStyle` prüfen oder zumindest Border-Kontrast erhöhen → aktuell wirkt der primäre Abschluss wie ein deaktivierter Sekundärbutton.

**`end_immune_endreport_bottom.png`**
- Identisch zu `mid` — alle Eingriffe dort gelten; zusätzlich: wenn dies das Dokumentationsende sein soll, fehlt der Nachweis des Zustands nach „BERICHT SCHLIESSEN" → erneute Ernte nötig.

**`end_victory_wahlabend_s0.png`**
- Fortschrittsbalken-Block → Breite auf ~80 % der Frame-Innenbreite vergrößern (linke Kante bündig zur Ticker-Beschriftung „WESTUNION TV", rechte Kante symmetrisch) und vertikal ins Zentrum des Screens rücken → aktuell schwebt ein Mini-Diagramm in leerem Blau.
- Zahlenanzeige „27,0 %" → ~1,5× vergrößern, rechtsbündig zur Balken-Rechteckkante ausrichten → sie ist die wichtigste Zahl im Bild und currently kleiner als das „LIVE"-Badge.
- „SCHWELLE"-Label → über den Tick setzen mit ~1,3× Größe und Verbindungslinie zum Tick → Label schwebt aktuell ohne erkennbaren Bezug.
- „Klicken zum Fortfahren" → in einen dezenten, aber lesbaren Zustand heben (textSecondary statt muted, ~1,2×) oder als pulsierenden Hinweis → primäre Interaktion des Screens darf nicht die schwächste Textebene sein.
- Leere Screen-Fläche → mit subtilem TV-Rauschen/Scanline-Textur füllen (stilguid-konform, sehr dezent) → reduziert Totraum, ohne die Zahl zu konkurrieren.

**`end_victory_wahlabend_s1.png`**
- Schwellen-Tick → als durchgehende vertikale Linie über die volle Balkenhöhe ziehen, Farbe warning-Amber, ~2× so dick → der dramatische Moment „knapp drüber" muss auf einen Blick lesbar sein.
- Ticker-Zeile „Damit ist klar – die Regierung ist abgewählt." → Ergebnis-Wortgruppe („abgewählt") in ministryRed heben → der Ticker ist hier Nachricht UND Urteil, verdient eine Betonung.
- Balkenbreite/Zentrierung wie bei s0 → Konsistenz zwischen den Schritten, sonst „springt" das Layout beim Wechsel.
- „27,0 %" bleibt stehen, obwohl der Balken voll ist → prüfen, ob die Zahl weiterzählen soll; falls final, als solchen kennzeichnen (z. B. „ENDSTAND") → sonst wirkt es eingefroren.

**`end_victory_wahlabend_s2.png`**
- Gekapptes „● LIVE"-Badge am oberen Rand → Scroll-Anker so setzen, dass der komplette Frame-Rahmen sichtbar ist, oder Frame-Höhe reduzieren → ein beschnittener Rahmen wirkt wie Layoutfehler, nicht wie Absicht.
- Kurator-Telefon-Zitat → in einen eigenen Träger geben (schmales Papierkärtchen, surfaceLight, Innenabstand ~16 px, Breite = Textbreite +10 %) → aktuell schwebt der Text trägerlos zwischen zwei Welten.
- Pills und WEITER wie bei `end_immune_wahlabend_s2` behandeln (Raster + Stamp-CTA) → beide Endings müssen dasselbe Bedien-Raster nutzen.

**`end_victory_wahlabend_s3.png`**
- Geisterzeile „A Manufactured Majority" über dem Panel → entfernen oder auf textSecondary heben → halbsichtbarer Text wirkt wie Renderfehler.
- Chart: Y-Achsenlabel „Vertrauen" und Prozentskala → jeweils ~1,3× vergrößern, Skala linksbündig mit festem Abstand zur Linie → die Achse ist derzeit dekorativ statt ablesbar.
- Schwellen-Label „40 %" → vom rechten Rand weg an die gestrichelte Linie binden (direkt über der Linie, linksbündig zum Linienende) → Label schwebt randnah ohne Bezug.
- Füllfläche unter der Linie → Sättigung eine Stufe senken oder auf oldPaper tönen → aktuell konkurriert die Grau-Grün-Fläche mit der Linie um Aufmerksamkeit, dabei ist die Linie die Information.

## 3. Grafiken/Assets

- **Tragend:** Der „GEFÄLSCHT"-Stempel (`end_immune_wahlabend_s2.png`) ist das beste Asset des Bündels — richtige Rotation, richtige Tinten-Unregelmäßigkeit, klare Botschaft. Nur Platzierung und Größe relativ zur Schlagzeile stimmen nicht.
- **Fremd:** Die Pill-Buttons auf beiden s2-Screens wirken stilistisch wie aus einem anderen Projekt — dünner Rahmen, Radio-Kreis, Mono-Text auf Dunkel, während die Welt laut theme.ts aus Papierflächen mit `border`-Rahmen besteht. Sie sollten als kleine Papierzettel (surface, borderLight, Tinte) gebaut werden.
- **Falsch skaliert:** Der Fortschrittsbalken (`end_victory_wahlabend_s0/s1`) ist zu klein für seine Bühne — als Diagramm in einem leeren Fullscreen-TV wirkt er wie ein Thumbnail. Entweder Balken vergrößern oder Bühne verkleinern.
- **Fehlend:** Auf `end_immune_wahlabend_s2.png` wird ein Bürogebäude mit Blaulicht *beschrieben*, aber nicht gezeigt — genau diese Silhouette würde die untere tote Frame-Hälfte füllen und die Erzählung tragen. Das ist die wertvollste fehlende Grafik des Bündels.
- **Fehlend:** Auf `end_immune_gameend.png` fehlt jedes unterscheidende Eigen-Asset des GameEndScreens.
- **Kanten/Konsistenz:** Die Charts (Vertrauensverlauf) sind sauber gezeichnet, aber die Achsentypografie ist deutlich kleiner als jede andere Beschriftung im Report — Skalen- und Achsentext gehören auf die nächsthöhere Textebene.

## 4. Raster & Rhythmus

- **Größtes Rasterproblem:** Die s2-Screens brechen ihr eigenes Zentrumssystem — TV-Frame zentriert, Pills zentriert mit wechselnder Reihenlänge (2/3/1), WEITER zentriert. Drei verschiedene Zentren-Logiken übereinander erzeugen den Zickzack. Lösung: Eine gemeinsame Inhaltsspalte (Breite ≈ 60 % der Frame-Breite) definieren, alles darin linksbündig ausrichten; nur Frame und WEITER bleiben zentriert.
- **Totraum:** `end_victory_wahlabend_s0/s1`: ~70 % der TV-Fläche sind leer. `end_immune_wahlabend_s2`: untere Frame-Hälfte leer. Beide Male könnte Inhalt (Silhouette, größeres Diagramm) die Fläche tragen.
- **Trennung fehlt:** Auf den Report-Screens grenzt der Kopfbalken hart an den Papierkörper ohne Zwischenraum oder Trennlinie; die Statistik-Zeile verschmilzt mit der Kante.
- **Unruhe:** Report-Kartenreihen mit ungleichen Unterkanten (`end_immune_endreport_mid.png`); der rechts floatende Lagebericht-Button durchbricht auf allen vier Report-Shots die Panel-Kante und erzeugt an derselben Stelle denselben Konflikt.
- **Durchblutung:** Unter `end_immune_endreport_mid/bottom` schimmert der darunterliegende Screen durch — fehlende Abdunklung des Modal-Kontexts.

## 5. Lesbarkeit

- **Zweimal hingesehen:** „ENT TAR NUNG"/„HOFFNUNGSVOLL" (`end_immune_*_s3/top`) — Letter-Spacing zerbricht Wörter.
- **Zweimal hingesehen:** „Unten im Bild: Ihr Bürogebäude…" (`end_immune_wahlabend_s2.png`) — Regieanweisung als UI-Text.
- **Kontrast-Fails:** „VOLLSTÄNDIGER LAGEBERICHT →" (graue Schrift auf Schwarz, alle vier Report-Shots); Schlagzeile „IHRE SCHLAGZEILEN – GEPRÜFT" (dunkelrot auf dunkelrot); Geisterzeile „A Manufactured Majority" (`end_victory_wahlabend_s3.png`); „Klicken zum Fortfahren" (`end_victory_wahlabend_s0/s1`).
- **Zustände:** Der aktive Milieu-Pill-Zustand ist nicht erkennbar — alle fünf Pills sehen gleich aus; wenn sie Zustände anzeigen („schaltet ab"), fehlt die visuelle Differenzierung aktiv/inaktiv.
- **Textmengen:** Die Report-Fließtextabsätze sind mit ~2–3 Zeilen pro Block gut dosiert; einzige Ausnahme ist die Kartenbeschreibung „Zusammenbruch" (`mid/bottom`), die mit vier Zeilen das längste Kästenfeld ist und die Reihe sprengt.

## 6. Die drei wirksamsten Änderungen

1. **CTA-System auf beiden s2-Screens reparieren** (`end_immune_wahlabend_s2.png`, `end_victory_wahlabend_s2.png`): WEITER auf `stampCtaStyle` umstellen und die fünf Pills in ein linksbündiges Fest raster mit gemeinsamer Innenkante bringen. Ein CSS-/Klassenwechsel plus Umbruch-Logik — beseitigt zugleich den Rot-Token-Verstoß und den größten Rhythmusfehler des Bündels.
2. **TV-Inhalt auf den Wahlabend-Screens komponieren**: Balkenblock auf ~80 % Framebreite vergrößern und zentrieren (s0/s1), bzw. Stempel/Schlagzeile ins Zentrum rücken und die beschriebene Gebäude-Silhouette tatsächlich zeigen (immune s2). Größter Einzelhebel gegen die dominierende Totraum- und Blickführungsproblematik.
3. **Float-Button „VOLLSTÄNDIGER LAGEBERICHT" in das Panel integrieren** (alle vier Report-Shots): rechtsbündig unter den letzten Inhaltsblock, Panel-Innenkante, Kontrast auf textPrimary/textSecondary. Eliminiert auf vier Screens gleichzeitig eine Kantenkollision und einen Kontrast-Fail — dreizehn Zeilen Layout-Änderung, vier Screens gewonnen.

## 7. Blinde Flecken

- **Duplikate:** `end_immune_gameend.png` ≡ `end_immune_endreport_top.png` und `end_immune_endreport_bottom.png` ≡ `end_immune_endreport_mid.png` — ich kann GameEndScreen und das Report-Ende nicht beurteilen. Benötigt: echter GameEndScreen-Zustand sowie der Zustand nach Klick auf „BERICHT SCHLIESSEN".
- **Scroll-Verhalten:** Die beschnittenen Frame-Oberkanten auf beiden s2-Shots — ist das Mid-Scroll-Capture oder bricht das Layout? Volllbild-Shots ohne Scroll würden das klären.
- **Animation/Timing:** Der Balkenfüllvorgang s0→s1 (Tan→Rot), das Stempel-Aufschlag-Moment und das Ticker-Durchrollen sind als Standbilder nicht bewertbar — Sequenz-Aufnahmen in 2–3 Zwischenzuständen wären nötig.
- **Hover/Fokus:** Pill-Zustände, Karten-Hover im „MÖGLICHE SPIELENDEN"-Raster, Hover auf „BERICHT SCHLIESSEN" und auf dem Lagebericht-Float — keiner davon ist in den Standbildern sichtbar.
- **Chart-Dynamik:** Ob der Vertrauensverlauf eingezeichnet/animiert wird und wie die gestrichelte Schwelle bei Werten nahe 40 % aussieht, zeigt nur `end_victory_wahlabend_s3.png` ansatzweise; ein Shot mit stark fallender Kurve fehlt.
- **Kleine Auflösung:** Die Ticker-Schrift und die Chart-Achsen liegen an der Grenze der Erkennbarkeit in diesen Captures — Originalauflösung oder Zoom-Crops dieser Bereiche würden die Lesbarkeitsurteile absichern.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
