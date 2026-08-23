# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „broadcast"

**Modell:** `gpt-5.6-sol` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-22
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-22T17:09:26.285Z · **Dauer:** 85.3 s
**Nutzung:** nicht gemeldet · **Kosten:** unbekannt · **Anbieter-Datensammlung:** ausgeschlossen (deny)

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
| 🖼 Bild | `broadcast_expanded.png` | `desinformation-network/runs/visual-review/latest/shots/broadcast_expanded.png` | 837 kB |

---

## Antwort des Modells

## 1. **Erster Eindruck**

### `broadcast_expanded.png`
Das Auge landet zuerst auf dem stark leuchtenden, schrägen Cyan-Monitor links oben, danach auf dem rot-cyanfarbenen Plakat rechts. Für einen ausgeklappten Broadcast müsste dagegen die laufende Sendung beziehungsweise das Publikum die primäre Blickstation sein; beides ist im sichtbaren Bereich nicht erkennbar. Der schmale beige Streifen rechts und der am unteren Rand abgeschnittene „PUBLIKUM“-Knopf deuten darauf hin, dass der eigentliche Inhalt außerhalb des Viewports liegt oder von einer Ebene verdeckt wird. Anschließend zieht der vollflächig rote „FEIERABEND“-Knopf unverhältnismäßig viel Aufmerksamkeit auf eine Tagesabschluss-Aktion. Dadurch liest sich der Screen weiterhin als Büroansicht mit HUD, nicht als ausgeklappte Broadcast-Ansicht.

## 2. **Konkrete Eingriffe je Screen**

### `broadcast_expanded.png`
- **Ausgeklappter Broadcast-Bereich → vollständig innerhalb des Viewports anordnen und ihm rechts etwa ein Drittel bis zwei Fünftel der Breite reservieren; die Büroansicht entsprechend auf den linken Rest beschneiden oder skalieren → derzeit sind weder Sendung noch Publikums-Wohnzimmer sichtbar, obwohl sie der Zweck dieses Zustands sind.**
- **„PUBLIKUM“-Knopf unten rechts → aus der abgeschnittenen Randlage lösen, vollständig in das Broadcast-Panel setzen und an dessen linker und rechter Innenkante mit mindestens einer normalen Bedienelement-Breite Abstand ausrichten → aktuell wirkt er wie ein horizontal überlaufendes Element und ist kaum als Steuerung nutzbar.**
- **Cyan-Monitor links oben → visuell um ungefähr ein Viertel verkleinern und Leuchtkraft sowie Cyan-Sättigung deutlich reduzieren; Oberkante näher an die des Korkbretts führen → er ist momentan das stärkste Signal im gesamten Bild, obwohl er nur Teil der Bürokulisse ist.**
- **„FEIERABEND“-Knopf → Breite um etwa ein Fünftel reduzieren, vom rechten Rand um denselben Innenabstand wie die übrigen HUD-Elemente abrücken und als Papier-Stempel statt als vollrote Fläche ausführen → die sekundäre Tagesabschluss-Aktion konkurriert derzeit mit dem Broadcast-Hauptinhalt.**
- **Unterer Sendungsstreifen → Status, Sender und Meldung zu einem klaren Block zusammenziehen, dessen Text etwa 1,25–1,4-mal so groß ist; links an der Mitarbeiterkarte ausrichten und rechts vor dem Broadcast-Panel enden lassen → die drei Informationsarten zerfallen momentan in winzige Textsplitter über fast die gesamte Breite.**
- **Rechte Tastenleiste und obere HUD-Gruppe → entweder im ausgeklappten Zustand hinter dem Broadcast-Panel ausblenden oder als durchgehende, gleich breite Werkzeugspalte ausbilden; Uhr, Menü und HUD an gemeinsamer Oberkante und gemeinsamer rechter Bezugskante ausrichten → die schmale beige Restfläche und die isolierten Buchstabentasten erzeugen derzeit den Eindruck eines Layoutfehlers.**

## 3. **Grafiken/Assets**

### `broadcast_expanded.png`
Die Büro-Hintergrundgrafik trägt grundsätzlich: Beton, Glas, Skyline, Tisch und Stuhl bilden eine zusammenhängende, scharf gepixelte Szene. Auch die Material- und Lichtführung ist konsistent genug, um als Weltgrafik zu funktionieren. Problematisch ist nicht die Auflösung, sondern die visuelle Gewichtung einzelner Assets.

