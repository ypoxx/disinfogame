# Story Mode - Getroffene Entscheidungen

Dokumentation aller finalen Entscheidungen für den Story Mode.

---

## Grundsatzentscheidungen

### D-001: Zwei Spielmodi mit gemeinsamer Engine
**Datum:** 2025-12-24
**Status:** ✅ Entschieden

**Entscheidung:**
Es gibt zwei separate Spielmodi, die die gleiche Engine nutzen:
- **Wargaming Mode**: Graph-basiert, für professionelle Kommunikatoren
- **Story Mode**: Narrativ, zugänglich für die breite Öffentlichkeit

**Begründung:**
- Wargaming ist ein Nischen-Tool für Profis
- Story Mode erreicht ein größeres Publikum
- Gemeinsame Engine spart Entwicklungsaufwand und sichert Konsistenz

---

### D-002: Fiktive Länder statt realer Länder
**Datum:** 2025-12-24
**Status:** ✅ Entschieden

**Entscheidung:**
Verwendung von Ebene 2 - "Erkennbar, aber fiktiv":
- Länder haben erfundene Namen (z.B. "Ostland", "Westunion")
- Spieler kann Parallelen zur Realität ziehen
- Keine explizite Benennung realer Staaten
- Ähnlich klingende Namen für Akteure (nicht identisch, rechtliche Sicherheit)

**Begründung:**
- Rechtliche Sicherheit (keine Verleumdungsklagen)
- Verhindert politische Instrumentalisierung
- Ermöglicht kreative Freiheit
- Veraltet nicht so schnell wie reale Ereignisse

**Beispiel-Mapping:**
| Fiktiv | Erkennbar als |
|--------|---------------|
| Ostland | Autoritärer Staat im Osten |
| Westunion | EU-ähnliche Allianz |
| Nordmark | Großes zentrales Land (DE) |
| Balticum | Kleine Länder mit historischem Trauma |

---

### D-003: Erweiterbares Szenario-Framework
**Datum:** 2025-12-24
**Status:** ✅ Entschieden

**Entscheidung:**
Die Engine wird so gebaut, dass sie mehrere Szenarien unterstützt:

```
CORE ENGINE (universell)
│
├─── SZENARIO-PACK: "Geopolitik" (MVP)
├─── SZENARIO-PACK: "Konzern" (nächstes)
├─── SZENARIO-PACK: "Innenpolitik" (später)
└─── SZENARIO-PACK: "Historisch" (später)
```

**Begründung:**
- Universelle Anwendbarkeit (Brasilien, Nigeria, etc.)
- Replay-Value durch verschiedene Szenarien
- Möglichkeit für Community-Szenarien
- Trennung von Mechanik (Engine) und Inhalt (Szenarien)

---

### D-004: MVP-Szenario "Ostland vs. Westunion"
**Datum:** 2025-12-24
**Status:** ✅ Entschieden

**Entscheidung:**
Das erste Szenario ist das geopolitische "Operation Spaltung":
- Spieler arbeitet für Ostland
- Ziel: Die Westunion (mehrere Länder) destabilisieren
- Kontext: Ostland führt einen Konflikt gegen einen Nachbarn

**Begründung:**
- Meiste verfügbare Daten und Fallstudien (Storm-1516, Doppelgänger)
- Hohe aktuelle Relevanz
- Klare Angreifer/Verteidiger-Struktur
- Europäisches Publikum als primäre Zielgruppe

---

### D-005: Perspektive Angreifer (mit Verteidiger-Option)
**Datum:** 2025-12-24
**Status:** ✅ Entschieden

**Entscheidung:**
- **Primär:** Spieler ist Angreifer (Propagandist)
- **Sekundär:** Verteidiger-Perspektive wird mitgedacht
- **Idee:** Nach Spielende kann man gleichen Seed als Verteidiger spielen

**Begründung:**
- "Learning by doing" ist effektiver als passive Beobachtung
- Beide Perspektiven erhöhen das Verständnis
- Seed-System ermöglicht direkten Vergleich
- Asymmetrisches Gameplay ist spannend

**Technische Voraussetzung:**
Seed-System ist bereits implementiert (SeededRandom.ts, URL-Sharing)

---

### D-006: Zielgruppe Story Mode
**Datum:** 2025-12-24
**Status:** ✅ Entschieden

**Entscheidung:**
Story Mode richtet sich an:
- Allgemeine Öffentlichkeit
- Menschen, die gerne spielen
- Interesse an edukativen/serious games
- Keine Vorkenntnisse über Desinformation nötig

---

## Tonalität & Narrativ (NEU aus Q&A 2025-12-27)

### D-007: Dokumentarisch-ernster Ton mit zynischen Momenten
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #1

