# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „daynight"

**Modell:** `gpt-5.6-sol` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-22
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-22T17:19:07.670Z · **Dauer:** 144.6 s
**Nutzung:** nicht gemeldet · **Kosten:** unbekannt · **Anbieter-Datensammlung:** ausgeschlossen (deny)

> ⚠️ **Wie das zu lesen ist:** Ein *fremdes* Modell hat einen **kuratierten Ausschnitt**
> des Projekts gesehen — nicht das laufende Spiel und nicht das ganze Repository. Es kann
> daher weder Laufzeitverhalten prüfen noch `file:line`-Belege verifizieren. Befunde sind
> **Hypothesen**, die vor dem Umsetzen am Code/an den Daten gegenzuprüfen sind. Die
> kanonische Wahrheit bleibt [`docs/VISION_LOCK.md`](../VISION_LOCK.md) bzw. die Spieldaten.

## Gestellte Frage

Sieh dir die beigefügten Screenshots des laufenden Spiels an und mache einen UX/UI-Durchgang. Die Optik soll eine Behörden-/Papierwelt sein (Stil-Anker und Farbtoken liegen bei). Sag mir: Wo führt das Bild den Blick falsch, welche Grafiken sitzen an der falschen Stelle oder in der falschen Größe, wo stimmen Abstände und Ausrichtung nicht, und welche drei Änderungen bringen am meisten? Sei so konkret, dass man es direkt umsetzen kann.

## Dieser Durchgang: Bündel „daynight" (7 Screenshots)

Das siehst du, in dieser Reihenfolge:
- sky_0900.png — Tageszeit-Stimmung um 09:00 Uhr (Himmel/Skyline/Tönung)
- sky_1200.png — Tageszeit-Stimmung um 12:00 Uhr (Himmel/Skyline/Tönung)
- sky_1425.png — Tageszeit-Stimmung um 14:25 Uhr (Himmel/Skyline/Tönung)
- sky_1600.png — Tageszeit-Stimmung um 16:00 Uhr (Himmel/Skyline/Tönung)
- sky_1706.png — Tageszeit-Stimmung um 17:06 Uhr (Himmel/Skyline/Tönung)
- sky_1800.png — Tageszeit-Stimmung um 18:00 Uhr (Himmel/Skyline/Tönung)
- building_lobby_night.png — Lobby bei Nacht (18:00, Tönung + Nacht-Skyline)

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
| 🖼 Bild | `sky_0900.png` | `desinformation-network/runs/visual-review/latest/shots/sky_0900.png` | 674 kB |
| 🖼 Bild | `sky_1200.png` | `desinformation-network/runs/visual-review/latest/shots/sky_1200.png` | 704 kB |
| 🖼 Bild | `sky_1425.png` | `desinformation-network/runs/visual-review/latest/shots/sky_1425.png` | 715 kB |
| 🖼 Bild | `sky_1600.png` | `desinformation-network/runs/visual-review/latest/shots/sky_1600.png` | 650 kB |
| 🖼 Bild | `sky_1706.png` | `desinformation-network/runs/visual-review/latest/shots/sky_1706.png` | 587 kB |
| 🖼 Bild | `sky_1800.png` | `desinformation-network/runs/visual-review/latest/shots/sky_1800.png` | 526 kB |
| 🖼 Bild | `building_lobby_night.png` | `desinformation-network/runs/visual-review/latest/shots/building_lobby_night.png` | 90 kB |

---

## Antwort des Modells

## 1. **Erster Eindruck**

### `sky_0900.png`
Der Blick landet zuerst auf dem gelben Schild „Finanzen / Tresor · Igor“ im Keller, unmittelbar danach auf der hellen Papierleiste rechts. Wenn Igor das aktuelle Interaktionsziel ist, ist die erste Station richtig; die rechte Leiste konkurriert jedoch unnötig stark damit. Die Uhr sollte danach die Tageszeit vermitteln, wirkt gegenüber der großen hellen Seitenfläche aber wie ein darin verlorenes Einzelelement. Der tiefblaue Himmel und die sichtbaren Lichtpunkte lesen sich eher wie früher Morgen oder Nacht als wie 09:00 Uhr. Zusätzlich erzeugt der oben angeschnittene Gebäudeteil den Eindruck, die Ansicht sei versehentlich zu hoch positioniert.

