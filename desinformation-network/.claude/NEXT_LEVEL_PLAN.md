# Next Level Plan: Das Spiel "viel viel viel besser" machen

> **Erstellt:** 2025-12-07
> **Status:** Planung
> **Ziel:** Von Prototyp zu poliertem Bildungsspiel

---

## Aktuelle Situation

**Bereits implementiert (Sprints 1-4):**
- ✅ Funktionierendes Gameplay mit 18 Abilities
- ✅ Eskalationssystem mit 6 Leveln
- ✅ Mehrstufige Victory-Conditions
- ✅ Defensive Akteure mit Auto-Trigger
- ✅ Post-Game Analyse mit Lernmodul
- ✅ Touch-Support, Zoom/Pan, Keyboard-Shortcuts
- ✅ Tutorial-System

**Was noch fehlt für ein wirklich gutes Spiel:**
- ❌ Kein Sound/Musik
- ❌ Keine speicherbaren Spielstände
- ❌ Nur ein Spielmodus (Attacker)
- ❌ Statisches Szenario (keine Level)
- ❌ Keine soziale Komponente (Leaderboards)
- ❌ Kein News-Ticker UI
- ❌ Eingeschränkte Visualisierung

---

## Phase 1: Produktionsreife (2-3 Wochen)

### 1.1 Sound & Audio 🔊
**Warum:** Audio macht 50% des "Feel" eines Spiels aus.

```
/public/audio/
├── sfx/
│   ├── ability_activate.mp3      # Whoosh-Sound bei Aktivierung
│   ├── ability_impact.mp3        # Impact bei Trust-Änderung
│   ├── round_end.mp3             # Tick-Sound
│   ├── escalation_up.mp3         # Warnsignal
│   ├── victory.mp3               # Triumphmusik
│   ├── defeat.mp3                # Niederlagenmusik
│   ├── defensive_spawn.mp3       # Alert-Sound
│   ├── notification.mp3          # UI-Feedback
│   └── hover.mp3                 # Subtiles Hover
├── music/
│   ├── menu_ambient.mp3          # Atmosphärisches Hauptmenü
│   ├── gameplay_tension.mp3      # Dynamisch je nach Eskalation
│   └── analysis_reflect.mp3      # Ruhig für Reflexion
```

**Implementation:**
- Howler.js für Audio-Management
- Lautstärke-Slider in Settings
- Dynamische Musik basierend auf Eskalation

### 1.2 News-Ticker UI 📰
**Warum:** Events fühlen sich aktuell unsichtbar an.

```tsx
// Scrollender News-Ticker am unteren Bildschirmrand
<NewsTicker>
  <TickerItem type="event">
    🔴 BREAKING: Viral claim spreads across social media...
  </TickerItem>
  <TickerItem type="alert">
    ⚠️ Escalation Level increased to 3
  </TickerItem>
</NewsTicker>
```

- Breaking News Animation bei Events
- Archiv der letzten Meldungen
- Klickbare Links zu Erklärungen

### 1.3 Speicherstand-System 💾
**Warum:** Nutzer wollen Fortschritt behalten.

```typescript
// LocalStorage + Optional Cloud-Sync
type SaveGame = {
  id: string;
  name: string;
  timestamp: number;
  gameState: GameState;
  screenshot?: string;
};
```

- Auto-Save nach jeder Runde
- 3 manuelle Slots
- Cloud-Sync mit Account (optional)

### 1.4 Verbessertes Onboarding 🎓
**Warum:** Aktuelles Tutorial erklärt nicht genug.

- **Interaktives Tutorial:** Spieler muss tatsächlich klicken
- **Tooltips bei Hover:** Erklärungen für jede UI-Komponente
- **"Warum?"-Button:** Erklärt Spielmechaniken im Kontext
- **Sandbox-Modus:** Unbegrenzte Ressourcen zum Experimentieren

---

## Phase 2: Content-Expansion (3-4 Wochen)

### 2.1 Szenario-System 🗺️
**Warum:** Ein Szenario wird langweilig.

```typescript
type Scenario = {
  id: string;
  name: string;
  description: string;
  region: 'germany' | 'usa' | 'global' | 'custom';
  topic: 'election' | 'health' | 'climate' | 'war';
  difficulty: 1 | 2 | 3;
  specialRules: SpecialRule[];
  actors: ActorDefinition[];
  events: GameEvent[];
  objectives: Objective[];
};
```

