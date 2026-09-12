# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „ending-1von4"

**Modell:** `stealth/ox-alpha` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-21
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-21T16:57:37.470Z · **Dauer:** 238.0 s
**Nutzung:** 18.325 Prompt + 8.860 Antwort Tokens · **Kosten:** $0.00 (gratis) · **Anbieter-Datensammlung:** ausgeschlossen (deny)

> ⚠️ **Wie das zu lesen ist:** Ein *fremdes* Modell hat einen **kuratierten Ausschnitt**
> des Projekts gesehen — nicht das laufende Spiel und nicht das ganze Repository. Es kann
> daher weder Laufzeitverhalten prüfen noch `file:line`-Belege verifizieren. Befunde sind
> **Hypothesen**, die vor dem Umsetzen am Code/an den Daten gegenzuprüfen sind. Die
> kanonische Wahrheit bleibt [`docs/VISION_LOCK.md`](../VISION_LOCK.md) bzw. die Spieldaten.

## Gestellte Frage

Sieh dir die beigefügten Screenshots des laufenden Spiels an und mache einen UX/UI-Durchgang. Die Optik soll eine Behörden-/Papierwelt sein (Stil-Anker und Farbtoken liegen bei). Sag mir: Wo führt das Bild den Blick falsch, welche Grafiken sitzen an der falschen Stelle oder in der falschen Größe, wo stimmen Abstände und Ausrichtung nicht, und welche drei Änderungen bringen am meisten? Sei so konkret, dass man es direkt umsetzen kann.

## Dieser Durchgang: Bündel „ending-1von4" (10 Screenshots)

Das siehst du, in dieser Reihenfolge:
- end_timeout_wahlabend_s0.png — Wahlabend (echt, timeout), Titelkarte
- end_timeout_wahlabend_s1.png — Wahlabend (echt, timeout), Schritt 1
- end_timeout_wahlabend_s2.png — Wahlabend (echt, timeout), Schritt 2
- end_timeout_wahlabend_s3.png — Wahlabend (echt, timeout), Schritt 3
- end_timeout_gameend.png — GameEndScreen (timeout)
- end_timeout_endreport_top.png — End-Report (timeout), Anfang: „Das Rennen"-Kurven
- end_timeout_endreport_mid.png — End-Report (timeout), Mitte: Methoden-Atlas/Bilanz
- end_timeout_endreport_bottom.png — End-Report (timeout), Ende: Gegenmaßnahmen/Debrief
- end_immune_wahlabend_s0.png — Wahlabend (echt, immune), Titelkarte
- end_immune_wahlabend_s1.png — Wahlabend (echt, immune), Schritt 1

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
| 🖼 Bild | `end_timeout_wahlabend_s0.png` | `desinformation-network/runs/visual-review/latest/shots/end_timeout_wahlabend_s0.png` | 127 kB |
| 🖼 Bild | `end_timeout_wahlabend_s1.png` | `desinformation-network/runs/visual-review/latest/shots/end_timeout_wahlabend_s1.png` | 128 kB |
| 🖼 Bild | `end_timeout_wahlabend_s2.png` | `desinformation-network/runs/visual-review/latest/shots/end_timeout_wahlabend_s2.png` | 154 kB |
| 🖼 Bild | `end_timeout_wahlabend_s3.png` | `desinformation-network/runs/visual-review/latest/shots/end_timeout_wahlabend_s3.png` | 74 kB |
| 🖼 Bild | `end_timeout_gameend.png` | `desinformation-network/runs/visual-review/latest/shots/end_timeout_gameend.png` | 74 kB |
| 🖼 Bild | `end_timeout_endreport_top.png` | `desinformation-network/runs/visual-review/latest/shots/end_timeout_endreport_top.png` | 74 kB |
| 🖼 Bild | `end_timeout_endreport_mid.png` | `desinformation-network/runs/visual-review/latest/shots/end_timeout_endreport_mid.png` | 98 kB |
| 🖼 Bild | `end_timeout_endreport_bottom.png` | `desinformation-network/runs/visual-review/latest/shots/end_timeout_endreport_bottom.png` | 98 kB |
| 🖼 Bild | `end_immune_wahlabend_s0.png` | `desinformation-network/runs/visual-review/latest/shots/end_immune_wahlabend_s0.png` | 132 kB |
| 🖼 Bild | `end_immune_wahlabend_s1.png` | `desinformation-network/runs/visual-review/latest/shots/end_immune_wahlabend_s1.png` | 141 kB |

