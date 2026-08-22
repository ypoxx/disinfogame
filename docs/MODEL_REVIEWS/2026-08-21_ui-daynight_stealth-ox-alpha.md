# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „daynight"

**Modell:** `stealth/ox-alpha` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-21
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-21T16:57:37.470Z · **Dauer:** 319.9 s
**Nutzung:** 14.645 Prompt + 11.310 Antwort Tokens · **Kosten:** $0.00 (gratis) · **Anbieter-Datensammlung:** ausgeschlossen (deny)

> ⚠️ **Wie das zu lesen ist:** Ein *fremdes* Modell hat einen **kuratierten Ausschnitt**
> des Projekts gesehen — nicht das laufende Spiel und nicht das ganze Repository. Es kann
> daher weder Laufzeitverhalten prüfen noch `file:line`-Belege verifizieren. Befunde sind
> **Hypothesen**, die vor dem Umsetzen am Code/an den Daten gegenzuprüfen sind. Die
> kanonische Wahrheit bleibt [`docs/VISION_LOCK.md`](../VISION_LOCK.md) bzw. die Spieldaten.

## Gestellte Frage

Sieh dir die beigefügten Screenshots des laufenden Spiels an und mache einen UX/UI-Durchgang. Die Optik soll eine Behörden-/Papierwelt sein (Stil-Anker und Farbtoken liegen bei). Sag mir: Wo führt das Bild den Blick falsch, welche Grafiken sitzen an der falschen Stelle oder in der falschen Größe, wo stimmen Abstände und Ausrichtung nicht, und welche drei Änderungen bringen am meisten? Sei so konkret, dass man es direkt umsetzen kann.

## Dieser Durchgang: Bündel „daynight" (7 Screenshots)

Das siehst du, in dieser Reihenfolge:
- sky_0900.png — Tageszeit-Stimmung um 09:00 Uhr (Himmel/Skyline/Tönung)
- sky_1200.png — Tageszeit-Stimmung um 12:00 Uhr (Himmel/Skyline/Tönung)
- sky_1425.png — Tageszeit-Stimmung um 14:25 Uhr (Himmel/Skyline/Tönung)
- sky_1600.png — Tageszeit-Stimmung um 16:00 Uhr (Himmel/Skyline/Tönung)
- sky_1706.png — Tageszeit-Stimmung um 17:06 Uhr (Himmel/Skyline/Tönung)
- sky_1800.png — Tageszeit-Stimmung um 18:00 Uhr (Himmel/Skyline/Tönung)
- building_lobby_night.png — Lobby bei Nacht (18:00, Tönung + Nacht-Skyline)

Beurteile **nur diese** Aufnahmen, dafür gründlich. Andere Teile des Spiels kommen in
eigenen Durchgängen dran — verweise nicht auf Dinge, die du hier nicht siehst.

## Gezeigter Ausschnitt

15.047 Zeichen ≈ 4.180 Tokens (geschätzt) aus 3 Quellen · 1 gekürzt

| Quelle | Modus | Zeichen | Status |
|---|---|---:|---|
| `sprite-tool/public/context/game-style-guide.md` | voll | 5.496 | vollständig |
| `desinformation-network/src/story-mode/theme.ts` | voll | 3.375 | vollständig |
| `desinformation-network/runs/visual-review/latest/manifest.json` | projektion | 6.176 | gekürzt |

### Gezeigtes Anschauungsmaterial (7 Screenshot(s))

| Art | Im Text genannt als | Datei | Größe |
|---|---|---|---:|
| 🖼 Bild | `sky_0900.png` | `desinformation-network/runs/visual-review/latest/shots/sky_0900.png` | 674 kB |
| 🖼 Bild | `sky_1200.png` | `desinformation-network/runs/visual-review/latest/shots/sky_1200.png` | 704 kB |
| 🖼 Bild | `sky_1425.png` | `desinformation-network/runs/visual-review/latest/shots/sky_1425.png` | 715 kB |
| 🖼 Bild | `sky_1600.png` | `desinformation-network/runs/visual-review/latest/shots/sky_1600.png` | 650 kB |
| 🖼 Bild | `sky_1706.png` | `desinformation-network/runs/visual-review/latest/shots/sky_1706.png` | 587 kB |
| 🖼 Bild | `sky_1800.png` | `desinformation-network/runs/visual-review/latest/shots/sky_1800.png` | 526 kB |
| 🖼 Bild | `building_lobby_night.png` | `desinformation-network/runs/visual-review/latest/shots/building_lobby_night.png` | 90 kB |

