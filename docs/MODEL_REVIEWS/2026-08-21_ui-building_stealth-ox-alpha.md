# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „building"

**Modell:** `stealth/ox-alpha` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-21
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-21T16:57:37.470Z · **Dauer:** 339.1 s
**Nutzung:** 18.320 Prompt + 9.661 Antwort Tokens · **Kosten:** $0.00 (gratis) · **Anbieter-Datensammlung:** ausgeschlossen (deny)

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

# UX/UI-Durchgang — Bündel „building" (10 Screenshots)

## 1. Erster Eindruck

**`building_lobby_day.png`**
Das Auge landet zuerst auf dem Uhr-Chip oben rechts (goldener Rahmen, 11:00) und dann auf dem gelben Rahmen im Keller — beides Akzente, aber keins ist der eigentliche Inhalt. Der Blick sollte zuerst zum Avatar finden (EG, links im Foyer) und von dort die Stockwerke hochlesen; stattdessen konkurrieren drei Beschriftungsebenen (Stockwerk-Tags innen links, schwebende Raum-Labels über den Deckenkanten, gelber Ziel-Rahmen) um Aufmerksamkeit, ohne Hierarchie. Die Gebäude-Silhouette ist sauber gezeichnet und gut lesbar gegliedert. Der größte Widerspruch: Es ist 11:00 Uhr, der Himmel zeigt aber Sterne und Nachtblau — Bild und behauptete Tageszeit gehen auseinander. Rechts bleibt zwischen Gebäudekante und Button-Leiste eine tote Himmelsfläche, links ebenfalls; das Gebäude sitzt nicht im Raster der Fläche.

**`pfoertner_bubble.png`**
Identischer Stand zu `building_lobby_day`, einzige Änderung ist die Sprechblase beim Pförtner — und genau sie wird zum Blickfang, was hier korrekt ist. Die Blase ist ein dunkles Panel mit weißer Mono-Schrift, drei Zeilen, nach rechts versetzt auf Kopfhöhe. Problem: Sie schwebt frei ohne erkennbaren Schwanz zum Sprecher und ihre Unterkante rutscht bis direkt über das Label „Finanzen / Tresor · Igor" — zwei Textebenen fast ohne Luft. Die dunkle Blase passt stilistisch zu den dunklen Stockwerk-Tags, bricht aber mit der Papierwelt der Bedienebene; das ist vertretbar (diegetisch vs. UI), sollte aber bewusst entschieden sein. Der Text selbst ist klein, aber kontrastreich lesbar.

