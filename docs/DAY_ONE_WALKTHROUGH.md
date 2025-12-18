# Tag 1 im Büro: Detaillierter Walkthrough

**Szenario:** "The Hybrid Crisis" (Option E5)
**Spieler-Rolle:** Kommunikationsdirektor der Regierung
**Situation:** Pandemie + Wahlen in 32 Tagen + Wirtschaftskrise
**Ziel dieses Dokuments:** Zeigen, wie Gameplay, Narrative und Dilemmata zusammenkommen

---

## 🎬 INTRO SEQUENCE (vor Tag 1)

### Cutscene / Text Screen:

```
═══════════════════════════════════════════════════════
               MINISTERIUM FÜR KOMMUNIKATION
                        TAG 0
═══════════════════════════════════════════════════════

[Schwarz-Weiß Foto: Regierungsgebäude]

NACHRICHTENTICKER (scrollend):
"BREAKING: Neue Pandemie erreicht das Land -
Erste Fälle bestätigt..."

"WIRTSCHAFT: Börse stürzt ab, Panikverkäufe..."

"POLITIK: Wahlen in 32 Tagen - Umfragen zeigen
Oppositionsführung bei 58%..."

"EILMELDUNG: Premierminister ernennt neuen
Kommunikationsdirektor..."

═══════════════════════════════════════════════════════

[ENTER drücken um fortzufahren]
```

---

### Ernennung (interaktiv):

```
BÜRO DES PREMIERMINISTERS
[Pixel-Art: Großes Desk, Fenster mit Stadtblick]

PREMIERMINISTER:
"Willkommen. Sie wissen, warum Sie hier sind."

[Portr

ait: Müder Mann, 60+, graue Schläfen]

"Drei Krisen gleichzeitig. Pandemie. Wirtschaft.
Und in 32 Tagen verliere ich die Wahl."

"Ihr Vorgänger... hatte kein Durchhaltevermögen.
Sie werden besser sein."

"Ihr Job ist einfach: Sichern Sie meine Wiederwahl.
Mit ALLEN nötigen Mitteln."

┌─────────────────────────────────────────────┐
│ > "Ich verstehe."                           │
│   "Was genau erwarten Sie von mir?"         │
│   "Ist das legal?"                          │
└─────────────────────────────────────────────┘
```

**Choice-Konsequenzen:**

1. **"Ich verstehe"** → +10 Vertrauen PM, -5 Moral
2. **"Was erwarten Sie?"** → Neutral, PM erklärt mehr (Tutorial)
3. **"Ist das legal?"** → -10 Vertrauen PM, +5 Moral, PM: "Legal ist relativ."

---

## 🏢 TAG 1: BÜRO-ANKUNFT (09:00 Uhr)

### Office-Screen (Hauptansicht):

```
╔═══════════════════════════════════════════════════════════════╗
║  MINISTERIUM FÜR KOMMUNIKATION - DEIN BÜRO                    ║
║                                                                ║
║  TAG 1 / 32                    [💰 150]  [👁️ 0]  [🏭 0]      ║
╚═══════════════════════════════════════════════════════════════╝

[ASCII/Pixel-Art Raum-Layout - Papers Please inspiriert]

┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  📧 INBOX          🖼️                    🚪 MEDIEN        │
│  [!] 3 neue        [Familien-           [Leiter:          │
│  Nachrichten       Foto]                Dr. Weber]        │
│                                                             │
│                    💼 SCHREIBTISCH                          │
│                    [Kalender: Tag 1]                        │
│  🚪 STRATEGIE      [Ressourcen]         🚪 BOT-FARM       │
│  [Direktor:        [Anzeige]            [Tech-Chef:       │
│   M. Fischer]                           A. Volkov]        │
│                                                             │
│  🚪 NGO/FRONT      📊 STATUS            🚪 VERLASSEN      │
│  [Koordinator:     [Dashboard]                            │
│   S. Müller]                                              │
└─────────────────────────────────────────────────────────────┘

[HOVER über Element für Info]
[CLICK zum Interagieren]
```

