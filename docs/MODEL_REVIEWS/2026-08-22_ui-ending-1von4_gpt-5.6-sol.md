# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „ending-1von4"

**Modell:** `gpt-5.6-sol` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-22
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-22T17:19:07.670Z · **Dauer:** 170.1 s
**Nutzung:** nicht gemeldet · **Kosten:** unbekannt · **Anbieter-Datensammlung:** ausgeschlossen (deny)

> ⚠️ **Wie das zu lesen ist:** Ein *fremdes* Modell hat einen **kuratierten Ausschnitt**
> des Projekts gesehen — nicht das laufende Spiel und nicht das ganze Repository. Es kann
> daher weder Laufzeitverhalten prüfen noch `file:line`-Belege verifizieren. Befunde sind
> **Hypothesen**, die vor dem Umsetzen am Code/an den Daten gegenzuprüfen sind. Die
> kanonische Wahrheit bleibt [`docs/VISION_LOCK.md`](../VISION_LOCK.md) bzw. die Spieldaten.

## Gestellte Frage

Sieh dir die beigefügten Screenshots des laufenden Spiels an und mache einen UX/UI-Durchgang. Die Optik soll eine Behörden-/Papierwelt sein (Stil-Anker und Farbtoken liegen bei). Sag mir: Wo führt das Bild den Blick falsch, welche Grafiken sitzen an der falschen Stelle oder in der falschen Größe, wo stimmen Abstände und Ausrichtung nicht, und welche drei Änderungen bringen am meisten? Sei so konkret, dass man es direkt umsetzen kann.

## Dieser Durchgang: Bündel „ending-1von4" (10 Screenshots)

Das siehst du, in dieser Reihenfolge:
- end_timeout_wahlabend_s0.png — Wahlabend (echt, timeout), Titelkarte
- end_timeout_wahlabend_s1.png — Wahlabend (echt, timeout), Schritt 1
- end_timeout_wahlabend_s2.png — Wahlabend (echt, timeout), Schritt 2
- end_timeout_wahlabend_s3.png — Wahlabend (echt, timeout), Schritt 3
- end_timeout_gameend.png — GameEndScreen (timeout)
- end_timeout_endreport_top.png — End-Report (timeout), Anfang: „Das Rennen"-Kurven
- end_timeout_endreport_mid.png — End-Report (timeout), Mitte: Methoden-Atlas/Bilanz
- end_timeout_endreport_bottom.png — End-Report (timeout), Ende: Gegenmaßnahmen/Debrief
- end_immune_wahlabend_s0.png — Wahlabend (echt, immune), Titelkarte
- end_immune_wahlabend_s1.png — Wahlabend (echt, immune), Schritt 1

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
| 🖼 Bild | `end_timeout_wahlabend_s0.png` | `desinformation-network/runs/visual-review/latest/shots/end_timeout_wahlabend_s0.png` | 127 kB |
| 🖼 Bild | `end_timeout_wahlabend_s1.png` | `desinformation-network/runs/visual-review/latest/shots/end_timeout_wahlabend_s1.png` | 128 kB |
| 🖼 Bild | `end_timeout_wahlabend_s2.png` | `desinformation-network/runs/visual-review/latest/shots/end_timeout_wahlabend_s2.png` | 154 kB |
| 🖼 Bild | `end_timeout_wahlabend_s3.png` | `desinformation-network/runs/visual-review/latest/shots/end_timeout_wahlabend_s3.png` | 74 kB |
| 🖼 Bild | `end_timeout_gameend.png` | `desinformation-network/runs/visual-review/latest/shots/end_timeout_gameend.png` | 74 kB |
| 🖼 Bild | `end_timeout_endreport_top.png` | `desinformation-network/runs/visual-review/latest/shots/end_timeout_endreport_top.png` | 74 kB |
| 🖼 Bild | `end_timeout_endreport_mid.png` | `desinformation-network/runs/visual-review/latest/shots/end_timeout_endreport_mid.png` | 98 kB |
| 🖼 Bild | `end_timeout_endreport_bottom.png` | `desinformation-network/runs/visual-review/latest/shots/end_timeout_endreport_bottom.png` | 98 kB |
| 🖼 Bild | `end_immune_wahlabend_s0.png` | `desinformation-network/runs/visual-review/latest/shots/end_immune_wahlabend_s0.png` | 132 kB |
| 🖼 Bild | `end_immune_wahlabend_s1.png` | `desinformation-network/runs/visual-review/latest/shots/end_immune_wahlabend_s1.png` | 141 kB |

