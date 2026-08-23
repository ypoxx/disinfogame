# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung

**Modell:** `gpt-5.6-sol` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-22
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-22T17:45:01.870Z · **Dauer:** 175.4 s
**Nutzung:** nicht gemeldet · **Kosten:** unbekannt · **Anbieter-Datensammlung:** ausgeschlossen (deny)

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

### Gezeigtes Anschauungsmaterial (12 Screenshot(s))

| Art | Im Text genannt als | Datei | Größe |
|---|---|---|---:|
| 🖼 Bild | `clip_ambient_etage4__f1.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_etage4__f1.png` | 1088 kB |
| 🖼 Bild | `clip_ambient_etage4__f2.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_etage4__f2.png` | 1053 kB |
| 🖼 Bild | `clip_ambient_etage4__f3.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_etage4__f3.png` | 1028 kB |
| 🖼 Bild | `clip_ambient_etage4__f4.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_etage4__f4.png` | 645 kB |
| 🖼 Bild | `clip_ambient_keller__f1.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_keller__f1.png` | 982 kB |
| 🖼 Bild | `clip_ambient_keller__f2.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_keller__f2.png` | 972 kB |
| 🖼 Bild | `clip_ambient_keller__f3.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_keller__f3.png` | 990 kB |
| 🖼 Bild | `clip_ambient_keller__f4.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_ambient_keller__f4.png` | 1031 kB |
| 🖼 Bild | `clip_avatar_walk__f1.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_avatar_walk__f1.png` | 1011 kB |
| 🖼 Bild | `clip_avatar_walk__f2.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_avatar_walk__f2.png` | 1076 kB |
| 🖼 Bild | `clip_avatar_walk__f3.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_avatar_walk__f3.png` | 978 kB |
| 🖼 Bild | `clip_avatar_walk__f4.png` | `desinformation-network/runs/visual-review/latest/frames/animation/clip_avatar_walk__f4.png` | 1019 kB |

---

## Antwort des Modells

## 1. **Erster Eindruck**

**`clip_ambient_etage4__f1.png`**  
Als Erstes zieht die helle Uhr oben rechts den Blick an, danach erst die verteilten Figuren im Gebäude. Der Blick sollte zuerst auf Etage 4 beziehungsweise die dortige Aktivität gehen, doch weder Größe noch Kontrast unterscheiden die bewegte Figur klar von den stationären NPCs. Die Figur links auf Etage 4 wirkt etwas kleiner als Marina rechts und steht ohne sichtbaren Kontaktschatten knapp über der Bodenkante. Gegenstände und Architektur bleiben plausibel, aber die vielen gleich starken Raum- und Bereichsschilder zerlegen die Blickführung.

**`clip_ambient_etage4__f2.png`**  
Auch hier dominiert zunächst die Uhr, während die neu sichtbaren Figuren auf Etage 4 und Etage 2 erst gesucht werden müssen. Die Person im geöffneten linken Raum auf Etage 4 ist sauber von der Tür gerahmt, wirkt gegenüber Marina jedoch deutlich kleiner. Die Figur auf Etage 2 steht annähernd auf derselben Bodenlinie wie die Möbel, schwebt wegen des fehlenden Schattens aber leicht. Gegenüber `clip_ambient_etage4__f1.png` hat sich die Statistenverteilung stark verändert; ohne erkennbare Identitäten ist nicht feststellbar, ob Figuren plausibel gegangen oder lediglich neu eingesetzt worden sind.

**`clip_ambient_etage4__f3.png`**  
Das Auge landet erneut zuerst auf Uhr und heller Seitenleiste, nicht auf der einzelnen gehenden Figur auf Etage 3. Diese Figur steht nahe der rechten Tür und ist grundsätzlich korrekt auf der horizontalen Bodenebene verankert. Ihr Maßstab entspricht den anderen Lauf-Sprites, bleibt aber kleiner als der stationäre NPC auf Etage 4 und die Figuren vor der Zentrale. Zwischen `clip_ambient_etage4__f2.png` und diesem Bild sind mehrere Personen verschwunden beziehungsweise auf anderen Etagen sichtbar, ohne dass die Standbilder einen Übergang belegen.

