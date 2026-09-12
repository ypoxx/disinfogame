# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „intro"

**Modell:** `gpt-5.6-sol` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-22
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-22T17:19:07.670Z · **Dauer:** 197.5 s
**Nutzung:** nicht gemeldet · **Kosten:** unbekannt · **Anbieter-Datensammlung:** ausgeschlossen (deny)

> ⚠️ **Wie das zu lesen ist:** Ein *fremdes* Modell hat einen **kuratierten Ausschnitt**
> des Projekts gesehen — nicht das laufende Spiel und nicht das ganze Repository. Es kann
> daher weder Laufzeitverhalten prüfen noch `file:line`-Belege verifizieren. Befunde sind
> **Hypothesen**, die vor dem Umsetzen am Code/an den Daten gegenzuprüfen sind. Die
> kanonische Wahrheit bleibt [`docs/VISION_LOCK.md`](../VISION_LOCK.md) bzw. die Spieldaten.

## Gestellte Frage

Sieh dir die beigefügten Screenshots des laufenden Spiels an und mache einen UX/UI-Durchgang. Die Optik soll eine Behörden-/Papierwelt sein (Stil-Anker und Farbtoken liegen bei). Sag mir: Wo führt das Bild den Blick falsch, welche Grafiken sitzen an der falschen Stelle oder in der falschen Größe, wo stimmen Abstände und Ausrichtung nicht, und welche drei Änderungen bringen am meisten? Sei so konkret, dass man es direkt umsetzen kann.

## Dieser Durchgang: Bündel „intro" (6 Screenshots)

Das siehst du, in dieser Reihenfolge:
- title.png — Titelbildschirm (Menü, Gebäude-Key-Art, Version)
- avatar_choice.png — Personalakte / Avatar-Wahl (Grundzustand)
- avatar_choice_m2.png — Avatar-Wahl: Porträt m2 gewählt, Deckname eingetragen
- arrival_early.png — Ankunfts-Sequenz kurz nach Start (Lobby, Avatar läuft)
- arrival_mid.png — Ankunfts-Sequenz Mitte (Fahrstuhl/Etagen)
- vergabe_akte.png — Vergabe-Szene: EINE Akte „Die Wahl" der Zentrale

Beurteile **nur diese** Aufnahmen, dafür gründlich. Andere Teile des Spiels kommen in
eigenen Durchgängen dran — verweise nicht auf Dinge, die du hier nicht siehst.

## Gezeigter Ausschnitt

15.047 Zeichen ≈ 4.180 Tokens (geschätzt) aus 3 Quellen · 1 gekürzt

| Quelle | Modus | Zeichen | Status |
|---|---|---:|---|
| `sprite-tool/public/context/game-style-guide.md` | voll | 5.496 | vollständig |
| `desinformation-network/src/story-mode/theme.ts` | voll | 3.375 | vollständig |
| `desinformation-network/runs/visual-review/latest/manifest.json` | projektion | 6.176 | gekürzt |

### Gezeigtes Anschauungsmaterial (6 Screenshot(s))

| Art | Im Text genannt als | Datei | Größe |
|---|---|---|---:|
| 🖼 Bild | `title.png` | `desinformation-network/runs/visual-review/latest/shots/title.png` | 1030 kB |
| 🖼 Bild | `avatar_choice.png` | `desinformation-network/runs/visual-review/latest/shots/avatar_choice.png` | 316 kB |
| 🖼 Bild | `avatar_choice_m2.png` | `desinformation-network/runs/visual-review/latest/shots/avatar_choice_m2.png` | 315 kB |
| 🖼 Bild | `arrival_early.png` | `desinformation-network/runs/visual-review/latest/shots/arrival_early.png` | 577 kB |
| 🖼 Bild | `arrival_mid.png` | `desinformation-network/runs/visual-review/latest/shots/arrival_mid.png` | 585 kB |
| 🖼 Bild | `vergabe_akte.png` | `desinformation-network/runs/visual-review/latest/shots/vergabe_akte.png` | 33 kB |

---

## Antwort des Modells

