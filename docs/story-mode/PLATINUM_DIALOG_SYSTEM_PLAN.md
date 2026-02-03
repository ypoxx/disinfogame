# Platinum Dialog System – Implementierungsplan (Story Mode)

> Ziel: Das Dialog-System auf **Platin-Niveau** bringen: maximal variantenreich, sprachlich fein, immersiv, spielnah, konsistent und technisch robust.
> Dieser Plan ist bewusst **agentenfreundlich** (Codex/Claude Code/ähnliche) geschrieben: klar strukturiert, kleinschrittig, kommentiert und mit eindeutigen Aufgabenpaketen.

---

## 0) Leitprinzipien (für alle Umsetzungsschritte)

**P0. Spielerentscheidungen sichtbar machen**
- Dialoge sind **Mechanik**, nicht Dekoration. Jede relevante Aussage muss Spielzustand widerspiegeln.

**P1. Kontext schlägt Zufall**
- RNG nur **innerhalb** vorgefilterter, kontextuell passender Varianten.

**P2. Wiederholbarkeit vermeiden**
- Variationen durch **Semantik-Schichten** (Kernbotschaft, Tonalität, Kontext-Inserts), nicht nur durch Satz-Varianten.

**P3. NPCs = personifizierte Systeme**
- Sprache muss die Systemlogik „menschlich“ vermitteln (Ressourcen, Risiko, Moral, Aufmerksamkeit etc.).

**P4. Dialoge steuern Aktionen**
- Themenknoten können Aktionen **freischalten, blockieren oder umformen**.

**P5. Messbarkeit**
- Jede Änderung bekommt **einfache Metriken** (Varianz, Coverage, Trigger-Frequenz, Wiederholungsrate).

---

## 1) Architektur-Upgrade: Topics in `dialogues.json` migrieren

**Problem**
- Topics kommen aus `npcs.json` und sind statische Einzeiler → geringste Varianz und tiefe.

**Ziel**
- Topics als **Dialog-Typ** in `dialogues.json` führen (mit Conditions, Tonalität, Reaktions-Effects).

### 1.1 Datenmodell-Erweiterung

**Neue Struktur in `dialogues.json` (Beispiel-Layout):**
```json
"topics": {
  "budget": {
    "intro": [ ... ],
    "deep": [ ... ],
    "options": [ ... ]
  },
  "risks": { ... }
}
```

**Kommentar:**
- `intro` = erste Antwort auf Topic
- `deep` = wenn Spieler „nachfragt“ (Progressive Disclosure)
- `options` = Knoten mit Actions/Choices

### 1.1.1 Konkretes JSON-Schema (Minimalversion)

> **Ziel:** sofort lauffähige Struktur definieren, die mit dem bestehenden Loader kompatibel ist.

```json
{
  "topics": {
    "budget": {
      "intro": [
        {
          "id": "topic_budget_intro_1",
          "text_de": "Budget ist {budget_state}. Wir müssen priorisieren.",
          "text_en": "Budget is {budget_state}. We must prioritize.",
          "tone": "serious",
          "probability": 0.6,
          "condition": {
            "all": [
              { "var": "budget", "op": "<", "value": 3000 }
            ]
          },
          "phase_range": [1, 120],
          "triggered_by_tags": ["budget", "resource"],
          "responses": [
            {
              "id": "resp_budget_detail",
              "text_de": "Gib mir Details.",
              "text_en": "Give me details.",
              "effect": "neutral",
              "leads_to": "topic_budget_deep_1"
            }
          ]
        }
      ],
      "deep": [
        {
          "id": "topic_budget_deep_1",
          "text_de": "Mit {budget_value} können wir nur {budget_option_count} Optionen stemmen.",
          "text_en": "With {budget_value} we can afford only {budget_option_count} options.",
          "tone": "explanatory",
          "probability": 0.5,
          "condition": {
            "all": [
              { "var": "budget", "op": "<", "value": 3000 }
            ]
          },
          "phase_range": [1, 120]
        }
      ],
      "options": [
        {
          "id": "topic_budget_option_1",
          "text_de": "Sollen wir andere Bereiche kürzen?",
          "text_en": "Should we cut other areas?",
          "tone": "pragmatic",
          "responses": [
            {
              "id": "resp_unlock_budget_shift",
              "text_de": "Ja, verschiebe Mittel.",
              "text_en": "Yes, shift funds.",
              "effect": "unlock_action",
              "payload": { "actionId": "unlock_budget_shift" }
            }
          ]
        }
      ]
    }
  }
}
```

**Kommentar:**
- `effect` unterstützt neue Actions (siehe Abschnitt 5).
- `leads_to` verweist auf Deep-Knoten oder weitere Topic-Optionen.
- `condition` nutzt bestehende Engine-Conditions (siehe Abschnitt 4).

### 1.2 DialogLoader erweitern

