# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „rooms"

**Modell:** `gpt-5.6-sol` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-22
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-22T17:09:26.285Z · **Dauer:** 177.7 s
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
| 🖼 Bild | `fokusgruppe.png` | `desinformation-network/runs/visual-review/latest/shots/fokusgruppe.png` | 496 kB |
| 🖼 Bild | `board_direct.png` | `desinformation-network/runs/visual-review/latest/shots/board_direct.png` | 545 kB |

---

## Antwort des Modells

## 1. **Erster Eindruck**

### `newsroom.png`
Der Blick fällt zuerst auf die rote obere Linie, den Schließen-Knopf und die roten Balken rechts, nicht auf den eigentlichen Netzwerk-Monitor. Primärer Einstieg müssten der „GEGENSEITE“-Status und danach der Zustand des Tickers sein. Stattdessen dominiert eine fast vollständig schwarze, leere Fläche, die wie ein noch nicht geladenes Fenster wirkt. Der kleine Avatar und die Aufklärungsanzeige sind für ihre inhaltliche Bedeutung zu schwach gewichtet. Die nahezu schwarze Monitoroberfläche widerspricht außerdem der in `desinformation-network/src/story-mode/theme.ts` festgelegten Behörden-/Papierwelt.

### `fokusgruppe_pretest.png`
Das Auge sieht zunächst ein gleichförmiges Raster aus sechzehn ähnlich lauten Karten; Frage, Auswahlziel und Reihenfolge gehen darin unter. Zuerst müsste „Welche Masche testen?“ als klarer Arbeitsauftrag wahrgenommen werden, danach zwei bis vier gut unterscheidbare Optionen im ersten Blickfeld. Die Karten füllen nur ungefähr vier Fünftel der Breite, während rechts eine auffällige tote Spalte bleibt. Gleichzeitig läuft das Raster unten sichtbar aus dem Bild, ohne dass ein Scrollbereich oder ein Fortsetzungszeichen erkennbar wäre. Der Raumhintergrund gibt Kontext, konkurriert aber durch die transparenten Karten permanent mit dem Kleingedruckten.

### `operations_akte.png`
Hier landet der Blick sinnvoll auf „OPERATIONS-AKTE“ und anschließend auf Schritt 1, doch die lange, gleichförmige Zielliste übernimmt danach fast die gesamte Aufmerksamkeit. Die Wirkungsanalyse rechts sollte als Ergebnis- und Kontrollbereich wichtig sein, wirkt wegen ihrer leeren Fläche jedoch unfertig. Der breite rechte Bereich und die große Schaltfläche „AUSSPIELEN“ suggerieren Handlungsbereitschaft, obwohl laut Vorschau noch mehrere Voraussetzungen fehlen. Die Papierfläche trifft den gesetzten Materialstil von allen fünf Screens am deutlichsten. Lesereihenfolge und Scrollverhalten bleiben dennoch unsicher, weil Abschnitt 3 am unteren Rand abgeschnitten wird und kein deutlicher Scrollindikator sichtbar ist.

### `fokusgruppe.png`
Der rote Kevin-Rahmen und der rote Schließen-Knopf ziehen den Blick zuerst an; dadurch wird zwar der abweichende Teilnehmer erkannt, aber der globale Fokusgruppen-Kontext bleibt zweitrangig. Eigentlich sollte zuerst „FOKUSGRUPPE – WESTUNION“ und danach die Verteilung der Haltungen erfasst werden. Die sechs Karten bilden ein sauberes Raster, sind für die vorhandene Textmenge aber deutlich zu hoch und erzeugen große schwarze Leerflächen. Fünf grüne Vollrahmen machen „ruhig“ optisch lauter, als ein Normalzustand sein sollte. Die transparenten schwarzen Flächen lassen Möbel und Personen durch den Text scheinen und entfernen die Ansicht von der vorgesehenen Akten-/Papierästhetik.