---

## Antwort des Modells

## 1. **Erster Eindruck**

### `end_timeout_wahlabend_s0.png`
Das Auge landet auf dem waagerechten Balken, danach auf dem deutlich helleren Nachrichtenticker am unteren Rand. Eigentlich müsste zuerst klar werden, dass dies der Wahlabend und welches Ergebnis eingetreten ist; eine entsprechende Titelkarte ist trotz Dateibeschreibung nicht sichtbar. Die Anzeige „9,0 %“ ist klein, während der gefüllte Balken optisch ungefähr ein Drittel der Skala belegt und deshalb eine andere Größenordnung suggeriert. Der sehr große leere dunkelblaue Raum lässt die Darstellung unfertig statt angespannt wirken.

### `end_timeout_wahlabend_s1.png`
Der Screen wirkt fast identisch zu `end_timeout_wahlabend_s0.png`; als neuer Schritt ist nur der Tickertext erkennbar. Das Auge bleibt daher erneut am Balken hängen, obwohl die entscheidende neue Information „Regierung wird bestätigt“ unten steht. Die Blickführung läuft verkehrt herum: erst eine schwer deutbare Kennzahl, dann das eigentliche Wahlergebnis. Das schwach sichtbare „LIVE“ und die dunklen oberen zwei Drittel erzeugen keine glaubhafte Nachrichtensendung, sondern vor allem tote Fläche.

### `end_timeout_wahlabend_s2.png`
Zuerst fällt der rote „WEITER“-Knopf auf, danach die mittige Direktorenzeile und erst dann die weiterhin oben stehende Ergebnisgrafik. Die Rangfolge sollte umgekehrt sein: Abschlussmeldung, Konsequenzen für die Milieus, dann Fortsetzung. Gegenüber `end_timeout_wahlabend_s0.png` und `end_timeout_wahlabend_s1.png` springt der gesamte TV-Rahmen nach oben und wird am oberen Bildrand angeschnitten. Die sechs kleinen Milieu-Meldungen bilden zudem ein unruhiges Muster aus zwei, drei und einer Box und sind bei dieser Größe nur mit Konzentration lesbar.

### `end_timeout_wahlabend_s3.png`
Der Blick geht korrekt zuerst auf „Wahlabend verloren“, danach allerdings in einen langen, gleichförmigen Textblock. Die Spielstil-Badges sind klein und visuell schwächer als ihre inhaltliche Bedeutung. Am unteren Rand wird der nächste Abschnitt samt Diagramm angeschnitten, während rechts hinter dem Bericht ein teilweise sichtbarer Button stört. Für einen dritten Wahlabend-Schritt wirkt der abrupte Wechsel zu einem bereits geöffneten, scrollbaren Abschlussbericht außerdem wie ein Zustands- oder Aufnahmefehler.

### `end_timeout_gameend.png`
`end_timeout_gameend.png` ist visuell nicht von `end_timeout_wahlabend_s3.png` zu unterscheiden. Dadurch fehlt dem eigentlichen Game-End-Zustand eine eigene Hierarchie oder eine klare Handlungsaufforderung. Wieder dominiert der Textblock, während Ergebnisdaten und Konsequenzen lediglich als kleine Zeile im dunklen Kopf stehen. Der teilweise sichtbare Hintergrund-Button rechts und das kaum erkennbare beziehungsweise angeschnittene Symbol oben in der Mitte lassen die Modalebenen ungeklärt erscheinen.

### `end_timeout_endreport_top.png`
Auch `end_timeout_endreport_top.png` zeigt denselben Ausschnitt wie die beiden vorherigen Dateien. Der angekündigte Kurvenbereich „Das Rennen“ ist nicht zu sehen; sichtbar ist lediglich der Beginn von „Vertrauensverlauf“ am unteren Anschnitt. Das Auge arbeitet sich durch fünf ähnlich gewichtete Absätze, obwohl eine knappe Ergebniszusammenfassung und die Kurve zuerst interessieren würden. Der Kopf ist als Dokumentkopf lesbar, aber der Übergang zum langen Papierkörper besitzt zu wenig visuelle Staffelung.

