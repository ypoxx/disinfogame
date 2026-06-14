# 🎭 KONZEPT — Herzstück-Update: Episoden · Gesellschaftswerte · Vernetzung

**Status:** Konzept zur Owner-Abnahme (Diskussionsstand). **KEIN Bau.** **Datum:** 2026-06-14
**Zweck:** Das inhaltliche Herzstück des wichtigsten kommenden Updates — verbindlich festgehalten,
mit Nuancen, Abhängigkeiten und Problemen, damit es danach technisch sauber, effizient und
fehlerfrei geplant/gebaut werden kann.
**Setzt auf:** PR #82 („Loop schließen": P2-Konsequenzen + End-Report + Methoden-Atlas).
**Quellen:** Vergleich mit der extern entwickelten Taxonomie „Signalrauschen" (`/tmp`-Referenz, hier
destilliert) · 7 Experten-Analysen (Systeme/Domäne/Narrativ/Ethik · Vision-Historie · Broadcast-Wiring ·
Architektur) · `SOUL.md` · `DECISIONS_2026-06-13B_TRANSCRIPT.md` · `STRANG34_*` · `BROADCAST_AND_AUDIENCE_CONCEPT.md`.

> **Leitsatz dieser Runde (Owner, 2026-06-14):** „Größere Vernetzung, Bandbreite — horizontal wie
> vertikal. Erzählerischer, anfassbarer, skalierbarer. Es bereichert die Dialoge, macht den Broadcast
> spannender (erst dann ist das Publikum auch eins, der Fernseher zeigt etwas), und die Fokusgruppen
> sagen mehr zu dem, was angefordert/gemacht wurde." Das Paket **darf extrem groß werden.**

---

## 0. Gelockte Owner-Entscheidungen (2026-06-14)

| # | Frage | Entscheidung |
|---|---|---|
| O1 | Episoden-Auslösung | **Emergent-kuratiert**: ein NPC bietet eine Episode an, wenn Weltlage/Werte passen (kein linearer Kampagnen-Strang). |
| O2 | Episode vs. Aktionsbrett | **Episode = das „Warum", Brett = das „Wie".** Episode ersetzt das Brett nicht. |
| O3 | Werte im HUD | **3–4 sichtbar**, Rest läuft intern (Niedrigschwelligkeit, SOUL §6). |
| O4 | Skalierung | **Groß**: viele Episoden/Phänomene/Werte direkt — nicht nur 6–8 als Pilot. Content-Pyramide nutzen. |
| O5 | Ethik-Geländer | **Mitdenken, aber NICHT vor dem Spielverlauf priorisieren.** |
| O6 | Umfang | Das wird **das große Inhalts-Update** — Aufwand lohnt sich ausdrücklich. |

---

## 1. Die Vision in einem Absatz

Aus dem soliden System wird das *erzählte* Spiel. Die **Episode/Vignette** ist die Wirbelsäule:
eine kleine, situierte Geschichte (Ort, Figuren mit erfundenen Namen, Lage, Wendung/Dilemma, Lernmoment),
die bestehende Aktionen, NPCs und Ziele zu etwas Greifbarem verknüpft. Diese Episoden bewegen einen
**mehrdimensionalen Gesellschafts-Zustand** (nicht nur „Vertrauen", sondern auch Polarisierung,
Fragmentierung, Informationslast, Zynismus …), führen **neue Angriffs-Phänomene** vor (Überflutung,
mutierende Gerüchte, Zermürbung, Krisenfenster) und schließen mit einem ehrlichen **Lernmoment**.
Dasselbe Material speist zugleich **Dialoge, Broadcast/Publikum, Fernseher und Fokusgruppe** — so
entsteht die horizontale (mehr Themen/Figuren/Pfade) und vertikale (tiefere Ketten, Folgen, Werte)
Vernetzung, die das Spiel anfassbar und skalierbar macht.

**Der Kern-Trick (Abwechslung ohne Mechanik-Inflation):** *Kontext erzeugt Bedeutung.* Dieselbe Aktion
„Belastendes Material sammeln" fühlt sich in einer Erpressungs-Episode völlig anders an als in einer
Zermürbungs-Episode. Wenige Systeme × viele Kombinationen = MadTV-Wiederspielwert (G22: 100–500 Pfade).

