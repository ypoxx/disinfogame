# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „ending-2von4"

**Modell:** `gpt-5.6-sol` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-22
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-22T17:19:07.670Z · **Dauer:** 183.0 s
**Nutzung:** nicht gemeldet · **Kosten:** unbekannt · **Anbieter-Datensammlung:** ausgeschlossen (deny)

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

## 1. **Erster Eindruck**

### `end_immune_wahlabend_s2.png`
Als Erstes zieht der große rote Stempel „GEFÄLSCHT“ den Blick an; er ist deutlich dominanter als die eigentliche Aussage „Ihre Schlagzeilen – geprüft“. Eigentlich sollte zuerst die Enttarnung der Kampagne lesbar sein und der Stempel diese Aussage nur bestätigen. Der Nachrichtenschirm stößt oben an den Bildrand, während innerhalb des Schirms sehr viel ungenutzte Fläche bleibt. Unterhalb konkurrieren Fließtext, sechs kleine Milieu-Zustände und der vollrote Weiter-Button auf engem Raum miteinander.

### `end_immune_wahlabend_s3.png`
Der Blick landet korrekt auf „Das Land hält stand“, danach fehlen jedoch klar priorisierte Kennzahlen als zweiter Anker. Der große helle Berichtskörper wirkt wie eine Akte, aber die langen Absätze bilden eine gleichförmige Textwand. „Vertrauensverlauf“ erscheint erst am unteren Rand, die eigentliche Grafik ist fast vollständig abgeschnitten. Der rechts hinter der Akte sichtbare Schriftzug „Vollständiger Lagebericht“ erzeugt den Eindruck eines versehentlich überdeckten Bedienelements.

### `end_immune_gameend.png`
`end_immune_gameend.png` ist visuell nicht von `end_immune_wahlabend_s3.png` zu unterscheiden. Dadurch ist nicht erkennbar, dass ein neuer Zustand oder ein eigentlicher Endbildschirm erreicht wurde. Wieder führt der Titel korrekt, danach zerfällt die Hierarchie in viele ähnlich gewichtete Absätze. Der abgeschnittene Graph und das halb verdeckte Element rechts lassen den Bildschirm eher wie ein geöffnetes Zwischenmodal als wie einen endgültigen Abschluss wirken.

### `end_immune_endreport_top.png`
Auch `end_immune_endreport_top.png` zeigt praktisch denselben Ausschnitt wie die beiden vorherigen Aufnahmen. Für den Anfang eines Lageberichts sollte nach Titel und Kurzfazit unmittelbar „Das Rennen“ beziehungsweise die erste vollständige Auswertung sichtbar werden; stattdessen beansprucht die Rückschau fast den gesamten ersten Viewport. Der Blick bleibt deshalb in der Prosa hängen, bevor irgendeine analytische Grafik lesbar wird. Die dahinter sichtbare Oberfläche rechts schwächt erneut die Vorstellung eines eigenständigen Dokuments.

### `end_immune_endreport_mid.png`
Der Blick fällt zuerst auf das regelmäßige Kartenraster „Mögliche Spielenden“, nicht auf das tatsächlich erreichte Ende. „Enthüllung (erreicht)“ ist nur durch einen dünnen, wenig auffälligen Rahmen markiert und lässt sich im Raster leicht übersehen. Am oberen Rand steht ein abgeschnittener Rest des vorigen Abschnitts, wodurch der Ausschnitt nicht an einer sauberen Abschnittskante beginnt. Der sichtbare Inhalt zeigt weder einen deutlich erkennbaren Methoden-Atlas noch eine Bilanz, sondern vor allem mögliche Enden und die Einordnung.

### `end_immune_endreport_bottom.png`
`end_immune_endreport_bottom.png` ist visuell identisch mit `end_immune_endreport_mid.png`; ein weiterer Scrollfortschritt ist nicht erkennbar. Der Blick geht vom Kartenraster zur Einordnung und schließlich zum mittigen Schließen-Button, was als Abschlussfolge grundsätzlich nachvollziehbar ist. Die kleine Zwecknotiz über dem Button ist jedoch so schwach, dass sie eher wie Kleingedrucktes als wie ein Debriefing-Abschluss wirkt. Gegenmaßnahmen oder ein eigener Debrief-Block sind in diesem Ausschnitt nicht sichtbar.

