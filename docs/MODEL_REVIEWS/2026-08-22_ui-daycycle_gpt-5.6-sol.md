# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „daycycle"

**Modell:** `gpt-5.6-sol` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-22
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-22T17:09:26.285Z · **Dauer:** 157.4 s
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
| 🖼 Bild | `day_report.png` | `desinformation-network/runs/visual-review/latest/shots/day_report.png` | 90 kB |
| 🖼 Bild | `day_report_bottom.png` | `desinformation-network/runs/visual-review/latest/shots/day_report_bottom.png` | 87 kB |
| 🖼 Bild | `morning_briefing.png` | `desinformation-network/runs/visual-review/latest/shots/morning_briefing.png` | 425 kB |

---

## Antwort des Modells

## 1. **Erster Eindruck**

### `day_report.png`
Der Blick landet zuerst auf dem roten Titel, springt dann aber sofort in die dicht gefüllte mittlere Karte „Das Land“. Eigentlich sollte die Reihenfolge Titel → ausgespielte Maßnahme → wichtigste Wirkung → Reaktion des Landes sein. Die drei gleich großen Karten behaupten gleiche Bedeutung, obwohl links und rechts fast leer sind und nur die Mitte echte Informationsdichte besitzt. Der breite Kennzahlenblock darunter wirkt wie ein zweiter, kaum verbundener Bildschirmabschnitt statt wie das Fazit derselben Akte. Insgesamt treffen die Farben die Papierwelt, die Anordnung wirkt jedoch noch wie ein Dashboard aus beig eingefärbten Web-Karten.

### `day_report_bottom.png`
Durch den Scrollstand beginnt `day_report_bottom.png` mit abgeschnittenen Karten; ohne den vorherigen Screenshot ist nicht mehr erkennbar, in welchem Dokumentabschnitt man sich befindet. Zuerst fallen „138K“ und danach der rote Weiter-Button auf, während die eigentlich neue Information „Über Nacht“ visuell zurücktritt. Die großen vertikalen Abstände zwischen Kennzahlen, Nachtbericht und Button verlängern den Weg ohne zusätzlichen Informationswert. Der Button ist als Primäraktion erkennbar, sitzt aber wie ein separates Menüelement unter der Akte. Eine im Paket angekündigte „Tranche“ ist auf `day_report_bottom.png` nicht sichtbar und daher hier nicht beurteilbar.

### `morning_briefing.png`
Der detaillierte Gebäudequerschnitt und seine vielen Beschriftungen konkurrieren zunächst mit dem Briefing; erst danach zieht die große Papierfläche den Blick nach unten. Innerhalb des Dokuments wird zuerst der große Satz „Mir gefällt das nicht“ gelesen, nicht die kleine Überschrift „Morgenbriefing – Tag 2“. Das wäre vertretbar, wenn das Direktorenporträt räumlich diesem Satz zugeordnet wäre, es sitzt jedoch deutlich tiefer neben dem Tageshinweis. Die rechte HUD-Leiste und die obere Uhr bleiben optisch und mutmaßlich interaktiv präsent, obwohl das Briefing eine fokussierte Entscheidungssituation ist. Der CTA ist auffindbar, aber gegenüber dem roten Stempel-CTA des Tagesberichts zu klein und zu neutral.

## 2. **Konkrete Eingriffe je Screen**

### `day_report.png`

- **Gesamthöhe des Tagesberichts in `day_report.png` → Kartenzeilen und Zwischenräume so verdichten, dass Nachtbericht und Weiter-Aktion bei dieser 16:9-Höhe zumindest angeschnitten angekündigt werden; alternativ einen festen Dokumentkopf und -fuß verwenden → aktuell ist nicht erkennbar, dass unterhalb der Kennzahlen entscheidender Inhalt folgt.**
- **Dreispaltenraster in `day_report.png` → mittlere Karte auf etwa 42–46 % der nutzbaren Breite erweitern, linke und rechte Karte auf je etwa 27–29 % reduzieren → die identischen Drittel erzeugen große Leerflächen und quetschen ausgerechnet die acht Länderzeilen.**
- **Kartenhöhe in `day_report.png` → die Zeilen in „Das Land“ um etwa ein Fünftel vertikal verdichten und die beiden leeren Karten nicht künstlich bis auf dieselbe Inhaltsmenge strecken; alle drei dürfen weiterhin dieselbe Außenhöhe behalten → so bleibt das Raster ruhig, ohne dass zwei Drittel der Fläche wie unbefüllte Platzhalter wirken.**
- **Milieu-Balken in `day_report.png` → Balkenhöhe auf etwa das 1,5-Fache erhöhen, Statuswort enger an den jeweiligen Balken koppeln und den roten Ein-Pixel-Anteil durch einen klaren Positionsmarker oder eine sichtbar geteilte Skala ersetzen → die aktuelle Wirkung ist erst beim zweiten Hinsehen erkennbar.**
- **Kennzahlenblock in `day_report.png` → Höhe um ungefähr ein Viertel reduzieren, Labels und Werte als kompakte Dreierzeile oberhalb der Deutungshoheitsskala gruppieren → drei Zahlen benötigen nicht fast so viel Höhe wie der gesamte Nachtbericht.**
- **Rechter Bildschirmrand in `day_report.png` → darunterliegende Shortcut-Leiste vollständig vom Overlay abdecken oder während des Berichts ausblenden → der sichtbare HUD-Rest durchbricht die Aktenfläche und suggeriert parallele Bedienbarkeit.**

