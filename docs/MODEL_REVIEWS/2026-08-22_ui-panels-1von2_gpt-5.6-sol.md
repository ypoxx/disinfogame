# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „panels-1von2"

**Modell:** `gpt-5.6-sol` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-22
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-22T17:09:26.285Z · **Dauer:** 245.0 s
**Nutzung:** nicht gemeldet · **Kosten:** unbekannt · **Anbieter-Datensammlung:** ausgeschlossen (deny)

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
| 🖼 Bild | `panel_news.png` | `desinformation-network/runs/visual-review/latest/shots/panel_news.png` | 634 kB |
| 🖼 Bild | `panel_stats.png` | `desinformation-network/runs/visual-review/latest/shots/panel_stats.png` | 661 kB |
| 🖼 Bild | `panel_npcs.png` | `desinformation-network/runs/visual-review/latest/shots/panel_npcs.png` | 659 kB |
| 🖼 Bild | `panel_mission.png` | `desinformation-network/runs/visual-review/latest/shots/panel_mission.png` | 694 kB |

---

## Antwort des Modells

## 1. **Erster Eindruck**

### `floor_directory.png`
Der Blick landet zuerst auf dem breiten Kopfband „GEBÄUDE – ETAGEN“, danach auf der hell hinterlegten Zeile 7. Eigentlich sollte zuerst die aktuell gewählte Zielzeile auffallen; dafür ist deren graue Fläche zu ähnlich zum restlichen Papier und der rote Rand zu schmal. Die oben rechts außerhalb des Fensters sichtbare Uhr bleibt trotz Abdunklung überraschend präsent und konkurriert mit dem Tableau. Die Gliederung nach Etagen ist verständlich, aber die kleinen Etagenüberschriften gehen zwischen den größeren Zielzeilen unter. Am unteren Ende wirkt „KELLER – GEHEIMOPERATIONEN“ verwaist, weil darunter kein Eintrag mehr sichtbar ist.

### `terminal_vorgaenge.png`
Das Auge trifft zuerst auf die gelben Kartenrahmen und das horizontale Linienmuster, nicht auf Titel, Kosten oder Wirkung der Vorgänge. Für eine Auswahlansicht müssten Vorgangstitel, Konsequenz und Preis in dieser Reihenfolge erfassbar sein; derzeit werden alle Informationen durch nahezu gleich starke Kästen nivelliert. „HEUTE RELEVANT“ ist als kuratorische Leitinformation zu klein und zu weit vom Karteninhalt entfernt. Die beiden sichtbaren Karten sind sehr hoch, obwohl ein großer Teil ihrer Fläche aus Rahmen, Trennlinien und wiederholten Statuszeilen besteht. Die angeschnittene nächste Kartenreihe signalisiert Scrollbarkeit, aber weder Scrollleiste noch Positionsanzeige machen das eindeutig.

### `terminal_archiv.png`
Auch hier dominieren die gelben Rahmen und die Linienstruktur, obwohl in einer Archivansicht zuerst Filter, Suche und Trefferzustand auffallen müssten. Die obere Bedienzone enthält zwei Register, vier Kategorien, ein Suchfeld und fünf Porträtfilter auf engem Raum, ohne klare Rangordnung zwischen diesen Ebenen. Der aktive Zustand von „ARCHIV“ und „ALLE“ ist zwar heller, wird aber durch dieselbe Streifenstruktur wie die Karten optisch verunreinigt. Die großen Detailkarten eignen sich schlecht zum Durchmustern eines Katalogs mit 88 Einträgen. Die angeschnittene Kartenreihe unten wirkt erneut wie ein Layoutabbruch statt wie kontrolliertes Scrollen.

### `panel_news.png`
Zuerst fällt das rote Kopfband „NACHRICHTEN-FEED“ auf, anschließend wandert der Blick wegen der fast leeren Fläche wieder in die deutlich reichere Büroszene links. Der eigentliche Zustand „Keine Nachrichten vorhanden“ müsste der visuelle Schwerpunkt des geöffneten Panels sein, sitzt aber klein und zu weit oben. Die große leere Papierfläche vermittelt nicht „leerer Posteingang“, sondern unfertigen Inhalt. Der Zähler am unteren Rand ist räumlich vom Leerzustand abgetrennt und so klein, dass er wie eine technische Fußnote wirkt. Die schmale Buchstabenleiste links vom Panel konkurriert zusätzlich mit dem Panel, ohne ihre Funktion visuell zu erklären.