**`clip_ambient_etage4__f4.png`**  
Hier fällt zuerst die deutlich weichere, verwaschene Gesamtdarstellung gegenüber `clip_ambient_etage4__f1.png` bis `__f3.png` auf. Danach zieht die Figur auf Etage 2 am Aktenschrank den Blick an, weil Körper und Möbel räumlich ineinanderlaufen. Die Figuren auf Etage 3 und 4 halten ungefähr dieselben Lauf-Sprite-Proportionen, doch die weichere Skalierung erschwert die Kontrolle ihrer Fußpunkte. Die Verteilung wirkt plötzlich sehr belebt, während `clip_ambient_etage4__f3.png` fast leer war; ob das ein echter Pop-in ist, lässt sich ohne Zwischenframes nicht entscheiden.

**`clip_ambient_keller__f1.png`**  
Das gelbe Auswahlfeld „Finanzen / Tresor · Igor“ ist der eindeutige erste Blickfang und erfüllt damit seine Priorität. Innerhalb des Feldes überlagern sich zwei Figuren jedoch so stark, dass Beine, Besitz der Silhouetten und genaue Bodenberührung kaum trennbar sind. Der kleinere linke Charakter wirkt gegenüber Igor und den stationären NPCs der oberen Etagen untermaßstäblich. Der Kellerboden ist horizontal und stabil, aber ohne Fußschatten bleibt offen, ob beide Figuren auf ihm stehen oder wenige Bildpunkte davor schweben.

**`clip_ambient_keller__f2.png`**  
Der Blick geht direkt zum gelben Keller-Hotspot, in dem jetzt nur noch Igor klar sichtbar ist. Igor steht mittig und plausibel auf derselben Basislinie wie zuvor, wobei das Auswahlrechteck etwas tiefer als seine Füße endet. Gegenüber `clip_ambient_keller__f1.png` ist die zweite Figur vollständig verschwunden; ein Ausgang oder eine zwischenzeitliche Bewegung ist im Einzelbild nicht nachweisbar. Gleichzeitig erscheint auf Etage 2 ein Lauf-Sprite, dessen geringere Körperhöhe den Maßstabsunterschied zu Igor erneut sichtbar macht.

**`clip_ambient_keller__f3.png`**  
Zuerst fällt wieder das gelbe Kellerfeld auf, danach die nun rechts neben Igor stehende zweite Figur. Die beiden Körper sind jetzt räumlich besser getrennt und ihre Füße liegen nahezu auf derselben horizontalen Ebene. Der rechte Charakter ist merklich kleiner als Igor, obwohl beide ohne erkennbare Tiefenstaffelung nebeneinander stehen. Ob er aus der Überlagerung in `clip_ambient_keller__f1.png` dorthin gelaufen ist oder neu eingeblendet wurde, kann anhand der vier Endbilder nicht bestimmt werden.

**`clip_ambient_keller__f4.png`**  
Das Auswahlfeld bleibt der primäre Fokus, enthält aber wieder nur Igor. Die zweite Kellerfigur aus `clip_ambient_keller__f3.png` ist verschwunden oder exakt hinter Igor verdeckt; letzteres ist wegen der unterschiedlichen Silhouetten nicht sicher erkennbar. Auf Etage 2 überschneidet sich ein Lauf-Sprite mit dem Aktenschrank und wirkt dadurch teilweise im Möbel versunken. Die übrigen Figuren halten ihre üblichen Größen, allerdings bleibt die systematische Differenz zwischen kleinen Lauf-Sprites und größeren interaktiven NPCs bestehen.

**`clip_avatar_walk__f1.png`**  
Die Uhr oben rechts zieht zunächst mehr Aufmerksamkeit als der laufende Avatar auf Etage 3. Der Avatar steht sauber auf der Etagenlinie und beginnt links vom Wasserspender, wirkt aber kleiner als die beiden Figuren vor der Zentrale. Sein Maßstab und seine Schärfe passen zu den übrigen Lauf-Sprites, nicht vollständig zu den stationären Charakter-Assets. Die Architektur und alle übrigen Objekte erscheinen stabil; es gibt in diesem Zeitpunkt keinen sichtbaren Sprung.