**Entscheidung:**
- Grundton: Dokumentarisch-ernst
- Satirisch durchzuhalten wäre zu schwer (für Entwickler und KI)
- Erlaubt: Zynische Momente mit Augenzwinkern
- Absurde reale Situationen (Prominente mit merkwürdigen Positionen, Politiker mit absurden Aussagen) können reflektiert werden

**Nächster Schritt:**
Recherche und Beispielsammlung absurder realer Normalisierungen für Ton-Referenz

---

### D-008: Protagonist als Spielerhülle
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #2

**Entscheidung:**
- Protagonist ist primär Avatar/Hülle für Spieler-Projektion
- Motivation: "Macht seinen Job"
- Hintergrund-Optionen möglich (Unternehmer, Ex-Geheimdienstler, Start-up-Gründer)
- Hintergründe könnten Vor-/Nachteile bieten (Civilization-Stil)
- Hintergrund muss zum Meta-Narrativ passen (freiwillige Teilnahme betonen)

**Status:** Als Idee anlegen, bei Spielevariationen ausbauen

---

### D-009: Ausstiegs-Mechanik mit Hindernissen
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #3

**Entscheidung:**
- Ausstieg ist immer möglich (ethische Pädagogik)
- ABER: Je tiefer man verstrickt ist, desto schwieriger wird der Ausstieg
- Realismus: Wie bei mafiösen Strukturen
- Mögliche Kombination mit Quiz-Fragen beim Ausstieg
- "Wollen Sie wirklich aussteigen?"-Momente mit Konsequenzen

---

### D-010: NPCs als komplexe Kollegen
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #4

**Entscheidung:**
- NPCs sind Kolleginnen/Kollegen, keine bloßen Werkzeuge
- Persönlichkeit: Komplex, mit Hintergrundgeschichte
- Basis: Psychologisch valide Persönlichkeitsmodelle (z.B. Big Five)
- Aussagen sollen Tiefe durchblicken lassen

**Technische Umsetzung:**
NPC-Daten enthalten Persönlichkeits-Traits als Grundlage für Dialoggenerierung

---

### D-011: Sekundäre Konsequenzen-System
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #5

**Entscheidung:**
- Konsequenzen auf Opfer zeigen
- Sekundäre Konsequenzen implementieren:
  - Journalistin → Selbstmordversuch → Solidarisierung unter Journalisten
  - Schock-Veröffentlichungen → Demonstrationen
  - Erfolge → weitere Eskalationsmöglichkeiten
- Long-List sekundärer Konsequenzen nötig

---

### D-012: Freiwillige Teilnahme betonen
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #6

**Entscheidung:**
- Hintergründe (Erpressbarkeit) sind NICHT der primäre Motivator
- Betonung: Menschen machen das oft freiwillig, engagiert, aus Überzeugung
- Keine einfache "er ist erpressbar"-Erklärung
- Hintergründe können existieren, aber nicht im Vordergrund stehen

---

### D-013: Multiple Enden
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #7, #17

**Entscheidung:**
Bestätigte Ende-Typen:
- Totaler Sieg (Demokratie kollabiert)
- Pyrrhussieg (Ziel erreicht, aber zu hohem Preis)
- Entdeckung (Spieler wird enttarnt)
- Aussteiger (Spieler verlässt das System)
- Systemischer Misserfolg (Struktur bricht zusammen)

**Offen:** Was ist "moralische Erlösung"? → Klärung nötig

---

### D-014: Referenzen als dynamische Grundlage
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #8

**Entscheidung:**
- Reale Fälle (Storm-1516, Doppelgänger) als valide Grundlagen nutzen
- NICHT sklavisch daran halten
- Dynamisch mit Engine verquicken
- Nutzen: Gut dokumentiert, lehrreich

---

## Gameplay-Mechaniken (NEU aus Q&A 2025-12-27)

### D-015: ~5 Aktionen pro Zeiteinheit (flexibel)
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #9

**Entscheidung:**
- Circa 5 Aktionen pro Zeiteinheit als Richtwert
- ABER: Ressourcen-limitiert, nicht hart begrenzt
- Wachstum: Neue Fähigkeiten über Zeit (z.B. Bot-Fabrik ausbauen → mehr Aktionen)
- Unendlich ist schwer denkbar, aber natürliche Begrenzung durch Ressourcen

---

### D-016: Globaler Timer (~10 Jahre)
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #10

**Entscheidung:**
- Keine Tages-Einheiten, sondern globaler Timer
- Orientierung: ~10 Jahre (2 Legislaturperioden)
- Kampagnen brauchen Jahre, nicht Tage

---

### D-017: Ressourcen sichtbar + narrativ verpackt
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #11

