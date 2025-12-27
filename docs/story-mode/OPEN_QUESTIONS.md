# Story Mode - Offene Fragen

Fragen, die noch diskutiert und entschieden werden müssen.

---

## Klärungsbedarf aus Q&A (2025-12-27)

### Q-NEW-001: Was ist "moralische Erlösung" als Ende?
**Priorität:** 🟡 MITTEL
**Status:** ⏳ Klärung nötig
**Referenz:** Antwort #7

**Kontext:**
Bei den multiplen Enden wurde "moralische Erlösung" erwähnt. Benutzer versteht nicht, was damit gemeint ist.

**Mögliche Interpretationen:**
1. Spieler wechselt die Seite und wird zum Whistleblower
2. Spieler sabotiert das System von innen
3. Spieler erreicht persönliche Einsicht ohne aktive Handlung
4. Spieler wird von Opfern "vergeben" (unwahrscheinlich)

**Diskussion nötig:** Welche Ende-Varianten sind realistisch und pädagogisch wertvoll?

---

### Q-NEW-002: Memory-Funktion im Dialogsystem
**Priorität:** 🟡 MITTEL
**Status:** ⏳ Klärung nötig
**Referenz:** Antwort #20

**Frage:**
Benutzer versteht nicht, was mit "Erinnerungsfunktion" im Dialogsystem gemeint ist.

**Erklärung:**
Memory-Funktion bedeutet: NPCs erinnern sich an frühere Gespräche und beziehen sich darauf.

**Beispiel:**
- Tag 5: Spieler verspricht Marina eine Beförderung
- Tag 15: Marina: "Du hattest mir eine Beförderung versprochen. Was ist daraus geworden?"

**Technische Implikation:**
- Dialog-History pro NPC speichern
- Key-Events markieren die referenziert werden können
- Template-System: "Du hattest {promise} versprochen"

**Frage:** Soll das im MVP umgesetzt werden oder ist das zu komplex?

---

### Q-NEW-003: Schwierigkeitsgrade vs. Assistenz-Funktion
**Priorität:** 🟡 MITTEL
**Status:** ⏳ Unentschieden
**Referenz:** Antwort #14

**Frage:**
Erhöht unterschiedliche Schwierigkeitsgrade die Konzeptionskomplexität? Oder ist die Assistenz-Funktion komplizierter zu machen?

**Optionen:**
| Option | Beschreibung | Aufwand |
|--------|--------------|---------|
| A: Keine Schwierigkeit | Einheitliches Erlebnis | Gering |
| B: Schwierigkeitsgrade | Leicht/Normal/Schwer | Mittel |
| C: Assistenz-Modus | Optionale Hinweise | Mittel-Hoch |
| D: Adaptiv | System passt sich an | Hoch |

**Empfehlung:** Für MVP Option A (keine Schwierigkeit), später evaluieren.

---

### Q-NEW-004: Bibliotheken-Entscheidung
**Priorität:** 🟡 MITTEL
**Status:** ⏳ Info nötig
**Referenz:** Antwort #87

**Frage:**
Welche JavaScript/React-Bibliotheken sollen verwendet werden?

**Anforderung:** Kostenlos, frei verfügbar

**Kandidaten (zu evaluieren):**
| Bibliothek | Zweck | Lizenz | Empfehlung |
|------------|-------|--------|------------|
| Framer Motion | Animationen | MIT | ✅ Gut für React |
| GSAP | Animationen | Eingeschränkt kostenlos | ⚠️ Prüfen |
| Lottie | After Effects Animationen | Apache 2.0 | ✅ Gut für komplexe Anims |
| react-spring | Physics-basierte Anims | MIT | ✅ Alternative zu Framer |
| i18next | Internationalisierung | MIT | ✅ Standard |
| Zustand | State Management | MIT | ✅ Leichtgewichtig |
| Jotai | State Management | MIT | ✅ Atomar |

**Nächster Schritt:** Begründete Empfehlungsliste erstellen

---

### Q-NEW-005: Konzern-Szenario Details
**Priorität:** 🟢 NIEDRIG (Post-MVP)
**Status:** ⏳ Konzept nötig
**Referenz:** Antwort #49

**Frage:**
Was genau beinhaltet das Konzern-Szenario (nächstes nach MVP)?

**Brainstorming:**
- Pharma-Skandal vertuschen
- Öl-Konzern vs. Klimaaktivisten
- Tech-Konzern und Datenschutz
- Tabak-Industrie Lobbying

**Nächster Schritt:** Szenario-Optionen ausarbeiten und bewerten

---

### Q-NEW-006: Verteidiger-Modus Details
**Priorität:** 🟡 MITTEL
**Status:** ⏳ Konzept nötig
**Referenz:** Antwort #50

**Frage:**
Wie unterscheidet sich der Verteidiger-Modus vom Angreifer?

