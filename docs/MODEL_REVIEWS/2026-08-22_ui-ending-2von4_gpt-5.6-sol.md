# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „ending-2von4"

**Modell:** `gpt-5.6-sol` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-22
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-22T17:09:26.285Z · **Dauer:** 187.0 s
**Nutzung:** nicht gemeldet · **Kosten:** unbekannt · **Anbieter-Datensammlung:** ausgeschlossen (deny)

> ⚠️ **Wie das zu lesen ist:** Ein *fremdes* Modell hat einen **kuratierten Ausschnitt**
> des Projekts gesehen — nicht das laufende Spiel und nicht das ganze Repository. Es kann
> daher weder Laufzeitverhalten prüfen noch `file:line`-Belege verifizieren. Befunde sind
> **Hypothesen**, die vor dem Umsetzen am Code/an den Daten gegenzuprüfen sind. Die
> kanonische Wahrheit bleibt [`docs/VISION_LOCK.md`](../VISION_LOCK.md) bzw. die Spieldaten.

## Gestellte Frage

Sieh dir die beigefügten Screenshots des laufenden Spiels an und mache einen UX/UI-Durchgang. Die Optik soll eine Behörden-/Papierwelt sein (Stil-Anker und Farbtoken liegen bei). Sag mir: Wo führt das Bild den Blick falsch, welche Grafiken sitzen an der falschen Stelle oder in der falschen Größe, wo stimmen Abstände und Ausrichtung nicht, und welche drei Änderungen bringen am meisten? Sei so konkret, dass man es direkt umsetzen kann.

## Dieser Durchgang: Bündel „ending-2von4" (10 Screenshots)

Das siehst du, in dieser Reihenfolge:
- end_immune_wahlabend_s2.png — Wahlabend (echt, immune), Schritt 2
- end_immune_wahlabend_s3.png — Wahlabend (echt, immune), Schritt 3
- end_immune_gameend.png — GameEndScreen (immune)
- end_immune_endreport_top.png — End-Report (immune), Anfang: „Das Rennen"-Kurven
- end_immune_endreport_mid.png — End-Report (immune), Mitte: Methoden-Atlas/Bilanz
- end_immune_endreport_bottom.png — End-Report (immune), Ende: Gegenmaßnahmen/Debrief
- end_victory_wahlabend_s0.png — Wahlabend (echt, victory), Titelkarte
- end_victory_wahlabend_s1.png — Wahlabend (echt, victory), Schritt 1
- end_victory_wahlabend_s2.png — Wahlabend (echt, victory), Schritt 2
- end_victory_wahlabend_s3.png — Wahlabend (echt, victory), Schritt 3

Beurteile **nur diese** Aufnahmen, dafür gründlich. Andere Teile des Spiels kommen in
eigenen Durchgängen dran — verweise nicht auf Dinge, die du hier nicht siehst.

## Gezeigter Ausschnitt

15.047 Zeichen ≈ 4.180 Tokens (geschätzt) aus 3 Quellen · 1 gekürzt

| Quelle | Modus | Zeichen | Status |
|---|---|---:|---|
| `sprite-tool/public/context/game-style-guide.md` | voll | 5.496 | vollständig |
| `desinformation-network/src/story-mode/theme.ts` | voll | 3.375 | vollständig |
| `desinformation-network/runs/visual-review/latest/manifest.json` | projektion | 6.176 | gekürzt |

### Gezeigtes Anschauungsmaterial (10 Screenshot(s))

| Art | Im Text genannt als | Datei | Größe |
|---|---|---|---:|
| 🖼 Bild | `end_immune_wahlabend_s2.png` | `desinformation-network/runs/visual-review/latest/shots/end_immune_wahlabend_s2.png` | 167 kB |
| 🖼 Bild | `end_immune_wahlabend_s3.png` | `desinformation-network/runs/visual-review/latest/shots/end_immune_wahlabend_s3.png` | 78 kB |
| 🖼 Bild | `end_immune_gameend.png` | `desinformation-network/runs/visual-review/latest/shots/end_immune_gameend.png` | 78 kB |
| 🖼 Bild | `end_immune_endreport_top.png` | `desinformation-network/runs/visual-review/latest/shots/end_immune_endreport_top.png` | 78 kB |
| 🖼 Bild | `end_immune_endreport_mid.png` | `desinformation-network/runs/visual-review/latest/shots/end_immune_endreport_mid.png` | 99 kB |
| 🖼 Bild | `end_immune_endreport_bottom.png` | `desinformation-network/runs/visual-review/latest/shots/end_immune_endreport_bottom.png` | 99 kB |
| 🖼 Bild | `end_victory_wahlabend_s0.png` | `desinformation-network/runs/visual-review/latest/shots/end_victory_wahlabend_s0.png` | 127 kB |
| 🖼 Bild | `end_victory_wahlabend_s1.png` | `desinformation-network/runs/visual-review/latest/shots/end_victory_wahlabend_s1.png` | 127 kB |
| 🖼 Bild | `end_victory_wahlabend_s2.png` | `desinformation-network/runs/visual-review/latest/shots/end_victory_wahlabend_s2.png` | 158 kB |
| 🖼 Bild | `end_victory_wahlabend_s3.png` | `desinformation-network/runs/visual-review/latest/shots/end_victory_wahlabend_s3.png` | 66 kB |

