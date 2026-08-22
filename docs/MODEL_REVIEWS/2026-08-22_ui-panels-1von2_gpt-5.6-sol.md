# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „panels-1von2"

**Modell:** `gpt-5.6-sol` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-22
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-22T17:19:07.670Z · **Dauer:** 141.0 s
**Nutzung:** nicht gemeldet · **Kosten:** unbekannt · **Anbieter-Datensammlung:** ausgeschlossen (deny)

> ⚠️ **Wie das zu lesen ist:** Ein *fremdes* Modell hat einen **kuratierten Ausschnitt**
> des Projekts gesehen — nicht das laufende Spiel und nicht das ganze Repository. Es kann
> daher weder Laufzeitverhalten prüfen noch `file:line`-Belege verifizieren. Befunde sind
> **Hypothesen**, die vor dem Umsetzen am Code/an den Daten gegenzuprüfen sind. Die
> kanonische Wahrheit bleibt [`docs/VISION_LOCK.md`](../VISION_LOCK.md) bzw. die Spieldaten.

## Gestellte Frage

Sieh dir die beigefügten Screenshots des laufenden Spiels an und mache einen UX/UI-Durchgang. Die Optik soll eine Behörden-/Papierwelt sein (Stil-Anker und Farbtoken liegen bei). Sag mir: Wo führt das Bild den Blick falsch, welche Grafiken sitzen an der falschen Stelle oder in der falschen Größe, wo stimmen Abstände und Ausrichtung nicht, und welche drei Änderungen bringen am meisten? Sei so konkret, dass man es direkt umsetzen kann.

## Dieser Durchgang: Bündel „panels-1von2" (7 Screenshots)

Das siehst du, in dieser Reihenfolge:
- floor_directory.png — Etagen-Tableau (Fahrstuhl-Navigation, Taste F)
- terminal_vorgaenge.png — Vorgangs-Terminal (L2): kuratierte Tür-Auswahl mit M1-Vorgangsblättern (Wirkung/Preis/Frische-Stempel)
- terminal_archiv.png — Vorgangs-Terminal (L2): ARCHIV-Schublade mit Filter-/Such-/Porträt-Zeile (voller Katalog)
- panel_news.png — Seiten-Panel: Nachrichten
- panel_stats.png — Seiten-Panel: Statistiken/Gesellschaft
- panel_npcs.png — Seiten-Panel: Kontakte/NPCs
- panel_mission.png — Seiten-Panel: Auftrag/Mission

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
| 🖼 Bild | `floor_directory.png` | `desinformation-network/runs/visual-review/latest/shots/floor_directory.png` | 516 kB |
| 🖼 Bild | `terminal_vorgaenge.png` | `desinformation-network/runs/visual-review/latest/shots/terminal_vorgaenge.png` | 185 kB |
| 🖼 Bild | `terminal_archiv.png` | `desinformation-network/runs/visual-review/latest/shots/terminal_archiv.png` | 192 kB |
| 🖼 Bild | `panel_news.png` | `desinformation-network/runs/visual-review/latest/shots/panel_news.png` | 319 kB |
| 🖼 Bild | `panel_stats.png` | `desinformation-network/runs/visual-review/latest/shots/panel_stats.png` | 334 kB |
| 🖼 Bild | `panel_npcs.png` | `desinformation-network/runs/visual-review/latest/shots/panel_npcs.png` | 331 kB |
| 🖼 Bild | `panel_mission.png` | `desinformation-network/runs/visual-review/latest/shots/panel_mission.png` | 354 kB |

---

## Antwort des Modells

## 1. **Erster Eindruck**

### `floor_directory.png`
Zuerst fällt die große helle Papierfläche auf, danach der Titel „GEBÄUDE – ETAGEN“; die aktuell ausgewählte Etage wird erst deutlich später erkannt. Der Blick sollte nach dem Titel unmittelbar auf den aktuellen Standort und die verfügbaren Ziele gehen. Das gelingt nicht, weil Zeile 7 nur durch einen blassen Flächenton und einen schmalen roten Strich markiert ist. Die Etagenüberschriften sind typografisch kaum stärker als Hilfs- und Metatext, obwohl sie die Liste strukturieren sollen. Der abgedunkelte Gebäudehintergrund funktioniert als Kontext, konkurriert aber rechts noch mit den sichtbaren Tastenkacheln und oben mit der Uhr.

