# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „rooms"

**Modell:** `gpt-5.6-sol` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-22
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-22T17:19:07.670Z · **Dauer:** 175.1 s
**Nutzung:** nicht gemeldet · **Kosten:** unbekannt · **Anbieter-Datensammlung:** ausgeschlossen (deny)

> ⚠️ **Wie das zu lesen ist:** Ein *fremdes* Modell hat einen **kuratierten Ausschnitt**
> des Projekts gesehen — nicht das laufende Spiel und nicht das ganze Repository. Es kann
> daher weder Laufzeitverhalten prüfen noch `file:line`-Belege verifizieren. Befunde sind
> **Hypothesen**, die vor dem Umsetzen am Code/an den Daten gegenzuprüfen sind. Die
> kanonische Wahrheit bleibt [`docs/VISION_LOCK.md`](../VISION_LOCK.md) bzw. die Spieldaten.

## Gestellte Frage

Sieh dir die beigefügten Screenshots des laufenden Spiels an und mache einen UX/UI-Durchgang. Die Optik soll eine Behörden-/Papierwelt sein (Stil-Anker und Farbtoken liegen bei). Sag mir: Wo führt das Bild den Blick falsch, welche Grafiken sitzen an der falschen Stelle oder in der falschen Größe, wo stimmen Abstände und Ausrichtung nicht, und welche drei Änderungen bringen am meisten? Sei so konkret, dass man es direkt umsetzen kann.

## Dieser Durchgang: Bündel „rooms" (5 Screenshots)

Das siehst du, in dieser Reihenfolge:
- newsroom.png — Newsroom-Vertiefung (Monitore, GEGENSEITE-Streifen)
- fokusgruppe_pretest.png — Analyse-Raum: Fokusgruppen-Pre-Test
- operations_akte.png — Operations-Akte (Kommunikations-Schlachtfeld)
- fokusgruppe.png — Fokusgruppen-Ansicht
- board_direct.png — Narrativ-Tafel direkt (Vergleich zur Hotspot-Version)

Beurteile **nur diese** Aufnahmen, dafür gründlich. Andere Teile des Spiels kommen in
eigenen Durchgängen dran — verweise nicht auf Dinge, die du hier nicht siehst.

## Gezeigter Ausschnitt

15.047 Zeichen ≈ 4.180 Tokens (geschätzt) aus 3 Quellen · 1 gekürzt

| Quelle | Modus | Zeichen | Status |
|---|---|---:|---|
| `sprite-tool/public/context/game-style-guide.md` | voll | 5.496 | vollständig |
| `desinformation-network/src/story-mode/theme.ts` | voll | 3.375 | vollständig |
| `desinformation-network/runs/visual-review/latest/manifest.json` | projektion | 6.176 | gekürzt |

### Gezeigtes Anschauungsmaterial (5 Screenshot(s))

| Art | Im Text genannt als | Datei | Größe |
|---|---|---|---:|
| 🖼 Bild | `newsroom.png` | `desinformation-network/runs/visual-review/latest/shots/newsroom.png` | 373 kB |
| 🖼 Bild | `fokusgruppe_pretest.png` | `desinformation-network/runs/visual-review/latest/shots/fokusgruppe_pretest.png` | 971 kB |
| 🖼 Bild | `operations_akte.png` | `desinformation-network/runs/visual-review/latest/shots/operations_akte.png` | 374 kB |
| 🖼 Bild | `fokusgruppe.png` | `desinformation-network/runs/visual-review/latest/shots/fokusgruppe.png` | 495 kB |
| 🖼 Bild | `board_direct.png` | `desinformation-network/runs/visual-review/latest/shots/board_direct.png` | 469 kB |

---

## Antwort des Modells

## 1. **Erster Eindruck**

### `newsroom.png`
Der Blick fällt zuerst auf die rote obere Linie und den Schließen-Knopf, danach auf die riesige schwarze Leerfläche mit „Keine Beiträge vorhanden“. Eigentlich sollten zuerst der GEGENSEITE-Bericht und anschließend die Themenrangliste gelesen werden. Der Bericht ist dafür zu flach und kleinteilig, während der inhaltlich leere Ticker den größten Teil der Fläche beansprucht. Der Raumhintergrund mit seinen Monitoren ist vorhanden, wird aber so stark abgedunkelt, dass er weder Atmosphäre noch räumliche Funktion trägt. Die schwarze Monitoroptik dominiert die im Kontext vorgegebene Behörden-/Papierwelt und erzeugt genau den dunklen, leeren Eindruck, den `sprite-tool/public/context/game-style-guide.md` vermeiden will.

