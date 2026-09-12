# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung

**Modell:** `gpt-5.6-sol` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-22
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-22T17:51:10.055Z · **Dauer:** 176.2 s
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
| 🖼 Bild | `clip_broadcast__f1.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_broadcast__f1.png` | 1075 kB |
| 🖼 Bild | `clip_broadcast__f2.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_broadcast__f2.png` | 1043 kB |
| 🖼 Bild | `clip_broadcast__f3.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_broadcast__f3.png` | 1106 kB |
| 🖼 Bild | `clip_broadcast__f4.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_broadcast__f4.png` | 1099 kB |

---

## Antwort des Modells

1. **Erster Eindruck**

**`clip_broadcast__f1.png`**  
Das Auge landet zuerst auf dem warmen, stark gesättigten Wohnzimmer unten rechts; der eigentliche Sendestatus „MINISTERIUM SENDET“ bleibt dagegen zweitrangig. Für die Informationshierarchie sollte zuerst der Sendestatus und danach das Publikum gelesen werden. Die Figuren in Lobby und Etage 1 stehen mit ihren Füßen plausibel auf derselben Bodenebene; eindeutiges Schweben oder Versinken ist dort nicht zu sehen. Bei der oben angeschnittenen laufenden Figur ist der Bodenkontakt wegen des knappen Bildausschnitts nicht sicher ablesbar. Im Wohnzimmer verdecken sich Beine, Sofa und Teppich so stark, dass besonders bei der dunklen mittleren Figur kein eindeutiger Kontaktpunkt erkennbar ist.

**`clip_broadcast__f2.png`**  
Auch in `clip_broadcast__f2.png` zieht das Wohnzimmer die Aufmerksamkeit stärker an als Sendetitel, Quote und Reichweite. Die angeschnittene Figur im obersten Geschoss ist gegenüber `clip_broadcast__f1.png` deutlich nach rechts gewandert, behält aber sichtbar dieselbe Größe. Die feststehenden Figuren, Türen, Möbel und Panelgrenzen springen nicht und verschwinden nicht. Ob die große zurückgelegte Strecke flüssig durchlaufen oder als Positionssprung gezeigt wird, lässt sich aus diesen beiden Standbildern ohne Zeitabstand nicht beurteilen.

**`clip_broadcast__f3.png`**  
In `clip_broadcast__f3.png` bleibt die helle Publikumsfläche der dominante Blickfänger, obwohl der Zustand der Sendung die wichtigere Information wäre. Die obere Figur bewegt sich weiter monoton nach rechts; die Strecken von `clip_broadcast__f1.png` zu `clip_broadcast__f2.png` und von dort zu `clip_broadcast__f3.png` wirken ungefähr gleich groß. Maßstab, Kameraperspektive und Gebäudeausschnitt bleiben stabil. Im Publikum verändern sich höchstens kleine Silhouetten- oder Gliedmaßenstellungen; eine wechselnde Körpergröße ist nicht erkennbar, der Bodenkontakt bleibt durch die Überlagerungen aber unklar.

**`clip_broadcast__f4.png`**  
In `clip_broadcast__f4.png` konkurrieren weiterhin das Wohnzimmer und der große alte Fernseher um den Erstblick; der kleine Sendestatus dazwischen verliert. Die obere Figur steht nochmals weiter rechts, doch die Strecke von `clip_broadcast__f3.png` zu `clip_broadcast__f4.png` ist sichtbar kürzer als die beiden vorherigen Strecken. Falls die Aufnahmen zeitlich gleich weit auseinanderliegen, deutet das auf Abbremsen oder einen ungleichmäßigen Pfad; ohne Zeitstempel ist das nicht als Fehler belegbar. Keine der festen Figuren oder Einrichtungsgegenstände ändert erkennbar ihre Größe oder verschwindet. Die wechselnden hellen Partikel sind die einzige deutlich erscheinende und verschwindende Objektklasse; als Ambient-Effekt ist das plausibel, ihre Lage über Innenräumen macht die räumliche Ebene jedoch unklar.

2. **Konkrete Eingriffe je Screen**

**`clip_broadcast__f1.png`**

