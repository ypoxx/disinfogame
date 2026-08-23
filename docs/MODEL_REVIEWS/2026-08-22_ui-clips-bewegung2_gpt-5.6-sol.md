# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung

**Modell:** `gpt-5.6-sol` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-22
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-22T17:47:57.453Z · **Dauer:** 192.4 s
**Nutzung:** nicht gemeldet · **Kosten:** unbekannt · **Anbieter-Datensammlung:** ausgeschlossen (deny)

> ⚠️ **Wie das zu lesen ist:** Ein *fremdes* Modell hat einen **kuratierten Ausschnitt**
> des Projekts gesehen — nicht das laufende Spiel und nicht das ganze Repository. Es kann
> daher weder Laufzeitverhalten prüfen noch `file:line`-Belege verifizieren. Befunde sind
> **Hypothesen**, die vor dem Umsetzen am Code/an den Daten gegenzuprüfen sind. Die
> kanonische Wahrheit bleibt [`docs/VISION_LOCK.md`](../VISION_LOCK.md) bzw. die Spieldaten.

## Gestellte Frage

Das sind Einzelbilder aus Animations-Clips des Spiels — je Clip vier Zeitpunkte (Suffix __f1..__f4), gezogen vom Ende des Clips. Beurteile daran: Wo stehen bewegte Figuren und Objekte relativ zum Boden und zueinander — schweben oder versinken sie? Stimmen Maßstab und Perspektive über die Zeitpunkte hinweg? Verändert sich zwischen den Bildern etwas, das nicht stimmig ist (springende Position, wechselnde Größe, verschwindende Elemente)? WICHTIG: Du siehst Standbilder, keine Bewegung — benenne ausdrücklich, was du daraus NICHT beurteilen kannst.

## Gezeigter Ausschnitt

15.047 Zeichen ≈ 4.180 Tokens (geschätzt) aus 3 Quellen · 1 gekürzt

| Quelle | Modus | Zeichen | Status |
|---|---|---:|---|
| `sprite-tool/public/context/game-style-guide.md` | voll | 5.496 | vollständig |
| `desinformation-network/src/story-mode/theme.ts` | voll | 3.375 | vollständig |
| `desinformation-network/runs/visual-review/latest/manifest.json` | projektion | 6.176 | gekürzt |

### Gezeigtes Anschauungsmaterial (8 Screenshot(s))

| Art | Im Text genannt als | Datei | Größe |
|---|---|---|---:|
| 🖼 Bild | `clip_elevator__f1.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_elevator__f1.png` | 890 kB |
| 🖼 Bild | `clip_elevator__f2.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_elevator__f2.png` | 1120 kB |
| 🖼 Bild | `clip_elevator__f3.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_elevator__f3.png` | 770 kB |
| 🖼 Bild | `clip_elevator__f4.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_elevator__f4.png` | 429 kB |
| 🖼 Bild | `clip_walkhome_dayreport__f1.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_walkhome_dayreport__f1.png` | 739 kB |
| 🖼 Bild | `clip_walkhome_dayreport__f2.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_walkhome_dayreport__f2.png` | 716 kB |
| 🖼 Bild | `clip_walkhome_dayreport__f3.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_walkhome_dayreport__f3.png` | 216 kB |
| 🖼 Bild | `clip_walkhome_dayreport__f4.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_walkhome_dayreport__f4.png` | 230 kB |

---

## Antwort des Modells

## 1. **Erster Eindruck**

