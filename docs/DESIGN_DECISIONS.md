# Design-Entscheidungen: Finale Antworten

**Datum:** 2025-12-29
**Status:** Vom Designer bestätigt

---

## Entscheidung 1: Combo-System

**Frage:** Sollen Combos von Anfang an sichtbar sein oder entdeckt werden?

**Antwort:** **ZUM ENTDECKEN**

**Begründung:**
> "Standard für das Spiel ist nahe am realen Leben oder im Sinne von gut recherchierten Analysen als Grundlage"

**Implementation:**
- Combos sind initial VERSTECKT
- Wenn ein Spieler zufällig die richtigen Aktionen macht → Combo wird "entdeckt"
- Entdeckte Combos werden in einem "Playbook" gespeichert
- Beim nächsten Spiel: Spieler sieht entdeckte Combos, aber nicht unentdeckte
- UI zeigt: "? / 10 Combos entdeckt"

**Realismus-Bezug:**
Echte Desinformations-Kampagnen "entdecken" auch effektive Taktiken durch Trial & Error. Die IRA (Internet Research Agency) entwickelte ihre Methoden über Jahre.

---

## Entscheidung 2: Verrats-System

**Frage:** Wie oft soll NPC-Verrat vorkommen?

**Antwort:** **NUR BEI BESTIMMTEM SPIELSTIL**

**Begründung:**
> "Das System ist für immer, bis es nicht mehr ist" - Autokratien kollabieren plötzlich, aber innerlich gibt es viele Komponenten.

### Wissenschaftliche Grundlage

Aus der Forschung zu autoritärem Zusammenbruch:

1. **Preference Falsification** (Timur Kuran)
   - Menschen verbergen ihre wahre Meinung
   - Das System erscheint stabiler als es ist
   - Plötzlicher Umschwung wenn Schwelle erreicht

2. **Der Autoritäre Wetteinsatz** (Slantchev & Matush)
   - Je mehr Gewalt angewendet wird, desto mehr Widerstand entsteht
   - Kollaps passiert schneller als erwartet

3. **Selbstzerstörerische Spirale** (Kellogg Research)
   - Repression → mehr Repression → Kollaps
   - "Natural outcome of autocracies"

4. **Wirtschaftlicher Trigger**
   - "Sie kollabieren, weil ihnen das Geld für Korruption ausgeht"
   - Plötzliche Ressourcenknappheit = existenzielle Krise

### Übersetzung ins Spiel

**Verrat passiert NUR wenn mehrere Faktoren zusammenkommen:**

```
VERRATS-GLEICHUNG:

Verrat wahrscheinlich wenn:
  (Moral Weight > 60)           // Spieler ist "zu weit gegangen"
  AND (NPC Relationship < 30%)  // Beziehung ist beschädigt
  AND (Risk > 70%)              // Operation ist gefährdet
  AND (Budget < 20)             // Ressourcen werden knapp

ODER:

  (Spieler hat NPC direkt geschadet)
  AND (NPC hat "principled" Trait)
```

**Die Komponenten (versteckt akkumulierend):**

| Faktor | Was es bedeutet | Wie Spieler es verursacht |
|--------|-----------------|---------------------------|
| Moral Weight | Wie "dunkel" der Spieler geworden ist | Fragwürdige Aktionen wählen |
| NPC Trust | Wie sehr NPC dem Spieler vertraut | Versprechen brechen, ignorieren |
| System Stress | Wie gefährdet die Operation ist | Hohes Risiko, viel Aufmerksamkeit |
| Resource Strain | Wirtschaftliche Lage | Budget erschöpft |
| Personal Harm | Hat Spieler den NPC direkt verletzt? | NPC's Kontakte angreifen, etc. |

**Der "Plötzliche" Kollaps:**

```
Phase 1-20:  NPC zeigt subtile Warnsignale (für aufmerksame Spieler)
Phase 21-30: Warnsignale werden deutlicher
Phase 31+:   Wenn Schwelle überschritten → PLÖTZLICHER Verrat

Der Spieler denkt: "Das kam aus dem Nichts!"
Aber in Wahrheit: "Die Zeichen waren da, ich habe sie ignoriert"
```

**Warnsignale (subtle → obvious):**

```
MARINA (Die Gewissenhafte):
Stufe 1: "Marina wirkt nachdenklich nach dem Meeting."
Stufe 2: "Marina fragt nach Dokumentation für ihre Akten."
Stufe 3: "Marina telefoniert auffällig oft außerhalb des Büros."
Stufe 4: "Marina hat Kopien sensibler Dokumente angefordert."
Stufe 5: [VERRAT] Marina hat Beweise an einen Journalisten gegeben.

VOLKOV (Der Opportunist):
Stufe 1: "Volkov scheint ungewöhnlich interessiert an Budget-Details."
Stufe 2: "Volkov trifft sich mit 'alten Kontakten'."
Stufe 3: "Volkovs Berichte enthalten auffällige Lücken."
Stufe 4: "Volkov wurde bei einem Treffen mit Unbekannten gesehen."
Stufe 5: [VERRAT] Volkov hat Informationen an Konkurrenz verkauft.

ALEKSEI (Der Rivale):
Stufe 1: "Aleksei gratuliert dir auffällig herzlich zu Erfolgen."
Stufe 2: "Aleksei stellt viele Fragen über deine Methoden."
Stufe 3: "Der Direktor erwähnt, dass Aleksei 'interessante Ideen' hat."
Stufe 4: "Aleksei hat private Meetings mit dem Direktor."
Stufe 5: [VERRAT] Aleksei hat dich beim Direktor als Sicherheitsrisiko gemeldet.
```