## 1. **Erster Eindruck**

### `title.png`
Das Auge springt zuerst zwischen dem roten Hexagon, dem gelben Titel und der großen roten Schaltfläche rechts; es gibt keinen eindeutigen ersten Fokus. Zuerst sollte der Titel gelesen werden, danach Untertitel und Primäraktion in einer gemeinsamen Mittelachse. Die nach rechts versetzte Schaltfläche bricht diese Reihenfolge und wirkt wie ein fremdes Werbebanner über dem Gebäude. Die drei kleinteiligen Informationszonen am unteren Rand konkurrieren miteinander, obwohl sie klar nachrangig sein müssten. Die schwarzen Seitenstreifen und das fast schwarze untere Bilddrittel lassen das Key-Art außerdem wie ein zu klein eingepasstes Bild statt wie einen vollflächigen Titelhintergrund erscheinen.

### `avatar_choice.png`
Zuerst fällt das rote Kopfband auf, danach das Porträtraster; diese Reihenfolge ist grundsätzlich richtig. Der vermeintlich ausgewählte obere Mittelplatz ist jedoch nur an einem dünnen gelben Rand und einem gelben Wort zu erkennen, weshalb der Zustand nicht sicher lesbar ist. Die Porträts haben stark unterschiedliche Kopfgrößen und Ausschnitte, wodurch einzelne Figuren wichtiger wirken als andere. Eingabefeld und Schaltfläche sind sauber an der Rasterbreite ausgerichtet, aber die sehr kleine Beschriftung „NAME“ verliert sich zwischen Raster und Feld. Problematisch ist vor allem, dass „MISSION BEGINNEN“ trotz leerem Namen bereits wie eine vollständig aktive Aktion aussieht.

### `avatar_choice_m2.png`
Der Blick landet erneut zuerst beim roten Kopfband und im Porträtraster, nicht beim ausgefüllten Namen oder beim gewählten Porträt. Der schwarze Rahmen des Eingabefelds ist visuell stärker als der Auswahlrahmen des Porträts, obwohl die Porträtwahl die wichtigere Entscheidung ist. Zwischen `avatar_choice.png` und `avatar_choice_m2.png` verändert sich die Primäraktion optisch nicht; der Fortschritt der Eingabe wird daher nicht bestätigt. Das gewählte Porträt oben in der Mitte ist zudem deutlich kleiner kadriert als mehrere Alternativen und wirkt dadurch weniger präsent. Idealerweise sollten ausgewähltes Porträt, bestätigter Deckname und nun aktive Aktion als klarer Dreischritt lesbar sein.

### `arrival_early.png`
Der gelbe Streifen „Direktor / Zentrale · Kurator“ ist der erste Blickfang, nicht die laufende Spielfigur. Für eine Ankunftssequenz sollte dagegen die Bewegung des Avatars beziehungsweise sein Weg durch das Gebäude zuerst lesbar sein. Weil fünf Ebenen gleichzeitig gezeigt werden, ist die Figur nur ein sehr kleiner Bestandteil eines detailreichen Querschnitts. Die schwarzen Etagen- und Raumbezeichnungen liegen teils auf architektonischen Trennlinien und sind nicht eindeutig einer Raumfläche zugeordnet. Im Lobbybereich verschmelzen außerdem die eng nebeneinanderstehenden Figuren zu einer schwer lesbaren Silhouette.

### `arrival_mid.png`
Auch hier dominiert der gelbe Zentrale-Streifen, gefolgt vom großen Fahrstuhl rechts; die eigentliche Figurenbewegung bleibt dritter Fokus. Der Avatar beziehungsweise die für die Bewegung relevante Figur ist ohne Marker kaum von den übrigen Personen zu unterscheiden. Die oben laufende Figur sitzt sehr dicht am schwarzen Bildrand und wirkt dadurch beinahe angeschnitten. Der Fahrstuhl ist groß genug, aber seine aktuelle Position und sein Bezug zur Figur werden nicht deutlich miteinander verbunden. Die Szene vermittelt das Gebäude gut, aber den zeitlichen Fortschritt der Ankunft nur schwach.

