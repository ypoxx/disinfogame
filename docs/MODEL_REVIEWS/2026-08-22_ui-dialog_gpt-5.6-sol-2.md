# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „dialog"

**Modell:** `gpt-5.6-sol` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-22
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-22T17:19:07.670Z · **Dauer:** 205.0 s
**Nutzung:** nicht gemeldet · **Kosten:** unbekannt · **Anbieter-Datensammlung:** ausgeschlossen (deny)

> ⚠️ **Wie das zu lesen ist:** Ein *fremdes* Modell hat einen **kuratierten Ausschnitt**
> des Projekts gesehen — nicht das laufende Spiel und nicht das ganze Repository. Es kann
> daher weder Laufzeitverhalten prüfen noch `file:line`-Belege verifizieren. Befunde sind
> **Hypothesen**, die vor dem Umsetzen am Code/an den Daten gegenzuprüfen sind. Die
> kanonische Wahrheit bleibt [`docs/VISION_LOCK.md`](../VISION_LOCK.md) bzw. die Spieldaten.

## Gestellte Frage

Sieh dir die beigefügten Screenshots des laufenden Spiels an und mache einen UX/UI-Durchgang. Die Optik soll eine Behörden-/Papierwelt sein (Stil-Anker und Farbtoken liegen bei). Sag mir: Wo führt das Bild den Blick falsch, welche Grafiken sitzen an der falschen Stelle oder in der falschen Größe, wo stimmen Abstände und Ausrichtung nicht, und welche drei Änderungen bringen am meisten? Sei so konkret, dass man es direkt umsetzen kann.

## Dieser Durchgang: Bündel „dialog" (6 Screenshots)

Das siehst du, in dieser Reihenfolge:
- direktor_intro.png — Kurator-/Direktor-Intro-Dialog direkt nach Vergabe (DialogBox + Porträt)
- dialog_alexei.png — Raum-Nahsicht + DialogBox: alexei (Porträt, Raum-Hintergrund, Mimik)
- dialog_marina.png — Raum-Nahsicht + DialogBox: marina (Porträt, Raum-Hintergrund, Mimik)
- dialog_katja.png — Raum-Nahsicht + DialogBox: katja (Porträt, Raum-Hintergrund, Mimik)
- dialog_direktor.png — Raum-Nahsicht + DialogBox: direktor (Porträt, Raum-Hintergrund, Mimik)
- dialog_igor.png — Raum-Nahsicht + DialogBox: igor (Porträt, Raum-Hintergrund, Mimik)

Beurteile **nur diese** Aufnahmen, dafür gründlich. Andere Teile des Spiels kommen in
eigenen Durchgängen dran — verweise nicht auf Dinge, die du hier nicht siehst.

## Gezeigter Ausschnitt

15.047 Zeichen ≈ 4.180 Tokens (geschätzt) aus 3 Quellen · 1 gekürzt

| Quelle | Modus | Zeichen | Status |
|---|---|---:|---|
| `sprite-tool/public/context/game-style-guide.md` | voll | 5.496 | vollständig |
| `desinformation-network/src/story-mode/theme.ts` | voll | 3.375 | vollständig |
| `desinformation-network/runs/visual-review/latest/manifest.json` | projektion | 6.176 | gekürzt |

### Gezeigtes Anschauungsmaterial (6 Screenshot(s))

| Art | Im Text genannt als | Datei | Größe |
|---|---|---|---:|
| 🖼 Bild | `direktor_intro.png` | `desinformation-network/runs/visual-review/latest/shots/direktor_intro.png` | 846 kB |
| 🖼 Bild | `dialog_alexei.png` | `desinformation-network/runs/visual-review/latest/shots/dialog_alexei.png` | 818 kB |
| 🖼 Bild | `dialog_marina.png` | `desinformation-network/runs/visual-review/latest/shots/dialog_marina.png` | 816 kB |
| 🖼 Bild | `dialog_katja.png` | `desinformation-network/runs/visual-review/latest/shots/dialog_katja.png` | 828 kB |
| 🖼 Bild | `dialog_direktor.png` | `desinformation-network/runs/visual-review/latest/shots/dialog_direktor.png` | 843 kB |
| 🖼 Bild | `dialog_igor.png` | `desinformation-network/runs/visual-review/latest/shots/dialog_igor.png` | 729 kB |

