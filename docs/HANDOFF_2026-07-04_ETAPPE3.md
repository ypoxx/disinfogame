# 🤝 Handoff: Etappe 3 „Immunsystem sichtbar" — Kickoff für die nächste Session

**Stand:** 2026-07-04, Ende der Etappe-2-Session · **Branch:** `claude/gracious-keller-g43bu3` (PR #89)
**Lies zuerst:** `SOUL.md` → `STATUS.md` (Etappen 0–2 ✅) → `ZIELBILD_2026-07-04_WETTRENNEN.md` (§3/§7/§13)
→ dieses Dokument (konkreter Arbeitsplan). Gate: `tsc 0 · vitest 482 · build` — alles grün.

---

## 1. Wo wir stehen (3 Sätze)

Sieg = Auftrag „Die Wahl" (Min-Regel über die Signatur, `VictorySystem.ts`), die 40-Tage-Wahlkampagne
läuft (`electionDay`, 1 Tag = 1 Phase), R2 ist gefallen, `createStoryEngine()` isoliert jede Partie
(alle Singleton-Resets). Das Sim-Gate (`winnable-and-losable.test.ts`) hält die Invariante
„gewinnbar UND verlierbar" (zuletzt 23/13). **Bekannt und gewollt offen:** Die Pro-Strategie-Balance
ist invertiert (greedy 0 %, low_risk 100 %) — sie wird ERST in dieser Etappe getunt, weil das
Immunsystem Risiko/Ertrag neu formt.

## 2. Ziel der Etappe (Zielbild §3/§7)

Der zweite Rennläufer wird sichtbar und bekommt Zähne: **ABWEHR 0–100** (befördertes
`wehrhaftigkeit`) mit Stufen 25/50/75, gespeist aus Lärm (Risiko/Aufmerksamkeit werden Zuflüsse),
Verteidiger-Maschinerie und Maschen-Wiederholung. Verlust „Das Land hält stand" bei Abwehr 100.
Dormante Systeme werden eingesteckt. Nacht-Transparenz im Tagesfazit.

## 3. Arbeitspakete (Agenten-Zuschnitt + Modell-Empfehlung)

| # | Paket | Inhalt | Modell |
|---|-------|--------|--------|
| A | **ImmuneSystem-Modul** (Kern) | Neues `story-mode/engine/ImmuneSystem.ts` (pur, testbar, wie VictorySystem): ABWEHR-Wert aggregiert aus (a) Lärm-Zuflüssen (Aktions-risk/attention-Kosten), (b) `StoryActorAI`-Verteidigern (`getTrustRegeneration`, `armsRaceLevel`, Spawns), (c) Maschen-Wiederholung („Gepatcht"-Events, `NarrativeMemory`-Themen als Andockpunkt), (d) leichtes Zeitgrundrauschen. Stufen-Übergänge 25/50/75 als Events. Adapter: `wehrhaftigkeit` speist/spiegelt die ABWEHR; neuer Verlustweg in `VictorySystem.evaluateEnd` (`branch: 'immune'` bei Abwehr ≥ 100, VOR timeout). | stark (inherit) |
| B | **CountermeasureSystem einstecken** | Adapter-API existiert (grep `checkForCountermeasures` / `resolveCountermeasure` — fertig, null Aufrufer). An Stufen 25/50/75 kuratierte Maßnahme feuern (Prebunking cm24, Plattform-Sperre, Task-Force); Reaktions-Optionen auf 2–3 vereinheitlichen (kontern = Geld / aussitzen = +Abwehr / ablenken = Risiko). Hook + Modal (BetrayalEventModal als UI-Vorbild). | stark (inherit) |
| C | **Zähne scharfschalten** | (1) `isActionDisabledByAI` in getAvailableActions/executeAction durchsetzen („Kanal gesperrt", X Tage grau); (2) leeren `reach_reduction`-Case im Adapter implementieren (gedämpfte Wirkung); (3) `BetrayalEvent.effects` anwenden; **Verrat = +15-Abwehr-Ereignis** statt eigener Game-Over (`apparatus`-Branch in VictorySystem entfällt → 3 Verlustwege: immune/Wahlabend/Enttarnt — Zielbild §4/D4). | sonnet |
| D | **UI: der zweite Läufer** | ABWEHR-Balken im HUD (neben Sonntagsfrage; Stufen-Marken 25/50/75); Nacht-Transparenz im Tagesfazit („Über Nacht: Institutionen holen X zurück" — Daten liefert A); Gegenseite-Vignetten (`Gegenseite.ts`) bekommen Stufen-Attribution. Kühl, Stempel-Ästhetik (E8). | sonnet |
| E | **Balance-Tuning + Bänder scharfschalten** | Mit dem Gate iterieren bis: greedy 30–60 % Siege, low_risk deutlich <100 % (das Immunsystem bestraft auch Passivität: Zeitgrundrauschen + Regeneration), Verlustwege gemischt (Ziel: jeder ≥15 % der Niederlagen — `TARGET_BANDS` im Gate aktivieren, soweit tragfähig). `WIN_THRESHOLD` ggf. Richtung 1.0 anheben, wenn erreichbar. | stark (inherit) |

**Orchestrierung:** A zuerst (B–D docken an ABWEHR an). B/C/D danach parallel (disjunkte Dateien:
B = CountermeasureSystem+Modal, C = StoryActorAI/Betrayal/VictorySystem, D = HUD-Komponenten).
E zum Schluss zentral (ein Agent oder Hauptsession, iterativ mit dem Gate). Review-Pass (Diff-Review,
Explore-Agent, read-only) vor dem Commit. Jede Teillieferung: `tsc` + `vitest` + `build` grün.

## 4. Bekannte Fallen (aus Etappe 0–2 gelernt — Zeit sparen!)

1. **`createStoryEngine()` resettet ALLE Singletons** (Etappe 2). Tests, die Singletons mocken,
   müssen NACH `startGame()`/Engine-Erzeugung mocken (Beispiel-Fix: `DecisionBeatFlow.test.tsx`).
2. **Sim-Gate zuerst laufen lassen** (`npx vitest run src/story-mode/tests/winnable-and-losable.test.ts`),
   nach JEDER Mechanik-Änderung — es hat in Etappe 1 die Unerreichbarkeit (0/36) sofort gefangen.
   Log-Flut filtern: `| grep -vE "DisInfo|Cost Reduction|discount ×"`.
3. **Risiko/Aufmerksamkeit → Abwehr-Zuflüsse:** Enttarnung (Risiko ≥ 85, `exposed`-Branch) bleibt
   eigener Verlustweg — NICHT mit dem Abwehr-100-Verlust verschmelzen; der Ermittler-Countdown
   erscheint situativ (Zielbild §4). Die HUD-Konsolidierung (Risiko raus aus dem HUD) ist Etappe 5.
4. **`wehrhaftigkeit` wird von `societyFormulaStep` heute GESENKT** (Zynismus-Kopplung) und von der
   Resilienz-Erholung leicht gehoben — beim Befördern zur ABWEHR diese Formeln umlenken/entfernen,
   sonst zieht die Gesellschafts-Drift den Gegner-Balken runter (falsches Vorzeichen im Rennen!).
5. **`auftragProgress`-Signaturen:** keil nutzt `fragmentierung`, wahl `fraktionsstaerke` — falls E
   Werte streicht/faltet (Zielbild §6: informationslast/reformfaehigkeit streichen, fragmentierung
   falten), MUSS die Keil-Signatur mitmigriert werden (Sieg-Check hängt daran). Streichung ist
   optional in dieser Etappe — nur bei Bedarf.
6. **Session-Ökonomie:** Subagenten sind in der Vorsession am Nutzungs-Limit gestorben. Agenten mit
   klaren, engen Briefings starten (Datei-Listen, keine breite Exploration); Sonnet für UI/mechanische
   Pakete; Berichte kompakt anfordern.

## 5. Definition of Done (Etappe 3)

- ABWEHR sichtbar im HUD, Stufen-Events feuern, Countermeasures + Sperren + reach_reduction +
  Verrats-Folgen wirken mechanisch.
- Verlustwege = 3 (immune / Wahlabend / Enttarnt); Verrat = Abwehr-Schub.
- Gate grün MIT verschärften Bändern (mindestens: kein Profil 0 %/100 %; Ziel: greedy 30–60 %,
  ≥2 Verlustwege je ≥15 %).
- `tsc 0 · vitest · build` grün; STATUS.md + Zielbild §13 (Etappe 3 ✅ + Carry-forwards) aktualisiert;
  Commit + Push auf `claude/gracious-keller-g43bu3`.

## 6. Kickoff-Prompt für die neue Session (Vorschlag)

> „Lies SOUL.md → STATUS.md → ZIELBILD_2026-07-04_WETTRENNEN.md → HANDOFF_2026-07-04_ETAPPE3.md
> und starte Etappe 3 nach dem dortigen Arbeitsplan (Pakete A–E, Agenten wie empfohlen)."