### `fokusgruppe_pretest.png`
Das Auge sieht zuerst eine gleichförmige Wand aus Karten; die eigentliche Frage „Welche Masche testen?“ und der erklärende Satz gehen darin unter. Die erste Blickstation sollte die Aufgabe sein, danach sollten Titel und erwartete Wirkung der einzelnen Optionen vergleichbar werden. Weil alle Karten dieselbe Kontur, Helligkeit und Textdichte haben, fehlt ein visueller Einstieg und ein eindeutiger Auswahlzustand. Das Raster endet bereits deutlich vor dem rechten Bildschirmrand, während unten weitere Karten hart abgeschnitten werden. Der Analyse-Raum ist als Kulisse erkennbar, wird aber durch die schwarzen, halbtransparenten Karten zu einem generischen Overlay statt zu einer Behördenakte.

### `operations_akte.png`
Der Blick landet korrekt auf „OPERATIONS-AKTE“, springt dann aber entweder zur langen Zielliste oder zum großen „AUSSPIELEN“-Knopf. Eigentlich sollte die Reihenfolge Ziel → Schwäche → Verbreiter → Plattform unmissverständlich von oben nach unten geführt werden. Die Aktenoptik entspricht `desinformation-network/src/story-mode/theme.ts` wesentlich besser als die übrigen Screens, aber die linke Spalte ist überfüllt und unten sichtbar abgeschnitten. Gleichzeitig bleibt rechts unter der Wirkungsanalyse sehr viel ungenutzte Papierfläche. Dadurch wirkt die Akte nicht wie ein kontrollierter Arbeitsablauf, sondern wie eine lange Liste neben einem unfertigen Formular.

### `fokusgruppe.png`
Der rote Rahmen von Kevin zieht den Blick sofort an; wenn „wütend“ der relevante Ausschlag ist, ist diese Priorisierung grundsätzlich richtig. Danach bleiben jedoch vor allem die sechs großen Rahmen und ihre leeren unteren Flächen hängen, nicht die Aussagen der Personen. Die Blickfolge sollte Status → Name/Profil → Aussage sein, aktuell konkurrieren Initialenbadge, Rahmenfarbe, Biografie und Zitat miteinander. Der Beobachtungsraum im Hintergrund ist atmosphärisch erkennbar, aber die fast schwarzen Karten machen die Ansicht unnötig schwer und entfernen sie von der Papierwelt. Der Schließen-Knopf ist wegen Größe, rotem Doppelrahmen und Randlage fast so aufmerksamkeitsstark wie der einzige auffällige Teilnehmer.

### `board_direct.png`
Der Blick bleibt zuerst an der grobkörnigen Korktextur hängen, nicht an Zielwerten, Akt oder freien Spuren. Das gewünschte Lesen wäre Ziele oben → aktueller Akt → belegte beziehungsweise freie Spuren → Ausspielen. Die Textur zerstört diese Reihenfolge, weil sie dieselbe Frequenz und teilweise ähnliche Helligkeit wie Schrift und Trennlinien besitzt. Zusätzlich bleiben Teile des darunterliegenden Screens ober- und unterhalb des Modals sichtbar und erzeugen eine zweite, konkurrierende Ebene. Die Tafel wirkt dadurch eher wie eine laute 70er-Korkwand als wie eine moderne, gepflegte Ministeriums-/Papieroberfläche.

---

## 2. **Konkrete Eingriffe je Screen**

### `newsroom.png`

