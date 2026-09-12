# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „dialog"

**Modell:** `gpt-5.6-sol` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-22
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-22T17:09:26.285Z · **Dauer:** 211.2 s
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
| 🖼 Bild | `dialog_alexei.png` | `desinformation-network/runs/visual-review/latest/shots/dialog_alexei.png` | 779 kB |
| 🖼 Bild | `dialog_marina.png` | `desinformation-network/runs/visual-review/latest/shots/dialog_marina.png` | 783 kB |
| 🖼 Bild | `dialog_katja.png` | `desinformation-network/runs/visual-review/latest/shots/dialog_katja.png` | 715 kB |
| 🖼 Bild | `dialog_direktor.png` | `desinformation-network/runs/visual-review/latest/shots/dialog_direktor.png` | 760 kB |
| 🖼 Bild | `dialog_igor.png` | `desinformation-network/runs/visual-review/latest/shots/dialog_igor.png` | 689 kB |

---

## Antwort des Modells

## 1. **Erster Eindruck**

### `direktor_intro.png`
Das Auge springt zuerst auf die leuchtende Cyan-Weltkarte und danach auf das breite rote Kopfband der DialogBox. Zuerst erfassen sollte man Volkovs Gesicht, anschließend Sprechername und Dialogtext. Das gelingt nicht, weil Volkov ungewöhnlich tief und klein sitzt; sichtbar ist nur ein schmaler Oberkörper unmittelbar über der DialogBox. Gegenüber `dialog_direktor.png` wirkt dieselbe Figur dadurch wie falsch verankert statt bewusst inszeniert. Die cremefarbene Textfläche vermittelt Papier, das glatte vollflächige Rot dagegen eher Alarmleiste als Behördenakte.

### `dialog_alexei.png`
Zuerst fallen die sechs hellen Monitore links und in der Mitte auf, erst danach Alexeis große Augen und sein Gesicht. Eigentlich sollte die Reihenfolge Gesicht → Name → gesprochener Text sein. Die Mimik ist deutlich, muss aber gegen drei ähnlich gewichtete Monitorgruppen und die Cyan-Beleuchtung kämpfen. Das breite olivfarbene Sprecherband wird zur dritten großen Farbfläche, obwohl es nur Metadaten enthält. Der fast schwarze Verlauf über dem Boden beruhigt das Bild nicht, sondern erzeugt zwischen Raum und DialogBox eine breite tote Zone.

### `dialog_marina.png`
Das Auge landet zunächst auf der hellen Wand- und Sofazone in der Bildmitte, dann auf Marinas Gesicht und dem geometrischen Poster. Marina ist besser freigestellt als Alexei, dennoch konkurrieren Poster, Monitore und Pflanzen mit ihrer Silhouette. Der große blaue Sprecherbalken zieht danach stärker als der eigentliche Dialogtext. Die warme, gepflegte Raumstimmung passt zur Medienzone, wirkt aber deutlich glatter und weniger pixelpräzise als die strengeren Räume. Die Figur steht zudem dicht vor mehreren Pflanzenkonturen, wodurch ihr rechter Umriss unruhig wird.

### `dialog_katja.png`
Zuerst zieht die dichte Geräte- und Tischlandschaft im oberen Bilddrittel den Blick an, danach Katjas Gesicht. Die Sprecherkennung sollte anschließend sofort funktionieren, scheitert aber am weißen Text auf dem sehr hellen beigen Kopfband. Auch das weiße Schließen-„X“ ist dort fast unsichtbar. Die große dunkle Bodenfläche zwischen Arbeitstischen und DialogBox wirkt wie ungenutzter Leerraum, nicht wie räumliche Tiefe. Zusätzlich widerspricht die sichtbare stehende Pose dem Text „*lehnt am Tisch*“, weil Katja weit rechts und klar vom Tisch getrennt steht.

### `dialog_direktor.png`
Die Cyan-Weltkarte und das rote Kopfband sind die beiden stärksten Flächen; Volkovs Gesicht kommt erst danach. Anders als in `direktor_intro.png` besitzt die Figur hier die richtige Bühnenpräsenz und eine nachvollziehbare Größe. Sie sitzt jedoch eng zwischen rotem Vorhang, HUD und rechtem Rand, wodurch dort ein überladenes vertikales Band entsteht. Das Rot darf als Ministeriums-Kopfband auftreten, nimmt in dieser Höhe aber mehr Gewicht ein als Sprechername und Dialog benötigen. Der dunkle Bodenverlauf trennt die Figur zwar vom Raum, verschluckt zugleich aber einen großen Teil der räumlichen Information.

