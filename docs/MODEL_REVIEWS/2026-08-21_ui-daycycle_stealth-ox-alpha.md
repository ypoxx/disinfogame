# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „daycycle"

**Modell:** `stealth/ox-alpha` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-21
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-21T16:57:37.470Z · **Dauer:** 280.6 s
**Nutzung:** 9.686 Prompt + 6.383 Antwort Tokens · **Kosten:** $0.00 (gratis) · **Anbieter-Datensammlung:** ausgeschlossen (deny)

> ⚠️ **Wie das zu lesen ist:** Ein *fremdes* Modell hat einen **kuratierten Ausschnitt**
> des Projekts gesehen — nicht das laufende Spiel und nicht das ganze Repository. Es kann
> daher weder Laufzeitverhalten prüfen noch `file:line`-Belege verifizieren. Befunde sind
> **Hypothesen**, die vor dem Umsetzen am Code/an den Daten gegenzuprüfen sind. Die
> kanonische Wahrheit bleibt [`docs/VISION_LOCK.md`](../VISION_LOCK.md) bzw. die Spieldaten.

## Gestellte Frage

Sieh dir die beigefügten Screenshots des laufenden Spiels an und mache einen UX/UI-Durchgang. Die Optik soll eine Behörden-/Papierwelt sein (Stil-Anker und Farbtoken liegen bei). Sag mir: Wo führt das Bild den Blick falsch, welche Grafiken sitzen an der falschen Stelle oder in der falschen Größe, wo stimmen Abstände und Ausrichtung nicht, und welche drei Änderungen bringen am meisten? Sei so konkret, dass man es direkt umsetzen kann.

## Dieser Durchgang: Bündel „daycycle" (3 Screenshots)

Das siehst du, in dieser Reihenfolge:
- day_report.png — Tagesfazit (DayReport) nach dem Heimweg
- day_report_bottom.png — Tagesfazit, unteres Ende (Über Nacht / Tranche / Weiter-Button)
- morning_briefing.png — Morgenbriefing des nächsten Kampagnentags

Beurteile **nur diese** Aufnahmen, dafür gründlich. Andere Teile des Spiels kommen in
eigenen Durchgängen dran — verweise nicht auf Dinge, die du hier nicht siehst.

## Gezeigter Ausschnitt

15.047 Zeichen ≈ 4.180 Tokens (geschätzt) aus 3 Quellen · 1 gekürzt

| Quelle | Modus | Zeichen | Status |
|---|---|---:|---|
| `sprite-tool/public/context/game-style-guide.md` | voll | 5.496 | vollständig |
| `desinformation-network/src/story-mode/theme.ts` | voll | 3.375 | vollständig |
| `desinformation-network/runs/visual-review/latest/manifest.json` | projektion | 6.176 | gekürzt |

### Gezeigtes Anschauungsmaterial (3 Screenshot(s))

| Art | Im Text genannt als | Datei | Größe |
|---|---|---|---:|
| 🖼 Bild | `day_report.png` | `desinformation-network/runs/visual-review/latest/shots/day_report.png` | 89 kB |
| 🖼 Bild | `day_report_bottom.png` | `desinformation-network/runs/visual-review/latest/shots/day_report_bottom.png` | 85 kB |
| 🖼 Bild | `morning_briefing.png` | `desinformation-network/runs/visual-review/latest/shots/morning_briefing.png` | 425 kB |

---

## Antwort des Modells

# UX/UI-Durchgang: Bündel „daycycle"

## 1. Erster Eindruck