---

## Antwort des Modells

## 1. **Erster Eindruck**

**`end_immune_wahlabend_s2.png`**  
Das Auge landet sofort auf dem schrägen roten Stempel „GEFÄLSCHT“. Das ist grundsätzlich der richtige Zielpunkt, aber die dazugehörige Aussage „Ihre Schlagzeilen – geprüft“ ist so klein und weit links abgesetzt, dass Ursache und Ergebnis nicht als Einheit gelesen werden. Der fast vollständig leere rote Fernsehbereich beansprucht den größten Teil des Bildes, ohne zusätzliche Information zu liefern. Unterhalb des Fernsehers konkurrieren Fließtext, sechs Milieu-Chips und der rote Weiter-Button auf sehr engem Raum. Der Button sitzt direkt an der unteren Bildkante und wirkt angeschnitten statt bewusst platziert.

**`end_immune_wahlabend_s3.png`**  
Zuerst fällt die Überschrift „Das Land hält stand“ auf; das ist der richtige Einstieg. Danach sollte der Blick zu den drei Abschlusskennzahlen gehen, diese verschwinden jedoch als kleine Textzeile im Kopfband. Die Spielstil-Tags sehen eher wie inaktive Filter aus als wie eine Bewertung. Der lange Erzählblock nimmt viel Höhe ein und schiebt den angekündigten Vertrauensverlauf fast vollständig unter den sichtbaren Rand. Rechts hinter dem Bericht bleibt außerdem der Hintergrund-Button „Vollständiger Lagebericht“ sichtbar und erzeugt eine falsche zweite Interaktionsebene.

**`end_immune_gameend.png`**  
Visuell ist dieser Screen von `end_immune_wahlabend_s3.png` nicht unterscheidbar. Das Auge folgt erneut sauber zur Überschrift, bekommt aber keinen Hinweis darauf, dass nun ein anderer Zustand oder eine andere Ebene erreicht wurde. Ein Game-End-Screen sollte als kompakte Abschlussentscheidung lesbar sein; hier wirkt er bereits wie der Anfang eines langen Berichts. Die wichtigste nächste Aktion ist im sichtbaren Ausschnitt nicht vorhanden. Der hinter dem Papier sichtbare Button rechts verstärkt die Unklarheit, welcher Layer gerade aktiv ist.

**`end_immune_endreport_top.png`**  
Die Überschrift im dunklen Aktenkopf führt den Blick richtig, danach zerfällt die Hierarchie in Tags, fünf ähnlich gewichtete Absätze und eine nur angeschnittene Diagrammfläche. Für eine Aufnahme, die den Anfang der „Das Rennen“-Kurven zeigen soll, erscheint die eigentliche Grafik zu spät und nur als unterer Fragmentrand. Die Abschlusskennzahlen stehen zu klein und ungruppiert im Kopf. Der breite Erzähltext fühlt sich stärker wie ein Epilog als wie ein auswertbarer Bericht an. Auch hier bleibt der dahinterliegende Button rechts sichtbar und beschädigt den Eindruck eines geschlossenen Dokuments.

**`end_immune_endreport_mid.png`**  
Das Auge landet auf „Mögliche Spielenden“ und dem dichten Kartenraster, nicht auf einem Methoden-Atlas oder einer Bilanz. Damit stimmt der sichtbare Inhalt nicht mit der angekündigten Mitte des End-Reports überein. Die erreichte Variante „Enthüllung“ unterscheidet sich nur durch einen kleinen Haken und eine schwach veränderte Kontur; im Raster ist das kein ausreichend eindeutiger Status. Der oben abgeschnittene Rest einer vorherigen Box lässt den Scrollstand zufällig wirken. Der bereits sichtbare Abschlussbutton signalisiert zudem das Ende des Berichts, obwohl die Aufnahme als Berichtsmittelpunkt bezeichnet ist.