**clip_elevator__f1.png**  
Das Auge bleibt zuerst am gelben Türrahmen und dem Schild „Feld-Operationen · Katja“ hängen, obwohl die laufende Figur auf Etage 1 wahrscheinlich der eigentliche Handlungsträger ist. Deren Füße treffen die horizontale Bodenkante grundsätzlich, wirken aber wegen fehlender Kontaktschattierung nur aufgelegt. Auch die Figuren auf Etage 3 und im Erdgeschoss stehen ungefähr korrekt auf ihren jeweiligen Bodenlinien. Die Figur auf Etage 1 erscheint gegenüber der Figur auf Etage 3 deutlich größer, obwohl der Gebäudeschnitt keine perspektivische Tiefenstaffelung zwischen den Etagen zeigt. Die Fahrstuhlkabine rechts befindet sich auf Höhe von Etage 1 und ist in diesem Einzelbild sauber in den Schacht eingebunden. Ob Beine und Fahrstuhl während der Bewegung rutschen, schweben oder gleichmäßig beschleunigen, lässt sich aus diesem Standbild nicht beurteilen.

**clip_elevator__f2.png**  
Zuerst zieht das gelbe Schild „Medien-Zentrum · Marina“ den Blick an, erst danach die laufende Figur auf Etage 4. Der Gebäudekörper bleibt horizontal weitgehend stabil, während der Ausschnitt gegenüber `clip_elevator__f1.png` um etwa eine Etage nach oben verschoben ist. Die laufende Figur wirkt nun kleiner als dieselbe mutmaßliche Spielfigur auf Etage 1 in `clip_elevator__f1.png`; für den orthografischen Gebäudeschnitt ist dieser Maßstabswechsel nicht plausibel. Ihre Füße sitzen auf der oberen Bodenlinie, ohne klar zu versinken, aber erneut fehlt ein Kontaktzeichen zum Boden. Die Fahrstuhlkabine steht zwischen Etage 3 und Etage 2, was als Momentaufnahme einer Fahrt schlüssig sein kann. Ob der Wechsel von Etage 1 zu Etage 4 und die Kabinenfahrt dazwischen räumlich zusammenpassen, ist ohne die ausgelassenen Zwischenbilder nicht feststellbar.

**clip_elevator__f3.png**  
Der große Marina-Bust rechts zieht den Blick vor dem gerade entstehenden Dialogtext an; für eine Dialogszene sollte der Blick zuerst auf Sprechername und Textbeginn gehen. Marina ist hier keine Figur im Raummaßstab, sondern eine Vordergrundillustration, weshalb ihre Bodenkontaktlage nicht beurteilbar ist. Schreibtisch, Pflanzen, Sofa und Tisch besitzen dagegen nachvollziehbare Kontaktflächen und Schatten, ohne sichtbar zu schweben. Gegenüber `clip_elevator__f2.png` erfolgt ein harter Wechsel vom Gebäudeschnitt in eine deutlich näher dargestellte Raumansicht, außerdem springt die Uhr von 12:07 auf 12:37. Das kann ein beabsichtigter Szenenschnitt sein, aus den Standbildern ist aber weder dessen Timing noch die räumliche Überleitung über Tür oder Fahrstuhl zu beurteilen.

**clip_elevator__f4.png**  
Das Auge landet sofort auf der großen Auswahlliste, was für diesen Entscheidungszustand richtig ist. Das Dialogpanel springt gegenüber `clip_elevator__f3.png` von einem unteren Drittel auf fast die gesamte Bildhöhe und verdeckt nun Marina sowie den größten Teil des Raums. Die große Marina-Figur verschwindet vollständig; nur das kleine Sprecherporträt im Kopfband bleibt erhalten. Hintergrund, Uhrzeit und horizontale Panelkanten wirken ansonsten stabil, sodass kein unbeabsichtigter Skalensprung des Raums erkennbar ist. Figuren- oder Objektbewegung ist in diesem Zustand nicht sichtbar und daher hinsichtlich Schweben, Versinken oder Bewegungsfluss nicht beurteilbar.

