# Story Engine Refactor‑Roadmap (detailliert, risikominimiert)

> Ziel: Skalierbarkeit, schnellere Weiterentwicklung, minimale Regressionen.
> Fokus: StoryEngineAdapter und angrenzende Pipeline (Actions, Phase, NPC, News, AI, Consequences).
> Anspruch: Jede Phase ist durch Tests, Snapshots und Rollback‑Pfade abgesichert.

---

## 0) Vorbereitung & Sicherheitsnetz (keine Logikänderung)

### 0.0 Qualitäts‑Definition & Erfolgskriterien (verbindlich)
**Aktion:** Klare Qualitätskriterien definieren, an denen jede Phase gemessen wird.

**Beispiele (müssen erfüllt sein):**
- Alle Snapshot‑Tests grün (Minimal + Voll).
- Performance‑Baseline nicht schlechter als +5 % (Phase/Action).
- Keine Änderungen an Narrativen/News‑Outputs ohne explizite Freigabe.

**Risiken/Fehler:**
- Unklare Ziele → „Fertig“ ist unbestimmt.

**Absicherung:**
- Kriterien als Checkliste im Repo.

### 0.1 State‑Inventory (vollständig)
**Aktion:** Liste aller Zustände im Adapter erfassen (Resources, NPC‑State, News, Consequences, Cooldowns, AI‑State, Combos, Objectives, etc.).

**Risiken/Fehler:**
- Zustand vergessen → Regressionen nicht sichtbar.

**Absicherung:**
- Inventory als Checkliste im Repo.
- Snapshot‑Tests müssen alle Inventory‑Felder abdecken.

---

### 0.2 Deterministischer Test‑Harness (Golden Path)
**Aktion:** Fester Seed + fixe Action‑Sequenz (legal/grey/illegal, diverse Tags, risk/attention/moralWeight) über 3–5 Phasen.

**Risiken/Fehler:**
- Edge‑Cases nicht abgedeckt.

**Absicherung:**
- Mindestens 1 Aktion pro Kategorie + Tag‑Varianz.
- Aufnahme von Krisen/AI‑Triggern, falls möglich.

---

### 0.3 Snapshot‑Tests (zweistufig)
**Minimal‑Snapshot:** Ressourcen, NPC‑State, Objectives, Consequences, AI‑State, Combos.

**Voll‑Snapshot:** + News‑Feed, Crisis‑Events, World‑Events, Narrative‑Outputs.

**Risiken/Fehler:**
- Snapshots zu groß → schwer wartbar.

**Absicherung:**
- Zwei‑Stufen‑Ansatz, Minimal‑Snapshot ist Pflicht, Voll‑Snapshot nur für kritische Läufe.

---

### 0.4 Balance‑Konstanten extrahieren (noch keine Logikänderung)
**Aktion:** Risk/Attention‑Decay, Budget‑Regen etc. zentralisieren (Config).

**Risiken/Fehler:**
- Werte unabsichtlich verändert.

**Absicherung:**
- Unit‑Tests prüfen konkrete Werte aus Config.

---

### 0.5 Rollback‑Strategie vorbereiten
**Aktion:** Definiere pro Phase ein klares Rollback‑Paket (welche Dateien/Module rückgängig gemacht werden müssen).

**Risiken/Fehler:**
- Rückbau dauert zu lange → instabiler Branch blockiert Team.

**Absicherung:**
- Rollback‑Checkliste + Git‑Tags pro Phase.

---

## 1) Action‑Execution isolieren

### 1.1 ActionExecutor extrahieren (identisches Verhalten)
**Aktion:** `executeAction` auslagern, Reihenfolge beibehalten.

**Risiken/Fehler:**
- Reihenfolge ändert sich → News/Combos/Consequences ändern sich.
- Side‑Effects doppelt/fehlend.

