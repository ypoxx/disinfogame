# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „ending-4von4"

**Modell:** `gpt-5.6-sol` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-22
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-22T17:09:26.285Z · **Dauer:** 150.6 s
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
Der Blick landet zuerst auf dem kleinen Balken in der Bildschirmmitte, danach auf „15.3 %“. Eigentlich müsste die Beziehung zwischen Ergebnis, Schwelle und Konsequenz unmittelbar lesbar sein; derzeit sind diese drei Informationen räumlich auseinandergezogen und visuell gleich schwach. Der fast vollständig leere TV-Bereich dominiert stärker als das eigentliche Ergebnis. Die rote Bezeichnung „Westunion Erwacht“ konkurriert semantisch mit dem ockerfarbenen Balken, ohne eindeutig zu erklären, ob der Zustand gut, schlecht oder neutral ist. Ein Ergebnisstempel, den die Beschreibung des Schritts erwarten lässt, ist in `fixture_wahlabend_timeout_s2.png` nicht zu sehen.

### `fixture_wahlabend_timeout_s3.png`
In `fixture_wahlabend_timeout_s3.png` bleibt der Blick zunächst wieder am Balken hängen, obwohl nun der Nachsatz unterhalb des TV-Bildes die neue Information sein sollte. Danach springt das Auge direkt zum massiven roten „WEITER“-Knopf und übersieht leicht den Satz über die Zentrale. Die fünf Milieu-Badges bilden eine kleinteilige, unruhige Zwischenebene ohne klaren gemeinsamen Start- und Endpunkt. Ein Wohnzimmer-Schnitt ist im Screenshot nicht erkennbar; visuell bleibt es dieselbe abstrakte Ergebnissendung wie zuvor. Der untere Inhaltsblock ist so knapp an den Bildschirmrand gedrängt, dass er wie nachträglich unter das TV-Modul geschoben wirkt.

### `fixture_wahlabend_immune_s0.png`
In `fixture_wahlabend_immune_s0.png` führt der Titel „DIE HOCHRECHNUNG“ zuerst den Blick, was für eine Titelkarte richtig ist. Der deutlich kleinere Kontext „WAHLTAG · WESTUNION“ funktioniert als Vorzeile, ist aber wegen Farbe und Größe erst beim zweiten Hinsehen lesbar. Untertitel und Interaktionshinweis stehen zu dicht in derselben schwachen Hierarchie. Die enorme schwarze Fläche erzeugt zwar Pause, macht die Karte aber weniger amtlich und eher wie einen unbestückten Ladebildschirm. Die angekündigte Behörden-/Papierwelt ist hier praktisch nicht sichtbar.

### `fixture_wahlabend_immune_s1.png`
In `fixture_wahlabend_immune_s1.png` fällt zuerst der dunkelrote Bildschirmteppich auf, dann die Überschrift „IHRE SCHLAGZEILEN – GEPRÜFT“. Eigentlich sollte die Unterbrechung als Sondersendung den ersten visuellen Impuls setzen, doch „SONDERSENDUNG“ sitzt sehr klein und kontrastarm in der äußersten rechten Ecke. Die Schlagzeilen sind in einem schmalen Block auf der linken Hälfte konzentriert, während rechts und unten sehr viel ungenutzte Fläche bleibt. Der Sprechertext im unteren Band ist besser lesbar als der eigentliche Sendungsinhalt und zieht dadurch zu viel Aufmerksamkeit. Als „Hochrechnung/Sondersendung“ zeigt der Screen weder Hochrechnung noch Nachrichtengrafik, sondern nur eine Textliste.

### `fixture_wahlabend_immune_s2.png`
Der große diagonale Stempel „GEFÄLSCHT“ ist in `fixture_wahlabend_immune_s2.png` eindeutig der erste Blickpunkt. Das ist grundsätzlich die richtige Ergebnispriorität, aber der Stempel liegt direkt über Überschrift und erster Schlagzeile und zerstört deren Lesbarkeit. Die gestrichenen Texte werden zugleich durch geringe Helligkeit, Scanlines und Durchstreichung geschwächt. Der entscheidende Immunitätsausgang – Faktenchecker zerlegen die Kampagne – steht nur im schmalen Tickerband unten. Dadurch kommuniziert der Screen vor allem „Schlagzeilen gefälscht“, nicht klar „Publikum immunisiert/Manipulation abgewehrt“.

