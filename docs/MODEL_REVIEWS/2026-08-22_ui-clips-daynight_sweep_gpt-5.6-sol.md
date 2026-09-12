# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung

**Modell:** `gpt-5.6-sol` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-22
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-22T17:54:06.482Z · **Dauer:** 149.1 s
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

### Gezeigtes Anschauungsmaterial (4 Screenshot(s))

| Art | Im Text genannt als | Datei | Größe |
|---|---|---|---:|
| 🖼 Bild | `clip_daynight_sweep__f1.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_daynight_sweep__f1.png` | 1042 kB |
| 🖼 Bild | `clip_daynight_sweep__f2.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_daynight_sweep__f2.png` | 1011 kB |
| 🖼 Bild | `clip_daynight_sweep__f3.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_daynight_sweep__f3.png` | 962 kB |
| 🖼 Bild | `clip_daynight_sweep__f4.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_daynight_sweep__f4.png` | 1061 kB |

---

## Antwort des Modells

1. **Erster Eindruck**

**`clip_daynight_sweep__f1.png`**  
Zuerst ziehen die helle Uhr oben rechts und das gelbe Keller-Schild den Blick an; für einen Tageszeiten-Clip sollte er zuerst auf Himmel und Gebäudebeleuchtung gehen, also ist die Hierarchie nicht stimmig. Die Figur auf Etage 3 steht mit den Schuhen ungefähr auf der Oberkante des dunklen Bodenstreifens und wirkt nicht versunken, hat aber kaum sichtbaren Bodenkontakt. Die beiden Figuren auf Etage 1 und die Person im Erdgeschoss stehen ebenfalls auf plausiblen gemeinsamen Fußlinien; ihre Maßstäbe passen zu den Türen und zueinander. Architektur, Türen, Möbel und Skyline zeigen gegenüber den Folgeaufnahmen keinen erkennbaren Perspektiv- oder Skalensprung. Aus diesem Standbild lässt sich nicht beurteilen, ob die Figur sauber läuft, mit den Füßen rutscht oder zwischen Frames vertikal springt.

**`clip_daynight_sweep__f2.png`**  
Auch hier dominiert das gelbe Schild „Finanzen / Tresor · Igor“, obwohl Uhr und Tageslicht die zeitliche Veränderung erklären sollten. Die Figur auf Etage 3 ist nach rechts bis knapp links neben den Wasserspender gerückt; ihre Fußkante bleibt gegenüber `clip_daynight_sweep__f1.png` nahezu auf derselben Bodenlinie. Ihre sichtbare Höhe und Kopfgröße wirken weitgehend konstant, während die geänderte Silhouette plausibel aus einer Gehpose stammen kann. Die übrigen Figuren und Objekte bleiben registriert, ohne erkennbares Wandern oder Verschwinden. Ob der große horizontale Weg seit `clip_daynight_sweep__f1.png` gleichmäßig oder als Sprung zurückgelegt wurde, ist anhand der beiden Standbilder nicht feststellbar.

**`clip_daynight_sweep__f3.png`**  
Die orange-violette Horizontzone ist erstmals der stärkste Blickfang und unterstützt damit die beabsichtigte Tageszeiten-Erzählung besser als in den ersten beiden Bildern. Die Figur auf Etage 3 steht weiter rechts im freien Flur und hält dieselbe Fußlinie sowie ungefähr denselben Maßstab. Auch die Personen auf Etage 1 und im Erdgeschoss bleiben unverändert positioniert und wirken weiterhin geerdet. Die Skyline gewinnt durch die dunkleren Vordergrundebenen Tiefe, ohne dass sich ihre Perspektive sichtbar verschiebt. Nicht erkennbar ist, ob der Farbwechsel weich verläuft oder zwischen einzelnen Animationsframes flackert beziehungsweise bandet.

**`clip_daynight_sweep__f4.png`**  
Zuerst fällt die stark abgedunkelte Gesamtfläche auf, danach die neu sichtbare zweite Person ganz rechts auf Etage 3; Uhr und Himmel erklären den Nachtzustand, verlieren aber gegen die Dunkelheit an Prägnanz. Die bisher wandernde Figur steht weiterhin korrekt auf der Bodenlinie, erscheint in dieser Pose jedoch etwas kürzer als in `clip_daynight_sweep__f2.png` und `clip_daynight_sweep__f3.png`. Das kann normales Auf-und-ab einer Gehpose sein, sollte aber anhand der Sprite-Rahmen geprüft werden. Die zweite Figur ist ähnlich skaliert und ebenfalls geerdet, war in den drei vorherigen Bildern jedoch nicht vorhanden und kann deshalb in dieser Auswahl wie ein Pop-in wirken. Ob sie tatsächlich plötzlich erscheint, aus der rechten Tür kommt oder schon zwischen den gezeigten Zeitpunkten einläuft, lässt sich aus den Standbildern nicht beurteilen.

