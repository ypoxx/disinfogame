# Mapping: JSON-Taxonomie → Game Engine & Vision

**Erstellt:** 2025-12-24
**Zweck:** Integration der strukturierten JSON-Daten in die bestehende Game-Vision
**Status:** Planning Document - Identifiziert Mappings & Lücken

---

## 🎯 Überblick: Was passt zusammen?

### Zwei Schichten, ein Spiel:

| Schicht | Quelle | Funktion |
|---------|--------|----------|
| **Data Layer** | JSON-Bundle | Mechanik, Balancing, Taxonomie |
| **Narrative Layer** | Vision Docs | Story, NPCs, Dilemmata, Szenarien |

**Diese beiden Schichten ergänzen sich perfekt** - das JSON liefert die fehlende Daten-Infrastruktur unter der konzeptuellen Vision.

---

## 📊 MAPPING 1: Actors → Game Elements

### JSON Actor Archetypes → Game Implementation

| JSON Actor Archetype | Game-Rolle | Implementierung | Status |
|---------------------|-----------|-----------------|---------|
| **actor.state.intelligence** | Gegenspieler (Foreign Interference) | Event-Generator für externe Destabilisierung | ✅ JSON vorhanden, ⚠️ Events fehlen |
| **actor.state.proxy_org** | Gegenspieler (versteckte Kampagnen) | Schwer detektierbare Angriffe | ✅ JSON vorhanden, ⚠️ Detection-Logic fehlt |
| **actor.state.media_apparatus** | Gegenspieler (offene Propaganda) | Leicht erkennbar, schwer zu stoppen | ✅ JSON vorhanden |
| **actor.nonstate.political_consult** | **NPC "Strategie-Direktor"** | Bietet Microtargeting & AB-Testing Abilities an | ✅ JSON + NPC vorhanden, ⚠️ Verbindung fehlt |
| **actor.nonstate.ideological** | Gegenspieler ODER Werkzeug | Grassroots-Mobilisierung (unkontrollierbar) | ✅ JSON vorhanden, ⚠️ Spielmechanik unklar |
| **actor.nonstate.profit** | **NPC "Bot-Farm Tech-Chef"** | Bietet Bot-Netzwerke & SEO-Manipulation | ✅ JSON + NPC vorhanden, ⚠️ Verbindung fehlt |
| **actor.individual.witting** | Recruitment-Ziel | MICE-basierte Rekrutierung (siehe Abilities) | ✅ JSON vorhanden, ⚠️ Recruitment-Mechanik fehlt |
| **actor.individual.unwitting** | Useful Idiots | Verstärkung ohne Wissen (Ego/Ideology) | ✅ JSON vorhanden, ⚠️ Mechanik fehlt |
| **actor.individual.pseudo_expert.former_official** | Möglicher Rekrut | High Legitimacy, Medium Detection | ✅ JSON vorhanden, ⚠️ Character-Profiles fehlen |
| **actor.individual.pseudo_expert.academic_contrarian** | Möglicher Rekrut | High Niche Penetration, High Detection Difficulty | ✅ JSON vorhanden, ⚠️ Character-Profiles fehlen |
| **actor.individual.pseudo_expert.alt_media** | Möglicher Rekrut | Very High Audience Loyalty, Low-Medium Detection | ✅ JSON vorhanden, ⚠️ Character-Profiles fehlen |
| **actor.automation.simple_bot** | **Tool (Bot-Farm NPC)** | Low Detection Difficulty, High Scale | ✅ JSON vorhanden, ⚠️ Balancing fehlt |
| **actor.automation.sophisticated_bot** | **Tool (Bot-Farm NPC)** | High Detection Difficulty, kostet mehr | ✅ JSON vorhanden, ⚠️ Balancing fehlt |
| **actor.automation.cyborg** | **Premium Tool** | Very High Detection Difficulty (Mensch + Automation) | ✅ JSON vorhanden, ⚠️ Unlock-Logic fehlt |
| **actor.automation.sock_puppet** | **Tool** | Fake Personas für Astroturfing | ✅ JSON vorhanden, ⚠️ Use-Case fehlt |
| **infra.troll_farm** | **NPC "Bot-Farm Tech-Chef"** | Organisatorische Einheit für Bots | ✅ JSON vorhanden |
| **infra.ai_content_generator** | **Tool (Medien NPC?)** | AI-Generated Text/Images | ✅ JSON vorhanden, ⚠️ NPC-Zuordnung unklar |
| **infra.meme_factory** | **Tool (Medien NPC)** | Virality-Booster | ✅ JSON vorhanden |
| **infra.domain_network** | **Tool (Strategie NPC?)** | Fake News Sites, Typosquatting | ✅ JSON vorhanden, ⚠️ NPC-Zuordnung unklar |

### 🔴 LÜCKEN - Actors:

#### Im JSON fehlt:
- ❌ **Konkrete NPC-Charaktere** (Namen, Persönlichkeiten, Dialoge)
- ❌ **Player Character Definition** (Kommunikationsdirektor-Profil)
- ❌ **Opposition/Antagonist-Archetypes** (Investigative Journalisten, NGOs, Fact-Checkers)
- ❌ **Recruitable Character-Pools** (konkrete Pseudo-Experten mit Backstories)

