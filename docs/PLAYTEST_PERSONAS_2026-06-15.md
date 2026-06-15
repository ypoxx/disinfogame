**Status:** Referenz (Playtest-Bericht)
**Aktualisiert:** 2026-06-15
**Scope:** Story (Frühphasen — Begrüßung bis Runde 2)
**Build:** v0.9.0 · f6f7659
**Methode:** Echte Browser-Sitzung (Playwright/Chromium), reale Screenshots + DOM + Quellcode

# Usability-Simulation: 3 Personas durch die Frühphasen

> **Zweck (lt. Auftrag):** Aus Spielersicht prüfen, ob die Funktionen für Spieler Sinn ergeben,
> schlüssig ineinandergreifen, Spaß und Spielfluss tragen und die Kriterien eines „guten Spiels"
> (Will-Wright-Linse) erfüllen. Grundlegende Konzepte dürfen infrage gestellt werden.

---

## 0. Methode & Anti-Erfindungs-Sicherung

Damit hier **nichts erfunden** wird, ist jede Beobachtung an reale Artefakte gekoppelt:

1. **Echtes Spiel, nicht simuliert im Kopf.** Das Spiel lief real im Browser (Vite-Dev,
   `localhost:5173`, Build `f6f7659`). Ein Steuer-Daemon (Playwright/Chromium) hat geklickt,
   getippt, gewartet — und nach **jedem** Schritt einen **echten Screenshot** plus das sichtbare
   DOM (Texte, klickbare Elemente, Konsolen-Logs) abgelegt.
2. **Zwei Beobachtungsebenen je Persona.**
   - **Beobachtung 1 — Lautes Denken (subjektiv, in der Rolle):** wie die Persona *erlebt*,
     entdeckt, sich freut/ärgert.
   - **Beobachtung 2 — Gegenprobe (objektiv):** Jede auffällige Reaktion wird gegen das reale
     Artefakt geprüft und etikettiert:
     `■ OBJEKTIV` (durch UI/Code belegbar, mit Quelle) ·
     `□ SUBJEKTIV` (persona-/geschmacksabhängig, kein Defekt) ·
     `⚠ ARTEFAKT-KORRIGIERT` (eine starke Reaktion aus Beob. 1, die die Gegenprobe relativiert
     oder widerlegt — genau der Fall, den der Auftrag absichern wollte).
3. **Selbstkorrektur protokolliert.** Ein markanter Fall: Beob. 1 hielt den „Phase beenden"-Knopf
   für *kaputt*. Die Gegenprobe (Quellcode + längeres Warten) zeigte: **nicht kaputt**, sondern
   ~6 s Heimweg-Animation **ohne jede Rückmeldung** — die Fehlannahme war selbst ein Symptom des
   echten Defekts (fehlendes Feedback). Das ist dokumentiert statt geglättet.

**Belegbasis:** 20 reale Screenshots vom Begrüßungsbildschirm bis Tag 2 (Morgenbriefing),
plus Quell-Verifikation der Zeit-/Phasen-Mechanik (`dayClockStore.ts`, `useStoryGameState.ts`,
`StoryModeGame.tsx`, `BuildingView.tsx`, `StoryEngineAdapter.ts`).

---

## 1. Der reale Frühspiel-Pfad (gemeinsame Faktenbasis)

So sieht der Pfad objektiv aus (alles verifiziert):