**`end_immune_endreport_bottom.png`**  
Diese Aufnahme ist pixelgleich oder nahezu pixelgleich mit `end_immune_endreport_mid.png`. Sichtbar sind erneut mögliche Spielenden und eine allgemeine Einordnung, nicht die angekündigten Gegenmaßnahmen beziehungsweise ein eigenständiges Debrief. Der Blick geht zuerst ins Kartenraster, obwohl am Berichtsende die Einordnung oder der Lerntransfer den stärksten Abschluss bilden sollte. Der kleine mittig gesetzte Satz über dem Button ist dafür visuell viel zu schwach. Der Button ist gut auffindbar, aber seine neutrale Kastenform vermittelt weder Abschlussstempel noch klare Primäraktion.

**`end_victory_wahlabend_s0.png`**  
Das Auge sucht zunächst im großen leeren Fernsehfeld und findet erst danach den kleinen Balken mit „27,0 %“. Eigentlich sollte die erste Hochrechnung mitsamt Verhältnis zur Schwelle sofort verständlich sein. Die Balkengrafik sitzt isoliert in der Mitte und nutzt nur einen kleinen Teil der verfügbaren Fläche. „LIVE“ und „Klicken zum Fortfahren“ sind so kontrastarm und klein, dass beide wie Dekoration wirken. Trotz der Bezeichnung Titelkarte fehlt ein sichtbarer, dominanter Titel für den Wahlabend.

**`end_victory_wahlabend_s1.png`**  
Der rote Balken ist nun der klare Blickfang, aber der Zustandswechsel gegenüber `end_victory_wahlabend_s0.png` besteht visuell fast nur aus dem Farbwechsel. Die entscheidende Nachricht „die Regierung ist abgewählt“ bleibt in der schmalen Tickerzeile am unteren Fernsehrahmen. Die Darstellung von 27,0 %, Balkenfüllung und Schwellenposition wirkt geometrisch nicht plausibel: Der Balken reicht deutlich weiter als die Zahl erwarten lässt. Dadurch muss man die Grafik interpretieren, statt sie unmittelbar zu verstehen. Der Fortfahren-Hinweis bleibt weiterhin zu schwach.

**`end_victory_wahlabend_s2.png`**  
Zwei rote Anker konkurrieren um Aufmerksamkeit: der Balken in der Bildschirmmitte und der massive Weiter-Button unten. Die narrative Konsequenz zwischen beiden ist dagegen klein gesetzt und verliert sich. Wie bei `end_immune_wahlabend_s2.png` wurde der Fernseher nach oben verschoben und angeschnitten, wodurch die Sequenz sichtbar springt. Die sechs Milieu-Chips bilden eine unruhige, unterschiedlich breite Zickzackgruppe. Der untere Bereich ist so dicht gepackt, dass die große Leere im Fernseher und die Enge darunter wie zwei getrennte Layouts wirken.

**`end_victory_wahlabend_s3.png`**  
Die Überschrift „Die Mehrheit, gemacht“ ist der stärkste und richtige Einstieg. Direkt danach fehlen jedoch klar hervorgehobene Ergebniskennzahlen; sie stehen wieder als kleine Zeile im Kopfband. Die Tags „Triumph“ und „Triumphal“ sehen wie unselektierte Schalter aus und tragen dadurch weniger als beabsichtigt. Das Diagramm ist im ersten sichtbaren Bereich nur teilweise vorhanden, während vier ähnlich gesetzte Absätze viel Raum verbrauchen. Oberhalb und rechts hinter dem Bericht scheinen fremde Hintergrundtexte beziehungsweise der Button des vorherigen Layers durch.

---

## 2. **Konkrete Eingriffe je Screen**

### `end_immune_wahlabend_s2.png`

- **Fernsehrahmen → um etwa ein Sechstel niedriger skalieren und vollständig mit einem kleinen oberen Außenabstand im Viewport halten → der untere Erzähl- und Bedienbereich erhält Luft, ohne dass der Rahmen angeschnitten wird.**
- **„Ihre Schlagzeilen – geprüft“ und „GEFÄLSCHT“ → als gemeinsame Ergebnisgruppe im mittleren Drittel anordnen; Überschrift etwa 1,4-mal größer und direkt oberhalb beziehungsweise linksbündig zum Stempel → Aussage und Urteil werden in einem Blick erfasst.**
- **Leere rote Bildschirmfläche → Ergebnisgruppe vertikal ins optische Zentrum ziehen und deren Gesamtfläche ungefähr verdoppeln → die größte Fläche des Bildes trägt dann auch die wichtigste Information.**
- **Milieu-Chips → in ein gleichmäßiges Drei-mal-zwei-Raster mit identischen Breiten setzen, Außenkanten an der Textbreite darüber ausrichten → die gegenwärtige Zickzackkontur verschwindet.**
- **Weiter-Button → mindestens eine Buttonhöhe Abstand zur unteren Bildkante geben und gemäß `desinformation-network/src/story-mode/theme.ts` als heller Papierknopf mit rotem Doppelring statt als vollrote Fläche ausführen → keine Beschneidung und bessere Bindung an die Behörden-Aktenwelt.**

