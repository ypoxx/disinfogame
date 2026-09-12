# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „daynight"

**Modell:** `gpt-5.6-sol` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-22
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-22T17:09:26.285Z · **Dauer:** 194.6 s
**Nutzung:** nicht gemeldet · **Kosten:** unbekannt · **Anbieter-Datensammlung:** ausgeschlossen (deny)

> ⚠️ **Wie das zu lesen ist:** Ein *fremdes* Modell hat einen **kuratierten Ausschnitt**
> des Projekts gesehen — nicht das laufende Spiel und nicht das ganze Repository. Es kann
> daher weder Laufzeitverhalten prüfen noch `file:line`-Belege verifizieren. Befunde sind
> **Hypothesen**, die vor dem Umsetzen am Code/an den Daten gegenzuprüfen sind. Die
> kanonische Wahrheit bleibt [`docs/VISION_LOCK.md`](../VISION_LOCK.md) bzw. die Spieldaten.

## Gestellte Frage

Sieh dir die beigefügten Screenshots des laufenden Spiels an und mache einen UX/UI-Durchgang. Die Optik soll eine Behörden-/Papierwelt sein (Stil-Anker und Farbtoken liegen bei). Sag mir: Wo führt das Bild den Blick falsch, welche Grafiken sitzen an der falschen Stelle oder in der falschen Größe, wo stimmen Abstände und Ausrichtung nicht, und welche drei Änderungen bringen am meisten? Sei so konkret, dass man es direkt umsetzen kann.

## Dieser Durchgang: Bündel „daynight" (7 Screenshots)

Das siehst du, in dieser Reihenfolge:
- sky_0900.png — Tageszeit-Stimmung um 09:00 Uhr (Himmel/Skyline/Tönung)
- sky_1200.png — Tageszeit-Stimmung um 12:00 Uhr (Himmel/Skyline/Tönung)
- sky_1425.png — Tageszeit-Stimmung um 14:25 Uhr (Himmel/Skyline/Tönung)
- sky_1600.png — Tageszeit-Stimmung um 16:00 Uhr (Himmel/Skyline/Tönung)
- sky_1706.png — Tageszeit-Stimmung um 17:06 Uhr (Himmel/Skyline/Tönung)
- sky_1800.png — Tageszeit-Stimmung um 18:00 Uhr (Himmel/Skyline/Tönung)
- building_lobby_night.png — Lobby bei Nacht (18:00, Tönung + Nacht-Skyline)

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
| 🖼 Bild | `sky_0900.png` | `desinformation-network/runs/visual-review/latest/shots/sky_0900.png` | 673 kB |
| 🖼 Bild | `sky_1200.png` | `desinformation-network/runs/visual-review/latest/shots/sky_1200.png` | 705 kB |
| 🖼 Bild | `sky_1425.png` | `desinformation-network/runs/visual-review/latest/shots/sky_1425.png` | 713 kB |
| 🖼 Bild | `sky_1600.png` | `desinformation-network/runs/visual-review/latest/shots/sky_1600.png` | 653 kB |
| 🖼 Bild | `sky_1706.png` | `desinformation-network/runs/visual-review/latest/shots/sky_1706.png` | 592 kB |
| 🖼 Bild | `sky_1800.png` | `desinformation-network/runs/visual-review/latest/shots/sky_1800.png` | 533 kB |
| 🖼 Bild | `building_lobby_night.png` | `desinformation-network/runs/visual-review/latest/shots/building_lobby_night.png` | 531 kB |

---

## Antwort des Modells

## 1. **Erster Eindruck**

**sky_0900.png**  
Der Blick landet zuerst auf dem gelben Schild „Finanzen / Tresor · Igor“, danach auf der hellen Uhr und der rechten Papierleiste. Das markierte Ziel ist als primärer Spielzustand plausibel, die Tageszeit sollte anschließend peripher eindeutig als Morgen lesbar sein. Stattdessen wirken der marineblaue Himmel, die zahlreichen weißen Punkte und die beleuchteten Fenster wie tiefe Nacht. Außenraum und Innenräume liegen zudem in einer ähnlich kühlen Helligkeit, sodass das Gebäude wenig räumliche Tiefe bekommt. Oben werden „Zielgruppen-Analyse“ und „Newsroom“ angeschnitten; damit beginnt der gesamte Bildaufbau sichtbar zu hoch.

