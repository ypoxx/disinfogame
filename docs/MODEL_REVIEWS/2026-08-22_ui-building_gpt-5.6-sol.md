# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „building"

**Modell:** `gpt-5.6-sol` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-22
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-22T17:09:26.285Z · **Dauer:** 204.7 s
**Nutzung:** nicht gemeldet · **Kosten:** unbekannt · **Anbieter-Datensammlung:** ausgeschlossen (deny)

> ⚠️ **Wie das zu lesen ist:** Ein *fremdes* Modell hat einen **kuratierten Ausschnitt**
> des Projekts gesehen — nicht das laufende Spiel und nicht das ganze Repository. Es kann
> daher weder Laufzeitverhalten prüfen noch `file:line`-Belege verifizieren. Befunde sind
> **Hypothesen**, die vor dem Umsetzen am Code/an den Daten gegenzuprüfen sind. Die
> kanonische Wahrheit bleibt [`docs/VISION_LOCK.md`](../VISION_LOCK.md) bzw. die Spieldaten.

## Gestellte Frage

Sieh dir die beigefügten Screenshots des laufenden Spiels an und mache einen UX/UI-Durchgang. Die Optik soll eine Behörden-/Papierwelt sein (Stil-Anker und Farbtoken liegen bei). Sag mir: Wo führt das Bild den Blick falsch, welche Grafiken sitzen an der falschen Stelle oder in der falschen Größe, wo stimmen Abstände und Ausrichtung nicht, und welche drei Änderungen bringen am meisten? Sei so konkret, dass man es direkt umsetzen kann.

## Dieser Durchgang: Bündel „building" (10 Screenshots)

Das siehst du, in dieser Reihenfolge:
- building_lobby_day.png — Gebäude-Querschnitt, EG/Lobby, Vormittag (11:00)
- pfoertner_bubble.png — Pförtner in der Lobby mit geöffneter Sprechblase
- building_etage4.png — Gebäude-Querschnitt, Etage 4 — Spezial-Operationen (Avatar vor Ort)
- building_etage3.png — Gebäude-Querschnitt, Etage 3 — Analyse & Medien (Avatar vor Ort)
- building_etage2.png — Gebäude-Querschnitt, Etage 2 — Feld-Operationen (Avatar vor Ort)
- building_etage1.png — Gebäude-Querschnitt, Etage 1 — Zentrale (Avatar vor Ort)
- building_keller.png — Gebäude-Querschnitt, Keller — Geheimoperationen (Avatar vor Ort)
- poster_detail.png — Vergrößertes Propaganda-Plakat (Detail-Overlay, §14.4)
- ambient_bubble.png — Flur-Statist mit Flavor-Sprechblase
- building_avatar_f.png — Gebäude mit weiblichem Avatar (Lauf-/Idle-Sheet-Kopplung an Porträt-Wahl, V16)

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
| 🖼 Bild | `building_lobby_day.png` | `desinformation-network/runs/visual-review/latest/shots/building_lobby_day.png` | 695 kB |
| 🖼 Bild | `pfoertner_bubble.png` | `desinformation-network/runs/visual-review/latest/shots/pfoertner_bubble.png` | 688 kB |
| 🖼 Bild | `building_etage4.png` | `desinformation-network/runs/visual-review/latest/shots/building_etage4.png` | 705 kB |
| 🖼 Bild | `building_etage3.png` | `desinformation-network/runs/visual-review/latest/shots/building_etage3.png` | 709 kB |
| 🖼 Bild | `building_etage2.png` | `desinformation-network/runs/visual-review/latest/shots/building_etage2.png` | 704 kB |
| 🖼 Bild | `building_etage1.png` | `desinformation-network/runs/visual-review/latest/shots/building_etage1.png` | 701 kB |
| 🖼 Bild | `building_keller.png` | `desinformation-network/runs/visual-review/latest/shots/building_keller.png` | 675 kB |
| 🖼 Bild | `poster_detail.png` | `desinformation-network/runs/visual-review/latest/shots/poster_detail.png` | 707 kB |
| 🖼 Bild | `ambient_bubble.png` | `desinformation-network/runs/visual-review/latest/shots/ambient_bubble.png` | 684 kB |
| 🖼 Bild | `building_avatar_f.png` | `desinformation-network/runs/visual-review/latest/shots/building_avatar_f.png` | 696 kB |

---

## Antwort des Modells

## 1. **Erster Eindruck**