---

## Antwort des Modells

## 1. **Erster Eindruck**

### `direktor_intro.png`
Zuerst ziehen die leuchtende Weltkarte und das breite rote Kopfband den Blick an; Volkovs Gesicht folgt erst danach. Im Dialog sollte die Reihenfolge Gesicht → Sprechername → gesprochener Text sein. Der sehr helle HUD-Zeitblock oben rechts eröffnet zusätzlich eine konkurrierende Blickroute. Die Dialogfläche wirkt wegen ihrer nahezu bildschirmbreiten Ausdehnung und der einzelnen kurzen Zeile größtenteils leer. Die Raumgrafik vermittelt moderne Kommandozentrale, die Dialogbox dagegen eher ein flaches Softwarefenster als eine Behördenakte.

### `dialog_alexei.png`
Das Auge springt zunächst zwischen den vielen hellen Monitoren und Alexeis weiß hervorgehobenen Augen hin und her. Alexei sollte eindeutig der erste Fokus sein, danach Name und Dialogzeile; die Monitorwand darf nur Kontext liefern. Das olivbraune Kopfband verschmilzt farblich mit der Papierwelt, ohne wie Papier oder wie eine klare Akzentfläche zu wirken. Alexeis großes Porträt ist ausdrucksstark, wird aber unten beiläufig von der Box abgeschnitten und steht stilistisch etwas isoliert vor dem Raum. Die winzige Wiederholung seines Porträts im Kopfband trägt nichts zur Identifikation bei.

### `dialog_marina.png`
Das zentrale, stark gesättigte Poster ist der erste Blickfang, knapp vor Marinas Gesicht. Für einen Dialog ist das verkehrt: Marina und ihr Text sollten vor der Raumdekoration liegen. Ihr Kopf hebt sich ausreichend ab, die dunklen Haare gehen jedoch teilweise in Sofa und Pflanzen über. Das blaue Kopfband ist klarer als bei Alexei, wirkt aber wie ein digitales Statuspanel statt wie eine Akte. Die einzelne Regieanweisung sitzt verloren in einer viel zu großen Papierfläche.

### `dialog_katja.png`
Die großen cyanfarbenen Wandmonitore und der zentrale Kartentisch dominieren den Einstieg. Katjas Gesicht ist vergleichsweise klein und weit unten rechts positioniert, sodass es erst spät gefunden wird. Am problematischsten ist das helle Kopfband: weißer Name und weiße Rollenbezeichnung verlieren auf dem beigefarbenen Grund deutlich an Kontrast. Weil Kopfband und Textkörper fast dieselbe Fläche bilden, fehlt eine erkennbare Sprecherhierarchie. Der Screen wirkt dadurch unfertiger als die übrigen Dialoge, obwohl Raum und Porträt selbst ähnlich detailliert sind.

### `dialog_direktor.png`
Wie in `direktor_intro.png` konkurrieren Weltkarte, rotes Kopfband, rotes Warnlicht und Vorhang gleichzeitig um Aufmerksamkeit. Volkovs Gesicht liegt direkt in dieser roten Vertikalzone und wird eher Teil der Raumdekoration als klar freigestellter Sprecher. Der Text ist zwar kontrastreich, aber gegenüber der Größe des Panels zu klein und zu weit unten in der Hierarchie. Das breite rote Band ist als Ministeriums-Kopfband grundsätzlich mit `desinformation-network/src/story-mode/theme.ts` vereinbar, nimmt hier aber zu viel visuelles Gewicht ein. Die Szene braucht weniger konkurrierendes Rot und eine eindeutigere Verbindung zwischen Porträt und Dialog.