**sky_1200.png**  
Auch hier zieht das gelbe Ziel zuerst, gefolgt vom cremefarbenen Zeitfeld; diese Hierarchie ist grundsätzlich klar. Der Außenraum kommuniziert jedoch nicht Mittag: Der Himmel bleibt dunkelblau, weiße Punkte lesen sich als Sterne und viele Fenster leuchten. Um 12:00 müsste dies der hellste und neutralste Zustand der Reihe sein, nicht nur eine leicht aufgehellte Variante von **sky_0900.png**. Das Gebäude selbst verändert seine Lichtwirkung kaum, wodurch die Uhr die Tageszeit erklären muss, statt dass das Bild sie zeigt. Die angeschnittenen Schilder am oberen Rand bleiben ein sofort sichtbarer Kompositionsfehler.

**sky_1425.png**  
Der orangefarbene Horizont an beiden Seiten konkurriert nun stark mit dem gelben Ziel und zieht den Blick aus dem Gebäude heraus. Um 14:24 sollte das aktive Ziel weiterhin zuerst auffallen, während der Himmel nur eine leichte Nachmittagswärme vermittelt. Die massive Orangezone liest sich bereits wie Sonnenuntergang und verschiebt den gefühlten Zeitpunkt um mehrere Stunden. Die grobe Ditherung und die gesättigten Silhouetten wirken außerdem stilistisch gröber als die fein gezeichnete Gebäudefassade. Hinzu kommt die kleine, aber sichtbare Abweichung zwischen Dateiname **sky_1425.png** und der Anzeige „14:24“.

**sky_1600.png**  
Das Auge springt zwischen dem gelben Zielschild und den orange leuchtenden Stadträndern hin und her. Der Spielzustand sollte dominieren; der Nachmittagshimmel darf Atmosphäre liefern, aber nicht zwei seitliche Blickmagnete erzeugen. Gegenüber **sky_1425.png** ist die Lichtphase zu ähnlich, sodass eineinhalb Stunden Verlauf visuell kaum nachvollziehbar sind. Gleichzeitig wird das Gebäude insgesamt dunkler, obwohl die sichtbaren Deckenleuchten weiterhin eingeschaltet sind. Dadurch sehen Innenraumbeleuchtung und Außenlicht nicht wie zwei getrennte Lichtsysteme aus, sondern wie ein globaler Farbfilter.

**sky_1706.png**  
Der gelbe Marker bleibt der stärkste Fokus, doch die Uhr gewinnt durch den nun deutlich dunkleren Hintergrund an Gewicht. Der Außenraum springt gegenüber **sky_1600.png** abrupt von orangener Abendstimmung zu fast vollständiger Nacht. Eine erkennbare Dämmerungsphase mit Restlicht am Horizont fehlt, obwohl genau sie den Zeitverlauf verständlich machen würde. Die global gedämpften Innenräume lassen Figuren, Türen und Etagenbeschriftungen unnötig zurücktreten. Die violetten Skyline-Lagen sind atmosphärisch deutlich stärker als die eigentliche Lobby und lenken den Blick seitlich weg.

**sky_1800.png**  
Der erste Blick fällt wieder auf das gelbe Ziel, danach auf die Uhr mit „17:58“. Für einen als **sky_1800.png** bezeichneten Prüfzustand ist diese Abweichung problematisch, weil nicht eindeutig ist, ob der korrekte 18-Uhr-Keyframe zu sehen ist. Gegenüber **sky_1706.png** ist nahezu keine weitere Entwicklung wahrnehmbar; beide Zustände lesen sich als dieselbe Nachtstufe. Die weißen Punkte liegen auch vor den Innenräumen und wirken deshalb weniger wie Sterne als wie ein unmaskiertes Vollbild-Partikelsystem. Durch die zusätzliche Abdunklung verlieren die schwarzen Raumtafeln deutlich an Lesbarkeit.