### `vergabe_akte.png`
Das Auge wird zuerst von der roten Schaltfläche angezogen, danach von der Akte; für eine Vergabeszene müsste die Akte selbst unmissverständlich dominieren. Der gesamte Inhaltsblock ist für eine einzige, zentrale Mission zu klein und von sehr viel nahezu schwarzer Leerfläche umgeben. Bühnenanweisung, Zitat, Akte und Schaltfläche bilden zwar eine vertikale Achse, springen aber stark in der Breite. Innerhalb der Akte sind Titel und roter Geheimhaltungsvermerk lesbar, während Beschreibung, Zielwerte und Fußzeile bereits zweimaliges Hinsehen verlangen. Die Karte wirkt eher wie ein kleines UI-Panel, nicht wie ein physisch über den Tisch geschobenes Behörden-Dokument.

---

## 2. **Konkrete Eingriffe je Screen**

### `title.png`

- *Primärschaltfläche → direkt unter Untertitel und Titel zentrieren; ihre Breite auf ungefähr ein Drittel der Key-Art-Breite begrenzen → Titel, Untertitel und Einstieg werden als eine klare vertikale Handlungskette gelesen.*
- *Primärschaltfläche → rote Vollfläche durch helle Papierfläche mit rotem Doppelrand und roter Stempelschrift ersetzen → die sichtbare Umsetzung entspricht dann der in `desinformation-network/src/story-mode/theme.ts` festgelegten Stempel-CTA statt einer roten Werbefläche.*
- *Gebäude-Key-Art → horizontal auf die volle Bildschirmbreite erweitern oder die seitlichen Flächen mit fortgesetztem Himmel füllen → die schwarzen Seitenstreifen wirken derzeit wie unbeabsichtigtes Letterboxing.*
- *TON-Hinweis, Bildungszweck und Version → nicht übereinander in der unteren Mitte stapeln; Bildungszweck unter die CTA, Ton-Hinweis links unten und Version rechts unten anordnen → drei Informationsklassen erhalten getrennte, stabile Bezugskanten.*
- *Rotes Hexagon → etwa ein Fünftel verkleinern und näher an den Titel setzen → es bleibt Markenzeichen, konkurriert aber weniger als eigenständiger Hauptfokus.*

### `avatar_choice.png`

- *Ausgewähltes Porträt oben Mitte → Auswahlrahmen deutlich kräftiger als die normalen Kartenrahmen ausführen und einen kleinen „AUSGEWÄHLT“-Stempel innerhalb der Karte ergänzen → der Zustand ist nicht mehr nur über eine dünne gelbe Linie erkennbar.*
- *Porträt-Ausschnitte → Augenlinien auf derselben Höhe und Köpfe ungefähr gleich groß kadrieren; besonders das obere mittlere Porträt enger beschneiden → die Wahlmöglichkeiten erhalten gleiches visuelles Gewicht.*
- *Altersbezeichnungen → alle sechs auf einem gleich hohen, durchgehenden Fußstreifen platzieren und die Schrift gegenüber dem jetzigen Zustand leicht vergrößern → die Labels verschwinden derzeit in den dunklen Bildpartien.*
- *Leeres Namensfeld und CTA → CTA bis zu einer gültigen Eingabe mit matter Tinte, reduziertem Randkontrast und ohne Pfeil darstellen → der Grundzustand wird eindeutig von „bereit zum Start“ getrennt.*
- *Beschriftung „NAME“ → näher an das Eingabefeld rücken und auf dessen linke Innenkante ausrichten → die große Lücke zum Raster und die winzige Schrift lassen das Label momentan unverbunden wirken.*

### `avatar_choice_m2.png`

