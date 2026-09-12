# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung

**Modell:** `stealth/ox-alpha` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-21
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-21T17:46:07.322Z · **Dauer:** 122.1 s
**Nutzung:** 10.801 Prompt + 2.322 Antwort Tokens · **Kosten:** $0.00 (gratis) · **Anbieter-Datensammlung:** ausgeschlossen (deny)

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
| 🖼 Bild | `clip_daynight_sweep__f1.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_daynight_sweep__f1.png` | 910 kB |
| 🖼 Bild | `clip_daynight_sweep__f2.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_daynight_sweep__f2.png` | 1165 kB |
| 🖼 Bild | `clip_daynight_sweep__f3.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_daynight_sweep__f3.png` | 1157 kB |
| 🖼 Bild | `clip_daynight_sweep__f4.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_daynight_sweep__f4.png` | 935 kB |

---

## Antwort des Modells

## 1. Erster Eindruck

**clip_daynight_sweep__f1.png** — Das Auge landet zuerst auf dem gelben Label „Finanzen / Tresor · Igor" über der markierten Kellertür, weil es der einzige gesättigte Akzent im unteren Drittel ist; zweiter Anker ist die Uhr oben rechts (10:03). Eigentlich sollte die Blickführung aber beim Gebäude-Querschnitt selbst beginnen — das gelbe Hotspot-Label konkurriert mit den Etagen-Beschriftungen und gewinnt, obwohl es informationell nachrangig ist. Der Avatar im Erdgeschoss steht isoliert auf einer sehr großen, leeren Lobbyfläche und wirkt dadurch verloren. Die rechte Sidebar (K/M/A/K/I) klebt ohne Verbindung zum Gebäude am Rand.

**clip_daynight_sweep__f2.png** — 13:39, nahezu identischer Bildaufbau; einzige sichtbare Änderung ist die Figur auf Etage 3, die jetzt am Wasserspender steht statt an der Tür. Das Auge muss die Figur suchen, weil sie sich nicht farblich vom Flur abhebt. Die Himmels-Tönung hat sich kaum verändert — der Sweep zwischen 10:03 und 13:39 zeigt fast keinen Fortschritt, was die Tageszeit-Anzeige unglaubwürdig macht.

**clip_daynight_sweep__f3.png** — 16:48, jetzt wird der Abendhimmel sichtbar (orange/violetter Horizont), das ist der stärkste Frame der Sequenz. Die Figur auf Etage 3 ist weiter rechts ins Flur-Innere gewandert. Problem: Die Innenräume haben gegenüber f1/f2 praktisch dieselbe Helligkeit — nur der Himmel dreht, das Gebäude bleibt bei „Bürolicht mittags". Das ist plausibel beleuchtet, aber die Trennung Himmel/Innenraum könnte schärfer kommuniziert werden, dass draußen Abend ist (z. B. Fensterreflexe).