**building_lobby_night.png**  
Zuerst fällt der rote „FEIERABEND“-Hinweis auf, unmittelbar danach das weiterhin gelbe Schild „Finanzen / Tresor · Igor“. Die Figur rechts in der Lobby, die vermutlich den aktuellen Standort repräsentiert, geht dagegen vor Glas, Aufzug und dunkler Kleidung fast unter. Der Blick sollte zuerst zur Figur beziehungsweise zum aktuellen Interaktionsbereich in der Lobby gehen und erst danach zum Tagesstatus. Das gelbe Schild wirkt in diesem Zustand vom sichtbaren Geschehen entkoppelt, weil darunter nur eine geschlossene Tür markiert ist. Die Nachtstimmung ist außen eindeutig, aber die Lobby wird entgegen ihrer Rolle als heller Empfangsraum zu gleichmäßig und leer abgedunkelt.

---

## 2. **Konkrete Eingriffe je Screen**

### **sky_0900.png**

- *Himmel → Marineblau durch ein deutlich helleres, entsättigtes Blau-Grau ersetzen und die weißen Punkte fast vollständig entfernen → 09:00 muss ohne Lesen der Uhr als Morgen erkennbar sein.*
- *Skyline-Fenster → Anzahl und Leuchtkraft auf ungefähr ein Drittel des Nachtzustands reduzieren, besonders in den vorderen Silhouetten → die Stadt wirkt momentan noch nächtlich.*
- *Tageszeit-Tönung → ausschließlich auf Himmel und Außenstadt maskieren; Innenräume nur sehr leicht über Fensterflächen beeinflussen → eingeschaltete Behördenbeleuchtung darf nicht mit dem Himmel global abgedunkelt werden.*
- *Oberer Gebäudeabschluss → den gesamten Gebäudeausschnitt um etwa eine Schildhöhe nach unten versetzen und dafür unten entsprechend weniger Gleisfläche zeigen → „Zielgruppen-Analyse“ und „Newsroom“ müssen vollständig innerhalb der sicheren Bildfläche liegen.*
- *Uhr, Menü und HUD oben rechts → zu einer gemeinsamen Papier-Werkzeugleiste mit gleicher Oberkante und einheitlichen Zwischenräumen gruppieren → die drei Elemente wirken derzeit wie unabhängig platzierte Kästen.*

### **sky_1200.png**

- *Mittags-Keyframe → als hellsten Zustand der Reihe definieren: oberer Himmel heller als in **sky_0900.png**, Horizont nur minimal aufgehellt und ohne Violettstich → aktuell wirkt 12:00 wie spätes Zwielicht.*
- *Weiße Punkte → im Außenhimmel vollständig ausblenden und vor dem Gebäude grundsätzlich wegmaskieren → bei Mittag lesen sie sich als Sterne beziehungsweise als fehlerhafte Overlay-Partikel.*
- *Hintere Skyline → Kontrast zur Himmelsfläche um etwa ein Drittel reduzieren und Fensterlicht weitgehend abschalten → atmosphärische Entfernung und Mittagslicht werden dadurch glaubhafter.*
- *Gebäudefassade → mittags eine leichte, kühle Aufhellung nur an außenliegenden Kanten und Glasflächen geben, nicht über die gesamten Räume → so reagiert das Gebäude auf Tageslicht, ohne die Innenbeleuchtung zu verlieren.*
- *Oberer Bildrand → denselben sicheren Abstand wie die Uhrhöhe vorsehen und keine Beschriftung darüber hinausragen lassen → die angeschnittenen Raumtitel sehen nicht absichtlich, sondern fehlerhaft gerahmt aus.*

### **sky_1425.png**

- *Orange Horizontzone → auf das untere Fünftel des sichtbaren Himmels begrenzen und Sättigung deutlich reduzieren → 14:25 braucht höchstens eine leichte Nachmittagswärme, keinen Sonnenuntergang.*
- *Orange Skyline-Lagen → in ein gedämpftes Blau-Grau mit nur warmen Lichtkanten zurücknehmen → die beiden Seitenflächen stehlen dem aktiven Ziel die Aufmerksamkeit.*
- *Ditherband im Himmel → gröbere horizontale Muster durch feinere, zur Gebäude-Pixelgröße passende Abstufungen ersetzen → die Hintergrundgrafik wirkt momentan niedriger aufgelöst als der Vordergrund.*
- *Zeitanzeige → entweder exakt „14:25“ erfassen oder den Screenshot eindeutig als **sky_1424.png** benennen → die Minute darf bei einem Keyframe-Vergleich nicht widersprüchlich sein.*
- *Übergang von **sky_1200.png** → Helligkeit und Farbtemperatur kontinuierlich interpolieren, statt bereits direkt auf Orange zu wechseln → die Phase muss als Nachmittag zwischen Mittag und Abend lesbar bleiben.*

