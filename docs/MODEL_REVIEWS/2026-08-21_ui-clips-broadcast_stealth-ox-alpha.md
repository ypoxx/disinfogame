# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung

**Modell:** `stealth/ox-alpha` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-21
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-21T17:44:34.894Z · **Dauer:** 91.6 s
**Nutzung:** 10.789 Prompt + 2.291 Antwort Tokens · **Kosten:** $0.00 (gratis) · **Anbieter-Datensammlung:** ausgeschlossen (deny)

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

### Gezeigtes Anschauungsmaterial (4 Screenshot(s))

| Art | Im Text genannt als | Datei | Größe |
|---|---|---|---:|
| 🖼 Bild | `clip_broadcast__f1.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_broadcast__f1.png` | 1028 kB |
| 🖼 Bild | `clip_broadcast__f2.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_broadcast__f2.png` | 1214 kB |
| 🖼 Bild | `clip_broadcast__f3.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_broadcast__f3.png` | 1058 kB |
| 🖼 Bild | `clip_broadcast__f4.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_broadcast__f4.png` | 1062 kB |

---

## Antwort des Modells

## 1. Erster Eindruck

**clip_broadcast__f1.png** — Das Auge landet zuerst auf dem warm beleuchteten Wohnzimmer-Panel unten rechts, weil es der einzige farblich warme Bereich im sonst kühlen Bild ist; das ist vermutlich nicht die gewünschte Erst-Lesung, denn die eigentliche Information („Ministerium sendet", Quote 0%) sitzt im dunklen Streifen daneben und konkurriert schwach. Zweitanker ist der Pförtner im Erdgeschoss, isoliert auf großer grauer Fläche. Die Gebäude-Etagen sind klar gestapelt, aber die Etiketten-Bänder („Etage 2 – Feld-Operationen" etc.) schneiden als harte schwarze Leisten durch jede Etage und zerlegen den Querschnitt optisch. Der TV links unten mit „STANDBY" ist gut platziert, wirkt aber wie ein zweites Thema neben dem Sendungs-Textblock.

**clip_broadcast__f2.png** — Nahezu identisch zu f1; einzige sichtbare Änderung: die Figur im obersten, angeschnittenen Stockwerk (rotes Band) ist von x≈620 nach x≈590 gewandert. Alles andere — Pförtner, Etage-1-Gruppe, Sofa-Gruppe, HUD 11:30 — steht pixelgleich. Das spricht für stabile Idle-Zustände, lässt aber keine Aussage über Laufzyklen zu.

**clip_broadcast__f3.png** — Wieder gleiche Szene; die oberste Figur ist weiter nach rechts gerückt (x≈700), jetzt nahe dem Wasser-/Kaffeegerät. Kein Verspringen, kein Größensprung — die Bewegung wirkt kontinuierlich. Auffällig bleibt: Diese Figur läuft in einer Etage, die vom Bildrand oben abgeschnitten ist; ihr Fuß-Kontakt zum Boden ist nicht prüfbar, sie „schwebt" visuell über dem roten Band ohne sichtbare Bodenlinie.

**clip_broadcast__f4.png** — Neu: ein blauer Auswahl-Rahmen um die mittleren zwei Personen auf dem Sofa im Publikums-Panel. Das ist der stärkste Blickfang des gesamten Clips und kommt ohne erkennbaren Anlass (Quote 0%, keine Sendung). Entweder Hover/Selektion oder ein Fehler — aus Standbildern nicht entscheidbar. Außerdem ist die rechte Sofa-Person gegenüber f1–f3 leicht in der Pose verändert (Arm/Körper), was auf eine Ambient-Animation hindeutet.

## 2. Konkrete Eingriffe je Screen

Gemeinsam für alle vier Frames (Szene identisch):