---

## Antwort des Modells

# UX/UI-Durchgang: Bündel „ending-1von4"

**Vorbemerkung zu den Aufnahmen selbst:** `end_timeout_wahlabend_s3.png`, `end_timeout_gameend.png` und `end_timeout_endreport_top.png` sind offenbar **dasselbe Bild** (identischer Scrollstand, identischer Inhalt). Ebenso `end_timeout_endreport_mid.png` und `end_timeout_endreport_bottom.png`. Damit wurden „GameEndScreen" und die unteren Report-Abschnitte (Gegenmaßnahmen/Debrief laut Beschreibung) **nie wirklich gezeigt** — das ist entweder ein Ernte-Bug oder die Screens sind tatsächlich nicht unterscheidbar. Beides wäre zu klären; ich beurteile die vier sichtbaren Zustände.

---

## 1. Erster Eindruck

**`end_timeout_wahlabend_s0.png`** — Das Auge geht als Erstes auf das rote „Westunion Erwacht", weil es die einzige gesättigte Fläche im Bild ist. Es *sollte* aber zuerst den Balken mit der 9,0 %-Zahl erfassen — die eigentliche Information. Der Balkenblock ist winzig: Er belegt vielleicht 35 % der Frame-Breite und sitzt in einer ansonsten leeren, dunkelblauen Fläche, die ~70 % des Frames ausmacht. Die Zahl „9,0 %" und das Label „SCHWELLE" sind so klein, dass sie erst beim zweiten Hinsehen gelesen werden. Die Ticker-Zeile unten funktioniert, das „Klicken zum Fortfahren" darunter ist so dunkel, dass man es übersieht.