2. **Konkrete Eingriffe je Screen**

**`clip_daynight_sweep__f1.png`**

- Figur auf Etage 3 → alle Gehframes an einer gemeinsamen Schuh-Unterkante ausrichten und diese exakt auf der Oberkante des Bodenstreifens verankern → verhindert vertikales „Hüpfen“ und scheinbares Schweben.
- Figur auf Etage 3 → einen sehr schmalen Kontaktschatten direkt unter der Standfläche ergänzen, höchstens so breit wie ihre Schrittstellung → der derzeit schwache Kontakt zum glatten Flurboden wird eindeutig.
- Gelbes Schild über dem Keller → gelbe Vollfläche auf eine gelbe Kontur oder ein schmaleres Kopfband reduzieren → es überstrahlt Himmel, Uhr und bewegte Figur.
- Rechte Bedienleiste → die leere Cremefläche auf die Breite der Tastenkacheln zusammenziehen und bündig an den rechten Viewportrand setzen → die große tote Fläche verschiebt den optischen Schwerpunkt aus dem Gebäude.

**`clip_daynight_sweep__f2.png`**

- Figur und Wasserspender auf Etage 3 → zwischen Sprite-Silhouette und Spender mindestens etwa eine halbe Figurenbreite frei halten oder die Figur sichtbar davor/dahinter staffeln → die fast tangierende Kontur macht die Tiefenreihenfolge unklar.
- Figur auf Etage 3 → Kopfoberkante und Schuh-Unterkante mit den entsprechenden Frames aus `clip_daynight_sweep__f1.png` und `clip_daynight_sweep__f3.png` auf eine feste Spritebox normieren → wechselnde Posen dürfen nicht wie Skalierung wirken.
- Weiße Partikel innerhalb der Etagen → auf den Außenraum maskieren; falls sie Innenraumstaub darstellen, deutlich sparsamer und nur innerhalb jeweils eines Raums führen → derzeit lesen sie sich wie Wetter, das durch Decken und Wände fällt.
- Uhr oben rechts → näher an die rechte Gebäudekante koppeln und mit dem oberen Gebäuderaster ausrichten, statt frei zwischen Gebäude und Seitenleiste zu stehen → Zeit und Tageslicht werden als zusammengehörige Information lesbar.

**`clip_daynight_sweep__f3.png`**

- Figur auf Etage 3 → Kontaktschatten und Fußanker wie in `clip_daynight_sweep__f1.png` beibehalten, ohne die Figur mit der Abendtönung gleich stark wie den Hintergrund abzudunkeln → Bewegung bleibt vor dem Flur lesbar.
- Skyline am Horizont → den warmen Streifen hinter dem Gebäude etwas breiter nach oben auslaufen lassen, ohne die Gebäudekanten mitzuwärmen → der Übergang von Tag zu Abend wirkt weniger wie ein schmales Farbbandsignal.
- Innenraum-Partikel → an Außenfassade und Fenster-/Öffnungskanten abschneiden → die durchgehenden weißen Punkte brechen die räumliche Trennung zwischen Stadt und Innenraum.
- Gelbes Keller-Schild → Helligkeit unter die der Uhr senken und nur Auswahlkante beziehungsweise Text gelb halten → die Uhr soll in diesem Clip vor der dauerhaft markierten Tür rangieren.

**`clip_daynight_sweep__f4.png`**

- Zweite Figur rechts auf Etage 3 → ihr Auftreten räumlich an die rechte Tür binden: zuerst teilweise vom Türrahmen verdeckt, danach vollständig im Flur → vermeidet den in dieser Bildfolge entstehenden Pop-in-Eindruck.
- Wandernde Figur auf Etage 3 → die kürzer wirkende Pose auf dieselbe Kopf-zu-Fuß-Höhe der übrigen Gehframes prüfen; nur Beine und Oberkörper innerhalb der festen Box animieren → vermeidet scheinbares Schrumpfen am Clipende.
- Raumbezeichnungen und Etagenlabels → von der stärksten Nachttönung ausnehmen oder ihre helle Schrift um eine Kontraststufe anheben → „Zielgruppen-Analyse“, „Newsroom“ und die Etagenbezeichnungen gehen sichtbar zurück.
- Nachtbeleuchtung im Gebäude → Deckenleuchten und schmale Bodenreflexe lokal erhalten, statt sämtliche Räume gleichmäßig abzudunkeln → Figuren und ihre Bodenkontakte bleiben erkennbar, während der Außenraum Nacht bleibt.

3. **Grafiken/Assets**

