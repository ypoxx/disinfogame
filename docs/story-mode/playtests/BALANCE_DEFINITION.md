# Balance-Definition: Story Mode Simulation

**Version:** 1.0
**Erstellt:** 2026-01-14
**Ziel:** Definition einer gut ausbalancierten Simulation im Story-Modus

---

## 1. Kernprinzipien der Balance

### 1.1 Spielerfahrung
| Prinzip | Beschreibung | Messkriterium |
|---------|--------------|---------------|
| **Komfortabel spielbar** | Ressourcen reichen aus, strategisch zu handeln | Budget > 0 in 80% der Phasen |
| **Strategie > Taktik** | Langfristige Planung wichtiger als Einzelaktionen | Aktionsketten > Einzelaktionen im Erfolg |
| **Niemals langweilig** | Immer bedeutsame Entscheidungen verfuegbar | >= 3 sinnvolle Aktionen pro Phase |
| **Realitaetsnah** | Staatsakteure haben Ressourcen | Selten Ressourcenmangel-Niederlage |

### 1.2 Spielausgang
| Prinzip | Beschreibung | Messkriterium |
|---------|--------------|---------------|
| **Alle Enden erreichbar** | Jedes der 8 Enden kann durch Spielweise erreicht werden | Jedes Ending >= 5% Wahrscheinlichkeit |
| **Wiederholbarkeit** | Verschiedene Strategien fuehren zu verschiedenen Enden | Strategievielfalt messbar |
| **Verrat selten** | NPCs bleiben meist loyal | Verrat in < 15% der Spiele |
| **Alle NPCs nutzbar** | Jeder NPC bringt Mehrwert | Jeder NPC >= 1x pro Spiel sinnvoll |

---

## 2. Balance-Metriken

### 2.1 Ressourcen-Balance
```
OPTIMAL:
- Budget: Nie < 0 fuer > 3 aufeinanderfolgende Phasen
- Budget-Ende: >= 20k bei Phase 20
- Kapazitaet: >= 2 AP pro Phase verwendbar
- Risiko: Steigt langsam (< 3% pro Phase im Durchschnitt)
- Attention: Selten > 50% (ermoeglicht Erholung)
- Moral Weight: Korreliert mit Spielstil (nicht mit Zufall)

WARNUNG:
- Budget = 0 vor Phase 10 (zu schnell erschoepft)
- Risiko > 80% vor Phase 15 (zu schnelle Eskalation)
- Keine Aktionen verfuegbar (Sackgasse)

KRITISCH:
- Spieler kann nichts mehr tun (Dead-End)
- Ressourcen regenerieren nicht (Economy broken)
- Win unmoeglich unabhaengig von Strategie
```

### 2.2 Progressions-Balance
```
OPTIMAL (20 Phasen-Ziel):
- Phase 1-5: Einfuehrung, erste Aktionen, NPC-Kontakte
- Phase 6-10: Strategie-Entwicklung, erste Konsequenzen
- Phase 11-15: Entscheidende Aktionen, Krisen-Momente
- Phase 16-20: Finale Phase, Ending-Bestimmung

METRIKEN:
- Objective-Progress: ~5% pro Phase (100% bei Phase 20)
- Aktionen pro Phase: 2-4 (nicht < 1, nicht > 6)
- Konsequenzen: 1-3 pro 10 Phasen
- Welt-Events: 1-2 pro 10 Phasen
```

### 2.3 Strategie-Diversitaet
```
STRATEGIETYPEN die funktionieren muessen:
1. Aggressiv: Schnelle, riskante Aktionen -> Schnelles Ende (Win oder Loss)
2. Vorsichtig: Langsame, sichere Aktionen -> Langes Spiel, stabiler Sieg
3. Fokussiert: Spezialisierung auf einen Bereich (z.B. nur Media)
4. Diversifiziert: Breite Streuung ueber alle Bereiche
5. NPC-zentriert: Maximale NPC-Beziehungen, deren Boni nutzen

BALANCE-KRITERIUM:
- Keine Strategie sollte > 80% Win-Rate haben
- Keine Strategie sollte < 20% Win-Rate haben
- Alle Strategien sollten unterschiedliche Enden produzieren
```

