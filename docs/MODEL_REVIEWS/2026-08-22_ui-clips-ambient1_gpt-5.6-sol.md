# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung

**Modell:** `gpt-5.6-sol` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-22
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-22T17:42:08.982Z · **Dauer:** 172.7 s
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

### Gezeigtes Anschauungsmaterial (12 Screenshot(s))

| Art | Im Text genannt als | Datei | Größe |
|---|---|---|---:|
| 🖼 Bild | `clip_ambient_etage1__f1.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_etage1__f1.png` | 991 kB |
| 🖼 Bild | `clip_ambient_etage1__f2.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_etage1__f2.png` | 1030 kB |
| 🖼 Bild | `clip_ambient_etage1__f3.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_etage1__f3.png` | 962 kB |
| 🖼 Bild | `clip_ambient_etage1__f4.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_etage1__f4.png` | 1060 kB |
| 🖼 Bild | `clip_ambient_etage2__f1.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_etage2__f1.png` | 972 kB |
| 🖼 Bild | `clip_ambient_etage2__f2.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_etage2__f2.png` | 1144 kB |
| 🖼 Bild | `clip_ambient_etage2__f3.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_etage2__f3.png` | 1117 kB |
| 🖼 Bild | `clip_ambient_etage2__f4.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_etage2__f4.png` | 1116 kB |
| 🖼 Bild | `clip_ambient_etage3__f1.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_etage3__f1.png` | 1003 kB |
| 🖼 Bild | `clip_ambient_etage3__f2.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_etage3__f2.png` | 1113 kB |
| 🖼 Bild | `clip_ambient_etage3__f3.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_etage3__f3.png` | 1096 kB |
| 🖼 Bild | `clip_ambient_etage3__f4.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_etage3__f4.png` | 1078 kB |

---

## Antwort des Modells

## 1. **Erster Eindruck**

### `clip_ambient_etage1__f1.png`
Das Auge bleibt zuerst an der dicht überlagerten Figurengruppe vor der linken Tür auf Etage 1 hängen. Für einen Ambient-Clip sollte dagegen eine klar freigestellte bewegte Figur den Blick führen; die gehende Person auf Etage 3 ist dafür zu wenig hervorgehoben. Ihre Füße liegen plausibel auf der horizontalen Laufebene, sichtbares Schweben oder Einsinken ist nicht erkennbar. Maßstab und Seitenperspektive passen zu den übrigen Korridorfiguren, während die größere Lobbyfigur wegen der räumlicheren Bodenfläche nur bedingt vergleichbar ist.

### `clip_ambient_etage1__f2.png`
Wieder dominiert die Türgruppe auf Etage 1, obwohl die freigestellte Figur in der Mitte von Etage 2 leichter als Bewegungsträger lesbar sein sollte. Die Füße dieser Figur sitzen sauber auf derselben Laufkante wie Pflanzkübel, Schrank und Bank. Gegenüber `clip_ambient_etage1__f1.png` ist die Figur auf Etage 3 verschwunden und eine anders aussehende Figur auf Etage 2 vorhanden; aus diesen Zeitproben ist nicht erkennbar, ob dazwischen ein plausibler Ein- oder Austritt lag. Eine Größen- oder Perspektivänderung der festen Umgebung ist nicht sichtbar.

### `clip_ambient_etage1__f3.png`
Die einzelne Figur rechts auf Etage 1 zieht nun stärker als die weiterhin dichte Türgruppe links. Das ist näher an einer brauchbaren Blickführung, allerdings konkurriert sie mit einer zweiten gehenden Figur ganz rechts auf Etage 3. Beide Figuren stehen mit den Füßen plausibel auf ihren jeweiligen Bodenlinien und wirken nicht skaliert oder perspektivisch verzerrt. Gegenüber `clip_ambient_etage1__f2.png` wechselt die Belegung erneut zwischen Etagen, ohne dass in diesen Standbildern ein verbindender Weg sichtbar wäre.