### `building_lobby_day.png`
Der gelbe Hinweis „Finanzen / Tresor · Igor“ zieht zuerst den Blick auf den Keller, obwohl laut Dateiname die Lobby der aktuelle Ort ist. Danach fällt die Uhr auf; der Pförtner selbst geht in der großen, weitgehend leeren Empfangsfläche unter. Der Blick sollte zuerst zur Lobby und zur dort relevanten Figur gehen, dann zu den erreichbaren Etagen. Das geschieht nicht, weil aktuelle Etage, Spielfigur und bloß hervorgehobene Tür visuell nicht sauber unterschieden werden.

### `pfoertner_bubble.png`
Hier landet der Blick korrekt auf dem schwarzen Dialogfeld, weil es die kontrastreichste Fläche im Gebäude ist. Die Box wirkt jedoch eher wie ein Debug-Tooltip als wie eine Sprechblase oder Behördennotiz: Es fehlen Schweif, Papiermaterial und eine klare Bindung an den Pförtner. Ihre Unterkante liegt sehr dicht am Etagensteg und konkurriert dort mit „Finanzen / Tresor · Igor“. Inhaltlich funktioniert die Blickfolge Pförtner–Text, stilistisch und räumlich noch nicht.

### `building_etage4.png`
Zuerst fallen Uhr und die vielen schwarzen Raumschilder auf, erst danach die Personen auf Etage 4. Der aktuelle Stock sollte unmittelbar als zusammenhängende Zone lesbar sein und die Spielfigur innerhalb dieser Zone den zweiten Fokus bilden. Beides ist nur über das Wissen aus dem Dateinamen erschließbar; die Etage unterscheidet sich weder durch Licht noch durch einen eindeutigen Zustandsmarker. Die sichtbare Gebäudetechnik oberhalb der Etage verstärkt zudem die kleinteilige obere Bildkante.

### `building_etage3.png`
Auf Etage 3 konkurrieren die gehende Figur in der Mitte und die größere, stehende Figur rechts um die Rolle der Spielfigur. Gleichzeitig zieht der helle Fahrstuhl mehr Aufmerksamkeit an als beide. Der Blick sollte zuerst auf einen klar markierten Avatar und danach auf „Zielgruppen-Analyse“ beziehungsweise „Newsroom“ gehen. Die Etage liegt zwar günstig im oberen Mittelfeld, erhält aber keine stärkere visuelle Gewichtung als die übrigen Geschosse.

### `building_etage2.png`
Die Figurengruppe rechts der Mitte ist der erste brauchbare Fokus, weil dort Tür, Schrank und zwei Figuren räumlich zusammenfallen. Welche der beiden Figuren der Avatar ist, muss man dennoch zweimal prüfen. Die Überschrift „Feld-Operationen · Katja“ sitzt als schwarzer Steg über der Etage, wirkt aber nicht eindeutig wie deren aktueller Titel. Der Fahrstuhl rechts bleibt durch seine große, helle Fläche ein unnötig starker Nebenfokus.

### `building_etage1.png`
Das Figurenpaar vor der linken Tür auf Etage 1 wird zum primären Fokus, aber Avatar und NPC sind nahezu gleich gewichtet. Die seitlich stark orange werdende Skyline zieht zusätzlich an beide Außenränder. Der aktuelle Stock liegt kompositorisch sinnvoll im Zentrum, wird jedoch nicht als aktiver Bereich ausgezeichnet. Man erkennt „Etage 1“ schneller als die konkrete spielrelevante Person oder Tür.

### `building_keller.png`
Hier führt die gelbe Türumrandung samt gelbem Schild den Blick eindeutig in den Keller. Das ist erstmals eine starke Ortsführung, sie verwendet allerdings dieselbe Warnfarbe, die laut Farbkontext sparsam für Hinweise gedacht ist, und wirkt eher wie Hover oder Alarm als wie „aktueller Ort“. Die Person links und die Person in der Tür sind erneut nicht klar hierarchisiert. Der helle Fahrstuhl ganz rechts bildet einen zweiten, fast gleich starken Fokus.

### `poster_detail.png`
Es ist kein Detail-Overlay sichtbar; der Screenshot zeigt im Wesentlichen dieselbe Gebäudeansicht wie die Etagenbilder. Der Blick geht daher zur Uhr, zu den schwarzen Raumschildern und zu den laufenden Figuren, nicht zu einem Plakat. Bild und im Manifest beschriebene Absicht „Vergrößertes Propaganda-Plakat“ fallen vollständig auseinander. Das ist nicht primär ein Feintuningproblem, sondern ein fehlender oder hinter der Szene gerenderter Zustand.

### `ambient_bubble.png`
Eine Flavor-Sprechblase ist nicht sichtbar; stattdessen dominiert das ausgeklappte Broadcast-/Publikumsmodul die gesamte untere Bildschirmhälfte. Der Blick landet zuerst im warmen Wohnzimmer rechts unten und danach auf dem großen Röhrenfernseher links, nicht auf einem Flur-Statisten. Zusätzlich entstehen links und rechts des Gebäudes große, flache graue Flächen, weil der Skyline-Hintergrund die vertikal verschobene Ansicht offenbar nicht vollständig abdeckt. Auch hier widerspricht das sichtbare Ergebnis dem Dateinamen deutlich.

