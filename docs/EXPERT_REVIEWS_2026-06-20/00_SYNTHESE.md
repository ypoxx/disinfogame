# 🧪 Experten-Review — Synthese & Auswertung (10 Personas)

**Datum:** 2026-06-20 · **Branch:** `claude/gracious-keller-g43bu3`
**Methode:** 10 Persona-Agenten (5 Game-Designer unterschiedlicher Schulen, 5 Genre-Kritiker seit 1990)
haben das Spiel READ-ONLY tief begutachtet und je einen strukturierten Bericht geliefert (Einzelberichte
`01`–`10` in diesem Ordner). Jede Persona ist an realer Design-Theorie/realem Genre-Kanon verankert.

> ⚠️ **Ehrlichkeits-Hinweis (wichtig):** Die **Web-Recherche war in allen Agenten-Sessions blockiert**
> (WebSearch „unavailable", Fetch 403). Die Personas haben die realen Quellen daher aus etabliertem
> Fachwissen benannt (Meier, Wright, MDA, Bogost, Roozenbeek/van der Linden, Cook, 11 bit, Positech,
> Pope, Romero …) — **korrekt attribuiert, ohne erfundene Wortlaut-Zitate**, aber **nicht live verifiziert**.
> Vor externer Verwendung: DOIs/Quellen einmal gegenprüfen. Das Urteil über *dieses* Spiel ruht voll auf Code/Daten.

---

## 1. Das überwältigende Konvergenz-Ergebnis

Zehn Experten, fünf Schulen — und sie zeigen auf **dieselbe Wurzel**. Der Owner-„Bauchgefühl"-Befund
(„kein Gesamtkonzept, das zur richtigen Zeit Sinn ergibt") hat einen präzisen, mehrfach unabhängig
bestätigten Namen:

> ### 🎯 META-BEFUND: Das Spiel hat ZWEI Ökonomien, die sich nicht ansehen.
> Die **sichtbare** Ökonomie (8 Gesellschaftswerte — Polarisierung, Zynismus …), die Beats, Episoden und
> Aufträge bewegen, läuft **getrennt** von der **verborgenen Sieg-Ökonomie** (`obj_destabilize` /
> `trustErosionValue`). Per Owner-Entscheidung (R2, `DECISIONS_2026-06-20_BEATS.md`) sind Beats/Episoden
> „balance-neutral" zur Sieg-Achse. **Folge: Die *interessanten* Entscheidungen sind von der einzigen
> Entscheidung entkoppelt, die *gewinnt*.**

Wer das unabhängig sagt:
- **Marga Stein (Systems/Meier-Wright):** „Ein Spielzeug mit zwei Steuerrädern, und nur das langweilige ist mit den Rädern verbunden."
- **Ingrid Sólveig (11 bit/Frostpunk):** „Wenn meine schwerste Entscheidung des Tages nicht eine Zacke näher an Sieg ODER Untergang rückt, habe ich eine Vignette angeklickt."
- **Valentina Russo (Democracy/Positech):** „Das Herz schlägt in einem Glaskasten neben dem Patienten — sichtbar, aber nicht angeschlossen."
- **Reinhard Kessler (MadTV):** „Gebt dem Publikum die Kasse zurück" (dieselbe Trennung aus Tycoon-Sicht).

**Das ist die zentrale Owner-Entscheidung dieses Reviews:** R2 war ein bewusster Balance-Schutz; vier
Experten sagen, R2 ist **jetzt der Engpass**. Empfehlung (mehrheitlich, nicht eigenmächtig umzusetzen):
**Auftrags-Signatur / Gesellschaftszustand zur (zweiten) Sieg-/Verlustbedingung machen** — die Achsen,
die Beats/Episoden ohnehin bewegen. Konkretester Vorschlag (Russo): eine Kante in `societyFormulaStep`,
über die hohe Polarisierung+Zynismus+niedrige Diskursqualität pro Phase am Vertrauen ziehen.

---

## 2. Die konvergenten Themen (nach Häufigkeit/Schwere)

| # | Thema | Wer (Personas) | Kern |
|---|---|---|---|
| **T1** | **Entkoppelte Sieg-Ökonomie** (R2) | Stein, Sólveig, Russo, (Kessler) | Beats/Episoden/Aufträge bewegen den Sieg nicht → kostümierte Entscheidungen |
| **T2** | **Konsequenz/Preis zu spät & zu abstrakt; Belohnung sofort** | Veldkamp, Achterberg, Sólveig, Kessler | „trainiert den Reiz, nicht das Gewissen"; Schaden + `counter_de` gehören in den Loop |
| **T3** | **Zwei Aktionsflächen + Verb-Wildwuchs (IA-Bruch)** | Boateng, Kessler, Hallström, Park | Terminal vs. Tafel; AUSFÜHREN/SOFORT/ANHEFTEN/AUSSPIELEN |
| **T4** | **Möglichkeitsraum nicht dosiert** (Hervorheben ≠ Kuratieren) | Stein, Boateng, Park | 88/143 sofort offen; Episode soll ihre Aktionen freischalten |
| **T5** | **Modell unsichtbar + Karten-Vorschau gespalten** | Russo, Stein, Park, Boateng | Kausal-Web nur im Code; Karte zeigt Werte-Delta NEBEN „1 NPC-Bonus" |
| **T6** | **Zwei Inhalts-Klassen / Stimme; npcs.json ohne Umlaute; Jargon** | Thornwood, Hallström, Veldkamp, Stein | 1.x–8.x Lehrbuch vs. 11.x/Episoden-Autor; „grosse Plane" |
| **T7** | **Erfolgs-UI feiert die Tat** | Thornwood (scharf), (Veldkamp) | „AKTION ERFOLGREICH" grün/✓ + Combo-Konfetti für Manipulation |
| **T8** | **Pacing: Eskalation zu spät/mild; Gegenseite ohne Zähne** | Sólveig, Boateng, Kessler | 3,5-J.-Schonzeit; `Gegenseite.ts` nur Anzeige; kein Telegrafieren |
| **T9** | **Beat-Pool zu klein** (6, einmalig) für 10 Jahre | Stein, Sólveig | „perfekte Grammatik, sechs Sätze" |
| **T10** | **Zeitmodell vierfach** (Uhr/AP/Monat/Jahr) | Stein, Boateng, Park, Hallström | eine Handlungswährung, Rest Flavor |
| **T11** | **Bestes Feature (Decision-Beat) versteckt; End-Report ohne Gesichter** | Park, Thornwood | 7 Anzeige-Bedingungen; Report = Gutachten statt Nachhall |
| **T12** | **Tote Knöpfe:** halber Katalog trägt Effekt-Keys, die das Modell nicht liest | Russo | `reveals_vulnerabilities` etc. bewegen Werte gar nicht |
| **T13** | **Toter Heimweg** (stiller No-Op, „ist das kaputt?") | Park, Boateng | First-Session-Killer, noch nicht behoben |

---

## 3. Was die Experten EINSTIMMIG loben (nicht anfassen — ausbauen)
- **Das „Spielzeug"** (Aktion → ON-AIR-Broadcast → Publikumsreaktion → NPC-Stimme). Mehrfach „erstklassig".
- **Die Beat-Grammatik** (`evaluateBeatGate`): Non-Dominanz als *automatisierter Test* — „Referenzqualität", „Positech-würdig".
- **Die Schreibe der guten Schicht** (Episoden, 11.x, Beats): „nur müder machen", „sein Sofa zählt für uns" — „Drehbuchqualität".
- **Die Inokulations-Architektur** (`lernmoment_id`→Atlas→`counter_de`): „geht über Bad News hinaus".
- **Der Umgebungshumor mit Mechanik-Bezug** (welkende Pflanze=Moral, Kaffeeküche=Sanktionen).
- **Die Selbstehrlichkeit** der Doku (Review/QUALITAETSMERKMALE diagnostizieren vieles schon selbst).

---

## 4. Priorisierter Verbesserungs-Fahrplan (aus der Synthese)

### 🟢 Sofort (Tage, risikoarm, hoher First-Session-Hebel)
1. **Toter Heimweg** (T13): Overlay „Feierabend — Heimweg…" + Skip; Mehrfachklick darf nicht verpuffen.
2. **Erfolgs-UI entgiften** (T7): „Vollzogen." statt „AKTION ERFOLGREICH"/✓; Combo-Konfetti für Manipulation kühl machen.
3. **`npcs.json` + UI-Texte Umlaut-Reinigung** (T6) + Encoding-Lint als Build-Fehler.
4. **Karten-Wirkung vereinheitlichen** (T5): Auftrag/Gesellschaft zuerst, „NPC-Bonus" klein/nachgeordnet.
5. **`counter_de`-Satz beim Ergebnis** (T2): „So erkennt man das von außen: …" — macht jede Aktion zur vollen Inokulations-Einheit.

### 🟡 Mittel (Wochen, Content/Loop ohne Kern-Umbau)
6. **Eine Aktionsfläche, ein Verb-Set** (T3): Terminal = ausführen, Tafel = planen.
7. **Möglichkeitsraum echt dosieren** (T4): Terminal-Default = anlass-relevant + „ALLE/Werkzeugkiste".
8. **Decision-Beat prominent machen** (T11): Bedingungs-Käfig (7 Gates) lockern; eigener Tages-Aufhänger.
9. **Alte 1.x–8.x auf den Episoden-/11.x-Ton heben** (T6) — kuratiert (Keil-Scheibe zuerst); Jargon eindeutschen.
10. **Tote Knöpfe verdrahten** (T12): jede Aktion ≥1 gelesener Effekt-Key.
11. **Ergebnis-Modal progressiv** (T11): 3 Kernblöcke groß, Rest einklappbar.

### 🔴 Strukturell (Owner-Entscheidung nötig)
12. **T1 — Sieg an Auftrag/Gesellschaft koppeln** (die R2-Frage). DER Hebel gegen das Bauchgefühl. Mit `BalanceInvariant`+Sim absichern. **Owner muss entscheiden, ob R2 fällt.**
13. **T5 — Kausal-Web sichtbar machen** (Democracy-Stil; MissionPanel-Sprache von Status auf Verkettung).
14. **T8 — Pacing schärfen + telegrafieren; Gegenseite mechanisch** (awareness dämpft Effektivität/verschließt laute Wege).
15. **T9 — Beat-Pool 6→15–20 + reaktive Wiederauflagen** (Katalog Teil D).
16. **T10 — Zeitmodell auf eine Handlungswährung reduzieren.**

---

## 5. Ein-Satz-Verdikt der Synthese
Zehn Experten aus fünf Schulen bestätigen unabhängig: **Operation Westunion hat ein erstklassiges
Spielzeug, eine referenzwürdige Entscheidungs-Grammatik und eine Drehbuch-Stimme — aber seine besten
Teile sind voneinander und vom Sieg entkoppelt.** Die teuerste, lohnendste Einzelmaßnahme ist, die
Sieg-Bedingung an genau die Achsen zu hängen, die Beats und Episoden schon bewegen — dann wird aus
„kostümierten" Entscheidungen ein Strategiespiel, und das Bauchgefühl verschwindet an der Wurzel.