**clip_walkhome_dayreport__f1.png**  
Der rote Hinweis „FEIERABEND“ ist der erste klare Blickanker; die laufende Figur auf Etage 1 geht in der dunklen Gebäudedarstellung zunächst unter. Ihre Füße treffen die Bodenlinie des Korridors plausibel und versinken nicht sichtbar. Im Vergleich mit den kleineren Figuren auf Etage 3 und im Erdgeschoss wirkt sie allerdings erneut zu groß für den einheitlichen Querschnittsmaßstab. Die Fahrstuhlkabine rechts steht auf Höhe von Etage 1, was als Ausgangspunkt für den Heimweg verständlich ist. Ob die gezeigte Gehpose im vorherigen oder folgenden Animationsframe sauber anschließt, kann aus diesem Einzelbild nicht beurteilt werden.

**clip_walkhome_dayreport__f2.png**  
Hier wird die Figur vor dem Fahrstuhl im Erdgeschoss zum stärksten räumlichen Ereignis, obwohl „FEIERABEND“ weiterhin der kontrastreichste UI-Akzent bleibt. Ihre Fußlinie stimmt ungefähr mit der Unterkante des Fahrstuhleingangs überein, sie schwebt also nicht offensichtlich. Gegenüber dem Pförtner auf derselben Etage ist sie jedoch deutlich größer, obwohl beide nahezu auf derselben Tiefenebene stehen. Zwischen `clip_walkhome_dayreport__f1.png` und diesem Bild wurde der gesamte Gebäudeausschnitt leicht nach oben verschoben; zugleich wanderte die Kabine von Etage 1 ins Erdgeschoss. Diese Abfolge kann eine korrekte Fahrstuhlfahrt zeigen, aber aus zwei Standbildern lässt sich nicht erkennen, ob Figur und Kabine dazwischen springen, gleiten oder synchron ankommen.

**clip_walkhome_dayreport__f3.png**  
Der rote Titel „LAGEBERICHT – TAG 1“ zieht den Blick zuerst an, danach die drei hellen Berichtsspalten. Es sind keine Figuren oder bewegten Weltobjekte mehr sichtbar, deshalb gibt es hier keinen Bodenkontakt zu beurteilen. Der Wechsel aus `clip_walkhome_dayreport__f2.png` ist ein vollständiger Zustands- oder Szenenschnitt, nicht bloß eine Kamerafahrt. Innerhalb des Berichts ist die mittlere Spalte deutlich dichter als die beiden fast leeren Außenspalten, wodurch der Blick unnötig in der Mitte hängen bleibt. Am unteren Bildrand beginnt bereits ein weiterer Abschnitt, wird aber durch den schwarzen Rand abgeschnitten.

**clip_walkhome_dayreport__f4.png**  
`clip_walkhome_dayreport__f4.png` wirkt visuell identisch zu `clip_walkhome_dayreport__f3.png`; weder Positionen noch Größen oder Inhalte verändern sich erkennbar. Damit ist kein unbeabsichtigtes Verschwinden oder Springen zwischen diesen beiden Standbildern sichtbar. Der Titel bleibt der richtige erste Blickpunkt, während die wichtigsten Kennzahlen darunter relativ klein ausfallen. Der angeschnittene Folgeabschnitt am unteren Rand bleibt bestehen und wirkt eher wie ein Layout- oder Viewportproblem als wie eine beabsichtigte Animation. Ob zwischen beiden Frames ein subtiler Fade, Cursorwechsel oder Haltezustand liegt, ist anhand der Standbilder nicht erkennbar.

## 2. **Konkrete Eingriffe je Screen**

