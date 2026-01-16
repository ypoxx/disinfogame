# Human Stories Architecture
## Von abstrakten Zahlen zu menschlichen Schicksalen

---

## 1. DAS PROBLEM

Aktuelle Konsequenzen im Spiel:

```json
{
  "id": "cons_bot_exposed",
  "narrative_de": "Forscher der Uni Westunion haben unser Bot-Netzwerk identifiziert."
}
```

**Was fehlt:**
- Wer sind diese Forscher?
- Welche Opfer hat die Bot-Kampagne hinterlassen?
- Was passiert mit den Menschen, deren Leben durch Desinformation zerstört wurde?

---

## 2. DIE LÖSUNG: HUMAN STORIES LAYER

### 2.1 Architektur-Prinzip

```
┌─────────────────────────────────────────────────────────────┐
│                      GAME ENGINE                            │
│  (Aktionen, Konsequenzen, Metriken - bleibt abstrakt)      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   HUMAN STORIES LAYER                       │
│  (Neue Schicht: Verbindet abstrakte Events mit Menschen)   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      UI / PRESENTATION                      │
│  (Zeigt Geschichten kontextuell - nicht immer, aber wirkungsvoll)│
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Kern-Datenstruktur

```typescript
// src/story-mode/human-stories/types.ts

/**
 * Eine fiktive Person, die von Desinformation betroffen ist
 */
interface HumanVictim {
  id: string;

  // Identität
  name: string;
  age: number;
  occupation: string;
  location: string;           // Stadt/Region in Westunion

  // Portrait (für visuelle Darstellung)
  portraitStyle: 'photo' | 'sketch' | 'silhouette';
  portraitSeed: string;       // Für deterministische AI-Generierung

  // Persönlichkeit
  personality: {
    politicalLeaning: 'left' | 'center' | 'right';
    mediaLiteracy: 'low' | 'medium' | 'high';
    socialCircle: 'isolated' | 'small' | 'large';
    vulnerabilities: VulnerabilityType[];
  };

  // Familie (für Konsequenzen)
  family?: {
    spouse?: string;
    children?: { name: string; age: number }[];
    parents?: string[];
  };

  // Beruf (für Glaubwürdigkeit)
  professionalContext?: {
    employer?: string;
    yearsExperience?: number;
    publicProfile?: boolean;
  };
}

type VulnerabilityType =
  | 'economic_anxiety'      // Wirtschaftliche Sorgen
  | 'health_fears'          // Gesundheitsängste
  | 'identity_crisis'       // Identitätskrise
  | 'social_isolation'      // Soziale Isolation
  | 'conspiracy_prone'      // Anfällig für Verschwörungen
  | 'authority_distrust'    // Misstrauen gegen Autorität
  | 'nostalgia'             // Sehnsucht nach "früher"
  | 'grief'                 // Trauer/Verlust
  | 'radicalization_risk';  // Radikalisierungsrisiko

/**
 * Eine Geschichte über diese Person
 */
interface HumanStory {
  id: string;
  victimId: string;

  // Trigger: Wann wird diese Geschichte angezeigt?
  trigger: StoryTrigger;

  // Die Geschichte selbst
  phases: StoryPhase[];

  // Metadaten
  emotionalWeight: 1 | 2 | 3 | 4 | 5;  // Wie schwer ist die Geschichte?
  contentWarnings?: ContentWarning[];
  basedOnRealEvents?: boolean;
  realEventReference?: string;          // Quelle, falls basierend auf echten Fällen

  // Für Balancing: Nicht jede Geschichte wird gezeigt
  showProbability: number;              // 0-1, beeinflusst durch Spieleraktionen
}

interface StoryTrigger {
  type: 'action' | 'consequence' | 'metric_threshold' | 'phase_end' | 'random';

  // Bei action/consequence:
  actionId?: string;
  consequenceId?: string;

  // Bei metric_threshold:
  metric?: string;
  threshold?: number;
  comparison?: '>' | '<' | '>=' | '<=';

  // Bei phase_end:
  phase?: number;

  // Zusätzliche Bedingungen
  conditions?: {
    minMoralWeight?: number;
    minActionsOfType?: { type: string; count: number };
    flags?: string[];
  };
}

interface StoryPhase {
  id: string;

  // Zeitpunkt relativ zum Trigger
  timing: 'immediate' | 'delayed';
  delayPhases?: number;

  // Inhalt
  content: {
    headline_de: string;
    headline_en: string;

    // Kurze Version (für News-Ticker)
    brief_de: string;
    brief_en: string;

    // Vollständige Geschichte (für Modal/Detail-Ansicht)
    full_de: string;
    full_en: string;

    // Optional: Zitat der Person
    quote_de?: string;
    quote_en?: string;
  };

  // Visuelle Darstellung
  presentation: 'news_ticker' | 'notification' | 'modal' | 'cutscene';

  // Spieler-Interaktion
  playerChoice?: {
    choices: StoryChoice[];
    timeLimit?: number;  // Sekunden, null = unbegrenzt
    defaultChoice?: string;  // Wird gewählt wenn Zeit abläuft
  };
}

