# 🤝 Handoff: Etappe 4 „Impfung & Abstumpfung" — Kickoff für die nächste Session

**Stand:** 2026-07-04, Ende der Etappe-3-Session · **Basis:** `main` (PR #89 + PR #90 gemerged: Etappen 0–3 + Kuratieren-Paket)
**Lies zuerst:** `SOUL.md` → `STATUS.md` (Etappen 0–3 ✅) → `ZIELBILD_2026-07-04_WETTRENNEN.md` (§6/§7/§13)
→ dieses Dokument (konkreter Arbeitsplan). Gate: `tsc 0 · vitest 533 · build` — alles grün.
**Container-Falle zuerst:** `cd desinformation-network && npm ci` (frischer Web-Container hat keine
node_modules bzw. falsche TS-Version; Lockfile pinnt TS 5.9.3).

---

## 1. Wo wir stehen (3 Sätze)

Das Wettrennen läuft: Sieg = Auftrag „Die Wahl" (Min-Regel, `VictorySystem`), 40-Tage-Kampagne,
und seit Etappe 3 lebt der zweite Läufer — die **ABWEHR** (`engine/ImmuneSystem.ts`, befördertes
`wehrhaftigkeit`, Stufen 25/50/75 mit Gegenmaßnahmen-Modal, Verlust „Das Land hält stand" bei 100;
Verrat = +15-Abwehr-Ereignis; Sperren/reach_reduction/Verrats-Folgen wirken). Das Sim-Gate
(`winnable-and-losable.test.ts`, 72 Partien) ist mit Bändern scharf: greedy ~29–50 % (Median ~42 %),
low_risk ~29–63 %, Immun-Verlustweg robust. **Bekannt offen:** Enttarnung als Verlustweg feuert im
Sim nur dünn (Carry-forward Etappe 5, Aktions-Kuratierung).

## 2. Ziel der Etappe (Zielbild §6/§7)

Das Immunsystem bekommt sein **Gedächtnis**: Abstumpfung je (Milieu × Maschen-Familie) und Impfung
durch Prebunking. Der Spieler sieht es NIE als Zahl, sondern als **FRISCH/BEKANNT/VERBRANNT-Stempel**
auf der Aktionskarte (VOR dem Ausgeben — man versenkt nie Ressourcen in Verpufftes, E7) und als
**Wohnzimmer-Alphabet** (feste Bildsprache: Küchen-Streit, Abwinken vor dem TV, Parteifahne im
Fenster, Faktencheck-Zeitung …). Jede Verpuffung nennt Ursache, Tag und Gegenmaßnahme (E5).

## 3. Vorhandene Andockpunkte (NICHT neu erfinden — alles existiert schon)

- **8 Milieus:** `data/audience.json` → `countries[0].segments` (`wu_optimiererin` … `wu_liberale`),
  Modell in `audience/audienceModel.ts`, Anzeige `useAudienceBroadcast`/`BroadcastBar`. Owner-
  Entscheidung E16: Publikum wirkt mechanisch zurück — Etappe 4 baut genau das.
- **18 Maschen-Familien:** `data/disinfo_methods.json` + `DisinfoMethodAtlas` (EIN Vokabular für
  Mechanik/Quittung/Endreport, Zielbild §7). Aktions→Familie-Zuordnung existiert:
  `ImmuneSystem.methodFamilyForTags` (Etappe 3); der Adapter zählt bereits Familien-Einsätze
  (`methodFamilyUseCounts`) und führt `patchedFamilies` („Gepatcht"-Events).
- **Impf-Einstieg:** Die Abwehr-Stufe 25 feuert die Prebunking-Kampagne (cm24) — in Etappe 3 als
  Institutionen-Vertrauens-Gewinn **approximiert**. Etappe 4 ersetzt das durch echte
  Familien-Immunität über die erreichten Milieus (Prebunking > Debunking, Zielbild §7).
- **Zerfalls-Vorbild:** `NarrativeMemory.ts` (Inokulation mit Verfall beim Lesen, pure) — dasselbe
  Muster für das Maschen-Gedächtnis verwenden (kein Tick nötig).
- **Wirkungs-Dämpfung:** `applyActionEffects` hat seit Etappe 3 einen Multiplikator-Pfad
  (`reachDampening`) — das Milieu-Gedächtnis dockt als weiterer Faktor an derselben Stelle an.
- **Karten-Vorschau:** `ActionImpactPreview`/`previewSocietyDeltas` (S0, PR #89) zeigt Wirkung am
  Entscheidungspunkt — der Stempel gehört in dieselbe Karten-Ansicht (`ActionPanel`).

## 4. Arbeitspakete (Agenten-Zuschnitt + Modell-Empfehlung)

| # | Paket | Inhalt | Modell |
|---|-------|--------|--------|
| A | **MaschenGedaechtnis-Modul** (Kern) | Neues `story-mode/engine/MaschenGedaechtnis.ts` (pur, Muster NarrativeMemory/ImmuneSystem): Matrix (8 Milieus × 18 Familien) mit Einsatz-Zählung je Ziel-Milieu, Wirkungs-Multiplikator **1,0 → 0,6 → 0,3** (FRISCH/BEKANNT/VERBRANNT), Antikörper-Zerfall beim Lesen (Ruhen lohnt — Familien rotieren wird echte Strategie), Impfung als eigener Kanal (Prebunking setzt Familien-Immunität je erreichtem Milieu, langsam zerfallend; reaktiver Faktencheck klein/schnell zerfallend). Save/Load im Adapter. **Sichtbar NUR über Stempel/Bilder — jede Zahlen-Sichtbarkeit der Matrix wäre eine E6-Verletzung (Jury-Auflage).** | stark (inherit) |
| B | **Engine-Integration + E5-Quittung** | Ziel-Milieus je Aktion bestimmen (aus Tags/`previewSocietyDeltas`-Logik bzw. Broadcast-Vektor), Multiplikator in `applyActionEffects` einstecken (neben `reachDampening`), Einsatz nach Ausführung fortschreiben. Verpuffungs-Quittung: „Wirkung: gering. Grund: Masche bekannt — Prebunking-Kampagne, Tag 9" (E5, kühl). „Gepatcht"-Events (Etappe 3) auf das neue Gedächtnis umziehen (Familie gilt dann als BEKANNT statt nur Abwehr-Sprung — EIN System, nicht zwei). | stark (inherit) |
| C | **Prebunking > Debunking** | cm24 (Stufe 25) impft statt Trust-Regen: große, langsam zerfallende Familien-Immunität über die erreichten Kanäle — medienferne Milieus werden kaum erreicht (der Spieler entdeckt selbst, wohin Aufklärung nicht durchdringt: Doppelboden). Reaktive Faktenchecker-AI-Actions geben kleine, schnelle Immunität nur fürs betroffene Milieu/Thema. KEIN Backfire-Malus (Jury-Warnung, E9). | sonnet |
| D | **UI: Stempel + Wohnzimmer-Alphabet** | FRISCH/BEKANNT/VERBRANNT-Stempel je Ziel-Milieu auf der Aktionskarte (`ActionPanel`, an der `● STRANG`/Impact-Preview-Stelle); Wohnzimmer-Alphabet: die 5 festen Bilder (Zielbild §6 Tabelle) an den Milieu-Zustand koppeln (`BroadcastBar`/Wohnzimmer) — wo Assets fehlen, erst CSS-/Text-Fallback, Asset-Batch (pixel-asset-pipeline, Budget-Ansage!) separat vorschlagen. Kühl, E8. | sonnet |
| E | **Balance + Gate** | Sim-Gate nach jeder Mechanik-Änderung; Bänder halten (greedy 29–50 %, low_risk kein sicherer Weg). Abstumpfung darf greedy nicht auf 0 % drücken (Rotation muss als Ausweg funktionieren — ggf. Sim-Strategie „rotierend" ergänzen und als vierte Referenz loggen). Enttarnungs-Anteil beobachten (Carry-forward-Notiz aktualisieren). | stark (inherit) |

**Orchestrierung:** A zuerst (B–D docken an). B zentral in der Hauptsession (Adapter-Monolith!
Etappe-3-Lehre: parallele Agenten NICHT gleichzeitig an `StoryEngineAdapter.ts`). C/D parallel
möglich (C = CountermeasureSystem/ActorAI-Seite, D = Komponenten; D ggf. als Worktree-Agent wie in
Etappe 3, danach zentral mergen). E zum Schluss iterativ. Review-Pass (read-only Explore-Agent,
adversarial) vor dem letzten Push. Jede Teillieferung: `tsc` + `vitest` + `build` grün, je Paket ein Commit.

## 5. Bekannte Fallen (aus Etappe 0–3 gelernt — Zeit sparen!)

1. **`npm ci` zuerst** (Toolchain-Drift im frischen Container, s. o.).
2. **Sim-Gate nach JEDER Mechanik-Änderung** (`npx vitest run src/story-mode/tests/winnable-and-losable.test.ts`,
   Log-Flut: `| grep -vE "DisInfo|Cost Reduction|discount ×"`). Für Band-Änderungen gilt die
   Etappe-3-Disziplin: Stichprobe ist 24 Partien/Strategie, Robustheit **8× flakefrei** belegen
   (ORCHESTRATION_FEEDBACK Lehre 8 — die Sim-Strategien sind bang-bang, Einzel-Läufe lügen).
3. **Gekoppelte Balance-Hebel getrennt lösen** (Lehre 9): Wenn `winnable-and-losable` und
   `balance-sim-p2` Gegensätzliches wollen, einen Hebel suchen, der nur EINE Seite berührt
   (Vorbild: `OP_FRAKTION_MOBILIZE`). Beide Gates IMMER zusammen messen.
4. **Keine doppelte Buchhaltung** (Lehre 10): Die Abstumpfungs-Dämpfung wirkt auf die WIRKUNG —
   sie darf nicht zusätzlich nochmal als Abwehr-/Risiko-Strafe gezählt werden. Prüfen, welcher
   Melder eine Kost schon trägt (`RISK_COST_TO_METER`-Prinzip).
5. **`createStoryEngine()` resettet ALLE Singletons** — Test-Mocks NACH Engine-Erzeugung setzen
   (Beispiel: `DecisionBeatFlow.test.tsx`).
6. **„Gepatcht" nicht doppeln:** Etappe 3 zählt Familien-Einsätze global (`methodFamilyUseCounts`,
   Patch alle 3 Einsätze → Abwehr +4). Etappe 4 verfeinert auf (Milieu × Familie) — die alte
   globale Zählung dabei ERSETZEN/umziehen, nicht parallel weiterlaufen lassen (sonst straft
   dieselbe Wiederholung zweimal).
7. **Save-Format:** neue Matrix → Feld additiv + Default-Merge; wenn Semantik bricht, Version
   bewusst bumpen (Muster 2.1.0-Migration: Marker-Feld prüfen, nicht nur Versions-String).
8. **Session-Ökonomie:** Agenten mit engen Briefings + Datei-Listen; Sonnet für UI/mechanische
   Pakete; Abschluss-Klausel („Antwort MUSS mit BERICHT: beginnen, keine eigenen
   Hintergrund-Agenten, Mess-Artefakt anhängen"). Worktree-Agenten brauchen eigenes `npm ci`.

## 6. Definition of Done (Etappe 4)

- Maschen-Gedächtnis (8×18) wirkt mechanisch: Wiederholung derselben Familie im selben Milieu
  verpufft sichtbar (1,0→0,6→0,3), Ruhen/Rotieren hilft; Prebunking impft Familien-Immunität
  über erreichte Milieus (> Debunking), medienferne Milieus bleiben Lücke.
- FRISCH/BEKANNT/VERBRANNT-Stempel auf den Karten VOR dem Ausgeben; Verpuffung erklärt Ursache/
  Tag/Gegenmaßnahme (E5); Wohnzimmer-Alphabet-Grundzustände sichtbar (mind. Abwinken + Faktencheck-
  Zeitung; volle Asset-Qualität darf als Budget-Vorschlag offen bleiben).
- Matrix NIE als Zahlen sichtbar (E6). Kein Backfire-Malus (E9).
- Sim-Gate grün mit gehaltenen Bändern (8× flakefrei bei Band-Änderungen); `balance-sim-p2` grün.
- `tsc 0 · vitest · build` grün; STATUS.md + Zielbild §13 (Etappe 4 ✅ + Carry-forwards)
  aktualisiert; Commit + Push + Draft-PR gegen `main`.

## 7. Kickoff-Prompt für die neue Session (Vorschlag)

> „Lies SOUL.md → STATUS.md → ZIELBILD_2026-07-04_WETTRENNEN.md → HANDOFF_2026-07-04_ETAPPE4.md
> und starte Etappe 4 nach dem dortigen Arbeitsplan (Pakete A–E, Orchestrierung wie empfohlen)."