**Aufgaben**
- Neue Methode `getTopicDialogue(npcId, topic, context)`
- Filter nach Conditions, Phase, Relationship, Morale, Risk etc.

**Kommentar:**
- Nutze bestehendes Condition-System → konsistent und testbar.

### 1.2.1 Konkrete API-Signaturen (Vorschlag)

```ts
getTopicDialogue(
  npcId: string,
  topicId: string,
  layer: 'intro' | 'deep' | 'options',
  context: {
    phase: number;
    risk: number;
    morale: number;
    relationshipLevel: number;
    tags?: string[];
    memoryTags?: string[];
  },
  rng?: () => number
): Dialogue | null
```

**Kommentar:**
- `layer` steuert Progressive Disclosure.
- `tags` und `memoryTags` erlauben semantische Auswahl.

### 1.3 StoryEngineAdapter anpassen

**Aufgaben**
- `getNPCDialogue(... type: 'topic' ...)` → DialogLoader statt `npcs.json`
- `getNPCTopics()` liefert nur die verfügbaren Topics aus `dialogues.json`

**Kommentar:**
- `npcs.json` kann Topics später entfernen (Phase 2), zunächst kompatibel halten.

### 1.4 Migrations-Strategie (Dual-Read + Fallback)

**Schritte**
1) **Dual-Read**: `getNPCDialogue(topic)` prüft zuerst `dialogues.json`, fallback auf `npcs.json`.
2) **Instrumentation**: Logge, welche Topics noch aus `npcs.json` kommen.
3) **Coverage-Goal**: 100% Topics im neuen System.
4) **Cleanup**: Entferne Topics aus `npcs.json`.

**Risiko-Minimierung**
- Feature-Flag `useNewTopics` über ENV oder Config.
- In Phase 1: Flag default `false` → Smoke-Test.
- In Phase 2: Flag default `true` → Rollout.

---

## 1.5 Backward Compatibility Checkliste

- [ ] `dialogues.json` validiert (Schema + Lint)
- [ ] Dual-Read aktiv
- [ ] Crash-Fallback: falls `dialogues.json` fehlt, nutze `npcs.json`
- [ ] Telemetrie: `%topic_legacy_fallback` = 0 vor Cleanup

---

## 2) Semantische Schichten (Core + Tone + Context)

**Ziel:** Wiederholung minimieren ohne semantischen Drift.

### 2.1 Kernbotschaften definieren

**Aufgaben**
- Pro Topic eine **Core-Message** (kanonische Aussage) definieren.
- Alle Varianten referenzieren diese Core-Message (z. B. über `core_id`).

### 2.2 Tonalitäts-Layer

**Aufgaben**
- Pro NPC Tonalitäts-Varianten (`formal`, `skeptisch`, `aggressiv`, `warm`).
- Auswahl basierend auf NPC-Mood + Relationship.

### 2.3 Kontext-Inserts

**Aufgaben**
- Platzhalter-Engine einführen (z. B. `{budget_state}`, `{risk_level}`), die aus GameState befüllt werden.

**Kommentar:**
- Mit Inserts bleibt der Satzbau stabil, aber Kontext variiert.

---

## 3) Progressive Disclosure (Dialogtiefe auf Nachfrage)

**Ziel:** 2–3 Unterknoten reichen als Oberfläche, Tiefe kommt bei Nachfrage.

### 3.1 Neue Choice-Mechanik

**Aufgaben**
- Nach `intro` automatisch zusätzliche Choice „Mehr Details?“ anbieten.
- `deep` Knoten liefern detailliertere Infos oder Optionen.

### 3.2 Reduzierte Autor:innenlast

**Kommentar:**
- Nicht jedes Topic braucht 6 Unterknoten.
- Stattdessen: 2–3 sichtbare Knoten, 1–2 „Deep“ Knoten.

---

## 4) Condition-First Selektion (Kontext > RNG)

**Ziel:** Dialoge fühlen sich „intelligent“ an.

### 4.0 Condition Language (Syntax + Evaluator)

**Ziel:** Missverständnisse vermeiden – Conditions müssen formalisiert sein.

**Vorschlag (leichtgewichtig, JSON-kompatibel):**
```json
{
  "all": [
    { "var": "budget", "op": "<", "value": 3000 },
    { "var": "risk", "op": ">=", "value": 70 },
    { "var": "phase", "op": "inRange", "value": [20, 80] }
  ],
  "any": [
    { "var": "relationshipLevel", "op": ">=", "value": 2 },
    { "var": "memoryTags", "op": "contains", "value": "ignored_advice" }
  ]
}
```

**Operatoren (Minimalset)**
- Zahlen: `<`, `<=`, `>`, `>=`, `==`, `!=`
- Arrays/Tags: `contains`, `notContains`, `in`
- Ranges: `inRange` (z. B. `phase`)

**Evaluator-Regeln**
- `all` = alle Bedingungen wahr
- `any` = mindestens eine Bedingung wahr
- fehlt `all/any` → einzelne Condition wird direkt evaluiert
- fehlt `condition` → Dialog gilt immer

