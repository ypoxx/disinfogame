# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „ending-1von4"

**Modell:** `gpt-5.6-sol` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-22
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-22T17:09:26.285Z · **Dauer:** 173.7 s
**Nutzung:** nicht gemeldet · **Kosten:** unbekannt · **Anbieter-Datensammlung:** ausgeschlossen (deny)

> ⚠️ **Wie das zu lesen ist:** Ein *fremdes* Modell hat einen **kuratierten Ausschnitt**
> des Projekts gesehen — nicht das laufende Spiel und nicht das ganze Repository. Es kann
> daher weder Laufzeitverhalten prüfen noch `file:line`-Belege verifizieren. Befunde sind
> **Hypothesen**, die vor dem Umsetzen am Code/an den Daten gegenzuprüfen sind. Die
> kanonische Wahrheit bleibt [`docs/VISION_LOCK.md`](../VISION_LOCK.md) bzw. die Spieldaten.

## Gestellte Frage

Sieh dir die beigefügten Screenshots des laufenden Spiels an und mache einen UX/UI-Durchgang. Die Optik soll eine Behörden-/Papierwelt sein (Stil-Anker und Farbtoken liegen bei). Sag mir: Wo führt das Bild den Blick falsch, welche Grafiken sitzen an der falschen Stelle oder in der falschen Größe, wo stimmen Abstände und Ausrichtung nicht, und welche drei Änderungen bringen am meisten? Sei so konkret, dass man es direkt umsetzen kann.

## Dieser Durchgang: Bündel „ending-1von4" (10 Screenshots)

Das siehst du, in dieser Reihenfolge:
- end_timeout_wahlabend_s0.png — Wahlabend (echt, timeout), Titelkarte
- end_timeout_wahlabend_s1.png — Wahlabend (echt, timeout), Schritt 1
- end_timeout_wahlabend_s2.png — Wahlabend (echt, timeout), Schritt 2
- end_timeout_wahlabend_s3.png — Wahlabend (echt, timeout), Schritt 3
- end_timeout_gameend.png — GameEndScreen (timeout)
- end_timeout_endreport_top.png — End-Report (timeout), Anfang: „Das Rennen"-Kurven
- end_timeout_endreport_mid.png — End-Report (timeout), Mitte: Methoden-Atlas/Bilanz
- end_timeout_endreport_bottom.png — End-Report (timeout), Ende: Gegenmaßnahmen/Debrief
- end_immune_wahlabend_s0.png — Wahlabend (echt, immune), Titelkarte
- end_immune_wahlabend_s1.png — Wahlabend (echt, immune), Schritt 1

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
| 🖼 Bild | `end_timeout_wahlabend_s0.png` | `desinformation-network/runs/visual-review/latest/shots/end_timeout_wahlabend_s0.png` | 127 kB |
| 🖼 Bild | `end_timeout_wahlabend_s1.png` | `desinformation-network/runs/visual-review/latest/shots/end_timeout_wahlabend_s1.png` | 128 kB |
| 🖼 Bild | `end_timeout_wahlabend_s2.png` | `desinformation-network/runs/visual-review/latest/shots/end_timeout_wahlabend_s2.png` | 154 kB |
| 🖼 Bild | `end_timeout_wahlabend_s3.png` | `desinformation-network/runs/visual-review/latest/shots/end_timeout_wahlabend_s3.png` | 74 kB |
| 🖼 Bild | `end_timeout_gameend.png` | `desinformation-network/runs/visual-review/latest/shots/end_timeout_gameend.png` | 74 kB |
| 🖼 Bild | `end_timeout_endreport_top.png` | `desinformation-network/runs/visual-review/latest/shots/end_timeout_endreport_top.png` | 74 kB |
| 🖼 Bild | `end_timeout_endreport_mid.png` | `desinformation-network/runs/visual-review/latest/shots/end_timeout_endreport_mid.png` | 98 kB |
| 🖼 Bild | `end_timeout_endreport_bottom.png` | `desinformation-network/runs/visual-review/latest/shots/end_timeout_endreport_bottom.png` | 98 kB |
| 🖼 Bild | `end_immune_wahlabend_s0.png` | `desinformation-network/runs/visual-review/latest/shots/end_immune_wahlabend_s0.png` | 132 kB |
| 🖼 Bild | `end_immune_wahlabend_s1.png` | `desinformation-network/runs/visual-review/latest/shots/end_immune_wahlabend_s1.png` | 141 kB |

---

## Antwort des Modells

## 1. **Erster Eindruck**

**`end_timeout_wahlabend_s0.png`**  
Der Blick landet mangels anderer Anker auf dem schmalen Balken in der Bildschirmmitte, danach auf der deutlich helleren Senderzeile unten. Für eine Titelkarte sollte zuerst der Zustand des Wahlabends oder das Ergebnis lesbar sein; ein eigentlicher Titel ist jedoch nicht zu erkennen. „Westunion Erwacht“, „Schwelle“ und „9,0 %“ sind zu klein, um die große leere Sendefläche visuell zu tragen. Die schwache Live-Kennung und der winzige Fortfahren-Hinweis wirken wie technische Randnotizen statt wie relevante Zustände.

