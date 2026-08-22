# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „panels-2von2"

**Modell:** `gpt-5.6-sol` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-22
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-22T17:19:07.670Z · **Dauer:** 149.3 s
**Nutzung:** nicht gemeldet · **Kosten:** unbekannt · **Anbieter-Datensammlung:** ausgeschlossen (deny)

> ⚠️ **Wie das zu lesen ist:** Ein *fremdes* Modell hat einen **kuratierten Ausschnitt**
> des Projekts gesehen — nicht das laufende Spiel und nicht das ganze Repository. Es kann
> daher weder Laufzeitverhalten prüfen noch `file:line`-Belege verifizieren. Befunde sind
> **Hypothesen**, die vor dem Umsetzen am Code/an den Daten gegenzuprüfen sind. Die
> kanonische Wahrheit bleibt [`docs/VISION_LOCK.md`](../VISION_LOCK.md) bzw. die Spieldaten.

## Gestellte Frage

Sieh dir die beigefügten Screenshots des laufenden Spiels an und mache einen UX/UI-Durchgang. Die Optik soll eine Behörden-/Papierwelt sein (Stil-Anker und Farbtoken liegen bei). Sag mir: Wo führt das Bild den Blick falsch, welche Grafiken sitzen an der falschen Stelle oder in der falschen Größe, wo stimmen Abstände und Ausrichtung nicht, und welche drei Änderungen bringen am meisten? Sei so konkret, dass man es direkt umsetzen kann.

## Dieser Durchgang: Bündel „panels-2von2" (6 Screenshots)

Das siehst du, in dieser Reihenfolge:
- panel_events.png — Seiten-Panel: Welt-Ereignisse
- hud_on.png — HUD eingeblendet (Sonntagsfrage · Abwehr · Kasse · Tag)
- encyclopedia.png — Nachschlagewerk/Enzyklopädie (Taste I)
- shortcuts.png — Tastenkürzel-Hilfe
- pause_menu.png — Pausenmenü (Sound-Mixer, Speichern, Beenden)
- decision_beat.png — Entscheidungs-Beat-Modal (Stadtrat) mit Optionen + Berater-Badge

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
| 🖼 Bild | `panel_events.png` | `desinformation-network/runs/visual-review/latest/shots/panel_events.png` | 321 kB |
| 🖼 Bild | `hud_on.png` | `desinformation-network/runs/visual-review/latest/shots/hud_on.png` | 367 kB |
| 🖼 Bild | `encyclopedia.png` | `desinformation-network/runs/visual-review/latest/shots/encyclopedia.png` | 435 kB |
| 🖼 Bild | `shortcuts.png` | `desinformation-network/runs/visual-review/latest/shots/shortcuts.png` | 257 kB |
| 🖼 Bild | `pause_menu.png` | `desinformation-network/runs/visual-review/latest/shots/pause_menu.png` | 343 kB |
| 🖼 Bild | `decision_beat.png` | `desinformation-network/runs/visual-review/latest/shots/decision_beat.png` | 327 kB |

---

## Antwort des Modells

## 1. **Erster Eindruck**

**`panel_events.png`**  
Der Blick landet vollständig auf dem roten Kopfband „Die reale Vorlage“, nicht auf dem Panel „Welt-Ereignisse“. Das eigentliche Seiten-Panel ist nur als fast schwarze Fläche am rechten Rand zu erkennen; selbst „Keine Weltereignisse“ ist kaum lesbar. Zuerst sollte der Paneltitel und danach der Leerzustand beziehungsweise die Ereignisliste wahrgenommen werden. Tatsächlich besitzt das vorgeschaltete Entscheidungsmodal die gesamte visuelle und interaktive Priorität. Damit ist diese Aufnahme für die Beurteilung des Ereignis-Panels weitgehend unbrauchbar und zeigt entweder einen Layering- oder einen Erntefehler.

**`hud_on.png`**  
Auch hier zieht „Die reale Vorlage“ den Blick an, während das HUD nur schemenhaft an der oberen Bildschirmkante verbleibt. Bei einer HUD-Aufnahme sollten die vier Kennzahlen Sonntagsfrage, Abwehr, Kasse und Tag zuerst als zusammengehörige Informationsleiste lesbar sein. Stattdessen konkurrieren links kleine Werte, rechts Bedienelemente und in der Mitte das dominante Modal. Die starke Abdunklung ist für einen Modalzustand plausibel, widerspricht aber dem Zweck dieser konkreten Aufnahme. Größenhierarchie, Abstände und Zustände des HUD lassen sich deshalb nicht belastbar beurteilen.

