# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „ending-4von4"

**Modell:** `stealth/ox-alpha` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-21
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-21T16:57:37.470Z · **Dauer:** 367.1 s
**Nutzung:** 18.418 Prompt + 8.785 Antwort Tokens · **Kosten:** $0.00 (gratis) · **Anbieter-Datensammlung:** ausgeschlossen (deny)

> ⚠️ **Wie das zu lesen ist:** Ein *fremdes* Modell hat einen **kuratierten Ausschnitt**
> des Projekts gesehen — nicht das laufende Spiel und nicht das ganze Repository. Es kann
> daher weder Laufzeitverhalten prüfen noch `file:line`-Belege verifizieren. Befunde sind
> **Hypothesen**, die vor dem Umsetzen am Code/an den Daten gegenzuprüfen sind. Die
> kanonische Wahrheit bleibt [`docs/VISION_LOCK.md`](../VISION_LOCK.md) bzw. die Spieldaten.

## Gestellte Frage

Sieh dir die beigefügten Screenshots des laufenden Spiels an und mache einen UX/UI-Durchgang. Die Optik soll eine Behörden-/Papierwelt sein (Stil-Anker und Farbtoken liegen bei). Sag mir: Wo führt das Bild den Blick falsch, welche Grafiken sitzen an der falschen Stelle oder in der falschen Größe, wo stimmen Abstände und Ausrichtung nicht, und welche drei Änderungen bringen am meisten? Sei so konkret, dass man es direkt umsetzen kann.

## Dieser Durchgang: Bündel „ending-4von4" (10 Screenshots)

Das siehst du, in dieser Reihenfolge:
- fixture_wahlabend_timeout_s2.png — Wahlabend-Fixture (timeout): Schritt 2 (Ergebnis/Stempel)
- fixture_wahlabend_timeout_s3.png — Wahlabend-Fixture (timeout): Schritt 3 (Wohnzimmer-Schnitt + Nachsatz)
- fixture_wahlabend_immune_s0.png — Wahlabend-Fixture (immune): Titelkarte
- fixture_wahlabend_immune_s1.png — Wahlabend-Fixture (immune): Schritt 1 (Hochrechnung/Sondersendung)
- fixture_wahlabend_immune_s2.png — Wahlabend-Fixture (immune): Schritt 2 (Ergebnis/Stempel)
- fixture_wahlabend_immune_s3.png — Wahlabend-Fixture (immune): Schritt 3 (Wohnzimmer-Schnitt + Nachsatz)
- fixture_wahlabend_exposed_s0.png — Wahlabend-Fixture (exposed): Titelkarte
- fixture_wahlabend_exposed_s1.png — Wahlabend-Fixture (exposed): Schritt 1 (Hochrechnung/Sondersendung)
- fixture_wahlabend_exposed_s2.png — Wahlabend-Fixture (exposed): Schritt 2 (Ergebnis/Stempel)
- fixture_wahlabend_exposed_s3.png — Wahlabend-Fixture (exposed): Schritt 3 (Wohnzimmer-Schnitt + Nachsatz)

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
| 🖼 Bild | `fixture_wahlabend_timeout_s2.png` | `desinformation-network/runs/visual-review/latest/shots/fixture_wahlabend_timeout_s2.png` | 129 kB |
| 🖼 Bild | `fixture_wahlabend_timeout_s3.png` | `desinformation-network/runs/visual-review/latest/shots/fixture_wahlabend_timeout_s3.png` | 149 kB |
| 🖼 Bild | `fixture_wahlabend_immune_s0.png` | `desinformation-network/runs/visual-review/latest/shots/fixture_wahlabend_immune_s0.png` | 178 kB |
| 🖼 Bild | `fixture_wahlabend_immune_s1.png` | `desinformation-network/runs/visual-review/latest/shots/fixture_wahlabend_immune_s1.png` | 151 kB |
| 🖼 Bild | `fixture_wahlabend_immune_s2.png` | `desinformation-network/runs/visual-review/latest/shots/fixture_wahlabend_immune_s2.png` | 159 kB |
| 🖼 Bild | `fixture_wahlabend_immune_s3.png` | `desinformation-network/runs/visual-review/latest/shots/fixture_wahlabend_immune_s3.png` | 181 kB |
| 🖼 Bild | `fixture_wahlabend_exposed_s0.png` | `desinformation-network/runs/visual-review/latest/shots/fixture_wahlabend_exposed_s0.png` | 178 kB |
| 🖼 Bild | `fixture_wahlabend_exposed_s1.png` | `desinformation-network/runs/visual-review/latest/shots/fixture_wahlabend_exposed_s1.png` | 151 kB |
| 🖼 Bild | `fixture_wahlabend_exposed_s2.png` | `desinformation-network/runs/visual-review/latest/shots/fixture_wahlabend_exposed_s2.png` | 160 kB |
| 🖼 Bild | `fixture_wahlabend_exposed_s3.png` | `desinformation-network/runs/visual-review/latest/shots/fixture_wahlabend_exposed_s3.png` | 182 kB |