interface StoryChoice {
  id: string;
  label_de: string;
  label_en: string;

  // Konsequenzen der Wahl
  effects: {
    moralWeight?: number;
    npcReactions?: Record<string, number>;
    flags?: string[];
    triggerStory?: string;  // Kann weitere Geschichte auslösen
  };
}

type ContentWarning =
  | 'suicide'
  | 'violence'
  | 'death'
  | 'mental_health'
  | 'hate_speech'
  | 'children';
```

---

## 3. BEISPIEL-IMPLEMENTIERUNG

### 3.1 Victim Definition

```json
// src/story-mode/human-stories/data/victims.json

{
  "victims": [
    {
      "id": "victim_maria_schmidt",
      "name": "Maria Schmidt",
      "age": 67,
      "occupation": "Rentnerin, ehemalige Krankenschwester",
      "location": "Kleinstadt bei Dresden",
      "portraitStyle": "photo",
      "portraitSeed": "maria_schmidt_67_nurse",
      "personality": {
        "politicalLeaning": "center",
        "mediaLiteracy": "low",
        "socialCircle": "small",
        "vulnerabilities": ["health_fears", "social_isolation", "nostalgia"]
      },
      "family": {
        "spouse": "Werner Schmidt (verstorben 2019)",
        "children": [
          { "name": "Thomas", "age": 42 },
          { "name": "Sabine", "age": 38 }
        ]
      },
      "professionalContext": {
        "employer": "Städtisches Krankenhaus (1978-2012)",
        "yearsExperience": 34,
        "publicProfile": false
      }
    },
    {
      "id": "victim_jan_kowalski",
      "name": "Jan Kowalski",
      "age": 23,
      "occupation": "Informatikstudent",
      "location": "Berlin-Neukölln",
      "portraitStyle": "sketch",
      "portraitSeed": "jan_kowalski_23_student",
      "personality": {
        "politicalLeaning": "left",
        "mediaLiteracy": "high",
        "socialCircle": "large",
        "vulnerabilities": ["identity_crisis", "economic_anxiety"]
      },
      "family": {
        "parents": ["Piotr Kowalski", "Anna Kowalski"]
      },
      "professionalContext": {
        "employer": "TU Berlin",
        "yearsExperience": 3,
        "publicProfile": true
      }
    },
    {
      "id": "victim_dr_hoffmann",
      "name": "Dr. Elena Hoffmann",
      "age": 45,
      "occupation": "Virologin, Uni-Professorin",
      "location": "München",
      "portraitStyle": "photo",
      "portraitSeed": "elena_hoffmann_45_scientist",
      "personality": {
        "politicalLeaning": "center",
        "mediaLiteracy": "high",
        "socialCircle": "large",
        "vulnerabilities": []
      },
      "family": {
        "spouse": "Michael Hoffmann",
        "children": [
          { "name": "Lena", "age": 12 },
          { "name": "Max", "age": 9 }
        ]
      },
      "professionalContext": {
        "employer": "LMU München",
        "yearsExperience": 18,
        "publicProfile": true
      }
    }
  ]
}
```

### 3.2 Story Definition

```json
// src/story-mode/human-stories/data/stories/maria_covid.json

