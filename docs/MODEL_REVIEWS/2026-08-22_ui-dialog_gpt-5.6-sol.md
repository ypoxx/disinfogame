# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „dialog"

**Modell:** `gpt-5.6-sol` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-22
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-22T17:15:12.406Z · **Dauer:** 204.5 s
**Nutzung:** nicht gemeldet · **Kosten:** unbekannt · **Anbieter-Datensammlung:** ausgeschlossen (deny)

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

## 1. **Erster Eindruck**

### `direktor_intro.png`
Zuerst zieht die große, leuchtende Weltkarte in der Bildmitte den Blick an, unmittelbar danach das breite rote Kopfband der DialogBox. Eigentlich sollte die Reihenfolge Porträt → Sprechername → Dialogtext sein; das Porträt Volkovs erscheint jedoch erst an dritter Stelle. Seine Figur ist gegenüber Karte, Schreibtisch und DialogBox zu klein und wird an der Schulter hart vom Panel abgeschnitten. Die helle Uhr oben rechts bildet zusätzlich einen konkurrierenden Blickpunkt außerhalb der Dialogachse. Der Raum vermittelt den modernen Behördenkontext aus `sprite-tool/public/context/game-style-guide.md`, die DialogBox selbst wirkt aber eher wie ein flacher HUD-Balken als wie eine aufgelegte Akte.

### `dialog_alexei.png`
Das Auge landet zuerst auf den hellen Monitorgruppen links und in der Mitte, weil sie groß, kontrastreich und mehrfach wiederholt sind. Alexeis Gesicht sollte zuerst wahrgenommen werden, ist aber klein, weit unten rechts und gegen die technische Kulisse nicht deutlich genug isoliert. Die großen weißen Augen und der violett-dunkle Rand des Porträts ziehen anschließend Aufmerksamkeit auf sich, wirken jedoch stilistisch schärfer und animehafter als der Raum. Das olivfarbene Kopfband ist weniger dominant als bei Volkov, bleibt aber eine breite, flache Digitalfläche. Die symmetrisch angeschnittenen Arbeitsplätze an beiden Seiten lenken den Blick horizontal aus dem Bild, statt ihn zurück zum Sprecher und Text zu führen.

### `dialog_marina.png`
Der erste Blick geht auf die helle Wand und das stark gesättigte geometrische Bild in der oberen Mitte. Marinas Gesicht sollte der primäre Fokus sein, wird aber durch Sofa, Pflanze und Fensterrahmen hinter ihrem Kopf räumlich unruhig eingefasst. Ihr Porträt ist besser vom Hintergrund abgesetzt als Alexeis, bleibt im Verhältnis zur Raumfläche dennoch zu klein. Das blaue Kopfband wird nach dem Wandbild wahrgenommen, erst danach folgt der eigentliche Dialogtext. Die wärmere Raumbeleuchtung trägt die Medien-Zone, aber die Mitte ist so hell und sauber komponiert, dass sie dem Dialog die Bühne nimmt.

### `dialog_katja.png`
Hier dominieren zuerst die großen cyanfarbenen Monitore und der zentrale Arbeitstisch. Katja sollte vor diesen technischen Details liegen, ihr Porträt sitzt jedoch klein am unteren rechten Rand und endet genau an der DialogBox. Am problematischsten ist das cremefarbene Kopfband: Weißer Name, weiße Rolle und weißes Schließen-X verlieren sich auf der hellen Fläche. Dadurch fehlt zwischen Sprecherinformation und Textkörper die Hierarchie, die in den anderen Screens zumindest farblich vorhanden ist. Der oben angeschnittene Großmonitor lässt den Hintergrund außerdem wie einen zufälligen Kameraausschnitt statt wie eine bewusst komponierte Nahsicht wirken.

### `dialog_direktor.png`
Wie in `direktor_intro.png` zieht die cyanleuchtende Weltkarte zuerst den Blick an. Danach entsteht aus rotem Vorhang rechts und rotem Dialogkopf unten eine dominante L-Form, die Volkovs Gesicht einklemmt. Gewünscht wäre Gesicht → Name → Aussage; tatsächlich lautet die Reihenfolge Karte → Rotflächen → Gesicht → Text. Das Porträt ist zu klein, um gegen die Karte und den massiven Schreibtisch zu bestehen. Die Uhr und die beiden oberen Bedienelemente öffnen zusätzlich eine zweite UI-Zone, obwohl die Szene visuell bereits stark geteilt ist.