### `end_victory_wahlabend_s0.png`
Der Blick landet auf dem Balken und der Zahl „27,0 %“, nicht auf einer Titelkarte; die angekündigte Titelkartenfunktion ist im Bild nicht erkennbar. Der Fernsehausschnitt besteht überwiegend aus leerer dunkelblauer Fläche, während die relevante Hochrechnung relativ klein und tief sitzt. Zudem wirkt die Balkenfüllung optisch deutlich größer als 27 %, was die Zahl und die Grafik gegeneinander arbeiten lässt. „Klicken zum Fortfahren“ ist zu schwach, um als nächster Schritt sicher erkannt zu werden.

### `end_victory_wahlabend_s1.png`
Der rote Balken wird nun zum stärksten Element, wodurch der Zustandswechsel gegenüber `end_victory_wahlabend_s0.png` immerhin sichtbar wird. Die eigentliche Konsequenz „die Regierung ist abgewählt“ steht aber nur im schmalen Nachrichtenticker und bekommt nicht das visuelle Gewicht des Balkens. Der große leere obere Teil des TV-Bildes bleibt erneut ungenutzt. Die Schwellenmarke, der Prozentwert und die Füllung sind zu weit auseinander verteilt, um als eine kompakte Aussage gelesen zu werden.

### `end_victory_wahlabend_s2.png`
Der Blick springt zwischen rotem Balken und vollrotem Weiter-Button; die narrative Zeile dazwischen verliert dabei. Der TV-Rahmen liegt ohne oberen Außenabstand am Viewport und wirkt gegenüber `end_victory_wahlabend_s0.png` und `end_victory_wahlabend_s1.png` nach oben verschoben beziehungsweise beschnitten. Die sechs Milieu-Zustände sind klein und bilden eine unruhige Folge unterschiedlich breiter Kästen. Eigentlich sollte der Ablauf klar „Wahlergebnis → Reaktion des Kurators → gesellschaftliche Folgen → Weiter“ lesen.

### `end_victory_wahlabend_s3.png`
Der Titel „Die Mehrheit, gemacht“ ist der richtige erste Blickpunkt und besitzt genügend Gewicht. Danach konkurrieren Kurzbeschreibung, drei Kennzahlen, Spielstil-Tags und vier Absätze ohne starken Zwischenanker. Der Vertrauensgraph wird zwar früher sichtbar als in den Immunitätsvarianten, ist am unteren Rand aber erneut abgeschnitten. Ganz oben hinter dem Bericht bleibt zudem eine kaum lesbare englische Zeile sichtbar, die wie ein technischer Rest oder eine zweite Überschrift wirkt.

---

## 2. **Konkrete Eingriffe je Screen**

### `end_immune_wahlabend_s2.png`
- Stempel „GEFÄLSCHT“ → auf etwa drei Viertel seiner jetzigen Größe reduzieren und näher an das durchgestrichene „Ihre Kampagne“ setzen → er bestätigt dann den Befund, statt ihn vollständig zu überdecken.
- TV-/Nachrichtenrahmen → insgesamt etwa ein Zehntel niedriger skalieren und oben einen Außenabstand in Höhe des unteren Tickerbands lassen → der Rahmen stößt nicht mehr an den Viewport und schafft Platz für den Abschlussbereich.
- Befundgruppe im TV → „Ihre Schlagzeilen – geprüft“ und die durchgestrichene Kampagne gemeinsam um etwa ein Viertel vergrößern und als linksbündigen Block im mittleren Drittel positionieren → die inhaltliche Aussage wird vor dem Stempel lesbar.
- Milieu-Zustände → in ein gleich breites Drei-Spalten-Raster mit zwei Zeilen setzen und horizontale wie vertikale Abstände vereinheitlichen → die sechs Folgen lassen sich schneller scannen.
- Weiter-Button → vollrote Fläche durch die in `desinformation-network/src/story-mode/theme.ts` definierte helle Papierfläche mit rotem Doppelring ersetzen → Rot bleibt Stempel-/Alarmtinte und der Button wirkt wie Teil der Behördenakte.

