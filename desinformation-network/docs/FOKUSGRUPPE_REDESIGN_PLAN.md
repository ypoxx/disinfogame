# Zielgruppenanalyse — Redesign-Plan (Vortest konkreter Maschen)

> Stand 2026-07-07. Planungs-Dokument, noch NICHT umgesetzt. Nachfolger von
> `KAMPAGNEN_SCHMIEDE_KONZEPT.md` (PR #100) und Antwort auf die Owner-Kritik an
> den vier abstrakten Appellen + der überfordernden Persona-Auswahl.
> Erarbeitet über zwei Analyse-Durchläufe (Kartierung + 6 Design-Vertiefungen +
> adversariale Prüfung). Die offenen Owner-Entscheidungen stehen in §9.

## 1 · Warum

Die Fokusgruppe testet heute **vier abstrakte Appelle** (Aufbruch/Abstiegsangst/
Empörung/Seriosität) gegen ein **eigenes Datensilo** (`personas.json.receptivity`),
das mit dem echten Spiel nichts zu tun hat. Zwei Owner-Kritikpunkte:

- **(A)** Zu abstrakt. Der Vortest soll **konkrete, spielbare Maschen** prüfen —
  greifbar, als Vorgriff auf Aktionen, die dem Spieler ohnehin zur Verfügung stehen.
- **(B)** Die manuelle Auswahl von ~30 Personas überfordert Einsteiger, die die
  Zielgruppen noch nicht verstehen.

Beide Owner-Entscheidungen (2026-07-07): **volle Wirkungs-Kette** (ambitioniert,
erzählerisch, greifbar) und **geführte Stichprobe** (Standard) + Profi-Schublade.
Zusätzlich: „Milieu" ist eine Sinus-Krücke und muss lizenzfrei neu benannt werden;
Segment-Erklärung diegetisch über NPCs; die vier Erweiterungen mitgeplant.

## 2 · Die Kern-Erkenntnis

**Die echte Wirkungs-Kette existiert bereits fertig und deterministisch.** Jede
Aktion trägt `tags`; die Engine leitet daraus ab: `tags → Methoden-Familie`
(`methodFamilyForTags`, ImmuneSystem.ts) → `Ziel-Segmente + Resonanz + Gewicht`
(`zielMilieusFuerTags`, MaschenGedaechtnis.ts) → je Segment FRISCH/BEKANNT/
VERBRANNT + gedämpfte Wirkung (`stempelFuer`/`wirkungsMultiplikator`). `getMaschenVorschau(actionId)`
tut das **heute schon** für die Top-3-Segmente einer Aktionskarte.

→ Der Vortest muss **nichts Neues erfinden**, sondern **dieselbe Kette lesen**, die
im 40-Tage-Wettrennen wirkt — nur über alle 8 Segmente statt Top-3. Damit ist er
**per Konstruktion** die wahre Vorschau des Rennens (E16). Das entkoppelte
`receptivity`-Silo wird mittelfristig stillgelegt.

## 3 · Der zentrale Zielkonflikt (und seine Auflösung)

Die adversariale Prüfung fand einen **harten Widerspruch**:

- Die **volle Wirkungs-Kette** will `receptivity` stilllegen und den Sample-Bias auf
  die Achse **Masche × Segment** (größen-gewichtet über 8 Segmente) verlegen.
- Die **geführte Stichprobe** baut ihre Bias-Invariante (`sample==population ⇒ bias=0`)
  genau auf `preTest`/`representativeness` und den **30 Personas** auf — also auf dem,
  was die Wirkungs-Kette entfernen will.

Beides gleichzeitig ist unmöglich: **Persona-Sample (ungewichtet)** vs.
**Segment-Sample (größen-gewichtet)** ist *die* Angel-Entscheidung.

**Auflösung = Phasing.** Wir müssen sie nicht sofort entscheiden. Der greifbare
Kern (konkrete Maschen + Segment-Stempel + Neubenennung + Onboarding) lässt sich
**additiv** bauen, **ohne** `receptivity` zu töten: Die vier Segment-Vorschauen
lesen die echte Kette; die Bias-Lektion bleibt vorerst auf der bestehenden
Persona-Achse. Der tiefe Umbau (receptivity stilllegen, Bias auf Segmente,
Dossier-Arcs migrieren) wird **Phase 5** — eine eigene, später zu entscheidende
Etappe. So liefert das Feature früh spürbaren Wert und hält das Risiko klein.

## 4 · Die sechs Bausteine

### 4.1 · Wirkungs-Kette (Kritik A)
- Ein neues reines Modul bündelt pro Segment `{stempel, resonanz, gewicht, geimpft,
  einwand, kippNah}` — gelesen aus der Live-Engine-Kette (kein zweites Silo).
- Eine **Adapter-Read-through-Methode** über alle 8 Segmente (analog `getMaschenVorschau`).
- **Load-bearing Datenänderung:** `THEMEN_JE_TAG` ist heute zu grob — die 18
  Phänomen-Maschen (Gerücht, Zermürbung, Krise, Identität, Erinnerung …) fallen alle
  auf `misstrauen_medien` zurück und wären im Vortest ununterscheidbar. Die Tabelle
  muss um die Phänomen-Tags erweitert werden. **Achtung:** sie wirkt auch im echten
  Wettrennen → Sim-Gate/Balance-Pflicht (schärft aber zugleich das Spiel).

### 4.2 · Konkrete Botschafts-Karten (Kritik A, erzählerisch)
Statt Appell-Knöpfen testet der Spieler dieselben Maschen, die er danach ausspielt
(die 18 Phänomen-Aktionen 11.x). Drei-Register-Trennung setzt „WELT laut, AGENTUR
nie laut" **ins Datenmodell**:
- `narrative_de` = interne Masche-Ansage (Agentur, kühl, Rückseite/Tooltip).
- **NEU `botschaft_de`** = Draußen-O-Ton, ein Satz in Anführungszeichen (die WELT,
  darf laut sein) — das load-bearing neue Narrativ-Asset.
- `headline_de` = Sendungs-Quittung → geghosteter Vorgriff am Kartenfuß.
- **Register-Chip** (kühles Etikett) aus den echten Tags: `Familie · trifft: Thema · Kanal`.

### 4.3 · Geführte Stichprobe + Profi-Schublade (Kritik B)
- **Geführt (Standard):** kein 30-Kachel-Raster, sondern der repräsentative
  Querschnitt als **8 gruppierte Gesichter** (größte Gruppe zuerst). Nichts
  verzerrbar. **Invariante:** die geführte Stichprobe *ist* die ganze Bevölkerung
  (`bias=0` garantiert) — die 8 Gruppen sind reine Präsentation.
- **Profi-Schublade:** „Stichprobe selbst zusammenstellen" eine Ebene tiefer
  (terminalCuration-Muster „kuratieren statt Katalog"), **gesperrt** bis freigeschaltet.
- **Gate = `storyPhase.number`** (nicht localStorage, nicht Dauer-Umschalter — ein
  neuer Run darf nicht sofort im Profi/Bias-Modus starten).
- **Sample-Bias-Lektion bleibt, kommt später:** die Warnung feuert erst, wenn ein
  freigeschalteter Profi bewusst vom Querschnitt abweicht.

### 4.4 · Diegetisches Onboarding (Kritik B / D)
- **Marina Petrova** (Medien-Spezialistin) erklärt die Segmente — sie trägt die
  Analyse-Domäne schon (Dialoge, eigene Strategie; der Pre-Test firmiert als
  „ANALYSE-ABTEILUNG"). **Kein neuer NPC.**
- Drei Schichten, keine ein Vortrag: **einmalige Eintritts-Karte** beim ersten
  Betreten (localStorage-Gate wie `officeHintsSeen`) · optionales Marina-Topic
  „Über das Publikum" · eine Glossar-Unterzeile im Pre-Test-Kopf.
- **Ausschilderung:** Morgenbriefing-Pointer auf „Zielgruppen-Analyse (Etage 3)"
  (erst ab Phase >1, nie Tag 1) + Marina-Nudge „nie getestet, aber im Begriff zu senden".
- **Tutorial bleibt stillgelegt** (kein Segment-Schritt — Doppel-Onboarding-Falle).

### 4.5 · Die vier Erweiterungen (priorisiert)
1. **FRISCH/BEKANNT/VERBRANNT je Segment** (höchste Wirkung/niedrigster Aufwand):
   `getMaschenVorschau` über alle 8 Segmente + Stempel-Spalte. **Fundament** —
   ohne dies ist der Vortest keine echte Vorschau.
2. **Inokulations-Spiegel** (fast gratis): geimpftes/prebunktes Segment wehrt ab
   (`effektiveImpfung ≥ 0.15`), teilt Spalte + Datenquelle mit (1); trennt „abgestumpft"
   (Abwinken) von „geimpft" (Faktencheck-Zeitung) inkl. Tag-Attribution.
3. **Versteckte Einwände → Gegen-Erzählung** (mittel): der `counter_de` der
   Maschen-Familie ist der Einwand, den die ABWEHR später aufgreift; Reife-Ampel
   gegen `PATCH_EVERY_N_USES`. Kopplung an armsRace **narrativ**, keine neue Strafe.
4. **Kipp-Vorschau** (höchster Aufwand + Abhängigkeit): welches Segment steht kurz
   vorm Umschlagen. **Zweistufig:** Stufe 1 qualitativ („noch N Stöße bis zur
   Parteifahne", **keine Zahl**); Stufe 2 („+3-5 Sonntagsfrage" als Zahl) erst
   **nach** der E16-Rückwirkung (belief-Writeback + kippen→fraktionsstärke), die
   heute **nicht** existiert.

### 4.6 · Lizenzfreie Neubenennung (Kritik C)
Siehe §5. Kern: die **Segmentierung bleibt**, die **Sinus-Benennung geht**; die
IDs (`wu_*`) sind der Join-Key und bleiben **unangetastet**.

## 5 · Neubenennung: „Resonanzgruppen" statt „Milieus"

**Rechtlich (knapp, keine Rechtsberatung):** Die Marke „Sinus-Milieus®" und die
geprägten Milieu-**Namen** des SINUS-Instituts sind geschützt; ihre Verwendung im
Produkt suggeriert Ableitung/Zugehörigkeit (Marken-/UWG-Risiko). **Nicht** schützbar:
die bloße Idee, eine Bevölkerung in ~8 werte-/statusbasierte Gruppen zu segmentieren,
sowie Struktur, Größen, Verwundbarkeiten, IDs. → Segmentierung bleibt, nur die
Benennung wird eigen.

**Oberbegriff = „Resonanzgruppe"** (Kurzform „Gruppe"; die Abteilung/der Raum =
„Zielgruppenanalyse"). Diegetisch: die Agentur misst, welche Gruppen mit welchen
Themen „resonieren" — das benennt exakt die echte Engine-Mechanik und lehrt sie ohne
Lehrtext. Das Sinus-Feld `milieu` wird zu einem eigenen Struktur-Deskriptor `profil`.

| ID (stabil) | Label neu | Profil (Sinus-frei) |
|---|---|---|
| wu_optimiererin | Die Aufstiegsorientierten | jung, leistungs-/statusgetrieben, technikoptimistisch, empörungsmüde |
| wu_macher | Die Bodenständigen | handfest, leistungsstolz, skeptisch gegenüber Politik/Medien |
| wu_bohemien | Die Netz-Boheme | jung-urban, kreativ-nonkonform, anti-mainstream, ironisch |
| wu_besorgte_mitte | Die verunsicherte Mitte | saturiert, aber abstiegsbesorgt; konsens-/ordnungs-/sicherheitsorientiert |
| wu_zorniger | Die Abgehängten | einkommensschwach, institutionsfern, empört, grundmisstrauisch |
| wu_idealistin | Die Wertebewussten | jung-akademisch, ökologisch-solidarisch, moralisch dringlich |
| wu_eigenheimer | Die Bewahrer | wohlhabend-älter, ordnungs-/besitzstandsorientiert, rückwärtsgewandt |
| wu_liberale | Die Aufgeklärten | gebildet, faktenorientiert; seriositäts-/ausgewogenheitsgläubig |

**Trennung Pflicht vs. Kosmetik:** PFLICHT (IP + sichtbar) = Sinus-Werte, Kommentar
„Sinus-angelehnt", alle sichtbaren „Milieu"-Strings → „Resonanzgruppe". KOSMETIK
(unsichtbare Code-Bezeichner `milieuId`/`ZielMilieu`/Feld `milieus` in carriers/
platforms/targets — Werte sind ohnehin IDs) = optionaler Folge-Pass, damit der
IP-Diff klein/reviewbar bleibt. **Join-Key-Warnung:** `persona.segmentId`
(`optimiererin`) ≠ `audience.id` (`wu_optimiererin`) — die `toSegmentKey`-
Normalisierung muss erhalten bleiben.

## 6 · Beispiel-Karten (Ton-Referenz)

> **„Ein Gerücht aussetzen"** (11.4) · O-Ton: »Man hört, im Rathaus sei die Liste
> längst geschrieben — Namen und alles.« · Register: GERÜCHTE-ÖKOLOGIE · trifft:
> Anti-Establishment · Kanal: TV · → Sendung: „Gerücht in Umlauf gebracht"
> - FRISCH (Doreen, Abgehängte): »Das ist doch… typisch. Genau so läuft das da oben.«
> - VERBRANNT (Dr. Hofer, Aufgeklärte): »‚Man hört.' Von wem denn? Immer dasselbe
>   Muster — nett versucht.« [Keim: Wer ist die Quelle?]

Das Leitmotiv „**Das ist doch…**" *kippt* mit dem Verbrennen von der Inhalts-Ebene
(FRISCH: „…eine berechtigte Frage") zur Muster-Ebene (VERBRANNT: „…immer dieselbe
Masche"). Der Spieler **hört die Impfung wirken** — prozedurale Rhetorik statt
Belehrung. Die Brücke bleibt spürbar: die getestete Karte *ist* die ausgespielte
Aktion (`actionId` in `OperationAnalysis`, ohne Schema-Änderung).

## 7 · Ton-Leitplanken (verbindlich)

- „Die WELT (TV) darf laut sein, die AGENTUR (UI) nie." Alles Laute lebt **nur im
  Zitat** (`botschaft_de`, Persona-O-Ton); das Agentur-Chrome quittiert kühl.
- **„Nie die Matrix als Zahl":** die vier Vorschauen sind **Stempel/Glyphen/Stöße**,
  keine Prozente. (Das entscheidet §9-Frage 2.)
- Register-Chip = Aktendeckel-Etikett (Substantiv · Substantiv · Kanal), **nie** ein
  Lehrsatz. Kein „Wusstest du, dass…".
- Keine realen Staatssymbole/Namen; strikt fiktive Ziele/Orte (Rathaus, das Amt).

## 8 · Etappen-Reihenfolge (Ergebnis der Prüfung)

- **Phase 0 — Fundament (entkoppelt, testarm).**
  (0a) Neubenennung *data-only*: `milieu→profil`, „Sinus-angelehnt" streichen, sichtbare
  „Milieu"-Strings → „Resonanzgruppe", Fixtures im selben Commit.
  (0b) `THEMEN_JE_TAG` um Phänomen-Tags erweitern — **durchs Sim-Gate/Balance**.
- **Phase 1 — greifbarer Kern (Owner A), ohne Engine-Risiko.** `botschaft_de` zu den
  18 Maschen + `cardRegister(tags)`; **EIN** gemeinsames Vortest-Modul + **EINE**
  Adapter-Methode über alle 8 Segmente (A + E zusammengelegt), deterministisch.
- **Phase 2 — die vier Vorschauen auf demselben Row-Objekt.** E1 Stempel + E4 geimpft
  (teilen Spalte); dann E2 Einwand + Reife-Ampel; dann E3-Stufe 1 (qualitativ, keine Zahl).
- **Phase 3 — UI-Umstellung im Pre-Test.** Karten-Picker statt Appell-Knöpfe,
  Prognose-Tabelle, Persona-O-Ton an Maschenzustand; geführte Stichprobe + gesperrte
  Profi-Schublade (Gate = Phase).
- **Phase 4 — diegetisches Onboarding (D).** Marina-Eintrittskarte, Topic, Briefing-
  Pointer, Glossar-Unterzeile. Erst **nach** Neubenennung + UI-Umstellung.
- **Phase 5 — tiefer Umbau, NUR nach Owner-Entscheid.** `receptivity` stilllegen,
  `preTest`/`representativeness`/`buildWirkungsMatrix` archivieren, Dossier-Arcs auf
  Masche/Familie migrieren, Bias auf die Segment-Achse. Separat: der große Engine-PR
  **E16-Rückwirkung** (belief-Writeback + kippen→fraktionsstärke), der E3-Stufe 2 und
  konkrete Kipp-Zahlen überhaupt erst ehrlich macht.

Jede Phase endet grün: `npm run build` + `npx tsc --noEmit` + `npx vitest run`.

## 9 · Owner-Entscheidungen — BESCHLOSSEN (2026-07-07)

1. **Umfang: ALLES in einem Zug.** Phase 0–5 werden umgesetzt, inkl. tiefem Umbau
   (`receptivity` stilllegen, Dossier-Arcs migrieren) und dem E16-Engine-PR
   (belief-Writeback + Kippen→fraktionsstärke). Intern phasenweise, jede Phase grün.
2. **Anzeige: NUR Stempel/Stöße, keine Zahlen.** Der Vortest zeigt FRISCH/BEKANNT/
   VERBRANNT + „noch N Stöße bis zur Parteifahne" — nie Prozente/„+3-5". Die E16-
   Kippen-**Mechanik** wird gebaut (Teil von Umfang 1), aber im Vortest **qualitativ**
   dargestellt. („Nie die Matrix als Zahl" bleibt bindend.)
3. **Neubenennung: „Resonanzgruppen" + Namen schärfen.** Ein sauberer, einheitlicher
   Namenssatz (§5), audience + personas in Deckung. IDs bleiben.
4. **Einwand-Quelle:** Familie-`counter_de` als Rückgrat + Persona-`keim_de` als Flavor.
5. **Host der Persona-Reaktionen:** Pre-Test-Modal (aktions-bewusst), nicht der
   Ambient-`FokusgruppeView`.

## 10 · Bekannte Lücken / Waisen (mitdenken)

- **PR #100 / dossierModel:** die Sweet-Spot-Arcs (Flächenbrand/Zwei-Fronten) hängen
  an der Appell-Achse — bei Phase 5 mit-migrieren oder als Legacy behalten. Niemand
  „besitzt" diese Migration bisher.
- **Save/Load-Kompatibilität:** `OperationAnalysis` trägt künftig `actionId` statt
  Appell — alte Saves müssen weiter laden.
- **i18n:** die neuen Assets (`botschaft_de`, `profil`, `keim_de`) sind nur `_de`.
- **Kosten/Ökonomie:** kostet der Vortest einer konkreten Aktion weiter `FOKUSGRUPPE_COST`?
- **Kanal-Schärfung:** `KANAL_JE_TAG` kennt nur social/print, Default tv — viele
  Phänomen-Tags landen pauschal auf tv; ggf. parallel zu `THEMEN_JE_TAG` schärfen.
- **`FokusgruppeView` aktions-bewusst machen** (falls dort O-Ton landet) — neue Prop
  vom Orchestrator nötig.

## 11 · Umsetzungs-Stand (2026-07-09/10)

**Geliefert (Phasen 0–5, jede Phase grün, PR #100):**
- **0a** Resonanzgruppen statt Sinus-Milieus (lizenzfrei), Namen geschärft, IDs stabil.
- **0b** `THEMEN_JE_TAG`/`KANAL_JE_TAG` um die Phänomen-Tags geschärft (Sim-geprüft).
- **1** `botschaft_de` (Draußen-O-Ton) an allen 18 Phänomen-Maschen + `cardRegister`;
  EIN reines Vortest-Modul (`maschenVortest.ts`), das die ECHTE Live-Kette liest.
- **2** Die vier Stempel-Vorschauen (FRISCH/BEKANNT/VERBRANNT · geimpft/wittert ·
  versteckter Einwand + Reife-Ampel · Kipp-Nähe qualitativ „noch N Stöße").
- **3** `MaschenVortestView`: Karten-Picker + geführte Stichprobe (8 Gruppen, Bias 0)
  + gesperrte Profi-Schublade (Gate = Phase); Persona-O-Ton kippt frisch↔verbrannt
  (§6). Analyse-Raum darauf verdrahtet. „Nur Stempel/Stöße" gewahrt.
- **4** Diegetisches Onboarding: Marina-Eintrittskarte, Topic „Über das Publikum",
  Morgenbriefing-Nudge „ungetestet gesendet → Etage 3".
- **5 (E16)** belief-Writeback macht den Vortest ehrlich; Kippen → Fraktionsstärke
  (zweischneidig: Reward + Entdeckungsrisiko), gegen beide Balance-Sims kalibriert.
  `FokusgruppePreTest.tsx` (alter Appell-Vortest) archiviert.

**Bewusst zurückgestellt (dokumentiert, kein toter Code):** Das vollständige
*Stilllegen* von `receptivity`/`buildWirkungsMatrix`/`MessageAppeal` und die
Dossier-Arc-Migration auf Masche/Familie. Grund: diese Module sind **kein** toter
Code mehr, sondern hängen an LEBENDEN PR-#100-Flächen — `OperationsAkteView`
(Appell-Etikett `APPEAL_LABEL` + Wirkungs-Landkarte) und der Dossier-Save/Load in
`useStoryGameState`. Sie zu entfernen ist ein **Feature-Umbau** (regressiert PR-#100-
Funktionen), kein Archivieren — und gehört in einen eigenen, sim-abgesicherten PR,
nicht in diesen. Der Analyse-**Einstieg** (die Owner-Kritik) ist bereits appellfrei;
`receptivity` speist nur noch die separate Operations-Akte, nicht den Vortest.

---

*Erarbeitet mit einem Understand-Durchlauf (5 Leser) + einem Design-Durchlauf
(6 Vertiefungen + adversariale Chef-Kritik). Zeilennummern in diesem Dokument sind
Stand der Analyse und vor der Umsetzung gegen den aktuellen Code zu verifizieren.*
