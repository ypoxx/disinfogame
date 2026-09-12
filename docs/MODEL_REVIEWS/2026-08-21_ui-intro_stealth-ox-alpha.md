# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „intro"

**Modell:** `stealth/ox-alpha` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-21
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-21T17:19:08.930Z · **Dauer:** 312.2 s
**Nutzung:** 13.362 Prompt + 9.374 Antwort Tokens · **Kosten:** $0.00 (gratis) · **Anbieter-Datensammlung:** ausgeschlossen (deny)

> ⚠️ **Wie das zu lesen ist:** Ein *fremdes* Modell hat einen **kuratierten Ausschnitt**
> des Projekts gesehen — nicht das laufende Spiel und nicht das ganze Repository. Es kann
> daher weder Laufzeitverhalten prüfen noch `file:line`-Belege verifizieren. Befunde sind
> **Hypothesen**, die vor dem Umsetzen am Code/an den Daten gegenzuprüfen sind. Die
> kanonische Wahrheit bleibt [`docs/VISION_LOCK.md`](../VISION_LOCK.md) bzw. die Spieldaten.

## Gestellte Frage

Sieh dir die beigefügten Screenshots des laufenden Spiels an und mache einen UX/UI-Durchgang. Die Optik soll eine Behörden-/Papierwelt sein (Stil-Anker und Farbtoken liegen bei). Sag mir: Wo führt das Bild den Blick falsch, welche Grafiken sitzen an der falschen Stelle oder in der falschen Größe, wo stimmen Abstände und Ausrichtung nicht, und welche drei Änderungen bringen am meisten? Sei so konkret, dass man es direkt umsetzen kann.

## Dieser Durchgang: Bündel „intro" (6 Screenshots)

Das siehst du, in dieser Reihenfolge:
- title.png — Titelbildschirm (Menü, Gebäude-Key-Art, Version)
- avatar_choice.png — Personalakte / Avatar-Wahl (Grundzustand)
- avatar_choice_m2.png — Avatar-Wahl: Porträt m2 gewählt, Deckname eingetragen
- arrival_early.png — Ankunfts-Sequenz kurz nach Start (Lobby, Avatar läuft)
- arrival_mid.png — Ankunfts-Sequenz Mitte (Fahrstuhl/Etagen)
- vergabe_akte.png — Vergabe-Szene: EINE Akte „Die Wahl" der Zentrale

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
| 🖼 Bild | `title.png` | `desinformation-network/runs/visual-review/latest/shots/title.png` | 1030 kB |
| 🖼 Bild | `avatar_choice.png` | `desinformation-network/runs/visual-review/latest/shots/avatar_choice.png` | 316 kB |
| 🖼 Bild | `avatar_choice_m2.png` | `desinformation-network/runs/visual-review/latest/shots/avatar_choice_m2.png` | 315 kB |
| 🖼 Bild | `arrival_early.png` | `desinformation-network/runs/visual-review/latest/shots/arrival_early.png` | 577 kB |
| 🖼 Bild | `arrival_mid.png` | `desinformation-network/runs/visual-review/latest/shots/arrival_mid.png` | 585 kB |
| 🖼 Bild | `vergabe_akte.png` | `desinformation-network/runs/visual-review/latest/shots/vergabe_akte.png` | 33 kB |

---

## Antwort des Modells

# UX/UI-Durchgang: Bündel „intro"

---

## 1. Erster Eindruck

**`title.png`** — Das Auge landet zuerst auf dem rot gefluteten „NEUE MISSION"-Button, weil er die gesättigteste und größte Farbfläche ist, dann auf dem leuchtgelben Titel. Beides konkurriert; der eigentliche Erstkontakt sollte der Titel sein, dann der CTA — die Reihenfolge stimmt fast, aber der Button ist so dominant, dass er den Titel schlägt. Der Untertitel „Ein Desinformations-Puzzlepiel" geht dagegen fast unter: dunkelgraue Schrift auf Nachthimmel und Gebäude-Fenstern, Kontrast grenzwertig. Die Bildachse ist gebrochen: Titel und Disclaimer sitzen zentriert, der CTA ist nach rechts versetzt, „TON AN" hängt einzeln links davon — vier verschiedene Fluchtenlinien in einem Screen. Die Gebäude-Key-Art trägt das Bild und ist das stärkste Asset hier.