### `end_timeout_endreport_mid.png`
Der Blick fällt auf das gleichförmige Raster der acht möglichen Spielenden und kurz danach auf den zentralen Button am unteren Rand. Das tatsächlich erreichte Ende „Enthüllung“ hebt sich nur durch ein Häkchen und einen geringfügig anderen Rahmen ab und ist nicht sofort als aktuelles Ergebnis erkennbar. Der obere Bildrand beginnt mitten im vorherigen Inhalt mit „Wahl vorgezogen!“, wodurch der Ausschnitt wie eine beliebige Scrollposition statt wie ein bewusst gesetzter Abschnitt wirkt. Der laut Beschreibung erwartete Methoden-Atlas beziehungsweise die Bilanz ist in dieser Aufnahme nicht sichtbar.

### `end_timeout_endreport_bottom.png`
`end_timeout_endreport_bottom.png` ist pixelgenau beziehungsweise augenscheinlich identisch zu `end_timeout_endreport_mid.png`. Als Ende des Berichts funktioniert der untere Bereich grundsätzlich, doch die acht Ending-Karten nehmen noch immer den größten Teil des Bildes ein und verdrängen die Einordnung. Der Abschlussgedanke zur realen Desinformation ist klein und weit vom deutlich schwereren „BERICHT SCHLIESSEN“-Button entfernt. Weil kein neuer Inhalt gegenüber der Mid-Aufnahme erkennbar ist, lässt sich der vorgesehene Debrief-/Gegenmaßnahmenbereich nicht beurteilen.

### `end_immune_wahlabend_s0.png`
Das Auge landet zuerst auf dem weißen Tickertext, erst danach auf „IHRE SCHLAGZEILEN – GEPRÜFT“. Die eigentliche Kampagnenzeile ist klein und verloren in einem fast vollständig leeren roten Feld. Für eine Sondersendung fehlt ein klarer Haupttitel oder eine visuelle Aussage, welche Prüfung gerade stattfindet. Die große dunkelrote Fläche widerspricht zudem dem Papierstil und der Vorgabe aus `desinformation-network/src/story-mode/theme.ts`, Ministeriums-Rot nur für Stempel, Kopfbänder und Alarm einzusetzen.

### `end_immune_wahlabend_s1.png`
Der große Stempel „GEFÄLSCHT“ ist sofort der erste Blickpunkt und transportiert den Zustand deutlich. Er schwebt jedoch oberhalb und rechts von „Ihre Kampagne“, statt räumlich eindeutig auf diese Zeile angewendet zu werden. Die durchgestrichene Kampagnenzeile ist sehr kontrastarm und wird vom stärkeren Tickertext visuell überholt. Als zweiter Schritt ist die Veränderung gegenüber `end_immune_wahlabend_s0.png` verständlich, aber die Verbindung zwischen geprüftem Gegenstand, Prüfergebnis und Nachrichtentext bleibt räumlich locker.

---

## 2. **Konkrete Eingriffe je Screen**

### `end_timeout_wahlabend_s0.png`
- Ergebnisblock → aus der geometrischen Mitte in das obere mittlere Drittel verschieben und auf etwa das 1,25-Fache verbreitern → darunter entsteht Platz für eine echte Wahlabend-Aussage statt einer großen leeren Decke.
- Wahlausgang/Titel → oberhalb des Balkens eine klare, linksbündige Hauptzeile in etwa doppelter Größe von „Westunion Erwacht“ setzen → der Screen braucht zuerst Ereignis und Ergebnis, nicht nur einen Messwert.
- Balkenfüllung und „9,0 %“ → Fülllänge eindeutig an einer sichtbaren 0–100-Skala ausrichten oder die abweichende Skalierung beschriften → derzeit widersprechen sich Zahl und visuelle Füllmenge.
- „9,0 %“ → auf etwa das 1,5-Fache vergrößern und direkt über dem rechten Ende des gefüllten Bereichs beziehungsweise an einer eindeutig bezeichneten Messkante platzieren → Zahl und Grafik werden als Einheit gelesen.
- Ticker → Höhe um etwa ein Viertel erhöhen, Senderkennung etwas kleiner und Meldung deutlich größer setzen → die Textzeile ist narrativ wichtig, darf aber nicht allein durch Weißkontrast dominieren.

### `end_timeout_wahlabend_s1.png`
- Neue Ergebniszeile → „Regierung bestätigt“ als große Meldung im Hauptfeld über oder unter dem Balken einblenden → der zweite Schritt muss auch ohne Vergleich mit dem vorherigen Screenshot als neuer Zustand erkennbar sein.
- Balkenblock → gegenüber `end_timeout_wahlabend_s0.png` entweder sichtbar finalisieren oder abdunkeln → ein unveränderter Hauptbereich lässt den Schritt wie ein bloßes Ticker-Update wirken.
- „LIVE“ → Kontrast erhöhen und mit demselben rechten Innenabstand wie die Prozentangabe ausrichten → das Label klebt schwach in einer isolierten Ecke.
- Fortfahrhinweis → näher an die Unterkante des TV-Rahmens rücken und mindestens auf Ticker-Nebentextgröße bringen → er wirkt derzeit vom interaktiven Objekt getrennt und zu nebensächlich.

