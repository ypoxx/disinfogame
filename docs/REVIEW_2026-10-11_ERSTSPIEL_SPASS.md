# 🎮 REVIEW 2026-10-11: Erstspieler-Durchgang — wo der Spaß hängt und wie er kommt

**Anlass (Owner, sinngemäß):** „Ich habe das Spiel nie durchgespielt. Vielleicht ist es zu
kompliziert, hat zu viele Ebenen oder ist optisch nicht zugänglich genug. Gib mir Ideen, damit
daraus ein komplettes, wunderschönes, ungewöhnliches und richtig gut spielbares Spiel wird, das
man sofort versteht und das süchtig macht — im positiven Sinn."

**Methode:** Das Spiel im Browser als neuer Spieler gespielt (Build `6aab7ec`, 1440×900,
Titel → Personalakte → Ankunft → Akte → Tag 1–2 → Büro → Terminal → Korkbrett → Berater →
Lagebericht → Krise), dazu die Wahlabend-Szene über `vqa.html` angesehen und die Engine mit
fünf Spielweisen simuliert (je 12 Partien, deterministisch, gleicher Code wie
`tests/winnable-and-losable.test.ts`). Eine Bildtafel mit Screenshots und Grafik wurde dem Owner
im Chat geschickt.

---

## 1. Kurzfassung

1. **Idee, Welt und Grafik sind stark.** Das Gebäude im Querschnitt, die Räume, Porträts und
   das Publikums-Wohnzimmer haben echten MadTV-Charme. Das Zielbild („Rennen um Westunion":
   Sonntagsfrage gegen Abwehr) ist genau der richtige Kern.
2. **Das Rennen ist im Spiel nicht zu spüren.** Die zwei Läufer sind standardmäßig
   ausgeblendet, Karten und Ergebnisse sprechen über andere Zahlen, und die Sonntagsfrage
   bewegt sich nach einer Aktion oft gar nicht.
3. **Entscheidungen sind egal (gemessen).** Zufälliges Klicken gewinnt 12 von 12 Partien,
   im Schnitt an **Tag 14 von 40**. Der Wahlabend, Akt 2 und 3, die 5-Tage-Umfrage und die
   Nachspielzeit kommen in einer normalen Partie gar nicht vor.
4. **Zu viele Ebenen.** Rund 25 Bildschirme und Panels und rund 12 sichtbare Kennzahlen,
   dazu zwei Planungs-Werkzeuge für eine einzige Entscheidung.
5. **Das Beste ist versteckt, das Finale ist der ärmste Bildschirm.**

Die gute Nachricht: Fast alles, was fehlt, ist schon gebaut oder beschlossen. Es muss
**weggelassen, zusammengelegt und nach vorn geholt** werden. Neu bauen muss man wenig.

---

## 2. Was trägt (behalten, ausbauen)

| Stärke | Warum sie Gold ist |
|---|---|
| Gebäude-Querschnitt mit laufenden Figuren | Sofortiger Wiedererkennungswert (MadTV/TV Tower); macht neugierig |
| Raum-Nahsichten + Porträts | Eigener, kohärenter Stil; trägt Figuren und Humor |
| Publikums-Wohnzimmer + TV | **Die** emotionale Belohnung: man sieht, was die eigene Lüge mit Menschen macht |
| Zielbild „Rennen" (Plague-Inc-Prinzip) | Klarste denkbare Spielidee: zwei Balken, ein Stichtag |
| Maschen-Atlas, Frische-Stempel, Gegenmaßnahmen | Glaubwürdiger Lerninhalt, der *mechanisch* wirkt (Prebunking-Logik) |
| Inhalt: ~96 Aktionen, 13 Episoden, Beats, NPC-Stimmen | Genug Stoff für mehrere Partien |
| Sim-Gates, deterministische Engine | Balance lässt sich messen statt raten |

---

## 3. Was den Spaß bremst — Befunde mit Beleg

### B1 · Das Rennen ist unsichtbar
- HUD standardmäßig **aus** (`StoryModeGame.tsx:431`, `useState(false)`). Nach dem Tutorial
  sieht man das Gebäude, eine Uhr und die Kürzel `KV MP AP KO IS`, aber kein Ziel und keine Zahl.
- Aktionskarten nennen Kosten, Risiko, Masche, Milieu-Frische und NPC-Bonus. **Was die Karte für
  die Sonntagsfrage bringt, steht nirgends.** Stattdessen z. B. „Informationslast ▲ ≈+1", ein
  Wert, den das Zielbild §6 gestrichen hat.
- Nach „Bot-Netzwerk aufbauen": Ergebnisfenster mit Budget, Kapazität, Risiko, Wirksamkeit
  50 %, Informationslast, Vertrauen und 8 Milieu-Stimmungen. Die **Sonntagsfrage bleibt bei
  9,0 %.**
