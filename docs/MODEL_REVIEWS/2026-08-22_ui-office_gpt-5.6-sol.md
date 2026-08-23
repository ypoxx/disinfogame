# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „office"

**Modell:** `gpt-5.6-sol` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-22
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-22T17:09:26.285Z · **Dauer:** 190.2 s
**Nutzung:** nicht gemeldet · **Kosten:** unbekannt · **Anbieter-Datensammlung:** ausgeschlossen (deny)

> ⚠️ **Wie das zu lesen ist:** Ein *fremdes* Modell hat einen **kuratierten Ausschnitt**
> des Projekts gesehen — nicht das laufende Spiel und nicht das ganze Repository. Es kann
> daher weder Laufzeitverhalten prüfen noch `file:line`-Belege verifizieren. Befunde sind
> **Hypothesen**, die vor dem Umsetzen am Code/an den Daten gegenzuprüfen sind. Die
> kanonische Wahrheit bleibt [`docs/VISION_LOCK.md`](../VISION_LOCK.md) bzw. die Spieldaten.

## Gestellte Frage

Sieh dir die beigefügten Screenshots des laufenden Spiels an und mache einen UX/UI-Durchgang. Die Optik soll eine Behörden-/Papierwelt sein (Stil-Anker und Farbtoken liegen bei). Sag mir: Wo führt das Bild den Blick falsch, welche Grafiken sitzen an der falschen Stelle oder in der falschen Größe, wo stimmen Abstände und Ausrichtung nicht, und welche drei Änderungen bringen am meisten? Sei so konkret, dass man es direkt umsetzen kann.

## Dieser Durchgang: Bündel „office" (3 Screenshots)

Das siehst du, in dieser Reihenfolge:
- office.png — Spielerbüro (PlayerOfficeView) mit Hotspots/Einsteiger-Hinweisen
- board_korkbrett.png — Narrativ-Tafel / Korkbrett (Kampagnen-Planer)
- lagebild.png — Lagebild-Ansicht (TV im Büro)

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
| 🖼 Bild | `office.png` | `desinformation-network/runs/visual-review/latest/shots/office.png` | 779 kB |
| 🖼 Bild | `board_korkbrett.png` | `desinformation-network/runs/visual-review/latest/shots/board_korkbrett.png` | 577 kB |
| 🖼 Bild | `lagebild.png` | `desinformation-network/runs/visual-review/latest/shots/lagebild.png` | 380 kB |

---

## Antwort des Modells

## 1. **Erster Eindruck**

### `office.png`
Zuerst zieht das warme, figurenreiche Zuschauerbild unten rechts den Blick an, danach das große cyanfarbene Wandterminal. Der Blick sollte stattdessen zuerst zum aktuell empfohlenen Büro-Hotspot gehen; welcher das ist, bleibt zwischen den ähnlich schwachen Eckmarkierungen offen. Zusätzlich konkurriert der rote „FEIERABEND“-Knopf mit jeder produktiven Handlung, obwohl er räumlich nur eine Randaktion ist. Die große freie Bodenfläche in der Bildmitte trennt den Schreibtisch von den Bedienelementen, ohne als Ruhezone zu funktionieren, weil der untere Sendungsbereich gleichzeitig sehr dicht ist. Die kühle Büroszene und die Papierbedienung sind grundsätzlich unterscheidbar, aber der schwarze Broadcast-Block, grüne Monitorrahmen und cyanfarbene Wandbildschirm erzeugen drei konkurrierende UI-Sprachen.

### `board_korkbrett.png`
Zuerst sieht man die aggressive Korktextur, erst danach Ziele, freie Spuren und Schaltflächen. Der Blick sollte vom Kampagnenziel zur ersten freien Spur und anschließend zur Auswahlaktion laufen; diese Reihenfolge wird durch zu wenig Kontrast in der Arbeitsfläche unterbrochen. Die drei Zielkarten sind lesbar, bilden wegen ihrer unterschiedlichen Breiten und der separat darunter stehenden Sonntagsfrage aber keinen klaren Kopfbereich. In den leeren Spuren verschwinden sowohl Bezeichnungen als auch Hilfetexte fast vollständig im Muster. Unten ist „LEEREN“ trotz leerer Tafel stärker als das deaktivierte „AUSSPIELEN“, wodurch eine destruktive Nebenaktion unnötig zum visuellen Endpunkt wird.

