# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „panels-2von2"

**Modell:** `stealth/ox-alpha` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-21
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-21T16:57:37.470Z · **Dauer:** 263.2 s
**Nutzung:** 13.353 Prompt + 7.446 Antwort Tokens · **Kosten:** $0.00 (gratis) · **Anbieter-Datensammlung:** ausgeschlossen (deny)

> ⚠️ **Wie das zu lesen ist:** Ein *fremdes* Modell hat einen **kuratierten Ausschnitt**
> des Projekts gesehen — nicht das laufende Spiel und nicht das ganze Repository. Es kann
> daher weder Laufzeitverhalten prüfen noch `file:line`-Belege verifizieren. Befunde sind
> **Hypothesen**, die vor dem Umsetzen am Code/an den Daten gegenzuprüfen sind. Die
> kanonische Wahrheit bleibt [`docs/VISION_LOCK.md`](../VISION_LOCK.md) bzw. die Spieldaten.

## Gestellte Frage

Sieh dir die beigefügten Screenshots des laufenden Spiels an und mache einen UX/UI-Durchgang. Die Optik soll eine Behörden-/Papierwelt sein (Stil-Anker und Farbtoken liegen bei). Sag mir: Wo führt das Bild den Blick falsch, welche Grafiken sitzen an der falschen Stelle oder in der falschen Größe, wo stimmen Abstände und Ausrichtung nicht, und welche drei Änderungen bringen am meisten? Sei so konkret, dass man es direkt umsetzen kann.

## Dieser Durchgang: Bündel „panels-2von2" (6 Screenshots)

Das siehst du, in dieser Reihenfolge:
- panel_events.png — Seiten-Panel: Welt-Ereignisse
- hud_on.png — HUD eingeblendet (Sonntagsfrage · Abwehr · Kasse · Tag)
- encyclopedia.png — Nachschlagewerk/Enzyklopädie (Taste I)
- shortcuts.png — Tastenkürzel-Hilfe
- pause_menu.png — Pausenmenü (Sound-Mixer, Speichern, Beenden)
- decision_beat.png — Entscheidungs-Beat-Modal (Stadtrat) mit Optionen + Berater-Badge

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
| 🖼 Bild | `panel_events.png` | `desinformation-network/runs/visual-review/latest/shots/panel_events.png` | 321 kB |
| 🖼 Bild | `hud_on.png` | `desinformation-network/runs/visual-review/latest/shots/hud_on.png` | 367 kB |
| 🖼 Bild | `encyclopedia.png` | `desinformation-network/runs/visual-review/latest/shots/encyclopedia.png` | 435 kB |
| 🖼 Bild | `shortcuts.png` | `desinformation-network/runs/visual-review/latest/shots/shortcuts.png` | 257 kB |
| 🖼 Bild | `pause_menu.png` | `desinformation-network/runs/visual-review/latest/shots/pause_menu.png` | 343 kB |
| 🖼 Bild | `decision_beat.png` | `desinformation-network/runs/visual-review/latest/shots/decision_beat.png` | 327 kB |

---

## Antwort des Modells

# UX/UI-Durchgang — Bündel „panels-2von2"

Vorab ein Befund, der über allen Einzelscreens steht: Vier der sechs Aufnahmen (`panel_events.png`, `hud_on.png`, `shortcuts.png`, `decision_beat.png`) zeigen dasselbe Entscheidungs-Modal — und auf allen vier ist es am unteren Rand defekt bzw. unvollständig. Das zieht sich durch alle Abschnitte unten.

---

## 1. Erster Eindruck

