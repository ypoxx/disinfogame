# 🎭 KONZEPT — Herzstück-Update: Episoden · Gesellschaftswerte · Vernetzung

**Status:** **Konzept ABGENOMMEN (Owner, 2026-06-14, 2 Transkript-Runden).** **KEIN Bau bis zum Bau-Plan.** **Datum:** 2026-06-14
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
Owner-Antworten zu F1–F7 sind da (Transkript 2026-06-14 Abend) — destilliert + vertieft in **§14**.
Noch in konzeptioneller Vertiefung (Owner-Wunsch: F1/F3/F5 tiefer denken, bevor codiert wird). Erst danach
detaillierter Bau-Plan. **Vorher kein Code** — dieses Dokument bleibt der verlustfreie Übergabepunkt.

---

## 14. Owner-Transkript 2026-06-14 (Abend) — Entscheidungen & Vertiefung F1–F7

### 14.0 Entscheidungs-Destillat
| F | Thema | Entscheidung |
|---|---|---|
| F1 | Mehrere Sieg-Pfade | **Ja, es gibt sie** — aber Vertrauenserosion bleibt das gemeinsame *Mittel*; die Pfade sind unterschiedliche **strategische Aufträge** (§14.1). Implementierung gestaffelt, **Konzept aber JETZT** (Abhängigkeiten). |
| F2 | Publikum-Rückwirkung | ✅ wie besprochen: **Broadcast/TV/Feed = Schaufenster** (Spaß, plakativ); Beratung/Hinweise in Fokusgruppe/NPC/Bericht. Später optional eine schöne **Datenansicht** („Glücksatlas", §14.2). |
| F3 | Sichtbare Werte | ✅ 4 sichtbar — aber **stärker erzählerisch** über fiktive **Umfragen/Barometer als Nachrichten**, verzögerte/nicht-lineare Effekte, intern reich (Formeln) (§14.2). |
| F4 | Schauplätze/Figuren | **Orte sekundär**: Westunion = **EIN komplexes Land** (föderal/kommunal + europäische Ebene). Ziel: **größte erzählerische Breite**, diverse Figuren, **Replay** (Plague-Inc.-Vorbild). Nicht alle Inhalte je Durchlauf (§14.5). |
| F5 | Erzählerische Gegenseite | **Ausbauen** — Einzelpersonen der Gegenseite hör-/sichtbar via **Newsroom** (Interview/Talkshow/Bericht), spiegeln deren Wissensstand; Publikum reagiert (Feedback-Schleife) (§14.3). |
| F6 | Humor-Dosis | **Feiner, entdeckbarer Umgebungshumor** (Plakate/Kaffeeküche/Pförtner …), **nicht** im Plot; Justier-Beispiele in §14.4. |
| F7 | Korkbrett | ✅ **Variante A**: Brett = Kampagnen-Planer, Spuren = aktive Episoden-Stränge (ggf. später noch vertiefen). |

### 14.1 F1 vertieft — Strategische Aufträge statt generischer „Destabilisierung"
**Kern-Reframe (Owner):** In der Realität bricht eine Gesellschaft durch Desinfo nicht einfach „zusammen" —
man **erreicht bestimmte Ziele**. Also: **Vertrauenserosion ist das Mittel, der Auftrag ist das Ziel.** Das
löst die „mehrere Sieg-Pfade"-Frage elegant und gibt Replay-Wert (wie Plague Inc.: verschiedene Strategien).

**Fünf Auftrags-Archetypen v2 (heute-anschlussfähig, Westunion-fiktiv, KEIN expliziter Krieg —
Owner-Korrektur: „Kriegsmüdigkeit war nur Beispiel"). Je eigene Wert-Signatur + eigenes Ende:**
1. **„Der Keil" — Gesellschaft an einem Reizthema spalten** *(Default/Tutorial-Auftrag)*. Ein Reizthema
   (Migration, Energie, Identität, Stadt↔Land) so aufladen, dass der Kulturkampf den Diskurs frisst.
   *Signatur:* Polarisierung↑↑, Diskursqualität↓, Fragmentierung↑. *Lehrt den Kern-Loop.* *Heute:* jede
   vergiftete Dauerdebatte.
2. **„Der Stillstand" — Lähmung & Reformblockade.** Kompromiss delegitimieren, bis das Land politisch
   handlungsunfähig und wirtschaftlich träge ist. *Signatur:* Polarisierung↑ + Reform-/Governance-Fähigkeit↓
   + Kompromissfähigkeit↓. *Heute:* „die da oben kriegen nichts geregelt".
3. **„Die Wahl" — eine politische Kraft kippen.** Eine uns genehme/radikale Kraft stärken, die Beteiligung
   der anderen drücken; das Land driftet. *Signatur:* Fraktions-Stärke (uns nah)↑ + Vertrauen in etablierte
   Kräfte↓ + Beteiligung der Gegenseite↓. *Heute:* Wahlbeeinflussung, Aufstieg der Ränder.
4. **„Der Rückzug" — Bündnis- & Solidaritätsmüdigkeit** *(ersetzt „Kriegsmüdigkeit", ohne Krieg)*. Das Land
   nach innen drehen — gegen das Bündnis, gegen Hilfe für andere, „wir zuerst", Austritts-Stimmung.
   *Signatur:* Bündnis-/Solidaritätsbereitschaft↓ + Nationalismus↑ + Vertrauen in „die Eliten"↓. *Heute:*
   Anti-EU/Austritt, Sanktions-/Hilfsmüdigkeit, Isolationismus.
5. **„Der Zweifel" — Wahlen/Fakten/Institutionen delegitimieren.** Nicht eine Lüge durchsetzen, sondern dass
   man *nichts* mehr glaubt — Wahlen „manipuliert", Experten „gekauft", Medien „Lügen" → Zynismus & Rückzug.
   *Signatur:* Vertrauen↓↓ + Zynismus/Erschöpfung↑ + Medienkompetenz↓. *Heute:* „gestohlene Wahl",
   Wissenschaftsleugnung, „Lügenpresse".

*„Abstieg/Niedergangsspirale" (alte #4) ist kein eigener Start-Auftrag mehr, sondern ein mögliches
**Langzeit-Ende** aus Stillstand+Rückzug (Selbstschädigung/Abschottung) — als Ende vorgemerkt.*
*(Optional/später, vom Owner als „nicht im Fokus": gegnerische Länder stärken.)*

**Gemeinsames Substrat:** Vertrauenserosion ist Voraussetzung für ALLE Aufträge; jeder Auftrag hat zusätzlich
seine **Signatur-Achse(n)** und ein **eigenes Ende**. v1 darf „Vertrauen erodieren" als einzigen *spielbaren*
Sieg implementieren — aber die Enden/Signaturen werden schon mitgedacht.

**⚠ Abhängigkeit JETZT bedenken (Owner-Punkt):** Das **Werte-Set muss die Auftrags-Signaturen von Anfang an
abdecken**, auch wenn manche Werte zunächst nur intern laufen — sonst muss später umgebaut werden. Konkret
braucht das Modell (über §4 hinaus) zusätzlich **intern**: *Wehrhaftigkeit/Unterstützungsbereitschaft ·
Reform-/Innovationsfähigkeit (Governance) · Fraktions-Stärke (block-nah).* Diese drei jetzt im Datenmodell
vorsehen (nicht zwingend im HUD).

→ **Offen/zu vertiefen:** Welche 2–3 Aufträge bauen wir zuerst aus? Wählt der Spieler den Auftrag am Anfang
(Plague-Inc.-Stil) oder ergibt er sich emergent? *(Empfehlung: 1 Auftrag als „Tutorial"-Default + Wahl beim
Neustart; emergente Enden ab v1.)*

### 14.2 F3 vertieft — Den Gesellschaftszustand erzählerisch zeigen
**Problem (Owner):** Reine Werte/Balken bleiben „nur Spiel". **Lösung:** denselben Zustand zusätzlich über
**fiktive, wiederkehrende Mess-Instrumente als Nachrichten** zeigen — greifbar, alltagsnah, mit erkennbarer Frage:
- **„Westunion-Stimmungsbarometer"** (allg. Stimmung, periodisch als News): zeigt *die Frage* + wie Segmente
  antworten. Macht den Mechanismus lesbar („Vertrauen in die Verwaltung: 41 % — Tendenz fallend").
- **„Glücksatlas der Westunion"** (Wohlbefinden je Region/Milieu) — die spätere, schönere **Datenansicht** (F2).
- **„Westunion-Wahltrend / Politbarometer"** (Fraktions-Stärken über Zeit) — speist den Auftrag „Seitenwechsel".
- **„Vertrauensindex"** (Institutionen/Medien).
Je mit erfundenem Institut-Namen; kommt **als Nachricht**, nicht nur als Dauer-Zahl (MadTV-Einschaltquoten-Logik:
darf trotzdem regelmäßig erscheinen). **Effekte verzögert/nicht-linear:** eine Aktion sät, das Ergebnis zeigt
sich in der nächsten Umfrage; Weltereignisse drücken unabhängig. **Intern reich:** Werte beeinflussen einander
in **Formeln** (z. B. hohe Informationslast dämpft Korrektur; hohe Polarisierung beschleunigt Fragmentierung) —
„schöne, gute Komplexität hinten, niedrigschwellig vorn" (Owner-Leitsatz). HUD-Balken = Schnell-Anzeige; Umfragen
= das erzählerische Gesicht desselben Zustands.

**Instrument ↔ Auftrag (B-Check, damit erzählerisch keine Lücke entsteht):** jeder Auftrag (§14.1) hat ein
sichtbar-machendes Instrument — *Keil* → Stimmungsbarometer (Lager-Abstand wächst) · *Stillstand* → „Reform-/
Zufriedenheits-Monitor" (es geht nichts voran) · *Die Wahl* → „Westunion-Wahltrend/Politbarometer" · *Rückzug*
→ „Bündnis-/Außen-Barometer" (Zustimmung zum Bündnis sinkt) · *Zweifel* → „Vertrauensindex" (Institutionen/
Medien/Wahlen). So liest man den Fortschritt seines Auftrags an einer Umfrage ab.

### 14.3 F5 vertieft — Die erzählerische Gegenseite (Newsroom + wahrnehmbare Akteure)
**Owner:** Die Gegenseite soll greifbar werden — aber **nicht im Gebäude** (nicht Pförtner/Putzkraft). Weg:
über die **Medienflächen**, v. a. einen **Newsroom**:
- **Formate:** „Im Gespräch" (Interview mit einer Faktencheckerin/Journalistin) · „Talk am Abend" (Talkshow,
  mehrere Stimmen, *unterschiedliches Framing*) · „Westunion-Bericht" (Magazin/Doku: Wie weit ist die Aufklärung?).
- **Spiegelt den Wissensstand der Gegenseite** — genau das, was die Maschine schon berechnet (Aufmerksamkeit/
  Entdeckungsdruck/verbrannte Assets, s. „Loop schließen"): aus der Zahl wird eine kleine Geschichte/Vignette.
  Manchmal weiß die Gegenseite viel, manchmal (noch) nichts.
- **Feedback-Schleife mit dem Publikum:** Taucht im Broadcast „Faktencheckerin enttarnt Kampagne" auf, reagiert
  das Publikum sichtbar (resigniert „wussten wir eh" / aufgeschreckt / will demonstrieren). Die Gegenseite wird
  *wahrgenommen* — das macht sie real.
- **Bezug:** realisiert C9; nutzt `actor-ai.ts` (Wettrüsten) + die bestehende Enttarnungs-/Resilienz-Mechanik.

→ **Offen/zu vertiefen:** Ist der **Newsroom** eine eigene neue Fläche (Etage/Raum) oder eine erweiterte
Broadcast-Ansicht? *(Empfehlung: Broadcast unten = Schnell-Spiegel; Newsroom = vertiefende Fläche, dort
interpretiert ein NPC — deckt sich mit deiner F1-Newsroom-Idee.)*

### 14.4 F6 — Umgebungshumor (Feinheiten mit Spielbezug) — Justier-Beispiele
Humor lebt in der **Welt**, nicht im Plot; trocken, entdeckbar, nie platt:
1. **Klickbare Propaganda-Plakate** im Flur (Vergrößerung): „Einigkeit durch Meinungsvielfalt — abweichende
   Meinungen ausgenommen." / „Die Wahrheit ist, was alle teilen."
2. **Kaffeeküche** (Tür ohne Spiel-Funktion): die **Anzahl/Vielfalt der Kaffeesorten** spiegelt den Wirtschafts-
   /Sanktionsstand des Landes (gute Zeiten: exotische Sorten; schlechte: nur noch „Zichorie, Ersatz").
3. **Pförtner/Putzkraft/Statisten** mit situativen Einzeilern, die auf den Kampagnen-Stand reagieren („Ruhig
   heute. Zu ruhig." · Putzkraft: „Die da oben machen auch nur ihren Job. Wie ich.").
4. **Büropflanze** gegossen/vertrocknet je nach Moral/Stand (SOUL-Beispiel).
5. **Schwarzes Brett / Aktennotizen** mit absurden Dienstanweisungen („Memo: ‚Spontane Bürgerinitiativen' bitte
   bis Freitag einreichen.").
6. **Versionsanzeige/Easter-Egg** beim Klick auf bestimmte Details (s. 14.6).

**Weitere Beispiele (NEU, nicht vom Owner) — je mit Spielbezug, denn Feinheiten sollen auf das Spiel
verweisen, nicht beliebige Gags sein (SOUL §9):**
7. **Der Reißwolf, der nie leer wird** — neben dem Schreibtisch quillt der Aktenvernichter über; je höher dein
   Entdeckungsdruck/Risiko, desto voller. *Warum:* macht „Spuren verwischen/OPSEC" beiläufig sichtbar — Humor,
   der direkt am Risiko-Stand hängt.
8. **Wand der „Mitarbeiter des Monats"** — Porträts, aber alle mit demselben generischen Gesicht; bei Klick
   wechselt nur der Deckname. *Warum:* trockener Kommentar zur Austauschbarkeit von Sockenpuppen — spiegelt die
   Verbreiter-Mechanik.
9. **Getränkeautomat „Volksbrause"** — eine einzige Sorte, deren Etikett auf dein laufendes Narrativ reagiert
   („Jetzt mit Heimat-Geschmack!"). *Warum:* Selbst-Propaganda im eigenen Haus, gekoppelt an die aktive Kampagne.
10. **Bürger-Beschwerde-Telefon „dauerhaft in Wartung".** *Warum:* dezenter Hinweis auf die Einbahn-Kommunikation
    des Regimes — Atmosphäre statt Plot.
11. **Weltkarte im Direktor-Büro**, auf der „Westunion" je nach Deutungshoheit mehr/weniger eingefärbt ist, mit
    handschriftlichen Rand-Notizen. *Warum:* macht den abstrakten Fortschritt diegetisch greifbar + zeichnet den
    Direktor.
12. **Pförtner liest täglich „dieselbe" Zeitung — mit deiner letzten Broadcast-Schlagzeile.** *Warum:* verbindet
    die Umgebung mit der Broadcast-Mechanik: der kleine Mann konsumiert, was du produzierst.

Dosis: Episoden bleiben überwiegend ernst/sachlich; die **Leichtigkeit kommt aus der Umgebung**.

### 14.5 F2/F4 Nachträge
- **Westunion = EIN komplexes Land** (föderal/kommunal/ländlich + europäische Kontext-Ebene), nicht mehrere
  Länder. Schauplätze sind **sekundär**; Priorität = **erzählerische Breite + Diversität + Replay**. Vorbild
  **Plague Inc.**: verschiedene Start-/Vorgehensweisen (langsam-heimlich vs. große Welle) → Variation ab Beginn.
  Nicht alle Inhalte je Durchlauf sichtbar (Wiederspielwert).
- **Glücksatlas-Datenansicht** (F2): spätere, schönere datengetriebene Darstellung — als Option vorgemerkt.

### 14.6 Technische Nebennotiz — Versionsanzeige dynamisch
Startseite zeigt statisch „0.9". **Wunsch:** Mechanismus, der die Versionsanzeige **automatisch je PR/Commit**
fortschreibt (ggf. mit Bild/Build-Stempel), damit man den ausgelieferten Stand **direkt sieht** — hilft auch,
**Cache-Probleme** zu erkennen. *(Eigenständiger kleiner Technik-Task, unabhängig vom Konzept; hier nur notiert.)*

### 14.7 Stand der Rückfragen (Owner-Transkript 2 + 3)
- **A — F1-Aufträge:** ✅ **abgenommen.** Default-Auftrag als Einstieg/Tutorial, danach emergent.
  **Archetypen v2 (§14.1) abgenommen** („Archetypenset passt sehr gut"). *Bau-Reihenfolge:* zuerst
  **„Der Keil" (Default) + „Die Wahl" + „Der Zweifel"** (Empfehlung; Owner widersprach nicht).
- **B — F3-Instrumente:** ✅ abgenommen + gegen die Archetypen gemappt (§14.2).
- **C — F5-Newsroom:** ✅ gelockt — Broadcast unten = Schnellansicht, Newsroom = Vertiefung (NPC deutet).
- **D — F6:** ✅ **abgenommen** („Humorbeispiele sind super") — Linie + 12 Beispiele (§14.4).