Der schräge Cyan-Monitor ist zu groß, zu hell und zu gesättigt. Seine schwarze Kontur und die helle Leuchtfläche machen ihn fast zu einem Logo; er hebt sich stärker ab als sämtliche Bedienoberflächen. Das Korkbrett darunter ist dagegen klein und detailreich, sodass seine Karten und Verbindungslinien bei dieser Darstellungsgröße eher als Texturrauschen erscheinen.

Das konstruktivistische Plakat rechts ist stilistisch zulässig, wirkt aber durch die großen, reinen Cyan- und Rotflächen glatter und plakativ-vektorieller als die übrige Pixelwelt. Sättigung und Kontrast sollten um etwa ein Fünftel sinken; alternativ kann eine leichte Papierkörnung beziehungsweise Wandalterung darübergelegt werden. Seine Größe ist für die freie Betonwand plausibel, aber im aktuellen Bildaufbau bildet es zusammen mit dem Cyan-Monitor eine starke diagonale Konkurrenzachse über den eigentlichen Broadcast hinweg.

Die Oberfläche selbst verfehlt teilweise die verbindliche Papierwelt aus `desinformation-network/src/story-mode/theme.ts`: Der fast schwarze untere Balken mit leuchtend roter Trennlinie liest sich als digitales HUD, nicht als Behördenakte. Auch der vollrote „FEIERABEND“-Knopf widerspricht der dort formulierten Vorgabe, Ministeriums-Rot nur für Stempel, Kopfbänder und Alarm einzusetzen. Eine dunkle Kraftpapier-Trägerfläche mit aufgelegtem hellem Meldungszettel und rotem Stempel würde Absicht und sichtbares Ergebnis wieder zusammenführen.

Am meisten fehlt die namensgebende Broadcast-Grafik: Im sichtbaren Bereich gibt es weder eine Sendungsdarstellung noch die angekündigten Publikums-Wohnzimmer beziehungsweise Milieus. Das ist kein Detailproblem, sondern die zentrale visuelle Leerstelle von `broadcast_expanded.png`.

## 4. **Raster & Rhythmus**

### `broadcast_expanded.png`
Die horizontale Aufteilung ist faktisch etwa „fast vollständige Büroansicht plus sehr schmaler rechter Reststreifen“. Für einen ausgeklappten Informationszustand ist dieses Verhältnis falsch: Das zusätzliche Panel erhält keinen nutzbaren Raum. Sinnvoll wäre ein klares Zweispaltenraster mit ungefähr 60–65 % Weltansicht links und 35–40 % Broadcast-Akte rechts.

Die obere rechte HUD-Gruppe hat keine durchgehende Ordnung. Uhr, Menü und HUD-Kürzel besitzen ähnliche Höhen, stehen aber mit unterschiedlichen Zwischenräumen und ohne gemeinsame Blockkante nebeneinander. Alle drei sollten in einer Zeile mit identischer Höhe, einem einheitlichen kleinen Zwischenraum und derselben rechten Kante wie das Panel darunter sitzen.

Unten entstehen drei konkurrierende horizontale Ebenen: Mitarbeiterkarte, breite dunkle Leiste mit „FEIERABEND“ und darunter der sehr flache Statusstreifen. Die Inhalte gehören funktional zusammen, folgen aber weder gemeinsamen linken Kanten noch einem konsistenten Höhenrhythmus. Die Mitarbeiterkarte beginnt weiter innen als der Status, während „FEIERABEND“ hart an die rechte Begrenzung gedrückt ist.

Die rechte Tastenleiste erzeugt viel tote beige Fläche bei sehr geringer Informationsdichte. Die fünf kleinen Tasten schweben im oberen Abschnitt, während der Großteil der Spalte leer bleibt. Im ausgeklappten Zustand sollte diese Fläche dem Broadcast gehören; bleibt die Leiste sichtbar, benötigt sie eine erkennbare Gruppierung und deutlich mehr Breite.

Die freie Bodenfläche in der unteren Bildmitte ist als Bühnentiefe der Raumgrafik schlüssig, wird im Broadcast-Zustand aber zur unproduktiven Fläche. Das spricht zusätzlich dafür, die Weltansicht zu beschneiden statt das Panel außerhalb des Bildes anzuhängen.

## 5. **Lesbarkeit**

