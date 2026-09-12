# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „ending-4von4"

**Modell:** `gpt-5.6-sol` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-22
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-22T17:19:07.670Z · **Dauer:** 164.6 s
**Nutzung:** nicht gemeldet · **Kosten:** unbekannt · **Anbieter-Datensammlung:** ausgeschlossen (deny)

> ⚠️ **Wie das zu lesen ist:** Ein *fremdes* Modell hat einen **kuratierten Ausschnitt**
> des Projekts gesehen — nicht das laufende Spiel und nicht das ganze Repository. Es kann
> daher weder Laufzeitverhalten prüfen noch `file:line`-Belege verifizieren. Befunde sind
> **Hypothesen**, die vor dem Umsetzen am Code/an den Daten gegenzuprüfen sind. Die
> kanonische Wahrheit bleibt [`docs/VISION_LOCK.md`](../VISION_LOCK.md) bzw. die Spieldaten.

## Gestellte Frage

Sieh dir die beigefügten Screenshots des laufenden Spiels an und mache einen UX/UI-Durchgang. Die Optik soll eine Behörden-/Papierwelt sein (Stil-Anker und Farbtoken liegen bei). Sag mir: Wo führt das Bild den Blick falsch, welche Grafiken sitzen an der falschen Stelle oder in der falschen Größe, wo stimmen Abstände und Ausrichtung nicht, und welche drei Änderungen bringen am meisten? Sei so konkret, dass man es direkt umsetzen kann.

## Dieser Durchgang: Bündel „ending-4von4" (10 Screenshots)

Das siehst du, in dieser Reihenfolge:
- fixture_wahlabend_timeout_s2.png — Wahlabend-Fixture (timeout): Schritt 2 (Ergebnis/Stempel)
- fixture_wahlabend_timeout_s3.png — Wahlabend-Fixture (timeout): Schritt 3 (Wohnzimmer-Schnitt + Nachsatz)
- fixture_wahlabend_immune_s0.png — Wahlabend-Fixture (immune): Titelkarte
- fixture_wahlabend_immune_s1.png — Wahlabend-Fixture (immune): Schritt 1 (Hochrechnung/Sondersendung)
- fixture_wahlabend_immune_s2.png — Wahlabend-Fixture (immune): Schritt 2 (Ergebnis/Stempel)
- fixture_wahlabend_immune_s3.png — Wahlabend-Fixture (immune): Schritt 3 (Wohnzimmer-Schnitt + Nachsatz)
- fixture_wahlabend_exposed_s0.png — Wahlabend-Fixture (exposed): Titelkarte
- fixture_wahlabend_exposed_s1.png — Wahlabend-Fixture (exposed): Schritt 1 (Hochrechnung/Sondersendung)
- fixture_wahlabend_exposed_s2.png — Wahlabend-Fixture (exposed): Schritt 2 (Ergebnis/Stempel)
- fixture_wahlabend_exposed_s3.png — Wahlabend-Fixture (exposed): Schritt 3 (Wohnzimmer-Schnitt + Nachsatz)

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
| 🖼 Bild | `fixture_wahlabend_timeout_s2.png` | `desinformation-network/runs/visual-review/latest/shots/fixture_wahlabend_timeout_s2.png` | 129 kB |
| 🖼 Bild | `fixture_wahlabend_timeout_s3.png` | `desinformation-network/runs/visual-review/latest/shots/fixture_wahlabend_timeout_s3.png` | 149 kB |
| 🖼 Bild | `fixture_wahlabend_immune_s0.png` | `desinformation-network/runs/visual-review/latest/shots/fixture_wahlabend_immune_s0.png` | 178 kB |
| 🖼 Bild | `fixture_wahlabend_immune_s1.png` | `desinformation-network/runs/visual-review/latest/shots/fixture_wahlabend_immune_s1.png` | 151 kB |
| 🖼 Bild | `fixture_wahlabend_immune_s2.png` | `desinformation-network/runs/visual-review/latest/shots/fixture_wahlabend_immune_s2.png` | 159 kB |
| 🖼 Bild | `fixture_wahlabend_immune_s3.png` | `desinformation-network/runs/visual-review/latest/shots/fixture_wahlabend_immune_s3.png` | 181 kB |
| 🖼 Bild | `fixture_wahlabend_exposed_s0.png` | `desinformation-network/runs/visual-review/latest/shots/fixture_wahlabend_exposed_s0.png` | 178 kB |
| 🖼 Bild | `fixture_wahlabend_exposed_s1.png` | `desinformation-network/runs/visual-review/latest/shots/fixture_wahlabend_exposed_s1.png` | 151 kB |
| 🖼 Bild | `fixture_wahlabend_exposed_s2.png` | `desinformation-network/runs/visual-review/latest/shots/fixture_wahlabend_exposed_s2.png` | 160 kB |
| 🖼 Bild | `fixture_wahlabend_exposed_s3.png` | `desinformation-network/runs/visual-review/latest/shots/fixture_wahlabend_exposed_s3.png` | 182 kB |