### `day_report_bottom.png`

- **Scrollkontext in `day_report_bottom.png` → Dokumenttitel als schmalen, festen Kopf stehen lassen oder oberhalb der Kennzahlen eine persistente Zeile „Lagebericht – Tag 1“ zeigen → abgeschnittene Karten am oberen Rand wirken sonst wie ein Darstellungsfehler statt wie fortgesetztes Scrollen.**
- **Vertikaler Rhythmus in `day_report_bottom.png` → Abstand Karten–Kennzahlen, Kennzahlen–Nachtbericht und Nachtbericht–CTA jeweils auf ungefähr eine gemeinsame Karteninnenbreite vereinheitlichen → derzeit entstehen drei unterschiedlich große schwarze Trennzonen.**
- **Deutungshoheitsskala in `day_report_bottom.png` → einen eindeutig lesbaren Stand eintragen: geteilte rote/blaue Fläche oder Marker plus Wert direkt über der Skala; Endbegriffe exakt an deren Außenkanten setzen → der vollständig blaue Balken ist ohne Skalenwert semantisch mehrdeutig.**
- **„Über Nacht“-Block in `day_report_bottom.png` → Hauptänderung „Abwehr +2,8 → 11“ typografisch hervorheben, Nebeneffekte darunter kleiner, aber mit mehr Zeilenabstand setzen → aktuell konkurrieren Fließsatz, Zahlen und Trennpunkte auf nahezu derselben Ebene.**
- **„Nächster Tag“-Button in `day_report_bottom.png` → als fester Dokumentfuß direkt an die Unterkante der Akte binden und um etwa 15–20 % breiter machen → die Primäraktion bleibt dadurch auch bei abweichender Berichtslänge sichtbar und wirkt nicht im schwarzen Hintergrund ausgesetzt.**
- **Tranche in `day_report_bottom.png` → falls sie in diesem Zustand vorhanden sein soll, als eigener klar abgegrenzter Papierabschnitt zwischen „Über Nacht“ und CTA ausgeben; falls sie bedingt entfällt, keine leere Reservefläche vorsehen → auf der Aufnahme ist keine als Tranche identifizierbare Information vorhanden.**

### `morning_briefing.png`

- **Hintergrund in `morning_briefing.png` → Gebäude oberhalb des Dokuments um etwa ein Drittel abdunkeln und leicht entsättigen; Uhr, Menü und rechte Shortcut-Leiste zusätzlich deaktiviert darstellen oder ausblenden → die Gebäudedetails konkurrieren unnötig mit dem Briefing.**
- **Direktorenporträt in `morning_briefing.png` → vom mittleren Bereich der linken Leiste nach oben verschieben, sodass seine Oberkante mit „Morgenbriefing – Tag 2“ beziehungsweise dem ersten Direktorensatz fluchtet → derzeit scheint das Porträt eher den Tageshinweis als die Eingangsaussage zu sprechen.**
- **Dokumentbreite in `morning_briefing.png` → rechte Kante vor der persistenten HUD-Leiste enden lassen oder die HUD-Leiste ganz entfernen; CTA und Trennlinien an dieselbe neue rechte Innenkante setzen → Panel und Systemnavigation belegen momentan denselben Randbereich.**
- **Briefingkopf in `morning_briefing.png` → „Morgenbriefing – Tag 2“ um etwa 25 % vergrößern und „Laune: angespannt“ als kleines Tinten-Badge auf derselben Grundlinie führen → Dokumenttyp und Tageswechsel müssen vor dem Direktorenkommentar erfassbar sein.**
- **Tageshinweis in `morning_briefing.png` → Textzeile auf ungefähr drei Viertel der Papierbreite begrenzen und die zwei Handlungsorte als zwei eingerückte Aufträge umbrechen → die fast bildschirmbreite Zeile ist bei der Pixelschrift mühsam zu verfolgen.**
- **„Verstanden“-Button in `morning_briefing.png` → auf dieselbe rote Doppelring-/Stempelbehandlung wie „Nächster Tag“ umstellen und etwa 20 % größer setzen → beide Screens schließen denselben Tageszyklus ab, zeigen aber aktuell zwei verschieden starke CTA-Sprachen.**