**`encyclopedia.png`**  
Das breite Dossierfenster übernimmt korrekt den Fokus; zuerst fällt der Titelbalken, dann die linke Themenliste auf. Inhaltlich sollte nach dem Titel jedoch direkt die ausgewählte Methode rechts führen, während die lange Navigation optisch fast gleich stark bleibt. Der aktive Eintrag unterscheidet sich nur schwach von den übrigen Zeilen, und die kleinen roten beziehungsweise braunen Quadrate wirken eher wie unklare Statussignale als wie Kategorien. Im rechten Bereich sind Überschrift und Fließtext ordentlich gegliedert, aber die Zeilen sind lang und die Metadaten zu klein. Das weiterhin sichtbare Entscheidungsmodal im Hintergrund erzeugt unnötige Layer-Komplexität.

**`shortcuts.png`**  
Auf dem Bild ist keine Tastenkürzel-Hilfe zu sehen; erneut beherrscht das Entscheidungsmodal den Bildschirm. Der Blick sollte zuerst auf eine kompakte Liste aus Taste und zugehöriger Aktion fallen. Stattdessen entsteht kein visueller Unterschied zu `panel_events.png` und `hud_on.png`. Es fehlt sowohl ein eigener Titel als auch eine erkennbare Shortcut-Struktur oder Schließen-Affordanz. Damit ist nicht nur die Aufnahme, sondern möglicherweise auch die Priorisierung konkurrierender Overlays fehlerhaft.

**`pause_menu.png`**  
Der Blick geht zuerst auf „FORTSETZEN“, danach auf „SPEICHERN“ und erst anschließend auf den Soundblock. Das entspricht grundsätzlich der Handlungshierarchie eines Pausenmenüs, während die Überschrift „PAUSE“ relativ schwach bleibt. Der Mixer ist im Verhältnis zu seiner Informationsdichte zu schmal; Labels, Schieberegler und Endsymbole drängen sich auf engem Raum. „BEENDEN“ wirkt durch die gefüllte braune Fläche eher deaktiviert als destruktiv. Der abgedunkelte Raumhintergrund gibt Kontext, ohne die Menüfläche ernsthaft zu stören.

**`decision_beat.png`**  
Der rote Kopf „Der Stadtrat“ ist der stärkste Einstieg, danach springt das Auge zwischen Optionstiteln und den roten Prozentwerten hin und her. Zuerst sollte die Entscheidungslage verstanden werden, danach sollten drei vollständig sichtbare Optionen vergleichbar sein. Das ist nicht der Fall: Option C wird vom unteren, feststehenden Hinweisbalken abgeschnitten, während das Modal praktisch ohne oberen und unteren Außenabstand den ganzen Bildschirm belegt. Risiko und Aufmerksamkeit sind beide rot codiert und dadurch semantisch nicht schnell unterscheidbar. Das Berater-Badge steckt mitten in der umgebrochenen Überschrift von Option C und sieht eher wie ein Fremdkörper als wie eine gezielte Empfehlung aus.

---

## 2. **Konkrete Eingriffe je Screen**

### `panel_events.png`

- **Entscheidungsmodal vor dem Ereignis-Panel → beim Öffnen von „Welt-Ereignisse“ schließen oder blockieren; nie zwei fokusführende Ebenen gleichzeitig anzeigen → das gewünschte Panel ist sonst weder lesbar noch bedienbar.**
- **Abdunklung über dem rechten Seiten-Panel → nur auf die Welt hinter dem aktiven Panel legen, nicht auf das Panel selbst → aktuell wird die relevante Ebene zusammen mit dem Hintergrund entwertet.**
- **Leerzustand „Keine Weltereignisse“ → Icon, Überschrift und Erklärung als kompakte Gruppe im oberen Drittel des Panels anordnen und gegenüber dem Paneltitel klar absetzen → die drei Bestandteile verschwinden derzeit in der Dunkelfläche.**
- **Paneltitel am oberen rechten Rand → mit derselben linken Innenkante wie Leerzustand oder spätere Listeneinträge ausrichten und deutlich heller setzen → momentan ist nicht einmal die Panelgrenze sicher erfassbar.**

### `hud_on.png`

