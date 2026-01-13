# Ordner-Audit Report: Verwaiste & Veraltete Inhalte

**Datum:** 2026-01-13
**Analysiert:** Gesamte Projekt-Struktur
**Fokus:** Duplikate, veraltete Dokumente, Optimierungspotenzial

---

## Executive Summary

Das Projekt enthält **erhebliche Dokumentations-Redundanz** und **verstreute Planungsdokumente**. Die ursprüngliche Konsolidierung (Ideen, Aufgaben, Roadmaps "an einem Ort") ist **nur teilweise erfolgt** - es existieren weiterhin 3+ Roadmaps, 2+ Claude-Anweisungsdateien und veraltete Audit-Reports.

| Kategorie | Anzahl | Zustand |
|-----------|--------|---------|
| Veraltete Dokumente | 8 | Sollten archiviert/gelöscht werden |
| Duplizierte Inhalte | 6 | Sollten konsolidiert werden |
| Verwaiste Daten | 1 Ordner + 1 ZIP | Sollten verschoben/gelöscht werden |
| Fehlende Struktur | 3 Bereiche | Reorganisation nötig |

---

## 1. VERALTETE DOKUMENTE (Löschen/Archivieren empfohlen)

### 1.1 Root-Verzeichnis

| Datei | Größe | Problem | Empfehlung |
|-------|-------|---------|------------|
| `AUDIT_REPORT_2025-12-29.md` | 11KB | **VERALTET** - Ersetzt durch DEVELOPMENT_ROADMAP_2026.md | ARCHIVIEREN |
| `ROADMAP.md` | **52KB** | **MASSIV VERALTET** - Enthält Sandbox-Mode-Konzepte, überholt durch 2026 Roadmap | ARCHIVIEREN oder LÖSCHEN |
| `PR_DESCRIPTION.md` | 7KB | Einmalige PR-Beschreibung, PR bereits gemerged | LÖSCHEN |
| `CLAUDE_PROMPT_UI_REDESIGN.md` | 12KB | Einmaliger Prompt, nicht mehr relevant | ARCHIVIEREN |

### 1.2 docs/ Verzeichnis

| Datei | Problem | Empfehlung |
|-------|---------|------------|
| `docs/NEXT_STEPS_PLANNING.md` | **EXTREM VERALTET** (2025-12-12) - PoC/MVP-Planung längst umgesetzt | ARCHIVIEREN |
| `docs/DUAL_INTERFACE_VISION.md` | Konzeptdokument für Dual-Mode, teilweise umgesetzt | REFERENZ behalten |
| `docs/STRATEGIC_MASTERPLAN.md` | Frühe Strategieplanung, überholt | PRÜFEN |

### 1.3 desinformation-network/

| Datei | Problem | Empfehlung |
|-------|---------|------------|
| `UX_UI_IMPROVEMENT_PLAN.md` | Ersetzt durch V2 | LÖSCHEN (V2 behalten) |
| `CODEX_PLAN.md` | Recherche-Dokument, nicht umgesetzt | PRÜFEN ob relevant |

---

## 2. DUPLIZIERTE INHALTE (Konsolidierung nötig)

### 2.1 Claude-Anweisungsdateien (KRITISCH)

**Problem:** 2 verschiedene Versionen existieren:

| Datei | Zeilen | Inhalt |
|-------|--------|--------|
| `/CLAUDE_INSTRUCTIONS.md` | 287 | Kurzversion: Story Mode Fokus, Lore, Quick-Reference |
| `/desinformation-network/.claude/CLAUDE.md` | 739 | **UMFASSEND**: Tech Stack, Architektur, Coding Standards, Deployment |

**Empfehlung:**
- `.claude/CLAUDE.md` als **Hauptdatei** behalten (umfassender)
- `CLAUDE_INSTRUCTIONS.md` nach `.claude/STORY_MODE_GUIDE.md` verschieben
- Symlink oder Verweis im Root erstellen

### 2.2 Roadmaps (3+ Versionen!)