- `newsroom.png` — Gesamtrahmen → Kopfbereich und rechte Themenliste auf helle Manila-Flächen umstellen; Schwarz nur im eigentlichen Ticker-/Monitorfenster belassen → die Bedienebene wird als Papierakte lesbar, ohne den Netzwerkmonitor als Motiv zu verlieren.
- `newsroom.png` — GEGENSEITE-Bericht → Zeile etwa anderthalbmal höher machen, Avatar entsprechend vergrößern und Berichtstext unter dem blauen Label auf zwei klar getrennte Zeilen setzen → der Bericht wird zur ersten inhaltlichen Blickstation statt zu einer schmalen Statusleiste.
- `newsroom.png` — Leerzustand im linken Hauptfeld → „Keine Beiträge vorhanden“ aus der geometrischen Mitte in das obere Drittel verschieben und mit einem kleinen Akten-/Tickerhinweis gruppieren → der Blick fällt nicht zuerst in eine riesige leere Fläche.
- `newsroom.png` — Themenliste rechts → Spaltenbreite auf etwa zwei Fünftel des Innenraums erhöhen, Werte direkt an das jeweilige Balkenende setzen und alle Zahlen an einer gemeinsamen rechten Kante ausrichten → Namen, Balken und Werte lassen sich zeilenweise vergleichen.
- `newsroom.png` — Schließen-Knopf → an die rechte Kante des eigentlichen Fensters statt an den Bildschirmrand setzen und Höhe sowie Innenabstand am Kopfband ausrichten → er gehört dann sichtbar zum Modal und konkurriert weniger mit dessen Inhalt.

### `fokusgruppe_pretest.png`

- `fokusgruppe_pretest.png` — Kartenraster → bis auf denselben rechten Außenabstand wie links verbreitern; die vier Spalten dadurch jeweils ungefähr ein Fünftel breiter machen → die derzeit tote rechte Bildschirmzone wird genutzt und die Texte bekommen Luft.
- `fokusgruppe_pretest.png` — Aufgabenblock oben → auf einen durchgehenden hellen Papierstreifen legen, Titel links, kurze Erklärung darunter und „Welche Masche testen?“ als deutlich größere zweite Hierarchiestufe → die Aufgabe steht vor der Optionswand.
- `fokusgruppe_pretest.png` — Karteninhalt → Titel oben, Zitat als mittleren Block und Wirkung/Kanal als fest verankerten Fußbereich setzen; zwischen diesen drei Zonen jeweils mindestens einen halben Innenabstand zusätzlich geben → die Karten werden horizontal vergleichbar statt zu Textblöcken.
- `fokusgruppe_pretest.png` — unterer Kartenbereich → als klar begrenzten Scrollbereich mit sichtbarer Scrollleiste oder deutlichem unteren Fortsetzungsindikator ausführen → die angeschnittene fünfte Reihe wirkt nicht länger wie ein Layoutfehler.
- `fokusgruppe_pretest.png` — Auswahlzustand → nur die gewählte Karte mit rotem Stempel oder doppelter Kontur markieren; Hover höchstens über eine leichte Papieraufhellung zeigen → Rot bleibt Aktion beziehungsweise Stempel und der Zustand ist nicht nur über minimale Linienänderungen erkennbar.
- `fokusgruppe_pretest.png` — „× Schließen“ → in den neuen Kopfstreifen integrieren und vertikal an Titel und Erklärung ausrichten → der Knopf schwebt nicht länger isoliert über der freien rechten Zone.

### `operations_akte.png`

- `operations_akte.png` — linke Prozessspalte → als eigenen Scrollbereich mit sichtbarer Leiste ausführen, während Kopfband und unterer Aktionsbereich feststehen → Abschnitt 3 darf nicht am unteren Fensterrand abgeschnitten erscheinen.
- `operations_akte.png` — Zielzeilen → Höhe um ungefähr ein Sechstel reduzieren, Name und Rollenbeschreibung enger gruppieren und zwischen den Zeilen dafür einen klaren kleinen Abstand lassen → mehr Prozessschritte werden sichtbar, ohne dass die Liste zu einer massiven Wand wird.
- `operations_akte.png` — rechte Leerfläche → Wirkungsanalyse und Vorschau auf die obere Hälfte begrenzen; darunter eine großformatige Checkliste der vier noch fehlenden Entscheidungen anordnen → die Fläche erklärt den Arbeitsfortschritt statt unfertig zu wirken.
- `operations_akte.png` — Abschnittsüberschriften links → Nummernkästchen, Titel und Statushinweis auf eine gemeinsame Grundlinie setzen; erledigte Abschnitte einklappen, nur den aktuellen Abschnitt offen halten → der Ablauf wird als Folge von Schritten statt als endlose Liste gelesen.
- `operations_akte.png` — „AUSSPIELEN“ → im unvollständigen Zustand deutlich blasser als die Papierfläche setzen und den fehlenden Zustand unmittelbar darüber benennen; erst bei Vollständigkeit Stempelrahmen und Pfeil aktivieren → der große Knopf zieht nicht vorzeitig Aufmerksamkeit auf eine unmögliche Aktion.
- `operations_akte.png` — Auswahlkreise und kleine ANG-Balken → Kreise etwa auf die Höhe der ersten Textzeile vergrößern und alle Balken an einer gemeinsamen rechten Innenkante ausrichten → Auswahl und Vergleich sind derzeit zu klein und unruhig verteilt.

