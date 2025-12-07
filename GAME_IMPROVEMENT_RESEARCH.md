# Forschungsbericht: Wie das Desinformation Network Spiel deutlich besser werden kann

## Executive Summary

Basierend auf einer umfassenden Recherche zu Spieledesign-Prinzipien legendärer Entwickler (Will Wright, Sid Meier), klassischen Tiefenspielen (Dwarf Fortress, Civilization), Emergenz-Theorie, Flow-Psychologie und moralischen Spielen (Papers Please, This War of Mine) präsentiert dieser Bericht transformative Verbesserungsvorschläge.

**Kernthese:** Das Spiel hat bereits eine exzellente Grundlage. Um wirklich einzigartig zu werden, sollte es sich auf **emergente Systeme**, **bedeutungsvolle Entscheidungen** und **emotionale Realität** konzentrieren – nicht auf mehr Features.

---

## Teil 1: Erkenntnisse aus der Recherche

### 1.1 Will Wright's Philosophie: "Emergenz entdecken, nicht konstruieren"

> "Emergenz ist nichts, was man konstruiert. Es ist etwas, das man entdeckt." - Will Wright

**Kernprinzipien:**
- **Zwei Computer:** "Als Designer arbeitest du mit zwei Computern: dem elektronischen vor dir, und dem Gehirn des Spielers. Das zweite ist weitaus komplexer."
- **Möglichkeitsräume:** Einfache Regeln + Spielerelemente = komplexe Designs
- **Bottom-Up Design:** Nicht top-down skripten, sondern Systeme beobachten und iterieren
- **Inspiration Go:** "Einfache Regeln, aber die Strategien darin sind so komplex"

**Relevanz für unser Spiel:**
Das aktuelle System hat bereits emergente Eigenschaften (Trust-Propagation, Netzwerkeffekte). Aber es gibt Potenzial für **viel mehr Emergenz** durch tiefere Systeminteraktionen.

---

### 1.2 Sid Meier: "Spiele sind eine Reihe interessanter Entscheidungen"

> "Es ist einfacher zu betrachten, was KEINE interessante Entscheidung ist: Wenn ein Spieler immer die erste von drei Optionen wählt, ist es wahrscheinlich keine interessante Wahl." - Sid Meier

**Kernprinzipien:**
- **Interessante Entscheidungen:** Keine klaren "besten" Optionen, sondern Trade-offs
- **Feedback ist entscheidend:** "Das Schlimmste ist, wenn das Spiel einfach weiterläuft. Zumindest ein Sound, der sagt: Ich habe gehört, was du gesagt hast."
- **Finde den Spaß zuerst:** Viel Prototyping, viel Iteration
- **Realismus niemals auf Kosten von Spaß**

**Kritische Analyse unseres Spiels:**
- ✅ Entscheidungen vorhanden (welche Fähigkeit, welches Ziel)
- ⚠️ **Problem:** Es gibt oft eine "optimale" Strategie → weniger interessant
- ⚠️ **Problem:** Feedback könnte dramatischer sein

---

### 1.3 Dwarf Fortress: Tiefe über Grafik

> "Dwarf Fortress ist das tiefste, komplexeste Simulations-Spiel, das je gemacht wurde. Ein Kaninchenbau, der niemals zu enden scheint."

**Kernprinzipien:**
- **Keine HP-Punkte:** Alles ist Teil eines komplexen Körpermodells
- **"Zero-Player Strategy Game":** Geschichte entsteht aus der Simulation
- **Tiefe schlägt Breite:** Lieber ein System perfekt als zehn oberflächlich
- **Uintuitiv ist OK:** Komplexität kann erlernt werden, wenn sie sinnvoll ist

**Relevanz:**
Das Desinformation-Spiel könnte ähnlich "unerwartet tief" werden – z.B. durch echte psychologische Modelle statt vereinfachter Trust-Werte.

---

### 1.4 Papers Please & This War of Mine: Moralische Dilemmas

> "Moralischer Konflikt und die Erfahrung, schwierige Entscheidungen in extremen Situationen zu treffen, funktioniert wie Kernenergie für den Motor, der die Erfahrung antreibt."

**Design-Geheimnisse von This War of Mine:**
- Inventar heißt "unsere Sachen" → emotionale Bindung
- Kein Tutorial → Desorientierung wie im echten Krieg
- Ambige Ausgänge → keine klare "beste" Wahl
- Designer-Desensibilisierung → regelmäßig frische Perspektiven nötig