### `terminal_vorgaenge.png`
Das Auge landet zuerst auf den grellgelben Kartenrahmen und der horizontalen Linienstruktur, nicht auf Vorgangstiteln oder Kosten. Die eigentliche Entscheidung sollte von Vorgangstitel über Wirkung und Preis zu „AUSFÜHREN“ geführt werden. Stattdessen erzeugen gleich starke Rahmen, Texturen, Unterkästen und Buttons ein beinahe gleichförmiges Raster ohne klaren Schwerpunkt. Der grüne CRT-Rahmen wirkt wie eine andere Oberfläche als die angekündigte Behörden-/Papierwelt. Die unten angeschnittene zweite Kartenreihe signalisiert zwar Scrollinhalt, sieht ohne Scrollleiste oder Verlauf aber eher wie ein Layoutfehler aus.

### `terminal_archiv.png`
Der Blick springt zwischen dem hell markierten Tab „ARCHIV (88)“, den vielen Filterknöpfen, der Porträtzeile und den gelben Kartenrahmen. Sinnvoll wäre eine klare Folge aus Archivstatus, Suche, Filtern und anschließend Ergebnissen. Die beiden Filterzeilen sind dafür zu ähnlich gewichtet und visuell nicht als ein zusammenhängender Werkzeugbereich gefasst. Die Porträts tragen Identität, sind jedoch so klein und dunkel, dass Gesichter kaum schneller erfassbar sind als Namen. Auch hier dominieren Linienraster und gelbe Außenkanten stärker als Inhalt und Auswahlzustand.

### `panel_news.png`
Zuerst zieht das rote Kopfband „Die reale Vorlage“ den Blick an, danach Option A; das eigentliche Nachrichten-Panel bleibt nur als dunkler Streifen rechts sichtbar. Für einen Screenshot des Nachrichten-Panels müsste der Blick zuerst auf „NACHRICHTEN-FEED“ und dessen Inhalt beziehungsweise Leerzustand fallen. Das ist nicht dasselbe: Der Entscheidungsdialog verdeckt den größten Teil der relevanten Oberfläche und dimmt den Rest nahezu bis zur Unlesbarkeit. Zusätzlich reicht der Dialog bis an den unteren Bildschirmrand, wo die dritte Option abgeschnitten wird. Der sichtbare Leerzustand „Keine Nachrichten vorhanden“ besitzt hinter der Abdunklung weder ausreichendes Gewicht noch eine erkennbare Handlungsrichtung.

### `panel_stats.png`
Das rote Dialogkopfband und die großen Entscheidungsoptionen dominieren vollständig; die Kampagnenstatistik ist nur rechts hinter der Abdunklung zu erahnen. Erwartet wäre als erster Anker der aktuelle Status mit Tag, verbleibender Zeit und AP. Diese Kennzahlen sind zwar sichtbar, aber durch Überlagerung und Dimmung nicht seriös auf Hierarchie oder Kontrast prüfbar. Im Dialog selbst stehen die roten Prozentwerte weit rechts und wirken von den jeweiligen Optionstiteln abgekoppelt. Die abgeschnittene dritte Option am unteren Rand erzeugt zusätzlich den Eindruck, dass eine entscheidungsrelevante Information fehlt.

### `panel_npcs.png`
Der Blick bleibt erneut am roten Dialogkopf und anschließend an den Optionen A und B hängen. Das Kontakte-Panel sollte dagegen zuerst den ausgewählten Kontakt, dessen Beziehung und Rolle zeigen. Die sichtbare NPC-Liste rechts ist zu stark abgedunkelt und besitzt weder einen erkennbaren Auswahlzustand noch ausreichend deutliche Zeilentrennung. Namen, Beziehungsstatus und Balken liegen weit auseinander, sodass sie nicht als gemeinsame Datensätze gelesen werden. Auch dieser Screenshot zeigt damit primär den blockierenden Dialog und nicht die angekündigte Kontakte-Oberfläche.