---

## 3. Seeding & Wiederholbarkeit

### 3.1 Seed-Mechanismus
Das Spiel verwendet einen **deterministischen RNG** (seededRandom), der:
- Identische Ergebnisse bei gleichem Seed garantiert
- Replay-Faehigkeit ermoeglicht
- Balancing-Tests reproduzierbar macht

### 3.2 Seed-Kategorien fuer Playtests
```
SEED-KLASSEN:
- seed_easy_*    : Seeds die zu einfacheren Spielen fuehren
- seed_hard_*    : Seeds die zu schwierigeren Spielen fuehren
- seed_balanced_*: Seeds die ausgewogene Spiele produzieren
- seed_edge_*    : Seeds fuer Edge-Cases (extremes RNG)

GOLDEN SEEDS:
- Seeds die besonders gute Balance zeigen
- Werden als Referenz fuer zukuenftige Tests gespeichert
```

---

## 4. Playtest-Szenarien

### 4.1 Strategie-Simulationen

| Strategie | Beschreibung | Erwartetes Ergebnis |
|-----------|--------------|---------------------|
| **random** | Zufaellige Aktionsauswahl | Baseline-Metrik |
| **cheapest** | Immer guenstigste Aktion | Langes Spiel, wenig Fortschritt |
| **expensive** | Immer teuerste Aktion | Schnelle Eskalation |
| **low_risk** | Minimiere Risiko-Kosten | Sicheres, langsames Spiel |
| **high_impact** | Maximiere Effekte | Schneller Fortschritt, hohes Risiko |
| **npc_focused** | Priorisiere NPC-Affinitaet | Beziehungs-Boni nutzen |
| **chain_focused** | Folge Unlock-Ketten | Strategische Progression |
| **phase_balanced** | Alle TA-Phasen gleichmaessig | Diversifizierte Strategie |

### 4.2 Edge-Case-Tests

| Test | Beschreibung | Prueft |
|------|--------------|--------|
| **no_budget** | Nur kostenlose Aktionen | Economy-Robustheit |
| **max_risk** | Ignoriere Risiko komplett | Risiko-Eskalation |
| **single_npc** | Nur mit einem NPC arbeiten | NPC-Abhaengigkeit |
| **no_unlocks** | Nur Basis-Aktionen | Unlock-Notwendigkeit |
| **speed_run** | Minimale Phasen bis Win | Mindest-Spiellaenge |
| **endurance** | Maximale Phasen bis Loss | Maximal-Spiellaenge |

---

## 5. Akzeptanzkriterien

### 5.1 Muss-Kriterien (P0)
- [ ] Spiel ist in 20 Phasen abschliessbar (Win moeglich)
- [ ] Keine Dead-Ends (immer >= 1 Aktion verfuegbar)
- [ ] Budget reicht fuer strategisches Spiel
- [ ] Alle 5 NPCs bieten Mehrwert
- [ ] Konsequenzen triggern (nicht 0 in 20 Phasen)

### 5.2 Soll-Kriterien (P1)
- [ ] Win-Rate zwischen 40-60% bei random Strategie
- [ ] Alle 8 Ending-Kategorien erreichbar
- [ ] Strategievielfalt messbar (verschiedene Strategien = verschiedene Enden)
- [ ] Risiko-Eskalation kontrollierbar durch Spielerverhalten

### 5.3 Kann-Kriterien (P2)
- [ ] Spieldauer-Varianz (12-28 Phasen je nach Strategie)
- [ ] NPC-Verrat korreliert mit Spielerverhalten
- [ ] Golden Seeds identifiziert fuer Balance-Referenz

---

## 6. Balance-Tuning-Parameter

