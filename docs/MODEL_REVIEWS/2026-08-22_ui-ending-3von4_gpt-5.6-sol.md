# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „ending-3von4"

**Modell:** `gpt-5.6-sol` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-22
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-22T17:09:26.285Z · **Dauer:** 179.0 s
**Nutzung:** nicht gemeldet · **Kosten:** unbekannt · **Anbieter-Datensammlung:** ausgeschlossen (deny)

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

## 1. **Erster Eindruck**

### `end_victory_gameend.png`
Zuerst zieht der große Titel „Die Mehrheit, gemacht“ den Blick an, danach fällt er jedoch in einen langen, fast gleichförmigen Textblock. Eigentlich sollten nach dem Titel sofort das Ergebnis und die entscheidenden Kennzahlen — insbesondere „Finales Vertrauen: 58 %“ — erfassbar sein. Diese Zahl ist momentan Teil einer kleinen Metazeile und hat weniger Gewicht als die erzählerische Bewertung. Der angeschnittene Vertrauensverlauf am unteren Rand wirkt wie zufällig abgeschnitten, nicht wie bewusst angekündigter Folgeabschnitt. Zudem bleibt rechts unten die zugrunde liegende Aktion „Vollständiger Lagebericht“ sichtbar und konkurriert trotz Abdunklung mit dem Bericht.

### `end_victory_endreport_top.png`
Der visuelle Einstieg entspricht praktisch exakt `end_victory_gameend.png`; eine eigenständige „Das Rennen“-Ansicht ist in dieser Aufnahme nicht erkennbar. Der Titel funktioniert als erster Blickpunkt, aber die Ergebniskennzahlen darunter sind zu klein und zu dicht gesetzt. Die beiden Kästchen „TRIUMPH“ und „TRIUMPHAL“ sehen wie gleichwertige Filter oder Schaltflächen aus, obwohl sie offenbar eine Bewertung ausdrücken sollen. Der Blick läuft anschließend durch vier ähnlich gewichtete Absätze, bevor er am angeschnittenen Diagramm hängen bleibt. Das Diagramm sollte als zweiter Hauptblock klar beginnen oder vollständig aus dem ersten sichtbaren Abschnitt verschwinden.

### `end_victory_endreport_mid.png`
Das Auge landet zunächst auf dem Raster „Mögliche Spielenden“, weil es den größten und kontrastreichsten Block bildet. Das tatsächlich erreichte Ende „Sieg“ ist innerhalb dieses Rasters aber nur durch eine geringe Flächen- und Randabweichung markiert und wird nicht sofort als Ergebnis erkannt. Der abgeschnittene Rest eines vorherigen Elements am oberen Rand erzeugt zusätzlich den Eindruck eines zufälligen Scrollstands. Erst danach wird die „Einordnung“ sichtbar, obwohl sie für den pädagogischen Abschluss wichtiger ist als sieben nicht erreichte Enden. Der laut Beschreibung erwartete Methoden-Atlas beziehungsweise die Bilanz ist in dieser Aufnahme nicht zu sehen.

### `end_victory_endreport_bottom.png`
`end_victory_endreport_bottom.png` ist visuell identisch mit `end_victory_endreport_mid.png`; ein eigener Endbereich mit Gegenmaßnahmen oder ausführlichem Debrief ist nicht erkennbar. Der Blick bleibt erneut zuerst im großen Enden-Raster hängen und gelangt erst spät zur Einordnung. Der Abschlussknopf ist zwar mittig platziert, wirkt aber wie ein gewöhnlicher graubrauner Formularbutton und nicht wie die eindeutige finale Aktion. Zwischen Einordnung, Lernhinweis und Knopf gibt es ausreichend Fläche, aber keine starke Abschlussdramaturgie.

### `fixture_wahlabend_victory_s0.png`
Zuerst sieht man korrekt den Titel „DIE HOCHRECHNUNG“, doch die gesamte Titelgruppe nimmt nur einen kleinen Teil der großen schwarzen Fläche ein. Die Aufnahme beschreibt ein dunkles Büro mit laufendem Fernseher, zeigt visuell aber weder Büro noch Fernseher und liest sich deshalb eher als Lade- oder Kapitelkarte. Der goldbraune Titel ist auf Schwarz zurückhaltender als nötig und trägt einen älteren, braunlastigen Ton, der vom modernen Behörden-/Papieranker abweicht. Der Fortfahren-Hinweis ist so klein und kontrastarm, dass er erst nach erneutem Hinsehen auffällt.