- `clip_elevator__f1.png`: Spielfigur auf Etage 1 → Spritehöhe an der Türhöhe und an der Figur auf Etage 3 normieren, ohne sie horizontal zu verschieben → der Querschnitt verwendet eine einheitliche orthografische Ebene, daher wirkt die größere Figur wie ein Skalierungsfehler.
- `clip_elevator__f1.png`: Füße der laufenden Figur → Fuß-Pivot exakt auf die obere Kante des dunklen Bodenstreifens setzen und einen schmalen, höchstens fußbreiten Kontaktschatten ergänzen → die Figur wirkt dann nicht nur aufgeklebt.
- `clip_elevator__f1.png`: Gelbe Katja-Markierung auf Etage 2 → Helligkeit gegenüber der laufenden Spielfigur reduzieren oder erst bei Nähe aktivieren → momentan übernimmt eine unbeteiligte Tür die Blickführung.
- `clip_elevator__f1.png`: Fahrstuhlkabine rechts → Unterkante dauerhaft an dasselbe vertikale Etagenraster wie die Flurböden binden → so wird in Folgebildern sofort erkennbar, ob sie auf einer Etage steht oder sich zwischen Etagen bewegt.

- `clip_elevator__f2.png`: Spielfigur auf Etage 4 → auf dasselbe Verhältnis „Figurenhöhe zu Türhöhe“ wie in `clip_elevator__f1.png` bringen → der sichtbare Größenwechsel erzeugt eine falsche Tiefenwirkung.
- `clip_elevator__f2.png`: Fußkontakt der Spielfigur → Pivot auf die obere Kante des Bodenprofils legen und nicht auf dessen Mitte → so lässt sich ein Einsinken in den Gebäudesteg vermeiden.
- `clip_elevator__f2.png`: Fahrstuhlkabine zwischen Etage 3 und 2 → eine sichtbare Bewegungsreferenz im Schacht ergänzen, etwa regelmäßig wiederkehrende Etagenmarken hinter der Kabine → die Zwischenposition liest sich dann als Fahrt statt als falsch eingesetzte Tür.
- `clip_elevator__f2.png`: Vertikaler Kameraausschnitt → beim Hochschwenken die Gebäudekanten links und rechts exakt fixiert halten und nur entlang des Etagenrasters verschieben → dadurch bleibt der Maßstab gegenüber `clip_elevator__f1.png` eindeutig stabil.

- `clip_elevator__f3.png`: Großer Marina-Bust rechts → näher an die rechte Panelkante rücken und seine Unterkante sichtbar hinter dem Dialogpanel verankern → derzeit wirkt er wie eine frei über den Raum gelegte Ebene.
- `clip_elevator__f3.png`: Dialogkopf mit Name und Porträt → stärker als gemeinsame linke Einheit ausrichten; Porträtoberkante, Name und Textbeginn auf eine klare Achse setzen → der Blick springt momentan zwischen großem Bust und kleinem Sprecherkopf.
- `clip_elevator__f3.png`: Dialogtext → Textblock etwas weiter von der unteren Panelkante abrücken und die nutzbare Breite bis deutlich vor den Marina-Bust begrenzen → der gerade getippte Satz erhält eine ruhigere Lesefläche.
- `clip_elevator__f3.png`: Szenenwechsel aus dem Gebäudeschnitt → beim Eintritt zuerst dieselbe Tür- oder Raumkante als visuellen Anker zeigen, bevor der volle Raum erscheint → das reduziert den Eindruck eines räumlichen Sprungs.

- `clip_elevator__f4.png`: Großes Dialogpanel → Oberkante nur so weit anheben, dass oberhalb noch ein zusammenhängender Raumstreifen von ungefähr einem Viertel der Bildhöhe sichtbar bleibt → der Ortsbezug verschwindet derzeit fast vollständig.
- `clip_elevator__f4.png`: Marina-Präsenz → den großen Bust verkleinert an der rechten Kopfbandkante erhalten oder bewusst ausblenden, bevor das Panel wächst → das jetzige Verschwinden liest sich in der Bildfolge abrupt.
- `clip_elevator__f4.png`: Antwortzeilen → Kosten und Status an einer gemeinsamen rechten Innenkante ausrichten und vom Rahmen mit demselben Abstand wie die Nummern links abrücken → die Ressourcenangaben wirken angeklebt.
- `clip_elevator__f4.png`: Aktive Antwort `[1]` → nicht nur mit Stern, sondern zusätzlich über eine klar erkennbare Papier- oder Randänderung markieren → der aktuelle Auswahlzustand ist beim ersten Blick nicht sicher zu unterscheiden.