**Fallback-Policy**
- Wenn Evaluator Fehler wirft → `condition=false` und logge `condition_eval_error`
- Wenn Variable unbekannt → `condition=false`

### 4.1 Condition-Pipeline

**Ablauf**
1) Filter nach Phase
2) Filter nach Risk/Morale/Relationship
3) Tag-Filter (Topic-/Event-Tags)
4) RNG nur innerhalb verbleibender Optionen

### 4.2 „Harsh Overrides“

**Beispiel**
- Risk ≥ 80 → nur paranoide Varianten
- Morale ≤ 30 → nur kritische Varianten

### 4.3 Condition-Katalog (Minimalset)

**Vorschlag**
- `budget_low` → budget < 3000
- `budget_high` → budget > 8000
- `risk_high` → risk >= 70
- `morale_low` → morale <= 30
- `relationship_high` → relationshipLevel >= 2

**Kommentar:**
- Diese Conditions müssen im Condition-Evaluator unterstützt werden.

---

## 4.4 Conversation State Machine (Topic-Routing)

**Ziel:** Klar definieren, wie `intro → deep → options` sequenziert wird.

**Minimaler State-Graph**
```
topic_select
  → intro (1x)
    → (optional) deep (0–2x)
      → options (0–n)
        → action_execute | back_to_topic_select
```

**Routing-Regeln**
- `intro` wird **immer** zuerst gezeigt (wenn verfügbar).
- `deep` wird nur angezeigt, wenn Spieler „Mehr Details“ wählt.
- `options` erscheinen nach `deep` oder direkt nach `intro`, wenn kein `deep` verfügbar ist.
- `leads_to` kann explizit einen Dialog-Knoten bestimmen; ansonsten gilt der Standard-Flow.

**State-Persistenz (Session)**
- `current_topic_id`, `last_dialogue_id`, `dialogue_history[]`
- `deep_remaining` (z. B. max 2 Nachfragen)

---

## 5) Action-Coupling (Dialoge steuern Aktionen)

**Ziel:** Dialoge als Mechanik, nicht nur Feedback.

### 5.1 DialogResponse Effects erweitern

**Neue Effekte**
- `unlock_action`
- `lock_action`
- `modify_action_cost`

### 5.1.1 Konkretes Response-Format

```json
{
  "id": "resp_unlock_budget_shift",
  "text_de": "Mittel verschieben.",
  "text_en": "Shift funds.",
  "effect": "unlock_action",
  "payload": {
    "actionId": "ta_budget_shift",
    "duration_phases": 3
  }
}
```

**Kommentar:**
- `payload` ermöglicht erweiterbare Actions.
- `duration_phases` steuert temporäre Freischaltung.

### 5.2 UI-Integration

**Aufgaben**
- Dialog zeigt, welche Actions freigeschaltet/gesperrt werden.

### 5.2.1 UI Flow (konkret)

1) Dialog Response ausgewählt
2) UI zeigt Badge: „Aktion freigeschaltet: X“
3) Action Panel aktualisiert sich
4) Im Action Tooltip: „freigeschaltet durch NPC-Dialog“

---

## 6) Konflikt-Dialoge zwischen NPCs

**Ziel:** NPCs zeigen Konflikte als System-Widersprüche.

### 6.1 Konfliktmatrix

**Beispiele**
- Marina (Reichweite) vs Alexei (Security)
- Igor (Budget) vs Katja (Feld)

### 6.2 Multi-Speaker Dialoge

**Aufgaben**
- `dialogue_type: 'debate'`
- UI unterstützt Wechsel zwischen 2 NPCs in einem Dialog.

### 6.2.1 Datenformat für Debate

```json
{
  "id": "debate_risk_vs_reach_1",
  "dialogue_type": "debate",
  "participants": ["alexei", "marina"],
  "turns": [
    { "speaker": "alexei", "text_de": "Das ist zu riskant." },
    { "speaker": "marina", "text_de": "Aber die Reichweite ist unschlagbar." }
  ],
  "resolution": {
    "choices": [
      { "id": "choose_safe", "text_de": "Sicherheit priorisieren", "effect": "lock_action", "payload": { "actionId": "ta_high_risk" } },
      { "id": "choose_reach", "text_de": "Reichweite priorisieren", "effect": "unlock_action", "payload": { "actionId": "ta_high_reach" } }
    ]
  }
}
```

---

## 7) Episodische Erinnerung (Emotional Memory)

**Ziel:** NPCs erinnern sich an wiederholte Entscheidungen.

### 7.1 Memory-Store

**Aufgaben**
- Tracke letzte 3 „verletzende“ Entscheidungen pro NPC
- Speichere als `memory_tags`

### 7.2 Memory-Influence

**Regel**
- Wenn `memory_tags` vorhanden → Dialoge erhalten zusätzliche Tonalität