### `fixture_wahlabend_victory_s1.png`
Der Fernseher ist klar der Hauptkörper, innerhalb seiner Fläche dominiert jedoch vor allem leere dunkelblaue Fläche. Der Blick sollte sofort zu Wert, Schwelle und Hochrechnung gehen, doch die sehr kleine Zahl „21,6 %“ und die uneindeutige Balkenskalierung bremsen das Verständnis. Ohne sichtbare Skala wirkt es widersprüchlich, dass 21,6 % ungefähr drei Viertel des Balkens füllen. „LIVE“, Senderkennung und Fortfahren-Hinweis sind so klein, dass sie eher wie technische Artefakte als bewusst gesetzte Information wirken. Die Nachrichtensendung besitzt dadurch einen Rahmen, aber kaum eine sendetypische visuelle Hierarchie.

### `fixture_wahlabend_victory_s2.png`
Der rote Balken wird zum ersten Blickpunkt und signalisiert einen Zustandswechsel, aber das eigentliche Ergebnis „Regierung ist abgewählt“ bleibt ausschließlich in der kleinen Untertitelzeile. Der laut Beschreibung erwartete Ergebnisstempel ist in `fixture_wahlabend_victory_s2.png` nicht sichtbar. Die große freie obere Bildschirmhälfte lässt den entscheidenden Moment unterinszeniert wirken. Weil Wert, Schwelle und Balken nahezu unverändert bleiben, ist der Unterschied zu `fixture_wahlabend_victory_s1.png` auf den Farbwechsel reduziert.

### `fixture_wahlabend_victory_s3.png`
Das Auge landet weiterhin zuerst auf dem großen TV-Balken, obwohl der neue Nachsatz und die Konsequenzen jetzt die eigentliche Information sind. Der Fernseher ist nach oben geschoben und am oberen Bildschirmrand angeschnitten, während der Weiter-Knopf unten direkt an der Viewportkante sitzt. Dadurch wird die gesamte Komposition vertikal eingeklemmt. Die sechs kleinen Zustandskästchen bilden zwei unruhige Zeilen und sind schwächer lesbar als der Fernseher, obwohl sie den gesellschaftlichen Ausgang erläutern. Ein „Wohnzimmer-Schnitt“ ist in der Aufnahme nicht zu erkennen; sichtbar bleibt dieselbe abstrakte TV-Anzeige.

### `fixture_wahlabend_timeout_s0.png`
Die Aufnahme ist visuell identisch mit `fixture_wahlabend_victory_s0.png`, was vor der Bekanntgabe des Ausgangs grundsätzlich schlüssig ist. Auch hier zieht der Titel zuerst den Blick an, doch die übergroße schwarze Umgebung lässt die Szene leer statt gespannt wirken. Der behauptete dunkle Büroraum wird nicht visuell etabliert. Der Fortfahren-Hinweis bleibt gegenüber Titel und Beschreibung zu klein und zu weit abgesetzt.

### `fixture_wahlabend_timeout_s1.png`
Der Blick fällt zunächst auf den langen Balken, dann auf „15,3 %“ und erst danach auf die Schwelle. Wieder fehlt eine Skala, weshalb Balkenlänge, Prozentwert und Schwellenposition nicht ohne Interpretationsarbeit zusammenpassen. Dass der Wert unter der Schwelle liegt, ist geometrisch erkennbar, aber weder als Abstand noch als Zustand benannt. Die große leere TV-Fläche schwächt die Spannung ebenso wie in `fixture_wahlabend_victory_s1.png`. Der Fortfahren-Hinweis und die Senderkennung sind erneut deutlich kleiner als für ihre funktionale Rolle sinnvoll.

---

## 2. **Konkrete Eingriffe je Screen**

### `end_victory_gameend.png`

