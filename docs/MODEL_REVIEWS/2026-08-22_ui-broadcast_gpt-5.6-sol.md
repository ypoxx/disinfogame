# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „broadcast"

**Modell:** `gpt-5.6-sol` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-22
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-22T17:19:07.670Z · **Dauer:** 142.7 s
**Nutzung:** nicht gemeldet · **Kosten:** unbekannt · **Anbieter-Datensammlung:** ausgeschlossen (deny)

> ⚠️ **Wie das zu lesen ist:** Ein *fremdes* Modell hat einen **kuratierten Ausschnitt**
> des Projekts gesehen — nicht das laufende Spiel und nicht das ganze Repository. Es kann
> daher weder Laufzeitverhalten prüfen noch `file:line`-Belege verifizieren. Befunde sind
> **Hypothesen**, die vor dem Umsetzen am Code/an den Daten gegenzuprüfen sind. Die
> kanonische Wahrheit bleibt [`docs/VISION_LOCK.md`](../VISION_LOCK.md) bzw. die Spieldaten.

## Gestellte Frage

Sieh dir die beigefügten Screenshots des laufenden Spiels an und mache einen UX/UI-Durchgang. Die Optik soll eine Behörden-/Papierwelt sein (Stil-Anker und Farbtoken liegen bei). Sag mir: Wo führt das Bild den Blick falsch, welche Grafiken sitzen an der falschen Stelle oder in der falschen Größe, wo stimmen Abstände und Ausrichtung nicht, und welche drei Änderungen bringen am meisten? Sei so konkret, dass man es direkt umsetzen kann.

## Dieser Durchgang: Bündel „broadcast" (1 Screenshots)

Das siehst du, in dieser Reihenfolge:
- broadcast_expanded.png — Broadcast ausgeklappt: Sendung + Publikums-Wohnzimmer (Milieus)

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
| 🖼 Bild | `broadcast_expanded.png` | `desinformation-network/runs/visual-review/latest/shots/broadcast_expanded.png` | 376 kB |

---

## Antwort des Modells

## 1. **Erster Eindruck**

### `broadcast_expanded.png`
Der Blick fällt zuerst auf das rote Kopfband „Die reale Vorlage“ und danach auf Option A. Für einen aktiven Entscheidungsdialog wäre das richtig; für den angekündigten Zustand „Sendung + Publikums-Wohnzimmer“ ist es falsch, weil Fernseher und Milieus fast vollständig zu dunkler Kulisse werden. Die beabsichtigte Blickfolge müsste **Sendung links → Reaktion des Publikums rechts → Entscheidung** lauten, tatsächlich entsteht **Dialogtitel → A → B → abgeschnittenes C**. Die Papierfläche und das rote Akten-Kopfband treffen die Behördenwelt, aber die fast randhohe, mittige Form wirkt eher wie ein überfülltes Web-Modal als wie eine kontrolliert aufgelegte Akte. Dass das Blatt oben beinahe den Bildschirmrand berührt und unten vom festen Hinweisstreifen abgeschlossen wird, lässt den Zustand zusätzlich versehentlich beschnitten erscheinen.

## 2. **Konkrete Eingriffe je Screen**

### `broadcast_expanded.png`

- *Abdunklung hinter der Entscheidungsakte → Stärke gegenüber dem jetzigen Zustand um ungefähr ein Drittel reduzieren; TV-Bild, Köpfe und Sofa müssen an den beiden Seiten noch ohne Anstrengung erkennbar bleiben → sonst verschwindet genau die Ursache-Wirkungs-Beziehung zwischen Sendung und Milieus.*
- *Entscheidungsakte → oben und unten jeweils mindestens eine Textzeile Außenabstand lassen und die Akte innerhalb dieser Grenzen scrollen, statt sie von fast Bildschirmkante zu Bildschirmkante zu spannen → der Dialog wirkt dann bewusst platziert und nicht vom Viewport abgeschnitten.*
- *Fester Hinweisstreifen „Keine Option ist überall die beste …“ → direkt unter „IHRE ENTSCHEIDUNG“ als schmale Aktennotiz setzen und aus dem unteren Overlay entfernen → aktuell verdeckt der Streifen Option C und konkurriert mit dem eigentlichen Ende der Liste.*
- *Kopfzeilen der Optionskarten → jede Karte in eine feste linke Titelspalte von etwa drei Fünfteln und einen rechten Wirkungsblock von etwa zwei Fünfteln teilen; beide Wirkungsspalten an denselben Vertikalen ausrichten → derzeit wrappt der Titel, während die kleinen Werte scheinbar frei daneben schweben.*
- *Wirkungswerte → nur „Risiko“ in Gefahr-Rot setzen, „Aufmerksamkeit“ in Tintenblau oder Anthrazit; Zahlen jeweils größer und mindestens annähernd auf Höhe des Beschreibungstextes bringen → die aktuelle rote Kleinschrift ist schwer scanbar und codiert zwei unterschiedliche Größen identisch.*
- *Optionskarten als Interaktion → links neben A/B/C eine klar begrenzte Auswahlmarke vorsehen und für den gewählten Zustand einen roten Stempelring oder eine innere Kontur verwenden; die Grundkarten neutral lassen → im Standbild sehen alle Kästen wie reine Information aus, nicht wie anklickbare Entscheidungen.*