**Absicherung:**
- Snapshot‑Regression muss 100 % identisch sein.
- Zusätzliche Unit‑Tests für Action‑Costs/Discounts.
- Vergleich der Anzahl erzeugter News‑Events (Action‑News).

---

### 1.2 Unit‑Tests: Action‑Kosten + NPC‑Discount
**Aktion:** Tests für Budget/Capacity/Risk/Attention inkl. NPC‑Morale‑Modifier.

**Risiken/Fehler:**
- Rabatt‑Formel verändert sich.

**Absicherung:**
- Fixierte NPC‑States im Test.

---

### 1.3 Action‑News‑Snapshot
**Aktion:** Tag‑basierte Headlines/Severity in Snapshot sichern.

**Risiken/Fehler:**
- Narrative weicht subtil ab.

**Absicherung:**
- Dedicated News‑Snapshot für `generateActionNews`.

---

## 2) Phase‑Pipeline isolieren

### 2.1 PhaseManager extrahieren
**Aktion:** `advancePhase` in `PhaseManager` verschieben.

**Risiken/Fehler:**
- Pipeline‑Reihenfolge bricht (NPC→World→AI).

**Absicherung:**
- Reihenfolge als Test‑Log fixieren.
- Snapshot‑Regression.
- Zusätzlich: Phase‑Diff‑Report (Vorher/Nachher‑State als strukturiertes Diff).

---

### 2.2 Unit‑Tests: Ressourcen‑Regen + Consequences
**Aktion:** Tests für Regeneration und Consequence‑Handling.

**Risiken/Fehler:**
- Balancing verschoben.

**Absicherung:**
- Wertevergleich mit Baseline.

---

## 3) NPC‑System kapseln

### 3.1 NPCManager einführen
**Aktion:** NPC‑State, Relationships, Morale, Dialogs, Reactions kapseln.

**Risiken/Fehler:**
- State‑Sync bricht.

**Absicherung:**
- NPCManager ist Single Source of Truth.
- Explizite Synchronisations‑API (kein direkter Zugriff auf Adapter‑State).

---

### 3.2 Tests: Betrayal/Morale/Relationship
**Aktion:** Fixed‑Action‑Set → erwartete Morale‑Deltas, Betrayal‑Warnings.

**Risiken/Fehler:**
- Trigger‑Schwellen ändern sich.

**Absicherung:**
- Unit‑Tests + Snapshot.

---

## 4) News & Narrative modularisieren

### 4.1 NewsGenerator / StoryNewsPipeline
**Aktion:** `generateActionNews`, `createPrimaryActionNews`, `createWorldReactionNews` auslagern.

**Risiken/Fehler:**
- Severity/Headlines ändern sich.

**Absicherung:**
- News‑Snapshot + Unit‑Tests für Tag‑Logik.
- Threshold‑Tests für risk/attention/moralWeight Trigger.

---

### 4.2 Narrative‑Generator stabilisieren
**Aktion:** Input‑Contract definieren, Outputs snapshotten.

**Risiken/Fehler:**
- Narrative‑Texte verändern sich ungewollt.

**Absicherung:**
- Narrative‑Snapshot (Headline + Description).
- Locale‑Checks (de/en müssen konsistent bleiben).

---

## 5) Side‑Effects abstrahieren

### 5.1 Sound/Logger Interfaces
**Aktion:** `playSound`/`storyLogger` injizierbar machen.

**Risiken/Fehler:**
- Side‑Effects fehlen oder doppelt.

**Absicherung:**
- Tests prüfen Sound‑Event‑Sequenz.
- Fake‑Logger prüfen Call‑Order.

---

## 6) Config‑ & Daten‑Layer entkoppeln

### 6.1 Balance‑Config zentralisieren
**Aktion:** Alle Balance‑Werte in eine Config-Datei.

**Risiken/Fehler:**
- Multiple Quellen → Inkonsistenz.

**Absicherung:**
- Unit‑Tests referenzieren Config direkt.
- Config‑Freeze: Änderungen nur über Review‑Checklist.