* **Ergebniszeile im dunklen Kopf** → „58 % finales Vertrauen“, Kampagnendauer und Aktionszahl als drei gleich breite Kennzahlen unter den Untertitel setzen und etwa 1,3–1,5× größer darstellen → das konkrete Spielergebnis muss vor dem Fließtext erfassbar sein.
* **Bewertung „TRIUMPH / TRIUMPHAL“** → aus den zwei kleinen Kästchen einen einzigen deutlich größeren Bewertungsstempel rechts neben „Spielstil-Bewertung“ machen → die aktuelle Darstellung liest sich wie zwei anklickbare Filter.
* **Erzähltext** → Textspalte auf etwa vier Fünftel der Inhaltsbreite begrenzen und die vier Absätze mit gleichmäßigen größeren Zwischenräumen gruppieren → die Zeilen sind lang und die Absätze verschmelzen visuell.
* **Beginn „Vertrauensverlauf“** → entweder Diagramm vollständig in den sichtbaren Bereich ziehen oder nach der Überschrift nur eine klare Fortsetzungsmarke zeigen → der aktuelle Anschnitt wirkt wie ein Layoutfehler.
* **Hintergrundaktion rechts unten** → während des Berichts vollständig ausblenden oder die Abdunklung so erhöhen, dass kein Text mehr lesbar bleibt → sie konkurriert mit dem modalen Abschluss.

### `end_victory_endreport_top.png`

* **Kopfzeile des Berichts** → Titel links belassen, aber rechts ein großes Ergebnisfeld beziehungsweise einen Sieg-Stempel auf Höhe des Titels setzen → Titel und Ausgang werden so als erste geschlossene Information gelesen.
* **Metazeile unter dem Untertitel** → in drei voneinander getrennte Spalten mit klaren Labels und größeren Werten aufteilen → die gegenwärtige Einzeile ist zu klein und zu dicht.
* **Spielstil-Bewertung** → Überschrift, Bewertungsstempel und Kurzdeutung in eine kompakte horizontale Gruppe bringen → derzeit folgt auf die Überschrift erst eine Linie, dann zwei mehrdeutige Kästchen, dann viel Text.
* **Vertrauensverlauf** → Diagramm mit mindestens der halben Diagrammhöhe sichtbar beginnen lassen und den ersten Datenpunkt direkt beschriften → im aktuellen Ausschnitt ist weder Verlauf noch Aussage erkennbar.
* **Scrollfortsetzung** → am unteren Innenrand eine schmale Aktenreiter-Zeile „Weiter: Das Rennen“ oder einen klaren Scrollindikator verankern → das abgeschnittene Diagramm gibt keine bewusste Fortsetzungslogik vor.

### `end_victory_endreport_mid.png`

* **Oberer Scrollanschnitt** → den Scrollstand am Beginn von „Mögliche Spielenden“ einrasten lassen oder oberhalb der Überschrift einen halben Abschnitt Abstand vorsehen → der abgeschnittene Rest am oberen Rand erzeugt Unruhe.
* **Erreichtes Ende „Sieg“** → Karte mit deutlich stärkerem Innenkontrast, Häkchen beziehungsweise Stempel und einer Kopfleiste „ERREICHT“ versehen; übrige Karten um eine Stufe entsättigen → der aktuelle dünne Unterschied reicht für den wichtigsten Zustand nicht.
* **Enden-Raster** → Zwischenraum zwischen den beiden Spalten und zwischen den Zeilen jeweils ungefähr verdoppeln, dafür Karten innen etwas kompakter machen → aktuell entsteht ein dichter Tabellenblock ohne klare Gruppierung.
* **Einordnung** → direkt unter das erreichte Ende ziehen oder als hervorgehobenen Aktenvermerk über dem vollständigen Enden-Katalog platzieren → die pädagogisch wichtigste Aussage folgt derzeit erst nach allen Alternativen.
* **Einordnungsabsätze** → beide blauen Randlinien zu einem gemeinsamen Vermerkblock mit einheitlichem Innenabstand zusammenfassen → die zwei separaten Linien wirken wie zwei Zustände, obwohl die Aussagen zusammengehören.

### `end_victory_endreport_bottom.png`

* **Inhalt des unteren Berichtsteils** → vor dem Enden-Katalog einen klar benannten Abschnitt für die laut Beschreibung vorgesehenen Gegenmaßnahmen beziehungsweise das Debrief sichtbar machen → die Aufnahme zeigt diese Abschlussfunktion nicht.
* **Lernhinweis über dem Knopf** → in einen schmalen Fußbereich mit heller Papierfläche und oberer Trennlinie integrieren → momentan schwebt der Satz zwischen Einordnung und Button.
* **„Bericht schließen“** → gemäß `stampCtaStyle` aus `desinformation-network/src/story-mode/theme.ts` als helle Papierfläche mit rotem Doppelring statt als graubraune Fläche ausführen und etwa ein Viertel breiter machen → die finale Primäraktion entspricht derzeit nicht dem verbindlichen Stempelprinzip.
* **Unterer Innenabstand** → unter dem Knopf mindestens denselben Abstand wie oberhalb des Lernhinweises vorsehen → der Abschluss braucht eine klar erkennbare Fußzone.
* **Enden-Katalog** → nicht erreichte Enden einklappbar oder visuell sekundär machen → auf dem letzten Bildschirm verdrängt der Katalog den eigentlichen Abschluss.