- Oberste laufende Figur in `clip_broadcast__f1.png` → den sichtbaren Geschossausschnitt nach oben um etwa eine halbe Figurenhöhe erweitern oder die Figur auf eine klar erkennbare Bodenfuge absenken → Kopfbeschnitt und unklarer Fußpunkt lassen sie derzeit eher aufgeklebt als im Raum verankert wirken.
- Publikumsgruppe in `clip_broadcast__f1.png` → die dunkle mittlere Figur etwa eine Viertelkopfbreite nach links oder rechts von der rechten Sitzfigur lösen und die Beine nicht auf derselben Silhouettenkante führen → Sofa, Körper und Teppich verschmelzen zu einem schwer lesbaren Block.
- Figurenpaar vor der Tür in Etage 1 von `clip_broadcast__f1.png` → seitlich um ungefähr ein Drittel einer Körperbreite trennen, bei unveränderter gemeinsamer Fußlinie → beide Figuren stehen plausibel am Boden, sind aber als zwei Körper nur mühsam auseinanderzuhalten.
- Sendetitel in `clip_broadcast__f1.png` → auf etwa das 1,3-Fache vergrößern und seine linke Kante exakt mit Quote/Reichweite darunter ausrichten → der wichtigste Zustand verliert gegen das helle Wohnzimmer.

**`clip_broadcast__f2.png`**

- Laufpfad der oberen Figur in `clip_broadcast__f2.png` → den Sprite-Fußanker über alle Frames an dieselbe horizontale Bodenlinie binden und nur die X-Position verändern → so werden vertikales Wackeln und scheinbares Schweben technisch ausgeschlossen.
- Füße der Publikumsfiguren in `clip_broadcast__f2.png` → unter den sichtbaren Schuhen sehr flache, entsättigte Kontaktschatten ergänzen, jeweils nicht breiter als der betreffende Fußstand → die Sitz- und Bodenebenen sind wegen Teppich und Überlagerung derzeit schwer zu unterscheiden.
- Leerzustandstext in `clip_broadcast__f2.png` → um etwa ein Viertel vergrößern, deutlich heller setzen und näher an die Kennzahlenzeile rücken → der Text geht in der großen schwarzen Fläche unter.
- Rechte Kürzelleiste in `clip_broadcast__f2.png` → Tastenfelder mit gleichmäßigem Innenabstand zur rechten und linken Schienenkante zentrieren → die Felder wirken am rechten Bildrand eingeklemmt und nicht als sauber gruppierte Navigation.

**`clip_broadcast__f3.png`**

- Oberste Figur in `clip_broadcast__f3.png` → oberhalb des Kopfes mindestens eine halbe Kopfhöhe sichtbaren Raum lassen und die Bodenfuge vollständig zeigen → nur mit beiden Bezugskanten lässt sich ihre Position zum Geschoss sicher lesen.
- Dunkle Figuren im Publikum von `clip_broadcast__f3.png` → benachbarte Jacken um eine klar erkennbare Helligkeitsstufe differenzieren, ohne die Palette stärker zu sättigen → zwei Körper und mehrere Beine bilden momentan eine nahezu durchgehende dunkle Masse.
- Textblock „QUOTE / REICHWEITE / KANAL“ in `clip_broadcast__f3.png` → Spaltenbreiten vereinheitlichen und Werte direkt unter den jeweiligen Begriff setzen → die weiten, ungleichen Zwischenräume erschweren den schnellen Vergleich.
- Helle Partikel in `clip_broadcast__f3.png` → an der Außenkontur des Gebäudes maskieren, sofern sie Schnee oder Außenstaub darstellen → Partikel über Innenwänden und Fluren schwächen die räumliche Trennung von Innen und Außen.

**`clip_broadcast__f4.png`**

- Letzte Pfadposition der oberen Figur in `clip_broadcast__f4.png` → bei gleich großen Aufnahmeabständen horizontal etwa ein Drittel der vorherigen Teilstrecke weiter nach rechts setzen; bei beabsichtigtem Abbremsen den Fußzyklus passend verlangsamen → der letzte Wegabschnitt ist sonst auffällig kürzer.
- Publikumsgruppe in `clip_broadcast__f4.png` → die Kontaktpunkte von gestreckten Schuhen, Teppichkante und Sofasockel durch eine freie Kontur von mindestens einer halben Schuhhöhe trennen → mehrere Füße scheinen optisch im Teppich oder in Nachbarfiguren zu verschwinden.
- Unteres Broadcast-Panel in `clip_broadcast__f4.png` → den leeren schwarzen Bereich unter dem Hinweistext im Standby-Zustand um ungefähr ein Viertel der Panelhöhe reduzieren oder dort einen klar zentrierten Leerzustand platzieren → die Fläche erzeugt unnötiges visuelles Gewicht ohne Information.
- Wohnzimmer-Zuschnitt in `clip_broadcast__f4.png` → rechts vor der beigen Seitenleiste einen Innenrand von ungefähr einer halben Labelhöhe lassen oder die Sofakante bewusst an einer Möbelkante schneiden → der derzeitige Anschnitt wirkt vom Seitenpanel abgeschnitten statt komponiert.