- *Gewähltes Porträt oben Mitte → enger auf Kopf und Schultern zuschneiden und visuell stärker markieren als den fokussierten Eingaberahmen → momentan wirkt das Textfeld bestätigter als die eigentliche Avatarwahl.*
- *Ausgefülltes Namensfeld → nach gültiger Eingabe einen zurückhaltenden Tinten- oder Häkchenzustand an der rechten Feldkante zeigen → der abgeschlossene Schritt wird sichtbar bestätigt.*
- *CTA „MISSION BEGINNEN“ → im ausgefüllten Zustand klar in die rote Stempeloptik wechseln, während sie in `avatar_choice.png` neutral bleibt → die beiden Zustände unterscheiden sich dann ohne Vergleichsscreenshot.*
- *Auswahlrahmen und Eingabefokus → unterschiedliche Farben verwenden, etwa Ministeriums-Rot für die bestätigte Auswahl und Tintenblau für den aktuellen Texteingabefokus → zwei verschiedene Zustände werden nicht länger mit ähnlich dünnen Konturen kommuniziert.*
- *Vertikaler Abstand zwischen Namensfeld und CTA → leicht reduzieren, auf ungefähr die Hälfte des Abstands zwischen Porträtraster und „NAME“ → Name und Startaktion erscheinen als zusammengehöriger Abschlussblock.*

### `arrival_early.png`

- *Kameraausschnitt → in dieser Phase Lobby und Etage 1 auf etwa zwei Drittel der Bildhöhe vergrößern; obere Etagen und Keller nur angeschnitten als Kontext stehen lassen → die laufenden Figuren werden lesbar, ohne das Gebäudeprinzip zu verlieren.*
- *Spielfigur → einen kleinen, kontrastierenden Marker direkt über dem Kopf platzieren, nicht breiter als etwa die halbe Figur → der Spieler kann den Avatar trotz gleichartig gekleideter NPCs sofort verfolgen.*
- *Gelber Zentrale-Streifen → entsättigen oder erst dann gelb aktivieren, wenn diese Etage tatsächlich das aktuelle Ziel ist → momentan zieht ein Zielhinweis die Aufmerksamkeit vorzeitig von der Ankunft im Erdgeschoss ab.*
- *Etagenlabels → links in jedem Geschoss an derselben vertikalen und horizontalen Bezugskante innerhalb der Raumfläche platzieren, nicht auf den Trägern zwischen den Geschossen → die Zuordnung zu den Etagen wird eindeutig.*
- *Zwei Figuren in der Lobby → mindestens eine Figurenbreite auseinander staffeln oder zeitlich versetzt auftreten lassen → ihre Silhouetten und Beine verschmelzen im aktuellen Frame.*

### `arrival_mid.png`

- *Kamera → den Ausschnitt der Fahrstuhlbewegung nachführen und nur die drei aktuell relevanten Ebenen zeigen → die Fahrt wird zum Ereignis statt zu einer kleinen Bewegung in einem Gesamtplan.*
- *Fahrstuhlkabine → aktuelle Kabine durch etwas helleres Innenlicht hervorheben und die übrigen Schachtsegmente abdunkeln → Position und Bewegungszustand sind schneller erfassbar.*
- *Spielfigur beziehungsweise relevante Figur → denselben Marker wie in `arrival_early.png` konsistent weiterführen → aktuell ist nicht eindeutig, welche der mehreren Figuren verfolgt werden soll.*
- *Obere Figur → mehr Abstand zum oberen schwarzen Rand geben oder den oberen Ausschnitt um etwa eine halbe Figurenhöhe erweitern → sie wirkt momentan an die Bildkante gedrückt.*
- *Raum- und Etagenlabels → sekundäre Raumlabels innerhalb der jeweiligen Geschossfläche anordnen; „Finanzen / Tresor · Igor“ nicht auf den unteren Gebäudetrenner setzen → die Beschriftung wirkt derzeit von ihrem Raum abgekoppelt.*
- *„ÜBERSPRINGEN“ → an die rechte Kante des eigentlichen Szenenrahmens statt in die freie Skyline setzen und den Randkontrast leicht erhöhen → die Funktion bleibt nachrangig, wirkt aber nicht mehr losgelöst.*

### `vergabe_akte.png`

