# Strategischer Masterplan: Das Spiel auf Platin-Niveau

**Erstellt:** 2025-12-29
**Vision:** Ein Spiel, das gleichzeitig spannender UND komplexer wird - wo Tiefe Spannung erzeugt

---

## Das Kern-Problem

Das Spiel fühlt sich möglicherweise an wie:
```
Aktion ausführen → Ergebnis sehen → nächste Aktion
```

Was fehlt:
- **Spannung**: Echte Angst vor Konsequenzen
- **Emergenz**: Unerwartete Interaktionen
- **Entscheidungen**: Bedeutungsvolle Wahlmomente
- **Tiefe**: Lernkurve und Meisterschaft
- **Emotion**: Investment in NPCs und Geschichte

---

## Die Lösung: Das "Lebende Welt" System

### 5-Schichten-Modell

```
┌─────────────────────────────────────────────────────────────┐
│ SCHICHT 5: DIE MORALISCHE REISE                            │
│ Jede Handlung verändert den Spieler. NPCs bemerken es.     │
│ Das Ende spiegelt, wer du geworden bist.                   │
├─────────────────────────────────────────────────────────────┤
│ SCHICHT 4: EMERGENTE EFFEKTE                               │
│ Unbeabsichtigte Konsequenzen. Schmetterlings-Effekte.      │
│ Erfolg erzeugt stärkeren Widerstand.                       │
├─────────────────────────────────────────────────────────────┤
│ SCHICHT 3: SYSTEMISCHE VERBINDUNGEN                        │
│ Regionale Kaskaden. Akteur-Netzwerke. Moral akkumuliert.   │
│ Das "Wettrüsten" eskaliert.                                │
├─────────────────────────────────────────────────────────────┤
│ SCHICHT 2: REAKTIVE WELT                                   │
│ Countermeasures. NPC-Reaktionen. Actor-AI. Krisen-Momente. │
│ Die Welt antwortet auf den Spieler.                        │
├─────────────────────────────────────────────────────────────┤
│ SCHICHT 1: UNMITTELBARE AKTIONEN                           │
│ Kosten/Effekte. Combo-System. Sound/Visual Feedback.       │
│ Was ich JETZT tue.                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Die 10 Transformativen Ideen

### 1. DAS COMBO-SYSTEM
**Status:** System existiert in `combo-system.ts` + `combo-definitions.json`
**Aufwand:** Mittel (Integration)

**Was es tut:**
Wenn der Spieler zwei passende Aktionen innerhalb eines Zeitfensters ausführt, wird ein Bonus aktiviert.

**Beispiel:**
```
Phase 5: "Fake News verbreiten"
Phase 6: "Desinformation amplifizieren"
→ COMBO! "Propaganda Blitz" aktiviert
→ +15% Trust-Reduktion, -10 Aufmerksamkeits-Kosten
```

**Existierende Combos:**
| Combo | Benötigte Aktionen | Bonus |
|-------|-------------------|-------|
| Propaganda Blitz | fake_news + amplify | +15% Damage |
| Credibility Erosion | sow_doubt + character_assassination | +12% + Propagation |
| Conspiracy Network | conspiracy + echo_chamber | +10% + Polarization |
| Infrastructure Takeover | bot_network + algorithmic_manipulation | +50% Propagation |
| Divide and Conquer | exploit_division + polarize | +20% Polarization |

**Warum spannend:** Belohnt strategisches Denken. Spieler plant voraus statt reaktiv zu handeln.

---

### 2. KRISEN-MOMENTE (Event Chains)
**Status:** Existiert in `event-chains.json`
**Aufwand:** Mittel (Integration + UI)

**Was es tut:**
Bei kritischen Momenten pausiert das Spiel für eine Entscheidung mit massiven Konsequenzen.

**Beispiel: Whistleblower-Krise**
```
┌─────────────────────────────────────────────────────────────┐
│ ⚠️ KRISE: ANONYMER TIPP                                    │
│                                                             │
│ Ein Whistleblower hat einen Journalisten kontaktiert.       │
│ Sie behaupten, Beweise für die Kampagne zu haben.          │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [A] Beschleunigen - Zuschlagen bevor Ermittlung greift  │ │
│ │     Kosten: 20 Aufmerksamkeit                           │ │
│ │     Risiko: Entdeckung wahrscheinlicher                 │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [B] Abtauchen - Operationen pausieren                   │ │
│ │     Kosten: Keine                                       │ │
│ │     Effekt: Zeit gewinnen, aber Momentum verlieren      │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [C] Whistleblower diskreditieren                        │ │
│ │     Kosten: 150 Budget, 30 Aufmerksamkeit               │ │
│ │     Risiko: Medien werden misstrauischer                │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Existierende Event-Chains:**
- Whistleblower Investigation → Investigation Results
- Viral Moment → Capitalize/Distance
- Platform Policy Change → Mass Suspensions
- Foreign Interference Allegations → Cover-up/Go Dark
- Economic Crisis → Opportunity Window
- Defensive Alliance → Coordinated Opposition

