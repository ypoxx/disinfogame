# 🏁 ZIELBILD: „Das Rennen um Westunion"

**Datum:** 2026-07-04 · **Status:** KANONISCHES ZIELBILD (Nachfolger von `KONZEPT_2026-06-20_SIEG_KOPPLUNG.md`)
**Grundlage:** Bindende Owner-Entscheidungen E1–E20 (`DECISIONS_2026-07-04_TRANSKRIPT_SIEG.md`) + Design-Panel
(5 unabhängige Entwürfe: Race-Mechanik, Politiksim, Oberfläche/Erzählung, Inokulation, Produktion) +
3-köpfige Jury (Spieler-Anwalt, Owner-Anwalt, Tech-Lead) + 2 Konsistenz-Sweeps (Doku, Code).
**Jury-Ergebnis:** Alle drei Juroren küren den Produktions-Entwurf zum Gesamtsieger; dieses Zielbild ist
seine Struktur, veredelt mit den bestbewerteten Ideen der anderen vier (Anhang listet Herkunft und Verworfenes).

---

## 1. Das Spiel in einem Absatz

Du leitest eine verdeckte Desinformations-Agentur in Westunion. In **~40 Tagen** ist eine vorgezogene
Neuwahl. Dein Auftrag der Zentrale: **Die radikale Partei muss gewinnen.** Deine Waffe: Desinformation —
spalten, Zweifel säen, mobilisieren. Dein Gegner ist kein Bösewicht, sondern das **Immunsystem der
Gesellschaft**: Faktenchecker, Behörden, Prebunking-Kampagnen und Milieus, die deine Maschen durchschauen
und abstumpfen. **Zwei Läufer rennen auf den Wahltag zu — deine Sonntagsfrage und ihre Abwehr.** Wer
zuerst durchs Ziel geht, entscheidet, ob am Wahlabend die Hochrechnung kippt oder dein Organigramm in
der Sondersendung läuft. *(Spielprinzip: Plague Inc. / Democracy. Oberfläche: MadTV/MadNews. Ton:
Papers Please.)*

## 2. Der eine Satz für den Spieler

> **„Bring die Partei über die Schwelle, bevor das Land dich durchschaut — die Wahl ist in 40 Tagen."**

