# Story Mode - Ideen-Sammlung

Kreative Ideen und Vorschläge, die noch nicht priorisiert oder entschieden sind.

---

## Gameplay-Ideen

### I-001: Gegenseite spielen (Same Seed)
**Quelle:** Chat 2025-12-24
**Status:** ✅ Angenommen (MVP grob, Post-MVP Detail)

**Beschreibung:**
Nach Abschluss des Spiels kann man denselben Seed als Verteidiger spielen.
- Gleiche Ausgangslage, gleiche Zufallsereignisse
- Aber: Man kennt jetzt die Angriffe und muss sie abwehren
- Direkter Vergleich: Wie gut war die Offensive vs. Defensive?

**Technische Machbarkeit:** ✅ Seed-System existiert bereits

---

### I-002: Sprachraum-Vulnerabilität als Mechanik
**Quelle:** Chat 2025-12-24
**Status:** 💡 Konzept

**Beschreibung:**
Kleinere Sprachräume sind vulnerabler (weniger AI-Trainingsdaten, weniger Journalisten).

```
Spielmechanik:
├── Kleine Länder: Schnellerer Erfolg, weniger Gesamtimpact
├── Große Länder: Schwerer, aber größere Belohnung
└── Strategische Wahl: Wo investiere ich Ressourcen?
```

**Realer Hintergrund:**
AI-Spoofing-Forschung zeigt: Kleine Sprachräume sind anfälliger.

---

### I-003: Raum-Progression statt statischem Büro
**Quelle:** Analyse 2025-12-24
**Status:** ✅ Angenommen → D-023

**Beschreibung:**
Das Büro entwickelt sich mit dem Spielfortschritt. Die Tür führt zu anderen Räumen.

```
Mögliche Räume:
├── Büro (Start)
├── Operations Center (Aufstieg)
├── Server-Raum (Tech-Aktionen)
├── Besprechungsraum (NPC-Dialoge)
└── Außeneinsatz? (Spezial-Missionen)
```

**Vorteile:**
- Visueller Fortschritt motiviert
- Neue Interaktionsmöglichkeiten pro Phase
- Zeigt Eskalation der Kampagne

---

### I-004: NPC-Archetypen mit Dilemmata
**Quelle:** Chat 2025-12-24
**Status:** ✅ Angenommen → D-010

**Archetypen (mit Big Five Basis):**
1. **Volkov** (Bot-Farm-Chef) - Loyal, aber eigene Ambitionen
2. **Marina** (Analystin) - Kompetent, aber moralisch zerrissen
3. **Der Direktor** (Boss) - Fordert Ergebnisse, kennt keine Gnade
4. **Aleksei** (Rivale) - Will deinen Job, sabotiert subtil
5. **Der Journalist** (Bedrohung) - Recherchiert über eure Operationen

---

### I-005: Template-basierte narrative Skalierung
**Quelle:** Analyse 2025-12-24
**Status:** 💡 Architektur

**Beschreibung:**
System für 5000+ narrative Elemente ohne manuelles Schreiben:

```
Content-Pyramide:
├── Tier 1: 50 handgeschriebene Kern-Narrative
├── Tier 2: 200 Situations-Templates
├── Tier 3: 500 Flavor-Text-Varianten
└── Tier 4: ∞ generierte Kombinationen
```

---

### I-006: Chaos-Level im Büro → Emotionale Visualisierung
**Quelle:** Analyse 2025-12-24 + Antwort #57
**Status:** 💡 Idee (später evaluieren)

**Beschreibung:**
Das Büro wird visuell chaotischer bei steigendem Stress:
- Anfang: Aufgeräumt
- Mitte: Papiere stapeln sich
- Ende: Totales Chaos (oder penibel aufgeräumt bei Paranoia)

**Aufwand:** Gering (CSS-Änderungen, Overlay-Elemente)

---

### I-007: News-Ticker mit echten Konsequenzen
**Quelle:** Bestehende UI + Antwort #78
**Status:** 💡 Konzept

**Beschreibung:**
Der News-Ticker zeigt nicht nur Flavor, sondern:
- Reaktionen auf Spieleraktionen
- Warnsignale
- Konsequenzen

**Format:** Klickbare Liste (kein animierter Ticker)
- Klare Unterscheidung: Neu vs. Alt

---

### I-008: Post-Game Debriefing
**Quelle:** Pädagogisches Konzept + Antwort #37
**Status:** ✅ Angenommen