### `board_direct.png`
Das Auge bleibt zuerst an der extrem kontrastreichen Korktextur hängen, erst danach an Zielen, Aktenabschnitt oder Aktionen. Das ist die falsche Reihenfolge: Zuerst müssten die drei Zielwerte, dann die freien Spuren und schließlich „Maßnahmen wählen“ lesbar sein. Die hellen Sprenkel besitzen teilweise mehr Kontrast als Schrift und Platzhalter und zerlegen dadurch jede Zeile. Die freien Spuren sehen nicht wie belegbare Aktenplätze aus, sondern wie schwach auf den Kork gedruckter Text. „LEEREN“ ist durch Rot und Kontur auffälliger als die eigentliche Hauptaktion „AUSSPIELEN“, obwohl auf der leeren Tafel zunächst weder das eine noch das andere Priorität haben sollte.

## 2. **Konkrete Eingriffe je Screen**

### `newsroom.png`
- `newsroom.png` — Titelzeile, Inhaltsrahmen und Schließen-Knopf → zu einem gemeinsamen Modalrahmen verbinden; Titel links und Schließen rechts an denselben Innenkanten ausrichten → derzeit wirken sie wie drei unabhängige Ebenen.
- `newsroom.png` — „GEGENSEITE“-Streifen → über die volle Breite des Inhalts legen und seine Höhe um etwa ein Drittel erhöhen; Avatar auf ungefähr 1,5-fache Größe bringen → Quelle, Aussage und Aufklärungsgrad werden damit zum klaren Einstieg.
- `newsroom.png` — linker Tickerbereich → die schwarze Leerfläche nicht bis zum unteren Rand ausdehnen; den Leerzustand als kompakte Papierkarte im oberen Drittel platzieren → „Keine Beiträge vorhanden“ wirkt dann wie ein Zustand statt wie fehlender Inhalt.
- `newsroom.png` — Themenliste rechts → Balken, Werte und Richtungssymbole auf drei feste Spalten ausrichten; Balken etwa doppelt so stark zeichnen und Zahlen an einer gemeinsamen rechten Kante setzen → die Werte lassen sich schneller vergleichen.
- `newsroom.png` — Monitorflächen → Schwarz durch eine sehr dunkle Kraftpapierfläche mit hellen Dokumentkarten ersetzen, Rot nur bei steigenden beziehungsweise alarmierenden Werten verwenden → die Ansicht folgt der Materialwelt aus `desinformation-network/src/story-mode/theme.ts` und verliert weniger Detail.

### `fokusgruppe_pretest.png`
- `fokusgruppe_pretest.png` — gesamter Auswahlbereich → in einen zentrierten, weitgehend opaken Aktenrahmen setzen, dessen linke und rechte Außenabstände gleich groß sind → Hintergrund und Karten bilden dann nicht länger zwei konkurrierende Textebenen.
- `fokusgruppe_pretest.png` — Kopfbereich → „1 · Welche Masche testen?“ auf eine eigene, deutlich größere Zeile setzen; Erklärung direkt darunter und Schließen an die rechte Rahmenkante → der Arbeitsauftrag wird vor dem Kartenraster gelesen.
- `fokusgruppe_pretest.png` — Kartenraster → die vier Spalten bis nahe an den rechten Rahmenrand verbreitern und alle horizontalen Zwischenräume identisch halten → die derzeit tote rechte Bildschirmspalte wird für breitere Textzeilen genutzt.
- `fokusgruppe_pretest.png` — Karteninhalt → Titel, Beispielzitat und Metadaten in drei feste vertikale Zonen gliedern; zwischen Zitat und Metadaten mindestens den Abstand einer Textzeile lassen → die untersten Angaben kleben momentan am Fließtext.
- `fokusgruppe_pretest.png` — vertikaler Verlauf → Kopfbereich fixieren, nur das Raster scrollen lassen und am rechten Rand eine deutlich sichtbare Scrollspur ergänzen → die unten abgeschnittenen Karten werden als fortgesetzte Liste verständlich.
- `fokusgruppe_pretest.png` — Auswahlzustand → ausgewählte Karte mit heller Papierfüllung und Stempelmarkierung kennzeichnen, Hover nur durch eine stärkere Innenkante → bloße Rahmenänderungen wären in diesem dichten Raster zu schwach.

