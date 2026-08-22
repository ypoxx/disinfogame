# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „panels-2von2"

**Modell:** `gpt-5.6-sol` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-22
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-22T17:09:26.285Z · **Dauer:** 206.9 s
**Nutzung:** nicht gemeldet · **Kosten:** unbekannt · **Anbieter-Datensammlung:** ausgeschlossen (deny)

> ⚠️ **Wie das zu lesen ist:** Ein *fremdes* Modell hat einen **kuratierten Ausschnitt**
> des Projekts gesehen — nicht das laufende Spiel und nicht das ganze Repository. Es kann
> daher weder Laufzeitverhalten prüfen noch `file:line`-Belege verifizieren. Befunde sind
> **Hypothesen**, die vor dem Umsetzen am Code/an den Daten gegenzuprüfen sind. Die
> kanonische Wahrheit bleibt [`docs/VISION_LOCK.md`](../VISION_LOCK.md) bzw. die Spieldaten.

## Gestellte Frage

Sieh dir die beigefügten Screenshots des laufenden Spiels an und mache einen UX/UI-Durchgang. Die Optik soll eine Behörden-/Papierwelt sein (Stil-Anker und Farbtoken liegen bei). Sag mir: Wo führt das Bild den Blick falsch, welche Grafiken sitzen an der falschen Stelle oder in der falschen Größe, wo stimmen Abstände und Ausrichtung nicht, und welche drei Änderungen bringen am meisten? Sei so konkret, dass man es direkt umsetzen kann.

## Dieser Durchgang: Bündel „panels-2von2" (7 Screenshots)

Das siehst du, in dieser Reihenfolge:
- panel_events.png — Seiten-Panel: Welt-Ereignisse
- hud_on.png — HUD eingeblendet (Sonntagsfrage · Abwehr · Kasse · Tag)
- encyclopedia.png — Nachschlagewerk/Enzyklopädie (Taste I)
- shortcuts.png — Tastenkürzel-Hilfe
- pause_menu.png — Pausenmenü (Sound-Mixer, Speichern, Beenden)
- action_feedback.png — Ergebnis einer ausgeführten Aktion (Feedback/Quittung, M1/M5)
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

### Gezeigtes Anschauungsmaterial (7 Screenshot(s))

| Art | Im Text genannt als | Datei | Größe |
|---|---|---|---:|
| 🖼 Bild | `panel_events.png` | `desinformation-network/runs/visual-review/latest/shots/panel_events.png` | 637 kB |
| 🖼 Bild | `hud_on.png` | `desinformation-network/runs/visual-review/latest/shots/hud_on.png` | 707 kB |
| 🖼 Bild | `encyclopedia.png` | `desinformation-network/runs/visual-review/latest/shots/encyclopedia.png` | 580 kB |
| 🖼 Bild | `shortcuts.png` | `desinformation-network/runs/visual-review/latest/shots/shortcuts.png` | 305 kB |
| 🖼 Bild | `pause_menu.png` | `desinformation-network/runs/visual-review/latest/shots/pause_menu.png` | 344 kB |
| 🖼 Bild | `action_feedback.png` | `desinformation-network/runs/visual-review/latest/shots/action_feedback.png` | 596 kB |
| 🖼 Bild | `decision_beat.png` | `desinformation-network/runs/visual-review/latest/shots/decision_beat.png` | 304 kB |

---

## Antwort des Modells

## 1. **Erster Eindruck**

### `panel_events.png`
Das Auge landet zuerst auf dem cyanfarbenen Monitor im Büro und anschließend auf „FEIERABEND“, nicht auf dem geöffneten Ereignis-Panel. Innerhalb des Panels konkurrieren der dunkle Kopfstreifen, die vertikale Tastenleiste und die winzige Illustration um Aufmerksamkeit, ohne einen klaren Schwerpunkt zu bilden. Zuerst gelesen werden sollte „Keine Weltereignisse“, weil das die unmittelbare Antwort auf das Öffnen des Panels ist. Stattdessen wirkt die Meldung wie eine kleine Notiz in einer sehr großen, leeren Papierfläche.