Damit ist die Owner-Diagnose („Auftrag und Spiel wirken wie zwei Sachen") strukturell aufgelöst:
Der Auftrag IST das Spiel; Uhr, Sieg und Geschichte sind EIN Objekt — der Wahltag.

---

## 3. Das Rennen: die zwei Läufer

### Läufer 1 — DIE SONNTAGSFRAGE (dein Fortschritt)
- **Die eine Siegzahl** (Jury einstimmig: die klarste Metrik im Feld): der Umfragewert der radikalen
  Partei, z. B. **Start 9 % → Ziel 27 %**, mit Zielstrich und Wahldatum direkt am Balken. Jeder
  spielaffine Erwachsene versteht eine Umfrage ohne ein Wort Erklärung — das ist unsere
  MadTV-Einschaltquote (E6).
- **Technisch** (Tech-Lead-Votum, verhindert zwei konkurrierende Wahrheiten): Die Sonntagsfrage ist das
  **diegetische Gesicht von `auftragProgress`** der Wahl-Signatur — kein zweites, milieu-berechnetes
  Parallelmaß. Der Sieg-Check verlangt, dass **jede Signatur-Achse** ihr Ziel erreicht (Min-Regel statt
  Mittelwert — sonst trägt eine überdrehte Achse zwei vernachlässigte). Damit die Min-Regel keine
  versteckte Falle wird (Spieler-Anwalt-Warnung): Die Wahlkampf-**Akte** (heutiges MissionPanel) zeigt
  Ist/Ziel/Tendenz je Achse, und NPC-Nebensätze benennen die klemmende Achse („Die Zahlen im Süden
  bewegen sich nicht, Direktor").
- **Das Ritual:** Alle 5 Tage erscheint die neue Sonntagsfrage als TV-News — der wiederkehrende Moment,
  in dem man schwarz auf weiß sieht, ob die Woche gewirkt hat. Wochen-Spannungsbögen statt Dauer-Ticker.
- **Milieu-Kippen als Sprung-Ereignis:** Gekippte Milieus geben +3–5 Punkte auf einmal, mit Szene und
  News (Parteifahne im Fenster) — kein Prozente-Grind, sondern abzählbare Zwischen-Höhepunkte.

### Läufer 2 — DIE ABWEHR (das Immunsystem)
- **Ein Wert 0–100**, sichtbar im HUD mit Stufen-Markierungen bei 25/50/75. Erreicht die Abwehr 100 vor
  dem Wahltag, ist das Spiel verloren — das Land ist immun, die Operation aufgeflogen.
- **Eleganteste Wiederverwendung des Panels** (Jury-Konsens): Der ehemals unsichtbare Gesellschaftswert
  **`wehrhaftigkeit` wird zum ABWEHR-Wert befördert** — der zweite Rennfahrer ist kein Neubau, sondern
  die Aggregation der vorhandenen Verteidiger-Maschinerie (`StoryActorAI`-Spawns, Trust-Regeneration,
  `armsRaceLevel`) in eine sichtbare Zahl mit End-Check.
- **Zuflüsse:** (a) **Lärm** — Risiko/Aufmerksamkeit werden von eigenen HUD-Größen zu Zuflüssen der
  Abwehr (eine Gegner-Anzeige statt drei Buchhaltungen); (b) **durchschaute Maschen** — die n-te
  Wiederholung derselben Maschen-Familie erzeugt ein „Gepatcht"-Ereignis mit TV-Nachricht;
  (c) **aktive Verteidiger** — passiver Zuwachs pro gespawntem Akteur; (d) leichtes Zeitgrundrauschen —
  reines Abwarten verliert.
- **Stufen-Zähne:** Bei 25/50/75 feuert das **CountermeasureSystem** (~24 fertige DISARM-Maßnahmen,
  heute dormant): Prebunking-Kampagne impft Milieus, **Plattform-Sperren werden endlich durchgesetzt**
  (Aktion X Tage grau: „Kanal gesperrt"), Task-Force beschleunigt den Ermittler-Countdown. Der Spieler
  bekommt Reaktions-Optionen (anfangs 2–3 vereinheitlicht: kontern / aussitzen / ablenken — kontern
  kostet Geld, aussitzen füttert die Abwehr).
- **Bremsen:** Gegen-Operationen (Zermürben, Ablenkung) senken die Abwehr — teuer, selbst leicht lärmig;
  Bremsen kauft Zeit, gewinnt aber nie allein.
- **Die Nacht wird transparent:** Das Tagesfazit weist die Regeneration aus („Über Nacht: Institutionen
  holen 2,1 Punkte zurück") — das im Code schon existierende Rennen wird jeden Abend fühlbar; man
  versteht sofort, warum Nichtstun verliert.

---

## 4. Sieg und Niederlagen — EIN Siegweg, DREI Verlustwege

**SIEG (der einzige):** Am Wahltag hat die Sonntagsfrage die Schwelle erreicht (alle Signatur-Achsen im
Ziel) und die Abwehr steht unter 100 → **die radikale Partei gewinnt, die Regierung fällt** (E15).
Das heutige unsichtbare „3 Phasen halten" (`REQUIRED_HOLD_PHASES`) **entfällt ersatzlos** — der Stichtag
plus die nächtliche Regeneration erzwingen das Verteidigen bis zum Schluss von selbst (Jury: die
Halte-Regel war genau die Art versteckter Zusatzregel, die E2 abschaffen will).

**Verlust 1 — DAS LAND HÄLT STAND:** Abwehr erreicht 100 vor dem Wahltag. Kündigt sich über die Stufen
an (TV-Eskalationen, verbrannte Maschen-Stempel, nervöse NPC-Dialoge). Fühlt sich an wie Ertrinken in
Zeitlupe — man sieht es kommen und rechnet, ob es noch reicht.

**Verlust 2 — WAHLABEND VERLOREN:** Tag 40 erreicht, Schwelle verfehlt. Die Regierung wird bestätigt,
die Zentrale zieht den Stecker. Kündigt sich über die 5-Tage-Sonntagsfrage an. Kein Knall — ein
Achselzucken der Geschichte. **Die Pleite ist die Vorstufe dieses Weges** (kein eigener Bildschirm):
Die Zentrale zahlt in Tranchen nach Fortschritt (E18); wer schlecht liegt, wird gemahnt, dann gekürzt,
dann handlungsunfähig — und läuft in den Wahltag.

**Verlust 3 — ENTTARNT:** Ermittler-Countdown läuft ab (bestehende Mechanik; der Countdown erscheint als
rot pulsierende Warnung NUR, wenn er läuft). Endet als Sondersendung mit dem eigenen Organigramm.

**Verrat ist kein eigener Game-Over mehr** (Jury-Votum: weniger Regeln, mehr Drama): Ein Verrat ist ein
dramatisches **+15-Abwehr-Ereignis** mit Leak-Story — der Überläufer erklärt der Öffentlichkeit deine
Maschen (Insider-Leck cm11; die nie angewandten `BetrayalEvent`-Folgen werden dabei endlich verdrahtet,
und die doppelte Verrats-Verarbeitung — Nebenbefund 1 — wird mitbereinigt).

---

## 5. Die Uhr (Antwort auf O4)

Das Vier-Ebenen-Zeitmodell (Uhr + AP + Monat + Jahr, 120 Phasen / 10 Jahre) kollabiert auf **zwei Ebenen**:

1. **Der Arbeitstag** (bleibt unangetastet): 09:00–18:00, ~5 Aktionspunkte, 17:00-Redaktionsschluss-
   Mahnung, Heimweg, Tagesfazit. 1 gespielter Tag = 1 Phase = 1 Kalendertag.
2. **Die Kampagnen-Uhr:** `CAMPAIGN_DAYS = 40` (EINE Konstante; Tuning-Korridor 30–50, finale Zahl
   entscheidet die Simulation — 30 wäre für die 13 Episoden die härteste Content-Kompression, darum
   Default 40). Voll diegetisch: Abreißkalender an der Bürowand, Wahlplakate, TV-Countdown — kein
   Timer-Widget.

**Flexibilität, wie der Owner sie will** („30-Tage-Gefühl, aber flexibel"): Der Termin ist Anker, kein
Korsett — (a) ein Misstrauensvotum-Beat kann die Wahl um wenige Tage **vorziehen** (Druck), (b) die
Zentrale kann genau **einmal „Nachspielzeit"** gewähren (+5 Tage gegen Budgetkürzung und höhere
Zielmarke — Geld als Druckmittel, E18), (c) das Rennen selbst ist die eigentliche Uhr: Die Abwehr kann
das Spiel vor Tag 40 beenden. **Schleichender Druck statt Skript-Sturm** (E4): Die Abwehr schläft
anfangs fast (das Land ist naiv) und beschleunigt organisch mit jeder durchschauten Masche — der Druck
wächst aus dem eigenen Handeln. Die 3,5-Jahre-Schonzeit (`PACING_GRACE_PHASES = 42`) fällt mit dem
alten Kalender.

---

## 6. Was der Spieler sieht (Antwort auf O3)

**Im HUD genau vier Größen** (MadTV-Prinzip „Quoten und Kurse"):
1. **SONNTAGSFRAGE** (% mit Zielstrich) — dein Läufer
2. **ABWEHR** (0–100 mit Stufen-Marken) — ihr Läufer
3. **KASSE** (Budget)
4. **TAG X/40** (+ Tagesuhr/Aktionspunkte als nicht-numerische Anzeige)

**Die 8 Gesellschaftswerte verschwinden als Anzeige.** Intern wird von 8 auf 5 eingedampft
(Tech-Lead-Votum, am besten begründet):
- **Bleiben intern:** `vertrauen` (jetzt Mittel, nicht Ziel), `polarisierung`, `zynismus`,
  `diskursqualitaet`, `fraktionsstaerke` — sie speisen Sonntagsfrage und Milieu-Verhalten.
- **Befördert:** `wehrhaftigkeit` → wird die sichtbare ABWEHR.
- **Gestrichen:** `informationslast`, `reformfaehigkeit` (exakt die zwei, die der Owner selbst nicht
  erinnert); `fragmentierung` wird in `polarisierung` gefaltet. ⚠️ Folgekosten beachtet: Die
  Keil-Signatur in `Auftraege.ts` referenziert `fragmentierung` und wird mitmigriert.

**Die Gesellschaft zeigt sich als Bild, nie als Balken** — das Wohnzimmer-Alphabet (feste Bildsprache,
jedes Bild bedeutet immer dasselbe):
| Bild | Bedeutung |
|---|---|
| Küchen-Streit | polarisiert/aktiviert |
| Einsam am Videospiel | demobilisiert |
| Abwinken vor dem TV | Masche bekannt/immunisiert |
| Parteifahne im Fenster | Milieu gekippt (+Sprung auf die Sonntagsfrage) |
| Faktencheck-Zeitung auf dem Tisch | geimpft (Prebunking hat gewirkt) |

**Aktions-Vorschau = mehrere kleine Hinweise (E7):** Jede Karte zeigt Chips für die 2–3 betroffenen
Milieus, den Lärm-Hinweis — und den **Frische-Stempel**: **FRISCH / BEKANNT / VERBRANNT** je Ziel-Milieu
(beste UI-Idee des Panels). Die Abstumpfung warnt VOR dem Ausgeben, nie danach als Überraschung; man
versenkt nie Ressourcen in Verpufftes.

---

## 7. Das Immunsystem im Detail (Abstumpfung & Impfung)

- **Maschen-Gedächtnis** je (Milieu × Maschen-Familie), gekeyt auf die **18 Familien des
  DisinfoMethodAtlas** — Mechanik, Quittungen und Endreport teilen EIN Vokabular (die Familien
  existieren als Daten; `counter_de`-Sätze werden die Erklärtexte). Wirkungs-Multiplikator je Familie
  und Milieu: **1,0 → 0,6 → 0,3**. Intern eine kleine 8×18-Matrix, sichtbar NUR über Stempel und
  abwinkende Figuren (Jury-Auflage: jede Zahlen-Sichtbarkeit der Matrix wäre eine E6-Verletzung).
- **Prebunking schlägt Debunking** (Forschungsbefund als Balancing-Regel): Reaktive Faktenchecks geben
  kleine, schnell zerfallende Immunität nur fürs betroffene Milieu/Thema; **Prebunking-Kampagnen (cm24)
  geben große, langsam zerfallende Familien-Immunität** über die erreichten Kanäle. Nebeneffekt mit
  Doppelboden: Medienferne Milieus erreicht die Aufklärung kaum — der Spieler entdeckt selbst, wohin
  Prebunking nicht durchdringt.
- **Transparenz (E5):** Jede Verpuffung nennt Ursache, Tag und Gegenmaßnahme („Wirkung: gering. Grund:
  Masche bekannt — Prebunking-Kampagne der Landeszentrale, Tag 9"). Das News-TV zeigt die Züge des
  Gegners, BEVOR sie greifen. So lernt man Gegenmaßnahmen kennen, ohne einen didaktischen Einschub.
- **Ruhen lohnt:** Antikörper zerfallen langsam; Maschen-Familien rotieren, Milieu wechseln, neue Familie
  von der Zentrale anfordern (teuer) — echte Strategie-Tiefe statt Grind.
- **KEIN Backfire-Malus** (Jury-Warnung: neue Strafmechanik ohne Transkript-Basis, E9-Frustrisiko) —
  höchstens später, mit Sim-Nachweis.
- **Kein Gegner-Gesicht:** Das Immunsystem bleibt ein Ökosystem (Institutionen + Milieus), kein
  Bösewicht-Avatar.

---

## 8. Der EINE Auftrag (Antwort auf O2)

**„Die Wahl"** — einstimmige Empfehlung aller fünf Entwürfe: Er ist der einzige Auftrag mit natürlicher
Ziellinie (der Wahltag löst das Uhr-Problem diegetisch), natürlicher Siegzahl (Umfragewert = Quote) und
dem vom Owner gewünschten plakativen Sieg-Moment („radikale Partei gewinnt", E15).

- **Inszenierung:** Kein Auswahlmenü (`AuftragSelect` entfällt). Tag 0, der Kurator schiebt EINE Akte
  über den Tisch — Parteilogo, Startwert 9 %, Zielstrich, Wahldatum, Stempel: *„Das Vertrauen der Leute
  zu zersetzen, ist nur das Mittel. Das Ziel steht in der Akte. Daran misst die Zentrale Sie."* Die Akte
  wandert an die Bürowand — der Auftrag ist ab Minute eins ein physisches Objekt.
- **Keil und Zweifel werden nicht gelöscht, sondern degradiert** (rettet die gesamte Content-Investition):
  - Als **Akt-Dramaturgie**: Akt 1 „Den Keil treiben" (Polarisierung hoch — die Basis aktivieren),
    Akt 2 „Den Zweifel säen" (Institutionenvertrauen runter — den Boden weich machen, Gegner
    demobilisieren), Akt 3 „Die Wahl kippen" (Fraktionsstärke über die Schwelle). Die 13 Episoden und
    Beats docken an diese Akte an — und beantworten dem Spieler im Mittelspiel die Frage „was mache ich
    JETZT?".
  - Als **optionale Direktiven der Zentrale** (Woche 2/3): 5-Tage-Nebenziele auf den Alt-Signaturen, bei
    Erfüllung Geld-Nachschub (E18-Belohnung).
  - Später (nach dem Versionssprung) als eigene Wiederspiel-Kampagnen reaktivierbar — die
    `AUFTRAEGE`-Datenstruktur bleibt mehrfähig, nur die Auswahl-UI fällt.
- **Parteiname (Default, Veto möglich):** **„Westunion Erwacht"** — fiktiv, ohne reale Anleihen
  (SYMBOLS_AUDIT-Pflicht vor Asset-/Voice-Produktion; das Panel benutzte vier verschiedene Namen, es
  braucht EINEN).

---

## 9. Sieg- und Niederlage-Momente (Antwort auf O5)

**Regel: Ein TV-Set, drei Enden** — das Rennen endet immer im selben Wahlstudio, nur das Bild kippt
anders (ein Asset-Set trägt alle Haupt-Enden).

**SIEG — Der Wahlabend:** Das Büro ist dunkel, nur der News-Fernseher läuft. Hochrechnungs-Balken, die
Moderatorin stockt, der Balken von „Westunion Erwacht" schiebt sich über die Linie: „Damit ist klar —
die Regierung ist abgewählt." Schnitt durch die Wohnzimmer: zwei Milieus jubeln, drei sitzen stumm,
eines schaltet wortlos ab. Das Telefon: der Kurator, eine Zeile, kühl: **„Auftrag ausgeführt. Die Prämie
ist angewiesen."** Kein Konfetti. Auf dem Heimweg der Beigeschmack, erzählerisch: Der Pförtner räumt
seine Loge — „Mein Schwager hat sie gewählt. Wegen der Sache mit den Kliniken." *Die Sache mit den
Kliniken war deine Erfindung von Tag 12.* Dann der Endreport, eröffnet mit dem Kernbotschafts-Abbinder:
**Splitscreen „Was ein militärischer Angriff gekostet hätte" vs. „Was es gekostet hat: 43 Millionen,
200 Konten, 40 Tage. Kein einziger Schuss."** (E15: Desinfo ist gefährlicher als ein Angriff, weil
schleichend — das Demokratisch-Liberale ist weg, und niemand hat es verteidigen können.)

**NIEDERLAGE „Wahlabend verloren":** Dasselbe Studio, aber der Balken kippt nicht; das Konfetti liegt
unbenutzt in Säcken, die Sprecherin lächelt erleichtert. Im Büro: „Die Zentrale beendet die Finanzierung.
Packen Sie die Akten."

**NIEDERLAGE „Das Land hält stand / Enttarnt":** Sondersendung statt Wahlparty — die eigenen
Schlagzeilen laufen als Beweismittel durchs Bild, Masche für Masche erklärt, mit rotem
GEFÄLSCHT-Stempel; unten im Bild das eigene Bürogebäude, Blaulicht. **Der stärkste Lernmoment des
Spiels ist eine Demütigung, keine Belehrung** — man verliert gegen genau die Mechanik, die man 40 Tage
im News-TV wachsen sah.

**Weitere Sieg-Färbungen** (Epilog-Karten, optional, aus dem Panel): „Der stille Putsch" (Rücktritt,
jubelnde Demo — der Spieler erkennt die Schilder wieder, die er bezahlt hat); „Die Einladung" (ein Jahr
später: der neue Innenminister dankt „für nichts, das je geschehen ist"). Verworfen als gleichwertige
Sieg-Szene: „Das Schweigen" (leere Wahllokale, Testbild) — zu nah am vom Owner verworfenen abstrakten
Welt-Zustand (E14/E15); höchstens Epilog-Färbung.

---

## 10. Ton, Lernmomente, Rollen

- **Kühle Quittierung (E8):** Grauer Kastenstempel **„VOLLZOGEN."**, darunter eine nüchterne Zahlenzeile
  („Reichweite 1,2 Mio · Sonntagsfrage +0,8 · Abwehr +1"). Kein grünes Häkchen, keine Fanfare; der
  Erfolgston ist ein trockener Stempelschlag. Gelegentlich ein kleiner grauer Nachsatz ohne Kommentar:
  *„Die Lehrerin aus dem Beitrag hat ihren Namen ändern lassen."* — der leise Beigeschmack (E8), nie
  didaktisch. **Ton-Regel: Die WELT (TV) darf laut sein, die AGENTUR (UI) nie.**
- **Eingewobene Lernmomente (E10):** Rotierende Mikro-Texte an der klickbaren Umgebung — Papierkorb mit
  verworfenen Entwürfen echter Techniken („Entwurf: ‚Firehosing' — zu teuer, sagt Igor."),
  Getränkeautomat („Nimmt nur Münzen. Bargeld hinterlässt keine Logs, sagt Alexei."), Pförtner-Gerüchte,
  Reinigungskraft. Darf auch mal süß sein. Dazu die `counter_de`-Quittungen (jede Verpuffung erklärt
  nebenbei eine Erkennungs-Regel) und der **Civ-Endreport**: Kurven beider Läufer über 40 Tage, welche
  Masche wann verfing, wann welches Milieu kippte oder immun wurde, Methoden-Dossier.
- **Rollen-Klärung (O6, Jury einstimmig):** Der Spieler **bleibt „Direktor"** (alle NPC-Anreden bleiben
  gültig). Volkov wird **„Kurator Volkov — Verbindung zur Zentrale"** — „Kurator" ist der reale
  Geheimdienst-Begriff für den Führungsoffizier: klärt die Hierarchie sofort (er führt dich, du führst
  die Agentur) und ist selbst ein Lernmoment. Vor dem Rename: Audio-/Text-Audit der vertonten Zeilen.
- **Tag-0-Hoax-Testballon (O7): bleibt — und wird besser.** Er ist das Tutorial, das beide Balken einmal
  en miniature bewegt: Ferros Faktencheck im folgenlosen Sandbox-Moment wird der erste sichtbare
  Abwehr-Tick („Sehen Sie den zweiten Balken? Der wächst, wenn man Sie durchschaut."). Die erste Impfung
  der Gesellschaft geschieht buchstäblich im Tutorial. Marinas Brücke führt danach zur Auftrags-VERGABE
  (Akte) statt zur Auswahl. Aufwand minimal.

## 11. Geld (E18)

Die Zentrale zahlt in **Tranchen nach Fortschritt**: Wer liefert, bekommt nachgelegt (Übererfolg = Batzen
+ Lob des Kurators); wer stagniert, wird gemahnt, dann gekürzt. Desinfo kostet sichtbar Geld (Botfabrik,
Verstärker, Kompromat). Pleite ist kein eigener Game-Over, sondern die Würgeschlinge auf dem Weg zu
„Wahlabend verloren". Geld ist damit Druck UND Belohnung — nie Selbstläufer (heute: +5/Phase passiv).

## 12. Was wegfällt (Schnitte — vom Owner ausdrücklich freigegeben)

1. Das 10-Jahre/120-Phasen-Kalendermodell samt Monat/Jahr-HUD und Jahres-Pacing → 40-Tage-Countdown.
2. Der Vertrauens-Sieg (`obj_destabilize` als Ziel, `REQUIRED_HOLD_PHASES`, alle R2-Guards + der Test,
   der das Verwerfen absichert) → Vertrauen wird internes Mittel.
3. Die Auftragswahl aus drei (`AuftragSelect`) → eine Vergabe-Szene.
4. Risiko/Aufmerksamkeit als eigene HUD-Größen → Zuflüsse der ABWEHR (Countdown-Warnung bleibt situativ).
5. Die Enden „Flucht nach Osten" / „Gewissensentscheidung" als eigene End-Checks → Epilog-Färbungen.
6. `informationslast`, `reformfaehigkeit`; `fragmentierung` → in `polarisierung` gefaltet.
7. **Aktionskatalog 143 → ~60–80:** Die 23 toten Aktionen werden ehrlich zu „Ausbau" mit mechanischem
   Nutzen (Abwehr verlangsamen, Sperren umgehen, Milieu-Zugang, Kosten-Rabatte) oder archiviert; die 45
   Grundrauschen-Aktionen werden zusammengelegt oder auf echte Balken-Wirkung gehoben; `impact_scale`
   als Wirkmodell wird abgeschafft. **Invariante: Jede Aktion bewegt sichtbar mindestens einen der zwei
   Läufer.** ⚠️ Jury-Warnung ernst genommen: Das ist neben der Balance die größte reale Arbeitsmenge —
   sie beginnt in Etappe 1 (Minimal-Pass für die Wahl-Signatur), nicht als Restposten am Ende.
8. Das grüne „AKTION ERFOLGREICH ✓" und jede Erfolgs-Feier-Grafik → Stempel-System.
9. Zwei parallele Endspiel-Regelwerke (85 vs. 95) → eine Quelle (`checkGameEnd` entscheidet, EndingSystem
   liefert nur Text).
10. Doppelte Verrats-Verarbeitung, tote Importe, ungenutzte Netlify-Functions, veraltete Datenkopien →
    bereinigt/archiviert (Repo-Regel: `archive/`, nicht löschen).

## 13. Etappenplan & Teststrategie (E11/E12/E13)

**Regel: Jede Etappe endet spielbar (tsc/Tests/Build grün); das Sim-Gate ist ab Etappe 0 die Leitplanke.**

- **Etappe 0 — „Leitplanke": ✅ ERLEDIGT (2026-07-04).** Das harte **Gewinnbar/Verlierbar-Sim-Gate**
  ist gebaut (`src/story-mode/tests/winnable-and-losable.test.ts`): 36 geseedete Headless-Läufe
  (seed-PRNG statt `Math.random`). **Umgesetzt** wird HEUTE nur die über Reset-/Reihenfolge-Varianten
  stabile Aggregat-Invariante (gewinnbar UND verlierbar, Floor 6/6; Ist 15–18 Siege / 18–21 Niederlagen).
  Die harten Bänder (Greedy 30–60 %; Random <10 % Siege UND >60 % Niederlagen; kein Profil bei 0/100 %;
  jeder Verlustweg ≥15 %) stehen als `TARGET_BANDS` bereit, werden aber **erst mit der neuen Mechanik
  scharfgeschaltet** — Begründung siehe unten.
  - ⚠️ **Befund für Etappe 2:** Der Legacy-Singleton-Graph ist NICHT billig vollständig isolierbar.
    Je nach Reset-Set kippt die Feinverteilung stark (voller Loader-Reset: greedy 0/12, low_risk 12/0;
    Gameplay-Reset: ~5/7). Die früher „ausgewogen" wirkenden Zahlen waren teils State-Leak-Artefakt;
    sauber gemessen hat das ALTE Modell triviale Strategien. **Etappe 2 muss den Sim mit sauberer
    per-Partie-Isolation neu aufsetzen** (Engine ohne modul-globale Gameplay-Singletons, oder
    vollständiges reset/export/import) — erst dann tragen die Pro-Strategie-Bänder.
  - **Nebenbefunde:** doppelte Verrats-Verarbeitung entfernt, folgenlose Krisen-Auflösung verdrahtet
    (+ kaputte Clamp-Mathe gefixt). **Nicht-Befunde verifiziert:** Endspiel-Schwellen (85 vs. 90/95)
    sind bereits defensiv versöhnt (kein Live-Bug); die „Datenkopie `docs/story-mode/data/`" existiert
    nicht (nur `schema/`+`playtests/`, referenziert) → nichts zu entfernen.
- **Etappe 1 — „Auftrag = Sieg":** R2-Guards raus, `VictorySystem` als neues Modul extrahiert (kein
  Inline-Editieren im 6463-Zeilen-Adapter), Sieg-Check auf Wahl-Signatur, ein Auftrag per Akte,
  Enden beschnitten. Minimal-Pass über die Aktionen, damit die Wahl-Achsen erreichbar sind
  (Code-Sweep-Warnung: sonst ist der neue Sieg unerreichbar).
- **Etappe 2 — „Die Uhr":** `CAMPAIGN_DAYS`, Wahltag, Kalender-Kollaps, Episoden/Beats auf Tage getaktet
  (Content-Kompression ist ehrliche Redaktionsarbeit), Verschiebe-Mechaniken.
- **Etappe 3 — „Immunsystem sichtbar":** `ImmuneSystem`-Modul, ABWEHR-Balken (wehrhaftigkeit befördert),
  CountermeasureSystem/Sperren/reach_reduction/Verrats-Folgen eingesteckt, Nacht-Transparenz im
  Tagesfazit.
- **Etappe 4 — „Impfung & Abstumpfung":** Maschen-Gedächtnis (8×18), FRISCH/BEKANNT/VERBRANNT-Stempel,
  Wohnzimmer-Alphabet (E16-Situationsbilder), Prebunking>Debunking-Parametrisierung.
- **Etappe 5 — „Fertig" (der Versionssprung):** Aktions-Kuratierung abschließen, Geld-Tranchen,
  Wahlabend-Szenen, TV-Set (E17: Baukasten — Pixel-Hintergrund + austauschbare Text-Ebene; **Priorität:
  Sprecherin, Umfrage-Ticker, Faktencheck, Wahlstudio — vier Bilder tragen 80 % der Dramaturgie**;
  Rest-Set: Vox-Pop, Demo, Parlament, Krisenbild, Wohnzimmer-Schnitt, Testbild), Endreport-Ausbau,
  Tag-0-Hoax-Update, Kurator-Rename.

**Weitere Test-Disziplin:** Characterization-Tests vor jedem Eingriff; Save-Format: bewusster
Versions-Bruch mit klarer Meldung (der Sieg-Semantik-Wechsel macht Altstände bedeutungslos); die
~130 Bestandstests, die das ALTE Verhalten kodifizieren (R2-Neutralität), ziehen mit um; Audience-Zustand
wandert in Save/Load des Adapters (sonst divergieren Anzeige und Mechanik nach dem Laden).

## 14. Offene Defaults (gelten, bis der Owner widerspricht)

| # | Default | Alternativen |
|---|---------|--------------|
| D1 | Kampagnenlänge **40 Tage** (Sim kalibriert im Korridor 30–50) | 30 = dichter, aber härteste Episoden-Kompression |
| D2 | Parteiname **„Westunion Erwacht"** (nach SYMBOLS_AUDIT) | „Nationale Erneuerung" o. a. |
| D3 | Sieg-Check **Min-Regel** (jede Achse im Ziel), Akte zeigt die klemmende Achse | Mittelwert (einfacher, aber eine Achse kann zwei tragen) |
| D4 | Verlustwege **3** (Verrat = Abwehr-Ereignis) | 4 (Apparat separat) |
| D5 | Spieler „Direktor", Volkov „Kurator" | Spieler „Operationsleiter" (bricht alle Anreden — nicht empfohlen) |

## 15. Owner-Rückfragen O1–O7 — wo beantwortet

| Frage | Antwort |
|---|---|
| O1 (F2 erklären) | Im Chat beantwortet; mit diesem Zielbild gegenstandslos: Beats bewegen die Gesellschaft, die Gesellschaft IST die Sieg-Strecke. |
| O2 (ein Auftrag?) | Ja — „Die Wahl" (§8); Keil/Zweifel als Akte + Direktiven. |
| O3 (Gesellschaftswerte) | §6 — 4 HUD-Größen, 8→5 intern, Wohnzimmer-Alphabet statt Balken. |
| O4 (Uhr) | §5 — 40 Tage diegetisch, zwei Ebenen, Verschiebung in beide Richtungen. |
| O5 (Sieg-Momente) | §9 — Wahlabend als Hauptbühne + Epilog-Färbungen. |
| O6 (Rollen) | §10 — Spieler „Direktor", Volkov „Kurator". |
| O7 (Hoax-Testballon) | §10 — bleibt, wird Zwei-Balken-Tutorial. |

---

## Anhang: Jury-Protokoll (Kurzfassung)

- **Gesamtsieger (3/3 Juroren):** Produktions-Realist — einziger Entwurf mit verifizierten
  Code-Referenzen, Sim-Gate-Zuerst-Strategie und Antworten auf alle O1–O7; dieses Zielbild folgt seiner
  Struktur.
- **Übernommene Best-of-Ideen:** Sonntagsfrage als Siegzahl (Politiksim), FRISCH/BEKANNT/VERBRANNT-Stempel
  + Prebunking>Debunking (Inokulation), Stempel-Quittung/Ton-Regel/Kurator/TV-Baukasten (Narrativ),
  Sim-Test-Bänder/Nacht-Transparenz/Verrat-als-Ereignis (Systems), wehrhaftigkeit-Beförderung/
  Akt-Struktur/Etappen (Produktion), Milieu-Kippen als Sprung + Wohnzimmer-Alphabet (Politiksim/alle).
- **Verworfen (mit Grund):** „Riss"-Metapher als Siegzahl (zu abstrakt — E15); Halte-Regel „100 + 3 Tage"
  (versteckte Zusatzregel — E2); Doppel-Siegbedingung Prognose+Milieus (zwei Zähler statt einem — E2);
  8×18-Matrix mit sichtbaren Zahlen/Backfire (E6/E9); „Milieus ersetzen die Simulation" als Fundament
  (größter verdeckter Umbau — als spätere Etappe denkbar); Sieg-Szene „Das Schweigen" (zu abstrakt);
  Spieler-Umbenennung „Operationsleiter" (bricht Anreden); 50-Tage-Kampagne (content-hungrigste Variante).