**Vorgeschlagene Szenarien:**

| Szenario | Region | Thema | Schwierigkeit |
|----------|--------|-------|---------------|
| "Die Bundestagswahl" | 🇩🇪 | Election | ⭐⭐ |
| "Pandemic Response" | 🌍 | Health | ⭐⭐⭐ |
| "Climate Denial Inc." | 🇺🇸 | Climate | ⭐⭐ |
| "Baltic Tensions" | 🇪🇺 | Geopolitics | ⭐⭐⭐ |
| "Vaccine Wars" | 🌍 | Health | ⭐⭐⭐ |
| "The Brexit Playbook" | 🇬🇧 | Politics | ⭐⭐ |

### 2.2 Kampagnen-Modus 🎯
**Warum:** Zusammenhängende Geschichte ist fesselnder.

```
Kampagne: "Russlands Playbook"
├── Level 1: Erste Schritte (Tutorial)
├── Level 2: Bot-Armee aufbauen
├── Level 3: Media Infiltration
├── Level 4: Wahlbeeinflussung
└── Level 5: Die große Offensive
```

- Fortschritt wird gespeichert
- Ressourcen übertragen sich zwischen Leveln
- Story-Elemente zwischen Missionen
- Freischaltbare Abilities

### 2.3 Erweiterte Ability-Palette 🎲

**Neue Kategorien:**

| Kategorie | Neue Abilities |
|-----------|----------------|
| Deepfakes | AI Video, Voice Clone, Face Swap |
| Hacking | Data Breach, Platform Access, Credential Theft |
| Physical | Rally Organization, Print Propaganda, Street Art |
| Legal | SLAPP Suit, GDPR Complaint, Platform TOS Abuse |

### 2.4 Dynamische Akteur-Netzwerke 🕸️

Aktuell: Statische Positionen
Neu: **Emergentes Verhalten**

```typescript
type ActorBehavior = {
  connectionFormation: 'proximity' | 'ideology' | 'random';
  trustPropagation: 'linear' | 'exponential' | 'threshold';
  polarizationDynamics: boolean;
  echoChambersEnabled: boolean;
};
```

- Akteure bilden Echo-Kammern
- Vertrauen "crystallisiert" (schwerer zu ändern)
- Netzwerk-Topologie verändert sich

---

## Phase 3: Game Modes (4-5 Wochen)

### 3.1 Defender-Modus 🛡️
**Warum:** Anderer Blickwinkel = tieferes Verständnis.

```
Du spielst als: Fact-Checker / Media Literacy Org / Regulator

Ziel: Netzwerk-Trust über 60% halten für 24 Runden

Abilities:
- Fact-Check publizieren
- Prebunking-Kampagne
- Media Literacy Workshop
- Plattform-Regulation
- Bot-Netzwerk aufdecken
```

- AI-Gegner wählt Attacker-Strategien
- Schwierigkeitsgrade für AI
- Lehrreich: Was funktioniert gegen Desinformation?

### 3.2 Versus-Modus (Asymmetric Multiplayer) ⚔️
**Warum:** PvP = höchste Wiederspielbarkeit.

```
Spieler 1: Attacker     vs     Spieler 2: Defender
- 100 Ressourcen               - 80 Ressourcen
- 18 Offensive Abilities       - 12 Defensive Abilities
- Ziel: Trust < 40%            - Ziel: Trust > 60%
```

- Echtzeit oder Rundenbasiert
- Matchmaking (optional)
- Ranked Mode mit ELO

### 3.3 Sandbox-Modus 🧪
**Warum:** Experimentieren ohne Druck.

- Unbegrenzte Ressourcen
- Alle Abilities freigeschaltet
- Zeit manipulieren (Slow-Mo, Speed-Up)
- Netzwerk-Editor
- Custom Scenarios erstellen

---

## Phase 4: Social & Gamification (2-3 Wochen)

### 4.1 Leaderboards 🏆
```typescript
type LeaderboardEntry = {
  playerId: string;
  playerName: string;
  score: number;
  scenario: string;
  victoryType: VictoryType;
  rounds: number;
  timestamp: Date;
};
```

- Globale Rangliste
- Wöchentliche Challenges
- Freunde-Vergleich
- Scenario-spezifische Boards