### `sky_1200.png`
Auch hier dominiert zunächst die gelbe Igor-Markierung, gefolgt von der hellen rechten Seitenleiste; die Tageszeit selbst wird erst an dritter Stelle wahrgenommen. Der hellere Himmel unterscheidet Mittag grundsätzlich von `sky_0900.png`, bleibt aber ungewöhnlich gedämpft und zeigt weiterhin helle Punkte, die wie Sterne oder ein über die gesamte Szene gelegter Partikeleffekt wirken. Die Skyline ist heller, während die Innenräume nahezu gleich beleuchtet bleiben, sodass die räumliche Lichtlogik nicht ganz zusammenkommt. Die zentrale Gebäudegrafik besitzt gute horizontale Führung, wird oben jedoch erneut sichtbar abgeschnitten. Der untere Statusstreifen ist so klein und randnah, dass er eher als technische Debug-Zeile denn als Teil der Papierwelt erscheint.

### `sky_1425.png`
Der orange Horizont zieht den Blick nun zuerst an die beiden Außenränder und damit weg vom Gebäude und vom aktiven Ziel. Für eine Tageszeitvisualisierung ist der Wechsel deutlich, wirkt um 14:24 Uhr aber bereits wie später Sonnenuntergang. Die warmen Außenflächen stehen zudem stark gegen die fast unverändert kühl beleuchteten Innenräume. Erst danach fällt die gelbe Igor-Markierung als eigentliche Spielpriorität auf. Die Uhr zeigt 14:24, während Dateiname und Beschreibung 14:25 nennen; das ist klein, bei einer Vergleichsreihe aber auffällig.

### `sky_1600.png`
In `sky_1600.png` teilen sich der orange Horizont, die gelbe Zielmarkierung und die helle rechte Papierleiste die Aufmerksamkeit. Der Abendverlauf ist gegenüber `sky_1425.png` nachvollziehbar dunkler, aber beide Bilder liegen visuell näher beieinander, als die deutliche Differenz zwischen Mittag und frühem Abend erwarten lässt. Die globale Abdunklung betrifft auch Lobby, Flure und Beschriftungen, obwohl deren künstliche Beleuchtung sichtbar eingeschaltet ist. Der aktive Kellerbereich bleibt durch Gelb erkennbar, während die Figuren daneben zunehmend im Grau verschwinden. Das Gebäude wirkt weiterhin oben gekappt und unten durch den Statusstreifen eingequetscht.

### `sky_1706.png`
Der Blick fällt zuerst auf die helle Seitenleiste und die Uhr; das Gebäude ist nun so dunkel, dass die gelbe Igor-Markierung erst danach greift. Der Übergang von `sky_1600.png` ist abrupt: Das warme Orange verschwindet fast vollständig und wird durch eine kühl-violette Nachtpalette ersetzt. Die Außenstadt besitzt mehr Leuchtdetails, die Innenräume verlieren gleichzeitig an Trennung und Figurenkontrast. Besonders die Etagenbeschriftungen und die Personen im Erdgeschoss müssen ein zweites Mal angesehen werden. Als Nachtszene funktioniert die Farbtemperatur, als Schritt von 16:00 zu 17:06 fehlt jedoch eine erkennbare Zwischenstufe.