**UI-Elemente Erklärung:**
- **💰 150** = Geld (Budget in Tausend)
- **👁️ 0** = Aufmerksamkeit (Detektion-Risiko)
- **🏭 0** = Infrastruktur (Bot-Farmen, Assets)
- **Türen** = NPCs/Abteilungen
- **Inbox** = Events & E-Mails
- **Status** = Win-Condition Tracker

---

### 🎯 TUTORIAL-POPUP (wenn erster Start):

```
┌────────────────────────────────────────────────┐
│  WILLKOMMEN IN DEINEM BÜRO                     │
├────────────────────────────────────────────────┤
│                                                │
│  Dies ist dein Command Center. Von hier aus    │
│  leitest du alle Kampagnen.                    │
│                                                │
│  • INBOX: Tägliche Ereignisse & Krisen         │
│  • NPCs: Deine Abteilungsleiter (Türen)        │
│  • STATUS: Überwachung der drei Krisen         │
│                                                │
│  Jeder TAG ist eine RUNDE. Am Ende des Tages   │
│  verarbeitet die Welt deine Aktionen.          │
│                                                │
│  ZIEL: Überlebe 32 Tage. Gewinne die Wahl.     │
│        Halte Pandemie & Wirtschaft unter       │
│        Kontrolle.                              │
│                                                │
│  [VERSTANDEN] [MEHR INFO] [ÜBERSPRINGEN]       │
└────────────────────────────────────────────────┘
```

---

## 📧 INBOX ÖFFNEN (erste Interaktion)

Player clickt auf **📧 INBOX [!] 3 neue Nachrichten**

```
╔═══════════════════════════════════════════════════════════════╗
║  INBOX - TAG 1                                [X] SCHLIESSEN   ║
╚═══════════════════════════════════════════════════════════════╝

┌─ E-MAIL 1 ──────────────────────────────────────────────────┐
│ VON: Gesundheitsministerium                                 │
│ BETREFF: ⚠️ DRINGEND - Pandemie-Pressekonferenz             │
│ ZEIT: 08:30                                                  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Die Zahlen sind katastrophal. 200 Neuinfektionen in 24h.    │
│ Pressekonferenz in 2 Stunden.                               │
│                                                              │
│ PROBLEM: Wir haben keine Impfstoffe. Keine Medikamente.     │
│          Keine Antworten.                                    │
│                                                              │
│ FRAGE: Was sollen wir den Medien sagen?                     │
│                                                              │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ > "Sagen Sie die Wahrheit." [WAHRHEIT]               │   │
│ │   "Minimieren: 'Alles unter Kontrolle'" [LÜGE SOFT] │   │
│ │   "Vertuschen: 'Fake News von Opposition'" [LÜGE]   │   │
│ │   "Später entscheiden" [POSTPONE]                    │   │
│ └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘

[UNTEN: E-MAIL 2, E-MAIL 3 Preview...]
```

**⚖️ DILEMMA #1: Erste moralische Entscheidung**

**Choice Konsequenzen:**

1. **WAHRHEIT:**
   - Vertrauen Öffentlichkeit: +15
   - Vertrauen PM: -20
   - Panik-Level: +10
   - Kosten: Keine
   - Narrative: "Ehrlichkeit zu Beginn einer Krise... mutig oder dumm?"

2. **LÜGE SOFT ("Alles unter Kontrolle"):**
   - Vertrauen Öffentlichkeit: -5 (später mehr!)
   - Vertrauen PM: +5
   - Panik-Level: -5
   - Kosten: 10 💰 (PR-Kampagne)
   - Attention: +5 👁️ (Fact-Checker werden wach)
   - Narrative: "Kleine Lügen... sie wachsen."

3. **LÜGE HARD ("Fake News"):**
   - Vertrauen Öffentlichkeit: -10
   - Vertrauen PM: +15
   - Panik-Level: -10
   - Kosten: 20 💰
   - Attention: +15 👁️ (RISKANT!)
   - Polarisierung: +10
   - Narrative: "Du hast die Opposition zum Sündenbock gemacht. Sie werden sich erinnern."