### `fixture_wahlabend_victory_s0.png`

* **Titelgruppe** → insgesamt etwa 15 % nach oben versetzen und Titel sowie Unterzeile enger zusammenfassen → dadurch entsteht unterhalb Platz für einen deutlich sichtbaren Fortfahren-Hinweis, ohne die Mitte zu überladen.
* **Hintergrund** → hinter der Titelgruppe eine extrem dunkle, aber erkennbare Bürosilhouette mit rechteckigem TV-Glow einfügen → die Aussage „Das Büro ist dunkel“ wird so sichtbar statt nur behauptet.
* **Titel „DIE HOCHRECHNUNG“** → ungefähr 1,15× vergrößern und von Braun-Gold zu einem helleren Papier-/Ockerton mit höherem Kontrast verschieben → der Titel soll dominieren, ohne in den schwarzen Hintergrund zu sinken.
* **„Klicken zum Fortfahren“** → näher an die Beschreibung rücken, etwa 1,25× vergrößern und mit kleinem Maus- oder Eingabezeichen versehen → momentan ist die einzige Handlungsaufforderung zu leicht zu übersehen.

### `fixture_wahlabend_victory_s1.png`

* **TV-Innenfläche** → obere Hälfte mit einer klaren Sendungsüberschrift „HOCHRECHNUNG“ und einer großen Ergebniszahl belegen; Balken darunter in das mittlere Drittel setzen → der Bildschirm besteht aktuell überwiegend aus leerer Fläche.
* **Wert „21,6 %“** → auf etwa das 1,5-Fache vergrößern und unmittelbar über dem Ende der Füllung platzieren → Zahl und Balken werden dadurch als Einheit gelesen.
* **Balkenskala** → Anfangs- und Endwert sowie den konkreten Schwellenwert ergänzen → ohne Skala wirkt die Fülllänge unvereinbar mit 21,6 %.
* **Vorläufige Füllung** → statt des kontrastarmen Brauntons eine helle Papierfarbe oder gedämpftes Petrol verwenden und Rot erst beim bestätigten Alarmzustand einsetzen → der Ausgang ist vor der Bekanntgabe sonst farblich unklar.
* **Untertitelstreifen** → Senderkennung etwas vergrößern, Nachricht linksbündig an derselben Kante beginnen lassen und den Innenabstand oben/unten erhöhen → der Streifen wirkt derzeit wie eine sehr kleine technische Fußnote.

### `fixture_wahlabend_victory_s2.png`

* **Ergebnisstempel** → im großen freien oberen rechten TV-Quadranten einen schräg gesetzten, klaren Stempel „REGIERUNG ABGEWÄHLT“ ergänzen → der beschriebene Stempel fehlt und würde den Zustandswechsel sofort sichtbar machen.
* **Roter Balken** → Rot nur bis zum Messwert führen und die Überschreitung der Schwelle zusätzlich als schmalen markierten Abschnitt oder „+X über Schwelle“ kennzeichnen → reiner Farbwechsel erklärt das Ergebnis nicht.
* **Ergebniszahl** → größer und in derselben roten Alarmfarbe wie der bestätigte Zustand setzen, dabei an der Füllkante ausrichten → die Zahl bleibt momentan trotz Entscheidung visuell nebensächlich.
* **Untertitel „Damit ist klar …“** → als zweizeilige Schlagzeile oberhalb des unteren Senderstreifens oder als größere Bauchbinde setzen → die eigentliche Nachricht darf nicht der kleinste relevante Text sein.
* **Fortfahren-Hinweis** → näher an den TV-Rahmen ziehen und nach der Bekanntgabe zu einer eindeutigen Aktion mit sichtbarer Eingabefläche machen → die Interaktion bleibt gegenüber dem Ergebnis zu unauffällig.

### `fixture_wahlabend_victory_s3.png`

