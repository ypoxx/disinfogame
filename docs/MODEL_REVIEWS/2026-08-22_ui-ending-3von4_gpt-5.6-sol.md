# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „ending-3von4"

**Modell:** `gpt-5.6-sol` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-22
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-22T17:19:07.670Z · **Dauer:** 207.3 s
**Nutzung:** nicht gemeldet · **Kosten:** unbekannt · **Anbieter-Datensammlung:** ausgeschlossen (deny)

> ⚠️ **Wie das zu lesen ist:** Ein *fremdes* Modell hat einen **kuratierten Ausschnitt**
> des Projekts gesehen — nicht das laufende Spiel und nicht das ganze Repository. Es kann
> daher weder Laufzeitverhalten prüfen noch `file:line`-Belege verifizieren. Befunde sind
> **Hypothesen**, die vor dem Umsetzen am Code/an den Daten gegenzuprüfen sind. Die
> kanonische Wahrheit bleibt [`docs/VISION_LOCK.md`](../VISION_LOCK.md) bzw. die Spieldaten.

## Gestellte Frage

Sieh dir die beigefügten Screenshots des laufenden Spiels an und mache einen UX/UI-Durchgang. Die Optik soll eine Behörden-/Papierwelt sein (Stil-Anker und Farbtoken liegen bei). Sag mir: Wo führt das Bild den Blick falsch, welche Grafiken sitzen an der falschen Stelle oder in der falschen Größe, wo stimmen Abstände und Ausrichtung nicht, und welche drei Änderungen bringen am meisten? Sei so konkret, dass man es direkt umsetzen kann.

## Dieser Durchgang: Bündel „ending-3von4" (10 Screenshots)

Das siehst du, in dieser Reihenfolge:
- end_victory_gameend.png — GameEndScreen (victory)
- end_victory_endreport_top.png — End-Report (victory), Anfang: „Das Rennen"-Kurven
- end_victory_endreport_mid.png — End-Report (victory), Mitte: Methoden-Atlas/Bilanz
- end_victory_endreport_bottom.png — End-Report (victory), Ende: Gegenmaßnahmen/Debrief
- fixture_wahlabend_victory_s0.png — Wahlabend-Fixture (victory): Titelkarte
- fixture_wahlabend_victory_s1.png — Wahlabend-Fixture (victory): Schritt 1 (Hochrechnung/Sondersendung)
- fixture_wahlabend_victory_s2.png — Wahlabend-Fixture (victory): Schritt 2 (Ergebnis/Stempel)
- fixture_wahlabend_victory_s3.png — Wahlabend-Fixture (victory): Schritt 3 (Wohnzimmer-Schnitt + Nachsatz)
- fixture_wahlabend_timeout_s0.png — Wahlabend-Fixture (timeout): Titelkarte
- fixture_wahlabend_timeout_s1.png — Wahlabend-Fixture (timeout): Schritt 1 (Hochrechnung/Sondersendung)

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
| 🖼 Bild | `end_victory_gameend.png` | `desinformation-network/runs/visual-review/latest/shots/end_victory_gameend.png` | 66 kB |
| 🖼 Bild | `end_victory_endreport_top.png` | `desinformation-network/runs/visual-review/latest/shots/end_victory_endreport_top.png` | 66 kB |
| 🖼 Bild | `end_victory_endreport_mid.png` | `desinformation-network/runs/visual-review/latest/shots/end_victory_endreport_mid.png` | 97 kB |
| 🖼 Bild | `end_victory_endreport_bottom.png` | `desinformation-network/runs/visual-review/latest/shots/end_victory_endreport_bottom.png` | 97 kB |
| 🖼 Bild | `fixture_wahlabend_victory_s0.png` | `desinformation-network/runs/visual-review/latest/shots/fixture_wahlabend_victory_s0.png` | 178 kB |
| 🖼 Bild | `fixture_wahlabend_victory_s1.png` | `desinformation-network/runs/visual-review/latest/shots/fixture_wahlabend_victory_s1.png` | 128 kB |
| 🖼 Bild | `fixture_wahlabend_victory_s2.png` | `desinformation-network/runs/visual-review/latest/shots/fixture_wahlabend_victory_s2.png` | 128 kB |
| 🖼 Bild | `fixture_wahlabend_victory_s3.png` | `desinformation-network/runs/visual-review/latest/shots/fixture_wahlabend_victory_s3.png` | 152 kB |
| 🖼 Bild | `fixture_wahlabend_timeout_s0.png` | `desinformation-network/runs/visual-review/latest/shots/fixture_wahlabend_timeout_s0.png` | 178 kB |
| 🖼 Bild | `fixture_wahlabend_timeout_s1.png` | `desinformation-network/runs/visual-review/latest/shots/fixture_wahlabend_timeout_s1.png` | 128 kB |