## 3. **Grafiken/Assets**

### `broadcast_expanded.png`

- **Tragend:** Der CRT-Fernseher links und die Figurengruppe auf dem Sofa rechts bilden grundsätzlich eine verständliche Sender-Empfänger-Komposition. Die Pixelkanten wirken im sichtbaren Bereich scharf und nicht weich hochskaliert. Auch das cremefarbene Blatt mit rotem Kopfband entspricht der Papierlogik aus `desinformation-network/src/story-mode/theme.ts`; Rot wird hier am Kopfband sinnvoll eingesetzt.
- **Zu schwach sichtbar:** Die Personen rechts verschmelzen durch die Abdunklung zu einer einzigen dunklen Masse. Mindestens Gesichter, Oberkörper und Sofakante sollten jeweils eine Tonstufe heller als die Rückwand bleiben; dafür eher das lokale Raumlicht anheben als die Figuren stärker sättigen.
- **Falsch gewichtet:** Der sichtbare Fernseher ist gegenüber der Publikumsgruppe und vor allem gegenüber der Akte zu klein. Den TV mitsamt Gehäuse auf ungefähr das 1,25-Fache vergrößern und innerhalb der linken Bildschirmhälfte etwas näher zur Akte rücken, ohne deren Kante zu berühren.
- **Unklarer Ausschnitt:** Auf dem TV ist keine konkrete laufende Sendung zu erkennen; die Bildschirmfläche liest sich eher als dunkles Raster oder Standbild. Ein deutlich helleres, stilisiertes Broadcast-Standbild innerhalb der Röhre würde stärker vermitteln, dass gerade etwas ausgestrahlt wird.
- **Fremdwirkung:** Die Optionskästen sind gleichförmige, dick umrandete Rechtecke und wirken dadurch mehr wie Formular-Widgets als wie einzelne Aktenblätter. Die Grundkontur optisch auf die Stärke der übrigen Aktenlinien reduzieren und die stärkere Doppelkontur nur für Auswahl oder Fokus verwenden.
- **Größte fehlende Grafik:** Zwischen TV links und Publikum rechts fehlt im sichtbaren Zustand ein eindeutiger visueller Übertragungsimpuls. Ein schmaler, heller Sendungsstreifen im unteren Mittelfeld – nicht als Neon-Effekt, sondern als bedrucktes Label oder Kanalband – könnte die Leserichtung **TV → Publikum** herstellen.

## 4. **Raster & Rhythmus**

### `broadcast_expanded.png`

- Die Akte ist horizontal sauber zentriert; Titel, Einleitung, Entscheidungszeile und Karten teilen weitgehend dieselbe linke Bezugskante. Diese Grundausrichtung sollte erhalten bleiben.
- Vertikal fehlt dagegen ein belastbares Raster: Kopfband, Einleitung und Entscheidungszeile verbrauchen zusammen bereits so viel Höhe, dass bei der gezeigten Bildschirmgröße nicht einmal drei Optionen sichtbar werden können. Die Lösung ist internes Scrollen, nicht noch kleinere Schrift oder zusammengepresste Karten.
- Der obere Außenabstand ist praktisch null, während seitlich viel dunkle Fläche bleibt. Ein gleichmäßiger Rahmen von etwa einer Textzeile oben und unten würde die Akte als eigenständiges Objekt lesbar machen.
- Die beiden vollständigen Karten besitzen ähnliche Höhe, aber ihre Wirkungsspalten orientieren sich nicht sichtbar an einem gemeinsamen Raster. Zahlen und Beschriftungen sollten in allen Karten exakt untereinander stehen, unabhängig davon, ob der Titel ein- oder zweizeilig ist.
- Die kräftigen Rahmen, die engen Zwischenräume und der feste untere Streifen erzeugen eine visuelle „Leiter“ aus horizontalen Balken. Zwischen den Karten sollte ungefähr eine normale Textzeile Luft liegen; dafür kann die Grundkontur schwächer werden.
- Außerhalb der Akte entsteht oben links und rund um die Wohnzimmerszene tote, fast schwarze Fläche. Das widerspricht dem Stilanker in `sprite-tool/public/context/game-style-guide.md`, der gepflegte, belebt wirkende und ausdrücklich nicht dunkel-leere Räume verlangt – auch wenn ein Modal aktiv ist.