---

## Antwort des Modells

# UX/UI-Durchgang — Bündel „daynight" (7 Screenshots)

## 1. Erster Eindruck

**sky_0900.png** — Das Auge landet zuerst auf dem gelben Label „Finanzen / Tresor · Igor" in der Bildmitte, weil es das einzige gesättigt-helle Element auf dunklem Grund ist. Es sollte zuerst zur Uhr oben rechts gehen — die ist in diesem Bündel das eigentliche Subjekt —, aber die Uhr verliert gegen das Gelb. Der Himmel ist dunkelblau mit Sternen und beleuchteten Fenstern der Skyline: Das liest sich als Nacht, die Uhr behauptet 09:00. Das Gebäude füllt die Mitte gut, aber das oberste Geschoss („Zielgruppen-Analyse" / „Newsroom") ist am oberen Bildrand abgeschnitten. Bild und Behauptung („Tageszeit-Stimmung 09:00") gehen auseinander.

**sky_1200.png** — Praktisch identisch zu sky_0900: gleiche dunkelblaue Nachtfärbung, Sterne, gleiche Innenbeleuchtung. Mittags ist der helle Ankerpunkt des Tages — hier ist er vom Vormittag nicht zu unterscheiden. Einzig der laufende NPC auf Etage 2 hat die Position gewechselt; das ist die einzige Zeitinformation, die das Bild tatsächlich liefert. Die Gradationskurve des Himmels hat offenbar keinen „Tag"-Zustand. Für ein Bündel, das den Tag-Nacht-Zyklus zeigen soll, ist das der zentrale Defekt.

**sky_1425.png** — Erste sichtbare Veränderung: am Horizont links und rechts liegt ein orange-violettes Abendrot-Band, das die Skyline warm anstrahlt. Das ist der stimmungsvollste Moment der Serie — aber um 14:25 ist der Sonnenuntergang sehr früh, und nach dem „Nacht"-Mittag wirkt die Helligkeitskurve invertiert (12:00 dunkler als 14:25). Die Uhr zeigt 14:24, nicht 14:25 — vermutlich Ernte-Timing, kein Defekt. Innenansichten wieder unverändert hell.

**sky_1600.png** — Gleicher Sonnenuntergangszustand wie 14:25, minimal tiefer und wärmer; die beiden Shots sind als Fortschritt kaum unterscheidbar. Das Auge hängt wieder am gelben Igor-Label, das in jedem Screenshot identisch klebt. Die Fenster der Hintergrund-Skyline sind beleuchtet, die Fenster des Spielergebäudes nicht — das Gebäude nimmt an der Tageszeit nicht teil. Der Übergang zum nächsten Shot wird zeigen, dass zwischen 16:00 und 17:06 kein Zwischenzustand existiert.

**sky_1706.png** — Harter Sprung in die Nacht: violett-dunkles Blau, Sterne, keine Reste des Abendrots. Siebenundsechzig Minuten vorher war volles Orange — entweder wird interpoliert (nicht aus Stillbildern beurteilbar) oder es gibt nur drei Himmelzustände (Nacht / Sonnenuntergang / Nacht). Innenräume weiterhin gleichbeleuchtet; um 17:06 müssten die Deckenbänder im Gebäude langsam die Lichtführung übernehmen. Das Bild wirkt wie ein Tagesschaltzustand, nicht wie ein Verlauf.

**sky_1800.png** — Der dunkelste Stand, oben fast schwarz. Uhr zeigt 17:58. Das Gebäude bleibt flach grau ausgeleuchtet — keine angeschalteten Fenster, keine wärmeren Innenlichter, keine Reflexion des Nachtzustands in der Fassade. Genau hier sollte der Zyklus belohnt werden: Der Spieler, der bis 18:00 spielt, bekommt visuell fast nichts für die verbrachte Zeit. Die Szene ist ruhig und lesbar, aber die versprochene „Tönung" endet am Gebäudesockel.