- *Akte → auf etwa das 1,3-Fache vergrößern, sodass sie ungefähr ein gutes Drittel der Bildschirmbreite einnimmt → die einzige Mission erhält das notwendige visuelle Gewicht und die Kleinschrift wird lesbar.*
- *Zitat und Bühnenanweisung → auf dieselbe Breite wie die vergrößerte Akte begrenzen und links an deren Textkante ausrichten → der Block springt derzeit zwischen breitem Zitat und schmaler Karte.*
- *CTA → rote Vollfläche durch eine Papier-Stempel-Schaltfläche ersetzen und auf der Mittelachse der Akte halten → die Aktion ordnet sich dem Dokument unter und entspricht `desinformation-network/src/story-mode/theme.ts`.*
- *Akte-Hintergrund → hinter der Karte eine dunkle, flache Tischfläche oder einen einzelnen Aktenfolder mit sichtbarer Registerkante ergänzen → das Dokument schwebt momentan im schwarzen Raum statt „über den Tisch“ geschoben zu werden.*
- *Fortschrittsleiste → Höhe und Marker leicht verstärken, Zielmarker klar oberhalb oder innerhalb der Leiste setzen und Start-/Zieltexte exakt an deren Enden ausrichten → aktuelle Werte und Schwelle sind nur mit genauer Suche zuzuordnen.*
- *Vertikaler Abstand zwischen Akte und CTA → etwas verringern, während der Abstand zwischen Zitat und Akte größer bleibt → Dokument und Übernahmeaktion bilden dann eine Gruppe, das Zitat bleibt der vorgelagerte Erzählschritt.*

---

## 3. **Grafiken/Assets**

- **`title.png`:** Das Gebäude-Key-Art trägt die Szene durch seine feine Kantenschärfe, beleuchteten Fenster und die klare brutalistische Silhouette. Es ist jedoch deutlich dunkler und leerer als der in `sprite-tool/public/context/game-style-guide.md` formulierte heutige, gepflegte und nicht dunkel-leere Behördenlook. Der untere Gebäudeteil versinkt fast vollständig, während Antenne und rote Warnlichter stark herausstehen; den Fassaden im unteren Drittel fehlt ein zurückhaltendes Umgebungslicht. Das flache rote Hexagon wirkt durch seine glatte, texturlose Fläche wie ein Vektorlogo auf Pixel-Art und sollte entweder pixelig konturiert oder als Stempel-/Plakettenmotiv behandelt werden.

- **`avatar_choice.png` und `avatar_choice_m2.png`:** Die Porträts passen in Detailgrad, Farbtemperatur und harter Pixelkante gut zusammen, sind aber nicht einheitlich art-directed. Das obere linke Porträt zeigt einen deutlich größeren Kopf als das obere mittlere; mehrere Figuren sind als Brustbild, andere fast als Halbfigur angelegt. Einheitliche Augenlinie, Kopfgröße und Schulterbreite würden die Wahl neutraler machen. Die Hintergründe sind ausreichend ruhig, könnten aber jeweils etwas stärker abgedunkelt werden, damit Gesichter und Auswahlrahmen vor der Raumarchitektur stehen.

- **`arrival_early.png` und `arrival_mid.png`:** Der Gebäudeschnitt ist das stärkste Asset des Bündels: Materialwechsel, Türen, Leuchten und Schacht sind präzise lesbar. Die Skyline verwendet dagegen gröbere Formen und deutlich pastelligere Blau-/Violettwerte als das Gebäude; dadurch wirkt sie wie eine andere Pixel-Art-Auflösung. Sättigung und Helligkeit der Skyline sollten reduziert und die Kantendetails leicht verfeinert oder atmosphärisch weich zurückgenommen werden. Die groben Erd- und Felsformen neben dem Keller ziehen durch ihre großen Pixelblöcke unnötig Aufmerksamkeit auf sich.

- **`vergabe_akte.png`:** Das Dokument selbst ist funktional, aber als Asset zu flach: kaum Materialkante, keine Registerlasche, keine Faltung, kein Schattenwurf und kein räumlicher Träger. Am meisten fehlt direkt hinter der Akte eine zurückhaltende Tisch- oder Folderfläche, die das Motiv „eine Akte wird über den Tisch geschoben“ sichtbar macht. Dabei sollte keine zweite Akte entstehen; ein einzelner größerer Folder mit Registerkante reicht. Die Hintergrundfarbe wirkt nahezu schwarz statt wie das in `desinformation-network/src/story-mode/theme.ts` definierte dunkle Kraftpapierbraun.