### `dialog_igor.png`
Zuerst fallen die cyanfarbene Lampe, der Monitor und die zentral platzierte Tresortür auf; Igor folgt wegen seines hellen Gesichts danach. Der Raum ist weniger überladen als Alexeis oder Katjas Büro, trotzdem sitzt der Sprecher zu weit am rechten unteren Rand und ohne klare visuelle Anbindung an seinen Namen. Das dunkelblaue Kopfband ist gut abgesetzt, fügt sich aber ebenfalls eher in eine digitale UI als in eine Papierakte ein. Regieanweisung, gesprochener Satz und Schreibcursor laufen typografisch ohne Trennung ineinander. Die große leere Fläche unter der ersten Zeile schwächt den Eindruck eines präzise gesetzten Dokuments.

---

## 2. **Konkrete Eingriffe je Screen**

### `direktor_intro.png`

- Weltkarte in `direktor_intro.png` → während des Dialogs Helligkeit und Cyan-Sättigung um etwa ein Fünftel reduzieren, ohne sie weichzuzeichnen → die Karte bleibt Kontext, konkurriert aber nicht mehr mit Gesicht und Text.
- Volkov-Porträt in `direktor_intro.png` → um etwa eine halbe Gesichtsbreite nach links versetzen und die Augenlinie auf die gemeinsame Porträt-Achse aller Dialoge legen → Gesicht, roter Vorhang und Warnlampe bilden dann keinen gedrängten roten Randcluster.
- Rotes Kopfband in `direktor_intro.png` → um rund ein Viertel niedriger machen; Name und Funktion vertikal enger gruppieren → die rote Fläche bleibt Ministeriums-Akzent, dominiert aber nicht mehr das untere Bilddrittel.
- Miniaturporträt in `direktor_intro.png` → entfernen und Name sowie Funktion an derselben linken Kante wie den Dialogtext beginnen lassen → die unleserliche Doppelung entfällt und das Dokument erhält eine klare Satzkante.
- HUD in `direktor_intro.png` → bei geöffnetem Dialog auf ungefähr ein Drittel seiner normalen Deckkraft absenken → der helle Zeitblock eröffnet sonst eine zweite, sachlich irrelevante Blickroute.

### `dialog_alexei.png`

- Monitorflächen in `dialog_alexei.png` → die hellsten Cyan- und Weißwerte während des Dialogs um etwa 15–20 % absenken, besonders in der linken und mittleren Monitorgruppe → Alexeis helle Augen werden zum eindeutigen Fokus statt nur zu einem weiteren Leuchtpunkt.
- Alexei-Porträt in `dialog_alexei.png` → geringfügig vergrößern und so verschieben, dass seine Augen auf derselben Höhe und sein äußerer Schulterrand an derselben rechten Achse wie Marina und Volkov liegen → die wechselnden Porträtgrößen wirken derzeit zufällig.
- Olivfarbenes Kopfband in `dialog_alexei.png` → auf den dunklen Kraftpapier-Träger `darkConcrete` umstellen; Oliv nur als schmale Registerlasche oder kleiner Rollenstempel einsetzen → das entspricht der Papierlogik aus `desinformation-network/src/story-mode/theme.ts`.
- Miniaturporträt in `dialog_alexei.png` → entfernen; „Alexei Petrov“ und „Technischer Leiter“ links mit der Textspalte ausrichten → das große Porträt identifiziert ihn bereits deutlich besser.
- Textkörper in `dialog_alexei.png` → Höhe um etwa ein Fünftel reduzieren und die Textbreite auf ungefähr drei Viertel des Panels begrenzen → die einzelne Zeile sitzt dann nicht in einer fast leeren, bildschirmbreiten Fläche.

### `dialog_marina.png`

