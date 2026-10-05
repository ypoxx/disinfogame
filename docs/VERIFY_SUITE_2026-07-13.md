# 🔬 Verify-Suite — drei nie durchgeführte Prüfungen (Erstspieler · Reachability · Robustheit)

> **Datum:** 2026-07-13 · **Anlass:** Owner-Frage „Was wurde noch gar nicht geprüft, was agentisch
> prüfbar und lohnend ist?" → drei ausgewählte Lücken tatsächlich gebaut, ausgeführt, verifiziert.
> **Verhältnis zu den bisherigen Reviews:** `REVIEW_HOLISTISCH_2026-07-10` (Technik) und
> `KONZEPT_2026-07-12_HERAUSRAGEND` (Erlebnis) prüften Artefakte gegen Spezifikationen. Diese Suite
> prüft, was das System unter **Fremdheit, Zeit und Zufall** tut — die vier blinden Quadranten der
> bisherigen Prüf-Kultur.
> **Alle Ist-Zahlen aus echten Läufen** (Screenshots/JSON unter `runs/verify-suite/`, gitignored;
> Harnesse dauerhaft nachnutzbar). Agenten-Befunde adversarial gegengeprüft.

---

## 0. Das Wichtigste zuerst

| Prüfung | Ergebnis | Kernbefund |
|---|---|---|
| **Erstspieler-Verständnis** (5 kontextlose Probanden) | Akzeptanzkriterium **knapp erfüllt** (Ø 5,1/6) | Getragen von 2 beschrifteten Zielkarten, nicht vom Fluss; 3 neue Verständnis-Bugs |
| **Content-Reachability** (erste Gesamtkarte) | **43,3 % der Objekte / 27,4 % der Wörter tot** | Nicht Einzelfunde, sondern ein Struktur-Muster; alle 6 bekannten Funde reproduziert |
| **Robustheit** (Marathon + Chaos) | **0 Crashes / 0 Konsolenfehler**, aber Overlay-Stapel systematisch | Erstmals Tag 40 erreicht (H-18 geschlossen); Overlay-Ausschluss fehlt (H-11-Klasse bestätigt) |

**Meta-Erkenntnis:** Die Prüfungen bestätigen die Diagnose der beiden vorherigen Reviews auf *härterer*
Beweisebene und liefern **fünf konkrete, kleine Fixes**, die kein bisheriges Review hatte — weil sie
nur unter echtem Spielbetrieb sichtbar werden.

---

## 1. Erstspieler-Verständnistest (das Akzeptanzkriterium, erstmals gemessen)

**Aufbau:** 5 kontextlose Proband-Agenten (2× Haiku als flüchtige Spieler, 2× Sonnet als
Normalspieler, 1× Opus als gründlicher Spieler) sahen ausschließlich die 12 Screenshots des
aktuellen Builds in Spielreihenfolge (Titel → Ende Tag 1), ohne Repo-/Code-Zugriff, und
beantworteten „Was ist das? Was tust du hier?" je Screen plus 6 Verständnisfragen. Ein Auswerter
scorte gegen den Kanon-Antwortschlüssel. **Damit ist der beste Proxy für den noch ausstehenden
L8-Playtest erstmals gemessen** — bisher war das Kriterium „Neuling versteht die zwei Läufer" reine
Behauptung.

**Ergebnis: JA, knapp erfüllt** — Ø **5,1/6**; alle 5 benennen den Wahltag (Tag 40) als Deadline,
4/5 erklären beide Rennläufer im Kern korrekt. Selbst der flüchtigste Haiku-Spieler kam auf 3,5/6.

**Aber der Träger ist gefährlich schmal:** Das Verständnis hängt an **zwei beschrifteten
UI-Stellen** — dem „DAS RENNEN"-Block im Lagebild und der Zielkarte „ABWEHR 8/100 — bei 100 ist
Schluss" (3/5 zitieren sie wörtlich). *Beschriftete Zielkarten schlagen den Spielfluss.* Wo die
Beschriftung fehlt oder mehrdeutig ist, bricht das Verständnis sofort.

**Drei neue, vorher unbekannte Verständnis-Bugs (mit Spielerzitat):**
1. **„Nicht enttarnt werden — unter 85 halten" wird invertiert gelesen** (2/5, *inkl. des
   gründlichsten Probanden*): „Verlieren, wenn der Wert *unter* 85 fällt." Die Formulierung ist
   grammatikalisch kippbar. → Fix: steigende Gefahrenanzeige **„Enttarnung 12/85 — bei 85
   aufgeflogen"**.