**Entscheidung:**
- Ressourcen sind für Spieler sichtbar
- Narrativ verpackt für besseres Verständnis
- Story Mode: Keine nackten Zahlen, sondern kontextualisiert

---

### D-018: AP-System hybrid (fest + flexibel)
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #12

**Entscheidung:**
Kombination aus:
- Feste Grundaktionen
- Flexible Erweiterungen durch erworbene Fähigkeiten/Ressourcen

---

### D-019: System-Konsequenzen bei Fehlern
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #13

**Entscheidung:**
- Fehler haben System-Konsequenzen, NICHT primär Beziehungs-Konsequenzen
- Mögliche Folgen:
  - Aktionen eingeschränkt/verlangsamt
  - Akteure "büxen aus"
  - Unternehmerische Konsequenzen (wie bei Mafia/Kartellen)
- NPCs können ausgewechselt werden
- Rollen/Funktionen bleiben, neue Charaktere übernehmen
- Neue Dynamiken durch neue NPCs (einfacher/schwerer)
- NPCs sind Teil der Spieldynamik, nicht statisch

---

### D-020: Freies Speichern
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #15

**Entscheidung:**
- Speichern jederzeit möglich
- Keine Checkpoint-Einschränkungen

---

### D-021: Tutorial in erste Aktionen integriert
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #16

**Entscheidung:**
- Tutorial ist in die ersten Spielaktionen integriert
- Option zum Abschalten für erfahrene Spieler
- Kein separates Tutorial-Kapitel

---

### D-022: Replay durch andere Strategien
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #17

**Entscheidung:**
- Replay-Value durch verschiedene Strategien
- Seed-Funktion im Story Mode (abgespeckt)
- Analyse am Ende (kompakter als Wargaming)
- KEIN Leaderboard (falscher Anreiz)

---

### D-023: Die Tür → Neue Räume
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #18

**Entscheidung:**
- Tür wird später freigeschaltet (nicht am Anfang)
- Führt zu anderen Räumen
- Dient visueller Abwechslung
- Kernfrage: Wie macht man das Spiel visuell größer als nur das Büro?

---

### D-024: Mindestens 5 NPC-Charaktere
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #19

**Entscheidung:**
- Unterscheidung: NPC-Rollen/Funktionen vs. Charaktere
- Minimum: 5 Charaktere
- Mehr ist besser

---

### D-025: Entscheidungsbäume für Dialoge
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #20

**Entscheidung:**
- Dialogsystem basiert auf Entscheidungsbäumen
- Nicht zu kompliziert halten

**Offen:** Memory-Funktion → Klärung nötig

---

### D-026: Qualitative Beziehungshinweise (10+ Varianten)
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #21

**Entscheidung:**
- Nur qualitative Hinweise sichtbar ("Marina wirkt distanziert")
- Quantitative Daten im Hintergrund
- Mindestens 10 Varianten pro Beziehungszustand
- Orientierung an psychologischen Modellen

---

### D-027: NPC-Verrat möglich (nicht am Anfang)
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #22, #23

**Entscheidung:**
- NPCs können verraten (erhöht Spannung)
- NICHT direkt am Anfang
- Normale Ereignisse: Entlassung, Jobwechsel, Fehler, Erfolge
- Extreme Ereignisse (Tod, Verrat): Nur bei Edge Cases
- Muss passen, nicht willkürlich (sonst schlechtes Klischee)

---

### D-028: Keine Romanzen
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #24

**Entscheidung:**
- Keine romantischen Beziehungen zu NPCs
- Würde vom Spielkern ablenken

---

## Technische Entscheidungen

### D-T001: StoryEngineAdapter als Brücke
**Datum:** 2025-12-24
**Status:** ✅ Entschieden (aus CODEX_PLAN.md übernommen)

**Entscheidung:**
Eine Adapter-Klasse (`StoryEngineAdapter.ts`) als Fassade zwischen Story-UI und Wargaming-Engine.

**Begründung:**
- Entkopplung von UI und Engine
- Story-spezifische Methoden (advanceDay statt advanceRound)
- Narrative Transformation der Engine-Daten

---

### D-T002: Synchrone Engine-Entwicklung
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #25

**Entscheidung:**
- Spielelogik (Algorithmus, Konsequenzen, Dynamiken) synchron entwickeln
- Keine zwei separaten Spiele
- ABER: Story Mode entwickelbar ohne totale Abhängigkeit vom Wargaming

---

### D-T003: Web-Platform
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #43

**Entscheidung:**
- Web ist Hauptplattform (unabhängig, zugänglich)
- Offline-Fähigkeit nicht prioritär

---

### D-T004: Cloud Saves
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #27

**Entscheidung:**
- Cloud-Speicherung wäre gut
- Umzusetzen falls machbar

---

### D-T005: Deutsch + Englisch von Anfang an
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #28