### `sky_1800.png`
`sky_1800.png` unterscheidet sich auf den ersten Blick nur wenig von `sky_1706.png`; die Uhr zeigt zudem 17:58 statt 18:00. Die rechte Papierleiste, das Uhrfeld und das gelbe Ziel sind die hellsten Elemente und bestimmen stärker als die Architektur die Blickfolge. Der Himmel ist eindeutig Nacht, doch die Innenräume werden ebenfalls nahezu flächig blau abgedunkelt und verlieren dadurch ihre lokale Beleuchtung. Die hellen Partikel liegen auch vor den Innenräumen, wodurch unklar bleibt, ob es Sterne, Schnee oder ein globaler Filter sein sollen. Für den Endpunkt der Reihe fehlt ein klarer visueller Nachtakzent, etwa eine stärkere Trennung zwischen dunkler Außenwelt und weiterhin betriebenem Behördengebäude.

### `building_lobby_night.png`
`building_lobby_night.png` zeigt nicht die angekündigte Lobby bei Nacht, sondern einen „Lagebericht – Tag 1“ über einer stark abgedunkelten Hintergrundszene. Der Blick landet zuerst auf den drei großen hellen Papierkarten, nicht auf dem roten Titel darüber. Innerhalb der Karten dominiert die dicht gefüllte mittlere Spalte, während links und rechts große ungenutzte Papierflächen entstehen. Danach fällt der breite Kennzahlenblock auf, dessen Skala optisch stärker ist als die drei kleinen Kennzahlen darüber. Der nächste Abschnitt ist unten angeschnitten; damit wirkt der Screen wie ein falsch positionierter oder nicht vollständig gescrollter Aufnahmezustand.

---

## 2. **Konkrete Eingriffe je Screen**

### `sky_0900.png`

- *09:00-Himmel → den oberen Himmelsbereich um etwa ein Viertel aufhellen und den Horizont neutraler blau statt nachtblau anlegen → 09:00 muss sich ohne Lesen der Uhr als Vormittag erkennen lassen.*
- *Helle Punkte über Gebäude und Himmel → auf den Außenhimmel maskieren oder entfernen, falls es Sterne sind → derzeit schneiden sie durch Innenräume und zerstören die Tiefenstaffelung.*
- *Oberer Gebäuderand → die gesamte Gebäudebühne um mindestens die Höhe des angeschnittenen obersten Schildes nach unten setzen → „Zielgruppen-Analyse“ und „Newsroom“ dürfen nicht am Fensterrand abgeschnitten werden.*
- *Rechte Papierleiste → Breite um etwa ein Drittel reduzieren oder als dunkleren Kraftpapier-Träger ausführen; Uhr und Tasten an derselben Innenkante ausrichten → die leere helle Fläche konkurriert mit dem aktiven Ziel.*
- *Gelbes Igor-Schild → Gelb auf schmalen Rand oder Stempel reduzieren, Papierfläche neutral halten → die Markierung bleibt klar, ohne den gesamten Bildaufbau zu überstrahlen.*

### `sky_1200.png`

- *Mittagshimmel → oberen Bereich heller und weniger violett gestalten, mit der größten Helligkeit oberhalb des Gebäudes statt nur am Horizont → Mittag braucht den klarsten und flächigsten Tageslichtzustand der Reihe.*
- *Skyline → Kontrast zwischen Vorder- und Hintergrundsilhouette leicht senken, gleichzeitig den Gebäudekern unverändert scharf halten → die Außenflügel sollen rahmen, nicht als zweite Spielebene auftreten.*
- *Partikeleffekt → tagsüber stark reduzieren und vollständig hinter der Gebäudefassade führen → die weißen Punkte lesen sich gegen den Mittagshimmel wie verbliebene Sterne.*
- *Uhr, Menü und HUD-Knopf → auf eine gemeinsame Oberkante, identische Höhe und einen gleichmäßigen Zwischenraum setzen → die drei Elemente wirken derzeit wie unabhängig platzierte Widgets.*
- *Unterer Statusstreifen → Textgröße relativ zur Etagenbeschriftung um etwa ein Viertel erhöhen und oben mehr Innenabstand geben → die laufende Meldung ist auf dieser Aufnahme nur mit konzentriertem Hinsehen lesbar.*

### `sky_1425.png`