**building_lobby_night.png** — Achtung: Der Dateiname und die Manifest-Beschreibung („Lobby bei Nacht, Tönung + Nacht-Skyline") passen nicht zum Bildinhalt. Zu sehen ist der Tagesfazit-Screen („REDAKTIONSSCHLUSS / LAGEBERICHT – TAG 1") über einem fast schwarzen Grund, in dem die Nacht-Skyline nur zu ~5 % durchschimmert. Eine Lobby ist nicht erkennbar. Im Bild selbst zieht die große rote Display-Headline den Blick zuerst, dann die dichte Mittelspalte „DAS LAND"; die beiden Nachbarspalten sind zu 70–85 % leeres Papier. Die Deutungshoheits-Leiste unten ist komplett blau gefüllt und ohne Zahl oder Markierung semantisch nicht lesbar.

## 2. Konkrete Eingriffe je Screen

**sky_0900.png**
- Himmel-Gradient → 09:00 einen Morgen-Zustand geben (helles Blau am Horizont, keine Sterne, Skyline-Fenster aus) → die Uhr und der Himmel müssen dieselbe Aussage treffen; aktuell widersprechen sie sich.
- Gelbes Label „Finanzen / Tresor · Igor" → vom freischwebenden Platz in der Decken-Fuge zwischen EG und Keller in den Keller-Streifen direkt über der Auswahlbox ziehen, Füllung durch Papier-Chip mit Warn-Tinte (#6E4A0E) ersetzen → es schwebt bezugslos über der Architektur und stiehlt der Uhr die Aufmerksamkeit.
- Auswahlrahmen um Igor → Vollrahmen durch 2-px-Eckklammern ersetzen → ein durchgezogener 1-px-Kasten um einen 60×90-Sprite vibriert auf dunklem Grund.
- Oberstes Geschoss → Gebäude um ~eine halbe Geschosshöhe nach unten schieben oder Maßstab so wählen, dass über „Zielgruppen-Analyse"/„Newsroom" 8–12 % Kopffreiheit bleiben → die beschnittene Etage sieht nach Renderfehler aus, nicht nach Komposition.
- Stockwerks-Labels → System auf einen Typ reduzieren (Raum-Tag linksbündig an der Geschoss-Deckkante; NPC-Namen nur als Zusatz oder bei Hover) → „Etage 2 – Feld-Operationen" (links) und „Feld-Operationen · Katja" (mitte) beschriften dasselbe Geschoss doppelt mit unterschiedlicher Logik.

**sky_1200.png**
- Himmel → Mittag als hellsten Zustand der Kurve definieren (Himmelsspitze hell, Horizont fast weiß-blau, keine Sterne) → ohne diesen Anker ist die ganze Tageskurve wertlos.
- Innenbeleuchtung → Innenflächen an die Tageskurve koppeln (Mittag: kühlstes, hellstes Licht) → aktuell ist 12:00 innen identisch zu 09:00 und 18:00.
- Gelbes Igor-Label → wie bei sky_0900: in den Keller-Streifen verschieben, entgelbieren → wiederholt sich in jedem Shot und wird so zum Dauerschmutz.
- Rechte Seitenleiste (K/M/A/K/I) → die zwei identischen „K"-Tasten unterscheidbar machen (2–3-Buchstaben-Codes oder Icons) → zwei gleiche Labels in einem 5-Elemente-Stack sind ein Lesbarkeitsfehler.
- Roter vertikaler Streifen am äußersten rechten Rand → entweder als Scrollbalken stylen oder an ein Panel anbinden → aktuell ist er ein unbeabsichtigter Akzent in Ministeriums-Rot, das laut Token nur für Stempel/Kopfbänder reserviert ist.

**sky_1425.png**
- Abendrot-Band → Verlauf hart banden/dithern statt weich zu verlaufen → der airbrush-artige Verlauf ist die einzige weiche Fläche im sonst kantigen Pixelbild und wirkt fremd.
- Helligkeitskurve → zwischen 12:00 und 14:25 einen Nachmittags-Zustand einschieben → aktuell springt die Stimmung von „Nacht" direkt in „Sonnenuntergang".
- Uhr-Widget → Uhrbox um ~20 % vergrößern und ihr den Kontrastvorsprung lassen, sobald das gelbe Label entschärft ist → sie ist die primäre Zeitinformation des Bündels.
- NPC auf Etage 2 → Laufweg nicht durch das linke Label-Ende führen → in diesem Frame läuft die Figur knapp unter dem Chip „Etage 2 – Feld-Operationen" hindurch; Sprite und Text kollidieren fast.
- Skyline-Fenster → ab 14:00 zunehmend zuschalten → die Stadt beginnt früher zu leuchten als das eigene Gebäude; die Reihenfolge ist vertauscht.