### `dialog_igor.png`
Zuerst fällt die zentral platzierte Tresortür auf, danach die cyanleuchtende Lampe darüber. Igors Gesicht sollte der Einstiegspunkt sein, sitzt aber klein und tief rechts vor mehreren senkrechten Fensterstreben. Das Porträt hat genügend Hautkontrast, wird durch die harte Panelkante an der Schulter dennoch wie abgeschnitten. Das dunkelblaue Kopfband ist lesbarer als Katjas Variante, wirkt aber ebenso flach und digital statt materiell. Im Text ist die Regieanweisung optisch nicht von der gesprochenen Aussage getrennt, weshalb man den Satzbeginn zweimal lesen muss.

---

## 2. **Konkrete Eingriffe je Screen**

### `direktor_intro.png`

- Weltkarten-Hintergrund → im Dialogzustand um etwa ein Fünftel abdunkeln und leicht entsättigen, Porträt und DialogBox davon ausnehmen → die Karte bleibt als Ortsinformation sichtbar, verliert aber den ersten Blick.
- Volkov-Porträt → auf etwa 1,25× vergrößern, von der rechten Kante aus nach links und oben wachsen lassen und die Schulter eine halbe Kopfbandhöhe hinter dem Panel verschwinden lassen → Gesicht und Mimik erhalten eine klare Hierarchiestufe vor der Raumgrafik.
- Rotes Kopfband → Höhe um etwa ein Sechstel reduzieren und Rot auf eine schmalere Aktenlasche beziehungsweise obere Kennlinie konzentrieren → die zulässige Ministeriumsfarbe bleibt erhalten, ohne ein Viertel der unteren Bildwirkung zu übernehmen.
- Dialogtext → linke Textkante unter der Namenskante statt unter dem äußeren Panelrand beginnen lassen und die Zeilenbreite auf ungefähr zwei Drittel des Panels begrenzen → Sprecherblock und Text bilden eine gemeinsame Lesespalte.
- Schließen-X → auf mindestens die Höhe der Rollenbezeichnung vergrößern, mit einer klaren quadratischen Trefferfläche versehen und an der oberen sowie rechten Innenkante gleich weit absetzen → das derzeitige einzelne Zeichen ist als Bedienfläche kaum erkennbar.
- Uhr/HUD oben rechts → während des Dialogs gemeinsam abdunkeln oder bis auf ein einziges Menü-Symbol ausblenden → die helle Uhr konkurriert unnötig mit Sprecher und Text.

### `dialog_alexei.png`

- Monitorgruppen → im Dialogzustand Luminanz und Cyanintensität zurücknehmen, besonders bei den sechs Bildschirmen links und den fünf mittleren → die mehrfachen hellen Rechtecke ziehen derzeit stärker als Alexeis Gesicht.
- Alexei-Porträt → etwa 1,3× vergrößern und um ungefähr ein Viertel seiner aktuellen Breite nach links versetzen → das Gesicht kommt aus der Randzone und erhält Abstand zur rechten Arbeitsplatzgruppe.
- Porträtkontur → violett-blauen Saum durch das gleiche kühle Anthrazit beziehungsweise Petrol ersetzen, das in Raum und UI vorkommt → die Figur wirkt dann weniger wie ein Asset aus einer anderen Illustrationsfamilie.
- Oliv-Kopfband → als Kraftpapierstreifen mit dunkler Tinte und kleiner oliver Aktenmarkierung statt als vollflächiger Farbbalken ausführen → das bringt die in `desinformation-network/src/story-mode/theme.ts` beschriebene Behörden-Akte sichtbar in die Komponente.
- Rollenbezeichnung „Technischer Leiter“ → um etwa ein Viertel vergrößern und enger unter dem Namen platzieren → sie ist momentan nur mit bewusstem Hinsehen lesbar.
- Seitliche Raumanschnitte → Nahsicht geringfügig nach links oder rechts staffeln, sodass nicht beide äußeren Arbeitsplatzgruppen gleich hart am Bildrand enden → die aktuelle Symmetrie wirkt wie eine wiederholte Hintergrundkachel und zieht den Blick auseinander.

### `dialog_marina.png`

