# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „daycycle"

**Modell:** `gpt-5.6-sol` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-22
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-22T17:19:07.670Z · **Dauer:** 200.8 s
**Nutzung:** nicht gemeldet · **Kosten:** unbekannt · **Anbieter-Datensammlung:** ausgeschlossen (deny)

> ⚠️ **Wie das zu lesen ist:** Ein *fremdes* Modell hat einen **kuratierten Ausschnitt**
> des Projekts gesehen — nicht das laufende Spiel und nicht das ganze Repository. Es kann
> daher weder Laufzeitverhalten prüfen noch `file:line`-Belege verifizieren. Befunde sind
> **Hypothesen**, die vor dem Umsetzen am Code/an den Daten gegenzuprüfen sind. Die
> kanonische Wahrheit bleibt [`docs/VISION_LOCK.md`](../VISION_LOCK.md) bzw. die Spieldaten.

## Gestellte Frage

Sieh dir die beigefügten Screenshots des laufenden Spiels an und mache einen UX/UI-Durchgang. Die Optik soll eine Behörden-/Papierwelt sein (Stil-Anker und Farbtoken liegen bei). Sag mir: Wo führt das Bild den Blick falsch, welche Grafiken sitzen an der falschen Stelle oder in der falschen Größe, wo stimmen Abstände und Ausrichtung nicht, und welche drei Änderungen bringen am meisten? Sei so konkret, dass man es direkt umsetzen kann.

## Dieser Durchgang: Bündel „daycycle" (3 Screenshots)

Das siehst du, in dieser Reihenfolge:
- day_report.png — Tagesfazit (DayReport) nach dem Heimweg
- day_report_bottom.png — Tagesfazit, unteres Ende (Über Nacht / Tranche / Weiter-Button)
- morning_briefing.png — Morgenbriefing des nächsten Kampagnentags

Beurteile **nur diese** Aufnahmen, dafür gründlich. Andere Teile des Spiels kommen in
eigenen Durchgängen dran — verweise nicht auf Dinge, die du hier nicht siehst.

## Gezeigter Ausschnitt

15.047 Zeichen ≈ 4.180 Tokens (geschätzt) aus 3 Quellen · 1 gekürzt

| Quelle | Modus | Zeichen | Status |
|---|---|---:|---|
| `sprite-tool/public/context/game-style-guide.md` | voll | 5.496 | vollständig |
| `desinformation-network/src/story-mode/theme.ts` | voll | 3.375 | vollständig |
| `desinformation-network/runs/visual-review/latest/manifest.json` | projektion | 6.176 | gekürzt |

### Gezeigtes Anschauungsmaterial (3 Screenshot(s))

| Art | Im Text genannt als | Datei | Größe |
|---|---|---|---:|
| 🖼 Bild | `day_report.png` | `desinformation-network/runs/visual-review/latest/shots/day_report.png` | 89 kB |
| 🖼 Bild | `day_report_bottom.png` | `desinformation-network/runs/visual-review/latest/shots/day_report_bottom.png` | 85 kB |
| 🖼 Bild | `morning_briefing.png` | `desinformation-network/runs/visual-review/latest/shots/morning_briefing.png` | 425 kB |

---

## Antwort des Modells

## 1. **Erster Eindruck**

### `day_report.png`
In `day_report.png` fällt zuerst der rote Titel „Lagebericht – Tag 2“ auf; das ist als Einstieg richtig. Danach zieht jedoch der durchgehend blaue Balken „Deutungshoheit“ stärker als die eigentlichen Tagesergebnisse, obwohl seine Aussage visuell nicht verständlich wird. Die drei gleich großen Karten suggerieren gleiche Informationsmenge, tatsächlich sind die Außenkarten fast leer und die mittlere Karte dicht gedrängt. Dadurch bleibt der Blick in der Mitte hängen, ohne eine klare relevante Veränderung zu erkennen. Der unten angeschnittene nächste Abschnitt kündigt Scrollen an, aber es fehlt ein eindeutiger Scrollhinweis oder eine sichtbare Fortsetzungslogik.