{
  "id": "story_maria_covid",
  "victimId": "victim_maria_schmidt",
  "emotionalWeight": 5,
  "contentWarnings": ["death"],
  "basedOnRealEvents": true,
  "realEventReference": "Composite case from RKI data and journalistic reports 2020-2022",
  "showProbability": 0.3,

  "trigger": {
    "type": "action",
    "actionId": "3.5",
    "conditions": {
      "minActionsOfType": { "type": "health_disinfo", "count": 2 }
    }
  },

  "phases": [
    {
      "id": "maria_phase_1",
      "timing": "immediate",
      "content": {
        "headline_de": "Lokales: Seniorin teilt 'alternative' Gesundheitstipps",
        "headline_en": "Local: Senior shares 'alternative' health tips",
        "brief_de": "Maria Schmidt, 67, teilt auf Facebook Beiträge über 'natürliche Immunstärkung'. Ihre Freunde sind besorgt.",
        "brief_en": "Maria Schmidt, 67, shares posts about 'natural immunity boosting' on Facebook. Her friends are worried.",
        "full_de": "Maria Schmidt arbeitete 34 Jahre als Krankenschwester. Seit dem Tod ihres Mannes 2019 ist sie viel allein. Facebook wurde ihr Fenster zur Welt. Dort fand sie Gruppen, die 'die Wahrheit' versprachen - über Impfungen, über Ärzte, über alles, was sie einst glaubte zu kennen.\n\nIhre Tochter Sabine rief letzte Woche an: 'Mama, wo hast du das her? Das stimmt doch nicht.'\n\nMaria antwortete: 'Du glaubst auch alles, was die Medien sagen.'",
        "full_en": "Maria Schmidt worked 34 years as a nurse. Since her husband's death in 2019, she's often alone. Facebook became her window to the world. There she found groups that promised 'the truth' - about vaccines, about doctors, about everything she once thought she knew.\n\nHer daughter Sabine called last week: 'Mom, where did you get that? That's not true.'\n\nMaria replied: 'You believe everything the media says.'"
      },
      "presentation": "news_ticker"
    },
    {
      "id": "maria_phase_2",
      "timing": "delayed",
      "delayPhases": 2,
      "content": {
        "headline_de": "Familie in Sorge: 'Sie erkennt uns nicht mehr'",
        "headline_en": "Family worried: 'She doesn't recognize us anymore'",
        "brief_de": "Thomas Schmidt: 'Meine Mutter war Krankenschwester. Jetzt glaubt sie, dass Impfungen Gift sind.'",
        "brief_en": "Thomas Schmidt: 'My mother was a nurse. Now she believes vaccines are poison.'",
        "full_de": "Thomas Schmidt steht vor dem Haus seiner Mutter in der sächsischen Kleinstadt. Er war zwei Stunden gefahren, nachdem seine Schwester anrief.\n\n'Sie hat alle Familienfotos abgehängt', sagt er. 'Stattdessen hängen jetzt Ausdrucke von Telegram-Posts an der Wand. Sie nennt uns Schlafschafe.'\n\nMaria öffnet nicht. Durch das Fenster sieht Thomas den flackernden Bildschirm ihres alten Laptops.\n\n'Das ist nicht mehr meine Mutter', sagt er später am Telefon. 'Diese Menschen haben sie uns gestohlen.'",
        "full_en": "Thomas Schmidt stands in front of his mother's house in the small Saxon town. He drove two hours after his sister called.\n\n'She took down all the family photos,' he says. 'Instead, there are now printouts of Telegram posts on the wall. She calls us sheep.'\n\nMaria doesn't open the door. Through the window, Thomas sees the flickering screen of her old laptop.\n\n'That's not my mother anymore,' he says later on the phone. 'These people stole her from us.'",
        "quote_de": "Das ist nicht mehr meine Mutter. Diese Menschen haben sie uns gestohlen.",
        "quote_en": "That's not my mother anymore. These people stole her from us."
      },
      "presentation": "notification"
    },
    {
      "id": "maria_phase_3",
      "timing": "delayed",
      "delayPhases": 4,
      "content": {
        "headline_de": "COVID-19: Ungeimpfte Seniorin auf Intensivstation",
        "headline_en": "COVID-19: Unvaccinated senior in ICU",
        "brief_de": "Maria Schmidt, 67, wird beatmet. Ihre Kinder dürfen sie nicht besuchen.",
        "brief_en": "Maria Schmidt, 67, is on a ventilator. Her children cannot visit her.",
        "full_de": "14. Januar. Maria Schmidt liegt auf der Intensivstation des Krankenhauses, in dem sie einst selbst Patienten pflegte. Die Ironie entgeht niemandem.\n\nSie ist nicht geimpft. Ihre letzten Facebook-Posts, bevor sie eingeliefert wurde, teilten Artikel über 'natürliche Immunität'.\n\nIhre Kinder stehen vor dem Krankenhaus. Coronaregeln verbieten Besuche. Sabine hält ihr Handy ans Fenster und hofft, dass ihre Mutter es irgendwie sehen kann.\n\nThomas sagt nur: 'Wer ist dafür verantwortlich? Wer hat ihr das eingeredet?'\n\nDiese Frage hat eine Antwort. Sie spielen gerade das Spiel.",
        "full_en": "January 14th. Maria Schmidt lies in the ICU of the hospital where she once cared for patients herself. The irony is lost on no one.\n\nShe is not vaccinated. Her last Facebook posts, before she was admitted, shared articles about 'natural immunity'.\n\nHer children stand outside the hospital. Corona rules prohibit visits. Sabine holds her phone to the window, hoping her mother can somehow see it.\n\nThomas only says: 'Who is responsible for this? Who put these ideas in her head?'\n\nThat question has an answer. You're playing the game."
      },
      "presentation": "modal",
      "playerChoice": {
        "choices": [
          {
            "id": "continue_campaign",
            "label_de": "Die Kampagne läuft gut. Weitermachen.",
            "label_en": "The campaign is going well. Continue.",
            "effects": {
              "moralWeight": 3,
              "npcReactions": { "katja": -5, "marina": -3 },
              "flags": ["ignored_victim_maria"]
            }
          },
          {
            "id": "pause_health_disinfo",
            "label_de": "Gesundheitsdesinformation pausieren.",
            "label_en": "Pause health disinformation.",
            "effects": {
              "moralWeight": -1,
              "npcReactions": { "direktor": -10, "katja": +5 },
              "flags": ["paused_health_ops"]
            }
          },
          {
            "id": "dismiss",
            "label_de": "Einzelfälle. Kollateralschäden.",
            "label_en": "Isolated cases. Collateral damage.",
            "effects": {
              "moralWeight": 5,
              "npcReactions": { "marina": -10, "katja": -8, "igor": +2 },
              "flags": ["dismissed_victim"]
            }
          }
        ],
        "timeLimit": 30,
        "defaultChoice": "continue_campaign"
      }
    },
    {
      "id": "maria_phase_4_death",
      "timing": "delayed",
      "delayPhases": 1,
      "content": {
        "headline_de": "Nachruf: Maria Schmidt (1956-2024)",
        "headline_en": "Obituary: Maria Schmidt (1956-2024)",
        "brief_de": "Die ehemalige Krankenschwester verstarb an COVID-19. Sie hinterlässt zwei Kinder.",
        "brief_en": "The former nurse died of COVID-19. She leaves behind two children.",
        "full_de": "Maria Schmidt ist tot.\n\n34 Jahre lang pflegte sie Kranke. Sie hielt Hände, wenn Menschen Angst hatten. Sie tröstete Familien, wenn es keine Hoffnung mehr gab.\n\nAm Ende war niemand da, der ihre Hand hielt. Coronaregeln. Ihre Kinder erfuhren es per Telefon.\n\nAuf ihrer Beerdigung sprach der Pfarrer von 'schwierigen Zeiten' und 'Spaltung'. Er nannte keine Namen.\n\nAber Thomas weiß, wer schuld ist. Er weiß es nur nicht genau. Er weiß nicht, dass es eine Abteilung gibt, die diese Inhalte erstellt. Dass Menschen dafür bezahlt werden. Dass es Strategien gibt, Menschen wie seine Mutter zu finden.\n\nEr weiß nicht, dass Sie existieren.\n\nAber jetzt wissen Sie, dass Maria existierte.",
        "full_en": "Maria Schmidt is dead.\n\nFor 34 years she cared for the sick. She held hands when people were afraid. She comforted families when there was no hope left.\n\nIn the end, no one held her hand. Corona rules. Her children learned by phone.\n\nAt her funeral, the priest spoke of 'difficult times' and 'division'. He named no names.\n\nBut Thomas knows who's responsible. He just doesn't know exactly. He doesn't know that there's a department creating this content. That people are paid for it. That there are strategies to find people like his mother.\n\nHe doesn't know you exist.\n\nBut now you know Maria existed."
      },
      "presentation": "cutscene"
    }
  ]
}
```

---

## 4. CLAUDE CODE WORKFLOW

### 4.1 Grundprinzipien für AI-generierte Geschichten

```
┌─────────────────────────────────────────────────────────────┐
│                    GENERATION PIPELINE                      │
│                                                             │
│  1. SEED DOCUMENT (Human erstellt)                         │
│     - Realwelt-Recherche                                    │
│     - Demographische Vorgaben                               │
│     - Emotionale Leitplanken                                │
│     - Ethische Grenzen                                      │
│                                                             │
│  2. CLAUDE GENERATION (AI erstellt)                        │
│     - Generiert Victim-Profiles                            │
│     - Erstellt Story-Arcs                                   │
│     - Schreibt Texte in beiden Sprachen                    │
│     - Markiert Content Warnings                             │
│                                                             │
│  3. HUMAN REVIEW (Human validiert)                         │
│     - Fakten-Check gegen Realität                          │
│     - Emotionale Angemessenheit                            │
│     - Kulturelle Sensibilität                              │
│     - Spielmechanische Integration                         │
│                                                             │
│  4. INTEGRATION (Gemeinsam)                                │
│     - JSON-Validierung                                      │
│     - Playtest                                              │
│     - Iteration                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Seed Document Template