### `panel_stats.png`
Der Blick springt direkt zu „AKTUELLER STATUS“ und den großen Zahlen, weil der eigentliche Paneltitel im dunklen Kopfband kaum lesbar ist. Innerhalb des Statuskastens stehen Tag, Resttage und AP in einer lockeren Dreiecksform; dadurch fehlt eine eindeutige Leserichtung. Der massive Budgetbalken wird danach zum stärksten Element, obwohl nicht erkennbar ist, ob seine volle Länge tatsächlich „voll“ bedeutet. Die strategisch wichtigeren „HAUPTZIELE“ beginnen erst am unteren Bildrand und sind bereits abgeschnitten. Damit führt die Ansicht von Metadaten zu Ressourcen und versteckt das eigentliche Ziel.

### `panel_npcs.png`
Das Auge landet auf „Kurator Volkov“, nicht auf dem beinahe unsichtbaren Titel „KONTAKTE & NETZWERK“. Die großen Buchstabenkacheln wirken wie Platzhalter und sind schwächer als echte Porträts, obwohl Beziehungen hier das Thema sind. Namen sind gut auffindbar, aber Beziehungsstatus und Balken sitzen weit auseinander und sind zu blass, um gemeinsam gelesen zu werden. Die Büroszene links besitzt durch Cyan-Monitor und rotes Plakat mehr visuelles Gewicht als die beige Kontaktliste. Unter den fünf Zeilen bleibt fast die halbe Panelhöhe ungenutzt.

### `panel_mission.png`
Der Blick landet korrekt auf „OPERATION: WESTUNION“, danach konkurrieren jedoch drei ähnlich kräftig umrandete Dokumentblöcke miteinander. Der schwarze Hexagon-Platzhalter oberhalb des Titels wirkt wie ein fehlendes Emblem und nicht wie ein bewusstes Behördenzeichen. Der Bereich „AKTUELLE PHASE“ ist wichtig, aber seine blaue Kopfzeile zerfällt in zwei unterschiedlich behandelte Hälften. Die Direktive ist lesbar, erscheint durch Schriftgröße, Zeilenlänge und Volltextblock jedoch schwerer als nötig. Der angeschnittene nächste Rahmen am unteren Rand zeigt, dass wesentliche Inhalte außerhalb des sichtbaren Bereichs liegen, ohne Scrollzustand zu kommunizieren.

---

## 2. **Konkrete Eingriffe je Screen**

### `floor_directory.png`

- Aktuelle Zielzeile in `floor_directory.png` → roten Strich auf etwa die doppelte Stärke erhöhen, die gesamte Zeile leicht heller machen und rechts einen kompakten „AKTUELL“-Stempel setzen → der momentane Ort beziehungsweise die Wahl wird vor dem Kopfband erfasst.
- Auswahl und aktueller Ort in `floor_directory.png` → zwei getrennte Zustände verwenden: Rotstempel für „hier“, tintenblaue Kontur oder Pfeil für die Tastaturauswahl → bei bewegter Auswahl dürfen Standort und Cursor nicht gleich aussehen.
- Etagenüberschriften in `floor_directory.png` → Kontrast erhöhen, jeweils enger an den ersten zugehörigen Eintrag rücken und den Abstand zur vorherigen Gruppe auf ungefähr das Doppelte des inneren Zeilenabstands setzen → die Gruppen werden als Einheiten statt als lose Zwischenzeilen gelesen.
- Unteres Listenende in `floor_directory.png` → vertikale Leerabstände um etwa ein Sechstel reduzieren oder den Inhaltsbereich geringfügig verlängern, bis unter „KELLER – GEHEIMOPERATIONEN“ mindestens der zugehörige Zustand sichtbar ist → die verwaiste Überschrift wirkt derzeit abgeschnitten.
- Hinweisleiste in `floor_directory.png` → Schrift um etwa ein Viertel vergrößern, Tastennamen als kleine umrandete Tasten darstellen und links mit den Zieltexten darüber ausrichten → die Bedienhilfe ist momentan nur nach konzentriertem Hinsehen lesbar.
- Hintergrundabdunklung in `floor_directory.png` → Uhr, rechte Leiste und unteres HUD ebenso stark dimmen wie das Gebäude → das Tableau soll als modaler Fokus ohne helle Restinseln funktionieren.