**`end_timeout_wahlabend_s1.png`**  
Auch hier führt die weiße Untertitelzeile stärker als die eigentliche Ergebnisgrafik, obwohl die Bestätigung der Regierung die Hauptaussage sein sollte. Der zentrale Balken hat keine erkennbare Skala, und seine Fülllänge lässt sich nicht intuitiv mit „9,0 %“ verbinden. Der Screen unterscheidet sich visuell fast nur durch den Lauftext von `end_timeout_wahlabend_s0.png`; dadurch fehlt dem Sequenzschritt ein eigener dramaturgischer Akzent. Die große dunkelblaue Fläche bleibt praktisch ungenutzt.

**`end_timeout_wahlabend_s2.png`**  
Der rote Weiter-Button zieht zuerst den Blick an, wird aber am unteren Bildschirmrand abgeschnitten; das ist der stärkste und zugleich fehlerhaft platzierte Anker. Erst danach liest man das BuVo-Zitat und die sechs kleinen Milieu-Meldungen, während die eigentliche TV-Grafik weit oben und teilweise aus dem sichtbaren Bereich gerückt ist. Gegenüber `end_timeout_wahlabend_s1.png` springt der gesamte Bildaufbau, statt denselben Sendungsrahmen fortzuführen. Der relevante Schluss – Abschalten der Milieus – ist durch die kleinteiligen, gleichgewichteten Kästen unnötig mühsam zu erfassen.

**`end_timeout_wahlabend_s3.png`**  
Der Blick geht korrekt auf „Wahlabend verloren“, anschließend jedoch in einen langen, nahezu gleichförmigen Textblock. Die Spielstil-Tags sind deutlich zu schwach, um als zweite Hierarchieebene zu funktionieren. „Vertrauensverlauf“ kündigt die erste Auswertung an, doch die Grafik beginnt erst am unteren Anschnitt und bleibt inhaltlich unsichtbar. Rechts hinter dem Bericht scheint außerdem ein „Vollständiger Lagebericht“-Element durch, das eine falsche Interaktionsebene signalisiert.

**`end_timeout_gameend.png`**  
Die Aufnahme wirkt visuell identisch zu `end_timeout_wahlabend_s3.png`; ein eigenständiger Game-End-Zustand ist nicht erkennbar. Die Überschrift liefert zwar das Ergebnis, aber die wichtigsten Kennzahlen – zwei Tage, null Aktionen, 58 % Vertrauen – stehen klein und ungewichtet in einer Zeile. Der lange Fließtext dominiert die gesamte erste Bildschirmhöhe und drängt die eigentliche Auswertung unter den Falz. Das oben mittig angeschnittene X-Symbol und das rechts durchscheinende Hintergrund-Element lassen den Modalzustand unfertig wirken.

**`end_timeout_endreport_top.png`**  
Der Blick landet wieder auf Titel und Prosa, nicht auf den angekündigten Kurven von „Das Rennen“. Oberhalb des Falzes ist nur der Beginn des Vertrauensdiagramms sichtbar; Daten, Linien und Legende fehlen im Ausschnitt. Dadurch liest sich der End-Report zunächst wie eine weitere Endsequenz statt wie eine analytische Bilanz. Die Papierfläche trägt die Behördenästhetik aus `desinformation-network/src/story-mode/theme.ts`, wird aber durch die hohe Textdichte und die geringe Schriftgröße mehr zu Kleingedrucktem als zu einer klar gegliederten Akte.

**`end_timeout_endreport_mid.png`**  
Zuerst fällt das regelmäßige Raster der acht Enden-Karten auf, aber der tatsächlich erreichte Zustand „Enthüllung“ ist nur minimal hervorgehoben. Danach zieht der große freie Footer mit „Bericht schließen“ den Blick stärker an als die inhaltlich wichtigere Einordnung. Der obere Rand beginnt mitten in einem vorherigen Inhalt („Wahl vorgezogen!“), wodurch der Screenshot keinen sauberen Abschnittseinstieg besitzt. Ein Methoden-Atlas oder eine Bilanzgrafik ist in dieser Aufnahme trotz der angegebenen Position im Report nicht sichtbar.

**`end_timeout_endreport_bottom.png`**  
Die Aufnahme erscheint visuell identisch zu `end_timeout_endreport_mid.png`; ein eigener unterer Reportzustand ist nicht zu erkennen. Der Blick pendelt zwischen dem Kartenraster, den beiden blau markierten Einordnungsabsätzen und dem großen Schließen-Button. Gegenmaßnahmen oder ein klarer Debrief-Abschluss sind nicht als eigener Abschnitt ausgezeichnet. Die ausgewählte Enden-Karte und die Abschlusslehre müssten vor dem neutralen Kartenraster deutlich stärker priorisiert werden.