### `building_avatar_f.png`
Der Blick landet zunächst beim Figurenpaar auf Etage 1, aber die weibliche Spielfigur ist ohne Vergleichsbild oder Marker nicht zuverlässig als ausgewählter Avatar zu erkennen. Silhouette, Größe und Kontrast sind den benachbarten NPCs zu ähnlich. Die eigentliche Kopplung von Porträtwahl und Lauf-/Idle-Sheet lässt sich aus einem statischen, weit herausgezoomten Bild nicht überprüfen. Der Fokus sollte auf der gewählten Figur liegen; aktuell liegt er nur allgemein auf der Figurengruppe.

---

## 2. **Konkrete Eingriffe je Screen**

### `building_lobby_day.png`
- Gelbes Keller-Schild „Finanzen / Tresor · Igor“ → Hervorhebung entfernen, solange weder Hover noch Fokus auf dieser Tür liegt; im Grundzustand dieselbe schwarze beziehungsweise papierfarbene Behandlung wie die übrigen Schilder verwenden → der Keller entführt den Blick aus der Lobby.
- Aktuelle Lobby → gesamten Lobby-Streifen etwa 10–15 % heller als die anderen Geschosse setzen und links am Etagenlabel einen schmalen Tintenblau-Reiter „AKTUELL“ ergänzen → der Aufenthaltsort wird als Zone statt als einzelnes Objekt verständlich.
- Pförtner beziehungsweise relevante Lobbyfigur → kleinen, nach unten weisenden Marker in `agencyBlue` mit ungefähr einem Drittel der Figurenbreite und einer halben Figurenhöhe Abstand über dem Kopf platzieren → die kleine Figur bleibt im großen Empfangsraum auffindbar.
- Lobby-Leerfläche → Kamera für den Lobbyzustand geringfügig näher heranfahren, sodass die Lobby etwa ein Viertel mehr Bildschirmhöhe erhält, ohne Keller und Etage 1 vollständig zu verlieren → die aktive Etage bekommt Gewicht, ohne den Querschnitt aufzugeben.
- Untere Statusleiste → rechten Inhalt vor der beigefarbenen Seitenleiste enden lassen und „PUBLIKUM“ mit derselben Innenkante wie den HUD-Knopf ausrichten → der angeschnittene Button wirkt derzeit wie ein Layoutfehler.

### `pfoertner_bubble.png`
- Schwarze Textbox → auf eine helle Papierfläche aus `surfaceLight` mit dunkler Tinte umstellen; nur Sprecherstempel oder Kopfband rot beziehungsweise blau akzentuieren → die Box folgt dann der in `desinformation-network/src/story-mode/theme.ts` gesetzten Behörden-Akte statt einer Terminalästhetik.
- Verankerung der Sprechblase → einen kurzen Schweif zur rechten Schulter des Pförtners setzen und die Box etwa eine halbe Figurenbreite weiter nach rechts sowie etwas nach oben schieben → Figur und Aussage bilden eine eindeutige Einheit.
- Unterkante der Sprechblase → mindestens eine halbe Textzeile Abstand zum unteren Etagensteg halten → die Box berührt visuell fast das Keller-Schild und bildet dort eine ungewollte Gruppe.
- Sprecherzeile „PFÖRTNER“ → gegenüber dem Fließtext um etwa 15–20 % vergrößern und als gestempeltes Mini-Label mit eigener Oberkante behandeln → die Hierarchie ist aktuell zu schwach.
- Nicht aktive Etagen → während der offenen Sprechblase leicht abdunkeln, die Lobby dagegen unverändert lassen → der Textmodus erhält einen klaren räumlichen Fokus.

### `building_etage4.png`
- Etage 4 → nicht nur das kleine linke Etagenlabel, sondern den kompletten Geschossraum leicht aufhellen; Etagen 1–3 und Lobby auf etwa 75–80 % ihrer aktuellen Helligkeit reduzieren → der aktuelle Stock wird sofort erkannt.
- Spielfigur auf Etage 4 → denselben Tintenblau-Marker wie in den übrigen Gebäudescreens verwenden → die Figur konkurriert sonst mit Türen, Drucker und Fahrstuhl.
- Raumschilder „Cyber-Lab“, „Operationszentrale“ und „Medien-Zentrum“ → auf eine gemeinsame Grundlinie setzen und jeweils an der horizontalen Mitte der zugehörigen Tür ausrichten → aktuell wirken sie wie unterschiedlich lange, auf den Steg gelegte Etiketten.
- Oberer Gebäuderand → die sichtbare Technik oberhalb von Etage 4 etwas stärker abdunkeln oder die Kamera so verschieben, dass dieser Bereich nur etwa halb so hoch erscheint → die kleinteilige Dachzone soll nicht mit dem aktuellen Geschoss konkurrieren.
- „Etage 4 – Spezial-Operationen“ → aktive Fassung etwa 1,2× höher als inaktive Etagenlabels und mit heller Papierfläche statt schwarzem Balken darstellen → Etagenstatus und Raumbezeichnung werden dadurch getrennt.