### `dialog_igor.png`
Zuerst fällt Igors helles Gesicht auf, unmittelbar danach die zentrale Tresortür und der cyan leuchtende Monitor. Diese Reihenfolge ist näher am gewünschten Dialogfokus als bei Alexei oder Katja. Die breite blaue Sprecherleiste übernimmt anschließend jedoch zu viel Gewicht und wirkt eher wie eine digitale Statusleiste als ein Aktenreiter. Igors Außenkontur ist schärfer und dunkler als die Kanten des Raums, wodurch er leicht aufgeklebt erscheint. Die Aktenschränke, Zählmaschine und Tresortür vermitteln den Finanzkontext gut, werden im unteren Bereich aber unnötig von der starken Abdunklung abgeschnitten.

## 2. **Konkrete Eingriffe je Screen**

### `direktor_intro.png`
- Volkov-Figur → um etwa zwei Kopfhöhen nach oben setzen und auf dieselbe Kopfgröße wie in `dialog_direktor.png` bringen; die Unterkante darf hinter der DialogBox verschwinden → beseitigt den auffälligen Maßstabs- und Verankerungsfehler.
- Cyan-Weltkarte → Leuchtdichte und Sättigung um etwa ein Fünftel reduzieren, besonders in den Kartenlinien → verhindert, dass der Hintergrund vor Gesicht und Text gelesen wird.
- Rotes Sprecherkopfband → ungefähr ein Fünftel niedriger machen und Name, Funktion sowie ID-Porträt vertikal enger gruppieren → Rot bleibt als Ministeriums-Kopfband erhalten, dominiert aber nicht das gesamte untere Bilddrittel.
- Textblock → linke Kante unter „Kurator Volkov“ statt unter dem ID-Porträt beginnen lassen und die Zeilenbreite auf ungefähr zwei Drittel der DialogBox begrenzen → schafft eine klare Textachse und besser lesbare Zeilen.
- HUD oben rechts → während des Dialogs deutlich abdunkeln oder auf etwa halbe Deckkraft setzen → Uhr, Menü und Alarmleuchte konkurrieren sonst mit Volkovs Gesicht.

### `dialog_alexei.png`
- Monitorflächen im Hintergrund → sämtliche Cyan-/Weißwerte um etwa ein Viertel abdunkeln, die mittlere Monitorgruppe etwas stärker als die äußeren → Alexeis Gesicht wird zum ersten Blickziel.
- Alexei-Figur → um ungefähr eine halbe Schulterbreite nach links versetzen → löst ihn vom rechten HUD-Block und nutzt seine nach links gerichtete Mimik besser.
- Unterer Raumverlauf → die fast schwarze Fläche zurücknehmen und stattdessen den gesamten Raum gleichmäßig leicht abdunkeln; nur hinter Alexei eine lokale Vignette belassen → reduziert tote Fläche, ohne die Figur wieder im Raum zu verlieren.
- Olivfarbenes Sprecherband → auf Kraftpapier wechseln und Oliv nur als schmalen Aktenreiter beziehungsweise Stempel neben dem Namen verwenden → entspricht der in `desinformation-network/src/story-mode/theme.ts` definierten Rolle von Oliv als Tinte statt Vollfläche.
- Regieanweisung im Text → „*blickt vom Terminal auf*“ in einer eigenen, sekundär gefärbten Zeile vor der wörtlichen Rede setzen → Handlung und Gesprochenes sind aktuell nur durch Sternchen unterscheidbar.

### `dialog_marina.png`
- Marina-Figur → um etwa eine halbe Figurenbreite nach links rücken → trennt ihre Schulter- und Armkontur von den Pflanzen am rechten Rand.
- Pflanzen hinter Marina → die kleinere Pflanze hinter ihrem Oberkörper weiter nach rechts oder tiefer setzen, sodass keine Blätter in ihre Silhouette laufen → verbessert die Figur-Grund-Trennung.
- Poster und Monitore → Türkis und Rot um ungefähr ein Fünftel entsättigen; die helle Wand darf erhalten bleiben → der Medienraum bleibt warm, ohne drei konkurrierende Akzentzentren zu bilden.
- Blaues Sprecherband → Papiergrund verwenden und Blau auf einen schmalen linken Reiter mit ID-Foto, Name und Funktion begrenzen → lässt die DialogBox wie eine Akte statt wie ein digitales Dashboard erscheinen.
- Marina-Asset → Pixelkanten und Schattierungsstufen an Katja beziehungsweise Volkov angleichen, insbesondere im Gesicht und an den Haaren → die derzeit weichere Illustration wirkt gegenüber dem Raum anders gerendert.

