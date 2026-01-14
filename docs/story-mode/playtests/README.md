# Playtest-Dokumentation: Story Mode

Dieser Ordner enthält alle Playtest-Ergebnisse und Balance-Analysen für den Story-Modus.

## Struktur

```
playtests/
├── README.md                    # Diese Datei
├── BALANCE_DEFINITION.md        # Definition guter Balance
├── reports/                     # Generierte Playtest-Reports
│   └── YYYY-MM-DD_<name>.md    # Einzelne Reports nach Datum
└── golden-seeds.json           # Sammlung gut balancierter Seeds
```

## Playtests ausfuehren

### Basis-Playtest
```bash
cd desinformation-network
npx vitest run src/story-mode/tests/playtest.test.ts
```

### Intelligenter Multi-Strategie-Playtest
```bash
cd desinformation-network
npx vitest run src/story-mode/tests/intelligent-playtest.test.ts
```

### Spezifische Tests
```bash
# Nur Balance-Test
npx vitest run -t "should have balanced resource progression"

# Nur Strategie-Vergleich
npx vitest run -t "should compare multiple strategies"

# Golden Seed Suche
npx vitest run -t "should identify golden seeds"
```

## Strategien

| Strategie | Beschreibung | Erwartetes Verhalten |
|-----------|--------------|---------------------|
| `random` | Zufaellige Aktionswahl | Baseline-Metrik |
| `cheapest` | Guenstigste Aktionen | Langsames, stabiles Spiel |
| `expensive` | Teuerste Aktionen | Schnelle Eskalation |
| `low_risk` | Minimales Risiko | Sicheres Spiel |
| `high_impact` | Maximale Effekte | Schneller Fortschritt |
| `aggressive` | Hohe Kosten, hohes Risiko | Schnelles Ende |
| `cautious` | Niedrige Kosten, niedriges Risiko | Langes, sicheres Spiel |
| `npc_focused` | NPC-Affinitaet priorisieren | Beziehungs-Boni nutzen |
| `chain_focused` | Unlock-Ketten folgen | Strategische Progression |

## Balance-Scores

Die Playtests berechnen drei Balance-Scores (0-100):

1. **Ressourcen-Balance**: Sind die Ressourcen fair verteilt?
   - Gut: Budget bleibt positiv, Risiko bleibt manageable
   - Schlecht: Haeufige Budget-Krisen, unkontrollierbare Risiko-Eskalation

2. **Progressions-Balance**: Ist die Spieldauer angemessen?
   - Gut: Spiele enden zwischen Phase 15-25
   - Schlecht: Zu schnelle oder zu langsame Enden

3. **Strategie-Diversitaet**: Fuehren verschiedene Strategien zu verschiedenen Ergebnissen?
   - Gut: Verschiedene Strategien = verschiedene Enden
   - Schlecht: Alle Strategien fuehren zum gleichen Ergebnis

## Seeding

Das Spiel verwendet deterministisches RNG (Seeded Random), was bedeutet:
- Gleicher Seed = identisches Spielergebnis
- Ermoeglicht reproduzierbare Tests
- Golden Seeds koennen als Referenz gespeichert werden

### Golden Seeds
Seeds die besonders gut ausbalancierte Spiele produzieren werden in `golden-seeds.json` gespeichert.

Kriterien fuer Golden Seeds:
- Spieldauer: 15-25 Phasen
- Budget: Nie kritisch niedrig
- Risiko: < 85% Maximum
- Aktionen: >= 1.5 pro Phase

## Report-Format

Jeder Playtest-Report sollte folgende Abschnitte enthalten:

1. **Metadaten**: Datum, Version, Seed, Schwierigkeit
2. **Ergebnisse**: Win-Rate, Avg. Phasen, Ressourcen-Verteilung
3. **Balance-Scores**: Die drei Score-Kategorien
4. **Probleme**: Gefundene Bugs oder Balance-Issues
5. **Empfehlungen**: Vorgeschlagene Anpassungen
6. **Golden Seeds**: Identifizierte gut balancierte Seeds

## Aeltere Reports

- [2025-12-28](../PLAYTEST_2025-12-28.md) - Erster Playtest, mehrere kritische Bugs identifiziert

## Zukunft

- [ ] Automatisierte taegliche Playtests via CI/CD
- [ ] Metriken-Dashboard fuer Balance-Trends
- [ ] A/B-Testing fuer Balance-Aenderungen
- [ ] Spieler-Feedback Integration
