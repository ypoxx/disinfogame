# 🔀 Zwei Fremdmodelle über dieselbe Oberfläche — der Vergleich

**Läufe:** `stealth/ox-alpha` (2026-08-21, via OpenRouter) gegen `gpt-5.6-sol`
(2026-08-22, OpenAI direkt) · **Linse:** `ui` · **19 Bündel je Lauf**, gleiche Aufteilung,
gleiche Fragen.

> **Wozu ein zweiter Durchgang?** Ein Fremdmodell-Gutachten ist eine Hypothesensammlung.
> Zwei Gutachten aus **verschiedenen Häusern** über **dasselbe Material** trennen die Spreu:
> Was beide unabhängig sehen, ist mit hoher Wahrscheinlichkeit wirklich im Bild. Was nur
> eines sieht, kann ein feinerer Blick sein — oder eine Halluzination.

---

## 1. Die Zahlen

| Kategorie | Anzahl | Anteil | Was sie wert ist |
|---|---:|---:|---|
| **einig** — beide unabhängig | **254** | 39 % | belastbar, ohne weitere Beweisführung anfassbar |
| Widerspruch | 107 | 16 % | meist *gegenläufige Empfehlung* zur gleichen Beobachtung ⇒ Eigentümer-Entscheidung |
| nur ox-alpha | 124 | 19 % | einzeln zu prüfen |
| nur gpt-5.6-sol | 169 | 26 % | einzeln zu prüfen |

Von den 254 Einigkeits-Befunden: **6 Funktionsverlust · 86 stark · 144 mittel · 18 kosmetisch.**

Je Bündel:

| Bündel | einig | Wid. | nur ox | nur oai | | Bündel | einig | Wid. | nur ox | nur oai |
|---|---:|---:|---:|---:|---|---|---:|---:|---:|---:|
| intro | 18 | 8 | 9 | 9 | | ending-1von4 | 25 | 8 | 4 | 10 |
| dialog | 12 | 5 | 4 | 10 | | ending-2von4 | 16 | 4 | 4 | 9 |
| building | 17 | 6 | 4 | 6 | | ending-3von4 | 18 | 9 | 10 | 11 |
| panels-1von2 | 17 | 4 | 6 | 15 | | ending-4von4 | 17 | 8 | 6 | 7 |
| panels-2von2 | 15 | 6 | 7 | 14 | | clips-ambient1 | 9 | 6 | 8 | 6 |
| daynight | 11 | 5 | 6 | 8 | | clips-ambient2 | 8 | 4 | 11 | 5 |
| office | 3 | 1 | 10 | 19 | | clips-bewegung2 | 14 | 8 | 10 | 6 |
| broadcast | **0** | 5 | 0 | 0 | | clips-broadcast | 8 | 4 | 5 | 9 |
| rooms | 23 | 5 | 9 | 13 | | clips-daynight_sweep | 7 | 5 | 5 | 4 |
| daycycle | 16 | 6 | 6 | 8 | | | | | | |

Die beiden Ausreißer nach unten sind **keine** Meinungsverschiedenheiten, sondern
Materialprobleme — siehe §3.

---

## 2. Der überraschendste Befund: ein großer Teil war nie ein Design-Problem

Beim Neu-Erzeugen der Ernte kamen **drei verschiedene Fenster** zum Vorschein, die sich
über die Aufnahmen gelegt hatten — jeweils so lange, bis irgendwo im Skript etwas sie
wegräumte:

| Verdecker | Was er gekostet hat |
|---|---|
| Krisen-Modal (z-70) | das komplette Bündel `dialog` |
| Tagesbericht (Auto-Feierabend um 18:00) | `poster_detail`, `ambient_bubble` |
| anstehender Entscheidungs-Beat | `panel_news/stats/npcs/mission/events`, `shortcuts`, `hud_on`, `office` |

Damit erklärt sich einer der prominentesten Befunde des ersten Laufs. ox-alpha schrieb, der
Beschnitt von Option C betreffe „mindestens fünf Screens" — es war **fünfmal dasselbe Bild**.
Der Befund selbst stimmt (auf der sauberen Aufnahme nachgesehen: ja, Option C bricht ab),
seine *Verbreitung* war ein Artefakt. Genauso beim Bündel `office`: ox-alpha bekam **eine**
Aufnahme, die fast vollständig von einem Entscheidungs-Modal verdeckt war — daher dort nur
3 Übereinstimmungen bei 19 Alleinbeobachtungen von gpt-5.6-sol.