- *Orange Horizontzone → auf das untere Viertel des sichtbaren Himmels begrenzen und deutlich entsättigen → 14:25 darf wärmer werden, sollte aber noch nicht wie Sonnenuntergang aussehen.*
- *Seitliche Skyline → warme Beleuchtung vor allem auf die entfernte Silhouette legen, die vorderen Häuser neutral-blau lassen → das erzeugt Tiefe statt zweier orange leuchtender Seitenblöcke.*
- *Innenraumtönung → warmes Außenlicht nur schwach an Glasflächen und Außenkanten spiegeln, nicht als flächigen Filter über alle Etagen legen → Innen- und Außenlicht erhalten getrennte Funktionen.*
- *Uhrzeit → Aufnahmezeit und Dateizustand auf denselben Wert bringen, also entweder 14:25 anzeigen oder den Screen entsprechend benennen → die Vergleichsreihe sollte sekundengenau nachvollziehbar sein.*
- *Aktivmarkierung im Keller → Schildhöhe leicht reduzieren und bündig über dem gelben Türrahmen zentrieren → Ziel und Interaktionsfläche werden als eine Gruppe gelesen statt als zwei gelbe Elemente.*

### `sky_1600.png`

- *16:00-Himmel → den stärksten Orangeanteil aus `sky_1425.png` hierher verschieben und im oberen Himmel mehr kühles Blau stehen lassen → der Sonnenuntergang sitzt zeitlich derzeit zu früh.*
- *Lobby und Flure → globale Abdunklung um etwa ein Fünftel zurücknehmen, Deckenleuchten und ihre Lichtkegel dagegen beibehalten → das Gebäude soll betrieben und nicht stillgelegt wirken.*
- *Figuren im Keller → Kontur- oder Bodenlicht relativ zum Hintergrund leicht anheben → die Figur links neben Igor verschmilzt fast mit Wand und Türrahmen.*
- *Etagenbeschriftungen → Texthelligkeit unabhängig vom Tagesfilter halten → Navigationsinformationen dürfen bei Abendlicht nicht mitabdunkeln.*
- *Rechte Papierleiste → leere Fläche ober- und unterhalb der Tasten entfernen und den Tastenblock als kompakte Gruppe unter Uhr/HUD setzen → dadurch bleibt mehr Bildbreite für die Welt und weniger helle tote Fläche.*

### `sky_1706.png`

- *Übergangshimmel → zwischen orangefarbener Dämmerung und violetter Nacht einen schmalen Rest Warmlicht am Horizont erhalten → der Sprung von `sky_1600.png` wirkt sonst wie ein harter Szenenwechsel.*
- *Innenraumbeleuchtung → lokale Leuchten gegenüber `sky_1600.png` nicht weiter abdunkeln; nur unbeleuchtete Wand- und Bodenflächen kühler färben → künstlich beleuchtete Behördenräume sollten nachts relativ heller erscheinen.*
- *Etagen- und Raumschilder → Kontrast um eine Stufe erhöhen und nicht vom Nachtfilter erfassen lassen → mehrere Schilder müssen derzeit zweimal gelesen werden.*
- *Skyline-Fenster → Leuchtfenster auf wenige klar gruppierte Muster begrenzen und die violetten Fassaden entsättigen → die Stadt wirkt momentan dekorativer und pastelliger als der gepflegt-brutalistische Gebäudekern.*
- *Uhrfeld und Seitenleiste → Uhr an die linke Bezugskante des darunterliegenden Bedienblocks setzen oder beide in einen gemeinsamen Papierkopf integrieren → die hellen UI-Inseln ziehen den Blick auseinander.*

### `sky_1800.png`