---

## 2. Die vier Bausteine — und wie sie ineinander schachteln

```
        ┌─────────────────────────────────────────────────────────┐
        │  EPISODE / VIGNETTE  (B1 — die Wirbelsäule, das „Warum") │
        │   Ort · Figuren · Lage · Wendung/Dilemma · Lernmoment    │
        └───────────────┬───────────────────────┬─────────────────┘
            bewegt       │                       │   führt vor
                         ▼                       ▼
        ┌────────────────────────┐   ┌──────────────────────────────┐
        │ GESELLSCHAFTSWERTE (B2) │   │  ANGRIFFS-PHÄNOMENE (B3)      │
        │ Vertrauen·Polarisierung │   │ Überflutung·Gerüchte-Mutation │
        │ Fragmentierung·Last·    │   │ Zermürbung·Krisenfenster·     │
        │ Zynismus·Diskursqualität│   │ Identitäts-/Erinnerungskonflikt│
        └───────────┬─────────────┘   └──────────────┬───────────────┘
                    │ bestimmen Enden,                │ schreiben in Werte
                    │ Publikum, Fokusgruppe           │
                    ▼                                 ▼
        ┌─────────────────────────────────────────────────────────┐
        │  ABSCHLUSS / DEBRIEF + RESILIENZ-GELÄNDER (B4, mitgedacht)│
        │   reale Methode benannt · „so wäre es gekontert worden"  │
        └─────────────────────────────────────────────────────────┘

   Vernetzung nach außen (alle Bausteine speisen): Dialoge · Broadcast/Publikum ·
   Fernseher · Fokusgruppe · Gebäude-Wachstum (neue Büros/NPCs)
```

Sie liegen **nicht nebeneinander, sie nisten**: Die Werte (B2) sind der Zustand, den Episoden (B1)
bewegen; die Phänomene (B3) sind die Verben, die Episoden vorführen und die in Werte schreiben; der
Debrief (B4) ist der Abschluss jeder Episode.

---

## 3. Baustein 1 — Episoden / Vignetten (die Wirbelsäule)

### 3.1 Was eine Episode ist
Eine in sich geschlossene Mikro-Geschichte mit Anfang (Lage), Spannung (Dilemma) und Pointe (Lernmoment),
die **bestehende** Bausteine verknüpft statt neue zu erfinden:
- **Schauplatz** — ein fiktiver Westunion-Ort (Nordmark, Gallia, Balticum … aus `world-events.json`).
- **Figuren** — Refs auf `targets.json` (die Ziele) und `npcs.json` (das Team, das anbietet/kommentiert).
- **Lage** (3–5 Sätze, Eigennamen) · **Auslöser** (an ein `worldEvent`/Wert-Schwelle koppelbar).
- **Einklink-Aktionen** — IDs aus `actions*.json` (das „Wie").
- **Wendung/Dilemma** — eine echte Entscheidung mit Trade-off (klein&leise vs. groß&riskant …).
- **Lernmoment** — wandert in den End-Report (SOUL §5), benennt die reale Methode + Gegenmittel (B4).

### 3.2 Daten-Schema (Entwurf, rückwärtskompatibel, ID-referenziert)
Neue `episodes.json` (Muster wie Milieus/Targets — daten­getrieben, ohne Code-Änderung erweiterbar):
```jsonc
{
  "id": "ep_veen_wackeln",
  "titel_de": "Das Wackeln des Herrn Veen",
  "schauplatz_de": "Nordmark, Wahljahr",
  "lage_de": "Die Koalition hat eine Stimme Mehrheit. Hinterbänkler Rolf Veen soll …",
  "beteiligte": { "ziel": "t_hinterbaenkler", "anbieter_npc": "igor", "stimmen_npc": ["katja"] },
  "ausloeser": { "anyOf": [ {"worldEvent": "we_wahl_naht"}, {"wert": "polarisierung", "op": ">=", "v": 55} ] },
  "einklink_aktionen": ["1.4", "9.11", "9.12"],
  "wendung_de": "Stiller Deal (klein, dauerhaft) ODER lautes Leak (groß, riskant)?",
  "wirkt_auf": { "vertrauen": -3, "polarisierung": +2 },   // primäre Achse(n) der Episode
  "lernmoment_id": "character_assassination",               // Ref → disinfo_methods.json
  "freischaltung": { "unlocksRoom": null, "unlocksNpc": null } // optional (Gebäude-Wachstum, K40)
}
```
**Wichtig:** Episoden referenzieren nur per ID, duplizieren nie Texte/Werte → eine Quelle der Wahrheit.

### 3.3 Auslösung (O1: emergent-kuratiert)
Sauberster Hook ist der **lebende** NPC-Angebots-Pfad `buildActionOfferChoices` / `interactWithNpc`
(`useStoryGameState.ts:89/1217`), Vorbild für die Verfügbarkeits-Gates: die bereits getesteten
`activeOpportunityWindows` (`StoryEngineAdapter.ts:2666–2832`, phasen-/wert­gegatet). **NICHT** auf
`processTopicResponse` aufsetzen — das ist nur console.log-Stub (s. Risiken).

### 3.4 Verhältnis zu „≤3 Narrative" (B6) — Konfliktauflösung
Begriffe trennen: **„Narrative"** = die ≤3 *gleichzeitig laufenden* Stränge am Korkbrett (Kapazitäts­grenze
fürs Publikum). **„Episoden"** = beliebig viele situierte Mikro-Geschichten, die in diese ≤3 Stränge
*einzahlen*. So bleiben ≤3 aktive Narrative bestehen und es gibt trotzdem hunderte Episoden.