* **TV-Block** → um ungefähr ein Viertel verkleinern und mit erkennbarem Abstand zur oberen Viewportkante platzieren → dadurch verschwinden Anschnitt und vertikale Enge.
* **Wohnzimmer-Schnitt** → den weiterhin sichtbaren abstrakten TV-Bildschirm tatsächlich durch den beschriebenen Wohnzimmerausschnitt ersetzen oder die Aufnahmebezeichnung korrigieren → Bild und angekündigter Zustand stimmen nicht überein.
* **Nachsatz des Kurators** → auf einen schmalen Telegramm-/Aktenstreifen unter dem Bild setzen, linksbündig statt mittig umbrechen → das passt zur Papierwelt und verbessert die Leselinie.
* **Folgen-Kästchen** → als gleich breites Drei-Spalten-Raster mit zwei Zeilen anlegen und identische Innenabstände verwenden → die momentanen unterschiedlich breiten Chips bilden eine unruhige Wortwolke.
* **„WEITER“** → vollständig vom unteren Rand lösen und als gestempelten Papierknopf statt als vollflächig roten Block darstellen → die aktuelle Schaltfläche ist unten eingeklemmt und widerspricht dem Stempel-CTA aus `desinformation-network/src/story-mode/theme.ts`.

### `fixture_wahlabend_timeout_s0.png`

* **Hintergrund** → dieselbe schwach sichtbare Büro- und TV-Silhouette wie für `fixture_wahlabend_victory_s0.png` ergänzen → die schwarze Fläche braucht einen narrativen Ort.
* **Titelgruppe** → leicht nach oben verschieben und die vertikalen Abstände zwischen Eyebrow, Titel, Beschreibung und Prompt auf ein konsequentes Verhältnis bringen → aktuell ist der Abstand zum Prompt größer als die innere Gruppierung rechtfertigt.
* **Titelkontrast** → Braunanteil reduzieren und einen helleren, entsättigten Ockerton verwenden → der bestehende Farbton liest sich zu erdig und zu schwach.
* **Fortfahren-Hinweis** → vergrößern und als klaren interaktiven Zustand auszeichnen → die Interaktion ist auch in diesem Zweig erst beim zweiten Blick erkennbar.

### `fixture_wahlabend_timeout_s1.png`

* **Wert und Schwelle** → „15,3 %“ an das Füllende setzen und den Abstand zur Schwelle direkt als negative Differenz beschriften → das Scheitern beziehungsweise Unterschreiten wird damit geometrisch und sprachlich klar.
* **Balkenskala** → denselben sichtbaren Wertebereich wie in `fixture_wahlabend_victory_s1.png` ergänzen → nur so sind die beiden Ausgänge vergleichbar und die Fülllänge nachvollziehbar.
* **TV-Innenraum** → eine große Hochrechnungsüberschrift und den Wert im oberen beziehungsweise mittleren Drittel ergänzen → die leere Bildschirmfläche darf nicht der größte visuelle Zustand sein.
* **Schwellenmarker** → Linie deutlich stärker und Label näher an die Linie setzen, ohne dass Text und Wert auf derselben horizontalen Ebene konkurrieren → die Schwelle ist momentan zu filigran für ihre Bedeutung.
* **Fortfahren-Hinweis** → näher an den Fernseher ziehen und um etwa ein Viertel vergrößern → der Blick muss nicht bis in eine separate, schwach sichtbare Zone springen.

---

## 3. **Grafiken/Assets**