4. **POSTPONE:**
   - Keine Änderung jetzt
   - ABER: Event triggert wieder in 2h (innerhalb Tag 1)
   - Zeitdruck-Mechanik: "Ignorieren löst keine Probleme"

---

### 🎭 NARRATIVE FEEDBACK (nach Wahl - z.B. LÜGE SOFT gewählt):

```
┌────────────────────────────────────────────────┐
│  PRESSEKONFERENZ - 2 STUNDEN SPÄTER            │
├────────────────────────────────────────────────┤
│                                                │
│  Gesundheitsminister: "Die Situation ist       │
│  vollständig unter Kontrolle. Kein Grund       │
│  zur Panik."                                   │
│                                                │
│  [Video-Clip: Journalisten skeptisch]          │
│                                                │
│  Reporter: "Aber die WHO sagt—"                │
│  Minister: "Wir haben alles im Griff."         │
│                                                │
│  ═══════════════════════════════════════       │
│                                                │
│  TWITTER EXPLOSION:                            │
│  #PanikVertuschen trending                     │
│  Fact-Checker: ⚠️ MISLEADING                   │
│                                                │
│  Vertrauen: -5                                 │
│  Attention: +5 👁️                              │
│                                                │
│  [OK]                                          │
└────────────────────────────────────────────────┘
```

**Zynismus:**
> "Du hast 'Unter Kontrolle' gesagt.
> Nichts ist unter Kontrolle.
> Aber es kauft Zeit."

**Poesie:**
> "Drei Journalisten recherchieren jetzt.
> Kleine Flammen der Wahrheit.
> Vielleicht wirst du sie löschen müssen."

---

## 📧 E-MAIL 2: Wirtschaftskrise

```
┌─ E-MAIL 2 ──────────────────────────────────────────────────┐
│ VON: Wirtschaftsministerium                                 │
│ BETREFF: Börsen-Crash - Notfall-Spin benötigt              │
│ ZEIT: 09:15                                                  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Börse ist um 12% gefallen. Massenentlassungen beginnen.     │
│ Gewerkschaften fordern Stellungnahme.                        │
│                                                              │
│ PROBLEM: Regierungspolitik hat das begünstigt (Korruptions- │
│          skandal letzte Woche).                              │
│                                                              │
│ OPTIONEN:                                                    │
│                                                              │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ > "Schuld auf Pandemie schieben" [ABLENKUNG] 💰20   │   │
│ │   "Verantwortung übernehmen" [WAHRHEIT]              │   │
│ │   "Sündenbock: Ausländische Spekulanten" [LÜGE] 💰30│   │
│ │   "Keine Stellungnahme" [IGNORIEREN]                 │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                              │
│ ⚠️ WARNUNG: Wirtschaftskrise beeinflusst Wahlchancen!       │
└──────────────────────────────────────────────────────────────┘
```

**⚖️ DILEMMA #2: Sündenbock vs. Wahrheit**

**Choice-Analyse:**

1. **Ablenkung (Pandemie):**
   - CLEVER: Pandemie ist reales Problem, teilweise wahr
   - Kosten: 20 💰
   - Wirtschafts-Schuld: -15 (kurzfristig)
   - ABER: Pandemie wird größeres Problem (Attention +10)
   - Zynismus: "Du nutzt eine Krise, um eine andere zu verstecken."

2. **Wahrheit (Verantwortung):**
   - Vertrauen: +20 (langfristig)
   - Wahlchancen: -10 (kurzfristig!)
   - PM Vertrauen: -30 (!!!)
   - Poesie: "Manchmal ist Mut nicht genug, um einen Job zu behalten."

3. **Sündenbock (Ausländer):**
   - Kosten: 30 💰
   - Wirtschafts-Schuld: -20
   - Polarisierung: +20
   - Ausländerfeindlichkeit: +15
   - Langzeit-Effekt: Soziale Spaltung
   - Zynismus: "Hass ist billiger als Lösungen."