---

## Antwort des Modells

## 1. **Erster Eindruck**

### `end_victory_gameend.png`
Das Auge landet zuerst auf „Die Mehrheit, gemacht“, danach aber unmittelbar auf dem langen Fließtext. Zuerst sollten Ausgang, wichtigste Kennzahl und Spielstil in dieser Reihenfolge erfassbar sein; die sehr kleine Zusammenfassungszeile leistet das nicht. Der Bericht wirkt farblich wie eine Akte, materiell jedoch eher wie eine flache Web-Seite, weil Papierstruktur, Stempel oder sichtbare Dokumentlagen fehlen. Der angeschnittene Vertrauensgraph verspricht Information, endet aber am unteren Bildrand ohne erkennbare Scrollführung. Rechts unten scheint zudem die zugrunde liegende Aktion „Vollständiger Lagebericht“ durch die Abdunklung und erzeugt eine zweite, unbrauchbare Blickspur.

### `end_victory_endreport_top.png`
`end_victory_endreport_top.png` ist visuell identisch mit `end_victory_gameend.png`; ein eigener Übergang vom Spielende zum vollständigen Bericht ist nicht erkennbar. Die Hierarchie beginnt korrekt beim Titel, verliert sich dann aber in vier ähnlich gewichteten Textabsätzen. Eigentlich sollte der Blick vom Ausgang zur Kampagnenbilanz und dann zum Vertrauensverlauf geführt werden. Die Kennzahlenzeile unter dem Untertitel ist dafür zu klein und zu wenig gegliedert. Der Graph beginnt als nächste Hauptinformation, wird jedoch so knapp angeschnitten, dass weder Verlauf noch Endpunkt lesbar werden.

### `end_victory_endreport_mid.png`
Der Blick fällt zuerst auf das Raster „Mögliche Spielenden“, nicht auf das tatsächlich erreichte Ende. „Sieg (erreicht)“ ist nur durch ein kleines Häkchen, eine schwache Tönung und minimale Randänderung ausgezeichnet; das reicht in einem achtteiligen Raster nicht. Danach führt die blaue linke Linie gut zur Einordnung, doch beide Absätze besitzen fast dasselbe Gewicht. Am oberen Rand hängt ein Rest des vorherigen Abschnitts angeschnitten im Bild, wodurch die Seite nicht wie ein bewusst gesetzter Berichtsabschnitt beginnt. Der Schließen-Button ist sichtbar, wirkt aber wie ein gewöhnlicher graubrauner Web-Button statt wie die im Stilkontext definierte Stempelaktion.

### `end_victory_endreport_bottom.png`
`end_victory_endreport_bottom.png` zeigt denselben sichtbaren Ausschnitt wie `end_victory_endreport_mid.png`; ein eigener unterer Berichtszustand ist nicht erkennbar. Das Auge bleibt erneut am dichten Enden-Raster hängen, obwohl hier Einordnung, Debrief und Abschlussaktion dominieren sollten. Die Schlussbotschaft „Dieses Spiel dient dem Verständnis …“ ist sehr klein und bekommt durch die lange Trennlinie mehr Gewicht, als ihre Schriftgröße tragen kann. Der Button bildet zwar einen Endpunkt, steht aber zu isoliert und besitzt weder die erwartete rote Stempelkontur noch eine deutlich erkennbare Primäraktion-Hierarchie.

### `fixture_wahlabend_victory_s0.png`
Das Auge trifft zuerst den großen Titel „Die Hochrechnung“, was für eine Titelkarte richtig ist. Danach entsteht jedoch fast nur schwarze Leere; die angekündigte Situation „Nur der News-Fernseher läuft“ wird bildlich nicht sichtbar. Die Gruppe sitzt rechnerisch in der Mitte, wirkt wegen der enormen ungenutzten Fläche aber zu klein und zu weit entfernt. Der Fortfahren-Hinweis ist der schwächste Text im Bild, obwohl er die einzige Interaktion bezeichnet. Die dunkelockerne Schrift auf nahezu schwarzem Grund entfernt sich zudem deutlich von der Behörden-/Papierwelt.

### `fixture_wahlabend_victory_s1.png`
Zuerst fällt der große dunkle Fernsehrahmen auf, innerhalb davon aber erst spät der kleine Balken. Der Blick sollte sofort auf „Westunion Erwacht“, den Prozentwert und die Schwelle gehen; diese Kerndaten belegen nur einen schmalen Streifen in einer fast leeren Fläche. Der Prozentwert wirkt nicht logisch mit der Balkenlänge gekoppelt: 21,6 % stehen einem deutlich stärker gefüllten Balken gegenüber, ohne Skala oder erklärten Wertebereich. Die Bauchbinde trägt die Fernsehsituation besser als die restliche leere Screenfläche. „LIVE“, „SCHWELLE“ und der Fortfahren-Hinweis sind so klein und kontrastarm, dass sie wie Dekoration statt Statusinformationen wirken.