---

## Antwort des Modells

## 1. **Erster Eindruck**

### `fixture_wahlabend_timeout_s2.png`

Das Auge landet zuerst auf dem einzigen größeren Inhalt, dem Balken in der Bildschirmmitte. Eigentlich sollte zuerst das Wahlergebnis beziehungsweise das Verfehlen der Schwelle verstanden werden; derzeit muss man das aus Füllstand, Markierung und „15.3 %“ selbst zusammensetzen. „Westunion Erwacht“ ist durch das Rot auffälliger als die entscheidende Zahl und führt die Hierarchie damit falsch. Der fast vollständig leere Fernsehschirm lässt das Ergebnis klein und unfertig wirken. Die Meldung im unteren Senderband erklärt den Ausgang deutlicher als die eigentliche Ergebnisgrafik, obwohl sie visuell nachgeordnet ist.

### `fixture_wahlabend_timeout_s3.png`

Der Blick springt zwischen dem Ergebnisbalken, dem Nachsatz unter dem Fernseher und dem roten „WEITER“-Button am unteren Rand. Der angekündigte Wohnzimmer-Schnitt ist nicht sichtbar; stattdessen bleibt exakt die abstrakte Ergebnisgrafik stehen. Dadurch hat der Nachsatz „Im Büro …“ keine visuelle Szene, an die er anschließen kann. Die fünf kleinen Milieu-Zustände erzeugen unterhalb des großen TV-Rahmens kleinteilige Unruhe, ohne eine klare Leserichtung zu bilden. Der Button ist zwar deutlich, klebt aber so dicht am unteren Bildrand, dass er wie abgeschnitten wirkt.

### `fixture_wahlabend_immune_s0.png`

Der Titel „DIE HOCHRECHNUNG“ ist der klare erste Blickpunkt und damit grundsätzlich richtig priorisiert. Danach fällt der Blick allerdings in eine nahezu vollständig schwarze Fläche, weil es weder Büro-Silhouette noch Papier- oder Fernsehrahmen gibt. Der Untertitel ist deutlich kleiner und schwächer, als es für die einzige narrative Information der Karte sinnvoll wäre. „Klicken zum Fortfahren“ wirkt eher wie eine Debug-Anweisung als wie eine bewusste Interaktion. Die Titelkarte vermittelt Dunkelheit, aber noch nicht die im Text behauptete Situation „Nur der News-Fernseher läuft“.

### `fixture_wahlabend_immune_s1.png`

Zuerst fällt der rote Fernsehgrund auf, erst danach die Überschrift „IHRE SCHLAGZEILEN – GEPRÜFT“. Innerhalb der Fläche ist die Liste zu klein, um das große Format des Bildschirms zu rechtfertigen; sie wirkt wie ein Textblock, der in einer leeren Vorlage sitzt. Die eigentliche „Sondersendung“ oben rechts ist so klein und kontrastarm, dass sie erst beim zweiten Hinsehen auffällt. Der Blick sollte von „Sondersendung“ zur Prüfüberschrift und dann zeilenweise durch die Behauptungen laufen. Stattdessen konkurriert die große rote Fläche mit allen Informationen und gewinnt.

### `fixture_wahlabend_immune_s2.png`

Der große diagonale Stempel „GEFÄLSCHT“ ist eindeutig der erste Blickpunkt. Das ist für den Ergebnis-Moment passend, aber er liegt so weit über der Liste, dass die geprüften Behauptungen kaum noch einzeln lesbar sind. Die Durchstreichungen und der Stempel erzählen denselben Zustand doppelt, während rechts und unten sehr viel ungenutzte Fläche bleibt. Der erklärende Satz im Senderband ist inhaltlich wichtig, visuell aber weit vom Stempel getrennt. Als Immunitäts-Ausgang ist die Aussage klar, die genaue Ursache beziehungsweise die vier entkräfteten Behauptungen jedoch nicht mehr gut erfassbar.

### `fixture_wahlabend_immune_s3.png`