| # | Screen | Kernfunktion | Belegte Beobachtung |
|---|---|---|---|
| 1 | **Begrüßung** „OPERATION: WESTUNION" | Titel, „▶ NEUE MISSION", Ton-Toggle, Bildungs-Disclaimer | Klare Haupt-CTA; Titel/Untertitel + Disclaimer **kontrastarm** über dem Gebäude |
| 2 | **Personalakte** | Porträt (6) + Name | Name-Feld **vorbelegt mit „Direktor"** (= zugleich NPC-Titel) |
| 3 | **Ankunft** (Gebäude-Querschnitt) | Avatar in der Lobby, Pförtner, „ÜBERSPRINGEN" | Atmosphärisch; Etagen klein/dicht |
| 4 | **Direktor-Intro** | Mission: „Westunion destabilisieren … 10 Jahre" | Starke Inszenierung; Dialogbox **verdeckt das Porträt** fast ganz |
| 5 | **Auftrag-Wahl** | Keil / Wahl / Zweifel + Barometer | Framing top: „Vertrauen = Mittel, Auftrag = Ziel". „Beginnen"-Link klein/kontrastarm |
| 6 | **Gebäude (frei)** | Räume klicken (viele gesperrt), Berater-Leiste D/M/A/K/I, Queue-Panel | Nach Auftrag **keine gerichtete Führung** mehr — nur „Wähle Aktionen im Terminal" |
| 7 | **Büro** | Hotspots + Coachmarks ①②③ (Aktionen/Tafel/Lagebild) | Gute Lern-Gerüste; Hotspot-Labels überlappen |
| 8 | **Aktions-Terminal** | 7 Aktionen, Filter LEGAL/GRAU/ILLEGAL, AUSFÜHREN / + EINREIHEN | Dichtes Rechts-Overlay, eine Karte pro Sicht |
| 9 | **Aktions-Ergebnis** | Broadcast ON AIR + Publikumsreaktion + Marina-Zeile + Modal | Reiche Mikro-Rückmeldung; **zwei** Defekte (s. u.) |
| 10 | **HUD** | Jahr/Monat, AP 5, Budget, Kapazität, Risiko, Moral. Last; GESELLSCHAFT (4 Werte); Ziel | Viel Buchhaltung; zwei „Ende"-Knöpfe |
| 11 | **Narrativ-Tafel** | Kampagnen-Planer: Spuren A/B, **~100 Maßnahmen** nach Büro | Massiver Katalog-Dump; zweite Aktionsfläche |
| 12 | **Lagebericht (Tag-Ende)** | „Was wir ausspielten", 8 Publikumssegmente + Stimmung, Gegenseite, Deutungshoheit-Balken | Schöne Runden-Auflösung — erscheint aber **erst nach ~6 s stiller Heimweg-Animation** |
| 13 | **Morgenbriefing (ab Tag 2)** | Direktor gibt **konkreten** nächsten Schritt | Gute Führung — **fehlt aber an Tag 1** |

**Verifizierte Mechanik-Fakten (Quelle = Code/HUD, nicht Vermutung):**
- **Zeitmodell vierfach überlagert:** Echtzeit-loser Tages-Takt 09:00–18:00 (Aktion = 90 min,
  Dialog = 30, Laufen 10/Etage, Fahrstuhl 5, Tür 2 — `dayClockStore.ts`) **+** AP (5/Phase) **+**
  Phase = Monat **+** narrative „Jahre 1–10".
- **5 AP × 90 min = 450 min = 13:30.** Ein Tag erreicht durch Aktionen **nie** 18:00 →
  der **manuelle** „Feierabend/Phase beenden" ist praktisch der **einzige** Tageswechsel-Auslöser.
- **„FEIERABEND →" (Büro) = „PHASE BEENDEN →" (HUD) = derselbe Handler** `requestEndDay`
  (`StoryModeGame.tsx`). Er schaltet auf Gebäudeansicht, setzt `walkHome=true`, lässt den Avatar zur
  Lobby laufen und zeigt **erst nach `onArrivedHome`** den Lagebericht. `requestEndDay` bricht ab,
  solange `walkHome` läuft → **wiederholtes Klicken ist ein stiller No-Op.**
- **Budget passiv:** zwischen Runden +5 K (150→155 K verifiziert).
- **Loop schließt:** Tag 1 → Lagebericht → „Nächster Tag" → Tag 2 (FEB, Phase 2), AP-Reset,
  Berater-Empfehlungen neu, Morgenbriefing. Mehrere Runden sind erreichbar.

---

## 2. Die drei Personas