### `fokusgruppe.png`

- `fokusgruppe.png` — Teilnehmerkarten → die Kartenhöhe um ungefähr ein Viertel reduzieren oder alternativ Schrift und Zitate deutlich vergrößern; die derzeit leere untere Hälfte jeder Karte nicht bestehen lassen → Inhalt und belegte Fläche stehen wieder in einem plausiblen Verhältnis.
- `fokusgruppe.png` — Teilnehmerkopf → Initialenbadge, Name, Alter und Beruf in einem kompakten oberen Papierstreifen gruppieren; Status als kleiner Stempel rechts oben platzieren → Profil und Reaktion werden als Einheit gelesen.
- `fokusgruppe.png` — grüne und rote Vollrahmen → auf neutrale Aktenkonturen umstellen und Farbe nur an Statusstempel sowie einer kurzen linken Markierung verwenden → die Ansicht wirkt weniger wie ein Debug-Raster und Rot bleibt der tatsächlichen Abweichung vorbehalten.
- `fokusgruppe.png` — Biografie und Aussage → Aussage ungefähr eine Stufe größer setzen, Biografie kleiner und heller darüber; beide Blöcke mit einem klaren vertikalen Abstand trennen → das spielrelevante Zitat wird wichtiger als der Hintergrundtext.
- `fokusgruppe.png` — äußeres Raster → obere und untere Reihe mit demselben Zwischenraum trennen wie die Spalten; die unteren Karten exakt an den vertikalen Kanten der oberen ausrichten → die mittlere Kreuzfuge wirkt derzeit härter als die übrigen Abstände.
- `fokusgruppe.png` — Schließen-Knopf → auf die Höhe des Kopfbandes reduzieren und bündig innerhalb dessen rechter Kante setzen → der Knopf verliert seine übermäßige Alarmwirkung.

### `board_direct.png`

- `board_direct.png` — Korkfläche → hochfrequente Sprenkelung stark reduzieren und auf eine flache, entsättigte Kraftpapier- oder feine Fasertextur umstellen; Kontrast der Textur auf höchstens einen kleinen Bruchteil des Schriftkontrasts begrenzen → die Fläche darf nicht vor den Informationen gelesen werden.
- `board_direct.png` — freie Spuren und Tagesgeschäft → jede Zeile auf einen hellen Papierstreifen legen, Label links in einer festen schmalen Spalte und Beschreibung rechts in einer breiten Spalte → Schrift liegt nicht mehr direkt auf der unruhigen Textur.
- `board_direct.png` — obere Zielkarten → als dreispaltiges Raster über die volle nutzbare Breite verteilen, gleiche Höhe verwenden und Innenkanten mit den Spuren darunter ausrichten → die aktuell ungleich langen Karten bilden keine klare gemeinsame Zielzeile.
- `board_direct.png` — Kopfband und Tafel → linke Innenkante von „NARRATIV-TAFEL“, Zielkarten, Spuren und unterem Maßnahmenknopf identisch setzen → derzeit wechseln die Bezugskanten zwischen Modal, Korkfläche und Bedienelementen.
- `board_direct.png` — darunterliegender Screen → die gesamte Bildschirmfläche hinter dem Modal gleichmäßig stärker abdunkeln, einschließlich der sichtbaren Bereiche oben und unten → die rote Überschrift und die unteren Karten des Hintergrunds dürfen nicht als zweite Ebene mitlesen.
- `board_direct.png` — untere Aktionen → Ressourcenanzeige unmittelbar rechts vom Maßnahmenknopf gruppieren; „LEEREN“ kleiner und optisch sekundär halten, „AUSSPIELEN“ erst im aktiven Zustand zum stärksten Element machen → Destruktion und deaktivierte Hauptaktion konkurrieren derzeit unnötig.