### `building_etage3.png`
- Spielfigur und gehender Statist auf Etage 3 → nur der Avatar erhält Marker und einen kleinen hellen Bodenschatten; Ambient-Figuren bleiben unmarkiert → die Rollen sind in der aktuellen Größe nicht zuverlässig unterscheidbar.
- Etage 3 → Geschossband aufhellen und die darüber- beziehungsweise darunterliegenden Geschosse gleichmäßig dimmen → die Kamera allein vermittelt den Fokus nicht.
- Fahrstuhl → Innenfläche im nicht aktiven Zustand um etwa 15 % abdunkeln; Cyan-Licht nur bei Ankunft oder Nutzbarkeit aktivieren → die große helle Fläche zieht derzeit stärker als der Avatar.
- „Zielgruppen-Analyse“ und „Newsroom“ → jeweils direkt über ihrer Tür beziehungsweise Raumzone platzieren, nicht auf derselben Trennschiene wie der Etagentitel → Raumziele werden räumlich verständlicher.
- Rechte Figurengruppe → zwischen Figur und Türrahmen mindestens eine halbe Figurenbreite Abstand herstellen, sofern dies kein Interaktionszustand ist → die Silhouetten verschmelzen momentan mit der Tür.

### `building_etage2.png`
- Figurenpaar bei Katja → Avatar mit blauem Kopfmarker kennzeichnen und NPC optional mit einem kleinen Namensschild direkt oberhalb der Figur versehen → zwei ähnlich große Figuren vor derselben Tür sind nicht eindeutig lesbar.
- „Feld-Operationen · Katja“ → Schild über die relevante Tür statt mittig über die gesamte Etage setzen; Etagentitel links belassen → Abteilungsname und konkrete Person werden aktuell vermischt.
- Aktive Etage 2 → heller Papier-/Lichtsaum an Ober- und Unterkante des Geschosses, jeweils deutlich dünner als der Etagensteg → ein zusammenhängender Fokus entsteht, ohne die Pixelkulisse zu überdecken.
- Fahrstuhl rechts → im Grundzustand dieselbe Helligkeit wie die Metallwand erhalten; nur Kontrollleuchte cyan lassen → seine Fläche ist derzeit der größte helle Block des Stockwerks.
- Unten angeschnittener Keller → entweder vollständig aus dem Bild nehmen oder so weit zeigen, dass das Kellerlabel nicht an der unteren Statusleiste klebt → der aktuelle Halbausschnitt wirkt zufällig.

### `building_etage1.png`
- Figurenpaar vor der Zentrale → Avatar mit konstantem Marker versehen; NPC-Name beziehungsweise Interaktionsziel über der Tür belassen → die beiden Personen dürfen nicht allein über minimale Kleidungsunterschiede unterschieden werden müssen.
- Etage 1 → als aktive Papier-/Lichtzone hervorheben und Lobby sowie Etage 2 leicht zurücknehmen → die zentrale Position wird dann auch hierarchisch genutzt.
- Orange Skyline an beiden Seiten → Sättigung und Helligkeit während des Gebäudemodus um etwa ein Fünftel reduzieren → die Außenränder ziehen stärker als die kühle Innenzone.
- Schilder „Direktor / Zentrale · Kurator“ und „Ihr Büro“ → gleiche Höhe, gleiche vertikale Innenabstände und Zentrierung über den zugehörigen Türen herstellen → momentan wirken sie wie unabhängig gesetzte schwarze Streifen.
- Lobby unterhalb → bei Fokus auf Etage 1 minimal abdunkeln, nicht vollständig gleich hell lassen → die große helle Bodenfläche konkurriert mit dem wesentlich kleineren aktiven Stock.