### `terminal_vorgaenge.png`

- Papierflächen in `terminal_vorgaenge.png` → horizontales Linienmuster vollständig aus den Kartenkörpern entfernen und höchstens sehr schwach im dunklen Terminalrahmen belassen → das Muster schneidet durch Buchstaben und ist der größte Lesbarkeitsfehler.
- Kartenrahmen in `terminal_vorgaenge.png` → grelles Gelb durch den dunklen Papier-Randton aus `desinformation-network/src/story-mode/theme.ts` ersetzen; Gelb nur an tatsächlichen Warnungen verwenden → aktuell sieht jeder Vorgang wie ein Alarmzustand aus.
- Kartenkopf in `terminal_vorgaenge.png` → Titel links oben um etwa ein Drittel vergrößern, Legalitätsstatus direkt rechts daneben als Stempel setzen und Kostenchips auf eine gemeinsame rechte Kante bringen → Titel, Risiko und Preis werden in einem Blick erfassbar.
- Wirkungsblock in `terminal_vorgaenge.png` → verschachtelten Innenrahmen entfernen und Wirkung, Wäsche sowie betroffene Gruppen als drei klar getrennte Zeilen mit jeweils einer Einrückung darstellen → die mehrfachen Kästen erzeugen administrative Unruhe statt Aktenhierarchie.
- Aktionsleiste in `terminal_vorgaenge.png` → Primäraktion als Papierknopf mit rotem Stempelring gemäß `stampCtaStyle` ausführen, „Anheften“ als kleinere Sekundäraktion daneben setzen → der große grüne Balken widerspricht der Behörden-/Papierwelt und übergewichtet die Aktion.
- Scrollzustand in `terminal_vorgaenge.png` → an der rechten Innenkante eine sichtbare, schmale Positionsleiste ergänzen und zwischen erster und zweiter Kartenreihe einen vollständigen Gruppenspalt zeigen → die angeschnittenen Karten wirken sonst wie ein Renderingfehler.

### `terminal_archiv.png`

- Filterzone in `terminal_archiv.png` → Register, Kategorien und Suche auf drei klar getrennte Zeilen verteilen: Register oben, Kategorien plus Trefferzahl darunter, Suche über die volle Restbreite rechts → die Bedienebenen sind derzeit zu eng ineinandergeschoben.
- Aktive Filter in `terminal_archiv.png` → aktive Zustände als vollflächige Papierlasche mit dunkler Tinte darstellen, inaktive nur umrandet; keine Schraffur verwenden → „ARCHIV“ und „ALLE“ müssen ohne Textvergleich erkennbar sein.
- Porträtfilter in `terminal_archiv.png` → Porträts auf etwa die anderthalbfache Kantenlänge bringen, nur in ganzzahligen Pixelstufen skalieren und aktive Personen mit blauem Aktenrand markieren → Gesichter sind derzeit zu klein und weich, um als schnelle Filter zu funktionieren.
- Archivkarten in `terminal_archiv.png` → Standardansicht um rund ein Drittel verdichten: Titel, Legalität, Kosten, eine Wirkungszeile und Frische anzeigen; Detailblock erst für die gewählte Karte öffnen → 88 Vorgänge lassen sich mit den aktuellen Vollakten nicht effizient durchsuchen.
- Suchfeld in `terminal_archiv.png` → Suchsymbol beziehungsweise klare Anfangskante ergänzen, Eingabetext stärker vom Platzhalter abheben und Feldhöhe an die Kategorienknöpfe angleichen → das Feld wirkt momentan wie eine weitere dunkle Trennlinie.
- Trefferbereich in `terminal_archiv.png` → Trefferzahl direkt über den Karten links und sichtbare Scrollposition rechts platzieren → der Zusammenhang zwischen Filtern und Katalog fehlt.

### `panel_news.png`