Der Stempel bleibt der dominante Blickpunkt, obwohl dieser Schritt laut Aufbau den Wohnzimmer-Schnitt und den Nachsatz tragen sollte. Im Bild ist weder ein Wohnzimmer noch das im Nachsatz genannte Bürogebäude mit Blaulicht zu sehen. Die Zeile „Unten im Bild: Ihr Bürogebäude, Blaulicht“ widerspricht daher direkt dem sichtbaren Inhalt. Unter dem TV entsteht eine zweite, sehr dichte UI-Zone aus Nachsatz, fünf Zustandsmarken und Button, die räumlich kaum Luft hat. Der rote Vollflächen-Button konkurriert zusätzlich mit dem roten Stempel, obwohl nur einer von beiden der finale Bedeutungsanker sein sollte.

### `fixture_wahlabend_exposed_s0.png`

Der erste Blick geht wie bei `fixture_wahlabend_immune_s0.png` auf „DIE HOCHRECHNUNG“. Die Karte ist visuell identisch und enthält noch keinen Hinweis auf den späteren Exposed-Ausgang, was für einen gemeinsamen Auftakt plausibel ist. Dennoch bleibt die schwarze Umgebung so leer, dass sie eher wie eine Zwischenblende als wie ein dunkles Büro wirkt. Untertitel und Fortfahren-Hinweis sind für ihre feine Pixelschrift zu klein und zu kontrastarm. Die Bildmitte ist sauber gesetzt, aber die gesamte Komposition nutzt nur einen sehr kleinen Teil der verfügbaren Fläche.

### `fixture_wahlabend_exposed_s1.png`

Der rote Bildschirmkörper dominiert stärker als die Schlagzeilenliste. Die Hierarchie entspricht praktisch vollständig `fixture_wahlabend_immune_s1.png`; auch hier ist „SONDERSENDUNG“ zu schwach und die Liste zu klein. Die vier Zeilen stehen korrekt untereinander, aber der große Leerraum ober- und unterhalb macht sie nicht wichtiger, sondern isolierter. Der Sendertext unten ist heller und dadurch beinahe auffälliger als die eigentliche Prüfüberschrift. Der Screen erklärt eine Unterbrechung, zeigt visuell aber noch keine Hochrechnung, Moderation oder Beweislage.

### `fixture_wahlabend_exposed_s2.png`

Der „GEFÄLSCHT“-Stempel ist erneut der klare erste Blickpunkt. Visuell unterscheidet sich dieser Ausgang von `fixture_wahlabend_immune_s2.png` fast nur durch den Satz im unteren Senderband, obwohl „Faktencheck“ und „Netzwerk aufgedeckt“ unterschiedliche Eskalationsgrade beschreiben. Der Stempel überdeckt die Liste und verhindert, dass die konkreten Behauptungen als Beweiskette gelesen werden. Die Aussage „wir zeigen die Belege“ wird durch keine sichtbare Beleg-, Akten- oder Netzwerkdarstellung gestützt. Das Bild sagt daher allgemein „falsch“, aber noch nicht überzeugend „aufgedeckt“.

### `fixture_wahlabend_exposed_s3.png`

Der Blick bleibt am Stempel hängen, danach zieht der rote „WEITER“-Button nach unten. Der angekündigte Wohnzimmer-Schnitt ist auch hier nicht sichtbar; ebenso fehlt das im Text behauptete Bürogebäude mit Blaulicht. Die Zustandsmarken zwischen Nachsatz und Button sind zu klein, um beim ersten Lesen als Folgen für verschiedene Milieus verstanden zu werden. Der gesamte untere Block sitzt unter Druck zwischen TV-Rahmen und Bildschirmkante. Der Exposed-Ausgang sollte visuell die stärkste Eskalation dieses Bündels sein, sieht aber nahezu genauso aus wie der Immune-Ausgang.

---

## 2. **Konkrete Eingriffe je Screen**

### `fixture_wahlabend_timeout_s2.png`

- Ergebnisblock → auf etwa das 1,25- bis 1,35-Fache vergrößern und als zusammenhängende Gruppe etwas oberhalb der TV-Mitte setzen → die entscheidende Information verliert sich derzeit in der leeren Fläche.
- „15.3 %“ → direkt über dem Ende der Füllung oder rechts daneben platzieren und mindestens so groß wie „Westunion Erwacht“ setzen → Zahl und gemessener Balken müssen als Einheit lesbar sein.
- Schwellenmarke → vertikale Linie höher ausführen und „SCHWELLE“ unmittelbar darüber mit stärkerem Kontrast setzen → die Ursache des Scheiterns ist momentan nur bei genauem Hinsehen erkennbar.
- Ergebnisstatus → den Abstand zwischen Füllende und Schwelle mit einem kurzen, deutlich lesbaren Status direkt am Balken kennzeichnen → der Spieler sollte nicht allein aus der Geometrie folgern müssen, dass die Schwelle verfehlt wurde.
- Senderband → Textzeile um etwa eine Schriftstufe vergrößern und oben sowie unten je ungefähr eine Zeilenhöhe Innenraum geben → sie ist aktuell klarer als die Grafik, aber unnötig eng gefasst.

