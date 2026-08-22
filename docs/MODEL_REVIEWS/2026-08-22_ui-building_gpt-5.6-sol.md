# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „building"

**Modell:** `gpt-5.6-sol` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-22
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-22T17:19:07.670Z · **Dauer:** 185.5 s
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
| 🖼 Bild | `pfoertner_bubble.png` | `desinformation-network/runs/visual-review/latest/shots/pfoertner_bubble.png` | 686 kB |
| 🖼 Bild | `building_etage4.png` | `desinformation-network/runs/visual-review/latest/shots/building_etage4.png` | 704 kB |
| 🖼 Bild | `building_etage3.png` | `desinformation-network/runs/visual-review/latest/shots/building_etage3.png` | 709 kB |
| 🖼 Bild | `building_etage2.png` | `desinformation-network/runs/visual-review/latest/shots/building_etage2.png` | 708 kB |
| 🖼 Bild | `building_etage1.png` | `desinformation-network/runs/visual-review/latest/shots/building_etage1.png` | 706 kB |
| 🖼 Bild | `building_keller.png` | `desinformation-network/runs/visual-review/latest/shots/building_keller.png` | 674 kB |
| 🖼 Bild | `poster_detail.png` | `desinformation-network/runs/visual-review/latest/shots/poster_detail.png` | 111 kB |
| 🖼 Bild | `ambient_bubble.png` | `desinformation-network/runs/visual-review/latest/shots/ambient_bubble.png` | 111 kB |
| 🖼 Bild | `building_avatar_f.png` | `desinformation-network/runs/visual-review/latest/shots/building_avatar_f.png` | 697 kB |

---

## Antwort des Modells

## 1. **Erster Eindruck**

### `building_lobby_day.png`
Der Blick fällt zuerst auf das gelbe Schild „Finanzen / Tresor · Igor“ am unteren Gebäuderand, obwohl die Aufnahme laut Dateiname die Lobby zeigen soll. Danach ziehen die helle Skyline und die großen Glasflächen der Lobby Aufmerksamkeit an; die Spielfigur beziehungsweise der aktuelle Aufenthaltsort sind dagegen nicht eindeutig zu identifizieren. Eigentlich müsste zuerst die Lobby mit dem Spieler und erst danach die übrige Gebäudestruktur gelesen werden. Die breiten, weitgehend leeren Lobbyflächen verstärken das Problem, weil dort kein klarer visueller Anker sitzt. Zusätzlich wirkt die schmale, rechts abgeschnittene Papierleiste wie ein Darstellungsfehler und nicht wie ein bewusstes HUD.

### `pfoertner_bubble.png`
Die Sprechblase ist hier erwartungsgemäß der erste Blickfang und damit grundsätzlich an der richtigen Stelle. Ihre schwarze, rechteckige Gestaltung wirkt jedoch eher wie ein Debug-Terminal als wie ein Element der vorgesehenen Behörden-/Papierwelt. Weil eine sichtbare Spitze oder eine andere eindeutige Verbindung zum Pförtner fehlt, muss man kurz prüfen, wer spricht. Das weiterhin stark gelbe „Finanzen / Tresor · Igor“-Schild konkurriert unnötig mit dem Gespräch. Die Textbreite ist brauchbar, aber Sprecherzeile, Textblock und Figurenanker könnten enger als Einheit organisiert sein.

### `building_etage4.png`
Zuerst fallen die helle Zeitanzeige und der Aufzug rechts auf; die aktuelle Etage 4 und der dort stehende Avatar folgen erst danach. Die aktive Etage liegt direkt unter dem oberen Bildrand und wirkt dadurch eher angeschnitten als fokussiert. Eigentlich sollte der Blick zunächst zum Avatar auf Etage 4, dann zu den drei dortigen Zielen und zuletzt zu den übrigen Stockwerken geführt werden. Die schwarzen Raumtabs bilden viele ähnlich starke Kontrastinseln, sodass keine eindeutige Hierarchie entsteht. Der kleine Tab „ETAGEN ▲▼“ sitzt zusätzlich sehr dicht zwischen Aufzug, Bildrand und HUD.