### `end_immune_wahlabend_s3.png`
- Berichtsbogen → von derzeit gut der halben auf etwa zwei Drittel der Viewportbreite erweitern, den Prosa-Satzspiegel aber auf ungefähr 70–75 Zeichen begrenzen → mehr Raum für Grafiken, ohne unlesbar lange Textzeilen zu erzeugen.
- Kopfbereich → vertikal um etwa ein Fünftel komprimieren und die drei Angaben „Tage“, „Aktionen“, „Vertrauen“ als gleich breite Kennzahlengruppe unter den Vorspann setzen → die Kerndaten werden zum klaren zweiten Blickpunkt.
- Spielstil-Tags → um etwa ein Fünftel vergrößern und direkt unter der Abschnittsüberschrift mit einheitlicher Höhe ausrichten → „ENTTARNUNG“ und „HOFFNUNGSVOLL“ sind derzeit zu kleinteilig.
- Fließtext → auf drei kompaktere Absätze kürzen oder den vollständigen Text in den scrollbaren Bericht verlagern → mindestens die obere Hälfte des Vertrauensgraphs sollte im ersten Ausschnitt sichtbar sein.
- Hintergrundelement rechts → bei geöffnetem Bericht vollständig abdunkeln oder ausblenden → „Vollständiger Lagebericht“ darf nicht halb hinter dem Dokument stehen.

### `end_immune_gameend.png`
- Zustandskopf → einen eindeutigen Endzustandsmarker innerhalb des Dokuments ergänzen beziehungsweise sichtbar machen, getrennt von „Abschluss-Bericht“ → `end_immune_gameend.png` muss auf den ersten Blick von `end_immune_wahlabend_s3.png` unterscheidbar sein.
- Sichtbarer CTA rechts → vollständig in den Dokumentfuß verschieben und an der rechten Innenkante des Satzspiegels ausrichten → ein abgeschnittenes Bedienelement außerhalb der Akte wirkt wie ein Ebenenfehler.
- Berichtskörper → oben stärker zusammenfassen und den Vertrauensgraph um etwa ein Drittel einer Bildschirmhöhe nach oben holen → ein Endscreen sollte Resultat und Beleg gleichzeitig zeigen.
- Dokumenthintergrund → außerhalb der Akte durch eine gleichmäßig deckende dunkle Maske ersetzen → keine dahinterliegenden Panels oder Titel dürfen mit dem Abschluss konkurrieren.

### `end_immune_endreport_top.png`
- Einleitung → nach Titel und Zwei-Zeilen-Fazit auf eine kurze Zusammenfassung begrenzen → „Vertrauensverlauf“ beziehungsweise „Das Rennen“ muss spätestens in der oberen Bildschirmhälfte beginnen.
- Kennzahlenzeile → in drei deutlich getrennte Felder mit großem Zahlenwert und kleiner Beschriftung zerlegen → die derzeitige durchlaufende Textzeile ist zu leicht zu überlesen.
- Graphrahmen → vollständig oberhalb der unteren Viewportkante positionieren oder mit einem klaren Scrollhinweis anschneiden → der aktuelle zufällige Anschnitt signalisiert weder Inhalt noch Interaktion.
- Berichtsebene → über die gesamte Fläche hinter dem Papier eine deckende Maske legen → das rechts sichtbare Hintergrund-CTA lenkt von der Dokumentnavigation ab.