### `operations_akte.png`
- `operations_akte.png` — Spaltenteilung → den Trenner nach rechts verschieben, sodass die Zielliste ungefähr zwei Drittel und die Analyse ein Drittel der Breite erhält → der aktuell leere Analysebereich verbraucht unverhältnismäßig viel Fläche.
- `operations_akte.png` — Zielzeilen → Namen und Rollen um ungefähr 15–20 Prozent vergrößern, Auswahlkreis ebenfalls vergrößern und alle Kreise an einer gemeinsamen vertikalen Achse ausrichten → Auswahlziel und Klickfläche sind derzeit zu klein.
- `operations_akte.png` — Abschnittsüberschriften 1–3 → beim Scrollen am oberen Rand der linken Spalte festsetzen und durch etwas mehr Abstand zur vorherigen Gruppe trennen → die Aktenlogik bleibt auch in langen Listen erhalten.
- `operations_akte.png` — linke Spalte → sichtbare Scrollspur und einen unteren Auslaufabstand oberhalb des Modalrandes ergänzen → Abschnitt 3 sieht im Screenshot abgeschnitten statt scrollbar aus.
- `operations_akte.png` — Wirkungsanalyse → leere Balken nicht nur mit einem kaum sichtbaren Strich markieren, sondern mit „noch offen“ direkt in der jeweiligen Zeile → unberechneter Zustand und Nullwert werden sonst verwechselt.
- `operations_akte.png` — „AUSSPIELEN“ → bis zur Erfüllung der Voraussetzungen deutlich flacher, kontrastärmer und ohne aktive Pfeilwirkung darstellen; Fehlhinweis unmittelbar darüber ausrichten → der Knopf wirkt momentan aktiver als der Aktenstand erlaubt.

### `fokusgruppe.png`
- `fokusgruppe.png` — Kopfzeile → Titelblock und Schließen-Knopf innerhalb eines gemeinsamen Aktenkopfs anordnen; Schließen kleiner und ohne zusätzliche rote Außenfassung → das Schließen konkurriert derzeit mit dem Aufnahmestatus.
- `fokusgruppe.png` — Teilnehmerkarten → dunkle Transparenz durch opake Dokumentflächen ersetzen und den Raum nur in den Zwischenräumen sichtbar lassen → Biografien und Aussagen bleiben unabhängig vom Hintergrund lesbar.
- `fokusgruppe.png` — Statusdarstellung → farbige Vollrahmen durch einen schmalen Statusstreifen links und das ausgeschriebene Statuswort ersetzen → fünf grüne Rechtecke erzeugen unnötige visuelle Lautstärke.
- `fokusgruppe.png` — Kartenhöhe → beide Reihen insgesamt um ungefähr ein Viertel komprimieren oder die Textblöcke vertikal mittiger gruppieren → aktuell bestehen die unteren zwei Drittel vieler Karten fast nur aus Leerfläche.
- `fokusgruppe.png` — Initialenfelder → etwa 1,5-fach vergrößern und bündig mit Name, Alter und Beruf zu einem gemeinsamen Personenblock setzen → die Personenanker sind gegenüber den großen Karten zu klein.
- `fokusgruppe.png` — Beobachtungshinweis unten → auf eine eigene helle Fußleiste legen und Schrift um etwa ein Viertel vergrößern → der Bedienzustand verschwindet momentan am unteren Rand.

### `board_direct.png`
- `board_direct.png` — Korkfläche → hochfrequente helle Sprenkel stark reduzieren, Korngröße vereinheitlichen und den maximalen Texturkontrast mindestens halbieren → die Materialgrafik ist momentan das lauteste Element des Screens.
- `board_direct.png` — freie Spuren → jede Spur als flachen cremefarbenen Papierstreifen mit linker Aktenlasche darstellen; zwischen den Streifen einen klaren Korkabstand lassen → belegbare Slots werden dadurch als interaktive Flächen erkennbar.
- `board_direct.png` — Zielkarten oben → auf ein gleichmäßiges Vier-Spalten-Raster bringen und „Nächste Sonntagsfrage“ als vierte Statuskarte in dieselbe Zeile setzen → die derzeitige zweite Einzelzeile bricht den Rhythmus.
- `board_direct.png` — Abschnittslabel „AKT 1“ → als durchgehendes dunkles Registerband über die volle Brettbreite führen → der kleine Titelstreifen geht zwischen Zielkarten und Korkrauschen unter.
- `board_direct.png` — Fußleiste → Bestandswerte direkt rechts neben „MASSNAHMEN WÄHLEN“ in eine gemeinsame Gruppe setzen; „AUSSPIELEN“ rechts als primäre Aktion halten und „LEEREN“ kleiner sowie mit deutlichem Abstand davor platzieren → Aktion, Status und destruktiver Befehl sind derzeit gleichrangig verteilt.
- `board_direct.png` — Schließen-Knopf → an Höhe und rechte Innenkante des Kopfbandes angleichen und seine Kontur auf die übrige Kopfbandlinie reduzieren → der Knopf wirkt wie ein nachträglich aufgesetztes Element.