**`building_etage4.png`**
Kamera nach oben mitgerückt: Etage 4 voll sichtbar, darüber angeschnittene Dachtechnik (HVAC-Blöcke enden hart an der Bildkante). Das winzige „ETAGEN ▲▼" über dem Aufzugsschacht ist das wichtigste Navigations-Element des Screens und gleichzeitig das unauffälligste — ich habe es erst beim zweiten Hinsehen gefunden. Der Avatar steht rechts auf E4 neben dem Aufzug, als grauer Anzug figur jedoch optisch nicht vom NPC-Typ „Kurator" (E1) unterscheidbar. Die drei Raum-Labels oben („Cyber-Lab · Alexei", „Operationszentrale", „Medien-Zentrum · Marina") kleben an der obersten sichtbaren Deckenkante und wirken dort wie Überschriften des ganzen Bildes, nicht von E4.

**`building_etage3.png`**
Aufzugstür auf E3 offen, zwei Figuren auf der Etage (Avatar in Blau Mitte, graue Figur rechts davor) — wer davon der Spieler ist, erschließt sich nur aus der Bewegungsposition, nicht aus dem Bild. Die offene Tür rechts ist der stärkste Sog-Punkt, obwohl sie vermutlich nur Deko/Zustand ist. Etage 2 darunter wirkt leer und dunkel, was den Kontrast zur belebten E3 erhöht — gut für Blickführung, schlecht für die Wahrnehmung „das ganze Haus lebt". Zeit 12:34, Himmel weiterhin Nachtblau mit Sternen — derselbe Widerspruch wie in der Lobby.

**`building_etage2.png`**
Vertikaler Kamera-Offset anders als in den Nachbar-Shots: Hier ist oben ein Streifen Dach sichtbar, in `building_lobby_day` fehlt E4 komplett — die Bildfenster springen zwischen den Aufnahmen, ohne dass ein Anker (z. B. immer volle Hausbreite + feste Unterkante) erkennbar wäre. Auf E2 steht eine Figur mittig an der Tür, auf E4 laufen zusätzlich zwei Figuren — vier beschriftete Ebenen plus zwei Figurenpaare ergeben viel Verteil-Aufmerksamkeit ohne Fokus. Das gelbe Interaktions-Highlight fehlt hier völlig, obwohl der Avatar offenbar vor einem Ziel steht — der Zustand „hier ist etwas tun-bar" wird nicht angezeigt.

**`building_etage1.png`**
14:28 Uhr, jetzt oranger Sonnenuntergangs-Himmel — die Tageszeit-Tönung funktioniert also grundsätzlich, ist aber zur Uhrzeit verschoben (14:28 ist kein Sonnenunterstand). Avatar und Kurator stehen nebeneinander an der Zentrale-Tür, beide in Grautönen, nahezu gleiches Format — Verwechslungsgefahr maximal. Die offene dunkle Tür auf E3 rechts zieht erneut den Blick nach oben weg vom Geschehen. Die warme Himmelstönung kontrastiert schön mit dem kühlen Innenleben; das ist die stimmigste Stimmung des Bündels.

**`building_keller.png`**
15:30, Avatar steht im Keller direkt vor der gelb gerahmten Tür, daneben weiter links eine blass-blaue Figur (vermutlich Igor). Der gelbe Rahmen ist haardünn (1 px) und geht im beleuchteten Türinnenraum fast unter — das zentrale „Hier interagieren"-Signal hat die schwächste Optik im Bild. Das Label „Finanzen / Tresor · Igor" hängt über der Deckenkante zwischen EG und Keller und ist weder klar der Keller-Ebene noch dem Rahmen zugeordnet. Zwei Figuren plus Rahmen plus Label im schmalen Kellerstreifen: engste Stelle des gesamten Hauses, braucht klare Zuordnung.

**`poster_detail.png`**
Der Screenshot zeigt **nicht** das angekündigte Plakat-Detail-Overlay, sondern den „LAGEBERICHT – TAG 1"-Bildschirm (Redaktionsschluss): drei Papierkarten, Kennzahlenband, Deutungshöhe-Balken. Zum Inhalt, der zu sehen ist: Die Karte ① „Was wir ausspielen" enthält zwei Textzeilen und darunter ca. 80 % leere Papierfläche, Karte ③ „Die Gegenseite" eine einzelne kursivzeile bei gleicher Höhe — tote Fläche dominiert beide. Karte ② „Das Land" ist die einzige gefüllte und zieht den Blick, gut. Die Milieu-Balken tragen alle dieselbe Länge und einen winzigen roten Rest-Tick links — die Werte (ruhig/misstrauisch/wütend) sind nur über das Wort rechts lesbar, die Balken codieren nichts Sichtbares. Hauptbefund bleibt: Capture und Manifest-Beschreibung passen nicht zusammen.

**`ambient_bubble.png`**
Pixelidentisch mit `poster_detail.png` — derselbe Lagebericht-Stand, keine Sprechblase, kein Flur-Statist zu sehen. Damit sind zwei von zehn Aufnahmen des Bündels doppelt vorhanden und liefern den angekündigten Inhalt gar nicht. Am sichtbaren Bild selbst: Der Untertitel unter dem roten Kopfband („Tagesbericht …") ist im Dunkel hinter dem Titel kaum entzifferbar — zweimal hingesehen müssen sowieso alle. Die rechte Bildkante zeigt den angeschnittenen Rest der Buchstaben-Button-Leiste im abgedunkelten Hintergrund — dort liegt ein halbes UI-Element im Modal-Schatten, das weder aktiv noch klar deaktiviert wirkt.

**`building_avatar_f.png`**
11:30, Layout identisch zu `building_lobby_day`; der weibliche Avatar steht auf E1 neben dem Kurator. Bei dieser Sprite-Größe ist die Variante f von der männlichen Figur praktisch nicht zu unterscheiden — Silhouette, Haarfarbe und Farbgebung liegen zu nah beieinander; die angekündigte Kopplung Porträt→Sprite lässt sich aus diesem einen Shot nicht prüfen. Wieder Sternenhimmel bei Vormittagszeit. Die Doppelbeschriftung „Direktor / Zentrale · Kurator" (schwebend) plus „Etage 1 – Zentrale" (Tag) verdoppelt denselben Sachverhalt auf engstem Raum.

---

## 2. Konkrete Eingriffe je Screen

**`building_lobby_day.png`**
- Doppeltes Beschriftungssystem (Stockwerk-Tag innen + schwebendes Raum-Label über der Decke) → zu einer Ebene zusammenlegen: Raum-Label in den Stockwerk-Tag integrieren („E2 · Feld-Operationen · Katja"), schwebende Labels streichen → halbiert Textmenge, eliminiert die Mehrdeutigkeit, an welcher Kante ein Label hängt.
- Himmels-Tönung bei 11:00 → auf Tag-Palette (helles Blau, kein Sternenfeld) setzen oder Uhr logisch koppeln → Sternenhimmel zur Mittagszeit zerstört die Glaubwürdigkeit der Welt, die das Spiel gerade aufbauen muss.
- Gelber Ziel-Rahmen (Keller-Tür) → von 1 px Linie auf 2 px Doppellinie + 15 % gelbe Füllung + 4 px Eckwinkel vergrößern → das wichtigste Interaktions-Signal ist derzeit das schwächste Element.
- Rechte Button-Leiste (K/M/A/K/I) → in einen gemeinsamen Papier-Container mit 8 px Innenabstand setzen, rechtsbündig mit dem Uhr-Chip fluchten → fünf lose Quadrate ohne Träger wirken wie Debug-Reste.
- „PUBLIKUM"-Button unten rechts → vollständig ins Bild holen, 16 px Abstand zur rechten Kante → aktuell angeschnitten, wirkt defekt.
- Gebäude horizontal → um ca. eine halbe Himmelsflächenbreite nach rechts zentrieren zwischen linke Bildkante und UI-Leiste → beide Seiten currently asymmetrisch leer, Blick pendelt ins Nichts.

**`pfoertner_bubble.png`**
- Sprechblase → Schwanz/-Dreieck zur Sprecherfigur ergänzen, Blase 12 px über Kopfhöhe anheben → ohne Zeiger ist der Sprecher bei mehreren Figuren nicht zuordenbar.
- Blasen-Unterkante → mind. 12 px Luft zum Label „Finanzen / Tresor · Igor" darunter → zwei Textblöcke kleben aktuell zusammen.
- Blasenbreite → auf max. 40 % der Lobby-Breite begrenzen, Text auf 3 Zeilen umbrechen wie gehabt → Blase frisst sonst die halbe Bühne.
- Blasen-Panel → Rand in `borderLight` (#8A7A5F) statt reinem Schwarzton → bindet die Welt-Blase an die Papier-Token, ohne sie zur UI zu machen.

**`building_etage4.png`**
- „ETAGEN ▲▼" → 1,5× vergrößern, in einen kleinen Papier-Chip setzen und rechtsbündig unter den Uhr-Chip clustern → zentrales Nav-Element darf nicht kleiner sein als Deko-Labels.
- Dachtechnik oben → entweder komplett zeigen oder sauber an der Parapet-Kante abschneiden → aktueller Mid-Equipment-Cut wirkt wie ein Renderfehler.
- Avatar auf E4 → Spieler-Marker (schmaler Ring oder kleines Dreieck über dem Kopf in `ministryRed`) → grauer Anzug auf grauem Beton ist vom NPC nicht unterscheidbar.
- Raum-Labels der obersten Etage → 8 px tiefer setzen, so dass sie eindeutig innerhalb des E4-Streifens liegen → aktuell lesen sie als Bildtitel.

**`building_etage3.png`**
- Offene Tür rechts auf E3 → wenn nicht interaktiv: Zustand visuell entschärfen (Tür zu animieren oder Innenraum abdunkeln) → hellster Punkt im Bild lenkt vom Avatar weg.
- Avatar (blaues Shirt, Mitte) → Marker wie oben; zusätzlich NPC-Namensmini-Label nur bei Hover/Nähe → zwei Figuren pro Etage brauchen Identifikation.
- Leere E2 unterhalb → mindestens ein Ambient-Element (Figur, Lichtwechsel) → der Kontrast „belebt oben/tot unten" liest sich currently als Fehler, nicht als Stimmung.

**`building_etage2.png`**
- Kamera-Anker → festes Framing definieren (z. B. Unterkante immer Keller-Decke oder immer volle Hausbreite) → die Sprünge zwischen den Shots zeigen, dass jedes Framing anders croppt.
- Interaktions-Highlight an der Tür vor der Figur → gleichen gelben Rahmen wie in `building_keller` verwenden → Zielzustand ist etagenweise inkonsistent sichtbar/unsichtbar.
- Zwei laufende Figuren auf E4 im selben Streifen wie das Raum-Label → Laufbahn min. 20 px unter die Label-Unterkante legen → Überlappung von Sprite und Text erzeugt Unruhe.

**`building_etage1.png`**
- Sonnenuntergangs-Palette bei 14:28 → Tönungs-Kurve zur Uhrzeit kalibrieren (Orange frühestens ab ~17:00) → siehe `building_lobby_day`, gleicher Systemfehler in der Gegenrichtung.
- Avatar + Kurator nebeneinander → Spieler-Marker + 8 px Mindestabstand der Sprites → aktuell ein verschmolzener Graubrei aus zwei Figuren.
- Offene dunkle Tür E3 rechts → analog `building_etage3` behandeln.

**`building_keller.png`**
- Gelber Rahmen → 2 px Doppellinie + Füllung (siehe Lobby) und exakt um die Türfläche, nicht um Tür + umgebende Wand → Rahmen wirkt currently beliebig platziert.
- Label „Finanzen / Tresor · Igor" → direkt über den gelben Rahmen setzen (8 px Abstand zur Rahmenoberkante), nicht auf die Deckenkante zwischen EG und Keller → Zuordnung Rahmen↔Label↔Etage muss in einer Achse liegen.
- Blass-blaue Figur (Igor?) → gleiche Kontrastbehandlung wie alle NPCs oder Namens-Tag → halbtransparent wirkende Sprites lesen sich als Rendering-Bug.
- Kellerstreifen insgesamt → vertikal 10–15 % mehr Höhe oder weniger Objekte → engster Streifen trägt hier die meisten Signale (Rahmen, 2 Figuren, Label, Automat).

**`poster_detail.png`** *(zeigt Lagebericht, nicht Plakat)*
- Karten ① und ③ → Höhe an Inhalt koppeln oder mit Leerzustands-Inhalt füllen (z. B. „Heute kein Stück" durch letzte Auspielung + Hinweis ersetzen) → 80 % Papierfläche leer entwertet das Papier-Design.
- Milieu-Balken in ② → Balkenlänge an tatsächlichen Wert koppeln, roter Tick als Marker auf der Skala → aktuell sind sieben gleich lange Balken reine Dekoration.
- Untertitel unter „REDAKTIONSSCHLUSS" → Kontrast anheben (`textSecondary` statt Dunkelrot-auf-Dunkel) oder streichen → unlesbarer Text ist schlechter als keiner.
- Rechte Bildkante → abgeschnittene Button-Leiste im Modal-Zustand entweder ganz abdunkeln/sperren oder ausblenden → halbsichtbares UI im Hintergrund ist Rauschen.

**`ambient_bubble.png`** *(identisch mit `poster_detail.png`)*
- Capture-Kette fixen: Screenshot zeigt Lagebericht statt Flur-Statist → Aufnahme wiederholen → ohne neues Capture ist dieser Screen nicht bewertbar (siehe Blinde Flecken).
- Falls der Lagebericht tatsächlich gemeint war: Duplikat entfernen, ein Shot reicht.

**`building_avatar_f.png`**
- Sprite Variante f → unterscheidendes Silhouetten-Merkmal (Haarlänge/Farbe, Akzentfarbe am Anzug) mindestens 2 px stark → bei aktueller Größe ist die Porträt-Kopplung (V16) im Spielbild nicht wahrnehmbar.
- Uhr 11:30 vs. Sternenhimmel → gleiche Korrektur wie `building_lobby_day`.
- Doppel-Labeling E1 → Zusammenlegung wie in der Lobby umsetzen.

---

## 3. Grafiken / Assets

- **Tragend:** Die Gebäude-Querschnitte selbst (`building_lobby_day`, `building_etage4`) sind die stärksten Assets — klare Etagentrenner, konsistente Beton-/Glas-Palette, lesbarer Aufzugsschacht. Die Himmel-/Skyline-Ebenen mit Parallax-Wirkung funktionieren stimmunglich (in `building_etage1` am besten).
- **Stilbruch:** Die Sprechblase in `pfoertner_bubble.png` (hartes Near-Black-Panel, weiße Screen-Schrift) stammt visuell aus einem anderen Registrierwerk als die Papier-Tokens der Bedienfläche. Vertretbar als diegetische Ebene, aber dann konsequent: Alle Welt-Blasen im selben Panel-Stil wie die Stockwerk-Tags.
- **Skalierungsproblem:** Die NPC-/Avatar-Sprites sind gegenüber Tür- und Möbelhöhe klein; in `building_keller` und `building_etage1` verschmelzen benachbarte Sprites zu einer Masse. Entweder Sprite-Größe +10–15 % oder Mindestabstand in den Laufbahnen.
- **Beschnitt:** Dachtechnik in `building_etage4.png` und `building_etage2.png` mid-object abgeschnitten; „PUBLIKUM"-Button in allen Querschnitt-Shots an der rechten Kante beschnitten; rechte Button-Leiste in `poster_detail.png` im Hintergrund halb abgeschnitten.
- **Fehlend:** Ein Spieler-Marker-Asset existiert offenbar nicht — es würde am meisten bringen. Ebenso fehlt ein Zustands-Asset für „Tür interaktierbar" in konsistenter Form (der gelbe Rahmen taucht nur in 2 von 8 Querschnitten auf).
- **Nicht prüfbar:** Das eigentliche Plakat-Asset (§14.4) und der Flur-Statist — beide Captures fehlen (`poster_detail.png`, `ambient_bubble.png` zeigen den Lagebericht).

## 4. Raster & Rhythmus

- **Kein Seitenraster:** Gebäude, Uhr-Chip, Menü-Button, HUD-Toggle, Button-Leiste und Ticker folgen jeweils eigenen Kanten. Es gibt keine durchgehende rechte Fluchtlinie (Uhr-Chip, „ETAGEN"-Chip, PUBLIKUM-Button sollten rechtsbündig auf einer Kante liegen) und keine linke (Gebäudekante vs. Ticker-Textbeginn).
- **Doppelte Beschriftungsebene** erzeugt den größten Rhythmus-Bruch: Jede Etage trägt 2–3 Textsignale (Tag, 1–2 Raum-Labels, ggf. Ziel-Label), die an unterschiedlichen Kanten hängen (Innenkante links, Oberkante Mitte, Deckenkante variabel). Eine einzige Label-Zeile pro Etage, linksbündig auf der Innenkante, würde das Haus sofort beruhigen.
- **Vertikaler Takt der Etagen** ist gleichmäßig und gut — das ist die stabile Grundlage. Gestört wird er nur durch die schwebenden Labels, die auf den Deckenkanten „sitzen" und die Etagen optisch verschmelzen lassen (besonders „Finanzen / Tresor · Igor" zwischen EG und Keller in `building_lobby_day`/`building_keller`).
- **Tote Fläche:** Himmelsstreifen links (~20 % Breite) und rechts zwischen Gebäude und UI-Leiste (~10 %); in `poster_detail.png`/`ambient_bubble.png` die unteren zwei Drittel der Karten ① und ③. Links böte sich Platz für eine permanente Mini-Legende an („▲▼ Etage · E Aufzug"), rechts für nichts — dann lieber Gebäude zentrieren.
- **Untere Kante:** Ticker, PUBLIKUM-Button und Keller-Objekte (Automat, Rohre) kämpfen um denselben schmalen Streifen; der Ticker sollte als eigene Zone mit klarer Oberkante reserviert bleiben, die Keller-Deko darf nicht in seine Höhe ragen.

## 5. Lesbarkeit

- **Zweimal hingesehen:** „ETAGEN ▲▼" in `building_etage4.png` (zu klein, kein Chip, kein Kontrast zum Beton dahinter); der Untertitel unter „REDAKTIONSSCHLUSS" in `poster_detail.png`; die blass-blaue Kellerfigur in `building_keller.png`; die Unterscheidung Avatar/NPC in `building_etage1.png` und `building_avatar_f.png`.
- **Zustände fehlen:** Kein aktiver/hoverter Zustand ist in irgendeinem Shot erkennbar — die Buchstaben-Buttons (K/M/A/**K**/I) haben weder Beschriftung ihrer Funktion noch einen sichtbaren Zustand; das doppelte „K" ist entweder ein Bug oder zwei Funktionen mit kollidierendem Hotkey — beides muss aus dem Bild ersichtlich sein.
- **Kontrast:** Weiß-auf-Dunkel in Blase und Ticker ist stark; schwächste Stellen sind die gelben 1-px-Rahmen auf hellem Beton und die dunklen Raum-Labels auf dunkler Deckenkante („Operationszentrale" in `building_etage4.png`).
- **Textmengen:** Die Pförtner-Blase ist mit drei kurzen Zeilen richtig dosiert — gutes Beispiel. Die Lagebericht-Karten zeigen das Gegenteil: entweder Überfluss an Struktur ohne Inhalt (①③) oder Werte ohne visuelle Codierung (②).
- **Schriftrollen:** Die Trennung Welt-Mono (VT323) / Display (Press Start 2P, nur Kopfband) / Labels wird eingehalten; einziger Verstoß-mäßiger Eindruck: die kursiven Flavor-Zeilen in `poster_detail.png` („Keine nennenswerte Gegenwehr – noch.") nutzen eine Proportionalschrift, die aus dem Token-Set fällt.

## 6. Die drei wirksamsten Änderungen

1. **Beschriftung auf eine Ebene pro Etage reduzieren** (Stockwerk-Tag integriert Raumname + NPC, schwebende Labels und Deckenkanten-Labels streichen, Ziel-Label an den gelben Rahmen binden). Größter Einzelhebel: beseitigt die Mehrdeutigkeit, welche Info zu welcher Etage gehört, kostet nur Umbau vorhandener Textelemente — kein neues Asset.
2. **Spieler-Marker einführen** (kleines rotes Dreieck/Ring über dem Avatar, in allen Querschnitten). Ohne ihn scheitern aktuell vier der acht Screenshots an der Frage „wo bin ich und wer ist das daneben" — ein 16-px-Asset löst das global.
3. **Tageszeit-Tönung an die Uhr koppeln** (11:00 = Taglicht, Orange erst ab spätem Nachmittag). Reiner Parameter-Fix, aber er betrifft jeden einzelnen Screen und entscheidet, ob die Welt glaubwürdig tickt — aktuell widerspricht sich das Bild in jedem Frame selbst.

## 7. Blinde Flecken

- **`poster_detail.png` / `ambient_bubble.png`:** Das eigentliche Plakat-Overlay (§14.4) und der Flur-Statist mit Blase wurden nicht erfasst — bitte neu aufnehmen, inklusive Öffnungs-/Schließ-Zustand des Overlays.
- **Hover & Klick-Ziele:** Tür-Hover, Button-Hover (K/M/A/K/I), Tooltip-Inhalte, Klickflächen-Größe der Türen vs. Sprite-Größe — aus Standbildern nicht prüfbar.
- **Bewegung:** Laufgeschwindigkeit/-rhythmus des Avatars, Aufzugfahrt als Übergang (Blend oder Cut?), Idle-Animation der NPCs, Blink-Intervalle der Monitor-Assets im Keller.
- **Zustände:** Aktiver/hoverter/disabled-Zustand der Buchstaben-Buttons; ob das doppelte „K" zwei verschiedene Funktionen hat; Zustand „alle Aktionen gespielt" im Ticker (grünes STANDBY vs. Alternativzustand).
- **Auflösung/Skalierung:** Alle Shots in einer Auflösung — Pixelkanten-Sauberkeit bei Fenstergrößen-Änderung (Integer-Scale vs. Blur) ist nicht sichtbar.
- **Avatar-Varianten:** Für die Prüfung der Porträt→Sprite-Kopplung (V16) brauche ich `building_avatar_f` und die männliche Variante im selben Ausschnitt nebeneinander, idealerweise in Bewegung (Walk-Sheet), um Silhouetten-Unterscheidbarkeit zu bewerten.
- **Nachtzustand des Gebäudes:** `building_lobby_night` liegt im Bundle „daynight", nicht hier — die Frage, ob die Zonen-Licht-Logik (Keller cyan, Lobby hell) nachts greift, bleibt ungeprüft.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