**`end_immune_wahlabend_s0.png`**  
Der Blick landet auf „Ihre Schlagzeilen – geprüft“, weil es der einzige rote Block in der großen dunklen Fläche ist. Die eigentliche Zeile „Ihre Kampagne“ ist jedoch sehr klein und wirkt wie ein unfertiger Listeneintrag. Die weiße Senderzeile unten ist erneut kontrastreicher als der Kern der Titelkarte. „Sondersendung“ oben rechts ist zu klein und kontrastarm, um die veränderte Sendungslage zuverlässig anzukündigen.

**`end_immune_wahlabend_s1.png`**  
Der große schräge „GEFÄLSCHT“-Stempel ist der erste und richtige Blickfang. Seine Beziehung zur gestrichenen Zeile bleibt aber etwas lose, weil der Stempel oberhalb und rechts davon schwebt, statt das geprüfte Objekt tatsächlich zu überlagern. „Ihre Schlagzeilen – geprüft“ und die Kampagnenzeile sind neben dem Stempel deutlich zu klein. Die Untertitelzeile funktioniert als zweite Ebene, während der Fortfahren-Hinweis erneut kaum als Bedienaufforderung wahrnehmbar ist.

---

## 2. **Konkrete Eingriffe je Screen**

### `end_timeout_wahlabend_s0.png`

- *Zentrale Ergebnisgruppe → „Westunion Erwacht“, Balken und Prozentwert gemeinsam auf etwa 1,35× skalieren und die Gruppe um rund eine halbe Gruppenhöhe nach oben setzen → die Titelkarte braucht in der leeren Fläche einen eindeutigen Hauptanker.*
- *„Westunion Erwacht“ → nicht links über dem Balken verstecken, sondern als klare Überschrift über die gesamte Balkenbreite setzen; Prozentwert rechts auf dieselbe Grundlinie → Bezeichnung und Ergebnis werden als Einheit gelesen.*
- *Balken → Endpunkte oder eine minimale Skala ergänzen und den Schwellenwert direkt mit einer beschrifteten Kerbe verbinden → Füllstand, 9,0 % und Schwelle sind derzeit nicht nachvollziehbar aufeinander bezogen.*
- *„LIVE“ oben rechts → etwa 1,4× vergrößern, Kontrast erhöhen und mit einem Innenabstand von ungefähr einer Zeichenhöhe zur oberen und rechten Rahmenkante setzen → die Kennung klebt optisch am Rand und verschwindet.*
- *„Klicken zum Fortfahren“ → näher an die Unterkante des TV-Rahmens rücken, mindestens auf Größe des Senderlabels bringen und eine klarere aktive Farbe verwenden → die einzige Interaktionsaufforderung wird momentan übersehen.*

### `end_timeout_wahlabend_s1.png`

- *Bestätigungszeile im unteren Band → Senderlabel schmal halten, Nachrichtenschrift um etwa 20 % vergrößern und die Nachricht vertikal exakt im Band zentrieren → die neue Aussage ist der einzige erkennbare Fortschritt dieses Schritts.*
- *Zentrale Grafik → eine kurze Ergebniszeile wie den vorhandenen Prozentwert typografisch stärker als den Balken behandeln; Wert mindestens so hoch wie die Überschrift setzen → eine Zahl ist schneller erfassbar als der unskalierte Balken.*
- *Leere obere Bildschirmhälfte → die bestehende Ergebnisgruppe bis an die obere Drittellinie ausdehnen oder dort eine größere Ergebnisüberschrift aus den vorhandenen Informationen platzieren → die Sendefläche wirkt derzeit unfertig.*
- *Schwellenmarker → Beschriftung unmittelbar oberhalb der Kerbe zentrieren und in höherem Kontrast darstellen → „Schwelle“ ist erst beim zweiten Hinsehen lesbar.*
- *Fortfahren-Hinweis → identisch zu einem echten sekundären Button behandeln und seine Breite mindestens an der Textbreite der Sendernachricht ausrichten → Interaktion und Sendegrafik besitzen aktuell keine klare Trennung.*

### `end_timeout_wahlabend_s2.png`