**sky_1600.png**
- Unterscheidbarkeit zu 14:25 → den 16:00-Zustand deutlich weiter drehen (Orange tiefer, Himmelsspitze schon violett, mehr lit windows) → zwei Shots, die man nur per Dateinamen unterscheiden kann, liefern keine Progression.
- Gebäude-Fenster → ab 16:00 einzelne Fenster des Spielergebäudes beleuchten → das Gebäude ist der Hauptdarsteller und bleibt der einzige unbeleuchtete Block im Bild.
- Gelbes Igor-Label → entfernen bzw. wie oben → in vier von sechs Shots identisch klebend wirkt es wie ein hängender Hover-Zustand, nicht wie ein Feature.
- Ticker unten → „STANDBY" vom hellen Terminal-Grün auf die Success-Tinte (#31572E) oder Petrol (#275F6B) umstellen → das Grün ist der größte Farbausreißer gegen die v3-Papiertokens im gesamten Shot.
- Untere Kante → den roten 2-px-Ticker-Rahmen als einziges Rot halten und den roten Randstreifen rechts davon entfernen → zwei rote Linien an gegenüberliegenden Bildrändern konkurrieren.

**sky_1706.png**
- Übergang 16:00→17:06 → mindestens einen Dämmerungs-Zustand dazwischen liefern (Abendrot nur noch als Streifen, Himmelsspitze dunkel) → der Cut von voller Sonne zu Nacht in 66 Minuten bricht die Glaubwürdigkeit des Zyklus.
- Innenlicht → ab ~17:00 Deckenlichtbänder wärmer und ~20 % dimmen, Monitor-/Automatenflächen (Cyan-Text im Keller) als Lichtquellen stärken → nachts trägt das Innere die Szene, nicht der Himmel.
- Sterne → Dichte/Größe reduzieren → die großen weichen Sternpunkte wirken gegen die feine Pixelkante zu grob.
- Stockwerks-Labels → einheitliche vertikale Verankerung (immer an der Geschoss-Deckkante, gleicher Innenabstand) → aktuell sitzen die Chips mal auf der Kante, mal mittig in der Fuge; das Auge muss pro Geschoss neu suchen.

**sky_1800.png**
- Nacht-Zustand des Gebäudes → eigenes Nacht-Artwork: angeschaltete Fenster pro Geschoss, warme Innenlichter, dunklere Fassade → 18:00 ist der Endzustand des Spieltags und bekommt visuell am wenigsten.
- Himmelsspitze → nicht bis Schwarz abdunkeln, bei ~#1B1E24 (Tiefe-Token) stoppen → pures Schwarz am oberen Rand lässt das Bild „aus" wirken statt „nachts".
- Gelbes Igor-Label → entfernen → um 18:00, wo die Szene ruhig werden soll, ist es der lauteste Fleck.
- PUBLIKUM-Button unten rechts → auf die Höhe des Ticker-Texts ausrichten und mit dessen Innenabstand koppeln → aktuell schwebt er leicht versetzt zur Ticker-Grundlinie.
- Uhr → im Nachtzustand die Uhrbox leicht hervorheben (z. B. Amber-Tinte für die Ziffern) → nachts ist die Uhrzeit die wichtigste verbleibende Information im Bild.