### `building_etage3.png`
Der große, helle Aufzug auf Etage 3 ist der stärkste lokale Blickfang. Der Avatar rechts daneben ist zwar sichtbar, kann wegen ähnlicher Größe und Darstellung aber leicht für einen weiteren NPC gehalten werden. Die aktive Etage sollte zuerst als zusammenhängende Zone lesbar sein; derzeit unterscheiden sie nur Figurenposition und Türzustände von den anderen Etagen. Die vielen schwarzen Beschriftungen ober- und unterhalb der Flure zerlegen den Querschnitt in unruhige Einzelstreifen. Der Bildaufbau ist horizontal stabil, aber die Spielrelevanz wird nicht entsprechend gewichtet.

### `building_etage2.png`
Hier führt die offene Tür mit der Figur in der Bildmitte den Blick vergleichsweise gut zur aktuellen Etage. Trotzdem ist nicht sofort klar, ob die Figur der Avatar, Katja oder eine Türanimation ist. Die Etagenbezeichnung links und „Feld-Operationen · Katja“ in der Mitte wirken wie zwei gleichrangige Namen für dieselbe Zone. Die aktiven Informationen sollten an einer gemeinsamen Bezugskante sitzen und als Gruppe gelesen werden. Die angeschnittenen oberen und unteren Gebäudeteile erzeugen zudem mehrere harte horizontale Kanten, die mit der eigentlichen Fokuszone konkurrieren.

### `building_etage1.png`
Zuerst fällt die Figurengruppe vor der linken Tür von Etage 1 auf, was der gewünschten Fokuszone entspricht. Innerhalb dieser Gruppe ist jedoch nicht erkennbar, welche Figur der Spieler ist und welche zum Direktor gehört. Die Raumtabs „Direktor / Zentrale · Kurator“ und „Ihr Büro“ sitzen oberhalb der Etage, aber nicht präzise genug über ihren jeweiligen Türen. Der warme Himmel zieht deutlich mehr Aufmerksamkeit als in den früheren Tagesaufnahmen und konkurriert besonders links und rechts mit den kleinen Figuren. Das gelbe Finanzschild am unteren Rand bleibt auch hier ein falscher Sekundärfokus.

### `building_keller.png`
Das gelbe Schild „Finanzen / Tresor · Igor“, der gelbe Türrahmen und die Figur im Keller bilden erstmals eine starke, zusammenhängende Fokusgruppe. Allerdings bleibt offen, ob Gelb „aktuell“, „interaktiv“, „neu“ oder lediglich „Hover“ bedeutet. Die aktive Etage liegt sehr nah am unteren Statusbalken und bekommt weniger Luft als die mittleren Stockwerke. Der Keller selbst ist trotz seines besonderen Inhalts fast genauso hell und neutral wie die übrigen Flure. Der Blick geht deshalb eher zum gelben UI-Zustand als zur räumlichen Eigenart der Geheimoperationen.

### `poster_detail.png`
`poster_detail.png` zeigt kein vergrößertes Propaganda-Plakat, sondern einen „Lagebericht – Tag 1“. Damit ist die beabsichtigte Poster-Vergrößerung auf dieser Aufnahme nicht beurteilbar. Im sichtbaren Overlay geht der Blick korrekt zum roten Titel, danach aber in die sehr dichte mittlere Spalte, während die beiden gleich breiten Außenspalten weitgehend leer bleiben. Der untere Inhalt ist am Bildrand abgeschnitten; „ÜBER NACHT“ beginnt, ohne dass der zugehörige Abschnitt sichtbar wird. Das wirkt wie ein falscher Capture-Zustand oder ein nicht an die Viewport-Höhe angepasstes Modal.

### `ambient_bubble.png`
`ambient_bubble.png` zeigt ebenfalls keine Flurfigur und keine Flavor-Sprechblase, sondern soweit erkennbar denselben Lagebericht wie `poster_detail.png`. Deshalb lässt sich weder Position, Sprecherzuordnung noch Textmenge der Ambient-Sprechblase beurteilen. Der sichtbare Zustand hat dieselbe ungleichmäßige Informationsverteilung: eine überfüllte Mitte zwischen zwei leeren, gleich breiten Papierflächen. Der schwarze Hintergrundrahmen dominiert stärker als das Papier und lässt das Overlay weniger wie eine Akte als wie ein klassisches Modal wirken. Vor jeder visuellen Feinabstimmung muss hier zunächst der richtige Spielzustand aufgenommen werden.