**Kaskaden-Effekt:**
```
Ein Verrat kann andere auslösen:
Marina verrät → Risiko steigt massiv
→ Volkov sieht sinkendes Schiff → verkauft Infos
→ Aleksei sieht Chance → beschuldigt dich
→ TOTALER KOLLAPS
```

---

## Entscheidung 3: Anzahl der Enden

**Frage:** Wie viele verschiedene Enden sollen existieren?

**Antwort:** **ANZAHL UNWICHTIG - PLAUSIBILITÄT UND VARIATION WICHTIG**

**Implementation:**

Statt "5 feste Enden" → **Modulares End-System:**

```
ENDE = Kombination aus:
  [Kampagnen-Ergebnis] + [Moral-Status] + [NPC-Situation] + [Entdeckungs-Status]

Beispiele:
├── Sieg + Niedrige Moral + Marina loyal + Unentdeckt
│   → "Der kalte Stratege" - Du hast gewonnen, aber allein
│
├── Sieg + Hohe Moral + Alle verraten + Teilweise entdeckt
│   → "Der Pyrrhus-Sieger" - Westunion fällt, du auch
│
├── Niederlage + Mittlere Moral + Marina verrät + Voll entdeckt
│   → "Der Sündenbock" - Marina rettet sich, du wirst geopfert
│
├── Ausstieg + Niedrige Moral + Volkov verrät + Unentdeckt
│   → "Der verschwundene Schatten" - Du bist raus, aber Volkov jagt dich
│
└── [Viele weitere Kombinationen möglich]
```

**Generierte End-Texte:**
Statt statischer Texte → Template-System das Kontext einbezieht:

```
"Nach ${campaign_months} Monaten endete deine Kampagne.
${if victory} Westunion ist destabilisiert. ${endif}
${if defeat} Du wurdest enttarnt. ${endif}
${if betrayed_by} ${npc_name} war es, der dich verriet. ${endif}
${moral_reflection}
${npc_epilogues}"
```

---

## Entscheidung 4: Taxonomie-Anzeige

**Frage:** Soll die wissenschaftliche Info prominent oder optional sein?

**Antwort:** **OPTIONAL (Tooltip/Details)**

**Implementation:**

```
┌─────────────────────────────────────────────────────────────┐
│ AKTION: Skandal-Schlagzeile                                 │
│                                                             │
│ Kosten: 30 Budget | Risiko: +5                              │
│ Effekt: -15% Trust bei Ziel                                 │
│                                                             │
│ [ℹ️ Mehr erfahren]  ← Klickbar, öffnet:                      │
└─────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│ 📚 WISSENSCHAFTLICHER HINTERGRUND                           │
│                                                             │
│ Basiert auf: Framing, Emotional Appeal                      │
│                                                             │
│ "Framing refers to how information is presented to          │
│  influence interpretation..."                               │
│                                                             │
│ Studie: Kahneman & Tversky (1981)                           │
│                                                             │
│ Gegen-Strategien:                                           │
│ • Reframe from multiple perspectives                        │
│ • Ask "How else could this be described?"                   │
│                                                             │
│ Echtes Beispiel: Brexit "£350M für NHS" Kampagne            │
└─────────────────────────────────────────────────────────────┘
```

**Im Post-Game Debriefing:** Dort PROMINENT anzeigen, weil Reflexionsmoment.

---

## Zusammenfassung

| Frage | Antwort | Kern-Prinzip |
|-------|---------|--------------|
| Combos | Zum Entdecken | Realismus: Taktiken werden durch Trial & Error gelernt |
| Verrat | Nur bei Spielstil | "Das System ist für immer, bis es nicht mehr ist" |
| Enden | Modular, plausibel | Keine feste Zahl, sondern kontextabhängige Variation |
| Taxonomie | Optional | Bildung für Interessierte, nicht aufdringlich |

---

## Quellen für Verrats-Design

- [The Hidden Fragility of Authoritarian Regimes](https://politicsrights.com/the-hidden-fragility-of-authoritarian-regimes/)
- [How Autocracies Unravel](https://insight.kellogg.northwestern.edu/article/how-autocracies-unravel)
- [Why Dictators Fall](https://engelsbergideas.com/notebook/why-dictators-fall/)
- [The Authoritarian Wager: Political Action and the Sudden Collapse of Repression](https://journals.sagepub.com/doi/full/10.1177/0010414019843564)
- [How Authoritarian Regimes Fall: A Century of Uprisings](https://medium.com/@kilroy-was-here/how-authoritarian-regimes-fall-a-century-of-uprisings-a91c64f8a926)