## 3. **Grafiken/Assets**

- **`day_report.png` und `day_report_bottom.png`:** Es gibt keine eigentlichen Illustrationen, die falsch platziert wären. Das Problem ist nicht fehlender Bildschmuck, sondern fehlende Materialhierarchie: Die gleichfarbigen Rechtecke sehen wie flache Web-Panels aus, obwohl `desinformation-network/src/story-mode/theme.ts` ausdrücklich eine „Behörden-Akte“ aus Papier vorsieht. Eine gemeinsame Kraftpapier-Unterlage hinter allen Abschnitten, darauf leicht unterschiedlich helle Dokumentblätter mit sehr schwacher Faserung und klaren Papierkanten, würde mehr bringen als zusätzliche Icons. Die Textur sollte nur wenige Helligkeitsstufen variieren und pixelgenau bleiben; fotografisches Papierkorn oder weiche Schlagschatten würden dem Stil widersprechen.

- **`day_report.png`:** Die großen Leerflächen in „Was wir ausspielten“ und „Die Gegenseite“ sollten nicht mit dekorativen Grafiken gefüllt werden. Stattdessen müssen diese Karten schmaler oder in ihrer Höhe beziehungsweise Informationsstruktur kompakter werden. Ein großer Stempel mit dem wichtigsten Tagesurteil könnte rechts neben dem Berichtstitel funktionieren, aber nur, wenn tatsächlich ein klarer Urteilstatus existiert; er darf nicht als bedeutungslose Dekoration erfunden werden.

- **`morning_briefing.png`:** Der Gebäudequerschnitt ist scharf und in seiner Pixelauflösung konsistent, trägt aber in diesem Zustand zu viel Kontrast und Kleindetail. Die oberen Raumbezeichnungen „Zielgruppen-Analyse“ und „Newsroom“ werden zudem am Bildrand angeschnitten; entweder die Kamera um etwa eine Labelhöhe absenken oder diese Hintergrundbeschriftungen während des Briefings ausblenden. Das Direktorenporträt wirkt gröber gepixelt und kontrastreicher als die Figuren im Gebäude: nur ganzzahlig skalieren, keine Interpolation verwenden und die Pixeldichte an die feinere Umgebung annähern.

- **Fehlendes Asset mit größtem Nutzen:** In `day_report.png` und `day_report_bottom.png` fehlt vor allem eine durchgehende Aktenunterlage, die Titel, Karten, Kennzahlen und Nachtbericht als ein Dokument bindet. In `morning_briefing.png` fehlt keine weitere Illustration; dort fehlt eine Fokusmaske zwischen Briefingpapier und Gebäudegrafik.

## 4. **Raster & Rhythmus**

- **`day_report.png`:** Die äußeren Kanten der drei Karten und des Kennzahlenblocks sind sauber miteinander verbunden, die innere Gewichtung ist es nicht. Das gleiche Drittelraster ignoriert das Verhältnis von acht Zeilen in der Mitte zu jeweils ein bis zwei Zeilen außen. Zwischen Titel, Karten, Kennzahlen und angeschnittenem Nachtbericht liegen jeweils relativ große schwarze Zonen; dadurch zerfällt die Akte in unabhängige Module. Die größte tote Fläche entsteht in der unteren Hälfte der linken und rechten Karte.

- **`day_report_bottom.png`:** Der Scrollstand zerstört die vertikale Gruppierung, weil der Bildschirm oben mitten in drei Karten beginnt. Kennzahlen und Nachtbericht haben dieselbe Außenbreite, aber stark unterschiedliche Innenabstände; der Nachtbericht sitzt deutlich näher an seiner Oberkante als die Kennzahlen an ihrer. Der CTA übernimmt keine Kante des Dokuments, sondern ist nur auf dem Bildschirm zentriert. Er sollte entweder an der Dokumentmitte oder an der rechten Textkante ausgerichtet und als Fußbereich angebunden werden, nicht frei zwischen Schwarzflächen schweben.

- **`morning_briefing.png`:** Die linke Porträtleiste, die Papierfläche und die rechte HUD-Leiste bilden drei konkurrierende vertikale Streifen. Innerhalb des Papiers sind linke Textkante und Trennlinien weitgehend konsistent, der Inhalt ist aber zu horizontal gestreckt. Das Porträt sitzt nicht auf einer gemeinsamen Achse mit einem Sprechertext. Rechts endet der Inhaltsbereich zu nah an der Systemleiste; dort fehlt eine klare Sicherheitszone von mindestens einem normalen Dokument-Innenabstand.