### `clip_ambient_etage1__f4.png`
Durch gleichzeitig sichtbare Figuren auf drei Etagen zerfällt der Blick in mehrere gleich starke Ziele. Zuerst fällt die Figur vor dem Schrank auf Etage 2 auf, allerdings vor allem wegen der problematischen Überlagerung mit dem Möbel. Die Figuren auf Etage 3 und Etage 1 haben plausible Fußhöhen; die obere Figur verschmilzt jedoch mit dem Wandbild hinter ihrem Kopf. Die statischen Türen, Möbel und Etagenkanten bleiben gegenüber `clip_ambient_etage1__f1.png` bis `clip_ambient_etage1__f3.png` stabil.

### `clip_ambient_etage2__f1.png`
Das Auge geht zuerst zur Figurengruppe vor der Tür auf Etage 2, was zum Dateikontext passt, aber als gedrängter Sprite-Stapel statt als klare Aktion erscheint. Die drei Figuren teilen fast dieselbe Fläche und sind in ihrer Tiefenreihenfolge schwer auseinanderzuhalten. Die freieren Figuren auf Etage 3 und 4 stehen dagegen sauber auf den jeweiligen Laufebenen und behalten einen vergleichbaren Maßstab. Sichtbares Schweben liegt nicht vor; bei der Türgruppe ist wegen der Überdeckung nicht sicher zu erkennen, wo einzelne Füße enden.

### `clip_ambient_etage2__f2.png`
Die freigestellte Figur links der Mitte auf Etage 2 ist nun das klarste Bewegungssignal und sollte auch zuerst gesehen werden. Tatsächlich konkurriert sie noch mit der größeren, helleren Person in der Tür rechts. Beide Fußanker wirken bodenständig, und auch die Figur auf Etage 3 hat eine passende Baseline. Gegenüber `clip_ambient_etage2__f1.png` verschwinden mehrere Figuren gleichzeitig; ob das echte Sprünge oder reguläre Ausgänge zwischen den Stichproben sind, lässt sich nicht feststellen.

### `clip_ambient_etage2__f3.png`
Die Figur auf Etage 4 ist der einzige klar freigestellte bewegte Akteur und wird deshalb zuerst wahrgenommen. Für einen Clip mit Fokus auf Etage 2 sollte der Blick eher zur dortigen Person in der Tür gehen, die jedoch wie ein statischer Tür-NPC wirkt. Maßstab, Bodenhöhe und Kamera bleiben gegenüber `clip_ambient_etage2__f1.png` und `clip_ambient_etage2__f2.png` stabil. Der starke Rückgang der Figurenzahl wirkt als Folge von Standbildern abrupt, beweist aber ohne bekannte Aufnahmeabstände kein Verschwinden im laufenden Clip.

### `clip_ambient_etage2__f4.png`
Die Person am Schrank auf Etage 2 zieht den Blick zuerst an, weil Körper und Möbelkante ineinanderlaufen. Der Blick sollte auf die Figur selbst gehen, nicht auf einen möglichen Kollisionsfehler. Ihre Füße liegen zwar auf der richtigen Bodenhöhe, der Torso wirkt aber teilweise in das Möbel gestellt. Die beiden Figuren auf Etage 3 sind konsistent skaliert; gegenüber `clip_ambient_etage2__f3.png` treten wieder mehrere Akteure auf, ohne dass diese Stichprobe den Eintritt zeigt.

### `clip_ambient_etage3__f1.png`
Das Auge springt sofort zur verdichteten Gruppe rechts auf Etage 3, womit die Ziel-Etage zwar getroffen wird, aber die Silhouetten schlecht getrennt sind. Eine gehende und eine stehende Figur überdecken sich unmittelbar vor der Tür; der Türrahmen erzeugt zusätzlich eine dritte vertikale Kontur. Die Fußhöhen scheinen plausibel, sind in dieser Gruppe jedoch nicht für jede Figur eindeutig ablesbar. Die einzelne Figur auf Etage 4 und die Lobbyfigur sind sauber freigestellt und zeigen keine auffällige Maßstabsänderung.