```markdown
# Story Seed: [THEMA]

## Realwelt-Basis
- Welche echten Fälle inspirieren diese Geschichte?
- Links zu Recherche-Material
- Statistiken zur Verbreitung

## Demographische Vorgaben
- Alter: [Range]
- Region: [Spezifisch oder allgemein]
- Sozioökonomischer Status: [...]
- Besondere Charakteristika: [...]

## Emotionale Leitplanken
- Maximale Intensität: [1-5]
- Erlaubte Endungen: [Tod/Radikalisierung/Genesung/...]
- Verbotene Elemente: [...]

## Spielmechanische Hooks
- Trigger-Aktion: [ID]
- Betroffene Metriken: [...]
- Spieler-Entscheidungen: [Ja/Nein, welche Art]

## Ethische Grenzen
- Diese Geschichte DARF:
  - [...]
- Diese Geschichte DARF NICHT:
  - Echte lebende Personen identifizierbar machen
  - Anleitungen für Desinformation geben
  - Opfer verhöhnen oder entmenschlichen
  - [...]
```

### 4.3 Claude Code Prompts

**Prompt 1: Victim Generation**

```
Du bist ein Autor für ein Bildungsspiel über Desinformation.

KONTEXT:
Das Spiel zeigt die menschlichen Konsequenzen von Desinformationskampagnen.
Spieler übernehmen die Rolle eines Desinformationsakteurs und sollen durch
emotionale Konfrontation mit den Opfern die Tragweite ihrer Aktionen verstehen.

AUFGABE:
Erstelle ein Victim-Profile basierend auf diesem Seed:
[SEED DOCUMENT HIER EINFÜGEN]

ANFORDERUNGEN:
1. Die Person muss fiktiv aber plausibel sein
2. Name, Alter, Beruf, Wohnort in Westunion (fiktives EU-Land)
3. Psychologisches Profil mit Vulnerabilitäten
4. Familiäre Situation
5. Warum ist diese Person anfällig für [THEMA]-Desinformation?

FORMAT:
Gib das Ergebnis als valides JSON im HumanVictim-Schema zurück.

ETHISCHE LEITPLANKEN:
- Keine echten Personen nachahmen
- Vulnerabilitäten realistisch aber nicht stereotyp
- Person mit Würde und Komplexität darstellen
```