### `fixture_wahlabend_immune_s3.png`
In `fixture_wahlabend_immune_s3.png` bleibt der Stempel der stärkste Punkt, gefolgt vom roten „WEITER“-Knopf. Der neue Nachsatz „Die Zentrale ist nicht mehr erreichbar“ steht dagegen in einer relativ schwachen Textzeile zwischen zwei starken Modulen. Die Milieu-Badges wirken wie technische Debug-Ausgaben: klein, unterschiedlich breit und ohne klare Überschrift oder Gruppenkante. Der angekündigte Wohnzimmer-Schnitt ist auch hier nicht sichtbar; der obere Bereich wiederholt lediglich das Ergebnisbild aus Schritt 2. Die vertikale Komposition ist überfüllt, und der Knopf berührt optisch beinahe den unteren Bildschirmrand.

### `fixture_wahlabend_exposed_s0.png`
`fixture_wahlabend_exposed_s0.png` ist visuell identisch mit der Immune-Titelkarte: Der Titel führt korrekt, danach folgen Vorzeile und Untertitel. Für einen gemeinsamen Auftakt ist diese Gleichheit plausibel, aber die Karte etabliert weder Sendungsform noch Akten-/Behördenmaterialität. Die schwarze Fläche ist weit größer als der tatsächlich genutzte Informationsbereich. „Klicken zum Fortfahren“ ist zu klein und zu kontrastarm, um klar als Interaktion zu funktionieren. Der Titelblock wirkt eher frei im Raum platziert als auf einem erkennbaren Raster oder Trägermaterial verankert.

### `fixture_wahlabend_exposed_s1.png`
Auch in `fixture_wahlabend_exposed_s1.png` führt zuerst die dunkelrote Fläche und erst danach die Schlagzeilenliste. „SONDERSENDUNG“ sollte den Ereigniswechsel markieren, ist aber als winziges Ecklabel zu schwach. Der Inhalt nutzt kaum mehr als die linke Hälfte des TV-Bildes; die verbleibende Fläche trägt weder Atmosphäre noch zusätzliche Information. Der untere Sprecherstreifen besitzt durch seinen höheren Hell-Dunkel-Kontrast mehr Gewicht als die Sendung selbst. Visuell ist dieser Screen nicht von `fixture_wahlabend_immune_s1.png` zu unterscheiden.

### `fixture_wahlabend_exposed_s2.png`
In `fixture_wahlabend_exposed_s2.png` ist der Stempel wieder der erste und stärkste Blickpunkt. Die eigentliche branchenspezifische Nachricht – die Ermittler haben das Netzwerk aufgedeckt – ist dagegen in das untere Laufband ausgelagert. Damit erzählt die Hauptfläche nur denselben Sachverhalt wie beim Immune-Ausgang: Die Schlagzeilen waren gefälscht. Die Offenlegung des Netzwerks, also die wesentlich stärkere Konsequenz dieses Zweigs, erhält weder eigene Überschrift noch eigenes Bildzeichen. Da Aufbau, Stempel und Farbgebung mit `fixture_wahlabend_immune_s2.png` übereinstimmen, muss man den Ticker lesen, um den Ausgang überhaupt zu unterscheiden.

### `fixture_wahlabend_exposed_s3.png`
In `fixture_wahlabend_exposed_s3.png` konkurrieren drei Ebenen: der große Stempel, die Milieu-Badges und der rote Weiter-Knopf. Die narrative Hauptfolge „Netzwerk aufgedeckt“ bleibt im TV-Ticker und ist dadurch räumlich von „Die Zentrale ist nicht mehr erreichbar“ getrennt, obwohl beide zusammengehören. Wieder fehlt der sichtbare Wohnzimmer-Schnitt; die obere Bildhälfte ist lediglich eine Wiederholung des vorherigen Ergebnisses. Die Badges vermitteln Reaktionen, aber ihre kleine Schrift und uneinheitliche Breite verhindern schnelles Erfassen. Der fast angeschnittene untere Knopf erzeugt den Eindruck, dass die gesamte Komposition nicht für die vorhandene Bildschirmhöhe ausgelegt ist.

---

## 2. **Konkrete Eingriffe je Screen**

### `fixture_wahlabend_timeout_s2.png`