### `clip_ambient_etage3__f2.png`
Die gehende Figur links der Mitte auf Etage 3 wird zuerst wahrgenommen und ist klarer lesbar als die Gruppe in `clip_ambient_etage3__f1.png`. Ihr Kopf liegt allerdings vor dem kleinen Wandbild, wodurch Kontur und Hintergrund zusammenfallen. Die Figur auf Etage 2 steht mit passender Fußhöhe auf ihrer Laufebene und entspricht ungefähr dem Maßstab der oberen Figur. Statische Elemente und Kamera bleiben fest; nur Figurenbelegung und Partikelpositionen ändern sich.

### `clip_ambient_etage3__f3.png`
Zuerst fällt die Figur am Wasserspender auf, allerdings wegen einer unplausiblen räumlichen Überschneidung. Körper und Spender beanspruchen dieselbe Fläche, sodass die Person eher im Gerät als davor oder daneben steht. Auch die Figur auf Etage 2 steht direkt im Türbereich, wodurch ihre Tiefenlage schwer lesbar wird. Die drei bewegten Figuren behalten untereinander einen plausiblen Maßstab und zeigen kein offensichtliches Schweben.

### `clip_ambient_etage3__f4.png`
Die einzelne gehende Figur auf Etage 3 ist klar freigestellt und bildet das richtige erste Blickziel. Ihre Füße sitzen auf derselben Laufkante wie Tür und Wasserspender; Schweben oder Einsinken ist nicht sichtbar. Gegenüber `clip_ambient_etage3__f3.png` sind die Figuren auf Etage 4 und 2 sowie die Person am Wasserspender nicht mehr vorhanden. Ob diese Figuren tatsächlich abrupt verschwinden oder zwischen den aufgenommenen Zeitpunkten regulär aus dem Bild gelaufen sind, ist aus dem Standbild nicht zu beurteilen.

## 2. **Konkrete Eingriffe je Screen**

### `clip_ambient_etage1__f1.png`
*Figurengruppe vor der linken Tür auf Etage 1 → die Personen horizontal um mindestens eine halbe Figurenbreite staffeln oder eine davon hinter dem Türrahmen verdecken → drei fast deckungsgleiche Silhouetten wirken wie ein fehlerhafter Mehrfach-Spawn.*  
*Gehende Figur auf Etage 3 → einen schmalen, dunklen Kontaktschatten direkt unter dem Fußanker ergänzen, nicht breiter als etwa die halbe Schulterbreite → die Bodenbindung wird trotz des kontrastarmen Flurbodens eindeutig.*  
*Laufspur der Figuren → auf ein gemeinsames horizontales Band entlang der Möbel-Fußpunkte begrenzen → dadurch bleiben Bodenhöhe und Perspektive über alle Etagen konsistent.*

### `clip_ambient_etage1__f2.png`
*Figur auf Etage 2 → den Fußanker exakt an der Unterkante des Laufbands halten und einen kleinen Kontaktschatten darunter setzen → aktuell ist sie plausibel platziert, aber ohne Schatten nur über die Pixelkante verankert.*  
*Türgruppe auf Etage 1 → die vordere Figur um etwa eine Schulterbreite nach rechts versetzen → Gesichter, Beine und Aktentaschen lassen sich dann getrennt erfassen.*  
*Ein- und Austrittspunkte → Figuren nur innerhalb einer türnahen Zone ein- oder ausblenden, nicht mitten auf freier Flurfläche → der Belegungswechsel zu `clip_ambient_etage1__f1.png` erhält eine räumliche Erklärung.*

### `clip_ambient_etage1__f3.png`
*Figur rechts auf Etage 1 → mindestens eine halbe Figurenbreite Abstand zur rechten Türkante halten → Silhouette und Türrahmen lesen sich dann als zwei Ebenen.*  
*Figur auf Etage 3 → nicht bis unmittelbar an den rechten Gebäudeschacht laufen lassen, sondern vor der letzten Wandachse wenden oder durch die Tür austreten → der Bewegungsweg endet sichtbar plausibel.*  
*Beide gehenden Figuren → identische Fußanker- und Schattenlogik verwenden → unterschiedliche Etagen wirken dann nicht wie getrennte Sprite-Systeme.*