### `end_immune_endreport_mid.png`
- Scrollposition → den Abschnitt „Mögliche Spielenden“ mit mindestens einer Überschriftenhöhe Abstand zur oberen Dokumentkante beginnen lassen → der abgeschnittene Satzrest darüber wirkt wie ein Capture- oder Scrollfehler.
- Karte „Enthüllung (erreicht)“ → zusätzlich zum Rahmen mit einem blauen oder roten Aktenstempel „ERREICHT“ und stärkerem linken Rand markieren → der aktive Zustand ist derzeit nur nach genauem Hinsehen erkennbar.
- Kartenraster → Titel, Statussymbol und Erklärung in allen acht Karten an denselben horizontalen Bezugskanten ausrichten → die unterschiedlich umbrechenden Erklärungen erzeugen unruhige Textanfänge.
- Abstand vor „Einordnung“ → auf ungefähr das Anderthalbfache des inneren Kartenabstands erhöhen → Enden-Katalog und Debriefing werden als zwei eigenständige Abschnitte lesbar.
- Einordnungsblöcke → beide blauen Linien gleich lang und exakt an der Überschriftkante ausrichten → die aktuelle Markierung wirkt eher wie zwei zufällige Textzitate als wie ein systematischer Debrief.

### `end_immune_endreport_bottom.png`
- Unterer Berichtsausschnitt → so scrollen beziehungsweise erfassen, dass ein gegenüber `end_immune_endreport_mid.png` tatsächlich anderer Abschnitt beginnt → aktuell sind Mitte und Ende visuell identisch.
- Abschlussnotiz → Schrift um etwa ein Fünftel vergrößern und näher an den Debrief-Text als an den Button setzen → sie soll als inhaltlicher Abschluss und nicht als juristisches Kleingedrucktes wirken.
- „Bericht schließen“ → Papier-Stempelstil statt flacher graubrauner Taste verwenden und die Breite an den Text plus großzügige Seitenränder anpassen → die finale Aktion wird klarer und entspricht `desinformation-network/src/story-mode/theme.ts`.
- Fußbereich → oberhalb und unterhalb des Buttons symmetrische Abstände verwenden → der Button sitzt derzeit näher am unteren Dokumentrand als an der Abschlussnotiz.
- Verdeckte Hintergrundoberfläche → vollständig ausblenden → der Bericht sollte am Ende nicht wie ein Modal über einem weiterhin aktiven Screen wirken.

### `end_victory_wahlabend_s0.png`
- Titelkarteninhalt → im oberen Drittel des TV-Bildes eine klare Überschrift wie die sichtbare Tickerbotschaft „Erste Hochrechnung“ platzieren → derzeit ist keine Titelkarte erkennbar und die obere Hälfte bleibt leer.
- Balkengrafik → Fülllänge numerisch an „27,0 %“ koppeln oder die verwendete Skala direkt beschriften → die aktuelle Füllung wirkt eher wie drei Viertel als wie 27 %.
- Schwellenmarke → Prozentwert der Schwelle unmittelbar unter „SCHWELLE“ anzeigen und die Linie über die volle Balkenhöhe hinausführen → Bedeutung und Größenverhältnis werden ohne Raten verständlich.
- Hochrechnungsgruppe → um etwa ein Viertel vergrößern und leicht oberhalb der vertikalen Bildschirmmitte setzen → sie ist das einzige Hauptmotiv und derzeit zu klein für die verfügbare Fläche.
- Fortfahren-Hinweis → deutlich heller, etwa ein Fünftel größer und näher an die Unterkante des TV-Rahmens rücken → die Interaktion gehört sichtbar zum Broadcast und nicht in die schwarze Restfläche.

### `end_victory_wahlabend_s1.png`
- Ergebnisaussage → „Regierung abgewählt“ zusätzlich als große Zeile oberhalb des Balkens setzen → die politische Konsequenz darf nicht nur im Ticker stehen.
- Balken, Wert und Schwelle → als kompakte Einheit gruppieren, wobei „27,0 %“ direkt am Füllende und die Schwelle direkt an ihrer Linie sitzt → die aktuelle horizontale Streuung verlangsamt das Lesen.
- Leere TV-Fläche → durch ein zurückhaltendes, feinpixeliges Hochrechnungsraster oder eine abstrakte Wahlkarte im oberen Drittel nutzen → der Schirm wirkt sonst unfertig und nicht wie eine Sondersendung.
- Fortfahren-Hinweis → denselben Kontrast und dieselbe Position wie in `end_victory_wahlabend_s0.png` erhalten, aber mit einem kleinen Interaktionssymbol ergänzen → der Hinweis bleibt momentan zu leicht übersehbar.