**`clip_avatar_walk__f2.png`**  
Der Avatar ist deutlich nach rechts versetzt und befindet sich unmittelbar neben dem Wasserspender. Seine Fußbasis und Körpergröße bleiben gegenüber `clip_avatar_walk__f1.png` stabil, was gegen ein Skalierungspumpen spricht. Die enge Überlagerung mit dem Wasserspender macht jedoch kurz unklar, welches Element vorne liegt. Aus den Standbildern lässt sich nicht erkennen, ob der Weg zwischen beiden Positionen gleichmäßig war oder ob die Füße über den Boden gerutscht sind.

**`clip_avatar_walk__f3.png`**  
Der Avatar steht weiter rechts und bleibt in Größe, Horizont und Schärfe konsistent zu `clip_avatar_walk__f1.png` und `__f2.png`. Seine Sohlen liegen weiterhin auf derselben Bodenlinie, sodass weder sichtbares Einsinken noch ein vertikaler Sprung vorliegt. Er bleibt gegenüber den stationären NPCs auf Etage 1 ungefähr eine Größenklasse kleiner, obwohl die Etagenansicht keine entsprechende Tiefenperspektive vermittelt. Die Tür rechts ist noch geschlossen und die übrigen Elemente bleiben unverändert.

**`clip_avatar_walk__f4.png`**  
Der Avatar ist nochmals nach rechts gerückt, während die Tür am rechten Ende nun geöffnet ist. Maßstab und Fußhöhe des Avatars bleiben stabil, der letzte horizontale Abstand ist jedoch kleiner als in den beiden vorherigen Bildpaaren. Ohne gleichmäßige Zeitabstände ist daraus keine Geschwindigkeitsänderung ableitbar. Die Tür öffnet bereits, obwohl der Avatar noch mehrere Körperbreiten entfernt steht, und wird dadurch stärkerer Blickfang als die eigentliche Figur.

## 2. **Konkrete Eingriffe je Screen**

### `clip_ambient_etage4__f1.png`
- Lauf-Sprite auf Etage 4 → auf ungefähr neun Zehntel bis volle Augenhöhe von Marina vergrößern, Fußpunkt unverändert auf der Etagenlinie halten → die derzeitige Größenklasse wirkt wie eine kleinere Personenart statt wie dieselbe Gebäudeperspektive.
- Füße aller sichtbaren Figuren → einen schmalen, dunklen Kontaktschatten direkt unter beide Sohlen setzen, höchstens ein Drittel der Schulterbreite → die Figuren wirken nicht länger knapp über dem glatten Boden schwebend.
- Aktivität auf Etage 4 → bewegte Figur durch einen zurückhaltenden Helligkeits- oder Konturrand vom Wandraster lösen → der Blick soll dorthin statt zuerst zur Uhr gehen.

### `clip_ambient_etage4__f2.png`
- Figur im linken Raum auf Etage 4 → gegenüber der Tür um etwa ein Zehntel vergrößern und mit den Füßen an dieselbe Basislinie wie Marina setzen → Türhöhe und NPC-Maßstab widersprechen derzeit der kleinen Figur.
- Figur auf Etage 2 → Fußanker minimal nach unten bis an die obere Kante des Bodenstreifens legen → der sichtbare Zwischenraum erzeugt einen leichten Schwebeeffekt.
- Statistenbestand gegenüber `clip_ambient_etage4__f1.png` → Figuren nur an Türen, Fahrstuhl oder Bildrand ein- und ausblenden, nicht frei im Korridor → Ortswechsel zwischen Etagen werden nachvollziehbar.

### `clip_ambient_etage4__f3.png`
- Figur auf Etage 3 rechts → zwischen Körper und rechter Tür mindestens eine halbe Körperbreite Luft lassen oder die Figur klar in die Tür eintreten lassen → die jetzige Zwischenposition liest sich weder als Vorbeigehen noch als Eintreten.
- Lauf-Sprite auf Etage 3 → auf die Körperhöhe der stationären Gebäudefiguren angleichen → die orthografische Etagenansicht rechtfertigt keine deutlich kleinere Skalierung.
- Leere Etagen 2 und 4 → persistente Figuren aus vorherigen Zeitpunkten bis zu einem sichtbaren Ausgang weiterführen → die Belegung wirkt sonst zufällig neu gewürfelt.