---

## Antwort des Modells

# UX/UI-Durchgang: Bündel „ending-4von4"

Vorbemerkung: Von `fixture_wahlabend_exposed_s3.png` wurde nur der Dateiname übermittelt, **kein Bildinhalt**. Dieser Screen ist nicht bewertbar und muss nachgereicht werden. Alle übrigen neun Aufnahmen sind ausgewertet.

---

## 1. Erster Eindruck

**fixture_wahlabend_timeout_s2.png**
Das Auge landet zuerst auf dem roten Label „Westunion Erwacht" und dem Balken in der Bildmitte — das ist semantisch korrekt, hier stimmt Blickziel und Bedeutung überein. Problem: Der Balkenblock schwebt isoliert; ober- und unterhalb liegen jeweils rund 35 % des TV-Rahmens als leere, strukturlose Dunkelheit. Das LIVE-Badge oben rechts ist so klein und kontrastarm, dass es erst beim zweiten Hinsehen auffällt. Der Ticker unten ist die zweitstärkste Zone und gut platziert. Es gibt keinerlei Positionsanzeige innerhalb der vier Schritte — der Spieler weiß nicht, wo er im Ablauf steht.

**fixture_wahlabend_timeout_s3.png**
Der TV-Rahmen ist nach oben aus dem Viewport geschoben: Die obere Rahmenkante und vermutlich das Badge sind abgeschnitten. Das wirkt wie ein Layoutbruch (zentriertes Flex-Element, das bei Überlauf oben clippt), nicht wie Absicht. Der Blick springt zuerst auf den roten WEITER-Button, dann suchend zurück zum Balken. Die sechs Milieu-Badges bilden zwei ungleiche, zentrierte Reihen (4 + 2) — das ergibt einen unsteten, „flatternden" Rhythmus. Die Narrationszeile über den Badges ist typografisch nicht vom Ticker-Text unterschieden, obwohl sie eine andere Stimme spricht.

**fixture_wahlabend_immune_s0.png**
Fast leere Titelkarte: Der Textblock sitzt bei etwa 45 % Bildhöhe, die komplette untere Bildhälfte ist tot. „DIE HOCHRECHNUNG" in Amber-Pixelschrift ist der einzige Anker und funktioniert als solcher. Die Hierarchie Kicker → Titel → Untertitel → Prompt ist sauber gestaffelt, aber alles klebt an einer Achse mittig ohne jede Umgebung. Kritisch: Diese Karte ist **bildidentisch** mit `exposed_s0` — zwei verschiedene Endings, keine visuelle Differenzierung.

**fixture_wahlabend_immune_s1.png**
Roter Sondersendung-Rahmen, Überschrift plus vier Bullet-Zeilen linksbündig. Der Inhaltsblock beginnt erst bei ca. 30 % Rahmenhöhe, darüber liegt ungenutzter Raum — die Vertikalverteilung wirkt unausgewogen, nicht dramatisch intendiert. Die rote Überschrift auf dunkelrotem Grund hat nur mäßigen Kontrast. Die Bullets selbst sind gut lesbar und ruhig gesetzt. Der Ticker trägt die Szene; ohne ihn wäre der Screen inhaltsleer.

**fixture_wahlabend_immune_s2.png**
Der Stempel „GEFÄLSCHT" liegt exakt auf der Überschrift und den ersten beiden Listenzeilen. Er ist zwar das Ereignis des Steps, zerstört aber genau die Information, die er kommentiert. Die Durchstreichungen der Zeilen sind haarfein und verschwinden im Dunkelrot — ich musste zweimal hinsehen, um überhaupt zu erkennen, dass die Zeilen entwertet sind. Unterhalb der vierten Zeile liegt erneut eine große leere Fläche. Der Stempel ist das stärkste grafische Element des gesamten Sets — und sitzt an der schlechtesten möglichen Stelle.