### 7.3 Memory-Scoring

**Beispiel-Regeln**
- Jede „ignored recommendation“ → `memory_tag: ignored_advice`
- Jede „budget cut“ → `memory_tag: resource_cut`
- Nach 3x `ignored_advice` → NPC-Dialoge werden strenger (tone override)

---

## 8) Phase-Rhythmus & Narrative Escalation

**Ziel:** Sprachrhythmus folgt Story-Phase.

### 8.1 Phase Styles

**Regel**
- Early: erklärend
- Mid: strategisch
- Late: druckvoll/knapp

### 8.2 Loader-Regeln

**Aufgaben**
- Pro Phase eigene Varianten priorisieren

---

## 9) Systemische Inserts (GameState → Sprache)

**Ziel:** Dialog = Feedback zu Mechanik.

### 9.1 Insert-Library

**Beispiele**
- `{budget_state}` → „Budget kritisch / stabil / stark“
- `{attention_state}` → „Pressebeobachtung steigt“

### 9.2 Localized Inserts

**Aufgaben**
- DE/EN Varianten

### 9.3 Insert-Library Schema (konkret)

**Beispiel: `insert_library.json`**
```json
{
  "budget_state": {
    "default": {
      "text_de": "Budget stabil",
      "text_en": "Budget stable"
    },
    "budget_low": {
      "text_de": "Budget kritisch",
      "text_en": "Budget critical"
    },
    "budget_high": {
      "text_de": "Budget komfortabel",
      "text_en": "Budget comfortable"
    }
  },
  "attention_state": {
    "attention_high": {
      "text_de": "Öffentliche Aufmerksamkeit ist hoch",
      "text_en": "Public attention is high"
    }
  }
}
```

**Resolver-Regeln**
- `insert_key` + `condition_tag` → spezifischer Eintrag
- Fallback auf `default`
- Fehlende Inserts → logge `insert_missing`

### 9.4 Insert-Governance & Validation

**Ziel:** Keine stillen Lücken oder Inkonsistenzen.

**Lint-Regeln**
- Jede Insert-Key muss mindestens `default` enthalten.
- Für jedes Insert-Key müssen alle `text_*` Sprachen vorhanden sein.
- Unbenutzte Inserts → Warnung (nicht Fail), damit Entfernen planbar bleibt.

**Runtime-Fallback**
- Falls `default` fehlt → ersetze Insert mit `<?>` und logge `insert_missing_default`.

---

## 10) Variations-Engine & Anti-Repetition

**Ziel:** Wiederholung minimieren, ohne Logikverlust.

### 10.1 Weighted Cooldown

**Aufgaben**
- Logge letzte 5 Dialog-IDs
- verhindere Wiederholung im kurzen Zeitfenster

### 10.2 Stochastic Rotation

**Regel**
- Weighted RNG mit „penalty“ bei zuletzt genutzten Varianten

### 10.3 Konkrete Wiederholungsmetrik

**Definition**
- `repetition_rate = repeated_dialogues / total_dialogues`
- „Repeated“ = gleiche `dialogue_id` innerhalb letzter 5 Turns

**Ziel**
- `repetition_rate < 10%` bei 5 Sessions

---

## 11) Ton- und Stilbibliothek

**Ziel:** Sprachliche Feinheit, konsistente Stimme.

### 11.1 Voice Templates

**Aufgaben**
- Pro NPC: 10–15 Stilbausteine (begrüßen, warnen, zweifeln, motivieren)

### 11.2 Stylistic Guards

**Kommentar**
- Verhindert, dass NPCs sprachlich „fremd“ wirken.

---

## 12) UI-Unterstützung & Lesbarkeit

**Ziel:** Dialoge als Feedback-System sichtbar machen.

### 12.1 Tooltip-Integration

**Aufgaben**
- Kontexttags im Dialog als kleine Info-Badges

### 12.2 Logbuch / Dialog-History

**Aufgaben**
- Spiel kann vergangene Dialoge wieder anzeigen (inkl. Kontext)

### 12.3 UI Edge Cases

**Beispiele**
- Kein Topic verfügbar → UI zeigt „Keine Themen verfügbar“
- Debate-Dialog abbrechen → fallback auf normale NPC-Ansicht

### 12.4 UI-Reducer-Definition (konkret)

**Ziel:** deterministische UI-Transitions für Agenten & Implementierung.

**State (Minimal)**
```ts
type DialogueUIState = {
  phase: number;
  npcId?: string;
  topicId?: string;
  layer?: 'intro' | 'deep' | 'options';
  dialogueId?: string;
  history: string[];
  deepRemaining: number;
  pendingActionId?: string;
};
```

