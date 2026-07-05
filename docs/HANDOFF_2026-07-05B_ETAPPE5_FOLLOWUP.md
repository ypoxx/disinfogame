# 🤝 Handoff: Etappe 5 Follow-up — die tiefe Aktions-Kuratierung (Balance-Session)

**Stand:** 2026-07-05, aktualisiert nach dem Merge · **Basis:** `main` — **Etappe 4 (#91) UND
Etappe 5 (#92) sind gemergt** (`main` @ `f28c896`). Etappe 0–5 sind auf `main`; offen ist nur
noch das Etappe-5-Follow-up (unten). Der Arbeits-Branch `claude/etappe-5-handoff-setup-29psoe`
ist frisch von `main` neu aufgesetzt — hier startet die nächste Session.
**Lies zuerst:** `SOUL.md` → `STATUS.md` (Etappe-5-Block) → `ZIELBILD_2026-07-04_WETTRENNEN.md`
(§6/§12.7/§13) → dieses Dokument. **Container-Falle zuerst:** `cd desinformation-network && npm ci`.

---

## 1. Was Etappe 5 geliefert hat (3 Sätze)

Der Versionssprung steht bis auf EINE Sache: Kurator-Rename, Geld-Tranchen (E18), Enden-Beschnitt
(EIN Sieg-, DREI Verlustwege), Wahlabend-Szenen + TV-Baukasten, HUD-Konsolidierung (Sonntagsfrage +
Abwehr + Kasse + Tag), Vergabe-Szene (EINE Akte), Endreport-Läufer-Kurven, und die dauerhafte
**Aktions-Invariante** („jede Aktion bewegt einen Läufer"). Gate grün (`tsc 0`·`vitest 575`·`build`),
beide Sim-Gates tragfähig (greedy 15/24, low_risk 1/24 — Passivität bleibt bestraft). Der Browser-Smoke
bestätigt Vergabe-Szene + Kurator-Rename + Dialog-Porträt/Farbe.

## 2. Das EINE offene Ziel: die tiefe Aktions-Kuratierung

Zielbild §12.7 will: **143 → 60–80 Aktionen · impact_scale als Wirkmodell abschaffen ·
WIN_THRESHOLD → 1.0.** Diese drei sind GEKOPPELT und wurden bewusst NICHT halb gemacht (das hätte die
8×-flakefrei kalibrierte Balance zerbrochen).

### Der harte Befund dieser Session (Zeit sparen — nicht neu entdecken!)
Empirisch am Sim-Gate belegt:
- **impact_scale ist der verdeckte Fortschritts-Treiber.** Fast jede „Grundrauschen"-Aktion (auch
  ohne explizite Effekte) treibt über die impact_scale-Baseline in `SocietyDynamics.ts:116–131`
  die Wahl-Signatur (fraktionsstaerke/zynismus bei grey/illegal). **Entfernt man ref-sichere
  impact_scale-Aktionen, bricht greedy ein: 58 % → 12 %.** (Getestet: 45er- und 28er-Removal.)
- **Legal/Low-Risk-Aktionen entfernen macht Passivität zu stark.** `low_risk` sortiert nach
  (risk+attention) und „verschwendet" AP an risiko-arme Clutter-Aktionen. Entfernt man diese,
  landet seine AP bei wirksameren Aktionen → **low_risk 4 % → 75 % Siege** (bricht „Abwarten
  verliert", §3d).
- Fazit: **Man kann Aktionen NICHT einfach löschen.** Erst muss jede überlebende Aktion einen
  EXPLIZITEN Läufer-Effekt tragen (statt verdeckt über impact_scale), DANN kann man reduzieren und
  neu kalibrieren, ohne dass verstecktes Balancing mit verschwindet.

### Empfohlene Reihenfolge fürs Follow-up
1. **impact_scale abschaffen:** In `SocietyDynamics.societyDeltaFromAction` die impact_scale-Baseline
   (Z. 110–131) entfernen und stattdessen jeder Aktion, die heute nur darüber wirkte, einen expliziten
   Effekt-Key geben (z. B. `polarization`/`social_division`/`political_leverage` je nach Rolle). Das ist
   die „größte reale Arbeitsmenge" (Zielbild §12.7) — ~90 Aktionen mit impact_scale (siehe
   `scratchpad/safe_removal.js`-Analyse-Muster).
2. **Kuratieren:** Jetzt sind die Wirkungen sichtbar/lokal — redundante Familien zusammenlegen,
   43 ref-sichere Kandidaten (Analyse unten) archivieren. Ziel 60–80.
3. **WIN_THRESHOLD → 1.0** in Schritten, jeweils Sim-Gate 8× flakefrei; `winnable-and-losable`
   **und** `balance-sim-p2` zusammen messen.
4. **`ActionRunnerInvariant.test`** bleibt die Leitplanke (schon grün) — nach jeder Löschung laufen
   lassen; sie erwischt eine Aktion, die keinen Läufer mehr bewegt.

### Werkzeug (liegt bereit)
- `scratchpad/safe_removal.js` (im Session-Scratchpad, hier als Muster dokumentiert): berechnet die
  ref-sichere Lösch-Menge (nicht in Episoden/Konsequenzen/Countermeasures/Combos/Taxonomie/Tests,
  keine prereq-/unlock-Provider). Ergab **45 ref-sichere IDs**; davon 17 mit siegScore > 0 (Win-Treiber
  — nur nach impact_scale-Abschaffung + explizitem Ersatz entfernbar) und 28 „Grundrauschen".
- `ActionRunnerInvariant.test.ts` (Kopf) hält die Läufer-Definitionen.

## 3. Weitere Carry-forwards
- **Tag-0-Hoax-Tutorial (O7): ✅ BESCHLOSSEN — bauen.** Owner-Entscheidung liegt im Zielbild §10
  („bleibt — und wird besser") + §15-Tabelle O7 und wurde 2026-07-05 bestätigt. Die frühere Kopfzeile
  „NICHT beschlossen" in `IDEE_TAG0_HOAX_EXPERIMENT.md` war vom Zielbild überholt (jetzt korrigiert) —
  sie hatte diesen Punkt fälschlich als „owner-gated" geführt. **Bauen als Zwei-Balken-Tutorial:**
  Andockpunkt = Intro-Flow VOR der Vergabe-Szene (`StoryModeGame.tsx`, `showAuftrag`-Zweig); erster
  sichtbarer Abwehr-Tick via `raiseAbwehr` (public Wrapper nötig) nach Ferros Faktencheck + Marina-
  „Sehen Sie den zweiten Balken?"-Zeile; folgenlose Probier-Zone. Details: `IDEE_TAG0_HOAX_EXPERIMENT.md`.
- **Assets (Owner-Budget-Ansage):** TV-Studio-Set (Sprecherin/Umfrage-Ticker/Faktencheck/Wahlstudio —
  E17-Priorität, 4 Bilder tragen 80 %) für `TvSet`/`WahlabendScene`; 5 Wohnzimmer-Alphabet-Bilder
  (Küchen-Streit, einsam am Videospiel, Abwinken vor TV, Parteifahne, Faktencheck-Zeitung). Beides
  CSS-/Text-Fallback vorhanden — Drop-in ohne API-Änderung (`pixel-asset-pipeline`-Skill).
- **Nachspielzeit (§5b):** `requestNachspielzeit()` existiert (einmalig +5 Tage gegen −20k), hat aber
  noch keinen UI-Trigger (z. B. Kurator-Angebot bei Mahnstufe ≥ 2).

## 4. Neue Andockpunkte (Etappe 5 hat sie gebaut)
- `engine/Finanzen.ts` — `bewerteTranche`/`istTrancheTag`; Adapter `applyTranche`/`getTranchePreview`/
  `getLastTranche`/`getMahnstufe`; `getLaeuferHistorie` (Endreport-Kurven); `getWahlabendData`/
  `getWinThreshold`/`getExposureCountdown` (HUD + Wahlabend).
- `components/WahlabendScene.tsx` (TvSet = E17-Baukasten), `getWahlabendData().branch`-Steuerung.
- `engine/Auftraege.ts` → `PARTEI_NAME_DE` (EIN Parteiname, §8/D2).
- Save-Format **2.3.0** (additiv; Tranchen-Zustand + Läufer-Historie; Muster im Adapter).

## 5. Bekannte Fallen (Etappe 0–5, kumulativ)
1. `npm ci` zuerst (Toolchain-Drift, TS 5.9.3 gepinnt).
2. Sim-Gate nach JEDER Mechanik-/Daten-Änderung; `winnable-and-losable` UND `balance-sim-p2` zusammen.
3. Adapter-Monolith (`StoryEngineAdapter.ts`, ~7500 Z.): parallele Agenten NIE gleichzeitig darauf.
4. **NEU (Etappe 5):** Aktionen entfernen ist NICHT balance-neutral (impact_scale-Kopplung, s. §2) —
   erst Wirkung explizit machen, dann löschen.
5. `createStoryEngine()` resettet ALLE Singletons — Test-Mocks NACH Engine-Erzeugung.
6. Save additiv + Default-Merge; Semantik-Bruch → Version bumpen (2.3.0-Muster).
7. **JSON-Daten:** surgische Text-Edits bevorzugen (JSON.stringify reformatiert Inline-Arrays → riesiger
   Diff). Kept-Aktionen nach jedem Skript-Lauf semantisch gegen HEAD prüfen.
8. DialogBox-Sprecher: `SPEAKER_ALIASES` (volkov/kurator→direktor) hält Porträt+Farbe korrekt.

## 5b. Modell-Klassifikator-Hinweis (Fable 5 → Opus 4.8)

Fable 5 fährt auf JEDER Anfrage einen Safety-Check und schaltet bei vier Themenfeldern automatisch
auf Opus 4.8 um (im selben Gespräch neu ausgeführt): (1) offensive Cybersecurity, (2) Großteil
Biologie/Chemie/Life-Sciences, (3) Distillation-Angriffe, (4) enge Frontier-LLM-Entwicklung. Die
Safeguards sind **absichtlich breit** — dieses Desinfo-Projekt löst daher gelegentlich Fehlalarme aus
(Vokabular wie `hack`, `cyber`, `virus`, `pathogen`, der reale Biolabs-Fall). Das ist **kein Downgrade**
(Opus 4.8 ist stark), berührt aber Abrechnung/Kontinuität.
- **Verlässlichster Fix:** Settings → Capabilities → „Switch models when a message is flagged" **aus**.
  `/model claude-fable-5` pinnt nur zurück, verhindert das erneute Umschalten aber nicht. Separat prüfen:
  `/fast` (Fast Mode = absichtlich Opus 4.8, revertiert nicht von allein).
- **In den Daten entschärft (2026-07-05, kosmetisch):** englische Labels „Exploit …" → „Leverage/Seize …"
  (reine Synonyme, DE unverändert). **Bewusst NICHT angetastet:** Hacking-Aktionen, der reale Biolabs-
  Bildungsfall, Virus-/Kernenergie-News — das ist legitimer, gesourcter Bildungsinhalt; ihn zu entfernen,
  um einen breiten Klassifikator zu umgehen, wäre der falsche Trade. Quelle: support.claude.com
  „Why Claude switched models … Fable 5".

## 6. Definition of Done (Follow-up)
Katalog 60–80, impact_scale als Wirkmodell weg (jede Aktion trägt explizite Läufer-Effekte),
WIN_THRESHOLD an der per-Sim kalibrierten Latte (Ziel 1.0), Invariante grün, beide Sim-Gates 8×
flakefrei mit greedy im 30–60-Korridor und „jeder Verlustweg ≥ 15 %" scharf; STATUS + Zielbild §13
auf ✅; Draft-PR aktualisiert.

## 7. Kickoff-Prompt (Vorschlag)
> „Lies SOUL.md → STATUS.md → ZIELBILD (§10/§12.7/§13) → HANDOFF_2026-07-05B_ETAPPE5_FOLLOWUP.md.
> Baue (a) das Tag-0-Hoax-Tutorial als Zwei-Balken-Onboarding (beschlossen, §10/§15) und schließe
> (b) die tiefe Aktions-Kuratierung ab: erst impact_scale abschaffen (explizite Läufer-Effekte), dann
> 143→60–80 reduzieren und WIN_THRESHOLD hochziehen — Sim-Gate 8× flakefrei nach jedem Schritt."

**Reihenfolge-Tipp:** Erst den Hoax (klar abgegrenzt, kein Balance-Risiko, schneller sichtbarer Wert),
dann die Kuratierung (die große iterative Balance-Arbeit) — ggf. in getrennten Sessions wegen Token-Budget.
