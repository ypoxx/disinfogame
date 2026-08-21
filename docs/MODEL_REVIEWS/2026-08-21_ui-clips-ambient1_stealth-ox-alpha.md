# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung

**Modell:** `stealth/ox-alpha` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-21
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-21T17:23:04.048Z · **Dauer:** 419.9 s
**Nutzung:** 20.485 Prompt + 11.890 Antwort Tokens · **Kosten:** $0.00 (gratis) · **Anbieter-Datensammlung:** ausgeschlossen (deny)

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
| 🖼 Bild | `clip_ambient_etage1__f1.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_etage1__f1.png` | 1004 kB |
| 🖼 Bild | `clip_ambient_etage1__f2.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_etage1__f2.png` | 978 kB |
| 🖼 Bild | `clip_ambient_etage1__f3.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_etage1__f3.png` | 963 kB |
| 🖼 Bild | `clip_ambient_etage1__f4.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_etage1__f4.png` | 956 kB |
| 🖼 Bild | `clip_ambient_etage2__f1.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_etage2__f1.png` | 1121 kB |
| 🖼 Bild | `clip_ambient_etage2__f2.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_etage2__f2.png` | 1083 kB |
| 🖼 Bild | `clip_ambient_etage2__f3.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_etage2__f3.png` | 1082 kB |
| 🖼 Bild | `clip_ambient_etage2__f4.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_etage2__f4.png` | 1061 kB |
| 🖼 Bild | `clip_ambient_etage3__f1.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_etage3__f1.png` | 1141 kB |
| 🖼 Bild | `clip_ambient_etage3__f2.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_etage3__f2.png` | 1099 kB |
| 🖼 Bild | `clip_ambient_etage3__f3.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_etage3__f3.png` | 1091 kB |
| 🖼 Bild | `clip_ambient_etage3__f4.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_etage3__f4.png` | 1052 kB |

---

## Antwort des Modells

# Visual Review: Ambient-Clips Gebäude-Querschnitt (12 Standbilder)

Vorbemerkung zur Methode: Ich sehe vier isolierte Zeitpunkte je Clip, gezogen vom Clip-Ende. Alles, was zwischen den Frames liegt — Geschwindigkeit, Walk-Zyklen, Zwischenpositionen — ist mir unsichtbar. Wo ich „Springen" schreibe, heißt das: *die Stills lassen keinen kontinuierlichen Weg zu*, bewiesen ist die Teleportation damit nicht.

---

## 1. Erster Eindruck

**`clip_ambient_etage1__f1.png`**
Das Auge landet zuerst auf dem cyan-leuchtenden Getränkeautomaten im Keller (hellster Fleck, x≈280) und springt dann zu den zwei Anzugsfiguren an der E1-Tür (Bildmitte). Eigentlich sollte es zuerst die Spielfiguren/Etage 1 lesen — das gelingt knapp, weil der Automat unten links stark konkurriert. Der Himmel ist nachtblau mit Sternen und erleuchteten Fenstern, während die Uhr 12:02 zeigt — dieser Widerspruch ist das dominante Merkmals des Bildes. Der Pförtner steht allein in einer sehr großen, leeren Empfangshalle. Eine Läuferfigur auf Etage 3 hat sauberen Bodenkontakt, aber keinerlei Schatten.

**`clip_ambient_etage1__f2.png`**
Die E3-Figur aus f1 ist weg, stattdessen läuft jetzt jemand auf Etage 2 (x≈490) — das Auge sucht erst den alten Läufer, findet ihn nicht und hängt an der Leere. Die Füße der E2-Figur stehen im dunklen Sockelstreifen des Bodens, sie wirkt eingesunken. E1-Szene und Pförtner sind unverändert, was gut die Ruhe hält. Der weiße Hand-Cursor klebt unverändert über dem Etagen-Label — vermutlich Aufnahme-Artefakt, wirkt aber wie ein falsches Asset.

**`clip_ambient_etage1__f3.png`**
Auf E3 taucht wieder ein Läufer auf (x≈860), auf E1 zusätzlich eine dritte Figur (x≈680), die aus dem Nichts kommt — keine Tür in ihrer Nähe ist offen. Das Bild wirkt dadurch unbeabsichtigt „getriggert" statt belebt. Die Label-Zeile fällt erstmals negativ auf: Etagen-Labels linksbündig, Raum-Labels mittig — zwei Fluchten im selben Band. Restkomposition stabil.