**Beide Modelle haben das selbst gemerkt.** Das ist das stärkste Qualitätssignal des ganzen
Vergleichs:

- ox-alpha benannte die Duplikate im `ending`-Bündel exakt („s3 = gameend = endreport_top,
  mid = bottom"), forderte die Klärung „Ernte-Bug" und beurteilte bewusst nur die vier
  wirklich verschiedenen Zustände. Für `shortcuts.png` und `office.png` verlangte es
  ausdrücklich eine Nachlieferung, statt ein Phantom zu beschreiben.
- gpt-5.6-sol meldete `poster_detail`, `ambient_bubble` und `broadcast_expanded` als
  „zeigen den angekündigten Zustand gar nicht" — exakt drei der 13 Aufnahmen, die ein
  unabhängiger Bild-gegen-Manifest-Abgleich später als unbrauchbar markierte. Beim
  Rauchtest schrieb es über *jede* Dialog-Aufnahme sinngemäß „Der Blick geht sofort auf
  INFLUENCER-KONTAKT, nicht auf Alexei" — und brachte damit den Krisen-Modal-Defekt
  überhaupt erst ans Licht.

**Stand der Ernte nach den Reparaturen:** 82 von 95 Aufnahmen brauchbar (86 %). Die
13 Ausfälle sind präzise lokalisiert: 10 im `ending`-Bündel (Wahlabend-Timing, siehe Plan
P7), dazu `poster_detail`, `ambient_bubble`, `broadcast_expanded` (Aufnahme-Timing).

### Ein zweites Artefakt, das beide Läufe gleichermaßen trifft

Playwright hängt im Headless-Modus zwingend `--hide-scrollbars` an. Das Projekt stylet
Scrollleisten aber **ausdrücklich sichtbar** (10 px, Tinten-Daumen `#6e6046` auf
Papier-Track `#cbbf9f`, `src/index.css:506-521`) — sie sind hier kein Web-Chrome, sondern
das einzige Zeichen, das einen Innen-Scroller als solchen ausweist. Beim Nachmessen am
Entscheidungs-Modal fand sich im Streifen rechts neben dem Scrollbereich **kein einziges
Pixel** in Daumen- oder Track-Farbe.

Folge: Der ganze Cluster „Beschnitt ohne Affordanz" — quer durch acht Bündel, in **beiden**
Läufen — ist fürs Bild richtig und fürs laufende Spiel zu hart. Der Beschnitt selbst bleibt
ein Befund (das Modal ist der einzige mit `max-h-[100vh]`, siehe P1); die Behauptung
„es gibt gar keinen Hinweis" nicht. Ab der nächsten Ernte behoben.

---

## 3. Wo die beiden auseinandergehen — und was das heißt

Die 107 Widersprüche zerfallen in drei Sorten, und nur eine davon ist ein echtes Problem.

**(a) Gegenläufige Empfehlung zur gleichen Beobachtung.** Die häufigste Sorte — und keine
Schwäche, sondern der eigentliche Ertrag: Hier muss der Eigentümer entscheiden, nicht das
Modell. Beispiele:

| Sache | ox-alpha will … | gpt-5.6-sol will … |
|---|---|---|
| gelbes Ziel-Tag im Gebäude | entsättigen (es hat hier keine aktive Bedeutung) | **behalten** als einziges Farbsignal, aber sauber ausrichten |
| gelber Türrahmen | verstärken (1 px, geht unter) | zurücknehmen (zu gesättigt, liest sich als Alarm) |
| Abdunklung im Dialog | **mehr** (Raumkanten laufen unruhig auf die Box) | **weniger** (tote schwarze Zone verschluckt den Raum) |
| leere Etage 2 | beleben (liest sich als Fehler) | **stärker dimmen** (damit die aktive Etage heraussticht) |
| schwarze Sprechblase des Pförtners | als diegetische Welt-Ebene behalten | auf Papier umstellen (Token-Treue) |
| Scanlines auf Vorgangskarten | „die stimmigste Asset-Gruppe" | „der größte Lesbarkeitsfehler" |

Bemerkenswert: Beim gelben Türrahmen können **beide recht haben** — eine haarfeine Linie in
einer grellen Farbe ist gleichzeitig zu schwach und zu laut.

**(b) Unterschiedliche Ablesung desselben Pixels.** Selten, aber vorhanden und immer in
Minuten entscheidbar: Archiv-Umfang „80" gegen „88"; Untertitel „Puzzlepiel" gegen
„Planspiel"; die Porträt-Zuordnung von Katja und Volkov geht sogar gegensätzlich aus.
**Solche Zahlen nie ungeprüft übernehmen** — mindestens eine Lesart ist falsch.

**(c) Einer sieht etwas, das der andere an derselben Stelle nicht sieht.** Der wichtigste
Einzelfall: ox-alpha meldet einen **Sternenhimmel um 11:00**, gpt-5.6-sol sieht an denselben
Screens keinen. Die Verifikation vom 2026-08-21 hat das bereits aufgelöst — es sind keine
Sterne, sondern **fallender Schnee** aus dem `SeasonOverlay`
(`BuildingStage.tsx:1020-1035`). Ein Modell hat sich geirrt, das andere war schlicht
vorsichtiger.

---

## 4. Die Profile der beiden Modelle

Über alle 19 Bündel zeichnet sich ein sehr stabiles Muster ab.

**`stealth/ox-alpha` — schärfer am Pixel und am Token.**
Nennt Hex-Werte, zitiert `theme.ts` und §4.7 beim Namen, misst Rahmenstärken, findet die
Details, die sonst niemand sieht (das doppelte „K" in der Tastenleiste, das übersehene
„ETAGEN ▲▼", das Versalien-Artefakt „VORGRiff", drei ungleich hohe Chips). Direkter
umsetzbar. Erkennt Duplikate in der eigenen Materialbasis zuverlässig.
*Schwäche:* riskiert Alleingänge (die „Sterne"), und die Selbstkontrolle greift nicht
gleichmäßig — bei `shortcuts.png` meldete es den Defekt, bei `panel_events` und `hud_on`
nicht.

**`gpt-5.6-sol` — schärfer im System und in der Zustandslogik.**
Denkt in Komponenten statt in Screens („eine gemeinsame Panelhülle statt vier Einzelfixes"),
stellt als einziges Informationsarchitektur-Fragen, misst Achsen, Flächenanteile und
Safe-Area-Kanten, und ist disziplinierter darin, **nicht mehr zu behaupten, als ein Standbild
hergibt** (bei den Ambient-Clips: „die Zeitabstände sind unbekannt, die Figuren könnten
regulär hinausgelaufen sein"). Stellt fehlende Inhalte korrekt zurück, statt sie zu erfinden.
*Schwäche:* verbucht Ernte-Timing gelegentlich als Design-Defekt (Uhrzeiten 14:24/17:58) und
schreibt für erkannte Doppelaufnahmen trotzdem getrennte Empfehlungslisten.

**Im Betrieb:**

| | ox-alpha | gpt-5.6-sol |
|---|---:|---:|
| Dauer je Bündel | 283 s | **183 s** (−35 %) |
| Umfang je Bericht | 19,6 kB | **25,7 kB** (+31 %) |
| Kosten | $0 (Gratis-Modell) | Cent-Beträge, vom Katalog nicht bezifferbar |

---

## 5. Was der Vergleich über die Methode sagt

1. **Ein zweiter Durchgang lohnt sich.** 39 % Überschneidung heißt: 61 % der Befunde eines
   Einzelgutachtens hätte man ohne Gegenprobe nicht einordnen können.
2. **Zwei Modelle prüfen die Ernte besser als ein Skript.** Beide fanden Materialdefekte,
   die kein Test gemeldet hätte — und der Rauchtest brachte den größten davon überhaupt
   erst ans Licht.
3. **Die Diagnosen bleiben verdächtig, auch bei Einigkeit.** Von 12 code-geprüften Befunden
   (10 aus der ersten Runde + 2 aus dieser) waren **1 bestätigt, 9 teilweise, 1 widerlegt**
   — dieselbe Quote wie am 2026-08-21. Zwei Modelle, die dasselbe *sehen*, kommen trotzdem
   auf falsche Ursachen; die Beobachtung trägt, die Erklärung nicht.
4. **Widersprüche sind wertvoller als sie aussehen.** Die meisten sind Entscheidungen, keine
   Fehler — und sie legen genau die Stellen frei, an denen das Projekt selbst noch keine
   Regel hat.

---

*Grundlage: 38 Berichte in diesem Verzeichnis. Die Auswertung je Bündel liegt strukturiert
vor (Einigkeit · Widerspruch · Alleinbeobachtung, mit getrennten Diagnosen). Der daraus
abgeleitete, nach Wirkung pro Aufwand sortierte Plan steht in
[`../PLAN_2026-08-22_UX_ZWEITMEINUNG.md`](../PLAN_2026-08-22_UX_ZWEITMEINUNG.md).*