### `dialog_katja.png`
- Name, Funktion und Schließen-„X“ → auf dem hellen Kopfband von Weiß auf dunkle Tinte, vorzugsweise `#2B2620`, wechseln → diese drei Elemente sind im aktuellen Zustand kontrastarm.
- Katja-Figur und Pose → um etwa eine Figurenbreite nach links an die rechte Kante des Mitteltischs setzen und eine tatsächliche Anlehnpose verwenden; alternativ die Regieanweisung ändern → Bild und Text widersprechen sich derzeit sichtbar.
- Gerätezone oben → hellste Displays und Cyan-Akzente um etwa ein Fünftel dimmen → die kleinteilige Techniklandschaft zieht den Blick vor Katjas Gesicht.
- Bodenverlauf → Abdunklung später beginnen lassen und weniger stark auslaufen lassen → erhält die Bodenlinien als Blickführung zum Tisch, statt die untere Raumhälfte zu einer grauschwarzen Leere zu machen.
- Textblock → an der linken Kante des Namens ausrichten und mit einer festen, kürzeren Lesespalte versehen → beendet die konkurrierenden Achsen von ID-Porträt, Name und Fließtext.

### `dialog_direktor.png`
- Volkov-Figur → um etwa eine halbe Schulterbreite nach links rücken → schafft Abstand zum roten Vorhang und entlastet die bereits mit HUD belegte rechte Spalte.
- Weltkarte → Cyan-Leuchtkraft um ungefähr ein Fünftel reduzieren und den hellsten Bereich hinter Volkov vermeiden → die Karte soll Kontext liefern, nicht das Gesicht überstrahlen.
- Rotes Kopfband → Höhe um etwa ein Fünftel reduzieren, während das Ministeriums-Rot unverändert bleibt → bewahrt die Hierarchie des Direktors, verringert aber die Alarmwirkung.
- Unterer Raumverlauf → weniger Schwarz verwenden und die Schreibtisch- sowie Bodenstruktur bis näher an die DialogBox sichtbar lassen → beseitigt die breite, funktionslose Dunkelzone.
- HUD → im Dialogzustand abdunkeln und seine rechte Außenkante exakt an die rechte Außenkante der DialogBox koppeln → erzeugt eine gemeinsame Randachse und weniger Konkurrenz.

### `dialog_igor.png`
- Tresortür → Kontrast an Rahmen, Nieten und Tastenfeld leicht reduzieren → die zentrale Tür ist derzeit beinahe so präsent wie Igors Gesicht.
- Igor-Figur → um ungefähr eine halbe Schulterbreite nach links setzen → bindet ihn stärker an Schreibtisch und Tresor, statt ihn isoliert am rechten Rand stehen zu lassen.
- Figurenkontur → schwarze Außenkante etwas dünner beziehungsweise weniger kontrastreich ausführen und die Pixelstufung an den Raum angleichen → Igor wirkt momentan wie eine separate Illustrationsschicht.
- Blaues Sprecherband → auf Papierfläche umstellen und Blau nur für Aktenreiter, Namensunterstreichung oder Stempel einsetzen → setzt die Farbrolle aus `desinformation-network/src/story-mode/theme.ts` konsistenter um.
- ID-Porträt → statt der stark verkleinerten Ganzfigur einen festen Kopf-Schulter-Ausschnitt verwenden → Gesicht und Brille bleiben auch in der kleinen Sprecherkennung lesbar.

## 3. **Grafiken/Assets**