### `building_keller.png`
- Gelbe Türumrandung → für „aktueller Ort“ durch Tintenblau oder eine helle Papierkontur ersetzen; Gelb nur für Warnung, Neuigkeit oder konkreten Hinweis reservieren → der Zustand liest sich aktuell wie Alarm beziehungsweise Hover.
- Avatar im Keller → Kopfmarker ergänzen und die Figur um einen dezenten hellen Bodenkontrast vom grauen Hintergrund lösen → dunkler Anzug und Kellerwand verschmelzen.
- Kellerlabels → „Keller – Geheimoperationen“ links als Etagentitel belassen, „Finanzen / Tresor · Igor“ direkt über der entsprechenden Tür zentrieren → die aktuelle mittige Beschriftung wirkt vom Zielobjekt abgelöst.
- Fahrstuhl rechts → Metallfläche abdunkeln und nur bei Interaktion aufhellen → er konkurriert mit der tatsächlich hervorgehobenen Kellertür.
- Kellerraum → lokal um die Spielfigur und die relevante Tür etwas heller, zu den äußeren Rändern dunkler beleuchten → die gemäß `sprite-tool/public/context/game-style-guide.md` vorgesehene kühle Kellerstimmung bleibt erhalten, ohne Figuren zu verschlucken.

### `poster_detail.png`
- Detail-Overlay → überhaupt sichtbar rendern und in der obersten UI-Ebene über Gebäude, Figuren und HUD-Hotspots legen → der vorgesehene Zustand fehlt vollständig.
- Overlay-Fläche → als zentrierte Dokumentkarte mit ungefähr der halben Bildschirmbreite und höchstens zwei Dritteln der Bildschirmhöhe anlegen → das Plakat erhält genug Fläche, ohne seinen Ursprung im Gebäude zu verlieren.
- Hintergrund hinter dem Overlay → Gebäude mit einer neutralen, etwa halbtransparenten dunklen Tintenlage zurücknehmen, nicht unscharf skalieren → Blick und Pixelkante bleiben kontrolliert.
- Vergrößertes Plakat → integer beziehungsweise nearest-neighbor skalieren und ringsum einen Papierpasspartout-Abstand von ungefähr einem Zehntel der Kartenbreite lassen → eine weiche oder randlose Vergrößerung würde dem scharfen Pixelstil widersprechen.
- Schließen-Hinweis → als kleiner Aktenreiter an der oberen rechten Kartenkante platzieren, nicht am äußersten Bildschirmrand → die Aktion gehört zum Dokument, nicht zur globalen Seitenleiste.

### `ambient_bubble.png`
- Flavor-Sprechblase → sichtbar über dem zugehörigen laufenden Flur-Statisten platzieren, mit Schweif zur Figur und mindestens einer Textzeile Abstand zu den Etagenstegen → der benannte Kernzustand fehlt.
- Ausgeklapptes Broadcast-/Publikumsmodul → für diese Aufnahme beziehungsweise während einer lokalen Flavor-Blase einklappen oder auf seine schmale Statusleiste reduzieren → es beansprucht derzeit fast die halbe Bildfläche und gewinnt jeden Blickkampf.
- Seitliche graue Flächen → Skyline-Hintergrund vertikal bis zur Oberkante des unteren Panels verlängern oder im Kameraraum per Cover füllen → die leeren Rechtecke links und rechts sehen wie nicht gerenderte Kulisse aus.
- Sprechblasenoberfläche → dieselbe helle Papierlogik wie bei `pfoertner_bubble.png` verwenden, nicht eine weitere schwarze Terminalbox → Dialogzustände brauchen eine konsistente Materialfamilie.
- Unteres Modul → falls es sichtbar bleiben muss, Höhe auf höchstens etwa ein Viertel des Bildes begrenzen und TV, Statusdaten und Publikum in ein gemeinsames Raster bringen → momentan entstehen zwei konkurrierende Spielebenen.

### `building_avatar_f.png`
- Weibliche Spielfigur auf Etage 1 → mit demselben neutralen Avatar-Marker wie alle anderen auswählbaren Figuren versehen → Auswahl muss über UI-Zustand, nicht über geschlechtlich codierte Silhouettendetails, lesbar werden.
- Sprite-Silhouette → Aktentasche, Jackenkontur und Gehpose bei der normalen Bildschirmgröße um wenige klare Pixel stärker vom Körper lösen, ohne die Gesamtgröße zu verändern → die Figur ist im Paar nur schwer als eigener Sprite zu lesen.
- Figurenabstand vor der Tür → Avatar und NPC mindestens um etwa eine halbe Figurenbreite trennen, sofern kein Dialog läuft → beide Silhouetten verschmelzen aktuell zu einer Gruppe.
- Aktive Etage 1 → dieselbe Geschoss-Hervorhebung wie in `building_etage1.png` einsetzen → die Avatarvariante darf nicht auf einer eigenen, schwächeren Fokuslogik beruhen.
- Kopplungsnachweis → für die Prüfung zusätzlich eine Aufnahme während einer seitlichen Gehbewegung und eine Nahansicht in ungefähr doppelter Darstellungsskala erzeugen → das statische Fernbild belegt nur eine weiblich gelesene Standfigur, nicht die Sheet-Kopplung.

