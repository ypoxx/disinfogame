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

---

## 7. Nachtrag 2026-10-12 — Was sonst noch auffällt

Zweite Runde Sonden (drei zufällige 40-Tage-Partien mit Episoden-Annahme, Code-Lektüre der Uhr und der
Drama-Systeme). Nach Gewicht sortiert.

### 7.1 Vier Budgets, von denen der Spieler nur eines sieht
Aktionspunkte (5), **Kapazität** (5, Karten kosten 1–2), **Kasse** und die **Uhr** (09:00–18:00; Flur 10 min,
Etage 5 min, Tür 2 min; ein Besuch beim Kurator vom Empfang aus kostet 81 Spielminuten). Um 18:00 schickt das
Spiel den Avatar automatisch heim und öffnet den Tagesbericht — **auch mit 5 unverbrauchten AP**. Wer am ersten
Tag das schöne Gebäude erkundet, verliert den Tag, ohne einen Zug gemacht zu haben. Und die „acts=1"-Tage der
Sonde kommen nicht von den AP, sondern von der Kapazität. MadTV hat ein Budget und eine Uhr. Empfehlung:
**Kasse + AP, sonst nichts.** Kapazität in die Kasse falten, Uhr = AP (jede Aktion rückt die Uhr, Wege nicht).

### 7.2 Die Geschichte findet nicht statt
13 geschriebene Episoden, 24 Konsequenzen, ein 932-Zeilen-Verratssystem. In drei Partien:

| | angeboten | aktiviert | abgeschlossen |
|---|---:|---:|---:|
| Episoden | 10–13 | 2 (Brett-Cap ab Tag 2) | **0** |
| Konsequenzen (von 24) | | | 0–1 |
| Verrats-Ereignisse | | | 0 |
| Krisen | | | 4–6 ✓ |
| Stufen-Gegenmaßnahmen | | | 2 ✓ |

Die Tafel ist ab Tag 2 voll, die Angebote stapeln sich (11 offene Angebote an Tag 14), und keine Episode wird
je zu Ende erzählt, weil die Partie an Tag 14–16 endet. Der Spieler sieht von der Erzählung nur Anfänge.
Empfehlung: Episoden sind der **Wochenrhythmus** (eine pro Sonntagsfrage, mit Abschluss-Szene), nicht ein
Pool mit Cap. Konsequenzen an die Maschen-Wiederholung koppeln (die n-te gleiche Masche löst sie aus), damit
das Lehrstück „jede Aktion hat Folgen" auch stattfindet. Verrat entweder an einen Moral-Schwellenwert hängen,
der in 40 Tagen erreichbar ist, oder streichen.

### 7.3 Der erste Tag schickt in die Illegalität
Die drei ★-Empfehlungen an Tag 1 sind ILLEGAL (Bot-Netz, Troll-Fabrik, Fake-Account-Farm) mit dem Chip
„Konsequenz wahrscheinlich"; die legale Zielgruppen-Analyse (3K, kein Risiko) trägt keinen Stern. *Papers Please*
beginnt harmlos und wird Tag für Tag schmutziger — das ist der Sog. Hier ist es umgekehrt. Empfehlung: Akt 1
legal/grau (Analyse, Themen setzen, Frontmedium), Akt 2 grau/illegal, Akt 3 Kompromat. Die Eskalation ist die
Dramaturgie **und** der Lernmoment.