### **sky_1600.png**

- *16-Uhr-Himmel → gegenüber **sky_1425.png** etwas dunkler und wärmer machen, die Wärme aber nur nahe dem Horizont konzentrieren → derzeit sind beide Zeitpunkte zu ähnlich und zugleich zu flächig orange.*
- *Gebäude-Innenräume → globalen Violett-/Dunkelfilter entfernen und stattdessen nur Fenster, Glas und äußere Wandkanten einfärben → Neonlicht und Raumkontrast müssen stabil bleiben.*
- *Seitliche Stadtsilhouetten → Orangeanteil und Kontrast leicht unter den Kontrast des gelben Zielmarkers setzen → die Umwelt darf das Interaktionsziel nicht optisch einklammern.*
- *Weiße Partikel → auf Außenflächen beschränken oder, falls sie Schnee darstellen, an der Gebäudekontur sauber verdecken → derzeit liegen sie sichtbar auf Böden und Wänden.*
- *Raumtafeln → im 16-Uhr-Zustand mindestens denselben Textkontrast wie mittags halten; nötigenfalls Tafelgrund etwas heller oder Schrift heller setzen → die Etagennavigation darf nicht mit der Tageszeit schwanken.*

### **sky_1706.png**

- *Dämmerungshimmel → zwischen dem dunklen oberen Blau und der Skyline ein schmales, entsättigtes Restlichtband erhalten → der Sprung von **sky_1600.png** zur Nacht ist momentan zu abrupt.*
- *Sterne beziehungsweise weiße Punkte → zunächst nur wenige im oberen Drittel einblenden, nicht gleichmäßig über das ganze Bild verteilen → das unterstützt den Übergang statt eines sofortigen Nachtzustands.*
- *Fensterlichter der Skyline → mit der Tiefe staffeln: vorne einzelne helle Fenster, hinten weichere und schwächere Gruppen → aktuell entsteht ein gleichförmiges violettes Leuchtband.*
- *Innenbeleuchtung → unter jeder Deckenleuchte ein klar begrenztes Lichtfeld erhalten und Bodenbereiche dazwischen dunkler lassen → lokale Lichtinseln schaffen Tiefe und sichern die Figurenlesbarkeit.*
- *Etagen- und Raumtafeln → Text im Nachtzustand um eine Kontraststufe anheben, ohne die ganze Tafel aufzuhellen → besonders „Etage 3 – Analyse & Medien“ verlangt einen zweiten Blick.*

### **sky_1800.png**

- *Zeitanzeige → den Prüfzustand exakt bei „18:00“ aufnehmen oder den Dateinamen auf **sky_1758.png** korrigieren → sonst lässt sich der eigentliche Nacht-Keyframe nicht zuverlässig beurteilen.*
- *18-Uhr-Keyframe → sichtbar von **sky_1706.png** absetzen: Himmel oben dunkler, Restlicht am Horizont schmaler und mehr gezielt beleuchtete Fenster → derzeit sehen 17:06 und 17:58 nahezu identisch aus.*
- *Partikel-/Sternmaske → an Dach, Außenwand und Fenstern hart abschneiden; keine Punkte über Innenwänden oder Böden → der räumliche Fehler ist bei diesem dunklen Zustand besonders auffällig.*
- *Innenraumtönung → um etwa eine Helligkeitsstufe zurücknehmen und die lokale Neonbeleuchtung beibehalten → Figuren, Türen und Schilder verlieren momentan zu viel Zeichnung.*
- *Oberer Gebäudeausschnitt → vollständig unter die obere UI-Zone setzen und die dekorative Gleiszone unten als Ausgleich kürzen → die relevanten Raumtitel sind wichtiger als der zusätzliche Bodenstreifen.*

### **building_lobby_night.png**