#### In den Docs fehlt:
- ❌ **Strukturierte Actor-Attributes** (resource_level, sophistication, detection_difficulty)
- ❌ **Strengths/Vulnerabilities für NPCs** (Was sind ihre Schwächen/Stärken?)
- ❌ **Actor-Kategorie-System** (State/Non-State/Individual/Automation-Hierarchie)

---

## 🎮 MAPPING 2: DISARM Techniques → Player Abilities

### JSON Techniques → NPC Abilities (Spieler-Aktionen)

| DISARM Technique (JSON) | NPC der es anbietet | Ability-Name (Game) | Kosten | Effekt | Status |
|------------------------|---------------------|---------------------|--------|--------|---------|
| **T0073: Determine Target Audiences** | Strategie-Direktor | "Zielgruppen-Analyse" | 20 💰 | +15% Kampagnen-Effektivität | ✅ JSON, ⚠️ Ability fehlt |
| **T0074: Determine Strategic Ends** | Strategie-Direktor | "Strategie-Workshop" | 30 💰 | Definiert Win-Conditions für Kampagne | ✅ JSON, ⚠️ Ability fehlt |
| **T0001: 5Ds Framework** | Strategie-Direktor | "5Ds-Kampagne starten" | 50 💰 | Narrative Resilience +0.1 | ✅ JSON, ⚠️ Ability fehlt |
| **T0003: Develop Owned Media** | Medien-Leiter | "Fake News Site aufbauen" | 100 💰, 5 🏭 | +20% Content Distribution | ✅ JSON, ⚠️ Ability fehlt |
| **T0004: Develop Inauthentic Identities** | Bot-Farm Tech-Chef | "Persona-Kit erstellen" | 40 💰 | Unlock Sock Puppets | ✅ JSON, ⚠️ Ability fehlt |
| **T0097: Create Inauthentic Accounts** | Bot-Farm Tech-Chef | "Bot-Netzwerk spawnen" | 60 💰, 10 🏭 | +30% Amplification | ✅ JSON, ⚠️ Ability fehlt |
| **T0143: Cultivate Trolls** | Bot-Farm Tech-Chef | "Troll-Farm anwerben" | 80 💰, 15 🏭 | +25% Harassment Capacity | ✅ JSON, ⚠️ Ability fehlt |
| **T0023: Distort Facts** | Medien-Leiter | "Fact-Twisting" | 30 💰 | +15% Factcheck Difficulty | ✅ JSON, ⚠️ Ability fehlt |
| **T0024: Create Fake Experts** | Strategie-Direktor | "Pseudo-Experten rekrutieren" | 150 💰, 20 👁️ | +20% Legitimacy | ✅ JSON, ⚠️ Ability + Character-Pool fehlt |
| **T0025: AI-Generated Text** | Medien-Leiter | "AI-Texte generieren" | 20 💰, 5 🏭 | +50% Production Speed | ✅ JSON, ⚠️ Ability fehlt |
| **T0086: AI-Generated Images (Deepfakes)** | Medien-Leiter | "Deepfake erstellen" | 100 💰, 30 🏭 | +40% Emotional Impact | ✅ JSON, ⚠️ Ability fehlt |
| **T0141: Develop Memes** | Medien-Leiter | "Meme-Kampagne" | 25 💰 | +35% Virality Potential | ✅ JSON, ⚠️ Ability fehlt |
| **T0034: Hijack Hashtags** | Bot-Farm Tech-Chef | "Hashtag-Hijacking" | 40 💰, 10 🏭 | +25% Organic Reach | ✅ JSON, ⚠️ Ability fehlt |
| **T0035: Use Bots to Amplify** | Bot-Farm Tech-Chef | "Bot-Verstärkung" | 50 💰, 15 🏭 | +60% Amplification | ✅ JSON, ⚠️ Ability fehlt |
| **T0039: Bait Journalists** | Strategie-Direktor | "Medien-Falle legen" | 200 💰, 30 👁️ | +100% Legitimacy on Success (Risk!) | ✅ JSON, ⚠️ Ability fehlt |
| **T0046: SEO** | Bot-Farm Tech-Chef | "SEO-Manipulation" | 80 💰 | +30% Long-Term Visibility | ✅ JSON, ⚠️ Ability fehlt |
| **T0121: Scheduling Software** | Bot-Farm Tech-Chef | "Scheduling-Tool nutzen" | 30 💰, 5 🏭 | +40% Operational Efficiency | ✅ JSON, ⚠️ Ability fehlt |
| **T0049: Flooding** | Bot-Farm Tech-Chef | "Information-Flooding" | 100 💰, 25 🏭 | +45% Noise Generation | ✅ JSON, ⚠️ Ability fehlt |
| **T0053: Astroturfing** | Strategie-Direktor | "Astroturfing-Kampagne" | 120 💰, 20 👁️ | +35% Perceived Authenticity | ✅ JSON, ⚠️ Ability fehlt |
| **T0057: Organize Events** | Strategie-Direktor | "Protest organisieren" | 200 💰, 40 👁️ | +70% Online-Offline Impact | ✅ JSON, ⚠️ Ability + Event-System fehlt |
| **T0058: Microtarget** | Strategie-Direktor | "Microtargeting-Kampagne" | 150 💰, 30 👁️ | +55% Conversion Rate | ✅ JSON, ⚠️ Ability fehlt |
| **T0060: Continue Amplifying** | Bot-Farm Tech-Chef | "Kampagne fortsetzen" | 20 💰, 5 🏭 | +20% Momentum | ✅ JSON, ⚠️ Ability fehlt |
| **T0062: Backstop Personas** | Bot-Farm Tech-Chef | "Persona-Pflege" | 40 💰 | +25% Account Lifespan | ✅ JSON, ⚠️ Ability fehlt |
| **T0063: Controversial Content** | Medien-Leiter | "Polarisierendes Content" | 30 💰 | +40% Engagement Rate | ✅ JSON, ⚠️ Ability fehlt |
| **T0142: Cultivate Community** | Strategie-Direktor | "Community aufbauen" | 100 💰, 15 👁️ | +60% User Retention | ✅ JSON, ⚠️ Ability fehlt |
| **T0080: Identify Wedge Issues** | Strategie-Direktor | "Wedge Issues recherchieren" | 50 💰, 10 👁️ | +50% Divisiveness | ✅ JSON, ⚠️ Ability fehlt |
| **T0081: Competing Narratives** | Strategie-Direktor | "Gegen-Narrative streuen" | 80 💰 | +35% Confusion | ✅ JSON, ⚠️ Ability fehlt |
| **T0082: Exploit Conspiracy Theories** | Medien-Leiter | "Verschwörungs-Narrative" | 60 💰 | +45% True Believer Recruitment | ✅ JSON, ⚠️ Ability fehlt |
| **T0083: Exploit Polarization** | Strategie-Direktor | "Polarisierung ausnutzen" | 150 💰, 25 👁️ | +55% Societal Impact | ✅ JSON, ⚠️ Ability fehlt |