### `day_report_bottom.png`
In `day_report_bottom.png` dominiert zunächst erneut der lange blaue Balken, danach der rote „Nächster Tag“-Button. Eigentlich sollte der Blick zuerst auf die nächtlichen Veränderungen gehen, weil diese den Übergang zum nächsten Tag erklären. Der abgeschnittene obere Kartenblock wirkt nicht wie ein bewusst gescrolltes Dokument, sondern wie ein fehlerhaft beschnittener Bildschirm. „Über Nacht“ besitzt trotz spielrelevanter Werte deutlich weniger Gewicht als die weitgehend statische Statusleiste darüber. Der Button ist als gestempelte Aktion erkennbar, steht aber isoliert im Schwarz und ist nicht sauber an die Dokumentkante angebunden.

### `morning_briefing.png`
In `morning_briefing.png` springen zuerst die hellen Etagen, Raumlabels und Figuren des Gebäudes ins Auge, nicht das Morgenbriefing. Der erste Fokus müsste auf „Morgenbriefing – Tag 3“ und dem Warnsatz „Das Risiko brennt“ liegen. Die große Papierfläche hilft zwar, doch ihre Überschrift ist zu klein und zu weit unten im Gesamtbild, um die detailreiche Szene zu überstimmen. Das Porträt hängt ohne erkennbare Zuordnung in der braunen Seitenleiste und wird dadurch eher als fremdes HUD-Element gelesen. „Verstanden“ ist die einzige Aktion, sieht aber kleiner und sekundärer aus als mehrere nichtinteraktive Raumlabels im Hintergrund.

## 2. **Konkrete Eingriffe je Screen**

### `day_report.png`

- **Drei obere Ergebniskarten → Breitenverhältnis von derzeit ungefähr 1:1:1 auf 1:2:1 ändern, „Das Land“ in zwei Spalten mit je vier Milieus setzen und den gesamten Kartenblock um etwa ein Drittel verkürzen → die reale Informationsdichte wird abgebildet und der vollständige Bericht kann eher in einen Bildschirm passen.**
- **Leere Flächen in „Was wir ausspielten“ und „Die Gegenseite“ → Kartenhöhe nicht mehr von der mittleren Liste bestimmen lassen oder beide Karten innerhalb ihrer Spalten nur so hoch wie ihr Inhalt plus ein einheitlicher Innenabstand machen → die großen beigen Leerfelder wirken derzeit wie fehlender Inhalt.**
- **Risiko/Budget/Aufmerksamkeit → Zahlen etwa eine typografische Stufe beziehungsweise rund 1,4-mal größer setzen und jeweils unmittelbar unter dem zugehörigen Label zentrieren → diese drei Kennzahlen sind die eigentliche Tagesbilanz, werden aber vom Balken darunter überholt.**
- **„Deutungshoheit“-Balken → als echte gegenläufige Skala zeichnen: rote Füllung von links, blaue Füllung von rechts, sichtbare Mitte beziehungsweise Positionsmarke und Werte direkt an den Enden → der vollständig blaue Balken ist momentan nicht als Verhältnis oder Richtung lesbar.**
- **Modal-Hintergrund → die durchscheinenden Raumlabels und HUD-Reste hinter Kopf und Außenrändern vollständig abdunkeln, während nur das Dokument hell bleibt → das Auge soll nicht zwischen Bericht und weiterhin sichtbarer Spielwelt wechseln.**

### `day_report_bottom.png`