### `fixture_wahlabend_timeout_s3.png`

- TV-Rahmen → auf etwa zwei Drittel der Viewporthöhe begrenzen und mit einem klaren oberen Sicherheitsabstand setzen → der Nachsatzbereich braucht einen reservierten unteren Abschnitt statt Restfläche.
- TV-Inhalt → Ergebnisbalken in diesem Schritt durch den tatsächlich angekündigten Wohnzimmer-/Büroschnitt ersetzen oder deutlich als Bild-in-Bild ergänzen → der sichtbare Inhalt erfüllt die Szenenbeschreibung nicht.
- Nachsatz → in eine eigene, etwa drei Viertel der TV-Breite breite Papierzeile direkt unter dem Rahmen setzen → Text und Bildfolge werden dadurch als zusammengehöriger Epilog gelesen.
- Milieu-Zustände → in einer einzigen gleichmäßigen Fünferspalte oder in zwei symmetrischen Reihen mit identischen Kapselbreiten anordnen → die unterschiedlichen Textlängen erzeugen derzeit eine zackige Mitte.
- „WEITER“ → mindestens eine halbe Buttonhöhe vom unteren Rand abrücken und gemäß `stampCtaStyle` als heller Papierknopf mit rotem Doppelring statt als rote Vollfläche gestalten → der Button wirkt momentan gequetscht und verletzt die Papier-/Stempellogik.

### `fixture_wahlabend_immune_s0.png`

- Titelgruppe → insgesamt etwa 15–20 % vergrößern und als kompakte Einheit knapp oberhalb der geometrischen Mitte halten → die Gruppe ist gegenüber der schwarzen Fläche unterdimensioniert.
- „WAHLTAG · WESTUNION“ → näher an den Titel rücken, etwa um ein Drittel des jetzigen Zwischenraums → Kopfzeile und Haupttitel wirken momentan lose statt wie eine Titelkarte.
- Untertitel → auf ungefähr 70 % der visuellen Breite des Haupttitels bringen und eine Schriftstufe anheben → die narrative Situation darf nicht wie Kleingedrucktes aussehen.
- Fortfahren-Hinweis → Abstand zum Untertitel vergrößern, Kontrast erhöhen und eine sichtbare Eingabeform wie `[KLICKEN]` oder eine umrandete Papiermarke verwenden → derzeit ist der Interaktionszustand zu unauffällig.
- Hintergrund → hinter der Titelgruppe eine sehr dunkle, niedrig kontrastierte Büro-/Fernseher-Silhouette einziehen → Schwarz soll als Raum gelesen werden, nicht als fehlendes Asset.

### `fixture_wahlabend_immune_s1.png`

- Schlagzeilenblock → auf etwa 1,2-fache Größe bringen und seine Breite bis ungefähr zur Hälfte des TV-Innenraums erweitern → die vier Zeilen sind für die Hauptinformation zu klein.
- „SONDERSENDUNG“ → auf mindestens die Höhe der Prüfüberschrift vergrößern und mit einem Innenabstand von ungefähr zwei Versalhöhen von oberer und rechter Rahmenkante setzen → der Live-Zustand klebt derzeit klein in der Ecke.
- Prüfüberschrift → näher an die Liste setzen, etwa eine halbe statt einer ganzen Textzeile Abstand → Überschrift und Inhalte sollen als eine Dokumentgruppe gelesen werden.
- Zeilenabstand der Schlagzeilen → um etwa ein Viertel erhöhen und die Pfeile in einer eigenen schmalen Spalte ausrichten → die langen Pixelzeilen laufen momentan optisch zusammen.
- Senderband → „WESTUNION TV“ und Meldung an derselben Grundlinie ausrichten und den Sendernamen weniger dunkel setzen → der linke Absender ist aktuell fast dekorativ statt funktional.

### `fixture_wahlabend_immune_s2.png`