**`end_timeout_wahlabend_s1.png`** — Dasselbe Bild, einziger Unterschied: Ticker-Text und der LIVE-Badge oben rechts, der auf fast unsichtbar abgedunkelt ist. Wenn das ein Zustand („Sendungsende") sein soll, kippt er in Unlesbarkeit — man weiß nicht, ob es ein Renderfehler ist. Der Balken hat sich nicht verändert, obwohl der Ticker „Die Regierung wird bestätigt" meldet — Bild und Aussage widersprechen sich: Die Grafik erzählt keine Geschichte, nur der Text tut es.

**`end_timeout_wahlabend_s2.png`** — Bruch im Layout: Der TV-Frame ist nach oben aus dem Viewport geschoben (obere Kante und Badge abgeschnitten), darunter liegen auf schwarzem Grund ein freistehendes Zitat, fünf winzige Radio-Buttons in drei zentrierten, unterschiedlich breiten Zeilen und ein **voll rot gefüllter WEITER-Button**. Der Blick springt direkt zum Rot — aber das Rot ist laut `theme.ts` (§4.7) Stempel/Kopfbändern vorbehalten, und `stampCtaStyle` definiert genau das Gegenteil: Papierfläche mit rotem Doppelring. Hier wird der eigene Stil-Lock gebrochen. Die Radio-Buttons sind die eigentliche Entscheidung dieses Screens und sind die kleinsten Elemente darauf.

**`end_timeout_wahlabend_s3.png`** (= `gameend`, = `endreport_top`) — Der Blick bleibt zuerst am rechten Rand hängen: Der Button „VOLLSTÄNDIGER LAGEBERICHT →" ist **halb aus dem Viewport abgeschnitten** und überlappt die Report-Kante. Das ist der stärkste Kontrast im Bild und gleichzeitig ein offensichtlicher Layout-Fehler. Danach findet man den dunkelbraunen Kopfbalken mit „Wahlabend verloren" — der funktioniert. Der Fließtext darunter ist fünf gleichgewichtige Absätze ohne Hierarchie; die zwei Chips „ENTTÄUSCHUNG / HOFFNUNGSVOLL" lesen sich wie Filter-Tabs, nicht wie ein gewählter Zustand. Der Close-X oben ist vom Viewportrand angeschnitten.

**`end_timeout_gameend.png`** — identisch zu s3, keine eigene Aussage.

**`end_timeout_endreport_top.png`** — identisch zu s3, keine eigene Aussage.

**`end_timeout_endreport_mid.png`** — Die Karte „✓ Enttarnung (erreicht)" oben rechts fängt den Blick — gut, das ist die wichtigste Info, und Rahmen + Häkchen geben ihr den stärksten Kontrast. Problem: Sie steht als eine von acht gleichrangigen Karten im Raster; das „Ihr Ende" sollte räumlich von den sieben „nicht erreichten" getrennt sein. Unten konkurrieren zwei Handlungen: das zentrierte „BERICHT SCHLIESSEN" (Papier, dezent) und der abgeschnittene „VOLLSTÄNDIGER LAGEBERICHT" am rechten Rand. Die beiden EINORDNUNG-Zitate haben unterschiedliche Randfarben (oliv vs. blau) ohne erkennbare Semantik.

**`end_timeout_endreport_bottom.png`** — identisch zu mid; die beschriebenen Abschnitte „Gegenmaßnahmen/Debrief" sind nicht sichtbar.

**`end_immune_wahlabend_s0.png`** — Fast leeres dunkelrotes Feld. Das Auge sucht zuerst den roten Text „IHRE SCHLAGZEILEN – GEPRÜFT" — aber der ist **Rot auf Dunkelrot**, Kontrast grenzwertig bis ungenügend. Der Inhalt (Überschrift + ein Listenpunkt) nimmt vielleicht 10 % der Frame-Fläche ein, alles andere ist leer. Die „SONDERSENDUNG"-Marke oben rechts ist die sauberste Stelle des Screens.

**`end_immune_wahlabend_s1.png`** — Der „GEFÄLSCHT"-Stempel ist die beste Idee im Bündel und die schlechteste Umsetzung: Er **überdeckt die eigene Überschrift** („GEPRÜFT" ist halb verdeckt) und liegt direkt auf dem Listenpunkt. Die Durchstreichung von „Ihre Kampagne" ist richtig und gut — aber der Stempel selbst sollte daneben liegen, nicht auf dem Text. Außerdem ist der Stempel weich gezeichnet/rotiert und wirkt gegenüber der Pixel-Typo unscharf, und sein Rot ist auf Dunkelrot ebenfalls kontrastarm.

---

## 2. Konkrete Eingriffe je Screen