**Events → State-Transition (Auszug)**
| Event | Guard | Next State |
| --- | --- | --- |
| `TOPIC_SELECTED(topicId)` | topicId exists | set `topicId`, `layer='intro'`, `deepRemaining=2` |
| `DIALOGUE_SHOWN(dialogueId)` | dialogueId exists | set `dialogueId`, append history |
| `REQUEST_DETAILS` | `deepRemaining>0` | set `layer='deep'`, `deepRemaining--` |
| `SHOW_OPTIONS` | intro/deep done | set `layer='options'` |
| `RESPONSE_SELECTED(actionId)` | actionId exists | set `pendingActionId` |
| `ACTION_EXECUTED` | pendingActionId | clear `pendingActionId`, return to topic select |

**Error-Handling**
- Missing `topicId` on `REQUEST_DETAILS` → ignore + log `ui_state_error`.
- Missing `dialogueId` on `DIALOGUE_SHOWN` → no-op + log.

---

## 13) Datenpflege & Authoring Tooling

**Ziel:** Autorenfreundlichkeit & Skalierung.

### 13.1 JSON Schema + Lint

**Aufgaben**
- JSON Schema für `dialogues.json`
- Lint-Script für fehlende Felder / ungültige Conditions

### 13.2 Writer-Friendly DSL

**Optional**
- YAML → JSON Build

### 13.3 Migration Tooling

**Aufgaben**
- Script: `migrate_topics_from_npcs.ts`
- Exportiert Topics aus `npcs.json` in neues `dialogues.json` Format
- Generiert Report „Missing Fields“

---

## 14) Test-Strategie (automatisierbar)

**Ziel:** Dialogsystem robust halten.

### 14.1 Coverage-Metriken

**Metriken**
- % Topics mit mind. 3 Varianten
- % Dialoge mit Conditions
- Wiederholungsrate pro Session

### 14.2 Playtest Scripts

**Aufgaben**
- Simuliere 100 Sessions, logge Wiederholungen

### 14.3 Golden Tests (Dialog-Auswahl)

**Beispiel**
- Für `risk_high` soll `paranoid`-Variante gewählt werden
- Für `relationship_high` sollen freundliche Varianten priorisiert werden

---

## 15) Deliverables & Reihenfolge (empfohlen)

1) Topics → `dialogues.json` migrieren
2) DialogLoader erweitern
3) Condition-First Auswahl
4) Kontext-Inserts
5) Anti-Repetition Engine
6) Progressive Disclosure
7) Action-Coupling
8) Konflikt-Dialoge
9) Emotional Memory
10) Tooling & Lint

### 15.1 Rollout Plan (konkret)

**Phase 1 (Feature Flagged)**
- Dual-Read + Logging
- UI zeigt optional neues Topic-System

**Phase 2 (Default On)**
- Legacy Topics entfernt
- Telemetrie auf 0 Fallbacks

**Phase 3 (Polish)**
- Variations-Engine + Memory

---

## 16) Beispiel – Agentenfreundliche TODO-Liste (per Phase)

### Phase A – Datenmigration
- [ ] Topics in `dialogues.json` übertragen
- [ ] `npcs.json` Topics optional deaktivieren

### Phase B – Engine & Loader
- [ ] `DialogLoader.getTopicDialogue()` implementieren
- [ ] `StoryEngineAdapter.getNPCDialogue()` Topic-Branch anpassen

### Phase C – Kontext & Variation
- [ ] Inserts & Condition-Pipeline
- [ ] Anti-Repetition

### Phase D – Narrative Features
- [ ] Progressive Disclosure
- [ ] Konflikt-Dialoge
- [ ] Emotional Memory

---

## 17) Erfolgskriterien (Platin-Level)

**Qualitativ**
- Spieler fühlt: „NPCs denken mit“
- Dialoge spiegeln Risiko, Moral, Ressourcen
- Konflikte zwischen NPCs erzeugen Spannung

**Quantitativ**
- < 10% Wiederholung in 5 Sessions
- 90%+ Topics mit 3+ Varianten
- 100% kritische Events → NPC Dialog

### 17.1 Operational Monitoring

**Dashboards**
- `dialogue_repetition_rate`
- `topic_coverage_ratio`
- `legacy_topic_fallback_rate`

---

## 18) Localization Pipeline (State-of-the-Art)

**Ziel:** Lokalisierung ist First-Class, nicht „nachträglich“.

### 18.1 Struktur
- Alle Dialoge enthalten `text_de` + `text_en`
- Lint prüft **100% Coverage** (keine fehlenden Keys)

### 18.2 Workflow
1) Authoring (DE als Source-of-Truth oder EN, konsistent pro Team)
2) Extraction (`dialogues.json` → `localization_export.csv`)
3) Übersetzung + Review
4) Import (`localization_import.csv` → `dialogues.json`)

### 18.3 L10n-Checks
- Fehlende Sprachvarianten = CI-Fail
- Begrenzung von Platzhaltern (z. B. `{budget_state}`) in beiden Sprachen

---

## 19) Performance & Caching

**Ziel:** Dialogwahl bleibt günstig bei hoher Varianz und vielen Conditions.