### 6.1 Ressourcen-Stellschrauben
| Parameter | Aktuell (Easy) | Aktuell (Normal) | Anpassungsrichtung |
|-----------|----------------|------------------|-------------------|
| initialMoney | 180 | 150 | Erhoehen wenn Budget zu knapp |
| moneyPerRound | 35 | 30 | Erhoehen fuer mehr Komfort |
| attentionDecayRate | 0.12 | 0.15 | Erhoehen fuer schnellere Erholung |
| detectionThreshold | 0.85 | 0.80 | Erhoehen fuer mehr Spielraum |

### 6.2 Aktions-Stellschrauben
| Parameter | Beschreibung | Anpassungsrichtung |
|-----------|--------------|-------------------|
| Action Costs | Budget/Kapazitaet pro Aktion | Senken fuer mehr Aktionen |
| Risk Costs | Risiko-Zunahme pro Aktion | Senken fuer laengeres Spiel |
| Unlock Requirements | Voraussetzungen fuer Aktionen | Lockern fuer mehr Optionen |
| NPC Affinity Bonus | Boni bei NPC-Zusammenarbeit | Erhoehen fuer NPC-Relevanz |

### 6.3 Konsequenz-Stellschrauben
| Parameter | Beschreibung | Anpassungsrichtung |
|-----------|--------------|-------------------|
| Base Probability | Basis-Wahrscheinlichkeit | Erhoehen wenn zu wenig Konsequenzen |
| Delay Range | Phasen bis Trigger | Verkuerzen fuer schnelleres Feedback |
| Severity | Schwere der Auswirkungen | Anpassen an gewuenschte Dramatik |

---

## 7. Metriken-Erfassung

### 7.1 Pro Playtest erfassen
```typescript
interface PlaytestMetrics {
  // Identifikation
  seed: string;
  difficulty: 'easy' | 'normal' | 'hard' | 'expert';
  strategy: string;
  timestamp: string;

  // Ergebnis
  outcome: 'victory' | 'defeat' | 'ongoing' | 'timeout';
  endingCategory: string | null;
  phasesPlayed: number;

  // Ressourcen-Verlauf
  resourceHistory: ResourceSnapshot[];
  budgetMinimum: number;
  budgetMaximum: number;
  riskMaximum: number;

  // Aktionen
  actionsExecuted: number;
  actionsPerPhase: number;
  uniqueActionsUsed: Set<string>;
  actionChainsCompleted: number;

  // NPCs
  npcInteractions: Map<string, number>;
  npcRelationshipChanges: NPCRelationshipDelta[];
  betrayalsOccurred: number;

  // Events
  consequencesTriggered: number;
  worldEventsOccurred: number;
  crisismomentsResolved: number;

  // Balance-Indikatoren
  deadEndPhases: number[];  // Phasen ohne verfuegbare Aktionen
  resourceCriticalPhases: number[];  // Phasen mit kritischen Ressourcen
  progressPerPhase: number[];  // Objective-Progress pro Phase
}
```

### 7.2 Aggregierte Metriken (ueber mehrere Playtests)
```typescript
interface AggregatedMetrics {
  runCount: number;
  winRate: number;
  avgPhasesPlayed: number;
  avgActionsPerPhase: number;
  avgConsequencesPerGame: number;

  // Verteilungen
  endingDistribution: Map<string, number>;
  outcomeDistribution: Map<string, number>;
  strategyEffectiveness: Map<string, number>;

  // Balance-Scores
  resourceBalanceScore: number;  // 0-100
  progressionBalanceScore: number;  // 0-100
  strategyDiversityScore: number;  // 0-100
  overallBalanceScore: number;  // 0-100
}
```

---

## 8. Referenzen

- [Existierender Playtest Report 2025-12-28](../PLAYTEST_2025-12-28.md)
- [Balance Config](../../../desinformation-network/src/game-logic/balance-config.ts)
- [Story Engine Adapter](../../../desinformation-network/src/game-logic/StoryEngineAdapter.ts)
- [Playtest Runner](../../../desinformation-network/src/story-mode/tests/playtest.test.ts)