- **Entscheidungsmodal über dem HUD → für die HUD-Ansicht entfernen; falls ein Modalzustand absichtlich gezeigt werden soll, dafür eine getrennte Aufnahme verwenden → die vier HUD-Werte können hier nicht verglichen werden.**
- **HUD-Kennzahlen an der oberen Kante → als eine durchgehende Leiste mit vier gleichartigen Zellen gruppieren, jeweils Label oben und Wert darunter → die sichtbaren Fragmente wirken momentan wie voneinander unabhängige Anzeigen.**
- **Kennzahlen und rechte Steuerknöpfe → durch einen konstanten horizontalen Zwischenraum beziehungsweise eine deutliche Trennkante separieren → Statusinformation und globale Aktionen konkurrieren an derselben oberen Achse.**
- **Werte gegenüber Labels → Werte etwa 1,5-mal so groß wie ihre Labels setzen und alle Werte auf einer gemeinsamen Grundlinie ausrichten → bei `hud_on.png` sind vor allem kleine Beschriftungen, nicht die eigentlichen Spielwerte, wahrnehmbar.**

### `encyclopedia.png`

- **Aktiver Eintrag in der linken Liste → zusätzlich zur Flächenfärbung einen kräftigen, durchgehenden Tintenbalken an der linken Kante und höhere Schriftstärke geben → die Auswahl ist aktuell erst nach erneutem Hinsehen erkennbar.**
- **Linke Navigation → von knapp einem Drittel auf etwa ein Viertel der Fensterbreite reduzieren; den gewonnenen Raum dem Artikel geben → einige Navigationseinträge brechen zwar um, der rechte Fließtext bleibt trotzdem unnötig lang und wenig strukturiert.**
- **Rechter Artikelbereich → Textspalte auf ungefähr zwei Drittel der verfügbaren rechten Breite begrenzen und die Restfläche für eine schmale Marginalienspalte nutzen → derzeit laufen die Zeilen zu weit, während unten rechts tote Fläche entsteht.**
- **Metazeile „Reale Methode … Schwere: hoch“ → um etwa eine Schriftstufe vergrößern und in zwei klar getrennte Felder unter der Überschrift setzen → Methode und Schweregrad sind aktuell zu klein und verschmelzen.**
- **Fußzeile „Bildungs-Kern …“ → mindestens auf Größe der Navigationsschrift anheben und mit mehr vertikalem Innenabstand versehen → diese wichtige Einordnung wirkt wie ein technischer Build-Hinweis.**
- **Winziger blauer Marker links vor dem Fenstertitel → entfernen oder zu einem klar erkennbaren Dossier-/Aktenzeichen in Größe der Titelbuchstaben ausbauen → als Einzelpixel wirkt er wie ein Darstellungsfehler.**

### `shortcuts.png`

- **Fehlende Tastenkürzel-Hilfe → statt des Entscheidungsmodals ein eigenes, zentriertes Papierblatt mit Titelbalken anzeigen → der angekündigte Screeninhalt ist nicht vorhanden.**
- **Shortcut-Inhalt → in zwei Spalten aufbauen: links gleich breite Tastenkappen, rechts linksbündige Aktionsnamen; zwischen den Zeilen mindestens eine halbe Textzeile Luft → dadurch werden Tasten vertikal scannbar statt als Fließliste gelesen.**
- **Shortcut-Gruppen → Bewegung, Panels und globale Aktionen durch Zwischenüberschriften und jeweils einen deutlich größeren Gruppenabstand trennen → eine reine ungruppierte Befehlsliste wäre für schnelle Hilfe zu langsam.**
- **Schließen-Funktion → oben rechts an derselben Kante wie in `encyclopedia.png` platzieren und zusätzlich „Esc“ unmittelbar daneben nennen → der Nutzer muss den Rückweg ohne Versuch erkennen können.**
- **Overlay-Priorität → Shortcut-Hilfe entweder oberhalb eines Entscheidungsmodals mit eindeutiger eigener Fläche öffnen oder den Aufruf während einer Entscheidung sperren und sichtbar erklären → der jetzige Zustand verschluckt den Tastendruck offenbar vollständig.**

### `pause_menu.png`