### `fixture_wahlabend_victory_s2.png`
Der rote Balken zieht nun den Blick zuerst an, nicht das eigentliche Wahlergebnis in der Bauchbinde. Damit wird eine große rote Fläche als Datencodierung verwendet, obwohl Rot laut `desinformation-network/src/story-mode/theme.ts` Stempeln, Kopfbändern und Alarm vorbehalten ist. Der Zustandswechsel von Hochrechnung zu Ergebnis besteht visuell fast nur aus der Füllfarbe; ein klarer Ergebnisstempel oder eine neue Überschrift ist nicht sichtbar. Die obere Hälfte des Fernsehbildes bleibt weiterhin leer und schwächt den dramatischen Moment. Auch hier ist die Relation zwischen 21,6 %, Balkenfüllung und Schwellenposition nicht selbsterklärend.

### `fixture_wahlabend_victory_s3.png`
Der Fernsehrahmen ist nach oben geschoben und am oberen Bildrand angeschnitten, während der Weiter-Button unten aus dem Viewport läuft. Der Blick bleibt zunächst beim roten Balken hängen, obwohl jetzt der Nachsatz des Kurators und die gesellschaftlichen Reaktionen die neue Information bilden sollten. Ein sichtbarer „Wohnzimmer-Schnitt“ fehlt; zu sehen ist weiterhin dieselbe abstrakte Fernsehanzeige. Die sechs Reaktionsmarken bilden ein unruhiges Vier-plus-zwei-Muster und sind für ihre inhaltliche Bedeutung zu klein. Der rote Vollflächen-Button wirkt wie ein Alarm und widerspricht zusätzlich der in `desinformation-network/src/story-mode/theme.ts` festgelegten gestempelten Primäraktion.

### `fixture_wahlabend_timeout_s0.png`
Diese Titelkarte ist visuell identisch mit `fixture_wahlabend_victory_s0.png`, was vor Bekanntgabe des Ergebnisses grundsätzlich nachvollziehbar ist. Der Titel führt den Blick korrekt, aber die angekündigte dunkle Bürosituation besitzt keine sichtbare räumliche Entsprechung. Der große schwarze Hintergrund macht die eigentliche Titelgruppe unnötig klein. Unterzeile und Fortfahren-Hinweis müssen zweimal gelesen werden, weil Größe und Kontrast deutlich unter dem Titel liegen. Auch hier fehlt jeder sichtbare Anschluss an die Papier-/Aktenwelt.

### `fixture_wahlabend_timeout_s1.png`
Das Auge findet den Balken schneller als in der Titelkarte, doch die geringe Füllung im Verhältnis zur Schwelle bleibt nur geometrisch, nicht sprachlich verständlich. 15,3 % stehen isoliert am rechten Rand des Balkens; weder Skala noch Schwellenwert erklären die Distanz. Die sehr große leere Bildschirmfläche lässt die Hochrechnung wie einen unfertigen Platzhalter wirken. Die Bauchbinde ist die lesbarste und erzählerisch stärkste Ebene, sitzt aber gegenüber dem winzigen Diagramm zu weit unten. „LIVE“, „SCHWELLE“ und der Fortfahren-Hinweis bleiben deutlich zu klein.

---

## 2. **Konkrete Eingriffe je Screen**

### `end_victory_gameend.png`
- Zusammenfassungszeile unter dem Untertitel → in drei gleich hohe Kennzahlblöcke „2 Tage“, „0 Aktionen“, „58 % Vertrauen“ aufteilen und auf etwa 1,25× vergrößern → der Spielausgang wird vor dem Fließtext erfassbar.
- Fließtext unter „Spielstil-Bewertung“ → Textspalte auf etwa vier Fünftel der verfügbaren Dokumentbreite begrenzen und Absatzabstände auf ungefähr eine volle Textzeile vereinheitlichen → kürzere Zeilen und klarerer Lesetakt.
- Tags „Triumph“ und „Triumphal“ → Höhe und Innenabstand um etwa ein Drittel erhöhen, bündig an der linken Textkante halten → momentan sehen sie wie technische Metadaten statt wie Spielstil-Auswertung aus.
- Unterer Graphbereich → entweder vollständig bis einschließlich Legende zeigen oder einen deutlichen internen Scrollhinweis direkt über der unteren Dokumentkante setzen → der jetzige Anschnitt wirkt zufällig.
- Durchscheinende Hintergrundaktion rechts unten → während des modalen Berichts vollständig ausblenden, nicht nur abdunkeln → sie erzeugt eine falsche sekundäre Aktion.