### 19.1 Cache-Strategie
- Cache Key: `{npcId}:{topicId}:{layer}:{phase}:{riskBucket}:{moraleBucket}`
- Cache TTL: 1 Phase
- Invalidierung bei wichtigen State-Änderungen (Risk/Morale Jump)

### 19.2 Bucketing
- `riskBucket = floor(risk / 10)`
- `moraleBucket = floor(morale / 10)`

---

## 20) Narrative Coherence & Balance Regeln

**Ziel:** State-of-the-Art Konsistenz über Sessions.

### 20.1 Coherence-Regeln
- `tone_override` darf nur 1x pro 3 Dialoge auftreten
- `memory_tags` müssen in den nächsten 2 Dialogen reflektiert werden

### 20.2 Density-Regeln
- Pro Phase mindestens 1 Event-Reaktion
- Maximal 3 Ambient-Dialoge ohne Event/Topic

### 20.3 Balancing-Heuristiken
- Späte Phase → ≥ 60% Dialoge „druckvoll/knapp“
- Frühphase → ≥ 60% „erklärend/strategisch“

---

## 21) Telemetrie, Observability & Debugging

**Ziel:** Schnelle Diagnose von Dialogfehlern, Varianz-Engpässen und Coverage-Lücken.

### 21.1 Telemetrie-Events (Minimum)
- `dialogue_selected` (npcId, topicId, dialogueId, layer, phase)
- `dialogue_fallback` (reason: `legacy_topic` | `condition_miss` | `insert_missing`)
- `condition_eval_error` (conditionId, varName, op)
- `insert_missing` (insertKey, npcId, topicId)

### 21.2 Debug-Overlay (dev-only)
- Zeigt: angewendete Conditions, gefilterte Kandidaten, RNG-Wahl
- Toggle pro NPC-Dialog (hotkey)

### 21.3 Sampling & Privacy
- Sampling 10–20% in Produktion
- Keine Rohtexte, nur IDs/Tags loggen

---

## 22) Daten-Governance & Review Workflow

**Ziel:** Konsistenz, Qualität und Stiltreue im großen Dialog-Set.

### 22.1 Review-Checkliste
- Tone passt zum NPC (`dialogue_style`)
- Conditions korrekt und minimal
- Inserts vorhanden (DE/EN)
- Action-Coupling korrekt referenziert

### 22.2 Ownership
- Pro NPC ein „Owner“ (Design/Writer)
- Änderungen nur via PR + Review

### 22.3 Lint-Policy (CI)
- Fehlende `text_en`/`text_de` → Fail
- Unknown `effect`/`payload` → Fail
- Ungültige `condition` → Fail

---

## 23) Failure Modes & Fallbacks

**Ziel:** Dialogsystem darf nicht in „leeren Zustand“ kippen.

### 23.1 Fallback Hierarchie
1) `dialogues.json` (Condition-match)
2) `dialogues.json` (unconditional)
3) `npcs.json` (legacy)
4) Hardcoded „Fallback-Line“ (letzte Rettung)

### 23.2 Soft-Fail Regeln
- Wenn `options` leer → UI zeigt nur `intro`
- Wenn `deep` leer → skip zu `options`

### 23.3 Hard-Fail Guards
- Nie `null` zurückgeben, außer explizit erlaubt (z. B. kein Topic verfügbar)

---

## 24) Authoring-Heuristiken (Bestmögliche Qualität)

**Ziel:** Maximale Varianz ohne semantische Drift.

### 24.1 Pro Topic (Minimum)
- 3 `intro` Varianten
- 2 `deep` Varianten
- 2 `options` (mit Action Coupling)

### 24.2 Variation-Regeln
- Keine zwei Varianten mit identischem Satzbau
- Mindestens 1 Variante mit „emotionale Reibung“ (skeptisch/kritisch)

### 24.3 Beispiel-Check (manuell)
- Spielt 3x denselben Topic → keine Wiederholung in 5 Turns

---

## 25) Risiko- & Änderungsmanagement

**Ziel:** Stabilität während Rollout.

### 25.1 Feature Flags
- `useNewTopics` (Topics)
- `useInsertLibrary` (Inserts)
- `useDebateDialogues` (Multi-Speaker)

### 25.2 Rollback
- Jeder Flag kann einzeln deaktiviert werden
- Legacy-Topics bleiben bis Coverage 100%

---

## 26) Referenz-Implementations-Skizze (Pseudo)

**Ziel:** Klarheit für Coding Agents.

```ts
function selectTopicDialogue(npcId, topicId, layer, context) {
  const candidates = loader.getTopicCandidates(npcId, topicId, layer);
  const conditioned = applyConditions(candidates, context);
  const filtered = applyCooldown(conditioned, history);
  const picked = weightedPick(filtered, rng);
  return picked ?? fallback(npcId, topicId);
}
```

**Kommentar:**
- Reihenfolge ist verbindlich: Conditions → Cooldown → RNG → Fallback