### `end_timeout_wahlabend_s2.png`
- TV-Rahmen → auf exakt dieselbe Position und Größe wie in `end_timeout_wahlabend_s0.png` und `end_timeout_wahlabend_s1.png` zurücksetzen → der Sprung nach oben und die abgeschnittene Oberkante brechen die Sequenz.
- Direktorenmeldung → als eigener Papierstreifen oder klar gerahmter Block unmittelbar unter dem Ticker gruppieren → sie ist eine Konsequenzmeldung und darf nicht frei im schwarzen Hintergrund schweben.
- Milieu-Meldungen → in ein symmetrisches Raster aus zwei Spalten und drei gleich breiten Zeilen setzen, mit identischen Innenabständen → das aktuelle 2–3–1-Muster erzeugt unnötige Unruhe.
- Milieu-Texte → etwa 20–25 % größer setzen und die Boxen entsprechend höher machen → mehrere Bezeichnungen sind in der aktuellen Größe nur mühsam lesbar.
- „WEITER“-Button → vom unteren Bildschirmrand lösen, eine halbe Buttonhöhe Sicherheitsabstand geben und als helle Papierfläche mit rotem Stempelrand gemäß `stampCtaStyle` ausführen → aktuell wirkt er angeschnitten und als rote Vollfläche stilfremd.

### `end_timeout_wahlabend_s3.png`
- Berichtsheader → Kennzahlenzeile in drei klar getrennte Spalten aufteilen und die Werte größer als die Beschriftungen setzen → „2 Tage“, „0 Aktionen“ und „58 %“ gehen derzeit im Fließtext unter.
- Spielstil-Badges → um etwa ein Drittel vergrößern und direkt unter der Überschrift mit einheitlichem Abstand gruppieren → sie sind das persönliche Feedback, wirken aber wie kleine Metadaten.
- Erzähltext → Zeilenlänge durch größere seitliche Innenränder auf ungefähr 70–80 Zeichen begrenzen und Zeilenabstand erhöhen → die fünf Absätze bilden aktuell eine dichte Textwand.
- Hintergrund-Button rechts → während des geöffneten Berichts vollständig ausblenden oder mit stärkerem Scrim verdecken → der angeschnittene Text „Vollständiger Lagebericht“ konkurriert mit dem Modal.
- Oberes Schließsymbol → vollständig innerhalb des Dokumentkopfs oben rechts platzieren oder entfernen → das mittig angeschnittene schwarze Zeichen ist weder klar erkennbar noch sicher bedienbar.

### `end_timeout_gameend.png`
- Zustandsabgrenzung → vor dem vollständigen Bericht eine kompakte Game-End-Zusammenfassung mit Ergebnis, zwei bis drei Kennzahlen und einer eindeutigen Hauptaktion zeigen → der Screen ist derzeit eine Dublette des geöffneten Berichts.
- Primäraktion → innerhalb der sichtbaren Papierfläche unter der Zusammenfassung platzieren und nicht außerhalb rechts hinter dem Modal → der nächste Schritt ist aktuell nicht klar auffindbar.
- Titel „Wahlabend verloren“ → etwas größer setzen und mit einem roten Stempel oder Kopfband markieren, statt nur weißen Text auf Braun zu verwenden → der Endzustand braucht einen eindeutigen visuellen Abschluss.
- Berichtskörper → auf diesem Screen auf einen kurzen Teaser begrenzen; die ausführlichen Absätze erst nach Öffnen des Lageberichts zeigen → Zusammenfassung und Langbericht sind momentan visuell nicht getrennt.