- Poster in `dialog_marina.png` → Rot und Cyan um etwa ein Fünftel entsättigen und den hellen Wandschein dahinter leicht zurücknehmen → das Poster ist momentan stärker als Marinas Gesicht.
- Marina-Porträt in `dialog_marina.png` → um wenige Prozent nach links setzen oder mit einer ein bis zwei Bildpunkte breiten warmen Lichtkante an Haar und rechter Schulter versehen → die dunkle Silhouette trennt sich dann vom Sofa und den Pflanzen.
- Blaues Kopfband in `dialog_marina.png` → durch dunkles Kraftpapier ersetzen; Blau nur als schmale seitliche Aktenlasche oder Unterstreichung des Namens verwenden → die Fläche liest sich dann als Behördenakte statt als Software-Kategorie.
- Regieanweisung in `dialog_marina.png` → in einer eigenen Zeile in `textSecondary`, leicht kleiner als die Rede und mit Abstand darunter oder danach setzen → Sternchen, Text und Cursor sind aktuell ein einziger schwer lesbarer Block.
- Dialogbox in `dialog_marina.png` → oberen Rand etwas nach unten setzen und die Gesamthöhe um etwa 15–20 % reduzieren → mehr vom charakteristischen Raum bleibt sichtbar und die Leerfläche unter dem Satz schrumpft.

### `dialog_katja.png`

- Kopfband in `dialog_katja.png` → sofort auf dunkles Kraftpapier mit heller Schrift umstellen oder, falls der helle Grund bleiben muss, Name und Funktion in `textPrimary` setzen → die aktuelle weiße Schrift auf Beige ist der deutlichste Kontrastfehler des Bündels.
- Katja-Porträt in `dialog_katja.png` → um etwa 8–10 % vergrößern und nach rechts auf dieselbe Außenkante wie Marina und Igor schieben → Katja wirkt derzeit kleiner und vom gemeinsamen Porträtraster abgekoppelt.
- Wandmonitore in `dialog_katja.png` → Cyan-Leuchtdichte während des Dialogs um etwa ein Fünftel senken, besonders in der oberen Bildmitte → die Bildführung beginnt sonst außerhalb des Dialogs.
- Rechtes Poster in `dialog_katja.png` → entweder etwas abdunkeln oder Katjas Porträt so verschieben, dass keine geometrischen Formen unmittelbar an Kopf und Schulter anschließen → die Konturen konkurrieren dort um dieselbe Fläche.
- Sprecherblock in `dialog_katja.png` → Miniatur entfernen und Name, Rolle sowie Dialogtext an einer gemeinsamen linken Satzkante ausrichten → der aktuelle Sprung von Miniatur zu Name und zurück zum weiter links beginnenden Text zerlegt die Gruppe.

### `dialog_direktor.png`

- Weltkarte in `dialog_direktor.png` → denselben Dialog-Dimmzustand wie in `direktor_intro.png` verwenden; Diagramme und Küstenlinien um etwa ein Fünftel zurücknehmen → der Raum muss nicht in jedem Gespräch die visuelle Hauptrolle behalten.
- Volkov-Porträt in `dialog_direktor.png` → nach links aus der Vorhang-/Warnlichtachse ziehen und mit identischer Größe und Position wie in `direktor_intro.png` verankern → derselbe Sprecher darf zwischen zwei Screens nicht nur zufällig gleich aussehen, sondern muss komponentenseitig fest sitzen.
- Rotes Kopfband in `dialog_direktor.png` → niedriger machen und ober- sowie unterhalb des Sprecherblocks gleich große Innenabstände setzen → die jetzige Fläche ist erheblich höher als ihr Inhalt.
- Miniaturporträt in `dialog_direktor.png` → entfernen; Sprechername links an der Textkante beginnen lassen → das kleine Bild ist nicht ausdrucksfähig und dupliziert das große Porträt.
- Roter Vorhang und Warnlicht in `dialog_direktor.png` → ihre Sättigung im Dialogzustand leicht reduzieren, das Ministeriumsrot im Kopfband dagegen unverändert lassen → so bleibt Rot hierarchisch an die UI gebunden.

### `dialog_igor.png`