**`panel_events.png`**
Das Auge landet sofort im roten Kopfbanner „Die reale Vorlage" — das ist korrekt, denn das ist der aktive Inhalt. Das Problem: Der Blick bleibt dort nicht, sondern rutscht rechts in die abgeschnittene Überschrift „…EREIGNISSE", deren Oberkante vom Bildrand gefressen wird. Die rechte Ereignis-Spalte wirkt gleichzeitig leer („Keine Welt-Ereignisse") und angeschnitten — ein Widerspruch, den das Auge nicht auflösen kann. Links versinkt das Büro-Szenario im Dimming und liefert nichts. Die eigentliche Entscheidungsoption C ist unten vom Fußleisten-Balken halb verschluckt. Erster Eindruck: zwei konkurrierende Panels, keines davon komplett lesbar.

**`hud_on.png`**
Dasselbe Modal, aber jetzt offenbaren die Ränder das eigentliche Problem dieses Screens: Das HUD ist auf sechs verschiedene Ankerpunkte verteilt (oben links Wahl/Tag, oben Mitte Kursticker, oben rechts Menü-Cluster, rechte Kante Icon-Stapel + Uhr, unten links Namensschild, unten rechts FEIERABEND). Kein einziger dieser Punkte teilt eine Ausrichtungslinie mit einem anderen. Das Auge springt beim Versuch, das HUD zu erfassen, viermal über den ganzen Schirm — und wird dabei jedes Mal vom hellen Modal in der Mitte zurückgerissen. Die Uhr „03:00" rechts außen ist so klein und dunkel, dass ich sie beim zweiten Blick erst gefunden habe.

**`encyclopedia.png`**
Hier funktioniert die Blickführung am besten: Kopfbanner → linke Methodenliste → aktiver Eintrag → Detailpaneel rechts. Das Dossier liest sich wie ein Aktenvorgang, das passt zur Papierwelt. Zwei Brüche: In der Liste brechen zwei Einträge in eine zweite Zeile um und zerstören den Zeilenrhythmus der übrigen elf; und die untere Hälfte des Detailpaneels ist leere Papierfläche, während unten eine winzige Fußnote schwebt, die weder zur Liste noch zum Text gehört. Das Modal hängt zudem relativ hoch, unten schaut das abgeschnittene Entscheidungs-Modal durch — die Tiefe stimmt, aber der unterm Modal liegende Defekt (Option C gekappt) ist auch hier sichtbar.

**`shortcuts.png`**
Der Screen zeigt **keine Tastenkürzel-Hilfe**. Zu sehen ist ausschließlich das Entscheidungs-Modal vor nahezu schwarzem Grund. Entweder wurde der falsche Moment erntet, oder — wahrscheinlicher — das Shortcuts-Overlay öffnet *unter* dem Modal bzw. wird vom Scrim vollständig geschluckt. Für einen Review-Durchgang ist das der härteste Einzelbefund des Pakets: Ein ganzer Screen besteht aus einem Element, das nicht da ist, wo sein Name es verspricht.

**`pause_menu.png`**
Klarste Hierarchie des Pakets: FORTSETZEN als gestempelter Doppelring-CTA dominiert, genau wie es `stampCtaStyle` in `desinformation-network/src/story-mode/theme.ts` vorsieht. Aber direkt darunter kippt die Gewichtung: BEENDEN ist als großes, vollflächig gefülltes Tan-Block die flächenmäßig zweitschwerste Fläche des Modals — eine destruktive/verlassende Aktion wiegt fast so viel wie die Primäraktion. Der Sound-Mixer darunter ist funktional, aber die drei Unter-Slider starten weiter links als der Master-Slider, weil bei diesem die Lautsprecher-Icons die Spur nach rechts drücken. Die Pixel-Szene dahinter (Monitor, Pinnwand, Plakat) ist stimmig gedimmt.

**`decision_beat.png`**
Gleiches Modal-Gerüst wie oben, aber hier zeigt sich ein Karten-internes Problem besonders gut: Bei Option A stehen die Werte (+8 % / +18 %) inline hinter dem Titel, bei Option B und C sind sie als gestapelte Blöcke in einer rechten Spalte gesetzt. Drei Karten, zwei verschiedene Stat-Anatomien — das Auge sucht bei jeder Karte neu nach dem Risiko-Wert. Der Amber-Badge „+ BERATER RAT" an Option C ist der einzige Warm-Akzent im Kartenfeld und zieht den Blick genau dorthin, wo er laut Spielfortschritt vermutlich hin soll — das funktioniert. Unten wieder: Karte C vom Fußbalken gekappt, keine Bestätigen-Fläche sichtbar.

---

## 2. Konkrete Eingriffe je Screen

**`panel_events.png`**
- Ereignis-Panel-Header „EREIGNISSE" → um die Höhe des HUD-Streifs (ca. 1 Kopfzeilenhöhe) nach unten setzen und linksbündig mit dem Panel-Körper fluchten → aktuell klebt die Caps-Zeile am oberen Bildrand und ist halb abgeschnitten.
- Leeres-Bomben-Icon → aus der freien Mitte herausnehmen und direkt über „Keine Welt-Ereignisse" setzen, Abstand Icon→Text auf eine Leerzeile (~1 Zeilenhöhe) reduzieren → aktuell schwebt es mit ~3 Zeilen Abstand und erzeugt tote Fläche zwischen Icon und Text.
- Leerer Zustand insgesamt → vertikal in der oberen Panel-Hälfte zentrieren und darunter einen dezenten Hinweis („Ereignisse erscheinen im Lauf der Phase") auf Höhe des unteren Drittels setzen → die untere Panelhälfte ist aktuell 100 % Leerfläche ohne Funktion.
- Modal-Fußbalken („Keine Option ist überall die beste…") → aus dem Kartenfluss nehmen und als festen Fußstreifen unterhalb des Scrollbereichs setzen → aktuell überlappt er die Titelzeile von Option C.
- Rechte Panelkante → Innenabstand des Inhalts zum Panelrahmen vereinheitlichen (Header-Abstand = Listenabstand) → „Phase 2" oben rechts sitzt näher an der Kante als der Body-Text links.

**`hud_on.png`**
- Obere Leiste → Wahl/Tag-Cluster (links), Kurs-Ticker (Mitte) und Menü-Cluster (rechts) auf eine gemeinsame Grundlinie setzen, gleiche Höhen für alle drei Blöcke → aktuell liegen die drei Cluster auf drei verschiedenen vertikalen Positionen.
- Uhr-Badge „03:00" → aus der rechten Schwebeposition herauslösen und links neben den Tag-Counter („TAG 2 · 5/5") setzen, Größe ×1,5 → Zeit und Tag sind dieselbe Informationsfamilie und gehören in einen Block; aktuell ist die Uhr das am schlechtesten auffindbare HUD-Element.
- Rechter Icon-Stapel (N/M/K/I) → 12–16 px von der Bildkante weg, feste 8 px Vertikalabstände, einheitliche Kachelgröße → aktuell klebt er an der Kante und die Kacheln wirken unterschiedlich hoch.
- FEIERABEND-Button → von Vollflächen-Rot auf Stempelstil umstellen (Papierfläche, roter Doppelring, rote Schrift gemäß §4.7) → Rot ist laut Theme-Kommentar Stempel/Kopfbändern vorbehalten; ein gefluteter Dauer-Button verwässert genau diese Regel und konkurriert mit dem roten Modal-Kopfband.
- Ticker-Zeile unten → feste Streifenhöhe reservieren und Text mit Ellipse kappen → aktuell läuft sie unter dem Modal durch und kollidiert mit dem Namensschild links.
- „PUBLIKUM"-Label unten rechts → vollständig ins Bild holen oder streichen → halb abgeschnittene Labels wirken wie Renderfehler.

**`encyclopedia.png`**
- Methodenliste → einheitliche Zeilenhöhe für alle Einträge erzwingen; die beiden zweizeiligen Einträge („Pseudo-Experten & Schein-Institute", „Faktencheck untergraben…") entweder per Schriftverkleinerung auf eine Zeile bringen oder alle Zeilen auf die zweizeilige Höhe setzen → aktuell springt der Zeilenrhythmus zweimal, das liest sich wie eine fehlerhafte Tabelle.
- Detailpaneel → unter „GEGENMASSNAHME" einen abschließenden Metadaten-Block setzen (Schwere / Technik / Verwandte Muster als Label-Wert-Zeilen) → die untere ~40 % des Paneels sind Leerfläche, während die Fußnote unten außen herumhängt.
- Fußnote „Bildungs-Kern: … (Taste I schließt)" → in eine modale Statusleiste über die volle Modalbreite wandern, eine Schriftgröße größer, linksbündig → aktuell ist sie winzig, zentriert unter der Listenspalte und optisch weder Teil der Liste noch des Texts.
- Listenende → unter dem letzten Eintrag („Infiltration & Mobilisierung offline") einen Scroll-Indikator oder Restraum von einer halben Zeilenhöhe lassen → aktuell berührt der letzte Eintrag die untere Listengrenze; ob es mehr Einträge gibt, ist nicht ablesbar.
- Aktiver Listeneintrag → Aktiv-Markierung verstärken (z. B. linker roter Kantenstrich statt nur Flächen-Tönung) → die aktuelle Unterscheidung aktiv/inaktiv ist auf Distanz kaum erkennbar.

**`shortcuts.png`**
- Shortcuts-Overlay → Z-Ordnung prüfen und sicherstellen, dass es ÜBER dem Entscheidungs-Modal und dessen Scrim rendert → aktuell ist keine einzige Tastenkürzel-Information sichtbar; der Screen ist inhaltlich leer.
- Falls das Overlay gar nicht offen war: Ernte-Moment korrigieren und Screenshot nachliefern → ohne Aufnahme kann ich Layout, Dichte und Lesbarkeit der Hilfe nicht beurteilen.
- Hintergrund-Scrim → wenn das Overlay über dem Spiel liegt, einheitliches Dim-Niveau wie in `pause_menu.png` verwenden → der Vollschwarz-Hintergrund hier passt zu keinem anderen Screen des Pakets.

**`pause_menu.png`**
- BEENDEN-Button → Breite halbieren oder auf Outline-Stil (Rahmen, keine Füllung) umstellen → aktuell ist er die flächenschwerste Sekundäraktion des Screens und wiegt fast gleich viel wie FORTSETZEN; Verlassen darf nicht visuell mit Weiterarbeiten konkurrieren.
- Mixer-Slider → Start-x aller vier Spuren auf dieselbe Linie setzen: Lautsprecher-Icons beim Master-Slider links VOR die Spur schieben, nicht in die Spurachse → aktuell beginnt die Master-Spur weiter rechts als MUSIK/EFFEKTE/STIMMEN, die vier Balken bilden keine Kante.
- Slider-Labels (MUSIK/EFFEKTE/STIMMEN) → eine Stufe größer oder Spurhöhe reduzieren → die Mini-Caps wirken neben den langen Spuren verloren; das Größenverhältnis Label:Spur ist aktuell ca. 1:6.
- AN-Toggle → auf die Grundlinie des SOUND-Headings setzen und in der Breite an die Slider-Endkante rechts ausrichten → aktuell schwebt es leicht versetzt über der Master-Reihe.
- Versionszeile „v0.9.0" → kann bleiben, aber linksbündig zum Modal-Innenrand statt zentriert → zentrierte Mikro-Texte unter einem sonst linkbündig organisierten Modal erzeugen Unruhe.

**`decision_beat.png`**
- Stat-Blöcke in den Optionskarten → auf EIN Template normieren: feste rechte Spalte (~20–22 % Kartenbreite), Wert über Label, rechtsbündig zur gemeinsamen Karten-Innenkante, in allen drei Karten identisch → aktuell mischt Inline-Stat (A) und Spalten-Stat (B, C); der wichtigste Vergleichswert (Risiko) steht auf drei unterschiedlichen x-Positionen.
- Kartentitel → maximale Textbreite vor der Stat-Spalte reservieren (ca. 65 % Kartenbreite) → „B · Einschleusen – das Verfahren delegitimieren" bricht unschön mitten im Wortgefüge, weil die Stat-Spalte ihm Platz wegnimmt.
- Tag-Chips („Polarisierung ▲" usw.) → einheitlicher Chip-Abstand (8 px) und gleiche Baseline innerhalb einer Karte → in Karte A sitzen drei Chips eng, in Karte B zwei mit anderem Lauf.
- Berater-Badge „+ BERATER RAT" → direkt an die Titel-Grundlinie von C koppeln statt frei daneben → aktuell schwebt es zwischen Titel und Stat-Spalte ohne klare Zugehörigkeit.
- Wie überall: Fußbalken entkoppeln und Scrollbereich darüber enden lassen → Karte C ist auch hier zur Hälfte verdeckt.

---

## 3. Grafiken / Assets

- **Tragend:** Die Büro-Pixelkulissen unter `panel_events.png` und `pause_menu.png` (Monitor, Pinnwand, Aktenschrank, abstrakt-konstruktivistisches Plakat) passen sauber zum Stil-Anker — feine, scharfe Pixel, kein 70er-Braun, gedimmte Sättigung. Das Dimming in `pause_menu.png` ist das beste des Pakets: Szene lesbar, Modal dominant.
- **Falsch skaliert:** Das Bomben-Icon in `panel_events.png` wirkt weichgezeichnet/unsauber kantig gegenüber der Umgebung — vermutlich Nicht-Integer-Skalierung. In Originalauflösung rendern oder ×2/×4 mit hartem Nearest-Neighbor.
- **Fremd im Stil:** Die Lautsprecher-Icons im Mixer (`pause_menu.png`) sind so klein, dass sie zu Pixelbrei degenerieren; sie lesen sich nicht als Objekte. Entweder als saubere 16×16-Pixel-Assets neu oder als Text-Label („MASTER") lösen.
- **Unstimmiges Dimming:** Derselbe Modal-Typ liegt in `panel_events.png` auf stark gedunkeltem, in `hud_on.png` auf deutlich hellerem, in `shortcuts.png` auf schwarzem Grund. Ein Scrim-Token (z. B. Hintergrund auf ~60 % Abdunklung, modal selbst voll) fehlt offensichtlich.
- **Fehlend, würde am meisten bringen:** Ein sichtbarer Scroll-Indikator (Papier-Rollo-/Kante-Metapher) am unteren Rand des Entscheidungs-Modals — vier von sechs Screens zeigen einen abgeschnittenen Inhalt ohne jeden Hinweis, dass es unten weitergeht. Zweitens: ein Bestätigungs-Element (Stempel-CTA) im sichtbaren Bereich; aktuell ist unklar, ob die Karte selbst klickbar ist.

---

## 4. Raster & Rhythmus

- **Das Modal selbst hat ein solides Innenraster** (Kopfbanner, Textblock, Karten mit gleichen Außenmaßen, gleiche Kartenabstände) — das ist die gute Nachricht. Es bricht erst am Fuß: Der Hinweisbalken liegt IM Kartenfluss statt unterhalb, dadurch wird Karte C geclippt und das Raster endet ohne Abschlusskante.
- **Das HUD (`hud_on.png`) hat kein Raster, nur Ecken.** Sechs Elementgruppen, null geteilte Kanten. Empfehlung: zwei horizontale Ankerlinien definieren (eine Kopf-Linie für Wahl/Tag/Ticker/Menü, eine Fuß-Linie für Namensschild/Ticker/FEIERABEND) und alles daran ausrichten; die rechte Icon-Spalte als dritte vertikale Achse mit festem Kantenabstand.
- **`encyclopedia.png`** hat ein sauberes Zweispalten-Raster (Liste ~30 %, Detail ~70 %), aber keine gemeinsame Grundlinie zwischen Listenende und Textende — die Liste endet höher als der Text, die Fußnote hängt in der Differenz. Entweder beide Spalten auf gleiche Höhe bringen oder die Fußnote als volle Breite darunter.
- **Unruhequelle quer durchs Paket:** Der Entscheidungs-Modal ist mal auf Schwarz, mal auf hellem Grund, mal neben einem lebenden Seiten-Panel platziert. Die Modal-Geometrie ist identisch, die Umgebung wechselt aber so stark, dass dieselbe Komponente in jedem Screen anders wirkt. Ein einheitlicher Scrim + einheitliche Modal-Position (vertikal leicht über Mitte, nicht zentriert-hoch wie in `encyclopedia.png`) löst das.

---

## 5. Lesbarkeit

- **Zweimal hingesehen:** Die Uhr „03:00" in `hud_on.png` (dunkler Badge, kleine Pixelziffern, kein Kontrastanker). Die „Technik:"-Zeilen in den Optionskarten (Oliv-Tinte in kleiner VT323 — die Monospace-Weltschrift fällt unter ~14 px auf Papier stark zusammen). Die Fußnote in `encyclopedia.png`. Das „PUBLIKUM"-Label in `hud_on.png`, das halb unterm Rand liegt.
- **Rot auf Papier:** Die Risiko/Aufmerksamkeit-Werte in Rot funktionieren kontrastlich; problematisch ist eher die Menge — in `decision_beat.png` Karte A stehen Werte UND Labels rot inline im Titelzug, das liest sich wie Teil des Titels. Werte rot, Labels in `textSecondary` trennen würde das entzerren.
- **Zustände:** Aktiv (Enzyklopädie-Listeneintrag) ist zu schwach, gesperrt/neu ist nirgends im Paket sichtbar — ich kann nicht beurteilen, ob es sie gibt (siehe Blinde Flecken). Der Amber-Badge „BERATER RAT" ist der einzige klar abgelesene Sonderzustand und funktioniert.
- **Textmengen:** Die Optionskarten sind an der Obergrenze — Titel, Technik-Zeile, zwei Sätze Fließtext, Chips, Stats. Das geht gerade noch, aber nur wenn die Stat-Spalte standardisiert wird; sonst konkurrenzieren vier Informationsebenen in jeder Karte um die erste Blickrichtung.

---

## 6. Die drei wirksamsten Änderungen

1. **Shortcuts-Overlay reparieren (`shortcuts.png`)** — ein kompletter Screen zeigt seinen Inhalt nicht; das ist entweder ein Z-Order-Bug oder ein Ernte-Fehler, beides muss vor jedem kosmetischen Input geklärt sein. Höchste Wirkung, weil derzeit ein ganzes Feature für den Spieler unsichtbar ist.
2. **Entscheidungs-Modal: Fußbalken aus dem Fluss nehmen, Scrollbereich darüber enden lassen, sichtbare Bestätigungs-CTA im Fuß verankern** (betrifft `panel_events.png`, `hud_on.png`, `shortcuts.png`, `decision_beat.png`) — aktuell ist auf vier Screens die dritte Option und damit ein Drittel der Entscheidung abgeschnitten und die Handlungsfläche nicht erreichbar. Ein Fix, vier Screens geheilt.
3. **Stat-Template in den Optionskarten normieren** (feste rechte Spalte, Wert über Label, eine gemeinsame Rechtskante) — der Risiko-Vergleich ist der Kern des Entscheidungs-Beats und steht aktuell auf drei verschiedenen x-Positionen; ein reines CSS/Layout-Refactor ohne neue Assets, mit direktem Effekt auf die Kernentscheidung des Spiels.

Knapp dahinter: FEIERABEND auf Stempelstil umstellen (`hud_on.png`) — billig zu machen, stellt die Rot-Disziplin des Themes wieder her.

---

## 7. Blinde Flecken

- **Hover/Fokus/Zustände:** Ich sehe nirgends Hover auf Optionskarten, Buttons oder Listeneinträgen; ob eine Karte wählbar aussieht, entscheidet sich erst im Motion-Bild. Bitte: Screenshot mit gehoverter Option + ausgewähltem Zustand.
- **Scroll-Verhalten des Modals:** Gescrollter Zustand (ist der Fußbalken fix oder scrollt er mit? Gibt es unten einen Bestätigen-Button?). Ein zweiter Shot des Modal-Endes wäre Pflicht.
- **Shortcuts-Inhalt:** Ohne sichtbares Overlay keine Aussage zu Dichte, Spalten, Gruppierung möglich — Nachlieferung nötig.
- **HUD im Spielalltag:** Alle HUD-Shots zeigen das Modal offen. Eine Aufnahme mit HUD allein (z. B. analog zu `building_lobby_day` aus dem Manifest) fehlt — die Eck-Verteilung lässt sich nur dort final bewerten.
- **Asset-Schärfe in Nativauflösung:** Die Weichheit des Bomben-Icons könnte ein Skalierungsartefakt der Aufnahme sein; ein ungezoomter Crop in nativer Auflösung würde das klären.
- **Leere-vs.-gefüllte Panels:** `panel_events.png` zeigt nur den Leerzustand; wie sich Dichte, Trennung und Rhythmus mit 5–10 Ereignissen verhalten, ist aus diesem Paket nicht ableitbar.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