**clip_daynight_sweep__f4.png** — 18:00, Nacht. Hier springt ein Fehler ins Auge: Auf Etage 3 stehen plötzlich **zwei** Figuren (eine am Wasserspender, eine neu davor an der Tür), während f1–f3 durchgehend nur eine zeigten. Entweder ist eine zweite NPC-Figur hereingelaufen (dann fehlt sie in f2/f3 als Zwischenposition) oder es ist ein Pop-in. Außerdem dimmt der Nacht-Sweep das Gebäude-Innere stark ab — die Keller-Ebene und Etage 2 werden so dunkel, dass Objekte (Sitzbank, Aktenschrank) fast verschwinden; das widerspricht dem Stil-Guide („nicht dunkel/leer") und dem Zonen-Licht-Konzept.

## 2. Konkrete Eingriffe je Screen

Gemeinsam für alle vier Frames (der Aufbau ist identisch):

- Gelbes Label „Finanzen / Tresor · Igor" → um ~20 % verkleinern und näher an die markierte Tür koppeln (Abstand halbieren), Sättigung des Gelbs reduzieren → es dominiert derzeit das ganze Bild und zieht den Blick weg von den Etagen.
- Uhr oben rechts → Beziehung zur Sidebar herstellen: gleiche Oberkante wie der Menü-/HUD-Button rechts davon, Abstand dorthin vereinheitlichen → aktuell schweben drei HUD-Elemente (Uhr, Burger, HUD-Button) auf drei unterschiedlichen Höhen.
- Rechte Shortcut-Leiste (K/M/A/K/I) → horizontal bündig mit dem Gebäuderand ausrichten oder direkt ans Gebäude heften (max. 8–12 px Luft) → sie wirkt als lose angehängte Spalte ohne Bezug.
- Avatar im Erdgeschoss → entweder Position Richtung Empfangstresen/Eingang verschieben (linke Bildhälfte ist leer) oder Lobby-Möblierung ergänzen → die Figur steht in einer toten Fläche ohne Anker.
- Etage-3-NPC → Farbakzent (z. B. Hemd in Tech-Cyan-Ton) oder weicher Bodenschatten verstärken → die wandernde Figur ist die einzige Bewegung im Clip und trotzdem schwer zu finden.
- Nacht-Frame f4: Innendimmen begrenzen (min. 60 % der Tageshelligkeit in bewohnten Etagen, Keller darf dunkler bleiben) → sonst kippt der Stil-Guide-Grundsatz „belebt, nicht dunkel".

## 3. Grafiken/Assets

- Tragend: Die Gebäude-Querschnitt-Grafik selbst ist konsistent — Deckenlinien, Fahrstuhlschacht rechts und Bodenplatten sitzen in allen vier Frames pixelgenau auf derselben Position. Gute Basis.
- Fremd wirkend: Der Himmel/Skyline-Hintergrund links und rechts des Gebäudes hat eine andere Detaildichte und Weichheit als die harte Pixel-Arbeit des Gebäudes; besonders in f4 wirken die pinken Fensterpunkte der Skyline fast glatt skaliert. Prüfen, ob die Skyline in nativer Pixelauflösung vorliegt oder hochskaliert wurde.
- Der Keller-Boden (braune Erde mit Steinen) bricht stilistisch aus der Beton-Welt — er ist der einzige organisch-texturierte Bereich. Absicht kann sein (Untergrund), aber die Textur ist körniger/schärfer als alles andere.
- Falsch beschnitten wirkt nichts; die Etagen-Labels sind sauber in die Deckenleisten integriert.
- Fehlt: Im Erdgeschoss würde ein Empfangstresen/Pförtnerpult (Manifest kennt einen Pförtner: `pfoertner_bubble`) die leere Fläche füllen und die Avatar-Position motivieren.

## 4. Raster & Rhythmus

- Das Etagen-Raster ist stark: fünf Geschosse mit gleichmäßiger Höhe, Labels durchgängig linksbündig auf derselben Deckenkante. Das trägt den ganzen Screen.
- Unruhe entsteht rechts: Uhr, Burger-Menü, HUD-Button und Shortcut-Spalte bilden vier getrennte Cluster ohne gemeinsame Ausrichtungslinie.
- Tote Fläche: das gesamte Erdgeschoss zwischen Avatar (links) und Glastüren (rechts) — etwa 40 % der Lobbybreite sind leer.
- Der Ticker-Streifen unten („STANDBY MINISTERIUM SENDET …") ist gut abgesetzt, aber der rote Rahmen darüber läuft ohne erkennbaren Zweck über die volle Breite — er trennt nichts, was nicht schon durch die Hintergrundkante getrennt wäre.

## 5. Lesbarkeit

- Die Etagen-Labels („Etage 3 – Analyse & Medien" etc.) sind klein, aber wegen hoher Kontraste lesbar; die Raumbeschriftungen darüber („Zielgruppen-Analyse", „Newsroom") in gleicher Größe auf hellem Grund funktionieren ebenfalls.
- Zweimal hingesehen: die Shortcut-Buchstaben K/M/A/K/I — zwei identische „K" ohne unterscheidbare Funktion sind aus dem Standbild nicht auflösbar; wenn beide korrekt sind, braucht es Tooltip-Zustände.
- Der Ticker-Text ist ausreichend groß, aber „STANDBY" in Grün auf Dunkelrot-Rahmen liegt knapp an der Kontrastgrenze — im Nacht-Frame f4 sinkt er weiter.
- Im Nacht-Frame f4 verlieren die kleinen Objekte (Aktenschrank Etage 2, Mülleimer Keller) ihre Lesbarkeit komplett.

## 6. Die drei wirksamsten Änderungen

1. **Zweite Figur auf Etage 3 in f4 klären bzw. Zwischenframes liefern** (`clip_daynight_sweep__f4.png`) — ein Pop-in zerstört Vertrauen in die Animation schneller als jeder Stilbruch; Aufwand minimal (ein Frame prüfen).
2. **Nacht-Dimmen der Innenräume begrenzen** (f4) — bewohnte Etagen bleiben ≥ 60 % Helligkeit, nur Außenhimmel und Keller dimmen voll; stellt den Stil-Guide-Grundsatz wieder her und kostet nur eine Shader-/Tint-Anpassung.
3. **HUD-Rechtskante ordnen**: Uhr, Menü-Button und Shortcut-Spalte auf eine gemeinsame Oberkante/mit gleichem Seitenabstand setzen — einmalige Layoutarbeit, die jeden einzelnen Screen des Spiels ruhiger macht.

## 7. Blinde Flecken

- **Echte Bewegungsqualität**: Ich sehe vier Endpunkte, keine Interpolation. Ob die Etage-3-Figur läuft, ruckelt oder tweened, ob der Übergang Tag→Nacht kontinuierlich blendet oder stufenweise springt — daraus folgern zu können, bräuchte ich Frames aus der Mitte des Sweeps (z. B. __f2.5) oder den Clip als Ganzes.
- **Avatar-Animation**: Der Erdgeschoss-Avatar ist in allen vier Frames deckungsgleich identisch — ob hier eine Idle-Animation (Atmen, Stil-Guide §Animationen) läuft, ist aus Standbildern nicht erkennbar.
- **Hotspot-Zustände**: Die gelbe Markierung der Kellertür — Hover-Zustand? Dauerhaft? Pulsierend? Nicht beurteilbar.
- **Ticker-Verhalten**: Läuft der Text, blinkt „STANDBY"? Standbild sagt nichts.
- **Auflösung kleiner Details**: LEDs an Server-Racks (Keller), Monitorinhalte, Fensterscheiben — zu klein, um Zustandswechsel zwischen Frames sicher zu erkennen; hier wären Crop-Vergrößerungen der jeweiligen Region hilfreich.
- **Himmelsverlauf 10:03→13:39**: Fast keine Änderung sichtbar — ob das ein Blend-Problem oder ein fehlender Keyframe im Gradient ist, lässt sich nur mit einem Mittags-Closeup des Himmels klären.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
