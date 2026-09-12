# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung

**Modell:** `stealth/ox-alpha` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-21
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-21T17:30:04.794Z · **Dauer:** 354.9 s
**Nutzung:** 20.469 Prompt + 10.505 Antwort Tokens · **Kosten:** $0.00 (gratis) · **Anbieter-Datensammlung:** ausgeschlossen (deny)

> ⚠️ **Wie das zu lesen ist:** Ein *fremdes* Modell hat einen **kuratierten Ausschnitt**
> des Projekts gesehen — nicht das laufende Spiel und nicht das ganze Repository. Es kann
> daher weder Laufzeitverhalten prüfen noch `file:line`-Belege verifizieren. Befunde sind
> **Hypothesen**, die vor dem Umsetzen am Code/an den Daten gegenzuprüfen sind. Die
> kanonische Wahrheit bleibt [`docs/VISION_LOCK.md`](../VISION_LOCK.md) bzw. die Spieldaten.

## Gestellte Frage

Das sind Einzelbilder aus Animations-Clips des Spiels — je Clip vier Zeitpunkte (Suffix __f1..__f4), gezogen vom Ende des Clips. Beurteile daran: Wo stehen bewegte Figuren und Objekte relativ zum Boden und zueinander — schweben oder versinken sie? Stimmen Maßstab und Perspektive über die Zeitpunkte hinweg? Verändert sich zwischen den Bildern etwas, das nicht stimmig ist (springende Position, wechselnde Größe, verschwindende Elemente)? WICHTIG: Du siehst Standbilder, keine Bewegung — benenne ausdrücklich, was du daraus NICHT beurteilen kannst.

## Gezeigter Ausschnitt

15.047 Zeichen ≈ 4.180 Tokens (geschätzt) aus 3 Quellen · 1 gekürzt

| Quelle | Modus | Zeichen | Status |
|---|---|---:|---|
| `sprite-tool/public/context/game-style-guide.md` | voll | 5.496 | vollständig |
| `desinformation-network/src/story-mode/theme.ts` | voll | 3.375 | vollständig |
| `desinformation-network/runs/visual-review/latest/manifest.json` | projektion | 6.176 | gekürzt |

### Gezeigtes Anschauungsmaterial (12 Screenshot(s))

| Art | Im Text genannt als | Datei | Größe |
|---|---|---|---:|
| 🖼 Bild | `clip_ambient_etage4__f1.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_etage4__f1.png` | 1085 kB |
| 🖼 Bild | `clip_ambient_etage4__f2.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_etage4__f2.png` | 1090 kB |
| 🖼 Bild | `clip_ambient_etage4__f3.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_etage4__f3.png` | 1087 kB |
| 🖼 Bild | `clip_ambient_etage4__f4.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_etage4__f4.png` | 1015 kB |
| 🖼 Bild | `clip_ambient_keller__f1.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_keller__f1.png` | 1015 kB |
| 🖼 Bild | `clip_ambient_keller__f2.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_keller__f2.png` | 1043 kB |
| 🖼 Bild | `clip_ambient_keller__f3.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_keller__f3.png` | 997 kB |
| 🖼 Bild | `clip_ambient_keller__f4.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_keller__f4.png` | 956 kB |
| 🖼 Bild | `clip_avatar_walk__f1.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_avatar_walk__f1.png` | 940 kB |
| 🖼 Bild | `clip_avatar_walk__f2.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_avatar_walk__f2.png` | 964 kB |
| 🖼 Bild | `clip_avatar_walk__f3.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_avatar_walk__f3.png` | 1037 kB |
| 🖼 Bild | `clip_avatar_walk__f4.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_avatar_walk__f4.png` | 1005 kB |

---

## Antwort des Modells

# Visual Review: Animations-Clips (Gebäude-Ansicht)