### `clip_ambient_etage4__f4.png`
- Gesamtes Spielbild → exakt mit derselben nativen Pixel-Skalierung wie `clip_ambient_etage4__f1.png` bis `__f3.png` ausgeben, ohne lineare Filterung → die weicheren Kanten sehen wie ein Auflösungs- oder Capture-Sprung aus.
- Figur am Aktenschrank auf Etage 2 → entweder mindestens eine halbe Körperbreite links vor den Schrank setzen oder den Unterkörper sauber hinter dessen Vorderkante maskieren → aktuell wirkt die Figur im Möbel versunken.
- Lauf-Sprites auf Etage 3 und 4 → gemeinsame Fußanker pro Etage verwenden und Kontaktschatten auf derselben Bodenlinie ergänzen → die weichere Darstellung macht kleine vertikale Abweichungen besonders sichtbar.
- Neu sichtbare Figuren → nur über Tür-, Fahrstuhl- oder Randübergänge zuführen → der starke Belegungssprung gegenüber `clip_ambient_etage4__f3.png` darf nicht als Pop-in erscheinen.

### `clip_ambient_keller__f1.png`
- Zwei Figuren im gelben Kellerfeld → horizontal um mindestens eine halbe Schulterbreite trennen → Beine und Silhouetten verschmelzen derzeit zu einer unlesbaren Personengruppe.
- Kleinere linke Figur → auf annähernd Igors Augenhöhe skalieren, sofern keine erzählerisch begründete Körpergröße vorliegt → beide stehen auf derselben Tiefenebene, wirken aber aus verschiedenen Asset-Skalen.
- Auswahlrahmen → Unterkante knapp unter der gemeinsamen Fußlinie enden lassen und nicht bis tief in den Bodenstreifen ziehen → Figurenkontakt und Interaktionsfläche werden räumlich klarer.
- Füße im Kellerfeld → gemeinsamen flachen Kontaktschatten durch zwei getrennte Schatten ersetzen → die beiden Standorte bleiben auch bei enger Annäherung unterscheidbar.

### `clip_ambient_keller__f2.png`
- Verschwundene zweite Kellerfigur → bis zu einer Tür, zum Fahrstuhl oder an den Rand sichtbar weiterführen → das vollständige Fehlen gegenüber `clip_ambient_keller__f1.png` liest sich sonst als Pop-out.
- Igor → Fußanker exakt auf die Basislinie des Auswahlfelds setzen und dort über alle Frames sperren → der ausgewählte NPC darf nicht vertikal zittern.
- Lauf-Sprite auf Etage 2 → im Verhältnis zu Igor und den Zentralen-NPCs leicht vergrößern → die kleinen Lauf-Assets brechen den einheitlichen Gebäudemaßstab.

### `clip_ambient_keller__f3.png`
- Rechte Kellerfigur → Abstand zu Igor bei mindestens einer halben Körperbreite halten, bis eine klare Vorder-/Hinterreihenfolge vorhanden ist → diese Trennung ist lesbarer als die Überlagerung in `clip_ambient_keller__f1.png`.
- Beide Kellerfiguren → Sohlen auf dieselbe horizontale Kontaktlinie setzen und jeweils einen eigenen Schatten geben → kleine Abweichungen wirken in der frontalen Kelleransicht wie Schweben.
- Rechte Kellerfigur → auf ungefähr Igors Schulter- und Augenmaßstab bringen → die aktuelle Differenz ist größer, als normale Körpergrößenvariation überzeugend erklärt.
- Kellerfigur über die Folge → Position zwischen `clip_ambient_keller__f2.png`, `__f3.png` und `__f4.png` durch sichtbare Zwischenpositionen belegen → sonst bleibt unklar, ob sie läuft oder ein- und ausgeschaltet wird.