### `clip_ambient_etage1__f4.png`
*Figur am Schrank auf Etage 2 → rechts neben den Schrank verschieben, mit mindestens einer halben Körperbreite freiem Abstand zur Seitenkante → der Torso wirkt derzeit in das Möbel eingesetzt.*  
*Figur auf Etage 3 → um ungefähr eine halbe Figurenbreite nach links oder rechts vom Wandbild abrücken → Kopf und Oberkörper verschmelzen momentan mit dessen Cyan-Kanten.*  
*Figur auf Etage 1 → den Fußschatten knapp oberhalb der vorderen Bodenkante platzieren und nicht auf die Wandfuge legen → die Standebene wird eindeutiger.*

### `clip_ambient_etage2__f1.png`
*Figurengruppe an der Tür auf Etage 2 → höchstens zwei Figuren gleichzeitig in der Türzone zulassen und die dritte um eine Körperbreite in den Flur setzen → Beine und Reihenfolge sind gegenwärtig kaum trennbar.*  
*Gehende Figur auf Etage 4 → einen schmalen Kontaktschatten mittig unter beiden Füßen ergänzen → die Figur steht zwar korrekt, erhält aber zu wenig Bodengewicht.*  
*Zwei Figuren rechts auf Etage 3 → ihren Abstand auf mindestens eine Figurenbreite erhöhen oder eine klar in der Tür verschwinden lassen → so entsteht kein zweites konkurrierendes Figurenpaar.*

### `clip_ambient_etage2__f2.png`
*Freie Figur auf Etage 2 → als primären Ambient-Akteur etwas kontrastreicher gegen die Rückwand absetzen, etwa durch eine dunklere Außenkontur an der hellen Hemdseite → sie geht trotz guter Position neben dem hellen Tür-NPC unter.*  
*Tür-NPC auf Etage 2 → hinter dem Türrahmen maskieren oder vollständig vor die Schwelle stellen → die aktuelle halbe Überdeckung lässt seine Tiefenlage offen.*  
*Figur auf Etage 3 → mindestens eine halbe Körperbreite vom Wandbild entfernt führen → Kopfkontur und Bildkante sollen sich während des Laufwegs nicht berühren.*

### `clip_ambient_etage2__f3.png`
*Figur auf Etage 4 → den sichtbaren Laufweg bis zur nächsten Tür führen und dort durch den Rahmen maskieren → damit erhält ein späteres Verschwinden einen nachvollziehbaren Endpunkt.*  
*Person in der Tür auf Etage 2 → Fußanker auf dieselbe Laufkante wie Schrank und Bank setzen, nicht auf die optisch weiter hinten liegende Türschwelle → Vorder- und Hintergrundebene bleiben so konsistent.*  
*Leere Flure auf Etage 2 und 3 → nicht gleichzeitig alle Ambientfiguren entfernen; wenigstens einen Akteur pro fokussierter Etage halten → der Wechsel zu `clip_ambient_etage2__f4.png` wirkt sonst wie globales Nachladen.*

### `clip_ambient_etage2__f4.png`
*Figur am Schrank auf Etage 2 → mindestens eine halbe Figurenbreite rechts vom Möbel platzieren oder korrekt davor rendern, einschließlich Überdeckung der Schrankfüße → aktuell liest sie sich als Kollision.*  
*Rechte Figur auf Etage 3 → vollständig vor die Türschwelle oder teilweise hinter den Türrahmen stellen → die jetzige Position zwischen beiden Ebenen ist räumlich unentschieden.*  
*Mittlere Figur auf Etage 3 → einen kleinen Fußschatten mit derselben Breite wie bei der Figur auf Etage 2 verwenden → die Figuren erhalten über die Etagen hinweg denselben Bodenkontakt.*

