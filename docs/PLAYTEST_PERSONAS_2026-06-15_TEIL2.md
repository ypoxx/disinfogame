**Status:** Referenz (Playtest-Bericht, Teil 2)
**Aktualisiert:** 2026-06-15
**Scope:** Story — erweiterter Spielverlauf (Tag 1–~15) + Fokusgruppe + Experten-Runde
**Build:** v0.9.0 · f6f7659
**Methode:** 1 realer Spiel-Lauf (Playwright/Chromium) als Faktenbasis + System-Verifikation (Daten/Code)

# Teil 2 — Erweiterter Spielverlauf, Fokusgruppe & Experten-Reflexion

> Fortsetzung von `PLAYTEST_PERSONAS_2026-06-15.md`. Anti-Erfindungs-Disziplin beibehalten:
> `■ OBJEKTIV` (belegt) · `□ SUBJEKTIV` (Haltung) · `⚠ ARTEFAKT-KORRIGIERT`.
> Da der Tageswechsel im Container fragil ist (s. u.), ist Teil 2 **ein** realer Kurz-Lauf
> **plus System-Erdung**: Was über 10–15 Tage *passiert*, ist aus den echten Trigger-Daten
> (`episodes.json`, `CrisisMomentSystem`, `soundDirector.ts`, `corridorDecor.ts`, `Gegenseite`)
> abgeleitet — klar getrennt von direkt Beobachtetem.

## 1. Der zentrale Spielverlauf-Befund: die „Schwellen-Wüste"

`■ OBJEKTIV (Daten/Code).` Fast der **gesamte Reichtum** des Spiels ist an Schwellenwerte gekoppelt:

| System | Was früh passiert | Schwelle, ab der es „lebt" | Quelle |
|---|---|---|---|
| **Musik** | dauerhaft `music_calm_archive` | Risiko ≥ 33 → `music_gameplay`; ≥ 66 → `music_tense` | `soundDirector.ts:46-49` |
| **Episoden** (Wirbelsäule, 10) | nur `ep_bruecke` (always) verfügbar | `polarisierung ≥ 40`, `informationslast ≥ 30`, `election_announced` | `episodes.json` (ausloeser) |
| **Krisen** (8) | keine | Risiko-/Bedingungs-/Zufallstrigger | `CrisisMomentSystem.checkForCrises` |
| **Gegenseite** | „Keine nennenswerte Gegenwehr — noch" | steigt mit Aufmerksamkeit/Risiko/verbrannten Verbreitern | `Gegenseite.ts` |
| **Publikum** | 7 von 8 Segmenten „ruhig" (nur „Die Abgehängten: wütend") | reagiert auf Werte-Vektor | Lagebericht Tag 1 (real beobachtet) |

**Real beobachtet:** Nach einem Tag mit vorsichtigem Spiel standen Polarisierung ~25, Info-Last ~20,
Risiko 0–1 % — **unter allen Schwellen**. Der Lagebericht lautete wörtlich „**ein stiller Tag**".

**Schlussfolgerung (die alle Personas treffen wird):** Wer **nicht** früh und gezielt eskaliert,
erlebt eine **flache, ruhige, repetitive Frühphase** — gleiches ruhiges Musikthema, „stille"
Tagesberichte, keine Episoden, keine Krisen, keine Gegenseite. Das Spiel **lehrt aber nicht**, dass
Eskalation der Motor ist, und macht die **Schwellen nicht sichtbar**. Das ist der wichtigste
Spielverlauf-Befund: nicht „zu schwer", sondern **ein verstecktes Zündschloss**.

## 2. Animationen & Kleinelemente (gefragt)

- **Animationen** `■`: Tag/Nacht-Himmel (7 Stops), Jahreszeiten (Start JAN = Winter; Schnee/Regen),
  Avatar-Lauf, Tür-/Fahrstuhl-Animation, Broadcast „ON AIR"-Puls, Uhr-Puls ab 17:00. Solide Stimmung.