### 7.4 Vier Wege zum selben Ziel
Terminal erreicht man per Hotkey A, Büro-Hotspot ①, Tafel-Knopf, Menü. NPCs per Raum-Klick, Reiter rechts
(KV/MP/AP/KO/IS), Berater-Panel P. Jede Schicht kam in einer Session dazu, keine ging weg. Jede Redundanz
ist für den neuen Spieler eine Frage („ist das dasselbe?"). Empfehlung: **Raum = Ort, Hotkey = Abkürzung**,
sonst nichts. Reiter rechts und Büro-Hotspots fallen, das Büro wird ein Raum wie jeder andere.

### 7.5 Wörter, die sich beißen
- **Anrede:** Kurator und Dialoge sagen „Sie", Mission-Panel und Tafel sagen „du" („diese Werte sollst du
  bewegen", „wählst du am Terminal"). Zwei Stellen gegen 27 — schnell gefixt, aber es fällt sofort auf.
- **„ARCHIV (88)"** für gesperrte Aktionen: Archiv klingt nach Vergangenheit. „GESPERRT" oder „SPÄTER".
- **Drei Risikobegriffe:** Karte „Risiko +5 %", HUD „Abwehr 8", Bericht „Risiko 0 % / Aufmerksamkeit 0 %". Das
  Zielbild wollte eine Gegner-Zahl; Risiko und Aufmerksamkeit gehören aus jeder Anzeige.
- **Zwei Fünfen:** Kapazität 5 und AP 5 stehen nebeneinander, die Karte zeigt „2" — der Spieler liest AP.
- **Drei Namen:** „Operation: Westunion" (Titel), „Desinformation Network" (README/Paket), „Das Rennen um
  Westunion" (Zielbild). Vorschlag zum Nachdenken: **„Sonntagsfrage"** — ein Wort, jeder im Land versteht die
  Prämisse, und der Wahlbalken ist das Logo.

### 7.6 Der Bildungszweck ist ein Disclaimer, kein Hook
Die gelbe Box auf dem Titel liest sich wie Kleingedrucktes. Dabei ist die Prämisse der Hook: **„Du spielst die
Gegenseite. Danach erkennst du sie."** Als Untertitel statt als Warnung. Das Methoden-Dossier (18 reale Fälle)
wird dann zur Belohnung: Ein Eintrag schaltet sich frei, wenn man die Masche benutzt hat — nicht als Lexikon
von Tag 1.

### 7.7 Das Projekt dokumentiert mehr, als es spielt
STATUS.md hat 53 KB, es gibt Dutzende Pläne, Fremdmodell-Jurys, Doppel-Review-Kontrakte und 843 Tests — und
keine einzige zu Ende gespielte Partie. Jede Session hat ein Dokument und eine Wache hinterlassen, nie das
Gefühl des Spielers. Das ist keine Kritik an der Sorgfalt, sondern eine Erklärung, warum das Spiel trotz allem
nicht spaßig ist: **Spaß wird nicht getestet, nur gemessen.** Empfehlung für die nächsten Etappen:
- Jede Session endet mit **zehn Minuten Spielen durch dich**, nicht mit einem Statusdokument.
- Die Headless-Sonde (2 Sekunden Laufzeit) wird die Dauer-Messlatte für Tempo, Leerlauf und Erzähl-Reichweite.
- Doku-Freeze bis E2: nur dieses Dokument und STATUS werden fortgeschrieben.

### 7.8 Technik-Randnotiz
Alles landet in drei Dateien: `StoryEngineAdapter.ts` (7.884 Zeilen), `useStoryGameState.ts` (1.927),
`StoryModeGame.tsx` (1.853). Für E1–E4 sind die Änderungen klein, sitzen aber genau dort. Das ist beherrschbar,
weil die Tests greifen — es heißt nur: pro Etappe ein PR, nicht pro Idee.

---

## 8. Nachtrag 2026-10-12 — Raum für Raum

Alle zehn Räume des Gebäudes besucht (über das Etagen-Verzeichnis), jeden NPC angesprochen, die erste Option
gewählt, den Weg NPC → Anheften → Narrativ-Tafel → Ausspielen zu Ende gespielt. Zuerst die Gesamtschau, damit
die Einzelvorschläge sich nicht widersprechen; dann die Räume.

### 8.1 Gesamtschau — die Regel, nach der alles sortiert ist

**Jeder Raum hat genau ein Verb, und jedes Verb gibt es genau einmal.** Heute verkaufen vier NPCs dieselben
Terminal-Aktionen noch einmal (als Dialog-Option), Marina hat zwei Räume, die Analyse-Abteilung wiederholt, was
der Frische-Stempel auf der Karte längst zeigt, das Büro ist ein Hub mit fünf Türen zu Dingen, die es auch per
Taste gibt. Das ist die Quelle der „vier Wege zum selben Ziel" (§7.4).

Zweite Regel: **Es gibt nur EIN Ausführungsmodell.** Heute führt das Terminal sofort aus („AUSFÜHREN"), NPCs
heften an („liegt jetzt auf dem Sendeplan"), die Tafel spielt angeheftete Karten aus. Dreimal dieselbe Sache,
zweimal mit Umweg. Vorschlag: **Sofort ausspielen, überall** — das passt zu H1 (Stempelzeile pro Aktion) und zur
Sucht-Schleife (Klick → Antwort). Die Tafel wird dadurch vom Warteschlangen-Werkzeug zum **Story-Brett**: Sie
zeigt die laufenden Stränge und deren offene Schritte (die Antwort auf „was mache ich JETZT?"), nicht eine Queue.
„Anheften" und „Tagesgeschäft" entfallen.

Dritte Regel: **Räume ziehen, sie warten nicht.** Eine Tür leuchtet, wenn dahinter etwas Neues liegt (Marina hat
eine Episode, Igor eine Tranche, der Kurator eine Mahnung). Ohne das Signal sind zehn Räume zehn Fragen; mit
dem Signal sind sie ein Postfach.

So sieht das Gebäude danach aus (Hotkeys = Abkürzungen zu Räumen, nicht eigene Welt; das ergänzt §3/H7 um
**N** für den Newsroom, also vier Buchstaben plus Esc):

| Raum | Das eine Verb | Was dorthin wandert | Was wegfällt | Taste |
|---|---|---|---|---|
| Ihr Büro | **Maßnahmen ausspielen** (Terminal) | — | Hotspots Tafel/Lagebild/Welt-Ereignisse | A |
| Kurator / Zentrale | **Auftrag & Geld** (Akte, Tranchen, Nachspielzeit, Akt-Wechsel) | Mission-Panel | seine 3 Verkaufs-Aktionen | M |
| Medien-Zentrum · Marina | **Themen & Episoden** (Wochenstrang, Themen im Aufwind) | Narrativ-Tafel als Story-Brett, „Themen im Aufwind" | ihre Analyse-Aktionen | T |
| Zielgruppen-Analyse | **Das Publikum** (acht Wohnzimmer groß, Fokusgruppe) | Broadcast-Wohnzimmer, Fokusgruppe | Marinas Vortrag, der Vortest als eigener Screen | B |
| Newsroom | **Die Welt** (TV, Gegenseite, Sonntagsfrage-Archiv, Weltereignisse) | Panels N und E | „Themen im Aufwind" (→ Marina) | N |
| Cyber-Lab · Alexei | **Ausbau Technik** (einmalige Infrastruktur) | Ausbau-Karten aus dem Terminal | seine Lore-Fragen als Liste | — |
| Feld-Operationen · Katja | **Ausbau Menschen** (Verbreiter, Kontakte, Kompromat beschaffen) | Verbreiter + Kompromat aus der Operations-Akte | ihre 3 Terminal-Aktionen | — |
| Finanzen · Igor | **Kasse** (Tranchen, Tarnfirmen, Einnahmen, Rabatte) | Kapazität (geht in die Kasse auf) | seine Terminal-Aktionen als Dialog | — |
| Operationszentrale | **Die große Operation** (Ziel × Schwäche → Ausspielen) | — | Verbreiter/Plattform-Schritte (→ Katja/Ausbau); **bis Akt 3 versiegelt** | — |
| Lobby | **Ankunft & Stimmung** (Pförtner, Morgenzeitung) | Morgenbriefing | eigener „Raum"-Status | — |

Geprüft gegen §3, §5 und §7: H1/H2 (Stempelzeile, bewegliche Zahl) gelten unverändert; H4 (Ausbau vs.
Maßnahme) bekommt hier seine Orte (Alexei, Katja, Igor = Ausbau; Büro = Maßnahmen); H5 (Publikum als Bühne)
bekommt einen Raum; H6 (Sonntagsfrage als Sendung) läuft im Newsroom; 7.1 (Kasse + AP) macht Igors Kapazität
überflüssig; 7.3 (Eskalation) versiegelt die Operationszentrale bis Akt 3; 7.4 (vier Wege) ist mit „ein Verb pro
Raum" erledigt. Kein Vorschlag unten widerspricht dem.

### 8.2 Die Räume

**Gebäude & Wege (gilt für alle).** Der Weg vom Empfang zum Kurator dauert ~7 s real und 81 Spielminuten;
ins Cyber-Lab noch länger. Das Etagen-Verzeichnis (F, oder Klick auf den Fahrstuhl) ist heute die beste
Navigation und sollte die Hauptnavigation sein: Klick auf ein Türschild oder einen Eintrag, Avatar läuft
maximal 1,2 s, zweiter Klick = sofort da, **keine Spielzeit**. Die NPC-Reiter rechts (KV/MP/AP/KO/IS) öffnen
heute das Berater-Panel mit „Keine Empfehlungen" — sie fallen weg (Raum = Ort). Türen bekommen ein
Neu-Signal (Licht, Stern am Schild) — s. dritte Regel.

**Dialog-Box (gilt für alle NPC-Räume).** Die Box liegt über der Figur: Von Marina und Katja sieht man nur
Haare und ein Auge. Box nach links (60 % Breite), Figur rechts frei. Jeder NPC hat 5–6 „Über …"-Fragen, die
immer dieselben Erklärtexte liefern — in ein „Fragen ▸"-Untermenü, und einmal gelesen = abgehakt. Die
Schreibmaschine läuft mit 45 ms/Zeichen; **Leertaste während des Tippens schließt den Dialog samt Optionen,
statt den Text zu vollenden** (in vier von fünf Räumen reproduziert) — das ist ein Bug, kein Stilmittel.

**1 · Lobby / Empfang.** Der Pförtner reagiert auf keinen Klick (bekannter offener Befund in STATUS). Er ist
die beste Figur für den Tagesbeginn: Statt des Morgenbriefing-Modals reicht er die Zeitung (Sonntagsfrage,
ein Gerücht aus den Wohnzimmern, ein Satz vom Kurator). Der Fahrstuhl-Klick öffnet das Verzeichnis — das ist
richtig und bleibt. Als „Raum" im Verzeichnis braucht die Lobby keinen Eintrag.

**2 · Direktor / Zentrale (Kurator).** Heute begrüßt er und bietet drei Aktionen an (Kampagnenziele, Tarnverein,
Schein-NGO) — derselbe Katalog wie im Terminal, nur ohne Masche, Milieu und Frische-Stempel. Der Kurator ist
der Boss, kein Verkäufer: Sein Raum ist die Akte an der Wand (Stand je Achse, Tranchen-Stand, nächste
Mahnung, Nachspielzeit) und die Akt-Wechsel-Szenen. Das Mission-Panel (M) wird die Abkürzung hierher und
verliert die alten Hauptziele („destabilisieren 100 → 40").

**3 · Ihr Büro.** Fünf Hotspots (Aktionen, Tafel, Lagebild, Welt-Ereignisse, Feierabend). Lagebild wiederholt
das HUD plus Team-Moral, Welt-Ereignisse ist an Tag 1 leer und sonst der Newsroom. Das Büro behält zwei Objekte:
das **Terminal** (das Spiel-Verb) und den **Fernseher** (Sprung in Publikum/Newsroom), dazu die Tür und
Feierabend. Das Terminal öffnet an Tag 1 nach dem Briefing von selbst (§3 H7).

**4 · Operationszentrale (Operations-Akte).** Der ambitionierteste Screen: Ziel (9 Archetypen) → Schwäche →
Verbreiter (8) → Plattform (5) → Ausspielen, mit Wirkungs-Vorschau. Für Tag 1 zu viel und zu früh: „Es fehlt
noch: Schwäche, Verbreiter, Plattform" nach dem ersten Klick. Vorschlag: Der Raum ist **bis Akt 3 versiegelt**
(Siegel auf der Tür, der Kurator bricht es: „Die Zentrale genehmigt Operationen gegen Personen.") — das ist die
Eskalation aus §7.3 als Ort. Verbreiter-Aufbau und Kompromat-Beschaffung wandern zu Katja (Ausbau, Akt 1–2),
so dass die Akte in Akt 3 nur noch **Ziel × Schwäche × Kanal → Ausspielen** ist: drei Klicks. Die Kürzel
RW/GLB/RISK werden Wörter (Reichweite, Glaubwürdigkeit, Risiko).

**5 · Cyber-Lab (Alexei).** Bietet die drei illegalen Tag-1-Empfehlungen (Bot-Netz, Troll-Fabrik, Fake-Profile)
plus Lore. Alexei wird der **Ausbau-Raum Technik**: alle einmaligen Infrastruktur-Karten (Bots, Trolle, Konten,
Hosting, Opsec) liegen nur hier, als Werkstatt-Tafel mit Stufen („Bot-Netz: Stufe 0 → 1, 12K"), nicht als
Dialog-Option. Seine Warnung „Infrastruktur-Defizit: 5 Level" wird damit zum sichtbaren leeren Regal statt
zu einem Berater-Satz. Reihenfolge-Lehre: Erst Ausbau, dann wirkt die Maßnahme stärker — das erklärt sich
selbst, wenn die Maßnahmen-Karte „ohne Verstärker: Wirkung ×0,5" zeigt.

**6 · Medien-Zentrum (Marina).** Der stärkste NPC-Moment des Spiels: „★ Die Brücke, die zweimal steht" —
eine Episode mit Frage („der leise Keil oder der laute Graben?"), drei Schritten, Korkbrett-Faden. Das ist
genau der Wochenrhythmus aus §7.2 und sollte **ihr einziges Angebot** sein: pro Sonntagsfrage eine Episode,
mit Abschluss-Szene bei ihr. Ihre Analyse-Aktionen (Zielgruppe, Stimmung, Bilanz) fallen weg oder werden
Episoden-Schritte. „Themen im Aufwind" (heute im Newsroom) gehört zu ihr — Themen sind Produktion, nicht Welt.

**7 · Zielgruppen-Analyse (Maschen-Vortest).** Drei Absätze Marina-Monolog hinter „Verstanden", dann ein
Vortest für acht Milieus — Marina also in zwei Räumen, und der Vortest wiederholt, was die Terminal-Karte mit
FRISCH/BEKANNT/VERBRANNT je Milieu schon zeigt. Vorschlag: Der Raum wird **das Publikum** (§3 H5): die acht
Wohnzimmer groß, jedes mit seinem Bild (Küchenstreit, Abwinken, Parteifahne), dazu die Fokusgruppe als
Klick ins Wohnzimmer. Taste B springt hierher; die Broadcast-Leiste unten zeigt weiterhin das Mini-Bild.

**8 · Newsroom.** An Tag 1 dunkel: „Aufklärung 0 %", „0 Beiträge", fünf Milieu-Balken. Der richtige Raum für
**die Welt**: der laufende Sender (Zielbild: „die WELT darf laut sein"), die Gegenseite mit ihren Stufen
(Prebunking, Faktencheck, Task-Force — das Immunsystem bekommt hier sein Gesicht als Sendung), das
Sonntagsfrage-Archiv als Kurve, die Weltereignisse. Die Panels N (Nachrichten) und E (Ereignisse) gehen darin
auf. Leerzustand an Tag 1: Testbild plus „Sendebeginn mit Ihrer ersten Maßnahme" — und der erste Beitrag
sollte noch am selben Tag laufen.

**9 · Feld-Operationen (Katja).** Bietet Dossier, Beobachtung, Akademiker-Anwerbung plus Lore. Katja wird der
**Ausbau-Raum Menschen**: Verbreiter aufbauen (Influencer, Ex-Politiker, Rand-Akademiker, Schein-NGO,
Frontmedium — heute in der Operations-Akte vergraben) und Kompromat beschaffen (Akt 2). Ihr Raum zeigt das
„Netz" als Liste mit Aufbaustand („Frontmedium: Tag 2 von 2"). Sie ist damit die Frau fürs Grobe, wie ihr Text
es verspricht.

**10 · Finanzen / Tresor (Igor).** Bietet Tarnfirma, Parteifinanzierung, Krypto-Spenden („-22K" — ein
negativer Preis als Einnahme, das versteht niemand: „+22K Einnahme"). Igor wird die **Kasse**: Tranchen der
Zentrale (E18, mit Fortschritts-Anzeige „nächste Tranche bei 14 %"), Tarnfirmen als Ausbau (Rabatte),
Einnahme-Züge mit Risiko, und die Pleite-Mahnung als Szene bei ihm statt als Zahl. Kapazität verschwindet
(§7.1), dann ist er der einzige Ort, an dem Geld erklärt wird.

### 8.3 Drei Sätze zur Reihenfolge
Nichts davon braucht neue Grafik; jeder Raum hat sein Bild. Die Reihenfolge folgt den Etappen aus §5: In **E1**
fallen Reiter, Hotspots und Verkaufs-Dialoge (Subtraktion, ein Ausführungsmodell); in **E3** bekommen Alexei,
Katja und Igor ihre Ausbau-Tafeln und die Operationszentrale ihr Siegel; in **E4** werden Zielgruppen-Analyse
das Publikum und der Newsroom die Welt. Marinas Episode läuft ab E2 im Wochenrhythmus.
