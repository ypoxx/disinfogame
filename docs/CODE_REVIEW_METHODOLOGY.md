# Code Review Methodology - Desinformation Network

**Erstellt:** 2026-01-04
**Zweck:** Systematische Qualitätssicherung bei Code-Analysen und Roadmap-Erstellung

---

## PROBLEM: Fehlerhafte Analysen verhindern

Bei der Erstellung der DEVELOPMENT_ROADMAP_2026.md wurden folgende Fehler gemacht:
1. Ein nicht-existierender Bug als "kritisch" dokumentiert
2. Wertvolle Komponenten fälschlich als "toter Code" markiert
3. Aufwandsschätzungen ohne Abhängigkeitsanalyse
4. Design-Intentionen nicht berücksichtigt

---

## PFLICHT-CHECKLISTE: Vor jeder Code-Analyse

### Phase 1: Kontext verstehen (BEVOR Code gelesen wird)

- [ ] **Design-Dokumente lesen:**
  - [ ] GAME_REDESIGN.md - Was sind die Spielmechanik-Ziele?
  - [ ] ROADMAP.md - Was ist geplant aber noch nicht umgesetzt?
  - [ ] UI_UX_REDESIGN_PLAN.md - Welche UI-Änderungen sind geplant?
  - [ ] CLAUDE_INSTRUCTIONS.md - Was sind die Entwicklungsrichtlinien?
  - [ ] docs/story-mode/*.md - Story Mode spezifische Pläne

- [ ] **Fragen beantworten:**
  - Was ist PRO MODE vs STORY MODE? (Verschiedene Anforderungen!)
  - Welche Features sind "geplant aber nicht integriert" vs "aufgegeben"?
  - Gibt es experimentelle Ansätze (z.B. Canvas vs SVG)?

### Phase 2: Bug-Verifizierung (JEDEN Bug selbst prüfen)

- [ ] **Für jeden behaupteten Bug:**
  1. Datei SELBST öffnen und lesen (nicht nur Agent-Bericht vertrauen)
  2. Exakte Zeilennummer verifizieren
  3. Umliegenden Code verstehen
  4. Test schreiben oder manuell reproduzieren

- [ ] **Dokumentationsformat für verifizierte Bugs:**
  ```
  BUG-ID: [eindeutige ID]
  Status: VERIFIZIERT / NICHT REPRODUZIERBAR / TEILWEISE
  Datei: [absoluter Pfad]
  Zeile: [exakte Zeilennummer]
  Code-Snippet: [betroffener Code]
  Reproduktion: [Schritte zur Reproduktion]
  Impact: [Auswirkung auf Spieler/System]
  ```

### Phase 3: "Toter Code" Bewertung

**NIEMALS Code als "tot" markieren ohne:**

- [ ] Design-Dokumente auf Referenzen geprüft
- [ ] Alle Imports/Exports durchsucht
- [ ] Gefragt: Ist das für PRO MODE oder STORY MODE?
- [ ] Gefragt: Ist das experimentell oder geplant?
- [ ] Gefragt: Gibt es alternative Implementierungen (Evolution)?

**Kategorien statt "toter Code":**

| Kategorie | Bedeutung | Aktion |
|-----------|-----------|--------|
| ORPHAN | Code existiert, UI fehlt | INTEGRIEREN |
| SUPERSEDED | Durch neuere Version ersetzt | ALS REFERENZ BEHALTEN oder ENTFERNEN |
| EXPERIMENTAL | Alternativer Ansatz zum Testen | DOKUMENTIEREN |
| PLANNED | Für zukünftige Phase geplant | NICHT ANFASSEN |
| DEAD | Wirklich ungenutzt und nicht geplant | ENTFERNEN |

### Phase 4: Aufwandsschätzung

- [ ] **Abhängigkeitsanalyse:**
  - Wie viele Dateien sind betroffen? (`grep -r "pattern"`)
  - Gibt es blocking dependencies?
  - Welche Tests müssen angepasst werden?

- [ ] **Schätzungsformel:**
  ```
  Basis-Aufwand × Anzahl betroffene Dateien × Komplexitätsfaktor

  Komplexitätsfaktor:
  - Einfache Änderung (1 Zeile): 1.0
  - Refactoring (mehrere Funktionen): 1.5
  - Architektur-Änderung: 2.0-3.0
  - Unbekannter Code: +50% Puffer
  ```

### Phase 5: Cross-Reference mit bestehenden Dokumenten

- [ ] **Abgleich mit AUDIT_REPORT:**
  - Sind alle dort genannten Issues aufgenommen?
  - Stimmen die Prioritäten überein?

- [ ] **Abgleich mit ROADMAP.md:**
  - Sind alle geplanten Features berücksichtigt?
  - Gibt es Widersprüche?

- [ ] **Versionierung prüfen:**
  - Welches Dokument ist neuer?
  - Bei Widersprüchen: Explizit dokumentieren!

---

## ANTI-PATTERNS: Was NICHT tun

### 1. Agent-Berichte blind vertrauen
**Falsch:** "Agent sagt Switch hat kein break → dokumentiere als Bug"
**Richtig:** Datei selbst öffnen, Zeile 360-373 lesen, alle `break;` sehen

### 2. "Ungenutzt" = "Löschen"
**Falsch:** "Komponente wird nicht importiert → toter Code"
**Richtig:** Design-Docs prüfen, Modus prüfen, Evolution prüfen

### 3. Einzelne Zeile schätzen statt System
**Falsch:** "Math.random() ersetzen = 15 Minuten"
**Richtig:** "19 Dateien betroffen × 10 Min/Datei = 3 Stunden"

### 4. Komponenten-Duplikate als Fehler sehen
**Falsch:** "BottomSheet und UnifiedRightPanel = Code-Duplikation"
**Richtig:** "Evolution von v1 → v2 → v3, dokumentierte UI-Verbesserung"

---

## QUALITÄTSSICHERUNG: Peer Review Fragen

Vor Finalisierung einer Analyse, diese Fragen beantworten:

1. **Habe ich JEDEN Bug selbst im Code verifiziert?**
2. **Habe ich die Design-Dokumente gelesen BEVOR ich Code analysiert habe?**
3. **Sind meine Aufwandsschätzungen durch Abhängigkeitsanalyse gestützt?**
4. **Habe ich zwischen PRO MODE und STORY MODE unterschieden?**
5. **Habe ich "ungenutzt" vs "geplant" vs "experimentell" differenziert?**
6. **Gibt es Widersprüche zu existierenden Dokumenten?**

---

## SPEZIFISCH FÜR DIESES PROJEKT

### Zwei-Modi-Architektur verstehen

```
/src/components/     → Sandbox/Pro Mode
/src/story-mode/     → Story Mode (SEPARATE Implementierung!)

Komponenten können in EINEM Modus "ungenutzt" sein,
aber im ANDEREN Modus aktiv geplant.
```

### Bekannte "Orphan-Features" (Stand 2026-01-04)

Diese Features haben Code aber keine UI-Integration:

| Feature | Datei | Status |
|---------|-------|--------|
| Encyclopedia | components/Encyclopedia.tsx | toggleEncyclopedia existiert, UI fehlt |
| TrustEvolutionChart | components/TrustEvolutionChart.tsx | Komponente existiert, nicht gerendert |
| EventsPanel | story-mode/components/EventsPanel.tsx | Prop `onOpenEvents` nicht übergeben |
| TutorialOverlay | story-mode/components/TutorialOverlay.tsx | Phase 'tutorial' gesetzt, UI fehlt |
| dismissCurrentEvent | hooks/useGameState.ts | Handler existiert, nie aufgerufen |
| toggleSettings | hooks/useGameState.ts | Handler existiert, keine UI |

### Bekannte "Nicht-Bugs" (fälschlich als Bug markiert)

| Behauptung | Realität |
|------------|----------|
| Switch ohne break (GameState.ts:360) | Alle break-Statements sind vorhanden |

---

## CHANGELOG

| Datum | Änderung |
|-------|----------|
| 2026-01-04 | Dokument erstellt nach fehlerhafter DEVELOPMENT_ROADMAP_2026.md |