- `clip_walkhome_dayreport__f1.png`: Laufende Figur auf Etage 1 → auf dieselbe normierte Spritehöhe wie die Figuren der oberen Etagen reduzieren → der Größenunterschied ist im orthografischen Gebäudeschnitt nicht begründet.
- `clip_walkhome_dayreport__f1.png`: Fuß-Pivot der Figur → exakt an der Korridor-Bodenlinie fixieren und über alle Gehframes unverändert lassen → das verhindert sichtbares vertikales Wippen oder vermeintliches Schweben.
- `clip_walkhome_dayreport__f1.png`: Fahrstuhlkabine auf Etage 1 → Kabinenmitte horizontal auf die Schachtmitte und Unterkante auf den Etagenanschlag ausrichten → sie wird zum verständlichen Ziel der Heimwegsequenz.
- `clip_walkhome_dayreport__f1.png`: Nachtabdunklung → Spielfigur und Fahrstuhleingang lokal etwas weniger stark abdunkeln als die inaktiven Etagen → Handlung und Ziel müssen vor der bloßen Gebäudestimmung lesbar bleiben.

- `clip_walkhome_dayreport__f2.png`: Spielfigur im Erdgeschoss → auf die Größe des Pförtners derselben Etage angleichen, höchstens geringfügig größer als Fokusfigur → aktuell suggeriert sie eine andere Perspektive oder einen anderen Assetmaßstab.
- `clip_walkhome_dayreport__f2.png`: Figur vor dem Fahrstuhl → Füße vollständig vor die Schwellenkante setzen oder vollständig in die Kabine verschieben, nicht genau auf die Rahmenüberlagerung → die momentane Tiefe ist mehrdeutig.
- `clip_walkhome_dayreport__f2.png`: Kamera gegenüber `clip_walkhome_dayreport__f1.png` → vertikale Verschiebung entweder vermeiden oder in klaren Etagenraster-Schritten ausführen → der leichte Versatz lässt den Gebäudekörper unnötig springen.
- `clip_walkhome_dayreport__f2.png`: Fahrstuhlkabine im Erdgeschoss → Kabinenunterkante bündig mit der Erdgeschossbodenlinie und nicht mit dem unteren Gebäuderahmen setzen → dadurch ist die Endposition räumlich eindeutig.

- `clip_walkhome_dayreport__f3.png`: Unterer Abschnitt „ÜBER NACHT“ → vollständig oberhalb des schwarzen unteren Randes beginnen lassen oder komplett unterhalb des Viewports halten → der angeschnittene Titel wirkt wie fehlerhaftes Scrollen.
- `clip_walkhome_dayreport__f3.png`: Drei Berichtsspalten → Außenspalten in der Höhe an ihren tatsächlichen Inhalt anpassen oder durch kurze Zusammenfassungen füllen → die großen leeren Papierflächen schwächen die Informationshierarchie.
- `clip_walkhome_dayreport__f3.png`: Kennzahlenblock → Werte „0 % / 150K / 0 %“ gegenüber ihren Labels deutlich vergrößern und auf eine gemeinsame Grundlinie setzen → dies sind die wichtigsten Resultate, derzeit aber nur dritte Hierarchieebene.
- `clip_walkhome_dayreport__f3.png`: Dunkler Hintergrundrahmen → seitliche und obere Innenabstände gleichmäßig halten → der Bericht sitzt optisch zu tief zwischen breitem oberen und angeschnittenem unteren Schwarzraum.

