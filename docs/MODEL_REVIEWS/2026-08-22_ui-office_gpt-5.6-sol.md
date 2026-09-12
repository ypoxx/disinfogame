# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „office"

**Modell:** `gpt-5.6-sol` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-22
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-22T17:19:07.670Z · **Dauer:** 102.7 s
**Nutzung:** nicht gemeldet · **Kosten:** unbekannt · **Anbieter-Datensammlung:** ausgeschlossen (deny)

> ⚠️ **Wie das zu lesen ist:** Ein *fremdes* Modell hat einen **kuratierten Ausschnitt**
> des Projekts gesehen — nicht das laufende Spiel und nicht das ganze Repository. Es kann
> daher weder Laufzeitverhalten prüfen noch `file:line`-Belege verifizieren. Befunde sind
> **Hypothesen**, die vor dem Umsetzen am Code/an den Daten gegenzuprüfen sind. Die
> kanonische Wahrheit bleibt [`docs/VISION_LOCK.md`](../VISION_LOCK.md) bzw. die Spieldaten.

## Gestellte Frage

Sieh dir die beigefügten Screenshots des laufenden Spiels an und mache einen UX/UI-Durchgang. Die Optik soll eine Behörden-/Papierwelt sein (Stil-Anker und Farbtoken liegen bei). Sag mir: Wo führt das Bild den Blick falsch, welche Grafiken sitzen an der falschen Stelle oder in der falschen Größe, wo stimmen Abstände und Ausrichtung nicht, und welche drei Änderungen bringen am meisten? Sei so konkret, dass man es direkt umsetzen kann.

## Dieser Durchgang: Bündel „office" (1 Screenshots)

Das siehst du, in dieser Reihenfolge:
- office.png — Spielerbüro (PlayerOfficeView) mit Hotspots/Einsteiger-Hinweisen

Beurteile **nur diese** Aufnahmen, dafür gründlich. Andere Teile des Spiels kommen in
eigenen Durchgängen dran — verweise nicht auf Dinge, die du hier nicht siehst.

## Gezeigter Ausschnitt

15.047 Zeichen ≈ 4.180 Tokens (geschätzt) aus 3 Quellen · 1 gekürzt

| Quelle | Modus | Zeichen | Status |
|---|---|---:|---|
| `sprite-tool/public/context/game-style-guide.md` | voll | 5.496 | vollständig |
| `desinformation-network/src/story-mode/theme.ts` | voll | 3.375 | vollständig |
| `desinformation-network/runs/visual-review/latest/manifest.json` | projektion | 6.176 | gekürzt |

### Gezeigtes Anschauungsmaterial (1 Screenshot(s))

| Art | Im Text genannt als | Datei | Größe |
|---|---|---|---:|
| 🖼 Bild | `office.png` | `desinformation-network/runs/visual-review/latest/shots/office.png` | 379 kB |

---

## Antwort des Modells

1. **Erster Eindruck**

   **office.png:** Der Blick landet zuerst auf dem großen roten Kopfband „Die reale Vorlage“, danach auf Option A und den roten Prozentwerten. Die gewünschte Folge wäre Titel → Situationsbeschreibung → vollständiger Vergleich aller Optionen; sie bricht ab, weil Option C vom unteren Hinweisstreifen verdeckt wird. Das Dialogblatt belegt die gesamte Bildschirmhöhe und wirkt dadurch eher wie eine abgeschnittene Webansicht als wie eine Akte im Büro. Das eigentliche Spielerbüro, seine Hotspots und selbst die Uhrzeit sind unter der sehr dunklen Abdunklung kaum noch erkennbar. Die gleichzeitig sichtbaren roten Kennzahlen zerlegen die Blickführung zusätzlich, obwohl zunächst die inhaltlichen Unterschiede der Optionen verstanden werden müssten.

2. **Konkrete Eingriffe je Screen**