- `fixture_wahlabend_timeout_s2.png` — Ergebnisblock → Balken samt Beschriftung um etwa ein Drittel vergrößern und als kompakte Gruppe in das obere mittlere Drittel des TV-Bildes setzen → aktuell verliert sich die einzige Hauptinformation in der Leerfläche.
- `fixture_wahlabend_timeout_s2.png` — Wert „15.3 %“ → direkt über dem aktuellen Balkenende oder rechts daran andocken, statt ihn an das äußerste Balkenende zu setzen → Wert und tatsächliche Füllung werden dann als Einheit gelesen.
- `fixture_wahlabend_timeout_s2.png` — Schwellenmarke → senkrechte Linie über die gesamte Balkenhöhe führen und „SCHWELLE“ mit mindestens einer halben Textzeile Abstand oberhalb platzieren → die Marke schwebt derzeit zwischen Beschriftung und Balken.
- `fixture_wahlabend_timeout_s2.png` — Ergebnisstatus → unter dem Balken eine kurze, deutlich größere Zeile wie „SCHWELLE NICHT ERREICHT“ auf derselben linken Kante ergänzen → der Spieler muss die Bedeutung aktuell selbst aus Geometrie und Ticker ableiten.
- `fixture_wahlabend_timeout_s2.png` — TV-Fußzeile → Senderlabel, Trennabstand und Nachricht auf eine gemeinsame vertikale Mitte setzen und dem Text links wie rechts mindestens eine Zeichenbreite mehr Innenraum geben → das Band wirkt derzeit gequetscht und vom Hauptbild abgetrennt.

### `fixture_wahlabend_timeout_s3.png`

- `fixture_wahlabend_timeout_s3.png` — Oberes TV-Modul → auf ungefähr zwei Drittel der Bildschirmhöhe kürzen und seine Oberkante mit einem kleinen Außenabstand vom Viewport lösen → so erhält der Nachsatz unten einen eigenen, nicht gequetschten Bereich.
- `fixture_wahlabend_timeout_s3.png` — Nachsatz „Im Büro …“ → als Überschrift des unteren Blocks behandeln, um etwa ein Viertel vergrößern und links an der Badge-Gruppe statt mittig ausrichten → diese neue narrative Information muss vor den Reaktionsdetails gelesen werden.
- `fixture_wahlabend_timeout_s3.png` — Milieu-Badges → in zwei gleich breite, sauber zentrierte Reihen auf einem gemeinsamen Spaltenraster setzen; gleiche Höhe und identische Innenabstände verwenden → die jetzigen Einzelbreiten erzeugen eine zackige Silhouette.
- `fixture_wahlabend_timeout_s3.png` — „WEITER“-Knopf → eine Knopfhöhe vom unteren Rand abrücken und statt roter Vollfläche als heller Papierknopf mit rotem Doppelring ausführen → das entspricht dem Stempel-CTA aus `desinformation-network/src/story-mode/theme.ts` und verhindert den beinahe abgeschnittenen Eindruck.
- `fixture_wahlabend_timeout_s3.png` — Wohnzimmer-Schnitt → im oberen Modul tatsächlich eine Bildfläche für Wohnzimmer oder Bürofassade zeigen und den Balken nur als kleinere Einblendung darüberlegen → der beschriebene Szenenwechsel ist im sichtbaren Screen nicht vorhanden.

### `fixture_wahlabend_immune_s0.png`

- `fixture_wahlabend_immune_s0.png` — Titelblock → insgesamt etwa ein Viertel vergrößern und leicht oberhalb der Bildschirmmitte platzieren → der Titel bleibt stark, ohne von der übergroßen schwarzen Fläche verschluckt zu werden.
- `fixture_wahlabend_immune_s0.png` — Vorzeile → näher an den Titel rücken, aber durch einen dünnen horizontalen Aktenstrich oder ein schmales Kopfband absetzen → sie wirkt derzeit wie ein zufällig schwebendes Mini-Label.
- `fixture_wahlabend_immune_s0.png` — Untertitel → auf die Breite des Titels begrenzen und mit ungefähr einer Textzeile Abstand darunter setzen → die drei Textebenen erhalten dadurch einen nachvollziehbaren vertikalen Rhythmus.
- `fixture_wahlabend_immune_s0.png` — Fortfahren-Hinweis → stärker aufhellen, etwa ein Fünftel vergrößern und deutlich weiter vom Untertitel abrücken → momentan wird er als dritte Unterzeile statt als Bedienhinweis gelesen.
- `fixture_wahlabend_immune_s0.png` — Hintergrundträger → hinter dem Titelblock eine zurückhaltende, querformatige Papier-/Aktenfläche einsetzen, die etwa die halbe Bildschirmbreite belegt → die aktuelle reine Schwarzfläche widerspricht der in `desinformation-network/src/story-mode/theme.ts` festgelegten Behörden-Akte.