---

## 3. **Grafiken/Assets**

- `newsroom.png` — Der detaillierte Newsroom-Hintergrund trägt die räumliche Idee, ist aber durch Abdunklung und Overlay fast vollständig entwertet. Sichtbar bleiben hauptsächlich harte Wand- und Monitorrechtecke; die Monitorgrafiken selbst sind zu dunkel, um als Information oder Atmosphäre zu funktionieren. Der kleine Avatar im Bericht ist stilistisch passend, aber so stark verkleinert, dass Gesicht und Ausdruck kaum lesbar sind. Am meisten fehlt im großen Leerzustand eine kleine, scharf gezeichnete Papier- oder Tickergrafik, die „noch keine Meldungen“ als absichtlichen Zustand markiert.

- `fokusgruppe_pretest.png` — Der moderne Analyse-Raum mit Glaswand trägt den in `sprite-tool/public/context/game-style-guide.md` verlangten 2020er-Behördencharakter. Die Karten liegen jedoch wie schwarze Web-Panels darüber und wirken stilfremd zur Papierwelt aus `desinformation-network/src/story-mode/theme.ts`. Durch die Transparenz laufen Tischkanten, Personen und Fensterpfosten hinter Texten entlang. Hier fehlen keine zusätzlichen Illustrationen; am meisten bringt der Wechsel zu deckenden Karteikarten mit sehr dezenter Papierfaser.

- `operations_akte.png` — Die helle Aktenfläche, das rote Vertraulichkeitszeichen und das dunkle Kommandozentrum als Randkulisse tragen den Stil. Die Hintergrundgrafik ist ausreichend scharf, wird aber symmetrisch nur in schmalen Restflächen gezeigt und hat daher primär Rahmenfunktion. Die kleinen Angstbalken sind grafisch zu fein und farblich zu ähnlich, um bei dieser Skalierung zuverlässig vergleichbar zu sein. In der rechten Leerfläche fehlt keine dekorative Illustration, sondern eine funktionale Aktenübersicht oder Checkliste.

- `fokusgruppe.png` — Der Beobachtungsraum mit Tisch und Personen unterstützt das Szenario, wird jedoch fast vollständig von dunklen Karten überlagert. Die Initialenbadges sind scharf, aber als einzige Personenmarker zu groß im Verhältnis zu den Namen und zu abstrakt für eine Fokusgruppe. Kleine, monochrome Aktenfotos neben den Namen würden die sechs Personen schneller unterscheidbar machen; sie sollten höchstens etwa anderthalbmal so breit wie die aktuellen Initialenbadges sein. Die grünen Rahmen wirken zu digital und zu gesättigt gegenüber der gedämpften Behördenpalette.

- `board_direct.png` — Die Korktextur ist das schwächste Asset des Bündels: grob skaliert, extrem kontrastreich und visuell näher an Rauschen als an Material. Ihr Ausschnitt wiederholt keine klare Struktur, wodurch sie flimmert und die Pixelkante der Schrift verschluckt. Die kleinen Zielkarten funktionieren als Papierobjekte, sind aber zu flach und inkonsistent breit. Am meisten fehlen sichtbare, helle Papierstreifen für die eigentlichen Narrativspuren; diese würden Materialidee und Lesbarkeit gleichzeitig lösen.

---

## 4. **Raster & Rhythmus**

- `newsroom.png` — Der äußere Modalrahmen ist sauber zentriert, aber der globale Schließen-Knopf gehört nicht zu diesem Raster. Links entstehen drei sehr unterschiedliche Höhen: flacher Bericht, flacher Tickerkopf, riesiges Leerfeld. Rechts endet die Informationsdichte nach dem vierten Thema, darunter bleibt ebenfalls eine große schwarze Fläche; beide Spalten brauchen entweder eine kompaktere Gesamthöhe oder funktionale Folgeflächen.

