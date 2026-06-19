# Prioritäten nach den Beats — was außerhalb der Beats fehlt

> In-Sitzung mit Owner geformt (2026-06-18). Status: **Plan/Sequenz**.
> Brücke: nach der Beat-Synthese (`BEAT_MUSTER_KATALOG.md`) zurück zum
> Spielerinnen-Feedback geschaut, um zu prüfen, was *außerhalb* der Beats fehlt.
> Quellen: `PLAYTEST_PERSONAS_2026-06-15.md` (+ `_TEIL2`),
> `ORCHESTRATION_FEEDBACK.md`, `REVIEW_2026-06-15_GAME_STRUCTURE.md` (30 Befunde,
> destilliert).

## Befund
Die Beats sind die narrative Wirbelsäule — aber die Tester scheitern *davor*, in
Minute 10–30. Kernaussage: **nicht zu schwer, sondern verstecktes Getriebe + zu
viel zu früh + Feedback-Lücken + Reflexion end-lastig.** Außerhalb der Beats fehlt
*mehr* als bei den Beats selbst.

## Die fünf Themen
| # | Thema | Kern | Schwere | berührt Beats? |
|---|---|---|---|---|
| **1** | Getriebe unsichtbar | Kausalkette Aktion→Gesellschaftswerte nicht sichtbar; Barometer-Zielrichtung unklar; GESELLSCHAFT-Leiste nur auf Taste H; Lagebild zeigt Werte+Auftrag nicht | 🔴 dominant (Retention-Killer) | indirekt |
| **2** | Erste halbe Stunde verliert | zwei Aktionsflächen/Verben; Auftragswahl zu früh/kontextlos; Tag-1 ohne Führung; 4-schichtiges Zeitmodell; „stille Tage" | 🔴 hoch (Cliff Min 10–30) | nein |
| **3** | Totes/kaputtes Gerüst | **Episoden schließen nie ab**; EndingSystem (8×7) toter Code; Advisor empfiehlt nicht-existente Aktionen; Budget-Vorzeichen-Bug; Heimweg/Tageswechsel teils blockiert; doppelte NPC-Reaktion | 🟠 billig + hohe Wirkung | **ja** |
| **4** | Inhalts-Konsistenz | **NPC-Rollenrutsch** (Ambient ≠ Steckbrief); Topics schwach; reale Symbole leaken | 🟠 mittel | **ja, direkt** |
| **5** | Reflexion zu spät | Belohnung sofort, Schaden/Gegenseite erst im End-Report → trainiert erst den Reiz | 🟠 didaktischer Kern | **ja** |

## Brücken zur Beat-Arbeit
- **T5 ↔ „Gegenseite = Immunsystem" (Befund C.2):** Wenn der Schaden als langsame
  Resilienz *früher/spürbarer* zurückkommt statt erst im End-Report, kippt die
  Didaktik vom Reiz zur Reflexion. Konzeptionelle Lösung steht — nur nicht im
  Loop verdrahtet.
- **T4 ↔ Beat-NPCs:** Beat #4 (Loyalitätsprobe) baut auf Katja=Feld /
  Alexei=Techniker. Weicht deren Ambient-Stimme von der Rolle ab, bricht der Beat.
  Symbol-Leaks widersprechen `SYMBOLS_AUDIT.md`.

## Empfohlene Sequenz (Owner-bestätigt)
**T3 → T1 → T5**, T4 eingezogen, wo es Beats direkt trägt.

**Warum T3 zuerst:**
1. Bestes Wirkung/Aufwand — nichts Neues bauen, Vorhandenes zum Feuern bringen.
2. Erlöst die Beat-Arbeit: Episoden = autorierte Beats, die wegen eines Bugs *nie
   auszahlen* (`wirkt_auf` + Lernmoment feuern nicht); EndingSystem = ungenutzte
   Ausgangs-Vielfalt.
3. Niedriges Risiko, verifizierbar (Bugs haben klare richtige Antworten).
4. Fundament für T1/T5 — keine bessere Sichtbarkeit auf einen kaputten Loop setzen.

**Disziplin:** jeden gemeldeten Bug **erst im Code verifizieren** (Befunde stammen
aus einem Review, nicht aus eigener Sichtung), dann fixen, dann Durchlauf prüfen.

## T3 — Verifikations-Ergebnis (2026-06-18, am Code geprüft)
**Kernbefund:** Das Review (06-15) war *stale* — Commit **#84** lieferte Review
*und* P0-Fixes zusammen; die Playtest-Berichte kamen erst danach. Die Review-Bugs
sind also bereits gefixt; offen sind nur die *playtest*-stämmigen Punkte.
Baseline: `tsc` sauber, **391 Tests grün**.