| | A — Lena (19) | B — Marcus (34) | C — Dr. Sabine (47) |
|---|---|---|---|
| **Linse** | Entdeckbarkeit (Kaltstart) | Systeme / Spaß / Meisterung | Zweck / Ethik / Bildung |
| **Profil** | Casual/Narrative-Gamerin (Sims, Cozy). **Weiß nichts** über Spiel & Thema. Ungeduldig, lernt durch Klicken, überspringt Text. | Strategie-/Management-Sim-Veteran (Frostpunk, Plague Inc., Papers Please, Tropico). Sucht Loop, Hebel, Feedback, Siegbedingung. | Medienkompetenz-Pädagogin, Thema tief vertraut, **keine** Gamerin. Prüft Verantwortung, Lerneffekt, Tonalität. |
| **Frage** | „Verstehe ich überhaupt, worum's geht — und was ich tun soll?" | „Greifen die Systeme sauber ineinander? Wo ist mein Optimier-Loop?" | „Darf/soll man das so spielen? Lerne ich etwas — oder wird die Methode verharmlost?" |

---

## 3. Persona A — Lena (die Ahnungslose)

### Beobachtung 1 — Lautes Denken

> **(Begrüßung)** „Okay… *Operation Westunion*. Hübsches Bild, so'n DDR-mäßiger Turm bei Nacht.
> Der Titel ist halb im Gebäude, kann ich kaum lesen. Egal — großer roter Knopf *Neue Mission*,
> da geh ich drauf. Der kleine Text unten? Lese ich nicht, ist eh dunkel."
>
> **(Personalakte)** „Oh, ich darf mir 'n Gesicht aussuchen — nice, wie bei den Sims. Name ist
> schon ausgefüllt: *Direktor*. Heiß ich so? Bin ich der Boss? Lass ich mal stehen… ne, ich schreib
> *Lena* rein. *Mission beginnen.*"
>
> **(Ankunft + Direktor)** „Da läuft so'n Männchen rein. Schick. … *Sie sollen Westunion
> destabilisieren, Sie haben 10 Jahre.* Hä, destabilisieren? Bin ich die Böse? … Jetzt soll ich
> ein *Ziel* wählen: Keil, Wahl, Zweifel. Was ist der Unterschied? Ich nehm einfach das mit dem
> roten Rand, *Der Keil*, das ist wohl das Anfänger-Ding."
>
> **(Gebäude)** „Und jetzt? Ich steh in so'm Haus mit vielen Räumen, die meisten sind grau/aus.
> Rechts so kleine Köpfe. Unten gelb *Aktionen-Warteschlange — wähle Aktionen im Terminal*. Welches
> Terminal?? … Ich klick mal Räume an. *Mein Büro*, ja."
>
> **(Büro + Terminal)** „Ah, kleine Zahlen ①②③, soll ich der Reihe nach. *Aktionen planen* — da
> ist ein Computer. Klick. … Liste von Karten: *Zielgruppe analysieren, 3K, legal.* Versteh ich:
> Daten sammeln. *Ausführen.*"
>
> **(Ergebnis)** „Oh! Da kommt was im Fernsehen, *Zielgruppe durchleuchtet*, Quote 15 %, und unten
> ein Publikum: *Die lügen uns alle an!* — ha, witzig. Und so'ne Frau, Marina, sagt was. … Moment:
> *Budget +3K* in grün? Hab ich Geld *bekommen*? Dachte das kostet was. … *Verstanden.* … Och, jetzt
> redet Marina nochmal dasselbe in 'ner zweiten Box. *Weiter.*"
>
> **(Orientierung)** „Und jetzt? Ich hab… eine Sache gemacht. Was bringt mich zum Ziel? Ich seh
> *Polaris. 25*, *Vertrauen 100* — soll das hoch oder runter? Keine Ahnung. Ich klick mal
> *Phase beenden*… (5 s) … nichts passiert. Nochmal. (nichts) Ist das kaputt?? … oh, jetzt: ein
> Bericht, *Lagebericht Tag 1*, *ein stiller Tag*. Naja. *Nächster Tag.*"

### Beobachtung 2 — Gegenprobe