## 3. **Grafiken/Assets**

- `newsroom.png`: Der sichtbare Newsroom-Hintergrund trägt den modernen, kühlen Behördenkontext und wirkt fein genug aufgelöst, wird aber so stark abgedunkelt, dass Monitore, Diagramme und Raumtiefe fast vollständig verloren gehen. Der kleine Sprecher-Avatar ist scharf, aber wie eine Briefmarke skaliert; eine Vergrößerung um etwa die Hälfte würde ihn als Quelle lesbar machen. Fremd wirkt vor allem die fast reine schwarze Monitorfläche: Sie liest sich als generisches Terminal, nicht als Akte oder Papiermonitor. Am meisten fehlt im großen linken Leerzustand eine kompakte Dokumentkarte mit Tickerstatus; keine zusätzliche Illustration.

- `fokusgruppe_pretest.png`: Der Glas-/Konferenzraum ist als Analyseumgebung glaubwürdig, aber hinter Textkarten zu detailreich. Die Karten selbst besitzen keine ausreichende Materialgrafik und wirken wie transparente Debug-Panels. Es fehlt weniger ein dekoratives Bild als ein belastbarer Papierträger: cremefarbene Karte, dunkle Aktenlasche und ein kleiner Kategorie-Stempel pro Masche würden den Inhalt besser ordnen. Zusätzliche große Illustrationen würden das ohnehin dichte Raster weiter überladen.

- `operations_akte.png`: Die seitlichen Kontrollstationen rahmen die Akte sinnvoll und sind symmetrisch genug beschnitten; ihre Dunkelheit hält sie im Hintergrund. Die helle Aktenfläche passt zu `desinformation-network/src/story-mode/theme.ts`, wirkt durch die vollkommen gleichmäßige Füllung aber noch digital-flach. Eine sehr schwache, großkörnige Papierfaser wäre ausreichend; keine Flecken oder starke Alterung. Im rechten Bereich fehlt kein Asset, sondern eine klarere Leerdarstellung der noch nicht berechenbaren Analyse.

- `fokusgruppe.png`: Der Raumhintergrund erklärt die Beobachtungssituation, wird durch die transparenten Karten aber zu einem Störmuster. Die Initialenkacheln wirken wie Platzhalter und sind als einzige Personenbilder zu klein. Kleine, fein gepixelte Personalporträts an derselben Stelle würden die sechs Stimmen wesentlich schneller unterscheidbar machen; sie sollten die Initialenkacheln ersetzen, nicht zusätzlich danebenstehen. Die Porträts müssten mit gleicher Kopfgröße und identischem Ausschnitt produziert werden, damit Alter und Status nicht durch unterschiedliche Zuschnitte verfälscht werden.

- `board_direct.png`: Die Korkgrafik ist das deutlich problematischste Asset des Bündels. Sie ist zu kontrastreich, zu kleinteilig und wirkt gegenüber der in `sprite-tool/public/context/game-style-guide.md` geforderten feinen, scharfen Pixel-Art wie eine aggressiv geschärfte oder ungünstig skalierte Textur. Besonders die weißen Sprenkel sehen nicht nach Materiallicht, sondern nach Bildrauschen aus. Es fehlen an den freien Spuren sichtbare Papierkarten, Registerlaschen oder Befestigungspunkte; ohne diese liest sich die Tafel nicht als physische Planungsfläche.

## 4. **Raster & Rhythmus**