- Cyanlampe und Monitor in `dialog_igor.png` → im Dialogzustand um etwa 15–20 % abdunkeln → die beiden Lichtquellen ziehen aktuell vor Igor den Blick an.
- Igor-Porträt in `dialog_igor.png` → etwas nach rechts und geringfügig größer setzen, bis Augenhöhe und rechte Außenkante dem gemeinsamen Porträtraster entsprechen → er wirkt derzeit kleiner und weiter innen platziert als Marina oder Volkov.
- Blaues Kopfband in `dialog_igor.png` → wie bei Alexei und Marina auf Kraftpapier vereinheitlichen; Blau nur als Aktenregister oder kleiner Fachbereichsstempel verwenden → die wechselnden Vollflächenfarben verhindern eine stabile Dialogkomponente.
- Regieanweisung in `dialog_igor.png` → „*runzelt die Stirn*“ als sekundäre, abgesetzte Zeile setzen und „Suboptimal.“ als eigentliche Rede darunter beginnen → momentan muss man zweimal lesen, wo Handlung endet und Rede beginnt.
- Schreibcursor in `dialog_igor.png` → mit einem kleinen optischen Abstand hinter dem letzten Buchstaben platzieren und schmaler darstellen → der Cursor sieht aktuell wie ein weiterer Buchstabenstrich aus.

---

## 3. **Grafiken/Assets**

- `direktor_intro.png` und `dialog_direktor.png`: Die Kommandozentrale trägt den modernen Beton-/Glas-/Stahl-Look aus `sprite-tool/public/context/game-style-guide.md`. Weltkarte, Schreibtisch und abstraktes Poster sind scharf und stilistisch kohärent. Zu dominant sind die großflächige Cyan-Karte und die Kombination aus rotem Vorhang, Warnlicht und rotem Dialogkopf. Volkovs Porträt passt in Schärfe und realistischer Proportion gut zum Raum, sitzt aber ungünstig direkt in dieser roten Zone.
- `dialog_alexei.png`: Server, Kabeltrassen und Monitorgruppen identifizieren den Technikraum sofort. Die Wiederholung ähnlicher Arbeitsplätze an beiden Bildrändern macht den Hintergrund allerdings visuell lauter als nötig. Alexeis Porträt ist nicht sichtbar schlechter aufgelöst, hat aber größere Anime-Augen, violett-blaue Konturen und eine andere Gesichtsüberzeichnung als Volkov und Igor; das wirkt wie ein anderer Porträtsatz.
- `dialog_marina.png`: Raumbeleuchtung, Sofa, Pflanzen und Medienarbeitsplatz ergeben die klarste zonenspezifische Atmosphäre des Bündels. Das Poster ist zu gesättigt und zu zentral, Marinas dunkle Kontur verliert sich teilweise im Sofa. Ihr Gesicht wirkt glatter und weniger hart gepixelt als Alexeis Haare oder Igors Gesicht; Pixelraster, Konturstärke und Hautschattierung sollten auf einen gemeinsamen Standard gebracht werden.
- `dialog_katja.png`: Der Operationsraum trägt durch Kartentisch, Funktechnik und Wandmonitore. Er ist aber der detailreichste Hintergrund und lässt Katjas kleineres Porträt untergehen. Der Porträtzuschnitt lässt deutlich mehr ungenutzten Raum rechts als bei den anderen Figuren; das ist eher ein Platzierungs- als ein Auflösungsproblem.
- `dialog_igor.png`: Tresortür, Zählgerät, Akten und Monitor geben Igor einen spezifischen, glaubwürdigen Raum. Der Screen hat eine bessere Flächenruhe als Alexeis oder Katjas Raum, wird aber von der Cyanlampe unnötig angeführt. Igors Porträt ist scharf, besitzt jedoch eine realistischere Gesichtsgeometrie und andere Hautschattierung als Alexei und Marina.
- Alle sechs Screens: Die kleinen Kopfbandporträts sind durch die starke Verkleinerung matschig und mimisch nutzlos. Sie wirken wie automatisch heruntergerechnete Assets und sollten nicht neben den großen Porträts bestehen bleiben.
- Allen sechs Screens fehlt an der Dialogbox die eigentliche Materialgrafik der „Behörden-Akte“: Unter die Cremefläche gehört eine leicht versetzte Kraftpapier-Rücklage, dazu eine klar erkennbare Registerlasche am Kopf und eine sehr zurückhaltende Papierfaserung. Die Textzone selbst muss ruhig bleiben; keine starke Körnung direkt unter den Buchstaben.