- **Abgeschnittener Kartenblock am oberen Rand → entweder den Bericht auf eine Ansicht komprimieren oder beim Scrollen eine schmale, haftende Kopfzeile „Lagebericht – Tag 2“ zeigen und vollständig gescrollte Karten oberhalb des Viewports verschwinden lassen → der aktuelle kopflose Ausschnitt sieht nach Clipping statt nach Scrollposition aus.**
- **„Über Nacht“-Kasten → vorhandene Angaben in drei kompakte Schlüssel/Wert-Zeilen gliedern: „Vertrauen“, „Abwehr“ und „Grundrauschen“, Zahlen beziehungsweise Deltas rechtsbündig auf einer gemeinsamen Achse → die entscheidenden Veränderungen stecken derzeit in einem schwer scannbaren Satz.**
- **Nächtliche Deltas → Ausgangswert neutral, positive oder negative Veränderung in stärkerem Gewicht und mit mindestens einem Vorzeichen darstellen; die resultierende „8“ optisch vom Rechenweg trennen → „+0,2 → 8“ musste zweimal gelesen werden.**
- **„Nächster Tag“-Button → an die rechte Kante der Berichtsmodule setzen, etwa eine Viertelstufe vergrößern und seinen oberen Abstand auf denselben Rasterabstand wie zwischen den Papiermodulen reduzieren → als Abschlussstempel gehört er visuell an die untere rechte Dokumentkante statt frei in die schwarze Mitte.**
- **Statusmodul oberhalb von „Über Nacht“ → vertikalen Innenraum reduzieren und Balken näher an seine Beschriftung ziehen → die statische Übersicht verbraucht mehr Höhe als die neuen nächtlichen Informationen.**

### `morning_briefing.png`

- **Gebäude und rechtes HUD hinter dem Briefing → mit einem einheitlichen dunklen Scrim auf ungefähr 55–65 % der bisherigen Helligkeit zurücknehmen, einschließlich Uhr, Raumlabels und Tastenleiste → der Hintergrund konkurriert derzeit mit dem modalen Dokument.**
- **Briefing-Dokument → auf etwa neun Zehntel der Bildschirmbreite begrenzen, horizontal zentrieren und linke sowie rechte Außenabstände gleich machen → die jetzige fast randfüllende Breite erzeugt überlange Textzeilen und eine einseitige braune Restfläche.**
- **Kopfbereich „Morgenbriefing – Tag 3“ → um eine typografische Stufe vergrößern und in ein flaches Kraftpapier- oder Ministeriumsrot-Kopfband setzen; „Laune: angespannt“ rechts auf derselben Grundlinie ausrichten → Titel und Zustand werden damit als Dokumentkopf statt als Mini-Label gelesen.**
- **Textspalte → Zeilenlänge auf ungefähr 80–90 Zeichen begrenzen und alle Trennlinien exakt an derselben linken und rechten Textkante enden lassen → besonders der Tageshinweis ist aktuell zu breit, um schnell zeilenweise erfasst zu werden.**
- **Porträt in der linken Leiste → Oberkante mit dem Dokumentkopf ausrichten und unmittelbar darunter Name beziehungsweise Rolle setzen; Größe nur in einer ganzzahligen Pixel-Art-Skalierungsstufe verändern → das Bild erhält eine klare Zugehörigkeit und bleibt scharf.**
- **„Verstanden“-Button → etwa 1,25-mal größer machen, an die rechte Kante der begrenzten Textspalte setzen und sichtbar mit dem roten Doppelring des Stempel-CTA gestalten → die Primäraktion entspricht im Bild derzeit nicht der in `desinformation-network/src/story-mode/theme.ts` vorgesehenen Stempel-Hierarchie.**

## 3. **Grafiken/Assets**