Vorab das Wichtigste quergeladen: Alle zwölf Frames zeigen dieselbe flache Seitenansicht des Gebäudes über einem **sternklaren Nacht-/Dämmerungshimmel** — obwohl die Uhren `11:30` (`clip_avatar_walk__*`), `12:32` (`clip_ambient_keller__*`) und `12:37` (`clip_ambient_etage4__*`) anzeigen. Der Manifest beschreibt ein Day/Night-Bundle (`sky_0900` … `sky_1800`); dass mittags Sterne stehen, ist entweder ein Koppelungsfehler oder die Clips wurden ohne Tönung aufgenommen. Das ist der gravierendste Befund und zieht sich durch alle Screenshots.

---

## 1. Erster Eindruck

**`clip_ambient_etage4__f1.png`**
Das Auge landet zuerst auf dem hellsten Streifen, dem beleuchteten Korridor von Etage 4, und bleibt dann an den beiden Figuren hängen: Alexei an der Cyber-Lab-Tür (links, ca. x≈445) und Marina rechts (ca. x≈890). Es sollte eigentlich zuerst die Uhr oben rechts erfassen — die wichtigste Spielzahl —, aber die ist zu klein und zu randnah dafür. Die schwebenden Raumlabels („Cyber-Lab · Alexei", „Operationszentrale") kleben direkt auf den Deckenkanten und konkurrieren mit den Etagen-Plaketten darunter. Ein weißer Hand-Cursor parkt mid-screen über dem Etage-2-Label und zieht unberechtigt Aufmerksamkeit. Insgesamt ruhige, lesbare Szene — die Blickführung ist aber Zufall, nicht Führung.

**`clip_ambient_etage4__f2.png`**
Alexei ist nun ca. 290 px weiter rechts bei der Operationszentrale (x≈735), Marina steht unverändert — das ist die statische Ankerfigur des Clips. Neu: eine Gehende auf Etage 2 (x≈495), während Etage 3 leer ist. Alles Statische (Pflanzen, Bank, Kaffeeküche, Fahrstuhltüren) ist pixelidentisch zu f1 — gut, kein Flackern im Hintergrund. Problematisch ist nur die Leserichtung: Das Auge springt zwischen vier Etagen hin und her, ohne dass eine Ebene als „aktiv" markiert wäre.

**`clip_ambient_etage4__f3.png`**
Alexei ist auf Etage 4 **verschwunden** — nur Marina steht noch dort. Gleichzeitig taucht die Gehende auf Etage 3 weit rechts an der Tür (x≈850) auf. Aus Standbildern kann ich nicht entscheiden, ob Alexei sauber durch eine Tür verschwunden ist oder teleportiert; die Abfolge 445 → 735 → weg → (in f4) 575 ist nicht-monoton und verdächtig. Etage 2 ist erneut leer. Der leere Mittelblock (Etage 2 komplett ohne Leben) wirkt tot und widerspricht dem Stil-Guide-Ziel „belebt, nicht dunkel/leer".

**`clip_ambient_etage4__f4.png`**
Drei Etagen sind gleichzeitig belebt: Etage 4 eine Gehende bei x≈575, Etage 3 eine am Wasserspender (x≈540), Etage 2 eine an der Kaffeeküche (x≈740). Das ist der lebendigste Frame des Clips — so sollte das Bild durchgehend aussehen. Die Figur auf Etage 3 überdeckt den Wasserspender vollständig; die Z-Ordnung (Figur vor Objekt) ist korrekt gesetzt. Bodenkontakt aller drei Figuren sieht sauber aus, kein Schweben erkennbar.

**`clip_ambient_keller__f1.png`**
Die Ansicht ist nach unten gescrollt; der Keller mit Igor ist die klare Hauptbühne — gelbe Markierungsbox plus Amber-Label „Finanzen / Tresor · Igor" dominieren. Das Label ragt bis an die Unterkante des Erdgeschoss-Bodens und kollidiert visuell mit der Deckenkante des Kellers. Oben wird das Label „Zielgruppen-Analyse" hart am Bildrand abgeschnitten — als Scrollzustand akzeptabel, aber unschön. Uhr: 12:32, wieder Nachthimmel. Die braune Rohrstrecke unter dem Kellerfußboden verankert die Szene gut im Erdreich.