### `hud_on.png`
Der rote Rahmen von „PHASE BEENDEN“ zieht den Blick zuerst an, danach folgt „5/5“; die strategischen Kernwerte werden erst anschließend entschlüsselt. Vorrangig sollten Wahl-Countdown und Sonntagsfrage gelesen werden, danach Aktionen, Abwehr und Kasse, zuletzt die Abschlussaktion. Die Module wirken zwar wie eine Leiste, sitzen aber nicht auf einer gemeinsamen typografischen Grundlinie. Die separat darunter schwebende Uhrzeit zerlegt die HUD-Logik zusätzlich.

### `encyclopedia.png`
Zuerst fällt der breite Dossier-Titel auf, danach die Leiter roter Quadrate in der linken Navigation. Der eigentlich relevante Inhalt – die Überschrift des gewählten Eintrags rechts – hat zu wenig Vorrang gegenüber der langen Liste. Die Zweispaltenstruktur ist grundsätzlich verständlich, aber der ausgewählte Zustand ist fast nur über ein kleines rotes Quadrat erkennbar. Die große leere Fläche unter dem rechten Text verstärkt den Eindruck einer unfertigen Aktenseite.

### `shortcuts.png`
Das Auge findet den Titel schnell, springt danach aber zwischen der linken Tastenspalte und den weit rechts ausgerichteten Funktionsnamen hin und her. Eigentlich sollte jede Zeile als unmittelbares Paar „Taste → Funktion“ erfassbar sein. Weil die Funktionsnamen rechtsbündig gesetzt sind, beginnen sie an wechselnden Positionen und bilden keine gut scanbare Spalte. Das Modal wirkt eher wie eine rohe Tabelle als wie ein Behörden-Merkblatt.

### `pause_menu.png`
„FORTSETZEN“ ist eindeutig der erste Blickpunkt und damit korrekt priorisiert. Danach zieht der große Sound-Block Aufmerksamkeit auf sich, während „SPEICHERN“ und „BEENDEN“ visuell erstaunlich ähnlich beziehungsweise letzteres sogar deaktiviert wirken. Das Menü ist für die Bildschirmgröße zu schmal, besonders für die kleinteiligen Audioregler. Der hohe braune Kopfbereich verbraucht viel Fläche, obwohl „PAUSE“ darin relativ klein steht.

### `action_feedback.png`
Der Blick geht zuerst auf das Gebäude und dann auf die große, warme Publikums-Szene rechts unten. Das eigentliche Aktionsergebnis – „KLEINE WIRKUNG“ und „[KLEIN] Bot-Netzwerk gestartet“ – wirkt wie unauffälliger Log-Text. Bei einer Ergebnisquittung müsste genau diese Information zuerst erscheinen, anschließend die Zahlen und erst danach die Publikumsreaktion. Bildführung und funktionale Priorität laufen hier klar auseinander.

### `decision_beat.png`
Das rote Kopfband und „Der Stadtrat“ bilden den richtigen Einstieg, anschließend führt die stärkere Kontur unmittelbar zu Option A. Der Einführungstext und „IHRE ENTSCHEIDUNG“ sind noch nachvollziehbar gestaffelt, danach wird das Modal jedoch zu dicht. Die Wirkungswerte stehen je Option an unterschiedlichen Positionen und erzwingen horizontales Suchen. Option C wird vom unteren festen Streifen abgeschnitten; dadurch wirkt die Auswahl unvollständig und möglicherweise nicht vollständig bedienbar. Das Berater-Badge sitzt zudem im Titelbereich der dritten Option und wird wegen des Beschnitts leicht übersehen.

---

## 2. **Konkrete Eingriffe je Screen**

### `panel_events.png`