### `clip_ambient_keller__f4.png`
- Zweite Kellerfigur aus `clip_ambient_keller__f3.png` → nicht exakt hinter Igor verschwinden lassen; seitlich mindestens einen Kopf oder eine Schulter sichtbar halten → vollständige Deckung ist visuell nicht von Despawn zu unterscheiden.
- Figur am Aktenschrank auf Etage 2 → Pfad vor die Möbelfront oder vollständig hinter den Schrank legen, nicht durch dessen Seitenkante → der Unterkörper wirkt aktuell versunken.
- Etage-2-Figur → Fußschatten unterhalb der sichtbaren Schuhe und vor der Schrankbasis platzieren → dadurch wird die Tiefenreihenfolge eindeutig.
- Igor und Auswahlfeld → Position und Größe gegenüber `clip_ambient_keller__f1.png` bis `__f3.png` unverändert halten → der Interaktionsanker muss stabiler wirken als die Umgebung.

### `clip_avatar_walk__f1.png`
- Laufender Avatar auf Etage 3 → um ungefähr ein Zehntel vergrößern, dabei den Fußanker auf der aktuellen Bodenlinie belassen → er wirkt deutlich kleiner als die stationären NPCs im selben Gebäudeschnitt.
- Avatarfüße → flachen Schatten direkt unter die Sohlen setzen → der Kontakt zum glatten, kontrastarmen Boden wird sofort lesbar.
- Avatar gegenüber Wasserspender → Bewegungspfad konsequent vor oder hinter das Objekt legen und diese Layer-Reihenfolge bis `clip_avatar_walk__f2.png` halten → die bevorstehende Überschneidung darf nicht räumlich kippen.

### `clip_avatar_walk__f2.png`
- Avatar und Wasserspender → Körper entweder vollständig vor dessen Kontur zeichnen oder den verdeckten Körperteil sauber maskieren → die aktuelle Teilüberlagerung macht die Tiefenlage unklar.
- Avatar → identischen Fußanker wie in `clip_avatar_walk__f1.png` verwenden, unabhängig vom jeweiligen Schrittframe → damit verhindert ihr vertikales Hüpfen durch wechselnde Sprite-Bounds.
- Lauf-Sprite → an den Größenstandard der Zentralen-NPCs annähern, ohne die Schrittlänge mitzuskalierten → Maßstab und Bewegungsdistanz müssen getrennt korrigiert werden.

### `clip_avatar_walk__f3.png`
- Avatar → aktuelle horizontale Bodenlinie als feste Walk-Baseline beibehalten und nur Gliedmaßen innerhalb des Sprite-Rahmens animieren → dieses Bild zeigt den überzeugendsten Bodenkontakt der vier.
- Größenverhältnis zu den NPCs auf Etage 1 → Avatar leicht vergrößern oder alle stationären NPCs auf denselben Fuß-bis-Augen-Standard normalisieren → die Etagen besitzen keine Perspektive, die den Unterschied erklärt.
- Rechte Tür → geschlossen lassen, bis der Avatar höchstens ein bis zwei Körperbreiten entfernt ist → dadurch entsteht eine nachvollziehbare Reaktion statt eines entfernten Automatismus.

### `clip_avatar_walk__f4.png`
- Rechte Tür → Öffnung später auslösen oder den Avatar näher an die Schwelle setzen → mehrere Körperbreiten Abstand lassen die Tür verfrüht reagieren.
- Geöffneter Türflügel → in derselben scharfen Pixelauflösung und flachen Perspektive wie der geschlossene Rahmen zeichnen → die helle schräge Fläche wirkt stilistisch stärker perspektivisch als der restliche Korridor.
- Avatar → Fußanker und Größe exakt aus `clip_avatar_walk__f3.png` übernehmen → der letzte Walk-Zustand darf beim Türtrigger weder springen noch skalieren.
- Letzte horizontale Wegstrecke → bei gleichmäßigen Aufnahmeintervallen an die vorherigen Distanzen angleichen, andernfalls die unterschiedlichen Zeitabstände dokumentieren → nur so ist eine scheinbare Abbremsung eindeutig lesbar.

## 3. **Grafiken/Assets**