- *Gesamter TV-Rahmen → dieselbe Größe und vertikale Position wie in `end_timeout_wahlabend_s1.png` beibehalten; Zusatzinhalte innerhalb der bisher leeren Sendefläche anordnen → der starke Layoutsprung und das Abschneiden des oberen Rahmens brechen die Sequenz.*
- *BuVo-Zitat → innerhalb des TV-Bildes unter die Ergebnisgrafik setzen, auf höchstens zwei Zeilen begrenzen und links an der Balkenkante ausrichten → das Zitat gehört zur Sendung und sollte nicht zwischen TV und Button schweben.*
- *Sechs Milieu-Meldungen → als zwei Spalten mit drei sauber gleich hohen Zeilen setzen; horizontale und vertikale Zwischenräume jeweils auf mindestens eine halbe Karten-Innenhöhe erhöhen → die kleinen Kästen bilden derzeit eine unruhige, schwer scannbare Wolke.*
- *Milieu-Meldungen → Statuspunkt und Text vergrößern und die identische Aussage „schaltet ab“ als gemeinsame Spaltenüberschrift oder Statuskante behandeln → die Wiederholung produziert visuelles Rauschen statt schneller Übersicht.*
- *Weiter-Button → vollständig innerhalb des Viewports platzieren, unterhalb der Meldungen mindestens eine Buttonhöhe Abstand zum Bildschirmrand lassen → der wichtigste Bedienpunkt ist abgeschnitten.*
- *Weiter-Button → nicht rot fluten, sondern entsprechend `stampCtaStyle` aus `desinformation-network/src/story-mode/theme.ts` als helle Papierfläche mit rotem Doppelrand ausführen → die Primäraktion würde damit zur verbindlichen Behörden-/Stempelwelt passen.*

### `end_timeout_wahlabend_s3.png`

- *Berichtskopf → Kennzahlen unter dem Verlusttitel als drei getrennte Felder oder Chips mit gleich breiten Spalten darstellen → „2 Tage“, „0 Aktionen“ und „58 %“ verschwinden derzeit in einer Kleindruckzeile.*
- *Spielstil-Bewertung → Tags auf etwa 1,25× skalieren, ihren Abstand zur Überschrift verkleinern und den Abstand zum Fließtext vergrößern → sie sind eine eigene Auswertungsebene, wirken aber wie Metadaten.*
- *Narrativtext → Zeilenlänge auf ungefähr zwei Drittel der jetzigen Breite reduzieren oder in einen schmaleren Textblock setzen; Absatzabstand um etwa 25 % verringern → der Block ist breit, lang und drängt die Auswertung aus dem ersten Viewport.*
- *Vertrauensverlauf → Diagramm um mindestens ein Drittel Bildschirmhöhe nach oben holen, notfalls durch Kürzen oder Einklappen der Prosa → eine angekündigte Auswertung darf nicht nur als Rahmenanschnitt erscheinen.*
- *Hintergrundelement rechts → während des Berichts vollständig ausblenden statt nur abzudunkeln → „Vollständiger Lagebericht“ sieht wie eine zweite, weiterhin anklickbare Aktion aus.*

### `end_timeout_gameend.png`

- *Game-End-Hierarchie → Verlusttitel, einzeilige Konsequenz und drei Kennzahlen in den ersten etwa 30 % der Papierfläche bündeln → der Endzustand muss vor dem langen narrativen Text erfassbar sein.*
- *Berichtspanel → sichtbare Maximalhöhe an den Viewport koppeln und nur den inneren Papierkörper scrollen lassen; Kopfzeile stehen lassen → der Zustand wirkt aktuell wie ein übergroßes Dokument hinter einer Kamera.*
- *X-Symbol oben mittig → vollständig innerhalb der Berichtskante platzieren oder entfernen, wenn ausschließlich der Schließen-Button verwendet werden soll → das angeschnittene Symbol ist weder lesbar noch zuverlässig bedienbar.*
- *Fließtext → Schrift um ungefähr 15–20 % vergrößern und Zeilenabstand leicht erhöhen, dafür die Textbreite reduzieren → die Pixelzeichen sind auf 1280×720 zu kleinteilig für längeres Lesen.*
- *Erster Analyseblock → mindestens die Überschrift und die obere Hälfte der Grafik oberhalb des Falzes zeigen → der Game-End-Screen verspricht Auswertung, liefert zunächst aber fast nur Prosa.*

### `end_timeout_endreport_top.png`

- *Report-Einstieg → „Vertrauensverlauf“ samt vollständigem oberen Diagrammbereich direkt nach den Kennzahlen platzieren; die narrative Spielstil-Prosa darunter oder einklappbar anordnen → die Aufnahme mit dem Reportanfang zeigt sonst keine verwertbare Kurve.*
- *Diagrammrahmen → näher an die Abschnittsüberschrift rücken; Abstand oberhalb etwa halbieren → Überschrift und Grafik wirken durch den Falz wie zwei getrennte Seiten.*
- *Diagrammbeschriftungen → Achsenwerte und Legende mindestens auf Größe der Fließtextschrift bringen und in dunkler Tinte darstellen → bereits „100 %“ und „75 %“ sind am unteren Rand nur mühsam lesbar.*
- *Kopfband → vertikale Innenabstände leicht reduzieren und die frei werdende Höhe dem Diagramm geben → das dunkle Band beansprucht viel Platz, obwohl sein Inhalt kompakt ist.*
- *Modal-Hintergrund → alle darunterliegenden Texte und Buttons vollständig verdecken → durchscheinende Bedienelemente schwächen die Aktenmetapher und die Fokussperre.*

