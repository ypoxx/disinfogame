# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung

**Modell:** `stealth/ox-alpha` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-21
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-21T17:38:31.820Z · **Dauer:** 314.1 s
**Nutzung:** 15.629 Prompt + 12.271 Antwort Tokens · **Kosten:** $0.00 (gratis) · **Anbieter-Datensammlung:** ausgeschlossen (deny)

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

### Gezeigtes Anschauungsmaterial (8 Screenshot(s))

| Art | Im Text genannt als | Datei | Größe |
|---|---|---|---:|
| 🖼 Bild | `clip_elevator__f1.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_elevator__f1.png` | 926 kB |
| 🖼 Bild | `clip_elevator__f2.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_elevator__f2.png` | 1096 kB |
| 🖼 Bild | `clip_elevator__f3.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_elevator__f3.png` | 787 kB |
| 🖼 Bild | `clip_elevator__f4.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_elevator__f4.png` | 427 kB |
| 🖼 Bild | `clip_walkhome_dayreport__f1.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_walkhome_dayreport__f1.png` | 762 kB |
| 🖼 Bild | `clip_walkhome_dayreport__f2.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_walkhome_dayreport__f2.png` | 750 kB |
| 🖼 Bild | `clip_walkhome_dayreport__f3.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_walkhome_dayreport__f3.png` | 258 kB |
| 🖼 Bild | `clip_walkhome_dayreport__f4.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_walkhome_dayreport__f4.png` | 234 kB |

---

## Antwort des Modells

# Visual-Review: Animations-Clips (Elevator / Walkhome / DayReport)

Vorab die methodische Grenze: Ich sehe je Clip nur 4 Standbilder vom Ende der Animation. Laufzyklen, Geschwindigkeiten, Übergänge (Fade/Schnitt), Hover und Cursor-Verhalten kann ich nicht beurteilen — das ist in Abschnitt 7 gebündelt. Alles Folgende bezieht sich nur auf das, was in den Frames sichtbar ist.

---

## 1. Erster Eindruck

**`clip_elevator__f1.png`** — Das Auge hängt zuerst am gelben Auswahl-Kasten um Katjas Tür (Etage 2, Bildmitte), weil er der einzige hochgesättigte Kasten im Korridorband ist. Eigentlich sollte die Hauptfigur zuerst gelesen werden — der laufende Avatar auf Etage 1 (dunkler Anzug, Bildmitte-links) — aber er ist tonal kaum vom Korridor getrennt und trägt keinen Bodenschatten. Die Etagen-Labels (schwarze Kacheln an den Deckenkanten) geben einen guten horizontalen Rhythmus. Rechts bricht die Papierleiste mit den Shortcut-Kacheln (K/M/A/K/I) den Randfluss — sie schwebt mit eigenem Abstand zwischen Bildrand und Gebäude. Im Keller zieht der bunte Automat die Blick in die uninteraktive Zone.

**`clip_elevator__f2.png`** — Die Kamera ist eine Etage hoch gescrollt; der Blick klebt am gelben Label „Medien-Zentrum · Marina" (Etage 4, oben rechts). Der entscheidende Widerspruch: Der Avatar steht jetzt auf Etage 4, in f1 lief er noch auf Etage 1 — der Aufzug aber steht auf Etage 3. Figur und Fahrzeug erzählen zwei verschiedene Reisen. Der gelbe Tür-Kasten aus f1 (Katja, Etage 2) ist spurlos verschwunden, ohne am neuen Ziel wieder zu erscheinen. Die Uhr steht weiter auf 12:07 — bei Standbildern nicht auflösbar, ob pausiert oder schnell gereist. Etage 4 wirkt gegenüber den Etagen 1–3 auffällig leer eingerichtet.