### 🔴 LÜCKEN - Techniques:

#### Im JSON fehlt:
- ❌ **Ability-Beschreibungen für Spieler** (Player-facing Text, nicht nur Label)
- ❌ **Kosten-Balancing** (Placeholder-Werte müssen getestet werden)
- ❌ **Prerequisite-System** (Welche Abilities brauchen Unlocks?)
- ❌ **Cooldowns/Limits** (Kann man T0086 Deepfakes jeden Tag machen?)
- ❌ **Targeting-Logic** (Auf wen/was wird diese Ability angewandt?)
- ❌ **Failure-States** (Was passiert wenn T0039 Bait Journalists fehlschlägt?)
- ❌ **Synergy-Effekte konkret** (AI-Text + Bots ist im Graph, aber kein konkreter Bonus definiert)

#### In den Docs fehlt:
- ❌ **Vollständiger Ability-Katalog** (NPCs haben aktuell keine definierten Abilities)
- ❌ **Technique-IDs Referenz** (Keine Verbindung zu DISARM Framework)
- ❌ **Game-Effects-Werte** (Keine konkreten Boni/Mali)

---

## 🎯 MAPPING 3: Countermeasures → Opponent Abilities (Player Defense)

### JSON Countermeasures → Was der Gegner tun kann

| DISARM Countermeasure (JSON) | Gegner der es nutzt | Effect auf Spieler | Status |
|----------------------------|---------------------|---------------------|---------|
| **C00092: Bot Detection** | Platform-Moderatoren (Event) | Simple Bots werden entfernt, -30% Amplification | ✅ JSON, ⚠️ Event fehlt |
| **C00008: Shared Fact-Checking DB** | Fact-Checkers (Event) | Distorted Facts werden aufgedeckt, -20% Legitimacy | ✅ JSON, ⚠️ Event fehlt |
| **C00010: Social Engineering Detection** | Security Researchers (Event) | Witting Agents exposed, -50 👁️ | ✅ JSON, ⚠️ Event fehlt |
| **C00027: Audit Search Algorithms** | Regulators (Event) | SEO-Manipulation unwirksam, -30% Visibility | ✅ JSON, ⚠️ Event fehlt |
| **C00012: Platform Regulation** | Government (Event) | Alle Platform-based Abilities kosten +50% | ✅ JSON, ⚠️ Event fehlt |
| **C00019: Reduce Political Targeting** | Privacy Advocates (Event) | Microtargeting -40% Effectiveness | ✅ JSON, ⚠️ Event fehlt |
| **C00021: Independent Reporting** | Investigative Journalists (Event) | Fake Experts exposed, -Legitimacy | ✅ JSON, ⚠️ Event fehlt |
| **C00029: Media Literacy Campaign** | NGOs (Event) | Population Resistance +20%, alle Abilities -10% | ✅ JSON, ⚠️ Event fehlt |
| **C00153: Prebunking/Inoculation** | Educational Institutions (Event) | Zukünftige Narrative -30% Effectiveness | ✅ JSON, ⚠️ Event fehlt |
| **C00013: Deplatforming** | Social Media Platforms (Event) | Alle Bots/Accounts removed, restart needed | ✅ JSON, ⚠️ Event fehlt |
| **C00031: Reduce Division-Enablers** | Platform Policy (Event) | Wedge Issues/Polarization -50% | ✅ JSON, ⚠️ Event fehlt |
| **C00081: Highlight Flooding** | Media Watchdogs (Event) | Flooding-Taktik exposed, -Credibility | ✅ JSON, ⚠️ Event fehlt |
| **C00096: Sticky Content** | Opponents (Kampagne) | Ihre Narrative hält länger, hard to dislodge | ✅ JSON, ⚠️ Event fehlt |
| **C00042: Address Emotional Needs** | Opposition (Kampagne) | Ihre Narrative emotional stärker, +Legitimacy | ✅ JSON, ⚠️ Event fehlt |
| **C00126: Social Media Verification** | Platforms (Event) | Inauthentic Accounts schwerer zu erstellen | ✅ JSON, ⚠️ Event fehlt |
| **C00176: Whole-of-Society Approach** | Multi-Stakeholder Coalition (Event) | ALLE Countermeasures verstärkt, schwierig | ✅ JSON, ⚠️ Event fehlt |
| **C00205: Platform Coordination** | Tech Companies (Event) | Cross-Platform Detection, Bots ineffektiv | ✅ JSON, ⚠️ Event fehlt |

