# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „intro"

**Modell:** `gpt-5.6-sol` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-22
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-22T17:09:26.285Z · **Dauer:** 192.7 s
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
| 🖼 Bild | `title.png` | `desinformation-network/runs/visual-review/latest/shots/title.png` | 1026 kB |
| 🖼 Bild | `avatar_choice.png` | `desinformation-network/runs/visual-review/latest/shots/avatar_choice.png` | 316 kB |
| 🖼 Bild | `avatar_choice_m2.png` | `desinformation-network/runs/visual-review/latest/shots/avatar_choice_m2.png` | 315 kB |
| 🖼 Bild | `arrival_early.png` | `desinformation-network/runs/visual-review/latest/shots/arrival_early.png` | 577 kB |
| 🖼 Bild | `arrival_mid.png` | `desinformation-network/runs/visual-review/latest/shots/arrival_mid.png` | 588 kB |
| 🖼 Bild | `vergabe_akte.png` | `desinformation-network/runs/visual-review/latest/shots/vergabe_akte.png` | 33 kB |

---

## Antwort des Modells

## 1. **Erster Eindruck**

### `title.png`
Das Auge landet zuerst auf dem großen rot gefüllten Knopf „NEUE MISSION“, erst danach auf Titel und Gebäude. Die gewünschte Reihenfolge wäre Gebäude/Marke → Spieltitel → Startaktion; aktuell konkurrieren diese drei Elemente, statt eine klare Abwärtsbewegung zu bilden. Das Gebäude trägt die Szene, aber der Titel liegt auf einer detailreichen Fassadenzone und verliert dadurch Kontur. Untertitel, Bildungszweck, Ton-Schalter und Versionszeile bilden am unteren Rand mehrere kleinteilige Ebenen ohne klare Gruppierung. Die schwarzen Seitenstreifen lassen die Key-Art außerdem wie ein eingebettetes Bild statt wie einen vollwertigen Titelbildschirm wirken.

### `avatar_choice.png`
Zuerst fallen die sechs Porträts auf, danach der rote Aktenkopf; die eigentliche Aufgabe und der leere Namenseintrag kommen erst deutlich später. Das ist grundsätzlich passend, allerdings sieht das Porträt oben in der Mitte bereits ausgewählt aus, obwohl dies laut Dateibeschreibung der Grundzustand sein soll. Der CTA wirkt trotz leerem Pflichtfeld vollständig aktiv, wodurch der visuelle Zustand unklar bleibt. Das Aktenraster ist ordentlich, aber die stark unterschiedlichen Kopfgrößen und Blickrichtungen erzeugen Unruhe innerhalb der sechs gleich großen Karten. Der schwarze Außenraum isoliert die Akte überzeugend, ist aber im Verhältnis zur relativ kleinen Schrift sehr dominant.

### `avatar_choice_m2.png`
Der Blick geht erneut zuerst auf die Porträts, wird dann aber vom dunklen Rahmen des ausgefüllten Namensfelds stärker angezogen als vom gewählten Porträt. Die Auswahl oben in der Mitte unterscheidet sich kaum von `avatar_choice.png`; der Zustandswechsel besteht sichtbar fast nur aus dem Text „Tester“. Gewähltes Porträt, eingetragener Deckname und aktive Hauptaktion sollten eine klare diagonale oder vertikale Folge bilden, aktuell sind es drei weitgehend gleichwertige Rahmen. Der papierfarbene CTA passt besser zur Behördenwelt als die roten Vollflächen anderer Screens. Der eigentliche Auswahlzustand ist dennoch zu subtil für den wichtigsten Schritt dieses Bildschirms.

### `arrival_early.png`
Der gelbe Streifen „Direktor / Zentrale · Kurator“ ist der stärkste Blickfang, nicht die ankommende Spielfigur im Empfang. Eigentlich sollte zuerst die Figur, dann ihr Ziel und zuletzt das Gebäude als Orientierung gelesen werden. Die zwei eng überlagerten Figuren im Erdgeschoss sind in dieser Standaufnahme schwer auseinanderzuhalten und wirken wie ein fehlerhaft zusammengesetzter Sprite. Die Vielzahl schwarzer Beschriftungsstreifen auf den Geschosskanten zerlegt das Gebäude horizontal und konkurriert mit den eigentlichen Räumen. Der Überspringen-Knopf sitzt isoliert im rechten Himmel und gehört weder sichtbar zur Cinematic noch zum Gebäuderaster.