- Wandbild → während des Dialogs Helligkeit und Sättigung deutlich unter die des Porträts setzen, insbesondere Cyan und Rot → es ist aktuell der stärkste Farbakzent und übernimmt fälschlich die Hauptrolle.
- Marina-Porträt → etwa 1,2× vergrößern und um ungefähr ein Drittel seiner Breite nach links verschieben → Haar, rechte Pflanze und Fensterkante bilden dann keine enge Tangente mehr.
- Porträthintergrund → direkt hinter Kopf und Schultern eine sehr zurückhaltende, dunkle Tinten-Vignette in etwa Porträtbreite einsetzen → die Figur löst sich vom Sofa und den Pflanzen, ohne als separate Karte zu wirken.
- Blaues Kopfband → auf eine schmalere Aktenlasche reduzieren und den restlichen Kopfbereich in Kraftpapier beziehungsweise dunklerem Manila halten → der Screen liest sich stärker als Papierwelt und weniger als farbcodiertes Softwarefenster.
- Regieanweisung „*tippt weiter, ohne aufzusehen*“ → in gedämpfter Sekundärtinte, mit seitlichem Einzug oder einer eigenen kurzen Regiezeile setzen → Handlung und gesprochener Text müssen auf den ersten Blick unterscheidbar sein.
- Kleine ID-Abbildung links → entweder um rund ein Fünftel vergrößern und wie ein angeheftetes Passfoto rahmen oder entfernen → in der jetzigen Größe dupliziert sie das Hauptporträt, ohne zusätzliche Mimik zu vermitteln.

### `dialog_katja.png`

- Helles Kopfband → Namen und Schließen-X auf dunkle Tinte umstellen oder einen dunklen Oliv-/Kraftpapierstreifen hinterlegen → Weiß auf Creme ist hier der deutlichste Lesbarkeitsfehler des Bündels.
- Rollenbezeichnung „Feld-Operateurin“ → dunkler, etwa ein Viertel größer und mit weniger Laufweite setzen → die Funktion ist aktuell fast nicht lesbar.
- Katja-Porträt → etwa 1,25× vergrößern und nach links oben wachsen lassen, während die rechte Schulter innerhalb derselben rechten Porträtspalte bleibt → die Figur kann gegen Monitore und zentralen Arbeitstisch bestehen.
- Großmonitor am oberen Rand → Hintergrundausschnitt so weit nach unten verschieben, bis der obere Rahmen des zentralen Displays vollständig sichtbar ist → der jetzige Anschnitt wirkt unbeabsichtigt.
- Cyan-Monitore → im Dialogzustand um etwa ein Fünftel abdunkeln, die roten Linien zusätzlich entsättigen → der technische Hintergrund bleibt lesbar, ohne den Sprecher zu überstrahlen.
- Kopfband und Textkörper → durch einen schmaleren Doppelstrich oder eine sichtbare Papierüberlappung trennen statt durch die einzelne schwere dunkle Linie → die aktuelle Linie wirkt wie eine Tabellenkante, nicht wie zwei Aktenlagen.

### `dialog_direktor.png`

- Weltkarte → dieselbe Dialog-Abdunklung wie in `direktor_intro.png` anwenden und das besonders helle Kartenzentrum hinter dem Stuhl reduzieren → der Blick startet dann nicht mehr in der Raummitte.
- Volkov-Porträt → auf etwa 1,25× skalieren und mit dem Gesicht etwas weiter links positionieren → die Mimik wird gegenüber Karte, Schreibtisch und Vorhang konkurrenzfähig.
- Roter Vorhang und rotes Kopfband → Vorhang im Dialogzustand entsättigen, Kopfband verkleinern, aber nicht beide Rotflächen gleichzeitig auf voller Intensität belassen → die rote L-Form am rechten und unteren Rand verliert ihre visuelle Klammer.
- Sprecherblock → Name, Rolle und Körpertext auf einer gemeinsamen linken Inhaltskante organisieren; das Passfoto darf als vorgelagerte Aktenmarke herausstehen → momentan springen die Lesekanten zwischen Foto, Name und Text.
- Textspalte → nicht über fast die gesamte Bildschirmbreite laufen lassen, sondern nach ungefähr zwei Dritteln des Panels umbrechen → spätere längere Aussagen bleiben lesbar und wirken wie Aktennotizen statt wie Konsolenausgabe.
- Obere Bedienelemente → Uhr, Menü und HUD-Schalter im Dialog auf eine gemeinsame reduzierte Deckkraft setzen → sie bilden derzeit eine unnötige zweite Bedienhierarchie.