- Leerzustand in `panel_news.png` → als zusammenhängenden Block ungefähr bei zwei Fünfteln der Panelhöhe platzieren, mit Akten-/Zeitungs-Piktogramm über einer größeren Überschrift und einer kleineren Erklärung darunter → der geöffnete Bereich erhält einen klaren Fokus.
- Leere Papierfläche in `panel_news.png` → eine sehr zurückhaltende Aktenstruktur ergänzen, etwa eine obere Ablagelinie oder ein blasses „EINGANG“-Stempelfeld, nicht flächige Dekoration → die Fläche wirkt dann absichtlich leer statt ungebaut.
- Fußzeile in `panel_news.png` → Zähler direkt unter den Leerzustand ziehen oder als kleine Statusmarke rechts im Kopfband platzieren → die jetzige Position am äußersten unteren Rand trennt zusammengehörige Informationen.
- Kopfband in `panel_news.png` → Icon und Titel auf dieselbe vertikale Mitte setzen und links denselben Innenabstand wie der Inhaltsblock verwenden → das Icon sitzt derzeit optisch etwas höher und näher am Rand.
- Buchstabenleiste in `panel_news.png` → auf einen eigenen dunkleren Träger setzen, gleiche Außenabstände ober- und unterhalb der Tasten verwenden und den gewählten Zustand vollflächig statt nur über eine dünne Kontur zeigen → die Leiste wirkt momentan wie ein fremder Zwischenstreifen.

### `panel_stats.png`

- Paneltitel in `panel_stats.png` → Text im dunklen Kopfband auf helles Papierweiß umstellen und Icon sowie Titel auf die gleiche Baseline wie in `panel_news.png` bringen → „KAMPAGNEN-STATISTIK“ ist derzeit fast unsichtbar.
- Statuskasten in `panel_stats.png` → Tag, Tage bis zur Wahl und AP als drei gleich breite Spalten in einer einzigen Zeile anordnen; Höhe des Kastens um etwa ein Drittel reduzieren → die Dreiecksverteilung verschwendet Fläche und erzeugt keine Leserichtung.
- Hauptziele in `panel_stats.png` → direkt unter den Statuskasten verschieben, Ressourcen danach anzeigen → die strategische Aufgabe darf nicht unterhalb der Falz verschwinden.
- Ressourcen in `panel_stats.png` → absolute Werte wie Budget als Zahl beziehungsweise Geldstapel behandeln und nur Werte mit erkennbarem Minimum/Maximum als Balken darstellen → der volle Budgetbalken behauptet eine Skala, die im Bild nicht erklärt wird.
- Ressourcenzeilen in `panel_stats.png` → alle Zahlen an derselben rechten Kante ausrichten, Balken auf identische Länge bringen und Bezeichnungen oberhalb statt links neben sehr langen Balken setzen → die Zeilen erhalten einen stabilen vertikalen Rhythmus.
- Scrollbereich in `panel_stats.png` → sichtbare Scrollleiste oder unteren Verlaufsindikator an der rechten Innenkante ergänzen → der angeschnittene Zielkasten wirkt derzeit wie verlorener Inhalt.

### `panel_npcs.png`

- Paneltitel in `panel_npcs.png` → helle Schrift auf dem dunklen Kopfband und stärkeren Abstand zur ersten Kontaktzeile verwenden → Titel und Liste laufen optisch ineinander.
- Buchstabenkacheln in `panel_npcs.png` → durch die bereits in `terminal_archiv.png` sichtbaren Porträts ersetzen, auf eine quadratische Größe von ungefähr zwei Textzeilen skalieren → Beziehungen brauchen Gesichter; Initialen wirken wie unfertige Assets.
- Kontaktzeilen in `panel_npcs.png` → Name oben, Rolle darunter und Beziehungsstatus mit Balken in einer dritten, gemeinsamen Zeile anordnen → „Neutral“ und der Balken sind derzeit räumlich voneinander getrennt.
- Beziehungsbalken in `panel_npcs.png` → auf etwa die doppelte aktuelle Breite bringen, Kontrast des Leertrakts erhöhen und einen Mittelpunkt für „Neutral“ markieren → die aktuelle Miniaturanzeige lässt Richtung und Ausmaß kaum erkennen.
- Gewählter Kontakt in `panel_npcs.png` → vollständige Zeile leicht heller setzen, links einen roten Aktenreiter und um das Porträt eine blaue Kontur verwenden → die alleinige blaue Kante an der Initialenkachel reicht nicht als Auswahlzustand.
- Untere Leerfläche in `panel_npcs.png` → als kompakten Detailbereich des gewählten Kontakts nutzen, beginnend direkt nach der fünften Zeile und durch eine horizontale Aktenkante getrennt → fast die halbe Panelhöhe bleibt derzeit funktional und visuell tot.

### `panel_mission.png`