### `panel_mission.png`
Der Entscheidungsdialog zieht den Blick vollständig auf sich; das „MISSION BRIEFING“ bleibt nur als dunkle Unterlage rechts stehen. Bei einem Auftrags-Panel müsste zuerst die Operation, dann die aktuelle Phase und anschließend das Ziel lesbar sein. Diese Hierarchie ist im sichtbaren Rest grundsätzlich angelegt, kann wegen der Abdunklung aber nicht belastbar beurteilt werden. Der Dialog stößt rechts genau an die Kante des Seiten-Panels, wodurch beide Flächen wie eine unbeabsichtigte geteilte Oberfläche wirken. Unten werden erneut Option C und damit ein Teil der Entscheidung verdeckt.

---

## 2. **Konkrete Eingriffe je Screen**

### `floor_directory.png`

- **Aktuelle Zeile 7 in `floor_directory.png` → Hintergrundkontrast etwa verdoppeln, roten linken Marker auf die volle Zeilenhöhe bringen und „HIER“ als rechtsbündigen Stempel innerhalb der Zeile platzieren → der aktuelle Standort muss nach dem Titel der stärkste Anker sein.**
- **Etagenüberschriften in `floor_directory.png` → auf etwa 1,15× der jetzigen Größe setzen, semibold auszeichnen und vor jeder Überschrift ungefähr eine halbe Zeilenhöhe mehr Abstand als danach geben → die neun Ziele werden dadurch in fünf klar erkennbare Gruppen gegliedert.**
- **Nummernkästen in `floor_directory.png` → alle auf identische Breite und Höhe bringen, vertikal mittig zum Zieltext ausrichten und den Abstand zum Text auf ungefähr eine halbe Kastenbreite vereinheitlichen → derzeit wirken Zahl und Ziel teilweise wie getrennte Spalten.**
- **Verwaiste Kellerüberschrift in `floor_directory.png` → entweder die zugehörige Zielzeile direkt darunter sichtbar machen oder die Überschrift aus dem aktuellen Ausschnitt entfernen → eine Gruppenüberschrift unmittelbar vor der Fußleiste suggeriert abgeschnittenen Inhalt.**
- **Fußzeile in `floor_directory.png` → Schrift um etwa ein Viertel vergrößern, einzelne Tasten als kompakte Keycaps setzen und links an der Inhaltskante der Liste ausrichten → die Bedienhilfe ist derzeit zu klein und zu gleichförmig für schnelles Erfassen.**

### `terminal_vorgaenge.png`

- **Terminalrahmen in `terminal_vorgaenge.png` → grünes Phosphor auf dunkles Kraftpapier mit `agencyBlue` beziehungsweise `tech` als Tintenakzent umstellen; Grün nur noch für einen bestätigten Systemzustand verwenden → die Aufnahme widerspricht der verbindlichen Papierwelt aus `desinformation-network/src/story-mode/theme.ts`.**
- **Gelbe Kartenrahmen in `terminal_vorgaenge.png` → durch den braunen `border`-Ton ersetzen und Warn-Gelb nur an Risiko- oder Frischehinweisen einsetzen → momentan ist jede Karte permanent als Warnung markiert und überstrahlt ihre Inhalte.**
- **Linienstruktur auf den Vorgangsblättern in `terminal_vorgaenge.png` → Deckkraft stark reduzieren oder nur in freien Papierbereichen zeigen, nicht direkt hinter Fließtext und Buttons → die eng stehenden Linien schneiden durch Buchstaben und verlangsamen das Lesen.**
- **Kartenkopf in `terminal_vorgaenge.png` → Titel über die volle Breite, Rechtsstatus direkt darunter und Kosten/Wirkung in einer einzigen rechtsbündigen Kennzahlenzeile anordnen → Titel, Legalität und Werte konkurrieren derzeit auf mehreren horizontalen Ebenen.**
- **Wirkungsblock in `terminal_vorgaenge.png` → auf die obere Kartenhälfte verkürzen, Frische-Stempel als einheitliche Chips in maximal zwei Zeilen setzen und Risiko/NPC-Bonus darunter auf eine gemeinsame Basislinie stellen → der wichtigste Vergleichsbereich ist momentan zu zerfasert.**
- **Unterer Anschnitt in `terminal_vorgaenge.png` → entweder eine komplette Kartenreihe zeigen und die nächste mit einem klaren Papierregister beziehungsweise Scrollindikator ankündigen oder die Kartenhöhe so reduzieren, dass zwei Reihen vollständig sichtbar sind → die abgeschnittenen Titel wirken aktuell wie ein Renderingfehler.**

### `terminal_archiv.png`