- Die Raumhintergründe in `direktor_intro.png`, `dialog_alexei.png`, `dialog_katja.png`, `dialog_direktor.png` und `dialog_igor.png` tragen durch klare Funktionsobjekte: Weltkarte und roter Vorhang, Monitorcluster, Einsatztisch, Tresortür, Aktenschränke und Zählmaschine. Die Räume lassen sich dadurch ohne Beschriftung unterscheiden.
- `dialog_marina.png` trägt vor allem durch die Kombination aus Medienmonitoren, Sofa, Pflanzen und wärmerem Licht. Das passt zur vorgesehenen Zonenbeleuchtung, ist aber weicher, heller und flächiger gerendert als die anderen Hintergründe.
- Die Charakterassets besitzen keine vollständig gemeinsame Bildsprache. Alexei in `dialog_alexei.png` wirkt durch große Anime-Augen, violett-cyanfarbene Konturen und starke Gesichtskontraste fremder; Marina in `dialog_marina.png` ist glatter und weniger sichtbar verpixelt; Katja und Volkov liegen näher an der feinen, scharfen Pixel-Art aus `sprite-tool/public/context/game-style-guide.md`.
- Igor in `dialog_igor.png` und Alexei in `dialog_alexei.png` besitzen auffällig harte Außenlinien, während die Raumobjekte feinere und weniger schwarze Kanten haben. Die Figuren sollten dieselbe Konturstärke und dieselbe Zahl an Schattierungsstufen wie die Hintergründe verwenden.
- Der auffälligste Skalierungsfehler liegt in `direktor_intro.png`: Volkovs Kopf sitzt ungefähr zwei Kopfhöhen tiefer als in `dialog_direktor.png`, obwohl es derselbe Sprecher im selben Raum ist.
- Die Miniaturporträts in allen sechs DialogBoxen sind zu stark verkleinerte Ganz- oder Halbfiguren. Es fehlen dedizierte, identisch zugeschnittene Kopf-Schulter-ID-Fotos mit gleicher Augenhöhe, gleichem Hintergrund und gleicher Rahmengröße.
- In `dialog_marina.png` ist die Pflanzenkontur unmittelbar hinter der Figur falsch platziert; in `dialog_katja.png` fehlt für die sichtbare Regieanweisung eine passende Anlehnpose.
- Den Papierflächen fehlt eine sehr zurückhaltende Materialebene: leichte Faserung, minimal dunklere Schnittkanten und ein klarer Aktenreiter würden mehr Behörden-/Papierwirkung erzeugen als zusätzliche Dekoration. Die Textur darf nur im Nahbereich sichtbar sein und die Pixelschrift nicht verrauschen.

## 4. **Raster & Rhythmus**

- Die DialogBoxen in allen sechs Screens sind nahezu bildschirmbreit und besitzen nur einen sehr schmalen Außenrand. Für die Wirkung eines aufgelegten Dokuments sollte die Box auf ungefähr 93–95 % der Bildschirmbreite begrenzt und horizontal zentriert werden; Seiten- und unterer Abstand sollten gleich groß erscheinen.
- Die Aufteilung Raum zu DialogBox ist grundsätzlich stabil, aber `direktor_intro.png` bricht das Figurenraster deutlich. Für alle Charaktere sollte eine gemeinsame Bühnenzone gelten: Kopf im oberen bis mittleren Drittel der sichtbaren Raumfläche, Körperunterkante hinter der Oberkante des Dokuments.
- In `dialog_alexei.png`, `dialog_marina.png`, `dialog_katja.png`, `dialog_direktor.png` und `dialog_igor.png` liegt eine dünne rote Linie oberhalb der eigentlichen DialogBox, getrennt durch einen dunklen Zwischenraum. Diese Linie wirkt wie ein übrig gebliebener globaler Separator; entweder direkt an die Papierkante anschließen oder entfernen.
- Innerhalb der Box existieren zwei linke Achsen: Sprechername beginnt rechts vom ID-Porträt, der Dialogtext springt dagegen zurück zur linken Kante des Porträts. Der Text sollte in allen sechs Screens unter dem Namen beginnen; das ID-Foto bildet dann eine klar getrennte Metadatenspalte.
- Das Sprecherkopfband beansprucht ungefähr ein Drittel der gesamten Dokumenthöhe. Das ist zu viel für Foto, Name und Funktion; eine Reduktion um etwa ein Fünftel würde dem eigentlichen Dialog mehr Hierarchie geben.
- Der untere Teil der Raumansichten ist in `dialog_alexei.png`, `dialog_marina.png`, `dialog_katja.png`, `dialog_direktor.png` und `dialog_igor.png` stark abgedunkelt, während oben viele kleine Objekte konkurrieren. Dadurch entsteht der unruhige Rhythmus „Detailteppich oben, leere Dunkelfläche unten“. Besser ist eine schwächere, gleichmäßigere Raumabdunklung mit lokaler Aufhellung am Gesicht.
- Der HUD-Block ist konsequent oben rechts, wird aber nicht als Teil des modalen Dialogzustands behandelt. Weil Figuren ebenfalls rechts stehen, sollten Uhr und Bedienelemente während eines Dialogs visuell zurücktreten.

## 5. **Lesbarkeit**