- **`end_victory_gameend.png` und `end_victory_endreport_top.png`:** Die Papierfläche und der dunkle Kraftpapier-Kopf tragen die Behördenakte grundsätzlich, wirken aber sehr flach und digital sauber. Eine äußerst subtile, großflächige Papierfaser oder leichte Druckunregelmäßigkeit würde helfen; keine starken Flecken, Schatten oder Sepia-Patina. Am meisten fehlt im Kopf rechts ein echter Ergebnisstempel, der Titel, Sieg und Kennzahl visuell bündelt.
- **`end_victory_endreport_mid.png` und `end_victory_endreport_bottom.png`:** Es gibt keine tragende Grafik, sondern fast ausschließlich Rahmen und Text. Das Enden-Raster wirkt dadurch wie eine Debug-/Regeltabelle statt wie eine Abschlussakte. Ein einzelner Aktenreiter „Spielende“, ein gestempelter Zustand auf „Sieg“ und ein klarer Vermerkblock würden mehr bringen als zusätzliche Illustration.
- **`fixture_wahlabend_victory_s0.png` und `fixture_wahlabend_timeout_s0.png`:** Hier fehlt das im Text angekündigte räumliche Asset vollständig. Eine dunkle Büro-Silhouette mit einem kalten rechteckigen Fernsehlicht würde die riesige schwarze Fläche begründen und den modernen Ministeriumsraum sichtbar machen. Der aktuelle braun-goldene Titel wirkt eher wie ein altes 70er-Farbasset als wie die in `sprite-tool/public/context/game-style-guide.md` geforderte gepflegte 2020er-Ästhetik.
- **`fixture_wahlabend_victory_s1.png`, `fixture_wahlabend_victory_s2.png` und `fixture_wahlabend_timeout_s1.png`:** Der TV-Rahmen trägt als wiederkehrendes Asset, ist scharf und konsistent. Seine Innenfläche ist jedoch nicht gestaltet genug: Scanline-Fläche, ein Balken und eine Mini-Bauchbinde reichen für die große Fläche nicht. Es fehlt vor allem eine große Sendungskennung beziehungsweise Hochrechnungs-Titelgrafik; in `fixture_wahlabend_victory_s2.png` fehlt zusätzlich der angekündigte Ergebnisstempel.
- **`fixture_wahlabend_victory_s3.png`:** Der beschriebene Wohnzimmer-Schnitt fehlt auf dem sichtbaren Bild vollständig. Das ist keine Frage von Skalierung oder Zuschnitt, sondern ein fehlendes beziehungsweise nicht eingeblendetes Asset. Falls ein Wohnzimmerbild vorhanden ist, muss es den TV-Inhalt ersetzen und nicht hinter dem unveränderten Diagramm liegen.
- **Balkengrafik in `fixture_wahlabend_victory_s1.png`, `fixture_wahlabend_victory_s2.png` und `fixture_wahlabend_timeout_s1.png`:** Die Balkenlängen sehen ohne Skala falsch skaliert aus. 21,6 % füllt optisch etwa drei Viertel, 15,3 % mehr als die Hälfte; das kann mathematisch korrekt sein, wenn der Wertebereich beispielsweise nur bis 30 % reicht, ist aber visuell nicht erklärt. Skalenenden und Schwellenwert sind daher Bestandteil des Assets, nicht optionale Zusatztexte.
- **Farbsystem:** Das dunkle Tech-Blau der Fernseher ist als diegetischer TV-Kontext plausibel. Die goldbraunen Mini-Labels verlieren sich jedoch auf Schwarz beziehungsweise Dunkelblau. Das großflächige Rot in `fixture_wahlabend_victory_s2.png` sollte nur als klar benannter Alarm-/Ergebniszustand auftreten, passend zur Rot-Beschränkung in `desinformation-network/src/story-mode/theme.ts`.

---

## 4. **Raster & Rhythmus**

- **Berichtsbreite:** Der zentrale Bericht in `end_victory_gameend.png`, `end_victory_endreport_top.png`, `end_victory_endreport_mid.png` und `end_victory_endreport_bottom.png` belegt ungefähr etwas mehr als die halbe Bildschirmbreite. Das ist für eine Akte plausibel, aber die innere Textbreite wird fast vollständig ausgenutzt. Fließtext sollte auf etwa vier Fünftel dieser Innenbreite begrenzt werden; Tabellen und Diagramme dürfen dagegen die volle Breite nutzen.
- **Berichtskopf:** In `end_victory_gameend.png` und `end_victory_endreport_top.png` stehen Eyebrow, Titel, Untertitel und Metazeile mit ähnlichen kleinen Abständen untereinander. Danach folgt ein deutlich größerer Sprung zur Spielstil-Bewertung. Besser ist ein enger Titelcluster und anschließend ein klarer Abschnittsabstand von etwa der doppelten inneren Zeilenhöhe.
- **Scrollrhythmus:** `end_victory_endreport_mid.png` und `end_victory_endreport_bottom.png` beginnen mit einem abgeschnittenen Vorgängerelement. Abschnittsüberschriften sollten beim Scrollen mit etwas Luft unter der oberen Berichtskante landen; alternativ braucht es eine kleine feste Abschnittsnavigation.
- **Enden-Raster:** In `end_victory_endreport_mid.png` und `end_victory_endreport_bottom.png` sind Außenrand, Spaltensteg und vertikale Kartenabstände nahezu gleich klein. Dadurch entsteht Tabellenrauschen. Der Spaltensteg sollte sichtbar größer als die Rahmenstärke sein, die Zeilenabstände wiederum etwas kleiner als der Abstand zur nächsten Abschnittsüberschrift.
- **Einordnung:** Die beiden blauen Linien in `end_victory_endreport_mid.png` und `end_victory_endreport_bottom.png` schaffen zwar Trennung, aber zwei getrennte Vermerke ohne gemeinsamen Träger. Eine gemeinsame Randlinie und ein einheitlicher Einzug würden die Aussagen als zusammengehörigen Debrief gruppieren.
- **TV-Aufteilung:** In `fixture_wahlabend_victory_s1.png`, `fixture_wahlabend_victory_s2.png` und `fixture_wahlabend_timeout_s1.png` nimmt der TV etwa drei Viertel der Viewporthöhe ein, während das eigentliche Datenelement nur einen schmalen Streifen in der Mitte belegt. Entweder muss der TV niedriger werden oder sein Innenraum muss mit echter Broadcast-Hierarchie gefüllt werden.
- **Titelkarten:** In `fixture_wahlabend_victory_s0.png` und `fixture_wahlabend_timeout_s0.png` ist die Titelgruppe zu klein für die Gesamtfläche. Die Leere wäre als bewusste Spannung tragfähig, wenn eine Raumkontur oder Lichtquelle vorhanden wäre; ohne diese entsteht tote Fläche.
- **Schlussbild:** `fixture_wahlabend_victory_s3.png` hat das gegenteilige Problem: oben ein angeschnittener TV, darunter Text, zwei Chipzeilen und ein am unteren Rand klebender Knopf. Hier braucht es drei klar reservierte Zonen — Bild etwa 60 %, Nachsatz/Folgen etwa 25 %, Aktion etwa 15 % — mit sichtbaren Zwischenräumen.