**Warum spannend:** Echte moralische Dilemmata. Keine "richtige" Antwort. Konsequenzen sind spürbar.

---

### 3. DAS WETTRÜSTEN (Actor-AI Integration)
**Status:** Existiert in `actor-ai.ts`
**Aufwand:** Mittel

**Was es tut:**
Je erfolgreicher der Spieler, desto stärker reagiert die Gegenseite. Akteure werden "bewusst" und schlagen zurück.

**Mechanik:**
```typescript
// Verhaltenstypen aus actor-ai.ts
ACTOR_BEHAVIORS: {
  passive:    { counterAttackChance: 0.0, allySupport: false },
  vigilant:   { counterAttackChance: 0.1, allySupport: true },
  defensive:  { counterAttackChance: 0.3, allySupport: true },
  aggressive: { counterAttackChance: 0.5, allySupport: false }
}
```

**Spielablauf:**
```
Phase 1-10:   Akteure sind "passive" - leichte Beute
Phase 11-24:  Akteure werden "vigilant" - achten aufeinander
Phase 25-36:  Akteure werden "defensive" - schlagen zurück
Phase 37+:    Einige werden "aggressive" - jagen den Spieler
```

**Beispiel:**
```
Du greifst die FAZ an.
→ FAZ erleidet Trust-Schaden
→ Die ZEIT (verbunden mit FAZ) wird "vigilant"
→ Nächster Angriff auf ZEIT: +10% Widerstand
→ Wenn FAZ stark beschädigt: Die ZEIT startet Fact-Check
```

**Warum spannend:** Dynamische Schwierigkeit. Erfolg hat Konsequenzen. Kein "easy mode".

---

### 4. DAS NETZWERK-EFFEKT
**Status:** Daten existieren in `media-extended.json`, `experts-extended.json`
**Aufwand:** Hoch

**Was es tut:**
Akteure sind verbunden. Angriffe propagieren durch das Netzwerk - positiv UND negativ.

**Aus media-extended.json:**
```json
{
  "id": "faz",
  "name": "Frankfurter Allgemeine Zeitung",
  "connections": {
    "categories": ["media.quality", "expert.economics", "lobby.industry"],
    "specific": ["sueddeutsche", "der_spiegel"],
    "strength": 0.7
  },
  "vulnerabilities": ["ad_hominem", "bias_framing"],
  "resistances": ["emotional_appeal", "scarcity"]
}
```

**Gameplay-Effekte:**
```
Angriff auf FAZ mit "ad_hominem" (Vulnerability!)
→ FAZ: -20% Trust (verstärkter Effekt)
→ Süddeutsche: -5% Trust (connected)
→ Der Spiegel: -5% Trust (connected)
→ ABER: Alle drei werden wachsamer (+awareness)
```

**Warum spannend:** Systemisches Denken belohnt. "Wer ist mit wem verbunden?"

---

### 5. DIE TAXONOMIE-VERBINDUNG (Bildungstiefe)
**Status:** Existiert in `taxonomy.json` (27 Techniken!)
**Aufwand:** Gering

**Was es tut:**
Jede Aktion ist mit echten Persuasions-Techniken verknüpft. Spieler lernt reale Mechanismen.

**Beispiel in der UI:**
```
┌─────────────────────────────────────────────────────────────┐
│ AKTION: Skandal-Schlagzeile                                 │
│                                                             │
│ Basiert auf: Framing, Emotional Appeal                      │
│                                                             │
│ 📚 Wissenschaftlicher Hintergrund:                          │
│ "Framing refers to how information is presented to          │
│  influence interpretation. The same facts can be framed     │
│  differently to produce different reactions."               │
│                                                             │
│ 📖 Studie: Kahneman & Tversky (1981) - Asian Disease Problem│
│                                                             │
│ 🛡️ Gegen-Strategien:                                        │
│ • Reframe the issue from multiple perspectives              │
│ • Ask "How else could this be described?"                   │
└─────────────────────────────────────────────────────────────┘
```

**Warum spannend:** Bildungswert. Spieler versteht, was sie "im echten Leben" manipuliert.

---

### 6. DIE MORALISCHE SPIRALE
**Status:** `moralWeight` existiert bereits
**Aufwand:** Mittel

**Was es tut:**
Moralisch fragwürdige Aktionen werden leichter - aber gefährlicher. NPCs bemerken die Veränderung.