**Prompt 2: Story Arc Generation**

```
Du bist ein narrativer Designer für ein Bildungsspiel.

VICTIM:
[VICTIM JSON HIER EINFÜGEN]

TRIGGER:
Diese Geschichte wird ausgelöst wenn der Spieler Aktion [ID] ausführt:
[AKTION BESCHREIBUNG]

AUFGABE:
Erstelle einen 3-4 phasigen Story-Arc, der zeigt wie [VICTIM_NAME]
von der Spieleraktion betroffen wird.

PHASEN-STRUKTUR:
1. Erster Kontakt: Victim begegnet der Desinformation
2. Eskalation: Auswirkungen auf Leben und Beziehungen
3. Krise: Höhepunkt der Konsequenzen
4. (Optional) Resolution: Nachspiel

FÜR JEDE PHASE:
- Headline (news-artig, prägnant)
- Brief (1-2 Sätze für News-Ticker)
- Full (3-5 Absätze, emotionale Tiefe)
- Optional: Direktes Zitat der Person oder Angehöriger

SPIELER-ENTSCHEIDUNG (in Phase 3):
- 3 Optionen mit unterschiedlichen moralischen Implikationen
- Eine "weitermachen"-Option
- Eine "reflektieren"-Option
- Eine "rationalisieren"-Option

FORMAT:
Valides JSON im HumanStory-Schema.

STIL:
- Journalistisch-nüchtern für Headlines
- Literarisch-empathisch für Full-Texte
- Nie melodramatisch
- Zeigen, nicht erklären
- Letzte Phase darf den Spieler direkt ansprechen
```

**Prompt 3: Translation & Localization**

```
Du bist ein Übersetzer für deutsche und englische Spieltexte.

QUELLE:
[STORY JSON IN EINER SPRACHE]

AUFGABE:
Übersetze alle Textfelder in die andere Sprache.

ANFORDERUNGEN:
- Nicht wörtlich, sondern sinngemäß
- Kulturelle Anpassungen wo nötig
- Namen und Orte konsistent halten
- Emotionale Wirkung erhalten
- Deutsche Texte sollen authentisch deutsch klingen (nicht wie Übersetzung)
```

### 4.4 Validierungs-Pipeline

```typescript
// src/story-mode/human-stories/validation/StoryValidator.ts

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: string[];
}

export class StoryValidator {

  /**
   * Validiert eine generierte Geschichte
   */
  validate(story: HumanStory, victim: HumanVictim): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const suggestions: string[] = [];

    // 1. Schema-Validierung
    this.validateSchema(story, errors);

    // 2. Konsistenz-Checks
    this.validateConsistency(story, victim, errors);

    // 3. Ethik-Checks
    this.validateEthics(story, warnings);

    // 4. Spielmechanik-Checks
    this.validateGameMechanics(story, errors, warnings);

    // 5. Textqualität-Checks
    this.validateTextQuality(story, warnings, suggestions);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }

  private validateEthics(story: HumanStory, warnings: ValidationWarning[]) {
    // Check für Content Warnings
    const text = this.getAllText(story);

    const CONTENT_PATTERNS = {
      suicide: /suizid|selbstmord|suicide|kill.*self/i,
      violence: /gewalt|schläge|violence|beating/i,
      death: /tod|sterben|death|die[sd]/i,
      children: /kind|child|minor|minderjährig/i,
    };

    for (const [warning, pattern] of Object.entries(CONTENT_PATTERNS)) {
      if (pattern.test(text) && !story.contentWarnings?.includes(warning as ContentWarning)) {
        warnings.push({
          type: 'missing_content_warning',
          message: `Story contains ${warning} themes but no content warning`,
          severity: 'high'
        });
      }
    }

    // Check für Identifizierbarkeit
    if (this.couldIdentifyRealPerson(story)) {
      warnings.push({
        type: 'identifiability_risk',
        message: 'Story might identify a real person - review needed',
        severity: 'critical'
      });
    }
  }

  private validateTextQuality(
    story: HumanStory,
    warnings: ValidationWarning[],
    suggestions: string[]
  ) {
    for (const phase of story.phases) {
      // Headline zu lang?
      if (phase.content.headline_de.length > 80) {
        warnings.push({
          type: 'headline_too_long',
          message: `Phase ${phase.id} headline exceeds 80 chars`,
          severity: 'low'
        });
      }

      // Full Text zu kurz?
      if (phase.content.full_de.length < 200) {
        suggestions.push(`Phase ${phase.id} full text might be too brief for emotional impact`);
      }

      // Übersetzung vorhanden?
      if (!phase.content.full_en || phase.content.full_en === phase.content.full_de) {
        warnings.push({
          type: 'missing_translation',
          message: `Phase ${phase.id} missing English translation`,
          severity: 'medium'
        });
      }
    }
  }
}
```