**Entscheidung:**
- Deutsch und Englisch von Anfang an
- Leichte Übersetzbarkeit in andere Sprachen
- Gilt für UI UND alle Ausgaben/Outputs
- Architektur entsprechend anlegen (i18n)

---

### D-T006: Accessibility als Architektur-Grundlage
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #30

**Entscheidung:**
- Screen-Reader-Support: Pflicht
- Tastatur-Navigation: Pflicht
- Von Anfang an in Architektur einbauen
- Nachträglicher Einbau ist ineffizient

---

### D-T007: Open Source mit Community-Vision
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #45

**Entscheidung:**
- Spiel ist Open Source
- Offenste verfügbare Lizenzen
- Community von Experten und Enthusiasten
- MODs möglich: Szenarien, Algorithmus-Änderungen
- Wissenschaftler-Zugang für Forschung und Updates
- Spielnutzung für wissenschaftliche Zwecke ermöglichen

**TODO:** Open-Source-Checkliste erstellen

---

### D-T008: Modding-Support architektonisch vorbereiten
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #51

**Entscheidung:**
- Modding-Support ja
- Architektonisch durchdenken und vorbereiten

**TODO:** Modding-Checkliste erstellen

---

### D-T009: Kein Multiplayer (außer Wargaming)
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #52

**Entscheidung:**
- Story Mode: Kein Multiplayer
- Wargaming: Zwei Seiten möglich
- Backend für Interventionen

---

## Business & Distribution (NEU aus Q&A 2025-12-27)

### D-B001: Kostenlos mit Spenden-Option
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #44

**Entscheidung:**
- Spiel ist kostenlos
- Maximal kleine Spenden für Serverkosten

---

### D-B002: Soft Launch
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #47

**Entscheidung:**
- Soft Launch statt großer Marketing-Kampagne
- Kanäle: Presse, Bildungsnetzwerke, NGOs, Social Media
- Kein großes Marketing-Budget geplant

---

### D-B003: Vision
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #48

**Entscheidung:**
Open Source Game das:
- In der EU lokalisiert und verbreitet wird
- Beispiel für Desinformations-Verständnis und -Abwehr ist
- Zivilgesellschaftliche Aktionen inspiriert
- In Schulen und bei Profis (Wargaming) genutzt wird
- Als Beispiel für KI-Nutzung und Vibe Coding dient

---

## Pädagogik (NEU aus Q&A 2025-12-27)

### D-P001: Implizites Lernen durch Gameplay
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #37

**Entscheidung:**
- Lernen primär implizit durch Gameplay
- Ende: Analyse (Wargaming detailliert, Story Mode kompakter)
- Wargaming: Detaillierte Diagramme, Phasen-Analyse
- Story Mode: Prägnante Zusammenfassung

---

### D-P002: Reale Parallelen als Links
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #38

**Entscheidung:**
- Reale Parallelen als Links mit kurzer Beschreibung
- Architektonisch für Erweiterungen anlegen
- Leicht pflegbar gestalten

---

### D-P003: Echte Namen nur in Reflexion
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #39

**Entscheidung:**
- Im Gameplay: Ähnlich klingende, nicht identische Namen
- In End-Reflexion: Echte Akteure nennen erlaubt
- Info-Kachel in Impressum/About

---

### D-P004: Kein Lehrer-Dashboard (jetzt)
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #40

**Entscheidung:**
- Aktuell kein Lehrer-Dashboard
- Ideen-Kapitel "Schulmodus" anlegen für später

---

### D-P005: Intro-Warnung (kein Label)
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #41

**Entscheidung:**
- Beim Spielstart: Hinweis/Warnung einbauen
- NICHT als "Ethik-Warnung" labeln
- In Intro integrieren

---

## Entwicklungsprozess (NEU aus Q&A 2025-12-27)

### D-DEV001: Solo-Entwicklung mit KI
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #33, #34, #84

**Entscheidung:**
- Entwicklung: Solo + Claude Code
- Assets: KI-Tools (Suno, ElevenLabs, Bild-KI)
- Code: KI-generiert
- Kein Team
- Open Source und frei verfügbare Tools bevorzugt

---

### D-DEV002: Iterative Entwicklung
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #36

**Entscheidung:**
- Iterative Entwicklung
- Interne Tests mit Freunden

---

### D-DEV003: Prioritätsreihenfolge
**Datum:** 2025-12-27
**Status:** ✅ Entschieden
**Referenz:** Antwort #86

**Entscheidung:**
1. Mechanik
2. Narrative-Tiefe
3. Visuelle Politur

---

## Offene Entscheidungen

Siehe [OPEN_QUESTIONS.md](./OPEN_QUESTIONS.md) für noch nicht getroffene Entscheidungen.