**`day_report.png`** — Das Auge landet zuerst auf dem roten Titel „LAGEBERICHT – TAG 2", das ist korrekt gesetzt und funktioniert als Anker. Von dort springt es aber nicht dahin, wohin es sollte: Die drei Panels darunter haben alle dieselbe Breite, aber völlig unterschiedliche Dichte. Panel ② „DAS LAND" ist voll, Panel ① und ③ sind zu ~80 % leere Papierfläche — die Mitte wird zur einzigen Informationszone, die Flanken zu toter Fläche. Der Blick pendelt dann ratlos zur Statistikleiste, deren blauer Vollbreitbalken („Deutungshoheit") nicht verrät, was er eigentlich zeigt. Unterkantig schneidet das Bild mitten im „ÜBER NACHT"-Panel ab — der Scroll-Zustand ist als Aufnahme ungünstig, deutet aber auch auf ein Layout hin, das knapp über eine Bildschirmhöhe hinauswächst.

**`day_report_bottom.png`** — Hier bleibt das Auge zuerst am Stempel-Button „NÄCHSTER TAG ▶" hängen, weil er der einzige gesättigt rote Flächenschwerpunkt im unteren Bildteil ist — das ist die richtige Reihenfolge (Ergebnisse lesen → weiterstempeln). Problem: Er muss diesen Status allein gegen die breite „ÜBER NACHT"-Leiste verteidigen, wirkt aber deutlich kleiner als diese. Die wiederholte Statistikleiste oben im Bild zeigt dasselbe Bildproblem wie in `day_report.png`: drei KPI-Werte schweben ohne erkennbaren Bezug über einem durchlaufenden Balken. Rechts am Bildrand blitzen unausgelöschte HUD-Quadratbuttons durch den Dim-Layer — der modale Zustand ist nicht sauber abgedunkelt.

**`morning_briefing.png`** — Das Auge wird zerrieben zwischen drei Konkurrenten: dem Gebäudequerschnitt oben (hell, detailliert, lebendig), dem Briefing-Panel unten (flächig, hell) und dem Häufchen UI-Elemente in den oberen Ecken. Das eigentliche Erstleseziel — die Kopfzeile „Das Risiko brennt…" — liegt in der unteren Bildhälfte und verliert gegen den Gebäude-Screenshot-Bereich. Das Porträt hängt links halb außerhalb des Panels im braunen Kraftpapier-Randstreifen und wirkt wie ein Platzierungsfehler, nicht wie ein gestaltetes Element. Ganz rechts am Rand ragt ein rot gerahmtes Element angeschnitten ins Bild — das sieht nach Bruch aus, nicht nach Absicht.

## 2. Konkrete Eingriffe je Screen

**`day_report.png`**
- Panels ①/②/③ → Spaltenverhältnis von 1:1:1 auf ca. **1 : 1,6 : 1** ändern (mittleres Panel „DAS LAND" breiter, z. B. 45 % der Panelreihe, flankierende je ~27 %) → die Mitte trägt aktuell die einzige Information, bekommt aber nur ein Drittel der Fläche; die leeren Flanken wirken wie Layoutversagen statt wie bewusste Ruhe.
- Panel ① „WAS WIR AUSSPIELEN" bei Leerlage → statt leerem Papier einen **Stempel-Platzhalter** setzen (rot umrandeter, leicht gedrehter Stempel „KEINE AKTIVITÄT – STILLER TAG", vertikal+zentral in der Panelmitte, ca. 60 % Panelbreite) → die Leerfläche wird vom Fehler zum Stil-Mittel; passt zum Stempel-Konzept aus §4.7 des Themes.
- Milieubalken in Panel ② → Balkenfüllung **sichtbar unterschiedlich lang** machen (Skala z. B. 0–100 Vertrauen, Füllstand proportional; Zeile „Die Abgehängten / wütend" muss kürzer oder rot getönt sein gegenüber den „ruhig"-Zeilen) → aktuell sehen alle acht Balken identisch aus; die Grafik transportiert null Daten und widerspricht dem Statuswort rechts.
- Statistikleiste (RISIKO/BUDGET/AUFMERKSAMKEIT + Deutungshoheit-Balken) → die drei KPI-Blöcke **linksbündig auf Drittelraster** ausrichten (jeder Wert beginnt exakt bei 0 %, 33 %, 66 % der Leistenbreite) und den blauen Balken entweder in drei Segmente unterteilen, deren Grenzen auf denselben Drittelmarkierungen liegen, oder ihn klar als eigenen, beschrifteten Indikator absetzen (eigene Zeile, eigenes Label links über dem Balken) → derzeit schweben die Zahlen bezuglos über einem durchlaufenden Balken mit drei Endpunkt-Labels; man muss zweimal lesen, was zusammengehört.
- Titelblock → „REDAKTIONSSCHLUSS" (Kicker) auf ca. **1,3× vergrößern** und den Abstand Kicker→Titel auf etwa die halbe Titelzeilenhöhe reduzieren → der Kicker ist aktuell so klein und weit weg, dass er beim ersten Blick als Rauschen untergeht.
- Rechter Bildrand (durchscheinende Quadrat-Buttons hinter dem Dim) → Dim-Layer der Modal-Ansicht auf nahezu opak anheben oder die HUD-Leiste während des DayReports vollständig ausblenden → Hintergrund-UI, die durchschimmert, zerstört die „Akten-only"-Illusion dieses Screens.

**`day_report_bottom.png`**
- Button „NÄCHSTER TAG ▶" → auf ca. **1,4× vergrößern** (Breite Richtung 300–340 px, Höhe +30 %) und den Abstand zur „ÜBER NACHT"-Leiste oberhalb etwa **doppelt so groß** machen wie den Abstand zum unteren Bildrand → er ist die einzige Aktion im Screen und darf optisch nicht kleiner sein als die Informationsleiste über ihm; mehr Raum unten als oben verankert ihn als Abschluss.
- „ÜBER NACHT"-Leiste → Hauptzeile („Institutionen holen 0,0 Punkte…") auf ca. **1,25× vergrößern** und die Sub-Zeile „Grundrauschen +0,2" mit klarem Einzug (ca. eine Hauptzeilenhöhe) sowie Trennpunkt oder Aufzählungszeichen strukturieren → Haupt- und Nebensatz liegen aktuell fast gleichwertig nebeneinander; die Hierarchie entsteht nur über minimale Größendifferenz.
- Statistikleiste → dieselben Eingriffe wie in `day_report.png` (Drittelraster für KPIs, Balkenlogik klären); beide Screenshots zeigen dieselbe Komponente, der Fehler zieht sich durch.
- Rechter Bildrand (durchscheinende Buttons) → analog `day_report.png`: Dim opak machen.
- Untere Bildkante → unterhalb des Buttons mindestens eine Buttonhöhe Freiraum belassen und dort optional dezente Fußzeile (Tag/Datum der Akte) setzen → aktuell endet der Screen abrupt unter dem Button; das wirkt unfertig statt „abgeschlossen".