- *Figur rechts in der Lobby → hinter ihr ein lokales Lichtfeld von ungefähr anderthalb Figurenhöhen Breite setzen und Silhouette leicht vom Aufzug abheben → der aktuelle Standort geht vor der ähnlich dunklen Architektur verloren.*
- *Gelbes Schild „Finanzen / Tresor · Igor“ → falls es nicht das aktive Ziel ist, auf einen gedämpften Papier-/Ockerton zurücksetzen; falls es aktiv ist, mit einer sichtbaren Bezugslinie zur markierten Tür verbinden → momentan wirkt das Schild wie ein verwaister Fokus.*
- *„FEIERABEND“-Feld → „18:00“ als primäre Zahl beibehalten und „FEIERABEND“ kleiner als roten Stempel darunter oder daneben setzen → der Status ersetzt aktuell die Zeitinformation und wird zum stärksten Element des Bildes.*
- *Lobby und Aufzug → Empfangszone und geöffnete Aufzugsumgebung heller als die übrigen Flure halten, mit klaren Lichtkegeln statt Vollbildabdunklung → laut sichtbarer Raumfunktion sollte dieser Bereich auch nachts orientierbar bleiben.*
- *Rechte Figur/Aufzuggruppe → etwas mehr Abstand zur rechten Gebäudekante beziehungsweise zum Schacht geben oder den Aufzug als gemeinsamen Interaktionsbereich heller rahmen → Figur und Architektur verschmelzen momentan zu einer schmalen dunklen Gruppe.*
- *Unterer Statusbereich → vor Beginn der rechten Papierleiste enden lassen; der rechte „PUBLIKUM…“-Knopf darf nicht unter der Leiste abgeschnitten werden → der Layoutbereich ist sichtbar nicht reserviert.*

---

## 3. **Grafiken/Assets**

Die Gebäudegrafik trägt in allen sieben Screens: klare Geschossbänder, harte Stahl- und Betonkanten, Glasflächen, Aufzugsschacht und feine Figuren passen grundsätzlich zum modernen Behörden-Brutalismus aus `sprite-tool/public/context/game-style-guide.md`. Auch die mehrlagige Skyline funktioniert als Tiefenrahmen, besonders in **sky_0900.png**, **sky_1200.png** und **building_lobby_night.png**. Die Gebäudegrafik ist schärfer und detailreicher als viele Hintergründe; deshalb fallen Abweichungen im Hintergrund besonders stark auf.

Fremd wirken vor allem die orangefarbenen Skyline- und Himmelsschichten in **sky_1425.png** und **sky_1600.png**. Ihre großen Farbstufen und das grobe Ditherband sehen eher nach hochskalierter, gröberer Pixel-Art aus als nach derselben Detailauflösung wie das Gebäude. Die Sättigung ist außerdem zu hoch für die ansonsten gedämpfte Palette und zieht den Blick an beide Außenränder.

Die weißen Punkte sind nicht eindeutig. Im Himmel lesen sie sich als Sterne, vor Innenwänden und Böden dagegen als unmaskierte Partikel. Falls es Schnee oder atmosphärischer Staub sein soll, fehlt die saubere Verdeckung durch Dach, Wände und Glas; falls es Sterne sein sollen, dürfen sie weder mittags noch innerhalb des Gebäudes erscheinen.

Falsch beschnitten ist der obere Gebäudeabschluss in sämtlichen Aufnahmen: „Zielgruppen-Analyse“ und „Newsroom“ ragen aus dem Bild. Unten bleibt gleichzeitig ein relativ hoher dekorativer Gleisstreifen sichtbar. Diese Priorität sollte umgekehrt werden: vollständige Nutzraum-Beschriftung oben, weniger nicht interaktive Gleisfläche unten.

Die Behörden-/Papierwelt ist nur teilweise sichtbar. Uhrfeld und rechte Seitenleiste verwenden Creme und Braun, während Raumtafeln, obere Buttons und die komplette untere Statuszeile als schwarze Digital-/Metallflächen erscheinen. Das widerspricht der Aussage in `desinformation-network/src/story-mode/theme.ts`, die gesamte Bedienung sei aus Papier gemacht. Die schwarzen Raumtafeln können als Beschilderung im Gebäude bleiben; die echte HUD-Ebene sollte dagegen als zusammenhängender Aktenrand, Formularstreifen oder Karteikartenleiste erscheinen, nicht als Mischung aus Papierkästen und schwarzem Broadcast-Balken.