### `building_avatar_f.png`
Der Blick geht zunächst zur Figurengruppe vor der Direktor-Tür auf Etage 1, aber nicht eindeutig zur weiblichen Spielfigur. Helle Gesichtspixel und Kleidung helfen etwas, reichen im direkten Überlappen mit einem NPC jedoch nicht als Avatar-Kennzeichnung. Die Aufnahme zeigt die Kopplung der Figurenauswahl nur statisch; Lauf- und Idle-Konsistenz sind daraus nicht ablesbar. Wie in `building_lobby_day.png` zieht das gelbe Finanzschild den Blick fälschlich in den Keller. Die weibliche Figur müsste als Spielerzustand deutlich erkennbar sein, ohne allein über hellere Kleidung hervorgehoben zu werden.

---

## 2. **Konkrete Eingriffe je Screen**

### `building_lobby_day.png`
- `building_lobby_day.png` — Aktuelle Lobby/Spielerposition → den Etagentab „Erdgeschoss – Empfang“ auf etwa 1,25-fache Höhe bringen und mit einer schmalen papierfarbenen Aktivkante über die gesamte Lobbybreite koppeln → der Aufenthaltsort wird vor den Nebenräumen gelesen.
- `building_lobby_day.png` — Gelbes Schild „Finanzen / Tresor · Igor“ → im inaktiven Zustand auf die gleiche dunkle Tabgestaltung wie die übrigen Raumtitel zurücksetzen; Gelb nur bei tatsächlichem Fokus verwenden → derzeit führt es den Blick in die falsche Etage.
- `building_lobby_day.png` — Spieler und Pförtner → nicht deckungsgleich oder ohne Kennzeichnung aufstellen; mindestens eine halbe Figurenbreite Abstand und eine kleine Bodenmarke nur unter dem Avatar → die Rollen werden auf Anhieb unterscheidbar.
- `building_lobby_day.png` — Lobbyfläche → einen vorhandenen relevanten Figuren- oder Interaktionsanker näher an das mittlere Drittel der Lobby rücken, statt die Figur weit links in der Leerfläche stehen zu lassen → die breite Fläche erhält einen Schwerpunkt.
- `building_lobby_day.png` — Rechte Papierleiste → entweder vollständig als feste Spalte zeigen oder auf eine geschlossene Iconleiste reduzieren; nicht hinter dem rechten Viewportrand abschneiden → der aktuelle Zustand wirkt technisch defekt.

### `pfoertner_bubble.png`
- `pfoertner_bubble.png` — Sprechblase → schwarze Fläche durch eine helle Dokumentfläche mit dunkler Tintenlinie ersetzen, Sprechername als kleinen Aktenreiter darüber setzen → das Gespräch folgt der Behörden-/Papierwelt statt einem Terminal-Look.
- `pfoertner_bubble.png` — Sprecherzuordnung → eine kurze Spitze oder Verbindungslinie an der linken unteren Blasenkante direkt auf den Pförtner ausrichten → die Zuordnung muss ohne Rücklesen funktionieren.
- `pfoertner_bubble.png` — Blasenposition → näher an die Figur rücken, mit ungefähr einer halben Figurenbreite Abstand; Unterkante oberhalb der Etagentrennlinie halten → Figur und Text werden als eine Gruppe gelesen.
- `pfoertner_bubble.png` — Textblock → Sprecherzeile klar von der Aussage trennen und innen rund eine Zeilenhöhe Abstand zu allen Kanten lassen → die derzeitige kleine Beschriftung klebt optisch am Rand.
- `pfoertner_bubble.png` — Gelbes Finanzschild → während des Gesprächs entsättigen oder vollständig in den inaktiven Zustand versetzen → es konkurriert mit dem primären Dialogzustand.