### `end_immune_wahlabend_s3.png`

- **Berichtslayer → auf höchstens etwa 92 % der Viewporthöhe begrenzen, vollständig einrücken und nur den Papierinhalt intern scrollen → keine zufällige Beschneidung an der unteren Kante.**
- **Hintergrund hinter dem Bericht → vollständig abdunkeln oder opak abdecken und den rechts sichtbaren Button entfernen → es bleibt nur eine aktive Interaktionsebene.**
- **Kennzahlenzeile im Kopfband → in drei gleich breite Felder unter dem Einleitungssatz aufteilen, Werte deutlich größer als die Labels setzen → Dauer, Aktionen und Vertrauen werden als Abschlussdaten erkennbar.**
- **Spielstil-Tags → direkt hinter „Spielstil-Bewertung“ setzen und den Bewertungswert durch gefüllte Tintenfläche oder Stempelkontur von gewöhnlichen Chips unterscheiden → sie lesen sich nicht länger als deaktivierte Filter.**
- **Absatzblock vor „Vertrauensverlauf“ → vertikale Abstände um etwa ein Drittel reduzieren oder auf einen kürzeren Epilog begrenzen → Diagrammüberschrift und ein substanzieller Teil der Grafik passen gemeinsam in den ersten Sichtbereich.**

### `end_immune_gameend.png`

- **Gesamter Screen → als einseitige Abschlusskarte statt als angeschnittener Langbericht aufbauen: Kopf, zwei bis drei Ergebniskennzahlen, kurzer Epilog und sichtbare Primäraktion → der Zustand unterscheidet sich klar von `end_immune_endreport_top.png`.**
- **Nächste Aktion → unterhalb des Epilogs innerhalb des sichtbaren Papierbogens platzieren, mit mindestens derselben optischen Breite wie die Spielstil-Tags zusammen → der Spieler sieht ohne Scrollen, wie es weitergeht.**
- **Vertrauensdiagramm → auf diesem Game-End-Screen entweder vollständig zeigen oder in den ausführlichen Bericht verschieben; nicht nur den oberen Rand anschneiden → ein Fragment erzeugt einen unfertigen Eindruck.**
- **Hintergrund-Button rechts → ausblenden, solange das Abschlussdokument aktiv ist → keine konkurrierende Navigation durch den Modal-Layer.**
- **Kopfband → gegenüber dem ausführlichen Bericht mit einem klaren Abschlussstempel oder einer kompakten Statuszeile differenzieren → `end_immune_gameend.png` erhält eine eigene visuelle Funktion.**

### `end_immune_endreport_top.png`

- **Berichtsblatt → für die datenreiche Ansicht etwa 10–15 % breiter machen, die äußeren Ränder aber symmetrisch halten → Diagramme und Beschriftungen erhalten mehr Nutzbreite.**
- **Kopfkennzahlen → aus der laufenden Textzeile lösen und direkt unter dem Titel als kompakte Dreiergruppe ausrichten → die Zusammenfassung ist vor dem Fließtext erfassbar.**
- **Erzählabsätze → Zeilenlänge auf ungefähr zwei Drittel der Blattbreite begrenzen oder in einen schmaleren Textblock setzen → die langen Zeilen werden leichter verfolgt.**
- **„Vertrauensverlauf“ und Diagramm → als untrennbaren Block behandeln; beim Einstieg entweder Überschrift plus mindestens die obere Hälfte der Grafik zeigen oder den Block vollständig unter den Falz schieben → kein verwaistes Diagrammfragment.**
- **Modalhintergrund → vollständig opak machen und die darunterliegende Aktion rechts entfernen → das Blatt wirkt wie ein eigenständiger Bericht, nicht wie ein Overlay mit Leckstellen.**

### `end_immune_endreport_mid.png`

- **Scrollposition → am Beginn einer vollständigen Sektion einrasten; den oben abgeschnittenen Rest der vorherigen Box entfernen → der Ausschnitt beginnt mit einer klaren Abschnittskante.**
- **Abschnittsinhalt → prüfen und an den vorgesehenen Methoden-/Bilanzabschnitt koppeln; sichtbar ist derzeit „Mögliche Spielenden“ → Navigation, Scrollanker oder Aufnahmezustand passen nicht zur bezeichneten Berichtsstelle.**
- **Kartenraster → Spaltengasse auf mindestens die jeweilige Karten-Innenpolsterung vergrößern und alle Karten einer Zeile auf identische Höhe bringen → die acht Kästen wirken weniger gedrängt.**
- **Erreichte Karte „Enthüllung“ → mit deutlich sichtbarem Erfolgsstempel im oberen rechten Kartenviertel und einer getönten Papierfläche markieren → der Status ist nicht mehr nur am kleinen Haken erkennbar.**
- **„Bericht schließen“ → in einer als Mitte bezeichneten Ansicht nicht bereits als dominanten Abschluss zeigen; stattdessen erst am echten Dokumentende einblenden oder als festen, deutlich zurückgenommenen Footer behandeln → die Scrolltiefe bleibt verständlich.**