### `dialog_igor.png`

- Tresortür und Lampe → während des Dialogs abdunkeln, wobei die Lampe stärker als die Tür reduziert werden sollte → beide zentralen Formen ziehen den Blick vor Igors Gesicht.
- Igor-Porträt → etwa 1,2× vergrößern und um ungefähr ein Viertel Porträtbreite nach links setzen → das Gesicht löst sich von den rechten Fensterstreben und sitzt weniger randnah.
- Porträtunterkante → Schulter nicht exakt an der Oberkante der DialogBox abschneiden, sondern sichtbar eine halbe Kopfbandhöhe hinter die Papierlage führen → so entsteht Überlagerung statt eines harten Asset-Schnitts.
- Regieanweisung „*runzelt die Stirn*“ → auf eine eigene, eingerückte Zeile in `textSecondary` setzen; „Suboptimal.“ als reguläre Rede beginnen → der Wechsel zwischen Handlung und Aussage ist derzeit nur über Sternchen kodiert.
- Rollenbezeichnung „Finanz-Analyst“ → größer und mit stärkerem Kontrast zum blauen Band setzen → sie ist trotz dunklem Hintergrund zu klein für ihre Informationsfunktion.
- Schließen-X → als klar begrenzte Schaltfläche innerhalb des Kopfbandrasters ausführen und vertikal zur Namenszeile ausrichten → das lose Zeichen wirkt momentan wie ein Druckfehler.

---

## 3. **Grafiken/Assets**

Die Raumhintergründe tragen den Stil des Bündels am stärksten. `direktor_intro.png` und `dialog_direktor.png` vermitteln Beton, Glas, gepflegte Technik und den dosierten roten Behördenakzent; `dialog_marina.png` erzeugt nachvollziehbar eine wärmere, hellere Zone; `dialog_alexei.png` und `dialog_katja.png` liefern dichte technische Arbeitsräume. Das entspricht der modernen Ministeriumsrichtung in `sprite-tool/public/context/game-style-guide.md` deutlich besser als einer braunen Retrobehörde.

Die Hintergründe sind aber fast überall als eigenständige Key-Art komponiert und nicht als Bühne für Dialoge. Die Weltkarte in `direktor_intro.png` und `dialog_direktor.png`, das Wandbild in `dialog_marina.png`, die Großmonitore in `dialog_katja.png` sowie Tresortür und Lampe in `dialog_igor.png` liegen jeweils im hellsten oder geometrisch stärksten Bildbereich. Ohne einen eigenen Dialog-Fokuszustand bleiben sie Hauptmotiv.

Die Hauptporträts wirken nicht vollständig aus einer Assetfamilie. Alexei in `dialog_alexei.png` hat überzeichnet helle Augen, einen violetten Kontursaum und eine stärkere Anime-Anmutung; Marina in `dialog_marina.png` ist glatter und weniger hart gepixelt; Volkov in `direktor_intro.png` und `dialog_direktor.png` sowie Igor in `dialog_igor.png` sind kontrastreicher und stärker karikiert. Katja in `dialog_katja.png` liegt stilistisch dazwischen. Pixelgröße, Konturfarbe, Hautkontrast und Grad der Gesichtsschattierung sollten auf ein gemeinsames Porträt-Spec gebracht werden.

Die Porträts sind durchgehend zu klein skaliert. Ihre Köpfe besetzen nur einen kleinen Teil der sichtbaren Raumhöhe, obwohl Mimik laut Manifest ein Kern der Aufnahmen ist. Eine gemeinsame Skalierung um ungefähr 20–30 Prozent und eine feste Gesichtslinie würden mehr bringen als zusätzliche Raumdetails.

Die kleinen Kopfbildchen links im Sprecherblock sind bei allen sechs Screens zu klein, um Mimik zu transportieren, und duplizieren das große Porträt. Als bewusst gerahmte Passfotos könnten sie die Aktenästhetik unterstützen; dafür brauchen sie ein sichtbares Papierfeld, eine einheitliche Ausschnittshöhe und etwas mehr Fläche. Andernfalls sollten sie entfallen.