**`clip_ambient_etage1__f4.png`**
Zwei Ebenen sind gleichzeitig belebt (E3 links, E2 am Kopierer) — das ist der lebendigste Moment dieses Clips. Die E2-Figur überlappt den Kopierer im Vordergrund, obwohl das Gerät an der Rückwand steht: Verdacht auf Z-Order-Fehler. Die E3-Position (x≈545) ist aus f3 (x≈860) nur als Richtungswechsel rekonstruierbar, aus f1 gar nicht. Keller-Automat leuchtet in allen vier Frames identisch — kein erkennbares LED-Leben.

**`clip_ambient_etage2__f1.png`**
Kamera gescrollt, Dachkante wird bei y=0 hart abgeschnitten — das Gebäude wirkt oben „aufgesetzt". Die Uhr zeigt 12:27, der Sternenhimmel bleibt — derselbe Widerspruch wie in Clip 1. Auf E3 stehen zwei Figuren fast deckungsgleich (x≈800/840), das liest sich als Kopierfehler. Der ETAGEN ▲▼-Schalter schwimbt ohne eigenen Grundflächen-Chip direkt auf der Dachgrafik.

**`clip_ambient_etage2__f2.png`**
E4 ist komplett leer, E3 hat einen einzelnen Läufer links, E2 ist belebt — die Belegungsmuster flippen zwischen den Frames. Die hellste Stelle der Etage 3 ist die cyan-Flasche des Wasserspenders, nicht die Figur: Die Blickpriorität gehört dem Mobiliar. Die E3-Figur steht erneut mit den Füßen auf der roten Sockelleiste. Komposition und Raster sind sauber, das Problem ist rein das Poppen der Belegschaft.

**`clip_ambient_etage2__f3.png`**
Etage 3 ist nun vollständig menschenleer über die volle Breite — eine tote Zone mitten im Bild, während E4 einen Läufer hat, der exakt auf der Türmittellinie steht (wirkt wie blockierend). Das Rot-Poster auf E4 ist der einzige warme Akzent der oberen Etagen und wird vom daneben klebenden Cursor „angeklebt". Ansonsten ruhiges, geordnetes Bild. Der Eindruck „das Gebäude atmet" kippt hier zu „das Gebäude flackert".

**`clip_ambient_etage2__f4.png`**
Wieder zwei E3-Figuren nach komplettem Leerstand in f3 — der Pop-in/out-Rhythmus ist jetzt über drei Frames belegbar. Die E2-Figur steht erneut vor dem Kopierer statt dahinter. Die rechte Sidebar zeigt zum zweiten Mal im Paket zwei Buttons mit demselben Buchstaben „K" — das wirkt wie ein Bug, nicht wie ein Kürzel. Bildaufbau und Etagentakt bleiben solide.

**`clip_ambient_etage3__f1.png`**
Die Dachtechnik ist voll sichtbar und gibt dem Gebäude einen guten oberen Abschluss — bester Frame des Pakets für die Silhouette. Etage 3 ist die dichteste Szene des gesamten Materials: Türfigur, Läufer, grauer Anzug (x≈890). Der Anzug-Sprite ist merklich größer als der Läufer auf derselmen Bodenebene — unklare Maßstabslogik. Die offene Tür mit halb eintretender Figur ist das glaubwürdigste Ambient-Detail aller zwölf Bilder.

**`clip_ambient_etage3__f2.png`**
Der Läufer wandert x≈695→735 nach rechts — das ist die einzige Bewegung im ganzen Paket, die sich als kontinuierlicher Weg rekonstruieren lässt; daran sollte sich alles andere messen lassen. Die Türfigur ist weg, die Tür zu: plausibel. Neu dafür eine E2-Figur ohne sichtbaren Spawnpunkt. Himmel weiterbei Nacht bei 12:02.

**`clip_ambient_etage3__f3.png`**
Die E2-Figur aus f2 ist bereits wieder verschwunden — Lebensdauer unter einem Frame-Abstand, das liest sich als Flackern. Der E3-Läufer steht bei x≈680, also links seiner f2-Position; ob das eine Wende ist, kann ich aus Stills nicht entscheiden. Der graue Anzug steht seit f1 auf exakt identischer Position — ob da Idle-Atmen läuft (Stil-Guide: 4 Frames), ist aus vier Endframes nicht prüfbar. Bild wirkt am leersten des Clips.

**`clip_ambient_etage3__f4.png`**
Vier Ebenen gleichzeitig belebt (E4, E2, E1, EG) — das bevölkerungsreichste Bild, und genau so sollte das Gebäude grundsätzlich wirken. E3 ist auf den unbewegten Anzug reduziert. Die zweite E1-Figur (x≈520) steht knapp an der Aktenschrank-Kante, Überlappungsordnung ist aus dem Still nicht eindeutig. Der Gesamteindruck „belebttes Ministerium" wird hier erreicht — leider durch dieselben Pop-Mechanismen erkauft.