**fixture_wahlabend_immune_s3.png**
Wie s2, zusätzlich der Rahmen-Clipping-Fehler oben: Das SONDERSENDUNG-Badge ist halbiert. Die vertikale Kette Rahmen → Narration → Badges → WEITER besteht aus vier zentrierten Blöcken unterschiedlicher Breite ohne gemeinsame Bezugskante — das Auge findet keine Führungslinie. Die Narrationszeile („Unten im Bild: Ihr Bürogebäude…") beschreibt eine Visualisierung, **die im Bild nicht existiert**. Entweder fehlt das Asset oder der Ladevorgang ist geschluckt — das ist der inhaltlich schwerwiegendste Befund dieses Durchgangs.

**fixture_wahlabend_exposed_s0.png**
Bildidentisch mit `immune_s0`, gleiche Titel, gleicher Untertitel, gleiche Leerfläche. Für ein Ending-Set, das auf Konsequenz abzielt, ist das eine verpasste Markierung: Der Spieler kann am Screen nicht erkennen, welchem Pfad er folgt. Mindestens eine Farbakzent- oder Stempeldifferenzierung auf der Karte wäre nötig.

**fixture_wahlabend_exposed_s1.png**
Bildidentisch mit `immune_s1` — inklusive identischem Ticker-Text („Wir unterbrechen das Programm für eine Sondersendung."). Wenn Absicht, dann redundant; wenn nicht, zeigt es, dass die Step-1-Vorlage zu starr ist. Die gleichen Lesbarkeits- und Verteilungsprobleme wie bei `immune_s1` gelten unverändert.

**fixture_wahlabend_exposed_s2.png**
Stempelkollision und Strichstärkenproblem wie in `immune_s2`. Einziger Unterschied ist der Ticker-Text („Die Ermittler haben das Netzwerk aufgedeckt…"). Der Stempel sitzt zudem in beiden Varianten auf identischer Position — bei einem als „gestempelt" inszenierten Moment wäre eine leichte Varianz (Rotation, Versatz) glaubwürdiger.

---

## 2. Konkrete Eingriffe je Screen

**fixture_wahlabend_timeout_s2.png**
- Balkenwert „15.3 %" → von der fernen Rechtsposition direkt über das gefüllte Balkenende ziehen, rechtsbündig zur Füllkante, Größe ~1,4× → Zahl und Balken gehören zusammen, aktuell sind es zwei getrennte Infos.
- „SCHWELLE"-Label → seitlich neben die Marke setzen (rechts der Tick-Linie, gleiche Grundlinie wie der Prozentwert), nicht darüber → das Label kollidiert aktuell mit dem hochgezogenen Tick-Strich.
- LIVE-Badge → ~1,3× vergrößern, dunkles Backing-Chip hinterlegen (z. B. surface-Ton), Abstand zur Rahmenecke konstant 16 px → derzeit der schwächste Punkt der sonst klaren Ecke.
- Balkengrafik → vertikal im Rahmen zentrieren statt bei ~48 % Höhe zu lassen und gleichzeitig den freien Bereich darunter für eine Mini-Legende (Skalenende = 100 %?) nutzen → die Skala ist ohne Referenz nicht interpretierbar.
- Schrittindikator → vier Segmente (Punkte/Striche) unten links im Rahmen, aktives Segment in Amber → vier Screens ohne Ortsgefühl.

**fixture_wahlabend_timeout_s3.png**
- Gesamtes Layout → Höhen-Anker reparieren: Rahmenoberkante fest an Viewport-Top + 24 px nageln, Nachsatz-/Badge-/Button-Zone als reserviertes Footer-Band (~25 % Höhe) darunter; Rahmenhöhe dynamisch auf Restfläche skalieren → behebt das Clipping der Oberkante strukturell, nicht kosmetisch.
- Milieu-Badges → beide Reihen linksbündig zur selben Kante wie die Narrationszeile setzen ODER als 3+3-Raster mit gleich breiten Zellen; Reihenabstand 16 px, Spaltenabstand 8 px → killt den 4+2-Flatter-Effekt.
- Narrationszeile → als Papier-Zettel/Card (surfaceLight-Hintergrund, borderLight-Rand, Tinten-Text) über die volle Inhaltsbreite setzen → trennt die Erzählstimme vom TV-Ticker und bindet die Behörden-Materialwelt ein.
- WEITER-Button → statt Vollflächen-MinistryRed den `stampCtaStyle` aus `theme.ts` (Papierfläche, Doppelring, rote Stempel-Tinte) → der aktuelle Button verstößt gegen die eigene Token-Regel „Rot NUR für Stempel/Kopfbänder".
- Icon-Glyphen (▲/■) in den Badges → auf mindestens Text-x-height vergrößern und farblich an die jeweilige Tinte koppeln → aktuell wirken sie wie Rendering-Rauschen.

**fixture_wahlabend_immune_s0.png**
- Textblock → auf optische Mitte (leicht über geometrische Mitte, ~46–48 %) setzen und die untere Hälfte mit dezenter Scanline-/Vignettentextur füllen → eliminiert die tote schwarze Halbebene.
- Ending-Differenzierung → Kicker-Zeile um Pfad-Marker erweitern („WAHLAGEND · WESTUNION · PFAD: IMMUN") oder Titel in pfadspezifischer Tintung (Petrol `tech` vs. Rot `danger`) → macht die Karten unterscheidbar ohne Neuaufbau.
- „Klicken zum Fortfahren" → als pulsierendes Element (Opacity-Loop) kennzeichnen und Klickfläche auf den ganzen Screen legen → aktuell unklar, ob nur der Text klickbar ist.
- Titelgröße → „DIE HOCHRECHNUNG" um ~20 % vergrößern, Laufweite leicht öffnen → als alleiniges Element der Karte darf es dominanter sein.

**fixture_wahlabend_immune_s1.png**
- Inhaltsblock → vertikal zentrieren (aktuell kopflastig oben-mittig mit Leerraum darunter) oder oberen Freiraum durch ein Sendungs-Logo/„EILMELDUNG"-Kopfband füllen → Verteilung wirkt unfertig.
- Überschrift „IHRE SCHLAGZEILEN – GEPRÜFT" → Helligkeit der roten Tinte auf Rahmenhintergrund prüfen, alternativ Papier-Backing-Chip → Rot-auf-Dunkelrot ist die schwächste Kontraststelle des Screens.
- Linker Satzspiegel → Bullets und Überschrift auf dieselbe x-Kante bringen (Überschrift sitzt minimal versetzt) → eine Kante, eine Achse.
- Zeilenabstand der Bullets → auf ~1,6× Zeilenhöhe öffnen → vier Zeilen wirken gestaucht gegenüber der riesigen Umgebung.
- Schrittindikator → wie in s2 ergänzen.

**fixture_wahlabend_immune_s2.png**
- Stempel „GEFÄLSCHT" → nach unten rechts versetzen, sodass er die untere rechte Leerfläche und maximal die letzte Zeile schneidet; Rotation beibehalten → das Ereignis bleibt, die Information wird lesbar.
- Durchstreichungen → Strichstärke auf ~2 px verdoppeln und Tinte auf helleres Papier-Beige (`surfaceLight`) statt Tiefschwarz-Rot → aktuell sind die entwerteten Zeilen kaum als entwertet erkennbar.
- Stempeldeckkraft → auf ~85–90 % reduzieren, falls Überlappung mit Text unavoidable bleibt → Textdarunter bleibt rekonstruierbar.
- Freie Fläche unterhalb der Liste → für eine kurze Gegenrede/Faktencheck-Zeile nutzen (eine Zeile, Petrol-Tinte) → der Screen behauptet „Masche für Masche", zeigt aber nur die Maschen.

**fixture_wahlabend_immune_s3.png**
- Rahmen-Clipping → derselbe Höhen-Anker-Fix wie bei `timeout_s3`; SONDERSENDUNG-Badge muss vollständig sichtbar bleiben → Header-Info geht aktuell verloren.
- Narrationszeile → entweder das beschriebene Bürogebäude-Bild tatsächlich rendern (siehe Abschnitt 3) oder den Text umbauen → ein Text, der ein Bild beschreibt, das nicht da ist, bricht die Immersion vollständig.
- Badges + WEITER → linkbündig auf gemeinsame Kante mit der Narrations-Card bringen → vier zentrierte Blöcke ohne Führungskante sind der unruhigste Verbund des Sets.
- WEITER-Button → Stempel-Stil wie in `timeout_s3`.
- Ticker → beibehalten, bildet die untere Kante des Rahmens konsistent.

**fixture_wahlabend_exposed_s0.png**
- Alle Eingriffe aus `immune_s0` übernehmen (optische Mitte, Textur, Klickfläche, Titelgröße).
- Zusätzlich: Pfad-Kennzeichnung „PFAD: ENTARNT" bzw. rote Tintung des Titels → ohne diese ist die Karte ein Duplikat.

**fixture_wahlabend_exposed_s1.png**
- Alle Eingriffe aus `immune_s1` übernehmen (Vertikalverteilung, Überschriftenkontrast, Satzspiegel, Zeilenabstand).
- Zusätzlich: Ticker-Text differenzieren — wenn die Ermittlungs-Storyline hier schon läuft, sollte die Sondersendung anders angekündigt sein als im Immun-Pfad → sonst wirkt der Zweig tot.

**fixture_wahlabend_exposed_s2.png**
- Stempel-Versatz und Strichstärke wie in `immune_s2`.
- Stempelrotation/-position leicht variieren (~±3°, ±20 px) gegenüber der Immun-Variante → zwei identische Stempelshots in einem Set sehen nach Copy-Paste aus.
- Freie Fläche unterhalb der Liste → Beleg-Verweis („wir zeigen die Belege" laut Ticker — dann sollten ansatzweise Belege zu sehen sein, auch nur als rote Aktensymbole).

**fixture_wahlabend_exposed_s3.png**
- Nicht bewertbar — Screenshot fehlt. Vor allem relevant: Wird hier das beschriebene Bürogebäude gezeigt, das in `immune_s3` fehlt?

---

## 3. Grafiken/Assets

- **Tragend:** Der TV-Rahmen mit Gold-/Messingkante und der Ticker sind die stärksten Assets — sie etablieren den CRT-Kontext sofort und halten das Set zusammen. Der Stempel „GEFÄLSCHT" ist stilistisch richtig (MinistryRed, Doppelrahmen, leicht rotiert) und das beste Einzelasset des Bundles — nur falsch positioniert.
- **Fremd wirkend:** Die Milieu-Badges unterhalb des Rahmens. Sie sind flache Terminal-Chips auf Schwarz — weder Papierwelt (theme.ts: „Die gesamte Bedienung ist aus PAPIER gemacht") noch CRT-Welt. Sie schweben stilistisch zwischen beiden Systemen. Lösung: entweder als Papierkärtchen (surfaceLight, borderLight) oder als Einblendung *im* TV-Bild unten.
- **Falsch skaliert/platziert:** Der Stempel überdeckt Kopf und Kern der Liste. Bei seiner Größe (~40 % Rahmenbreite) gäbe es drei bessere Zonen: untere rechte Quadrant, diagonale Lage über die leere Mittelzone, oder als Einschlag erst nach Texteinblendung.
- **Fehlend (höchster Impact):** Das in `immune_s3` textlich beschriebene **Bürogebäude mit Blaulicht**. Der Screen sagt „Unten im Bild: …" und zeigt nichts. Entweder Asset-Load fehlerhaft oder Asset nie erstellt — das ist der emotionale Schlusspunkt des Endings und fehlt komplett. Gleiches vermutlich für `exposed_s3` (nicht übermittelt).
- **Fehlend:** Skalenreferenz für den Wahlabend-Balken (Was heißt 15,3 %? Wovon?). Eine minimale Achsenbeschriftung oder ein Vergleichswert würde die Grafik von Deko zu Information heben.
- **Kanten/Schärfe:** Die Pixeltypografie ist sauber gerendert, keine unschönen Skalierungsartefakte erkennbar. Der Balken wirkt dagegen weich/geglättet gegenüber der scharfen Typo — leicht aus der Familie fallend.

## 4. Raster & Rhythmus

- **Drei verschiedene linke Kanten im selben Panel:** Überschrift (~x=310), Bullets (~x=315), Balkenblock (~x=400). Innerhalb eines Rahmens braucht es **einen** Inhalts-Spiegel — Empfehlung: linker Innenrand bei ~12 % der Rahmenbreite, alles daran ausrichten.
- **Vertikale Verteilung im TV-Rahmen:** Inhalt besetzt nur die mittlere ~20 %; oben und unten je große tote Zonen. Entweder wirklich zentrieren oder die Freiflächen mit Funktion füllen (Kopfband oben, Legende/Faktencheck unten).
- **Footer-Verbund auf s3-Screens:** Vier zentrierte Blöcke (Narration, Badge-Reihe 1, Badge-Reihe 2, Button) mit wechselnden Breiten — keine gemeinsame Kante, kein Raster. Ein einfaches linkbündiges Spaltenraster oder ein 3+3-Badge-Grid löst das.
- **Unruhe:** Die 4+2-Badge-Anordnung ist die größte Unruhequelle außerhalb des Stempels.
- **Trennung:** Zwischen TV-Rahmen und Footer-Zone fehlt eine klare Fuge — die Narrations-Card (siehe oben) wäre zugleich Trennelement.
- **Konsistenz über das Set:** s0-Karten, s1-, s2-Screens sind template-stabil — das ist gut. Der Bruch entsteht ausschließlich durch das Clipping und die Footer-Blöcke auf s3.

## 5. Lesbarkeit

- **Durchstreichungen** (`immune_s2`, `immune_s3`, `exposed_s2`): Zu dünn, zu dunkel — die zentrale Aussage „diese Schlagzeilen sind widerlegt" ist visuell fast verloren. Dringend verstärken.
- **Überschrift „IHRE SCHLAGZEILEN – GEPRÜFT"**: Rote Tinte auf dunkelrotem Grund — Grenzbereich. Zweimal hinsehen war nötig.
- **LIVE-/SONDERSENDUNG-Badge**: Winzig, Amber-auf-Dunkelblau bzw. Rot-auf-Dunkelrot — Zustandsinfo geht verloren.
- **Milieu-Badge-Icons (▲/■)**: Unterhalb der Lesbarkeitsgrenze, wirken wie Defekte im Text.
- **„Klicken zum Fortfahren"**: Auf s0/s1/s2 als Text, auf s3 als WEITER-Button — zwei unterschiedliche Interaktionsmodelle für dieselbe Aktion in einem Ablauf. Vereinheitlichen (Button überall oder Klick-fläche überall).
- **Prozentwert „15.3 %"**: Weiß auf Dunkelblau ist ok, aber die Entfernung zum Balken entwertet ihn semantisch.
- Positiv: Ticker-Text, Bullet-Liste und Titelkarten-Typo sind klar und ausreichend groß.

## 6. Die drei wirksamsten Änderungen

1. **Stempel umpositionieren + Durchstreichungen verstärken** (`*_s2` aller drei Pfade): Reiner CSS-/Positions-Input (Stempel in die untere rechte Leerfläche, Strichstärke 2 px, hellere Tinte), wenige Minuten Aufwand — rettet aber die zentrale Aussage von drei von vier Steps pro Pfad.
2. **Höhen-Anker für alle s3-Screens fixieren** (`timeout_s3`, `immune_s3`, vermutlich `exposed_s3`): Rahmenoberkante an den Viewport nageln, Footer als reservierte Zone — behebt das auffälligste Layoutbruch-Symptom des Sets und skaliert stabil für jeden künftigen Nachsatz-Text.
3. **WEITER-Buttons auf `stampCtaStyle` umstellen** (alle s3-Screens): Ein Token-Austausch, stellt die Token-Konformität her (Rot-Reservierung) und macht die Primäraktion über alle Endings hinweg wiedererkennbar.

Knapp dahinter, aber mit größerem Aufwand: das fehlende Bürogebäude-Asset in `immune_s3` liefern — inhaltlich der wichtigste einzelne Befund, aber abhängig davon, ob das Asset existiert.

## 7. Blinde Flecken

- **`fixture_wahlabend_exposed_s3.png` fehlt als Bild** — der Abschluss des Exposed-Pfads ist unbewertet; bitte nachreichen.
- **Animationen:** Stempel-Einschlag (Aufschlag, Scale, Sound?), Balken-Füllanimation, Ticker-Laufgeschwindigkeit, Trigger eines Alarms beim Überschreiten der Schwelle — alles statisch nicht prüfbar.
- **Hover/Fokus-Zustände** von WEITER und den Milieu-Badges; ob „Klicken zum Fortfahren" eine Vollflächen-Hitbox hat.
- **Übergänge** zwischen den Steps (Cut, Fade, Scanline-Wipe?) — für den TV-Kontext entscheidend.
- **Verhalten bei kleinen Viewports/Höhenskalierung:** Das Clipping auf s3 deutet darauf hin, dass die Screens bei niedriger Fensterhöhe ohnehin brechen — ein Screenshot bei z. B. 1280×720 wäre hilfreich.
- **Barrierefreiheit live:** Ob die Durchstreichungen zusätzlich per Icon/Glyph (✕) markiert sind — für Farbenblindheit relevant, im Standbild nicht erkennbar.
- **Audio-Cues** (Stempel-Sound, Alarmton bei Schwelle) — außerhalb des Sichtbaren, aber für die Inszenierung zentral.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
