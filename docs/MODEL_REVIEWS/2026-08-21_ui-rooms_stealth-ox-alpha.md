# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „rooms"

**Modell:** `stealth/ox-alpha` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-21
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-21T17:19:08.930Z · **Dauer:** 297.8 s
**Nutzung:** 12.130 Prompt + 7.905 Antwort Tokens · **Kosten:** $0.00 (gratis) · **Anbieter-Datensammlung:** ausgeschlossen (deny)

> ⚠️ **Wie das zu lesen ist:** Ein *fremdes* Modell hat einen **kuratierten Ausschnitt**
> des Projekts gesehen — nicht das laufende Spiel und nicht das ganze Repository. Es kann
> daher weder Laufzeitverhalten prüfen noch `file:line`-Belege verifizieren. Befunde sind
> **Hypothesen**, die vor dem Umsetzen am Code/an den Daten gegenzuprüfen sind. Die
> kanonische Wahrheit bleibt [`docs/VISION_LOCK.md`](../VISION_LOCK.md) bzw. die Spieldaten.

## Gestellte Frage

Sieh dir die beigefügten Screenshots des laufenden Spiels an und mache einen UX/UI-Durchgang. Die Optik soll eine Behörden-/Papierwelt sein (Stil-Anker und Farbtoken liegen bei). Sag mir: Wo führt das Bild den Blick falsch, welche Grafiken sitzen an der falschen Stelle oder in der falschen Größe, wo stimmen Abstände und Ausrichtung nicht, und welche drei Änderungen bringen am meisten? Sei so konkret, dass man es direkt umsetzen kann.

## Dieser Durchgang: Bündel „rooms" (5 Screenshots)

Das siehst du, in dieser Reihenfolge:
- newsroom.png — Newsroom-Vertiefung (Monitore, GEGENSEITE-Streifen)
- fokusgruppe_pretest.png — Analyse-Raum: Fokusgruppen-Pre-Test
- operations_akte.png — Operations-Akte (Kommunikations-Schlachtfeld)
- fokusgruppe.png — Fokusgruppen-Ansicht
- board_direct.png — Narrativ-Tafel direkt (Vergleich zur Hotspot-Version)

Beurteile **nur diese** Aufnahmen, dafür gründlich. Andere Teile des Spiels kommen in
eigenen Durchgängen dran — verweise nicht auf Dinge, die du hier nicht siehst.

## Gezeigter Ausschnitt

15.047 Zeichen ≈ 4.180 Tokens (geschätzt) aus 3 Quellen · 1 gekürzt

| Quelle | Modus | Zeichen | Status |
|---|---|---:|---|
| `sprite-tool/public/context/game-style-guide.md` | voll | 5.496 | vollständig |
| `desinformation-network/src/story-mode/theme.ts` | voll | 3.375 | vollständig |
| `desinformation-network/runs/visual-review/latest/manifest.json` | projektion | 6.176 | gekürzt |

### Gezeigtes Anschauungsmaterial (5 Screenshot(s))

| Art | Im Text genannt als | Datei | Größe |
|---|---|---|---:|
| 🖼 Bild | `newsroom.png` | `desinformation-network/runs/visual-review/latest/shots/newsroom.png` | 373 kB |
| 🖼 Bild | `fokusgruppe_pretest.png` | `desinformation-network/runs/visual-review/latest/shots/fokusgruppe_pretest.png` | 971 kB |
| 🖼 Bild | `operations_akte.png` | `desinformation-network/runs/visual-review/latest/shots/operations_akte.png` | 374 kB |
| 🖼 Bild | `fokusgruppe.png` | `desinformation-network/runs/visual-review/latest/shots/fokusgruppe.png` | 495 kB |
| 🖼 Bild | `board_direct.png` | `desinformation-network/runs/visual-review/latest/shots/board_direct.png` | 469 kB |

---

## Antwort des Modells