- *Uhrzeit → für diesen Vergleichszustand exakt 18:00 anzeigen → der sichtbare Wert 17:58 schwächt die Aussage des benannten Screens.*
- *Nachtzustand → Außenhimmel gegenüber `sky_1706.png` etwas dunkler, Innenbeleuchtung dagegen etwas heller und wärmer ausführen → 18:00 erhält damit einen eigenen, sofort erkennbaren Zustand.*
- *Partikel/Sterne → ausschließlich im unverbauten Himmel rendern und hinter Skyline sowie Gebäude maskieren → Punkte vor Wänden, Böden und Figuren wirken wie ein fehlerhafter Vollbild-Layer.*
- *Aktiver Kellerbereich → Figur und Türrahmen lokal aufhellen, das breite gelbe Kopfschild auf Papierbraun mit kleinem Warnakzent umstellen → der Zielzustand bleibt sichtbar, ohne als einzige Farbquelle zu funktionieren.*
- *Unterer rechter Button → vollständig innerhalb der nutzbaren Breite halten und nicht unter der Papierleiste abschneiden → „PUBLIKUM“ ist am rechten Rand sichtbar gekappt.*

### `building_lobby_night.png`

- *Aufnahmezustand → entweder die tatsächliche Lobby bei Nacht aufnehmen oder Datei und Beschreibung als Lagebericht kennzeichnen → der vorliegende Screen erlaubt keine Beurteilung der angekündigten Nacht-Lobby.*
- *Titelblock → näher an die Karten rücken und auf etwa die Breite der mittleren Karte vergrößern; Unterzeile klar darunter setzen → „Lagebericht – Tag 1“ muss vor den drei Papierflächen gelesen werden.*
- *Drei Hauptkarten → Höhe an den tatsächlichen Inhalt anpassen oder leere Bereiche mit klaren Zusammenfassungswerten nutzen → linke und rechte Karte enthalten derzeit überwiegend tote Fläche.*
- *Mittlere Karte „Das Land“ → Zeilenabstand leicht erhöhen, Statuswerte an einer festen rechten Spalte ausrichten und Balken darunter über die volle Textbreite führen → die acht Zeilen wirken gedrängt und ihre Ausrichtungen schwanken.*
- *Kennzahlenblock → Risiko, Budget und Aufmerksamkeit jeweils als kompakte Dreiergruppen mit gleicher vertikaler Achse setzen; die Deutungshoheitsskala deutlicher davon absetzen → Kennzahlen und Skala konkurrieren momentan innerhalb einer einzigen großen Fläche.*
- *Unterer Abschnitt → Inhalt vollständig in den Viewport holen oder einen eindeutig sichtbaren Scrollzustand zeigen → „Über Nacht“ ist unten angeschnitten und lässt den Abschluss unvollständig wirken.*

---

## 3. **Grafiken/Assets**

Die Gebäudegrafik in `sky_0900.png` bis `sky_1800.png` trägt die Szene: klare horizontale Etagen, harte geometrische Kanten, viele kleine Funktionsdetails und kontrollierte Cyan-Lichter entsprechen dem modernen Behörden-Brutalismus aus `sprite-tool/public/context/game-style-guide.md`. Problematisch ist weniger das Gebäude selbst als seine Präsentation: Der obere Abschluss ist in allen sechs Aufnahmen abgeschnitten, wodurch ein eigentlich vollständiges Asset wie ein zu groß skaliertes Hintergrundbild wirkt.

Die Skyline besitzt eine gröbere Pixelstruktur und deutlich weichere, teilweise pastell-violette Flächen als der fein gezeichnete Gebäudekern. Besonders in `sky_1425.png`, `sky_1600.png` und `sky_1706.png` treffen orange beziehungsweise violette Ditherflächen auf sehr präzise Stahl- und Betonpixel. Entweder sollte die Skyline mit feinerem Pixelraster neu ausgegeben oder bewusst stärker zurückgenommen werden; aktuell wirkt sie wie ein Asset aus einer anderen Auflösungsstufe.

Die hellen Punkte sind in allen sechs Sky-Screens räumlich falsch behandelt. Sie erscheinen nicht nur im Himmel, sondern auch vor Wänden, Fluren und Figuren. Falls es Sterne sind, fehlt eine Außenraum-Maske; falls es Schnee ist, fehlen Tiefenstaffelung, Fensterscheiben und eine erkennbare Wetterlogik.