### `end_timeout_endreport_top.png`
- Scrollstart → so setzen, dass nach dem Dokumentkopf unmittelbar der angekündigte Kurvenabschnitt vollständig beginnt → derzeit ist nur dessen Überschrift und der obere Diagrammrand sichtbar.
- Einleitung → von fünf ähnlich gewichteten Absätzen auf einen kompakten Block reduzieren oder in eine schmalere linke Spalte legen → der eigentliche Bericht wird zu weit nach unten gedrückt.
- „Vertrauensverlauf“ → Diagramm mindestens bis zur halben sichtbaren Seitenhöhe ins erste Viewport holen → eine reine Überschrift am Fold erzeugt keinen analytischen Einstieg.
- Dokumentnavigation → eine schmale Abschnittsleiste am rechten Papierrand mit sichtbarem aktuellem Abschnitt ergänzen → bei einem langen Bericht fehlt jede Orientierung über Position und Umfang.
- Seitenkopf → zwischen dunklem Kopf und hellem Körper eine klarere Papierkante beziehungsweise einen schmalen Aktenreiter setzen → der obere Block wirkt momentan eher wie ein Web-Header als wie eine Behördenakte.

### `end_timeout_endreport_mid.png`
- Scrollposition → den Ausschnitt exakt mit der Überschrift „MÖGLICHE SPIELENDEN“ beginnen lassen; den abgeschnittenen Rest der vorherigen Box oberhalb entfernen → der obere Rand wirkt zufällig.
- Erreichte Ending-Karte → mit kräftigerem Papierfarbton, rotem oder blauem „ERREICHT“-Stempel und stärkerer Überschrift kennzeichnen → Häkchen und feiner Rahmen reichen zur Zustandskommunikation nicht.
- Ending-Karten → Innenabstand um etwa ein Viertel erhöhen und die Titel von den Bedingungstexten deutlicher trennen → die Karten sind dicht und schwer scannbar.
- Kartengitter → beide Spalten an identische Textgrundlinien und Höhen binden → unterschiedliche Zeilenumbrüche erzeugen innerhalb des sonst strengen Rasters leichte Unruhe.
- „Einordnung“ → mit mehr Abstand vom Kartengitter absetzen und auf eine leicht getönte eigene Papierfläche legen → Analyse und Ending-Katalog verschmelzen momentan zu stark.

### `end_timeout_endreport_bottom.png`
- Unterer Berichtsteil → tatsächlich auf den letzten Abschnitt scrollen und den Inhalt gegenüber `end_timeout_endreport_mid.png` sichtbar verändern → die beiden Aufnahmen zeigen derzeit denselben Zustand.
- Einordnung → im Bottom-Zustand oberhalb des Buttons mehr Fläche geben und als primären Abschlussinhalt behandeln → der Ending-Katalog bleibt aktuell der stärkste Block.
- Disclaimer → mindestens auf Größe des Kartenfließtexts bringen und näher an die Einordnung rücken → die Immunisierungsabsicht wird als kleinstes Textelement behandelt.
- „BERICHT SCHLIESSEN“ → eine Buttonhöhe Abstand zur Disclaimer-Zeile und einen klaren unteren Seitenrand beibehalten → der Abschluss braucht einen ruhigen, eindeutig separierten Aktionsbereich.
- Ende-Markierung → eine dünne Abschlusslinie oder Aktenstempel unmittelbar über dem Footer setzen → ohne sichtbares Seitenende wirkt die Position wie ein weiterer Zwischenabschnitt.

### `end_immune_wahlabend_s0.png`
- Hauptüberschrift → „IHRE SCHLAGZEILEN – GEPRÜFT“ auf etwa das 1,5-Fache vergrößern und in das obere Drittel verschieben → sie muss vor dem Ticker gelesen werden.
- Kampagnenzeile → auf etwa das 1,3-Fache vergrößern und als vollständige, klar begrenzte Prüfzeile über ungefähr die halbe Feldbreite ausführen → derzeit verliert sie sich in der Fläche.
- Rote Bildschirmfläche → in dunkles neutrales Papier-/Tintenbraun zurücknehmen und Rot auf Kopfband, Statuspunkt und späteren Stempel beschränken → dies entspricht den Vorgaben aus `desinformation-network/src/story-mode/theme.ts`.
- Leere Fläche → Prüfzeile und Überschrift gemeinsam vertikal um rund ein Viertel Bildschirmhöhe nach oben ziehen und darunter Platz für das Prüfergebnis reservieren → die Mitte wirkt momentan unbeabsichtigt leer.
- Ticker → Weißkontrast leicht reduzieren, Hauptmeldung im Feld dagegen aufhellen → die Fußzeile darf nicht der primäre Blickfang sein.