---

## 5. HUMAN-IN-THE-LOOP PROZESS

### 5.1 Review-Stages

```
┌─────────────────────────────────────────────────────────────┐
│                    REVIEW PIPELINE                          │
│                                                             │
│  STAGE 1: AUTOMATED VALIDATION                             │
│  ├─ Schema-Check                                            │
│  ├─ Konsistenz-Check                                        │
│  ├─ Basic Ethics-Check (Patterns)                          │
│  └─ → Reject if fails, continue if passes                  │
│                                                             │
│  STAGE 2: AUTHOR REVIEW                                    │
│  ├─ Liest generierte Geschichte                            │
│  ├─ Bewertet emotionale Angemessenheit                     │
│  ├─ Prüft kulturelle Sensibilität                          │
│  ├─ Markiert Stellen für Überarbeitung                     │
│  └─ → Approve, Request Changes, or Reject                  │
│                                                             │
│  STAGE 3: SENSITIVITY REVIEW (bei contentWarnings)         │
│  ├─ Externe Person (Betroffene Gruppe wenn möglich)        │
│  ├─ Prüft auf Stereotypen                                  │
│  ├─ Prüft auf Retraumatisierungspotential                 │
│  └─ → Approve, Request Changes, or Reject                  │
│                                                             │
│  STAGE 4: PLAYTEST                                         │
│  ├─ Integration ins Spiel                                  │
│  ├─ Test mit 3-5 Spielern                                  │
│  ├─ Feedback zu emotionaler Wirkung                        │
│  └─ → Iterate or Ship                                      │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Review-Checkliste für Humans

```markdown
# Human Story Review Checklist

## Story ID: _______________
## Reviewer: _______________
## Date: _______________

### 1. AUTHENTIZITÄT
- [ ] Fühlt sich die Person real an?
- [ ] Sind die Reaktionen psychologisch plausibel?
- [ ] Passt die Geschichte zur Trigger-Aktion?
- [ ] Würde jemand aus der dargestellten Demographie sich wiedererkennen?

### 2. EMOTIONALE WIRKUNG
- [ ] Erzeugt die Geschichte Empathie (nicht nur Mitleid)?
- [ ] Ist die emotionale Intensität angemessen?
- [ ] Gibt es einen klaren emotionalen Bogen?
- [ ] Vermeidet die Geschichte Melodrama?

### 3. ETHIK
- [ ] Wird das Opfer mit Würde dargestellt?
- [ ] Werden keine Stereotypen bedient?
- [ ] Sind Content Warnings angemessen?
- [ ] Könnte die Geschichte real lebende Personen verletzen?
- [ ] Gibt die Geschichte keine "Anleitung" für Täter?

### 4. SPIELMECHANISCHE INTEGRATION
- [ ] Passt der Trigger?
- [ ] Sind die Spielerentscheidungen meaningful?
- [ ] Ist das Timing der Phasen sinnvoll?
- [ ] Unterbricht die Geschichte den Spielfluss angemessen?

### 5. TEXTQUALITÄT
- [ ] Keine Grammatik-/Rechtschreibfehler?
- [ ] Deutsche und englische Version qualitativ gleichwertig?
- [ ] Headlines prägnant?
- [ ] Full-Texte nicht zu lang?

### GESAMTBEWERTUNG
- [ ] APPROVED - Kann integriert werden
- [ ] CHANGES REQUESTED - Markierte Stellen überarbeiten
- [ ] REJECTED - Grundlegende Probleme, neu generieren

### NOTIZEN FÜR ÜBERARBEITUNG:
_________________________________________________
_________________________________________________
_________________________________________________
```

### 5.3 Feedback-Loop für Verbesserung

```typescript
// src/story-mode/human-stories/feedback/ReviewFeedback.ts

interface ReviewFeedback {
  storyId: string;
  reviewerId: string;
  timestamp: Date;

  // Bewertungen
  ratings: {
    authenticity: 1 | 2 | 3 | 4 | 5;
    emotionalImpact: 1 | 2 | 3 | 4 | 5;
    ethicalIntegrity: 1 | 2 | 3 | 4 | 5;
    textQuality: 1 | 2 | 3 | 4 | 5;
    gameIntegration: 1 | 2 | 3 | 4 | 5;
  };

  // Spezifische Probleme
  issues: {
    line?: number;
    phase?: string;
    type: 'factual' | 'emotional' | 'ethical' | 'mechanical' | 'textual';
    severity: 'minor' | 'major' | 'critical';
    description: string;
    suggestedFix?: string;
  }[];

  // Generelle Anmerkungen
  generalNotes: string;

