# 🎯 Diagnose 2026-10-11 — Warum das Spiel noch nicht süchtig macht, und was es dazu braucht

**Status:** Aktiv · **Scope:** Story Mode · **Kanonisch für:** Spielspaß-Prioritäten bis zum ersten echten Playtest
**Grundlage:** Ein frischer Durchgang im Browser (Titel → Akte → Tag 1 → Tagesbericht, alle Panels, alle Hotkeys),
eine Headless-Sonde über drei Spielweisen (40 Tage, seed-fest), Code-Lektüre der Engine, Daten gezählt.
Gate beim Durchgang: `tsc 0 · vitest 843/843 · build grün · 0 Konsolenfehler`.

---

## 0. Das Urteil in fünf Sätzen

1. **Das Spiel sieht aus wie ein fertiges Spiel** — Titelbild, Gebäude, Räume, Porträts, Wohnzimmer, Akte: das ist
   Veröffentlichungs-Niveau und ein echter Trumpf. Niemand muss hier etwas neu malen.
2. **Es spielt sich aber noch nicht wie eines.** Die eine Zahl, um die alles geht (Sonntagsfrage), bewegt sich nach
   der ersten Aktion nicht. Dafür bekommt man ein Ergebnisfenster mit acht Milieus, zwei Gesellschaftswerten,
   Wirksamkeit, Effekten und NPC-Reaktion.
3. **Das Rennen hat kein Ziel.** Wer aggressiv spielt, gewinnt an **Tag 13 von 40**. Der Wahlabend, auf den die
   ganze Inszenierung zuläuft, findet für die meisten Spieler nie statt; „WAHL IN 39 T." ist Dekoration.
4. **Es gibt zu viele Türen und zu wenig Verben.** 14 Hotkeys, fünf Büro-Hotspots, zehn Räume, fünf NPC-Reiter,
   eine Narrativ-Tafel, die an Tag 1 leer ist — aber an vielen Tagen nur **ein bis zwei** spielbare Maßnahmen.
5. **Die Lösung ist kein neues System, sondern Subtraktion plus drei Mechanik-Korrekturen.** Alles, was es für
   ein süchtig machendes Spiel braucht, ist bereits im Code; es ist nur falsch verkabelt oder verdeckt.

Die Vergleiche, die im Kopf entstehen sollen — *MadTV* (jeden Tag ein Programm, abends die Quote), *Plague Inc.*
(eine Karte, eine Zahl, sichtbare Ausbreitung), *Papers Please* (Tagesrhythmus mit Abendbilanz) — sind alle
erreichbar. Aber nur, wenn das Spiel pro Tag **eine Frage** stellt und **eine Antwort** gibt.

---

## 1. Was ein neuer Spieler erlebt (Protokoll)