**`clip_elevator__f3.png`** — Harter Schnitt in die Raum-Szene; das Auge geht zum Porträt rechts unten (Marina), dann zur Dialogzeile mit Typewriter-Cursor. Der größte inhaltliche Bruch: Durch die Fenster ist Nacht mit beleuchteter Skyline zu sehen — die Uhr sagt 12:37, und in f1/f2 war es draußen heller Tag. Das Porträt ist glatt antialiased und halbrealistisch gezeichnet und fällt aus der Pixel-Welt der Umgebung heraus. Die Cyan-Monitore auf dem Schreibtisch sind die zweitstärkste Blickfalle und konkurrieren mit dem Porträt. Die Dialog-Box klebt mit ihrem Text an der Oberkante und hat darunter ~60 % Leerraum.

**`clip_elevator__f4.png`** — Der Dialog ist aufgeklappt und deckt rund 80 % des Schirms; vom Raum bleibt nur ein Streifen oben. Die fünf Optionszeilen bilden einen sauberen Gleichmaß-Rhythmus, aber zwischen Fragetext und Trennlinie klafft eine große tote Fläche. Das „NEU"-Badge an Option [5] hängt halb außerhalb der Button-Unterkante — es wirkt abgeschnitten, nicht platziert. Die Kosten-Angaben („1 AP / 3K" usw.) rechts außen sind so klein, dass man zweimal hinsehen muss, um AP von K zu unterscheiden. Der Marker-Wechsel (★ bei [1], ▶ bei [2]–[4]) ist ohne Erklärung nicht lesbar.

**`clip_walkhome_dayreport__f1.png`** — Nacht-Version des Gebäude-Querschnitts; das FEIERABEND-Badge (rot auf Papier, oben rechts) ersetzt die Uhr und ist der erste Blickfang. Der gelbe Auswahl-Kasten sitzt jetzt an Igors Tür im Keller — also in der dunkelsten Zone des Bildes; die Markierung funktioniert, aber die Keller-Umgebung selbst ist kaum ablesbar. Der Avatar läuft auf Etage 1 Richtung Aufzug, wieder ohne Bodenschatten. Der Pförtner steht unverändert im Empfang — als Standbild korrekt verwurzelt. Der Himmel ist stimmig dunkel, die Sterne flirren allerdings bis direkt an die Badge-Kachel heran.

**`clip_walkhome_dayreport__f2.png`** — Fast dasselbe Bild, aber der Ausschnitt ist um geschätzt 25–30 px nach oben gerutscht: Das Label „Zielgruppen-Analyse" ist oben halb beschnitten — beschnittene Schrift ist das Erste, was das Auge als Fehler liest. Der Avatar ist jetzt im Aufzug auf Erdgeschoss-Höhe; er klebt ohne Schatten an der Kabinenkante und wirkt schwebend. Der Kamera-Drift hat keinen erkennbaren Anlass (die Figur ist ja nach *unten* gefahren). Die gelbe Igor-Markierung ist konsistent zu f1 beibehalten — das ist gut. Der Aufzug auf Etage 1 ist nun leer, was die Reise logisch macht.