**`end_timeout_wahlabend_s0.png` / `s1.png`**
- Balkenblock (Label + Balken + Zahl) → horizontal zentrieren im TV-Frame und auf ~70 % der Frame-Breite verbreitern, Balkenhöhe ~2× → er ist die zentrale Information und currently ein Randstreifen.
- Zahl „9,0 %" → auf ~1,5–2× vergrößern, rechte Kante exakt an die rechte Balkenkante ausrichten (jetzt schwebt sie leicht darüber) → sie ist die wichtigste Zahl im Bild.
- „SCHWELLE"-Label → unter den Balken an die Schwellen-Marke setzen (statt oberhalb, wo es mit der Zahl um die Zeile kämpft) und ~1,3× vergrößern → die Marke ist bedeutungstragend (5-%-Hürde?), nicht Deko.
- Balkenfüllung → Kontrast zur dunkelblauen Fläche erhöhen (hellere Papier-/Oliv-Tinte aus `StoryModeColors.surface`) und die Segmente des Balkens (gefüllt / dunkler Mittelteil / Outline-Ende) beschriften oder auf ein Segment reduzieren → aktuell ist unklar, ob das drei Parteien oder ein Skalierungsartefakt ist; die Füllhöhe endet zudem bei ~33 % Balkenbreite, während die Zahl 9,0 % sagt — das Verhältnis muss stimmen oder erklärt werden.
- „Klicken zum Fortfahren" → in `surface`-Farbe (#D9CDAF) statt Dunkelgrau setzen → einzige Interaktions-Aufforderung des Screens, aktuell fast unsichtbar.
- LIVE-Badge in s1 → statt Abdunkeln auf ~20 % entweder einen klaren Zustandstext („ENDE") zeigen oder mindestens 50 % Opazität behalten → jetzt wirkt es wie ein Fehler.

**`end_timeout_wahlabend_s2.png`**
- Gesamtkomposition → TV-Frame vollständig im Viewport halten (oben 24–32 px Rand), Entscheidungs-Panel darunter mit 24–32 px Abstand, Panel-Breite = Frame-Breite, linksbündig zur Frame-Kante → jetzt ist der Frame abgeschnitten und die Steuerung schwebt auf Schwarz.
- Radio-Optionen → aus den drei zentrierten Mikro-Zeilen in ein zweispaltiges Raster innerhalb eines Papier-Panels (`surface`, `border`) umwandeln, jede Option als volle Zeilenbreite mit Radio links, Mindesthöhe ~2× aktuell → das ist die Entscheidung des Screens und ist das kleinste Element.
- Zitat „Im Büro: …" → als Kopfzeile in dieses Papier-Panel integrieren (statt freistehend auf Schwarz) → es ist der Kontext der Optionen und hängt jetzt in der Leere.
- WEITER-Button → den roten Vollflächen-Button durch `stampCtaStyle` ersetzen (Papierfläche, roter Doppelring, rote Stempel-Tinte) und linksbündig bzw. zentriert *im Panel* ausrichten → §4.7: Rot ist Stempel/Kopfband vorbehalten; der eigene Token existiert und wird umgangen.
- Options-Texte → das wiederholte „schaltet ab" streichen, nur die Milieu-Namen zeigen (Zustand steht im Panel-Titel) → kürzere Labels = größere Klickflächen bei gleicher Breite.

**`end_timeout_wahlabend_s3.png` / `gameend` / `endreport_top`**
- „VOLLSTÄNDIGER LAGEBERICHT →" → aus dem Viewport-Rand zurückholen: entweder als sekundäre Text-Schaltfläche in den Kopfbalken rechts oder fixiert unten rechts mit 24 px Rand *innerhalb* des Viewports → aktuell halb abgeschnitten und überlappt das Panel; wirkt kaputt.
- Close-X → in eine sichtbare Kopfleiste des Modals setzen (sticky), nicht an den Viewport-Top → aktuell angeschnitten, Absicht („Abbrechen") unerkennbar.
- Die zwei Chips „ENTTÄUSCHUNG / HOFFNUNGSVOLL" → den aktiven Zustand markieren (gefüllt/getönt, inaktiver nur Outline) → jetzt sehen beide gleich aus; man kann nicht sagen, welcher Bewertungstyp gilt.
- Fünf Fließtext-Absätze → den ersten als Lead typografisch auszeichnen (~1,2× Schrift, `textPrimary`), Rest auf `textSecondary`, oder in Stichpunkte umwandeln → alle Absätze haben gleiches Gewicht, das Auge hat keinen Einstieg.
- Meta-Zeile „Kampagne: 2 Tage … 58 %" → als gestempelte Datenzeile mit Trennlinie unter dem Titel setzen und ~1,2× vergrößern → das sind die Spielleistungs-Kennzahlen und liegen aktuell unter der Wahrnehmungsschwelle.

**`end_timeout_endreport_mid.png` / `endreport_bottom`**
- Karte „✓ Enttarnung (erreicht)" → aus dem 8er-Raster herauslösen und als eigene hervorgehobene Box direkt unter der Überschrift „MÖGLICHE SPIELENDEN" über die volle Breite setzen; die sieben übrigen darunter im 2-Spalten-Raster → das erreichte Ende ist das Ergebnis, die anderen sind Nachschlag; aktuell sind sie gleichrangig.
- „BERICHT SCHLIESSEN" → als Stempel-CTA (`stampCtaStyle`) ausführen und eindeutig primär machen; „VOLLSTÄNDIGER LAGEBERICHT" auf Textlink-Stärke abstufen → zwei gleichstarke Handlungen am Screenende konkurrieren.
- EINORDNUNG-Zitate → linke Randfarbe vereinheitlichen oder Farbcodes dokumentieren (oliv vs. blau wirkt zufällig) → gleiche Struktur, verschiedene Farbe = wirkt wie Bug.
- Letzte Rasterzeile („Patt"/„Fortsetzung") → Zeilenhöhen im Raster angleichen (gleiche `min-height` je Karte) → die kürzere Schlusszeile lässt das Raster auslaufen.

**`end_immune_wahlabend_s0.png`**
- „IHRE SCHLAGZEILEN – GEPRÜFT" → Farbe von `ministryRed` auf `surface`/`surfaceLight` (Tinte auf dunklem Grund) oder deutlich helleres Rot ändern, ~1,5× vergrößern → Rot auf Dunkelrot ist der kontrastärmste Text des Bündels.
- Inhaltsblock → vertikal im Frame zentrieren statt im oberen Drittel, Listenpunkt „Ihre Kampagne" auf ~1,3× vergrößern → der Block hängt dezentral in 90 % Leere.
- „SONDERSENDUNG"-Badge → als Vorlage behalten; zusätzlich eine Sender-Marke („WESTUNION TV") oben links im Frame ergänzen → der Frame hat oben links eine leere Ecke, und die Ticker-Zeile unten ist die einzige Sender-Kennung.

**`end_immune_wahlabend_s1.png`**
- „GEFÄLSCHT"-Stempel → aus der Textzone herausnehmen: in die rechte, leere Frame-Hälfte verschieben (rechte Kante ~15 % vom Frame-Rand), ~1,3× vergrößern, Rotation behalten → er überdeckt gerade die Überschrift, die er bestätigen soll.
- Durchstreichlinie von „Ihre Kampagne" → behalten, aber als eigenes Element vom Stempel entkoppeln (Linie durch den Text, Stempel daneben) → aktuell wirkt die Kante des Stempels wie die Streichung und verdeckt zugleich „GEPRÜFT".
- Stempel-Kontrast → helleres Rot oder dünne Papier-Umrandung um die Stempelform → Rot auf Dunkelrot verliert die Kontur; ein Stempel muss wie aufgedrückt wirken, nicht wie eingebrannt.
- Stempel-Asset → als vorgerendertes, pixelig scharfes Sprite einsetzen statt weich rotiert → die glatten Kanten brechen mit der Pixel-Typo der Umgebung.

---

## 3. Grafiken/Assets

- **Der „GEFÄLSCHT"-Stempel** (`end_immune_wahlabend_s1.png`) ist das einzige echte Bildelement im Bündel — und trägt die falsche Auflösung: weichgezeichnete, antialiaste Kanten gegen eine Umgebung aus Pixel-Schriften. Entweder als scharfes Pixel-Sprite neu rendern oder die Rotation im Asset selbst backen.
- **Die TV-Frames** (`wahlabend_s0–s2`, `immune_s0/s1`) sind reine Farbflächen mit angedeuteten Scanlines. Für einen „Westunion TV"-Wahlabend fehlt jede Sender-Identität: kein Logo/Corner-Bug oben links, keine Parteifarben am Balken, kein Studio- oder Grafik-Hintergrund. Ein einfacher Sender-Bug oben links würde am meisten bringen.
- **Der End-Report** (`s3`/`mid`) ist rein typografisch. In der Behörden-Papierwelt fehlen genau die Assets, die das Thema trägt: ein „VERTRAULICH"-Stempel als Grafik über dem Kopfbalken (statt nur Text), eine Akten-Lochung/Heftleiste am linken Rand des Papier-Blocks, ggf. ein Passfoto-Platzhalter im Kopfbereich. Der Kopfbalken ist dunkelbraun (`darkConcrete`-Nähe) und damit stilistisch konsistent — das passt.
- **Falsch beschnitten:** der „VOLLSTÄNDIGER LAGEBERICHT"-Button (`s3`, `mid`) — halb außerhalb des Viewports, kein Asset-Problem, sondern Layout-Overflow.
- **Fehlend:** ein Zustands-Asset für den abgedunkelten LIVE-Badge (`s1`) — ein „OFF AIR"/„ENDE"-Zustand wäre klarer als Opazität nahe null.

---

## 4. Raster & Rhythmus

- **Wahlabend s0/s1:** Der TV-Frame ist sauber zentriert mit gleichmäßigen schwarzen Rändern — das Fundament stimmt. Innerhalb des Frames herrscht aber kein Raster: Der Balkenblock hängt links der Mitte, die Zahl schwebt, der Ticker ist voll breit. Ein einfaches Innenraster (24–32 px Frame-Padding, Balkenblock zentriert, Ticker als eigene Fußzone) fehlt.
- **s2:** Der Screen hat zwei Layoutsysteme ohne Übergang — TV oben (abgeschnitten) und freie zentrierte Elemente auf Schwarz unten. Die drei Options-Zeilen haben unterschiedliche Breiten und wirken wie umgebrochener Inline-Text, nicht wie ein Raster.
- **End-Report:** Einspaltig, ~55 % Viewportbreite, links positioniert — rechts entsteht eine tote schwarze Spalte, die nur durch den abgeschnittenen Button gestört wird. Entweder das Papier-Panel zentrieren oder die rechte Spalte bewusst nutzen (z. B. für den Lagebericht-Zugriff).
- **mid:** Das 2-Spalten-Kartenraster ist ordentlich, aber die letzte Zeile bricht den Rhythmus (kürzere Karten). Der Abstand Überschrift → Raster ist großzügig, Raster → EINORDNUNG ebenfalls — das funktioniert.
- **immune s0/s1:** Kein erkennbares Raster; der Inhaltsblock sitzt ohne Bezug zu Frame-Kanten oder Mitte. Beide Screens leiden an derselben Krankheit wie s0/s1: 80–90 % leere Fläche um einen Mini-Inhalt.

---

## 5. Lesbarkeit

Zweimal hingesehen habe ich an:
- **„SCHWELLE"** (`wahlabend_s0/s1`) — winzig, und die Bedeutung (Hürde?) erschließt sich nur aus dem Kontext.
- **LIVE-Badge in `s1`** — ist es aus, oder ist es kaputt?
- **„Klicken zum Fortfahren"** (alle Wahlabend-Screens) — unter Kontrastminimum auf Schwarz.
- **Rot auf Dunkelrot** (`immune_s0`: „IHRE SCHLAGZEILEN – GEPRÜFT"; `immune_s1`: Stempel) — der Theme-Kommentar rechnet Kontraste für Text auf `surface` nach, nicht für Rot auf dunklen Zonen; genau diese Kombination wird hier mehrfach gebraucht und scheitert.
- **Radio-Optionen in `s2`** — Schriftgröße an der Untergrenze, Radio-Punkte kaum erkennbar, kein erkennbarer Fokus-/Hover-Zustand im Standbild prüfbar.
- **Meta-Zeile im Report-Kopf** („Kampagne: 2 Tage …") — wichtige Kennzahlen in der kleinsten Schrift des Screens.
- **Achsen-Labels „100 % / 75 %"** im VERTRAUENSVERLAUF (`s3`) — sehr klein, und der Chart wird genau am Falz abgeschnitten, sodass die Kurve selbst nicht beurteilbar ist.
- **„ENTTÄUSCHUNG / HOFFNUNGSVOLL"** (`s3`) — ohne aktiven Zustand unlesbar als *Zustand*; man muss raten.

Positiv: Die Ticker-Zeilen („WESTUNION TV" + Text) sind durchgehend die lesbarste Einheit der TV-Screens — Label-Tinte, klare Trennung, gute Größe. Das als Maßstab nehmen.

---

## 6. Die drei wirksamsten Änderungen

1. **Überlauf-Fix im End-Report:** „VOLLSTÄNDIGER LAGEBERICHT →" aus dem Viewport-Rand zurückholen und den Close-X in eine sichtbare Kopfleiste setzen (`s3`, `mid`). Reiner Layout-Fix, Minuten Aufwand — aktuell sieht der Abschluss-Screen des Spiels kaputt aus, und genau hier endet die Spielerfahrung.
2. **Wahlabend-Datenblock vergrößern und zentrieren** (`wahlabend_s0–s2`): Balken auf ~70 % Frame-Breite, Zahl ~2×, SCHWELLE beschriftet, Füllstand mit der Zahl konsistent. Der Wahlabend ist der dramaturgische Höhepunkt des Endes — momentan ist seine wichtigste Grafik das kleinste Element des Screens.
3. **„GEFÄLSCHT"-Stempel umpositionieren und kontrastieren** (`immune_s1`): aus der Textzone in die leere rechte Frame-Hälfte, größer, scharfes Sprite, hellere Stempelfarbe. Der Stempel ist der stärkste visuelle Gedanke des Bündels (Faktencheck schlägt Kampagne) — er darf nicht die Zeile verdecken, die er bewertet.

Knapp dahinter, aber Pflicht: der rot gefüllte WEITER-Button in `s2` verletzt den eigenen Stil-Lock (§4.7, `stampCtaStyle` existiert) — das ist eine Ein-Zeilen-Änderung im Code.

---

## 7. Blinde Flecken

- **Scroll-Verhalten des End-Reports:** Da `gameend`/`endreport_top` mit `s3` identisch sind und `endreport_bottom` mit `mid`, wurde nie gezeigt, was zwischen „VERTRAUENSVERLAUF"-Chart und „MÖGLICHE SPIELENDEN" liegt (die Beschreibung nennt „Das Rennen"-Kurven, Methoden-Atlas, Gegenmaßnahmen/Debrief). Ich brauche echte Zwischen- und End-Captures des gescrollten Reports.
- **Animationen:** Füllt sich der Balken im Wahlabend animiert? Läuft der Ticker? Wie „slamt" der GEFÄLSCHT-Stempel auf (Stempel-Animation wäre hier tonangebend)? Ohne Bewegtbild kann ich Rhythmus und Timing nicht beurteilen.
- **Hover/Fokus-Zustände** der Radio-Optionen (`s2`), der Report-Karten (`mid`) und beider CTA-Varianten (Stempel vs. Vollfläche).
- **Der LIVE-Badge-Übergang** (`s0`→`s1`): Animation oder Sprung?
- **Der vollständige VERTRAUENSVERLAUF-Chart** (`s3` bricht am Falz ab) — Achsen, Kurve, Beschriftung unprüfbar.
- **immune_s2+**: Die Immune-Variante ist nach Schritt 1 abgeschnitten; Vergleichbarkeit mit der Timeout-Variante (Schritt 2/3, Milieu-Abfragen) fehlt.
- **Auflösung/DPI:** Ob die Pixel-Schriften (VT323, Press Start 2P) auf ganzzahligen Skalierungen laufen, ist aus den Standbildern nicht sicher zu sagen — der Stempel-Weichzeichner könnte auch ein Skalierungsartefakt sein.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