### `end_victory_endreport_top.png`
- Kopfbereich → Titel links belassen, die drei Kampagnenkennzahlen jedoch rechts oder direkt darunter als klar getrennte Zusammenfassung setzen → Titel und Ergebnisdaten konkurrieren derzeit nicht genug mit dem Fließtext.
- Abschnitt „Vertrauensverlauf“ → Überschrift und Graph gemeinsam in den sichtbaren Bereich ziehen; oberhalb des Graphen höchstens eine halbe Abschnittslücke lassen → der wichtigste analytische Inhalt darf nicht erst halb unterhalb der Falz beginnen.
- Graphbeschriftungen → Achsenwerte, „40 %“-Schwelle und Endwert auf etwa 1,3× vergrößern → sie sind kleiner als der umliegende Berichtstext und nur mit genauerem Hinsehen lesbar.
- Berichtskörper → zwischen narrativer Bewertung und Datenbereich eine stärkere Dokumenttrennung einsetzen, etwa eine doppelte dünne Aktenlinie oder einen schmalen Registerstreifen → derzeit fließen Prosa und Analyse ineinander.
- Modalhintergrund → alle darunterliegenden Buttons und Karten vollständig maskieren → der Bericht muss als oberste und einzige Interaktionsebene lesbar sein.

### `end_victory_endreport_mid.png`
- Oberer Inhaltsanschnitt → vorherigen Abschnitt vollständig unter einer festen Dokumentkopf- oder Maskenkante verschwinden lassen → der sichtbare Rest am oberen Rand erzeugt den Eindruck eines Layoutfehlers.
- Karte „Sieg (erreicht)“ → mit einem roten Stempel „ERREICHT“ in der rechten oberen Ecke und einer deutlich stärkeren Papierflächen-Tönung markieren → das aktive Ende muss vor den sieben Alternativen erkannt werden.
- Enden-Raster → Spalten- und Zeilenabstände jeweils auf ungefähr eine Textzeile erhöhen; Karteninnenabstand um etwa ein Viertel vergrößern → die acht Kästen kleben derzeit zu einem Tabellenblock zusammen.
- Kartentexte → Bedingungen eine Stufe kleiner als die Endnamen, aber mit größerer Zeilenhöhe setzen → aktuell sind Titel und Erklärung typografisch zu ähnlich gewichtet.
- „Einordnung“ → ersten Satz als kurze Hauptaussage stehen lassen und den zweiten Absatz mit mindestens einer halben zusätzlichen Zeile Abstand darunter setzen → Befund und Kontext werden dadurch getrennt gelesen.

### `end_victory_endreport_bottom.png`
- Scrollziel des unteren Abschnitts → so setzen, dass der Ausschnitt mit „Einordnung“ oder dem tatsächlichen Debrief beginnt und kein Rest des vorherigen Diagramms am oberen Rand steht → `end_victory_endreport_bottom.png` dupliziert sonst visuell den Mid-Screen.
- Abschlussaktion „Bericht schließen“ → gemäß `stampCtaStyle` auf helle Papierfläche, roten Doppelring und rote Stempelschrift umstellen → die Primäraktion bekommt die vorgesehene Behördensemantik.
- Schlussbereich → Hinweistext, Button und untere Dokumentkante als kompakte Abschlussgruppe behandeln; Abstand Hinweis–Button etwa halb so groß wie Button–Dokumentkante → momentan schweben die Elemente unabhängig voneinander.
- Trennlinie über dem Hinweis → auf etwa zwei Drittel der Inhaltsbreite kürzen und am Button zentrieren → die volle Linie macht den sehr kleinen Hinweis unnötig breit und dominant.
- Erreichte-Ende-Karte → auch in diesem Ausschnitt wesentlich stärker als die Alternativen markieren → der Abschluss sollte nicht erneut eine Suchaufgabe auslösen.

### `fixture_wahlabend_victory_s0.png`
- Gesamte Titelgruppe → auf etwa 1,15× skalieren und als zusammenhängenden Block mit gleichmäßigen vertikalen Abständen setzen → die Gruppe ist gegenüber der Fläche zu klein.
- Hintergrund hinter der Titelgruppe → einen schwachen, breiten Fernsehlichtschein oder eine dunkle Büro-/TV-Silhouette über etwa die mittlere Hälfte des Bildes legen → die Textaussage erhält eine sichtbare räumliche Ursache.
- Haupttitel → Helligkeit des Ockers deutlich anheben oder auf helles Papier-Creme wechseln; Dunkelocker nur für Nebenlabels verwenden → der Titel verliert auf Schwarz unnötig Kontrast.
- „Klicken zum Fortfahren“ → auf mindestens die Größe der Unterzeile anheben und eine volle Unterzeilenhöhe darunter setzen → die einzige Aktion darf nicht wie eine Fußnote aussehen.