### `end_timeout_endreport_mid.png`

- *Scrollposition → den Abschnitt „Mögliche Spielenden“ bündig mit einem klaren oberen Papier-Innenrand starten lassen; den angeschnittenen Rest „Wahl vorgezogen!“ entfernen → ein Abschnitt darf nicht mitten im Vorgängerinhalt beginnen.*
- *Erreichte Karte „Enthüllung“ → Grenzlinie etwa doppelt so stark, Hintergrund klarer absetzen und „ERREICHT“ als roten Stempel oben rechts in der Karte platzieren → der aktuelle Zustand ist im Raster zu schwach markiert.*
- *Kartenraster → Spaltengasse und Zeilenabstände auf mindestens die jeweilige Karten-Innenpolsterung erhöhen → die acht Kästen kleben aneinander und wirken wie eine Tabelle statt wie einzelne Ergebnisse.*
- *Kartentexte → Titel und Bedingung durch mehr vertikalen Abstand trennen; Bedingungsschrift leicht vergrößern → jeder Kasten muss derzeit Wort für Wort entziffert werden.*
- *Einordnung → unmittelbar nach der erreichten Karte oder als hervorgehobener Einzelblock über dem Gesamtraster positionieren → die pädagogisch wichtigste Aussage kommt erst nach acht hypothetischen Enden.*
- *Schließen-Button → in einen klar abgesetzten, haftenden Footer setzen und als Stempel-CTA gestalten → aktuell konkurriert er als schwerer graubrauner Block mit dem Inhalt.*

### `end_timeout_endreport_bottom.png`

- *Unterer Abschnitt → einen eindeutigen Debrief-Titel direkt über den blau markierten Absätzen ergänzen beziehungsweise den vorhandenen Titel „Einordnung“ entsprechend konkretisieren → der behauptete Gegenmaßnahmen-/Debrief-Bereich ist visuell nicht als solcher zu erkennen.*
- *Hypothetische Enden → am unteren Reportende einklappen oder auf eine kompakte Übersicht reduzieren → sie nehmen mehr Fläche ein als die abschließende Lehre.*
- *Einordnungsabsätze → auf eine gemeinsame linke Führungskante setzen und den blauen Strich über die volle Höhe des jeweiligen Absatzblocks führen → die Markierungen wirken derzeit wie zufällige kurze Randstücke.*
- *Footer-Trennlinie → Abstand oberhalb deutlich vergrößern und Abstand zwischen Hinweistext und Button verkleinern → Inhalt, Disclaimer und Aktion bilden momentan drei lose Ebenen.*
- *„Bericht schließen“ → Breite um etwa ein Viertel reduzieren oder visuell leichter machen, aber Kontrast und Stempelcharakter erhöhen → die große braune Fläche zieht mehr Gewicht als ihre funktionale Bedeutung rechtfertigt.*

### `end_immune_wahlabend_s0.png`

- *„Ihre Schlagzeilen – geprüft“ → etwa 1,4× vergrößern und näher an die obere Drittellinie setzen → die vorhandene Titelzeile ist zu klein für die gesamte leere Sendefläche.*
- *„Ihre Kampagne“ → auf Größe der unteren Nachrichtenschrift bringen, Einzug reduzieren und mit einer klaren horizontalen Prüfzeile verbinden → der Eintrag sieht momentan wie ein Platzhalter aus.*
- *„Sondersendung“ → Kontrast und Größe erhöhen und mit einem Innenabstand von ungefähr einer Zeichenhöhe zum Rahmen setzen → der Sendungswechsel wird sonst erst über den Lauftext verstanden.*
- *Rot auf dunkelrotem Grund → Hintergrund hinter Text und späterem Stempel etwas neutraler beziehungsweise dunkler machen → die roten Akzente verlieren auf der stark rot getönten Fläche Kontur.*
- *Fortfahren-Hinweis → näher an den Rahmen und auf mindestens 1,25× skalieren → die Aktion hängt isoliert in der schwarzen Außenfläche.*

### `end_immune_wahlabend_s1.png`