- **Gesamtes Menü → um ungefähr ein Fünftel verbreitern, Höhe weitgehend beibehalten → der zusätzliche Raum sollte vollständig dem Mixer zugutekommen, ohne die klare vertikale Hierarchie aufzugeben.**
- **Soundblock → Labels in eine feste linke Spalte und alle Regler auf eine gemeinsame Start- und Endkante setzen → „SOUND“, „MUSIK“, „EFFEKTE“ und „STIMMEN“ besitzen derzeit unterschiedliche optische Anker.**
- **Reglerspuren → bereits gefüllten Bereich dunkeloliv oder tintenbraun darstellen, Rest als helle Papierkästchen; Griff kontrastierend darüberlegen → aktuell zeigen fast identische Kästchen nur den Griff, nicht den Wert auf einen Blick.**
- **Schalter „AN“ → als eindeutigen Zweizustand mit direkt benachbartem „AUS“ darstellen oder den aktuellen Zustand durch gefüllte Fläche plus Häkchen kennzeichnen → „AN“ kann momentan Zustand oder auslösende Aktion bedeuten.**
- **„BEENDEN“ → braune Füllung entfernen und als roter Stempelrahmen mit kleinerem visuellen Gewicht als „FORTSETZEN“ ausführen → die aktuelle Fläche sieht deaktiviert aus und bricht die Stempel-Logik aus `desinformation-network/src/story-mode/theme.ts`.**
- **Versionsnummer → näher an die Unterkante des Menüs und deutlich kleiner als Funktionsbeschriftungen setzen, aber mit etwas höherem Kontrast → aktuell schwimmt sie zwischen Beenden-Schaltfläche und Außenkante.**

### `decision_beat.png`

- **Gesamtmodal → auf etwa die Hälfte bis drei Fünftel der Bildschirmbreite erweitern und oben wie unten einen sichtbaren Außenabstand von jeweils ungefähr einer halben Kopfbandhöhe lassen → mehr Breite verhindert Umbrüche und schafft vertikale Luft.**
- **Optionsbereich → zwischen festem Einführungsteil und festem Fußhinweis intern scrollbar machen; der Fußhinweis darf keine Karte überdecken → Option C ist in `decision_beat.png` nicht vollständig les- oder anklickbar.**
- **Jede Optionskarte → als Raster mit linker Textspalte und rechter, gleich breiter Kennzahlenspalte aufbauen; alle Prozentwerte an identischen Spaltenkanten ausrichten → momentan wandern Risiko und Aufmerksamkeit abhängig von der Titellänge.**
- **Kennzahlen → Risiko in Gefahr-Rot, Aufmerksamkeit in `agencyBlue` beziehungsweise Petrol darstellen; Plus und Minus zusätzlich typografisch hervorheben → zwei rote Metriken sind semantisch nicht unterscheidbar.**
- **Berater-Badge in Option C → aus der Überschrift herausnehmen und als kleine umrandete Stempelzeile direkt unter dem Titel, linksbündig zur Technikzeile, setzen → derzeit zerreißt das Badge den Titel und konkurriert mit den Prozentwerten.**
- **Kartenrahmen → gegenüber dem äußeren Modalrahmen um eine Stufe dünner beziehungsweise heller machen und den Zwischenraum zwischen Karten leicht vergrößern → alle Grenzen besitzen fast dasselbe Gewicht und erzeugen einen Stapel schwerer Kästen.**

---

## 3. **Grafiken/Assets**