## 5. **Lesbarkeit**

- **`day_report.png`:** „Redaktionsschluss“ ist zu klein und zu stark gesperrt; es ist eher Textur als lesbare Zwischenüberschrift. Bei den Milieus musste ich die dünnen roten Balken und die Statuswörter „ruhig“, „misstrauisch“ und „wütend“ zweimal ansehen, weil Kontrast und Größe kaum Hierarchie erzeugen. „Wirkung: klein“ ist deutlich stärker als die eigentliche Maßnahme „Bot-Netzwerk gestartet“ und kehrt dadurch Inhalt und Bewertung um. Die Deutungshoheitsskala zeigt keine direkt ablesbare Position.

- **`day_report_bottom.png`:** „Über Nacht“ ist kleiner als die weniger wichtige Kennzahlzeile darüber. Die Nebenzeile „Lärm +2,6 · Grundrauschen +0,2“ ist zwar kontrastreich genug, aber durch geringe Größe und engen Zeilenabstand schwer zu scannen. „Abwehr +2,8 → 11“ ist die wichtigste Zustandsänderung, wird jedoch nur in den Satz eingebettet. Ein aktiver, gesperrter oder bereits ausgelöster Zustand des Weiter-Buttons ist auf der statischen Aufnahme nicht erkennbar.

- **`morning_briefing.png`:** „Morgenbriefing – Tag 2“, „Tageshinweis“ und „Laune: angespannt“ sind im Verhältnis zum Fließtext zu klein. Der lange Tageshinweis verlangt wegen seiner Zeilenlänge mehrere Rücksprünge; besonders der Wechsel von „Marina im Medien-Zentrum“ zu „Operationszentrale (Etage 4)“ geht im Satz unter. „Marina – Vorgriff“ ist durch Blau als Verweis lesbar, aber nicht eindeutig als neuer beziehungsweise optionaler Hinweis markiert. Die hervorgehobene Taste „A“ in der rechten Leiste wirkt weiterhin aktiv, obwohl das Briefing den Interaktionsfokus beanspruchen sollte.

## 6. **Die drei wirksamsten Änderungen**

1. **`day_report.png`/`day_report_bottom.png`: Bericht auf eine Bildschirmhöhe verdichten und den Weiter-CTA als festen Dokumentfuß führen.** Das beseitigt den größten Navigationsbruch und verhindert, dass Nachtfolgen oder Abschlussaktion unentdeckt bleiben.

2. **`morning_briefing.png`: Hintergrund samt HUD deutlich zurücknehmen und das Porträt an den Eingangssatz verschieben.** Das ist mit Scrim, Sichtbarkeitszuständen und einer Positionsänderung relativ günstig, korrigiert aber sofort Blickführung und Sprecherzuordnung.

3. **`day_report.png`: Dreispaltenraster nach Informationsmenge gewichten und Milieu-/Deutungshoheitsanzeigen eindeutig codieren.** Dadurch verschwinden große Leerflächen, die zentrale Wirkung wird besser lesbar und der Bericht hört auf, wie ein gleichförmiges Dashboard zu wirken.

## 7. **Blinde Flecken**

- **`day_report.png` und `day_report_bottom.png`:** Nicht erkennbar ist, ob ein Mausrad-, Tastatur- oder sichtbarer Scrollhinweis existiert, ob der Titel beim Scrollen feststeht und wie der Bericht bei mehreren ausgespielten Maßnahmen oder aktiver Gegenwehr wächst.
- **`day_report_bottom.png`:** Für die angekündigte Tranche wird ein Screenshot benötigt, in dem dieser Abschnitt tatsächlich sichtbar beziehungsweise befüllt ist; auf der vorliegenden Aufnahme lässt er sich nicht identifizieren.
- **`morning_briefing.png`:** Nicht erkennbar ist, ob Gebäude, HUD und Shortcut-Leiste während des Briefings noch anklickbar sind oder nur optisch aktiv wirken.
- **Alle drei Screens:** Hover-, Fokus-, gedrückt-, gesperrt- und bereits-bestätigt-Zustände der CTAs fehlen ebenso wie Übergangsanimationen zwischen Abendbericht und Morgenbriefing.
- **Alle drei Screens:** Für die Skalierungsprüfung fehlen Aufnahmen bei kleinerer Fensterhöhe, schmalerem Seitenverhältnis und UI-Vergrößerung; besonders Tagesbericht, langer Tageshinweis und rechter HUD-Rand sind dort gefährdet.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