### `fixture_wahlabend_victory_s1.png`
- Hochrechnungsgruppe im Fernseher → auf etwa drei Viertel der inneren Bildschirmbreite erweitern und Schrift sowie Balkenhöhe um rund ein Viertel vergrößern → die Kerndaten gehen in der leeren Screenfläche unter.
- Balken → Startwert, Schwellenwert und Endwert beziehungsweise Wertebereich direkt unter dem Balken beschriften → 21,6 %, Fülllänge und Schwelle sind derzeit nicht nachvollziehbar gekoppelt.
- Prozentwert → bündig mit dem rechten Balkenende statt lose über der rechten Kante setzen und etwa 1,4× größer darstellen → er ist die wichtigste Zahl des Screens.
- „LIVE“ → mit einem kleinen hellen Papier-/Senderlabel oder höherem Creme-Kontrast versehen und mit demselben Innenabstand wie die Bauchbinde setzen → der Status klebt klein in der Ecke.
- Leere obere Bildschirmhälfte → mit einer gedämpften Wahlkarte, Studio-Silhouette oder grafischen Sitzverteilung belegen, ohne den Balken zu überlagern → der Fernseher wirkt derzeit unfertig.

### `fixture_wahlabend_victory_s2.png`
- Ergebniszustand → einen schrägen roten Stempel „REGIERUNG ABGEWÄHLT“ in das obere Drittel des Fernsehbildes setzen → der dramatische Wechsel wird sofort sichtbar und Rot erhält seine vorgesehene Funktion.
- Balkenfüllung → von flächigem Rot auf Akten-Oliv, Tintenblau oder helles Creme umstellen → Ministeriums-Rot sollte nicht als große neutrale Datenfläche dienen.
- Schwellenmarker → numerischen Schwellenwert direkt am Marker ergänzen und den aktuellen Abstand dazu ausweisen → der Übergang über die Schwelle ist sonst nur optisch geschätzt.
- Bauchbinde → Ergebnistext etwa eine Stufe größer als den Sendernamen setzen und den Sendernamen als festes schmales Label behandeln → Aussage und Absender sind aktuell zu ähnlich gewichtet.
- Fortfahren-Hinweis → näher an den Fernsehrahmen ziehen, mit ungefähr einer Textzeile Abstand statt einer losgelösten Position → Handlung und Inhalt gehören als Gruppe zusammen.

### `fixture_wahlabend_victory_s3.png`
- Gesamter Fernsehblock → auf etwa 82–85 % seiner aktuellen Höhe verkleinern und mit sichtbarem oberen Randabstand platzieren → Nachsatz, Reaktionen und Button müssen vollständig in denselben Viewport passen.
- Fernsehinhalt → die abstrakte Hochrechnung durch einen sichtbaren Wohnzimmer-Schnitt ersetzen oder mindestens im oberen Bereich eine Wohnzimmer-Pixelgrafik einblenden → der angekündigte Szenenwechsel ist derzeit nicht vorhanden.
- Kurator-Nachsatz → auf einen schmalen hellen Papierstreifen unter dem Fernseher setzen, maximal zwei Zeilen breit → die neue narrative Hauptinformation wird von Diagramm und Chips überstimmt.
- Reaktionsmarken → als gleichmäßiges Drei-mal-zwei-Raster mit identischer Höhe und durchgehenden Spaltenkanten anordnen → das jetzige Vier-plus-zwei-Muster erzeugt unnötige Unruhe.
- „Weiter“-Button → rote Vollfläche durch den gestempelten Papier-CTA ersetzen und mindestens eine halbe Buttonhöhe Abstand zur unteren Bildkante sichern → aktuell ist der Button abgeschnitten und semantisch ein Alarm.

### `fixture_wahlabend_timeout_s0.png`
- Titelgruppe → wie bei `fixture_wahlabend_victory_s0.png` auf etwa 1,15× vergrößern, ohne bereits den späteren Ausgang zu codieren → die gemeinsame Einleitung darf neutral bleiben, muss aber präsenter sein.
- Schwarze Fläche → hinter dem Text einen sehr schwachen rechteckigen TV-Schein mit weichen horizontalen Scanlines einführen → das Bild erhält Tiefe, ohne die Spannung aufzulösen.
- Unterzeile → näher an den Titel ziehen, ungefähr eine halbe Titelhöhe Abstand → Titel und Situationsbeschreibung wirken momentan auseinandergezogen.
- Fortfahren-Hinweis → heller und mindestens so groß wie die Unterzeile setzen → der Interaktionszustand ist derzeit nur mit zweitem Blick erkennbar.