- Leermeldung „Keine Weltereignisse“ → als kompakten Dokumentblock mit etwa zwei Dritteln der nutzbaren Panelbreite im oberen Drittel platzieren; Überschrift etwa 1,4× größer, Unterzeile direkt darunter → der Panelzustand wird zur ersten statt zur dritten Information.
- Ereignis-Symbol über der Leermeldung → auf etwa 2–2,5× vergrößern und mit höchstens einer halben Überschriftenhöhe Abstand zum Text setzen → das derzeitige Symbol ist zu klein, um als Statusillustration zu funktionieren.
- Vertikale Tastenleiste links im Panel → Breite leicht reduzieren, alle Felder exakt gleich hoch setzen und den aktiven Eintrag durch gefülltes Kraftpapier plus helle Schrift markieren → die Buchstaben sind derzeit kryptisch und der aktive Zustand hängt fast nur an einer Kontur.
- Kopfzeile „WELT-EREIGNISSE / Phase 1“ → Titel an der linken Inhaltskante ausrichten und „Phase 1“ als kompaktes Badge mit gleichem Innenabstand rechts setzen → die beiden Informationen sitzen momentan zu weit auseinander und bilden keine gemeinsame Kopfgruppe.
- Große beige Restfläche → mit einer sehr dezenten Papierstruktur und einer klaren unteren Abschlusskante versehen, nicht mit weiteren Inhalten füllen → die Fläche soll ruhig bleiben, darf aber nicht wie eine untexturierte Web-Fläche wirken.

### `hud_on.png`

- HUD-Gruppen → in fünf klar abgegrenzte Module ordnen: Wahl/Tag, Aktionen, Sonntagsfrage, Abwehr/Kasse, Phase beenden; alle Werte auf eine gemeinsame Wert-Grundlinie setzen → die aktuelle Leiste wirkt trotz Trennern typografisch versetzt.
- „SONNTAGSFRAGE9.0 %“, „ABWEHR8“ und „KASSE150K“ → sichtbare Abstände zwischen Label und Wert einführen; Wert etwa 1,25× größer als das Label setzen → die Beschriftungen laufen derzeit optisch mit den Zahlen zusammen.
- Kassenwert „150K“ → von Rot auf primäre Tinte beziehungsweise Erfolgsfarbe umstellen; Rot nur bei negativem oder alarmierendem Zustand verwenden → der positive Kontostand sieht aktuell wie eine Warnung aus und widerspricht der Rot-Regel aus `desinformation-network/src/story-mode/theme.ts`.
- Balken unter Sonntagsfrage und Abwehr → auf dieselbe Breite und Höhe normieren, direkt unter dem jeweiligen Wert ausrichten und Marker nicht über benachbarte Trenner laufen lassen → die Balken wirken momentan wie unterschiedlich gebaute Widgets.
- Uhrzeit „13:00“ → aus dem separat darunter schwebenden Kasten in das linke Tag-/Wahl-Modul integrieren oder bündig an dessen rechte Kante setzen → Tageszeit und Tag gehören semantisch zusammen und sollten nicht in zwei Bildschirmzonen liegen.
- „PHASE BEENDEN“ → Breite um ungefähr ein Zehntel reduzieren und die rote Doppelkontur beibehalten, aber die Schrift nicht größer als den wichtigsten HUD-Wert setzen → die Aktion darf eindeutig sein, soll jedoch nicht sämtliche Lagewerte überstrahlen.

### `encyclopedia.png`

- Aktiver Listeneintrag links → gesamte Zeile mit einer leicht dunkleren Papierfläche und einem durchgehenden roten oder blauen Randstreifen markieren → ein einzelnes rotes Quadrat reicht zwischen den vielen identischen Markern nicht als Auswahlzustand.
- Inaktive rote Quadrate → auf Tintenbraun oder Oliv umstellen; Rot nur für aktiv, neu oder besonders kritisch verwenden → die rote Punktleiter zieht derzeit mehr Aufmerksamkeit als der Inhalt.
- Rechte Inhaltsseite → horizontalen Innenabstand um etwa ein Drittel erhöhen und die Textzeilen auf eine etwas schmalere Lesebreite begrenzen → die Absätze sitzen zu nah an Trennlinie und Außenkante.
- Abschnittslabels „WAS ES IST“, „REALER FALL“, „GEGENMASSNAHME“ → etwa 1,15× größer und mit mehr Abstand zum folgenden Absatz setzen → sie verschwinden momentan zwischen Überschrift und Fließtext.
- Untere Bildungs-Kern-Zeile → in einen eigenen, klar abgetrennten Fußstreifen mit etwa doppelter aktueller Höhe setzen und links statt mittig ausrichten → die wichtige Meta-Aussage klebt derzeit klein an der Unterkante.
- Rechter Leerraum unter dem Text → nicht künstlich mit Dekoration füllen, aber die Inhaltsseite durch eine feine Aktenlinie oder Seitenkante abschließen → so liest sich die Leere als freie Dokumentfläche statt als fehlender Inhalt.