- **`day_report.png`:** Die cremefarbenen Dokumentflächen und roten Akzente treffen die Farbabsicht aus `desinformation-network/src/story-mode/theme.ts`, aber die Flächen wirken noch wie flache Webkarten statt wie Papier. Eine sehr schwache, monochrome Faser- oder Kopiertextur über allen Papierflächen sowie eine gemeinsame äußere Blattkante würden mehr bringen als zusätzliche Dekoration. Die Textur darf nicht auf jedem Teilpanel anders laufen, sonst wirken die Karten wie drei unabhängige Materialien.
- **`day_report.png`:** Die Milieu-Balken sind zu dünn und besitzen überwiegend nur einen roten Strich am linken Rand. Ihre Höhe sollte auf ungefähr das Anderthalbfache steigen; ein Wertmarker braucht eine Mindestbreite, die auch bei sehr kleinen Werten noch als Marker und nicht als fehlerhafte Kante lesbar ist.
- **`day_report.png`:** Der Deutungshoheitsbalken ist zwar die größte Grafik, trägt aber am wenigsten verständliche Information. Hier fehlt keine Illustration, sondern eine klare Skalenmechanik mit Mitte, zwei Richtungen und sichtbarer Position.
- **`day_report_bottom.png`:** Der gestempelte „Nächster Tag“-Button trägt den Behörden-/Papierstil am deutlichsten. Fremd wirkt dagegen die große schwarze Fläche um ihn: Der Stempel sollte an einem Papierabschluss, einer Aktenlasche oder wenigstens an derselben Dokumentkante sitzen wie die vorherigen Module.
- **`day_report_bottom.png`:** Im sichtbaren „Über Nacht“-Bereich fehlt eine einfache dokumentarische Struktur wie tabellarische Linien, Spalten oder Delta-Stempel. Eine Illustration wäre hier unnötig; ein sauber gesetzter Änderungsbeleg wäre wirkungsvoller.
- **`morning_briefing.png`:** Das Gebäude ist fein, scharf und materiell differenziert und entspricht damit dem modernen Pixel-Art-Anker aus `sprite-tool/public/context/game-style-guide.md`. Als Hintergrund eines geöffneten Briefings ist es jedoch zu kontrastreich und detailreich; das Asset selbst muss nicht geändert, sondern modal zurückgenommen werden.
- **`morning_briefing.png`:** Das Porträt wirkt durch den kräftigen roten Rahmen und seine isolierte Position gröber als die Gebäudegrafik. Nicht frei interpolieren: auf nativer Größe oder der nächsten ganzzahligen Skalierungsstufe mit `nearest-neighbor` anzeigen und den Rahmen auf eine dünnere, dokumentartige Passbildfassung reduzieren.
- **`morning_briefing.png`:** Am meisten fehlt eine eindeutige visuelle Verbindung zwischen Porträt und Text. Eine Passbildzeile beziehungsweise Aktenbeschriftung direkt unter dem Bild würde mehr leisten als ein weiteres dekoratives Symbol.

## 4. **Raster & Rhythmus**