**`avatar_choice.png`** — Erstaunlich sauberer Screen: rotes Kopfband, Papierfläche, Stempel-CTA — das kommt dem Token-System (`theme.ts`, `stampCtaStyle`) am nächsten. Das Auge geht zuerst in die Porträt-Reihe, was richtig ist. Probleme: Der Auswahl-Zustand (dünner Amber-Rahmen um „Mittel" oben Mitte) ist bei sechs Kacheln kaum zu erkennen, und der reine schwarze Hintergrund um das Panel widerspricht dem warmen `background: '#2E2820'` — es wirkt wie Debug-Umgebung, nicht wie Behördenwelt. Die sechs Porträts selbst sind stilistisch der größte Bruch des gesamten Bündels (dazu unter Punkt 3).

**`avatar_choice_m2.png`** — Gleicher Screen mit Eintrag „Tester". Erkennbare Unterschiede: Das Namensfeld bekommt einen dunkleren, dickeren Rand (vermutlich Fokus/Gefüllt-Zustand) — gut. Aber es gibt kein zweites Signal für die getroffene Wahl: kein Häkchen, kein Stempel auf dem Porträt, und der CTA sieht identisch aus wie im Grundzustand. Man kann dem Bild nicht ansehen, ob „MISSION BEGINNEN" bei leerem Namen gesperrt wäre — der Zustand „valide Eingabe" wird nicht belohnt.

**`arrival_early.png`** — Der Blick wird vom gelben Tag „Direktor / Zentrale · Kurator" eingefangen, weil er das hellste Element im Bild ist — genau falsch, denn in einer Ankunftssequenz sollte der laufende Avatar die Aufmerksamkeit kriegen. Der Avatar ist im Erdgeschoss winzig (deutlich unter 3 % der Bildhöhe) und trägt keinen Marker. Das zweite Problem: Es gibt **zwei konkurrierende Beschriftungssysteme** — Etagen-Namen innen links („Etage 1 – Zentrale") und schwebende Owner-Tags („Ihr Büro", „Feld-Operationen · Katja"), die mal über der Deckenkante, mal unter der Bodenkante hängen. Der oberste sichtbare Stock ist mittig durchgeschnitten — das Framing wirkt unbeabsichtigt.

**`arrival_mid.png`** — Gleiches Bild später: Der Fahrstuhl als Fortschritts-Cue funktioniert (Kabine war unten, ist jetzt bei Etage 1) — das ist die einzige klare Bewegungsinfo. Neu: Es stehen jetzt **zwei Figuren** im Bild (eine vor der Tür in Etage 1, der Spieler im Erdgeschoss), und ohne Marker ist nicht erkennbar, welche der Spieler ist. Alle Beschriftungsprobleme aus `arrival_early.png` bestehen unverändert fort. „ÜBERSPRINGEN ×" oben rechts ist korrekt platziert, aber dunkel-auf-dunkel und damit zu wenig präsent für einen Escape-Hatch.