- Schwarzes Hexagon in `panel_mission.png` → durch einen abstrakten, fiktiven Aktenstempel in Ministeriumsrot ersetzen oder ganz entfernen → das Hexagon sieht nach Platzhalter aus und trägt keine erkennbare Bedeutung.
- Missionskopf in `panel_mission.png` → Klassifizierungszeile und Titel enger gruppieren, vertikalen Leerraum ober- und unterhalb des Symbols halbieren und den Gesamtblock um etwa ein Viertel kürzen → zu viel Höhe geht für eine reine Titelseite verloren.
- Phasenband in `panel_mission.png` → „AKTUELLE PHASE“ links und Zeitstatus rechts als zwei gleich hohe Felder mit gemeinsamer Grundlinie behandeln → die aktuelle Mischung aus Papier- und Blaufläche wirkt zusammengesetzt.
- Direktive in `panel_mission.png` → ersten Absatz als kurze Auftragsaussage hervorheben, Konsequenzhinweis darunter durch Linie oder Stempel absetzen und Zeilenabstand leicht erhöhen → der durchgehende Textblock erschwert das Querlesen.
- Rahmenhierarchie in `panel_mission.png` → nur den Missionskopf rot, die aktuelle Phase blau und normale Textblöcke mit einfachem braunem Rand versehen; Randstärken reduzieren → drei gleich dominante Kästen konkurrieren miteinander.
- Unterer Inhaltsrand in `panel_mission.png` → sichtbare Scrollleiste und einen vollständigen Abstand vor dem nächsten Dokumentblock zeigen → der angeschnittene Rahmen liest sich als Layoutfehler.

---

## 3. **Grafiken/Assets**

- `floor_directory.png`: Das abgedunkelte Gebäude trägt als Kontext, weil noch erkennbar bleibt, wo das Tableau geöffnet wurde. Die Papierfläche und das Kraftpapier-Kopfband passen zu `desinformation-network/src/story-mode/theme.ts`; es fehlt kein großes Bildmotiv. Störend sind eher die hell bleibenden HUD-Inseln außerhalb des Modals als ein Asset selbst.
- `terminal_vorgaenge.png` und `terminal_archiv.png`: Das dunkle Terminalgehäuse kann als physischer Technikrahmen funktionieren, aber Neon-Grün, grelles Gelb und flächige Scanlines ziehen die Oberfläche zurück in ein altes CRT-Klischee. Das widerspricht sowohl der Papierwelt aus `desinformation-network/src/story-mode/theme.ts` als auch dem zurückhaltenden Tech-Cyan/Petrol aus `sprite-tool/public/context/game-style-guide.md`. Den dunklen Rahmen behalten, Bedienfarbe auf `tech` beziehungsweise `agencyBlue` umstellen und Papierkarten ohne Bildschirmraster darstellen.
- `terminal_archiv.png`: Die Porträts tragen grundsätzlich, sind aber so klein skaliert, dass Frisuren und Gesichter zu Flecken werden. Sie sollten in einer festen nativen Pixelstufe gerendert und nicht zwischen zwei Größen interpoliert werden.
- `panel_news.png`: Büro- und Publikumsszene links sind scharf, detailliert und stilistisch geschlossen; gerade deshalb entlarven sie die leere rechte Fläche. Am meisten fehlt dort ein einziges, zurückhaltendes Leerzustands-Asset: eine leere Eingangsschale, gefaltete Zeitung oder gestempelte Leermeldung in derselben feinen Pixelauflösung.
- `panel_stats.png`: Die winzigen Ressourcenicons sind nicht einheitlich gut erkennbar; insbesondere Risiko, Aufmerksamkeit und moralische Last lassen sich erst über den Text unterscheiden. Entweder auf etwa die anderthalbfache Größe bringen oder durch klarere einfarbige Tintenpiktogramme ersetzen.
- `panel_npcs.png`: Die Initialenkacheln sind der deutlichste Asset-Mangel des Bündels. Da `terminal_archiv.png` bereits passende Porträts zeigt, sollten dieselben Bildausschnitte hier groß und konsistent verwendet werden.
- `panel_mission.png`: Das schwarze Hexagon ist stilistisch zu generisch und kantig sauber gegenüber der Pixel-/Druckwelt. Ein leicht unregelmäßiger abstrakter Stempel wäre passender; kein reales Hoheitszeichen verwenden.
- `panel_news.png`, `panel_stats.png`, `panel_npcs.png` und `panel_mission.png`: Die Weltbilder links bleiben bei geöffnetem Panel vollständig kontrastreich. Eine sehr leichte, neutrale Abdunklung nur über der linken Spielfläche würde besonders bei leeren oder textlastigen Panels verhindern, dass Cyan-Monitor, rotes Poster und Publikumsszene den Panelinhalt überstimmen.