### `shortcuts.png`

- Funktionsspalte → sämtliche Funktionsnamen linksbündig an einer gemeinsamen Kante beginnen lassen, ungefähr nach dem ersten Drittel der Modalbreite → die derzeitige Rechtsbündigkeit erzeugt eine unruhige, schlecht scanbare Startkante.
- Tastenkürzel links → als gleich breite, umrandete Keycaps darstellen; kurze Tasten innerhalb der Keycaps zentrieren → „A“, „I“, „Esc“ und „Leertaste“ erhalten damit dieselbe visuelle Funktion und sind schneller unterscheidbar.
- Zeilen → in drei Gruppen gliedern: Ansichten, Bedienung, System; zwischen Gruppen etwa eine halbe Zeilenhöhe zusätzlichen Abstand setzen → die durchgehende Liste bietet aktuell keine Gedächtnisstruktur.
- Modalbreite → um ungefähr ein Fünftel erhöhen, ohne die Höhe zu vergrößern → dadurch können Keycaps, linksbündige Bezeichnungen und Gruppenabstände sauber untergebracht werden.
- Schließen-Affordanz → einen kleinen Schließen-Knopf oben rechts mit denselben Außenabständen wie bei `encyclopedia.png` ergänzen; den Fußhinweis als sekundäre Alternative behalten → „Klick oder Esc“ ist kein sichtbares Ziel und inkonsistent zum anderen Modal.

### `pause_menu.png`

- Gesamtpanel → auf etwa ein Drittel der Bildschirmbreite verbreitern und die innere Spalte entsprechend mitwachsen lassen → die Slider und ihre Labels sind in der aktuellen schmalen Karte unnötig gedrängt.
- Brauner Kopfbereich → Höhe um ungefähr ein Viertel reduzieren und „PAUSE“ vertikal mittig setzen → der Kopf verbraucht mehr Raum, als seine Informationsmenge rechtfertigt.
- Sound-Regler → jede Reglerzeile etwa 1,25× höher machen, Schiebergriffe vergrößern und alle Regler an derselben linken und rechten Kante ausrichten → die aktuellen Bedienelemente sind visuell und wahrscheinlich auch motorisch zu klein.
- Master-Sound-Zeile → „SOUND“, Hauptregler und „AN“ auf eine klare gemeinsame Achse setzen; die winzigen Rand-Symbole entweder vergrößern oder entfernen → die Symbole sind derzeit nicht sicher identifizierbar.
- „BEENDEN“ → statt der graubeigen, deaktiviert wirkenden Fläche eine normale Papierfläche mit roter Tintenbeschriftung und einfacher Warnkontur verwenden → die destructive Aktion muss erkennbar, aber nicht dominant sein.
- Version → mit mehr Abstand unter „BEENDEN“ platzieren und sichtbar als Metadatum behandeln, etwa durch kleinere Tinte ohne Sperrwirkung → aktuell klebt sie zwischen Button und Panelkante.

### `action_feedback.png`

- Ergebnisbereich „KLEINE WIRKUNG“ → als helle Papierquittung innerhalb des dunklen unteren Bereichs platzieren, beginnend rechts neben dem Fernseher und endend vor der Publikums-Szene → die Rückmeldung braucht eine eigene kontrastierende Trägerfläche.
- Wirkungsstempel → „KLEINE WIRKUNG“ etwa 1,5× größer machen und an die obere rechte Ecke der Quittung setzen → der jetzige graue Mini-Tag ist weder Stempel noch klare Ergebnisüberschrift.
- Ergebniszeile „[KLEIN] Bot-Netzwerk gestartet“ → direkt unter den Kennzahlen platzieren, Schrift vergrößern und das führende Statuszeichen farblich von der Beschreibung trennen → die zentrale Handlungsmeldung sieht momentan wie ein nebensächlicher Logeintrag aus.
- Kennzahlen „QUOTE 22 % / REICHWEITE 22 % / KANAL NETZWERKE“ → in drei gleich breite Spalten mit identischen Label- und Wertgrundlinien setzen → die Angaben sind aktuell klein, eng und nicht als Ergebnisgruppe erkennbar.
- Fernseher links → um ungefähr ein Zehntel verkleinern und vertikal an der Quittung ausrichten → das grobe Gerät beansprucht mehr visuelles Gewicht als das Aktionsergebnis.
- Publikums-Sprechblase → oberhalb der Köpfe in einen durchgehend dunklen, ausreichend breiten Textträger setzen und mit gleichmäßigem Innenabstand versehen → der Satz liegt momentan unruhig über Figuren und Möbeln und ist nur mit zweitem Blick lesbar.