| Datei | Zeilen | Aktualisiert | Fokus |
|-------|--------|--------------|-------|
| `/ROADMAP.md` | 1934 | ALT | Sandbox Mode Expansion (56 Actors) |
| `/DEVELOPMENT_ROADMAP_2026.md` | 394 | 2026-01-05 | **AKTUELL** - Story Mode Bugs/Features |
| `/docs/story-mode/NEXT_ACTIONS.md` | ~100 | - | Story Mode Tasks |

**Empfehlung:**
- `DEVELOPMENT_ROADMAP_2026.md` als **einzige aktive Roadmap** behalten
- `ROADMAP.md` → `docs/archive/ROADMAP_SANDBOX_EXPANSION.md`
- `NEXT_ACTIONS.md` in Roadmap integrieren

### 2.3 UX/UI-Pläne (3 Versionen)

| Datei | Ort | Status |
|-------|-----|--------|
| `UI_UX_REDESIGN_PLAN.md` | Root | Teilweise umgesetzt |
| `UX_UI_IMPROVEMENT_PLAN.md` | desinformation-network/ | Ersetzt durch V2 |
| `UX_UI_IMPLEMENTATION_PLAN_V2.md` | desinformation-network/ | **AKTUELLSTE** |

**Empfehlung:**
- Nur V2 behalten, andere archivieren
- In `/docs/design/` verschieben

---

## 3. VERWAISTE DATEN

### 3.1 docs/story-mode/data/ (SOLLTE IN SRC SEIN)

```
docs/story-mode/data/
├── actions.json       # 804 Zeilen - ABER: src/story-mode/data/actions.json existiert auch!
├── consequences.json  # 938 Zeilen
├── dialogues.json     # 703 Zeilen
└── countermeasures.json # 621 Zeilen
```

**Problem:** Daten sind in `/docs/` statt `/src/` - unklar welche Version aktiv ist.

**Empfehlung:**
- Prüfen ob diese identisch mit `src/story-mode/data/` sind
- Wenn ja: Löschen aus docs/
- Wenn nein: Konsolidieren

### 3.2 ZIP-Archiv im Repository

```
/desinformation-network-complete.zip (170KB)
```

**Problem:** Binärdatei im Git-Repository - sollte nicht versioniert werden.

**Empfehlung:**
- Aus Git entfernen: `git rm desinformation-network-complete.zip`
- In `.gitignore` aufnehmen

---

## 4. STRUKTURELLE PROBLEME

### 4.1 Keine klare Dokumentations-Hierarchie

**Aktuell:**
```
/                           # Root (12 MD-Dateien!)
├── docs/                   # Allgemeine Docs (7 MD-Dateien)
│   └── story-mode/         # Story Mode Docs (17 MD-Dateien!)
└── desinformation-network/
    ├── docs/               # WEITERE Docs (3 MD-Dateien)
    └── .claude/            # Claude-Anweisungen (7 MD-Dateien)
```

**Problem:** 4 verschiedene Dokumentations-Orte, keine klare Trennung

### 4.2 Empfohlene Struktur

```
/
├── CLAUDE.md               # → Symlink zu .claude/CLAUDE.md
├── README.md               # Projekt-Übersicht
├── DEVELOPMENT_ROADMAP.md  # Einzige aktive Roadmap
│
├── docs/
│   ├── design/             # UX/UI, Visual Design
│   │   ├── UX_UI_PLAN.md
│   │   └── VISUAL_DESIGN.md
│   ├── story-mode/         # Story Mode Dokumentation
│   │   ├── README.md
│   │   ├── SCENARIO_FRAMEWORK.md
│   │   └── PERSONAS.md
│   ├── technical/          # Architektur, Tech Debt
│   │   ├── ARCHITECTURE.md
│   │   └── TECHNICAL_DEBT.md
│   ├── research/           # Recherche-Dokumente
│   │   ├── GAME_DESIGN_PATTERNS.md
│   │   └── SCENARIO_ANALYSIS.md
│   └── archive/            # VERALTETE Dokumente (Referenz)
│       ├── ROADMAP_2025.md
│       ├── AUDIT_2025-12.md
│       └── ...
│
└── desinformation-network/
    └── .claude/            # Claude-Anweisungen (aktiv)
        ├── CLAUDE.md       # Haupt-Dokumentation
        ├── STORY_MODE_GUIDE.md  # (von CLAUDE_INSTRUCTIONS.md)
        └── commands/
```