- `clip_walkhome_dayreport__f4.png`: Berichtszustand → bei einem statischen Endframe entweder vollständig identisch halten und Eingabehinweis zeigen oder eine erkennbare Zustandsänderung ergänzen → zwei praktisch identische Endbilder vermitteln sonst weder Fortschritt noch Interaktion.
- `clip_walkhome_dayreport__f4.png`: Unterer Viewportabschluss → den Folgeabschnitt nicht halb sichtbar lassen; Berichtshöhe an den sichtbaren Bereich koppeln → der Bildabschluss wirkt unfertig.
- `clip_walkhome_dayreport__f4.png`: Mittlere Milieu-Liste → Zeilenhöhe leicht erhöhen und Zustände rechts mit stärkerem Abstand von den Namen trennen → die dichte Liste ist schwerer zu scannen als die leeren Nachbarspalten.
- `clip_walkhome_dayreport__f4.png`: Deutungshoheitsbalken → Endpunkte „Ministerium“ und „Institutionen“ näher an die jeweilige Balkenkante setzen und den aktuellen Zustand mit einem klaren Marker versehen → der volle blaue Balken allein erklärt die Lage nicht eindeutig.

## 3. **Grafiken/Assets**

- `clip_elevator__f1.png`, `clip_elevator__f2.png`, `clip_walkhome_dayreport__f1.png` und `clip_walkhome_dayreport__f2.png`: Der Gebäudeschnitt trägt die räumliche Orientierung; Etagen, Türen und Schacht bilden ein nachvollziehbares Koordinatensystem. Fremd wirken darin vor allem die uneinheitlich skalierten Figuren: Spielfigur, Pförtner und obere NPCs scheinen aus unterschiedlichen Sprite-Metriken zu stammen. Das widerspricht weniger dem Stil als der technischen Einheitlichkeit.
- `clip_elevator__f1.png` und `clip_walkhome_dayreport__f1.png`: Die Lauf-Sprites sind feiner und höher als mehrere statische NPCs, ohne dass Perspektive oder Tiefenebene den Unterschied erklären. Nötig ist ein gemeinsamer Exportmaßstab mit identischem Fuß-Pivot und einer festen Figurenhöhe relativ zur Tür.
- `clip_elevator__f3.png` und `clip_elevator__f4.png`: Die moderne Büroansicht aus Glas, Stahl und klarer Pixelgrafik entspricht dem in `sprite-tool/public/context/game-style-guide.md` beschriebenen 2020er-Ministeriumslook besser als ein retrobrauner Geheimdienstklischee-Raum. Der große Marina-Bust ist deutlich detailreicher als die Welt-Sprites, funktioniert aber als Dialogebene, sofern seine Verankerung am Panel klar bleibt.
- `clip_elevator__f4.png`, `clip_walkhome_dayreport__f3.png` und `clip_walkhome_dayreport__f4.png`: Die Papierflächen passen zur „Behörden-Akte“ aus `desinformation-network/src/story-mode/theme.ts`. Problematisch ist nicht der Assetstil, sondern die flächige Skalierung: Die Panels verdecken fast alles beziehungsweise erzeugen große ungenutzte Papierfelder.
- `clip_elevator__f1.png`, `clip_elevator__f2.png`, `clip_walkhome_dayreport__f1.png` und `clip_walkhome_dayreport__f2.png`: Am meisten fehlt direkt unter den bewegten Figuren ein konsistenter, sehr schmaler Kontaktschatten. Er würde mit wenig Aufwand Bodenkontakt, Fuß-Pivot und Tiefenlage deutlich lesbarer machen.
- `clip_walkhome_dayreport__f3.png` und `clip_walkhome_dayreport__f4.png`: Der unten angeschnittene Berichtsteil ist falsch beschnitten. Entweder muss der Inhalt innerhalb des sichtbaren Berichtsrahmens enden oder der nächste Abschnitt mit genügend Höhe als bewusstes Scrollsignal sichtbar werden.

## 4. **Raster & Rhythmus**