- **`panel_events.png`**: Das eigentliche Ereignis-Panel und mögliche Ereignisgrafiken sind durch das Modal und die Abdunklung nicht beurteilbar. Das kleine Leerzustands-Icon ist sichtbar, aber zu schwach und zu klein, um die leere Fläche zu tragen. Für einen Leerzustand würde eine etwa doppelt so große, einfarbige Akten-/Globusmarke oberhalb der Überschrift mehr leisten als zusätzliche Dekoration.
- **`hud_on.png`**: Grafische Symbole der vier HUD-Werte sind nicht zuverlässig erkennbar. Neue Icons sollten erst beurteilt werden, wenn das HUD ohne den darüberliegenden Entscheidungsdialog gezeigt wird.
- **`encyclopedia.png`**: Papiertextur, harte Kanten und Kraftpapier-Kopfband tragen die Behördenakte. Fremd wirken weniger einzelne Assets als die roten und braunen Miniquadrate: Sie sehen nach Warnlampen aus, erklären aber weder Kategorie noch Status. Im freien unteren Bereich des rechten Artikels würde ein kleines, monochromes Ablaufdiagramm „Mechanismus → Wirkung → Gegenmaßnahme“ den Bildungszweck stärker unterstützen als ein dekoratives Bild.
- **`shortcuts.png`**: Es ist kein Shortcut-Asset sichtbar. Tastenkappen sollten keine modernen Hochglanz-Keycaps sein, sondern flache, gedruckte Kästchen wie ausgeschnittene Beschriftungsstreifen auf einer Dienstanweisung.
- **`pause_menu.png`**: Der sichtbare Raumhintergrund trägt: feine Pixelkanten, Beton, dunkles Fenster und geometrisches Poster bleiben trotz Abdunklung erkennbar. Das Poster ist farblich kräftiger als die Papieroberfläche, sitzt aber weit genug außerhalb des Menüs und wird durch den Dimmer ausreichend zurückgenommen. Die kleinteiligen Slider-Kästchen wirken dagegen eher wie Debug- oder Rastergrafik als wie ein glaubwürdiges Behördeninstrument.
- **`decision_beat.png`**: Die reine Typografie ist für eine Entscheidung angemessen; hier fehlt kein großes Bild. Das Berater-Badge ist das einzige emblematische Element, aber zu klein, zu rechteckig und falsch in den Titel eingesetzt. Als leicht unregelmäßiger Tintenstempel unter der Überschrift würde es die Papierwelt deutlich besser tragen.
- Übergreifend folgen die hellen Flächen, Tintenfarben und roten Kopfbänder weitgehend der Materialabsicht aus `desinformation-network/src/story-mode/theme.ts`. Die roten Prozentwerte in `decision_beat.png` benutzen Rot jedoch als allgemeine Datenfarbe statt nur als Gefahr-/Stempelfarbe und verwässern damit die definierte Semantik.

---

## 4. **Raster & Rhythmus**

- **`panel_events.png`, `hud_on.png` und `shortcuts.png`** teilen faktisch dasselbe dominante Mittelfeld: ein ungefähr halbbreites Modal, das exakt die relevante Bildschirmmitte besetzt. Dadurch werden drei sehr verschiedene UI-Zwecke visuell identisch. Das ist keine Rhythmusfrage innerhalb der Screens, sondern ein übergeordnetes Layerproblem.
- **`encyclopedia.png`** besitzt ein brauchbares Zweispaltenraster, aber die linke Liste und der rechte Text beginnen nicht mit derselben inhaltlichen Hierarchie: links startet sofort die Auswahl, rechts folgen Überschrift, Metaebene und Abschnittslabels. Ein gemeinsames oberes Inhaltsraster unter dem Kopfband würde den Blickwechsel stabilisieren.
- In **`encyclopedia.png`** sind die Navigationszeilen regelmäßig, bis ein langer Eintrag zweizeilig wird. Dieser doppelte Eintrag erhält kaum zusätzlichen Innenabstand und stört den ansonsten gleichmäßigen Takt. Zweizeilige Zeilen sollten etwa eine halbe Zeilenhöhe mehr vertikale Luft bekommen.
- **`pause_menu.png`** ist vertikal sauber zentriert, aber sein Innenraster kippt im Soundblock: Der Hauptregler hat andere Bezugskanten als die drei Unterregler, der „AN“-Schalter bildet eine zusätzliche rechte Kante. Ein festes Drei-Spaltenraster aus Label, Regler und Zustand würde die Unruhe beseitigen.
- **`decision_beat.png`** hat zu wenig nutzbare Höhe und zu viel Rahmengewicht. Die Kartenabstände sind kleiner als die Innenabstände der Karten, wodurch die Karten als durchgehender Block statt als drei Vergleichseinheiten erscheinen. Gleichzeitig erzeugt der angesetzte Fußbalken eine harte vierte Zone und verdeckt Inhalt.
- Die unterschiedlichen Overlaybreiten von **`encyclopedia.png`**, **`pause_menu.png`** und **`decision_beat.png`** sind aufgrund ihrer Inhaltsmengen sinnvoll. Was fehlt, sind gemeinsame Außenabstände, Kopfbandhöhen und Schließen-/Fußzonen, damit sie wie Mitglieder desselben UI-Systems wirken.

---

## 5. **Lesbarkeit**