# UX/UI-Durchgang — Bündel „rooms"

## 1. Erster Eindruck

**newsroom.png**
Das Auge landet zuerst auf der roten Kopfzeile und dann sofort im großen schwarzen Loch der Mitte: „Keine Beiträge vorhanden" schwimmt allein in einer Fläche, die grob 50–60 % des Panels verschwendet. Die eigentlich informative rechte Spalte („Themen im Aufwind") wirkt dagegen wie Randnotiz — ihre Balken sind dünne Linien, die Werte (48/35/31) hängen isoliert unter den Balken. Der Hintergrundraum ist so dunkel, dass man die Monitore nur ahnt; der Style-Guide verbietet ausdrücklich „dunkle, leere Räume". Erwartet hätte ich als Einstiegspunkt den Gegenseite-Bericht mit dem Aufklärungs-Wert — stattdessen dominiert die Leere. Erstes Auge und Soll-Blick sind also nicht dasselbe.

**fokusgruppe_pretest.png**
Der Blick startet beim gelben Display-Titel, bleibt dort aber hängen, weil die darunterliegende Kartenmatrix visuell sehr gleichförmig ist: 16+ nahezu identische Kästen mit derselben Typo-Hierarchie. Die letzte Kartenreihe („Geschichtsdeutung kapern", „Das Gedenken vergiften") ist hart am unteren Bildrand abgeschnitten — ohne Fade oder Scroll-Indikator wirkt das wie ein Layoutfehler, nicht wie Scroll-Inhalt. Der Schritt-Indikator „1 · Welche Masche testen?" ist zu klein, um als Orientierungsanker zu dienen. Der transluzente Kartengrund lässt den Raum dahinter durchschimmern und erzeugt Texturauschen genau dort, wo gelesen werden soll. Hier muss man zweimal hinsehen, um überhaupt zu verstehen, dass es ein Auswahlschritt ist.