### `lagebild.png`
Zuerst fallen der Titel und die große Zahl „150K“ auf; die eigentlich entscheidenden Werte „9,0 %“, „20 %“ und „8/100“ bleiben klein am Rand des oberen Kastens. Der Blick sollte zuerst den Abstand zum Wahlziel und den Abwehrzustand erfassen, danach Ressourcen und Team. Die gleich gewichteten Rahmen machen aus dem Lagebild eine Sammlung einzelner Kästen statt eines priorisierten Briefings. Die Teamliste ist dichter als die leere Nachrichtenfläche, erhält aber exakt dieselbe Breite. Die Papieroptik entspricht `desinformation-network/src/story-mode/theme.ts`, doch die Informationshierarchie bleibt so flach, dass kritische und rein informative Werte ähnlich wichtig erscheinen.

## 2. **Konkrete Eingriffe je Screen**

### `office.png`

- Unteres Sendungsmodul → von knapp zwei Fünfteln auf höchstens knapp ein Drittel der Bildschirmhöhe reduzieren; TV, Sendungsdaten und Zuschauerbild auf eine gemeinsame Oberkante und vergleichbare Bildhöhe bringen → passive Beobachtung verdrängt derzeit den aktiven Büroraum.
- Empfohlener Hotspot → nur das aktuelle Ziel mit etwa 1,5-facher Kantenstärke und einem kleinen Papieretikett direkt darunter markieren; die übrigen Eckmarken auf ungefähr halbe Deckkraft setzen → die Einsteigerführung braucht genau einen klaren ersten Zielpunkt.
- Cyanfarbenes Wandterminal → um etwa ein Fünftel verkleinern und so weit nach unten versetzen, dass sein äußerer Rahmen vollständig im Bild liegt; zwischen Terminal und Korkbrett mindestens eine Markierungsbreite Abstand lassen → es wirkt derzeit angeschnitten, übergroß und wichtiger als der Kampagnenplaner.
- Uhr, Menü und „HUD · H“ oben rechts → zu einer einzigen horizontalen Kontrollgruppe zusammenziehen, gleiche Höhe verwenden und die rechte Kante an der Shortcut-Leiste ausrichten → die drei frei schwebenden Kästen wirken nicht wie ein gemeinsamer Bedienbereich.
- „FEIERABEND“ → rote Vollfläche durch die gestempelte Papier-CTA aus `desinformation-network/src/story-mode/theme.ts` ersetzen und in Höhe sowie Grundlinie an die Personalplakette links angleichen → die Randaktion ist derzeit der stärkste Button des gesamten Screens.

### `board_korkbrett.png`

- Korkfläche → Hell-Dunkel-Amplitude der Textur deutlich reduzieren und über jede Spur einen leicht transparenten, durchgehenden Papierstreifen legen → Text darf nicht direkt gegen das hochfrequente Sprenkelmuster kämpfen.
- Zielbereich oben → drei gleich breite Spalten über die verfügbare Breite bilden; „Nächste Sonntagsfrage in 4 Tagen“ als zweite Zeile in die erste Zielkarte integrieren → der aktuell versetzte vierte Zettel zerbricht den Kopfbereich.
- Spuraufbau → links eine feste Beschriftungsspalte von ungefähr einem Sechstel der Breite, rechts die eigentliche Kartenfläche; alle Spurtexte an denselben beiden Vertikalachsen ausrichten → „FREIE SPUR“ und Hilfetext beginnen momentan ohne stabilen Rasterbezug.
- Leere Spuren → je Spur eine klar begrenzte, helle Dokumentablage oder gestrichelte Papierkontur in der rechten Fläche zeigen → die derzeitigen gestrichelten Trennlinien kommunizieren keine eindeutige Ablageposition.
- Footer-Ablauf → „MASSNAHMEN WÄHLEN“ links als primäre Stempelaktion, Statuswerte unmittelbar rechts davon und „AUSSPIELEN“ als visuellen Endpunkt ganz rechts gruppieren → Auswahl, Kostenprüfung und Ausführung werden so als lineare Abfolge lesbar.
- „LEEREN“ → bei „0 angeheftet“ deaktivieren oder zu einer unbetonten Textaktion neben dem Status zurückstufen → eine aktive rote Löschaktion ohne vorhandenen Inhalt ist ein widersprüchlicher Zustand.