### `building_etage4.png`
- `building_etage4.png` — Etage 4 → den aktiven Etagenstreifen heller als die übrigen Flure setzen oder seine obere und untere Kante mit einer dünnen Akten-Oliv-/Papierlinie markieren → die aktuelle Zone wird als Fläche statt nur über eine Figur erkannt.
- `building_etage4.png` — Avatar rechts → mit einer kleinen, konstanten Bodenmarke oder einer dezenten Papierklammer über dem Kopf kennzeichnen → er ist derzeit kaum von NPCs zu unterscheiden.
- `building_etage4.png` — Oberer Bildabschluss → oberhalb von Etage 4 mindestens eine halbe Etagenlabel-Höhe mehr Luft lassen oder den Gebäudeausschnitt entsprechend nach unten schieben → der aktive Bereich wirkt nicht mehr gequetscht.
- `building_etage4.png` — Raumtabs „Cyber-Lab“, „Operationszentrale“, „Medien-Zentrum“ → jeweils horizontal auf die Mitte der zugehörigen Tür beziehungsweise des Hotspots ausrichten und auf dieselbe Grundlinie setzen → die Zielzuordnung wird eindeutig.
- `building_etage4.png` — „ETAGEN ▲▼“ → vom oberen HUD lösen und bündig über dem Aufzug platzieren, mit mindestens einer Tabhöhe Abstand zur Zeitanzeige → Navigation und Status bilden keine zufällige Ecke.

### `building_etage3.png`
- `building_etage3.png` — Etage 3 → den linken Etagentab stärker als die Raumtabs gewichten, etwa 1,2-fache Höhe und etwas hellere Papierkante → Stockwerk und Einzelziele bekommen unterschiedliche Hierarchiestufen.
- `building_etage3.png` — Avatar am rechten Türbereich → mindestens eine Figurenbreite vom Aufzugsrahmen beziehungsweise angrenzenden NPC lösen → die Silhouetten verschmelzen derzeit optisch.
- `building_etage3.png` — „Zielgruppen-Analyse“ und „Newsroom“ → direkt über den jeweiligen Zielachsen positionieren und beide mit identischem Abstand zur Flurdecke setzen → die asymmetrische Tabverteilung wirkt aktuell zufällig.
- `building_etage3.png` — Aktive Tür → nicht nur durch Öffnung kennzeichnen; dieselbe aktive Kontur wie auf anderen Etagen verwenden → offene Tür, Anwesenheit und Auswahl sind momentan nicht als getrennte Zustände lesbar.
- `building_etage3.png` — Hintergrund-Skyline → Sättigung und Helligkeitskontrast gegenüber dem Gebäude leicht reduzieren → Aufzug und Fensterkulisse sollen nicht stärker als die Spielfigur wirken.

### `building_etage2.png`
- `building_etage2.png` — Figur in der offenen Tür → leicht vor die Türschwelle setzen und mit der einheitlichen Avatar-Markierung versehen → aktuell liest sie sich teilweise als Bestandteil der Türgrafik.
- `building_etage2.png` — Etagenbezeichnung und „Feld-Operationen · Katja“ → zu einer klaren Hierarchie zusammenführen: Etage links, Zieltab exakt über der Tür → die beiden Bezeichnungen konkurrieren nicht mehr als gleichrangige Titel.
- `building_etage2.png` — Aktive Etage → den Flur lokal um eine kleine Helligkeitsstufe anheben, die Etagen darüber und darunter leicht abdunkeln → der zentrale Bereich wird schneller erfasst, ohne das Gebäude zu verstecken.
- `building_etage2.png` — Oberer Anschnitt → Beschriftungen nicht direkt an der Schnittkante beginnen lassen; entweder den nächsten Stock vollständig zeigen oder bis unter dessen Tab schneiden → die oberste Tabreihe wirkt momentan eingeklemmt.
- `building_etage2.png` — Aufzug → dessen helle Türen im inaktiven Zustand etwas abdunkeln → der Aufzug ist kein primäres Ziel, erscheint aber als größtes helles Objekt.

### `building_etage1.png`
- `building_etage1.png` — Figurencluster vor dem Direktor → Spieler und NPC mindestens eine halbe Figurenbreite auseinanderstellen und die Spielerfigur nach vorn versetzen → die Silhouetten müssen getrennt lesbar sein.
- `building_etage1.png` — „Direktor / Zentrale · Kurator“ → Tabmitte auf die linke Türmitte ausrichten und nicht bis in den Zwischenraum zu „Ihr Büro“ reichen lassen → die Türzuordnung ist derzeit unscharf.
- `building_etage1.png` — „Ihr Büro“ → exakt über der mittleren Tür zentrieren und dieselbe Höhe wie den Direktor-Tab verwenden → beide Ziele bilden eine saubere Navigationsreihe.
- `building_etage1.png` — Abendhimmel → orange Leuchtkraft gegenüber den Innenräumen reduzieren, besonders an den seitlichen Gebäudekanten → der Hintergrund konkurriert mit den kleinen Figuren.
- `building_etage1.png` — Gelber Keller-Tab → inaktiv darstellen, solange Etage 1 aktiv ist → die Farbcodierung widerspricht dem aktuellen Aufenthaltsort.