### `fixture_wahlabend_immune_s1.png`

- `fixture_wahlabend_immune_s1.png` — Schlagzeilenblock → um etwa ein Viertel vergrößern und auf ungefähr zwei Drittel der inneren TV-Breite ausdehnen → die Liste ist derzeit für die Hauptsendung zu klein.
- `fixture_wahlabend_immune_s1.png` — Inhaltsposition → Block aus der linken unteren Mitte in das obere linke Drittel verschieben, mit gleicher Innenkante wie das Senderlabel unten → dadurch entsteht eine klare Sendungsachse.
- `fixture_wahlabend_immune_s1.png` — „SONDERSENDUNG“ → mindestens auf die Größe der Listenüberschrift bringen, mit einem schmalen roten Kopfband hinterlegen und weiter von oberer sowie rechter Rahmenkante abrücken → der Sendungswechsel ist aktuell kaum sichtbar.
- `fixture_wahlabend_immune_s1.png` — Schlagzeilenzeilen → Zeilenabstand auf etwa anderthalb Schriftzeilen erhöhen und die Pfeile in einer festen eigenen Spalte führen → die vier Einträge kleben optisch zusammen.
- `fixture_wahlabend_immune_s1.png` — Fortfahren-Hinweis → an die Unterkante des TV-Rahmens anbinden oder als kleiner Papier-Reiter unter der rechten Ecke platzieren → derzeit schwebt er ohne Bezug mittig unter dem Gerät.

### `fixture_wahlabend_immune_s2.png`

- `fixture_wahlabend_immune_s2.png` — Stempel → um etwa 10–15 % verkleinern und in das freie rechte Drittel verschieben, ohne Überschrift oder Schlagzeilen zu überdecken → Wirkung bleibt erhalten, Lesbarkeit steigt deutlich.
- `fixture_wahlabend_immune_s2.png` — Schlagzeilenblock → links auf knapp drei Fünftel der TV-Breite begrenzen und vertikal mit dem Stempel zentrieren → daraus entsteht eine kontrollierte Zweispaltenkomposition.
- `fixture_wahlabend_immune_s2.png` — Durchstreichungen → heller und etwas stärker als die Schrift zeichnen, aber pro Zeile nur eine saubere Linie verwenden → aktuell verschwimmen Text, Scanline und Streichung.
- `fixture_wahlabend_immune_s2.png` — Immunitätsfolge → oberhalb des Tickers eine eigene Ergebniszeile „KAMPAGNE ENTLARVT“ oder gleichwertige vorhandene Formulierung in größerer Schrift setzen → der Ausgang darf nicht allein im Sprecherband versteckt sein.
- `fixture_wahlabend_immune_s2.png` — Ticker → Senderlabel schmaler fassen und der Nachricht den übrigen Raum geben; beide an einer gemeinsamen Grundlinie ausrichten → das Band liest sich momentan wie zwei nur lose gekoppelte Elemente.

### `fixture_wahlabend_immune_s3.png`

- `fixture_wahlabend_immune_s3.png` — Wiederholtes Ergebnisbild → auf etwa die Hälfte der Bildschirmhöhe reduzieren oder durch den angekündigten Wohnzimmer-Schnitt ersetzen → Schritt 3 braucht einen sichtbaren Szenenwechsel statt einer nahezu identischen Wiederholung.
- `fixture_wahlabend_immune_s3.png` — Nachsatz → in einen helleren Aktenstreifen direkt unter dem Bild setzen, linksbündig mit der Badge-Gruppe und mit größerem Zeilenabstand → die Konsequenz wird so zum Übergang zwischen Bild und Reaktionen.
- `fixture_wahlabend_immune_s3.png` — Milieu-Badges → positive und negative Reaktionen in zwei klar beschriftete Gruppen oder zumindest zwei feste Spalten ordnen → Symbolform allein reicht bei der kleinen Darstellung nicht zur schnellen Einordnung.
- `fixture_wahlabend_immune_s3.png` — Badgeschrift → etwa ein Fünftel vergrößern und die dunklen Ockertexte aufhellen → insbesondere „Besorgte Mitte sitzt stumm“ und „Macher sitzt stumm“ erfordern zweimaliges Hinsehen.
- `fixture_wahlabend_immune_s3.png` — „WEITER“-Knopf → höher setzen, seitlich auf die Breite von zwei Badges begrenzen und als Stempel-CTA statt roter Vollfläche gestalten → der Knopf ist momentan zu dominant und zu nah am unteren Rand.