- **Kleinelemente** `■` (`corridorDecor.ts`): **wirklich state-reaktiv** und mit trockenem Witz —
  Reißwolf-Spruch ↔ Risiko, Kaffeeküche („Zichorie, Ersatz … Sanktionen schmeckt man") ↔ Wirtschaft,
  welke↔grüne Pflanze ↔ Moral, „Volksbrause"-Etikett ↔ Auftrag, „Mitarbeiter des Monats" (gleiches
  Gesicht, wechselnder Deckname). **Aber:** Sie stecken in den **Korridoren**, die der Spieler beim
  Raum-zu-Raum-Klicken kaum bewusst betritt → **hohe Qualität, niedrige Entdeckbarkeit.**
- **Doppelbefund Tageswechsel** `⚠→■`: Der Heimweg vor dem Lagebericht (~6 s, ohne Indikator) ist
  nicht nur „kein Feedback" — von der **Büro-Etage** aus ließ sich der Tag in dieser Sitzung
  **mehrfach gar nicht abschließen** (Avatar lief nicht los, kein Bericht). Vom Erdgeschoss aus
  klappte es. **→ Der Tageswechsel ist positions-/timing-abhängig fragil.** (Stark genug, um es als
  echten Fluss-Blocker zu führen — Owner sollte es im echten Browser gegenprüfen.)

## 3. Personas nach ~15 Tagen (lautes Denken, verdichtet)

### Lena (19)
> „Tag 3, 4, 5… ich mach immer dasselbe: paar Karten anklicken, *Feierabend*, *stiller Tag*, weiter.
> Die Musik ändert sich nie. Passiert das auch mal **was**? Ich hab das Gefühl, ich mach's falsch,
> aber das Spiel sagt mir nicht, was. … Ach, in den Gängen gibt's lustige Sachen — der Kaffeeautomat,
> die welke Pflanze. Süß. Aber ich stolper da nur zufällig rein. … Ehrlich: nach 15 Minuten würd ich
> normal aufhören, weil ich nicht weiß, ob ich *gewinne*."

`■` „immer dasselbe / Musik ändert sich nie / stiller Tag" — exakt der Schwellen-Befund.
`■` „lustige Sachen in den Gängen, nur zufällig" — Kleinelemente real, aber schlecht entdeckbar.
`□` „würd aufhören" — Retention-Einschätzung, plausibel, aber persona-abhängig.

### Marcus (34)
> „Jetzt versteh ich's: das ist ein **Schwellen-Spiel**. Ich muss Polarisierung über 40 prügeln, dann
> springt die Veen-Episode an, dann kommen Krisen, dann wird die Musik bedrohlich. Als ich aggressiv
> spielte, **kam** das auch — Episode *Die Brücke* von Marina, dann *Veen*. Das ist eigentlich **gut**
> designt. Mein Problem: Das Spiel hat mir das **nie gesagt**. Drei Tage hab ich brav analysiert und
> nichts passierte. Ein Strategiespiel muss seinen Motor offenlegen — sonst optimiere ich ins Leere.
> Und: Ich will einen **Trend** sehen (Vertrauen über Zeit), nicht nur den Tageswert."

`■` Schwellen-Mechanik + Episode-Trigger (`episodes.json`: ep_bruecke always, ep_veen polaris≥40).
`■` „kein Trend sichtbar" — es gibt `trustHistory` intern, aber kein Verlaufs-Graph im HUD.
`□` „eigentlich gut designt" — Wertung, gestützt durch die echte Trigger-Logik.

### Dr. Sabine (47)
> „Über die Tage kippt meine Sorge: Erst ist es harmlos-ruhig, fast langweilig. Sobald ich aber
> eskaliere, **kommen** die guten Momente — die *Faktencheckerin Ferro*, die ich ‚nur müder machen'
> soll, der *Denkmalstreit*. **Das** ist didaktisch stark, weil es konkret und menschlich wird. Aber
> es ist paradox: Das Spiel **belohnt mit Bedeutung, wenn ich skrupelloser werde**. Genau das ist die
> Lektion über Desinformation — nur müsste das Spiel diese Pointe **bewusst** setzen, nicht als
> Nebenwirkung einer Schwelle. Und die Reflexion (Methoden-Atlas) kommt erst am Ende."

`■` Episoden werden mit Eskalation freigeschaltet (Ferro: informationslast≥30; Denkmal etc.).
`■` `lernmoment_id` je Episode → End-Report; Reflexion end-lastig.
`□` „didaktisch stark / Pointe bewusst setzen" — pädagogische Haltung (vertretbar, kein Defekt).

## 4. Fokusgruppe (nach längeren, abgeschlossenen Sitzungen)

*Moderatorin (M), Lena (L), Marcus (Mc), Sabine (S). Beisitzend: Usability (Petra), Markt (Hendrik),
Design (Yuki).*

**M:** Erster Eindruck nach mehreren Stunden?
**L:** „Der Anfang ist cool — das Gebäude, der Direktor, ich versteh sofort: ich bin die Böse in so
'ner Trollfabrik. Aber dann verlier ich mich. Drei Tage passiert nix, und ich weiß nie, ob ich
vorne liege."
**Mc:** „Sehe ich anders, weil ich's geknackt hab — man muss eskalieren. Aber Lena hat recht: Das
Spiel versteckt seine eigene Regel. Das ist kein Schwierigkeitsgrad, das ist eine **Bringschuld** des
Spiels, die nicht eingelöst wird."
**S:** „Und mir ist wichtig: Wenn es ‚lebendig' wird, wird es **gut** — die Episoden sind klein,
konkret, menschlich. Frau Ferro, die erschöpfte Faktencheckerin — das bleibt hängen. Das ist die
Seele des Spiels. Die liegt aber hinter einer Wand aus stillen Tagen."
**L:** „Ja! Und die kleinen Witze in den Fluren — Kaffeeautomat mit ‚Zichorie' — die liebe ich,
finde sie aber nur aus Versehen."
**Mc:** „Zwei Sachen haben mich konkret geärgert: ich seh nicht, wie eine Aktion mein Ziel bewegt,
und es gibt zwei verschiedene Aktionslisten. Ich hab zehn Minuten gebraucht, um zu kapieren, dass
Terminal und Korkbrett verschiedene Dinge sind."
**S:** „Mich ärgert eher: Die Belohnung fürs Manipulieren ist sofort und glatt, der Schaden bleibt
abstrakt, bis der Tagesbericht kommt. Für ein Bildungsspiel ist das die heikelste halbe Stunde."
**M (zu Lena):** Hättest du weitergespielt?
**L:** „Ehrlich? Nur, wenn mir früh einer sagt ‚mach DAS als Nächstes' und ich seh, dass mein Balken
sich bewegt. Das Morgenbriefing an Tag 2 macht genau das — aber da war ich fast schon raus."
**Mc:** „Unterm Strich: starkes Fundament, verstecktes Getriebe."
**S:** „Starke Seele, zu spät sichtbar."
**L:** „Schöner Anfang, zähe Mitte."

## 5. Experten-Runde (unter sich, nach der Fokusgruppe)

**Petra (Usability):** „Drei Stimmen, ein Muster: *Sichtbarkeit des Systemzustands* (Nielsen
Heuristik 1) ist verletzt — und zwar an drei Stellen gleichzeitig: (a) kein sichtbarer Bezug
Aktion→Ziel, (b) keine sichtbaren Schwellen/kein Trend, (c) toter Tageswechsel ohne Feedback. Lenas
‚mach ich's falsch?' ist die klassische Folge. Das ist kein Geschmack, das ist messbar."
**Yuki (Design):** „Und es ist tragisch, weil das *Inhaltsdesign exzellent* ist. Die Episoden sind
genau das, was das Spiel besonders macht — situierte Dilemmata mit echten Gesichtern. Aber sie sind
‚emergent-kuratiert' hinter Werteschwellen versteckt. Wir haben einen **Onboarding-Funnel gebaut, der
die beste Zutat zuletzt serviert.** Will Wrights Regel: erst ein lesbares Spielzeug, dann Tiefe — hier
ist es umgekehrt."
**Hendrik (Markt):** „Aus Retention-Sicht ist die ‚stille Mitte' der Killer. Die kritischen Minuten
für narrative Strategiespiele sind 10–30. Wenn in Minute 10–20 ‚nichts passiert' und der Spieler
seinen Fortschritt nicht sieht, brechen genau die Casual-Narrativen (Lena-Typ) ab — und das ist bei
einem **Bildungsspiel** die wichtigste Zielgruppe, weil sie eben *nicht* schon überzeugt ist."
**Petra:** „Wobei der *Einstieg* stark ist — Titel, Direktor, Auftragswahl, die Coachmarks im Büro.
Das dürfen wir nicht kaputt-reparieren. Das Problem ist die Brücke vom Einstieg zum ersten echten
Erfolgserlebnis."
**Yuki:** „Genau. Ich würde nicht Inhalt hinzufügen, sondern den vorhandenen **früher zünden** und
**lesbar** machen. Eine einzige Episode (ep_bruecke ist ja `always`) gleich am ersten Tag aktiv
anbieten — als geführtes Erstes-Mal — und daran die Kausalkette zeigen."
**Hendrik:** „Und einen sichtbaren Fortschritt: ein Barometer mit Zielmarke und ‚du bist hier'. Plague
Inc. macht das vor — du siehst die Infektionskurve *immer*."
**S (zieht später nach):** „Wenn ihr die Episode nach vorn holt, holt die **Reflexion** gleich mit —
ein kurzer Methoden-Hinweis *nach* der ersten Episode, nicht erst im End-Report. Sonst trainiert ihr
20 Minuten lang nur den Reiz."
**Petra:** „Konsens? (1) Getriebe offenlegen, (2) beste Zutat früher, (3) Einstieg bewahren."
**Yuki/Hendrik:** „Konsens."

## 6. Der Kritiker — Lösungen aus anderen Spielen

*Tomasz, erfahrener Kritiker, bringt Muster, die anderswo funktionieren:*

- **Plague Inc. / Pandemic-Schule → Sichtbarer Zielgraph.** Ein **immer sichtbarer Barometer-Verlauf**
  mit Zielmarke (Vertrauen 100→40, „du bist bei 92"). Löst Marcus' „kein Trend" und Lenas „lieg ich
  vorne?".
- **Papers, Please → Tages-Ritual mit Bilanz.** Das Spiel *teilt* schon die DNA. Dort ist der
  Tagesabschluss **sofort** und **konsequenzenreich** (Miete, Familie). Lehre: Den Heimweg **kürzen/
  überspringbar** machen und den Lagebericht **mit spürbaren Kosten** aufladen, nicht „stiller Tag".
- **Reigns / Card-Driven → Eine Entscheidung, sofort sichtbare Vektoren.** Für die Aktionskarten:
  **erwartete Wirkung als Pfeile** (Polarisierung↑, Risiko↑) *vor* der Wahl. Löst „1 NPC-Bonus sagt mir
  nichts".
- **Frostpunk → Eskalations-Telegrafie + Moral-Preis.** Frostpunk *kündigt* kommende Härten an und
  macht den moralischen Preis sicht- und fühlbar. Übertragung: **Schwellen telegrafieren**
  („Noch 8 Punkte Polarisierung, dann meldet sich ein Kontakt") und den Gesellschaftsschaden **im
  Loop** zeigen, nicht erst im Debrief (Sabines Punkt).
- **This War of Mine / Orwell → Ethik im Loop.** Orwell lässt dich *selbst* überwachen und konfrontiert
  dich *sofort* mit Folgen. Genau das Modell für ein Desinfo-Bildungsspiel: der Preis wächst sichtbar,
  während du optimierst.
- **Cultist Simulator / Blue Prince → Entdeckbares verdienen.** Wenn ihr Komplexität spät öffnen wollt
  (Korkbrett!), macht das **Öffnen selbst zum Moment** (Freischalt-Feier), statt 100 Karten an Tag 1.
- **Slay-the-Spire-Onboarding → Erst Teilmenge, dann Katalog.** Tag 1: 3 Aktionen, ein Wert. Wachstum
  als Belohnung.

## 7. Priorisierte Reflexion — verbessern, aber Stärken schützen

### ✅ Stärken, die NICHT verloren gehen dürfen
1. **Sofort lesbare Fiktion + Atmosphäre** (Titel → Direktor → Gebäude): <2 min Verständnis. `■`
2. **Das „Spielzeug": Aktion → Broadcast → Publikumsreaktion** — sofort befriedigend. `■`
3. **Die Episoden als Seele** — konkrete, menschliche Dilemmata mit echten Gesichtern. `■`
4. **State-reaktive Kleinelemente + Stimmung** (Kaffeeküche, Pflanze, Jahreszeiten, Musik-Logik). `■`
5. **Verantwortungsvoller Rahmen** (Disclaimer, fiktive Symbole, Pflicht-Debrief, Methoden-Atlas). `■`
6. **Starke Auftrags-Rahmung** „Vertrauen = Mittel, Auftrag = Ziel". `■`

### 🔴 P0 — Fluss-Blocker (zuerst)
- **Tageswechsel reparieren & rückmelden:** Heimweg überspringbar + Indikator; kein stiller No-Op;
  von jeder Etage zuverlässig. *(Begründung: blockiert das Kern-Loop, real reproduziert.)*
- **Getriebe offenlegen (Onboarding der Regel):** Tag-1-Briefing + Hinweis „Eskalation ist der Motor";
  **ep_bruecke am ersten Tag aktiv** als geführtes erstes Dilemma.
- **Aktion→Ziel sichtbar:** Barometer-Delta-Pfeile auf jeder Karte; Vorzeichen/Farbe-Bug („+$3K" grün)
  fixen.

### 🟡 P1 — Lesbarkeit & Fluss-Qualität
- **Barometer-Verlauf mit Zielmarke** dauerhaft im HUD (Plague-Inc-Muster).
- **Schwellen telegrafieren** („noch X bis Episode/Krise/Gegenseite").
- **Zwei Aktionsflächen** zusammenführen oder klar trennen; ein Verb-Set.
- **Kleinelemente entdeckbar machen** (z. B. beim Durchqueren kurz hervorheben).
- **Doppelte NPC-Reaktion** mergen; **Default-Name ≠ „Direktor"**; Begrüßungs-Kontrast.

### 🟢 P2 — Tiefe & Bildungswert
- **Ethik in den Loop:** Gesellschaftsschaden sichtbar mitwachsen lassen; Mini-Reflexion nach der
  ersten Episode (nicht nur End-Report).
- **Komplexität dosiert öffnen:** Korkbrett als verdiente Freischaltung; Aktionskatalog gestaffelt.
- **Zeitmodell entschlacken:** Uhr/AP/Phase/Jahre auf möglichst *eine* Handlungs-Währung reduzieren.

### Eine-Zeile-Verdikt (Teil 2)
**Das Spiel hat eine exzellente Seele (Episoden) und ein exzellentes Spielzeug (Broadcast) — aber es
versteckt beides hinter einer „stillen Mitte" und einem unsichtbaren Getriebe. Die wirksamste
Maßnahme ist nicht mehr Inhalt, sondern: den vorhandenen Inhalt früher zünden und den Systemzustand
sichtbar machen — ohne den starken Einstieg anzutasten.**