### `building_keller.png`
- `building_keller.png` — Kellerzone → mehr vertikalen Abstand zum unteren Sendungsbalken schaffen, mindestens in Höhe des Etagentabs → aktive Tür und Avatar wirken sonst an den Bildschirmrand gedrückt.
- `building_keller.png` — Gelber Türrahmen und gelber Tab → auf eine einzige Hervorhebung reduzieren; bevorzugt Tab gelb beziehungsweise ocker, Tür nur mit dünner Kontur → die doppelte Markierung ist lauter als nötig.
- `building_keller.png` — Statussemantik → neben dem Tab ein kleines, wiederkehrendes Zustandswort oder Symbol für „aktuell“ beziehungsweise „interaktiv“ verwenden → Gelb allein erklärt seinen Zustand nicht.
- `building_keller.png` — Kellerlicht → Flur etwas kühler und dunkler als Etage 1 halten, Cyan nur an Technikdetails konzentrieren → die Geheimoperationszone erhält eine eigene räumliche Identität.
- `building_keller.png` — Avatar und zweite Figur links → ausreichend Abstand halten und die Avatar-Markierung konsequent einsetzen → beide Figuren haben ähnliche Größe und Tonwerte.

### `poster_detail.png`
- `poster_detail.png` — Gezeigter Zustand → Capture beziehungsweise Routing korrigieren und tatsächlich das vergrößerte Propaganda-Plakat zeigen → der benannte Screen ist derzeit nicht prüfbar.
- `poster_detail.png` — Sichtbares Lagebericht-Modal → vollständig innerhalb der Viewport-Höhe halten oder einen klar sichtbaren internen Scrollbereich mit abgeschnittener Fortsetzung markieren → der Abschnitt „ÜBER NACHT“ wird unten angeschnitten.
- `poster_detail.png` — Drei Spalten → mittlere Spalte auf ungefähr 1,3-fache Breite der Außenspalten bringen, Außenfelder entsprechend schmaler setzen → Inhalt und verfügbare Fläche stehen derzeit in keinem Verhältnis.
- `poster_detail.png` — Modalrahmen → schwarzen Außenraum reduzieren und das Papier näher an einen Aktenordner beziehungsweise eine Dokumentablage binden → die Papierwelt soll den Großteil des sichtbaren Overlays tragen.
- `poster_detail.png` — Schließen/Zurück → einen sichtbar verankerten Abschluss oben rechts am Dokument vorsehen beziehungsweise im korrekten Capture zeigen → im sichtbaren Zustand ist kein eindeutiger Ausstieg erkennbar.

### `ambient_bubble.png`
- `ambient_bubble.png` — Gezeigter Zustand → den korrekten Flurzustand mit Statist und geöffneter Flavor-Sprechblase aufnehmen → die eigentliche UX-Frage ist auf diesem Bild nicht vorhanden.
- `ambient_bubble.png` — Capture-Abgrenzung → sicherstellen, dass `ambient_bubble.png` nicht denselben Modalzustand wie `poster_detail.png` exportiert → zwei identische Aufnahmen verhindern Zustandsvergleich und Review.
- `ambient_bubble.png` — Künftige Flavor-Blase → gegenüber der Pförtnerblase kleiner und visuell sekundärer halten, maximal zwei bis drei kurze Zeilen → Ambient-Text darf den Navigationsfokus nicht übernehmen.
- `ambient_bubble.png` — Künftige Platzierung → vollständig innerhalb der jeweiligen Etage halten und weder Raumtabs noch Avatar überdecken → die Etagenstruktur muss auch während Flavor-Text lesbar bleiben.