### `lagebild.png`

- Oberer Statuskasten → „9,0 % → Ziel über 20 %“ und „Abwehr 8/100“ jeweils als große Werte direkt über dem zugehörigen Balken platzieren; mindestens etwa 1,4-mal so groß wie die übrigen Kennzahlen → diese beiden Zustände sind der Kern des Lagebilds.
- Balkenmarkierungen → unbeschriftete Striche entfernen oder direkt mit ihren Schwellenwerten beschriften; den aktuellen Wert zusätzlich durch eine eindeutige Marke am Balkenende kennzeichnen → momentan ist weder Skala noch Bedeutung der Zwischenmarken sofort verständlich.
- Ressourcenzeile → „150K“, „5“ und „0“ auf dieselbe Schriftgröße, Grundlinie und Innenkante setzen; Signalfarbe nur bei tatsächlich kritischem Zustand einsetzen → die Kasse dominiert allein durch Ziffernbreite und Größe.
- Untere Karten → Team auf etwa zwei Fünftel der Breite erweitern, Halte-Ziele auf gut ein Drittel setzen und die aktuell leere Nachrichtenfläche entsprechend schmaler machen → die Breite muss der sichtbaren Informationsdichte folgen.
- Leerer Nachrichtenkasten → „Keine Nachrichten“ mittig als bewussten Leerzustand setzen statt klein oben links → dadurch liest sich die freie Fläche als Zustand und nicht als fehlender Inhalt.
- Fußzeile → Hinweissatz links an der Inhaltskante beginnen lassen und „STATISTIK [S]“ als separaten Button rechts an derselben Kante ausrichten → der derzeit mitten in den Satz gesetzte Button bricht Leselinie und Zentrierung.

## 3. **Grafiken/Assets**

### `office.png`
Die Büroszene, die Skyline und das abstrakte Poster tragen den modernen Ministeriumsraum aus `sprite-tool/public/context/game-style-guide.md`: klare Geometrie, gepflegte Betonflächen und kontrollierte Farbakzente. Das Wandterminal ist dagegen im Verhältnis zu Schreibtischmonitor und Korkbrett zu groß und oben sichtbar angeschnitten; seine Cyanfläche bekommt dadurch den Rang eines Hauptmenüs. Der grüne Rahmen am Schreibtischmonitor fällt aus dem festgelegten Tech-Petrol/Cyan heraus und sollte auf denselben Farbbereich wie das Wandterminal vereinheitlicht werden. Das Zuschauerbild unten rechts ist technisch noch Pixel-Art, wirkt aber deutlich wärmer, gesättigter und detailreicher als die Büroszene; Sättigung und Orangekontrast sollten um etwa ein Viertel zurückgenommen werden. Am meisten fehlt direkt am empfohlenen Hotspot ein materielles Einsteiger-Asset: ein kleines angeheftetes Papieretikett mit kurzer Handlungsaufforderung statt ausschließlich abstrakter Eckklammern.

### `board_korkbrett.png`
Die Zielzettel und der dunkle Kraftpapier-Kopf passen zur Aktenwelt. Die Korkgrafik selbst wirkt fremd: zu kontrastreich, zu körnig und bei dieser Fläche optisch gröber als die feine Pixel-Art, die `sprite-tool/public/context/game-style-guide.md` fordert. Helle Sprenkel besitzen teilweise mehr Kantenschärfe als die Schrift und werden dadurch zu Vordergrundelementen. Die Spurtexte sehen aus, als seien sie direkt auf den Kork gedruckt; es fehlen Papierbahnen, Karteikarten oder Ablagekonturen, die Arbeitsinhalt und Trägerfläche trennen. Zusätzliche Illustration wäre hier kontraproduktiv — die größte Verbesserung wäre eine ruhigere Trägertextur plus echte Papierflächen an den vier Spurpositionen.