### 3.5 Skalierung (O4) — Content-Pyramide (ältere Idee I-005)
50 handgeschriebene Kern-Episoden → ~200 Vorlagen (Schauplatz/Ziel/Phänomen als Slots) → 500+ Varianten
durch Kombinatorik (Schauplatz × Ziel × Phänomen × Wendung). Erst handschreiben für Tonalität, dann ein
Schreib-Agent mit hartem Persona-Gate (`NPC_VOICE_PROFILES.md`) für die Masse. Modulares End-System
(`DESIGN_DECISIONS.md` 3: Ergebnis × Moral × NPC × Entdeckung) multipliziert die Pfade zusätzlich.

### 3.6 Drei Beispiel-Vignetten (kanonische Erstmuster, Tonalität als Beweis)

> **„Das Wackeln des Herrn Veen" (Nordmark · Erpressung/Kompromat).** Wahljahr, die Koalition hat eine
> Stimme Mehrheit. Hinterbänkler Rolf Veen soll einem Energiegesetz zustimmen — er zögert. Igor hat beim
> Buchen einer Tarnfirma zufällig von Veens Spielschulden gehört. Katja, trocken: „Den kriegen wir. Aber
> sauber wird das nicht." → Dossier (1.4) → Material (9.11) → *stiller Deal (klein, dauerhaft) ODER lautes
> Leak (groß, riskant)?* **Wirkt auf:** Vertrauen↓. **Lernmoment:** Erpressbarkeit ist keine Frage des
> Charakters, sondern der Schulden.

> **„Frau Ferro hat Feierabend gemacht" (Balticum · Zermürbung/Überflutung).** In einer Grenzstadt ohne
> Lokalzeitung deckt die Faktencheckerin Dr. Lena Ferro fast allein Falschmeldungen auf. Sie ist gut. Sie
> ist auch erschöpft. Alexei: „Wir müssen sie nicht widerlegen. Wir müssen sie nur müder machen." → KI-Bot-
> Flut halbwahrer Behauptungen statt eines großen Coups. **Wirkt auf:** Informationslast↑, Diskursqualität↓.
> **Lernmoment:** Faktenchecker scheitern selten an der Lüge, sondern an der Menge.