### `arrival_mid.png`
Auch hier führt der gelbe Zielstreifen zuerst, während weder die aktuelle Position der Spielfigur noch die Bewegung des Fahrstuhls auf Anhieb eindeutig ist. Mehrere ähnlich große Figuren auf verschiedenen Etagen erzeugen in der Standaufnahme ein Suchbild. Der Fahrstuhlschacht ist zwar visuell dominant, aber es fehlt ein klarer Hinweis, welche Kabinenposition oder Etage gerade relevant ist. Die Beschriftungen schweben teilweise über Geschossgrenzen statt eindeutig innerhalb der zugehörigen Räume. Gegenüber `arrival_early.png` ist die erzählerische Veränderung ohne Bewegung nur mühsam zu erkennen.

### `vergabe_akte.png`
Das Auge landet zuerst auf dem roten Knopf „AKTE ÜBERNEHMEN“, obwohl die Akte „Die Wahl“ der narrative Hauptgegenstand sein müsste. Akte, Zitat und Regiezeile sind insgesamt zu klein für die große schwarze Bühne und wirken wie ein Dialogmodal in der Bildschirmmitte. Der Satz „schiebt eine Akte über den Tisch“ wird visuell nicht eingelöst, weil weder Tischfläche noch Bewegungsspur oder räumliche Übergabe sichtbar sind. Innerhalb der Akte ist „Die Wahl“ klar, die Zielskala und ihre Beschriftungen benötigen dagegen deutlich mehr Aufmerksamkeit. Die Szene sollte Aktenübergabe → Inhalt prüfen → übernehmen erzählen; aktuell liest sie sich CTA → kleine Karte → Kleingedrucktes.

---

## 2. **Konkrete Eingriffe je Screen**

### `title.png`

- `title.png` — **Titelblock** → etwa eine halbe Titelhöhe nach oben setzen, um rund ein Sechstel vergrößern und auf eine ruhigere Fassadenfläche beziehungsweise einen schmalen dunklen Kontraststreifen legen → der Spieltitel muss vor dem Startknopf gelesen werden.
- `title.png` — **„NEUE MISSION“-Knopf** → horizontal unter dem Titel zentrieren, Breite auf ungefähr die Hälfte des Titelblocks reduzieren und von roter Vollfläche auf helles Papier mit rotem Doppelring umstellen → so entsteht eine klare vertikale Hierarchie und die Schaltfläche entspricht `stampCtaStyle` aus `desinformation-network/src/story-mode/theme.ts`.
- `title.png` — **Untertitel** → auf etwa das 1,25-Fache vergrößern und mit einem Abstand von ungefähr einer halben Titelhöhe direkt unter den Haupttitel setzen → aktuell verschwindet er in den Fassadendetails.
- `title.png` — **Bildungszweck-Hinweis** → gelben Außenrahmen entfernen oder stark abdunkeln, Textbreite beibehalten, aber Schrift um eine Stufe vergrößern und als ruhige Papier-/Tintenzeile oberhalb der Versionsangabe gruppieren → der Hinweis soll lesbar sein, ohne wie eine zweite Hauptaktion zu wirken.
- `title.png` — **Ton-Schalter und Version** → Ton-Schalter an die linke untere Safe-Area-Kante, Version an die rechte untere Kante setzen; beide auf derselben Grundlinie und mit gleichem Abstand zum Bildrand → derzeit kollidieren sekundäre Funktionen und technische Angaben in der Mitte.
- `title.png` — **seitliche schwarze Streifen** → Himmel und Skyline seitlich bis zum Viewportrand erweitern, ohne das Gebäude hochzuskalieren; über der Antenne etwa eine kleine, aber sichtbare Kopffreiheit erhalten → die Key-Art wirkt dann vollflächig, ohne die Antenne abzuschneiden.

### `avatar_choice.png`