2. **Tageszählung stolpert** (4/5): Lagebild „Tag 1" → Tagesbericht „Tag 2" direkt danach; der
   Bericht trägt offenbar das Folgetags-Datum. Zitat: *„Warum heißt es 'Tag 2', wenn ich gerade Tag 1
   beendet habe?"* → Fix: konsistente Tageszählung über alle Panels.
3. **Abwehr-*Genese* steht nirgends** (nur 2/5 leiten sie her, 1/5 baut ein *falsches* Modell:
   „Abwehr drückt die Umfrage direkt runter"). Der Zustand wird kommuniziert, der Mechanismus nicht.
   → Fix: ein Onboarding-Satz **„Je lauter ihr sendet, desto schneller lernt das Land."**

**Bestätigt (deckt sich mit dem Erlebnis-Review):** Die **Narrativ-Tafel ist der schwächste Screen**
(3/5; Werte werden auf dem Kork-Rauschen verlesen/vertauscht) → stützt Konzept #16. Der **Kernloop
Terminal→Anheften→Ausspielen→Bericht wird an Tag 1 nie einmal demonstriert** (beide Berichte zeigen
„kein Stück ausgespielt") → stützt den Tag-0-Hoax (#10). **FRISCH/BEKANNT/VERBRANNT existiert für
flüchtige Spieler nicht** (nur FRISCH kommt vor, unerklärt) → stützt #13/#19. Zusätzlich billigster
Fix im Set: die **K/M/A/K/I-Hotkey-Leiste** ist für **5/5** komplett unbeschriftet.

**Positiv bestätigt:** Onboarding-Kette Titel→Ankunft→Avatar→Akte→Chef ist fehlbedienungsfrei (alle
5 wissen jederzeit, was zu klicken ist), das Terminal wird sofort als Maßnahmen-Katalog verstanden,
der Tagesrhythmus (Briefing→Feierabend→Bericht) wird von allen erkannt.

---

## 2. Content-Reachability-Gesamtkarte (erste Gesamtmessung)

**Aufbau:** Statischer Trigger-Graph-Walker (`content-reachability.mjs`, 1022 Z., pures Node) baut
die Erreichbarkeits-Regeln der Engine als datengetriebene Checks nach — jede Regel zitiert ihre
Code-Fundstelle — und beurteilt **jedes** der 951 autorierten Content-Objekte als *erreichbar / tot /
unsicher*. Dazu eine **Wort-Gewichtung**: Zeichen aller spielersichtbaren `*_de`-Textfelder → „X %
der geschriebenen Wörter sind unerreichbar". Ergänzt um eine dynamische Schicht
(`content-coverage.test.ts`): 24 Sim-Partien zeichnen die tatsächlich gesehenen IDs auf.

**Kernzahl: 43,3 % der Objekte (412/951) tot · 27,4 % der geschriebenen Wörter (3.970/14.509)
unerreichbar.** Das ist die erste Zahl, die das Muster hinter den Einzelfunden beziffert: *Fast jedes
stichprobenartig geprüfte Subsystem hatte tote Anteile — die Karte zeigt, dass es die Regel ist.*

**Wo der tote Content liegt (Top-Cluster nach Wörtern):**
| Datei | tot | tote Wörter | Ursache (Fundstelle) |
|---|---|---|---|
| dialogues.json | 148/263 | ~1.500 | Briefings/Krisen/Ambient(100!)/Erstbegegnung/Game-End-Dialoge **ohne UI-Aufrufer** |
| topics_dialogues.json | 102/140 | ~1.000 | „deep"-Ebene + Response-Texte werden nie angefordert (UI ruft nur `intro`) |
| consequences.json | 21/24 | ~505 | **NaN-Wahrscheinlichkeit** (H-01), feuern nie |
| countermeasures.json | 25/28 | ~267 | reaktiver Pfad `checkForCountermeasures` ohne Aufrufer |
| EndingSystem.ts | 56/86 | ~100+ | 6/8 Kategorien tot **und alle 56 Enden-Titel erreichen die UI generell nie** |
| world-events.json | 10/80 | ~105 | `objective_progress` zeigt auf nicht-existente Kategorien; tote Kaskaden |

**Validierung bestanden:** Alle 6 bekannten Einzel-Funde exakt reproduziert (H-01: 21/24; Enden 2/8
Kategorien live; H-15 Briefing-Schwellen; H-17 `actions_unlocked` ungelesen; 12/21 Inserts ungenutzt;
5 relationship-Tags ohne Ziel). Abweichungen erklärt und dokumentiert.

**Dynamische Bestätigung (24 Partien):** Nur **36 von 143 Aktionen** werden von den Strategien je
gespielt, **0 von 24 Konsequenzen** feuerten (H-01 dynamisch belegt), Enden nur victory (21×) +
exposed (3×) — die anderen Zweige blieben ungesehen. 13/13 Episoden werden angeboten, 8 abgeschlossen.

**Konzeptionelle Bedeutung:** Die teuerste Projekt-Ressource — autorierter, oft exzellent
geschriebener Text — ist zu über einem Viertel unsichtbar. Das ist kein Bug-Report, sondern das
stärkste Argument für die im Erlebnis-Review geforderte Verdrahtung (Gewissens-Schicht #8, tote
Konsequenzen als Erlebnis-Ziel, Enden-Bausteine #2): *Der Content muss nicht geschrieben werden — er
muss angeschlossen werden.*

---

## 3. Robustheit: Marathon-Läufe + Chaos-Monkey (erstmals bis Tag 40)

### 3a. Engine-Langlauf-Gate (`day40-marathon.test.ts`)
**Erstmals in der Projektgeschichte erreicht etwas Tag 40** (H-18 war: „kein Test fährt real bis zum
Wahltag"). Alle 6 Läufe (passiv/sparsam × Seeds 11/23/42): **endDay 40, sauberer Timeout-Verlust**
(„Election Night Lost"), Abwehr blieb niedrig (~27), **0 Monotonie-Verletzungen, 0 Fälle
Tag>Wahltag-ohne-Ende, 0 Exceptions**. Das ist ein doppelter Positivbefund: die 40-Tage-Grenze hält
strukturell, **und** passives Spiel verliert jetzt mechanisch sauber am Wahltag (nicht durch einen
Bug früher). Als dauerhaftes Gate eingecheckt.

### 3b. UI-Marathon (`ui-marathon.mjs`) — der als fragil gefürchtete Pfad trägt
**32 aufeinanderfolgende Spieltage rein über die sichtbare UI** (FEIERABEND-Knopf, echte Klicks),
**0 VQA-Workarounds, 0 Konsolenfehler, 9,6 Min**. Der in `PLAYTEST_PERSONAS_TEIL2` als „im Container
fragil" markierte mehrtägige Tageswechsel ist damit widerlegt — er funktioniert über Dutzende Tage.
**Zwei echte Befunde:**
- **Früh-Sieg reproduziert *durch die UI*** (H-14): Der Lauf endete an **Tag 32** mit „victory",
  nicht am Wahltag — die gebaute End-Dramaturgie (Tag 33–40) fand nicht statt. Härtester Beleg für
  Konzept #1 (Sieg an den Wahltag binden), erstmals über den echten Spielerpfad statt nur Headless.
- **Krisen-Modal blockiert den Tageswechsel** (Run 1, Tag 6): Bei aktivem Krisen-Modal fehlte der
  FEIERABEND-Knopf, kein Tag+1 (`dom_tag6_feierabend_fehlt.html` als Beleg). Erst der zweite Anlauf
  kam durch. → Ein blockierendes Modal ohne sichtbaren Ausweg ist ein echtes UX-/Robustheits-Risiko.

### 3c. Chaos-Monkey (`chaos-monkey.mjs`) — Robustheit gut, Overlay-Disziplin fehlt
Seeded Zufalls-Input (60 % Klick, 30 % Hotkey, 10 % Mausrad), 3 Seeds × ~1.800 Schritte = **~5.500
Zufalls-Aktionen**. **Robustheits-Kernbefund: 0 Konsolenfehler, 0 Crashes, das Spiel blieb
durchgängig spielbar** — für ein modal-lastiges Web-Spiel ein starkes Ergebnis.

**Ein echter Befund (adversarial verifiziert):** 59 „Modal-Stapel"-Verletzungen — in **~54 von 59
Fällen ist die ZIELGRUPPEN-ANALYSE (Vortest) beteiligt und schließt nicht, wenn ein anderes Overlay
öffnet.** TASTENKÜRZEL, METHODEN-DOSSIER und sogar ein **Entscheidungs-Beat („Der Nebel")** stapeln
sich darüber. Das ist dieselbe Architektur-Klasse wie H-11 (ESC-Doppelwirkung: keine
Overlay-Ausschluss-Disziplin), hier erstmals *systematisch* belegt — und besonders relevant, weil ein
Entscheidungs-Beat (eine blockierende Erzählwahl) unter Info-Overlays begraben werden kann. → Fix:
eine zentrale Overlay-Stack-Regel (max. 1 Ebene; Öffnen eines Overlays schließt konkurrierende), das
Muster liegt in `TerminalView`/`NarrativeBoard` bereits vor.

**Adversarial widerlegt (Ehrlichkeit):** (a) ~4 der 59 „Stapel"-Treffer waren **Detektor-Artefakte**
(ein `role=dialog`-Element mit `@keyframes`-Text = Newsticker, kein Modal). (b) Alle 3
„raf_steht"-Verletzungen waren **kein Freeze**, sondern Zähler-Resets `N → 0` (die Seite
remountete/lud neu; das Rendern fror nicht ein). Beide sind Grenzen der Invarianten-Heuristik, keine
Spiel-Bugs — hier bewusst nicht als Befund gezählt.

---

## 4. Was diese Suite den Prioritäten hinzufügt

Keine neue Baustelle — **Verschärfung und Präzisierung bestehender Konzepte mit härterem Beweis:**
- **Fünf neue kleine Fixes** (kein bisheriges Review hatte sie, weil sie nur live sichtbar werden):
  Enttarnungs-Ziel als steigende Gefahr, konsistente Tageszählung, Abwehr-Genese-Satz,
  K/M/A/K/I-Beschriftung, Krisen-Modal mit sichtbarem Ausweg.
- **Härtere Belege** für Kern-Konzepte: H-14 (Früh-Sieg) jetzt *durch die UI* an Tag 32; die
  Tafel-Unlesbarkeit (#16) und der undemonstrierte Kernloop (#10) durch echte Neulinge bestätigt.
- **Eine neue Leitzahl:** „27,4 % der geschriebenen Wörter sind unerreichbar" — das
  quantitative Rückgrat des „Content anschließen statt schreiben"-Arguments.
- **Overlay-Stack-Regel** als konkrete, systemisch belegte Architektur-Aufgabe (H-11 verallgemeinert).

**Positiv-Bilanz (wichtig fürs Vertrauen in die Basis):** kein Crash über ~5.500 Chaos-Schritte,
saubere Tag-40-Grenze, mehrtägiger UI-Betrieb trägt, Onboarding-Kette fehlbedienungsfrei — das
Fundament ist robuster als die Menge offener Konzepte vermuten lässt.

---

## 5. Artefakte & Reproduktion

**Dauerhaft nachnutzbare Harnesse (eingecheckt):**
- `desinformation-network/src/story-mode/tests/day40-marathon.test.ts` — Engine-Langlauf-Gate
- `desinformation-network/src/story-mode/tests/content-coverage.test.ts` — dynamische Coverage
- `desinformation-network/scripts/verify-suite/content-reachability.mjs` — statische Karte
- `desinformation-network/scripts/verify-suite/ui-marathon.mjs` — mehrtägiger UI-Durchlauf
- `desinformation-network/scripts/verify-suite/chaos-monkey.mjs` — seeded Input-Sturm

**Läufe (gitignored, reproduzierbar):** `runs/verify-suite/` — Reachability-JSON+MD,
Coverage-JSON, Marathon-JSON, UI-Marathon-Report+Shots, Chaos-Report+Violation-Screenshots.
Erstspieler-Rohantworten in der Session archiviert.

**Methodik:** Alle Agenten-Befunde adversarial gegengeprüft (Overlay-Stapel Paar-für-Paar
klassifiziert, raf-Resets als Artefakt entlarvt, Reachability gegen 6 bekannte Funde validiert,
Erstspieler gegen Kanon-Schlüssel gescort). Modelle nach Aufgabe: Probanden Haiku/Sonnet/Opus
(Spieler-Diversität), Builder/Auswerter Fable. Kein Spiel-Code geändert; alle bestehenden Gates
grün (735 Tests), `tsc` sauber.