- „GEFÄLSCHT“-Stempel → in die freie rechte Hälfte verschieben, sodass seine linke Kante erst hinter dem Ende der längsten Schlagzeile beginnt → die Liste bleibt lesbar und der Stempel behält seine Dominanz.
- Stempelgröße → höchstens etwa ein Drittel der TV-Innenbreite verwenden und die Neigung etwas reduzieren → der aktuelle Stempel überdeckt zu viele Informationszeilen.
- Durchstreichungen → etwas kräftiger, aber jeweils exakt auf die Textgrundlinie setzen → momentan entstehen mehrere dünne, flimmernde Linien durch die kleine Pixelschrift.
- Schlagzeilenliste → Schrift und Zeilenabstand wie in `fixture_wahlabend_immune_s1.png` vergrößern → der Ergebniszustand darf die vorher lesbaren Belege nicht unlesbar machen.
- Senderband → den Satz „Faktenchecker erklären …“ mit einem kurzen Abstand vom Sendernamen beginnen und eine Stufe größer setzen → er liefert die eigentliche Erklärung des Ausgangs.

### `fixture_wahlabend_immune_s3.png`

- TV-Inhalt → den statischen Stempel-Screen durch den angekündigten Wohnzimmer-Schnitt beziehungsweise das Bürogebäude mit Blaulicht ablösen → Bild und Nachsatz widersprechen sich derzeit.
- Nachsatzzeile → direkt unter dem Bild in eine helle Aktennotiz mit klarer linker Kante setzen, statt sie frei auf Schwarz zu zentrieren → die Papierwelt wird außerhalb des diegetischen Fernsehers sichtbar.
- Milieu-Zustände → unter einer kurzen gemeinsamen Bezugszeile gruppieren und auf gleiche Höhe sowie gleiche horizontale Innenabstände bringen → Formen und Farben sind ohne Gruppierung schwer zu decodieren.
- Unterer Bereich → mindestens ein Zehntel der Viewporthöhe als sicheren Rand unter dem Button reservieren → der Button sitzt praktisch auf der Bildschirmkante.
- „WEITER“ → rote Vollfläche durch die in `desinformation-network/src/story-mode/theme.ts` definierte helle Stempel-CTA ersetzen → so konkurriert die Aktion nicht mit dem inhaltlichen „GEFÄLSCHT“-Stempel.

### `fixture_wahlabend_exposed_s0.png`

- Titelgruppe → wie in `fixture_wahlabend_immune_s0.png` etwa 15–20 % vergrößern und kompakter staffeln → die schwarze Fläche überwiegt zu stark.
- Untertitel → eine Schriftstufe größer und mit höherem Hell-Dunkel-Kontrast setzen → die einzige Szenenbeschreibung verlangt derzeit genaues Hinsehen.
- Fortfahren-Hinweis → sichtbarer vom Untertitel trennen und als Interaktion rahmen → momentan sieht er wie eine weitere Erzählzeile aus.
- Hintergrund → sehr subtile Bürogeometrie oder TV-Lichtkegel im äußeren Schwarz ergänzen → die behauptete räumliche Situation fehlt.
- Vertikale Position → Titelgruppe geringfügig nach oben verschieben und darunter mehr Raum für den Interaktionshinweis lassen → Titel und Eingabehinweis bilden derzeit keinen klaren Rhythmus.

### `fixture_wahlabend_exposed_s1.png`

- Schlagzeilenblock → um etwa 20 % vergrößern und seine linke Kante mit dem Beginn des Sendernamens im unteren Band ausrichten → dadurch entsteht eine durchgehende vertikale Bezugskante.
- „SONDERSENDUNG“ → deutlich größer, heller und weiter von den Rahmenkanten abrücken → der Status ist aktuell nur beim zweiten Blick erkennbar.
- Liste → Pfeile, Textanfänge und Zeilenenden in ein klares Zweispaltenraster bringen → die vier unterschiedlich langen Zeilen bilden derzeit eine unruhige rechte Kante.
- TV-Grundfläche → Sättigung und Helligkeit des flächigen Rottons reduzieren; Rot nur für Kopfzeile und spätere Stempel behalten → die Fläche konkurriert unnötig mit allen roten Signalen.
- Senderband → Textgröße und vertikalen Innenraum erhöhen → die Meldung ist inhaltlich zentral, wirkt aber wie ein schmaler Untertitelstreifen.

### `fixture_wahlabend_exposed_s2.png`