Die rechte Seitenleiste passt farblich zu den Papierwerten aus `desinformation-network/src/story-mode/theme.ts`, aber nicht materiell: Sie ist eine glatte, nahezu leere Cremefläche ohne Aktenkante, Schattenfuge oder Kraftpapier-Träger. Dadurch liest sie sich eher als ungestylter Webrand denn als Behördenakte. Ein schmalerer dunkler Träger in `background` oder `darkConcrete` mit einzelnen hellen Papierlaschen wäre stilistisch schlüssiger.

In `building_lobby_night.png` tragen die drei Papierkarten und der breite Kennzahlenbogen die Behördenakten-Idee am deutlichsten. Fremd wirkt dagegen der fast schwarze Vollbildhintergrund: Laut Stilanker sollen Räume nicht dunkel und leer erscheinen, hier verschwindet die Lobby nahezu vollständig. Was an dieser Stelle am meisten fehlt, ist allerdings kein neues Asset, sondern der angekündigte sichtbare Nacht-Lobbyzustand hinter oder statt des Berichts.

---

## 4. **Raster & Rhythmus**

In `sky_0900.png` bis `sky_1800.png` bildet das Gebäude ein stabiles horizontales Raster, aber die Bildschirmfassung verletzt es an drei Seiten: oben durch den Anschnitt, unten durch den sehr knappen Statusstreifen und rechts durch die separate Papierleiste. Das Gebäude ist innerhalb der Weltfläche ungefähr zentriert, wirkt im gesamten Screenshot durch die helle rechte Leiste dennoch nach links gedrückt.

Uhr, Menüknopf und HUD-Schalter bilden oben rechts keine saubere Gruppe. Sie besitzen unterschiedliche Breiten, stehen mit ungleichen Zwischenräumen nebeneinander und haben keine erkennbare gemeinsame Außenkante mit dem vertikalen Tastenblock. Eine klare Kopfgruppe mit gemeinsamer Höhe und darunter exakt ausgerichtetem Tastenstapel würde die Ecke beruhigen.

Die schwarzen Etagen- und Raumlabels folgen zwei konkurrierenden Systemen. Etagenlabels sitzen nahe der linken Gebäudekante, Raumlabels hängen dagegen frei an den Geschossgrenzen; das ist grundsätzlich sinnvoll, ihre vertikale Distanz zu Türen und Geschosslinien schwankt jedoch. Etagenlabels sollten immer denselben linken Innenabstand haben, Raumlabels dagegen exakt über der zugehörigen Tür oder Raumachse zentriert werden.

Der Lobbyraum erzeugt in allen Sky-Screens eine große leere Fläche in der Bildmitte. Als architektonische Weite ist das plausibel, aber der einzelne Pförtner steht sehr weit links und lässt die gesamte rechte Hälfte inhaltslos erscheinen. Die starke Perspektive des Bodens führt den Blick sogar in diese leere Zone statt zu einer Figur oder Interaktionsstelle.

In `building_lobby_night.png` ist das Dreispaltenraster formal sauber: drei gleich breite Karten mit gleichmäßigen Zwischenräumen. Inhaltlich kippt es jedoch, weil nur die mittlere Karte dicht gefüllt ist. Der breite Kennzahlenblock darunter übernimmt dieselbe Gesamtbreite, besitzt aber zu viel Höhe für die wenigen Werte; der angeschnittene nächste Papierbogen zerstört anschließend den vertikalen Abschluss.

---

## 5. **Lesbarkeit**

In `sky_0900.png` und `sky_1200.png` sind die Etagenlabels noch lesbar, aber bereits klein im Verhältnis zur Gesamtansicht. In `sky_1706.png` und `sky_1800.png` werden ihre grauen Buchstaben zusammen mit dem Hintergrund abgedunkelt; insbesondere „Etage 3 – Analyse & Medien“ und „Erdgeschoss – Empfang“ erforderten einen zweiten Blick. Navigationsschrift sollte nicht Teil des Tageszeitfilters sein.