---

## 27) Gesamtschema (Single Source of Truth)

**Ziel:** Ein eindeutiges, validierbares JSON-Schema für alle Dialogtypen.

### 27.1 Schema-Versionierung
- `dialogues.schemaVersion` (SemVer, z. B. `1.0.0`)
- Jede Breaking-Änderung → Major bump + Migrationsskript

### 27.2 Vereinheitlichte Struktur (Outline)
```json
{
  "schemaVersion": "1.0.0",
  "meta": {
    "locales": ["de", "en"],
    "insertLibrary": "insert_library.json"
  },
  "topics": { /* topicId → { intro[], deep[], options[] } */ },
  "greetings": { /* npcId → [] */ },
  "briefings": { /* npcId → [] */ },
  "reactions": { /* npcId → [] */ },
  "crisis": { /* npcId → [] */ },
  "ambient": { /* npcId → [] */ },
  "debates": { /* debateId → debate */ }
}
```

### 27.3 Einheitliche Dialog-Objektfelder (Minimal)
```json
{
  "id": "string",
  "text_de": "string",
  "text_en": "string",
  "tone": "string",
  "probability": 0.0,
  "phase_range": [1, 120],
  "condition": { "all": [] },
  "triggered_by_tags": ["string"],
  "responses": []
}
```

### 27.4 Vollständiges JSON-Schema (kanonisch)

**Ziel:** Ein echtes, validierbares Schema als Single Source of Truth.

**Vorgabe**
- Canonical file: `docs/story-mode/schema/dialogues.schema.json`
- Schema Draft: `2020-12`
- `additionalProperties: false` für alle Dialog-Objekte

**Minimaler Schema-Stub (Aufbauvorgabe)**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "dialogues.schema.json",
  "type": "object",
  "required": ["schemaVersion", "meta", "topics"],
  "properties": {
    "schemaVersion": { "type": "string" },
    "meta": {
      "type": "object",
      "required": ["locales", "insertLibrary"],
      "properties": {
        "locales": { "type": "array", "items": { "type": "string" } },
        "insertLibrary": { "type": "string" }
      },
      "additionalProperties": false
    },
    "topics": { "$ref": "#/$defs/topics" },
    "greetings": { "$ref": "#/$defs/npcDialogList" },
    "briefings": { "$ref": "#/$defs/npcDialogList" },
    "reactions": { "$ref": "#/$defs/npcDialogList" },
    "crisis": { "$ref": "#/$defs/npcDialogList" },
    "ambient": { "$ref": "#/$defs/npcDialogList" },
    "debates": { "$ref": "#/$defs/debates" }
  },
  "$defs": {
    "npcDialogList": {
      "type": "object",
      "additionalProperties": { "$ref": "#/$defs/dialogueList" }
    },
    "dialogueList": {
      "type": "array",
      "items": { "$ref": "#/$defs/dialogue" }
    },
    "topics": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "required": ["intro"],
        "properties": {
          "intro": { "$ref": "#/$defs/dialogueList" },
          "deep": { "$ref": "#/$defs/dialogueList" },
          "options": { "$ref": "#/$defs/dialogueList" }
        },
        "additionalProperties": false
      }
    },
    "dialogue": {
      "type": "object",
      "required": ["id", "text_de", "text_en"],
      "properties": {
        "id": { "type": "string" },
        "text_de": { "type": "string" },
        "text_en": { "type": "string" },
        "tone": { "type": "string" },
        "probability": { "type": "number", "minimum": 0, "maximum": 1 },
        "phase_range": {
          "type": "array",
          "items": { "type": "integer" },
          "minItems": 2,
          "maxItems": 2
        },
        "condition": { "$ref": "#/$defs/condition" },
        "triggered_by_tags": {
          "type": "array",
          "items": { "type": "string" }
        },
        "responses": { "$ref": "#/$defs/responseList" }
      },
      "additionalProperties": false
    },
    "responseList": {
      "type": "array",
      "items": { "$ref": "#/$defs/response" }
    },
    "response": {
      "type": "object",
      "required": ["id", "text_de", "text_en", "effect"],
      "properties": {
        "id": { "type": "string" },
        "text_de": { "type": "string" },
        "text_en": { "type": "string" },
        "effect": { "type": "string" },
        "payload": { "type": "object" },
        "leads_to": { "type": "string" }
      },
      "additionalProperties": false
    },
    "condition": {
      "type": "object",
      "properties": {
        "all": {
          "type": "array",
          "items": { "$ref": "#/$defs/conditionClause" }
        },
        "any": {
          "type": "array",
          "items": { "$ref": "#/$defs/conditionClause" }
        }
      },
      "additionalProperties": false
    },
    "conditionClause": {
      "type": "object",
      "required": ["var", "op", "value"],
      "properties": {
        "var": { "type": "string" },
        "op": { "type": "string" },
        "value": {}
      },
      "additionalProperties": false
    },
    "debates": {
      "type": "object",
      "additionalProperties": { "$ref": "#/$defs/debate" }
    },
    "debate": {
      "type": "object",
      "required": ["id", "dialogue_type", "participants", "turns"],
      "properties": {
        "id": { "type": "string" },
        "dialogue_type": { "const": "debate" },
        "participants": {
          "type": "array",
          "items": { "type": "string" }
        },
        "turns": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["speaker", "text_de"],
            "properties": {
              "speaker": { "type": "string" },
              "text_de": { "type": "string" },
              "text_en": { "type": "string" }
            },
            "additionalProperties": false
          }
        },
        "resolution": {
          "type": "object",
          "properties": {
            "choices": { "$ref": "#/$defs/responseList" }
          },
          "additionalProperties": false
        }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