- Ergebnisdarstellung → zusätzlich zum Stempel eine klar abgegrenzte rechte Belegzone oder Aktenfläche vorsehen → „Netzwerk aufgedeckt“ braucht visuell mehr als dieselbe Fälschungsmarke des Immune-Ausgangs.
- „GEFÄLSCHT“-Stempel → aus der Liste heraus nach rechts verschieben und etwas verkleinern → die konkreten Behauptungen müssen als Belege lesbar bleiben.
- Branchendifferenz → den Exposed-Zustand über eine zweite visuelle Ebene wie Verbindungsmarken, Aktenreiter oder Belegnummern differenzieren, nicht nur über den Satz im Senderband → aktuell sehen Immune und Exposed nahezu identisch aus.
- Schlagzeilen → Schriftgröße und Zeilenabstand erhöhen; die längste Zeile darf höchstens etwa zwei Drittel der linken Inhaltsspalte belegen → die Durchstreichung macht die kleine Schrift sonst unlesbar.
- Senderband → die Meldung „wir zeigen die Belege“ stärker gewichten und links an der Inhaltsgruppe ausrichten → sie ist das branchenspezifische Ergebnis, aber visuell nur Untertitel.

### `fixture_wahlabend_exposed_s3.png`

- TV-Inhalt → den Stempel-Screen durch das behauptete Bild vom Bürogebäude mit Blaulicht beziehungsweise den Wohnzimmer-Schnitt ersetzen → der wichtigste narrative Bildwechsel fehlt vollständig.
- Bildaufteilung → TV-Bereich auf etwa zwei Drittel der Höhe begrenzen und den unteren Epilogbereich als eigenes Papierpanel reservieren → gegenwärtig wird der Abschluss an den unteren Rand gedrückt.
- Nachsatz → linksbündig innerhalb dieses Panels statt frei zentriert setzen und auf maximal zwei Drittel der Panelbreite begrenzen → der Text erhält eine stabile Lesekante.
- Milieu-Zustände → einheitliche Breite, einheitliche Symbolspalte und gleich große Zwischenräume verwenden → die jetzigen Kapseln wirken wie lose Debug-Badges.
- „WEITER“ → mit deutlichem unteren Sicherheitsabstand und als heller Stempelknopf darstellen → die rote Vollfläche ist zu dominant und zu randnah.
- Exposed-Folge → im Bildbereich eine deutlich stärkere visuelle Eskalation als in `fixture_wahlabend_immune_s3.png` zeigen → der schwerere Ausgang ist momentan fast nur textlich unterscheidbar.

---

## 3. **Grafiken/Assets**

- Der diagonale Stempel in `fixture_wahlabend_immune_s2.png`, `fixture_wahlabend_immune_s3.png`, `fixture_wahlabend_exposed_s2.png` und `fixture_wahlabend_exposed_s3.png` trägt die Ergebnisbotschaft am stärksten. Kantenschärfe und Pixelstil sind konsistent, seine Platzierung zerstört jedoch die Lesbarkeit der darunterliegenden Liste.
- Die CRT-Scanlines in den TV-Screens vermitteln Sendeästhetik, sind aber auf der großflächigen roten Fläche zu dominant. Besonders in `fixture_wahlabend_immune_s1.png` und `fixture_wahlabend_exposed_s1.png` verstärken sie das Flimmern der kleinen Schrift.
- Der braune TV-Rahmen ist in allen Sende-Screens sauber, aber sehr flach. Eine klarere Materialtrennung zwischen Außenrahmen, Bildschirm und Senderband würde mehr Tiefe erzeugen, ohne den Pixelstil zu verlassen.
- Die gleichmäßig dunkelrote Bildschirmfläche widerspricht der Regel aus `desinformation-network/src/story-mode/theme.ts`, Ministeriums-Rot nur für Stempel, Kopfbänder und Alarm einzusetzen. Als diegetische Sondersendung ist Rot vertretbar, aber nicht als nahezu vollständige Hintergrundfüllung; ein dunkler neutraler oder blau-schwarzer Schirm mit rotem Kopfband wäre näher am gesetzten System.
- In `fixture_wahlabend_timeout_s2.png` und `fixture_wahlabend_timeout_s3.png` wirkt der Balken wie eine UI-Komponente aus einem anderen System: flache braungraue Füllung, sehr dünner Rahmen und winzige Beschriftung. Er braucht dieselbe Material- und Typologik wie die Aktenwelt, etwa Papierstreifen, Stempelmarke oder sauberere Tintenlinien.
- Das größte fehlende Asset ist der angekündigte Wohnzimmer-/Büroschnitt in `fixture_wahlabend_timeout_s3.png`, `fixture_wahlabend_immune_s3.png` und `fixture_wahlabend_exposed_s3.png`. Besonders problematisch ist, dass der sichtbare Nachsatz ausdrücklich „Unten im Bild: Ihr Bürogebäude, Blaulicht“ behauptet, obwohl kein solches Bild vorhanden ist.
- Den Titelkarten `fixture_wahlabend_immune_s0.png` und `fixture_wahlabend_exposed_s0.png` fehlt eine sehr zurückhaltende Büro- oder TV-Silhouette. Laut `sprite-tool/public/context/game-style-guide.md` sollen selbst dunkle Szenen nicht leer wirken; derzeit ist die Fläche tatsächlich fast vollständig leer.
- Immune und Exposed benötigen in `fixture_wahlabend_immune_s2.png` gegenüber `fixture_wahlabend_exposed_s2.png` eine visuelle Differenz. „Faktencheck widerstanden“ kann beim Prüfstempel bleiben; „Netzwerk aufgedeckt“ braucht sichtbar Belege, Verbindungen oder eine Akten-/Ermittlungsstruktur, sonst bleibt der Unterschied nur im Untertitel.