### `end_immune_wahlabend_s1.png`
- „GEFÄLSCHT“-Stempel → nach unten und leicht nach links verschieben, sodass er die Kampagnenzeile sichtbar berührt oder direkt rechts davon sitzt → derzeit fehlt die räumliche Zuordnung zum geprüften Objekt.
- Stempelgröße → um etwa 15–20 % reduzieren → er bleibt dominant, verdrängt aber Überschrift und Kampagnenzeile nicht mehr.
- Kampagnenzeile → trotz Durchstreichung heller und größer setzen; Durchstreichung in Stempelrot statt Grau ausführen → der gesperrte Zustand muss lesbar bleiben.
- Überschrift und Zeile → auf einer gemeinsamen linken Kante halten und den Abstand zwischen beiden etwa halbieren → die Gruppe wirkt gegenwärtig auseinandergezogen.
- „SONDERSENDUNG“ → Kontrast erhöhen oder auf ein helles schmales Kopfband setzen → das Label ist im roten Hintergrund fast nicht mehr zu erkennen.

---

## 3. **Grafiken/Assets**

**Tragende Assets**

- Der Stempel in `end_immune_wahlabend_s1.png` ist das stärkste grafische Asset des Bündels: harte Kanten, klare Symbolik und eindeutige Zustandskommunikation. Seine Position, nicht sein Stil, ist das Hauptproblem.
- Die Papierfläche und der dunkle Aktenkopf in `end_timeout_wahlabend_s3.png`, `end_timeout_gameend.png` und `end_timeout_endreport_top.png` transportieren die Behördenakte grundsätzlich besser als die TV-Screens.
- Das zweispaltige Kartenraster in `end_timeout_endreport_mid.png` und `end_timeout_endreport_bottom.png` passt formal zu Formularen und Verwaltungsübersichten, benötigt aber stärkere Statusmarkierungen.

**Fremd oder stilistisch abweichend**

- Die Broadcast-Screens stehen als dunkle, fast leere CRT-Flächen frei im schwarzen Raum. Das widerspricht dem in `sprite-tool/public/context/game-style-guide.md` formulierten Ziel „nicht dunkel/leer“ und lässt die übergreifende Papierwelt verschwinden.
- Die flächige Rotfärbung in `end_immune_wahlabend_s0.png` und `end_immune_wahlabend_s1.png` widerspricht der expliziten Farblogik aus `desinformation-network/src/story-mode/theme.ts`: Rot soll Stempel, Kopfbändern und Alarm vorbehalten bleiben. Als kurzer Alarmimpuls wäre sie vertretbar, als komplette Dauerfläche nimmt sie dem Stempel seine Exklusivität.
- Der massive rote Button in `end_timeout_wahlabend_s2.png` wirkt wie klassische Spiel-UI statt wie gestempelte Papieraktion. Die vorhandene Vorgabe `stampCtaStyle` liefert bereits die passendere Materiallogik.
- Die Reportseiten wirken trotz passender Farben noch wie flache Web-Panels: Es fehlen sichtbare Blattkante, minimale Papierkörnung, Aktenreiter oder Loch-/Heftreferenz. Ein einziges dezentes Seitenasset an der Außenkante würde mehr bringen als zusätzliche Dekoration im Inhalt.

**Skalierung und Zuschnitt**

- Die Wahlergebnisgrafik in `end_timeout_wahlabend_s0.png` bis `end_timeout_wahlabend_s2.png` ist für die freie Fläche zu klein und gleichzeitig semantisch unklar skaliert.
- Das Diagramm in `end_timeout_endreport_top.png` ist am Fold so beschnitten, dass nur Rahmen und Achsenbeginn sichtbar werden. Entweder vollständig in den Viewport holen oder erst im nächsten klar markierten Abschnitt beginnen.
- Das obere Symbol in den Reportaufnahmen ist am Bildschirmrand angeschnitten. Seine Kantenschärfe ist nicht das Problem; der Zuschnitt macht es unlesbar.
- Die Hintergrundaktion „Vollständiger Lagebericht“ ist rechts abgeschnitten und trotz Abdunkelung sichtbar. Das ist kein atmosphärischer Layer, sondern visueller Müll hinter dem Modal.

**Was am meisten fehlt**

- In `end_timeout_wahlabend_s0.png` und `end_timeout_wahlabend_s1.png` fehlt eine große, einfache Wahlabend-Titelgrafik: etwa ein Akten-/Sendekopf mit „HOCHRECHNUNG“ und dem klaren Ergebnisstatus. Sie würde die leere Fläche füllen und die Sequenz ohne zusätzliche Illustration verständlich machen.
- In den Reportaufnahmen fehlt eine sichtbare Dokumentnavigation beziehungsweise Abschnittsmarkierung. Bei der Länge des Berichts ist dies funktional wichtiger als weitere Bildmotive.
- In `end_immune_wahlabend_s0.png` fehlt eine grafische Prüfstruktur, etwa eine schmale Formularzeile mit Gegenstand, Prüfschritt und offenem Ergebnisfeld. Dadurch könnte der Stempel in `end_immune_wahlabend_s1.png` präzise auf ein vorbereitetes Ziel treffen.