- Ursache für „nichts bewegt sich": Die Sonntagsfrage ist `9 + Fortschritt(schwächste Achse) × 18`
  (`StoryEngineAdapter.ts:4991`, Min-Regel über drei Achsen). Eine Aktion auf eine der beiden
  stärkeren Achsen zeigt **null** Bewegung, und die Zahl kann sogar springen (Sim: 18,0 → 13,4 %
  in zwei Tagen). Der Spieler kann das nicht durchschauen.
- Der Lagebericht am Abend zeigt Risiko, Budget, Aufmerksamkeit, Deutungshoheit und 8 Balken,
  **aber keine Sonntagsfrage.**

### B2 · Sieg vor dem Wahltag → keine Spannung, keine Entscheidungen
- `VictorySystem.ts:77`: Sieg, **sobald** die Schwelle erreicht ist, an jedem Tag. Das Zielbild
  §4 sagt: „Am Wahltag hat die Sonntagsfrage die Schwelle erreicht".
- Messung (12 Partien je Spielweise, Kampagne 40 Tage, 5 Aktionen/Tag):

| Spielweise | Ergebnis | Spielende |
|---|---|---|
| Zufällig klicken, 5×/Tag | **12/12 Sieg** | Ø Tag 14 (10–18) |
| Zufällig klicken, nur 1×/Tag | 9/12 Sieg | Ø Tag 20 |
| „Gierig" (illegal zuerst) | 11/12 Sieg | Ø Tag 13 |
| Vorsichtig (geringstes Risiko) | 4/12 Sieg, 8× Abwehr | Ø Tag 29 |
| Nichts tun | 0/12, Wahltag verloren | Tag 40 |

  Das bestehende Gate bestätigt das (`winnable-and-losable.test.ts`: random 23/24). Es prüft
  nur „gewinnbar UND verlierbar", **nicht „Können zahlt sich aus"**. Darum blieb es grün.
- Folge: Uninformiertes Spiel ist die *beste* Strategie, Vorsicht wird bestraft. Der Spieler
  lernt nichts über Maschen-Rotation, Milieus oder Prebunking, weil er es nicht braucht.

### B3 · Zu viele Ebenen
- Planung läuft über drei Wege: Terminal → „Ausführen", **oder** Terminal → „Anheften" →
  Korkbrett → „Ausspielen", dazu Lagebild, Operations-Akte, Fokusgruppe, Maschen-Vortest,
  Newsroom, Methoden-Dossier und 5 Seitenleisten (N/S/P/M/E) sowie die Berater-Leiste.