| ID | Bug | Quelle | Status |
|---|---|---|---|
| T3.1 | `completeEpisode()` nie live aufgerufen | REVIEW §B1 | ✅ bereits gefixt (#84, `P0-1`: Live-`useEffect`) |
| T3.2 | EndingSystem (8×7) toter Code | REVIEW §B1 | ✅ bereits gefixt (#84, `P0-2`: `checkGameEnding` + Wiring-Test) |
| T3.3 | Advisor empfiehlt nicht-existente IDs | REVIEW §B3 | ✅ bereits gefixt (#84, `P0-5`: aus verfügbaren Aktionen + Fallback) |
| T3.4 | Budget-Vorzeichen: „+$3K" grün bei sinkendem Saldo | PLAYTEST A/B | ✅ gefixt + **live bestätigt** (Modal zeigt Budget rot „$-3K" statt grün „+$3K") |
| T3.5 | Heimweg/Tageswechsel teils blockiert | PLAYTEST TEIL2 §2 | ✅ **diagnostiziert + gefixt** (StrictMode-Remount-Desync; Guard im Cleanup freigegeben) |
| T3.6 | Doppelte NPC-Reaktion (Modal + Pop-up-Box) | PLAYTEST A | ✅ **Option C umgesetzt + live bestätigt** (NPC-Porträt + Reaktion im Ergebnis-Modal, Pop-up entfällt) |

**Nebenbefund:** #84 hat auch T1/T2-Punkte erledigt — `P0-3` (Lagebild zeigt jetzt
GESELLSCHAFT+AUFTRAG; deckt #30 + Teil von #25) und `P0-4` (P2-Operationszentrale
auffindbar; #19). Das verkleinert T1/T2 spürbar.

**Live-Durchlauf** (Playwright, `scripts/t3-runthrough.mjs`): App bootet sauber
(nur 1 benigner externer Cert-Fehler, nicht aus den Änderungen). T3.4 + T3.6 im
laufenden Spiel bestätigt (Screenshot `runs/t3-runthrough/06_RESULT_MODAL.png`).
Kosmetik (erledigt): die Budget-Zeile rendert jetzt „-$3K" statt „$-3K"
(Vorzeichen vor dem `$`).

## T3.5 — Diagnose + Fix (StrictMode-Remount-Desync)
**Root Cause:** Tagesende **aus der Büro-Ansicht** → `requestEndDay` schaltet auf
`viewMode='building'` → `BuildingView` mountet frisch. In React StrictMode (Dev,
`main.tsx`) wird das als Mount→Unmount→Remount simuliert: (1) Mount startet
`goTo('lobby')`; (2) der simulierte Unmount bricht den Lauf via `useNavigator`-
`cancelRun` ab; (3) der Remount findet `walkingHomeRef.current` **noch true**
(Ref überlebt) und überspringt `goTo` → `onArrivedHome` feuert nie → Tageswechsel
hängt. Vom Erdgeschoss ist man bereits in der Gebäude-Ansicht → kein Remount → ein
sauberer Lauf → funktioniert (deckt sich mit dem Playtest-Befund „nur von der
Büro-Etage"). Nebenfund: `useNavigator.goTo` schluckt `planRoute`-Fehler still
(`catch { return }`) — latenter Footgun, hier aber nicht die Ursache (Route
Büro→Lobby ist gültig).
**Fix:** `BuildingView`-Heimweg-Effekt gibt den Guard im **Cleanup** frei
(`walkingHomeRef.current = false`), sodass der abgebrochene Heimweg auf dem Remount
sauber neu startet. `tsc` sauber, 391 Tests grün, Build ok.
**Verifikation:** Logik + grüne Checks. Laufzeit-Bestätigung braucht den **Dev-
Server** (StrictMode; `vite preview` = Production zeigt den Bug nicht) — optionaler
Spot-Check: Büro → „Tag beenden" → Tagesfazit erscheint.

## T1 — Fortschritt: #5 Kausalkette sichtbar (erledigt)
Das Ergebnis-Modal (`ActionFeedbackDialog`) zeigt jetzt den Block **„GESELLSCHAFT —
WIRKUNG DIESER AKTION"**: die unmittelbaren Gesellschaftswert-Deltas der Aktion
(z. B. Polarisierung ▲ +3, Fragmentierung ▲ +2) + Vertrauen, nur bei tatsächlicher
Wirkung. Engine: neues `ActionResult.societyChanges` via Vorher/Nachher-Schnappschuss
um `applyActionEffects` (`StoryEngineAdapter`). Damit ist die Kausalkette
Aktion→Werte am **Entscheidungspunkt** sichtbar (lag bisher nur in der Konsole /
verzögert im Lagebericht). Mechanisch ehrlich: Analyse-/Vorbereitungs-Aktionen
bewegen die Werte nicht → kein Block. Engine-verifiziert (2.1/3.1/9.3 liefern Deltas,
1.1 nicht) + Live-Durchlauf bestätigt (`runs/t3-runthrough/06_RESULT_MODAL.png`).
tsc/391 Tests/Build grün.

**T1 abgeschlossen** (2026-06-18) — die Sichtbarkeits-Lücke ist geschlossen:
- **#5** Kausalkette Aktion→Werte: „GESELLSCHAFT — WIRKUNG DIESER AKTION" im Modal.
- **#14** Barometer-Zielrichtung: „AUFTRAG"-Block im MissionPanel zeigt je
  Signatur-Achse die Richtung (▲ hochtreiben / ▼ drücken) + jetzt→Ziel + Fortschritt.
- **#27** Wirksamkeit: „WIRKSAMKEIT X%"-Block mit Herleitung (Basis 50% +
  Ziel-Affinität); `effectiveness` jetzt auf `ActionResult`.
- **#24** Segment-Stimmung: „PUBLIKUM — STIMMUNG IM LAND" im Ergebnis-Modal
  (statt erst im Tagesbericht).

Kontrolle: `tsc`/391 Tests/Build grün · Live-Durchlauf bestätigt (#5/#27 visuell,
#14/#24 DOM) · unabhängiger Code-Review (1 kleiner Anzeige-Fehler „(siehe unten)"
gefunden + behoben).

**Bewusst als Folgeschritt (nicht in T1):** Gesellschaftswert-**Trendgraph** über
Zeit (#14-Teil) — braucht Historie-Sammlung pro Phase (analog `trustHistory`).