- **Tragend:** Die Gebäudeschnitte in `clip_ambient_etage4__f1.png`, `clip_ambient_keller__f1.png` und `clip_avatar_walk__f1.png` liefern klare horizontale Bodenebenen, wiedererkennbare Türen und stabile Bezugskanten. Dadurch lassen sich Positionsfehler grundsätzlich gut erkennen.
- **Stabil:** Der Avatar in `clip_avatar_walk__f1.png` bis `__f4.png` behält über die vier Aufnahmen dieselbe Sprite-Größe und Schärfe. Sichtbares Skalierungspumpen tritt innerhalb dieser Folge nicht auf.
- **Falsch skaliert:** Die Lauf-Sprites in allen drei Clips wirken ungefähr eine Stufe kleiner als Marina, Igor und die Figuren vor der Zentrale. Da der Schnitt weitgehend orthografisch ist, sollte ein gemeinsamer Fuß-bis-Augen-Maßstab für Lauf-, Idle- und Interaktions-Sprites gelten.
- **Fremd beziehungsweise technisch fehlerhaft:** `clip_ambient_etage4__f4.png` ist insgesamt weicher als die drei vorherigen Bilder. Das widerspricht der Vorgabe „Pixel-Art: fein, detailliert, scharf“ aus `sprite-tool/public/context/game-style-guide.md` und sieht nach gefilterter Skalierung oder abweichender Capture-Auflösung aus.
- **Räumlich problematisch:** In `clip_ambient_etage4__f4.png` und `clip_ambient_keller__f4.png` kollidiert die Figur auf Etage 2 mit dem Aktenschrank. Das ist primär ein Pfad-/Z-Order-Problem, kein Detailproblem des einzelnen Assets.
- **Zu starke Sättigung:** Der Automat links im Keller von `clip_ambient_keller__f1.png` bis `__f4.png` ist mit Cyan, Weiß und Magenta deutlich lauter als die übrige Kellerpalette. Er konkurriert unnötig mit dem gelben Igor-Hotspot.
- **Was am meisten fehlt:** Kleine, einheitliche Kontaktschatten unter allen Figuren. Sie würden mit sehr wenig Produktionsaufwand Schweben, Bodenkontakt und Überlagerungen sofort verständlicher machen.

## 4. **Raster & Rhythmus**

- Das Gebäuderaster ist über alle Aufnahmen stabil: Geschosskanten, Türen, Möbel und Fahrstuhlschacht springen nicht. Ein sichtbarer Kameraversatz tritt innerhalb der jeweiligen Viererfolgen nicht auf.
- Die Figuren folgen offenbar geschossbezogenen horizontalen Laufbahnen, aber deren Fußanker liegen optisch knapp oberhalb der stärksten Bodenkante. Eine verbindliche Baseline pro Etage sollte direkt aus der Architektur abgeleitet und für alle Sprite-Zustände geteilt werden.
- In `clip_ambient_etage4__f1.png` bis `__f4.png` schwankt die Belegung zwischen großen Leerflächen und mehreren gleichzeitig auftauchenden Figuren. Dieser Rhythmus wirkt zufällig, weil Ein- und Austrittspunkte nicht in den Standbildern erkennbar sind.
- In `clip_ambient_keller__f1.png` entsteht Unruhe durch die Überlagerung zweier Figuren innerhalb eines ohnehin engen gelben Rahmens. `clip_ambient_keller__f3.png` zeigt die bessere Gruppierung: zwei getrennte Silhouetten auf einer gemeinsamen Basislinie.
- Die Lobby besitzt eine perspektivische Bodenzeichnung, während die oberen Korridore nahezu frontal aufgebaut sind. Die Figuren behalten trotzdem fast denselben Maßstab; das ist als spielerische Vereinfachung vertretbar, sollte aber durch eindeutige Schatten und feste Laufbahnen gestützt werden.
- Die schwarze Fußleiste, die vielen schwarzen Raumschilder und die helle rechte Bedienleiste erzeugen drei konkurrierende Randzonen. Dadurch bleibt der eigentliche Figurenraum visuell eingeklemmt, obwohl innerhalb der Etagen viel tote Fläche vorhanden ist.

## 5. **Lesbarkeit**