Am meisten fehlt eine saubere Lichtmaske mit drei getrennten Ebenen: Außenhimmel, Außensilhouette und konstant beleuchteter Innenraum. Zusätzlich würde in **building_lobby_night.png** ein klarer lokaler Lichtpool am Aufzug mehr bringen als weitere Skyline-Details.

---

## 4. **Raster & Rhythmus**

- Das Gebäude nimmt ungefähr die mittleren zwei Drittel der Breite ein und bildet ein stabiles Geschossraster. Die rechte Papierleiste reduziert jedoch nur auf einer Seite den freien Außenraum, wodurch die Gebäudefassade optisch leicht nach rechts gedrängt wirkt.
- Die Geschosse haben einen brauchbaren vertikalen Rhythmus, aber der gesamte Stapel sitzt zu hoch. Oben fehlen vollständige Schilder, während unten mehrere Streifen Gleis, Kabel und Fundament übrig bleiben.
- Die Raumtafeln sitzen direkt auf den Geschosskanten. Das spart Platz, macht aber teilweise unklar, welchem Geschoss ein mittig auf dem Trenner sitzender Name zugeordnet ist; alle Tafeln sollten entweder vollständig innerhalb des zugehörigen Geschosses oder konsequent als Tabs an derselben Kante sitzen.
- Linke Etagennamen, mittige Raumnamen und das gelbe Ziel verwenden unterschiedliche horizontale Logiken. Sinnvoll wäre ein festes Gebäuderaster: Etagenname immer an derselben linken Innenkante, Raumname immer über der zugehörigen Tür beziehungsweise Raumachse, Zielmarker exakt auf derselben Achse wie sein Ziel.
- Uhr, Menü und HUD bilden oben rechts keine zusammenhängende Gruppe. Sie teilen ungefähr eine Höhe, aber Abstände und Materialflächen wirken zufällig; eine gemeinsame Papierleiste mit gleichmäßigen Zwischenräumen würde die Ecke beruhigen.
- Die rechte Papierleiste beginnt unterhalb der oberen Buttons, läuft aber über den unteren schwarzen Statusbereich hinweg. Dadurch ist sie weder klarer Seitenrand noch vollständige Aktenlasche und schneidet rechts Inhalte ab.
- Die Lobby besitzt viel freie Bodenfläche. Diese Leere passt zur Architektur, wird nachts aber zur toten Fläche, weil weder Lichtführung noch Figurengruppierung sie strukturiert.
- Die seitlichen Himmelstreifen sind in **sky_1425.png** und **sky_1600.png** visuell deutlich aktiver als der zentrale Spielraum. Das erzeugt eine umgekehrte Rahmung: Der Rand wird zum Motiv, das Gebäude zum dunkleren Zwischenstück.

---

## 5. **Lesbarkeit**

