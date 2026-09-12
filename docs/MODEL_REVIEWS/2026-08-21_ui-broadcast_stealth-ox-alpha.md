# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „broadcast"

**Modell:** `stealth/ox-alpha` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-21
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-21T16:57:37.470Z · **Dauer:** 122.9 s
**Nutzung:** 7.243 Prompt + 3.050 Antwort Tokens · **Kosten:** $0.00 (gratis) · **Anbieter-Datensammlung:** ausgeschlossen (deny)

> ⚠️ **Wie das zu lesen ist:** Ein *fremdes* Modell hat einen **kuratierten Ausschnitt**
> des Projekts gesehen — nicht das laufende Spiel und nicht das ganze Repository. Es kann
> daher weder Laufzeitverhalten prüfen noch `file:line`-Belege verifizieren. Befunde sind
> **Hypothesen**, die vor dem Umsetzen am Code/an den Daten gegenzuprüfen sind. Die
> kanonische Wahrheit bleibt [`docs/VISION_LOCK.md`](../VISION_LOCK.md) bzw. die Spieldaten.

## Gestellte Frage

Sieh dir die beigefügten Screenshots des laufenden Spiels an und mache einen UX/UI-Durchgang. Die Optik soll eine Behörden-/Papierwelt sein (Stil-Anker und Farbtoken liegen bei). Sag mir: Wo führt das Bild den Blick falsch, welche Grafiken sitzen an der falschen Stelle oder in der falschen Größe, wo stimmen Abstände und Ausrichtung nicht, und welche drei Änderungen bringen am meisten? Sei so konkret, dass man es direkt umsetzen kann.

## Dieser Durchgang: Bündel „broadcast" (1 Screenshots)

Das siehst du, in dieser Reihenfolge:
- broadcast_expanded.png — Broadcast ausgeklappt: Sendung + Publikums-Wohnzimmer (Milieus)

Beurteile **nur diese** Aufnahmen, dafür gründlich. Andere Teile des Spiels kommen in
eigenen Durchgängen dran — verweise nicht auf Dinge, die du hier nicht siehst.

## Gezeigter Ausschnitt

15.047 Zeichen ≈ 4.180 Tokens (geschätzt) aus 3 Quellen · 1 gekürzt

| Quelle | Modus | Zeichen | Status |
|---|---|---:|---|
| `sprite-tool/public/context/game-style-guide.md` | voll | 5.496 | vollständig |
| `desinformation-network/src/story-mode/theme.ts` | voll | 3.375 | vollständig |
| `desinformation-network/runs/visual-review/latest/manifest.json` | projektion | 6.176 | gekürzt |

### Gezeigtes Anschauungsmaterial (1 Screenshot(s))

| Art | Im Text genannt als | Datei | Größe |
|---|---|---|---:|
| 🖼 Bild | `broadcast_expanded.png` | `desinformation-network/runs/visual-review/latest/shots/broadcast_expanded.png` | 376 kB |

---

## Antwort des Modells

# UX/UI-Durchgang: Bündel „broadcast"

## 1. Erster Eindruck

**broadcast_expanded.png** — Das Auge landet zuerst auf dem roten Kopfband „Die reale Vorlage", das ist korrekt gesetzt: stärkster Kontrast im Bild, oberste Position, klare Kante. Von dort wandert der Blick nach unten zu den Optionskarten A und B — auch das ist die richtige Reihenfolge für eine Entscheidungs-Szene. Dann bricht die Führung zusammen: Karte C wird vom unteren Bildrand bzw. von der Fußleiste abgeschnitten, ohne dass ein Scroll-Indikator oder Abblendung signalisiert „es geht weiter". Der Hintergrund (Wohnzimmer mit Couchgruppe rechts, TV links) ist so stark abgedunkelt, dass er nicht als „Publikums-Wohnzimmer" lesbar ist, sondern als unruhige Grauzone wirkt. Rechts außen kämpfen drei Elemente um Aufmerksamkeit (FEIERABEND-Button, vertikale Icon-Leiste, HUD-Chips), die alle vom Modal angeschnitten oder verdeckt werden — das wirkt unfertig statt absichtsvoll. Erst-Blick-Ziel und Soll-Blick-Ziel stimmen also am Anfang überein, ab der Mitte des Modals nicht mehr.

## 2. Konkrete Eingriffe je Screen

**broadcast_expanded.png:**