- In `dialog_katja.png` musste ich bei „Katja Orlova“, „Feld-Operateurin“ und dem Schließen-„X“ zweimal hinsehen: Weiß auf hellem Beige ist klar zu kontrastarm. Dunkle Tinte ist dort zwingend.
- Die Funktionszeilen in allen sechs Screens sind gegenüber den Namen sehr klein und durch die Pixelschrift zusätzlich kleinteilig. Sie sollten ungefähr ein Viertel größer werden oder mindestens dieselbe sichtbare Strichstärke wie der Fließtext erhalten.
- Der Fließtext auf Creme ist kontrastreich genug, besitzt aber eine potenziell viel zu lange Zeile. Eine feste Lesespalte von etwa 65–75 Zeichen verhindert, dass vollständige Dialoge später über fast die gesamte Bildschirmbreite laufen.
- In `dialog_alexei.png`, `dialog_marina.png`, `dialog_katja.png` und `dialog_igor.png` stehen Regieanweisung und wörtliche Rede in derselben Schrift, Farbe und Zeile. Die Sternchen reichen als Unterscheidung nicht; Regieanweisungen sollten eine eigene Zeile, Sekundärtinte und etwas mehr Abstand zur Rede erhalten.
- Der Typewriter-Cursor direkt hinter Wortfragmenten sieht in allen Screens wie ein zusätzliches Zeichen oder ein Darstellungsfehler aus. Er sollte schmaler sein, blinken und nach Abschluss der Zeile verschwinden beziehungsweise durch einen eindeutigen Weiter-Indikator ersetzt werden.
- Das „X“ ist in allen DialogBoxen klein, weit vom Text entfernt und ohne sichtbaren Buttonrahmen. Seine grafische Zielgröße sollte mindestens der Höhe des ID-Porträts entsprechen, auch wenn das eigentliche X kleiner bleibt.
- `› HUD · H` oben rechts ist auf allen sechs Screens sehr klein und kryptisch. Im Dialogzustand ist es weder wichtig noch gut lesbar und sollte deshalb stärker zurückgenommen werden.

## 6. **Die drei wirksamsten Änderungen**

1. **Raum und HUD im Dialogzustand einheitlich abdunkeln, statt nur den Boden schwarz auslaufen zu lassen** — eine gemeinsame Overlay-/Vignettenregel ist technisch günstig und lenkt in allen sechs Screens sofort auf Gesicht und Text.
2. **DialogBox auf ein echtes Papier-/Aktenraster umstellen: Text unter dem Namen, kürzere Lesespalte, dunkle Katja-Tinte und Farbflächen nur als Reiter/Kopfband** — behebt mit einer Komponentenänderung Hierarchie, Lesbarkeit und den Behördenstil zugleich.
3. **Ein gemeinsames Charakter-Framing festlegen und zuerst Volkov in `direktor_intro.png` korrigieren** — gleiche Kopfgröße, Augenhöhe, Konturstärke und rechte Einrückung beseitigen den größten sichtbaren Produktionsbruch zwischen den Screens.

## 7. **Blinde Flecken**

- Die Screens zeigen laufende Typewriter-Zustände, aber keinen vollständig gesetzten Dialog mit drei oder mehr Zeilen. Dafür wäre je ein Screenshot nach Abschluss der Textanimation nötig, um Umbruch, maximale Textmenge und Dokumenthöhe belastbar zu beurteilen.
- Nicht erkennbar ist, ob das „X“ Hover-, Fokus- oder Tastaturzustände besitzt und wie groß seine tatsächliche Klickfläche ist. Dafür werden Maus-Hover-, Tastaturfokus- und gedrückte Zustände benötigt.
- Es ist kein eindeutiger Weiter-/Bestätigungszustand sichtbar. Ein Screenshot vor und nach vollständiger Textausgabe würde zeigen, ob Cursor, Weiter-Symbol und Eingabeaufforderung unterscheidbar sind.
- Die angekündigte Mimik ist nur als Einzelbild zu sehen. Für Alexei, Marina, Katja, Volkov und Igor wären jeweils mindestens zwei Emotionszustände in identischer Szene nötig, um Sprünge bei Größe, Position und Kontur zu prüfen.
- Nicht beurteilbar sind Figuren-Idle, Lippenbewegung, Ein-/Ausblenden der DialogBox und die Wirkung der Hintergrundabdunklung in Bewegung.
- Für kleine Auflösungen fehlen Aufnahmen mit vollständig gefülltem Text, vergrößerter UI-Skalierung und schmalerem Seitenverhältnis. Erst dort zeigt sich, ob Sprecherkopf, Textspalte, HUD und Schließen-Schaltfläche kollidieren.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