### `building_avatar_f.png`
- `building_avatar_f.png` — Weiblicher Avatar → aus der Überlagerung mit den beiden Figuren vor der Direktor-Tür lösen, mindestens eine halbe Figurenbreite Abstand → die Sprite-Kopplung ist sonst visuell nicht überprüfbar.
- `building_avatar_f.png` — Avatar-Kennzeichnung → dieselbe kleine Bodenmarke wie bei allen anderen Avatarvarianten verwenden, nicht die Erkennbarkeit an helle Kleidung koppeln → Geschlecht und Outfit verändern dann nicht die Bedienbarkeit.
- `building_avatar_f.png` — Figurenmaßstab → weiblichen Avatar an Kopf-, Fuß- und Augenlinie der übrigen erwachsenen Figuren prüfen und auf dieselbe Standhöhe setzen → geringe Größenabweichungen fallen im Querschnitt stark auf.
- `building_avatar_f.png` — Keller-Finanzschild → in den inaktiven Zustand zurücksetzen → es lenkt vom eigentlichen Zweck der Aufnahme, der weiblichen Figur, weg.
- `building_avatar_f.png` — Aufnahmezustand → für die Assetprüfung eine Position mit freiem Hintergrund und zusätzlich je einen sichtbaren Idle- und Lauf-Frame zeigen → die aktuelle Gruppierung verdeckt Silhouette und Animationsanschlüsse.

---

## 3. **Grafiken/Assets**

### Tragende Assets
- Die Gebäudegrafik in `building_lobby_day.png` bis `building_keller.png` trägt den Querschnitt: harte Geschosskanten, gepflegte Beton- und Glasflächen sowie die feine Pixelauflösung entsprechen weitgehend dem Anker aus `sprite-tool/public/context/game-style-guide.md`.
- Aufzüge, Türen, Leuchten und Wandmodule teilen eine konsistente Perspektive und Kantenschärfe. Besonders die Glaslobby in `building_lobby_day.png` und die technische Schachtzone rechts geben dem Gebäude räumliche Tiefe.
- Die Tageszeitvarianten in `building_etage1.png` und `building_keller.png` machen den Zeitfortschritt sichtbar, ohne die Innenräume vollständig umzufärben.

### Fremd oder stilistisch abweichend
- Die schwarze Sprechblase in `pfoertner_bubble.png` widerspricht der Festlegung aus `desinformation-network/src/story-mode/theme.ts`, dass die Bedienung aus Papier bestehen soll. Sie wirkt wie eine Konsolenbox und nicht wie eine Notiz, Akte oder Behördenannotation.
- Auch die schwarzen Raumtabs sind funktional, aber eher klassische Pixelspiel-Schilder als Papierregister. Papierfarbene Tabs mit dunkler Tinte und sparsamem Rot beziehungsweise Blau würden die Welt stärker mit der Oberfläche verbinden.
- Der Hintergrund in mehreren Gebäudescreens ist deutlich blauer und stellenweise pastelliger als die kühle, entsättigte Kernpalette aus `sprite-tool/public/context/game-style-guide.md`. Vor allem die violett-blauen Silhouetten seitlich des Gebäudes sind groß genug, um mit den Innenräumen zu konkurrieren.
- Der untere Sendungsbalken ist fast rein schwarz und visuell härter als der Kraftpapier-Träger `background: '#2E2820'` aus `desinformation-network/src/story-mode/theme.ts`.

### Skalierung und Zuschnitt
- Figuren haben nicht durchgehend dieselbe wahrgenommene Größe: Der Pförtner in `building_lobby_day.png` wirkt massiger als mehrere Bürofiguren, während eng überlagerte Charaktere auf Etage 1 zu einer einzigen Silhouette verschmelzen.
- `building_etage4.png` drückt die relevante Etage direkt an den oberen Rand; `building_keller.png` drückt sie an den unteren Statusbalken. Die Randetagen bekommen damit weniger visuelles Gewicht als die mittleren Stockwerke.
- Die rechte Papiernavigation ist in allen Gebäudescreens nur als sehr schmale Restspalte sichtbar. Das wirkt nicht wie absichtlicher Zuschnitt, sondern wie eine zu breite Gesamtoberfläche.
- Der rechte Button des unteren Balkens ist ebenfalls angeschnitten; die Beschriftung beginnt mit „PUBLIKUM…“, endet aber außerhalb der sichtbaren Fläche.