- **Optionskarte C → vollständig sichtbar machen oder Scroll-Affordanz ergänzen →** C ist auf halber Texthöhe abgeschnitten (Titel „…eine erfundene …" endet mitten im Wort); entweder Modal-Inhalt so komprimieren, dass alle drei Karten passen, oder unten einen deutlichen Fade + Scrollbalken/Pfeil setzen — aktuell sieht es wie ein Renderfehler aus, nicht wie Scrollen.
- **Fußleiste „Keine Option ist überall die beste…" → vom Inhalt entkoppeln →** sie klebt direkt an der Schnittkante von Karte C und liest sich wie ein fünfter, halber Eintrag; mindestens 12–16 px Luft nach oben, hellere Fläche (`surfaceLight`) und feine Trennlinie zum scrollenden Bereich, damit klar ist: Hinweistext, kein Optionsfeld.
- **Modal-Breite/Position → verbreitern und horizontal zur Bildmitte ziehen →** das Modal nimmt nur ca. die mittlere Hälfte ein, links und rechts bleibt gleichmäßig tote Dunkelheit, während rechts die Bedienelemente angeschnitten werden; Modal auf ca. 60–65 % Bildbreite, zentriert, dann haben die Karten A–C mehr Zeilenlänge und C passt eher ganz rein.
- **Wertepaare (+4 % Risiko / +4 % Aufmerksamkeit) → auf feste Spaltenbreiten setzen →** „+18 %" in Karte C ist breiter als „+2 %" in Karte B und schobt das Label „Risiko" optisch nach rechts; zwei feste Spalten (Zahl rechtsbündig, Label darunter linksbündig zur eigenen Zahl) mit identischem Spaltenursprung über alle drei Karten, ausgerichtet an der rechten Innenkante der Karten minus festem Padding.
- **FEIERABEND-Button rechts → bei geöffnetem Modal dimmen oder ausblenden →** er schaut rot und halb verdeckt hinter dem Modal hervor — Rot ist laut Token (`ministryRed`) Stempel/Alarm vorbehalten; ein angeschnittener roter Block neben einer Entscheidung zieht den Blick dorthin, wo keine Entscheidung ist.
- **Tag-Chips „Zynismus ▲" / „Polarisierung ▲" → vereinheitlichen und erklären →** unterschiedliche Breiten, Dreieck ohne erkennbare Bedeutung; feste Mindestbreite, einheitliches Padding, Dreieck nur behalten, wenn es einen klickbaren Zustand anzeigt — sonst streichen.

## 3. Grafiken/Assets

- **Tragend:** Das rote Kopfband funktioniert — flächiges `ministryRed`, weiße Display-Schrift, klare Kante, genau die „Stempel/Kopfband"-Rolle aus `theme.ts`. Die Papierfläche der Karten (`document`-Ton) mit dunkler Umrandung trägt den Akten-Look glaubwürdig.
- **Fremd:** Die Hintergrundszene (Wohnzimmer, Couchfiguren rechts, TV links) ist stilistisch stimmig, aber durch die Abdunklung auf fast Schwarz reduziert — sie liefert keine Information mehr und wirkt wie Rauschen. Entweder Abdunklung reduzieren (Modal hat schon genug Eigenkontrast) oder die Szene bewusst als Silhouette komponieren statt als halbsichtbares Bild.
- **Falsch beschnitten/gequetscht:** Links unten sind Textfragmente des Spiels („MINISTERI…", „QUOTE 0X…") seitlich vom Modal abgeschnitten und unlesbar — halbe Wörter ohne Funktion. Rechts die vertikale Icon-Leiste (mehrere kleine Quadratkacheln) wird vom Modalrand angeschnitten; jede Kachel zeigt nur Fragment.
- **Skalierung:** Die Prozentwerte und Labels in den Karten sind sehr klein relativ zur Kartengröße — die eigentliche Entscheidungsinformation (Risiko/Aufmerksamkeit) ist die leiseste Schrift im Bild nach dem Hintergrundtext.
- **Fehlt:** Ein Schließen-X oben rechts am Modal. Bei einem ausgeklappten Overlay ist das die erste Suchbewegung des Spielers; aktuell gibt es keinen sichtbaren Ausweg außer Tastatur (falls vorhanden).

## 4. Raster & Rhythmus

- **Vertikaler Rhythmus der Karten:** A und B haben gleichen Aufbau (Titel zweizeilig, Technik-Zeile, Fließtext, Chip), aber unterschiedliche Höhen — der Augenabstand zwischen A→B und B→C variiert leicht. Gleich hohe Innen-Paddings und gleiche Mindesthöhe pro Karte würden einen gleichmäßigen Takt erzeugen.
- **Kopfband vs. Inhalt:** Zwischen rotem Band und erstem Absatz liegt viel Luft, zwischen „IHRE ENTSCHEIDUNG"-Zeile und Karte A deutlich weniger — die Hierarchie kippt: Der Einleitungstext bekommt mehr Raum als die Handlungszeile. Innenabstand unter dem Band reduzieren, „IHRE ENTSCHEIDUNG…" näher an Karte A rücken und ggf. fett/tintiger setzen.
- **Tote Fläche:** Die gesamte linke und rechte Bildhälfte neben dem Modal (je ca. 20–25 % Breite) ist abgedunkelte, informationslose Zone. Wenn das Wohnzimmer-Milieu hier gezeigt werden soll (laut Manifest: „Sendung + Publikums-Wohnzimmer"), ist es im Moment reine Fläche — entweder einbeziehen (schmaler Milieu-Streifen mit Beschriftung der Milieus) oder Overlay vollflächig machen.
- **Rechter Rand:** HUD-Chip (09:00), Menü-Icon, weiteres Chip und Icon-Leiste bilden vier verschiedene vertikale Anker auf engstem Raum, teils bündig am Rand, teils mit Luft — eine gemeinsame rechte Kante mit festem Abstand fehlt.

## 5. Lesbarkeit

- **Karte C, Titelzeile:** abgeschnitten — man muss raten, was dort steht. Härtester Lesbarkeitsfall im Bild.
- **Prozent-/Label-Kombination:** „+4 % / Risiko" in Rot auf Papier ist kontrastok, aber die Zweizeiligkeit (Zahl über Label) bei kleiner Schrift erfordert einen zweiten Blick; größer oder einzeilig („Risiko +4 %") wäre schneller erfasst.
- **Hintergrund-Textfragmente** links unten und rechts („FEIERABEND", Panelreste): unlesbar klein auf Dunkelgrund — sie erzeugen den Eindruck defekter Darstellung statt Tiefe.
- **Fußzeilentext:** kursiv wirkende, kleine Schrift direkt an der Schnittkante — semantisch wichtig (Spielhinweis zur Balance), typografisch als Randnotiz behandelt.
- **Zustände:** Kein erkennbarer Hover-/Aktiv-Zustand auf den Karten sichtbar; ob A/B/C klickbar sind, verrät nur der Kontext. Mindestens ein visuelles Affordanz-Signal (Randfärbung/Stempel-Marker bei Hover) wäre nötig — aus dem Standbild nicht prüfbar, siehe Punkt 7.

## 6. Die drei wirksamsten Änderungen

1. **Karte C komplett sichtbar machen (Scroll-Fix oder Layout-Kompression)** — ein abgeschnittener Entscheidungsoption-Inhalt ist der schwerwiegendste Fehler: Er blockiert die Kernhandlung und wirkt kaputt; hoher Effekt, vermutlich geringer Aufwand.
2. **Modal zentrieren und auf ~60–65 % Breite vergrößern** — löst gleichzeitig die toten Seitenzonen, die angeschnittenen Rechtselemente und die Zeilenlänge der Karten; ein Eingriff, vier Symptome.
3. **Wertspalten (Risiko/Aufmerksamkeit) rasterbündig über alle Karten vereinheitlichen und vergrößern** — das ist die eigentliche Entscheidungsinformation; momentan ist sie die schwächste visuelle Größe im Modal, obwohl der Blick laut Spielziel genau dorthin soll.

## 7. Blinde Flecken

- **Scroll-Verhalten:** Ist der Modal-Inhalt scrollbar (Mausrad, Drag)? Gibt es einen Scrollbar? Ein Screenshot des gescrollten Zustands würde zeigen, ob unter C noch Inhalte liegen.
- **Hover-/Aktiv-Zustände:** Wie reagieren Karten A/B/C, Tag-Chips und der (verdeckte) Bestätigungsweg auf Hover? Einzelbilder davon fehlen.
- **Vollständiges Wohnzimmer:** Laut Manifest zeigt der Screen „Sendung + Publikums-Wohnzimmer (Milieus)" — weder eine Sendung noch unterscheidbare Milieus sind erkennbar. Ein Screenshot ohne/mit schwächerer Abdunklung oder ein Zustand, in dem die Milieus hervorgehoben sind, wäre nötig, um diesen Teil zu beurteilen.
- **Verdeckte UI:** Was unter dem Modal liegt (FEIERABEND-Vollzustand, Icon-Leisten-Beschriftung, linkes Panel mit „QUOTE") ist nicht prüfbar — ein Screen mit geschlossenem Broadcast wäre die Referenz.
- **Schriftrendering in Bewegung:** Ob VT323/Press Start 2P in kleinen Größen flimmern oder sauber rendern, lässt sich am Standbild nicht sagen; eine Aufnahme mit Hover über einem Wertepaar würde helfen.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