- `newsroom.png`: Außenkopf, zentraler Rahmen und Schließen-Knopf folgen drei verschiedenen linken beziehungsweise rechten Kanten. Der Inhalt beginnt weit eingerückt, während der Titel direkt am Bildschirmrand sitzt. Innerhalb des Rahmens ist die Spaltenteilung stabil, aber die große leere linke Fläche zerstört den vertikalen Rhythmus. Der Gegenseite-Streifen endet am Spaltentrenner, obwohl er semantisch den gesamten Monitor rahmt.

- `fokusgruppe_pretest.png`: Titel und Raster sind links sauber bündig, aber die rechte Rasterkante endet weit vor dem Schließen-Knopf und dem Bildschirmrand. Dadurch entsteht rechts tote Fläche, während unten Inhalt abgeschnitten wird. Die Kartenabstände sind grundsätzlich regelmäßig, doch fehlende Außenbegrenzung und Hintergrundtransparenz lassen das Raster in den Raum auslaufen. Die Kopfzone ist zu knapp von der ersten Kartenreihe getrennt.

- `operations_akte.png`: Der Modalrahmen ist klar zentriert und die linke Listenachse funktioniert. Unruhe entsteht durch die sehr vielen dünnen Rechtecke innerhalb der Zielzeilen sowie durch winzige Zusatzanzeigen am rechten Ende jeder Zeile. Rechts herrscht dagegen zu viel ungenutzte Fläche zwischen Vorschau und Fußaktion. Die vertikale Trennung zwischen Akteninhalt und fester Aktionszone ist nicht deutlich genug.

- `fokusgruppe.png`: Außenabstände und Spaltengassen sind konsistent, die sechs großen Vollrahmen bilden aber ein dominantes Gitter. Innerhalb der Karten sitzen Personenblock, Biografie und Zitat nur im oberen Drittel; darunter bleibt tote Fläche. Die Fußzeile liegt zu nahe am Bildschirmrand und gehört optisch nicht zum Kartenraster. Eine gemeinsame Papierfläche hinter allen sechs Karten würde die Gruppe stärker zusammenfassen.

- `board_direct.png`: Rahmen, Kopfband und Fußleiste sind grundsätzlich sauber gestapelt. Innerhalb des Bretts fehlen jedoch klare horizontale Container: Labels, Platzhalter und Erklärungstexte liegen direkt auf derselben Textur. Die einzeln darunter platzierte Sonntagsfrage unterbricht das Zielraster. In der Fußleiste stehen Auswahl, Ressourcen, Hauptaktion und Löschaktion ohne ausreichend starke Gruppierung nebeneinander.

## 5. **Lesbarkeit**

- `newsroom.png`: Bei „Aufklärung 0 %“, den vier Zahlen rechts und den kleinen Richtungssymbolen musste ich zweimal hinsehen. Der blaue „GEGENSEITE“-Titel hat auf Schwarz zu wenig visuelles Gewicht. Die Themenwerte sind zwar ausgerichtet, aber zu klein und zu weit von ihren Balkenenden entfernt. Der Leerzustand ist lesbar, wird jedoch durch die enorme umgebende Schwärze semantisch entwertet.

- `fokusgruppe_pretest.png`: Die kursiven Beispielzitate und die Metadatenzeilen am Kartenfuß sind über dem Raumhintergrund nur mit konzentriertem Lesen erfassbar. Besonders „EMOTIONALISIERUNG & SPALTUNGSNARRATIVE“, die Zielgruppen hinter „trifft:“ und die Kanalangaben musste ich mehrfach prüfen. „Masche vortesten“ ist als Modusbezeichnung zu klein und zu nah am Titel. Ein aktiver, neuer oder bereits getesteter Zustand ist im Screenshot nicht unterscheidbar.

- `operations_akte.png`: Rollenbeschreibungen, „ANG“-Anzeigen und die Kennungen im Kopf sind zu klein. Die unbefüllten Wirkungsbalken sehen fast wie dünne Trennlinien aus; ihr Zustand ist nicht auf Anhieb erkennbar. Der Hinweis „Es fehlt noch …“ ist lesbar, besitzt aber weniger Gewicht als der darunterliegende große Ausspielknopf. Ob „AUSSPIELEN“ gesperrt oder lediglich noch nicht empfohlen ist, musste ich zweimal beurteilen.