### `end_immune_endreport_bottom.png`

- **Inhalt des unteren Berichtsteils → die angekündigten Gegenmaßnahmen beziehungsweise das Debrief vor dem Schlussbereich sichtbar machen → die Aufnahme zeigt derzeit denselben Inhalt wie `end_immune_endreport_mid.png`.**
- **„Einordnung“ → als eigentlichen Abschlussblock stärker fassen: breitere linke Tintenlinie, etwas größere Kernaussage und klarer Abstand zum Kartenraster → der Lerntransfer wird zum Zielpunkt des unteren Abschnitts.**
- **Hinweissatz „Dieses Spiel dient …“ → linksbündig zur Einordnung setzen und etwa auf normale Fließtextgröße anheben → der wichtigste Meta-Hinweis wirkt derzeit wie kleingedrucktes Copyright.**
- **Schlussbereich → oberhalb und unterhalb des Buttons jeweils ungefähr eine halbe Buttonhöhe Abstand vorsehen → Footer, Hinweis und Aktion kleben weniger zusammen.**
- **„Bericht schließen“ → als Stempel-CTA gemäß `stampCtaStyle` in `desinformation-network/src/story-mode/theme.ts` gestalten → die Abschlussaktion spricht dieselbe Material- und Aktensprache wie das restliche Interface.**

### `end_victory_wahlabend_s0.png`

- **Balkenskala → Zahl, Füllstand und Schwellenmarker auf dieselbe lineare Skala bringen; den Wert direkt am Ende der Füllung platzieren → 27,0 % ist geometrisch nachvollziehbar.**
- **Erste Hochrechnung → als deutliche Überschrift oberhalb des Balkens innerhalb des Fernsehbilds setzen, ungefähr doppelt so groß wie das aktuelle Senderlabel → die Titelkarte erhält einen klaren Einstieg.**
- **Fernsehinhalt → Balkengruppe insgesamt um etwa ein Drittel vergrößern und den leeren oberen Bereich deutlich reduzieren → die Informationsgrafik trägt die verfügbare Fläche.**
- **„LIVE“ → Kontrast und Größe erhöhen und mit gleichmäßigem Innenabstand zum oberen und rechten Bildschirmrand setzen → der Sendestatus ist erkennbar statt fast unsichtbar.**
- **„Klicken zum Fortfahren“ → mindestens auf die Größe des TickertTexts anheben und näher an die Unterkante des Fernsehrahmens rücken → Aufforderung und zugehörige Interaktionsfläche werden zusammen gelesen.**

### `end_victory_wahlabend_s1.png`

- **Tickerbotschaft „Regierung ist abgewählt“ → oberhalb des Balkens als Ergebniszeile hochstufen; im Ticker kann sie verkürzt wiederholt werden → die entscheidende Wendung hängt nicht am kleinsten Textbereich.**
- **Balken → Füllende exakt an den numerischen Wert koppeln und Schwelle zusätzlich numerisch beschriften → die aktuell widersprüchliche Geometrie verschwindet.**
- **Zustandswechsel zu `end_victory_wahlabend_s0.png` → neben dem Farbwechsel eine klare Ergebnisüberschrift oder einen Stempel innerhalb des Bildschirms verwenden → der neue Schritt ist auch ohne Animation verständlich.**
- **Tickerleiste → Sendername und Meldung auf einer gemeinsamen Grundlinie ausrichten und zwischen beiden ungefähr eine Zeichenhöhe Abstand lassen → die Zeile wirkt nicht wie zwei zusammengeschobene Textstile.**
- **Fortfahren-Hinweis → Kontrast auf das Niveau der weißen Prozentzahl anheben → der einzige Bedienhinweis bleibt nicht hinter dem Inhalt zurück.**

### `end_victory_wahlabend_s2.png`