---

## 4. **Raster & Rhythmus**

Die Sende-Screens verwenden grundsätzlich einen stabil zentrierten 4:3-Rahmen, aber die Inhalte darin nutzen kein ebenso klares Raster. In `fixture_wahlabend_immune_s1.png` und `fixture_wahlabend_exposed_s1.png` sitzt der Schlagzeilenblock links der Mitte, während „SONDERSENDUNG“ an einer unabhängigen rechten Kante hängt und das Senderband wiederum eigene Einzüge verwendet. Sinnvoll wäre ein gemeinsames Innenraster: linker Rand für Überschrift, Listenpfeile und Sendername; rechter Rand für Status und Prozentwerte.

In `fixture_wahlabend_timeout_s2.png` bildet der Balken zwar eine horizontale Achse, doch Label, Schwellenbezeichnung und Prozentwert besitzen keine gemeinsame Grundlinie. „Westunion Erwacht“ sitzt links über dem Balken, „SCHWELLE“ mittig und „15.3 %“ rechts höher; dadurch zerfällt eine zusammengehörige Messung in drei Teile.

Die s3-Screens haben das größte Aufteilungsproblem. In `fixture_wahlabend_timeout_s3.png`, `fixture_wahlabend_immune_s3.png` und `fixture_wahlabend_exposed_s3.png` beansprucht der TV-Rahmen fast die gesamte Höhe, während Nachsatz, Milieu-Badges und CTA in den verbleibenden unteren Streifen gepresst werden. Der Abschluss braucht eine feste Zweiteilung von ungefähr zwei Dritteln Bild-/TV-Zone und einem Drittel Epilog-/Bedienzone.

Die Milieu-Badges bilden zwei unterschiedlich breite, frei zentrierte Reihen. Das Zentrum springt dadurch von Zeile zu Zeile, und die Symbole stehen wegen unterschiedlicher Textlängen nicht untereinander. Entweder alle fünf in einer Reihe mit gleichen Zellen oder ein festes Drei-plus-zwei-Raster mit identischen Zellbreiten verwenden.

Tote Fläche entsteht vor allem innerhalb der Fernseher in den s1- und s2-Aufnahmen. Sie ist oben und unten zwar annähernd symmetrisch, aber der Inhaltsblock ist so klein, dass die Leere nicht als Spannung, sondern als ungenutzte Vorlage gelesen wird. In den s0-Titelkarten ist die Leere noch extremer, weil überhaupt keine räumliche Kontur vorhanden ist.

---

## 5. **Lesbarkeit**