3. **Grafiken/Assets**

- In `clip_broadcast__f1.png` bis `clip_broadcast__f4.png` trägt der Gebäudequerschnitt: Türen, Bodenfugen und Architektur folgen einer konsistenten Seitenansicht, und die Figuren auf Etage 1 sowie in der Lobby besitzen einen plausiblen gemeinsamen Maßstab.
- Das Wohnzimmer in `clip_broadcast__f1.png` bis `clip_broadcast__f4.png` ist erheblich wärmer, gröber gepixelt und kontrastreicher als das Gebäude. Eine wärmere Medienzone ist mit `sprite-tool/public/context/game-style-guide.md` vereinbar, die orangene Sättigung und die unruhigen Figurensilhouetten gehen aber über die dort geforderte zurückhaltende, moderne Pixel-Art hinaus.
- Der Röhrenfernseher in allen vier Dateien ist sauber freigestellt, wirkt mit Holzgehäuse, Antennen und grobem Raster jedoch stärker nach 1970er-Requisite als nach dem in `sprite-tool/public/context/game-style-guide.md` verbindlich genannten 2020er-Ministeriumslook. Wenn er als bewusst archivisches Sendegerät gemeint ist, braucht er einen moderneren technischen Rahmen im Panel, damit er nicht den Gesamtzeitraum definiert.
- Das schwarze Broadcast-Panel in `clip_broadcast__f1.png` bis `clip_broadcast__f4.png` steht materiell gegen die Vorgabe aus `desinformation-network/src/story-mode/theme.ts`, laut der die gesamte Bedienung aus Papierflächen bestehen soll. Der beige rechte Streifen folgt dieser Absicht, die schwarze Fläche liest sich dagegen wie eine fremde CRT-Oberfläche.
- Am meisten fehlt im Wohnzimmer aller vier Dateien eine eindeutige Bodenkontaktgrafik: flache Schatten unter den sichtbaren Schuhen und eine klarere Teppichkante würden mehr bringen als zusätzliche Möbeldetails.
- Die obere laufende Figur ist in allen vier Dateien falsch beschnitten: Nicht ihr Maßstab wechselt, sondern der Bildrand nimmt ihr Kopf- und Raumkontext, wodurch Bodenlage und Perspektive unnötig zweifelhaft werden.

4. **Raster & Rhythmus**

- `clip_broadcast__f1.png` bis `clip_broadcast__f4.png` teilen den Bildschirm in einen großen Gebäudequerschnitt oben und ein knappes Drittel Broadcast-Fläche unten. Diese Teilung ist stabil, aber der helle Publikumsblock unten rechts erhält durch Fläche, Wärme und Kontrast mehr Gewicht als der eigentliche Statusblock.
- Im unteren Bereich aller vier Dateien sind Fernseher, Statusspalte und Publikum grundsätzlich als drei Spalten angelegt, doch die mittlere Spalte besitzt viel tote schwarze Fläche. Der Hinweistext sollte näher an Titel und Kennzahlen sitzen oder der Standby-Zustand sollte die Panelhöhe reduzieren.
- Die linken Kanten von „MINISTERIUM SENDET“, Kennzahlen und Hinweistext liegen in `clip_broadcast__f1.png` bis `clip_broadcast__f4.png` nicht stark genug als eine gemeinsame Achse vor. Eine durchgehende linke Bezugskante würde den mittleren Bereich als geschlossenes Informationsmodul lesbar machen.
- Die Geschossbezeichnungen im Gebäude bilden viele dünne horizontale Bänder. Zusammen mit Bodenfugen, Paneltrennlinien und der roten Broadcast-Kante entsteht in allen vier Dateien ein enges Streifenraster, das Figuren und Türen teilweise optisch zerschneidet.
- Die rechte Kürzelleiste ist in `clip_broadcast__f1.png` bis `clip_broadcast__f4.png` sehr schmal und durch den Bildschirmrand hart begrenzt. Zwischen Wohnzimmer und Leiste fehlt eine neutrale Trennfuge; aktuell wirkt die Leiste wie ein nachträglich angehängter Reststreifen.
- Tote Fläche entsteht vor allem unter dem Standby-Text, Unruhe dagegen im Publikum durch überlagerte Gliedmaßen und ähnlich dunkle Kleidung.

5. **Lesbarkeit**