- **Fernsehrahmen → dieselbe Position und Größe wie in `end_victory_wahlabend_s0.png` und `end_victory_wahlabend_s1.png` beibehalten oder den Übergang sichtbar animieren → der Layoutsprung zwischen den Schritten entfällt.**
- **Narrativer Satz unter dem Fernseher → in eine klare Papier- oder Untertitelzeile mit derselben Breite wie die Milieu-Gruppe setzen und den Zeilenumbruch kontrollieren → er wirkt als eigenständiger Story-Beat.**
- **Milieu-Chips → auf zwei Reihen mit je drei gleich breiten Feldern normieren und an einer gemeinsamen linken und rechten Kante ausrichten → die unruhige Silhouette wird zu einer lesbaren Auswertung.**
- **Weiter-Button → von der unteren Bildkante lösen und vom vollroten Block zum roten Stempelknopf auf Papier wechseln → weniger Konkurrenz zum roten Ergebnisbalken und Einhaltung der UI-Tokens.**
- **Ergebnis im Fernseher → die Meldung über die abgewählte Regierung stärker als den Balken gewichten, etwa durch eine größere Zeile direkt darüber → der Blick geht zuerst zur Konsequenz, nicht erneut zur bereits bekannten Messung.**

### `end_victory_wahlabend_s3.png`

- **Hintergrundreste oberhalb und rechts → vollständig maskieren, solange der Abschlussbericht geöffnet ist → „A Manufactured Majority“ und der alte Button bilden keine Geisterebene mehr.**
- **Kopfkennzahlen → als drei separate Felder unter dem Titel anlegen, Werte deutlich größer und fett setzen → die Bilanz ist vor dem Epilog erfassbar.**
- **„Triumph“/„Triumphal“ → als beschriftete Bewertung ausgeben, beispielsweise „Ergebnis: Triumph“ und „Spielstil: triumphal“, statt als zwei gleichartige Outline-Chips → Funktion und Zustand sind sofort klar.**
- **Absatzrhythmus → Abstände zwischen den vier Absätzen um ungefähr ein Drittel reduzieren, Zeilenabstand leicht erhöhen → weniger vertikale Streckung bei besserer Lesbarkeit.**
- **Vertrauensdiagramm → weiter nach oben ziehen oder den Bericht beim Einstieg direkt auf eine vollständige Diagrammsektion scrollen → Kurve, Achsen und Schwelle erscheinen nicht nur teilweise.**

---

## 3. **Grafiken/Assets**

- **Die Fernsehrahmen in `end_victory_wahlabend_s0.png` bis `end_victory_wahlabend_s2.png` tragen die Broadcast-Idee**, weil Rahmen, Scanlines und Ticker als zusammengehöriges In-World-Display lesbar sind. Sie sind scharf genug und zeigen keine sichtbaren Skalierungsartefakte. Falsch skaliert ist nicht der Rahmen selbst, sondern sein Verhältnis zum Inhalt: Rund zwei Drittel der inneren Fläche bleiben visuell ungenutzt.
- **Der „GEFÄLSCHT“-Stempel in `end_immune_wahlabend_s2.png` ist das stärkste Einzelasset des Bündels.** Seine Größe ist für ein Endurteil angemessen, aber er schwebt ohne ausreichend großes Beleg- oder Schlagzeilenmaterial im Raum. Eine kleine Aktenmontage aus zwei bis drei gestrichenen Schlagzeilen oder Prüfvermerken direkt hinter beziehungsweise unter dem Stempel würde die Fläche sinnvoll füllen, ohne eine neue Bildwelt einzuführen.
- **Die Papierblätter in `end_immune_wahlabend_s3.png`, `end_immune_gameend.png`, `end_immune_endreport_top.png`, `end_immune_endreport_mid.png`, `end_immune_endreport_bottom.png` und `end_victory_wahlabend_s3.png` entsprechen der Behörden-Aktenabsicht.** Cremefläche, dunkles Kraftpapier-Kopfband und dünne Tintenlinien passen zu den Tokens in `desinformation-network/src/story-mode/theme.ts`. Die Blätter wirken allerdings zu digital-rechteckig, weil Layerkanten, Scrollzustand und darunterliegende Buttons sichtbar bleiben.
- **Die vollroten Weiter-Buttons in `end_immune_wahlabend_s2.png` und `end_victory_wahlabend_s2.png` wirken fremd.** `desinformation-network/src/story-mode/theme.ts` reserviert Rot für Stempel und Kopfbänder und definiert ausdrücklich einen hellen Stempel-CTA mit rotem Doppelring. Die derzeitige große Rotfläche zieht mehr Aufmerksamkeit als das eigentliche Ergebnis.
- **Die Balkengrafik in `end_victory_wahlabend_s0.png` bis `end_victory_wahlabend_s2.png` ist stilistisch zu generisch.** Sie sieht eher wie ein Debug-/HUD-Balken als wie eine Wahlgrafik eines Senders aus. Am meisten bringen würde hier eine kompakte, papierinspirierte Hochrechnungstafel mit klarer Skala, Schwellenzahl und einem großen Ergebniswert; keine zusätzliche Illustration, sondern eine präzisere Informationsgrafik.
- **In `end_immune_endreport_mid.png` und `end_immune_endreport_bottom.png` fehlt ein eigenständiges visuelles Asset für Methoden, Gegenmaßnahmen oder Debrief.** Sichtbar sind ausschließlich Textkarten. Kleine einfarbige Aktenzeichen, Stempel oder Verbindungslinien könnten die Kategorien unterscheiden, wichtiger ist jedoch zunächst, dass überhaupt die vorgesehenen Abschnitte dargestellt werden.
- **Fotografische oder gerenderte Bildassets sind in diesen zehn Aufnahmen nicht sichtbar.** Deshalb lassen sich Auflösung, Sättigung und Zuschnitt solcher Assets hier nicht beurteilen; die sichtbaren Pixelkanten von Rahmen, Schrift und Diagrammen sind überwiegend scharf.