- `avatar_choice.png` — **Grundzustand der Porträts** → den goldenen Rahmen und die gelbe Beschriftung oben Mitte entfernen, falls noch keine Wahl getroffen wurde; bei einer absichtlichen Vorauswahl stattdessen einen eindeutigen „VORAUSGEWÄHLT“-Stempel ergänzen → Grundzustand und gewählter Zustand sind momentan visuell identisch.
- `avatar_choice.png` — **Namensfeld/CTA-Zustand** → bei leerem Pflichtfeld den CTA deutlich entsättigen, roten Doppelring auf eine helle neutrale Kontur reduzieren und den Pfeil ausblenden → eine nicht ausführbare Aktion darf nicht wie aktiv aussehen.
- `avatar_choice.png` — **Porträtkarten** → Augenlinien je Reihe auf eine gemeinsame horizontale Achse bringen und die Köpfe auf ungefähr dieselbe relative Höhe skalieren → insbesondere das Porträt oben Mitte wirkt gegenüber oben links zu klein und zu tief.
- `avatar_choice.png` — **Anweisungstext** → links an der Porträtmatrix ausrichten, auf maximal zwei kurze Zeilen begrenzen und den Abstand zur ersten Kartenreihe auf etwa eine normale Textzeile erhöhen → momentan ist die Aufgabe klein und zwischen Kopfband und Bildern eingeklemmt.
- `avatar_choice.png` — **Label „NAME“** → ungefähr auf Größe der Alterslabels anheben und näher an das Eingabefeld rücken → das Feld ist sichtbar, seine Funktion muss aber wegen des winzigen Labels zweimal geprüft werden.

### `avatar_choice_m2.png`

- `avatar_choice_m2.png` — **gewähltes Porträt oben Mitte** → mit doppelter Tintenlinie, leicht aufgehelltem Kartenhintergrund und einem kleinen schrägen Stempel „GEWÄHLT“ in der rechten oberen Ecke markieren → ein einzelner dünner Goldrahmen reicht als Primärzustand nicht.
- `avatar_choice_m2.png` — **Namensfeld** → dunklen Fokusrahmen etwas entschärfen und stattdessen eine schmale blaue Tintenlinie oder eine sichtbare Einfügemarke verwenden → der Feldrahmen ist aktuell stärker als die Avatar-Auswahl.
- `avatar_choice_m2.png` — **Verbindung Auswahl–Name** → den Abstand zwischen zweiter Porträtreihe und „NAME“ geringfügig reduzieren und dafür zwischen Namensfeld und CTA etwas mehr Luft lassen → Auswahl und Identität gehören zusammen, die endgültige Aktion sollte als eigener Schritt folgen.
- `avatar_choice_m2.png` — **aktiver CTA** → roten Doppelring beibehalten, aber zusätzlich den Textkontrast leicht erhöhen und den Pfeil weiter vom Wortende absetzen → der aktive Zustand sollte klarer sein als in `avatar_choice.png`, ohne eine rote Vollfläche zu benötigen.
- `avatar_choice_m2.png` — **Alterslabel „Mittel“** → nicht nur gelb färben, sondern gemeinsam mit der ganzen Karte in den Auswahlzustand nehmen → ein farbiges Wort auf schwarzem Streifen ist als alleinige Rückmeldung zu klein.

### `arrival_early.png`

- `arrival_early.png` — **Spielfigur im Erdgeschoss** → eine kleine, ruhige Markierung direkt über dem Kopf ergänzen, etwa eine tintenblaue Raute von ungefähr halber Kopfhöhe → die Hauptfigur ist zwischen ähnlichen Sprites nicht zuverlässig zu erkennen.
- `arrival_early.png` — **überlagerte Figuren im Empfang** → mindestens eine halbe Figurenbreite horizontal trennen oder eine Figur klar in den Hintergrund versetzen → die aktuelle Silhouette liest sich wie ein Doppel-Sprite.
- `arrival_early.png` — **Ziel „Direktor / Zentrale · Kurator“** → gelben Streifen vollständig innerhalb von Etage 1 platzieren, links an der Ziel-Tür ausrichten und die übrigen Geschosslabels um etwa ein Drittel abdunkeln → Ziel und Kontext bleiben sichtbar, ohne dass alle Beschriftungen gleich laut sind.
- `arrival_early.png` — **Überspringen-Knopf** → an die obere rechte Ecke des eigentlichen Szenenrahmens setzen, nicht in den freien Himmel; Innenabstand und Schrift um etwa ein Viertel erhöhen und als kleine Papierlasche gestalten → der Knopf ist derzeit schlecht lesbar und visuell abgekoppelt.
- `arrival_early.png` — **Letterbox-Flächen** → obere und untere Schwarzfläche jeweils ungefähr halbieren und die Gebäudeszene entsprechend moderat vergrößern → Figuren und Geschossdetails sind für diese Einführungssequenz unnötig klein.

