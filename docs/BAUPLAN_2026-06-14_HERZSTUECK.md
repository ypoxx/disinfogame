# 🏗️ BAU-PLAN — Herzstück-Update (Episoden · Werte · Aufträge · Vernetzung)

**Status:** Bau-Plan zum abgenommenen Konzept. **Datum:** 2026-06-14. **Für:** frische Bau-Session.
**Grundlage (Pflichtlektüre vorab):** `KONZEPT_2026-06-14_HERZSTUECK_EPISODEN_WERTE.md` (abgenommen) →
darin v. a. §4 Werte, §9 Architektur/Abhängigkeiten, §10 Risiko-Register, §14 Owner-Entscheidungen.
Außerdem `SOUL.md` (§4 Qualitätskontrakt) und `desinformation-network/.claude/CLAUDE.md`.

> **Leitplanken (gelten für JEDEN Schritt):** vor jedem Push **`npx tsc --noEmit` · `npx vitest run` ·
> `npm run build` grün**; **Balancing-Änderungen mit Vorher/Nachher-Simulation belegen**
> (`balance-sim.test.ts` + `balance-sim-p2.test.ts`); **alles additiv/rückwärtskompatibel**; **Draft-PR je
> Phase**; **Assets nur mit Budget-Ansage** (Skill `pixel-asset-pipeline`, Vision-QC); STATUS.md am Ende.
> **Owner-Leitsatz:** schöne Komplexität hinten (Formeln, viele Werte), niedrigschwellig vorn (4 sichtbare
> Werte, plakativ). Fiktiv (G23/G24); reale Fälle nur im End-Report (G22/F21).

---

## Reihenfolge & Abhängigkeiten (Überblick)
```
P0 Hygiene (save/load-Migration, ID-Validator, Versionsanzeige)
  └─► P1 Werte als Zustand (B2a, sichtbar, KEIN Sieg-/Kollaps-Change)
        └─► P2 Effekt-Splitting + Formeln (B2b)
              ├─► P3 Angriffs-Phänomene (additive Aktionen → speisen Werte)
              ├─► P4 Episoden-Ebene (B1) + Korkbrett = Kampagnen-Planer
              │     └─► P5 Aufträge (Archetypen) + Enden (Signaturen)
              └─► P6 Vernetzung (Umfragen-News · Broadcast · Newsroom/Gegenseite · Fokusgruppe)
P7 Umgebungshumor + Ethik-Geländer (weitgehend unabhängig, zuletzt)
```
Kritischer Pfad: **P0 → P1 → P2**, weil alles durch `applyActionEffects → obj_destabilize` und save/load läuft.

---

## P0 — Vorbereitung & Hygiene (klein, risikolos, ermöglicht den Rest)
**Ziel:** sichere Grundlage für neue persistente Werte + ID-referenzierte Episoden.
- **Save/Load-Migration härten:** `version`-Bump + **Default-Merge** in `loadState` (`StoryEngineAdapter.ts:~5034`),
  damit künftige neue Felder bei alten Saves nicht `undefined`/NaN werden (Risiko R1). Test: alter Save → lädt sauber.
- **Zentraler ID-Validator beim Laden:** warnt bei toten Refs (actionIds/targetIds/npcIds/episodeIds) — entschärft
  R3/R4. Reiner Lade-Check, kein Spielverhalten.
- **Dynamische Versionsanzeige** (Technik-Nebentask §14.6): Build-Stempel (Commit/Datum) statt statischem „0.9";
  hilft Cache-Diagnose. Klein, unabhängig — kann auch separat laufen.
- **Gate:** tsc/vitest/build grün; balance-sim unverändert. **Done:** Migration + Validator getestet.

## P1 — B2a: Gesellschaftswerte als Zustand (sichtbar, OHNE Sieg-Änderung)
**Ziel:** mehrdimensionaler Zustand existiert, ist sichtbar — Balance bleibt nachweislich identisch.
- **`StoryResources` erweitern** (`StoryEngineAdapter.ts:141`): **sichtbar (4):** `polarisierung`, `fragmentierung`,
  `informationslast`, `zynismus`; **intern:** `diskursqualitaet` + die **Auftrags-Achsen** (Konzept §14.1):
  `wehrhaftigkeit`, `reformfaehigkeit`, `fraktionsstaerke`. Startwerte in `createInitialResources` (`:552`).
- **Persistenz:** in `saveState`/`loadState` (mit P0-Default-Merge).
- **HUD:** 4 sichtbare Werte in `StoryHUD.tsx` (kompakt, niedrigschwellig, O3); Rest intern.
- **WICHTIG:** `applyActionEffects`/`obj_destabilize`/Sieg-Gatter NICHT anfassen.
- **Gate:** tsc/vitest/build; **balance-sim UNVERÄNDERT** (gleiche Win-Rate = Beweis, dass nichts kippt).
- **Risiko:** R1 (save/load), R9 (UI-Last). **Done:** Werte laufen + sichtbar, Balance identisch.