- **Werkzeugbereich in `terminal_archiv.png` → Tabzeile, Statusfilter und Suche in eine gemeinsame obere Zeile setzen; die Suche auf ungefähr die Hälfte der verfügbaren Breite legen und rechts an der Kartenkante ausrichten → aktuell verteilen sich gleich wichtige Bedienelemente ohne klare Reihenfolge über zwei Ebenen.**
- **Zuträgerfilter in `terminal_archiv.png` → als zweite, optisch eingerückte Filterzeile unter „ALLE/LEGAL/GRAUZONE/ILLEGAL/NEU“ setzen und links exakt mit dem ersten Filter beginnen → das Label „ZUTRÄGER“ und die Chips bilden momentan kein sauberes Unterraster.**
- **Porträtchips in `terminal_archiv.png` → Bildflächen auf etwa 1,5× vergrößern, Gesichter enger zuschneiden und Namen in gleich breiten Chips ausrichten → die Porträts sind derzeit zu klein und dunkel, um als visuelle Filter zu funktionieren.**
- **Aktiver Archiv-Tab in `terminal_archiv.png` → statt der hellgrünen Vollfläche eine helle Papierlasche mit dunkler Tinte und farbiger Unterkante verwenden → der Auswahlzustand bleibt klar, ohne zum hellsten Element der gesamten Oberfläche zu werden.**
- **Ergebniskarten in `terminal_archiv.png` → gelbe Rahmen und Scanlines wie in `terminal_vorgaenge.png` zurücknehmen; Karten durch Papierabstand und eine einfache braune Kontur trennen → das Archiv soll wie ein Katalog, nicht wie vier gleichzeitig aktive Alarme wirken.**
- **Unterer Ergebnisanschnitt in `terminal_archiv.png` → eine sichtbare Scrollleiste oder einen klaren unteren Verlauf innerhalb des Ergebnisbereichs ergänzen und mindestens den nächsten Kartentitel vollständig zeigen → der schmale Papierstreifen am unteren Rand vermittelt keine brauchbare Scrollposition.**

### `panel_news.png`

- **Überlagerungszustand in `panel_news.png` → Nachrichten-Panel und blockierenden Entscheidungsdialog gegenseitig ausschließen oder den Panel-Aufruf während des Dialogs deaktivieren → die Aufnahme zeigt zwei aktive Ebenen, von denen nur die falsche lesbar ist.**
- **Entscheidungsdialog in `panel_news.png` → auf höchstens etwa neun Zehntel der Bildschirmhöhe begrenzen, oben und unten gleiche Außenabstände lassen sowie den Optionsbereich intern scrollbar machen → Option C wird durch die feste Fußzeile abgeschnitten.**
- **Leerzustand im sichtbaren Nachrichtenbereich von `panel_news.png` → Meldung mittig im verfügbaren Panelbereich platzieren, mit einer kleinen Akten-/Meldungsmarke versehen und deutlich unter dem Paneltitel gruppieren → der einzelne Satz wirkt momentan verloren und wie nicht geladener Inhalt.**

### `panel_stats.png`

- **Überlagerungszustand in `panel_stats.png` → Statistik-Panel entweder oberhalb des Dialogs öffnen oder bis zum Abschluss der Entscheidung gesperrt lassen; nicht gleichzeitig sichtbar und abgedunkelt halten → derzeit ist weder Vergleich noch Interaktion mit den Statistiken möglich.**
- **Statuskopf im sichtbaren Teil von `panel_stats.png` → Tag, Wahltage und AP als drei gleich breite Kennzahlenblöcke auf einer gemeinsamen Grundlinie ausrichten → die Zahlen sitzen in unterschiedlichen Höhen und wirken nicht als zusammengehörige Übersicht.**
- **Ressourcenzeilen in `panel_stats.png` → Bezeichnungen links, aktuelle Werte rechts und Balken immer darunter mit identischer Breite ausrichten → die sichtbaren Werte und Balken besitzen keine schnell erfassbare gemeinsame Messkante.**
- **Entscheidungsdialog in `panel_stats.png` → rote Risiko- und Aufmerksamkeitswerte direkt untereinander in einem festen rechten Kennzahlenblock ausrichten, dessen Abstand zum Titel in allen Optionen identisch ist → die Werte schweben derzeit optisch neben dem Text.**

### `panel_npcs.png`

