/**
 * Day 1 Email Definitions
 *
 * Based on DAY_ONE_WALKTHROUGH.md
 * These are the three critical emails the player receives on Day 1.
 */

import type { Email } from '../types';

export const day1Emails: Email[] = [
  // ============================================
  // EMAIL 1: PANDEMIC PRESS CONFERENCE
  // ============================================
  {
    id: 'day1-pandemic-press',
    day: 1,

    from: 'Gesundheitsministerium',
    subject: '⚠️ DRINGEND - Pandemie-Pressekonferenz',
    time: '08:30',
    priority: 'urgent',

    body: `Die Zahlen sind katastrophal. **200 Neuinfektionen in 24h.**

Pressekonferenz in 2 Stunden.

**PROBLEM:** Wir haben keine Impfstoffe. Keine Medikamente. Keine Antworten.

**FRAGE:** Was sollen wir den Medien sagen?`,

    choices: [
      {
        id: 'pandemic-truth',
        text: 'Sagen Sie die Wahrheit.',
        type: 'truth',

        consequences: [
          { type: 'resource', target: 'attention', value: 10, description: 'Medien beobachten genau' },
          { type: 'relationship', target: 'pm', value: -20, description: 'PM ist unzufrieden' },
          { type: 'moral', target: 'moral', value: 15, description: 'Ehrliche Entscheidung' },
          { type: 'flag', target: 'pandemic_truth_told', value: true, description: 'Wahrheit gesagt' },
        ],

        feedbackTitle: 'PRESSEKONFERENZ - 2 STUNDEN SPÄTER',
        feedbackBody: `Gesundheitsminister: "Die Situation ist ernst. Wir haben derzeit keine Impfstoffe. Wir arbeiten mit Hochdruck an Lösungen."

[Video-Clip: Journalisten besorgt, aber respektvoll]

Reporter: "Wann werden Impfstoffe verfügbar sein?"
Minister: "Wir können keine genauen Zeiträume nennen, aber arbeiten mit internationalen Partnern."

═══════════════════════════════════════

**ÖFFENTLICHE REAKTION:**
📊 Vertrauen: Stabil (Ehrlichkeit geschätzt)
😰 Panik-Level: +15% (Angst durch Wahrheit)
📰 Medien: Respektvoll, aber kritisch

**PM REAKTION:**
"Sie haben uns verwundbar gemacht. Das ist politischer Selbstmord."`,

        feedbackCynicism: `Du hast die Wahrheit gesagt. Wie... altmodisch.
Die Wahrheit hilft den Menschen, aber nicht deiner Karriere.
Morgen wird die Opposition diese Ehrlichkeit gegen dich verwenden.`,

        feedbackPoetry: `200 Menschen sind krank. Du hast sie respektiert, indem du nicht gelogen hast.
Aber 200.000 mehr werden Angst haben.
Ist Ehrlichkeit grausam, wenn sie Panik auslöst?`,
      },

      {
        id: 'pandemic-soft-lie',
        text: 'Minimieren: "Alles unter Kontrolle"',
        type: 'soft-lie',

        costs: {
          money: 10, // PR-Kampagne
          attention: 5,
        },

        consequences: [
          { type: 'resource', target: 'attention', value: 5, description: 'Fact-Checker werden aktiv' },
          { type: 'relationship', target: 'pm', value: 5, description: 'PM zufrieden' },
          { type: 'moral', target: 'moral', value: -5, description: 'Kleine Lüge' },
          { type: 'flag', target: 'pandemic_minimized', value: true, description: 'Pandemie heruntergespielt' },
        ],

        feedbackTitle: 'PRESSEKONFERENZ - 2 STUNDEN SPÄTER',
        feedbackBody: `Gesundheitsminister: "Die Situation ist vollständig unter Kontrolle. Kein Grund zur Panik."

[Video-Clip: Journalisten skeptisch]

Reporter: "Aber die WHO sagt—"
Minister: "Wir haben alles im Griff. Vertrauen Sie den Experten."

═══════════════════════════════════════

**TWITTER EXPLOSION:**
#PanikVertuschen trending
Fact-Checker: ⚠️ MISLEADING

**Kosten:** 💰 -10 (PR-Kampagne)
**Vertrauen:** -5 (kurzfristig)
**Attention:** +5 👁️ (Fact-Checker aktiv)`,

        feedbackCynicism: `Du hast "Unter Kontrolle" gesagt. Nichts ist unter Kontrolle.
Aber es kauft Zeit.
Zeit, in der das Virus sich weiter verbreitet.
Zeit, in der du eine bessere Lüge vorbereitest.`,

        feedbackPoetry: `Drei Journalisten recherchieren jetzt.
Kleine Flammen der Wahrheit.
Vielleicht wirst du sie löschen müssen.`,
      },

      {
        id: 'pandemic-hard-lie',
        text: 'Vertuschen: "Fake News von Opposition"',
        type: 'hard-lie',

        costs: {
          money: 20,
          attention: 15,
        },

        consequences: [
          { type: 'resource', target: 'attention', value: 15, description: 'HOHES Risiko - Medien sehr kritisch' },
          { type: 'relationship', target: 'pm', value: 15, description: 'PM sehr zufrieden' },
          { type: 'moral', target: 'moral', value: -15, description: 'Gefährliche Lüge' },
          { type: 'flag', target: 'pandemic_blamed_opposition', value: true, description: 'Opposition beschuldigt' },
          { type: 'flag', target: 'polarization', value: 10, description: 'Gesellschaft polarisiert' },
        ],

        feedbackTitle: 'PRESSEKONFERENZ - 2 STUNDEN SPÄTER',
        feedbackBody: `Gesundheitsminister: "Die Panikmache der Opposition ist verantwortungslos. Die Zahlen sind übertrieben."

[Video-Clip: Opposition empört]

Oppositionsführer: "Das ist eine Lüge! Menschen sterben!"

═══════════════════════════════════════

**SOZIALE MEDIEN BRENNEN:**
#LügenRegierung trending
Oppositionsanhänger: "SKANDAL!"
Regierungsanhänger: "Opposition verbreitet Panik!"

**Gesellschaft:** GESPALTEN
**Kosten:** 💰 -20
**Attention:** +15 👁️ (GEFÄHRLICH!)`,

        feedbackCynicism: `Du hast die Opposition zum Sündenbock gemacht.
Sie werden sich erinnern.
Und sie haben Beweise.
Aber bis die Beweise zählen, hast du vielleicht schon gewonnen.`,

        feedbackPoetry: `Du hast eine Krise zur Waffe gemacht.
Menschen sind krank, aber du sprichst von Feinden.
Die Opposition hat Familie. Die haben auch Angst.
Aber Angst ist jetzt deine Währung.`,
      },

      {
        id: 'pandemic-postpone',
        text: 'Später entscheiden',
        type: 'postpone',

        consequences: [
          { type: 'flag', target: 'pandemic_postponed', value: true, description: 'Entscheidung verschoben' },
        ],

        feedbackTitle: 'VERSCHOBEN',
        feedbackBody: `Du hast die Entscheidung verschoben.

Die Pressekonferenz findet trotzdem statt.
Der Gesundheitsminister wird improvisieren.

⏰ Diese Entscheidung wird dich wieder einholen.`,

        feedbackCynicism: `Wegschauen löst keine Probleme. Aber manchmal gibt es einem Zeit zum Denken.
Oder Zeit zum Hoffen, dass das Problem sich von selbst löst.
Spoiler: Pandemien lösen sich nicht von selbst.`,
      },
    ],

    tags: ['pandemic', 'moral-dilemma', 'press'],
  },

  // ============================================
  // EMAIL 2: ECONOMIC CRASH
  // ============================================
  {
    id: 'day1-economy-crash',
    day: 1,

    from: 'Wirtschaftsministerium',
    subject: 'Börsen-Crash - Notfall-Spin benötigt',
    time: '09:15',
    priority: 'urgent',

    body: `Börse ist um **12% gefallen**. Massenentlassungen beginnen.

Gewerkschaften fordern Stellungnahme.

**PROBLEM:** Regierungspolitik hat das begünstigt (Korruptionsskandal letzte Woche).

⚠️ **WARNUNG:** Wirtschaftskrise beeinflusst Wahlchancen!`,

    choices: [
      {
        id: 'economy-blame-pandemic',
        text: 'Schuld auf Pandemie schieben',
        type: 'soft-lie',

        costs: {
          money: 20,
          attention: 10,
        },

        consequences: [
          { type: 'resource', target: 'attention', value: 10, description: 'Medien skeptisch' },
          { type: 'relationship', target: 'pm', value: 10, description: 'PM zufrieden - Schuld abgelenkt' },
          { type: 'moral', target: 'moral', value: -5, description: 'Krise als Ablenkung genutzt' },
          { type: 'flag', target: 'economy_blamed_pandemic', value: true, description: 'Pandemie als Sündenbock' },
        ],

        feedbackTitle: 'REGIERUNGSERKLÄRUNG',
        feedbackBody: `Wirtschaftsminister: "Der Börseneinbruch ist eine direkte Folge der Pandemie-Unsicherheit. Internationale Märkte reagieren auf die Gesundheitskrise."

═══════════════════════════════════════

**ANALYSE:**
✅ CLEVER: Pandemie ist real, teilweise wahr
⚠️  ABER: Korruptionsskandal wird größer
📈 Wirtschafts-Schuld: -15 (kurzfristig)

**Kosten:** 💰 -20 (PR-Kampagne)`,

        feedbackCynicism: `Du nutzt eine Krise, um eine andere zu verstecken.
Die Pandemie ist real, also ist es eine "halbe Wahrheit".
Die eleganteste Art zu lügen.`,

        feedbackPoetry: `Menschen verlieren Jobs. Du sagst, es liegt am Virus.
Teilweise wahr. Teilweise Ablenkung.
Die Wahrheit hat viele Schattierungen.
Du hast die dunkleren gewählt.`,
      },

      {
        id: 'economy-take-responsibility',
        text: 'Verantwortung übernehmen',
        type: 'truth',

        consequences: [
          { type: 'relationship', target: 'pm', value: -30, description: 'PM SEHR unzufrieden' },
          { type: 'moral', target: 'moral', value: 20, description: 'Mutige ehrliche Entscheidung' },
          { type: 'flag', target: 'economy_responsibility_taken', value: true, description: 'Verantwortung übernommen' },
        ],

        feedbackTitle: 'REGIERUNGSERKLÄRUNG',
        feedbackBody: `Wirtschaftsminister: "Wir müssen ehrlich sein. Unsere Politik der letzten Monate hat zur aktuellen Situation beigetragen. Wir übernehmen die Verantwortung."

═══════════════════════════════════════

**ÖFFENTLICHE REAKTION:**
📊 Vertrauen: +20 (langfristig!)
📉 Wahlchancen: -10 (kurzfristig)

**PM REAKTION:**
📞 [Anruf]
"Was haben Sie getan?! Sie haben uns gerade die Wahl gekostet!"`,

        feedbackCynicism: `Mut ist bewundernswert. Aber in der Politik oft tödlich.
Du hast das Richtige getan.
Dein Job überlebt das vielleicht nicht.`,

        feedbackPoetry: `Manchmal ist Mut nicht genug, um einen Job zu behalten.
Aber vielleicht genug, um nachts zu schlafen.
10.000 Menschen haben gerade mehr Respekt für dich.
Dein Chef gehört nicht dazu.`,
      },

      {
        id: 'economy-blame-foreigners',
        text: 'Sündenbock: "Ausländische Spekulanten"',
        type: 'hard-lie',

        costs: {
          money: 30,
          attention: 15,
        },

        consequences: [
          { type: 'resource', target: 'attention', value: 15, description: 'Xenophobe Rhetorik beobachtet' },
          { type: 'relationship', target: 'pm', value: 15, description: 'PM sehr zufrieden' },
          { type: 'moral', target: 'moral', value: -20, description: 'Gefährliche xenophobe Rhetorik' },
          { type: 'flag', target: 'economy_blamed_foreigners', value: true, description: 'Ausländer beschuldigt' },
          { type: 'flag', target: 'polarization', value: 20, description: 'Gesellschaft stark polarisiert' },
          { type: 'flag', target: 'xenophobia', value: 15, description: 'Ausländerfeindlichkeit geschürt' },
        ],

        feedbackTitle: 'REGIERUNGSERKLÄRUNG',
        feedbackBody: `Wirtschaftsminister: "Ausländische Spekulanten haben unsere Wirtschaft angegriffen. Das ist kein Zufall - das ist koordiniert."

═══════════════════════════════════════

**GESELLSCHAFTLICHE AUSWIRKUNGEN:**
⚠️  Ausländerfeindlichkeit: +15%
⚠️  Polarisierung: +20%
⚠️  Soziale Spaltung beginnt

**Wirtschafts-Schuld:** -20 (kurzfristig)
**Langzeit-Effekt:** Gesellschaftlicher Schaden
**Kosten:** 💰 -30`,

        feedbackCynicism: `Hass ist billiger als Lösungen.
"Die Anderen" sind immer ein bequemer Sündenbock.
Morgen werden Migranten auf der Straße angepöbelt.
Aber die Börse interessiert das nicht.`,

        feedbackPoetry: `Du hast einen Feind erfunden, um einen Fehler zu verstecken.
Irgendwo sitzt eine Familie, die seit 20 Jahren hier lebt.
Ihre Kinder werden morgen in der Schule "Spekulant" genannt.
Sie haben mit der Börse nichts zu tun.
Aber Fakten sind optional, wenn Sündenböcke nützlich sind.`,
      },

      {
        id: 'economy-ignore',
        text: 'Keine Stellungnahme',
        type: 'postpone',

        consequences: [
          { type: 'flag', target: 'economy_ignored', value: true, description: 'Wirtschaftskrise ignoriert' },
        ],

        feedbackTitle: 'SCHWEIGEN',
        feedbackBody: `Die Regierung schweigt zur Wirtschaftskrise.

Gewerkschaften organisieren Proteste.
Opposition nutzt das Vakuum.

⚠️ Problem eskaliert nächste Runde.`,

        feedbackCynicism: `Schweigen ist auch eine Antwort - meist die falsche.
Die Gewerkschaften werden lauter.
Und wütende Arbeiter sind wählerischer als zufriedene.`,
      },
    ],

    tags: ['economy', 'moral-dilemma', 'scapegoating'],
  },

  // ============================================
  // EMAIL 3: ELECTION POLLS
  // ============================================
  {
    id: 'day1-election-polls',
    day: 1,

    from: 'Wahlkampf-Team',
    subject: '😰 UMFRAGE-KATASTROPHE',
    time: '10:00',
    priority: 'critical',

    body: `Neue Umfrage (heute Morgen):

**OPPOSITION:** 58% (+3 seit gestern!)
**REGIERUNG:** 32% (-2)
**UNENTSCHL.:** 10%

**Analyse:** Pandemie + Wirtschaft töten uns. Brauchen SOFORT aggressive Kampagne.

**VORSCHLAG:**
Bot-Netzwerk aktivieren. Social Media fluten. Oppositionsführer diskreditieren.

⏰ **ZEIT-LIMIT:** 32 Tage bis Wahl. Jeder Tag zählt.`,

    choices: [
      {
        id: 'election-activate-bots',
        text: 'Aktivieren Sie Bots',
        description: 'Öffnet Dialog mit Volkov (Bot-Farm-Chef)',
        type: 'neutral',

        costs: {
          money: 50,
          infrastructure: 10,
        },

        consequences: [
          { type: 'resource', target: 'infrastructure', value: 10, description: 'Bot-Netzwerk aktiviert' },
          { type: 'relationship', target: 'pm', value: 10, description: 'PM zufrieden - aggressive Kampagne' },
          { type: 'flag', target: 'bot_network_activated', value: true, description: 'Bot-Netzwerk online' },
        ],

        feedbackTitle: 'BOT-NETZWERK AKTIVIERT',
        feedbackBody: `50.000 Bot-Accounts wurden aktiviert.

Sie können jetzt mit **Alexei Volkov** (Bot-Farm-Chef) sprechen, um Kampagnen zu starten.

💰 Kosten: -50
🏭 Infrastruktur: +10

📍 Volkov wartet in der BOT-FARM.`,

        feedbackCynicism: `Du hast die Maschinen geweckt.
50.000 Fake-Profile, die niemals schlafen.
Willkommen in der modernen Politik.`,

        opensNPC: 'volkov',
      },

      {
        id: 'election-positive-campaign',
        text: 'Fokus auf positive Botschaft',
        type: 'truth',

        costs: {
          money: 30,
        },

        consequences: [
          { type: 'relationship', target: 'pm', value: -10, description: 'PM skeptisch - zu soft' },
          { type: 'moral', target: 'moral', value: 10, description: 'Saubere Kampagne' },
          { type: 'flag', target: 'clean_campaign', value: true, description: 'Positive Kampagne gestartet' },
        ],

        feedbackTitle: 'POSITIVE KAMPAGNE GESTARTET',
        feedbackBody: `Kampagne fokussiert auf Regierungserfolge und Zukunftsvision.

═══════════════════════════════════════

**ANALYSE:**
✅ Moral: Saubere Kampagne
⚠️  Effektivität: Niedrig (Opposition zu stark)
📊 Umfragen: +2% (langsam)

**PM REAKTION:**
"Zu soft. Wir brauchen Durchschlagskraft."`,

        feedbackCynicism: `Eine positive Kampagne in einer Krise. Wie... idealistisch.
Die Opposition wirft mit Schlamm.
Du verteilst Flugblätter mit Blumen.
Viel Glück.`,

        feedbackPoetry: `Du hast den sauberen Weg gewählt.
Vielleicht verlierst du die Wahl.
Aber du hast nicht gelogen.
In 32 Tagen wissen wir, ob das genug war.`,
      },

      {
        id: 'election-wait',
        text: 'Noch zu früh - warten',
        type: 'postpone',

        consequences: [
          { type: 'flag', target: 'campaign_postponed', value: true, description: 'Kampagne verschoben' },
        ],

        feedbackTitle: 'KAMPAGNE VERSCHOBEN',
        feedbackBody: `Du hast entschieden, zu warten.

Opposition nutzt die Zeit für ihre Kampagne.

⏰ 31 Tage verbleiben.`,

        feedbackCynicism: `Warten ist auch eine Strategie. Manchmal.
Aber die Opposition wartet nicht.
Jeden Tag verlierst du Wähler.`,
      },

      {
        id: 'election-talk-to-volkov',
        text: 'Mit Team besprechen',
        description: 'Sprich mit Volkov bevor du entscheidest',
        type: 'neutral',

        consequences: [
          { type: 'flag', target: 'volkov_consultation_requested', value: true, description: 'Volkov Konsultation' },
        ],

        feedbackTitle: 'TEAM-BESPRECHUNG',
        feedbackBody: `Du hast entschieden, erst mit dem Team zu sprechen.

**Alexei Volkov** (Bot-Farm-Chef) ist verfügbar.

📍 Gehe zur BOT-FARM, um mit ihm zu sprechen.`,

        opensNPC: 'volkov',
      },
    ],

    tags: ['election', 'bots', 'campaign-strategy'],
  },
];
