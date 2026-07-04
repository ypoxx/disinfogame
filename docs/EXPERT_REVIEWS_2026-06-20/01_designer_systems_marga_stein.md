# Designer-Persona 1 — Marga Stein (Systems/Sandbox)

> Reale Verankerung: Sid Meier („interesting decisions" / Non-Domination), Will Wright
> („toy first", Possibility Space), MDA-Framework (Hunicke/LeBlanc/Zubek 2004).
> **Methoden-Hinweis der Persona:** Web-Suche war in ihrer Sitzung nicht verfügbar; sie
> stützt die Prinzipien auf etabliertes Fachwissen und hat **keine** wörtlichen Zitate
> realer Personen erfunden. Zitate in „…" sind ihre eigene In-character-Stimme über dieses Spiel.

## Gesamteindruck
Exzellentes „Spielzeug" (Broadcast-/Publikums-Reflex) + ungewöhnlich ehrliches Über-Ich
(QUALITAETSMERKMALE operationalisiert Meier/Wright). Kernproblem: **zwei Ökonomien, die sich
nicht ansehen** — die sichtbare (Gesellschaftswerte) und die verborgene Sieg-Ökonomie
(`obj_destabilize`/`trustErosionValue`). Die guten Entscheidungen (Beats/Episoden) sind
„balance-neutral" zur Sieg-Achse → von der einzigen Entscheidung entkoppelt, die gewinnt.

## Befunde
- **B1 — Zwei entkoppelte Ökonomien.** `StoryEngineAdapter.ts:4459-4483`: `obj_destabilize`
  läuft nur über `trustErosionValue`; Beats/`completeEpisode` koppeln `vertrauen` bewusst NICHT
  (`DecisionBeats.ts:27-30`). Beat „Stadtrat" bewegt Polarisierung +18, Sieg um 0.
  *„Ein Spielzeug mit zwei Steuerrädern, und nur das langweilige ist mit den Rädern verbunden."*
- **B2 — ~88/143 Aktionen sofort offen** (Possibility-Space-Dump). S0 sortiert/hebt nur hervor
  (`ActionPanel rank()`), dosiert nicht. *„Das ist nicht der Sandkasten, das ist der ganze Baumarkt am ersten Tag."*
- **B3 — Vorschau zeigt die falsche Achse.** `previewSocietyDeltas` zeigt „Polarisierung ▲",
  HUD-Ziel ist aber „Vertrauen 100→40"; die siegrelevante Wirkung (`trustErosionValue`) steht
  nirgends auf der Karte. *„Ich zeige dem Spieler ehrlich das Tachometer — nur ist es das vom Beifahrersitz."*
- **B4 — Beat-Grammatik exzellent, aber nur 6 Beats.** `evaluateBeatGate` erzwingt Non-Domination
  automatisiert. *„Ihr habt eine perfekte Grammatik gebaut und dann sechs Sätze damit geschrieben."*
- **B5 — Vier überlagerte Zeitwährungen** (Uhr/AP/Phase/Jahre) für eine Achse.
  *„Vier Uhren an der Wand, und keine sagt mir, wie spät es im Spiel ist."*
- **B6 — Preis kommt zu spät im Loop** (Segment-Stimmung erst im Lagebericht nach Heimweg).
  *„Die Rechnung kommt erst, wenn ich das Restaurant schon verlassen habe."*
- **B7 — Episoden-Magnitude mickrig.** `ep_bruecke.wirkt_auf` = polarisierung 5/fragmentierung 3,
  ein Beat macht +18. *„Der Roman bewegt weniger als die Randnotiz."*
- **B8 — Redundanz** (5× Bot, 6× Pseudo-Legitimität…). *„Fünf Wege, dasselbe zu tun, sind nicht fünf Entscheidungen — es ist eine Entscheidung mit Schreibfehlern."*

## Stärken
Spielzeug erstklassig (Wright „toy first"); Beat-Architektur gießt Meiers Non-Domination in einen
CI-Test; ehrliche Selbstdiagnose; S0-Fixes real; „Auftrag = Ziel, Vertrauen = Mittel" gute Ansage.

## Top-Verbesserungen
1. **V1 (höchste) — Die zwei Ökonomien koppeln:** Sieg-Fortschritt aus `auftragProgress`
   (`Auftraege.ts:135`) lesen — die Signatur-Achsen, die Beats/Episoden schon bewegen. R2 von
   „balance-neutral" zu „balance-definierend". Macht aus kostümierten echte Entscheidungen.
2. **V2 — Karten-Vorschau auf die Sieg-/Auftrags-Achse erweitern** (nach V1 trivial).
3. **V3 — Möglichkeitsraum erzählerisch dosieren** statt nur sortieren (Episode schaltet ihre Aktionen frei).
4. **V4 — Episoden-Magnitude auf Beat-Niveau heben (15–25) + Beat-Pool ausbauen.**
5. **V5 — Zeitwährungen entschlacken** (eine Handlungswährung, Rest Flavor).

## Schlussurteil
*„Ihr habt das Spielzeug und ihr habt die Entscheidungen. Verkabelt sie — und das Bauchgefühl wird zum Spielgefühl."*
Die interessanten Entscheidungen wurden gebaut und dann vom Sieg abgeklemmt, damit die Balance
ruhig bleibt. Reißt diese Wand ein — lasst die Aufträge der Sieg sein, den die Beats schon bewegen.