**`clip_walkhome_dayreport__f3.png`** — Harter Schnitt zur Papier-Ansicht „LAGEBERICHT – TAG 1"; der Blick geht zum roten Titel, dann zur einzigen gefüllten Karte (② Das Land). Karte ① („Was wir ausspielen") ist zu ~80 % leer — zwei Textzeilen in einer Vollhöhen-Karte. Karte ③ („Die Gegenseite") hat dasselbe Problem. Die acht Milieu-Zeilen haben alle einen optisch identischen Balken: „ruhig" und „wütend" sind am Balken nicht unterscheidbar, die Kerninformation des Screens ist unsichtbar. Unten ist „ÜBER NACHT" angeschnitten, rechts am Rand geistern die abgedunkelten Shortcut-Kacheln durch das Overlay.

**`clip_walkhome_dayreport__f4.png`** — Von f3 praktisch nicht unterscheidbar; als Standbild kann ich keinen Unterschied feststellen (vermutlich Fade-Ende oder statischer Haltezustand). Alle Befunde aus f3 gelten unverändert: leere Karten ①/③, nicht unterscheidbare Milieu-Balken, beschnittene „ÜBER NACHT"-Sektion, HUD-Geister am rechten Rand. Die Kennzahlen-Zeile (Risiko 0X / Budget 150K / Aufmerksamkeit 0X) ist klar gruppiert, die Einheit „X" bleibt aber rätselhaft.

---

## 2. Konkrete Eingriffe je Screen

**`clip_elevator__f1.png`**
- Avatar (Etage 1, laufend) → 1 px hellen Umriss + elliptischen Bodenschatten in Sprite-Breite unter die Füße → Hauptfigur geht aktuell tonal im Korridor unter.
- Gelber Auswahl-Kasten (Katja-Tür, Etage 2) → auf die Türmaße koppeln (aktuell umschließt er Tür + Wandvorlage) und um ~20 % verkleinern → er wirkt wie ein Rechteck um ein fremdes Element, nicht wie eine Auswahl.
- Shortcut-Spalte rechts (K/M/A/K/I) → um ~16 px an den rechten Bildrand rücken, Kachelhöhe an die „HUD · H"-Kachel oben angleichen → die Spalte hat aktuell einen eigenen, abweichenden Randabstand.
- Keller-Band (unterste Etage) → Wand-/Bodenwerte um ~1 Stufe anheben, Automat-Farben entsättigen → der farbigste Punkt des Screens sitzt in der uninteraktiven Zone.
- Ticker unten → zwischen „STANDBY", „MINISTERIUM SENDET" und Fließtext je 1 em Abstand → drei Informationsebenen kleben aktuell als ein Block.

**`clip_elevator__f2.png`**
- Aufzug (steht auf Etage 3) vs. Avatar (steht auf Etage 4) → Aufzug auf Etage 4 stellen oder Avatar erst bei Ankunft der Kabine erscheinen lassen → Figur und Fahrzeug widersprechen sich sonst sichtbar.
- Gelber Tür-Kasten aus f1 → am neuen Ziel (Marina-Tür, Etage 4 rechts) wiederholen oder systematisch ganz entfernen → das Interaktions-Muster darf nicht je Frame verschwinden.
- Etage 4 → 1–2 Ambient-Objekte (Pflanze links neben der Tür, Aktenschrank rechts) mit Deckenabstand ≥ halber Objekthöhe ergänzen → Etage wirkt gegenüber 1–3 leer.
- „ETAGEN ▲"-Kachel (oben rechts) → an die Unterkante der ☰-Menü-Kachel ausrichten, gleiche Kachelhöhe wie die Uhr → aktuell eine dritte Kachelgröße im Kopfbereich.

**`clip_elevator__f3.png`**
- Fenster-Inhalt (Nacht-Skyline) → auf 12:37-Tageslicht umstellen oder Szenen-Zeitpuffer einführen → der Tag/Nacht-Widerspruch beschädigt die Glaubwürdigkeit der konsequent geführten Uhr.
- Marina-Porträt (rechts unten) → Kanten auf das Umgebungs-Pixelraster quantisieren (Posterize/Paletten-Limit), Schulterbreite ≈ 1,2× Couch-Sitzhöhe → der Stilbruch glatt vs. Pixel ist die größte Fremdheit im Bild.
- Dialog-Box → Textzeile vertikal zur Box-Mitte zentrieren oder Box-Höhe an Text koppeln → aktuell klebt der Text oben und lässt ~60 % Leerraum.
- Monitor-Inhalte (links) → Sättigung um 1 Stufe reduzieren → sie konkurrieren mit dem Porträt um den ersten Blick.

**`clip_elevator__f4.png`**
- „NEU"-Badge an Option [5] → vollständig innerhalb des Buttons platzieren, rechtsbündig neben dem Label mit 8 px Abstand → aktuell schneidet die Button-Kante das Badge.
- Optionsblock → um ~40 % der Leerfläche nach oben ziehen, Box-Höhe an Inhalt koppeln → die tote Fläche liegt genau in der Blickachse zwischen Frage und Antwort.
- Kosten-Angaben („1 AP / 3K") → Icon + Text auf ≥ 1,3× skalieren, rechtsbündig an eine gemeinsame Kante → Unterscheidung AP/K erfordert aktuell zweites Hinsehen.
- Marker (★ bei [1], ▶ bei [2]–[4]) → ★ ausschließlich für Story-Option reservieren und beim ersten Auftreten einmalig erklären → Semantik ist nicht ablesbar.
- Raum-Streifen oben → mindestens Kopfbandhöhe freihalten und um ~20 % abdunkeln → gibt Orientierung, in welchem Raum der Dialog stattfindet.

**`clip_walkhome_dayreport__f1.png`**
- Keller-Band → Boden-/Wertflächen um 1 Stufe anheben, gelben Kasten beibehalten → das Ziel darf nicht der einzige lesbare Punkt der Etage sein.
- FEIERABEND-Badge → Uhrzeit klein daneben setzen (z. B. „17:40") → das Spiel führt sonst durchgehend Zeit; ausgerechnet der Tagesabschluss hat keine.
- Laufweg Avatar (Etage 1) → Möbel (Aktenschrank) aus der direkten Route zum Aufzug räumen → im Standbild wirkt die Route verbaut.
- Sternfeld → Dichte im Bereich um die Badge-Kachel reduzieren → Funkeln konkurriert mit dem wichtigsten Status-Element.

**`clip_walkhome_dayreport__f2.png`**
- Kamera-Drift (~25 px nach oben zwischen f1 und f2) → Kamera an Aufzugsposition koppeln oder hart schneiden → unmotiviertes Nachziehen liest sich als Ruckler.
- Avatar im Aufzug (EG-Höhe) → Bodenschatten + 2 px Luft zur Kabinenrückwand → die Figur klebt aktuell an der Kante und wirkt schwebend.
- „Zielgruppen-Analyse"-Label (oben beschnitten) → Kamera-Clamp so setzen, dass Label-Kacheln nie halb beschnitten sind → beschnittene Schrift ist der stärkste Fehler-Reiz.

**`clip_walkhome_dayreport__f3.png`**
- Karte ① „Was wir ausspielen" → Höhe an Inhalt koppeln (max. 3 Zeilen) oder die letzten 2–3 geplanten Maßnahmen als Vorschau einfüllen → 80 % Leerraum in der wichtigsten Rückblick-Karte.
- Milieu-Balken (Karte ②) → sichtbaren Füllstand einführen: Füllbreite proportional zur Unruhe, Skala von „ruhig" (links) bis „wütend" (rechts) → aktuell sind alle Zustände optisch identisch.
- Karte ③ „Die Gegenseite" → Mindesthöhe an Karte ② koppeln, Restfläche mit letztem Gegner-Event füllen → die asymmetrische Leere zieht den Blick ins Nichts.
- Shortcut-Kacheln (rechts, durch Overlay schimmernd) → Overlay auf volle Bildbreite erweitern oder HUD beim DayReport komplett ausblenden → halbtransparente UI-Reste wirken wie Rendering-Fehler.
- „ÜBER NACHT" (unten beschnitten) → entweder vollständig in den ersten Viewport holen oder Scroll-Indikator (Chevron, 8 px Abstand) → angeschnittene Sektion ohne Mehrinhalt-Hinweis.

**`clip_walkhome_dayreport__f4.png`**
- Identisch zu f3 — alle Eingriffe von f3 gelten unverändert.
- Zusätzlich: Falls f4 bewusst ein anderer Animationszeitpunkt sein soll (Count-up, Balkenfüllung), ist davon im Standbild nichts messbar → siehe Abschnitt 7; wenn f4 statisch ist, ist der Frame redundant und kann aus der Ernte entfallen.

---

## 3. Grafiken / Assets

**Tragen:** Das Gebäude-Querschnitt-Set (`clip_elevator__f1/f2`, `clip_walkhome_dayreport__f1/f2`) ist das stärkste Asset-Paket: konsistente Etagen-Module, Türen, Label-Kacheln, plausibler Maßstab der Figuren zu Türen (Kopfhöhe ≈ ⅔ Türhöhe). Die Papier-UI des DayReports setzt die im `theme.ts` verankerte v3-Materialwelt (surface/document-Töne, ministryRed nur für den Titel) sauber um — Bild und Stil-Bibel passen hier zusammen.

**Fremd:** Das Marina-Porträt (`clip_elevator__f3/f4`) — glatte Anti-Alias-Optik, andere Auflösungswelt, andere Zeichnungstradition als die Pixel-Umgebung. Auch das Mini-Porträt in der Dialog-Kopfzeile ist ein drittes Rendering (nochmal anders als Großporträt und Spielfiguren). Die Raum-Szene Medien-Zentrum ist höher aufgelöst und weicher gezeichnet als die Gebäude-Sprites — als „Vertiefungs"-Ansicht vertretbar, aber der Nacht-Himmel vor 12:37-Uhr bricht die Logik.

**Falsch beschnitten:** „NEU"-Badge (`clip_elevator__f4`), „Zielgruppen-Analyse"-Label (`clip_walkhome_dayreport__f2`), „ÜBER NACHT"-Sektion (`clip_walkhome_dayreport__f3/f4`).

**Fehlt:** Bodenschatten unter allen Lauf-Figuren (Gebäude-Clips); eine Skalenbeschriftung an den Milieu-Balken im DayReport; im Keller eine einzige Ambient-Lichtquelle, damit die gelbe Markierung nicht der einzige Kontrast ist.

---

## 4. Raster & Rhythmus

- **Gebäude-View:** Etagen-Labels sitzen zuverlässig an den Deckenkanten — guter, wiederholter Rhythmus. Die rechte Shortcut-Spalte hat einen eigenen Randabstand und bricht die rechte Kante; der Kopfbereich hat drei unterschiedliche Kachelhöhen (Uhr, ☰, HUD·H, ETAGEN▲).
- **Dialog (`clip_elevator__f4`):** Optionszeilen sind gleich hoch und gleich eingerückt — sauberes Gleichmaß. Der vertikale Rhythmus ist aber gestört: großes Luftloch zwischen Text und Optionsblock, Badge außerhalb der letzten Zeile.
- **DayReport:** Das 3-Spalten-Raster oben ist gleichbreit und gut. Die Kennzahlen-Leiste darunter drittelt die Breite *anders* als das Spaltenraster darüber — „RISIKO" sitzt über der Fuge zwischen Karte ① und ② statt unter einer Kartenmitte. Die Deutungshoheit-Bar als Fuß über die volle Breite funktioniert.
- **Tote Fläche:** Karte ① und ③ (DayReport), Dialog-Mitte (`f4`), Etage 4 (`clip_elevator__f2`).
- **Unruhe:** Sternfeld bis an die Badge-Kachel (`walkhome f1`), schimmernde HUD-Reste am rechten Rand (DayReport), drei Gelb-Bedeutungen (Label-Highlight, Auswahl-Kasten, NEU-Badge) ohne visuelle Unterscheidung.

---

## 5. Lesbarkeit

- **`clip_elevator__f4`, Kosten-Icons:** „1 AP / 3K" — die Icon-Glyphen sind so klein, dass ich zweimal hinsehen musste, um AP (Aufwand) von K (Kosten) zu unterscheiden. Kontext rettet es, Design nicht.
- **DayReport, „0X":** Ist es „0×" (Faktor)? In der Pixelschrift nicht erkennbar; außerdem uneinheitlich zu „150K" — zwei Einheitensysteme in einer Zeile.
- **DayReport, Milieu-Balken:** Die Textwerte („ruhig" … „wütend") sind klein, aber lesbar — die Balken darunter widersprechen ihnen nicht, sie sagen schlicht nichts. Das ist der schlimmste Lesbarkeitsfall: ein Diagramm ohne Datenkodierung.
- **Gelb-System:** Label-Highlight, Auswahl-Kasten und NEU-Badge nutzen alle dasselbe Gelb für drei verschiedene Bedeutungen (Ziel/Hover, Auswahl, Neu) — Zustände sind nicht unterscheidbar.
- **Ticker:** „MINISTERIUM SENDET" in Rot auf Schwarz ist im Kontrast grenzwertig klein; „STANDBY" in Grün funktioniert.
- **Dialog-Text:** Monospace-Weltschrift, gute Zeilenlänge, klarer Cursor — das ist in Ordnung.

---

## 6. Die drei wirksamsten Änderungen

1. **Tag/Nacht-Fehler in `clip_elevator__f3/f4` beheben** (Fenster zeigen Nacht bei 12:37) — nahezu kostenfreie Textur-/Tönungsänderung, aber sie repariert die Glaubwürdigkeit des gesamten Tageszeit-Systems, auf das das Spiel sonst überall verlässt sich.
2. **Milieu-Balken im DayReport mit sichtbarem Füllstand versehen** — mittlerer Aufwand, aber der Screen verkauft aktuell seine Kerninformation (Gesellschaftszustände) gar nicht; nach dem Fix wird der Lagebericht vom Deko-Screen zur eigentlichen Tagesbilanz.
3. **Aufzug-/Avatar-Logik im Gebäude-Clip konsistent koppeln** (`clip_elevator__f1→f2`: Figur Etage 1→4, Kabine Etage 1→3) — die Bewegungslogik ist das Herz des Querschnitts-Views; ohne sie liest der Spieler jede Figurenbewegung als Zufall oder Bug.

---

## 7. Blinde Flecken

- **Laufzyklen und -geschwindigkeit:** Nur je 2 Gebäude-Frames pro Clip — ich kann nicht beurteilen, ob die Gang-Animation stimmig ist, wie schnell der Avatar läuft oder ob er im Aufzug mitfährt oder teleportiert wird. Der f1→f2-Sprung ist als Diskontinuität benannt, als Bewegung aber nicht verifizierbar.
- **Aufzug-Verhalten:** Tür-Animation, Kabinen-Innenleben, ob der Avatar sichtbar einsteigt — nicht erkennbar.
- **Typewriter und Cursor:** Nur Endzustände gesehen (`f3` mitten im Wort, `f4` fertig); Tempo und Cursor-Blinken unbekannt.
- **Hover/Fokus:** Keine Cursor-Position sichtbar; ob die gelben Kästen Hover- oder persistenter Auswahl-Zustand sind, und ob die Optionszeilen (`f4`) Hover- und Tastatur-Fokus-Zustände haben, kann ich nicht sagen.
- **DayReport-Animation:** `f3` und `f4` sind standbildidentisch — ob Zahlen hochzählen oder Balken sich füllen, ist nicht erkennbar; ich brauche Frames aus dem *Beginn* des Clips.
- **Übergänge:** Der Schnitt Gebäude→Raum-Szene (`f2→f3`) und DayReport→Gebäude — Fade, Wipe oder harter Schnitt — ist aus Endframes nicht beurteilbar.
- **Auflösung/Skalierung:** Nur eine Auflösung (~1280×720) gesehen; Skalierungsverhalten der Pixel-Assets bei anderen Fenstergrößen unbekannt.
- **Nacht-Zustand der Raum-Szenen:** Ich habe nur das Medien-Zentrum bei „12:37" gesehen — ob Raum-Szenen überhaupt eine Tageszeit-Tönung besitzen, wäre mit einem Nacht-Beispiel zu prüfen.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