### `broadcast_expanded.png`
Zweimal hinsehen musste ich bei der Meldung „Noch keine Maßnahme ausgespielt …“: Die Pixelschrift ist für die Textlänge zu klein, die Laufweite eng und der Kontrast auf dem dunklen Streifen zwar nominell vorhanden, praktisch aber durch die feinen Zeichen schwach. Der Satz sollte entweder größer und zweizeilig auf einem hellen Papierfeld stehen oder deutlich gekürzt werden.

Auch „STANDBY“ und „MINISTERIUM SENDET“ sind zu klein, um als Zustandsanzeige schnell erfasst zu werden. Zudem wird der Zustand vor allem über Grün vermittelt; ein zusätzliches Wort- oder Formsignal sollte erhalten bleiben, falls Farbe nicht sicher unterschieden wird.

Der „PUBLIKUM“-Knopf ist rechts abgeschnitten. Dadurch musste ich erst rekonstruieren, ob es sich um einen Tab, einen Button oder eine Überschrift handelt. Ein interaktives Element darf in keinem Zustand unter einer Seitenfläche verschwinden.

Bei den rechten Tasten ist nicht erkennbar, wofür „K / M / A / K / I“ stehen. Das amberfarbene „A“ könnte aktiv, fokussiert oder nur anders kategorisiert sein; die bloße Änderung der Randfarbe reicht als Zustand nicht. Aktiv sollte zusätzlich durch gefüllten Hintergrund, seitlichen Marker oder herausstehende Lasche angezeigt werden.

Die gelben Eckmarkierungen an Monitor, Korkbrett und Schreibtisch sind auf hellen Beton- und Tischflächen teilweise zu schwach. Außerdem ist nicht eindeutig, ob sie dauerhaft interaktiv, aktuell fokussiert oder neu sind. Diese Zustände brauchen unterschiedliche Formen statt lediglich ähnlich farbiger Ecken.

„FEIERABEND“ ist dagegen sehr gut lesbar, erhält aber gerade dadurch eine zu hohe Hierarchiestufe. Die Lesbarkeit ist hier nicht das Problem, sondern die Dominanz.

## 6. **Die drei wirksamsten Änderungen**

1. **`broadcast_expanded.png`: Den ausgeklappten Broadcast vollständig in ein sichtbares rechtes Panel von etwa 35–40 % Bildschirmbreite holen.** Das behebt mit einer Layoutkorrektur den zentralen Funktions- und Hierarchiefehler des gesamten Screens.
2. **`broadcast_expanded.png`: Cyan-Monitor abdunkeln/verkleinern und „FEIERABEND“ vom roten Vollflächen-CTA zum kleineren Papier-Stempel zurückstufen.** Zwei vergleichsweise kleine Stiländerungen verlagern den Blick sofort von Kulisse und Tagesende zurück auf den Broadcast.
3. **`broadcast_expanded.png`: Die beiden unteren HUD-Zeilen zu einer lesbaren Papierleiste mit größerem Text, klaren Gruppen und vollständig sichtbarem „PUBLIKUM“-Element zusammenführen.** Das verbessert Informationsaufnahme, Behördenästhetik und räumliche Ordnung gleichzeitig.

## 7. **Blinde Flecken**

### `broadcast_expanded.png`
Nicht erkennbar ist, ob das fehlende Broadcast-Panel nur im Screenshot außerhalb des Viewports liegt, während einer Animation hereinfährt oder durch einen Z-Index-/Overflow-Fehler verdeckt wird. Dafür wäre eine Aufnahme unmittelbar nach Abschluss der Aufklappanimation nötig, weiterhin in derselben Auflösung.

Nicht beurteilen lassen sich Hover-, Fokus- und Tastaturzustände der rechten Buchstabentasten, der Hotspot-Ecken und des „PUBLIKUM“-Elements. Benötigt würden Zustandsaufnahmen mit jeweils einem fokussierten und einem aktivierten Element.

Ebenso fehlt ein befüllter Broadcast-Zustand: Die Aufnahme zeigt laut Text noch keine ausgespielte Maßnahme. Für die Beurteilung von Sendung, Milieu-Karten, Textmengen und Reaktionsanzeigen wäre ein Screenshot dieses Screens mit aktiver Sendung und sichtbarem Publikum erforderlich.

Unklar bleibt außerdem das Verhalten bei kleineren Viewports beziehungsweise UI-Skalierung. Gerade der abgeschnittene rechte Bereich sollte mindestens in der Zielauflösung und einer kleineren unterstützten Auflösung geprüft werden.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