**Bekannt:**
- Im MVP nur grob vorbereiten (UI/UX mitdenken)
- Erst nach Angreifer-Modus entwickeln

**Offene Fragen:**
- Welche Aktionen hat der Verteidiger?
- Sieht er die Angriffe vorher oder nur Effekte?
- Ressourcen: Budget vs. Reichweite?
- Gewinnt Verteidiger durch Immunisierung der Bevölkerung?

---

### Q-NEW-007: Psychologische Modelle für NPCs
**Priorität:** 🟡 MITTEL
**Status:** 🔍 Recherche nötig
**Referenz:** Antwort #4, #21

**Frage:**
Welche psychologischen Modelle eignen sich für NPC-Persönlichkeiten und Beziehungshinweise?

**Kandidaten:**
- **Big Five (OCEAN):** Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism
- **MBTI:** 16 Typen (weniger wissenschaftlich)
- **Dark Triad:** Narzissmus, Machiavellismus, Psychopathie (relevant für Täter-Seite)

**Für Beziehungshinweise:**
- Emotionsrad (Plutchik)
- Non-verbale Signale
- Verhaltensmarker

**Nächster Schritt:** Recherche und Empfehlung

---

### Q-NEW-008: Sekundäre Konsequenzen Long-List
**Priorität:** 🔴 HOCH (MVP-relevant)
**Status:** ⏳ Ausarbeitung nötig
**Referenz:** Antwort #5

**Frage:**
Welche sekundären Konsequenzen soll es geben?

**Erste Sammlung:**
| Primäraktion | Sekundäre Konsequenz |
|--------------|---------------------|
| Journalist attackiert | Solidarisierung unter Journalisten |
| Journalist Selbstmordversuch | Öffentliche Empörung, Investigation |
| Große Enthüllung | Demonstrationen |
| Politikerskandal | Rücktritt oder Trotz-Reaktion |
| Erfolgreiche Narrative | Nachahmung durch andere Akteure |
| Fact-Checker attackiert | Erhöhte Aufmerksamkeit für Fact-Checking |

**Nächster Schritt:** Vollständige Liste für MVP erstellen

---

## Bearbeitete Fragen (aus ursprünglicher Liste)

### Q-001: Tonalität des Story Mode → ENTSCHIEDEN
**Status:** ✅ Beantwortet → D-007
Dokumentarisch-ernst mit zynischen Momenten

### Q-002: Moralisches Feedback-System → TEILWEISE BEANTWORTET
**Status:** 🟡 Teilweise
- Entschieden: Qualitative Hinweise, nicht quantitativ sichtbar
- Offen: Details der Visualisierung (Büro düsterer etc. → als Idee notiert)

### Q-003: NPC-Tiefe für MVP → ENTSCHIEDEN
**Status:** ✅ Beantwortet → D-024, D-010
Min. 5 NPCs, psychologisch fundierte Persönlichkeiten

### Q-004: Zeitstruktur → ENTSCHIEDEN
**Status:** ✅ Beantwortet → D-016
Globaler Timer, ~10 Jahre, keine Tage

### Q-005: Die Tür → ENTSCHIEDEN
**Status:** ✅ Beantwortet → D-023
Führt zu anderen Räumen, später freigeschaltet

### Q-006: Historische Szenarien → SPÄTER
**Status:** 🟢 Post-MVP
Bleibt offen für spätere Entwicklung

### Q-007: Multiplayer → ENTSCHIEDEN
**Status:** ✅ Beantwortet → D-T009
Kein Multiplayer im Story Mode

### Q-008: Schwierigkeitsgrade → OFFEN
**Status:** ⏳ Siehe Q-NEW-003
Unentschieden zwischen Optionen

---

## Checklisten (zu erstellen)

### CL-001: Open-Source-Checkliste
**Status:** ⏳ TODO
**Referenz:** Antwort #45

Inhalte:
- [ ] Lizenz wählen (MIT, Apache 2.0, GPL?)
- [ ] Contributing Guidelines
- [ ] Code of Conduct
- [ ] Issue Templates
- [ ] PR Templates
- [ ] Security Policy
- [ ] Wissenschaftler-Zugang definieren
- [ ] MOD-Dokumentation
- [ ] Community-Building Strategie

---

### CL-002: Modding-Support-Checkliste
**Status:** ⏳ TODO
**Referenz:** Antwort #51

Inhalte:
- [ ] Szenario-Datenformat dokumentieren
- [ ] Validierungs-Schema erstellen
- [ ] Beispiel-Szenario als Template
- [ ] Modding-Dokumentation
- [ ] Community-Plattform (GitHub Discussions?)
- [ ] Qualitätssicherung für Community-Content

---

## Nächste Schritte

1. **Q-NEW-008** (Sekundäre Konsequenzen) hat höchste Priorität für MVP
2. **Q-NEW-001/002** können während Entwicklung geklärt werden
3. **Checklisten** sollten vor erstem Release erstellt werden