- **`day_report.png`:** Das äußere Raster ist grundsätzlich stabil: drei Karten mit gleichen Zwischenräumen, darunter ein Modul über dieselbe Gesamtbreite. Das innere Raster widerspricht aber der Informationsmenge, weil alle drei Karten dieselbe Breite und Höhe erhalten. Die mittlere Karte braucht etwa die doppelte Spaltenbreite der Außenkarten; anschließend sollten Kartenblock, Kennzahlen und Nachtbereich mit jeweils demselben vertikalen Rasterabstand aufeinanderfolgen.
- **`day_report.png`:** Zwischen Titel und Karten befindet sich relativ viel dunkler Zwischenraum, während die Milieus innerhalb der mittleren Karte eng aufeinanderliegen. Einen Teil dieses Außenabstands in höhere Zeilen beziehungsweise klarere Statusabstände im Zentrum investieren.
- **`day_report.png`:** In den Außenkarten entsteht tote Fläche unter jeweils zwei Textzeilen. Diese Leere liest sich nicht als bewusste Amtsästhetik, weil ihr formale Anker wie Formularlinien, Unterschriftsfelder oder Stempel fehlen.
- **`day_report_bottom.png`:** Der Scrollzustand zerstört die obere Rasterkante: Drei Karten beginnen außerhalb des Bildes und enden ohne Überschriften. Entweder alle Module als vollständige Blöcke scrollen lassen oder den gesamten Bericht so verdichten, dass kein Zwischenzustand dieser Art entsteht.
- **`day_report_bottom.png`:** Statusmodul und Nachtmodul teilen dieselbe linke und rechte Kante, der Button verlässt dieses Raster jedoch und zentriert sich im Viewport. Eine Ausrichtung an der rechten Dokumentkante würde den Abschluss ruhiger machen.
- **`morning_briefing.png`:** Die braune linke Leiste funktioniert potenziell als Aktenrücken, ist aber visuell nicht deutlich genug vom Papier organisiert. Eine durchgehende vertikale Naht und eine feste Leistenbreite von ungefähr einem Zehntel des Dokuments würden sie als Teil des Formulars statt als Restfläche lesbar machen.
- **`morning_briefing.png`:** Titel, Tageshinweis, Marina-Abschnitt und Button folgen links weitgehend einer Kante; rechts laufen die Zeilen jedoch fast bis zum Bildschirmrand. Durch eine begrenzte Textspalte entsteht rechts bewusst nutzbare Ruhe statt einer überlangen Satzfläche.
- **`morning_briefing.png`:** Das Porträt sitzt vertikal zwischen Dokumentkopf und zweitem Abschnitt und gehört dadurch zu keinem von beiden. Es braucht dieselbe Oberkante wie der Kopf oder exakt dieselbe Oberkante wie der von ihm bezeichnete Textblock.

## 5. **Lesbarkeit**

- **`day_report.png`:** „Redaktionsschluss“ ist im dunklen Kopf sehr klein und kontrastarm; es musste gegenüber den durchscheinenden Hintergrunddetails gesucht werden. Entweder leicht heller setzen oder näher an den Haupttitel ziehen.
- **`day_report.png`:** „ruhig“ und „wütend“ unterscheiden sich fast ausschließlich über ein kleines Wort am rechten Rand. Den abweichenden Zustand „wütend“ zusätzlich durch Gewicht, eine kompakte Warnmarke und eine leicht stärkere Zeilenkontur hervorheben, ohne ausschließlich Farbe zu verwenden.
- **`day_report.png`:** Die Kennzahlen „0 % / 150K / 0 %“ sind lesbar, aber zu klein im Verhältnis zur verfügbaren Fläche. Ihre Labels sind noch kleiner und werden durch die weit auseinandergezogene Anordnung kaum als zusammengehörige Gruppe wahrgenommen.
- **`day_report.png`:** Beim Deutungshoheitsbalken musste zweimal hingesehen werden, ob der volle blaue Balken einen Maximalwert, einen Hintergrund oder die Position der Institutionen bezeichnet. Eine Mitte und numerische Endwerte sind erforderlich.
- **`day_report_bottom.png`:** „Grundrauschen +0,2“ ist die schwächste und kleinste relevante Information im Bild. Die Zeile braucht dieselbe Schriftgröße wie die übrigen Nachtwerte oder muss als sauber ausgerichtete Unterzeile erkennbar sein.
- **`day_report_bottom.png`:** „Institutionen holen 0,0 Punkte Vertrauen zurück · Abwehr +0,2 → 8“ ist grammatisch lesbar, aber visuell nicht scanbar. Die beiden voneinander unabhängigen Änderungen sollten nicht in derselben fortlaufenden Zeile stehen.
- **`morning_briefing.png`:** „Laune: angespannt“ ist klein und weit vom Haupttitel entfernt; der Zustand wird erst beim zweiten Blick wahrgenommen. Näher an den Titel rücken und „angespannt“ stärker als das Label setzen.
- **`morning_briefing.png`:** Der Tageshinweis läuft über eine sehr lange Zeile und verlangt mehrere horizontale Blicksprünge. Kürzere Zeilen mit zwei bis drei kontrollierten Umbrüchen erhöhen die Lesegeschwindigkeit stärker als eine bloße Schriftvergrößerung.
- **`morning_briefing.png`:** Der Marina-Text ist kleiner und dichter als der Warnsatz, obwohl er eine konkrete Handlungsfrage enthält. Mindestens auf dieselbe Body-Größe setzen und zwischen Sprecherzeile und Zitat einen halben Zeilenabstand ergänzen.
- **`morning_briefing.png`:** Der aktive Zustand der rechten Taste „A“ ist nur durch eine leicht wärmere Fläche und Kontur erkennbar. Da diese Navigation hinter einem Briefing ohnehin sekundär sein sollte, ist Abdunkeln besser als eine noch stärkere Zustandsmarkierung.
- **`morning_briefing.png`:** „Verstanden“ verwendet im Bild keinen klar sichtbaren roten Stempelcharakter. Damit weicht die Aufnahme von der Primäraktions-Definition in `desinformation-network/src/story-mode/theme.ts` ab.