- **„Titel/Disclaimer kaum lesbar"** → `■ OBJEKTIV`. Screenshot 01: Titel überlagert die hellen
  Fenster, der Bildungs-Disclaimer ist dunkelgelb auf dunkel. Kontrast real zu niedrig.
- **„Heiß ich Direktor? Bin ich der Boss?"** → `■ OBJEKTIV`. Das Namensfeld ist faktisch mit
  „Direktor" vorbelegt (Screenshot 02), während wenig später **„Direktor Volkov"** als Chef
  auftritt → echte Rollen-/Namensverwirrung, kein Geschmack.
- **„Welches Terminal?"** → `■ OBJEKTIV`. Nach der Auftragswahl gibt es an Tag 1 **keine** gerichtete
  Führung; der einzige Hinweis ist „Wähle Aktionen im Terminal" (Queue-Panel), ohne zu zeigen, *wo*.
  Belegt durch die fehlende Tagesführung (Morgenbriefing existiert erst ab Tag 2, Screenshot 13).
- **„Budget +3K, hab ich Geld bekommen?"** → `■ OBJEKTIV (Bug)`. Modal zeigt „Budget: +$3K" grün
  (Screenshot 09); HUD-Budget fällt real 150→147 K (Screenshot 10). Vorzeichen/Farbe irreführend.
- **„Marina sagt dasselbe zweimal"** → `■ OBJEKTIV`. Reaktion erscheint sowohl im Modal-Block
  „NPC-REAKTIONEN" als auch in einer separaten Dialogbox → doppelt, zwei Bestätigungen pro Aktion.
- **„Soll Polaris/Vertrauen hoch oder runter?"** → `■ OBJEKTIV`. Die Aktionskarte nennt als Wirkung
  nur „1 NPC-Bonus" (Screenshot 08); kein sichtbarer Bezug zum Barometer des Auftrags. Ziel-Richtung
  ist nirgends erklärt.
- **„Ist das kaputt??"** → `⚠ ARTEFAKT-KORRIGIERT`. Subjektiv „kaputt", objektiv: `requestEndDay`
  startet den ~6 s Heimweg **ohne Indikator**; wiederholtes Klicken ist per Code ein No-Op. Der
  *Eindruck* „kaputt" ist falsch — aber **durch einen echten Feedback-Defekt verursacht**. (Genau
  diese Selbstkorrektur belegt, warum die zweite Beobachtung nötig ist.)
- **„Bin ich die Böse?"** → `□ SUBJEKTIV` (gewollt) — die Irritation ist **vom Design beabsichtigt**
  und kein Mangel; nur die *Auflösung* dieser Irritation fehlt früh (s. Persona C).