---

## 2. Konkrete Eingriffe je Screen

**`clip_ambient_etage1__f1.png`**
- Läufer E3 (x≈710) → elliptischen Kontaktschatten unter die Füße (ca. Spritebreite, 2–3 px hoch, ~30 % Schwarz) → Figur steht statt zu schweben; gilt für alle Sprites im Paket.
- Himmel → Tages-Tönung an die Uhr 12:02 koppeln (Sterne/lit windows entfernen) → Bild widerspricht sich sonst selbst.
- Zwei Anzugsfiguren E1 (x≈440–480) → um 2–3 px vertikal/staffeln versetzen, je ±1 px Größe → wirkt weniger wie duplizierte Instanz.
- Pförtner EG → ist ~1,8× der Korridor-Sprites; auf max. ~1,4× reduzieren oder den Größensprung über einen perspektivischen Übergangsstreifen am EG-Boden abfedern.
- PUBLIKUM-Button (unten rechts) → läuft unter die Papier-Sidebar (ab x≈1237); Button nach links verschieben oder Sidebar erst ab y≈650 beginnen → nichts wirkt abgeschnitten.

**`clip_ambient_etage1__f2.png`**
- E2-Läufer (x≈490) → Sprite 2–3 px anheben, Füße auf die helle Lauffläche statt in den dunklen Sockelstreifen → kein Versinken.
- E3-Korridor (volle Breite leer) → mindestens ein Anwesenheits-Anker (Möbel, Posters, Idle-Figur hinter Glas) → keine tote Bandmitte.
- Hand-Cursor (x≈492/y≈180) → aus allen Aufnahmen entfernen oder Capture ohne OS-Cursor machen → wirkt sonst wie fremdes Asset.
- Uhr 12:02 ↔ Sternenhimmel → siehe f1, hier besonders offensichtlich, weil sonst nichts im Bild passiert.

**`clip_ambient_etage1__f3.png`**
- Dritte E1-Figur (x≈680) → Spawn nur an Türen/Aufzug zulassen; nächstgelegene Tür ist >150 px entfernt → Herkunft muss lesbar sein.
- E3-Läufer (x≈860 nach x≈710 in f1) → Wegpunkte loggen; wenn dasselbe Sprite, fehlt die Zwischenstrecke → Bewegungsdaten korrigieren.
- Label-Flucht → alle Chips (Etagen- UND Raum-Labels) linksbündig zur Gebäudeinnenkante x≈265 ausrichten → eine statt zwei Fluchten im Schlitzband.

**`clip_ambient_etage1__f4.png`**
- E2-Figur (x≈730) vs. Kopierer (x≈735) → Kopierer ist Rückwand-Mobiliar, muss VOR der Figur gerendert werden → Z-Order nach y-Sortierung, Figur verschwindet hinter dem Gerät.
- E3-Läufer (x≈545) → siehe f3, Positionsprung bleibt unerklärt.
- Keller-Automat → LED-Blinken (Stil-Guide „Ambient 2–4 Frames") verifizieren; über 4 Stills konstantes Leuchten ist verdächtig statisch.

**`clip_ambient_etage2__f1.png`**
- Dachkante → Kamera-Clamp so setzen, dass ≥8 px Himmel über dem höchsten Dachobjekt bleiben → Gebäude hört nicht hart am Screenrand auf.
- ETAGEN ▲▼ (x≈1010/y≈33) → eigenen Chip-Hintergrund wie die Etagen-Labels geben → Control löst sich optisch von der Dachgrafik.
- Zwei E3-Figuren (x≈800/840) → Mindestabstand 24 px zwischen Ambient-NPCs erzwingen → keine Deckungsgleichheit.
- Anzugsfigur E2 in Tür (x≈665) → Sprite 1–2 px absenken, Kopf frei vom Türrahmen-Oberkante → saubere Rahmenung.
- Uhr 12:27 ↔ Nacht → siehe Clip 1.

**`clip_ambient_etage2__f2.png`**
- E3-Wasserspenderflasche (x≈595) → Sättigung um ~20 % senken oder Figurenkontrast erhöhen → Blickpriorität zurück zu den Sprites.
- E3-Läufer (x≈505) → 2 px anheben aus der roten Sockelleiste → Bodenkontakt.
- Belegungswechsel E4 voll→leer→voll über f1–f4 → Despawn erst nach komplettem Korridordurchlauf oder mit 200–300 ms Fade → kein Flackern.

**`clip_ambient_etage2__f3.png`**
- E3 komplett leer → Regel: nie zwei Nachbaretagen gleichzeitig unbesetzt; Notfall-Idle-Sprite hinter dem Newsroom-Glas → Bandmitte stirbt nicht aus.
- E4-Läufer (x≈635) → 8–16 px von der Türmittellinie wegbewegen → liest sich sonst als Türblockierer.
- Cursor (x≈492) klebt am E4-Poster → Capture bereinigen → der einzige warme Akzent der Etage wirkt nicht „angeklebt".

**`clip_ambient_etage2__f4.png`**
- E2-Figur (x≈755) vor Kopierer → Z-Order wie `clip_ambient_etage1__f4`.
- E3-Doppelbelegung nach Leerstand → Spawn-Regel wie f2.
- Sidebar: zweiter „K"-Button (y≈240) → Kürzel disambiguieren (z. B. „KA"/"KO") oder Tooltips sichtbar machen → Duplikat wirkt wie Bug.