**Papers Please Prinzip:**
- "Wir werden fast gezwungen, unethisch zu handeln, weil wir sonst nicht überleben würden"
- Stress + Demoralisierung + Engagement = kraftvolle Erfahrung

**Für unser Spiel:**
Aktuell ist der Spieler der "Böse" ohne echte moralische Kosten. Was wenn es **persönliche Konsequenzen** gäbe?

---

### 1.5 Flow-Theorie (Csikszentmihalyi)

```
HERAUSFORDERUNG
      ↑
      │    ANGST
      │     ╱
      │   ╱
      │ ╱    FLOW-KANAL
      ├──────────────────→
      │ ╲
      │   ╲
      │     ╲
      │    LANGEWEILE
      ↓
              FÄHIGKEIT →
```

**Kernprinzipien:**
- **Microflow:** Intensive, kurze Erlebnisse (jeder Zug)
- **Macroflow:** Schwierigkeitskurve über das gesamte Spiel
- **Balance:** Nicht zu leicht (Langeweile), nicht zu schwer (Frustration)

**Analyse unseres Spiels:**
- ⚠️ Die ersten Runden könnten langweilig sein (zu leicht)
- ⚠️ Die letzten Runden könnten frustrierend sein (Zeitdruck + starke Gegner)
- ✅ Das 32-Runden-Limit schafft Dringlichkeit

---

### 1.6 Compulsion Loops: "Nur noch eine Runde"

> "Der Drang, nur noch eine Runde zu spielen, ist sehr stark. Aber die Befriedigung lässt nach und Unruhe setzt ein."

**Das Turducken-Prinzip:**
```
[Mikro-Erlebnis] → [Progression] → [Epische Narrative]
     └─ jeder Zug      └─ jede Runde     └─ Gesamtspiel
```

**Formel:**
1. Spieler-Effizienz sinkt (Trust erholt sich, Gegner spawnen)
2. Klare Lösung wird angeboten (neue Fähigkeit, Strategie)
3. Wiederholen

**Für unser Spiel:**
Die Grundstruktur existiert, aber könnte verstärkt werden durch **sichtbarere Progression** und **überraschendere Belohnungen**.

---

### 1.7 Roguelike-Prinzipien: Bedeutungsvoller Misserfolg

**Kernprinzipien:**
- **Permadeath:** Jede Entscheidung zählt, weil sie permanent ist
- **Prozedurale Generierung:** Kein Spiel wie das andere
- **Belohnung von Meisterschaft:** Skill > Auswendiglernen

**Für unser Spiel:**
- ⚠️ Aktuell: Undo-System macht Entscheidungen weniger bedeutsam
- 💡 Idee: **Hardcore-Modus** ohne Undo, mit Permadeath-Feeling

---

### 1.8 Systems Thinking durch Spiele

> "Spiele sind essentielle Systeme: interaktive, vereinfachte Modelle der realen Welt. Sie geben uns einen sicheren Raum, in dem wir versuchen können, eine Welt zu verstehen, die unvorhersehbar funktioniert."

**Das CAS-Framework (Complex Adaptive Systems):**
1. **Adaptivität** entsteht aus einfachen Regeln
2. **Netzwerkstruktur** hierarchisch präsentieren
3. **Spieler konstruieren** das System selbst
4. **Schnelle Simulationen** zum Validieren

**Relevanz:**
Unser Spiel ist bereits ein CAS. Aber die Spieler könnten **mehr Einblick** in die Systemdynamiken bekommen.

---

## Teil 2: Transformative Verbesserungsvorschläge

### Kategorie A: EMERGENZ verstärken (Will Wright Prinzipien)

#### A1. "Echte" Akteur-Persönlichkeiten
**Aktuell:** Akteure haben Basiswerte (Trust, Resilience, Emotional State)
**Vorschlag:** Gib jedem Akteur ein **Persönlichkeitsmodell** mit:
- Beziehungen zu anderen Akteuren (Freund/Feind/Neutral)
- Erinnerung an vergangene Aktionen ("wurde von X angegriffen")
- Eigene Ziele ("will Einfluss maximieren")

**Emergenz:** Akteure könnten beginnen, **aufeinander zu reagieren**:
- Wenn Mainstream-Media Tabloid angreift → Tabloid schlägt zurück
- Wenn Professor 3x angegriffen wird → sucht Allianz mit Scientist

