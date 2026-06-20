# Designer-Persona 3 — Ingrid Sólveig (Management / Dilemma / Survival)

> Verankerung: 11 bit studios — Frostpunk („the city must survive" + moralischer Preis im
> Gesetzbuch), This War of Mine (Konsequenz sitzt im Charakter-Zustand), Tropico. **Web blockiert.**

## Gesamteindruck
Mehr echtes Survival-/Dilemma-Handwerk drin, als das Team sich zutraut. ABER: die schönsten Dilemmata
(Beats/Episoden) sind per R2 von der einzigen Sieg-Achse entkoppelt → „Dilemma und Sieg leben in
getrennten Räumen. Ein Frostpunk-Gesetz, das die Stadt nicht näher ans Überleben/Sterben bringt, ist Flavor."

## Befunde
- **B1 — Dilemmata zahlen nicht auf die Existenz ein.** `applyDecisionBeatOption`/`completeEpisode` überspringen `vertrauen` (R2). *„Wenn meine schwerste Entscheidung des Tages nicht eine Zacke näher an Sieg ODER Untergang rückt, habe ich eine Vignette angeklickt."*
- **B2 — Druck-Bogen real, aber zu mild & zu spät.** `PACING_GRACE_PHASES=42` (3,5 J.), gedeckelt. *„Drei Jahre Schonzeit, dann ein Nieselregen. In Frostpunk kommt der Sturm, und du weißt, dass er kommt, vom ersten Tag an."*
- **B3 — Gegenseite drückt nur erzählerisch.** `Gegenseite.ts` ist reine Anzeige, kein Rückkanal. *„Ein Immunsystem, das nur kommentiert, ist Dekoration."*
- **B4 — Verlieren ist real & mehrgleisig (vorbildlich).** `checkGameEnd`: Enttarnung/Apparat zerfällt/Mittellos/Zeit. *„Mehrere Wege zu scheitern, jeder mit eigener Erzählung — das ist Frostpunk-DNA."*
- **B5 — Konsequenz-Timing halb gelöst:** operativer Preis sofort (`playOperation`), gesellschaftlicher Preis zu abstrakt/spät. *„Der Preis dafür, eine Gesellschaft zu vergiften, ist eine Zahl, die langsam steigt. Das trainiert den Reiz, nicht das Gewissen."*
- **B6 — Dirigent gut, aber nur 6 Beats, je einmalig.** *„Sechs große Entscheidungen für ein ganzes Jahrzehnt? Nach Tag 6 dirigierst du Stille."*
- **B7 — Gesellschaftswerte sieg-irrelevant (toter Anzeige-Layer-Risiko).** Auftrags-Achsen bestimmen nur die End-Tonalität. *„Ein wunderschönes Dashboard der Gesellschaft — und den Hauptschalter woanders gelassen."*
- **B8 — „falsche Zeit"/Onboarding** erkannt, S0 angegangen; Fundament wackelt noch.

## Stärken
Mehrgleisige erzählte Niederlagen; Non-Dominanz als testbares Gate; Episoden-Prosa (Ferro „gut UND
erschöpft"); ehrliche Selbstdiagnose; Stochastik richtig dosiert (Nebel).

## Top-Verbesserungen
1. **Dilemmata an die Existenz koppeln — kontrolliert:** nicht direkt Vertrauen, sondern die **Auftrags-Signatur als ZWEITE Sieg-/Verlustbedingung** (Keil → Polarisierung-Schwelle); „hohler Sieg" als echtes schlechteres Ende mit Mechanik.
2. **Gegenseite mechanisch machen:** awareness dämpft Effektivität, baut Resilienz, verschließt laute Episoden-Wege.
3. **Druck-Bogen verschärfen + telegrafieren:** Schonzeit 42→~18–24; angekündigte Stürme („in 2 Quartalen eine Untersuchungskommission").
4. **Beat-Repertoire 6→15–20 + reaktive Wiederauflagen** (Katalog Teil D abarbeiten).
5. **Gesellschaftlichen Preis in den Loop** (ein Segment kippt sichtbar JETZT).

## Schlussurteil
*„Eine Gesellschaft, die nur im Abspann blutet, ist eine Kulisse. Lasst sie jetzt zurückschlagen — dann
habt ihr aus einem klugen Lehrstück ein Spiel gemacht, das man nicht weglegt."* Es fehlt der Blutkreislauf,
der die guten Organe verbindet.