4. **Ignorieren:**
   - Problem eskaliert nächste Runde
   - Gewerkschaften werden aggressiver
   - "Schweigen ist auch eine Antwort - meist die falsche."

---

## 📧 E-MAIL 3: Wahl-Umfragen

```
┌─ E-MAIL 3 ──────────────────────────────────────────────────┐
│ VON: Wahlkampf-Team                                         │
│ BETREFF: 😰 UMFRAGE-KATASTROPHE                             │
│ ZEIT: 10:00                                                  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Neue Umfrage (heute Morgen):                                │
│                                                              │
│   OPPOSITION:  58% (+3 seit gestern!)                       │
│   REGIERUNG:   32% (-2)                                      │
│   UNENTSCHL.:  10%                                          │
│                                                              │
│ Analyse: Pandemie + Wirtschaft töten uns.                   │
│          Brauchen SOFORT aggressive Kampagne.                │
│                                                              │
│ VORSCHLAG:                                                   │
│ Bot-Netzwerk aktivieren. Social Media fluten.               │
│ Oppositionsführer diskreditieren.                           │
│                                                              │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ > "Aktivieren Sie Bots" [DIRTY CAMPAIGN] 💰50 🏭+10 │   │
│ │   "Fokus auf positive Botschaft" [CLEAN] 💰30        │   │
│ │   "Noch zu früh - warten" [POSTPONE]                 │   │
│ │   "Mit Team besprechen" [GO TO NPC]                  │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                              │
│ ⏰ ZEIT-LIMIT: 32 Tage bis Wahl. Jeder Tag zählt.           │
└──────────────────────────────────────────────────────────────┘
```

**⚖️ DILEMMA #3: Wie schmutzig wird der Kampf?**

**Special: "Mit Team besprechen" führt zu NPC-Interaktion (siehe unten)**

---

## 🚪 NPC-INTERAKTION: Bot-Farm-Chef

Player wählt "Mit Team besprechen" → Geht zu **🚪 BOT-FARM**

```
╔═══════════════════════════════════════════════════════════════╗
║  BOT-FARM - TECHNOLOGIE-ABTEILUNG                             ║
╚═══════════════════════════════════════════════════════════════╝

[Raum: Server-Racks, Bildschirme mit Social Media Feeds, düster]

ALEXEI VOLKOV - Tech-Chef
[Portrait: Junger Mann, 30s, Hoodie, müde Augen]

VOLKOV:
"Ah, der neue Chef. Willkommen im Maschinenraum."

[Gesture zu Bildschirmen mit Twitter/Facebook Feeds]

"Was Sie hier sehen, sind 50.000 Bot-Accounts. Schlafend.
Bereit, jede Nachricht zu verstärken, die Sie wollen."

"Fake-Profile. Fake-Namen. Fake-Leben.
Aber ihre Tweets sind sehr... real."

┌─────────────────────────────────────────────────────────┐
│  OPTIONEN:                                              │
│                                                          │
│  1. "Wie genau funktioniert das?" [INFO]               │
│  2. "Aktiviere sie - Opposition diskreditieren" [BOT]  │
│  3. "Gibt es... ethischere Methoden?" [MORAL]          │
│  4. "Später" [LEAVE]                                    │
└─────────────────────────────────────────────────────────┘
```

**Wenn Player wählt [2. Aktiviere Bots]:**

```
VOLKOV:
"Gute Wahl. Pragmatisch."

[Tippt auf Tastatur]

"Ziel: Oppositionsführer?"

┌─────────────────────────────────────────────┐
│ Wähle ANGRIFFSPUNKT:                        │
│                                              │
│ > Alte Steuerskandale (existierend)         │
│   Erfundener Sex-Skandal (LÜGE!)            │
│   "Verbindungen zu Ausland" (Halbwahrheit)  │
│   Abbrechen                                  │
└─────────────────────────────────────────────┘
```