**Mechanik:**
```
Moral Weight: 0-20   → "Skeptiker" - NPCs respektieren dich noch
Moral Weight: 21-40  → "Zyniker" - Manche NPCs werden distanziert
Moral Weight: 41-60  → "Manipulator" - Neue dunkle Optionen verfügbar
Moral Weight: 61-80  → "Monster" - Nur noch Loyalisten bleiben
Moral Weight: 81-100 → "Verlorene Seele" - Alle meiden dich
```

**NPC-Reaktionen:**
```
Marina bei Moral Weight 25:
"Du hast dich verändert. Früher hast du wenigstens
noch Fragen gestellt..."

Marina bei Moral Weight 60:
"Ich... ich traue dir nicht mehr. Bitte, halte
mich aus deinen Plänen raus."

Marina bei Moral Weight 90:
[Hat das Team verlassen. Keine Dialoge mehr.]
```

**Warum spannend:** Konsequenzen für Spielstil. Emotionale Wirkung. Multiple Enden.

---

### 7. DER DOPPEL-AGENT (NPC-Verrat)
**Status:** NPC-System existiert, braucht Erweiterung
**Aufwand:** Hoch

**Was es tut:**
NPCs haben versteckte "Loyalität". Bei niedriger Loyalität + hohem Risiko können sie verraten.

**Verrats-Mechanik:**
```
NPC Loyalität < 30% UND Risiko > 70%?
→ Würfle: 20% Chance pro Phase auf Verrat

Verrats-Arten:
• Aleksei: Sabotiert Operationen von innen
• Marina: Leckt Informationen an Journalisten
• Volkov: Verkauft Geheimnisse an Konkurrenz
• Der Direktor: Opfert DICH als Sündenbock
```

**Warning Signs (für aufmerksame Spieler):**
```
"Volkov telefoniert auffällig oft außerhalb des Büros."
"Marina fragt sehr detailliert nach Dokumentation."
"Aleksei scheint bester Laune - trotz schlechter Ergebnisse."
```

**Warum spannend:** Paranoia. Zwischenmenschliche Spannung. Wem kann man trauen?

---

### 8. OPPORTUNITÄTS-FENSTER (Weltlage nutzen)
**Status:** World Events existieren
**Aufwand:** Mittel

**Was es tut:**
Weltereignisse erzeugen Fenster, in denen bestimmte Aktionen effektiver sind.

**Beispiel:**
```
WELTEREIGNIS: "Wirtschaftskrise trifft Südland"

→ FENSTER ÖFFNET SICH:
  • Anti-EU-Aktionen: +40% Effektivität in Südland
  • Wirtschafts-Narrative: +30% Reichweite
  • Populismus-Aktionen: -20% Kosten

→ FENSTER SCHLIESST IN: 4 Phasen

Nutzt du es aus?
```

**Bestehende Opportunities aus world-events.json:**
- Wirtschaftskrise → Anti-Establishment boosten
- Flüchtlingswelle → Migrations-Narrative
- Medienskandal → Content-Effektivität erhöht
- Politische Krise → Wahlen beeinflussen

**Warum spannend:** Taktisches Timing. "Warte auf den richtigen Moment."

---

### 9. SOUND-ATMOSPHÄRE
**Status:** SoundSystem.ts existiert, kaum genutzt
**Aufwand:** Gering

**Was es tut:**
Audio-Feedback für jede wichtige Aktion. Atmosphäre durch Sound.

**Existierende Sound-Typen:**
```typescript
SOUND_CONFIGS: {
  click:        { frequency: 800, type: 'square' },
  success:      { frequency: 523 (C5), secondFreq: 659 (E5) },
  warning:      { frequency: 440, type: 'sawtooth' },
  error:        { frequency: 200, type: 'square' },
  notification: { frequency: 880, type: 'sine' },
  phaseEnd:     { frequency: 392 (G4), secondFreq: 523 (C5) },
  consequence:  { frequency: 293 (D4), type: 'sawtooth' }
}
```

**Neue Sounds hinzufügen:**
```
moralShift:   Dunkler Ton bei moralisch fragwürdiger Aktion
comboTrigger: Triumphaler Akkord bei Combo-Aktivierung
crisisAlert:  Alarmton bei Krisen-Moment
betrayal:     Schockierender Dissonanz-Akkord
victory:      Episches Finale
defeat:       Melancholische Sequenz
```

**Warum spannend:** Emotionale Verstärkung. Immersion. Feedback-Klarheit.

---

### 10. POST-GAME DEBRIEFING
**Status:** In IDEAS.md als I-008 angenommen
**Aufwand:** Mittel

**Was es tut:**
Nach Spielende: Reflexion über das Getane mit realen Parallelen.