Der obere Inhalt ist in allen sechs Sky-Screens konkret unlesbar, weil Teile von „Zielgruppen-Analyse“ und „Newsroom“ außerhalb des sichtbaren Bereichs liegen. Das ist kein Schriftproblem, sondern ein Safe-Area- und Zuschnittsproblem.

Der untere Statussatz ist in allen sechs Bildern sehr klein, extrem nah an der Unterkante und über eine große Breite gesetzt. In `sky_1800.png` kommt zusätzlich der rechts abgeschnittene „PUBLIKUM“-Button hinzu. Textgröße und Innenabstand sollten mindestens an die kleineren Etagenlabels angenähert werden.

Der aktive Zustand ist durch den gelben Rahmen und das gelbe Schild bei Igor eindeutig. Andere Zustände wie gesperrt oder neu sind in diesen Screens nicht erkennbar; sichtbar ist nur eine Hervorhebungsart. Die senkrechten Tastenfelder rechts sind als Tasten lesbar, ihre einzelnen Buchstaben werden aber nicht durch sichtbare Zustände wie aktiv, Hover oder deaktiviert unterschieden.

In `building_lobby_night.png` musste vor allem die mittlere Karte zweimal angesehen werden: Milieunamen, Statuswörter und schmale Balken liegen eng übereinander. Die kleinen Überschriften „Risiko“, „Budget“ und „Aufmerksamkeit“ sind gegenüber ihren Zahlen zu schwach. Der kursive Text in „Die Gegenseite“ ist zwar größer, wirkt aber heller und dünner als die übrige Tintenschrift und damit eher dekorativ als berichtsrelevant.

---

## 6. **Die drei wirksamsten Änderungen**

1. **Viewport und Safe Areas korrigieren:** Oberen Gebäudeanschnitt, rechten „PUBLIKUM“-Anschnitt, die überbreite Seitenleiste und den unten gekappten Bericht beheben — hoher sichtbarer Gewinn bei überwiegend layoutseitigem Aufwand.
2. **Tagesfilter räumlich trennen:** Himmel und Außenstadt dürfen stark wechseln, Innenbeleuchtung, Navigationslabels und UI müssen weitgehend unabhängig davon bleiben — dadurch werden Nachtstimmung und Spielbarkeit gleichzeitig besser.
3. **Zeitpalette und Skyline als konsistente Sequenz überarbeiten:** 09:00 klar heller, 14:25 weniger sonnenuntergangsartig, 16:00 als eigentliche Dämmerung und 17:06/18:00 sauber abgestuft; dabei Partikel maskieren und die Pixelauflösung der Skyline ans Gebäude angleichen — erst dann erzählt die Reihe tatsächlich einen glaubwürdigen Tagesverlauf.

---

## 7. **Blinde Flecken**

- In `sky_0900.png` bis `sky_1800.png` ist nicht erkennbar, ob die hellen Punkte Sterne, Schnee oder animierte Staubpartikel sind; dafür wären kurze Bewegtbildsequenzen nötig.
- Die Übergänge zwischen den Uhrzeiten fehlen. Es lässt sich daher nicht beurteilen, ob Farben weich interpolieren oder bei bestimmten Uhrzeiten sichtbar springen.
- Hover-, Fokus-, aktive und gesperrte Zustände der rechten Tasten sowie von Uhr, Menü und HUD sind nicht gezeigt.
- Die tatsächliche Lesbarkeit bei kleineren Auflösungen oder anderer Skalierung ist nicht beurteilbar; bereits bei der gezeigten Größe liegen mehrere Texte an der Untergrenze.
- `building_lobby_night.png` zeigt keine frei sichtbare Nacht-Lobby. Dafür wird ein Screenshot nach Schließen des Lageberichts benötigt.
- Beim Lagebericht ist nicht erkennbar, ob der untere Anschnitt durch Scrollposition, falsche Viewporthöhe oder die Aufnahme selbst entsteht; nötig wären ein Screenshot des vollständigen oberen und unteren Endes sowie ein sichtbarer Scrollzustand.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