---

## 5. **Lesbarkeit**

- In `end_victory_gameend.png` und `end_victory_endreport_top.png` musste ich bei „Kampagne: 2 Tage bis zum Wahltag · Aktionen gesamt: 0 · Finales Vertrauen: 58 %“ zweimal hinsehen. Diese Zeile enthält Kernwerte, wird aber wie juristische Mikrotypografie behandelt.
- Die Fließtexte in `end_victory_gameend.png` und `end_victory_endreport_top.png` sind kontrastreich genug, aber durch Pixel-Monospace, lange Zeilen und kleine Schrift ermüdend. Eine Vergrößerung um etwa 15–20 % bei leicht kompakterer Zeilenlänge wäre wirkungsvoller als mehr Fettung.
- „TRIUMPH“ und „TRIUMPHAL“ in `end_victory_gameend.png` und `end_victory_endreport_top.png` sehen interaktiv aus. Für einen passiven Zustand fehlen Stempelneigung, unregelmäßige Kontur oder eine eindeutige Beschriftung wie „Bewertung“.
- Die Texte der acht Karten in `end_victory_endreport_mid.png` und `end_victory_endreport_bottom.png` sind für einen Überblick zu klein und zu dicht. Besonders „Zusammenbruch“, „Wandel“ und „Fortsetzung“ verlangen wegen der langen Beschreibungen einen zweiten Blick.
- Der aktive Zustand „Sieg“ in `end_victory_endreport_mid.png` und `end_victory_endreport_bottom.png` ist nicht eindeutig genug. Der kleine Punkt beziehungsweise Haken und die geringe Flächenabweichung reichen nicht, um „erreicht“ von „nicht erreicht“ sofort zu unterscheiden.
- „LIVE“ sowie die Senderkennung in `fixture_wahlabend_victory_s1.png`, `fixture_wahlabend_victory_s2.png` und `fixture_wahlabend_timeout_s1.png` sind zu klein und kontrastarm. Der braun-goldene Ton verliert sich insbesondere im dunkelblauen TV-Feld.
- Die Beziehung zwischen „21,6 %“, Füllstand und „SCHWELLE“ in `fixture_wahlabend_victory_s1.png` und `fixture_wahlabend_victory_s2.png` musste ich rekonstruieren. Dasselbe gilt für „15,3 %“ in `fixture_wahlabend_timeout_s1.png`; eine Skala fehlt.
- „Klicken zum Fortfahren“ ist in `fixture_wahlabend_victory_s0.png`, `fixture_wahlabend_timeout_s0.png`, `fixture_wahlabend_victory_s1.png`, `fixture_wahlabend_victory_s2.png` und `fixture_wahlabend_timeout_s1.png` funktional zu schwach. Es ist weder als Button noch als klarer Tastatur-/Mauszustand erkennbar.
- Die sechs Folgen-Chips in `fixture_wahlabend_victory_s3.png` sind die schwerstlesbare Stelle des Bündels. Kleine Pixelschrift, dünne Rahmen, mehrere Farben und ungleiche Breiten verhindern schnelles Scannen.
- Der rote „WEITER“-Button in `fixture_wahlabend_victory_s3.png` ist zwar lesbar, aber unten angeschnitten beziehungsweise randnah und wirkt dadurch wie ein übergroßer Browser-Footer statt wie ein sauber gesetzter Spiel-CTA.