- **Überlagerungszustand in `panel_npcs.png` → Kontakte-Panel nicht hinter einem blockierenden Dialog geöffnet lassen → der Spieler sieht Kontaktinformationen, kann sie aber weder sicher lesen noch sinnvoll als Entscheidungshilfe verwenden.**
- **Kontaktzeilen im sichtbaren Bereich von `panel_npcs.png` → jede Zeile durch eine leichte horizontale Regel trennen und Name, Status sowie Rollenbezeichnung an drei konstanten Achsen ausrichten → die Datensätze fließen aktuell optisch ineinander.**
- **Beziehungsbalken in `panel_npcs.png` → alle rechtsbündig mit identischer Breite setzen und den Status unmittelbar links davon platzieren → die kleinen Balken sind zu weit vom jeweiligen Namen entfernt.**
- **Fehlender visueller Kontaktanker in `panel_npcs.png` → links jeder sichtbaren Kontaktzeile ein quadratisches, eng beschnittenes Porträt in ungefähr doppelter Zeilenhöhe vorsehen → die Liste lässt sich sonst nur seriell über Namen durchsuchen.**

### `panel_mission.png`

- **Überlagerungszustand in `panel_mission.png` → Auftrag und Entscheidungsdialog nicht gleichzeitig als aktive Schichten zeigen; bei blockierender Entscheidung den Panelaufruf sperren oder den Auftrag bewusst in den Dialog integrieren → die aktuelle Überlagerung wirkt zufällig statt funktional.**
- **Briefingkarten im sichtbaren Teil von `panel_mission.png` → linke Innenkante von Operation, Phase und Direktive vereinheitlichen und zwischen den Karten einen Abstand von ungefähr einer halben Titelzeile halten → die sichtbaren Kästen wirken derzeit unabhängig voneinander statt wie eine Akte.**
- **Phasenzeile in `panel_mission.png` → „AKTUELLE PHASE“ links und „TAG 2 / WAHL IN 38 TAGEN“ rechts auf derselben Basislinie setzen, mit einem klaren vertikalen Trenner zwischen beiden → Status und Zeitbezug sind momentan nur schwach gekoppelt.**
- **Entscheidungsdialog in `panel_mission.png` → unteren Inhalt scrollbar machen und die Fußnote außerhalb der Optionsfläche halten → Option C darf nicht unter einer festen Abschlussleiste verschwinden.**

---

## 3. **Grafiken/Assets**

- **`floor_directory.png`:** Die Papierfläche und die leicht unregelmäßige Materialtönung tragen die Behördenakte. Es fehlen keine großen Illustrationen; weitere Dekoration würde die Navigation eher schwächen. Die sichtbaren Weltelemente hinter dem Modal sind ausreichend gedimmt, nur die rechten Tastenkacheln bleiben als scharfe Fremdkörper zu präsent.
- **`terminal_vorgaenge.png`:** Die Vorgangsblätter als Papierkarten tragen die inhaltliche Metapher. Fremd wirken der grüne CRT-Rahmen, die Neonbeschriftung und die grellgelben Außenkanten: Sie passen weder zum Papier-Lock in `desinformation-network/src/story-mode/theme.ts` noch zum Tech-Cyan statt Neon-Grün aus `sprite-tool/public/context/game-style-guide.md`. Die horizontale Textur ist zu kantenscharf und zu hochfrequent; sie liest sich als Bildschirmstörung statt Papierfaser.
- **`terminal_archiv.png`:** Die kleinen Personenporträts sind das nützlichste Bildmaterial, verlieren aber durch geringe Größe, dunklen Tonwert und lockeren Ausschnitt ihre Funktion. Gesichter sollten enger auf Kopf und Schulter beschnitten, innerhalb identischer Rahmen skaliert und leicht aufgehellt werden. Ein Aktenreiter oder Schubladenetikett am aktiven Archiv-Tab würde die Papiermetapher stärker tragen als die aktuelle grüne Vollfläche.
- **`panel_news.png`:** Vom Nachrichten-Panel ist außer Text kein belastbar beurteilbares Asset sichtbar. Im sichtbaren Leerzustand fehlt ein kleiner, einfacher Akten- oder Meldungsstempel als visueller Anker; kein großes Illustrationsbild.
- **`panel_stats.png`:** Die Grafiken und Balken liegen unter der Abdunklung und können nicht auf Kantenschärfe oder Sättigung geprüft werden. Sichtbar ist nur, dass sie wegen des modalen Zustands praktisch verschwinden.
- **`panel_npcs.png`:** Im sichtbaren Listenausschnitt fehlen Porträts als schnelle Identifikatoren. Wenn die Liste bewusst textuell bleiben soll, braucht sie zumindest deutlichere Zeilenmarken; visuell wäre ein einheitlich zugeschnittenes quadratisches Porträt pro Kontakt wirksamer.
- **`panel_mission.png`:** Das sichtbare Briefing arbeitet fast nur mit Rahmen und Text. Eine kleine abstrakte Dienststellenmarke im Operationskopf könnte tragen, solange sie fiktiv bleibt; das schwarze sechseckige Zeichen wirkt in der Aufnahme dagegen isoliert und semantisch unbestimmt.