- `fokusgruppe_pretest.png` — Das Vier-Spalten-Raster ist intern regelmäßig, sitzt aber deutlich links statt im verfügbaren Bildschirm zentriert. Rechts bleibt ungefähr eine zusätzliche Kartenbreite ungenutzt, während unten Inhalt verloren geht. Die Abstände zwischen Karten sind kleiner als ihre Rahmenstärke und Textdichte erwarten lassen; ein etwas größerer Spaltenabstand und deutlich mehr innerer Abstand würden die Gruppen beruhigen.

- `operations_akte.png` — Die vertikale Zweiteilung ist klar, aber das Verhältnis von überfüllter linker zu leerer rechter Spalte ist unausgewogen. Die Zielliste folgt einem regelmäßigen Rhythmus, der beim Wechsel zu Abschnitt 2 und 3 durch die untere Beschneidung abbricht. Kopfband, Prozessinhalt und Aktionsfuß brauchen drei eindeutig getrennte, jeweils feststehende Zonen.

- `fokusgruppe.png` — Das 3×2-Raster nutzt die Breite gut und besitzt gleichmäßige Außenränder. Innerhalb der Karten sitzt jedoch fast der gesamte Inhalt im oberen Drittel, sodass sechs gleich große tote Flächen entstehen. Der schmale Zwischenraum zwischen den beiden Reihen wird durch zwölf aufeinandertreffende grüne Rahmen optisch zu einer schweren horizontalen Linie.

- `board_direct.png` — Der Modalrahmen, die innere Korkfläche und die Inhalte verwenden unterschiedliche linke und rechte Bezugskanten. Die Zielkarten bilden nur im linken und mittleren Bereich eine Zeile; rechts bleibt ungenutzte Tafelbreite. Unten sind Maßnahmenknopf und Ressourcen eng gruppiert, während die beiden rechten Aktionen weit abgesetzt sind; ein konsistentes Fußraster mit linker Werkzeuggruppe und rechter Aktionsgruppe fehlt.

---

## 5. **Lesbarkeit**

- `newsroom.png` — Zweimal hinsehen musste ich bei „Aufklärung 0 %“, weil es klein und unmittelbar an die Trennkante gesetzt ist. Auch die Zahlen 48, 35, 35, 31 und 31 stehen weit unter beziehungsweise neben den Balkenenden und sind nicht sofort zuzuordnen. Der blau gesetzte GEGENSEITE-Titel ist auf Schwarz erkennbar, aber zu klein für seine inhaltliche Priorität. Der Leerzustand ist lesbar, besitzt jedoch keine zusätzliche Erklärung, ob gerade geladen wird, gefiltert wurde oder tatsächlich keine Beiträge existieren.

- `fokusgruppe_pretest.png` — Die kursiven Zitate und besonders die Metadatenzeilen „EMOTIONALISIERUNG & SPALTUNGSNARRATIVE …“ sind auf dem durchscheinenden Hintergrund zu klein. Bei mehreren Karten musste ich Titel, Zitat und Wirkung erneut trennen, weil alle drei nahezu dieselbe Helligkeit und Zeilenbreite besitzen. Ein aktiver, gesperrter oder bereits getesteter Zustand ist in der Aufnahme nicht erkennbar. Die angeschnittenen Karten unten sehen eher abgeschnitten als bewusst scrollbar aus.

- `operations_akte.png` — Namen und Rollen sind ausreichend trennbar, aber „ANG“ und die winzigen Balken rechts verlangen genaues Hinsehen. Die Wirkungsanalyse zeigt leere Balken, ohne dass der Unterschied zwischen „noch nicht berechnet“, „null“ und „gesperrt“ visuell erklärt wird. Abschnitt 3 ist unten angeschnitten; dadurch ist nicht lesbar, wie viele weitere Verbreiter folgen. Der deaktivierte Zustand von „AUSSPIELEN“ ist farblich erkennbar, aber wegen der Größe bleibt der Knopf trotzdem zu dominant.

