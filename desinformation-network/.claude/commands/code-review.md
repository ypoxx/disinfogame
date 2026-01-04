# Code-Review Skill

**Zweck:** Systematische Qualitätssicherung bei Code-Analysen und Roadmap-Erstellung

---

## AUTOMATISCHER WORKFLOW

Dieser Skill führt dich durch alle erforderlichen Schritte der Code-Analyse-Methodik.
Befolge jeden Schritt strikt und markiere ihn als erledigt.

---

## PHASE 1: Kontext verstehen (BEVOR Code gelesen wird)

### Pflicht-Lektüre:
Lies diese Dokumente ZUERST, um die Design-Intentionen zu verstehen:

1. [ ] `GAME_REDESIGN.md` - Spielmechanik-Ziele
2. [ ] `ROADMAP.md` - Geplante aber nicht umgesetzte Features
3. [ ] `UI_UX_REDESIGN_PLAN.md` - UI-Änderungspläne
4. [ ] `CLAUDE_INSTRUCTIONS.md` / `.claude/CLAUDE.md` - Entwicklungsrichtlinien
5. [ ] `docs/story-mode/*.md` - Story Mode spezifische Pläne

### Kontext-Fragen beantworten:
- Was ist PRO MODE vs STORY MODE? (Verschiedene Anforderungen!)
- Welche Features sind "geplant aber nicht integriert" vs "aufgegeben"?
- Gibt es experimentelle Ansätze (z.B. Canvas vs SVG)?

**WICHTIG:** Fahre NICHT mit Phase 2 fort, bevor du diese Dokumente gelesen hast!

---

## PHASE 2: Bug-Verifizierung

### Für JEDEN behaupteten Bug:

```
CHECKLISTE:
[ ] 1. Datei SELBST mit Read-Tool öffnen
[ ] 2. Exakte Zeilennummer verifizieren
[ ] 3. Umliegenden Code (±20 Zeilen) verstehen
[ ] 4. Code-Logik nachvollziehen
[ ] 5. Reproduzierbarkeit prüfen
```

### Dokumentationsformat für verifizierte Bugs:

```markdown
## BUG: [Kurzbeschreibung]

**Status:** VERIFIZIERT / NICHT REPRODUZIERBAR / TEILWEISE
**Datei:** [absoluter Pfad]
**Zeile:** [exakte Zeilennummer]
**Code-Snippet:**
```[sprache]
[betroffener Code]
```
**Reproduktion:** [Schritte zur Reproduktion]
**Impact:** [Auswirkung auf Spieler/System]
**Priorität:** KRITISCH / HOCH / MITTEL / NIEDRIG
```

**WARNUNG:** Dokumentiere NIEMALS einen Bug, den du nicht selbst im Code verifiziert hast!

---

## PHASE 3: "Toter Code" Bewertung

### NIEMALS Code als "tot" markieren ohne:

```
CHECKLISTE:
[ ] Design-Dokumente auf Referenzen geprüft
[ ] Alle Imports/Exports durchsucht (grep -r "ComponentName")
[ ] Gefragt: Ist das für PRO MODE oder STORY MODE?
[ ] Gefragt: Ist das experimentell oder geplant?
[ ] Gefragt: Gibt es alternative Implementierungen (Evolution)?
```

### Kategorisierung statt "toter Code":

| Kategorie | Bedeutung | Aktion |
|-----------|-----------|--------|
| **ORPHAN** | Code existiert, UI fehlt | → INTEGRIEREN |
| **SUPERSEDED** | Durch neuere Version ersetzt | → ALS REFERENZ BEHALTEN |
| **EXPERIMENTAL** | Alternativer Ansatz zum Testen | → DOKUMENTIEREN |
| **PLANNED** | Für zukünftige Phase geplant | → NICHT ANFASSEN |
| **DEAD** | Wirklich ungenutzt und nicht geplant | → ENTFERNEN |

---

## PHASE 4: Aufwandsschätzung

### Abhängigkeitsanalyse durchführen:

```bash
# Wie viele Dateien sind betroffen?
grep -r "pattern" --include="*.ts" --include="*.tsx" | wc -l

# Welche Dateien genau?
grep -rl "pattern" --include="*.ts" --include="*.tsx"
```

### Schätzungsformel anwenden:

```
Aufwand = Basis × Anzahl_Dateien × Komplexitätsfaktor

Komplexitätsfaktor:
- Einfache Änderung (1 Zeile): 1.0
- Refactoring (mehrere Funktionen): 1.5
- Architektur-Änderung: 2.0-3.0
- Unbekannter Code: +50% Puffer
```

**Beispiel:**
```
Math.random() ersetzen:
- Basis: 10 Min/Datei
- Dateien: 19
- Komplexität: 1.0 (einfach)
- Gesamt: 10 × 19 × 1.0 = 190 Min ≈ 3 Stunden
```

---

## PHASE 5: Cross-Reference

### Abgleich mit bestehenden Dokumenten:

```
CHECKLISTE:
[ ] AUDIT_REPORT.md - Alle Issues aufgenommen?
[ ] ROADMAP.md - Features berücksichtigt?
[ ] DEVELOPMENT_ROADMAP_*.md - Widersprüche?
[ ] GAME_REDESIGN.md - Intentionen verstanden?
```

### Bei Widersprüchen:
1. Dokumentdatum prüfen (welches ist neuer?)
2. Widerspruch explizit dokumentieren
3. Im Zweifelsfall: Frage den User

---

## ANTI-PATTERNS: Was NICHT tun

| Anti-Pattern | Problem | Korrekte Vorgehensweise |
|--------------|---------|------------------------|
| Agent-Berichte blind vertrauen | Bugs werden falsch dokumentiert | Selbst verifizieren |
| "Ungenutzt" = "Löschen" | Wertvolle Features gehen verloren | Kategorisieren (ORPHAN etc.) |
| Einzelne Zeile schätzen | Massive Unterschätzung | Abhängigkeitsanalyse |
| Komponenten-Duplikate als Fehler | Evolution wird missverstanden | Code-Geschichte verstehen |

---

## QUALITÄTSSICHERUNG: Finale Checkliste

Vor Finalisierung einer Analyse ALLE Fragen mit JA beantworten:

```
[ ] Habe ich JEDEN Bug selbst im Code verifiziert?
[ ] Habe ich die Design-Dokumente BEVOR ich Code analysiert habe gelesen?
[ ] Sind meine Aufwandsschätzungen durch Abhängigkeitsanalyse gestützt?
[ ] Habe ich zwischen PRO MODE und STORY MODE unterschieden?
[ ] Habe ich "ungenutzt" vs "geplant" vs "experimentell" differenziert?
[ ] Gibt es dokumentierte Widersprüche zu existierenden Dokumenten?
```

**Wenn NICHT alle Fragen mit JA beantwortet werden können:**
→ Zurück zur entsprechenden Phase!

---

## BEKANNTE NICHT-BUGS (Stand 2026-01-04)

Diese wurden fälschlich als Bugs gemeldet:

| Behauptung | Realität |
|------------|----------|
| Switch ohne break (GameState.ts:360) | Alle break-Statements sind vorhanden |

---

## BEKANNTE ORPHAN-FEATURES (Stand 2026-01-04)

Diese haben Code aber keine UI-Integration:

| Feature | Datei | Handler existiert |
|---------|-------|-------------------|
| Encyclopedia | components/Encyclopedia.tsx | toggleEncyclopedia |
| TrustEvolutionChart | components/TrustEvolutionChart.tsx | - |
| EventsPanel | story-mode/components/EventsPanel.tsx | onOpenEvents (nicht übergeben) |
| TutorialOverlay | story-mode/components/TutorialOverlay.tsx | Phase 'tutorial' |
| dismissCurrentEvent | hooks/useGameState.ts | Handler nie aufgerufen |
| toggleSettings | hooks/useGameState.ts | Keine UI |

---

**Referenz:** Vollständige Dokumentation in `docs/CODE_REVIEW_METHODOLOGY.md`