### 🔴 LÜCKEN - Countermeasures:

#### Im JSON fehlt:
- ❌ **Event-Trigger-Logic** (Wann/wie triggern diese Countermeasures?)
- ❌ **Wahrscheinlichkeits-System** (T0039 Bait Journalists hat z.B. Risk of Detection - wie hoch?)
- ❌ **Player-Mitigation** (Kann der Spieler Countermeasures blockieren/verzögern?)
- ❌ **NPC-Countermeasures** (Haben deine NPCs interne Rivalitäten/Counter?)

#### In den Docs fehlt:
- ❌ **Opponent-System** (Wer sind die Gegner? Investigative Journalisten NPC? Events?)
- ❌ **Detection-Mechanik** (Wie funktioniert Aufdeckung von Bots/Fake Experts?)
- ❌ **Risk-Reward-Balance** (High-Risk-Abilities wie Deepfakes brauchen Failure-Chance)

---

## 🎲 MAPPING 4: Game Design Layer → Game Systems

### JSON Game Design → Implementation

| JSON Game Design Element | Game System | Implementierung | Status |
|-------------------------|-------------|-----------------|---------|
| **player_role: analyst** | Profi-Modus Rolle | Graph-basiertes Wargaming (aktuell) | ✅ Vision vorhanden |
| **player_role: [implizit Propagandist]** | Spieler-Modus Rolle | Kommunikationsdirektor (Narrative) | ✅ Vision vorhanden, ⚠️ JSON fehlt Role |
| **actor_select_roster** (7 Archetypen) | NPC-Auswahl-System | Welche Actors kann der Spieler nutzen? | ✅ JSON, ⚠️ Selection-UI fehlt |
| **attributes_schema** | Attribute-System | resource_level, sophistication, detection_difficulty, etc. | ✅ JSON, ⚠️ Game-Integration fehlt |
| **progression.phases** (TA01-TA07) | Tech-Tree / Unlock-System | Phasen-basierte Freischaltung | ✅ JSON, ⚠️ Unlock-Logic fehlt |
| **detection_system.indicators** | Detection-Mechanik | MICE signals, Network patterns, etc. | ✅ JSON, ⚠️ Detection-Algorithm fehlt |
| **detection_system.player_tools** | Player-Tools (Profi-Modus) | Network Visualizer, Financial Investigation | ✅ JSON, ⚠️ Tools nicht implementiert |
| **countermeasures_system.actions** | Player-Aktionen (Analyst-Rolle) | Attribution, Platform Request, Publish Investigation | ✅ JSON, ⚠️ Nur für Profi-Modus? |
| **countermeasures_system.resources** | Ressourcen-System | Time, Credibility, Contacts, Platform Coop | ✅ JSON, ✅ Docs haben ähnlich (💰👁️🏭) |
| **difficulty_scaling** | Difficulty-Settings | Easy → Very Hard | ✅ JSON, ⚠️ Konkrete Unterschiede fehlen |
| **scenario_catalog** | Scenario-Selection | Election, Public Health, Geopolitics, etc. | ✅ JSON, ✅ Docs haben "Hybrid Crisis" |
| **campaign_types** | Campaign-Mechanik | Single-Issue, Multi-Narrative, Opportunistic, Long-Term | ✅ JSON, ⚠️ Gameplay-Unterschiede fehlen |
| **case_references_for_scenarios** | Historical Examples / Tutorial | IRA 2016, Cambridge Analytica, Doppelgänger | ✅ JSON, ⚠️ In-Game-Integration fehlt |

### 🔴 LÜCKEN - Game Design:

#### Im JSON fehlt:
- ❌ **Spieler-Modus Role Definition** (Kommunikationsdirektor nicht im JSON)
- ❌ **Win/Loss Conditions konkret** (Was bedeutet "Wahlen gewinnen" mechanisch?)
- ❌ **Ressourcen-Generierung** (Wie bekommt man mehr 💰/👁️/🏭?)
- ❌ **Event-System** (E-Mail-Inbox-Struktur nicht im JSON)
- ❌ **Timeline/Tempo** (32 Tage Struktur nicht im JSON)
- ❌ **NPC-Charakterisierung** (Persönlichkeiten, Loyalitäten, Rivalitäten)
- ❌ **Dilemmata-System** (Moralische Choices nicht strukturiert)
- ❌ **Balancing-Werte konkret** (Placeholder-Deltas müssen getestet werden)

#### In den Docs fehlt:
- ❌ **Progression-System** (Wann schaltet man neue Abilities frei?)
- ❌ **Detection-Logic** (Wie wird der Spieler aufgedeckt?)
- ❌ **Attribute-System** (Keine strukturierten Actor-Attributes)
- ❌ **Countermeasure-Events** (Gegner-Aktionen nicht definiert)

---

## 🗺️ MAPPING 5: Real Cases → Scenarios & Events

### JSON Cases → Game Scenarios/Tutorial

| JSON Case | Scenario-Nutzung | Techniques Used (JSON) | Event-Potential | Status |
|-----------|------------------|------------------------|-----------------|---------|
| **case.ira_2016** | Tutorial-Szenario / "Was wäre wenn" | T0057 (Events), T0058 (Microtarget) | Social Media Manipulation, Fake Protests | ✅ JSON, ⚠️ Scenario fehlt |
| **case.cambridge_analytica** | Szenario "Data-Driven Campaign" | T0058 (Microtarget), Psychological Profiling | Facebook Data Breach, Microtargeting | ✅ JSON, ⚠️ Scenario fehlt |
| **case.doppelgaenger** | Szenario "Domain Spoofing" | infra.domain_network | Typosquatted News Sites | ✅ JSON, ⚠️ Scenario fehlt |
| **case.copycop** | Szenario "AI-Generated Disinformation" | T0025 (AI-Text) | AI-Generated Articles at Scale | ✅ JSON, ⚠️ Scenario fehlt |
| **case.fimi_eu_2024** | Szenario "Multi-Actor Foreign Interference" | Multiple Techniques | EU Election Manipulation | ✅ JSON, ⚠️ Scenario fehlt |
| **case.iran_cpdc_2024** | Szenario "State-Sponsored Election Interference" | org.cpdc (Cognitive Design Production Center) | U.S. Election 2024 | ✅ JSON, ⚠️ Scenario fehlt |
| **case.trump_attempt_disinfo_2024_07** | Event "Breaking News Manipulation" | Opportunistic Disinformation | July 2024 Assassination Attempt | ✅ JSON, ⚠️ Event fehlt |
| **[implizit] COVID Vaccine Misinfo** | ✅ Docs-Szenario | ⚠️ Nicht im JSON | Superspreader-Model, Pentagon Anti-Sinovac | ⚠️ JSON fehlt, ✅ Docs vorhanden |
| **[implizit] Ukraine-Russia Info War** | ✅ Docs-Szenario | ⚠️ Nicht im JSON | AI-Poisoning (Pravda), Cyber-Psych-Ops | ⚠️ JSON fehlt, ✅ Docs vorhanden |

### 🔴 LÜCKEN - Cases & Scenarios:

#### Im JSON fehlt:
- ❌ **Szenario-Narratives** (Story-Setup, Protagonist, Antagonisten)
- ❌ **Event-Templates** (Konkrete E-Mails/Ereignisse)
- ❌ **Timeline-Struktur** (Tag-für-Tag Progression)
- ❌ **COVID & Ukraine Cases** (In Docs detailliert, aber nicht im JSON)
- ❌ **Victory/Failure-Conditions pro Szenario** (Was bedeutet "Gewonnen"?)

#### In den Docs fehlt:
- ❌ **Technique-Mappings für COVID/Ukraine** (Welche DISARM-Techniken wurden genutzt?)
- ❌ **Actor-Mappings für COVID/Ukraine** (Welche Actor-Archetypen waren beteiligt?)
- ❌ **Case-IDs für Referenzierung** (Kein strukturiertes ID-System)

---

## 🔗 MAPPING 6: JSON Graph Edges → Game Synergies

### JSON Edges → Combo-System

| Edge (JSON) | Synergy-Type | Game-Mechanik | Status |
|------------|--------------|---------------|---------|
| **AI-Text + Bots** | Technique Synergy | AI-generierter Content + Bot-Verstärkung = +20% zusätzlich | ✅ JSON, ⚠️ Combo-System fehlt |
| **AI-Text + Microtarget** | Technique Synergy | Personalisierte AI-Texte = +25% Conversion | ✅ JSON, ⚠️ Combo-System fehlt |
| **Bots + Microtarget** | Technique Synergy | Targeted Bot-Campaigns = +30% Effectiveness | ✅ JSON, ⚠️ Combo-System fehlt |
| **State → Proxy** | Actor Relation | Plausible Deniability, -Detection Risk | ✅ JSON, ⚠️ Game-Mechanik fehlt |
| **Proxy → Witting Individual** | Actor Relation | MICE-Recruitment (Money/Ideology/Coercion/Ego) | ✅ JSON, ⚠️ Recruitment fehlt |
| **C00081 → T0049** | Countermeasure → Technique | Highlight Flooding mitigates Flooding-Taktik | ✅ JSON, ⚠️ CM-System fehlt |
| **C00013 → Simple Bots** | Countermeasure → Actor | Deplatforming entfernt Bots | ✅ JSON, ⚠️ CM-System fehlt |