**operations_akte.png**
Der stärkste Screen des Bündels: Papierfläche, Kopfband, VERTRAULICH-Stempel — das trägt die Behördenwelt am besten. Aber das Modal läuft unten aus dem Viewport heraus: Schritt 3 („VERBREITER") wird mitten im ersten Listeneintrag abgeschnitten, ohne erkennbare Scroll-Affordanz. Die rechte Wirkungs-Analyse-Spalte ist zu zwei Dritteln tote Fläche zwischen der Vorschaubox und dem AUSPIELEN-Button. Die Blickführung ist trotzdem klar (links Auswahl, rechts Ergebnis) — sie bricht nur am unteren Rand zusammen. Genau dort, wo der Spieler die nächste Aktion braucht.

**fokusgruppe.png**
Kevin (rot, WÜTEND) funktioniert als Blickanker — das ist die eine Stelle, die das Bild richtig macht. Danach zerfällt der Eindruck: fünf grün gerahmte, strukturell identische Karten, deren untere Hälfte leer ist. Die Inhalte (Bio, Zitat) enden etwa auf halber Kartenhöhe, der Rest ist dunkle Reserve. Die Mood-Labels (RUHIG/WÜTEND) verstecken sich klein unter der Berufsbezeichnung, obwohl sie der eigentliche Zustandswert sind. Der Hintergrundraum ist wieder so dunkel, dass er nur Rauschen liefert. Die Beobachtungs-Haltung („KEINE DIREKTIVE") kommt an, aber das Grid fühlt sich halbgefüllt an.

**board_direct.png**
Dieser Screen ist in seinem jetzigen Zustand funktional unlesbar. Eine grobkörnige Kork-/Noise-Textur liegt mit viel zu hoher Deckkraft über der gesamten Tafelfläche und frisst die Slot-Texte („ERSTE SPUR …", „TAGESGESCHÄFT …") praktisch vollständig auf — die Texturkörnung ist größer als die Pixelschrift, das ist ein harter Skalierungsbruch. Die drei Status-Chips oben sind lesbar, aber in drei verschiedenen Füllungen gestylt. Die darunterliegenden, abgedunkelten Modals („Die reale Vorlage", „C · Anreichern …") bleiben so präsent, dass die Ebenenhierarchie wackelt. Von allen fünf Screens hat dieser das größte einzelne Problem.

## 2. Konkrete Eingriffe je Screen

**newsroom.png**
- Netzticker-Leerfläche → Panelhöhe an Inhalt koppeln oder 4–5 ausgegrauchte Platzhalter-Tickerzeilen unter den Kopf setzen → ~55 % des Panels sind aktuell tote Fläche, die den Screen entwertet.
- Themen-Balken (rechte Spalte) → Zahlen (48/35/31) rechtsbündig auf dieselbe Zeile wie das Label ziehen, Balken darunter über die volle Spaltenbreite → currently springt das Auge zwischen Label, Balkenende und isolierter Zahl dreimal hin und her.
- „Aufklärung 0%" (oben rechts in der Gegenseite-Box) → auf ca. 1,5× vergrößern und als eigene Kennzahl mit Mini-Label setzen → es ist der wichtigste Fortschrittswert des Screens und klebt jetzt unsichtbar in der Ecke.
- Hintergrundraum → Gesamthelligkeit um etwa eine Stufe anheben oder Vignette reduzieren, Monitore sollen als Cyan-Inseln lesbar bleiben → der Style-Guide fordert „belebt, nicht dunkel/leer".
- Spaltengrenze links/rechts (~62 % Breite) → Trennlinie in `border` (#554836) statt der jetzigen kaum sichtbaren Kante → die beiden Informationszonen brauchen eine klare Naht.

**fokusgruppe_pretest.png**
- Letzte Kartenreihe → unteres Ende der Matrix mit Fade-out versehen plus dezente Scroll-Leiste oder Chevron unten mittig → abgeschnittene Karten ohne Affordanz lesen sich als Bug.
- Meta-Zeilen in den Karten („BOT-VERSTÄRKUNG…", „trifft:", „Kanal:") → auf Labelgröße (`Silkscreen`, `textMuted`) verkleinern, das Zitat als dominante Zeile belassen → aktuell kämpfen drei Textebenen auf nahezu gleicher Größe, die Hierarchie ist flach.
- Schritt-Anzeige „1 · Welche Masche testen?" → als Schrittleiste (1 → 2 → 3) oben rechts neben „Schließen" setzen, aktiver Schritt in Warn-Amber → der Spieler muss wissen, dass dies Schritt 1 von mehreren ist.
- Kartenuntergrund → hinter der Textzone abdunkeln oder Karten auf opake Fläche stellen → das durchscheinende Raumbild erzeugt Kontrastverlust genau auf den Leseflächen.
- Titelbasislinie → „Masche vortesten" exakt auf die Baseline von „ZIELGRUPPEN-ANALYSE" ausrichten, Abstand 8–12 px → die beiden Größen hängen aktuell unausgerichtet nebeneinander.

**operations_akte.png**
- Modal-Unterkante → linke Spalte (Schritte 1–3) als interne Scroll-Region definieren; Kopfband, rechte Analysespalte und AUSPIELEN-Leiste fixieren → Schritt 3 ist aktuell unerreichbar abgeschnitten, das blockiert den Kern-Workflow.
- Rechte Spalte → Vorschau-Box vertikal strecken oder Meterblock + Vorschau als Gruppe oberhalb des Buttons bündeln, Restfläche schließen → die Lücke zwischen Vorschau und AUSPIELEN ist größer als ihr gesamter Inhalt.
- AUSPIELEN-Button → als Fußleiste über die volle Modalbreite (links Spaltenrand bis rechts Spaltenrand) setzen → Primäraktion sollte die breiteste Fläche des Screens haben, nicht eine schwebende Box.
- ANG-Meter in der Zielliste → Farbcodierung vereinheitlichen oder Mini-Legende am Spaltenkopf „ANG" ergänzen → grün/amber wechseln ohne erklärte Bedeutung.
- Radio-Kreise → Trefferfläche auf die gesamte Zeile ausdehnen, gewählte Zeile mit `surfaceLight`-Unterlegung markieren → die Kreise sind zu klein als alleiniges Klickziel für die wichtigste Entscheidung des Screens.

**fokusgruppe.png**
- Kartenhöhe → an den Inhalt koppeln oder unter jedem Zitat eine Infofußzeile (z. B. Milieu-/Einfluss-Chips) ergänzen → die untere Kartenhälfte ist durchgehend leer.
- Rahmenfarben → Grün nur für Auffälligkeiten (WÜTEND) verwenden, neutrale Personen auf `borderLight`-Rahmen → wenn alles grün gerahmt ist, ist nichts hervorgehoben und das eigentliche Signal (Kevin) wird halbiert.
- Mood-Label (RUHIG/WÜTEND) → als Badge rechts oben in die Kartenkopfzeile neben den Avatar-Initialen versetzen → der Zustandswert ist wichtiger als die Berufsbezeichnung und verdient die höhere Position.
- Zitat-Markup → Anführungszeichen-Größe und Einzug über alle sechs Karten vereinheitlichen (aktuell unterschiedlich tief eingerückt) → kleine Inkonsistenzen summieren sich hier zu sichtbarer Unruhe.
- Footer-Zeile („BEOBACHTUNG – KEINE DIREKTIVE…") → linksbündig zur linken Kante des Kartengitters ausrichten → der zentriert schwebende Text hat keine Bezugskante zum Grid darüber.

**board_direct.png**
- Kork-/Noise-Textur → Opazität auf ca. 15–25 % senken oder Textur ausschließlich als Randzone führen; Slotflächen auf `surfaceLight` legen → die Textur ist derzeit größer skaliert als die Schriftpixel und löscht den Inhalt aus.
- Slot-Reihen („ERSTE SPUR", „TAGESGESCHÄFT") → Text auf eigenen Papierstreifen innerhalb der gestrichelten Slots setzen → Platzhaltertexte müssen auch im Leerzustand lesbar sein, sie erklären den Mechanismus.
- Chip-Zeile oben → alle drei Chips auf einen gemeinsamen Stil (Papierfläche, `border`, fette Wertzahl) normieren; „Nächste Sonntagsfrage in 3 Tagen" als vierten Chip in dieselbe Reihe integrieren → drei verschiedene Füllungen plus ein abhängiger Einzelchip erzeugen Unruhe ohne Ordnung.
- LEEREN-Button → von gefülltem Rot auf roten Outline/Stempel-Stil umstellen → Rot ist laut Token (`ministryRed`) Stempel/Alarm vorbehalten; ein destruktiver Sekundärknopf in Vollrot konkurriert mit AUSPIELEN.
- Dim-Layer hinter der Tafel → Abdunkelung der Hintergrund-Modals („Die reale Vorlage", „C · Anreichern") deutlich erhöhen → die Tafel muss als oberste, eindeutige Ebene gelten.

## 3. Grafiken/Assets

- **board_direct.png:** Die Kork-/Noise-Textur ist das größte Asset-Problem des Bündels. Sie wirkt gekachelt und in einem Maßstab, der nicht zur Pixeltypo passt (Körnung > Glyphengröße). Entweder falsch skaliert oder mit falscher Opazität komponiert — beides muss korrigiert werden, bevor irgendetwas anderes an diesem Screen Sinn ergibt.
- **newsroom.png:** Die Raumgrafik existiert, ist aber auf nahezu Schwarz getönt. Wenn der Screen diegetisch ein Monitorbild sein soll (der Titel „NETZWERK-MONITOR" legt das nahe), fehlt die konsequente Umsetzung — dann müssten Rahmen und Scanline-Andeutung im Tech-Petrol (`tech: #275F6B`) kommen. So wirkt es wie ein unvollständig beleuchteter Raum, nicht wie ein Bildschirm.
- **fokusgruppe.png / fokusgruppe_pretest.png:** Die Hintergrundräume sind als transluzente Schichten sichtbar, liefern aber weder Tiefe noch Kontext — nur Helligkeitsrauschen hinter Text. Entweder bewusst abdunkeln (damit sie als Silhouette funktionieren) oder ganz entfernen; der Zwischenzustand hilft niemandem.
- **operations_akte.png:** Sauberstes Asset-Setup. Der VERTRAULICH-Stempel mit leichter Rotation ist genau richtig gesetzt und zeigt, wie Stempel-Optik funktionieren soll. Die kleinen Avatar-/Radio-Elemente sind unauffällig, wirken aber auch etwas auflösungsarm gegenüber der scharfen Typo.
- **Fehlend:** Im newsroom.png würde an Stelle der leeren Tickerfläche ein einzelnes Beispiel-Ticker-Asset (ausgegrauchter Beitrag mit Zeitstempel) am meisten bringen — er zeigt den Zustand, bevor Daten existieren.

## 4. Raster & Rhythmus

- **newsroom.png:** Der 60/40-Split ist vertretbar, aber vertikal gibt es keinen Rhythmus: Kopfzeile, Berichtsbox, Tickerkopf — dann nichts. Die rechte Spalte hat fünf gleichmäßige Blöcke und endet bei ~65 % Höhe, während die linke bis zum Panelboden läuft. Untere Kanten beider Spalten sollten auf einer gemeinsamen Schlusslinie liegen.
- **fokusgruppe_pretest.png:** Das 4-Spalten-Raster ist ordentlich, die Gutters wirken aber enger als der Außenrand des Overlays — Innenabstände sollten mindestens die doppelte Gutterbreite haben. Der Abstand zwischen Titelblock und erster Kartenreihe ist größer als jeder andere vertikale Abstand im Screen und trennt den Titel vom Inhalt.
- **operations_akte.png:** Links Liste (~55 %), rechts Analyse (~45 %): die Proportion stimmt, die Füllung nicht. Die Zielliste hat einen guten, gleichmäßigen Zeilenrhythmus (~10 Einträge mit konstantem Pitch) — daran sollte die rechte Spalte denselben Rhythmus spiegeln (vier Meter mit gleichem Abstand), statt zwei Cluster mit einer großen Lücke.
- **fokusgruppe.png:** 3×2-Grid mit gleichen Breiten ist korrekt aufgebaut; das Problem liegt im Innenleben (top-lastige Füllung, siehe oben). Der Außenrand des Grids zum Bildschirmrand ist asymmetrisch schmal — mehr Luft am Rand würde den Beobachtungs-Charakter ruhiger machen.
- **board_direct.png:** Die Chip-Zeile hat keinen Rasterbezug: drei Chips linksbündig, dann ein vierter Chip allein in einer zweiten Zeile. Entweder alle vier in eine umbrechende Flex-Zeile mit festem Gap oder zweizeilig mit definierten Rollen (Zustand / Zeit).

## 5. Lesbarkeit

- **board_direct.png:** Die Slot-Platzhaltertexte musste ich dreimal anlesen und gebe auf — das ist die einzige Stelle im Bündel, die tatsächlich unlesbar ist, nicht nur schwer.
- **fokusgruppe_pretest.png:** Die Meta-Zeilen („trifft: ‚die da oben'", „Kanal: Social") sind der entscheidende Spielinhalt (welche Milieus erreicht die Masche?) und stehen in der kleinsten, kontrastärmsten Type des Screens. Das ist inhaltlich falsch priorisiert.
- **newsroom.png:** Die Themenwerte (48/35/31) sind klein und grau unter dünnen Balken — der Trendpfeil (▲/▽) trägt die Information allein, die Zahl ist Dekoration. Und „Aufklärung 0%" habe ich erst beim zweiten Hinsehen gefunden.
- **operations_akte.png:** Die „-"-Werte an den vier Metern sind als Leerzustand zu schwach — ein Bindestrich liest sich wie ein Fehler. Gestrichelte, leere Balken würden „noch keine Daten" ohne Text sagen.
- **fokusgruppe.png:** Die kursiven Bio-Zeilen auf dunklem Grund sind an der Grenze; bei `textSecondary`-Tönung auf Dunkel wäre AA nicht gesichert. Die Zustände selbst (RUHIG/WÜTEND) sind farblich klar — nur zu klein platziert.
- **Stilbruch-Befund:** theme.ts beschreibt eine durchgehend Papier-warme UI (v3 „Behörden-Akte"). operations_akte.png folgt dem; newsroom, fokusgruppe und fokusgruppe_pretest sind dunkle Tech-Screens mit Gelb-/Grünakzenten, die zu keinem Token passen (das Gelb des Pretest-Titels, die Grüntöne der Fokusgruppen-Rahmen). Wenn die dunklen Screens diegetisch „Bildschirme" sein sollen, fehlt die Kennzeichnung über den Tech-Token (`#275F6B`) — aktuell sieht es aus wie zwei verschiedene Spiele.

## 6. Die drei wirksamsten Änderungen

1. **board_direct.png: Noise-Textur entschärfen (Opazität ~20 %, Slots auf helle Papierfläche).** Geringster Aufwand, weil es ein einziger Layer-Wert ist — und der Unterschied zwischen „unbenutzbar" und „benutzbar" für den zentralen Planungs-Screen.
2. **operations_akte.png: Interne Scroll-Region für die linke Spalte, AUSPIELEN als feste Fußleiste.** Ohne diesen Fix ist Schritt 3 des Haupt-Workflows unerreichbar; das ist ein Funktionsdefekt, kein Stilproblem.
3. **newsroom.png: Den Leerzustand gestalten (Platzhalter-Tickerzeilen oder Panelhöhe an Inhalt koppeln) und die Themenliste mit Label+Wert auf einer Zeile reparieren.** Der Screen ist der häufigste Anlaufpunkt für Weltfeedback und verschenkt aktuell über die Hälfte seiner Fläche.

## 7. Blinde Flecken

- **Hover/Auswahlzustände:** Bei fokusgruppe_pretest.png (sind die Maschen-Karten klickbar, wie reagieren sie?), operations_akte.png (gewähltes Ziel — Markierung?) und board_direct.png (Drag-and-Drop der Stränge?) sehe ich nur Ruhezustände. Je ein Screenshot mit aktivem Hover bzw. getroffener Auswahl wäre nötig.
- **Scroll-Verhalten:** Ob fokusgruppe_pretest.png und operations_akte.png intern scrollen und wie dabei Kopf/Fuß behandelt werden, ist aus Standbildern nicht ableitbar.
- **Vergleich board_hotspot:** Der Manifest-Eintrag nennt board_direct.png explizit als Vergleich zur Hotspot-Version — diese ist im Paket nicht enthalten, der Vergleich kann also nicht geführt werden.
- **Animation/Bewegung:** REC-Punkt in fokusgruppe.png (blinkt er?), Ticker-Laufschrift im newsroom, LED-/Monitor-Flackern im Hintergrund — alles für Standbilder unsichtbar.
- **Auflösungsdetails:** Ob die kleinen Meter (ANG) und Radio-Kreise in operations_akte.png in Bewegung/Hidpi sauber rendern oder nur in der Screenshot-Skalierung matschig wirken, lässt sich hier nicht prüfen — ein Detail-Crop in nativer Auflösung würde das klären.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