- `clip_daynight_sweep__f1.png`, `clip_daynight_sweep__f2.png`, `clip_daynight_sweep__f3.png` und `clip_daynight_sweep__f4.png`: Gebäudekörper, Türen, Aufzug, Möbel und Skyline tragen die Szene; Kantenschärfe und Detailgrad sind untereinander konsistent und entsprechen dem kühlen, modernen Welt-Look aus `sprite-tool/public/context/game-style-guide.md`.
- `clip_daynight_sweep__f1.png` bis `clip_daynight_sweep__f4.png`: Die Architektur bleibt über alle Zeitpunkte pixelgenau registriert; es gibt keinen sichtbaren Perspektivwechsel, keinen Zoom und kein unmotiviertes Wandern statischer Objekte.
- `clip_daynight_sweep__f1.png` bis `clip_daynight_sweep__f4.png`: Die wandernde Figur hält im Wesentlichen denselben Maßstab. Nur die Pose in `clip_daynight_sweep__f4.png` wirkt etwas niedriger; das ist ein Prüfpunkt, noch kein sicherer Skalierungsfehler.
- `clip_daynight_sweep__f4.png`: Die zweite Figur rechts passt stilistisch und maßstäblich zur ersten, ihr erstmaliges Erscheinen ist in der Vierbildfolge jedoch nicht räumlich erklärt.
- `clip_daynight_sweep__f1.png` bis `clip_daynight_sweep__f4.png`: Die cremefarbene Seitenleiste folgt zwar der Papierabsicht aus `desinformation-network/src/story-mode/theme.ts`, wirkt wegen der großen unstrukturierten Fläche und der randnahen Kacheln aber wie eine unfertige oder abgeschnittene Weboberfläche neben der Pixelwelt.
- `clip_daynight_sweep__f1.png` bis `clip_daynight_sweep__f4.png`: Am meisten fehlt ein konsequenter, sehr schmaler Kontaktschatten unter den Figuren auf Etage 3; er würde Schweben verhindern, ohne den feinen Pixelstil zu vergröbern.
- `clip_daynight_sweep__f1.png` bis `clip_daynight_sweep__f4.png`: Der Button unten rechts ist angeschnitten, und auch die rechte Bedienleiste sitzt optisch außerhalb des vollständigen Inhaltsbereichs; das ist ein Zuschnitts-/Viewportproblem, kein Assetproblem.

4. **Raster & Rhythmus**

- `clip_daynight_sweep__f1.png` bis `clip_daynight_sweep__f4.png`: Das Gebäuderaster bleibt stabil; alle Geschosskanten, Türen und Fassadenachsen liegen über die vier Zeitpunkte hinweg deckungsgleich.
- `clip_daynight_sweep__f1.png` bis `clip_daynight_sweep__f4.png`: Die wandernde Figur folgt einer klaren horizontalen Linie auf Etage 3. Die ersten beiden Wegabschnitte wirken ähnlich lang, der letzte kürzer; ohne genaue Framezeiten lässt sich daraus aber kein Positionssprung ableiten.
- `clip_daynight_sweep__f1.png` bis `clip_daynight_sweep__f4.png`: Rechts entsteht durch die breite Cremeleiste viel tote Fläche, während Gebäude, Uhr und Menü auf dem verbleibenden Bereich zusammengedrängt sind. Entweder sollte die Leiste vollständig als Panel gestaltet oder auf eine schmale Werkzeugspalte reduziert werden.
- `clip_daynight_sweep__f1.png` bis `clip_daynight_sweep__f4.png`: Die schwarzen Raumlabels bilden zwar horizontale Gruppen, ihre wechselnden Breiten und freien Positionen erzeugen aber einen zweiten, unruhigen Streifen über jeder Etage. Sie sollten konsequent an Türmitten oder feste Gebäudespalten gekoppelt werden.
- `clip_daynight_sweep__f1.png` bis `clip_daynight_sweep__f4.png`: Die untere Statusleiste endet rechts in einem angeschnittenen Bedienelement. Text, roter Oberstrich und rechter Button brauchen eine gemeinsame Innenkante innerhalb des sichtbaren Viewports.
- `clip_daynight_sweep__f3.png` und `clip_daynight_sweep__f4.png`: Die dunklere Skyline trennt sich gut vom Gebäude, aber die Innenräume verlieren gleichzeitig ihren eigenen Hell-dunkel-Rhythmus; lokale Lichtinseln würden die Geschosse wieder gruppieren.

5. **Lesbarkeit**