- *„GEFÄLSCHT“-Stempel → nach links unten verschieben, sodass er die Zeile „Ihre Kampagne“ sichtbar um etwa ein Drittel überdeckt → die Ursache-Wirkungs-Beziehung wird unmittelbar verständlich.*
- *Stempelgröße → nur leicht reduzieren oder die zugrunde liegende Kampagnenzeile deutlich vergrößern → momentan vernichtet der Stempel fast die gesamte restliche Informationshierarchie.*
- *Durchgestrichene Kampagnenzeile → Kontrast erhöhen und Durchstreichung dicker als die Zeichenstämme ausführen → der geprüfte Gegenstand bleibt hinter dem Effekt kaum lesbar.*
- *Prüfüberschrift und Kampagnenzeile → gemeinsam an einer linken Kante ausrichten und ihren vertikalen Abstand halbieren → beide Elemente gehören semantisch zusammen, wirken aber auseinandergezogen.*
- *Sendernachricht unten → linke Kante nach dem Senderlabel beibehalten, aber die Textgröße leicht erhöhen und rechts mehr Sicherheitsabstand lassen → die Erklärung ist wichtig, darf jedoch nicht an den Bandrändern kleben.*

---

## 3. **Grafiken/Assets**

- **`end_timeout_wahlabend_s0.png`, `end_timeout_wahlabend_s1.png` und `end_timeout_wahlabend_s2.png`:** Der TV-Rahmen und die feinen Scanlines tragen als diegetische Sendefläche. Sie sind scharf genug und vermeiden grobe Pixelblöcke, wie es `sprite-tool/public/context/game-style-guide.md` verlangt. Die Ergebnisgrafik selbst sieht dagegen wie ein generischer UI-Fortschrittsbalken aus: keine Achse, keine Wahlgrafik, kein Sendungsraster und keine klare visuelle Beziehung zwischen 9,0 %, Füllung und Schwelle. Am meisten fehlt hier eine kompakte Wahlabend-Grafik aus großer Ergebniszahl, Schwellenkerbe und eindeutig beschrifteter Skala.

- **`end_immune_wahlabend_s0.png` und `end_immune_wahlabend_s1.png`:** Der „GEFÄLSCHT“-Stempel ist das stärkste Asset im Bündel und passt inhaltlich zur Stempelwelt. Er besitzt eine klare Silhouette und bleibt trotz Scanlines scharf. In `end_immune_wahlabend_s1.png` ist sein Zuschnitt nicht fehlerhaft, seine Position jedoch zu losgelöst vom geprüften Eintrag. Der dunkelrote Vollflächenlook ist als Sondersendung verständlich, entfernt sich aber deutlich von der Papierpalette; deshalb sollten wenigstens Text- und Stempelflächen wie Tinte auf einem prüfbaren Dokument inszeniert werden.

- **`end_timeout_wahlabend_s0.png` bis `end_timeout_wahlabend_s2.png`:** Der Rahmen bleibt in den ersten beiden Aufnahmen stabil, wird in `end_timeout_wahlabend_s2.png` aber oben abgeschnitten. Das wirkt nicht wie ein gewollter Kamerazoom, sondern wie vertikaler Overflow. Die Sendung braucht keinen größeren Rahmen, sondern eine bessere Nutzung ihrer aktuell leeren Innenfläche.

- **`end_timeout_wahlabend_s3.png`, `end_timeout_gameend.png` und `end_timeout_endreport_top.png`:** Die Papierfläche und das Kraftpapier-Kopfband entsprechen der Materialwelt aus `desinformation-network/src/story-mode/theme.ts`. Es fehlt jedoch oberhalb des Falzes eine tragende Datengrafik: sichtbar sind nur Rahmen, Rasteransatz und Achsenwerte. Eine kleine, vollständig sichtbare Übersichtskurve würde mehr leisten als die derzeit fünf breiten Prosaabsätze.

- **`end_timeout_endreport_mid.png` und `end_timeout_endreport_bottom.png`:** Es gibt keine bildhaften Methoden- oder Gegenmaßnahmen-Assets; der Report besteht fast ausschließlich aus Rahmen, Text und zwei blauen Randstrichen. Das ist für eine Akte grundsätzlich passend, aber zu tabellarisch. Ein roter „ERREICHT“-Stempel auf der aktuellen Enden-Karte und einfache monochrome Piktogramme für Aufdeckung, Flucht, Wandel und Fortsetzung würden Orientierung schaffen, ohne die Papierwelt zu verlassen.

- **Alle Report-Aufnahmen:** Die Papierfläche wirkt sehr eben und digital. Eine äußerst subtile, fein aufgelöste Faser- oder Kopierschattenstruktur könnte das Material stärken; keine starke Vergilbung, keine grobe Fleckentextur und keine braune 70er-Anmutung. Wichtiger als zusätzliche Textur ist allerdings zuerst die Behebung von Hierarchie und Zuschnitt.

---

## 4. **Raster & Rhythmus**

- **`end_timeout_wahlabend_s0.png` und `end_timeout_wahlabend_s1.png`:** Der TV-Rahmen ist sauber zentriert, besitzt intern aber kein erkennbares Raster. Die zentrale Grafik nutzt nur einen schmalen Streifen von ungefähr einem Zwanzigstel der Sendeflächenhöhe, während oberhalb und unterhalb große tote Flächen bleiben. Ein internes Dreizonenraster – Kennung oben, Hauptgrafik im mittleren Drittel, Nachricht unten – würde die Fläche stabilisieren.

