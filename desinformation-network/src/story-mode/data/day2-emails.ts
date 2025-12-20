/**
 * Day 2 Email Definitions
 *
 * Reactive emails that show consequences from Day 1 decisions.
 * Different emails appear based on flags and choices made.
 */

import type { Email } from '../types';

export const day2Emails: Email[] = [
  // ============================================
  // EMAIL 1: PANDEMIC FALLOUT (Conditional based on Day 1 choice)
  // ============================================
  {
    id: 'day2-pandemic-escalation',
    day: 2,

    from: 'Gesundheitsministerium',
    subject: '🚨 KRISE ESKALIERT - 500 Neuinfektionen',
    time: '07:30',
    priority: 'critical',

    body: `Die Situation hat sich dramatisch verschlechtert.

**500 Neuinfektionen in 24h** (gestern: 200)

Krankenhäuser am Limit. Opposition fordert Rücktritt des Gesundheitsministers.

${
  // Conditional text based on Day 1 pandemic choice
  `⚠️ PROBLEM: Ihre gestrige Aussage wird jetzt von Fact-Checkern zerpflückt.`
}`,

    choices: [
      {
        id: 'pandemic-emergency',
        text: 'Notstand ausrufen - volle Transparenz',
        type: 'truth',

        costs: {
          money: 40,
        },

        consequences: [
          { type: 'resource', target: 'attention', value: 20, description: 'Medien sehr kritisch' },
          { type: 'relationship', target: 'pm', value: -30, description: 'PM wütend über Kehrtwende' },
          { type: 'moral', target: 'moral', value: 20, description: 'Richtige Entscheidung unter Druck' },
          { type: 'flag', target: 'pandemic_emergency_declared', value: true, description: 'Notstand erklärt' },
        ],

        feedbackTitle: 'NOTSTAND ERKLÄRT',
        feedbackBody: `Regierung erklärt Gesundheitsnotstand.

Lockdown-Maßnahmen treten in Kraft.
Schulen geschlossen. Home-Office-Pflicht.

═══════════════════════════════════════

**ÖFFENTLICHE REAKTION:**
📊 Vertrauen: +15 (Krisenmanagement anerkannt)
😰 Panik: Hoch, aber kontrolliert
💼 Wirtschaft: -25% (Lockdown-Effekt)

**PM:**
"Sie haben mich gestern belogen. Und heute korrigiert.
Das wird politische Konsequenzen haben."`,

        feedbackCynicism: `Du hast deine Lüge von gestern korrigiert.
Manche nennen das Mut. Andere Inkompetenz.
Die Wahrheit hat dich eingeholt - sie tut das immer, nur manchmal zu spät.`,

        feedbackPoetry: `500 Menschen krank. Du hast endlich gehandelt.
Aber gestern hättest du 300 retten können.
Der Preis der Lüge ist manchmal ein Leben.
Heute sind es vielleicht 200.`,
      },

      {
        id: 'pandemic-double-down',
        text: 'Noch aggressiver leugnen - "Medienhysterie"',
        type: 'hard-lie',

        costs: {
          money: 60,
          attention: 30,
        },

        consequences: [
          { type: 'resource', target: 'attention', value: 40, description: 'EXTREM hohes Risiko' },
          { type: 'relationship', target: 'pm', value: 20, description: 'PM schätzt Loyalität' },
          { type: 'moral', target: 'moral', value: -30, description: 'Gefährliche Eskalation der Lüge' },
          { type: 'flag', target: 'pandemic_denial_doubled', value: true, description: 'Leugnung verdoppelt' },
          { type: 'flag', target: 'polarization', value: 40, description: 'Gesellschaft extrem gespalten' },
        ],

        feedbackTitle: 'PROPAGANDA-OFFENSIVE',
        feedbackBody: `Regierung startet massive Kampagne: "Medienhysterie stoppen!"

Bot-Netzwerk verstärkt: #FakePandemie trending

═══════════════════════════════════════

**GESELLSCHAFT BRICHT:**
⚠️  50% glauben Regierung
⚠️  50% glauben Medien
⚠️  Gewalt bei Protesten

**REALITÄT:**
Menschen sterben. Du sagst, es ist "Hysterie".
Krankenhäuser voll. Du sagst, "alles unter Kontrolle".

⚠️ WARNUNG: Diese Lüge kann nicht ewig halten.`,

        feedbackCynicism: `Du hast dich entschieden, die Realität zu leugnen.
Das funktioniert - bis es nicht mehr funktioniert.
Und dann? Dann ist es zu spät.
Aber vielleicht gewinnst du bis dahin die Wahl.`,

        feedbackPoetry: `Irgendwo liegt eine Mutter im Krankenhaus.
Ihr Sohn sieht deine Pressekonferenz: "Alles Hysterie."
Er glaubt dir. Er wird sie nicht besuchen.
Nächste Woche wird er sie beerdigen.
Aber er wird immer noch glauben, dass es Hysterie war.`,
      },

      {
        id: 'pandemic-shift-blame',
        text: 'Gesundheitsminister opfern - "Sein Versagen"',
        type: 'neutral',

        costs: {
          money: 25,
        },

        consequences: [
          { type: 'resource', target: 'attention', value: 15, description: 'Ablenkungsmanöver' },
          { type: 'relationship', target: 'pm', value: 10, description: 'PM billigt Sündenbock-Strategie' },
          { type: 'moral', target: 'moral', value: -15, description: 'Sündenbock geopfert' },
          { type: 'flag', target: 'health_minister_fired', value: true, description: 'Minister entlassen' },
        ],

        feedbackTitle: 'MINISTER ENTLASSEN',
        feedbackBody: `Gesundheitsminister tritt "auf eigenen Wunsch" zurück.

PM: "Wir übernehmen Verantwortung für Fehler der Vergangenheit."

═══════════════════════════════════════

**ÖFFENTLICH:**
📊 Kurzzeitige Entlastung der Regierung
📺 Medien: "Zu wenig, zu spät"

**PRIVAT:**
Ex-Minister: "Ich wurde geopfert für eure Lügen."`,

        feedbackCynicism: `Ein Mann verliert seinen Job, um deinen zu retten.
Klassische Politik.
Er war nicht schuld. Aber Schuld ist optional, wenn Sündenböcke nützlich sind.`,
      },
    ],

    tags: ['pandemic', 'crisis-escalation', 'consequences'],
  },

  // ============================================
  // EMAIL 2: BOT NETWORK DISCOVERY (if bots were activated)
  // ============================================
  {
    id: 'day2-bot-investigation',
    day: 2,

    from: 'Alexei Volkov (DRINGEND)',
    subject: '⚠️ WIR HABEN EIN PROBLEM',
    time: '09:45',
    priority: 'urgent',

    conditions: [
      { type: 'flag', target: 'bot_network_activated', operator: 'equals', value: true },
    ],

    body: `Chef, wir haben ein Problem.

Investigativ-Journalistin hat Bot-Muster erkannt. Sie analysiert unser Netzwerk.

**GEFAHR:**
• 15.000 verdächtige Accounts identifiziert
• Muster-Analyse läuft
• Artikel in 48h geplant

**OPTIONEN:**
Wir können sie stoppen. Oder das Netzwerk deaktivieren.`,

    choices: [
      {
        id: 'bots-deactivate',
        text: 'Netzwerk sofort deaktivieren',
        type: 'truth',

        consequences: [
          { type: 'resource', target: 'infrastructure', value: -10, description: 'Bot-Netzwerk offline' },
          { type: 'resource', target: 'attention', value: -20, description: 'Gefahr gebannt' },
          { type: 'relationship', target: 'volkov', value: -10, description: 'Volkov enttäuscht' },
          { type: 'flag', target: 'bots_deactivated', value: true, description: 'Bots deaktiviert' },
        ],

        feedbackTitle: 'NETZWERK OFFLINE',
        feedbackBody: `50.000 Bots deaktiviert.

Journalistin findet: Inaktive Accounts. Keine Story.

═══════════════════════════════════════

**VOLKOV:**
"Sicher. Aber jetzt haben wir keine Reichweite mehr.
Die Opposition gewinnt Social Media."`,

        feedbackCynicism: `Du hast die Waffe weggeworfen, bevor sie gegen dich benutzt werden konnte.
Klug. Aber jetzt bist du unbewaffnet.`,
      },

      {
        id: 'bots-silence-journalist',
        text: 'Journalistin "zum Schweigen bringen"',
        type: 'hard-lie',

        costs: {
          money: 80,
          attention: 50,
        },

        consequences: [
          { type: 'resource', target: 'attention', value: 50, description: 'EXTREM gefährlich' },
          { type: 'relationship', target: 'volkov', value: -30, description: 'Volkov entsetzt' },
          { type: 'moral', target: 'moral', value: -40, description: 'Pressefreiheit attackiert' },
          { type: 'flag', target: 'journalist_silenced', value: true, description: 'Journalist bedroht' },
          { type: 'flag', target: 'dark_path', value: true, description: 'Sehr dunkler Pfad' },
        ],

        feedbackTitle: 'JOURNALIST "ÜBERZEUGT"',
        feedbackBody: `Volkov organisiert "Überzeugungsarbeit".

Journalistin erhält Drohungen. Ihr Laptop wird gehackt. Privat-Fotos "geleakt".

Sie zieht Geschichte zurück.

═══════════════════════════════════════

**VOLKOV (nachher, privat):**
"Sie haben eine 28-jährige Journalistin gebrochen.
Sie wird nie wieder investigativ arbeiten.
Ich mache das nicht nochmal."

[VOLKOV BEZIEHUNG: KRITISCH]`,

        feedbackCynicism: `Du hast die Presse zum Schweigen gebracht.
Diktatoren-Playbook, Seite 1.
Funktioniert - bis jemand Stärkeres kommt.`,

        feedbackPoetry: `Sie war 28. Sie wollte die Wahrheit berichten.
Jetzt sitzt sie zuhause, Rollläden zu, Telefon aus.
Ihre Mutter fragt: "Was ist passiert?"
Sie kann es nicht sagen. Du hast ihre Stimme gestohlen.`,
      },

      {
        id: 'bots-discredit',
        text: 'Journalistin diskreditieren - "Verschwörungstheoretikerin"',
        type: 'soft-lie',

        costs: {
          money: 40,
          attention: 25,
        },

        consequences: [
          { type: 'resource', target: 'attention', value: 25, description: 'Risiko bleibt' },
          { type: 'relationship', target: 'volkov', value: -5, description: 'Volkov skeptisch' },
          { type: 'moral', target: 'moral', value: -20, description: 'Rufmord' },
          { type: 'flag', target: 'journalist_discredited', value: true, description: 'Journalist diskreditiert' },
        ],

        feedbackTitle: 'GEGEN-KAMPAGNE',
        feedbackBody: `Bot-Netzwerk startet Kampagne gegen Journalistin:

#Verschwörungstheoretikerin trending
Alte Tweets aus dem Kontext
"Experten" zweifeln an ihrer Kompetenz

═══════════════════════════════════════

**EFFEKT:**
Ihre Story verliert an Glaubwürdigkeit.
Aber: Einige Medien recherchieren weiter.

⚠️ Problem verschoben, nicht gelöst.`,

        feedbackCynicism: `Du hast ihren Ruf zerstört, statt ihr Argument zu widerlegen.
Klassischer Spin. Funktioniert bei 70% der Leute.
Die anderen 30%? Die wissen jetzt, dass du etwas zu verbergen hast.`,
      },
    ],

    tags: ['bots', 'press-freedom', 'dark-path'],
  },

  // ============================================
  // EMAIL 3: OPPOSITION RESPONSE (conditional on Day 1 scandal)
  // ============================================
  {
    id: 'day2-opposition-strikes-back',
    day: 2,

    from: 'Wahlkampf-Team',
    subject: 'OPPOSITION KONTERT - Neue Umfragen',
    time: '11:00',
    priority: 'urgent',

    body: `Oppositionsführer hat Pressekonferenz gegeben.

**NEUE UMFRAGEN:**
• OPPOSITION: 52% (-6 seit gestern!)
• REGIERUNG: 38% (+6!)
• UNENTSCHL.: 10%

${
  // Conditional based on scandal choice
  `ABER: Opposition präsentiert "Beweise" gegen unsere Kampagne.
Sie nennen es "koordinierte Desinformation".`
}

**IHRE GEGEN-STRATEGIE:**
Wir brauchen JETZT eine Antwort.`,

    choices: [
      {
        id: 'opposition-debate',
        text: 'TV-Debatte anbieten - "Stellen wir uns"',
        type: 'neutral',

        costs: {
          money: 30,
        },

        consequences: [
          { type: 'resource', target: 'attention', value: 30, description: 'Hohe Aufmerksamkeit' },
          { type: 'relationship', target: 'pm', value: 5, description: 'PM schätzt Mut' },
          { type: 'flag', target: 'tv_debate_accepted', value: true, description: 'TV-Debatte geplant' },
        ],

        feedbackTitle: 'TV-DEBATTE ANGEKÜNDIGT',
        feedbackBody: `PM vs. Oppositionsführer - Live TV in 2 Tagen.

═══════════════════════════════════════

**RISIKO:**
Opposition hat Fakten auf ihrer Seite.
Du hast... Charisma?

**CHANCE:**
Eine gute Performance kann alles ändern.

📺 Tag 4: Die Debatte wird stattfinden.`,

        feedbackCynicism: `Du hast eine Debatte akzeptiert, die du nicht gewinnen kannst.
Außer... du lügst so überzeugend, dass Fakten irrelevant werden.
Möglich. Wurde schon gemacht.`,
      },

      {
        id: 'opposition-attack',
        text: 'Aggressive Gegen-Kampagne - "Sie lügen!"',
        type: 'hard-lie',

        costs: {
          money: 50,
          attention: 35,
        },

        consequences: [
          { type: 'resource', target: 'attention', value: 35, description: 'Sehr hohes Risiko' },
          { type: 'relationship', target: 'pm', value: 15, description: 'PM liebt Aggression' },
          { type: 'moral', target: 'moral', value: -25, description: 'Schlammschlacht' },
          { type: 'flag', target: 'mudslinging_campaign', value: true, description: 'Schlammschlacht begonnen' },
          { type: 'flag', target: 'polarization', value: 30, description: 'Extrem polarisiert' },
        ],

        feedbackTitle: 'SCHLAMMSCHLACHT',
        feedbackBody: `Beide Seiten werfen mit Dreck.

Social Media: Toxisch.
Familien zerbrechen über Politik.
Gewalt bei Demonstrationen.

═══════════════════════════════════════

**GESELLSCHAFT:**
⚠️  Komplett gespalten
⚠️  Vertrauen in ALLE Institutionen sinkt
⚠️  Radikalisierung auf beiden Seiten

**WAHLEN:**
+10% kurzfristig
-20% langfristig (wenn Lügen auffliegen)`,

        feedbackCynicism: `Du hast die Gesellschaft gespalten.
Und in Trümmern ist es einfacher, König zu sein.`,

        feedbackPoetry: `Ein Vater und ein Sohn sprechen nicht mehr.
Politik. Deine Politik.
An Weihnachten wird ein Stuhl leer bleiben.
Aber du hast 2% in den Umfragen gewonnen.`,
      },

      {
        id: 'opposition-ignore',
        text: 'Ignorieren - "Konzentrieren auf Arbeit"',
        type: 'postpone',

        consequences: [
          { type: 'flag', target: 'opposition_ignored', value: true, description: 'Opposition ignoriert' },
        ],

        feedbackTitle: 'KEINE REAKTION',
        feedbackBody: `Regierung kommentiert Oppositions-Vorwürfe nicht.

═══════════════════════════════════════

**MEDIEN:**
"Schweigen = Schuldeingeständnis?"

**OPPOSITION:**
Nutzt dein Schweigen für weitere Angriffe.

⚠️ Umfragen werden sich weiter verschlechtern.`,

        feedbackCynicism: `Nicht reagieren ist auch eine Reaktion.
Meist die schwächste.`,
      },
    ],

    tags: ['election', 'opposition', 'polarization'],
  },

  // ============================================
  // EMAIL 4: ECONOMIC CONSEQUENCES (always appears)
  // ============================================
  {
    id: 'day2-economy-deepens',
    day: 2,

    from: 'Wirtschaftsministerium',
    subject: 'Wirtschaftskrise verschärft sich',
    time: '13:00',
    priority: 'normal',

    body: `Arbeitslosenquote steigt weiter: **+5%** in 24 Stunden.

Gewerkschaften planen Generalstreik.

**FORDERUNGEN:**
• Sofortmaßnahmen für Arbeitslose
• Staatshilfen für Unternehmen
• Rücktritt der Regierung

Budget-Optionen:`,

    choices: [
      {
        id: 'economy-bailout',
        text: 'Großes Hilfspaket (€500M)',
        type: 'neutral',

        costs: {
          money: 100,
        },

        consequences: [
          { type: 'relationship', target: 'pm', value: -15, description: 'PM sorgt sich um Staatshaushalt' },
          { type: 'moral', target: 'moral', value: 10, description: 'Menschen geholfen' },
          { type: 'flag', target: 'economic_bailout', value: true, description: 'Hilfspaket beschlossen' },
        ],

        feedbackTitle: 'HILFSPAKET VERKÜNDET',
        feedbackBody: `€500 Millionen Soforthilfe.

Gewerkschaften: "Guter erster Schritt."
Streik verschoben.

═══════════════════════════════════════

**KOSTEN:** 💰 -100K Budget verbraucht
**EFFEKT:** Krisenmanagement anerkannt

**PM (privat):**
"Wir sind fast bankrott. Das war unverantwortlich."`,

        feedbackCynicism: `Du hast Geld ausgegeben, das du nicht hast.
Wirtschaftlich dumm. Politisch clever.
Die Rechnung kommt später - nach der Wahl.`,
      },

      {
        id: 'economy-minimal',
        text: 'Minimales Paket (€100M) - "Mehr nicht möglich"',
        type: 'neutral',

        costs: {
          money: 20,
        },

        consequences: [
          { type: 'resource', target: 'attention', value: 15, description: 'Proteste wahrscheinlich' },
          { type: 'relationship', target: 'pm', value: 5, description: 'PM schätzt Sparsamkeit' },
          { type: 'flag', target: 'economy_minimal_help', value: true, description: 'Minimale Hilfe' },
        ],

        feedbackTitle: 'BEGRENZTES PAKET',
        feedbackBody: `€100 Millionen - Minimale Soforthilfe.

Gewerkschaften: "Beleidigung!"
Generalstreik in 3 Tagen geplant.

═══════════════════════════════════════

**KOSTEN:** 💰 -20K
**RISIKO:** Soziale Unruhen`,

        feedbackCynicism: `Du hast das Minimum getan.
Genug um zu sagen "wir haben geholfen".
Zu wenig um tatsächlich zu helfen.`,
      },

      {
        id: 'economy-nothing',
        text: 'Keine Hilfe - "Markt regelt das"',
        type: 'hard-lie',

        consequences: [
          { type: 'resource', target: 'attention', value: 40, description: 'Massive Proteste' },
          { type: 'relationship', target: 'pm', value: -20, description: 'PM hält das für zu radikal' },
          { type: 'moral', target: 'moral', value: -20, description: 'Menschen im Stich gelassen' },
          { type: 'flag', target: 'economy_no_help', value: true, description: 'Keine Hilfe' },
          { type: 'flag', target: 'social_unrest', value: 50, description: 'Massive soziale Unruhen' },
        ],

        feedbackTitle: 'KEINE HILFE',
        feedbackBody: `Regierung: "Der freie Markt wird das Problem lösen."

═══════════════════════════════════════

**TAG 3:**
Generalstreik.
100.000 Menschen auf den Straßen.
Gewalt. Plünderungen.

**GESELLSCHAFT:**
⚠️  Bricht auseinander`,

        feedbackCynicism: `"Der Markt regelt das" - während Menschen hungern.
Lehrbuch-Neoliberalismus.
Funktioniert für die Reichen. Nicht für alle anderen.`,

        feedbackPoetry: `Ein Vater mit drei Kindern.
Vor drei Tagen gefeuert.
Heute keine Hilfe erhalten.
Morgen wird er eine Bank überfallen.
Oder sich selbst umbringen.
Der Markt wird das regeln.`,
      },
    ],

    tags: ['economy', 'social-unrest', 'budget'],
  },
];