### `arrival_mid.png`

- `arrival_mid.png` — **aktuelle Spielfigur** → dieselbe Kopfmarkierung wie in `arrival_early.png` verwenden und sie während der Sequenz konsequent an der bewegten Figur halten → ohne Bewegungsinformation ist die Hauptfigur unter mehreren Sprites nicht identifizierbar.
- `arrival_mid.png` — **Fahrstuhl** → aktuelle Kabinenposition mit einer dünnen cyan- oder amberfarbenen Innenkante und einer kleinen Etagenmarke direkt am Schacht kennzeichnen → der Fahrstuhl ist groß, kommuniziert aber seinen Zustand nicht.
- `arrival_mid.png` — **Geschossbeschriftungen** → alle Etagennamen an einer gemeinsamen linken Kante innerhalb des Gebäudes beginnen lassen; raumbezogene Namen direkt über oder neben der zugehörigen Tür platzieren → die jetzigen mittigen Streifen schweben über Trennlinien.
- `arrival_mid.png` — **Zielhierarchie** → nur Zielgeschoss und aktuelle Position farbig führen, alle anderen Labels neutral in gedämpfter Tinte halten → der Blick soll eine Route lesen, keine gleichzeitig aktive Gebäudekarte.
- `arrival_mid.png` — **Überspringen-Knopf und Letterbox** → exakt dieselben Positionen, Größen und Abstände wie in `arrival_early.png` verwenden → ein filmischer Ablauf benötigt ein stabiles Overlay-Raster.

### `vergabe_akte.png`

- `vergabe_akte.png` — **gesamte Akte** → auf etwa das 1,35- bis 1,5-Fache vergrößern und ihre Oberkante knapp unter das Zitat setzen → sie ist der narrative Hauptgegenstand, nimmt derzeit aber weniger als ein Drittel der Bildschirmbreite ein.
- `vergabe_akte.png` — **Regiezeile und Zitat** → auf dieselbe Breite wie die vergrößerte Akte begrenzen, Schrift um eine Stufe erhöhen und zwischen Regiezeile, Zitat und Akte jeweils einen gleich großen vertikalen Abstand verwenden → aktuell bilden sie eine breite, dünne Textwolke über einer kleinen Karte.
- `vergabe_akte.png` — **Akte als Objekt** → unter die Papierkarte eine dunkle Kraftpapier-/Tischfläche von ungefähr anderthalb Aktenbreiten setzen und die Akte mit einer kleinen Registerlasche oder versetzten Rückseite versehen → „über den Tisch schieben“ braucht räumliche Materialität statt schwarzen Leerraum.
- `vergabe_akte.png` — **Zielskala** → Balken und Beschriftungen um ungefähr ein Viertel vergrößern, Startwert links direkt unter dem Balken und Zielmarke direkt unter dem Schwellenstrich ausrichten → die zentrale Spielbedingung ist gegenwärtig Kleingedrucktes.
- `vergabe_akte.png` — **„AKTE ÜBERNEHMEN“-Knopf** → rote Vollfläche durch Papierfläche mit rotem Stempelring ersetzen, Breite auf die Aktenbreite abstimmen und Abstand zur Akte auf ungefähr eine Überschriftenhöhe setzen → CTA und Akte werden zu einer zusammengehörigen Behördenhandlung.
- `vergabe_akte.png` — **Hintergrund** → reines Schwarz durch das Kraftpapier-Dunkel `background: '#2E2820'` aus `desinformation-network/src/story-mode/theme.ts` ersetzen und hinter der Akte eine sehr zurückhaltende Vignette setzen → das Objekt bleibt kontrastreich, wirkt aber nicht mehr wie ein Webmodal im Nichts.