### `decision_beat.png`

- Gesamtmodal → Breite um etwa 15–20 % erhöhen und oben sowie unten einen sichtbaren Bildschirmrand stehen lassen → die zusätzlichen Zeilenumbrüche machen die Karten unnötig hoch und verursachen den Beschnitt.
- Inhaltsbereich zwischen Kopf und Fuß → als eigenständig scrollbaren Bereich ausführen; sichtbare Scrollspur oder unteren Anschnitt als Fortsetzungszeichen zeigen → Option C verschwindet derzeit hinter dem festen Fußstreifen.
- Rotes Kopfband → Höhe um ungefähr ein Fünftel reduzieren, Titel und Unterzeile näher zusammenziehen → der Kopf ist überproportional hoch gegenüber den Entscheidungskarten.
- Optionskarten → Titel links auf etwa drei Vierteln der Breite halten und rechts eine feste Wirkungs-Spalte für Risiko/Aufmerksamkeit reservieren → bei A, B und C springen die Zahlen derzeit an unterschiedliche Stellen.
- Kartenabstände → Innenabstand leicht erhöhen, den Außenabstand zwischen Karten dagegen etwas reduzieren → innerhalb der Karten ist es eng, während die dunklen Doppelrahmen zwischen ihnen zu viel visuelles Gewicht erzeugen.
- Berater-Badge „BERATER RÄT“ → als kleines seitliches Aktenfähnchen an der linken oberen Kartenkante von Option C setzen, nicht mitten in den Titel → so bleibt die Empfehlung eindeutig mit der Option verbunden, ohne den Titel zu unterbrechen.

---

## 3. **Grafiken/Assets**

- `panel_events.png` → Büro, Fenster und cyanfarbener Monitor tragen die Welt glaubwürdig, sind aber deutlich detailreicher und kontrastreicher als das Ereignis-Panel. Das kleine Ereignis-Symbol ist zu dunkel, zu kleinteilig und in seinem Motiv nicht sicher lesbar; hier fehlt vor allem ein klarer, scharf konturierter Leerstands-Stempel oder ein größeres Ereignis-Piktogramm.
- `hud_on.png` → die kleinen Symbole für Sonntagsfrage, Abwehr und Kasse sind stilistisch uneinheitlich und bei dieser Größe kaum unterscheidbar. Sie sollten dieselbe optische Boxgröße, Kantenschärfe und Detailstufe erhalten; aktuell wirken einige wie Mini-Sprites, andere wie Textornamente.
- `encyclopedia.png` → das Modal benötigt keine Illustration, aber seine Flächen sind zu homogen. Gemäß der Papierabsicht aus `desinformation-network/src/story-mode/theme.ts` fehlt eine sehr zurückhaltende Materialdifferenz zwischen Aktenumschlag, Navigationsblatt und Inhaltsseite; derzeit sind es hauptsächlich beige Rechtecke.
- `shortcuts.png` → hier fehlt kein dekoratives Bild, sondern ein funktionales Asset-System für Keycaps. Gleichartige kleine Tastenrahmen würden mehr beitragen als eine Illustration und die Behörden-Merkblatt-Idee stärken.
- `pause_menu.png` → die winzigen Lautsprecher-Symbole sind zu klein und kantig, um ihren Zustand sicher zu vermitteln. Ein einheitliches Set aus scharfem Lautsprecher-, Stumm- und Pegel-Symbol in derselben Strichstärke wie die Slider würde den Mixer deutlich verbessern.
- `action_feedback.png` → Gebäude und Publikumszimmer sind starke, scharfe Pixel-Art-Szenen; besonders das warme Zimmer zieht aber mehr als die Ergebnisdaten. Der braune Röhrenfernseher ist deutlich gröber und stärker 70er-codiert als die Vorgabe „fein und scharf, nicht 70er-braun“ in `sprite-tool/public/context/game-style-guide.md`; entweder feiner neu zeichnen oder kleiner und sekundärer einsetzen.
- `decision_beat.png` → es gibt kein eigentliches Bildasset, daher müssen Rahmen, Stempel und Badge die Materialwelt tragen. Das Berater-Badge wirkt momentan wie ein kleiner Web-Button; ein seitliches Aktenfähnchen oder ein schräger Tintenstempel würde stilistisch besser passen und weniger Textfläche verbrauchen.