- In `clip_broadcast__f1.png` bis `clip_broadcast__f4.png` musste ich bei „QUOTE 0 % / REICHWEITE 0 % / KANAL –“ zweimal hinsehen: Die Schrift ist klein, schmal und gegenüber Schwarz zu gedämpft. Eine Vergrößerung um etwa ein Viertel und weniger Zeichenabstand wären sinnvoller als zusätzliche Linien.
- Der Satz „Noch keine Maßnahme ausgespielt …“ ist in allen vier Dateien zu kontrastarm für eine statusrelevante Erklärung. Er sollte mindestens dieselbe optische Helligkeit wie die Geschosslabels erhalten.
- Die Geschoss- und Raumnamen sind in `clip_broadcast__f1.png` bis `clip_broadcast__f4.png` aus der Distanz nur mühsam zu lesen, besonders „Finanzen / Tresor · Igor“ und „Direktor / Zentrale · Kurator“. Sie benötigen entweder etwas größere Schrift oder ruhigere, breitere Trägerflächen ohne direkt angrenzende Bodenlinien.
- „11:30“ ist in allen vier Screens der am schnellsten lesbare Text, obwohl die Uhr im Broadcast-Zustand nicht die wichtigste Information ist. Der Sendetitel sollte mindestens dieselbe visuelle Stärke bekommen.
- Die Buchstabentasten der rechten Leiste zeigen in `clip_broadcast__f1.png` bis `clip_broadcast__f4.png` keinen klar erkennbaren Zustand für aktiv, gesperrt oder neu. Sichtbar ist nur eine Folge nahezu gleicher Kästen; falls Zustände existieren, sind sie in diesen Aufnahmen nicht unterscheidbar.
- Im Publikum musste ich mehrfach prüfen, wie viele Personen dort sitzen. Das ist weniger ein Auflösungsproblem als ein Kontrast- und Überlagerungsproblem zwischen den dunklen Körpern.

6. **Die drei wirksamsten Änderungen**

1. **Sendetitel, Kennzahlen und Leerzustand in `clip_broadcast__f1.png` bis `clip_broadcast__f4.png` vergrößern und als klare gemeinsame Spalte ausrichten** — geringer UI-Aufwand, aber die beabsichtigte Informationshierarchie wird sofort verständlich.
2. **Für alle Figuren feste Fußanker und flache Kontaktschatten definieren, besonders oben und im Publikum** — damit verschwinden die derzeitigen Zweifel an Schweben, Einsinken und vertikalem Frame-Wackeln.
3. **Publikumsfiguren durch kleine Positionsabstände und getrennte Helligkeitswerte entflechten** — das verbessert gleichzeitig Körperlesbarkeit, Bodenkontakt und die Wahrnehmung subtiler Idle-Animationen.

7. **Blinde Flecken**

- Aus `clip_broadcast__f1.png` bis `clip_broadcast__f4.png` kann ich ausdrücklich **nicht** beurteilen, ob die obere Figur flüssig läuft, mit den Füßen rutscht, zwischen ausgelassenen Frames springt oder einen sauberen Laufzyklus besitzt. Dafür fehlen Video, Einzelbildfolge und Zeitstempel.
- Ohne bekannte Zeitabstände lässt sich aus den unterschiedlichen Wegstrecken zwischen `clip_broadcast__f1.png` und `clip_broadcast__f4.png` keine sichere Aussage über Geschwindigkeit, Beschleunigung oder Easing ableiten.
- Die Standbilder zeigen nicht, ob die kleinen Publikumsänderungen eine funktionierende Idle-Animation, zufälliges Zittern oder nur verschiedene Renderzeitpunkte sind. Auch Loop-Naht, Bewegungsrhythmus und kurzzeitige Größenänderungen zwischen diesen vier Aufnahmen bleiben unsichtbar.
- Wegen der Überdeckung im Wohnzimmer ist in allen vier Dateien nicht sicher erkennbar, welche Beine zu welcher Figur gehören und ob verdeckte Füße korrekt am Boden stehen. Dafür wären vergrößerte Ausschnitte und isolierte Figuren-Layer mit eingeblendeter Bodenlinie nötig.
- Hover-, Fokus-, Aktiv-, Neu- und Sperrzustände der rechten Leiste sind in `clip_broadcast__f1.png` bis `clip_broadcast__f4.png` nicht dokumentiert. Dafür werden Vergleichsbilder jedes Zustands benötigt.
- Sinnvoll wären zusätzlich ein unkomprimierter Clip in Originalgeschwindigkeit, eine Version in halber Geschwindigkeit sowie fortlaufende Rohframes der oberen Figur und der Publikumsgruppe.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