---

## 4. **Raster & Rhythmus**

- Die Dialogbox nimmt in allen sechs Screens ungefähr das untere Viertel ein, nutzt davon aber meist nur eine einzige Zeile. Für den gezeigten Zustand sollte sie etwa 15–20 % niedriger sein und Platz für drei gut gesetzte Textzeilen behalten.
- Die Box klebt mit sehr kleinen Außenrändern fast an beiden Bildschirmkanten. Für die Aktenwirkung sollte sie auf ungefähr 92–94 % der Bildschirmbreite begrenzt und horizontal zentriert werden; die sichtbare Kraftpapier-Rücklage kann leicht nach rechts unten versetzt sein.
- Miniatur, Name und Dialogtext besitzen drei unterschiedliche linke Bezugskanten. Nach Entfernen der Miniatur sollten Sprechername, Funktion und Text exakt auf einer gemeinsamen Satzkante beginnen.
- Der rechte Innenabstand des Schließen-Symbols ist nicht auf die linke Satzkante bezogen. Das Symbol sollte denselben optischen Randabstand zur rechten Panelkante erhalten wie der Text links zur linken Panelkante.
- Die Kopfzeilen sind gemessen am zweizeiligen Inhalt zu hoch. Eine Reduktion um ungefähr ein Viertel schafft ein dichteres, formularartiges Verhältnis und gibt dem Raum mehr Höhe.
- `dialog_katja.png` bricht als einziger Screen die Trennung zwischen Kopfband und Papierkörper fast vollständig auf. Diese Ausnahme erzeugt keine sinnvolle Charaktercodierung, sondern sieht wie ein fehlender Hintergrundzustand aus.
- Die großen Porträts folgen keinem ausreichend strengen Raster: Augenhöhe, sichtbare Gesichtsgröße und rechte Außenkante variieren. Eine feste Porträtzone im rechten Fünftel des Bildes sollte Augenlinie und Außenkante definieren; die einzelnen Assets werden innerhalb dieser Zone skaliert, nicht frei platziert.
- Der Körperanschnitt an der Dialogkante wirkt momentan technisch verdeckt. Entweder müssen alle Büsten mit ihrer Schulterbasis exakt auf dem oberen Boxrand enden oder sie müssen sichtbar und einheitlich vor einer schmalen Aktenlasche liegen; das jetzige „irgendwo hinter dem Panel verschwinden“ ist zu beiläufig.
- Die drei HUD-Blöcke oben rechts bilden kein sauberes Cluster: Zwischen Uhr und Menü bleibt deutlich mehr Raum als zwischen Menü und HUD-Schalter. Während eines Dialogs sollte das gesamte Cluster ohnehin als eine gedimmte Gruppe behandelt werden.

---

## 5. **Lesbarkeit**