---

## 4. **Raster & Rhythmus**

- `panel_news.png`, `panel_stats.png`, `panel_npcs.png` und `panel_mission.png` verwenden zwar dieselbe Panelbreite, aber keinen einheitlichen Innenrhythmus. Ein gemeinsames Raster sollte einen Außenabstand von ungefähr vier Prozent der Panelbreite, einen Gruppenspalt von einer Textzeilenhöhe und einen Abschnittsabstand von zwei Textzeilenhöhen festlegen.
- Die Kopfbandhöhe sollte in `panel_news.png`, `panel_stats.png`, `panel_npcs.png` und `panel_mission.png` identisch bleiben; Icon und Titel benötigen überall dieselbe linke Bezugskante. Aktuell sind die roten Header überzeugender ausgerichtet als die dunklen Header.
- Die Buchstabenleiste sitzt in allen vier Panelaufnahmen zwischen Szene und Panel, beginnt aber unterhalb des Kopfbandes und endet frei im Raum. Sie braucht einen durchgehenden Träger vom unteren Rand des Kopfbandes bis zum Bildschirmende oder muss vollständig in den Panelkörper integriert werden.
- Die vier Panels verteilen Raum widersprüchlich: `panel_news.png` und `panel_npcs.png` besitzen massive tote Flächen, während `panel_stats.png` und `panel_mission.png` wichtige Inhalte abschneiden. Ein einheitlicher scrollbarer Inhaltskörper mit kompaktem festem Kopf würde beide Probleme entschärfen.
- `terminal_vorgaenge.png` und `terminal_archiv.png` besitzen ein grundsätzlich stabiles Zweispaltenraster, aber Außenrand, Spalt zwischen Karten und Innenrahmen sind zu ähnlich stark. Der Kartenspalt sollte mindestens doppelt so breit erscheinen wie eine innere Trennlinie, damit Karten als getrennte Akten lesbar werden.
- Innerhalb der Karten von `terminal_vorgaenge.png` und `terminal_archiv.png` gibt es zu viele gleichartige horizontale Grenzen. Ein Rhythmus aus Kartenkopf, Metadatenzeile, Wirkungsblock und Aktionsleiste reicht; zusätzliche Kästen innerhalb des Wirkungsblocks sollten entfallen.
- `floor_directory.png` ist sauber zentriert, leidet aber am unteren vertikalen Abschluss. Entweder muss der Inhaltsblock vollständig aufgehen oder sichtbar scrollbar sein; eine allein stehende Gruppenüberschrift direkt über der Fußzeile ist kein stabiler Abschluss.

---

## 5. **Lesbarkeit**

- In `floor_directory.png` musste ich bei „ETAGE 1 – ZENTRALE ← HIER“ und bei der Bedienhilfe unten zweimal hinsehen. Die Gruppenüberschriften brauchen mehr Kontrast, die Fußzeile mindestens eine größere typografische Stufe.
- In `terminal_vorgaenge.png` und `terminal_archiv.png` erschweren die horizontalen Linien praktisch jede kleinere Textzeile, besonders Beschreibung, NPC-Vorteil, Frischegruppen und Risikohinweis. Das Problem ist nicht nur die Schriftgröße, sondern die Frequenz des Musters direkt durch die Glyphen.
- In `terminal_archiv.png` sind die Porträtnamen und die Zustände der Filter nur durch genaues Vergleichen erkennbar. Aktiv, inaktiv und möglicherweise gewählt brauchen unterschiedliche Fläche, Rand und Tintenfarbe, nicht nur unterschiedliche Schraffur.
- In `panel_news.png` ist „Keine Nachrichten vorhanden“ problemlos lesbar, der Zähler „0 ungelesene Nachrichten“ hingegen zu klein und zu weit entfernt. Inhalt und Status sollten als eine Leerzustandsgruppe gelesen werden können.
- In `panel_stats.png` musste ich den Paneltitel im dunklen Kopfband suchen. Außerdem ist bei Budget und Kapazität nicht unmittelbar klar, was die Balkenlänge bedeutet; Werte ohne sichtbare Skala dürfen nicht wie Prozentanzeigen aussehen.
- In `panel_npcs.png` sind „Bekannt“ beziehungsweise „Neutral“, die Rollenbezeichnungen und insbesondere die Beziehungsbalken zu klein oder zu kontrastarm. Der offenbar ausgewählte Kontakt ist nur durch eine dünne blaue Kante erkennbar.
- In `panel_mission.png` ist die Klassifizierungszeile klein und sehr breit gesperrt, während die Direktive durch viele ähnlich lange Zeilen langsam wird. Eine hervorgehobene Kernaussage und ein getrenntes Konsequenzfeld wären schneller erfassbar.
- In `panel_stats.png` und `panel_mission.png` ist der Zustand „weiterer Inhalt vorhanden“ nicht lesbar: Es gibt angeschnittene Rahmen, aber keine Scrollleiste, keinen Pfeil und keinen unteren Verlauf. Das ist ein Zustandsproblem, nicht nur ein Abstandsproblem.
- Die wiederholten Buchstaben „K, M, A, K, I“ sind in `panel_news.png`, `panel_stats.png`, `panel_npcs.png` und `panel_mission.png` ohne Porträt, Beschriftung oder Tooltip nicht selbsterklärend; die beiden „K“ sind visuell ununterscheidbar.

