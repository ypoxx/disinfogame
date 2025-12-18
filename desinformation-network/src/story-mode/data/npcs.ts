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
  {
    id: 'weber',
    name: 'Dr. Weber',
    role: 'media-director',

    portrait: '👨‍💼',
    appearance: 'Older man, glasses, formal suit',

    personality: {
      loyalty: 60,
      morality: 30,
      pragmatism: 70,
      description: 'Traditional media expert. Prefers subtle manipulation over brute force.',
    },

    dialogs: [
      {
        id: 'weber-intro',
        priority: 100,
        type: 'intro',

        text: `Guten Tag. Ich leite die Medien-Abteilung.

Wir arbeiten mit... sagen wir, "kooperativen" Journalisten.

Wie kann ich helfen?`,

        options: [
          {
            id: 'weber-leave',
            text: 'Später',
            type: 'decline',
            closesDialog: true,
          },
        ],
      },
    ],

    providesAbilities: ['plant-story', 'suppress-news', 'media-distraction'],

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