---

## 6. **Die drei wirksamsten Änderungen**

1. **TV-Inhalte in `fixture_wahlabend_victory_s1.png`, `fixture_wahlabend_victory_s2.png` und `fixture_wahlabend_timeout_s1.png` neu hierarchisieren: große Zahl, sichtbare Skala, klar benannte Schwelle und Ergebnisstempel.**  
   Das beseitigt mit geringem bis mittlerem Aufwand gleichzeitig tote Fläche, missverständliche Balkenskalierung und den zu schwachen Wahlmoment.

2. **`fixture_wahlabend_victory_s3.png` vertikal neu aufteilen: TV etwa ein Viertel kleiner, Folgen in ein gleichmäßiges Raster, CTA mit sicherem unteren Abstand.**  
   Dieser einzelne Layoutumbau behebt Anschnitt, Überfüllung, schlechte Lesbarkeit und die falsche Blickpriorität des Schlussbildes.

3. **In allen vier Report-Aufnahmen das erreichte Ergebnis als großen Stempel/Kennzahlenblock hervorheben und nicht erreichte Inhalte visuell zurückstufen.**  
   Dadurch liest man zuerst Ausgang und Bilanz statt Fließtext beziehungsweise Enden-Katalog; zugleich wird das verbindliche Papier-/Stempelprinzip aus `desinformation-network/src/story-mode/theme.ts` konsequent genutzt.

---

## 7. **Blinde Flecken**

- `end_victory_gameend.png` und `end_victory_endreport_top.png` sind praktisch identisch. Dadurch ist nicht erkennbar, ob `GameEndScreen` selbst eine eigene Gestaltung besitzt oder vollständig vom Bericht überdeckt wird.
- `end_victory_endreport_mid.png` und `end_victory_endreport_bottom.png` sind ebenfalls identisch. Für die angekündigten Bereiche Methoden-Atlas/Bilanz sowie Gegenmaßnahmen/Debrief wären eigenständige Aufnahmen mit den tatsächlich sichtbaren Abschnitten nötig.
- Das Diagramm in `end_victory_gameend.png` und `end_victory_endreport_top.png` ist nur angeschnitten. Für Kurvenführung, Legende, Achsenbeschriftung, Marker und Farbunterscheidung ist ein vollständiger Screenshot erforderlich.
- Nicht erkennbar ist, ob der Bericht per Mausrad, Drag, Tastatur oder interner Navigation scrollt und ob ein sichtbarer Scrollbalken existiert.
- Die Animation des Hochrechnungsbalkens zwischen `fixture_wahlabend_victory_s1.png` und `fixture_wahlabend_victory_s2.png` ist nicht beurteilbar. Entscheidend wären Dauer, Easing, Schwellenmoment und zeitliche Reihenfolge von Farbe, Text und eventuell Stempel.
- In `fixture_wahlabend_victory_s3.png` ist nicht feststellbar, ob der fehlende Wohnzimmer-Schnitt nur in einem früheren Animationsframe erscheint oder überhaupt nicht geladen wird. Dafür werden mehrere Frames des Übergangs benötigt.
- Hover-, Fokus-, gedrückt- und Tastaturzustände von „Bericht schließen“, „WEITER“ und „Klicken zum Fortfahren“ sind nicht sichtbar.
- Für kleine Auflösungen fehlen Aufnahmen: Besonders `fixture_wahlabend_victory_s3.png` dürfte bei geringerer Höhe weiter beschneiden, und das Zwei-Spalten-Raster in `end_victory_endreport_mid.png` könnte zu schmal werden.
- Nicht erkennbar ist, ob die sehr kleinen goldbraunen Texte durch Bewegung, Glow oder CRT-Flimmern noch schlechter lesbar werden. Dafür wären Video oder aufeinanderfolgende Frames notwendig.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