### `end_victory_wahlabend_s2.png`
- TV-Rahmen → auf die Größe und vertikale Position von `end_victory_wahlabend_s0.png` und `end_victory_wahlabend_s1.png` zurückführen → der Sprung an den oberen Viewportrand wirkt wie ein Layoutbruch.
- Narrative Zeile → in einen maximal etwa drei Fünftel breiten, linksbündigen Textblock direkt unter dem TV setzen → der zentrierte Zweizeiler konkurriert mit den vielen Kästen darunter.
- Milieu-Zustände → gleich breite Drei-Spalten-Matrix mit zwei Zeilen und identischen Innenabständen verwenden → die derzeit wechselnden Breiten erzeugen eine gezackte Kontur.
- Weiter-Button → näher an die Zustandsmatrix rücken, aber durch mindestens eine halbe Buttonhöhe Abstand als eigene Aktion trennen → aktuell hängt er optisch am unteren Bildschirmrand.
- Weiter-Button-Farbe → vollrote Fläche durch Papierfläche mit rotem Stempelring ersetzen → der stärkste Rotblock sollte nicht die Folgen des Wahlergebnisses überstrahlen.

### `end_victory_wahlabend_s3.png`
- Hintergrundzeile „A Manufactured Majority“ → bei geöffnetem Bericht vollständig verbergen → die kaum lesbare englische Zeile über der Akte wirkt wie ein technisches Artefakt.
- Kopfkennzahlen → „2 Tage“, „0 Aktionen“ und „58 % Vertrauen“ als drei gleich breite Felder unter dem Ergebnistext ausgeben → der Widerspruch zwischen großem Sieg und „0 Aktionen“ wird so wenigstens sichtbar statt in einer Kleinzeile versteckt.
- Spielstil-Tags → größer und mit klarerem Abstand zur folgenden Prosa setzen → „TRIUMPH“ und „TRIUMPHAL“ sind momentan klein und semantisch kaum unterscheidbar.
- Fließtextblock → Absatzabstände um etwa ein Viertel reduzieren und die letzte wiederholte Grenzüberschreitungs-Passage in einen hervorgehobenen Schlusskasten setzen → der Graph kann höher beginnen und der Text erhält einen Endpunkt.
- Vertrauensgraph → Achsentitel und 40-%-Schwelle vergrößern sowie die Kurve vollständig in den ersten Viewport holen → die Daten sind der Beleg des Endes und dürfen nicht abgeschnitten werden.

---

## 3. **Grafiken/Assets**