- Die Uhrzeit ist in **sky_0900.png** bis **sky_1800.png** gut lesbar, aber die kleine Bildmarke links davon ist nicht auf Anhieb als Uhr-/Tageszeitsymbol erkennbar. In **building_lobby_night.png** verdrängt „FEIERABEND“ die genaue Zeit vollständig.
- Die oberen Beschriftungen „Zielgruppen-Analyse“ und „Newsroom“ sind in allen sieben Screens abgeschnitten. Hier musste nicht nur zweimal hingesehen werden; Teile der Wörter liegen schlicht außerhalb des sichtbaren Bereichs.
- Die Etagenbeschriftungen sind bereits tagsüber klein. In **sky_1706.png**, **sky_1800.png** und **building_lobby_night.png** fällt der graue Text auf schwarzer Tafel unter eine komfortable Lesestufe.
- Der gelbe Marker „Finanzen / Tresor · Igor“ ist klar lesbar, aber so dominant, dass er selbst in **building_lobby_night.png** eine Figur auf der aktuellen Etage überstimmt. Für ein aktives Ziel ist das vertretbar; für einen bloßen bekannten Ort nicht.
- Die rechte Tastenleiste mit „K / M / A / K / I“ ist formal lesbar, semantisch aber nicht. Besonders die beiden identischen „K“-Felder lassen ohne Icon, Kurzbezeichnung oder sichtbaren Gruppenkopf keinen Zustand erkennen.
- Menü- und HUD-Schaltflächen oben rechts besitzen wesentlich weniger Kontrast als das Zeitfeld. „HUD · H“ ist noch erkennbar, wirkt aber eher deaktiviert als normal verfügbar.
- Die untere Statusmeldung ist sehr klein und über die gesamte Breite gestreckt. Rechts wird der Knopf „PUBLIKUM…“ durch die Papierleiste abgeschnitten; sein vollständiger Text und damit sein Zustand sind nicht erkennbar.
- In **sky_1800.png** und **building_lobby_night.png** verschmelzen dunkle Figuren mit Türen, Wandfugen und Aufzug. Besonders die Figur rechts in der Lobby von **building_lobby_night.png** benötigt eine hellere Hintergrundfläche oder eine kontrollierte Kantenaufhellung.
- Die Zustände aktiv und normal sind über Gelb versus Schwarz verständlich. Ein klarer visueller Unterschied zwischen gesperrt, nur bekannt, neu und aktuell ausgewählt ist in diesen Aufnahmen dagegen nicht erkennbar.

---

## 6. **Die drei wirksamsten Änderungen**

1. **Tageszeit-Keyframes neu staffeln:** 09:00 helles Morgenblau, 12:00 hellster neutraler Zustand, 14:25 nur leichte Wärme, 16:00 später Nachmittag, 17:06 sichtbare Dämmerung, 18:00 Nacht — das beseitigt mit überschaubarem Aufwand den größten inhaltlichen Widerspruch der gesamten Reihe.

2. **Tageszeittönung und Partikel auf Außenflächen maskieren:** Himmel, Skyline und Außenkanten dürfen wechseln, Innenräume behalten lokale Deckenbeleuchtung und lesbare Schilder — dadurch steigen räumliche Glaubwürdigkeit und Lesbarkeit gleichzeitig.

3. **Sichere Bildränder korrigieren und HUD als zusammenhängende Papierzone fassen:** Gebäude um eine Schildhöhe nach unten setzen, unten weniger Gleis zeigen und rechte beziehungsweise untere UI-Bereiche ohne Überlappung reservieren — das behebt abgeschnittene Titel, den gekappten „PUBLIKUM…“-Knopf und die fragmentierte Papieroptik in einem Durchgang.

---

## 7. **Blinde Flecken**

- Aus Einzelbildern ist nicht erkennbar, ob die Tageszeit kontinuierlich interpoliert oder in sichtbaren Stufen umspringt. Dafür wären kurze Aufnahmen der Übergänge 12:00→14:25, 16:00→17:06 und 17:06→18:00 nötig.
- Die weißen Punkte können ohne Bewegung weder sicher als Sterne noch als Schnee oder Staub bestimmt werden. Eine kurze Sequenz würde Richtung, Geschwindigkeit und Maskierungsfehler zeigen.
- **sky_1800.png** zeigt nur 17:58, **building_lobby_night.png** nur „FEIERABEND“. Ein Screenshot exakt bei 18:00 mit sichtbarer Uhr fehlt zur Prüfung des tatsächlichen Nacht-Keyframes.
- Es ist nicht erkennbar, ob das gelbe „Finanzen / Tresor · Igor“-Schild ein aktives Ziel, ein Hover, eine Auswahl oder einen permanent bekannten Raum darstellt. Dafür werden derselbe Ausschnitt ohne Auswahl sowie mit einem anderen ausgewählten Ziel benötigt.
- Hover-, Fokus-, gesperrte und neue Zustände der rechten Tastenleiste sind nicht sichtbar. Ein Zustandsblatt oder Screenshots derselben Leiste in diesen Varianten wären erforderlich.
- Die Lesbarkeit bei kleinerer Fenstergröße lässt sich aus den 1280×720-Aufnahmen nicht beurteilen. Benötigt werden mindestens ein kleinerer 16:9-Ausschnitt und ein Screenshot mit UI-Skalierung, insbesondere wegen Etagenlabels und unterer Statuszeile.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