**building_lobby_night.png**
- Deutungshoheits-Leiste → als echtes Kräfteverhältnis rendern: rotes Segment (Ministerium) und blaues Segment (Institutionen) mit sichtbarer Teilungskante oder Markern, plus Zahlswert → eine 100 % blaue Vollfüllung liest sich als „total verloren", ohne dass das beabsichtigt sein kann.
- Statuswörter in „DAS LAND" (ruhig / misstrauisch / wütend) → auf die Token-Tinten mappen: ruhig → success (#31572E), misstrauisch → warning (#6E4A0E), wütend → danger (#9E2F26) → aktuell sind alle gleich blass; „wütend" flüstert, soll aber schreien.
- Linke Spalte „WAS WIR AUSSPIELEN" → Panelhöhe an den Inhalt koppeln oder einen zweiten Slot einfügen („Als Nächstes geplant") → ~240 px tote Papierfläche unter zwei Textzeilen.
- Rechte Spalte „DIE GEGENSEITE" → gleiche Behandlung; bei Leerstand Panel auf ~1/3 Höhe reduzieren und darunter z. B. letzten Tagesvergleich setzen → die asymmetrische Leere (10 % / 90 % / 5 % Füllgrad) zerstört das Raster.
- RISIKO „0%" in Amber → Neutralwert in textPrimary setzen, Amber erst ab Werten > 0 → Amber ist die Warn-Tinte; Null in Warnfarbe ist ein falsches Signal.
- Hintergrund → vom Neutral-Schwarz auf den warmen Träger (#2E2820) stellen und die Nacht-Skyline auf ~10–15 % Sichtbarkeit anheben → der Dateiname verspricht eine Nachtszene; aktuell ist der Kontext tot.

## 3. Grafiken / Assets

- **Tragen:** Die Skyline-Silhouetten (zwei Ebenen, durchgehend in allen sechs Gebäudeshots) sind stilistisch sauber und pixelkantig; das Gebäude-Artwork ist fein und scharf im Sinne des Stil-Guides; der Cyan-Text am Keller-Automaten trifft den Tech-Token; das dunkelrote Wandband auf Etage 3 trifft „dunkelrotes Banner ohne Emblem". Die Papier-Panels im Lagebericht treffen surface/surfaceLight und die rote Headline trifft ministryRed.
- **Fremd:** Das Abendrot-Band (sky_1425, sky_1600) ist der einzige weichverlaufende, fast airbrushige Bereich im gesamten Set — es braucht Banding/Dithering, um zur harten Pixelkante zu passen. Das gelbe Igor-Label nutzt eine gesättigte Gelbfüllung, die weder zur v3-Warn-Tinte (#6E4A0E, Tinte auf Papier) noch zu irgendeiner anderen Fläche passt — es wirkt wie ein Überbleibsel der alten Palette. Der Hintergrund des Lageberichts ist neutral-schwarz statt des warmen Trägers #2E2820.
- **Falsch skaliert/geschnitten:** Das oberste Geschoss ist in allen sechs Gebäudeshots am oberen Viewportrand beschnitten — entweder Asset zu hoch für die Kamera oder Kamera-Offset falsch. Die Sterne in den Nacht-Himmeln sind relativ zu den feinen Sprites zu groß/weich gerendert.
- **Fehlt (would help most):** Ein Nacht-Zustand des Spielergebäudes mit beleuchteten Fenstern — das einzelne Asset, das den ganzen Zyklus glaubwürdig machen würde. Zweitens: ein Dämmerungs-Himmel zwischen Sonnenuntergang und Nacht. Drittens: ein Status-Icon-Set für die Milieus im Lagebericht (Gesicht/Symbol pro Zustand), damit die Statusspalte nicht nur auf winzige Tintenfarben tragen muss.

## 4. Raster & Rhythmus

- **Gebäudeshots (alle sechs):** Das Gebäudeblock sitzt bei ~x 230–1050 von 1280; rechts nimmt die Papier-Seitenleiste ~45 px plus roten Randstreifen ein, links bleibt ~230 px reiner Himmel. Die optische Mitte liegt dadurch links neben der Bildmitte — entweder das Gebäude im verbleibenden Raum (zwischen linkem Rand und Seitenleiste) zentrieren oder die Skyline links schmaler halten. Die Geschosshöhen sind mit ~95–110 px angenehm regelmäßig; der Rhythmus kippt nur durch die Labels, die mal auf der Geschosskante, mal mittig in der Deckenfuge sitzen. Das Igor-Label schwebt in der Fuge zwischen EG und Keller und hängt visuell an keinem der beiden — schlimmster Rasterbruch der Serie.
- **Tote Fläche:** Links und rechts des Gebäudes liegt viel Himmel, was als Atmung okay wäre — aber weil sich die Skyline zwischen den Shots nur umfärbt, wirkt sie bei wiederholtem Spielen wie ein Standbild. Im Lagebericht ist die tote Fläche inside der Panels: linke Spalte ~70 % leer, rechte ~85 % leer bei voller Panelhöhe.
- **Trennung:** Im Lagebericht sind die drei Spalten klar getrennt (gleichmäßige Gutter), gut. Die Stats-Zeile (RISIKO/BUDGET/AUFMERKSAMKEIT) ist sauber drittelt. Schwach: Die Deutungshoheits-Leiste hat drei Beschriftungen (links, mitte, rechts) auf einer Linie, ohne dass die Leiste selbst die Bezüge visuell herstellt.

## 5. Lesbarkeit

- **Zweimal hingesehen:** Die zwei identischen „K"-Tasten in der Seitenleiste (alle Gebäudeshots) — ohne Tooltip nicht auflösbar. Die Doppelbeschriftung der Geschosse („Etage 2 – Feld-Operationen" + „Feld-Operationen · Katja") — man muss erst die Logik rekonstruieren (Raum vs. NPC). Die Deutungshoheits-Leiste im Lagebericht — Zustand nicht ablesbar, keine Zahl, keine Teilung. Die Statuswörter „ruhig/misstrauisch/wütend" — alle im selben blassen Ton, Unterschiede nur nach Wissen der Token existent.
- **Kontraste:** Uhr und Ticker-Text sind gut lesbar. Die graue Ticker-Nachricht auf Dunkel ist am unteren Kontrastlimit, aber als Sekundärinfo vertretbar. Die kursiven Pixelzeilen im Lagebericht („Keine nennenswerte Gegenwehr – noch.") schimmern in kleiner Größe — Kursiv bei Pixelfonts lieber vermeiden und über textSecondary-Abschwächung lösen.
- **Zustände:** „STANDBY" ist als Zustandswort gut platziert, aber die helle Grünwahl signalisiert „aktiv/online" in einer Intensität, die das Token-System (success = gedeckte Oliv-Tinte) nicht hergibt. Im Lagebericht fehlt jeder Unterschied zwischen „gut" und „kritisch" — die Zustandsfarben sind das größte Lesbarkeitsdefizit dieses Screens.

## 6. Die drei wirksamsten Änderungen

1. **Tageslicht-Kurve reparieren (alle sechs sky_*.png):** Mittag als hellsten Zustand definieren, Dämmerung zwischen 16:00 und 17:06 einschieben, Morgen-Zustand ohne Sterne. Betrifft sechs von sieben Screens, ist der Kern des Bündels und mostly reine Gradient-/Keyframe-Arbeit — höchste Wirkung pro Aufwand im gesamten Paket.
2. **Dauer-Gelb um Igor entfernen und Labels auf ein System bringen (alle Gebäudeshots):** Auswahl durch Eckklammern ersetzen, NPC-Label in den Keller-Streifen verschieben und auf Papier-Chip mit Warn-Tinte umstellen, Doppelbeschriftung der Geschosse auflösen. Fast ohne neuen Aufwand (Zustands- und Layout-Fix), nimmt der Serie ihren größten Dauerschmutz und gibt der Uhr den Blick zurück.
3. **Nacht-Zustand des Spielergebäudes bauen (sky_1706, sky_1800):** Beleuchtete Fenster + wärmeres, gedimmtes Innenlicht als eigenes Artwork-Variant. Ein Asset-Paar, das den Endzustand des Spieltags belohnt und das Gebäude zum ersten Mal an der Tageszeit teilnehmen lässt — die derzeit größte Lücke zwischen Absicht („Tönung + Nacht-Skyline") und Bild.

## 7. Blinde Flecken

- **Übergangsverhalten:** Ob die Himmelzustände weich interpolieren oder hart schalten, ist aus Stillbildern nicht erkennbar — ich brauche eine Sequenz 15:30–17:30 in feinen Schritten (oder ein Video).
- **Hover-/Klickzustände:** Sind Geschosse, Türen, NPCs, die Seitenleisten-Tasten und die Ticker-Elemente interaktiv? Ein Shot mit Hover über einer Tür und einer Seitenleisten-Taste fehlt.
- **Das Igor-Gelb:** Hängender Hover-Zustand oder beabsichtigtes Dauer-Marker? Ein Shot desselben Moments ohne Hover würde das klären.
- **Über dem obersten Geschoss:** Ist das Gebäude scrollbar/zoombar, oder ist der Beschnitt endgültig? Ein ausgerollter Vollbild-Shot des Gebäudes fehlt.
- **Zwischenzeiten innen:** Ob die Innenbeleuchtung überhaupt an die Tageskurve gekoppelt ist, lässt sich nur mit Zwischen-Shots (z. B. 13:00, 15:00) prüfen.
- **Lagebericht unterhalb:** „ÜBER NACHT" ist hier abgeschnitten — der Folge-Shot liegt laut Manifest im Bündel „daycycle" und ist hier nicht enthalten; ich beurteile den unteren Bereich daher nicht.
- **Auflösung:** Uhr-Widget, Seitenleisten-Tasten und Ticker sind in diesen Aufnahmen klein; hochauflösende Crops würden die Pixelfont-Renderqualität und die genauen Farben (z. B. das Ticker-Grün gegen #31572E) absichern.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