- `end_immune_wahlabend_s2.png`: Der „GEFÄLSCHT“-Stempel trägt die Behördenidee am stärksten, ist aber überdimensioniert und zu sauber-geometrisch. Eine leicht ungleichmäßige Tintenkante würde stärker nach realem Aktenstempel aussehen; die Schrift selbst sollte scharf bleiben.
- `end_victory_wahlabend_s0.png`, `end_victory_wahlabend_s1.png` und `end_victory_wahlabend_s2.png`: Scanlines, dunkles Blau und der schmale Nachrichtenticker bilden eine nachvollziehbare diegetische Fernsehebene. Die Grafik wirkt jedoch unfertig, weil außer einem einzelnen Balken kein Sendungsbild vorhanden ist und mehr als die Hälfte der Fläche leer bleibt.
- `end_victory_wahlabend_s0.png`: Der Balken ist die problematischste Grafik des Bündels, weil seine wahrgenommene Fülllänge nicht zur Beschriftung „27,0 %“ passt. Unabhängig von der zugrunde liegenden Spielrechnung muss eine Achse, ein Startwert oder eine zweite Vergleichsgröße sichtbar werden.
- `end_immune_wahlabend_s3.png`, `end_immune_gameend.png`, `end_immune_endreport_top.png` und `end_victory_wahlabend_s3.png`: Die Aktenflächen tragen die Papierwelt, wirken aber als vollkommen gleichmäßige Beige-Flächen etwas synthetisch. Eine sehr schwache Papierfaser oder leichte Tonwertvariation würde Materialität herstellen, ohne die Schrift zu stören.
- `end_immune_endreport_mid.png` und `end_immune_endreport_bottom.png`: Das Kartenraster funktioniert als Aktenübersicht, aber die aktive Karte braucht ein eigenständiges Asset beziehungsweise einen Stempelzustand. Ein dünner ockerfarbener Rahmen genügt nicht als „erreicht“-Signal.
- `end_immune_wahlabend_s3.png` und `end_victory_wahlabend_s3.png`: Die Graphen sind funktional, aber zu dünn und zu nah an einer generischen Web-Datenvisualisierung. Kräftigere Tintenlinien, kleine Aktenmarkierungen an Start und Ende sowie klarere Schwellenbeschriftungen würden sie in die Behördenwelt integrieren.
- `end_victory_wahlabend_s0.png` bis `end_victory_wahlabend_s2.png`: Am meisten fehlt im oberen TV-Drittel eine zurückhaltende, feinpixelige Wahlgrafik — etwa eine abstrakte Karte, Wahlbezirksmatrix oder Hochrechnungs-Tabelle ohne reale Staatssymbole. Das würde die tote Fläche nutzen und dem Balken einen glaubwürdigen Sendungskontext geben.
- Die vollroten Weiter-Buttons in `end_immune_wahlabend_s2.png` und `end_victory_wahlabend_s2.png` wirken wie fremde Standard-Game-CTAs. Sie widersprechen der Festlegung in `desinformation-network/src/story-mode/theme.ts`, nach der Primäraktionen als gestempelte Papierknöpfe statt als rot geflutete Flächen erscheinen sollen.
- Die dunklen, fast leeren Wahlabendflächen in allen gezeigten Wahlabend-Screens entfernen sich von `sprite-tool/public/context/game-style-guide.md`, das dunkle, leere Räume ausdrücklich vermeiden will. Als TV-Inhalt ist Dunkelheit plausibel; die Leere innerhalb des TV-Bildes braucht aber grafischen Sendungsinhalt.

---

## 4. **Raster & Rhythmus**