### 🔴 LÜCKEN - Synergies:

#### Im JSON fehlt:
- ❌ **Konkrete Synergy-Boni** (Edge existiert, aber kein Zahlenwert für +20% etc.)
- ❌ **Negative Synergies** (Welche Combos widersprechen sich?)
- ❌ **3-Way-Synergies** (AI + Bots + Microtarget = Super-Combo?)
- ❌ **NPC-Synergies** (Arbeiten Medien + Bot-Farm besser zusammen als Strategie + Medien?)

#### In den Docs fehlt:
- ❌ **Combo-System** (Überhaupt nicht erwähnt)
- ❌ **Synergy-UI** (Wie zeigt man dem Spieler Kombos?)

---

## 📦 MAPPING 7: Ressourcen-System

### JSON Resources → Game Resources

| JSON Resource | Game Resource | Icon | Generation | Usage | Status |
|--------------|---------------|------|------------|-------|---------|
| **game.resource.time** | ⏰ Aktionen/Tag | ⏰ | 10/Tag (fix) | Jede Ability kostet 1 Aktion | ✅ JSON, ⚠️ Docs haben nicht explizit |
| **game.resource.credibility** | 👁️ Glaubwürdigkeit | 👁️ | Events, Erfolge | Komplexe Abilities, Rekrutierung | ✅ JSON, ✅ Docs vorhanden |
| **game.resource.contacts** | 📞 Kontakte | 📞 | Rekrutierung, Events | Zugang zu Pseudo-Experts, Journalisten-Baiting | ✅ JSON, ⚠️ Docs haben nicht |
| **game.resource.platform_coop** | 🤝 Plattform-Kooperation | 🤝 | Verhandlungen, Events | Reduziert Detection-Risk auf Plattformen | ✅ JSON, ⚠️ Docs haben nicht |
| **[implizit] Money** | 💰 Budget | 💰 | Daily Allocation, PM-Vertrauen | Alle Abilities kosten Geld | ⚠️ JSON fehlt, ✅ Docs vorhanden |
| **[implizit] Production** | 🏭 Produktion | 🏭 | Bot-Farm, Medien | Technische Abilities (Bots, AI, Deepfakes) | ⚠️ JSON fehlt, ✅ Docs vorhanden |

### 🔴 LÜCKEN - Ressourcen:

#### Im JSON fehlt:
- ❌ **💰 Budget als Resource** (Implizit, aber nicht definiert)
- ❌ **🏭 Produktion als Resource** (Implizit, aber nicht definiert)
- ❌ **Ressourcen-Generierungs-Mechanik** (Wie verdient man mehr?)
- ❌ **Ressourcen-Caps** (Maximale Werte?)
- ❌ **Ressourcen-Decay** (Verliert man Credibility über Zeit?)

#### In den Docs fehlt:
- ❌ **📞 Kontakte-System** (Nicht im Day 1 Walkthrough)
- ❌ **🤝 Plattform-Kooperation** (Nicht erwähnt)
- ❌ **⏰ Aktionen-Limit** (Unklar ob es Limit gibt)

---

## 🎭 MAPPING 8: NPCs → Actor Archetypes

### Docs NPCs → JSON Actors