- **`end_timeout_wahlabend_s2.png`:** Rahmen, Zitat, Statuskästen und Button verwenden vier verschiedene Breiten und keine gemeinsame Bezugskante. Balken, Zitat und Karten sollten dieselbe linke und rechte Inhaltskante erhalten. Der TV darf für diesen Schritt nicht nach oben springen; der zusätzliche Inhalt muss entweder in seine Leerfläche oder in einen konstant reservierten Bereich darunter.

- **`end_immune_wahlabend_s0.png` und `end_immune_wahlabend_s1.png`:** Die linke Textgruppe sitzt relativ tief und weit links, der Stempel dagegen frei im Zentrum. Ein gemeinsamer Inhaltsblock von etwa zwei Dritteln der Rahmenbreite würde die Relation klarer machen. Der Abstand zwischen Überschrift und Kampagnenzeile ist größer als der Abstand innerhalb einer logischen Gruppe sein sollte.

- **`end_timeout_wahlabend_s3.png`, `end_timeout_gameend.png` und `end_timeout_endreport_top.png`:** Kopfband und Papierkörper sind grundsätzlich sauber an einer gemeinsamen linken Kante ausgerichtet. Der vertikale Rhythmus kippt jedoch: kompakter Kopf, sehr langer Prosaabschnitt, dann eine Grafik am Falz. Die erste Bildschirmhöhe sollte Ergebnis, Kennzahlen und mindestens eine vollständige Visualisierung enthalten; vertiefende Prosa kann danach folgen.

- **`end_timeout_endreport_mid.png` und `end_timeout_endreport_bottom.png`:** Das Zweispaltenraster der Enden-Karten ist stabil, aber die Gassen sind zu knapp. Außenrand, Spaltengasse und Karten-Innenabstand sollten aus derselben Abstandsfamilie stammen; derzeit ist der Außenrand großzügig, während die Karten fast zusammenstoßen. Der Footer hat dagegen viel tote Fläche und zieht den Abschluss unnötig auseinander.

- **Alle Report-Aufnahmen:** Die abgedunkelte Außenfläche funktioniert als Fokusrahmen, aber sichtbare Hintergrundtexte rechts und das angeschnittene X oben brechen die Schichtung. Während der Report offen ist, sollte nur das Dokument als aktive Ebene sichtbar bleiben.

---

## 5. **Lesbarkeit**

- **`end_timeout_wahlabend_s0.png` und `end_timeout_wahlabend_s1.png`:** Bei „Schwelle“, „LIVE“, „9,0 %“ und „Klicken zum Fortfahren“ musste ich zweimal hinsehen. Die Kombination aus sehr kleiner Pixelschrift, dünnen Zeichen und niedrigem Kontrast ist auf 1280×720 zu schwach. Besonders problematisch ist, dass gerade Schwelle und Prozentwert die Grafik erklären sollen.

- **`end_timeout_wahlabend_s2.png`:** Die sechs Milieu-Zustände sind einzeln zu klein und typografisch fast gleichwertig zum Zitat. Der abgeschnittene Weiter-Button erzeugt zusätzlich Unsicherheit, ob die Aktion überhaupt verfügbar ist. Es gibt keinen eindeutigen Unterschied zwischen Information, Status und Bedienung.

- **`end_immune_wahlabend_s0.png`:** „Sondersendung“ und „Ihre Kampagne“ verschwinden im dunkelroten Feld. Rot auf Rot erfüllt hier zwar die Stimmung, aber nicht die schnelle Erfassung. Die weiße Untertitelzeile ist deshalb ungewollt das lesbarste Element.

- **`end_immune_wahlabend_s1.png`:** Der Stempel ist hervorragend lesbar, die zugrunde liegende Kampagnenzeile dagegen kaum. Für den Effekt sollte sie noch erkennbar bleiben; sonst sieht man nur das Urteil, nicht das geprüfte Objekt.

- **`end_timeout_wahlabend_s3.png`, `end_timeout_gameend.png` und `end_timeout_endreport_top.png`:** Der Fließtext ist für seine Menge zu klein und zu breit. Die tags „ENTTARNUNG“ und „HOFFNUNGSVOLL“ wirken wie deaktivierte Mini-Buttons statt wie eine aktive Bewertung. Die Kennzahlenzeile unter dem Intro ist ebenfalls zu schwach gewichtet.

- **`end_timeout_endreport_mid.png` und `end_timeout_endreport_bottom.png`:** Die Bedingungen in den acht Karten verlangen langsames Lesen; Pixel-Monospace und enge Zeilenabstände verstärken das. Der erreichte Zustand ist lediglich durch Häkchen, Klammerzusatz und einen sehr schwachen Flächenton markiert. Aktiv, erreicht und hypothetisch sind damit nicht schnell genug unterscheidbar.