```
VORHER: Statische Entitäten
NACHHER: Lebendiges Ökosystem mit eigenen Dynamiken
```

#### A2. Cascading Consequences System
**Vorschlag:** Jede Aktion hat **Langzeit-Konsequenzen**:
- "Scandalize" auf Professor → 6 Runden später: Professor veröffentlicht Gegenstudie
- "Astroturfing" zu oft → Journalisten werden misstrauisch
- Trust unter 20% → Akteur beginnt verzweifelte Aktionen

**Emergenz:** Spieler müssen lernen, wie das System **auf lange Sicht** reagiert.

#### A3. Information als Währung
**Aktuell:** Nur Trust wird manipuliert
**Vorschlag:** Füge **Information/Wissen** als zweite Dimension hinzu:
- Akteure "wissen" Dinge über andere Akteure
- Manipulation kann enthüllt oder verdeckt sein
- Wenn enthüllt → Backlash-Effekt

**Emergenz:** Strategie zwischen "offener Attacke" vs "subtile Manipulation"

---

### Kategorie B: INTERESSANTE ENTSCHEIDUNGEN (Sid Meier Prinzipien)

#### B1. Echte Trade-offs bei jeder Fähigkeit
**Problem:** Aktuell gibt es oft eine "beste" Wahl
**Vorschlag:** Jede Fähigkeit hat **versteckte Kosten**:

| Fähigkeit | Offensichtlicher Nutzen | Versteckte Kosten |
|-----------|-------------------------|-------------------|
| Scandalize | -25% Trust | +40% Aufmerksamkeit auf dich |
| Astroturfing | Breiter Effekt | Risiko der Entdeckung |
| Conspiracy | Starke Wirkung | Macht Faktenchecker 2x wahrscheinlicher |

**Ergebnis:** Keine Fähigkeit ist "immer gut" → jede Wahl ist interessant

#### B2. Fraktionen-System mit echten Konsequenzen
**Vorschlag:** Der Spieler gehört implizit zu einer "Fraktion":
- Ausländische Macht? → Nationalistische Narrative sind schwächer
- Wirtschaftsinteressen? → Umweltthemen funktionieren nicht
- Ideologie? → Gegenseite ist resilienter

**Ergebnis:** Spieler muss mit den Grenzen seiner Identität spielen

#### B3. Moralische Grauzone einführen
**Aktuell:** Spieler ist eindeutig der "Böse"
**Vorschlag:** Füge **ambige Szenarien** hinzu:
- Nachricht: "Professor hat tatsächlich Daten manipuliert"
- Entscheidung: Enthüllst du es? (hilft dir, schadet der Wahrheit)
- Nachricht: "Aktivistengruppe verwendet deine Taktiken für guten Zweck"

**Ergebnis:** Spieler reflektiert über Mittel vs. Zweck

---

### Kategorie C: EMOTIONALE WIRKUNG (This War of Mine Prinzipien)

#### C1. "Gesichter" statt Abstraktionen
**Aktuell:** "Mainstream Media" ist ein abstraktes Icon
**Vorschlag:** Gib jedem Akteur:
- Einen Namen ("Maria Bergmann, Chefredakteurin")
- Eine kurze Hintergrundgeschichte
- Familie/Beziehungen

**Effekt:** Angriffe fühlen sich persönlicher an

#### C2. Kollateralschaden sichtbar machen
**Vorschlag:** Nach jeder Aktion:
- Zeige Konsequenzen für echte Menschen
- "Nach der Skandalisierung erhält Dr. Müller Morddrohungen"
- "Die Fact-Checker sind überarbeitet, einer kündigt"

**Effekt:** Das Spiel lehrt durch emotionale Erfahrung, nicht nur Mechanik

#### C3. Langzeit-Epilog
**Vorschlag:** Nach dem Spiel:
- Zeige, was 5/10/20 Jahre später passiert
- "Die Gesellschaft ist dauerhaft gespalten"
- "Vertrauen in Experten erholte sich nie"

**Effekt:** Spieler sieht die Tragweite seiner Entscheidungen

---

### Kategorie D: TIEFE über BREITE (Dwarf Fortress Prinzipien)