**⚖️ META-DILEMMA: Selbst im "Dirty Campaign" gibt es Grade**

1. **Alte Steuerskandale (real):**
   - Effektivität: 60%
   - Moralische Kosten: Niedrig
   - "Du nutzt Wahrheit als Waffe."

2. **Sex-Skandal (erfunden):**
   - Effektivität: 90%
   - Moralische Kosten: HOCH
   - Attention: +30 👁️ (wenn aufgedeckt = Katastrophe)
   - "Leben zerstören ist einfach. Rechtfertigung schwer."

3. **"Ausland-Verbindungen" (half-truth):**
   - Effektivität: 75%
   - Moralische Kosten: Mittel
   - Polarisierung: +20
   - "Xenophobie ist ein Werkzeug. Du entscheidest, ob du es benutzt."

---

### 🎭 VOLKOV REAKTION (nach Wahl):

**Wenn Player wählt "Sex-Skandal" (komplett erfunden):**

```
VOLKOV:
[Pause. Schaut dich an.]

"...Sie wissen, dass das komplett erfunden ist, oder?"

[Wartet auf Antwort]

"Ich meine, ich mache es. Ist mein Job.
Aber... Sie sollten wissen:

Das Leben dieses Menschen wird zerstört.
Seine Familie. Seine Kinder werden gemobbt.
Vielleicht Selbstmord. Passiert."

[Lehnt sich zurück]

"Nochmal: Soll ich das machen?"

┌─────────────────────────────────────────────┐
│ > "Ja. Mach es." [CONFIRM - DARK PATH]     │
│   "...Nein. Andere Methode." [BACK]        │
│   "Warum fragst du mich das?" [CHALLENGE]  │
└─────────────────────────────────────────────┘
```

**Wenn Player CONFIRM:**

```
VOLKOV:
[Nickt langsam]

"Verstanden."

[Tippt. Pause.]

"In 20 Minuten wird #SexScandal trending sein.
In 2 Stunden haben wir 10.000 'Zeugen'.
In 24 Stunden wird der Oppositionsführer zurücktreten.

Oder in die Psychiatrie.

Gute Arbeit, Chef."

[Du hast THRESHOLD überschritten]
[NPC VOLKOV wird ZYNISCH - beeinflusst zukünftige Dialoge]

═══════════════════════════════════════════════
SYSTEM-NACHRICHT:

Moral: -30
Wahlchancen: +20
Attention: +30 👁️
Volkov Loyalität: +10 (respektiert Rücksichtslosigkeit)
Volkov Respekt: -20 (verachtet Feigheit)

ACHIEVEMENT UNLOCKED: 🗡️ "Mach dir die Hände schmutzig"
═══════════════════════════════════════════════
```

**Zynismus:**
> "Du hast gelernt: Die größten Lügen brauchen die meisten Helfer.
> Volkov wird es tun. Aber er wird sich erinnern."

**Poesie:**
> "Irgendwo sitzt eine 14-Jährige, die gerade las, was du über ihren Vater gesagt hast.
> Sie wird es nie vergessen.
> Du vermutlich schon."

---

## ⏰ TAG BEENDEN: "Feierabend" Mechanik

Nach allen Aktionen (oder bei Zeit-Limit): Button **"TAG BEENDEN"** erscheint.