### Fehlende oder falsche Assets
- In `poster_detail.png` fehlt das namensgebende Plakat vollständig. Damit sind Vergrößerung, Filterung, Pixelkantenschärfe und Zuschnitt des Posters nicht beurteilbar.
- In `ambient_bubble.png` fehlen sowohl Flurstatist als auch Sprechblase. Die Aufnahme scheint ein Duplikat des falschen Zustands von `poster_detail.png` zu sein.
- Am meisten fehlt in den Gebäudeansichten eine konsistente, kleine Avatar-Markierung. Sie sollte nicht dekorativ groß sein, sondern nur Spieler und NPC zuverlässig auseinanderhalten.
- Für die Raumtabs fehlt ein einheitlicher visueller Unterschied zwischen Etage, Raum, aktivem Ziel und Hover. Gegenwärtig übernehmen ähnliche schwarze beziehungsweise gelbe Rechtecke mehrere Rollen.

---

## 4. **Raster & Rhythmus**

Die Gebäudegeschosse bilden ein starkes horizontales Grundraster, aber die Beschriftungen halten sich nicht konsequent daran. Etagenlabels sitzen links innerhalb der Flure, Raumtabs dagegen teils auf der Geschosskante, teils mittig über Türen und teils weit über dem tatsächlichen Ziel. Ein belastbares Raster wäre: Etagenname immer an derselben linken Innenkante, Raumtabs immer mit ihrer Mitte auf der Tür- oder Hotspotachse und alle Raumtabs einer Etage auf derselben vertikalen Grundlinie.

Die Bildfläche ist asymmetrisch aufgeteilt: links und rechts stehen große Skylinebereiche, während rechts zusätzlich eine abgeschnittene Papierleiste in den Viewport ragt. Entweder muss die Gebäudefläche zwischen einer vollständigen HUD-Spalte und dem linken Rand zentriert werden, oder die rechte Navigation muss als kompakte, vollständig sichtbare Leiste über dem Spielbild liegen. Der derzeitige Zwischenzustand lässt die Gebäudekante willkürlich erscheinen.

In `building_lobby_day.png` und `pfoertner_bubble.png` entsteht tote Fläche auf dem Lobbyboden, während mehrere Figuren auf Etage 1 eng übereinanderstehen. Figuren sollten entlang des horizontalen Flurrasters verteilt werden: Interaktionsfiguren nahe ihrem Ziel, Ambient-Figuren deutlich davon getrennt. Das beseitigt gleichzeitig Leere und Silhouettenkollisionen.

Der Wechsel des aktiven Stockwerks erzeugt keinen stabilen Kamerarhythmus. Mittlere Etagen liegen gut im Bildzentrum, Etage 4 und Keller dagegen an den Rändern. Wenn Randetagen nicht zentriert werden können, brauchen sie stärkere Flächen- oder Tabmarkierungen, damit der Fokusverlust ausgeglichen wird.

Im sichtbaren Lagebericht von `poster_detail.png` und `ambient_bubble.png` sind drei gleich breite Spalten formal sauber, aber inhaltlich falsch gewichtet. Die mittlere Liste benötigt mehr Breite, während linke und rechte Spalte große ungenutzte Papierflächen enthalten. Unterhalb der Spalten folgt ein breiter KPI-Block, dessen Außenkanten sauber passen; der darunter angeschnittene Abschnitt bricht diesen Rhythmus jedoch abrupt.

---

## 5. **Lesbarkeit**