---

## 4. **Raster & Rhythmus**

- `panel_events.png` → das Panel belegt gut ein Drittel des Bildes, nutzt aber nur einen kleinen Bereich nahe der oberen Mitte. Die vertikale Tastenleiste erzeugt eine zusätzliche schmale Spalte, ohne dass Titel, Leermeldung und Navigation dieselbe Inhaltskante teilen.
- `hud_on.png` → die vertikalen Trenner suggerieren ein Raster, aber die Inhalte sind unterschiedlich breit, unterschiedlich hoch und typografisch nicht auf einer Linie. Besonders links stehen „TAG 1“, „WAHL IN 39 T.“ und „AKTIONEN HEUTE 5/5“ in konkurrierenden Ebenen.
- `encyclopedia.png` → die Teilung von ungefähr einem Drittel Navigation zu zwei Dritteln Inhalt funktioniert. Unruhig wird sie durch die vielen gleich starken horizontalen Linien links und den fast vollständig fehlenden Rhythmus rechts; dort brauchen Abschnittslabels und Absätze konsistentere vertikale Abstände.
- `shortcuts.png` → die Modalhöhe ist fast vollständig gefüllt, während horizontal zwischen Taste und Funktion viel tote Fläche liegt. Eine breitere, linksbündige Zweispaltenstruktur würde die Fläche besser verteilen und die Liste gleichzeitig weniger hoch wirken lassen.
- `pause_menu.png` → Außenränder und Buttonbreiten sind konsistent, der Soundblock bricht den Rhythmus aber durch sehr viele kleine Binnenlinien. Weniger, größere Reglerzeilen würden besser zu den großen Aktionsflächen darüber und darunter passen.
- `action_feedback.png` → der untere Bereich ist in Fernseher, Textzone und Publikumsbild geteilt, aber die Textzone besitzt keinen eigenen sichtbaren Rahmen. Dadurch lesen sich Fernseher und Publikum als zwei starke Bildblöcke, während die funktionale Mitte optisch auseinanderfällt.
- `decision_beat.png` → das Modal hat ein brauchbares einspaltiges Grundraster, verliert es aber in den Karten durch frei platzierte Wirkungswerte, unterschiedliche Titelumbrüche und den eingeschobenen Beraterhinweis. Der feste Fußstreifen bildet außerdem keine saubere Grenze, sondern überdeckt sichtbar den Inhalt.

---

## 5. **Lesbarkeit**

- `panel_events.png` → bei „Phase 1“ und dem kleinen Symbol musste ich zweimal hinsehen; beide sind für ihre Randlage zu klein. Auch der aktive Zustand in der vertikalen Tastenleiste ist nicht eindeutig genug.
- `hud_on.png` → „SONNTAGSFRAGE9.0 %“, „ABWEHR8“ und „KASSE150K“ mussten wegen fehlender Wortabstände erneut gelesen werden. Die sehr kleinen Icons helfen nicht bei der Erkennung, und der rote Kassenwert suggeriert fälschlich einen Alarmzustand.
- `encyclopedia.png` → die Fußzeile „Bildungs-Kern …“ ist zu klein und zu nah an der unteren Kante. Die Abschnittslabels rechts und die Auswahlmarkierung links benötigen ebenfalls einen zweiten Blick; aktiv, kritisch und normal verwenden fast dieselbe rote Markierung.
- `shortcuts.png` → die Funktionsnamen sind einzeln lesbar, aber durch ihre wechselnden Startpunkte schlecht überfliegbar. In der Pixelschrift liegen außerdem „I“ und „1“ gefährlich nah beieinander, was beim Methoden-Dossier besonders relevant ist.
- `pause_menu.png` → „MUSIK“, „EFFEKTE“ und „STIMMEN“ sowie die kleinen Endsymbole der Hauptlautstärke sind zu klein. Die Slidergriffe sind erkennbar, aber ihre genaue Position und die Bedeutung der Randmarkierungen nicht sofort.
- `action_feedback.png` → „KLEINE WIRKUNG“, die Kennzahlen und die Ergebniszeile sind gegenüber der Bildwelt zu klein und kontrastarm. Den Publikumssatz über den Figuren musste ich ebenfalls zweimal lesen, weil Textträger, Köpfe und helle Einrichtung miteinander konkurrieren.
- `decision_beat.png` → die roten Wirkungswerte sind klein, unterschiedlich umbrochen und nicht sauber spaltenweise vergleichbar. Bei Option B muss man Titel und Werte getrennt zusammensuchen; Option C ist wegen des Beschnitts gar nicht vollständig lesbar. Ein aktiver, fokussierter oder bereits gewählter Zustand ist im Standbild ebenfalls nicht eindeutig erkennbar.