> **„Die Brücke, die zweimal steht" (Gallia · Spaltung/Identität).** Zwei Viertel, eine Brücke, zwei
> Wahrheiten. Die ehrliche Lokalpolitikerin Ina Brandt will vermitteln. Marina reibt sich die Hände: „Geben
> Sie mir den Riss, ich gebe Ihnen den Graben." → Fokusgruppe (welche Formulierung trifft?) → Wedge-Issue →
> *wir erfinden nichts, wir gießen nur Öl.* **Wirkt auf:** Polarisierung↑, Fragmentierung↑. **Lernmoment:**
> Die gefährlichste Desinfo erfindet selten; sie verschiebt Betonung.

---

## 4. Baustein 2 — Gesellschaftswerte (der mehrdimensionale Zustand)

### 4.1 Das Problem heute
Die Engine *berechnet* schon viele Wirkungen (polarization, division, content_quality …,
`StoryEngineAdapter.ts:3754–3817`), **kollabiert sie aber alle in eine Zahl: `obj_destabilize` (Vertrauen)**.
Polarisierung wird nur als transienter `effects[]`-Eintrag gepusht (Z.3820), **nirgends als Zustand getrackt**.
`EndingGameState` (Z.5468) hat gar kein Polarisierungs-Feld; `WorldEndState.polarization` ist *abgeleitet*,
nicht real. Folge: viele Wege führen zum gleichförmigen „Vertrauen runter" — wenig Pfad-Vielfalt.

### 4.2 Vorschlag: ~6 erstklassige Werte (3–4 sichtbar)
| Wert | Bedeutung | sichtbar? | gespeist v.a. aus |
|---|---|---|---|
| **Vertrauen** (Institutionen) | bleibt die primäre Sieg-Achse (`obj_destabilize`) | ✅ | aggressive Aktionen, Enttarnungs-Rebound |
| **Polarisierung** | Lagerbildung | ✅ | Wedge/Empörung/Identität (`polarizationIndex` existiert in SCENARIO_FRAMEWORK) |
| **Informationslast** | Orientierungs-Überflutung | ✅ | Bot-Flut, Gerüchte, Flooding |
| **Zynismus/Erschöpfung** | Rückzug/Apathie | ✅ | Dauer-Empörung, Zermürbung |
| **Fragmentierung** | Zerfall gemeinsamer Öffentlichkeit | intern | Echo-Inseln, Segmentkanäle |
| **Diskursqualität** | Gesundheit der Debatte (Resilienz-nah) | intern | sinkt unter Druck, steigt durch Gegenseite |

**Der Mehrwert:** Erst mehrere Achsen erzeugen *unterscheidbare* Spielverläufe und Enden — eine
„Fragmentierungs-Niederlage der Demokratie" (Echo-Inseln) fühlt sich anders an als ein
„Zynismus-Kollaps" (Apathie) oder ein „Misstrauens-Sturz" (Institutionen). Das ist der direkte Hebel
für die 100–500 Pfade (G22) und für reiche Enden.

### 4.3 Wichtige Design-Leitplanke (Balance-Sicherheit)
**Die Sieg-Mathematik bleibt zunächst unangetastet.** `obj_destabilize` (×0.625, `trustTargetHeldPhases`,
`REQUIRED_HOLD_PHASES`) ist K14-feinjustiert. Die neuen Werte laufen als **eigene Akkumulatoren daneben**
und sind *expressiv* (bestimmen Enden, Episoden-Verfügbarkeit, Publikum, Fokusgruppe), **nicht** sofort ein
zweites Sieg-Gatter. → Siehe Offene Frage F1 (sollen andere Werte später auch Sieg-Pfade werden?).

---

## 5. Baustein 3 — Neue Angriffs-Phänomene (die fehlenden Verben)

Reine Daten-Erweiterung (additive Aktionen + Tags + Effekt-Keys), jede mit Heimat-Wert + Lernmoment.
Abgeleitet aus den Abdeckungs-Lücken ggü. Signalrauschen:

| Phänomen | reale Methode | bewegt Wert | Beispiel-Aktion (unsere Fiktion) | Lernmoment |
|---|---|---|---|---|
| **Überflutung als Waffe** | Firehose of Falsehood | Informationslast↑, Korrektur-Wirkung↓ | „Themen-Stau erzeugen" (viele Pseudo-Debatten parallel) | Schaden ohne EINE große Lüge |
| **Gerüchte-Mutation** | Gerüchte-Ökologie | Informationslast↑, Korrektur-Schwierigkeit↑ | „Ungesichertes Signal säen" (mutiert über Phasen, wird korrektur-resistent) | Gerüchte sind zäher als Lügen |
| **Zermürbung/Apathie** | Demobilisierung | Zynismus↑, Beteiligung↓ | „Debatten-Erschöpfung erzeugen" (Ziel: Rückzug, nicht Glaube an uns) | Demokratie stirbt auch an Gleichgültigkeit |
| **Krisen-Zeitfenster** | Vakuum-Logik | Wirkung×Multiplikator temporär | Krisen-Event, in dem Deutungslücken-Angriffe doppelt wirken | In Krisen schlägt Tempo Wahrheit |
| **Identitäts-/Loyalitätsfalle** | Wedge / Loyalitätsdruck | Polarisierung↑, Korrektur-Immunität | „Loyalitätsfalle" (Korrektur = Gruppenverrat) | Fakten als Identitätsangriff erlebt |
| **Erinnerungskonflikt** | kollektives Gedächtnis | Polarisierung↑, Fragmentierung↑ | „Alten Konflikt reaktivieren" (koppelt an Milieu-Geschichte) | Infokonflikte sind Erinnerungskonflikte |