---

## 5. CLAUDE.MD BEWERTUNG

### Aktuelle Situation

Die existierende `.claude/CLAUDE.md` ist **gut strukturiert** und enthält:

✅ **Vorhanden:**
- Project Overview & Core Concept
- Tech Stack (Frontend + Backend)
- Architecture Principles
- File Structure
- Coding Standards (TypeScript, React, CSS)
- Development Workflow
- Git Workflow
- Netlify Deployment
- Code-Review Methodology
- Troubleshooting

⚠️ **Verbesserungswürdig:**
- Letzte Aktualisierung: "2025-01" - sollte 2026-01 sein
- `/code-review` Skill referenziert - funktioniert dieser?
- Keine Story Mode spezifischen Anweisungen (diese sind in `CLAUDE_INSTRUCTIONS.md`)

### Empfohlene Verbesserungen

1. **Story Mode Guide integrieren:**
   - "Goldene Regeln" aus `CLAUDE_INSTRUCTIONS.md` in `.claude/STORY_MODE_GUIDE.md`
   - Lore-Informationen (Westunion) einbinden
   - JSON-Daten-Übersicht

2. **Fehlende Skills/Befehle:**
   - `/test` - Tests ausführen
   - `/build` - Projekt bauen
   - `/story-mode` - Story Mode spezifische Infos
   - `/check-orphans` - Verwaiste Features prüfen

3. **Aktualität:**
   - Versionsnummer aktualisieren
   - Neue Systeme dokumentieren (BetrayalSystem, EndingSystem, etc.)

---

## 6. ZUSAMMENFASSUNG: KONKRETE AKTIONEN

### Hohe Priorität (sofort)

| # | Aktion | Dateien | Aufwand |
|---|--------|---------|---------|
| 1 | ZIP aus Git entfernen | `desinformation-network-complete.zip` | 5 min |
| 2 | Veraltete Roadmap archivieren | `ROADMAP.md` → `docs/archive/` | 10 min |
| 3 | UX-Plan V1 löschen | `UX_UI_IMPROVEMENT_PLAN.md` | 5 min |
| 4 | PR_DESCRIPTION löschen | `PR_DESCRIPTION.md` | 2 min |

### Mittlere Priorität (diese Woche)

| # | Aktion | Beschreibung | Aufwand |
|---|--------|--------------|---------|
| 5 | docs/ reorganisieren | Neue Struktur (design/, technical/, archive/) | 30 min |
| 6 | CLAUDE_INSTRUCTIONS.md verschieben | → `.claude/STORY_MODE_GUIDE.md` | 15 min |
| 7 | docs/story-mode/data/ prüfen | Mit src/ vergleichen, ggf. löschen | 15 min |
| 8 | .gitignore erweitern | ZIP, veraltete Docs ausschließen | 5 min |

### Niedrige Priorität (später)

| # | Aktion | Beschreibung | Aufwand |
|---|--------|--------------|---------|
| 9 | Skills erweitern | `/test`, `/build`, `/story-mode` | 2h |
| 10 | CLAUDE.md aktualisieren | Neue Systeme dokumentieren | 1h |
| 11 | Dokumentations-Index erstellen | Übersicht aller Docs | 30 min |

---

## 7. METRIKEN

### Vor Bereinigung

| Metrik | Wert |
|--------|------|
| MD-Dateien im Root | 12 |
| Roadmap-Versionen | 3+ |
| Claude-Anweisungsdateien | 2 |
| Veraltete Dokumente | 8 |
| Dokumentations-Orte | 4 |
| Geschätzte Duplikate | ~25KB |

### Nach Bereinigung (Ziel)

| Metrik | Ziel |
|--------|------|
| MD-Dateien im Root | 3-4 |
| Roadmap-Versionen | 1 |
| Claude-Anweisungsdateien | 1 (+ Symlink) |
| Veraltete Dokumente | 0 (archiviert) |
| Dokumentations-Orte | 2 (docs/ + .claude/) |
| Geschätzte Einsparung | ~50KB |

---

**Bericht erstellt:** 2026-01-13
**Nächster Schritt:** Aktionen nach Priorität umsetzen