---

### 6.2 Daten‑Quellen injizierbar machen
**Aktion:** NPC/World‑Events JSON als Injected Data Source.

**Risiken/Fehler:**
- Statische Imports erschweren Tests.

**Absicherung:**
- Mock‑fähige Data‑Source Interfaces.
- Contract‑Tests (Schema‑Validierung für JSON).

---

## 7) Optional: Event‑Driven Architektur (erst bei stabiler Baseline)

### 7.1 Domain Events
**Aktion:** `ActionExecuted`, `PhaseAdvanced` etc.

**Risiken/Fehler:**
- Event‑Order weicht ab → Gameplay ändert sich.

**Absicherung:**
- Event‑Order Tests + Snapshot.
- Event‑Audit‑Log (für Debugging).

---

## 8) Abschluss‑Phase: Stabilität & Monitoring

### 8.1 Regression‑Matrix
**Aktion:** Jede Phase durchlaufen, Snapshot + Unit‑Tests müssen grün bleiben.

**Risiken/Fehler:**
- Späte Regressionen.

**Absicherung:**
- Pflicht: alle Tests grün vor Merge.

---

### 8.2 Performance/Profiling (optional)
**Aktion:** Hotspots (Phase/Action) messen.

**Risiken/Fehler:**
- Perf‑Regression durch Modularisierung.

**Absicherung:**
- Profiling‑Baseline vor/nach Refactor.

---

### 8.3 Observability & Runtime‑Guards
**Aktion:** Runtime‑Checks für kritische Invariants (z. B. Ressourcen nicht negativ, Risk/Attention 0–100).

**Risiken/Fehler:**
- Fehler erst spät sichtbar → schwerer zu debuggen.

**Absicherung:**
- Guard‑Layer in Debug‑Builds + Telemetrie‑Events bei Verstoß.

---

# Kritische Gesamtrevision (Multi‑Perspektive)

## Perspektive A — Gameplay & Balancing
**Kritik:** Inline‑Balance‑Fixes sind fragil.

**Korrektur:** Balance‑Config + Unit‑Tests ist Pflicht (Phase 0.4/6.1).

---

## Perspektive B — Narrative & UX‑Feedback
**Kritik:** News/Narrative‑Outputs können sich leicht unbemerkt ändern.

**Korrektur:** News‑ und Narrative‑Snapshots sind Pflicht (Phase 1.3/4.2).

---

## Perspektive C — Test‑Wartbarkeit
**Kritik:** Voll‑Snapshot wird zu schwer.

**Korrektur:** Minimal‑Snapshot als Hauptschutz, Voll‑Snapshot nur bei kritischen Runs (Phase 0.3).

---

## Perspektive E — Rollout/Deployment
**Kritik:** Refactor wird ohne Gate‑Strategie ausgerollt.

**Korrektur:** Feature‑Flags für neue Module + schrittweiser Rollout (Phase 0.5/8.3).

---

## Perspektive D — Team‑Skalierung
**Kritik:** Zu viele Module auf einmal.

**Korrektur:** Strikte Reihenfolge (Action → Phase → NPC → News → Side‑Effects → Config → Optional Events).

---

# Finaler, korrigierter Ablauf (Kurzfassung)
1. State‑Inventory + Baseline‑Snapshots
2. ActionExecutor extrahieren + Tests
3. PhaseManager extrahieren + Tests
4. NPCManager extrahieren + Tests
5. News/Narrative modularisieren + Tests
6. Side‑Effects abstrahieren + Tests
7. Config/Daten‑Layer entkoppeln + Tests
8. Optional: Domain‑Events
9. Abschluss‑Regression + Profiling
10. Observability + Rollout‑Gates

---

> Ergebnis: maximal abgesicherter Refactor mit klaren Verantwortlichkeiten, hoher Testbarkeit und langfristiger Skalierung.