### `lagebild.png`
`lagebild.png` braucht keine weitere große Illustration; die dokumentartige Fläche trägt den Screen besser als ein dekoratives Bild. Die kleinen Symbole vor Titel, Kasse, Kapazität und Moral sind allerdings so fein, dass ihre Motive bei dieser Darstellung weitgehend kollabieren. Entweder um etwa ein Viertel vergrößern und auf ein gemeinsames quadratisches Maß bringen oder ganz entfernen; momentan leisten sie kaum Orientierung. Was grafisch fehlt, sind eindeutig beschriftete Ist- und Zielmarken an den beiden Balken. Diese würden mehr bringen als zusätzliche Amtsstempel oder Hintergrundtexturen.

## 4. **Raster & Rhythmus**

### `office.png`
Der Büroraum belegt nur gut drei Fünftel der Höhe, der Broadcast-Bereich fast den gesamten Rest; für eine Navigations- und Hotspotansicht ist dieses Verhältnis verkehrt. Innerhalb des Raums ballen sich Schreibtisch, Monitor, Wandterminal und Korkbrett im linken bis mittleren Bereich, während die rechte Bodenhälfte nahezu leer bleibt. Gleichzeitig sind Uhr, Menü, HUD-Schalter und Shortcut-Leiste an verschiedenen Achsen aufgehängt. Die zentrale Leere wäre akzeptabel, wenn der untere Bereich ruhig wäre; zusammen mit dem detailreichen Zuschauerbild entsteht stattdessen ein harter Wechsel von leer zu überfüllt. Eine gemeinsame rechte Achse für Uhrengruppe, „FEIERABEND“ und Shortcut-Leiste sowie eine gemeinsame linke Achse für Personalplakette, TV und Sendungstext würden den Screen stabilisieren.

### `board_korkbrett.png`
Kopf, Korkfläche und Footer verwenden leicht unterschiedliche linke und rechte Innenkanten. Titel, erste Zielkarte, Spurbeschriftungen und Footer-CTA sollten auf einer gemeinsamen linken Achse stehen; dasselbe gilt rechts für letzte Zielkarte, Spurenden und Ausführungsbutton. Die drei Zielkarten sind weder gleich breit noch proportional zum Inhalt, während rechts daneben tote Fläche bleibt. Die vier Spuren besitzen viel Höhe, aber kaum visuell gebundene Inhalte, weshalb die Fläche nicht großzügig, sondern unfertig wirkt. Ein wiederkehrender Rhythmus aus Spurtitel, Papierablage und gleich hohem Zwischenraum würde die Tafel beruhigen.

### `lagebild.png`
Das Grundraster aus Kopfbereich, Statuskasten, Ressourcenzeile und unterer Kartenzeile ist nachvollziehbar, aber die Inhalte folgen nicht überall denselben Kanten. Der Titel beginnt weiter rechts als die Hauptkarten; er sollte mit deren linker Innenkante fluchten. Die drei gleich breiten unteren Karten ignorieren ihre stark unterschiedliche Inhaltsmenge und erzeugen tote Fläche bei Nachrichten sowie Enge beim Team. Die Fußzeile hat keine klare Zweiteilung, weil Erklärung und Button optisch ineinanderlaufen. Außenabstand, Kartenzwischenraum und Karteninnenabstand sollten aus einem sichtbaren Grundmaß abgeleitet werden, statt drei ähnlich kleine, aber unterschiedliche Abstände zu verwenden.

## 5. **Lesbarkeit**

### `office.png`
Zweimal hinsehen musste ich bei der Personalplakette unten links, den Werten „QUOTE / REICHWEITE / KANAL“ und dem grauen Erklärungssatz darunter. Diese Texte sind im Verhältnis zur großen schwarzen Fläche zu klein und zu kontrastarm; Bodytext dort um ungefähr ein Fünftel vergrößern und auf ein helleres Papiergrau setzen. Die Buchstabenfolge `K M A K I` in der rechten Leiste erklärt weder Bedeutung noch Gruppierung; der aktive Zustand von `A` unterscheidet sich nur schwach. Hotspot-Eckmarken in Gelb, Grün und Cyan wirken wie verschiedene Zustände, ohne dass deren Bedeutung sichtbar erklärt wird.