- `clip_elevator__f1.png` und `clip_elevator__f2.png`: Das Etagenraster ist grundsätzlich eindeutig, doch Türschilder, Etagennamen und gelbe Zielmarken liegen auf mehreren konkurrierenden Horizontalen. Die Zielschilder sollten stets an derselben Kante des jeweiligen Etagenstegs sitzen, statt teils mittig über Türen und teils auf Trenndecken zu schweben.
- `clip_walkhome_dayreport__f1.png` und `clip_walkhome_dayreport__f2.png`: Der Gebäudekörper bleibt horizontal stabil, wird vertikal aber leicht versetzt. Wenn die Kamera der Kabine folgt, sollte sie in exakt demselben Raster wie die Etagen fahren; ein kleiner freier Versatz wirkt eher wie Layoutjitter.
- `clip_elevator__f1.png`, `clip_elevator__f2.png`, `clip_walkhome_dayreport__f1.png` und `clip_walkhome_dayreport__f2.png`: Die helle rechte Werkzeugleiste bildet eine harte eigene Spalte, während der Gebäudekörper links davon zentriert ist. Zwischen Weltfläche und Leiste fehlt eine klare Trennung oder ein gleichmäßiger Rand; die Welt wirkt rechts abgeschnitten statt bewusst gerahmt.
- `clip_elevator__f3.png` und `clip_elevator__f4.png`: Beide Dialogzustände teilen dieselben Seitenkanten, aber nicht denselben vertikalen Rhythmus. Der Sprung der Oberkante um mehrere Raumzonen sollte durch eine feste Maximalhöhe oder eine sichtbare Panelanimation strukturiert werden.
- `clip_walkhome_dayreport__f3.png` und `clip_walkhome_dayreport__f4.png`: Die drei oberen Spalten sind geometrisch sauber, inhaltlich aber unausgewogen: Mitte dicht, links und rechts weitgehend leer. Darunter folgt ein breiter Kennzahlenblock ohne starke vertikale Verbindung zu den drei Spalten, wodurch zwei voneinander getrennte Raster entstehen.
- `clip_walkhome_dayreport__f3.png` und `clip_walkhome_dayreport__f4.png`: Tote Fläche entsteht vor allem in den unteren zwei Dritteln der linken und rechten Berichtsspalte. Unruhe entsteht dagegen am unteren Bildrand, wo der nächste Abschnitt nur als schmaler, abgeschnittener Streifen erscheint.

## 5. **Lesbarkeit**

- `clip_elevator__f1.png` und `clip_elevator__f2.png`: Bei den Etagenbezeichnungen und schwarzen Raumschildern musste ich zweimal hinsehen; kleine helle Pixelschrift auf dunklen, detailreichen Gebäudekanten verliert sich. Die Schilder brauchen entweder eine etwas größere Schrift oder mehr ruhige Innenfläche um den Text.
- `clip_walkhome_dayreport__f1.png` und `clip_walkhome_dayreport__f2.png`: Nachtfilter und geringe Schriftgröße drücken die Etagennamen und den unteren Statussatz fast unter die Wahrnehmungsschwelle. Die im Theme vorgesehenen Kontraste helfen nicht, wenn die komplette Welt inklusive Text zusätzlich abgedunkelt wird.
- `clip_elevator__f3.png`: Name und Rolle sind lesbar, aber das große Marina-Bild konkurriert mit dem noch kurzen Dialogsatz. Der Schreibcursor ist sichtbar; ob der Text abgeschlossen, überspringbar oder noch in Eingabe ist, wird jedoch nicht zusätzlich als Zustand erklärt.
- `clip_elevator__f4.png`: Bei den kleinen AP- und K-Werten rechts musste ich zweimal hinsehen. Außerdem ist der Unterschied zwischen aktiver, verfügbarer und möglicherweise gesperrter Antwort nur über Stern, Pfeil und kleine Kostenangaben codiert; diese Zustände sind nicht sofort eindeutig.
- `clip_walkhome_dayreport__f3.png` und `clip_walkhome_dayreport__f4.png`: Die Milieunamen sind noch lesbar, die Zustände „ruhig“, „misstrauisch“ und „wütend“ rechts aber sehr klein und kontrastarm. Die drei Hauptwerte stehen zu klein unter ihren Labels, obwohl sie den Tagesabschluss zusammenfassen.
- `clip_walkhome_dayreport__f3.png` und `clip_walkhome_dayreport__f4.png`: Beim Deutungshoheitsbalken ist nicht unmittelbar klar, ob ein komplett blauer Balken einen Maximalwert, eine neutrale Ausgangslage oder nur die Skala darstellt. Ein Positionsmarker und ein numerischer Wert fehlen.