## 5. **Lesbarkeit**

### `broadcast_expanded.png`

- Zweimal hinsehen musste ich bei der kleinen Unterzeile im roten Kopfband. Sie ist in Versalien gesetzt, sehr schmal und deutlich kleiner als alle entscheidungsrelevanten Texte; auf ungefähr drei Viertel der Einleitungsschrift vergrößern und die Laufweite leicht reduzieren.
- Die roten Werte „+4 % Risiko“ und „+4 % Aufmerksamkeit“ sind zu klein und durch die Pixelstruktur unruhig. Zahlen sollten die stärkste Zeile im Wirkungsblock sein, die Begriffe darunter eine Stufe kleiner.
- „IHRE ENTSCHEIDUNG (abgewogen gegen: Authentizität / Widerlegbarkeit)“ ist typografisch zu gleichförmig. „IHRE ENTSCHEIDUNG“ als Hauptzeile stehen lassen und den Klammerzusatz darunter in normaler Textstärke setzen.
- Die Zeilen „Technik: Dekontextualisierung“ beziehungsweise „Technik: Amplifikation“ sind kleiner und kontrastärmer als der übrige Kartentext. Sie benötigen entweder mehr Größe oder einen festen Labelblock; momentan wirken sie wie Fußnoten, obwohl sie für die Lernwirkung zentral sind.
- Die kleinen Kästen „Zynismus ▲“ und „Polarisierung ▲“ sind semantisch unklar: Das Dreieck kann sowohl „Zunahme“ als auch „Dropdown“ bedeuten. Einen eindeutigen Aufwärtspfeil verwenden und den Zustand sprachlich ergänzen, sofern es tatsächlich eine Wirkung und keine Bedienfläche ist.
- Option C ist nicht bloß weniger prominent, sondern sichtbar abgeschnitten. Außerdem fehlt ein Scrollbalken oder anderer Hinweis, dass weitere Inhalte erreichbar sind.
- Der gesamte Broadcast-Hintergrund einschließlich Uhrzeit, TV-Inhalt und Milieu-Gesichtern ist durch die Abdunklung kaum lesbar. Für einen reinen Modalzustand wäre das akzeptabel, für den beschriebenen Broadcast-Zustand jedoch nicht.

## 6. **Die drei wirksamsten Änderungen**

1. **Abdunklung deutlich reduzieren beziehungsweise die Entscheidung erst nach der sichtbaren Sendungs-/Publikumsphase öffnen.** Das ist ein kleiner Zustands- oder Opacity-Eingriff und stellt sofort die zentrale Erzählrichtung des Screens wieder her.
2. **Den unteren Hinweisstreifen aus dem Overlay entfernen und die Optionsliste innerhalb einer Akte mit klar erkennbarem Scrollbereich führen.** Dadurch wird Option C zugänglich, ohne Schrift und Karten auf problematische Größen zu schrumpfen.
3. **Jede Optionskarte auf ein festes Titel-/Wirkungsraster umstellen und Risiko von Aufmerksamkeit farblich trennen.** Das verbessert den Vergleich aller Entscheidungen stärker als zusätzliche Dekoration oder Textkürzungen.

## 7. **Blinde Flecken**

### `broadcast_expanded.png`

- Nicht erkennbar ist, ob Option C durch Mausrad, Tastatur oder Dragging erreichbar ist und ob beim Scrollen ein Indikator erscheint.
- Hover-, Fokus-, Auswahl-, gesperrte und bereits verwendete Zustände der Optionskarten sind im Screenshot nicht zu beurteilen.
- Für die eigentliche Broadcast-Gestaltung wäre eine Aufnahme desselben ausgeklappten Zustands **ohne** die Entscheidungsakte nötig; Fernseher, Sendungsinhalt, Milieu-Beschriftungen und Raumlicht sind hier größtenteils verdeckt oder abgedunkelt.
- Bewegung der TV-Sendung, Reaktionen der Zuschauer und Übergang in den Entscheidungsdialog lassen sich aus einem Einzelbild nicht bewerten.
- Das Verhalten bei geringerer Höhe oder größerer UI-Skalierung ist offen; bereits in der gezeigten Auflösung reicht die Höhe nicht für alle Optionen.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