---

## 4. **Raster & Rhythmus**

- **`title.png`:** Es existieren drei konkurrierende Achsen: Titel mittig, CTA weit rechts und Pflichtinformationen wieder mittig. Alle handlungsrelevanten Elemente sollten eine zentrale Spalte bilden, deren Breite sich am Bildungszweck-Kasten orientiert. Version und Tonsteuerung gehören aus dieser Spalte heraus an gegenüberliegende untere Ecken. Die seitlichen schwarzen Streifen erzeugen tote Fläche, ohne als bewusster Rahmen gestaltet zu sein.

- **`avatar_choice.png` und `avatar_choice_m2.png`:** Das dreispaltige Raster ist sauber und Eingabefeld sowie CTA folgen seinen Außenkanten. Unruhig wird der Rhythmus unterhalb des Rasters: viel Abstand bis zum sehr kleinen Label, dann ein enger Label-Feld-Abstand, danach wieder ein großer Sprung zur CTA. Diese Zone sollte als eigener Abschlussblock behandelt werden: Label dicht am Feld, Feld und CTA mit einem einheitlichen mittleren Abstand. Der rote Kopfbereich könnte außerdem exakt dieselben Innenkanten wie das Porträtraster aufnehmen, statt lediglich zentrierten Text zu tragen.

- **`arrival_early.png` und `arrival_mid.png`:** Die Geschosse bilden ein regelmäßiges horizontales Raster, die Beschriftungen ignorieren dieses Raster aber teilweise. Etagenlabels beginnen links, Raumlabels schweben mittig und „Finanzen / Tresor · Igor“ hängt an einer Geschosskante; dadurch fehlt eine eindeutige Beschriftungslogik. Sinnvoll wären zwei feste Ebenen: Etagenname immer links oben innerhalb des Geschosses, Raum-/Personenname unmittelbar über dem zugehörigen Tür- oder Raumsegment. Die freie Skyline links und rechts ist groß, während die eigentliche Handlung im Gebäude sehr klein bleibt.

- **`vergabe_akte.png`:** Der Inhaltsblock ist zwar mathematisch zentriert, aber seine Komponenten haben keine gemeinsame Textkante. Das breite Zitat, die schmale Akte und die nochmals schmalere CTA bilden eine Trichterform, die den Blick direkt nach unten zum Button zieht. Akte und Zitat sollten dieselbe linke Textkante besitzen; die CTA darf schmaler sein, muss aber als Teil des Dokuments erscheinen. Die schwarze Fläche ober- und unterhalb ist so groß, dass sie nicht mehr Spannung, sondern Unterdimensionierung signalisiert.

---

## 5. **Lesbarkeit**

- **`title.png`:** Beim Ton-Hinweis, dem Bildungszweck-Text und der Versionszeile musste ich jeweils zweimal hinsehen. Alle drei verwenden sehr kleine Pixelschrift auf einem unruhigen, dunklen Gebäudehintergrund. Der Bildungszweck braucht entweder eine deckendere Papierfläche oder größere Schrift mit kürzerer Zeilenlänge. Die Version sollte nicht über beleuchteten Fenstern und Fassadenkanten stehen.

- **`avatar_choice.png`:** „NAME“ und die Alterslabels sind an der Untergrenze sinnvoller Lesbarkeit. Der Platzhalter ist deutlich heller und blauer als die übrige Tinte und wirkt eher deaktiviert als leer. Vor allem ist der Zustandsunterschied unklar: Das obere mittlere Porträt wirkt ausgewählt, die CTA aber gleichzeitig aktiv, obwohl das Namensfeld leer ist.

