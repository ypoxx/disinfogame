# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „dialog"

**Modell:** `stealth/ox-alpha` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-21
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-21T16:57:37.470Z · **Dauer:** 262.7 s
**Nutzung:** 13.422 Prompt + 7.364 Antwort Tokens · **Kosten:** $0.00 (gratis) · **Anbieter-Datensammlung:** ausgeschlossen (deny)

> ⚠️ **Wie das zu lesen ist:** Ein *fremdes* Modell hat einen **kuratierten Ausschnitt**
> des Projekts gesehen — nicht das laufende Spiel und nicht das ganze Repository. Es kann
> daher weder Laufzeitverhalten prüfen noch `file:line`-Belege verifizieren. Befunde sind
> **Hypothesen**, die vor dem Umsetzen am Code/an den Daten gegenzuprüfen sind. Die
> kanonische Wahrheit bleibt [`docs/VISION_LOCK.md`](../VISION_LOCK.md) bzw. die Spieldaten.

## Gestellte Frage

Sieh dir die beigefügten Screenshots des laufenden Spiels an und mache einen UX/UI-Durchgang. Die Optik soll eine Behörden-/Papierwelt sein (Stil-Anker und Farbtoken liegen bei). Sag mir: Wo führt das Bild den Blick falsch, welche Grafiken sitzen an der falschen Stelle oder in der falschen Größe, wo stimmen Abstände und Ausrichtung nicht, und welche drei Änderungen bringen am meisten? Sei so konkret, dass man es direkt umsetzen kann.

## Dieser Durchgang: Bündel „dialog" (6 Screenshots)

Das siehst du, in dieser Reihenfolge:
- direktor_intro.png — Kurator-/Direktor-Intro-Dialog direkt nach Vergabe (DialogBox + Porträt)
- dialog_alexei.png — Raum-Nahsicht + DialogBox: alexei (Porträt, Raum-Hintergrund, Mimik)
- dialog_marina.png — Raum-Nahsicht + DialogBox: marina (Porträt, Raum-Hintergrund, Mimik)
- dialog_katja.png — Raum-Nahsicht + DialogBox: katja (Porträt, Raum-Hintergrund, Mimik)
- dialog_direktor.png — Raum-Nahsicht + DialogBox: direktor (Porträt, Raum-Hintergrund, Mimik)
- dialog_igor.png — Raum-Nahsicht + DialogBox: igor (Porträt, Raum-Hintergrund, Mimik)

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
| 🖼 Bild | `direktor_intro.png` | `desinformation-network/runs/visual-review/latest/shots/direktor_intro.png` | 846 kB |
| 🖼 Bild | `dialog_alexei.png` | `desinformation-network/runs/visual-review/latest/shots/dialog_alexei.png` | 818 kB |
| 🖼 Bild | `dialog_marina.png` | `desinformation-network/runs/visual-review/latest/shots/dialog_marina.png` | 816 kB |
| 🖼 Bild | `dialog_katja.png` | `desinformation-network/runs/visual-review/latest/shots/dialog_katja.png` | 828 kB |
| 🖼 Bild | `dialog_direktor.png` | `desinformation-network/runs/visual-review/latest/shots/dialog_direktor.png` | 843 kB |
| 🖼 Bild | `dialog_igor.png` | `desinformation-network/runs/visual-review/latest/shots/dialog_igor.png` | 729 kB |

---

## Antwort des Modells

# UX/UI-Durchgang · Bündel „dialog“ (6 Screenshots)

## 1. Erster Eindruck

**direktor_intro.png** — Das Auge landet zuerst auf der großen Cyan-Weltkarte, dann auf dem roten Kopfband, dann auf der zweiten roten Lichtquelle (Alarmleuchte oben rechts). Drei konkurrierende Hotspots im selben Blickbogen, bevor irgendetwas Erzähltes erreicht wird. Der eigentliche Inhalt — eine einzige Textzeile — versinkt in einer vier Zeilen hohen, leeren Papierfläche. Das Porträt von Volkov ist gut platziert, wird aber hart von der Box-Oberkante durch die Schultern geschnitten. Soll-Blickpfad (Porträt → Name → Text) wird erst an dritter Stelle bedient.

**dialog_alexei.png** — Die Monitorwände oben links und Mitte sind die hellsten, gesättigtsten Flächen im Bild und ziehen den Blick sofort; Alexei selbst steht abgedunkelt unten rechts und wird von der Box halbiert. Das olivfarbene Kopfband ist eine Flächenfarbe, die es in den Farbtoken (`theme.ts`) so nicht als Band-Definition gibt — es wirkt wie ein Drittweg zwischen Papier und Tinte. Text wieder eine Zeile in viel zu viel Fläche. Der Raum selbst ist stark, aber er konkurriert mit dem Sprecher statt ihn zu rahmen.