- `clip_daynight_sweep__f1.png` und `clip_daynight_sweep__f2.png`: Bei „Zielgruppen-Analyse“, „Newsroom“ und den Etagenbezeichnungen musste ich zweimal hinsehen; die Schrift ist im Verhältnis zur Gesamtansicht sehr klein und sitzt teilweise auf detailreichen Metallkanten.
- `clip_daynight_sweep__f3.png`: Die Raumlabels sind noch lesbar, konkurrieren aber mit den hellen Deckenleisten. Eine gleichmäßig dunkle Label-Unterlage mit etwas mehr horizontalem Innenraum wäre robuster.
- `clip_daynight_sweep__f4.png`: Die Nachttönung reduziert nicht nur die Welt, sondern auch die Orientierungstexte. Besonders „Etage 3 – Analyse & Medien“ und „Erdgeschoss – Empfang“ liegen zu nah am Hintergrundgrau.
- `clip_daynight_sweep__f1.png` bis `clip_daynight_sweep__f4.png`: Der untere Erklärungssatz ist für diese Gesamtansicht zu klein; außerdem wird die Zeile durch das angeschnittene rechte Element optisch nicht sauber abgeschlossen.
- `clip_daynight_sweep__f1.png` bis `clip_daynight_sweep__f4.png`: Die rechte Buchstabenleiste kommuniziert aktiv, gesperrt oder neu kaum. Lediglich die anders gerahmte „A“-Kachel wirkt ausgewählt, aber der Bedeutungsunterschied ist erst beim zweiten Blick erkennbar.
- `clip_daynight_sweep__f1.png` bis `clip_daynight_sweep__f4.png`: Das gelbe Keller-Schild ist als aktiver Zustand eindeutig, aber zu dominant. Eine gelbe Kontur plus dunkle Fläche würde den Zustand erhalten, ohne den Tageszeiten-Fokus zu überstimmen.

6. **Die drei wirksamsten Änderungen**

1. **`clip_daynight_sweep__f1.png` bis `clip_daynight_sweep__f4.png`: Gehframes auf feste Fußkante und feste Spritebox normieren, ergänzt um einen schmalen Kontaktschatten** — geringer Asset-Aufwand, aber die wichtigste Absicherung gegen Schweben, Versinken und scheinbare Größenwechsel.
2. **`clip_daynight_sweep__f1.png` bis `clip_daynight_sweep__f4.png`: Rechte Cremeleiste auf eine vollständige schmale Werkzeugspalte reduzieren und das angeschnittene untere Bedienelement in den Viewport holen** — beseitigt mit einer Layoutkorrektur die größte tote Fläche und den deutlichsten Zuschnittsfehler.
3. **`clip_daynight_sweep__f3.png` und `clip_daynight_sweep__f4.png`: Nachttönung von Raumlabels, Figuren und lokalen Innenleuchten entkoppeln** — erhält die Tageszeitenwirkung, ohne Orientierung und Bodenkontakt am Clipende zu verlieren.

7. **Blinde Flecken**

- Aus `clip_daynight_sweep__f1.png` bis `clip_daynight_sweep__f4.png` sind Laufgeschwindigkeit, Beschleunigung, Framefolge, Schrittzyklus, tatsächliches Fußrutschen und kurze vertikale Sprünge nicht beurteilbar; dafür wäre der Clip selbst oder eine Folge unmittelbar benachbarter Frames nötig.
- Zwischen `clip_daynight_sweep__f3.png` und `clip_daynight_sweep__f4.png` ist nicht erkennbar, ob die zweite Figur rechts plötzlich eingeblendet wird oder regulär aus der Tür läuft; benötigt werden mehrere Frames direkt vor und nach ihrem ersten Auftreten.
- In `clip_daynight_sweep__f1.png` bis `clip_daynight_sweep__f4.png` ist nicht sicher erkennbar, ob die weißen Punkte Wetter, Innenraumstaub oder ein globaler Effekt sind und wie sie sich bewegen; dafür braucht es einen kurzen Ausschnitt mit sichtbaren Partikelbahnen.
- Aus `clip_daynight_sweep__f1.png` bis `clip_daynight_sweep__f4.png` lässt sich nicht prüfen, ob der Himmel weich interpoliert, flackert oder Farbstufen bildet; dafür werden Zwischenframes aus dem Übergang um 16:57 bis 18:00 benötigt.
- Für die Figuren in `clip_daynight_sweep__f1.png` bis `clip_daynight_sweep__f4.png` wären vergrößerte, unskalierte Ausschnitte mit eingeblendeter Fuß-Basislinie nötig, um die scheinbar geringere Höhe in `clip_daynight_sweep__f4.png` eindeutig als Pose oder Fehler einzuordnen.
- Hover-, Fokus-, Aktiv-, Sperr- und Neu-Zustände der rechten Kacheln sind in `clip_daynight_sweep__f1.png` bis `clip_daynight_sweep__f4.png` nicht dokumentiert. Zusätzlich wird ein Screenshot des vollständigen nativen Viewports benötigt, um zu klären, ob Seitenleiste und unterer rechter Button tatsächlich abgeschnitten oder nur bei der Aufnahme beschnitten wurden.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