---

## 3. **Grafiken/Assets**

### Tragende Assets

- Die Gebäudekulisse in `building_lobby_day.png`, `building_etage4.png`, `building_etage3.png`, `building_etage2.png`, `building_etage1.png` und `building_keller.png` trägt den modernen Behörden-/Brutalismus-Anker: Metall, Beton, Glas, Leuchtstoffröhren und Fahrstuhlschacht sind scharf und konsistent ausgearbeitet.
- Die Lobby in `building_lobby_day.png` und `pfoertner_bubble.png` hat durch Glasfront, Bodenperspektive und größere Geschosshöhe eine nachvollziehbare Eigenidentität.
- Der Keller in `building_keller.png` ist gegenüber den Büroetagen kühler und dunkler, ohne vollständig leer zu sein; das entspricht der Zonenlogik aus `sprite-tool/public/context/game-style-guide.md`.
- Uhr und beige Seitenleiste wirken in allen Gebäudescreens grundsätzlich wie Bestandteile einer Papieroberfläche. Sie sind jedoch noch zu flach und zu isoliert, um die Oberfläche als durchgängige „Behörden-Akte“ zu verkaufen.
- Röhrenfernseher und Wohnzimmer in `ambient_bubble.png` sind als Pixel-Assets markant und detailliert. Sie tragen nur nicht den vorgesehenen Screen, weil sie die fehlende Flavor-Blase vollständig verdrängen.

### Fremd oder inkonsistent wirkende Assets

- Die schwarzen Raumetiketten, die schwarze untere Statusleiste und die schwarze Sprechbox in `pfoertner_bubble.png` folgen eher einer CRT-/Terminalästhetik als den Papierflächen aus `desinformation-network/src/story-mode/theme.ts`. Die Absicht „gesamte Bedienung ist aus Papier gemacht“ ist auf diesen Screens nicht sichtbar durchgesetzt.
- Der kräftige grüne „STANDBY“-Text und die rote Linie der unteren Leiste wirken in `building_lobby_day.png` bis `building_avatar_f.png` wie ein zweites UI-System. Für Papierwelt wären dunkle Tinte, Petrol und Ministeriumsrot in klar begrenzten Stempelrollen schlüssiger.
- Die gelbe Türmarkierung in `building_lobby_day.png` und `building_keller.png` ist zu gesättigt und zu dominant für einen gewöhnlichen Fokuszustand. Sie liest sich als Warnung, obwohl der sichtbare Kontext keine Gefahr zeigt.
- Die Stadtsilhouette ist gröber und flächiger gepixelt als das sehr fein detaillierte Gebäude. Das ist als Tiefenstaffelung grundsätzlich vertretbar, aber die orange Tageszeit in `building_etage1.png` wird so gesättigt, dass die Hintergrundgrafik in den Vordergrund springt.
- Die flachen grauen Seitenflächen in `ambient_bubble.png` sind kein tragfähiger Hintergrundzustand. Dort fehlt sichtbar ein korrekt gefüllter oder weitergeführter Skyline-/Himmel-Layer.

### Skalierung und Zuschnitt

- Die Figuren sind in allen Gebäudeansichten sehr klein gegenüber Türen und Raumhöhe. Das ist für den Querschnitt plausibel, verlangt aber zwingend einen Zustandsmarker; zusätzliche Sprite-Details allein werden in dieser Skala nicht helfen.
- Fahrstühle sind wegen ihrer großen hellen Flächen visuell übergewichtet, besonders in `building_etage3.png`, `building_etage2.png` und `building_keller.png`.
- In `building_etage2.png` ist der Keller unten nur als schmaler Rest angeschnitten. Entweder sollte der Schnitt vor dem Kellersteg erfolgen oder ausreichend Keller gezeigt werden, damit das Label Luft erhält.
- `poster_detail.png` enthält weder vergrößertes Plakat noch sichtbare Overlay-Grafik. Das wichtigste Asset dieses Screens fehlt vollständig.
- `ambient_bubble.png` enthält keine sichtbare Sprechblase. Stattdessen ist das untere Broadcast-Asset in einer Größe präsent, die eher einem eigenen Hauptscreen entspricht.

### Was am meisten fehlt