---

## 4. **Raster & Rhythmus**

- Die zentrale Breite von ungefähr 720 Bildpunkten beziehungsweise etwas mehr als der halben Viewportbreite ist über die Screens hinweg grundsätzlich konsistent. Problematisch ist der Wechsel der vertikalen Geometrie: In `end_victory_wahlabend_s0.png` und `end_victory_wahlabend_s1.png` steht der Fernseher eingerückt, in `end_victory_wahlabend_s2.png` und `end_immune_wahlabend_s2.png` klebt er oben am Rand. Ein einziges festes Sequenzraster sollte den Fernseher, den Story-Beat und die Aktion über alle Wahlabend-Schritte an denselben Bezugskanten halten.
- Für die Wahlabend-Screens bietet sich eine feste Dreiteilung an: etwa zwei Drittel Höhe für den Fernseher, knapp ein Viertel für Text und Milieus, der Rest als sicherer Aktions- und Außenabstand. Derzeit werden große tote Flächen im Fernseher mit einem gequetschten unteren Drittel kombiniert.
- Die Milieu-Chips in `end_immune_wahlabend_s2.png` und `end_victory_wahlabend_s2.png` sind zwar zentriert, aber nicht gerastert. Unterschiedliche Breiten und wechselnde Startkanten erzeugen eine dekorative Wolke, obwohl es sich um eine systematische Liste handelt. Gleich breite Spalten und konstante Zeilenabstände würden den Behördencharakter deutlich stärken.
- Die Berichte besitzen innen eine brauchbare gemeinsame linke Kante für Überschriften, Regeln und Fließtext. In `end_immune_endreport_mid.png` und `end_immune_endreport_bottom.png` ist die Gasse zwischen den beiden Kartenspalten jedoch deutlich enger als Außenabstand und Kartenpolsterung. Diese drei Abstände sollten aus demselben Rastermaß abgeleitet werden.
- Die Berichtsabschnitte verwenden zu viele gleich starke horizontale Linien. In `end_immune_endreport_top.png` konkurrieren Abschnittsregel, Diagrammrahmen und Blattkante; in den unteren Aufnahmen kommen acht Kartenrahmen hinzu. Außenrahmen kräftig, Abschnittstrenner mittel und Kartenrahmen deutlich heller zu setzen würde drei Ebenen erzeugen.
- Tote Fläche entsteht vor allem in den Fernsehbildern. Unruhe entsteht dagegen unterhalb der Fernseher sowie am unteren Berichtsende. Fläche sollte von oben nach unten umverteilt werden, nicht durch zusätzliche Elemente insgesamt vergrößert werden.
- Der abgeschnittene Inhalt am oberen Rand von `end_immune_endreport_mid.png` und `end_immune_endreport_bottom.png` braucht einen Scrollanker. Eine Sektion sollte entweder vollständig unter einer festen Kopfzone beginnen oder sichtbar als fortgesetzter Inhalt markiert werden; die aktuelle halbe Box erfüllt keines von beidem.

---

## 5. **Lesbarkeit**