- Der Fließtext ist auf dem Cremegrund grundsätzlich kontrastreich, aber im Verhältnis zur Bildschirmbreite und zur großen freien Fläche zu klein. Eine Vergrößerung um etwa 10–15 % bei etwas höherem Zeilenabstand würde die Lesegeschwindigkeit verbessern, ohne den Pixelcharakter aufzugeben.
- Die Rollenbezeichnungen sind in allen Screens zu klein. Besonders „Verbindung zur Zentrale“ in `direktor_intro.png` und `dialog_direktor.png` sowie „Medien-Spezialistin“ in `dialog_marina.png` musste ich bewusst nachlesen; sie sollten etwa ein Fünftel größer und nicht zusätzlich durch zu weite Laufweite geschwächt werden.
- `dialog_katja.png` hat mit „Katja Orlova“ und „Feld-Operateurin“ auf hellem Beige den klarsten Kontrastfehler. Entweder dunkle Tinte auf hellem Papier oder helle Schrift auf dunklem Kraftpapier, nicht helle Schrift auf hellem Papier.
- `dialog_marina.png` und `dialog_igor.png` vermischen Regieanweisung und gesprochene Sprache. Sternchen allein reichen in der Pixelschrift nicht als Hierarchie; Farbe, eigene Zeile und vertikaler Abstand müssen diese Zustände trennen.
- Der Schreibcursor klebt in allen sechs Screens direkt am letzten Zeichen. In `dialog_igor.png` ist kaum erkennbar, ob nach „M“ ein Cursor oder ein weiteres Glyph steht; in `dialog_marina.png` verschmilzt er mit dem schließenden Sternchen.
- Das kleine „X“ rechts im Kopfband ist als einzig sichtbare Dialogaktion zu klein und semantisch schwach. Es sollte etwa ein Drittel größer werden, mittig in einer klaren quadratischen Bedienfläche sitzen und einen sichtbaren Fokus-/Hoverzustand besitzen.
- Die Namensschrift ist ausreichend markant, aber die breite Arcade-Anmutung von `Press Start 2P` wirkt eher spielig als behördlich. Wenn die Schrift beibehalten wird, sollte sie nur für den Namen gelten; Funktion, Regie und Text brauchen die ruhigere Schreibmaschinenhierarchie.
- Aktiv-, gesperrt- oder neu-Zustände sind auf diesen sechs Bildern nicht dargestellt. Beurteilbar ist lediglich der laufende Schreibzustand; auch hier fehlt ein erkennbarer Unterschied zwischen „Text schreibt noch“ und „bereit zum Fortfahren“.

---

## 6. **Die drei wirksamsten Änderungen**

1. **Gemeinsame Dialogkomponente auf ein festes Aktenraster umbauen** — dunkler Kraftpapier-Kopf, cremefarbenes Blatt, niedrigere Kopfzeile, gemeinsame linke Satzkante und korrekter Katja-Kontrast beheben mit einer Komponentenänderung die meisten sichtbaren Inkonsistenzen.
2. **Im Dialogzustand Raum und HUD gezielt abdunkeln** — ein leichter, scharfer Overlay ohne Blur verschiebt den Fokus sofort von Monitoren, Postern und Uhr auf Porträt und Text.
3. **Porträts normieren und die Miniaturbilder entfernen** — identische Augenhöhe, Gesichtsgröße und rechte Außenkante erzeugen eine stabile visuelle Bühne; die unleserliche Doppelung im Kopfband entfällt.

---

## 7. **Blinde Flecken**

- Alle sechs Aufnahmen zeigen den Text mitten in der Schreibanimation. Es fehlen Screenshots nach vollständiger Ausgabe, besonders mit drei oder mehr Zeilen, um Umbruch, Maximalhöhe und Fortfahren-Zustand zu beurteilen.
- Die Blinkfrequenz und Form des Schreibcursors sind auf Standbildern nicht bewertbar.
- Es ist nicht erkennbar, ob Porträts beim Sprecherwechsel einblenden, springen, die Mimik wechseln oder statisch stehen. Dafür werden mindestens zwei aufeinanderfolgende Frames derselben Figur benötigt.
- Hover-, Tastaturfokus- und gedrückter Zustand des Schließen-Symbols fehlen. Ebenso ist nicht sichtbar, ob Klick, Leertaste oder eine andere Eingabe den Dialog fortsetzt.
- Ob HUD und Raum während des Dialogs weiterhin bedienbar sind, lässt sich aus den Bildern nicht ableiten. Dafür wäre ein Screenshot mit Hover über einem Hintergrund- oder HUD-Element bei geöffnetem Dialog nötig.
- Die Screens zeigen nur eine Auflösung und ein Seitenverhältnis. Für kleinere Breiten werden Aufnahmen mit langem Namen, langer Rollenbezeichnung und vollständig gefülltem Dialogtext benötigt.
- Kein Bild zeigt den Zustand unmittelbar vor oder nach dem Dialog. Daher ist nicht beurteilbar, ob die Box räumlich sauber ein- und ausfährt oder beim Umschalten sichtbar springt.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