### `fixture_wahlabend_exposed_s0.png`

- `fixture_wahlabend_exposed_s0.png` — Titelblock → etwa ein Viertel vergrößern und als geschlossene Gruppe leicht oberhalb der Mitte platzieren → die aktuelle Gruppe ist im Verhältnis zur Fläche zu klein.
- `fixture_wahlabend_exposed_s0.png` — Titel → Zeichenabstand geringfügig reduzieren oder die Gesamtbreite etwas erhöhen → die breite Pixelschrift wirkt derzeit klein, obwohl sie formal die größte Schrift ist.
- `fixture_wahlabend_exposed_s0.png` — Untertitel und Klickhinweis → Abstand zwischen beiden ungefähr verdoppeln und den Klickhinweis heller darstellen → Inhalt und Interaktion werden aktuell nicht klar getrennt.
- `fixture_wahlabend_exposed_s0.png` — Hintergrund → eine dezente Aktenkante, Papierfläche oder horizontale Dokumentmarke hinter dem Mittelblock ergänzen → ohne Materialhinweis bleibt die Behördenästhetik unsichtbar.

### `fixture_wahlabend_exposed_s1.png`

- `fixture_wahlabend_exposed_s1.png` — Schlagzeilenliste → größer und breiter setzen, sodass sie ungefähr zwei Drittel des Innenrahmens nutzt → momentan wirkt sie wie eine kleine Untertitelgrafik in einem leeren Sendebild.
- `fixture_wahlabend_exposed_s1.png` — „IHRE SCHLAGZEILEN – GEPRÜFT“ → direkt über der Liste mit ungefähr einer halben Zeilenhöhe Abstand platzieren und stärker vom Hintergrund abheben → Überschrift und Einträge sind zu schwach voneinander getrennt.
- `fixture_wahlabend_exposed_s1.png` — Sondersendungslabel → aus der Ecke lösen und als durchgehendes schmales Kopfband an der oberen Rahmenkante ausführen → Ereignisstatus und Ministeriums-Rot erhalten damit eine klare, regelkonforme Funktion.
- `fixture_wahlabend_exposed_s1.png` — Leere rechte Hälfte → entweder durch eine sachliche Sendungsgrafik belegen oder die Liste zentraler und breiter setzen → reine Fläche trägt hier weder Atmosphäre noch Hierarchie.
- `fixture_wahlabend_exposed_s1.png` — Unteres Sprecherband → Höhe leicht reduzieren und Nachrichtenschrift nicht größer als die Schlagzeilentexte setzen → aktuell überstrahlt der Kommentar den eigentlichen Bildinhalt.

### `fixture_wahlabend_exposed_s2.png`

- `fixture_wahlabend_exposed_s2.png` — Zweigüberschrift → oberhalb des Stempels eine eigenständige, große Zeile „NETZWERK AUFGEDECKT“ aus dem vorhandenen Tickerinhalt setzen → die branchenspezifische Konsequenz muss vor der generischen Fälschungsmarkierung gelesen werden.
- `fixture_wahlabend_exposed_s2.png` — Stempel → in das rechte Drittel verschieben und nicht über der ersten Schlagzeile platzieren → er bestätigt dann den Befund, statt den zugrunde liegenden Inhalt unlesbar zu machen.
- `fixture_wahlabend_exposed_s2.png` — Schlagzeilenliste → linksbündig auf ein festes Textfeld begrenzen und die Durchstreichungen an dessen rechter Kante enden lassen → derzeit schneiden Linien und Stempel unkontrolliert ineinander.
- `fixture_wahlabend_exposed_s2.png` — Exposed-Kennzeichnung → zusätzlich zum roten Stempel ein blaues oder anthrazitfarbenes Aktenetikett „ERMITTLUNG/BELEGE“ am oberen linken Rand einsetzen → der Screen muss sich auch ohne Lesen des Tickers von `fixture_wahlabend_immune_s2.png` unterscheiden.
- `fixture_wahlabend_exposed_s2.png` — Tickertext → als Zusammenfassung belassen, aber nicht als einzige Trägerfläche der Offenlegung verwenden → der wichtigste Zweigstatus ist aktuell an der visuell schwächsten Stelle untergebracht.