Der DialogBox fehlen materielle Merkmale der in `desinformation-network/src/story-mode/theme.ts` beschriebenen „Behörden-Akte“. Cremefarbe allein reicht nicht: Eine dezente Faserstruktur, eine leicht unregelmäßige Papierkante, eine Aktenlasche hinter dem Sprecherfoto und eine sehr flache Überlagerungskante zwischen Kopf und Textkörper würden den Stil unmittelbar verständlich machen. Nicht nötig sind zusätzliche Flecken, Kaffeeringe oder starke Schlagschatten.

Am meisten fehlt unten rechts im Textkörper ein klarer Abschlusszustand. Nach Ende des Schreibens sollte dort ein kleiner, zurückhaltender Weiter-Stempel oder Seitenknick erscheinen; während des Tippens bleibt er unsichtbar. Das würde den derzeit einzigen Zustandsindikator – den Schreibcursor – sinnvoll ergänzen.

---

## 4. **Raster & Rhythmus**

Alle sechs Screens verwenden dieselbe grobe Aufteilung: ungefähr die oberen sieben Zehntel für den Raum und das untere Viertel für die DialogBox. Diese Stabilität ist brauchbar, die Box sitzt jedoch mit sehr kleinen Seitenabständen fast direkt am Viewportrand. Eine zentrierte Breite von etwa 92–94 Prozent der Ansicht würde mehr wie ein aufgelegtes Blatt wirken und an den Seiten Luft für den Raum lassen.

Innerhalb der DialogBox existieren zwei konkurrierende linke Kanten. Der Name beginnt rechts vom kleinen Foto, der Körpertext dagegen nahe am äußeren Panelrand. Entweder muss der Körpertext ebenfalls unter dem Namen beginnen, oder das Sprecherfoto muss als herausstehende Lasche außerhalb der Textspalte behandelt werden. Derzeit wirkt die Verschiebung zufällig.

Der Sprecherkopf ist im Verhältnis zum Textkörper zu hoch, insbesondere weil Name und Rolle zusammen nur ungefähr die Hälfte seiner Höhe nutzen. Kopfband um rund 15 Prozent reduzieren, Rolle näher an den Namen ziehen und den gewonnenen Raum dem Textkörper nicht einfach zuschlagen, sondern die gesamte Box etwas kompakter machen.

Die Porträts folgen zwar alle der rechten unteren Zone, ihre Gesichter haben aber keine präzise gemeinsame Linie. Alexei und Marina beginnen etwas höher, Igor tiefer, während die Schulteranschnitte unterschiedlich breit sind. Eine feste Porträtvorlage sollte Gesichtsmittelpunkt, maximale Kopfbreite, rechte Bezugskante und Überdeckung hinter dem Dialogpapier definieren.

Die Raumkompositionen besitzen fast alle ein starkes Zentrum, während der Sprecher rechts steht. Dadurch wandert der Blick Zentrum → rechts → unten links zum Text. Besser wäre rechts → Sprecherblock links → Textzeile. Ein lokaler Scrim hinter dem Raumzentrum und ein etwas weiter links sitzendes Porträt verkürzen diesen Blickweg.

Oben rechts ist das HUD nicht rhythmisch gruppiert: Zwischen Uhr und Menü besteht deutlich mehr Abstand als zwischen Menü und HUD-Schalter. Entweder alle drei Elemente als gemeinsame Leiste mit gleichen Zwischenräumen setzen oder während des Dialogs auf ein einzelnes, zurückgenommenes Bedienelement reduzieren.

Die große freie Fläche im Textkörper ist auf diesen Bildern auffällig, aber wegen des laufenden Schreibzustands nicht abschließend beurteilbar. Falls fertige Dialogseiten regelmäßig nur ein oder zwei Zeilen enthalten, sollte die Boxhöhe auf drei Textzeilen plus Innenabstände begrenzt werden. Falls längere Texte folgen, ist die feste Höhe vertretbar.

---

## 5. **Lesbarkeit**

Der eigentliche Dialogtext ist in allen sechs Screens groß genug und besitzt auf dem cremefarbenen Papier guten Kontrast. Problematisch ist weniger die Zeichenhöhe als die potenzielle Zeilenlänge: Über nahezu die gesamte Bildschirmbreite geführte Sätze werden bei längeren Texten schwer zu verfolgen. Eine Textspalte von ungefähr 60–70 Prozent der Panelbreite ist sinnvoller.