**`morning_briefing.png`**
- Porträt links neben dem Panel → **vollständig ins Panel integrieren**: Entweder in die Kopfbereichszeile ziehen (links vor „MORGENBRIEFING – TAG 3", ca. 64–72 px Kante, bündig mit der Header-Grundlinie) oder als sauber überlappendes Badge mit eigenem Papier-Rahmen, das zur Hälfte IN das Panel ragt und symmetrisch zur Paneloberkante sitzt → aktuell schwebt es isoliert im braunen Randstreifen ohne Verbindung zu irgendeinem Textelement; es sieht defekt aus, nicht gestaltet.
- Linker Kraftpapier-Randstreifen des Panels (ca. 110 px breit, nur vom Porträt belegt) → auf ca. **24–32 px** verschlanken oder ganz entfernen und das Panel symmetrisch machen → die asymmetrische dicke Linke-Kante ohne Funktion kippt das gesamte Panel optisch nach links.
- Button „Verstanden ▶" → auf **`stampCtaStyle`** umstellen (Papierfläche, roter Doppelring, rote Stempel-Tinte, Uppercase) analog „NÄCHSTER TAG ▶" → beide Screens sind Primär-Aktionen desselben Tageszyklus, aber nur einer ist gestempelt; die Inkonsistenz schwächt genau die Regel („Rot = Stempel"), die das Theme-File (`desinformation-network/src/story-mode/theme.ts`, §4.7) aufbaut.
- Label „MARINA – VORGRiff" → Schreibweise prüfen und auf durchgängige Versalien bzw. konsequentes Small-Caps-Muster bringen wie bei „TAGESHINWEIS" → im Screenshot erscheinen Kleinbuchstaben mitten im Label; das wirkt wie ein Font-Fallback- oder Transformationsfehler und fällt in einem sonst sauber gesetzten Panel auf.
- Obere rechte Ecke (Uhr-Chip „09:00", Burger-Menü, „HUD · H"-Chip) → zu einer **einzigen Chip-Reihe** zusammenfassen mit gleichem Höhenmaß und gleichem Innenabstand, rechtsbündig an einer gemeinsamen Kante, Uhr als erstes Element von links → aktuell haben drei Elemente drei verschiedene Höhen, Rahmen und Abstände; sie kleben unsortiert in der Ecke.
- Rot gerahmtes Element am äußersten rechten Rand (angeschnitten) → entweder vollständig ins Bild holen (mindestens seine volle Breite plus 16 px Abstand zur Viewport-Kante) oder entfernen → ein halb abgeschnittenes gerahmtes Element liest sich immer als Rendering-Fehler.
- Gebäude-Etagenlabels oben („Fokusgruppen-Analyse", „Newsroom") → sicherstellen, dass die oberste Etagenreihe inkl. Label komplett unterhalb der Top-UI-Chips liegt (mindestens eine Chip-Höhe Abstand) → aktuell werden Beschriftungen vom Bildrand bzw. von der Uhr-Chip-Reihe überdeckt.

## 3. Grafiken / Assets

- **Gebäudequerschnitt (`morning_briefing.png`)**: trägt am meisten — feine, scharfe Pixel-Art, stimmige Nacht-Tönung, lesbarer Skyline-Verlauf. Passt zum Stil-Anker („fein und scharf"). Einziger Makel: Die obere Etagenreihe ist beschnitten, das Asset selbst ist also vermutlich größer als der sichtbare Ausschnitt — den Ausschnitt so legen, dass eine komplette Etage oben abschließt.
- **Porträt im Briefing**: stilistisch passend (Pixel, roter Rahmen), aber falsch platziert (siehe oben) und klein relativ zur Menge an Text, die es begleitet. Es würde mehr tragen, wenn es ~1,5× größer fest in der Panel-Kopfzeile sitzt.
- **Milieubalken (`day_report.png`)**: als Grafik fast wertlos — einheitliche Füllung, winziger roter Tick am linken Ende jeder Leiste, dessen Bedeutung unerklärlich bleibt. Entweder echten Datenbezug geben oder durch Typografie ersetzen.
- **Deutungshoheit-Balken**: flächiges Blau auf voller Breite, keine Skala, keine Teilstriche. Als Asset unvollständig; braucht mindestens Endmarken oder Segmentgrenzen.
- **Fehlend, würde am meisten bringen**: ein **Akten-/Stempel-Motiv** für die leeren Panels ① und ③ in `day_report.png` (z. B. „STILLER TAG"-Stempel, „KEINE GEGENMASSNAHMEN ERKANNT"-Vermerk) — die Panels sind das größte Gestaltungsproblem des Screens, und ein einziges Asset löst beide.

## 4. Raster & Rhythmus

- **`day_report.png` / `day_report_bottom.png`**: Außenränder (je ~10 % Bildbreite links/rechts) stehen in keinem Verhältnis zu den schmalen Panel-Gutters (~18 px). Das ist vertretbar, aber die Panelreihe wirkt dadurch wie ein monolithischer Block; ein Gutters-Verhältnis von ca. 1:2 (Gutter zu Panelinnenabstand) würde die drei Panels besser trennen. Größtes rhythmisches Problem bleibt die Dichte-Asymmetrie voll/leer/voll-leer (siehe Punkt 2). Vertikal fehlt zwischen Panelreihe, Statistikleiste und „ÜBER NACHT" ein erkennbares System — die Abstände variieren, statt einem Basisraster (z. B. Vielfache der Panel-Innenpolsterung) zu folgen.
- **`morning_briefing.png`**: Die Bildteilung ist unausbalanciert — oben ~55 % Gebäude, unten ~45 % Panel, aber das Panel hat links einen funktionslosen 110 px-Streifen und rechts keinen. Die rechte Button-Leiste (K/M/A/K/I) sitzt ohne erkennbares Raster: ungleiche vertikale Abstände, keine Ausrichtung zur Uhr-Chip-Reihe oben. Zwei Tasten mit „K" in einer Spalte wirkt zudem wie ein Duplikat-Bug — zumindest braucht die Gruppe visuelle Gruppierung (eine gemeinsame Papier-Leiste statt lose schwebender Quadrate).

## 5. Lesbarkeit

- **`day_report.png`**: Die Statuswörter „ruhig"/„wütend" rechts in den Milieuzeilen sind in `textMuted`-Nähe und zu klein — „wütend" ist die wichtigste Ausnahme im Screen und müsste als Zustand hervorgehoben sein (Farbe danger, fett). „RISIKO 0 %" und „AUFMERKSAMKEIT 0 %" verwenden unterschiedliche Akzentfarben (ocker vs. petrol) ohne erklärte Bedeutung — ich musste zweimal hinschauen, ob die Farbe codiert oder dekorativ ist. Der Kicker „REDAKTIONSSCHLUSS" ist an der Lesbarkeitsgrenze.
- **`day_report_bottom.png`**: „Grundrauschen +0,2" ist der kritischste Text des Screens (er erklärt die nächtliche Mechanik — genau das Immunisierungsziel des Spiels) und steht in der kleinsten, mattesten Schrift des Panels. Genau hier wäre mehr Größe und `textSecondary` statt `textMuted` angebracht.
- **`morning_briefing.png`**: Body-Text und Headline liegen größenmäßig nah beieinander; die Headline gewinnt nur knapp. „Laune: angespannt" rechts oben im Panel ist sehr klein und wird vom Panelrand „verweht". Das abgeschnittene „VORGRiff"-Label zwingt zum zweiten Hinsehen. Kein Text hat echte Kontrastprobleme — die Token-Werte (alle ≥ 4,5:1 laut Theme-Kommentar) scheinen eingehalten; die Probleme sind hierarchisch, nicht kontrastlich.

## 6. Die drei wirksamsten Änderungen

1. **Milieubalken in `day_report.png` mit echten, unterschiedlichen Werten füllen** (und „wütend" farblich ausnehmen) — geringer Aufwand, denn die Komponente existiert schon; sie lügt currently, und eine Datengrafik, die nichts unterscheidet, untergräbt genau die Datenkompetenz, die das Spiel vermitteln will.
2. **Panels ①/③ in `day_report.png` über Stempel-Platzhalter füllen und das Spaltenverhältnis auf ~1:1,6:1 ändern** — mittlerer Aufwand, aber er beseitigt die größte tote Fläche des gesamten Bundles und macht aus dem schwächsten Screen einen stilistisch konsistenten.
3. **Porträt ins Briefing-Panel integrieren, linken Randstreifen verschlanken und „Verstanden" auf `stampCtaStyle` stellen (`morning_briefing.png`)** — reiner CSS/Positions-Aufwand unter einer Stunde, hebt den Screen von „wirkt fehlerhaft" auf „wirkt gesetzt".

## 7. Blinde Flecken

- **Scroll-/Übergangsverhalten**: `day_report.png` und `day_report_bottom.png` sind offenbar derselbe Screen gescrollt — ich kann nicht sehen, ob der Scroll weich, seitenweise oder mit Snap erfolgt und ob die Statistikleiste sticky ist oder mitscrollt. Eine Vollbild-Aufnahme (oder zwei mit markierter Scrollposition) wäre besser als zwei Halbaufnahmen.
- **Zustände der Milieubalken**: Ich sehe nur einen Tag mit fast überall „ruhig". Wie sieht die Komponente bei polarisiertem Stand aus (hohe Werte, gemischte Richtungen)? Ohne einen solchen Screenshot kann ich nicht beurteilen, ob die Balkenlogik unter Last funktioniert.
- **Hover/Fokus**: Keiner der Screens zeigt Hover-Zustände der Buttons („NÄCHSTER TAG", „Verstanden", die Buchstaben-Buttons rechts). Gerade die Stempel-CTAs leben vom Press/Hover-Gefühl (`active:translate-y-0.5` im Theme).
- **Rechte Randelemente**: Das rot gerahmte, abgeschnittene Element und die K/M/A/K/I-Leiste in `morning_briefing.png` sind funktionell unbekannt — ein Screenshot mit geöffnetem/zugeklapptem Zustand dieser Leiste wäre nötig, um zu beurteilen, ob sie ein Panel-Switcher ist oder etwas anderes.
- **Auflösung/Skalierung**: Ich kann nicht erkennen, ob die Pixel-Fonts (VT323, Silkscreen) in allen Größen scharf rendern — das „VORGRiff"-Artefakt könnte ein Skalierungsproblem sein, das auf anderen Auflösungen anders aussieht. Screenshots in nativer und halber Auflösung würden das klären.
- **Animationen**: Ob die nächtlichen Werte („Abwehr +0,2 → 8") einblenden/zählen oder statisch erscheinen, ist aus Standbildern nicht erkennbar — für den Rhythmus des Tageszyklus entscheidend.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
