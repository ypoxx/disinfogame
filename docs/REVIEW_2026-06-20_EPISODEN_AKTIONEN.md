# 🔍 Review — Episoden & Aktionen (Stand nach den Beats)

**Datum:** 2026-06-20 · **Branch:** `claude/gracious-keller-g43bu3`
**Anlass (Owner, Transkript):** „Ich habe immer noch so ein Gefühl, das ich nicht
beschreiben kann — dass die Aktionen entweder nicht gut formuliert sind für das
Erzählerische, oder nicht gut beschrieben, oder zu kompliziert. Die Beats/der Spine
sind ein guter Schritt nach vorne, aber es ist noch kein Gesamtkonzept, das aus
Nutzersicht **zur richtigen Zeit** Sinn ergibt. Hilf mir, daraus ein richtig gutes
Spiel zu machen, das nie langweilig wird."

**Lese-Reihenfolge:** `SOUL.md` → `STATUS.md` → `GESAMTPLAN_2026-06-20.md` →
`HANDOFF_2026-06-18.md` → **dieses Dokument**.

> **Methode (nichts erfunden):** Alle 143 Aktionen (5 JSON-Dateien) + alle 10 Episoden
> ausgelesen und vermessen; die Präsentations-Schicht (`ActionPanel`, `NarrativeBoard`,
> `StoryModeGame`) und die Lade-/Phasen-Logik (`ActionLoader`, `EpisodeLoader`,
> `StoryEngineAdapter`) im Code geprüft; gegen den realen Spieler-Eindruck aus
> `PLAYTEST_PERSONAS_2026-06-15.md` gehalten. Belege sind im Text mit `Datei:Zeile` verlinkt.

---

## 0. Das „Bauchgefühl" in einem Satz

> **Der Spine (Episoden + Beats) erzählt eine Geschichte. Der Aktions-Katalog ist eine
> Enzyklopädie. Beide existieren nebeneinander, aber sie greifen aus Spielersicht nicht
> ineinander — und ausgerechnet die *guten* Aktionen kommen zur *falschen* Zeit oder über
> die *falsche* Fläche.**

Das Gefühl ist berechtigt und hat **drei messbare Ursachen** (A/B/C). Keine davon ist
„die Texte sind schlecht" allein — die Texte sind nur die sichtbarste Schicht.

---

## 1. Befund A — Es gibt zwei Klassen von Inhalt (die alte und die gute)

Beim Lesen aller 143 Aktionen + 10 Episoden fällt ein klarer Qualitäts-Bruch auf.

### Die **guten** Inhalte (schreiben wie ein Autor)
- **Alle 10 Episoden.** Jede hat: einen Schauplatz, eine *benannte* Figur mit einer
  menschlichen Eigenschaft (Ina Brandt will vermitteln; Dr. Lena Ferro ist gut *und*
  erschöpft), eine NPC-Stimme mit einem Merksatz, und eine **Wendung** — eine klare
  Wahl zwischen zwei Wegen (leise/laut, klein/groß). Beispiel `ep_ferro`:
  > *„Wir müssen sie nicht widerlegen. Wir müssen sie nur müder machen."* — Alexei.
  > Wendung: *Ein großer Coup gegen sie — oder die leise Flut, bis sie aufgibt?*
- **Die Phänomen-Aktionen `11.x`** (P3, 18 Stück: Überflutung/Gerüchte/Zermürbung/
  Krisenfenster/Loyalitätsfalle/Erinnerungskonflikt). Beispiel `11.4`:
  > *„Ein vages ‚Man hört, dass…' reicht. Wir setzen es leise aus; das Publikum schreibt
  > die Details selbst dazu — und macht es unwiderlegbar."*
- **Die Finanz-Aktionen `9.x`** (Igor). Beispiel `9.1`:
  > *„Frisches Budget über eine willige Tarnbank. Das Geld ist sofort da — die Risiken
  > kommen später."*

Diese Texte sagen, **was die Maßnahme mit Menschen macht** — und tragen die Wendung schon
im Satz.

### Die **schwachen** Inhalte (transkribierte Taxonomie)
Die ursprünglichen Aktionen `1.x`–`8.x` (~100 Stück) lesen sich wie ein Lehrbuch-Index:
- *Was* die Sache *ist*, nicht *was sie bewirkt*: `2.1` „Wir brauchen automatisierte
  Verstärkung. Tausende Accounts…"; `1.5` „Was sagen die Leute online?"