---

## 6. **Die drei wirksamsten Änderungen**

1. **Scanlines und gelbe Alarmrahmen aus `terminal_vorgaenge.png` und `terminal_archiv.png` entfernen** — eine vergleichsweise kleine CSS-/Token-Änderung verbessert sofort Lesbarkeit, Papierwirkung und visuelle Hierarchie auf den beiden dichtesten Screens.
2. **Gemeinsame Panelhülle für `panel_news.png`, `panel_stats.png`, `panel_npcs.png` und `panel_mission.png` festziehen** — helle Titel auf dunklen Kopfbändern, einheitliche Innenkanten, eindeutigere Buchstabenleiste und sichtbarer Scrollzustand beseitigen mehrere wiederkehrende Fehler mit einer zentralen Komponente.
3. **Vertikale Dichte neu verteilen: `panel_stats.png` und `panel_mission.png` oben komprimieren, `panel_news.png` und `panel_npcs.png` unten sinnvoll belegen** — dadurch verschwinden abgeschnittene Kerninformationen auf der einen und unfertig wirkende Leerflächen auf der anderen Seite.

---

## 7. **Blinde Flecken**

- In `floor_directory.png` ist nicht erkennbar, wie Auswahl und aktueller Standort aussehen, sobald der Cursor auf einer anderen Zeile steht. Dafür werden Aufnahmen mit bewegter Auswahl, gesperrtem Ziel und sichtbarem Kellerzustand benötigt.
- In `terminal_vorgaenge.png` und `terminal_archiv.png` fehlen Hover-, Fokus-, Ausgewählt-, Gesperrt- und „neu“-Zustände. Ebenso ist nicht sichtbar, ob Scanlines animiert flimmern oder nur statisch sind.
- In `terminal_archiv.png` ist nicht erkennbar, wie aktive Personenfilter, mehrere kombinierte Filter, Suchtreffer ohne Ergebnis und lange Suchbegriffe dargestellt werden.
- In `panel_news.png` fehlt ein befüllter Zustand mit einer, mehreren und ungelesenen Nachrichten. Ohne diese Varianten lässt sich Kartenhöhe, Zeitstempelrhythmus und Priorisierung nicht beurteilen.
- In `panel_stats.png` und `panel_mission.png` ist nicht sichtbar, ob tatsächlich gescrollt werden kann, ob die Kopfzeile feststeht und wie weit der Inhalt nach unten reicht.
- In `panel_npcs.png` fehlt ein Zustand mit veränderter Beziehung, gesperrtem Kontakt, ausgewähltem Kontakt und eventuell längeren Namen oder Rollen.
- Für alle sieben Screens fehlen Aufnahmen bei kleinerer Fensterhöhe und höherer UI-Skalierung. Besonders `floor_directory.png`, `terminal_archiv.png`, `panel_stats.png` und `panel_mission.png` zeigen bereits bei 1280 × 720 vertikale Engpässe.
- Mauszeiger, Tastaturfokus, Übergangsanimationen und Öffnungs-/Schließbewegung sind in keiner Aufnahme beurteilbar; dafür wären kurze Sequenzen oder Zustandsserien nötig.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