**Fazit A:** Die Fiktion („du arbeitest für eine fiese Agentur") versteht Lena in **unter zwei
Minuten** — das ist stark. Was sie **nicht** versteht: *was sie konkret tun soll*, *wohin*, und
*ob sie auf Kurs ist*. Discoverability der **Fiktion: top**, der **Mechanik & Zielrichtung: schwach**.

---

## 4. Persona B — Marcus (der Systemiker)

### Beobachtung 1 — Lautes Denken

> **(Bis Auftrag)** „Sauberer Einstieg. *Vertrauen ist das Mittel, der Auftrag das Ziel* — das ist
> eine **gute** Designansage, das sagt mir: es gibt eine Sieg-Achse pro Auftrag. Keil = Lager-Abstand,
> Wahl = Wahltrend, Zweifel = Vertrauensindex. Ich nehm Keil, Tutorial-Lauf."
>
> **(HUD-Lesen)** „Erstmal Inventur. AP 5/5, Budget 150K, Kapazität /100, Risiko 0, Aufmerksamkeit 0,
> Moralische Last 0. Gesellschaft: Vertrauen 100, Polaris 25, Info-Last 20, Zynismus 20. Ziel:
> *Vertrauen 100 → 40* und *Enttarnung < 85*. Gut, **zwei** klare Endbedingungen. Aber: vier
> Zeitebenen — Uhr, AP, Monat, Jahre — das ist mir zu viel Buchhaltung für dieselbe Sache."
>
> **(Terminal vs. Tafel)** „Im Terminal hab ich 7 Aktionen. Auf der **Narrativ-Tafel** plötzlich
> *hundert*, inkl. illegaler, die das Terminal gar nicht zeigte. Zwei verschiedene Aktionslisten mit
> verschiedenen Inventaren — **warum?** Und die Verben: *Ausführen* vs *Einreihen* vs *Anheften* vs
> *Sofort*. Was davon plant, was feuert? Ich muss das durch Ausprobieren raten, das nervt einen
> Optimierer."
>
> **(Erste Aktion)** „*Ausführen* → Broadcast, *50 % Wirksamkeit*. Woraus ergeben sich die 50 %?
> Konsole sagt was von 0 % Rabatt × 0.7 Moral — aber im UI ist das eine nackte Zahl. Und +3K grün,
> obwohl Budget fällt — das ist schlicht ein Vorzeichenfehler. Solche Dinge zerstören mein Vertrauen
> ins Zahlenmodell."
>
> **(Kausalität)** „Mein Kernproblem: Ich sehe **nicht**, wie eine Aktion mein Barometer bewegt. Die
> Karte sagt *1 NPC-Bonus*. Aber bewege ich Polarisierung? Um wie viel? Ohne diese Kopplung optimiere
> ich blind — das ist das Gegenteil eines Strategiespiels."
>
> **(Runde)** „*Phase beenden* — 6 s nichts (ich klick reflexhaft dreimal). Dann Lagebericht: 8
> Segmente mit Stimmung, *Die Abgehängten: wütend*. **Das** ist gut — endlich sehe ich Wirkung auf
> Gruppen-Ebene. Aber: Diese Segment-Reaktion hätte ich gern **beim Planen** gesehen, nicht erst
> nachträglich."

### Beobachtung 2 — Gegenprobe

- **„Gute Designansage (Mittel vs. Ziel)"** → `■ OBJEKTIV`. Wortgleich im Direktor-Dialog
  (Screenshot 05). Echte Stärke.
- **„Vier Zeitebenen"** → `■ OBJEKTIV`. Belegt in `dayClockStore.ts` + HUD: Uhr, AP, Monat, Jahre
  koexistieren für dieselbe Fortschrittsachse.
- **„Zwei Aktionslisten, verschiedene Inventare"** → `■ OBJEKTIV`. Terminal „7 verfügbar"
  (Screenshot 08) vs. Tafel mit ~100 Maßnahmen inkl. ILLEGAL (Screenshot 11). Verb-Wildwuchs
  (Ausführen/Einreihen/Anheften/Sofort) real vorhanden.
- **„50 % aus dem Nichts"** → `■ OBJEKTIV`. Wirksamkeit nur als Zahl im Modal; Herleitung nur in der
  Konsole, nicht im UI.
- **„+3K-Vorzeichenfehler"** → `■ OBJEKTIV (Bug)` (s. Persona A, doppelt belegt).
- **„Aktion↔Barometer nicht gekoppelt"** → `■ OBJEKTIV`. Wirkungsanzeige der Karte = „1 NPC-Bonus"
  (Screenshot 08); kein Barometer-Delta sichtbar. Zentraler Kohärenz-Befund.
- **„Segment-Stimmung erst nachträglich"** → `■ OBJEKTIV`. Stimmungen erscheinen im Lagebericht
  (Screenshot 12), nicht am Entscheidungspunkt.
- **„Klick reflexhaft dreimal"** → `⚠ ARTEFAKT-KORRIGIERT`. Wie bei A: der No-Op ist real, das
  „dreimal klicken" ist die *natürliche* Nutzerreaktion auf fehlendes Feedback, nicht Ungeduld allein.

**Fazit B:** Die **Architektur eines guten Strategiespiels ist da** (klare Endbedingungen, tiefe
Aktionsmenge, Segment-Modell, schließender Loop). Was den Optimierer ausbremst, ist **Legibilität**:
die Kausalkette *Aktion → Gesellschaftswert → Auftragsbarometer* ist am Entscheidungspunkt unsichtbar,
und die doppelte Aktionsfläche + Vokabular-Wildwuchs erzeugen Reibung statt Tiefe.

---

## 5. Persona C — Dr. Sabine (Zweck & Ethik)

### Beobachtung 1 — Lautes Denken

> **(Begrüßung)** „*Bildungszweck: Verständnis von Desinformationstaktiken und Gegenmaßnahmen* —
> gut, dass es dasteht. Schade, dass es **so klein und dunkel** ist; der Knopf *Neue Mission* dominiert,
> der Rahmen verschwindet."
>
> **(Rolle)** „Ich soll also selbst die Täterin sein: *Westunion destabilisieren*. Das ist ein
> legitimer didaktischer Kniff — man versteht Manipulation, wenn man ihre Logik nachvollzieht. Aber:
> Es muss **spürbar** bleiben, *wem* ich schade. Bisher ist es ein hübsches Büro und nette Mitarbeiter."
>
> **(Erste Aktion)** „*Zielgruppe analysieren* — und sofort kommt Befriedigung: Sendung, Quote,
> Marina lobt mich trocken. Das ist die Mechanik eines Aufbau-Spiels: *tu etwas → Belohnung*. Mir
> ist mulmig: Die **Belohnung** für Manipulation ist unmittelbar und glatt, die **Kosten** für die
> Gesellschaft sehe ich kaum."
>
> **(Lagebericht)** „Immerhin — hier: *Die Abgehängten: wütend*, *Die digitalen Bohemiens:
> misstrauisch*. Das ist der Moment, wo ich den *Schaden* sehe. Den hätte ich gern **lauter** und
> **früher**, nicht als ruhige Bilanz am Feierabend."
>
> **(Frage)** „Wo ist die Gegenseite, der Faktencheck, der Preis? *Keine nennenswerte Gegenwehr —
> noch.* Okay, kommt später. Aber didaktisch: Wenn die ersten 30 Minuten reines, billiges Gewinnen
> sind, lernt der Spieler erst mal, dass Manipulation *funktioniert und sich gut anfühlt*. Das
> Reflexions-/Methoden-Debrief am **Ende** kommt für manche zu spät."

### Beobachtung 2 — Gegenprobe

- **„Disclaimer zu klein/dunkel"** → `■ OBJEKTIV`. Screenshot 01: niedriger Kontrast, visuell
  dominiert vom roten CTA.
- **„Belohnung sofort, Schaden kaum sichtbar"** → `■ OBJEKTIV (früh)`. Mikro-Loop liefert sofort
  Broadcast/Lob (Screenshot 09); gesellschaftlicher Preis erscheint erst im Tagesbericht
  (Screenshot 12) und die Gegenseite ist „noch" leer.
- **„Schaden lauter/früher wünschenswert"** → `□ SUBJEKTIV/DIDAKTISCH` — eine **Design-Haltung**,
  kein Defekt. Aber sie deckt sich mit einem realen Strukturmerkmal (Reflexion ist end-lastig).
- **„Selbst Täterin sein ist legitim"** → `□ SUBJEKTIV` (Sabine bejaht es) — wichtig: **keine**
  objektive Schwäche, sondern eine bewusste, vertretbare Designentscheidung.
- **„Methoden-Debrief kommt spät"** → `■ OBJEKTIV` (Struktur). Laut STATUS/Code liegt die
  Bildungs-/Gegenmaßnahmen-Schicht im **End-Report** (verpflichtend), nicht im Frühspiel.

**Fazit C:** Der **ethische Rahmen existiert** (Disclaimer, fiktive Symbole, verpflichtendes
End-Debrief, reale-Methoden-Atlas) — das ist verantwortungsvoll gebaut. Die **Frühphase** aber
trainiert zunächst nur die *Lust am Funktionieren* der Manipulation; der spürbare Preis und die
Reflexion sind nach hinten verlagert. Für ein **Bildungs**-Planspiel ist genau die Frühphase die
sensibelste.

---

## 6. Querschnitt-Befunde (verdichtet, alle objektiv belegt)

1. **Fiktion sticht, Mechanik-Mentalmodell hinkt.** Worum es *erzählerisch* geht, ist in <2 min klar.
   *Was zu tun ist*, *wo*, und *was das Ziel bewegt*, bleibt in Runde 1 unklar.
2. **Zwei Aktionsflächen (IA-Bruch).** Terminal (7, Ausführen/Einreihen) vs. Narrativ-Tafel (~100,
   Anheften/Sofort) mit verschiedenen Inventaren und Verben. Die teuerste Einzel-Unklarheit.
3. **Kausalkette unsichtbar.** Aktion → Gesellschaftswert → Auftragsbarometer ist am Entscheidungs-
   punkt nicht ablesbar („1 NPC-Bonus" statt „Polarisierung +X").
4. **Vokabular-/Zeit-Wildwuchs.** Feierabend = Phase beenden (gleicher Handler, zwei Labels);
   Uhr/AP/Monat/Jahre für eine Achse; AP-Limit macht den manuellen Tageswechsel zum **einzigen** Weg.
5. **Feedback-Lücken brechen den Fluss.** ~6 s stiller Heimweg vor dem Lagebericht (erzeugt
   „kaputt"-Eindruck + stille Mehrfachklicks); „Budget +3K" grün bei fallendem Budget; doppelte
   NPC-Reaktion (Modal + Dialogbox).
6. **Visuelle Verdeckung.** Dialogbox verdeckt das (gute) NPC-Porträt; rechte Kante überfüllt
   (Berater-Leiste + Queue-Panel + Broadcast) — die vom Team selbst notierte „zwei Welten"-Spannung.
7. **Führungs-Asymmetrie.** Tag 1 ohne gerichteten Hinweis; ab Tag 2 starkes Morgenbriefing mit
   konkretem nächsten Schritt — die gute Lösung existiert, nur am falschen Tag.
8. **Reflexion end-lastig.** Belohnung der Manipulation sofort; Schaden/Gegenseite/Methoden-Debrief
   später.

---

## 7. Will-Wright-Linse: Ist das ein „gutes Spiel"?

| Kriterium (Wright) | Stand im Frühspiel | Urteil |
|---|---|---|
| **Mentalmodell / Lernbarkeit** | Fiktion sofort klar; System (AP/Kapazität/Werte/Barometer) trüb | ◐ teils |
| **Möglichkeitsraum / Handlungsmacht** | Sehr reich (143 Aktionen, 3 Aufträge, 5 NPCs) — aber **zu viel zu früh** | ◐ reich, schlecht dosiert |
| **Feedback-Schleifen** | Mikro-Loop (Aktion→Broadcast→Publikum) **knackig**; Makro-Loop existiert, aber tote 6 s + unsichtbare Kausalität | ◐ stark/lückenhaft |
| **Emergente Erzählung / Ausdruck** | NPC-Stimmen, 8 Publikumssegmente, Episoden — gute Anlagen, früh nur angedeutet | ◑ Potenzial |
| **„Spielzeug"-Qualität (Anfass-Spaß)** | Die erste Aktion erzeugt sofort eine sichtbare Welt-Reaktion — **das** macht Lust | ● Stärke |

**Wright-Kernsatz angewandt:** Ein gutes Spiel ist erst ein gutes *Spielzeug* und baut dann ein
sauberes Mentalmodell auf. „Operation Westunion" hat ein **exzellentes Spielzeug im Kern** (der
Broadcast-/Publikums-Reflex) und einen **reichen Möglichkeitsraum** — aber es **öffnet seine ganze
Komplexität sofort** und macht die zentrale Kausalkette unsichtbar. Wright würde sagen: *erst den
Sandkasten lesbar machen, dann erweitern.* Die Knochen eines guten Spiels sind da; die Frühphase
unterperformt bei **Lesbarkeit** und **Feedback-Kontinuität** — beides ohne Kern-Umbau heilbar.

---

## 8. Lösungsansätze (klein → fundamental)

### Schnell (Tage)
- **Vorzeichen/Farbe im Ergebnis-Modal fixen:** Kosten als „−$3K" rot; grün/„+" nur für echte Gewinne.
- **Heimweg-Feedback:** Knopf nach Klick auf „Feierabend — Heimweg…" sperren/umlabeln, Mini-Indikator
  oder Skip; Mehrfachklick darf nicht still verpuffen.
- **Doppelte NPC-Reaktion** zu **einer** Darstellung zusammenführen.
- **Begrüßung:** Kontrast von Titel/Untertitel/Disclaimer erhöhen (Panel/Schatten hinter Text).
- **Default-Name** weg von „Direktor" → Platzhalter „Ihr Deckname".
- **Tag-1-Führung:** Die (bereits existierende) Morgenbriefing-Mechanik **auch an Tag 1** zeigen
  — direkt nach der Auftragswahl ein konkreter erster Schritt („Geh ins Büro → Terminal → analysiere").

### Mittel (Wochen)
- **Eine Aktionsfläche oder klare Rollenteilung:** Terminal = „jetzt ausführen"; Tafel = „Sendeplan
  planen". Vokabular auf **ein** Verb-Set vereinheitlichen. Tafel-Katalog nach Relevanz/Freischaltung
  **filtern**, nicht 100 Karten dumpen.
- **Kausalität sichtbar machen:** Auf jeder Aktionskarte das erwartete **Barometer-Delta** zeigen
  (z. B. „Polarisierung +X", „Risiko +Y"), nicht nur „1 NPC-Bonus". Die 50 %-Wirksamkeit erklären.
- **Segment-Vorschau:** die Publikums-Stimmung (aus dem Lagebericht) als **Vorschau** beim Planen.

### Fundamental (Konzept — ausdrücklich zur Disposition gestellt)
- **Zeitmodell entschlacken:** Brauchen wir Uhr **und** AP **und** Phase **und** Jahre? Vorschlag:
  **eine** Handlungs-Währung (z. B. nur die Tages-Uhr *oder* nur AP) als Zugbudget, der Rest reine
  Flavor-Anzeige. Reduziert die Buchhaltung der ersten Stunde drastisch.
- **Narrativ-Tafel später einführen:** Sie ist an Tag 1 eine zweite, überwältigende Aktionsliste.
  Besser als *Graduierung* freischalten (sobald ein Episoden-Strang einen Mehr-Spuren-Sendeplan
  *rechtfertigt*) — Möglichkeitsraum dosiert öffnen (Wright).
- **Spielzeug-Onboarding:** Runde 1 als **Toy**: 2–3 Aktionen, **ein** lesbares Barometer
  (Polarisierung), klare Ursache→Wirkung. Erst danach Katalog/NPCs/Aufträge erweitern.
- **Ethik in den Loop ziehen (statt nur ins Ende):** Den gesellschaftlichen **Preis** früh und
  spürbar machen — die Segment-Reaktion („Die Abgehängten: wütend") schon **während** des Optimierens
  zeigen, eine sichtbar wachsende Gegenseite/Faktencheck. Das **dient dem Bildungszweck UND der
  Spieltiefe** (Wright: bedeutsame Konsequenzen), statt die Reflexion ans Ende zu verschieben.

---

## 9. Eine-Zeile-Verdikt
**Im Kern ein gutes Spiel mit einem exzellenten „Spielzeug" und verantwortungsvollem Rahmen — aber
die Frühphase verschenkt Wirkung an fehlende Lesbarkeit (Kausalkette, zwei Aktionsflächen,
Zeit-Wildwuchs) und an Feedback-Lücken (toter Heimweg, falsches Vorzeichen). Alles ohne Kern-Umbau
behebbar; die wirksamste Einzelmaßnahme: Aktion→Ziel sichtbar koppeln und den Möglichkeitsraum
dosiert öffnen.**