- `end_immune_wahlabend_s2.png` und `end_victory_wahlabend_s2.png` verwenden faktisch drei übereinandergestapelte Raster: TV, Erzähltext und Milieu-Kästen. Diese Raster besitzen keine gemeinsame linke Kante; TV und Ticker sind breit, der Erzähltext ist zentriert und die Kästen bilden eine wechselnde Kontur. Eine gemeinsame Inhaltsbreite von ungefähr drei Fünfteln des TV-Rahmens sollte Text, Zustandsmatrix und CTA zusammenhalten.
- Die TV-Rahmen springen zwischen `end_victory_wahlabend_s0.png`/`end_victory_wahlabend_s1.png` und `end_immune_wahlabend_s2.png`/`end_victory_wahlabend_s2.png` deutlich in Höhe und Position. Statt den Rahmen bei zusätzlichem Untertext nach oben zu schieben, sollte er proportional verkleinert werden und stets denselben oberen Sicherheitsabstand behalten.
- `end_victory_wahlabend_s0.png` und `end_victory_wahlabend_s1.png` haben extreme tote Fläche im oberen TV-Bereich. Der einzige Datenblock sitzt ungefähr im unteren Mittelfeld, obwohl er zusammen mit einer Überschrift und einer Wahlgrafik das zentrale Drittel füllen könnte.
- `end_immune_wahlabend_s3.png`, `end_immune_gameend.png`, `end_immune_endreport_top.png` und `end_victory_wahlabend_s3.png` nutzen einen etwa 56 % breiten Dokumentbogen. Eine Erweiterung auf ungefähr zwei Drittel des Viewports würde den seitlichen schwarzen Leerraum reduzieren; Prosa und Diagramme sollten dabei unterschiedliche maximale Satzbreiten erhalten.
- In den Report-Screens ist die Abschnittsfolge zu vertikal: großer Kopf, Tags, mehrere Absätze, dann Graph. Das erzeugt einen ersten Viewport ohne vollständige Datenvisualisierung. Kopf und Prosa müssen zusammen um ungefähr ein Viertel kürzer werden oder der Graph braucht einen früheren Einstieg.
- `end_immune_endreport_mid.png` und `end_immune_endreport_bottom.png` besitzen ein grundsätzlich stabiles Zwei-Spalten-Raster, beginnen aber oberhalb von „Mögliche Spielenden“ mit einem abgeschnittenen Textrest. Jeder Scrollzielpunkt sollte auf einer Überschrift oder der Oberkante eines vollständigen Moduls einrasten.
- Die Abstände innerhalb der Endenkarten sind kleiner als die Abstände zwischen Kartenraster, „Einordnung“, Abschlussnotiz und Button. Das ist richtig angelegt, aber die Hierarchie ist zu schwach; Abschnittsabstände sollten klar mindestens das Anderthalbfache der Kartenabstände betragen.
- Die Report-Overlays trennen sich nicht sauber vom Hintergrund. In `end_immune_wahlabend_s3.png`, `end_immune_gameend.png`, `end_immune_endreport_top.png` und `end_victory_wahlabend_s3.png` bleiben hinter der rechten Dokumentkante Texte oder Panels sichtbar, wodurch Vorder- und Hintergrundebene ineinanderlaufen.

---

## 5. **Lesbarkeit**

- In `end_immune_wahlabend_s2.png` musste ich bei den sechs Milieu-Zuständen zweimal hinsehen; Schrift, Kreisindikator und Rahmen sind zu fein für ihre Bedeutung. Diese Labels brauchen etwa 1,2-fache Schriftgröße, mehr Innenabstand und einen kontrastreicheren Zustandsmarker.
- In `end_victory_wahlabend_s0.png` und `end_victory_wahlabend_s1.png` sind „SCHWELLE“, „LIVE“ und „Klicken zum Fortfahren“ zu dunkel beziehungsweise zu klein. Besonders „LIVE“ verschwindet fast vollständig auf dem dunkelblauen Scanline-Hintergrund.
- Der rote Text in `end_immune_wahlabend_s2.png` liegt auf einem sehr dunklen Rotbraun und besitzt trotz Farbkontrast zu wenig Helligkeitskontrast. Überschrift und Stempel sollten heller oder der Hintergrund deutlich neutraler werden; mehr Rot allein löst das Problem nicht.
- Die Kennzahlenzeilen in `end_immune_wahlabend_s3.png`, `end_immune_gameend.png`, `end_immune_endreport_top.png` und `end_victory_wahlabend_s3.png` sind zu klein, obwohl sie das Spielergebnis zusammenfassen. Zahlen sollten etwa 1,3-fach größer als ihre Labels erscheinen und nicht in einem einzigen Satz stehen.
- Die Report-Prosa ist in allen Report-Screens für eine Pixel-Monospace-Schrift zu klein und zu dicht. Eine Vergrößerung um etwa 15 %, eine Zeilenhöhe von ungefähr 1,4 und etwas kürzere Zeilen würden die langen Rückblicke deutlich entlasten.
- In `end_immune_endreport_mid.png` und `end_immune_endreport_bottom.png` musste ich den erreichten Zustand suchen. „Enthüllung (erreicht)“ braucht neben stärkerer Kontur ein explizites Statuszeichen; die übrigen Enden sollten zugleich sichtbar inaktiv bleiben.
- Die beiden Tags „TRIUMPH“ und „TRIUMPHAL“ in `end_victory_wahlabend_s3.png` sehen fast gleich aus und liefern ohne zusätzliche Beschriftung kaum unterschiedliche Information. Falls einer Spielstil und einer Tonalität bezeichnet, sollten diese Kategorien als kleine Oberlabels sichtbar werden.
- Achsentitel und Prozentwerte in `end_victory_wahlabend_s3.png` sind zu klein und teilweise zu nah am Rand des Graphen. Die rote „40 %“-Beschriftung ist zwar farblich hervorgehoben, steht aber isoliert rechts und wird nicht sofort der gestrichelten Linie zugeordnet.
- Die Zwecknotiz „Dieses Spiel dient dem Verständnis …“ in `end_immune_endreport_mid.png` und `end_immune_endreport_bottom.png` ist deutlich schwächer als der umgebende Text. Wenn sie Teil der Immunisierungsfunktion ist, darf sie nicht wie ein rechtlicher Footer behandelt werden.