---

## 3. **Grafiken/Assets**

- `title.png` — Das Gebäude-Key-Art trägt den Screen: scharfe feine Pixelkanten, klare Staffelung und glaubwürdige Beton-/Glasmaterialien passen zu `sprite-tool/public/context/game-style-guide.md`. Die Antenne sitzt allerdings fast am oberen Beschnitt; etwas Kopffreiheit fehlt. Die seitlichen schwarzen Flächen wirken nicht wie Teil des Assets und sollten durch eine erweiterte Himmel-/Skylinefassung ersetzt werden.
- `title.png` — Der rote Vollflächenknopf wirkt gegenüber der fein abgestuften Key-Art wie ein fremdes Web-UI-Element. Er widerspricht außerdem der Festlegung in `desinformation-network/src/story-mode/theme.ts`, nach der Ministeriumsrot nur für Stempel, Kopfbänder und Alarm eingesetzt werden soll.
- `avatar_choice.png` und `avatar_choice_m2.png` — Die Porträts sind scharf und grundsätzlich stilkompatibel, aber Ausschnitt und Maßstab sind nicht vereinheitlicht. Oben links füllt der Kopf einen deutlich größeren Teil der Karte als oben Mitte; unten links ist ein starkes Profil, während die übrigen Figuren überwiegend frontal oder im Dreiviertelprofil stehen. Für ein Aktenraster sollten Augenlinie, Kopfanteil und Schulteranschnitt pro Karte normalisiert werden.
- `avatar_choice.png` und `avatar_choice_m2.png` — Die Kartenhintergründe variieren in Perspektive und Detailgrad stärker als nötig. Eine gemeinsame neutrale Aktenwand oder zumindest ein einheitlicher Kontrast hinter den Köpfen würde die Auswahl weniger wie sechs getrennt erzeugte Illustrationen wirken lassen.
- `arrival_early.png` und `arrival_mid.png` — Der Gebäudequerschnitt ist fein, scharf und materiell konsistent. Fremd wirken eher die UI-Streifen: Sie liegen als harte schwarze Balken über der Welt und haben keine erkennbare Verbindung zu Papier, Tinte oder Gebäudebeschilderung.
- `arrival_early.png` und `arrival_mid.png` — Die Figuren skalieren und separieren nicht überall sauber. Besonders die Überlagerung im Empfang von `arrival_early.png` und die mehreren ähnlich silhouettierten Personen in `arrival_mid.png` verhindern eine klare Identifikation der Spielfigur.
- `arrival_early.png` und `arrival_mid.png` — Die violett-blauen Skylineflächen wirken stellenweise pastelliger als der verbindliche Stil-Anker erlaubt. Eine leichte Entsättigung und stärkere Annäherung an kühles Stahlblau würde das Gebäude weniger von einer weicheren Hintergrundwelt absetzen.
- `vergabe_akte.png` — Die Akte selbst ist lesbar, wirkt aber wie eine flache beige Karte. Es fehlen Registerlasche, Papierlagen, leichter Versatz oder eine Tisch-/Kraftpapierfläche, die sie als physisches Behördenobjekt verkauft.
- `vergabe_akte.png` — Das wichtigste fehlende Asset ist eine reduzierte Übergabebühne direkt hinter der Akte: dunkle Tischfläche, Schattenkante und optional eine angeschnittene Hand oder Aktenkante. Bereits Tisch und Schlagschatten würden mehr bringen als zusätzliche Dekoration innerhalb der Karte.

---

## 4. **Raster & Rhythmus**