---

## 4. **Raster & Rhythmus**

Die TV-Sequenz besitzt kein stabiles Masterraster. `end_timeout_wahlabend_s0.png` und `end_timeout_wahlabend_s1.png` verwenden denselben zentrierten Rahmen, während `end_timeout_wahlabend_s2.png` ihn nach oben verschiebt und anschneidet. Rahmen, Ticker und Fortfahraktion sollten über alle Schritte an identischen Bezugskanten bleiben; nur der Inhalt innerhalb des Hauptfelds darf wechseln.

Innerhalb der TV-Fläche wird die große verfügbare Höhe nicht gegliedert. Sinnvoll wäre ein festes Drei-Zonen-Raster: oben Status beziehungsweise Sendekopf, mittig Hauptergebnis, unten Konsequenz oder Prüfzeile; der Ticker bleibt davon getrennt. Aktuell liegt fast alles in einem schmalen horizontalen Band um die Bildschirmmitte, während ober- und unterhalb tote Fläche entsteht.

`end_timeout_wahlabend_s2.png` zerfällt unterhalb des TV-Rahmens in drei verschiedene Zentrierungen: Direktorenzeile, asymmetrische Milieu-Boxen und Button. Diese Elemente brauchen eine gemeinsame maximale Breite und gemeinsame linke beziehungsweise rechte Kanten. Ein zweispaltiges Raster mit drei gleich breiten Reihen wäre ruhiger und schneller erfassbar.

Die Reportseiten besitzen außen ein plausibles zentriertes Blatt, innen aber zu geringe Seitenränder für die lange Zeilenlänge. Der Inhalt sollte links und rechts jeweils ungefähr um die Breite eines zusätzlichen Karteninnenabstands eingerückt werden. Überschriften, Trennlinien, Textblöcke und Kartengitter müssen dann alle auf denselben beiden Inhaltskanten beginnen und enden.

Zwischen dunklem Berichtskopf und hellem Körper besteht ein zu großer qualitativer Sprung, aber zu wenig materieller Übergang. Eine sichtbare Blattkante oder ein Aktenreiter würde beide Flächen verbinden. Gleichzeitig sollten die Abschnitte im hellen Körper mit mehr vertikalem Abstand voneinander getrennt werden, statt nur mit dünnen Linien.

`end_timeout_endreport_mid.png` und `end_timeout_endreport_bottom.png` zeigen denselben Rasterzustand. Falls dies kein Erntefehler ist, fehlt im Bericht eine zuverlässige Scroll- oder Abschnittslogik. Ein Bottom-Screen muss durch einen deutlich anderen oberen Anschnitt und eine sichtbare Endkante sofort als Ende erkennbar sein.

---

## 5. **Lesbarkeit**

- In `end_timeout_wahlabend_s0.png` bis `end_timeout_wahlabend_s2.png` musste ich bei „SCHWELLE“, „LIVE“ und „9,0 %“ zweimal hinsehen. Die Labels sind für ihre feine Pixelschrift zu klein und zu kontrastarm.
- Die Balkenfüllung in denselben Screens wirkt wie ungefähr ein Drittel, obwohl daneben „9,0 %“ steht. Selbst wenn intern eine andere Skala gemeint ist, ist sie visuell nicht erklärt.
- „Westunion Erwacht“ verwendet Alarmrot, obwohl es hier offenbar die Bezeichnung einer Größe ist. Neutraler Primärtext wäre lesbarer; Rot sollte den verfehlten Schwellenwert oder einen Alarmzustand markieren.
- In `end_timeout_wahlabend_s2.png` sind sämtliche Milieunamen zu klein, besonders die längeren Bezeichnungen in den mittleren Boxen. Die feinen Rahmen konkurrieren bei dieser Größe mit den Buchstaben.
- Der Reportfließtext in `end_timeout_wahlabend_s3.png`, `end_timeout_gameend.png` und `end_timeout_endreport_top.png` ist kontrastreich genug, aber zu klein und zu breit gesetzt. Die Kombination aus Pixelschrift, langen Zeilen und fünf Absätzen erzeugt unnötige Lesearbeit.
- Die Spielstil-Badges „ENTTARNUNG“ und „HOFFNUNGSVOLL“ sind zwar umrandet, aber weder als aktive Bewertung noch als auswählbare oder rein informative Zustände eindeutig codiert.
- In `end_timeout_endreport_mid.png` ist „Enthüllung (erreicht)“ nur schwach hervorgehoben. Ein Häkchen ist in diesem dichten Raster zu wenig; der aktuelle Zustand braucht zusätzlich Fläche, Stempel oder stärkeres Gewicht.
- Der Disclaimer in `end_timeout_endreport_bottom.png` ist kleiner und heller als fast alle übrigen Informationen. Für die beabsichtigte Einordnung und Immunisierung ist diese Hierarchie falsch.
- In `end_immune_wahlabend_s0.png` ist „Ihre Kampagne“ deutlich schwächer als der Ticker. In `end_immune_wahlabend_s1.png` wird sie nach der Durchstreichung noch schwerer lesbar, obwohl der Spieler genau erkennen können muss, was als gefälscht markiert wurde.
- „SONDERSENDUNG“ verschwindet in beiden Immune-Screens beinahe im Hintergrund. Der Status ist vorhanden, aber nicht zuverlässig wahrnehmbar.