**Kommentar**
- Das Schema ist das **bindende** Interface zwischen Authoring, Build und Runtime.
- Alle Beispiele müssen sich an dieses Schema halten.

---

## 28) Condition-Authoring-Konventionen

**Ziel:** Einheitliche Authoring-Regel – keine gemischten Paradigmen.

### 28.1 Regel
- **Nur JSON-Conditions** im Datenbestand
- Tokens wie `budget_low` sind **nur Aliase** im Authoring-Tool und werden beim Build in JSON-Conditions übersetzt

### 28.2 Beispiel-Mapping (Build-Time)
```
budget_low  → { "var": "budget", "op": "<", "value": 3000 }
risk_high   → { "var": "risk", "op": ">=", "value": 70 }
```

### 28.3 Condition-Alias Governance

**Regeln**
- Alias-Liste lebt in `docs/story-mode/schema/condition_aliases.json`.
- Jede Alias-Änderung benötigt: Schema-Bump **oder** Migrations-Note.
- Aliases dürfen **niemals** runtime-evaluiert werden (nur Build-Time).

---

## 29) Migrations-CLI Spezifikation

**Ziel:** deterministische Migration, reproduzierbare Reports.

### 29.1 CLI-Interface
```
node migrate_topics_from_npcs.ts \
  --input data/npcs.json \
  --dialogues data/dialogues.json \
  --out data/dialogues.migrated.json \
  --report reports/topics_migration.json \
  --strict
```

### 29.2 Report-Format (JSON)
```json
{
  "migratedTopics": 14,
  "missingFields": [
    { "npcId": "igor", "topicId": "budget", "missing": ["text_en"] }
  ],
  "warnings": ["duplicate_topic_id"]
}
```

---

## 30) UI State Spec (Dialog Flow)

**Ziel:** UI-Flow eindeutig und testbar.

### 30.1 UI-State (Minimal)
```ts
type DialogUIState = {
  npcId: string;
  topicId?: string;
  layer: 'intro' | 'deep' | 'options';
  currentDialogueId?: string;
  history: string[];
  options: DialogueResponse[];
};
```

### 30.2 Events
- `SELECT_TOPIC(topicId)`
- `REQUEST_DETAILS()` → layer = `deep`
- `SELECT_RESPONSE(responseId)`
- `BACK_TO_TOPICS()`

---

## 31) Content-Budget & Kapazitätsplanung

**Ziel:** realistisches Produktionsvolumen.

### 31.1 Beispiel-Budget (MVP → Platinum)
- MVP: 8 Topics × 3 NPCs × (3 intro + 2 deep + 2 options) ≈ 168 Dialogeinträge
- Platinum: 12 Topics × 5 NPCs × (4 intro + 3 deep + 3 options) ≈ 600–700 Einträge

### 31.2 Authoring-Aufwand (grob)
- 25–40 Dialogeinträge pro Tag pro Writer (inkl. Review)

---

## 32) Test-Fixtures & Deterministische Seeds

**Ziel:** reproduzierbare Golden-Tests.

### 32.1 Test-Fixture (Beispiel)
```json
{
  "phase": 40,
  "risk": 75,
  "morale": 25,
  "relationshipLevel": 1,
  "tags": ["budget"],
  "memoryTags": ["ignored_advice"]
}
```

### 32.2 RNG-Seed
- Für Tests immer `seed=42` (oder feste RNG-Stub)

---

## 33) Authoring-UX & Preview Workflow

**Ziel:** Writer können Dialoge schnell testen.

### 33.1 Preview-Tool (Minimal)
- UI: NPC auswählen → Topic auswählen → Kontextwerte einstellen → Vorschau
- Button „Simulate 5x“ (Anti-Repetition sichtbar)

### 33.2 Inline-Lint
- Validierung direkt im Editor (fehlende `text_en`, ungültige Conditions)

---

## Abschluss

Dieser Plan stellt sicher, dass Dialoge **nicht nur Flavor**, sondern echte **Spielsteuerung** sind. Damit wird der Story Mode konsistent, immersiv und hoch variabel, ohne Autor:innenaufwand ins Unendliche zu treiben.