- In sämtlichen Gebäudescreens fehlt ein einheitliches Avatar-Asset für den Auswahlzustand: ein kleiner Marker über dem Kopf plus dezenter Bodenkontrast.
- In `poster_detail.png` fehlt eine klar materialisierte Dokumentkarte für das Plakat.
- In `ambient_bubble.png` und `pfoertner_bubble.png` fehlt eine konsistente Papier-Sprechblasenfamilie mit Schweif, Sprecherstempel und festen Innenabständen.
- Den Etagen fehlt ein grafischer Aktivzustand, der das gesamte Geschoss umfasst und nicht nur eine einzelne Tür gelb färbt.

---

## 4. **Raster & Rhythmus**

- In `building_lobby_day.png`, `pfoertner_bubble.png` und `building_avatar_f.png` nimmt das Gebäude ungefähr zwei Drittel der Breite ein; Skyline und rechte Werkzeugleiste beanspruchen den Rest. Die dekorativen Seitenflächen erhalten dadurch viel Raum, während die spielrelevanten Figuren sehr klein bleiben. Eine leichte Vergrößerung des Gebäudes oder ein stärkerer Fokuszoom pro Etage wäre sinnvoller als dauerhaft gleichgewichtete Skyline-Ränder.
- Die horizontalen Etagenstege erzeugen einen klaren Grundrhythmus, werden aber gleichzeitig als Ablage für Etagenname, Abteilungsname und Personenname benutzt. In `building_etage3.png` und `building_etage2.png` entstehen dadurch mehrere schwarze Textinseln auf fast derselben Höhe, ohne erkennbare Hierarchiestufe.
- Etagenlabels sollten immer an einer gemeinsamen linken Achse beginnen. Raum- und NPC-Labels sollten dagegen an Türmitten ausgerichtet sein. Diese beiden Systeme sind aktuell vermischt.
- Die aktive Etage wandert in `building_etage4.png` bis `building_keller.png` erwartbar durch das Bild, erhält aber weder einen konstanten vertikalen Zielbereich noch eine visuelle Klammer. Wo die Kamera wegen Dach oder Keller nicht weiter zentrieren kann, muss die Hervorhebung diese fehlende Zentrierung kompensieren.
- Die Lobby erzeugt in `building_lobby_day.png`, `pfoertner_bubble.png` und `building_etage1.png` sehr viel tote Fläche zwischen Pförtner und Glasfront. Diese Fläche ist als Architektur glaubwürdig, aber als aktuelle Spielzone zu leer, solange weder Lichtführung noch Interaktionsmarker sie strukturiert.
- Die rechte beige Leiste hat einen regelmäßigen vertikalen Tastenrhythmus, aber die große Papierfläche um die kleinen Buchstabentasten bleibt ungenutzt. Entweder die Leiste schmaler machen oder die Tasten um kurze Bezeichnungen ergänzen; der aktuelle Zwischenzustand verschenkt Breite.
- Uhr, Menü und HUD-Schalter bilden oben rechts keine saubere Gruppe: Die Uhr sitzt links versetzt, Menü und HUD stehen danach in getrennten Kästen. Eine gemeinsame Oberkante ist vorhanden, aber Abstände und Breiten folgen keinem sichtbaren Modul.
- Die untere Statusleiste läuft in fast allen Screens unter die rechte Seitenleiste. Das angeschnittene „PUBLIKUM“ ist der sichtbarste Folgefehler und sollte durch ein gemeinsames Seitenraster behoben werden.
- `ambient_bubble.png` bricht den vertikalen Rhythmus vollständig: Das Broadcast-Modul nimmt knapp die halbe Höhe ein, während vom Gebäude nur ein zufälliger Ausschnitt übrig bleibt. Zusätzlich lassen die grauen Seitengutter den Bühnenbereich unfertig wirken.

---

## 5. **Lesbarkeit**