**dialog_marina.png** — Auffälligster Widerspruch des Bündels: Die Uhr zeigt 14:00, das Fenster rechts zeigt aber eine nächtliche Skyline mit beleuchteten Fenstern. Das untergräbt das Tageszeit-System, das anderswo sauber gearbeitet ist. Marinas Porträt ist stilistisch fremd: glatter, fast painterlich, während Alexei und Igor grob gekörnt pixeln. Die Bühnenanweisung „*tippt weiter, ohne aufzusehen*“ ist typografisch nicht von gesprochener Rede unterscheidbar. Blaues Kopfband — gleiche Farbe wie später bei Igor, keine Unterscheidung.

**dialog_katja.png** — Der einzige Sprecher ohne Kennfarbe: Das Kopfband ist Papier auf Papier, Katja verschwindet systemisch hinter Volkov (Rot), Alexei (Oliv), Marina/Igor (Blau). Das Rollenlabel „Feld-Operateurin“ ist das schwächste Textelement aller sechs Screens — ich musste zweimal hinsehen. Der Raum ist der hellste der sechs, dadurch hebt sich die Box am wenigsten vom Grund ab. Porträt wieder unten rechts, gleiche Schnittproblematik.

**dialog_direktor.png** — Bildlich identisches Setup zu `direktor_intro.png` (gleicher Raum, gleiche Box, gleiche Fehler), daher gelten die dortigen Punkte. Inhaltlich: Sprecher ist Kurator Volkov, der Dateiname suggeriert „Direktor“ — wenn das die Szene im Direktorenbüro meint, ist es okay, wenn nicht, stimmt die Etikettierung nicht. Die rote Doppelparty (Kopfband + Alarmleuchte) fällt hier besonders auf, weil sonst nichts im Bild rot ist außer Banner und Posterakzent.

**dialog_igor.png** — Der ruhigste Screen: gedämpfter Raum, klarer Sprecher, gute Lesbarkeit des Namens. Aber wieder das blaue Band ohne Unterscheidung zu Marina, wieder die Bühnenanweisung unstilisiert („*runzelt die Stirn*“), wieder eine Textzeile in leerem Raum. Igors Porträt gehört zur grobkörnigen Fraktion (wie Alexei/Volkov) und bestätigt damit den Stilbruch zu Marina/Katja. Die Tresortür rechts wird vom Porträt angeschnitten — verschmerzbar, aber der interessanteste Raumgegenstand liegt genau auf der Kollisionskante.

---

## 2. Konkrete Eingriffe je Screen

**direktor_intro.png**
- Dialogbox-Body → Mindesthöhe auf ~2 Textzeilen reduzieren oder Höhe an Inhalt koppeln → eine Zeile Text in einer vierzeiligen Fläche ist ein Viertel tote Schirmfläche.
- Rotes Kopfband → auf ~60 % der jetzigen Höhe schrumpfen und Rot auf Volkov/Zentrale als einzigen Rot-Nutzer im Dialogsystem festlegen → aktuell flutet Rot die ganze Kopfzeile und konkurriert mit der Alarmleuchte oben rechts.
- Alarmleuchte oben rechts → im Dialogzustand abdunkeln oder ausblenden → zweiter roter Hotspot im selben Quadranten wie das Band.
- Porträt Volkov → Schnittlinie normieren: Brustbild endet mit festem Überlappwert (~15 % der Boxhöhe) hinter der Box-Oberkante → aktuell variiert die Abschnittshöhe zwischen Schulter und Brust.
- X-Schließen → 1,5× vergrößern, Tintenfarbe statt Dunkelrot auf Rot → derzeit wirkt es wie Deko, nicht wie Bedienelement.
- Rollenlabel „Verbindung zur Zentrale“ → eine Helligkeitsstufe hoch → auf Rot an der Kontrastgrenze.