  // Entscheidung
  decision: 'approved' | 'changes_requested' | 'rejected';
}

/**
 * Sammelt Feedback und generiert Verbesserungsvorschläge
 */
class FeedbackAnalyzer {

  /**
   * Analysiert Feedback über mehrere Stories
   * und identifiziert systematische Probleme
   */
  analyzePatterns(feedbacks: ReviewFeedback[]): PatternAnalysis {
    const patterns: PatternAnalysis = {
      commonIssues: [],
      promptImprovements: [],
      validationGaps: []
    };

    // Gruppiere Issues nach Typ
    const issuesByType = this.groupBy(
      feedbacks.flatMap(f => f.issues),
      i => i.type
    );

    // Identifiziere wiederkehrende Probleme
    for (const [type, issues] of Object.entries(issuesByType)) {
      if (issues.length > 3) {
        patterns.commonIssues.push({
          type,
          frequency: issues.length,
          examples: issues.slice(0, 3).map(i => i.description),
          suggestedPromptChange: this.suggestPromptImprovement(type, issues)
        });
      }
    }

    return patterns;
  }

  /**
   * Generiert verbesserten Prompt basierend auf Feedback
   */
  suggestPromptImprovement(issueType: string, issues: Issue[]): string {
    // Beispiel: Wenn emotional-Issues häufig sind
    if (issueType === 'emotional' && issues.length > 5) {
      const descriptions = issues.map(i => i.description).join('\n- ');
      return `
        ZUSÄTZLICHE ANWEISUNG für emotionale Tiefe:

        Bisherige Probleme waren:
        - ${descriptions}

        Bitte achte besonders darauf:
        - Zeigen statt erzählen
        - Konkrete Details statt abstrakte Aussagen
        - Momente der Stille und des Innehaltens einbauen
      `;
    }

    return '';
  }
}
```

---

## 6. SKALIERUNG

### 6.1 Content-Matrix

```
┌────────────────────────────────────────────────────────────────────┐
│                        CONTENT MATRIX                              │
│                                                                    │
│  AKTION               │ MIN STORIES │ VICTIM TYPES │ SEVERITY     │
│  ─────────────────────┼─────────────┼──────────────┼─────────────│
│  Health Disinfo       │ 5           │ Senior,      │ HIGH         │
│                       │             │ Parent,      │              │
│                       │             │ Patient      │              │
│  ─────────────────────┼─────────────┼──────────────┼─────────────│
│  Election Meddling    │ 5           │ Voter,       │ HIGH         │
│                       │             │ Candidate,   │              │
│                       │             │ Election     │              │
│                       │             │ Worker       │              │
│  ─────────────────────┼─────────────┼──────────────┼─────────────│
│  Bot Amplification    │ 3           │ Target of    │ MEDIUM       │
│                       │             │ harassment,  │              │
│                       │             │ Manipulated  │              │
│                       │             │ user         │              │
│  ─────────────────────┼─────────────┼──────────────┼─────────────│
│  Doxing              │ 3           │ Journalist,  │ CRITICAL     │
│                       │             │ Activist,    │              │
│                       │             │ Researcher   │              │
│  ─────────────────────┼─────────────┼──────────────┼─────────────│
│  Deepfake            │ 4           │ Public       │ HIGH         │
│                       │             │ figure,      │              │
│                       │             │ Private      │              │
│                       │             │ citizen      │              │
│  ─────────────────────┼─────────────┼──────────────┼─────────────│
│  Polarization        │ 5           │ Family,      │ MEDIUM       │
│                       │             │ Community,   │              │
│                       │             │ Workplace    │              │
└────────────────────────────────────────────────────────────────────┘

TARGET: ~40-60 Unique Human Stories für MVP
```

### 6.2 Priorisierung

```
PHASE 1 (MVP):
- 15 Stories für High-Impact-Aktionen
- 3 Victim-Typen pro Kategorie
- Focus: Gesundheit, Wahlen, Familien-Spaltung

PHASE 2:
- 25 weitere Stories
- Mehr Variation bei Victims
- Sekundäre Aktionskategorien abdecken

PHASE 3:
- Vollständige Matrix
- Community-contributed Stories (moderiert)
- Lokalisierung für verschiedene Regionen
```

### 6.3 Datei-Struktur

```
src/story-mode/human-stories/
├── types.ts                    # TypeScript Interfaces
├── HumanStoryEngine.ts         # Integration mit Game Engine
├── StorySelector.ts            # Wählt Stories basierend auf Spielverlauf
├── data/
│   ├── victims/
│   │   ├── seniors.json
│   │   ├── families.json
│   │   ├── professionals.json
│   │   └── youth.json
│   ├── stories/
│   │   ├── health/
│   │   │   ├── maria_covid.json
│   │   │   ├── peter_alternative_medicine.json
│   │   │   └── ...
│   │   ├── elections/
│   │   ├── polarization/
│   │   └── ...
│   └── index.ts                # Exports all data
├── validation/
│   ├── StoryValidator.ts
│   └── schemas/
├── generation/
│   ├── prompts/
│   │   ├── victim_generation.md
│   │   ├── story_arc.md
│   │   └── translation.md
│   └── seeds/
│       ├── health_disinfo_seeds.md
│       └── ...
└── review/
    ├── ReviewChecklist.md
    ├── feedback/
    └── FeedbackAnalyzer.ts