## 6. **Die drei wirksamsten Änderungen**

1. **`morning_briefing.png`: Hintergrund einschließlich HUD deutlich abdunkeln, Briefing-Titel eine Stufe vergrößern und „Verstanden“ als roten Stempel ausführen.** Das ist überwiegend ein CSS-/Layering-Eingriff und korrigiert mit wenig Aufwand die komplette Blickhierarchie.
2. **`day_report.png` und `day_report_bottom.png`: Den Tagesbericht auf eine Bildschirmhöhe verdichten, indem „Das Land“ doppelte Breite und eine zweispaltige Milieuliste erhält.** Damit verschwinden gleichzeitig tote Fläche, der unklare Scrollzustand und der abgeschnittene Kartenblock.
3. **`day_report.png` und `day_report_bottom.png`: Deutungshoheit und Nachtwerte in eindeutig gerichtete, numerisch beschriftete Darstellungen umwandeln.** Die wichtigsten Zustandsänderungen werden dadurch in Sekunden erfassbar, statt erst aus Balken und Fließtext entschlüsselt werden zu müssen.

## 7. **Blinde Flecken**

- **`day_report.png` / `day_report_bottom.png`:** Nicht erkennbar ist, ob per Mausrad, Tastatur oder automatisch gescrollt wird und ob es einen Scrollbalken, eine Seitenmarke oder ein Einrasten an Modulen gibt. Dafür werden Aufnahmen direkt vor und während des Scrollens benötigt.
- **`day_report.png`:** Fast alle Werte stehen auf null beziehungsweise „ruhig“. Ein Screenshot mit hohen Risiken, mehreren veränderten Milieus und tatsächlicher Gegenwehr ist nötig, um Balkenlängen, Warnzustände und Überläufe zu prüfen.
- **`day_report_bottom.png`:** Eine in der Beschreibung genannte „Tranche“ ist im sichtbaren Ausschnitt nicht identifizierbar. Falls sie nur in bestimmten Zuständen erscheint, wird ein Screenshot mit sichtbarer Tranche benötigt.
- **`morning_briefing.png`:** Nicht erkennbar ist, ob Gebäude und rechte Navigation während des Briefings weiterhin anklickbar sind oder nur visuell aktiv wirken. Ein Screenshot mit Hover beziehungsweise Fokus hinter dem Briefing würde den Modalzustand klären.
- **Alle drei Screenshots:** Hover, Tastaturfokus, gedrückter Zustand und Fokusrahmen der Primärbuttons sind nicht sichtbar. Dafür werden je ein Maus-Hover- und ein Tastaturfokus-Zustand benötigt.
- **Alle drei Screenshots:** Gezeigt ist nur eine Auflösung von 1280 × 720. Für Raster, Textumbruch und Pixel-Skalierung fehlen mindestens eine kleinere 16:9-Aufnahme sowie eine höhere Auflösung mit denselben Inhalten.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