| NPC (Docs) | JSON Actor Archetype | Abilities (Techniques) | Persönlichkeit | Status |
|-----------|---------------------|------------------------|----------------|---------|
| **Dr. Weber (Medien-Leiter)** | actor.nonstate.political_consult (teilweise) | T0003, T0023, T0025, T0086, T0141, T0063, T0082 | ⚠️ Nicht definiert | ✅ NPC, ✅ Techniques, ⚠️ Character fehlt |
| **Strategie-Direktor** | actor.nonstate.political_consult | T0001, T0073, T0074, T0024, T0039, T0053, T0057, T0058, T0142, T0080, T0081, T0083 | ⚠️ Nicht definiert | ✅ NPC, ✅ Techniques, ⚠️ Character fehlt |
| **Tech-Chef (Bot-Farm)** | infra.troll_farm | T0004, T0097, T0143, T0034, T0035, T0046, T0121, T0049, T0060, T0062 | ⚠️ Nicht definiert | ✅ NPC, ✅ Techniques, ⚠️ Character fehlt |
| **[fehlend] Investigativer Journalist** | ⚠️ Opposition-Archetype fehlt | C00021 (Independent Reporting) | ⚠️ Nicht definiert | ⚠️ NPC fehlt, ⚠️ Actor fehlt |
| **[fehlend] Fact-Checker** | ⚠️ Opposition-Archetype fehlt | C00008 (Fact-Checking DB) | ⚠️ Nicht definiert | ⚠️ NPC fehlt, ⚠️ Actor fehlt |
| **[fehlend] Platform-Moderator** | ⚠️ Opposition-Archetype fehlt | C00092 (Bot Detection), C00013 (Deplatform) | ⚠️ Nicht definiert | ⚠️ NPC fehlt, ⚠️ Actor fehlt |
| **[fehlend] Regulator** | ⚠️ Opposition-Archetype fehlt | C00012 (Platform Regulation), C00027 (Audit Search) | ⚠️ Nicht definiert | ⚠️ NPC fehlt, ⚠️ Actor fehlt |
| **[fehlend] NGO/Activist** | ⚠️ Opposition-Archetype fehlt | C00029 (Media Literacy), C00153 (Prebunking) | ⚠️ Nicht definiert | ⚠️ NPC fehlt, ⚠️ Actor fehlt |
| **Premierminister** | ⚠️ Boss/Authority-Archetype fehlt | ⚠️ Evaluiert Spieler-Performance | ✅ Charakterisiert in Docs | ⚠️ Actor fehlt, ⚠️ Mechanik fehlt |
| **Familie (Foto auf Schreibtisch)** | ⚠️ Moral-Anchor fehlt | ⚠️ Dilemmata-Trigger | ✅ Erwähnt in Docs | ⚠️ Actor fehlt, ⚠️ Mechanik fehlt |

### 🔴 LÜCKEN - NPCs:

#### Im JSON fehlt:
- ❌ **Opposition-Archetypen** (Journalisten, Fact-Checkers, Regulatoren, NGOs)
- ❌ **Boss/Authority-Archetypen** (Premierminister, Vorgesetzte)
- ❌ **Moral-Anchor-Archetypen** (Familie, Gewissen, ethische Dilemmata)
- ❌ **NPC-Charakterisierung** (Namen, Persönlichkeiten, Backstories, Motivationen)
- ❌ **NPC-Loyalität-System** (Können NPCs dich verraten? Haben sie eigene Ziele?)
- ❌ **NPC-Dialog-System** (Conversation-Trees)

#### In den Docs fehlt:
- ❌ **Vollständige NPC-Liste** (Nur 3 definiert: Medien, Strategie, Bot-Farm)
- ❌ **NPC-Attribute** (Keine resource_level, sophistication, etc.)
- ❌ **NPC-Freischaltung** (Wann/wie bekommt man Zugang zu NPCs?)

---

## 🏆 ZUSAMMENFASSUNG: Was haben wir, was fehlt?

### ✅ **Starke Kombination vorhanden:**

| Element | JSON | Docs | Kombination |
|---------|------|------|-------------|
| **Akteur-Taxonomie** | ✅ 17 Archetypen strukturiert | ✅ 3 NPCs charakterisiert | ⚠️ Braucht Mapping |
| **Techniken/Abilities** | ✅ 28 DISARM Techniques mit Effects | ⚠️ Konzeptuell erwähnt | ⚠️ Braucht Ability-System |
| **Szenarien** | ✅ 8 Cases strukturiert | ✅ 3 Szenarien tief recherchiert | ⚠️ Braucht Integration |
| **Ressourcen** | ✅ 4 Resources definiert | ✅ 3 Resources im Spiel | ⚠️ Braucht Vereinheitlichung |
| **Game Design** | ✅ Attributes, Progression, Difficulty | ✅ Vision, Narrative, NPCs | ⚠️ Braucht Implementierung |

---

## 🔴 **KRITISCHE LÜCKEN - Was fehlt komplett?**

### 1. **Event-System** (fehlt in beiden)
- ❌ E-Mail/Inbox-Templates
- ❌ Event-Trigger-Logic (Wann erscheint welches Event?)
- ❌ Event-Consequences (Was passiert bei welcher Wahl?)
- ❌ Branching-Narrative (Welche Events führen zu anderen?)
- ❌ Random vs. Scripted Events

### 2. **Detection & Consequences** (fehlt in beiden)
- ❌ Detection-Algorithm (Wie wird der Spieler aufgedeckt?)
- ❌ Risk-Berechnung (Wie hoch ist Risk bei T0086 Deepfakes?)
- ❌ Failure-States (Was passiert wenn Bot-Netzwerk aufgedeckt wird?)
- ❌ Investigation-System (Wie bauen Journalisten einen Case gegen dich auf?)
- ❌ Game-Over-Conditions (Wann verliert man?)

### 3. **Progression & Unlocks** (JSON hat Phasen, aber keine Logic)
- ❌ Unlock-System (Wann schaltet man T0086 Deepfakes frei?)
- ❌ Tech-Tree-Struktur (Muss man T0025 AI-Text vor T0086 haben?)
- ❌ NPC-Freischaltung (Bekommt man alle NPCs von Anfang an?)
- ❌ Difficulty-Progression (Werden Gegner stärker über Zeit?)