- `fokusgruppe.png`: Namen und Statuswörter sind ausreichend erkennbar, Biografien und Aussagen sind dagegen für die große verfügbare Fläche unnötig klein. Beim Text von Sina und Dr. Hofer stören die durchscheinenden Hintergrundkanten besonders. Die Statusfarben funktionieren, sind aber nicht robust für Farbsehschwächen; das ausgeschriebene Wort hilft, ist jedoch deutlich kleiner als der Rahmenreiz. „BEOBACHTUNG – KEINE DIREKTIVE – ESC ZUM SCHLIESSEN“ ist am unteren Rand zu schwach.

- `board_direct.png`: Die Texte der freien Spuren musste ich wegen der Korksprenkel mehrfach lesen. Auch „Noch kein Strang …“, „Platz für einen weiteren Strang“ und die Tagesgeschäft-Zeile verlieren einzelne Buchstaben im Muster. Die Ressourcenwerte in der Fußleiste sind deutlich zu klein und besitzen keine gemeinsame Grundlinie. Der deaktivierte Zustand von „AUSSPIELEN“ ist erkennbar, aber „LEEREN“ erhält durch Rot trotzdem den stärksten Aktionskontrast.

## 6. **Die drei wirksamsten Änderungen**

1. **`board_direct.png`: Korkkontrast drastisch reduzieren und freie Spuren auf helle Papierstreifen legen.** Geringer Eingriff in Textur und Slot-Komponente, aber sofortige Verbesserung von Blickführung, Lesbarkeit und Materiallogik.

2. **`newsroom.png`, `fokusgruppe_pretest.png` und `fokusgruppe.png`: transparente Schwarzflächen durch opake Papierkarten aus `desinformation-network/src/story-mode/theme.ts` ersetzen.** Eine gemeinsame Oberflächenänderung behebt auf drei Screens gleichzeitig den größten Stilbruch und den Hintergrundkonflikt.

3. **`fokusgruppe_pretest.png` und `operations_akte.png`: echte, sichtbare Scrollbereiche mit fixierter Kopf- beziehungsweise Aktionszone einführen.** Dadurch verschwinden abgeschnitten wirkende Inhalte und die Bedienreihenfolge wird ohne neue Assets verständlich.

## 7. **Blinde Flecken**

- `newsroom.png`: Nicht erkennbar sind der gefüllte Tickerzustand, mögliche Animationen der Balken, Hoverzustände und das Verhalten bei langen Beiträgen. Dafür wären ein Screenshot mit mehreren Beiträgen und einer mit verändertem Themenwert nötig.
- `fokusgruppe_pretest.png`: Auswahl-, Hover-, Bereits-getestet- und Scrollzustände fehlen. Benötigt werden ein Screenshot mit ausgewählter Karte, einer während des Scrollens sowie eine Aufnahme bei kleinerer Fensterhöhe.
- `operations_akte.png`: Nicht sichtbar sind ein gewähltes Ziel, befüllte Analysebalken, der tatsächlich gesperrte beziehungsweise aktive Ausspielknopf und der untere Listenbereich. Dafür braucht es mindestens einen vollständig konfigurierten Zustand und einen Screenshot nach dem Scrollen.
- `fokusgruppe.png`: Unklar sind Reaktionen im Zeitverlauf, wechselnde Statuswerte, mögliche Sprecherhervorhebung und Hoverinformationen. Ein Screenshot während einer aktiven Wortmeldung sowie einer mit mehreren nicht ruhigen Teilnehmern wäre nötig.
- `board_direct.png`: Nicht sichtbar ist, wie angeheftete Maßnahmen aussehen, ob Karten verschoben werden können und wie Hover, Auswahl oder Überfüllung behandelt werden. Benötigt werden eine teilweise belegte und eine volle Tafel sowie eine Aufnahme während einer Karteninteraktion.
- Für alle fünf Screens fehlen Aufnahmen bei kleinerer Auflösung beziehungsweise UI-Skalierung; besonders `fokusgruppe_pretest.png` und `operations_akte.png` zeigen bereits bei 1280 × 720 kritische vertikale Engpässe.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