**Struktur:**
```
┌─────────────────────────────────────────────────────────────┐
│ KAMPAGNEN-BERICHT                                           │
├─────────────────────────────────────────────────────────────┤
│ DEINE KAMPAGNE IN ZAHLEN:                                   │
│ • 47 Aktionen ausgeführt                                    │
│ • 12 Akteure destabilisiert                                 │
│ • 3 Krisen-Momente gemeistert                               │
│ • Moralisches Gewicht: 67 ("Manipulator")                   │
├─────────────────────────────────────────────────────────────┤
│ REALE PARALLELEN:                                           │
│                                                             │
│ Du hast "Emotional Framing" 15x verwendet.                  │
│ → Echtes Beispiel: Brexit-Kampagne "£350M für NHS"          │
│ → Studie: Kahneman & Tversky (1981)                         │
│                                                             │
│ Du hast einen Journalisten "diskreditiert".                 │
│ → Echtes Beispiel: Maria Ressa (Philippinen)                │
│ → Link: Committee to Protect Journalists                    │
├─────────────────────────────────────────────────────────────┤
│ REFLEXIONSFRAGEN:                                           │
│ • An welchem Punkt hättest du aufhören können?              │
│ • Welche Aktion bereust du am meisten?                      │
│ • Hättest du anders gespielt, wenn die NPCs real wären?     │
├─────────────────────────────────────────────────────────────┤
│ RESSOURCEN:                                                 │
│ • First Draft News (Fact-Checking)                          │
│ • Correctiv (DE)                                            │
│ • Bellingcat (Open Source Investigation)                    │
└─────────────────────────────────────────────────────────────┘
```

**Warum spannend:** Bildungswert. Nachwirkung. Das Spiel hört nicht beim "Game Over" auf.

---

## Implementierungs-Roadmap

### Phase 1: Quick Wins (1-2 Tage)
```
✅ Sound-System aktivieren
✅ Taxonomy mit Aktionen verlinken
✅ Opportunitäts-Fenster für World Events
```

### Phase 2: Strategische Tiefe (3-5 Tage)
```
🔲 Combo-System integrieren
🔲 Krisen-Momente (Event Chains) einbauen
🔲 Wettrüsten (Actor-AI) aktivieren
```

### Phase 3: Emergente Komplexität (1-2 Wochen)
```
🔲 Netzwerk-Effekte implementieren
🔲 Moralische Spirale mit NPC-Reaktionen
🔲 Doppel-Agent System
```

### Phase 4: Polish (1 Woche)
```
🔲 Post-Game Debriefing
🔲 Multiple Enden basierend auf Moral
🔲 Achievement-System für Combos
```

---

## Technische Abhängigkeiten

```
combo-system.ts
├── Benötigt: StoryEngineAdapter-Integration
├── Benötigt: UI-Komponente für Combo-Anzeige
└── Benötigt: Mapping von Story-Aktionen zu Combo-Abilities

event-chain-system.ts
├── Benötigt: Modal/Overlay-Komponente für Krisen
├── Benötigt: Event-Chain-Trigger in Phase-Processing
└── Benötigt: Konsequenz-Tracking

actor-ai.ts
├── Benötigt: Extended Actors importieren
├── Benötigt: Awareness-Tracking pro Akteur
└── Benötigt: Counter-Attack-Events generieren
```

---

## Priorisierte Empfehlung

**Wenn ich EINE Sache zuerst machen würde:**

### → KRISEN-MOMENTE (Event Chains)

**Warum?**
1. Existierende Daten sind hochwertig (event-chains.json)
2. Sofort spürbare Gameplay-Verbesserung
3. Moralische Dilemmata = emotionale Wirkung
4. Verkettete Konsequenzen = Tiefe
5. Einzigartig - kein anderes Spiel macht das so

**Erste Implementation:**
1. Whistleblower Chain (3 Events)
2. Viral Moment Chain (2 Events)
3. Platform Crackdown Chain (2 Events)

Das allein würde das Spiel DEUTLICH spannender machen.

---

## Offene Fragen an den Designer

1. **Combo-Balance:** Sollen Combos "entdeckt" werden (versteckt bis aktiviert) oder von Anfang an sichtbar sein?

2. **Verrats-Häufigkeit:** Wie oft soll Verrat vorkommen? Jedes Spiel? Nur bei bestimmten Spielstilen?

3. **Schwierigkeitsgrade:** Soll das Wettrüsten skalieren oder fest sein?

4. **Multiple Enden:** Wie viele verschiedene Enden sollen existieren?
   - Sieg (Westunion destabilisiert)
   - Niederlage (Enttarnt)
   - Ausstieg (Spieler gibt auf)
   - Verrat (NPC beendet Karriere)
   - Moralischer Kollaps (Spieler "gewinnt" aber verliert sich)

5. **Taxonomie-Tiefe:** Soll die wissenschaftliche Info optional (Tooltip) oder prominent (Teil der UI) sein?

---

**Nächster Schritt:** Welchen Bereich möchtest du priorisieren?