### `clip_ambient_etage3__f1.png`
*Figurengruppe rechts auf Etage 3 → die gehende Figur um mindestens eine Körperbreite nach links versetzen oder hinter dem Türrahmen maskieren → derzeit verschmelzen zwei Körper mit Rahmen und Türblatt.*  
*Figur auf Etage 4 → den Fußanker an der unteren Flur-Innenkante ausrichten und durch einen kurzen Schatten markieren → so bleibt die Standebene auch vor den vertikalen Wandpaneelen klar.*  
*Türgruppe auf Etage 1 → eine Figur aus der Türzone entfernen oder seitlich staffeln → die wiederkehrende Mehrfachbelegung erzeugt denselben Sprite-Stapel wie in `clip_ambient_etage1__f1.png`.*

### `clip_ambient_etage3__f2.png`
*Gehende Figur auf Etage 3 → eine halbe bis ganze Figurenbreite vom Wandbild abrücken → Kopf und Cyanmotiv bilden momentan eine unruhige gemeinsame Silhouette.*  
*Figur auf Etage 2 → auf dem Laufband halten und vor Erreichen der Pflanze beziehungsweise Tür eine definierte Wendeposition setzen → der freie Flur eignet sich als sauber lesbare Bewegungsstrecke.*  
*Stehende Figur rechts auf Etage 3 → entweder vollständig in den Türrahmen integrieren oder davor platzieren → der aktuelle Zwischenzustand wirkt wie eine falsch gesetzte Z-Ebene.*

### `clip_ambient_etage3__f3.png`
*Figur am Wasserspender auf Etage 3 → mindestens eine halbe Körperbreite rechts oder links neben das Gerät verschieben → Körper und Spender schneiden sich sichtbar.*  
*Figur in der Tür auf Etage 2 → weiter in den Flur setzen oder hinter dem Türblatt maskieren → die Figur steht derzeit ohne klare Tiefenordnung in der Schwelle.*  
*Figur auf Etage 4 → Laufweg so begrenzen, dass Kopf und rotes Wandobjekt nicht überlagert werden → die wichtigsten Sprite-Konturen bleiben dadurch frei.*

### `clip_ambient_etage3__f4.png`
*Gehende Figur auf Etage 3 → als Referenzposition beibehalten und ihre Fußhöhe als verbindlichen Anker für alle anderen Flurfiguren verwenden → diese Platzierung ist innerhalb der Serie am eindeutigsten geerdet.*  
*Stehende Figur rechts in der Tür → einen klaren Abstand von mindestens einer halben Figurenbreite zum Laufweg der gehenden Figur sichern → stehender NPC und Verkehrsspur bleiben getrennt.*  
*Ausgänge der nicht mehr sichtbaren Figuren → an Türen oder Fahrstuhl mit korrekter Rahmenmaskierung abwickeln → der Wechsel aus `clip_ambient_etage3__f3.png` wird dann auch in Bewegung räumlich nachvollziehbar.*

## 3. **Grafiken/Assets**