- **Jargon-Labels** ohne Erklärung, oft englisch und uneinheitlich: *5Ds-Framework,
  Wedge Issues, Useful Idiots, Witting Agent (MICE), A/B-Testing, Cross-Platform-Push,
  Information Flooding, Astroturfing, SEO-Manipulation*. Für „spielaffine Erwachsene"
  (SOUL §6) ist etwas Fachsprache authentisch — aber dieses Durcheinander wirkt wie
  Hausaufgaben, nicht wie eine fiese Agentur.
- **Fragesätze statt Haltung:** Viele Narrative sind Fragen („Wo ist die Gesellschaft am
  verwundbarsten?"). Das ist Briefing-Sprache, keine Spielwelt.

> **Das ist die „nicht gut formuliert"-Hälfte des Bauchgefühls.** Wir haben den **guten
> Ton schon gefunden** (Episoden, `9.x`, `11.x`) — aber ~100 ältere Aktionen sind nie
> auf dieses Niveau gehoben worden. Es ist kein Stil-*Rätsel* mehr, nur unfertige Arbeit.

---

## 2. Befund B — Aktionen sind nach *interner Taxonomie* sortiert, nicht nach Spieler-Sinn (der „falsche Zeit"-Kern)

Das ist die **wichtigste** Erkenntnis dieses Reviews und vermutlich der eigentliche Kern
des Unbehagens.

### Die Phasen `ta01…ta07` sind keine Spielzeit — sie sind DISARM-Taktikstufen
Die 143 Aktionen sind in 8 „Phasen" gruppiert:

| Phase | Inhalt | # |
|---|---|---|
| ta01 | Aufklärung/Analyse | 11 |
| ta02 | Infrastruktur/Aufbau | 27 |
| ta03 | Content erstellen | 19 |
| ta04 | Verbreiten | 18 |
| ta05 | Verstärken | 16 |
| ta06 | Politik | 12 |
| ta07 | Gesellschaft | 17 |
| targeting | Angriff auf Personen | 23 |

Das ist die **Lebenszyklus-Taxonomie einer Operation** (erst planen, dann bauen, dann
ausspielen) — eine sinnvolle *Ordnung im Datenmodell*. Es ist **keine** Reihenfolge, in
der ein Spieler eine Kampagne erlebt.

### Der Bug-im-Konzept: Das Terminal koppelt diese Stufen an das **Spiel-Jahr**
`StoryModeGame.tsx:929`:
```ts
currentPhase={state.storyPhase.year <= 7 ? `ta0${state.storyPhase.year}` : 'targeting'}
```
Und `ActionPanel.tsx:449` zeigt **nur** Aktionen dieser einen Phase:
```ts
result = result.filter(a => a.phase === currentPhase || a.phase === 'any');
```
Mit `PHASES_PER_YEAR = 12` (`StoryEngineAdapter.ts:676`, Jahr = `ceil(phase/12)`) heißt das:

> **Im ganzen ersten Spiel-Jahr (12 „Tage"/Monate) zeigt das Terminal ausschließlich die
> 11 Aufklärungs-Aktionen aus `ta01` — die klinischste, langweiligste Teilmenge des
> Katalogs.** Content erstellen (`ta03`) gibt es im Terminal erst ab **Jahr 3**,
> Personen-Angriffe erst ab **Jahr 8**.

Ein realer Playtest erreicht Tag 2–3. Das bedeutet: **In jeder realen Erstsitzung sieht
der Spieler im Terminal nur „Zielgruppe analysieren", „Social Listening", „A/B-Testing
vorbereiten" …** — und nie die vivide Manipulation, die das Spiel eigentlich ausmacht.
Genau das beklagt der Playtest: *„143 Aktionen — reich, aber schlecht dosiert"*,
*„zu viel zu früh"* — hier ist es sogar **das Falsche zu spät**.

### Harter Beleg: Episoden verweisen auf Aktionen, die das Terminal jahrelang versteckt
Die Episoden (der gute Spine) sind über `einklink_aktionen` mit Aktionen verdrahtet — und
fast alle guten Aktionen, die sie brauchen, liegen in **späten** ta-Phasen:

| Episode | Auslöser | gebrauchte Aktionen → Terminal-Jahr |
|---|---|---|
| **ep_bruecke** (Keil) | **always** (ab Tag 1!) | 11.13, 11.14, 7.2 → **alle „Jahr 7"** |
| ep_geruecht_grenzstadt | media_scandal | 11.4, 11.5, 11.6 → Jahr 4 |
| ep_ferro | informationslast≥30 | 11.2, 11.3 (Jahr 5), 11.8 (Jahr 7) |
| ep_denkmalstreit | polarisierung≥50 | 11.16/17/18 → Jahr 7 |
| ep_wahlabend / ep_veen / ep_kort | (früh möglich) | 8.x / 9.11 → **„Jahr 8" (targeting)** |

`ep_bruecke` ist die **always**-Episode (faktisch die erste, die ein Keil-Spieler sieht).
Ihre drei Maßnahmen sind im Terminal **frühestens in Jahr 7** sichtbar. Der Spieler kann
seine **erste Episode im Terminal gar nicht spielen.**

### Die Folge: zwei Aktionsflächen mit verschiedenen Inventaren
Weil die Episoden so nicht funktionieren würden, holt die **Narrativ-Tafel**
(`NarrativeBoard`) die Aktionen über `state.availableActions` **ohne** Phasenfilter
(`StoryModeGame.tsx:1098`) — also **alles Freigeschaltete** (88 von 143 zu Beginn),
gruppiert nach Büro. Ergebnis, exakt wie im Playtest protokolliert:
- **Terminal:** ~7–11 Aktionen, nach Jahr gefiltert, primär in der Onboarding-Führung
  empfohlen („Terminal (A) → Maßnahme → Wirkung").
- **Tafel:** ~100 Aktionen inkl. illegaler, die das Terminal gar nicht zeigt.

> Persona B (der Systemiker) im Playtest: *„Zwei verschiedene Aktionslisten mit
> verschiedenen Inventaren — **warum?**"* — **Jetzt wissen wir warum:** Das Terminal ist
> jahres-/taxonomie-gegated, die Tafel nicht. Das ist kein Geschmack, das ist ein
> IA-Bruch (Information-Architektur). Es ist die **teuerste Einzel-Unklarheit** des Spiels.

---

## 3. Befund C — „Zu kompliziert" ist großteils Redundanz

143 Aktionen klingen nach Reichtum, sind aber zu einem guten Teil **Varianten desselben
Hebels** mit unterschiedlichen Texten. Beispiele (Cluster):

- **Bots/Automatisierung (×5):** 2.1 aufbauen · 2.2 erweitern · 5.1 Schwarm aktivieren ·
  9.15 KI-aufrüsten · 11.2 Bot-Flut.
- **Überflutung/Lärm (×4):** 5.8 Information Flooding · 11.1 Themen-Stau · 11.2 Bot-Flut ·
  11.3 Korrektur-Müdigkeit.
- **Geschichte/Erinnerung (×4):** 3.12 Historien-Revision · 11.16 Alten Konflikt · 11.17
  Geschichtsdeutung · 11.18 Gedenken vergiften.
- **Spaltung/Polarisierung (×6):** 3.10 · 3.13 · 7.2 · 7.6 · 11.13/11.14 …
- **Pseudo-Legitimität gründen (×6):** 2.8 Verein · 2.9 NGO · 2.10 Think-Tank · 2.13
  Strohmann-Partei · 2.14 Bildungsträger · 3.15 Studie.

Dazu kommt: **88 von 143 sind zu Spielbeginn freigeschaltet** (kein Prerequisite). Der
Möglichkeitsraum wird nicht *dosiert geöffnet* (Will-Wright-Empfehlung des Playtests),
sondern liegt fast komplett offen — nur eben aufgeteilt auf zwei Flächen mit
widersprüchlichen Filtern.

**Kleinere, aber sichtbare Reibungen am Entscheidungspunkt:**
- Die Karte zeigt prominent die **interne ID** („ID: 3.5", `ActionPanel.tsx:163`) — ein
  Entwickler-Artefakt mitten in der Fiktion.
- Die Wirkungs-Vorschau beim Planen ist generisch: „1 NPC-Bonus" / „Risiko +X"
  (`ActionPanel.tsx:302–340`). Die **Gesellschaftswert-Wirkung** (Polarisierung +X …) ist
  seit T1 nur im **Ergebnis-Modal** sichtbar, **nicht** beim Auswählen — also genau dort,
  wo die Entscheidung fällt, fehlt sie noch (Playtest-Kernbefund „Aktion↔Barometer
  nicht gekoppelt" — am Planungspunkt weiter offen).

---

## 4. Synthese — warum es „kein Gesamtkonzept" *fühlt*

Das Spiel hat drei Schichten, die jede für sich gut sind, aber **nicht miteinander reden**:

| Schicht | Zustand | Rolle, die sie spielen *sollte* |
|---|---|---|
| **Spine** (Auftrag · Beats · Episoden) | **stark**, frisch gebaut | das **„Warum jetzt"** — der Anlass |
| **Aktions-Katalog** (143) | flach, zweiklassig, redundant | das **„Was ich tue"** — das Vokabular |
| **Flächen** (Terminal jahres-gegated · Tafel offen) | **gebrochen** | das **„Wie ich wähle"** — die Bühne |

Der Spine sagt: *„Hier ist ein Moment, triff eine bedeutsame Wahl."* Der Katalog sagt:
*„Hier ist die ganze Enzyklopädie, such dir was aus."* Die Flächen zeigen in der
Frühphase ausgerechnet die schwächsten Aktionen — und verstecken die guten hinter Jahren
oder hinter der zweiten Fläche. **Deshalb fühlt es sich nicht wie ein Ganzes an, das zur
richtigen Zeit Sinn ergibt.**

---

## 5. Empfehlung — der Leitsatz, dann die Reihenfolge

### Leitsatz (das fehlende Gesamtkonzept)
> **Die Episode/der Beat ist die Einheit der Bedeutung. Aktionen sind ihr Vokabular —
> kuratiert, nicht katalogisiert.**

Konkret heißt das: Aktionen hören auf, ein paralleler „Tech-Tree nach Jahren" zu sein. Sie
werden **dann** angeboten, wenn ein Anlass (Episode/Beat/Lage) sie braucht — gut
geschrieben, in überschaubarer Zahl, mit sichtbarer Wirkung. Der volle Katalog bleibt als
freie „Werkzeugkiste" erhalten, ist aber nicht mehr die Eingangstür.

Das ist **kein** Bruch mit dem Gebauten — es ist die **Einlösung** des Spine. Die Beats/
Episoden sind bereits genau so gedacht (Anlass → ≥2 nicht-dominierte Wege). Es fehlt nur,
dass die *Aktionen* derselben Logik folgen statt einer Taxonomie-Uhr.

### Empfohlene Reihenfolge (klein → groß, jeder Schritt für sich auslieferbar)

**S0 — Sofort & risikolos (Tag, Gate-neutral):**
1. **Terminal-Jahres-Gate kappen** bzw. ersetzen. Das Filtern nach `ta0{year}` ist die
   Wurzel des „falsche Zeit"-Problems. Erste, kleinste Stufe: Terminal zeigt **alle
   freigeschalteten** Aktionen (wie die Tafel), gruppiert nach Büro/Thema statt nach
   ta-Phase. (Klärt zugleich den IA-Bruch der zwei Inventare.) — **Owner-Entscheid nötig,
   s. u.: war das Jahres-Gate Absicht?**
2. **Interne ID von der Karte nehmen** (`ActionPanel.tsx:163`) — reines Fiktions-Leck.
3. **Gesellschaftswert-Delta in die Planungs-Karte** ziehen (die T1-Anzeige aus dem
   Ergebnis-Modal am Entscheidungspunkt wiederverwenden).

**S1 — Eine vertikale Scheibe „Keil", end-to-end (die Konzept-Probe):**
Statt 143 Aktionen blind umzuschreiben, **eine** Auftragslinie vollständig richtig machen:
- Auftrag **Keil** + seine Episoden (`ep_bruecke`, `ep_denkmalstreit`, `ep_sami_gruppe`).
- Die ~12–15 Aktionen, die diese Episoden + die Keil-Beats tatsächlich nutzen, zu einem
  **kuratierten, gut geschriebenen, dosiert freigeschalteten** Set machen.
- Wenn die Episode live ist, bietet das Spiel **ihre** Aktionen an (in-Fiktion gerahmt),
  nicht den ganzen Katalog.
- Narrative dieser Aktionen auf den **guten Ton** heben (Vorbild `11.x`/Episoden).
→ Ergebnis: ein durchgängig stimmiger Keil-Strang als **fühlbarer Beweis**, dass „aus
Nutzersicht zur richtigen Zeit" funktioniert. Danach Wahl/Zweifel nach demselben Muster.

**S2 — Katalog verschlanken (Aktions-*Familien*):**
Near-Duplikate zu **Familien mit Stufen** zusammenfassen (z. B. eine „Bot-Netz"-Linie
mit Ausbaustufen statt 5 Einzelaktionen). Ziel ~143 → **~70–80** distinkte Aktionen, jede
trägt ihr Gewicht. Senkt „zu kompliziert" und halbiert die Schreibarbeit aus S3.

**S3 — Ton-Politur des Rests (`1.x`–`8.x`):**
Alle verbleibenden Aktionen auf den guten Ton heben (eine vivide Zeile: *was es mit
Menschen macht*, Wendung im Satz), Jargon-Labels glätten/glossieren. Reihenfolge: was
S1/S2 nicht schon erledigt haben.

**S4 — Dosiertes Öffnen sauber verankern:**
Freischaltung an **Auftrag/Episoden/Lage** binden (nicht an Jahre), sodass der
Möglichkeitsraum sich erzählerisch öffnet (Wright: erst den Sandkasten lesbar machen, dann
erweitern).

---

## 6. Worked Examples (damit die Richtung *fühlbar* ist, nicht nur beschrieben)

### 6a. Aktions-Ton: vorher → nachher (Vorschläge, nicht final)
| ID | vorher (Lehrbuch) | nachher (Vorschlag, guter Ton) |
|---|---|---|
| 2.1 Bot-Netzwerk aufbauen | „Wir brauchen automatisierte Verstärkung. Tausende Accounts, die unsere Botschaften verbreiten." | „Tausend Stimmen auf Knopfdruck. Über Nacht steht eine Menge, die es nie gab — und sie schreit lauter als jede echte." |
| 8.2 Person diskreditieren | „Rufmord. Wahre, halbwahre oder erfundene Geschichten, die den Ruf zerstören." | „Beweisen müssen wir nichts — nur oft genug wiederholen. Am Ende bleibt nicht die Lüge hängen, sondern der Zweifel an ihr." |
| 1.5 Social Listening | „Was sagen die Leute online? Welche Themen bewegen sie?" | „Erst zuhören. Wo es brodelt — Wut, Angst, Einsamkeit —, da setzen wir später an." |
| 1.3 5Ds-Framework anwenden | „Dismiss, Distort, Distract, Dismay, Divide …" | Label → „Die fünf Hebel ansetzen"; Narr → „Abstreiten, verdrehen, ablenken, einschüchtern, spalten — welcher passt zu heute?" |

### 6b. Ein kuratierter Tag (so soll sich „zur richtigen Zeit" anfühlen)
*Heute, Keil-Auftrag, Episode `ep_bruecke` ist reif:*
> **Morgenbriefing.** Marina: *„Gallia, die geteilte Stadt. Die Brandt will vermitteln.
> Geben Sie mir den Riss, ich gebe Ihnen den Graben."*
> **Das Terminal zeigt heute drei Wege** (statt 11 Analyse-Karten oder 100 Büro-Karten):
> - *Den leisen Keil setzen* (11.13 Loyalitätsfalle) — wirkt tief, fällt kaum auf.
> - *Den lauten Graben ziehen* (11.14 „Die gegen uns") — schnell, aber sichtbar.
> - *Den Kulturkampf anheizen* (7.2) — breit, unspezifisch.
> Jede Karte zeigt **ihre** Wirkung (Polarisierung ▲, Risiko ▲). Die Wahl ist die Wendung
> der Episode — kein Enzyklopädie-Scrollen.

Der volle Katalog bleibt über die Tafel als „freie Werkzeugkiste" erreichbar — für Spieler,
die improvisieren wollen. Aber die **Eingangstür ist der Anlass.**

---

## 7. Offene Owner-Entscheidungen (kein eigenmächtiger Umbau — SOUL)

1. **Richtung:** „Aktionen = Vokabular der Episoden/Beats (kuratieren)" vs. „Katalog
   behalten, nur Texte verbessern"? → **Empfehlung: kuratieren** (löst A *und* B *und* C;
   reine Text-Politur löst nur A).
2. **Das Jahres-Gate** (`ta0{year}`): War das **Absicht** (10-Jahre-Tech-Tree, bewusst
   langsam) oder ein **Unfall** der Daten-Taxonomie? → **Empfehlung: kappen.** Es ist die
   Wurzel des „falsche Zeit"-Gefühls und kollidiert frontal mit den Episoden. Wenn ein
   Progressions-Gefühl gewünscht ist, kommt es aus **Auftrag/Episoden**, nicht aus Jahren.
3. **Zwei Flächen:** Terminal + Tafel **zusammenlegen** oder Rollen härten (Terminal =
   „Anlass von heute", Tafel = „freie Werkzeugkiste")? → **Empfehlung: Rollen härten**
   (kleiner Eingriff, löst den IA-Bruch ohne großen Umbau). Das ist die seit `HANDOFF`
   offene „#6-tief"-Frage — dieses Review gibt ihr eine Antwort.
4. **Katalog-Größe:** Near-Duplikate zu Familien zusammenfassen (143 → ~70–80)? →
   **Empfehlung: ja**, in S2.

> **Vorschlag fürs nächste Paket:** S0 (sofort, risikolos) + **S1 (vertikale Keil-Scheibe)**
> als Konzept-Probe. Wenn sich *ein* Strang „richtig" anfühlt, skalieren wir das Muster auf
> Wahl/Zweifel und ziehen S2/S3 nach. So machen wir das Spiel Strang für Strang „nie
> langweilig", ohne 143 Karten auf Verdacht umzuschreiben.