---

## 6. **Die drei wirksamsten Änderungen**

1. **Typografie und Kontrast in TV und Bericht um eine Stufe anheben** — Haupttexte etwa 20–30 %, Kennzahlen und Zustände etwa 40–50 % größer sowie schwache Rot-/Braun-Kontraste korrigieren; das ist geringer Aufwand und behebt die meisten unmittelbaren Lesbarkeitsprobleme.

2. **Ein stabiles Sequenzraster für alle Wahlabend-Schritte festlegen** — TV-Rahmen, Ticker und Aktion bleiben unverrückbar, das Hauptfeld erhält feste Zonen für Titel, Ergebnis und Konsequenz; damit verschwinden Sprünge, tote Fläche und falsche Blickreihenfolge zugleich.

3. **Reportzustände und Screenshot-/Scrolllogik reparieren** — `end_timeout_wahlabend_s3.png`, `end_timeout_gameend.png` und `end_timeout_endreport_top.png` zeigen denselben Ausschnitt, ebenso Mid und Bottom; eine klare Trennung von Game-End-Zusammenfassung, Reportanfang, Mittelteil und Ende ist funktional wichtiger als weiteres Polishing.

---

## 7. **Blinde Flecken**

- Die Übergangsanimationen zwischen `end_timeout_wahlabend_s0.png`, `s1`, `s2` und `s3` sind nicht sichtbar. Für die Bewertung der Dramaturgie wären Aufnahmen direkt vor, während und nach Balkenfüllung, Tickerwechsel und Reportöffnung nötig.
- Es ist nicht erkennbar, ob der Widerspruch zwischen „9,0 %“ und Balkenfüllung aus einer Animation, einer normierten Skala oder einem Fehler entsteht. Dafür wird ein Screenshot nach vollständig abgeschlossener Balkenanimation benötigt.
- Hover-, Tastaturfokus-, gedrückte und deaktivierte Zustände von „WEITER“, „BERICHT SCHLIESSEN“ und der Hintergrundaktion sind nicht gezeigt.
- Die tatsächlichen Kurven von „Das Rennen“ beziehungsweise „Vertrauensverlauf“, der angekündigte Methoden-Atlas, die Bilanz und die Gegenmaßnahmen sind in den gelieferten Ausschnitten nicht sichtbar und daher nicht beurteilbar.
- Es ist unklar, ob die doppelten Reportaufnahmen ein UI-Problem oder ein Fehler der Visual-Review-Ernte sind. Dafür werden Screenshots mit sichtbarer Scrollposition oder Abschnittsmarkierung benötigt.
- Die Scrollleiste des Berichts ist nicht erkennbar. Ohne sie lässt sich weder Scrollumfang noch aktuelle Position bewerten.
- Es gibt nur die Darstellung bei 1280 × 720. Für kleine Auflösungen wären insbesondere `end_timeout_wahlabend_s2.png` mit seinem randnahen Button und die langen Reportseiten erneut aufzunehmen.
- Ob der „GEFÄLSCHT“-Stempel in `end_immune_wahlabend_s1.png` animiert auf die Kampagnenzeile trifft oder lediglich an seiner Endposition erscheint, ist nicht sichtbar; die räumliche Kritik kann sich deshalb nur auf den gezeigten Endzustand beziehen.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