---

## 6. **Die drei wirksamsten Änderungen**

1. **Alle Wahlabend- und Report-Container auf ein konsistentes responsives Höhenraster setzen und Hintergrundelemente bei geöffnetem Bericht vollständig maskieren.** Das beseitigt abgeschnittene Rahmen, halb sichtbare Graphen und verdeckte CTAs gleichzeitig in fast allen zehn Screens.

2. **Die Informationshierarchie über eine größere Kennzahlenstufe, lesbarere Pixel-Schrift und deutlichere Aktiv-/Erreicht-Zustände schärfen.** Diese Änderung betrifft überwiegend Typografie und CSS, verbessert aber Balken, Tags, Karten, Diagramme und Abschlussberichte unmittelbar.

3. **Die leeren TV-Flächen mit einer klaren Ergebnisaussage plus zurückhaltender Wahlgrafik füllen und die Prozentbalken semantisch korrekt skalieren.** Damit werden die Wahlabend-Screens von leeren Zwischenzuständen zu verständlichen, glaubwürdigen Sendungsbildern.

---

## 7. **Blinde Flecken**

- `end_immune_wahlabend_s3.png`, `end_immune_gameend.png` und `end_immune_endreport_top.png` sind visuell nahezu identisch. Für eine Zustandsprüfung werden getrennte Aufnahmen unmittelbar vor und nach dem jeweiligen Übergang benötigt.
- `end_immune_endreport_mid.png` und `end_immune_endreport_bottom.png` zeigen denselben Ausschnitt. Für Methoden-Atlas, Bilanz, Gegenmaßnahmen und Debrief wären Screenshots nötig, bei denen jeder dieser Abschnitte mit seiner Überschrift an der oberen Dokumentkante beginnt.
- Nicht erkennbar ist, ob die Balken in `end_victory_wahlabend_s0.png` bis `end_victory_wahlabend_s2.png` animiert wachsen. Dafür wären Start-, Zwischen- und Endframe oder eine kurze Aufnahme nötig.
- Hover-, Fokus-, Tastatur- und gedrückte Zustände der Weiter- und Schließen-Buttons sind in keinem Screenshot sichtbar. Insbesondere der Kontrast des gestempelten Fokuszustands lässt sich daher nicht beurteilen.
- Nicht sichtbar ist, ob die Reports einen Scrollbalken, Scrollhinweis oder automatisches Abschnitts-Snapping besitzen. Ein Screenshot mit sichtbarem Scrollzustand und einer Aufnahme während des Scrollens wäre nötig.
- Die Skalierung auf kleineren und größeren Viewports ist nicht beurteilbar. Benötigt werden dieselben Wahlabend- und Report-Zustände mindestens einmal in einem niedrigeren 16:9-Viewport und einmal in einer größeren Desktopauflösung.
- Kantenschärfe und Pixel-Skalierung der TV-Scanlines lassen sich nur eingeschränkt bewerten, weil keine Vergrößerung vorliegt. Ein nativer 100-%-Ausschnitt von Balken, Ticker, Stempel und Reporttext würde zeigen, ob Pixelkanten sauber auf dem Raster liegen.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