- `fokusgruppe.png` — Die Biografien und Zitate sind trotz großer Karten sehr klein gesetzt. Insbesondere die langen Zeilen bei Dr. Hofer und Aylin verlangen wegen dünner Schrift, Transparenz und Hintergrundkanten ein zweites Lesen. „RUHIG“ und „WÜTEND“ sind zusätzlich ausgeschrieben und daher nicht ausschließlich farbcodiert; das ist richtig, aber die Wörter sind zu klein gegenüber den Rahmenfarben. Ein Zustand wie neu gesprochen, aktuell ausgewertet oder bereits berücksichtigt ist nicht sichtbar.

- `board_direct.png` — Die Hinweise in den freien Spuren und im Tagesgeschäft sind stellenweise nur mit Mühe lesbar, weil helle und dunkle Sprenkel direkt durch die Buchstaben laufen. Auch die Ressourcenwerte „0K/150K“ und „0/5 AP“ sind wegen Größe, Icons und Textur nicht auf Anhieb erfassbar. „AUSSPIELEN“ wirkt deaktiviert, doch die Ursache muss aus dem übrigen Screen erschlossen werden. Die Zielkarten oben sind deutlich besser lesbar als der Tafelinhalt und legen damit unbeabsichtigt die falsche Hierarchiestufe fest.

---

## 6. **Die drei wirksamsten Änderungen**

1. **`board_direct.png`: Korkrauschen durch eine ruhige Kraftpapierfläche plus helle Papierstreifen für jede Spur ersetzen.** Das ist voraussichtlich ein lokaler Asset-/CSS-Eingriff und behebt zugleich den größten Lesbarkeits-, Stil- und Blickführungsfehler des Bündels.

2. **`fokusgruppe_pretest.png` und `operations_akte.png`: echte Scrollbereiche mit festem Kopf/Fuß und sichtbarer Fortsetzungsanzeige einführen.** Damit verschwinden die derzeit wie Layoutfehler wirkenden Beschneidungen, ohne dass Inhalte oder Spiellogik neu gebaut werden müssen.

3. **`newsroom.png`, `fokusgruppe_pretest.png` und `fokusgruppe.png`: schwarze transparente Bedienkarten durch deckende Manila-/Papierflächen ersetzen und Schwarz nur für tatsächliche Monitorbilder reservieren.** Dieser gemeinsame Materialwechsel bringt die drei Screens mit `desinformation-network/src/story-mode/theme.ts` zusammen und verbessert Kontrast sowie räumliche Hierarchie gleichzeitig.

---

## 7. **Blinde Flecken**

- `newsroom.png` — Nicht erkennbar sind Ladeanimation, Aktualisierung des Tickers, Hoverzustände der Themen, Auf-/Zuklappen der Pfeile und der Zustand mit vorhandenen Beiträgen. Dafür wären Aufnahmen mit gefülltem Ticker sowie je einem geöffneten und ausgewählten Thema nötig.
- `fokusgruppe_pretest.png` — Nicht sichtbar sind Hover, Auswahl, Bestätigung, bereits getestete oder gesperrte Maschen sowie das tatsächliche Scrollverhalten. Zusätzlich wäre eine Aufnahme nach Auswahl einer Karte und eine am unteren Ende der Liste nötig.
- `operations_akte.png` — Nicht erkennbar sind ausgewählte Zielzeile, ausgefüllte Wirkungsbalken, aufgeklappte spätere Abschnitte und aktiver „AUSSPIELEN“-Zustand. Eine vollständig konfigurierte Akte sowie ein Screenshot während des Scrollens würden die Hierarchieprüfung vervollständigen.
- `fokusgruppe.png` — Unklar bleiben Sprecherwechsel, Animationen, neue Reaktionen, Hover und die Frage, ob Karten dynamisch wachsen oder dauerhaft diese Höhe besitzen. Benötigt würden Aufnahmen mit mehreren emotionalen Zuständen und während eines Sprecherwechsels.
- `board_direct.png` — Nicht sichtbar sind angeheftete Maßnahmen, Drag-and-drop, Hoverziele, belegte Spuren und der aktive Ausspielen-Zustand. Für eine belastbare Prüfung fehlen eine teilweise gefüllte und eine vollständig spielbereite Tafel sowie eine Aufnahme während des Ziehens einer Maßnahme.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