- `title.png` — Titel, CTA und Footer verwenden drei verschiedene horizontale Achsen: Titel zentriert, CTA rechtsversetzt, Footer wieder mittig. Ein gemeinsames Mittelraster für Titel und CTA sowie eine separate untere Statuszeile würde die Blickführung beruhigen.
- `title.png` — Im unteren Viertel stehen Ton-Schalter, Bildungszweck und Version zu dicht übereinander, während oberhalb des Titels viel ungenutzter Himmel bleibt. Einen Teil dieser unteren Informationsdichte nach außen beziehungsweise in die Ecken verlagern.
- `avatar_choice.png` und `avatar_choice_m2.png` — Das Dreispaltenraster ist der sauberste Aufbau des Bündels: Karten, Eingabefeld und CTA teilen sich sichtbare Außenkanten. Dieses Raster sollte beibehalten werden; die Unruhe entsteht primär innerhalb der Porträts, nicht durch die Kartenabstände.
- `avatar_choice.png` und `avatar_choice_m2.png` — Zwischen zweiter Kartenreihe, Feldlabel, Eingabe und CTA wechseln die Abstände ohne eindeutige Gruppierung. Karten und Namensfeld enger als Identitätsblock gruppieren, danach einen sichtbar größeren Abstand vor der finalen Aktion setzen.
- `arrival_early.png` und `arrival_mid.png` — Die Geschosse erzeugen bereits starke horizontale Linien; zusätzliche Beschriftungsbalken exakt auf diesen Linien verdoppeln die Trennung. Labels entweder klar innerhalb der Räume oder in einer festen linken Verzeichnis-Spalte führen.
- `arrival_early.png` und `arrival_mid.png` — Rechts bildet der Fahrstuhlschacht eine starke vertikale Achse, links fehlt ein Gegenpol. Eine gemeinsame linke Kante für alle Geschossnamen würde ein stabiles Zwei-Achsen-Raster aus Verzeichnis und Fahrstuhl schaffen.
- `arrival_early.png` und `arrival_mid.png` — Die großen Letterbox-Flächen nehmen vertikalen Raum weg, obwohl Figuren und Etiketten bereits klein sind. Für eine kurze Ankunftssequenz reicht eine schmalere filmische Rahmung.
- `vergabe_akte.png` — Die Gruppe ist mathematisch zentriert, aber optisch untergewichtet. Oben und unten bleibt jeweils sehr viel tote Fläche, während die relevanten Informationen in einem schmalen mittleren Band zusammengedrängt sind.
- `vergabe_akte.png` — Zitat, Akte und CTA haben unterschiedliche Breiten ohne erkennbare Bezugskante. Akte als Masterbreite setzen; Zitat daran ausrichten und CTA entweder gleich breit oder bewusst deutlich schmaler zentrieren.

---

## 5. **Lesbarkeit**

- `title.png` — Beim Untertitel „Ein Desinformations-Planspiel“ musste ich wegen geringer Größe und unruhigem Fassadenhintergrund zweimal hinsehen. Gleiches gilt stärker für Ton-Hinweis, Bildungszweck und Versionszeile.
- `title.png` — Gelb wird gleichzeitig für Titel, Bildungszweck-Rahmen und Teile der Gebäudebeleuchtung verwendet. Dadurch ist es kein eindeutiges Hierarchiesignal mehr.
- `avatar_choice.png` — „NAME“ ist unnötig klein, der Platzhalter dagegen ausreichend groß. Wenn die Eingabe Pflicht ist, fehlt außerdem ein lesbarer deaktivierter Zustand des CTA.
- `avatar_choice.png` und `avatar_choice_m2.png` — Die Alterslabels sind klein, aber noch erfassbar; „Mittel“ wird durch Gelb als Auswahlhinweis benutzt, obwohl die Bedeutung der Farbe nicht explizit genug ist. Rahmen, Hintergrund und Stempel müssen den Zustand gemeinsam tragen.
- `avatar_choice_m2.png` — Der Text „Tester“ ist gut lesbar, aber der dunkle Fokusrahmen des Felds dominiert. Die visuelle Gewichtung sagt „Eingabefeld aktiv“, nicht „Personalakte vollständig“.
- `arrival_early.png` — Die Spielfigur musste zwischen den überlagerten Empfangsfiguren gesucht werden. Die weißen Floor-Labels sind auf Schwarz kontrastreich, aber wegen ihrer kleinen Schrift und wechselnden Positionen nicht schnell scannbar.
- `arrival_mid.png` — Es ist ohne Vergleich mit `arrival_early.png` nicht eindeutig, welche Figur sich bewegt hat und wo sich der Fahrstuhl befindet. Für eine Sequenz ist das ein Zustandsproblem, nicht nur ein Schriftproblem.
- `arrival_early.png` und `arrival_mid.png` — „ÜBERSPRINGEN ×“ ist klein, kontrastarm und weit vom eigentlichen Szenenrahmen entfernt. Für eine jederzeit verfügbare Aktion braucht es mehr Innenabstand und eine stabilere Position.
- `vergabe_akte.png` — Regiezeile, Startwert, Zielbeschreibung und Barometer-Zeile sind zu klein. Besonders „Start 9 %“, die Schwellenangabe und „Barometer: Westunion-Wahltrend / Politbarometer“ verlangen mehrfaches Hinsehen.
- `vergabe_akte.png` — Der rote CTA ist klar lesbar, überstrahlt aber die inhaltlich wichtigere Zielbedingung. Lesbarkeit ist hier vorhanden, die Priorisierung ist falsch.