- In `end_victory_wahlabend_s0.png` und `end_victory_wahlabend_s1.png` musste ich bei „LIVE“, „SCHWELLE“ und „Klicken zum Fortfahren“ zweimal hinsehen. Alle drei Texte sind zu klein und zu kontrastarm gegenüber dem dunkelblauen Hintergrund.
- In `end_immune_wahlabend_s2.png` ist „SONDERSENDUNG“ oben rechts praktisch unsichtbar. Auch „Ihre Schlagzeilen – geprüft“ ist gegenüber dem großen Stempel um mehrere Hierarchiestufen zu klein.
- Die Milieu-Chips in `end_immune_wahlabend_s2.png` und `end_victory_wahlabend_s2.png` liegen an der unteren Grenze sinnvoller Lesbarkeit. Etwa 15–20 % mehr Schriftgröße, etwas mehr Innenhöhe und ein heller Papiergrund statt bloßer dunkler Konturen würden helfen.
- Die Fließtexte der Berichte sind kontrastreich genug, aber sehr weit gesetzt. Besonders in `end_immune_wahlabend_s3.png` und `end_immune_endreport_top.png` erschweren lange Zeilen und die Pixel-Monospace-Schrift den Zeilensprung. Eine geringere Textbreite bei leicht größerem Zeilenabstand wäre wirksamer als nur eine größere Schrift.
- Die Kennzahlen „Kampagne“, „Aktionen gesamt“ und „Finales Vertrauen“ sind in allen Berichtsköpfen zu klein für ihre Bedeutung. Ihre Labels dürfen klein bleiben, die eigentlichen Werte sollten ungefähr auf Unterüberschriftenniveau stehen.
- Die Zustände der Spielstil-Tags in `end_immune_wahlabend_s3.png`, `end_immune_gameend.png`, `end_immune_endreport_top.png` und `end_victory_wahlabend_s3.png` sind unklar. Outline-Rechtecke signalisieren im übrigen UI-Vokabular eher auswählbar oder inaktiv, nicht „festgestellte Bewertung“.
- In `end_immune_endreport_mid.png` und `end_immune_endreport_bottom.png` musste ich gezielt suchen, welche Endung erreicht wurde. Der kleine Haken bei „Enthüllung“ reicht innerhalb von acht ähnlich aussehenden Karten nicht.
- Die Diagrammbeschriftungen in `end_victory_wahlabend_s3.png` sind klein, aber noch erkennbar; die rote „40 %“-Marke sitzt allerdings sehr dicht am rechten Plotrand. Sie sollte außerhalb des Datenfeldes eine eigene Beschriftungsspalte erhalten.
- Der halb sichtbare Text „Vollständiger Lagebericht“ hinter mehreren Berichtsscreens ist nicht nur schlecht lesbar, sondern sollte in diesem Zustand überhaupt nicht sichtbar sein.

---

## 6. **Die drei wirksamsten Änderungen**

1. **Alle Wahlabend-Schritte auf ein festes Layout setzen und den Fernseher um etwa 15–20 % verkleinern.** Dadurch verschwinden obere Beschneidung, Layoutsprünge, tote Bildschirmfläche und die Enge um Text, Milieus und Weiter-Button in einem Eingriff.

2. **Berichtslayer vollständig vom Hintergrund isolieren und Game-End-Karte, Report-Anfang, -Mitte und -Ende visuell wie inhaltlich trennen.** Das beseitigt die durchscheinenden Buttons und Texte sowie die derzeit identischen beziehungsweise falsch verankerten Aufnahmen mit vergleichsweise wenig CSS- und Zustandsarbeit.

3. **Ergebnisse als klare Statuskomponenten neu hierarchisieren: große Kennzahlen, konsistente Balkenskala, eindeutiger „ERREICHT“-Stempel und Stempel-CTAs.** Damit werden sowohl die Wahlgrafik als auch die Berichte unmittelbar verständlicher und die Oberfläche folgt zugleich den Vorgaben aus `desinformation-network/src/story-mode/theme.ts`.

---

## 7. **Blinde Flecken**

- Aus `end_victory_wahlabend_s0.png` und `end_victory_wahlabend_s1.png` ist nicht erkennbar, ob die Balkenfüllung animiert wird und ob der scheinbare Maßstabsfehler nur ein Zwischenframe ist. Dafür wären Anfangs-, Mittel- und Endframe derselben Animation nötig.
- Die Screenshots zeigen keine Hover-, Fokus-, Tastatur- oder gedrückten Zustände der Weiter- und Schließen-Aktionen. Dafür werden Aufnahmen der Buttons in allen Interaktionszuständen benötigt.
- Es ist nicht sichtbar, ob die Berichte per Mausrad, Dragging, Tastatur oder eigenem Scrollbalken navigiert werden. Eine Aufnahme mit sichtbarem Scrollindikator und eine während des Scrollens wären erforderlich.
- `end_immune_wahlabend_s3.png`, `end_immune_gameend.png` und `end_immune_endreport_top.png` erscheinen identisch. Ohne Aufnahme direkt vor und nach dem jeweiligen Zustandswechsel lässt sich nicht beurteilen, ob dies ein Capture-Fehler oder die tatsächliche UX ist.
- `end_immune_endreport_mid.png` und `end_immune_endreport_bottom.png` erscheinen ebenfalls identisch und zeigen weder Methoden-Atlas noch Gegenmaßnahmen. Für diese Abschnitte werden korrigierte Screenshots an den tatsächlichen Scrollankern benötigt.
- Alle Aufnahmen liegen bei 1280 × 720 vor. Nicht beurteilbar sind kleinere Fenster, breitere Seitenverhältnisse, UI-Skalierung und mögliche Überläufe bei vergrößerter Schrift.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