- In allen Gebäudescreens musste ich bei den kleinen Etagenlabels zweimal hinsehen, besonders bei „Etage 4 – Spezial-Operationen“ und „Keller – Geheimoperationen“. Die Schrift ist kontrastreich, aber innerhalb der großen Szene zu klein und zu ähnlich zu den Raumtabs.
- Die weißen Raumtabs auf Schwarz sind grundsätzlich lesbar, erzeugen aber zu viele gleichrangige Kontrastpunkte. Etage, Raumname und Personenname verwenden nahezu dieselbe typografische Behandlung.
- Der gelbe Zustand von „Finanzen / Tresor · Igor“ ist auffällig, aber semantisch unklar. Dasselbe Gelb könnte Auswahl, aktive Tür, Quest, Hover oder neuen Inhalt bedeuten; die Screens zeigen keinen eindeutigen Unterschied.
- Offene Türen werden ebenfalls als Zustandsanzeige verwendet, doch eine offene Tür sagt nicht sicher, ob der Avatar dort steht, ein NPC herauskommt oder der Raum betreten werden kann.
- Die weibliche Spielfigur in `building_avatar_f.png` und die Spielerfiguren in `building_etage1.png` sowie `building_etage3.png` sind zwischen NPCs nicht zuverlässig erkennbar.
- Die Uhrzeit oben rechts ist gut lesbar, während die Buchstaben „K / M / A / K / I“ in der rechten Leiste ohne sichtbare Bedeutungslabels kaum interpretierbar sind. Das hervorgehobene „A“ hat außerdem wieder eine gelbliche Zustandsfarbe, deren Bedeutung nicht erklärt wird.
- Der Text im unteren Sendungsbalken ist im Verhältnis zur Bildschirmbreite zu klein. Der lange Satz wird zu einer dünnen Textlinie, und der rechte Button ist abgeschnitten.
- In `pfoertner_bubble.png` ist der Fließtext lesbar, aber die Sprecherzeile „PFÖRTNER“ zu klein und zu schwach vom Dialog getrennt.
- Im Lagebericht von `poster_detail.png` und `ambient_bubble.png` sind die Milieunamen lesbar, doch Statuswörter wie „ruhig“ und „misstrauisch“ sitzen sehr dicht am rechten Rand der Mittelspalte. Die schmalen roten Marker darunter sind so klein, dass ihr quantitativer Wert kaum abzulesen ist.
- `poster_detail.png` und `ambient_bubble.png` erlauben keine Beurteilung der vorgesehenen Zustände, weil die angekündigten Inhalte nicht sichtbar sind.

---

## 6. **Die drei wirksamsten Änderungen**

1. **Aktiven Avatar und aktuelles Stockwerk in allen Gebäudeansichten einheitlich markieren** — eine kleine Avatar-Bodenmarke plus stärkerer Etagentab löst über acht Screens hinweg das größte Orientierungsproblem bei geringem Eingriff in die Pixelgrafik.

2. **Rechte HUD-Spalte und unteren Balken vollständig in ein festes Viewport-Raster bringen** — das beseitigt die sichtbar abgeschnittene Navigation und den gekappten „PUBLIKUM…“-Button und lässt die Oberfläche sofort weniger unfertig wirken.

3. **Schwarze Raumtabs und Sprechblasen in ein hierarchisches Papierregister-System überführen** — getrennte Stile für Etage, Raum, aktiv und Dialog verbinden die Betonwelt mit den verbindlichen Papier-Tokens aus `desinformation-network/src/story-mode/theme.ts` und reduzieren zugleich die vielen gleich starken Kontrastinseln.

---

## 7. **Blinde Flecken**

- `poster_detail.png` zeigt kein Poster; benötigt wird ein Screenshot des tatsächlichen Detail-Overlays inklusive Ausgangszustand, Vergrößerung und Schließen-Steuerung.
- `ambient_bubble.png` zeigt keine Ambient-Sprechblase; benötigt wird der Flurzustand mit sichtbarer Figur, Blase und umliegenden Raumtabs.
- Aus den Standbildern ist nicht erkennbar, ob Gelb Hover, Fokus, Auswahl, Quest oder Zugänglichkeit bedeutet. Dafür wären je ein Grund-, Hover-, Tastaturfokus- und Aktivzustand derselben Tür nötig.
- Die Kamerabewegung zwischen Etagen ist nicht sichtbar. Benötigt werden Zwischenframes oder ein kurzer Ablauf, um Sprünge, Nachführung und Randbegrenzung zu prüfen.
- Die Lauf-/Idle-Sheet-Kopplung in `building_avatar_f.png` lässt sich statisch nicht beurteilen. Nötig sind mindestens Front-/Seiten-Idle sowie zwei aufeinanderfolgende Lauf-Frames vor freiem Hintergrund.
- Nicht erkennbar ist, ob Sprechblasen bei Bewegung folgen, an Bildschirmrändern umklappen oder andere Figuren und Tabs verdecken.
- Die Lesbarkeit bei kleinerer Auflösung beziehungsweise Browser-Skalierung ist offen; besonders Etagenlabels, rechter Shortcut-Streifen und unterer Sendungstext benötigen entsprechende Vergleichsaufnahmen.
- Tastaturfokus, Maus-Hover, gesperrte Räume, neue Inhalte und bereits besuchte Ziele sind in diesem Bündel nicht als getrennte Zustände sichtbar.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