### `board_korkbrett.png`
Am schwersten lesbar sind „FREIE SPUR“, die Beschreibungen der leeren Stränge und „TAGESGESCHÄFT“. Die helle, dünne Pixelschrift verliert fast vollständig gegen die Korksprenkel; eine bloße Vergrößerung reicht ohne ruhigen Papiergrund nicht. Auch die Footerwerte zu Geld und AP sind zu klein und zu weit voneinander getrennt, um vor dem Ausspielen schnell geprüft zu werden. „AUSSPIELEN“ ist als gesperrt erkennbar, aber `LEEREN` erscheint gleichzeitig aktiv, obwohl „0 angeheftet“ angezeigt wird. Neu, frei, belegt und gesperrt brauchen jeweils eine Kombination aus Fläche, Beschriftung und Symbol — nicht nur geringe Helligkeitsunterschiede.

### `lagebild.png`
Bei den oberen Balken musste ich die Werte am rechten Rand suchen und anschließend rätseln, worauf sich die Markierungsstriche beziehen. „MORAL. LAST“ liest sich wegen Abkürzung und Punkt zunächst wie zwei getrennte Labels; ausgeschriebenes „MORALISCHE LAST“ wäre in der vorhandenen Breite klarer. Namen und Prozentwerte im Team sind lesbar, aber eine Stufe zu klein für eine zentrale Statusübersicht; Zeilenhöhe und Schriftgröße sollten jeweils moderat erhöht werden. Rot wird sowohl für den Wahlbalken als auch für die Null bei Moral verwendet, ohne dass klar ist, ob beide akut kritisch sind. Kritische, gesperrte und lediglich niedrige Werte brauchen getrennte Zustände statt eines allgemeinen Rotakzents.

## 6. **Die drei wirksamsten Änderungen**

1. **`board_korkbrett.png`: Korktextur stark beruhigen und jede Spur auf einen hellen Papierstreifen setzen.** Sehr geringer Umsetzungsaufwand, aber sofort deutlich bessere Lesbarkeit, Hierarchie und Übereinstimmung mit der Behörden-Aktenwelt.
2. **`office.png`: Genau einen empfohlenen Hotspot mit Papieretikett hervorheben und alle anderen Markierungen zurücknehmen.** Das behebt die zentrale Orientierungsfrage des Büros, ohne Raumgrafik oder Navigation neu bauen zu müssen.
3. **`lagebild.png`: Ist-, Ziel- und Abwehrwerte groß direkt an die Balken setzen und alle unbeschrifteten Marken entfernen.** Damit wird aus dem flachen Dashboard ein auf einen Blick erfassbares Lagebriefing.

## 7. **Blinde Flecken**

- Bei `office.png` ist nicht erkennbar, ob die Hotspot-Klammern pulsieren, ob ein Hover Beschriftungen zeigt und ob das untere Sendungsmodul ein- oder ausklappbar ist. Dafür wären Aufnahmen eines gehoverten Hotspots, des aktiven Einsteigerziels und eines eingeklappten Broadcast-Bereichs nötig.
- Bei `board_korkbrett.png` fehlen Zustände mit angehefteten Maßnahmen, voller Spur, gesperrter Spur, Drag-and-drop beziehungsweise Auswahl-Hover sowie tatsächlich aktivem „AUSSPIELEN“. Ohne diese Bilder lassen sich Kartenmaß, Überfüllung und Zustandskontraste nicht belastbar bewerten.
- Bei `lagebild.png` fehlen kritische Schwellenzustände, vorhandene Nachrichten, ein nicht vollständig aktives Team und Hover- beziehungsweise Fokuszustände der Balken und Buttons. Dafür wären je ein normaler, warnender und kritischer Lagezustand nötig.
- Für alle drei Screens fehlen kleinere Auflösungen beziehungsweise erhöhte UI-Skalierung sowie Tastaturfokus. Der Screenshot zeigt nicht, ob Texte bei Verkleinerung umbrechen, die rechte Leiste kollidiert oder Modalinhalte scrollbar werden.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