### `fixture_wahlabend_timeout_s1.png`
- Balkendiagramm → auf etwa drei Viertel der inneren Bildschirmbreite vergrößern und vertikal etwas oberhalb der Bildschirmmitte platzieren → die wichtigste Information sitzt derzeit klein in zu viel Leere.
- Schwelle → Schwellenwert und aktuellen Rückstand direkt am Marker beziehungsweise unter dem Balken angeben → „unter der Schwelle“ muss ohne geometrisches Schätzen verständlich sein.
- Prozentwert „15,3 %“ → um etwa 40 % vergrößern und mit der rechten Balkenkante ausrichten → die entscheidende Zahl ist aktuell nur ein Nebenlabel.
- Balkenfüllung → Kontrast zum dunkelblauen Hintergrund erhöhen, vorzugsweise mit hellem Akten-Oliv oder Papier-Creme → die aktuelle braungraue Füllung ist zu stumpf.
- Bauchbinde und Diagramm → vertikal näher zusammenführen oder den freien oberen Bereich mit einer gedämpften Wahlsendungs-Grafik belegen → beide Informationsebenen wirken momentan voneinander getrennt.

---

## 3. **Grafiken/Assets**

- Die Berichtsflächen in `end_victory_gameend.png`, `end_victory_endreport_top.png`, `end_victory_endreport_mid.png` und `end_victory_endreport_bottom.png` tragen durch Palette und klare Kanten, bleiben aber rein geometrisch. Gemessen an der in `desinformation-network/src/story-mode/theme.ts` beschriebenen „Behörden-Akte“ fehlt eine sehr zurückhaltende Papierfaser, eine sichtbare Dokumentkante oder eine zweite, leicht versetzte Aktenlage. Eine einzige niedrig kontrastierte Textur innerhalb der hellen Dokumentfläche würde mehr Materialwirkung bringen als zusätzliche Rahmen.
- Der Fernsehrahmen in `fixture_wahlabend_victory_s1.png`, `fixture_wahlabend_victory_s2.png`, `fixture_wahlabend_victory_s3.png` und `fixture_wahlabend_timeout_s1.png` ist scharf und sauber skaliert. Er trägt die Szene als Objekt, wirkt wegen des fast vollständig leeren dunkelblauen Inneren aber eher wie ein UI-Container als wie ein laufender Nachrichtensender.
- Am meisten fehlt in `fixture_wahlabend_victory_s1.png`, `fixture_wahlabend_victory_s2.png` und `fixture_wahlabend_timeout_s1.png` eine gedämpfte Wahlabendgrafik im oberen Bildschirmbereich: vereinfachte Westunion-Karte, Studio-Silhouette oder Sitzverteilung in feiner Pixel-Art. Sie sollte entsättigt bleiben und höchstens etwa die Hälfte des Kontrasts von Balken und Ergebnistext besitzen.
- In `fixture_wahlabend_victory_s3.png` fehlt der im Dateikontext angekündigte Wohnzimmer-Schnitt vollständig. Eine feinpixelige, dunkle Wohnzimmeransicht mit Sofa-Silhouetten und kaltem TV-Licht wäre hier das wirksamste Einzelasset; Reaktionschips allein ersetzen keinen Szenenschnitt.
- `fixture_wahlabend_victory_s0.png` und `fixture_wahlabend_timeout_s0.png` zeigen weder Büro noch Fernseher. Ein schwacher Lichtkegel oder eine silhouettenhafte Schreibtischkante würde die erzählte Dunkelheit räumlich verankern, ohne die Titelkarte zu überladen.
- Stilistisch fremd wirkt vor allem die durchgehende schwarze/dunkelblaue Digitalwelt der Wahlabend-Screens. Ein TV-Inset ist plausibel, aber wenn der gesamte Bildschirm außerhalb und innerhalb des Fernsehers dunkel bleibt, verschwindet die Papier-/Behördenwelt vollständig. Das widerspricht auch dem Hinweis in `sprite-tool/public/context/game-style-guide.md`, dunkle, leere Räume zu vermeiden.
- Falsch beschnitten ist vor allem `fixture_wahlabend_victory_s3.png`: oberer Fernsehrahmen und unterer Button laufen aus dem Viewport. In den Bericht-Screens werden dagegen Inhalte statt Assets beschnitten: der Graph unten in `end_victory_gameend.png`/`end_victory_endreport_top.png` und der vorherige Abschnitt oben in `end_victory_endreport_mid.png`/`end_victory_endreport_bottom.png`.