**`clip_ambient_keller__f2.png**`
Fast identisch zu f1; die Gehende ist von Etage 3 (x≈710) auf Etage 2 (x≈495) gewandert, Igor unbewegt in seiner Box. Keine neuen Fehler. Auffällig im Quervergleich: Dieselbe Position x≈495 auf Etage 2 taucht auch in `clip_ambient_etage4__f2.png` auf — obwohl dort die Uhr 12:37, hier 12:32 zeigt. Entweder Zufall einer Loop-Animation oder die Clips replaysen denselben Ambient-Pfad; aus Standbildern nicht entscheidbar.

**`clip_ambient_keller__f3.png`**
Im Keller steht plötzlich eine **zweite Figur** (x≈720, direkt rechts neben Igors Box) — in f2 war der Korridor leer, in f4 ist sie wieder weg. Das ist der klarste Pop-in/-out-Fund im gesamten Paket: Eine Figur, die zwischen zwei wahrgenommenen Momenten neben einer markierten Hauptfigur erscheint und verschwindet, zerstört genau die Glaubwürdigkeit, die ein Spiel über Desinformation braucht. Auf Etage 3 ist die Gehende inzwischen weit rechts (x≈850). Restbild unverändert stabil.

**`clip_ambient_keller__f4.png`**
Keller wieder allein mit Igor; die Gehende ist auf Etage 2 bei der Kaffeeküche (x≈740) gelandet. Die gelbe Igor-Markierung ist über alle vier Frames pixelstabil — gut für einen Auswahlzustand. Der leere Keller-Korridor links (nur Automat und Poster) hat viel tote Fläche; hier würde ein zweiter Ambient-Inseltext oder ein flackernder Monitor viel bringen.

**`clip_avatar_walk__f1.png`**
Der Clip heißt „avatar_walk", aber der Avatar steht auf Etage 1 **unbewegt direkt neben dem Kurator**, die Sprites überlappen sich nahezu (x≈445 und x≈480). Das ist der stärkste Einzelbefund dieses Clips: Entweder endet der Walk schon vor f1, oder die Kollisions-/Abstandsprüfung fehlt. Uhr 11:30 — und trotzdem Sterne. Die Doppelbesetzung eines Korridorsegments durch zwei gleich große Figuren ohne Z-Auszeichnung liest sich als Klecks, nicht als Begegnung.

**`clip_avatar_walk__f2.png`**
Praktisch identisch zu f1; Avatar und Kurator auf derselben Stelle, keine sichtbare Positionsänderung. Auch hier: aus Standbildern kann ich einen langsamen Idle-Versatz nicht ausschließen, aber einen „Walk" sehe ich nicht. Der offene dunkle Türspalt auf Etage 3 existiert hier noch nicht. Alles Statische stabil.

**`clip_avatar_walk__f3.png`**
Weiterhin keine Änderung auf Etage 1. Der Frame bestätigt: Das Ende dieses Clips zeigt Idle, nicht Movement. Für die Beurteilung von Fußkontakt, Bobbing und Maßstab im Gehen ist der Clip damit unbrauchbar — dazu bräuchte ich Frames aus dem mittleren Clipbereich. Positiv: Selbst über vier Frames hinweg verrutscht nichts im Hintergrund, die Szene ist render-stabil.

**`clip_avatar_walk__f4.png`**
Erst jetzt öffnet sich die Tür auf Etage 3 (x≈885, dunkler Innenraum sichtbar) und eine Figur erscheint daneben bei x≈730. Zwischen zwei Samples ist das ein harter Zustandssprung; ob die Tür animiert öffnete oder snappt, sehe ich nicht. Der Avatar steht immer noch fixiert neben dem Kurator. Wenn das eine Dialog-/Interaktionsstellung sein soll, fehlt jede Kennzeichnung (Sprechblase, Highlight) — die Szene erzählt nichts.

---

## 2. Konkrete Eingriffe je Screen