## 6. **Die drei wirksamsten Änderungen**

1. **Einheitliche Spritehöhe und gemeinsamer Fuß-Pivot in `clip_elevator__f1.png`, `clip_elevator__f2.png`, `clip_walkhome_dayreport__f1.png` und `clip_walkhome_dayreport__f2.png`** — geringer technischer Eingriff mit großer Wirkung, weil damit Größenwechsel, Schwebeeindruck und Einsinken gleichzeitig reduziert werden.
2. **Fahrstuhl und Kamera strikt an ein gemeinsames Etagenraster binden** — dadurch lesen sich die Wechsel zwischen den ersten beiden Frames beider Clips als Fahrt statt als springender Gebäudecrop.
3. **Panelhöhen und Viewportbeschnitt in `clip_elevator__f4.png`, `clip_walkhome_dayreport__f3.png` und `clip_walkhome_dayreport__f4.png` korrigieren** — verhindert abrupt verschwindende Figuren sowie den sichtbar angeschnittenen nächsten Berichtsteil.

## 7. **Blinde Flecken**

- Die Bilder sind Standbilder; Geschwindigkeit, Beschleunigung, Easing, Fußgleiten, vertikales Wippen der Gehzyklen und tatsächliches Schweben zwischen den gezeigten Zeitpunkten sind nicht beurteilbar.
- Bei `clip_elevator__f1.png` und `clip_elevator__f2.png` ist nicht erkennbar, ob die Figur sichtbar in den Fahrstuhl steigt, während der Fahrt verborgen wird und oben wieder aussteigt oder ob sie zwischen Etagen teleportiert.
- Bei `clip_walkhome_dayreport__f1.png` und `clip_walkhome_dayreport__f2.png` ist nicht feststellbar, ob Kabine und Figur synchron im Erdgeschoss ankommen oder ob ihre Positionen während der Fahrt auseinanderlaufen.
- Der harte Wechsel von `clip_elevator__f2.png` zu `clip_elevator__f3.png` sowie von `clip_walkhome_dayreport__f2.png` zu `clip_walkhome_dayreport__f3.png` könnte ein sauberer Cut, ein Fade oder ein sichtbarer Sprung sein; dafür wären mehrere direkt aufeinanderfolgende Frames rund um den Übergang nötig.
- `clip_elevator__f3.png` zu `clip_elevator__f4.png` zeigt nur Anfangs- und Endzustand des Panels. Ob Marina vor dem Panelwachstum ausblendet oder in einem Frame verschwindet, lässt sich nicht erkennen.
- `clip_walkhome_dayreport__f3.png` und `clip_walkhome_dayreport__f4.png` sind praktisch identisch. Für eine Beurteilung des Berichtaufbaus wären frühere Frames mit Einblendung der Spalten, Kennzahlen und des unteren Abschnitts erforderlich.
- Hover-, Fokus-, Tastatur-, gesperrte und neu freigeschaltete Zustände sind nicht ausreichend abgebildet. Zusätzlich wären Screenshots in der kleinsten unterstützten Auflösung nötig, um Schrift und Beschnitt belastbar zu prüfen.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