- **office.png — Entscheidungsdialog** → von derzeit etwa 45 % auf 56–60 % der Bildschirmbreite erweitern, oben und unten jeweils einen schmalen sichtbaren Außenrand lassen und nur den Inhaltsbereich scrollbar machen → weniger Zeilenumbrüche verkürzen die Karten und das Blatt liest sich als abgegrenztes Dokument statt als angeschnittener Bildschirm.
- **office.png — Unterer Hinweisstreifen „Keine Option …“** → innerhalb des Dialogs unter dem Scrollbereich fixieren und im Inhalt mindestens eine volle Streifenhöhe als unteren Freiraum reservieren → der Streifen darf Option C nicht überdecken.
- **office.png — Optionskarten A–C** → Höhe um etwa ein Fünftel reduzieren und als festes Zweispaltenraster aufbauen: links ungefähr drei Viertel für Titel und Erklärung, rechts ein Viertel für Kennzahlen → Titel, Beschreibung und Auswirkungen werden über alle Optionen hinweg vergleichbar statt frei verteilt.
- **office.png — Rotes Kopfband** → um etwa 15–20 % niedriger machen, Titel und Unterzeile weiterhin an der linken Kante des Fließtexts ausrichten und den Abstand unter der Unterzeile verkleinern → das Kopfband bleibt Aktenmarkierung, beansprucht aber nicht mehr mehr Aufmerksamkeit als die eigentliche Entscheidung.
- **office.png — Abdunklung des Büros und Hotspots** → Abdunklung sichtbar abschwächen, sodass Tisch, Wandgrafiken und Raumkanten noch als Kontext lesbar bleiben; die Hotspot-Beschriftungen während des Modals dagegen vollständig ausblenden → derzeit sind sie weder nutzbar noch sauber verborgen und erzeugen nur schwache Geisterelemente hinter der Akte.

3. **Grafiken/Assets**

- **office.png:** Die cremefarbene Papierfläche mit leicht unruhiger Oberfläche und das rote Kopfband tragen die Behörden-/Aktenidee. Die Farbwahl liegt sichtbar nahe an den Papier- und Ministeriumsfarben aus `desinformation-network/src/story-mode/theme.ts`.
- **office.png:** Die gleichmäßig dicken, perfekt rechteckigen Kartenrahmen wirken dagegen stärker nach Formular-Weboberfläche als nach geschichteter Akte. Eine schmale, leicht versetzte zweite Papierkante an linker und unterer Dialogkante würde mit wenig Aufwand Materialtiefe erzeugen; keine harte Schlagschattenplatte, sondern eine zweite Blattlage.
- **office.png:** Das abstrakte rot-cyanfarbene Wandbild rechts passt als geometrisches, fiktives Behördenmotiv zum Stil-Anker. Es ist jedoch fast vollständig vom Dialog verdeckt und durch die Abdunklung so kontrastarm, dass sich weder Schärfe noch Zuschnitt belastbar beurteilen lassen.
- **office.png:** Das cyanfarbene „Lagebild“ links, Tischgerät und übrige Büro-Pixelgrafik wirken grundsätzlich stilistisch zusammengehörig, sind in diesem Zustand aber zu dunkel für eine Prüfung von Skalierung und Kantenschärfe. In der sichtbaren Aufnahme entsteht damit entgegen `sprite-tool/public/context/game-style-guide.md` der Eindruck eines dunklen, leeren Raums, auch wenn dies vermutlich vor allem am Modal-Scrim liegt.
- **office.png:** Am meisten fehlt eine sichtbare äußere Blattkante beziehungsweise Aktenlage hinter dem zentralen Dokument. Sie würde das vollflächige Rechteck als Gegenstand im Raum verankern und die Papierwelt klarer machen als zusätzliche Icons oder Dekoration.

4. **Raster & Rhythmus**

- **office.png:** Die linke Innenkante ist grundsätzlich sauber: Titel, Unterzeile, Einleitung, Zwischenüberschrift und Karten beginnen auf derselben Achse. Auch die Kartenbreite und ihre seitlichen Einzüge sind konsistent.
- **office.png:** Vertikal fehlt jedoch ein belastbares Viewport-Raster. Der Dialog beginnt praktisch an der oberen Bildschirmkante, läuft bis zur unteren Kante und wird dort vom festen Hinweisstreifen abgeschnitten.
- **office.png:** Die Abstände zwischen A, B und C sind gleichmäßig, aber die Karten selbst sind im Verhältnis zum verfügbaren Raum zu hoch. Vor allem Titelumbrüche und getrennt schwebende Kennzahlen treiben die Höhe unnötig nach unten.
- **office.png:** Die Kennzahlen besitzen zwar ähnliche horizontale Positionen, sind aber nicht als klar abgegrenzte Spalte gruppiert. Eine sichtbare Spaltenkante oder wenigstens ein einheitlicher linker Startpunkt für beide Kennzahlblöcke würde den Vergleich beschleunigen.
- **office.png:** Hinter dem Modal bleiben oben rechts HUD-Fragmente, rechts die vertikale Buchstabenleiste und unten die Bedienleiste einschließlich „Feierabend“ sichtbar. Diese drei peripheren Achsen bilden zusammen mit dem Dialog unnötige Rahmenunruhe; bei aktivem Modal sollten sie entweder klar erkennbar gedimmt oder vollständig verborgen sein, nicht knapp an der Wahrnehmungsschwelle liegen.
- **office.png:** Tote Fläche entsteht weniger als ungenutzte Fläche, sondern innerhalb der hohen Karten: Unter kurzen Technikzeilen und Tags bleibt Raum, während die dritte Karte außerhalb des nutzbaren Bereichs liegt. Diese Fläche muss durch kompaktere Karten zurückgewonnen werden.