### `fixture_wahlabend_exposed_s3.png`

- `fixture_wahlabend_exposed_s3.png` — Oberes Bild → auf etwa die halbe Höhe reduzieren und die Wiederholung durch den angekündigten Wohnzimmer-/Bürogebäude-Schnitt ersetzen → so wird aus Schritt 3 tatsächlich ein neuer narrativer Beat.
- `fixture_wahlabend_exposed_s3.png` — Konsequenzzeile → direkt unter dem Bild in einem eigenen Papierstreifen platzieren und „Zentrale nicht mehr erreichbar“ typografisch hervorheben → die operative Folge gehört visuell zur Aufdeckung.
- `fixture_wahlabend_exposed_s3.png` — Reaktionsbadges → auf gleiche Breiten normieren und an einer gemeinsamen linken und rechten Kante ausrichten → die aktuelle Staffelung erzeugt unnötige horizontale Unruhe.
- `fixture_wahlabend_exposed_s3.png` — Zustandszeichen in den Badges → Symbol und Textfarbe deutlicher koppeln und die Zeichen um etwa ein Viertel vergrößern → Dreieck, Quadrat und Kreis sind derzeit zu klein für eine belastbare Zustandskodierung.
- `fixture_wahlabend_exposed_s3.png` — „WEITER“-Knopf → mindestens eine halbe Knopfhöhe vom unteren Rand abrücken und als heller Stempelknopf nach `desinformation-network/src/story-mode/theme.ts` gestalten → aktuell wirkt er beinahe abgeschnitten und verletzt den vorgesehenen Materialstil.

---

## 3. **Grafiken/Assets**

- Der diagonale „GEFÄLSCHT“-Stempel in `fixture_wahlabend_immune_s2.png`, `fixture_wahlabend_immune_s3.png`, `fixture_wahlabend_exposed_s2.png` und `fixture_wahlabend_exposed_s3.png` trägt am stärksten. Er ist scharf, sofort verständlich und passt grundsätzlich zur Aktenwelt. Seine Positionierung ist jedoch zu zentral und seine Überlagerung zu aggressiv; er sollte Inhalt markieren, nicht verdecken.
- Die TV-Rahmen in allen S1–S3-Aufnahmen geben eine stabile Bühne, wirken aber eher wie ein abstrakter Terminalrahmen als wie ein konkreter Fernseher oder ein Dokumentfenster. Rahmen, Scanlines und dunkle Flächen sind sauber skaliert, aber visuell zu gleichförmig.
- Die dunkelroten Vollflächen in den Immune-/Exposed-Screens wirken fremd zur verbindlichen Oberfläche aus `desinformation-network/src/story-mode/theme.ts`: Dort sind Creme-/Manila-Flächen und Kraftpapier-Träger vorgesehen, während Rot nur für Stempel, Kopfbänder und Alarm reserviert ist. Hier wird Rot zur gesamten Bildfläche und verliert damit seine Signalwirkung.
- `fixture_wahlabend_timeout_s2.png` und `fixture_wahlabend_timeout_s3.png` besitzen nur einen funktionalen Balken, aber kein erkennbares Ergebnisasset oder Stempelmotiv. Der Balken ist außerdem zu flach und farblich zu nah am Rahmen, um die große Fläche zu tragen.
- In `fixture_wahlabend_immune_s1.png` und `fixture_wahlabend_exposed_s1.png` fehlt eine Sendungsgrafik, die „Hochrechnung/Sondersendung“ visuell belegt. Eine sachliche Wahlgrafik, ein Aktenauszug oder eine klar gerahmte Prüfkarte würde die leere rechte Hälfte am meisten verbessern.
- In allen S3-Aufnahmen fehlt sichtbar der angekündigte Wohnzimmer-Schnitt. `fixture_wahlabend_timeout_s3.png`, `fixture_wahlabend_immune_s3.png` und `fixture_wahlabend_exposed_s3.png` zeigen weiterhin dieselbe TV-Grafik wie der vorherige Schritt; das ist der größte fehlende Bildbaustein des Bündels.
- Immune und Exposed verwenden dieselben Hauptassets. In `fixture_wahlabend_immune_s2.png` sollte die Abwehr/Faktenprüfung visuell dominieren; in `fixture_wahlabend_exposed_s2.png` sollten Ermittlungsakte, Belegmarkierung oder Netzwerk-Offenlegung dominieren. Nur unterschiedliche Tickertexte reichen für zwei verschiedene Endzustände nicht.
- Die feine Pixeltypografie und die Kantenschärfe entsprechen grundsätzlich dem Anspruch aus `sprite-tool/public/context/game-style-guide.md`. Der moderne, gepflegte und belebte Pixel-Art-Anteil fehlt jedoch fast vollständig; die Screens bestehen überwiegend aus Text, Flächen und Rahmen.