**Beschreibung:**
Nach Spielende:
1. Zusammenfassung der Kampagne (kompakt)
2. Analyse: "Das hast du getan" mit realen Parallelen (als Links)
3. Reflexionsfragen
4. Ressourcen: Links zu echten Fact-Checking-Organisationen

**Unterschied Wargaming:** Detailliertere Diagramme, Phasen-Analyse

---

## Neue Ideen aus Q&A 2025-12-27

### I-009: Protagonist-Hintergründe (Civilization-Stil)
**Quelle:** Antwort #2
**Status:** 💡 Idee (bei Spielevariationen ausbauen)

**Beschreibung:**
Verschiedene Hintergründe mit Vor-/Nachteilen:
- **Unternehmer:** +Ressourcen, -Kontakte
- **Ex-Geheimdienstler:** +Taktik, -Öffentlichkeit
- **Start-up-Gründer:** +Tech, -Erfahrung

**Wichtig:** Muss zum Meta-Narrativ passen (freiwillige Teilnahme)

---

### I-010: Ausstiegs-Quiz
**Quelle:** Antwort #3
**Status:** 💡 Idee

**Beschreibung:**
Beim Versuch auszusteigen:
- Quiz-Fragen über das Gelernte
- Hindernisse basierend auf Verstrickungsgrad
- Realistische Konsequenzen des Ausstiegs

**Pädagogischer Wert:** Zeigt, wie schwer der Ausstieg wirklich ist

---

### I-011: Sekundäre Konsequenzen-Ketten
**Quelle:** Antwort #5
**Status:** 🔴 MVP-relevant (siehe Q-NEW-008)

**Beschreibung:**
Aktionen haben Kettenreaktionen:
```
Journalist attackiert
    └── Selbstmordversuch
        └── Solidarisierung unter Journalisten
            └── Große Enthüllung über Operation
                └── Demonstrationen
                    └── Politischer Druck
```

---

### I-012: NPC-Austausch-System
**Quelle:** Antwort #13
**Status:** 💡 Konzept

**Beschreibung:**
NPCs können ausgetauscht werden (Fehler, Kündigung, etc.)
- Rollen/Funktionen bleiben
- Neue Charaktere bringen neue Dynamiken
- Spieler muss sich anpassen

**Beispiel:**
Marina (vorsichtig) → wird ersetzt durch → Igor (rücksichtslos)
= Gameplay-Änderung

---

### I-013: Absurde Normalisierungs-Sammlung
**Quelle:** Antwort #1
**Status:** 🔍 Recherche nötig

**Beschreibung:**
Sammlung realer absurder Situationen als Ton-Referenz:
- Prominente mit merkwürdigen Alters-Positionen
- Politiker mit absurden Aussagen die durchkommen
- Normalisierungen die früher undenkbar waren

**Zweck:** Richtigen Ton für zynische Momente finden

---

### I-014: 10+ Beziehungshinweis-Varianten
**Quelle:** Antwort #21
**Status:** 🔍 Recherche nötig

**Beschreibung:**
Statt nur 4 Varianten ("wirkt distanziert") brauchen wir 10+ pro Zustand:
- Basierend auf psychologischen Modellen
- Verhaltensmarker
- Non-verbale Signale

**Beispiel für "Misstrauen":**
1. "Marina meidet deinen Blick"
2. "Marina überprüft deine Aussagen bei Kollegen"
3. "Marina antwortet einsilbig"
4. "Marina sitzt mit verschränkten Armen"
5. "Marina fragt nach schriftlicher Bestätigung"
... etc.

---

### I-015: Day/Night-Cycle für Atmosphäre
**Quelle:** Antwort #56
**Status:** ✅ Angenommen (low effort)

**Beschreibung:**
Verschiedene Tageszeiten:
- Morgen: Warmes Licht
- Mittag: Neutral
- Abend: Goldenes Licht
- Nacht: Blaues Licht, Lampen an

**Aufwand:** Gering (Farbfilter/Overlay)

---

### I-016: Sound-Atmosphäre
**Quelle:** Antwort #29
**Status:** 💡 Konzept

**Beschreibung:**
Atmosphärische Sounds:
- Ventilator/Klimaanlage
- Tastaturklappern
- Telefone im Hintergrund
- Straßenlärm gedämpft

**Umsetzung:** KI-generiert (ElevenLabs o.ä.)

---

### I-017: Intro-Text mit Warnung
**Quelle:** Antwort #41
**Status:** ✅ Angenommen

**Beschreibung:**
Beim Spielstart:
- Kurze Text-Einführung in die Situation
- Eingebetteter Hinweis auf ethische Dimension
- NICHT als "Ethik-Warnung" gelabelt