**`clip_ambient_etage3__f1.png`**
- ETAGEN-Control überlappt Dachträger (x≈1010) → 12 px nach links oder Dachart dort freistellen → Control lesbar halten.
- Anzug E3 (x≈890) ~10 % größer als Läufer auf gleicher Bodenebene → Spritehöhen vereinheitlichen oder Größenstaffel nur bei echten Tiefenversätzen → Maßstab muss regelgeleitet sein.
- Drei Figuren auf einer Etage → als Maximaldichte definieren und dokumentieren → dieser Frame ist der gute Referenzfall.
- Offene Tür + eintretende Figur → als Standard-Spawn-Choreografie festhalten → glaubwürdigstes Detail des Pakets.

**`clip_ambient_etage3__f2.png`**
- Läuferbewegung x≈695→735 → als Referenz-Geschwindigkeit dokumentieren und alle anderen Spawns daran kalibrieren → Konsistenzanker.
- Neue E2-Figur (x≈510) ohne Spawnquelle → Spawn-Regel wie oben.
- Himmel/Nacht → siehe Clip 1.

**`clip_ambient_etage3__f3.png`**
- E2-Figur aus f2 bereits weg → Mindestverweildauer (mehrere Sekunden) oder Ein-/Ausblendung → kein Ein-Frame-Leben.
- E3-Läufer x≈735→680 → Wende vermutet; Turnaround-Animation und Richtungswechsel im Clip prüfen (aus Stills nicht entscheidbar).
- Anzug E3 seit f1 statisch → Idle-Atmen (4 Frames lt. Stil-Guide) im Volldatei-Clip verifizieren.

**`clip_ambient_etage3__f4.png`**
- E1-Figur (x≈520) an Aktenschrankkante → Überlappungsordnung prüfen; bei Rückwand-Möbel gilt: Möbel vor Figur → konsistente y-Sortierung.
- E2-Figur am Kopierer → Z-Order wie bisher zweimal angemerkt.
- Vier belebte Ebenen → diesen Belegungsgrad als Soll-Zustand definieren → f1–f3 sollen sich dem annähern statt dagegen zu pendeln.

---

## 3. Grafiken / Assets

- **Tragen:** Gebäudeschnitt mit Keller-Erdreich und Rohrleitungen (`clip_ambient_etage1__*`, unteres Drittel) — beste Erzählleistung im Paket. Der cyan Automat, das rot-abstrakte E4-Poster und die offene Tür in `clip_ambient_etage3__f1` passen zu Stil-Guide (Tech-Cyan, konstruktivistisches Poster, dosiertes Rot).
- **Fremd/widersprüchlich:** Der weiße OS-Handcursor klebt in allen 12 Frames an derselben Stelle — kein Spiel-Asset, muss aus der Ernte raus. Der Sternenhimmel bei 12:02/12:27 ist kein Stilproblem, sondern ein Logikbruch zwischen DayNight-System (manifest: `sky_1200`) und HUD-Uhr.
- **Skalierung:** EG-Lobby nutzt deutlich größere Bodentiles und Sprites als die Obergeschoss-Korridore. Als Tiefen-Cue legitim, aber der Sprung ist abrupt und ohne Vermittlungszone. Der graue Anzug (E3) ist größer als gleichzeitige Läufer auf derselben Ebene — Maßstab muss regelgebunden sein.
- **Beschnitt:** In `clip_ambient_etage2__*` wird die Dachkante bei y=0 hart gekappt; in `clip_ambient_etage1__*` fehlt der ETAGEN-Schalter (vermutlich mitgescrollt) — Kameragrenzen definieren.
- **Fehlend und am meisten wert:** Eine Rezeption/Theke im leeren EG-Boden (Bildmitte, x≈500–700) — die größte Freifläche des Screens ist zugleich die auffälligste Leerstelle. Zweitens: Kontaktschatten als Standard-Bestandteil jedes Charakter-Sprites.