**`vergabe_akte.png`** — Rein typografische Szene auf Schwarz: Erzählzeile, Zitat, Papierakte, CTA. Die Aktenkarte ist sauber gemacht („STRENG GEHEIM"-Rot, Papierfläche, Barometer) und trägt den Screen — aber sie nimmt nur etwa 28 % der Bildbreite ein und schwimmt in massiver schwarzer Leerfläche oben und unten. Im Barometer muss ich zweimal hinsehen, um den einzelnen Schwellenstrich mit der Zeile „Ziel: über die Schwelle" zu verbinden — der Strich hat kein Label an sich selbst. Der CTA ist wieder vollrot geflutet und bricht damit den Stempelstil, den `avatar_choice.png` korrekt zeigt. Das Amber-Highlight auf „Ziel" im Zitat ist die dritte Akzentfarbe in einer sehr kleinen Karte.

---

## 2. Konkrete Eingriffe je Screen

**`title.png`**
- Untertitel „Ein Desinformations-Puzzlepiel" → Farbe von Dunkelgrau auf `surface`-Creme (#D9CDAF) oder `document` (#D8C9A8) ändern und 1 px dunkle Kontur/Unterlage geben → aktuell unter Kontrastminimum, verschwindet hinter Fenstern des Gebäudes.
- CTA „NEUE MISSION" → von vollrot auf `stampCtaStyle` umstellen (Papierfläche + roter Doppelring + rote Schrift) und horizontal zentrieren zur Titel-Achse → Rot ist laut §4.7 Stempel/Kopfband vorbehalten; volle Rotflächen entwerten das Ministeriums-Rot, und der Rechtsversatz bricht die Mittelachse.
- Titel-Farbe → vom Arcade-Leuchtgelb auf gedämpftes Papier-Gelb bzw. `oldPaper` (#C7B690) mit Tinte-Kontur → das aktuelle Gelb existiert in keinem Token und zieht die Optik in Retro-Arcade statt Behörde.
- Block „TON AN" + Erklärungstext → beide linksbündig auf dieselbe Kante ziehen (aktuell Box und Text beginnen auf unterschiedlichen x-Positionen) und als eine Gruppe mit festem Innenabstand (~1 Zeilenhöhe) unter den CTA hängen → aktuell zwei lose Fragmente ohne Gruppenkante.
- Versionszeile unten → Unterstreichung/Streifung entfernen (wirkt wie ein Link oder ein Fehler), Farbe auf `textMuted`-Äquivalent für Dunkelgrund anheben → aktuell muss man zweimal hinsehen, um zu entscheiden, ob das geklickt werden soll.

**`avatar_choice.png`**
- Außenhintergrund → von reinem Schwarz auf `background` (#2E2820, warmes Kraftbraun) → Token-Konformität; Schwarz lässt das Papierpanel wie einen Screenshot im Debugger wirken.
- Auswahl-State der Porträt-Kachel → doppelten roten Ring im Stempel-Muster (wie `stampCtaStyle`: 2 px Außenrand + 2 px Innenring via inset) statt dünnem Amber-Rahmen, zusätzlich kleines rotes „GEWÄHLT"-Mini-Label oder Stempel-Ecke oben rechts in der Kachel → Amber ist laut Token Warnfarbe und sparsam zu nutzen; ein 1-px-Rahmen ist bei 6 Kacheln kein erkennbarer Zustand.
- Kachel-Labels → Reihen kennzeichnen: über Reihe 1 und 2 je eine Mini-Zeile („DIENSTIDELL A–C" o. ä.) ODER die Labels um ein unterscheidendes Merkmal ergänzen → „Jung/Mittel/Erfahren" erscheint doppelt identisch; die Zuordnung Reihe=Geschlecht ist nur implizit.
- Kopfband → Breite exakt an die Papierkörper-Kanten angleichen (aktuell wirkt das rote Band minimal breiter als die Fläche darunter) → Kantenflucht ist bei einem so strengen Layout das Wichtigste.
- Namensfeld-Rand → auf 2 px `border` (#554836) wie die übrige Rahmensprache, Placeholder auf `textMuted` → aktuelles dünnes Feld fällt aus der 2-px-Welt des Panels heraus.

**`avatar_choice_m2.png`**
- Gewählte Kachel → zusätzlich zum Rahmen einen visuellen Akt (roter Mini-Stempel diagonal über die Kachelecke) → im Vergleich zu `avatar_choice.png` ist sonst nichts passiert; die Wahl muss auch im Nachhinein ablesbar sein.
- CTA-Zustand → wenn der Button erst mit gültigem Namen aktiv wird: gesperrten Zustand definieren (entsättigte Schrift, kein Hover) und hier im validen Zustand leicht anheben (brightness) → aktuell sieht der Button in beiden Screenshots identisch aus; der Screen dokumentiert keinen Fortschritt.
- Namensfeld → Cursor-/Fokus-Ring in `agencyBlue` (#31566E) statt schwarzem Dickrand → Schwarz wirkt wie ein Rendering-Fehler, Blau ist als Tinten-Farbe im Token-System vorgesehen.

**`arrival_early.png`**
- Beschriftungssystem → auf EINE Zeile pro Etage konsolidieren: Etagenname fest innen links **auf** der Deckenkante sitzend („Etage 1 – Zentrale"), Owner-Zusatz in derselben Zeile dahinter („· Ihr Büro"); alle schwebenden Tags („Feld-Operationen · Katja", „Finanzen / Tresor · Igor", „Ihr Büro") in dieses Band integrieren → aktuell hängen die Tags mal über, mal unter der Kante, und „Finanzen / Tresor · Igor" schwebt zwischen EG und Keller ohne eindeutige Zuordnung.
- Gelbes Tag „Direktor / Zentrale · Kurator" → entsättigen (Tinte auf Papier-Tag, `darkOlive`-Schrift) oder nur bei Interaktion aufleuchten lassen → es ist derzeit das blickfangendste Element, obwohl es hier keine aktive Bedeutung hat.
- Avatar → Marker darüber setzen (kleines abwärts gerichtetes Dreieck oder pulsierender Ring in `ministryRed`, ca. 1,5× Sprite-Breite) → der Protagonist ist unter 3 % Bildhöhe ohne Hilfslinie unauffindbar.
- Oberster Bildrand → Kamera so setzen, dass der oberste Stock entweder ganz oder bis zur Deckenkante angeschnitten ist → aktueller Mittendurchschnitt durch Möbel und Tür wirkt kaputt.
- Pillarbox-Schwarzstreifen links/rechts → Himmel/Skyline bis zum Bildrand laufen lassen (Skyline-Kachel horizontal wiederholen) → die schwarzen Säulen reduzieren die Bühne unnötig.

**`arrival_mid.png`**
- Spieler-Marker → wie oben, hier dringlicher: zwei Figuren im Bild, nur eine ist der Spieler → ohne Marker liest man die Szene falsch.
- NPC in Etage 1 → falls relevant, mit eigenem, anders geformtem Tag (z. B. Namensschild statt Marker) kennzeichnen → aktuell gleiche visuelle Kategorie wie der Spieler.
- ÜBERSPRINGEN → Textfarbe auf `surfaceLight` und 1 px helle Border → aktuell dunkel auf Nachthimmel, im wichtigsten Moment (Abbruchentscheidung) zu schlecht lesbar.
- Beschriftungs-Consolidierung → wie `arrival_early.png` (gleiche Maßnahmen, gleiche Begründung).

**`vergabe_akte.png`**
- Aktenkarte → auf ca. 140 % skalieren (von ~28 % auf ~40 % Bildbreite) und vertikal so zentrieren, dass die obere Schwarzfläche halbiert wird → die Karte ist der Inhalt; aktuell wirkt der Screen wie ein unvollendeter Übergang.
- Schwellenstrich im Barometer → Mini-Label „SCHWELLE" direkt über/am Strich platzieren (winzig, `label`-Font, Tinte) und den Strich in `danger`-Rot → die Verbindung Strich ↔ „Ziel: über die Schwelle" entsteht currently erst nach zweitem Lesen; das ist DIE Zahl des Screens.
- CTA „AKTE ÜBERNEHMEN" → auf `stampCtaStyle` umstellen → gleiche Token-Verletzung wie in `title.png`; der wichtigste Storybeat des Intros sollte den Stempel-Codepath zeigen.
- Amber-Highlight auf „Ziel" im Zitat → auf `agencyBlue`-Tinte (Unterstreichen oder Sperrsetzen) umstellen → zusammen mit rotem Stamp und roter Füllung sind das drei Akzente in einer winzigen Karte; Blau ist als Verweis-Tinte im Token-System vorgesehen und kollidiert nicht mit der Alarm-Semantik des Rot.
- Erzählblock → Measure verbreitern (ca. 1,3×) oder linksbündig mit hängender Kante setzen → die zentrierte schmale Spalte erzeugt eine kurze, hängende zweite Zitatzeile mit unschönem Rag.

---

## 3. Grafiken / Assets

**Tragen das Bild:** Gebäude-Key-Art (`title.png`), der Gebäude-Cutaway mit Skyline (`arrival_early/mid.png`), die Papierakte mit Barometer (`vergabe_akte.png`). Diese drei Assets sind stilisch stimmig und detailreich genug.

**Wirkt fremd:**
- **Die sechs Porträts in `avatar_choice.png` / `avatar_choice_m2.png`.** Sie sind gemalt/AI-generiert, keine feine Pixel-Art — direkter Widerspruch zum Stil-Guide („Pixel-Art fein und scharf"). Darüber hinaus sind sie untereinander inkonsistent: m2 steht vor einem Science-Fiction-Korridor mit Cyanlicht, „erfahren" (m) vor rötlich getöntem Grund, die übrigen vor neutralgrauen Türen. Sättigung, Helligkeit und Bildausschnitt (Kopfgröße relativ zur Kachel) variieren — m2 wirkt deutlich kleiner im Rahmen als die anderen. Das ist der größte einzelne Stilbruch des Bündels. Mindestmaß: Hintergründe vereinheitlichen (ein neutraler Aktenfoto-Hintergrund für alle), Farbklima angleichen, Zuschnitt normalisieren.
- **Titel-Leuchtgelb in `title.png`** — keine Entsprechung in `StoryModeColors`; das Gelb gehört in die Arcade-Ecke, nicht in die Behördenwelt.
- **Vollrote Buttons** in `title.png` und `vergabe_akte.png` — als Grafik-Entscheidung falsch skalierte Bedeutung: Rot soll Stempel bleiben, nicht Flächen füllen.

**Was fehlt:** In `vergabe_akte.png` fehlt jede räumliche Verankerung zur Erzählzeile („Volkov schiebt eine Akte über den Tisch") — schon eine dezente Tischkante oder ein Schatten im unteren Bilddrittel würde die Szene verorten, ohne ein neues Asset zu benötigen. In `arrival_early/mid.png` fehlt ein Spieler-Marker-Asset (Pfeil/Ring) komplett.

---

## 4. Raster & Rhythmus

- **`title.png`:** Vier Fluchtenlinien (Titel zentriert, CTA rechtsversetzt, TON-AN-Block linksversetzt, Disclaimer zentriert). Eine einzige Mittelachse für alle Elemente, CTA gleicher Breite wie der Disclaimer-Block — das allein ordnet den Screen.
- **`avatar_choice.png`:** Vertikaler Rhythmus im Panel staffelt unregelmäßig (Grid → NAME-Label groß, Label → Feld eng, Feld → CTA mittel). Auf ein Vielfaches eines Basisabstands bringen (z. B. 8-px-Raster: 32/16/24), dann atmet das Panel. Horizontal ist das Grid sauber; die Gutters sind gleichmäßig — hier nichts tun.
- **`arrival_early/mid.png`:** Die Owner-Tags halten keinen gemeinsamen Bezug zur Deckenkante (mal auf, mal unter ihr). Wenn alle Tags in einem Band mit festem Offset zur Deckenkante sitzen, entsteht sofort Ruhe. Tote Fläche: die rechte Lobby-Hälfte im EG — dort könnte der Pförtner-Tresen (der im Manifest für `building_lobby_day` existiert) die Fläche füllen.
- **`vergabe_akte.png`:** Klassischer Fall von toter Fläche durch Untermaß — die Karte ist zu klein für den schwarzen Raum. Entweder Karte skalieren oder oben/unten mit Erzähltext/Beat-Anzeige füllen; aktuell ist das Verhältnis Inhalt:Leere etwa 1:2.
- **Quer:** `avatar_choice` nutzt Papier-auf-Schwarz, `vergabe_akte` ebenfalls, `title` und `arrival` nutzen Vollbild-Welt. Der Wechsel ist okay (Modal vs. Szene), aber der Modal-Hintergrund muss `#2E2820` sein, sonst lesen sich die beiden Modi wie zwei verschiedene Spiele.

---

## 5. Lesbarkeit

Zweimal hingesehen habe ich an:
- **`title.png`:** Untertitel (Kontrast, siehe oben), die TON-AN-Erklärzeile (sehr klein, grau auf Dunkel), die Versionszeile (Unterstreichung lässt sie wie Link/Streichung wirken).
- **`arrival_early/mid.png`:** „Etage 2 – Feld-Operationen" — dunkle Kleinschrift auf mittelgrauem Beton, Kontrastgrenzbereich; die Owner-Tags (weiß auf schwarz) sind dagegen gut. Empfehlung: Etagen-Namen auf `surfaceLight`-Schriftband oder helle Tinte.
- **`vergabe_akte.png`:** „Barometer: Westunion-Wahltrend / Politbarometer" — die kleinste Zeile der Karte in Muted-Tinte; wenn diese Zeile die Metrik erklärt, verdient sie `textSecondary`.
- **`avatar_choice.png`:** Der Auswahl-Zustand ist funktional ein Lesbarkeitsproblem: Ich musste die Kacheln vergleichen, um zu erkennen, welche gewählt ist. Zustände (aktiv/gesperrt/neu) sind auf diesem Screen insgesamt unterbelichtet — es gibt keinen sichtbaren „noch nichts gewählt"-Leerzustand und keine gesperrte CTA-Variante sichtbar.

---

## 6. Die drei wirksamsten Änderungen

1. **CTA-Stil vereinheitlichen auf `stampCtaStyle` in `title.png` und `vergabe_akte.png`.** Reiner Klassen-/Style-Tausch gegen bereits vorhandenen Code aus `theme.ts`; stellt die Token-Compliance her, gibt dem Ministeriums-Rot seine Bedeutung zurück und vereinheitlicht die primäre Aktion über alle drei Screens — maximaler Konsistenzgewinn bei minimalem Aufwand.
2. **`arrival_early/mid.png`: Beschriftungen auf ein System ziehen + Spieler-Marker.** Ein Band pro Etage (Name + Owner in einer Zeile, fester Sitz auf der Deckenkante), gelbes Tag entsättigen, Marker über den Avatar. Die Ankunftssequenz ist der erste Welt-Kontakt nach dem Menü — aktuell führt sie den Blick aufs Falsche und lässt den Spieler raten, wer er ist.
3. **`vergabe_akte.png`: Karte auf ~140 % skalieren, vertikal zentrieren, Schwellenstrich beschriften.** Der erste Storybeat hängt an dieser einen Zahl; die Skalierung ist eine Layout-Änderung, das Label eine Zeile — zusammen verwandeln sie den leersten Screen des Bündels in den prägnantesten.

---

## 7. Blinde Flecken

Was ich aus diesen sechs Standbildern nicht beurteilen kann:

- **Hover-/Fokus-Zustände** aller interaktiven Elemente (Porträt-Kacheln, CTA, „ÜBERSPRINGEN", TON AN) — besonders relevant, weil der Auswahl-State im Ruhezustand schon so schwach ist.
- **Gespeerrter CTA in `avatar_choice.png`:** Der Grundzustand zeigt einen voll wirksamen Button bei leerem Namensfeld. Ich brauche einen Screenshot mit Klick-Versuch bei leerem Namen (oder die Info, dass der Name optional ist).
- **Typewriter-/Animationszustand in `vergabe_akte.png`:** Ist der Erzähltext getippt, gibt es einen Cursor, steuert ein Klick vor? Das bestimmt, ob die große Leerfläche oben während der Animation gerechtfertigt ist.
- **Bewegung in `arrival_early/mid.png`:** Laufzyklus des Avatars, Fahrgeschwindigkeit des Aufzugs, ob die Etagen-Tags einblenden oder statisch sind, ob der oberste abgeschnittene Stock beim Scrollen/Kamerazug vollständig wird.
- **Native Auflösung der Porträt-Assets:** Skalierungsartefakte und Kantenschärfe sind erst in Nahaufnahme oder bei Fensterresize beurteilbar.
- **Zustandswechsel von „TON AN"** nach dem ersten Klick (wird daraus „TON AUS"? Verschiebt sich das Layout?).
- **Verhalten bei anderen Fenstergrößen:** Die Pillarbox-Streifen in `arrival_*` und die Zentrierung in `avatar_choice`/`vergabe_akte` könnten bei 16:10 oder ultrawide anders brechen — je ein Screenshot in einer zweiten Auflösung würde das klären.
- **Tageszeit-Variante der Ankunft:** Beide Shots zeigen Dämmerung; ob die Sequenz bei anderem Startzeitpunkt getönt wird, ist hier nicht erkennbar (gehört ggf. ins `daynight`-Bundle, dort aber einmal für die Arrival-Kamera).

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