---

## Szenario-Ideen

### I-S001: "Die Wahl" (Innenpolitisch)
**Status:** 💡 Post-MVP
**Beschreibung:** Spieler beeinflusst eine Wahl in einer Demokratie.

### I-S002: "Der Konzern" (Kommerziell)
**Status:** 💡 Nächstes nach MVP (Antwort #49)
**Beschreibung:** Spieler arbeitet für PR-Abteilung eines Skandal-Konzerns.
**Kandidaten:** Pharma, Öl, Tech, Tabak

### I-S003: "Kalter Krieg" (Historisch)
**Status:** 💡 Post-MVP
**Beschreibung:** Operation INFEKTION (AIDS-Desinformation der 1980er).

### I-S004: "Der Aufstand" (Bewegung)
**Status:** 💡 Post-MVP
**Beschreibung:** Spieler koordiniert Protest-Bewegung mit fragwürdigen Mitteln.

---

## Technische Ideen

### I-T001: Seed-Sharing ohne Leaderboards
**Quelle:** Antwort #17
**Status:** 💡 Konzept (kein Leaderboard!)

**Beschreibung:**
Spieler teilen Seeds, andere versuchen andere Strategien.
- KEIN Leaderboard (falscher Anreiz)
- Fokus auf Strategie-Vergleich

---

### I-T002: Replay-System
**Status:** 💡 Post-MVP
**Beschreibung:** Spiel aufzeichnen und als "Film" abspielen.

### I-T003: Modding-Support für Szenarien
**Status:** ✅ Angenommen → D-T008
**Beschreibung:** Community kann eigene Szenarien erstellen.

---

## Pädagogik-Ideen

### I-P001: Schulmodus / Schülermodus
**Quelle:** Antwort #40
**Status:** 💡 Später (eigenes Kapitel)

**Beschreibung:**
Spezielle Version für Schulen:
- Kürzere Spielzeit?
- Lehrer-Dashboard?
- Curriculare Integration?
- Altersgerechte Anpassung?

**Nächster Schritt:** Eigenes Konzept-Dokument wenn Zeit erlaubt

---

### I-P002: Wissenschaftler-Zugang
**Quelle:** Antwort #45
**Status:** 💡 Konzept

**Beschreibung:**
- Forscher können Spielmechaniken aktualisieren
- Neue Erkenntnisse einpflegen
- Spielnutzung für wissenschaftliche Zwecke
- Leads auswerten

---

## Visuelle Ideen

### I-V001: Props/Decals/Screen-Content Variation
**Quelle:** Antwort #53
**Status:** 💡 Low-Cost Visual Variation

**Beschreibung:**
Statt vieler Hero-Räume:
- Variation über Props (Gegenstände)
- Decals (Aufkleber, Poster)
- Screen-Content (was auf Monitoren läuft)
- Farbvarianten

---

### I-V002: Atmosphärische Mikro-Animationen
**Quelle:** Antwort #73
**Status:** ✅ Angenommen

**Beschreibung:**
- Monitor-Flackern
- LED-Blinken
- Partikel (Staub?)
- Sanfte Glows

**Technik:** Tween/Opacity/UV-Scroll (kein komplexes Animation-Framework nötig)

---

## Verworfene Ideen

### ❌ I-X001: Romanzen mit NPCs
**Quelle:** Antwort #24
**Grund:** Würde vom Spielkern ablenken

### ❌ I-X002: Leaderboard
**Quelle:** Antwort #17
**Grund:** Setzt falschen Anreiz (Gamification von Desinformation)

### ❌ I-X003: Multiplayer Story Mode
**Quelle:** Antwort #52
**Grund:** Zu komplex, lenkt ab

### ❌ I-X004: Animierte Übergänge
**Quelle:** Antwort #73
**Grund:** Zu aufwändig für MVP

### ❌ I-X005: Animierter News-Ticker
**Quelle:** Antwort #78
**Grund:** Klickbare Liste ist besser

---

## Ideen-Einreichung

Neue Ideen können hier hinzugefügt werden. Format:

```markdown
### I-XXX: [Titel]
**Quelle:** [Wer/Wann]
**Status:** 💡 Konzept | 🔍 In Prüfung | ✅ Angenommen | ❌ Verworfen

**Beschreibung:**
[Was ist die Idee?]

**Vorteile:**
[Warum ist das gut?]

**Nachteile/Risiken:**
[Was könnte problematisch sein?]

**Aufwand:**
[Gering | Mittel | Hoch]
```