### 4.2 Achievements 🎖️
```
🥇 "First Blood" - Ersten Akteur unter 40% bringen
🤖 "Skynet" - Bot-Armee mit 1000+ Bots erstellen
🎓 "Enlightened" - Alle Reflexionsfragen beantworten
🛡️ "Defender of Truth" - Defender-Modus auf Hard gewinnen
⚡ "Blitzkrieg" - Sieg in unter 16 Runden
🎭 "Master of Deception" - Complete Victory ohne Eskalation
```

### 4.3 Sharing 📤
- Screenshot mit Stats teilen
- Replay als Video exportieren
- "Challenge a Friend" mit Seed-Code
- Social Media Integration

### 4.4 Daily Challenges 📅
- Täglich neues Szenario
- Alle spielen mit gleichem Seed
- Vergleich mit Community
- Streak-Belohnungen

---

## Phase 5: Educational Platform (4-6 Wochen)

### 5.1 Interaktive Enzyklopädie 📚
```
Enzyklopädie
├── Techniken (sortierbar, filterbar)
│   ├── Emotional Appeal
│   │   ├── Beschreibung
│   │   ├── Wissenschaftliche Grundlage
│   │   ├── Real-World Beispiele (mit Quellen)
│   │   ├── Erkennungsmerkmale
│   │   ├── Gegenstrategien
│   │   └── Quiz zur Selbstprüfung
│   └── ...
├── Fallstudien
│   ├── 2016 US-Wahl
│   ├── Brexit-Kampagne
│   ├── COVID-Desinformation
│   └── Ukraine-Krieg
├── Glossar
└── Weiterführende Ressourcen
```

### 5.2 Kurs-Integration 🎓
- LTI-Integration für Moodle/Canvas
- Lehrmaterialien für Pädagogen
- Arbeitsblätter exportieren
- Fortschritts-Tracking für Klassen
- Zertifikate nach Abschluss

### 5.3 Research-Mode 🔬
- Anonyme Gameplay-Daten sammeln
- Welche Strategien funktionieren?
- Publikation von Erkenntnissen
- Kollaboration mit Universitäten

---

## Technische Verbesserungen

### Performance
- [ ] WebGL-Renderer für Canvas (1000+ Nodes)
- [ ] Web Worker für GameState-Berechnungen
- [ ] Lazy Loading für Szenarien

### Code-Qualität
- [ ] Unit-Tests für GameState (Jest)
- [ ] E2E-Tests (Playwright)
- [ ] Zustand Store konsolidieren
- [ ] Type-Safety verbessern

### Accessibility
- [ ] Screen Reader Support
- [ ] Farbenblind-Modus
- [ ] Keyboard-only spielbar
- [ ] Reduzierte Bewegung Option

---

## Priorisierte Roadmap

### Sofort starten (Sprint 5): Production Polish
1. **Sound-System** - Größter Impact für "Feel"
2. **News-Ticker** - Events sichtbar machen
3. **Speicherstände** - Grundfunktion

### Danach (Sprint 6-7): Content
4. **3 neue Szenarien** - Wiederspielwert
5. **Kampagnen-Modus** - Narrative

### Mittelfristig (Sprint 8-10): Game Modes
6. **Defender-Modus** - Perspektivwechsel
7. **Versus-Modus** - Replayability

### Langfristig (Sprint 11+): Platform
8. **Leaderboards & Achievements**
9. **Educational Platform**
10. **Mobile App**

---

## Ressourcen-Schätzung

| Phase | Aufwand | Priorität |
|-------|---------|-----------|
| Phase 1: Production | 2-3 Wochen | 🔴 Hoch |
| Phase 2: Content | 3-4 Wochen | 🔴 Hoch |
| Phase 3: Game Modes | 4-5 Wochen | 🟠 Mittel |
| Phase 4: Social | 2-3 Wochen | 🟡 Nice |
| Phase 5: Education | 4-6 Wochen | 🟡 Nice |

**Gesamt für "viel besser":** ~15-20 Wochen für alles
**MVP "spürbar besser":** ~5-6 Wochen (Phase 1 + Basis von Phase 2)

---

## Entscheidungsfragen

1. **Sound:** Lizenzfreie Assets oder Custom?
2. **Multiplayer:** Echtzeit oder Async?
3. **Monetarisierung:** Komplett kostenlos oder Premium-Szenarien?
4. **Mobile:** PWA oder Native App?
5. **Backend:** Serverless weiter oder eigene Infrastruktur?

---

*Welche Phase sollen wir als nächstes angehen?*