- In **`panel_events.png`** musste ich bei „Keine Weltereignisse“ und der erklärenden Zeile zweimal hinsehen; die Abdunklung nimmt ihnen fast den gesamten Kontrast.
- In **`hud_on.png`** sind die HUD-Labels und Werte nicht zuverlässig zu entziffern. Die Aufnahme erlaubt keine Aussage dazu, ob positive, kritische oder leere Zustände unterscheidbar sind.
- In **`encyclopedia.png`** sind die Metazeile unter der Artikelüberschrift, die Abschnittslabels „WAS ES IST“, „REALER FALL“ und „GEGENMASSNAHME“ sowie besonders die untere Bildungs-Kern-Zeile zu klein. Der aktive Navigationseintrag braucht neben der Flächenfarbe ein zweites Merkmal; die roten und braunen Quadrate reichen nicht.
- In **`shortcuts.png`** gibt es keine lesbare Hilfe. Der Nutzer erhält weder einen aktiven Zustand noch eine Fehlermeldung oder einen Hinweis, warum die erwartete Ebene nicht erscheint.
- In **`pause_menu.png`** sind „MUSIK“, „EFFEKTE“, „STIMMEN“ und die kleinen Endsymbole deutlich schwächer als die Schaltflächen. Die aktuelle Reglerstellung ist nur über den Griff und nicht über eine gefüllte Spur ablesbar.
- In **`decision_beat.png`** sind die Optionsbeschreibungen grundsätzlich lesbar, aber der Vergleich ist langsam: Titel umbrechen unterschiedlich, Kennzahlen wandern und beide Metriken sind rot. Das Badge „BERATER RÄT“ musste ich wegen seiner Einbettung in Option C erneut lesen.
- Die breite Displayschrift funktioniert bei kurzen Titeln, wird aber bei längeren Optionsüberschriften schwerfällig. Für Kartentitel sollte dieselbe kräftige Weltschrift wie im Body in größerem Schnitt verwendet werden; `StoryModeFonts.display` aus `desinformation-network/src/story-mode/theme.ts` sollte auf kurze Kopfzeilen begrenzt bleiben.
- Zustände sind insgesamt zu stark farbabhängig: aktiver Enzyklopädieeintrag, Sound an/aus und Metriktypen benötigen zusätzlich Form, Position oder Beschriftung.

---

## 6. **Die drei wirksamsten Änderungen**

1. **Overlay-Priorisierung für `panel_events.png`, `hud_on.png` und `shortcuts.png` korrigieren** — ein Fokusmanager, der nur eine primäre Ebene zulässt beziehungsweise Aufrufe sichtbar ablehnt, behebt mit geringem Aufwand drei aktuell nicht beurteilbare oder nicht nutzbare Screens.
2. **`decision_beat.png` verbreitern und den Optionsbereich zwischen festem Kopf und Fuß scrollbar machen** — dadurch werden alle Optionen vollständig sichtbar, Titel brechen seltener und Kennzahlen lassen sich in ein stabiles Vergleichsraster setzen.
3. **Kleine Funktionsschrift und Zustandskodierung in `encyclopedia.png` und `pause_menu.png` überarbeiten** — größere Meta-/Footertexte, klare aktive Markierungen und gefüllte Regler verbessern die tägliche Lesbarkeit ohne neue Assets oder strukturellen Umbau.

---

## 7. **Blinde Flecken**

- Für **`panel_events.png`** fehlen unüberdeckte Aufnahmen des leeren und eines gefüllten Ereignis-Panels sowie eines langen, scrollenden Ereigniseintrags.
- Für **`hud_on.png`** fehlen ein sauberer Grundzustand und Varianten mit niedrigen, hohen, positiven, negativen und alarmierenden Werten. Auch unklar sind Aktualisierungsanimationen und Tooltips.
- Für **`shortcuts.png`** fehlt die eigentliche geöffnete Tastenkürzel-Hilfe vollständig. Benötigt werden zusätzlich Keyboard-Fokus, Scrollzustand und eine Aufnahme bei kleinerer Fensterhöhe.
- Für **`encyclopedia.png`** fehlen Hover-, Fokus-, „neu“-, gesperrte und bereits gelesene Zustände sowie ein langer Artikel, der vertikal scrollt.
- Für **`pause_menu.png`** sind Reglerbewegung, Tastatursteuerung, Sound-aus-Zustand, Speicherfeedback und eine mögliche Beenden-Bestätigung nicht erkennbar.
- Für **`decision_beat.png`** fehlen Hover, Auswahl, bestätigte Option, Beraterempfehlung ohne Textkollision und das Verhalten bei kleinerer Höhe. Ebenfalls unklar ist, ob der untere Balken sticky ist oder nur durch Überlauf an dieser Position landet.
- Die Wirkung von Dimmer-Übergängen, Papierbewegung, Stempeln, Hovergeräuschen und Fokuswechseln kann aus Standbildern nicht beurteilt werden.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