---

## 4. **Raster & Rhythmus**

Die S1–S2-Screens verwenden einen konsistent zentrierten TV-Rahmen, aber innerhalb dieses Rahmens fehlt ein belastbares Inhaltsraster. In `fixture_wahlabend_immune_s1.png` und `fixture_wahlabend_exposed_s1.png` beginnt die Liste weit links, endet aber schon nahe der Mitte; rechts bleiben ungefähr zwei Fünftel der Fläche ungenutzt. Überschrift, Liste, Ecklabel und Ticker teilen keine klar sichtbaren Bezugskanten.

In `fixture_wahlabend_timeout_s2.png` ist der Balken zwar horizontal zentriert, doch Beschriftung, Schwellenlabel und Prozentwert sind nicht als zusammenhängendes Messmodul gruppiert. Vor allem der Wert sitzt am rechten Rand der Gesamtbreite, nicht am relevanten Ende der Füllung. Die vertikale Mitte des TV-Bildes wird mechanisch genutzt, ohne die große obere und untere Leerfläche zu gestalten.

Die Titelkarten `fixture_wahlabend_immune_s0.png` und `fixture_wahlabend_exposed_s0.png` haben einen sauberen Mittelblock, aber keinen Materialrahmen und keine zweite räumliche Ebene. Die Abstände innerhalb des Blocks sind relativ knapp, während außerhalb davon fast der gesamte Bildschirm leer bleibt. Es fehlt ein mittleres Maß zwischen Mikroabständen im Textblock und Makro-Leerraum des Viewports.

Die S3-Screens haben das gegenteilige Problem: Dort ist die vertikale Höhe überbelegt. TV-Rahmen, Nachsatz, zwei Badge-Reihen und CTA werden bis an den unteren Rand gestapelt. `fixture_wahlabend_immune_s3.png` und `fixture_wahlabend_exposed_s3.png` nutzen den oberen Bereich nahezu vollständig für eine Wiederholung, während der neue Inhalt unten um Resthöhe kämpfen muss.

Die Badge-Reihen besitzen keine gemeinsamen Spalten. Unterschiedliche Textlängen bestimmen die Kastenbreiten, wodurch weder linke noch rechte Außenkante stabil ist. Eine feste Zweispalten- oder Dreispaltenstruktur mit identischen Höhen würde die Reaktionen deutlich schneller erfassbar machen.

---

## 5. **Lesbarkeit**

- „SONDERSENDUNG“ ist in `fixture_wahlabend_immune_s1.png`, `fixture_wahlabend_immune_s2.png`, `fixture_wahlabend_exposed_s1.png` und `fixture_wahlabend_exposed_s2.png` zu klein und zu dunkel auf dem dunkelroten Hintergrund. Das Label musste ich jeweils gezielt suchen.
- Die Vorzeile „WAHLTAG · WESTUNION“ und „Klicken zum Fortfahren“ in `fixture_wahlabend_immune_s0.png` und `fixture_wahlabend_exposed_s0.png` liegen farblich zu nah am schwarzen Hintergrund. Besonders der Interaktionshinweis wirkt wie Dekoration statt Bedienzustand.
- Die Schlagzeilen in den S1-Screens sind grundsätzlich lesbar, aber für den Abstand zum Betrachter zu klein. Die breite tote Fläche rechts verschärft den Eindruck, dass der Text unnötig herunter skaliert wurde.
- In `fixture_wahlabend_immune_s2.png` und `fixture_wahlabend_exposed_s2.png` liegen Stempel, Schrift, Durchstreichung und Scanlines übereinander. Besonders die erste und zweite Schlagzeile sind nicht mehr zuverlässig lesbar.
- „SCHWELLE“ in `fixture_wahlabend_timeout_s2.png` und `fixture_wahlabend_timeout_s3.png` ist zu klein und farblich zu schwach. Außerdem ist nicht sofort sichtbar, auf welcher Seite der Marke das Ergebnis liegt, weil der Prozentwert räumlich nicht an der Füllung sitzt.
- Die Milieu-Badges in allen S3-Aufnahmen sind die schwächste Lesbarkeitsebene. Dunkles Ocker auf Schwarz, sehr kleine Symbolzeichen und lange Texte wie „Besorgte Mitte sitzt stumm“ zwingen zum zweiten Hinsehen.
- Immune und Exposed sind als Zustände nicht schnell unterscheidbar. In `fixture_wahlabend_immune_s2.png` und `fixture_wahlabend_exposed_s2.png` muss der komplette Ticker gelesen werden; Hauptgrafik, Stempel und Hintergrund sind identisch.
- Der aktive nächste Schritt ist durch den roten Vollflächenknopf zwar eindeutig, aber stilistisch überlaut. Gesperrte, neue oder fokussierte Zustände sind auf diesen Aufnahmen nicht sichtbar. Die Badge-Symbole wirken wie Zustände, besitzen aber keine Legende oder ausreichend starke visuelle Kodierung.