- **Etiketten-Leisten („Etage 2…", „Direktor / Zentrale…") → als halbtransparente Tags an die jeweilige Deckenkante setzen statt volle schwarze Balken über die ganze Etagenbreite → sie zerschneiden aktuell jede Etage horizontal und kosten ~15% der Szenenfläche.**
- **Wohnzimmer-Panel (unten rechts) → ca. 10–15% Breite reduzieren bzw. Sättigung drosseln → es dominiert als einziger warmer Fleck das Bild, obwohl der Broadcast-Status die Informationsträger-Fläche ist.**
- **Sendungs-Textblock („MINISTERIUM SENDET / QUOTE 0% …") → QUOTE/REICHWEITE als größere Zahlenzeile (~1.5×) direkt unter den Titel setzen, Hinweissatz darunter in textMuted → die Kernzahlen sind aktuell gleich groß wie der erklärende Nebensatz.**
- **Oberstes abgeschnittenes Stockwerk → entweder ganz aus dem Viewport nehmen oder mindestens eine Bodenlinie zeigen → die laufende Figur hat dort keinen sichtbaren Bodenkontakt und wirkt schwebend.**
- **Pförtner im Erdgeschoss → Umgebung links von ihm (leere Graufläche ~300 px breit) mit einem zweiten Mobiliar-/Pflanzen-Element füllen oder Kamera leicht nach rechts verschieben → tote Fläche, die nur ihn isoliert.**
- **Blauer Selektionsrahmen am Sofa (f4) → wenn beabsichtigt, einen Zustands-Trigger sichtbar machen (z. B. Milieu-Label am Rahmen); wenn nicht, Rahmen-Logik prüfen → ein Auswahl-Rechteck ohne erkennbares UI-Angebot liest sich als Bug.**

## 3. Grafiken/Assets

- **Tragend:** Gebäude-Querschnitt (konsistente Beton/Glas-Palette, saubere Pixelkanten), TV-Asset links unten (guter Brutalismus-Charakter), Sofa-Szene (stimmige Innenraum-Palette, warm aber nicht knallig).
- **Fremd wirkend:** Die Sofa-Illustration ist deutlich weicher/detaillierter gezeichnet als der Rest (mehr Schattierungsstufen, fast „gemalt"); Auflösung wirkt höher als die Gebäudesprites. Nicht falsch skaliert, aber stilistisch eine Stufe drüber — ein gemeinsamer Dithering/Shading-Pass würde angleichen.
- **Beschnitt:** Oberstes Stockwerk ist hart am oberen Bildrand abgeschnitten (Figur, rotes Band) — wenn das Absicht ist („es gibt mehr Haus"), fehlt ein Fade oder die Kante des Gebäudekörpers.
- **Skalierung:** Die Figuren in Etage 1 (Zentrale) wirken gegenüber dem Pförtner im EG korrekt proportioniert; Türhöhen in Etage 1 passen zur Körpergröße. Kein Maßstabsbruch erkennbar.
- **Fehlend:** Im Keller-Streifen unten ist nur Kleingedrucktes/Poster angedeutet — dort würde ein einzelnes helles Licht- oder Monitor-Asset am meisten bringen, um die Etage lesbar zu machen.

## 4. Raster & Rhythmus

- Klare vertikale Stapelung der Etagen mit gleichmäßigen Geschosshöhen — gut.
- Unruhe entsteht durch die vollbreiten schwarzen Label-Balken: Sie haben keinen einheitlichen Anker (mal linksbündig „Etage 2", mal mittig „Finanzen / Tresor · Igor"). Auf eine Kante (links am Gebäudesteg) ausrichten.
- Untere Hälfte: drei Blöcke (TV, Text, Wohnzimmer) ohne gemeinsame Grundlinie — TV-Unterkante, Textblock und Sofa-Panel enden auf unterschiedlichen Höhen. Eine gemeinsame Unterkante mit gleichem Innenabstand zum Bildrand würde beruhigen.
- Rechte Shortcut-Leiste (K/M/A/K/I) klebt am Rand mit eigenem Creme-Hintergrund, der nicht mit dem Panel-Rot des Broadcast-Streifens korrespondiert — entweder in den Streifen integrieren oder als eigenes Panel mit gleichem Rand rhythmisch anbinden.
- Tote Fläche: Erdgeschoss-Mitte und der dunkle Raum zwischen Textblock und Wohnzimmer-Panel.

## 5. Lesbarkeit

- „QUOTE 0% REICHWEITE 0% KANAL –": Monospace klein auf Dunkelgrau — Kontrast reicht, aber die Werte sind die wichtigste Info und müssten größer/heller als der umgebende Text sein.
- „Noch keine Maßnahme ausgespielt…" in gedämpftem Grau auf Schwarz: zweimal hingesehen, um zu bestätigen, dass es kein disabled Button-Label ist. Als Status-Zeile mit kleinem Icon kennzeichnen.
- Keller-Poster-Texte („…paper") sind unleserlich klein — falls dekorativ gemeint, ok; falls Info, verfehlt.
- Etiketten-Balken selbst sind gut lesbar (weiß auf schwarz), nur ihre Platzierung stört (s. o.).
- Der blaue Selektionsrahmen in f4 hat kein Label — Zustand unklar (aktiv? hover? Fehler?).

## 6. Die drei wirksamsten Änderungen

1. **Label-Balken zu schwebenden, linksbündigen Tags umarbeiten** — geringer Aufwand (nur Styling), sofort weniger Zerschnittene Etagen, ruhigerer Gesamtquerschnitt.
2. **Quote/Reichweite als hervorgehobene Zahlenzeile vergrößern** — der Broadcast-Panelzweck wird erst damit auf einen Blick lesbar; reiner Typo-Eingriff.
3. **Bodenkontakt/Oberkante des obersten Stockwerks klären** (Bodenlinie zeigen oder Etage rausnehmen) — beseitigt den einzigen echten „Schwebefekt" im Clip und kostet eine Asset-Anpassung.

## 7. Blinde Flecken

- **Kein Urteil möglich über:** tatsächliche Gang-Animation der Figur im obersten Stock (Schrittfolge, Arm-Swing), Idle-Atmen der Charaktere, Loop-Sauberkeit der Ambient-Animationen (Sofa-Person, Pflanze).
- **Unklar:** Ob der blaue Sofa-Rahmen in f4 ein Hover-, Selektions- oder Fokus-Zustand ist — dafür bräuchte ich Frames mit Mausposition oder den Zustand ohne Pointer.
- **Nicht prüfbar:** Übergänge zwischen Tageszeiten (HUD zeigt 11:30, Himmel wirkt abendlich-dunkel — ob das zur Uhrzeit passt, kann ich nur anhand der `sky_*`-Shots aus dem Manifest beurteilen, die hier nicht vorliegen).
- **Offen:** Verhalten der Sprechblasen/Interaktions-Hinweise, Scrollbarkeit der Panels, und ob die Figur im Erdgeschoss zwischen den Frames überhaupt animiert (sie steht pixelgleich — könnte eingefroren sein oder korrektes Idle).
- Für die Bodenkontakt-Frage bei allen Figuren wären Einzelframes mit eingeblendeteter Boden-/Hitbox-Ebene hilfreich.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