**`clip_ambient_etage4__f1.png`**
- Uhr-Widget oben rechts → auf ca. 1,25× vergrößern, mindestens 16 px Abstand zum Burger-Button links davon halten → sie ist die wichtigste Zahl im Bild und currently kleiner als jedes Raumlabel.
- Raumlabels („Cyber-Lab · Alexei" etc.) → 8–12 px über die Deckenkante anheben und rechtsbündig an die jeweilige Korridorbreite koppeln statt frei mittig → sie schwebten aktuell optisch *auf* der Decke und konkurrieren mit den Plaketten.
- Hand-Cursor bei x≈490/y≈347 → für Review-Ernten global ausblenden oder an den Rand parken → er markiert einen Hotspot, den keiner sehen soll.
- Etage 2 (leerer Korridor) → mindestens ein Ambient-Element (Figur oder flackernder Monitor) zwischen Pflanze und Kaffeeküche → tote Mittelzone im Gesamtgebäude.
- Linke/rechte Himmelfläche (je ca. 230 px bei 1280 Breite) → Gebäude um ~10 % verbreitern oder Vordergrund-Silhouetten setzen → sonst tote Fläche beidseits.

**`clip_ambient_etage4__f2.png`**
- Alexei-Position (x≈735) → Bewegungspfad gegen Tür-Rechtecke prüfen: Er muss sichtbar durch den Türrahmen verschwinden, nie im freien Korridor → Teleport-Verdacht aus f1→f3.
- Gehende auf Etage 2 (x≈495) → Fuß-Y exakt an die Fliesenlinie binden (Schattenpixel unter beiden Füßen) → aktuell fehlt jeder Kontakt-Schatten, die Figur wirkt leicht über dem Boden.
- Marina (x≈890) → als einzige Dauer-präsente Figur einen Mikro-Idle bekommen (2-Frame-Atmen laut Stil-Guide) → sie ist der Anker, darf nicht wie eingefroren wirken.

**`clip_ambient_etage4__f3.png`**
- Verschwindender Alexei → Spawn/Despawn ausschließlich hinter Tür- oder Kamerakante; niemals im sichtbaren Korridorabschnitt → f1→f2→f3-Impression ist „er löst sich auf".
- Leeres Etage-2-Band → gleiche Maßnahme wie f1: Ambient-Besetzung → drei von fünf Etagen leer ist zu viel Leerstand für „belebt".
- Gehende Etage 3 (x≈850) → Ankunftsrichtung vereinheitlichen: Sie kam in f1 von links, taucht jetzt rechts auf → Pfadlogik dokumentieren oder korrigieren.

**`clip_ambient_etage4__f4.png`**
- Drei parallele Gehende → vertikale Versätze der Startpositionen um mindestens eine halbe Korridorbreite staffeln → sonst lesen alle Etagen als dieselbe kopierte Animation.
- Figur am Wasserspender (Etage 3, x≈540) → 2 px nach rechts versetzen → sie verdeckt das Objekt komplett, das als Raum-Inventar lesbar bleiben soll.
- Uhr → unverändert: immer noch 12:37 über vier Frames mit deutlichem Fortschreiten der Figuren → wenn der Clip > 30 s Echtzeit spannt, muss die Uhr ticken.

**`clip_ambient_keller__f1.png`**
- Igor-Label „Finanzen / Tresor · Igor" → unter die Keller-Deckenkante setzen (Label-Unterkante ≤ Deckenlinie minus 4 px) → es frisst sich aktuell in den Erdgeschoss-Boden.
- Gelbe Markierungsbox → Höhe auf Sprite + 2 px Rand reduzieren → die Box wirkt wie ein Käfig, der in den Boden reicht.
- Abgeschnittenes Label „Zielgruppen-Analyse" am oberen Bildrand → Scroll-Clamping so setzen, dass Labels nie halbiert sind → halbierte Schrift wirkt wie Renderfehler.

**`clip_ambient_keller__f2.png`**
- Identische Gehenden-Position (x≈495) wie in `clip_ambient_etage4__f2.png` trotz anderer Uhrzeit → Ambient-Pfade zeitlich variieren (Offset pro Loop) → sonst erkennt der Spieler die Wiederholung.
- Igor-Idle → innerhalb der Box 2-Frame-Atmen aktivieren → eine markierte Hauptfigur darf nicht statisch wie ein Möbelstück wirken.
- Keller-Korridor links (Automat bis Igor, ca. 300 px leer) → ein blinkendes LED-Element oder Rohr-Dampf einfügen → Stil-Guide fordert „Server-Racks mit blinkenden LEDs" für Untergeschosse.

**`clip_ambient_keller__f3.png`**
- Zweite Kellerfigur (x≈720) → Herkunft klären: Sie muss aus dem rechten Korridorende ODER einer Tür kommen, nicht im Nichts stehen → härtester Pop-in-Fund des Pakets.
- Ihr Abstand zu Igor → mindestens eine halbe Sprite-Breite, oder Z-Ordnung explizit vor/hinter der Box klären → aktuell klebt sie an der Markierung und liest sich als Rendering-Doppelbild.
- Wenn sie in f4 despawnt → Despawn-Punkt hinter Kante legen → analog zum Pop-in.

**`clip_ambient_keller__f4.png`**
- Keller nach dem Verschwinden → kurze Rest-Animation an der Despawn-Stelle vermeiden/prüfen → Nachleuchten wäre der zweite Fehler.
- Uhr 12:32 über vier Frames → siehe oben: ticken lassen oder Clipdauer deklarieren.
- Tote Keller-Fläche links → siehe f2-Maßnahme.

**`clip_avatar_walk__f1.png`**
- Avatar/Kurator-Überlappung (x≈445/x≈480) → Mindestabstand einer halben Sprite-Breite erzwingen oder sauberes Z-Sorting + Kontaktschatten → aktuell ein unlauterer Pixelklecks.
- Uhr 11:30 mit Sternenhimmel → Tag-Tönung an die Uhr koppeln → größter Widerspruch des Pakets.
- Interaktionszustand → wenn der Avatar mit dem Kurator spricht: Sprechblasen-Icon oder Rahmen-Puls über dem Paar → sonst erzählt die Szene nichts.

**`clip_avatar_walk__f2.png`**
- Unveränderte Avatar-Position → prüfen, ob der Walk vor f1 endet; falls ja, Endframes des Clips früher ziehen → der Clip liefert seinen Namen nicht ein.
- Etage-3-Tür (x≈885) → Öffnungsanimation starten, bevor die Figur in f4 auftaucht → Zustandssprung vorbereiten.
- Sidebar rechts → siehe Lesbarkeit (doppeltes „K").

**`clip_avatar_walk__f3.png`**
- Weiterhin statisches Paar → Idle-Sync auflösen: Beide Figuren sollen nicht im selben Atemrhythmus stehen → sonst wirken sie wie ein Duplikat.
- Himmel → gleiche Tag/Nacht-Maßnahme.
- Tote Fläche zwischen „Ihr Büro"-Label und Fahrstuhl (Etage 1, x≈700–930) → Wartebank-Person oder Aktensitz → der Korridor ist zu leer für eine „Zentrale".

**`clip_avatar_walk__f4.png`**
- Offene Tür Etage 3 (x≈885) → Öffnung weich animieren (2–3 Zwischenframes) → Snap zwischen Samples wirkt technisch.
- Neue Figur (x≈730) → Austritt aus der geöffneten Tür als Pfad erzwingen, nicht Nebeneinander-Spawn → sonst zweiter Pop-in.
- Avatar/Kurator → falls Dialog: Porträt-/Bubble-Trigger feuern lassen; falls nicht: Avatar weiterlaufen lassen → Stillstand ohne Bedeutung ist die schlechteste Option.

---

## 3. Grafiken / Assets

- **Tragend:** Die Korridor-Backgrounds (Neonlicht-Bänder, rote Sockelleisten, Fliesen) sind fein, scharf und stilistisch konsistent — die beste Asset-Leistung im Paket. Der Keller-Boden mit Erdreich und Rohren (`clip_ambient_keller__*`) verankert den Schnitt gut. Der Cyan-leuchtende Getränkeautomat im Keller ist der einzige Treffer der Stil-Guide-Vorgabe „Tech-Cyan für Monitore" — überall sonst leuchten Screens weiß/grau, die Cyan-Vorgabe wird kaum eingelöst.
- **Fremd:** Die warme Creme-Sidebar und der rotgerahmte Ticker unten folgen `theme.ts` (v3 „Behörden-Akte", Papierwelt), die Welt folgt noch dem v2-Beton/Glas-Look. Das ist laut Kommentaren beider Dateien intendiert (UI kippt auf Papier, Welt bleibt), **im Bild entsteht daraus aber eine harte Materialgrenze**: Die kalte blau-violette Nacht stößt ohne Vermittlungszone an die warme Papierleiste. Eine dünne Übergangszone (abgedunkelter Ticker-Hintergrund in Kraftpapier-Braun `#4E4232` statt Schwarz) würde beide Welten verbinden.
- **Himmelsgradient:** Das Violett-Blau des Abendhimmels ist gesättigter als alles, was der Stil-Guide erlaubt („Vermeiden: knallige/gesättigte Farben"). Bei 11:30/12:37 ist es schlicht falsch, bei echtem Nacht wäre es zu laut.
- **Skalierung:** Sprites sind über alle Etagen und Clips hinweg gleich hoch — kein Maßstabbruch feststellbar. Der Pförtner im doppelhohen Erdgeschoss wirkt korrekt proportional kleiner.
- **Beschnitt:** Nur das gekappte „Zielgruppen-Analyse"-Label in `clip_ambient_keller__f1..f4` ist ein echter Beschnittfehler.
- **Fehlend:** Keine realen Staatssymbole — Fahnen/Poster sind abstrakt, das passt zur Vorgabe. Was fehlt: sichtbare CRT-Monitore mit grünem/cyan Text im Cyber-Lab (Stil-Guide-Kernmerkmal des Raums) — der Raum ist als Korridor generisch geblieben.

## 4. Raster & Rhythmus

- Das Etagenraster ist sauber: gleiche Geschosshöhen, Plaketten durchgehend linksbündig an derselben Kante (x≈265). Das ist die stabile Grundlage.
- **Unruhe entsteht aus dem zweiten Labelsystem:** Die schwebenden Raumlabels sind mal links („Cyber-Lab · Alexei"), mal mittig („Operationszentrale"), mal rechts („Medien-Zentrum · Marina", „Newsroom") positioniert — ohne erkennbare Regel. Zwei Systeme (Plakette + Label) auf jeder Deckenkante verdoppeln die Informationsdichte an derselben Linie. Empfehlung: Raumname in die Plakette integrieren, Personennamen nur als kleines Badge über der Figur selbst.
- **Tote Fläche:** Links und rechts des Gebäudes je ca. 18 % Bildbreite reiner Himmel; zusätzlich die leeren Korridoretagen (siehe oben). Bei Ultrawide verstärkt sich das.
- **Rechte Sidebar:** Die Tastenspalte klebt mit minimalem Rand am rechten Bildrand; die Buttons haben untereinander gleichmäßige Abstände, aber die Spalte hat keine Überschrift und keine Gruppierung — fünf lose Quadrate ohne Hierarchie.
- **Ticker:** Volle Breite, gute Trennung zum Spielraum durch die rote Linie; der „PUBLIKUM"-Button rechts überlappt die Rahmenkante optisch — 8–12 px Innenabstand fehlen.

## 5. Lesbarkeit

- **Doppeltes „K" in der Sidebar** (zweite und vierte Taste, sichtbar in allen zwölf Frames): Zwei identische Shortcut-Labels bedeuten entweder einen Bug oder zwei verschiedene Aktionen mit gleichem Buchstaben. Beides ist untragbar; ich musste dreimal hinsehen, um sicherzugehen, dass es kein Artefakt ist.
- **Uhr:** Kleinste wichtige Information im Bild. Die Ziffern sind lesbar, aber das Widget verliert gegen jedes Raumlabel.
- **Ticker-Sekundärtext** („Noch keine Maßnahme ausgespielt…"): grau auf Schwarz/Rot, Kontrast grenzwertig; „STANDBY" in Grün und „MINISTERIUM SENDET" in Weiß funktionieren.
- **Raumlabels:** Weiß auf Dunkel, gut; aber die Personenzusätze („· Alexei") sind in derselben Größe wie der Raumname — die Hierarchie fehlt, alles wiegt gleich schwer.
- **Igor-Label** in Amber auf Dunkelrotbraun: hoher Kontrast, gut lesbar — das beste Label im Paket, nur falsch platziert (siehe oben).
- **Getränkeautomat-Display** im Keller: unlesbare Cyan-Pixel — als Deko okay, darf so bleiben.

## 6. Die drei wirksamsten Änderungen

1. **Tag/Nacht-Tönung an die Spieluhr koppeln** (`clip_avatar_walk__*` 11:30, `clip_ambient_keller__*` 12:32, `clip_ambient_etage4__*` 12:37 — alle mit Sternenhimmel). Ein einziger Systemfehler, der in jedem einzelnen Screenshot sichtbar ist und die Glaubwürdigkeit der Welt sofort wiederherstellt.
2. **Pop-in/-out der Ambient-Figuren beseitigen** (Keller-Figur in `clip_ambient_keller__f3.png`, Alexeis nicht-monotoner Pfad in `clip_ambient_etage4__f1–f4`). Spawn/Despawn nur hinter Türen und Kanten — ohne das wirkt die Simulation gefaked, was bei einem Spiel über Manipulation ein Selbstwiderspruch ist.
3. **Labelsystem auf eins reduzieren und das doppelte „K" in der Sidebar fixen.** Rein redaktionell/räumlicher Aufwand (Text in Plaketten mergen, eine Taste umbenennen), beseitigt aber die größte Lesbarkeits- und Raster-Unruhe pro Frame.

## 7. Blinde Flecken

Was ich aus diesen Standbildern **nicht** beurteilen kann:

- **Eigentliche Bewegungsqualität:** Alle Clips sind Endframe-Extrakte. Der Walk-Zyklus des Avatars (`clip_avatar_walk__*`) ist im gezeigten Segment gar nicht sichtbar — Fußkontakt, Bobbing, Schrittweite, Geschwindigkeit bleiben unbeurteilt. Ich brauche Frames aus der Clipmitte.
- **Ob Alexei teleportiert oder durch Türen geht** (`clip_ambient_etage4__f1→f3`): Zwischen den Samples liegen beliebig viele Zwischenzustände.
- **Türöffnung:** Snap oder Animation (`clip_avatar_walk__f3→f4`) — nicht entscheidbar.
- **Idle-Animationen:** Ob Marina, Igor, Pförtner atmen, sehe ich nicht; vier identische Frames können Loop-Pause oder eingefrorener Sprite sein.
- **Hover/Fokus-Zustände:** Der geparkte Hand-Cursor zeigt, dass Hotspots existieren, aber nicht, wie Labels, Türen oder Figuren auf Hover reagieren.
- **Ob die Uhr überhaupt tickt:** Innerhalb jedes Clips steht sie still; ob sie über Minuten fortschreitet, braucht zwei Shots mit bekanntem Zeitabstand.
- **Auflösung/Schärfe der Sprites in Bewegung:** Kompressions- und Flackerartefakte zeigen sich erst im Laufbild.
- **Kollision Avatar/Kurator beim Vorbeigehen:** Ob der Avatar durch den Kurator hindurchlaufen kann, lässt sich nur mit einem Walk-Past-Frame prüfen.

Für eine belastbare Bewegungs-Review bitte: je Clip 4 Frames **äquidistant über die Gesamtdauer** (nicht nur vom Ende), plus je einen Hover-Shot der Korridortüren und der Sidebar-Tasten.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