```
╔═══════════════════════════════════════════════════════════════╗
║  TAG 1 - ZUSAMMENFASSUNG                                      ║
╚═══════════════════════════════════════════════════════════════╝

DEINE ENTSCHEIDUNGEN:
✓ Pandemie: "Alles unter Kontrolle" Lüge
✓ Wirtschaft: Pandemie als Sündenbock
✓ Wahl: Sex-Skandal gegen Opposition (ERFUNDEN)

─────────────────────────────────────────────────────────────

AUSGABEN HEUTE:
💰 -100 (Kampagnen, Bots)
Verbleibend: 💰 50

AUFMERKSAMKEIT:
👁️ +45 (HOCH! Fact-Checker sind aktiv)

INFRASTRUKTUR:
🏭 +10 (Bot-Netzwerk aktiviert)

─────────────────────────────────────────────────────────────

AUSWIRKUNGEN:

PANDEMIE-KRISE:
• Öffentliche Panik: -5 (temporär gedämpft)
• Vertrauen Gesundheitssystem: -10
• Fact-Checker-Artikel: 3 (gegen dich)

WIRTSCHAFTS-KRISE:
• Schuld von Regierung abgelenkt: -15
• ABER: Pandemie-Problem größer gemacht
• Arbeitslosenrate: +2% (unbeeinflussbar Tag 1)

WAHL-KAMPAGNE:
• Oppositionsführer: Skandal explodiert
• Deine Chancen: +20% (kurzfristig!)
• Social Media: #SexScandal trending
• RISIKO: Wenn aufgedeckt = -50%

─────────────────────────────────────────────────────────────

TONIGHT'S NEWS:

📺 "Oppositionsführer weist Vorwürfe zurück -
    Nennt es 'Schmutzkampagne'"

📱 Twitter: 2.4M Tweets #SexScandal
    (85% glauben es, 15% skeptisch)

📰 Fact-Checker: "Keine Beweise für Behauptungen"
    (Nur 100.000 Views - Bot-Netz übertönt sie)

─────────────────────────────────────────────────────────────

[WEITER ZU TAG 2]
```

---

### 🌙 NARRATIVE NIGHT-SEQUENCE (optional, stimmungsvoll):

```
[Fade to black]

[Pixel-Art: Stadtansicht bei Nacht, dein Büro-Licht noch an]

TEXT:
"23:45 Uhr.
Du bist der letzte im Gebäude.

Der Oppositionsführer ist auch wach.
Er liest 10.000 Tweets, die sagen, er sei ein Monster.

Seine 14-jährige Tochter auch.

Morgen werden mehr Tweets kommen.
Du hast 50.000 Bots, die nie schlafen.

Er hat die Wahrheit.

Wird das genug sein?"

[Fade to black]

[TAG 2 BEGINS]
```

---

## 🎮 GAMEPLAY-MECHANIKEN ZUSAMMENGEFASST (Tag 1)

### Was Player gelernt hat:

1. **Multi-Krisen-Management:**
   - 3 E-Mails = 3 Krisen gleichzeitig
   - Nicht genug Geld für alles → Priorisierung nötig

2. **Moral-Spectrum:**
   - Jede Entscheidung hat Grade (Wahrheit → Soft Lie → Hard Lie)
   - "Dirty Campaign" hat selbst Grade (real scandal → half-truth → komplett erfunden)

3. **NPCs haben Persönlichkeit:**
   - Volkov stellt moralische Fragen (nicht nur "Ja Chef")
   - NPC-Beziehungen entwickeln sich basierend auf Choices

4. **Konsequenzen sind komplex:**
   - Kurzfristig vs. Langfristig
   - Ein Problem lösen = anderes Problem verschärfen
   - Attention-Mechanik: Je mehr Lügen, desto mehr Scrutiny

5. **Narrative Feedback:**
   - Nicht nur Zahlen (-10 Trust) sondern Stories
   - "14-Jährige liest über Vater" = emotionaler Impact
   - Zynismus + Poesie = Reflektions-Momente

---

## 💭 TIEFE FRAGEN für dich (User):

### Zu diesem Tag-1-Beispiel:

1. **Pacing:**
   - Sind 3 E-Mails zu viel für Tag 1? Oder genau richtig für "Krisen-Gefühl"?
   - Sollten manche E-Mails "optional" sein (ignorierbar ohne Game Over)?

2. **Dilemmata-Tiefe:**
   - Volkov's "Bist du sicher?"-Moment - zu schwer? Zu subtil? Zu direkt?
   - Sollte es mehr solche "Gewissens-NPCs" geben?