- Die kleinen schwarzen Etagen- und Raumschilder sind bei der gezeigten Auflösung noch entzifferbar, aber dicht gesetzt. Besonders in `building_etage4.png` musste ich „Cyber-Lab · Alexei“, „Operationszentrale“ und „Medien-Zentrum · Marina“ nacheinander prüfen, weil alle Schilder dieselbe Gewichtung besitzen.
- In `building_etage3.png`, `building_etage2.png`, `building_etage1.png` und `building_avatar_f.png` musste ich zweimal hinsehen, welche Person der Avatar ist. Die Kleidung allein trägt den Zustand nicht.
- In `building_lobby_day.png` musste ich prüfen, ob das gelbe Keller-Schild den aktuellen Ort oder lediglich ein Ziel beziehungsweise Hover markiert. Der Zustand ist semantisch nicht eindeutig.
- In `pfoertner_bubble.png` ist der Fließtext grundsätzlich lesbar, die Sprecherzeile „PFÖRTNER“ jedoch klein und kontrastarm. Der schwarze Kasten hat hohen Kontrast, aber keine Papierhierarchie.
- Die doppelten Buchstaben „K“ in der rechten Leiste sind in allen Screens ohne Tooltip oder ausgeschriebene Bezeichnung nicht unterscheidbar. Auch „M“, „A“ und „I“ sind nur für bereits eingewiesene Spieler verständlich.
- Die Uhr ist gut lesbar, aber durch ihren hohen Hell-Dunkel-Kontrast oft wichtiger als der aktuelle Stock. Sie braucht nicht weniger Kontrast, sondern der Spielort braucht mehr.
- Die untere Statuszeile ist in `building_lobby_day.png` bis `building_avatar_f.png` zu klein und zu lang für ihren Kontrast. Der Satz „Noch keine Maßnahme ausgespielt …“ wird eher als dekoratives Band denn als Statusinformation gelesen.
- In `ambient_bubble.png` sind „QUOTE 0 %“, „REICHWEITE 0 %“ und der Begleittext klein und weit auseinandergezogen. Gleichzeitig ist das Wohnzimmerbild groß und hoch gesättigt; Bild und Daten besitzen keine ausgewogene Hierarchie.
- In `poster_detail.png` gibt es keinen erkennbaren geöffneten Zustand, keinen Titel und keinen Schließen-Hinweis. Ein Spieler könnte nicht wissen, dass überhaupt ein Detailmodus aktiv sein soll.
- Gesperrt-, Neu- oder Aktivzustände sind auf diesen zehn Bildern nicht als konsistentes System sichtbar. Das einzige starke Zustandsmittel ist Gelb, dessen Bedeutung unklar bleibt.

---

## 6. **Die drei wirksamsten Änderungen**

1. **Einheitlichen Fokus für aktuelle Etage und Avatar einführen** — Geschoss leicht aufhellen, übrige Etagen dimmen und den Avatar mit einem kleinen Tintenblau-Marker versehen; das behebt mit einer einzigen Overlay-Logik die größte Orientierungsstörung in fast allen zehn Screens.

2. **Fehlende Zustände in `poster_detail.png` und `ambient_bubble.png` reparieren** — Overlay beziehungsweise Flavor-Blase müssen sichtbar sein und über konkurrierenden Panels rendern; zwei der zehn Screens zeigen derzeit nicht den benannten Inhalt.

3. **Schwarze Etiketten, Sprechbox und Statusflächen in ein konsistentes Papier-Raster überführen** — helle Dokumentflächen, dunkle Tinte, klare Sprecherstempel und getrennte Achsen für Etagen- und Türlabels verbinden die sichtbare Oberfläche endlich mit `desinformation-network/src/story-mode/theme.ts`.

---

## 7. **Blinde Flecken**

- Aus `building_etage4.png` bis `building_keller.png` ist nicht erkennbar, ob der gelbe Türzustand Hover, Tastaturfokus, Questziel oder aktueller Raum bedeutet. Dafür werden je ein Grundzustand, Hoverzustand und Tastaturfokus derselben Tür benötigt.
- Die Lauf- und Idle-Animationen lassen sich aus den Standbildern nicht auf Frame-Ruhe, Fußrutschen, Integer-Skalierung oder Flackern prüfen. Dafür sind kurze Aufnahmen in Originalgeschwindigkeit nötig.
- `building_avatar_f.png` belegt die Kopplung an die Porträtwahl nicht. Benötigt werden dieselbe Position mit männlichem und weiblichem Avatar sowie je ein Frame aus Idle und seitlichem Lauf.
- In `pfoertner_bubble.png` ist nicht erkennbar, ob die Box Zeichen für Zeichen erscheint, automatisch verschwindet oder den Input blockiert. Dafür werden Start-, Volltext- und Endzustand benötigt.
- `poster_detail.png` und `ambient_bubble.png` lassen offen, ob die vorgesehenen Elemente wegen eines Aufnahmefehlers, falschen Render-Layers oder tatsächlicher Implementierung fehlen. Ein Screenshot direkt nach dem Interaktionsklick und einer mit sichtbaren Debug-Layergrenzen wäre dafür nötig.
- Die rechte Tastaturleiste kann ohne Hover- oder Fokusbilder nicht abschließend bewertet werden. Insbesondere fehlen Tooltips, aktiver Tastenzustand und Verhalten bei schmalerer Auflösung.
- Die Lesbarkeit bei kleinerer Auflösung oder UI-Skalierung ist nicht sichtbar. Erforderlich wären mindestens dieselben Gebäudescreens bei einer kleineren Zielauflösung und bei erhöhter UI-Skalierung.
- Die Tageszeitübergänge sind nur als verschiedene Einzelstände sichtbar; ob Skyline und Innenlicht weich wechseln oder springen, lässt sich hier nicht beurteilen.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