---

## 4. **Raster & Rhythmus**

- **`floor_directory.png`** besitzt ein grundsätzlich stabiles einspaltiges Raster, aber zu wenig Unterschied zwischen Gruppenabstand und Zeilenabstand. Vor einer neuen Etagenüberschrift sollte deutlich mehr Luft stehen als zwischen Überschrift und erster Zielzeile. Der Kellerkopf am Ende bricht den Rhythmus, weil ihm keine sichtbare Zeile folgt. Titel, Inhaltskante und Fußzeile sollten dieselbe linke Achse verwenden.
- **`terminal_vorgaenge.png`** teilt die Fläche sauber in zwei gleich breite Spalten, überlädt aber jede Karte mit mehreren ineinanderliegenden Rahmen. Außenrahmen, Wirkungsrahmen, Stempelrahmen und Buttonrahmen konkurrieren. Eine Karte sollte nur eine Außenkante, eine klare Kopfzone, einen ungerahmten Hauptbereich und eine Aktionsleiste besitzen. Zwischen den beiden Spalten reicht der Abstand; innerhalb der Karten fehlt dagegen vertikaler Atem.
- **`terminal_archiv.png`** hat oben drei konkurrierende Raster: Tabs, Statusfilter/Suche und Zuträgerchips. Diese sollten auf dieselbe linke Kartenkante und dieselben Kontrollhöhen gebracht werden. Die Suchleiste ist zwar breit genug, wirkt aber durch ihre Position hinter mehreren kleinen Knöpfen wie ein Restfeld. Unterhalb der Werkzeuge fehlt ein stärkerer Abstand vor den Ergebniskarten.
- **`panel_news.png`, `panel_stats.png`, `panel_npcs.png` und `panel_mission.png`** zeigen denselben problematischen Bildaufbau: Der Dialog endet exakt dort, wo das Seiten-Panel beginnt. Dadurch entsteht eine harte vertikale Teilung, obwohl das Seiten-Panel nur Hintergrund ist. Entweder muss der Dialog als alleinige aktive Ebene zentriert sein oder das Seiten-Panel vollständig übernehmen; die derzeitige Halb-und-halb-Komposition ist visuell uneindeutig.
- Der wiederholte Entscheidungsdialog nutzt seine Höhe schlecht: große Karten, viel Innenraum, aber keine vollständige dritte Option. Die feste Fußnote nimmt unten Platz weg, ohne als Aktion zu dienen. Eine kompaktere Optionenhöhe oder ein klarer Scrollbereich würde den vertikalen Rhythmus reparieren.

---

## 5. **Lesbarkeit**