## 4. Raster & Rhythmus

- Die Etagenbänder sind gleichmäßig getaktet (~85–110 px Höhe, saubere Steg-Zwischenräume) — das Grundraster stimmt und trägt alle Clips.
- Unruhe entsteht ausschließlich im Labelband: Etagen-Chips linksbündig, Raum-Chips mittig/rechts (`clip_ambient_etage1__f1`: „Etage 1 – Zentrale" links, „Direktor / Zentrale · Kurator" mittig, „Ihr Büro" rechts) — drei Ausrichtungen auf einem Streifen.
- Tote Fläche: E3-Korridor in `clip_ambient_etage1__f2`, E3 komplett in `clip_ambient_etage2__f3`, EG-Mitte in allen Frames.
- Rechte Papier-Sidebar (x≈1237 ff.) kollidiert unten mit dem PUBLIKUM-Button; oben beginnt sie erst unter der Uhr — der vertikal versetzte Start wirkt unfreiwillig.
- Der Ticker (y≈685–715) ist als Vollbreite-Rhythmusgeber gut gesetzt und trennt Welt von UI klar.

## 5. Lesbarkeit

- Etagen-/Raum-Labels: weiße Mono-Schrift auf Schwarz, sehr klein (~9–10 px) — Kontrast stimmt, Größe grenzwertig; beim „· Kurator"-Anhang muss ich zweimal hinsehen.
- Sidebar-Buttons K/M/A/K/I: Einzelbuchstaben ohne Beschriftung, dazu **doppeltes „K"** — nicht zuordenbar ohne Tooltip; schlechtestes Lesbarkeitslement des Pakets.
- Ticker: „STANDBY" in Grün und „MINISTERIUM SENDET" in Rot kämpfen in einer Zeile um die Signalfarbe; der Fließtext dahinter ist klein, aber lesbar.
- Uhr-Chip: bester Kontrast im Bild, klare Hierarchie — Referenz für die anderen Chips.
- „HUD · H" oben rechts ist so klein, dass die Tastenkombination erst beim zweiten Blick lesbar ist.

## 6. Die drei wirksamsten Änderungen

1. **Tageszeit-Tönung an die HUD-Uhr koppeln** (Sternenhimmel bei 12:02/12:27 eliminieren) — größter Glaubwürdigkeitsschaden des gesamten Pakets, und das Spiel handelt genau von Glaubwürdigkeit; Fix ist zentral und einmalig.
2. **Kontaktschatten unter allen Sprites + y-sortierte Z-Order gegen Rückwand-Möbel** — behebt den Schwebe-/Versink- und Vor-dem-Kopierer-Eindruck global, reine Render-Regel ohne neue Assets.
3. **Spawn/Despawn-Regel für Ambient-NPCs** (Erscheinen nur an Türen/Aufzug, Mindestverweildauer, Fade statt Pop) — das Poppen ist in jedem der drei Clips sichtbar und untergräbt den „belebtes Ministerium"-Kern der Idee.

## 7. Blinde Flecken

- **Echte Bewegung:** Geschwindigkeiten, Walk-Zyklen, Wenden, ob die Positionsprünge Teleporte verschiedener Individuen oder ein und derselben Figur sind — dafür brauche ich die Volldatei-Clips oder äquidistante Frames über die gesamte Laufzeit.
- **Idle-Verhalten:** Ob der unbewegte Anzug (E3) atmet und ob die Keller-LEDs blinken (Stil-Guide „Ambient"), ist aus 4 Endframes nicht prüfbar.
- **Interaktion:** Hover-Zustände der Türen/Hotspots, Klickziele, ob der ETAGEN-Schalter funktioniert und wie die Kamera-Scrolls zwischen `etage1→etage2→etage3` animiert sind.
- **DayNight-Übergang:** Wie die Tönung über die Zeit wechselt (manifest listet `sky_0900`…`sky_1800`) — einzelne Stills zeigen nur den Bruch, nicht das System.
- **Parallax/Layer:** Ob die Skyline sich beim Scrollen bewegt, ist aus vertikal versetzten Stills nicht ableitbar.
- **Auflösung:** Feinschrift (Label-Chips, Ticker) könnte im Original unscharf oder sauber sein — die hier vorliegende Bildgröße erlaubt dazu keine Aussage.
- **Cursor:** Ob der weiße Hand-Cursor Teil des Spiels oder der Aufnahme ist, muss der Ernte-Prozess beantworten.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
