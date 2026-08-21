# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — Bündel „office"

**Modell:** `stealth/ox-alpha` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-21
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-21T16:57:37.470Z · **Dauer:** 185.2 s
**Nutzung:** 7.238 Prompt + 4.162 Antwort Tokens · **Kosten:** $0.00 (gratis) · **Anbieter-Datensammlung:** ausgeschlossen (deny)

> ⚠️ **Wie das zu lesen ist:** Ein *fremdes* Modell hat einen **kuratierten Ausschnitt**
> des Projekts gesehen — nicht das laufende Spiel und nicht das ganze Repository. Es kann
> daher weder Laufzeitverhalten prüfen noch `file:line`-Belege verifizieren. Befunde sind
> **Hypothesen**, die vor dem Umsetzen am Code/an den Daten gegenzuprüfen sind. Die
> kanonische Wahrheit bleibt [`docs/VISION_LOCK.md`](../VISION_LOCK.md) bzw. die Spieldaten.

## Gestellte Frage

Sieh dir die beigefügten Screenshots des laufenden Spiels an und mache einen UX/UI-Durchgang. Die Optik soll eine Behörden-/Papierwelt sein (Stil-Anker und Farbtoken liegen bei). Sag mir: Wo führt das Bild den Blick falsch, welche Grafiken sitzen an der falschen Stelle oder in der falschen Größe, wo stimmen Abstände und Ausrichtung nicht, und welche drei Änderungen bringen am meisten? Sei so konkret, dass man es direkt umsetzen kann.

## Dieser Durchgang: Bündel „office" (1 Screenshots)

Das siehst du, in dieser Reihenfolge:
- office.png — Spielerbüro (PlayerOfficeView) mit Hotspots/Einsteiger-Hinweisen

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
| 🖼 Bild | `office.png` | `desinformation-network/runs/visual-review/latest/shots/office.png` | 379 kB |

---

## Antwort des Modells

# UX/UI-Durchgang: Bündel „office"

## 1. Erster Eindruck