- Die Gebäudearchitektur bleibt innerhalb aller drei Reihen stabil: In `clip_ambient_etage1__f1.png` bis `clip_ambient_etage1__f4.png`, `clip_ambient_etage2__f1.png` bis `clip_ambient_etage2__f4.png` und `clip_ambient_etage3__f1.png` bis `clip_ambient_etage3__f4.png` springen weder Türen noch Möbel, Etagenkanten oder Gebäudeschächte. Auch eine ungewollte Kameraskalierung ist innerhalb der jeweiligen Viererreihe nicht sichtbar.
- Die bewegten Korridorfiguren entsprechen grundsätzlich der feinen, scharfen Pixel-Art aus `sprite-tool/public/context/game-style-guide.md`. Uneinheitlich wirken jedoch Konturstärke und Detaildichte: Die Lobbyfigur in `clip_ambient_etage1__f1.png` und `clip_ambient_etage3__f4.png` hat eine gröbere, dunklere Silhouette als viele Flurfiguren.
- Die Lobbyfigur ist sichtbar größer als die meisten Korridorfiguren. Wegen des perspektivisch tieferen Lobbybodens kann das korrekt sein, aber ohne Kontaktschatten oder deutlichere Tiefenstaffelung bleibt in `clip_ambient_etage2__f1.png` und `clip_ambient_etage3__f1.png` unklar, ob es Perspektive oder abweichende Asset-Skalierung ist.
- Die problematischsten Zuschnitte entstehen nicht am Bildrand, sondern durch Überlagerung: Schrank und Figur in `clip_ambient_etage1__f4.png` sowie `clip_ambient_etage2__f4.png`, Wasserspender und Figur in `clip_ambient_etage3__f3.png` und Türrahmen-Gruppen in `clip_ambient_etage3__f1.png`.
- Die weißen Partikel wechseln erwartbar ihre Position, erscheinen aber auch innerhalb der Flure. In sämtlichen Reihen ist deshalb nicht eindeutig, ob sie Staub, Schnee oder ein globaler atmosphärischer Filter sein sollen; als durchgehende Vordergrundebene schwächen sie die Trennung zwischen Innenraum, Skyline und Figuren.
- Am meisten fehlt ein einheitliches Kontakt-Asset: ein sehr kurzer, entsättigter Fußschatten beziehungsweise eine dunkle Kontaktpixelgruppe unter jeder bewegten Figur. Das würde besonders `clip_ambient_etage1__f2.png`, `clip_ambient_etage2__f3.png` und `clip_ambient_etage3__f4.png` erden, ohne die Pixelästhetik zu verändern.

## 4. **Raster & Rhythmus**

- Die horizontalen Bodenlinien sind in allen zwölf Dateien ein stabiles Raster. Die Figuren sollten technisch an eine gemeinsame Laufspur pro Etage gebunden werden, deren Fußanker sich an den Füßen von Bank, Schrank und Pflanzkübel orientiert; `clip_ambient_etage3__f4.png` liefert dafür die sauberste Referenz.
- Unruhe entsteht durch gleichzeitige Akteure auf mehreren Etagen, etwa in `clip_ambient_etage1__f4.png` und `clip_ambient_etage2__f1.png`. Ohne farbliche oder räumliche Hierarchie sind drei kleine Bewegungszentren gleichrangig, während der eigentliche Fokus unklar bleibt.
- Die wiederkehrenden Türgruppen in `clip_ambient_etage1__f1.png`, `clip_ambient_etage2__f1.png` und `clip_ambient_etage3__f1.png` verletzen den ansonsten großzügigen horizontalen Rhythmus. Zwischen zwei sichtbaren Figuren sollte mindestens eine halbe bis ganze Figurenbreite Luft liegen, sofern keine bewusste Interaktion gezeigt wird.
- Die großen freien Flurflächen in `clip_ambient_etage2__f3.png` sind nicht grundsätzlich tote Fläche; sie sind notwendiger Bewegungsraum. Tot wirken sie erst, wenn mehrere Etagen gleichzeitig geleert werden und kein klarer Ein- oder Austritt den Rhythmus erklärt.
- Der beige rechte Bedienrand überdeckt in allen Dateien den rechten Abschluss der unteren Statusleiste; der „PUBLIKUM“-Bereich ist sichtbar abgeschnitten. Bedienleiste und Weltansicht sollten eine gemeinsame rechte Bezugskante erhalten, statt dass die Seitenleiste über den unteren Balken gelegt wird.

## 5. **Lesbarkeit**