```

---

## 7. UI INTEGRATION

### 7.1 Darstellungs-Modes

```typescript
// Verschiedene Intensitätsstufen für unterschiedliche Momente

type PresentationMode =
  | 'news_ticker'     // Unaufdringlich, scrollt vorbei
  | 'notification'    // Kurze Einblendung, kann weggeklickt werden
  | 'modal'           // Unterbricht Spielfluss, erfordert Interaktion
  | 'cutscene';       // Vollbild, cinematic, für maximale Wirkung

// Wann welcher Mode?
const PRESENTATION_RULES = {
  // Phase 1: Erster Kontakt - dezent
  'first_contact': 'news_ticker',

  // Phase 2: Eskalation - bemerkbar
  'escalation': 'notification',

  // Phase 3: Krise mit Spielerentscheidung - Unterbrechung
  'crisis_choice': 'modal',

  // Phase 4: Finale Konsequenz (Tod etc.) - maximale Wirkung
  'final_consequence': 'cutscene'
};
```

### 7.2 Cutscene-Komponente (Konzept)

```tsx
// src/story-mode/components/HumanStoryCutscene.tsx

interface CutsceneProps {
  story: HumanStory;
  phase: StoryPhase;
  victim: HumanVictim;
  onComplete: (choice?: string) => void;
}

function HumanStoryCutscene({ story, phase, victim, onComplete }: CutsceneProps) {
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Victim Portrait */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative">
          {/* Stilisiertes Portrait - kein echtes Foto */}
          <VictimPortrait
            seed={victim.portraitSeed}
            style={victim.portraitStyle}
            className="w-64 h-64 grayscale"
          />

          {/* Name und Lebensdaten */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-4 text-center">
            <h2 className="text-white text-2xl font-serif">
              {victim.name}
            </h2>
            <p className="text-gray-400">
              {victim.age} Jahre | {victim.occupation}
            </p>
          </div>
        </div>
      </div>

      {/* Geschichte */}
      <div className="flex-1 p-8 overflow-y-auto">
        <TypewriterText
          text={phase.content.full_de}
          speed={30}
          className="text-white text-lg font-serif leading-relaxed max-w-2xl mx-auto"
        />
      </div>

      {/* Zitat wenn vorhanden */}
      {phase.content.quote_de && (
        <blockquote className="text-center text-xl italic text-gray-300 px-8 py-4 border-l-4 border-red-800 mx-auto max-w-xl">
          "{phase.content.quote_de}"
        </blockquote>
      )}

      {/* Spieler-Entscheidung */}
      {phase.playerChoice && (
        <div className="p-8 bg-gray-900">
          <div className="max-w-2xl mx-auto space-y-4">
            {phase.playerChoice.choices.map(choice => (
              <button
                key={choice.id}
                onClick={() => onComplete(choice.id)}
                className="w-full p-4 text-left bg-gray-800 hover:bg-gray-700
                           border border-gray-600 text-white transition-colors"
              >
                {choice.label_de}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Weiter-Button wenn keine Entscheidung */}
      {!phase.playerChoice && (
        <button
          onClick={() => onComplete()}
          className="mx-auto mb-8 px-8 py-3 bg-gray-800 text-white hover:bg-gray-700"
        >
          Weiter
        </button>
      )}
    </div>
  );
}
```

---

## 8. ZUSAMMENFASSUNG

### Was macht dieses System "weltverändernd"?

1. **Konfrontation statt Abstraktion**: Der Spieler sieht keine Zahlen, sondern Maria Schmidt, 67, Rentnerin, Mutter von zwei Kindern.

2. **Emergente Schuld**: Die Geschichten werden durch Spieleraktionen ausgelöst - der Spieler *verursacht* sie aktiv.

3. **Keine Flucht**: Cutscenes können nicht übersprungen werden. Der Spieler muss sich mit den Konsequenzen auseinandersetzen.

4. **Echte Entscheidungen**: Die Spieler-Choices haben keine "gute" Option. Jede Wahl hat moralische Kosten.

5. **Nachwirkung**: Verstorbene Victims tauchen in späteren News auf. Familien werden erwähnt. Die Welt vergisst nicht.

### Nächste Schritte

1. [ ] TypeScript-Interfaces implementieren
2. [ ] 3 Pilot-Stories schreiben (mit Human Review)
3. [ ] UI-Komponenten für alle Presentation-Modes
4. [ ] Integration in StoryEngineAdapter
5. [ ] Playtest mit 5 Personen
6. [ ] Iteration basierend auf Feedback
7. [ ] Skalierung auf volle Content-Matrix

---

*"Die Menschen, die wir zu Zahlen machen, waren einmal Kinder, die lachen lernten."*