**office.png** — Das Bild zeigt nicht primär das Spielerbüro, sondern ein Entscheidungs-Modal („Die reale Vorlage"), das den Großteil der Fläche bedeckt und **oben wie unten über den Bildschirmrand hinausläuft**: Das rote Kopfband klebt ohne jeden Abstand an der Oberkante, und Option C wird mitten im Titel („… eine erfundene …") abgeschnitten. Das Auge landet zuerst auf dem Rot des Kopfbands — das ist als Einstieg korrekt gesetzt — springt aber sofort weiter zu den verstreuten roten Prozentwerten rechts neben den Options-Titeln, weil sie dasselbe Rot und ähnliche Größe nutzen. Der eigentliche Lesepfad (Kopfband → Frage → Option A → B → C) bricht bei C ab, weil die dritte Option unlesbar halb verschluckt ist. Die Büro-Szene dahinter ist so stark abgedunkelt und verdeckt, dass von der beschriebenen „Hotspots/Einsteiger-Hinweise"-Ebene nur der winzige „Verstanden"-Chip oben rechts übrig bleibt. Unten konkurrieren drei Elemente um dieselbe Kante: die schwebende Fußnote („Keine Option ist überall die beste…"), der News-Ticker und der rote FEIERABEND-Button — das wirkt wie drei unabhängige Schichten, die zufällig denselben Streifen belegen.

## 2. Konkrete Eingriffe je Screen (office.png)

- **Modal-Rahmen gesamt → oben und unten echten Rand geben: Kopfband erst unterhalb der Uhr-/Menü-Zeile beginnen (visuell eine Kopfzeilenhöhe Luft), unten mit sichtbarem Abschluss vor dem Ticker enden; der Inhalt darin wird scrollbar → aktuell wirkt das Modal wie ein zu großes Blatt auf zu kleinem Tisch, und Option C ist unlesbar.**
- **Options-Cards A/B/C → feste zweispaltige Statistik-Grids: die Prozentwerte (+X%) rechtsbündig auf einer gemeinsamen vertikalen Achse, die Labels „Risiko"/„Aufmerksamkeit" linksbündig darunter, beide Spalten über alle drei Cards auf identischer x-Position → derzeit schwimmen die Werte einzeln neben den Titeln; der entscheidende Vergleich (Risiko vs. Aufmerksamkeit) ist nur durch Hin-und-Her-Lesen möglich.**
- **Stat-Block vs. Titel-Baseline → die Prozentwerte auf die Cap-Höhe des Card-Titels ausrichten (gleiche Grundlinie wie „A · Verkürzen…"), nicht versetzt darüber schweben → aktuell entstehen pro Card zwei konkurrierende Leseanker auf einer Zeile.**
- **Fußnote „Keine Option ist überall die beste…" → als eigenständige, voll breite Fußleiste INS Modal-Frame integrieren (unterhalb des Scrollbereichs, gleiche Breite wie das Papierfeld, mit Trennlinie zum Inhalt) → jetzt liegt sie als schmaler Streifen ÜBER der abgeschnittenen Card C und ist weder klar Teil des Modals noch ein Toast.**
- **Badge-Chips („Zynismus ▲", „Polarisierung ▲") → aus der linken unteren Card-Ecke herauslösen und als Zeile direkt unter die „Technik:"-Zeile setzen, einheitlich linksbündig zur Card-Innenkante → aktuell kleben sie isoliert in der Ecke und hängen visuell zwischen Beschreibungstext und Card-Rand ohne Bezug zu beidem.**
- **FEIERABEND-Button unten rechts → während eines offenen Entscheidungs-Modals sperren (entsättigt, kein Rot, Cursor default) → er trägt dieselbe Alarm-Farbe wie das Kopfband und die Risiko-Werte und zieht den Blick in eine Aktion, die im Entscheidungs-Kontext falsch oder gar nicht verfügbar ist.**

## 3. Grafiken/Assets

- **Büro-Hintergrund (office.png, linke Bildhälfte):** Der Monitor oben links mit cyan-getöntem Screen passt zum Tech-Token der Stil-Vorgabe; das abstrakt-konstruktivistische Plakat rechts (rote/geometrische Fläche) entspricht der Vorgabe „geometrisch, ohne reale Symbole". Beide Assets tragen — sind aber durch die Abdunkelung und das Modal praktisch unsichtbar. Für die Bewertung der Büro-Szene selbst brauche ich eine Aufnahme ohne Modal.
- **Kopfband-Grafik:** Das Rot ist flächig und sauber, aber das Band läuft bündig bis zum oberen Bildrand — als Asset wirkt es wie angeschnitten statt wie aufgelegt. Ein Papier-Modal sollte auch oben Papier zeigen oder bewusst als „heruntergezogenes Dokument" komponiert sein; aktuell ist es neither-nor.
- **Card-Rahmen:** Die doppelten dunklen Umrandungen der Options-Cards sind konsistent und gut — die stärkste grafische Leistung im Bild.
- **Fehlend:** Dem Modal fehlt jede körperliche Metapher der Papierwelt — keine Lochung, keine Aktentab, keine Stempel-Kante. Gerade hier (Entscheidung = Akte) würde ein einzelnes Stempel-Motiv am Kopfbandrand oder ein Aktendeckel-Rand das Theme am meisten tragen, ohne neue Farbe einzuführen.
- **Skalierung:** Die Pixel-Schrift im Body wirkt gegenüber den hartkantigen Card-Rahmen leicht weichgezeichnet/unscharf — prüfen, ob hier non-integer Skalierung vorliegt.

## 4. Raster & Rhythmus

- **Vertikal:** Das Modal kennt keinen Außenabstand — oben 0 px, unten überlaufend. Damit fehlt die wichtigste räumliche Information: Wo hört die Welt auf, wo fängt das Dokument an?
- **Horizontal:** Das Modal ist annähernd mittig (~45 % Bildbreite), das ist vertretbar; problematischer ist die rechte Kante: Uhr, Menü-Icons, die Buchstaben-Buttons (M/N/…) und der „Verstanden"-Chip bilden eine zweite, eigene Spalte am rechten Rand, die vom Modal-Schatten halb verschluckt wird. Entweder die HUD-Spalte vollständig außerhalb des Modal-Schattens halten oder komplett darunter legen — der jetzige Halbschatten erzeugt Unruhe.
- **Innenrhythmus der Cards:** Abstand Titel → Stat-Block → Technik-Zeile → Beschreibung → Badge ist ungleichmäßig; besonders der Sprung Beschreibung → Badge ist größer als Badge → Card-Unterkante, wodurch die Badge-Zeile „verwaist". Gleichmäßiges Innenraster (z. B. vier gleich große vertikale Abstände pro Card) würde genügen.
- **Untere Kante:** Ticker, Modal-Fußnote, PUBLIKUM-Chip und FEIERABEND teilen sich einen ~40 px-Streifen ohne gemeinsame Grundlinie — vier Baselines auf einer Höhe ist die unruhigste Zone des Screens.
- **Tote Fläche:** Die linke Bildhälfte unter dem Monitor ist vollständig schwarz und trägt nichts; wenn das Modal so viel Platz braucht, wäre entweder ein schmaleres Modal mit mehr Bürosicht oder eine bewusst stärker abgedunkelte Vollflächen-Abblendung (dann aber ohne sichtbare Bürofetzen) stimmiger als der aktuelle Zwischenzustand.

## 5. Lesbarkeit

- **Option C (office.png):** Unlesbar abgeschnitten — härtester Lesbarkeitsfehler des Screens. Man muss raten, was die dritte Option kostet/nützt.
- **Body-Text:** Dunkle Tinte auf Papier ist kontraststark und gut; die Zeilenlänge ist mit ~60–70 Zeichen im grünen Bereich. Kein Doppelblick nötig.
- **„Technik: Denkontextualisierung" / „Technik: Amplifikation":** Deutlich kleiner und gedämpfter als der Fließtext — ich musste zweimal hinsehen, um zu erkennen, dass es ein Label und kein Fortsetzungssatz ist. Either größer oder mit klarem Präfix-Stil (z. B. gesperrt/versalien).
- **Prozentwerte + Labels:** Rot auf Papier funktioniert, aber „+4 % Risiko" in zwei Zeilen gebrochen (Wert über Label) mit unterschiedlicher Ausrichtung pro Card erschwert den Vergleich — das ist ein Scan-Problem, kein Kontrastproblem.
- **Ticker unten links („STANDBY MINISTERIUM SENDET…"):** Sehr klein und niedrigkontrastig auf Dunkel — vermutlich gewollt ambient, aber es kollidiert räumlich mit der Modal-Fußnote; beim Überfliegen verschmelzen beide zu einem Textband.
- **Zustände:** Kein erkennbarer Hover-/Auswahl-Zustand auf den Cards sichtbar (statisch schwer zu beurteilen — siehe Blinde Flecken). Die drei Cards wirken optisch gleichwertig; falls es eine empfohlene oder gesperrte Option gibt, ist das hier nicht ablesbar.

## 6. Die drei wirksamsten Änderungen

1. **Modal vertikal einfassen und Option C lesbar machen** (echter Innen-Scrollbereich mit sichtbarem Abschluss oben/unten, Kopfband unterhalb der HUD-Zeile) — eine unlesbare Entscheidungsoption zerstört die Kernfunktion dieses Screens mehr als jedes Styling-Detail.
2. **Einheitliches Stat-Grid über alle drei Cards** (rechtsbündige Werte, gemeinsame Spaltenachse, Baseline mit dem Titel) — der Risiko/Aufmerksamkeit-Vergleich IST die Entscheidung; heute muss der Spieler dafür dreimal hin- und herspringen.
3. **Die untere Kante aufräumen:** Fußnote fest ins Modal-Frame integrieren, FEIERABEND während der Entscheidung entsättigen/sperren, Ticker davon getrennt halten — drei Elemente löschen den Konflikt auf dem wichtigsten Interaktionsstreifen und kosten fast keine Designarbeit.

## 7. Blinde Flecken

- **Hover-/Fokus-Zustände der Options-Cards:** Sind sie klickbar markiert? Gibt es einen ausgewählten Zustand vor dem Bestätigen?
- **Das Büro selbst:** Die Manifest-Beschreibung nennt „Hotspots/Einsteiger-Hinweise" — davon ist außer dem „Verstanden"-Chip nichts sichtbar. Ich brauche eine Aufnahme von PlayerOfficeView **ohne** Entscheidungs-Modal, um Hotspot-Platzierung, -Größe und Blickführung im Raum zu beurteilen.
- **Scroll-Verhalten:** Ob das Modal scrollt oder ob Option C einfach fehlt, ist im Standbild nicht unterscheidbar — ein Screen nach dem Scrollen wäre hilfreich.
- **FEIERABEND-Zustand:** Gesperrt, aktiv oder irreführend verfügbar? Ein Shot mit geöffnetem Modal UND deaktiviertem Button würde Klarheit schaffen.
- **Nach dem Klick:** Wie sieht die Card im gewählten/zurückgewiesenen Zustand aus (Stempel? Durchgestrichen?) — für die Papier-Metapher der entscheidende Moment.
- **Auflösung/Skalierung:** Die leichte Unschärfe der Pixelschrift lässt sich im Einzelbild nicht sicher von Render-Skalierung unterscheiden; eine native-Auflösungs-Aufnahme würde das klären.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
