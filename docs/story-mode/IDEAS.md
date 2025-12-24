# Story Mode - Ideen-Sammlung

Kreative Ideen und Vorschläge, die noch nicht priorisiert oder entschieden sind.

---

## Gameplay-Ideen

### I-001: Gegenseite spielen (Same Seed)
**Quelle:** Chat 2025-12-24
**Status:** 💡 Konzept

**Beschreibung:**
Nach Abschluss des Spiels kann man denselben Seed als Verteidiger spielen.
- Gleiche Ausgangslage, gleiche Zufallsereignisse
- Aber: Man kennt jetzt die Angriffe und muss sie abwehren
- Direkter Vergleich: Wie gut war die Offensive vs. Defensive?

**Technische Machbarkeit:** ✅ Seed-System existiert bereits

**Offene Fragen:**
- Wie unterscheidet sich Verteidiger-Gameplay?
- Welche Abilities hat der Verteidiger?
- Ist das ein separater Modus oder Teil der Kampagne?

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
**Status:** 💡 Konzept

**Beschreibung:**
Das Büro entwickelt sich mit dem Spielfortschritt:

```
Phase 1: Kleines Büro (Starter)
Phase 2: Operations Center (Aufstieg)
Phase 3: Kommandoposten (Endgame)
```

**Vorteile:**
- Visueller Fortschritt motiviert
- Neue Interaktionsmöglichkeiten pro Phase
- Zeigt Eskalation der Kampagne

**Aufwand:** Mittel (neue Hintergründe, gleiche Interaktionslogik)

---

### I-004: NPC-Archetypen mit Dilemmata
**Quelle:** Chat 2025-12-24
**Status:** 💡 Konzept

**Archetypen:**
1. **Volkov** (Bot-Farm-Chef) - Loyal, aber eigene Ambitionen
2. **Marina** (Analystin) - Kompetent, aber moralisch zerrissen
3. **Der Direktor** (Boss) - Fordert Ergebnisse, kennt keine Gnade
4. **Aleksei** (Rivale) - Will deinen Job, sabotiert subtil
5. **Der Journalist** (Bedrohung) - Recherchiert über eure Operationen

**Dilemma-Beispiel:**
Marina: "Ich habe Zugang zu einem westlichen Journalisten. Er würde für uns arbeiten. Aber er hat Familie."
- Option A: Rekrutieren (effektiv, aber moralisch fragwürdig)
- Option B: In Ruhe lassen (sicher, aber verpasste Chance)
- Option C: Familie als Druckmittel (extrem effektiv, aber dunkel)

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

**Template-Beispiel:**
```
"Die Medien in {country} berichten {sentiment} über {topic}"
Variables: country=[Nordmark, Gallia, Balticum], sentiment=[kritisch, neutral, positiv], topic=[Sanktionen, Energiepreise]
= 3 × 3 × 2 = 18 Varianten aus 1 Template
```

---

### I-006: Chaos-Level im Büro
**Quelle:** Analyse 2025-12-24
**Status:** 💡 Kosmetisch

**Beschreibung:**
Das Büro wird visuell chaotischer bei steigendem Stress:
- Anfang: Aufgeräumt
- Mitte: Papiere stapeln sich
- Ende: Totales Chaos (oder penibel aufgeräumt bei Paranoia)

**Aufwand:** Gering (CSS-Änderungen, Overlay-Elemente)

---

### I-007: News-Ticker mit echten Konsequenzen
**Quelle:** Bestehende UI
**Status:** 💡 Erweiterung

**Beschreibung:**
Der News-Ticker zeigt nicht nur Flavor, sondern:
- Reaktionen auf Spieleraktionen ("Skandal um BILD-Berichterstattung")
- Warnsignale ("Fact-Checker-Initiative gestartet")
- Konsequenzen ("Vertrauen in Experten sinkt landesweit")

---

### I-008: Post-Game Debriefing
**Quelle:** Pädagogisches Konzept
**Status:** 💡 Feature

**Beschreibung:**
Nach Spielende:
1. Zusammenfassung der Kampagne
2. Analyse: "Das hast du getan" mit realen Parallelen
3. Reflexionsfragen: "Was hättest du anders machen können?"
4. Ressourcen: Links zu echten Fact-Checking-Organisationen

---

## Szenario-Ideen

### I-S001: "Die Wahl" (Innenpolitisch)
**Beschreibung:** Spieler beeinflusst eine Wahl in einer Demokratie.
**Universell anwendbar:** Ja (jedes Land mit Wahlen)

### I-S002: "Der Konzern" (Kommerziell)
**Beschreibung:** Spieler arbeitet für PR-Abteilung eines Skandal-Konzerns.
**Beispiele:** Pharma, Öl, Tabak, Tech

### I-S003: "Kalter Krieg" (Historisch)
**Beschreibung:** Operation INFEKTION (AIDS-Desinformation der 1980er).
**Vorteil:** Abgeschlossen, dokumentiert, rechtlich unbedenklich

### I-S004: "Der Aufstand" (Bewegung)
**Beschreibung:** Spieler koordiniert Protest-Bewegung mit fragwürdigen Mitteln.
**Moral:** Sind die Mittel gerechtfertigt, wenn das Ziel "gut" ist?

---

## Technische Ideen

### I-T001: Seed-Sharing mit Leaderboards
**Beschreibung:** Spieler teilen Seeds, andere versuchen bessere Ergebnisse.
**Technische Basis:** API-Funktionen existieren bereits (getPopularSeeds)

### I-T002: Replay-System
**Beschreibung:** Spiel aufzeichnen und als "Film" abspielen.
**Nutzen:** Analyse, Lernmaterial, Content-Creation

### I-T003: Modding-Support für Szenarien
**Beschreibung:** Community kann eigene Szenarien erstellen.
**Technische Basis:** JSON-basierte Konfiguration bereits vorhanden

---

## Verworfene Ideen

*(Hier landen Ideen, die diskutiert und abgelehnt wurden, mit Begründung)*

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