| Schritt | Beobachtung | Bewertung |
|---|---|---|
| Titel | Hochhaus bei Nacht, roter Knopf, ein Satz Prämisse | ★★★★★ sofort verständlich |
| Personalakte (Avatar) | 6 Porträts, Deckname | ★★★★ gut, könnte Teil der Ankunft sein |
| Ankunft (Gebäude) | Avatar läuft durch Lobby/Fahrstuhl, Untertitel | ★★★★ atmosphärisch, überspringbar |
| Die Akte | „Das Ziel steht in der Akte." Start 9 %, Zielstrich, Wahltag 40 | ★★★★★ **der beste Moment des Spiels** |
| Kurator-Dialog | Schreibmaschine mit 45 ms/Zeichen → ~9 s für eine Zeile | ★★ man wartet |
| Morgenbriefing | „Öffnen Sie das Terminal (Taste A)" | ★★★ okay, aber ein Klick zu viel (warum nicht gleich öffnen?) |
| Terminal | 8 Vorgänge, 88 im Archiv, Karten mit Kosten/Masche/Frische-Stempel | ★★★★ gut lesbar, Stern-Empfehlung hilft |
| **Erste Aktion → Ergebnis** | Grüner Banner „✓ AKTION ERFOLGREICH", Wirksamkeit 50 %, Informationslast +1, Vertrauen −1, 8 Milieus, Effekte, NPC-Reaktion. **Sonntagsfrage: 9,0 % → 9,0 %.** | ★ **der Bruch**: viel Text, keine Antwort auf „hat es gewirkt?" |
| Raum anklicken (Kurator) | Avatar läuft ~6 s real, Spieluhr 09:00 → 10:21 | ★★ Warten; die Uhr kostet nichts Spielbares |
| NPC-Reiter (MP/AP/…) | „Keine Empfehlungen" bei vier von fünf | ★ wirkt tot |
| Mission (M) | Zeigt **noch das alte Ziel** „Westunion destabilisieren · Stand 100 · Ziel unter 40" neben der Sonntagsfrage | ★ widerspricht der Akte |
| Statistik (S) | Dasselbe alte Hauptziel, dazu Risiko/Aufmerksamkeit/Moral | ★ Buchhaltung ohne Konsequenz |
| Ereignisse (E) | „Keine Weltereignisse" | – leer an Tag 1 |
| Narrativ-Tafel (T) | Drei leere Spuren, Korkbrett | ★★ hübsch, aber ohne Inhalt unverständlich |
| Tagesbericht | Drei Spalten, Milieu-Balken, „Über Nacht: 0,0 Punkte · Abwehr +0,2" | ★★★ gute Form, an Tag 1 bedeutungslose Zahlen |

**Zeit bis zur ersten Entscheidung:** 6 Bildschirme. **Zeit bis zur ersten sichtbaren Wirkung auf das Ziel:**
je nach Spielweise 1 bis 8 Tage (s. §2).

---

## 2. Die Sonde: wie das Rennen wirklich läuft

Drei Spielweisen, je 1 Partie, seed-fest, 5 AP/Tag, identisch mit dem Sim-Gate (`winnable-and-losable.test.ts`).
SF = Sonntagsfrage (9 % + schwächste Achse × 18).

| Spielweise | Sieg an Tag | Aktionen gesamt | SF bewegt sich erstmals | Tage mit ≤ 1 Aktion |
|---|---:|---:|---:|---:|
| aggressiv (greedy) | **13** | 14 | Tag 1 | 10 von 12 |
| zufällig (random) | 22 | 32 | Tag 1 | 11 von 21 |
| vorsichtig (low_risk) | 28 | 49 | **Tag 8** | 11 von 27 |

Drei Befunde, die den Spielspaß direkt treffen:

- **Das Spiel endet, sobald die Schwelle steht — nicht am Wahltag.** `checkGameEnd` feuert den Sieg, sobald alle
  Achsen ihre Marke erreichen. Der 40-Tage-Countdown, der Wahlabend, die „Zitterpartie bis zum Schluss" aus dem
  Zielbild existieren mechanisch nicht. (Die Halte-Regel wurde abgeschafft, ohne dass der Stichtag ihren Platz
  einnahm.)
- **Die Min-Regel versteckt den Fortschritt.** Drei Achsen (Fraktion 25→55, Vertrauen 100→50, Zynismus 20→45),
  die Sonntagsfrage zeigt die *schwächste*. Wer vorsichtig anfängt, sieht **acht Tage lang 9,0 %**, obwohl er
  wirkt — genau die „versteckte Falle", vor der der Spieler-Anwalt im Zielbild gewarnt hat.
- **An den meisten Tagen gibt es fast nichts zu tun.** 5 AP, aber in der Sonde an 10 von 12 bzw. 11 von 21
  Tagen nur eine Aktion. Ursache: Die 143 Aktionen sind **einmalige Freischaltungen** (Tech-Baum), keine
  wiederholbaren Spielzüge. Nach dem Ausführen ist die Karte weg; das Deck läuft leer, der Spieler drückt
  „Phase beenden". Das Immunsystem (Frische-Stempel, Maschen-Gedächtnis) ist dafür gebaut, Wiederholung zu
  bestrafen — aber es gibt kaum Wiederholbares.