- **`avatar_choice_m2.png`:** „Tester“ ist gut lesbar, aber der ausgefüllte Zustand erzeugt keine erkennbare Änderung an der Aktion. Auswahl, Fokus und Bestätigung werden nur durch dünne Konturen kommuniziert. Bei kleinerer Ausgabe würden der gelbe Auswahlrahmen und das gelbe „Mittel“ zuerst verschwinden.

- **`arrival_early.png`:** „Etage 2 – Feld-Operationen“, „Etage 1 – Zentrale“ und „Finanzen / Tresor · Igor“ verlangen wegen Größe und Platzierung auf detailreichen Trägern einen zweiten Blick. Der gelbe Zentrale-Streifen ist dagegen überdeutlich und erzeugt ein falsches Hierarchiegefälle. Die Spielfigur besitzt keinen eindeutigen aktiven Zustand.

- **`arrival_mid.png`:** Der Wechsel gegenüber `arrival_early.png` ist ohne direkten Vergleich schwer zu erfassen. Fahrstuhlposition, Figurenposition und Zielbezeichnung stehen nicht in einer gemeinsamen visuellen Kette. „ÜBERSPRINGEN“ ist klein und kontrastarm, was für eine sekundäre Aktion akzeptabel ist, aber bei kleiner Auflösung problematisch wird.

- **`vergabe_akte.png`:** Bühnenanweisung, Metadaten „AKTE · DIE WAHL“, Start-/Zielangaben und Barometerzeile sind zu klein für ihre Bedeutung. Innerhalb des Zitats ist das amberfarbene Wort „Ziel“ leichter auffindbar als der eigentliche Missionswert in der Akte. Der Dokumenttitel ist klar, doch Beschreibung und Fortschrittslogik verlieren gegen den roten Button.

---

## 6. **Die drei wirksamsten Änderungen**

1. **`title.png` und `vergabe_akte.png`: rote Vollflächen-CTAs auf die definierte Papier-Stempeloptik umstellen** — geringer CSS-Aufwand, aber sofort bessere Blickhierarchie und deutlich stärkere Übereinstimmung mit `desinformation-network/src/story-mode/theme.ts`.

2. **`vergabe_akte.png`: Akte und Textblock um etwa ein Drittel vergrößern und auf gemeinsame Textkanten setzen** — die zentrale Missionsinformation wird lesbar und die derzeit dominierende schwarze Leerfläche verliert ohne neues komplexes Asset an Gewicht.

3. **`arrival_early.png` und `arrival_mid.png`: Kamera auf die jeweils relevanten zwei bis drei Etagen verdichten und die Spielfigur dauerhaft markieren** — das behebt den größten narrativen UX-Fehler des Bündels: Man sieht das Gebäude, aber nicht zuverlässig, was gerade geschieht.

---

## 7. **Blinde Flecken**

- Bei **`arrival_early.png` und `arrival_mid.png`** ist aus Einzelbildern nicht erkennbar, ob Kamera, Fahrstuhl und Figuren weich nachgeführt werden oder lediglich zwischen Positionen springen; dafür wären mehrere aufeinanderfolgende Frames oder ein kurzer Clip nötig.
- Bei **`avatar_choice.png` und `avatar_choice_m2.png`** fehlen Hover-, Tastaturfokus-, Validierungs- und Fehlerzustände sowie ein Screenshot mit tatsächlich ungültiger Eingabe.
- Bei **`title.png` und `vergabe_akte.png`** ist nicht erkennbar, ob die roten Buttons bei Hover bereits eine Stempel- oder Druckanimation erhalten; sichtbar bewertet wurde nur der statische Grundzustand.
- Für alle sechs Screens fehlen Ansichten bei kleineren Auflösungen beziehungsweise UI-Skalierung. Besonders die Kleinschrift in **`title.png`**, den Etagenlabels von **`arrival_early.png`** und den Metadaten von **`vergabe_akte.png`** dürfte dort zuerst ausfallen.
- Bei **`arrival_mid.png`** ist ohne Bewegungsfolge nicht sicher identifizierbar, welche der sichtbaren Figuren der gewählte Avatar ist und ob die Position am oberen Rand bewusst Teil der Route oder ein NPC ist.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
