# 🎯 Strang 3+4 — Aktions-Tiefe & Dialog-Mega-Update · Feinplan (Vorlage zur Owner-Abnahme)

**Status:** Planung — **noch kein Bau.** Owner-Abnahme abwarten.
**Datum:** 2026-06-13 · **Setzt auf:** `main` nach Strang 2 (PR #78) + Avatar-v2.
**Quellen:** `DECISIONS_2026-06-13B_TRANSCRIPT.md` (K38–K41, G22–G25, B5–B8 — Auftrag) ·
`NEXT_LEVEL_PLAN.md` (K3 gestützte Stimmen, K7 NPC-Tiefe, K14 Balancing) ·
`DIALOGUE_DIAGNOSIS.md` · `GESAMTKONZEPT_VISUELL.md` · `SOUL.md` · **eigene Code-/Daten-
Inventur** (2026-06-13, IST verifiziert).

> Verschränkt Strang 3 (Aktions-Überarbeitung) und Strang 4 (Dialog-Mega-Update), weil
> **„Aktion aus Dialog"** beide verbindet. Mechanik, PR-Schnitt, Risiken, Content-/Budget-
> Plan, offene Entscheidungen. Kein Asset-Spend ohne Kostenansage.

---

## 0. Gelockte Owner-Entscheidungen (2026-06-13, vorab)

| # | Frage | Entscheidung |
|---|---|---|
| 1 | Aktions-Modell | **NPCs schlagen kontextuell vor → Narrativ-Tafel plant** (K40). Kein flaches Gesamt-Deck mehr. |
| 2 | Tiefe-Mechanik | **Erst Basis breiter** (mehr granulare Aktionen + Aktion-aus-Dialog), Schlachtfeld-Kette (Ziel→Dossier→Kompromat→Kanal) als **2. Schritt**. |
| 3 | Reihenfolge | **Verschränkt** — Aktionen + Dialoge zusammen. |
| 4 | Vorgehen | **Erst dieser Feinplan zur Abnahme**, dann kleine grüne Schritte. |

---

## 1. IST-Stand (code-/daten-belegt)

- **30 Aktionen** (`data/actions.json`): Felder `id, phase, label_de, narrative_de,
  costs{budget,capacity,risk}, effects{…}, prerequisites[], unlocks[], npc_affinity[],
  legality, tags[]`. **Kein `broadcast`/`headline`-Feld** → TV/Bericht zeigen nur „Aktion
  durchgeführt" statt der Überschrift (B5 ⚠️). `broadcastMapping.ts` ist PROVISORISCH.
- **`npc_affinity`** ordnet jede Aktion einem NPC zu (z. B. „Zielgruppe analysieren" →
  marina). **`unlocks`** verkettet Aktionen (z. B. 1.1 → 1.7, 3.10). → **fertige Haken**
  für „NPCs bieten kontextuell an" (Modell 1) und für Ketten/Gebäude-Wachstum.
- **NPCs schlagen schon vor:** `AdvisorRecommendation.suggestedActions` + `NPCAdvisorEngine`
  (heute im Berater-Panel / `AdvisorDetailModal`, das eine Aktion ins Terminal highlightet).
- **Dialoge:** `data/dialogues.json` (~2175 Zeilen) + `topics_dialogues.json`
  (`schemaVersion/meta/topics/debates`): **14 Themen, ~149 Texte**, 16 Begrüßungen/Figur,
  Reaktionen, 20 Ambient/Figur. Der Reaktions-Weg ist seit 2026-05-31 verdrahtet
  (`DIALOGUE_DIAGNOSIS.md`, Test grün). **Problem ist nicht fehlender Inhalt, sondern der
  menü-hafte Fluss** („worüber willst du sprechen?") und **fehlende „Aktion aus Dialog"**.
- **Narrativ-Tafel (Strang 2):** zeigt heute ein **flaches Deck aller `availableActions`**.
  Muss laut Entscheidung 1 zu **„geplante, von NPCs angebotene Maßnahmen"** werden.
- **Balancing:** `BALANCING_ANALYSIS_2026-06-12.md` + K14: heute ~Dutzend Pfade, Verlieren
  schwer. Ziel G22: **100–500 Pfade** + längere Spielzeit → braucht Simulation.

---

## 2. Ziel-Architektur

### 2.1 Das eine Aktions-Modell (Entscheidung 1)
**Maßnahmen entstehen im Gespräch beim zuständigen Büro-NPC, nicht aus einer Liste.**

```
NPC-Raum betreten → Dialog (echtes Gespräch)
   → NPC bietet KONTEXTUELLE Maßnahmen an (gefiltert nach npc_affinity + Spielstand)
      → Spieler wählt im Dialog ("Aktion aus Dialog")
         → Maßnahme wird als KARTE auf die Narrativ-Tafel geheftet (Sendeplan)
            → auf der Tafel: Spur zuordnen, Reihenfolge, AUSSPIELEN (= executeQueue)
```
- Die **Tafel bleibt der Sendeplan** (Strang 2), aber ihr **Deck-Inhalt wird kuratiert**:
  statt „alle Aktionen" zeigt sie **die von NPCs angebotenen/freigeschalteten** Maßnahmen
  (das ehemalige flache Deck wird zur „heute verfügbar, weil bei NPC X besprochen"-Liste).
- **A1:** Das bestehende `ActionPanel`/Terminal bleibt als **Detail-/Nachschlage-Ansicht**
  erreichbar (Taste A) — niemand verliert den Überblick; nur der primäre Bedienweg ist Dialog.
- **Kein doppelter Bedienweg-Frust:** die Tafel zeigt das Ergebnis der NPC-Gespräche, das
  Terminal ist die Bibliothek. (Owner wählte ausdrücklich NICHT „beides parallel".)

### 2.2 „Aktion aus Dialog" als gemeinsame Wirbelsäule (Strang 3 ⟂ 4)
Eine Dialog-Option kann eine **Aktion auslösen ODER auf die Tafel heften**. Das verbindet
das Aktions- und das Dialog-System: dieselbe Daten-Struktur (`actionId`, optionale
`params`) wird vom Dialog-Knoten referenziert. So wird jeder Ausbau auf beiden Seiten
gleichzeitig nutzbar.

### 2.3 Daten-Modell-Erweiterungen (klein, rückwärtskompatibel)
- **Aktion bekommt eine Überschrift** (B5/B11): `headline_de/en` + optional `broadcast`
  (Kanal/Tier). Behebt „Aktion durchgeführt" überall (TV, Tagesfazit, End-Report).
- **Aktion bekommt optionale `params`** (Phase 2): `target` (Ziel-Person), `channel`
  (eigener Kanal / YouTuber), `kompromat`. Heute leer → keine Bruchgefahr.
- **`unlocks` erweitern** um optionale `unlocksRoom` / `unlocksNpc` → Gebäude-Wachstum (K40).
- **Dialog-Knoten** bekommt optional `offersActions: actionId[]` und
  `runAction: {actionId, params?}` → „Aktion aus Dialog".

### 2.4 Sprachebene (K41)
Natürlicher Umgangston, **persona-spezifischer trockener Witz**, kein Behörden-Deutsch.
Jede Figur erhält einen **Stil-Steckbrief** (Stimme/Tonfall/Tabus), an dem alle neuen
Texte gemessen werden (Qualitäts-Gate, ggf. starke Schreib-Agenten).

---

## 3. Phasen & PR-Schnitt (klein, je grün getestet)

> Verschränkt: jede Phase enthält einen Aktions- UND einen Dialog-Anteil. Reihenfolge nach
> Risiko (klein/sicher zuerst). Branch je Phase auf aktuellem `main`, Draft-PR.

### Phase 0 — Klare Kleinfixes (sofort-fähig, kein neues System)
- **P0a Aktions-Überschriften durchziehen (B5 ⚠️):** `headline_de` an alle 30 Aktionen;
  Broadcast/Tagesfazit/End-Report zeigen „Bot-Netzwerk gestartet" statt „Aktion durchgeführt".
  `broadcastMapping.ts` aus dem Provisorium auf das neue Feld heben.
- **P0b Direktor-Tageshinweise verständlicher (B5 ⚠️):** Hinweis nennt **konkret** Risiko/
  Problem/Empfehlung statt vager Sätze (`MorningBriefing`-Texte).
- *Test:* tsc/build/vitest grün; Smoke: Aktion ausführen → Überschrift erscheint in Broadcast/Fazit.

### Phase 1 — Basis verbreitern (verschränkt: NPC-Angebot ↔ echtes Gespräch)
- **P1a Aktion aus Dialog (Engine + Daten):** Dialog-Knoten `offersActions`/`runAction`;
  NPC-Dialog listet kontextuelle Maßnahmen (Filter `npc_affinity` + Freischaltung) → Wahl
  heftet auf die Tafel (`addToQueue`) oder führt sofort aus. Tafel-Deck = NPC-Angebote.
- **P1b Dialog-Fluss: Menü → Gespräch:** auf den **149 vorhandenen Texten** aufbauen
  (nichts wegwerfen, K39); Einstieg/Vertiefung/Wahl natürlicher verketten; „worüber willst
  du sprechen?" durch situationsbezogene Eröffnungen ersetzen.
- **P1c Mehr granulare, benannte Aktionen:** die 30 abstrakten Aktionen in **konkrete,
  plakative** Einzelmaßnahmen auffächern (G22), je mit `headline_de` + `npc_affinity` +
  `tags`; reale Methoden explizit benennen (G22, fiktiv gerahmt).
- **P1d Sprach-Steckbriefe** je NPC + erste Überarbeitung der häufigsten Texte (K41).
- *Test:* Dialog-Pfad-Charakterisierungstests erweitern; Smoke: NPC-Gespräch → Maßnahme
  landet auf der Tafel; Aktions-Überschrift im Broadcast.

### Phase 2 — Tiefe-Mechanik „Kommunikations-Schlachtfeld" (K40, der größere Brocken)
- **P2a Ziel-Personen (fiktiv):** kleiner Roster fiktiver Ziele (wie die 8 Milieus/Personas)
  — Politiker:innen/Institutionen-Vertreter, mit Schwächen/„Kompromat"-Haken. Daten + ggf.
  Porträt-Assets (Budget-Ansage vorab).
- **P2b Aktions-Kette:** Ziel wählen → **Dossier** (Aktion, deckt Schwäche auf) → **Kompromat**
  einsetzen → Größe einschätzen → **Kanal wählen** (eigener Propaganda-Kanal vs. YouTuber:
  Reichweite vs. Exklusivität/Wachstum) → **sichtbar/abschaltbar**. Nutzt `params` + `unlocks`.
- **P2c Fokusgruppen-Abfrage / Kredit beim Finanz-NPC** als weitere Nicht-Desinfo-Aktionen (K40).
- *Test:* Ketten-Logik als **pure, vitest-getestete** Zustandsmaschine; Balancing-Sim für die neuen Pfade.

### Phase 3 — Gebäude-Wachstum + Pfad-Tiefe
- **P3a Freischaltung:** `unlocksRoom`/`unlocksNpc` → neue Tür/Büro/NPC erscheint nach
  Fähigkeits-Aufbau (z. B. Bot-Netzwerk → Redaktions-Büro + NPC, der Vorschläge macht).
  `building.json` + `FloorDirectory` zeigen die neue Etage/Tür (3. Tafel-Spur schaltet mit).
- **P3b 100–500 Pfade + Simulation (G22/K14):** Pfad-Definition (s. §4) + erweiterte
  Balancing-Sim als Nachweis (gewinn- UND verlierbar, mehrere Strategien tragfähig).
- **P3c Adaptiver Restbestand / Atmosphäre-Anknüpfung** nur soweit nötig (Rest = Strang 5/7).

---

## 4. „100–500 Pfade" — Definition (damit es messbar ist)
Ein **Pfad** = eine unterscheidbare Kombination aus **Thema** (Energie/Migration/Wahl …) ×
**gestützter Stimme/Kanal** (K3) × **Ziel** × **Reihenfolge/Timing** × **Risiko-Ausgang** →
mündet in eines der **Enden** (Sieg-Nähe / Enttarnung / Pattstand …). Messung: die
Balancing-Simulation zählt erreichbare, sinnvoll verschiedene End-Konstellationen. **Nicht**
500 handgeschriebene Drehbücher, sondern **kombinatorische Tiefe** aus granularen Aktionen +
Parametern + Reifungs-/Gegenreaktions-Logik. (Vorbild: MadTV-Wiederspielwert aus wenigen
Systemen, viele Kombinationen.)

---

## 5. Dialog-Architektur (Strang 4 Detail)
- **Aufsetzen, nicht wegwerfen** (K39): die 14 Themen/149 Texte bleiben Datenbasis; der
  Umbau betrifft **Fluss + Verdrahtung + Aktion-aus-Dialog**, nicht das Neuschreiben von Null.
- **Gespräch statt Menü:** Eröffnung situationsabhängig (Spielstand/letzte Aktion/Stimmung),
  2–4 anschlussfähige Repliken, eingebettete **Maßnahmen-Angebote**.
- **Vertonung später (K13/D24):** erst Texte stabil, dann Platinum-Kerntexte in einem Batch
  (Kostenansage vorab). Phase 1–3 bleiben zunächst stumm/teilvertont.
- **Qualität:** Sprach-Steckbriefe + Review-Gate; für große Schreib-Wellen ggf. ein
  dedizierter Schreib-Agent mit hartem Persona-Briefing.

---

## 6. Risiken & Gegenmittel
| # | Risiko | Gegenmittel |
|---|---|---|
| R1 | Aktions-Modell-Umbau berührt die frische Tafel (Strang 2) | Tafel-API behalten, nur Deck-Quelle wechseln (NPC-Angebote); ActionPanel als Fallback (A1) |
| R2 | „Aktion aus Dialog" verändert Engine-Pfade | `offersActions`/`runAction` additiv + rückwärtskompatibel; Pfad-Charakterisierungstests vorher/nachher |
| R3 | Schlachtfeld-Kette (Phase 2) groß/komplex | Erst Basis (Entscheidung 2); Kette als pure Zustandsmaschine, vitest-first |
| R4 | 100–500 Pfade unscharf | Klare Pfad-Definition (§4) + Simulations-Messung, kein Hand-Drehbuch-Wahn |
| R5 | Sprach-Niveau / Konsistenz | Persona-Steckbriefe + Review-Gate; starke Schreib-Agenten nur mit Briefing |
| R6 | Content-/Asset-Kosten (Ziele/NPCs, Vertonung) | Erst Daten/Logik, Assets nur bei Bedarf; **Kostenansage vor jedem Live-Lauf** |
| R7 | Balancing kippt (zu leicht/schwer) | K14-Stellschrauben + Vorher/Nachher-Sim als Pflicht-Nachweis |

## 7. Content-/Budget-Plan
- **Phase 0–1:** überwiegend **Daten + Code**, kein/kaum Asset-Spend (Texte, Felder, Verdrahtung).
- **Phase 2:** evtl. **Ziel-Personen-Porträts** (fiktiv) — Schätzung je nach Anzahl, z. B.
  6–10 Porträts @2K ≈ **$0,8–1,3** (Vision-Review je Bild). Erst bei Abnahme der Roster-Größe.
- **Phase 3+ Vertonung:** Platinum-Kerntexte als ElevenLabs-Batch — **Kostenansage vorab** (D24).
- **Regel:** Standard Dry-Run; `--live` nur mit vorheriger Kostenansage; Pipeline-`npm test` grün.

## 8. Offene Owner-Entscheidungen (für die Abnahme)
- **D-1 Aktions-Granularität:** Wie fein? (Richtwert: aus 30 → ~60–100 benannte Einzelaktionen
  in Phase 1.) Empfehlung: schrittweise, je Büro/Thema ein Paket.
- **D-2 Ziel-Roster-Größe (Phase 2):** Wie viele fiktive Ziele zum Start? Empfehlung **6–8**
  (wie Milieus), erweiterbar.
- **D-3 Kanäle:** „eigener Kanal vs. YouTuber" als **zwei** Kanaltypen genügt zum Start? Empfehlung **ja**.
- **D-4 Direktor-Hinweise:** sollen sie konkrete Aktionen vorschlagen (klickbar) oder nur warnen?
  Empfehlung: **warnen + auf zuständigen NPC verweisen** (diegetisch).
- **D-5 Vertonungs-Umfang Phase 1:** stumm lassen bis Texte stabil? Empfehlung **ja** (Budget/D24).

## 9. Qualitäts-Kontrakt je PR (SOUL §4)
`tsc` + `npm run build` + `vitest` grün vor Push · Pfad-Charakterisierungs-/Balancing-Tests
für Engine-Änderungen · Browser-Smoke für Bedien-Pfade · neue Bilder Vision-Review · **A1-
Checkliste** (keine Funktion verloren) · Commit deutsch + Session-Footer · Draft-PR.

---

## 10. Owner-Abnahme (2026-06-14)

**D-1** ✅ wie empfohlen — schrittweise aus 30 → ~60–100 benannte Einzelaktionen, je Büro/Thema ein Paket.
**D-2** ✅ wie empfohlen (Start **6–8** Ziele), **aber bewusst erweiterbar** halten — Roster **daten­getrieben** (JSON wie die Milieus), neue Ziele ohne Code-Änderung ergänzbar.
**D-3** 🔁 **neu zu fassen** (s. §10.1) — „Kanal" ist zu eng; mehr realistische Breite, weil Content-Creator mehrere Plattformen gleichzeitig bespielen.
**D-4** ✅ wie empfohlen — Direktor-Hinweise **nicht klickbar**: warnen + sagen, **wo** man die Empfehlung holt (zuständiger NPC), diegetisch.
**D-5** ✅ wie empfohlen — Vertonung erst, wenn Texte stabil (D24/Budget).

### 10.1 D-3 neu: Verbreitungs-/Verstärkungs-Modell (statt „Kanal")
Zwei getrennte Achsen statt eines einzelnen „Kanals" — das bildet die Realität ab und gibt
Anfangs-Breite:

- **Achse A — Verbreiter/Asset (WER trägt die Botschaft):** baut auf K3 „gestützte Stimmen"
  auf und erweitert sie: Content-Creator/Influencer · Ex-Politiker/„Experten" · Rand-Akademiker ·
  Schein-NGO · Pseudo-Thinktank · ideologisch Überzeugte · **eigene Frontmedien** (RT-Analogon) ·
  **Bot-/Sockpuppet-Netzwerke** (Verstärkung). Ein Asset wird auf-/ausgebaut, wächst, kann auffliegen.
- **Achse B — Plattform/Oberfläche (WO es landet):** je eigene Dynamik — Kurzvideo (TikTok-artig) ·
  Video (YouTube-artig) · Text/Feed (X-artig) · Messenger/geschlossene Gruppen (Telegram-artig) ·
  **Platzierung in etablierten Medien** (über gestützte Stimmen/Gastbeiträge).
- **Kern-Realismus (Owner-Punkt):** ein **Verbreiter bespielt MEHRERE Plattformen** gleichzeitig —
  Asset ≠ einzelner Kanal. Eine Maßnahme wählt also *Verbreiter* **und** *Plattform-Mix*.
- **Trade-offs je Kombination:** Reichweite · Glaubwürdigkeit/Milieu-Passung · Aufbaukosten/-zeit ·
  Enttarnungs-Risiko/Abschaltbarkeit. → ersetzt das simple „eigener Kanal vs. YouTuber".
- **Detaillierung:** reale Muster (China/RU/Iran/NK, Tenet-Media-/„Voice of Europe"-Fälle) per
  **Exa-Recherche VOR P2**; Ergebnis als eigenes Konzept-Kapitel + Daten-Schema.

→ **§3 Phase 2 (P2b)** wird entsprechend von „Kanal wählen" auf „**Verbreiter + Plattform-Mix wählen**"
gehoben; Datenmodell `params` erhält `carrier` (Asset-Id) + `platforms[]` statt eines einzelnen `channel`.

**Stand:** Plan inhaltlich abgenommen; Bau kann mit **P0** starten (P0 berührt D-3 nicht).