Dazu die bekannte Zahl aus STATUS: **zufälliges Spiel gewinnt 23 von 24 Partien**, vorsichtiges nur 18. Das
Spiel belohnt Würfeln über Planen. Solange das so ist, kann kein Spieler „gut werden" — und ohne das Gefühl,
besser zu werden, gibt es keine Sucht.

---

## 3. Die sieben Hebel (nach Wirkung pro Aufwand)

### H1 — Jede Aktion antwortet in einer Zeile, direkt an der Zahl *(Aufwand: klein, Wirkung: größte)*
Nach „AUSFÜHREN" erscheint **kein Modal**, sondern am HUD ein Stempel-Streifen:

```
VOLLZOGEN.   Sonntagsfrage +0,3 ▲   Abwehr +1   Kasse −12K        Alexei: „Die Infrastruktur hält."
```

Die Zahlen am HUD zucken (Delta-Pop, 600 ms), die Sonntagsfrage-Nadel wandert sichtbar. Details (Milieus,
Wirksamkeit, Effekte) bleiben erreichbar per Klick auf den Streifen — aber niemand muss sie lesen. Das grüne
„✓ AKTION ERFOLGREICH" fällt (Zielbild §12.8, Stempel-Regel). *Technisch:* `ActionFeedbackDialog` wird zur
Zusammenfassungszeile + „Details ▸"; die Delta-Daten liegen bereits im Ergebnis-Objekt.

### H2 — Die Sonntagsfrage bewegt sich bei JEDER wirkenden Aktion *(klein)*
Anzeige = **gewichtete Summe** der drei Achsen (oder: die *mittlere* Achse), Sieg-Check bleibt Min-Regel.
Unter dem Balken drei dünne Teilbalken (Fraktion · Vertrauen · Zynismus); die klemmende Achse rot umrandet,
NPC-Nebensatz nennt sie. Dann ist der Fortschritt ehrlich sichtbar und die Min-Regel keine Falle mehr.
*Alternative mit noch weniger Aufwand:* SF = 9 + Mittelwert × 18 für die Anzeige, Min nur im `checkGameEnd`.