- In **`floor_directory.png`** musste ich bei „ETAGE 1 – ZENTRALE ← HIER“ zweimal hinsehen, weil „HIER“ klein in der Gruppenüberschrift steht, während die eigentliche Auswahl nur blass markiert ist. Auch die Bedienzeile am unteren Rand ist für ihre Funktion zu klein. Die Zielnamen selbst sind ausreichend lesbar, benötigen aber einen stärkeren aktiven Zustand.
- In **`terminal_vorgaenge.png`** sind besonders „RISIKO“, „KONSEQUENZ WAHRSCHEINLICH“ und die Frische-Stempel durch Linienstruktur, geringe Schriftgröße und mehrere Tintenfarben mühsam. Die Kennzahlen direkt unter den Beschreibungen sehen teilweise wie kleine Stempel oder Icons ohne eindeutige Beschriftung aus. Grün als Standardtext, Rot als Risiko, Gelb als Rahmen und Beige als Papier erzeugen zu viele gleichzeitige Kontrastsignale.
- In **`terminal_archiv.png`** musste ich die Namen der Zuträgerchips und mehrere Legalitätsfilter zweimal lesen. Die Porträts helfen dabei kaum. Die aktive Auswahl ist zwar sehr deutlich, aber so hell, dass inaktive Filter wie deaktivierte Zustände wirken.
- In **`panel_news.png`** ist der eigentliche Nachrichteninhalt wegen der Abdunklung nicht lesbar. Im Dialog sind die Optionstitel klar, die Technikzeile dagegen deutlich kleiner und schwächer. Option C ist nicht vollständig sichtbar.
- In **`panel_stats.png`** sind Tag, Wahltage und AP nur mit Anstrengung zu erkennen; das liegt überwiegend am modalen Dimmer, nicht belastbar an den Grundfarben des Panels. Die roten Prozentwerte im Dialog sind klein und räumlich weit von ihren erklärenden Texten entfernt.
- In **`panel_npcs.png`** sind Rollenbezeichnungen, Statuswörter und Beziehungsbalken hinter der Abdunklung kaum zuzuordnen. Ein ausgewählter, neuer oder gesperrter Kontakt ist im sichtbaren Zustand nicht erkennbar.
- In **`panel_mission.png`** sind Operationstitel und Phasenzeile noch zu erahnen, die längere Direktive jedoch nicht sinnvoll lesbar. Im Dialog fehlen ein klar sichtbarer Fokuszustand und die vollständige dritte Option.
- Für **aktiv/gesperrt/neu** ist in den Aufnahmen insgesamt nur das Archiv-Tab eindeutig. `floor_directory.png` besitzt einen zu schwachen Aktivzustand; bei den vier Seiten-Panels sind Zustände wegen der Überlagerung nicht bewertbar.

---

## 6. **Die drei wirksamsten Änderungen**

1. **Die Überlagerung in `panel_news.png`, `panel_stats.png`, `panel_npcs.png` und `panel_mission.png` beseitigen** — vier von sieben Aufnahmen zeigen nicht den angekündigten Screen, sondern denselben blockierenden Dialog; eine saubere Zustands- oder Capture-Trennung bringt mit geringem Aufwand den größten Erkenntnis- und UX-Gewinn.
2. **In `terminal_vorgaenge.png` und `terminal_archiv.png` Scanlines, Neongrün und gelbe Vollrahmen auf Papier-, Braun- und Tintenrollen reduzieren** — dadurch werden Stiltreue und Lesbarkeit gleichzeitig verbessert, ohne die Kartenstruktur neu bauen zu müssen.
3. **Den Entscheidungsdialog auf eine begrenzte Höhe mit internem Scrollbereich und vollständig sichtbarer Option C umbauen** — die aktuelle Abschneidung betrifft vier Aufnahmen und kann eine spielentscheidende Auswahl verbergen.

---

## 7. **Blinde Flecken**

- Bei **`panel_news.png`, `panel_stats.png`, `panel_npcs.png` und `panel_mission.png`** ist nicht erkennbar, ob der Entscheidungsdialog absichtlich blockiert, durch einen fehlerhaften Capture-Zustand stehen geblieben ist oder gleichzeitig mit Seiten-Panels bedienbar sein soll. Benötigt werden dieselben vier Screens ohne Dialog und ohne Abdunklung.
- Für **`terminal_vorgaenge.png`** und **`terminal_archiv.png`** fehlen Screenshots nach Scrollen sowie mit Hover, Tastaturfokus, ausgewähltem Filter und deaktiviertem „AUSFÜHREN“-Zustand.
- In **`floor_directory.png`** ist nicht sichtbar, ob Zeilen bei Hover oder Tastaturnavigation deutlicher hervorgehoben werden und ob der Keller über Scrollen oder eine andere Taste erreichbar ist.
- Nicht beurteilbar sind Öffnungs-/Schließanimationen, Fokuswechsel, Scrollgeschwindigkeit, akustisches Feedback und die Reihenfolge beim Tabben.
- Für kleine Auflösungen fehlen Aufnahmen, insbesondere dafür, ob der Entscheidungsdialog weiter überläuft, die Terminalkarten in eine Spalte wechseln und die Fußleisten Text verlieren.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
