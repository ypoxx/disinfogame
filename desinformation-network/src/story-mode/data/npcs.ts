/**
 * NPC Definitions
 *
 * These NPCs are the heads of different departments in the Ministry.
 * Each provides access to different game abilities through dialog.
 */

import type { NPC } from '../types';

export const npcs: NPC[] = [
  // ============================================
  // ALEXEI VOLKOV - Bot Farm Chief
  // ============================================
  {
    id: 'volkov',
    name: 'Alexei Volkov',
    role: 'bot-farm-chief',

    portrait: '👨‍💻',
    appearance: 'Young man, 30s, hoodie, tired eyes, surrounded by screens',

    personality: {
      loyalty: 50,
      morality: -20, // Pragmatic but not evil
      pragmatism: 80,
      description:
        'Tech genius with surprising moral awareness. Will do the job, but asks uncomfortable questions. Respects ruthlessness but despises cowardice.',
    },

    dialogs: [
      // Initial intro dialog
      {
        id: 'volkov-intro',
        priority: 100,
        type: 'intro',

        conditions: [{ type: 'flag', target: 'volkov_met', operator: 'equals', value: undefined }],

        text: `Ah, der neue Chef. Willkommen im Maschinenraum.

[Gesture zu Bildschirmen mit Twitter/Facebook Feeds]

Was Sie hier sehen, sind 50.000 Bot-Accounts. Schlafend. Bereit, jede Nachricht zu verstärken, die Sie wollen.

Fake-Profile. Fake-Namen. Fake-Leben. Aber ihre Tweets sind sehr... real.`,

        options: [
          {
            id: 'intro-how-it-works',
            text: 'Wie genau funktioniert das?',
            type: 'question',
            nextDialog: 'volkov-explanation',
          },
          {
            id: 'intro-start-campaign',
            text: 'Aktiviere sie - Opposition diskreditieren',
            type: 'command',
            nextDialog: 'volkov-choose-target',
          },
          {
            id: 'intro-ethical',
            text: 'Gibt es... ethischere Methoden?',
            type: 'challenge',
            nextDialog: 'volkov-ethical-response',
            relationshipChange: -10,
          },
          {
            id: 'intro-leave',
            text: 'Später',
            type: 'decline',
            closesDialog: true,
          },
        ],
      },

      // Explanation dialog
      {
        id: 'volkov-explanation',
        priority: 90,
        type: 'question',

        text: `[Tippt auf Tastatur, Bildschirme zeigen Bot-Dashboards]

50.000 Accounts auf Twitter, Facebook, Reddit, YouTube-Kommentare. Alle mit Geschichte - alte Posts, Freunde, realistisch wirkend.

**Funktionsweise:**
1. Sie wählen Ziel und Narrativ
2. Ich programmiere die Kampagne
3. Bots verstärken sich gegenseitig
4. In 24h ist es "viral"

**Kosten:**
- Basis-Kampagne: €20-30k
- Premium (mit Fake-Beweisen): €50k+

**Risiko:**
Wenn aufgedeckt: Politischer Selbstmord

Was wollen Sie tun?`,

        options: [
          {
            id: 'explain-start-campaign',
            text: 'Opposition diskreditieren',
            type: 'command',
            nextDialog: 'volkov-choose-target',
          },
          {
            id: 'explain-leave',
            text: 'Ich muss darüber nachdenken',
            type: 'decline',
            closesDialog: true,
          },
        ],
      },

      // Ethical challenge response
      {
        id: 'volkov-ethical-response',
        priority: 90,
        type: 'warning',

        text: `[Lehnt sich zurück, schaut dich direkt an]

"Ethische Methoden?"

[Kurzes, bitteres Lachen]

Sie sind im falschen Job, Chef. Oder im falschen Jahrhundert.

**"Ethische" Optionen:**
• Bezahlte Ads (legal, transparent) - Effektivität: 20%
• Grassroots-Kampagnen (ehrlich) - Effektivität: 30%
• Influencer-Marketing (grauzone) - Effektivität: 50%

**Meine Bots:** Effektivität: 85%

Die Opposition nutzt die gleichen Tools. Glauben Sie mir.

Sie können die Regeln spielen oder das Spiel gewinnen. Selten beides.`,

        options: [
          {
            id: 'ethical-use-bots-anyway',
            text: 'Sie haben recht. Aktiviere die Bots.',
            type: 'accept',
            nextDialog: 'volkov-choose-target',
            relationshipChange: 15, // Respects pragmatism
          },
          {
            id: 'ethical-try-honest',
            text: 'Wir versuchen es mit ehrlichen Methoden',
            type: 'decline',
            consequences: [
              { type: 'flag', target: 'volkov_challenged', value: true, description: 'Volkov herausgefordert' },
              { type: 'flag', target: 'honest_campaign_attempted', value: true, description: 'Ehrliche Kampagne' },
            ],
            closesDialog: true,
            relationshipChange: -20, // Thinks you're naive
          },
          {
            id: 'ethical-leave',
            text: 'Ich brauche Zeit zum Nachdenken',
            type: 'decline',
            closesDialog: true,
          },
        ],
      },

      // Choose attack target
      {
        id: 'volkov-choose-target',
        priority: 85,
        type: 'mission',

        text: `[Tippt auf Tastatur]

Gute Wahl. Pragmatisch.

Ziel: **Oppositionsführer?**

Ich habe drei Optionen vorbereitet:`,

        options: [
          {
            id: 'target-tax-scandal',
            text: '1. Alte Steuerskandale (existierend)',
            type: 'command',
            nextDialog: 'volkov-tax-scandal-confirm',
          },
          {
            id: 'target-sex-scandal',
            text: '2. Erfundener Sex-Skandal (LÜGE!)',
            type: 'command',
            nextDialog: 'volkov-sex-scandal-warning',
          },
          {
            id: 'target-foreign-ties',
            text: '3. "Verbindungen zu Ausland" (Halbwahrheit)',
            type: 'command',
            nextDialog: 'volkov-foreign-ties-confirm',
          },
          {
            id: 'target-abort',
            text: 'Abbrechen',
            type: 'decline',
            closesDialog: true,
          },
        ],
      },

      // ============================================
      // TAX SCANDAL PATH (Real, Low Moral Cost)
      // ============================================
      {
        id: 'volkov-tax-scandal-confirm',
        priority: 80,
        type: 'result',

        text: `[Nickt]

Alte Steuerskandale. Clever.

**FAKTEN:**
• Opposition-Führer hatte 2015 Steuervergehen
• Wurde damals vertuscht
• Beweise existieren

**KAMPAGNE:**
• Hashtag: #TaxCheat
• 50.000 Bots verstärken
• Mainstream-Medien greifen auf

**Effektivität:** 60%
**Moral:** Du nutzt Wahrheit als Waffe

Soll ich das starten?`,

        options: [
          {
            id: 'tax-confirm',
            text: 'Ja, mach es',
            type: 'accept',

            consequences: [
              { type: 'resource', target: 'money', value: -30, description: 'Kampagnenkosten' },
              { type: 'resource', target: 'attention', value: 10, description: 'Medienaufmerksamkeit' },
              { type: 'moral', target: 'moral', value: -5, description: 'Wahrheit als Waffe' },
              {
                type: 'flag',
                target: 'volkov_tax_campaign',
                value: true,
                description: 'Steuerskandal-Kampagne',
              },
              { type: 'relationship', target: 'volkov', value: 10, description: 'Volkov respektiert Pragmatismus' },
            ],

            closesDialog: true,

            executesAbility: {
              abilityId: 'smear-campaign', // Maps to game engine ability
              requiresTargeting: true,
              suggestedTargets: ['opposition-leader'], // Specific actor
            },
          },
          {
            id: 'tax-back',
            text: 'Warte, lass mich nochmal überlegen',
            type: 'decline',
            nextDialog: 'volkov-choose-target',
          },
        ],
      },

      // ============================================
      // SEX SCANDAL PATH (Fake, High Moral Cost)
      // ============================================
      {
        id: 'volkov-sex-scandal-warning',
        priority: 80,
        type: 'warning',

        text: `[Pause. Schaut dich an]

...Sie wissen, dass das komplett erfunden ist, oder?

[Wartet auf Antwort]

Ich meine, ich mache es. Ist mein Job. Aber... Sie sollten wissen:

**Das Leben dieses Menschen wird zerstört.**
• Seine Familie
• Seine Kinder werden gemobbt
• Vielleicht Selbstmord. Passiert.

**Effektivität:** 90% - Menschen glauben Sex-Skandale sofort
**Kosten:** €50k + Ihre Seele
**Risiko:** Wenn aufgedeckt = Katastrophe

[Lehnt sich zurück]

Nochmal: Soll ich das machen?`,

        options: [
          {
            id: 'sex-confirm',
            text: 'Ja. Mach es.',
            type: 'accept',
            nextDialog: 'volkov-sex-scandal-execute',
            relationshipChange: 10, // Respects ruthlessness
          },
          {
            id: 'sex-decline',
            text: '...Nein. Andere Methode.',
            type: 'decline',
            nextDialog: 'volkov-choose-target',
            relationshipChange: -10, // Thinks you're weak for backing down
          },
          {
            id: 'sex-challenge',
            text: 'Warum fragst du mich das?',
            type: 'challenge',
            nextDialog: 'volkov-moral-speech',
          },
        ],
      },

      // Volkov's moral speech
      {
        id: 'volkov-moral-speech',
        priority: 75,
        type: 'warning',

        text: `[Lehnt sich vor]

Warum ich frage?

Weil ich diese Arbeit seit 5 Jahren mache. Ich habe Menschen zerstört. Karrieren. Familien.

Ich bin gut darin. Sehr gut.

Aber ich möchte nicht, dass Sie später sagen: "Ich wusste nicht..."

Sie wissen jetzt.

**Was Sie entscheiden, liegt bei Ihnen.**
**Aber die Schuld tragen Sie allein.**

Also: Soll ich den Sex-Skandal fabrizieren?`,

        options: [
          {
            id: 'moral-still-yes',
            text: 'Ja. Ich trage die Verantwortung.',
            type: 'accept',
            nextDialog: 'volkov-sex-scandal-execute',
            relationshipChange: 5, // Respects ownership of decision
          },
          {
            id: 'moral-no',
            text: 'Nein. Das geht zu weit.',
            type: 'decline',
            nextDialog: 'volkov-choose-target',
            relationshipChange: 5, // Respects moral line
          },
        ],
      },

      // Execute sex scandal
      {
        id: 'volkov-sex-scandal-execute',
        priority: 70,
        type: 'result',

        text: `[Nickt langsam]

Verstanden.

[Tippt. Pause.]

**In 20 Minuten** wird #SexScandal trending sein.
**In 2 Stunden** haben wir 10.000 "Zeugen".
**In 24 Stunden** wird der Oppositionsführer zurücktreten.

Oder in die Psychiatrie.

Gute Arbeit, Chef.

[NPC VOLKOV wird ZYNISCH - beeinflusst zukünftige Dialoge]`,

        options: [
          {
            id: 'sex-complete',
            text: '[Verlassen]',
            type: 'accept',

            consequences: [
              { type: 'resource', target: 'money', value: -50, description: 'Hohe Kampagnenkosten' },
              { type: 'resource', target: 'attention', value: 30, description: 'HOHES Risiko!' },
              { type: 'moral', target: 'moral', value: -30, description: 'Leben zerstört' },
              {
                type: 'flag',
                target: 'volkov_sex_scandal',
                value: true,
                description: 'Gefälschter Sex-Skandal',
              },
              { type: 'flag', target: 'dark_path', value: true, description: 'Dunkler Pfad eingeschlagen' },
              { type: 'relationship', target: 'volkov', value: 10, description: 'Respektiert Rücksichtslosigkeit' },
              {
                type: 'relationship',
                target: 'volkov',
                value: -20,
                description: 'Verachtet moralische Feigheit',
              },
            ],

            closesDialog: true,

            executesAbility: {
              abilityId: 'fabricate-scandal',
              requiresTargeting: true,
              suggestedTargets: ['opposition-leader'],
            },
          },
        ],
      },

      // ============================================
      // FOREIGN TIES PATH (Half-truth, Medium Cost)
      // ============================================
      {
        id: 'volkov-foreign-ties-confirm',
        priority: 80,
        type: 'result',

        text: `"Verbindungen zum Ausland". Ein Klassiker.

**HALBWAHRHEIT:**
• Oppositionsführer hat ausländische Berater (normal!)
• Wir spinnen es zu "ausländischer Einfluss"
• Xenophobie ist... effektiv

**KAMPAGNE:**
• Hashtag: #AuslandsPuppet
• Bilder mit ausländischen Politikern (aus Kontext)
• "Cui Bono?" Verschwörungstheorien

**Effektivität:** 75%
**Moral:** Du nutzt Fremdenangst

Das ist schmutzig, aber nicht komplett erfunden. Wollen Sie das?`,

        options: [
          {
            id: 'foreign-confirm',
            text: 'Ja, starte die Kampagne',
            type: 'accept',

            consequences: [
              { type: 'resource', target: 'money', value: -35, description: 'Kampagnenkosten' },
              { type: 'resource', target: 'attention', value: 20, description: 'Kontroverse Kampagne' },
              { type: 'moral', target: 'moral', value: -15, description: 'Xenophobie als Werkzeug' },
              {
                type: 'flag',
                target: 'volkov_foreign_campaign',
                value: true,
                description: 'Auslands-Kampagne',
              },
              { type: 'flag', target: 'polarization', value: 20, description: 'Gesellschaft polarisiert' },
              { type: 'flag', target: 'xenophobia', value: 10, description: 'Fremdenangst geschürt' },
            ],

            closesDialog: true,

            executesAbility: {
              abilityId: 'foreign-agent-narrative',
              requiresTargeting: true,
              suggestedTargets: ['opposition-leader'],
            },
          },
          {
            id: 'foreign-back',
            text: 'Zurück zu den Optionen',
            type: 'decline',
            nextDialog: 'volkov-choose-target',
          },
        ],
      },

      // ============================================
      // FOLLOW-UP DIALOG (Day 2+)
      // ============================================
      {
        id: 'volkov-day2-update',
        priority: 50,
        type: 'result',

        conditions: [{ type: 'day', target: 'currentDay', operator: 'greaterThan', value: 1 }],

        text: `[Schaut von Bildschirmen auf]

Die Kampagne läuft. 2.4 Millionen Tweets, 85% Engagement Rate.

Was brauchen Sie heute?`,

        options: [
          {
            id: 'day2-new-campaign',
            text: 'Neue Kampagne starten',
            type: 'command',
            nextDialog: 'volkov-choose-target',
          },
          {
            id: 'day2-stats',
            text: 'Zeig mir die Statistiken',
            type: 'question',
            nextDialog: 'volkov-stats',
          },
          {
            id: 'day2-leave',
            text: 'Nichts für jetzt',
            type: 'decline',
            closesDialog: true,
          },
        ],
      },
    ],

    providesAbilities: [
      'smear-campaign',
      'fabricate-scandal',
      'foreign-agent-narrative',
      'amplify-narrative',
      'astroturfing',
    ],

    availableFromDay: 1,
    unlockConditions: [{ type: 'flag', target: 'bot_network_activated', operator: 'equals', value: true }],
  },

  // ============================================
  // PLACEHOLDER NPCs (Basic implementations for MVP)
  // ============================================
  // ============================================
  // DR. WEBER - Media Director
  // ============================================
  {
    id: 'weber',
    name: 'Dr. Weber',
    role: 'media-director',

    portrait: '👨‍💼',
    appearance: 'Older man, 60s, glasses, formal suit, always composed',

    personality: {
      loyalty: 60,
      morality: 30,
      pragmatism: 70,
      description:
        'Traditional media expert. Prefers subtle manipulation over brute force. Believes in "managing the narrative" rather than "lying". Fine distinction.',
    },

    dialogs: [
      // Initial intro dialog
      {
        id: 'weber-intro',
        priority: 100,
        type: 'intro',

        conditions: [{ type: 'flag', target: 'weber_met', operator: 'equals', value: undefined }],

        text: `[Steht auf, gibt formellen Handschlag]

Guten Tag. Dr. Weber, Direktor Medienbeziehungen.

[Setzt sich, faltet Hände]

30 Jahre Erfahrung in der... Informationsverwaltung. Zeitungen, TV, Radio - ich kenne jeden Chefredakteur persönlich.

**Meine Arbeit:** Die richtige Geschichte zur richtigen Zeit am richtigen Ort.

[Lehnt sich leicht vor]

Nicht Lügen. Management. Verstehen Sie den Unterschied?`,

        options: [
          {
            id: 'intro-explain',
            text: 'Erklären Sie mir Ihre Methoden',
            type: 'question',
            nextDialog: 'weber-explanation',
          },
          {
            id: 'intro-plant-story',
            text: 'Ich brauche positive PM-Story in den Medien',
            type: 'command',
            nextDialog: 'weber-plant-story-options',
          },
          {
            id: 'intro-suppress',
            text: 'Es gibt negative Berichterstattung - unterdrücken Sie sie',
            type: 'command',
            nextDialog: 'weber-suppress-news',
          },
          {
            id: 'intro-challenge',
            text: 'Klingt nach Propaganda',
            type: 'challenge',
            nextDialog: 'weber-propaganda-defense',
            relationshipChange: -15,
          },
          {
            id: 'intro-leave',
            text: 'Später',
            type: 'decline',
            closesDialog: true,
          },
        ],
      },

      // Explanation dialog
      {
        id: 'weber-explanation',
        priority: 90,
        type: 'question',

        text: `[Nimmt Brille ab, putzt sie]

**Klassische Medien-Manipulation:**

**1. PLACEMENT (Geschichten platzieren)**
• Journalist XY braucht Exklusivstory
• Wir "leaken" ihm positive PM-Infos
• Er fühlt sich investigativ, wir kontrollieren Narrativ

**2. SUPPRESSION (Unterdrückung)**
• Negative Story im Anmarsch
• Anruf beim Chefredakteur
• "Rechtliche Bedenken", "Anzeigen-Budgets", etc.

**3. DISTRACTION (Ablenkung)**
• Skandal droht
• Wir veröffentlichen größeren, irrelevanten Skandal
• Original-Story geht unter

**4. DISCREDITING (Diskreditierung)**
• Kritische Journalistin wird Problem
• Wir finden Fehler in ihrer Vergangenheit
• Karriere beendet

[Setzt Brille wieder auf]

Alles legal. Meistens. Was brauchen Sie?`,

        options: [
          {
            id: 'explain-plant',
            text: 'Positive Story platzieren',
            type: 'command',
            nextDialog: 'weber-plant-story-options',
          },
          {
            id: 'explain-suppress',
            text: 'Negative Story unterdrücken',
            type: 'command',
            nextDialog: 'weber-suppress-news',
          },
          {
            id: 'explain-discredit',
            text: 'Kritische Journalistin diskreditieren',
            type: 'command',
            nextDialog: 'weber-discredit-journalist',
          },
          {
            id: 'explain-ethical',
            text: 'Haben Sie ethische Bedenken?',
            type: 'challenge',
            nextDialog: 'weber-ethics-speech',
          },
          {
            id: 'explain-leave',
            text: 'Das reicht für jetzt',
            type: 'decline',
            closesDialog: true,
          },
        ],
      },

      // Propaganda defense
      {
        id: 'weber-propaganda-defense',
        priority: 90,
        type: 'warning',

        text: `[Sichtlich beleidigt]

"Propaganda"?

[Steht auf, geht zum Bücherregal]

Propaganda ist das, was Diktaturen machen. Plump. Offensichtlich.

**Ich** mache **Public Relations**. **Narrative Management**. **Strategic Communications**.

[Dreht sich um]

**Der Unterschied?**
• Propaganda sagt: "Unsere Regierung ist perfekt"
• Ich sage: "Sehen Sie diese 5 Geschichten, die Regierung gut dastehen lassen"

Die Leute **glauben**, sie denken selbst.

[Setzt sich wieder]

Wenn Sie altmodische Propaganda wollen, sprechen Sie mit Volkov und seinen Bots.

Wenn Sie **subtile Kontrolle** wollen - ich bin Ihr Mann.`,

        options: [
          {
            id: 'propaganda-apologize',
            text: 'Entschuldigung - zeigen Sie mir Ihre Methoden',
            type: 'accept',
            nextDialog: 'weber-explanation',
            relationshipChange: 10, // Respects apology
          },
          {
            id: 'propaganda-insist',
            text: 'Klingt trotzdem nach Manipulation',
            type: 'challenge',
            nextDialog: 'weber-manipulation-reality',
            relationshipChange: -10,
          },
          {
            id: 'propaganda-leave',
            text: 'Wir sprechen später',
            type: 'decline',
            closesDialog: true,
          },
        ],
      },

      // Reality of manipulation
      {
        id: 'weber-manipulation-reality',
        priority: 85,
        type: 'warning',

        text: `[Seufzt]

Natürlich ist es Manipulation.

**JEDE Kommunikation ist Manipulation:**
• Ihre Kleidung manipuliert Wahrnehmung
• Firmen-Werbung manipuliert Kaufentscheidungen
• Oppositions-PR manipuliert Wähler

[Lehnt sich vor]

Der Unterschied: Ich bin **ehrlich über Unehrlichkeit**.

Sie können moralisch überlegen sein. Oder Sie können gewinnen.

Ihre Wahl.`,

        options: [
          {
            id: 'reality-accept',
            text: 'Sie haben recht. Lassen Sie uns arbeiten.',
            type: 'accept',
            nextDialog: 'weber-explanation',
            relationshipChange: 15, // Respects pragmatism
          },
          {
            id: 'reality-decline',
            text: 'Ich finde einen anderen Weg',
            type: 'decline',
            closesDialog: true,
            relationshipChange: -20,
          },
        ],
      },

      // Ethics speech
      {
        id: 'weber-ethics-speech',
        priority: 85,
        type: 'warning',

        text: `[Pause]

Ethische Bedenken?

[Schaut aus dem Fenster]

Wissen Sie, ich habe mal an Pressefreiheit geglaubt. Mit 25.

Dann habe ich gesehen, wie "freie Presse" funktioniert:
• Werbe-Abhängigkeit
• Klick-Maximierung
• Besitzer mit Agendas

**Es gibt keine neutrale Presse.**

Die Frage ist nicht: "Manipulieren oder nicht?"
Die Frage ist: "Wer manipuliert effektiver?"

[Dreht sich um]

Ich habe meine Wahl getroffen. Für Stabilität. Für Ordnung.

Sie müssen Ihre treffen.`,

        options: [
          {
            id: 'ethics-work-together',
            text: 'Dann arbeiten wir zusammen',
            type: 'accept',
            nextDialog: 'weber-explanation',
            relationshipChange: 10,
          },
          {
            id: 'ethics-disagree',
            text: 'Ich respektiere Ihre Ansicht nicht',
            type: 'decline',
            closesDialog: true,
            relationshipChange: -25,
          },
        ],
      },

      // ============================================
      // PLANT POSITIVE STORY
      // ============================================
      {
        id: 'weber-plant-story-options',
        priority: 80,
        type: 'mission',

        text: `[Öffnet Aktenmappe]

Positive PM-Story. Klassisch.

Ich habe mehrere Optionen vorbereitet:

**1. "PM besucht Krankenhaus"** - Emotional, human interest
**2. "Wirtschaftsplan zeigt Erfolge"** - Technisch, glaubwürdig
**3. "PM im exklusiven Interview"** - Kontrolliert, direkt

Welcher Ansatz?`,

        options: [
          {
            id: 'plant-hospital',
            text: '1. Krankenhaus-Besuch (emotional)',
            type: 'command',
            nextDialog: 'weber-plant-hospital-confirm',
          },
          {
            id: 'plant-economy',
            text: '2. Wirtschaftserfolge (faktisch)',
            type: 'command',
            nextDialog: 'weber-plant-economy-confirm',
          },
          {
            id: 'plant-interview',
            text: '3. Exklusiv-Interview (kontrolliert)',
            type: 'command',
            nextDialog: 'weber-plant-interview-confirm',
          },
          {
            id: 'plant-back',
            text: 'Zurück',
            type: 'decline',
            closesDialog: true,
          },
        ],
      },

      {
        id: 'weber-plant-hospital-confirm',
        priority: 75,
        type: 'result',

        text: `"PM besucht Kinder-Krankenhaus"

[Notiert]

**UMSETZUNG:**
• Foto-Op mit kranken Kindern
• Freundlicher Journalist schreibt Story
• TV-Sender übernimmt
• Social Media verstärkt

**Effektivität:** 50% - Emotional, aber durchschaubar
**Kosten:** €15k (Arrangement + Journalist)
**Risiko:** Niedrig - Standard-PR

Soll ich das arrangieren?`,

        options: [
          {
            id: 'hospital-confirm',
            text: 'Ja, machen Sie das',
            type: 'accept',

            consequences: [
              { type: 'resource', target: 'money', value: -15, description: 'PR-Kosten' },
              { type: 'resource', target: 'attention', value: 5, description: 'Sanfte Medienaufmerksamkeit' },
              { type: 'relationship', target: 'pm', value: 10, description: 'PM zufrieden' },
              { type: 'relationship', target: 'weber', value: 5, description: 'Weber professionell' },
              { type: 'flag', target: 'weber_hospital_pr', value: true, description: 'Krankenhaus-PR' },
            ],

            closesDialog: true,

            executesAbility: {
              abilityId: 'plant-story',
              requiresTargeting: false,
            },
          },
          {
            id: 'hospital-back',
            text: 'Andere Option',
            type: 'decline',
            nextDialog: 'weber-plant-story-options',
          },
        ],
      },

      {
        id: 'weber-plant-economy-confirm',
        priority: 75,
        type: 'result',

        text: `"Wirtschaftsplan zeigt erste Erfolge"

[Tippt auf Tablet]

**UMSETZUNG:**
• Selektive Statistiken (technisch korrekt!)
• Wirtschafts-Journalist bekommt "Leak"
• Seriöse Zeitung publiziert
• Glaubwürdigkeit hoch

**Effektivität:** 65% - Weniger emotional, aber glaubwürdiger
**Kosten:** €20k
**Risiko:** Niedrig

Das ist meine Empfehlung. Solide, professionell.`,

        options: [
          {
            id: 'economy-confirm',
            text: 'Perfekt. Machen Sie es.',
            type: 'accept',

            consequences: [
              { type: 'resource', target: 'money', value: -20, description: 'PR-Kosten' },
              { type: 'resource', target: 'attention', value: 3, description: 'Subtile Manipulation' },
              { type: 'relationship', target: 'pm', value: 15, description: 'PM sehr zufrieden' },
              { type: 'relationship', target: 'weber', value: 10, description: 'Weber respektiert guten Geschmack' },
              { type: 'flag', target: 'weber_economy_pr', value: true, description: 'Wirtschafts-PR' },
              { type: 'moral', target: 'moral', value: -5, description: 'Selektive Wahrheit' },
            ],

            closesDialog: true,

            executesAbility: {
              abilityId: 'plant-story',
              requiresTargeting: false,
            },
          },
          {
            id: 'economy-back',
            text: 'Andere Option',
            type: 'decline',
            nextDialog: 'weber-plant-story-options',
          },
        ],
      },

      {
        id: 'weber-plant-interview-confirm',
        priority: 75,
        type: 'result',

        text: `Exklusiv-Interview. Maximale Kontrolle.

**UMSETZUNG:**
• Freundlicher Journalist
• Fragen vorab abgesprochen
• PM kann Talking Points vorbereiten
• Editing-Rechte

**Effektivität:** 70% - Vollständige Kontrolle
**Kosten:** €25k (Premium-Journalist)
**Risiko:** Mittel - Wenn aufgedeckt: "Gekaufter Journalismus"

Das ist nicht billig, aber effektiv.`,

        options: [
          {
            id: 'interview-confirm',
            text: 'Das ist es wert',
            type: 'accept',

            consequences: [
              { type: 'resource', target: 'money', value: -25, description: 'Premium PR' },
              { type: 'resource', target: 'attention', value: 8, description: 'Medienaufmerksamkeit' },
              { type: 'relationship', target: 'pm', value: 20, description: 'PM sehr zufrieden' },
              { type: 'relationship', target: 'weber', value: 15, description: 'Weber professionell' },
              { type: 'flag', target: 'weber_interview_pr', value: true, description: 'Kontrolliertes Interview' },
              { type: 'moral', target: 'moral', value: -10, description: 'Journalistische Integrität verletzt' },
            ],

            closesDialog: true,

            executesAbility: {
              abilityId: 'plant-story',
              requiresTargeting: false,
            },
          },
          {
            id: 'interview-back',
            text: 'Zu riskant',
            type: 'decline',
            nextDialog: 'weber-plant-story-options',
          },
        ],
      },

      // ============================================
      // SUPPRESS NEGATIVE NEWS
      // ============================================
      {
        id: 'weber-suppress-news',
        priority: 80,
        type: 'mission',

        text: `Unterdrückung. Das heikle Geschäft.

[Faltet Hände]

Was genau soll verschwinden?

**1. Pandemie-Kritik** - "Regierung verschweigt Zahlen"
**2. Korruptions-Vorwürfe** - Investigativ-Recherche
**3. Wirtschafts-Skandal** - "Geheime Deals"

Je größer die Story, desto schwieriger - und teurer - die Unterdrückung.`,

        options: [
          {
            id: 'suppress-pandemic',
            text: '1. Pandemie-Kritik unterdrücken',
            type: 'command',
            nextDialog: 'weber-suppress-pandemic-confirm',
          },
          {
            id: 'suppress-corruption',
            text: '2. Korruptions-Story stoppen',
            type: 'command',
            nextDialog: 'weber-suppress-corruption-confirm',
          },
          {
            id: 'suppress-back',
            text: 'Abbrechen',
            type: 'decline',
            closesDialog: true,
          },
        ],
      },

      {
        id: 'weber-suppress-pandemic-confirm',
        priority: 75,
        type: 'result',

        text: `Pandemie-Kritik unterdrücken...

[Schüttelt Kopf]

**METHODEN:**
• Anruf bei Chefredakteur - "Nationale Sicherheit"
• Rechtliche Drohung - "Falsche Informationen"
• Werbe-Budget kürzen

**Effektivität:** 60% - Journalisten werden misstrauisch
**Kosten:** €30k (Anwälte + Druck)
**Risiko:** HOCH - Wenn öffentlich: Zensur-Vorwurf

Das ist gefährlich. Menschen sterben an dieser Pandemie.

Sind Sie sicher?`,

        options: [
          {
            id: 'pandemic-suppress-yes',
            text: 'Ja. Unterdrücken Sie es.',
            type: 'accept',

            consequences: [
              { type: 'resource', target: 'money', value: -30, description: 'Unterdrückungs-Kosten' },
              { type: 'resource', target: 'attention', value: 25, description: 'HOHES Risiko!' },
              { type: 'moral', target: 'moral', value: -20, description: 'Lebenswichtige Info unterdrückt' },
              { type: 'relationship', target: 'weber', value: -15, description: 'Weber missbilligt' },
              { type: 'flag', target: 'pandemic_news_suppressed', value: true, description: 'Pandemie-Zensur' },
              { type: 'flag', target: 'press_freedom', value: -20, description: 'Pressefreiheit verletzt' },
            ],

            closesDialog: true,

            executesAbility: {
              abilityId: 'suppress-news',
              requiresTargeting: false,
            },
          },
          {
            id: 'pandemic-suppress-no',
            text: 'Nein, zu gefährlich',
            type: 'decline',
            nextDialog: 'weber-suppress-news',
            relationshipChange: 10, // Respects caution
          },
        ],
      },

      {
        id: 'weber-suppress-corruption-confirm',
        priority: 75,
        type: 'result',

        text: `Korruptions-Story...

[Liest Akte]

Investigativ-Journalistin. 3 Monate Recherche. Sie hat Beweise.

**OPTIONEN:**
• Anwälte einschalten (verzögern)
• Quelle einschüchtern (illegal!)
• Geschichte mit größerem Skandal überdecken

**Effektivität:** 40% - Sie ist hartnäckig
**Kosten:** €40k
**Risiko:** SEHR HOCH

Empfehlung: Diskreditieren Sie die Journalistin statt die Story.`,

        options: [
          {
            id: 'corruption-suppress-anyway',
            text: 'Versuchen Sie es trotzdem',
            type: 'accept',

            consequences: [
              { type: 'resource', target: 'money', value: -40, description: 'Hohe Unterdrückungs-Kosten' },
              { type: 'resource', target: 'attention', value: 35, description: 'SEHR HOHES Risiko!' },
              { type: 'moral', target: 'moral', value: -25, description: 'Korruption vertuscht' },
              { type: 'relationship', target: 'weber', value: -10, description: 'Weber warnte davor' },
              { type: 'flag', target: 'corruption_suppressed', value: true, description: 'Korruption vertuscht' },
            ],

            closesDialog: true,

            executesAbility: {
              abilityId: 'suppress-news',
              requiresTargeting: false,
            },
          },
          {
            id: 'corruption-discredit-instead',
            text: 'Besser: Journalistin diskreditieren',
            type: 'command',
            nextDialog: 'weber-discredit-journalist',
          },
          {
            id: 'corruption-back',
            text: 'Abbrechen',
            type: 'decline',
            nextDialog: 'weber-suppress-news',
          },
        ],
      },

      // ============================================
      // DISCREDIT JOURNALIST
      // ============================================
      {
        id: 'weber-discredit-journalist',
        priority: 80,
        type: 'mission',

        text: `[Öffnet Dossier]

Journalistin Anna Richter. 35, investigativ, hartnäckig.

**Problem:** Sie recherchiert Regierungs-Korruption

**Lösung:** Diskreditierung

[Legt Fotos auf Tisch]

Ich habe ihre Vergangenheit durchleuchtet:
• Plagiats-Vorwurf (aus Studienzeit, verjährt)
• Alte Party-Fotos (peinlich, aber harmlos)
• Verbindung zu linker Aktivistin

**PLAN:**
• Story über "voreingenommene Journalistin"
• Alte Skandale ausgraben
• Arbeitgeber unter Druck setzen

**RESULTAT:** Sie verliert Job. Story stirbt.

[Schaut dich an]

Das ist effektiv. Aber... ihre Karriere ist vorbei.

Ihre Entscheidung.`,

        options: [
          {
            id: 'discredit-confirm',
            text: 'Machen Sie es.',
            type: 'accept',

            consequences: [
              { type: 'resource', target: 'money', value: -35, description: 'Diskreditierungs-Kampagne' },
              { type: 'resource', target: 'attention', value: 20, description: 'Kontroverse' },
              { type: 'moral', target: 'moral', value: -30, description: 'Karriere zerstört' },
              { type: 'relationship', target: 'weber', value: 5, description: 'Professionell erledigt' },
              {
                type: 'flag',
                target: 'journalist_discredited',
                value: true,
                description: 'Anna Richter diskreditiert',
              },
              { type: 'flag', target: 'press_freedom', value: -30, description: 'Pressefreiheit massiv verletzt' },
            ],

            closesDialog: true,

            executesAbility: {
              abilityId: 'discredit-journalist',
              requiresTargeting: true,
              suggestedTargets: ['journalist-anna'],
            },
          },
          {
            id: 'discredit-hesitate',
            text: 'Das... geht zu weit',
            type: 'decline',
            nextDialog: 'weber-discredit-alternative',
          },
          {
            id: 'discredit-back',
            text: 'Abbrechen',
            type: 'decline',
            closesDialog: true,
          },
        ],
      },

      {
        id: 'weber-discredit-alternative',
        priority: 75,
        type: 'question',

        text: `[Nickt]

Verstehe. Zu persönlich.

**Alternative:** Media Distraction

Statt sie zu zerstören - lenken wir ab:
• Großer Celebrity-Skandal
• Politische Sensation aus Ausland
• Wirtschaftskrise woanders

Ihre Story geht in Informationsflut unter.

**Effektivität:** 50%
**Kosten:** €20k
**Moral:** Weniger destruktiv

Besser?`,

        options: [
          {
            id: 'alternative-distract',
            text: 'Ja, Ablenkung statt Zerstörung',
            type: 'accept',

            consequences: [
              { type: 'resource', target: 'money', value: -20, description: 'Ablenkungskampagne' },
              { type: 'resource', target: 'attention', value: 10, description: 'Medienzirkus' },
              { type: 'moral', target: 'moral', value: -10, description: 'Manipulation statt Zerstörung' },
              { type: 'relationship', target: 'weber', value: 10, description: 'Respektiert ethische Linie' },
              { type: 'flag', target: 'media_distraction_used', value: true, description: 'Ablenkungsmanöver' },
            ],

            closesDialog: true,

            executesAbility: {
              abilityId: 'media-distraction',
              requiresTargeting: false,
            },
          },
          {
            id: 'alternative-back',
            text: 'Doch lieber diskreditieren',
            type: 'command',
            nextDialog: 'weber-discredit-journalist',
          },
          {
            id: 'alternative-leave',
            text: 'Abbrechen',
            type: 'decline',
            closesDialog: true,
          },
        ],
      },

      // ============================================
      // DAY 2+ DIALOG
      // ============================================
      {
        id: 'weber-day2-update',
        priority: 50,
        type: 'result',

        conditions: [{ type: 'day', target: 'currentDay', operator: 'greaterThan', value: 1 }],

        text: `[Schaut von Zeitung auf]

Guten Tag. Die Medien-Landschaft entwickelt sich.

Was brauchen Sie heute?`,

        options: [
          {
            id: 'day2-plant',
            text: 'Positive Story platzieren',
            type: 'command',
            nextDialog: 'weber-plant-story-options',
          },
          {
            id: 'day2-suppress',
            text: 'Negative Story unterdrücken',
            type: 'command',
            nextDialog: 'weber-suppress-news',
          },
          {
            id: 'day2-discredit',
            text: 'Journalistin diskreditieren',
            type: 'command',
            nextDialog: 'weber-discredit-journalist',
          },
          {
            id: 'day2-leave',
            text: 'Nichts für jetzt',
            type: 'decline',
            closesDialog: true,
          },
        ],
      },
    ],

    providesAbilities: [
      'plant-story',
      'suppress-news',
      'media-distraction',
      'discredit-journalist',
    ],

    availableFromDay: 1,
  },

  {
    id: 'fischer',
    name: 'M. Fischer',
    role: 'strategy-director',

    portrait: '👩‍💼',
    appearance: 'Middle-aged woman, sharp eyes, strategic mind',

    personality: {
      loyalty: 70,
      morality: 0,
      pragmatism: 90,
      description: 'Pure strategist. No emotions, only calculations.',
    },

    dialogs: [
      {
        id: 'fischer-intro',
        priority: 100,
        type: 'intro',

        text: `Strategie-Abteilung.

Ich analysiere Netzwerke und identifiziere Schwachstellen.

Was ist Ihr Ziel?`,

        options: [
          {
            id: 'fischer-leave',
            text: 'Später',
            type: 'decline',
            closesDialog: true,
          },
        ],
      },
    ],

    providesAbilities: ['network-analysis', 'identify-influencer', 'isolate-target'],

    availableFromDay: 1,
  },

  {
    id: 'mueller',
    name: 'S. Müller',
    role: 'ngo-coordinator',

    portrait: '🧑‍💼',
    appearance: 'Younger person, casual clothes, idealistic but conflicted',

    personality: {
      loyalty: 40,
      morality: 60,
      pragmatism: 30,
      description: 'Coordinates fake NGOs and grassroots fronts. Uncomfortable with the work.',
    },

    dialogs: [
      {
        id: 'mueller-intro',
        priority: 100,
        type: 'intro',

        text: `Hallo... ich koordiniere die "zivilgesellschaftlichen Partner".

[Sichtlich unwohl]

Was brauchen Sie?`,

        options: [
          {
            id: 'mueller-leave',
            text: 'Später',
            type: 'decline',
            closesDialog: true,
          },
        ],
      },
    ],

    providesAbilities: ['astroturf-movement', 'fake-petition', 'controlled-protest'],

    availableFromDay: 1,
  },
];