- **`end_timeout_endreport_mid.png` und `end_timeout_endreport_bottom.png`:** Die Überschrift „Mögliche Spielenden“ kann beim ersten Lesen als Bezeichnung für Personen verstanden werden. Falls „mögliche Enden des Spiels“ gemeint ist, wäre „Mögliche Spielausgänge“ oder „Weitere Enden“ schneller und eindeutiger.

- **`end_timeout_endreport_bottom.png`:** Der kleine Hinweis „Dieses Spiel dient dem Verständnis von Desinformationstaktiken“ ist sehr schwach und weit vom Einordnungsblock getrennt. Wenn er als Abschlusslehre wichtig ist, braucht er mehr Kontrast; wenn er nur ein Disclaimer ist, sollte er nicht zwischen Debrief und Schließen-Aktion stehen.

---

## 6. **Die drei wirksamsten Änderungen**

1. **Gemeinsame Wahlabend-Hierarchie für `end_timeout_wahlabend_s0.png` bis `end_timeout_wahlabend_s2.png` sowie `end_immune_wahlabend_s0.png` und `end_immune_wahlabend_s1.png` einführen:** Hauptaussage und Werte um etwa ein Drittel vergrößern, Kontrast anheben und den Fortfahren-Hinweis als echte Aktion behandeln – geringer CSS-Aufwand, sofort deutlich bessere Blickführung.

2. **Overflow und Ebenenfehler in `end_timeout_wahlabend_s2.png` sowie allen Report-Aufnahmen beheben:** TV-Rahmen und Buttons vollständig im Viewport halten, Report-Inhalt intern scrollen und Hintergrundaktionen komplett ausblenden – beseitigt abgeschnittene Bedienelemente und unfertige Modalzustände.

3. **Report oberhalb des Falzes neu ordnen:** In `end_timeout_wahlabend_s3.png`, `end_timeout_gameend.png` und `end_timeout_endreport_top.png` Ergebnis, drei Kennzahlen und eine vollständige Kurve vor die lange Prosa setzen; in `end_timeout_endreport_mid.png` und `end_timeout_endreport_bottom.png` den erreichten Ausgang per Stempel priorisieren – macht aus dem Textdokument tatsächlich eine lesbare Abschlussakte.

---

## 7. **Blinde Flecken**

- **`end_timeout_wahlabend_s0.png` bis `end_timeout_wahlabend_s2.png`:** Nicht erkennbar ist, ob Balken, Zahlen, Meldungen oder Text schrittweise animiert werden. Dafür wären Aufnahmen direkt vor, während und nach jeder Animation nötig; die große Leerfläche könnte in Bewegung anders funktionieren als im Standbild.

- **`end_immune_wahlabend_s0.png` und `end_immune_wahlabend_s1.png`:** Es ist nicht sichtbar, ob der Stempel mit einer starken Bewegung, einem Aufblitzen oder einem Sound synchronisiert erscheint. Ein Zwischenframe vor dem Aufschlag und ein Frame unmittelbar danach würden zeigen, ob Position und Größenwirkung dramaturgisch tragen.

- **`end_timeout_wahlabend_s2.png`:** Nicht erkennbar ist, ob der abgeschnittene Weiter-Button durch Browser-Zoom, Screenshot-Timing oder echtes responsives Overflow entsteht. Dafür werden dieselbe Ansicht bei mindestens einer kleineren und einer größeren Viewport-Höhe benötigt.

- **`end_timeout_wahlabend_s3.png`, `end_timeout_gameend.png` und `end_timeout_endreport_top.png`:** Hover-, Fokus- und Scrollzustände des Berichts sowie die Funktion des angeschnittenen X-Symbols sind nicht sichtbar. Ein Screenshot mit fokussiertem Schließen-Element und einer Aufnahme des Scrollbalkens wären nötig.

- **`end_timeout_endreport_top.png`:** Die eigentlichen Kurven, Linienfarben, Legenden und Tooltip-Zustände liegen außerhalb des sichtbaren Ausschnitts. Eine vollständige Aufnahme des Diagramms ist für eine belastbare Grafikbewertung erforderlich.

- **`end_timeout_endreport_mid.png` und `end_timeout_endreport_bottom.png`:** Beide Aufnahmen wirken identisch; Methoden-Atlas, Bilanz, Gegenmaßnahmen und ein eigener Debrief-Zustand sind nicht sichtbar. Dafür werden Abschnittsanfänge mit den jeweiligen Überschriften sowie ein tatsächlicher unterster Scrollzustand benötigt.

- **Alle Aufnahmen:** Tastaturfokus, Hover, Disabled-Zustände, Kontrast bei kleinerer Auflösung und Verhalten bei Textskalierung lassen sich aus den Standbildern nicht beurteilen.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