- Zwei „Aktionswährungen" auf einmal: „Aktionen heute 5/5" (AP) **und** „Kapazität".
- Ein Tag hat drei Ende-Knöpfe: „PHASE BEENDEN", „FEIERABEND" und den automatischen Heimweg.
- 88 von 96 Aktionen liegen im „Archiv", 8 im Terminal, jede Karte etwa halbe Bildschirmhöhe,
  davon ein Drittel Wiederholung („Höhere Beziehung = größerer Rabatt (max. 30 %)").

### B4 · Das Beste ist versteckt
- Publikums-Wohnzimmer + TV nur auf Taste B. Das ist die stärkste Rückmeldung des Spiels, und
  man sieht sie nur, wenn man davon weiß.
- Büro-Ausgang ist eine unbeschriftete Glastür (Label nur beim Hover).
- Raum-Schilder sitzen auf der Etagen-Trennlinie. Man kann nicht sagen, zu welcher Etage sie
  gehören. Das Schild „Ihr Büro" ist nicht einmal klickbar (die Etage darüber fängt den Klick).
- Berater-Leiste: „Keine Empfehlungen" bei 4 von 5 NPCs. Die einzige Empfehlung lautet
  „Infrastruktur-Defizit: 5 Level. Upgrade empfohlen." Das ist Systemsprache statt Figur.

### B5 · Scheinwahlen und Fachjargon
- Tag 2, Fenster „KRISE · Influencer-Kontakt" (eigentlich eine Gelegenheit): Optionen für
  **400K** und **150K**, Kasse **138K**. Es bleibt nur „Ablehnen".
- „Phase beenden", „Frist: 3 Phasen", „Röhre aus", „AP", „Kapazität", „Deutungshoheit",
  `KV MP AP KO IS`.
- E19 (Rollen) ist noch offen: Der Kurator begrüßt den Spieler mit „Willkommen, Direktor",
  das Gebäude-Schild heißt „Direktor / Zentrale · Kurator".

### B6 · Das Finale ist der ärmste Bildschirm
- `WahlabendScene`: ein Balken auf dunklem Grund plus Textchips („Zornige jubelt"). Kein
  Studio, keine Wohnzimmer, keine Figuren. Ausgerechnet der Höhepunkt hat keine Pixel-Art.

### B7 · Der erste Aha-Moment fehlt
- Der vom Owner gewünschte und **freigegebene** Tag-0-Hoax (`IDEE_TAG0_HOAX_EXPERIMENT.md`,
  „Stadttauben sind Regierungsdrohnen") ist nicht gebaut. Die ersten Minuten sind:
  Porträt → Ankunft → Akte → Textwand → Terminal mit 8 dichten Karten.

### B8 · Kleinkram aus dem Durchgang
- Titelbildschirm: Knopf „NEUE MISSION" sitzt rechts versetzt, Untertitel liegt schwer lesbar
  über dem Hochhaus, und es fehlt ein Satz, der sagt, worum es geht.
- „NÄCHSTER TAG ▸" ist kein `button` (Tastatur/Screenreader, Playwright findet ihn nicht über die Rolle).
- Einmal reagierten an Tag 2 die Tasten A und T nicht mehr (H schon). In einem zweiten
  Durchgang lag es am offenen Krisenfenster. Der erste Fall ist **nicht abschließend geklärt**.

---

## 4. Nordstern: wie das Spiel sich anfühlen soll

> **„40 Tage bis zur Wahl. Du hast eine Lügenfabrik. Das Land hat Faktenchecker.
> Wer ist schneller?"**

Die Klassiker, die Spielern dabei einfallen sollen, und was wir von jedem nehmen:

| Klassiker | Was wir übernehmen |
|---|---|
| **Plague Inc.** | Das Rennen: Ausbreitung gegen Gegenmittel. Die „Weltkarte" sind bei uns die **8 Wohnzimmer**. |
| **MadTV / TV Tower** | Gebäude, Sendeplan, Quote, Zuschauer reagieren sichtbar. |
| **Papers Please** | Tagesrhythmus, wenige klare Entscheidungen pro Tag, leiser moralischer Beigeschmack, Regeln kommen Tag für Tag dazu. |
| **Into the Breach** | Der Gegner **kündigt seinen nächsten Zug an** (Morgen-TV: „Landeszentrale startet Prebunking gegen Gesundheits-Gerüchte"). Man plant dagegen. |
| **Slay the Spire / Balatro** | Wenige Karten auf der Hand, **Kombos**, die man über zwei Tage plant („Gerücht im Netz" + „Talkshow greift es auf" = Medienwelle). Daher kommt das „noch eine Runde"-Gefühl. |
| **Bad News** (Uni Cambridge) | Wissenschaftlich belegt: Wer selbst Fake News produziert, wird immuner gegen sie (Inokulation). Das adelt die Grundidee. |

**Sucht im guten Sinn** entsteht aus drei Dingen, die wir gezielt bauen:
1. **Sofortige, sichtbare Wirkung** jeder Entscheidung (TV-Bild, Wohnzimmer reagiert, Zahl zählt hoch).
2. **Echte Abwägung** mit kurzer Rückmeldeschleife (heute riskieren oder morgen kombinieren?).
3. **Ein Spannungsbogen mit Ziellinie**, die man *immer* erreicht: den Wahlabend.

---

## 5. Der Kern: „Ein Tag = eine Runde" (60–90 Sekunden)

1. **Morgen (5 s):** Das TV zeigt *eine* Weltnachricht (Gelegenheit) und *einen* angekündigten
   Gegenzug der Abwehr.
2. **Planen (30 s):** Auf der Hand liegen ~5 Karten (Maschen). 3 Plätze im Sendeplan. Karte auf ein
   Wohnzimmer ziehen → Vorschau mit **zwei kleinen Hinweisen** (E7): „Sonntagsfrage +0,4 bis +0,9"
   und „Lärm +3", dazu der Stempel FRISCH / BEKANNT / VERBRANNT.
3. **Senden (10 s, überspringbar):** Das TV zeigt die eigene Schlagzeile als Pixelbild, die
   Wohnzimmer reagieren, die Sonntagsfrage zählt hoch. Vielleicht stempelt eine Faktencheckerin
   „FALSCH" drüber, und die Abwehr tickt.
4. **Abend (5 s):** *Ein* Bild: zwei Läufer auf einer Bahn (Sonntagsfrage gegen Abwehr) plus ein
   Satz Folge. „Nächster Tag".
5. **Alle 5 Tage:** das Umfrage-Ritual im TV. **Tag 40:** immer der Wahlabend.

„Kühl quittieren" (E8) bleibt: Die Rückmeldung ist **stofflich** (Stempel, Schreibmaschine,
TV-Rauschen), nicht feiernd. Saftiges Feedback heißt nicht Konfetti.

---

## 6. Plan in drei Stufen

### Stufe 1 — „Das Rennen sichtbar machen" (Quick Wins, wenig Code)
1. HUD **standardmäßig an**, die zwei Läufer groß oben.
2. Jede Aktionskarte zeigt als oberste Zeile die erwartete Wirkung auf **Sonntagsfrage** und **Abwehr**.
3. Ergebnisfenster: zuerst Sonntagsfrage (zählt hoch) und Abwehr-Tick, die Buchhaltung eingeklappt.
4. Lagebericht beginnt mit dem Rennen („Sonntagsfrage 11,2 % (+0,8) · Abwehr 23 (+4)").
5. **Sieg nur am Wahltag** (`evaluateEnd`: Sieg = Auftrag erfüllt **und** Wahltag erreicht).
   Danach neu balancieren und das Gate um ein **Können-Band** erweitern: Zufall gewinnt ≤ 35 %,
   eine kluge Bot-Strategie (rotiert Maschen und Milieus) ≥ 70 %.
6. In den ersten 7 Tagen keine unbezahlbaren Optionen. Wenn das Geld fehlt, bietet Igor einen Kredit an.
7. Sprache: „Phase" → „Tag", ein Ende-Knopf „Feierabend", Rollen-Fix E19
   (Spieler = „Abteilungsleiter/in", Volkov = „Kurator").
8. Etagen-Schilder an die Tür, Büro-Ausgang sichtbar, Publikums-Leiste standardmäßig offen.

### Stufe 2 — „Ein Tag = eine Runde" (Kern-Umbau)
1. **Ein** Sendeplan statt Terminal + Korkbrett: 3 Plätze pro Tag, Hand mit ~5 Karten aus dem
   freigeschalteten Stapel. Die Narrativ-Stränge laufen als Karten-Ketten weiter.
2. **Wohnzimmer als Landkarte:** Die Sonntagsfrage ergibt sich sichtbar aus den 8 Milieus
   (Kipp-Punkt je Wohnzimmer → Parteifahne im Fenster → Sprung). Die Min-Regel über drei
   unsichtbare Achsen entfällt oder läuft intern.
3. Morgen-TV kündigt den Abwehr-Zug an (Into-the-Breach-Prinzip; CountermeasureSystem ist da).
4. Kombos sichtbar planen (StoryComboSystem ist da).
5. Kampagne kürzer und dichter: ~20–25 Tage × 3 Aktionen statt 40 × 5 (≈ 60 statt 200
   Entscheidungen, eine Partie ≈ 45–60 min).
6. **Progressive Freischaltung:** Tag 1–3 nur Sendeplan + TV. Danach kommen NPC-Spezialaktionen,
   ab Woche 2 Kompromat/Operations-Akte, später das Testlabor (Fokusgruppe + Vortest +
   Zielgruppen-Analyse in **einem** Raum).
7. **Tag-0-Hoax** als Einstieg (Bauplan liegt fertig vor).

### Stufe 3 — „Finale und Wiederspielwert"
1. Wahlabend mit voller Pixel-Art: Studio, Hochrechnung, Schnitt durch die 8 Wohnzimmer,
   Anruf des Kurators, Pförtner auf dem Heimweg (Zielbild §9 ist fertig geschrieben).
2. End-Report mit den zwei Rennkurven (`laeuferHistorie` existiert) und dem Satz
   „Kein einziger Schuss".
3. Wiederspielen: zufällige Ausgangslage je Partie (schwaches Milieu, Weltereignisse),
   Schwierigkeitsgrade, freischaltbare Maschen zwischen Partien, später „Keil" und „Zweifel"
   als eigene Kampagnen.

### Arbeitsweise (genauso wichtig)
- **Stopp für neue Systeme und neue Konzept-Dokumente**, bis Stufe 2 steht. Der Engpass ist
  nicht Qualität im Detail, sondern Spaß im Kern.
- **Fünf echte Testspieler** pro Stufe: stumm zuschauen, laut denken lassen. Gemessen werden
  drei Dinge: Zeit bis zum ersten Aha (< 2 min), Anteil, der bis zum Wahlabend spielt, und
  „Würdest du nochmal spielen?".

---

## 7. Fragen an den Owner (Antwort gern per Nummer)

| # | Frage | Empfehlung |
|---|---|---|
| F1 | Sieg **nur am Wahlabend** (nicht schon bei Erreichen der Schwelle)? | Ja |
| F2 | Kampagne kürzer: ~20–25 Tage × 3 Aktionen statt 40 × 5? | Ja |
| F3 | Terminal + Korkbrett zu **einem** Sendeplan verschmelzen? | Ja |
| F4 | Sonntagsfrage sichtbar aus den 8 Wohnzimmern („Milieus kippen") statt aus drei unsichtbaren Achsen? | Ja |
| F5 | Stopp für neue Systeme/Docs, bis Stufe 2 spielbar ist? | Ja |
| F6 | Mit Stufe 1 sofort anfangen? | Ja, Punkt 1–5 zuerst |