---

## 6. **Die drei wirksamsten Änderungen**

1. **`arrival_early.png` und `arrival_mid.png`: Spielfigur, aktuelle Etage und Ziel mit genau drei abgestuften Signalen markieren.** Eine kleine Figurmarke, eine aktive Fahrstuhletage und nur ein gelber Zielstreifen lösen mit geringem Asset-Aufwand das größte Orientierungsproblem des Bündels.

2. **`title.png` und `vergabe_akte.png`: rote Vollflächen-CTAs durch den vorhandenen Papier-/Stempelstil ersetzen und aktive/deaktivierte Zustände vereinheitlichen.** Das ist wahrscheinlich eine komponentennahe Änderung mit hoher Wirkung auf Stiltreue, Hierarchie und Konsistenz zu `desinformation-network/src/story-mode/theme.ts`.

3. **`vergabe_akte.png`: Akte um etwa 40 % vergrößern und auf eine einfache dunkle Tisch-/Kraftpapierfläche setzen.** Dadurch wird aus einem kleinen Modal eine tatsächliche Aktenübergabe, und Zielskala sowie Auftrag werden ohne grundlegenden Umbau lesbarer.

---

## 7. **Blinde Flecken**

- `avatar_choice.png` und `avatar_choice_m2.png` — Nicht erkennbar ist, ob oben Mitte bewusst vorausgewählt ist, ob Karten Hover-, Fokus- oder Tastaturzustände besitzen und ob „MISSION BEGINNEN“ bei leerem Namen tatsächlich deaktiviert ist. Dafür werden je ein Screenshot mit ungefülltem Hover, Tastaturfokus, gewähltem Porträt ohne Namen und Validierungsfehler benötigt.
- `arrival_early.png` und `arrival_mid.png` — Aus Standbildern lässt sich nicht beurteilen, ob Kamera, Figur und Fahrstuhl durch Bewegung eindeutig werden. Benötigt werden mehrere direkt aufeinanderfolgende Frames oder ein kurzer Clip mit Beginn, Betreten des Fahrstuhls, Fahrt und Ankunft.
- `arrival_early.png` und `arrival_mid.png` — Nicht sichtbar ist, ob die Letterbox-Balken absichtlich animiert ein- und ausfahren oder dauerhaft bleiben. Dafür wäre je ein Frame unmittelbar vor und nach der Sequenz nötig.
- `title.png` — Hover, Fokus, Ton-an/Ton-aus-Zustand sowie Verhalten bei schmaleren und kleineren Auflösungen sind nicht erkennbar. Besonders für die schwarzen Seitenstreifen und die kleinen Footertexte werden Aufnahmen in mindestens einer kleineren 16:9-Auflösung benötigt.
- `vergabe_akte.png` — Nicht erkennbar ist, ob die Akte tatsächlich ins Bild geschoben wird, ob der Fortschrittsbalken animiert ist oder ob der CTA einen gestempelten Press-Zustand besitzt. Ein Frame vor der Übergabe, während der Bewegung und nach Fokus auf dem CTA würde die räumliche Wirkung klären.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