**Krisenfenster vs. „keine künstliche tickende Uhr" (Prinzip 3):** Fenster werden *diegetisch* motiviert
(„Wahl in 3 Tagen", Sondersendung), nicht als abstrakter Timer — konform zur bereits gewählten Ereignis-Uhr.

---

## 6. Baustein 4 — Resilienz + Ethik-Geländer (mitgedacht, niedrige Prio, O5)

Klein gehalten, in den **Debrief** verlagert (nicht als spielbare zweite Seite — sonst zwei Spiele):
- **Gegenmaßnahme sichtbar machen:** je Methode im End-Report „so wäre das erkannt/gekontert worden"
  (Prebunking, Brückenakteure, Korrektur mit Vertrauensweg) — speist sich aus den `counter`-Feldern.
- **Sieg entheroisieren:** „als Held empfangen" entschärfen (widerspricht ohnehin G25 „dezent").
- **Debrief verpflichtend** statt einklappbar (SOUL §5: „End-Report IST der Lernmoment").
- **Bewusst NICHT übernehmen** (aus Signalrauschen): Abstraktion/Verzicht auf benannte Methoden &
  reale Fälle (würde G22 + unseren Atlas aufheben — unser Alleinstellungsmerkmal) und „Resilienz = höchste
  Wertung / Spieler als Verteidiger" (würde die Papers-Please-Täter-Verkörperung zerstören).

---

## 7. Vernetzung mit den bestehenden Systemen (der eigentliche Reiz)

Owner-Intuition bestätigt: Episoden + Werte werten die vorhandenen Schauflächen massiv auf.

- **Broadcast / Fernseher** — heute reine Anzeige ohne Rückwirkung (`useAudienceBroadcast.ts:5-7`),
  Themen aus einer „PROVISORISCHEN" Tag-Tabelle (`broadcastMapping.ts:37-52`). *Andock:* `mapActionToBroadcast`
  (Z.64) liefert künftig aus der **aktiven Episode** Schlagzeile/Thema/Kanal → der Fernseher zeigt eine
  *Geschichte mit Namen* statt einer abstrakten Aktionsbezeichnung.
- **Publikum „wird eins"** — heute reagiert jedes Milieu-Segment isoliert (`audienceModel.ts:93-97`).
  *Andock:* `reactToEffect`/`nextMood` bekommen den **Werte-Vektor** statt eines einzelnen `belief`-Deltas;
  bei Schwellen kippt die Stimmung *segment­übergreifend* (Mehrheits-Stimmung → Sondersendung, vgl.
  „Wirkungs-Treppe" in `MINISTRY_BROADCAST_CONCEPT.md`). **→ Owner-Fork F2 (Rückwirkung erlauben?).**
- **Fokusgruppe** — heute read-only, öffnet nur per Raum-Betreten (`StoryModeGame.tsx:773`), zitiert nur die
  *letzte* Schlagzeile (`FokusgruppeView.tsx:167-180`). *Andock:* zwei Props mehr (letzte N Aktionen/Episoden
  + Werte je Segment) → Personas reagieren auf *die Episode, die ihr Milieu betrifft* und „sagen mehr zu dem,
  was angefordert/gemacht wurde". K40: Fokusgruppe mit eigenen Fragestellungen (kostet Geld) = bereits gebaut.
- **Dialoge** — das Condition-`var`-System (`DialogLoader.ts:577`) ist der saubere Andock: neue Vars
  (`activeEpisode`, `audienceMood`, `wert_polarisierung` …) ermöglichen situative Eröffnungen, NPC-Episoden-
  Angebote und die **erzählerische Gegenseite** (C9: Einzelpersonen geben Lageeinschätzung).
- **Gebäude-Wachstum (K40/D14, nie gebaut)** — Episoden-Belohnung: `unlocksRoom`/`unlocksNpc` schaltet nach
  einem Erfolg ein neues Büro + NPC frei (z. B. Bot-Netz → Redaktions-NPC, der Episoden anbietet).

---

## 8. Wiederverwendbare Alt-Bausteine (nicht neu erfinden!)

Die Historie ist voller halbfertiger Schätze, die genau hierherpassen:
- **`event-chains.json` + `event-chain-system.ts`** (ungenutzt): fertige verkettete Mini-Geschichten
  (Whistleblower, Viral Moment, Platform Crackdown, Election Window) → Episoden-Rohstoff.
- **`actor-ai.ts`** (Wettrüsten passiv→aggressiv, in Story nie verkabelt) → lebendigere Gegenseite/Resilienz.
- **`NarrativeGenerator.ts`, `combo-system.ts`** (ungenutzt) → Varianten-Erzeugung, benannte Dynamiken.
- **`DAY_ONE_WALKTHROUGH.md`** → fertige Tonalität + Dilemma-Vorlage (Volkovs „…Sie wissen, dass das
  erfunden ist, oder?"). **`DESIGN_DECISIONS.md` 2** (Verrats-Eskalation Stufe 1–5) → fertige interne Mikro-Episoden.
- **`polarizationIndex`, Segment-`mood/belief`, OKRs (Cohesion/DemokratieVertrauen/Angst)** → Vorform der Werte.
- **`combo-definitions.json`** (`media_saturation`, `propaganda_blitz`) → Überflutungs-Phänomen schon als Daten.

---

## 9. Architektur & Abhängigkeiten (für saubere, fehlerfreie Planung)

### 9.1 Abhängigkeits-Landkarte (verdichtet)
```
JSON-Daten ─► ActionLoader ─► StoryEngineAdapter (mutable, in React-State)
  ├─ storyResources {budget,capacity,risk,attention,moralWeight}        ← B2 erweitert
  ├─ objectives[obj_destabilize, obj_survive]                            ← B1/B2 schreiben
  ├─ applyActionEffects (3708–3870)   ◄── KOLLAPS-PUNKT (alles → obj_destabilize)  ← B2/B3
  ├─ advancePhase {generateWorldEvents, OpportunityWindows 2666–2832}    ← B1-Auslöse-Vorbild
  ├─ checkGameEnd (4757) → getEndStats → EndingGameState (5468, ohne Wert-Felder)  ← B2/B4
  └─ saveState/loadState (4904+/5034)  ◄── jede neue Persistenz hier (Migration!)
useStoryGameState ─ buildActionOfferChoices/interactWithNpc (89/1217)    ← B1-NPC-Hook (lebend)
                  └ trustHistory.averageTrust (single scalar)            ← B2
UI: StoryHUD (Resources/ObjectiveTracker) · EndReport/GameEndScreen · BroadcastBar · FokusgruppeView
```
**Kern:** *Alles fließt durch `applyActionEffects` → `obj_destabilize` und `checkGameEnd`.* B2 ist die
Wirbelsäulen-Operation; B1/B3 hängen daran.

### 9.2 „Nur-Vertrauen"-Annahmen (beim Werte-Modell anzufassen)
- `initializeObjectives` (`:623`, nur 2 Ziele) — hat bereits `// TODO: Load from scenario definition`.
- Kollaps in `applyActionEffects` (`:3754–3817`): viele Effekte → ein `trustErosionValue` → nur obj_destabilize.
- Sieg-Gatter `trustTargetHeldPhases`/`REQUIRED_HOLD_PHASES` (`:488/489`) — single metric.
- `trustHistory.averageTrust` (`useStoryGameState.ts:303`) + Defender-Trigger auf `averageTrustDrop` (`:989`).
- `EndingGameState` (`:5468`) ohne Werte-Input; `WorldEndState.polarization` (`EndingSystem.ts:99`) nur abgeleitet.
- HUD `StoryResources`-Interface (`:141`) ohne Wertfelder; ObjectiveTracker zeigt nur erstes primäres Ziel.

### 9.3 Empfohlene Bau-Reihenfolge (je grün + simulierbar)
1. **B2a — Werte als Zustand:** Felder in `storyResources` + loadState-Defaulting + HUD-Anzeige. *Keine*
   Sieg-/Kollaps-Änderung → balance-sim unverändert (Beweis: gleiche Win-Rate).
2. **B2b — Effekt-Splitting:** in `applyActionEffects` zusätzlich die Werte speisen, `obj_destabilize`-Mathe
   unangetastet. Vorher/Nachher-Sim (K14).
3. **B3 — Phänomene:** additive Aktionen/Keys, speisen die Werte; Sim nach jedem Bündel.
4. **B1 — Episoden:** Loader + `episodeState` in save/load + NPC-Angebots-Hook + Debrief→EndingGameState.
5. **Vernetzung:** Broadcast/Fokusgruppe/Dialog an Episoden+Werte (nach F2-Entscheidung).
6. **B4 — Ethik/Geländer:** EndReport/EndingSystem-Komponenten (parallel/zuletzt, niedrige Prio).

---

## 10. Risiko-Register / mögliche Probleme

| # | Risiko | Schwere | Gegenmittel |
|---|---|---|---|
| R1 | **save/load-Migration:** `loadState` weist roh zu (`:5038`), kein Defaulting → alte Saves ⇒ `undefined`/NaN für neue Werte | HOCH | `version`-Bump + Default-Merge beim Laden |
| R2 | **K14-Balance kippt:** obj_destabilize ×0.625, riskDecay, Sieg-Hold sind feinjustiert | HOCH | B2b nur additiv; Pflicht-Sim vorher/nachher (alte + p2-Profile) |
| R3 | **ID-Kopplung:** actionIds/targetIds/npcIds werden quer als Strings referenziert, keine Validierung; Episoden erben das | HOCH | zentraler ID-Validator beim Laden (warnt bei toten Refs) |
| R4 | **Tote Hooks:** `processTopicResponse` (`:4758`) + `unlock_action`/`lock_action` sind console.log-Stubs | MITTEL | Episoden auf den *lebenden* `buildActionOfferChoices`-Pfad setzen, nicht auf Sand |
| R5 | **Zwei Dialog-Systeme** (`dialogues.json` vs. `topics_dialogues.json`) | MITTEL | Episoden in EIN System integrieren, sonst Drift |
| R6 | **Drei „Vertrauens"-Begriffe** (Segment-`belief`, Actor-`trust`/trustHistory, objectiveProgress) | MITTEL | Werte-Vektor = kanonische Quelle definieren; andere ableiten |
| R7 | **Statik-Explosion:** Fokusgruppe/Episode × Wert × Mood = handgeschriebene Text-Flut | MITTEL | Template-/Insert-Library (`insert_library.json`); Schreib-Agent mit Persona-Gate |
| R8 | **Broadcast-Prinzipienbruch:** „Anzeige zuerst, keine Rückwirkung" fällt, sobald Werte zurückwirken | MITTEL | Bewusste Owner-Entscheidung F2 + Balancing |
| R9 | **UI-Last:** 13 Werte erschlügen die Niedrigschwelligkeit | NIEDRIG | nur 3–4 sichtbar (O3); Rest intern |
| R10 | **Test-Bruch:** billige neue Phänomene verschieben die p2-Enttarnungs-Annahmen | MITTEL | eigene Sim-Asserts je neuem Wert/Phänomen |

---

## 11. Konflikte mit früheren Entscheidungen + Auflösung
- **„≤3 Narrative" (B6)** → Begriffstrennung Narrative (≤3 Stränge) vs. Episoden (viele). *Aufgelöst, §3.4.*
- **„Keine künstliche tickende Uhr" (Prinzip 3)** → Krisenfenster diegetisch motiviert. *Aufgelöst, §5.*
- **„Keine realen Fallreferenzen pro Schritt" (C17/C22)** → reale Fälle nur im End-Report (F21/G22), nicht in der Episode. *Aufgelöst.*
- **K14 „nichts Neues erfinden, vorhandene Ketten klären"** → neue Werte v.a. aus vorhandenen Feldern ableiten, nicht als Parallelsimulation. *Beachtet, §4.3.*

---

## 12. Offene Owner-Fragen (SOUL-Stil — bitte per Transkript, Nummern nennen)

> Nur die echten Gabeln, bei denen deine Antwort den Bau verändert. Zu jeder meine Empfehlung.

- **F1 — Mehrere Sieg-Pfade?** Soll man die Demokratie auch über *andere* Achsen „besiegen" können
  (Zynismus-Kollaps, Fragmentierung in Echo-Inseln) — oder bleibt **Vertrauen** das eine Sieg-Ziel und die
  anderen Werte formen nur die Enden? *Empfehlung: zunächst Vertrauen = Sieg-Achse (Balance-Sicherheit),
  andere Werte bestimmen WELCHES Ende + schalten Episoden frei; alternative Sieg-Signaturen als späterer
  Ausbau.*
- **F2 — Darf das Publikum mechanisch zurückwirken?** Damit „das Publikum wirklich eins wird", müsste das
  Leitprinzip „Sendung = nur Anzeige" fallen. *Empfehlung: kontrollierte Rückwirkung — Werte/Publikum
  beeinflussen Episoden-Verfügbarkeit, Stimmung und Enden, aber keine selbstverstärkende Endlos-Schleife.*
- **F3 — Wie viele Werte sichtbar, und welche?** *Empfehlung: 4 sichtbar — Vertrauen, Polarisierung,
  Informationslast, Zynismus; Fragmentierung & Diskursqualität intern.* Stimmt die Auswahl?
- **F4 — Erste Schauplätze & Figuren-Roster.** Welche fiktiven Westunion-Orte sollen die „Heimat" der ersten
  Episoden sein (Nordmark/Gallia/Balticum + weitere)? Sollen wir den Ziel-Roster (`targets.json`) für die
  Episoden erweitern (mehr benannte Figuren der Gegenseite, inkl. sympathischer Vermittler wie „Ina Brandt")?
- **F5 — Erzählerische Gegenseite (C9).** Sollen Einzelpersonen der Gegenseite (Faktencheckerin, Lokal­
  politikerin) *anklickbar/sprechend* werden (kurze Lageeinschätzung), oder bleiben sie Ziele ohne eigene Stimme?
- **F6 — Tonalität/Humor-Dosis in Episoden.** Reicht der trockene Team-Witz (Igor/Katja/Marina) als Würze, oder
  willst du an manchen Stellen mehr Schwärze/mehr Leichtigkeit? Beispiel zum Justieren liefern wir gern.

---

## 13. Was als Nächstes passiert
Nach deinen Antworten (F1–F6) leite ich daraus den **detaillierten Bau-Plan** ab (PR-Schnitt entlang der
Reihenfolge §9.3, je grün + simuliert, Draft-PR). Bis dahin: **kein Code** — dieses Dokument ist der
verlustfreie Übergabepunkt für die (frische) Bau-Session.