### 4. **Opposition & Antagonisten** (fehlt in JSON, implizit in Docs)
- ❌ Opposition-Archetypen (Investigative Journalisten, Fact-Checkers, Regulatoren)
- ❌ Opposition-Fähigkeiten (Was können sie gegen dich tun?)
- ❌ Opposition-AI (Wie agieren sie? Reaktiv oder proaktiv?)
- ❌ Multi-Actor-Opposition (Können sie zusammenarbeiten?)

### 5. **Balancing & Playtesting** (JSON hat Placeholder-Werte)
- ❌ Kosten-Balancing (Sind 100💰 für Deepfakes richtig?)
- ❌ Effekt-Balancing (Ist +60% Amplification zu stark?)
- ❌ Ressourcen-Generierung (Wie schnell verdient man Geld/Credibility?)
- ❌ Win-Probability-Kurve (Ist das Spiel zu leicht/schwer?)

### 6. **Tutorial & Onboarding** (fehlt in beiden)
- ❌ Tutorial-Szenario (Schritt-für-Schritt Einführung)
- ❌ NPC-Introductions (Wie lernt man NPCs kennen?)
- ❌ Ability-Erklärungen (In-Game-Tooltips)
- ❌ Feedback-System (Zeigt dem Spieler was funktioniert)

### 7. **Educational Layer** (Vision in Docs, keine Implementierung)
- ❌ Debriefing-System (Was hat der Spieler gelernt?)
- ❌ Real-World-Mappings (Zeigt echte Cases nach Gameplay)
- ❌ Encyclopedia-Integration (DISARM-Referenzen im Spiel)
- ❌ Reflection-Prompts (Moralische Fragen nach Entscheidungen)

### 8. **UI/UX-Spezifikation** (Wireframes fehlen)
- ❌ Screen-Layouts (Office, Inbox, NPC-Räume, etc.)
- ❌ Navigation-Flow (Wie bewegt man sich durchs Spiel?)
- ❌ Feedback-Visuals (Wie sieht man Ressourcen-Changes?)
- ❌ Retro-Ästhetik-Specs (Pixel-Art-Stil, Farbpalette, etc.)

---

## 🎯 **NÄCHSTE SCHRITTE - Empfehlungen**

### **Phase 1: Data-Integration** (JSON → Code)
1. Importiere `02_graph_unverified_full.json` als Actor/Technique-Datenbank
2. Mappe JSON-IDs zu Game-Entities (Actor.id → NPC-Referenz)
3. Erstelle Ability-System aus DISARM-Techniques
4. Implementiere Ressourcen-System (vereinheitliche JSON + Docs)

### **Phase 2: Fehlende Systeme designen**
1. **Event-System:** Template-basiertes E-Mail-System mit Branching
2. **Detection-System:** Risk-basierte Aufdeckungs-Mechanik
3. **Opposition-System:** Gegner-Archetypen + AI-Behavior
4. **Progression-System:** Tech-Tree + Unlock-Logic

### **Phase 3: Content-Erstellung**
1. **NPC-Charakterisierung:** Namen, Dialoge, Persönlichkeiten für 3-5 NPCs
2. **Event-Library:** 50-100 E-Mail-Templates für 32 Tage
3. **Szenario-Integration:** COVID + Ukraine in JSON-Format
4. **Tutorial-Szenario:** Einfaches erstes Spiel als Onboarding

### **Phase 4: Balancing & Playtesting**
1. Kosten/Effekte justieren
2. Difficulty-Skalierung testen
3. Win/Loss-Balance überprüfen
4. Educational Value evaluieren

---

## 📎 **Anhang: Mapping-Tabellen zur Referenz**

### A. JSON Actor IDs → Game NPCs Quick Reference

```
actor.nonstate.political_consult → Strategie-Direktor
infra.troll_farm → Bot-Farm Tech-Chef
infra.ai_content_generator → Medien-Leiter (AI-Abteilung)
infra.meme_factory → Medien-Leiter (Meme-Abteilung)
infra.domain_network → Strategie-Direktor (Web-Ops)
actor.individual.pseudo_expert.* → Recruitable Characters (Pool)
```

### B. DISARM Technique IDs → NPC Quick Reference

```
T0001, T0073, T0074, T0024, T0039, T0053, T0057, T0058, T0142, T0080, T0081, T0083 → Strategie-Direktor
T0003, T0023, T0025, T0086, T0141, T0063, T0082 → Medien-Leiter
T0004, T0097, T0143, T0034, T0035, T0046, T0121, T0049, T0060, T0062 → Bot-Farm Tech-Chef
```

### C. Ressourcen-Mapping

```
💰 Budget → [nicht im JSON, in Docs]
👁️ Credibility → game.resource.credibility
🏭 Production → [nicht im JSON, in Docs]
📞 Contacts → game.resource.contacts
🤝 Platform Coop → game.resource.platform_coop
⏰ Actions → game.resource.time
```

---

**Ende des Mapping-Dokuments**

Dieses Dokument sollte als Brücke zwischen JSON-Daten und Game-Vision dienen. Die identifizierten Lücken zeigen klar, wo weitere Design-Arbeit nötig ist.