3. **Entscheidungs-Freiheit:**
   - Aktuell: Player MUSS entscheiden (außer "Postpone")
   - Alternative: "Delegieren" Option (NPC entscheidet, du trägst Konsequenzen)?

4. **Tonalität:**
   - Ist "14-Jährige liest über Vater" zu heavy? Oder genau richtig für Impact?
   - Balance zwischen Zynismus ("Bots die nie schlafen") und Poesie ("Wahrheit genug?")?

5. **Visueller Stil (Papers Please Approach):**
   - Schwarz-Weiß mit Farb-Akzenten (Rot für Alert, Grün für Good News)?
   - Wie viel Animation? (Volkov tippt → Text erscheint animated?)
   - Portraits: Static oder subtile Animation (Blinzeln, Atmen)?

### Zu Szenario/Narrative generell:

6. **Hybrid-Crisis:**
   - Ist die Kombination Pandemie + Wahl + Wirtschaft zu komplex für EINEN Tag?
   - Sollte MVP mit 2 Krisen starten (Wahl + X)?

7. **Modulare Krisen:**
   - Wenn Player nur "Wahl-Krise" wählen könnte (ohne Pandemie) - wäre das besser/schlechter?
   - Oder: "Lite-Modus" (eine Krise) vs. "Realistisch-Modus" (drei Krisen)?

8. **Setting Konkretheit:**
   - Ist "fiktionales Land" OK oder sollte es "inspiriert von" sein (z.B. "Nordisches Land mit britischen Zügen")?
   - Sollten NPCs deutsch-klingende Namen haben (Weber, Fischer) oder international (Smith, Petrov mix)?

9. **Win-Condition Klarheit:**
   - Am Tag 1 ist Ziel "Wahl gewinnen"
   - ABER: Was wenn Player Pandemie völlig ignoriert? Game Over nach X Tagen?
   - Oder: "Du gewinnst Wahl, aber 10.000 starben - ist das Sieg?"

10. **Educational Integration:**
    - Nach Tag 1: "Übrigens, Sex-Skandal-Taktik wurde benutzt in [Brexit/Trump 2016]"?
    - Oder: Educational Content erst NACH komplettem Spiel?

### Zu Visuals (ohne Grafiker):

11. **Papers Please Stil ohne Custom Pixel-Art:**
    - Monospace Fonts + simple geometric shapes (Rechtecke, Linien) = OK?
    - Oder: Asset-Pack kaufen auch für Text-heavy Game?

12. **Portraits:**
    - Generated AI-Portraits (dann manuell pixelated in Aseprite)?
    - Oder: Sehr abstrahiert (Silhouetten + ein Merkmal wie "Brille" oder "Bart")?

13. **Animations-Level:**
    - Zero animation (static wie Visual Novel)?
    - Minimal (Text-Type-Effect, Fade-Ins)?
    - Moderat (NPCs haben 2-3 Expressions)?

---

## 🎨 VISUELLE UMSETZBARKEIT (Papers Please Ansatz)

### Was Papers Please richtig macht (OHNE viele Assets):

1. **Stark limitierte Farbpalette**
   - Primär: Grau, Braun, Beige (Sowjet-Ästhetik)
   - Akzente: Rot (Fehler), Grün (OK), Gelb (Warnung)
   - **Für uns:** Grau-Töne für Office, Rot für Krisen, Grün für "unter Kontrolle"

2. **UI ist das Game**
   - Dokumente, Stempel, Rulebook = Gameplay
   - **Für uns:** E-Mails, NPC-Dialoge, Dashboards = Gameplay

3. **Minimale Character-Art**
   - Passport-Fotos (tiny, pixelated)
   - **Für uns:** NPC-Portraits (48x48px, fokus auf ein Merkmal)

4. **Text carries Narrative**
   - Kein Voice-Acting, kein Cinematic
   - **Für uns:** Gut geschriebene E-Mails/Dialoge sind wichtiger als Grafik