**dialog_alexei.png**
- Raum-Monitore → während des Dialogs global um ~25 % abdunkeln (weiche Vignette Richtung Box) → die Cyan-Flächen oben gewinnen den Blickkampf gegen Porträt und Text.
- Olivfarbenes Kopfband → entweder auf `militaryOlive` (#6A6244) als definierten Token mappen oder ersetzen durch Papierband + olivfarbene Namens-Tinte → aktuell eine undefinierte Drittfarbe im Flächensystem.
- Body-Text → vertikal an der Oberkante des Body-Bereichs verankern → beim Tippen wandert die Zeile sonst optisch in der Leerfläche.
- Rollenlabel „Technischer Leiter“ → Kontrast auf Oliv nachrechnen → grenzwertig.
- Porträt Alexei → Pixelkörnung angleichen (siehe Abschnitt 3) → grober als die Hälfte des Ensembles.

**dialog_marina.png**
- Fenster rechts → Tages-Variante des Hintergrunds laden (Uhr: 14:00) → Nacht-Skyline widerspricht der eigenen Weltuhr.
- Porträt Marina → auf die Körnung/Auflösung von alexei/igor/volkok normieren → wirkt wie aus einem anderen Asset-Satz.
- Bühnenanweisung „*tippt weiter…*“ → kursiv + `textSecondary`, oder eigene Zeile mit Präfix → aktuell nicht von Rede unterscheidbar.
- Blaues Kopfband → wenn Bandfarbe den Sprecher codiert, braucht Katja ebenfalls eine Kennung; sonst alle Bänder auf Papier vereinheitlichen → System ist zur Hälfte implementiert.

**dialog_katja.png**
- Kopfband → Kennfarbe ergänzen ODER alle Bänder auf Papier + farbige Namens-Tinte/linke Akzentkante (2–3 px Streifen an der linken Boxkante) vereinheitlichen → Katja ist der einzige Sprecher ohne Identitätsmarker.
- Rollenlabel „Feld-Operateurin“ → von `textMuted` auf `textSecondary` oder dunkler → unlesbar auf Papier-on-Papier.
- Raumabdunklung → ~15 % global oder Box-Kante von `borderLight` auf `border` verstärken → hellster Raum der sechs, geringster Box-Kontrast.
- Porträt Katja → Stilangleich wie Marina.

**dialog_direktor.png**
- Alle Punkte aus `direktor_intro.png` (gleiche Komposition) → Konsolidierung in einem gemeinsamen DialogBox-Template statt zwei Pfaden.
- Kopfband-Rothöhe → wie intro reduzieren → Wiederholung desselben Blickkonflikts.
- Body-Mindesthöhe → wie intro koppeln → gleiche tote Fläche.

**dialog_igor.png**
- Bühnenanweisung „*runzelt die Stirn*“ → kursiv/muted wie bei Marina → gleiche Regel, konsequent anwenden.
- Blaues Kopfband → identisch zu Marina; entweder pro Abteilung abstuifen (Medien vs. Finanzen) oder vereinheitlichen → zwei verschiedene Personen, eine Farbe, kein Informationsgewinn.
- Porträt-Igor → Busthöhe über alle sechs Screens auf ein einheitliches Verhältnis zur Boxhöhe normieren → Kopfgrößen variieren spürbar zwischen den Charakteren.
- Body-Mindesthöhe → koppeln → gleiche Leerflächen-Problematik.

---

## 3. Grafiken/Assets

**Tragen:** Die sechs Raum-Hintergründe sind die stärksten Assets im Bündel — konsistente Perspektive, Zonenlicht passt zum Stil-Guide (Cyber cyan-dunkel in `dialog_alexei`, Medien warm-hell in `dialog_marina`, Finanzen kühl in `dialog_igor`), Beton/Glas/Stahl sind lesbar. Die Propaganda-Poster bleiben korrekt abstrakt-geometrisch ohne Symbole/Text.

**Fremd:** Die Porträts bilden zwei Auflösungsfraktionen: **grob gekörnt** (Volkov, Alexei, Igor) vs. **glatt/hochauflösend** (Marina, Katja). In der Kopfzeilen-Reihenfolge direkt hintereinander (alexei → marina → katja) springt der Stil sichtbar. Ein einheitlicher Resample-Pfad für alle Porträts fehlt.

**Falsch beschnitten:** Alle Porträts werden von der Box-Oberkante abgeschnitten, aber auf unterschiedlicher Körperhöhe (Schulter bei Alexei, Brust bei Marina/Igor). Es fehlt eine definierte Basislinie.

**Zu klein/schwach:** Die Avatar-Thumbnails in den Kopfzeilen sind so klein, dass man sie mit dem großen Porträt kaum aufgelöst vergleichen kann; das Volkov-Thumbnail ist fast monochrom.

**Falsche Variante:** Marinas Nachthintergrund bei 14:00 (siehe oben) — vermutlich fehlt die Tages-Abwandlung des Room-Assets.

**Fehlt (und würde am meisten bringen):** Ein Continue-Cue (blinkende Ecke/Dreieck unten rechts in der Box). Ohne ihn weiß der Spieler nicht, ob der Text fertig getippt ist — kritisch gerade bei Typewriter-Darstellung.

---

## 4. Raster & Rhythmus

- **Was stimmt:** Die Box spannt über alle sechs Screens voll breit mit gleichen Seitenrändern auf, der Uhr/Menü/HUD-Cluster sitzt konstant oben rechts, das Porträt immer unten rechts — diese drei Konstanten sind gutes Rasterhandwerk.
- **Unruhe:** Bei `dialog_alexei` und `dialog_katja` laufen Tisch- und Stuhlkanten des Raums genau auf die Box-Oberkante zu — die Kollisionslinie zwischen Raum und UI ist unruhig. Eine ~20 % Abdunklung des Raums unterhalb des Horizonts würde die Kante beruhigen.
- **Tote Fläche:** Der Body-Bereich der Box ist in allen sechs Screens zu ~70 % leer. Das ist der größte rhythmische Fehler des Bündels: Die Box behauptet eine Textmenge, die nicht da ist.
- **Fehlende Trennung:** Kopfband und Body sind bei Katja tongleich (Papier auf Papier) — die horizontale Trennkante, die bei den farbigen Bändern implizit existiert, fehlt dort ganz. Eine durchgehende 2-px-`border`-Linie zwischen Band und Body löst das für alle Fälle.
- **Zeilenmaß:** Der Text nutzt nur ~55 % der Boxbreite, die rechte Body-Hälfte ist in jeder Zeile leer. Entweder Textbreite über ein Max-Maß begrenzen und die Box proportional schmaler ziehen, oder die freie rechte Zone bewusst für einen Continue-Cue/Sprecher-Tag nutzen.

---

## 5. Lesbarkeit

- **Zweimal hingesehen:** Rollenlabel „Feld-Operateurin“ (`dialog_katja`) — `textMuted` auf Papier ist die schwächste Stelle des Bündels. Auch „Technischer Leiter“ auf Oliv (`dialog_alexei`) und „Verbindung zur Zentrale“ auf Rot (`direktor_intro`) liegen nahe an der Grenze.
- **Gut:** Namen in Display-Schrift auf allen Bändern klar dominant; Body-Text (Monospace-Weltschrift) hat auf Papier einen komfortablen Kontrast und eine gute Größe.
- **Schwach:** Der X-Button ist auf Rot/Oliv/Blau jeweils dunkel-auf-dunkel gefärbt und zu klein — Zustand und Funktion sind nicht ablesbar.
- **Bühnenanweisungen:** In `dialog_marina` und `dialog_igor` sind Regieanweisungen typografisch gleichberechtigt mit Rede — das verwischt die Stimmbene.
- **Zustände:** Kein sichtbarer Unterschied zwischen „tippt noch“ und „wartet auf Klick“ — der Blockcursor ist das einzige Signal und verschwindet vermutlich nach dem Tippen (auf den Stills nicht prüfbar).

---

## 6. Die drei wirksamsten Änderungen

1. **Dialogbox-Höhe an den Text koppeln** (Mindesthöhe ~2 Zeilen, Wachstum nach unten fixiert). Betrifft alle sechs Screens, eliminiert die größte tote Fläche, gibt dem Raum und dem Porträt Luft — reiner Template-Fix, einmal gebaut, überall wirksam.
2. **Kopfband-System vereinheitlichen:** Papierband für alle, Sprecher-Kennung als farbige Namens-Tinte plus 2–3 px linke Akzentkante; Rot ausschließlich für Volkov/Zentrale. Löst in einem Zug die Katja-Lücke, die Marina/Igor-Doppelung, die Oliv-Token-Frage und hält Ministeriums-Rot knapp, wie es `stampCtaStyle`/§4.7 ohnehin vorsehen.
3. **Continue-Cue + Bühnenanweisungs-Stil einführen:** blinkende Ecke unten rechts in der Box, Regieanweisungen kursiv in `textSecondary`. Beides fehlt bzw. ist ununterscheidbar und betrifft jede einzelne Dialogzeile des Spiels — höchste Frequenz, kleiner Codeaufwand.

---

## 7. Blinde Flecken

- **Typewriter-Verhalten:** Alle sechs Stills zeigen ~1 Zeile — möglicherweise früh im Tippvorgang erwischt. Ich kann nicht sehen, ob die Box dynamisch wächst, scrollt oder statisch ist. Bitte je einen Shot mit vollem Text und mit einem sehr langen Text (>5 Zeilen).
- **Antwortoptionen:** Falls die DialogBox Auswahlzustände kennt (aktiv/gesperrt/neu), waren sie hier nicht sichtbar — eigenes Bundle nötig.
- **Porträt-Animation:** Die Manifest-Beschreibung nennt „Mimik“, auf Stills nicht prüfbar — zwei Frames derselben Figur würden genügen, um Frame-Konsistenz und Körnung im Bewegungsfall zu beurteilen.
- **Hover/Fokus:** X-Button, HUD-, Menü- und Uhr-Elemente ohne Hover-Zustand erfasst.
- **Etikettierung:** `dialog_direktor.png` zeigt Sprecher Volkov — bitte klären, ob der Dateiname die Szene (Direktorenbüro) oder den Sprecher meint; falls Letzteres, stimmt die Ernte-Benennung nicht.
- **Skip/Speed-Indikatoren:** Ob es eine Auto-Play- oder Skip-Anzeige gibt, war nicht erkennbar.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