## P2 — B2b: Effekt-Splitting + Formel-Wechselwirkungen
**Ziel:** Aktionen speisen die neuen Werte (heute in `obj_destabilize` kollabiert).
- **`applyActionEffects`** (`StoryEngineAdapter.ts:3708–3870`): die bereits berechneten Effekte (`polarization`,
  `division`, `content_quality`, `amplification` …) **zusätzlich** in die passenden Werte schreiben —
  `obj_destabilize`-Mathematik (×0.625) **unangetastet** (K14-Schutz, R2).
- **Dünne Formeln** (Owner: „intelligent, nicht plus/minus"): z. B. hohe `informationslast` dämpft Korrektur-
  wirkung; hohe `polarisierung` beschleunigt `fragmentierung`; `zynismus` senkt Wirkung von „positiven" Reizen.
  Klein/tunbar halten, je als pure Funktion (testbar).
- **Gate:** tsc/vitest/build; **Vorher/Nachher-Sim (K14)**: Win-Rate stabil; neue Werte plausibel verteilt.
- **Risiko:** R2 (Balance), R10 (Sim-Asserts). **Done:** Werte bewegen sich kohärent, Balance gehalten.

## P3 — B3: Angriffs-Phänomene (additive Aktions-Familien)
**Ziel:** die fehlenden „Verben" (Konzept §5), jede mit Heimat-Wert + Lernmoment.
- **Daten:** neue Aktionen in `actions*.json` für: **Überflutung als Waffe · Gerüchte-Mutation · Zermürbung/Apathie ·
  Krisen-Zeitfenster (diegetisch motiviert) · Identitäts-/Loyalitätsfalle · Erinnerungskonflikt.** Je mit
  `headline_de`, `tags`, `npc_affinity`, neue `effects`-Keys.
- **Engine:** je neuem Effekt-Key ein Zweig in `applyActionEffects` (Muster vorhandener Zweige).
- **Atlas:** Mapping in `disinfo_methods.json` prüfen/ergänzen (Coverage-Test ≥85 % halten).
- **Gerüchte-Mutation/Krisenfenster:** ggf. kleine Zustandslogik (Phasen-Reifung) — als pure Funktion + Test;
  Krisenfenster an `world-events`/`activeOpportunityWindows` koppeln (kein abstrakter Timer, Prinzip 3).
- **Gate:** tsc/vitest/build + Sim **nach jedem Bündel**. **Risiko:** R10. **Done:** Phänomene spielbar, Sim grün.

## P4 — B1: Episoden-Ebene + Korkbrett = Kampagnen-Planer
**Ziel:** die Wirbelsäule — situierte Geschichten, die Aktionen/NPCs/Ziele bündeln (Konzept §3).
- **Daten:** `episodes.json` nach Schema §3.2 (ID-referenziert: `targets`/`npcs`/`actions`; `wirkt_auf` Werte;
  `lernmoment_id` → Atlas; `freischaltung` optional). **Großer Batch** (O4): Kern-Episoden handschreiben
  (inkl. der kanonischen „Veen/Ferro/Brücke" + Archetyp-passende), dann Vorlagen/Schreib-Agent (Persona-Gate).
- **Loader + `episodeState`** (offered/active/completed) in save/load (Muster: Combo/Crisis-State).
- **Auslösung (emergent-kuratiert, O1):** über den **lebenden** `buildActionOfferChoices`/`interactWithNpc`-Pfad
  (`useStoryGameState.ts:89/1217`), Verfügbarkeits-Gates analog `activeOpportunityWindows`. **NICHT** auf
  `processTopicResponse` (toter Stub, R4).
- **Korkbrett (F7=A):** `NarrativeBoard.tsx` — **Spuren = aktive Episoden-Stränge** (≤3), Karten zahlen auf eine
  Episode ein (statt kosmetischer `index % slots`-Verteilung, `:114`). Macht Planung↔Operationen lesbar.
- **Debrief:** Episode-Lernmoment fließt in `EndingGameState`/End-Report.
- **Gate:** tsc/vitest/build + Browser-Smoke (NPC bietet Episode → Karte auf Spur → Ausspielen → Debrief).
- **Risiko:** R3 (ID-Kopplung → P0-Validator), R5 (zwei Dialog-Systeme: in EINS integrieren), R7 (Text-Flut →
  Insert-Library). **Done:** mind. der Kern-Episoden-Batch spielbar, Brett sinnvoll.

## P5 — Aufträge (Archetypen) + Enden
**Ziel:** „Vertrauen = Mittel, Auftrag = Ziel" (Konzept §14.1).
- **Aufträge** als Objectives mit Wert-**Signaturen**: zuerst **„Der Keil" (Default/Tutorial) + „Die Wahl" +
  „Der Zweifel"** (`initializeObjectives`, `:608` — ersetzt das hartcodierte `// TODO: scenario definition`).
- **Auftrags-Wahl:** Default beim Einstieg, Wahl beim Neustart (Plague-Inc.-Stil, Replay).
- **Enden:** `EndingSystem` um signatur-getriebene Enden erweitern (`EndingGameState` Werte-Felder ergänzen,
  `:5468`); v1: `obj_destabilize` bleibt spielbarer Sieg, Signaturen bestimmen **welches** Ende; alternative
  Sieg-Signaturen als späterer Ausbau (F1-Empfehlung). „Abstieg" = Langzeit-Ende aus Stillstand+Rückzug.
- **Gate:** tsc/vitest/build + Sim (jeder Auftrag gewinn- UND verlierbar). **Done:** 3 Aufträge spielbar mit eigenen Enden.

## P6 — Vernetzung: Umfragen-News · Broadcast · Newsroom/Gegenseite · Fokusgruppe
**Ziel:** dasselbe Material belebt alle Schauflächen (Konzept §7, §14.2/§14.3).
- **Umfragen/Barometer als News (F3):** periodische, archetyp-gemappte Instrumente (Stimmungsbarometer/Wahltrend/
  Bündnis-Barometer/Vertrauensindex) — Frage + Segment-Antworten, verzögert/nicht-linear. Neue News-Quelle.
- **Broadcast (Schnellansicht):** `mapActionToBroadcast` (`broadcastMapping.ts:64`) liefert Schlagzeile aus der
  **aktiven Episode**; Publikum reagiert auf den **Werte-Vektor** (`audienceModel.ts` `reactToEffect`/`nextMood`),
  Stimmung kann segmentübergreifend kippen. (F2: Schaufenster, keine Endlosschleife.)
- **Newsroom (Vertiefung, C):** neue Fläche — Interview/Talkshow/„Westunion-Bericht"; **erzählerische Gegenseite
  (C9):** Wissensstand/Resilienz der Gegenseite als kleine Geschichte (aus Entdeckungsdruck/Enttarnung); NPC deutet.
- **Fokusgruppe:** zwei Props mehr (letzte N Aktionen/Episoden + Werte je Segment); Personas reagieren auf die
  Episode ihres Milieus (`FokusgruppeView.tsx`); ggf. an Ereignis statt nur Raum-Betreten koppeln.
- **Assets (Budget-Ansage!):** TV-Schlagzeile/Person/Talkshow/Breaking-News, Newsroom-Raum, Umfrage-Grafiken →
  `pixel-asset-pipeline`, staffelbar (zuerst CSS/Platzhalter, dann generieren).
- **Gate:** tsc/vitest/build + Smoke je Fläche. **Risiko:** R5/R6 (kanonischer „Vertrauens"-Begriff), R8 (Broadcast-
  Rückwirkung bewusst), R7 (Texte). **Done:** Broadcast/Newsroom/Fokusgruppe reagieren auf Episoden+Werte.

## P7 — Umgebungshumor + Ethik-Geländer (zuletzt, niedrige Prio)
**Ziel:** Leichtigkeit aus der Welt + Schutz-Geländer (Konzept §6, §14.4).
- **Umgebungshumor:** klickbare Plakate, Kaffeeküche (Sorten = Wirtschaftslage), Reißwolf (= Entdeckungsdruck),
  „Mitarbeiter des Monats"-Wand, „Volksbrause"-Automat, Pförtner-Zeitung (= letzte Broadcast-Headline) … (assets/UI).
- **Ethik-Geländer (B4):** Helden-Siegtext entschärfen (`StoryEngineAdapter.ts:~4934`, widerspricht G25),
  End-Report/Debrief **verpflichtend** statt einklappbar (`GameEndScreen.tsx:284`), **Gegenmaßnahmen** je Methode
  im End-Report („so wäre es gekontert worden", aus `counter`-Feldern).
- **Gate:** tsc/vitest/build. **Done:** Feinheiten entdeckbar, Debrief verpflichtend, kein Heldenpathos.

---

## Asset-/Budget-Übersicht (vorab ankündigen)
| Phase | Assets | Hinweis |
|---|---|---|
| P6 | TV-Berichterstattung (Schlagzeile/Person/Talkshow/Breaking), Newsroom-Raum, Umfrage-Grafiken | größtes Paket; staffeln, erst Platzhalter |
| P7 | Plakate, Kaffeeküche, Reißwolf, Automat, Props | klein, entdeckbar |
| P4/P5 | optional Episoden-/Auftrags-Vignettenbilder | optional, später |
Regel: Dry-Run zuerst; `--live` nur mit Kostenschätzung; Vision-QC je Bild.

## Empfohlener Einstieg für die frische Session
1. Konzept-Doc lesen (§4/§9/§10/§14). 2. **P0** bauen (Migration+Validator) — macht alles Weitere sicher.
3. **P1** (Werte sichtbar, Balance identisch) — der erste sichtbare Fortschritt mit Netz.
Dann strikt der Reihenfolge folgen; nach jeder Balance-berührenden Phase **Sim-Beleg** anhängen.

## Definition of Done (Gesamtpaket)
Spielbar mit ≥3 Aufträgen (Keil/Wahl/Zweifel), mehrdimensionalem Zustand (4 sichtbar), neuen Phänomenen,
Episoden (großer Batch) über das Korkbrett, lebendigem Broadcast/Newsroom/Fokusgruppe, Umgebungshumor —
**gewinn- UND verlierbar je Auftrag, per Simulation belegt**, Debrift benennt reale Methoden + Gegenmittel.