---

## 4. **Raster & Rhythmus**

- Die Berichtsmodale nutzen ungefähr die mittleren drei Fünftel des Bildes. Das ist für einen Einzelbericht ausreichend, für das Zweispaltenraster in `end_victory_endreport_mid.png` jedoch knapp: Entweder den Bericht dort um etwa ein Zehntel verbreitern oder die Kartenbedingungen kürzer und luftiger setzen.
- In `end_victory_gameend.png` und `end_victory_endreport_top.png` ist der Abstand zwischen dunklem Kopf und erster Abschnittsüberschrift deutlich größer als die Abstände innerhalb des Textblocks. Den oberen Leerraum auf ungefähr zwei normale Absatzabstände reduzieren.
- Die Berichtsabschnitte benötigen einen wiederkehrenden Rhythmus: Überschrift, halbe Zeile Abstand, Inhalt, eine volle Zeile Abstand, Trennlinie. Derzeit wechseln große Leerfelder, enge Tags und lange Absätze ohne konstante Einheit.
- Das Raster „Mögliche Spielenden“ in `end_victory_endreport_mid.png` und `end_victory_endreport_bottom.png` ist formal geordnet, aber zu eng. Größere Gassen und klarere Innenränder würden acht einzelne Aktenkarten statt einer Tabelle erzeugen.
- Die Wahlabend-Screens `fixture_wahlabend_victory_s1.png`, `fixture_wahlabend_victory_s2.png` und `fixture_wahlabend_timeout_s1.png` besitzen drei vertikale Zonen: Status oben, fast leere Hauptfläche, Bauchbinde unten. Die Hauptfläche sollte mindestens zur Hälfte tatsächlich mit Wahlgrafik und Ergebnisinformation belegt sein; aktuell ist sie tote Fläche.
- Innerhalb des Fernsehers sollte ein gemeinsames horizontales Raster gelten: Innenkante der Bauchbinde, linke Balkenkante und linke Hauptüberschrift auf derselben Achse; Prozentwert und rechte Balkenkante auf einer zweiten Achse. Momentan sitzt „LIVE“ auf einer dritten, nicht angebundenen Kante.
- `fixture_wahlabend_victory_s3.png` benötigt eine feste Viewport-Aufteilung, etwa obere drei Fünftel Fernseher und untere zwei Fünftel Nachsatz, Reaktionen und Aktion. Das jetzige lineare Stapeln erzeugt Überlauf statt Hierarchie.
- Die Reaktionschips in `fixture_wahlabend_victory_s3.png` sollten nicht nach Textbreite frei fließen. Ein gleichmäßiges Drei-mal-zwei-Raster würde sowohl Mittelachse als auch Zeilenrhythmus stabilisieren.
- `end_victory_endreport_mid.png` und `end_victory_endreport_bottom.png` sind sichtbar derselbe Ausschnitt. Falls sie unterschiedliche Scrollpositionen darstellen sollen, sind die Abschnittsanker oder die Visual-Review-Ernte falsch gesetzt.

---

## 5. **Lesbarkeit**