In `dialog_katja.png` musste ich bei „Katja Orlova“, „Feld-Operateurin“ und dem Schließen-X zweimal hinsehen. Weiß auf hellem Creme erzeugt praktisch keine belastbare Hierarchie. Das ist kein Feintuning, sondern ein klarer Kontrastfehler.

In `dialog_alexei.png`, `dialog_marina.png` und `dialog_igor.png` sind die Rollenbezeichnungen ebenfalls zu klein. Der Kontrast reicht teilweise aus, aber die Kombination aus Mini-Pixelschrift, geringer Höhe und großzügiger Laufweite erschwert die schnelle Erfassung. Die Rolle sollte mindestens ungefähr drei Viertel der sichtbaren Namenshöhe erreichen.

In `dialog_marina.png` und `dialog_igor.png` musste ich den Textanfang erneut lesen, um Regieanweisung und Rede zu trennen. Sternchen allein sind bei gleicher Schrift, Farbe und Grundlinie kein ausreichend schneller visueller Code. Sekundärfarbe, Einzug und eigene Zeile sind hier die einfachste Lösung.

Der kleine Schreibcursor zeigt, dass der Text noch läuft, aber ein Zustand „Text vollständig, Eingabe möglich“ ist auf keinem Bild erkennbar. Ebenso ist nicht ersichtlich, ob das X aktiv, fokussiert oder nur dekorativ ist. Eine klarere Abschlussmarke und sichtbare Fokuszustände sind erforderlich.

Die oberen HUD-Beschriftungen, insbesondere „HUD · H“, sind klein und kontrastarm. Im Dialog sind sie nicht nur schwer lesbar, sondern zugleich störend genug, um als Bedienzone wahrgenommen zu werden. Das ist die ungünstigste Kombination: visuell präsent, funktional schlecht erfassbar.

---

## 6. **Die drei wirksamsten Änderungen**

1. **Dialogmodus-Scrim für Raum und oberes HUD einführen** — eine globale Abdunklung beziehungsweise Entsättigung ist technisch vergleichsweise billig und korrigiert auf allen sechs Screens sofort die falsche Blickführung durch Karten, Monitore, Bild, Lampe und Uhr.
2. **DialogBox als einheitliche Papierkomponente neu rastern** — dunkler lesbarer Sprecherkopf, gemeinsame linke Textkante, größere Rollenbezeichnung und materieller Aktenrand beheben besonders `dialog_katja.png` und bringen die sichtbare UI in Einklang mit `desinformation-network/src/story-mode/theme.ts`.
3. **Alle Hauptporträts um 20–30 Prozent vergrößern und auf eine feste Gesichtslinie setzen** — diese reine Skalierungs- und Positionierungsänderung macht Mimik endlich zum Hauptmotiv, ohne die Raumassets neu bauen zu müssen.

---

## 7. **Blinde Flecken**

- In `direktor_intro.png`, `dialog_alexei.png`, `dialog_marina.png`, `dialog_katja.png`, `dialog_direktor.png` und `dialog_igor.png` läuft der Text noch. Deshalb sind endgültiger Umbruch, maximale Textmenge, Pagination und der Zustand nach Abschluss des Tippens nicht beurteilbar.
- Es ist nicht erkennbar, ob Porträts während des Sprechens blinzeln, die Mimik wechseln oder weich ein- und ausgeblendet werden. Dafür wären Bildfolgen derselben Dialogzeile nötig.
- Hover-, Tastaturfokus-, Gamepad-Fokus- und gedrückte Zustände des Schließen-X sowie der oberen HUD-Elemente fehlen.
- Nicht sichtbar ist, ob der Dialog die Zeit anhält und ob Uhr beziehungsweise HUD währenddessen bedienrelevant bleiben. Davon hängt ab, ob sie ausgeblendet oder nur gedämpft werden sollten.
- Alle Aufnahmen liegen in derselben Bildschirmgröße vor. Für die Beurteilung von Textskalierung, Porträtbeschnitt und Seitenabständen fehlen kleinere 16:9-Auflösungen sowie eine höhere Auflösung mit UI-Skalierung.
- Für die Assetkonsistenz wären mehrere Mimiken jedes Charakters nötig; aus je einem Zustand lässt sich nicht erkennen, ob Konturfarbe, Kopfgröße und Pixelraster innerhalb der jeweiligen Porträtserie stabil bleiben.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