---

## 6. **Die drei wirksamsten Änderungen**

1. **`action_feedback.png`: Ergebnis als helle Papierquittung mit großem Wirkungsstempel, Kennzahlenspalten und klarer Ergebniszeile auszeichnen** — geringer Layoutaufwand, aber die wichtigste Rückmeldung des Screens wird endlich vor Gebäude und Publikumsbild wahrgenommen.
2. **`decision_beat.png`: Modal verbreitern und den Kartenbereich zwischen festem Kopf und Fuß scrollbar machen** — verhindert abgeschnittene Optionen und behebt damit gleichzeitig Lesbarkeit, Vergleichbarkeit und potenzielle Bedienblockaden.
3. **`hud_on.png`: alle HUD-Werte auf ein gemeinsames Modulraster setzen, Uhrzeit integrieren und Rot semantisch bereinigen** — verbessert bei jedem Spielmoment die Orientierung und erfordert hauptsächlich Typografie-, Abstands- und Farbanpassungen.

---

## 7. **Blinde Flecken**

- `panel_events.png` → sichtbar ist nur der Leerzustand. Für die Beurteilung von Informationsdichte, Scrollverhalten, neuen Ereignissen und aktivem Eintrag wird ein gefülltes Panel sowie je ein Hover-/Auswahlzustand benötigt.
- `hud_on.png` → nicht erkennbar sind Zustände bei null Aktionen, negativer Kasse, hoher Abwehr, Warnungen oder sehr langen Zahlen. Zusätzlich fehlt eine Aufnahme bei kleinerer Breite, um zu sehen, ob die Module umbrechen oder kollidieren.
- `encyclopedia.png` → unklar bleiben Tastaturfokus, Scrollposition, Einträge mit deutlich längerem Inhalt sowie die Darstellung von „neu“ oder bereits gelesen. Dafür werden Fokus-, Scroll- und Langtextaufnahmen benötigt.
- `shortcuts.png` → nicht sichtbar sind Hover, Tastaturfokus und die genaue Klickfläche zum Schließen. Eine Aufnahme bei kleiner Fensterhöhe würde zeigen, ob die lange Liste abgeschnitten wird.
- `pause_menu.png` → nicht erkennbar sind Regler-Hover, Drag-Zustand, „Sound aus“, Speicherbestätigung und eine mögliche Beenden-Rückfrage. Diese Zustände sind für Kontrast und Feedback entscheidend.
- `action_feedback.png` → aus dem Standbild geht nicht hervor, ob Wirkungsstempel, Zahlen oder Publikumsreaktion animiert beziehungsweise zeitversetzt erscheinen. Benötigt werden Anfang, Spitzenmoment und Endzustand der Rückmeldung sowie ein Beispiel mit stärkerer oder negativer Wirkung.
- `decision_beat.png` → die vollständige dritte Option, mögliche weitere Optionen, Scrollindikator, Hover, Tastaturfokus, Auswahl und Bestätigung sind nicht sichtbar. Zusätzlich braucht es eine Aufnahme bei kleinerer Auflösung, weil der aktuelle Beschnitt bereits bei 1280 × 720 auftritt.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