- Die Etagen- und Raumschilder sind grundsätzlich kontrastreich, aber in der gezeigten Gesamtansicht sehr klein. Zweimal hinsehen musste ich besonders bei „Zielgruppen-Analyse“ und „Finanzen / Tresor · Igor“, sobald mehrere Figuren direkt darunter stehen.
- Die Statuszeile am unteren Rand ist in allen Screens nur mit Anstrengung lesbar. Ihre geringe Größe steht nicht im Verhältnis zur durchgehenden Breite, die sie beansprucht.
- In `clip_ambient_etage4__f4.png` erschwert die weichere Ausgabe zusätzlich das Lesen der kleinen Schilder und das Erkennen einzelner Fußpixel.
- In `clip_ambient_keller__f1.png` musste ich zweimal hinsehen, um zwei statt einer Figur im gelben Feld zu erkennen. In `clip_ambient_keller__f4.png` ist ebenso unklar, ob die zweite Figur verschwunden oder vollständig verdeckt ist.
- In `clip_ambient_etage4__f4.png` und `clip_ambient_keller__f4.png` musste ich die Figur am Aktenschrank prüfen, weil nicht erkennbar ist, ob sie davor, dahinter oder darin steht.
- Aktiv, gesperrt und neu sind bei der rechten Tastenleiste nicht unterscheidbar. Der gelbe Igor-Zustand ist dagegen klar, sollte aber nicht durch ähnlich helle Uhr- und Seitenflächen konkurriert werden.

## 6. **Die drei wirksamsten Änderungen**

1. **Native Pixel-Skalierung für alle Frames erzwingen** — Der Qualitätsbruch in `clip_ambient_etage4__f4.png` ist technisch auffällig und wahrscheinlich mit geringem Aufwand durch einheitliche Render- und Capture-Skalierung zu beseitigen.
2. **Gemeinsame Fuß-Baselines, Sprite-Maßstäbe und Kontaktschatten definieren** — Ein Standard pro Etage und Charakterzustand behebt gleichzeitig Schweben, Größenklassen und schwer lesbare Überlagerungen.
3. **Figuren nur über sichtbare Ein- und Austrittspunkte wechseln lassen** — Türen, Fahrstuhl und Bildschirmränder müssen Spawn, Despawn und Türöffnung erklären, damit die starken Besetzungswechsel nicht wie Pop-ins wirken.

## 7. **Blinde Flecken**

- Aus diesen Standbildern kann ich **nicht** beurteilen, ob die Bewegung flüssig ist, ob Füße rutschen, ob Schrittphasen korrekt wechseln, ob Figuren vertikal hüpfen oder ob Easing und Geschwindigkeit zum langsamen bürokratischen Stil passen.
- Ohne genaue Zeitabstände zwischen `__f1` bis `__f4` lässt sich aus den unterschiedlichen Wegstrecken keine Beschleunigung oder Verlangsamung ableiten.
- Ich kann nicht feststellen, ob die wechselnden Statisten dieselben Personen sind. Eindeutige IDs, farbliche Markierungen oder ein Debug-Overlay pro Figur fehlen.
- Das Verschwinden von Figuren zwischen `clip_ambient_keller__f1.png` bis `__f4.png` kann ein Pop-out, eine vollständige Verdeckung oder das Ergebnis einer zwischen den Aufnahmen abgeschlossenen Bewegung sein.
- Bei der Tür in `clip_avatar_walk__f4.png` ist weder Öffnungsgeschwindigkeit noch Triggerzeitpunkt sichtbar; beurteilen lässt sich nur, dass der offene Endzustand bereits bei relativ großer Distanz vorliegt.
- Es ist nicht erkennbar, ob die Unschärfe von `clip_ambient_etage4__f4.png` im Spiel selbst, beim Screenshot-Capture oder durch nachträgliche Skalierung entstanden ist.
- Benötigt werden native Videos oder GIFs mit sichtbarer Frame-Nummer, unveränderten Zeitabständen und optionalen Debug-Linien für Fußanker, Kollisionsboxen, Laufpfade und Figuren-IDs. Hover-, Fokus-, Türtrigger- und Spawnzustände müssten zusätzlich jeweils vor, während und nach dem Übergang gezeigt werden.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