### H3 — Kein Sieg vor dem Wahltag *(mittel, zweitgrößte Wirkung)*
Die Schwelle zu erreichen ist **nicht** der Sieg, sondern der Beginn des Endspurts:
- Ab „über der Schwelle" wacht das Land auf: Abwehr-Grundrauschen ×2, Prebunking-Welle, Kurator-Zeile
  („Jetzt sehen Sie alle hin. Halten Sie es.").
- Die Zentrale hebt die Marke an, wenn der Spieler sehr früh drüber ist (Spiegelbild der Nachspielzeit).
- Sieg = Sonntagsfrage über der Schwelle **am Tag 40** UND Abwehr < 100. Verlust-Wege bleiben.
- **Der Wahlabend läuft immer** — als Sieg- oder Niederlagen-Szene (`WahlabendScene` existiert).
Damit wird aus „Schwelle erreicht, Schluss" die Zitterpartie, die das Zielbild beschreibt, und die 40 Tage
bekommen Gewicht. Das Sim-Gate kalibriert man danach neu (Ziel: zufälliges Spiel gewinnt ~40 %, nicht 96 %).

### H4 — Wiederholbare Züge: Ausbau vs. Maßnahme *(mittel bis groß, die eigentliche Spieltiefe)*
Zwei Sorten Karten, sauber getrennt:
- **AUSBAU** (einmalig, ~30–40 Karten): Bot-Netz, Troll-Fabrik, Frontmedium, Experten-Pool … schaltet frei,
  senkt Kosten, öffnet Milieus/Kanäle. Das ist der heutige Tech-Baum, ehrlich benannt.
- **MASSNAHME** (wiederholbar, jeden Tag): **Masche × Milieu × Thema.** Die 18 Familien des `DisinfoMethodAtlas`
  sind die 18 Grundkarten; Ziel-Milieu und Thema wählt man dazu (Daten: `audience.json`, `topics_dialogues.json`).
  Der Frische-Stempel (FRISCH/BEKANNT/VERBRANNT) wird dadurch endlich zur zentralen Entscheidung: *Dieselbe
  Masche auf dasselbe Milieu verpufft — rotiere.* Das ist der Plague-Inc.-Kern: ein Ökosystem, das lernt.
Ergebnis: Jeden Tag 3–5 echte Entscheidungen, nie „nichts zu tun", und ein Spieler kann *besser werden*.
*Technisch:* `MaschenGedaechtnis` + `ImmuneSystem` + Frische-Stempel sind vorhanden; es fehlt die
wiederholbare Karte als Datentyp im `ActionLoader` und ihre Terminal-Darstellung.

### H5 — Das Publikum ist die Bühne, nicht die Fußleiste *(mittel, visuell)*
Die acht Wohnzimmer (Wohnzimmer-Alphabet, Zielbild §6) gehören **groß** ins Bild: eine Reihe von acht Fenstern
(z. B. als Häuserzeile oder als zweite Etage „Westunion" unter dem Gebäude), jedes mit dem Zustand als Bild —
Küchenstreit, Abwinken, Parteifahne. Kippt ein Milieu, kippt das Bild mit Szene und +3–5 Punkten. So *sieht*
man die Ausbreitung, statt sie in acht Balken zu lesen. Die Broadcast-Leiste mit TV + einem Wohnzimmer ist
der richtige Keim; sie ist nur zu klein und zeigt eins von acht.

### H6 — Der Fünf-Tage-Ritus: die Sonntagsfrage als Sendung *(klein)*
Alle fünf Tage schaltet das Spiel **automatisch** ins TV-Bild: Moderatorin, Balken alt → neu, Trendpfeil,
Sting, ein Kurator-Satz (Lob / Mahnung / Kürzung nach E18). Das ist die MadTV-Quote — der wiederkehrende
Moment, auf den man hinfiebert. Heute ist die Umfrage ein News-Eintrag, den man übersehen kann.

### H7 — Subtraktion: ein Verb pro Tag, der Rest sind Schubladen *(klein bis mittel)*
- **Hotkeys von 14 auf 4:** A Maßnahmen · B Publikum · M Akte (Mission + Stränge + Stand) · Esc Menü.
  Statistik, Ereignisse, Dossier, Etagen, Berater wandern ins Menü oder werden kontextuell geöffnet.
- **Mission- und Statistik-Panel bereinigen:** die alten Hauptziele („destabilisieren · 100 → 40", „Direktive:
  demokratische Institutionen untergraben") raus — sie widersprechen der Akte und verwirren sofort.
- **Berater-Panel** nur zeigen, wenn mindestens ein NPC etwas zu sagen hat; sonst spricht der NPC im Raum.
- **Narrativ-Tafel** erst einblenden, wenn der erste Strang existiert (Tag 2–3), mit Kurator-Einführung.
- **Tag 1–3 geführt:** Der Kurator gibt eine konkrete Tagesaufgabe („Heute: eine Masche auf die Abgehängten.
  Morgen sehen wir, ob sie beißt."). Andere Panels gesperrt, bis sie erklärt wurden (Progressive Disclosure).
- **Tempo:** Schreibmaschine 15 ms/Zeichen + Klick vollendet; Weg im Gebäude maximal 1,2 s real (zweiter Klick =
  sofort da); Spieluhr nur noch Deko oder = AP. Das Terminal öffnet an Tag 1 nach dem Briefing von selbst.

---

## 4. Was bleibt, was ruht

**Bleibt (ist gut):** Grafik komplett · Akte-Inszenierung · Gebäude + Avatar · Räume + Porträts + Stimmen ·
Terminal-Karten mit Frische-Stempel · Tagesbericht-Form · Wahlabend-Szene · Endreport · Methoden-Dossier
(18 Familien mit realen Fällen — der Lern-Kern) · Immunsystem/Maschen-Gedächtnis (die Mechanik der Zukunft) ·
Konsequenzen und Krisen als Drama-Momente · Sim-Gate und Tests.

**Ruht bis nach dem ersten Playtest (nicht löschen, nur nicht im Weg):** Statistik-Panel · Ereignis-Panel ·
Berater-Empfehlungen · Verrats-Indikatoren · Kombo-Hinweise · Fokusgruppe/Maschen-Vortest/Lagebild als eigene
Vollbild-Views (Inhalt ggf. in H1-Details einbetten) · die 8 Gesellschaftswerte in jeder Anzeige (intern bleiben
sie; sichtbar nur Sonntagsfrage, Abwehr, Kasse, Tag).

---

## 5. Reihenfolge (vier Etappen, jede endet spielbar)

| Etappe | Inhalt | Hebel | Erfolgskriterium |
|---|---|---|---|
| **E1 „Eine Zahl, jeder Klick"** | Stempel-Streifen statt Modal, SF bewegt sich immer, Panels bereinigt, Tempo | H1 H2 H7 (Teil) | Nach jeder Aktion weiß man in < 2 s, ob sie gewirkt hat |
| **E2 „Das Rennen hat ein Ziel"** | Kein Sieg vor Tag 40, Endspurt-Druck, Wahlabend immer, Umfrage-Sendung, Gate neu kalibriert | H3 H6 | Sim: zufällig ~40 % Sieg, aggressiv und vorsichtig je 30–60 %, jede Partie endet am Wahlabend |
| **E3 „Jeden Tag etwas zu tun"** | Ausbau vs. Maßnahme, 18 wiederholbare Maschen-Karten, Milieu-Wahl, Frische als Kernentscheidung | H4 | Sonde: an ≥ 90 % der Tage ≥ 3 sinnvolle Züge |
| **E4 „Die Bühne ist das Land"** | Acht Wohnzimmer groß, Kipp-Szenen, geführte Tage 1–3, Hotkeys auf 4 | H5 H7 | Ein Testspieler erklärt nach 5 Minuten selbst, worum es geht |

**Danach — und erst danach — der erste echte Playtest mit dir selbst am Steuer.** Zielmaß: Eine komplette
Kampagne in **30–45 Minuten**. Heute wären es bei 40 Tagen × (Wege + Modals + Schreibmaschine) mehrere Stunden,
und das ist der Grund, warum sie nie zu Ende gespielt wurde. Wenn 40 Tage zu lang bleiben: erste Kampagne
„Kommunalwahl" mit 20 Tagen, die 40-Tage-Wahl als zweite.

---

## 6. Drei Dinge, die man leicht übersieht

1. **Die Abwehr wächst auch ohne Gegner stark** (Sonde: 80+ an Tag 20 bei jeder Spielweise). Wenn H3 den Sieg
   nach hinten schiebt, muss das Grundrauschen sinken, sonst verliert jeder an Tag 30 am Immunsystem. Beides
   zusammen tunen, am Sim-Gate.
2. **Der Start ist ein Flaschenhals, nicht die Mitte.** Alle drei Spielweisen zeigen „acts=1" vor allem in den
   ersten zehn Tagen — Kapazität 5 und Vorgänge (8) reichen nicht. Tag 1 sollte 3 billige, sichtbar wirkende
   Züge erlauben; Ausbau kommt danach.
3. **Der Text ist überall gut — und überall zu viel.** Kurator-Zeilen, Tageshinweise, Karten, Berichte: einzeln
   stimmig, in Summe eine Wand. Die Regel „die WELT (TV) darf laut sein, die AGENTUR (UI) nie" aus dem Zielbild
   gilt auch für die Menge: Agentur-UI spricht in Stempeln, nicht in Absätzen.

---

*Belege: Browser-Durchgang mit Playwright (`runs/walk/`, Screenshots im Sitzungs-Scratchpad), Headless-Sonde
(temporäre Testdatei, nicht eingecheckt; Logik identisch mit `winnable-and-losable.test.ts` + Tages-Ausgabe),
`Auftraege.ts` (Signatur, `AUFTRAG_SIEG_SCHWELLE`), `StoryEngineAdapter.ts` (`getWahlabendData`, 9 + p·18),
`BuildingNavigator.ts` (Wegkosten), `DialogBox.tsx` (45 ms/Zeichen), `docs/STATUS.md` (72-Partien-Messung).*