#### D1. Detailliertes Psychologie-Modell
**Aktuell:** Emotional State ist ein einfacher Wert (0-1)
**Vorschlag:** Echtes psychologisches Modell:
```
Akteur-Psyche:
├── Kognitive Dissonanz (steigt bei widersprüchlichen Infos)
├── Confirmation Bias (Tendenz, eigene Meinung zu bestätigen)
├── Vertrauens-Netzwerk (wen glaubt er?)
├── Aufmerksamkeits-Kapazität (begrenzt)
└── Emotional Regulation (wie schnell erholt er sich?)
```

**Emergenz:** Komplexere, realistischere Reaktionen

#### D2. Informations-Ökologie
**Vorschlag:** Modelliere, wie Information tatsächlich fließt:
- Geschwindigkeit basiert auf Medium
- Viralität basiert auf emotionalem Gehalt
- Halbwertszeit von Nachrichten
- "Agenda Setting" verändert, worüber gesprochen wird

#### D3. Gesellschaftliche Meta-Metriken
**Vorschlag:** Tracke Makro-Auswirkungen:
- Polarisations-Index (existiert bereits ✅)
- **Neu:** Epistemic Health (kann die Gesellschaft noch Wahrheit erkennen?)
- **Neu:** Democratic Resilience (funktionieren Institutionen noch?)
- **Neu:** Social Cohesion (halten die Menschen zusammen?)

---

### Kategorie E: REPLAYABILITY (Roguelike Prinzipien)

#### E1. Verschiedene Spielmodi
| Modus | Beschreibung |
|-------|--------------|
| **Tutorial** | Geführte Einführung (existiert ✅) |
| **Klassisch** | Standard-Spiel |
| **Hardcore** | Kein Undo, härtere Gegner |
| **Sandbox** | Keine Win-Condition, freies Experimentieren |
| **Scenario** | Historische Szenarien (US-Wahl 2016, Brexit...) |
| **Verteidiger** | Spiele als Fact-Checker gegen KI |

#### E2. Prozedural generierte Netzwerke
**Aktuell:** 8 fixe Akteure
**Vorschlag:**
- **Grundgerüst** bleibt (Media, Experts, Lobbies, Orgs)
- **Details** werden generiert (Namen, Beziehungen, Startpositionen)
- **Events** sind halb-zufällig

#### E3. Meta-Progression (Roguelite)
**Vorschlag:** Zwischen Spielen:
- Schalte neue Fähigkeiten frei
- Entdecke "geheime" Taktiken
- Sammle "Erkenntnisse" über Desinformation

---

### Kategorie F: FLOW-OPTIMIERUNG

#### F1. Dynamische Schwierigkeit
**Problem:** Frühe Runden zu leicht, späte zu schwer
**Vorschlag:**
- **Automatische Anpassung:** Wenn Spieler dominiert → frühere Defender-Spawns
- **Wenn Spieler kämpft** → Event-Hilfe, Resource-Bonus

#### F2. Micro-Rewards verstärken
**Vorschlag:**
- Jede erfolgreiche Aktion → visuelles Firework
- Kettenkombos → Bonus-Sound
- Neue Tiefstände → dramatische Animation

#### F3. "One More Turn" Hooks
**Vorschlag:**
- Ende jeder Runde: "Vorschau" auf nächste Möglichkeiten
- Cliffhanger-Events: "Wird der Professor zurückschlagen?"
- Fortschritts-Teaser: "Noch 2 Akteure bis zum Sieg"

---

## Teil 3: Priorisierte Roadmap

### Phase 1: Quick Wins (Sofort umsetzbar)
1. **B1: Trade-offs einführen** - Versteckte Kosten für Fähigkeiten
2. **F2: Micro-Rewards** - Besseres visuelles/akustisches Feedback
3. **C2: Kollateralschaden** - Narrative Konsequenzen anzeigen

### Phase 2: Mittelfristig (Systemerweiterungen)
4. **A2: Cascading Consequences** - Langzeit-Effekte
5. **D3: Meta-Metriken** - Epistemic Health etc.
6. **E1: Spielmodi** - Hardcore, Sandbox, Verteidiger

### Phase 3: Transformativ (Fundamental neu)
7. **A1: Akteur-Persönlichkeiten** - Lebendiges Ökosystem
8. **D1: Psychologie-Modell** - Echte kognitive Simulation
9. **E2: Prozedurale Generierung** - Unendliche Variabilität

---

## Teil 4: Design-Mantras