5. **Lesbarkeit**

- **office.png:** Die Situationsbeschreibung ist lesbar, verlangt wegen der schmalen Dialogbreite und der Pixel-Monospace-Schrift aber mehr Zeilen als nötig. Eine breitere Textspalte verbessert hier mehr als eine kleinere Schrift.
- **office.png:** Die rote Unterzeile im Kopfband ist deutlich zu klein und eng gesetzt; bei „ENTSCHEIDUNG · EINE STADT …“ musste ich zweimal hinsehen. Entweder leicht vergrößern oder den Text kürzer umbrechen, ohne die Versalhöhe weiter zu reduzieren.
- **office.png:** „Technik: Dekontextualisierung“, „Technik: Amplifikation“ sowie die kleinen Tags „Zynismus“ und „Polarisierung“ liegen an der unteren komfortablen Lesbarkeitsgrenze. Diese Nebeninformationen sollten mindestens dieselbe Zeichenhöhe erhalten und durch Abstand statt durch noch kleinere Schrift hierarchisiert werden.
- **office.png:** Die roten Werte für „Risiko“ und „Aufmerksamkeit“ sehen semantisch gleich aus, obwohl sie unterschiedliche Arten von Information darstellen. Risiko kann je nach Höhe Ocker beziehungsweise Alarmrot verwenden; Aufmerksamkeit sollte in Tintenblau oder Anthrazit stehen, damit Rot gemäß `desinformation-network/src/story-mode/theme.ts` nicht für eine neutrale Kennzahl verbraucht wird.
- **office.png:** Option C ist nicht nur unterhalb des sichtbaren Bereichs, sondern zusätzlich vom Hinweisstreifen angeschnitten; „Anreichern – eine erfundene …“ war deshalb nicht vollständig erfassbar. Das ist die gravierendste konkrete Lesbarkeitsstörung.
- **office.png:** A und B haben denselben Rahmen, dieselbe Fläche und keine sichtbare Auswahlmarkierung. Falls noch nichts gewählt ist, ist der Neutralzustand plausibel; für Hover, Tastaturfokus und Auswahl braucht es jedoch klar getrennte Zustände, etwa Innenring für Fokus und einen schrägen Stempel für ausgewählt, ohne die ganze Karte rot zu fluten.

6. **Die drei wirksamsten Änderungen**

1. **office.png — Überdeckung durch den unteren Hinweisstreifen beseitigen und eine volle Streifenhöhe als Inhaltsreserve einbauen.** Das ist vermutlich der kleinste Eingriff und behebt sofort den schwersten Fehler: eine teilweise unlesbare Option.
2. **office.png — Dialog verbreitern und Optionskarten in ein festes Text-/Kennzahlenraster verdichten.** Dadurch sinkt die benötigte Höhe, alle Alternativen werden schneller vergleichbar und die dritte Option rückt in den sichtbaren Bereich.
3. **office.png — Modal als geschichtete Akte rahmen und die Hintergrundabdunklung sauber neu abstimmen.** Das stärkt die Behörden-/Papierwelt und erhält zugleich genug räumlichen Kontext, ohne unbedienbare Hotspots als Geisterelemente stehen zu lassen.

7. **Blinde Flecken**

- **office.png:** Das Büro selbst ist durch Dialog und Abdunklung zu großen Teilen verdeckt; für eine belastbare Beurteilung von Raumhelligkeit, Hotspot-Platzierung, Asset-Schärfe und Zuschnitten wäre derselbe Viewport mit geschlossenem Dialog nötig.
- **office.png:** Nicht erkennbar ist, ob der Dialog tatsächlich scrollt, ob Option C vollständig erreichbar ist und ob der untere Hinweisstreifen beim Scrollen feststeht. Dafür wäre eine Aufnahme am unteren Scrollende erforderlich.
- **office.png:** Hover-, Auswahl-, Tastaturfokus-, gesperrte und bereits bearbeitete Zustände der Optionskarten sind nicht gezeigt. Eine Zustandsreihe derselben Karte wäre nötig, um Kontrast und Interaktionsklarheit zu prüfen.
- **office.png:** Bewegung und Übergänge sind nicht beurteilbar: Einblendung des Blatts, Abdunklung des Büros und mögliche Hotspot-Animationen könnten im Standbild anders wirken.
- **office.png:** Das Verhalten bei geringerer Höhe oder größerer Textskalierung ist offen. Gerade wegen der bereits bei 1280 × 720 abgeschnittenen dritten Karte braucht es mindestens eine Aufnahme mit kleinerer Viewport-Höhe beziehungsweise erhöhter Schriftgröße.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