- Bei `clip_ambient_etage3__f3.png` musste ich zweimal hinsehen, um Figur und Wasserspender als zwei getrennte Elemente zu erkennen. Die Überschneidung ist stärker als jeder reine Kontrastmangel.
- Bei `clip_ambient_etage2__f4.png` und `clip_ambient_etage1__f4.png` ist nicht sofort erkennbar, ob die Person vor dem Schrank steht oder darin steckt. Ursache sind identische Bodenhöhe, fehlender Abstand und unklare Z-Sortierung.
- In `clip_ambient_etage1__f1.png` und `clip_ambient_etage2__f1.png` musste ich die Beine der Türgruppen einzeln verfolgen, um die Zahl der Figuren zu bestimmen. Das ist für kleine Ambientfiguren zu viel visuelle Entschlüsselungsarbeit.
- Die Etagen- und Raumbeschriftungen sind in allen Dateien kontrastreich, aber für die gezeigte Gesamtansicht sehr klein. Besonders „Direktor / Zentrale · Kurator“ und „Feld-Operationen · Katja“ konkurrieren mit Figurenköpfen und Türrahmen, statt als ruhige Orientierungsschicht zurückzutreten.
- Die untere Statuszeile ist in `clip_ambient_etage1__f1.png` bis `clip_ambient_etage3__f4.png` nur mit bewusstem Hinsehen lesbar. Schriftgröße und Laufweite liegen deutlich unter der visuellen Bedeutung der Leiste.
- Die rechte Tastenleiste zeigt kaum unterscheidbare Zustände. Das anders umrandete „A“ ist erkennbar, aber aktiv, neu und gesperrt lassen sich aus `clip_ambient_etage2__f2.png` oder `clip_ambient_etage3__f4.png` nicht sicher ableiten; Farbe allein ist dafür zu schwach.

## 6. **Die drei wirksamsten Änderungen**

1. **Einheitlichen Fußanker plus kleinen Kontaktschatten für alle bewegten Figuren einführen** → geringer Asset- und Implementierungsaufwand, aber sofort klarere Bodenbindung in allen zwölf Dateien.  
2. **Kollisions- und Ausschlusszonen um Türen, Schrank, Wasserspender und Wandbilder definieren** → beseitigt die auffälligsten räumlichen Fehler aus `clip_ambient_etage1__f4.png`, `clip_ambient_etage2__f4.png`, `clip_ambient_etage3__f1.png` und `clip_ambient_etage3__f3.png`.  
3. **Spawns und Despawns ausschließlich über sichtbar maskierte Türen oder den Fahrstuhl abwickeln** → verhindert, dass die starken Belegungswechsel zwischen den vier Zeitpunkten wie etagenweises Teleportieren oder Nachladen wirken.

## 7. **Blinde Flecken**

- Aus `clip_ambient_etage1__f1.png` bis `clip_ambient_etage3__f4.png` kann ich **nicht** beurteilen, ob die Bewegung flüssig, langsam und präzise ist, wie es `sprite-tool/public/context/game-style-guide.md` verlangt. Dafür fehlen direkt aufeinanderfolgende Frames oder die Videos.
- Nicht beurteilbar sind Gangzyklus, Fußrutschen, Beschleunigung, Wendepunkte, Frame-Timing, Animationsschleifen und mögliche Loop-Sprünge. Ein korrekt geerdeter Standframe kann während der eigentlichen Animation trotzdem vertikal hüpfen.
- Die zeitlichen Abstände zwischen `__f1` bis `__f4` sind nicht angegeben. Deshalb beweisen die sichtbaren Belegungswechsel weder Teleportation noch abruptes Verschwinden; zwischen zwei Proben könnten Figuren regulär durch Türen gegangen sein.
- Es ist nicht eindeutig erkennbar, welche ähnlich gekleideten Figuren über die Zeitpunkte hinweg dieselbe Identität haben. Ohne Actor-ID kann eine Größen- oder Positionsänderung nicht sicher von einem Austausch gegen einen anderen NPC unterschieden werden.
- Hover, aktiver Fokus, gesperrte Zustände und Eingabereaktionen der rechten Leiste sind aus den Standbildern nicht prüfbar.
- Benötigt werden je Clip ein kurzer Ausschnitt in Originalgeschwindigkeit, zusätzlich eine verlangsamte Version sowie Debug-Aufnahmen mit sichtbaren Fußankern, Laufspuren, Actor-IDs, Kollisionsboxen und Z-Sortierung. Für die Türprobleme wären außerdem direkt aufeinanderfolgende Frames vor, während und nach Eintritt beziehungsweise Austritt erforderlich.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