Basierend auf der Recherche, hier die wichtigsten Prinzipien:

### Von Will Wright:
> **"Erschaffe Möglichkeitsräume, keine Erlebnisse"**

### Von Sid Meier:
> **"Jede Entscheidung muss ein Trade-off sein"**

### Von Dwarf Fortress:
> **"Tiefe schlägt Breite. Immer."**

### Von This War of Mine:
> **"Emotionale Realität schafft Bedeutung"**

### Von Flow-Theorie:
> **"Halte den Spieler zwischen Angst und Langeweile"**

### Von Roguelikes:
> **"Permanenz macht Entscheidungen bedeutsam"**

---

## Quellen

### Will Wright
- [MasterClass: Will Wright Teaches Game Design](https://www.masterclass.com/classes/will-wright-teaches-game-design-and-theory)
- [Professor Nerdster: Will Wright on Game Design](https://professornerdster.com/will-wright-on-game-design/)
- [Flylib: Interview with Will Wright](https://flylib.com/books/en/4.479.1.114/1/)

### Sid Meier
- [GDC 2012: Sid Meier on Interesting Decisions](https://www.gamedeveloper.com/design/gdc-2012-sid-meier-on-how-to-see-games-as-sets-of-interesting-decisions)
- [Time: Sid Meier Memoir](https://time.com/5887546/sid-meier-memoir-gaming/)
- [The Gamer: Sid Meier Interview](https://www.thegamer.com/sid-meier-interview/)

### Dwarf Fortress & Depth
- [Dwarf Fortress Wikipedia](https://en.wikipedia.org/wiki/Dwarf_Fortress)
- [Game Developer: Q&A with Tarn Adams](https://www.gamedeveloper.com/design/q-a-dissecting-the-development-of-i-dwarf-fortress-i-with-creator-tarn-adams)
- [Stuyspec: Dwarf Fortress and Its Influence](https://stuyspec.com/article/dwarf-fortress-and-its-influence-on-gaming)

### Emergenz
- [Wikipedia: Emergent Gameplay](https://en.wikipedia.org/wiki/Emergent_gameplay)
- [Game Design Skills: Emergent Gameplay Guide](https://gamedesignskills.com/game-design/emergent-gameplay/)
- [Number Analytics: Emergence in Game Design](https://www.numberanalytics.com/blog/emergence-in-game-design-deep-dive)

### Moralische Spiele
- [SAGE Journals: This War of Mine](https://journals.sagepub.com/doi/full/10.1177/1555412017725996)
- [Game Developer: This War of Mine's Emotional Impact](https://www.gamedeveloper.com/design/the-secrets-behind-i-this-war-of-mine-i-s-emotional-impact)
- [Benjamin Hanussek: Papers Please as Cynical Serious Game](https://bhanussek.com/exercises-in-immorality-papers-please-as-a-cynical-serious-game/)

### Flow & Motivation
- [Medium: Csikszentmihalyi's Flow Theory](https://medium.com/@icodewithben/mihaly-csikszentmihalyis-flow-theory-game-design-ideas-9a06306b0fb8)
- [Game Developer: Flow Applied to Game Design](https://www.gamedeveloper.com/design/the-flow-applied-to-game-design)

### Compulsion Loops
- [Game Developer: Compulsion Loop is Withdrawal-Driven](https://www.gamedeveloper.com/design/compulsion-loop-is-withdrawal-driven)
- [GDC Vault: Turducken Method](https://gdcvault.com/play/1014958/The-Turducken-Method-of-Game)

### Roguelikes
- [Envato Tuts+: Key Design Elements of Roguelikes](https://code.tutsplus.com/the-key-design-elements-of-roguelikes--cms-23510a)
- [LitRPG Reads: Permadeath and Procedural Generation](https://litrpgreads.com/blog/permadeath-and-procedural-generation-the-heart-of-roguelike-games)

### Systems Thinking
- [WILDLABS: Playing with Complexity](https://wildlabs.net/article/playing-complexity-games-and-systems-thinking)
- [Nature: Gaming for Change](https://www.nature.com/articles/s41599-025-04990-x)
- [SAGE: Simulation Games for Complex Systems](https://journals.sagepub.com/doi/10.1177/1046878118768858)

---

*Erstellt: 2025-12-07*
*Basierend auf Web-Recherche zu Spieledesign-Prinzipien*
