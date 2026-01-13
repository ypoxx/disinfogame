# Dokumentation - Desinformations-Simulations-Spiel

**Letzte Aktualisierung:** 2025-01-13

---

## Dokumentationsstruktur

Diese Dokumentation folgt einer klaren Struktur. **Alle Dokumentation gehoert hier in `/docs/`**.

```
docs/
├── README.md                  ← DU BIST HIER (Index)
├── ROADMAP.md                 ← Aktuelle Roadmap und Prioritaeten
│
├── story-mode/                ← Story Mode spezifisch
│   ├── README.md              ← Story Mode Index
│   ├── NPC_ADVISOR_SYSTEM.md  ← NPC Advisor System (komplett)
│   ├── NARRATIVE_SYSTEM.md    ← Narrative Feedback-Loops
│   ├── IDEAS.md               ← Ideen-Sammlung (aktiv)
│   ├── IMPLEMENTATION_STATUS.md ← Aktueller Implementierungsstand
│   └── ...
│
├── reference/                 ← Statische Referenzdokumente
│   └── SCENARIO_FRAMEWORK.md  ← Westunion-Lore
│
└── archive/                   ← Veraltete Dokumente (zum Nachschlagen)
    └── ...
```

---

## Wichtige Dokumente nach Thema

### Aktuelle Planung & Roadmap
| Dokument | Beschreibung |
|----------|--------------|
| [ROADMAP.md](./ROADMAP.md) | **MASTER** - Alle aktuellen Prioritaeten |
| [NEXT_STEPS_PLANNING.md](./NEXT_STEPS_PLANNING.md) | Detaillierte naechste Schritte |

### Story Mode
| Dokument | Beschreibung |
|----------|--------------|
| [story-mode/README.md](./story-mode/README.md) | Story Mode Uebersicht |
| [story-mode/NPC_ADVISOR_SYSTEM_DESIGN.md](./story-mode/NPC_ADVISOR_SYSTEM_DESIGN.md) | NPC Berater-System Design |
| [story-mode/NPC_ADVISOR_IMPLEMENTATION_STATUS.md](./story-mode/NPC_ADVISOR_IMPLEMENTATION_STATUS.md) | Implementierungsstatus |
| [story-mode/IDEAS.md](./story-mode/IDEAS.md) | Ideen und Feature-Vorschlaege |
| [story-mode/PERSONAS.md](./story-mode/PERSONAS.md) | NPC-Charaktere und Hintergruende |

### Spieldesign & Architektur
| Dokument | Beschreibung |
|----------|--------------|
| [DESIGN_DECISIONS.md](./DESIGN_DECISIONS.md) | Architektur-Entscheidungen |
| [HIDDEN_TREASURES.md](./HIDDEN_TREASURES.md) | Ungenutzte aber wertvolle Inhalte |
| [DAY_ONE_WALKTHROUGH.md](./DAY_ONE_WALKTHROUGH.md) | Erster Spieltag Walkthrough |

### Referenzmaterial
| Dokument | Beschreibung |
|----------|--------------|
| [SCENARIO_ANALYSIS_REAL_CAMPAIGNS.md](./SCENARIO_ANALYSIS_REAL_CAMPAIGNS.md) | Echte Desinformations-Kampagnen |
| [reference/SCENARIO_FRAMEWORK.md](./reference/SCENARIO_FRAMEWORK.md) | Westunion-Lore und Mitgliedsstaaten |

---

## Regeln fuer neue Dokumentation

### Wo gehoert was hin?

1. **Neue Ideen/Features** → `docs/story-mode/IDEAS.md` (bestehende Datei ergaenzen!)
2. **Implementierungsplaene** → `docs/ROADMAP.md` (als Sprint/Phase hinzufuegen)
3. **Technische Architektur** → `docs/DESIGN_DECISIONS.md` oder neue Datei in `docs/`
4. **Story Mode spezifisch** → `docs/story-mode/` Ordner
5. **Statische Referenz (Lore, etc.)** → `docs/reference/`
6. **Veraltete Dokumente** → `docs/archive/` verschieben

### Namenskonventionen

- `UPPERCASE_WITH_UNDERSCORES.md` fuer alle Dokumentationsdateien
- Keine temporaeren Dateien im Root-Verzeichnis
- Keine Duplikate von Inhalten - existierende Dateien erweitern!

### Vor dem Erstellen neuer Dokumente

**IMMER PRUEFEN:**
1. Existiert bereits ein Dokument zu diesem Thema?
2. Kann ich ein bestehendes Dokument erweitern?
3. Ist die Information wirklich dokumentationswuerdig oder nur temporaer?

---

## Archivierte Dokumente

Folgende Dokumente wurden archiviert (verfuegbar in `docs/archive/`):

- Veraltete Roadmaps vor 2026
- Ueberholte Design-Dokumente
- Redundante Kopien

---

## Agent-Anweisungen

Fuer AI-Agenten (Claude, etc.) ist die zentrale Anweisungsdatei:
- **`/desinformation-network/.claude/CLAUDE.md`** - Master-Dokumentation fuer Agenten

Diese Datei enthaelt:
- Goldene Regeln (immer zuerst suchen!)
- Datei-Uebersicht
- Code-Konventionen
- Schnell-Referenz

---

*Dokumentation konsolidiert am 2025-01-13*