---

## 6. **Die drei wirksamsten Änderungen**

1. **Immune, Exposed und Timeout in S2/S3 mit jeweils eigener großer Ergebnisüberschrift und eigener Hauptgrafik unterscheiden.** Das ist mit vorhandenen Texten, Aktenetiketten und anderer Stempelplatzierung relativ günstig und beseitigt das größte UX-Problem: Die Endzustände sind derzeit nur über den Ticker auseinanderzuhalten.

2. **Die S3-Komposition neu aufteilen: oberes Bild auf etwa die halbe bis zwei Drittel der Höhe kürzen, Nachsatz und Badges in einen festen unteren Aktenblock setzen, CTA vom Rand lösen.** Das behebt gleichzeitig Überfüllung, falsche Blickführung, schlechte Badge-Lesbarkeit und den beinahe abgeschnittenen Knopf.

3. **Die dunklen Vollflächen auf eine echte Behörden-/Papierhierarchie umstellen: heller Dokumentträger, dunkler TV-Inhalt, Rot nur als Kopfband, Stempel und Alarm.** Dies bringt die sichtbare Oberfläche mit `desinformation-network/src/story-mode/theme.ts` in Einklang und erhöht Kontrast sowie Materialcharakter, ohne sämtliche Inhalte neu bauen zu müssen.

---

## 7. **Blinde Flecken**

- Aus den statischen Aufnahmen ist nicht erkennbar, ob der Balken in `fixture_wahlabend_timeout_s2.png` animiert einläuft, ob die Schwelle blinkt oder ob der Wert erst später erscheint. Dafür wären drei zeitlich versetzte Frames desselben Schritts nötig.
- Nicht sichtbar ist, wie der „GEFÄLSCHT“-Stempel in `fixture_wahlabend_immune_s2.png` und `fixture_wahlabend_exposed_s2.png` eingeblendet wird. Ein harter Schlag, langsames Aufsetzen oder bloßes Erscheinen verändert die wahrgenommene Priorität erheblich.
- Hover-, Fokus-, Tastatur- und gedrückte Zustände des „WEITER“-Knopfs sind in den S3-Screens nicht zu beurteilen. Benötigt werden Aufnahmen mit Maus-Hover, Tastaturfokus und aktivem Press-Zustand.
- Unklar bleibt, ob die gesamte Fläche oder nur „Klicken zum Fortfahren“ anklickbar ist. Dafür wäre ein Screenshot mit Cursor oder sichtbarer Fokusmarkierung hilfreich.
- Die Aufnahmen zeigen nur eine Auflösung. Für die sehr kleinen Labels, Badges und Ticker wären zusätzliche Screenshots in der kleinsten unterstützten Auflösung sowie bei UI-Skalierung über 100 % notwendig.
- Der angekündigte Wohnzimmer-Schnitt ist in `fixture_wahlabend_timeout_s3.png`, `fixture_wahlabend_immune_s3.png` und `fixture_wahlabend_exposed_s3.png` nicht zu erkennen. Es bleibt offen, ob das Asset fehlt, nicht geladen wurde oder erst nach dem erfassten Frame eingeblendet wird; dafür wird ein späterer Frame jedes S3-Schritts benötigt.
- Farbsehschwächen und niedrige Displayhelligkeit lassen sich aus den Screenshots allein nicht belastbar bewerten. Kritisch wären insbesondere Rot auf Dunkelrot, Ocker auf Schwarz und die farblich codierten Badge-Symbole.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