- In `fixture_wahlabend_timeout_s2.png` und `fixture_wahlabend_timeout_s3.png` musste ich bei „SCHWELLE“ zweimal hinsehen. Größe, Farbe und Scanline-Hintergrund machen die wichtigste Vergleichsmarke zu schwach.
- „15.3 %“ ist in denselben Screens zwar heller, aber zu weit von Füllende und Schwellenlinie entfernt. Die Zahl ist lesbar, ihre Zuordnung jedoch nicht sofort eindeutig.
- „SONDERSENDUNG“ in `fixture_wahlabend_immune_s1.png`, `fixture_wahlabend_immune_s2.png`, `fixture_wahlabend_exposed_s1.png` und `fixture_wahlabend_exposed_s2.png` ist zu klein und Rot auf Dunkelrot zu kontrastarm.
- Die Schlagzeilen in allen immune/exposed s1-Screens sind gerade noch lesbar. In den s2- und s3-Screens werden sie durch Durchstreichung, Scanlines und den darüberliegenden Stempel deutlich schlechter.
- Der Stempel selbst ist gut lesbar, aber seine starke Dominanz macht die darunterliegenden Inhalte faktisch zu Hintergrundrauschen. Für ein Spiel, das Manipulationsmuster erklären soll, ist das problematisch: Die konkreten Behauptungen sollten nach dem Urteil weiterhin rekonstruierbar bleiben.
- „Klicken zum Fortfahren“ ist in allen s0-, s1- und s2-Aufnahmen zu klein und zu dunkel. Außerdem sieht der Hinweis nicht eindeutig aktiv aus, weil ihm Rahmen, Symbol oder Zustandswechsel fehlen.
- Die Nachsätze in den s3-Aufnahmen sind für ihre erzählerische Bedeutung zu klein. Besonders „Unten im Bild: Ihr Bürogebäude, Blaulicht …“ konkurriert mit fünf Badges direkt darunter und besitzt keine eigene Fläche.
- Die Milieu-Zustände in den s3-Screens sind wegen kleiner Schrift, schwacher Konturen und sehr kleiner Dreieck-, Quadrat- und Kreiszeichen schwer zu scannen. Die unterschiedlichen Symbole deuten Zustände an, aber ihre Bedeutung ist aus dem Einzelbild nicht verständlich.
- Der „WEITER“-Button ist lesbar, verwendet aber eine rote Vollfläche. Das widerspricht dem in `desinformation-network/src/story-mode/theme.ts` hinterlegten hellen Stempel-CTA und macht „Aktion“ und „Alarm/Fälschung“ farblich unnötig gleichwertig.
- Die Gold-/Ockertöne der Titelkarten und Fortfahren-Hinweise sind auf Schwarz atmosphärisch, aber bei der kleinen Pixelgröße zu schwach. Eine leichte Aufhellung oder größere Schrift wäre wirksamer als zusätzliche Sättigung.

---

## 6. **Die drei wirksamsten Änderungen**

1. **Die s3-Screens tatsächlich auf Wohnzimmer-/Bürobild umstellen und dafür ein festes Zwei-Zonen-Layout schaffen.**  
   `fixture_wahlabend_timeout_s3.png`, `fixture_wahlabend_immune_s3.png` und `fixture_wahlabend_exposed_s3.png` zeigen derzeit den angekündigten Bildwechsel überhaupt nicht; das ist der größte Bruch zwischen Text und sichtbarer Erzählung.

2. **Alle zentralen Informationsblöcke um etwa 20–30 % vergrößern und auf ein gemeinsames Innenraster setzen.**  
   Das behebt mit geringem Aufwand die größten Probleme in Balken, Schlagzeilen, Statuslabels, Senderband und Nachsätzen, ohne neue Assets zu verlangen.

3. **Rot auf Stempel und Sondersendungs-Kopfband begrenzen und die nicht-diegetische Abschluss-UI als helle Papier-/Stempeloberfläche ausführen.**  
   Damit werden Inhalt, Alarm und Bedienung sauber getrennt, der Vorgabe aus `desinformation-network/src/story-mode/theme.ts` entsprochen und die s3-Abschlüsse deutlich ruhiger.

---

## 7. **Blinde Flecken**

- Aus den Einzelbildern ist nicht erkennbar, ob Stempel, Durchstreichungen, Balkenfüllung oder Wohnzimmer-Schnitt animiert erscheinen. Für die Blickführung wären Frames unmittelbar vor, während und nach diesen Übergängen nötig.
- Unklar bleibt, ob der fehlende Wohnzimmer-/Büroschnitt in den s3-Aufnahmen ein tatsächlicher Implementierungsfehler oder ein falsch abgegriffener Zeitpunkt der Visual-Review-Ernte ist.
- Hover-, Fokus-, Tastatur- und Press-Zustände von „Klicken zum Fortfahren“ sowie „WEITER“ sind nicht sichtbar. Deshalb lässt sich die Interaktionsklarheit nur im statischen Grundzustand beurteilen.
- Die Bedeutung der Dreieck-, Quadrat- und Kreissymbole in den Milieu-Badges ist aus den Screenshots nicht ableitbar. Dafür wären aktive, neue, verschlechterte und unveränderte Vergleichszustände nötig.
- Nicht beurteilbar ist, ob die kleinen Schriften auf kleineren Auflösungen umbrechen oder abgeschnitten werden. Dafür werden mindestens Aufnahmen unterhalb der gezeigten 1280×720-Darstellung benötigt.
- Scanline-Flimmern, Textschärfe bei Bewegung und die Lesbarkeit auf nicht ganzzahlig skalierten Displays lassen sich aus den PNGs nicht zuverlässig bewerten.
- Es ist nicht sichtbar, ob Immune und Exposed vor oder nach den gezeigten Frames weitere branchenspezifische Grafiken erhalten. In den vorliegenden Aufnahmen unterscheiden sie sich fast ausschließlich durch den Text im Senderband.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