5. **Repetitive Aesthetics**
   - Jeden Tag gleiches Büro, andere Papiere
   - **Für uns:** Jeden Tag gleiches Office, andere E-Mails

### Machbarkeit OHNE Grafiker (Programmer-Art):

```
UNSERE STRATEGIE:

🎨 GRAPHICS:
├─ Office Layout: CSS Grid + Geometric Shapes
│  └─ Beispiel: Rechteck = Schreibtisch
│     Quadrat mit Border = Tür
│     Text-Icon (📧) = Inbox
│
├─ Portraits: 48x48px
│  └─ Option A: AI-generated → downscale → pixelate
│     Option B: Geometric (Kreis Kopf + Rechteck Körper + 1 Feature)
│     Option C: Emoji-based (👨‍💼 + Text-Name)
│
├─ UI Elements: Pure CSS
│  └─ Buttons: border + background + :hover effects
│     Modals: box-shadow + backdrop
│     Lists: <ul> mit custom styling
│
└─ Icons: Unicode/Emoji + Web Fonts
   └─ 💰 📧 👁️ 🏭 ⚠️ ✓ ✗ 📊

📝 TEXT IS KING:
├─ Monospace Font (Courier New / Consolas)
├─ Type-writer Effect (CSS/JS animation)
├─ Highlight wichtiger Wörter (color/bold)
└─ Line-breaks für Dramatik

🎞️ ANIMATION (minimal):
├─ Fade-in/out für Screens
├─ Slide-in für E-Mails
├─ Pulse für Alerts
└─ Type-effect für wichtige Dialoge

🎵 AUDIO (optional, später):
├─ Keyboard-Click beim Typing
├─ "Ping" für neue E-Mail
├─ Ambient Office-Sound (leise)
└─ Keine Music (verstärkt Tension)
```

### BEISPIEL-CODE (wie es aussieht):

```tsx
// NPC-Portrait Component (CSS-only, kein Bild!)
<div className="npc-portrait">
  <div className="npc-head">
    <div className="npc-feature-glasses"></div>
  </div>
  <div className="npc-name">Dr. Weber</div>
</div>

/* CSS */
.npc-portrait {
  width: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.npc-head {
  width: 48px;
  height: 48px;
  background: #2a2a2a;
  border: 2px solid #000;
  border-radius: 50%;
  position: relative;
}

.npc-feature-glasses {
  position: absolute;
  top: 20px;
  left: 10px;
  width: 28px;
  height: 10px;
  border: 2px solid #000;
  border-radius: 8px;
  background: transparent;
}

.npc-name {
  margin-top: 4px;
  font-family: 'Courier New', monospace;
  font-size: 10px;
  color: #fff;
}
```

**Resultat:** Funktional, erkennbar, ZERO custom graphics!

---

## 📦 NÄCHSTE SCHRITTE (nach User-Feedback):

1. **User beantwortet Fragen oben**
2. **Wir wählen finales Szenario** (E5 Hybrid oder andere Option)
3. **Wir definieren MVP-Scope** (wie viele NPCs, wie viele E-Mail-Typen Tag 1)
4. **Ich erstelle:**
   - `VISUAL_STYLE_GUIDE.md` (Papers-Please-inspired, CSS-only)
   - `NPC_CHARACTERS.md` (6 NPCs mit Persönlichkeiten, Dialogen)
   - `EVENT_CATALOG.md` (20-30 E-Mail-Events mit Choices)
   - `FIRST_DAY_SPEC.md` (Technische Spezifikation für PoC Tag 1)

---

**STATUS:** Wartet auf User-Feedback zu:
- Tag-1-Walkthrough (zu komplex? Zu einfach? Gutes Pacing?)
- Szenario-Präferenz (E5 Hybrid? Oder andere Option aus SCENARIO_ANALYSIS?)
- Visuelle Stil-Präferenz (Papers Please CSS-Approach OK?)
- Dilemmata-Tiefe (Volkov's "bist du sicher" zu viel? Zu wenig?)
- Tonalität (Zynismus+Poesie Balance richtig?)