- In `end_victory_gameend.png` und `end_victory_endreport_top.png` musste ich bei „Kampagne: 2 Tage bis zum Wahltag · Aktionen gesamt: 0 · Finales Vertrauen: 58 %“ zweimal hinsehen. Diese Zeile enthält zentrale Bilanzdaten, ist aber kleiner als fast alle erzählerischen Texte.
- Die Tags „Triumph“ und „Triumphal“ in denselben Screens sind zwar kontrastreich, aber zu klein und typografisch zu ähnlich zu Formularfeldern. Ein klarerer Badge- beziehungsweise Stempelzustand fehlt.
- Die Graphwerte, insbesondere die rote „40 %“-Marke, sind in `end_victory_gameend.png` und `end_victory_endreport_top.png` zu klein. Auch gestrichelte Hilfslinien und Flächenfüllung liegen kontrastmäßig nahe beieinander.
- In `end_victory_endreport_mid.png` und `end_victory_endreport_bottom.png` sind die Bedingungen der acht Enden bei der aktuellen Pixel-Schrift zu dicht gesetzt. Vor allem „Pyrrhussieg“, „Zusammenbruch“ und „Wandel“ verlangen langsames Lesen.
- Der aktive Zustand „Sieg (erreicht)“ ist nicht stark genug von den gesperrten beziehungsweise nicht erreichten Enden getrennt. Häkchen und minimale Flächentönung reichen als Zustandskommunikation nicht.
- Der Hinweis „Dieses Spiel dient dem Verständnis von Desinformationstaktiken“ in `end_victory_endreport_mid.png`/`end_victory_endreport_bottom.png` ist unnötig klein. Entweder als normale Fußnote mit höherem Kontrast setzen oder visuell klar als juristische Randnotiz behandeln.
- „LIVE“ und „SCHWELLE“ sind in allen sichtbaren Hochrechnungs-Screens zu klein und zu dunkel. Besonders in `fixture_wahlabend_timeout_s1.png` verschwindet „SCHWELLE“ fast auf dem dunkelblauen Grund.
- Die roten Labels „Westunion Erwacht“ in `fixture_wahlabend_victory_s1.png`, `fixture_wahlabend_victory_s2.png`, `fixture_wahlabend_victory_s3.png` und `fixture_wahlabend_timeout_s1.png` sind auf Dunkelblau weniger lesbar als Creme oder helles Papiergelb. Rot sollte hier Ergebnis- oder Alarmzustand markieren, nicht die dauerhaft neutrale Datenreihe.
- Die Zahlen 21,6 % und 15,3 % sind lesbar, aber zu klein für ihre Bedeutung. Sie brauchen mindestens eine visuelle Stufe über Labels und Bauchbindentext.
- In `fixture_wahlabend_victory_s3.png` musste ich mehrere Reaktionschips einzeln entziffern. Kleine Pixelschrift, dünne Kontur und uneinheitliche Symbole machen weder Kategorie noch Zustand sofort verständlich.
- Die Fortfahren-Hinweise in allen Wahlabend-Screens sehen wie atmosphärische Bildunterschriften aus, nicht wie aktive Zustände. Ein hellerer Fokuszustand oder eine kleine Eingabe-Markierung fehlt in den Standbildern.

---

## 6. **Die drei wirksamsten Änderungen**

1. **Wahlgrafik neu hierarchisieren:** Balken, Prozentwert und numerisch beschriftete Schwelle in allen `fixture_wahlabend_*_s1/s2/s3.png` deutlich vergrößern und die leere obere Bildschirmhälfte mit einer gedämpften Wahlsendungs-Grafik füllen — hoher Effekt, weil derzeit der zentrale Wahlmoment wie ein Platzhalter wirkt.
2. **`fixture_wahlabend_victory_s3.png` vollständig in den Viewport einpassen:** Fernseher auf etwa 82–85 % verkleinern, Reaktionen als Drei-mal-zwei-Raster setzen und dem Button sicheren unteren Abstand geben — geringer Layoutaufwand beseitigt zugleich zwei harte Beschnittfehler und ordnet den Abschluss.
3. **Berichtszustände klar codieren:** Erreichtes Ende mit sichtbarem Stempel markieren, Kennzahlen vergrößern und Abschlussbuttons auf den definierten Stempelstil aus `desinformation-network/src/story-mode/theme.ts` umstellen — das verbessert Orientierung und bringt die vorhandenen Screens ohne neue Großassets näher an die Behörden-/Papierwelt.

---

## 7. **Blinde Flecken**

- Nicht erkennbar ist, ob Balken, Schwellenüberschreitung, Ergebnisstempel oder Bauchbinde animiert einlaufen. Dafür wären Zwischenframes direkt vor, auf und nach der Schwellenüberschreitung nötig.
- Hover-, Tastaturfokus-, gedrückte und deaktivierte Zustände der Fortfahren- und Schließen-Aktionen sind nicht sichtbar.
- Die tatsächliche Scrollführung des End-Reports ist unklar: Es fehlt ein Screenshot mit vollständig sichtbarem Vertrauensgraphen sowie den im Pakettext genannten Methoden-/Bilanz- und Gegenmaßnahmen-/Debrief-Abschnitten.
- `end_victory_endreport_mid.png` und `end_victory_endreport_bottom.png` sind visuell gleich. Für eine Beurteilung des wirklichen unteren Endes wird ein neu gesetzter Bottom-Capture benötigt.
- Nicht beurteilbar ist, ob `fixture_wahlabend_victory_s3.png` nur bei 1280×720 überläuft oder grundsätzlich. Zusätzliche Aufnahmen bei einer kleineren 16:9-Auflösung und bei 1920×1080 würden das responsive Verhalten zeigen.
- Der Wohnzimmer-Schnitt ist in `fixture_wahlabend_victory_s3.png` nicht sichtbar. Falls er nur während einer Animation erscheint, werden ein Frame mit vollständig sichtbarem Wohnzimmer und ein Frame des Übergangs benötigt.
- Audio, Scanline-Bewegung, TV-Flackern und zeitliche Lesedauer der Titelkarten lassen sich aus den Standbildern nicht bewerten.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
